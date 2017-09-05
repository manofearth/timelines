import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { TypesFirebaseService } from '../../types/types-firebase.service';
import { TypeDeleteButtonAction } from '../type.component';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { toError } from '../../shared/firebase/protected-firebase.effect';

@Injectable()
export class TypeDeleteEffect {

  @Effect() effect = this.actions
    .ofType('TYPE_DELETE_BUTTON')
    .switchMap((action: TypeDeleteButtonAction): Observable<TypeDeleteEffectAction> => this.fireTypes
      .removeObject(action.payload.id)
      .map((): TypeDeleteSuccessAction => ({
        type: 'TYPE_DELETE_SUCCESS',
        payload: {
          id: action.payload.id,
        }
      }))
      .catch(err => Observable.of<TypeDeleteErrorAction>({
        type: 'TYPE_DELETE_ERROR',
        payload: toError(err),
      }))
    );

  constructor(
    private actions: Actions,
    private fireTypes: TypesFirebaseService,
  ) {
  }
}

export interface TypeDeleteSuccessAction extends Action {
  type: 'TYPE_DELETE_SUCCESS';
  payload: {
    id: string;
  }
}

export interface TypeDeleteErrorAction extends Action {
  type: 'TYPE_DELETE_ERROR';
  payload: Error;
}

type TypeDeleteEffectAction = TypeDeleteSuccessAction | TypeDeleteErrorAction;
