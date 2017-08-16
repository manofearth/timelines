import { TimelineEvent } from './timeline-event';
export function isNew(event: TimelineEvent): boolean {
    return event.id === null;
}
