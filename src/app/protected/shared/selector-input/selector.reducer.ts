import { selectorInitialState, SelectorsState } from './selector-state';
import {
  SearchFieldDownKeyAction,
  SearchFieldInputAction,
  SearchFieldUpKeyAction
} from '../search-field/search-field-actions';
import { SelectorInitAction } from './selector-actions';
import { EventsSearchSuccessAction } from '../../events/events-actions';

type SelectorAction = SearchFieldInputAction | SelectorInitAction | SearchFieldUpKeyAction | SearchFieldDownKeyAction
  | EventsSearchSuccessAction;

export function selectorsReducer(state: SelectorsState, action: SelectorAction): SelectorsState {

  switch (action.type) {

    case 'SELECTOR_INIT':
      return {
        ...state,
        [action.payload.name]: selectorInitialState
      };

    case 'SEARCH_FIELD_INPUT':
      return {
        ...state,
        [action.payload.name]: {
          query: action.payload.value,
          results: [],
          highlightedIndex: 0,
          isSearching: true,
        }
      };

    case 'SEARCH_FIELD_DOWN_KEY':
      return setIndexWith(state, action, nextIndex);

    case 'SEARCH_FIELD_UP_KEY':
      return setIndexWith(state, action, prevIndex);

    case 'EVENTS_SEARCH_SUCCESS':
      const results = action.payload.results.hits.hits.map(hit => ({
        title: hit.highlight.title[0],
        item: {
          id: hit._id,
          title: hit._source.title,
        }
      }));

      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          results: results,
          highlightedIndex: 0,
          isSearching: false,
        }
      };

    default:
      return state;
  }
}

function setIndexWith(state, action, calculateNextIndex) {
  const selectorState = state[action.payload.name];
  const nextIndex = calculateNextIndex(selectorState.highlightedIndex, selectorState.results.length - 1);

  if (nextIndex === selectorState.highlightedIndex) {
    return state;
  }

  return {
    ...state,
    [action.payload.name]: {
      ...selectorState,
      highlightedIndex: nextIndex,
    }
  };
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
