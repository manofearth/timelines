import { DateParser, DateParserContext } from './date-parser.service';

describe('DateParser', () => {

  const parser: DateParser = new DateParser();

  it('should parse year', () => {

    //noinspection MagicNumberJS
    expect(parser.parse('1')).toEqual({
      day: 366, title: '1',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('1 д.н.э.')).toEqual({
      day: 0, title: '1 д.н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('10 г')).toEqual({
      day: 3653, title: '10 г',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('10 г до н.э.')).toEqual({
      day: -3287, title: '10 г до н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('100 г.')).toEqual({
      day: 36525, title: '100 г.',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('100 г. до нашей э.')).toEqual({
      day: -36159, title: '100 г. до нашей э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('1920 год')).toEqual({
      day: 701265, title: '1920 год',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('1920 год до нашей эры')).toEqual({
      day: -700899, title: '1920 год до нашей эры',
    });
  });

  it('should parse date', () => {

    //noinspection MagicNumberJS
    expect(parser.parse('17.08.0001')).toEqual({
      day: 594, title: '17.08.0001',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('17.08.0001 до н.э.')).toEqual({
      day: 229, title: '17.08.0001 до н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('31.03.2011')).toEqual({
      day: 734592, title: '31.03.2011',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('31.03.2011 до нашей эры')).toEqual({
      day: -734048, title: '31.03.2011 до нашей эры',
    });

  });

  it('should parse century', () => {

    //noinspection MagicNumberJS
    expect(parser.parse('I', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 366, title: 'I',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('I', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 36890, title: 'I',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('I д.н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: -36159, title: 'I д.н.э.',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('I до н.э.', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 366, title: 'I до н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('II', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 36890, title: 'II',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('II', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 73414, title: 'II',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('IV', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 109938, title: 'IV',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('IV', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 146463, title: 'IV',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('V', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 146463, title: 'V',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('V', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 182987, title: 'V',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('V до нашей эры', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: -182256, title: 'V до нашей эры',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('V до н. эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: -145731, title: 'V до н. эры',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('VIII', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 256035, title: 'VIII',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('VIII', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 292560, title: 'VIII',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('XIV', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 475181, title: 'XIV',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('XIV', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 511705, title: 'XIV',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('XX', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 694326, title: 'XX',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('XX', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 730851, title: 'XX',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('XXI', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 730851, title: 'XXI',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('XXI', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 767375, title: 'XXI',
    });

  });

});
