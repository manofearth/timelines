import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { SignupAction, SignupSuccessAction, SignupErrorAction } from './reducers/auth.reducer';
import { LoginSuccessAction } from './reducers/auth.reducer';

@Injectable()
export class FirebaseEffects {

  @Effect() signup: Observable<SignupSuccessAction|SignupErrorAction> = this.actions
    .ofType('ACTION_SIGNUP')
    .flatMap((action: SignupAction) =>
      Observable.fromPromise(
        <Promise<FirebaseAuthState>>this.fire.auth.createUser({
          email: action.payload.email,
          password: action.payload.password,
        }))
        .map((authState: FirebaseAuthState): SignupSuccessAction => ({
          type: 'ACTION_SIGNUP_SUCCESS',
          payload: { success: true },
        }))
        .catch((error: Error): Observable<SignupErrorAction> => Observable.of({
          type: <'ACTION_SIGNUP_ERROR'>'ACTION_SIGNUP_ERROR',
          payload: error,
        }))
    );

  @Effect() login: Observable<LoginSuccessAction> = this.fire.auth
    .map((auth: FirebaseAuthState) => ({
      type: <'ACTION_LOGIN_SUCCESS'>'ACTION_LOGIN_SUCCESS',
      payload: auth,
    }));

  constructor(private actions: Actions, private fire: AngularFire) {
  }

}
