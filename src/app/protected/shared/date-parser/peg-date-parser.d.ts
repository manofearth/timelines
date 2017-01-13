
export declare type ApproximityType = 'begin' | 'end' | 'first_half' | 'second_half' | 'accurate';

export declare interface PegDateParserDate {
  type: 'date',
  year: number;
  month: number;
  day: number;
}

export declare interface PegDateParserYear {
  type: 'year';
  year: number;
  approx: ApproximityType;
}

export declare interface PegDateParserCentury {
  type: 'century';
  century: number;
  approx: ApproximityType;
}

export type PegDateParserResult = PegDateParserDate | PegDateParserYear | PegDateParserCentury;

export declare function parse(
  expression: string
): PegDateParserResult;
