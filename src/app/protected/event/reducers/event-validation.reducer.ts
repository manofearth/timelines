import { EventStateWithoutValidate } from './event-state.reducer';
import { dateIsGreater } from '../../shared/date/date-comparators';

export interface EventValidationState {
  emptyType: boolean;
  emptyTitle: boolean;
  emptyDateBegin: boolean;
  emptyDateEnd: boolean;
  periodBeginGreaterEnd: boolean;
}

const initialState: EventValidationState = {
  emptyType: false,
  emptyTitle: false,
  emptyDateBegin: false,
  emptyDateEnd: false,
  periodBeginGreaterEnd: false,
};

export function eventValidationReducer(
  state: EventValidationState | null, stateToValidate: EventStateWithoutValidate): EventValidationState {

  if (stateToValidate.event === null) {
    return null;
  }

  return sameIfNotChanged(state === null ? initialState : state, {
    emptyType: !stateToValidate.event.type,
    emptyTitle: !stateToValidate.event.title,
    emptyDateBegin: !stateToValidate.event.dateBegin,
    emptyDateEnd: !stateToValidate.event.dateEnd,
    periodBeginGreaterEnd: dateIsGreater(stateToValidate.event.dateBegin, stateToValidate.event.dateEnd),
  });
}

function sameIfNotChanged(
  current: EventValidationState, contender: Partial<EventValidationState>): EventValidationState {

  const hasChanged = Object.keys(contender).some(key => current[key] !== contender[key]);
  if (hasChanged) {
    return {
      ...current,
      ...contender,
    };
  } else {
    return current;
  }
}
