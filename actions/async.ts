import type { Shape } from '@specfocus/spec-focus/shapes';

export const ASYNC = 'async';

export type AsyncActionType = typeof ASYNC;

export interface AsyncAction {
    atom: string; // recoil
    path: string[]; // to execution scope (see ActionRouter)
    type: AsyncActionType;
    what: AsyncWhat;
    when: number; // time this action was generated
}

export interface AsyncWhat {
  command: string; // rename to something more global
  params: Shape
}