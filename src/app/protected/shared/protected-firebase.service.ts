import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { AuthFirebaseService } from './auth-firebase.service';

@Injectable()
export abstract class ProtectedFirebaseService<TObject> {

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
