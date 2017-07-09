import { EventState } from './event-states';
import { EventAction } from './event-actions';

export function eventReducer(state: EventState, action: EventAction): EventState {

  switch (action.type) {
    case 'EVENT_GET':
      return {
        status: 'LOADING',
        error: null,
        event: state.event,
      };
    case 'EVENT_GET_SUCCESS':
      return {
        status: 'LOADED',
        error: state.error,
        event: action.payload,
      };
    case 'EVENT_GET_ERROR':
      return {
        status: 'ERROR',
        error: action.payload,
        event: state.event,
      };
    case 'EVENT_CREATE':
      return {
        status: 'NEW',
        error: null,
        event: {
          id: null,
          title: action.payload,
          dateBegin: null,
          dateEnd: null,
        },
      };
    case 'EVENT_UPDATE':
      return {
        status: 'UPDATING',
        error: null,
        event: action.payload,
      };
    case 'EVENT_INSERT':
      return {
        status: 'INSERTING',
        error: null,
        event: action.payload,
      };
    case 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE':
      return {
        status: 'INSERTING',
        error: null,
        event: action.payload.event,
      };
    case 'EVENT_UPDATE_SUCCESS':
      return {
        status: 'UPDATED',
        error: null,
        event: state.event,
      };
    case 'EVENT_INSERT_SUCCESS':
      return {
        status: 'INSERTED',
        error: null,
        event: { ...state.event, id: action.payload },
      };
    case 'EVENT_UPDATE_ERROR':
    case 'EVENT_INSERT_ERROR':
      return {
        status: 'ERROR',
        error: action.payload,
        event: state.event,
      };
    case 'EVENT_ERASE':
      return {
        status: null,
        error: null,
        event: null,
      };
    default:
      return state;
  }
}
