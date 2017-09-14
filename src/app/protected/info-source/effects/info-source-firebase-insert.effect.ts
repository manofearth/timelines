import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { InfoSourcesFirebaseService } from '../../info-sources/info-sources-firebase.service';
import { InfoSourceModalSaveButtonAction } from '../info-source-modal.component';
import { isNew } from '../../shared/info-source/is-new.fn';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { toError } from '../../shared/firebase/protected-firebase.effect';

@Injectable()
export class InfoSourceFirebaseInsertEffect {

  @Effect() effect = this.actions
    .ofType('INFO_SOURCE_MODAL_SAVE_BUTTON')
    .filter<InfoSourceModalSaveButtonAction>(action => isNew(action.payload.infoSource))
    .mergeMap(action => this.service
      .pushObject({
        title: action.payload.infoSource.title
      })
      .map((ref): InfoSourceFirebaseInsertSuccessAction => ({
        type: 'INFO_SOURCE_FIREBASE_INSERT_SUCCESS',
        payload: {
          infoSourceId: ref.key,
        }
      }))
      .catch(err => Observable.of<InfoSourceFirebaseInsertErrorAction>({
        type: 'INFO_SOURCE_FIREBASE_INSERT_ERROR',
        payload: {
          error: toError(err),
        }
      }))
    );

  constructor(
    private actions: Actions,
    private service: InfoSourcesFirebaseService,
  ) {
  }
}

export interface InfoSourceFirebaseInsertSuccessAction extends Action {
  type: 'INFO_SOURCE_FIREBASE_INSERT_SUCCESS';
  payload: {
    infoSourceId: string;
  }
}

export interface InfoSourceFirebaseInsertErrorAction extends Action {
  type: 'INFO_SOURCE_FIREBASE_INSERT_ERROR';
  payload: {
    error: Error;
  }
}
