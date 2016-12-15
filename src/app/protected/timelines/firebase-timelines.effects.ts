import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/distinctUntilChanged';
import {
  TimelinesGetSuccessAction,
  TimelinesGetAction,
  Timeline,
  TimelinesGetErrorAction
} from '../../reducers/timelines.reducer';

@Injectable()
export class FirebaseTimelinesEffects {


  @Effect() timelinesGet: Observable<TimelinesGetSuccessAction> = this.actions
    .ofType('ACTION_TIMELINES_GET')
    .filter((action: TimelinesGetAction) => this.auth !== null)
    .take(1)
    .mergeMap((action: TimelinesGetAction) => this.fire.database
      .list('/private/' + this.auth.uid + '/timelines')
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

  private auth: FirebaseAuthState = null;

  constructor(private actions: Actions, private fire: AngularFire) {
    this.fire.auth.subscribe((auth: FirebaseAuthState) => {
      this.auth = auth;
    });
  }

}

function toTimeline(firebaseTimeline: FirebaseTimeline): Timeline {
  return {
    id: firebaseTimeline.$key,
    title: firebaseTimeline.title,
  };
}

interface FirebaseTimeline {
  $key: string;
  title: string;
}