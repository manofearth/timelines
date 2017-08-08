import { eventInitialState, EventStatus } from '../event-states';
import {
  EventCreateAction,
  EventEraseAction,
  EventGetAction,
  EventInsertAction,
  EventInsertAndAttachToTimelineAction,
  EventInsertErrorAction,
  EventInsertSuccessAction,
  EventUpdateAction,
  EventUpdateErrorAction,
  EventUpdateSuccessAction
} from '../event-actions';
import { EventGetErrorAction, EventGetSuccessAction } from '../effects/event-firebase-get.effect';

type EventStatusReducerAction =
  EventGetAction
  | EventGetSuccessAction
  | EventGetErrorAction
  | EventUpdateErrorAction
  | EventInsertErrorAction
  | EventCreateAction
  | EventUpdateAction
  | EventInsertAction
  | EventInsertAndAttachToTimelineAction
  | EventUpdateSuccessAction
  | EventInsertSuccessAction
  | EventEraseAction;

export function eventStatusReducer(state: EventStatus, action: EventStatusReducerAction): EventStatus {
  switch (action.type) {
    case 'EVENT_GET':
      return 'LOADING';
    case 'EVENT_GET_SUCCESS':
      return 'LOADED';
    case 'EVENT_GET_ERROR':
    case 'EVENT_UPDATE_ERROR':
    case 'EVENT_INSERT_ERROR':
      return 'ERROR';
    case 'EVENT_CREATE':
      return 'NEW';
    case 'EVENT_UPDATE':
      return 'UPDATING';
    case 'EVENT_INSERT':
    case 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE':
      return 'INSERTING';
    case 'EVENT_UPDATE_SUCCESS':
      return 'UPDATED';
    case 'EVENT_INSERT_SUCCESS':
      return 'INSERTED';
    case 'EVENT_ERASE':
      return eventInitialState.status;
    default:
      return state;
  }
}
