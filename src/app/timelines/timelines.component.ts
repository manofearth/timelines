import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers/index';
import { AuthState } from '../reducers/auth.reducer';
import { Router } from '@angular/router';
import { TimelinesGetAction, Timeline } from '../reducers/timelines.reducer';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-timelines',
  templateUrl: './timelines.component.html',
  styleUrls: ['./timelines.component.css']
})
export class TimelinesComponent implements OnInit {

  timelines: Observable<Timeline[]>;

  constructor(private store: Store<AppState>, private router: Router) {
  }

  ngOnInit() {

    this.store.select<AuthState>('auth').subscribe((auth: AuthState) => {
      if (auth.user === null) {
        this.router.navigate(['/login']);
      }
    });

    this.timelines = this.store.select<Timeline[]>('timelines');

    this.store.dispatch(<TimelinesGetAction>{
      type: 'ACTION_TIMELINES_GET'
    })
  }

  logout() {
    this.store.dispatch({ type: 'ACTION_LOGOUT' });
  }

}
