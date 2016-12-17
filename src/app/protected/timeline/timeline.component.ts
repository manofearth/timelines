import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/index';
import { TimelineGetAction } from '../../reducers/timeline.reducer';
import { ActivatedRouteSnapshot, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit, OnDestroy {

  private routeParamsSubscription: Subscription;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params: Params) => {
      this.store.dispatch(<TimelineGetAction>{
        type: 'ACTION_TIMELINE_GET',
        payload: params['id'],
      });
    });
  }

  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
  }
}
