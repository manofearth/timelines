Expression
 = Date / Year / Century

Date
  = day:Integer "." month:Integer "." year:Integer { return year  }
  / month:Integer "/" day:Integer "/" year:Integer { return year  }

Year
  = year:Integer _ YearLabel { return year }
  / Integer

YearLabel
  = "год" / "г." / "г"

Century
  = parts:CenturyPart+ { return parts.reduce(function(sum, curr) { return sum + curr }) }

CenturyPart
  =
  "IV" { return 4 }
  / "IX" { return 9 }
  / "X" { return 10 }
  / "V" { return 5 }
  / "I" { return 1 }

Integer
  = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ ]*