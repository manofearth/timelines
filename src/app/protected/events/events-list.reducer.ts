import {
  EventsAlgoliaSearchErrorAction,
  EventsAlgoliaSearchSuccessAction
} from './effects/events-algolia-search.effect';
import { AlgoliaEvent } from '../shared/algolia/algolia-search.service';
import { ComponentInitAction } from '../../shared/component-init-action';
import { EVENTS_LIST_COMPONENT_NAME, EVENTS_LIST_SEARCH_FIELD_NAME } from './events-list.component';
import { SearchFieldInputAction } from '../shared/search-field/search-field-actions';

export interface EventsListState {
  query: string;
  isSearching: boolean;
  isLoading: boolean;
  error: Error | null;
  list: TimelineEventForList[];
}

export interface TimelineEventForList {
  id: string;
  title: string;
}

export const eventsListInitialState: EventsListState = {
  query: null,
  isSearching: false,
  isLoading: false,
  error: null,
  list: [],
};

type EventsListReducerAction = EventsAlgoliaSearchSuccessAction
  | EventsAlgoliaSearchErrorAction
  | ComponentInitAction
  | SearchFieldInputAction;

export function eventsListReducer(state: EventsListState, action: EventsListReducerAction): EventsListState {
  switch (action.type) {
    case 'COMPONENT_INIT':
      if (action.payload.name !== EVENTS_LIST_COMPONENT_NAME) {
        return state;
      }
      return {
        ...state,
        query: '',
        isLoading: true,
        isSearching: true,
      };
    case 'SEARCH_FIELD_INPUT':
      if (action.payload.name !== EVENTS_LIST_SEARCH_FIELD_NAME) {
        return state;
      }
      return {
        ...state,
        query: action.payload.value,
        isSearching: true,
      };
    case 'EVENTS_ALGOLIA_SEARCH_SUCCESS':
      return {
        ...state,
        error: null,
        isSearching: false,
        isLoading: false,
        list: action.payload.hits.map(toEventForList),
      };
    case 'EVENTS_ALGOLIA_SEARCH_ERROR':
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

function toEventForList(hit: AlgoliaEvent): TimelineEventForList {
  return {
    id: hit.objectId,
    title: hit._highlightResult.title.value,
  }
}
