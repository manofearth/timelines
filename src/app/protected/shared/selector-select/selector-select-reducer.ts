import { selectorSelectInitialState, SelectorSelectState } from './selector-select-state';
import { SearchFieldEnterKeyAction, SearchFieldEscKeyAction } from '../search-field/search-field-actions';
import { SelectorListSelectAction } from '../selector-list/selector-list-actions';
import { SelectorSelectButtonAction, SelectorSelectInitAction } from './selector-select-actions';

type SelectorSelectAction = SelectorSelectInitAction | SelectorSelectButtonAction | SearchFieldEnterKeyAction
  | SearchFieldEscKeyAction | SelectorListSelectAction;

export function selectorSelectReducer(
  state: SelectorSelectState<any>,
  action: SelectorSelectAction
): SelectorSelectState<any> {

  switch (action.type) {
    case 'SELECTOR_SELECT_INIT':
      return selectorSelectInitialState;
    case 'SELECTOR_SELECT_BUTTON':
      return {
        ...state,
        isDropdownVisible: true,
      };
    case 'SEARCH_FIELD_ESC_KEY':
    case 'SELECTOR_LIST_SELECT':
    case 'SEARCH_FIELD_ENTER_KEY':
      return {
        ...state,
        isDropdownVisible: false,
      };
    default:
      return state;
  }
}
