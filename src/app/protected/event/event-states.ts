import { TimelineEvent } from '../shared/timeline-event';
import { selectorInputInitialState, SelectorInputState } from '../shared/selector-input/selector-input-state';
import { TimelineEventsTypeLight } from '../types/types-states';
import { EventValidationState } from './reducers/event-validation.reducer';

export interface EventState {
  status: EventStatus;
  error: Error;
  event: TimelineEvent | null;
  typeSelector: SelectorInputState<TimelineEventsTypeLight>;
  validation: EventValidationState;
}

export type EventStatus = 'NEW' | 'INSERTING' | 'INSERTED' | 'UPDATING' | 'UPDATED' | 'ERROR' | 'LOADING' | 'LOADED';

export const eventInitialState: EventState = {
  status: null,
  error: null,
  event: null,
  typeSelector: selectorInputInitialState,
  validation: null,
};
