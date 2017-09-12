import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { TimelineEvent } from '../../shared/event/timeline-event';
import { TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';
import { flatten } from '../../../shared/helpers';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/skip';
import { EventsFirebaseService } from '../events-firebase.service';
import { toError } from '../../shared/firebase/protected-firebase.effect';

@Injectable()
export class EventFirebaseDeleteEffect {

  @Effect() effect: Observable<EventFirebaseDeleteSuccessAction | EventFirebaseDeleteErrorAction> = this.actions
    .ofType('EVENT_DELETE_BUTTON')
    .withLatestFrom(this.store.select<TimelineEvent>(state => state.event.event), (action, event) => event)
    .switchMap((event: TimelineEvent) => {

      let detachFromTimelines;
      if (Object.keys(event.timelines).length === 0) {
        detachFromTimelines = Observable.of(null);
      } else {
        detachFromTimelines = Observable.forkJoin(
          ...flatten(
            Object.keys(event.timelines).map(timelineId =>
              Object.keys(event.timelines[ timelineId ]).map(groupId =>
                this.fireTimelines.detachEvent(timelineId, groupId, event.id)
              )
            )
          )
        );
      }

      return Observable
        .concat(
          detachFromTimelines,
          this.fireEvents.getObject(event.id).remove()
        )
        .skip(1)
        .map((): EventFirebaseDeleteSuccessAction => ({
          type: 'EVENT_FIREBASE_DELETE_SUCCESS',
        }))
        .catch(err => Observable.of<EventFirebaseDeleteErrorAction>({
          type: 'EVENT_FIREBASE_DELETE_ERROR',
          error: toError(err),
        }));

    });

  constructor(
    private actions: Actions,
    private store: Store<AppState>,
    private fireEvents: EventsFirebaseService,
    private fireTimelines: TimelinesFirebaseService,
  ) {
  }
}

export interface EventFirebaseDeleteSuccessAction extends Action {
  type: 'EVENT_FIREBASE_DELETE_SUCCESS';
}

export interface EventFirebaseDeleteErrorAction extends Action {
  type: 'EVENT_FIREBASE_DELETE_ERROR';
  error: Error;
}
