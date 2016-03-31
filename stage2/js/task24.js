(function() {
    var treeWalker = new TreeWalker,
        btns       = document.querySelectorAll("input"),
        preBtn     = btns[0],
        postBtn    = btns[1],
        searchBtn  = btns[3],
        deleteBtn  = btns[4],
        addBtn     = btns[6],
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
    addHandler(deleteBtn, "click", function() {
        if(!treeWalker.isWalking) {
            treeWalker.deleteNode();
        }
    });
    addHandler(addBtn, "click", function() {
        if(!treeWalker.isWalking) {
            treeWalker.addNode();
        }
    });
    addHandler(root, "click", function(event) {
        var target = getTarget(event);
        treeWalker.focusNode.id = "";
        treeWalker.focusNode = target;
        treeWalker.focusNode.id = "focusNode";
    });
})();

function TreeWalker() {
    this.stack = [];
    this.queue = [];
    this.isWalking = false;
    this.isFinding = false;
    this.found = false;
    this.root = document.querySelector(".root");
    this.focusNode = this.root;
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

TreeWalker.prototype.findText = function(node) {
    if(!node || node.tagName != "DIV") {
        return false;
    }
    this.stack.push(node);
    this.queue.push(node);
    this.findText(node.nextElementSibling);
    node = this.queue.shift();
    this.findText(node.firstElementChild);
};

TreeWalker.prototype.animation = function() {
    var stack   = this.stack,
        speeder = document.querySelector("#speeder"),
        keyword = document.querySelector("#keyword").value,
        iter    = 0,
        self    = this,
        timer;

    self.stack = [];
    if(!self.isWalking) {
        self.found = false;
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
                    }, speeder.value);
                    setTimeout(function() {
                        findNode.style.backgroundColor = "#FFFFFF";
                    }, 3000);
                }
            }
        }, speeder.value);
    }
};

TreeWalker.prototype.deleteNode = function() {
    if(this.focusNode && this.focusNode != this.root) {
        this.focusNode.parentNode.removeChild(this.focusNode);
    } else if (this.root.id != "") {
        alert("根节点不允许被删除");
    }
};

TreeWalker.prototype.addNode = function() {
    var nodeTag = trim(document.querySelector("#nodeTag").value), newNode;
    if(nodeTag == "") {
        alert("请输入节点内容");
    } else if (this.focusNode) {
        newNode = document.createElement("div");
        newNode.innerHTML = nodeTag;
        if(this.focusNode == this.root && !this.root.id) {
            return false;
        }
        this.focusNode.appendChild(newNode);
    }
};
