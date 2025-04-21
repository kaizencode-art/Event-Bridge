import { EventName } from './EventRegistry';
import { NamedEventTarget } from './types';
export declare class EventManager {
    private static readonly eventStates;
    private static readonly index;
    private static _fullyQualifiedEventName;
    static dispatch(emitter: NamedEventTarget, event: EventName, eventDetail: CustomEventInit): void;
    static registerEmitter(emitter: NamedEventTarget, event: EventName, consumerCount?: number): void;
    static consume(consumer: NamedEventTarget, event: EventName, callback: EventListener): void;
    static removeConsume(consumer: NamedEventTarget, event: EventName, callback: EventListener): void;
}
