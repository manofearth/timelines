import { TimelineGetErrorAction, TimelineGetSuccessAction } from '../timeline-actions';

type TimelineIsLoadingReducerAction = TimelineGetSuccessAction | TimelineGetErrorAction;

export function timelineIsLoadingReducer(state: boolean, action: TimelineIsLoadingReducerAction): boolean {
  switch (action.type) {
    case 'TIMELINE_GET_SUCCESS':
    case 'TIMELINE_GET_ERROR':
      return false;
    default:
      return state;
  }
}
