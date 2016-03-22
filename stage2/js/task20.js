(function() {
    var btns      = document.querySelectorAll("button"),
        lin       = btns[0],
        rin       = btns[1],
        lout      = btns[2],
        rout      = btns[3],
        searchBtn = btns[4],
        queue     = document.querySelector("ul");

    addHandler(lin, "click", leftIn);
    addHandler(rin, "click", rightIn);
    addHandler(lout, "click", leftOut);
    addHandler(rout, "click", rightOut);
    addHandler(searchBtn, "click", searchWord);
    addHandler(queue, "click", deleteEle);
})();

function leftIn() {
    var queue    = document.querySelector("ul"),
        input    = document.querySelector("#inputEle"),
        newEle   = document.createElement("li"),
        lastEle  = queue.querySelectorAll("li")[0],
        inputArr = input.value.split(/\n+|\r+|\t+|\s+|,+|，+|、+/g);

    for(var i = 0, len = inputArr.length; i < len; i++) {
        newEle.innerHTML = inputArr[i].replace(/!(\d|\w)/g, "");
        if(newEle.innerHTML == "") {
            input.value = "请输入数字";
        } else if(!lastEle) {
            queue.appendChild(newEle);
        } else {
            queue.insertBefore(newEle, lastEle);
        }
        lastEle = newEle;
        newEle = document.createElement("li");
    }
};

function rightIn() {
    var newEle   = document.createElement("li"),
        queue    = document.querySelector("ul"),
        input    = document.querySelector("#inputEle"),
        inputArr = input.value.split(/\n+|\r+|\t+|\s+|,+|，+|、+/g);

    for(var i = 0, len = inputArr.length; i < len; i++) {console.log(i)
        newEle.innerHTML = inputArr[i].replace(/!(\d|\w)/g, "");
        if(newEle.innerHTML == "") {
            input.value = "请输入数字";
        } else {
            queue.appendChild(newEle);
            newEle = document.createElement("li");
        }
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

function searchWord() {
    var eles    = document.querySelectorAll("li"),
        keyword = new RegExp(document.querySelector("#keyword").value);

    for(var i = 0, len = eles.length; i < len; i++) {
        if(keyword.test(eles[i].innerHTML)) {
            eles[i].style.color = "#000000";
        }
    }
}

function deleteEle(event) {
    var lastEle = getTarget(event),
        queue   = document.querySelector("ul");

    if(lastEle.tagName == "LI") {
        queue.removeChild(lastEle);
    }
};

/**
 * add handler to element
 */
function addHandler(element, type, handler) {
    if(element.addEventListener) {
        addHandler = function(element, type, handler) {
            element.addEventListener(type, handler, false);
        }
    } else if (element.attachEvent) {
        addHandler = function(element, type, handler) {
            element.attachEvent("on"+type, handler);
        }
    } else {
        addHandler = function(element, type, handler) {
            element["on"+type] = handler;
        }
    }
    return addHandler(element, type, handler);
};

/**
 * get target from event
 */
function getTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement;
};
