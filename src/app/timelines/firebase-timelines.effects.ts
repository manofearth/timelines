import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { TimelinesGetSuccessAction, TimelinesGetAction, Timeline } from '../reducers/timelines.reducer';

@Injectable()
export class FirebaseTimelinesEffects {

  @Effect() timelinesGet: Observable<TimelinesGetSuccessAction> = this.actions
    .ofType('ACTION_TIMELINES_GET')
    .switchMap((action: TimelinesGetAction) => this.fire.auth)
    .switchMap((auth: FirebaseAuthState) => this.fire.database
      .list('/private/' + auth.uid + '/timelines')
      .map((firebaseTimelines: FirebaseTimeline[]): TimelinesGetSuccessAction => {
        return {
          type: 'ACTION_TIMELINES_GET_SUCCESS',
          payload: firebaseTimelines.map(toTimeline),
        }
      })
    );

  constructor(private actions: Actions, private fire: AngularFire) {
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