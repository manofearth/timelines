import { TimelineEvent } from '../../shared/event/timeline-event';
import { EventGetErrorAction, EventGetSuccessAction } from '../effects/event-firebase-get.effect';
import { FirebaseTimelineEvent } from '../events-firebase.service';
import { InputChangedAction } from '../../shared/input/input.directive';
import {
  EVENT_DATE_BEGIN_INPUT_NAME,
  EVENT_DATE_END_INPUT_NAME,
  EVENT_TITLE_INPUT_NAME,
  EVENT_TYPE_SELECTOR_NAME
} from '../event.component';
import { DateChangedAction } from '../../shared/date/date.directive';
import { SelectorSelectSelectedAction } from '../../shared/selector-select/selector-select.component';
import { FirebaseType } from '../../types/types-firebase.service';
import { EventInsertSuccessAction } from '../effects/event-firebase-insert.effect';
import { toType } from '../../type/effects/type-get.effect';
import { EventFromTimelineCreateAction } from '../../timeline/timeline.component';
import { TypeKind } from '../../type/type-states';
import { TimelineDate } from '../../shared/date/date';
import { newEvent } from '../event-states';
import { SearchFieldCreateAction } from '../../shared/search-field/search-field-actions';
import { NavigatedToEventAction, NavigatedToNewEventAction } from '../../events/effects/events-router.effect';
import { actionNameIs } from '../../../shared/action-name-is.fn';
import { EVENTS_LIST_SEARCH_FIELD_NAME } from '../../events/events-list.component';

type EventReducerAction = EventGetSuccessAction
  | EventGetErrorAction
  | EventInsertSuccessAction
  | InputChangedAction
  | DateChangedAction
  | SelectorSelectSelectedAction
  | EventFromTimelineCreateAction
  | SearchFieldCreateAction
  | NavigatedToNewEventAction
  | NavigatedToEventAction;

export function eventReducer(state: TimelineEvent, action: EventReducerAction): TimelineEvent {
  switch (action.type) {
    case 'EVENT_GET_SUCCESS':
      return toTimelineEvent(action.payload.event, action.payload.type);
    case 'EVENT_FROM_TIMELINE_CREATE':
      return newEventAttachedToTimeline(action.payload.eventTitle, action.payload.groupId, action.payload.timelineId);
    case 'SEARCH_FIELD_CREATE':
      if (actionNameIs(EVENTS_LIST_SEARCH_FIELD_NAME)(action)) {
        return newEvent(action.payload.value);
      }
      return state;
    case 'NAVIGATED_TO_NEW_EVENT':
      if (state.id !== null) {
        return newEvent('');
      }
      return state;
    case 'NAVIGATED_TO_EVENT':
      return newEvent('');
    case 'EVENT_INSERT_SUCCESS':
      return { ...state, id: action.payload.eventId };
    case 'INPUT_CHANGED':
      switch (action.payload.name) {
        case EVENT_TITLE_INPUT_NAME:
          return { ...state, title: action.payload.value };
        default:
          return state;
      }
    case 'DATE_CHANGED':
      switch (action.payload.name) {
        case EVENT_DATE_BEGIN_INPUT_NAME:
          return {
            ...state,
            dateBegin: action.payload.value,
            dateEnd: getDateEnd(state.type.kind, action.payload.value, state.dateEnd),
          };
        case EVENT_DATE_END_INPUT_NAME:
          return { ...state, dateEnd: action.payload.value };
        default:
          return state;
      }
    case 'SELECTOR_SELECT_SELECTED':
      switch (action.payload.name) {
        case EVENT_TYPE_SELECTOR_NAME:
          return {
            ...state,
            type: action.payload.value,
            dateEnd: getDateEnd(action.payload.value.kind, state.dateBegin, state.dateEnd),
          };
        default:
          return state;
      }
    default:
      return state;
  }
}

function newEventAttachedToTimeline(title: string, groupId: string, timelineId: string): TimelineEvent {
  const newObj = newEvent(title);
  newObj.timelines[ timelineId ] = { [groupId]: true };
  return newObj;
}

function toTimelineEvent(firebaseEvent: FirebaseTimelineEvent, firebaseType: FirebaseType): TimelineEvent {
  if (!firebaseEvent.$exists()) {
    return null;
  }
  return {
    id: firebaseEvent.$key,
    type: toType(firebaseType),
    title: firebaseEvent.title,
    dateBegin: firebaseEvent.dateBegin,
    dateEnd: firebaseEvent.dateEnd,
    timelines: firebaseEvent.timelines ? firebaseEvent.timelines : {},
  };
}

function getDateEnd(typeKind: TypeKind, dateBegin: TimelineDate, dateEnd: TimelineDate): TimelineDate {
  return typeKind === 'date' ? dateBegin : dateEnd;
}
