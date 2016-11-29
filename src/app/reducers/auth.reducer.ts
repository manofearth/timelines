import { TimelinesAction } from './index';
import { FirebaseAuthState } from 'angularfire2';

export interface AuthState {
  error: Error;
  user: FirebaseAuthState;
}

export function authReducer(state: AuthState, action: TimelinesAction): AuthState {
  switch (action.type) {
    case 'ACTION_SIGNUP_ERROR':
      return Object.assign({}, state, { error: action.payload });
    default:
      return state;
  }
}