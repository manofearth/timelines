import { SignupErrorAction } from './index';
import { authReducer } from './auth.reducer';

describe('signup-errors reducer', () => {

  it('on ACTION_SIGNUP_ERROR should put error in state', () => {

    const action: SignupErrorAction = {
      type: 'ACTION_SIGNUP_ERROR',
      payload: new Error('some error'),
    };

    const state: any = Object.freeze({});

    const newState = authReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      error: new Error('some error'),
    });

  });

});