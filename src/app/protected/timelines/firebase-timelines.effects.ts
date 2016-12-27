import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState, FirebaseListObservable } from 'angularfire2';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from '../../shared/rxjs';
import { FirebaseTimeline, toTimeline } from '../timeline/firebase-timeline.effects';
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
  TimelinesDeleteAction
} from './timelines.reducer';

@Injectable()
export class FirebaseTimelinesEffects {


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

  private auth: FirebaseAuthState = null;
  private list: FirebaseListObservable<FirebaseTimeline[]> = null;

  constructor(private actions: Actions, private fire: AngularFire) {
    this.fire.auth.subscribe((auth: FirebaseAuthState) => {
      this.auth = auth;
      this.list = null;
    });
  }

  private authorizedActionsOfType(type: TimelinesActionType): Observable<TimelinesAction> {
    return this.actions
      .ofType(type)
      .filter((action: TimelinesAction) => this.auth !== null);
  }

  private getTimelinesList(): FirebaseListObservable<FirebaseTimeline[]> {
    if (!this.list) {
      this.list = this.fire.database.list('/private/' + this.auth.uid + '/timelines');
    }
    return this.list;
  }
}

function toError(error: Error|string): Error {

  if (error instanceof Error) {
    return error;
  } else {
    return new Error(error);
  }
}
