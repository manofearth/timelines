import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {
  SignupAction, SignupSuccessAction, SignupErrorAction, LoginAction,
  LoginErrorAction
} from './reducers/auth.reducer';
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
          payload: authState,
        }))
        .catch((error: Error): Observable<SignupErrorAction> => Observable.of({
          type: <'ACTION_SIGNUP_ERROR'>'ACTION_SIGNUP_ERROR',
          payload: error,
        }))
    );

  @Effect() login: Observable<LoginSuccessAction|LoginErrorAction> = this.actions
    .ofType('ACTION_LOGIN')
    .flatMap((action: LoginAction) =>
      Observable.fromPromise(
        <Promise<FirebaseAuthState>>this.fire.auth.login({
          email: action.payload.email,
          password: action.payload.password,
        }))
        .map((authState: FirebaseAuthState): LoginSuccessAction => ({
          type: 'ACTION_LOGIN_SUCCESS',
          payload: authState,
        }))
        .catch((error: Error): Observable<LoginErrorAction> => Observable.of({
          type: <'ACTION_LOGIN_ERROR'>'ACTION_LOGIN_ERROR',
          payload: error,
        }))
    );

  constructor(private actions: Actions, private fire: AngularFire) {
  }

}
