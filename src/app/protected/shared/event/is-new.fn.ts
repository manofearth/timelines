import { TimelineEvent } from './timeline-event';
export function isNew(event: TimelineEvent | null): boolean {
    if (event === null) {
      return false;
    }
    return event.id === null;
}
