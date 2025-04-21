export enum MyEventRegistry {
    CountIncrement = `CounterInrement`,
    CountDecrement = `CounterDecrement`
}

window.EventRegistry.register(MyEventRegistry.CountIncrement);
window.EventRegistry.register(MyEventRegistry.CountDecrement);
