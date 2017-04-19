import { TimelineEvent } from '../shared/timeline-event';
import { Action } from '@ngrx/store';
import { ObjectWithId } from '../../shared/interfaces';

export interface EventState {
  status: EventStatus;
  error: Error;
  event: TimelineEvent;
}

export type EventStatus = 'NEW' | 'INSERTING' | 'INSERTED' | 'UPDATING' | 'UPDATED' | 'ERROR' | 'LOADING' | 'LOADED';

export type EventActionType = 'EVENT_CREATE' | 'EVENT_UPDATE' | 'EVENT_UPDATE_SUCCESS' | 'EVENT_UPDATE_ERROR'
  | 'EVENT_INSERT' | 'EVENT_INSERT_SUCCESS' | 'EVENT_INSERT_ERROR' | 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE'
  | 'EVENT_GET' | 'EVENT_GET_SUCCESS' | 'EVENT_GET_ERROR' | 'EVENT_ERASE';

export interface EventActionBase extends Action {
  type: EventActionType;
}

export interface EventGetAction extends EventActionBase {
  type: 'EVENT_GET';
  payload: string; // id
}

export interface EventGetSuccessAction extends EventActionBase {
  type: 'EVENT_GET_SUCCESS';
  payload: TimelineEvent;
}

export interface EventGetErrorAction extends EventActionBase {
  type: 'EVENT_GET_ERROR';
  payload: Error;
}

export interface EventCreateAction extends EventActionBase {
  type: 'EVENT_CREATE';
  payload: string; // title
}

export interface EventUpdateAction extends EventActionBase {
  type: 'EVENT_UPDATE';
  payload: TimelineEvent;
}

export interface EventUpdateSuccessAction extends EventActionBase {
  type: 'EVENT_UPDATE_SUCCESS';
}

export interface EventUpdateErrorAction extends EventActionBase {
  type: 'EVENT_UPDATE_ERROR';
  payload: Error;
}

export interface EventInsertAction extends EventActionBase {
  type: 'EVENT_INSERT';
  payload: TimelineEvent;
}

export interface EventInsertSuccessAction extends EventActionBase {
  type: 'EVENT_INSERT_SUCCESS';
}

export interface EventInsertErrorAction extends EventActionBase {
  type: 'EVENT_INSERT_ERROR';
  payload: Error;
}

export interface EventInsertAndAttachToTimelineAction extends EventActionBase {
  type: 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE';
  payload: {
    timeline: ObjectWithId;
    event: TimelineEvent;
  };
}

export interface EventEraseAction extends EventActionBase {
  type: 'EVENT_ERASE';
}

export type EventAction = EventGetAction | EventCreateAction | EventUpdateAction | EventUpdateSuccessAction
  | EventUpdateErrorAction | EventInsertAction | EventInsertSuccessAction | EventInsertErrorAction
  | EventInsertAndAttachToTimelineAction | EventGetSuccessAction | EventGetErrorAction | EventEraseAction;

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
