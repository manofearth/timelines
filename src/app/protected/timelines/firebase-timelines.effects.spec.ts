import { FirebaseTimelinesEffects } from './firebase-timelines.effects';
import { EffectsRunner } from '@ngrx/effects/testing';
import { AngularFire, FirebaseAuthState, FirebaseListObservable } from 'angularfire2';
import { Observable, ReplaySubject } from '../../shared/rxjs';
import { Actions } from '@ngrx/effects';
import {
  TimelinesGetAction,
  TimelinesGetSuccessAction,
  TimelinesCreateAction,
  TimelinesCreateSuccessAction
} from '../../reducers/timelines.reducer';

class MockFirebaseDatabase {
  list() {
  }
}

describe('FirebaseTimelinesEffects', () => {

  let effects: FirebaseTimelinesEffects;
  let runner: EffectsRunner;
  let firebase: AngularFire;
  let authStateChanges: ReplaySubject<FirebaseAuthState>;

  beforeEach(() => {

    authStateChanges = new ReplaySubject<FirebaseAuthState>();

    runner = new EffectsRunner();

    firebase = <any> {
      auth: authStateChanges,
      database: new MockFirebaseDatabase(),
    };

    effects = new FirebaseTimelinesEffects(new Actions(runner), firebase);
  });


  describe('when not logged in', () => {

    beforeEach(() => {
      runner.next(<TimelinesGetAction>{ type: 'ACTION_TIMELINES_GET' });
    });

    it('should not query firebase database', () => {
      spyOn(firebase.database, 'list');
      effects.get.subscribe();
      effects.create.subscribe();
      expect(firebase.database.list).not.toHaveBeenCalled();
    });

    it('should not emit actions', () => {
      effects.get.subscribe(() => {
        fail('should not emit actions');
      });
      effects.create.subscribe(() => {
        fail('should not emit actions');
      });
    });

  });

  describe('when logged in', () => {

    beforeEach(() => {
      authStateChanges.next(<any>{ uid: 'some uid' });
    });

    describe('get effect', () => {

      beforeEach(() => {
        runner.next(<TimelinesGetAction>{ type: 'ACTION_TIMELINES_GET' });
      });

      it('should query firebase database', () => {
        spyOn(firebase.database, 'list').and.returnValue(Observable.of([]));
        effects.get.subscribe();
        expect(firebase.database.list).toHaveBeenCalledWith('/private/some uid/timelines');
      });

      it('should emit ACTION_TIMELINES_GET_SUCCESS', (done: DoneFn) => {

        firebase.database.list = <any>(() => Observable.of([
          { $key: '1', title: 'Timeline 1' },
          { $key: '2', title: 'Timeline 2' },
        ]));

        effects.get.subscribe((action: TimelinesGetSuccessAction) => {
          expect(action.type).toBe('ACTION_TIMELINES_GET_SUCCESS');
          expect(action.payload).toEqual([
            { id: '1', title: 'Timeline 1' },
            { id: '2', title: 'Timeline 2' },
          ]);
          done();
        });
      });

      it('should emit ACTION_TIMELINES_GET_ERROR', (done: DoneFn) => {

        firebase.database.list = <any>(() => Observable.throw('some error'));

        effects.get.subscribe((action: TimelinesGetSuccessAction) => {
          expect(action.type).toBe('ACTION_TIMELINES_GET_ERROR');
          expect(action.payload).toBe('some error');
          done();
        });
      });

    });

    describe('create effect', () => {

      let mockListObservable: FirebaseListObservable<{ key: string}>;

      beforeEach(() => {
        runner.next(<TimelinesCreateAction>{ type: 'ACTION_TIMELINES_CREATE' });
        mockListObservable = <any> {
          push: () => Promise.resolve({}),
        };
        firebase.database.list = <any> (() => mockListObservable);
      });

      it('should query firebase database', () => {
        spyOn(firebase.database, 'list').and.callThrough();
        spyOn(mockListObservable, 'push').and.callThrough();
        effects.create.subscribe();
        expect(firebase.database.list).toHaveBeenCalledWith('/private/some uid/timelines');
        expect(mockListObservable.push).toHaveBeenCalledWith({ title: 'Новая лента' });
      });

      it('should emit ACTION_TIMELINES_CREATE_SUCCESS', (done: DoneFn) => {

        mockListObservable.push = <any> (() => Promise.resolve({ key: 'generated key' }));

        effects.create.subscribe((action: TimelinesCreateSuccessAction) => {
          expect(action.type).toBe('ACTION_TIMELINES_CREATE_SUCCESS');
          expect(action.payload).toBe('generated key');
          done();
        });
      });

      it('should emit ACTION_TIMELINES_CREATE_ERROR', (done: DoneFn) => {

        mockListObservable.push = <any> (() => Promise.reject('some error'));

        effects.create.subscribe((action: TimelinesCreateSuccessAction) => {
          expect(action.type).toBe('ACTION_TIMELINES_CREATE_ERROR');
          expect(action.payload).toEqual(new Error('some error'));
          done();
        });
      });

    });

  });

});