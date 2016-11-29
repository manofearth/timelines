import { SignupFormData } from './signup/signup.component';
import { Action } from '@ngrx/store';
import { LoginFormData } from './login/login.component';

export type ActionType = 'ACTION_SIGNUP' | 'ACTION_LOGIN';

interface TimelinesAction extends Action {
    type: ActionType;
}

export interface SignupAction extends TimelinesAction {
    type: 'ACTION_SIGNUP';
    payload: SignupFormData;
};

export interface SignupResultAction extends TimelinesAction {
    type: 'ACTION_SIGNUP_RESULT';
    payload: ;
};

export interface LoginAction extends TimelinesAction {
    type: 'ACTION_LOGIN';
    payload: LoginFormData;
};
