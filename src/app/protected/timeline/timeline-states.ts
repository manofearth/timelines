import { TimelineDate } from '../shared/date/date';
import { selectorInputInitialState, SelectorInputState } from '../shared/selector-input/selector-input-state';
import { TimelineEventLight } from '../shared/event/timeline-event';
import { TimelineEventsTypeLight } from '../types/types-states';

export interface Timeline {
  id: string;
  title: string;
  groups: TimelineEventsGroup[];
}

export interface TimelineEventsGroup {
  id: string;
  title: string;
  color: string;
  events: TimelineEventForTimeline[];
}

export interface TimelineEventForTimeline {
  id: string;
  title: string;
  type: TimelineEventsTypeLight;
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
  currentGroupIndex: number;
  eventsSelector: SelectorInputState<TimelineEventLight>;
}

export const timelineInitialState: TimelineState = {
  isLoading: true,
  isSaving: false,
  error: null,
  timeline: null,
  currentGroupIndex: 0,
  eventsSelector: selectorInputInitialState,
};
