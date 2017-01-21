import { Observable } from '../../shared/rxjs';
import {
  EventActionType, EventAction, EventSaveAction, EventSaveSuccessAction,
  EventSaveErrorAction
} from './event.reducer';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AngularFire } from 'angularfire2';
import { ProtectedFirebaseObjectEffects } from '../shared/protected-firebase-object.effects';
import { TimelineEvent } from '../shared/timeline-event';
import { TimelineDate } from '../shared/date';

@Injectable()
export class EventFirebaseEffects extends ProtectedFirebaseObjectEffects<EventActionType, EventAction, TimelineEvent> {

  @Effect() save: Observable<EventSaveSuccessAction | EventSaveErrorAction> = this
    .authorizedActionsOfType('EVENT_SAVE')
    .switchMap((action: EventSaveAction) =>
      Observable
        .fromPromise(
          <Promise<void>>this.getFirebaseObject(action.payload.id)
            .update(toFirebaseEventUpdateObject(action.payload))
        )
        .map((): EventSaveSuccessAction => ({
          type: 'EVENT_SAVE_SUCCESS',
        }))
        .catch((error: Error): Observable<EventSaveErrorAction> => Observable.of<EventSaveErrorAction>({
          type: 'EVENT_SAVE_ERROR',
          payload: error,
        }))
    );

  constructor(actions: Actions, fire: AngularFire) {
    super(actions, fire);
  }

}

export interface FirebaseEvent {
  $key: string;
  title: string;
  dateBegin: TimelineDate;
  dateEnd: TimelineDate;
}

export interface FirebaseEventUpdateObject {
  title: string;
  dateBegin: TimelineDate;
  dateEnd: TimelineDate;
}

function toFirebaseEventUpdateObject(event: TimelineEvent): FirebaseEventUpdateObject {
  return {
    title: event.title,
    dateBegin: event.dateBegin,
    dateEnd: event.dateEnd,
  };
}
