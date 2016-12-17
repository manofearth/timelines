import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { TimelinesGetAction, TimelinesState, Timeline, TimelinesCreateAction } from '../../reducers/timelines.reducer';
import { AppState } from '../../reducers/index';
//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timelines',
  templateUrl: './timelines.component.html',
  styleUrls: ['./timelines.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelinesComponent implements OnInit, OnDestroy {

  private timelinesSubscription: Subscription;
  private timelines: Timeline[];
  private error: Error;
  private isLoading: boolean;
  private modeOpenNew: boolean = false;

  constructor(private store: Store<AppState>, private router: Router, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {

    this.timelinesSubscription = this.store.select<TimelinesState>('timelines').subscribe((state: TimelinesState) => {
      this.timelines = state.timelines;
      this.error = state.error;
      this.isLoading = state.isLoading;

      if (this.modeOpenNew && state.newTimelineId) {
        this.modeOpenNew = false;
        this.router.navigate(['/timeline/' + state.newTimelineId]);
      }

      this.changeDetector.markForCheck();

    });

    this.store.dispatch(<TimelinesGetAction>{
      type: 'ACTION_TIMELINES_GET'
    });
  }

  ngOnDestroy() {
    this.timelinesSubscription.unsubscribe();
  }

  create() {
    this.modeOpenNew = true;
    this.store.dispatch(<TimelinesCreateAction>{
      type: 'ACTION_TIMELINES_CREATE',
    });
  }

}
