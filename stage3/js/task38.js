var tableBar = document.querySelector('#tableBar');

var TableComponent = Hum.createClass(Table, {
    sortCols: [2, 3],
    className: {
        table: 'table',
        th: 'th',
        tr: 'tr',
        td: 'td',
        btn: 'btn'
    },
    data: {
        title: ['球员', '球队', '平均分', '命中率(%)'],
        content: [
            ['Kobe', 'Harden', 'Tompson', 'Curry', 'Griffin', 'Gay', 'Bosh'],
            ['Lakers','Rockets','Warriors','Warriors','Clippers','Kings','Heat'],
            [27.6, 27.2, 27, 26, 24.8, 24.4, 24.2],
            [40.2, 38.8, 53.7, 44.4, 49.5, 52.1, 47.5]
        ]
    }
});

var realDOM = TableComponent.render();

Hum.render(
    realDOM,
    tableBar
);

// 排序接口
var personalSort = TableComponent.sortFunc();

// 测试排序接口
personalSort(TableComponent, 2);
TableComponent.render();
