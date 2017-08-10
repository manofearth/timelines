import { EventStateWithoutValidate } from './event-state.reducer';
import { EventGetSuccessAction } from '../effects/event-firebase-get.effect';
import { EVENT_TITLE_INPUT_NAME } from '../event.component';
import { InputChangedAction } from '../../shared/input/input.directive';

export interface EventValidationState {
  emptyTitle: boolean;
}

export type EventValidationAction = EventGetSuccessAction | InputChangedAction;

export function eventValidationReducer(state: EventValidationState, action: EventValidationAction, stateToValidate: EventStateWithoutValidate): EventValidationState {

  switch (action.type) {
    case 'EVENT_GET_SUCCESS':
      return {
        emptyTitle: !stateToValidate.event.title,
      };
    case 'INPUT_CHANGED':
      if (action.payload.name === EVENT_TITLE_INPUT_NAME) {
        const isTitleEmpty = !action.payload.value;
        if (isTitleEmpty === state.emptyTitle) {
          return state;
        } else {
          return {
            emptyTitle: isTitleEmpty,
          }
        }
      }
      return state;
    default:
      return state;
  }
}
