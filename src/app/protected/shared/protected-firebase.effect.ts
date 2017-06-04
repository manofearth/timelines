import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from './auth-firebase.service';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

export abstract class ProtectedFirebaseEffect<TActionType extends string,
  TAction extends Action,
  TSuccessAction extends Action,
  TErrorActionType extends string,
  TErrorAction extends Action,
  TEffectResult> {

  @Effect() effect: Observable<TSuccessAction | TErrorAction> = this
    .authorizedActionsOfType(this.interestedActionType)
    .switchMap((action: TAction) =>
      this
        .runEffect(action)
        .map(this.mapToSuccessAction.bind(this))
        .catch(this.mapToErrorAction.bind(this))
    );

  constructor(private actions: Actions, protected auth: AuthFirebaseService) {
  }

  protected authorizedActionsOfType(...types: TActionType[]): Observable<TAction> {
    return this.actions
      .ofType(...types)
      .filter((action: TAction) => this.auth.isLoggedIn);
  }

  protected abstract runEffect(action: TAction): Observable<TEffectResult>;

  protected abstract mapToSuccessAction(effectResult: TEffectResult): TSuccessAction;

  protected abstract get interestedActionType(): TActionType;

  protected abstract get errorActionType(): TErrorActionType;

  protected mapToErrorAction(error: Error | string): Observable<TErrorAction> {
    return Observable.of<Action>({
      type: this.errorActionType,
      payload: toError(error),
    });
  }
}

function toError(error: Error | string): Error {

  if (error instanceof Error) {
    return error;
  } else {
    return new Error(error);
  }
}
