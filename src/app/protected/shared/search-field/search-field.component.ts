import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import 'rxjs/add/operator/do';

@Component({
  selector: 'tl-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldComponent implements OnInit, OnDestroy {

  @Input() placeholder: string;
  @Input() searchService: SearchFieldService;

  @Output() createClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() enterKey: EventEmitter<void> = new EventEmitter<void>();
  @Output() arrowDownKey: EventEmitter<void> = new EventEmitter<void>();
  @Output() arrowUpKey: EventEmitter<void> = new EventEmitter<void>();
  @Output() escKey: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('btnCreate') btnCreate: ElementRef;

  inputControl: FormControl;
  isSearching: boolean = false;

  private valueChangesSub: Subscription;
  private isSearchingSub: Subscription;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.inputControl = new FormControl();

    this.valueChangesSub = this.inputControl.valueChanges
      .debounceTime(USER_INPUT_DEBOUNCE_TIME)
      .subscribe(this.searchService.queryListener);

    this.isSearchingSub = this.searchService.isSearching$.subscribe(isSearching => {
      this.isSearching = isSearching;
      this.changeDetector.markForCheck();
    })
  }

  ngOnDestroy() {
    this.valueChangesSub.unsubscribe();
    this.isSearchingSub.unsubscribe();
  }

  emitCreateEvent() {
    this.createClick.emit(this.inputControl.value);
  }

  onEnterKey(e: KeyboardEvent) {
    e.preventDefault();
    this.enterKey.emit();
  }

  onArrowDownKey() {
    this.arrowDownKey.emit();
  }

  onArrowUpKey() {
    this.arrowUpKey.emit();
  }

  onEscKey() {
    this.escKey.emit();
  }

}

const USER_INPUT_DEBOUNCE_TIME = 300;
