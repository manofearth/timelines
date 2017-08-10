//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { EventStatus } from './event-states';
import { SelectorInputState } from '../shared/selector-input/selector-input-state';
import { TimelineEventsTypeForList } from '../types/types-states';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventComponent implements OnInit, OnDestroy {

  typeSelectorName: string = EVENT_TYPE_SELECTOR_NAME;
  titleInputName: string = EVENT_TITLE_INPUT_NAME;

  status$: Observable<EventStatus>;
  isTitleEmpty$: Observable<boolean>;

  attachTo: { timelineId: string, groupId: string } = null;

  private typeSub: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.status$ = this.store.select(state => state.event.status);
    this.isTitleEmpty$ = this.store.select(state => state.event.validation.emptyTitle);
  }

  ngOnDestroy() {
    if (this.typeSub) {
      this.typeSub.unsubscribe();
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  mapEventSelectorState(appState: AppState): SelectorInputState<TimelineEventsTypeForList> {
    return appState.event.typeSelector;
  }

  mapTitleState(appState: AppState): string {
    return appState.event.event ? appState.event.event.title : '';
  }
}

export const EVENT_TYPE_SELECTOR_NAME = 'event-type-selector';
export const EVENT_TITLE_INPUT_NAME = 'event-title-input';
