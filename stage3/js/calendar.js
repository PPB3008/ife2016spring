/**
 * UI组件之日历
 */
function Calendar (config) {
    this.className = config.className || {};

    this.minYear            = config.minYear || 2000;
    this.maxYear            = config.maxYear || 2020;
    this.multiply           = config.multiply || false;
    this.days               = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.changeDateCallback = config.changeDateCallback || function () {};
    this.outOfRangeCallback = config.outOfRangeCallback || function () {};
    this.startDate          = [],
    this.endDate            = [],
    this.range              = config.range || [0, 700];

    this.calendar    = document.createElement('div');
    this.selector    = document.createElement('p');
    this.controlBar  = document.createElement('div');
    this.yearBar     = document.createElement('p');
    this.monthBar    = document.createElement('p');
    this.calendarBar = document.createElement('table');
    this.dayBar      = document.createElement('thead');
    this.dateBar     = document.createElement('tbody');
    this.commitBar   = document.createElement('div');
    this.wrapper     = document.createElement('div');

    this.init(new Date());
    this.bindEvents();
};

Calendar.prototype.init = function (today) {
    var self  = this,
        today = new Date(),
        fragment,
        tmp,
        td;

    addClassName(self.calendar, self.className['calendar']);
    addClassName(self.selector, self.className['selector']);
    addClassName(self.controlBar, self.className['controlBar']);
    addClassName(self.yearBar, self.className['yearBar']);
    addClassName(self.monthBar, self.className['monthBar']);
    addClassName(self.calendarBar, self.className['calendarBar']);
    addClassName(self.dayBar, self.className['dayBar']);
    addClassName(self.dateBar, self.className['dateBar']);
    addClassName(self.commitBar, self.className['commitBar']);
    addClassName(self.wrapper, self.className['calendarWrapper']);

    self.selector.innerHTML = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    self.yearBar.innerHTML = '<span><</span><span>' + today.getFullYear() + '</span><span>></span>';
    self.monthBar.innerHTML = '<span><</span><span>' + (today.getMonth() + 1) + '</span><span>></span>';

    fragment = document.createDocumentFragment();
    tmp = document.createElement('tr');
    self.days.forEach(function (day) {
        td = document.createElement('td');
        td.innerHTML = day;
        fragment.appendChild(td);
    });
    tmp.appendChild(fragment);
    self.dayBar.appendChild(tmp);
    self.dateBar.innerHTML = '<tr></tr>';

    self.commitBar.innerHTML = '<div>确认</div><div>取消</div>';

    self.controlBar.appendChild(self.yearBar);
    self.controlBar.appendChild(self.monthBar);
    self.calendarBar.appendChild(self.dayBar);
    self.calendarBar.appendChild(self.dateBar);
    self.calendar.appendChild(self.controlBar);
    self.calendar.appendChild(self.calendarBar);
    self.calendar.appendChild(self.commitBar);
    self.wrapper.appendChild(self.selector);
    self.wrapper.appendChild(self.calendar);

    self.calendar.style.display  = 'none';

    self.setCalendar(today.getFullYear(), today.getMonth() + 1);
};

Calendar.prototype.bindEvents = function () {
    var self      = this,
        yearBtns  = self.yearBar.querySelectorAll('span'),
        monthBtns = self.monthBar.querySelectorAll('span'),
        year      = yearBtns[1].innerHTML - 0;
        month     = monthBtns[1].innerHTML - 0;

    addHandler(yearBtns[0], 'click', function (e) {
        preventDefault(e);
        year = (year <= self.minYear ? self.minYear : year - 1);
        self.setCalendar(year, month);
    });
    addHandler(yearBtns[2], 'click', function (e) {
        preventDefault(e);
        year = (year >= self.maxYear ? self.maxYear : year + 1);
        self.setCalendar(year, month);
    });
    addHandler(monthBtns[0], 'click', function (e) {
        preventDefault(e);
        month = (month == 1 ? 12 : month - 1);
        if(month == 12) {
            year = (year <= self.minYear ? self.minYear : year - 1);
        }
        self.setCalendar(year, month);
    });
    addHandler(monthBtns[2], 'click', function (e) {
        preventDefault(e);
        month = (month == 12 ? 1 : month + 1);
        if(month == 1) {
            year = (year >= self.maxYear ? self.maxYear : year + 1);
        }
        self.setCalendar(year, month);
    });

    addHandler(self.dateBar, 'click', function (e) {
        var date = getTarget(e),
            tmpArr,
            range;

        if(!date.innerHTML) {
            return false;
        }

        // 任务40
        // if(self.focusDate) {
        //     removeClassName(self.focusDate, self.className['focusDate']);
        // }
        // addClassName(date, self.className['focusDate']);

        // 任务41
        // self.focusDate = date;
        // self.selector.innerHTML = self.yearBar.querySelectorAll('span')[1].innerHTML + '-'
        //                         + self.monthBar.querySelectorAll('span')[1].innerHTML + '-'
        //                         + self.focusDate.innerHTML;

        // self.calendar.style.display = 'none';
        // self.changeDateCallback();

        // 任务42
        if(self.startDate.length == 0) {
            self.startDate = [
                self.yearBar.querySelectorAll('span')[1].innerHTML,
                self.monthBar.querySelectorAll('span')[1].innerHTML,
                date.innerHTML
            ];
            addClassName(date, self.className['focusDate']);
        } else {
            self.endDate = [
                self.yearBar.querySelectorAll('span')[1].innerHTML,
                self.monthBar.querySelectorAll('span')[1].innerHTML,
                date.innerHTML
            ];
            tmpArr = compareArray(self.startDate, self.endDate);
            self.startDate = tmpArr[0];
            self.endDate   = tmpArr[1];
            range = dateDiff(self.startDate.join('-'), self.endDate.join('-'), '-');
            if(range < self.range[0] || range > self.range[1]) {
                self.startDate = [];
                self.endDate   = [];
                self.outOfRangeCallback();
                self.setFocusClass(false);
            } else {
                self.setFocusClass(true);
            }
        }
    });
    addHandler(self.selector, 'click', function () {
        self.calendar.style.display = 'block';
    });
    addHandler(self.commitBar, 'click', function (e) {
        var target = getTarget(e),
            btns   = self.commitBar.querySelectorAll('div');

        if(target == btns[0]) {
            // 确认
            if(self.endDate.length != 0) {
                self.selector.innerHTML = self.startDate[0] + '-'
                                        + self.startDate[1] + '-'
                                        + self.startDate[2] + ' to '
                                        + self.endDate[0] + '-'
                                        + self.endDate[1] + '-'
                                        + self.endDate[2]
            }
        }
        self.startDate = [];
        self.endDate   = [];
        self.setFocusClass(true);
        self.calendar.style.display = 'none';
    });
};

Calendar.prototype.setCalendar = function (year, month) {
    var self     = this,
        dateBar  = self.dateBar,
        dateTr   = dateBar.getElementsByTagName('tr')[0],
        firstDay = getFirstDayOfMouth(year, month - 1),
        td,
        i        = firstDay,
        j,
        len;

    dateBar.innerHTML   = '';
    dateTr.innerHTML    = '';
    dateBar.appendChild(dateTr);

    for(j = 0; j < firstDay; j++) {
        td = document.createElement('td');
        dateTr.appendChild(td);
    }

    for(len = getDateCount(year, month - 1), j = 1; j <= len; j++, i++) {
        td = document.createElement("td");
        addClassName(td, self.className['date']);

        if(i == 7) {
            i = 0;
            dateTr = document.createElement("tr");
            dateBar.appendChild(dateTr);
        }

        td.innerHTML = j;
        dateTr.appendChild(td);
    }

    for(; i < 7; i++) {
        td = document.createElement("td");
        dateTr.appendChild(td);
    }

    self.yearBar.querySelectorAll('span')[1].innerHTML = year;
    self.monthBar.querySelectorAll('span')[1].innerHTML = month;

    self.setFocusClass(true);
};

Calendar.prototype.setFocusClass = function (inTheRange) {
    var self         = this,
        dates        = self.dateBar.querySelectorAll('td'),
        currentYear  = self.yearBar.querySelectorAll('span')[1].innerHTML,
        currentMonth = self.monthBar.querySelectorAll('span')[1].innerHTML,
        startDate,
        endDate,
        len,
        i;

    [].forEach.call(dates, function (date) {
        removeClassName(date, self.className['focusDate']);
    });

    if( !inTheRange
        || self.startDate.length == 0 || self.endDate.length == 0
        || ((parseInt(self.startDate[0], 10) >= parseInt(currentYear, 10))
            && (parseInt(self.startDate[1], 10) > parseInt(currentMonth, 10)))
        || ((parseInt(self.endDate[0], 10) <= parseInt(currentYear, 10))
            && (parseInt(self.endDate[1], 10) < parseInt(currentMonth, 10)))
        ) {

        return false;

    }

    for(i = 0, len = dates.length - 1; i <= len; ++i) {
        if(dates[i].innerHTML != '') {
            startDate = dates[i];
            break;
        }
    }
    for(i = dates.length - 1; i >= 0; --i) {
        if(dates[i].innerHTML != '') {
            endDate = dates[i];
            break;
        }
    }

    if(self.startDate[0] == currentYear && self.startDate[1] == currentMonth) {

        for(i = 0, len = dates.length - 1; i <= len; ++i) {
            if(dates[i].innerHTML == self.startDate[2]) {
                startDate = dates[i];
                break;
            }
        }

    }
    if(self.endDate[0] == currentYear && self.endDate[1] == currentMonth) {

        for(i = dates.length - 1; i >= 0; --i) {
            if(dates[i].innerHTML == self.endDate[2]) {
                endDate = dates[i];
                break;
            }
        }

    }

    for(i = Array.prototype.indexOf.call(dates, startDate); dates[i] != endDate; ++i) {
        addClassName(dates[i], self.className['focusDate']);
    }
    addClassName(endDate, self.className['focusDate']);
};

Calendar.prototype.render = function () {
    return this.wrapper;
};
