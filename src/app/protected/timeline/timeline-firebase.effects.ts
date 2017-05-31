import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable, Observer, Subscription, TeardownLogic } from '../../shared/rxjs';
import {
  Timeline,
  TimelineAction,
  TimelineActionType,
  TimelineChangedAction,
  TimelineChangedPayload,
  TimelineGetAction,
  TimelineGetErrorAction,
  TimelineGetSuccessAction,
  TimelineSaveErrorAction,
  TimelineSaveSuccessAction
} from './timeline.reducer';
import { ProtectedFirebaseEffects, toError } from '../shared/protected-firebase.effects';
import { FirebaseTimelineEvent } from '../event/event-firebase.effects';
import { AuthFirebaseService } from '../shared/auth-firebase.service';
import { TimelinesFirebaseService } from '../timelines/timelines-firebase.service';
import { EventsFirebaseService } from '../event/events-firebase.service';

export const SAVE_DEBOUNCE_TIME = 1000;

@Injectable()
export class TimelineFirebaseEffects extends ProtectedFirebaseEffects<TimelineActionType, TimelineAction> {

  @Effect() get: Observable<TimelineGetSuccessAction | TimelineGetErrorAction> = this
    .authorizedActionsOfType('TIMELINE_GET')
    .switchMap((action: TimelineGetAction) => this.fireTimelines.getObject(action.payload)
      .switchMap((firebaseTimeline: FirebaseTimeline): Observable<Timeline> =>
        Observable.create((observer: Observer<Timeline>): TeardownLogic => {

          if (firebaseTimeline.events) {
            const eventsObservables: Observable<FirebaseTimelineEvent>[] = Object.keys(firebaseTimeline.events).map(
              (eventId: string) => this.fireEvents.getObject(eventId).first()
            );

            const subscription: Subscription = Observable
              .forkJoin(...eventsObservables)
              .subscribe((firebaseEvents: FirebaseTimelineEvent[]) => {
                observer.next(toTimeline(firebaseTimeline, firebaseEvents));
                observer.complete();
              });

            return () => {
              subscription.unsubscribe();
            };
          } else {
            observer.next(toTimeline(firebaseTimeline, []));
            observer.complete();
          }

        })
      )
      .map((timeline: Timeline): TimelineGetSuccessAction => ({
        type:    'TIMELINE_GET_SUCCESS',
        payload: timeline,
      }))
      .catch((error: Error): Observable<TimelineGetErrorAction> => Observable.of<TimelineGetErrorAction>({
        type:    'TIMELINE_GET_ERROR',
        payload: toError(error),
      }))
    );

  @Effect() save: Observable<TimelineSaveSuccessAction | TimelineSaveErrorAction> = this
    .authorizedActionsOfType('TIMELINE_CHANGED')
    .debounceTime(SAVE_DEBOUNCE_TIME)
    .switchMap((action: TimelineChangedAction) =>
      Observable
        .fromPromise(
          <Promise<void>>this.fireTimelines.getObject(action.payload.id)
            .update(toFirebaseTimelineUpdateObject(action.payload))
        )
        .map((): TimelineSaveSuccessAction => ({
          type: 'TIMELINE_SAVE_SUCCESS',
        }))
        .catch((error: Error): Observable<TimelineSaveErrorAction> => Observable.of<TimelineSaveErrorAction>({
          type:    'TIMELINE_SAVE_ERROR',
          payload: toError(error),
        }))
    );

  constructor(
    actions: Actions,
    fireAuth: AuthFirebaseService,
    private fireTimelines: TimelinesFirebaseService,
    private fireEvents: EventsFirebaseService,
  ) {
    super(actions, fireAuth);
  }

}

export interface FirebaseTimeline {
  $key: string;
  title: string;
  events?: { [key: string]: true };
}

export interface FirebaseTimelineUpdateObject {
  title: string;
}

function toTimeline(firebaseTimeline: FirebaseTimeline, firebaseEvents: FirebaseTimelineEvent[]): Timeline {
  return {
    id:     firebaseTimeline.$key,
    title:  firebaseTimeline.title,
    events: firebaseEvents.map((firebaseEvent: FirebaseTimelineEvent) => ({
      id:        firebaseEvent.$key,
      title:     firebaseEvent.title,
      dateBegin: firebaseEvent.dateBegin,
      dateEnd:   firebaseEvent.dateEnd,
    }))
  };
}

function toFirebaseTimelineUpdateObject(timeline: TimelineChangedPayload): FirebaseTimelineUpdateObject {
  return {
    title: timeline.title,
  };
}
