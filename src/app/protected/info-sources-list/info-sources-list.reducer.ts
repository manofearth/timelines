import { ComponentInitAction } from '../../shared/component-init-action';
import { INFO_SOURCES_LIST_COMPONENT_NAME, INFO_SOURCES_LIST_SEARCH_FIELD_NAME } from './info-sources-list.component';
import { SearchFieldInputAction } from '../shared/search-field/search-field-actions';
import {
  InfoSourcesAlgoliaSearchErrorAction,
  InfoSourcesAlgoliaSearchSuccessAction
} from './effects/info-sources-algolia-search.effect';
import { AlgoliaInfoSource } from '../shared/algolia/algolia-search.service';

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
