export var MyEventRegistry;
(function (MyEventRegistry) {
    MyEventRegistry["CountIncrement"] = "CounterInrement";
    MyEventRegistry["CountDecrement"] = "CounterDecrement";
})(MyEventRegistry || (MyEventRegistry = {}));
window.EventRegistry.register(MyEventRegistry.CountIncrement);
window.EventRegistry.register(MyEventRegistry.CountDecrement);
