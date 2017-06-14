import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { EventUpdateAction, EventUpdateErrorAction, EventUpdateSuccessAction } from '../event.reducer';
import { Observable } from 'rxjs/Observable';
import { EventsFirebaseService, FirebaseEventUpdateObject } from '../events-firebase.service';
import { TimelineEvent } from '../../shared/timeline-event';
import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';

@Injectable()
export class EventFirebaseUpdateEffect extends ProtectedFirebaseEffect<EventUpdateAction,
  EventUpdateSuccessAction,
  EventUpdateErrorAction,
  void> {

  @Effect()
  effect(): Observable<EventUpdateSuccessAction | EventUpdateErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: EventUpdateAction): Observable<void> {
    return this.fireEvents
      .updateObject(action.payload.id, toFirebaseEventUpdateObject(action.payload));
  }

  protected getInterestedActionType(): 'EVENT_UPDATE' {
    return 'EVENT_UPDATE';
  }

  protected getErrorActionType(): 'EVENT_UPDATE_ERROR' {
    return 'EVENT_UPDATE_ERROR';
  }

  protected mapToSuccessAction(effectResult: void): EventUpdateSuccessAction {
    return {
      type: 'EVENT_UPDATE_SUCCESS',
    };
  }

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireEvents: EventsFirebaseService,
  ) {
    super(actions, auth);
  }
}

export function toFirebaseEventUpdateObject(event: TimelineEvent): FirebaseEventUpdateObject {
  return {
    title: event.title,
    dateBegin: event.dateBegin,
    dateEnd: event.dateEnd,
  };
}
