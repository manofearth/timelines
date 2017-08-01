import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/combineLatest';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { Observable } from 'rxjs/Observable';
import {
  SearchFieldCreateButtonAction,
  SearchFieldDownKeyAction,
  SearchFieldEnterKeyAction,
  SearchFieldEscKeyAction,
  SearchFieldUpKeyAction
} from './search-field-actions';

@Component({
  selector: 'tl-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldComponent implements OnInit, OnDestroy {

  @Input() name: string;
  @Input() placeholder: string;
  @Input() isSearching$: Observable<boolean> = Observable.of(false);
  @Input() searchQuery$: Observable<string> = Observable.of('');

  @ViewChild('searchInput') searchInput: ElementRef;

  inputControl: FormControl;

  isCreateButtonHidden$: Observable<boolean>;

  private valueChangesSub: Subscription;
  private querySub: Subscription;

  constructor(
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.inputControl = new FormControl();

    this.valueChangesSub = this.inputControl.valueChanges
      .debounceTime(USER_INPUT_DEBOUNCE_TIME)
      .map(value => ({
        type: 'SEARCH_FIELD_INPUT',
        payload: {
          name: this.name,
          value: value,
        }
      }))
      .subscribe(this.store);

    this.querySub = this.searchQuery$.subscribe(query => {
      this.inputControl.setValue(query, { emitEvent: false });
    });

    this.isCreateButtonHidden$ = Observable
      .combineLatest<boolean, boolean>(this.isSearching$, this.searchQuery$.map(query => query.length !== 0))
      .map(([isSearching, hasQuery]) => !hasQuery || isSearching);
  }

  ngOnDestroy() {
    this.valueChangesSub.unsubscribe();
    this.querySub.unsubscribe();
  }

  emitCreateEvent() {
    const action: SearchFieldCreateButtonAction = {
      type: 'SEARCH_FIELD_CREATE_BUTTON',
      payload: {
        name: this.name,
        value: this.inputControl.value
      }
    };
    this.store.dispatch(action);
  }

  onEnterKey() {
    const action: SearchFieldEnterKeyAction = {
      type: 'SEARCH_FIELD_ENTER_KEY',
      payload: {
        name: this.name,
        value: this.inputControl.value
      }
    };
    this.store.dispatch(action);
  }

  onArrowDownKey() {
    const action: SearchFieldDownKeyAction = {
      type: 'SEARCH_FIELD_DOWN_KEY',
      payload: {
        name: this.name,
      }
    };
    this.store.dispatch(action);
  }

  onArrowUpKey() {
    const action: SearchFieldUpKeyAction = {
      type: 'SEARCH_FIELD_UP_KEY',
      payload: {
        name: this.name,
      }
    };
    this.store.dispatch(action);
  }

  onEscKey() {
    const action: SearchFieldEscKeyAction = {
      type: 'SEARCH_FIELD_ESC_KEY',
      payload: {
        name: this.name,
      }
    };
    this.store.dispatch(action);
  }

  focus() {
    this.searchInput.nativeElement.focus();
  }
}

const USER_INPUT_DEBOUNCE_TIME = 300;
