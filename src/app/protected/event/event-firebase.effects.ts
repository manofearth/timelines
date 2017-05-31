import { Observable } from '../../shared/rxjs';
import {
  EventAction,
  EventActionType,
  EventDetachAction,
  EventDetachErrorAction,
  EventDetachSuccessAction,
  EventGetAction,
  EventGetErrorAction,
  EventGetSuccessAction,
  EventInsertAction,
  EventInsertAndAttachToTimelineAction,
  EventInsertErrorAction,
  EventInsertSuccessAction,
  EventUpdateAction,
  EventUpdateErrorAction,
  EventUpdateSuccessAction
} from './event.reducer';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { TimelineEvent } from '../shared/timeline-event';
import { TimelineDate } from '../shared/date';
import { ProtectedFirebaseEffects, toError } from '../shared/protected-firebase.effects';
import { EventsFirebaseService } from './events-firebase.service';
import { AuthFirebaseService } from '../shared/auth-firebase.service';

@Injectable()
export class EventFirebaseEffects extends ProtectedFirebaseEffects<EventActionType, EventAction> {

  @Effect() update: Observable<EventUpdateSuccessAction | EventUpdateErrorAction> = this
    .authorizedActionsOfType('EVENT_UPDATE')
    .switchMap((action: EventUpdateAction) =>
      Observable
        .fromPromise(
          <Promise<void>>this.fireEvents.getObject(action.payload.id).update(toFirebaseEventUpdateObject(action.payload))
        )
        .map((): EventUpdateSuccessAction => ({
          type: 'EVENT_UPDATE_SUCCESS',
        }))
        .catch((error: Error): Observable<EventUpdateErrorAction> => Observable.of<EventUpdateErrorAction>({
          type:    'EVENT_UPDATE_ERROR',
          payload: error,
        }))
    );

  @Effect() insert: Observable<EventInsertSuccessAction | EventInsertErrorAction> = this
    .authorizedActionsOfType('EVENT_INSERT')
    .switchMap((action: EventInsertAction) =>
      Observable
        .fromPromise(
          <any>this.fireEvents.getList().push(toFirebaseEventUpdateObject(action.payload))
        )
        .map((ref: { key: string }): EventInsertSuccessAction => ({
          type:    'EVENT_INSERT_SUCCESS',
          payload: ref.key,
        }))
        .catch((error: Error | string): Observable<EventInsertErrorAction> =>
          Observable.of<EventInsertErrorAction>({
            type:    'EVENT_INSERT_ERROR',
            payload: toError(error),
          })
        )
    );

  @Effect() insertAndAttachToTimeline: Observable<EventInsertSuccessAction | EventInsertErrorAction> = this
    .authorizedActionsOfType('EVENT_INSERT_AND_ATTACH_TO_TIMELINE')
    .switchMap((action: EventInsertAndAttachToTimelineAction) =>
      Observable
        .fromPromise(
          <any>this.fireEvents.getList().push(toFirebaseEventUpdateObject(action.payload.event))
        )
        .mergeMap((ref: firebase.database.ThenableReference) =>
          Observable.forkJoin(
            this.fire.database.object(
              this.getTimelineAttachedEventPath(action.payload.timeline.id, ref.key)
            ).set(true),
            this.fire.database.object(
              this.getEventAttachedTimelinePath(ref.key, action.payload.timeline.id)
            ).set(true)
          )
            .map(() => ref)
        )
        .map((ref: firebase.database.ThenableReference): EventInsertSuccessAction => ({
          type:    'EVENT_INSERT_SUCCESS',
          payload: ref.key,
        }))
        .catch((error: Error | string): Observable<EventInsertErrorAction> =>
          Observable.of<EventInsertErrorAction>({
            type:    'EVENT_INSERT_ERROR',
            payload: toError(error),
          })
        )
    );

  @Effect() get: Observable<EventGetSuccessAction | EventGetErrorAction> = this
    .authorizedActionsOfType('EVENT_GET')
    .switchMap((action: EventGetAction) =>
      this.fireEvents.getObject(action.payload)
        .map((firebaseObject: FirebaseTimelineEvent): EventGetSuccessAction => ({
          type:    'EVENT_GET_SUCCESS',
          payload: toTimelineEvent(firebaseObject),
        }))
        .catch((error: Error | string): Observable<EventGetErrorAction> =>
          Observable.of<EventGetErrorAction>({
            type:    'EVENT_GET_ERROR',
            payload: toError(error),
          })
        )
    );

  @Effect() detach: Observable<EventDetachSuccessAction | EventDetachErrorAction> = this
    .authorizedActionsOfType('EVENT_DETACH')
    .mergeMap((action: EventDetachAction) =>
      Observable
        .forkJoin(
          this.fire.database.object(
            this.getTimelineAttachedEventPath(action.payload.timelineId, action.payload.eventId)
          ).remove(),
          this.fire.database.object(
            this.getEventAttachedTimelinePath(action.payload.eventId, action.payload.timelineId)
          ).remove()
        )
        .map((): EventDetachSuccessAction => ({
          type: 'EVENT_DETACH_SUCCESS',
        }))
        .catch((error: Error | string): Observable<EventDetachErrorAction> =>
          Observable.of<EventDetachErrorAction>({
            type:    'EVENT_DETACH_ERROR',
            payload: toError(error),
          })
        )
    );

  constructor(
    actions: Actions,
    fireAuth: AuthFirebaseService,
    private fireEvents: EventsFirebaseService,
  ) {
    super(actions, fireAuth);
  }

  private getEventAttachedTimelinePath(eventId: string, timelineId: string): string {
    return this.getFirebaseObjectPath(eventId) + '/timelines/' + timelineId;
  }

  private getTimelineAttachedEventPath(timelineId: string, eventId: string): string {
    return this.getFirebaseUserPath() + '/timelines/' + timelineId + '/events/' + eventId;
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
    title:     event.title,
    dateBegin: event.dateBegin,
    dateEnd:   event.dateEnd,
  };
}

function toTimelineEvent(firebaseEvent: FirebaseTimelineEvent): TimelineEvent {
  return {
    id:        firebaseEvent.$key,
    title:     firebaseEvent.title,
    dateBegin: firebaseEvent.dateBegin,
    dateEnd:   firebaseEvent.dateEnd,
  };
}
