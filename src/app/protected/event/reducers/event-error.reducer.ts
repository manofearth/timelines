import { EventGetErrorAction, EventGetSuccessAction } from '../effects/event-firebase-get.effect';
import { eventInitialState } from '../event-states';
import {
  EventEraseAction,
  EventInsertErrorAction,
  EventInsertSuccessAction,
  EventUpdateErrorAction,
  EventUpdateSuccessAction
} from '../event-actions';

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
