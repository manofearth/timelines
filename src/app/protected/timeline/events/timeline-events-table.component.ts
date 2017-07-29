import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { TimelineEvent } from '../../shared/timeline-event';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { SelectorSearchResultItem } from '../../shared/selector-input/selector-search-result-item';
import { SelectorState } from '../../shared/selector-input/selector-state';

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

  private eventSelectedSub: Subscription;

  constructor(
    public store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.event$ = this.store.select(state => state.timeline.timeline.groups[this.groupIndex].events);

    this.eventSelectedSub = this.store
      .select<SelectorSearchResultItem>(state => state.timeline.eventsSelector.selectedItem)
      .filter(item => item !== null)
      .map((selectedItem): TimelineEventSelectedAction => ({
        type: 'TIMELINE_EVENT_SELECTED',
        payload: { id: selectedItem.item.id },
      }))
      .subscribe(this.store);
  }

  ngOnDestroy() {
    this.eventSelectedSub.unsubscribe();
  }

  trackByEventRow(ignore: number, event: TimelineEvent) {
    return event.id;
  }

  get eventSelectorName() {
    return TIMELINE_EVENTS_SELECTOR_NAME_PREFIX + this.groupIndex;
  }

  eventSelectorStateMap(state: AppState): SelectorState {
    return state.timeline.eventsSelector;
  }
}

export const TIMELINE_EVENTS_SELECTOR_NAME_PREFIX = 'timeline-events-selector-';

export interface TimelineEventSelectedAction extends Action {
  type: 'TIMELINE_EVENT_SELECTED';
  payload: {
    id: string;
  }
}
