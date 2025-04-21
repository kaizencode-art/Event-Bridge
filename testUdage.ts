
import { EventBus } from "./src/EventBus";
import { EventContractManager } from "./src/EventContractManager";

const bus = EventBus.get();
EventContractManager.add("myEvent", 1);
const contract = EventContractManager.get("myEvent");

const emitter = { id: "EmitterA" };
const consumer = { id: "Consumer1" };

bus.consume(contract, consumer, (payload: any) => {
  console.log("Consumer received:", payload);
});

bus.emit(contract, emitter, { msg: "Hello!" });
