import { EventRegistry } from './EventRegistry';

declare global {
  interface Window {
    EventRegistry: typeof EventRegistry;
  }
}

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'EventRegistry', {
    value: EventRegistry,
    writable: false,
    configurable: false
  });
}