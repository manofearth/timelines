import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

export interface SearchFieldService {
  queryListener: Observer<string>;
  searchFieldActionsListener: Observer<SearchFieldAction>;
  isSearching$: Observable<boolean>;
  results$: Observable<any[]>;
}

export interface SearchFieldEnterKeyAction {
  type: 'enter';
  payload: string;
}

export interface SearchFieldCreateButtonAction {
  type: 'create';
  payload: string;
}

export type SearchFieldAction = 'up' | 'down' | SearchFieldEnterKeyAction | SearchFieldCreateButtonAction;
