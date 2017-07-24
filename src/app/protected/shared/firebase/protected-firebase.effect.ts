import { Actions } from '@ngrx/effects';
import { AuthFirebaseService } from './auth-firebase.service';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

export abstract class ProtectedFirebaseEffect<TIncomingAction extends Action,
  TSuccessAction extends Action,
  TErrorAction extends Action,
  TEffectResult> {

  constructor(private actions: Actions, protected auth: AuthFirebaseService) {
  }

  /**
   * Every child effect should expose @Effect and init it by this method, because @ngrx/effects module
   * does not support @Effect in parent class: https://github.com/ngrx/effects/issues/156
   */
  protected createEffect(): Observable<TSuccessAction | TErrorAction> {
    return this
      .getActions()
      .switchMap((action: TIncomingAction) =>
        this
          .runEffect(action)
          .map(this.mapToSuccessAction.bind(this))
          .catch(this.mapToErrorAction.bind(this))
      );
  }

  protected authorizedActionsOfType(...types: TIncomingAction['type'][]): Observable<TIncomingAction> {
    return this.actions
      .ofType(...types)
      .filter((action: TIncomingAction) => this.auth.isLoggedIn);
  }

  private getActions(): Observable<TIncomingAction> {
    return this.modifyActionsObservable(
      this.authorizedActionsOfType(this.getInterestedActionType())
    );
  }

  protected modifyActionsObservable(actions: Observable<TIncomingAction>): Observable<TIncomingAction> {
    return actions;
  }

  protected abstract runEffect(action: TIncomingAction): Observable<TEffectResult>;

  protected abstract mapToSuccessAction(effectResult: TEffectResult): TSuccessAction;

  protected abstract getInterestedActionType(): TIncomingAction['type'];

  protected abstract getErrorActionType(): TErrorAction['type'];

  protected mapToErrorAction(error: Error | string): Observable<TErrorAction> {
    return Observable.of<Action>({
      type: this.getErrorActionType(),
      payload: toError(error),
    });
  }
}

export function toError(error: Error | string): Error {

  if (error instanceof Error) {
    return error;
  } else {
    return new Error(error);
  }
}
