import { EventBus } from "../src/EventBus";
import { EventContractManager } from "../src/EventContractManager";

beforeEach(() => {
    // Reset state before each test
    window.GlobalEventBus = undefined;
    window.GlobalEventContractManager = undefined;

    // Clear contracts (reset the map if needed)
    (EventContractManager as any).contracts = new Map();
});

describe("Event system", () => {
    it("should register contract and return it", () => {
        EventContractManager.add("testEvent", 1);
        const contract = EventContractManager.get("testEvent");
        expect(contract.name).toBe("testEvent");
        expect(contract.maxConsumers).toBe(1);
    });

    it("should throw when adding duplicate contract", () => {
        EventContractManager.add("dupEvent", 1);
        expect(() =>
            EventContractManager.add("dupEvent", 2)
        ).toThrowError(/déjà défini/);
    });

    it("should emit to registered consumer", () => {
        EventContractManager.add("myEvent", 1);
        const contract = EventContractManager.get("myEvent");
        const bus = EventBus.get();

        const emitter = {};
        const consumer = {};
        const mockCallback = jest.fn();

        bus.consume(contract, consumer, mockCallback);
        bus.emit(contract, emitter, { hello: "world" });

        expect(mockCallback).toHaveBeenCalledWith({ hello: "world" });
    });

    it("should set emitter on first emit and block others", () => {
        EventContractManager.add("emitterTest", 1);
        const contract = EventContractManager.get("emitterTest");
        const bus = EventBus.get();

        const emitterA = {};
        const emitterB = {};

        // first emit sets the emitter
        bus.emit(contract, emitterA, { msg: "test" });

        // second emit from same emitter is okay
        bus.emit(contract, emitterA, { msg: "again" });

        // different emitter = error
        expect(() =>
            bus.emit(contract, emitterB, { msg: "fail" })
        ).toThrowError(/Un autre est déjà défini/);
    });

    it("should block on too many consumers", () => {
        EventContractManager.add("limitEvent", 1);
        const contract = EventContractManager.get("limitEvent");
        const bus = EventBus.get();

        const consumer1 = {};
        const consumer2 = {};

        bus.consume(contract, consumer1, jest.fn());

        expect(() =>
            bus.consume(contract, consumer2, jest.fn())
        ).toThrowError(/Événement.*bloqué/);

        // Now the event is blocked
        const emitter = {};
        expect(() =>
            bus.emit(contract, emitter, { data: 123 })
        ).toThrowError(/bloqué/);
    });

    it("should bind to window and use globally", () => {
        EventContractManager.add("globalEvent", 1);
        window.GlobalEventContractManager = EventContractManager;
        window.GlobalEventBus = EventBus.get();

        const contract = window.GlobalEventContractManager.get("globalEvent");

        const emitter = {};
        const consumer = {};
        const cb = jest.fn();

        window.GlobalEventBus.consume(contract, consumer, cb);
        window.GlobalEventBus.emit(contract, emitter, { data: 999 });

        expect(cb).toHaveBeenCalledWith({ data: 999 });
    });
});
