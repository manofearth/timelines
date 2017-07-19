import { Action } from '@ngrx/store';
import { TimelineEventsType } from './type-states';

export interface TypeGetAction extends Action {
  type: 'TYPE_GET';
  payload: string; // type id
}

export interface TypeGetSuccessAction extends Action {
  type: 'TYPE_GET_SUCCESS';
  payload: TimelineEventsType;
}

export interface TypeGetErrorAction extends Action {
  type: 'TYPE_GET_ERROR';
  payload: Error;
}

