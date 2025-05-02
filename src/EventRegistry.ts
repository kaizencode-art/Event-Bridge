import { z } from 'zod';

// Zod schema to validate event names
export const EventNameSchema = z.string()
    .min(2, "Event name must be a non-empty string")
    .regex(/^[A-Za-z_-]+$/, {
        message: 'Event name must contain letters only (A–Z, a–z)',
    })
    .refine(n => !n.includes(':'), { message: '“:” not allowed in event name' });

// Internal store – private to the module
const _eventRegistry = new Set<string>([]);

// Public API interface
export interface EventRegistryAPI {
    register: (eventName: string) => boolean;
    has: (eventName: string) => boolean;
    list: () => readonly string[];
}

export const EventRegistry: EventRegistryAPI = {
    register(eventName: string): boolean {
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
    
    has(eventName: string): boolean {
        return _eventRegistry.has(eventName);
    },
    
    list(): readonly string[] {
        return Object.freeze([..._eventRegistry]);
    }
};

// Attach it to the window in a locked, typed way
declare global {
    interface Window {
        EventRegistry: EventRegistryAPI;
    }
}

Object.defineProperty(window, 'EventRegistry', {
    value: EventRegistry,
    writable: false,
    configurable: false,
    enumerable: true,
});

export type EventName = z.infer<typeof EventNameSchema>