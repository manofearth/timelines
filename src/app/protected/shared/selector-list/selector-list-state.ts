import { SelectorListItem } from './selector-list-item';

export interface SelectorListState<T> {
  results: SelectorListItem<T>[];
  highlightedIndex: number;
}
