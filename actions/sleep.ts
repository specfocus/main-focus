import { AsyncAction } from './async';

export const SLEEP = 'sleep';

export type SleepActionType = typeof SLEEP;

export interface SleepAction extends Omit<AsyncAction, 'type' | 'what'> {
  type: SleepActionType;
  what: SleepWhat;
}

export interface SleepWhat {
    // duration
}
