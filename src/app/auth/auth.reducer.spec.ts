import {
  authReducer,
  SignupErrorAction,
  LoginSuccessAction,
  SignupSuccessAction,
  AuthState,
  LoginErrorAction, AuthStateChangedAction
} from './auth.reducer';

describe('authReducer', () => {

  it('on SIGNUP_ERROR should push error in state', () => {

    const action: SignupErrorAction = {
      type: 'SIGNUP_ERROR',
      payload: new Error('some error'),
    };

    const state: any = Object.freeze({});

    const newState = authReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      error: new Error('some error'),
    });

  });

  it('on SIGNUP_SUCCESS should erase error', () => {

    const action: SignupSuccessAction = {
      type: 'SIGNUP_SUCCESS',
      payload: <any>'firebase auth state'
    };

    const state: any = Object.freeze(<AuthState>{ isLoading: false, error: <any>'some error', user: null });

    const newState = authReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({ isLoading: false, error: null, user: null });

  });

  it('on LOGIN_SUCCESS should erase error', () => {

    const action: LoginSuccessAction = {
      type: 'LOGIN_SUCCESS',
      payload: <any>'firebase auth state',
    };

    const state: any = Object.freeze(<AuthState>{ isLoading: false, error: <any>'some error', user: null });

    const newState = authReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({ isLoading: false, error: null, user: null });

  });

  it('on SIGNUP_ERROR should set error', () => {

    const action: SignupErrorAction = {
      type: 'SIGNUP_ERROR',
      payload: <any>'some error',
    };

    const state: any = Object.freeze(<AuthState>{ isLoading: false, error: null, user: <any>'some user' });

    const newState = authReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({ isLoading: false, error: 'some error', user: 'some user' });
  });

  it('on LOGIN_ERROR should set error', () => {

    const action: LoginErrorAction = {
      type: 'LOGIN_ERROR',
      payload: <any>'some error',
    };

    const state: any = Object.freeze(<AuthState>{ isLoading: false, error: null, user: <any>'some user' });

    const newState = authReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({ isLoading: false, error: 'some error', user: 'some user' });
  });

  it('on AUTH_STATE_CHANGED should set user and set auth state as "not loading"', () => {

    const action: AuthStateChangedAction = {
      type: 'AUTH_STATE_CHANGED',
      payload: <any>'some user',
    };

    const state: any = Object.freeze(<AuthState>{ isLoading: true, error: <any>'some error', user: null });

    const newState = authReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({ isLoading: false, error: 'some error', user: 'some user' });
  });

});
