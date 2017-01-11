{
  function coalesce(val, def) {
    return val === null ? def : val;
  }
  function bceCoeff(bceCoeffNullable) {
  	return coalesce(bceCoeffNullable, 1);
  }
  function toDateObj(year, month, day) {
    return {
      type: 'date',
      year: year,
      month: month,
      day: day,
    };
  }
  function toYearObj(year) {
    return {
      type: 'year',
      year: year,
    };
  }
  function toCenturyObj(century) {
    return {
      type: 'century',
      century: century,
    };
  }
}

Expression
 = Date / Year / Century

Date
  = day:Integer "." month:Integer "." year:Integer _ bce:BCECoeff? { return toDateObj(bceCoeff(bce) * year, month, day) }

Year
  = year:Integer _ YearLabel? _ bce:BCECoeff? { return toYearObj(bceCoeff(bce) * year) }

YearLabel
  = "год" / "г." / "г"

Century
  = x1:CenturyX? x2:CenturyX? x3:CenturyX? tail:CenturyTail? _ CenturyLabel? _ bce:BCECoeff? {
    return toCenturyObj(bceCoeff(bce) * (coalesce(x1,0) + coalesce(x2,0) + coalesce(x3,0) + coalesce(tail,0)));
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
     = "век" / "в." / "в"

BCECoeff
  = before:BeforeLabel? _ OurLabel _ EraLabel { return before === null ? 1 : -1 }

BeforeLabel = "д." / "до"
OurLabel = "н." / "нашей"
EraLabel = "э." / "эры"

Integer
  = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ ]*