import { eventInitialState, EventState, EventStatus } from './event-states';
import { EventAction } from './event-actions';
import { Reducers } from '../../reducers';
import { Action, ActionReducer, combineReducers } from '@ngrx/store';
import { TimelineEvent } from '../shared/timeline-event';
import { EVENT_TYPE_SELECTOR_NAME } from './event.component';
import { SearchFieldInputAction } from '../shared/search-field/search-field-actions';
import { TypesSearchErrorAction, TypesSearchSuccessAction } from '../types/effects/elastic-types-search.effect';
import { SelectorListItem } from '../shared/selector-list/selector-list-item';
import { TimelineEventsTypeForList } from '../types/types-states';
import { SelectorSelectState } from '../shared/selector-select/selector-select-state';
import { SelectorSelectButtonAction, } from '../shared/selector-select/selector-select-actions';
import { reduceWhen } from '../../shared/reduce-when.fn';
import { actionHasName } from '../../shared/action-has-name.fn';
import { selectorSelectReducer } from '../shared/selector-select/selector-select-reducer';
import { selectorInputReducer } from '../shared/selector-input/selector-input-reducer';
import { composeReducers } from '../../shared/compose-reducers.fn';

const reducers: Reducers<EventState> = {
  status: eventStatusReducer,
  error: eventErrorReducer,
  event: eventReducer,
  typeSelector: reduceWhen(
    actionNameIs(EVENT_TYPE_SELECTOR_NAME),
    composeReducers(
      eventTypeSelectorPostReducer,
      selectorSelectReducer,
      selectorInputReducer,
    )
  ),
};

function actionNameIs(name: string) {
  return (action: Action) => actionHasName(action) && action.payload.name === name;
}

export const eventStateReducer: ActionReducer<EventState> = combineReducers(reducers);

function eventStatusReducer(state: EventStatus, action: EventAction): EventStatus {
  switch (action.type) {
    case 'EVENT_GET':
      return 'LOADING';
    case 'EVENT_GET_SUCCESS':
      return 'LOADED';
    case 'EVENT_GET_ERROR':
    case 'EVENT_UPDATE_ERROR':
    case 'EVENT_INSERT_ERROR':
      return 'ERROR';
    case 'EVENT_CREATE':
      return 'NEW';
    case 'EVENT_UPDATE':
      return 'UPDATING';
    case 'EVENT_INSERT':
    case 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE':
      return 'INSERTING';
    case 'EVENT_UPDATE_SUCCESS':
      return 'UPDATED';
    case 'EVENT_INSERT_SUCCESS':
      return 'INSERTED';
    case 'EVENT_ERASE':
      return eventInitialState.status;
    default:
      return state;
  }
}

function eventErrorReducer(state: Error, action: EventAction): Error {
  switch (action.type) {
    case 'EVENT_GET_ERROR':
    case 'EVENT_UPDATE_ERROR':
    case 'EVENT_INSERT_ERROR':
      return action.payload;
    case 'EVENT_GET_SUCCESS':
    case 'EVENT_UPDATE_SUCCESS':
    case 'EVENT_INSERT_SUCCESS':
      return null;
    case 'EVENT_ERASE':
      return eventInitialState.error;
    default:
      return state;
  }
}

function eventReducer(state: TimelineEvent, action: EventAction): TimelineEvent {
  switch (action.type) {
    case 'EVENT_GET_SUCCESS':
    case 'EVENT_UPDATE':
    case 'EVENT_INSERT':
      return action.payload;
    case 'EVENT_ERASE':
      return eventInitialState.event;
    case 'EVENT_CREATE':
      return {
        id: null,
        title: action.payload,
        dateBegin: null,
        dateEnd: null,
      };
    case 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE':
      return action.payload.event;
    case 'EVENT_INSERT_SUCCESS':
      return { ...state, id: action.payload };
    default:
      return state;
  }
}

type EventTypeSelectorReducerAction = SearchFieldInputAction | TypesSearchSuccessAction | TypesSearchErrorAction
  | SelectorSelectButtonAction;

function eventTypeSelectorPostReducer(
  state: SelectorSelectState<TimelineEventsTypeForList>,
  action: EventTypeSelectorReducerAction
): SelectorSelectState<TimelineEventsTypeForList> {

  switch (action.type) {
    case 'SELECTOR_SELECT_BUTTON':
    case 'SEARCH_FIELD_INPUT':
      return {
        ...state,
        isSearching: true,
      };
    case 'TYPES_SEARCH_SUCCESS':
      return {
        ...state,
        isSearching: false,
        results: action.payload.hits.map(
          (hit): SelectorListItem<TimelineEventsTypeForList> => ({
            title: hit._source.title,
            titleHighlighted: hit.highlight ? hit.highlight.title[0] : hit._source.title,
            item: {
              id: hit._id,
              title: hit._source.title,
            },
          })
        ),
      };
    case 'TYPES_SEARCH_ERROR':
      return {
        ...state,
        isSearching: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
}
