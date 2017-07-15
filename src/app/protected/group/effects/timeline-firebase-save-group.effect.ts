import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';
import {
  TimelineSaveGroupAction,
  TimelineSaveGroupErrorAction,
  TimelineSaveGroupSuccessAction
} from '../../timeline/timeline-actions';

@Injectable()
export class TimelineFirebaseSaveGroupEffect extends ProtectedFirebaseEffect<TimelineSaveGroupAction,
  TimelineSaveGroupSuccessAction,
  TimelineSaveGroupErrorAction,
  void> {

  @Effect()
  effect(): Observable<TimelineSaveGroupSuccessAction | TimelineSaveGroupErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: TimelineSaveGroupAction): Observable<void> {
    return this.fireTimelines.saveGroup(action.payload.timelineId, action.payload.groupId, action.payload.data);
  }

  protected mapToSuccessAction(): TimelineSaveGroupSuccessAction {
    return {
      type: 'TIMELINE_SAVE_GROUP_SUCCESS',
    }
  }

  protected getInterestedActionType(): 'TIMELINE_SAVE_GROUP' {
    return 'TIMELINE_SAVE_GROUP';
  }

  protected getErrorActionType(): 'TIMELINE_SAVE_GROUP_ERROR' {
    return 'TIMELINE_SAVE_GROUP_ERROR';
  }

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireTimelines: TimelinesFirebaseService,
  ) {
    super(actions, auth);
  }
}
