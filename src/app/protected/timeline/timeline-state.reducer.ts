import { TimelineAction } from './timeline-actions';
import { Timeline, TimelineState } from './timeline-states';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { Reducers } from '../../reducers';
import { selectorInputReducerFactory } from '../shared/selector-input/selector-input-reducer-factory';
import { TIMELINE_EVENTS_SELECTOR_NAME_PREFIX } from './events/timeline-events-table.component';
import { SelectorInputState } from '../shared/selector-input/selector-input-state';
import { EventsSearchErrorAction, EventsSearchSuccessAction } from '../events/effects/events-elastic-search.effect';
import { TimelineEventForList } from '../shared/timeline-event';

const reducers: Reducers<TimelineState> = {
  isLoading: timelineIsLoadingReducer,
  isSaving: timelineIsSavingReducer,
  error: timelineErrorReducer,
  timeline: timelineReducer,
  currentGroupIndex: timelineCurrentGroupIndexReducer,
  eventsSelector: selectorInputReducerFactory(
    name => name.startsWith(TIMELINE_EVENTS_SELECTOR_NAME_PREFIX),
    timelineEventsSelectorPostReducer
  ),
};

export const timelineStateReducer: ActionReducer<TimelineState> = combineReducers(reducers);

type EventsSelectorReducerAction = EventsSearchSuccessAction | EventsSearchErrorAction;

function timelineEventsSelectorPostReducer(
  state: SelectorInputState<TimelineEventForList>, action: EventsSelectorReducerAction
): SelectorInputState<TimelineEventForList> {

  switch (action.type) {

    case 'EVENTS_SEARCH_SUCCESS':
      const results = action.payload.result.hits.hits.map(hit => ({
        title: hit._source.title,
        titleHighlighted: hit.highlight.title[0],
        item: {
          id: hit._id,
          title: hit._source.title,
        }
      }));

      return {
        ...state,
        results: results,
        highlightedIndex: 0,
        isSearching: false,
      };

    case 'EVENTS_SEARCH_ERROR':
      return {
        ...state,
        isSearching: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
}

function timelineIsLoadingReducer(state: boolean, action: TimelineAction): boolean {
  switch (action.type) {
    case 'TIMELINE_GET_SUCCESS':
    case 'TIMELINE_GET_ERROR':
      return false;
    default:
      return state;
  }
}

function timelineIsSavingReducer(state: boolean, action: TimelineAction): boolean {
  switch (action.type) {
    case 'TIMELINE_SAVE_SUCCESS':
    case 'TIMELINE_SAVE_ERROR':
      return false;
    case 'TIMELINE_CHANGED':
      return true;
    default:
      return state;
  }
}

function timelineErrorReducer(state: Error, action: TimelineAction): Error {
  switch (action.type) {
    case 'TIMELINE_GET_SUCCESS':
    case 'TIMELINE_SAVE_SUCCESS':
      return null;
    case 'TIMELINE_GET_ERROR':
    case 'TIMELINE_SAVE_ERROR':
      return action.payload;
    default:
      return state;
  }
}

function timelineReducer(state: Timeline, action: TimelineAction): Timeline {
  switch (action.type) {
    case 'TIMELINE_GET_SUCCESS':
      return action.payload;
    case 'TIMELINE_CHANGED':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

function timelineCurrentGroupIndexReducer(state: number, action: TimelineAction): number {
  switch (action.type) {
    case 'TIMELINE_CHANGE_CURRENT_GROUP':
      return action.payload;
    default:
      return state;
  }
}
