import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import {
  TimelineCreateAction,
  TimelineCreateErrorAction,
  TimelineCreateSuccessAction
} from '../../timelines/timelines.reducer';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';

@Injectable()
export class TimelineFirebaseCreateEffect extends ProtectedFirebaseEffect<TimelineCreateAction,
  TimelineCreateSuccessAction,
  TimelineCreateErrorAction,
  firebase.database.Reference> {

  @Effect()
  effect(): Observable<TimelineCreateSuccessAction | TimelineCreateErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: TimelineCreateAction): Observable<firebase.database.Reference> {
    return this.fireTimelines.pushObject({
      title: 'Новая лента',
      groups: {
        'default': {
          title: 'Группа 1',
          color: 'cornflowerblue',
        }
      }
    });
  }

  protected mapToSuccessAction(ref: firebase.database.Reference): TimelineCreateSuccessAction {
    return {
      type: 'TIMELINE_CREATE_SUCCESS',
      payload: ref.key,
    }
  }

  protected getInterestedActionType(): 'TIMELINE_CREATE' {
    return 'TIMELINE_CREATE';
  }

  protected getErrorActionType(): 'TIMELINE_CREATE_ERROR' {
    return 'TIMELINE_CREATE_ERROR';
  }

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireTimelines: TimelinesFirebaseService,
  ) {
    super(actions, auth);
  }
}
