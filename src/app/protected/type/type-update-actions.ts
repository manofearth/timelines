import { Action } from '@ngrx/store';
import { TypeKind } from './type-states';

export interface TypeUpdateAction extends Action {
  type: 'TYPE_UPDATE';
  payload: {
    id: string;
    data: {
      title: string;
      kind: TypeKind;
    }
  }
}

export interface TypeUpdateSuccessAction extends Action {
  type: 'TYPE_UPDATE_SUCCESS';
}

export interface TypeUpdateErrorAction extends Action {
  type: 'TYPE_UPDATE_ERROR';
  payload: Error;
}
