import { AsyncAction } from './async';

export const WATCH = 'watche';

export type WatchActionType = typeof WATCH;

export interface WatchAction extends Omit<AsyncAction, 'type' | 'what'> {
  type: WatchActionType;
  what: WatchWhat;
}

export interface WatchWhat {
}