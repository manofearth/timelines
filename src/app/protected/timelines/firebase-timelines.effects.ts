import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState, FirebaseListObservable } from 'angularfire2';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from '../../shared/rxjs';
import { Timeline } from '../../reducers/timeline.reducer';
import { FirebaseTimeline, toTimeline } from '../timeline/firebase-timeline.effects';
import {
  TimelinesGetSuccessAction,
  TimelinesGetAction,
  TimelinesGetErrorAction, TimelinesActionType, TimelinesCreateErrorAction, TimelinesCreateSuccessAction,
  TimelinesCreateAction, TimelinesAction
} from '../../reducers/timelines.reducer';

@Injectable()
export class FirebaseTimelinesEffects {


  @Effect() timelinesGet: Observable<TimelinesGetSuccessAction|TimelinesGetErrorAction> =
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
          })));

  private auth: FirebaseAuthState = null;
  private list: FirebaseListObservable<FirebaseTimeline[]>;

  constructor(private actions: Actions, private fire: AngularFire) {
    this.fire.auth.subscribe((auth: FirebaseAuthState) => {
      this.auth = auth;
    });
  }

  private authorizedActionsOfType(type: TimelinesActionType): Observable<TimelinesAction> {
    return this.actions
      .ofType(type)
      .filter((action: TimelinesAction) => this.auth !== null);
  }

  private getTimelinesList(): FirebaseListObservable<FirebaseTimeline[]> {
    if(!this.list) {
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
