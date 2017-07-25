import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { TimelineEvent } from '../../shared/timeline-event';
import { Observable } from 'rxjs/Observable';
import { Actions } from '@ngrx/effects';
import { EventAttachToTimelineAction } from '../../event/event-actions';
import { Timeline } from '../timeline-states';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { SearchFieldInputAction } from '../../shared/search-field/search-field-actions';
import { EventsSearchAction } from '../../events/effects/events-elastic-search.effect';
import { SelectorInputSelectAction } from '../../shared/selector-input/selector-input.component';

@Component({
  selector: 'tl-events-table',
  templateUrl: './timeline-events-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineEventTableComponent implements OnInit, OnDestroy {

  @Input() groupIndex: number;

  @Output() create: EventEmitter<string> = new EventEmitter();
  @Output() open: EventEmitter<string> = new EventEmitter();
  @Output() attach: EventEmitter<string> = new EventEmitter();
  @Output() detach: EventEmitter<string> = new EventEmitter();

  event$: Observable<TimelineEvent[]>;

  private eventSelectSub: Subscription;
  private searchEventsSub: Subscription;

  constructor(
    public store: Store<AppState>,
    private actions: Actions,
  ) {
  }

  ngOnInit() {
    this.event$ = this.store.select('timeline', 'timeline', 'groups', this.groupIndex.toString(), 'events');

    this.attachToTimelineOnSelect();
    this.searchEventOnSearchFieldInput();
  }

  ngOnDestroy() {
    this.eventSelectSub.unsubscribe();
    this.searchEventsSub.unsubscribe();
  }

  trackByEventRow(ignore: number, event: TimelineEvent) {
    return event.id;
  }

  get eventSelectorName() {
    return 'timeline-events-selector_group_' + this.groupIndex;
  }

  private attachToTimelineOnSelect() {
    this.eventSelectSub = this.actions
      .ofType('SELECTOR_INPUT_SELECT')
      .filter<SelectorInputSelectAction>(action => action.payload.name === this.eventSelectorName)
      .withLatestFrom(this.store.select<Timeline>('timeline', 'timeline'))
      .map(([action, timeline]): EventAttachToTimelineAction => ({
        type: 'EVENT_ATTACH_TO_TIMELINE',
        payload: {
          timelineId: timeline.id,
          groupId: timeline.groups[this.groupIndex].id,
          eventId: action.payload.item.id,
        }
      }))
      .subscribe(this.store);
  }

  private searchEventOnSearchFieldInput() {
    this.searchEventsSub = this.actions
      .ofType('SEARCH_FIELD_INPUT')
      .filter<SearchFieldInputAction>(action => action.payload.name === this.eventSelectorName)
      .map<SearchFieldInputAction, EventsSearchAction>(action => ({
        type: 'EVENTS_SEARCH',
        payload: {
          name: this.eventSelectorName,
          query: action.payload.value
        }
      }))
      .subscribe(this.store);
  }
}
