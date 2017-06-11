import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import {
  TimelineChangedAction,
  TimelineChangedPayload,
  TimelineSaveErrorAction,
  TimelineSaveSuccessAction
} from '../timeline.reducer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { FirebaseTimelineUpdateObject, TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';

@Injectable()
export class TimelineFirebaseSaveEffect extends ProtectedFirebaseEffect<'TIMELINE_CHANGED',
  TimelineChangedAction,
  TimelineSaveSuccessAction,
  'TIMELINE_SAVE_ERROR',
  TimelineSaveErrorAction,
  void> {

  @Effect()
  effect(): Observable<TimelineSaveSuccessAction | TimelineSaveErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: TimelineChangedAction): Observable<void> {
    return this.fireTimelines.updateObject(action.payload.id, toFirebaseTimelineUpdateObject(action.payload));
  }

  protected mapToSuccessAction(): TimelineSaveSuccessAction {
    return {
      type: 'TIMELINE_SAVE_SUCCESS',
    };
  }

  protected modifyActionsObservable(actions: Observable<TimelineChangedAction>): Observable<TimelineChangedAction> {
    return actions.debounceTime(SAVE_DEBOUNCE_TIME);
  }

  protected getInterestedActionType(): 'TIMELINE_CHANGED' {
    return 'TIMELINE_CHANGED';
  }

  protected getErrorActionType(): 'TIMELINE_SAVE_ERROR' {
    return 'TIMELINE_SAVE_ERROR';
  }

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireTimelines: TimelinesFirebaseService,
  ) {
    super(actions, auth);
  }
}

function toFirebaseTimelineUpdateObject(timeline: TimelineChangedPayload): FirebaseTimelineUpdateObject {
  return {
    title: timeline.title,
  };
}

export const SAVE_DEBOUNCE_TIME = 1000;
