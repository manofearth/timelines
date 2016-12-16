import { FirebaseTimelinesEffects } from './firebase-timelines.effects';
import { EffectsRunner } from '@ngrx/effects/testing';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { Observable, ReplaySubject } from '../../shared/rxjs';
import { Actions } from '@ngrx/effects';
import { TimelinesGetAction, TimelinesGetSuccessAction } from '../../reducers/timelines.reducer';

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

    it('should not query firebase database', () => {

      spyOn(firebase.database, 'list');
      runner.next(<TimelinesGetAction>{ type: 'ACTION_TIMELINES_GET' });
      effects.timelinesGet.subscribe();
      expect(firebase.database.list).not.toHaveBeenCalled();

    });

    it('should not emit actions', () => {
      runner.next(<TimelinesGetAction>{ type: 'ACTION_TIMELINES_GET' });
      effects.timelinesGet.subscribe(() => {
        fail('should not emit actions');
      });
    });

  });

  describe('when logged in', () => {
    beforeEach(() => {
      authStateChanges.next(<any>{ uid: 'some uid' });
      runner.next(<TimelinesGetAction>{ type: 'ACTION_TIMELINES_GET' });
    });

    it('should query firebase database', () => {
      spyOn(firebase.database, 'list').and.returnValue(Observable.of([]));
      effects.timelinesGet.subscribe();
      expect(firebase.database.list).toHaveBeenCalledWith('/private/some uid/timelines');
    });

    it('should emit ACTION_TIMELINES_GET_SUCCESS', (done: DoneFn) => {

      firebase.database.list = <any>(() => Observable.of([
        { $key: '1', title: 'Timeline 1' },
        { $key: '2', title: 'Timeline 2' },
      ]));

      effects.timelinesGet.subscribe((action: TimelinesGetSuccessAction) => {
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
      runner.next(<TimelinesGetAction>{ type: 'ACTION_TIMELINES_GET' });

      effects.timelinesGet.subscribe((action: TimelinesGetSuccessAction) => {
        expect(action.type).toBe('ACTION_TIMELINES_GET_ERROR');
        expect(action.payload).toBe('some error');
        done();
      });
    });

  });

});