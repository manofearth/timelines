import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { TypeCreateAction, TypeCreateErrorAction, TypeCreateSuccessAction } from '../type-create-actions';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { TypesFirebaseService } from '../types-firebase.service';

@Injectable()
export class FirebaseTypeCreateEffect extends ProtectedFirebaseEffect<TypeCreateAction,
  TypeCreateSuccessAction,
  TypeCreateErrorAction,
  firebase.database.Reference> {


  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireTypes: TypesFirebaseService,
  ) {
    super(actions, auth);
  }

  @Effect()
  effect(): Observable<TypeCreateSuccessAction | TypeCreateErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: TypeCreateAction): Observable<firebase.database.Reference> {
    return this.fireTypes.pushObject(action.payload);
  }

  protected mapToSuccessAction(effectResult: firebase.database.Reference): TypeCreateSuccessAction {
    return {
      type: 'TYPE_CREATE_SUCCESS',
      payload: {
        key: effectResult.key,
      },
    };
  }

  protected getInterestedActionType(): 'TYPE_CREATE' {
    return 'TYPE_CREATE';
  }

  protected getErrorActionType(): 'TYPE_CREATE_ERROR' {
    return 'TYPE_CREATE_ERROR';
  }

}
