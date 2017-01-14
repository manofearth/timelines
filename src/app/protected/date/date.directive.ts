import { Directive, HostListener, Input, ElementRef, Renderer, forwardRef } from '@angular/core';
import { DateParser, DateParserContext } from '../shared/date-parser/date-parser.service';
import { TimelineDate } from '../shared/date';
import { Logger } from '../../shared/logger.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getPropSafely } from '../shared/helpers';

@Directive({
  selector: 'input[tl-date][formControlName]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateDirective),
      multi: true
    },
  ],
})
export class DateDirective implements ControlValueAccessor {

  @Input('tl-date') private context: string;

  private date: TimelineDate = null;
  private propagateChange: (value: TimelineDate) => void = () => {
  };
  private propagateTouch: () => void = () => {
  };

  constructor(private inputEl: ElementRef,
              private renderer: Renderer,
              private parser: DateParser,
              private logger: Logger) {
  }

  @HostListener('change', ['$event.target.value']) onChange(value: string) {
    try {
      this.date = this.parser.parse(value, { context: toParserContext(this.context) })
    } catch (e) {
      this.logger.error('Date parse error: ' + e.message);
      this.date = null;
    }
  }

  get value(): TimelineDate {
    return this.date;
  }

  writeValue(value: TimelineDate) {
    this.date = value;
    this.renderer.setElementProperty(this.inputEl.nativeElement, 'value', getPropSafely(value, 'title', ''));
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

}

function toParserContext(contextAsString: string) {
  if (contextAsString === 'ending') {
    return DateParserContext.ENDING_DATE;
  } else {
    return DateParserContext.BEGINNING_DATE;
  }
}
