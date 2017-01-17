import { DateDirective } from './date.directive';
import { DateParser } from '../shared/date-parser/date-parser.service';
import { Logger } from '../../shared/logger.service';
import { Renderer, ElementRef } from '@angular/core';
describe('DateDirective', () => {

  let parser: DateParser;
  let directive: DateDirective;
  let logger: Logger;
  let renderer: Renderer;
  let inputEl: ElementRef;

  beforeEach(() => {

    parser = <any> {
      parse: () => {},
    };

    logger = <any> {
      error: () => {},
    };

    inputEl = <any> {};

    renderer = <any> {
      setElementProperty: () => {},
    };

    directive = new DateDirective(inputEl, renderer, parser, logger);
  });

  it('onChange() should set null if empty value', () => {
    directive.onChange('');
    expect(directive.value).toBe(null);
  });

  it('onChange() should parse and set value on change', () => {

    spyOn(parser, 'parse').and.returnValue('some parsed date');
    expect(directive.value).toBeNull();
    directive.onChange('some date');
    expect(directive.value).toBe('some parsed date');
  });

  it('onChange() should set null as value on parse error and log error', () => {

    spyOn(parser, 'parse').and.throwError('some parse error');
    spyOn(logger, 'error');

    directive.writeValue(<any> 'some date');
    expect(directive.value).toBe('some date');
    directive.onChange('some other date (with error)');

    expect(directive.value).toBeNull();
    expect(logger.error).toHaveBeenCalledWith('Date parse error: some parse error');
  });
});