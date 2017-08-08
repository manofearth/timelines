import { eventInitialState } from '../event-states';
import { TimelineEvent } from '../../shared/timeline-event';
import {
  EventCreateAction,
  EventEraseAction,
  EventInsertAction,
  EventInsertAndAttachToTimelineAction,
  EventInsertSuccessAction,
  EventUpdateAction
} from '../event-actions';
import { EventGetErrorAction, EventGetSuccessAction } from '../effects/event-firebase-get.effect';
import { FirebaseTimelineEvent } from '../events-firebase.service';

type EventReducerAction = EventGetSuccessAction | EventGetErrorAction | EventUpdateAction | EventInsertAction
  | EventEraseAction | EventCreateAction | EventInsertAndAttachToTimelineAction | EventInsertSuccessAction;

export function eventReducer(state: TimelineEvent, action: EventReducerAction): TimelineEvent {
  switch (action.type) {
    case 'EVENT_GET_SUCCESS':
      return toTimelineEvent(action.payload);
    case 'EVENT_UPDATE':
    case 'EVENT_INSERT':
      return action.payload;
    case 'EVENT_ERASE':
      return eventInitialState.event;
    case 'EVENT_CREATE':
      return {
        id: null,
        title: action.payload,
        dateBegin: null,
        dateEnd: null,
      };
    case 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE':
      return action.payload.event;
    case 'EVENT_INSERT_SUCCESS':
      return { ...state, id: action.payload };
    default:
      return state;
  }
}

function toTimelineEvent(firebaseEvent: FirebaseTimelineEvent): TimelineEvent {
  return {
    id: firebaseEvent.$key,
    title: firebaseEvent.title,
    dateBegin: firebaseEvent.dateBegin,
    dateEnd: firebaseEvent.dateEnd,
  };
}
