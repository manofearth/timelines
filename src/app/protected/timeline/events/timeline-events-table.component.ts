import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { TimelineEvent } from '../../shared/timeline-event';
import { TimelineEventsSearchService } from '../timeline-events-search.service';

@Component({
  selector: 'tl-events-table',
  templateUrl: './timeline-events-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineEventTableComponent {

  @Input() groupIndex: number;

  @Output() create: EventEmitter<string> = new EventEmitter();
  @Output() open: EventEmitter<string> = new EventEmitter();
  @Output() attach: EventEmitter<string> = new EventEmitter();
  @Output() detach: EventEmitter<string> = new EventEmitter();

  events: TimelineEvent[] = [];

  constructor(
    public store: Store<AppState>,
    public eventsSearchService: TimelineEventsSearchService,
  ) {
  }
}
