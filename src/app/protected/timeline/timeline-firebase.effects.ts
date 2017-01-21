import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AngularFire } from 'angularfire2';
import { Observable } from '../../shared/rxjs';
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
import { ProtectedFirebaseObjectEffects } from '../shared/protected-firebase-object.effects';

export const SAVE_DEBOUNCE_TIME = 1000;

@Injectable()
export class TimelineFirebaseEffects extends ProtectedFirebaseObjectEffects<
  TimelineActionType, TimelineAction, FirebaseTimeline> {

  @Effect() get: Observable<TimelineGetSuccessAction | TimelineGetErrorAction> = this
    .authorizedActionsOfType('TIMELINE_GET')
    .switchMap((action: TimelineGetAction) => this.getFirebaseObject(action.payload)
      .map((firebaseTimeline: FirebaseTimeline): TimelineGetSuccessAction => ({
        type: 'TIMELINE_GET_SUCCESS',
        payload: toTimeline(firebaseTimeline),
      }))
      .catch((error: Error): Observable<TimelineGetErrorAction> => Observable.of<TimelineGetErrorAction>({
        type: 'TIMELINE_GET_ERROR',
        payload: error,
      }))
    );

  @Effect() save: Observable<TimelineSaveSuccessAction> = this
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
          payload: error,
        }))
    );

  constructor(actions: Actions, fire: AngularFire) {
    super(actions, fire);
  }

}

export interface FirebaseTimeline {
  $key: string;
  title: string;
}

export interface FirebaseTimelineUpdateObject {
  title: string;
}

export function toTimeline(firebaseTimeline: FirebaseTimeline): Timeline {
  return {
    id: firebaseTimeline.$key,
    title: firebaseTimeline.title,
  };
}

function toFirebaseTimelineUpdateObject(timeline: Timeline): FirebaseTimelineUpdateObject {
  return {
    title: timeline.title,
  };
}
