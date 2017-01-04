{
  function coalesce(val, def) {
    if(val === null) { return def }
    else { return val }
  }
  function toDateObj(year, month, day) {
    return {
      year: year,
      month: month ? month : 1,
      day: day ? day : 1
    };
  }
}

Expression
 = Date / Year / Century

Date
  = day:Integer "." month:Integer "." year:Integer { return toDateObj(year, month, day)  }

Year
  = year:Integer _? YearLabel? { return toDateObj(year) }

YearLabel
  = "год" / "г." / "г"

Century
  = x1:CenturyX? x2:CenturyX? x3:CenturyX? tail:CenturyTail? _? CenturyLabel? {
    return toDateObj((coalesce(x1,0) + coalesce(x2,0) + coalesce(x3,0) + coalesce(tail,0)) * 100);
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

Integer
  = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ ]*