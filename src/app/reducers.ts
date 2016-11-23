import {LoginFormData} from './login/login.component';
import {Action} from '@ngrx/store';

export type ActionType = 'ACTION_LOGIN';

interface TimelinesAction extends Action {
    type: ActionType;
}

export interface LoginAction extends TimelinesAction {
    type: 'ACTION_LOGIN';
    payload: LoginFormData;
}