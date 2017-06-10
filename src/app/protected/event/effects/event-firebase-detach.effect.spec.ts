import { EventFirebaseDetachEffect } from './event-firebase-detach.effect';
import { EffectsRunner } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { AuthFirebaseServiceStub } from '../../shared/firebase/auth-firebase.service.stub';
import { TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';
import { EventsFirebaseService } from '../events-firebase.service';
import { EventDetachAction, EventDetachSuccessAction } from '../event.reducer';

describe('EventFirebaseDetachEffect', () => {

  let effectUnderTest: EventFirebaseDetachEffect;
  let actions: EffectsRunner;
  let auth: AuthFirebaseServiceStub;
  let fireTimelines: TimelinesFirebaseService;
  let fireEvents: EventsFirebaseService;

  beforeEach(() => {

    actions = new EffectsRunner();
    auth = new AuthFirebaseServiceStub();
    fireTimelines = { detachEvent: null } as any;
    fireEvents = { detachFromTimeline: null } as any;

    effectUnderTest = new EventFirebaseDetachEffect(
      new Actions(actions),
      auth,
      fireEvents,
      fireTimelines
    );

    auth.logIn('some-user-uid');
  });

  it('should make api calls and emit "successful" event', (done: DoneFn) => {

   const action: EventDetachAction = {
      type: 'EVENT_DETACH',
      payload: {
        timelineId: 'some-timeline-id',
        eventId: 'some-event-id'
      }
    };
    actions.queue(action);

    spyOn(fireTimelines, 'detachEvent').and.returnValue(Promise.resolve());
    spyOn(fireEvents, 'detachFromTimeline').and.returnValue(Promise.resolve());

    effectUnderTest.effect.subscribe((successAction: EventDetachSuccessAction) => {
      expect(successAction.type).toBe('EVENT_DETACH_SUCCESS');
      done();
    });

    expect(fireTimelines.detachEvent).toHaveBeenCalledWith('some-timeline-id', 'some-event-id');
    expect(fireEvents.detachFromTimeline).toHaveBeenCalledWith('some-event-id', 'some-timeline-id');
  });
});
