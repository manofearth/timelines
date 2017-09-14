import { SelectorListItem } from '../selector-list/selector-list-item';

export interface SearchableListState<T> {
  query: string;
  isSearching: boolean;
  results: SelectorListItem<T>[];
  highlightedIndex: number;
  error: Error;
}

export function searchableListReducer(state: SearchableListState<any>, action: any): SearchableListState<any> {
  switch (action.type) {

    case 'SEARCH_FIELD_INPUT':
      return {
        ...state,
        query: action.payload.value,
        isSearching: true,
        results: [],
        highlightedIndex: 0,
        error: null,
      };

    case 'SEARCH_FIELD_DOWN_KEY':
      return setIndexWith(state, nextIndex);

    case 'SEARCH_FIELD_UP_KEY':
      return setIndexWith(state, prevIndex);

    case 'SEARCH_FIELD_ESC_KEY':
    case 'SELECTOR_INPUT_BLUR':
      return {
        ...state,
        results: [],
        query: '',
        highlightedIndex: 0,
        error: null,
      };

    case 'SEARCH_FIELD_ENTER_KEY':

      if (state.isSearching) {
        return state;
      } else {
        return {
          ...state,
          results: [],
          query: '',
          highlightedIndex: 0,
          error: null,
        };
      }

    default:
      return state;
  }
}

type nextIndexFn = (currentIndex: number, maxIndex: number) => number;

function setIndexWith(state: SearchableListState<any>, calculateNextIndex: nextIndexFn): SearchableListState<any> {
  const nextIndex = calculateNextIndex(state.highlightedIndex, state.results.length - 1);

  if (nextIndex === state.highlightedIndex) {
    return state;
  }

  return { ...state, highlightedIndex: nextIndex };
}

function nextIndex(currentIndex: number, maxIndex: number): number {

  if (maxIndex <= 0) {
    return 0;
  }

  if (currentIndex >= maxIndex) {
    return 0;
  } else {
    return currentIndex + 1;
  }
}

function prevIndex(currentIndex: number, maxIndex: number): number {

  if (maxIndex <= 0) {
    return 0;
  }

  if (currentIndex <= 0) {
    return maxIndex;
  } else {
    return currentIndex - 1;
  }
}
