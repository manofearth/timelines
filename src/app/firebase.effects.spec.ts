import { FirebaseEffects } from './firebase.effects';
import { EffectsRunner } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { AngularFire } from 'angularfire2';
import {
  SignupAction, SignupSuccessAction, SignupErrorAction, LoginAction,
  LoginSuccessAction, LoginErrorAction
} from './reducers/auth.reducer';

describe('FirebaseEffects', () => {

  let effects: FirebaseEffects;
  let runner: EffectsRunner;
  let firebase: AngularFire;

  beforeEach(() => {

    runner = new EffectsRunner();

    firebase = <any> {
      auth: {
        createUser: () => {
        },
        login: () => {
        },
      },
    };

    effects = new FirebaseEffects(new Actions(runner), firebase);

  });

  describe('on ACTION_SIGNUP', () => {

    beforeEach(() => {

      const action: SignupAction = {
        type: 'ACTION_SIGNUP',
        payload: {
          email: 'test@test.ru',
          password: '123456',
          passwordAgain: '123456',
        },
      };

      runner.queue(action);

    });

    it('should create firebase user', () => {

      spyOn(firebase.auth, 'createUser').and.returnValue(Promise.resolve());

      effects.signup.subscribe();

      expect(firebase.auth.createUser).toHaveBeenCalledWith({
        email: 'test@test.ru',
        password: '123456',
      });

    });

    it('should emit ACTION_SIGNUP_SUCCESS', done => {

      spyOn(firebase.auth, 'createUser').and.returnValue(Promise.resolve('firebase auth state'));

      effects.signup.subscribe((result: SignupSuccessAction) => {
        expect(result.type).toBe('ACTION_SIGNUP_SUCCESS');
        expect(result.payload).toBe('firebase auth state');
        done();
      });

    });

    it('should emit ACTION_SIGNUP_ERROR', done => {

      spyOn(firebase.auth, 'createUser').and.returnValue(Promise.reject(new Error('some error')));

      effects.signup.subscribe((result: SignupErrorAction) => {
        expect(result.type).toBe('ACTION_SIGNUP_ERROR');
        expect(result.payload).toEqual(new Error('some error'));
        done();
      });

    });

  });

  describe('on ACTION_LOGIN', () => {

    beforeEach(() => {

      const action: LoginAction = {
        type: 'ACTION_LOGIN',
        payload: {
          email: 'test@test.ru',
          password: '123456',
        },
      };

      runner.queue(action);

    });

    it('should login firebase user', () => {

      spyOn(firebase.auth, 'login').and.returnValue(Promise.resolve());

      effects.login.subscribe();

      expect(firebase.auth.login).toHaveBeenCalledWith({
        email: 'test@test.ru',
        password: '123456',
      });

    });

    it('should emit ACTION_LOGIN_SUCCESS', done => {

      spyOn(firebase.auth, 'login').and.returnValue(Promise.resolve('firebase auth state'));

      effects.login.subscribe((result: LoginSuccessAction) => {
        expect(result.type).toBe('ACTION_LOGIN_SUCCESS');
        expect(result.payload).toBe('firebase auth state');
        done();
      });

    });

    it('should emit ACTION_LOGIN_ERROR', done => {

      spyOn(firebase.auth, 'login').and.returnValue(Promise.reject(new Error('some error')));

      effects.login.subscribe((result: LoginErrorAction) => {
        expect(result.type).toBe('ACTION_LOGIN_ERROR');
        expect(result.payload).toEqual(new Error('some error'));
        done();
      });

    });

  });

});
