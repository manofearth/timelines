import { Action } from '@ngrx/store';
import { SelectorSearchResultItem } from '../selector-input/selector-search-result-item';

export interface SelectorListSelectAction extends Action {
  type: 'SELECTOR_LIST_SELECT';
  payload: {
    name: string;
    item: SelectorSearchResultItem;
  }
}
