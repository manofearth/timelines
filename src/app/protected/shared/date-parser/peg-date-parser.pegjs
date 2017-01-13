{
  function coalesce(val, def) {
    return val === null ? def : val;
  }
  function bceCoeff(bceCoeffNullable) {
  	return coalesce(bceCoeffNullable, 1);
  }
  function approx(approxLabel) {
    return coalesce(approxLabel, 'accurate');
  }
  function toDateObj(year, month, day) {
    return {
      type: 'date',
      year: year,
      month: month,
      day: day,
    };
  }
  function toYearObj(year, approxLabel) {
    return {
      type: 'year',
      year: year,
      approx: approx(approxLabel),
    };
  }
  function toCenturyObj(century, approxLabel) {
    return {
      type: 'century',
      century: century,
      approx: approx(approxLabel),
    };
  }
}

Expression
 = Date / Year / Century

Date
  = day:Integer "." month:Integer "." year:Integer _ bce:BCECoeff? { return toDateObj(bceCoeff(bce) * year, month, day) }

Year
  = approx:ApproxLabel? _ year:YearSpec _ bce:BCECoeff? { return toYearObj(bceCoeff(bce) * year, approx) }

YearSpec
  = year:Integer YearCenturySuffix? _ YearLabel? { return year }

YearCenturySuffix
 = "-го" / "го" / "-й" / "й"

YearLabel
  = "года" / "год" / "г." / "г"

Century
  = approx:ApproxLabel? _ x1:CenturyX? x2:CenturyX? x3:CenturyX? tail:CenturyTail? YearCenturySuffix? _ CenturyLabel? _ bce:BCECoeff? {
    return toCenturyObj(bceCoeff(bce) * (coalesce(x1,0) + coalesce(x2,0) + coalesce(x3,0) + coalesce(tail,0)), approx);
  }

CenturyX
  = "X" { return 10 }

CenturyTail
  = "IX" { return 9 }
  / "VIII" { return 8 }
  / "VII" { return 7 }
  / "VI" { return 6 }
  / "V" { return 5 }
  / "IV" { return 4 }
  / "III" { return 3 }
  / "II" { return 2 }
  / "I" { return 1 }

CenturyLabel
  = "века" / "век" / "в." / "в"

ApproxLabel
  = ApproxBeginLabel { return 'begin' }
  / ApproxEndLabel { return 'end' }
  / ApproxHalfSpec

ApproxBeginLabel
  = "начало" / "нач." / "нач"

ApproxEndLabel
  = "конец" / "кон." / "кон"

ApproxHalfSpec
  = ApproxFirstHalfLabel _ ApproxHalfLabel { return 'first_half' }
  / ApproxSecondHalfLabel _ ApproxHalfLabel { return 'second_half' }

ApproxFirstHalfLabel
  = "1-я" / "1"

ApproxSecondHalfLabel
  = "2-я" / "2"

ApproxHalfLabel
  = "половина" / "пол." / "пол"

BCECoeff
  = before:BeforeLabel? _ OurLabel _ EraLabel { return before === null ? 1 : -1 }

BeforeLabel = "д." / "до"
OurLabel = "н." / "нашей"
EraLabel = "э." / "эры"

Integer
  = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ ]*