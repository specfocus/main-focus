import type { Action } from './action';
import type { Reaction } from './reaction';

/**                               action consumer
 *  | request -> middleware -> [ enqueue | iterator ] -> output => middleware -> response |
 */
export interface Actor<Input extends Action = Action, Output extends Action = Action> extends Reaction<Output> {
  onAction: (action: Input) => PromiseLike<void>;
};
