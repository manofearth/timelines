import { EventStateWithoutValidate } from './event-state.reducer';
import { EventGetSuccessAction } from '../effects/event-firebase-get.effect';
import {
  EVENT_DATE_BEGIN_INPUT_NAME,
  EVENT_DATE_END_INPUT_NAME,
  EVENT_TITLE_INPUT_NAME,
  EVENT_TYPE_SELECTOR_NAME
} from '../event.component';
import { InputChangedAction } from '../../shared/input/input.directive';
import { DateChangedAction } from '../../date/date.directive';
import { SelectorSelectSelectedAction } from '../../shared/selector-select/selector-select.component';

export interface EventValidationState {
  emptyType: boolean;
  emptyTitle: boolean;
  emptyDateBegin: boolean;
  emptyDateEnd: boolean;
}

export type EventValidationAction =
  EventGetSuccessAction
  | InputChangedAction
  | DateChangedAction
  | SelectorSelectSelectedAction;

export function eventValidationReducer(state: EventValidationState, action: EventValidationAction, stateToValidate: EventStateWithoutValidate): EventValidationState {

  switch (action.type) {
    case 'EVENT_GET_SUCCESS':
      return {
        emptyType: !stateToValidate.event.type,
        emptyTitle: !stateToValidate.event.title,
        emptyDateBegin: !stateToValidate.event.dateBegin,
        emptyDateEnd: !stateToValidate.event.dateEnd,
      };
    case 'INPUT_CHANGED':
      if (action.payload.name === EVENT_TITLE_INPUT_NAME) {
        return validateRequired(state, 'emptyTitle', action.payload.value);
      }
      return state;
    case 'DATE_CHANGED':
      switch (action.payload.name) {
        case EVENT_DATE_BEGIN_INPUT_NAME:
          return validateRequired(state, 'emptyDateBegin', action.payload.value);
        case EVENT_DATE_END_INPUT_NAME:
          return validateRequired(state, 'emptyDateEnd', action.payload.value);
        default:
          return state;
      }
    case 'SELECTOR_SELECT_SELECTED':
      switch (action.payload.name) {
        case EVENT_TYPE_SELECTOR_NAME:
          return validateRequired(state, 'emptyType', action.payload.value);
        default:
          return state;
      }
    default:
      return state;
  }
}

function validateRequired(state: EventValidationState, isValidProperty: keyof EventValidationState, value: any): EventValidationState {
  const isValueEmpty = !value;
  if (isValueEmpty === state[isValidProperty]) {
    return state;
  } else {
    return {
      ...state,
      [isValidProperty]: isValueEmpty,
    }
  }
}
