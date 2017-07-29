import { TimelineEvent } from '../shared/timeline-event';
import { selectorInitialState, SelectorState } from '../shared/selector-input/selector-state';

export interface EventState {
  status: EventStatus;
  error: Error;
  event: TimelineEvent;
  typeSelector: SelectorState;
}

export type EventStatus = 'NEW' | 'INSERTING' | 'INSERTED' | 'UPDATING' | 'UPDATED' | 'ERROR' | 'LOADING' | 'LOADED';

export const eventInitialState: EventState = {
  status: null,
  error: null,
  event: null,
  typeSelector: selectorInitialState,
};
