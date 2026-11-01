/* Learn with Pip — algebra and secondary-school answer marking.
   New kinds of answer, following GCSE mark-scheme conventions:
   - expr:   an algebraic expression. Any equivalent form scores, unless the question asks for a form:
             'simplified' (collect like terms; no brackets), 'expanded' (multiply out), 'factorised' (fully: no common factor left inside).
   - solve:  the solution of an equation; accepts "x = 3.5", "3.5" or "7/2".
   - ineq:   an inequality such as x > 3 or −2 < x ≤ 5 (either way round).
   - approx: an answer rounded to c.dp decimal places or c.sf significant figures.
   - range:  a calculator answer accepted anywhere from c.lo to c.hi (as in "accept 12.5 to 12.6").
   - stdform: a number in standard form A × 10ⁿ with 1 ≤ A < 10.
   Exact arithmetic throughout: rationals are BigInt pairs, so 1/3 + 2/3 is exactly 1. */
(function (G) {
  'use strict';
  var OM = G.OM, A = OM.alg = {};

  // ---------- exact rationals ----------
  function bgcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { var t = a % b; a = b; b = t; } return a; }
  function Q(n, d) { n = BigInt(n); d = d === undefined ? 1n : BigInt(d); if (d === 0n) throw new Error('divide by zero'); if (d < 0n) { n = -n; d = -d; } var g = bgcd(n, d) || 1n; return { n: n / g, d: d / g }; }
  function qadd(a, b) { return Q(a.n * b.d + b.n * a.d, a.d * b.d); }
  function qmul(a, b) { return Q(a.n * b.n, a.d * b.d); }
  function qdiv(a, b) { return Q(a.n * b.d, a.d * b.n); }
  function qneg(a) { return { n: -a.n, d: a.d }; }
  function qzero(a) { return a.n === 0n; }
  function qeq(a, b) { return a.n === b.n && a.d === b.d; }
  function qnum(a) { return Number(a.n) / Number(a.d); }
  // exact decimal text -> rational ("3.25" -> 13/4); returns null if not a plain number
  A.parseQ = function (s) {
    s = String(s === undefined || s === null ? '' : s).trim().replace(/[−–]/g, '-').replace(/,(?=\d{3}(\D|$))/g, '');
    var m = /^(-)?(\d*)(?:\.(\d+))?$/.exec(s);
    if (m && (m[2] || m[3])) { var dec = m[3] || ''; return Q(BigInt((m[1] ? '-' : '') + (m[2] || '0') + dec), 10n ** BigInt(dec.length)); }
    m = /^(-)?(\d+)\s*\/\s*(\d+)$/.exec(s);
    if (m && m[3] !== '0') return Q(BigInt((m[1] ? '-' : '') + m[2]), BigInt(m[3]));
    m = /^(-)?(\d+)\s+(\d+)\s*\/\s*(\d+)$/.exec(s);
    if (m && m[4] !== '0') { var q = qadd(Q(m[2]), Q(m[3], m[4])); return m[1] ? qneg(q) : q; }
    return null;
  };
  A.Q = Q; A.add = qadd; A.mul = qmul; A.div = qdiv; A.neg = qneg; A.eq = qeq; A.num = qnum;
  A.sub = function (a, b) { return qadd(a, qneg(b)); };
  // exact decimal text for a rational that terminates ("3/8" -> "0.375"); null if it never ends
  A.decText = function (q) {
    var d = q.d; while (d % 2n === 0n) d /= 2n; while (d % 5n === 0n) d /= 5n; if (d !== 1n) return null;
    var neg = q.n < 0n, n = neg ? -q.n : q.n, k = 0; while ((n * 10n ** BigInt(k)) % q.d !== 0n) k++;
    var v = String(n * 10n ** BigInt(k) / q.d); if (k) { v = v.padStart(k + 1, '0'); v = v.slice(0, v.length - k) + '.' + v.slice(-k); }
    return (neg ? '-' : '') + v;
  };
  A.qText = function (q) { return q.d === 1n ? String(q.n).replace('-', '−') : (q.n < 0n ? '−' : '') + (q.n < 0n ? -q.n : q.n) + '/' + q.d; };

  // ---------- tokenizer and parser ----------
  var SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
  function tokenize(s) {
    s = String(s || '').replace(/[−–—]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/\*\*/g, '^');
    s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, function (m) { var d = m.split('').map(function (c) { return SUP[c]; }).join(''); return d.charAt(0) === '-' ? '^(' + d + ')' : '^' + d; });
    var toks = [], i = 0;
    while (i < s.length) {
      var c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      var m = /^\d+(\.\d+)?|^\.\d+/.exec(s.slice(i));
      if (m) { toks.push({ t: 'num', v: m[0] }); i += m[0].length; continue; }
      if (/[a-zA-Zπ]/.test(c)) { toks.push({ t: 'var', v: c }); i++; continue; }
      if ('+-*/^()'.indexOf(c) >= 0) { toks.push({ t: c }); i++; continue; }
      return null;
    }
    return toks;
  }
  // AST: num, var, add [terms with sign], mul [factors], div, pow, neg, par
  A.parse = function (s) {
    var toks = tokenize(s); if (!toks || !toks.length) return null;
    var p = 0;
    function peek() { return toks[p]; }
    function expr() {
      var terms = [], sign = 1;
      if (peek() && (peek().t === '+' || peek().t === '-')) { sign = peek().t === '-' ? -1 : 1; p++; }
      terms.push({ s: sign, e: term() });
      while (peek() && (peek().t === '+' || peek().t === '-')) { var sg = peek().t === '-' ? -1 : 1; p++; terms.push({ s: sg, e: term() }); }
      return terms.length === 1 && terms[0].s === 1 ? terms[0].e : { t: 'add', terms: terms };
    }
    function startsAtom(tk) { return tk && (tk.t === 'num' || tk.t === 'var' || tk.t === '('); }
    function term() {
      var f = [power()], ops = ['*'];
      for (;;) {
        var tk = peek();
        if (tk && (tk.t === '*' || tk.t === '/')) { p++; ops.push(tk.t); f.push(power()); }
        else if (startsAtom(tk)) {
          // implicit multiplication: 3x, 2(x + 1), xy, (x + 1)(x + 2) — but not "x 2"
          if (tk.t === 'num' && f.length && (f[f.length - 1].t === 'var' || f[f.length - 1].t === 'pow')) throw new Error('number after letter');
          ops.push('i'); f.push(power());
        } else break;
      }
      if (f.length === 1) return f[0];
      return { t: 'mul', f: f, ops: ops };
    }
    function power() {
      var b = atom();
      if (peek() && peek().t === '^') { p++; var neg = false; if (peek() && peek().t === '-') { neg = true; p++; } var e = atom(); return { t: 'pow', b: b, e: neg ? { t: 'neg', a: e } : e }; }
      return b;
    }
    function atom() {
      var tk = peek(); if (!tk) throw new Error('end');
      if (tk.t === 'num') { p++; return { t: 'num', v: tk.v }; }
      if (tk.t === 'var') { p++; return { t: 'var', v: tk.v }; }
      if (tk.t === '(') { p++; var e = expr(); if (!peek() || peek().t !== ')') throw new Error('bracket'); p++; return { t: 'par', a: e }; }
      if (tk.t === '-') { p++; return { t: 'neg', a: atom() }; }
      throw new Error('unexpected');
    }
    try { var e = expr(); return p === toks.length ? e : null; } catch (err) { return null; }
  };

  // ---------- polynomials: { 'x^2*y': Q, '': Q } ----------
  function pconst(q) { var o = {}; if (!qzero(q)) o[''] = q; return o; }
  function pvar(v) { var o = {}; o[v + '^1'] = Q(1); return o; }
  function keyMul(a, b) {
    var pw = {};
    [a, b].forEach(function (k) { if (k) k.split('*').forEach(function (f) { var m = f.split('^'); pw[m[0]] = (pw[m[0]] || 0) + +m[1]; }); });
    return Object.keys(pw).filter(function (v) { return pw[v]; }).sort().map(function (v) { return v + '^' + pw[v]; }).join('*');
  }
  function padd(a, b, sign) { var o = {}; Object.keys(a).forEach(function (k) { o[k] = a[k]; }); Object.keys(b).forEach(function (k) { var v = sign < 0 ? qneg(b[k]) : b[k]; o[k] = o[k] ? qadd(o[k], v) : v; if (qzero(o[k])) delete o[k]; }); return o; }
  function pmul(a, b) { var o = {}; Object.keys(a).forEach(function (i) { Object.keys(b).forEach(function (j) { var k = keyMul(i, j), v = qmul(a[i], b[j]); o[k] = o[k] ? qadd(o[k], v) : v; if (qzero(o[k])) delete o[k]; }); }); return o; }
  function isConst(a) { var ks = Object.keys(a); return ks.length === 0 || (ks.length === 1 && ks[0] === ''); }
  function cval(a) { return a[''] || Q(0); }
  A.poly = function (e) {
    if (!e) return null;
    switch (e.t) {
      case 'num': return pconst(A.parseQ(e.v));
      case 'var': return pvar(e.v);
      case 'par': return A.poly(e.a);
      case 'neg': var n = A.poly(e.a); return n && padd({}, n, -1);
      case 'add': var s = {}; for (var i = 0; i < e.terms.length; i++) { var t = A.poly(e.terms[i].e); if (!t) return null; s = padd(s, t, e.terms[i].s); } return s;
      case 'mul':
        var r = A.poly(e.f[0]); if (!r) return null;
        for (var j = 1; j < e.f.length; j++) {
          var f = A.poly(e.f[j]); if (!f) return null;
          if (e.ops[j] === '/') { if (!isConst(f) || qzero(cval(f))) return null; var inv = Q(cval(f).d, cval(f).n); r = pmul(r, pconst(inv)); }
          else r = pmul(r, f);
        }
        return r;
      case 'pow':
        var b = A.poly(e.b), x = A.poly(e.e); if (!b || !x || !isConst(x)) return null;
        var k = cval(x); if (k.d !== 1n || k.n < 0n || k.n > 12n) return null;
        var out = pconst(Q(1)); for (var c = 0n; c < k.n; c++) out = pmul(out, b); return out;
    }
    return null;
  };
  function peq(a, b) { var ka = Object.keys(a).sort(), kb = Object.keys(b).sort(); return ka.join('|') === kb.join('|') && ka.every(function (k) { return qeq(a[k], b[k]); }); }
  // numeric evaluation for anything that is not a polynomial (e.g. algebraic fractions)
  function evalAt(e, env) {
    switch (e.t) {
      case 'num': return parseFloat(e.v);
      case 'var': return env[e.v];
      case 'par': return evalAt(e.a, env);
      case 'neg': return -evalAt(e.a, env);
      case 'add': return e.terms.reduce(function (s, t) { return s + t.s * evalAt(t.e, env); }, 0);
      case 'mul': return e.f.reduce(function (s, f, i) { var v = evalAt(f, env); return i === 0 ? v : e.ops[i] === '/' ? s / v : s * v; }, 0);
      case 'pow': return Math.pow(evalAt(e.b, env), evalAt(e.e, env));
    }
    return NaN;
  }
  function vars(e, set) { set = set || {}; if (!e) return set; if (e.t === 'var') set[e.v] = 1; ['a', 'b', 'e'].forEach(function (k) { if (e[k] && typeof e[k] === 'object') vars(e[k], set); }); (e.f || []).forEach(function (f) { vars(f, set); }); (e.terms || []).forEach(function (t) { vars(t.e, set); }); return set; }
  A.equivalent = function (a, b) {
    var pa = A.poly(a), pb = A.poly(b);
    if (pa && pb) return peq(pa, pb);
    var vs = Object.keys(Object.assign(vars(a), vars(b)));
    for (var trial = 0; trial < 6; trial++) {
      var env = {}; vs.forEach(function (v, i) { env[v] = 1.37 + trial * 0.731 + i * 0.419; });
      var x = evalAt(a, env), y = evalAt(b, env);
      if (!isFinite(x) || !isFinite(y) || Math.abs(x - y) > 1e-9 * Math.max(1, Math.abs(x))) return false;
    }
    return true;
  };

  // ---------- form checks ----------
  function hasPar(e) { if (!e) return false; if (e.t === 'par') return true; return ['a', 'b', 'e'].some(function (k) { return e[k] && typeof e[k] === 'object' && hasPar(e[k]); }) || (e.f || []).some(hasPar) || (e.terms || []).some(function (t) { return hasPar(t.e); }); }
  function topTerms(e) { return e.t === 'add' ? e.terms.map(function (t) { return t.e; }) : [e]; }
  // a single tidy term: at most one number, each letter at most once, nothing divided except by a number
  function tidyTerm(e) {
    if (e.t === 'neg') return tidyTerm(e.a);
    var fs = e.t === 'mul' ? e.f : [e], nums = 0, seen = {};
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i];
      if (f.t === 'num') { nums++; continue; }
      if (f.t === 'var') { if (seen[f.v]) return false; seen[f.v] = 1; continue; }
      if (f.t === 'pow' && f.b.t === 'var' && f.e.t === 'num') { if (seen[f.b.v]) return false; seen[f.b.v] = 1; continue; }
      return false;
    }
    if (e.t === 'mul' && e.ops.some(function (o, i) { return o === '/' && fs[i].t !== 'num'; })) return false;
    return nums <= 1;
  }
  function content(p) {
    // gcd of integer coefficients and the letters common to every term
    var ks = Object.keys(p); if (!ks.length) return { g: 1n, common: false };
    var g = 0n, allInt = true;
    ks.forEach(function (k) { if (p[k].d !== 1n) allInt = false; g = bgcd(g, p[k].n); });
    var common = ks.every(function (k) { return k !== ''; }) && (function () { var first = ks[0].split('*').map(function (f) { return f.split('^')[0]; }); return first.some(function (v) { return ks.every(function (k) { return k.split('*').some(function (f) { return f.split('^')[0] === v; }); }); }); })();
    return { g: allInt ? g : 1n, common: common };
  }
  A.checkForm = function (e, form, target) {
    if (form === 'simplified' || form === 'expanded') {
      if (hasPar(e)) return form === 'expanded' ? 'Multiply out the brackets.' : 'Simplify fully: no brackets are needed.';
      var terms = topTerms(e), tp = A.poly(target);
      if (!terms.every(tidyTerm)) return 'Simplify each term, e.g. write 3 × x × x as 3x².';
      if (tp && terms.length !== Object.keys(tp).length) return 'Collect the like terms so each kind of term appears once.';
      return null;
    }
    if (form === 'factorised') {
      var body = e.t === 'neg' ? e.a : e;
      var fs = body.t === 'mul' ? body.f : [body];
      var brackets = fs.filter(function (f) { return f.t === 'par'; });
      if (!brackets.length) return 'Write it with brackets: take out a common factor.';
      for (var i = 0; i < brackets.length; i++) { var c = content(A.poly(brackets[i].a) || {}); if (c.g > 1n || c.common) return 'Factorise fully: there is still a common factor inside the bracket.'; }
      return null;
    }
    return null;
  };

  // ---------- pretty printing (x^2 -> x², * -> nothing or ×) ----------
  A.pretty = function (s) { return String(s).replace(/\^\(?(-?\d+)\)?/g, function (m, d) { return d.split('').map(function (c) { return c === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]; }).join(''); }).replace(/-/g, '−'); };

  // ---------- marking kinds ----------
  function result(ok, max, notes) { return { score: ok ? max : 0, max: max, correct: !!ok, notes: notes || [] }; }
  function str(r) { return r === null || r === undefined ? '' : String(r).trim(); }
  var KK = OM.checkKinds;

  // c.answer: model answer text; c.form: 'any' | 'simplified' | 'expanded' | 'factorised'
  KK.expr = function (c, r) {
    if (str(r) === '') return result(false, 1, ['No answer given.']);
    // "make x the subject" or "write a formula for T": the answer may start with "x =" or "T ="
    if (c.lhs) r = str(r).replace(new RegExp('^\\s*' + c.lhs + '\\s*=\\s*'), '');
    var e = A.parse(r), t = A.parse(c.answer);
    if (!e) return result(false, 1, ['That expression could not be read. Use letters, numbers, + − × ÷, brackets, and ^ or ² for powers.']);
    if (/=/.test(str(r))) return result(false, 1, ['Write an expression, not an equation.']);
    if (!A.equivalent(e, t)) return result(false, 1);
    var why = c.form && c.form !== 'any' ? A.checkForm(e, c.form, t) : null;
    return why ? result(false, 1, [why]) : result(true, 1);
  };
  // c.value: exact answer text ("7/2", "-3", "2.5"); c.v: the letter
  KK.solve = function (c, r) {
    var s = str(r).replace(/[−–]/g, '-').replace(/\s+/g, ' ');
    var m = new RegExp('^' + (c.v || 'x') + '\\s*=\\s*(.+)$').exec(s) || new RegExp('^(.+?)\\s*=\\s*' + (c.v || 'x') + '$').exec(s);
    var got = A.parseQ(m ? m[1] : s), want = A.parseQ(c.value);
    if (!got) return result(false, 1, s === '' ? ['No answer given.'] : ['Write the answer as a number, e.g. ' + (c.v || 'x') + ' = 4.']);
    return result(qeq(got, want), 1);
  };
  // c.v, c.lo / c.hi (text or null), c.loInc / c.hiInc
  function parseIneq(s, v) {
    s = str(s).replace(/[−–]/g, '-').replace(/<=/g, '≤').replace(/>=/g, '≥').replace(/\s+/g, '');
    var parts = s.split(/(≤|≥|<|>)/);
    if (parts.length === 3) {
      var L = parts[0], op = parts[1], R = parts[2];
      if (L === v) return op === '>' || op === '≥' ? { lo: R, loInc: op === '≥', hi: null } : { hi: R, hiInc: op === '≤', lo: null };
      if (R === v) return op === '<' || op === '≤' ? { lo: L, loInc: op === '≤', hi: null } : { hi: L, hiInc: op === '≥', lo: null };
      return null;
    }
    if (parts.length === 5 && parts[2] === v) {
      if ((parts[1] === '<' || parts[1] === '≤') && (parts[3] === '<' || parts[3] === '≤')) return { lo: parts[0], loInc: parts[1] === '≤', hi: parts[4], hiInc: parts[3] === '≤' };
      if ((parts[1] === '>' || parts[1] === '≥') && (parts[3] === '>' || parts[3] === '≥')) return { hi: parts[0], hiInc: parts[1] === '≥', lo: parts[4], loInc: parts[3] === '≥' };
    }
    return null;
  }
  A.parseIneq = parseIneq;
  function sameEnd(a, b, ai, bi) { if (a === null || a === undefined) return b === null || b === undefined; if (b === null || b === undefined) return false; var qa = A.parseQ(a), qb = A.parseQ(b); return qa && qb && qeq(qa, qb) && !!ai === !!bi; }
  KK.ineq = function (c, r) {
    var g = parseIneq(r, c.v || 'x');
    if (!g) return result(false, 1, str(r) === '' ? ['No answer given.'] : ['Write an inequality using ' + (c.v || 'x') + ', e.g. ' + (c.v || 'x') + ' > 3 or −2 < ' + (c.v || 'x') + ' ≤ 5.']);
    var ok = sameEnd(c.lo, g.lo, c.loInc, g.loInc) && sameEnd(c.hi, g.hi, c.hiInc, g.hiInc);
    if (!ok && sameEnd(c.lo, g.lo, true, true) && sameEnd(c.hi, g.hi, true, true)) return result(false, 1, ['Check the inequality signs: should the end numbers be included (≤, ≥) or not (<, >)?']);
    return result(ok, 1);
  };
  // rounding: c.value exact text, c.dp or c.sf
  A.round = function (value, o) {
    var x = A.parseQ(value), neg = x.n < 0n, n = neg ? -x.n : x.n, d = x.d;
    var places = o.dp !== undefined ? o.dp : (function () { var mag = 0, t = n / d; if (t > 0n) { mag = String(t).length; return o.sf - mag; } var k = 0; var nn = n; while (nn * 10n < d) { nn *= 10n; k++; } return o.sf + k; })();
    var scale = 10n ** BigInt(Math.max(places, 0)), unscale = 10n ** BigInt(Math.max(-places, 0));
    var q = (2n * n * scale + d * unscale) / (2n * d * unscale);
    var s = String(q * unscale);
    if (places > 0) { s = s.padStart(places + 1, '0'); s = s.slice(0, s.length - places) + '.' + s.slice(-places); }
    return (neg && q !== 0n ? '-' : '') + s;
  };
  KK.approx = function (c, r) {
    var want = A.round(c.value, c), got = A.parseQ(str(r));
    if (!got) return result(false, 1, str(r) === '' ? ['No answer given.'] : ['Write the answer as a number.']);
    if (qeq(got, A.parseQ(want))) {
      var given = str(r).split('.')[1] || '', need = want.split('.')[1] || '';
      return result(true, 1, given.length < need.length ? ['Tip: to ' + (c.dp !== undefined ? c.dp + ' decimal places' : c.sf + ' significant figures') + ', write ' + want + '.'] : []);
    }
    if (qeq(got, A.parseQ(c.value))) return result(false, 1, ['That is not rounded. Round to ' + (c.dp !== undefined ? c.dp + ' decimal place' + (c.dp === 1 ? '' : 's') : c.sf + ' significant figure' + (c.sf === 1 ? '' : 's')) + '.']);
    return result(false, 1);
  };
  KK.range = function (c, r) {
    var got = A.parseQ(str(r));
    if (!got) return result(false, 1, str(r) === '' ? ['No answer given.'] : ['Write the answer as a number.']);
    var v = qnum(got); return result(v >= +c.lo - 1e-12 && v <= +c.hi + 1e-12, 1);
  };
  // standard form: c.m mantissa text, c.e integer
  A.parseStd = function (s) {
    s = str(s).replace(/[−–]/g, '-').replace(/\s+/g, '').replace(/[×xX*]/g, '×');
    s = s.replace(/10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/, function (m, p) { return '10^' + p.split('').map(function (c) { return SUP[c]; }).join(''); });
    var m = /^(-?\d+(?:\.\d+)?)×10\^\(?(-?\d+)\)?$/.exec(s);
    return m ? { m: m[1], e: +m[2] } : null;
  };
  function stdValue(m, e) { var q = A.parseQ(m); return e >= 0 ? qmul(q, Q(10n ** BigInt(e))) : qdiv(q, Q(10n ** BigInt(-e))); }
  KK.stdform = function (c, r) {
    var g = A.parseStd(r);
    if (!g) return result(false, 1, str(r) === '' ? ['No answer given.'] : ['Write it as A × 10^n, e.g. 4.5 × 10^6.']);
    var a = Math.abs(parseFloat(g.m));
    var same = qeq(stdValue(g.m, g.e), stdValue(c.m, c.e));
    if (same && (a < 1 || a >= 10)) return result(false, 1, ['The first number must be at least 1 and less than 10 for standard form.']);
    return result(same, 1);
  };

  // prime factorisation in index form: c.n; accepts 2^3 × 3^2 × 5, 2³×3²×5, 2×2×2×3×3×5 (any order)
  A.parsePF = function (s) {
    s = str(s).replace(/[×x*·]/g, '×').replace(/\s+/g, '').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) { return '^' + m.split('').map(function (c) { return SUP[c]; }).join(''); });
    if (!s) return null;
    var parts = s.split('×'), out = [];
    for (var i = 0; i < parts.length; i++) { var m = /^(\d+)(?:\^(\d+))?$/.exec(parts[i]); if (!m) return null; out.push([+m[1], m[2] ? +m[2] : 1]); }
    return out;
  };
  function isPrime(n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
  KK.pfactor = function (c, r) {
    var f = A.parsePF(r);
    if (!f) return result(false, 1, str(r) === '' ? ['No answer given.'] : ['Write it as a product of primes, e.g. 2^3 × 3 × 5.']);
    var prod = f.reduce(function (s, x) { return s * Math.pow(x[0], x[1]); }, 1);
    if (prod !== c.n) return result(false, 1);
    if (!f.every(function (x) { return isPrime(x[0]); })) return result(false, 1, ['Every factor must be a prime number.']);
    return result(true, 1);
  };
  A.pfText = function (n) { var out = [], p = 2; while (n > 1) { var k = 0; while (n % p === 0) { n /= p; k++; } if (k) out.push(p + (k > 1 ? '^' + k : '')); p++; } return out.join(' × '); };

  // ---------- Working with method marks (GCSE-style M and A marks) ----------
  // c = { kind: 'steps', final: <check for the answer>, marks: [{ code: 'M1', text: 'for 3x = 15 oe', any: [evidence…] }, …, { code: 'A1', text: 'cao' }],
  //       start: '3(x + 2) = 21' (optional: the equation being solved, so Pip can spot the first wrong line), v: 'x', exampleLines: […] }
  // Evidence (any one is enough, on any line, in any equivalent form, as a mark scheme's "oe"):
  //   { value: '15', tol: 0 }   a number seen on a line (or a side that works out to it)
  //   { eq: '3x = 15' }          an equivalent equation (any multiple of it)
  //   { expr: 'x^2 + 8x + 15' }  an equivalent expression on a line or one side of it
  //   { factorised: 'x^2 + 2x - 15' }  that expression written fully factorised
  //   { solve: 'x', value: '7' } an equation (or inequality) in that letter alone, which the value satisfies
  var REL = /≤|≥|<=|>=|<|>|=/;
  function splitLine(l) { var s = String(l || '').replace(/[−–]/g, '-').replace(/≤|≥|<=|>=|<|>/g, '='); return s.split('=').map(function (x) { return x.trim(); }).filter(function (x) { return x !== ''; }); }
  function sideValue(t) { var e = A.parse(t), p = e && A.poly(e); return p && Object.keys(p).every(function (k) { return k === ''; }) ? (p[''] || Q(0)) : null; }
  function numbersIn(l) { var out = [], m, rx = /-?\d+(?:\.\d+)?(?:\/\d+)?/g, s = String(l || '').replace(/[−–]/g, '-').replace(/,(?=\d{3})/g, ''); while ((m = rx.exec(s))) { var q = A.parseQ(m[0]); if (q) out.push(q); } splitLine(l).forEach(function (side) { var v = sideValue(side); if (v) out.push(v); }); return out; }
  function eqPoly(l) { var sides = splitLine(l); if (sides.length !== 2) return null; var a = A.parse(sides[0]), b = A.parse(sides[1]); if (!a || !b) return null; var pa = A.poly(a), pb = A.poly(b); return pa && pb ? padd(pa, pb, -1) : null; }
  function proportional(p, t) { var kt = Object.keys(t), kp = Object.keys(p); if (!kt.length || kt.length !== kp.length) return false; var r = qdiv(p[kt[0]] || Q(0), t[kt[0]]); if (qzero(r)) return false; return kt.every(function (k) { return p[k] && qeq(p[k], qmul(r, t[k])); }); }
  function onlyVar(p, v) { return Object.keys(p).every(function (k) { return k === '' || k.split('*').every(function (f) { return f.split('^')[0] === v; }); }) && Object.keys(p).some(function (k) { return k !== ''; }); }
  function evalPolyAt(p, v, val) { var s = Q(0); Object.keys(p).forEach(function (k) { var term = p[k]; if (k) k.split('*').forEach(function (f) { var e = +f.split('^')[1]; for (var i = 0; i < e; i++) term = qmul(term, val); }); s = qadd(s, term); }); return s; }
  function sameText(a, b) { var f = function (t) { return String(t).replace(/[−–]/g, '-').replace(/\s+/g, '').toLowerCase(); }; return f(a) === f(b); }
  A.evidenceIn = function (ev, line, c) {
    if (!str(line)) return false;
    if (ev.notLike && sameText(line, ev.notLike)) return false; // copying out the question is not a step
    if (ev.re) return new RegExp(ev.re, 'i').test(String(line).replace(/[−–]/g, '-').replace(/\s+/g, ''));
    if (ev.solveAny) { if (!REL.test(String(line).replace(/[−–]/g, '-'))) return false; var pq = eqPoly(line); if (!pq) return false; var letters = {}; Object.keys(pq).forEach(function (k) { if (k) k.split('*').forEach(function (f) { letters[f.split('^')[0]] = 1; }); }); var ls = Object.keys(letters); return ls.length === 1 && qzero(evalPolyAt(pq, ls[0], A.parseQ(ev.value))) && !/^[a-z]\s*=\s*-?[\d.\/]+$/i.test(str(line).replace(/[−–]/g, '-')); }
    if (ev.value !== undefined && !ev.solve) { var want = A.parseQ(ev.value); return numbersIn(line).some(function (q) { return ev.tol ? Math.abs(qnum(q) - qnum(want)) <= ev.tol + 1e-12 : qeq(q, want); }); }
    if (ev.eq) { var p = eqPoly(line), t = eqPoly(ev.eq); return !!(p && t && proportional(p, t)); }
    if (ev.expr || ev.factorised) { var target = A.parse(ev.expr || ev.factorised); return splitLine(line).some(function (side) { var e = A.parse(side); if (!e || !target || !A.equivalent(e, target)) return false; if (ev.notLike && str(side).replace(/\s+/g, '') === String(ev.notLike).replace(/\s+/g, '')) return false; return ev.factorised ? !A.checkForm(e, 'factorised', target) : true; }); }
    if (ev.solve) { if (!REL.test(String(line).replace(/[−–]/g, '-'))) return false; var pp = eqPoly(line); if (!pp || !onlyVar(pp, ev.solve)) return false; return qzero(evalPolyAt(pp, ev.solve, A.parseQ(ev.value))); }
    return false;
  };
  // the first working line that does not follow (Pip's step check)
  A.firstSlip = function (c, lines) {
    var v = c.v || 'x', start = c.start ? eqPoly(c.start) : null, sol = null;
    if (start && onlyVar(start, v)) { var keys = Object.keys(start); if (keys.every(function (k) { return k === '' || k === v + '^1'; }) && start[v + '^1']) sol = qdiv(qneg(start[''] || Q(0)), start[v + '^1']); }
    for (var i = 0; i < lines.length; i++) {
      var l = str(lines[i]); if (!l) continue;
      var arith = OM.parseWorkingLine ? OM.parseWorkingLine(l) : [];
      if (arith.length) { var last = arith[arith.length - 1]; if (last.stated && Math.abs(last.result - last.trueResult) > Math.max(0.006, 0.002 * Math.abs(last.trueResult))) return { line: i + 1, text: 'Line ' + (i + 1) + ' has an arithmetic slip: it should be ' + String(Math.round(last.trueResult * 1e6) / 1e6).replace('-', '−') + ', not ' + String(last.result).replace('-', '−') + '.' }; continue; }
      if (sol && REL.test(l.replace(/[−–]/g, '-'))) { var p = eqPoly(l); if (p && onlyVar(p, v) && Object.keys(p).every(function (k) { return k === '' || k === v + '^1'; })) { if (!qzero(evalPolyAt(p, v, sol))) return { line: i + 1, text: 'Line ' + (i + 1) + ' does not follow from the line before: check what you did to both sides.' }; } }
    }
    return null;
  };
  KK.steps = function (c, r) {
    r = r || {}; var lines = (r.lines || []).map(str), total = c.marks.length;
    var fin = OM.markCheck(c.final, r.answer), detail = [];
    if (fin.correct) { c.marks.forEach(function (m) { detail.push({ code: m.code, got: true, text: m.text }); }); return { score: total, max: total, correct: true, notes: fin.notes.concat(['Correct answer: all ' + total + ' marks.']), detail: detail }; }
    var score = 0, notes = fin.notes.slice();
    c.marks.forEach(function (m) {
      if (m.code.charAt(0) === 'A') { detail.push({ code: m.code, got: false, text: m.text }); return; }
      var hit = -1; for (var i = 0; i < lines.length && hit < 0; i++) if ((m.any || []).some(function (ev) { return A.evidenceIn(ev, lines[i], c); })) hit = i;
      if (hit >= 0) score++;
      detail.push({ code: m.code, got: hit >= 0, text: m.text, line: hit >= 0 ? hit + 1 : null });
    });
    detail.forEach(function (d) { notes.push((d.got ? '✓ ' : '✗ ') + d.code + ' ' + d.text + (d.line ? ' (line ' + d.line + ')' : '')); });
    var slip = A.firstSlip(c, lines); if (slip) notes.push('Pip spotted: ' + slip.text);
    if (!lines.some(function (l) { return l; })) notes.push('Write your working in the lines: method marks are given for correct steps even if the final answer is wrong.');
    return { score: score, max: total, correct: false, notes: notes, detail: detail, slip: slip };
  };

  // ---------- model answers, wrong answers and answer text for the checker and the mark scheme ----------
  function ineqText(c) { var v = c.v || 'x'; if (c.lo !== null && c.lo !== undefined && c.hi !== null && c.hi !== undefined) return c.lo + ' ' + (c.loInc ? '≤' : '<') + ' ' + v + ' ' + (c.hiInc ? '≤' : '<') + ' ' + c.hi; if (c.lo !== null && c.lo !== undefined) return v + ' ' + (c.loInc ? '≥' : '>') + ' ' + c.lo; return v + ' ' + (c.hiInc ? '≤' : '<') + ' ' + c.hi; }
  A.ineqText = function (c) { return ineqText(c).replace(/-/g, '−'); };
  var canon = OM.canonicalResponse, wrong = OM.wrongResponse, text = OM.answerTextFor;
  OM.canonicalResponse = function (c) {
    switch (c.kind) {
      case 'expr': return c.answer;
      case 'solve': return (c.v || 'x') + ' = ' + c.value;
      case 'ineq': return ineqText(c);
      case 'approx': return A.round(c.value, c);
      case 'range': return String(c.lo);
      case 'stdform': return c.m + ' × 10^' + c.e;
      case 'pfactor': return A.pfText(c.n);
      case 'steps': return { lines: (c.exampleLines || []).slice(), answer: OM.canonicalResponse(c.final) };
    }
    return canon(c);
  };
  OM.wrongResponse = function (c) {
    switch (c.kind) {
      case 'expr': return c.answer + ' + 1';
      case 'solve': return (c.v || 'x') + ' = ' + A.qText(qadd(A.parseQ(c.value), Q(1))).replace('−', '-');
      case 'ineq': var w = Object.assign({}, c); if (c.lo !== null && c.lo !== undefined) w.loInc = !c.loInc; else w.hiInc = !c.hiInc; return ineqText(w);
      case 'approx': return String(parseFloat(A.round(c.value, c)) + 1);
      case 'range': return String(+c.hi + Math.max(1, Math.abs(+c.hi)));
      case 'stdform': return c.m + ' × 10^' + (c.e + 1);
      case 'pfactor': return A.pfText(c.n) + ' × 2';
      case 'steps': return { lines: [], answer: OM.wrongResponse(c.final) };
    }
    return wrong(c);
  };
  OM.answerTextFor = function (c) {
    switch (c.kind) {
      case 'expr': return (c.lhs ? c.lhs + ' = ' : '') + A.pretty(c.answer);
      case 'solve': return (c.plain ? '' : (c.v || 'x') + ' = ') + String(c.value).replace(/-/g, '−');
      case 'ineq': return A.ineqText(c);
      case 'approx': return A.round(c.value, c).replace('-', '−');
      case 'range': return 'any value from ' + c.lo + ' to ' + c.hi;
      case 'stdform': return c.m + ' × 10' + A.pretty('^' + c.e);
      case 'pfactor': return A.pretty(A.pfText(c.n));
      case 'steps': return OM.answerTextFor(c.final);
    }
    return text(c);
  };
  var scheme = OM.schemeLines;
  OM.schemeLines = function (q) {
    var c = q.check;
    if (c.kind === 'steps') {
      var out = ['Total ' + c.marks.length + ' marks. Answer: ' + q.answerText + '.'];
      c.marks.forEach(function (m) { out.push('<b>' + m.code + '</b> ' + m.text); });
      out.push('A correct answer with no working gets full marks unless the question says "show your working". M marks are for correct method, even if a later step goes wrong; A marks need the correct answer. "oe" means "or equivalent".');
      if (c.exampleLines && c.exampleLines.length) out.push('Model working: ' + c.exampleLines.map(A.pretty).join(' → '));
      return out;
    }
    var lines = scheme(q);
    if (c.kind === 'expr') lines.push(c.form === 'factorised' ? 'Must be fully factorised.' : c.form === 'simplified' || c.form === 'expanded' ? 'Must be fully simplified, with like terms collected.' : 'Accept any equivalent expression.');
    if (c.kind === 'solve') lines.push('Accept equivalent fractions or decimals.');
    if (c.kind === 'approx') lines.push('Must be rounded to ' + (c.dp !== undefined ? c.dp + ' decimal place' + (c.dp === 1 ? '' : 's') : c.sf + ' significant figure' + (c.sf === 1 ? '' : 's')) + '.');
    if (c.kind === 'pfactor') lines.push('Accept the primes in any order, with or without index notation. Every factor must be prime.');
    if (c.kind === 'stdform') lines.push('Must be in standard form: A × 10ⁿ with 1 ≤ A < 10.');
    return lines;
  };
})(typeof window !== 'undefined' ? window : globalThis);
