import {SignupFormData} from './signup/signup.component';
import {Action} from '@ngrx/store';

export type ActionType = 'ACTION_SIGNUP';

interface TimelinesAction extends Action {
    type: ActionType;
}

export interface SignupAction extends TimelinesAction {
    type: 'ACTION_SIGNUP';
    payload: SignupFormData;
};
