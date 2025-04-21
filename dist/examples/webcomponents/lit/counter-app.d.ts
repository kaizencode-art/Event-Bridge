import { LitElement } from 'lit';
import { NamedEventTarget } from '../../../src/types';
export declare class CounterApp extends LitElement implements NamedEventTarget {
    name: string;
    counter: number;
    constructor();
    firstUpdated(): void;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
    _handleIncrement(): void;
    _handleDecrement(): void;
}
