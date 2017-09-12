import {
  SelectorSelectButtonAction,
  SelectorSelectInitAction
} from '../../shared/selector-select/selector-select-actions';
import { SearchFieldInputAction } from '../../shared/search-field/search-field-actions';
import { TypesSearchErrorAction, TypesSearchSuccessAction } from '../../types/effects/types-algolia-search.effect';
import { selectorSelectInitialState, SelectorSelectState } from '../../shared/selector-select/selector-select-state';
import { TimelineEventsTypeLight } from '../../types/types-states';
import { SelectorListItem } from '../../shared/selector-list/selector-list-item';
import { EventGetSuccessAction } from '../effects/event-firebase-get.effect';
import { toType } from '../../type/effects/type-get.effect';


type EventTypeSelectorReducerActionAllActions = EventGetSuccessAction;

export function eventTypeSelectorReducerAllActions(
  state: SelectorSelectState<TimelineEventsTypeLight>, action: EventTypeSelectorReducerActionAllActions
): SelectorSelectState<TimelineEventsTypeLight> {
  switch (action.type) {
    case 'EVENT_GET_SUCCESS':
      return {
        ...selectorSelectInitialState,
        selectedItem: {
          title: action.payload.type.title,
          titleHighlighted: action.payload.type.title,
          item: toType(action.payload.type),
        }
      };
    default:
      return state;
  }
}

type EventTypeSelectorReducerActionFilteredByName = SearchFieldInputAction
  | TypesSearchSuccessAction
  | TypesSearchErrorAction
  | SelectorSelectButtonAction
  | SelectorSelectInitAction;

export function eventTypeSelectorReducerFilteredByName(
  state: SelectorSelectState<TimelineEventsTypeLight>, action: EventTypeSelectorReducerActionFilteredByName
): SelectorSelectState<TimelineEventsTypeLight> {

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
        results: action.payload.result.hits.map(
          (hit): SelectorListItem<TimelineEventsTypeLight> => ({
            title: hit.title,
            titleHighlighted: hit._highlightResult.title.value,
            item: {
              id: hit.objectID,
              title: hit.title,
              kind: hit.kind,
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
