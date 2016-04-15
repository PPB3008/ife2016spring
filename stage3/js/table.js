
/**
 * 构造函数
 * @param {Object} config
 */
function Table (config) {
    this.className = config.className || {
        table: '',
        th: '',
        tr: '',
        td: '',
        btn: ''
    };
    this.sortCols = config.sortCols || [];
    this.sortDir  = 1;
    this.trs      = [];
    this.data     = config.data || {'title': ['空表'], 'content': [['--']]};
    this.rows     = this.data['content'][0].length + 1;
    this.cols     = this.data['title'].length;

    this.table    = document.createElement('table');
    this.th       = document.createElement('th');
    this.headerTr = document.createElement('tr');

    this.init();
    this.bindEvents();
};

/**
 * 根据初始数据初始化属性
 */
Table.prototype.init = function () {
    var table    = this.table,
        trs      = this.trs,
        headerTr = this.headerTr;
        data     = this.data,
        i        = 0,
        j        = 0,
        len      = 0,
        self     = this;

    var th, tr, td;

    table.className = this.className['table'];
    table.setAttribute('cellspacing', '0');

    for(i = 0; i < this.rows; ++i) {
        tr = document.createElement('tr');
        tr.className = this.className['tr'];
        table.appendChild(tr);
        trs.push(tr);
    }

    // 表单首行
    data['title'].forEach(function (titleTxt, col) {
        th = document.createElement('th');
        th.className = self.className['th'];
        th.innerHTML = titleTxt;
        // 是可排序列就添加排序按钮
        if(self.sortCols.indexOf(col) > -1) {
            btn1 = document.createElement('span');
            btn2 = document.createElement('span');
            btn1.className = self.className['btn'];
            btn2.className = self.className['btn'];
            th.appendChild(btn1);
            th.appendChild(btn2);
        }
        trs[0].appendChild(th);
    });

    // 表单内容
    data['content'].forEach(function (contentArray) {
        contentArray.forEach(function (contentTxt, row) {
            td = document.createElement('td');
            td.className = self.className['td'];
            td.innerHTML = contentTxt;
            trs[row+1].appendChild(td);
        })
    });

    // 冻结首行
    headerTr.innerHTML      = this.trs[0].innerHTML;
    headerTr.className      = this.trs[0].className;
    headerTr.style.display  = 'none';
    headerTr.style.position = 'fixed';
    headerTr.style.top      = '0';
    table.appendChild(headerTr);
};

/**
 * 绑定事件: 点击按钮排序
 */
Table.prototype.bindEvents = function () {
    var self = this;

    addHandler(self.table, 'click', function (e) {
        e = e || window.event;
        var target = getTarget(e);
        self.table.removeChild(self.headerTr);
        if(target.className == self.className['btn']) {
            var th = target.parentNode,
                ths = self.table.querySelectorAll('th'),
                col = Array.prototype.indexOf.call(ths, th),
                btnIndex = Array.prototype.indexOf.call(th.querySelectorAll('.'+target.className), target),
                sortFunc = self.sortFunc();

            self.sortDir = btnIndex;
            sortFunc(self, col);
            self.render();
        }
        self.table.appendChild(self.headerTr);
    });

    addHandler(window, 'scroll', function (e) {
        e = e || window.event;

        var table     = self.table,
            headerTr  = self.headerTr,
            scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        if(table.offsetTop < scrollTop && table.offsetTop + table.offsetHeight > scrollTop) {
            headerTr.style.display = 'block';
        } else {
            headerTr.style.display = 'none';
        }
    });
};

/**
 * 排序方法接口
 * @param  {Function} func
 * @return {Function}
 */
Table.prototype.sortFunc = function (func) {
    if(Object.prototype.toString.call(func) == '[object Function]') {
        return func;
    }
    return this.defaultSort;
};

/**
 * 默认排序方法
 * @param  {Number} col
 */
Table.prototype.defaultSort = function (self, col) {
    var data = self.data,
        sortData = data['content'][col],
        sortedTrs = self.trs.slice(1),
        nums = [],
        temp,
        i,
        j;

    // 暂存被排序列的数组
    for(i = 1; i < self.rows; ++i) {
        nums[i] = (self.trs[i].querySelectorAll('td')[col].innerHTML-0);
    }

    // 对除第一行之外的数据根据所选列的数据排序, sortDir == 0 从大到小, sortDir == 1 从小到大
    sortedTrs.sort(function (x1, x2) {
        if(self.sortDir) {
            return x1.querySelectorAll('td')[col].innerHTML - x2.querySelectorAll('td')[col].innerHTML;
        } else {
            return x2.querySelectorAll('td')[col].innerHTML - x1.querySelectorAll('td')[col].innerHTML;
        }
    });

    sortedTrs.unshift(self.trs[0]);
    self.trs = sortedTrs;
};

/**
 * 渲染到DOM
 */
Table.prototype.render = function () {
    var self = this;

    this.trs.forEach(function (tr) {
        self.table.appendChild(tr);
    });

    return this.table;
};
