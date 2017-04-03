import { Component, OnInit, EventEmitter, Input, ChangeDetectionStrategy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'tl-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorComponent implements OnInit {

  inputControl: FormControl;

  @Output('create') create: EventEmitter<string> = new EventEmitter<string>();

  @Input('placeholder') placeholder: string;

  ngOnInit() {
    this.inputControl = new FormControl();
  }

  emitCreateEvent() {
    this.create.emit(this.inputControl.value);
  }
}

export const KEY_ENTER = 13;
