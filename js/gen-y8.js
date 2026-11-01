/* Learn with Pip — Year 8 question generators (Key Stage 3, Deep-Sea Station).
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
  function opts(r, correct, wrongs) { var seen = {}; return r.shuffle([correct].concat(wrongs).filter(function (x) { var k = String(x); if (seen[k]) return false; seen[k] = 1; return true; })).map(function (x) { return { value: String(x), label: String(x) }; }); }
  function vec(a, b) { return '<span class="colvec" aria-label="column vector ' + a + ', ' + b + '"><span class="par">(</span><span class="cv"><span>' + neg(a) + '</span><span>' + neg(b) + '</span></span><span class="par">)</span></span>'; }
  function sup(e) { return pretty('^' + e); }
  function stdText(m, e) { return m + ' × 10' + sup(e); }
  function stdValue(m, e) { return e >= 0 ? A.mul(Qs(m), Q(10n ** BigInt(e))) : A.div(Qs(m), Q(10n ** BigInt(-e))); }

  // ================= NUMBER (Pearl Bay) =================
  K.gen({ id: 'y8StdForm', objective: 'Y8-N-01', title: 'Standard form',
    make: function (r, L) {
      var m = dt(Q(r.int(11, 99), 10)), e;
      if (L === 1) { e = r.int(3, 7); var big = dt(stdValue(m, e)); return K.stdform('Write <b>' + fmt(+big) + '</b> in standard form.', m, e, { hint: 'Put the decimal point after the first digit, then count how many places it moved.', params: { v: big }, sol: [fmt(+big) + ' = ' + m + ' × ' + fmt(Math.pow(10, e)) + '.', 'In standard form: ' + stdText(m, e) + '.'] }); }
      if (L === 2) { e = -r.int(2, 5); var small = dt(stdValue(m, e)); return K.stdform('Write <b>' + small + '</b> in standard form.', m, e, { hint: 'For numbers less than 1 the power of 10 is negative.', params: { v: small }, sol: ['Move the decimal point ' + (-e) + ' places to the right to get ' + m + '.', 'In standard form: ' + stdText(m, e) + '.'] }); }
      var m1 = dt(Q(r.int(11, 99), 10)), e1 = r.int(3, 8), m2 = dt(Q(r.int(11, 99), 10)), e2 = e1 + r.pick([-1, 1]);
      var bigger = A.num(stdValue(m1, e1)) > A.num(stdValue(m2, e2)) ? 'a' : 'b';
      return K.choice('Which number is larger?', [{ value: 'a', label: stdText(m1, e1) }, { value: 'b', label: stdText(m2, e2) }], bigger, { big: true, hint: 'Compare the powers of 10 first.', params: { a: [m1, e1], b: [m2, e2] },
        sol: ['The power of 10 matters most: 10' + sup(Math.max(e1, e2)) + ' is ten times 10' + sup(Math.min(e1, e2)) + '.', (bigger === 'a' ? stdText(m1, e1) : stdText(m2, e2)) + ' is larger.'] });
    },
    verify: function (q) { var p = q.params; if (p.a) return q.check.value === (parseFloat(p.a[0]) * Math.pow(10, p.a[1]) > parseFloat(p.b[0]) * Math.pow(10, p.b[1]) ? 'a' : 'b'); return A.eq(stdValue(q.check.m, q.check.e), Qs(p.v)) && parseFloat(q.check.m) >= 1 && parseFloat(q.check.m) < 10; } });

  K.gen({ id: 'y8Calculator', objective: 'Y8-N-02', title: 'Using a calculator and interpreting the display',
    make: function (r, L) {
      if (L === 1) { var a = dt(Q(r.int(101, 999), 10)), b = dt(Q(r.int(11, 99), 10)), c = r.pick(['2.5', '1.25', '0.8', '1.6']), ans = A.div(A.add(Qs(a), Qs(b)), A.mul(Qs(c), Qs(c)));
        return K.dec('Use a calculator to work out <b>(' + a + ' + ' + b + ') ÷ ' + c + '²</b>. Write down all the figures on your calculator display.', dt(ans), { calc: true, hint: 'Use brackets on the calculator, or work out the top and the bottom separately.', params: { a: a, b: b, c: c }, sol: ['Top: ' + a + ' + ' + b + ' = ' + dt(A.add(Qs(a), Qs(b))) + '.', 'Bottom: ' + c + '² = ' + dt(A.mul(Qs(c), Qs(c))) + '.', 'Answer: ' + dt(ans) + '.'] }); }
      if (L === 2) { var x = r.int(60, 199) / 10, y = r.int(10, Math.floor(x * 10) - 15) / 10, val = Math.sqrt(x * x - y * y);
        return K.approx('Use a calculator to work out <b>√(' + x + '² − ' + y + '²)</b>. Give your answer to 3 significant figures.', val.toFixed(12), { sf: 3 }, { calc: true, hint: 'Work out the part under the square root first, then square root it.', params: { x: x, y: y }, sol: [x + '² − ' + y + '² = ' + (Math.round((x * x - y * y) * 100) / 100) + '.', '√ of that = ' + val.toFixed(5) + '…', 'To 3 significant figures: ' + A.round(val.toFixed(12), { sf: 3 }) + '.'] }); }
      var cap = r.pick([12, 16, 52, 57]), people = cap * r.int(3, 9) + r.int(1, cap - 1), up = r.chance(0.5);
      var ctx = up ? ['A minibus holds ' + cap + ' people. ' + people + ' people are going on a trip. How many minibuses are needed?', Math.ceil(people / cap)] : ['A shelf holds ' + cap + ' books. How many shelves can be completely filled with ' + people + ' books?', Math.floor(people / cap)];
      return K.int(ctx[0], ctx[1], { calc: true, hint: 'Your calculator gives a decimal. Decide whether to round up or down.', params: { cap: cap, n: people, up: up }, sol: [people + ' ÷ ' + cap + ' = ' + (people / cap).toFixed(4) + '…', up ? 'Everyone needs a seat, so round up: ' + ctx[1] + '.' : 'Only full shelves count, so round down: ' + ctx[1] + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.cap) { var k = 0, left = p.n; while (left > 0) { left -= p.cap; k++; } return q.check.value === (p.up ? k : left === 0 ? k : k - 1); }
      if (p.x !== undefined) return Math.abs(parseFloat(A.round(q.check.value, { sf: 3 })) - +Math.sqrt(p.x * p.x - p.y * p.y).toPrecision(3)) < 1e-9;
      return Math.abs(parseFloat(q.check.value) - (parseFloat(p.a) + parseFloat(p.b)) / Math.pow(parseFloat(p.c), 2)) < 1e-9;
    } });

  K.gen({ id: 'y8Indices', objective: 'Y8-N-03', title: 'Index laws; zero and negative powers',
    make: function (r, L) {
      var v = r.pick(['a', 'x', 'y', 'm', 'p']), m = r.int(2, 9), n = r.int(2, 7);
      if (L === 1) { var mul = r.chance(0.6); if (!mul && n >= m) m = n + r.int(1, 5);
        var qs = v + '^' + m + (mul ? ' × ' : ' ÷ ') + v + '^' + n, ans = v + '^' + (mul ? m + n : m - n);
        return K.expr('Simplify <b>' + pretty(qs) + '</b>. Write your answer as a single power.', ans, 'simplified', { hint: mul ? 'When you multiply powers of the same letter, add the indices.' : 'When you divide, subtract the indices.', params: { q: qs.replace('×', '*').replace('÷', '/') }, sol: [mul ? 'Add the indices: ' + m + ' + ' + n + ' = ' + (m + n) + '.' : 'Subtract the indices: ' + m + ' − ' + n + ' = ' + (m - n) + '.', 'Answer: ' + pretty(ans) + '.'] }); }
      if (L === 2) { var k = r.int(2, 5), c1 = r.int(2, 6), c2 = r.int(2, 6), t = r.chance(0.5);
        if (t) return K.expr('Simplify <b>' + pretty('(' + v + '^' + m + ')^' + k) + '</b>.', v + '^' + m * k, 'simplified', { hint: 'A power of a power: multiply the indices.', params: { q: '(' + v + '^' + m + ')^' + k }, sol: [m + ' × ' + k + ' = ' + m * k + ', so the answer is ' + pretty(v + '^' + m * k) + '.'] });
        return K.expr('Simplify <b>' + pretty(c1 + v + '^' + m + ' × ' + c2 + v + '^' + n) + '</b>.', c1 * c2 + v + '^' + (m + n), 'simplified', { hint: 'Multiply the numbers, then add the indices.', params: { q: c1 + v + '^' + m + ' * ' + c2 + v + '^' + n }, sol: [c1 + ' × ' + c2 + ' = ' + c1 * c2 + '.', v + ': add the indices, ' + m + ' + ' + n + ' = ' + (m + n) + '.', 'Answer: ' + pretty(c1 * c2 + v + '^' + (m + n)) + '.'] }); }
      var kind = r.pick(['zero', 'neg', 'neg10']), b = r.int(2, 9), e = r.int(1, 3);
      if (kind === 'zero') return K.num('Work out <b>' + b + sup(0) + '</b>.', '1', { hint: 'Anything (except 0) to the power 0 is 1.', params: { b: b, e: 0 }, sol: [b + sup(3) + ' ÷ ' + b + sup(3) + ' = ' + b + sup(0) + ', and anything divided by itself is 1.'] });
      if (kind === 'neg10') return K.num('Work out <b>10' + sup(-e - 1) + '</b> as a decimal.', dt(Q(1, Math.pow(10, e + 1))), { hint: 'A negative power means 1 divided by that power.', params: { b: 10, e: -e - 1 }, sol: ['10' + sup(-e - 1) + ' = 1 ÷ ' + fmt(Math.pow(10, e + 1)) + ' = ' + dt(Q(1, Math.pow(10, e + 1))) + '.'] });
      b = r.int(2, 5); e = b === 2 ? r.int(2, 4) : 2;
      return K.num('Work out <b>' + b + sup(-e) + '</b>. Give your answer as a fraction.', '1/' + Math.pow(b, e), { placeholder: 'e.g. 1/9', hint: 'A negative power means "one over": ' + b + sup(-e) + ' = 1 ÷ ' + b + sup(e) + '.', params: { b: b, e: -e }, sol: [b + sup(e) + ' = ' + Math.pow(b, e) + ', so ' + b + sup(-e) + ' = ' + F(1, Math.pow(b, e)) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.q) return same(q.check.answer, p.q) && OM.markCheck(q.check, q.check.answer).correct; return Math.abs(A.num(Qs(q.check.value)) - Math.pow(p.b, p.e)) < 1e-12; } });

  // ================= ALGEBRA (Kelp Forest) =================
  var REARR = [
    { f: 'y = x + k', s: 'x', a: 'y - k', vars: ['y', 'k'], L: 1, show: 'y = x + {k}' },
    { f: 'y = k*x', s: 'x', a: 'y/k', vars: ['y', 'k'], L: 1, show: 'y = {k}x' },
    { f: 'y = k*x - c', s: 'x', a: '(y + c)/k', vars: ['y', 'k', 'c'], L: 2, show: 'y = {k}x − {c}' },
    { f: 'P = 2*l + 2*w', s: 'l', a: '(P - 2w)/2', vars: ['P', 'w'], L: 2, show: 'P = 2l + 2w' },
    { f: 'v = u + a*t', s: 't', a: '(v - u)/a', vars: ['v', 'u', 'a'], L: 3, show: 'v = u + at' },
    { f: 'A = b*h/2', s: 'h', a: '2A/b', vars: ['A', 'b'], L: 3, show: 'A = ½bh' },
    { f: 'C = 2*π*r', s: 'r', a: 'C/(2π)', vars: ['C', 'π'], L: 3, show: 'C = 2πr' }];
  K.gen({ id: 'y8Rearrange', objective: 'Y8-A-01', title: 'Changing the subject of a formula',
    make: function (r, L) {
      var it = r.pick(REARR.filter(function (x) { return x.L === L; })), k = r.int(2, 9), c = r.int(2, 9);
      var a = it.a.replace(/k/g, k).replace(/c/g, c), show = it.show.replace('{k}', k).replace('{c}', c);
      return K.expr('Make <b>' + it.s + '</b> the subject of <b>' + show + '</b>.', a, 'any', { lhs: it.s, hint: 'Undo the operations around ' + it.s + ' in reverse order, doing the same to both sides.', params: { f: it.f.replace(/k/g, k).replace(/c/g, c), s: it.s, vars: it.vars.filter(function (x) { return x !== 'k' && x !== 'c'; }) },
        sol: ['Start with ' + show + '.', 'Undo each step around ' + it.s + ' (inverse operations, both sides).', it.s + ' = ' + pretty(a.replace(/-/g, '−')) + '.'] });
    },
    // independent: pick values for the other letters, work out the subject from the answer, and check the original formula balances
    verify: function (q) {
      var p = q.params, env = {}, i = 0; p.vars.forEach(function (v) { env[v] = 2.3 + 1.7 * (i++); });
      function ev(src, extra) { var e = src; Object.keys(extra).forEach(function (v) { e = e.split(v).join('(' + extra[v] + ')'); }); var pp = A.poly(A.parse(e)); return pp ? A.num(pp[''] || A.Q(0)) : NaN; }
      var sides = p.f.split(' = '), subjVal = ev(q.check.answer, env), env2 = Object.assign({}, env); env2[p.s] = subjVal;
      return Math.abs(ev(sides[0], env2) - ev(sides[1], env2)) < 1e-6;
    } });

  K.gen({ id: 'y8Modelling', objective: 'Y8-A-02', title: 'Writing expressions and formulae from situations',
    make: function (r, L) {
      if (L === 1) { var n = r.int(3, 9), extra = r.int(20, 95); return K.expr('Pens cost <i>c</i> pence each. A ruler costs ' + extra + 'p. Write an expression for the total cost, in pence, of ' + n + ' pens and a ruler.', n + 'c + ' + extra, 'any', { hint: n + ' pens cost ' + n + ' × c.', params: { q: n + '*c + ' + extra }, sol: [n + ' pens: ' + n + 'c pence. Add the ruler: ' + n + 'c + ' + extra + '.'] }); }
      if (L === 2) { var fixed = r.int(2, 6), per = dt(Q(r.int(15, 40), 10)); return K.expr('A taxi charges £' + fixed + ' plus £' + per + ' for every mile. Write a formula for the cost, <i>C</i> pounds, of a journey of <i>m</i> miles.', per + 'm + ' + fixed, 'any', { lhs: 'C', hint: 'Cost = fixed charge + cost per mile × number of miles.', params: { q: per + '*m + ' + fixed }, sol: ['Each mile costs £' + per + ', so m miles cost ' + per + 'm.', 'C = ' + per + 'm + ' + fixed + '.'] }); }
      var a = r.int(2, 5), b = r.int(1, 9), w = r.int(1, 3);
      return K.expr('A rectangle has length <b>(' + a + 'x + ' + b + ')</b> cm and width <b>' + (w === 1 ? '' : w) + 'x</b> cm. Write an expression for its perimeter. Simplify your answer.', (2 * a + 2 * w) + 'x + ' + 2 * b, 'simplified', { hint: 'Perimeter = 2 × length + 2 × width.', params: { q: '2*(' + a + 'x + ' + b + ') + 2*' + w + 'x' }, sol: ['2(' + a + 'x + ' + b + ') + 2 × ' + (w === 1 ? '' : w) + 'x = ' + 2 * a + 'x + ' + 2 * b + ' + ' + 2 * w + 'x.', 'Collect like terms: ' + (2 * a + 2 * w) + 'x + ' + 2 * b + '.'] });
    },
    verify: function (q) { return same(q.check.answer, q.params.q); } });

  K.gen({ id: 'y8DoubleBrackets', objective: 'Y8-A-03', title: 'Expanding double brackets',
    make: function (r, L) {
      var a = 1, b = r.int(1, 9), c = 1, d = r.int(1, 9);
      if (L === 2) { b *= r.pick([1, -1]); d *= r.pick([-1, 1]); if (b > 0 && d > 0) d = -d; }
      if (L === 3) { if (r.chance(0.5)) { a = r.int(2, 3); c = r.int(1, 3); d = -d; } else { c = a; d = b * r.pick([1, -1]); b = d; } }
      var qs = '(' + lin(a, b) + ')(' + lin(c, d) + ')', sq = L === 3 && a === c && b === d;
      if (sq) qs = '(' + lin(a, b) + ')^2';
      var ans = lin(0, 0); var x2 = a * c, x1 = a * d + b * c, k = b * d;
      ans = (x2 === 1 ? '' : x2) + 'x^2' + (x1 ? (x1 < 0 ? ' - ' + (-x1 === 1 ? '' : -x1) + 'x' : ' + ' + (x1 === 1 ? '' : x1) + 'x') : '') + (k ? (k < 0 ? ' - ' + (-k) : ' + ' + k) : '');
      return K.expr('Expand and simplify <b>' + pretty(nm(qs)) + '</b>', ans, 'expanded', { hint: 'Multiply each term in the first bracket by each term in the second (a grid helps). Then collect the x terms.', params: { q: qs },
        sol: [sq ? pretty(nm(qs)) + ' = ' + nm('(' + lin(a, b) + ')(' + lin(a, b) + ')') + '.' : 'Use a grid or FOIL: four multiplications.', 'x² terms: ' + (x2 === 1 ? '' : x2) + 'x². x terms: ' + nm(String(a * d)) + 'x and ' + nm(String(b * c)) + 'x make ' + nm(String(x1)) + 'x. Number: ' + nm(String(k)) + '.', 'Answer: ' + pretty(nm(ans)) + '.'] });
    },
    verify: function (q) { return same(q.check.answer, q.params.q) && OM.markCheck(q.check, q.check.answer).correct; } });

  K.gen({ id: 'y8Equations', objective: 'Y8-A-04', title: 'Equations with unknowns on both sides, brackets and fractions',
    make: function (r, L) {
      var x = r.int(-5, 12) || 4, eq, shown;
      if (L === 1) { var a = r.int(4, 9), c = r.int(1, a - 1), b = r.int(-9, 15); var rc = (a - c) * x + b; eq = lin(a, b) + ' = ' + lin(c, rc); }
      else if (L === 2) { var p = r.int(3, 6), s = r.int(1, 6), q2 = r.int(1, p - 1); eq = p + '(x - ' + s + ') = ' + lin(q2, p * (x - s) - q2 * x); }
      else { var d = r.int(2, 6), m = r.int(1, 9), rhs = r.int(2, 9); if (r.chance(0.5)) { eq = '(x + ' + m + ')/' + d + ' = ' + rhs; } else { eq = '(2x - ' + m + ')/' + d + ' = ' + rhs; } }
      eq = eq.replace(/\+ -/g, '- ');
      var sides = eq.split(' = '), P = function (t) { return A.poly(A.parse(t)); }, Lp = P(sides[0]), Rp = P(sides[1]);
      var coef = A.sub(Lp['x^1'] || Q(0), Rp['x^1'] || Q(0)), con = A.sub(Rp[''] || Q(0), Lp[''] || Q(0)), ans = A.div(con, coef);
      shown = nm(eq).replace(/\(([^()]+)\)\/(\d+)/, function (mm, top, den) { return F(top, den); });
      return K.solve('Solve <b>' + shown + '</b>', A.qText(ans).replace('−', '-'), { hint: L === 3 ? 'Multiply both sides by the denominator first.' : L === 2 ? 'Expand the brackets, then get the x terms on one side.' : 'Subtract the smaller x term from both sides.', params: { eq: eq },
        sol: [L === 3 ? 'Multiply both sides by the number under the fraction.' : L === 2 ? 'Expand both sides.' : 'Take the smaller x term from both sides.', 'Collect x terms on one side and numbers on the other.', 'x = ' + nm(A.qText(ans)) + '.'] });
    },
    verify: function (q) { var s = q.params.eq.split(' = '), v = A.parseQ(q.check.value); if (!v) return false; var x = A.num(v), ev = function (t) { var pp = A.poly(A.parse(t.replace(/x/g, '(' + x + ')'))); return pp ? A.num(pp[''] || A.Q(0)) : NaN; }; return Math.abs(ev(s[0]) - ev(s[1])) < 1e-9; } });

  K.gen({ id: 'y8OtherSequences', objective: 'Y8-A-05', title: 'Geometric and other sequences',
    make: function (r, L) {
      if (L === 1) { var a = r.int(1, 6), k = r.pick([2, 3]), t = [0, 1, 2, 3].map(function (i) { return a * Math.pow(k, i); }); return K.int('What is the next term of this geometric sequence? &nbsp;<b>' + t.join(', ') + ', …</b>', a * Math.pow(k, 4), { hint: 'Each term is multiplied by the same number.', params: { t: t }, sol: ['Each term is multiplied by ' + k + '.', t[3] + ' × ' + k + ' = ' + a * Math.pow(k, 4) + '.'] }); }
      if (L === 2) { if (r.chance(0.5)) { var s = r.pick([80, 160, 640, 96]), u = [s, s / 2, s / 4, s / 8]; return K.num('What is the <b>common ratio</b> of the geometric sequence &nbsp;<b>' + u.join(', ') + ', …</b>?', '1/2', { placeholder: 'e.g. 3 or 1/2', hint: 'Divide a term by the one before it.', params: { t: u }, sol: [u[1] + ' ÷ ' + u[0] + ' = ' + F(1, 2) + ' (or 0.5): each term halves.'] }); }
        var p1 = r.int(1, 5), p2 = r.int(1, 5), f = [p1, p2]; while (f.length < 6) f.push(f[f.length - 1] + f[f.length - 2]); return K.int('Each term is the sum of the two before it. What comes next? &nbsp;<b>' + f.slice(0, 5).join(', ') + ', …</b>', f[5], { hint: 'Add the last two terms.', params: { t: f.slice(0, 5), fib: true }, sol: [f[3] + ' + ' + f[4] + ' = ' + f[5] + '.'] }); }
      var kinds = [['arithmetic', function (r2) { var a = r2.int(1, 9), d = r2.int(2, 7); return [0, 1, 2, 3, 4].map(function (i) { return a + i * d; }); }], ['geometric', function (r2) { var a = r2.int(1, 4), k = r2.pick([2, 3]); return [0, 1, 2, 3, 4].map(function (i) { return a * Math.pow(k, i); }); }],
        ['square numbers', function (r2) { var s0 = r2.int(1, 5); return [0, 1, 2, 3, 4].map(function (i) { return (s0 + i) * (s0 + i); }); }], ['Fibonacci-type', function (r2) { var f2 = [r2.int(1, 4), r2.int(2, 6)]; while (f2.length < 5) f2.push(f2[f2.length - 1] + f2[f2.length - 2]); return f2; }]];
      var pick = r.pick(kinds), seq = pick[1](r);
      return K.choice('What type of sequence is &nbsp;<b>' + seq.join(', ') + ', …</b>?', kinds.map(function (k2) { return k2[0]; }), pick[0], { hint: 'Check: is there a common difference? A common ratio? Are they square numbers? Is each the sum of the two before?', params: { t: seq }, sol: ['These terms form a ' + pick[0] + ' sequence.'] });
    },
    verify: function (q) {
      var t = q.params.t, i;
      if (q.check.kind === 'choice') {
        var diff = t.every(function (x, j) { return !j || x - t[j - 1] === t[1] - t[0]; }), ratio = t.every(function (x, j) { return !j || x * t[0] === t[j - 1] * t[1]; }), sq = t.every(function (x) { return Math.sqrt(x) % 1 === 0; }) && t.every(function (x, j) { return !j || Math.sqrt(x) - Math.sqrt(t[j - 1]) === 1; }), fib = t.every(function (x, j) { return j < 2 || x === t[j - 1] + t[j - 2]; });
        var want = diff ? 'arithmetic' : ratio ? 'geometric' : sq ? 'square numbers' : fib ? 'Fibonacci-type' : '?'; return q.check.value === want;
      }
      if (q.params.fib) return q.check.value === t[3] + t[4];
      if (q.check.kind === 'solve') return Math.abs(A.num(Qs(q.check.value)) - t[1] / t[0]) < 1e-12;
      return q.check.value * t[0] === t[3] * t[1];
    } });

  // ================= GRAPHS (Sonar Grid) =================
  K.gen({ id: 'y8LinearGraphs', objective: 'Y8-A-06', title: 'Straight-line graphs',
    make: function (r, L) {
      var m = r.int(-4, 5) || 2, c = r.int(-6, 6), eq = 'y = ' + lin(m, c);
      if (L === 1) { var xs = [-1, 0, 1, 2, 3], k = r.int(0, 4); return K.int('Complete the table of values for <b>' + nm(eq) + '</b>. What is y when x = ' + neg(xs[k]) + '?', m * xs[k] + c, { keys: 'signed', visual: V.table(['x'].concat(xs.map(neg)), [['y'].concat(xs.map(function (x, i) { return i === k ? '?' : neg(m * x + c); }))]), hint: 'Put x = ' + neg(xs[k]) + ' into the equation.', params: { m: m, c: c, x: xs[k] }, sol: ['y = ' + m + ' × ' + neg(xs[k]) + (c < 0 ? ' − ' + (-c) : ' + ' + c) + ' = ' + (m * xs[k] + c) + '.'] }); }
      if (L === 2) { var px = r.int(-4, 6), on = r.chance(0.5), py = m * px + c + (on ? 0 : r.pick([-2, -1, 1, 3])); return K.choice('Does the point <b>(' + neg(px) + ', ' + neg(py) + ')</b> lie on the line <b>' + nm(eq) + '</b>?', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], on ? 'yes' : 'no', { hint: 'Put x = ' + neg(px) + ' into the equation. Do you get y = ' + neg(py) + '?', params: { m: m, c: c, px: px, py: py }, sol: ['When x = ' + neg(px) + ', y = ' + neg(m * px + c) + '.', on ? 'That matches, so the point is on the line.' : 'That is not ' + neg(py) + ', so the point is not on the line.'] }); }
      var others = [[-m, c], [m, -c || 3], [m === 1 ? 2 : 1, c]].map(function (p) { return 'y = ' + nm(lin(p[0], p[1])); });
      return K.choice('Which equation matches the straight line drawn?', opts(r, nm(eq), others), nm(eq), { visual: V.plot({ x: [-5, 5], y: [-10, 10], gy: 2, fns: [{ f: function (x) { return m * x + c; } }] }), hint: 'Read where it crosses the y-axis (that is c), then how steep it is (that is m).', params: { m: m, c: c }, sol: ['It crosses the y-axis at ' + neg(c) + ' and the gradient is ' + neg(m) + '.', 'So the equation is ' + nm(eq) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.x !== undefined) return q.check.value === p.m * p.x + p.c; if (p.px !== undefined) return q.check.value === (p.m * p.px + p.c === p.py ? 'yes' : 'no'); var mm = /^y = (−?\d*)x(?: ([+−]) (\d+))?$|^y = (−?\d+)$/.exec(q.check.value); if (!mm) return false; var g = mm[1] === '' ? 1 : mm[1] === '−' ? -1 : +String(mm[1]).replace('−', '-'), k = mm[2] ? (mm[2] === '−' ? -mm[3] : +mm[3]) : 0; return g === p.m && k === p.c; } });

  K.gen({ id: 'y8Gradient', objective: 'Y8-A-07', title: 'y = mx + c: gradients and intercepts',
    make: function (r, L) {
      var m = r.int(-6, 7) || 3, c = r.int(-9, 9);
      if (L === 1) { var askM = r.chance(0.6); return K.num('What is the ' + (askM ? '<b>gradient</b>' : '<b>y-intercept</b>') + ' of the line <b>y = ' + nm(lin(m, c)) + '</b>?', String(askM ? m : c), { hint: 'In y = mx + c, m is the gradient and c is the y-intercept.', params: { m: m, c: c, ask: askM ? 'm' : 'c' }, sol: ['Compare with y = mx + c.', (askM ? 'The gradient is ' + neg(m) : 'The y-intercept is ' + neg(c)) + '.'] }); }
      if (L === 2) { var k = r.int(2, 4), form = r.chance(0.5); if (form) return K.num('Find the gradient of the line <b>' + k + 'y = ' + nm(lin(k * m, k * c)) + '</b>.', String(m), { hint: 'Divide every term by ' + k + ' to get y on its own.', params: { m: m, c: c, ask: 'm' }, sol: ['Divide by ' + k + ': y = ' + nm(lin(m, c)) + '.', 'Gradient: ' + neg(m) + '.'] });
        return K.num('Find the gradient of the line <b>' + nm(lin(-m, 0)) + ' + y = ' + c + '</b>.'.replace('0 + y', 'y').replace('+ y', '+ y'), String(m), { hint: 'Rearrange to y = mx + c.', params: { m: m, c: c, ask: 'm' }, sol: ['Add ' + nm(lin(m, 0)) + ' to both sides: y = ' + nm(lin(m, c)) + '.', 'Gradient: ' + neg(m) + '.'] }); }
      var x1 = r.int(-5, 3), y1 = r.int(-5, 5), dx = r.int(1, 6), dy = r.int(-8, 8) || 4, x2 = x1 + dx, y2 = y1 + dy, g = A.div(Q(dy), Q(dx));
      return K.num('Find the gradient of the line through <b>(' + neg(x1) + ', ' + neg(y1) + ')</b> and <b>(' + neg(x2) + ', ' + neg(y2) + ')</b>.', A.qText(g).replace('−', '-'), { hint: 'Gradient = change in y ÷ change in x.', params: { p: [x1, y1, x2, y2] }, sol: ['Change in y: ' + neg(y2) + ' − ' + neg(y1) + ' = ' + neg(dy) + '. Change in x: ' + neg(x2) + ' − ' + neg(x1) + ' = ' + dx + '.', 'Gradient = ' + neg(dy) + ' ÷ ' + dx + ' = ' + nm(A.qText(g)) + '.'] });
    },
    verify: function (q) { var p = q.params, v = A.num(Qs(q.check.value)); if (p.p) return Math.abs(v * (p.p[2] - p.p[0]) - (p.p[3] - p.p[1])) < 1e-12; return v === (p.ask === 'm' ? p.m : p.c); } });

  K.gen({ id: 'y8Transform', objective: 'Y8-G-05', title: 'Translations, reflections and rotations',
    make: function (r, L) {
      var x = r.int(-5, 5) || 3, y = r.int(-5, 5) || -2;
      if (L === 1) { var a = r.int(-5, 5) || 2, b = r.int(-5, 5) || -3; return { prompt: 'The point P(' + neg(x) + ', ' + neg(y) + ') is translated by the vector ' + vec(a, b) + '. Where is its image?', input: { type: 'coord' }, check: { kind: 'coord', x: x + a, y: y + b }, hint: 'The top number moves right (or left if negative); the bottom number moves up (or down).', params: { x: x, y: y, a: a, b: b, k: 't' }, solution: [S('(' + neg(x) + ' + ' + neg(a) + ', ' + neg(y) + ' + ' + neg(b) + ') = (' + neg(x + a) + ', ' + neg(y + b) + ').')] }; }
      if (L === 2) { var line = r.pick(['y = x', 'x = 1', 'y = 2', 'x = -2', 'y = -1']), rx, ry; if (line === 'y = x') { rx = y; ry = x; } else if (line[0] === 'x') { var k = +line.split('= ')[1]; rx = 2 * k - x; ry = y; } else { var k2 = +line.split('= ')[1]; rx = x; ry = 2 * k2 - y; }
        return { prompt: 'The point Q(' + neg(x) + ', ' + neg(y) + ') is reflected in the line <b>' + nm(line) + '</b>. Where is its image?', input: { type: 'coord' }, check: { kind: 'coord', x: rx, y: ry }, visual: V.grid4({ n: 7, points: [{ x: x, y: y, label: 'Q' }] }), hint: line === 'y = x' ? 'Reflecting in y = x swaps the coordinates.' : 'The image is the same distance from the mirror line, on the other side.', params: { x: x, y: y, line: line, k: 'r' }, solution: [S('The image is the same distance from ' + nm(line) + ' on the other side.'), S('Image: (' + neg(rx) + ', ' + neg(ry) + ').')] }; }
      var turn = r.pick(['90° clockwise', '90° anticlockwise', '180°']), ix = turn === '180°' ? -x : turn === '90° clockwise' ? y : -y, iy = turn === '180°' ? -y : turn === '90° clockwise' ? -x : x;
      return { prompt: 'The point R(' + neg(x) + ', ' + neg(y) + ') is rotated <b>' + turn + '</b> about the origin. Where is its image?', input: { type: 'coord' }, check: { kind: 'coord', x: ix, y: iy }, visual: V.grid4({ n: 6, points: [{ x: x, y: y, label: 'R' }] }), hint: 'Use tracing paper, or remember: 90° clockwise sends (x, y) to (y, −x).', params: { x: x, y: y, turn: turn, k: 'rot' }, solution: [S('Rotating ' + turn + ' about the origin moves (' + neg(x) + ', ' + neg(y) + ') to (' + neg(ix) + ', ' + neg(iy) + ').')] };
    },
    verify: function (q) {
      var p = q.params, X = q.check.x, Y = q.check.y;
      if (p.k === 't') return X - p.x === p.a && Y - p.y === p.b;
      if (p.k === 'r') { if (p.line === 'y = x') return X === p.y && Y === p.x; var k = +p.line.split('= ')[1]; return p.line[0] === 'x' ? (X + p.x) / 2 === k && Y === p.y : (Y + p.y) / 2 === k && X === p.x; }
      var dot = X * p.x + Y * p.y, cross = p.x * Y - p.y * X, same = X * X + Y * Y === p.x * p.x + p.y * p.y;
      if (p.turn === '180°') return same && X === -p.x && Y === -p.y;
      return same && dot === 0 && (p.turn === '90° anticlockwise' ? cross > 0 : cross < 0);
    } });

  // ================= RATIO AND RATES (Current Exchange) =================
  K.gen({ id: 'y8Scale', objective: 'Y8-R-01', title: 'Scale factors, scale drawings and maps',
    make: function (r, L) {
      if (L === 1) { var s = r.pick([20, 25, 40, 50]), cm = r.int(4, 19), real = A.div(Q(s * cm), Q(100)); return K.dec('A model of a boat is made to a scale of <b>1 : ' + s + '</b>. The model is ' + cm + ' cm long. How long is the real boat, in metres?', dt(real), { suffix: 'm', hint: 'Multiply by ' + s + ', then change cm to m.', params: { s: s, cm: cm, k: 'model' }, sol: [cm + ' × ' + s + ' = ' + s * cm + ' cm.', s * cm + ' cm = ' + dt(real) + ' m.'] }); }
      if (L === 2) { var sc = r.pick([25000, 50000, 100000]), km = r.int(2, 9) * (sc === 25000 ? 0.5 : 1), mapcm = km * 100000 / sc; return K.dec('A map has a scale of <b>1 : ' + fmt(sc) + '</b>. Two villages are ' + km + ' km apart. How far apart are they on the map, in cm?', String(mapcm), { suffix: 'cm', hint: 'Change km to cm (× 100,000), then divide by ' + fmt(sc) + '.', params: { sc: sc, km: km, k: 'map' }, sol: [km + ' km = ' + fmt(km * 100000) + ' cm.', fmt(km * 100000) + ' ÷ ' + fmt(sc) + ' = ' + mapcm + ' cm.'] }); }
      var a = r.int(2, 9) * 2, sf = r.pick(['1.5', '2.5', '3', '0.5']), b = A.mul(Q(a), Qs(sf)), other = r.int(3, 12) * 2;
      return K.dec('Shape B is an enlargement of shape A. A side of ' + a + ' cm in A becomes ' + dt(b) + ' cm in B. Another side of A is ' + other + ' cm. How long is that side in B?', dt(A.mul(Q(other), Qs(sf))), { suffix: 'cm', hint: 'Find the scale factor: ' + dt(b) + ' ÷ ' + a + '.', params: { a: a, b: dt(b), other: other, k: 'sf' }, sol: ['Scale factor: ' + dt(b) + ' ÷ ' + a + ' = ' + sf + '.', other + ' × ' + sf + ' = ' + dt(A.mul(Q(other), Qs(sf))) + ' cm.'] });
    },
    verify: function (q) { var p = q.params, v = parseFloat(q.check.value); if (p.k === 'model') return Math.abs(v * 100 - p.s * p.cm) < 1e-9; if (p.k === 'map') return Math.abs(v * p.sc - p.km * 100000) < 1e-6; return Math.abs(v / p.other - parseFloat(p.b) / p.a) < 1e-9; } });

  K.gen({ id: 'y8RatioFraction', objective: 'Y8-R-02', title: 'Ratios and fractions',
    make: function (r, L) {
      var a = r.int(1, 7), b = r.int(2, 9); while (OM.gcd(a, b) !== 1 || a === b) b = r.int(2, 9);
      if (L === 1) return K.frac('In a bag, the ratio of red to blue counters is <b>' + a + ' : ' + b + '</b>. What fraction of the counters are red?', a, a + b, { hint: 'There are ' + a + ' + ' + b + ' = ' + (a + b) + ' parts altogether.', params: { a: a, b: b, k: 'frac' }, sol: ['Total parts: ' + (a + b) + '. Red: ' + a + ' parts.', 'Fraction red: ' + F(a, a + b) + '.'] });
      if (L === 2) return K.multi('<i>A</i> is ' + F(a, b) + ' of <i>B</i>. Write the ratio <b>A : B</b> in its simplest form.', '{0} : {1}', [{ kind: 'int', value: a }, { kind: 'int', value: b }], { hint: 'If A is ' + F(a, b) + ' of B, then for every ' + b + ' parts of B there are ' + a + ' parts of A.', params: { a: a, b: b, k: 'ratio' }, answer: a + ' : ' + b, sol: ['A = ' + F(a, b) + 'B, so A : B = ' + a + ' : ' + b + '.'] });
      var k = r.int(2, 9);
      return K.int('There are ' + F(a, b) + ' as many cats as dogs at a rescue centre. There are ' + b * k + ' dogs. How many cats are there?', a * k, { hint: 'Find ' + F(a, b) + ' of ' + b * k + '.', params: { a: a, b: b, dogs: b * k, k: 'of' }, sol: [b * k + ' ÷ ' + b + ' = ' + k + '.', k + ' × ' + a + ' = ' + a * k + ' cats.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'frac') return q.check.n * (p.a + p.b) === p.a * q.check.d; if (p.k === 'ratio') return q.check.parts[0].value * p.b === q.check.parts[1].value * p.a && OM.gcd(q.check.parts[0].value, q.check.parts[1].value) === 1; return q.check.value * p.b === p.dogs * p.a; } });

  K.gen({ id: 'y8Direct', objective: 'Y8-R-03', title: 'Direct proportion and best buys',
    make: function (r, L) {
      if (L === 1) { var n1 = r.pick([2, 4, 5, 6]), amt = n1 * r.int(6, 30) * 5, n2 = r.pick([3, 8, 10, 12]); while (n2 === n1) n2++; var ans = A.div(Q(amt * n2), Q(n1));
        return K.dec('A recipe for ' + n1 + ' people uses ' + amt + ' g of flour. How much flour is needed for ' + n2 + ' people?', dt(ans), { suffix: 'g', hint: 'Find the amount for 1 person first.', params: { n1: n1, amt: amt, n2: n2, k: 'recipe' }, sol: ['For 1 person: ' + amt + ' ÷ ' + n1 + ' = ' + dt(A.div(Q(amt), Q(n1))) + ' g.', 'For ' + n2 + ': × ' + n2 + ' = ' + dt(ans) + ' g.'] }); }
      if (L === 2) { var g1 = r.pick([250, 400, 500]), g2 = r.pick([600, 750, 1000]), p1 = r.int(90, 300), per1 = p1 / g1, p2 = Math.round(per1 * g2 * (r.chance(0.5) ? 0.9 : 1.1)); if (p2 * g1 === p1 * g2) p2++;
        var better = p1 / g1 < p2 / g2 ? 'small' : 'large';
        return K.choice('Pasta comes in a ' + g1 + ' g bag for ' + OM.pounds(p1) + ' or a ' + g2 + ' g bag for ' + OM.pounds(p2) + '. Which is <b>better value</b>?', [{ value: 'small', label: g1 + ' g for ' + OM.pounds(p1) }, { value: 'large', label: g2 + ' g for ' + OM.pounds(p2) }], better, { calc: true, hint: 'Work out the cost per 100 g (or per gram) for each bag.', params: { g1: g1, p1: p1, g2: g2, p2: p2, k: 'best' },
          sol: [g1 + ' g: ' + (p1 / g1 * 100).toFixed(1) + 'p per 100 g. ' + g2 + ' g: ' + (p2 / g2 * 100).toFixed(1) + 'p per 100 g.', 'The ' + (better === 'small' ? g1 : g2) + ' g bag is better value.'] }); }
      var x1 = r.int(2, 9), k2 = dt(Q(r.int(11, 49), 10)), y1 = A.mul(Q(x1), Qs(k2)), x2 = r.int(3, 15); if (x2 === x1) x2++;
      return K.dec('<i>y</i> is directly proportional to <i>x</i>. When x = ' + x1 + ', y = ' + dt(y1) + '. Find y when x = ' + x2 + '.', dt(A.mul(Q(x2), Qs(k2))), { hint: 'Write y = kx and find k first.', params: { x1: x1, y1: dt(y1), x2: x2, k: 'kx' }, sol: ['y = kx, so k = ' + dt(y1) + ' ÷ ' + x1 + ' = ' + k2 + '.', 'y = ' + k2 + ' × ' + x2 + ' = ' + dt(A.mul(Q(x2), Qs(k2))) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'recipe') return Math.abs(parseFloat(q.check.value) * p.n1 - p.amt * p.n2) < 1e-9; if (p.k === 'best') return q.check.value === (p.p1 * p.g2 < p.p2 * p.g1 ? 'small' : 'large'); return Math.abs(parseFloat(q.check.value) / p.x2 - parseFloat(p.y1) / p.x1) < 1e-9; } });

  K.gen({ id: 'y8Compound', objective: 'Y8-R-04', title: 'Speed, density and unit pricing',
    make: function (r, L) {
      if (L === 1) { var sp = r.int(4, 18) * 5, t = dt(Q(r.int(2, 9), 2)), d = A.mul(Q(sp), Qs(t)); return K.dec('A car travels ' + dt(d) + ' km in ' + t + ' hours. What is its average speed?', String(sp), { suffix: 'km/h', hint: 'Speed = distance ÷ time.', params: { d: dt(d), t: t, k: 'speed' }, sol: [dt(d) + ' ÷ ' + t + ' = ' + sp + ' km/h.'] }); }
      if (L === 2) { if (r.chance(0.5)) { var s2 = r.pick([8, 10, 12, 15, 16, 20]), mins = r.pick([15, 30, 45, 75, 90]), dist = A.div(Q(s2 * mins), Q(60)); return K.int('A cyclist rides ' + dt(dist) + ' km at ' + s2 + ' km/h. How long does it take, in minutes?', mins, { suffix: 'minutes', hint: 'Time = distance ÷ speed. Then change hours to minutes.', params: { d: dt(dist), s: s2, k: 'time' }, sol: [dt(dist) + ' ÷ ' + s2 + ' = ' + dt(A.div(Q(mins), Q(60))) + ' hours.', '× 60 = ' + mins + ' minutes.'] }); }
        var dens = r.int(2, 11), vol = r.int(5, 40); return K.int('A metal has a density of ' + dens + ' g/cm³. What is the mass of ' + vol + ' cm³ of the metal?', dens * vol, { suffix: 'g', hint: 'Mass = density × volume.', params: { dens: dens, vol: vol, k: 'mass' }, sol: [dens + ' × ' + vol + ' = ' + dens * vol + ' g.'] }); }
      var kmh = r.pick([18, 36, 54, 72, 90, 108]); return K.int('Change <b>' + kmh + ' km/h</b> into metres per second.', kmh * 1000 / 3600, { suffix: 'm/s', hint: '1 km = 1,000 m and 1 hour = 3,600 seconds.', params: { kmh: kmh, k: 'conv' }, sol: [kmh + ' km/h = ' + fmt(kmh * 1000) + ' m per 3,600 seconds.', fmt(kmh * 1000) + ' ÷ 3,600 = ' + kmh * 1000 / 3600 + ' m/s.'] });
    },
    verify: function (q) { var p = q.params, v = parseFloat(q.check.value !== undefined ? q.check.value : NaN); if (p.k === 'speed') return Math.abs(v * parseFloat(p.t) - parseFloat(p.d)) < 1e-9; if (p.k === 'time') return Math.abs(q.check.value / 60 * p.s - parseFloat(p.d)) < 1e-9; if (p.k === 'mass') return q.check.value / p.vol === p.dens; return q.check.value * 3.6 === p.kmh; } });

  K.gen({ id: 'y8PercentChange', objective: 'Y8-R-05', title: 'Percentage change, original value and simple interest',
    make: function (r, L) {
      if (L === 1) { var old = r.pick([20, 40, 50, 80, 120, 160, 200]), pc = r.pick([5, 10, 15, 20, 25, 30, 35]), up = r.chance(0.5), nw = old * (100 + (up ? pc : -pc)) / 100;
        return K.int('A price ' + (up ? 'rises' : 'falls') + ' from £' + old + ' to £' + nw + '. What is the percentage ' + (up ? 'increase' : 'decrease') + '?', pc, { suffix: '%', hint: 'Percentage change = change ÷ original × 100.', params: { old: old, nw: nw }, sol: ['Change: £' + Math.abs(nw - old) + '.', Math.abs(nw - old) + ' ÷ ' + old + ' × 100 = ' + pc + '%.'] }); }
      if (L === 2) { var P = r.pick([400, 500, 800, 1200, 2500]), rate = r.pick([2, 3, 4, 5, 6]), yrs = r.int(2, 6); return K.int('£' + fmt(P) + ' is invested at <b>' + rate + '% simple interest</b> per year. How much interest is earned in ' + yrs + ' years?', P * rate * yrs / 100, { prefix: '£', hint: 'Simple interest is the same every year: find ' + rate + '% of £' + fmt(P) + ', then multiply by ' + yrs + '.', params: { P: P, rate: rate, yrs: yrs }, sol: [rate + '% of £' + fmt(P) + ' = £' + P * rate / 100 + ' per year.', '× ' + yrs + ' = £' + P * rate * yrs / 100 + '.'] }); }
      var orig = r.int(2, 15) * 20, pc2 = r.pick([10, 20, 25, 40]), up2 = r.chance(0.4), now = orig * (100 + (up2 ? pc2 : -pc2)) / 100;
      return K.int('After a ' + pc2 + '% ' + (up2 ? 'increase' : 'reduction') + ', a coat costs £' + now + '. What was the <b>original</b> price?', orig, { prefix: '£', hint: '£' + now + ' is ' + (up2 ? 100 + pc2 : 100 - pc2) + '% of the original price.', params: { now: now, pct: up2 ? 100 + pc2 : 100 - pc2 }, sol: ['£' + now + ' = ' + (up2 ? 100 + pc2 : 100 - pc2) + '%.', '1% = £' + dt(A.div(Q(now), Q(up2 ? 100 + pc2 : 100 - pc2))) + ', so 100% = £' + orig + '.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; if (p.old) return Math.abs(p.nw - p.old) * 100 === v * p.old; if (p.P) { var t = 0; for (var i = 0; i < p.yrs; i++) t += p.P * p.rate / 100; return t === v; } return v * p.pct === p.now * 100; } });

  // ================= GEOMETRY (Shipwreck Hull) =================
  K.gen({ id: 'y8Circles', objective: 'Y8-G-01', title: 'Circumference and area of circles',
    make: function (r, L) {
      var rad = r.int(2, 15), useD = r.chance(0.4);
      if (L === 1) { var c = 2 * Math.PI * rad; return K.approx('A circle has ' + (useD ? 'a diameter of ' + 2 * rad : 'a radius of ' + rad) + ' cm. Find its <b>circumference</b>. Give your answer to 1 decimal place.', c.toFixed(12), { dp: 1 }, { calc: true, suffix: 'cm', visual: V.circleParts(useD ? 'diameter' : 'radius', (useD ? 2 * rad : rad) + ' cm'), hint: 'Circumference = π × diameter.', params: { r: rad, what: 'C' }, sol: ['Diameter = ' + 2 * rad + ' cm.', 'π × ' + 2 * rad + ' = ' + c.toFixed(4) + '… = ' + A.round(c.toFixed(12), { dp: 1 }) + ' cm.'] }); }
      if (L === 2) { var ar = Math.PI * rad * rad; return K.approx('A circle has ' + (useD ? 'a diameter of ' + 2 * rad : 'a radius of ' + rad) + ' cm. Find its <b>area</b>. Give your answer to 1 decimal place.', ar.toFixed(12), { dp: 1 }, { calc: true, suffix: 'cm²', visual: V.circleParts(useD ? 'diameter' : 'radius', (useD ? 2 * rad : rad) + ' cm'), hint: 'Area = π × radius². Use the radius, not the diameter.', params: { r: rad, what: 'A' }, sol: ['Radius = ' + rad + ' cm.', 'π × ' + rad + '² = ' + ar.toFixed(4) + '… = ' + A.round(ar.toFixed(12), { dp: 1 }) + ' cm².'] }); }
      if (r.chance(0.5)) return K.expr('A circle has a radius of ' + rad + ' cm. Find its area. Give your answer <b>in terms of π</b>.', rad * rad + 'π', 'any', { suffix: 'cm²', placeholder: 'e.g. 25π', hint: 'Area = πr². Leave π in your answer.', params: { r: rad, what: 'Api' }, sol: ['π × ' + rad + '² = ' + rad * rad + 'π cm².'] });
      var d = 2 * rad, per = Math.PI * d / 2 + d;
      return K.approx('A semicircle has a diameter of ' + d + ' cm. Find its <b>perimeter</b> (the curved edge and the straight edge). Give your answer to 1 decimal place.', per.toFixed(12), { dp: 1 }, { calc: true, suffix: 'cm', hint: 'Half of π × d, plus the diameter.', params: { r: rad, what: 'semi' }, sol: ['Curved edge: π × ' + d + ' ÷ 2 = ' + (Math.PI * d / 2).toFixed(3) + '… cm.', 'Add the diameter: ' + per.toFixed(3) + '… = ' + A.round(per.toFixed(12), { dp: 1 }) + ' cm.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.what === 'Api') return same(q.check.answer, '(' + p.r + ')^2*π');
      var want = p.what === 'C' ? Math.PI * 2 * p.r : p.what === 'A' ? Math.PI * p.r * p.r : Math.PI * p.r + 2 * p.r;
      return Math.abs(parseFloat(A.round(q.check.value, { dp: 1 })) - Math.round(want * 10) / 10) < 1e-9;
    } });

  K.gen({ id: 'y8Volume', objective: 'Y8-G-02', title: 'Volume of prisms and cylinders',
    make: function (r, L) {
      if (L === 1) { var b = r.int(3, 12), h = r.int(2, 10), len = r.int(4, 20); if ((b * h) % 2) b++; return K.int('A triangular prism has a triangle cross-section with base ' + b + ' cm and height ' + h + ' cm. The prism is ' + len + ' cm long. Find its volume.', b * h / 2 * len, { suffix: 'cm³', hint: 'Volume of a prism = area of cross-section × length.', params: { b: b, h: h, len: len, k: 'tri' }, sol: ['Cross-section: ½ × ' + b + ' × ' + h + ' = ' + b * h / 2 + ' cm².', '× ' + len + ' = ' + b * h / 2 * len + ' cm³.'] }); }
      if (L === 2) { var rad = r.int(2, 10), hh = r.int(3, 20), v = Math.PI * rad * rad * hh; return K.approx('A cylinder has a radius of ' + rad + ' cm and a height of ' + hh + ' cm. Find its volume. Give your answer to 1 decimal place.', v.toFixed(12), { dp: 1 }, { calc: true, suffix: 'cm³', hint: 'Volume = πr² × height.', params: { r: rad, h: hh, k: 'cyl' }, sol: ['π × ' + rad + '² × ' + hh + ' = ' + v.toFixed(3) + '…', 'To 1 decimal place: ' + A.round(v.toFixed(12), { dp: 1 }) + ' cm³.'] }); }
      var l = r.int(2, 8) * 10, w = r.int(2, 6) * 10, d = r.int(1, 5) * 10, litres = l * w * d / 1000;
      return K.dec('A fish tank is a cuboid ' + l + ' cm long, ' + w + ' cm wide and ' + d + ' cm deep. How many <b>litres</b> of water does it hold when full?', String(litres), { suffix: 'litres', hint: 'Find the volume in cm³. 1 litre = 1,000 cm³.', params: { l: l, w: w, d: d, k: 'tank' }, sol: [l + ' × ' + w + ' × ' + d + ' = ' + fmt(l * w * d) + ' cm³.', fmt(l * w * d) + ' ÷ 1,000 = ' + litres + ' litres.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'tri') return q.check.value * 2 === p.b * p.h * p.len; if (p.k === 'cyl') return Math.abs(parseFloat(A.round(q.check.value, { dp: 1 })) - Math.round(Math.PI * p.r * p.r * p.h * 10) / 10) < 1e-9; return Math.abs(parseFloat(q.check.value) * 1000 - p.l * p.w * p.d) < 1e-9; } });

  K.gen({ id: 'y8ParallelAngles', objective: 'Y8-G-03', title: 'Angles in parallel lines',
    make: function (r, L) {
      var a = r.int(35, 80), rel = L === 1 ? 'corresponding' : L === 2 ? r.pick(['alternate', 'co-interior']) : r.pick(['corresponding', 'alternate', 'co-interior']);
      var set = { corresponding: [['ur', 0], ['ur', 1]], alternate: [['ll', 0], ['ur', 1]], 'co-interior': [['lr', 0], ['ur', 1]] }[rel];
      var val = function (pos) { return pos === 'ur' || pos === 'll' ? a : 180 - a; }, given = val(set[0][0]), unknown = val(set[1][0]);
      var pic = V.parallel(a, [set[0][0], set[0][1], given + '°'], [set[1][0], set[1][1], 'x']);
      if (L < 3) return K.int('The two lines with arrows are parallel. Find the angle <i>x</i>.', unknown, { suffix: '°', visual: pic, hint: rel === 'corresponding' ? 'Corresponding angles (an F shape) are equal.' : rel === 'alternate' ? 'Alternate angles (a Z shape) are equal.' : 'Co-interior angles (a C shape) add up to 180°.', params: { given: given, rel: rel }, sol: [rel === 'co-interior' ? 'Co-interior angles add up to 180°: x = 180 − ' + given + ' = ' + unknown + '°.' : rel.charAt(0).toUpperCase() + rel.slice(1) + ' angles are equal: x = ' + unknown + '°.'] });
      return K.choice('The lines with arrows are parallel. What is the reason that links the two marked angles?', ['corresponding angles are equal', 'alternate angles are equal', 'co-interior angles add up to 180°', 'vertically opposite angles are equal'], { corresponding: 'corresponding angles are equal', alternate: 'alternate angles are equal', 'co-interior': 'co-interior angles add up to 180°' }[rel], { visual: V.parallel(a, [set[0][0], set[0][1], given + '°'], [set[1][0], set[1][1], unknown + '°']), hint: 'F shape: corresponding. Z shape: alternate. C shape: co-interior.', params: { given: given, rel: rel, pick: true }, sol: ['These are ' + rel + ' angles.'] });
    },
    verify: function (q) { var p = q.params; if (p.pick) return q.check.value.indexOf(p.rel) === 0; return p.rel === 'co-interior' ? q.check.value + p.given === 180 : q.check.value === p.given; } });

  var CONS = [['all the points the same distance from two points A and B', 'the perpendicular bisector of AB'], ['the line that splits an angle into two equal angles', 'the angle bisector'], ['the shortest path from a point to a straight line', 'the perpendicular from the point to the line'], ['all the points the same distance from two lines that meet at a corner', 'the angle bisector']];
  K.gen({ id: 'y8Constructions', objective: 'Y8-G-04', title: 'Constructions and shortest distance',
    make: function (r, L) {
      if (L === 2) { var px = r.int(-6, 6), py = r.int(3, 9), line = r.pick(['x-axis', 'y = 1', 'y = -2']), lv = line === 'x-axis' ? 0 : +line.split('= ')[1]; return K.int('What is the shortest distance from the point (' + neg(px) + ', ' + py + ') to the line <b>' + nm(line) + '</b>?', py - lv, { suffix: 'units', hint: 'The shortest distance to a line is along the perpendicular, straight down to the line.', params: { py: py, lv: lv }, sol: ['Go straight down (perpendicular to the line): ' + py + ' − ' + neg(lv) + ' = ' + (py - lv) + ' units.'] }); }
      var c = r.pick(L === 1 ? CONS.slice(0, 2) : CONS.slice(2));
      return K.choice('Which construction gives ' + c[0] + '?', ['the perpendicular bisector of AB', 'the angle bisector', 'the perpendicular from the point to the line'], c[1], { hint: 'A perpendicular bisector cuts a line in half at right angles. An angle bisector cuts an angle in half.', params: { c: c[0] }, sol: ['That is ' + c[1] + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.c) return CONS.some(function (x) { return x[0] === p.c && x[1] === q.check.value; }); return q.check.value + p.lv === p.py; } });

  // ================= DATA (Lantern Fish Lab) =================
  K.gen({ id: 'y8Venn', objective: 'Y8-P-01', title: 'Venn diagrams',
    make: function (r, L) {
      var n = { a: r.int(2, 14), both: r.int(1, 9), b: r.int(2, 14), out: r.int(1, 8) }, tot = n.a + n.both + n.b + n.out, names = r.pick([['Tea', 'Coffee'], ['Football', 'Netball'], ['Dog', 'Cat']]);
      if (L === 1) { var ask = r.pick(['A', 'B']); return K.int('The Venn diagram shows what ' + tot + ' students like. How many like <b>' + (ask === 'A' ? names[0] : names[1]) + '</b>?', ask === 'A' ? n.a + n.both : n.b + n.both, { visual: V.venn(n, names), hint: 'Include the middle part where the circles overlap.', params: { n: n, ask: ask }, sol: ['Add the numbers inside the ' + (ask === 'A' ? names[0] : names[1]) + ' circle: ' + (ask === 'A' ? n.a : n.b) + ' + ' + n.both + ' = ' + (ask === 'A' ? n.a + n.both : n.b + n.both) + '.'] }); }
      if (L === 2) { var q2 = r.pick(['union', 'notA']); return K.int(q2 === 'union' ? 'How many students like <b>' + names[0] + ' or ' + names[1] + '</b> (or both)?' : 'How many students do <b>not</b> like ' + names[0] + '?', q2 === 'union' ? n.a + n.both + n.b : n.b + n.out, { visual: V.venn(n, names), hint: q2 === 'union' ? 'Add everything inside the two circles.' : 'Add everything outside the ' + names[0] + ' circle.', params: { n: n, ask: q2 }, sol: [q2 === 'union' ? n.a + ' + ' + n.both + ' + ' + n.b + ' = ' + (n.a + n.both + n.b) + '.' : n.b + ' + ' + n.out + ' = ' + (n.b + n.out) + '.'] }); }
      var likeA = n.a + n.both, likeB = n.b + n.both;
      return K.int(tot + ' students were asked. ' + likeA + ' like ' + names[0] + ', ' + likeB + ' like ' + names[1] + ', and ' + n.out + ' like neither. How many like <b>both</b>?', n.both, { visual: V.venn({ a: '', both: '?', b: '', out: n.out }, names), hint: 'Students in at least one circle: ' + tot + ' − ' + n.out + ' = ' + (tot - n.out) + '. Compare with ' + likeA + ' + ' + likeB + '.', params: { tot: tot, likeA: likeA, likeB: likeB, out: n.out, ask: 'both' }, sol: ['In at least one circle: ' + (tot - n.out) + '.', likeA + ' + ' + likeB + ' = ' + (likeA + likeB) + ', which counts "both" twice.', 'Both: ' + (likeA + likeB) + ' − ' + (tot - n.out) + ' = ' + n.both + '.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; if (p.ask === 'both') return p.likeA + p.likeB - v + p.out === p.tot; var n = p.n; if (p.ask === 'A') return v === n.a + n.both; if (p.ask === 'B') return v === n.b + n.both; if (p.ask === 'union') return v === n.a + n.b + n.both; return v === n.b + n.out; } });

  K.gen({ id: 'y8Scatter', objective: 'Y8-S-01', title: 'Scatter graphs and correlation',
    make: function (r, L) {
      var kind = r.pick(['positive', 'negative', 'no']), pts = [];
      for (var i = 0; i < 12; i++) { var x = r.int(1, 19), y = kind === 'positive' ? x * 0.9 + r.int(-3, 3) + 2 : kind === 'negative' ? 20 - x * 0.9 + r.int(-3, 3) : r.int(2, 18); pts.push({ x: x, y: Math.max(1, Math.min(19, y)) }); }
      if (L === 1) return K.choice('What type of correlation does this scatter graph show?', ['positive', 'negative', 'no'].map(function (k) { return { value: k, label: k + ' correlation' }; }), kind, { visual: V.plot({ x: [0, 20], y: [0, 20], gx: 2, gy: 2, points: pts, cross: true }), hint: 'Positive: going up to the right. Negative: going down. No correlation: no pattern.', params: { pts: pts, kind: kind }, sol: [kind === 'no' ? 'The points show no pattern: no correlation.' : 'The points go ' + (kind === 'positive' ? 'up' : 'down') + ' from left to right: ' + kind + ' correlation.'] });
      var m = r.pick([2, 3, 4]), c = r.int(5, 20), data = [];
      for (i = 0; i < 10; i++) { var hx = r.int(1, 10); data.push({ x: hx, y: m * hx + c + r.int(-3, 3) }); }
      if (L === 2) { var xq = r.int(2, 9) + 0.5, est = m * xq + c;
        return K.range('The graph shows hours of revision (x) and test score (y), with a line of best fit. Use the line to estimate the score for ' + xq + ' hours of revision.', est - 2, est + 2, { visual: V.plot({ x: [0, 11], y: [0, 60], gy: 5, points: data, cross: true, fns: [{ f: function (x) { return m * x + c; } }], xlabel: 'Hours of revision', ylabel: 'Score' }), hint: 'Go up from ' + xq + ' on the x-axis to the line, then across to the y-axis.', params: { m: m, c: c, xq: xq }, sol: ['Reading from the line at x = ' + xq + ' gives about ' + est + '.', 'Answers close to this (from ' + (est - 2) + ' to ' + (est + 2) + ') are accepted.'] }); }
      return K.choice('A line of best fit is drawn for revision hours from 1 to 10. Which estimate is <b>least reliable</b>?', [{ value: 'out', label: 'the score for 25 hours of revision' }, { value: 'in', label: 'the score for 6 hours of revision' }], 'out', { hint: 'Is the value inside or outside the data you collected?', params: {}, sol: ['25 hours is far outside the data (1 to 10 hours). Estimating outside the data (extrapolation) is unreliable.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.pts) { var n = p.pts.length, mx = p.pts.reduce(function (s, a) { return s + a.x; }, 0) / n, my = p.pts.reduce(function (s, a) { return s + a.y; }, 0) / n, sxy = 0, sxx = 0, syy = 0; p.pts.forEach(function (a) { sxy += (a.x - mx) * (a.y - my); sxx += (a.x - mx) * (a.x - mx); syy += (a.y - my) * (a.y - my); }); var rr = sxy / Math.sqrt(sxx * syy || 1); return p.kind === 'no' ? q.check.value === 'no' : q.check.value === (rr > 0 ? 'positive' : 'negative') && Math.abs(rr) > 0.5; }
      if (p.m) return +q.check.lo <= p.m * p.xq + p.c && +q.check.hi >= p.m * p.xq + p.c;
      return q.check.value === 'out';
    } });

  K.gen({ id: 'y8Grouped', objective: 'Y8-S-02', title: 'Grouped frequency tables',
    make: function (r, L) {
      var w = r.pick([5, 10]), start = r.pick([0, 10, 20]), classes = [0, 1, 2, 3, 4].map(function (i) { return [start + i * w, start + (i + 1) * w]; }), freq = classes.map(function () { return r.int(1, 12); });
      var label = function (c) { return c[0] + ' < x ≤ ' + c[1]; }, vis = V.table(['Time, x (minutes)', 'Frequency'], classes.map(function (c, i) { return [label(c), String(freq[i])]; }));
      var maxF = Math.max.apply(null, freq); if (freq.filter(function (f) { return f === maxF; }).length > 1) { freq[freq.indexOf(maxF)]++; maxF++; }
      if (K.sum(freq) % 2 === 0) { freq[freq.indexOf(maxF)]++; maxF++; } // an odd total keeps the median inside one class
      vis = V.table(['Time, x (minutes)', 'Frequency'], classes.map(function (c, i) { return [label(c), String(freq[i])]; }));
      if (L === 1) return K.choice('The table shows how long some students took to get to school. Which is the <b>modal class</b>?', classes.map(label), label(classes[freq.indexOf(maxF)]), { visual: vis, hint: 'The modal class has the highest frequency.', params: { freq: freq, classes: classes, k: 'mode' }, sol: ['The highest frequency is ' + maxF + ', in the class ' + label(classes[freq.indexOf(maxF)]) + '.'] });
      var N = K.sum(freq);
      if (L === 2) { var fx = classes.map(function (c, i) { return (c[0] + c[1]) / 2 * freq[i]; }), est = A.div(Q(K.sum(fx.map(function (v) { return v * 2; }))), Q(2 * N));
        return K.approx('Work out an <b>estimate</b> for the mean time. Give your answer to 1 decimal place.', A.qText(est), { dp: 1 }, { calc: true, visual: vis, hint: 'Use the midpoint of each class. Multiply each midpoint by its frequency, add them, then divide by the total frequency.', params: { freq: freq, classes: classes, k: 'mean' }, sol: ['Midpoints: ' + classes.map(function (c) { return (c[0] + c[1]) / 2; }).join(', ') + '.', 'Total of midpoint × frequency: ' + K.sum(fx) + '. Total frequency: ' + N + '.', K.sum(fx) + ' ÷ ' + N + ' = ' + A.round(A.qText(est), { dp: 1 }) + '.'] }); }
      var pos = (N + 1) / 2, cum = 0, mi = 0; for (var i = 0; i < 5; i++) { cum += freq[i]; if (cum >= pos) { mi = i; break; } }
      return K.choice('Which class contains the <b>median</b>?', classes.map(label), label(classes[mi]), { visual: vis, hint: 'There are ' + N + ' values. The median is the ' + (N % 2 ? ((N + 1) / 2) + 'th' : 'mean of the ' + N / 2 + 'th and ' + (N / 2 + 1) + 'th') + ' value. Add up the frequencies until you pass it.', params: { freq: freq, classes: classes, k: 'median' }, sol: ['Running totals: ' + freq.map(function (f, j) { return K.sum(freq.slice(0, j + 1)); }).join(', ') + '.', 'The median is in ' + label(classes[mi]) + '.'] });
    },
    verify: function (q) {
      var p = q.params, lab = function (c) { return c[0] + ' < x ≤ ' + c[1]; };
      if (p.k === 'mode') { var best = 0; p.freq.forEach(function (f, i) { if (f > p.freq[best]) best = i; }); return q.check.value === lab(p.classes[best]); }
      if (p.k === 'mean') { var t = 0, n = 0; p.freq.forEach(function (f, i) { t += f * (p.classes[i][0] + p.classes[i][1]) / 2; n += f; }); return Math.abs(parseFloat(A.round(q.check.value, { dp: 1 })) - Math.round(t / n * 10) / 10) < 1e-9; }
      var list = []; p.freq.forEach(function (f, i) { for (var k = 0; k < f; k++) list.push(i); }); var N = list.length, mid = N % 2 ? list[(N - 1) / 2] : list[N / 2 - 1] === list[N / 2] ? list[N / 2] : list[N / 2]; return q.check.value === lab(p.classes[mid]);
    } });
})(typeof window !== 'undefined' ? window : globalThis);
