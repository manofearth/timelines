import { Observable } from '../../shared/rxjs';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { AuthFirebaseService } from './auth-firebase.service';

export abstract class ProtectedFirebaseEffects<TActionType extends string, TAction extends Action> {

  constructor(private actions: Actions, protected auth: AuthFirebaseService) {
  }

  protected authorizedActionsOfType(...types: TActionType[]): Observable<TAction> {
    return this.actions
      .ofType(...types)
      .filter((action: TAction) => this.auth.isLoggedIn);
  }

}

export function toError(error: Error | string): Error {

  if (error instanceof Error) {
    return error;
  } else {
    return new Error(error);
  }
}
