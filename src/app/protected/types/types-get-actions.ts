import { Action } from '@ngrx/store';
import { TimelineEventsTypeForList } from './types-states';

export interface TypesGetAction extends Action {
  type: 'TYPES_GET';
  payload?: string; // search query
}

export interface TypesGetSuccessAction extends Action {
  type: 'TYPES_GET_SUCCESS';
  payload: TimelineEventsTypeForList[];
}

export interface TypesGetErrorAction extends Action {
  type: 'TYPES_GET_ERROR';
  payload: Error;
}
