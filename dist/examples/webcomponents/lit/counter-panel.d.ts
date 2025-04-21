import { LitElement } from 'lit';
import { NamedEventTarget } from '../../../src/types';
export declare class CounterPanel extends LitElement implements NamedEventTarget {
    name: string;
    count: string;
    render(): import("lit-html").TemplateResult<1>;
}
