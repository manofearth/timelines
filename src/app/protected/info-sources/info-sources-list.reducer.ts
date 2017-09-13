import { ComponentInitAction } from '../../shared/component-init-action';
import { INFO_SOURCES_LIST_COMPONENT_NAME, INFO_SOURCES_LIST_SEARCH_FIELD_NAME } from './info-sources-list.component';
import { SearchFieldInputAction } from '../shared/search-field/search-field-actions';
import {
  InfoSourcesAlgoliaSearchErrorAction,
  InfoSourcesAlgoliaSearchSuccessAction
} from './effects/info-sources-algolia-search.effect';
import { AlgoliaInfoSource } from '../shared/algolia/algolia-search.service';
import { InfoSourceModalSaveButtonAction } from '../info-source/info-source-modal.component';
import { isNew } from '../shared/info-source/is-new.fn';
import { push, setToArr } from '../../shared/helpers';

export interface InfoSourcesListState {
  query: string;
  isSearching: boolean;
  isLoading: boolean;
  error: Error | null;
  list: InfoSourceForList[];
}

export interface InfoSourceForList {
  id: string;
  title: string;
}

export const infoSourcesListInitialState: InfoSourcesListState = {
  query: null,
  isSearching: true,
  isLoading: true,
  error: null,
  list: [],
};

type InfoSourcesListReducerAction = ComponentInitAction
  | SearchFieldInputAction
  | InfoSourcesAlgoliaSearchSuccessAction
  | InfoSourcesAlgoliaSearchErrorAction
  | InfoSourceModalSaveButtonAction
  ;

export function infoSourcesListReducer(
  state: InfoSourcesListState, action: InfoSourcesListReducerAction
): InfoSourcesListState {

  switch (action.type) {
    case 'COMPONENT_INIT':
      if (action.payload.name !== INFO_SOURCES_LIST_COMPONENT_NAME) {
        return state;
      }
      return {
        ...state,
        query: '',
      };
    case 'SEARCH_FIELD_INPUT':
      if (action.payload.name !== INFO_SOURCES_LIST_SEARCH_FIELD_NAME) {
        return state;
      }
      return {
        ...state,
        query: action.payload.value,
        isSearching: true,
      };
    case 'INFO_SOURCES_ALGOLIA_SEARCH_SUCCESS':
      return {
        ...state,
        error: null,
        isSearching: false,
        isLoading: false,
        list: action.payload.hits.map(toInfoSourcesForListFromAlgolia),
      };
    case 'INFO_SOURCES_ALGOLIA_SEARCH_ERROR':
      return {
        ...state,
        error: action.payload,
        isSearching: false,
        isLoading: false,
      };
    case 'INFO_SOURCE_MODAL_SAVE_BUTTON':
      if (isNew(action.payload.infoSource)) {
        return {
          ...state,
          list: push(state.list, action.payload.infoSource),
        }
      } else {
        const eventIndexToUpdate = state.list.findIndex(infoSource => infoSource.id === action.payload.infoSource.id);
        if (eventIndexToUpdate === -1) {
          return state;
        }
        return {
          ...state,
          list: setToArr(state.list, eventIndexToUpdate, action.payload.infoSource)
        }
      }
    default:
      return state;
  }
}

function toInfoSourcesForListFromAlgolia(hit: AlgoliaInfoSource): InfoSourceForList {
  return {
    id: hit.objectID,
    title: hit._highlightResult.title.value,
  }
}
