import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../reducers';
import { Store } from '@ngrx/store';
import { InfoSourceForList } from './info-sources-list.reducer';
import { getProp } from '../shared/helpers';
import { ComponentInitAction } from '../../shared/component-init-action';

@Component({
  selector: 'tl-info-sources-list',
  templateUrl: './info-sources-list.component.html',
  styleUrls: ['./info-sources-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoSourcesListComponent implements OnInit {

  searchFieldName: string = INFO_SOURCES_LIST_SEARCH_FIELD_NAME;

  searchQuery$: Observable<string>;
  isSearching$: Observable<boolean>;
  hasError$: Observable<boolean>;
  errorMessage$: Observable<string>;
  isLoading$: Observable<boolean>;
  list$: Observable<InfoSourceForList[]>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.isSearching$ = this.store.select(state => state.infoSourcesList.isSearching);
    this.searchQuery$ = this.store.select(state => state.infoSourcesList.query);
    this.hasError$ = this.store.select<boolean>(state => state.infoSourcesList.error !== null);
    this.errorMessage$ = this.store.select<string>(state => getProp(state.infoSourcesList.error, 'message', ''));
    this.isLoading$ = this.store.select<boolean>(state => state.infoSourcesList.isLoading);
    this.list$ = this.store.select<InfoSourceForList[]>(state => state.infoSourcesList.list);

    this.dispatchInit();
  }

  private dispatchInit() {
    const action: ComponentInitAction = {
      type: 'COMPONENT_INIT',
      payload: {
        name: INFO_SOURCES_LIST_COMPONENT_NAME
      }
    };
    this.store.dispatch(action);
  }

}

export const INFO_SOURCES_LIST_SEARCH_FIELD_NAME = 'info-sources-list-search-field';
export const INFO_SOURCES_LIST_COMPONENT_NAME = 'info-sources-list-component';
