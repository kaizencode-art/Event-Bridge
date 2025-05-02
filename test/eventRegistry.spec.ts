import { EventRegistry } from "../src"

describe('event registry', () => {

    const REGISTERED_EVENTS = ['first_event', 'second_event'];

    afterEach(() => {
        jest.resetModules();
    });


    it('should always be defined and not null when imported (ready to use)', () => {
        expect(EventRegistry).toBeDefined();
        expect(EventRegistry).not.toBeNull();
    });

    it('should register new  event and list all registered event', () => {
        expect(EventRegistry.list()).toEqual([]);

        for(const myEvent of REGISTERED_EVENTS) EventRegistry.register(myEvent);
        
        expect(EventRegistry.list().length).toEqual(REGISTERED_EVENTS.length);
    });

    it('should return true if the method has is called with registered event', () => {
        const UNREGISTERED_EVENT = 'third_event';

        expect(EventRegistry.has(REGISTERED_EVENTS[0])).toBeTruthy();

        expect(EventRegistry.has(UNREGISTERED_EVENT)).toBeFalsy();
    });

    it('should throw an error and not register already registred event', ()=> {
                 
        expect(() => {
            EventRegistry.register(REGISTERED_EVENTS[0]);
        }).toThrow();

        expect(EventRegistry.list().length).toEqual(REGISTERED_EVENTS.length)
    });

    it('should only register alpha event without special character', () => {
        expect(() => {
            EventRegistry.register('user:add');
        }).toThrow();

        expect(() => {
            EventRegistry.register('@lph@');
        }).toThrow();
    });

     it.skip('should return an immutable list of event', () => {
        const event_list = EventRegistry.list();

        expect(() => {
          event_list.slice(0, 1);
        }).toThrow();

     });
})