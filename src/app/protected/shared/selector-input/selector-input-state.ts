import { SelectorListItem } from '../selector-list/selector-list-item';

export interface SelectorInputState<T> {
  query: string;
  isSearching: boolean;
  results: SelectorListItem<T>[];
  highlightedIndex: number;
  error: Error;
  selectedItem: SelectorListItem<T>;
}

export const selectorInputInitialState: SelectorInputState<any> = {
  query: '',
  isSearching: false,
  results: [],
  highlightedIndex: 0,
  error: null,
  selectedItem: null,
};
