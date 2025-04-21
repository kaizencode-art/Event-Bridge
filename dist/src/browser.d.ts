import { EventRegistry } from './EventRegistry';
declare global {
    interface Window {
        EventRegistry: typeof EventRegistry;
    }
}
