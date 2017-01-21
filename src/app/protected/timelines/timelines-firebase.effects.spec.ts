//noinspection TypeScriptPreferShortImport
import { ReplaySubject } from '../../shared/rxjs';
import { TimelinesFirebaseEffects } from './timelines-firebase.effects';
import { EffectsRunner } from '@ngrx/effects/testing';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { Actions } from '@ngrx/effects';
import {
  TimelinesGetAction,
  TimelinesGetSuccessAction,
  TimelinesCreateAction,
  TimelinesCreateSuccessAction,
  TimelinesDeleteAction,
  TimelinesDeleteSuccessAction
} from './timelines.reducer';
import { FirebaseTimeline } from '../timeline/timeline-firebase.effects';

class MockFirebaseList extends ReplaySubject<FirebaseTimeline[]> {
  //noinspection JSMethodCanBeStatic
  push() {
    return Promise.resolve();
  }

  //noinspection JSMethodCanBeStatic
  remove() {
    return Promise.resolve();
  }
}

describe('TimelinesFirebaseEffects', () => {

  let effects: TimelinesFirebaseEffects;
  let runner: EffectsRunner;
  let firebase: AngularFire;
  let authStateChanges: ReplaySubject<FirebaseAuthState>;
  let mockFirebaseList: MockFirebaseList;

  beforeEach(() => {

    authStateChanges = new ReplaySubject<FirebaseAuthState>();

    runner = new EffectsRunner();

    mockFirebaseList = new MockFirebaseList();
    firebase = <any> {
      auth: authStateChanges,
      database: {
        list: () => mockFirebaseList,
      },
    };

    effects = new TimelinesFirebaseEffects(new Actions(runner), firebase);
  });


  describe('when not logged in', () => {

    beforeEach(() => {
      runner.next(<TimelinesGetAction>{ type: 'TIMELINES_GET' });
      runner.next(<TimelinesCreateAction>{ type: 'TIMELINES_CREATE' });
      runner.next(<TimelinesDeleteAction>{ type: 'TIMELINES_DELETE' });
    });

    it('should not query firebase database', () => {
      spyOn(firebase.database, 'list');
      effects.get.subscribe();
      effects.create.subscribe();
      effects.deleteTimeline.subscribe();
      expect(firebase.database.list).not.toHaveBeenCalled();
    });

    it('should not emit actions', () => {
      effects.get.subscribe(() => {
        fail('should not emit actions');
      });
      effects.create.subscribe(() => {
        fail('should not emit actions');
      });
      effects.deleteTimeline.subscribe(() => {
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
        runner.next(<TimelinesGetAction>{ type: 'TIMELINES_GET' });
      });

      it('should emit TIMELINES_GET_SUCCESS', (done: DoneFn) => {

        mockFirebaseList.next([
          { $key: '1', title: 'Timeline 1' },
          { $key: '2', title: 'Timeline 2' },
        ]);

        effects.get.subscribe((action: TimelinesGetSuccessAction) => {
          expect(action.type).toBe('TIMELINES_GET_SUCCESS');
          expect(action.payload).toEqual([
            { id: '1', title: 'Timeline 1' },
            { id: '2', title: 'Timeline 2' },
          ]);
          done();
        });
      });

      it('should emit TIMELINES_GET_ERROR', (done: DoneFn) => {

        mockFirebaseList.error('some error');

        effects.get.subscribe((action: TimelinesGetSuccessAction) => {
          expect(action.type).toBe('TIMELINES_GET_ERROR');
          expect(action.payload).toBe('some error');
          done();
        });
      });

    });

    describe('create effect', () => {

      beforeEach(() => {
        runner.next(<TimelinesCreateAction>{ type: 'TIMELINES_CREATE' });
      });

      it('should push new timeline to firebase database list', () => {
        spyOn(mockFirebaseList, 'push').and.returnValue(Promise.resolve({}));
        effects.create.subscribe();
        expect(mockFirebaseList.push).toHaveBeenCalledWith({ title: 'Новая лента' });
      });

      it('should emit TIMELINES_CREATE_SUCCESS', (done: DoneFn) => {

        mockFirebaseList.push = () => Promise.resolve({ key: 'generated key' });

        effects.create.subscribe((action: TimelinesCreateSuccessAction) => {
          expect(action.type).toBe('TIMELINES_CREATE_SUCCESS');
          expect(action.payload).toBe('generated key');
          done();
        });
      });

      it('should emit TIMELINES_CREATE_ERROR', (done: DoneFn) => {

        mockFirebaseList.push = () => Promise.reject('some error');

        effects.create.subscribe((action: TimelinesCreateSuccessAction) => {
          expect(action.type).toBe('TIMELINES_CREATE_ERROR');
          expect(action.payload).toEqual(new Error('some error'));
          done();
        });
      });
    });

    describe('deleteTimeline effect', () => {

      beforeEach(() => {
        runner.next(<TimelinesDeleteAction>{
          type: 'TIMELINES_DELETE',
          payload: { id: 'some timeline id' },
        });
      });

      it('should delete timeline from firebase database list', () => {
        spyOn(mockFirebaseList, 'remove').and.returnValue(Promise.resolve());
        effects.deleteTimeline.subscribe();
        expect(mockFirebaseList.remove).toHaveBeenCalledWith('some timeline id');
      });

      it('should emit TIMELINES_DELETE_SUCCESS', (done: DoneFn) => {

        mockFirebaseList.remove = () => Promise.resolve();

        effects.deleteTimeline.subscribe((action: TimelinesDeleteSuccessAction) => {
          expect(action.type).toBe('TIMELINES_DELETE_SUCCESS');
          expect(action.payload).toBeUndefined();
          done();
        });
      });

      it('should emit TIMELINES_DELETE_ERROR', (done: DoneFn) => {

        mockFirebaseList.remove = () => Promise.reject('some error');

        effects.deleteTimeline.subscribe((action: TimelinesDeleteSuccessAction) => {
          expect(action.type).toBe('TIMELINES_DELETE_ERROR');
          expect(action.payload).toEqual(new Error('some error'));
          done();
        });
      });
    });

  });

  describe('multiple actions', () => {

    let firebaseListSpy: jasmine.Spy;

    beforeEach(() => {
      firebaseListSpy = spyOn(firebase.database, 'list').and.callThrough();
      effects.get.subscribe();
      effects.create.subscribe();
      effects.deleteTimeline.subscribe();
    });

    it('should not query firebase database repeatedly if user not changed', () => {

      authStateChanges.next(<any>{ uid: 'some-user-uid' });

      runner.next(<TimelinesGetAction>{ type: 'TIMELINES_GET' });
      runner.next(<TimelinesGetAction>{ type: 'TIMELINES_GET' });
      runner.next(<TimelinesCreateAction>{ type: 'TIMELINES_CREATE' });
      runner.next(<TimelinesCreateAction>{ type: 'TIMELINES_CREATE' });
      runner.next(<TimelinesDeleteAction>{
        type: 'TIMELINES_DELETE',
        payload: { id: 'some timeline id' },
      });
      runner.next(<TimelinesDeleteAction>{
        type: 'TIMELINES_DELETE',
        payload: { id: 'some timeline id' },
      });

      expect(firebaseListSpy.calls.count()).toBe(1);
      expect(firebase.database.list).toHaveBeenCalledWith('/private/some-user-uid/timelines');
    });

    it('should query firebase database repeatedly if user changed', () => {

      authStateChanges.next(<any>{ uid: 'first-user-uid' });
      runner.next(<TimelinesGetAction>{ type: 'TIMELINES_GET' });

      authStateChanges.next(<any>{ uid: 'second-user-uid' });
      runner.next(<TimelinesCreateAction>{ type: 'TIMELINES_CREATE' });

      expect(firebaseListSpy.calls.allArgs()).toEqual([
        ['/private/first-user-uid/timelines'],
        ['/private/second-user-uid/timelines'],
      ]);

    });

  });


});
