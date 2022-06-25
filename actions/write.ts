import { AsyncAction } from './async';

export const WRITE = 'write';

export type WriteActionType = typeof WRITE;

export interface WriteAction extends Omit<AsyncAction, 'type' | 'what'> {
  type: WriteActionType;
  what: WriteWhat;
}

export interface WriteWhat {}
