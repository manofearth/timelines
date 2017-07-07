import { TimelineAction } from './timeline-actions';
import { TimelineState } from './timeline-states';

export function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    case 'TIMELINE_GET_SUCCESS':
      return {
        isLoading: false,
        isSaving: false,
        error: null,
        timeline: action.payload,
      };
    case 'TIMELINE_GET_ERROR':
      return {
        isLoading: false,
        isSaving: false,
        error: action.payload,
        timeline: state.timeline,
      };
    case 'TIMELINE_CHANGED':
      return {
        isLoading: state.isLoading,
        isSaving: true,
        error: null,
        timeline: { ...state.timeline, ...action.payload },
      };
    case 'TIMELINE_SAVE_SUCCESS':
      return {
        isLoading: state.isLoading,
        isSaving: false,
        error: null,
        timeline: state.timeline,
      };
    case 'TIMELINE_SAVE_ERROR':
      return {
        isLoading: state.isLoading,
        isSaving: false,
        error: action.payload,
        timeline: state.timeline,
      };
    default:
      return state;
  }
}
