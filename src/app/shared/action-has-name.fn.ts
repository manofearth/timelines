import { Action } from '@ngrx/store';

export function actionHasName(action: Action) {
  return action.payload && action.payload.name;
}
