import { TimelineEvent } from '../shared/event/timeline-event';
import { selectorInputInitialState, SelectorInputState } from '../shared/selector-input/selector-input-state';
import { TimelineEventsTypeLight } from '../types/types-states';
import { EventValidationState } from './reducers/event-validation.reducer';
import { SearchableListState } from '../shared/searchable-list/searchable-list.reducer';
import { InfoSourceForList } from '../info-sources/info-sources-list.reducer';

export interface EventState {
  infoSourceSelector: SearchableListState<InfoSourceForList>;
  status: EventStatus;
  error: Error;
  event: TimelineEvent | null;
  typeSelector: SelectorInputState<TimelineEventsTypeLight>;
  validation: EventValidationState;
}

export type EventStatus =
  'NEW'
  | 'INSERTING'
  | 'INSERTED'
  | 'UPDATING'
  | 'UPDATED'
  | 'ERROR'
  | 'LOADING'
  | 'LOADED'
  | 'DELETING';

export const eventInitialState: EventState = {
  status: 'NEW',
  error: null,
  event: newEvent(''),
  typeSelector: selectorInputInitialState,
  validation: null,
  infoSourceSelector: {
    isSearching: false,
    query: '',
    results: [],
    highlightedIndex: 0,
    error: null,
  },
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
