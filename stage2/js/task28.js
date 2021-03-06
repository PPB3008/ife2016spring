/* BUS */
var BUS = {
    // 当前飞船队列
    ships: [null, null, null, null],
    // 增加飞船对象到队列中
    addShip: function (ship, index) {
        this.ships[index] = ship;
    },
    // 接收传来的信息
    receive: function (signal) {
        var self = this,
            timer;

        // 用信号长度来区分是从行星发来的信号还是飞船广播的信号
        if (signal.length == 16) {
            // 将飞船广播的信号传递给行星
            DC.receive(signal);
        } else {
            // 将行星发来的信号广播给每个飞船
            timer = setInterval(function () {
                var ships = self.ships,
                    ship;

                console.log(signal + " signal publishing");

                if(self.publish(signal)) {
                    // 接收到删除命令则将飞船从飞船队列删除
                    if(signal.slice(4) == "0010") {
                        ships[parseInt(signal.slice(0, 4), 2).toString(10) - 1] = null;
                    }

                    clearInterval(timer);
                    return true;
                }
            }, 300);
        }
    },
    // 广播命令到飞船队列中所有飞船
    publish: function (signal) {
        // 丢包率10%
        var randomNum       = Math.floor(Math.random() * 100),
            loseProbability = 10;

        if(randomNum >= loseProbability) {
            for(var iter in this.ships) {
                if(this.ships[iter] && this.ships[iter] instanceof Ship) {
                    this.ships[iter].receive(signal);
                }
            }
            console.log(signal + " signal has been published to the target ship !");
            return true;
        } else {
            console.log(signal + " signal lost, keep trying !");
            return false;
        }
    }
};


/*飞船 */
var Ship = function (index) {
    // 编号(1-4)
    this.index = index;
    // transform角度
    this.rotate = 0;
    // 能源
    this.power = 1000;
    // 飞船速度(deg)
    this.speed = 2;
    // 能源消耗速度
    this.consume = -5;
    // 能源恢复速度
    this.restore = 2;
    // 飞船状态,0为停止1为飞行
    this.state = 0;
    // 飞船DOM对象
    this.ship;
    // 控制台对象
    this.controlBar;
    // 动画
    this.interval;
    // 广播
    this.publisher;
};

// 创建自身
Ship.prototype.createSelf = function (signal) {
    var earth      = document.querySelector(".earth"),
        cmd        = document.querySelector(".cmd"),
        ship       = document.createElement("div"),
        controlBar = document.createElement("div"),
        number     = document.createElement("span"),
        startBtn   = document.createElement("button"),
        stopBtn    = document.createElement("button"),
        destroyBtn = document.createElement("button"),
        self       = this;

    ship.className       = "ship" + this.index;
    ship.innerHTML       = parseInt(this.power/10, 10) + "%";
    number.innerHTML     = "对" + this.index + "号进行操作: ";
    startBtn.innerHTML   = "开始飞行";
    stopBtn.innerHTML    = "停止飞行";
    destroyBtn.innerHTML = "销毁";

    controlBar.appendChild(number);
    controlBar.appendChild(startBtn);
    controlBar.appendChild(stopBtn);
    controlBar.appendChild(destroyBtn);
    earth.appendChild(ship);
    cmd.appendChild(controlBar);

    this.ship       = ship;
    this.controlBar = controlBar;
    this.speed      = signal.speed;
    this.restore    = signal.restore;
    this.consume    = signal.consume;

    // 开始广播自身状态
    this.publisher  = setInterval(function () {
        self.Publisher(false);
    }, 1000);
};

// 动力系统
Ship.prototype.fly = function () {
    if(1 == this.state) {
        return false;
    }
    this.state = 1;

    var self = this;

    clearInterval(this.interval);
    this.interval = setInterval(function () {
        if(self.power < 5) {
            self.stop();
            return ;
        }

        self.power += (self.consume + self.restore);
        if(self.power > 1000) {
            self.power = 1000;
        }
        self.ship.innerHTML = parseInt(self.power/10, 10) + "%";
        self.rotate += self.speed;

        if(self.rotate >= 360) {
            self.rotate = 0;
        }

        self.ship.style.webkitTransform = "rotate("+self.rotate+"deg)";
        self.ship.style.mozTransform    = "rotate("+self.rotate+"deg)";
        self.ship.style.msTransform     = "rotate("+self.rotate+"deg)";
        self.ship.style.oTransform      = "rotate("+self.rotate+"deg)";
        self.ship.style.transform       = "rotate("+self.rotate+"deg)";
    }, 80);
};

Ship.prototype.stop = function () {
    if(0 == this.state) {
        return false;
    }
    this.state = 0;

    var self = this;

    clearInterval(this.interval);
    this.interval = setInterval(function () {
        if(self.power > 980) {
            self.power = 1000;
            self.ship.innerHTML = "100%";
            clearInterval(self.interval);
            return ;
        }
        self.power += self.restore;
        self.ship.innerHTML = parseInt(self.power/10, 10) + "%";
    }, 80);
};

// 自毁系统
Ship.prototype.destroySelf = function () {
    var earth = document.querySelector(".earth");

    // 从页面中删除
    earth.removeChild(this.ship);
    // 停止广播
    clearInterval(this.publisher);
    this.Publisher(true);
};

// 信号接收与处理系统
Ship.prototype.receive = function (signal) {
    signal = this.Adapter(signal, false);

    if(signal.index != this.index) {
        return false;
    }

    var command = signal.command;

    switch (command) {
        case "fly":
            this.fly();
            break;
        case "stop":
            this.stop();
            break;
        case "destroy":
            this.destroySelf();
            break;
        default:
            console.log("command rejected");
            break;
    }
};

Ship.prototype.Adapter = function(signal, encryption) {
    var result = {},
        patch  = "0000",
        index  = "",
        state  = "",
        power  = "",
        commands = ["fly", "stop", "destroy"];

    if (encryption) {
        // 将自身编号状态和能量编码成16位信号用来发送
        result = "";

        index = signal.index.toString(2);
        patch = patch.substring(0, patch.length - index.length);
        index = patch + index;
        patch = "0000";

        state = signal.state.toString(2);
        patch = patch.substring(0, patch.length - state.length);
        state = patch + state;
        patch = "00000000";

        // power是0-1000, 8位二进制数最大表示128, 所以要除以8
        power = Math.floor(signal.power / 8).toString(2);
        patch = patch.substring(0, patch.length - power.length);
        power = patch + power;

        result = index + state + power;
    } else {
        // 将收到的8位二进制命令解码成十进制数(字符串格式)
        result.index = parseInt(signal.slice(0, 4), 2).toString(10) - 0;
        result.command = commands[parseInt(signal.slice(4), 2).toString(10) - 0];
    }

    return result;
};

// 广播系统
Ship.prototype.Publisher = function(isDestroyed) {
    var signal = {
        index: this.index,
        // 0010(1*0+2)为停止,0001(-1*1+2)为飞行,1100(12)为即将销毁
        state: isDestroyed ? 12 : -1 * this.state + 2,
        power: this.power
    };

    BUS.receive(this.Adapter(signal, 1));
};

/* 指挥官 */
var Commander = function () {};

// 发布指令
Commander.prototype.command = function (signal) {
    BUS.receive(this.Adapter(signal));
};

// 信号接收与处理
Commander.prototype.Adapter = function (signal) {
    var transition = {},
        patch      = "0000";

    signal.index = signal.index.toString(2);
    patch = patch.substring(0, patch.length - signal.index.length);

    transition["fly"]     = "0000";
    transition["stop"]    = "0001";
    transition["destroy"] = "0010";

    return patch + signal.index + transition[signal.command];
};

/* 行星上的数据处理中心 */
var DC = {
    // 处理监视屏幕
    viewer: {
        screen: document.querySelector(".screen"),
        states: ["飞行中", "漂浮中"],
        refresh: function (signal) {
            var trs = this.screen.querySelectorAll("tr"),
                tds = trs[signal.index].querySelectorAll("td");

            tds[3].innerHTML = this.states[signal.state - 1] || "已销毁";
            tds[4].innerHTML = parseInt(signal.power / 10, 10) + "%";

            if(!this.states[signal.state - 1]) {
                tds[1].innerHTML = tds[2].innerHTML = tds[4].innerHTML = "--";
            }
        }
    },
    // 信号接收与处理系统
    Adapter: function (signal) {
        var index = parseInt(signal.substring(0, 4), 2).toString(10) - 0,
            state = parseInt(signal.substring(4, 8), 2).toString(10) - 0,
            power = parseInt(signal.substring(8, 16), 2).toString(10) * 8;

        return {
            index: index,
            state: state,
            power: power
        };
    },
    receive: function (signal) {
        this.viewer.refresh(this.Adapter(signal));
    }
};

(function () {
    var commander = new Commander(),
        cmd       = document.querySelector(".cmd");

    addHandler(cmd, "click", function (event) {
        var btn          = getTarget(event),
            cmdBar       = btn.parentNode,
            cmd          = document.querySelector(".cmd"),
            index        = -1,
            commands     = ["fly", "stop", "destroy"],
            speedTypes   = {"2": "无动力", "4": "巡航", "8": "高速"},
            restoreTypes = {"2": "慢速", "3": "快速", "0": "光能永久"},
            screenTrs    = document.querySelector(".screen").querySelectorAll("tr"),
            radios1      = cmd.querySelectorAll("fieldset")[0].querySelectorAll("input"),
            radios2      = cmd.querySelectorAll("fieldset")[1].querySelectorAll("input"),
            speed,
            consume;

        if(btn.id == "createBtn") {
            // 获取被选中的radio
            for(var iter = 0, len = radios1.length; iter < len; iter++) {
                if(radios1[iter].checked) {
                    speed = parseInt(radios1[iter].value, 10);
                    break;
                }
            }
            for(var iter = 0, len = radios2.length; iter < len; iter++) {
                if(radios2[iter].checked) {
                    consume = parseInt(radios2[iter].value, 10);
                    break;
                }
            }

            // 创造新飞船
            for(var iter = 0; iter < 4; iter++) {
                if(!BUS.ships[iter]) {
                    ship = new Ship(iter+1);
                    ship.createSelf({
                        speed: speed,
                        restore: consume == 0 ? 2 * speed : consume,
                        consume: -2 * speed
                    });
                    BUS.addShip(ship, iter);
                    screenTrs[iter+1].querySelectorAll("td")[1].innerHTML = speedTypes[speed];
                    screenTrs[iter+1].querySelectorAll("td")[2].innerHTML = restoreTypes[consume];
                    console.log("create new ship");
                    break;
                }
            }

        } else if (btn.tagName == "INPUT") {
            console.log("the type of ship has been changed");
        } else if (btn.tagName == "BUTTON") {
            // 根据index向BUS发送不同指令
            [].forEach.call(cmdBar.querySelectorAll("button"), function (tempBtn, tempIndex) {
                if(btn == tempBtn) {
                    index = tempIndex;
                }
            });

            // 如果点击删除按钮，则删除按钮组
            if(index == 2) {
                cmd.removeChild(btn.parentNode);
            }
            commander.command({
                index: parseInt(cmdBar.querySelector("span").innerHTML.substr(1, 1), 10),
                command: commands[index]
            });
            console.log(commands[index] + " command sent from commander");
        } else {
            console.log("keep working...");
        }
    });
})();
