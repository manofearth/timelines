import { TimelineDate } from './date/date';
import { TimelineEventsTypeLight } from '../types/types-states';

export interface TimelineEvent {
  id: string;
  type: TimelineEventsTypeLight;
  title: string;
  dateBegin: TimelineDate;
  dateEnd: TimelineDate;
}

export interface TimelineEventLight {
  id: string;
  title: string;
}
