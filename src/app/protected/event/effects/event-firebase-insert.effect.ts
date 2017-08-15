import { Injectable } from '@angular/core';
import { toError } from '../../shared/firebase/protected-firebase.effect';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { EventsFirebaseService } from '../events-firebase.service';
import { toFirebaseEventUpdateObject } from './event-firebase-update.effect';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { isNew } from '../../shared/event/is-new.fn';
import { TimelineEvent } from '../../shared/event/timeline-event';

@Injectable()
export class EventFirebaseInsertEffect {

  @Effect()
  effect: Observable<EventInsertSuccessAction | EventInsertErrorAction> = this.actions
    .ofType('EVENT_SAVE_BUTTON')
    .withLatestFrom(this.store.select<TimelineEvent>(state => state.event.event), (action, event) => event)
    .filter(event => isNew(event))
    .switchMap(event => this.fireEvents
      .pushObject(toFirebaseEventUpdateObject(event))
      .map((ref): EventInsertSuccessAction => ({
        type: 'EVENT_INSERT_SUCCESS',
        payload: ref.key,
      }))
      .catch(err => Observable.of<EventInsertErrorAction>({
        type: 'EVENT_INSERT_ERROR',
        payload: toError(err),
      }))
    );

  constructor(
    private actions: Actions,
    private store: Store<AppState>,
    private fireEvents: EventsFirebaseService,
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
