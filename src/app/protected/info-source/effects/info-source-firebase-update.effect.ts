import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { InfoSourcesFirebaseService } from '../../info-sources/info-sources-firebase.service';
import { InfoSourceModalSaveButtonAction } from '../info-source-modal.component';
import { isNew } from '../../shared/info-source/is-new.fn';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { toError } from '../../shared/firebase/protected-firebase.effect';

@Injectable()
export class InfoSourceFirebaseUpdateEffect {

  @Effect() effect = this.actions
    .ofType('INFO_SOURCE_MODAL_SAVE_BUTTON')
    .filter<InfoSourceModalSaveButtonAction>(action => !isNew(action.payload.infoSource))
    .mergeMap(action => this.service
      .updateObject(action.payload.infoSource.id, {
        title: action.payload.infoSource.title
      })
      .map((ref): InfoSourceFirebaseUpdateSuccessAction => ({
        type: 'INFO_SOURCE_FIREBASE_UPDATE_SUCCESS',
        payload: {
          infoSourceId: action.payload.infoSource.id,
        }
      }))
      .catch(err => Observable.of<InfoSourceFirebaseUpdateErrorAction>({
        type: 'INFO_SOURCE_FIREBASE_UPDATE_ERROR',
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

export interface InfoSourceFirebaseUpdateSuccessAction extends Action {
  type: 'INFO_SOURCE_FIREBASE_UPDATE_SUCCESS';
  payload: {
    infoSourceId: string;
  }
}

export interface InfoSourceFirebaseUpdateErrorAction extends Action {
  type: 'INFO_SOURCE_FIREBASE_UPDATE_ERROR';
  payload: {
    error: Error;
  }
}
