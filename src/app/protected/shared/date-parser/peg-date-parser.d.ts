
export declare type PegDateParserContext = 'BEGINNING_DATE' | 'ENDING_DATE';

export declare interface PegDateParserResult {
  year: number;
  month: number;
  day: number;
}

export declare function parse(
  expression: string,
  options?: {
    context: PegDateParserContext,
  },
): any;
