import { TimelineDate } from './date';

export interface TimelineEvent {
  id: string;
  title: string;
  dateBegin: TimelineDate;
  dateEnd: TimelineDate;
}

export interface TimelineEventForList {
  id: string;
  title: string;
}
