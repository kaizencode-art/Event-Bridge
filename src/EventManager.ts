import { EventNameSchema } from './EventRegistry';
import { z } from 'zod';

/**
 * Infos consommateur : on a besoin de savoir
 * - l'objet consumer lui-même
 * - le callback à appeler lors du emit
 */
const ConsumerInfo = z.object({
    consumer: z.unknown().refine(
        (val) => typeof val === 'object' && val !== null && !Array.isArray(val),
        { message: 'Must be a non-null, non-array object' }
    ),
    callback: z.function().args(z.any()).returns(z.void()),
});

export interface NamedEventTarget extends EventTarget {
    name: string;
}

type ConsumerInfo = z.infer<typeof ConsumerInfo>;

type EventState = {
    emitter: NamedEventTarget;
    allowedConsumerCount: Number;  // the number of consumers allow for this event default is one
    consumers: Set<NamedEventTarget>
}

export default class EventManager {

    private static eventStates: Map<EventNameSchema, EventState> = new Map<EventNameSchema, EventState>;

    private static _emit(emitter: NamedEventTarget, event: EventNameSchema, eventDetail: CustomEventInit): void {
        if(emitter && typeof emitter.dispatchEvent === 'function') { 
            emitter.dispatchEvent(new CustomEvent(`${emitter.name}:${event}`, eventDetail));
        } else {
            throw new Error(`emitter can't emit events `);
        }
    }

    public static emit(emitter: NamedEventTarget, event: EventNameSchema, eventDetail: CustomEventInit, consumerCount: Number = 1) {
        const state: EventState = {
            emitter,
            allowedConsumerCount: consumerCount,
            consumers: new Set()
        }
        this.eventStates.set(event, state);
        this._emit(emitter, event, eventDetail);
    }

    public static consume(consumer: NamedEventTarget, event: EventNameSchema, callback: (playload: any) => void): void {
        if(!this.eventStates.has(event)) {
            throw new Error(`Cant consume event on no emitter`);
        }

        const state = this.eventStates.get(event);

        if(state?.consumers.size === state?.allowedConsumerCount) {
            throw new Error(`More consumer registered than allowed`);
        }

        // we add eventlistener but for the moment there's no mechanisme to auto remove eventListener
        consumer.addEventListener(`${state?.emitter.name}:${event}`, callback)
    }

    // à appeler dans le `disconnectedCallback` au retrait de l'élément du dom 
    public static removeConsume(consumer: NamedEventTarget, event: EventNameSchema, callback: (playload: any) => void): void {
        if(!this.eventStates.has(event)) {
            throw new Error(`Can't remove consumer on event with no emitter`);
        }

        const state = this.eventStates.get(event);

        consumer.removeEventListener(`${state?.emitter.name}:${event}`, callback);
    }
}