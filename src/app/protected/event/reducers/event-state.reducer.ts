import { EventState } from '../event-states';
import { Reducers } from '../../../reducers';
import { Action, ActionReducer, combineReducers } from '@ngrx/store';
import { EVENT_TYPE_SELECTOR_NAME } from '../event.component';
import { reduceWhen } from '../../../shared/reduce-when.fn';
import { actionHasName } from '../../../shared/action-has-name.fn';
import { selectorSelectReducer } from '../../shared/selector-select/selector-select-reducer';
import { selectorInputReducer } from '../../shared/selector-input/selector-input-reducer';
import { composeReducers } from '../../../shared/compose-reducers.fn';
import { eventReducer } from './event.reducer';
import { eventStatusReducer } from './event-status.reducer';
import { eventErrorReducer } from './event-error.reducer';
import {
  eventTypeSelectorReducerAllActions,
  eventTypeSelectorReducerFilteredByName
} from './event-type-selector.reducer';
import { eventValidationReducer } from './event-validation.reducer';

export type EventStateWithoutValidate = Pick<EventState, 'status' | 'error' | 'event' | 'typeSelector'>;
const reducersWithoutValidate: Reducers<EventStateWithoutValidate> = {
  status: eventStatusReducer,
  error: eventErrorReducer,
  event: eventReducer,
  typeSelector: composeReducers(
    eventTypeSelectorReducerAllActions,
    reduceWhen(
      actionNameIs(EVENT_TYPE_SELECTOR_NAME),
      composeReducers(
        eventTypeSelectorReducerFilteredByName,
        selectorSelectReducer,
        selectorInputReducer,
      )
    )
  ),
};

const reduceWithoutValidation: ActionReducer<EventStateWithoutValidate> = combineReducers(reducersWithoutValidate);

function actionNameIs(name: string) {
  return (action: Action) => actionHasName(action) && action.payload.name === name;
}

export const eventStateReducer: ActionReducer<EventState> = (state, action) => {
  const interState = reduceWithoutValidation(state, action);
  if (state === interState) {
    return state;
  } else {
    (interState as EventState).validation = eventValidationReducer(state.validation, interState);
    return interState as EventState;
  }
};
