import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import {
  EventInsertAndAttachToTimelineAction,
  EventInsertErrorAction,
  EventInsertSuccessAction
} from '../event.reducer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { toFirebaseEventUpdateObject } from './event-firebase-update.effect';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { Actions, Effect } from '@ngrx/effects';
import { EventsFirebaseService } from '../events-firebase.service';
import { TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';

@Injectable()
export class EventFirebaseInsertAndAttachEffect extends ProtectedFirebaseEffect<'EVENT_INSERT_AND_ATTACH_TO_TIMELINE',
    EventInsertAndAttachToTimelineAction,
    EventInsertSuccessAction,
    'EVENT_INSERT_ERROR',
    EventInsertErrorAction,
    firebase.database.Reference> {

  @Effect()
  effect(): Observable<EventInsertSuccessAction | EventInsertErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: EventInsertAndAttachToTimelineAction): Observable<firebase.database.Reference> {
    return this.fireEvents
      .pushObject(toFirebaseEventUpdateObject(action.payload.event))
      .mergeMap((ref: firebase.database.Reference) =>
        Observable
          .forkJoin(
            this.fireTimelines.attachEvent(action.payload.timeline.id, ref.key),
            this.fireEvents.attachToTimeline(ref.key, action.payload.timeline.id),
          )
          .map(() => ref)
      );
  }

  protected mapToSuccessAction(effectResult: firebase.database.Reference): EventInsertSuccessAction {
    return {
      type: 'EVENT_INSERT_SUCCESS',
      payload: effectResult.key
    };
  }

  protected getInterestedActionType(): 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE' {
    return 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE';
  }

  protected getErrorActionType(): 'EVENT_INSERT_ERROR' {
    return 'EVENT_INSERT_ERROR';
  }

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireEvents: EventsFirebaseService,
    private fireTimelines: TimelinesFirebaseService,
  ) {
    super(actions, auth);
  }
}
