//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import {
  TimelineChangeCurrentGroupAction,
  TimelineChangedAction,
  TimelineCreateGroupAction,
  TimelineGetAction
} from './timeline-actions';
import { Timeline, TimelineChangedPayload, TimelineEventsGroup, TimelineState } from './timeline-states';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { EventComponent } from '../event/event.component';
import { EventAttachToTimelineAction, EventDetachAction, EventEraseAction } from '../event/event-actions';
import { toInt } from '../../shared/helpers';
import { GroupComponent } from '../group/group.component';
import { TIMELINE_EVENTS_SELECTOR_NAME_PREFIX } from './events/timeline-events-table.component';
import { SelectorInputCreateAction } from '../shared/selector-input/selector-input.component';
import { Actions } from '@ngrx/effects';

@Component({
  templateUrl: './timeline.component.html',
  styleUrls: [ './timeline.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnInit, OnDestroy {

  timeline: Timeline;
  currentGroupIndex: number;
  isLoading: boolean;
  isSaving: boolean;
  error: Error;

  form: TimelineForm;
  addNewGroupTabId: string = ADD_NEW_GROUP_TAB_ID;

  private timelineStateSub: Subscription;
  private formChangesSub: Subscription;
  private createSub: Subscription;

  //noinspection OverlyComplexFunctionJS
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private titleService: Title,
    private modalService: NgbModal,
    private actions: Actions,
  ) {
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.store.dispatch(<TimelineGetAction>{
        type: 'TIMELINE_GET',
        payload: params[ 'id' ],
      });
    }); // no need to unsubscribe router observables - router takes care of it

    this.timelineStateSub = this.store
      .select('timeline')
      .subscribe((timeline: TimelineState) => {
        this.isLoading = timeline.isLoading;
        this.isSaving = timeline.isSaving;
        this.error = timeline.error;
        this.timeline = timeline.timeline;
        this.currentGroupIndex = timeline.currentGroupIndex;

        if (this.timeline) {
          this.updateTitle();

          if (!this.form) {
            this.initForm(timeline.timeline);
          }
        }

        this.changeDetector.markForCheck();

      });

    this.createSub = this.actions
      .ofType('SELECTOR_INPUT_CREATE')
      .filter<SelectorInputCreateAction>(action => action.payload.name.startsWith(TIMELINE_EVENTS_SELECTOR_NAME_PREFIX))
      .subscribe(action => {
        this.dispatchEventFromTimelineCreateAction(action.payload.value);
        this.openTimelineEvent();
      });
  }

  ngOnDestroy() {
    this.timelineStateSub.unsubscribe();
    this.createSub.unsubscribe();
    if (this.formChangesSub) {
      this.formChangesSub.unsubscribe();
    }
  }

  openTimelineEvent() {
    this.modalService.open(EventComponent, { size: 'lg' }).result.then(
      () => {
        this.dispatchEventEraseAction();
      },
      () => {
        this.dispatchEventEraseAction();
      },
    );
  }

  attachEvent(eventId: string, groupId: string) {

    const action: EventAttachToTimelineAction = {
      type: 'EVENT_ATTACH_TO_TIMELINE',
      payload: {
        timelineId: this.timeline.id,
        eventId: eventId,
        groupId: groupId,
      }
    };

    this.store.dispatch(action);
  }

  detachEvent(eventId: string, groupId: string) {

    const action: EventDetachAction = {
      type: 'EVENT_DETACH',
      payload: {
        timelineId: this.timeline.id,
        eventId: eventId,
        groupId: groupId,
      }
    };

    this.store.dispatch(action);
  }

  onBarSelect() {
    this.openTimelineEvent();
  }

  onTabChange(event: NgbTabChangeEvent) {
    if (event.nextId === this.addNewGroupTabId) {
      event.preventDefault();
      this.createGroup();
    } else {
      this.setCurrentGroupIndex(this.extractTabIndex(event.nextId));
    }
  }

  setCurrentGroupIndex(index: number) {
    const action: TimelineChangeCurrentGroupAction = {
      type: 'TIMELINE_CHANGE_CURRENT_GROUP',
      payload: index,
    };

    this.store.dispatch(action);
  }

  createGroup() {
    const action: TimelineCreateGroupAction = {
      type: 'TIMELINE_CREATE_GROUP',
      payload: this.timeline.id,
    };

    this.store.dispatch(action);
  }

  generateTabId(index: number): string {
    return GROUP_TAB_ID_PREFIX + index;
  }

  extractTabIndex(tabId: string): number {
    return toInt(EXTRACT_INDEX_FROM_GROUP_TAB_ID_REGEX.exec(tabId)[ 1 ]);
  }

  get currentTabId(): string {
    return this.generateTabId(this.currentGroupIndex);
  }

  groupTrackBy(ignore: number, group: TimelineEventsGroup) {
    return group.id;
  }

  openGroupModal(groupId: string) {
    const modal = this.modalService.open(GroupComponent, { size: 'sm' });
    const component = modal.componentInstance as GroupComponent;
    component.timelineId = this.timeline.id;
    component.groupId = groupId;
  }

  private dispatchEventEraseAction() {
    this.store.dispatch(<EventEraseAction> {
      type: 'EVENT_ERASE',
    });
  }

  private dispatchEventFromTimelineCreateAction(eventTitle: string) {
    const action: EventFromTimelineCreateAction = {
      type: 'EVENT_FROM_TIMELINE_CREATE',
      payload: {
        eventTitle: eventTitle,
        timelineId: this.timeline.id,
      }
    };
    this.store.dispatch(action);
  }

  private initForm(timeline: Timeline) {
    this.form = <TimelineForm>this.fb.group({
      title: timeline.title,
    });

    this.formChangesSub = this.form.valueChanges
      .subscribe((value: TimelineFormValue) => {
        this.store.dispatch(<TimelineChangedAction>{
          type: 'TIMELINE_CHANGED',
          payload: toTimeline(this.timeline, value),
        });
      });
  }

  private updateTitle() {
    this.titleService.setTitle((this.isSaving ? '*' : '') + this.timeline.title);
  }

}

export interface TimelineForm extends FormGroup {
  controls: {
    title: FormControl;
  };
}

export interface TimelineFormValue {
  title: string;
}

function toTimeline(oldTimeline: Timeline, formValue: TimelineFormValue): TimelineChangedPayload {
  return {
    id: oldTimeline.id,
    title: formValue.title,
  };
}

const GROUP_TAB_ID_PREFIX = 'ngb-group-tab-';
const ADD_NEW_GROUP_TAB_ID = 'add-new-group-tab';
const EXTRACT_INDEX_FROM_GROUP_TAB_ID_REGEX = new RegExp('^' + GROUP_TAB_ID_PREFIX + '(\\d+)$');

export interface EventFromTimelineCreateAction extends Action {
  type: 'EVENT_FROM_TIMELINE_CREATE';
  payload: {
    eventTitle: string;
    timelineId: string;
  }
}
