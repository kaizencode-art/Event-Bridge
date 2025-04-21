import {html, LitElement} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { NamedEventTarget } from '../../../src/types';

@customElement('counter-panel')
export class CounterPanel extends LitElement implements NamedEventTarget {
    name: string = `counterPanel`;

    @property({type: String}) count!: string;

    render() {
        return html ` 
            <div id="panel">
                <p>${this.count}</p>
            </div>
        `
    }


}