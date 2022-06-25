import type { Action } from './action';

export interface Reaction<T extends Action = Action> extends AsyncIterable<T> {
  path: string[];
  abort: (reason?: any) => void | PromiseLike<void>;
}
