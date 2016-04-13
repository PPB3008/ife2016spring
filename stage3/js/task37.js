var alertBar = document.querySelector('#alertBar');

// React.createClass内是一个对象,这里的createClass是用参数方式直接创建组件
var testBtn = document.querySelector('#testBtn');

var AlertComponent = Hum.createClass(AlertBar, {
    targetId: 'alertBar',
    titleTxt: 'UI组件',
    contentTxt: 'UI组件之弹出窗口,4.12日',
    hasShader: true,
    isShow: false,
    width: 400,
    height: 300,
    drag: true,
    flexible: false,
    btns: {
        1: '确认',
        2: '取消'
    },
    className: {
        alertWindow: 'alertWindow',
        title: 'title',
        content: 'content',
        shader: 'shader',
        btn: 'btn'
    }
});

var realDOM = AlertComponent.render();

Hum.render(
    realDOM,
    alertBar
);
addHandler(testBtn, 'click', function () {
    AlertComponent.toggle();
    Hum.render(realDOM, alertBar);
});
