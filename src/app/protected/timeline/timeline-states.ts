import { TimelineDate } from '../shared/date';

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
}
