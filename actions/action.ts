import { ALERT, type AlertAction } from './alert';
import { ASYNC, type AsyncAction } from './async';
import { PRINT, type PrintAction } from './print';
import { READY, type ReadyAction } from './ready';
import { ROUTE, type RouteAction } from './route';
import { SWIPE, type SwipeAction } from './swipe';
import { VOICE, type VoiceAction } from './voice';
import { WATCH, type WatchAction } from './watch';
import { WRITE, type WriteAction } from './write';

export const ACTION_TYPES = [
  ALERT,
  ASYNC,
  PRINT,
  SWIPE,
  READY,
  ROUTE,
  VOICE,
  WATCH,
  WRITE
] as const;

export type ActionType = typeof ACTION_TYPES[number];

export type Action =
  | AlertAction
  | AsyncAction
  | PrintAction
  | SwipeAction
  | ReadyAction
  | RouteAction
  | VoiceAction
  | WatchAction
  | WriteAction;

export const action = <T extends Action>(type: ActionType, partial: Partial<T>, root?: Pick<AsyncAction, 'path'>): T => ({
  path: root?.path || [],
  type,
  when: Date.now(),
  ...partial
}) as T;

const isShape = (val: unknown): val is Record<string, any> =>
  typeof val === 'object' && val !== null && !Array.isArray(val);

export const isAction = (val: unknown): val is Action =>
  isShape(val) && typeof val.type === 'string';
