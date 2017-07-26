import { selectorInitialState, SelectorsState, SelectorState } from './selector-state';
import {
  SearchFieldDownKeyAction, SearchFieldEnterKeyAction,
  SearchFieldEscKeyAction,
  SearchFieldInputAction,
  SearchFieldUpKeyAction
} from '../search-field/search-field-actions';
import { SelectorInitAction } from './selector-actions';
import { EventsSearchErrorAction, EventsSearchSuccessAction } from '../../events/effects/events-elastic-search.effect';
import { SelectorListSelectAction } from '../selector-list/selector-list-actions';

type SelectorAction = SearchFieldInputAction | SelectorInitAction | SearchFieldUpKeyAction | SearchFieldDownKeyAction
  | EventsSearchSuccessAction | EventsSearchErrorAction | SearchFieldEscKeyAction | SelectorListSelectAction
  | SearchFieldEnterKeyAction;

export function selectorsReducer(state: SelectorsState, action: SelectorAction): SelectorsState {

  switch (action.type) {

    case 'SELECTOR_INIT':
      return updateSelectorState(state, action.payload.name, selectorInitialState);

    case 'SEARCH_FIELD_INPUT':
      return updateSelectorState(state, action.payload.name, {
        query: action.payload.value,
        results: [],
        highlightedIndex: 0,
        isSearching: true,
        error: null,
      });

    case 'SEARCH_FIELD_DOWN_KEY':
      return setIndexWith(state, action.payload.name, nextIndex);

    case 'SEARCH_FIELD_UP_KEY':
      return setIndexWith(state, action.payload.name, prevIndex);

    case 'SEARCH_FIELD_ESC_KEY':
      return updateSelectorState(state, action.payload.name, {
        results: [],
        highlightedIndex: 0,
        error: null,
      });

    case 'EVENTS_SEARCH_SUCCESS':
      const results = action.payload.result.hits.hits.map(hit => ({
        title: hit.highlight.title[0],
        item: {
          id: hit._id,
          title: hit._source.title,
        }
      }));

      return updateSelectorState(state, action.payload.name, {
        results: results,
        highlightedIndex: 0,
        isSearching: false,
      });

    case 'EVENTS_SEARCH_ERROR':
      return updateSelectorState(state, action.payload.name, {
        isSearching: false,
        error: action.payload.error,
      });

    case 'SELECTOR_LIST_SELECT':
      return updateSelectorState(state, action.payload.name, {
        selectedItem: action.payload.item,
      });

    case 'SEARCH_FIELD_ENTER_KEY':
      return updateSelectorState(state, action.payload.name, {
        selectedItem: state[action.payload.name].results[state[action.payload.name].highlightedIndex],
      });

    default:
      return state;
  }
}

function setIndexWith(state, name, calculateNextIndex) {
  const selectorState = state[name];
  const nextIndex = calculateNextIndex(selectorState.highlightedIndex, selectorState.results.length - 1);

  if (nextIndex === selectorState.highlightedIndex) {
    return state;
  }

  return updateSelectorState(state, name, { highlightedIndex: nextIndex });
}

function nextIndex(currentIndex: number, maxIndex: number) {

  if (maxIndex <= 0) {
    return 0;
  }

  if (currentIndex >= maxIndex) {
    return 0;
  } else {
    return currentIndex + 1;
  }
}

function prevIndex(currentIndex: number, maxIndex: number) {

  if (maxIndex <= 0) {
    return 0;
  }

  if (currentIndex <= 0) {
    return maxIndex;
  } else {
    return currentIndex - 1;
  }
}

function updateSelectorState(state: SelectorsState, name: string, partOfSelectorState: Partial<SelectorState>): SelectorsState {
  return {
    ...state,
    [name]: {
      ...state[name],
      ...partOfSelectorState,
    }
  };
}
