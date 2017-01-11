import { parse } from './peg-date-parser';
import { TimelineDate } from '../date';

export enum DateParserContext {
  BEGINNING_DATE,
  ENDING_DATE,
}

export class DateParser {

  //noinspection JSMethodCanBeStatic
  parse(expression: string, options?: { context: DateParserContext }): TimelineDate {

    const pegResult = parse(expression);

    let days;
    switch (pegResult.type) {
      case 'date':
        let leapDay;
        if(pegResult.month > 2 && isLeapYear(pegResult.year)) {
          leapDay = 1;
        } else {
          leapDay = 0;
        }

        days = fullDaysAtBeginningOfYear(pegResult.year)
          + fullDaysAtBeginningOfMonth(pegResult.month)
          + ((pegResult.month > 2 && isLeapYear(pegResult.year)) ? 1 : 0)
          + leapDay
          + pegResult.day - 1;
        break;

      case 'year':
        days = fullDaysAtBeginningOfYear(pegResult.year);
        break;

      default:
        throw new Error('unknown PEG date parser result type "' + pegResult.type + '"');
    }

    return {
      day: days,
      title: expression,
    };
  }
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

const FULL_DAYS_IN_GREGORIAN_CALENDAR_PERIOD = 146097;
const FULL_DAYS_IN_CENTURY = 36524;
const FULL_DAYS_IN_LEAP_PERIOD = 1461;
const FULL_DAYS_IN_YEAR = 365;
const FULL_DAYS_IN_ZERO_YEAR = 366;

function fullDaysAtBeginningOfYear(year: number): number {

  let result = 0;

  const fullYears = year - 1;

  const fullGregorianPeriods = Math.trunc(fullYears / YEARS_IN_GREGORIAN_CALENDAR_PERIOD);
  result += fullGregorianPeriods * FULL_DAYS_IN_GREGORIAN_CALENDAR_PERIOD;
  const yearsInPartialGregorianPeriod = fullYears % YEARS_IN_GREGORIAN_CALENDAR_PERIOD;

  //noinspection LocalVariableNamingConventionJS
  const fullCenturiesInPartialGregorianPeriod = Math.trunc(yearsInPartialGregorianPeriod / YEARS_IN_CENTURY);
  result += fullCenturiesInPartialGregorianPeriod * FULL_DAYS_IN_CENTURY;
  const yearsInPartialCentury = fullCenturiesInPartialGregorianPeriod % YEARS_IN_CENTURY;

  const fullLeapPeriodsInPartialCentury = Math.trunc(yearsInPartialCentury / YEARS_IN_LEAP_PERIOD);
  result += fullLeapPeriodsInPartialCentury * FULL_DAYS_IN_LEAP_PERIOD;
  const yearsInPartialLeapPeriod = yearsInPartialCentury % YEARS_IN_LEAP_PERIOD;

  result += yearsInPartialLeapPeriod * FULL_DAYS_IN_YEAR;

  result += FULL_DAYS_IN_ZERO_YEAR;

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
