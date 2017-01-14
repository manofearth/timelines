import { DateParser, DateParserContext } from './date-parser.service';

describe('DateParser', () => {

  const parser: DateParser = new DateParser();

  it('should throw error on incorrect input', () => {

    expect(() => {
      parser.parse('some incorrect input');
    }).toThrowError();
  });

  it('year 1 CE', () => {

    //noinspection MagicNumberJS
    expect(parser.parse('1')).toEqual({
      day: 366, title: '1',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('1', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 366, title: '1',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('1', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 731, title: '1',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('нач. 1 г. н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 366, title: 'нач. 1 г. н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('начало 1-го года нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 456, title: 'начало 1-го года нашей эры',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('кон. 1 г. н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 639, title: 'кон. 1 г. н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('конец 1-го года нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 731, title: 'конец 1-го года нашей эры',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('1 пол. 1 г. н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 366, title: '1 пол. 1 г. н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('1-я половина 1-го года нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 547, title: '1-я половина 1-го года нашей эры',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('2-я пол. 1 г. н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 547, title: '2-я пол. 1 г. н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('2-я половина 1-го года нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 731, title: '2-я половина 1-го года нашей эры',
    });

  });

  it('year 1 BCE', () => {

    //noinspection MagicNumberJS
    expect(parser.parse('1 д.н.э.')).toEqual({
      day: 0, title: '1 д.н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('1 д.н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 0, title: '1 д.н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('1-й г. д.н.э.', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 366, title: '1-й г. д.н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('нач. 1 г. до н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 0, title: 'нач. 1 г. до н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('начало 1-го года до нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 91, title: 'начало 1-го года до нашей эры',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('кон. 1 г. до н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 274, title: 'кон. 1 г. до н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('конец 1-го года до нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 366, title: 'конец 1-го года до нашей эры',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('1 пол. 1 г. до н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 0, title: '1 пол. 1 г. до н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('1-я половина 1-го года до нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 182, title: '1-я половина 1-го года до нашей эры',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('2-я пол. 1 г. до н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 182, title: '2-я пол. 1 г. до н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('2-я половина 1-го года до нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 366, title: '2-я половина 1-го года до нашей эры',
    });

  });

  it('year 10 CE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('10 г')).toEqual({
      day: 3653, title: '10 г',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('10 г', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 4018, title: '10 г',
    });

  });

  it('year 10 BCE', () => {

    //noinspection MagicNumberJS
    expect(parser.parse('10 г до н.э.')).toEqual({
      day: -3287, title: '10 г до н.э.',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('10 г до н.э.', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: -2922, title: '10 г до н.э.',
    });
  });

  it('year 100 CE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('100-й г.')).toEqual({
      day: 36525, title: '100-й г.',
    });
  });

  it('year 100 BCE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('100 г. до нашей э.')).toEqual({
      day: -36159, title: '100 г. до нашей э.',
    });
  });

  it('year 1920 CE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('1920 год')).toEqual({
      day: 701265, title: '1920 год',
    });
  });

  it('year 1920 BCE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('1920 год до нашей эры')).toEqual({
      day: -700899, title: '1920 год до нашей эры',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('1920-й год до нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: -700534, title: '1920-й год до нашей эры',
    });
  });

  it('date 17.08.0001 CE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('17.08.0001')).toEqual({
      day: 594, title: '17.08.0001',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('17.08.0001', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 595, title: '17.08.0001',
    });
  });

  it('date 17.08.0001 BCE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('17.08.0001 до н.э.')).toEqual({
      day: 229, title: '17.08.0001 до н.э.',
    });
  });

  it('date 31.03.2011 CE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('31.03.2011')).toEqual({
      day: 734592, title: '31.03.2011',
    });
  });

  it('date 31.03.2011 BCE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('31.03.2011 до нашей эры')).toEqual({
      day: -734048, title: '31.03.2011 до нашей эры',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('31.03.2011 до нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: -734047, title: '31.03.2011 до нашей эры',
    });
  });

  it('century I CE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('I')).toEqual({
      day: 366, title: 'I',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('I-й', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 366, title: 'I-й',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('I-й век', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 36890, title: 'I-й век',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('нач I-го в. н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 366, title: 'нач I-го в. н.э.',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('начало I-го века нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 9497, title: 'начало I-го века нашей эры',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('кон. I-го в. н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 27759, title: 'кон. I-го в. н.э.',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('конец I-го века нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 36890, title: 'конец I-го века нашей эры',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('1-я пол. I-го в. н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 366, title: '1-я пол. I-го в. н.э.',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('1-я половина I-го века нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 18628, title: '1-я половина I-го века нашей эры',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('2-я пол. I-го в. н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 18628, title: '2-я пол. I-го в. н.э.',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('2-я половина I-го века нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 36890, title: '2-я половина I-го века нашей эры',
    });
  });

  it('century I BCE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('I д.н.э.')).toEqual({
      day: -36159, title: 'I д.н.э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('I-й до н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: -36159, title: 'I-й до н.э.',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('I-й век до нашей э.', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 366, title: 'I-й век до нашей э.',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('нач I-го в. до н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: -36159, title: 'нач I-го в. до н.э.',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('начало I-го века до нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: -27028, title: 'начало I-го века до нашей эры',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('кон. I-го в. до н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: -8766, title: 'кон. I-го в. до н.э.',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('конец I-го века до нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 366, title: 'конец I-го века до нашей эры',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('1-я пол. I-го в. до н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: -36159, title: '1-я пол. I-го в. до н.э.',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('1-я половина I-го века до нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: -17897, title: '1-я половина I-го века до нашей эры',
    });

    //noinspection MagicNumberJS
    expect(parser.parse('2-я пол. I-го в. до н.э.', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: -17897, title: '2-я пол. I-го в. до н.э.',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('2-я половина I-го века до нашей эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 366, title: '2-я половина I-го века до нашей эры',
    });
  });

  it('century II CE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('II', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 36890, title: 'II',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('II', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 73414, title: 'II',
    });
  });

  it('century IV CE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('IV', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 109938, title: 'IV',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('IV', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 146463, title: 'IV',
    });
  });

  it('century V CE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('V', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 146463, title: 'V',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('V', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 182987, title: 'V',
    });
  });

  it('century V BCE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('V до нашей эры', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: -182256, title: 'V до нашей эры',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('V до н. эры', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: -145731, title: 'V до н. эры',
    });
  });

  it('century VIII CE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('VIII', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 256035, title: 'VIII',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('VIII', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 292560, title: 'VIII',
    });
  });

  it('century XIV CE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('XIV', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 475181, title: 'XIV',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('XIV', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 511705, title: 'XIV',
    });
  });

  it('century XX CE', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('XX', { context: DateParserContext.BEGINNING_DATE })).toEqual({
      day: 694326, title: 'XX',
    });
    //noinspection MagicNumberJS
    expect(parser.parse('XX', { context: DateParserContext.ENDING_DATE })).toEqual({
      day: 730851, title: 'XX',
    });
  });

  it('century XXI CE', () => {

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
