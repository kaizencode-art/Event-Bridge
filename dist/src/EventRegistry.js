import { z } from 'zod';
// Zod schema to validate event names
export const EventNameSchema = z.string()
    .min(1, "Event name must be a non-empty string")
    .refine(n => !n.includes(':'), { message: '“:” not allowed in event name' });
// Internal store – private to the module
const _eventRegistry = new Set([]);
export const EventRegistry = {
    register(eventName) {
        const result = EventNameSchema.safeParse(eventName);
        if (!result.success) {
            throw new Error(`Invalid event name: ${result.error.format()}`);
        }
        const name = result.data;
        if (_eventRegistry.has(name)) {
            throw new Error(`Event already registered: ${name}`);
        }
        _eventRegistry.add(name);
        return true;
    },
    has(eventName) {
        return _eventRegistry.has(eventName);
    },
    list() {
        return Object.freeze([..._eventRegistry]);
    }
};
Object.defineProperty(window, 'EventRegistry', {
    value: EventRegistry,
    writable: false,
    configurable: false,
    enumerable: true,
});
