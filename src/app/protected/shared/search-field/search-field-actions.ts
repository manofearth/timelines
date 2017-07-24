import { Action } from '@ngrx/store';

export interface SearchFieldInputAction extends Action {
  type: 'SEARCH_FIELD_INPUT';
  payload: {
    name: string;
    value: string;
  }
}

export interface SearchFieldUpKeyAction extends Action {
  type: 'SEARCH_FIELD_UP_KEY';
  payload: {
    name: string;
  }
}

export interface SearchFieldDownKeyAction extends Action {
  type: 'SEARCH_FIELD_DOWN_KEY';
  payload: {
    name: string;
  }
}

export interface SearchFieldEnterKeyAction extends Action {
  type: 'SEARCH_FIELD_ENTER_KEY';
  payload: {
    name: string;
    value: string;
  };
}

export interface SearchFieldCreateButtonAction extends Action {
  type: 'SEARCH_FIELD_CREATE_BUTTON';
  payload: {
    name: string;
    value: string;
  };
}

export interface SearchFieldEscKeyAction extends Action {
  type: 'SEARCH_FIELD_ESC_KEY';
  payload: {
    name: string;
  };
}
