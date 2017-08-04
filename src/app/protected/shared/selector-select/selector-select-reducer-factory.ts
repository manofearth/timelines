import { selectorSelectInitialState, SelectorSelectState } from './selector-select-state';
import { ActionReducer } from '@ngrx/store';
import { selectorInputReducerFactory } from '../selector-input/selector-input-reducer-factory';
import { SearchFieldEnterKeyAction, SearchFieldEscKeyAction } from '../search-field/search-field-actions';
import { SelectorListSelectAction } from '../selector-list/selector-list-actions';
import { SelectorSelectButtonAction, SelectorSelectInitAction } from './selector-select-actions';

export function selectorSelectReducerFactory(
  filter: (name: string) => boolean,
  postReducer: ActionReducer<SelectorSelectState<any>>,
): ActionReducer<SelectorSelectState<any>> {

  return selectorInputReducerFactory(
    filter,
    (state: SelectorSelectState<any>, action: SelectorSelectAction) =>
      postReducer(selectorSelectReducer(state, action), action)
  ) as ActionReducer<SelectorSelectState<any>>;

}

type SelectorSelectAction = SelectorSelectInitAction | SelectorSelectButtonAction | SearchFieldEnterKeyAction
  | SearchFieldEscKeyAction | SelectorListSelectAction;

function selectorSelectReducer(
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
