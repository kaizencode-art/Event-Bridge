import { EventRegistry } from './EventRegistry';
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'EventRegistry', {
        value: EventRegistry,
        writable: false,
        configurable: false
    });
}
