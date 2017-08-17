import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EventsFirebaseService, FirebaseTimelineEvent } from '../events-firebase.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { TimelineEventClickAction } from '../../timeline/events/timeline-events-table.component';
import { toError } from '../../shared/firebase/protected-firebase.effect';
import { FirebaseType, TypesFirebaseService } from '../../types/types-firebase.service';
import { ChartBarClickAction } from '../../chart/chart.component';

@Injectable()
export class EventFirebaseGetEffect {

  @Effect()
  effect: Observable<EventGetSuccessAction | EventGetErrorAction> = this.actions
    .ofType('TIMELINE_EVENT_CLICK', 'CHART_BAR_CLICK')
    .switchMap((action: TimelineEventClickAction | ChartBarClickAction) => this.fireEvents
      .getObject(action.payload.eventId)
      .switchMap((fireEvent: FirebaseTimelineEvent) => this.fireTypes
        .getObject(fireEvent.typeId)
        .map((type: FirebaseType) => ({
          event: fireEvent,
          type: type,
        }))
      )
      .map(eventAndType => ({
        type: 'EVENT_GET_SUCCESS',
        payload: eventAndType,
      }))
      .catch(err => Observable.of<EventGetErrorAction>({
        type: 'EVENT_GET_ERROR',
        payload: toError(err),
      }))
    );

  constructor(
    private actions: Actions,
    private fireEvents: EventsFirebaseService,
    private fireTypes: TypesFirebaseService,
  ) {
  }
}

export interface EventGetSuccessAction extends Action {
  type: 'EVENT_GET_SUCCESS';
  payload: {
    event: FirebaseTimelineEvent,
    type: FirebaseType,
  };
}

export interface EventGetErrorAction extends Action {
  type: 'EVENT_GET_ERROR';
  payload: Error;
}
