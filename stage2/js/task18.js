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
})();

function leftIn() {
    var queue = document.querySelector("ul"),
        input = document.querySelector("input"),
        newEle = document.createElement("li"),
        oldEle = queue.querySelectorAll("li")[0];

    newEle.innerHTML = input.value.replace(/\D/g, "");
    if(!oldEle) {
        queue.appendChild(newEle);
    } else {
        queue.insertBefore(newEle, oldEle);
    }
};

function rightIn() {
    var newEle = document.createElement("li"),
        queue = document.querySelector("ul"),
        input = document.querySelector("input");

    newEle.innerHTML = input.value.replace(/\D/g, "");
    queue.appendChild(newEle);
};

function leftOut() {
    var queue = document.querySelector("ul"),
        oldEle = queue.querySelectorAll("li")[0];

    if(!oldEle) {
        alert("队列空了");
    } else {
        alert(oldEle.innerHTML);
        queue.removeChild(oldEle);
    }
};

function rightOut() {
    var queue = document.querySelector("ul"),
        oldEle = queue.lastChild;

    if(!oldEle) {
        alert("队列空了");
    } else {
        alert(oldEle.innerHTML);
        queue.removeChild(oldEle);
    }
};

function deleteEle(event) {
    var oldEle = getTarget(event),
        queue = document.querySelector("ul");

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
 * remove handler of element
 */
function removeHandler(element, type, handler) {
    if(element.removeEventListener) {
        element.removeEventListener(type, handler);
    } else if (element.detachEvent) {
        element.detachEvent("on"+type, handler);
    } else {
        element["on"+type] = null;
    }
}
