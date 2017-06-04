import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/protected-firebase.effect';
import { EventDetachAction, EventDetachErrorAction, EventDetachSuccessAction } from '../event.reducer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import { Actions } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/auth-firebase.service';
import { EventsFirebaseService } from '../events-firebase.service';
import { TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';

@Injectable()
export class EventFirebaseDetachEffect extends ProtectedFirebaseEffect<'EVENT_DETACH',
  EventDetachAction,
  EventDetachSuccessAction,
  'EVENT_DETACH_ERROR',
  EventDetachErrorAction,
  void> {

  protected runEffect(action: EventDetachAction): Observable<void> {
    return Observable
      .forkJoin(
        this.fireTimelines.detachEvent(action.payload.timelineId, action.payload.eventId),
        this.fireEvents.detachFromTimeline(action.payload.eventId, action.payload.timelineId),
      )
      .map(() => {
      });
  }

  protected mapToSuccessAction(effectResult: void): EventDetachSuccessAction {
    return {
      type: 'EVENT_DETACH_SUCCESS',
    };
  }

  protected get interestedActionType(): 'EVENT_DETACH' {
    return 'EVENT_DETACH';
  }

  protected get errorActionType(): 'EVENT_DETACH_ERROR' {
    return 'EVENT_DETACH_ERROR';
  }

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireEvents: EventsFirebaseService,
    private fireTimelines: TimelinesFirebaseService,
  ) {
    super(actions, auth);
  }
}
