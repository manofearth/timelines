import {
  TimelineGetAction,
  TimelineGetSuccessAction,
  TimelineChangedAction,
  TimelineGetErrorAction
} from './timeline.reducer';
import { Actions } from '@ngrx/effects';
import { FirebaseTimelineEffects, FirebaseTimeline } from './firebase-timeline.effects';
import { EffectsRunner } from '@ngrx/effects/testing';
import { FirebaseAuthState, AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Observable, ReplaySubject } from '../../shared/rxjs';

class MockFirebaseObject extends ReplaySubject<FirebaseTimeline> {
  update() {

  }
}

describe('FirebaseTimelineEffects', () => {

  let effects: FirebaseTimelineEffects;
  let runner: EffectsRunner;
  let firebase: AngularFire;
  let authStateChanges: ReplaySubject<FirebaseAuthState>;

  beforeEach(() => {

    authStateChanges = new ReplaySubject<FirebaseAuthState>();

    runner = new EffectsRunner();

    firebase = <any>{
      auth: authStateChanges,
      database: {
        object: () => new MockFirebaseObject(),
      },
    };

    effects = new FirebaseTimelineEffects(new Actions(runner), firebase);
  });


  describe('when not logged in', () => {

    beforeEach(() => {
      runner.next(<TimelineGetAction>{ type: 'ACTION_TIMELINE_GET' });
      runner.next(<TimelineChangedAction>{ type: 'ACTION_TIMELINE_CHANGED' });
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

    let mockFirebaseObject: MockFirebaseObject;

    beforeEach(() => {
      authStateChanges.next(<any>{ uid: 'some-uid' });
      runner.next(<TimelineGetAction>{
        type: 'ACTION_TIMELINE_GET',
        payload: 'some-timeline-id'
      });
      mockFirebaseObject = <any> firebase.database.object();
    });

    it('should emit ACTION_TIMELINE_GET_SUCCESS', (done: DoneFn) => {

      mockFirebaseObject.next({ id: '1', title: 'Timeline 1' });

      effects.get.subscribe((action: TimelineGetSuccessAction) => {
        expect(action.type).toBe('ACTION_TIMELINE_GET_SUCCESS');
        expect(action.payload).toEqual({ id: '1', title: 'Timeline 1' });
        done();
      });
    });

    it('should emit ACTION_TIMELINE_GET_ERROR', (done: DoneFn) => {
      firebase.database.object = <any>(() => Observable.throw('some error'));

      effects.get.subscribe((action: TimelineGetErrorAction) => {
        expect(action.type).toBe('ACTION_TIMELINE_GET_ERROR');
        expect(action.payload).toBe('some error');
        done();
      });
    });

  });

  it('should not query firebase database repeatedly until user or object id changed', () => {
    const firebaseObjectSpy: jasmine.Spy = spyOn(firebase.database, 'object').and.callThrough();

    effects.get.subscribe();
    effects.save.subscribe();

    authStateChanges.next(<any>{ uid: 'first-user-uid' });
    runner.next(<TimelineGetAction>{
      type: 'ACTION_TIMELINE_GET',
      payload: 'first-timeline-id'
    });
    runner.next(<TimelineChangedAction>{
      type: 'ACTION_TIMELINE_CHANGED',
      payload: { id: 'first-timeline-id' },
    });

    authStateChanges.next(<any>{ uid: 'second-user-uid' });
    runner.next(<TimelineGetAction>{
      type: 'ACTION_TIMELINE_GET',
      payload: 'second-timeline-id'
    });
    runner.next(<TimelineChangedAction>{
      type: 'ACTION_TIMELINE_CHANGED',
      payload: { id: 'second-timeline-id' },
    });

    expect(firebaseObjectSpy.calls.allArgs()).toEqual([
      ['/private/first-user-uid/timelines/first-timeline-id'],
      ['/private/second-user-uid/timelines/second-timeline-id'],
    ]);
  });

});
