import { TimelineAction } from './timeline-actions';
import { TimelineState } from './timeline-states';

export function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    case 'TIMELINE_GET_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isSaving: false,
        error: null,
        timeline: action.payload,
      };
    case 'TIMELINE_GET_ERROR':
      return {
        ...state,
        isLoading: false,
        isSaving: false,
        error: action.payload,
        timeline: state.timeline,
      };
    case 'TIMELINE_CHANGED':
      return {
        ...state,
        isLoading: state.isLoading,
        isSaving: true,
        error: null,
        timeline: { ...state.timeline, ...action.payload },
      };
    case 'TIMELINE_SAVE_SUCCESS':
      return {
        ...state,
        isLoading: state.isLoading,
        isSaving: false,
        error: null,
        timeline: state.timeline,
      };
    case 'TIMELINE_SAVE_ERROR':
      return {
        ...state,
        isLoading: state.isLoading,
        isSaving: false,
        error: action.payload,
        timeline: state.timeline,
      };
    case 'TIMELINE_CHANGE_GROUP':
      return {
        ...state,
        currentGroupIndex: action.payload,
      };
    default:
      return state;
  }
}
