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
        var _self = this;

        setTimeout(function () {
            var ships = _self.ships, ship;

            console.log(signal.command + " command publishing");
            _self.publish(signal);
        }, 1000);
    },
    // 广播命令到飞船队列中所有飞船
    publish: function (signal) {
        // 丢包率30%
        var randomNum = Math.floor(Math.random() * 100),
            loseProbability = 30;

        if(randomNum >= loseProbability) {
            if(signal.command == "create") {
                for(var i = 0; i < 4; i++) {
                    if(!this.ships[i]) {
                        ship = new Ship(i+1);
                        this.addShip(ship, i);
                        break;
                    }
                }
            } else {
                for(var iter in this.ships) {
                    if(this.ships[iter] && this.ships[iter] instanceof Ship) {
                        this.ships[iter].subscribe(signal);
                    }
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
    // 创建自身
    this.createSelf = function () {
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
    this.fly = function () {
        if(1 == this.state) {
            return false;
        }
        this.state = 1;

        var _self = this;

        clearInterval(this.interval);
        this.interval = setInterval(function () {
            if(_self.power < 5) {
                _self.stop();
                return ;
            }

            _self.power += (_self.consume + _self.restore);
            _self.ship.innerHTML = parseInt(_self.power/10, 10) + "%";
            _self.rotate += _self.speed;

            if(_self.rotate >= 360) {
                _self.rotate = 0;
            }

            _self.ship.style.webkitTransform = "rotate("+_self.rotate+"deg)";
            _self.ship.style.mozTransform    = "rotate("+_self.rotate+"deg)";
            _self.ship.style.msTransform     = "rotate("+_self.rotate+"deg)";
            _self.ship.style.oTransform      = "rotate("+_self.rotate+"deg)";
            _self.ship.style.transform       = "rotate("+_self.rotate+"deg)";
        }, 80);
    };
    this.stop = function () {
        if(0 == this.state) {
            return false;
        }
        this.state = 0;

        var _self = this;

        clearInterval(this.interval);
        this.interval = setInterval(function () {
            _self.power += _self.restore;
            _self.ship.innerHTML = parseInt(_self.power/10, 10) + "%";
            if(_self.power >= 1000) {
                _self.power = 1000;
                clearInterval(_self.interval);
                return ;
            }
        }, 80);
    };
    // 自毁系统
    this.destroySelf = function () {
        var earth = document.querySelector(".earth"),
            controlBar   = this.controlBar;

        this.stop();
        earth.removeChild(this.ship);
        controlBar.parentNode.removeChild(controlBar);
        mediator.ships[this.index-1] = null;
    };
    // 信号接收与处理系统
    this.subscribe = function (signal) {
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

    this.createSelf();
};

/* 指挥官 */
var Commander = function () {
    this.command = function (signal) {
        mediator.subscribe(signal);
    };
};

(function () {
    var commander = new Commander(),
        cmd = document.querySelector(".cmd");

    addHandler(cmd, "click", function (event) {
        var btn    = getTarget(event),
            cmdBar = btn.parentNode,
            index  = -1, commands = ["fly", "stop", "destroy"];

        if(btn.id == "createBtn") {
            // 发送创造新飞船指令
            commander.command({
                command: "create"
            });
            console.log("create command sent");
        } else {
            // 根据index向Mediator发送不同指令
            [].forEach.call(cmdBar.querySelectorAll("button"), function (tempBtn, tempIndex) {
                if(btn == tempBtn) {
                    index = tempIndex;
                }
            });
            commander.command({
                index: parseInt(cmdBar.querySelector("span").innerHTML.substr(1, 1), 10),
                command: commands[index]
            });
            console.log(commands[index] + " command sent from commander");
        }
    });
})();
