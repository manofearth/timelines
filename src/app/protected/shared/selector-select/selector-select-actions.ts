import { Action } from '@ngrx/store';

interface SelectorSelectBaseAction extends Action {
  type: string;
  payload: {
    name: string;
  }
}

export interface SelectorSelectInitAction extends SelectorSelectBaseAction {
  type: 'SELECTOR_SELECT_INIT';
}

export interface SelectorSelectButtonAction extends SelectorSelectBaseAction {
  type: 'SELECTOR_SELECT_BUTTON';
}
