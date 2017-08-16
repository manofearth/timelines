import { TimelineChangedAction, TimelineGetSuccessAction } from '../timeline-actions';
import { Timeline, TimelineEventForTimeline } from '../timeline-states';
import { EventSaveButtonAction } from '../../event/event.component';
import { isNew } from '../../shared/event/is-new.fn';
import { isEqualDeep } from '../../../shared/is-equal-deep.fn';
import { TimelineEvent } from '../../shared/event/timeline-event';

type TimelineReducerAction = TimelineGetSuccessAction | TimelineChangedAction | EventSaveButtonAction;

export function timelineReducer(state: Timeline, action: TimelineReducerAction): Timeline {
  switch (action.type) {
    case 'TIMELINE_GET_SUCCESS':
      return action.payload;
    case 'TIMELINE_CHANGED':
      return {
        ...state,
        ...action.payload,
      };
    case 'EVENT_SAVE_BUTTON':
      if (isNew(action.payload)) {
        return state;
      } else {
        const searchResult = findEventInTimeline(state, action.payload.id);
        if (isEqualDeep(searchResult.event, action.payload)) {
          return state;
        } else {
          const updateQuery = {
            ...searchResult,
            event: toTimelineEventForTimeline(action.payload)
          };
          return setEventToTimeline(state, updateQuery);
        }
      }
    default:
      return state;
  }
}

interface EventInTimelineIndex {
  event: TimelineEventForTimeline;
  groupIndex: number;
  indexInGroup: number;
}

function findEventInTimeline(timeline: Timeline, eventId: string): EventInTimelineIndex {
  return timeline.groups.reduce<EventInTimelineIndex>((result, group, groupIndex) => {

    if (result !== null) return result;

    const eventIndex = group.events.findIndex(event => event.id === eventId);

    if (eventIndex === -1) return null;

    return {
      event: group.events[eventIndex],
      indexInGroup: eventIndex,
      groupIndex: groupIndex,
    };

  }, null);

}

function setEventToTimeline(timeline: Timeline, query: EventInTimelineIndex) {

  const groupsClone = [...timeline.groups];
  const eventsClone = [...groupsClone[query.groupIndex].events];

  eventsClone[query.indexInGroup] = query.event;
  groupsClone[query.groupIndex] =  {
    ...groupsClone[query.groupIndex],
    events: eventsClone,
  };

  return {
    ...timeline,
    groups: groupsClone,
  };
}

function toTimelineEventForTimeline(event: TimelineEvent): TimelineEventForTimeline {
  return {
    id: event.id,
    title: event.title,
    dateBegin: event.dateBegin,
    dateEnd: event.dateEnd,
  };
}
