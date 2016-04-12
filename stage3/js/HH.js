/*
 * Component Manager, it is a little like React with JSX
 */
var HH = {
    createClass: function (Component, config) {
        var comp = new Component(config);

        return comp;
    },
    render: function (comp, wrapper) {
        wrapper = wrapper || document.body || document.documentElement;
        wrapper.appendChild(comp);
    }
};
