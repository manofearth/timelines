import { actionHasName } from './action-has-name.fn';
import { Action } from '@ngrx/store';

export function actionNameIs(name: string) {
  return (action: Action) => actionHasName(action) && action.payload.name === name;
}
