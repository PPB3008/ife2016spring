/**
 * add handler to element
 */
function addHandler(element, type, handler) {
    if(element.addEventListener) {
        addHandler = function(element, type, handler) {
            element.addEventListener(type, handler, false);
        };
    } else if (element.attachEvent) {
        addHandler = function(element, type, handler) {
            element.attachEvent("on"+type, handler);
        };
    } else {
        addHandler = function(element, type, handler) {
            element["on"+type] = handler;
        };
    }
    return addHandler(element, type, handler);
};

/**
 * remove handler
 */
function removeHandler(element, type, handler){
    if(element.removeEventListener) {
        removeHandler = function(element, type, handler) {
            element.removeEventListener(type,handler,false);
        };
    } else if (element.detachEvent) {
        removeHandler = function (element, type, handler) {
            element.detachEvent("on"+type,handler);
        };
    }else{
        removeHandler = function (element, type, handler) {
            element["on"+type]=null;
        };
    }
    return removeHandler(element, type, handler);
};

/**
 * get target from event
 */
function getTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement;
};

/**
 * prevent default
 */
function preventDefault(event) {
    event = event || window.event;
    if(event.preventDefault) {
        preventDefault = function(event) {
            event.preventDefault();
        }
    } else {
        preventDefault = function(event) {
            event.returnValue = false;
        }
    }
    return preventDefault(event);
};

/**
 * stop bubble
 */
function stopPropagation(event) {
    event = event || window.event;
    if(event.stopPropagation) {
        stopPropagation = function(event) {
            event.stopPropagation();
        }
    } else {
        stopPropagation = function(event) {
            event.cancelBubble = true;
        }
    }
    return stopPropagation(event);
};

function trim(word) {
    return word.replace(/^\s+|\s+$/g,"");
};

function hasClassName(element, className) {
    return Array.prototype.indexOf.call(element.className.split(' '), className) + 1;
};

function addClassName(element, className) {
    if(!hasClassName(element, className)) {
        element.className += (element.className == '' ? className : ' ' + className);
    }
};

function removeClassName(element, className) {
    var index = hasClassName(element, className) - 1,
        classNameArray = element.className.split(' ');
    if(index !== -1) {
        classNameArray.splice(index, 1);
        element.className = classNameArray.join(' ');
    }
};

/**
 * transform angle to radian
 * @param  {Number} angle
 * @return {Number}
 */
function angle2radian(angle) {
    return (-2 * Math.PI / 360 * angle);
};

/**
 * @param  {Number} year
 * @param  {Number} month
 * @return {Number}
 */
function getFirstDayOfMouth(year, month) {
    var date = new Date(year, month);
    var day = date.getDay();

    return day;
};

/**
 * @param  {Number} year
 * @param  {Number} month
 * @return {Number}
 */
function getDateCount(year, month) {
    var monthArr = [0, 2, 4, 6, 7, 9, 11];

    if(month == 1) {
        return ((year % 4 == 0 && year % 100 !== 0) || (year % 400 == 0))? 29 : 28;
    } else if (monthArr.some(function (item, index, array) {return month == item;})) {
        return 31;
    } else {
        return 30;
    }
};

