//noinspection TypeScriptPreferShortImport
import { ReplaySubject } from '../../shared/rxjs';
import {
  TimelineGetAction,
  TimelineGetSuccessAction,
  TimelineChangedAction,
  TimelineGetErrorAction, TimelineSaveSuccessAction
} from './timeline.reducer';
import { Actions } from '@ngrx/effects';
import { TimelineFirebaseEffects, FirebaseTimeline, SAVE_DEBOUNCE_TIME } from './timeline-firebase.effects';
import { EffectsRunner } from '@ngrx/effects/testing';
import { FirebaseAuthState, AngularFire } from 'angularfire2';
import { fakeAsync, tick } from '@angular/core/testing';

class MockFirebaseObject extends ReplaySubject<FirebaseTimeline> {
  //noinspection JSMethodCanBeStatic
  update() {
    return Promise.resolve();
  }
}

describe('TimelineFirebaseEffects', () => {

  let effects: TimelineFirebaseEffects;
  let runner: EffectsRunner;
  let firebase: AngularFire;
  let authStateChanges: ReplaySubject<FirebaseAuthState>;
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

    effects = new TimelineFirebaseEffects(new Actions(runner), firebase);
  });


  describe('when not logged in', () => {

    beforeEach(() => {
      runner.next(<TimelineGetAction>{ type: 'TIMELINE_GET' });
      runner.next(<TimelineChangedAction>{ type: 'TIMELINE_CHANGED' });
    });

    it('should not query firebase database', () => {
      spyOn(firebase.database, 'object');
      effects.get.subscribe();
      effects.save.subscribe();
      expect(firebase.database.object).not.toHaveBeenCalled();
    });

    it('should not emit actions', () => {
      effects.get.subscribe(() => {
        fail('should not emit actions');
      });
      effects.save.subscribe(() => {
        fail('should not emit actions');
      });
    });

  });

  describe('when logged in', () => {

    beforeEach(() => {
      authStateChanges.next(<any>{ uid: 'some-uid' });
    });

    describe('on TIMELINE_GET', () => {

      beforeEach(() => {
        runner.next(<TimelineGetAction>{
          type: 'TIMELINE_GET',
          payload: 'some-timeline-id'
        });
      });

      it('should emit TIMELINE_GET_SUCCESS', (done: DoneFn) => {

        mockFirebaseObject.next({ $key: '1', title: 'Timeline 1' });

        effects.get.subscribe((action: TimelineGetSuccessAction) => {
          expect(action.type).toBe('TIMELINE_GET_SUCCESS');
          expect(action.payload).toEqual({ id: '1', title: 'Timeline 1' });
          done();
        });
      });

      it('should emit TIMELINE_GET_ERROR', (done: DoneFn) => {

        mockFirebaseObject.error('some error');

        effects.get.subscribe((action: TimelineGetErrorAction) => {
          expect(action.type).toBe('TIMELINE_GET_ERROR');
          expect(action.payload).toBe('some error');
          done();
        });
      });
    });

    describe('on TIMELINE_CHANGED', () => {

      beforeEach(fakeAsync(() => {
        runner.next(<TimelineChangedAction>{
          type: 'TIMELINE_CHANGED',
          payload: {
            id: 'some-timeline-id',
            title: 'some title'
          },
        });
      }));

      it('should update firebase database object', fakeAsync(() => {
        spyOn(mockFirebaseObject, 'update').and.callThrough();
        effects.save.subscribe();
        tick(SAVE_DEBOUNCE_TIME);
        expect(mockFirebaseObject.update).toHaveBeenCalledWith({ title: 'some title' });
      }));

      it('should emit TIMELINE_SAVE_SUCCESS', (done: DoneFn) => {

        fakeAsync(() => {
          mockFirebaseObject.update = () => Promise.resolve();

          effects.save.subscribe((action: TimelineSaveSuccessAction) => {
            expect(action.type).toBe('TIMELINE_SAVE_SUCCESS');
            done();
          });
          tick(SAVE_DEBOUNCE_TIME);
        })();

      });

      it('should emit TIMELINE_SAVE_ERROR', (done: DoneFn) => {

        fakeAsync(() => {
          mockFirebaseObject.update = () => Promise.reject('some error');

          effects.save.subscribe((action: TimelineSaveSuccessAction) => {
            expect(action.type).toBe('TIMELINE_SAVE_ERROR');
            expect(action.payload).toBe('some error');
            done();
          });
          tick(SAVE_DEBOUNCE_TIME);
        })();

      });

    });

  });

  describe('multiple actions', () => {

    let firebaseObjectSpy: jasmine.Spy;

    beforeEach(() => {
      firebaseObjectSpy = spyOn(firebase.database, 'object').and.callThrough();
      effects.get.subscribe();
      effects.save.subscribe();
    });

    it('should not query firebase database repeatedly if user or object key not changed', fakeAsync(() => {

      authStateChanges.next(<any>{ uid: 'first-user-uid' });

      runner.next(<TimelineGetAction>{
        type: 'TIMELINE_GET',
        payload: 'first-timeline-id'
      });
      runner.next(<TimelineGetAction>{
        type: 'TIMELINE_GET',
        payload: 'first-timeline-id' // object key not changed
      });
      runner.next(<TimelineChangedAction>{
        type: 'TIMELINE_CHANGED',
        payload: { id: 'first-timeline-id' }, // object key not changed
      });
      tick(SAVE_DEBOUNCE_TIME);
      runner.next(<TimelineChangedAction>{
        type: 'TIMELINE_CHANGED',
        payload: { id: 'first-timeline-id' }, // object key not changed
      });
      tick(SAVE_DEBOUNCE_TIME);

      expect(firebase.database.object).toHaveBeenCalledWith('/private/first-user-uid/timelines/first-timeline-id');
      expect(firebaseObjectSpy.calls.count()).toBe(1);

    }));

    it('should query firebase database repeatedly if object key changed', fakeAsync(() => {

      authStateChanges.next(<any>{ uid: 'first-user-uid' });

      runner.next(<TimelineGetAction>{
        type: 'TIMELINE_GET',
        payload: 'first-timeline-id'
      });
      runner.next(<TimelineGetAction>{
        type: 'TIMELINE_GET',
        payload: 'second-timeline-id' // object key changed
      });
      runner.next(<TimelineChangedAction>{
        type: 'TIMELINE_CHANGED',
        payload: { id: 'third-timeline-id' }, // object key changed
      });
      tick(SAVE_DEBOUNCE_TIME);
      runner.next(<TimelineChangedAction>{
        type: 'TIMELINE_CHANGED',
        payload: { id: 'fourth-timeline-id' }, // object key changed
      });
      tick(SAVE_DEBOUNCE_TIME);

      expect(firebaseObjectSpy.calls.allArgs()).toEqual([
        ['/private/first-user-uid/timelines/first-timeline-id'],
        ['/private/first-user-uid/timelines/second-timeline-id'],
        ['/private/first-user-uid/timelines/third-timeline-id'],
        ['/private/first-user-uid/timelines/fourth-timeline-id'],
      ]);

    }));

    it('should query firebase database repeatedly if user changed', fakeAsync(() => {

      authStateChanges.next(<any>{ uid: 'first-user-uid' });
      runner.next(<TimelineGetAction>{
        type: 'TIMELINE_GET',
        payload: 'first-timeline-id'
      });

      authStateChanges.next(<any>{ uid: 'second-user-uid' }); // user changed
      runner.next(<TimelineGetAction>{
        type: 'TIMELINE_GET',
        payload: 'first-timeline-id' // object key not changed
      });

      authStateChanges.next(<any>{ uid: 'third-user-uid' }); // user changed
      runner.next(<TimelineChangedAction>{
        type: 'TIMELINE_CHANGED',
        payload: { id: 'first-timeline-id' }, // object key not changed
      });
      tick(SAVE_DEBOUNCE_TIME);

      authStateChanges.next(<any>{ uid: 'fourth-user-uid' }); // user changed
      runner.next(<TimelineChangedAction>{
        type: 'TIMELINE_CHANGED',
        payload: { id: 'first-timeline-id' }, // object key not changed
      });
      tick(SAVE_DEBOUNCE_TIME);

      expect(firebaseObjectSpy.calls.allArgs()).toEqual([
        ['/private/first-user-uid/timelines/first-timeline-id'],
        ['/private/second-user-uid/timelines/first-timeline-id'],
        ['/private/third-user-uid/timelines/first-timeline-id'],
        ['/private/fourth-user-uid/timelines/first-timeline-id'],
      ]);

    }));

  });

});
