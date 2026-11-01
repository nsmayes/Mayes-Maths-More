/* Learn with Pip — Year 9 question generators (Key Stage 3, the Lost Temple).
   Typed algebra is marked by js/algebra.js. Questions marked calc: true allow a calculator.
   Each generator's verify() works the answer out a different way. Levels: 1 getting there, 2 expected, 3 greater depth. */
(function (G) {
  'use strict';
  var OM = G.OM, K = OM.kit, V = OM.V, S = K.S, fmt = OM.fmt, F = K.fr, A = OM.alg;
  function Q(n, d) { return A.Q(n, d); }
  function Qs(s) { return A.parseQ(String(s)); }
  function dt(q) { return A.decText(q); }
  function neg(n) { return n < 0 ? '−' + fmt(-n) : fmt(n); }
  function nm(s) { return String(s).replace(/-/g, '−'); }
  function pretty(s) { return A.pretty(s); }
  function same(a, b) { var x = A.parse(a), y = A.parse(b); return !!x && !!y && A.equivalent(x, y); }
  function lin(a, b, v) { v = v || 'x'; var s = ''; if (a) s = (a === 1 ? '' : a === -1 ? '-' : a) + v; if (b) s += s ? (b < 0 ? ' - ' + (-b) : ' + ' + b) : String(b); return s || '0'; }
  function quad(b, c) { return 'x^2' + (b ? (b < 0 ? ' - ' + (b === -1 ? '' : -b) + 'x' : ' + ' + (b === 1 ? '' : b) + 'x') : '') + (c ? (c < 0 ? ' - ' + (-c) : ' + ' + c) : ''); }
  function sup(e) { return pretty('^' + e); }
  function stdText(m, e) { return m + ' × 10' + sup(e); }
  function stdQ(m, e) { return e >= 0 ? A.mul(Qs(m), Q(10n ** BigInt(e))) : A.div(Qs(m), Q(10n ** BigInt(-e))); }
  function toStd(q) { var v = A.num(q), e = Math.floor(Math.log10(Math.abs(v))); var m = A.div(q, stdQ('1', e)); if (A.num(m) >= 10) { e++; m = A.div(q, stdQ('1', e)); } if (A.num(m) < 1) { e--; m = A.div(q, stdQ('1', e)); } return [dt(m), e]; }
  function deg(x) { return x * 180 / Math.PI; } function rad(x) { return x * Math.PI / 180; }

  // ================= NUMBER (Glyph Hall) =================
  K.gen({ id: 'y9NumberSets', objective: 'Y9-N-01', title: 'Rational and irrational numbers; recurring decimals',
    make: function (r, L) {
      if (L === 1) { var irr = r.pick(['√2', '√5', 'π', '√10']), rats = r.sample(['0.75', '3/7', '−4', '√9', '0.3̇', '√16'], 3), all = r.shuffle([irr].concat(rats));
        return K.choice('Which of these numbers is <b>irrational</b>?', all, irr, { big: true, hint: 'A rational number can be written as a fraction of two integers. √9 = 3 and 0.3̇ = 1/3 are rational.', params: { irr: irr, all: all }, sol: [irr + ' cannot be written as a fraction: its decimal goes on forever without repeating.'] }); }
      if (L === 2) { var d = r.pick([1, 2, 4, 5, 7, 8]), two = r.chance(0.4), n2 = r.pick([12, 27, 36, 45, 18, 63, 81]);
        if (two) { var s2 = [n2 / OM.gcd(n2, 99), 99 / OM.gcd(n2, 99)]; return K.frac('Write <b>0.' + String(n2).padStart(2, '0') + String(n2).padStart(2, '0') + '…</b> (the digits ' + String(n2).padStart(2, '0') + ' repeat forever) as a fraction in its simplest form.', s2[0], s2[1], { form: 'simplest', hint: 'Two repeating digits: write them over 99, then simplify.', params: { top: n2, den: 99 }, sol: ['x = 0.' + n2 + n2 + '…, so 100x = ' + n2 + '.' + n2 + '…', '99x = ' + n2 + ', x = ' + F(n2, 99) + ' = ' + F(s2[0], s2[1]) + '.'] }); }
        var s1 = [d / OM.gcd(d, 9), 9 / OM.gcd(d, 9)]; return K.frac('Write <b>0.' + d + d + d + '…</b> (the ' + d + ' repeats forever) as a fraction in its simplest form.', s1[0], s1[1], { form: 'simplest', hint: 'One repeating digit: write it over 9.', params: { top: d, den: 9 }, sol: ['x = 0.' + d + d + d + '…, so 10x = ' + d + '.' + d + d + '…', '9x = ' + d + ', so x = ' + F(d, 9) + (s1[1] !== 9 ? ' = ' + F(s1[0], s1[1]) : '') + '.'] }); }
      var lo = r.int(-8, 0), hi = r.int(2, 9), li = r.chance(0.5), hiI = r.chance(0.5), cnt = 0; for (var n = lo - 1; n <= hi + 1; n++) if ((li ? n >= lo : n > lo) && (hiI ? n <= hi : n < hi)) cnt++;
      return K.int('How many <b>integers</b> <i>n</i> satisfy &nbsp;<b>' + neg(lo) + ' ' + (li ? '≤' : '<') + ' n ' + (hiI ? '≤' : '<') + ' ' + hi + '</b>?', cnt, { hint: 'List them. Is each end included?', params: { lo: lo, hi: hi, li: li, hiI: hiI }, sol: ['The integers are ' + (function () { var l = []; for (var k = lo - 1; k <= hi + 1; k++) if ((li ? k >= lo : k > lo) && (hiI ? k <= hi : k < hi)) l.push(neg(k)); return l.join(', '); })() + '.', 'That is ' + cnt + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.irr) return ['√2', '√5', 'π', '√10'].indexOf(q.check.value) >= 0 && p.all.filter(function (x) { return ['√2', '√5', 'π', '√10'].indexOf(x) >= 0; }).length === 1;
      if (p.den) return Math.abs(q.check.n / q.check.d - p.top / p.den) < 1e-12;
      var c = 0; for (var k = -20; k <= 20; k++) if ((p.li ? k >= p.lo : k > p.lo) && (p.hiI ? k <= p.hi : k < p.hi)) c++; return c === q.check.value;
    } });

  K.gen({ id: 'y9StdFormCalc', objective: 'Y9-N-02', title: 'Calculating with standard form',
    make: function (r, L) {
      var a, b, ea, eb, op, ans;
      if (L === 1) { a = String(r.int(1, 3)); b = String(r.int(2, 3)); ea = r.int(2, 6); eb = r.int(2, 6); op = '×'; }
      else if (L === 2) { op = r.pick(['×', '÷']); if (op === '×') { a = String(r.int(4, 9)); b = String(r.int(2, 5)); } else { var bn = r.pick([2, 3, 4]); b = String(bn); a = String(bn * r.int(2, Math.floor(9 / bn))); } ea = r.int(3, 8); eb = r.int(1, ea - 1); }
      else { op = r.pick(['×', '+']); a = dt(Q(r.int(11, 99), 10)); b = dt(Q(r.int(11, 99), 10)); ea = r.int(3, 6); eb = op === '+' ? ea - 1 : -r.int(1, 3); }
      var qa = stdQ(a, ea), qb = stdQ(b, eb); ans = op === '×' ? A.mul(qa, qb) : op === '÷' ? A.div(qa, qb) : A.add(qa, qb);
      var st = toStd(ans);
      return K.stdform('Work out <b>(' + stdText(a, ea) + ') ' + op + ' (' + stdText(b, eb) + ')</b>. Give your answer in standard form.', st[0], st[1], { calc: L === 3, hint: op === '+' ? 'Write both as ordinary numbers (or with the same power of 10), add, then convert back.' : 'Deal with the numbers and the powers of 10 separately. Then make sure the first number is between 1 and 10.', params: { a: a, ea: ea, b: b, eb: eb, op: op },
        sol: [op === '+' ? 'As ordinary numbers: ' + fmt(A.num(qa)) + ' + ' + fmt(A.num(qb)) + ' = ' + fmt(A.num(ans)) + '.' : 'Numbers: ' + a + ' ' + op + ' ' + b + ' = ' + dt(op === '×' ? A.mul(Qs(a), Qs(b)) : A.div(Qs(a), Qs(b))) + '. Powers: 10' + sup(op === '×' ? ea + eb : ea - eb) + '.', 'In standard form: ' + stdText(st[0], st[1]) + '.'] });
    },
    verify: function (q) { var p = q.params, va = parseFloat(p.a) * Math.pow(10, p.ea), vb = parseFloat(p.b) * Math.pow(10, p.eb), v = p.op === '×' ? va * vb : p.op === '÷' ? va / vb : va + vb, got = parseFloat(q.check.m) * Math.pow(10, q.check.e); return Math.abs(got - v) <= 1e-9 * Math.abs(v) && parseFloat(q.check.m) >= 1 && parseFloat(q.check.m) < 10; } });

  K.gen({ id: 'y9Bounds', objective: 'Y9-N-03', title: 'Error intervals and bounds',
    make: function (r, L) {
      if (L === 1) { var v = dt(Q(r.int(11, 199), 10)), lo = A.sub(Qs(v), Q(1, 20)), hi = A.add(Qs(v), Q(1, 20)); return K.ineq('A length <i>x</i> is ' + v + ' cm, correct to 1 decimal place. Write the error interval for <i>x</i>.', dt(lo), true, dt(hi), false, { hint: 'Half of 0.1 is 0.05. Go 0.05 down and 0.05 up.', params: { v: v, unit: '0.1' }, sol: ['Lower bound: ' + v + ' − 0.05 = ' + dt(lo) + '. Upper bound: ' + v + ' + 0.05 = ' + dt(hi) + '.', dt(lo) + ' ≤ x < ' + dt(hi) + '.'] }); }
      if (L === 2) { var w = r.int(11, 99) * 10, l2 = w - 5, h2 = w + 5; return K.ineq('The number of people at a concert is ' + w + ', correct to 2 significant figures. Write the error interval for the number of people, <i>n</i>.', String(l2), true, String(h2), false, { v: 'n', hint: 'To 2 significant figures, ' + w + ' is rounded to the nearest 10.', params: { v: String(w), unit: '10' }, sol: ['Rounded to the nearest 10: half of 10 is 5.', l2 + ' ≤ n < ' + h2 + '.'] }); }
      var a = r.int(5, 20), b = r.int(3, 15), up = r.chance(0.5), val = up ? 2 * (a + 0.5 + b + 0.5) : 2 * (a - 0.5 + b - 0.5);
      return K.dec('A rectangle measures ' + a + ' cm by ' + b + ' cm. Each length is correct to the nearest centimetre. Work out the <b>' + (up ? 'upper' : 'lower') + ' bound</b> of the perimeter.', String(val), { suffix: 'cm', hint: 'Use the ' + (up ? 'upper' : 'lower') + ' bound of each length: ' + (up ? 'add' : 'subtract') + ' 0.5 cm.', params: { a: a, b: b, up: up }, sol: [(up ? 'Upper' : 'Lower') + ' bounds: ' + (up ? a + 0.5 : a - 0.5) + ' cm and ' + (up ? b + 0.5 : b - 0.5) + ' cm.', 'Perimeter: 2 × (' + (up ? a + 0.5 : a - 0.5) + ' + ' + (up ? b + 0.5 : b - 0.5) + ') = ' + val + ' cm.'] });
    },
    verify: function (q) { var p = q.params; if (p.unit) { var u = parseFloat(p.unit), v = parseFloat(p.v); return Math.abs(+q.check.lo - (v - u / 2)) < 1e-9 && Math.abs(+q.check.hi - (v + u / 2)) < 1e-9 && q.check.loInc && !q.check.hiInc; } var d = p.up ? 0.5 : -0.5; return Math.abs(parseFloat(q.check.value) - ((p.a + d) * 2 + (p.b + d) * 2)) < 1e-9; } });

  // ================= ALGEBRA (Serpent Stair) =================
  K.gen({ id: 'y9Factorise', objective: 'Y9-A-01', title: 'Factorising quadratics',
    make: function (r, L) {
      var p, q2, qs, ans;
      if (L === 1) { if (r.chance(0.35)) { var k = r.int(2, 9) * r.pick([1, -1]); qs = quad(k, 0); ans = 'x(' + lin(1, k) + ')'; } else { p = r.int(1, 7); q2 = r.int(1, 7); qs = quad(p + q2, p * q2); ans = '(' + lin(1, p) + ')(' + lin(1, q2) + ')'; } }
      else if (L === 2) { p = r.int(1, 9) * r.pick([1, -1]); q2 = -r.int(1, 9) * (p > 0 ? 1 : r.pick([1, -1])); if (p + q2 === 0) q2 = q2 > 0 ? q2 + 1 : q2 - 1; qs = quad(p + q2, p * q2); ans = '(' + lin(1, p) + ')(' + lin(1, q2) + ')'; }
      else { if (r.chance(0.5)) { var n = r.int(2, 12); qs = 'x^2 - ' + n * n; ans = '(x + ' + n + ')(x - ' + n + ')'; } else { p = -r.int(1, 9); q2 = -r.int(1, 9); qs = quad(p + q2, p * q2); ans = '(' + lin(1, p) + ')(' + lin(1, q2) + ')'; } }
      return K.expr('Factorise <b>' + pretty(nm(qs)) + '</b>', ans, 'factorised', { placeholder: 'e.g. (x + 2)(x + 5)', hint: /\^2 - \d+$/.test(qs) && qs.indexOf('x ') < 0 ? 'This is a difference of two squares: a² − b² = (a + b)(a − b).' : 'Find two numbers that multiply to give the number term and add to give the x coefficient.', params: { q: qs },
        sol: [qs.indexOf('x(') >= 0 || /x\^2 [+-] \d+x$/.test(qs) ? 'Take out the common factor x.' : 'Look for two numbers with the right product and sum.', 'Answer: ' + nm(ans) + '. Check by expanding.'] });
    },
    verify: function (q) { return same(q.check.answer, q.params.q) && OM.markCheck(q.check, q.check.answer).correct; } });

  K.gen({ id: 'y9Quadratics', objective: 'Y9-A-02', title: 'Quadratic graphs',
    make: function (r, L) {
      if (L === 1) { var b = r.int(-4, 4), c = r.int(-6, 6), x = r.int(-3, 3); return K.int('For <b>y = ' + pretty(nm(quad(b, c))) + '</b>, work out y when x = ' + neg(x) + '.', x * x + b * x + c, { keys: 'signed', hint: 'Square x first. A negative number squared is positive.', params: { b: b, c: c, x: x }, sol: ['(' + neg(x) + ')² = ' + x * x + '.', x * x + (b ? ' + (' + neg(b) + ' × ' + neg(x) + ')' : '') + (c ? ' + (' + neg(c) + ')' : '') + ' = ' + (x * x + b * x + c) + '.'] }); }
      var r1 = r.int(-5, 1), r2 = r.int(r1 + 2, 5), bb = -(r1 + r2), cc = r1 * r2;
      if (L === 2) return K.multi('The graph of <b>y = ' + pretty(nm(quad(bb, cc))) + '</b> is drawn. Where does it cross the x-axis? Give the smaller value first.', 'x = {0} and x = {1}', [{ kind: 'int', value: r1 }, { kind: 'int', value: r2 }], { blanks: [{ keys: 'signed' }, { keys: 'signed' }], visual: V.plot({ x: [-6, 6], y: [-12, 12], gy: 2, fns: [{ f: function (x) { return x * x + bb * x + cc; } }] }), hint: 'The graph crosses the x-axis where y = 0.', params: { b: bb, c: cc }, answer: 'x = ' + neg(r1) + ' and x = ' + neg(r2), sol: ['Read where the curve meets the x-axis.', 'x = ' + neg(r1) + ' and x = ' + neg(r2) + ' (these are the roots of ' + pretty(nm(quad(bb, cc))) + ' = 0).'] });
      var h = r.int(-4, 4), k = r.int(-6, 6), b3 = -2 * h, c3 = h * h + k;
      return { prompt: 'The curve <b>y = ' + pretty(nm(quad(b3, c3))) + '</b> is shown. What are the coordinates of its turning point?', input: { type: 'coord' }, check: { kind: 'coord', x: h, y: k }, visual: V.plot({ x: [-7, 7], y: [-8, 14], gy: 2, fns: [{ f: function (x) { return x * x + b3 * x + c3; } }] }), hint: 'The turning point is the lowest point of the curve. It is halfway between any two points with the same y value.', params: { b: b3, c: c3 },
        solution: [S('The curve is symmetrical about x = ' + neg(h) + '.'), S('When x = ' + neg(h) + ', y = ' + neg(k) + '. Turning point: (' + neg(h) + ', ' + neg(k) + ').')] };
    },
    verify: function (q) {
      var p = q.params, f = function (x) { return x * x + p.b * x + p.c; };
      if (p.x !== undefined) return f(p.x) === q.check.value;
      if (q.check.kind === 'multi') return f(q.check.parts[0].value) === 0 && f(q.check.parts[1].value) === 0 && q.check.parts[0].value < q.check.parts[1].value;
      return f(q.check.x) === q.check.y && f(q.check.x - 1) === f(q.check.x + 1) && f(q.check.x - 1) > q.check.y;
    } });

  var SHAPES = [['y = x²', function (x) { return x * x; }, 'quadratic'], ['y = 2x + 1', function (x) { return 2 * x + 1; }, 'linear'], ['y = 1/x', function (x) { return 1 / x; }, 'reciprocal'], ['y = x³', function (x) { return x * x * x; }, 'cubic'], ['y = −x²', function (x) { return -x * x; }, 'quadratic']];
  K.gen({ id: 'y9MatchGraphs', objective: 'Y9-A-03', title: 'Equations and their graphs',
    make: function (r, L) {
      if (L === 1) { var sh = r.pick(SHAPES), wrong = SHAPES.filter(function (s) { return s !== sh; }).map(function (s) { return s[0]; }); return K.choice('Which equation could this graph show?', r.shuffle([sh[0]].concat(r.sample(wrong, 3))), sh[0], { visual: V.plot({ x: [-4, 4], y: [-8, 8], gy: 2, fns: [{ f: sh[1] }] }), hint: 'Straight line: linear. U or ∩ shape: quadratic. S shape: cubic. Two separate curves: reciprocal.', params: { eq: sh[0] }, sol: ['This is a ' + sh[2] + ' graph, so it matches ' + sh[0] + '.'] }); }
      var m = r.int(-5, 5) || 3, c = r.int(-8, 8);
      if (L === 2) { var right = 'y = ' + nm(lin(m, r.int(-9, 9) === c ? c + 1 : c + 3)); return K.choice('Which line is <b>parallel</b> to <b>y = ' + nm(lin(m, c)) + '</b>?', r.shuffle([right, 'y = ' + nm(lin(-m, c)), 'y = ' + nm(lin(m === 1 ? 2 : 1, c)), 'y = ' + nm(lin(m + 2 === 0 ? 3 : m + 2, c))]).filter(function (x, i, a) { return a.indexOf(x) === i; }), right, { hint: 'Parallel lines have the same gradient (the number in front of x).', params: { m: m, right: right }, sol: ['Parallel lines have the same gradient, ' + neg(m) + '.', right + ' has gradient ' + neg(m) + '.'] }); }
      var k = r.int(-9, 9);
      return K.expr('Find the equation of the line that is parallel to <b>y = ' + nm(lin(m, c)) + '</b> and passes through <b>(0, ' + neg(k) + ')</b>.', lin(m, k), 'any', { lhs: 'y', hint: 'Same gradient, and (0, ' + neg(k) + ') tells you the y-intercept.', params: { m: m, k: k }, sol: ['Gradient: ' + neg(m) + '. y-intercept: ' + neg(k) + '.', 'y = ' + nm(lin(m, k)) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.eq) return q.check.value === p.eq; if (p.right) return q.check.value === p.right && new RegExp('^y = ' + (p.m === 1 ? '' : p.m === -1 ? '−' : nm(String(p.m))) + 'x').test(p.right); return same(q.check.answer, p.m + '*x + ' + p.k); } });

  // ================= GRAPHS (Star Map) =================
  K.gen({ id: 'y9GraphSolve', objective: 'Y9-A-04', title: 'Solving equations using graphs',
    make: function (r, L) {
      if (L === 1) { var m = r.int(1, 3), c = r.int(-4, 4), x = r.int(-3, 4); return K.int('Use the graph of <b>y = ' + nm(lin(m, c)) + '</b> to find the value of y when x = ' + neg(x) + '.', m * x + c, { keys: 'signed', visual: V.plot({ x: [-5, 5], y: [-10, 12], gy: 2, fns: [{ f: function (t) { return m * t + c; } }] }), hint: 'Go up (or down) from x = ' + neg(x) + ' to the line, then across.', params: { m: m, c: c, x: x }, sol: ['At x = ' + neg(x) + ' the line is at y = ' + neg(m * x + c) + '.'] }); }
      if (L === 2) { var X = r.int(-3, 4), Y = r.int(-3, 6), m1 = r.int(1, 3), m2 = -r.int(1, 3), c1 = Y - m1 * X, c2 = Y - m2 * X;
        return { prompt: 'The graphs of <b>y = ' + nm(lin(m1, c1)) + '</b> and <b>y = ' + nm(lin(m2, c2)) + '</b> are drawn. Use them to solve the simultaneous equations. Give the solution as a coordinate (x, y).', input: { type: 'coord' }, check: { kind: 'coord', x: X, y: Y }, visual: V.plot({ x: [-5, 6], y: [-8, 12], gy: 2, fns: [{ f: function (t) { return m1 * t + c1; } }, { f: function (t) { return m2 * t + c2; } }] }), hint: 'The solution is where the two lines cross.', params: { l1: [m1, c1], l2: [m2, c2] },
          solution: [S('The lines cross at (' + neg(X) + ', ' + neg(Y) + ').'), S('So x = ' + neg(X) + ' and y = ' + neg(Y) + '.')] }; }
      // x² + pB·x = k has roots r1 and r2 when pB = −(r1 + r2) and k = −r1·r2
      var r1 = r.int(-3, 0), r2 = r.int(1, 4), pB = -(r1 + r2), k = -r1 * r2;
      return K.multi('The graph of <b>y = ' + pretty(nm(quad(pB, 0))) + '</b> is drawn. Use it to solve <b>' + pretty(nm(quad(pB, 0))) + ' = ' + k + '</b>. Give the smaller value first.', 'x = {0} and x = {1}', [{ kind: 'int', value: r1 }, { kind: 'int', value: r2 }], { blanks: [{ keys: 'signed' }, { keys: 'signed' }], visual: V.plot({ x: [-5, 6], y: [-6, 16], gy: 2, fns: [{ f: function (t) { return t * t + pB * t; } }, { f: [[-5, k], [6, k]], color: V.colors.berry, label: 'y = ' + k }] }), hint: 'Draw the line y = ' + k + '. The solutions are the x values where it meets the curve.', params: { b: pB, k: k }, answer: 'x = ' + neg(r1) + ' and x = ' + neg(r2), sol: ['Draw y = ' + k + ' across the graph.', 'It meets the curve at x = ' + neg(r1) + ' and x = ' + neg(r2) + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.l1) return p.l1[0] * q.check.x + p.l1[1] === q.check.y && p.l2[0] * q.check.x + p.l2[1] === q.check.y;
      if (p.k !== undefined) { var f = function (x) { return x * x + p.b * x; }; return f(q.check.parts[0].value) === p.k && f(q.check.parts[1].value) === p.k && q.check.parts[0].value < q.check.parts[1].value; }
      return p.m * p.x + p.c === q.check.value;
    } });

  K.gen({ id: 'y9RealGraphs', objective: 'Y9-A-05', title: 'Real-life graphs: distance–time, growth and more',
    make: function (r, L) {
      var s1 = r.int(2, 5) * 500, t1 = r.pick([10, 20, 25]), rest = r.pick([10, 15]), s2 = r.int(1, 4) * 500, t2 = r.pick([10, 15, 20]);
      var pts = [[0, 0], [t1, s1], [t1 + rest, s1], [t1 + rest + t2, s1 + s2]], name = r.pick(OM.NAMES), T = t1 + rest + t2;
      var vis = V.plot({ x: [0, Math.ceil(T / 10) * 10], y: [0, Math.ceil((s1 + s2) / 500) * 500], gx: 5, gy: 500, lx: 2, ly: 1, fns: [{ f: pts }], xlabel: 'Time (minutes)', ylabel: 'Distance (m)' });
      if (L === 1) { var when = r.pick([t1, t1 + Math.floor(rest / 2)]); return K.int('The distance–time graph shows ' + name + '’s walk. How far had ' + name + ' walked after ' + when + ' minutes?', s1, { suffix: 'm', visual: vis, hint: 'Find ' + when + ' minutes on the time axis, go up to the line, then across.', params: { pts: pts, t: when }, sol: ['At ' + when + ' minutes the graph is at ' + fmt(s1) + ' m.'] }); }
      if (L === 2) return K.dec('Use the graph to work out ' + name + '’s speed in the <b>first part</b> of the walk, in metres per minute.', dt(A.div(Q(s1), Q(t1))), { suffix: 'm/min', visual: vis, hint: 'Speed = distance ÷ time for that section.', params: { d: s1, t: t1 }, sol: [fmt(s1) + ' m in ' + t1 + ' minutes.', fmt(s1) + ' ÷ ' + t1 + ' = ' + dt(A.div(Q(s1), Q(t1))) + ' m per minute.'] });
      var start = r.pick([20, 50, 100, 150]), hrs = r.int(3, 6);
      return K.int('A colony of bacteria doubles every hour. It starts with ' + start + ' bacteria. How many are there after ' + hrs + ' hours?', start * Math.pow(2, hrs), { visual: V.plot({ x: [0, hrs], y: [0, start * Math.pow(2, hrs)], gy: start * Math.pow(2, hrs) / 8, ly: 2, fns: [{ f: function (x) { return start * Math.pow(2, x); } }], xlabel: 'Hours', ylabel: 'Bacteria' }), hint: 'Double it ' + hrs + ' times. This is exponential growth.', params: { s: start, h: hrs }, sol: ['After each hour: ' + [1, 2, 3, 4, 5, 6].slice(0, hrs).map(function (k) { return fmt(start * Math.pow(2, k)); }).join(', ') + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.pts) { for (var i = 1; i < p.pts.length; i++) if (p.t <= p.pts[i][0]) { var a = p.pts[i - 1], b = p.pts[i]; return q.check.value === a[1] + (b[1] - a[1]) * (p.t - a[0]) / (b[0] - a[0]); } return false; } if (p.d) return Math.abs(parseFloat(q.check.value) * p.t - p.d) < 1e-9; var n = p.s; for (var k = 0; k < p.h; k++) n += n; return n === q.check.value; } });

  // ================= RATIO AND GROWTH (Gold Scales) =================
  K.gen({ id: 'y9CompoundInterest', objective: 'Y9-R-01', title: 'Repeated percentage change and compound interest',
    make: function (r, L) {
      if (L === 1) { var pc = r.pick([3, 4, 6, 12, 15, 2.5]), up = r.chance(0.5); return K.dec('What single number do you multiply by to ' + (up ? 'increase' : 'decrease') + ' an amount by <b>' + pc + '%</b>?', dt(A.div(A.add(Q(100), Qs(up ? pc : -pc)), Q(100))), { hint: (up ? '100% + ' : '100% − ') + pc + '%, as a decimal.', params: { pc: pc, up: up }, sol: [(up ? 100 + pc : 100 - pc) + '% = ' + dt(A.div(A.add(Q(100), Qs(up ? pc : -pc)), Q(100))) + '.'] }); }
      var P = r.pick([1000, 2000, 2500, 5000, 800]), rate = r.pick([2, 3, 4, 5]), yrs = r.int(2, 4);
      if (L === 2) { var val = A.mul(Q(P), Q(Math.pow(100 + rate, yrs), Math.pow(100, yrs))); return K.approx('£' + fmt(P) + ' is invested at <b>' + rate + '% compound interest</b> per year. How much is in the account after ' + yrs + ' years? Give your answer to the nearest penny.', A.qText(val), { dp: 2 }, { calc: true, prefix: '£', hint: 'Multiply by ' + dt(Q(100 + rate, 100)) + ' once for each year: × ' + dt(Q(100 + rate, 100)) + sup(yrs) + '.', params: { P: P, m: 1 + rate / 100, y: yrs }, sol: [fmt(P) + ' × ' + dt(Q(100 + rate, 100)) + sup(yrs) + ' = ' + dt(val) + '.', 'To the nearest penny: £' + A.round(A.qText(val), { dp: 2 }) + '.'] }); }
      var car = r.pick([12000, 15000, 18000, 20000]), dep = r.pick([10, 12, 15, 20]), y3 = r.int(2, 4), v3 = A.mul(Q(car), Q(Math.pow(100 - dep, y3), Math.pow(100, y3)));
      return K.approx('A car costs £' + fmt(car) + '. It loses <b>' + dep + '%</b> of its value every year. What is it worth after ' + y3 + ' years? Give your answer to the nearest penny.', A.qText(v3), { dp: 2 }, { calc: true, prefix: '£', hint: 'Losing ' + dep + '% means multiplying by ' + dt(Q(100 - dep, 100)) + ' each year.', params: { P: car, m: 1 - dep / 100, y: y3 }, sol: [fmt(car) + ' × ' + dt(Q(100 - dep, 100)) + sup(y3) + ' = ' + dt(v3) + '.', '£' + A.round(A.qText(v3), { dp: 2 }) + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.pc !== undefined) return Math.abs(parseFloat(q.check.value) - (1 + (p.up ? p.pc : -p.pc) / 100)) < 1e-12;
      // year by year in whole pence ×1000 to avoid rounding drift; compare to the nearest penny
      var v = p.P; for (var i = 0; i < p.y; i++) v = v * p.m; return Math.abs(parseFloat(A.round(q.check.value, { dp: 2 })) - Math.round(v * 100) / 100) < 0.011;
    } });

  K.gen({ id: 'y9RatioLinear', objective: 'Y9-R-02', title: 'Ratio, fractions and straight-line relationships',
    make: function (r, L) {
      var a = r.int(2, 9), b = r.int(2, 7); while (OM.gcd(a, b) !== 1 || a === b) b = r.int(2, 7);
      if (L === 1) return K.expr('The ratio <b>y : x = ' + a + ' : ' + b + '</b>. Write an equation for y in terms of x.', a + 'x/' + b, 'any', { lhs: 'y', placeholder: 'y = …', hint: 'y is ' + F(a, b) + ' of x.', params: { a: a, b: b }, sol: ['y : x = ' + a + ' : ' + b + ' means y = ' + F(a, b) + 'x.'] });
      if (L === 2) { var k = dt(Q(r.int(3, 9), 2)), xs = [2, 4, 6, 8], ys = xs.map(function (x) { return dt(A.mul(Q(x), Qs(k))); }); return K.expr('The table shows values of x and y. y is directly proportional to x. Write an equation for y in terms of x.', k + 'x', 'any', { lhs: 'y', visual: V.table(['x'].concat(xs.map(String)), [['y'].concat(ys)]), hint: 'Divide any y value by its x value to find the constant.', params: { xs: xs, ys: ys }, sol: [ys[0] + ' ÷ ' + xs[0] + ' = ' + k + '.', 'y = ' + k + 'x. The graph is a straight line through the origin.'] }); }
      var t = (a + b) * r.int(3, 12);
      return K.int('Two numbers are in the ratio ' + a + ' : ' + b + '. Their sum is ' + t + '. What is the <b>larger</b> number?', Math.max(a, b) * t / (a + b), { hint: 'The larger number is ' + F(Math.max(a, b), a + b) + ' of the total.', params: { a: a, b: b, t: t }, sol: ['There are ' + (a + b) + ' parts. The larger number is ' + F(Math.max(a, b), a + b) + ' of ' + t + '.', '= ' + Math.max(a, b) * t / (a + b) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.t) return q.check.value * (p.a + p.b) === Math.max(p.a, p.b) * p.t; if (p.xs) return p.xs.every(function (x, i) { var e = A.poly(A.parse(q.check.answer.replace(/x/g, '(' + x + ')'))); return e && A.eq(e[''] || A.Q(0), Qs(p.ys[i])); }); var e2 = A.poly(A.parse(q.check.answer.replace(/x/g, '(' + p.b + ')'))); return !!e2 && A.eq(e2[''], A.Q(p.a)); } });

  K.gen({ id: 'y9InverseProportion', objective: 'Y9-R-03', title: 'Inverse proportion and proportion equations',
    make: function (r, L) {
      if (L === 1) { var w = r.pick([2, 3, 4, 6]), d = r.pick([4, 6, 8, 12]), w2 = r.pick([1, 2, 3, 4, 6, 8, 12].filter(function (x) { return x !== w && (w * d) % x === 0; })); return K.int(w + ' workers take ' + d + ' days to build a wall. How long would ' + w2 + ' workers take, working at the same rate?', w * d / w2, { suffix: 'days', hint: 'More workers means fewer days. Find the total "worker-days" first.', params: { w: w, d: d, w2: w2 }, sol: [w + ' × ' + d + ' = ' + w * d + ' worker-days.', w * d + ' ÷ ' + w2 + ' = ' + w * d / w2 + ' days.'] }); }
      if (L === 2) { var x1 = r.int(2, 6), y1 = r.int(3, 12), kk = x1 * y1, x2 = r.pick([1, 2, 3, 4, 6, 8, 9, 12, 18].filter(function (x) { return x !== x1 && kk % x === 0; })); return K.int('y is <b>inversely</b> proportional to x. When x = ' + x1 + ', y = ' + y1 + '. Find y when x = ' + x2 + '.', kk / x2, { hint: 'Inverse proportion: y = k/x, so k = x × y.', params: { x1: x1, y1: y1, x2: x2, inv: true }, sol: ['k = ' + x1 + ' × ' + y1 + ' = ' + kk + '.', 'y = ' + kk + ' ÷ ' + x2 + ' = ' + kk / x2 + '.'] }); }
      var a = r.int(2, 6), k2 = r.int(2, 5), b = r.int(2, 9); while (b === a) b++;
      return K.int('y is directly proportional to x². When x = ' + a + ', y = ' + k2 * a * a + '. Find y when x = ' + b + '.', k2 * b * b, { hint: 'Write y = kx². Use the values you know to find k.', params: { a: a, ya: k2 * a * a, b: b }, sol: ['k = ' + k2 * a * a + ' ÷ ' + a + '² = ' + k2 + '.', 'y = ' + k2 + ' × ' + b + '² = ' + k2 * b * b + '.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; if (p.w) return v * p.w2 === p.w * p.d; if (p.inv) return v * p.x2 === p.x1 * p.y1; return v * p.a * p.a === p.ya * p.b * p.b; } });

  // ================= TRIANGLES (Pyramid Court) =================
  var TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10]];
  K.gen({ id: 'y9Pythagoras', objective: 'Y9-G-01', title: 'Pythagoras’ theorem',
    make: function (r, L) {
      if (L === 1) { var t = r.pick(TRIPLES), k = r.int(1, 3); return K.int('Find the length of the hypotenuse.', t[2] * k, { suffix: 'cm', visual: V.rightTri({ w: t[1], h: t[0], base: t[1] * k + ' cm', height: t[0] * k + ' cm', hyp: '?' }), hint: 'a² + b² = c², where c is the hypotenuse.', params: { a: t[0] * k, b: t[1] * k, find: 'hyp' }, sol: [t[0] * k + '² + ' + t[1] * k + '² = ' + (t[0] * k) * (t[0] * k) + ' + ' + (t[1] * k) * (t[1] * k) + ' = ' + (t[2] * k) * (t[2] * k) + '.', '√' + (t[2] * k) * (t[2] * k) + ' = ' + t[2] * k + ' cm.'] }); }
      if (L === 2) { var h = r.int(9, 25), a = r.int(3, h - 3), b = Math.sqrt(h * h - a * a); if (b % 1 === 0) { h++; b = Math.sqrt(h * h - a * a); }
        return K.approx('Find the length of the missing side, <i>x</i>. Give your answer to 1 decimal place.', b.toFixed(12), { dp: 1 }, { calc: true, suffix: 'cm', visual: V.rightTri({ w: b, h: a, base: 'x', height: a + ' cm', hyp: h + ' cm' }), hint: 'The hypotenuse is the longest side. For a shorter side: x² = ' + h + '² − ' + a + '².', params: { a: a, h: h, find: 'leg' }, sol: ['x² = ' + h + '² − ' + a + '² = ' + (h * h - a * a) + '.', 'x = √' + (h * h - a * a) + ' = ' + b.toFixed(4) + '… = ' + A.round(b.toFixed(12), { dp: 1 }) + ' cm.'] }); }
      var x1 = r.int(-5, 2), y1 = r.int(-5, 2), x2 = x1 + r.int(2, 7), y2 = y1 + r.int(2, 7), d = Math.hypot(x2 - x1, y2 - y1);
      if (d % 1 === 0) x2++;
      d = Math.hypot(x2 - x1, y2 - y1);
      return K.approx('Find the distance between A(' + neg(x1) + ', ' + neg(y1) + ') and B(' + neg(x2) + ', ' + neg(y2) + '). Give your answer to 1 decimal place.', d.toFixed(12), { dp: 1 }, { calc: true, hint: 'Draw a right-angled triangle: across ' + (x2 - x1) + ', up ' + (y2 - y1) + '. Then use Pythagoras.', params: { dx: x2 - x1, dy: y2 - y1, find: 'dist' }, sol: ['Across: ' + (x2 - x1) + '. Up: ' + (y2 - y1) + '.', '√(' + (x2 - x1) + '² + ' + (y2 - y1) + '²) = √' + ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) + ' = ' + A.round(d.toFixed(12), { dp: 1 }) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.find === 'hyp') return q.check.value * q.check.value === p.a * p.a + p.b * p.b; var want = p.find === 'leg' ? Math.sqrt(p.h * p.h - p.a * p.a) : Math.sqrt(p.dx * p.dx + p.dy * p.dy); return Math.abs(parseFloat(A.round(q.check.value, { dp: 1 })) - Math.round(want * 10) / 10) < 1e-9; } });

  K.gen({ id: 'y9Trig', objective: 'Y9-G-02', title: 'Trigonometry in right-angled triangles',
    make: function (r, L) {
      var ang = r.int(20, 70), H = r.int(6, 20);
      if (L < 3) { var which = L === 1 ? r.pick(['opp', 'adj']) : r.pick(['opp', 'adj', 'hypFromOpp']);
        var opp = H * Math.sin(rad(ang)), adj = H * Math.cos(rad(ang)), ans, lab;
        if (which === 'opp') { ans = opp; lab = { w: adj, h: opp, base: '', height: 'x', hyp: H + ' cm', angle: ang + '°' }; }
        else if (which === 'adj') { ans = adj; lab = { w: adj, h: opp, base: 'x', height: '', hyp: H + ' cm', angle: ang + '°' }; }
        else { var o2 = r.int(4, 15); ans = o2 / Math.sin(rad(ang)); lab = { w: o2 / Math.tan(rad(ang)), h: o2, base: '', height: o2 + ' cm', hyp: 'x', angle: ang + '°' }; H = o2; }
        return K.approx('Find the length <i>x</i>. Give your answer to 1 decimal place.', ans.toFixed(12), { dp: 1 }, { calc: true, suffix: 'cm', visual: V.rightTri(lab), hint: which === 'opp' ? 'Opposite and hypotenuse: use sin. x = ' + H + ' × sin ' + ang + '°.' : which === 'adj' ? 'Adjacent and hypotenuse: use cos. x = ' + H + ' × cos ' + ang + '°.' : 'Opposite known, hypotenuse wanted: x = ' + H + ' ÷ sin ' + ang + '°.', params: { which: which, ang: ang, H: H },
          sol: ['Label the sides from the angle: opposite, adjacent, hypotenuse (SOH CAH TOA).', which === 'opp' ? 'x = ' + H + ' × sin ' + ang + '°' : which === 'adj' ? 'x = ' + H + ' × cos ' + ang + '°' : 'x = ' + H + ' ÷ sin ' + ang + '°', '= ' + ans.toFixed(4) + '… = ' + A.round(ans.toFixed(12), { dp: 1 }) + ' cm.'] }); }
      var o = r.int(3, 15), a = r.int(4, 18), th = deg(Math.atan2(o, a));
      return K.approx('Find the angle <i>θ</i>. Give your answer to 1 decimal place.', th.toFixed(12), { dp: 1 }, { calc: true, suffix: '°', visual: V.rightTri({ w: a, h: o, base: a + ' cm', height: o + ' cm', angle: 'θ' }), hint: 'Opposite and adjacent: use tan. θ = tan⁻¹(' + o + ' ÷ ' + a + ').', params: { which: 'angle', o: o, a: a }, sol: ['tan θ = ' + o + ' ÷ ' + a + '.', 'θ = tan⁻¹(' + o + ' ÷ ' + a + ') = ' + th.toFixed(4) + '… = ' + A.round(th.toFixed(12), { dp: 1 }) + '°.'] });
    },
    // independent: rebuild the triangle with Pythagoras and check the ratio
    verify: function (q) {
      var p = q.params, v = parseFloat(A.round(q.check.value, { dp: 1 }));
      if (p.which === 'angle') return Math.abs(v - Math.round(deg(Math.asin(p.o / Math.hypot(p.o, p.a))) * 10) / 10) < 1e-9;
      var want = p.which === 'opp' ? Math.sqrt(p.H * p.H - Math.pow(p.H * Math.sin(rad(90 - p.ang)), 2)) : p.which === 'adj' ? Math.sqrt(p.H * p.H - Math.pow(p.H * Math.cos(rad(90 - p.ang)), 2)) : p.H / Math.cos(rad(90 - p.ang));
      return Math.abs(v - Math.round(want * 10) / 10) < 1e-9;
    } });

  K.gen({ id: 'y9Enlargement', objective: 'Y9-G-03', title: 'Enlargement and similar shapes',
    make: function (r, L) {
      var sf = L === 3 ? 0.5 : r.int(2, 3), cx = L === 1 ? 0 : r.int(-3, 2), cy = L === 1 ? 0 : r.int(-3, 2), px = cx + r.int(-3, 3) * (L === 3 ? 2 : 1), py = cy + r.int(1, 3) * (L === 3 ? 2 : 1);
      if (px === cx) px += L === 3 ? 2 : 1;
      var ix = cx + (px - cx) * sf, iy = cy + (py - cy) * sf;
      return { prompt: 'The point P(' + neg(px) + ', ' + neg(py) + ') is enlarged by scale factor <b>' + (sf === 0.5 ? '½' : sf) + '</b>, centre <b>(' + neg(cx) + ', ' + neg(cy) + ')</b>. Where is its image?', input: { type: 'coord' }, check: { kind: 'coord', x: ix, y: iy }, visual: V.grid4({ n: 8, points: [{ x: px, y: py, label: 'P' }, { x: cx, y: cy, label: 'C' }] }),
        hint: 'Find the move from the centre to P, multiply it by ' + (sf === 0.5 ? '½' : sf) + ', then do that move from the centre.', params: { c: [cx, cy], p: [px, py], sf: sf },
        solution: [S('From the centre to P: (' + neg(px - cx) + ', ' + neg(py - cy) + ').'), S('× ' + (sf === 0.5 ? '½' : sf) + ': (' + neg((px - cx) * sf) + ', ' + neg((py - cy) * sf) + ').'), S('Image: (' + neg(ix) + ', ' + neg(iy) + ').')] };
    },
    verify: function (q) { var p = q.params, ux = q.check.x - p.c[0], uy = q.check.y - p.c[1], vx = p.p[0] - p.c[0], vy = p.p[1] - p.c[1]; return ux * vy === uy * vx && Math.abs(Math.hypot(ux, uy) - p.sf * Math.hypot(vx, vy)) < 1e-9 && ux * vx + uy * vy > 0; } });

  var CONG = [['three pairs of sides are equal', 'SSS'], ['two sides and the angle between them are equal', 'SAS'], ['two angles and the side between them are equal', 'ASA'], ['both have a right angle, equal hypotenuses and one other equal side', 'RHS']];
  K.gen({ id: 'y9Congruence', objective: 'Y9-G-04', title: 'Labelling triangles and congruence',
    make: function (r, L) {
      if (L === 1) { var v = r.pick(['A', 'B', 'C']), opp = { A: 'BC', B: 'AC', C: 'AB' }[v]; return K.choice('In triangle ABC, which side is opposite angle <b>' + v + '</b>?', ['AB', 'BC', 'AC'], opp, { hint: 'The opposite side does not touch the angle. It is labelled with the small letter ' + v.toLowerCase() + '.', params: { v: v }, sol: ['Side ' + opp + ' does not touch ' + v + ', so it is opposite. It is also called ' + v.toLowerCase() + '.'] }); }
      if (L === 2) { var c = r.pick(CONG); return K.choice('Two triangles are congruent because ' + c[0] + '. Which condition is this?', ['SSS', 'SAS', 'ASA', 'RHS'], c[1], { hint: 'S = side, A = angle, R = right angle, H = hypotenuse.', params: { c: c[0] }, sol: [c[0].charAt(0).toUpperCase() + c[0].slice(1) + ': ' + c[1] + '.'] }); }
      return K.choice('Which of these is <b>not</b> enough to prove two triangles are congruent?', r.shuffle(['all three angles are equal (AAA)', 'three pairs of sides are equal (SSS)', 'two sides and the included angle are equal (SAS)', 'two angles and a corresponding side are equal (AAS)']), 'all three angles are equal (AAA)', { hint: 'Two triangles can have the same angles but be different sizes.', params: {}, sol: ['Equal angles only prove the triangles are similar (same shape), not congruent (same size).'] });
    },
    verify: function (q) { var p = q.params; if (p.v) return q.check.value.indexOf(p.v) < 0; if (p.c) return CONG.some(function (x) { return x[0] === p.c && x[1] === q.check.value; }); return /AAA/.test(q.check.value); } });

  // ================= REASONING (Moon Courtyard) =================
  K.gen({ id: 'y9AngleReasons', objective: 'Y9-G-05', title: 'Angle reasoning and simple proofs',
    make: function (r, L) {
      if (L === 1) { var a = r.int(30, 80), b = r.int(30, 80); return K.int('In a triangle, two interior angles are ' + a + '° and ' + b + '°. Find the <b>exterior</b> angle at the third corner.', a + b, { suffix: '°', hint: 'The exterior angle of a triangle equals the sum of the two opposite interior angles.', params: { a: a, b: b }, sol: ['Third interior angle: 180 − ' + a + ' − ' + b + ' = ' + (180 - a - b) + '°.', 'Exterior angle: 180 − ' + (180 - a - b) + ' = ' + (a + b) + '° (the same as ' + a + ' + ' + b + ').'] }); }
      if (L === 2) { var A1 = r.int(50, 130); return K.int('ABCD is a parallelogram. Angle A is ' + A1 + '°. Find angle B.', 180 - A1, { suffix: '°', hint: 'In a parallelogram, angles next to each other add up to 180° (co-interior angles).', params: { A1: A1 }, sol: ['AD is parallel to BC, so angles A and B are co-interior.', 'B = 180 − ' + A1 + ' = ' + (180 - A1) + '°.'] }); }
      var step = r.pick([['The angles in triangle ABC add up to 180° because…', 'angles in a triangle add up to 180°'], ['Angle ABD equals angle BDC (the lines AB and CD are parallel) because…', 'alternate angles are equal'], ['The base angles of triangle OAB are equal (OA and OB are radii) because…', 'base angles of an isosceles triangle are equal'], ['Angle x + angle y = 180° (they are next to each other on a straight line) because…', 'angles on a straight line add up to 180°']]);
      return K.choice('Choose the correct reason for this step in a proof: <b>' + step[0] + '</b>', r.shuffle(['angles in a triangle add up to 180°', 'alternate angles are equal', 'base angles of an isosceles triangle are equal', 'angles on a straight line add up to 180°']), step[1], { hint: 'Match the reason to the shapes and lines in the step.', params: { step: step[0] }, sol: ['The reason is: ' + step[1] + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.a) return q.check.value === p.a + p.b && 180 - (180 - p.a - p.b) === q.check.value; if (p.A1) return q.check.value + p.A1 === 180; var s = p.step; var want = /triangle ABC/.test(s) ? 'angles in a triangle' : /parallel/.test(s) ? 'alternate' : /radii/.test(s) ? 'isosceles' : 'straight line'; return q.check.value.indexOf(want) >= 0; } });

  K.gen({ id: 'y9Properties', objective: 'Y9-G-06', title: 'Properties of shapes and circles',
    make: function (r, L) {
      if (L === 1) { var it = r.pick([['diagonals that are equal and bisect each other at right angles', 'square'], ['diagonals that bisect each other at right angles but are not equal', 'rhombus'], ['equal diagonals that bisect each other but not at right angles', 'rectangle'], ['diagonals that cross at right angles, where only one is cut in half', 'kite']]);
        return K.choice('Which quadrilateral has ' + it[0] + '?', ['square', 'rhombus', 'rectangle', 'kite'], it[1], { hint: 'Sketch each shape and draw its diagonals.', params: { it: it[0] }, sol: ['A ' + it[1] + ' has ' + it[0] + '.'] }); }
      var c = r.int(20, 140); if (c % 2) c++;
      if (L === 2) return K.int('O is the centre of a circle. A and B are points on the circle. Angle AOB = ' + c + '°. Find angle OAB.', (180 - c) / 2, { suffix: '°', hint: 'OA and OB are both radii, so triangle OAB is isosceles.', params: { c: c }, sol: ['OA = OB (radii), so the base angles are equal.', '(180 − ' + c + ') ÷ 2 = ' + (180 - c) / 2 + '°.'] });
      var n = r.pick([5, 6, 8, 9, 10, 12]);
      return K.int('Each <b>interior</b> angle of a regular polygon with ' + n + ' sides is how many degrees?', 180 - 360 / n, { suffix: '°', hint: 'Exterior angle = 360 ÷ ' + n + '. Interior = 180 − exterior.', params: { n: n }, sol: ['Exterior angle: 360 ÷ ' + n + ' = ' + 360 / n + '°.', 'Interior angle: 180 − ' + 360 / n + ' = ' + (180 - 360 / n) + '°.'] });
    },
    verify: function (q) { var p = q.params; if (p.it) return { 'diagonals that are equal and bisect each other at right angles': 'square', 'diagonals that bisect each other at right angles but are not equal': 'rhombus', 'equal diagonals that bisect each other but not at right angles': 'rectangle', 'diagonals that cross at right angles, where only one is cut in half': 'kite' }[p.it] === q.check.value; if (p.c) return 2 * q.check.value + p.c === 180; return q.check.value * p.n === (p.n - 2) * 180; } });

  var BASES = { 3: 'triangular', 4: 'square-based', 5: 'pentagonal', 6: 'hexagonal', 8: 'octagonal' };
  K.gen({ id: 'y9Solids3D', objective: 'Y9-G-07', title: 'Faces, edges and vertices; surface area',
    make: function (r, L) {
      var n = +r.pick(Object.keys(BASES));
      if (L === 1) { var what = r.pick(['faces', 'edges', 'vertices']), v = { faces: n + 2, edges: 3 * n, vertices: 2 * n }[what]; return K.int('How many <b>' + what + '</b> does a ' + (n === 4 ? 'cuboid (a square-based prism)' : BASES[n] + ' prism') + ' have?', v, { hint: 'A prism has two end faces with ' + n + ' sides each, joined by ' + n + ' rectangles.', params: { n: n, what: what, k: 'prism' }, sol: ['Faces: ' + n + ' + 2 = ' + (n + 2) + '. Edges: 3 × ' + n + ' = ' + 3 * n + '. Vertices: 2 × ' + n + ' = ' + 2 * n + '.'] }); }
      if (L === 2) { var F2 = n + 1, E2 = 2 * n, V2 = n + 1, hide = r.pick(['F', 'E', 'V']); return K.int('A ' + BASES[n] + ' pyramid has ' + (hide === 'F' ? '' : F2 + ' faces, ') + (hide === 'E' ? '' : E2 + ' edges') + (hide === 'V' ? '' : (hide === 'E' ? '' : ' and ') + V2 + ' vertices') + '. Use Euler’s formula, F + V − E = 2, to find the number of ' + { F: 'faces', E: 'edges', V: 'vertices' }[hide] + '.', { F: F2, E: E2, V: V2 }[hide], { hint: 'Put the two numbers you know into F + V − E = 2.', params: { F: F2, E: E2, V: V2, hide: hide, k: 'euler' }, sol: ['F + V − E = 2.', 'The missing number is ' + { F: F2, E: E2, V: V2 }[hide] + '.'] }); }
      var l = r.int(2, 12), w = r.int(2, 10), h = r.int(2, 9);
      return K.int('Find the <b>surface area</b> of a cuboid ' + l + ' cm by ' + w + ' cm by ' + h + ' cm.', 2 * (l * w + l * h + w * h), { suffix: 'cm²', visual: l <= 6 && w <= 5 && h <= 5 ? V.cubes(l, w, h) : '', hint: 'There are three pairs of matching faces.', params: { d: [l, w, h], k: 'sa' }, sol: ['Faces: ' + l + '×' + w + ' = ' + l * w + ', ' + l + '×' + h + ' = ' + l * h + ', ' + w + '×' + h + ' = ' + w * h + '.', 'Total: 2 × (' + l * w + ' + ' + l * h + ' + ' + w * h + ') = ' + 2 * (l * w + l * h + w * h) + ' cm².'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; if (p.k === 'prism') { var F = p.n + 2, E = 3 * p.n, Vx = 2 * p.n; return F + Vx - E === 2 && v === { faces: F, edges: E, vertices: Vx }[p.what]; } if (p.k === 'euler') { var o = { F: p.F, E: p.E, V: p.V }; o[p.hide] = v; return o.F + o.V - o.E === 2; } var d = p.d, s = 0; [[0, 1], [0, 2], [1, 2]].forEach(function (pr) { s += 2 * d[pr[0]] * d[pr[1]]; }); return s === v; } });

  K.gen({ id: 'y9AlgGeo', objective: 'Y9-G-08', title: 'Algebra in geometry',
    make: function (r, L) {
      if (L === 1) { var k = r.pick([[1, 2, 3], [1, 2, 6], [2, 3, 4], [1, 3, 5], [2, 3, 7]]), s = k[0] + k[1] + k[2]; return K.solve('The angles of a triangle are ' + k.map(function (c) { return c === 1 ? 'x' : c + 'x'; }).join(', ') + ' (in degrees). Find x.', A.qText(Q(180, s)).replace('−', '-'), { hint: 'The angles add up to 180°, so ' + s + 'x = 180.', params: { k: k }, sol: [k.join('x + ').replace(/^1x/, 'x') + 'x = ' + s + 'x = 180.', 'x = 180 ÷ ' + s + ' = ' + nm(A.qText(Q(180, s))) + '.'] }); }
      if (L === 2) { var x = r.int(10, 30), a = r.int(2, 4), b = r.int(1, 3), c1 = r.int(1, 30), c2 = 180 - (a + b) * x - c1; return K.solve('Two angles on a straight line are <b>(' + a + 'x + ' + c1 + ')°</b> and <b>(' + b + 'x + ' + c2 + ')°</b>. Find x.', String(x), { hint: 'Angles on a straight line add up to 180°.', params: { a: a, b: b, c1: c1, c2: c2 }, sol: [(a + b) + 'x + ' + (c1 + c2) + ' = 180.', (a + b) + 'x = ' + (180 - c1 - c2) + ', so x = ' + x + '.'] }); }
      var x3 = r.int(2, 9), p1 = r.int(2, 3), q1 = r.int(1, 5), q2 = r.int(1, 6), per = 2 * (p1 * x3 + q1 + x3 + q2);
      return K.solve('A rectangle has length <b>(' + p1 + 'x + ' + q1 + ')</b> cm and width <b>(x + ' + q2 + ')</b> cm. Its perimeter is ' + per + ' cm. Find x.', String(x3), { hint: 'Perimeter = 2 × (length + width). Write an equation and solve it.', params: { p1: p1, q1: q1, q2: q2, per: per }, sol: ['2(' + p1 + 'x + ' + q1 + ' + x + ' + q2 + ') = ' + per + '.', (2 * p1 + 2) + 'x + ' + 2 * (q1 + q2) + ' = ' + per + ', so x = ' + x3 + '.'] });
    },
    verify: function (q) { var p = q.params, x = A.num(Qs(q.check.value)); if (p.k) return Math.abs(x * (p.k[0] + p.k[1] + p.k[2]) - 180) < 1e-9; if (p.a) return Math.abs(p.a * x + p.c1 + p.b * x + p.c2 - 180) < 1e-9; return Math.abs(2 * (p.p1 * x + p.q1) + 2 * (x + p.q2) - p.per) < 1e-9; } });

  // ================= PROBABILITY (Oracle Pool) =================
  K.gen({ id: 'y9Combined', objective: 'Y9-P-01', title: 'Combined events',
    make: function (r, L) {
      if (L === 1) { var face = r.int(1, 6), side = r.pick(['heads', 'tails']); return K.frac('A fair coin is flipped and a fair dice is rolled. What is the probability of getting <b>' + side + '</b> and a <b>' + face + '</b>?', 1, 12, { hint: 'There are 2 × 6 = 12 equally likely outcomes. List them in a sample space.', params: { n: 1, tot: 12 }, sol: ['Outcomes: 2 × 6 = 12.', 'Only one is ' + side + ' and ' + face + ': P = ' + F(1, 12) + '.'] }); }
      var red = r.int(2, 6), blue = r.int(2, 6), t = red + blue;
      if (L === 2) { var s = [red * red / OM.gcd(red * red, t * t), t * t / OM.gcd(red * red, t * t)]; return K.frac('A bag has ' + red + ' red and ' + blue + ' blue counters. A counter is taken, its colour noted, and it is <b>put back</b>. Then a second counter is taken. What is the probability that both are red?', s[0], s[1], { hint: 'The counter is replaced, so the probability stays the same. Multiply: P(red) × P(red).', params: { red: red, t: t, rep: true }, sol: ['P(red) = ' + F(red, t) + ' each time.', F(red, t) + ' × ' + F(red, t) + ' = ' + F(red * red, t * t) + (s[1] !== t * t ? ' = ' + F(s[0], s[1]) : '') + '.'] }); }
      var num = red * (red - 1), den = t * (t - 1), g = OM.gcd(num, den);
      return K.frac('A bag has ' + red + ' red and ' + blue + ' blue counters. Two counters are taken <b>without replacement</b>. What is the probability that both are red?', num / g, den / g, { hint: 'After taking a red, there is one fewer red and one fewer counter.', params: { red: red, t: t, rep: false }, sol: ['First red: ' + F(red, t) + '. Second red: ' + F(red - 1, t - 1) + '.', F(red, t) + ' × ' + F(red - 1, t - 1) + ' = ' + F(num, den) + (g > 1 ? ' = ' + F(num / g, den / g) : '') + '.'] });
    },
    // independent: list every outcome
    verify: function (q) {
      var p = q.params, v = q.check.n / q.check.d;
      if (p.tot) return Math.abs(v - 1 / 12) < 1e-12;
      var bag = []; for (var i = 0; i < p.t; i++) bag.push(i < p.red ? 'R' : 'B'); var good = 0, all = 0;
      for (i = 0; i < p.t; i++) for (var j = 0; j < p.t; j++) { if (!p.rep && i === j) continue; all++; if (bag[i] === 'R' && bag[j] === 'R') good++; }
      return Math.abs(v - good / all) < 1e-12;
    } });
})(typeof window !== 'undefined' ? window : globalThis);
