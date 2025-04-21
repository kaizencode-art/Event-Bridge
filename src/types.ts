import { z } from 'zod';
import { EventNameSchema } from "./EventRegistry";

export type EventName = z.infer<typeof EventNameSchema>
export interface NamedEventTarget extends EventTarget {
  name: string;
}

export type EventHandler<T = unknown> = (event: CustomEvent<T>) => void;