import { Action } from '@ngrx/store';

export interface SelectorInputInitAction extends Action {
  type: 'SELECTOR_INPUT_INIT';
  payload: {
    name: string;
  }
}
