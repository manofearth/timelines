import { Action } from '@ngrx/store';

export type EventActionType = 'EVENT_CREATE'
  | 'EVENT_UPDATE'
  | 'EVENT_GET_SUCCESS'
  | 'EVENT_GET_ERROR'
  | 'EVENT_ERASE'
  | 'EVENT_DETACH'
  | 'EVENT_DETACH_SUCCESS'
  | 'EVENT_DETACH_ERROR'
  | 'EVENT_ATTACH_TO_TIMELINE'
  | 'EVENT_ATTACH_TO_TIMELINE_SUCCESS'
  | 'EVENT_ATTACH_TO_TIMELINE_ERROR';

export interface EventActionBase extends Action {
  type: EventActionType;
}

export interface EventEraseAction extends EventActionBase {
  type: 'EVENT_ERASE';
}

export interface EventDetachAction extends EventActionBase {
  type: 'EVENT_DETACH';
  payload: {
    timelineId: string;
    groupId: string;
    eventId: string;
  };
}

export interface EventDetachSuccessAction extends EventActionBase {
  type: 'EVENT_DETACH_SUCCESS';
}

export interface EventDetachErrorAction extends EventActionBase {
  type: 'EVENT_DETACH_ERROR';
  payload: Error;
}

export interface EventAttachToTimelineAction extends EventActionBase {
  type: 'EVENT_ATTACH_TO_TIMELINE';
  payload: {
    timelineId: string;
    groupId: string;
    eventId: string;
  }
}

export interface EventAttachToTimelineSuccessAction extends EventActionBase {
  type: 'EVENT_ATTACH_TO_TIMELINE_SUCCESS';
}

export interface EventAttachToTimelineErrorAction extends EventActionBase {
  type: 'EVENT_ATTACH_TO_TIMELINE_ERROR';
  payload: Error;
}
