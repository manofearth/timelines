import { SignupFormData } from '../signup/signup.component';
import { Action } from '@ngrx/store';
import { LoginFormData } from '../login/login.component';

export type ActionType = 'ACTION_SIGNUP' | 'ACTION_LOGIN' | 'ACTION_SIGNUP_SUCCESS' | 'ACTION_SIGNUP_ERROR';

export interface TimelinesAction extends Action {
  type: ActionType;
}

export interface SignupAction extends TimelinesAction {
  type: 'ACTION_SIGNUP';
  payload: SignupFormData;
}

export interface SignupSuccessAction extends TimelinesAction {
  type: 'ACTION_SIGNUP_SUCCESS';
}

export interface SignupErrorAction extends TimelinesAction {
  type: 'ACTION_SIGNUP_ERROR';
  payload: Error;
}

export interface LoginAction extends TimelinesAction {
  type: 'ACTION_LOGIN';
  payload: LoginFormData;
}
