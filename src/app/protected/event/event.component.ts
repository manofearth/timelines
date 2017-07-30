//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TimelineEvent } from '../shared/timeline-event';
import { composeChildrenValidators } from '../../shared/compose-children-validators.validator';
import { ifEmptyObject } from '../../shared/helpers';
import { TimelineDate } from '../shared/date';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { EventInsertAndAttachToTimelineAction } from './event-actions';
import { EventStatus } from './event-states';
import { SelectorState } from '../shared/selector-input/selector-state';

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

  private eventStateSubscription: Subscription;
  private isSavingStateSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
    private changeDetector: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.eventStateSubscription = this.store.select('event', 'event').subscribe((event: TimelineEvent) => {
      if (event !== null) {
        this.initForm(event);
        this.changeDetector.markForCheck();
      }
    });

    this.isSavingStateSubscription = this.store.select('event', 'status').subscribe((status: EventStatus) => {
      if (this.closeAfterSave && (status === 'INSERTED' || status === 'UPDATED')) {
        this.activeModal.close(this.form.value);
      }
    });

  }

  ngOnDestroy() {
    this.eventStateSubscription.unsubscribe();
    this.isSavingStateSubscription.unsubscribe();
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
        this.dispatchInsertAction();
      }
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  mapEventSelectorState(appState: AppState): SelectorState {
    return appState.event.typeSelector;
  }

  private initForm(event: TimelineEvent) {
    this.form = <EventForm> this.fb.group({
      id: event.id,
      title: [event.title, Validators.required],
      dateBegin: [event.dateBegin, Validators.required],
      dateEnd: [event.dateEnd, Validators.required],
    }, { validator: validateEventForm });
  }

  private isNew(): boolean {
    return this.form.controls.id.value === null;
  }

  private dispatchInsertAction() {
    this.store.dispatch({
      type: this.isNew() ? 'EVENT_INSERT' : 'EVENT_UPDATE',
      payload: this.form.value,
    });
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
