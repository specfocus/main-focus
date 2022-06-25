import { AsyncAction } from './async';

export const THROW = 'throw';

export type ThrowActionType = typeof THROW;

export interface ThrowAction extends Omit<AsyncAction, 'type' | 'what'> {
  type: ThrowActionType;
  what: ThrowWhat;
  // what: Error['message'] | Pick<Error, 'message' | 'name' | 'cause'>,
  where: Error['stack'];
  /*
  what: string; // what function failed
  who: string; // [module/class/function]
  when: string; // process description
  where: string; // line number/stack trace
  why: string; // error code/message
  */
}

export interface ThrowWhat { }
