//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { EventStatus } from './event-states';
import { SelectorInputState } from '../shared/selector-input/selector-input-state';
import { TimelineEventsTypeLight } from '../types/types-states';
import { Observable } from 'rxjs/Observable';
import { TimelineDate } from '../shared/date/date';
import { TimelineEvent } from '../shared/event/timeline-event';
import { getPropSafely } from '../shared/helpers';
import { EventValidationState } from './reducers/event-validation.reducer';

@Component({
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventComponent implements OnInit, OnDestroy {

  typeSelectorName: string = EVENT_TYPE_SELECTOR_NAME;
  titleInputName: string = EVENT_TITLE_INPUT_NAME;
  dateBeginInputName: string = EVENT_DATE_BEGIN_INPUT_NAME;
  dateEndInputName: string = EVENT_DATE_END_INPUT_NAME;

  status$: Observable<EventStatus>;
  isTypeEmpty$: Observable<boolean>;
  isTitleEmpty$: Observable<boolean>;
  isDateBeginEmpty$: Observable<boolean>;
  isDateEndEmpty$: Observable<boolean>;
  isDateBeginGreaterEnd$: Observable<boolean>;
  isDateBeginNotValid$: Observable<boolean>;
  isDateEndNotValid$: Observable<boolean>;

  private typeSub: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.status$ = this.store.select(state => state.event.status);
    this.isTypeEmpty$ = this.store.select(selectValidationKey('emptyType'));
    this.isTitleEmpty$ = this.store.select(selectValidationKey('emptyTitle'));
    this.isDateBeginEmpty$ = this.store.select(selectValidationKey('emptyDateBegin'));
    this.isDateEndEmpty$ = this.store.select(selectValidationKey('emptyDateEnd'));
    this.isDateBeginGreaterEnd$ = this.store.select(selectValidationKey('periodBeginGreaterEnd'));
    this.isDateBeginNotValid$ = this.store.select(
      some(selectValidationKey('emptyDateBegin'), selectValidationKey('periodBeginGreaterEnd'))
    );
    this.isDateEndNotValid$ = this.store.select(
      some(selectValidationKey('emptyDateEnd'), selectValidationKey('periodBeginGreaterEnd'))
    );
  }

  ngOnDestroy() {
    if (this.typeSub) {
      this.typeSub.unsubscribe();
    }
  }

  save() {
    this.store.select(state => state.event.event).take(1).subscribe(event => {
      const action: EventSaveButtonAction = {
        type: 'EVENT_SAVE_BUTTON',
        payload: event,
      };
      this.store.dispatch(action);
      this.activeModal.close();
    });
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  selectTypeSelectorState(appState: AppState): SelectorInputState<TimelineEventsTypeLight> {
    return appState.event.typeSelector;
  }

  selectTitle(appState: AppState): string {
    return getPropSafely<TimelineEvent>(appState.event.event, 'title', '');
  }

  selectDateBegin(appState: AppState): TimelineDate {
    return getPropSafely<TimelineEvent>(appState.event.event, 'dateBegin', null);
  }

  selectDateEnd(appState: AppState): TimelineDate {
    return getPropSafely<TimelineEvent>(appState.event.event, 'dateEnd', null);
  }
}

export const EVENT_TYPE_SELECTOR_NAME = 'event-type-selector';
export const EVENT_TITLE_INPUT_NAME = 'event-title-input';
export const EVENT_DATE_BEGIN_INPUT_NAME = 'event-date-begin-input';
export const EVENT_DATE_END_INPUT_NAME = 'event-date-end-input';

export interface EventSaveButtonAction extends Action {
  type: 'EVENT_SAVE_BUTTON';
  payload: TimelineEvent;
}

function selectValidationKey(key: keyof EventValidationState) {
  return (state: AppState) => getPropSafely<EventValidationState>(state.event.validation, key, false);
}

function some(predicate1: (state: AppState) => boolean, predicate2: (state: AppState) => boolean) {
  return (state: AppState) => predicate1(state) || predicate2(state);
}
