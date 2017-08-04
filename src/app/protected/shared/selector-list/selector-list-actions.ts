import { Action } from '@ngrx/store';
import { SelectorListItem } from './selector-list-item';

export interface SelectorListSelectAction extends Action {
  type: 'SELECTOR_LIST_SELECT';
  payload: {
    name: string;
    item: SelectorListItem<any>;
  }
}
