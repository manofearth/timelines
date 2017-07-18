import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SearchFieldService } from '../shared/search-field/search-field-service';
import { Subject } from 'rxjs/Subject';
import { AppState } from '../../reducers';
import { Store } from '@ngrx/store';
import { TypesGetAction } from './types-get-actions';
import { TimelineEventsTypeForList } from './types-states';
import 'rxjs/add/operator/map';

@Injectable()
export class TypesSearchService implements SearchFieldService {

  queryListener: Subject<string>;
  isSearching$: Observable<boolean>;
  results$: Observable<TimelineEventsTypeForList[]>;

  constructor(private store: Store<AppState>) {

    this.queryListener = new Subject<string>();

    this.queryListener
      .map<string, TypesGetAction>(query => ({
        type: 'TYPES_GET',
        payload: query
      }))
      .subscribe(this.store);

    this.isSearching$ = this.store
      .select<boolean>('types', 'isLoading');

    this.results$ = this.store
      .select<TimelineEventsTypeForList[]>('types', 'types');
  }
}
