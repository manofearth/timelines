import { FirebaseEffects } from './firebase.effects';
import { EffectsRunner } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { SignupAction, SignupSuccessAction, SignupErrorAction, LoginSuccessAction } from './reducers/auth.reducer';
import { ReplaySubject } from 'rxjs/ReplaySubject';

class MockFireAuth extends ReplaySubject<FirebaseAuthState> {
  createUser() {}
}

describe('FirebaseEffects', () => {

  let effects: FirebaseEffects;
  let runner: EffectsRunner;
  let firebase: AngularFire;

  beforeEach(() => {

    runner = new EffectsRunner();

    firebase = <any> {
      auth: new MockFireAuth(),
    };

    effects = new FirebaseEffects(new Actions(runner), firebase);

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

  describe('on ACTION_SIGNUP', () => {

    it('should create firebase user', () => {

      spyOn(firebase.auth, 'createUser').and.returnValue(new Promise(() => {
      }));

      effects.signup.subscribe();

      expect(firebase.auth.createUser).toHaveBeenCalledWith({
        email: 'test@test.ru',
        password: '123456',
      });

    });

    it('should emit ACTION_SIGNUP_SUCCESS', done => {

      spyOn(firebase.auth, 'createUser').and.returnValue(Promise.resolve('some response'));

      effects.signup.subscribe((result: SignupSuccessAction) => {
        expect(result.type).toBe('ACTION_SIGNUP_SUCCESS');
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

  describe('on firebase auth state change', () => {

    it('should emit ACTION_LOGIN_SUCCESS', done => {

      firebase.auth.next(<any>'firebase auth state');

      effects.login.subscribe((action: LoginSuccessAction) => {
        expect(action.type).toBe('ACTION_LOGIN_SUCCESS');
        expect(action.payload).toBe('firebase auth state');
        done();
      })
    });

  });

});
