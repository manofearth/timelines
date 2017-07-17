import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { TypeCreateAction } from './type-create-actions';
import { TypesGetAction } from './types-get-actions';
import { TypesState } from './types-states';
import { Subscription } from 'rxjs/Subscription';
import { TypesSelectorSearchService } from './types-selector-search.service';

@Component({
  selector: 'tl-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypesComponent implements OnInit, OnDestroy {

  state: TypesState;

  private stateSub: Subscription;

  constructor(
    public searchService: TypesSelectorSearchService,
    private store: Store<AppState>,
    private changeDetector: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {

    this.stateSub = this.store.select<TypesState>('types').subscribe(state => {
      this.state = state;
      this.changeDetector.markForCheck();
    });

    this.fetchTypes();
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }

  fetchTypes() {
    const action: TypesGetAction = {
      type: 'TYPES_GET',
    };

    this.store.dispatch(action);
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
