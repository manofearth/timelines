import { SelectorSearchResultItem } from './selector-search-result-item';

export interface SelectorState {
  query: string;
  isSearching: boolean;
  results: SelectorSearchResultItem[];
  highlightedIndex: number;
  error: Error;
  selectedItem: SelectorSearchResultItem;
}

export const selectorInitialState: SelectorState = {
  query: '',
  isSearching: false,
  results: [],
  highlightedIndex: 0,
  error: null,
  selectedItem: null,
};
