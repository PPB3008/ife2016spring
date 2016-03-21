(function() {
    var btns  = document.querySelectorAll("button"),
        lin   = btns[0],
        rin   = btns[1],
        lout  = btns[2],
        rout  = btns[3],
        bubbleBtn = btns[4],
        queue = document.querySelector("ul");

    addHandler(lin, "click", leftIn);
    addHandler(rin, "click", rightIn);
    addHandler(lout, "click", leftOut);
    addHandler(rout, "click", rightOut);
    addHandler(queue, "click", deleteEle);
    addHandler(bubbleBtn, "click", function() {
        bubbleSort(queue);
    });

    init(queue, lin);
})();

function init(queue, lin) {
    var randHeight, i, input = document.querySelector("input");
    for(var i = 0; i < 50; i++) {
        input.value = Math.floor(Math.random() * 90) + 10;
        lin.click();
    }
}

function leftIn() {
    var queue  = document.querySelector("ul"),
        input  = document.querySelector("input"),
        newEle = document.createElement("li"),
        oldEle = queue.querySelectorAll("li")[0],
        temp;

    if(!(temp = transValue(input))) {
        return false;
    }
    newEle.style.height = temp + "px";
    if(queueLength(queue) >= 60) {
        alert("队列满了");
    } else if(!oldEle) {
        queue.appendChild(newEle);
    } else {
        queue.insertBefore(newEle, oldEle);
    }
};

function rightIn() {
    var newEle = document.createElement("li"),
        queue  = document.querySelector("ul"),
        input  = document.querySelector("input"),
        temp;

    if(!(temp = transValue(input))) {
        return false;
    }
    newEle.style.height = temp + "px";
    if(queueLength(queue) >= 60) {
        alert("队列满了");
    } else {
        queue.appendChild(newEle);
    }
};

function leftOut() {
    var queue  = document.querySelector("ul"),
        oldEle = queue.querySelectorAll("li")[0];

    if(!oldEle) {
        alert("队列空了");
    } else {
        alert(oldEle.offsetHeight);
        queue.removeChild(oldEle);
    }
};

function rightOut() {
    var queue  = document.querySelector("ul"),
        oldEle = queue.lastChild;

    if(!oldEle) {
        alert("队列空了");
    } else {
        alert(oldEle.offsetHeight);
        queue.removeChild(oldEle);
    }
};

function deleteEle(event) {
    var oldEle = getTarget(event),
        queue  = document.querySelector("ul");

    if(oldEle.tagName == "LI") {
        queue.removeChild(oldEle);
    }
};

/**
 * add handler to element
 */
function addHandler(element, type, handler) {
    if(element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent("on"+type, handler);
    } else {
        element["on"+type] = handler;
    }
};

/**
 * get target from event
 */
function getTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement;
};

/**
 * the number of elements in queue
 */
function queueLength(queue) {
    return queue.querySelectorAll("li").length;
};

function transValue(input) {
    var result = parseInt(input.value.replace(/\D/g, ""), 10);

    if(result > 100 || result < 10) {
        input.value = "必须为10-100的整数！";
        return false;
    }
    return result;
};

function swap(ele1, ele2) {
    var temp = ele1.offsetHeight;

    ele1.offsetHeight = ele2.offsetHeight;
    ele1.style.height = ele2.offsetHeight + "px";
    ele2.offsetHeight = temp;
    ele2.style.height = temp + "px";

    // 如果只是相邻元素swap，可以使用下面这个方法直接交换dom元素
    // 但是考虑到非冒泡排序算法使用swap时不一定是交换相邻元素(比
    // 如插入排序)，所以使用交换高度的方法。注意ele.style.height
    // 和ele.offsetHeight都需要互换

    // ele1.parentNode.insertBefore(ele2, ele1);
};

function bubbleSort(queue) {
    var eles = queue.getElementsByTagName("li"),
        len = eles.length, i, j = 0, delay = 100;

    for(i = len-1; i >=1; --i) {
        for(j = 0; j < i; ++j) {
            if(eles[j].offsetHeight > eles[j+1].offsetHeight) {
                swap(eles[j], eles[j+1]);
            }
        }
    }
};
