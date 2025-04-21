var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EventManager } from '../../../src/EventManager';
import { MyEventRegistry } from './my-event.registry';
let CounterApp = class CounterApp extends LitElement {
    constructor() {
        super();
        this.name = `counterApp`;
        this.counter = 0;
    }
    firstUpdated() {
        EventManager.consume(this, MyEventRegistry.CountIncrement, this._handleIncrement);
        EventManager.consume(this, MyEventRegistry.CountDecrement, this._handleDecrement);
    }
    disconnectedCallback() {
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
        if (this.counter > 0)
            this.counter--;
    }
};
__decorate([
    property({ type: Number })
], CounterApp.prototype, "counter", void 0);
CounterApp = __decorate([
    customElement('counter-app')
], CounterApp);
export { CounterApp };
