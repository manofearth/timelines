import { Action } from '@ngrx/store';
import { FirebaseTypeUpdateObject } from './types-firebase.service';
import { TimelineEventsType } from '../type/type-states';

export interface TypeCreateAction extends Action {
  type: 'TYPE_CREATE';
  payload: FirebaseTypeUpdateObject;
}

export interface TypeCreateSuccessAction extends Action {
  type: 'TYPE_CREATE_SUCCESS';
  payload: TimelineEventsType;
}

export interface TypeCreateErrorAction extends Action {
  type: 'TYPE_CREATE_ERROR';
  payload: Error;
}
