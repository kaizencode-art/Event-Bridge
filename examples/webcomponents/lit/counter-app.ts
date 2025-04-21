import {html, LitElement} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EventManager } from '../../../src/EventManager';
import { MyEventRegistry } from './my-event.registry';
import { NamedEventTarget } from '../../../src/types';

@customElement('counter-app')
export class CounterApp extends LitElement implements NamedEventTarget{
    name = `counterApp`;
    @property({type: Number}) counter!: number;

    constructor() {
        super();
        this.counter = 0;
    }

    firstUpdated(): void {
        EventManager.consume(this, MyEventRegistry.CountIncrement, this._handleIncrement);
        EventManager.consume(this, MyEventRegistry.CountDecrement, this._handleDecrement);

    }


    disconnectedCallback(): void {
        EventManager.removeConsume(this, MyEventRegistry.CountIncrement, this._handleIncrement);
        EventManager.removeConsume(this, MyEventRegistry.CountDecrement, this._handleDecrement);
    }

    render() {
        return html ` 
            <counter-panel count=${this.counter.toString()}></counter-panel>
            <counter-button buttonLabel="Increment" .buttonEvent=${MyEventRegistry.CountIncrement}></counter-button>
            <counter-button buttonLabel="Decrement" .buttonEvent=${MyEventRegistry.CountDecrement}></counter-button>
        `;
    }

    _handleIncrement() {
        this.counter++;
    }

    _handleDecrement() {
        if(this.counter > 0) this.counter--;
    }
}