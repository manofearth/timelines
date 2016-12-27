import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from '../../shared/rxjs';
import { FirebaseTimeline, toTimeline } from '../timeline/timeline-firebase.effects';
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
import { ProtectedFirebaseEffects } from '../shared/protected-firebase.effects';

@Injectable()
export class TimelinesFirebaseEffects extends ProtectedFirebaseEffects<TimelinesActionType, TimelinesAction> {


  @Effect() get: Observable<TimelinesGetSuccessAction|TimelinesGetErrorAction> =
    this.authorizedActionsOfType('ACTION_TIMELINES_GET')
      .take(1)
      .mergeMap((action: TimelinesGetAction) => this
        .getTimelinesList()
        .map((firebaseTimelines: FirebaseTimeline[]): TimelinesGetSuccessAction => {
          return {
            type: 'ACTION_TIMELINES_GET_SUCCESS',
            payload: firebaseTimelines.map(toTimeline),
          }
        })
        .catch((error: Error): Observable<TimelinesGetErrorAction> => Observable.of<TimelinesGetErrorAction>({
          type: 'ACTION_TIMELINES_GET_ERROR',
          payload: error,
        }))
      );

  @Effect() create: Observable<TimelinesCreateSuccessAction|TimelinesCreateErrorAction> =
    this.authorizedActionsOfType('ACTION_TIMELINES_CREATE')
      .switchMap((action: TimelinesCreateAction) =>
        Observable.fromPromise(<any>this.getTimelinesList().push({ title: 'Новая лента' }))
          .map((ref: { key: string }): TimelinesCreateSuccessAction => ({
            type: 'ACTION_TIMELINES_CREATE_SUCCESS',
            payload: ref.key,
          }))
          .catch((error: Error|string): Observable<TimelinesCreateErrorAction> =>
            Observable.of<TimelinesCreateErrorAction>({
              type: 'ACTION_TIMELINES_CREATE_ERROR',
              payload: toError(error),
            })
          )
      );

  @Effect() deleteTimeline: Observable<TimelinesDeleteSuccessAction|TimelinesDeleteErrorAction> =
    this.authorizedActionsOfType('ACTION_TIMELINES_DELETE')
      .switchMap((action: TimelinesDeleteAction) =>
        Observable.fromPromise(<Promise<void>>this.getTimelinesList().remove(action.payload.id))
          .map((): TimelinesDeleteSuccessAction => ({
            type: 'ACTION_TIMELINES_DELETE_SUCCESS',
          }))
          .catch((error: Error|string): Observable<TimelinesDeleteErrorAction> =>
            Observable.of<TimelinesDeleteErrorAction>({
              type: 'ACTION_TIMELINES_DELETE_ERROR',
              payload: toError(error),
            })
          )
      );

  private firebaseList: FirebaseListObservable<FirebaseTimeline[]> = null;

  constructor(actions: Actions, fire: AngularFire) {
    super(actions, fire);
  }

  protected onAuthChanged(): void {
    this.firebaseList = null;
  }

  private getTimelinesList(): FirebaseListObservable<FirebaseTimeline[]> {
    if (!this.firebaseList) {
      this.firebaseList = this.fire.database.list('/private/' + this.auth.uid + '/timelines');
    }
    return this.firebaseList;
  }
}

function toError(error: Error|string): Error {

  if (error instanceof Error) {
    return error;
  } else {
    return new Error(error);
  }
}
