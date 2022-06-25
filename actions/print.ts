import { AsyncAction } from './async';

export const PRINT = 'print';

export type PrintActionType = typeof PRINT;

export interface PrintAction extends Omit<AsyncAction, 'atom' | 'type' | 'what'> {
  type: PrintActionType;
  what: PrintWhat;
}

export interface PrintWhat {}
