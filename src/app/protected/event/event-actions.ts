import { Action } from '@ngrx/store';
import { TimelineEvent } from '../shared/timeline-event';

export type EventActionType = 'EVENT_CREATE' | 'EVENT_UPDATE' | 'EVENT_UPDATE_SUCCESS' | 'EVENT_UPDATE_ERROR'
  | 'EVENT_INSERT' | 'EVENT_INSERT_SUCCESS' | 'EVENT_INSERT_ERROR' | 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE'
  | 'EVENT_GET' | 'EVENT_GET_SUCCESS' | 'EVENT_GET_ERROR' | 'EVENT_ERASE' | 'EVENT_DETACH' | 'EVENT_DETACH_SUCCESS'
  | 'EVENT_DETACH_ERROR' | 'EVENT_ATTACH_TO_TIMELINE' | 'EVENT_ATTACH_TO_TIMELINE_SUCCESS'
  | 'EVENT_ATTACH_TO_TIMELINE_ERROR';

export interface EventActionBase extends Action {
  type: EventActionType;
}

export interface EventGetAction extends EventActionBase {
  type: 'EVENT_GET';
  payload: string; // id
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
    timelineId: string;
    groupId: string;
    event: TimelineEvent;
  };
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
