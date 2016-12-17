import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AngularFire, FirebaseAuthState, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import {
  TimelineGetSuccessAction,
  TimelineGetErrorAction,
  TimelineActionType,
  TimelineAction,
  TimelineGetAction,
  Timeline,
} from '../../reducers/timeline.reducer';

@Injectable()
export class FirebaseTimelineEffects {

  @Effect() get: Observable<TimelineGetSuccessAction | TimelineGetErrorAction> = this
    .authorizedActionsOfType('ACTION_TIMELINE_GET')
    .switchMap((action: TimelineGetAction) => this.fire.database.object('/private/' + this.auth.uid + '/timelines/' + action.payload))
      .map((firebaseTimeline: FirebaseTimeline): TimelineGetSuccessAction => ({
        type: 'ACTION_TIMELINE_GET_SUCCESS',
        payload: toTimeline(firebaseTimeline),
      }));

  private auth: FirebaseAuthState;

  constructor(private actions: Actions, private fire: AngularFire) {
    this.fire.auth.subscribe((auth: FirebaseAuthState) => {
      this.auth = auth;
    });
  }

  private authorizedActionsOfType(type: TimelineActionType): Observable<TimelineAction> {
    return this.actions
      .ofType(type)
      .filter((action: TimelineAction) => this.auth !== null);
  }
}

export interface FirebaseTimeline {
  $key: string;
  title: string;
}

export function toTimeline(firebaseTimeline: FirebaseTimeline): Timeline {
  return {
    id: firebaseTimeline.$key,
    title: firebaseTimeline.title,
  };
}
