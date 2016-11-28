import { FirebaseEffects } from './firebase.effects';
import { EffectsRunner } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { SignupAction } from './reducers';

describe('FirebaseEffects', () => {

  let effects: FirebaseEffects;
  let runner: EffectsRunner;
  let firebase: AngularFire;
  let firebaseObject: FirebaseObjectObservable<any/*todo*/>;

  beforeEach(() => {

    runner = new EffectsRunner();
    firebaseObject = <any>{
      set: () => {
      }
    };
    firebase = <any> {
      auth: {
        createUser: () => {
        }
      },
      database: {
        object: () => firebaseObject
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

    it('should create record in database if firebase auth created', () => {

      spyOn(firebase.auth, 'createUser').and.returnValue(Promise.resolve({
        uid: 'test_uid',
      }));
      spyOn(firebase.database, 'object').and.callThrough();
      spyOn(firebaseObject, 'set');

      runner.queue(action);

      effects.signup.subscribe();

      expect(firebase.database.object).toHaveBeenCalledWith('/users/test_uid');
      expect(firebaseObject.set).toHaveBeenCalledWith({
        email: 'test@test.ru'
      });
    });

  });

});