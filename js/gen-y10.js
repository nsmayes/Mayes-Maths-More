/* Learn with Pip — Year 10 (GCSE) question generators: number, algebra and probability.
   Levels are grade bands: 1 = Grade 1–3, 2 = Grade 4–5, 3 = Grade 6–7 (Foundation-tier students stop at Grade 4–5).
   Many levels re-use tested Key Stage 3 generators (see K.gcse in kit.js); new GCSE content is written here, each with its own check. */
(function (G) {
  'use strict';
  var OM = G.OM, K = OM.kit, V = OM.V, S = K.S, fmt = OM.fmt, F = K.fr, A = OM.alg;
  function Q(n, d) { return A.Q(n, d); }
  function neg(n) { return n < 0 ? '−' + fmt(-n) : fmt(n); }
  function nm(s) { return String(s).replace(/-/g, '−'); }
  function lin(a, b, v) { v = v || 'x'; var s = ''; if (a) s = (a === 1 ? '' : a === -1 ? '-' : a) + v; if (b) s += s ? (b < 0 ? ' - ' + (-b) : ' + ' + b) : String(b); return s || '0'; }
  function quad(b, c) { return 'x^2' + (b ? (b < 0 ? ' - ' + (b === -1 ? '' : -b) + 'x' : ' + ' + (b === 1 ? '' : b) + 'x') : '') + (c ? (c < 0 ? ' - ' + (-c) : ' + ' + c) : ''); }
  function same(a, b) { var x = A.parse(a), y = A.parse(b); return !!x && !!y && A.equivalent(x, y); }
  function simp(n, d) { var g = OM.gcd(n, d); return [n / g, d / g]; }
  var gc = K.gcse;

  // ---------- pictures ----------
  function machine(steps, input, output) {
    var b = '', x = 8, w = 96;
    var box = function (t, fill) { var s = V.rect(x, 20, w, 44, { fill: fill, stroke: V.colors.ink, w: 2 }) + V.t(x + w / 2, 43, t, { size: 16, weight: 'bold' }); x += w; return s; };
    var arrow = function () { var s = V.line(x + 4, 42, x + 30, 42, { w: 2.5 }) + '<path d="M' + (x + 30) + ' 36 L' + (x + 38) + ' 42 L' + (x + 30) + ' 48Z" fill="' + V.colors.ink + '"/>'; x += 42; return s; };
    b += box(input, '#fff') + arrow();
    steps.forEach(function (st) { b += box(st, V.colors.amberLight) + arrow(); });
    b += box(output, '#fff');
    return V.svg(x + 8, 84, b);
  }
  // a frequency tree: total, first split [a, b] with labels, second splits [[a1, a2], [b1, b2]] with labels; '?' allowed
  function freqTree(total, first, second, l1, l2) {
    var b = '', bx = function (x, y, t) { return V.rect(x - 26, y - 16, 52, 32, { fill: '#fff', stroke: V.colors.ink, w: 2 }) + V.t(x, y + 1, String(t), { size: 15, weight: 'bold' }); };
    var ys1 = [70, 200], ys2 = [[35, 105], [165, 235]];
    b += bx(50, 135, total);
    ys1.forEach(function (y, i) { b += V.line(76, 135, 174, y, { w: 2 }) + V.t(125, (135 + y) / 2 - 10, l1[i], { size: 12, fill: V.colors.soft }) + bx(200, y, first[i]);
      ys2[i].forEach(function (y2, j) { b += V.line(226, y, 334, y2, { w: 2 }) + V.t(282, (y + y2) / 2 - 9, l2[j], { size: 12, fill: V.colors.soft }) + bx(360, y2, second[i][j]); }); });
    return V.svg(400, 260, b);
  }

  // ================= NUMBER =================
  gc({ id: 'g10Order', objective: 'Y10-N1', title: 'Ordering numbers and inequality symbols', levels: { 1: ['y7Order', 1], 2: ['y7Order', 2], 3: ['y7Order', 3] } });
  gc({ id: 'g10FourOps', objective: 'Y10-N2', title: 'The four operations with integers, decimals and fractions', levels: { 1: ['y7Negatives', 2], 2: ['y7DecimalOps', 3], 3: ['y7Fractions', 3] } });
  gc({ id: 'g10Priority', objective: 'Y10-N3', title: 'Inverse operations and priority of operations', levels: { 1: ['y7Bidmas', 1], 2: ['y7Bidmas', 3], 3: ['y7Inverse', 3] } });
  gc({ id: 'g10Primes', objective: 'Y10-N4', title: 'Primes, HCF, LCM and prime factorisation', levels: { 1: ['y7Factors', 1], 2: ['y7Factors', 2], 3: ['y7Factors', 3] } });
  gc({ id: 'g10Listing', objective: 'Y10-N5', title: 'Systematic listing and the product rule', levels: {
    1: { make: function (r) { var a = r.int(2, 6), b = r.int(2, 5), it = r.pick([['starters', 'main courses'], ['sandwiches', 'drinks'], ['T-shirts', 'pairs of shorts']]);
      return K.int('A menu has ' + a + ' ' + it[0] + ' and ' + b + ' ' + it[1] + '. How many different combinations of one of each are there?', a * b, { hint: 'List them systematically: each of the ' + a + ' goes with each of the ' + b + '.', params: { n: [a, b] }, sol: ['Each of the ' + a + ' ' + it[0] + ' can go with each of the ' + b + ' ' + it[1] + '.', a + ' × ' + b + ' = ' + a * b + ' combinations.'] }); },
      verify: function (q) { var c = 0; for (var i = 0; i < q.params.n[0]; i++) for (var j = 0; j < q.params.n[1]; j++) c++; return c === q.check.value; } },
    2: { make: function (r) { var k = r.pick([3, 4]), ds = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], k), len = k === 3 ? 3 : 2, count = k === 3 ? 6 : 12;
      return K.int('Using the digits <b>' + ds.join(', ') + '</b>, how many different ' + len + '-digit numbers can be made if no digit is used more than once?', count, { hint: 'List them in order, starting with the smallest first digit.', params: { ds: ds, len: len }, sol: ['First digit: ' + k + ' choices. Second: ' + (k - 1) + (len === 3 ? '. Third: ' + (k - 2) : '') + '.', (len === 3 ? k + ' × ' + (k - 1) + ' × ' + (k - 2) : k + ' × ' + (k - 1)) + ' = ' + count + '.'] }); },
      verify: function (q) { var p = q.params, seen = {}; (function go(s, left) { if (s.length === p.len) { seen[s] = 1; return; } left.forEach(function (d, i) { go(s + d, left.slice(0, i).concat(left.slice(i + 1))); }); })('', p.ds); return Object.keys(seen).length === q.check.value; } },
    3: { make: function (r) { var nl = r.int(1, 2), nd = r.int(2, 4), firstNot0 = r.chance(0.5), count = Math.pow(26, nl) * (firstNot0 ? 9 * Math.pow(10, nd - 1) : Math.pow(10, nd));
      return K.int('A code is made of ' + nl + ' letter' + (nl > 1 ? 's' : '') + ' (A to Z) followed by ' + nd + ' digits (0 to 9)' + (firstNot0 ? '. The first digit cannot be 0' : '') + '. How many different codes are possible?', count, { hint: 'Product rule: multiply the number of choices for each position.', params: { nl: nl, nd: nd, f: firstNot0 }, sol: ['Letters: 26 choices each. Digits: 10 choices each' + (firstNot0 ? ', but only 9 for the first digit' : '') + '.', 'Multiply: ' + fmt(count) + '.'] }); },
      verify: function (q) { var p = q.params, c = 1, i; for (i = 0; i < p.nl; i++) c *= 26; for (i = 0; i < p.nd; i++) c *= i === 0 && p.f ? 9 : 10; return c === q.check.value; } } } });
  gc({ id: 'g10Powers', objective: 'Y10-N6', title: 'Powers and roots', levels: { 1: ['y7Powers', 1], 2: ['y7Powers', 2], 3: ['y7Powers', 3] } });
  gc({ id: 'g10Indices', objective: 'Y10-N7', title: 'Calculating with roots and integer indices', levels: { 1: ['y8Indices', 1], 2: ['y8Indices', 2], 3: ['y8Indices', 3] } });
  gc({ id: 'g10Exact', objective: 'Y10-N8', title: 'Exact answers with fractions and π', levels: {
    1: ['y7Fractions', 2],
    2: { make: function (r) { var rad = r.int(2, 12), area = r.chance(0.5); return K.expr('A circle has a radius of ' + rad + ' cm. Find its ' + (area ? 'area' : 'circumference') + '. Give your answer <b>in terms of π</b>.', area ? rad * rad + 'π' : 2 * rad + 'π', 'any', { suffix: area ? 'cm²' : 'cm', placeholder: 'e.g. 16π', hint: area ? 'Area = πr².' : 'Circumference = 2πr = πd.', params: { r: rad, area: area }, sol: [area ? 'π × ' + rad + '² = ' + rad * rad + 'π cm².' : '2 × π × ' + rad + ' = ' + 2 * rad + 'π cm.'] }); },
      verify: function (q) { var p = q.params; return same(q.check.answer, p.area ? p.r + '*' + p.r + '*π' : '2*' + p.r + '*π'); } },
    3: { make: function (r) { var rad = r.int(2, 10) * 2, kind = r.pick(['semiA', 'semiP', 'quarterP']), ans;
      if (kind === 'semiA') ans = rad * rad / 2 + 'π'; else if (kind === 'semiP') ans = rad + 'π + ' + 2 * rad; else ans = rad / 2 + 'π + ' + 2 * rad;
      var what = kind === 'semiA' ? 'area of a semicircle' : kind === 'semiP' ? 'perimeter of a semicircle' : 'perimeter of a quarter circle';
      return K.expr('Find the ' + what + ' of radius ' + rad + ' cm. Give your answer <b>in terms of π</b>.', ans, 'any', { placeholder: 'e.g. 8π + 16', hint: kind === 'semiA' ? 'Half of πr².' : 'Curved part: a fraction of 2πr. Then add the straight edges.', params: { r: rad, kind: kind },
        sol: [kind === 'semiA' ? '½ × π × ' + rad + '² = ' + rad * rad / 2 + 'π cm².' : kind === 'semiP' ? 'Curved edge: ½ × 2π × ' + rad + ' = ' + rad + 'π. Straight edge: the diameter, ' + 2 * rad + '.' : 'Curved edge: ¼ × 2π × ' + rad + ' = ' + rad / 2 + 'π. Straight edges: two radii, ' + 2 * rad + '.', 'Answer: ' + nm(ans) + '.'] }); },
      verify: function (q) { var p = q.params, R = p.r, want = p.kind === 'semiA' ? Math.PI * R * R / 2 : p.kind === 'semiP' ? Math.PI * R + 2 * R : Math.PI * R / 2 + 2 * R; var e = A.parse(q.check.answer.replace(/π/g, '(' + Math.PI + ')')); var pp = A.poly(e); return !!pp && Math.abs(A.num(pp[''] || A.Q(0)) - want) < 1e-6; } } } });
  gc({ id: 'g10StdForm', objective: 'Y10-N9', title: 'Standard form', levels: { 1: ['y8StdForm', 1], 2: ['y8StdForm', 2], 3: ['y9StdFormCalc', 2] } });
  gc({ id: 'g10FracDec', objective: 'Y10-N10', title: 'Fractions and terminating decimals', levels: { 1: ['y7FracDec', 1], 2: ['y7FracDec', 2], 3: ['y7FracDec', 3] } });
  gc({ id: 'g10FracRatio', objective: 'Y10-N11', title: 'Fractions in ratio problems', levels: { 1: ['y8RatioFraction', 1], 2: ['y8RatioFraction', 2], 3: ['y8RatioFraction', 3] } });
  gc({ id: 'g10Operators', objective: 'Y10-N12', title: 'Fractions and percentages as operators', levels: { 1: ['y7Operators', 1], 2: ['y7Operators', 2], 3: ['y7Operators', 3] } });
  gc({ id: 'g10Units', objective: 'Y10-N13', title: 'Standard and compound units', levels: { 1: ['y7Measures', 1], 2: ['y7Measures', 2], 3: ['y8Compound', 2] } });
  gc({ id: 'g10Estimate', objective: 'Y10-N14', title: 'Estimating and checking', levels: { 1: ['y7Estimate', 1], 2: ['y7Estimate', 2], 3: ['y8Calculator', 3] } });
  gc({ id: 'g10Rounding', objective: 'Y10-N15', title: 'Rounding, truncating and error intervals', levels: {
    1: ['y7Round', 2], 2: ['y9Bounds', 1],
    3: { make: function (r) { var dp = r.pick([0, 1]), v = dp ? (r.int(11, 199) / 10).toFixed(1) : String(r.int(3, 60)), hi = dp ? (parseFloat(v) + 0.1).toFixed(1) : String(+v + 1);
      return K.ineq('A length <i>x</i> cm is <b>truncated</b> to ' + (dp ? '1 decimal place' : 'a whole number') + ', giving ' + v + ' cm. Write the error interval for <i>x</i>.', v, true, hi, false, { hint: 'Truncating chops off digits; it never rounds up. So x could be anything from ' + v + ' up to (not including) ' + hi + '.', params: { v: v, dp: dp }, sol: ['Truncating removes digits without rounding.', v + ' ≤ x < ' + hi + '.'] }); },
      verify: function (q) { var p = q.params, f = Math.pow(10, p.dp), trunc = function (x) { return Math.floor(x * f + 1e-9) / f; }; var lo = +q.check.lo, hi = +q.check.hi; return trunc(lo) === +p.v && trunc(hi - 1e-7) === +p.v && trunc(hi) !== +p.v && q.check.loInc && !q.check.hiInc; } } } });
  gc({ id: 'g10Bounds', objective: 'Y10-N16', title: 'Limits of accuracy', levels: { 1: ['y9Bounds', 1], 2: ['y9Bounds', 2], 3: ['y9Bounds', 3] } });

  // ================= ALGEBRA =================
  gc({ id: 'g10Notation', objective: 'Y10-A1', title: 'Algebraic notation', levels: { 1: ['y7Notation', 1], 2: ['y7Notation', 2], 3: ['y7Notation', 3] } });
  gc({ id: 'g10Substitute', objective: 'Y10-A2', title: 'Substitution', levels: { 1: ['y7Substitute', 1], 2: ['y7Substitute', 2], 3: ['y7Substitute', 3] } });
  gc({ id: 'g10Vocab', objective: 'Y10-A3', title: 'Expressions, equations, formulae, identities', levels: { 1: ['y7Vocab', 1], 2: ['y7Vocab', 2], 3: ['y7Vocab', 3] } });
  gc({ id: 'g10Manipulate', objective: 'Y10-A4', title: 'Simplifying, expanding and factorising', levels: { 1: ['y7Simplify', 2], 2: ['y8DoubleBrackets', 2], 3: ['y9Factorise', 2] } });
  gc({ id: 'g10Rearrange', objective: 'Y10-A5', title: 'Using and rearranging formulae', levels: { 1: ['y8Rearrange', 1], 2: ['y8Rearrange', 2], 3: ['y8Rearrange', 3] } });
  gc({ id: 'g10Identity', objective: 'Y10-A6', title: 'Equations, identities and showing equivalence', levels: {
    1: { make: function (r) { var a = r.int(2, 6), b = r.int(1, 9), opts4 = [[a + '(x + ' + b + ') ≡ ' + a + 'x + ' + a * b, 'identity'], [a + 'x + ' + b + ' = ' + (a * 3 + b), 'equation'], ['y = ' + a + 'x + ' + b, 'formula'], [a + 'x + ' + b, 'expression']];
      return K.choice('Which of these is an <b>identity</b> (true for every value of x)?', r.shuffle(opts4.map(function (o) { return o[0]; })), opts4[0][0], { hint: 'An identity is true whatever x is. The ≡ sign means "is identical to".', params: { a: a, b: b }, sol: [opts4[0][0] + ' is true for every x: expanding the left gives the right.'] }); },
      verify: function (q) { var s = q.check.value.split(' ≡ '); return s.length === 2 && [0, 1, 2.5, -3].every(function (x) { var ev = function (t) { return A.num(A.poly(A.parse(t.replace(/x/g, '(' + x + ')')))[''] || A.Q(0)); }; return Math.abs(ev(s[0]) - ev(s[1])) < 1e-9; }); } },
    2: { make: function (r) { var a = r.int(2, 5), b = r.int(1, 9), c = r.int(1, 9), ok = r.chance(0.5), rhs = a + 'x + ' + (a * b - c + (ok ? 0 : r.pick([1, 2, -1]))), lhs = a + '(x + ' + b + ') - ' + c;
      return K.choice('Is <b>' + nm(lhs) + ' = ' + nm(rhs) + '</b> an identity (true for every value of x)?', [{ value: 'yes', label: 'Yes, it is an identity' }, { value: 'no', label: 'No, it is only an equation' }], ok ? 'yes' : 'no', { hint: 'Expand and simplify the left-hand side. Is it exactly the right-hand side?', params: { lhs: lhs, rhs: rhs }, sol: ['Left-hand side: ' + nm(lhs) + ' = ' + nm(lin(a, a * b - c)) + '.', ok ? 'That is the same as the right-hand side, so it is an identity.' : 'That is not the same as ' + nm(rhs) + ', so it is not an identity.'] }); },
      verify: function (q) { return q.check.value === (same(q.params.lhs, q.params.rhs) ? 'yes' : 'no'); } },
    3: { make: function (r) { var a = r.int(1, 7), b = r.int(2, 8); return K.multi('Find the values of <i>a</i> and <i>b</i> so that &nbsp;<b>(x + a)(x + ' + b + ') ≡ ' + A.pretty(quad(a + b, 0)) + ' + b</b>&nbsp; is an identity.'.replace(' + b</b>', ' + b</b>'), 'a = {0} &nbsp; b = {1}', [{ kind: 'int', value: a }, { kind: 'int', value: a * b }], { hint: 'Expand the left-hand side and compare the x terms and the number terms.', params: { a: a, b: b, sum: a + b }, answer: 'a = ' + a + ', b = ' + a * b, sol: ['(x + a)(x + ' + b + ') = x² + (a + ' + b + ')x + ' + b + 'a.', 'Compare x terms: a + ' + b + ' = ' + (a + b) + ', so a = ' + a + '.', 'Compare numbers: b = ' + b + 'a = ' + a * b + '.'] }); },
      verify: function (q) { var p = q.params, a = q.check.parts[0].value, bb = q.check.parts[1].value; return same('(x + ' + a + ')*(x + ' + p.b + ')', 'x^2 + ' + p.sum + 'x + ' + bb); } } } });
  gc({ id: 'g10Functions', objective: 'Y10-A7', title: 'Functions and function machines', levels: {
    1: { make: function (r) { var m = r.int(2, 9), c = r.int(1, 15), x = r.int(2, 12), sub = r.chance(0.3); var out = sub ? m * x - c : m * x + c;
      return K.int('What is the output of this function machine?', out, { keys: 'signed', visual: machine(['× ' + m, (sub ? '− ' : '+ ') + c], x, '?'), hint: 'Do the operations in order, left to right.', params: { m: m, c: sub ? -c : c, x: x }, sol: [x + ' × ' + m + ' = ' + m * x + '.', m * x + (sub ? ' − ' : ' + ') + c + ' = ' + out + '.'] }); },
      verify: function (q) { var p = q.params; return q.check.value === p.m * p.x + p.c; } },
    2: { make: function (r) { var m = r.int(2, 9), c = r.int(1, 15), x = r.int(2, 15), out = m * x + c;
      return K.int('The output of this function machine is ' + out + '. What was the input?', x, { visual: machine(['× ' + m, '+ ' + c], '?', out), hint: 'Work backwards with the inverse operations: − ' + c + ', then ÷ ' + m + '.', params: { m: m, c: c, out: out }, sol: ['Reverse the machine: ' + out + ' − ' + c + ' = ' + (out - c) + '.', (out - c) + ' ÷ ' + m + ' = ' + x + '.'] }); },
      verify: function (q) { var p = q.params; return q.check.value * p.m + p.c === p.out; } },
    3: { make: function (r) { var m = r.int(2, 7), c = r.int(-9, 9) || 4, x = r.int(-4, 9), inv = r.chance(0.5), f = 'f(x) = ' + nm(lin(m, c));
      if (inv) { var val = m * x + c; return K.solve('<b>' + f + '</b>. Find x when f(x) = ' + neg(val) + '.', String(x), { hint: 'Solve ' + nm(lin(m, c)) + ' = ' + neg(val) + '.', params: { m: m, c: c, val: val }, sol: [nm(lin(m, c)) + ' = ' + neg(val) + '.', m + 'x = ' + neg(val - c) + ', so x = ' + neg(x) + '.'] }); }
      return K.int('<b>' + f + '</b>. Find <b>f(' + neg(x) + ')</b>.', m * x + c, { keys: 'signed', hint: 'Replace x with ' + neg(x) + '.', params: { m: m, c: c, x: x }, sol: ['f(' + neg(x) + ') = ' + m + ' × ' + neg(x) + (c < 0 ? ' − ' + (-c) : ' + ' + c) + ' = ' + neg(m * x + c) + '.'] }); },
      verify: function (q) { var p = q.params; if (p.val !== undefined) return p.m * A.num(A.parseQ(q.check.value)) + p.c === p.val; return q.check.value === p.m * p.x + p.c; } } } });
  gc({ id: 'g10Coords', objective: 'Y10-A8', title: 'Coordinates in four quadrants', levels: { 1: ['y7Coords', 1], 2: ['y7Coords', 2], 3: ['y7Coords', 3] } });
  gc({ id: 'g10StraightLines', objective: 'Y10-A9', title: 'Straight-line graphs and their equations', levels: {
    1: ['y8LinearGraphs', 2], 2: ['y9MatchGraphs', 3],
    3: { make: function (r) { var m = r.int(-4, 5) || 2, c = r.int(-8, 8), x1 = r.int(-3, 2), x2 = x1 + r.int(1, 4), y1 = m * x1 + c, y2 = m * x2 + c;
      return K.expr('Find the equation of the straight line through <b>(' + neg(x1) + ', ' + neg(y1) + ')</b> and <b>(' + neg(x2) + ', ' + neg(y2) + ')</b>.', lin(m, c), 'any', { lhs: 'y', hint: 'Find the gradient first (change in y ÷ change in x). Then use one point to find c.', params: { p: [x1, y1, x2, y2] }, sol: ['Gradient: (' + neg(y2) + ' − ' + neg(y1) + ') ÷ (' + neg(x2) + ' − ' + neg(x1) + ') = ' + neg(m) + '.', 'Put (' + neg(x1) + ', ' + neg(y1) + ') into y = ' + neg(m) + 'x + c: c = ' + neg(c) + '.', 'y = ' + nm(lin(m, c)) + '.'] }); },
      verify: function (q) { var p = q.params; return [[p.p[0], p.p[1]], [p.p[2], p.p[3]]].every(function (pt) { var e = A.poly(A.parse(q.check.answer.replace(/x/g, '(' + pt[0] + ')'))); return e && A.num(e[''] || A.Q(0)) === pt[1]; }); } } } });
  gc({ id: 'g10Gradients', objective: 'Y10-A10', title: 'Gradients and intercepts', levels: { 1: ['y8Gradient', 1], 2: ['y8Gradient', 2], 3: ['y8Gradient', 3] } });
  gc({ id: 'g10QuadGraphs', objective: 'Y10-A11', title: 'Roots, intercepts and turning points', levels: { 1: ['y9Quadratics', 1], 2: ['y9Quadratics', 2], 3: ['y9Quadratics', 3] } });
  gc({ id: 'g10GraphShapes', objective: 'Y10-A12', title: 'Recognising graphs', levels: { 1: ['y9MatchGraphs', 1], 2: ['y8LinearGraphs', 3], 3: ['y9MatchGraphs', 2] } });
  gc({ id: 'g10RealGraphs', objective: 'Y10-A14', title: 'Real-life graphs', levels: { 1: ['y9RealGraphs', 1], 2: ['y9RealGraphs', 2], 3: ['y9RealGraphs', 3] } });
  gc({ id: 'g10Linear', objective: 'Y10-A17', title: 'Solving linear equations', levels: { 1: ['y8Equations', 1], 2: ['y8Equations', 2], 3: ['y8Equations', 3] } });
  gc({ id: 'g10SolveQuad', objective: 'Y10-A18', title: 'Solving quadratic equations by factorising', levels: {
    1: { make: function (r) { var p = r.int(-9, 9) || 2, q2 = r.int(-9, 9) || -3; if (p === q2) q2++; var lo = Math.min(-p, -q2), hi = Math.max(-p, -q2);
      return K.multi('Solve <b>' + nm('(' + lin(1, p) + ')(' + lin(1, q2) + ') = 0') + '</b>. Give the smaller solution first.', 'x = {0} &nbsp; or &nbsp; x = {1}', [{ kind: 'int', value: lo }, { kind: 'int', value: hi }], { blanks: [{ keys: 'signed' }, { keys: 'signed' }], hint: 'If two things multiply to give 0, one of them must be 0.', params: { e: '(' + lin(1, p) + ')*(' + lin(1, q2) + ')' }, answer: 'x = ' + neg(lo) + ' or x = ' + neg(hi), sol: [nm(lin(1, p)) + ' = 0 gives x = ' + neg(-p) + '.', nm(lin(1, q2)) + ' = 0 gives x = ' + neg(-q2) + '.'] }); },
      verify: function (q) { return rootsOK(q); } },
    2: { make: function (r) { var a = r.int(-8, 8) || 3, b = r.int(-8, 8) || -2; if (a === b) b++; var B = -(a + b), C = a * b;
      return K.multi('Solve <b>' + A.pretty(nm(quad(B, C))) + ' = 0</b>. Give the smaller solution first.', 'x = {0} &nbsp; or &nbsp; x = {1}', [{ kind: 'int', value: Math.min(a, b) }, { kind: 'int', value: Math.max(a, b) }], { blanks: [{ keys: 'signed' }, { keys: 'signed' }], hint: 'Factorise first: two numbers that multiply to ' + C + ' and add to ' + B + '.', params: { e: quad(B, C) }, answer: 'x = ' + neg(Math.min(a, b)) + ' or x = ' + neg(Math.max(a, b)), sol: ['Factorise: ' + nm('(' + lin(1, -a) + ')(' + lin(1, -b) + ')') + ' = 0.', 'So x = ' + neg(a) + ' or x = ' + neg(b) + '.'] }); },
      verify: function (q) { return rootsOK(q); } },
    3: { make: function (r) { var a = r.int(-7, 7), b = r.int(1, 8); if (a === b) a--; var B = -(a + b), C = a * b, shown = A.pretty(nm(quad(B, 0))) + ' = ' + neg(-C);
      if (C === 0) shown = 'x² = ' + nm(lin(-B, 0));
      return K.multi('Solve <b>' + shown + '</b>. Give the smaller solution first.', 'x = {0} &nbsp; or &nbsp; x = {1}', [{ kind: 'int', value: Math.min(a, b) }, { kind: 'int', value: Math.max(a, b) }], { blanks: [{ keys: 'signed' }, { keys: 'signed' }], hint: 'Rearrange so one side is 0, then factorise.', params: { e: quad(B, C) }, answer: 'x = ' + neg(Math.min(a, b)) + ' or x = ' + neg(Math.max(a, b)), sol: ['Rearrange: ' + A.pretty(nm(quad(B, C))) + ' = 0.', 'Factorise and solve: x = ' + neg(a) + ' or x = ' + neg(b) + '.'] }); },
      verify: function (q) { return rootsOK(q); } } } });
  function rootsOK(q) { var e = q.params.e, ok = q.check.parts.every(function (pt) { var pp = A.poly(A.parse(e.replace(/x/g, '(' + pt.value + ')'))); return pp && A.num(pp[''] || A.Q(0)) === 0; }); return ok && q.check.parts[0].value < q.check.parts[1].value; }
  gc({ id: 'g10Simultaneous', objective: 'Y10-A19', title: 'Simultaneous equations', levels: (function () {
    function mk(r, kind) {
      var x = r.int(-3, 9), y = r.int(-4, 9), a, b, c, d;
      if (kind === 1) { a = 1; b = 1; c = 1; d = -1; } else if (kind === 2) { a = r.int(2, 4); b = 1; c = 1; d = 1; } else { a = r.int(2, 5); b = r.int(2, 4); c = r.int(1, 4); d = -r.int(1, 3); if (a * d === b * c) d--; }
      var e1 = nm(lin(a, 0) + (b < 0 ? ' - ' + (b === -1 ? '' : -b) + 'y' : ' + ' + (b === 1 ? '' : b) + 'y') + ' = ' + (a * x + b * y)), e2 = nm(lin(c, 0) + (d < 0 ? ' - ' + (d === -1 ? '' : -d) + 'y' : ' + ' + (d === 1 ? '' : d) + 'y') + ' = ' + (c * x + d * y));
      return K.multi('Solve the simultaneous equations:<br><b>' + e1 + '</b><br><b>' + e2 + '</b>', 'x = {0} &nbsp; y = {1}', [{ kind: 'int', value: x }, { kind: 'int', value: y }], { blanks: [{ keys: 'signed' }, { keys: 'signed' }], hint: kind === 1 ? 'Add the two equations to get rid of y.' : kind === 2 ? 'Subtract the second equation from the first to get rid of y.' : 'Multiply one equation so the y terms match, then add or subtract.', params: { co: [a, b, a * x + b * y, c, d, c * x + d * y] }, answer: 'x = ' + neg(x) + ', y = ' + neg(y),
        sol: [kind === 1 ? 'Add: 2x = ' + (2 * x) + ', so x = ' + neg(x) + '.' : kind === 2 ? 'Subtract: ' + (a - c) + 'x = ' + ((a - c) * x) + ', so x = ' + neg(x) + '.' : 'Make the y coefficients equal, then eliminate y: x = ' + neg(x) + '.', 'Substitute back: y = ' + neg(y) + '.', 'Check in both equations.'] });
    }
    var v = function (q) { var c = q.params.co, x = q.check.parts[0].value, y = q.check.parts[1].value; return c[0] * x + c[1] * y === c[2] && c[3] * x + c[4] * y === c[5] && c[0] * c[4] !== c[1] * c[3]; };
    return { 1: { make: function (r) { return mk(r, 1); }, verify: v }, 2: { make: function (r) { return mk(r, 2); }, verify: v }, 3: { make: function (r) { return mk(r, 3); }, verify: v } };
  })() });
  gc({ id: 'g10FormSolve', objective: 'Y10-A21', title: 'Forming and solving equations', levels: {
    1: { make: function (r) { var n = r.int(2, 20), m = r.int(2, 9), a = r.int(1, 20); return K.int('I think of a number. I multiply it by ' + m + ' and add ' + a + '. The answer is ' + (n * m + a) + '. Write an equation and solve it to find my number.', n, { hint: 'Let the number be n: ' + m + 'n + ' + a + ' = ' + (n * m + a) + '.', params: { m: m, a: a, t: n * m + a }, sol: [m + 'n + ' + a + ' = ' + (n * m + a) + '.', m + 'n = ' + n * m + ', so n = ' + n + '.'] }); },
      verify: function (q) { var p = q.params; return q.check.value * p.m + p.a === p.t; } },
    2: { make: function (r) { var jo = r.int(8, 40), d = r.int(2, 12), n1 = r.pick(OM.NAMES), n2 = r.pick(OM.NAMES.filter(function (x) { return x !== n1; })); return K.int(n1 + ' is ' + d + ' years older than ' + n2 + '. Their ages add up to ' + (2 * jo + d) + '. How old is ' + n2 + '?', jo, { hint: 'Let ' + n2 + '’s age be x. Then ' + n1 + ' is x + ' + d + '.', params: { d: d, t: 2 * jo + d }, sol: ['x + (x + ' + d + ') = ' + (2 * jo + d) + '.', '2x = ' + 2 * jo + ', so x = ' + jo + '.'] }); },
      verify: function (q) { var p = q.params; return q.check.value + q.check.value + p.d === p.t; } },
    3: { make: function (r) { var ad = r.int(6, 15), ch = r.int(3, ad - 1), a1 = r.int(1, 3), c1 = r.int(2, 4), a2 = r.int(1, 3), c2 = r.int(1, 3); if (a1 * c2 === a2 * c1) c2++;
      return K.int(a1 + ' adult ticket' + (a1 > 1 ? 's' : '') + ' and ' + c1 + ' child tickets cost £' + (a1 * ad + c1 * ch) + '. ' + a2 + ' adult ticket' + (a2 > 1 ? 's' : '') + ' and ' + c2 + ' child ticket' + (c2 > 1 ? 's' : '') + ' cost £' + (a2 * ad + c2 * ch) + '. How much is one <b>child</b> ticket?', ch, { prefix: '£', hint: 'Write two equations with a and c, then solve them simultaneously.', params: { e: [a1, c1, a1 * ad + c1 * ch, a2, c2, a2 * ad + c2 * ch] }, sol: [a1 + 'a + ' + c1 + 'c = ' + (a1 * ad + c1 * ch) + ' and ' + a2 + 'a + ' + c2 + 'c = ' + (a2 * ad + c2 * ch) + '.', 'Eliminate a: c = ' + ch + ', so a child ticket is £' + ch + ' (and an adult ticket is £' + ad + ').'] }); },
      verify: function (q) { var e = q.params.e, c = q.check.value; var a = (e[2] - e[1] * c) / e[0]; return a === Math.round(a) && e[3] * a + e[4] * c === e[5]; } } } });
  gc({ id: 'g10Inequalities', objective: 'Y10-A22', title: 'Solving linear inequalities', levels: (function () {
    function check(q) { var p = q.params; // test integer and half values against the original inequality
      for (var x = -20; x <= 20; x += 0.5) { var inOrig = p.test(x), lo = q.check.lo === null || q.check.lo === undefined ? true : (q.check.loInc ? x >= +q.check.lo : x > +q.check.lo), hi = q.check.hi === null || q.check.hi === undefined ? true : (q.check.hiInc ? x <= +q.check.hi : x < +q.check.hi); if (inOrig !== (lo && hi)) return false; } return true; }
    return {
      1: { make: function (r) { var a = r.int(1, 12), x = r.int(-5, 12), sign = r.pick(['<', '>', '≤', '≥']); var q = K.ineq('Solve <b>x + ' + a + ' ' + sign + ' ' + (x + a) + '</b>', sign === '>' || sign === '≥' ? String(x) : null, sign === '≥', sign === '<' || sign === '≤' ? String(x) : null, sign === '≤', { hint: 'Subtract ' + a + ' from both sides, just like an equation.', params: { a: a, r: x + a, s: sign }, sol: ['x ' + sign + ' ' + (x + a) + ' − ' + a + ', so x ' + sign + ' ' + neg(x) + '.'] }); q.params.test = function (t) { return cmp(t + a, sign, x + a); }; return q; }, verify: check },
      2: { make: function (r) { var flip = r.chance(0.4), m = r.int(2, 6), c = r.int(1, 12), x = r.int(-4, 8), sign = r.pick(['<', '>', '≤', '≥']), q;
        if (!flip) { q = K.ineq('Solve <b>' + m + 'x − ' + c + ' ' + sign + ' ' + (m * x - c) + '</b>', sign === '>' || sign === '≥' ? String(x) : null, sign === '≥', sign === '<' || sign === '≤' ? String(x) : null, sign === '≤', { hint: 'Add ' + c + ', then divide by ' + m + '.', params: {}, sol: [m + 'x ' + sign + ' ' + m * x + '.', 'x ' + sign + ' ' + neg(x) + '.'] }); q.params.test = function (t) { return cmp(m * t - c, sign, m * x - c); }; return q; }
        var rev = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' }[sign], k = c + m * x;
        q = K.ineq('Solve <b>' + k + ' − ' + m + 'x ' + sign + ' ' + c + '</b>', rev === '>' || rev === '≥' ? String(x) : null, rev === '≥', rev === '<' || rev === '≤' ? String(x) : null, rev === '≤', { hint: 'When you divide by a negative number, turn the inequality sign round.', params: {}, sol: ['−' + m + 'x ' + sign + ' ' + (c - k) + '.', 'Divide by −' + m + ' and turn the sign round: x ' + rev + ' ' + neg(x) + '.'] }); q.params.test = function (t) { return cmp(k - m * t, sign, c); }; return q; }, verify: check },
      3: { make: function (r) { var m = r.int(2, 4), c = r.int(-5, 6), lo = r.int(-6, 1), hi = lo + r.int(2, 7), li = r.chance(0.5), hiI = r.chance(0.5);
        var q = K.ineq('Solve <b>' + neg(m * lo + c) + ' ' + (li ? '≤' : '<') + ' ' + nm(lin(m, c)) + ' ' + (hiI ? '≤' : '<') + ' ' + neg(m * hi + c) + '</b>', String(lo), li, String(hi), hiI, { hint: 'Do the same thing to all three parts.', params: {}, sol: [(c < 0 ? 'Add ' + (-c) : 'Subtract ' + c) + ' from all three parts, then divide all three by ' + m + '.', neg(lo) + ' ' + (li ? '≤' : '<') + ' x ' + (hiI ? '≤' : '<') + ' ' + neg(hi) + '.'] });
        q.params.test = function (t) { var v = m * t + c; return (li ? v >= m * lo + c : v > m * lo + c) && (hiI ? v <= m * hi + c : v < m * hi + c); }; return q; }, verify: check } };
  })() });
  function cmp(a, s, b) { return s === '<' ? a < b : s === '>' ? a > b : s === '≤' ? a <= b : a >= b; }
  gc({ id: 'g10TermRules', objective: 'Y10-A23', title: 'Term-to-term and position-to-term rules', levels: { 1: ['y7Sequences', 1], 2: ['y7Sequences', 2], 3: ['y7Sequences', 3] } });
  gc({ id: 'g10SpecialSeq', objective: 'Y10-A24', title: 'Special sequences', levels: { 1: ['y8OtherSequences', 1], 2: ['y8OtherSequences', 2], 3: ['y8OtherSequences', 3] } });
  gc({ id: 'g10NthTerm', objective: 'Y10-A25', title: 'The nth term of linear sequences', levels: { 1: ['y7NthTerm', 1], 2: ['y7NthTerm', 2], 3: ['y7NthTerm', 3] } });

  // ================= PROBABILITY =================
  gc({ id: 'g10FreqTrees', objective: 'Y10-P1', title: 'Frequency trees', levels: (function () {
    function data(r) { var t = r.int(4, 12) * 10, a = r.int(Math.floor(t * 0.3), Math.floor(t * 0.6)), b = t - a, a1 = r.int(1, a - 1), b1 = r.int(1, b - 1); return { t: t, a: a, b: b, a1: a1, a2: a - a1, b1: b1, b2: b - b1 }; }
    var L1 = ['Walk', 'Bus'], L2 = ['Late', 'On time'];
    return {
      1: { make: function (r) { var d = data(r), hide = r.pick(['b', 'a2', 'b2']); var vals = { a: d.a, b: d.b, a2: d.a2, b2: d.b2 }; vals[hide] = '?';
        return K.int('The frequency tree shows how ' + d.t + ' students travel to school, and whether they were late. Find the missing number.', d[hide], { visual: freqTree(d.t, [vals.a, vals.b], [[d.a1, vals.a2], [d.b1, vals.b2]], L1, L2), hint: 'The numbers on each pair of branches add up to the number they came from.', params: { d: d, hide: hide }, sol: [hide === 'b' ? d.t + ' − ' + d.a + ' = ' + d.b + '.' : hide === 'a2' ? d.a + ' − ' + d.a1 + ' = ' + d.a2 + '.' : d.b + ' − ' + d.b1 + ' = ' + d.b2 + '.'] }); },
        verify: function (q) { var d = q.params.d, v = q.check.value; return q.params.hide === 'b' ? d.a + v === d.t : q.params.hide === 'a2' ? d.a1 + v === d.a : d.b1 + v === d.b; } },
      2: { make: function (r) { var d = data(r), late = d.a1 + d.b1, s = simp(late, d.t);
        return K.frac('Use the frequency tree. A student is picked at random. What is the probability that they were <b>late</b>?', s[0], s[1], { visual: freqTree(d.t, [d.a, d.b], [[d.a1, d.a2], [d.b1, d.b2]], L1, L2), hint: 'Add up all the late students, then divide by the total.', params: { d: d }, sol: ['Late: ' + d.a1 + ' + ' + d.b1 + ' = ' + late + '.', 'P(late) = ' + F(late, d.t) + (s[1] !== d.t ? ' = ' + F(s[0], s[1]) : '') + '.'] }); },
        verify: function (q) { var d = q.params.d; return Math.abs(q.check.n / q.check.d - (d.a1 + d.b1) / d.t) < 1e-12; } },
      3: { make: function (r) { var t = r.pick([80, 100, 120, 200]), pc = r.pick([10, 20, 25, 50]), w = 20 * r.int(1, t / 20 - 1), lateW = w * pc / 100, lateB = r.int(2, 15);
        return K.int(t + ' students were asked. ' + w + ' walk to school; the rest come by bus. ' + pc + '% of those who walk were late. ' + lateB + ' of those who come by bus were late. Draw a frequency tree. How many students were <b>on time</b>?', t - lateW - lateB, { hint: 'Fill in the tree: walkers and bus users first, then late and on time.', params: { t: t, w: w, pc: pc, lb: lateB }, sol: ['Bus: ' + t + ' − ' + w + ' = ' + (t - w) + '.', 'Walkers late: ' + pc + '% of ' + w + ' = ' + lateW + '. Bus late: ' + lateB + '.', 'On time: ' + t + ' − ' + lateW + ' − ' + lateB + ' = ' + (t - lateW - lateB) + '.'] }); },
        verify: function (q) { var p = q.params, ontimeW = p.w - p.w * p.pc / 100, ontimeB = (p.t - p.w) - p.lb; return q.check.value === ontimeW + ontimeB; } } };
  })() });
  gc({ id: 'g10Expected', objective: 'Y10-P2', title: 'Expected outcomes and fairness', levels: {
    1: ['y7ProbScale', 3],
    2: { make: function (r) { var ev = r.pick([['a number greater than 4', 2], ['a 6', 1], ['an even number', 3], ['a prime number', 3], ['a square number', 2]]), n = 6 * r.int(5, 40);
      return K.int('A fair dice is rolled ' + n + ' times. How many times would you expect to get <b>' + ev[0] + '</b>?', n * ev[1] / 6, { hint: 'Expected number = probability × number of rolls. P = ' + ev[1] + '/6.', params: { n: n, k: ev[1], ev: ev[0] }, sol: ['P(' + ev[0] + ') = ' + F(ev[1], 6) + '.', F(ev[1], 6) + ' × ' + n + ' = ' + n * ev[1] / 6 + '.'] }); },
      verify: function (q) { var p = q.params, test = { 'a number greater than 4': function (x) { return x > 4; }, 'a 6': function (x) { return x === 6; }, 'an even number': function (x) { return x % 2 === 0; }, 'a prime number': function (x) { return [2, 3, 5].indexOf(x) >= 0; }, 'a square number': function (x) { return x === 1 || x === 4; } }[p.ev], c = 0; for (var i = 1; i <= 6; i++) if (test(i)) c++; return q.check.value * 6 === p.n * c; } },
    3: { make: function (r) { var n = r.pick([100, 200, 400]), colours = 4, exp = n / colours, red = Math.round(exp * r.pick([1.02, 0.96, 1.9, 2.2, 0.4])), fair = Math.abs(red - exp) / exp < 0.15;
      return K.choice('A spinner has 4 equal sections: red, blue, green and yellow. In ' + n + ' spins it landed on red ' + red + ' times. Is the spinner likely to be fair?', [{ value: 'yes', label: 'Probably fair: ' + red + ' is close to the expected ' + exp }, { value: 'no', label: 'Probably biased: ' + red + ' is far from the expected ' + exp }], fair ? 'yes' : 'no', { hint: 'If it is fair, P(red) = ¼. Work out the expected number of reds.', params: { n: n, red: red }, sol: ['Expected reds: ¼ × ' + n + ' = ' + exp + '.', fair ? red + ' is close to ' + exp + ', so the spinner is probably fair.' : red + ' is a long way from ' + exp + ', so the spinner is probably biased.'] }); },
      verify: function (q) { var p = q.params, e = p.n / 4; return q.check.value === (Math.abs(p.red - e) / e < 0.15 ? 'yes' : 'no'); } } } });
  gc({ id: 'g10RelFreq', objective: 'Y10-P3', title: 'Relative frequency and theoretical probability', levels: {
    1: ['y7ProbScale', 1], 2: ['y7ProbScale', 2],
    3: { make: function (r) { var cols = ['Red', 'Blue', 'Green', 'Yellow'], f = [r.int(20, 60), r.int(20, 60), r.int(20, 60)], tot = r.pick([200, 250]); f.push(tot - f[0] - f[1] - f[2]); var k = r.int(0, 3), rf = A.decText(Q(f[k], tot));
      return K.dec('The table shows the results of spinning a spinner ' + tot + ' times. Estimate the probability that it lands on <b>' + cols[k] + '</b>. Give your answer as a decimal.', rf, { visual: V.table(['Colour'].concat(cols), [['Frequency'].concat(f.map(String))]), hint: 'Relative frequency = frequency ÷ total number of spins.', params: { f: f, k: k, tot: tot }, sol: [f[k] + ' ÷ ' + tot + ' = ' + rf + '.'] }); },
      verify: function (q) { var p = q.params; return Math.abs(parseFloat(q.check.value) * p.tot - p.f[p.k]) < 1e-9 && p.f.reduce(function (a, b) { return a + b; }, 0) === p.tot; } } } });
  gc({ id: 'g10ProbSum', objective: 'Y10-P4', title: 'Probabilities sum to 1', levels: { 1: ['y7ProbSum', 1], 2: ['y7ProbSum', 2], 3: ['y7ProbSum', 3] } });
  gc({ id: 'g10Samples', objective: 'Y10-P5', title: 'Larger samples and reliability', levels: {
    1: { make: function (r) { var ns = r.sample([10, 20, 30, 50, 80, 100, 200, 500, 1000], 3).sort(function (a, b) { return a - b; }), thing = r.pick(['flips of a coin', 'rolls of a dice', 'spins of a spinner', 'drops of a drawing pin']);
      return K.choice('Three people estimate a probability using different numbers of ' + thing + '. Whose estimate is likely to be the <b>most reliable</b>?', ns.map(function (n) { return { value: String(n), label: fmt(n) + ' ' + thing }; }), String(ns[2]), { hint: 'More trials give a more reliable estimate.', params: { ns: ns }, sol: ['The largest number of trials, ' + fmt(ns[2]) + ', gives the most reliable estimate.'] }); },
      verify: function (q) { return +q.check.value === Math.max.apply(null, q.params.ns); } },
    2: { make: function (r) { var n1 = r.pick([10, 12, 20, 25]), h1 = r.int(Math.ceil(n1 * 0.65), n1 - 1), n2 = r.pick([500, 800, 1000, 2000]), h2 = Math.round(n2 * (0.48 + r.int(0, 4) / 100)), a = r.pick(OM.NAMES), b = r.pick(OM.NAMES.filter(function (x) { return x !== a; }));
      return K.choice(a + ' flips a coin ' + n1 + ' times and gets ' + h1 + ' heads. ' + b + ' flips the same coin ' + fmt(n2) + ' times and gets ' + fmt(h2) + ' heads. Whose results give the better estimate of P(heads)?', [a, b], b, { hint: 'Which experiment had more trials?', params: { n: [n1, n2], who: [a, b] }, sol: [b + ' did ' + fmt(n2) + ' trials, far more than ' + n1 + ', so ' + b + '’s estimate (' + (h2 / n2).toFixed(2) + ') is more reliable.'] }); },
      verify: function (q) { var p = q.params; return q.check.value === (p.n[1] > p.n[0] ? p.who[1] : p.who[0]); } },
    3: { make: function (r) { var it = r.pick([['a fair coin is flipped', 'heads', '0.5'], ['a fair four-sided spinner is spun', 'red (one of the four sections)', '0.25'], ['a fair ten-sided dice is rolled', 'a 1', '0.1'], ['a fair five-sided spinner is spun', 'blue (one of the five sections)', '0.2']]);
      return K.dec('As ' + it[0] + ' more and more times, the relative frequency of ' + it[1] + ' gets closer to a particular value. What value? Give it as a decimal.', it[2], { hint: 'With more trials, relative frequency tends towards the theoretical probability.', params: { it: it }, sol: ['The theoretical probability of ' + it[1] + ' is ' + it[2] + '.', 'With a large number of trials, the relative frequency gets close to ' + it[2] + '.'] }); },
      verify: function (q) { var m = /(\w+)-sided|(coin)/.exec(q.params.it[0]), sides = m[2] ? 2 : { four: 4, ten: 10, five: 5 }[m[1]]; return Math.abs(parseFloat(q.check.value) - 1 / sides) < 1e-12; } } } });
  gc({ id: 'g10Venn', objective: 'Y10-P6', title: 'Venn diagrams, tables and trees', levels: { 1: ['y8Venn', 1], 2: ['y8Venn', 2], 3: ['y8Venn', 3] } });
  gc({ id: 'g10SampleSpace', objective: 'Y10-P7', title: 'Sample spaces', levels: { 1: ['y7ProbCalc', 1], 2: ['y7ProbCalc', 2], 3: ['y7ProbCalc', 3] } });
  gc({ id: 'g10Combined', objective: 'Y10-P8', title: 'Independent and dependent events', levels: { 1: ['y9Combined', 1], 2: ['y9Combined', 2], 3: ['y9Combined', 3] } });
})(typeof window !== 'undefined' ? window : globalThis);
