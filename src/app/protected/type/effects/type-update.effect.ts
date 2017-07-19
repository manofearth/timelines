import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { TypeUpdateAction, TypeUpdateErrorAction, TypeUpdateSuccessAction } from '../type-update-actions';
import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { TypesFirebaseService } from '../../types/types-firebase.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TypeUpdateEffect extends ProtectedFirebaseEffect<TypeUpdateAction,
  TypeUpdateSuccessAction,
  TypeUpdateErrorAction,
  void> {

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireTypes: TypesFirebaseService,
  ) {
    super(actions, auth);
  }

  @Effect()
  effect(): Observable<TypeUpdateSuccessAction | TypeUpdateErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: TypeUpdateAction): Observable<void> {
    return Observable.fromPromise(
      this.fireTypes.getObject(action.payload.id).update(action.payload.data) as Promise<void>
    );
  }

  protected mapToSuccessAction(): TypeUpdateSuccessAction {
    return {
      type: 'TYPE_UPDATE_SUCCESS',
    }
  }

  protected getInterestedActionType(): 'TYPE_UPDATE' {
    return 'TYPE_UPDATE';
  }

  protected getErrorActionType(): 'TYPE_UPDATE_ERROR' {
    return 'TYPE_UPDATE_ERROR';
  }
}
