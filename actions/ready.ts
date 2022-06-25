import { AsyncAction } from './async';

export const READY = 'ready';

export type ReadyActionType = typeof READY;

export interface ReadyAction extends Omit<AsyncAction, 'type' | 'what'> {
  type: ReadyActionType;
  what: ReadyWhat;
  when: number;
}

export interface ReadyWhat {}
