import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { FirebaseInfoSource, InfoSourcesFirebaseService } from '../../info-sources/info-sources-firebase.service';
import { NavigatedToInfoSourceAction } from '../../info-sources/effects/info-sources-router.effect';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { toError } from '../../shared/firebase/protected-firebase.effect';

@Injectable()
export class InfoSourceFirebaseGetEffect {

  @Effect() effect = this.actions
    .ofType('NAVIGATED_TO_INFO_SOURCE')
    .switchMap((action: NavigatedToInfoSourceAction): Observable<InfoSourceFirebaseGetAction> => this.service
      .getObject(action.payload.infoSourceId)
      .map((fireInfoSource: FirebaseInfoSource): InfoSourceFirebaseGetSuccessAction => ({
        type: 'INFO_SOURCE_FIREBASE_GET_SUCCESS',
        payload: {
          infoSource: fireInfoSource,
        }
      }))
      .catch(err => Observable.of<InfoSourceFirebaseGetErrorAction>({
        type: 'INFO_SOURCE_FIREBASE_GET_ERROR',
        payload: {
          error: toError(err),
        }
      }))
    );

  constructor(
    private actions: Actions,
    private service: InfoSourcesFirebaseService,
  ) {}
}

type InfoSourceFirebaseGetAction = InfoSourceFirebaseGetSuccessAction | InfoSourceFirebaseGetErrorAction;

export interface InfoSourceFirebaseGetSuccessAction extends Action {
  type: 'INFO_SOURCE_FIREBASE_GET_SUCCESS';
  payload: {
    infoSource: FirebaseInfoSource;
  }
}

export interface InfoSourceFirebaseGetErrorAction extends Action {
  type: 'INFO_SOURCE_FIREBASE_GET_ERROR';
  payload: {
    error: Error;
  }
}
