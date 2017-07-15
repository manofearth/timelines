import { Action } from '@ngrx/store';

export interface TypesGetAction extends Action {
  type: 'TYPES_GET';
}

export interface TypesGetSuccessAction extends Action {
  type: 'TYPES_GET_SUCCESS';
}

export interface TypesGetErrorAction extends Action {
  type: 'TYPES_GET_ERROR';
  payload: Error;
}
