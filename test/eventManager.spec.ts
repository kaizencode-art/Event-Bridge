// EventManager.global.spec.ts
import { EventRegistry, type EventName } from '../src/EventRegistry';
import { EventManager } from '../src/EventManager';

/** Minimal NamedEventTarget for the tests */
class NamedTarget extends EventTarget {
    constructor(public name: string) {
        super();
    }
}

const newEvent = (): EventName =>
    (`evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}` as EventName);

describe('Event Manager ', () => {
    const EVENT = 'myEvent';

    it('register → consume → dispatch → remove (happy-path)', () => {
        EventRegistry.register(EVENT);

        const emitter = new NamedTarget('Emitter');
        const consumer = new NamedTarget('Consumer');
        const handler = jest.fn();

        EventManager.registerEmitter(emitter, EVENT, 1);
        EventManager.consume(consumer, EVENT, handler());

        EventManager.dispatch(emitter, EVENT, { detail: { foo: 1 } });
        expect(handler).toHaveBeenCalledTimes(1);

        EventManager.removeConsume(consumer, EVENT, handler);
        EventManager.dispatch(emitter, EVENT, { detail: { foo: 2 } });
        expect(handler).toHaveBeenCalledTimes(1); // no extra call
    });

    it('refuses to register a second emitter for the same event', () => {

        const first = new NamedTarget('E1');
        const second = new NamedTarget('E2');

        expect(() =>
            EventManager.registerEmitter(second, EVENT, 1)
        ).toThrow(/already an emitter/i);
    });

    it('enforces the consumer limit', () => {

        const emitter = new NamedTarget('Source');
        const consumer1 = new NamedTarget('C1');
        const consumer2 = new NamedTarget('C2');

        EventManager.consume(consumer1, EVENT, () => {});
        expect(() =>
            EventManager.consume(consumer2, EVENT, () => { })
        ).toThrow(/More consumer registered than allowed/i);
    });
});
