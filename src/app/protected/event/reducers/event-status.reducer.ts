import { EventStatus } from '../event-states';
import { EventGetErrorAction, EventGetSuccessAction } from '../effects/event-firebase-get.effect';
import { TimelineEventClickAction } from '../../timeline/events/timeline-events-table.component';
import { EventUpdateErrorAction, EventUpdateSuccessAction } from '../effects/event-firebase-update.effect';
import { EventInsertErrorAction, EventInsertSuccessAction } from '../effects/event-firebase-insert.effect';
import { EventSaveButtonAction } from '../event.component';
import { isNew } from '../../shared/event/is-new.fn';
import { ChartEventClickAction } from '../../chart/chart.component';
import { NavigatedToEventAction, NavigatedToNewEventAction } from '../../events/effects/events-router.effect';

type EventStatusReducerAction =
  | TimelineEventClickAction
  | EventGetSuccessAction
  | EventGetErrorAction
  | EventUpdateErrorAction
  | EventInsertErrorAction
  | EventUpdateSuccessAction
  | EventInsertSuccessAction
  | EventSaveButtonAction
  | ChartEventClickAction
  | NavigatedToNewEventAction
  | NavigatedToEventAction;

export function eventStatusReducer(state: EventStatus, action: EventStatusReducerAction): EventStatus {
  switch (action.type) {
    case 'TIMELINE_EVENT_CLICK':
    case 'CHART_EVENT_CLICK':
    case 'NAVIGATED_TO_EVENT':
      return 'LOADING';
    case 'EVENT_GET_SUCCESS':
      return 'LOADED';
    case 'EVENT_GET_ERROR':
    case 'EVENT_UPDATE_ERROR':
    case 'EVENT_INSERT_ERROR':
      return 'ERROR';
    case 'NAVIGATED_TO_NEW_EVENT':
      return 'NEW';
    case 'EVENT_UPDATE_SUCCESS':
      return 'UPDATED';
    case 'EVENT_INSERT_SUCCESS':
      return 'INSERTED';
    case 'EVENT_SAVE_BUTTON':
      return isNew(action.payload.event) ? 'INSERTING' : 'UPDATING';
    default:
      return state;
  }
}
