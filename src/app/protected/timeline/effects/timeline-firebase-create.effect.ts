import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/protected-firebase.effect';
import {
  TimelineCreateAction,
  TimelineCreateErrorAction,
  TimelineCreateSuccessAction
} from '../../timelines/timelines.reducer';
import { Observable } from 'rxjs/Observable';
import { Actions } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/auth-firebase.service';
import { TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';

@Injectable()
export class TimelineFirebaseCreateEffect extends ProtectedFirebaseEffect<'TIMELINE_CREATE',
  TimelineCreateAction,
  TimelineCreateSuccessAction,
  'TIMELINE_CREATE_ERROR',
  TimelineCreateErrorAction,
  firebase.database.Reference> {

  protected runEffect(action: TimelineCreateAction): Observable<firebase.database.Reference> {
    return this.fireTimelines.pushObject({
      title: 'Новая лента',
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
