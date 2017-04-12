import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AngularFire } from 'angularfire2';
import { Observable, Observer, TeardownLogic, Subscription } from '../../shared/rxjs';
import {
  TimelineGetSuccessAction,
  TimelineGetErrorAction,
  TimelineActionType,
  TimelineAction,
  TimelineGetAction,
  Timeline,
  TimelineSaveSuccessAction,
  TimelineSaveErrorAction,
  TimelineChangedAction,
} from './timeline.reducer';
import { ProtectedFirebaseEffects, toError } from '../shared/protected-firebase.effects';
import { FirebaseTimelineEvent } from '../event/event-firebase.effects';

export const SAVE_DEBOUNCE_TIME = 1000;

@Injectable()
export class TimelineFirebaseEffects extends ProtectedFirebaseEffects<
  TimelineActionType, TimelineAction, FirebaseTimeline> {

  @Effect() get: Observable<TimelineGetSuccessAction | TimelineGetErrorAction> = this
    .authorizedActionsOfType('TIMELINE_GET')
    .switchMap((action: TimelineGetAction) => this.getFirebaseObject(action.payload)
      .switchMap((firebaseTimeline: FirebaseTimeline): Observable<Timeline> =>
        Observable.create((observer: Observer<Timeline>): TeardownLogic => {
          const eventsObservables: Observable<FirebaseTimelineEvent>[] = Object.keys(firebaseTimeline.events).map(
            (eventId: string) => this.fire.database.object(this.getFirebaseUserPath() + '/events/' + eventId).first()
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
        })
      )
      .map((timeline: Timeline): TimelineGetSuccessAction => ({
        type: 'TIMELINE_GET_SUCCESS',
        payload: timeline,
      }))
      .catch((error: Error): Observable<TimelineGetErrorAction> => Observable.of<TimelineGetErrorAction>({
        type: 'TIMELINE_GET_ERROR',
        payload: toError(error),
      }))
    );

  @Effect() save: Observable<TimelineSaveSuccessAction | TimelineSaveErrorAction> = this
    .authorizedActionsOfType('TIMELINE_CHANGED')
    .debounceTime(SAVE_DEBOUNCE_TIME)
    .switchMap((action: TimelineChangedAction) =>
      Observable
        .fromPromise(
          <Promise<void>>this.getFirebaseObject(action.payload.id)
            .update(toFirebaseTimelineUpdateObject(action.payload))
        )
        .map((): TimelineSaveSuccessAction => ({
          type: 'TIMELINE_SAVE_SUCCESS',
        }))
        .catch((error: Error): Observable<TimelineSaveErrorAction> => Observable.of<TimelineSaveErrorAction>({
          type: 'TIMELINE_SAVE_ERROR',
          payload: toError(error),
        }))
    );

  constructor(actions: Actions, fire: AngularFire) {
    super(actions, fire);
  }

  protected getFirebaseNodeName(): string {
    return 'timelines';
  }
}

export interface FirebaseTimeline {
  $key: string;
  title: string;
  events: {[key: string]: true};
}

export interface FirebaseTimelineUpdateObject {
  title: string;
}

export function toTimeline(firebaseTimeline: FirebaseTimeline, firebaseEvents: FirebaseTimelineEvent[]): Timeline {
  return {
    id: firebaseTimeline.$key,
    title: firebaseTimeline.title,
    events: firebaseEvents.map((firebaseEvent: FirebaseTimelineEvent) => ({
      id: firebaseEvent.$key,
      title: firebaseEvent.title,
    }))
  };
}

function toFirebaseTimelineUpdateObject(timeline: Timeline): FirebaseTimelineUpdateObject {
  return {
    title: timeline.title,
  };
}
