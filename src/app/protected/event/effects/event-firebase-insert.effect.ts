import { Injectable } from '@angular/core';
import { toError } from '../../shared/firebase/protected-firebase.effect';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { EventsFirebaseService } from '../events-firebase.service';
import { toFirebaseEventUpdateObject } from './event-firebase-update.effect';
import { Action } from '@ngrx/store';
import { isNew } from '../../shared/event/is-new.fn';
import { EventSaveButtonAction } from '../event.component';
import { TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';

@Injectable()
export class EventFirebaseInsertEffect {

  @Effect()
  effect: Observable<EventInsertSuccessAction | EventInsertErrorAction> = this.actions
    .ofType('EVENT_SAVE_BUTTON')
    .filter<EventSaveButtonAction>(action => isNew(action.payload.event))
    .switchMap(action => this.fireEvents
      .pushObject(toFirebaseEventUpdateObject(action.payload.event))
      .switchMap(ref => this.fireTimelines
        .attachEvent(action.payload.timelineId, action.payload.groupId, ref.key)
        .map((): EventInsertSuccessAction => ({
          type: 'EVENT_INSERT_SUCCESS',
          payload: ref.key,
        }))
      )
      .catch(err => Observable.of<EventInsertErrorAction>({
        type: 'EVENT_INSERT_ERROR',
        payload: toError(err),
      }))
    );

  constructor(
    private actions: Actions,
    private fireEvents: EventsFirebaseService,
    private fireTimelines: TimelinesFirebaseService,
  ) {
  }
}

export interface EventInsertSuccessAction extends Action {
  type: 'EVENT_INSERT_SUCCESS';
}

export interface EventInsertErrorAction extends Action {
  type: 'EVENT_INSERT_ERROR';
  payload: Error;
}
