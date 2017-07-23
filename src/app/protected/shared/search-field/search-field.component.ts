import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { Observable } from 'rxjs/Observable';

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
  }

  ngOnDestroy() {
    this.valueChangesSub.unsubscribe();
  }

  emitCreateEvent() {
    this.store.dispatch({
      type: 'SEARCH_FIELD_CREATE_BUTTON',
      payload: {
        name: this.name,
        value: this.inputControl.value
      }
    });
  }

  onEnterKey() {
    this.store.dispatch({
      type: 'SEARCH_FIELD_ENTER_KEY',
      payload: {
        name: this.name,
        value: this.inputControl.value
      }
    });
  }

  onArrowDownKey() {
    this.store.dispatch({
      type: 'SEARCH_FIELD_DOWN_KEY',
      payload: {
        name: this.name,
      }
    });
  }

  onArrowUpKey() {
    this.store.dispatch({
      type: 'SEARCH_FIELD_UP_KEY',
      payload: {
        name: this.name,
      }
    });
  }

  onEscKey() {
    this.store.dispatch({
      type: 'SEARCH_FIELD_ESC_KEY',
      payload: {
        name: this.name,
      }
    });
  }
}

const USER_INPUT_DEBOUNCE_TIME = 300;
