import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
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

  @ViewChild('btnCreate') btnCreate: ElementRef;

  ngOnInit() {
    this.inputControl = new FormControl();
  }

  emitCreateEvent() {
    this.create.emit(this.inputControl.value);
  }

  onEnterKey() {
    // workaround for bug: https://github.com/ng-bootstrap/ng-bootstrap/issues/1252#issuecomment-294338294
    this.btnCreate.nativeElement.focus();
    this.emitCreateEvent();
  }
}
