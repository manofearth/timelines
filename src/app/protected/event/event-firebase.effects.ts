import { Observable } from '../../shared/rxjs';
import {
  EventActionType,
  EventAction,
  EventUpdateAction,
  EventUpdateSuccessAction,
  EventUpdateErrorAction,
  EventInsertSuccessAction,
  EventInsertErrorAction,
  EventInsertAction, EventInsertAndAttachToTimelineAction,
} from './event.reducer';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AngularFire } from 'angularfire2';
import { TimelineEvent } from '../shared/timeline-event';
import { TimelineDate } from '../shared/date';
import { ProtectedFirebaseEffects, toError } from '../shared/protected-firebase.effects';

@Injectable()
export class EventFirebaseEffects extends ProtectedFirebaseEffects<EventActionType, EventAction, TimelineEvent> {

  @Effect() update: Observable<EventUpdateSuccessAction | EventUpdateErrorAction> = this
    .authorizedActionsOfType('EVENT_UPDATE')
    .switchMap((action: EventUpdateAction) =>
      Observable
        .fromPromise(
          <Promise<void>>this.getFirebaseObject(action.payload.id).update(toFirebaseEventUpdateObject(action.payload))
        )
        .map((): EventUpdateSuccessAction => ({
          type: 'EVENT_UPDATE_SUCCESS',
        }))
        .catch((error: Error): Observable<EventUpdateErrorAction> => Observable.of<EventUpdateErrorAction>({
          type: 'EVENT_UPDATE_ERROR',
          payload: error,
        }))
    );

  @Effect() insert: Observable<EventInsertSuccessAction | EventInsertErrorAction> = this
    .authorizedActionsOfType('EVENT_INSERT')
    .switchMap((action: EventInsertAction) =>
      Observable
        .fromPromise(
          <any>this.getFirebaseList().push(toFirebaseEventUpdateObject(action.payload))
        )
        .map((ref: { key: string }): EventInsertSuccessAction => ({
          type: 'EVENT_INSERT_SUCCESS',
          payload: ref.key,
        }))
        .catch((error: Error | string): Observable<EventInsertErrorAction> =>
          Observable.of<EventInsertErrorAction>({
            type: 'EVENT_INSERT_ERROR',
            payload: toError(error),
          })
        )
    );

  @Effect() insertAndAttachToTimeline: Observable<EventInsertSuccessAction | EventInsertErrorAction> = this
    .authorizedActionsOfType('EVENT_INSERT_AND_ATTACH_TO_TIMELINE')
    .switchMap((action: EventInsertAndAttachToTimelineAction) =>
      Observable
        .fromPromise(
          <any>this.getFirebaseList().push(toFirebaseEventUpdateObject(action.payload.event))
        )
        .mergeMap((ref: firebase.database.ThenableReference) =>
          Observable
            .fromPromise(<Promise<void>>
              this.fire.database.object(
                this.getFirebaseUserPath() + '/timelines/' + action.payload.timeline.id + '/events/' + ref.key
              ).set(true)
            )
            .map(() => ref)
        )
        .map((ref: firebase.database.ThenableReference): EventInsertSuccessAction => ({
          type: 'EVENT_INSERT_SUCCESS',
          payload: ref.key,
        }))
        .catch((error: Error | string): Observable<EventInsertErrorAction> =>
          Observable.of<EventInsertErrorAction>({
            type: 'EVENT_INSERT_ERROR',
            payload: toError(error),
          })
        )
    );

  constructor(actions: Actions, fire: AngularFire) {
    super(actions, fire);
  }

  protected getFirebaseNodeName(): string {
    return 'events';
  }

}

export interface FirebaseTimelineEvent {
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
