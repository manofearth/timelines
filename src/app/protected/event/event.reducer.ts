import { TimelineEvent } from '../shared/timeline-event';
import { Action } from '@ngrx/store';
import { ObjectWithId } from '../../shared/interfaces';

export interface EventState {
  status: EventStatus;
  error: Error;
  event: TimelineEvent;
}

export type EventStatus = 'NEW' | 'INSERTING' | 'INSERTED' | 'UPDATING' | 'UPDATED' | 'ERROR';

export type EventActionType = 'EVENT_CREATE' | 'EVENT_UPDATE' | 'EVENT_UPDATE_SUCCESS' | 'EVENT_UPDATE_ERROR'
  | 'EVENT_INSERT' | 'EVENT_INSERT_SUCCESS' | 'EVENT_INSERT_ERROR' | 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE';

export interface EventAction extends Action {
  type: EventActionType;
}

export interface EventCreateAction extends EventAction {
  type: 'EVENT_CREATE';
  payload: string;
}

export interface EventUpdateAction extends EventAction {
  type: 'EVENT_UPDATE';
  payload: TimelineEvent;
}

export interface EventUpdateSuccessAction extends EventAction {
  type: 'EVENT_UPDATE_SUCCESS';
}

export interface EventUpdateErrorAction extends EventAction {
  type: 'EVENT_UPDATE_ERROR';
  payload: Error;
}

export interface EventInsertAction extends EventAction {
  type: 'EVENT_INSERT';
  payload: TimelineEvent;
}

export interface EventInsertAndAttachToTimelineAction extends EventAction {
  type: 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE';
  payload: {
    timeline: ObjectWithId;
    event: TimelineEvent;
  };
}

export interface EventInsertSuccessAction extends EventAction {
  type: 'EVENT_INSERT_SUCCESS';
}

export interface EventInsertErrorAction extends EventAction {
  type: 'EVENT_INSERT_ERROR';
  payload: Error;
}

export function eventReducer(state: EventState, action: EventAction): EventState {

  switch (action.type) {
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
    default:
      return state;
  }
}
