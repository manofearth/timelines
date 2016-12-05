import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers/index';
import { AuthState } from '../reducers/auth.reducer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timelines',
  templateUrl: './timelines.component.html',
  styleUrls: ['./timelines.component.css']
})
export class TimelinesComponent implements OnInit {

  constructor(private store: Store<AppState>, private router: Router) {
  }

  ngOnInit() {
    this.store.select('auth').subscribe((auth: AuthState) => {
      if (auth.user === null) {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.store.dispatch({ type: 'ACTION_LOGOUT' });
  }

}
