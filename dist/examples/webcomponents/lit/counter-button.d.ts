import { LitElement } from 'lit';
import { MyEventRegistry } from './my-event.registry';
import { NamedEventTarget } from '../../../src/types';
export declare class CounterButton extends LitElement implements NamedEventTarget {
    name: string;
    buttonLabel: string;
    buttonEvent: MyEventRegistry;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
    _handleClick(): void;
}
