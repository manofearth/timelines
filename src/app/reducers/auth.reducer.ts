import { FirebaseAuthState } from 'angularfire2';
import { LoginFormData } from '../login/login.component';
import { SignupFormData } from '../signup/signup.component';
import { Action } from '@ngrx/store';

export interface AuthState {
  error: Error;
  user: FirebaseAuthState;
}

export type AuthActionType = 'ACTION_SIGNUP' | 'ACTION_LOGIN' | 'ACTION_SIGNUP_SUCCESS' | 'ACTION_SIGNUP_ERROR'
  | 'ACTION_LOGIN_SUCCESS';

export interface AuthAction extends Action {
  type: AuthActionType;
}

export interface SignupAction extends AuthAction {
  type: 'ACTION_SIGNUP';
  payload: SignupFormData;
}

export interface SignupSuccessAction extends AuthAction {
  type: 'ACTION_SIGNUP_SUCCESS';
}

export interface SignupErrorAction extends AuthAction {
  type: 'ACTION_SIGNUP_ERROR';
  payload: Error;
}

export interface LoginAction extends AuthAction {
  type: 'ACTION_LOGIN';
  payload: LoginFormData;
}

export interface LoginSuccessAction extends AuthAction {
  type: 'ACTION_LOGIN_SUCCESS';
  payload: FirebaseAuthState;
}

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'ACTION_SIGNUP_SUCCESS':
      return Object.assign({}, state, { error: null });
    case 'ACTION_SIGNUP_ERROR':
      return Object.assign({}, state, { error: action.payload });
    case 'ACTION_LOGIN_SUCCESS':
      return {
        error: null,
        user: action.payload,
      };
    default:
      return state;
  }
}