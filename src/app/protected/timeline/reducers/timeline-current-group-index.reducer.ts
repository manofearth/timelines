import { TimelineChangeCurrentGroupAction } from '../timeline-actions';

type TimelineCurrentGroupIndexReducerAction = TimelineChangeCurrentGroupAction;

export function timelineCurrentGroupIndexReducer(state: number, action: TimelineCurrentGroupIndexReducerAction): number {
  switch (action.type) {
    case 'TIMELINE_CHANGE_CURRENT_GROUP':
      return action.payload;
    default:
      return state;
  }
}
