import { TimelineAction, TimelineChangedAction, TimelineGetSuccessAction } from './timeline-actions';
import { Timeline, TimelineState } from './timeline-states';
import { Action, ActionReducer, combineReducers } from '@ngrx/store';
import { Reducers } from '../../reducers';
import { selectorInputReducer } from '../shared/selector-input/selector-input-reducer';
import { TIMELINE_EVENTS_SELECTOR_NAME_PREFIX } from './events/timeline-events-table.component';
import { SelectorInputState } from '../shared/selector-input/selector-input-state';
import { EventsSearchErrorAction, EventsSearchSuccessAction } from '../events/effects/events-elastic-search.effect';
import { TimelineEventLight } from '../shared/timeline-event';
import { reduceWhen } from '../../shared/reduce-when.fn';
import { actionHasName } from '../../shared/action-has-name.fn';
import { composeReducers } from '../../shared/compose-reducers.fn';

const reducers: Reducers<TimelineState> = {
  isLoading: timelineIsLoadingReducer,
  isSaving: timelineIsSavingReducer,
  error: timelineErrorReducer,
  timeline: timelineReducer,
  currentGroupIndex: timelineCurrentGroupIndexReducer,
  eventsSelector: reduceWhen<SelectorInputState<TimelineEventLight>>(
    actionNameStartsWith(TIMELINE_EVENTS_SELECTOR_NAME_PREFIX),
    composeReducers(
      timelineEventsSelectorPostReducer,
      selectorInputReducer,
    )
  )
};

function actionNameStartsWith(namePrefix: string) {
  return (action: Action) => actionHasName(action) && action.payload.name.startsWith(namePrefix);
}

export const timelineStateReducer: ActionReducer<TimelineState> = combineReducers(reducers);

type EventsSelectorReducerAction = EventsSearchSuccessAction | EventsSearchErrorAction;

function timelineEventsSelectorPostReducer(
  state: SelectorInputState<TimelineEventLight>, action: EventsSelectorReducerAction
): SelectorInputState<TimelineEventLight> {

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

type TimelineReducerAction = TimelineGetSuccessAction | TimelineChangedAction;
function timelineReducer(state: Timeline, action: TimelineReducerAction): Timeline {
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
