(function() {
    var treeWalker = new TreeWalker(),
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
};

TreeWalker.prototype.preOrder = function(node) {
    var tempNode = node.firstElementChild || null;
    this.stack.push(node);
    while(tempNode) {
        this.preOrder(tempNode);
        tempNode = tempNode.nextElementSibling;
    }
};

TreeWalker.prototype.postOrder = function(node) {
    var tempNode = node.firstElementChild || null;
    while(tempNode) {
        this.postOrder(tempNode);
        tempNode = tempNode.nextElementSibling;
    }
    this.stack.push(node);
};

TreeWalker.prototype.findText = function(root) {
    var son_1 = document.querySelectorAll(".son_1"),
        son_2 = document.querySelectorAll(".son_2"),
        son_3 = document.querySelectorAll(".son_3"),
        self  = this;

    this.stack.push(root);
    [].forEach.call(son_1, function(item) {
        self.stack.push(item);
    });
    [].forEach.call(son_2, function(item) {
        self.stack.push(item);
    });
    [].forEach.call(son_3, function(item) {
        self.stack.push(item);
    });
};

TreeWalker.prototype.animation = function() {
    var stack   = this.stack,
        speeder = document.querySelector("#speeder"),
        keyword = document.querySelector("#keyword").value,
        iter    = 0,
        self    = this,
        timer;

    self.stack = [];
    self.found = false;
    if(!self.isWalking) {
        self.isWalking = true;
        stack[iter].style.backgroundColor = "#02FE0C";
        timer = setInterval(function() {
            if(iter == stack.length-1) {
                stack[iter].style.backgroundColor = "#FFFFFF";
                if(self.isFinding && !self.found) {
                    alert("未找到！");
                }
                self.isWalking = false;
                self.isFinding = false;
                clearInterval(timer);
            } else {
                ++iter;
                stack[iter-1].style.backgroundColor = "#FFFFFF";
                stack[iter].style.backgroundColor = "#02FE0C";
            }
            if(self.isFinding) {
                if(stack[iter].innerHTML.split(/\W+/g)[0] == keyword) {
                    var findNode = stack[iter];
                    self.found = true;
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
