import { Action } from '@ngrx/store';

export interface SelectorChangedAction extends Action {
  payload: string; // user input
}
