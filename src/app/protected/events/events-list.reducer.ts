import {
  EventsAlgoliaSearchErrorAction,
  EventsAlgoliaSearchSuccessAction
} from './effects/events-algolia-search.effect';
import { AlgoliaEvent } from '../shared/algolia/algolia-search.service';
import { ComponentInitAction } from '../../shared/component-init-action';
import { EVENTS_LIST_COMPONENT_NAME, EVENTS_LIST_SEARCH_FIELD_NAME } from './events-list.component';
import { SearchFieldInputAction } from '../shared/search-field/search-field-actions';
import { EventSaveButtonAction } from '../event/event.component';
import { isNew } from '../shared/event/is-new.fn';
import { push, setToArr, setToObj } from '../../shared/helpers';
import { EventInsertSuccessAction } from '../event/effects/event-firebase-insert.effect';

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
  | SearchFieldInputAction
  | EventSaveButtonAction
  | EventInsertSuccessAction
  ;

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
        list: action.payload.hits.map(toEventForListFromAlgolia),
      };
    case 'EVENTS_ALGOLIA_SEARCH_ERROR':
      return {
        ...state,
        error: action.payload,
        isSearching: false,
        isLoading: false,
      };
    case 'EVENT_SAVE_BUTTON':
      if (isNew(action.payload.event)) {
        return {
          ...state,
          list: push(state.list, action.payload.event),
        }
      } else {
        const eventIndexToUpdate = state.list.findIndex(event => event.id === action.payload.event.id);
        if (eventIndexToUpdate === -1) {
          return state;
        }
        return {
          ...state,
          list: setToArr(state.list, eventIndexToUpdate, action.payload.event)
        }
      }
    case 'EVENT_INSERT_SUCCESS':
      const eventIndexToSetId = state.list.findIndex(isNew);
      if (eventIndexToSetId === -1) {
        return state;
      }
      return {
        ...state,
        list: setToArr(
          state.list,
          eventIndexToSetId,
          setToObj(state.list[eventIndexToSetId], 'id', action.payload.eventId)
        )
      };
    default:
      return state;
  }
}

function toEventForListFromAlgolia(hit: AlgoliaEvent): TimelineEventForList {
  return {
    id: hit.objectID,
    title: hit._highlightResult.title.value,
  }
}
