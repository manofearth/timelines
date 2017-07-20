import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { TypeCreateAction, TypeCreateErrorAction, TypeCreateSuccessAction } from '../type-create-actions';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { FirebaseType, TypesFirebaseService } from '../types-firebase.service';
import { toType } from '../../type/effects/type-get.effect';

@Injectable()
export class FirebaseTypeCreateEffect extends ProtectedFirebaseEffect<TypeCreateAction,
  TypeCreateSuccessAction,
  TypeCreateErrorAction,
  FirebaseType> {


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

  protected runEffect(action: TypeCreateAction): Observable<FirebaseType> {
    return this.fireTypes
      .pushObject(action.payload)
      .switchMap(ref => this.fireTypes.getObject(ref.key).first<FirebaseType>());
  }

  protected mapToSuccessAction(type: FirebaseType): TypeCreateSuccessAction {
    return {
      type: 'TYPE_CREATE_SUCCESS',
      payload: toType(type)
    }
  }

  protected getInterestedActionType(): 'TYPE_CREATE' {
    return 'TYPE_CREATE';
  }

  protected getErrorActionType(): 'TYPE_CREATE_ERROR' {
    return 'TYPE_CREATE_ERROR';
  }

}
