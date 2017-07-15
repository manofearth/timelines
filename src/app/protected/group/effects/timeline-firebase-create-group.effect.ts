import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';
import {
  TimelineCreateGroupAction,
  TimelineCreateGroupErrorAction,
  TimelineCreateGroupSuccessAction
} from '../../timeline/timeline-actions';

@Injectable()
export class TimelineFirebaseCreateGroupEffect extends ProtectedFirebaseEffect<TimelineCreateGroupAction,
  TimelineCreateGroupSuccessAction,
  TimelineCreateGroupErrorAction,
  firebase.database.Reference> {

  @Effect()
  effect(): Observable<TimelineCreateGroupSuccessAction | TimelineCreateGroupErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: TimelineCreateGroupAction): Observable<firebase.database.Reference> {
    return this.fireTimelines.createGroup(
      action.payload,
      {
        title: 'Новая группа',
        color: 'cornflowerblue',
      }
    );
  }

  protected mapToSuccessAction(ref: firebase.database.Reference): TimelineCreateGroupSuccessAction {
    return {
      type: 'TIMELINE_CREATE_GROUP_SUCCESS',
    }
  }

  protected getInterestedActionType(): 'TIMELINE_CREATE_GROUP' {
    return 'TIMELINE_CREATE_GROUP';
  }

  protected getErrorActionType(): 'TIMELINE_CREATE_GROUP_ERROR' {
    return 'TIMELINE_CREATE_GROUP_ERROR';
  }

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireTimelines: TimelinesFirebaseService,
  ) {
    super(actions, auth);
  }
}
