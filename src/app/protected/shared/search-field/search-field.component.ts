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
  hasResults: boolean = false;

  private valueChangesSub: Subscription;
  private isSearchingSub: Subscription;
  private searchResultsSub: Subscription;

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
    });

    this.searchResultsSub = this.searchService.results$
      .map(results => results.length !== 0)
      .subscribe(hasResults => {
        this.hasResults = hasResults;
      });
  }

  ngOnDestroy() {
    this.valueChangesSub.unsubscribe();
    this.isSearchingSub.unsubscribe();
    this.searchResultsSub.unsubscribe();
  }

  emitCreateEvent() {
    this.createClick.emit(this.inputControl.value);
  }

  onEnterKey() {
    if (this.hasResults) {
      this.enterKey.emit();
    } else {
      // workaround for bug: https://github.com/ng-bootstrap/ng-bootstrap/issues/1252#issuecomment-294338294
      this.btnCreate.nativeElement.focus();
      // causes btnCreate click, so no need to emit create event
    }
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
