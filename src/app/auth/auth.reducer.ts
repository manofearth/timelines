import { LoginFormData } from './login/login.component';
import { SignupFormData } from './signup/signup.component';
import { Action } from '@ngrx/store';

export interface AuthState {
  isLoading: boolean;
  error: Error;
  user: User;
}

export type AuthActionType = 'SIGNUP' | 'LOGIN' | 'SIGNUP_SUCCESS' | 'SIGNUP_ERROR'
  | 'LOGIN_SUCCESS' | 'LOGIN_ERROR' | 'AUTH_STATE_CHANGED' | 'LOGOUT'
  | 'LOGOUT_SUCCESS';

export interface AuthAction extends Action {
  type: AuthActionType;
}

export interface SignupAction extends AuthAction {
  type: 'SIGNUP';
  payload: SignupFormData;
}

export interface SignupSuccessAction extends AuthAction {
  type: 'SIGNUP_SUCCESS';
  payload: User;
}

export interface SignupErrorAction extends AuthAction {
  type: 'SIGNUP_ERROR';
  payload: Error;
}

export interface LoginAction extends AuthAction {
  type: 'LOGIN';
  payload: LoginFormData;
}

export interface LoginSuccessAction extends AuthAction {
  type: 'LOGIN_SUCCESS';
  payload: User;
}

export interface LoginErrorAction extends AuthAction {
  type: 'LOGIN_ERROR';
  payload: Error;
}

export interface AuthStateChangedAction extends AuthAction {
  type: 'AUTH_STATE_CHANGED';
  payload: User;
}

export interface LogoutAction extends AuthAction {
    type: 'LOGOUT',
}

export interface LogoutSuccessAction extends AuthAction {
    type: 'LOGOUT_SUCCESS',
}

export interface User {
  email: string;
  isAdmin?: boolean;
}

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SIGNUP_SUCCESS':
    case 'LOGIN_SUCCESS':
      return Object.assign({}, state, { error: null });
    case 'SIGNUP_ERROR':
    case 'LOGIN_ERROR':
      return Object.assign({}, state, { error: action.payload });
    case 'AUTH_STATE_CHANGED':
      return Object.assign({}, state, { isLoading: false, user: action.payload });
    default:
      return state;
  }
}
