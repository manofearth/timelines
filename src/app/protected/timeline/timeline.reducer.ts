import { Action } from '@ngrx/store';
import { TimelineDate } from '../shared/date';
import { SelectorState } from '../shared/selector/selector-state';
import { SelectorChangedAction } from '../shared/selector/selector-actions';

export interface Timeline {
  id: string;
  title: string;
  events: TimelineEventForTimeline[];
}

export interface TimelineEventForTimeline {
  id: string;
  title: string;
  dateBegin: TimelineDate;
  dateEnd: TimelineDate;
}

export interface TimelineForList {
  id: string;
  title: string;
}

export interface TimelineChangedPayload {
  id: string;
  title: string;
}

export interface TimelineState {
  isLoading: boolean;
  isSaving: boolean;
  error: Error;
  timeline: Timeline;
  eventFinder: SelectorState;
}

export type TimelineActionType = 'TIMELINE_GET' | 'TIMELINE_GET_SUCCESS' | 'TIMELINE_GET_ERROR'
  | 'TIMELINE_CHANGED' | 'TIMELINE_SAVE_SUCCESS' | 'TIMELINE_SAVE_ERROR'
  | 'TIMELINE_EVENT_FINDER_CHANGED' | 'TIMELINE_EVENT_FINDER_SEARCH_SUCCESS' | 'TIMELINE_EVENT_FINDER_SEARCH_ERROR';

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

export interface TimelineEventFinderChangedAction extends TimelineActionBase, SelectorChangedAction {
  type: 'TIMELINE_EVENT_FINDER_CHANGED';
  payload: string;
}

export interface TimelineEventFinderSearchSuccessAction extends TimelineActionBase {
  type: 'TIMELINE_EVENT_FINDER_SEARCH_SUCCESS';
}

export interface TimelineEventFinderSearchErrorAction extends TimelineActionBase {
  type: 'TIMELINE_EVENT_FINDER_SEARCH_ERROR';
}

export type TimelineAction = TimelineGetAction | TimelineGetSuccessAction | TimelineGetErrorAction
  | TimelineChangedAction | TimelineSaveSuccessAction | TimelineSaveErrorAction;

export function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    case 'TIMELINE_GET_SUCCESS':
      return {
        isLoading: false,
        isSaving: false,
        error: null,
        timeline: action.payload,
        eventFinder: null,
      };
    case 'TIMELINE_GET_ERROR':
      return {
        isLoading: false,
        isSaving: false,
        error: action.payload,
        timeline: state.timeline,
        eventFinder: null,
      };
    case 'TIMELINE_CHANGED':
      return {
        isLoading: state.isLoading,
        isSaving: true,
        error: null,
        timeline: { ...state.timeline, ...action.payload },
        eventFinder: null,
      };
    case 'TIMELINE_SAVE_SUCCESS':
      return {
        isLoading: state.isLoading,
        isSaving: false,
        error: null,
        timeline: state.timeline,
        eventFinder: null,
      };
    case 'TIMELINE_SAVE_ERROR':
      return {
        isLoading: state.isLoading,
        isSaving: false,
        error: action.payload,
        timeline: state.timeline,
        eventFinder: null,
      };
    default:
      return state;
  }
}
