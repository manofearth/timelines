import { EventFirebaseInsertEffect } from './event-firebase-insert.effect';
import { AuthFirebaseServiceStub } from '../../shared/firebase/auth-firebase.service.stub';
import { EffectsRunner } from '@ngrx/effects/testing';
import { EventsFirebaseService } from '../events-firebase.service';
import { Actions } from '@ngrx/effects';
import { EventInsertAction, EventInsertSuccessAction } from '../event.reducer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('EventFirebaseInsertEffect', () => {

  let effectUnderTest: EventFirebaseInsertEffect;
  let actions: EffectsRunner;
  let auth: AuthFirebaseServiceStub;
  let fireEvents: EventsFirebaseService;

  beforeEach(() => {

    actions = new EffectsRunner();
    auth = new AuthFirebaseServiceStub();
    fireEvents = { pushObject: null } as any;

    effectUnderTest = new EventFirebaseInsertEffect(
      new Actions(actions),
      auth,
      fireEvents,
    );

    auth.logIn('some-user-uid');
  });

  it('should make api calls and emit "successful" event', (done: DoneFn) => {

    const action: EventInsertAction = {
      type: 'EVENT_INSERT',
      payload: {
        id: 'some-event-id',
        title: 'some event title',
        dateBegin: null,
        dateEnd: null
      }
    };
    actions.queue(action);

    spyOn(fireEvents, 'pushObject').and.returnValue(Observable.of('event-stub'));

    effectUnderTest.effect.subscribe((successAction: EventInsertSuccessAction) => {
      expect(successAction.type).toBe('EVENT_INSERT_SUCCESS');
      done();
    });

    expect(fireEvents.pushObject).toHaveBeenCalledWith({
      title: 'some event title',
      dateBegin: null,
      dateEnd: null
    });
  });
});
