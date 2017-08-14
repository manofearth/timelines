import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DateParser, DateParserContext } from '../date-parser/date-parser.service';
import { TimelineDate } from './date';
import { Logger } from '../../../shared/logger.service';
import { AppState } from '../../../reducers';
import { Action, Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { getPropSafely } from '../helpers';

@Directive({
  selector: 'input[tlDate]',
})
export class DateDirective implements OnInit, OnDestroy {

  @Input('tlDate') private name: string;
  @Input() stateSelector: (state: AppState) => TimelineDate;
  @Input() context: string;

  private stateSub: Subscription;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private parser: DateParser,
    private logger: Logger,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.stateSub = this.store.select<TimelineDate>(this.stateSelector).subscribe(state => {
      this.renderer.setProperty(this.el.nativeElement, 'value', getPropSafely<TimelineDate>(state, 'title', ''));
    });
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }

  //noinspection JSUnusedGlobalSymbols
  @HostListener('change', ['$event.target.value'])
  onChange(value: string) {
    this.dispatchChangedAction(this.parseDate(value));
  }

  private parseDate(value: string): TimelineDate {
    if (value === '') {
      return null;
    } else {
      try {
        return this.parser.parse(value, { context: toParserContext(this.context) });
      } catch (e) {
        this.logger.error('Date parse error: ' + e.message);
        return null;
      }
    }
  }

  private dispatchChangedAction(date: TimelineDate) {
    const action: DateChangedAction = {
      type: 'DATE_CHANGED',
      payload: {
        name: this.name,
        value: date,
      }
    };
    this.store.dispatch(action);
  }

}

function toParserContext(contextAsString: string) {
  if (contextAsString === 'ending') {
    return DateParserContext.ENDING_DATE;
  } else {
    return DateParserContext.BEGINNING_DATE;
  }
}

export interface DateChangedAction extends Action {
  type: 'DATE_CHANGED';
  payload: {
    name: string;
    value: TimelineDate | null;
  }
}
