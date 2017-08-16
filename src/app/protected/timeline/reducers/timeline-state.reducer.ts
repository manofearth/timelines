import { TimelineState } from '../timeline-states';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { Reducers } from '../../../reducers';
import { timelineIsLoadingReducer } from './timeline-is-loading.reducer';
import { timelineIsSavingReducer } from './timeline-is-saving.reducer';
import { timelineErrorReducer } from './timeline-error.reducer';
import { timelineReducer } from './timeline.reducer';
import { timelineCurrentGroupIndexReducer } from './timeline-current-group-index.reducer';
import { timelineEventsSelectorReducer } from './timeline-events-selector.reducer';

const reducers: Reducers<TimelineState> = {
  isLoading: timelineIsLoadingReducer,
  isSaving: timelineIsSavingReducer,
  error: timelineErrorReducer,
  timeline: timelineReducer,
  currentGroupIndex: timelineCurrentGroupIndexReducer,
  eventsSelector: timelineEventsSelectorReducer,
};

export const timelineStateReducer: ActionReducer<TimelineState> = combineReducers(reducers);
