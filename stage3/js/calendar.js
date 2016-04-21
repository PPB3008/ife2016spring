/**
 * UI组件之日历
 */
function Calendar (config) {
    this.className = config.className || {};

    this.minYear = config.minYear || 2000;
    this.maxYear = config.maxYear || 2020;
    this.days    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.changeDateCallback = config.callback || function () {};
    this.focusDate;

    this.calendar    = document.createElement('div');
    this.selector    = document.createElement('p');
    this.controlBar  = document.createElement('div');
    this.yearBar     = document.createElement('p');
    this.monthBar    = document.createElement('p');
    this.calendarBar = document.createElement('table');
    this.dayBar      = document.createElement('thead');
    this.dateBar     = document.createElement('tbody');
    this.wrapper     = document.createElement('div');

    this.init(new Date());
    this.bindEvents();
};

Calendar.prototype.init = function (today) {
    var self = this,
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

    self.controlBar.appendChild(self.yearBar);
    self.controlBar.appendChild(self.monthBar);
    self.calendarBar.appendChild(self.dayBar);
    self.calendarBar.appendChild(self.dateBar);
    self.calendar.appendChild(self.controlBar);
    self.calendar.appendChild(self.calendarBar);
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
        self.setCalendar(year, month);
    });
    addHandler(monthBtns[2], 'click', function (e) {
        preventDefault(e);
        month = (month == 12 ? 1 : month + 1);
        self.setCalendar(year, month);
    });

    addHandler(self.dateBar, 'click', function (e) {
        var date = getTarget(e);

        if(!date.innerHTML) {
            return false;
        }

        // 任务40的改变样式
        // if(self.focusDate) {
        //     removeClassName(self.focusDate, self.className['focusDate']);
        // }
        // addClassName(date, self.className['focusDate']);

        // 任务41的选择日期及回调函数
        self.focusDate = date;
        self.selector.innerHTML = self.yearBar.querySelectorAll('span')[1].innerHTML + '-'
                                + self.monthBar.querySelectorAll('span')[1].innerHTML + '-'
                                + self.focusDate.innerHTML;

        self.calendar.style.display = 'none';
        self.changeDateCallback();
    });
    addHandler(self.selector, 'click', function () {
        self.calendar.style.display = self.calendar.style.display == 'block' ? 'none' : 'block';
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
};

Calendar.prototype.render = function () {
    return this.wrapper;
};
