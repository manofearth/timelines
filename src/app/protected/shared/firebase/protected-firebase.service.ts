import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { AuthFirebaseService } from './auth-firebase.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export abstract class ProtectedFirebaseService<TObject, TUpdateObject> {

  constructor(
    protected database: AngularFireDatabase,
    protected auth: AuthFirebaseService,
  ) {
  }

  getObject(key: string): FirebaseObjectObservable<TObject> {
    return this.database.object(this.getFirebaseObjectPath(key));
  }

  getList(): FirebaseListObservable<TObject[]> {
    return this.database.list(this.getFirebaseNodePath());
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
