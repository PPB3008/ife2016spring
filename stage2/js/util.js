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

function init(queue, lin) {
    var randHeight, i, input = document.querySelector("input");
    for(var i = 0; i < 10; i++) {
        input.value = Math.floor(Math.random() * 90) + 10;
        lin.click();
    }
};
