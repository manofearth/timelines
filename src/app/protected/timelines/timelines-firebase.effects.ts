import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from '../../shared/rxjs';
import { FirebaseTimeline } from '../timeline/timeline-firebase.effects';
import {
  TimelinesGetSuccessAction,
  TimelinesGetAction,
  TimelinesGetErrorAction,
  TimelinesActionType,
  TimelinesCreateErrorAction,
  TimelinesCreateSuccessAction,
  TimelinesCreateAction,
  TimelinesAction,
  TimelinesDeleteSuccessAction,
  TimelinesDeleteErrorAction,
  TimelinesDeleteAction,
} from './timelines.reducer';
import { ProtectedFirebaseEffects, toError } from '../shared/protected-firebase.effects';
import { TimelineForList } from '../timeline/timeline.reducer';

@Injectable()
export class TimelinesFirebaseEffects extends ProtectedFirebaseEffects<TimelinesActionType, TimelinesAction, FirebaseTimeline> {


  @Effect() get: Observable<TimelinesGetSuccessAction|TimelinesGetErrorAction> =
    this.authorizedActionsOfType('TIMELINES_GET')
      .take(1)
      .mergeMap((action: TimelinesGetAction) => this
        .getFirebaseList()
        .map((firebaseTimelines: FirebaseTimeline[]): TimelinesGetSuccessAction => {
          return {
            type: 'TIMELINES_GET_SUCCESS',
            payload: firebaseTimelines.map(toTimeline),
          }
        })
        .catch((error: Error): Observable<TimelinesGetErrorAction> => Observable.of<TimelinesGetErrorAction>({
          type: 'TIMELINES_GET_ERROR',
          payload: error,
        }))
      );

  @Effect() create: Observable<TimelinesCreateSuccessAction | TimelinesCreateErrorAction> =
    this.authorizedActionsOfType('TIMELINES_CREATE')
      .switchMap((action: TimelinesCreateAction) =>
        Observable.fromPromise(<any>
          this.getFirebaseList().push({
            title: 'Новая лента',
          }))
          .map((ref: { key: string }): TimelinesCreateSuccessAction => ({
            type: 'TIMELINES_CREATE_SUCCESS',
            payload: ref.key,
          }))
          .catch((error: Error | string): Observable<TimelinesCreateErrorAction> =>
            Observable.of<TimelinesCreateErrorAction>({
              type: 'TIMELINES_CREATE_ERROR',
              payload: toError(error),
            })
          )
      );

  @Effect() deleteTimeline: Observable<TimelinesDeleteSuccessAction|TimelinesDeleteErrorAction> =
    this.authorizedActionsOfType('TIMELINES_DELETE')
      .switchMap((action: TimelinesDeleteAction) =>
        Observable.fromPromise(<Promise<void>>this.getFirebaseList().remove(action.payload.id))
          .map((): TimelinesDeleteSuccessAction => ({
            type: 'TIMELINES_DELETE_SUCCESS',
          }))
          .catch((error: Error|string): Observable<TimelinesDeleteErrorAction> =>
            Observable.of<TimelinesDeleteErrorAction>({
              type: 'TIMELINES_DELETE_ERROR',
              payload: toError(error),
            })
          )
      );


  constructor(actions: Actions, fire: AngularFire) {
    super(actions, fire);
  }

  protected getFirebaseNodeName(): string {
    return 'timelines';
  }

}

function toTimeline(firebaseTimeline: FirebaseTimeline): TimelineForList {
  return {
    id: firebaseTimeline.$key,
    title: firebaseTimeline.title,
  };
}
