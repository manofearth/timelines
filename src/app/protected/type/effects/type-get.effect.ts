import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { TypeGetAction, TypeGetErrorAction, TypeGetSuccessAction } from '../type-get-actions';
import { Observable } from 'rxjs/Observable';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { Actions, Effect } from '@ngrx/effects';
import { FirebaseType, TypesFirebaseService } from '../../types/types-firebase.service';
import { TimelineEventsType, TypeKind } from '../type-states';

@Injectable()
export class TypeGetEffect extends ProtectedFirebaseEffect<TypeGetAction,
  TypeGetSuccessAction,
  TypeGetErrorAction,
  FirebaseType> {

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireTypes: TypesFirebaseService,
  ) {
    super(actions, auth);
  }

  @Effect()
  effect(): Observable<TypeGetSuccessAction | TypeGetErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: TypeGetAction): Observable<FirebaseType> {
    return this.fireTypes.getObject(action.payload);
  }

  protected mapToSuccessAction(type: FirebaseType): TypeGetSuccessAction {
    return {
      type: 'TYPE_GET_SUCCESS',
      payload: toType(type),
    }
  }

  protected getInterestedActionType(): 'TYPE_GET' {
    return 'TYPE_GET';
  }

  protected getErrorActionType(): 'TYPE_GET_ERROR' {
    return 'TYPE_GET_ERROR';
  }
}

export function toType(fireType: FirebaseType): TimelineEventsType {
  return {
    id: fireType.$key,
    title: fireType.title,
    kind: fireType.kind as TypeKind,
    eventsCount: fireType.events ? Object.keys(fireType.events).length : 0,
  }
}
