import { ProtectedFirebaseService } from './protected-firebase.service';
import { AngularFireDatabase } from 'angularfire2';
import { AuthFirebaseServiceStub } from './auth-firebase.service.stub';

class ProtectedFirebaseServiceStub extends ProtectedFirebaseService<any, any> {

  protected getFirebaseNodeName(): string {
    return 'some-node-name';
  }
}

describe('ProtectedFirebaseService', () => {

  let serviceStub: ProtectedFirebaseServiceStub;
  let fireDb: AngularFireDatabase;
  let fireAuth: AuthFirebaseServiceStub;

  beforeEach(() => {

    fireDb = {
      object: () => {
      },
      list: () => {
      }
    } as any;

    fireAuth = new AuthFirebaseServiceStub();
    fireAuth.logIn('some-user-uid');

    serviceStub = new ProtectedFirebaseServiceStub(fireDb, fireAuth);
  });

  describe('getObject', () => {
    it('should query firebase and return firebase object', () => {

      spyOn(fireDb, 'object').and.returnValue('firebase-object-stub');

      expect(serviceStub.getObject('some-object-key')).toBe('firebase-object-stub');

      expect(fireDb.object).toHaveBeenCalledWith('/private/some-user-uid/some-node-name/some-object-key');
    });
  });

  describe('getList', () => {
    it('should query firebase and return firebase list', () => {

      spyOn(fireDb, 'list').and.returnValue('firebase-list-stub');

      expect(serviceStub.getList()).toBe('firebase-list-stub');

      expect(fireDb.object).toHaveBeenCalledWith('/private/some-user-uid/some-node-name');
    });
  });

  describe('updateObject', () => {
    it('should update object in firebase and return observable', (done: DoneFn) => {

      const firebaseObjectMock = { update: null };
      spyOn(firebaseObjectMock, 'update').and.returnValue(Promise.resolve());
      spyOn(fireDb, 'object').and.returnValue(firebaseObjectMock);

      serviceStub.updateObject('some-object-key', 'some-data').subscribe(done);
      expect(fireDb.object).toHaveBeenCalledWith('/private/some-user-uid/some-node-name/some-object-key');
      expect(firebaseObjectMock.update).toHaveBeenCalledWith('some-data');

    });
  });

  describe('pushObject', () => {
    it('should push object in firebase list and return observable', (done: DoneFn) => {

      const firebaseListMock = { push: null };
      spyOn(firebaseListMock, 'push').and.returnValue(Promise.resolve());
      spyOn(fireDb, 'list').and.returnValue(firebaseListMock);

      serviceStub.pushObject('some-data').subscribe(done);
      expect(fireDb.list).toHaveBeenCalledWith('/private/some-user-uid/some-node-name');
      expect(firebaseListMock.push).toHaveBeenCalledWith('some-data');

    });
  });

  describe('removeObject', () => {
    it('should remove object from firebase list and return observable', (done: DoneFn) => {

      const firebaseListMock = { remove: null };
      spyOn(firebaseListMock, 'remove').and.returnValue(Promise.resolve());
      spyOn(fireDb, 'list').and.returnValue(firebaseListMock);

      serviceStub.removeObject('some-object-key').subscribe(done);
      expect(fireDb.list).toHaveBeenCalledWith('/private/some-user-uid/some-node-name');
      expect(firebaseListMock.remove).toHaveBeenCalledWith('some-object-key');

    });
  });
});
