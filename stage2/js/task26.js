/* 中介者 */
var mediator = {
    // 当前飞船队列
    ships: [null, null, null, null],
    // 增加飞船对象到队列中
    addShip: function (ship, index) {
        this.ships[index] = ship;
    },
    // 接收传来的信息
    subscribe: function (signal) {
        var self = this;

        setTimeout(function () {
            var ships = self.ships,
                ship;

            console.log(signal.command + " command publishing");
            self.publish(signal);

            // 接收到删除命令则将飞船从飞船队列删除,这个语句必须要在publish之后进行。因为Ship的publish需要访问飞船队列
            if(signal.command == "destroy") {
                ships[signal.index-1] = null;
            }
        }, 1000);
    },
    // 广播命令到飞船队列中所有飞船
    publish: function (signal) {
        // 丢包率30%
        var randomNum       = Math.floor(Math.random() * 100),
            loseProbability = 30;

        if(randomNum >= loseProbability) {
            for(var iter in this.ships) {
                if(this.ships[iter] && this.ships[iter] instanceof Ship) {
                    this.ships[iter].subscribe(signal);
                }
            }
            console.log(signal.command + " command done");
        } else {
            console.log(signal.command + " command lost");
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
    // 时间间隔
    this.interval;

    // 构造函数执行，创建自身
    this.createSelf();
};

// 创建自身
Ship.prototype.createSelf = function () {
    var earth      = document.querySelector(".earth"),
        cmd        = document.querySelector(".cmd"),
        ship       = document.createElement("div"),
        controlBar = document.createElement("div"),
        number     = document.createElement("span"),
        startBtn   = document.createElement("button"),
        stopBtn    = document.createElement("button"),
        destroyBtn = document.createElement("button");

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

    this.ship = ship;
    this.controlBar = controlBar;
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
        self.power += self.restore;
        self.ship.innerHTML = parseInt(self.power/10, 10) + "%";
        if(self.power >= 1000) {
            self.power = 1000;
            clearInterval(self.interval);
            return ;
        }
    }, 80);
};

// 自毁系统
Ship.prototype.destroySelf = function () {
    var earth = document.querySelector(".earth");

    this.stop();
    earth.removeChild(this.ship);
};

// 信号接收与处理系统
Ship.prototype.subscribe = function (signal) {
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

/* 指挥官 */
var Commander = function () {};

// 发布命令
Commander.prototype.command = function (signal) {
    mediator.subscribe(signal);
};

(function () {
    var commander = new Commander(),
        cmd       = document.querySelector(".cmd");

    addHandler(cmd, "click", function (event) {
        var btn      = getTarget(event),
            cmdBar   = btn.parentNode,
            index    = -1,
            commands = ["fly", "stop", "destroy"];

        if(btn.id == "createBtn") {
            // 创造新飞船
            for(var iter = 0; iter < 4; iter++) {
                if(!mediator.ships[iter]) {
                    ship = new Ship(iter+1);
                    mediator.addShip(ship, iter);
                    console.log("create new ship");
                    break;
                }
            }
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
