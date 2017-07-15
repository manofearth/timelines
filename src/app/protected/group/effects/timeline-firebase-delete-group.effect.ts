import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';
import {
  TimelineDeleteGroupAction,
  TimelineDeleteGroupErrorAction,
  TimelineDeleteGroupSuccessAction
} from '../../timeline/timeline-actions';

@Injectable()
export class TimelineFirebaseDeleteGroupEffect extends ProtectedFirebaseEffect<TimelineDeleteGroupAction,
  TimelineDeleteGroupSuccessAction,
  TimelineDeleteGroupErrorAction,
  void> {

  @Effect()
  effect(): Observable<TimelineDeleteGroupSuccessAction | TimelineDeleteGroupErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: TimelineDeleteGroupAction): Observable<void> {
    return this.fireTimelines.deleteGroup(action.payload.timelineId, action.payload.groupId);
  }

  protected mapToSuccessAction(): TimelineDeleteGroupSuccessAction {
    return {
      type: 'TIMELINE_DELETE_GROUP_SUCCESS',
    }
  }

  protected getInterestedActionType(): 'TIMELINE_DELETE_GROUP' {
    return 'TIMELINE_DELETE_GROUP';
  }

  protected getErrorActionType(): 'TIMELINE_DELETE_GROUP_ERROR' {
    return 'TIMELINE_DELETE_GROUP_ERROR';
  }

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireTimelines: TimelinesFirebaseService,
  ) {
    super(actions, auth);
  }
}
