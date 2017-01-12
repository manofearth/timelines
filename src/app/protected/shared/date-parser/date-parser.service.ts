import { parse } from './peg-date-parser';
import { TimelineDate } from '../date';

export enum DateParserContext {
  BEGINNING_DATE,
  ENDING_DATE,
}

export interface DateParserOptions {
  context: DateParserContext;
}

const defaultOptions = {
  context: DateParserContext.BEGINNING_DATE,
};

const FIRST_MONTH = 1;
const FIRST_DAY_IN_FIRST_MONTH = 1;
const LAST_MONTH = 12;
const LAST_DAY_IN_LAST_MONTH = 31;

export class DateParser {

  //noinspection JSMethodCanBeStatic
  parse(expression: string, options: DateParserOptions = defaultOptions): TimelineDate {

    const pegResult = parse(expression);

    let days;
    switch (pegResult.type) {
      case 'date':
        days = daysTillDate(yearToIso8601(pegResult.year), pegResult.month, pegResult.day, options.context);
        break;

      case 'year':
        if (options.context === DateParserContext.ENDING_DATE) {
          days = daysTillDate(yearToIso8601(pegResult.year), LAST_MONTH, LAST_DAY_IN_LAST_MONTH, options.context);
        } else {
          days = daysTillDate(yearToIso8601(pegResult.year), FIRST_MONTH, FIRST_DAY_IN_FIRST_MONTH, options.context);
        }
        break;

      case 'century':
        let firstYearOfCentury = pegResult.century * YEARS_IN_CENTURY + 1;
        if (pegResult.century > 0) {
          firstYearOfCentury -= YEARS_IN_CENTURY;
        }

        if (options.context === DateParserContext.ENDING_DATE) {
          const lastYearOfCentury = firstYearOfCentury + YEARS_IN_CENTURY - 1;
          days = daysTillDate(lastYearOfCentury, LAST_MONTH, LAST_DAY_IN_LAST_MONTH, options.context);
        } else {
          days = daysTillDate(firstYearOfCentury, FIRST_MONTH, FIRST_DAY_IN_FIRST_MONTH, options.context);
        }
        break;

      default:
        throw new Error('unknown PEG date parser result type "' + pegResult['type'] + '"');
    }

    return {
      day: days,
      title: expression,
    };
  }
}

function yearToIso8601(year: number): number {
  return year + (year < 0 ? 1 : 0);
}

const YEARS_IN_GREGORIAN_CALENDAR_PERIOD = 400;
const YEARS_IN_CENTURY = 100;
const YEARS_IN_LEAP_PERIOD = 4;

function isLeapYear(year: number): boolean {
  if (year % YEARS_IN_GREGORIAN_CALENDAR_PERIOD === 0) {
    return true;
  } else if (year % YEARS_IN_CENTURY === 0) {
    return false;
  } else {
    return year % YEARS_IN_LEAP_PERIOD === 0;
  }
}

const DAYS_IN_GREGORIAN_CALENDAR_PERIOD = 146097;
const DAYS_IN_CENTURY = 36524;
const DAYS_IN_LEAP_PERIOD = 1461;
const DAYS_IN_YEAR = 365;
const DAYS_IN_LEAP_YEAR = 366;
const DAYS_IN_ZERO_YEAR = DAYS_IN_LEAP_YEAR;

function fullDaysAtBeginningOfYear(year: number): number {

  let result = 0;

  const fullYears = year - 1;

  const fullGregorianPeriods = Math.floor(fullYears / YEARS_IN_GREGORIAN_CALENDAR_PERIOD);
  result += fullGregorianPeriods * DAYS_IN_GREGORIAN_CALENDAR_PERIOD;
  const yearsInPartialGregorianPeriod = fullYears - fullGregorianPeriods * YEARS_IN_GREGORIAN_CALENDAR_PERIOD;

  //noinspection LocalVariableNamingConventionJS
  const fullCenturiesInPartialGregorianPeriod = Math.floor(yearsInPartialGregorianPeriod / YEARS_IN_CENTURY);
  result += fullCenturiesInPartialGregorianPeriod * DAYS_IN_CENTURY;
  const yearsInPartialCentury = yearsInPartialGregorianPeriod - fullCenturiesInPartialGregorianPeriod * YEARS_IN_CENTURY;

  const fullLeapPeriodsInPartialCentury = Math.floor(yearsInPartialCentury / YEARS_IN_LEAP_PERIOD);
  result += fullLeapPeriodsInPartialCentury * DAYS_IN_LEAP_PERIOD;
  const yearsInPartialLeapPeriod = yearsInPartialCentury - fullLeapPeriodsInPartialCentury * YEARS_IN_LEAP_PERIOD;

  result += yearsInPartialLeapPeriod * DAYS_IN_YEAR;

  result += DAYS_IN_ZERO_YEAR;

  return result;
}

//noinspection MagicNumberJS
const daysFromYearBeginningTillMonth = {
  1: 0,
  2: 31,
  3: 59,
  4: 90,
  5: 120,
  6: 151,
  7: 181,
  8: 212,
  9: 243,
  10: 273,
  11: 304,
  12: 334,
};

function fullDaysAtBeginningOfMonth(month: number): number {
  return daysFromYearBeginningTillMonth[month];
}

function daysTillDate(year: number, month: number, day: number, context: DateParserContext) {
  let leapDay;
  if (month > 2 && isLeapYear(year)) {
    leapDay = 1;
  } else {
    leapDay = 0;
  }

  return fullDaysAtBeginningOfYear(year)
  + fullDaysAtBeginningOfMonth(month)
  + leapDay
  + day
  + (context === DateParserContext.ENDING_DATE ? 0 : -1);
}
