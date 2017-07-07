import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { TimelinesGetAction, TimelinesGetErrorAction, TimelinesGetSuccessAction } from '../timelines.reducer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { FirebaseTimeline, TimelinesFirebaseService } from '../timelines-firebase.service';
import { TimelineForList } from '../../timeline/timeline-states';

@Injectable()
export class TimelinesFirebaseGetEffect extends ProtectedFirebaseEffect<TimelinesGetAction,
  TimelinesGetSuccessAction,
  TimelinesGetErrorAction,
  FirebaseTimeline[]> {

  @Effect()
  effect(): Observable<TimelinesGetSuccessAction | TimelinesGetErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: TimelinesGetAction): Observable<FirebaseTimeline[]> {
    return this.fireTimelines.getList();
  }

  protected mapToSuccessAction(timelines: FirebaseTimeline[]): TimelinesGetSuccessAction {
    return {
      type: 'TIMELINES_GET_SUCCESS',
      payload: timelines.map(toTimelineForList),
    }
  }

  protected modifyActionsObservable(actions: Observable<TimelinesGetAction>): Observable<TimelinesGetAction> {
    return actions.take(1);
  }

  protected getInterestedActionType(): 'TIMELINES_GET' {
    return 'TIMELINES_GET';
  }

  protected getErrorActionType(): 'TIMELINES_GET_ERROR' {
    return 'TIMELINES_GET_ERROR';
  }

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireTimelines: TimelinesFirebaseService,
  ) {
    super(actions, auth);
  }
}

function toTimelineForList(firebaseTimeline: FirebaseTimeline): TimelineForList {
  return {
    id: firebaseTimeline.$key,
    title: firebaseTimeline.title,
  };
}
