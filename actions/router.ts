import { nanoid } from 'nanoid';
import type { MultiplexerOptions } from '../async/multiplexer';
import Multiplexer from '../async/multiplexer';
import startsWith from '@specfocus/spec-focus/many/starts-with';
import isEmpty from '@specfocus/spec-focus/many/is-empty';
import type { Action } from './action';
import type { Actor } from './actor';
import type { Abort } from './defaults/abort';
import DEFAULT_ABORT from './defaults/abort';
import type { Heartbeat } from './defaults/heartbeat';
import DEFAULT_HEARTBEAT from './defaults/heartbeat';
import type { Timeout } from './defaults/timeout';
import DEFAULT_TIMEOUT from './defaults/timeout';

const assign = <A extends Action>(target: Partial<A>, { what, ...source }: A): A => Object.assign({
  ...source,
  what: Object.assign({}, what)
});

export interface RouterOptions extends MultiplexerOptions<Abort, Heartbeat, Timeout> {
  controller: AbortController;
  path: string[];
}

/**
 * Action router
 * Keeps tracking of root for routing
 */
class Router<Input extends Action = Action, Output extends Action = Action> extends Multiplexer<Output, Abort, Heartbeat, Timeout> implements Actor {
  static readonly options = <Input extends Action = Action, Output extends Action = Action>(
    path: string[],
    controller: AbortController
  ): RouterOptions => ({
    path,
    controller,
    abort: [controller.signal, assign({ path }, DEFAULT_ABORT)],
    heartbeat: [5, assign({ path }, DEFAULT_HEARTBEAT)],
    timeout: [60, assign({ path }, DEFAULT_TIMEOUT)]
  });
  static readonly create = <Input extends Action = Action, Output extends Action = Action>(
    root: string[],
    controller: AbortController,
    ...actors: Actor<Input, Output>[]
  ): Router<Input, Output> => {
    const id = nanoid();
    const path = [...root, id];
    return new Router(
      new Map<string[], Actor<Input, Output>>(
        actors.map(actor => [[...path, nanoid()],  actor])
      ),
      Router.options(path, controller)
    )
  };

  private readonly _controller: AbortController;
  private readonly _path: string[];

  constructor(
    protected readonly actors: Map<string | string[], Actor<Input, Output>>,
    { controller, path, ...options }: RouterOptions
  ) {
    super(Array.from(actors.values()), options);
    this._controller = controller;
    this._path = [...path];
  }

  public get path() {
    return [...this._path];
  }

  public readonly abort = async (reason?: any): Promise<void> => {
    this._controller.abort(reason);
    // await for all actors to finish
  };

  protected beforeBroadcast = (action: Input): boolean => true;

  protected beforeReject = (action: Input): boolean => true;

  protected beforeResolve = (action: Input): boolean => true;

  private readonly broadcast = (action: Input): void => {
    if (!this.beforeBroadcast(action)) {
      return;
    }
    for (const actor of this.actors.values()) {
      actor.onAction(action);
    }
  }

  protected readonly reject = (action: Input): void => {
    if (!this.beforeReject) {
      return this.broadcast(action);
    }
  };

  protected resolve = (action: Input): void => {
    if (!this.beforeResolve(action)) {
      return;
    }
    const { path } = action;
    for (const [root, actor] of this.actors) {
      if (startsWith(path, root)) {
        actor.onAction(action);
      }
    }
  };

  public onAction = (action: Input): void => {
    if (this._controller.signal.aborted) {
      return;
    }

    const { path } = action;

    if (isEmpty(path)) {
      this.broadcast(action);
    }

    if (!startsWith(path, this._path)) {
      return this.reject(action);
    }

    return this.resolve(action);
  };
}

export default Router;
