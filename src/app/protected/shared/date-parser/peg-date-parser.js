/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */

"use strict";

function peg$subclass(child, parent) {
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}

function peg$SyntaxError(message, expected, found, location) {
  this.message  = message;
  this.expected = expected;
  this.found    = found;
  this.location = location;
  this.name     = "SyntaxError";

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function(expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array
              ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
              : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function(expectation) {
          return "any character";
        },

        end: function(expectation) {
          return "end of input";
        },

        other: function(expectation) {
          return expectation.description;
        }
      };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g,  '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g,  '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i, j;

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== void 0 ? options : {};

  var peg$FAILED = {},

      peg$startRuleFunctions = { Expression: peg$parseExpression },
      peg$startRuleFunction  = peg$parseExpression,

      peg$c0 = ".",
      peg$c1 = peg$literalExpectation(".", false),
      peg$c2 = function(day, month, year, bce) { return toDateObj(bceCoeff(bce) * year, month, day) },
      peg$c3 = function(approx, year, bce) { return toYearObj(bceCoeff(bce) * year, approx) },
      peg$c4 = function(year) { return year },
      peg$c5 = "-\u0433\u043E",
      peg$c6 = peg$literalExpectation("-\u0433\u043E", false),
      peg$c7 = "\u0433\u043E",
      peg$c8 = peg$literalExpectation("\u0433\u043E", false),
      peg$c9 = "-\u0439",
      peg$c10 = peg$literalExpectation("-\u0439", false),
      peg$c11 = "\u0439",
      peg$c12 = peg$literalExpectation("\u0439", false),
      peg$c13 = "\u0433\u043E\u0434\u0430",
      peg$c14 = peg$literalExpectation("\u0433\u043E\u0434\u0430", false),
      peg$c15 = "\u0433\u043E\u0434",
      peg$c16 = peg$literalExpectation("\u0433\u043E\u0434", false),
      peg$c17 = "\u0433.",
      peg$c18 = peg$literalExpectation("\u0433.", false),
      peg$c19 = "\u0433",
      peg$c20 = peg$literalExpectation("\u0433", false),
      peg$c21 = function(approx, x1, x2, x3, tail, bce) {
          return toCenturyObj(bceCoeff(bce) * (coalesce(x1,0) + coalesce(x2,0) + coalesce(x3,0) + coalesce(tail,0)), approx);
        },
      peg$c22 = "X",
      peg$c23 = peg$literalExpectation("X", false),
      peg$c24 = function() { return 10 },
      peg$c25 = "IX",
      peg$c26 = peg$literalExpectation("IX", false),
      peg$c27 = function() { return 9 },
      peg$c28 = "VIII",
      peg$c29 = peg$literalExpectation("VIII", false),
      peg$c30 = function() { return 8 },
      peg$c31 = "VII",
      peg$c32 = peg$literalExpectation("VII", false),
      peg$c33 = function() { return 7 },
      peg$c34 = "VI",
      peg$c35 = peg$literalExpectation("VI", false),
      peg$c36 = function() { return 6 },
      peg$c37 = "V",
      peg$c38 = peg$literalExpectation("V", false),
      peg$c39 = function() { return 5 },
      peg$c40 = "IV",
      peg$c41 = peg$literalExpectation("IV", false),
      peg$c42 = function() { return 4 },
      peg$c43 = "III",
      peg$c44 = peg$literalExpectation("III", false),
      peg$c45 = function() { return 3 },
      peg$c46 = "II",
      peg$c47 = peg$literalExpectation("II", false),
      peg$c48 = function() { return 2 },
      peg$c49 = "I",
      peg$c50 = peg$literalExpectation("I", false),
      peg$c51 = function() { return 1 },
      peg$c52 = "\u0432\u0435\u043A\u0430",
      peg$c53 = peg$literalExpectation("\u0432\u0435\u043A\u0430", false),
      peg$c54 = "\u0432\u0435\u043A",
      peg$c55 = peg$literalExpectation("\u0432\u0435\u043A", false),
      peg$c56 = "\u0432.",
      peg$c57 = peg$literalExpectation("\u0432.", false),
      peg$c58 = "\u0432",
      peg$c59 = peg$literalExpectation("\u0432", false),
      peg$c60 = function() { return 'begin' },
      peg$c61 = function() { return 'end' },
      peg$c62 = "\u043D\u0430\u0447\u0430\u043B\u043E",
      peg$c63 = peg$literalExpectation("\u043D\u0430\u0447\u0430\u043B\u043E", false),
      peg$c64 = "\u043D\u0430\u0447.",
      peg$c65 = peg$literalExpectation("\u043D\u0430\u0447.", false),
      peg$c66 = "\u043D\u0430\u0447",
      peg$c67 = peg$literalExpectation("\u043D\u0430\u0447", false),
      peg$c68 = "\u043A\u043E\u043D\u0435\u0446",
      peg$c69 = peg$literalExpectation("\u043A\u043E\u043D\u0435\u0446", false),
      peg$c70 = "\u043A\u043E\u043D.",
      peg$c71 = peg$literalExpectation("\u043A\u043E\u043D.", false),
      peg$c72 = "\u043A\u043E\u043D",
      peg$c73 = peg$literalExpectation("\u043A\u043E\u043D", false),
      peg$c74 = function() { return 'first_half' },
      peg$c75 = function() { return 'second_half' },
      peg$c76 = "1-\u044F",
      peg$c77 = peg$literalExpectation("1-\u044F", false),
      peg$c78 = "1",
      peg$c79 = peg$literalExpectation("1", false),
      peg$c80 = "2-\u044F",
      peg$c81 = peg$literalExpectation("2-\u044F", false),
      peg$c82 = "2",
      peg$c83 = peg$literalExpectation("2", false),
      peg$c84 = "\u043F\u043E\u043B\u043E\u0432\u0438\u043D\u0430",
      peg$c85 = peg$literalExpectation("\u043F\u043E\u043B\u043E\u0432\u0438\u043D\u0430", false),
      peg$c86 = "\u043F\u043E\u043B.",
      peg$c87 = peg$literalExpectation("\u043F\u043E\u043B.", false),
      peg$c88 = "\u043F\u043E\u043B",
      peg$c89 = peg$literalExpectation("\u043F\u043E\u043B", false),
      peg$c90 = function(before) { return before === null ? 1 : -1 },
      peg$c91 = "\u0434.",
      peg$c92 = peg$literalExpectation("\u0434.", false),
      peg$c93 = "\u0434\u043E",
      peg$c94 = peg$literalExpectation("\u0434\u043E", false),
      peg$c95 = "\u043D.",
      peg$c96 = peg$literalExpectation("\u043D.", false),
      peg$c97 = "\u043D\u0430\u0448\u0435\u0439",
      peg$c98 = peg$literalExpectation("\u043D\u0430\u0448\u0435\u0439", false),
      peg$c99 = "\u044D.",
      peg$c100 = peg$literalExpectation("\u044D.", false),
      peg$c101 = "\u044D\u0440\u044B",
      peg$c102 = peg$literalExpectation("\u044D\u0440\u044B", false),
      peg$c103 = /^[0-9]/,
      peg$c104 = peg$classExpectation([["0", "9"]], false, false),
      peg$c105 = function() { return parseInt(text(), 10); },
      peg$c106 = peg$otherExpectation("whitespace"),
      peg$c107 = /^[ ]/,
      peg$c108 = peg$classExpectation([" "], false, false),

      peg$currPos          = 0,
      peg$savedPos         = 0,
      peg$posDetailsCache  = [{ line: 1, column: 1 }],
      peg$maxFailPos       = 0,
      peg$maxFailExpected  = [],
      peg$silentFails      = 0,

      peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos], p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line:   details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;
      return details;
    }
  }

  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos),
        endPosDetails   = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line:   startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line:   endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$parseExpression() {
    var s0;

    s0 = peg$parseDate();
    if (s0 === peg$FAILED) {
      s0 = peg$parseYear();
      if (s0 === peg$FAILED) {
        s0 = peg$parseCentury();
      }
    }

    return s0;
  }

  function peg$parseDate() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseInteger();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 46) {
        s2 = peg$c0;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c1); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseInteger();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 46) {
            s4 = peg$c0;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c1); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseInteger();
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseBCECoeff();
                if (s7 === peg$FAILED) {
                  s7 = null;
                }
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c2(s1, s3, s5, s7);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseYear() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseApproxLabel();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseYearSpec();
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseBCECoeff();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c3(s1, s3, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseYearSpec() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$parseInteger();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseYearCenturySuffix();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseYearLabel();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c4(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseYearCenturySuffix() {
    var s0;

    if (input.substr(peg$currPos, 3) === peg$c5) {
      s0 = peg$c5;
      peg$currPos += 3;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c6); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 2) === peg$c7) {
        s0 = peg$c7;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c9) {
          s0 = peg$c9;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c10); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 1081) {
            s0 = peg$c11;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c12); }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseYearLabel() {
    var s0;

    if (input.substr(peg$currPos, 4) === peg$c13) {
      s0 = peg$c13;
      peg$currPos += 4;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c14); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 3) === peg$c15) {
        s0 = peg$c15;
        peg$currPos += 3;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c16); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c17) {
          s0 = peg$c17;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c18); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 1075) {
            s0 = peg$c19;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c20); }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseCentury() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;

    s0 = peg$currPos;
    s1 = peg$parseApproxLabel();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseCenturyX();
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseCenturyX();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseCenturyX();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parseCenturyTail();
              if (s6 === peg$FAILED) {
                s6 = null;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parseYearCenturySuffix();
                if (s7 === peg$FAILED) {
                  s7 = null;
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse_();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parseCenturyLabel();
                    if (s9 === peg$FAILED) {
                      s9 = null;
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parse_();
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parseBCECoeff();
                        if (s11 === peg$FAILED) {
                          s11 = null;
                        }
                        if (s11 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c21(s1, s3, s4, s5, s6, s11);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseCenturyX() {
    var s0, s1;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 88) {
      s1 = peg$c22;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c23); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c24();
    }
    s0 = s1;

    return s0;
  }

  function peg$parseCenturyTail() {
    var s0, s1;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c25) {
      s1 = peg$c25;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c26); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c27();
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c28) {
        s1 = peg$c28;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c30();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 3) === peg$c31) {
          s1 = peg$c31;
          peg$currPos += 3;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c32); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c33();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c34) {
            s1 = peg$c34;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c35); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c36();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 86) {
              s1 = peg$c37;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c38); }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c39();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c40) {
                s1 = peg$c40;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c41); }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c42();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 3) === peg$c43) {
                  s1 = peg$c43;
                  peg$currPos += 3;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c44); }
                }
                if (s1 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c45();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.substr(peg$currPos, 2) === peg$c46) {
                    s1 = peg$c46;
                    peg$currPos += 2;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c47); }
                  }
                  if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c48();
                  }
                  s0 = s1;
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 73) {
                      s1 = peg$c49;
                      peg$currPos++;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c50); }
                    }
                    if (s1 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c51();
                    }
                    s0 = s1;
                  }
                }
              }
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseCenturyLabel() {
    var s0;

    if (input.substr(peg$currPos, 4) === peg$c52) {
      s0 = peg$c52;
      peg$currPos += 4;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c53); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 3) === peg$c54) {
        s0 = peg$c54;
        peg$currPos += 3;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c55); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c56) {
          s0 = peg$c56;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c57); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 1074) {
            s0 = peg$c58;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c59); }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseApproxLabel() {
    var s0, s1;

    s0 = peg$currPos;
    s1 = peg$parseApproxBeginLabel();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c60();
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseApproxEndLabel();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c61();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$parseApproxHalfSpec();
      }
    }

    return s0;
  }

  function peg$parseApproxBeginLabel() {
    var s0;

    if (input.substr(peg$currPos, 6) === peg$c62) {
      s0 = peg$c62;
      peg$currPos += 6;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c63); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 4) === peg$c64) {
        s0 = peg$c64;
        peg$currPos += 4;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c65); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c66) {
          s0 = peg$c66;
          peg$currPos += 3;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c67); }
        }
      }
    }

    return s0;
  }

  function peg$parseApproxEndLabel() {
    var s0;

    if (input.substr(peg$currPos, 5) === peg$c68) {
      s0 = peg$c68;
      peg$currPos += 5;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c69); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 4) === peg$c70) {
        s0 = peg$c70;
        peg$currPos += 4;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c71); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c72) {
          s0 = peg$c72;
          peg$currPos += 3;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c73); }
        }
      }
    }

    return s0;
  }

  function peg$parseApproxHalfSpec() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseApproxFirstHalfLabel();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseApproxHalfLabel();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c74();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseApproxSecondHalfLabel();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseApproxHalfLabel();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c75();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parseApproxFirstHalfLabel() {
    var s0;

    if (input.substr(peg$currPos, 3) === peg$c76) {
      s0 = peg$c76;
      peg$currPos += 3;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c77); }
    }
    if (s0 === peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 49) {
        s0 = peg$c78;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c79); }
      }
    }

    return s0;
  }

  function peg$parseApproxSecondHalfLabel() {
    var s0;

    if (input.substr(peg$currPos, 3) === peg$c80) {
      s0 = peg$c80;
      peg$currPos += 3;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c81); }
    }
    if (s0 === peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 50) {
        s0 = peg$c82;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c83); }
      }
    }

    return s0;
  }

  function peg$parseApproxHalfLabel() {
    var s0;

    if (input.substr(peg$currPos, 8) === peg$c84) {
      s0 = peg$c84;
      peg$currPos += 8;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c85); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 4) === peg$c86) {
        s0 = peg$c86;
        peg$currPos += 4;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c87); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c88) {
          s0 = peg$c88;
          peg$currPos += 3;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c89); }
        }
      }
    }

    return s0;
  }

  function peg$parseBCECoeff() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseBeforeLabel();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseOurLabel();
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseEraLabel();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c90(s1);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseBeforeLabel() {
    var s0;

    if (input.substr(peg$currPos, 2) === peg$c91) {
      s0 = peg$c91;
      peg$currPos += 2;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c92); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 2) === peg$c93) {
        s0 = peg$c93;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c94); }
      }
    }

    return s0;
  }

  function peg$parseOurLabel() {
    var s0;

    if (input.substr(peg$currPos, 2) === peg$c95) {
      s0 = peg$c95;
      peg$currPos += 2;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c96); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 5) === peg$c97) {
        s0 = peg$c97;
        peg$currPos += 5;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c98); }
      }
    }

    return s0;
  }

  function peg$parseEraLabel() {
    var s0;

    if (input.substr(peg$currPos, 2) === peg$c99) {
      s0 = peg$c99;
      peg$currPos += 2;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c100); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 3) === peg$c101) {
        s0 = peg$c101;
        peg$currPos += 3;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c102); }
      }
    }

    return s0;
  }

  function peg$parseInteger() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = [];
    if (peg$c103.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c104); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c103.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c104); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c105();
    }
    s0 = s1;

    return s0;
  }

  function peg$parse_() {
    var s0, s1;

    peg$silentFails++;
    s0 = [];
    if (peg$c107.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c108); }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      if (peg$c107.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c108); }
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c106); }
    }

    return s0;
  }


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


  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

module.exports = {
  SyntaxError: peg$SyntaxError,
  parse:       peg$parse
};
