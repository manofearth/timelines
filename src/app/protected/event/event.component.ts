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
import { getProp, getPropDeep } from '../shared/helpers';
import { EventValidationState } from './reducers/event-validation.reducer';
import { TypeKind } from '../type/type-states';
import { SearchableListState } from '../shared/searchable-list/searchable-list.reducer';
import { InfoSourceForList } from '../info-sources/info-sources-list.reducer';

@Component({
  templateUrl: './event.component.html',
  styleUrls: [ './event.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventComponent implements OnInit, OnDestroy {

  typeSelectorName: string = EVENT_TYPE_SELECTOR_NAME;
  titleInputName: string = EVENT_TITLE_INPUT_NAME;
  dateBeginInputName: string = EVENT_DATE_BEGIN_INPUT_NAME;
  dateEndInputName: string = EVENT_DATE_END_INPUT_NAME;
  infoSourceSearchableListName: string = EVENT_INFO_SOURCE_SEARCHABLE_LIST_NAME;

  status$: Observable<EventStatus>;
  isTypeEmpty$: Observable<boolean>;
  isTitleEmpty$: Observable<boolean>;
  isDateBeginEmpty$: Observable<boolean>;
  isDateEndEmpty$: Observable<boolean>;
  isDateBeginGreaterEnd$: Observable<boolean>;
  isDateBeginNotValid$: Observable<boolean>;
  isDateEndNotValid$: Observable<boolean>;
  kind$: Observable<TypeKind>;
  attachedToTimelinesCount$: Observable<number>;

  isDeleteConfirmationVisible: boolean = false;
  isSelectInfoSourceListVisible: boolean = false;

  private typeSub: Subscription;

  constructor(
    public modal: NgbActiveModal,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.status$ = this.store.select(state => state.event.status);
    this.kind$ = this.store.select(state => getPropDeep(state.event, 'typeSelector.selectedItem.item.kind', 'period'));
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
    this.attachedToTimelinesCount$ = this.store.select(state => Object.keys(state.event.event.timelines).length);
  }

  ngOnDestroy() {
    if (this.typeSub) {
      this.typeSub.unsubscribe();
    }
  }

  onSaveButtonClick() {
    this.store.select<AppState>(state => state).take(1).subscribe(state => {
      const action: EventSaveButtonAction = {
        type: 'EVENT_SAVE_BUTTON',
        payload: {
          event: state.event.event,
        },
      };
      if (state.timeline.timeline) {
        action.payload.timelineId = state.timeline.timeline.id;
        action.payload.groupId = state.timeline.timeline.groups[ state.timeline.currentGroupIndex ].id;
      }
      this.store.dispatch(action);
      this.modal.close();
    });
  }

  onDeleteButtonClick() {
    this.isDeleteConfirmationVisible = true;
  }

  onDeleteConfirmNoClick() {
    this.isDeleteConfirmationVisible = false;
  }

  onDeleteConfirmYesClick() {
    this.store.select<string>(state => state.event.event.id).take(1).subscribe(id => {
      const action: EventDeleteButtonAction = {
        type: 'EVENT_DELETE_BUTTON',
        payload: {
          eventId: id
        }
      };
      this.store.dispatch(action);
      this.modal.close();
    });
  }

  onAddInfoSourceButtonClick() {
    const action: EventAddInfoSourceButtonAction = {
      type: 'EVENT_ADD_INFO_SOURCE_BUTTON',
    };
    this.store.dispatch(action);
    this.isSelectInfoSourceListVisible = true;
  }

  selectTypeSelectorState(appState: AppState): SelectorInputState<TimelineEventsTypeLight> {
    return appState.event.typeSelector;
  }

  selectTitle(appState: AppState): string {
    return getProp(appState.event.event, 'title', '');
  }

  selectDateBegin(appState: AppState): TimelineDate {
    return getProp(appState.event.event, 'dateBegin', null);
  }

  selectDateEnd(appState: AppState): TimelineDate {
    return getProp(appState.event.event, 'dateEnd', null);
  }

  selectInfoSourceSearchableListState(appState: AppState): SearchableListState<InfoSourceForList> {
    return appState.event.infoSourceSelector;
  }
}

export const EVENT_TYPE_SELECTOR_NAME = 'event-type-selector';
export const EVENT_TITLE_INPUT_NAME = 'event-title-input';
export const EVENT_DATE_BEGIN_INPUT_NAME = 'event-date-begin-input';
export const EVENT_DATE_END_INPUT_NAME = 'event-date-end-input';
export const EVENT_INFO_SOURCE_SEARCHABLE_LIST_NAME = 'event-info-source-searchable-list';

export interface EventSaveButtonAction extends Action {
  type: 'EVENT_SAVE_BUTTON';
  payload: {
    timelineId?: string;
    groupId?: string;
    event: TimelineEvent
  };
}

export interface EventDeleteButtonAction extends Action {
  type: 'EVENT_DELETE_BUTTON';
  payload: {
    eventId: string;
  }
}

export interface EventAddInfoSourceButtonAction extends Action {
  type: 'EVENT_ADD_INFO_SOURCE_BUTTON';
}

function selectValidationKey(key: keyof EventValidationState) {
  return (state: AppState) => getProp(state.event.validation, key, false);
}

function some(predicate1: (state: AppState) => boolean, predicate2: (state: AppState) => boolean) {
  return (state: AppState) => predicate1(state) || predicate2(state);
}
