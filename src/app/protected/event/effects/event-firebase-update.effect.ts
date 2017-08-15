import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EventsFirebaseService, FirebaseEventUpdateObject } from '../events-firebase.service';
import { TimelineEvent } from '../../shared/event/timeline-event';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { isNew } from '../../shared/event/is-new.fn';
import { toError } from '../../shared/firebase/protected-firebase.effect';
import { AppState } from '../../../reducers';

@Injectable()
export class EventFirebaseUpdateEffect {

  @Effect()
  effect: Observable<EventUpdateSuccessAction | EventUpdateErrorAction> = this.actions
    .ofType('EVENT_SAVE_BUTTON')
    .withLatestFrom(this.store.select<TimelineEvent>(state => state.event.event), (action, event) => event)
    .filter(event => !isNew(event))
    .switchMap(event => this.fireEvents
      .updateObject(event.id, toFirebaseEventUpdateObject(event))
      .map((): EventUpdateSuccessAction => ({
        type: 'EVENT_UPDATE_SUCCESS',
      }))
      .catch(err => Observable.of<EventUpdateErrorAction>({
        type: 'EVENT_UPDATE_ERROR',
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

export function toFirebaseEventUpdateObject(event: TimelineEvent): FirebaseEventUpdateObject {
  return {
    title: event.title,
    dateBegin: event.dateBegin,
    dateEnd: event.dateEnd,
    typeId: event.type.id,
  };
}

export interface EventUpdateSuccessAction extends Action {
  type: 'EVENT_UPDATE_SUCCESS';
}

export interface EventUpdateErrorAction extends Action {
  type: 'EVENT_UPDATE_ERROR';
  payload: Error;
}
