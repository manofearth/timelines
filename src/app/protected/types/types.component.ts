import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { TypesState } from './types-states';
import { Subscription } from 'rxjs/Subscription';
import { TypeGetAction } from '../type/type-get-actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeComponent } from '../type/type.component';
import { TypeEraseAction } from '../type/type-erase-action';
import { Observable } from 'rxjs/Observable';
import { ComponentInitAction } from '../../shared/component-init-action';

@Component({
  selector: 'tl-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypesComponent implements OnInit, OnDestroy {

  state: TypesState;

  isSearching$: Observable<boolean>;
  searchQuery$: Observable<string>;
  createByEnterKey$: Observable<boolean>;

  searchFieldName: string = TYPES_SEARCH_FIELD_NAME;

  private stateSub: Subscription;

  constructor(
    private store: Store<AppState>,
    private changeDetector: ChangeDetectorRef,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit() {

    this.stateSub = this.store.select<TypesState>('types').subscribe(state => {
      this.state = state;
      this.changeDetector.markForCheck();
    });

    this.isSearching$ = this.store.select<boolean>(state => state.types.isSearching);
    this.searchQuery$ = this.store.select<string>(state => state.types.query);
    this.createByEnterKey$ = this.store.select<boolean>(state => !state.types.isSearching);

    this.fetchTypes();
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }

  fetchTypes() {
    const action: ComponentInitAction = {
      type: 'COMPONENT_INIT',
      payload: {
        name: TYPES_COMPONENT_NAME,
      }
    };

    this.store.dispatch(action);
  }

  openType(e: Event, typeId: string) {
    e.preventDefault();

    const action: TypeGetAction = {
      type: 'TYPE_GET',
      payload: typeId
    };

    this.store.dispatch(action);

    this.modalService.open(TypeComponent, { size: 'lg' }).result.then(
      () => {
        this.dispatchTypeErase()
      },
      () => {
        this.dispatchTypeErase()
      },
    );
  }

  private dispatchTypeErase() {
    const action: TypeEraseAction = {
      type: 'TYPE_ERASE'
    };

    this.store.dispatch(action);
  }
}

export const TYPES_SEARCH_FIELD_NAME = 'types-search-field';
export const TYPES_COMPONENT_NAME = 'types-component';
