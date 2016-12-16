import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { TimelinesGetAction, TimelinesState, Timeline } from '../../reducers/timelines.reducer';
import { AppState } from '../../reducers/index';
//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';

@Component({
  selector: 'app-timelines',
  templateUrl: './timelines.component.html',
  styleUrls: ['./timelines.component.css']
})
export class TimelinesComponent implements OnInit, OnDestroy {

  timelinesSubscription: Subscription;
  timelines: Timeline[];
  error: Error;
  isLoading: boolean;
  newTimelineId: string;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {

    this.timelinesSubscription = this.store.select<TimelinesState>('timelines').subscribe((state: TimelinesState) => {
      this.timelines = state.timelines;
      this.error = state.error;
      this.isLoading = state.isLoading;
      this.newTimelineId = state.newTimelineId;
    });

    this.store.dispatch(<TimelinesGetAction>{
      type: 'ACTION_TIMELINES_GET'
    })
  }

  ngOnDestroy(): void {
    this.timelinesSubscription.unsubscribe();
  }
}
