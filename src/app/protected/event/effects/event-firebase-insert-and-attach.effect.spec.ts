import { AuthFirebaseServiceStub } from '../../shared/firebase/auth-firebase.service.stub';
import { EffectsRunner } from '@ngrx/effects/testing';
import { EventsFirebaseService } from '../events-firebase.service';
import { TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';
import { Actions } from '@ngrx/effects';
import { EventInsertAndAttachToTimelineAction, EventInsertSuccessAction } from '../event.reducer';
import { EventFirebaseInsertAndAttachEffect } from './event-firebase-insert-and-attach.effect';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('EventFirebaseInsertAndAttachEffect', () => {

  let effectUnderTest: EventFirebaseInsertAndAttachEffect;
  let actions: EffectsRunner;
  let auth: AuthFirebaseServiceStub;
  let fireTimelines: TimelinesFirebaseService;
  let fireEvents: EventsFirebaseService;

  beforeEach(() => {

    actions = new EffectsRunner();
    auth = new AuthFirebaseServiceStub();
    fireTimelines = { attachEvent: null } as any;
    fireEvents = { attachToTimeline: null, pushObject: null } as any;

    effectUnderTest = new EventFirebaseInsertAndAttachEffect(
      new Actions(actions),
      auth,
      fireEvents,
      fireTimelines
    );

    auth.logIn('some-user-uid');
  });

  it('should make api calls and emit "successful" event', (done: DoneFn) => {

    const action: EventInsertAndAttachToTimelineAction = {
      type: 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE',
      payload: {
        timeline: {
          id: 'some-timeline-id',
        },
        event: {
          id: 'some-event-id',
          title: 'some event title',
          dateBegin: null,
          dateEnd: null
        }
      }
    };
    actions.queue(action);

    spyOn(fireTimelines, 'attachEvent').and.returnValue(Promise.resolve());
    spyOn(fireEvents, 'attachToTimeline').and.returnValue(Promise.resolve());
    spyOn(fireEvents, 'pushObject').and.returnValue(Observable.of({
      key: 'some-event-id'
    }));

    effectUnderTest.effect.subscribe((successAction: EventInsertSuccessAction) => {
      expect(successAction.type).toBe('EVENT_INSERT_SUCCESS');
      done();
    });

    expect(fireEvents.pushObject).toHaveBeenCalledWith({
      title: 'some event title',
      dateBegin: null,
      dateEnd: null
    });
    expect(fireEvents.attachToTimeline).toHaveBeenCalledWith('some-event-id', 'some-timeline-id');
    expect(fireTimelines.attachEvent).toHaveBeenCalledWith('some-timeline-id', 'some-event-id');
  });
});
