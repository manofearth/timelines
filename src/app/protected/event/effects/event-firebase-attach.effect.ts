import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { EventToTimelineAttachingFirebaseService } from '../event-to-timeline-attaching-firebase.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { TimelineState } from '../../timeline/timeline-states';
import { toError } from '../../shared/firebase/protected-firebase.effect';
import { EventAttachToTimelineErrorAction, EventAttachToTimelineSuccessAction } from '../event-actions';

@Injectable()
export class EventFirebaseAttachEffect {

  @Effect() effect = this.actions
    .ofType('TIMELINE_EVENT_SELECTED')
    .withLatestFrom(this.store.select<TimelineState>(state => state.timeline))
    .switchMap(([action, timelineState]): Observable<EventAttachToTimelineSuccessAction | EventAttachToTimelineErrorAction> =>
      this.eventToTimelineAttacher
        .attach(
          timelineState.timeline.id,
          timelineState.timeline.groups[timelineState.currentGroupIndex].id,
          action.payload.id
        )
        .map(() => ({
          type: 'EVENT_ATTACH_TO_TIMELINE_SUCCESS',
        }))
        .catch(err => Observable.of({
          type: 'EVENT_ATTACH_TO_TIMELINE_ERROR',
          payload: toError(err),
        }))
    );

  constructor(
    private actions: Actions,
    private store: Store<AppState>,
    private eventToTimelineAttacher: EventToTimelineAttachingFirebaseService,
  ) {
  }
}
