import { TimelineDate } from './date';
export interface TimelineEvent {
  title: string;
  dateBegin: TimelineDate;
  dateEnd: TimelineDate;
}