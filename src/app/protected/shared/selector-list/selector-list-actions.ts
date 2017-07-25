import { Action } from '@ngrx/store';
export interface SelectorListSelectAction extends Action {
  type: 'SELECTOR_LIST_SELECT';
  payload: {
    name: string;
    item: any;
  }
}
