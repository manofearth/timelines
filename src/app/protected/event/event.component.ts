import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TimelineEvent } from '../shared/timeline-event';
import { composeChildrenValidators } from '../../shared/compose-children-validators.validator';
import { ifEmptyObject } from '../../shared/helpers';
import { TimelineDate } from '../shared/date';

@Component({
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit {

  form: EventForm;
  event: TimelineEvent;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.form = <EventForm> this.fb.group({
      title: [this.event.title, Validators.required],
      dateBegin: [this.event.dateBegin, Validators.required],
      dateEnd: [this.event.dateEnd, Validators.required],
    }, { validator: validateEventForm });
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
