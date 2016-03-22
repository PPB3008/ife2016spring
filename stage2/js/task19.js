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

function paint(queue) {
    var eles = queue.querySelectorAll("li"),
        html = "";

    queue.innerHTML = "";
    for(var i = 0; i < eles.length; i++) {
        html += '<li style="height:' + eles[i].style.height + '">' + '</li>';
    }
    queue.innerHTML = html;
}

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
        len = eles.length, i, j = 0, delay = 50, timer;

    i = len - 1;
    timer = setInterval(function() {
        if(i < 1) {
            clearInterval(timer);
        }
        if(j == i) {
            --i;
            j = 0;
        }
        if (eles[j].offsetHeight > eles[j+1].offsetHeight) {
            swap(eles[j], eles[j+1]);
        }
        j++;
    }, delay);
};
