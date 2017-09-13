import { SelectorInputState } from '../../shared/selector-input/selector-input-state';
import { TimelineEventLight } from '../../shared/event/timeline-event';
import { reduceWhen } from '../../../shared/reduce-when.fn';
import { TIMELINE_EVENTS_SELECTOR_NAME_PREFIX } from '../events/timeline-events-table.component';
import { composeReducers } from '../../../shared/compose-reducers.fn';
import { selectorInputReducer } from '../../shared/selector-input/selector-input-reducer';
import { actionHasName } from '../../../shared/action-has-name.fn';
import { Action } from '@ngrx/store';
import {
  EventsAlgoliaSearchErrorAction,
  EventsAlgoliaSearchSuccessAction
} from '../../events/effects/events-algolia-search.effect';

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

type EventsSelectorPostReducerAction = EventsAlgoliaSearchSuccessAction | EventsAlgoliaSearchErrorAction;

function timelineEventsSelectorPostReducer(
  state: SelectorInputState<TimelineEventLight>, action: EventsSelectorPostReducerAction
): SelectorInputState<TimelineEventLight> {

  switch (action.type) {

    case 'EVENTS_ALGOLIA_SEARCH_SUCCESS':
      const results = action.payload.hits.map(hit => ({
        title: hit.title,
        titleHighlighted: hit._highlightResult.title.value,
        item: {
          id: hit.objectID,
          title: hit.title,
        }
      }));

      return {
        ...state,
        results: results,
        highlightedIndex: 0,
        isSearching: false,
      };

    case 'EVENTS_ALGOLIA_SEARCH_ERROR':
      return {
        ...state,
        isSearching: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
