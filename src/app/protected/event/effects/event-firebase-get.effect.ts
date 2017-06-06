import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { EventGetAction, EventGetErrorAction, EventGetSuccessAction } from '../event.reducer';
import { Observable } from 'rxjs/Observable';
import { EventsFirebaseService, FirebaseTimelineEvent } from '../events-firebase.service';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { TimelineEvent } from '../../shared/timeline-event';
import { Actions } from '@ngrx/effects';

@Injectable()
export class EventFirebaseGetEffect extends ProtectedFirebaseEffect<'EVENT_GET',
  EventGetAction,
  EventGetSuccessAction,
  'EVENT_GET_ERROR',
  EventGetErrorAction,
  FirebaseTimelineEvent> {

  protected runEffect(action: EventGetAction): Observable<FirebaseTimelineEvent> {
    return this.fireEvents.getObject(action.payload);
  }

  protected mapToSuccessAction(effectResult: FirebaseTimelineEvent): EventGetSuccessAction {
    return {
      type: 'EVENT_GET_SUCCESS',
      payload: toTimelineEvent(effectResult),
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

function toTimelineEvent(firebaseEvent: FirebaseTimelineEvent): TimelineEvent {
  return {
    id: firebaseEvent.$key,
    title: firebaseEvent.title,
    dateBegin: firebaseEvent.dateBegin,
    dateEnd: firebaseEvent.dateEnd,
  };
}
