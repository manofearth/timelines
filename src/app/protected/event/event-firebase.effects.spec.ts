//noinspection TypeScriptPreferShortImport
import { ReplaySubject } from '../../shared/rxjs';
import { EffectsRunner } from '@ngrx/effects/testing';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { Actions } from '@ngrx/effects';
import { EventFirebaseEffects, FirebaseEvent } from './event-firebase.effects';
import { EventSaveAction, EventSaveSuccessAction } from './event.reducer';
import { fakeAsync } from '@angular/core/testing';

class MockFirebaseObject extends ReplaySubject<FirebaseEvent> {
  //noinspection JSMethodCanBeStatic
  update() {
    return Promise.resolve();
  }
}

describe('EventFirebaseEffects', () => {

  let effects: EventFirebaseEffects;
  let runner: EffectsRunner;
  let authStateChanges: ReplaySubject<FirebaseAuthState>;
  let firebase: AngularFire;
  let mockFirebaseObject: MockFirebaseObject;

  beforeEach(() => {

    authStateChanges = new ReplaySubject<FirebaseAuthState>();
    runner = new EffectsRunner();

    mockFirebaseObject = new MockFirebaseObject();
    firebase = <any>{
      auth: authStateChanges,
      database: {
        object: () => mockFirebaseObject,
      },
    };

    effects = new EventFirebaseEffects(new Actions(runner), firebase);

  });

  describe('when not logged in', () => {

    beforeEach(() => {
      runner.next(<EventSaveAction>{ type: 'EVENT_SAVE' });
    });

    it('should not query firebase database', () => {
      spyOn(firebase.database, 'object');
      effects.save.subscribe();
      expect(firebase.database.object).not.toHaveBeenCalled();
    });

    it('should not emit actions', () => {
      effects.save.subscribe(() => {
        fail('should not emit actions');
      });
    });

  });

  describe('when logged in', () => {

    beforeEach(() => {
      authStateChanges.next(<any>{ uid: 'some-uid' });
    });

    describe('on EVENT_CHANGED', () => {

      beforeEach(fakeAsync(() => {
        runner.next(<EventSaveAction>{
          type: 'EVENT_SAVE',
          payload: {
            id: 'some-event-id',
            title: 'some title',
            dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
            dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
          },
        });
      }));

      it('should update firebase database object', () => {

        spyOn(mockFirebaseObject, 'update').and.callThrough();
        effects.save.subscribe();
        expect(mockFirebaseObject.update).toHaveBeenCalledWith({
          title: 'some title',
          dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
          dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
        });

      });

      it('should emit EVENT_SAVE_SUCCESS', (done: DoneFn) => {

        mockFirebaseObject.update = () => Promise.resolve();

        effects.save.subscribe((action: EventSaveSuccessAction) => {
          expect(action.type).toBe('EVENT_SAVE_SUCCESS');
          done();
        });

      });

      it('should emit EVENT_SAVE_ERROR', (done: DoneFn) => {

        mockFirebaseObject.update = () => Promise.reject('some error');

        effects.save.subscribe((action: EventSaveSuccessAction) => {
          expect(action.type).toBe('EVENT_SAVE_ERROR');
          expect(action.payload).toBe('some error');
          done();
        });

      });

    });

  });

});