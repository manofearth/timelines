import { authReducer, SignupErrorAction, LoginSuccessAction, SignupSuccessAction } from './auth.reducer';

describe('signup-errors reducer', () => {

  it('on ACTION_SIGNUP_ERROR should push error in state', () => {

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

  it('on ACTION_SIGNUP_SUCCESS should erase error from state', () => {

    const action: SignupSuccessAction = {
      type: 'ACTION_SIGNUP_SUCCESS',
    };

    const state: any = Object.freeze({ error: 'some error' });

    const newState = authReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({ error: null });

  });

  it('on ACTION_LOGIN_SUCCESS should push user in state and erase error', () => {

    const action: LoginSuccessAction = {
      type: 'ACTION_LOGIN_SUCCESS',
      payload: <any>'some user',
    };

    const state: any = Object.freeze({ error: 'some error'});

    const newState = authReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      error: null,
      user: 'some user',
    });

  });
});
