import { z } from 'zod';
export declare const EventNameSchema: z.ZodEffects<z.ZodString, string, string>;
export interface EventRegistryAPI {
    register: (eventName: string) => boolean;
    has: (eventName: string) => boolean;
    list: () => readonly string[];
}
export declare const EventRegistry: EventRegistryAPI;
declare global {
    interface Window {
        EventRegistry: EventRegistryAPI;
    }
}
export type EventName = z.infer<typeof EventNameSchema>;
