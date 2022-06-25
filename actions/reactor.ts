import { PullTask, TaskContext } from '@specfocus/spec-focus/tasks/types';
import type { Action } from './action';

export interface ReactorContext extends TaskContext {
  readonly abort: (reason?: any) => void | PromiseLike<void>;
  readonly path: string[]; // path for routing
}

export interface ReactorParams {
  input: AsyncIterable<Action>;
}

export type Reactor<
  Params extends ReactorParams,
  Context extends ReactorContext
> = PullTask<Action, Params, Context>;
