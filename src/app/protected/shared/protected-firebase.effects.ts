import { Observable } from '../../shared/rxjs';
import { FirebaseAuthState, AngularFire } from 'angularfire2';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

export abstract class ProtectedFirebaseEffects<TActionType extends string, TAction extends Action> {

  protected auth: FirebaseAuthState = null;

  constructor(private actions: Actions, protected fire: AngularFire) {
    this.fire.auth.subscribe((auth: FirebaseAuthState) => {
      this.auth = auth;
      this.onAuthChanged();
    });
  }

  protected authorizedActionsOfType(...types: TActionType[]): Observable<TAction> {
    return this.actions
      .ofType(...types)
      .filter((action: TAction) => this.auth !== null);
  }

  protected abstract onAuthChanged(): void;
}