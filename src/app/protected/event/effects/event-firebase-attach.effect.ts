import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import {
  EventAttachToTimelineAction,
  EventAttachToTimelineErrorAction,
  EventAttachToTimelineSuccessAction
} from '../event-actions';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { EventToTimelineAttachingFirebaseService } from '../event-to-timeline-attaching-firebase.service';

@Injectable()
export class EventFirebaseAttachEffect extends ProtectedFirebaseEffect<EventAttachToTimelineAction,
  EventAttachToTimelineSuccessAction,
  EventAttachToTimelineErrorAction,
  void> {

  @Effect()
  effect(): Observable<EventAttachToTimelineSuccessAction | EventAttachToTimelineErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: EventAttachToTimelineAction): Observable<void> {
    return this.eventToTimelineAttacher
      .attach(action.payload.timelineId, action.payload.groupId, action.payload.eventId);
  }

  protected mapToSuccessAction(): EventAttachToTimelineSuccessAction {
    return {
      type: 'EVENT_ATTACH_TO_TIMELINE_SUCCESS',
    };
  }

  protected getInterestedActionType(): 'EVENT_ATTACH_TO_TIMELINE' {
    return 'EVENT_ATTACH_TO_TIMELINE';
  }

  protected getErrorActionType(): 'EVENT_ATTACH_TO_TIMELINE_ERROR' {
    return 'EVENT_ATTACH_TO_TIMELINE_ERROR';
  }

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private eventToTimelineAttacher: EventToTimelineAttachingFirebaseService,
  ) {
    super(actions, auth);
  }
}
