import { Observable } from '../../shared/rxjs';
import { FirebaseAuthState, AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

export abstract class ProtectedFirebaseEffects<TActionType extends string, TAction extends Action, TObject> {

  private auth: FirebaseAuthState = null;
  private firebaseObject: FirebaseObjectObservable<TObject> = null;
  private firebaseObjectKey: string = null;
  private firebaseList: FirebaseListObservable<TObject[]> = null;

  constructor(private actions: Actions, protected fire: AngularFire) {
    this.fire.auth.subscribe((auth: FirebaseAuthState) => {
      this.auth = auth;
      this.firebaseObject = null;
      this.firebaseObjectKey = null;
      this.firebaseList = null;
    });
  }

  protected authorizedActionsOfType(...types: TActionType[]): Observable<TAction> {
    return this.actions
      .ofType(...types)
      .filter((action: TAction) => this.auth !== null);
  }

  protected getFirebaseObject(key: string): FirebaseObjectObservable<TObject> {
    if (this.firebaseObjectKey !== key) {
      this.firebaseObject = this.fire.database.object(this.getFirebaseNodePath() + '/' + key);
      this.firebaseObjectKey = key;
    }
    return this.firebaseObject;
  }

  protected getFirebaseList(): FirebaseListObservable<TObject[]> {
    if (!this.firebaseList) {
      this.firebaseList = this.fire.database.list(this.getFirebaseNodePath());
    }
    return this.firebaseList;
  }

  protected abstract getFirebaseNodeName(): string

  private getFirebaseNodePath(): string {
    return '/private/' + this.auth.uid + '/' + this.getFirebaseNodeName();
  }

}

export function toError(error: Error|string): Error {

  if (error instanceof Error) {
    return error;
  } else {
    return new Error(error);
  }
}
