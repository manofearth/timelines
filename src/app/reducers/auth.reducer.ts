import { LoginFormData } from '../login/login.component';
import { SignupFormData } from '../signup/signup.component';
import { Action } from '@ngrx/store';

export interface AuthState {
  isLoading: boolean;
  error: Error;
  user: User;
}

export type AuthActionType = 'ACTION_SIGNUP' | 'ACTION_LOGIN' | 'ACTION_SIGNUP_SUCCESS' | 'ACTION_SIGNUP_ERROR'
  | 'ACTION_LOGIN_SUCCESS' | 'ACTION_LOGIN_ERROR' | 'ACTION_AUTH_STATE_CHANGED' | 'ACTION_LOGOUT'
  | 'ACTION_LOGOUT_SUCCESS';

export interface AuthAction extends Action {
  type: AuthActionType;
}

export interface SignupAction extends AuthAction {
  type: 'ACTION_SIGNUP';
  payload: SignupFormData;
}

export interface SignupSuccessAction extends AuthAction {
  type: 'ACTION_SIGNUP_SUCCESS';
  payload: User;
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
  payload: User;
}

export interface LoginErrorAction extends AuthAction {
  type: 'ACTION_LOGIN_ERROR';
  payload: Error;
}

export interface AuthStateChangedAction extends AuthAction {
  type: 'ACTION_AUTH_STATE_CHANGED';
  payload: User;
}

export interface LogoutAction extends AuthAction {
    type: 'ACTION_LOGOUT',
}

export interface LogoutSuccessAction extends AuthAction {
    type: 'ACTION_LOGOUT_SUCCESS',
}

export interface User {
  email: string;
}

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'ACTION_SIGNUP_SUCCESS':
    case 'ACTION_LOGIN_SUCCESS':
      return Object.assign({}, state, { error: null });
    case 'ACTION_SIGNUP_ERROR':
    case 'ACTION_LOGIN_ERROR':
      return Object.assign({}, state, { error: action.payload });
    case 'ACTION_AUTH_STATE_CHANGED':
      return Object.assign({}, state, { isLoading: false, user: action.payload });
    default:
      return state;
  }
}