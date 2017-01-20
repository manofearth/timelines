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
import { EventState } from './event.reducer';

@Component({
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush, can't make OnPush, shallow test unexpectedly hangs up
})
export class EventComponent implements OnInit, OnDestroy {

  form: EventForm;
  private eventStateSubscription: Subscription;

  constructor(private fb: FormBuilder,
              public activeModal: NgbActiveModal,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.eventStateSubscription = this.store.select('event').subscribe((state: EventState) => {
      this.form = <EventForm> this.fb.group({
        title: [state.event.title, Validators.required],
        dateBegin: [state.event.dateBegin, Validators.required],
        dateEnd: [state.event.dateEnd, Validators.required],
      }, { validator: validateEventForm });

    });
  }

  ngOnDestroy() {
    this.eventStateSubscription.unsubscribe();
  }

  invalidControl(controlName: string): boolean {
    return this.form.controls[controlName].invalid && this.form.controls[controlName].touched;
  }

  dateEndLessDateBegin(): boolean {
    return this.form.invalid && this.form.errors.dateEndLessDateBegin;
  }

}

export interface DateFormControl extends FormControl {
  setValue(value: TimelineDate);
}

export interface EventForm extends FormGroup {
  controls: {
    title: FormControl;
    dateBegin: DateFormControl;
    dateEnd: DateFormControl;
  };
  errors: EventFormErrors | null;
  setValue(value: TimelineEvent);
}

interface EventFormErrors {
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
