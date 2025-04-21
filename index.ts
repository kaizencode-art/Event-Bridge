import { EventBus } from "./src/EventBus";
import { EventContractManager } from "./src/EventContractManager";

// 1) Initialize your event contracts
EventContractManager.add("myEvent", 2);
EventContractManager.add("otherEvent", 3);

// 2) Get the singleton bus
const globalBus = EventBus.get();

// 3) Attach them to `window` so other parts of your code can access
window.GlobalEventContractManager = EventContractManager;
window.GlobalEventBus = globalBus;