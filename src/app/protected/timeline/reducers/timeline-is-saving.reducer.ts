import { TimelineChangedAction, TimelineSaveErrorAction, TimelineSaveSuccessAction } from '../timeline-actions';

type TimelineIsSavingReducerAction = TimelineSaveSuccessAction | TimelineSaveErrorAction | TimelineChangedAction;

export function timelineIsSavingReducer(state: boolean, action: TimelineIsSavingReducerAction): boolean {
  switch (action.type) {
    case 'TIMELINE_SAVE_SUCCESS':
    case 'TIMELINE_SAVE_ERROR':
      return false;
    case 'TIMELINE_CHANGED':
      return true;
    default:
      return state;
  }
}
