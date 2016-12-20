//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/index';
import { TimelineGetAction, TimelineState, Timeline } from './timeline.reducer';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit, OnDestroy {

  private routeParamsSubscription: Subscription;
  private stateSubscription: Subscription;
  private timeline: Timeline;
  private isLoading: boolean;
  private error: Error;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params: Params) => {
      this.store.dispatch(<TimelineGetAction>{
        type: 'ACTION_TIMELINE_GET',
        payload: params['id'],
      });
    });

    this.stateSubscription = this.store.select('timeline').subscribe((timeline: TimelineState) => {
      this.isLoading = timeline.isLoading;
      this.error = timeline.error;
      this.timeline = timeline.timeline;
    });
  }

  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
  }
}
