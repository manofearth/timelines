import { Action } from '@ngrx/store';

export interface SelectorInitAction extends Action {
  type: 'SELECTOR_INIT';
  payload: {
    name: string;
  }
}
