import { AngularFireDatabase } from 'angularfire2';
import { AuthFirebaseService } from '../shared/firebase/auth-firebase.service';
import { TimelinesFirebaseService } from './timelines-firebase.service';

describe('TimelinesFirebaseService', () => {

  let serviceUnderTest: TimelinesFirebaseService;
  let fireDb: AngularFireDatabase;
  let fireAuth: AuthFirebaseService;

  beforeEach(() => {

    fireDb = {
      object: null,
    } as any;
    fireAuth = {
      uid: 'some-user-uid',
    } as any;

    serviceUnderTest = new TimelinesFirebaseService(fireDb, fireAuth);
  });

  describe('attachEvent', () => {
    it('should attach event to timeline in firebase and return observable', (done: DoneFn) => {

      const fireObjectMock = { set: null };
      spyOn(fireObjectMock, 'set').and.returnValue(Promise.resolve());
      spyOn(fireDb, 'object').and.returnValue(fireObjectMock);

      serviceUnderTest.attachEvent('some-timeline-key', 'some-event-key').subscribe(done);

      expect(fireDb.object)
        .toHaveBeenCalledWith('/private/some-user-uid/timelines/some-timeline-key/events/some-event-key');

      expect(fireObjectMock.set).toHaveBeenCalledWith(true);
    });
  });

  describe('detachEvent', () => {
    it('should detach event from timeline in firebase and return observable', (done: DoneFn) => {

      const fireObjectMock = { remove: null };
      spyOn(fireObjectMock, 'remove').and.returnValue(Promise.resolve());
      spyOn(fireDb, 'object').and.returnValue(fireObjectMock);

      serviceUnderTest.detachEvent('some-timeline-key', 'some-event-key').subscribe(done);

      expect(fireDb.object)
        .toHaveBeenCalledWith('/private/some-user-uid/timelines/some-timeline-key/events/some-event-key');

      expect(fireObjectMock.remove).toHaveBeenCalled();
    });
  });
});
