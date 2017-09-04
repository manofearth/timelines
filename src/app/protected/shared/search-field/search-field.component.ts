import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromEvent';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { Observable } from 'rxjs/Observable';
import {
  SearchFieldBaseAction,
  SearchFieldBlurAction,
  SearchFieldCreateAction,
  SearchFieldDownKeyAction,
  SearchFieldEnterKeyAction,
  SearchFieldEscKeyAction,
  SearchFieldInputAction,
  SearchFieldUpKeyAction
} from './search-field-actions';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'tl-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: [ './search-field.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldComponent implements OnInit, OnDestroy, DoCheck {

  @Input() name: string;
  @Input() placeholder: string;
  @Input() isSearching$: Observable<boolean> = Observable.of(false);
  @Input() searchQuery$: Observable<string> = Observable.of('');
  @Input() createByEnterKey$: Observable<boolean>;
  @Input() focusOnShown: boolean = false;

  @ViewChild('searchInput') searchInput: ElementRef;

  isCreateButtonHidden$: Observable<boolean>;

  private valueChangesSub: Subscription;
  private isVisibleSubject: Subject<boolean>;
  private focusSub: Subscription;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {

    this.isVisibleSubject = new Subject();

    this.valueChangesSub = Observable
      .fromEvent<Event>(this.searchInput.nativeElement, 'input')
      .map(event => event.target[ 'value' ])
      .debounceTime(USER_INPUT_DEBOUNCE_TIME)
      .distinctUntilChanged()
      .map<string, SearchFieldInputAction>(value => ({
        type: 'SEARCH_FIELD_INPUT',
        payload: {
          name: this.name,
          value: value,
        }
      }))
      .subscribe(this.store);

    this.isCreateButtonHidden$ = Observable
      .combineLatest<boolean, boolean>(this.isSearching$, this.searchQuery$.map(query => query.length !== 0))
      .do(([ isSearching, hasQuery ]) => console.log(isSearching, hasQuery))
      .map(([ isSearching, hasQuery ]) => !hasQuery || isSearching);

    this.focusSub = this.isVisibleSubject
      .distinctUntilChanged()
      .subscribe(isVisible => {
        if (isVisible && this.focusOnShown) {
          this.searchInput.nativeElement.focus();
        }
      });
  }

  ngOnDestroy() {
    this.valueChangesSub.unsubscribe();
    this.focusSub.unsubscribe();
  }

  ngDoCheck() {
    this.isVisibleSubject.next(this.searchInput.nativeElement.offsetParent !== null);
  }

  onCreateButtonClick() {
    this.dispatchActionWithCurrentValue<SearchFieldCreateAction>('SEARCH_FIELD_CREATE');
  }

  onEnterKey() {
    this.createByEnterKey$.take(1).subscribe(createByEnter => {
      if (createByEnter) {
        this.dispatchActionWithCurrentValue<SearchFieldCreateAction>('SEARCH_FIELD_CREATE');
      } else {
        this.dispatchActionWithCurrentValue<SearchFieldEnterKeyAction>('SEARCH_FIELD_ENTER_KEY');
      }
    });
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

  onBlur() {
    this.dispatchAction<SearchFieldBlurAction>('SEARCH_FIELD_BLUR');
  }

  private dispatchActionWithCurrentValue<TAction extends SearchFieldBaseAction>(type: TAction['type']) {
    this.searchQuery$
      .take(1)
      .subscribe(query => {
        this.dispatchAction<TAction>(
          type,
          { value: query }
        );
      });
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
