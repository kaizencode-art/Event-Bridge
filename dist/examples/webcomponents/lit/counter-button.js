var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EventManager } from '../../../src/EventManager';
let CounterButton = class CounterButton extends LitElement {
    constructor() {
        super(...arguments);
        this.name = `counterButton`;
    }
    connectedCallback() {
        super.connectedCallback();
        EventManager.registerEmitter(this, this.buttonEvent);
    }
    render() {
        return html `
            <button @click=${this._handleClick}>${this.buttonLabel}</button>
        `;
    }
    _handleClick() {
        EventManager.dispatch(this, this.buttonEvent, { bubbles: true, composed: true });
    }
};
__decorate([
    property({ type: String })
], CounterButton.prototype, "buttonLabel", void 0);
__decorate([
    property({ type: String })
], CounterButton.prototype, "buttonEvent", void 0);
CounterButton = __decorate([
    customElement('counter-button')
], CounterButton);
export { CounterButton };
