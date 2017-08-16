import { EventGetErrorAction, EventGetSuccessAction } from '../effects/event-firebase-get.effect';
import { eventInitialState } from '../event-states';
import { EventEraseAction } from '../event-actions';
import { EventUpdateErrorAction, EventUpdateSuccessAction } from '../effects/event-firebase-update.effect';
import { EventInsertErrorAction, EventInsertSuccessAction } from '../effects/event-firebase-insert.effect';

type EventErrorReducerAction =
  EventGetErrorAction
  | EventUpdateErrorAction
  | EventInsertErrorAction
  | EventGetSuccessAction
  | EventUpdateSuccessAction
  | EventInsertSuccessAction
  | EventEraseAction;

export function eventErrorReducer(state: Error, action: EventErrorReducerAction): Error {
  switch (action.type) {
    case 'EVENT_GET_ERROR':
    case 'EVENT_UPDATE_ERROR':
    case 'EVENT_INSERT_ERROR':
      return action.payload;
    case 'EVENT_GET_SUCCESS':
    case 'EVENT_UPDATE_SUCCESS':
    case 'EVENT_INSERT_SUCCESS':
      return null;
    case 'EVENT_ERASE':
      return eventInitialState.error;
    default:
      return state;
  }
}
