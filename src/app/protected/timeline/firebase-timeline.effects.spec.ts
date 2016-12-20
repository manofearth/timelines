import { TimelineGetAction, TimelineGetSuccessAction } from '../../reducers/timeline.reducer';
import { Actions } from '@ngrx/effects';
import { FirebaseTimelineEffects } from './firebase-timeline.effects';
import { EffectsRunner } from '@ngrx/effects/testing';
import { FirebaseAuthState, AngularFire } from 'angularfire2';
import { Observable, ReplaySubject } from '../../shared/rxjs';

class MockFirebaseDatabase {
  object() {
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

    firebase = <any> {
      auth: authStateChanges,
      database: new MockFirebaseDatabase(),
    };

    effects = new FirebaseTimelineEffects(new Actions(runner), firebase);
  });


  describe('when not logged in', () => {

    beforeEach(() => {
      runner.next(<TimelineGetAction>{ type: 'ACTION_TIMELINE_GET' });
    });

    it('should not query firebase database', () => {
      spyOn(firebase.database, 'object');
      effects.get.subscribe();
      expect(firebase.database.object).not.toHaveBeenCalled();
    });

    it('should not emit actions', () => {
      effects.get.subscribe(() => {
        fail('should not emit actions');
      });
    });

  });

  describe('when logged in', () => {
    beforeEach(() => {
      authStateChanges.next(<any>{ uid: 'some-uid' });
      runner.next(<TimelineGetAction>{
        type: 'ACTION_TIMELINE_GET',
        payload: 'some-timeline-id'
      });
    });

    it('should query firebase database', () => {
      spyOn(firebase.database, 'object').and.returnValue(Observable.of([]));
      effects.get.subscribe();
      expect(firebase.database.object).toHaveBeenCalledWith('/private/some-uid/timelines/some-timeline-id');
    });

    it('should emit ACTION_TIMELINE_GET_SUCCESS', (done: DoneFn) => {

      firebase.database.object = <any>(() => Observable.of({ $key: '1', title: 'Timeline 1' }));

      effects.get.subscribe((action: TimelineGetSuccessAction) => {
        expect(action.type).toBe('ACTION_TIMELINE_GET_SUCCESS');
        expect(action.payload).toEqual({ id: '1', title: 'Timeline 1' });
        done();
      });
    });

    it('should emit ACTION_TIMELINE_GET_ERROR', (done: DoneFn) => {

      firebase.database.object = <any>(() => Observable.throw('some error'));
      runner.next(<TimelineGetAction>{ type: 'ACTION_TIMELINE_GET' });

      effects.get.subscribe((action: TimelineGetSuccessAction) => {
        expect(action.type).toBe('ACTION_TIMELINE_GET_ERROR');
        expect(action.payload).toBe('some error');
        done();
      });
    });

  });

});
