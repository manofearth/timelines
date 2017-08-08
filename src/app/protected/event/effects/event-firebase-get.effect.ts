import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { EventGetAction } from '../event-actions';
import { Observable } from 'rxjs/Observable';
import { EventsFirebaseService, FirebaseTimelineEvent } from '../events-firebase.service';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';

@Injectable()
export class EventFirebaseGetEffect extends ProtectedFirebaseEffect<EventGetAction,
  EventGetSuccessAction,
  EventGetErrorAction,
  FirebaseTimelineEvent> {

  @Effect()
  effect(): Observable<EventGetSuccessAction | EventGetErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: EventGetAction): Observable<FirebaseTimelineEvent> {
    return this.fireEvents.getObject(action.payload);
  }

  protected mapToSuccessAction(effectResult: FirebaseTimelineEvent): EventGetSuccessAction {
    return {
      type: 'EVENT_GET_SUCCESS',
      payload: effectResult,
    };
  }

  protected getInterestedActionType(): 'EVENT_GET' {
    return 'EVENT_GET';
  }

  protected getErrorActionType(): 'EVENT_GET_ERROR' {
    return 'EVENT_GET_ERROR';
  }

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireEvents: EventsFirebaseService,
  ) {
    super(actions, auth);
  }
}

export interface EventGetSuccessAction extends Action {
  type: 'EVENT_GET_SUCCESS';
  payload: FirebaseTimelineEvent;
}

export interface EventGetErrorAction extends Action {
  type: 'EVENT_GET_ERROR';
  payload: Error;
}
