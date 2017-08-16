import { eventInitialState, EventStatus } from '../event-states';
import { EventCreateAction, EventEraseAction, EventInsertAndAttachToTimelineAction } from '../event-actions';
import { EventGetErrorAction, EventGetSuccessAction } from '../effects/event-firebase-get.effect';
import { TimelineEventClickAction } from '../../timeline/events/timeline-events-table.component';
import { EventUpdateErrorAction, EventUpdateSuccessAction } from '../effects/event-firebase-update.effect';
import { EventInsertErrorAction, EventInsertSuccessAction } from '../effects/event-firebase-insert.effect';
import { EventSaveButtonAction } from '../event.component';
import { isNew } from '../../shared/event/is-new.fn';

type EventStatusReducerAction =
  | TimelineEventClickAction
  | EventGetSuccessAction
  | EventGetErrorAction
  | EventUpdateErrorAction
  | EventInsertErrorAction
  | EventCreateAction
  | EventInsertAndAttachToTimelineAction
  | EventUpdateSuccessAction
  | EventInsertSuccessAction
  | EventEraseAction
  | EventSaveButtonAction;

export function eventStatusReducer(state: EventStatus, action: EventStatusReducerAction): EventStatus {
  switch (action.type) {
    case 'TIMELINE_EVENT_CLICK':
      return 'LOADING';
    case 'EVENT_GET_SUCCESS':
      return 'LOADED';
    case 'EVENT_GET_ERROR':
    case 'EVENT_UPDATE_ERROR':
    case 'EVENT_INSERT_ERROR':
      return 'ERROR';
    case 'EVENT_CREATE':
      return 'NEW';
    case 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE':
      return 'INSERTING';
    case 'EVENT_UPDATE_SUCCESS':
      return 'UPDATED';
    case 'EVENT_INSERT_SUCCESS':
      return 'INSERTED';
    case 'EVENT_ERASE':
      return eventInitialState.status;
    case 'EVENT_SAVE_BUTTON':
      return isNew(action.payload) ? 'INSERTING' : 'UPDATING';
    default:
      return state;
  }
}
