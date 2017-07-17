import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { FirebaseType, TypesFirebaseService } from '../types-firebase.service';
import { TypesGetAction, TypesGetErrorAction, TypesGetSuccessAction } from '../types-get-actions';
import { TimelineEventsTypeForList } from '../types-states';

@Injectable()
export class FirebaseTypesGetEffect extends ProtectedFirebaseEffect<TypesGetAction,
  TypesGetSuccessAction,
  TypesGetErrorAction,
  FirebaseType[]> {

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireTypes: TypesFirebaseService,
  ) {
    super(actions, auth);
  }

  @Effect()
  effect(): Observable<TypesGetSuccessAction | TypesGetErrorAction> {
    return super.createEffect();
  }

  protected modifyActionsObservable(actions: Observable<TypesGetAction>): Observable<TypesGetAction> {
    return actions.take(1);
  }

  protected runEffect(action: TypesGetAction): Observable<FirebaseType[]> {
    return this.fireTypes.getList();
  }

  protected mapToSuccessAction(types: FirebaseType[]): TypesGetSuccessAction {
    return {
      type: 'TYPES_GET_SUCCESS',
      payload: types.map(toType),
    };
  }

  protected getInterestedActionType(): 'TYPES_GET' {
    return 'TYPES_GET';
  }

  protected getErrorActionType(): 'TYPES_GET_ERROR' {
    return 'TYPES_GET_ERROR';
  }

}

function toType(type: FirebaseType): TimelineEventsTypeForList {
  return {
    id: type.$key,
    title: type.title,
  }
}
