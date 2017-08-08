import { SelectorSelectButtonAction } from '../../shared/selector-select/selector-select-actions';
import { SearchFieldInputAction } from '../../shared/search-field/search-field-actions';
import { TypesSearchErrorAction, TypesSearchSuccessAction } from '../../types/effects/elastic-types-search.effect';
import { SelectorSelectState } from '../../shared/selector-select/selector-select-state';
import { TimelineEventsTypeForList } from '../../types/types-states';
import { SelectorListItem } from '../../shared/selector-list/selector-list-item';

type EventTypeSelectorReducerAction = SearchFieldInputAction | TypesSearchSuccessAction | TypesSearchErrorAction
  | SelectorSelectButtonAction;

export function eventTypeSelectorReducer(
  state: SelectorSelectState<TimelineEventsTypeForList>, action: EventTypeSelectorReducerAction
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
