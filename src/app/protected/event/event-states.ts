import { TimelineEvent } from '../shared/timeline-event';

export interface EventState {
  status: EventStatus;
  error: Error;
  event: TimelineEvent;
}

export type EventStatus = 'NEW' | 'INSERTING' | 'INSERTED' | 'UPDATING' | 'UPDATED' | 'ERROR' | 'LOADING' | 'LOADED';
