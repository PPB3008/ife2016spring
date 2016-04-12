/*
 * Component Manager, it is a little like React with JSX
 */
var HH = {
    createClass: function (Component, config, callback) {
        var comp = new Component(config);

        if(Object.prototype.toString.call(callback) == '[object Function]') {
            callback();
        }
        return comp;
    },
    render: function (comp, wrapper, callback) {
        wrapper = wrapper || document.body || document.documentElement;
        wrapper.appendChild(comp);
        if(Object.prototype.toString.call(callback) == '[object Function]') {
            callback();
        }
    }
};
