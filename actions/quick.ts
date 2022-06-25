import { AsyncAction } from './async';

export const QUICK = 'quick';

export type QuickActionType = typeof QUICK;

export interface QuickAction extends Omit<AsyncAction, 'atom' | 'type' | 'what'> {
  type: QuickActionType;
  what: QuickWhat;
}

export interface QuickWhat {}
