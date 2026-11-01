/* Learn with Pip — marking engine.
   Follows the conventions of the published KS2 mathematics mark schemes (Standards & Testing Agency):
   - one mark per answer unless the question is a multi-step problem worth 2 marks;
   - 2-mark problems: 2 marks for the correct answer; otherwise 1 mark for an appropriate method,
     with no more than one arithmetic error ("answer need not be obtained for the award of ONE mark");
   - equivalent fractions and mixed numbers accepted unless the question asks for a particular form;
   - money must use correct notation (e.g. £3.50, not £3.5; do not mix £ and p);
   - coordinates must be in the right order; 24-hour times must not use am/pm. */
(function (G) {
  'use strict';
  var OM = G.OM;

  function result(ok, max, notes) { return { score: ok ? max : 0, max: max, correct: !!ok, notes: notes || [] }; }
  function str(r) { return r === null || r === undefined ? '' : String(r).trim(); }
  function normMinus(s) { return str(s).replace(/[−–—]/g, '-'); }

  // ---------- 24h / 12h time parsing ----------
  // Returns {mins, hasAmPm, ampm} or null. Accepts 14:30, 14.30, 1430, 2:30pm, 2.30 p.m.
  OM.parseTime = function (s) {
    s = str(s).toLowerCase().replace(/\s+/g, '').replace(/\./g, function (m, i, all) { return ':'; });
    var ampm = null;
    var m = /(a:?m:?|p:?m:?)$/.exec(s);
    if (m) { ampm = m[1][0] === 'a' ? 'am' : 'pm'; s = s.slice(0, m.index); }
    s = s.replace(/:+$/, '');
    var h, mi;
    var mm = /^(\d{1,2}):(\d{2})$/.exec(s);
    if (mm) { h = +mm[1]; mi = +mm[2]; }
    else if (/^\d{3,4}$/.test(s)) { h = +s.slice(0, s.length - 2); mi = +s.slice(-2); }
    else if (/^\d{1,2}$/.test(s) && ampm) { h = +s; mi = 0; }
    else return null;
    if (mi > 59) return null;
    if (ampm) {
      if (h < 1 || h > 12) return null;
      var h24 = (h % 12) + (ampm === 'pm' ? 12 : 0);
      return { mins: h24 * 60 + mi, hasAmPm: true, ampm: ampm, h: h, m: mi, raw: s };
    }
    if (h > 23) return null;
    return { mins: h * 60 + mi, hasAmPm: false, h: h, m: mi, raw: s, fourDigit: /^\d{2}:?\d{2}$/.test(s) };
  };
  OM.time24 = function (mins) { var h = Math.floor(mins / 60) % 24, m = mins % 60; return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; };
  OM.time12 = function (mins, withAmPm) {
    var h = Math.floor(mins / 60) % 24, m = mins % 60, ap = h < 12 ? 'am' : 'pm', h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ':' + (m < 10 ? '0' : '') + m + (withAmPm ? ' ' + ap : '');
  };

  // ---------- Roman numerals ----------
  var ROMAN = [[100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  OM.toRoman = function (n) { var s = ''; ROMAN.forEach(function (p) { while (n >= p[0]) { s += p[1]; n -= p[0]; } }); return s; };

  // ---------- Fraction response {w, n, d} -> {num, den} as improper ----------
  function fracValue(r) {
    if (!r) return null;
    var w = str(r.w) === '' ? 0 : OM.parseIntLoose(r.w), n = OM.parseIntLoose(r.n), d = OM.parseIntLoose(r.d);
    if (w === null || n === null || d === null || d <= 0 || n < 0 || w < 0) return null;
    return { num: w * d + n, den: d, w: w, n: n, d: d };
  }

  // ---------- Kinds of answer check ----------
  var K = OM.checkKinds = {};

  K.int = function (c, r) {
    var v = OM.parseIntLoose(r);
    if (v === null) {
      if (/^-?\d+\.0+$/.test(normMinus(r)) && parseInt(r, 10) === c.value) return result(true, 1);
      return result(false, 1, str(r) === '' ? ['No answer given.'] : ['"' + str(r) + '" is not written as a whole number.']);
    }
    return result(v === c.value, 1);
  };

  K.dec = function (c, r) {
    var dp = Math.max(OM.decimalPlaces(c.value), 3);
    var want = OM.parseScaled(c.value, dp), got = OM.parseScaled(r, dp);
    if (got === null) return result(false, 1, str(r) === '' ? ['No answer given.'] : ['"' + str(r) + '" is not written as a number.']);
    return result(got === want, 1);
  };

  // c.pence, c.box: '£' (answer box shows £), 'p' (box shows p) or undefined (child writes the unit)
  K.money = function (c, r) {
    var s = str(r).replace(/\s+/g, '').toLowerCase();
    if (s === '') return result(false, 1, ['No answer given.']);
    var hasPound = s.indexOf('£') >= 0, hasP = /p$/.test(s);
    var body = s.replace('£', '').replace(/p$/, '');
    if (hasPound && hasP) return result(false, 1, ['Money must not mix £ and p (e.g. £3.50p is not accepted).']);
    if (c.box === 'p' || (hasP && !hasPound)) {
      var p = OM.parseIntLoose(body);
      if (p === null) return result(false, 1, ['Pence must be a whole number.']);
      return result(p === c.pence, 1);
    }
    if (c.box !== '£' && !hasPound) {
      // No unit written in a free answer box
      var v = OM.parseIntLoose(body);
      if (v !== null && v === c.pence) return result(true, 1, ['Tip: write the units, e.g. ' + OM.money(c.pence) + '.']);
    }
    var dps = OM.decimalPlaces(body);
    if (dps === 1) return result(false, 1, ['Money in pounds needs two digits for the pence, e.g. £3.50 not £3.5.']);
    if (dps > 2) return result(false, 1, ['Too many decimal places for money.']);
    var got = OM.parseScaled(body, 2);
    if (got === null) return result(false, 1, ['That is not written as an amount of money.']);
    return result(got === c.pence, 1);
  };

  // c.n, c.d; c.form: 'any' (default: any equivalent incl. mixed), 'denominator' (must have denominator c.denom),
  // 'simplest' (must be in simplest form)
  K.frac = function (c, r) {
    var v = fracValue(r);
    if (!v) return result(false, 1, ['Write a fraction with a whole-number numerator and denominator.']);
    var eq = v.num * c.d === c.n * v.den;
    if (!eq) return result(false, 1);
    if (c.form === 'denominator' && v.d !== c.denom) return result(false, 1, ['The question asks for a fraction with a denominator of ' + c.denom + '.']);
    if (c.form === 'simplest' && (OM.gcd(v.n, v.d) !== 1 || v.n >= v.d && v.d !== 1)) return result(false, 1, ['The question asks for the simplest form.']);
    if (c.noMixed && v.w) return result(false, 1, ['Write it as a fraction, not a mixed number.']);
    return result(true, 1);
  };

  K.choice = function (c, r) {
    if (r === null || r === undefined || r === '') return result(false, 1, ['No answer chosen.']);
    return result(String(r) === String(c.value), 1);
  };

  // a number written in words: "three hundred and forty-five" (with or without "and", hyphens or spaces)
  K.words = function (c, r) {
    var t = str(r);
    if (t === '') return result(false, 1, ['No answer given.']);
    if (/\d/.test(t)) return result(false, 1, ['Write the number in words, not digits.']);
    var v = OM.kit.fromWords(t);
    if (v === null) return result(false, 1, ['Check the spelling of each number word.']);
    return result(v === c.value, 1);
  };

  K.roman = function (c, r) {
    var s = str(r).toUpperCase();
    if (!/^[IVXLC]+$/.test(s)) return result(false, 1, ['Use the Roman numerals I, V, X, L and C.']);
    if (s === c.value) return result(true, 1);
    return result(false, 1);
  };

  K.coord = function (c, r) {
    r = r || {};
    var x = OM.parseIntLoose(r.x), y = OM.parseIntLoose(r.y);
    if (x === null || y === null) return result(false, 1, ['Write both coordinates as whole numbers.']);
    if (x === c.x && y === c.y) return result(true, 1);
    if (x === c.y && y === c.x && c.x !== c.y) return result(false, 1, ['The coordinates are the wrong way round: go along (x) first, then up (y).']);
    return result(false, 1);
  };

  // c.mins; c.format '24' | '12' (am/pm required) | 'clock' (12-hour, am/pm optional)
  K.time = function (c, r) {
    var t = OM.parseTime(r);
    if (!t) return result(false, 1, ['That is not written as a time, e.g. 14:30 or 2:30 pm.']);
    if (c.format === '24') {
      if (t.hasAmPm) return result(false, 1, ['24-hour times do not use am or pm.']);
      var ok = t.mins === c.mins;
      return result(ok, 1, ok && !t.fourDigit ? ['Tip: 24-hour times are written with four digits, e.g. ' + OM.time24(c.mins) + '.'] : []);
    }
    if (c.format === '12') {
      if (!t.hasAmPm) return result(false, 1, ['12-hour times need am or pm here.']);
      return result(t.mins === c.mins, 1);
    }
    // 'clock': reading an analogue clock, am/pm optional
    if (t.hasAmPm) return result(t.mins % 720 === c.mins % 720, 1);
    return result(t.h >= 1 && t.h <= 12 && (t.h % 12) * 60 + t.m === c.mins % 720, 1);
  };

  K.cells = function (c, r) {
    var got = (r || []).slice().sort().join('|'), want = c.cells.slice().sort().join('|');
    return result(got === want, 1, got === want ? [] : ['Check every square: each shaded square needs a partner the same distance from the mirror line on the other side.']);
  };

  // c.validate(cells) for open answers like "shade a rectangle with area 12"
  K.cellsRule = function (c, r) {
    var v = OM.cellRules[c.rule](r || [], c);
    return result(v.ok, 1, v.notes);
  };
  OM.cellRules = {
    rectangleArea: function (cells, c) {
      if (cells.length !== c.area) return { ok: false, notes: ['You shaded ' + cells.length + ' squares; the area needs to be ' + c.area + ' squares.'] };
      var xs = cells.map(function (k) { return +k.split(',')[0]; }), ys = cells.map(function (k) { return +k.split(',')[1]; });
      var w = Math.max.apply(null, xs) - Math.min.apply(null, xs) + 1, h = Math.max.apply(null, ys) - Math.min.apply(null, ys) + 1;
      if (w * h !== c.area) return { ok: false, notes: ['The squares need to make a rectangle (no gaps, straight sides).'] };
      return { ok: true, notes: [] };
    }
  };

  K.order = function (c, r) {
    r = r || [];
    if (r.length !== c.order.length) return result(false, 1, ['Put every item in order.']);
    return result(r.map(String).join('|') === c.order.map(String).join('|'), 1);
  };

  // Several blanks marked together. c.parts: [check...]; c.rule 'all' (default) or {each:true} (1 mark per part)
  K.multi = function (c, r) {
    r = r || [];
    var parts = c.parts.map(function (p, i) { return mark1(p, r[i]); });
    var right = parts.filter(function (p) { return p.correct; }).length;
    var notes = [];
    parts.forEach(function (p, i) { p.notes.forEach(function (n) { notes.push((c.parts.length > 1 ? 'Part ' + (i + 1) + ': ' : '') + n); }); });
    if (c.each) return { score: right, max: c.parts.length, correct: right === c.parts.length, notes: notes, parts: parts };
    return { score: right === c.parts.length ? 1 : 0, max: 1, correct: right === c.parts.length, notes: notes, parts: parts };
  };

  // Two-mark problem with working. c.final: a check; c.plan: steps [{op, a, b}] where operands are {g: value, alt:[..]} or {s: index}
  K.working = function (c, r) {
    r = r || {};
    var fin = mark1(c.final, r.answer);
    if (fin.correct) return { score: 2, max: 2, correct: true, notes: ['Correct answer: 2 marks.'] };
    // A problem may have several valid methods (e.g. a − b − c or a − (b + c)); use the best match.
    var m = null;
    (c.plans || [c.plan]).forEach(function (plan) {
      var mm = OM.matchMethod(plan, r.lines || []);
      mm.steps = plan.length;
      if (!m || (mm.method && mm.errors <= 1 && !(m.method && m.errors <= 1)) || (!m.method && mm.found / mm.steps > m.found / m.steps)) m = mm;
    });
    var notes = fin.notes.slice();
    if (m.method && m.errors <= 1) {
      notes.push('Method mark: your working shows an appropriate method' + (m.errors ? ' with one arithmetic error' : '') + ', so you get 1 mark.');
      return { score: 1, max: 2, correct: false, notes: notes, method: m };
    }
    if (m.method && m.errors > 1) notes.push('Your method was right, but there was more than one arithmetic error, so no method mark.');
    else if (m.found > 0) notes.push('Your working shows part of the method (' + m.found + ' of ' + m.steps + ' steps). The method mark needs every step.');
    else notes.push('Show your working in the boxes to earn a method mark, even if your answer is wrong.');
    return { score: 0, max: 2, correct: false, notes: notes, method: m };
  };

  function mark1(check, resp) {
    var f = K[check.kind];
    if (!f) throw new Error('Unknown check kind ' + check.kind);
    return f(check, resp);
  }
  OM.markCheck = mark1;

  // ---------- Working-line parser ----------
  // "345 + 278 = 623", "623 − 150", "3 × 45 + 120 = 255" -> list of binary steps with stated / computed results.
  function tokenize(s) {
    s = s.replace(/[−–—]/g, '-').replace(/[×xX*]/g, '*').replace(/[÷\/]/g, '/').replace(/£/g, '').replace(/(\d)p\b/g, '$1')
      .replace(/(\d),(\d{3})/g, '$1$2').replace(/\s+/g, '');
    var toks = [], re = /(\d+(?:\.\d+)?)|([+\-*\/()=])/g, m, pos = 0;
    while ((m = re.exec(s))) {
      if (m.index !== pos) return null;
      pos = re.lastIndex;
      toks.push(m[1] !== undefined ? { t: 'n', v: parseFloat(m[1]) } : { t: m[2] });
    }
    return pos === s.length ? toks : null;
  }
  function round6(x) { return Math.round(x * 1e6) / 1e6; }
  function applyOp(op, a, b) { return round6(op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b); }
  OM.parseWorkingLine = function (line) {
    var toks = tokenize(String(line || ''));
    if (!toks || !toks.length) return [];
    var eq = -1;
    for (var i = 0; i < toks.length; i++) if (toks[i].t === '=') { eq = i; break; }
    var lhs = eq >= 0 ? toks.slice(0, eq) : toks, rhs = eq >= 0 ? toks.slice(eq + 1) : [];
    var stated = (rhs.length === 1 && rhs[0].t === 'n') ? rhs[0].v : null;
    var steps = [], p = 0;
    function prim() {
      var t = lhs[p];
      if (!t) throw 0;
      if (t.t === 'n') { p++; return { v: t.v }; }
      if (t.t === '(') { p++; var e = expr(); if (!lhs[p] || lhs[p].t !== ')') throw 0; p++; return e; }
      throw 0;
    }
    function term() {
      var a = prim();
      while (lhs[p] && (lhs[p].t === '*' || lhs[p].t === '/')) { var op = lhs[p++].t; var b = prim(); a = mk(op, a, b); }
      return a;
    }
    function expr() {
      var a = term();
      while (lhs[p] && (lhs[p].t === '+' || lhs[p].t === '-')) { var op = lhs[p++].t; var b = term(); a = mk(op, a, b); }
      return a;
    }
    function mk(op, a, b) { var st = { op: op, a: a.v, b: b.v, result: applyOp(op, a.v, b.v), stated: false }; steps.push(st); return { v: st.result, step: st }; }
    try {
      var root = expr();
      if (p !== lhs.length) return [];
      if (steps.length && stated !== null) {
        var last = steps[steps.length - 1];
        last.trueResult = last.result; last.result = stated; last.stated = true;
      } else if (!steps.length && stated !== null) return [];
      if (root && !root.step && stated !== null) return [];
    } catch (e) { return []; }
    return steps;
  };

  OM.matchMethod = function (plan, lines) {
    var pool = [];
    lines.forEach(function (l) { pool = pool.concat(OM.parseWorkingLine(l)); });
    var errors = pool.filter(function (s) { return s.stated && Math.abs(s.result - s.trueResult) > 1e-6; }).length;
    var used = [], found = 0, matched = [];
    function trueVal(i) {
      var st = plan[i];
      var a = st.a.s !== undefined ? trueVal(st.a.s) : st.a.g, b = st.b.s !== undefined ? trueVal(st.b.s) : st.b.g;
      return applyOp(st.op, a, b);
    }
    function okOperand(spec, v) {
      if (spec.s !== undefined) {
        var cands = [trueVal(spec.s)];
        if (matched[spec.s]) cands.push(matched[spec.s].result);
        return cands.some(function (c) { return Math.abs(c - v) < 1e-6; });
      }
      return [spec.g].concat(spec.alt || []).some(function (c) { return Math.abs(c - v) < 1e-6; });
    }
    for (var i = 0; i < plan.length; i++) {
      var st = plan[i], hit = null;
      for (var j = 0; j < pool.length && !hit; j++) {
        if (used.indexOf(j) >= 0 || pool[j].op !== st.op) continue;
        var ps = pool[j];
        var direct = okOperand(st.a, ps.a) && okOperand(st.b, ps.b);
        var swapped = (st.op === '+' || st.op === '*') && okOperand(st.a, ps.b) && okOperand(st.b, ps.a);
        if (direct || swapped) hit = j;
      }
      if (hit !== null) { used.push(hit); matched[i] = pool[hit]; found++; }
    }
    return { method: found === plan.length, found: found, errors: errors };
  };

  // ---------- Public marking API ----------
  OM.mark = function (q, resp) {
    var res = mark1(q.check, resp && resp.answer !== undefined && q.check.kind !== 'working' && q.check.kind !== 'steps' ? resp.answer : resp);
    if (q.check.kind !== 'working' && q.marks === 2 && res.max === 1) { res.max = 2; res.score *= 2; }
    if (!res.correct && q.input && q.input.type === 'column' && resp && resp.cells) {
      res.notes = res.notes.concat(OM.diagnoseColumn(q, resp));
    }
    if (!res.correct && q.diagnose) res.notes = res.notes.concat(q.diagnose(resp) || []);
    return res;
  };

  // What a perfect answer looks like, for each kind (used by the automated checks and the parent review mode)
  OM.canonicalResponse = function (c) {
    switch (c.kind) {
      case 'int': return OM.fmt(c.value).replace('−', '-');
      case 'dec': return c.value;
      case 'money': return c.box === 'p' ? String(c.pence) : (c.box === '£' ? OM.fromScaled(c.pence, 2) : OM.pounds(c.pence));
      case 'frac': return c.form === 'denominator' ? { w: '', n: String(c.n * c.denom / c.d), d: String(c.denom) } : { w: '', n: String(c.n), d: String(c.d) };
      case 'choice': return c.value;
      case 'roman': return c.value;
      case 'words': return OM.kit.toWords(c.value);
      case 'coord': return { x: String(c.x), y: String(c.y) };
      case 'time': return c.format === '24' ? OM.time24(c.mins) : OM.time12(c.mins, c.format === '12');
      case 'cells': return c.cells.slice();
      case 'cellsRule': return c.example.slice();
      case 'order': return c.order.slice();
      case 'multi': return c.parts.map(OM.canonicalResponse);
      case 'working': return { lines: c.exampleLines || [], answer: OM.canonicalResponse(c.final) };
    }
    throw new Error('No canonical response for ' + c.kind);
  };
  OM.wrongResponse = function (c) {
    switch (c.kind) {
      case 'int': return String(c.value + 1);
      case 'dec': return OM.fromScaled(OM.parseScaled(c.value, 3) + 1, 3);
      case 'money': return OM.pounds(c.pence + 1);
      case 'frac': return { w: '', n: String(c.n + 1), d: String(c.d) };
      case 'choice': return '__wrong__';
      case 'roman': return c.value + 'I';
      case 'words': return OM.kit.toWords(c.value + 1);
      case 'coord': return { x: String(c.x + 1), y: String(c.y) };
      case 'time': return OM.time24((c.mins + 5) % 1440);
      case 'cells': return c.cells.slice(1);
      case 'cellsRule': return c.example.slice(1);
      case 'order': return c.order.slice().reverse();
      case 'multi': var r = c.parts.map(OM.canonicalResponse); r[0] = OM.wrongResponse(c.parts[0]); return r;
      case 'working': return { lines: [], answer: OM.wrongResponse(c.final) };
    }
  };

  OM.answerTextFor = function (c) {
    switch (c.kind) {
      case 'int': return OM.fmt(c.value);
      case 'dec': return c.value;
      case 'money': return c.box === 'p' ? c.pence + 'p' : OM.pounds(c.pence);
      case 'frac': return c.form === 'denominator' ? OM.frac(c.n * c.denom / c.d, c.denom) : OM.frac(c.n, c.d);
      case 'choice': return c.label || String(c.value);
      case 'roman': return c.value;
      case 'words': return OM.kit.toWords(c.value);
      case 'coord': return '(' + c.x + ', ' + c.y + ')';
      case 'time': return c.format === '24' ? OM.time24(c.mins) : OM.time12(c.mins, c.format === '12');
      case 'cells': return 'the completed shape shown in the solution';
      case 'cellsRule': return 'any correct shape';
      case 'order': return (c.labels || c.order).join(', ');
      case 'multi': return c.parts.map(OM.answerTextFor).join('; ');
      case 'working': return OM.answerTextFor(c.final);
    }
    return '';
  };

  // Examiner-style mark scheme lines for a question
  OM.schemeLines = function (q) {
    var lines = [];
    var c = q.check;
    if (c.kind === 'working') {
      lines.push('Award TWO marks for the correct answer: ' + q.answerText + '.');
      lines.push('If the answer is incorrect, award ONE mark for evidence of an appropriate method, e.g. ' + (c.exampleLines || []).join(' then ') + '. No more than one arithmetic error. Answer need not be obtained for the award of ONE mark.');
    } else {
      lines.push('Award ' + (q.marks === 2 ? 'TWO marks' : 'ONE mark') + ' for: ' + q.answerText);
      if (c.kind === 'multi' && !c.each && c.parts.length > 1) lines.push('All parts must be correct for the mark.');
      if (c.kind === 'frac' && c.form !== 'denominator' && c.form !== 'simplest') lines.push('Accept equivalent fractions' + (c.noMixed ? '.' : ' or an equivalent mixed number.'));
      if (c.kind === 'money' && c.box !== 'p') lines.push('Do not accept incorrect money notation, e.g. £3.5 for £3.50, or £ and p used together (£3.50p).');
      if (c.kind === 'coord') lines.push('Coordinates must be in the correct order (x, y).');
      if (c.kind === 'time' && c.format === '24') lines.push('Do not accept am or pm with a 24-hour time.');
      if (c.kind === 'time' && c.format === '12') lines.push('am or pm must be given.');
      if (c.kind === 'int' && Math.abs(c.value) >= 1000) lines.push('Accept with or without a comma, e.g. ' + OM.fmt(c.value) + ' or ' + c.value + '.');
    }
    (q.accept || []).forEach(function (a) { lines.push('Accept ' + a); });
    (q.reject || []).forEach(function (a) { lines.push('Do not accept ' + a); });
    return lines;
  };

  // ---------- Column method diagnosis (explains WHERE a written method went wrong) ----------
  OM.diagnoseColumn = function (q, resp) {
    var inp = q.input, notes = [], names = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands'];
    var ans = String(resp.answer || '').replace(/\D/g, '');
    var correct = String(q.check.value);
    var a = String(inp.a), b = String(inp.b);
    function dig(s, i) { return i < s.length ? +s[s.length - 1 - i] : 0; }
    if (!ans) return notes;
    if (inp.op === '−') {
      for (var i = 0; i < a.length; i++) {
        var top = dig(a, i), bot = dig(b, i);
        if (top < bot && dig(ans, i) === bot - top) { notes.push('In the ' + names[i] + ' column, ' + top + ' − ' + bot + ': you took the smaller digit from the larger one. You need to exchange from the next column instead.'); break; }
      }
    }
    for (var k = 0; k < correct.length; k++) {
      if (dig(ans, k) !== dig(correct, k)) {
        if (!notes.length) {
          var hint = inp.op === '+' ? 'Did you add the digit you exchanged from the column to the right?' :
            inp.op === '×' ? 'Did you add the exchanged digit after multiplying?' : 'Did you remember the exchange you made?';
          notes.push('The first wrong digit is in the ' + names[k] + ' column. ' + (k > 0 ? hint : 'Check that column again.'));
        }
        break;
      }
    }
    return notes;
  };

  // ---------- "Check your typing": a number answer far too long to be meant (e.g. 4 digits when the question is about 2-digit numbers) ----------
  // Returns { typed } for the first suspicious number, or null. Never for a correct answer. Flags a number with at least two
  // more whole-number digits than both the answer and every number in the question, or one more where a key looks pressed
  // twice (e.g. 566). Used for primary years, before marking, so a slip of the finger is not marked wrong.
  function intDigits(s) { return String(s).replace(/^-/, '').split('.')[0].replace(/^0+(?=\d)/, '').length; }
  function expected(c) {
    if (!c) return null;
    if (c.kind === 'int') return String(Math.abs(c.value));
    if (c.kind === 'dec') return String(c.value).replace(/^-/, '');
    if (c.kind === 'money') return c.box === 'p' ? String(c.pence) : String(Math.floor(Math.abs(c.pence) / 100));
    return null;
  }
  OM.typoCheck = function (q, resp) {
    var c = q.check, pairs = [];
    if (c.kind === 'multi') c.parts.forEach(function (pc, i) { pairs.push([pc, resp && resp[i]]); });
    else if (c.kind === 'working') pairs.push([c.final, resp && resp.answer]);
    else pairs.push([c, resp && typeof resp === 'object' && 'answer' in resp ? resp.answer : resp]);
    var text = (String(q.prompt || '') + ' ' + String(q.visual || '')).replace(/<[^>]+>/g, ' '), qmax = 0;
    (text.match(/\d[\d,]*(\.\d+)?/g) || []).forEach(function (n) { qmax = Math.max(qmax, intDigits(n.replace(/,/g, ''))); });
    for (var i = 0; i < pairs.length; i++) {
      var pc = pairs[i][0], r = pairs[i][1], exp = expected(pc);
      if (exp === null || typeof r !== 'string') continue;
      var clean = r.replace(/[,\s£p]/g, '').replace('−', '-');
      if (!/^-?\d*\.?\d+$/.test(clean)) continue;
      if (mark1(pc, r).score >= 1) continue;
      var d = intDigits(clean), m = Math.max(intDigits(exp), qmax);
      if (d >= m + 2 || (d === m + 1 && d >= 2 && /([1-9])\1/.test(clean.split('.')[0]))) return { typed: r.trim() };
    }
    return null;
  };
})(typeof window !== 'undefined' ? window : globalThis);
