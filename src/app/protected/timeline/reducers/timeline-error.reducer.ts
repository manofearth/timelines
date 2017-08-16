import {
  TimelineGetErrorAction,
  TimelineGetSuccessAction,
  TimelineSaveErrorAction,
  TimelineSaveSuccessAction
} from '../timeline-actions';

type TimelineErrorReducerAction =
  TimelineGetSuccessAction
  | TimelineSaveSuccessAction
  | TimelineGetErrorAction
  | TimelineSaveErrorAction;

export function timelineErrorReducer(state: Error, action: TimelineErrorReducerAction): Error {
  switch (action.type) {
    case 'TIMELINE_GET_SUCCESS':
    case 'TIMELINE_SAVE_SUCCESS':
      return null;
    case 'TIMELINE_GET_ERROR':
    case 'TIMELINE_SAVE_ERROR':
      return action.payload;
    default:
      return state;
  }
}
