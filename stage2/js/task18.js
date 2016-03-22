(function() {
    var btns  = document.querySelectorAll("button"),
        lin   = btns[0],
        rin   = btns[1],
        lout  = btns[2],
        rout  = btns[3],
        queue = document.querySelector("ul");

    addHandler(lin, "click", leftIn);
    addHandler(rin, "click", rightIn);
    addHandler(lout, "click", leftOut);
    addHandler(rout, "click", rightOut);
    addHandler(queue, "click", deleteEle);

    init(queue, lin);
})();

function leftIn() {
    var queue  = document.querySelector("ul"),
        input  = document.querySelector("input"),
        newEle = document.createElement("li"),
        lastEle = queue.querySelectorAll("li")[0];

    newEle.innerHTML = input.value.replace(/\D/g, "");
    if(newEle.innerHTML == "") {
        input.value = "请输入数字";
    } else if(!lastEle) {
        queue.appendChild(newEle);
    } else {
        queue.insertBefore(newEle, lastEle);
    }
};

function rightIn() {
    var newEle = document.createElement("li"),
        queue  = document.querySelector("ul"),
        input  = document.querySelector("input");

    newEle.innerHTML = input.value.replace(/\D/g, "");
    if(newEle.innerHTML == "") {
        input.value = "请输入数字";
    } else {
        queue.appendChild(newEle);
    }
};

function leftOut() {
    var queue  = document.querySelector("ul"),
        lastEle = queue.querySelectorAll("li")[0];

    if(!lastEle) {
        alert("队列空了");
    } else {
        alert(lastEle.innerHTML);
        queue.removeChild(lastEle);
    }
};

function rightOut() {
    var queue  = document.querySelector("ul"),
        lastEle = queue.lastElementChild;

    if(!lastEle) {
        alert("队列空了");
    } else {
        alert(lastEle.innerHTML);
        queue.removeChild(lastEle);
    }
};

function deleteEle(event) {
    var lastEle = getTarget(event),
        queue  = document.querySelector("ul");

    if(lastEle.tagName == "LI") {
        queue.removeChild(lastEle);
    }
};
