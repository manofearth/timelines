import { EventsSearchErrorAction, EventsSearchSuccessAction } from '../../events/effects/events-elastic-search.effect';
import { SelectorInputState } from '../../shared/selector-input/selector-input-state';
import { TimelineEventLight } from '../../shared/event/timeline-event';
import { reduceWhen } from '../../../shared/reduce-when.fn';
import { TIMELINE_EVENTS_SELECTOR_NAME_PREFIX } from '../events/timeline-events-table.component';
import { composeReducers } from '../../../shared/compose-reducers.fn';
import { selectorInputReducer } from '../../shared/selector-input/selector-input-reducer';
import { actionHasName } from '../../../shared/action-has-name.fn';
import { Action } from '@ngrx/store';

export const timelineEventsSelectorReducer = reduceWhen<SelectorInputState<TimelineEventLight>>(
  actionNameStartsWith(TIMELINE_EVENTS_SELECTOR_NAME_PREFIX),
  composeReducers(
    timelineEventsSelectorPostReducer,
    selectorInputReducer,
  )
);

function actionNameStartsWith(namePrefix: string) {
  return (action: Action) => actionHasName(action) && action.payload.name.startsWith(namePrefix);
}

type EventsSelectorPostReducerAction = EventsSearchSuccessAction | EventsSearchErrorAction;

function timelineEventsSelectorPostReducer(
  state: SelectorInputState<TimelineEventLight>, action: EventsSelectorPostReducerAction
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
