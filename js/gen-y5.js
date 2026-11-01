/* Learn with Pip — Year 5 question generators. Numbers up to 1,000,000; decimals to 3 places; negative numbers in context.
   Each generator's verify() works the answer out a different way from make(). Levels: 1 getting there, 2 expected, 3 greater depth. */
(function (G) {
  'use strict';
  var OM = G.OM, K = OM.kit, V = OM.V, S = K.S, fmt = OM.fmt, F = K.fr;
  function neg(n) { return n < 0 ? '−' + fmt(-n) : fmt(n); }
  function opts(r, correct, wrongs) { var seen = {}, out = [correct].concat(wrongs).filter(function (x) { var k = String(x); if (seen[k]) return false; seen[k] = 1; return true; }); return r.shuffle(out).map(function (x) { return { value: String(x), label: typeof x === 'number' ? fmt(x) : String(x) }; }); }
  function dstr(th) { return K.fromTh(th); }
  function fd(th) { var parts = dstr(th).split('.'); return fmt(+parts[0]) + (parts[1] ? '.' + parts[1] : ''); }
  var PLACES = ['hundred thousands', 'ten thousands', 'thousands', 'hundreds', 'tens', 'ones'], PVAL = [100000, 10000, 1000, 100, 10, 1];

  // ================= NUMBER AND PLACE VALUE =================
  K.gen({ id: 'y5PlaceValue', objective: 'Y5-NPV-01', title: 'Numbers to 1,000,000',
    make: function (r, L) {
      var n = r.int(100000, 999999), ds = String(n).split('').map(Number);
      if (L === 1) { var pos = r.int(0, 5); if (ds[pos] === 0) pos = 0; var val = ds[pos] * PVAL[pos];
        return K.int('What is the value of the digit <b>' + ds[pos] + '</b> in <b>' + fmt(n) + '</b>?', val, { hint: 'Find its column: ' + PLACES.join(', ') + '.', params: { n: n, pos: pos },
          sol: ['The ' + ds[pos] + ' is in the ' + PLACES[pos] + ' column.', 'Its value is ' + fmt(val) + '.'] }); }
      if (L === 2) { var w = K.toWords(n); return K.int('Write this number in digits: <b>' + w + '</b>', n, { hint: 'Write the thousands part, then the hundreds, tens and ones. Use 0 for empty columns.', params: { n: n, w: w },
        sol: ['"' + w + '" = ' + fmt(n) + '.'] }); }
      var base = Math.floor(n / 1000) * 1000, nums = r.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 4).map(function (k) { return base + k * 100 + r.int(0, 99); });
      if (r.chance(0.5)) nums = [n, n + 10000 > 999999 ? n - 10000 : n + 10000, Math.floor(n / 10), n - (n % 1000) + 999 > 999999 ? n - 1 : n - (n % 1000) + 999].filter(function (x, i, a) { return a.indexOf(x) === i; });
      var sorted = nums.slice().sort(function (a, b) { return b - a; });
      return K.order('Put these numbers in order, starting with the <b>largest</b>.', nums.map(function (x) { return { value: String(x), label: fmt(x) }; }), sorted.map(String), { hint: 'Count the digits first, then compare from the left.', params: { nums: nums },
        answer: sorted.map(fmt).join(', '), sol: ['Compare digit by digit from the biggest column.', 'Largest first: ' + sorted.map(fmt).join(', ') + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.pos !== undefined) return q.check.value === +(String(p.n)[p.pos] + '0'.repeat(5 - p.pos));
      if (p.w) return K.fromWords(p.w) === q.check.value;
      var s = p.nums.map(function (x) { return String(x).padStart(7, '0'); }).sort().reverse(); return s.map(Number).join() === q.check.order.join();
    } });

  K.gen({ id: 'y5PowersOf10', objective: 'Y5-NPV-02', title: 'Counting in powers of 10',
    make: function (r, L) {
      var step = L === 1 ? r.pick([10, 100, 1000]) : L === 2 ? r.pick([1000, 10000]) : r.pick([10000, 100000]), back = r.chance(0.5);
      var start = back ? r.int(step * 6, 999999) : r.int(0, 999999 - step * 6);
      if (L === 3) start = back ? r.int(600000, 999999) : r.int(1000, 399999);
      var terms = []; for (var i = 0; i < 6; i++) terms.push(start + (back ? -i : i) * step);
      var blanks = r.sample([1, 2, 3, 4, 5], 2).sort();
      return K.multi('Count ' + (back ? 'back' : 'on') + ' in steps of ' + fmt(step) + '. Write the missing numbers.', terms.map(function (t, i) { var b = blanks.indexOf(i); return b >= 0 ? '{' + b + '}' : fmt(t); }).join(', '),
        blanks.map(function (b) { return { kind: 'int', value: terms[b] }; }), { hint: 'Only some digits change. Watch out when a digit goes past 9 or below 0.', params: { terms: terms, step: step, back: back, blanks: blanks },
          answer: blanks.map(function (b) { return fmt(terms[b]); }).join(' and '), sol: [(back ? 'Subtract ' : 'Add ') + fmt(step) + ' each time.', terms.map(fmt).join(', ') + '.'] });
    },
    verify: function (q) { var p = q.params, t = p.terms; for (var i = 1; i < t.length; i++) if ((p.back ? K.subCheck(t[i - 1], p.step) : K.addCheck(t[i - 1], p.step)) !== t[i]) return false; return t.every(function (x) { return x >= 0 && x <= 1000000; }) && q.check.parts.every(function (c, i) { return c.value === t[p.blanks[i]]; }); } });

  K.gen({ id: 'y5Negative', objective: 'Y5-NPV-03', title: 'Negative numbers',
    make: function (r, L) {
      if (L === 1) { var s = r.int(1, 3), st = r.pick([1, 2, 5]), terms = []; for (var i = 0; i < 6; i++) terms.push(s * st - i * st); var bl = [4, 5];
        return K.multi('Count back in ' + st + 's. Write the missing numbers.', terms.map(function (t, i) { var b = bl.indexOf(i); return b >= 0 ? '{' + b + '}' : neg(t); }).join(', '), bl.map(function (b) { return { kind: 'int', value: terms[b] }; }),
          { blanks: [{ keys: 'signed' }, { keys: 'signed' }], hint: 'Keep subtracting ' + st + ', even past zero.', params: { terms: terms, st: st }, answer: bl.map(function (b) { return neg(terms[b]); }).join(' and '), sol: ['The sequence is ' + terms.map(neg).join(', ') + '.'] }); }
      var a = r.int(-12, 8), b = r.int(-12, 15); while (a === b || (a >= 0 && b >= 0)) { a = r.int(-12, 8); b = r.int(-12, 15); }
      if (L === 2) { var hi = Math.max(a, b), lo = Math.min(a, b);
        return K.int('At night the temperature was ' + neg(lo) + '°C. At midday it was ' + neg(hi) + '°C. By how many degrees did it rise?', hi - lo, { suffix: '°C', hint: 'Count up from ' + neg(lo) + ' to 0, then on to ' + neg(hi) + '.', params: { a: lo, b: hi },
          visual: V.numberLine({ min: Math.min(-12, lo), max: Math.max(10, hi), step: 1, labelEvery: 2, format: neg, hops: [{ from: lo, to: hi, label: '+' + (hi - lo) }] }), sol: [lo < 0 && hi > 0 ? 'From ' + neg(lo) + ' to 0 is ' + (-lo) + '. From 0 to ' + hi + ' is ' + hi + '.' : 'Count the steps from ' + neg(lo) + ' to ' + neg(hi) + '.', 'It rose by ' + (hi - lo) + ' degrees.'] }); }
      var t0 = r.int(-5, 9), ch = -r.int(6, 15);
      return K.int('The temperature is ' + neg(t0) + '°C. It falls by ' + (-ch) + ' degrees. What is the new temperature?', t0 + ch, { keys: 'signed', suffix: '°C', hint: 'Count back ' + (-ch) + ' from ' + neg(t0) + '.', params: { t0: t0, ch: ch },
        sol: ['Count back ' + (-ch) + ' degrees from ' + neg(t0) + '.', 'The new temperature is ' + neg(t0 + ch) + '°C.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.terms) return p.terms.every(function (x, i, t) { return i === 0 || t[i - 1] - x === p.st; }) && p.terms.some(function (x) { return x < 0; });
      if (p.t0 !== undefined) { var x = p.t0; for (var i = 0; i < -p.ch; i++) x--; return x === q.check.value; }
      var c = 0, y = p.a; while (y < p.b) { y++; c++; } return c === q.check.value;
    } });

  K.gen({ id: 'y5Rounding', objective: 'Y5-NPV-04', title: 'Rounding to 1,000,000',
    make: function (r, L) {
      var to = L === 1 ? r.pick([10, 100, 1000]) : L === 2 ? r.pick([1000, 10000]) : r.pick([10000, 100000]), n = r.int(10000, 994999);
      if (L === 3 && r.chance(0.5)) n = Math.floor(n / to) * to + to / 2; // exactly halfway: rounds up
      var ans = Math.round(n / to) * to;
      return K.int('Round <b>' + fmt(n) + '</b> to the nearest <b>' + fmt(to) + '</b>.', ans, { hint: 'Look at the digit to the right of the ' + fmt(to) + 's column. 5 or more rounds up.', params: { n: n, to: to },
        sol: ['The ' + fmt(to) + 's either side are ' + fmt(Math.floor(n / to) * to) + ' and ' + fmt(Math.floor(n / to) * to + to) + '.', 'Look at the next digit: it is ' + Math.floor((n % to) / (to / 10)) + ', so round ' + ((n % to) >= to / 2 ? 'up' : 'down') + ' to ' + fmt(ans) + '.'] });
    },
    verify: function (q) { var p = q.params, s = String(p.n), keep = s.length - String(p.to).length + 1, next = +s[keep], head = +s.slice(0, keep); return q.check.value === (next >= 5 ? head + 1 : head) * p.to; } });

  K.gen({ id: 'y5NumProblems', objective: 'Y5-NPV-05', title: 'Number puzzles to 1,000,000',
    make: function (r, L) {
      if (L === 1) { var ds = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 5); var big = +ds.slice().sort(function (a, b) { return b - a; }).join('');
        return K.int('Use each digit once: <b>' + ds.join(', ') + '</b>. What is the <b>largest</b> 5-digit number you can make?', big, { hint: 'Biggest digit in the biggest column.', params: { ds: ds, want: 'max' }, sol: ['Order the digits from biggest to smallest: ' + fmt(big) + '.'] }); }
      if (L === 2) { var r0 = r.int(12, 98) * 1000; return K.int('A number rounds to <b>' + fmt(r0) + '</b> to the nearest thousand. What is the <b>smallest</b> whole number it could be?', r0 - 500, { hint: 'Halfway numbers round up.', params: { r0: r0, k: 'min' },
        sol: [fmt(r0 - 500) + ' is halfway between ' + fmt(r0 - 1000) + ' and ' + fmt(r0) + ', and halfway rounds up.', 'So the smallest is ' + fmt(r0 - 500) + '.'] }); }
      var r1 = r.int(12, 98) * 1000; return K.int('A number rounds to <b>' + fmt(r1) + '</b> to the nearest thousand. What is the <b>largest</b> whole number it could be?', r1 + 499, { hint: 'The next whole number up would round to ' + fmt(r1 + 1000) + '.', params: { r0: r1, k: 'max' },
        sol: [fmt(r1 + 500) + ' would round up to ' + fmt(r1 + 1000) + '.', 'So the largest is ' + fmt(r1 + 499) + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.ds) { var best = 0; (function go(a, rest) { if (!rest.length) { best = Math.max(best, +a.join('')); return; } rest.forEach(function (d, i) { go(a.concat([d]), rest.slice(0, i).concat(rest.slice(i + 1))); }); })([], p.ds); return best === q.check.value; }
      var v = q.check.value, ok = Math.round(v / 1000) * 1000 === p.r0, edge = p.k === 'min' ? Math.round((v - 1) / 1000) * 1000 !== p.r0 : Math.round((v + 1) / 1000) * 1000 !== p.r0;
      return ok && edge;
    } });

  K.gen({ id: 'y5Roman', objective: 'Y5-NPV-06', title: 'Roman numerals to M',
    make: function (r, L) {
      var n = L === 1 ? r.int(40, 400) : L === 2 ? r.int(400, 1000) : r.int(1066, 2050), rn = romanBig(n);
      return K.int(L === 3 ? 'A building has <b class="roman">' + rn + '</b> carved over the door. What year is that?' : 'What number is <b class="roman">' + rn + '</b>?', n, { hint: 'M = 1000, D = 500, C = 100, L = 50, X = 10, V = 5, I = 1. A smaller numeral before a bigger one is subtracted.', params: { n: n, rn: rn },
        sol: ['Split it up: ' + rn.match(/M|CM|D|CD|C{1,3}|XC|L|XL|X{1,3}|IX|V|IV|I{1,3}/g).join(' + ') + '.', 'That is ' + n + '.'] });
    },
    verify: function (q) { var M = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 }, s = q.params.rn, t = 0; for (var i = 0; i < s.length; i++) { var v = M[s[i]], nx = M[s[i + 1]] || 0; t += v < nx ? -v : v; } return t === q.check.value; } });
  function romanBig(n) { var map = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']], out = ''; map.forEach(function (m) { while (n >= m[0]) { out += m[1]; n -= m[0]; } }); return out; }

  // ================= ADDITION AND SUBTRACTION =================
  function frames(a, b, op) { return V.columnFrames(a, b, op).map(function (f) { return S(f.text, f.html); }); }
  K.gen({ id: 'y5ColAdd', objective: 'Y5-AS-01', title: 'Column addition with large numbers',
    make: function (r, L) {
      var a = L === 1 ? r.int(10000, 49999) : r.int(100000, 499999), b = L === 1 ? r.int(1000, 9999) : L === 2 ? r.int(10000, 99999) : r.int(100000, 499999);
      return { prompt: 'Use column addition to work out <b>' + fmt(a) + ' + ' + fmt(b) + '</b>.', input: { type: 'column', a: a, b: b, op: '+' }, check: { kind: 'int', value: a + b },
        hint: 'Line up the ones. Start on the right and exchange when a column makes 10 or more.', params: { a: a, b: b }, solution: frames(a, b, '+') };
    },
    verify: function (q) { return K.addCheck(q.params.a, q.params.b) === q.check.value && q.check.value <= 1000000; } });
  K.gen({ id: 'y5ColSub', objective: 'Y5-AS-01', title: 'Column subtraction with large numbers',
    make: function (r, L) {
      var a = L === 1 ? r.int(20000, 99999) : L === 2 ? r.int(100000, 999999) : r.int(1, 9) * 100000 + r.pick([0, r.int(1, 9) * 100]), b = L === 1 ? r.int(1000, 9999) : r.int(10000, a - 1000);
      return { prompt: 'Use column subtraction to work out <b>' + fmt(a) + ' − ' + fmt(b) + '</b>.', input: { type: 'column', a: a, b: b, op: '−' }, check: { kind: 'int', value: a - b },
        hint: 'Start with the ones. Exchange from the next column when the top digit is too small.', params: { a: a, b: b }, solution: frames(a, b, '−').concat([S('Check: ' + fmt(a - b) + ' + ' + fmt(b) + ' = ' + fmt(a) + ' ✓')]) };
    },
    verify: function (q) { return K.subCheck(q.params.a, q.params.b) === q.check.value && q.check.value > 0; } });

  K.gen({ id: 'y5MentalAS', objective: 'Y5-AS-02', title: 'Mental adding and subtracting',
    make: function (r, L) {
      var a = L === 1 ? r.int(10, 99) * 1000 + r.int(0, 9) * 100 : r.int(100, 900) * 1000 + r.int(0, 99) * 10, b = L === 1 ? r.int(1, 9) * 1000 : L === 2 ? r.int(11, 99) * 1000 : r.int(2, 9) * 1000 - r.pick([1, 2, 10]);
      var add = r.chance(0.5); if (!add && b > a) add = true;
      return K.int('Work out in your head: <b>' + fmt(a) + (add ? ' + ' : ' − ') + fmt(b) + '</b>', add ? a + b : a - b, { hint: L === 3 ? fmt(b) + ' is close to ' + fmt(b + (1000 - b % 1000) % 1000) + '. Use that, then adjust.' : 'Work with the thousands.', params: { a: a, b: b, add: add },
        sol: L === 3 ? [(add ? 'Add ' : 'Subtract ') + fmt(b + (1000 - b % 1000) % 1000) + ', then ' + (add ? 'take away ' : 'add back ') + ((1000 - b % 1000) % 1000) + '.', 'Answer: ' + fmt(add ? a + b : a - b) + '.'] : [fmt(a) + (add ? ' + ' : ' − ') + fmt(b) + ' = ' + fmt(add ? a + b : a - b) + '.'] });
    },
    verify: function (q) { var p = q.params; return (p.add ? K.addCheck(p.a, p.b) : K.subCheck(p.a, p.b)) === q.check.value; } });

  K.gen({ id: 'y5RoundCheck', objective: 'Y5-AS-03', title: 'Using rounding to check',
    make: function (r, L) {
      var a = r.int(1100, 8900), b = r.int(1100, 8900), add = r.chance(0.6); if (!add && b > a) { var t = a; a = b; b = t; }
      var exact = add ? a + b : a - b, est = add ? Math.round(a / 1000) * 1000 + Math.round(b / 1000) * 1000 : Math.round(a / 1000) * 1000 - Math.round(b / 1000) * 1000;
      if (L < 3) return K.choice('Round each number to the nearest thousand to <b>estimate</b> ' + fmt(a) + (add ? ' + ' : ' − ') + fmt(b) + '.', opts(r, est, [est + 1000, est - 1000 >= 0 ? est - 1000 : est + 2000, exact]), String(est),
        { hint: 'Round first, then calculate.', params: { a: a, b: b, add: add, est: est }, sol: [fmt(a) + ' ≈ ' + fmt(Math.round(a / 1000) * 1000) + ' and ' + fmt(b) + ' ≈ ' + fmt(Math.round(b / 1000) * 1000) + '.', 'Estimate: ' + fmt(est) + '.'] });
      var wrong = exact + r.pick([9000, -9000, 900, 10000]); if (wrong < 0) wrong = exact + 9000;
      var shown = r.chance(0.5) ? exact : wrong;
      return K.choice('Zara works out ' + fmt(a) + (add ? ' + ' : ' − ') + fmt(b) + ' = ' + fmt(shown) + '. Use an estimate to decide: is her answer <b>sensible</b>?', [{ value: 'yes', label: 'Yes, it is close to the estimate' }, { value: 'no', label: 'No, it is far from the estimate' }], Math.abs(shown - est) <= 1500 ? 'yes' : 'no',
        { hint: 'Estimate first: round each number to the nearest thousand.', params: { a: a, b: b, add: add, est: est, shown: shown }, sol: ['Estimate: ' + fmt(est) + '.', fmt(shown) + (Math.abs(shown - est) <= 1500 ? ' is close, so it is sensible.' : ' is far away, so it must be wrong.')] });
    },
    verify: function (q) { var p = q.params, r = function (x) { return Math.round(x / 1000) * 1000; }, e = p.add ? r(p.a) + r(p.b) : r(p.a) - r(p.b); if (e !== p.est) return false; return p.shown === undefined ? +q.check.value === e : q.check.value === (Math.abs(p.shown - e) <= 1500 ? 'yes' : 'no'); } });

  K.gen({ id: 'y5MultiStep', objective: 'Y5-AS-04', title: 'Multi-step problems',
    make: function (r, L) {
      var place = r.pick(['A football club', 'A theme park', 'A museum', 'A concert hall']);
      var a = r.int(12000, 48000), b = r.int(8000, 30000), c = r.int(2000, 15000);
      if (L === 1) return K.int(place + ' had ' + fmt(a) + ' visitors in June and ' + fmt(b) + ' in July. How many visitors altogether?', a + b, { hint: 'Altogether means add.', params: { s: [a, b], ops: ['+'] }, sol: [fmt(a) + ' + ' + fmt(b) + ' = ' + fmt(a + b) + '.'] });
      if (L === 2) return K.int(place + ' had ' + fmt(a) + ' visitors on Saturday and ' + fmt(b) + ' on Sunday. ' + fmt(c) + ' of them were children. How many adults visited?', a + b - c, { hint: 'First find the total, then subtract the children.', params: { s: [a, b, c], ops: ['+', '-'] },
        sol: ['Total: ' + fmt(a) + ' + ' + fmt(b) + ' = ' + fmt(a + b) + '.', 'Adults: ' + fmt(a + b) + ' − ' + fmt(c) + ' = ' + fmt(a + b - c) + '.'] });
      var target = (Math.ceil((a + b) / 1000) + r.int(2, 30)) * 1000;
      return K.int(place + ' wants ' + fmt(target) + ' visitors this summer. So far it has had ' + fmt(a) + ' in July and ' + fmt(b) + ' in August. How many more visitors does it need?', target - a - b, { hint: 'Add what it has had, then find the difference from the target.', params: { s: [target, a, b], ops: ['-', '-'] },
        sol: ['So far: ' + fmt(a) + ' + ' + fmt(b) + ' = ' + fmt(a + b) + '.', 'Still needed: ' + fmt(target) + ' − ' + fmt(a + b) + ' = ' + fmt(target - a - b) + '.'] });
    },
    verify: function (q) { var p = q.params, v = p.s[0]; p.ops.forEach(function (op, i) { v = op === '+' ? K.addCheck(v, p.s[i + 1]) : K.subCheck(v, p.s[i + 1]); }); return v === q.check.value && v > 0; } });

  // ================= MULTIPLICATION AND DIVISION =================
  K.gen({ id: 'y5Factors', objective: 'Y5-MD-01', title: 'Factors and multiples',
    make: function (r, L) {
      if (L === 1) { var n = r.pick([12, 18, 20, 24, 30, 36, 40, 42, 48, 60]), fs = K.factorPairs(n), f = r.pick(fs), nf = r.pick([7, 9, 11, 13, 14, 16, 25].filter(function (x) { return n % x !== 0; }));
        return K.choice('Which of these is a <b>factor</b> of ' + n + '?', opts(r, f[0] === 1 ? f[1] : f[0], [nf, n + f[0], n * 2]), String(f[0] === 1 ? f[1] : f[0]), { hint: 'A factor divides into ' + n + ' exactly.', params: { n: n },
          sol: ['The factor pairs of ' + n + ' are ' + fs.map(function (x) { return x.join(' × '); }).join(', ') + '.'] }); }
      if (L === 2) { var m = r.pick([12, 16, 18, 20, 24, 28, 30, 32, 36]), ps = K.factorPairs(m);
        return K.int('How many factors does <b>' + m + '</b> have?', ps.reduce(function (s, x) { return s + (x[0] === x[1] ? 1 : 2); }, 0), { hint: 'Find the factor pairs: 1 × ' + m + ', 2 × …', params: { n: m },
          sol: ['Factor pairs: ' + ps.map(function (x) { return x.join(' × '); }).join(', ') + '.', 'Count every different factor.'] }); }
      var pr = r.pick([[12, 18], [16, 24], [20, 30], [18, 27], [24, 36], [15, 25], [28, 42]]), hcf = OM.gcd(pr[0], pr[1]);
      return K.int('What is the <b>largest common factor</b> of ' + pr[0] + ' and ' + pr[1] + '?', hcf, { hint: 'List the factors of both numbers and find the biggest one in both lists.', params: { a: pr[0], b: pr[1] },
        sol: ['Factors of ' + pr[0] + ': ' + facs(pr[0]).join(', ') + '.', 'Factors of ' + pr[1] + ': ' + facs(pr[1]).join(', ') + '.', 'The largest in both lists is ' + hcf + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.b !== undefined) { var common = facs(p.a).filter(function (x) { return p.b % x === 0; }); return Math.max.apply(null, common) === q.check.value; }
      if (q.check.kind === 'int') return facs(p.n).length === q.check.value;
      return p.n % +q.check.value === 0;
    } });
  function facs(n) { var out = []; for (var i = 1; i <= n; i++) if (n % i === 0) out.push(i); return out; }

  K.gen({ id: 'y5PrimeVocab', objective: 'Y5-MD-02', title: 'Prime, composite and prime factors',
    make: function (r, L) {
      if (L === 1) { var n = r.int(4, 40), p = K.isPrime(n);
        return K.choice('Is <b>' + n + '</b> a prime number or a composite number?', [{ value: 'prime', label: 'Prime' }, { value: 'composite', label: 'Composite' }], p ? 'prime' : 'composite', { hint: 'A prime number has exactly two factors: 1 and itself.', params: { n: n },
          sol: [p ? n + ' has only 2 factors, 1 and ' + n + ', so it is prime.' : n + ' = ' + K.factorPairs(n).filter(function (x) { return x[0] > 1; })[0].join(' × ') + ', so it has more than 2 factors: it is composite.'] }); }
      var m = r.pick([12, 18, 20, 28, 30, 42, 45, 50, 63, 66, 70]), pf = primeFactors(m);
      if (L === 2) { var big = Math.max.apply(null, pf); return K.int('What is the <b>largest prime factor</b> of ' + m + '?', big, { hint: 'Split ' + m + ' into factors until every factor is prime.', params: { n: m, k: 'max' },
        sol: [m + ' = ' + pf.join(' × ') + '.', 'The largest prime factor is ' + big + '.'] }); }
      return K.choice('Which shows ' + m + ' written as a product of <b>prime factors</b>?', r.shuffle([pf.join(' × '), K.factorPairs(m).filter(function (x) { return x[0] > 1; })[0].join(' × '), pf.slice(0, -1).join(' × ') + ' × ' + (pf[pf.length - 1] + 1)]).filter(function (x, i, a) { return a.indexOf(x) === i; }), pf.join(' × '),
        { hint: 'Every number in the answer must be prime, and they must multiply to make ' + m + '.', params: { n: m, k: 'all' }, sol: ['Keep splitting: ' + m + ' = ' + pf.join(' × ') + '. Every factor is prime.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (!p.k) return q.check.value === (K.isPrime(p.n) ? 'prime' : 'composite');
      var pf = primeFactors(p.n);
      if (p.k === 'max') return K.isPrime(q.check.value) && p.n % q.check.value === 0 && pf.every(function (x) { return x <= q.check.value; });
      var parts = String(q.check.value).split(' × ').map(Number); return parts.every(K.isPrime) && parts.reduce(function (a, b) { return a * b; }, 1) === p.n;
    } });
  function primeFactors(n) { var out = [], d = 2; while (n > 1) { while (n % d === 0) { out.push(d); n /= d; } d++; } return out; }

  K.gen({ id: 'y5IsPrime', objective: 'Y5-MD-03', title: 'Primes to 100',
    make: function (r, L) {
      if (L === 1) { var small = [2, 3, 5, 7, 11, 13, 17, 19], c = r.pick(small), w = r.sample([1, 4, 6, 9, 15, 21].filter(function (x) { return x !== c; }), 3);
        return K.choice('Which of these is a <b>prime number</b>?', opts(r, c, w), String(c), { hint: 'The primes up to 19 are 2, 3, 5, 7, 11, 13, 17 and 19.', params: { c: c }, sol: [c + ' is prime: its only factors are 1 and ' + c + '.'] }); }
      var n = r.int(20, 99); if (L === 3 && r.chance(0.6)) n = r.pick([51, 57, 87, 91, 93, 49, 77, 69]);
      var p = K.isPrime(n);
      return K.choice('Is <b>' + n + '</b> a prime number?', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], p ? 'yes' : 'no', { hint: 'Try dividing by 2, 3, 5 and 7.', params: { n: n },
        sol: [p ? 'It does not divide exactly by 2, 3, 5 or 7, so ' + n + ' is prime.' : n + ' = ' + K.factorPairs(n).filter(function (x) { return x[0] > 1; })[0].join(' × ') + ', so it is not prime.'] });
    },
    verify: function (q) { var p = q.params; if (p.c) return facs(+q.check.value).length === 2; return q.check.value === (facs(p.n).length === 2 ? 'yes' : 'no'); } });

  K.gen({ id: 'y5LongMult', objective: 'Y5-MD-04', title: 'Short and long multiplication',
    make: function (r, L) {
      var a, b;
      if (L === 1) { a = r.int(120, 999); b = r.int(3, 9); }
      else if (L === 2) { a = r.int(1100, 9999); b = r.int(3, 9); }
      else { a = r.int(23, 99) * (r.chance(0.5) ? 1 : 10) + r.int(0, 9); a = Math.min(a, 999); b = r.int(12, 89); }
      var sol = b < 10 ? ['Multiply each digit by ' + b + ', starting with the ones, and carry when you need to.', fmt(a) + ' × ' + b + ' = ' + fmt(a * b) + '.']
        : ['Long multiplication: ' + fmt(a) + ' × ' + (b % 10) + ' = ' + fmt(a * (b % 10)) + '.', fmt(a) + ' × ' + (b - b % 10) + ' = ' + fmt(a * (b - b % 10)) + '.', 'Add: ' + fmt(a * (b % 10)) + ' + ' + fmt(a * (b - b % 10)) + ' = ' + fmt(a * b) + '.'];
      return K.int('Work out <b>' + fmt(a) + ' × ' + b + '</b>.', a * b, { hint: b < 10 ? 'Use short multiplication.' : 'Multiply by the ones digit, then by the tens, then add.', params: { a: a, b: b }, sol: sol });
    },
    verify: function (q) { var p = q.params, tot = 0; String(p.b).split('').reverse().forEach(function (d, i) { tot = K.addCheck(tot, K.mulCheck(p.a, +d) * Math.pow(10, i)); }); return tot === q.check.value; } });

  K.gen({ id: 'y5MentalMD', objective: 'Y5-MD-05', title: 'Mental multiplying and dividing',
    make: function (r, L) {
      var a = r.int(2, 9), b = r.int(2, 9), pa = L === 1 ? 10 : 100, pb = L === 3 ? 10 : 1;
      if (r.chance(0.5)) return K.int('Work out in your head: <b>' + fmt(a * pa) + ' × ' + fmt(b * pb) + '</b>', a * pa * b * pb, { hint: 'Use ' + a + ' × ' + b + ' = ' + a * b + ', then adjust for the zeros.', params: { a: a * pa, b: b * pb, op: '×' },
        sol: [a + ' × ' + b + ' = ' + a * b + '.', fmt(a * pa) + ' × ' + fmt(b * pb) + ' = ' + fmt(a * pa * b * pb) + '.'] });
      var prod = a * b * pa;
      return K.int('Work out in your head: <b>' + fmt(prod) + ' ÷ ' + b + '</b>', a * pa, { hint: 'Use the fact ' + a + ' × ' + b + ' = ' + a * b + '.', params: { a: prod, b: b, op: '÷' }, sol: [a * b + ' ÷ ' + b + ' = ' + a + ', so ' + fmt(prod) + ' ÷ ' + b + ' = ' + fmt(a * pa) + '.'] });
    },
    verify: function (q) { var p = q.params; return p.op === '×' ? K.mulCheck(p.a, p.b) === q.check.value : K.mulCheck(q.check.value, p.b) === p.a; } });

  K.gen({ id: 'y5ShortDiv', objective: 'Y5-MD-06', title: 'Short division and remainders',
    make: function (r, L) {
      var d = r.int(3, 9);
      if (L < 3) { var qn = L === 1 ? r.int(21, 99) : r.int(120, 1100), rem = L === 1 ? 0 : r.int(0, d - 1), n = qn * d + rem;
        if (L === 1) return K.int('Use short division: <b>' + fmt(n) + ' ÷ ' + d + '</b>', qn, { hint: 'Divide each digit by ' + d + ' from the left, carrying any remainder.', params: { n: n, d: d, mode: 'exact' }, sol: [fmt(n) + ' ÷ ' + d + ' = ' + fmt(qn) + '.', 'Check: ' + fmt(qn) + ' × ' + d + ' = ' + fmt(n) + ' ✓'] });
        return K.multi('Use short division: <b>' + fmt(n) + ' ÷ ' + d + '</b>', '{0} remainder {1}', [{ kind: 'int', value: qn }, { kind: 'int', value: rem }], { hint: 'The remainder must be less than ' + d + '.', params: { n: n, d: d, mode: 'rem' },
          answer: fmt(qn) + ' r ' + rem, sol: [fmt(n) + ' ÷ ' + d + ' = ' + fmt(qn) + ' remainder ' + rem + '.', 'Check: ' + fmt(qn) + ' × ' + d + ' + ' + rem + ' = ' + fmt(n) + ' ✓'] }); }
      var people = r.int(100, 600), per = r.int(4, 9), up = r.chance(0.5); while (people % per === 0) people++;
      var whole = Math.floor(people / per);
      return K.int(up ? people + ' people need taxis. Each taxi takes ' + per + ' people. How many taxis are needed?' : 'Eggs are packed in boxes of ' + per + '. There are ' + people + ' eggs. How many <b>full</b> boxes can be filled?', up ? whole + 1 : whole,
        { hint: 'Divide, then decide what to do with the remainder.', params: { n: people, d: per, mode: up ? 'up' : 'down' }, sol: [people + ' ÷ ' + per + ' = ' + whole + ' remainder ' + (people % per) + '.', up ? 'The remaining ' + (people % per) + ' people still need a taxi, so round up: ' + (whole + 1) + '.' : 'The leftover eggs do not fill a box, so the answer is ' + whole + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.mode === 'rem') { var qq = q.check.parts[0].value, rr = q.check.parts[1].value; return K.addCheck(K.mulCheck(qq, p.d), rr) === p.n && rr < p.d; }
      var c = 0, left = p.n; while (left >= p.d) { left -= p.d; c++; }
      return q.check.value === (p.mode === 'up' && left > 0 ? c + 1 : c);
    } });

  K.gen({ id: 'y5Times10', objective: 'Y5-MD-07', title: '× and ÷ by 10, 100 and 1,000',
    make: function (r, L) {
      var by = r.pick([10, 100, 1000]), mul = r.chance(0.5), th;
      // th is the number in thousandths: Level 1 whole numbers, Level 2 one decimal place, Level 3 two or three places
      if (L === 1) th = r.int(2, 99) * 1000; else if (L === 2) th = r.int(12, 999) * 100; else th = r.int(105, 9999) * r.pick([1, 10]);
      if (mul && th * by > 1e9) mul = false;
      if (!mul) { th = th - th % by; if (th < by) th = by * r.int(2, 9); }
      var ans = mul ? th * by : th / by, shift = String(by).length - 1;
      return K.dec('Work out <b>' + fd(th) + (mul ? ' × ' : ' ÷ ') + fmt(by) + '</b>.', dstr(ans), { hint: 'Each digit moves ' + shift + ' place' + (shift > 1 ? 's' : '') + (mul ? ' to the left.' : ' to the right.'), params: { th: th, by: by, mul: mul },
        sol: [(mul ? 'Multiplying' : 'Dividing') + ' by ' + fmt(by) + ' moves every digit ' + shift + ' place' + (shift > 1 ? 's' : '') + ' to the ' + (mul ? 'left' : 'right') + '.', fd(th) + (mul ? ' × ' : ' ÷ ') + fmt(by) + ' = ' + fd(ans) + '.'] });
    },
    // independent: move the decimal point in the written number
    verify: function (q) {
      var p = q.params, s0 = OM.fromScaled(p.th, 3), shift = String(p.by).length - 1, parts = s0.split('.'), digits = parts[0] + parts[1], point = parts[0].length + (p.mul ? shift : -shift);
      while (point > digits.length) digits += '0';
      while (point < 1) { digits = '0' + digits; point++; }
      return K.th(digits.slice(0, point) + '.' + digits.slice(point)) === K.th(q.check.value) && OM.decimalPlaces(q.check.value) <= 3 && K.th(q.check.value) <= 1e9;
    } });

  K.gen({ id: 'y5SquaresCubes', objective: 'Y5-MD-08', title: 'Square and cube numbers',
    make: function (r, L) {
      if (L === 1) { var n = r.int(2, 12); return K.int('Work out <b>' + n + '²</b>.', n * n, { hint: n + '² means ' + n + ' × ' + n + '.', params: { n: n, p: 2 }, sol: [n + '² = ' + n + ' × ' + n + ' = ' + n * n + '.'] }); }
      if (L === 2) { var m = r.int(2, 5); return K.int('Work out <b>' + m + '³</b>.', m * m * m, { hint: m + '³ means ' + m + ' × ' + m + ' × ' + m + '.', params: { n: m, p: 3 }, sol: [m + '³ = ' + m + ' × ' + m + ' × ' + m + ' = ' + m * m * m + '.'] }); }
      var sq = r.int(2, 12) * 1, c = sq * sq, w = [c + 1, c - 1, sq * 2].filter(function (x) { return Math.round(Math.sqrt(x)) ** 2 !== x; });
      return K.choice('Which of these is a <b>square number</b>?', opts(r, c, w.slice(0, 3)), String(c), { hint: 'A square number is a number times itself.', params: { c: c }, sol: [c + ' = ' + sq + ' × ' + sq + ', so it is a square number.'] });
    },
    verify: function (q) { var p = q.params; if (p.c) { var v = +q.check.value, s = 0; while (s * s < v) s++; return s * s === v; } var t = 1; for (var i = 0; i < p.p; i++) t = K.mulCheck(t, p.n); return t === q.check.value; } });

  K.gen({ id: 'y5FactorProblems', objective: 'Y5-MD-09', title: 'Factor, multiple, square and cube problems',
    make: function (r, L) {
      if (L === 1) { var a = r.pick([3, 4, 6]), b = r.pick([4, 5, 8, 10].filter(function (x) { return x !== a; })), lcm = a * b / OM.gcd(a, b);
        return K.int('Bus A comes every ' + a + ' minutes and bus B every ' + b + ' minutes. They both leave at 9:00. After how many minutes do they next leave together?', lcm, { suffix: 'minutes', hint: 'Find the first number that is a multiple of both ' + a + ' and ' + b + '.', params: { a: a, b: b, k: 'lcm' },
          sol: ['Multiples of ' + a + ': ' + [1, 2, 3, 4, 5, 6].map(function (i) { return a * i; }).join(', ') + '…', 'Multiples of ' + b + ': ' + [1, 2, 3, 4, 5].map(function (i) { return b * i; }).join(', ') + '…', 'The first one in both lists is ' + lcm + '.'] }); }
      if (L === 2) { var n = r.int(4, 12); return K.int('A square garden has an area of ' + n * n + ' m². How long is each side?', n, { suffix: 'm', hint: 'Which number times itself makes ' + n * n + '?', params: { sq: n * n, k: 'root' }, sol: [n + ' × ' + n + ' = ' + n * n + ', so each side is ' + n + ' m.'] }); }
      var cnum = r.int(2, 5); return K.int('A cube is built from ' + cnum * cnum * cnum + ' small cubes. How many small cubes long is each edge?', cnum, { hint: 'Which number cubed makes ' + cnum * cnum * cnum + '?', params: { cube: cnum * cnum * cnum, k: 'croot' },
        sol: [cnum + ' × ' + cnum + ' × ' + cnum + ' = ' + cnum * cnum * cnum + '.', 'Each edge is ' + cnum + ' cubes long.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; if (p.k === 'lcm') { for (var t = 1; t < v; t++) if (t % p.a === 0 && t % p.b === 0) return false; return v % p.a === 0 && v % p.b === 0; } if (p.k === 'root') return K.mulCheck(v, v) === p.sq; return K.mulCheck(K.mulCheck(v, v), v) === p.cube; } });

  K.gen({ id: 'y5FourOps', objective: 'Y5-MD-10', title: 'Using all four operations; the equals sign',
    make: function (r, L) {
      if (L === 1) { var a = r.int(3, 9), b = r.int(3, 9), c = r.int(10, 60);
        return K.int('Work out <b>' + c + ' + ' + a + ' × ' + b + '</b>.', c + a * b, { hint: 'Multiply before you add.', params: { a: a, b: b, c: c, k: 'order' }, sol: ['Multiplication comes first: ' + a + ' × ' + b + ' = ' + a * b + '.', c + ' + ' + a * b + ' = ' + (c + a * b) + '.'] }); }
      var x = r.int(3, 9), y = r.int(3, 9), left = x * y, k = r.int(left + 5, left + 60);
      return K.multi('Find the missing number. The equals sign means both sides have the same value.', x + ' × ' + y + ' = ' + k + ' − {0}', [{ kind: 'int', value: k - left }], { hint: 'Work out the left side first. Then what must you take from ' + k + ' to get the same?', params: { x: x, y: y, k: k },
        sol: [x + ' × ' + y + ' = ' + left + '.', k + ' − ? = ' + left + ', so ? = ' + k + ' − ' + left + ' = ' + (k - left) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'order') return K.addCheck(p.c, K.mulCheck(p.a, p.b)) === q.check.value; return K.subCheck(p.k, q.check.parts[0].value) === K.mulCheck(p.x, p.y); } });

  K.gen({ id: 'y5Scaling', objective: 'Y5-MD-11', title: 'Scaling and rates',
    make: function (r, L) {
      if (L === 1) { var each = r.int(12, 45), n = r.int(3, 9), m = r.int(4, 12); return K.money(n + ' pencils cost ' + OM.money(each * n) + '. How much do ' + m + ' pencils cost?', each * m, each * m >= 100 ? '£' : 'p', { hint: 'Find the cost of 1 pencil first.', params: { tot: each * n, n: n, m: m },
        sol: ['1 pencil costs ' + OM.money(each * n) + ' ÷ ' + n + ' = ' + each + 'p.', m + ' pencils cost ' + m + ' × ' + each + 'p = ' + OM.money(each * m) + '.'] }); }
      if (L === 2) { var d = r.pick([2, 3, 4, 5]), big = d * r.int(4, 25); return K.int('A recipe for 12 cakes uses ' + big + ' g of sugar. How much sugar is needed for a recipe that is ' + F(1, d) + ' of the size?', big / d, { suffix: 'g', hint: 'Find ' + F(1, d) + ' of ' + big + '.', params: { big: big, d: d, k: 'frac' }, sol: [big + ' ÷ ' + d + ' = ' + big / d + ' g.'] }); }
      var speed = r.int(3, 9) * 10, hrs = r.int(2, 5); return K.int('A train travels ' + speed + ' km every hour. How far does it travel in ' + hrs + ' hours?', speed * hrs, { suffix: 'km', hint: 'Multiply the rate by the time.', params: { big: speed, d: hrs, k: 'rate' }, sol: [speed + ' × ' + hrs + ' = ' + speed * hrs + ' km.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'frac') return K.mulCheck(q.check.value, p.d) === p.big; if (p.k === 'rate') return K.mulCheck(p.big, p.d) === q.check.value; return K.mulCheck(p.tot / p.n, p.m) === q.check.pence && K.mulCheck(p.tot / p.n, p.n) === p.tot; } });

  // ================= FRACTIONS, DECIMALS AND PERCENTAGES =================
  K.gen({ id: 'y5FracCompare', objective: 'Y5-F-01', title: 'Comparing fractions',
    make: function (r, L) {
      var base = r.pick([2, 3, 4, 5]), k = r.pick([2, 3]), d1 = base, d2 = base * k, n1 = r.int(1, d1 - 1), n2 = r.int(1, d2 - 1);
      if (n1 * k === n2) n2 = n2 === d2 - 1 ? n2 - 1 : n2 + 1;
      if (L < 3) { var big = n1 * k > n2 ? 'a' : 'b';
        return K.choice('Which fraction is <b>larger</b>?', [{ value: 'a', label: F(n1, d1) }, { value: 'b', label: F(n2, d2) }], big, { big: true, hint: 'Change ' + F(n1, d1) + ' into ' + d2 + 'ths.', params: { f: [[n1, d1], [n2, d2]], k: 'max' },
          sol: [F(n1, d1) + ' = ' + F(n1 * k, d2) + '.', 'Compare ' + F(n1 * k, d2) + ' and ' + F(n2, d2) + '.'] }); }
      var used = [n1 * k], fr = [[n1, d1]];
      while (fr.length < 3) { var nn = r.int(1, d2 - 1); if (used.indexOf(nn) < 0) { used.push(nn); fr.push([nn, d2]); } }
      var ord = fr.slice().sort(function (a, b) { return a[0] * b[1] - b[0] * a[1]; });
      return K.order('Put these fractions in order, starting with the <b>smallest</b>.', fr.map(function (f) { return { value: f.join('/'), label: F(f[0], f[1]) }; }), ord.map(function (f) { return f.join('/'); }), { hint: 'Make all the denominators the same.', params: { f: fr, k: 'order' },
        answer: ord.map(function (f) { return f.join('/'); }).join(', '), sol: ['Change them all to ' + d2 + 'ths, then compare the numerators.'] });
    },
    verify: function (q) { var p = q.params, v = function (f) { return f[0] / f[1]; }; if (p.k === 'max') return q.check.value === (v(p.f[0]) > v(p.f[1]) ? 'a' : 'b'); return q.check.order.every(function (s, i, a) { if (!i) return true; var x = a[i - 1].split('/'), y = s.split('/'); return x[0] / x[1] < y[0] / y[1]; }); } });

  K.gen({ id: 'y5Equiv', objective: 'Y5-F-02', title: 'Equivalent fractions; tenths and hundredths',
    make: function (r, L) {
      if (L === 1) { var t = r.int(1, 9); return K.frac('Write ' + F(t, 10) + ' as an equivalent fraction in <b>hundredths</b>.', t * 10, 100, { form: 'denominator', denom: 100, visual: V.fractionBar(10, t), hint: '1 tenth = 10 hundredths.', params: { n: t, d: 10, D: 100 },
        sol: ['Multiply the numerator and denominator by 10.', F(t, 10) + ' = ' + F(t * 10, 100) + '.'] }); }
      var d = r.pick([3, 4, 5, 6, 8]), n = r.int(1, d - 1), m = r.int(2, L === 2 ? 4 : 6);
      if (L === 2) return K.frac('Find the missing number: &nbsp;' + F(n, d) + ' = ?/' + d * m, n * m, d * m, { form: 'denominator', denom: d * m, hint: 'What has ' + d + ' been multiplied by?', params: { n: n, d: d, D: d * m },
        sol: [d + ' × ' + m + ' = ' + d * m + '.', n + ' × ' + m + ' = ' + n * m + '.'] });
      var big = [n * m, d * m], g = OM.gcd(big[0], big[1]);
      return K.frac('Write ' + F(big[0], big[1]) + ' in its <b>simplest form</b>.', big[0] / g, big[1] / g, { form: 'simplest', hint: 'Divide the numerator and denominator by their largest common factor.', params: { n: big[0], d: big[1], simp: true },
        sol: ['The largest common factor of ' + big[0] + ' and ' + big[1] + ' is ' + g + '.', 'Divide both by ' + g + ': ' + F(big[0] / g, big[1] / g) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.simp) return q.check.n * p.d === p.n * q.check.d && OM.gcd(q.check.n, q.check.d) === 1; return q.check.n * p.d === p.n * q.check.d && q.check.d === p.D; } });

  K.gen({ id: 'y5MixedImproper', objective: 'Y5-F-03', title: 'Mixed numbers and improper fractions',
    make: function (r, L) {
      var d = r.int(2, 9), w = r.int(1, 5), n = r.int(1, d - 1), imp = w * d + n;
      if (L === 1) return K.frac('Write ' + F(n, d, w) + ' as an <b>improper fraction</b>.', imp, d, { noMixed: true, hint: 'Each whole is ' + d + ' ' + (d === 2 ? 'halves' : 'parts') + '.', params: { w: w, n: n, d: d },
        sol: [w + ' wholes = ' + w * d + ' parts of size ' + F(1, d) + '.', w * d + ' + ' + n + ' = ' + imp + ', so ' + F(n, d, w) + ' = ' + F(imp, d) + '.'] });
      if (L === 2) return K.frac('Write ' + F(imp, d) + ' as a <b>mixed number</b>.', imp, d, { mixed: true, hint: 'How many wholes can you make from ' + imp + ' ' + (d === 2 ? 'halves' : 'parts') + '?', params: { w: w, n: n, d: d },
        sol: [imp + ' ÷ ' + d + ' = ' + w + ' remainder ' + n + '.', F(imp, d) + ' = ' + F(n, d, w) + '.'] });
      if (d < 3) d = r.int(3, 9);
      var a = r.int(2, d - 1), b = r.int(d - a + 1, d - 1);
      return K.frac('Work out ' + F(a, d) + ' + ' + F(b, d) + '. Write the answer as a mixed number.', a + b, d, { mixed: true, hint: 'Add the numerators, then change the improper fraction into a mixed number.', params: { w: Math.floor((a + b) / d), n: (a + b) % d, d: d, a: a, b: b },
        sol: [F(a, d) + ' + ' + F(b, d) + ' = ' + F(a + b, d) + '.', F(a + b, d) + ' = ' + F((a + b) % d, d, Math.floor((a + b) / d) || '') + '.'] });
    },
    verify: function (q) { var p = q.params, tot = p.a !== undefined ? K.addCheck(p.a, p.b) : K.addCheck(K.mulCheck(p.w, p.d), p.n); return q.check.n * p.d === tot * q.check.d; } });

  K.gen({ id: 'y5FracAddSub', objective: 'Y5-F-04', title: 'Adding and subtracting fractions',
    make: function (r, L) {
      var d1 = r.pick([2, 3, 4, 5]), k = L === 1 ? 1 : r.pick([2, 3]), d2 = d1 * k, add = r.chance(0.6), a = r.int(1, d1 - 1), b = r.int(1, d2 - 1);
      if (!add && a * k <= b) { add = true; }
      var num = add ? a * k + b : a * k - b;
      return K.frac('Work out &nbsp;' + F(a, d1) + (add ? ' + ' : ' − ') + F(b, d2), num, d2, { mixed: num > d2, hint: k === 1 ? 'Same denominator: ' + (add ? 'add' : 'subtract') + ' the numerators.' : 'Change ' + F(a, d1) + ' into ' + d2 + 'ths first.', params: { a: a, d1: d1, b: b, d2: d2, add: add },
        sol: (k > 1 ? [F(a, d1) + ' = ' + F(a * k, d2) + '.'] : []).concat([F(a * k, d2) + (add ? ' + ' : ' − ') + F(b, d2) + ' = ' + F(num, d2) + (num > d2 ? ' = ' + F(num % d2, d2, Math.floor(num / d2)) : '') + '.']) });
    },
    verify: function (q) { var p = q.params, x = p.a / p.d1 + (p.add ? 1 : -1) * p.b / p.d2; return Math.abs(q.check.n / q.check.d - x) < 1e-9 && x > 0; } });

  K.gen({ id: 'y5FracMult', objective: 'Y5-F-05', title: 'Multiplying fractions by whole numbers',
    make: function (r, L) {
      var d = r.int(3, 8), n = r.int(1, d - 1), m = r.int(2, L === 1 ? 4 : 6), w = L === 3 ? r.int(1, 3) : 0, num = (w * d + n) * m;
      return K.frac('Work out &nbsp;' + F(n, d, w || '') + ' × ' + m + (L > 1 ? '. Give your answer as a mixed number if it is more than 1.' : ''), num, d, { mixed: num > d, visual: L === 1 ? '<div class="pair">' + Array.from({ length: m }, function () { return V.fractionBar(d, n, { w: 150 }); }).join('') + '</div>' : '',
        hint: w ? 'Change ' + F(n, d, w) + ' to an improper fraction first.' : 'Multiply the numerator by ' + m + '. The denominator stays the same.', params: { w: w, n: n, d: d, m: m },
        sol: (w ? [F(n, d, w) + ' = ' + F(w * d + n, d) + '.'] : []).concat([F(w * d + n, d) + ' × ' + m + ' = ' + F(num, d) + (num > d ? ' = ' + F(num % d, d, Math.floor(num / d)) : '') + '.']) });
    },
    verify: function (q) { var p = q.params, tot = 0; for (var i = 0; i < p.m; i++) tot = K.addCheck(tot, K.addCheck(K.mulCheck(p.w, p.d), p.n)); return q.check.n * p.d === tot * q.check.d; } });

  K.gen({ id: 'y5DecToFrac', objective: 'Y5-F-06', title: 'Decimals as fractions',
    make: function (r, L) {
      var hund = L === 1 ? r.int(1, 9) * 10 : r.int(1, 99), dec = dstr(hund * 10);
      if (L < 3) return K.frac('Write <b>' + dec + '</b> as a fraction.', hund, 100, { hint: 'The last digit tells you: tenths or hundredths.', params: { th: hund * 10 },
        sol: [dec + ' = ' + (hund % 10 === 0 ? F(hund / 10, 10) + ' = ' + F(hund, 100) : F(hund, 100)) + '.'] });
      return K.dec('Write ' + F(hund, 100) + ' as a <b>decimal</b>.', dec, { hint: 'Hundredths go in the second place after the decimal point.', params: { th: hund * 10 }, sol: [F(hund, 100) + ' = ' + dec + '.'] });
    },
    verify: function (q) { var p = q.params; if (q.check.kind === 'dec') return K.th(q.check.value) === p.th; return q.check.n * 1000 === p.th * q.check.d; } });

  K.gen({ id: 'y5Thousandths', objective: 'Y5-F-07', title: 'Thousandths',
    make: function (r, L) {
      if (L === 1) { var t = r.int(1, 9); return K.dec('Write ' + F(t, 1000) + ' as a decimal.', dstr(t), { hint: 'Thousandths are the third place after the decimal point.', params: { th: t }, sol: [F(t, 1000) + ' = 0.00' + t + '.'] }); }
      var th = r.int(100, 999) * 10 + r.int(1, 9), x = dstr(th), pos = r.int(1, 3), names = ['', 'tenths', 'hundredths', 'thousandths'];
      if (L === 2) return K.int('In <b>' + x + '</b>, how many <b>' + names[pos] + '</b> does the digit in the ' + names[pos] + ' column show?', +x.split('.')[1].padEnd(3, '0')[pos - 1], { hint: 'Count the places after the decimal point: tenths, hundredths, thousandths.', params: { th: th, pos: pos },
        sol: ['After the point: tenths, then hundredths, then thousandths.', 'The ' + names[pos] + ' digit is ' + x.split('.')[1].padEnd(3, '0')[pos - 1] + '.'] });
      var a = r.int(1, 9), b = r.int(0, 9), c = r.int(1, 9), val = a * 100 + b * 10 + c;
      return K.dec('What decimal is <b>' + a + ' tenths, ' + b + ' hundredths and ' + c + ' thousandths</b>?', dstr(val), { hint: 'Write each digit in its column after the decimal point.', params: { a: a, b: b, c: c }, sol: ['0.' + a + b + c + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.a !== undefined) return K.th(q.check.value) === p.a * 100 + p.b * 10 + p.c; if (p.pos) return +String(p.th).padStart(4, '0')[p.pos] === q.check.value; return K.th(q.check.value) === p.th; } });

  K.gen({ id: 'y5RoundDec', objective: 'Y5-F-08', title: 'Rounding decimals',
    make: function (r, L) {
      var h = r.int(101, 9999), x = dstr(h * 10), toWhole = L === 1 ? true : L === 2 ? false : r.chance(0.5);
      if (L === 3 && r.chance(0.5)) { h = Math.floor(h / 10) * 10 + 5; x = dstr(h * 10); }
      var ans = toWhole ? dstr(Math.round(h / 100) * 1000) : dstr(Math.round(h / 10) * 100);
      return K.dec('Round <b>' + x + '</b> to the ' + (toWhole ? 'nearest <b>whole number</b>' : 'nearest <b>1 decimal place</b> (tenth)') + '.', ans, { hint: 'Look at the next digit to the right. 5 or more rounds up.', params: { h: h, whole: toWhole },
        sol: [toWhole ? 'Look at the tenths digit: ' + String(h).padStart(3, '0').slice(-2, -1) + '.' : 'Look at the hundredths digit: ' + String(h).slice(-1) + '.', 'So ' + x + ' rounds to ' + ans + '.'] });
    },
    verify: function (q) { var p = q.params, s = String(p.h).padStart(3, '0'), want; if (p.whole) { var w = +s.slice(0, -2), t = +s.slice(-2, -1); want = (t >= 5 ? w + 1 : w) * 1000; } else { var u = +s.slice(0, -1), hh = +s.slice(-1); want = (hh >= 5 ? u + 1 : u) * 100; } return K.th(q.check.value) === want; } });

  K.gen({ id: 'y5OrderDec', objective: 'Y5-F-09', title: 'Ordering decimals to 3 places',
    make: function (r, L) {
      var whole = r.int(0, 5), list = [];
      while (list.length < 4) { var v = whole * 1000 + r.pick([r.int(1, 9) * 100, r.int(10, 99) * 10, r.int(100, 999)]); if (list.indexOf(v) < 0) list.push(v); }
      if (L === 1) { var a = list[0], b = list[1], sym = a < b ? '<' : '>';
        return K.choice('Which sign makes this true? &nbsp;<b>' + dstr(a) + ' ? ' + dstr(b) + '</b>', [{ value: '<', label: '&lt;' }, { value: '>', label: '&gt;' }, { value: '=', label: '=' }], sym, { big: true, hint: 'Compare tenths first, then hundredths, then thousandths.', params: { a: a, b: b }, sol: [dstr(a) + ' ' + sym + ' ' + dstr(b) + '.'] }); }
      var asc = L === 2, sorted = list.slice().sort(function (x, y) { return asc ? x - y : y - x; });
      return K.order('Put these numbers in order, starting with the <b>' + (asc ? 'smallest' : 'largest') + '</b>.', list.map(function (x) { return { value: String(x), label: dstr(x) }; }), sorted.map(String), { hint: 'Write them all with 3 decimal places, then compare.', params: { list: list, asc: asc },
        answer: sorted.map(dstr).join(', '), sol: ['With 3 places: ' + list.map(function (x) { return OM.fromScaled(x, 3); }).join(', ') + '.', 'In order: ' + sorted.map(dstr).join(', ') + '.'] });
    },
    verify: function (q) {
      var p = q.params, pad = function (x) { return OM.fromScaled(x, 3).padStart(9, '0'); };
      if (p.list) { var s = p.list.map(pad).sort(); if (!p.asc) s.reverse(); return s.join() === q.check.order.map(function (x) { return pad(+x); }).join(); }
      return q.check.value === (pad(p.a) < pad(p.b) ? '<' : '>');
    } });

  K.gen({ id: 'y5DecProblems', objective: 'Y5-F-10', title: 'Decimal problems',
    make: function (r, L) {
      var a = r.int(1100, 9800), b = r.int(150, 3900), name = r.pick(OM.NAMES);
      if (L === 1) return K.dec(name + ' runs ' + dstr(a) + ' km on Monday and ' + dstr(b) + ' km on Tuesday. How far altogether?', dstr(a + b), { suffix: 'km', hint: 'Line up the decimal points and add.', params: { a: a, b: b, add: true }, sol: [dstr(a) + ' + ' + dstr(b) + ' = ' + dstr(a + b) + ' km.'] });
      if (b > a) { var t = a; a = b; b = t; }
      if (L === 2) return K.dec('A bag of flour weighs ' + dstr(a) + ' kg. ' + dstr(b) + ' kg is used. How much is left?', dstr(a - b), { suffix: 'kg', hint: 'Line up the decimal points. Add zeros so both have 3 places.', params: { a: a, b: b, add: false }, sol: [dstr(a) + ' − ' + dstr(b) + ' = ' + dstr(a - b) + ' kg.'] });
      if (a - b < 400) b = r.int(150, a - 400);
      var c = r.int(100, Math.min(900, a - b - 50));
      return K.dec('A jug holds ' + dstr(a) + ' litres. ' + dstr(b) + ' litres and then ' + dstr(c) + ' litres are poured out. How much is left?', dstr(a - b - c), { suffix: 'litres', hint: 'Subtract twice, or add what was poured out and subtract once.', params: { a: a, b: b, c: c },
        sol: [dstr(b) + ' + ' + dstr(c) + ' = ' + dstr(b + c) + '.', dstr(a) + ' − ' + dstr(b + c) + ' = ' + dstr(a - b - c) + ' litres.'] });
    },
    verify: function (q) { var p = q.params, v = p.c !== undefined ? K.subCheck(K.subCheck(p.a, p.b), p.c) : p.add ? K.addCheck(p.a, p.b) : K.subCheck(p.a, p.b); return K.th(q.check.value) === v && v > 0; } });

  K.gen({ id: 'y5Percent', objective: 'Y5-F-11', title: 'Per cent',
    make: function (r, L) {
      var p = r.int(1, 99);
      if (L === 1) return K.frac('Write <b>' + p + '%</b> as a fraction with denominator 100.', p, 100, { form: 'denominator', denom: 100, visual: V.hundredSquare(p), hint: 'Per cent means "out of 100".', params: { p: p }, sol: [p + '% means ' + p + ' out of 100: ' + F(p, 100) + '.'] });
      if (L === 2) return K.dec('Write <b>' + p + '%</b> as a decimal.', dstr(p * 10), { hint: p + '% = ' + p + ' hundredths.', params: { p: p }, sol: [p + '% = ' + F(p, 100) + ' = ' + dstr(p * 10) + '.'] });
      return K.int('In a hundred square, ' + p + ' squares are shaded. What <b>percentage</b> is <b>not</b> shaded?', 100 - p, { suffix: '%', visual: V.hundredSquare(p), hint: 'The whole square is 100%.', params: { p: p, not: true }, sol: ['100% − ' + p + '% = ' + (100 - p) + '%.'] });
    },
    verify: function (q) { var p = q.params; if (q.check.kind === 'frac') return q.check.n * 100 === p.p * q.check.d; if (q.check.kind === 'dec') return K.th(q.check.value) === p.p * 10; return K.subCheck(100, p.p) === q.check.value; } });

  var EQUIVS = [[1, 2, 50], [1, 4, 25], [3, 4, 75], [1, 5, 20], [2, 5, 40], [3, 5, 60], [4, 5, 80], [1, 10, 10], [3, 10, 30], [7, 10, 70], [9, 10, 90], [1, 20, 5], [7, 20, 35], [3, 25, 12], [11, 25, 44], [13, 50, 26], [21, 50, 42]];
  K.gen({ id: 'y5PercentEquiv', objective: 'Y5-F-12', title: 'Fractions, decimals and percentages',
    make: function (r, L) {
      var e = r.pick(L === 1 ? EQUIVS.slice(0, 7) : EQUIVS);
      if (L < 3) return K.int('Write ' + F(e[0], e[1]) + ' as a <b>percentage</b>.', e[2], { suffix: '%', hint: 'Make the denominator 100.', params: { e: e },
        sol: ['Multiply the top and bottom by ' + 100 / e[1] + ': ' + F(e[0], e[1]) + ' = ' + F(e[2], 100) + '.', 'That is ' + e[2] + '%.'] });
      var amt = r.pick([20, 40, 60, 80, 120, 200, 300]), name = r.pick(OM.NAMES), sale = e[1] <= 10 ? e : [1, 4, 25];
      return K.int('A coat costs £' + amt + '. In a sale it has ' + sale[2] + '% off. How many pounds are taken off?', amt * sale[2] / 100, { prefix: '£', hint: sale[2] + '% = ' + F(sale[0], sale[1]) + '.', params: { amt: amt, e: sale },
        sol: [sale[2] + '% = ' + F(sale[0], sale[1]) + '.', F(sale[0], sale[1]) + ' of £' + amt + ' = £' + amt * sale[2] / 100 + '.'] });
    },
    verify: function (q) { var p = q.params, e = p.e; if (e[0] * 100 !== e[2] * e[1]) return false; if (p.amt) return K.mulCheck(q.check.value, 100) === K.mulCheck(p.amt, e[2]); return q.check.value === e[2]; } });

  // ================= MEASUREMENT =================
  var CONV = [['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['kg', 'g', 1000], ['l', 'ml', 1000]];
  K.gen({ id: 'y5Convert', objective: 'Y5-M-01', title: 'Converting metric units',
    make: function (r, L) {
      var c = r.pick(CONV), big, small;
      if (L === 1) { big = r.int(2, 9); return K.int('Convert <b>' + big + ' ' + c[0] + '</b> into ' + c[1] + '.', big * c[2], { suffix: c[1], hint: '1 ' + c[0] + ' = ' + fmt(c[2]) + ' ' + c[1] + '.', params: { th: big * 1000, c: c, down: true }, sol: [big + ' × ' + fmt(c[2]) + ' = ' + fmt(big * c[2]) + ' ' + c[1] + '.'] }); }
      if (L === 2) { var stp = 1000 / c[2], th = r.int(Math.ceil(1100 / stp), Math.floor(9990 / stp)) * stp; var x = dstr(th); return K.int('Convert <b>' + x + ' ' + c[0] + '</b> into ' + c[1] + '.', Math.round(th * c[2] / 1000), { suffix: c[1], hint: 'Multiply by ' + fmt(c[2]) + '.', params: { th: th, c: c, down: true }, sol: [x + ' × ' + fmt(c[2]) + ' = ' + fmt(Math.round(th * c[2] / 1000)) + ' ' + c[1] + '.'] }); }
      small = r.int(105, 9950); if (c[2] === 10) small = r.int(11, 999);
      var res = dstr(small * 1000 / c[2]);
      return K.dec('Convert <b>' + fmt(small) + ' ' + c[1] + '</b> into ' + c[0] + '.', res, { suffix: c[0], hint: 'Divide by ' + fmt(c[2]) + '.', params: { small: small, c: c }, sol: [fmt(small) + ' ÷ ' + fmt(c[2]) + ' = ' + res + ' ' + c[0] + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.down) return K.mulCheck(q.check.value, 1000) === K.mulCheck(p.th, p.c[2]); return K.mulCheck(K.th(q.check.value), p.c[2]) === K.mulCheck(p.small, 1000); } });

  var IMPERIAL = [['inch', 'inches', 'cm', 2.5, 'about 2.5 cm'], ['foot', 'feet', 'cm', 30, 'about 30 cm'], ['mile', 'miles', 'km', 1.6, 'about 1.6 km'], ['pint', 'pints', 'ml', 570, 'a little more than half a litre (about 570 ml)'], ['pound', 'pounds', 'g', 450, 'about 450 g'], ['kilogram', 'kilograms', 'pounds', 2.2, 'about 2.2 pounds']];
  K.gen({ id: 'y5Imperial', objective: 'Y5-M-02', title: 'Metric and imperial units',
    make: function (r, L) {
      var u = r.pick(L === 1 ? IMPERIAL.slice(0, 3) : IMPERIAL), n = L === 1 ? 1 : r.int(2, 10);
      var exact = u[3] * n, ans = Math.round(exact * 10) / 10, wrongs = [Math.round(u[3] * 10 * n) / 10 * 10, Math.round(exact / 10 * 10) / 10, ans + (ans > 50 ? 100 : 2)];
      return K.choice('Approximately how much is <b>' + K.plural(n, u[0], u[1]) + '</b> in ' + u[2] + '?', opts(r, ans, wrongs.filter(function (w) { return w !== ans; }).slice(0, 3)), String(ans),
        { hint: '1 ' + u[0] + ' is ' + u[4] + '.', params: { u: u[0], n: n }, sol: ['1 ' + u[0] + ' is ' + u[4] + '.', n > 1 ? n + ' × ' + u[3] + ' ≈ ' + ans + ' ' + u[2] + '.' : 'So it is about ' + ans + ' ' + u[2] + '.'] });
    },
    verify: function (q) { var p = q.params, f = { inch: 2.5, foot: 30, mile: 1.6, pint: 570, pound: 450, kilogram: 2.2 }[p.u]; return Math.abs(+q.check.value - f * p.n) < 0.05; } });

  K.gen({ id: 'y5Perimeter', objective: 'Y5-M-03', title: 'Perimeter of composite shapes',
    make: function (r, L) {
      var W = r.int(6, 14), H = r.int(5, 12), cw = r.int(2, W - 3), ch = r.int(2, H - 3), unit = L === 3 ? 'm' : 'cm';
      var pts = [[0, 0], [W, 0], [W, H - ch], [W - cw, H - ch], [W - cw, H], [0, H]];
      var labels = [W, H - ch, cw, ch, W - cw, H].map(function (x) { return x + ' ' + unit; });
      var hidden = L === 1 ? [] : r.sample([2, 3], L === 2 ? 1 : 2);
      hidden.forEach(function (i) { labels[i] = '?'; });
      return K.int('Find the perimeter of this shape. All the corners are right angles.', 2 * (W + H), { suffix: unit, visual: V.labelledShape(pts, labels), hint: hidden.length ? 'Work out the missing lengths from the opposite sides first.' : 'Add all the sides.', params: { pts: pts },
        sol: (hidden.length ? ['Missing sides: the parts of each side add up to the opposite side.'] : []).concat(['The sides are ' + [W, H - ch, cw, ch, W - cw, H].join(', ') + '.', 'Total: ' + 2 * (W + H) + ' ' + unit + '.']) });
    },
    verify: function (q) { var P = q.params.pts, t = 0; for (var i = 0; i < P.length; i++) { var a = P[i], b = P[(i + 1) % P.length]; t = K.addCheck(t, Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])); } return t === q.check.value; } });

  K.gen({ id: 'y5Area', objective: 'Y5-M-04', title: 'Area of rectangles',
    make: function (r, L) {
      if (L === 3 && r.chance(0.5)) {
        var full = r.int(6, 14), half = r.int(1, 4) * 2;
        return K.int('A pond is drawn on 1 cm squares. It covers ' + full + ' whole squares and ' + half + ' half squares. Estimate its area.', full + half / 2, { suffix: 'cm²', hint: 'Two half squares make one whole square.', params: { full: full, half: half },
          sol: [half + ' halves = ' + half / 2 + ' whole squares.', full + ' + ' + half / 2 + ' = ' + (full + half / 2) + ' cm².'] });
      }
      var w = r.int(3, 15), h = r.int(2, 12), unit = r.pick(['cm', 'm']);
      if (L === 1) return K.int('Find the area of this rectangle.', w * h, { suffix: unit + '²', visual: V.labelledShape([[0, 0], [w, 0], [w, h], [0, h]], [w + ' ' + unit, h + ' ' + unit, null, null]), hint: 'Area of a rectangle = length × width.', params: { w: w, h: h }, sol: [w + ' × ' + h + ' = ' + w * h + ' ' + unit + '².'] });
      if (L === 2) { var area = w * h; return K.int('A rectangle has an area of ' + area + ' ' + unit + '². One side is ' + w + ' ' + unit + '. How long is the other side?', h, { suffix: unit, hint: 'Divide the area by the side you know.', params: { w: w, h: h, inv: true }, sol: [area + ' ÷ ' + w + ' = ' + h + ' ' + unit + '.'] }); }
      var w2 = w + r.int(1, 4), h2 = Math.max(1, h - r.int(1, 3)), bigA = w * h >= w2 * h2 ? 'a' : 'b';
      if (w * h === w2 * h2) h2++; bigA = w * h > w2 * h2 ? 'a' : 'b';
      return K.choice('Which rectangle has the <b>larger area</b>?', [{ value: 'a', label: w + ' cm by ' + h + ' cm' }, { value: 'b', label: w2 + ' cm by ' + h2 + ' cm' }], bigA, { hint: 'Work out both areas.', params: { a: [w, h], b: [w2, h2] },
        sol: [w + ' × ' + h + ' = ' + w * h + ' cm² and ' + w2 + ' × ' + h2 + ' = ' + w2 * h2 + ' cm².'] });
    },
    verify: function (q) { var p = q.params; if (p.full !== undefined) return K.addCheck(p.full, p.half / 2) === q.check.value; if (p.a) return q.check.value === (K.mulCheck(p.a[0], p.a[1]) > K.mulCheck(p.b[0], p.b[1]) ? 'a' : 'b'); return p.inv ? K.mulCheck(p.w, q.check.value) === p.w * p.h : K.mulCheck(p.w, p.h) === q.check.value; } });

  K.gen({ id: 'y5Volume', objective: 'Y5-M-05', title: 'Volume and capacity',
    make: function (r, L) {
      var l = r.int(2, L === 1 ? 4 : 5), w = r.int(1, L === 1 ? 2 : 3), h = r.int(1, L === 1 ? 2 : 4);
      if (L < 3) return K.int('This cuboid is made of 1 cm³ cubes. What is its volume?', l * w * h, { suffix: 'cm³', visual: V.cubes(l, w, h), hint: 'Count the cubes in one layer, then multiply by the number of layers.', params: { l: l, w: w, h: h },
        sol: ['One layer has ' + l + ' × ' + w + ' = ' + l * w + ' cubes.', 'There ' + (h === 1 ? 'is 1 layer' : 'are ' + h + ' layers') + ': ' + l * w + ' × ' + h + ' = ' + l * w * h + ' cm³.'] });
      var ml = r.int(2, 9) * 100, cups = r.int(2, Math.floor(1999 / ml));
      return K.int('A jug holds 2 litres of water. ' + cups + ' cups of ' + ml + ' ml are poured out. How much water is left in the jug?', 2000 - cups * ml, { suffix: 'ml', hint: '2 litres = 2,000 ml.', params: { cups: cups, ml: ml },
        sol: ['Poured out: ' + cups + ' × ' + ml + ' = ' + cups * ml + ' ml.', '2,000 − ' + cups * ml + ' = ' + (2000 - cups * ml) + ' ml.'] });
    },
    verify: function (q) { var p = q.params; if (p.ml) return K.subCheck(2000, K.mulCheck(p.ml, p.cups)) === q.check.value; var c = 0; for (var i = 0; i < p.l; i++) for (var j = 0; j < p.w; j++) for (var k = 0; k < p.h; k++) c++; return c === q.check.value; } });

  K.gen({ id: 'y5TimeConvert', objective: 'Y5-M-06', title: 'Converting units of time',
    make: function (r, L) {
      var f = r.pick([['hours', 'minutes', 60], ['minutes', 'seconds', 60], ['days', 'hours', 24], ['weeks', 'days', 7], ['years', 'months', 12]]);
      if (L === 1) { var n = r.int(2, 12); return K.int('How many ' + f[1] + ' are in <b>' + n + ' ' + f[0] + '</b>?', n * f[2], { suffix: f[1], hint: '1 ' + f[0].replace(/s$/, '') + ' = ' + f[2] + ' ' + f[1] + '.', params: { a: n, b: f[2], k: 'mul' }, sol: [n + ' × ' + f[2] + ' = ' + n * f[2] + ' ' + f[1] + '.'] }); }
      var big = r.int(2, 9), extra = r.int(1, f[2] - 1), tot = big * f[2] + extra;
      if (L === 2) return K.multi('Convert <b>' + tot + ' ' + f[1] + '</b> into ' + f[0] + ' and ' + f[1] + '.', '{0} ' + f[0] + ' {1} ' + f[1], [{ kind: 'int', value: big }, { kind: 'int', value: extra }], { hint: 'How many ' + f[2] + 's fit into ' + tot + '?', params: { tot: tot, b: f[2] },
        sol: [tot + ' ÷ ' + f[2] + ' = ' + big + ' remainder ' + extra + '.', 'So ' + tot + ' ' + f[1] + ' = ' + big + ' ' + f[0] + ' ' + extra + ' ' + f[1] + '.'] });
      var mins = r.int(75, 250);
      return K.int('A journey takes ' + Math.floor(mins / 60) + ' hours ' + mins % 60 + ' minutes. Another takes ' + (mins + 35) + ' minutes. How many minutes longer is the second journey?', 35, { suffix: 'minutes', hint: 'Change the first journey into minutes.', params: { mins: mins },
        sol: [Math.floor(mins / 60) + ' hours ' + mins % 60 + ' minutes = ' + mins + ' minutes.', (mins + 35) + ' − ' + mins + ' = 35 minutes.'] });
    },
    verify: function (q) { var p = q.params; if (p.k) return K.mulCheck(p.a, p.b) === q.check.value; if (p.tot) return K.addCheck(K.mulCheck(q.check.parts[0].value, p.b), q.check.parts[1].value) === p.tot && q.check.parts[1].value < p.b; return K.subCheck(p.mins + 35, K.addCheck(Math.floor(p.mins / 60) * 60, p.mins % 60)) === q.check.value; } });

  K.gen({ id: 'y5MeasureProblems', objective: 'Y5-M-07', title: 'Measure problems with decimals',
    make: function (r, L) {
      var name = r.pick(OM.NAMES);
      if (L === 1) { var p1 = r.int(105, 899), n = r.int(3, 6); return K.money(name + ' buys ' + n + ' books at ' + OM.pounds(p1) + ' each. How much is that?', p1 * n, '£', { hint: 'Multiply the price by ' + n + '.', params: { a: p1, n: n, k: 'mul' }, sol: [OM.pounds(p1) + ' × ' + n + ' = ' + OM.pounds(p1 * n) + '.'] }); }
      if (L === 2) { var len = r.int(12, 48) * 100, parts = r.pick([4, 5, 8]); while ((len * 1) % parts) len += 100;
        return K.dec('A rope ' + dstr(len) + ' m long is cut into ' + parts + ' equal pieces. How long is each piece?', dstr(len / parts), { suffix: 'm', hint: 'Divide by ' + parts + '.', params: { a: len, n: parts, k: 'div' }, sol: [dstr(len) + ' ÷ ' + parts + ' = ' + dstr(len / parts) + ' m.'] }); }
      var g = r.int(75, 225) * 2, people = r.int(3, 8), base = 4;
      return K.int('A recipe for ' + base + ' people uses ' + g + ' g of pasta. How much pasta is needed for ' + people * 2 + ' people?', g * people * 2 / base, { suffix: 'g', hint: 'Work out the amount for 1 person, or scale the recipe up.', params: { g: g, base: base, want: people * 2 },
        sol: [people * 2 + ' people is ' + (people * 2 / base) + ' times as many as ' + base + '.', g + ' × ' + (people * 2 / base) + ' = ' + g * people * 2 / base + ' g.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'mul') return K.mulCheck(p.a, p.n) === q.check.pence; if (p.k === 'div') return K.mulCheck(K.th(q.check.value), p.n) === p.a; return K.mulCheck(q.check.value, p.base) === K.mulCheck(p.g, p.want); } });

  // ================= GEOMETRY =================
  var NETS = { 'cube': 'cube', 'cuboid': 'cuboid', 'square-based pyramid': 'square-based pyramid', 'triangular prism': 'triangular prism', 'tetrahedron': 'triangular-based pyramid' };
  K.gen({ id: 'y5Nets', objective: 'Y5-G-01', title: '3-D shapes from 2-D drawings',
    make: function (r, L) {
      var keys = Object.keys(NETS), k = r.pick(L === 1 ? ['cube', 'cuboid', 'square-based pyramid'] : keys), name = NETS[k];
      var others = keys.filter(function (x) { return x !== k; }).map(function (x) { return NETS[x]; });
      if (L < 3) return K.choice('This is the <b>net</b> of a 3-D shape. Which shape does it fold up to make?', r.shuffle([name].concat(r.sample(others, 3))), name, { visual: V.net(k), hint: 'Look at the shapes of the faces and count them.', params: { k: k },
        sol: ['Look at the faces: there are ' + (V.net(k).match(/<rect|<polygon/g) || []).length + ' of them.', 'It folds up to make a ' + name + '.'] });
      var faces = { 'cube': 6, 'cuboid': 6, 'square-based pyramid': 5, 'triangular prism': 5, 'tetrahedron': 4 }[k];
      return K.int('How many faces will the shape made from this net have?', faces, { visual: V.net(k), hint: 'Each flat shape in the net becomes one face.', params: { k: k, faces: true }, sol: ['Count the shapes in the net: ' + faces + '.', 'It makes a ' + name + ' with ' + faces + ' faces.'] });
    },
    verify: function (q) { var p = q.params, faces = (V.net(p.k).match(/<rect|<polygon/g) || []).length; if (p.faces) return faces === q.check.value; var byFaces = { 6: ['cube', 'cuboid'], 5: ['square-based pyramid', 'triangular prism'], 4: ['triangular-based pyramid'] }; return (byFaces[faces] || []).indexOf(q.check.value) >= 0 && q.check.value === NETS[p.k]; } });

  function angleType(d) { return d < 90 ? 'acute' : d === 90 ? 'right' : d < 180 ? 'obtuse' : d === 180 ? 'straight' : 'reflex'; }
  K.gen({ id: 'y5AngleTypes', objective: 'Y5-G-02', title: 'Acute, obtuse and reflex angles',
    make: function (r, L) {
      var d = r.pick(L === 1 ? [r.int(20, 80), r.int(100, 170)] : [r.int(20, 80), r.int(100, 170), r.int(190, 340)]);
      if (L < 3) return K.choice('What type of angle is this?', ['acute', 'obtuse', 'reflex'], angleType(d), { visual: V.angle(d, { rot: r.int(0, 5) * 20 }), hint: 'Acute: less than 90°. Obtuse: between 90° and 180°. Reflex: more than 180°.', params: { d: d },
        sol: ['This angle is about ' + Math.round(d / 10) * 10 + '°.', 'It is ' + angleType(d) + '.'] });
      var est = Math.round(d / 10) * 10, w = [est + 40, est - 40, 360 - est].filter(function (x) { return x > 0 && x !== est; });
      return K.choice('Estimate the size of this angle.', opts(r, est + '°', w.map(function (x) { return x + '°'; })), est + '°', { visual: V.angle(d, { rot: r.int(0, 5) * 20 }), hint: 'Compare it with a right angle (90°) and a straight line (180°).', params: { d: d, est: est },
        sol: ['It is ' + angleType(d) + ', so it is ' + (d < 90 ? 'less than 90°' : d < 180 ? 'between 90° and 180°' : 'more than 180°') + '.', 'A good estimate is ' + est + '°.'] });
    },
    verify: function (q) { var p = q.params; if (p.est) return +q.check.value.replace('°', '') === Math.round(p.d / 10) * 10; return q.check.value === (p.d < 90 ? 'acute' : p.d < 180 ? 'obtuse' : 'reflex'); } });

  K.gen({ id: 'y5MeasureAngle', objective: 'Y5-G-03', title: 'Measuring angles with a protractor',
    make: function (r, L) {
      var d = L === 1 ? r.int(1, 17) * 10 : L === 2 ? r.int(2, 34) * 5 : r.int(12, 168);
      if (d === 90 && L === 3) d = 93;
      return K.int('Read the protractor. What is the size of the angle?', d, { suffix: '°', visual: V.protractor(d), hint: 'Start from 0 on the scale where the bottom arm lies, and count round to the other arm.', params: { d: d },
        sol: ['The bottom arm is on 0° of the outer (blue) scale.', 'Read the same scale where the other arm crosses it: ' + d + '°.', d < 90 ? 'Check: it is acute, so less than 90° ✓' : d > 90 ? 'Check: it is obtuse, so more than 90° ✓' : 'It is a right angle.'] });
    },
    verify: function (q) { var v = q.check.value, d = q.params.d; return v === d && (v < 90) === (d < 90); } });

  K.gen({ id: 'y5AngleFacts', objective: 'Y5-G-04', title: 'Angle facts, rectangles and regular polygons',
    make: function (r, L) {
      if (L === 1) { var a = r.int(25, 155); return K.int('Two angles sit on a straight line. One is ' + a + '°. What is the other?', 180 - a, { suffix: '°', hint: 'Angles on a straight line add up to 180°.', params: { known: [a], total: 180 },
        visual: V.svg(260, 120, V.line(10, 100, 250, 100, { w: 4 }) + V.line(130, 100, (130 + 110 * Math.cos(a * Math.PI / 180)).toFixed(1), (100 - 110 * Math.sin(a * Math.PI / 180)).toFixed(1), { w: 4 }) + V.t(190, 86, a + '°', { size: 15, weight: 'bold' }) + V.t(80, 86, '?', { size: 17, weight: 'bold', fill: V.colors.berry })),
        sol: ['Angles on a straight line total 180°.', '180 − ' + a + ' = ' + (180 - a) + '°.'] }); }
      if (L === 2) { var b = r.int(60, 140), c = r.int(50, 300 - b - 10); if (b + c >= 340) c = 340 - b - 20;
        return K.int('Three angles meet at a point. Two of them are ' + b + '° and ' + c + '°. What is the third?', 360 - b - c, { suffix: '°', hint: 'Angles at a point add up to 360°.', params: { known: [b, c], total: 360 },
          sol: ['Angles at a point total 360°.', '360 − ' + b + ' − ' + c + ' = ' + (360 - b - c) + '°.'] }); }
      if (r.chance(0.5)) { var shape = r.pick([['square', true, true], ['rectangle (not a square)', false, true], ['rhombus (not a square)', true, false], ['equilateral triangle', true, true], ['right-angled triangle', false, false]]);
        return K.choice('Is a <b>' + shape[0] + '</b> a regular polygon?', [{ value: 'yes', label: 'Yes: all its sides and angles are equal' }, { value: 'no', label: 'No: its sides or angles are not all equal' }], shape[1] && shape[2] ? 'yes' : 'no',
          { hint: 'A regular polygon has all sides equal AND all angles equal.', params: { shape: shape[0] }, sol: ['A ' + shape[0] + (shape[1] && shape[2] ? ' has equal sides and equal angles, so it is regular.' : ' does not have all sides and all angles equal, so it is irregular.')] }); }
      var W = r.int(8, 20), part = r.int(3, W - 3);
      return K.int('A rectangle is ' + W + ' cm long. A line cuts the top side into two parts. One part is ' + part + ' cm. How long is the other part?', W - part, { suffix: 'cm', hint: 'Opposite sides of a rectangle are equal.', params: { known: [part], total: W },
        sol: ['The top side is also ' + W + ' cm, because opposite sides of a rectangle are equal.', W + ' − ' + part + ' = ' + (W - part) + ' cm.'] });
    },
    verify: function (q) { var p = q.params; if (p.shape) return q.check.value === ({ square: 'yes', 'equilateral triangle': 'yes' }[p.shape] || 'no'); return p.known.reduce(function (s, x) { return K.addCheck(s, x); }, q.check.value) === p.total; } });

  // ================= POSITION AND DIRECTION =================
  K.gen({ id: 'y5Reflect', objective: 'Y5-P-01', title: 'Reflection and translation',
    make: function (r, L) {
      if (L === 3) { var dx = r.int(-4, 5), dy = r.int(-3, 4); if (!dx) dx = 2; var x = r.int(1, 4), y = r.int(1, 4); if (x + dx < 0) dx = -x; if (y + dy < 0) dy = -y;
        return { prompt: 'Point A is at (' + x + ', ' + y + '). It is translated ' + Math.abs(dx) + ' ' + (dx > 0 ? 'right' : 'left') + (dy ? ' and ' + Math.abs(dy) + ' ' + (dy > 0 ? 'up' : 'down') : '') + '. What are its new coordinates?',
          input: { type: 'coord' }, check: { kind: 'coord', x: x + dx, y: y + dy }, hint: 'Right and left change the x-coordinate. Up and down change the y-coordinate.', params: { x: x, y: y, dx: dx, dy: dy, k: 'tr' },
          visual: V.coordGrid({ size: 10, points: [{ x: x, y: y, label: 'A' }] }), solution: [S('x: ' + x + (dx >= 0 ? ' + ' : ' − ') + Math.abs(dx) + ' = ' + (x + dx) + '. y: ' + y + (dy >= 0 ? ' + ' : ' − ') + Math.abs(dy) + ' = ' + (y + dy) + '.'), S('The new point is (' + (x + dx) + ', ' + (y + dy) + '). The shape has moved but not changed.')] };
      }
      var m = r.int(3, 7), px = r.int(0, m - 1), py = r.int(1, 8), rx = 2 * m - px;
      if (L === 1) return K.choice('A shape is reflected in a mirror line. Which is true about the reflected shape?', [{ value: 'same', label: 'It is the same shape and size' }, { value: 'bigger', label: 'It is bigger' }, { value: 'different', label: 'It is a different shape' }], 'same',
        { hint: 'Reflections and translations move a shape. They do not change its size or shape.', params: { k: 'fact' }, sol: ['A reflected shape is a mirror image: the same shape and the same size.'] });
      return { prompt: 'The mirror line is the vertical line x = ' + m + '. Point P is at (' + px + ', ' + py + '). Where is P after it is reflected in the mirror line?', input: { type: 'coord' }, check: { kind: 'coord', x: rx, y: py },
        hint: 'P is ' + (m - px) + ' squares from the mirror. Its reflection is the same distance on the other side.', params: { m: m, px: px, py: py, k: 'ref' }, visual: V.coordGrid({ size: Math.max(10, rx + 1), points: [{ x: px, y: py, label: 'P' }], segments: [[[m, 0], [m, Math.max(10, rx + 1)]]] }),
        solution: [S('P is ' + (m - px) + ' squares to the left of the mirror line.'), S('So its reflection is ' + (m - px) + ' squares to the right: (' + rx + ', ' + py + ').')] };
    },
    verify: function (q) { var p = q.params; if (p.k === 'fact') return q.check.value === 'same'; if (p.k === 'tr') { var cx = p.x, cy = p.y; for (var i = 0; i < Math.abs(p.dx); i++) cx += p.dx > 0 ? 1 : -1; for (i = 0; i < Math.abs(p.dy); i++) cy += p.dy > 0 ? 1 : -1; return q.check.x === cx && q.check.y === cy && cx >= 0 && cy >= 0; } return q.check.x - p.m === p.m - p.px && q.check.y === p.py; } });

  // ================= STATISTICS =================
  K.gen({ id: 'y5LineGraph', objective: 'Y5-S-01', title: 'Line graphs',
    make: function (r, L) {
      var hours = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm'], step = r.pick([2, 5]), vals = hours.map(function () { return step * r.int(1, 9); });
      var i = r.int(0, 6), j = (i + r.int(1, 6)) % 7;
      if (vals[i] === vals[j]) vals[j] = vals[i] === step * 9 ? vals[i] - step : vals[i] + step;
      var vis = V.lineGraph({ xlabels: hours, values: vals, step: step, max: step * 10, ylabel: 'Temperature (°C)', title: 'Temperature in the garden' });
      if (L === 1) return K.int('What was the temperature at <b>' + hours[i] + '</b>?', vals[i], { suffix: '°C', visual: vis, hint: 'Go up from ' + hours[i] + ' to the line, then across to the scale.', params: { vals: vals, i: i, k: 'read' }, sol: ['At ' + hours[i] + ' the line is at ' + vals[i] + '°C.'] });
      if (L === 2) return K.int('How much <b>warmer</b> was it at ' + hours[vals[i] > vals[j] ? i : j] + ' than at ' + hours[vals[i] > vals[j] ? j : i] + '?', Math.abs(vals[i] - vals[j]), { suffix: '°C', visual: vis, hint: 'Read both temperatures, then subtract.', params: { vals: vals, i: i, j: j, k: 'diff' },
        sol: [hours[i] + ': ' + vals[i] + '°C. ' + hours[j] + ': ' + vals[j] + '°C.', 'Difference: ' + Math.abs(vals[i] - vals[j]) + '°C.'] });
      var mx = Math.max.apply(null, vals), mi = Math.min.apply(null, vals);
      return K.int('What was the difference between the <b>highest</b> and <b>lowest</b> temperatures?', mx - mi, { suffix: '°C', visual: vis, hint: 'Find the highest and lowest points on the line.', params: { vals: vals, k: 'range' }, sol: ['Highest: ' + mx + '°C. Lowest: ' + mi + '°C.', mx + ' − ' + mi + ' = ' + (mx - mi) + '°C.'] });
    },
    verify: function (q) { var p = q.params, v = p.vals; if (p.k === 'read') return v[p.i] === q.check.value; if (p.k === 'diff') return K.subCheck(Math.max(v[p.i], v[p.j]), Math.min(v[p.i], v[p.j])) === q.check.value; var s = v.slice().sort(function (a, b) { return a - b; }); return K.subCheck(s[s.length - 1], s[0]) === q.check.value; } });

  K.gen({ id: 'y5Timetable', objective: 'Y5-S-02', title: 'Tables and timetables',
    make: function (r, L) {
      var stops = ['Hilltop', 'Market Square', 'Riverside', 'Station'], start = r.int(7, 9) * 60 + r.pick([0, 10, 15, 20, 30]), gaps = [r.int(2, 4) * 5, r.int(2, 5) * 5, r.int(1, 4) * 5], buses = [0, r.int(4, 6) * 10, r.int(9, 12) * 10];
      var rows = stops.map(function (s, k) { var off = K.sum(gaps.slice(0, k)); return [s].concat(buses.map(function (b) { return OM.time24(start + b + off); })); });
      var vis = V.table(['Stop', 'Bus 1', 'Bus 2', 'Bus 3'], rows), bi = r.int(0, 2), si = r.int(0, 2), sj = r.int(si + 1, 3);
      if (L === 1) return K.time('What time does <b>Bus ' + (bi + 1) + '</b> reach <b>' + stops[sj] + '</b>?', start + buses[bi] + K.sum(gaps.slice(0, sj)), '24', { visual: vis, hint: 'Find the Bus ' + (bi + 1) + ' column and the ' + stops[sj] + ' row.', params: { t: start + buses[bi] + K.sum(gaps.slice(0, sj)), rows: rows, bi: bi, sj: sj, k: 'read' },
        answer: OM.time24(start + buses[bi] + K.sum(gaps.slice(0, sj))), sol: ['Read across the ' + stops[sj] + ' row to the Bus ' + (bi + 1) + ' column: ' + rows[sj][bi + 1] + '.'] });
      if (L === 2) return K.int('How many minutes does Bus ' + (bi + 1) + ' take to get from <b>' + stops[si] + '</b> to <b>' + stops[sj] + '</b>?', K.sum(gaps.slice(si, sj)), { suffix: 'minutes', visual: vis, hint: 'Find both times in the Bus ' + (bi + 1) + ' column and count on.', params: { rows: rows, bi: bi, si: si, sj: sj, k: 'dur' },
        sol: [stops[si] + ': ' + rows[si][bi + 1] + '. ' + stops[sj] + ': ' + rows[sj][bi + 1] + '.', 'That is ' + K.sum(gaps.slice(si, sj)) + ' minutes.'] });
      var tb = r.int(0, 1), must = start + buses[tb] + K.sum(gaps) + r.int(1, buses[tb + 1] - buses[tb] - 1), nm = r.pick(OM.NAMES);
      return K.choice(nm + ' is at <b>' + stops[0] + '</b> and must be at the <b>Station</b> by ' + OM.time24(must) + '. Which is the <b>latest</b> bus ' + nm + ' can catch?', ['Bus 1', 'Bus 2', 'Bus 3'], 'Bus ' + (tb + 1), { visual: vis, hint: 'Look at the Station row. Which buses arrive in time?', params: { rows: rows, must: must, k: 'latest' },
        sol: ['Station arrivals: ' + rows[3].slice(1).join(', ') + '.', 'Bus ' + (tb + 1) + ' is the last one to arrive by ' + OM.time24(must) + '.'] });
    },
    verify: function (q) {
      var p = q.params, mins = function (s) { var a = s.split(':'); return +a[0] * 60 + +a[1]; };
      if (p.k === 'read') return q.check.mins === mins(p.rows[p.sj][p.bi + 1]);
      if (p.k === 'dur') return q.check.value === K.subCheck(mins(p.rows[p.sj][p.bi + 1]), mins(p.rows[p.si][p.bi + 1]));
      var ok = [1, 2, 3].filter(function (b) { return mins(p.rows[3][b]) <= p.must; }); return 'Bus ' + ok[ok.length - 1] === q.check.value;
    } });
})(typeof window !== 'undefined' ? window : globalThis);
