import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { AuthFirebaseService } from './auth-firebase.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export abstract class ProtectedFirebaseService<TObject, TUpdateObject> {

  private firebaseObject: FirebaseObjectObservable<TObject> = null;
  private firebaseObjectKey: string                         = null;
  private firebaseList: FirebaseListObservable<TObject[]>   = null;

  constructor(protected database: AngularFireDatabase, protected auth: AuthFirebaseService) {
    this.auth.auth$.subscribe(() => {
      this.firebaseObject    = null;
      this.firebaseObjectKey = null;
      this.firebaseList      = null;
    });
  }

  getObject(key: string): FirebaseObjectObservable<TObject> {
    if (this.firebaseObjectKey !== key) {
      this.firebaseObject    = this.database.object(this.getFirebaseObjectPath(key));
      this.firebaseObjectKey = key;
    }
    return this.firebaseObject;
  }

  getList(): FirebaseListObservable<TObject[]> {
    if (!this.firebaseList) {
      this.firebaseList = this.database.list(this.getFirebaseNodePath());
    }
    return this.firebaseList;
  }

  updateObject(key: string, data: TUpdateObject): Observable<void> {
    return Observable.fromPromise(
      this.getObject(key).update(data) as Promise<void>
    );
  }

  pushObject(data: TUpdateObject): Observable<firebase.database.Reference> {
    return Observable.fromPromise(
      this.getList().push(data) as any
    );
  }

  removeObject(key: string): Observable<void> {
    return Observable.fromPromise(
      this.getList().remove(key) as Promise<void>
    );
  }

  protected abstract getFirebaseNodeName(): string

  protected getFirebaseUserPath(): string {
    return '/private/' + this.auth.uid;
  }

  protected getFirebaseObjectPath(key: string): string {
    return this.getFirebaseNodePath() + '/' + key;
  }

  private getFirebaseNodePath(): string {
    return this.getFirebaseUserPath() + '/' + this.getFirebaseNodeName();
  }

}
