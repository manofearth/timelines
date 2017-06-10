import { EventFirebaseGetEffect } from './event-firebase-get.effect';
import { AuthFirebaseServiceStub } from '../../shared/firebase/auth-firebase.service.stub';
import { EffectsRunner } from '@ngrx/effects/testing';
import { EventsFirebaseService } from '../events-firebase.service';
import { Actions } from '@ngrx/effects';
import { EventGetAction, EventGetSuccessAction } from '../event.reducer';
import { DatabaseFirebaseServiceStub } from '../../shared/firebase/database-firebase.service.stub';

describe('EventFirebaseGetEffect', () => {

  let effectUnderTest: EventFirebaseGetEffect;
  let actions: EffectsRunner;
  let auth: AuthFirebaseServiceStub;
  let fireEvents: EventsFirebaseService;

  beforeEach(() => {

    actions = new EffectsRunner();
    auth = new AuthFirebaseServiceStub();

    const firebaseDatabase = new DatabaseFirebaseServiceStub({
      'private': {
        'some-user-id': {
          'events': {
            'some-event-id': {
              'title': 'some event title'
            }
          }
        }
      }
    });

    fireEvents = new EventsFirebaseService(firebaseDatabase, auth);

    effectUnderTest = new EventFirebaseGetEffect(
      new Actions(actions),
      auth,
      fireEvents
    );

    auth.logIn('some-user-id');
  });

  it('should get event from service and emit "success" action', (done: DoneFn) => {

    const action: EventGetAction = {
      type: 'EVENT_GET',
      payload: 'some-event-id'
    };
    actions.queue(action);

    effectUnderTest.effect.subscribe((successAction: EventGetSuccessAction) => {
      expect(successAction.type).toBe('EVENT_GET_SUCCESS');
      expect(successAction.payload.id).toBe('some-event-id');
      expect(successAction.payload.title).toBe('some event title');
      done();
    });
  });
});
