import {
  ChangeDetectionStrategy, Component, DoCheck, ElementRef, Input, OnDestroy, OnInit,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { Observable } from 'rxjs/Observable';
import {
  SearchFieldBaseAction,
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
export class SearchFieldComponent implements OnInit, OnDestroy, DoCheck {

  @Input() name: string;
  @Input() placeholder: string;
  @Input() isSearching$: Observable<boolean> = Observable.of(false);
  @Input() searchQuery$: Observable<string> = Observable.of('');
  @Input() focusOnShown: boolean = false;

  @ViewChild('searchInput') searchInput: ElementRef;

  inputControl: FormControl;

  isCreateButtonHidden$: Observable<boolean>;

  private valueChangesSub: Subscription;
  private querySub: Subscription;
  private inputBecomeVisible: boolean = false;

  constructor(
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {

    this.inputControl = new FormControl();

    this.valueChangesSub = this.inputControl.valueChanges
      .debounceTime(USER_INPUT_DEBOUNCE_TIME)
      .distinctUntilChanged()
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

  ngDoCheck() {
    if (!this.inputBecomeVisible) {
      if (this.searchInput.nativeElement.offsetParent !== null) {
        this.inputBecomeVisible = true;
        if (this.focusOnShown) {
          this.searchInput.nativeElement.focus();
        }
      }
    }
  }

  emitCreateEvent() {
    this.dispatchAction<SearchFieldCreateButtonAction>(
      'SEARCH_FIELD_CREATE_BUTTON',
      { value: this.inputControl.value }
    );
  }

  onEnterKey() {
    this.dispatchAction<SearchFieldEnterKeyAction>(
      'SEARCH_FIELD_ENTER_KEY',
      { value: this.inputControl.value }
    );
  }

  onArrowDownKey() {
    this.dispatchAction<SearchFieldDownKeyAction>('SEARCH_FIELD_DOWN_KEY');
  }

  onArrowUpKey() {
    this.dispatchAction<SearchFieldUpKeyAction>('SEARCH_FIELD_UP_KEY');
  }

  onEscKey() {
    this.dispatchAction<SearchFieldEscKeyAction>('SEARCH_FIELD_ESC_KEY');
  }

  private dispatchAction<TAction extends SearchFieldBaseAction>(type: TAction['type'], payload: Object = {}) {
    this.store.dispatch({
      type,
      payload: {
        name: this.name,
        ...payload
      }
    });
  }
}

const USER_INPUT_DEBOUNCE_TIME = 300;
