import { eventInitialState, EventStatus } from '../event-states';
import { EventEraseAction, EventInsertAndAttachToTimelineAction } from '../event-actions';
import { EventGetErrorAction, EventGetSuccessAction } from '../effects/event-firebase-get.effect';
import {
  TIMELINE_EVENTS_SELECTOR_NAME_PREFIX,
  TimelineEventClickAction
} from '../../timeline/events/timeline-events-table.component';
import { EventUpdateErrorAction, EventUpdateSuccessAction } from '../effects/event-firebase-update.effect';
import { EventInsertErrorAction, EventInsertSuccessAction } from '../effects/event-firebase-insert.effect';
import { EventSaveButtonAction } from '../event.component';
import { isNew } from '../../shared/event/is-new.fn';
import { ChartBarClickAction } from '../../chart/chart.component';
import { SearchFieldCreateButtonAction } from '../../shared/search-field/search-field-actions';

type EventStatusReducerAction =
  | TimelineEventClickAction
  | EventGetSuccessAction
  | EventGetErrorAction
  | EventUpdateErrorAction
  | EventInsertErrorAction
  | EventInsertAndAttachToTimelineAction
  | EventUpdateSuccessAction
  | EventInsertSuccessAction
  | EventEraseAction
  | EventSaveButtonAction
  | ChartBarClickAction
  | SearchFieldCreateButtonAction;

export function eventStatusReducer(state: EventStatus, action: EventStatusReducerAction): EventStatus {
  switch (action.type) {
    case 'TIMELINE_EVENT_CLICK':
    case 'CHART_BAR_CLICK':
      return 'LOADING';
    case 'EVENT_GET_SUCCESS':
      return 'LOADED';
    case 'EVENT_GET_ERROR':
    case 'EVENT_UPDATE_ERROR':
    case 'EVENT_INSERT_ERROR':
      return 'ERROR';
    case 'SEARCH_FIELD_CREATE_BUTTON':
      if (action.payload.name.startsWith(TIMELINE_EVENTS_SELECTOR_NAME_PREFIX)) {
        return 'NEW';
      }
      return state;
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
