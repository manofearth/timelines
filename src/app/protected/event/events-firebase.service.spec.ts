import { EventsFirebaseService } from './events-firebase.service';
import { AngularFireDatabase } from 'angularfire2';
import { AuthFirebaseService } from '../shared/firebase/auth-firebase.service';

describe('EventsFirebaseService', () => {

  let serviceUnderTest: EventsFirebaseService;
  let fireDb: AngularFireDatabase;
  let fireAuth: AuthFirebaseService;

  beforeEach(() => {

    fireDb = {
      object: null,
    } as any;
    fireAuth = {
      uid: 'some-user-uid',
    } as any;

    serviceUnderTest = new EventsFirebaseService(fireDb, fireAuth);
  });

  describe('attachToTimeline', () => {
    it('should add timeline in attachments of event in firebase and return observable', (done: DoneFn) => {

      const fireObjectMock = { set: null };
      spyOn(fireObjectMock, 'set').and.returnValue(Promise.resolve());
      spyOn(fireDb, 'object').and.returnValue(fireObjectMock);

      serviceUnderTest.attachToTimeline('some-event-key', 'some-timeline-key').subscribe(done);

      expect(fireDb.object)
        .toHaveBeenCalledWith('/private/some-user-uid/events/some-event-key/timelines/some-timeline-key');

      expect(fireObjectMock.set).toHaveBeenCalledWith(true);
    });
  });

  describe('detachFromTimeline', () => {
    it('should remove timeline from attachments of event in firebase and return observable', (done: DoneFn) => {

      const fireObjectMock = { remove: null };
      spyOn(fireObjectMock, 'remove').and.returnValue(Promise.resolve());
      spyOn(fireDb, 'object').and.returnValue(fireObjectMock);

      serviceUnderTest.detachFromTimeline('some-event-key', 'some-timeline-key').subscribe(done);

      expect(fireDb.object)
        .toHaveBeenCalledWith('/private/some-user-uid/events/some-event-key/timelines/some-timeline-key');

      expect(fireObjectMock.remove).toHaveBeenCalled();
    });
  });
});
