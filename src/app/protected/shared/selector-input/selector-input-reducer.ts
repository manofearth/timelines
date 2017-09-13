import { selectorInputInitialState, SelectorInputState } from './selector-input-state';
import {
  SearchFieldDownKeyAction,
  SearchFieldEnterKeyAction,
  SearchFieldEscKeyAction,
  SearchFieldInputAction,
  SearchFieldUpKeyAction
} from '../search-field/search-field-actions';
import { SelectorInputInitAction } from './selector-input-actions';
import { SelectorListSelectAction } from '../selector-list/selector-list-actions';
import { SelectorInputBlurAction } from './selector-input-blur.effect';

type SelectorAction =
  SearchFieldInputAction
  | SelectorInputInitAction
  | SearchFieldUpKeyAction
  | SearchFieldDownKeyAction
  | SearchFieldEscKeyAction
  | SelectorListSelectAction
  | SearchFieldEnterKeyAction
  | SelectorInputBlurAction;

export function selectorInputReducer(state: SelectorInputState<any>, action: SelectorAction): SelectorInputState<any> {

  switch (action.type) {

    case 'SELECTOR_INPUT_INIT':
      return selectorInputInitialState;

    case 'SEARCH_FIELD_INPUT':
      return {
        ...state,
        query: action.payload.value,
        results: [],
        highlightedIndex: 0,
        isSearching: true,
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
        highlightedIndex: 0,
        error: null,
      };

    case 'SELECTOR_LIST_SELECT':
      return {
        ...state,
        selectedItem: action.payload.item,
        results: [],
        query: '',
      };

    case 'SEARCH_FIELD_ENTER_KEY':

      if (state.isSearching) {
        return state;
      } else {
        return {
          ...state,
          selectedItem: state.results[ state.highlightedIndex ],
          results: [],
          query: '',
        };
      }

    default:
      return state;
  }
}

type nextIndexFn = (currentIndex: number, maxIndex: number) => number;

function setIndexWith(state: SelectorInputState<any>, calculateNextIndex: nextIndexFn): SelectorInputState<any> {
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
