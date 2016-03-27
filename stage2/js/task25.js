(function() {
    var root = document.querySelector(".root"),
        cmd  = document.querySelector(".cmd"),
        btns = cmd.querySelectorAll("button"),
        addBtn = btns[0],
        removeBtn = btns[1],
        searchBtn = btns[2],
        text      = cmd.querySelector("input"),
        focusNode = root;

    addHandler(root, "click", function(event) {
        preventDefault(event);
        var targetNode = getTarget(event);
        triggerNode(targetNode);
    });
    addHandler(root, "dblclick", function(event) {
        preventDefault(event);
        var targetNode = getTarget(event);
        focusNode.style.borderColor = "#FFFFFF";
        focusNode = targetNode;
        focusNode.style.borderColor = "#3104FC";
    });
    addHandler(addBtn, "click", function() {
        addNode(focusNode, text.value);
    });
    addHandler(removeBtn, "click", function() {
        removeNode(focusNode);
        focusNode = root;
    });
    addHandler(searchBtn, "click", function() {
        var stack = [], timer, iter = 0, keyword = trim(text.value);
        if(!keyword) {
            alert("请输入要查找的内容");
            return false;
        }
        preOrder(root, stack);
        timer = setInterval(function() {
            var tempNode = stack[iter], findNode;
            if(trim(tempNode.innerHTML.split("<")[0]) == keyword) {
                findNode = tempNode;
                findNode.style.borderColor = "#000000";
                setTimeout(function() {
                    findNode.style.borderColor = "#FFFFFF";
                }, 3000);
                do {
                    tempNode.style.display = "block";
                    tempNode = tempNode.parentNode;
                } while (tempNode != root);
            }
            ++iter;
            if(iter == stack.length) {
                clearInterval(timer);
            }
        }, 100);
    });
})();

function triggerNode(node) {
    var sonNodes = document.querySelectorAll(".node"),
        grandsonNodes;
    [].forEach.call(sonNodes, function(item) {
        /* 如果不是直接子节点就不处理 */
        if(item.parentNode != node) {
            return ;
        }
        /*
         * 如果显示，就隐藏，并且隐藏它的所有子节点
         * 如果隐藏，就显示
         */
        if(item.style.display == "block") {
            item.style.display = "none";
            grandsonNodes = item.querySelectorAll(".node");
            if(grandsonNodes) {
                [].forEach.call(grandsonNodes, function(item) {
                    item.style.display = "none";
                });
            }
        } else {
            item.style.display = "block";
        }
    });
};

function addNode(node, text) {
    var newNode = document.createElement("div");
    newNode.className = "node";
    text = trim(text);
    if(!text) {
        text = "empty node";
    }
    newNode.innerHTML = text;
    node.appendChild(newNode);
};

function removeNode(node) {
    if(node != document.querySelector(".root")) {
        node.parentNode.removeChild(node);
    }
};

function preOrder(node, stack) {
    var tempNode = node.firstElementChild || null;
    stack.push(node);
    while(tempNode) {
        preOrder(tempNode, stack);
        tempNode = tempNode.nextElementSibling;
    }
};
