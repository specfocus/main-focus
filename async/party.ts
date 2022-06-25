import { AlertAction, Action } from '../actions';

export interface Party {
  input: AsyncIterable<Action>;
  output: (message: Action) => Promise<void | AlertAction>;
}