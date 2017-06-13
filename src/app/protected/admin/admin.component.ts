import { Component } from '@angular/core';
import { AppState } from '../../reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tl-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent {

  constructor(private store: Store<AppState>) {}

  refreshEventsSearchIndex() {
    this.store.dispatch({
      type: 'ADMIN_REFRESH_EVENTS_SEARCH_INDEX'
    });
  }
}
