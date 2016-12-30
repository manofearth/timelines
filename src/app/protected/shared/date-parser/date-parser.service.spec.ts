import { DateParser } from './date-parser.service';

describe('DateParser', () => {

  const parser: DateParser = new DateParser();

  it('should parse', () => {
    //noinspection MagicNumberJS
    expect(parser.parse('1920')).toBe(1920);
  });
});
