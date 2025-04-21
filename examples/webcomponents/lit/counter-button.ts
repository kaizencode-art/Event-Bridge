import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {EventManager } from '../../../src/EventManager';
import { MyEventRegistry } from './my-event.registry';
import { NamedEventTarget } from '../../../src/types';


@customElement('counter-button')
export class CounterButton extends LitElement implements NamedEventTarget{
    name: string = `counterButton`;

    @property({type: String}) buttonLabel!: string;
    @property({type: String}) buttonEvent!: MyEventRegistry;

    connectedCallback() {
        super.connectedCallback();
        EventManager.registerEmitter(this, this.buttonEvent);
    }

    render() {
        return html`
            <button @click=${this._handleClick}>${this.buttonLabel}</button>
        `
    }

    _handleClick() {
        EventManager.dispatch(this, this.buttonEvent, {bubbles: true, composed: true});
    }
}
