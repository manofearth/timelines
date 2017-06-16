import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import {
  AuthStateChangedAction,
  LoginAction,
  LoginErrorAction,
  LoginSuccessAction,
  LogoutSuccessAction,
  SignupAction,
  SignupErrorAction,
  SignupSuccessAction,
  User
} from './auth.reducer';
import { AngularFireAuth } from 'angularfire2/auth';
import { User as FireUser } from 'firebase';

@Injectable()
export class FirebaseAuthEffects {

  @Effect() signup: Observable<SignupSuccessAction | SignupErrorAction> = this.actions
    .ofType('SIGNUP')
    .switchMap((action: SignupAction) =>
      Observable.fromPromise(
        <Promise<FireUser>>this.fireAuth.auth.createUserWithEmailAndPassword(
          action.payload.email,
          action.payload.password,
        ))
        .map((authState: FireUser): SignupSuccessAction => ({
          type: 'SIGNUP_SUCCESS',
          payload: toUser(authState),
        }))
        .catch((error: Error | string): Observable<SignupErrorAction> => Observable.of({
          type: <'SIGNUP_ERROR'>'SIGNUP_ERROR',
          payload: toError(error),
        }))
    );

  @Effect() login: Observable<LoginSuccessAction | LoginErrorAction> = this.actions
    .ofType('LOGIN')
    .switchMap((action: LoginAction) =>
      Observable.fromPromise(
        <Promise<FireUser>>this.fireAuth.auth.signInWithEmailAndPassword(
          action.payload.email,
          action.payload.password,
        ))
        .map((authState: FireUser): LoginSuccessAction => ({
          type: 'LOGIN_SUCCESS',
          payload: toUser(authState),
        }))
        .catch((error: Error | string): Observable<LoginErrorAction> =>
          Observable.of({
            type: <'LOGIN_ERROR'>'LOGIN_ERROR',
            payload: toError(error),
          })
        )
    );

  @Effect() logout: Observable<LogoutSuccessAction> = this.actions
    .ofType('LOGOUT')
    .map((): LogoutSuccessAction => {
      this.fireAuth.auth.signOut();
      return { type: 'LOGOUT_SUCCESS' }
    });

  @Effect() auth: Observable<AuthStateChangedAction> = this.fireAuth.authState
    .map((authState: FireUser): AuthStateChangedAction => ({
      type: 'AUTH_STATE_CHANGED',
      payload: toUser(authState),
    }));

  constructor(private actions: Actions, private fireAuth: AngularFireAuth) {
  }

}

function toUser(authState: FireUser): User {

  if (authState === null) {
    return null;
  } else {
    return {
      email: authState.email,
    }
  }
}

function toError(error: Error | string): Error {

  if (error instanceof Error) {
    // May have "TypeError: Cannot assign to read only property 'microTask' of object '#<Object>'" later.
    // Don't know what causes this error, so this is workaround:
    if (error.hasOwnProperty('__zone_symbol__currentTask')) {
      delete error['__zone_symbol__currentTask'];
    }
    return error;
  } else {
    return new Error(error);
  }
}
