import { Action } from '@ngrx/store';
import { TimelineEventsType } from '../type/type-states';

export interface TypeCreateSuccessAction extends Action {
  type: 'TYPE_CREATE_SUCCESS';
  payload: TimelineEventsType;
}

export interface TypeCreateErrorAction extends Action {
  type: 'TYPE_CREATE_ERROR';
  payload: Error;
}
