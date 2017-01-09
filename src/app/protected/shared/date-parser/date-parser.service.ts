import { PegDateParserContext, PegDateParserResult, parse } from './peg-date-parser';
import { getPropSafely } from '../helpers';

export enum DateParserContext {
  BEGINNING_DATE,
  ENDING_DATE,
}

export class DateParser {

  //noinspection JSMethodCanBeStatic
  parse(expression: string, options?: { context: DateParserContext }): PegDateParserResult {

    const pegContext = toPegParserContext(getPropSafely(options, 'context', null));
    return parse(expression, { context: pegContext });
  }
}

function toPegParserContext(context: DateParserContext): PegDateParserContext {
  switch (context) {
    case DateParserContext.BEGINNING_DATE:
      return 'BEGINNING_DATE';
    case DateParserContext.ENDING_DATE:
      return 'ENDING_DATE';
    default:
      return null;
  }
}
