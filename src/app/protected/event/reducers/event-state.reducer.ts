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
import { eventTypeSelectorReducer } from './event-type-selector.reducer';

const reducers: Reducers<EventState> = {
  status: eventStatusReducer,
  error: eventErrorReducer,
  event: eventReducer,
  typeSelector: reduceWhen(
    actionNameIs(EVENT_TYPE_SELECTOR_NAME),
    composeReducers(
      eventTypeSelectorReducer,
      selectorSelectReducer,
      selectorInputReducer,
    )
  ),
};

function actionNameIs(name: string) {
  return (action: Action) => actionHasName(action) && action.payload.name === name;
}

export const eventStateReducer: ActionReducer<EventState> = combineReducers(reducers);
