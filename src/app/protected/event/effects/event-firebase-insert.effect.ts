import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { EventInsertAction, EventInsertErrorAction, EventInsertSuccessAction } from '../event.reducer';
import { Observable } from 'rxjs/Observable';
import { Actions } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { EventsFirebaseService } from '../events-firebase.service';
import { toFirebaseEventUpdateObject } from './event-firebase-update.effect';

@Injectable()
export class EventFirebaseInsertEffect extends ProtectedFirebaseEffect<'EVENT_INSERT',
  EventInsertAction,
  EventInsertSuccessAction,
  'EVENT_INSERT_ERROR',
  EventInsertErrorAction,
  firebase.database.Reference> {

  protected runEffect(action: EventInsertAction): Observable<firebase.database.Reference> {
    return this.fireEvents.pushObject(toFirebaseEventUpdateObject(action.payload));
  }

  protected mapToSuccessAction(effectResult: firebase.database.Reference): EventInsertSuccessAction {
    return {
      type: 'EVENT_INSERT_SUCCESS',
      payload: effectResult.key
    };
  }

  protected getInterestedActionType(): 'EVENT_INSERT' {
    return 'EVENT_INSERT';
  }

  protected getErrorActionType(): 'EVENT_INSERT_ERROR' {
    return 'EVENT_INSERT_ERROR';
  }

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireEvents: EventsFirebaseService,
  ) {
    super(actions, auth);
  }
}
