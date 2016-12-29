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

  onKeyDown(keyCode: number) {
    if (keyCode === KEY_ENTER) {
      this.emitCreateEvent();
    }
  }

  onCreateButtonClick() {
    this.emitCreateEvent();
  }

  private emitCreateEvent() {
    this.create.emit(this.inputControl.value);
  }
}

export const KEY_ENTER = 13;
