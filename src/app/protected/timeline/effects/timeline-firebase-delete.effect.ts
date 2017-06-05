import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/protected-firebase.effect';
import { Observable } from 'rxjs/Observable';
import { Actions } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/auth-firebase.service';
import { TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';
import {
  TimelineDeleteAction,
  TimelineDeleteErrorAction,
  TimelineDeleteSuccessAction
} from '../../timelines/timelines.reducer';

@Injectable()
export class TimelineFirebaseDeleteEffect extends ProtectedFirebaseEffect<'TIMELINE_DELETE',
  TimelineDeleteAction,
  TimelineDeleteSuccessAction,
  'TIMELINE_DELETE_ERROR',
  TimelineDeleteErrorAction,
  void> {

  protected runEffect(action: TimelineDeleteAction): Observable<void> {
    return this.fireTimelines.removeObject(action.payload.id);
  }

  protected mapToSuccessAction(): TimelineDeleteSuccessAction {
    return {
      type: 'TIMELINE_DELETE_SUCCESS',
    }
  }

  protected getInterestedActionType(): 'TIMELINE_DELETE' {
    return 'TIMELINE_DELETE';
  }

  protected getErrorActionType(): 'TIMELINE_DELETE_ERROR' {
    return 'TIMELINE_DELETE_ERROR';
  }

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireTimelines: TimelinesFirebaseService,
  ) {
    super(actions, auth);
  }
}
