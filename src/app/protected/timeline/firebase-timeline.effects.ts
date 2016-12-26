import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AngularFire, FirebaseAuthState, FirebaseObjectObservable } from 'angularfire2';
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

const SAVE_DEBOUNCE_TIME = 1000;

@Injectable()
export class FirebaseTimelineEffects {

  @Effect() get: Observable<TimelineGetSuccessAction | TimelineGetErrorAction> = this
    .authorizedActionsOfType('ACTION_TIMELINE_GET')
    .switchMap((action: TimelineGetAction) => this.getFirebaseObject(action.payload)
      .map((firebaseTimeline: FirebaseTimeline): TimelineGetSuccessAction => ({
        type: 'ACTION_TIMELINE_GET_SUCCESS',
        payload: toTimeline(firebaseTimeline),
      }))
      .catch((error: Error): Observable<TimelineGetErrorAction> => Observable.of<TimelineGetErrorAction>({
        type: 'ACTION_TIMELINE_GET_ERROR',
        payload: error,
      }))
    );

  @Effect() save: Observable<TimelineSaveSuccessAction> = this
    .authorizedActionsOfType('ACTION_TIMELINE_CHANGED')
    .debounceTime(SAVE_DEBOUNCE_TIME)
    .switchMap((action: TimelineChangedAction) =>
      Observable
        .fromPromise(
        <Promise<void>>this.getFirebaseObject(action.payload.id)
          .update(toFirebaseTimelineUpdateObject(action.payload))
        )
        .map((): TimelineSaveSuccessAction => ({
          type: 'ACTION_TIMELINE_SAVE_SUCCESS',
        }))
        .catch((error: Error): Observable<TimelineSaveErrorAction> => Observable.of<TimelineSaveErrorAction>({
          type: 'ACTION_TIMELINE_SAVE_ERROR',
          payload: error,
        }))
    );

  private auth: FirebaseAuthState = null;
  private firebaseObject: FirebaseObjectObservable<FirebaseTimeline> = null;
  private firebaseObjectKey: string = null;

  constructor(private actions: Actions, private fire: AngularFire) {
    this.fire.auth.subscribe((auth: FirebaseAuthState) => {
      this.auth = auth;
    });
  }

  private authorizedActionsOfType(...types: TimelineActionType[]): Observable<TimelineAction> {
    return this.actions
      .ofType(...types)
      .filter((action: TimelineAction) => this.auth !== null);
  }

  private getFirebaseObject(key: string): FirebaseObjectObservable<FirebaseTimeline> {
    if (this.firebaseObjectKey !== key) {
      this.firebaseObject = this.fire.database.object('/private/' + this.auth.uid + '/timelines/' + key);
      this.firebaseObjectKey = key;
    }
    return this.firebaseObject;
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
