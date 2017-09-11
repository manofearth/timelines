import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import { EventToTimelineAttachingFirebaseService } from '../event-to-timeline-attaching-firebase.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { TimelineState } from '../../timeline/timeline-states';
import { toError } from '../../shared/firebase/protected-firebase.effect';
import { EventAttachToTimelineErrorAction, EventAttachToTimelineSuccessAction } from '../event-actions';
import { TimelineEventSelectedAction } from '../../timeline/events/timeline-events-table.component';
import { EventInsertSuccessAction } from './event-firebase-insert.effect';

@Injectable()
export class EventFirebaseAttachEffect {

  private timelineEventSelection$: Observable<EventToAttach> = this.actions
    .ofType('TIMELINE_EVENT_SELECTED')
    .withLatestFrom(
      this.store.select<TimelineState>(state => state.timeline),
      (action: TimelineEventSelectedAction, state: TimelineState) => ({
        eventId: action.payload.id,
        timelineId: state.timeline.id,
        groupId: state.timeline.groups[ state.currentGroupIndex ].id,
      }));

  private timelineInsert$: Observable<EventToAttach> = this.actions
    .ofType('EVENT_INSERT_SUCCESS')
    .filter<EventInsertSuccessAction>(action =>
      action.payload.timelineId !== undefined && action.payload.groupId !== undefined
    )
    .map(action => action.payload);

  @Effect() effect = Observable
    .merge(
      this.timelineEventSelection$,
      this.timelineInsert$,
    )
    .switchMap((eventToAttach): Observable<EventAttachToTimelineSuccessAction | EventAttachToTimelineErrorAction> =>
      this.eventToTimelineAttacher
        .attach(
          eventToAttach.timelineId,
          eventToAttach.groupId,
          eventToAttach.eventId,
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

interface EventToAttach {
  eventId: string;
  timelineId: string;
  groupId: string;
}
