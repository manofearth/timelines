import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { TimelineEvent } from '../../shared/timeline-event';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'tl-events-table',
  templateUrl: './timeline-events-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineEventTableComponent implements OnInit {

  @Input() groupIndex: number;

  @Output() create: EventEmitter<string> = new EventEmitter();
  @Output() open: EventEmitter<string> = new EventEmitter();
  @Output() attach: EventEmitter<string> = new EventEmitter();
  @Output() detach: EventEmitter<string> = new EventEmitter();

  event$: Observable<TimelineEvent[]>;

  constructor(
    public store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.event$ = this.store.select('timeline', 'timeline', 'groups', this.groupIndex.toString(), 'events')
  }

  trackByEventRow(ignore: number, event: TimelineEvent) {
    return event.id;
  }
}
