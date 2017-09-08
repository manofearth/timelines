import { TimelineEvent } from '../shared/event/timeline-event';
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
  status: 'NEW',
  error: null,
  event: newEvent(''),
  typeSelector: selectorInputInitialState,
  validation: null,
};

export function newEvent(title: string): TimelineEvent {
  return {
    id: null,
    type: null,
    title: title,
    dateBegin: null,
    dateEnd: null,
    timelines: {}
  }
}
