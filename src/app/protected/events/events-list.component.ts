import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppState } from '../../reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { getProp } from '../shared/helpers';
import { TimelineEventForList } from './events-list.reducer';
import { ComponentInitAction } from '../../shared/component-init-action';

@Component({
  selector: 'tl-events',
  templateUrl: './events-list.component.html',
  styleUrls: [ './events-list.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsListComponent implements OnInit {

  isSearching$: Observable<boolean>;
  searchQuery$: Observable<string>;
  hasError$: Observable<boolean>;
  errorMessage$: Observable<string>;
  isLoading$: Observable<boolean>;
  list$: Observable<TimelineEventForList[]>;

  searchFieldName: string = EVENTS_LIST_SEARCH_FIELD_NAME;

  constructor(
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.isSearching$ = this.store.select<boolean>(state => state.eventsList.isSearching);
    this.searchQuery$ = this.store.select<string>(state => state.eventsList.query);
    this.hasError$ = this.store.select<boolean>(state => state.eventsList.error !== null);
    this.errorMessage$ = this.store.select<string>(state => getProp(state.eventsList.error, 'message', ''));
    this.isLoading$ = this.store.select<boolean>(state => state.eventsList.isLoading);
    this.list$ = this.store.select<TimelineEventForList[]>(state => state.eventsList.list);

    this.dispatchInit();
  }

  private dispatchInit() {
    const action: ComponentInitAction = {
      type: 'COMPONENT_INIT',
      payload: {
        name: EVENTS_LIST_COMPONENT_NAME
      }
    };
    this.store.dispatch(action);
  }
}

export const EVENTS_LIST_SEARCH_FIELD_NAME = 'events-list-search-field';
export const EVENTS_LIST_COMPONENT_NAME = 'events-list-component';
