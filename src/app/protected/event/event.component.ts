import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit {

  form: EventForm;
  event: { title: string };

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.form = <EventForm> this.fb.group({
      title: this.event.title,
    });
  }
}

export interface EventForm extends FormGroup {
  controls: {
    title: FormControl,
  },
}
