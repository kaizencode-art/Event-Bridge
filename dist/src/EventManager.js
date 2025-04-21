export class EventManager {
    //maybe weakmap could resolve the cleaning of eventState on element removed from the dom 
    static { this.eventStates = new Map(); }
    static { this.index = new Map(); } // one emitter per event <emitter, eventName>
    static _fullyQualifiedEventName(eventState, event) {
        return `${eventState.emitter.name}:${event}`;
    }
    static dispatch(emitter, event, eventDetail) {
        if (!window.EventRegistry.has(event))
            throw new Error(`Can't emit on ${event} unregistered event`);
        const state = this.eventStates.get(event);
        if (!emitter || !state || state.emitter !== emitter)
            throw new Error(`Can't dispatch on unregistered  ${event} or invalid emitter `);
        if (emitter && typeof emitter.dispatchEvent === 'function') {
            emitter.dispatchEvent(new CustomEvent(this._fullyQualifiedEventName(state, event), eventDetail));
        }
        else {
            throw new Error(`emitter can't emit events `);
        }
    }
    static registerEmitter(emitter, event, consumerCount = 1) {
        if (!emitter || !emitter.name || emitter.name === null || emitter.name.length <= 0)
            throw new Error(`Invalid emitter for registration`);
        if (consumerCount <= 0)
            throw new Error(`${event} must allow at least one consumer`);
        if (!window.EventRegistry.has(event))
            throw new Error(`Can't emit on ${event} unregistered event`);
        if (this.eventStates.has(event))
            throw new Error(`${event}: has already an emitter`);
        this.eventStates.set(event, {
            emitter,
            allowedConsumerCount: consumerCount,
            consumers: new Set()
        });
        this.index.set(emitter.name, event);
        // this._emit(emitter, event, eventDetail);
    }
    static consume(consumer, event, callback) {
        if (!this.eventStates.has(event))
            throw new Error(`Cant consume event on no emitter`);
        const state = this.eventStates.get(event);
        if (state.consumers.has(consumer))
            throw new Error(`${consumer.name} is already registered as a consumer`);
        if (state.consumers.size === state.allowedConsumerCount)
            throw new Error(`More consumer registered than allowed`);
        state.consumers.add(consumer);
        consumer.addEventListener(this._fullyQualifiedEventName(state, event), callback);
    }
    // à appeler dans le `disconnectedCallback` au retrait de l'élément du dom 
    static removeConsume(consumer, event, callback) {
        if (!this.eventStates.has(event))
            throw new Error(`Can't remove consumer on event with no emitter`);
        const state = this.eventStates.get(event);
        state.consumers.delete(consumer);
        consumer.removeEventListener(this._fullyQualifiedEventName(state, event), callback);
    }
}
