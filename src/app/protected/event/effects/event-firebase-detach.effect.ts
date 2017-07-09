import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { EventDetachAction, EventDetachErrorAction, EventDetachSuccessAction } from '../event-actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { EventsFirebaseService } from '../events-firebase.service';
import { TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';

@Injectable()
export class EventFirebaseDetachEffect extends ProtectedFirebaseEffect<EventDetachAction,
  EventDetachSuccessAction,
  EventDetachErrorAction,
  void> {

  @Effect()
  effect(): Observable<EventDetachSuccessAction | EventDetachErrorAction> {
    return super.createEffect();
  }

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

  protected getInterestedActionType(): 'EVENT_DETACH' {
    return 'EVENT_DETACH';
  }

  protected getErrorActionType(): 'EVENT_DETACH_ERROR' {
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
