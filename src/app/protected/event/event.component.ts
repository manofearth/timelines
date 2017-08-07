//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TimelineEvent } from '../shared/timeline-event';
import { composeChildrenValidators } from '../../shared/compose-children-validators.validator';
import { ifEmptyObject } from '../../shared/helpers';
import { TimelineDate } from '../shared/date';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { EventInsertAction, EventInsertAndAttachToTimelineAction, EventUpdateAction } from './event-actions';
import { EventStatus } from './event-states';
import { SelectorInputState } from '../shared/selector-input/selector-input-state';
import { TimelineEventsTypeForList } from '../types/types-states';

@Component({
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventComponent implements OnInit, OnDestroy {

  form: EventForm;
  closeAfterSave: boolean = false;
  saveWasAttempted: boolean = false;
  typeSelectorName: string = EVENT_TYPE_SELECTOR_NAME;

  attachTo: { timelineId: string, groupId: string } = null;

  private eventStateSub: Subscription;
  private isSavingStateSub: Subscription;
  private typeSub: Subscription;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
    private changeDetector: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.eventStateSub = this.store.select('event', 'event').subscribe((event: TimelineEvent) => {
      if (event !== null) {
        this.initForm(event);
        this.changeDetector.markForCheck();
      }
    });

    this.isSavingStateSub = this.store.select('event', 'status').subscribe((status: EventStatus) => {
      if (this.closeAfterSave && (status === 'INSERTED' || status === 'UPDATED')) {
        this.activeModal.close(this.form.value);
      }
    });
  }

  ngOnDestroy() {
    this.eventStateSub.unsubscribe();
    this.isSavingStateSub.unsubscribe();
    if (this.typeSub) {
      this.typeSub.unsubscribe();
    }
  }

  invalidControl(controlName: string): boolean {
    return this.form.controls[controlName].invalid
      && (this.saveWasAttempted || this.form.controls[controlName].touched);
  }

  dateEndLessDateBegin(): boolean {
    return this.form.invalid && this.form.errors.dateEndLessDateBegin;
  }

  save() {
    this.saveWasAttempted = true;

    if (this.form.valid) {

      this.closeAfterSave = true;

      if (this.isNew() && this.attachTo !== null) {
        this.dispatchInsertAndAttachToTimelineAction();
      } else {
        this.dispatchSaveAction();
      }
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  mapEventSelectorState(appState: AppState): SelectorInputState<TimelineEventsTypeForList> {
    return appState.event.typeSelector;
  }

  private initForm(event: TimelineEvent) {
    this.form = <EventForm> this.fb.group({
      id: event.id,
      title: [event.title, Validators.required],
      dateBegin: [event.dateBegin, Validators.required],
      dateEnd: [event.dateEnd, Validators.required],
      type: [null, Validators.required],
    }, { validator: validateEventForm });

    this.typeSub = this.store
      .select<string>(state => {
        if (state.event.typeSelector.selectedItem) {
          return state.event.typeSelector.selectedItem.item.id;
        } else {
          return null;
        }
      })
      .subscribe(typeId => {
        this.form.controls.type.setValue(typeId, { emitEvent: false });
        this.form.controls.type.markAsTouched();
      });
  }

  private isNew(): boolean {
    return this.form.controls.id.value === null;
  }

  private dispatchSaveAction() {
    if (this.isNew()) {
      this.dispatchInsertAction();
    } else {
      this.dispatchUpdateAction();
    }
  }

  private dispatchInsertAction() {
    const action: EventInsertAction = {
      type: 'EVENT_INSERT',
      payload: this.form.value,
    };
    this.store.dispatch(action);
  }

  private dispatchUpdateAction() {
    const action: EventUpdateAction = {
      type: 'EVENT_UPDATE',
      payload: this.form.value,
    };
    this.store.dispatch(action);
  }

  private dispatchInsertAndAttachToTimelineAction() {

    const action: EventInsertAndAttachToTimelineAction = {
      type: 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE',
      payload: {
        event: this.form.value,
        timelineId: this.attachTo.timelineId,
        groupId: this.attachTo.groupId,
      },
    };

    this.store.dispatch(action);
  }
}

export interface DateFormControl extends FormControl {
  setValue(value: TimelineDate);
}

export interface EventForm extends FormGroup {
  controls: {
    id: FormControl;
    title: FormControl;
    dateBegin: DateFormControl;
    dateEnd: DateFormControl;
    type: FormControl;
  };
  errors: EventFormErrors | null;
  setValue(value: TimelineEvent);
}

export interface EventFormErrors {
  required?: true;
  dateEndLessDateBegin?: true;
}

function validateEventForm(form: EventForm) {

  const errors: EventFormErrors = Object.assign({}, composeChildrenValidators(form));

  if (form.controls.dateBegin.value !== null && form.controls.dateEnd.value !== null
    && form.controls.dateBegin.value.days >= form.controls.dateEnd.value.days) {
    errors.dateEndLessDateBegin = true;
  }

  return ifEmptyObject(errors, null);
}

export const EVENT_TYPE_SELECTOR_NAME = 'event-type-selector';
