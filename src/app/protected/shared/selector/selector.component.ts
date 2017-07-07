import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { SelectorSearchService } from './selector-search.service';

@Component({
  selector: 'tl-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorComponent implements OnInit, OnDestroy {


  inputControl: FormControl;

  @Output('create') create: EventEmitter<string> = new EventEmitter<string>();

  @Input('placeholder') placeholder: string;
  @Input('searchService') searchService: SelectorSearchService;

  @ViewChild('btnCreate') btnCreate: ElementRef;

  private valueChangesSub: Subscription;

  constructor() {
  }

  ngOnInit() {
    this.inputControl = new FormControl();

    this.valueChangesSub = this.inputControl.valueChanges
      .debounceTime(USER_INPUT_DEBOUNCE_TIME)
      .subscribe(this.searchService.queryListener);

    this.searchService.results$.subscribe(results => {
      console.log(results);
    });

  }

  ngOnDestroy(): void {
    this.valueChangesSub.unsubscribe();
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

const USER_INPUT_DEBOUNCE_TIME = 1500;
