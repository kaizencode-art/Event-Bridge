import { z } from 'zod';

// Zod schema to validate event names
const EventNameSchema = z.string().min(1, "Event name must be a non-empty string");

// Internal store – private to the module
const _eventRegistry = new Set<string>([]);

// Public API interface
export interface EventRegistryAPI {
    register: (eventName: unknown) => boolean;
    has: (eventName: string) => boolean;
    list: () => readonly string[];
}

const EventRegistry: EventRegistryAPI = {
    register(eventName: unknown): boolean {
        const result = EventNameSchema.safeParse(eventName);
        if (!result.success) {
            console.error(`Invalid event name: ${result.error.format()}`);
            return false;
        }
        
        const name = result.data;
        
        if (_eventRegistry.has(name)) {
            throw new Error(`Event already registered: ${name}`);
            return false;
        }
        
        _eventRegistry.add(name);
        return true;
    },
    
    has(eventName: string): boolean {
        return _eventRegistry.has(eventName);
    },
    
    list(): readonly string[] {
        return Array.from(_eventRegistry);
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

export type EventNameSchema = z.infer<typeof EventNameSchema>