//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { EventStatus } from './event-states';
import { SelectorInputState } from '../shared/selector-input/selector-input-state';
import { TimelineEventsTypeForList } from '../types/types-states';
import { Observable } from 'rxjs/Observable';
import { TimelineEvent } from '../shared/timeline-event';

@Component({
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventComponent implements OnInit, OnDestroy {

  typeSelectorName: string = EVENT_TYPE_SELECTOR_NAME;
  titleInputName: string = EVENT_TITLE_INPUT_NAME;

  status$: Observable<EventStatus>;

  attachTo: { timelineId: string, groupId: string } = null;

  private typeSub: Subscription;
  private eventStateSub: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.status$ = this.store.select(state => state.event.status);

    this.eventStateSub = this.store
      .select<TimelineEvent>(state => state.event.event)
      .filter(event => event !== null)
      .map<TimelineEvent, EventChangedAction>(event => ({
        type: 'EVENT_CHANGED',
        payload: event,
      }))
      .subscribe(this.store);
  }

  ngOnDestroy() {
    this.eventStateSub.unsubscribe();
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
    return appState.event.event.title;
  }
}

export const EVENT_TYPE_SELECTOR_NAME = 'event-type-selector';
export const EVENT_TITLE_INPUT_NAME = 'event-title-input';

export interface EventChangedAction extends Action {
  type: 'EVENT_CHANGED';
  payload: TimelineEvent;
}
