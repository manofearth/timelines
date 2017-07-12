import { Action } from '@ngrx/store';
import { Timeline, TimelineChangedPayload } from './timeline-states';

export type TimelineActionType = 'TIMELINE_GET' | 'TIMELINE_GET_SUCCESS' | 'TIMELINE_GET_ERROR'
  | 'TIMELINE_CHANGED' | 'TIMELINE_SAVE_SUCCESS' | 'TIMELINE_SAVE_ERROR'
  | 'TIMELINE_EVENT_FINDER_SEARCH' | 'TIMELINE_EVENT_FINDER_SEARCH_SUCCESS' | 'TIMELINE_EVENT_FINDER_SEARCH_ERROR'
  | 'TIMELINE_CHANGE_GROUP';

export interface TimelineActionBase extends Action {
  type: TimelineActionType;
}

export interface TimelineGetAction extends TimelineActionBase {
  type: 'TIMELINE_GET';
  payload: string; // id
}

export interface TimelineGetSuccessAction extends TimelineActionBase {
  type: 'TIMELINE_GET_SUCCESS';
  payload: Timeline;
}

export interface TimelineGetErrorAction extends TimelineActionBase {
  type: 'TIMELINE_GET_ERROR';
  payload: Error;
}

export interface TimelineChangedAction extends TimelineActionBase {
  type: 'TIMELINE_CHANGED';
  payload: TimelineChangedPayload;
}

export interface TimelineSaveSuccessAction extends TimelineActionBase {
  type: 'TIMELINE_SAVE_SUCCESS';
}

export interface TimelineSaveErrorAction extends TimelineActionBase {
  type: 'TIMELINE_SAVE_ERROR';
  payload: Error;
}

export interface TimelineChangeGroupAction extends TimelineActionBase {
    type: 'TIMELINE_CHANGE_GROUP';
    payload: number; // group index
}

export type TimelineAction = TimelineGetAction | TimelineGetSuccessAction | TimelineGetErrorAction
  | TimelineChangedAction | TimelineSaveSuccessAction | TimelineSaveErrorAction | TimelineChangeGroupAction;
