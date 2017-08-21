import { Action } from '@ngrx/store';

export interface SearchFieldBaseAction extends Action {
  type: string;
  payload: {
    name: string;
  }
}

export interface SearchFieldInputAction extends SearchFieldBaseAction {
  type: 'SEARCH_FIELD_INPUT';
  payload: {
    name: string;
    value: string;
  }
}

export interface SearchFieldUpKeyAction extends SearchFieldBaseAction {
  type: 'SEARCH_FIELD_UP_KEY';
}

export interface SearchFieldDownKeyAction extends SearchFieldBaseAction {
  type: 'SEARCH_FIELD_DOWN_KEY';
}

export interface SearchFieldEnterKeyAction extends SearchFieldBaseAction {
  type: 'SEARCH_FIELD_ENTER_KEY';
  payload: {
    name: string;
    value: string;
  }
}

export interface SearchFieldCreateAction extends SearchFieldBaseAction {
  type: 'SEARCH_FIELD_CREATE';
  payload: {
    name: string;
    value: string;
  }
}

export interface SearchFieldEscKeyAction extends SearchFieldBaseAction {
  type: 'SEARCH_FIELD_ESC_KEY';
}
