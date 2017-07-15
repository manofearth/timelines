import { Action } from '@ngrx/store';
import { FirebaseTypeUpdateObject } from './types-firebase.service';

export interface TypeCreateAction extends Action {
  type: 'TYPE_CREATE';
  payload: FirebaseTypeUpdateObject;
}

export interface TypeCreateSuccessAction extends Action {
  type: 'TYPE_CREATE_SUCCESS';
  payload: {
    key: string;
  }
}

export interface TypeCreateErrorAction extends Action {
  type: 'TYPE_CREATE_ERROR';
  payload: Error;
}

export type TypeAction = TypeCreateAction | TypeCreateSuccessAction | TypeCreateErrorAction;
