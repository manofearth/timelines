import { TimelineDate } from './date';

export function dateIsGreater(date1: TimelineDate | null, date2: TimelineDate | null): boolean {
  if (date1 === null || date2 === null) {
    return false;
  }
  return date1.days > date2.days;
}
