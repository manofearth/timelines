import { eventInitialState } from '../event-states';
import { TimelineEvent } from '../../shared/event/timeline-event';
import {
  EventCreateAction,
  EventEraseAction,
  EventInsertAndAttachToTimelineAction,
  EventUpdateAction
} from '../event-actions';
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

type EventReducerAction = EventGetSuccessAction
  | EventGetErrorAction
  | EventUpdateAction
  | EventEraseAction
  | EventCreateAction
  | EventInsertAndAttachToTimelineAction
  | EventInsertSuccessAction
  | InputChangedAction
  | DateChangedAction
  | SelectorSelectSelectedAction;

export function eventReducer(state: TimelineEvent, action: EventReducerAction): TimelineEvent {
  switch (action.type) {
    case 'EVENT_GET_SUCCESS':
      return toTimelineEvent(action.payload.event, action.payload.type);
    case 'EVENT_ERASE':
      return eventInitialState.event;
    case 'EVENT_CREATE':
      return {
        id: null,
        type: null,
        title: action.payload,
        dateBegin: null,
        dateEnd: null,
      };
    case 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE':
      return action.payload.event;
    case 'EVENT_INSERT_SUCCESS':
      return { ...state, id: action.payload };
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
          return { ...state, dateBegin: action.payload.value };
        case EVENT_DATE_END_INPUT_NAME:
          return { ...state, dateEnd: action.payload.value };
        default:
          return state;
      }
    case 'SELECTOR_SELECT_SELECTED':
      switch (action.payload.name) {
        case EVENT_TYPE_SELECTOR_NAME:
          return { ...state, type: action.payload.value };
        default:
          return state;
      }
    default:
      return state;
  }
}

function toTimelineEvent(firebaseEvent: FirebaseTimelineEvent, firebaseType: FirebaseType): TimelineEvent {
  return {
    id: firebaseEvent.$key,
    type: toType(firebaseType),
    title: firebaseEvent.title,
    dateBegin: firebaseEvent.dateBegin,
    dateEnd: firebaseEvent.dateEnd,
  };
}
