import { FirebaseAuthEffects } from './firebase-auth.effects';
import { EffectsRunner } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { AngularFire, FirebaseAuthState, AuthMethods } from 'angularfire2';
import {
  SignupAction,
  SignupSuccessAction,
  SignupErrorAction,
  LoginAction,
  LoginSuccessAction,
  LoginErrorAction,
  LogoutAction,
  AuthStateChangedAction
} from './auth.reducer';
import { ReplaySubject } from 'rxjs/ReplaySubject';

class MockFireAuth extends ReplaySubject<FirebaseAuthState> {
  createUser() {
  }

  login() {
  }

  logout() {
  }
}

describe('FirebaseAuthEffects', () => {

  let effects: FirebaseAuthEffects;
  let runner: EffectsRunner;
  let firebase: AngularFire;

  beforeEach(() => {

    runner = new EffectsRunner();

    firebase = <any> {
      auth: new MockFireAuth(),
    };

    effects = new FirebaseAuthEffects(new Actions(runner), firebase);

  });

  describe('on SIGNUP', () => {

    beforeEach(() => {

      const action: SignupAction = {
        type: 'SIGNUP',
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

    it('should emit SIGNUP_SUCCESS', done => {

      const mockAuth = {
        email: 'test@test.tt',
      };

      spyOn(firebase.auth, 'createUser').and.returnValue(Promise.resolve({ auth: mockAuth }));

      effects.signup.subscribe((result: SignupSuccessAction) => {
        expect(result.type).toBe('SIGNUP_SUCCESS');
        expect(result.payload).toEqual(mockAuth);
        done();
      });

    });

    it('should emit SIGNUP_ERROR', done => {

      spyOn(firebase.auth, 'createUser').and.returnValue(Promise.reject(new Error('some error')));

      effects.signup.subscribe((result: SignupErrorAction) => {
        expect(result.type).toBe('SIGNUP_ERROR');
        expect(result.payload).toEqual(new Error('some error'));
        done();
      });

    });

  });

  describe('on LOGIN', () => {

    beforeEach(() => {

      const action: LoginAction = {
        type: 'LOGIN',
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
        }, {
          method: AuthMethods.Password,
        },
      );

    });

    it('should emit LOGIN_SUCCESS', done => {

      const mockAuth = {
        email: 'test@test.tt',
      };

      spyOn(firebase.auth, 'login').and.returnValue(Promise.resolve({ auth: mockAuth }));

      effects.login.subscribe((result: LoginSuccessAction) => {
        expect(result.type).toBe('LOGIN_SUCCESS');
        expect(result.payload).toEqual(mockAuth);
        done();
      });

    });

    it('should emit LOGIN_ERROR', done => {

      spyOn(firebase.auth, 'login').and.returnValue(Promise.reject(new Error('some error')));

      effects.login.subscribe((result: LoginErrorAction) => {
        expect(result.type).toBe('LOGIN_ERROR');
        expect(result.payload).toEqual(new Error('some error'));
        done();
      });

    });

  });

  describe('on LOGOUT', () => {

    beforeEach(() => {

      const action: LogoutAction = {
        type: 'LOGOUT',
      };

      runner.queue(action);

    });

    it('should logout firebase user', () => {

      spyOn(firebase.auth, 'logout');

      effects.logout.subscribe();

      expect(firebase.auth.logout).toHaveBeenCalled();

    });
  });

  describe('on auth state change', () => {

    it('should emit AUTH_STATE_CHANGED on unauthorization', done => {

      firebase.auth.next(null);

      effects.auth.subscribe((auth: AuthStateChangedAction) => {
        expect(auth).toEqual({
          type: 'AUTH_STATE_CHANGED',
          payload: null,
        });
        done();
      });
    });

    it('should emit AUTH_STATE_CHANGED on authorization', done => {

      const mockFirebaseAuth = {
        email: 'test@test.tt',
      };

      firebase.auth.next(<any>{ auth: mockFirebaseAuth });

      effects.auth.subscribe((auth: AuthStateChangedAction) => {
        expect(auth).toEqual({
          type: 'AUTH_STATE_CHANGED',
          payload: mockFirebaseAuth,
        });
        done();
      });
    });

  });

});
