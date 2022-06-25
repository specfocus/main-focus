import { AsyncAction } from './async';

export const SWIPE = 'swipe';

export type SwipeActionType = typeof SWIPE;

export interface SwipeAction extends Omit<AsyncAction, 'type' | 'what'> {
  type: SwipeActionType;
  what: SwipeWhat;
}

export interface SwipeWhat {
    // duration
}
