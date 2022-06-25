import { AsyncAction } from './async';

export const ALERT = 'alert';

export type AlertActionType = typeof ALERT;

export interface Alert extends Omit<AsyncAction, 'atom' | 'type' | 'what'> {
  type: AlertActionType;
  what: string;
}

/** completion */
export interface DoneAlert extends Alert {
  why: 'done';
  where: number; // from 0 to 1 completion
}

export interface FailAlert extends Alert {
  why: 'fail';
}

export interface IdleAlert extends Alert {
  why: 'idle';
}

export interface InfoAlert extends Alert {
  why: 'info';
  // when: number; // it is already in the action
  where?: string;
  who?: string;
}

/** email */
export interface MailAlert extends Alert {
  why: 'mail';
  who: string; // recipient
}

/**  */
export interface QuitAlert extends Alert {
  why: 'quit';
}

export interface SkipAlert extends Alert {
  why: 'skip';
}

/** MSM message or other */
export interface TextAlert extends Alert  {
  why: 'text';
  who: string; // recipient
}

export type AlertAction =
  | DoneAlert
  | FailAlert
  | IdleAlert
  | InfoAlert
  | MailAlert
  | QuitAlert
  | SkipAlert
  | TextAlert;

export const done = (what: string, where: number = 1, root?: Pick<AsyncAction, 'path'>): AlertAction => ({
  path: root?.path || [],
  type: ALERT,
  what,
  when: Date.now(),
  where,
  why: 'done'
});
export const fail = (what: string, root?: Pick<AsyncAction, 'path'>): AlertAction => ({
  path: root?.path || [],
  type: ALERT,
  what,
  when: Date.now(),
  why: 'fail'
});

export const idle = (what: string, root?: Pick<AsyncAction, 'path'>): AlertAction => ({
  path: root?.path || [],
  type: ALERT,
  what,
  when: Date.now(),
  why: 'idle',
});

export const info = (what: string, root?: Pick<AsyncAction, 'path'>): AlertAction => ({
  path: root?.path || [],
  type: ALERT,
  what,
  when: Date.now(),
  why: 'info'
});


export const init = (what: string, root?: Pick<AsyncAction, 'path'>): AlertAction => ({
  path: root?.path || [],
  type: ALERT,
  what,
  where: 0,
  when: Date.now(),
  why: 'done',
});

export const mail = (what: string, who: string, root?: Pick<AsyncAction, 'path'>): AlertAction => ({
  path: root?.path || [],
  type: ALERT,
  what,
  when: Date.now(),
  who,
  why: 'mail'
});

export const quit = (what: string, root?: Pick<AsyncAction, 'path'>): AlertAction => ({
  path: root?.path || [],
  type: ALERT,
  what,
  when: Date.now(),
  why: 'quit',
});

export const skip = (what: string, root?: Pick<AsyncAction, 'path'>): AlertAction => ({
  path: root?.path || [],
  type: ALERT,
  what,
  when: Date.now(),
  why: 'skip',
});

export const text = (what: string, who: string, root?: Pick<AsyncAction, 'path'>): AlertAction => ({
  path: root?.path || [],
  type: ALERT,
  what,
  when: Date.now(),
  who,
  why: 'text',
});