//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TimelineEvent } from '../shared/timeline-event';
import { composeChildrenValidators } from '../../shared/compose-children-validators.validator';
import { ifEmptyObject } from '../../shared/helpers';
import { TimelineDate } from '../shared/date';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';

@Component({
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush, // can't make OnPush - shallow test unexpectedly hangs up
})
export class EventComponent implements OnInit, OnDestroy {

  form: EventForm;
  closeAfterSave: boolean = false;
  saveWasAttempted: boolean = false;
  private eventStateSubscription: Subscription;
  private isSavingStateSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.eventStateSubscription = this.store.select('event', 'event').subscribe((event: TimelineEvent) => {
      this.form = <EventForm> this.fb.group({
        id: event.id,
        title: [event.title, Validators.required],
        dateBegin: [event.dateBegin, Validators.required],
        dateEnd: [event.dateEnd, Validators.required],
      }, { validator: validateEventForm });
    });

    this.isSavingStateSubscription = this.store
      .select('event', 'isSaving')
      .subscribe((isSaving: boolean) => {
        if (this.closeAfterSave && !isSaving) {
          this.activeModal.close();
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
      this.store.dispatch({
        type: this.isNew() ? 'EVENT_INSERT' : 'EVENT_UPDATE',
        payload: this.form.value,
      });
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  private isNew(): boolean {
    return this.form.controls.id.value === null;
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
