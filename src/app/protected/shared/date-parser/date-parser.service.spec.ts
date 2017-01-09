import { DateParser, DateParserContext } from './date-parser.service';

describe('DateParser', () => {

  const parser: DateParser = new DateParser();

  it('should parse year', () => {

    expect(parser.parse('1')).toEqual({
      year: 1, month: 1, day: 1,
    });
    expect(parser.parse('1 д.н.э.')).toEqual({
      year: -1, month: 1, day: 1,
    });

    expect(parser.parse('10 г')).toEqual({
      year: 10, month: 1, day: 1,
    });
    expect(parser.parse('10 г до н.э.')).toEqual({
      year: -10, month: 1, day: 1,
    });

    //noinspection MagicNumberJS
    expect(parser.parse('100 г.')).toEqual({
      year: 100, month: 1, day: 1,
    });
    //noinspection MagicNumberJS
    expect(parser.parse('100 г. до нашей э.')).toEqual({
      year: -100, month: 1, day: 1,
    });

    //noinspection MagicNumberJS
    expect(parser.parse('1920 год')).toEqual({
      year: 1920, month: 1, day: 1,
    });
    //noinspection MagicNumberJS
    expect(parser.parse('1920 год до нашей эры')).toEqual({
      year: -1920, month: 1, day: 1,
    });
  });

  it('should parse date', () => {

    //noinspection MagicNumberJS
    expect(parser.parse('17.08.0001')).toEqual({
      year: 1, month: 8, day: 17,
    });
    //noinspection MagicNumberJS
    expect(parser.parse('17.08.0001 до н.э.')).toEqual({
      year: -1, month: 8, day: 17,
    });

    //noinspection MagicNumberJS
    expect(parser.parse('31.03.2011')).toEqual({
      year: 2011, month: 3, day: 31,
    });
    //noinspection MagicNumberJS
    expect(parser.parse('31.03.2011 до нашей эры')).toEqual({
      year: -2011, month: 3, day: 31,
    });

  });

  it('should parse century', () => {

    //noinspection MagicNumberJS
    expect(parser.parse('I', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      year: 1, month: 1, day: 1,
    });
    //noinspection MagicNumberJS
    expect(parser.parse('I', { context: DateParserContext.ENDING_DATE })).toEqual({
      year: 100, month: 12, day: 31,
    });
    //noinspection MagicNumberJS
    expect(parser.parse('I д.н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      year: -101, month: 1, day: 1,
    });
    //noinspection MagicNumberJS
    expect(parser.parse('I до н.э.', { context: DateParserContext.ENDING_DATE })).toEqual({
      year: 0, month: 12, day: 31,
    });

    //noinspection MagicNumberJS
    expect(parser.parse('II', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      year: 101, month: 1, day: 1,
    });
    //noinspection MagicNumberJS
    expect(parser.parse('II', { context: DateParserContext.ENDING_DATE })).toEqual({
      year: 200, month: 12, day: 31,
    });

    //noinspection MagicNumberJS
    expect(parser.parse('IV', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      year: 301, month: 1, day: 1,
    });
    //noinspection MagicNumberJS
    expect(parser.parse('IV', { context: DateParserContext.ENDING_DATE })).toEqual({
      year: 400, month: 12, day: 31,
    });

    //noinspection MagicNumberJS
    expect(parser.parse('V', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      year: 401, month: 1, day: 1,
    });
    //noinspection MagicNumberJS
    expect(parser.parse('V', { context: DateParserContext.ENDING_DATE })).toEqual({
      year: 500, month: 12, day: 31,
    });

    //noinspection MagicNumberJS
    expect(parser.parse('VIII', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      year: 701, month: 1, day: 1,
    });
    //noinspection MagicNumberJS
    expect(parser.parse('VIII', { context: DateParserContext.ENDING_DATE })).toEqual({
      year: 800, month: 12, day: 31,
    });

    //noinspection MagicNumberJS
    expect(parser.parse('XIV', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      year: 1301, month: 1, day: 1,
    });
    //noinspection MagicNumberJS
    expect(parser.parse('XIV', { context: DateParserContext.ENDING_DATE })).toEqual({
      year: 1400, month: 12, day: 31,
    });

    //noinspection MagicNumberJS
    expect(parser.parse('XX', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      year: 1901, month: 1, day: 1,
    });
    //noinspection MagicNumberJS
    expect(parser.parse('XX', { context: DateParserContext.ENDING_DATE })).toEqual({
      year: 2000, month: 12, day: 31,
    });

    //noinspection MagicNumberJS
    expect(parser.parse('XXI', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      year: 2001, month: 1, day: 1,
    });
    //noinspection MagicNumberJS
    expect(parser.parse('XXI', { context: DateParserContext.ENDING_DATE })).toEqual({
      year: 2100, month: 12, day: 31,
    });

  });

});
