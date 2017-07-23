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
import { SearchFieldService } from './search-field-service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

@Component({
  selector: 'tl-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldComponent implements OnInit, OnDestroy {

  @Input() placeholder: string;
  @Input() service: SearchFieldService;

  @Output() escKey: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('btnCreate') btnCreate: ElementRef;

  inputControl: FormControl;
  hasResults: boolean = false;

  private valueChangesSub: Subscription;
  private searchResultsSub: Subscription;

  ngOnInit() {
    this.inputControl = new FormControl();

    this.valueChangesSub = this.inputControl.valueChanges
      .debounceTime(USER_INPUT_DEBOUNCE_TIME)
      .subscribe(this.service.queryListener);

    this.searchResultsSub = this.service.results$
      .map(results => results.length !== 0)
      .subscribe(hasResults => {
        this.hasResults = hasResults;
      });
  }

  ngOnDestroy() {
    this.valueChangesSub.unsubscribe();
    this.searchResultsSub.unsubscribe();
  }

  emitCreateEvent() {
    this.service.searchFieldActionsListener.next({
      type: 'create',
      payload: this.inputControl.value
    });
  }

  onEnterKey() {
    this.service.searchFieldActionsListener.next({
      type: 'enter',
      payload: this.inputControl.value
    });
  }

  onArrowDownKey() {
    this.service.searchFieldActionsListener.next('down');
  }

  onArrowUpKey() {
    this.service.searchFieldActionsListener.next('up');
  }

  onEscKey() {
    this.escKey.emit();
  }

}

const USER_INPUT_DEBOUNCE_TIME = 300;
