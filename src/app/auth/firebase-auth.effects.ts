import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import {
  SignupAction,
  SignupSuccessAction,
  SignupErrorAction,
  LoginAction,
  LoginErrorAction,
  LoginSuccessAction,
  User,
  AuthStateChangedAction,
  LogoutSuccessAction
} from '../reducers/auth.reducer';

@Injectable()
export class FirebaseAuthEffects {

  @Effect() signup: Observable<SignupSuccessAction|SignupErrorAction> = this.actions
    .ofType('ACTION_SIGNUP')
    .switchMap((action: SignupAction) =>
      Observable.fromPromise(
        <Promise<FirebaseAuthState>>this.fire.auth.createUser({
          email: action.payload.email,
          password: action.payload.password,
        }))
        .map((authState: FirebaseAuthState): SignupSuccessAction => ({
          type: 'ACTION_SIGNUP_SUCCESS',
          payload: toUser(authState),
        }))
        .catch((error: Error|string): Observable<SignupErrorAction> => Observable.of({
          type: <'ACTION_SIGNUP_ERROR'>'ACTION_SIGNUP_ERROR',
          payload: toError(error),
        }))
    );

  @Effect() login: Observable<LoginSuccessAction|LoginErrorAction> = this.actions
    .ofType('ACTION_LOGIN')
    .switchMap((action: LoginAction) =>
      Observable.fromPromise(
        <Promise<FirebaseAuthState>>this.fire.auth.login({
          email: action.payload.email,
          password: action.payload.password,
        }, {
          method: AuthMethods.Password,
        }))
        .map((authState: FirebaseAuthState): LoginSuccessAction => ({
          type: 'ACTION_LOGIN_SUCCESS',
          payload: toUser(authState),
        }))
        .catch((error: Error|string): Observable<LoginErrorAction> => Observable.of({
          type: <'ACTION_LOGIN_ERROR'>'ACTION_LOGIN_ERROR',
          payload: toError(error),
        }))
    );

  @Effect() logout: Observable<LogoutSuccessAction> = this.actions
    .ofType('ACTION_LOGOUT')
    .map((): LogoutSuccessAction => {
      this.fire.auth.logout();
      return { type: 'ACTION_LOGOUT_SUCCESS' }
    });

  @Effect() auth: Observable<AuthStateChangedAction> = this.fire.auth
    .map((authState: FirebaseAuthState): AuthStateChangedAction => ({
      type: 'ACTION_AUTH_STATE_CHANGED',
      payload: toUser(authState),
    }));

  constructor(private actions: Actions, private fire: AngularFire) {
  }

}

function toUser(authState: FirebaseAuthState): User {

  if (authState === null) {
    return null;
  } else {
    return {
      email: authState.auth.email,
    }
  }
}

function toError(error: Error|string): Error {

  if(error instanceof Error) {
    return error;
  } else {
    return new Error(error);
  }
}