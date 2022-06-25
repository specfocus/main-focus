import { AsyncAction } from './async';

export const ROUTE = 'route';

export type RouteActionType = typeof ROUTE;

export interface RouteAction extends Omit<AsyncAction, 'type' | 'what'> {
  type: RouteActionType;
  what: RouteWhat;
}

export interface RouteWhat {}
