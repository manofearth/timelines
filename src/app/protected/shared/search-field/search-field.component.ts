import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
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

  inputControl: FormControl;

  isSearching$: Observable<boolean>;

  private valueChangesSub: Subscription;
  private querySub: Subscription;

  constructor(private store: Store<AppState>) {
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

    this.isSearching$ = this.store.select('selectors', this.name, 'isSearching');

    this.querySub = this.store
      .select(this.pickSearchQuery.bind(this))
      .subscribe(query => {
        this.inputControl.setValue(query, { emitEvent: false });
      });
  }

  ngOnDestroy() {
    this.valueChangesSub.unsubscribe();
    this.querySub.unsubscribe();
  }

  pickSearchQuery(state: AppState) {
    if (state.selectors[this.name]) {
      return state.selectors[this.name].query;
    } else {
      return '';
    }
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
}

const USER_INPUT_DEBOUNCE_TIME = 300;
