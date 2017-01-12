
export declare type PegDateParserContext = 'BEGINNING_DATE' | 'ENDING_DATE';

export declare interface PegDateParserDate {
  type: 'date',
  year: number;
  month: number;
  day: number;
}

export declare interface PegDateParserYear {
  type: 'year';
  year: number;
}

export declare interface PegDateParserCentury {
  type: 'century';
  century: number;
}

export type PegDateParserResult = PegDateParserDate | PegDateParserYear | PegDateParserCentury;

export declare function parse(
  expression: string,
  options?: {
    context: PegDateParserContext,
  },
): PegDateParserResult;
