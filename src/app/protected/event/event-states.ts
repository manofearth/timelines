import { TimelineEvent } from '../shared/timeline-event';
import { selectorInputInitialState, SelectorInputState } from '../shared/selector-input/selector-input-state';
import { TimelineEventsTypeForList } from '../types/types-states';

export interface EventState {
  status: EventStatus;
  error: Error;
  event: TimelineEvent;
  typeSelector: SelectorInputState<TimelineEventsTypeForList>;
}

export type EventStatus = 'NEW' | 'INSERTING' | 'INSERTED' | 'UPDATING' | 'UPDATED' | 'ERROR' | 'LOADING' | 'LOADED';

export const eventInitialState: EventState = {
  status: null,
  error: null,
  event: null,
  typeSelector: selectorInputInitialState,
};
