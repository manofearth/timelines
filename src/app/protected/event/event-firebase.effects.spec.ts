//noinspection TypeScriptPreferShortImport
import { ReplaySubject } from '../../shared/rxjs';
import { EffectsRunner } from '@ngrx/effects/testing';
import { AngularFire, FirebaseAuthState, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Actions } from '@ngrx/effects';
import { EventFirebaseEffects, FirebaseTimelineEvent } from './event-firebase.effects';
import {
  EventUpdateAction, EventUpdateSuccessAction, EventInsertAction,
  EventInsertSuccessAction, EventInsertErrorAction
} from './event.reducer';

class MockFirebaseObject extends ReplaySubject<FirebaseTimelineEvent> {
  //noinspection JSMethodCanBeStatic
  update() {
    return Promise.resolve();
  }
}

class MockFirebaseList extends ReplaySubject<FirebaseTimelineEvent[]> {
  //noinspection JSMethodCanBeStatic
  push() {
    return Promise.resolve();
  }

  //noinspection JSMethodCanBeStatic
  remove() {
    return Promise.resolve();
  }
}

describe('EventFirebaseEffects', () => {

  let effects: EventFirebaseEffects;
  let runner: EffectsRunner;
  let authStateChanges: ReplaySubject<FirebaseAuthState>;
  let mockFirebase: AngularFire;
  let mockFirebaseObject: FirebaseObjectObservable<FirebaseTimelineEvent>;
  let mockFirebaseList: FirebaseListObservable<FirebaseTimelineEvent[]>;

  beforeEach(() => {

    authStateChanges = new ReplaySubject<FirebaseAuthState>();
    runner = new EffectsRunner();

    mockFirebaseObject = <any> new MockFirebaseObject();
    mockFirebaseList = <any> new MockFirebaseList();
    mockFirebase = <any>{
      auth: authStateChanges,
      database: {
        object: () => mockFirebaseObject,
        list: () => mockFirebaseList,
      },
    };

    effects = new EventFirebaseEffects(new Actions(runner), mockFirebase);

  });

  describe('when not logged in', () => {

    beforeEach(() => {
      runner.next(<EventUpdateAction>{ type: 'EVENT_UPDATE' });
      runner.next(<EventInsertAction>{ type: 'EVENT_INSERT' });
    });

    it('should not query firebase database', () => {
      spyOn(mockFirebase.database, 'object');
      effects.insert.subscribe();
      effects.update.subscribe();
      expect(mockFirebase.database.object).not.toHaveBeenCalled();
    });

    it('should not emit actions', () => {
      effects.insert.subscribe(() => {
        fail('should not emit actions');
      });
      effects.update.subscribe(() => {
        fail('should not emit actions');
      });
    });

  });

  describe('when logged in', () => {

    beforeEach(() => {
      authStateChanges.next(<any>{ uid: 'some-uid' });
    });

    describe('on EVENT_UPDATE', () => {

      beforeEach(() => {
        runner.next(<EventUpdateAction>{
          type: 'EVENT_UPDATE',
          payload: {
            id: 'some-event-id',
            title: 'some title',
            dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
            dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
          },
        });
      });

      it('should query firebase database', () => {
        spyOn(mockFirebase.database, 'object').and.callThrough();
        effects.update.subscribe();
        expect(mockFirebase.database.object).toHaveBeenCalledWith('/private/some-uid/events/some-event-id');
      });

      it('should update firebase database object', () => {

        spyOn(mockFirebaseObject, 'update').and.callThrough();
        effects.update.subscribe();
        expect(mockFirebaseObject.update).toHaveBeenCalledWith({
          title: 'some title',
          dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
          dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
        });

      });

      it('should emit EVENT_UPDATE_SUCCESS', (done: DoneFn) => {

        mockFirebaseObject.update = () => Promise.resolve();

        effects.update.subscribe((action: EventUpdateSuccessAction) => {
          expect(action.type).toBe('EVENT_UPDATE_SUCCESS');
          done();
        });

      });

      it('should emit EVENT_UPDATE_ERROR', (done: DoneFn) => {

        mockFirebaseObject.update = () => Promise.reject('some error');

        effects.update.subscribe((action: EventUpdateSuccessAction) => {
          expect(action.type).toBe('EVENT_UPDATE_ERROR');
          expect(action.payload).toBe('some error');
          done();
        });

      });

    });

    describe('on EVENT_INSERT', () => {
      beforeEach(() => {
        runner.next(<EventInsertAction>{
          type: 'EVENT_INSERT',
          payload: {
            id: null,
            title: 'some title',
            dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
            dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
          },
        });
      });

      it('should query firebase database', () => {
        spyOn(mockFirebase.database, 'list').and.callThrough();
        effects.insert.subscribe();
        expect(mockFirebase.database.list).toHaveBeenCalledWith('/private/some-uid/events');
      });

      it('should push new timeline-event to firebase database list', () => {
        spyOn(mockFirebaseList, 'push').and.returnValue(Promise.resolve({}));
        effects.insert.subscribe();
        expect(mockFirebaseList.push).toHaveBeenCalledWith({
          title: 'some title',
          dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
          dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
        });
      });

      it('should emit EVENT_INSERT_SUCCESS', (done: DoneFn) => {

        mockFirebaseList.push = <any> (() => Promise.resolve({ key: 'generated key' }));

        effects.insert.subscribe((action: EventInsertSuccessAction) => {
          expect(action.type).toBe('EVENT_INSERT_SUCCESS');
          expect(action.payload).toBe('generated key');
          done();
        });
      });

      it('should emit TIMELINES_CREATE_ERROR', (done: DoneFn) => {

        mockFirebaseList.push = <any> (() => Promise.reject('some error'));

        effects.insert.subscribe((action: EventInsertErrorAction) => {
          expect(action.type).toBe('EVENT_INSERT_ERROR');
          expect(action.payload).toEqual(new Error('some error'));
          done();
        });
      });
    });
  });

});
