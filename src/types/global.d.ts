// global.d.ts

import { EventBus } from "./path/to/EventBus";
import { EventContractManager } from "./path/to/EventContractManager";

declare global {
  interface Window {
    GlobalEventBus?: EventBus;
    GlobalEventContractManager?: typeof EventContractManager;
  }
}
