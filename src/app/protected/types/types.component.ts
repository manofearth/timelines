import { Component, OnInit } from '@angular/core';
import { TypesSearchService } from './types-search.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { TypeCreateAction } from './type-actions';

@Component({
  selector: 'tl-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.css']
})
export class TypesComponent implements OnInit {

  constructor(
    public searchService: TypesSearchService,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
  }

  create(title: string) {
    const action: TypeCreateAction = {
      type: 'TYPE_CREATE',
      payload: {
        title: title,
      },
    };

    this.store.dispatch(action);
  }
}
