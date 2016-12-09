import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Timeline, TimelinesGetAction } from '../../reducers/timelines.reducer';
import { AppState } from '../../reducers/index';

@Component({
  selector: 'app-timelines',
  templateUrl: 'timelines.component.html',
  styleUrls: ['timelines.component.css']
})
export class TimelinesComponent implements OnInit {

  timelines: Observable<Timeline[]>;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {

    this.timelines = this.store.select<Timeline[]>('timelines');

    this.store.dispatch(<TimelinesGetAction>{
      type: 'ACTION_TIMELINES_GET'
    })
  }

  logout() {
    this.store.dispatch({ type: 'ACTION_LOGOUT' });
  }

}
