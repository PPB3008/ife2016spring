(function() {
    var treeWalker = new TreeWalker,
        btns       = document.querySelectorAll("input"),
        preBtn     = btns[0],
        postBtn    = btns[1],
        searchBtn  = btns[3],
        root       = document.querySelector(".root");

    addHandler(preBtn, "click", function() {
        treeWalker.preOrder(root);
        treeWalker.animation();
    });
    addHandler(postBtn, "click", function() {
        treeWalker.postOrder(root);
        treeWalker.animation();
    });
    addHandler(searchBtn, "click", function() {
        var keyword = document.querySelector("#keyword").value;
        if(keyword == "") {
            alert("请输入关键字进行查找");
            return;
        }
        treeWalker.findText(root);
        treeWalker.isFinding = true;
        treeWalker.animation();
    });
})();

function TreeWalker() {
    this.stack = [];
    this.isWalking = false;
    this.isFinding = false;
    this.found = false;
    this.root = document.querySelector(".root");
    this.preOrder = function(node) {
        var tempNode = node.firstElementChild || null;
        this.stack.push(node);
        while(tempNode) {
            this.preOrder(tempNode);
            tempNode = tempNode.nextElementSibling;
        }
    };
    this.postOrder = function(node) {
        var tempNode = node.firstElementChild || null;
        while(tempNode) {
            this.postOrder(tempNode);
            tempNode = tempNode.nextElementSibling;
        }
        this.stack.push(node);
    };
    this.findText = function(root) {
        var son_1 = document.querySelectorAll(".son_1"),
            son_2 = document.querySelectorAll(".son_2"),
            son_3 = document.querySelectorAll(".son_3"),
            _self = this;

        this.stack.push(root);
        [].forEach.call(son_1, function(item) {
            _self.stack.push(item);
        });
        [].forEach.call(son_2, function(item) {
            _self.stack.push(item);
        });
        [].forEach.call(son_3, function(item) {
            _self.stack.push(item);
        });
    };
    this.animation = function() {
        var stack   = this.stack,
            speeder = document.querySelector("#speeder"),
            keyword = document.querySelector("#keyword").value,
            iter    = 0, timer, _self = this;

        _self.stack = [];
        if(!_self.isWalking) {
            _self.isWalking = true;
            stack[iter].style.backgroundColor = "#02FE0C";
            timer = setInterval(function() {
                if(iter == stack.length-1) {
                    stack[iter].style.backgroundColor = "#FFFFFF";
                    _self.isWalking = false;
                    _self.isFinding = false;
                    if(!this.found) {
                        alert("未找到！");
                    }
                    clearInterval(timer);
                } else {
                    ++iter;
                    stack[iter-1].style.backgroundColor = "#FFFFFF";
                    stack[iter].style.backgroundColor = "#02FE0C";
                }
                if(_self.isFinding) {
                    if(stack[iter].innerHTML.split(/\W+/g)[0] == keyword) {
                        var findNode = stack[iter];
                        this.found = true;
                        setTimeout(function() {
                            findNode.style.backgroundColor = "#FC02EA";
                        }, speeder.value * 2);
                        setTimeout(function() {
                            findNode.style.backgroundColor = "#FFFFFF";
                        }, 3000);
                    }
                }
            }, speeder.value);
        }
    };
};
