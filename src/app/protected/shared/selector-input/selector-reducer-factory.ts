import { selectorInitialState, SelectorState } from './selector-state';
import {
  SearchFieldDownKeyAction,
  SearchFieldEnterKeyAction,
  SearchFieldEscKeyAction,
  SearchFieldInputAction,
  SearchFieldUpKeyAction
} from '../search-field/search-field-actions';
import { SelectorInitAction } from './selector-actions';
import { EventsSearchErrorAction, EventsSearchSuccessAction } from '../../events/effects/events-elastic-search.effect';
import { SelectorListSelectAction } from '../selector-list/selector-list-actions';
import { ActionReducer } from '@ngrx/store';

type SelectorAction = SearchFieldInputAction | SelectorInitAction | SearchFieldUpKeyAction | SearchFieldDownKeyAction
  | EventsSearchSuccessAction | EventsSearchErrorAction | SearchFieldEscKeyAction | SelectorListSelectAction
  | SearchFieldEnterKeyAction;

export function selectorReducerFactory(
  filter: (name: string) => boolean,
  postReducer: ActionReducer<SelectorState>,
): ActionReducer<SelectorState> {

  return (state: SelectorState, action: SelectorAction): SelectorState => {

    if (!action.payload || !action.payload.name || !filter(action.payload.name)) {
      return state;
    }

    let newState: SelectorState = state;

    switch (action.type) {

      case 'SELECTOR_INIT':
        newState = selectorInitialState;
        break;

      case 'SEARCH_FIELD_INPUT':
        newState = {
          ...state,
          query: action.payload.value,
          results: [],
          highlightedIndex: 0,
          isSearching: true,
          error: null,
        };
        break;

      case 'SEARCH_FIELD_DOWN_KEY':
        newState = setIndexWith(state, nextIndex);
        break;

      case 'SEARCH_FIELD_UP_KEY':
        newState = setIndexWith(state, prevIndex);
        break;

      case 'SEARCH_FIELD_ESC_KEY':
        newState = {
          ...state,
          results: [],
          highlightedIndex: 0,
          error: null,
        };
        break;

      case 'SELECTOR_LIST_SELECT':
        newState = {
          ...state,
          selectedItem: action.payload.item,
          results: [],
          query: '',
        };
        break;

      case 'SEARCH_FIELD_ENTER_KEY':
        newState = {
          ...state,
          selectedItem: state.results[state.highlightedIndex],
          results: [],
          query: '',
        };
        break;
    }

    return postReducer(newState, action);
  }
}

type nextIndexFn = (currentIndex: number, maxIndex: number) => number;

function setIndexWith(state: SelectorState, calculateNextIndex: nextIndexFn): SelectorState {
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
