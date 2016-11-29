import { FirebaseEffects } from './firebase.effects';
import { EffectsRunner } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { SignupAction } from './reducers';

describe('FirebaseEffects', () => {

  let effects: FirebaseEffects;
  let runner: EffectsRunner;
  let firebase: AngularFire;

  beforeEach(() => {

    runner = new EffectsRunner();

    firebase = <any> {
      auth: {
        createUser: () => {
        }
      }
    };

    effects = new FirebaseEffects(new Actions(runner), firebase);

  });
  describe('on ACTION_SIGNUP', () => {

    const action: SignupAction = {
      type: 'ACTION_SIGNUP',
      payload: {
        email: 'test@test.ru',
        password: '123456',
        passwordAgain: '123456',
      },
    };

    it('should create firebase user', () => {

      spyOn(firebase.auth, 'createUser').and.returnValue(new Promise(() => {
      }));

      runner.queue(action);

      effects.signup.subscribe();

      expect(firebase.auth.createUser).toHaveBeenCalledWith({
        email: 'test@test.ru',
        password: '123456',
      });

    });

    it('should emit successful SIGNUP_RESULT', () => {

      spyOn(firebase.auth, 'createUser').and.returnValue(Promise.resolve('some response'));

      runner.queue(action);

      effects.signup.subscribe((result: SignupResultAction) => {

      });

    });

  });

});
