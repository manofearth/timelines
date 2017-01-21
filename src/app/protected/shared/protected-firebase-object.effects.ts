import { Action } from '@ngrx/store';
import { ProtectedFirebaseEffects } from './protected-firebase.effects';
import { FirebaseObjectObservable } from 'angularfire2';

export class ProtectedFirebaseObjectEffects<TActionType extends string, TAction extends Action, TObject>
extends ProtectedFirebaseEffects<TActionType, TAction> {

  private firebaseObject: FirebaseObjectObservable<TObject> = null;
  private firebaseObjectKey: string = null;

  protected onAuthChanged(): void {
    this.firebaseObject = null;
    this.firebaseObjectKey = null;
  }

  protected getFirebaseObject(key: string): FirebaseObjectObservable<TObject> {
    if (this.firebaseObjectKey !== key) {
      this.firebaseObject = this.fire.database.object('/private/' + this.auth.uid + '/timelines/' + key);
      this.firebaseObjectKey = key;
    }
    return this.firebaseObject;
  }
}