/* On-screen scientific calculator, laid out like the calculators used in GCSE exams.
   It slides out from the right-hand edge on questions where a calculator is allowed (q.calc, or any
   question on a calculator paper). Angles are in degrees. Results that are exact fractions (from ÷ or the
   fraction key) are shown as fractions first, as exam calculators do; S⇔D swaps to a decimal.
   OM.calcEngine is the maths only (no page), so the checker can test it. */
(function () {
  'use strict';
  var OM = window.OM = window.OM || {};

  // ---------- engine ----------
  // An expression is a list of key tokens: digits, '.', '+', '−', '×', '÷', '(', ')', '^', 'xrt' (x-th root),
  // '²', '³', '⁻¹', '!', '%', 'frac', 'E' (×10ˣ), 'neg' ((−) key), 'π', 'Ans', and functions written with
  // an opening bracket: '√(', '∛(', 'sin(', 'cos(', 'tan(', 'sin⁻¹(', 'cos⁻¹(', 'tan⁻¹('.
  var FUNCS = { '√(': 1, '∛(': 1, 'sin(': 1, 'cos(': 1, 'tan(': 1, 'sin⁻¹(': 1, 'cos⁻¹(': 1, 'tan⁻¹(': 1 };
  var SHOW = { '−': ' − ', '+': ' + ', '×': ' × ', '÷': ' ÷ ', 'frac': '⁄', 'E': '×10^', 'neg': '−', 'xrt': 'ˣ√', 'Ans': 'Ans' };
  function show(tokens) { return tokens.map(function (t) { return SHOW[t] || t; }).join(''); }

  function CalcError(kind) { this.kind = kind; }
  var RAD = Math.PI / 180;
  function fact(n) { if (n < 0 || n !== Math.floor(n) || n > 170) throw new CalcError('Math'); var f = 1; for (var i = 2; i <= n; i++) f *= i; return f; }
  function apply(fn, x) {
    switch (fn) {
      case '√(': if (x < 0) throw new CalcError('Math'); return Math.sqrt(x);
      case '∛(': return Math.cbrt(x);
      case 'sin(': return Math.sin(x * RAD);
      case 'cos(': return Math.cos(x * RAD);
      case 'tan(': if (Math.abs(Math.cos(x * RAD)) < 1e-12) throw new CalcError('Math'); return Math.tan(x * RAD);
      case 'sin⁻¹(': if (Math.abs(x) > 1) throw new CalcError('Math'); return Math.asin(x) / RAD;
      case 'cos⁻¹(': if (Math.abs(x) > 1) throw new CalcError('Math'); return Math.acos(x) / RAD;
      case 'tan⁻¹(': return Math.atan(x) / RAD;
    }
  }
  function power(a, b) {
    var v = Math.pow(a, b);
    // a negative number to a power 1/odd (e.g. (−8)^(1/3)) has a real answer
    if (isNaN(v) && a < 0) { var inv = 1 / b, k = Math.round(inv); if (Math.abs(inv - k) < 1e-9 && k % 2) v = -Math.pow(-a, b); }
    return v;
  }

  function evaluate(tokens, ans) {
    var i = 0, inexact = false;
    function peek() { return tokens[i]; }
    function startsPrimary(t) { return t !== undefined && (/^[0-9.]$/.test(t) || t === '(' || t === 'π' || t === 'Ans' || FUNCS[t]); }
    function number() {
      var s = '';
      while (i < tokens.length && /^[0-9.]$/.test(tokens[i])) s += tokens[i++];
      if ((s.match(/\./g) || []).length > 1 || s === '.') throw new CalcError('Syntax');
      var v = parseFloat(s);
      if (peek() === 'E') {
        i++; var sg = 1; if (peek() === 'neg' || peek() === '−') { i++; sg = -1; }
        var e = ''; while (i < tokens.length && /^[0-9]$/.test(tokens[i])) e += tokens[i++];
        if (!e) throw new CalcError('Syntax');
        v = v * Math.pow(10, sg * parseInt(e, 10));
      }
      return v;
    }
    function primary() {
      var t = peek();
      if (t === undefined) throw new CalcError('Syntax');
      if (/^[0-9.]$/.test(t)) return number();
      if (t === 'π') { i++; inexact = true; return Math.PI; }
      if (t === 'Ans') { i++; return ans || 0; }
      if (t === '(' || FUNCS[t]) {
        i++; var v = expr();
        if (peek() === ')') i++; else if (i < tokens.length) throw new CalcError('Syntax'); // missing ')' at the very end is fine
        if (FUNCS[t]) { inexact = true; v = apply(t, v); }
        return v;
      }
      throw new CalcError('Syntax');
    }
    function postfix() {
      var v = primary();
      for (;;) {
        var t = peek();
        if (t === '²') { i++; v = v * v; } else if (t === '³') { i++; v = v * v * v; }
        else if (t === '⁻¹') { i++; if (v === 0) throw new CalcError('Math'); v = 1 / v; }
        else if (t === '!') { i++; v = fact(v); } else if (t === '%') { i++; v = v / 100; }
        else return v;
      }
    }
    function frac() {
      var v = postfix();
      while (peek() === 'frac') { i++; var d = postfix(); if (d === 0) throw new CalcError('Math'); v = v / d; }
      return v;
    }
    function pow() {
      var v = frac(), t = peek();
      if (t === '^') { i++; var b = unary(); if (b !== Math.round(b)) inexact = true; return power(v, b); }
      if (t === 'xrt') { i++; var x = unary(); if (v === 0) throw new CalcError('Math'); inexact = true; return power(x, 1 / v); }
      return v;
    }
    // (−) binds looser than powers, so (−)3² = −9, as on an exam calculator
    function unary() { if (peek() === 'neg') { i++; return -unary(); } return pow(); }
    function term() {
      var v = unary();
      for (;;) {
        var t = peek();
        if (t === '×') { i++; v *= unary(); } else if (t === '÷') { i++; var d = unary(); if (d === 0) throw new CalcError('Math'); v /= d; }
        else if (startsPrimary(t) || t === 'neg') v *= unary(); // 2π, 3(4 + 1), 2sin(30)
        else return v;
      }
    }
    function expr() {
      var v = term();
      for (;;) {
        var t = peek();
        if (t === '+') { i++; v += term(); } else if (t === '−') { i++; v -= term(); } else return v;
      }
    }
    try {
      if (!tokens.length) return { value: 0, exact: true };
      var v = expr();
      if (i < tokens.length) throw new CalcError('Syntax');
      if (!isFinite(v) || isNaN(v)) throw new CalcError('Math');
      // tidy floating-point noise: 10 significant figures, as a calculator display shows
      // (raw keeps full precision for Ans and for spotting fractions)
      var shown = parseFloat(v.toPrecision(10)); if (Object.is(shown, -0)) shown = 0;
      return { value: shown, raw: v, exact: !inexact };
    } catch (e) {
      if (e instanceof CalcError) return { error: e.kind + ' ERROR' };
      throw e;
    }
  }

  var SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  function decimal(v) {
    var a = Math.abs(v);
    if (v !== 0 && (a >= 1e10 || a < 0.001)) {
      var p = v.toExponential(9).split('e'), m = parseFloat(p[0]).toString(), e = parseInt(p[1], 10);
      return m.replace('-', '−') + '×10' + String(e).replace(/./g, function (c) { return SUP[c]; });
    }
    return String(parseFloat(v.toPrecision(10))).replace('-', '−');
  }
  // the fraction n/d closest to v with d up to 9999, or null
  function fraction(v) {
    if (v === Math.round(v)) return null;
    var h0 = 0, h1 = 1, k0 = 1, k1 = 0, x = Math.abs(v);
    for (var n = 0; n < 30; n++) {
      var a = Math.floor(x), h = a * h1 + h0, k = a * k1 + k0;
      if (k > 9999) break;
      h0 = h1; h1 = h; k0 = k1; k1 = k;
      if (Math.abs(Math.abs(v) - h1 / k1) < 1e-10 * Math.max(1, Math.abs(v))) return { n: (v < 0 ? -1 : 1) * h1, d: k1 };
      x = 1 / (x - a); if (!isFinite(x)) break;
    }
    return null;
  }
  function fracText(f) { return (f.n < 0 ? '−' : '') + Math.abs(f.n) + '⁄' + f.d; }
  OM.calcEngine = { evaluate: evaluate, decimal: decimal, fraction: fraction, fracText: fracText, show: show };

  // ---------- the calculator on screen ----------
  if (typeof document === 'undefined') return;
  var doc = document;
  // [label, token or action, shifted label, shifted token, kind]
  var FN = [
    ['SHIFT', '#shift', '', '', 'shift'], ['x²', '²', 'x³', '³'], ['xʸ', '^', 'ˣ√', 'xrt'], ['√', '√(', '∛', '∛('], ['x⁻¹', '⁻¹', 'x!', '!'], ['a⁄b', 'frac', '', ''],
    ['(−)', 'neg', '', ''], ['(', '('], [')', ')'], ['sin', 'sin(', 'sin⁻¹', 'sin⁻¹('], ['cos', 'cos(', 'cos⁻¹', 'cos⁻¹('], ['tan', 'tan(', 'tan⁻¹', 'tan⁻¹('],
    ['π', 'π'], ['%', '%'], ['S⇔D', '#sd'], ['◀', '#left'], ['▶', '#right'], ['×10ˣ', 'E']
  ];
  var NUM = [
    ['7', '7'], ['8', '8'], ['9', '9'], ['DEL', '#del', '', '', 'red'], ['AC', '#ac', '', '', 'red'],
    ['4', '4'], ['5', '5'], ['6', '6'], ['×', '×'], ['÷', '÷'],
    ['1', '1'], ['2', '2'], ['3', '3'], ['+', '+'], ['−', '−'],
    ['0', '0'], ['.', '.'], ['Ans', 'Ans'], ['=', '#eq', '', '', 'eq']
  ];
  var TITLES = { '^': 'To the power', 'xrt': 'Root: 3 ˣ√ 8 is the cube root of 8', 'frac': 'Fraction: 2 a⁄b 3 is two thirds', 'neg': 'Negative number', 'E': 'Times ten to the power (standard form)', '#sd': 'Swap between fraction and decimal', '#shift': 'Use the yellow function above a key', 'Ans': 'The last answer' };

  // one calculator for the whole visit, so Ans and the last sum are kept between questions
  var st = { tokens: [], cur: 0, ans: 0, result: null, asFrac: true, shift: false, done: false, open: false };
  var panel, tab, enabled = false;

  function build() {
    panel = doc.createElement('aside'); panel.className = 'calcpanel'; panel.setAttribute('aria-label', 'Calculator'); panel.tabIndex = -1;
    function keys(list, cls) {
      return '<div class="' + cls + '">' + list.map(function (k) {
        var kind = k[4] || (cls === 'cfn' ? 'fn' : /^[0-9.]$/.test(k[1]) ? 'digit' : 'op');
        return '<button type="button" class="ck ' + kind + '" data-k="' + k[1] + '"' + (k[3] ? ' data-s="' + k[3] + '"' : '') + ' title="' + (TITLES[k[1]] || k[0]) + '">' +
          (k[2] ? '<small>' + k[2] + '</small>' : '') + '<span>' + k[0] + '</span></button>';
      }).join('') + '</div>';
    }
    panel.innerHTML = '<div class="calc"><div class="cbrand"><span>Scientific calculator</span><button type="button" class="cclose" data-k="#close" title="Slide the calculator away" aria-label="Close calculator">✕</button></div>' +
      '<div class="cscreen" aria-live="polite"><div class="cflags"><span class="cshift">S</span><span>D</span></div><div class="cexpr"></div><div class="cres"></div></div>' +
      keys(FN, 'cfn') + keys(NUM, 'cnum') + '<p class="cnote">Degrees mode. Type on the keyboard too while the calculator is open.</p></div>';
    tab = doc.createElement('button'); tab.type = 'button'; tab.className = 'calctab'; tab.title = 'Calculator';
    tab.innerHTML = (OM.icon ? OM.icon('calc', { size: 22 }) : '') + '<span>Calculator</span>';
    tab.onclick = function () { toggle(!st.open); };
    panel.addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (!b) return; press(st.shift && b.getAttribute('data-s') ? b.getAttribute('data-s') : b.getAttribute('data-k')); });
    panel.addEventListener('keydown', onKey);
    doc.body.appendChild(panel); doc.body.appendChild(tab);
    paint();
  }

  function press(k) {
    var wasShift = st.shift; st.shift = false;
    if (k === '#shift') { st.shift = !wasShift; return paint(); }
    if (k === '#close') return toggle(false);
    if (k === '#ac') { st.tokens = []; st.cur = 0; st.result = null; st.done = false; return paint(); }
    if (k === '#del') { if (st.done) st.done = false; else if (st.cur > 0) { st.tokens.splice(st.cur - 1, 1); st.cur--; } st.result = null; return paint(); }
    if (k === '#left') { st.done = false; st.cur = Math.max(0, st.cur - 1); return paint(); }
    if (k === '#right') { st.done = false; st.cur = Math.min(st.tokens.length, st.cur + 1); return paint(); }
    if (k === '#sd') { if (st.result && !st.result.error) st.asFrac = !st.asFrac; return paint(); }
    if (k === '#eq') {
      st.result = evaluate(st.tokens, st.ans);
      if (!st.result.error) { st.ans = st.result.raw; st.asFrac = true; }
      st.done = true; st.cur = st.tokens.length; return paint();
    }
    // after =, an operator carries on from the answer; anything else starts a new sum
    if (st.done) {
      st.done = false;
      if (st.result && !st.result.error && /^(\+|−|×|÷|\^|²|³|⁻¹|!|%|frac|xrt)$/.test(k)) st.tokens = ['Ans'];
      else st.tokens = [];
      st.cur = st.tokens.length; st.result = null;
    }
    st.tokens.splice(st.cur, 0, k); st.cur++;
    paint();
  }

  function resultText() {
    var r = st.result; if (!r) return '';
    if (r.error) return r.error;
    var f = r.exact && st.asFrac && st.tokens.some(function (t) { return t === '÷' || t === 'frac' || t === '⁻¹'; }) ? fraction(r.raw) : null;
    return f ? fracText(f) : decimal(r.value);
  }
  function paint() {
    if (!panel) return;
    var before = show(st.tokens.slice(0, st.cur)), after = show(st.tokens.slice(st.cur));
    panel.querySelector('.cexpr').innerHTML = esc(before) + (st.done ? '' : '<span class="caret"></span>') + esc(after);
    panel.querySelector('.cres').textContent = resultText();
    panel.querySelector('.cres').classList.toggle('err', !!(st.result && st.result.error));
    panel.classList.toggle('shifted', st.shift);
    panel.classList.toggle('open', st.open);
    doc.body.classList.toggle('calcopen', st.open && enabled);
    tab.classList.toggle('open', st.open);
    tab.setAttribute('aria-expanded', st.open ? 'true' : 'false');
  }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  var KEYMAP = { '+': '+', '-': '−', '*': '×', 'x': '×', '/': '÷', '(': '(', ')': ')', '^': '^', '.': '.', '%': '%', '!': '!', 'p': 'π', 's': 'sin(', 'c': 'cos(', 't': 'tan(', 'r': '√(', 'e': 'E' };
  function onKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key, tok = /^[0-9]$/.test(k) ? k : KEYMAP[k];
    if (k === 'Enter' || k === '=') tok = '#eq'; else if (k === 'Backspace') tok = '#del'; else if (k === 'Delete') tok = '#ac';
    else if (k === 'Escape') tok = '#close'; else if (k === 'ArrowLeft') tok = '#left'; else if (k === 'ArrowRight') tok = '#right';
    if (!tok) return;
    e.preventDefault(); e.stopPropagation(); press(tok);
  }

  // the child opening or closing it by hand (focus moves into the calculator when they open it)
  function toggle(open) {
    if (!panel) build();
    st.open = !!open && enabled; userClosed = !st.open; userOpened = st.open; paint();
    if (st.open) panel.focus({ preventScroll: true });
  }
  // Called by each screen: true shows the calculator, false hides it. Where a calculator is allowed it starts OPEN,
  // without taking the cursor from the answer box. If the child slides it away, it stays away for the rest of that
  // practice round or test (`key` names it), and opens again in the next one.
  // On a phone it would cover the question, so there it starts closed and slides up from the bottom when tapped; once
  // opened it stays open for the rest of that round.
  var userClosed = false, userOpened = false, lastKey = null;
  function narrow() { return window.matchMedia ? window.matchMedia('(max-width: 700px)').matches : false; }
  OM.calc = {
    enable: function (on, key) {
      if (!panel) build();
      enabled = !!on;
      tab.hidden = !enabled; panel.hidden = !enabled;
      if (enabled) { if (key !== lastKey) { userClosed = false; userOpened = false; lastKey = key; } st.open = narrow() ? userOpened : !userClosed; }
      else st.open = false;
      paint();
    },
    open: function () { toggle(true); }, close: function () { toggle(false); },
    isOpen: function () { return st.open; }
  };
})();
