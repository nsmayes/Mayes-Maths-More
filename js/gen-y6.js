/* Learn with Pip — Year 6 question generators (the SATs year). Numbers up to 10,000,000; decimals to 3 places.
   Long multiplication and long division are 2-mark questions with a method mark, as in the KS2 arithmetic paper.
   Each generator's verify() works the answer out a different way from make(). Levels: 1 getting there, 2 expected, 3 greater depth. */
(function (G) {
  'use strict';
  var OM = G.OM, K = OM.kit, V = OM.V, S = K.S, fmt = OM.fmt, F = K.fr;
  function neg(n) { return n < 0 ? '−' + fmt(-n) : fmt(n); }
  function dstr(th) { return K.fromTh(th); }
  function fd(th) { var parts = dstr(th).split('.'); return (th < 0 ? '−' : '') + fmt(Math.abs(+parts[0])) + (parts[1] ? '.' + parts[1] : ''); }
  function opts(r, correct, wrongs) { var seen = {}, out = [correct].concat(wrongs).filter(function (x) { var k = String(x); if (seen[k]) return false; seen[k] = 1; return true; }); return r.shuffle(out).map(function (x) { return { value: String(x), label: typeof x === 'number' ? fmt(x) : String(x) }; }); }
  function simp(n, d) { var g = OM.gcd(n, d); return [n / g, d / g]; }
  var PLACES = ['millions', 'hundred thousands', 'ten thousands', 'thousands', 'hundreds', 'tens', 'ones'];

  // ================= NUMBER AND PLACE VALUE =================
  K.gen({ id: 'y6PlaceValue', objective: 'Y6-NPV-01', title: 'Numbers to 10,000,000',
    make: function (r, L) {
      var n = r.int(1000000, 9999999), ds = String(n).split('').map(Number);
      if (L === 1) { var pos = r.int(0, 6); if (ds[pos] === 0) pos = 0; var val = ds[pos] * Math.pow(10, 6 - pos);
        return K.int('What is the value of the digit <b>' + ds[pos] + '</b> in <b>' + fmt(n) + '</b>?', val, { hint: 'Name the column: millions, hundred thousands, ten thousands…', params: { n: n, pos: pos }, sol: ['The ' + ds[pos] + ' is in the ' + PLACES[pos] + ' column, so it is worth ' + fmt(val) + '.'] }); }
      if (L === 2) { var w = K.toWords(n); return K.int('Write in digits: <b>' + w + '</b>', n, { hint: 'Millions first, then thousands, then the rest. Use zeros for empty columns.', params: { n: n, w: w }, sol: ['"' + w + '" = ' + fmt(n) + '.'] }); }
      var base = Math.floor(n / 100000) * 100000, nums = r.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 4).map(function (k) { return base + k * 10000 + r.int(0, 9999); });
      var sorted = nums.slice().sort(function (a, b) { return a - b; });
      return K.order('Put these in order, starting with the <b>smallest</b>.', nums.map(function (x) { return { value: String(x), label: fmt(x) }; }), sorted.map(String), { hint: 'They all start the same: compare the ten thousands.', params: { nums: nums }, answer: sorted.map(fmt).join(', '), sol: ['Smallest first: ' + sorted.map(fmt).join(', ') + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.pos !== undefined) return q.check.value === +(String(p.n)[p.pos] + '0'.repeat(6 - p.pos)); if (p.w) return K.fromWords(p.w) === q.check.value; return p.nums.map(function (x) { return String(x).padStart(8, '0'); }).sort().map(Number).join() === q.check.order.join(); } });

  K.gen({ id: 'y6Rounding', objective: 'Y6-NPV-02', title: 'Rounding to any degree of accuracy',
    make: function (r, L) {
      var n = r.int(100000, 9999999), to = L === 1 ? r.pick([100, 1000, 10000]) : L === 2 ? r.pick([10000, 100000]) : r.pick([1000000, 100000]);
      var ans = Math.round(n / to) * to;
      return K.int('Round <b>' + fmt(n) + '</b> to the nearest <b>' + fmt(to) + '</b>.', ans, { hint: 'Look at the digit just right of the ' + fmt(to) + 's column.', params: { n: n, to: to },
        sol: ['It lies between ' + fmt(Math.floor(n / to) * to) + ' and ' + fmt(Math.floor(n / to) * to + to) + '.', 'The next digit is ' + Math.floor((n % to) / (to / 10)) + ', so it rounds to ' + fmt(ans) + '.'] });
    },
    verify: function (q) { var p = q.params, s = String(p.n), keep = s.length - String(p.to).length + 1, next = +s[keep], head = +s.slice(0, keep) || 0; return q.check.value === (next >= 5 ? head + 1 : head) * p.to; } });

  K.gen({ id: 'y6Negative', objective: 'Y6-NPV-03', title: 'Negative numbers and intervals across 0',
    make: function (r, L) {
      var a = -r.int(2, L === 3 ? 40 : 15), b = r.int(1, L === 3 ? 30 : 12);
      if (L === 1) return K.int('What is the difference between <b>' + neg(a) + '</b> and <b>' + b + '</b>?', b - a, { hint: 'Count from ' + neg(a) + ' up to 0, then on to ' + b + '.', params: { a: a, b: b, k: 'diff' },
        visual: V.numberLine({ min: Math.min(a, -2) - 1, max: b + 1, step: 1, labelEvery: a < -10 ? 5 : 2, format: neg, hops: [{ from: a, to: 0, label: String(-a) }, { from: 0, to: b, label: String(b) }] }), sol: [neg(a) + ' to 0 is ' + (-a) + '. 0 to ' + b + ' is ' + b + '.', (-a) + ' + ' + b + ' = ' + (b - a) + '.'] });
      if (L === 2) { var t = r.int(-8, 6), fall = r.int(t + 3, t + 18); return K.int('At noon it was ' + neg(t) + '°C. By midnight the temperature had fallen by ' + (fall - t) + ' degrees. What was the temperature at midnight?', t - (fall - t), { keys: 'signed', suffix: '°C', hint: 'Count back from ' + neg(t) + '.', params: { a: t, b: fall - t, k: 'fall' },
        sol: [neg(t) + ' − ' + (fall - t) + ' = ' + neg(t - (fall - t)) + '°C.'] }); }
      return K.int('A submarine is at ' + neg(a * 10) + ' m (below sea level). A helicopter is ' + b * 10 + ' m above sea level. How far apart are they vertically?', b * 10 - a * 10, { suffix: 'm', hint: 'Add the distance below sea level to the distance above it.', params: { a: a * 10, b: b * 10, k: 'diff' }, sol: [(-a * 10) + ' + ' + b * 10 + ' = ' + (b * 10 - a * 10) + ' m.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'diff') return K.addCheck(-p.a, p.b) === q.check.value; var x = p.a; for (var i = 0; i < p.b; i++) x--; return x === q.check.value; } });

  K.gen({ id: 'y6NumProblems', objective: 'Y6-NPV-04', title: 'Number problems',
    make: function (r, L) {
      if (L === 1) { var ds = r.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 7), smallest = ds.slice().sort(); if (smallest[0] === 0) { smallest[0] = smallest[1]; smallest[1] = 0; }
        return K.int('Use each digit once: <b>' + ds.join(', ') + '</b>. What is the <b>smallest</b> 7-digit number you can make?', +smallest.join(''), { hint: 'The first digit cannot be 0.', params: { ds: ds }, sol: ['Smallest digit that is not 0 first, then the 0, then the rest in order: ' + fmt(+smallest.join('')) + '.'] }); }
      var low = r.int(-12, -2), high = r.int(3, 15), steps = r.pick([2, 3, 4]);
      if ((high - low) % steps) high += steps - (high - low) % steps;
      return K.int('A number line goes from ' + neg(low) + ' to ' + neg(high) + ' in ' + steps + ' equal jumps. How big is each jump?', (high - low) / steps, { hint: 'Find the total distance, then divide by the number of jumps.', params: { low: low, high: high, steps: steps },
        sol: ['Distance: ' + neg(high) + ' − ' + neg(low) + ' = ' + (high - low) + '.', (high - low) + ' ÷ ' + steps + ' = ' + (high - low) / steps + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.ds) { var best = Infinity; (function go(a, rest) { if (!rest.length) { if (a[0] !== 0) best = Math.min(best, +a.join('')); return; } rest.forEach(function (d, i) { go(a.concat([d]), rest.slice(0, i).concat(rest.slice(i + 1))); }); })([], p.ds); return best === q.check.value; } return K.mulCheck(q.check.value, p.steps) === p.high - p.low; } });

  // ================= CALCULATION =================
  // long multiplication: 2 marks, 1 for the formal method with no more than one arithmetic error (KS2 convention)
  K.gen({ id: 'y6LongMult', objective: 'Y6-C-01', title: 'Long multiplication',
    make: function (r, L) {
      var a = L === 1 ? r.int(24, 99) : L === 2 ? r.int(120, 999) : r.int(1200, 9999), b = r.int(12, L === 3 ? 89 : 49), o = b % 10, t = b - o;
      var p1 = a * o, p2 = a * t, ans = a * b;
      var plan = [{ op: '*', a: { g: a }, b: { g: o } }, { op: '*', a: { g: a }, b: { g: t, alt: [t / 10] } }, { op: '+', a: { s: 0 }, b: { s: 1 } }];
      var plan2 = [{ op: '*', a: { g: o }, b: { g: a } }, { op: '*', a: { g: t, alt: [t / 10] }, b: { g: a } }, { op: '+', a: { s: 0 }, b: { s: 1 } }];
      var ex = [fmt(a) + ' × ' + o + ' = ' + fmt(p1), fmt(a) + ' × ' + t + ' = ' + fmt(p2), fmt(p1) + ' + ' + fmt(p2) + ' = ' + fmt(ans)];
      return { prompt: 'Use long multiplication: <b>' + fmt(a) + ' × ' + b + '</b>. Show your method.', marks: 2, input: { type: 'working', keys: 'working' },
        check: { kind: 'working', final: { kind: 'int', value: ans }, plans: [plan, plan2], plan: plan, exampleLines: ex }, hint: 'Multiply by ' + o + ', then by ' + t + ', then add the two answers.', params: { a: a, b: b },
        solution: [S('Multiply by the ones: ' + ex[0] + '.'), S('Multiply by the tens: ' + ex[1] + ' (write a 0 first, then multiply by ' + t / 10 + ').'), S('Add: ' + ex[2] + '.')] };
    },
    verify: function (q) { var p = q.params; return K.mulCheck(p.a, p.b) === q.check.final.value; } });

  // long division: 2 marks. Exact answers use the working box (method mark); remainders as a whole number or as a fraction
  K.gen({ id: 'y6LongDiv', objective: 'Y6-C-02', title: 'Long division',
    make: function (r, L) {
      var d = r.int(12, L === 1 ? 25 : 48), qn = r.int(L === 1 ? 12 : 21, Math.min(L === 3 ? 299 : 99, Math.floor(9000 / d))), rem = L === 1 ? 0 : r.int(1, d - 1), n = d * qn + rem;
      var hint = 'How many ' + d + 's go into the first part of ' + fmt(n) + '? Multiply, subtract, bring down the next digit.';
      var sol = [S('Divide step by step: ' + fmt(n) + ' ÷ ' + d + ' = ' + fmt(qn) + (rem ? ' remainder ' + rem : '') + '.'), S('Check: ' + d + ' × ' + fmt(qn) + (rem ? ' + ' + rem : '') + ' = ' + fmt(n) + ' ✓')];
      if (L === 1) {
        var plan = [{ op: '/', a: { g: n }, b: { g: d } }], plan2 = [{ op: '*', a: { g: d }, b: { g: qn } }];
        return { prompt: 'Use long division: <b>' + fmt(n) + ' ÷ ' + d + '</b>. Show your method.', marks: 2, input: { type: 'working', keys: 'working' },
          check: { kind: 'working', final: { kind: 'int', value: qn }, plans: [plan, plan2], plan: plan, exampleLines: [fmt(n) + ' ÷ ' + d + ' = ' + fmt(qn), d + ' × ' + fmt(qn) + ' = ' + fmt(n)] }, hint: hint, params: { n: n, d: d, mode: 'exact' }, solution: sol };
      }
      if (L === 2) return K.multi('Use long division: <b>' + fmt(n) + ' ÷ ' + d + '</b>. Give the remainder as a whole number.', '{0} remainder {1}', [{ kind: 'int', value: qn }, { kind: 'int', value: rem }], { marks: 2, hint: hint, params: { n: n, d: d, mode: 'rem' }, answer: fmt(qn) + ' r ' + rem, sol: sol });
      var sr = simp(rem, d);
      return K.frac('Use long division: <b>' + fmt(n) + ' ÷ ' + d + '</b>. Give the remainder as a fraction, so your answer is a mixed number.', n, d, { mixed: true, marks: 2, hint: hint, params: { n: n, d: d, mode: 'frac' }, answer: OM.frac(sr[0], sr[1], qn),
        sol: sol.concat([S('The remainder is ' + rem + ' out of ' + d + ': ' + F(rem, d) + (sr[1] !== d ? ' = ' + F(sr[0], sr[1]) : '') + '. The answer is ' + F(sr[0], sr[1], qn) + '.')]) });
    },
    verify: function (q) {
      var p = q.params, c = 0, left = p.n; while (left >= p.d) { left -= p.d; c++; }
      if (p.mode === 'exact') return left === 0 && q.check.final.value === c;
      if (p.mode === 'rem') return q.check.parts[0].value === c && q.check.parts[1].value === left && left > 0;
      return q.check.n * p.d === p.n * q.check.d && left > 0;
    } });

  K.gen({ id: 'y6ShortDiv', objective: 'Y6-C-03', title: 'Short division with remainders in context',
    make: function (r, L) {
      var d = r.int(11, 25), n = r.int(150, 999);
      while (n % d === 0) n++;
      var qn = Math.floor(n / d), rem = n % d, ctx = r.pick([['seats', 'rows of', 'rows are needed', 'up'], ['eggs', 'boxes of', 'full boxes can be filled', 'down']]);
      if (L === 1) return K.multi('Use short division: <b>' + n + ' ÷ ' + d + '</b>', '{0} remainder {1}', [{ kind: 'int', value: qn }, { kind: 'int', value: rem }], { params: { n: n, d: d, k: 'rem' }, hint: 'Use multiples of ' + d + '.', answer: qn + ' r ' + rem, sol: [n + ' ÷ ' + d + ' = ' + qn + ' remainder ' + rem + '.'] });
      var up = ctx[3] === 'up';
      return K.int(up ? n + ' people need seats. Each row has ' + d + ' seats. How many rows are needed?' : 'There are ' + n + ' eggs. They go in boxes of ' + d + '. How many full boxes can be filled?', up ? qn + 1 : qn,
        { hint: 'Divide, then think about what the remainder means.', params: { n: n, d: d, k: up ? 'up' : 'down' }, sol: [n + ' ÷ ' + d + ' = ' + qn + ' r ' + rem + '.', up ? 'The ' + rem + ' extra people need another row: ' + (qn + 1) + '.' : 'The ' + rem + ' left over do not fill a box: ' + qn + '.'] });
    },
    verify: function (q) { var p = q.params, c = 0, left = p.n; while (left >= p.d) { left -= p.d; c++; } if (p.k === 'rem') return q.check.parts[0].value === c && q.check.parts[1].value === left; return q.check.value === (p.k === 'up' ? c + 1 : c); } });

  K.gen({ id: 'y6Mental', objective: 'Y6-C-04', title: 'Mental calculation',
    make: function (r, L) {
      if (L === 1) { var a = r.int(2, 9) * 1000, b = r.int(2, 9); return K.int('Work out in your head: <b>' + fmt(a) + ' × ' + b + '</b>', a * b, { hint: 'Use ' + a / 1000 + ' × ' + b + '.', params: { k: 'mul', a: a, b: b }, sol: [a / 1000 + ' × ' + b + ' = ' + a / 1000 * b + ', so the answer is ' + fmt(a * b) + '.'] }); }
      if (L === 2) { var big = r.int(120, 990) * 1000, sm = r.int(11, 99) * 1000 - r.pick([1, 10, 100]); return K.int('Work out in your head: <b>' + fmt(big) + ' − ' + fmt(sm) + '</b>', big - sm, { hint: 'Subtract a round number, then adjust.', params: { k: 'sub', a: big, b: sm }, sol: [fmt(big) + ' − ' + fmt(sm) + ' = ' + fmt(big - sm) + '.'] }); }
      var x = r.int(12, 25), y = r.pick([4, 5, 20, 25]), z = r.int(2, 9) * 10 + r.int(1, 9);
      return K.int('Work out in your head: <b>' + x + ' × ' + y + ' + ' + z + '</b>', x * y + z, { hint: 'Multiply first, then add.', params: { k: 'mix', a: x, b: y, c: z }, sol: [x + ' × ' + y + ' = ' + x * y + '.', x * y + ' + ' + z + ' = ' + (x * y + z) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'mul') return K.mulCheck(p.a, p.b) === q.check.value; if (p.k === 'sub') return K.subCheck(p.a, p.b) === q.check.value; return K.addCheck(K.mulCheck(p.a, p.b), p.c) === q.check.value; } });

  K.gen({ id: 'y6FactorsPrimes', objective: 'Y6-C-05', title: 'Common factors, common multiples and primes',
    make: function (r, L) {
      if (L === 1) { var pr = r.pick([[12, 30], [18, 24], [16, 40], [21, 35], [36, 48], [45, 60]]), h = OM.gcd(pr[0], pr[1]); return K.int('What is the <b>highest common factor</b> of ' + pr[0] + ' and ' + pr[1] + '?', h, { hint: 'List the factors of each number.', params: { a: pr[0], b: pr[1], k: 'hcf' }, sol: ['The biggest number that divides both exactly is ' + h + '.'] }); }
      if (L === 2) { var pp = r.pick([[4, 6], [6, 8], [6, 9], [8, 12], [10, 15], [9, 12]]), l = pp[0] * pp[1] / OM.gcd(pp[0], pp[1]); return K.int('What is the <b>lowest common multiple</b> of ' + pp[0] + ' and ' + pp[1] + '?', l, { hint: 'List the multiples of each until one appears in both lists.', params: { a: pp[0], b: pp[1], k: 'lcm' }, sol: ['The first number in both times tables is ' + l + '.'] }); }
      var lo = r.int(20, 80), primes = []; for (var x = lo; x <= lo + 10; x++) if (K.isPrime(x)) primes.push(x);
      return K.int('How many <b>prime numbers</b> are there from ' + lo + ' to ' + (lo + 10) + '?', primes.length, { hint: 'Test each number: does 2, 3, 5 or 7 divide it?', params: { lo: lo, k: 'count' }, sol: ['The primes are: ' + (primes.join(', ') || 'none') + '.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value, i; if (p.k === 'hcf') { for (i = v + 1; i <= Math.min(p.a, p.b); i++) if (p.a % i === 0 && p.b % i === 0) return false; return p.a % v === 0 && p.b % v === 0; } if (p.k === 'lcm') { for (i = 1; i < v; i++) if (i % p.a === 0 && i % p.b === 0) return false; return v % p.a === 0 && v % p.b === 0; } var c = 0; for (i = p.lo; i <= p.lo + 10; i++) { var f = 0; for (var j = 1; j <= i; j++) if (i % j === 0) f++; if (f === 2) c++; } return c === v; } });

  K.gen({ id: 'y6Order', objective: 'Y6-C-06', title: 'Order of operations',
    make: function (r, L) {
      var a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9), d = r.int(10, 40);
      if (L === 1) return K.int('Work out <b>' + d + ' + ' + a + ' × ' + b + '</b>.', d + a * b, { hint: 'Multiplication comes before addition.', params: { e: d + '+' + a + '*' + b }, sol: [a + ' × ' + b + ' = ' + a * b + ' first.', d + ' + ' + a * b + ' = ' + (d + a * b) + '.'] });
      if (L === 2) return K.int('Work out <b>(' + d + ' − ' + a + ') × ' + b + '</b>.', (d - a) * b, { hint: 'Brackets first.', params: { e: '(' + d + '-' + a + ')*' + b }, sol: ['Brackets first: ' + d + ' − ' + a + ' = ' + (d - a) + '.', (d - a) + ' × ' + b + ' = ' + (d - a) * b + '.'] });
      var e = a * b * c, f = r.int(2, 6), g = r.int(2, 6), v = e / c - f * g;
      return K.int('Work out <b>' + e + ' ÷ ' + c + ' − ' + f + ' × ' + g + '</b>.', v, { keys: 'signed', hint: 'Do × and ÷ before −.', params: { e: e + '/' + c + '-' + f + '*' + g },
        sol: [e + ' ÷ ' + c + ' = ' + e / c + ' and ' + f + ' × ' + g + ' = ' + f * g + '.', e / c + ' − ' + f * g + ' = ' + neg(v) + '.'] });
    },
    // independent: evaluate the expression with the working-line parser (it follows the order of operations)
    verify: function (q) { var steps = OM.parseWorkingLine(q.params.e); return steps.length > 0 && steps[steps.length - 1].result === q.check.value; } });

  K.gen({ id: 'y6MultiStep', objective: 'Y6-C-07', title: 'Multi-step adding and subtracting problems',
    make: function (r, L) {
      var a = r.int(120000, 480000), b = r.int(50000, 250000), c = r.int(20000, 120000), t = r.int(0, 1), name = r.pick(['A charity', 'A school', 'A city library', 'A football club']);
      var ans = t === 0 ? a + b - c : a - b - c; if (ans <= 0) { a += b + c; ans = t === 0 ? a + b - c : a - b - c; }
      var text = t === 0 ? name + ' raised £' + fmt(a) + ' last year and £' + fmt(b) + ' this year. It spent £' + fmt(c) + '. How much money is left?' : name + ' had ' + fmt(a) + ' visitors. ' + fmt(b) + ' came in the spring and ' + fmt(c) + ' in the summer. How many came at other times?';
      var plan = t === 0 ? [{ op: '+', a: { g: a }, b: { g: b } }, { op: '-', a: { s: 0 }, b: { g: c } }] : [{ op: '-', a: { g: a }, b: { g: b } }, { op: '-', a: { s: 0 }, b: { g: c } }];
      var plan2 = t === 0 ? [{ op: '-', a: { g: a }, b: { g: c } }, { op: '+', a: { s: 0 }, b: { g: b } }] : [{ op: '+', a: { g: b }, b: { g: c } }, { op: '-', a: { g: a }, b: { s: 0 } }];
      var ex = t === 0 ? [fmt(a) + ' + ' + fmt(b) + ' = ' + fmt(a + b), fmt(a + b) + ' − ' + fmt(c) + ' = ' + fmt(ans)] : [fmt(a) + ' − ' + fmt(b) + ' = ' + fmt(a - b), fmt(a - b) + ' − ' + fmt(c) + ' = ' + fmt(ans)];
      if (L === 1) return K.int(text, ans, { prefix: t === 0 ? '£' : undefined, hint: 'Do it in two steps.', params: { a: a, b: b, c: c, t: t }, sol: ex });
      return { prompt: text + ' Show your method.', marks: 2, input: { type: 'working', keys: 'working' }, check: { kind: 'working', final: { kind: 'int', value: ans }, plans: [plan, plan2], plan: plan, exampleLines: ex },
        hint: 'What do you need to work out first?', params: { a: a, b: b, c: c, t: t }, solution: ex.map(function (l) { return S(l + '.'); }) };
    },
    verify: function (q) { var p = q.params, v = q.check.final ? q.check.final.value : q.check.value; return v === (p.t === 0 ? K.subCheck(K.addCheck(p.a, p.b), p.c) : K.subCheck(K.subCheck(p.a, p.b), p.c)); } });

  K.gen({ id: 'y6FourOpsProblems', objective: 'Y6-C-08', title: 'Problems with all four operations',
    make: function (r, L) {
      var name = r.pick(OM.NAMES);
      if (L === 1) { var t = r.int(12, 48), each = r.int(15, 45); return K.int('A school orders ' + t + ' boxes of pencils. Each box holds ' + each + ' pencils. How many pencils is that?', t * each, { hint: 'Multiply.', params: { a: t, b: each, k: 'mul' }, sol: [t + ' × ' + each + ' = ' + fmt(t * each) + '.'] }); }
      if (L === 2) { var bus = r.int(45, 57), kids = r.int(300, 900); return K.int(kids + ' children go on a trip. Each coach holds ' + bus + ' children. How many coaches are needed?', Math.ceil(kids / bus), { hint: 'Divide, then round up for any children left over.', params: { a: kids, b: bus, k: 'ceil' }, sol: [kids + ' ÷ ' + bus + ' = ' + Math.floor(kids / bus) + ' r ' + kids % bus + '.', 'Round up: ' + Math.ceil(kids / bus) + ' coaches.'] }); }
      var price = r.int(4, 12), n = r.int(15, 40), paid = Math.ceil(price * n / 50) * 50 + 50;
      return K.int(name + ' buys ' + n + ' tickets at £' + price + ' each and pays with £' + paid + '. How much change?', paid - price * n, { prefix: '£', hint: 'Find the total cost, then subtract from £' + paid + '.', params: { a: price, b: n, paid: paid, k: 'change' }, sol: [n + ' × £' + price + ' = £' + price * n + '.', '£' + paid + ' − £' + price * n + ' = £' + (paid - price * n) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'mul') return K.mulCheck(p.a, p.b) === q.check.value; if (p.k === 'ceil') { var c = 0, left = p.a; while (left > 0) { left -= p.b; c++; } return c === q.check.value; } return K.subCheck(p.paid, K.mulCheck(p.a, p.b)) === q.check.value; } });

  K.gen({ id: 'y6Estimate', objective: 'Y6-C-09', title: 'Estimating to check',
    make: function (r, L) {
      var a = r.int(21, 98), b = r.int(21, 98), est = Math.round(a / 10) * 10 * Math.round(b / 10) * 10, exact = a * b;
      if (L < 3) return K.choice('Which is the best <b>estimate</b> for ' + a + ' × ' + b + '?', opts(r, est, [est * 10, Math.round(est / 10), est + 1000]), String(est), { hint: 'Round each number to the nearest 10.', params: { a: a, b: b, est: est },
        sol: [a + ' ≈ ' + Math.round(a / 10) * 10 + ' and ' + b + ' ≈ ' + Math.round(b / 10) * 10 + '.', Math.round(a / 10) * 10 + ' × ' + Math.round(b / 10) * 10 + ' = ' + fmt(est) + '.'] });
      var shown = r.chance(0.5) ? exact : exact * 10;
      return K.choice('Leo says ' + a + ' × ' + b + ' = ' + fmt(shown) + '. Use an estimate to decide: could he be right?', [{ value: 'yes', label: 'Yes, it is close to the estimate' }, { value: 'no', label: 'No, it is about 10 times too big' }], shown === exact ? 'yes' : 'no',
        { hint: 'Round both numbers and multiply.', params: { a: a, b: b, shown: shown }, sol: ['Estimate: about ' + fmt(est) + '.', shown === exact ? fmt(shown) + ' is close, so it could be right.' : fmt(shown) + ' is about 10 times too big.'] });
    },
    verify: function (q) { var p = q.params, e = Math.round(p.a / 10) * 10 * Math.round(p.b / 10) * 10; if (p.shown !== undefined) return q.check.value === (p.shown / e < 3 ? 'yes' : 'no'); return +q.check.value === e; } });

  // ================= FRACTIONS, DECIMALS AND PERCENTAGES =================
  K.gen({ id: 'y6Simplify', objective: 'Y6-F-01', title: 'Simplifying and common denominators',
    make: function (r, L) {
      var d = r.pick([4, 5, 6, 7, 8, 9, 10, 12]), n = r.int(1, d - 1), m = r.int(2, L === 1 ? 4 : 9);
      while (OM.gcd(n, d) !== 1) n = r.int(1, d - 1);
      if (L < 3) return K.frac('Simplify ' + F(n * m, d * m) + ' fully.', n, d, { form: 'simplest', hint: 'Divide the top and bottom by their highest common factor.', params: { n: n * m, d: d * m }, sol: ['The highest common factor of ' + n * m + ' and ' + d * m + ' is ' + m + '.', F(n * m, d * m) + ' = ' + F(n, d) + '.'] });
      var d2 = r.pick([3, 4, 5, 6]), n2 = r.int(1, d2 - 1), l = d * d2 / OM.gcd(d, d2);
      return K.frac('Write ' + F(n, d) + ' as a fraction with denominator <b>' + l + '</b>, so it can be compared with ' + F(n2, d2) + '.', n * l / d, l, { form: 'denominator', denom: l, hint: l + ' is a common multiple of ' + d + ' and ' + d2 + '.', params: { n: n, d: d, D: l },
        sol: [d + ' × ' + l / d + ' = ' + l + '.', F(n, d) + ' = ' + F(n * l / d, l) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.D) return q.check.n * p.d === p.n * q.check.d && q.check.d === p.D; return q.check.n * p.d === p.n * q.check.d && OM.gcd(q.check.n, q.check.d) === 1; } });

  K.gen({ id: 'y6FracCompare', objective: 'Y6-F-02', title: 'Comparing fractions, including > 1',
    make: function (r, L) {
      var list = [];
      while (list.length < (L === 1 ? 2 : 3)) { var d = r.pick([2, 3, 4, 5, 6, 8]), n = r.int(1, L === 3 ? 3 * d : d - 1); if (n % d === 0) continue; if (!list.some(function (f) { return f[0] * d === n * f[1]; })) list.push([n, d]); }
      var lab = function (f) { return f[0] > f[1] && L === 3 ? F(f[0] % f[1], f[1], Math.floor(f[0] / f[1])) : F(f[0], f[1]); };
      if (L === 1) { var big = list[0][0] * list[1][1] > list[1][0] * list[0][1] ? 0 : 1; return K.choice('Which fraction is <b>larger</b>?', list.map(function (f, i) { return { value: String(i), label: lab(f) }; }), String(big), { big: true, hint: 'Use a common denominator.', params: { list: list, k: 'max' }, sol: ['Change both to the same denominator, then compare numerators.'] }); }
      var ord = list.slice().sort(function (a, b) { return a[0] * b[1] - b[0] * a[1]; });
      return K.order('Order these from <b>smallest</b> to <b>largest</b>.', list.map(function (f) { return { value: f.join('/'), label: lab(f) }; }), ord.map(function (f) { return f.join('/'); }), { hint: 'Change mixed numbers to improper fractions, then use a common denominator.', params: { list: list, k: 'order' },
        answer: ord.map(function (f) { return f.join('/'); }).join(', '), sol: ['Compare using a common denominator (or as decimals).', 'Order: ' + ord.map(lab).join(', ') + '.'] });
    },
    verify: function (q) { var p = q.params, v = function (f) { return f[0] / f[1]; }; if (p.k === 'max') return +q.check.value === (v(p.list[0]) > v(p.list[1]) ? 0 : 1); return q.check.order.every(function (s, i, a) { if (!i) return true; var x = a[i - 1].split('/'), y = s.split('/'); return x[0] / x[1] < y[0] / y[1]; }); } });

  K.gen({ id: 'y6FracAddSub', objective: 'Y6-F-03', title: 'Adding and subtracting fractions',
    make: function (r, L) {
      var d1 = r.pick([2, 3, 4, 5, 6]), d2 = r.pick([3, 4, 5, 6, 8]); while (d2 === d1) d2 = r.pick([3, 4, 5, 6, 8]);
      var a = r.int(1, d1 - 1), b = r.int(1, d2 - 1), w1 = L === 3 ? r.int(1, 4) : 0, w2 = L === 3 ? r.int(0, w1 - 1 >= 0 ? w1 - 1 : 0) : 0, add = L === 1 ? true : r.chance(0.5);
      var A = w1 * d1 + a, B = w2 * d2 + b, l = d1 * d2 / OM.gcd(d1, d2), num = add ? A * l / d1 + B * l / d2 : A * l / d1 - B * l / d2;
      if (num <= 0) { add = true; num = A * l / d1 + B * l / d2; }
      return K.frac('Work out &nbsp;' + F(a, d1, w1 || '') + (add ? ' + ' : ' − ') + F(b, d2, w2 || ''), num, l, { mixed: num > l, hint: 'Use a common denominator: ' + l + '.', params: { A: A, d1: d1, B: B, d2: d2, add: add },
        sol: (L === 3 ? ['Change to improper fractions: ' + F(A, d1) + ' and ' + F(B, d2) + '.'] : []).concat(['Common denominator ' + l + ': ' + F(A * l / d1, l) + (add ? ' + ' : ' − ') + F(B * l / d2, l) + ' = ' + F(num, l) + '.']) });
    },
    verify: function (q) { var p = q.params, x = p.A * p.d2 + (p.add ? 1 : -1) * p.B * p.d1, den = p.d1 * p.d2; return q.check.n * den === x * q.check.d && x > 0; } });

  K.gen({ id: 'y6FracMult', objective: 'Y6-F-04', title: 'Multiplying fractions',
    make: function (r, L) {
      var d1 = r.int(2, L === 1 ? 5 : 9), d2 = r.int(2, L === 1 ? 5 : 9), n1 = L === 1 ? 1 : r.int(1, d1 - 1), n2 = L === 1 ? 1 : r.int(1, d2 - 1), s = simp(n1 * n2, d1 * d2);
      return K.frac('Work out &nbsp;' + F(n1, d1) + ' × ' + F(n2, d2) + '. Give your answer in its simplest form.', s[0], s[1], { form: 'simplest', hint: 'Multiply the numerators, multiply the denominators, then simplify.', params: { n1: n1, d1: d1, n2: n2, d2: d2 },
        sol: [n1 + ' × ' + n2 + ' = ' + n1 * n2 + ' and ' + d1 + ' × ' + d2 + ' = ' + d1 * d2 + ': ' + F(n1 * n2, d1 * d2) + '.'].concat(s[1] !== d1 * d2 ? ['Simplify: ' + F(s[0], s[1]) + '.'] : []) });
    },
    verify: function (q) { var p = q.params; return q.check.n * p.d1 * p.d2 === p.n1 * p.n2 * q.check.d && OM.gcd(q.check.n, q.check.d) === 1; } });

  K.gen({ id: 'y6FracDiv', objective: 'Y6-F-05', title: 'Dividing fractions by whole numbers',
    make: function (r, L) {
      var d = r.int(2, 8), n = L === 1 ? 1 : r.int(1, d - 1), w = r.int(2, 6), s = simp(n, d * w);
      return K.frac('Work out &nbsp;' + F(n, d) + ' ÷ ' + w + '. Give your answer in its simplest form.', s[0], s[1], { form: 'simplest', hint: 'Dividing by ' + w + ' is the same as finding ' + F(1, w) + ' of it: multiply the denominator by ' + w + '.', params: { n: n, d: d, w: w },
        sol: [F(n, d) + ' ÷ ' + w + ' = ' + F(n, d * w) + (s[1] !== d * w ? ' = ' + F(s[0], s[1]) : '') + '.'] });
    },
    verify: function (q) { var p = q.params; return K.mulCheck(q.check.n, p.d) * p.w === p.n * q.check.d && OM.gcd(q.check.n, q.check.d) === 1; } });

  K.gen({ id: 'y6FracDecimal', objective: 'Y6-F-06', title: 'Fractions as division; decimal equivalents',
    make: function (r, L) {
      var pairs = L === 1 ? [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 10]] : L === 2 ? [[1, 8], [3, 8], [5, 8], [7, 8], [3, 20], [7, 20], [9, 25]] : [[5, 8], [7, 8], [11, 40], [13, 50], [3, 40], [17, 20]];
      var f = r.pick(pairs), th = f[0] * 1000 / f[1];
      return K.dec('Write ' + F(f[0], f[1]) + ' as a decimal.', dstr(th), { hint: F(f[0], f[1]) + ' means ' + f[0] + ' ÷ ' + f[1] + '.', params: { n: f[0], d: f[1] },
        sol: [F(f[0], f[1]) + ' = ' + f[0] + ' ÷ ' + f[1] + '.', 'Short division gives ' + dstr(th) + '.'] });
    },
    verify: function (q) { var p = q.params; return K.mulCheck(K.th(q.check.value), p.d) === p.n * 1000; } });

  K.gen({ id: 'y6DecPlace', objective: 'Y6-F-07', title: 'Decimal place value; × and ÷ by 10, 100, 1,000',
    make: function (r, L) {
      var th = r.int(1001, 99999); if (th % 10 === 0) th += 3;
      if (L === 1) { th = r.int(1, 99) * 1000 + r.int(1, 9) * 100 + r.int(1, 9) * 10 + r.int(1, 9); var x = dstr(th), names = ['tenths', 'hundredths', 'thousandths'], k = r.int(0, 2), digit = +x.split('.')[1][k];
        return K.dec('What is the value of the digit <b>' + digit + '</b> in the ' + names[k] + ' column of <b>' + x + '</b>? Write it as a decimal.', dstr(digit * Math.pow(10, 2 - k)), { hint: 'A digit in the ' + names[k] + ' column is worth that many ' + names[k] + '.', params: { th: th, k: k },
          sol: ['The ' + names[k] + ' digit is ' + digit + ', worth ' + dstr(digit * Math.pow(10, 2 - k)) + '.'] }); }
      var by = r.pick([10, 100, 1000]), mul = r.chance(0.5);
      if (!mul) { th = th - th % by; if (!th) th = by * 7; }
      return K.dec('Work out <b>' + fd(th) + (mul ? ' × ' : ' ÷ ') + fmt(by) + '</b>.', dstr(mul ? th * by : th / by), { hint: 'Move the digits ' + (String(by).length - 1) + ' places ' + (mul ? 'left.' : 'right.'), params: { th: th, by: by, mul: mul },
        sol: [fd(th) + (mul ? ' × ' : ' ÷ ') + fmt(by) + ' = ' + fd(mul ? th * by : th / by) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k !== undefined) { var digit = +OM.fromScaled(p.th, 3).split('.')[1][p.k]; return K.th(q.check.value) === digit * [100, 10, 1][p.k]; } var v = K.th(q.check.value); return p.mul ? v === K.mulCheck(p.th, p.by) : K.mulCheck(v, p.by) === p.th; } });

  K.gen({ id: 'y6DecMult', objective: 'Y6-F-08', title: 'Multiplying decimals by whole numbers',
    make: function (r, L) {
      var h = L === 1 ? r.int(11, 99) * 10 : r.int(101, 999), w = r.int(L === 3 ? 12 : 3, L === 3 ? 25 : 9), x = dstr(h * 10);
      return K.dec('Work out <b>' + x + ' × ' + w + '</b>.', dstr(h * 10 * w), { hint: 'Multiply as if there were no decimal point, then put it back: the answer has the same number of decimal places as ' + x + '.', params: { h: h, w: w },
        sol: [h + ' × ' + w + ' = ' + fmt(h * w) + '.', x + ' has ' + OM.decimalPlaces(x) + ' decimal place' + (OM.decimalPlaces(x) > 1 ? 's' : '') + ', so the answer is ' + dstr(h * 10 * w) + '.'] });
    },
    verify: function (q) { var p = q.params; return K.th(q.check.value) === K.mulCheck(p.h, p.w) * 10; } });

  K.gen({ id: 'y6DecDiv', objective: 'Y6-F-09', title: 'Division with decimal answers',
    make: function (r, L) {
      var d = r.pick(L === 1 ? [2, 4, 5] : [4, 5, 8, 20, 25]), q, n;
      do { n = r.int(L === 1 ? 11 : 101, L === 3 ? 9999 : 999); q = n / d; } while (n % d === 0 || OM.decimalPlaces(String(q)) > 2);
      return K.dec('Work out <b>' + fmt(n) + ' ÷ ' + d + '</b>. Give your answer as a decimal.', String(q), { hint: 'Use short division. When you run out of digits, write a decimal point and carry on with zeros.', params: { n: n, d: d },
        sol: [fmt(n) + ' ÷ ' + d + ' = ' + Math.floor(n / d) + ' remainder ' + n % d + '.', 'Carry on past the decimal point: ' + fmt(n) + ' ÷ ' + d + ' = ' + q + '.'] });
    },
    verify: function (q) { var p = q.params; return K.mulCheck(K.th(q.check.value), p.d) === p.n * 1000 && OM.decimalPlaces(q.check.value) <= 2; } });

  K.gen({ id: 'y6RoundProblems', objective: 'Y6-F-10', title: 'Rounding answers to a degree of accuracy',
    make: function (r, L) {
      var total = r.int(1000, 9999), people = r.pick([3, 6, 7, 9, 11, 12]); while (total % people === 0) total++;
      var exactTh = Math.round(total * 1000 / people), dp = L === 1 ? 0 : L === 2 ? 1 : 2, unit = Math.pow(10, 3 - dp);
      var ans = Math.round(total * 1000 / people / unit) * unit;
      return K.dec('£' + fmt(total) + ' is shared equally between ' + people + ' people. How much does each get, rounded to ' + (dp === 0 ? 'the nearest pound' : dp === 1 ? '1 decimal place' : 'the nearest penny') + '?', dstr(ans), { prefix: '£', hint: 'Divide, then round to the accuracy asked for.', params: { total: total, people: people, dp: dp },
        sol: [fmt(total) + ' ÷ ' + people + ' = ' + (total / people).toFixed(4) + '…', 'Rounded: £' + (dp ? dstr(ans) : fmt(ans / 1000)) + '.'] });
    },
    verify: function (q) {
      var p = q.params, v = K.th(q.check.value), unit = Math.pow(10, 3 - p.dp);
      // the answer must be a multiple of the unit and within half a unit of the exact share
      return v % unit === 0 && Math.abs(v * p.people - p.total * 1000) <= unit * p.people / 2;
    } });

  var FDP = [[1, 2, '0.5', 50], [1, 4, '0.25', 25], [3, 4, '0.75', 75], [1, 5, '0.2', 20], [2, 5, '0.4', 40], [3, 5, '0.6', 60], [4, 5, '0.8', 80], [1, 10, '0.1', 10], [3, 10, '0.3', 30], [7, 10, '0.7', 70], [1, 20, '0.05', 5], [1, 8, '0.125', 12.5], [1, 3, '', 0]];
  K.gen({ id: 'y6FDP', objective: 'Y6-F-11', title: 'Fractions, decimals and percentages',
    make: function (r, L) {
      var e = r.pick(FDP.filter(function (x) { return x[2] && (L > 1 || x[3] % 1 === 0) && (L < 3 || x[3] > 10); }));
      if (L === 1) return K.int('Write ' + F(e[0], e[1]) + ' as a percentage.', e[3], { suffix: '%', hint: 'Make the denominator 100.', params: { e: e, k: 'pct' }, sol: [F(e[0], e[1]) + ' = ' + e[2] + ' = ' + e[3] + '%.'] });
      if (L === 2) return K.dec('Write <b>' + e[3] + '%</b> as a decimal.', e[2], { hint: 'Divide the percentage by 100.', params: { e: e, k: 'dec' }, sol: [e[3] + '% = ' + e[3] + ' ÷ 100 = ' + e[2] + '.'] });
      var items = [{ v: e[0] / e[1], l: F(e[0], e[1]) }, { v: (e[3] + 5) / 100, l: (e[3] + 5) + '%' }, { v: (e[0] / e[1]) - 0.05, l: dstr(Math.round((e[0] / e[1] - 0.05) * 1000)) }];
      var ord = items.slice().sort(function (a, b) { return a.v - b.v; });
      return K.order('Put these in order, from <b>smallest</b> to <b>largest</b>.', r.shuffle(items).map(function (x) { return { value: x.l, label: x.l }; }), ord.map(function (x) { return x.l; }), { hint: 'Change them all to decimals (or percentages) first.', params: { items: items, k: 'ord' },
        answer: ord.map(function (x) { return x.l.replace(/<[^>]+>/g, ''); }).join(', '), sol: ['As decimals: ' + items.map(function (x) { return Math.round(x.v * 1000) / 1000; }).join(', ') + '.', 'Smallest to largest: ' + ord.map(function (x) { return x.l; }).join(', ') + '.'] });
    },
    verify: function (q) { var p = q.params, e = p.e; if (p.k === 'pct') return Math.abs(e[0] / e[1] * 100 - q.check.value) < 1e-9; if (p.k === 'dec') return K.th(q.check.value) * 100 === e[3] * 1000; var vals = q.check.order.map(function (l) { return p.items.filter(function (x) { return x.l === l; })[0].v; }); return vals.every(function (v, i) { return !i || vals[i - 1] < v; }); } });

  // ================= RATIO AND PROPORTION =================
  K.gen({ id: 'y6Ratio', objective: 'Y6-R-01', title: 'Relative sizes',
    make: function (r, L) {
      var a = r.int(1, 4), b = r.int(2, 6); while (b === a) b = r.int(2, 6);
      var k = r.int(3, 12), it = r.pick([['red beads', 'blue beads'], ['cups of flour', 'cups of milk'], ['boys', 'girls']]);
      if (L < 3) return K.int('For every ' + a + ' ' + it[0] + ' there are ' + b + ' ' + it[1] + '. There are ' + a * k + ' ' + it[0] + '. How many ' + it[1] + ' are there?', b * k, { hint: 'How many groups of ' + a + ' are there?', params: { a: a, b: b, k: k, ask: 'other' },
        sol: [a * k + ' ÷ ' + a + ' = ' + k + ' groups.', k + ' × ' + b + ' = ' + b * k + ' ' + it[1] + '.'] });
      return K.int('For every ' + a + ' ' + it[0] + ' there are ' + b + ' ' + it[1] + '. There are ' + (a + b) * k + ' altogether. How many ' + it[1] + ' are there?', b * k, { hint: 'Each group has ' + (a + b) + ' things.', params: { a: a, b: b, k: k, ask: 'total' },
        sol: ['Each group has ' + a + ' + ' + b + ' = ' + (a + b) + '.', (a + b) * k + ' ÷ ' + (a + b) + ' = ' + k + ' groups.', k + ' × ' + b + ' = ' + b * k + '.'] });
    },
    verify: function (q) { var p = q.params; return K.mulCheck(q.check.value, p.a) === K.mulCheck(p.k * p.a, p.b); } });

  K.gen({ id: 'y6Percent', objective: 'Y6-R-02', title: 'Percentages of amounts',
    make: function (r, L) {
      var pc = L === 1 ? r.pick([10, 20, 25, 50, 75]) : r.pick([5, 15, 30, 35, 45, 60, 65]), amt = r.pick([40, 60, 80, 120, 160, 200, 240, 360, 400, 480]);
      if (L < 3) return K.int('Work out <b>' + pc + '% of ' + amt + '</b>.', amt * pc / 100, { hint: 'Find 10% (divide by 10), then build up' + (pc % 10 === 5 ? ', using 5% as half of 10%.' : '.'), params: { pc: pc, amt: amt },
        sol: ['10% of ' + amt + ' = ' + amt / 10 + '.', pc === 5 ? '5% is half of 10%: ' + amt / 20 + '.' : pc + '% = ' + (pc % 10 === 5 ? (pc > 15 ? Math.floor(pc / 10) + ' × 10%' : '10%') + ' + 5%' : pc / 10 + ' × 10%') + ' = ' + amt * pc / 100 + '.'] });
      var s1 = r.int(15, 24), t1 = 25, s2 = r.int(30, 46), t2 = 50; while (s1 * 4 === s2 * 2) s2++;
      var best = s1 / t1 > s2 / t2 ? 'a' : 'b';
      return K.choice('Amy scored ' + s1 + ' out of ' + t1 + '. Ben scored ' + s2 + ' out of ' + t2 + '. Who got the higher <b>percentage</b>?', [{ value: 'a', label: 'Amy' }, { value: 'b', label: 'Ben' }], best, { hint: 'Change both scores into percentages.', params: { s1: s1, t1: t1, s2: s2, t2: t2 },
        sol: ['Amy: ' + s1 + '/25 = ' + s1 * 4 + '%. Ben: ' + s2 + '/50 = ' + s2 * 2 + '%.', (best === 'a' ? 'Amy' : 'Ben') + ' has the higher percentage.'] });
    },
    verify: function (q) { var p = q.params; if (p.pc) return K.mulCheck(q.check.value, 100) === K.mulCheck(p.amt, p.pc); return q.check.value === (p.s1 * p.t2 > p.s2 * p.t1 ? 'a' : 'b'); } });

  K.gen({ id: 'y6Similar', objective: 'Y6-R-03', title: 'Similar shapes and scale factors',
    make: function (r, L) {
      var w = r.int(2, 8), h = r.int(2, 7), sf = r.int(2, 5);
      if (L < 3) return K.int('A rectangle is ' + w + ' cm by ' + h + ' cm. It is enlarged by a scale factor of ' + sf + '. How long is the longer side now?', Math.max(w, h) * sf, { suffix: 'cm', hint: 'Multiply every length by ' + sf + '.', params: { len: Math.max(w, h), sf: sf, k: 'enl' }, sol: [Math.max(w, h) + ' × ' + sf + ' = ' + Math.max(w, h) * sf + ' cm.'] });
      return K.int('Two triangles are similar. A side of ' + w + ' cm in the small one matches a side of ' + w * sf + ' cm in the large one. Another side of the small triangle is ' + h + ' cm. How long is the matching side of the large triangle?', h * sf, { suffix: 'cm', hint: 'Find the scale factor first.', params: { len: h, sf: sf, w: w, k: 'find' },
        sol: ['Scale factor: ' + w * sf + ' ÷ ' + w + ' = ' + sf + '.', h + ' × ' + sf + ' = ' + h * sf + ' cm.'] });
    },
    verify: function (q) { var p = q.params; return K.mulCheck(p.len, p.sf) === q.check.value; } });

  K.gen({ id: 'y6Sharing', objective: 'Y6-R-04', title: 'Unequal sharing',
    make: function (r, L) {
      var a = r.int(1, 4), b = r.int(2, 5), k = r.int(4, 25), n1 = r.pick(OM.NAMES), n2 = r.pick(OM.NAMES.filter(function (x) { return x !== n1; }));
      if (L === 1) return K.int(n1 + ' and ' + n2 + ' share ' + 4 * k + ' sweets. ' + n2 + ' gets 3 times as many as ' + n1 + '. How many does ' + n1 + ' get?', k, { hint: 'Think of 4 equal parts: ' + n1 + ' gets 1, ' + n2 + ' gets 3.', params: { a: 1, b: 3, k: k, ask: 'a' }, sol: ['1 + 3 = 4 parts.', 4 * k + ' ÷ 4 = ' + k + '.'] });
      return K.int(n1 + ' and ' + n2 + ' share £' + (a + b) * k + ' in the ratio ' + a + ' : ' + b + '. How much does ' + n2 + ' get?', b * k, { prefix: '£', hint: 'There are ' + (a + b) + ' equal parts altogether.', params: { a: a, b: b, k: k, ask: 'b' },
        sol: [a + ' + ' + b + ' = ' + (a + b) + ' parts.', '£' + (a + b) * k + ' ÷ ' + (a + b) + ' = £' + k + ' per part.', n2 + ' gets ' + b + ' × £' + k + ' = £' + b * k + '.'] });
    },
    verify: function (q) { var p = q.params, part = (p.a + p.b) * p.k / (p.a + p.b); return q.check.value === K.mulCheck(part, p.ask === 'a' ? p.a : p.b); } });

  // ================= ALGEBRA =================
  K.gen({ id: 'y6Formula', objective: 'Y6-A-01', title: 'Using formulae',
    make: function (r, L) {
      var per = r.int(2, 9), fix = r.int(3, 20), n = r.int(3, 12);
      if (L === 1) return K.int('The cost of a taxi ride is: <b>cost = ' + per + ' × miles + ' + fix + '</b> (in pounds). How much is a ' + n + '-mile ride?', per * n + fix, { prefix: '£', hint: 'Put ' + n + ' in place of miles.', params: { per: per, fix: fix, n: n, k: 'use' }, sol: [per + ' × ' + n + ' + ' + fix + ' = ' + (per * n + fix) + '.'] });
      if (L === 2) { var l = r.int(3, 15), w = r.int(2, 10); return K.int('The perimeter of a rectangle is <b>P = 2(l + w)</b>. Find P when l = ' + l + ' and w = ' + w + '.', 2 * (l + w), { hint: 'Add first (brackets), then double.', params: { l: l, w: w, k: 'perim' }, sol: ['2 × (' + l + ' + ' + w + ') = 2 × ' + (l + w) + ' = ' + 2 * (l + w) + '.'] }); }
      var cost = per * n + fix;
      return K.int('A taxi charges: <b>cost = ' + per + ' × miles + ' + fix + '</b>. A ride costs £' + cost + '. How many miles was it?', n, { suffix: 'miles', hint: 'Work backwards: subtract ' + fix + ', then divide by ' + per + '.', params: { per: per, fix: fix, cost: cost, k: 'inv' }, sol: [cost + ' − ' + fix + ' = ' + (cost - fix) + '.', (cost - fix) + ' ÷ ' + per + ' = ' + n + ' miles.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; if (p.k === 'use') return K.addCheck(K.mulCheck(p.per, p.n), p.fix) === v; if (p.k === 'perim') return K.addCheck(K.addCheck(p.l, p.w), K.addCheck(p.l, p.w)) === v; return K.addCheck(K.mulCheck(p.per, v), p.fix) === p.cost; } });

  function ordinal(n) { var t = n % 100, u = n % 10; return n + (t >= 11 && t <= 13 ? 'th' : u === 1 ? 'st' : u === 2 ? 'nd' : u === 3 ? 'rd' : 'th'); }
  function rule(m, c) { return (m === 1 ? '' : m) + 'n' + (c ? (c < 0 ? ' − ' + (-c) : ' + ' + c) : ''); }
  K.gen({ id: 'y6Sequences', objective: 'Y6-A-02', title: 'Linear sequences',
    make: function (r, L) {
      var d = r.int(2, 12) * (L === 3 && r.chance(0.4) ? -1 : 1), a = r.int(-10, 30), terms = [0, 1, 2, 3, 4].map(function (i) { return a + i * d; });
      if (L === 1) return K.int('What is the next term? &nbsp;<b>' + terms.slice(0, 4).map(neg).join(', ') + ', …</b>', terms[4], { keys: 'signed', hint: 'Find the difference between neighbouring terms.', params: { t: terms.slice(0, 4), k: 'next' }, sol: ['The terms go ' + (d > 0 ? 'up' : 'down') + ' by ' + Math.abs(d) + ' each time.', terms[3] + (d > 0 ? ' + ' : ' − ') + Math.abs(d) + ' = ' + terms[4] + '.'] });
      if (L === 2) { var nth = r.int(10, 30); return K.int('A sequence starts at ' + neg(a) + ' and goes up by ' + Math.abs(d) + ' each time. What is the <b>' + ordinal(nth) + '</b> term?', a + (nth - 1) * Math.abs(d), { keys: 'signed', hint: 'The ' + ordinal(nth) + ' term is ' + (nth - 1) + ' steps after the first.', params: { a: a, d: Math.abs(d), n: nth, k: 'nth' },
        sol: [(nth - 1) + ' × ' + Math.abs(d) + ' = ' + (nth - 1) * Math.abs(d) + '.', neg(a) + ' + ' + (nth - 1) * Math.abs(d) + ' = ' + neg(a + (nth - 1) * Math.abs(d)) + '.'] }); }
      var m = Math.max(2, Math.abs(d)), c = r.int(-5, 9), t3 = [1, 2, 3, 4].map(function (i) { return m * i + c; });
      return K.choice('Which rule gives the sequence &nbsp;<b>' + t3.map(neg).join(', ') + ', …</b>&nbsp; where n is the position?', opts(r, rule(m, c), [rule(m + 1, c - 1), rule(1, m), rule(m, c + m)]), rule(m, c),
        { hint: 'The terms go up by ' + m + ', so the rule starts ' + m + 'n.', params: { t: t3, m: m, c: c, k: 'rule' }, sol: ['The difference is ' + m + ', so start with ' + m + 'n: ' + [1, 2, 3, 4].map(function (i) { return m * i; }).join(', ') + '.', (c ? 'Adjust by ' + neg(c) + ': ' : 'No adjustment needed: ') + rule(m, c) + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.k === 'next') { var d = p.t[1] - p.t[0]; return p.t.every(function (x, i) { return !i || x - p.t[i - 1] === d; }) && q.check.value === p.t[3] + d; }
      if (p.k === 'nth') { var x = p.a; for (var i = 1; i < p.n; i++) x += p.d; return x === q.check.value; }
      var m = q.check.value.match(/^(\d*)n(?:\s*([+−])\s*(\d+))?$/); if (!m) return false; var mm = +(m[1] || 1), cc = m[2] ? (m[2] === '−' ? -m[3] : +m[3]) : 0;
      return p.t.every(function (t, i) { return mm * (i + 1) + cc === t; });
    } });

  K.gen({ id: 'y6MissingAlg', objective: 'Y6-A-03', title: 'Missing numbers with letters',
    make: function (r, L) {
      var x = r.int(2, 15), a = r.int(2, 9), b = r.int(1, 30);
      if (L === 1) return K.int('Find <b>n</b> when <b>n + ' + b + ' = ' + (x + b) + '</b>.', x, { hint: 'Subtract ' + b + ' from both sides.', params: { a: 1, b: b, r: x + b }, sol: ['n = ' + (x + b) + ' − ' + b + ' = ' + x + '.'] });
      if (L === 2) return K.int('Find <b>y</b> when <b>' + a + 'y = ' + a * x + '</b>.', x, { hint: a + 'y means ' + a + ' × y.', params: { a: a, b: 0, r: a * x }, sol: ['y = ' + a * x + ' ÷ ' + a + ' = ' + x + '.'] });
      return K.int('Find <b>a</b> when <b>' + a + 'a + ' + b + ' = ' + (a * x + b) + '</b>.', x, { hint: 'Subtract ' + b + ' first, then divide by ' + a + '.', params: { a: a, b: b, r: a * x + b }, sol: [a + 'a = ' + (a * x + b) + ' − ' + b + ' = ' + a * x + '.', 'a = ' + a * x + ' ÷ ' + a + ' = ' + x + '.'] });
    },
    verify: function (q) { var p = q.params; return K.addCheck(K.mulCheck(p.a, q.check.value), p.b) === p.r; } });

  K.gen({ id: 'y6TwoUnknowns', objective: 'Y6-A-04', title: 'Equations with two unknowns',
    make: function (r, L) {
      var a = r.int(1, 4), b = r.int(1, 3), x = r.int(1, 9), y = r.int(1, 9), tot = a * x + b * y;
      var eq = (a > 1 ? a : '') + 'p + ' + (b > 1 ? b : '') + 'q = ' + tot;
      var good = 'p = ' + x + ', q = ' + y, cands = [];
      for (var px = 1; px <= 12 && cands.length < 3; px++) for (var qy = 1; qy <= 12 && cands.length < 3; qy++) if (a * px + b * qy !== tot && Math.abs(a * px + b * qy - tot) <= 3 && (px !== x || qy !== y)) cands.push('p = ' + px + ', q = ' + qy);
      if (L === 1) return K.choice('Which pair of numbers makes <b>' + eq + '</b> true?', opts(r, good, cands), good, { hint: 'Try each pair in the equation.', params: { a: a, b: b, tot: tot, k: 'pick' }, sol: [(a > 1 ? a + ' × ' : '') + x + ' + ' + (b > 1 ? b + ' × ' : '') + y + ' = ' + tot + ' ✓'] });
      var count = 0; for (px = 1; px * a < tot; px++) if ((tot - a * px) % b === 0 && (tot - a * px) / b >= 1) count++;
      return K.int('p and q are whole numbers bigger than 0. How many pairs of values make <b>' + eq + '</b> true?', count, { hint: 'Try p = 1, 2, 3… and see if q comes out as a whole number.', params: { a: a, b: b, tot: tot, k: 'count' },
        sol: ['Try each value of p from 1 upwards and work out q.', 'There ' + (count === 1 ? 'is 1 pair' : 'are ' + count + ' pairs') + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'pick') { var m = q.check.value.match(/p = (\d+), q = (\d+)/); return p.a * +m[1] + p.b * +m[2] === p.tot; } var c = 0; for (var i = 1; i <= p.tot; i++) for (var j = 1; j <= p.tot; j++) if (p.a * i + p.b * j === p.tot) c++; return c === q.check.value; } });

  K.gen({ id: 'y6Combinations', objective: 'Y6-A-05', title: 'Listing combinations',
    make: function (r, L) {
      var m = r.int(2, 5), n = r.int(2, 6);
      if (L < 3) return K.int('A café has ' + m + ' kinds of sandwich and ' + n + ' kinds of drink. How many different meals of one sandwich and one drink are possible?', m * n, { hint: 'Each sandwich can go with every drink.', params: { m: m, n: n, k: 'prod' }, sol: [m + ' × ' + n + ' = ' + m * n + ' meals.'] });
      var lim = r.int(6, 12);
      return K.int('Two dice numbered 1 to 6 are rolled. In how many ways can the total be <b>' + lim + '</b>?', 6 - Math.abs(lim - 7), { hint: 'List the pairs: (1, ' + (lim - 1) + '), (2, ' + (lim - 2) + ')…', params: { lim: lim, k: 'dice' }, sol: ['List every pair of numbers from 1 to 6 that adds to ' + lim + '.', 'There are ' + (6 - Math.abs(lim - 7)) + ' ways.'] });
    },
    verify: function (q) { var p = q.params, c = 0, i, j; if (p.k === 'prod') { for (i = 0; i < p.m; i++) for (j = 0; j < p.n; j++) c++; return c === q.check.value; } for (i = 1; i <= 6; i++) for (j = 1; j <= 6; j++) if (i + j === p.lim) c++; return c === q.check.value; } });

  // ================= MEASUREMENT =================
  K.gen({ id: 'y6MeasureProblems', objective: 'Y6-M-01', title: 'Measure problems with decimals',
    make: function (r, L) {
      var a = r.int(1250, 4750), b = r.int(150, 950), name = r.pick(OM.NAMES);
      if (L === 1) return K.dec(name + ' has ' + dstr(a) + ' kg of potatoes and buys ' + b + ' g more. How many kilograms is that?', dstr(a + b), { suffix: 'kg', hint: 'Change ' + b + ' g into kilograms first.', params: { a: a, b: b, k: 'add' }, sol: [b + ' g = ' + dstr(b) + ' kg.', dstr(a) + ' + ' + dstr(b) + ' = ' + dstr(a + b) + ' kg.'] });
      var n = r.int(3, 8), each = r.int(125, 600);
      if (L === 2) return K.dec(n + ' bottles each hold ' + each + ' ml. How many litres is that altogether?', dstr(n * each), { suffix: 'litres', hint: 'Multiply, then change millilitres to litres.', params: { n: n, each: each, k: 'mul' }, sol: [n + ' × ' + each + ' = ' + n * each + ' ml.', n * each + ' ml = ' + dstr(n * each) + ' litres.'] });
      var rope = r.int(5, 12) * 1000, piece = r.int(15, 45) * 10, k = Math.floor(rope / 10 / piece);
      return K.dec('A ' + dstr(rope) + ' m rope is cut into as many ' + piece + ' cm pieces as possible. How much rope is left, in metres?', dstr(rope - k * piece * 10), { suffix: 'm', hint: 'Change to the same unit: ' + dstr(rope) + ' m = ' + rope / 10 + ' cm.', params: { rope: rope, piece: piece, k: 'left' },
        sol: [dstr(rope) + ' m = ' + rope / 10 + ' cm.', rope / 10 + ' ÷ ' + piece + ' = ' + k + ' remainder ' + (rope / 10 - k * piece) + '.', (rope / 10 - k * piece) + ' cm = ' + dstr(rope - k * piece * 10) + ' m.'] });
    },
    verify: function (q) { var p = q.params, v = K.th(q.check.value); if (p.k === 'add') return v === K.addCheck(p.a, p.b); if (p.k === 'mul') return v === K.mulCheck(p.n, p.each); var left = p.rope; while (left >= p.piece * 10) left -= p.piece * 10; return v === left; } });

  var UNITS = [['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['kg', 'g', 1000], ['litres', 'ml', 1000], ['tonnes', 'kg', 1000]];
  K.gen({ id: 'y6Convert', objective: 'Y6-M-02', title: 'Converting units',
    make: function (r, L) {
      var u = r.pick(UNITS), small = r.int(11, 9999); if (u[2] === 10) small = r.int(11, 999);
      if (L === 1) { var big = r.int(2, 9) * 1000 + r.pick(u[2] === 10 ? [0, 500, 300, 700] : [0, 500, 250, 750]); return K.int('Convert <b>' + dstr(big) + ' ' + u[0] + '</b> into ' + u[1] + '.', big * u[2] / 1000, { suffix: u[1], hint: '1 ' + u[0] + ' = ' + fmt(u[2]) + ' ' + u[1] + '.', params: { th: big, f: u[2], k: 'down' }, sol: [dstr(big) + ' × ' + fmt(u[2]) + ' = ' + fmt(big * u[2] / 1000) + ' ' + u[1] + '.'] }); }
      if (L === 2) return K.dec('Convert <b>' + fmt(small) + ' ' + u[1] + '</b> into ' + u[0] + '.', dstr(small * 1000 / u[2]), { suffix: u[0], hint: 'Divide by ' + fmt(u[2]) + '.', params: { small: small, f: u[2], k: 'up' }, sol: [fmt(small) + ' ÷ ' + fmt(u[2]) + ' = ' + dstr(small * 1000 / u[2]) + ' ' + u[0] + '.'] });
      var secs = r.int(130, 3500);
      return K.multi('Write <b>' + fmt(secs) + ' seconds</b> in minutes and seconds.', '{0} minutes {1} seconds', [{ kind: 'int', value: Math.floor(secs / 60) }, { kind: 'int', value: secs % 60 }], { hint: 'How many 60s fit into ' + secs + '?', params: { secs: secs, k: 'time' },
        sol: [secs + ' ÷ 60 = ' + Math.floor(secs / 60) + ' remainder ' + secs % 60 + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'down') return K.mulCheck(q.check.value, 1000) === K.mulCheck(p.th, p.f); if (p.k === 'up') return K.mulCheck(K.th(q.check.value), p.f) === p.small * 1000; return K.addCheck(K.mulCheck(q.check.parts[0].value, 60), q.check.parts[1].value) === p.secs && q.check.parts[1].value < 60; } });

  K.gen({ id: 'y6MilesKm', objective: 'Y6-M-03', title: 'Miles and kilometres',
    make: function (r, L) {
      var k = r.int(2, L === 3 ? 30 : 12), miles = 5 * k, km = 8 * k, toKm = L !== 2;
      return K.int(toKm ? 'About how many <b>kilometres</b> is ' + miles + ' miles? (5 miles ≈ 8 km)' : 'About how many <b>miles</b> is ' + km + ' km? (5 miles ≈ 8 km)', toKm ? km : miles, { suffix: toKm ? 'km' : 'miles', hint: 'How many lots of ' + (toKm ? '5 miles' : '8 km') + ' are there?', params: { k: k, toKm: toKm },
        sol: [(toKm ? miles + ' ÷ 5' : km + ' ÷ 8') + ' = ' + k + '.', k + ' × ' + (toKm ? 8 : 5) + ' = ' + (toKm ? km : miles) + (toKm ? ' km.' : ' miles.')] });
    },
    verify: function (q) { var p = q.params; return p.toKm ? K.mulCheck(q.check.value, 5) === K.mulCheck(p.k * 5, 8) : K.mulCheck(q.check.value, 8) === K.mulCheck(p.k * 8, 5); } });

  K.gen({ id: 'y6SameArea', objective: 'Y6-M-04', title: 'Same area, different perimeter',
    make: function (r, L) {
      var area = r.pick([12, 16, 18, 20, 24, 30, 36]), pairs = K.factorPairs(area);
      if (L < 3) { var pr = r.pick(pairs); return K.int('A rectangle has an area of ' + area + ' cm² and one side of ' + pr[0] + ' cm. What is its <b>perimeter</b>?', 2 * (pr[0] + pr[1]), { suffix: 'cm', hint: 'Find the other side first: ' + area + ' ÷ ' + pr[0] + '.', params: { area: area, s: pr[0] }, sol: ['Other side: ' + area + ' ÷ ' + pr[0] + ' = ' + pr[1] + ' cm.', 'Perimeter: 2 × (' + pr[0] + ' + ' + pr[1] + ') = ' + 2 * (pr[0] + pr[1]) + ' cm.'] }); }
      return K.int('How many different rectangles with whole-number sides have an area of ' + area + ' cm²? (A 2 by 3 and a 3 by 2 count as the same.)', pairs.length, { hint: 'List the factor pairs of ' + area + '.', params: { area: area, count: true }, sol: ['Factor pairs: ' + pairs.map(function (p) { return p.join(' by '); }).join(', ') + '.', 'That is ' + pairs.length + ' rectangles, each with a different perimeter.'] });
    },
    verify: function (q) { var p = q.params; if (p.count) { var c = 0; for (var i = 1; i * i <= p.area; i++) if (p.area % i === 0) c++; return c === q.check.value; } var other = p.area / p.s; return K.addCheck(K.addCheck(p.s, other), K.addCheck(p.s, other)) === q.check.value; } });

  K.gen({ id: 'y6UseFormulae', objective: 'Y6-M-05', title: 'When to use area and volume formulae',
    make: function (r, L) {
      if (L === 1) { var sh = r.pick([['rectangle', 'yes'], ['L-shape made of two rectangles', 'split'], ['circle', 'no']]); return K.choice('Can you find the area of a <b>' + sh[0] + '</b> using only the formula length × width?', [{ value: 'yes', label: 'Yes, directly' }, { value: 'split', label: 'Yes, after splitting it into rectangles' }, { value: 'no', label: 'No, that formula does not work for it' }], sh[1],
        { hint: 'length × width works for rectangles.', params: { sh: sh[0] }, sol: [sh[1] === 'yes' ? 'A rectangle: length × width works directly.' : sh[1] === 'split' ? 'Split it into rectangles, then add their areas.' : 'A circle is not made of rectangles, so length × width does not work.'] }); }
      var l = r.int(3, 12), w = r.int(2, 9), h = r.int(2, 8);
      return K.int('Use the formula <b>V = length × width × height</b> to find the volume of a cuboid ' + l + ' cm by ' + w + ' cm by ' + h + ' cm.', l * w * h, { suffix: 'cm³', hint: 'Multiply the three lengths.', params: { l: l, w: w, h: h }, sol: [l + ' × ' + w + ' × ' + h + ' = ' + l * w * h + ' cm³.'] });
    },
    verify: function (q) { var p = q.params; if (p.sh) return q.check.value === { 'rectangle': 'yes', 'L-shape made of two rectangles': 'split', 'circle': 'no' }[p.sh]; return K.mulCheck(K.mulCheck(p.l, p.w), p.h) === q.check.value; } });

  K.gen({ id: 'y6AreaParaTri', objective: 'Y6-M-06', title: 'Area of parallelograms and triangles',
    make: function (r, L) {
      var tri = L === 1 ? false : L === 2 ? true : r.chance(0.5), b = r.int(4, 14), h = r.int(3, 10);
      if (tri && (b * h) % 2) b++;
      return K.int('Find the area of this ' + (tri ? 'triangle' : 'parallelogram') + '.', tri ? b * h / 2 : b * h, { suffix: 'cm²', visual: V.baseHeight(tri ? 'triangle' : 'parallelogram', b, h, 'cm'), hint: tri ? 'Area of a triangle = ½ × base × height.' : 'Area of a parallelogram = base × height (the perpendicular height).', params: { b: b, h: h, tri: tri },
        sol: [tri ? '½ × ' + b + ' × ' + h + ' = ' + b * h / 2 + ' cm².' : b + ' × ' + h + ' = ' + b * h + ' cm².', 'Use the perpendicular height, not the sloping side.'] });
    },
    verify: function (q) { var p = q.params, full = K.mulCheck(p.b, p.h); return p.tri ? K.addCheck(q.check.value, q.check.value) === full : full === q.check.value; } });

  K.gen({ id: 'y6Volume', objective: 'Y6-M-07', title: 'Volume of cubes and cuboids',
    make: function (r, L) {
      var l = r.int(2, 12), w = r.int(2, 10), h = r.int(2, 9);
      if (L === 1) { var s = r.int(2, 9); return K.int('Find the volume of a cube with edges of ' + s + ' cm.', s * s * s, { suffix: 'cm³', hint: 'Volume of a cube = edge × edge × edge.', params: { d: [s, s, s] }, sol: [s + ' × ' + s + ' × ' + s + ' = ' + s * s * s + ' cm³.'] }); }
      if (L === 2) return K.int('Find the volume of a cuboid ' + l + ' m by ' + w + ' m by ' + h + ' m.', l * w * h, { suffix: 'm³', visual: l <= 6 && w <= 4 && h <= 4 ? V.cubes(l, w, h) : '', hint: 'length × width × height.', params: { d: [l, w, h] }, sol: [l + ' × ' + w + ' × ' + h + ' = ' + l * w * h + ' m³.'] });
      var vol = l * w * h;
      return K.int('A cuboid has a volume of ' + vol + ' cm³. Its length is ' + l + ' cm and its width is ' + w + ' cm. What is its height?', h, { suffix: 'cm', hint: 'Divide the volume by length × width.', params: { d: [l, w], vol: vol }, sol: [l + ' × ' + w + ' = ' + l * w + '.', vol + ' ÷ ' + l * w + ' = ' + h + ' cm.'] });
    },
    verify: function (q) { var p = q.params; if (p.vol) return K.mulCheck(K.mulCheck(p.d[0], p.d[1]), q.check.value) === p.vol; return p.d.reduce(function (a, b) { return K.mulCheck(a, b); }, 1) === q.check.value; } });

  // ================= GEOMETRY =================
  K.gen({ id: 'y6DrawShapes', objective: 'Y6-G-01', title: 'Drawing shapes to given sizes',
    make: function (r, L) {
      var target = r.pick([30, 45, 60, 110, 120, 135, 150]), others = r.sample([40, 50, 70, 80, 100, 130, 140, 160].filter(function (x) { return Math.abs(x - target) >= 20; }), 2);
      if (L < 3) { var choices = r.shuffle([target].concat(others)); return K.choice('Which drawing shows an angle of <b>' + target + '°</b>?', choices.map(function (d) { return { value: String(d), label: V.angle(d, { len1: 70, len2: 70 }).replace(/width="\d+"/, 'width="130"') }; }), String(target),
        { hint: 'Is the angle you want acute (less than 90°) or obtuse (more than 90°)? Compare with a right angle.', params: { target: target, choices: choices }, sol: [target < 90 ? target + '° is acute: less than a right angle.' : target + '° is obtuse: more than a right angle but less than a straight line.'] }); }
      var a = r.int(35, 80), b = r.int(35, 80);
      return K.int('Sam draws a triangle with a base of 8 cm and angles of ' + a + '° and ' + b + '° at each end of the base. What will the third angle be?', 180 - a - b, { suffix: '°', hint: 'Angles in a triangle add up to 180°.', params: { a: a, b: b }, sol: ['180 − ' + a + ' − ' + b + ' = ' + (180 - a - b) + '°.'] });
    },
    verify: function (q) { var p = q.params; if (p.target) return +q.check.value === p.target && p.choices.indexOf(p.target) >= 0; return K.addCheck(K.addCheck(p.a, p.b), q.check.value) === 180; } });

  var NETS6 = { 'cube': 'cube', 'cuboid': 'cuboid', 'square-based pyramid': 'square-based pyramid', 'triangular prism': 'triangular prism', 'tetrahedron': 'triangular-based pyramid' };
  K.gen({ id: 'y6Nets', objective: 'Y6-G-02', title: '3-D shapes and nets',
    make: function (r, L) {
      var k = r.pick(Object.keys(NETS6)), name = NETS6[k], facts = { cube: [6, 12, 8], cuboid: [6, 12, 8], 'square-based pyramid': [5, 8, 5], 'triangular prism': [5, 9, 6], tetrahedron: [4, 6, 4] }[k];
      if (L === 1) return K.choice('Which 3-D shape does this net make?', r.shuffle([name].concat(r.sample(Object.keys(NETS6).filter(function (x) { return x !== k; }).map(function (x) { return NETS6[x]; }), 3))), name, { visual: V.net(k), hint: 'Count the faces and look at their shapes.', params: { k: k }, sol: ['It folds into a ' + name + '.'] });
      var what = r.pick(['edges', 'vertices']), idx = what === 'edges' ? 1 : 2;
      return K.int('This net folds into a 3-D shape. How many <b>' + what + '</b> will it have?', facts[idx], { visual: V.net(k), hint: 'Picture it folded: a ' + name + '.', params: { k: k, what: what, f: facts }, sol: ['It makes a ' + name + ' with ' + facts[0] + ' faces, ' + facts[1] + ' edges and ' + facts[2] + ' vertices.'] });
    },
    verify: function (q) { var p = q.params; if (p.what) return p.f[0] + p.f[2] - p.f[1] === 2 && q.check.value === p.f[p.what === 'edges' ? 1 : 2]; return q.check.value === NETS6[p.k]; } });

  K.gen({ id: 'y6AnglesShapes', objective: 'Y6-G-03', title: 'Missing angles in shapes',
    make: function (r, L) {
      if (L === 1) { var a = r.int(30, 80), b = r.int(30, 80); return K.int('Two angles of a triangle are ' + a + '° and ' + b + '°. What is the third angle?', 180 - a - b, { suffix: '°', hint: 'Angles in a triangle add up to 180°.', params: { known: [a, b], total: 180 }, sol: ['180 − ' + a + ' − ' + b + ' = ' + (180 - a - b) + '°.'] }); }
      if (L === 2) { var x = r.int(60, 120), y = r.int(60, 120), z = r.int(50, 110); if (x + y + z >= 340) z = 340 - x - y - 10; return K.int('Three angles of a quadrilateral are ' + x + '°, ' + y + '° and ' + z + '°. What is the fourth angle?', 360 - x - y - z, { suffix: '°', hint: 'Angles in a quadrilateral add up to 360°.', params: { known: [x, y, z], total: 360 }, sol: ['360 − ' + x + ' − ' + y + ' − ' + z + ' = ' + (360 - x - y - z) + '°.'] }); }
      var n = r.pick([5, 6, 8, 9, 10, 12]), names = { 5: 'pentagon', 6: 'hexagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };
      return K.int('What is the size of each interior angle of a <b>regular ' + names[n] + '</b>?', (n - 2) * 180 / n, { suffix: '°', hint: 'Split it into triangles from one corner: there are ' + (n - 2) + '.', params: { n: n, poly: true }, sol: [(n - 2) + ' triangles × 180° = ' + (n - 2) * 180 + '°.', (n - 2) * 180 + ' ÷ ' + n + ' = ' + (n - 2) * 180 / n + '°.'] });
    },
    verify: function (q) { var p = q.params; if (p.poly) return K.addCheck(K.mulCheck(180 - q.check.value, p.n), 0) === 360; return p.known.reduce(function (s, x) { return K.addCheck(s, x); }, q.check.value) === p.total; } });

  K.gen({ id: 'y6Circles', objective: 'Y6-G-04', title: 'Parts of a circle',
    make: function (r, L) {
      if (L === 1) { var part = r.pick(['radius', 'diameter', 'circumference']); return K.choice('What is the name of the part of the circle shown in red?', ['radius', 'diameter', 'circumference'], part, { visual: V.circleParts(part, ' '), hint: 'The radius goes from the centre to the edge. The diameter goes right across through the centre. The circumference is the distance all the way round.', params: { part: part }, sol: ['This is the ' + part + '.'] }); }
      var rad = r.int(2, 25), toD = L === 2 ? true : r.chance(0.5);
      return K.int(toD ? 'A circle has a radius of ' + rad + ' cm. What is its diameter?' : 'A circle has a diameter of ' + 2 * rad + ' cm. What is its radius?', toD ? 2 * rad : rad, { suffix: 'cm', visual: V.circleParts(toD ? 'radius' : 'diameter', (toD ? rad : 2 * rad) + ' cm'), hint: 'The diameter is twice the radius.', params: { rad: rad, toD: toD }, sol: [toD ? rad + ' × 2 = ' + 2 * rad + ' cm.' : 2 * rad + ' ÷ 2 = ' + rad + ' cm.'] });
    },
    verify: function (q) { var p = q.params; if (p.part) return q.check.value === p.part; return p.toD ? K.addCheck(p.rad, p.rad) === q.check.value : K.addCheck(q.check.value, q.check.value) === 2 * p.rad; } });

  K.gen({ id: 'y6AngleFacts', objective: 'Y6-G-05', title: 'Angles at a point, on a line and vertically opposite',
    make: function (r, L) {
      var a = r.int(25, 155);
      if (L === 1) return K.int('Two straight lines cross. One angle is ' + a + '°. What is the angle <b>vertically opposite</b> it?', a, { suffix: '°', hint: 'Vertically opposite angles are equal.', params: { a: a, k: 'vo' }, visual: crossing(a), sol: ['Vertically opposite angles are equal, so it is also ' + a + '°.'] });
      if (L === 2) return K.int('Two straight lines cross. One angle is ' + a + '°. What is the angle <b>next to it</b> on the same straight line?', 180 - a, { suffix: '°', hint: 'Angles on a straight line add up to 180°.', params: { a: a, k: 'adj' }, visual: crossing(a), sol: ['180 − ' + a + ' = ' + (180 - a) + '°.'] });
      var b = r.int(40, 120), c = r.int(40, Math.min(120, 340 - a - b));
      return K.int('Four angles meet at a point. Three of them are ' + a + '°, ' + b + '° and ' + c + '°. What is the fourth angle?', 360 - a - b - c, { suffix: '°', hint: 'Angles at a point add up to 360°.', params: { a: a, b: b, c: c, k: 'pt' }, sol: ['360 − ' + a + ' − ' + b + ' − ' + c + ' = ' + (360 - a - b - c) + '°.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'vo') return q.check.value === p.a; if (p.k === 'adj') return K.addCheck(p.a, q.check.value) === 180; return K.addCheck(K.addCheck(K.addCheck(p.a, p.b), p.c), q.check.value) === 360 && q.check.value > 0; } });
  function crossing(a) { var R = 90, rad = a * Math.PI / 180, cx = 120, cy = 100; return V.svg(240, 200, V.line(cx - R, cy, cx + R, cy, { w: 4 }) + V.line((cx - R * Math.cos(rad)).toFixed(1), (cy + R * Math.sin(rad)).toFixed(1), (cx + R * Math.cos(rad)).toFixed(1), (cy - R * Math.sin(rad)).toFixed(1), { w: 4 }) + V.t(cx + 36 * Math.cos(rad / 2), cy - 36 * Math.sin(rad / 2), a + '°', { size: 13, weight: 'bold' })); }

  // ================= POSITION AND DIRECTION =================
  K.gen({ id: 'y6Coords4', objective: 'Y6-P-01', title: 'All four quadrants',
    make: function (r, L) {
      var x = r.int(-6, 6), y = r.int(-6, 6); if (!x) x = -3; if (!y) y = 2;
      if (L === 1 && x > 0 && y > 0) { x = -x; }
      if (L < 3) return { prompt: 'What are the coordinates of point A?', visual: V.grid4({ n: 6, points: [{ x: x, y: y, label: 'A' }] }), input: { type: 'coord' }, check: { kind: 'coord', x: x, y: y }, hint: 'Across first (x), then up or down (y). Left of 0 and below 0 are negative.', params: { x: x, y: y },
        solution: [S('Go across to ' + neg(x) + ', then ' + (y > 0 ? 'up' : 'down') + ' to ' + neg(y) + '.'), S('A is at (' + neg(x) + ', ' + neg(y) + ').')] };
      var w = r.int(2, 5), h = r.int(2, 4), x0 = r.int(-6, 6 - w), y0 = r.int(-5, 5 - h);
      return { prompt: 'Three corners of a rectangle are at (' + neg(x0) + ', ' + neg(y0) + '), (' + neg(x0 + w) + ', ' + neg(y0) + ') and (' + neg(x0 + w) + ', ' + neg(y0 + h) + '). What are the coordinates of the fourth corner?', input: { type: 'coord' }, check: { kind: 'coord', x: x0, y: y0 + h },
        hint: 'Opposite sides of a rectangle are parallel: the fourth corner shares an x with one corner and a y with another.', params: { pts: [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h]] }, visual: V.grid4({ n: 6, points: [{ x: x0, y: y0 }, { x: x0 + w, y: y0 }, { x: x0 + w, y: y0 + h }] }),
        solution: [S('The fourth corner is above (' + neg(x0) + ', ' + neg(y0) + ') at the same height as (' + neg(x0 + w) + ', ' + neg(y0 + h) + ').'), S('It is at (' + neg(x0) + ', ' + neg(y0 + h) + ').')] };
    },
    verify: function (q) { var p = q.params; if (p.pts) { var P = p.pts, fx = P[0][0] + P[2][0] - P[1][0], fy = P[0][1] + P[2][1] - P[1][1]; return q.check.x === fx && q.check.y === fy; } return q.check.x === p.x && q.check.y === p.y; } });

  K.gen({ id: 'y6TransformAxes', objective: 'Y6-P-02', title: 'Translating and reflecting in the axes',
    make: function (r, L) {
      var x = r.int(-5, 5), y = r.int(-5, 5); if (!x) x = 2; if (!y) y = -3;
      if (L === 1) { var dx = r.int(-4, 4), dy = r.int(-4, 4); if (!dx && !dy) dx = 3; if (Math.abs(x + dx) > 6) dx = -dx; if (Math.abs(y + dy) > 6) dy = -dy;
        return { prompt: 'Point P(' + neg(x) + ', ' + neg(y) + ') is translated ' + (dx ? Math.abs(dx) + ' ' + (dx > 0 ? 'right' : 'left') : '') + (dx && dy ? ' and ' : '') + (dy ? Math.abs(dy) + ' ' + (dy > 0 ? 'up' : 'down') : '') + '. Where is it now?', input: { type: 'coord' }, check: { kind: 'coord', x: x + dx, y: y + dy },
          hint: 'Right/left changes x; up/down changes y.', params: { x: x, y: y, dx: dx, dy: dy, k: 'tr' }, visual: V.grid4({ n: 6, points: [{ x: x, y: y, label: 'P' }] }), solution: [S('(' + neg(x) + ' ' + (dx >= 0 ? '+ ' + dx : '− ' + (-dx)) + ', ' + neg(y) + ' ' + (dy >= 0 ? '+ ' + dy : '− ' + (-dy)) + ') = (' + neg(x + dx) + ', ' + neg(y + dy) + ').')] }; }
      var axis = L === 2 ? r.pick(['x-axis', 'y-axis']) : r.pick(['x-axis', 'y-axis']), rx = axis === 'y-axis' ? -x : x, ry = axis === 'x-axis' ? -y : y;
      return { prompt: 'Point Q(' + neg(x) + ', ' + neg(y) + ') is reflected in the <b>' + axis + '</b>. Where is its reflection?', input: { type: 'coord' }, check: { kind: 'coord', x: rx, y: ry },
        hint: axis === 'x-axis' ? 'Reflecting in the x-axis keeps x the same and changes the sign of y.' : 'Reflecting in the y-axis keeps y the same and changes the sign of x.', params: { x: x, y: y, axis: axis, k: 'ref' }, visual: V.grid4({ n: 6, points: [{ x: x, y: y, label: 'Q' }] }),
        solution: [S('Q is ' + Math.abs(axis === 'x-axis' ? y : x) + ' squares from the ' + axis + '. Its reflection is the same distance on the other side.'), S('The reflection is at (' + neg(rx) + ', ' + neg(ry) + ').')] };
    },
    verify: function (q) { var p = q.params; if (p.k === 'tr') return q.check.x - p.x === p.dx && q.check.y - p.y === p.dy; var mx = p.axis === 'y-axis', d1 = mx ? Math.abs(p.x) : Math.abs(p.y), d2 = mx ? Math.abs(q.check.x) : Math.abs(q.check.y), sameOther = mx ? q.check.y === p.y : q.check.x === p.x, opposite = mx ? Math.sign(q.check.x) === -Math.sign(p.x) : Math.sign(q.check.y) === -Math.sign(p.y); return d1 === d2 && sameOther && opposite; } });

  // ================= STATISTICS =================
  K.gen({ id: 'y6PieChart', objective: 'Y6-S-01', title: 'Pie charts and line graphs',
    make: function (r, L) {
      var cats = r.pick([['Football', 'Swimming', 'Dance', 'Tennis'], ['Toast', 'Cereal', 'Fruit', 'Eggs'], ['Bus', 'Car', 'Walk', 'Bike']]), total = r.pick([24, 40, 48, 80, 120, 160]);
      var shares = r.shuffle(r.pick([[1, 2, 4, 1], [2, 1, 3, 2], [3, 1, 2, 2], [1, 1, 2, 4], [4, 2, 1, 1], [3, 3, 1, 1], [2, 2, 2, 2]])), vals = shares.map(function (p) { return p * total / 8; });
      var i = r.int(0, 3), vis = V.pieChart(cats, vals, { title: total + ' children were asked' });
      if (L < 3) return K.int('The pie chart shows how ' + total + ' children voted. How many chose <b>' + cats[i] + '</b>?', vals[i], { visual: vis, hint: 'What fraction of the circle is ' + cats[i] + '? Find that fraction of ' + total + '.', params: { vals: vals, i: i, total: total, k: 'n' },
        sol: [cats[i] + ' is ' + F(vals[i] / OM.gcd(vals[i], total), total / OM.gcd(vals[i], total)) + ' of the circle.', F(vals[i] / OM.gcd(vals[i], total), total / OM.gcd(vals[i], total)) + ' of ' + total + ' = ' + vals[i] + '.'] });
      return K.int('What angle at the centre of the pie chart is the <b>' + cats[i] + '</b> slice?', 360 * vals[i] / total, { suffix: '°', visual: vis, hint: 'The whole circle is 360°.', params: { vals: vals, i: i, total: total, k: 'deg' }, sol: [vals[i] + ' out of ' + total + ' is ' + F(vals[i] / OM.gcd(vals[i], total), total / OM.gcd(vals[i], total)) + '.', 'That fraction of 360° = ' + 360 * vals[i] / total + '°.'] });
    },
    verify: function (q) { var p = q.params; if (K.sum(p.vals) !== p.total) return false; if (p.k === 'n') return q.check.value === p.vals[p.i]; return K.mulCheck(q.check.value, p.total) === K.mulCheck(360, p.vals[p.i]); } });

  K.gen({ id: 'y6Mean', objective: 'Y6-S-02', title: 'The mean',
    make: function (r, L) {
      var n = r.int(3, L === 1 ? 4 : 6), m = r.int(10, 40), xs = [];
      for (var i = 0; i < n - 1; i++) xs.push(m + r.int(-8, 8));
      xs.push(m * n - K.sum(xs)); if (xs[n - 1] <= 0) { xs = xs.map(function (x, j) { return j % 2 ? m + 3 : m - 3; }); if (n % 2) xs[n - 1] = m; }
      if (L < 3) return K.int('Find the <b>mean</b> of: &nbsp;<b>' + xs.join(', ') + '</b>', m, { hint: 'Add them up, then divide by how many numbers there are.', params: { xs: xs, k: 'mean' }, sol: ['Total: ' + xs.join(' + ') + ' = ' + K.sum(xs) + '.', K.sum(xs) + ' ÷ ' + n + ' = ' + m + '.'] });
      var known = xs.slice(0, n - 1);
      return K.int('The mean of ' + n + ' numbers is ' + m + '. The first ' + (n - 1) + ' are ' + known.join(', ') + '. What is the last number?', xs[n - 1], { hint: 'The total must be ' + n + ' × ' + m + ' = ' + n * m + '.', params: { xs: xs, m: m, k: 'missing' },
        sol: ['Total needed: ' + n + ' × ' + m + ' = ' + n * m + '.', 'So far: ' + K.sum(known) + '.', n * m + ' − ' + K.sum(known) + ' = ' + xs[n - 1] + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'mean') return K.mulCheck(q.check.value, p.xs.length) === p.xs.reduce(function (s, x) { return K.addCheck(s, x); }, 0); return p.xs.slice(0, -1).reduce(function (s, x) { return K.addCheck(s, x); }, q.check.value) === K.mulCheck(p.m, p.xs.length); } });
})(typeof window !== 'undefined' ? window : globalThis);
