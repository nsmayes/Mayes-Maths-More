/* Learn with Pip — Year 7 question generators (Key Stage 3). Algebra answers are typed and marked by js/algebra.js,
   which checks equivalence exactly and enforces "simplify fully" and "factorise fully" where the question asks.
   Questions marked calc: true allow a calculator. Each generator's verify() works the answer out a different way.
   Levels: 1 getting there, 2 expected, 3 greater depth. */
(function (G) {
  'use strict';
  var OM = G.OM, K = OM.kit, V = OM.V, S = K.S, fmt = OM.fmt, F = K.fr, A = OM.alg;
  function neg(n) { return n < 0 ? '−' + fmt(-n) : fmt(n); }
  function nm(s) { return String(s).replace(/-/g, '−'); }
  function Qs(s) { return A.parseQ(String(s)); }
  function dtext(q) { return A.decText(q); }
  function opts(r, correct, wrongs) { var seen = {}; return r.shuffle([correct].concat(wrongs).filter(function (x) { var k = String(x); if (seen[k]) return false; seen[k] = 1; return true; })).map(function (x) { return { value: String(x), label: String(x) }; }); }
  function simp(n, d) { var g = OM.gcd(Math.abs(n), Math.abs(d)); return [n / g, d / g]; }
  // a linear expression ax + b as text, e.g. term(3,'x') + c(-5) -> "3x − 5"
  function lin(a, b, v) {
    v = v || 'x'; var s = '';
    if (a) s = (a === 1 ? '' : a === -1 ? '-' : a) + v;
    if (b) s += (s ? (b < 0 ? ' - ' + (-b) : ' + ' + b) : String(b));
    return s || '0';
  }
  function pretty(s) { return A.pretty(s); }
  function poly(s) { return A.poly(A.parse(s)); }
  function same(a, b) { return A.equivalent(A.parse(a), A.parse(b)); }

  // ================= NUMBER: PLACE VALUE, ORDERING, ROUNDING (Cog Quarter) =================
  K.gen({ id: 'y7PlaceValue', objective: 'Y7-N-01', title: 'Place value with decimals and powers of 10',
    make: function (r, L) {
      if (L === 1) { var names = ['tenths', 'hundredths', 'thousandths'], whole, ds, x, k;
        do { whole = r.int(1, 99); ds = [r.int(1, 9), r.int(1, 9), r.int(1, 9)]; x = whole + '.' + ds.join(''); var allD = K.digits(x.replace('.', '')), k0 = allD.length - 3, at = K.loneDigit(r, allD, [k0, k0 + 1, k0 + 2]); k = at - k0; } while (at < 0);
        var val = '0.' + '0'.repeat(k) + ds[k];
        return K.dec('What is the value of the digit <b>' + ds[k] + '</b> in the ' + names[k] + ' column of <b>' + x + '</b>?', val, { hint: 'The first column after the point is tenths, then hundredths, then thousandths.', params: { x: x, k: k }, sol: ['The ' + names[k] + ' digit is ' + ds[k] + ', worth ' + val + '.'] }); }
      var by = L === 2 ? r.pick(['10', '100', '1000']) : r.pick(['0.1', '0.01']), mul = r.chance(0.5);
      var x2 = dtext(A.div(Q(r.int(101, 99999)), Q(r.pick([10, 100, 1000])))), ans = mul ? A.mul(Qs(x2), Qs(by)) : A.div(Qs(x2), Qs(by));
      var at = dtext(ans);
      return K.dec('Work out <b>' + nm(x2) + (mul ? ' × ' : ' ÷ ') + by + '</b>', at, { hint: by.indexOf('0.') === 0 ? 'Multiplying by ' + by + ' is the same as dividing by ' + (by === '0.1' ? '10' : '100') + '.' : 'Move the digits ' + (by.length - 1) + ' places.', params: { x: x2, by: by, mul: mul },
        sol: [nm(x2) + (mul ? ' × ' : ' ÷ ') + by + ' = ' + at + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.k !== undefined) return Qs(q.check.value) && A.eq(Qs(q.check.value), Q(+p.x.split('.')[1][p.k], 10 ** (p.k + 1)));
      // shift the decimal point in the written number
      var shift = p.by === '0.1' ? -1 : p.by === '0.01' ? -2 : p.by.length - 1; if (!p.mul) shift = -shift;
      var parts = p.x.split('.'), digits = parts[0] + (parts[1] || ''), point = parts[0].length + shift;
      while (point > digits.length) digits += '0'; while (point < 1) { digits = '0' + digits; point++; }
      return A.eq(Qs(digits.slice(0, point) + '.' + (digits.slice(point) || '0')), Qs(q.check.value));
    } });
  function Q(n, d) { return A.Q(n, d); }

  K.gen({ id: 'y7Order', objective: 'Y7-N-02', title: 'Ordering numbers; =, ≠, <, >, ≤, ≥',
    make: function (r, L) {
      if (L === 1) { var nums = r.sample([-15, -9, -7, -4, -2, -1, 0, 3, 5, 8, 11], 5), sorted = nums.slice().sort(function (a, b) { return a - b; });
        return K.order('Put these in order, <b>smallest first</b>.', nums.map(function (x) { return { value: String(x), label: neg(x) }; }), sorted.map(String), { hint: 'Negative numbers are smaller than zero. −9 is smaller than −4.', params: { nums: nums.map(String) }, answer: sorted.map(neg).join(', '),
          sol: ['On a number line, numbers further left are smaller.', 'Order: ' + sorted.map(neg).join(', ') + '.'] }); }
      if (L === 2) { var base = r.int(3, 8), items = r.shuffle([['0.' + base + '5', Qs('0.' + base + '5')], ['0.' + base + '05', Qs('0.' + base + '05')], ['0.' + base, Qs('0.' + base)], [F(base * 2 + 1, 25), Q(base * 2 + 1, 25)]]);
        var ord = items.slice().sort(function (a, b) { return A.num(a[1]) - A.num(b[1]); });
        return K.order('Put these in order, <b>smallest first</b>.', items.map(function (it) { return { value: it[0], label: it[0] }; }), ord.map(function (it) { return it[0]; }), { hint: 'Change the fraction to a decimal, then compare digit by digit.', params: { items: items.map(function (it) { return [it[0], A.qText(it[1])]; }) },
          answer: ord.map(function (it) { return it[0].indexOf('<') >= 0 ? A.qText(it[1]) : it[0]; }).join(', '), sol: ['As decimals: ' + items.map(function (it) { return dtext(it[1]); }).join(', ') + '.', 'Smallest first: ' + ord.map(function (it) { return it[0]; }).join(', ') + '.'] }); }
      var pair = r.pick([[F(3, 4), '0.75', '='], [F(2, 5), '0.25', '≠'], [F(1, 8), '0.125', '='], ['−3', '−5', '>'], ['−0.4', '−0.35', '<'], [F(7, 10), '0.07', '≠']]);
      var symbols = pair[2] === '≠' ? ['=', '≠'] : ['<', '>', '='];
      return K.choice('Which symbol makes this true?<br><b>' + pair[0] + ' &nbsp;?&nbsp; ' + pair[1] + '</b>', symbols, pair[2], { big: true, hint: '≠ means "is not equal to". Change both to decimals to compare.', params: { pair: pair }, sol: ['So ' + pair[0] + ' ' + pair[2] + ' ' + pair[1] + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.nums) return q.check.order.every(function (v, i, a) { return !i || +a[i - 1] < +v; });
      if (p.items) { var val = {}; p.items.forEach(function (it) { val[it[0]] = A.num(A.parseQ(it[1].replace('−', '-'))); }); return q.check.order.every(function (v, i, a) { return !i || val[a[i - 1]] < val[v]; }); }
      var tv = function (s) { var m = /(\d+)<\/sup>.*?(\d+)<\/sub>|frac.*?(\d+).*?(\d+)/.exec(s); if (s.indexOf('<') >= 0) { var nums = s.replace(/<[^>]+>/g, ' ').trim().split(/\s+/); return +nums[0] / +nums[1]; } return parseFloat(s.replace('−', '-')); };
      var a = tv(p.pair[0]), b = tv(p.pair[1]), want = Math.abs(a - b) < 1e-12 ? '=' : p.pair[2] === '≠' || p.pair[2] === '=' ? '≠' : a < b ? '<' : '>';
      return q.check.value === want;
    } });

  K.gen({ id: 'y7Round', objective: 'Y7-N-03', title: 'Decimal places and significant figures',
    make: function (r, L) {
      function digitsNot5(n) { var s = ''; for (var i = 0; i < n; i++) s += r.pick([1, 2, 3, 4, 6, 7, 8, 9]); return s; }
      var x, acc;
      if (L === 1) { acc = { dp: r.pick([1, 2]) }; x = r.int(1, 99) + '.' + digitsNot5(acc.dp + 2); }
      else if (L === 2) { acc = { sf: r.pick([1, 2]) }; x = r.chance(0.5) ? String(r.int(1, 9)) + digitsNot5(3) : '0.0' + r.int(1, 9) + digitsNot5(3); }
      else { acc = { sf: 3 }; x = r.pick([String(r.int(10, 99)) + '.0' + r.pick([3, 4, 6, 8]) + digitsNot5(2), String(r.int(1, 9)) + digitsNot5(4) + '00', '0.00' + r.int(1, 9) + digitsNot5(3)]); }
      var ans = A.round(x, acc);
      var what = acc.dp !== undefined ? acc.dp + ' decimal place' + (acc.dp > 1 ? 's' : '') : acc.sf + ' significant figure' + (acc.sf > 1 ? 's' : '');
      return K.approx('Round <b>' + fmt(+x.split('.')[0]) + (x.indexOf('.') >= 0 ? '.' + x.split('.')[1] : '') + '</b> to <b>' + what + '</b>.', x, acc, { hint: acc.sf ? 'Start counting significant figures at the first digit that is not zero.' : 'Look at the digit just after the place you are rounding to.', params: { x: x, acc: acc },
        sol: [acc.sf ? 'The first significant figure is the first non-zero digit.' : 'Count ' + acc.dp + ' place' + (acc.dp > 1 ? 's' : '') + ' after the decimal point.', 'Look at the next digit: 5 or more rounds up.', 'Answer: ' + ans + (ans.indexOf('.') >= 0 && /0$/.test(ans) ? ' (keep the final 0: it is a significant figure)' : '') + '.'] });
    },
    verify: function (q) {
      var p = q.params, v = parseFloat(p.x), want;
      if (p.acc.dp !== undefined) want = Math.round(v * Math.pow(10, p.acc.dp)) / Math.pow(10, p.acc.dp);
      else want = +v.toPrecision(p.acc.sf);
      return Math.abs(want - parseFloat(A.round(p.x, p.acc))) < 1e-9 * Math.max(1, Math.abs(want));
    } });

  K.gen({ id: 'y7Estimate', objective: 'Y7-N-04', title: 'Estimating and error intervals',
    make: function (r, L) {
      if (L === 1) { var a = r.int(2, 9) * 10 + r.pick([-2, -1, 1, 2]) + r.pick([0.3, 0.6, 0.8]), b = r.int(2, 9) + r.pick([-0.2, 0.1, 0.3]); a = Math.round(a * 10) / 10; b = Math.round(b * 10) / 10;
        var ea = +a.toPrecision(1), eb = +b.toPrecision(1);
        return K.int('Estimate the value of <b>' + a + ' × ' + b + '</b> by rounding each number to 1 significant figure.', ea * eb, { hint: 'Round each number to 1 significant figure first.', params: { a: a, b: b }, sol: [a + ' ≈ ' + ea + ' and ' + b + ' ≈ ' + eb + '.', ea + ' × ' + eb + ' = ' + ea * eb + '.'] }); }
      if (L === 2) { var p1 = r.pick([4, 6, 8]) * 100, p2 = r.pick([2, 3, 5]) * 10, dv = r.pick([2, 4, 8]); while ((p1 * p2) % dv) dv = 2;
        var x = p1 + r.pick([-13, 12, 27, -31]), y = p2 + r.pick([-0.6, 0.4, 1.3, -1.2]), z = dv + r.pick([-0.2, 0.1, 0.3]); y = Math.round(y * 10) / 10; z = Math.round(z * 10) / 10;
        return K.int('Estimate <b>' + fmt(x) + ' × ' + y + ' ÷ ' + z + '</b>. Round each number to 1 significant figure first.', p1 * p2 / dv, { hint: 'Round all three numbers, then work it out.', params: { x: x, y: y, z: z }, sol: ['Rounded: ' + p1 + ' × ' + p2 + ' ÷ ' + dv + '.', p1 + ' × ' + p2 + ' = ' + fmt(p1 * p2) + '. ' + fmt(p1 * p2) + ' ÷ ' + dv + ' = ' + fmt(p1 * p2 / dv) + '.'] }); }
      var to = r.pick([10, 100, 5]), v = to * r.int(3, 30), half = to / 2, unit = r.pick(['cm', 'g', 'ml']);
      return K.ineq('A length <i>L</i> is ' + v + ' ' + unit + ', rounded to the nearest ' + to + ' ' + unit + '. Write the <b>error interval</b> for <i>L</i>.', String(v - half), true, String(v + half), false, { v: 'L', hint: 'The smallest value that rounds to ' + v + ' is ' + (v - half) + '. The upper bound itself would round up.', params: { v: v, to: to },
        sol: ['Half of ' + to + ' is ' + half + '.', 'Lower bound: ' + v + ' − ' + half + ' = ' + (v - half) + '. Upper bound: ' + v + ' + ' + half + ' = ' + (v + half) + '.', 'Error interval: ' + (v - half) + ' ≤ L < ' + (v + half) + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.to) { var lo = +q.check.lo, hi = +q.check.hi; return Math.round(lo / p.to) * p.to === p.v && Math.round((hi - 1e-9) / p.to) * p.to === p.v && Math.round((hi + 1e-9) / p.to) * p.to !== p.v && q.check.loInc && !q.check.hiInc; }
      if (p.z) return Math.abs(+p.x.toPrecision(1) * +p.y.toPrecision(1) / +p.z.toPrecision(1) - q.check.value) < 1e-9;
      return +p.a.toPrecision(1) * +p.b.toPrecision(1) === q.check.value;
    } });

  // ================= CALCULATION (Steam Works) =================
  K.gen({ id: 'y7Negatives', objective: 'Y7-N-05', title: 'Calculating with negative numbers',
    make: function (r, L) {
      var a = r.int(-12, 12) || -4, b = r.int(-12, 12) || 7, op;
      if (L === 1) { op = r.pick(['+', '-']); if (a > 0 && b > 0) a = -a; }
      else if (L === 2) { op = r.pick(['*', '/']); if (a > 0 && b > 0) b = -b; if (op === '/') { var t = a * b; a = t; } }
      else { var c = r.int(2, 9); return K.int('Work out <b>' + neg(a) + ' × ' + c + ' − (' + neg(b) + ')</b>', a * c - b, { keys: 'signed', hint: 'Multiply first. Subtracting a negative is the same as adding.', params: { a: a, b: b, c: c, op: 'mix' }, sol: [neg(a) + ' × ' + c + ' = ' + neg(a * c) + '.', neg(a * c) + ' − (' + neg(b) + ') = ' + neg(a * c) + ' + ' + neg(-b) + ' = ' + neg(a * c - b) + '.'] }); }
      var ans = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b, sym = { '+': '+', '-': '−', '*': '×', '/': '÷' }[op];
      var shown = (op === '-' || op === '+') && b < 0 ? '(' + neg(b) + ')' : neg(b);
      return K.int('Work out <b>' + neg(a) + ' ' + sym + ' ' + shown + '</b>', ans, { keys: 'signed', hint: op === '*' || op === '/' ? 'Same signs give a positive answer; different signs give a negative answer.' : op === '-' && b < 0 ? 'Subtracting a negative is the same as adding.' : 'Use a number line: start at ' + neg(a) + '.', params: { a: a, b: b, op: op },
        sol: [neg(a) + ' ' + sym + ' ' + shown + ' = ' + neg(ans) + '.'] });
    },
    verify: function (q) {
      var p = q.params, v = q.check.value, i, x;
      if (p.op === '+' || p.op === '-') { x = p.a; var step = p.op === '+' ? p.b : -p.b; for (i = 0; i < Math.abs(step); i++) x += step > 0 ? 1 : -1; return x === v; }
      if (p.op === '*') { x = 0; for (i = 0; i < Math.abs(p.b); i++) x += p.a; return (p.b < 0 ? -x : x) === v; }
      if (p.op === '/') { x = 0; for (i = 0; i < Math.abs(v); i++) x += p.b; return (v < 0 ? -x : x) === p.a; }
      x = 0; for (i = 0; i < p.c; i++) x += p.a; return x - p.b === v;
    } });

  K.gen({ id: 'y7DecimalOps', objective: 'Y7-N-06', title: 'Calculating with decimals',
    make: function (r, L) {
      var a, b, op;
      if (L === 1) { a = dtext(Q(r.int(101, 9999), 100)); b = dtext(Q(r.int(11, 999), 10)); op = r.pick(['+', '-']); if (op === '-' && A.num(Qs(b)) > A.num(Qs(a))) { var t = a; a = b; b = t; } }
      else if (L === 2) { a = dtext(Q(r.int(2, 9), r.pick([10, 1]))); b = dtext(Q(r.int(2, 9) + r.pick([0, 10]), 10)); op = '*'; }
      else { b = dtext(Q(r.int(2, 9), r.pick([10, 100]))); a = dtext(A.mul(Qs(b), Q(r.int(4, 40)))); op = '/'; }
      var ans = op === '+' ? A.add(Qs(a), Qs(b)) : op === '-' ? A.sub(Qs(a), Qs(b)) : op === '*' ? A.mul(Qs(a), Qs(b)) : A.div(Qs(a), Qs(b));
      var sym = { '+': '+', '-': '−', '*': '×', '/': '÷' }[op];
      return K.dec('Work out <b>' + a + ' ' + sym + ' ' + b + '</b> without a calculator.', dtext(ans), { hint: op === '*' ? 'Multiply without the decimal points, then count the decimal places in the question.' : op === '/' ? 'Multiply both numbers by 10 or 100 so you divide by a whole number.' : 'Line up the decimal points.', params: { a: a, b: b, op: op },
        sol: op === '/' ? ['Make the divisor a whole number: multiply both numbers by ' + (b.split('.')[1].length === 1 ? '10' : '100') + '.', a + ' ÷ ' + b + ' = ' + dtext(ans) + '.'] : [a + ' ' + sym + ' ' + b + ' = ' + dtext(ans) + '.'] });
    },
    // independent: work in whole numbers of ten-thousandths
    verify: function (q) {
      var p = q.params, sc = function (s) { var parts = s.split('.'), f = (parts[1] || '').padEnd(4, '0'); return +parts[0] * 10000 + +f; };
      var a = sc(p.a), b = sc(p.b), v = Math.round(parseFloat(q.check.value) * 10000);
      if (p.op === '+') return a + b === v; if (p.op === '-') return a - b === v; if (p.op === '*') return a * b === v * 10000; return Math.abs(a - b * parseFloat(q.check.value)) < 1e-6;
    } });

  K.gen({ id: 'y7Bidmas', objective: 'Y7-N-07', title: 'Priority of operations, including powers',
    make: function (r, L) {
      var a = r.int(2, 9), b = r.int(2, 6), c = r.int(2, 9), d = r.int(2, 5), e, ans;
      if (L === 1) { e = c + ' + ' + a + ' × ' + b; ans = c + a * b; }
      else if (L === 2) { e = a + ' + ' + b + '^2 × ' + d; ans = a + b * b * d; if (r.chance(0.5)) { e = '(' + (c + d) + ' − ' + d + ')^2 − ' + a; ans = c * c - a; } }
      else { var m = b * d; e = (m * c) + ' ÷ (' + b + ' + ' + (d * 1) + ' − ' + d + ') + ' + a + '^3'; ans = m * c / b + a * a * a; }
      var shown = pretty(e.replace(/−/g, '-'));
      return K.int('Work out <b>' + shown + '</b>', ans, { keys: 'signed', hint: 'Brackets first, then powers, then × and ÷, then + and −.', params: { e: e }, sol: ['Brackets, then powers (indices), then × and ÷, then + and −.', shown + ' = ' + neg(ans) + '.'] });
    },
    verify: function (q) { var p = A.poly(A.parse(q.params.e.replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/'))); return !!p && A.eq(p[''] || A.Q(0), A.Q(q.check.value)); } });

  K.gen({ id: 'y7Powers', objective: 'Y7-N-08', title: 'Powers and roots',
    make: function (r, L) {
      if (L === 1) { var b = r.int(2, 12), cube = r.chance(0.35) && b <= 6; return K.int('Work out <b>' + b + (cube ? '³' : '²') + '</b>', cube ? b * b * b : b * b, { hint: cube ? b + '³ = ' + b + ' × ' + b + ' × ' + b + '.' : b + '² = ' + b + ' × ' + b + '.', params: { b: b, e: cube ? 3 : 2 }, sol: [b + (cube ? '³' : '²') + ' = ' + (cube ? b * b * b : b * b) + '.'] }); }
      if (L === 2) { var k = r.pick(['sq', 'cube', 'pow']), n;
        if (k === 'sq') { n = r.int(4, 15); return K.int('Work out <b>√' + n * n + '</b>', n, { hint: 'Which number multiplied by itself gives ' + n * n + '?', params: { root: 2, x: n * n }, sol: [n + ' × ' + n + ' = ' + n * n + ', so √' + n * n + ' = ' + n + '.'] }); }
        if (k === 'cube') { n = r.int(2, 6); return K.int('Work out <b>∛' + n * n * n + '</b>', n, { hint: 'Which number cubed gives ' + n * n * n + '?', params: { root: 3, x: n * n * n }, sol: [n + '³ = ' + n * n * n + ', so ∛' + n * n * n + ' = ' + n + '.'] }); }
        var bb = r.pick([2, 3, 4, 5]), ee = bb === 2 ? r.int(4, 8) : bb === 3 ? r.int(3, 5) : r.int(2, 4); return K.int('Work out <b>' + bb + pretty('^' + ee) + '</b>', Math.pow(bb, ee), { hint: 'Multiply ' + bb + ' by itself ' + ee + ' times.', params: { b: bb, e: ee }, sol: [Array(ee).fill(bb).join(' × ') + ' = ' + Math.pow(bb, ee) + '.'] }); }
      var x = r.int(10, 140); while (Math.sqrt(x) % 1 === 0) x++;
      var lo = Math.floor(Math.sqrt(x));
      return K.multi('√' + x + ' is not a whole number. Between which two consecutive whole numbers does it lie?', '{0} and {1}', [{ kind: 'int', value: lo }, { kind: 'int', value: lo + 1 }], { hint: 'Find the square numbers either side of ' + x + '.', params: { x: x }, answer: lo + ' and ' + (lo + 1), sol: [lo + '² = ' + lo * lo + ' and ' + (lo + 1) + '² = ' + (lo + 1) * (lo + 1) + '.', 'So √' + x + ' is between ' + lo + ' and ' + (lo + 1) + '. (It is about ' + Math.sqrt(x).toFixed(2) + '.)'] });
    },
    verify: function (q) {
      var p = q.params, i, s;
      if (p.root) { s = 1; for (i = 0; i < p.root; i++) s *= q.check.value; return s === p.x; }
      if (p.x) { var a = q.check.parts[0].value, b = q.check.parts[1].value; return b === a + 1 && a * a < p.x && b * b > p.x; }
      s = 1; for (i = 0; i < p.e; i++) s *= p.b; return s === q.check.value;
    } });

  K.gen({ id: 'y7Factors', objective: 'Y7-N-09', title: 'HCF, LCM and prime factorisation',
    make: function (r, L) {
      if (L === 1) { var g = r.pick([4, 6, 8, 9, 12, 15]), a = g * r.pick([2, 3, 5]), b = g * r.pick([7, 4, 3]); if (a === b) b = g * 7; var h = OM.gcd(a, b);
        return K.int('Find the <b>highest common factor</b> (HCF) of ' + a + ' and ' + b + '.', h, { hint: 'List the factors of each, or use prime factors.', params: { a: a, b: b, k: 'hcf' }, sol: ['The largest number that divides both ' + a + ' and ' + b + ' is ' + h + '.'] }); }
      if (L === 2) { var c = r.pick([6, 8, 9, 10, 12, 14, 15]), d = r.pick([4, 6, 8, 10, 12, 18, 20]); if (c === d) d = 21; var l = c * d / OM.gcd(c, d);
        return K.int('Find the <b>lowest common multiple</b> (LCM) of ' + c + ' and ' + d + '.', l, { hint: 'List multiples of the bigger number until one is also a multiple of the other.', params: { a: c, b: d, k: 'lcm' }, sol: ['The smallest number in both times tables is ' + l + '.'] }); }
      var n = r.pick([2, 4, 8]) * r.pick([3, 9]) * r.pick([5, 7, 1, 5]) * r.pick([1, 1, 11]);
      return { prompt: 'Write <b>' + fmt(n) + '</b> as a product of its prime factors. Use index notation.', input: { type: 'text', keys: 'algebra', placeholder: 'e.g. 2^3 × 3 × 5' }, check: { kind: 'pfactor', n: n },
        hint: 'Use a factor tree: keep splitting until every branch ends in a prime.', params: { n: n, k: 'pf' }, solution: [S('Split ' + n + ' into factors, and keep going until every factor is prime.'), S(fmt(n) + ' = ' + pretty(A.pfText(n)) + '.')] };
    },
    verify: function (q) {
      var p = q.params, v = q.check.value, i;
      if (p.k === 'hcf') { for (i = v + 1; i <= Math.min(p.a, p.b); i++) if (p.a % i === 0 && p.b % i === 0) return false; return p.a % v === 0 && p.b % v === 0; }
      if (p.k === 'lcm') { for (i = 1; i < v; i++) if (i % p.a === 0 && i % p.b === 0) return false; return v % p.a === 0 && v % p.b === 0; }
      return OM.markCheck(q.check, A.pfText(p.n)).correct && !OM.markCheck(q.check, String(p.n)).correct;
    } });

  K.gen({ id: 'y7Inverse', objective: 'Y7-N-10', title: 'Inverse operations',
    make: function (r, L) {
      if (L === 1) { var a = r.int(6, 19), b = r.int(3, 9); return K.int('Find the missing number: <b>? × ' + b + ' = ' + a * b + '</b>', a, { hint: 'Use the inverse: divide ' + a * b + ' by ' + b + '.', params: { a: a, b: b, k: 'mul' }, sol: [a * b + ' ÷ ' + b + ' = ' + a + '.'] }); }
      if (L === 2) { var x = dtext(Q(r.int(21, 199), 2)), d = r.int(3, 8), w = A.mul(Qs(x), Q(d)); return K.dec('Find the missing number: <b>? ÷ ' + d + ' = ' + x + '</b>', dtext(w), { hint: 'Use the inverse: multiply ' + x + ' by ' + d + '.', params: { x: x, d: d, k: 'div' }, sol: [x + ' × ' + d + ' = ' + dtext(w) + '.'] }); }
      var n = r.int(3, 25), m = r.int(3, 9), s = r.int(2, 20), res = n * m - s;
      return K.int('I think of a number. I multiply it by ' + m + ', then subtract ' + s + '. The answer is ' + res + '. What was my number?', n, { hint: 'Work backwards: add ' + s + ', then divide by ' + m + '.', params: { m: m, s: s, res: res, k: 'think' }, sol: ['Undo the steps in reverse order.', res + ' + ' + s + ' = ' + (res + s) + '. ' + (res + s) + ' ÷ ' + m + ' = ' + n + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'mul') return q.check.value * p.b === p.a * p.b; if (p.k === 'div') return A.eq(A.div(Qs(q.check.value), Q(p.d)), Qs(p.x)); return q.check.value * p.m - p.s === p.res; } });

  // ================= FRACTIONS, DECIMALS, PERCENTAGES (Gaslight Lanes) =================
  K.gen({ id: 'y7Fractions', objective: 'Y7-N-11', title: 'Calculating with fractions',
    make: function (r, L) {
      var d1 = r.int(2, 9), d2 = r.int(2, 9); while (d2 === d1) d2 = r.int(2, 9);
      var a = r.int(1, d1 - 1), b = r.int(1, d2 - 1), op = L === 1 ? r.pick(['+', '-']) : L === 2 ? r.pick(['*', '/']) : r.pick(['+', '*']);
      var w1 = L === 3 ? r.int(1, 3) : 0, w2 = L === 3 ? r.int(1, 2) : 0;
      var x = Q(w1 * d1 + a, d1), y = Q(w2 * d2 + b, d2);
      if (op === '-' && A.num(x) < A.num(y)) { var t = x; x = y; y = t; t = a; a = b; b = t; t = d1; d1 = d2; d2 = t; }
      var ans = op === '+' ? A.add(x, y) : op === '-' ? A.sub(x, y) : op === '*' ? A.mul(x, y) : A.div(x, y);
      var lab = function (q, w) { var n = Number(q.n), d = Number(q.d); return w ? F(n - w * d, d, w) : F(n, d); };
      var sym = { '+': '+', '-': '−', '*': '×', '/': '÷' }[op];
      return K.frac('Work out &nbsp;' + lab(x, L === 3 ? w1 : 0) + ' ' + sym + ' ' + lab(y, L === 3 ? w2 : 0) + '. Give your answer in its simplest form.', Number(ans.n), Number(ans.d), { mixed: ans.n > ans.d, hint: op === '*' ? 'Change mixed numbers to improper fractions. Multiply the tops and multiply the bottoms.' : op === '/' ? 'Keep the first fraction, change ÷ to ×, and flip the second fraction.' : 'Use a common denominator.', params: { x: A.qText(x), y: A.qText(y), op: op },
        sol: (L === 3 ? ['Change to improper fractions: ' + F(Number(x.n), Number(x.d)) + ' and ' + F(Number(y.n), Number(y.d)) + '.'] : []).concat([op === '/' ? 'Flip the second fraction and multiply.' : op === '*' ? 'Multiply numerators and denominators.' : 'Use a common denominator of ' + (Number(x.d) * Number(y.d) / OM.gcd(Number(x.d), Number(y.d))) + '.', 'Answer: ' + (ans.n > ans.d ? F(Number(ans.n % ans.d), Number(ans.d), Number(ans.n / ans.d)) : F(Number(ans.n), Number(ans.d))) + '.']) });
    },
    // independent: decimals with floating point, compared to the fraction given
    verify: function (q) { var p = q.params, x = A.num(Qs(p.x)), y = A.num(Qs(p.y)), v = p.op === '+' ? x + y : p.op === '-' ? x - y : p.op === '*' ? x * y : x / y; return Math.abs(v - q.check.n / q.check.d) < 1e-9 && OM.gcd(q.check.n, q.check.d) === 1; } });

  var TERM = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 8], [3, 8], [5, 8], [7, 8], [3, 20], [7, 20], [9, 25], [11, 40], [13, 50]];
  K.gen({ id: 'y7FracDec', objective: 'Y7-N-12', title: 'Terminating decimals and fractions',
    make: function (r, L) {
      var f = r.pick(TERM), w = L === 3 ? r.int(1, 4) : 0, q = Q(w * f[1] + f[0], f[1]), d = dtext(q);
      if (L === 1) return K.dec('Write ' + F(f[0], f[1]) + ' as a decimal.', d, { hint: F(f[0], f[1]) + ' means ' + f[0] + ' ÷ ' + f[1] + '.', params: { n: f[0], d: f[1], w: 0, k: 'toDec' }, sol: [f[0] + ' ÷ ' + f[1] + ' = ' + d + '.'] });
      if (L === 2) return K.frac('Write <b>' + d + '</b> as a fraction in its simplest form.', f[0], f[1], { form: 'simplest', hint: 'Write it over 10, 100 or 1000, then simplify.', params: { n: f[0], d: f[1], w: 0, k: 'toFrac', dec: d }, sol: [d + ' = ' + F(Number(Qs(d).n * (10n ** BigInt(d.split('.')[1].length)) / Qs(d).d), Math.pow(10, d.split('.')[1].length)) + '.', 'Simplify: ' + F(f[0], f[1]) + '.'] });
      return K.frac('Write <b>' + d + '</b> as a fraction. (A mixed number or an improper fraction are both fine.)', Number(q.n), Number(q.d), { mixed: true, hint: 'The whole number part stays; turn the decimal part into a fraction.', params: { n: Number(q.n), d: Number(q.d), w: w, k: 'toFrac', dec: d }, sol: [d + ' = ' + w + ' + ' + dtext(Q(f[0], f[1])) + ' = ' + F(f[0], f[1], w) + ' = ' + F(Number(q.n), Number(q.d)) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'toDec') return Math.abs(parseFloat(q.check.value) - p.n / p.d) < 1e-12; return Math.abs(q.check.n / q.check.d - parseFloat(p.dec)) < 1e-12; } });

  K.gen({ id: 'y7Percent', objective: 'Y7-N-13', title: 'Percentages',
    make: function (r, L) {
      if (L === 1) { var pc = r.pick([10, 15, 20, 25, 30, 35, 45, 60, 75]), amt = r.pick([40, 60, 80, 120, 160, 240, 300, 360]); return K.dec('Work out <b>' + pc + '% of ' + amt + '</b> without a calculator.', dtext(Q(pc * amt, 100)), { hint: 'Find 10%, then 5% if you need it, and build up.', params: { pc: pc, amt: amt, k: 'of' }, sol: ['10% of ' + amt + ' = ' + amt / 10 + '.', pc + '% = ' + dtext(Q(pc * amt, 100)) + '.'] }); }
      if (L === 2) { var tot = r.pick([20, 25, 40, 50, 80]), part = r.int(1, tot - 1); while ((part * 100) % tot) part++; var thing = r.pick(['questions right', 'goals scored', 'seeds that grew']);
        return K.int('In a test, ' + part + ' out of ' + tot + ' ' + thing + '. What <b>percentage</b> is that?', part * 100 / tot, { suffix: '%', hint: 'Write it as a fraction out of ' + tot + ', then change to out of 100.', params: { part: part, tot: tot, k: 'as' }, sol: [F(part, tot) + ' = ' + F(part * 100 / tot, 100) + ' = ' + part * 100 / tot + '%.'] }); }
      var base = r.pick([40, 60, 80, 120, 250]), p2 = r.pick([5, 15, 20, 30, 125, 150]), up = p2 > 100 ? true : r.chance(0.5);
      if (p2 > 100) return K.dec('Work out <b>' + p2 + '% of ' + base + '</b>.', dtext(Q(p2 * base, 100)), { hint: p2 + '% is more than the whole amount: 100% + ' + (p2 - 100) + '%.', params: { pc: p2, amt: base, k: 'of' }, sol: ['100% of ' + base + ' = ' + base + '. ' + (p2 - 100) + '% of ' + base + ' = ' + dtext(Q((p2 - 100) * base, 100)) + '.', 'Total: ' + dtext(Q(p2 * base, 100)) + '.'] });
      var res = A.mul(Q(base), Q(up ? 100 + p2 : 100 - p2, 100));
      return K.dec((up ? 'Increase' : 'Decrease') + ' <b>' + base + '</b> by <b>' + p2 + '%</b>.', dtext(res), { hint: 'Find ' + p2 + '% of ' + base + ', then ' + (up ? 'add it on' : 'take it away') + '.', params: { pc: up ? 100 + p2 : 100 - p2, amt: base, k: 'of' }, sol: [p2 + '% of ' + base + ' = ' + dtext(Q(p2 * base, 100)) + '.', base + (up ? ' + ' : ' − ') + dtext(Q(p2 * base, 100)) + ' = ' + dtext(res) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'as') return q.check.value * p.tot === p.part * 100; return Math.abs(parseFloat(q.check.value) * 100 - p.pc * p.amt) < 1e-9; } });

  K.gen({ id: 'y7Operators', objective: 'Y7-N-14', title: 'Fractions and percentages as operators',
    make: function (r, L) {
      if (L === 1) { var d = r.pick([3, 4, 5, 6, 8]), n = r.int(1, d - 1), amt = d * r.int(3, 15); return K.int('Work out ' + F(n, d) + ' of ' + amt + '.', amt / d * n, { hint: 'Divide by ' + d + ', then multiply by ' + n + '.', params: { n: n, d: d, amt: amt }, sol: [amt + ' ÷ ' + d + ' = ' + amt / d + '.', amt / d + ' × ' + n + ' = ' + amt / d * n + '.'] }); }
      if (L === 2) { var pc = r.pick([3, 7, 12, 35, 60, 115, 140]), inc = r.pick(['find', 'up', 'down']); if (pc > 100) inc = 'find';
        var m = inc === 'find' ? Q(pc, 100) : inc === 'up' ? Q(100 + pc, 100) : Q(100 - pc, 100);
        return K.dec(inc === 'find' ? 'What decimal do you multiply by to find <b>' + pc + '%</b> of an amount?' : 'What single number do you multiply by to ' + (inc === 'up' ? 'increase' : 'decrease') + ' an amount by <b>' + pc + '%</b>?', dtext(m), { hint: inc === 'find' ? 'Divide the percentage by 100.' : (inc === 'up' ? '100% + ' : '100% − ') + pc + '%, then divide by 100.', params: { pc: pc, inc: inc }, sol: [inc === 'find' ? pc + '% = ' + pc + ' ÷ 100 = ' + dtext(m) + '.' : (inc === 'up' ? '100 + ' : '100 − ') + pc + ' = ' + (inc === 'up' ? 100 + pc : 100 - pc) + '%, so multiply by ' + dtext(m) + '.'] }); }
      var f = r.pick([[3, 8], [5, 6], [2, 7], [4, 9]]), x = dtext(Q(r.int(101, 999), 10)), exact = A.mul(Qs(x), Q(f[0], f[1]));
      return K.approx('Use a calculator to work out ' + F(f[0], f[1]) + ' of ' + x + '. Give your answer to 2 decimal places.', A.qText(exact).replace('−', '-'), { dp: 2 }, { calc: true, hint: 'Multiply ' + x + ' by ' + f[0] + ', then divide by ' + f[1] + '.', params: { f: f, x: x }, sol: [x + ' × ' + f[0] + ' ÷ ' + f[1] + ' = ' + (parseFloat(x) * f[0] / f[1]).toFixed(5) + '…', 'To 2 decimal places: ' + A.round(A.qText(exact), { dp: 2 }) + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      // whole numbers only: hundredths of x·a/b, rounding halves up
      if (p.f) { var X = Math.round(parseFloat(p.x) * 10), h = Math.floor((20 * X * p.f[0] + p.f[1]) / (2 * p.f[1])); return Math.round(parseFloat(A.round(q.check.value, { dp: 2 })) * 100) === h; }
      if (p.inc) return Math.abs(parseFloat(q.check.value) * 100 - (p.inc === 'find' ? p.pc : p.inc === 'up' ? 100 + p.pc : 100 - p.pc)) < 1e-9;
      return q.check.value * p.d === p.amt * p.n;
    } });

  // ================= ALGEBRA (Cipher Library) =================
  K.gen({ id: 'y7Notation', objective: 'Y7-A-01', title: 'Algebraic notation',
    make: function (r, L) {
      var v = r.pick(['a', 'b', 'm', 'n', 'p', 't', 'x', 'y']), w = r.pick(['c', 'd', 'k', 'r', 's']);
      if (L === 1) { var k = r.int(2, 9), right = k + v + w; return K.choice('Which is the same as <b>' + v + ' × ' + w + ' × ' + k + '</b>?', opts(r, right, [v + w + '+' + k, k + v + ' + ' + w, (k + 1) + v + w]), right, { hint: 'In algebra we leave out the × sign and write the number first.', params: { right: right, k: k, v: v, w: w, kind: 'pick' }, sol: [v + ' × ' + w + ' × ' + k + ' is written ' + right + '.'] }); }
      if (L === 2) { var n = r.int(3, 6), opt = r.chance(0.5);
        if (opt) return K.expr('Write <b>' + Array(n).fill(v).join(' + ') + '</b> in its simplest form.', n + v, 'simplified', { hint: 'Count how many ' + v + 's there are.', params: { e: Array(n).fill(v).join(' + ') }, sol: ['There are ' + n + ' lots of ' + v + ': ' + n + v + '.'] });
        var p = r.int(2, 3); return K.expr('Write <b>' + Array(p).fill(v).join(' × ') + ' × ' + w + '</b> using index notation.', v + '^' + p + w, 'simplified', { hint: v + ' × ' + v + ' is written ' + v + '².', params: { e: Array(p).fill(v).join('*') + '*' + w }, sol: [Array(p).fill(v).join(' × ') + ' = ' + pretty(v + '^' + p) + ', so the answer is ' + pretty(v + '^' + p + w) + '.'] }); }
      var c = r.int(2, 9), d = r.int(2, 5);
      return K.expr(v + ' is multiplied by itself, then multiplied by ' + c + ', and then ' + d + ' is added. Write an expression for this.', c + v + '^2 + ' + d, 'any', { hint: v + ' multiplied by itself is ' + v + '².', params: { e: c + '*' + v + '*' + v + '+' + d }, sol: [v + ' × ' + v + ' = ' + pretty(v + '^2') + '. Times ' + c + ': ' + pretty(c + v + '^2') + '. Add ' + d + ': ' + pretty(c + v + '^2 + ' + d) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.kind === 'pick') return same(q.check.value, p.v + '*' + p.w + '*' + p.k) && !same(p.v + p.w + '+' + p.k, p.v + '*' + p.w + '*' + p.k); return same(q.check.answer, p.e); } });

  K.gen({ id: 'y7Substitute', objective: 'Y7-A-02', title: 'Substituting into expressions and formulae',
    make: function (r, L) {
      if (L === 1) { var a = r.int(2, 9), b = r.int(2, 9), m = r.int(2, 6), e = m + 'a + b'; return K.int('Work out the value of <b>' + m + 'a + b</b> when a = ' + a + ' and b = ' + b + '.', m * a + b, { hint: m + 'a means ' + m + ' × a.', params: { e: e, env: { a: a, b: b } }, sol: [m + ' × ' + a + ' + ' + b + ' = ' + (m * a + b) + '.'] }); }
      if (L === 2) { var x = r.int(-5, -1), y = r.int(2, 7), c = r.int(2, 5), e2 = c + 'x^2 - ' + 'y'; return K.int('Work out <b>' + pretty(c + 'x^2') + ' − y</b> when x = ' + neg(x) + ' and y = ' + y + '.', c * x * x - y, { keys: 'signed', hint: 'Square x first: (' + neg(x) + ')² is positive.', params: { e: e2, env: { x: x, y: y } }, sol: ['(' + neg(x) + ')² = ' + x * x + '.', c + ' × ' + x * x + ' − ' + y + ' = ' + (c * x * x - y) + '.'] }); }
      var u = r.int(2, 20), acc = dtext(Q(r.int(15, 98), 10)), t = r.int(2, 9), vv = A.add(Q(u), A.mul(Qs(acc), Q(t)));
      return K.dec('The formula <b>v = u + at</b> gives the speed of an object. Work out v when u = ' + u + ', a = ' + acc + ' and t = ' + t + '.', dtext(vv), { calc: true, hint: 'at means a × t. Multiply first, then add u.', params: { e: 'u + a*t', env: { u: u, a: parseFloat(acc), t: t } }, sol: [acc + ' × ' + t + ' = ' + dtext(A.mul(Qs(acc), Q(t))) + '.', u + ' + ' + dtext(A.mul(Qs(acc), Q(t))) + ' = ' + dtext(vv) + '.'] });
    },
    verify: function (q) { var p = q.params, e = A.parse(p.e), f = function (n) { switch (n.t) { case 'num': return parseFloat(n.v); case 'var': return p.env[n.v]; case 'par': return f(n.a); case 'neg': return -f(n.a); case 'add': return n.terms.reduce(function (s, t) { return s + t.s * f(t.e); }, 0); case 'mul': return n.f.reduce(function (s, x, i) { return i ? (n.ops[i] === '/' ? s / f(x) : s * f(x)) : f(x); }, 0); case 'pow': return Math.pow(f(n.b), f(n.e)); } }; return Math.abs(f(e) - parseFloat(q.check.value)) < 1e-9; } });

  var VOCAB = [['3x + 2 = 11', 'equation'], ['4a − 7b', 'expression'], ['2n + 1 > 9', 'inequality'], ['A = lw', 'formula'], ['5y', 'term'], ['x² + 3x', 'expression'], ['7 − 2m = 1', 'equation'], ['P = 2l + 2w', 'formula'], ['t − 4 ≤ 10', 'inequality']];
  K.gen({ id: 'y7Vocab', objective: 'Y7-A-03', title: 'Expressions, equations, inequalities, terms and factors',
    make: function (r, L) {
      if (L === 1) { var it = r.pick(VOCAB.filter(function (x) { return x[1] !== 'term'; })); return K.choice('Is <b>' + it[0] + '</b> an expression, an equation, an inequality or a formula?', ['expression', 'equation', 'inequality', 'formula'], it[1], { hint: 'An equation has = and can be solved. A formula links two or more letters. An inequality uses <, >, ≤ or ≥.', params: { it: it }, sol: [it[0] + ' is ' + (it[1] === 'expression' || it[1] === 'equation' || it[1] === 'inequality' ? 'an ' : 'a ') + it[1] + '.'] }); }
      if (L === 2) { var a = r.int(2, 9), b = r.int(2, 9), c = r.int(1, 9), coef = r.chance(0.5); var e = a + 'x − ' + b + 'y + ' + c;
        if (coef) { var v = r.pick(['x', 'y']); return K.int('What is the <b>coefficient</b> of ' + v + ' in <b>' + e + '</b>?', v === 'x' ? a : -b, { keys: 'signed', hint: 'The coefficient is the number in front of the letter, including its sign.', params: { e: e, v: v, k: 'coef' }, sol: ['The term with ' + v + ' is ' + (v === 'x' ? a + 'x' : '−' + b + 'y') + ', so the coefficient is ' + (v === 'x' ? a : '−' + b) + '.'] }); }
        return K.int('How many <b>terms</b> are in <b>' + e + '</b>?', 3, { hint: 'Terms are separated by + and − signs.', params: { e: e, k: 'terms' }, sol: ['The terms are ' + a + 'x, −' + b + 'y and ' + c + ': 3 terms.'] }); }
      var k = r.int(2, 6), set = [k * 2 + 'x', k * 3 + 'y', 'x²', k + 'y'], f = k + 'y';
      return K.choice('Which of these is a <b>factor</b> of <b>' + k * 6 + 'xy</b>?', r.shuffle([k + 'y', (k * 6 + 1) + '', 'x²', k * 12 + 'x']).map(function (x) { return { value: x, label: x }; }), f, { hint: 'A factor divides exactly into ' + k * 6 + 'xy.', params: { k: k, f: f, k2: 'factor' }, sol: [k * 6 + 'xy ÷ ' + k + 'y = 6x, so ' + k + 'y is a factor.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.it) { var s = p.it[0]; var want = /[<>≤≥]/.test(s) ? 'inequality' : /=/.test(s) ? (/^[A-Z] =/.test(s) ? 'formula' : 'equation') : 'expression'; return q.check.value === want; }
      if (p.k === 'terms') return p.e.split(/ [+−] /).length === q.check.value;
      if (p.k === 'coef') { var m = new RegExp('(−?)\\s*(\\d+)' + p.v).exec(p.e.replace(/ − /g, ' −').replace(/ \+ /g, ' ')); return m && (m[1] ? -m[2] : +m[2]) === q.check.value; }
      return q.check.value === p.k + 'y' && (p.k * 6) % p.k === 0;
    } });

  K.gen({ id: 'y7Simplify', objective: 'Y7-A-04', title: 'Simplifying, expanding and factorising',
    make: function (r, L) {
      var v = r.pick(['x', 'a', 'n', 'y']), w = r.pick(['b', 'm', 't']);
      if (L === 1) { var a = r.int(2, 9), b = r.int(2, 9), c = r.int(1, a - 1 || 1), d = r.int(1, 9), e = a + v + ' + ' + b + w + ' - ' + c + v + ' + ' + d + w;
        var ans = lin(a - c, 0, v) + ' + ' + (b + d) + w;
        return K.expr('Simplify <b>' + nm(e) + '</b>', ans, 'simplified', { hint: 'Collect the ' + v + ' terms, then the ' + w + ' terms.', params: { q: e }, sol: [v + ' terms: ' + a + v + ' − ' + c + v + ' = ' + lin(a - c, 0, v) + '.', w + ' terms: ' + b + w + ' + ' + d + w + ' = ' + (b + d) + w + '.', 'Answer: ' + nm(ans) + '.'] }); }
      if (L === 2) { var k = r.pick([2, 3, 4, 5, -2, -3]), p = r.int(2, 6), s = r.int(1, 9) * r.pick([1, -1]), qe = (k === -1 ? '-' : k) + '(' + lin(p, s, v) + ')', ans2 = lin(k * p, k * s, v);
        return K.expr('Expand <b>' + nm(qe) + '</b>', ans2, 'expanded', { hint: 'Multiply each term inside the bracket by ' + nm(String(k)) + '.', params: { q: qe }, sol: [nm(k + ' × ' + p + v + ' = ' + (k * p) + v) + '.', nm(k + ' × ' + s + ' = ' + k * s) + '.', 'Answer: ' + nm(ans2) + '.'] }); }
      if (r.chance(0.5)) { var g = r.pick([2, 3, 4, 5, 6]), m = r.int(1, 7), c2 = r.int(1, 9); while (OM.gcd(m, c2) !== 1) c2++; var e3 = lin(g * m, g * c2, v), f3 = g + '(' + lin(m, c2, v) + ')';
        return K.expr('Factorise fully: <b>' + nm(e3) + '</b>', f3, 'factorised', { hint: 'Find the highest common factor of ' + g * m + ' and ' + g * c2 + '.', params: { q: e3 }, sol: ['The HCF of ' + g * m + ' and ' + g * c2 + ' is ' + g + '.', nm(e3) + ' = ' + nm(f3) + '.'] }); }
      var a4 = r.int(2, 5), b4 = r.int(1, 9), c4 = r.int(2, 4), d4 = r.int(1, 9) * r.pick([1, -1]), e4 = a4 + '(' + lin(1, b4, v) + ') + ' + c4 + '(' + lin(1, d4, v) + ')', ans4 = lin(a4 + c4, a4 * b4 + c4 * d4, v);
      return K.expr('Expand and simplify <b>' + nm(e4) + '</b>', ans4, 'expanded', { hint: 'Expand each bracket, then collect like terms.', params: { q: e4 }, sol: [nm(a4 + '(' + lin(1, b4, v) + ') = ' + lin(a4, a4 * b4, v)) + ' and ' + nm(c4 + '(' + lin(1, d4, v) + ') = ' + lin(c4, c4 * d4, v)) + '.', 'Collect: ' + nm(ans4) + '.'] });
    },
    verify: function (q) { return same(q.check.answer, q.params.q) && OM.markCheck(q.check, q.check.answer).correct; } });

  K.gen({ id: 'y7Solve', objective: 'Y7-A-05', title: 'Solving linear equations',
    make: function (r, L) {
      var x = r.int(-6, 12) || 3, eq, a, b, c;
      if (L === 1) { var t = r.pick(['add', 'mul', 'div']); x = Math.abs(x) + 1;
        if (t === 'add') { b = r.int(2, 20); eq = 'x + ' + b + ' = ' + (x + b); } else if (t === 'mul') { a = r.int(2, 9); eq = a + 'x = ' + a * x; } else { a = r.int(2, 6); eq = 'x/' + a + ' = ' + x; x = x * a; eq = 'x/' + a + ' = ' + x / a; } }
      else if (L === 2) { a = r.int(2, 9); b = r.int(1, 15) * r.pick([1, -1]); eq = lin(a, b) + ' = ' + (a * x + b); }
      else if (r.chance(0.5)) { a = r.int(4, 9); c = r.int(1, a - 1); b = r.int(1, 15); var rhs = (a - c) * x + b, d = r.int(1, 20); eq = lin(a, b) + ' = ' + lin(c, (a - c) * x + b - 0) ; eq = lin(a, b) + ' = ' + lin(c, a * x + b - c * x); }
      else { a = r.int(2, 5); b = r.int(1, 6); var tot = r.int(10, 50); eq = a + '(x + ' + b + ') = ' + tot; var sol = A.div(Q(tot - a * b), Q(a)); x = sol; }
      var sides = eq.split(' = '), Ls = poly(sides[0]), Rs = poly(sides[1]), dif = A.add(Ls['x^1'] || Q(0), A.neg(Rs['x^1'] || Q(0))), con = A.add(Rs[''] || Q(0), A.neg(Ls[''] || Q(0)));
      var ans = A.div(con, dif), ansText = A.qText(ans).replace('−', '-');
      var shown = eq.replace(/x\/(\d+)/, function (m, d) { return F('x', d); }).replace(/-/g, '−');
      return K.solve('Solve <b>' + shown + '</b>', ansText, { hint: L === 1 ? 'Do the inverse operation to both sides.' : L === 2 ? 'Undo the + or − first, then the ×.' : 'Get the x terms on one side and the numbers on the other.', params: { eq: eq },
        sol: [L === 3 && eq.indexOf('(') < 0 ? 'Subtract the smaller x term from both sides.' : 'Use inverse operations, doing the same to both sides.', 'x = ' + nm(A.qText(ans)) + '.'] });
    },
    // independent: substitute the answer into both sides
    verify: function (q) { var s = q.params.eq.split(' = '), v = A.parseQ(q.check.value); if (!v) return false; var x = A.num(v), ev = function (t) { var e = A.parse(t.replace(/x/g, '(' + x + ')')); var p = A.poly(e); return p ? A.num(p[''] || A.Q(0)) : NaN; }; return Math.abs(ev(s[0]) - ev(s[1])) < 1e-9; } });

  K.gen({ id: 'y7Sequences', objective: 'Y7-A-06', title: 'Term-to-term and position-to-term rules',
    make: function (r, L) {
      if (L === 1) { var s = r.int(-5, 20), d = r.int(2, 9) * r.pick([1, 1, -1]), n = r.int(5, 8); return K.int('A sequence starts at ' + neg(s) + '. The rule is "' + (d > 0 ? 'add ' + d : 'subtract ' + (-d)) + '". What is the <b>' + n + 'th</b> term?', s + (n - 1) * d, { keys: 'signed', hint: 'Write out the terms one at a time.', params: { s: s, d: d, n: n, k: 'tt' }, sol: ['Terms: ' + [0, 1, 2, 3, 4, 5, 6, 7].slice(0, n).map(function (i) { return neg(s + i * d); }).join(', ') + '.'] }); }
      var a = r.int(2, 9), b = r.int(-9, 9), rule = lin(a, b, 'n');
      if (L === 2) { var pos = r.int(10, 50); return K.int('The nth term of a sequence is <b>' + nm(rule) + '</b>. Work out the <b>' + pos + 'th</b> term.', a * pos + b, { keys: 'signed', hint: 'Put n = ' + pos + ' into the rule.', params: { a: a, b: b, pos: pos, k: 'pt' }, sol: [a + ' × ' + pos + (b < 0 ? ' − ' + (-b) : ' + ' + b) + ' = ' + (a * pos + b) + '.'] }); }
      var target = r.int(40, 150), isTerm = (target - b) % a === 0;
      return K.choice('The nth term of a sequence is <b>' + nm(rule) + '</b>. Is <b>' + target + '</b> a term in the sequence?', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], isTerm ? 'yes' : 'no', { hint: 'Solve ' + nm(rule) + ' = ' + target + '. Is n a whole number?', params: { a: a, b: b, target: target, k: 'is' },
        sol: [nm(rule) + ' = ' + target + ' gives n = ' + nm(A.qText(A.div(Q(target - b), Q(a)))) + '.', isTerm ? 'n is a whole number, so ' + target + ' is a term.' : 'n is not a whole number, so ' + target + ' is not a term.'] });
    },
    verify: function (q) { var p = q.params, i, x; if (p.k === 'tt') { x = p.s; for (i = 1; i < p.n; i++) x += p.d; return x === q.check.value; } if (p.k === 'pt') return p.a * p.pos + p.b === q.check.value; var found = false; for (i = 1; i <= 200; i++) if (p.a * i + p.b === p.target) found = true; return q.check.value === (found ? 'yes' : 'no'); } });

  K.gen({ id: 'y7NthTerm', objective: 'Y7-A-07', title: 'Finding the nth term',
    make: function (r, L) {
      var d = L === 2 ? -r.int(2, 6) : r.int(2, 9), c = L === 3 ? -r.int(4, 15) : r.int(-3, 12), terms = [1, 2, 3, 4].map(function (n) { return d * n + c; });
      if (L === 2) { c = r.int(20, 40); terms = [1, 2, 3, 4].map(function (n) { return d * n + c; }); }
      var ans = L === 2 ? c + ' - ' + (-d) + 'n' : lin(d, c, 'n');
      return K.expr('Find the <b>nth term</b> of the sequence &nbsp;<b>' + terms.map(neg).join(', ') + ', …</b>', ans, 'any', { placeholder: 'e.g. 3n + 2', hint: 'The terms go ' + (d > 0 ? 'up' : 'down') + ' by ' + Math.abs(d) + ' each time, so start with ' + d + 'n.', params: { terms: terms },
        sol: ['The difference is ' + neg(d) + ', so the rule starts ' + nm(d + 'n') + '.', nm(d + 'n') + ' gives ' + [1, 2, 3, 4].map(function (n) { return neg(d * n); }).join(', ') + '. Adjust by ' + neg(c) + '.', 'nth term: ' + nm(lin(d, c, 'n')) + '.'] });
    },
    verify: function (q) { var p = q.params, e = A.parse(q.check.answer); return p.terms.every(function (t, i) { var pp = A.poly(A.parse(q.check.answer.replace(/n/g, '(' + (i + 1) + ')'))); return pp && A.eq(pp[''] || A.Q(0), A.Q(t)); }) && !!e; } });

  K.gen({ id: 'y7Coords', objective: 'Y7-A-08', title: 'Coordinates in four quadrants',
    make: function (r, L) {
      if (L === 1) { var x = r.int(-6, 6) || -2, y = r.int(-6, 6) || 3; return { prompt: 'What are the coordinates of point P?', visual: V.grid4({ n: 6, points: [{ x: x, y: y, label: 'P' }] }), input: { type: 'coord' }, check: { kind: 'coord', x: x, y: y }, hint: 'x (across) first, then y (up or down).', params: { x: x, y: y }, solution: [S('P is at (' + neg(x) + ', ' + neg(y) + ').')] }; }
      if (L === 2) { var x1 = r.int(-6, 6), y1 = r.int(-6, 6), x2 = x1 + 2 * r.int(-4, 4), y2 = y1 + 2 * r.int(-4, 4); if (x1 === x2 && y1 === y2) x2 += 4;
        return { prompt: 'Find the <b>midpoint</b> of A(' + neg(x1) + ', ' + neg(y1) + ') and B(' + neg(x2) + ', ' + neg(y2) + ').', input: { type: 'coord' }, check: { kind: 'coord', x: (x1 + x2) / 2, y: (y1 + y2) / 2 }, hint: 'Add the x-coordinates and halve; do the same for y.', params: { pts: [[x1, y1], [x2, y2]] },
          solution: [S('x: (' + neg(x1) + ' + ' + neg(x2) + ') ÷ 2 = ' + neg((x1 + x2) / 2) + '. y: (' + neg(y1) + ' + ' + neg(y2) + ') ÷ 2 = ' + neg((y1 + y2) / 2) + '.')] }; }
      var ax = r.int(-5, 1), ay = r.int(-5, 1), ux = r.int(1, 4), uy = r.int(-2, 2), vx = r.int(-2, 1), vy = r.int(2, 4);
      var B = [ax + ux, ay + uy], D = [ax + vx, ay + vy], C = [ax + ux + vx, ay + uy + vy];
      return { prompt: 'ABCD is a parallelogram with A(' + neg(ax) + ', ' + neg(ay) + '), B(' + neg(B[0]) + ', ' + neg(B[1]) + ') and D(' + neg(D[0]) + ', ' + neg(D[1]) + '). Find the coordinates of C.', input: { type: 'coord' }, check: { kind: 'coord', x: C[0], y: C[1] },
        hint: 'To get from A to B you move ' + ux + ' across and ' + uy + ' up. Do the same move from D.', params: { A: [ax, ay], B: B, D: D }, visual: V.grid4({ n: 8, points: [{ x: ax, y: ay, label: 'A' }, { x: B[0], y: B[1], label: 'B' }, { x: D[0], y: D[1], label: 'D' }] }),
        solution: [S('A to B is a move of (' + neg(ux) + ', ' + neg(uy) + ').'), S('From D, the same move reaches C(' + neg(C[0]) + ', ' + neg(C[1]) + ').')] };
    },
    verify: function (q) { var p = q.params; if (p.pts) return 2 * q.check.x === p.pts[0][0] + p.pts[1][0] && 2 * q.check.y === p.pts[0][1] + p.pts[1][1]; if (p.A) return q.check.x - p.D[0] === p.B[0] - p.A[0] && q.check.y - p.D[1] === p.B[1] - p.A[1]; return q.check.x === p.x && q.check.y === p.y; } });

  // ================= RATIO AND MEASURES (Market Gears) =================
  K.gen({ id: 'y7RatioSimplify', objective: 'Y7-R-01', title: 'Simplifying ratios',
    make: function (r, L) {
      var a = r.int(1, 7), b = r.int(1, 9); while (OM.gcd(a, b) !== 1 || a === b) b = r.int(1, 9);
      if (L === 1) { var k = r.int(2, 9); return K.multi('Write <b>' + a * k + ' : ' + b * k + '</b> in its simplest form.', '{0} : {1}', [{ kind: 'int', value: a }, { kind: 'int', value: b }], { hint: 'Divide both sides by their highest common factor.', params: { x: a * k, y: b * k }, answer: a + ' : ' + b, sol: ['The HCF of ' + a * k + ' and ' + b * k + ' is ' + k + '.', 'Simplest form: ' + a + ' : ' + b + '.'] }); }
      if (L === 2) { var cm = a * 10 * r.pick([1, 5]), m = b * cm / a; if (m % 100 === 0 || m < 100) { m = b * 100; cm = a * 20; } var g = OM.gcd(cm, m);
        return K.multi('Write <b>' + cm + ' cm : ' + dtext(Q(m, 100)) + ' m</b> in its simplest form.', '{0} : {1}', [{ kind: 'int', value: cm / g }, { kind: 'int', value: m / g }], { hint: 'Change both to centimetres first: 1 m = 100 cm.', params: { x: cm, y: m }, answer: cm / g + ' : ' + m / g, sol: [dtext(Q(m, 100)) + ' m = ' + m + ' cm.', cm + ' : ' + m + ' = ' + cm / g + ' : ' + m / g + '.'] }); }
      var x = r.pick([2, 4, 5, 8]), y = r.int(x + 1, 9 * x); if (y % x === 0) y++;
      return K.dec('Write <b>' + x + ' : ' + y + '</b> in the form <b>1 : n</b>. What is n?', dtext(Q(y, x)), { hint: 'Divide both sides by ' + x + '.', params: { x: x, y: y, oneN: true }, sol: [x + ' ÷ ' + x + ' = 1 and ' + y + ' ÷ ' + x + ' = ' + dtext(Q(y, x)) + '.', '1 : ' + dtext(Q(y, x)) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.oneN) return Math.abs(parseFloat(q.check.value) * p.x - p.y) < 1e-9; var a = q.check.parts[0].value, b = q.check.parts[1].value; return a * p.y === b * p.x && OM.gcd(a, b) === 1; } });

  K.gen({ id: 'y7RatioShare', objective: 'Y7-R-02', title: 'Sharing in a ratio',
    make: function (r, L) {
      var a = r.int(1, 5), b = r.int(2, 7); while (a === b) b = r.int(2, 7); var k = r.int(3, 20), n1 = r.pick(OM.NAMES), n2 = r.pick(OM.NAMES.filter(function (x) { return x !== n1; }));
      if (L === 1) return K.int(n1 + ' and ' + n2 + ' share £' + (a + b) * k + ' in the ratio ' + a + ' : ' + b + '. How much does ' + n2 + ' get?', b * k, { prefix: '£', hint: 'Add the parts: ' + a + ' + ' + b + ' = ' + (a + b) + '.', params: { a: a, b: b, tot: (a + b) * k, want: 'b' }, sol: ['One part: £' + (a + b) * k + ' ÷ ' + (a + b) + ' = £' + k + '.', n2 + ': ' + b + ' × £' + k + ' = £' + b * k + '.'] });
      if (L === 2) return K.int('The ratio of boys to girls in a club is ' + a + ' : ' + b + '. There are ' + a * k + ' boys. How many girls are there?', b * k, { hint: 'Find what one part is worth from the boys.', params: { a: a, b: b, known: a * k }, sol: [a * k + ' ÷ ' + a + ' = ' + k + ' per part.', 'Girls: ' + b + ' × ' + k + ' = ' + b * k + '.'] });
      return K.int('Some money is shared in the ratio ' + a + ' : ' + b + '. ' + (b > a ? n2 : n1) + ' gets £' + Math.abs(b - a) * k + ' more than ' + (b > a ? n1 : n2) + '. How much money was shared altogether?', (a + b) * k, { prefix: '£', hint: 'The difference is ' + Math.abs(b - a) + ' parts.', params: { a: a, b: b, diff: Math.abs(b - a) * k }, sol: ['Difference: ' + Math.abs(b - a) + ' parts = £' + Math.abs(b - a) * k + ', so one part = £' + k + '.', 'Total: ' + (a + b) + ' parts = £' + (a + b) * k + '.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; if (p.tot) return v * (p.a + p.b) === p.tot * p.b; if (p.known) return v * p.a === p.known * p.b; return v * Math.abs(p.b - p.a) === p.diff * (p.a + p.b); } });

  K.gen({ id: 'y7FracOf', objective: 'Y7-R-03', title: 'One quantity as a fraction of another',
    make: function (r, L) {
      if (L === 1) { var t = r.pick([20, 24, 30, 36, 40, 60]), p = r.int(1, t - 1), s = simp(p, t); return K.frac('What fraction of ' + t + ' is ' + p + '? Give your answer in its simplest form.', s[0], s[1], { form: 'simplest', hint: 'Write ' + p + ' over ' + t + ', then simplify.', params: { a: p, b: t }, sol: [F(p, t) + ' = ' + F(s[0], s[1]) + '.'] }); }
      if (L === 2) { var mins = r.pick([15, 20, 40, 45, 50, 75, 90]), hrs = r.pick([2, 3]), s2 = simp(mins, hrs * 60); return K.frac('Write <b>' + mins + ' minutes</b> as a fraction of <b>' + hrs + ' hours</b>. Simplify your answer.', s2[0], s2[1], { form: 'simplest', hint: 'Use the same units: ' + hrs + ' hours = ' + hrs * 60 + ' minutes.', params: { a: mins, b: hrs * 60 }, sol: [hrs + ' hours = ' + hrs * 60 + ' minutes.', F(mins, hrs * 60) + ' = ' + F(s2[0], s2[1]) + '.'] }); }
      var b = r.pick([8, 12, 16, 20]), a = b + r.pick([2, 4, 6, 10]), s3 = simp(a, b);
      return K.frac('Express ' + a + ' kg as a fraction of ' + b + ' kg. (The answer is more than 1.)', s3[0], s3[1], { mixed: true, hint: 'Write ' + a + ' over ' + b + ' and simplify. A fraction can be bigger than 1.', params: { a: a, b: b }, sol: [F(a, b) + ' = ' + F(s3[0], s3[1]) + (s3[0] > s3[1] ? ' = ' + F(s3[0] % s3[1], s3[1], Math.floor(s3[0] / s3[1])) : '') + '.'] });
    },
    verify: function (q) { var p = q.params; return q.check.n * p.b === p.a * q.check.d; } });

  var UNITS7 = [['km', 'm', 1000], ['m', 'cm', 100], ['kg', 'g', 1000], ['litres', 'ml', 1000], ['hours', 'minutes', 60], ['minutes', 'seconds', 60]];
  K.gen({ id: 'y7Units', objective: 'Y7-R-04', title: 'Converting units',
    make: function (r, L) {
      if (L < 3) { var u = r.pick(L === 1 ? UNITS7.slice(0, 4) : UNITS7.slice(2)), down = L === 1 || r.chance(0.5);
        var big = u[2] === 60 ? dtext(Q(r.int(2, 19) * 4 + 1, 4)) : dtext(Q(r.int(101, 9999), 100)), small = A.mul(Qs(big), Q(u[2]));
        if (!down) { var sm = u[2] === 60 ? r.int(2, 11) * 15 : r.int(101, 9999); small = Q(sm); big = dtext(A.div(Q(sm), Q(u[2]))); if (big === null) { small = Q(150); big = '2.5'; } }
        return K.dec(down ? 'Change <b>' + big + ' ' + u[0] + '</b> into ' + u[1] + '.' : 'Change <b>' + fmt(Number(small.n)) + ' ' + u[1] + '</b> into ' + u[0] + '.', down ? dtext(small) : big, { suffix: down ? u[1] : u[0], hint: '1 ' + u[0].replace(/s$/, '') + ' = ' + u[2] + ' ' + u[1] + '. ' + (down ? 'Multiply.' : 'Divide.'), params: { big: big, small: dtext(small), f: u[2], down: down },
          sol: [down ? big + ' × ' + u[2] + ' = ' + dtext(small) + ' ' + u[1] + '.' : fmt(Number(small.n)) + ' ÷ ' + u[2] + ' = ' + big + ' ' + u[0] + '.'] }); }
      var m2 = r.int(2, 9), toCm = r.chance(0.5);
      return K.int(toCm ? 'Change <b>' + m2 + ' m²</b> into cm².' : 'Change <b>' + m2 + ' cm²</b> into mm².', toCm ? m2 * 10000 : m2 * 100, { suffix: toCm ? 'cm²' : 'mm²', hint: toCm ? '1 m² is a square 100 cm by 100 cm, so it is 10,000 cm² (not 100).' : '1 cm² is 10 mm by 10 mm, so it is 100 mm².', params: { a: m2, f: toCm ? 100 : 10 }, sol: ['1 ' + (toCm ? 'm² = 100 × 100 = 10,000 cm²' : 'cm² = 10 × 10 = 100 mm²') + '.', m2 + ' × ' + (toCm ? '10,000' : '100') + ' = ' + fmt(toCm ? m2 * 10000 : m2 * 100) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.a) return q.check.value === p.a * p.f * p.f; return A.eq(A.mul(Qs(p.big), Q(p.f)), Qs(p.small)) && A.eq(Qs(q.check.value), Qs(p.down ? p.small : p.big)); } });

  K.gen({ id: 'y7Measures', objective: 'Y7-N-15', title: 'Problems with money, time and measures',
    make: function (r, L) {
      if (L === 1) { var each = r.int(105, 495), n = r.int(3, 9); return K.money('Pens cost ' + OM.pounds(each) + ' each. How much do ' + n + ' pens cost?', each * n, '£', { hint: 'Multiply the price by ' + n + '. Write money with two decimal places.', params: { each: each, n: n }, sol: [OM.pounds(each) + ' × ' + n + ' = ' + OM.pounds(each * n) + '.'] }); }
      if (L === 2) { var st = r.int(9, 20) * 60 + r.pick([5, 15, 30, 45, 50]), len = r.int(1, 2) * 60 + r.pick([25, 40, 55]); return K.time('A film starts at ' + OM.time24(st) + ' and lasts ' + Math.floor(len / 60) + ' h ' + len % 60 + ' min. When does it finish? Use the 24-hour clock.', (st + len) % 1440, '24', { hint: 'Add the hours, then the minutes. 60 minutes make an hour.', params: { st: st, len: len }, sol: [OM.time24(st) + ' + ' + Math.floor(len / 60) + ' h = ' + OM.time24(st + Math.floor(len / 60) * 60) + '.', 'Add ' + len % 60 + ' min: ' + OM.time24((st + len) % 1440) + '.'] }); }
      var litres = dtext(Q(r.int(205, 595), 10)), price = dtext(Q(r.int(139, 189), 100)), exact = A.mul(Qs(litres), Qs(price));
      return K.approx('Fuel costs £' + price + ' per litre. How much do ' + litres + ' litres cost? Give your answer to the nearest penny.', A.qText(exact), { dp: 2 }, { calc: true, prefix: '£', hint: 'Multiply, then round to 2 decimal places.', params: { l: litres, p: price }, sol: [litres + ' × ' + price + ' = ' + dtext(exact) + '.', 'To the nearest penny: £' + A.round(A.qText(exact), { dp: 2 }) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.each) return q.check.pence === p.each * p.n; if (p.st !== undefined) return q.check.mins === (p.st + p.len) % 1440; var th = Math.round(parseFloat(p.l) * 10) * Math.round(parseFloat(p.p) * 100); return Math.round(parseFloat(A.round(q.check.value, { dp: 2 })) * 100) === Math.floor((th + 5) / 10); } });

  // ================= GEOMETRY (Brass Bridge) =================
  K.gen({ id: 'y7Area', objective: 'Y7-G-01', title: 'Area of triangles, parallelograms and trapezia',
    make: function (r, L) {
      if (L === 1) { var b = r.int(4, 16), h = r.int(3, 12); return K.dec('Find the area of the triangle.', dtext(Q(b * h, 2)), { suffix: 'cm²', visual: V.baseHeight('triangle', b, h, 'cm'), hint: 'Area of a triangle = ½ × base × perpendicular height.', params: { kind: 'tri', b: b, h: h }, sol: ['½ × ' + b + ' × ' + h + ' = ' + dtext(Q(b * h, 2)) + ' cm².'] }); }
      if (L === 2) { var para = r.chance(0.4), a = r.int(3, 12), c = r.int(a + 1, a + 9), h2 = r.int(3, 10);
        if (para) return K.int('Find the area of the parallelogram.', c * h2, { suffix: 'cm²', visual: V.baseHeight('parallelogram', c, h2, 'cm'), hint: 'Area = base × perpendicular height.', params: { kind: 'para', b: c, h: h2 }, sol: [c + ' × ' + h2 + ' = ' + c * h2 + ' cm².'] });
        return K.dec('A trapezium has parallel sides of ' + a + ' cm and ' + c + ' cm, and a perpendicular height of ' + h2 + ' cm. Find its area.', dtext(Q((a + c) * h2, 2)), { suffix: 'cm²', hint: 'Area of a trapezium = ½(a + b)h.', params: { kind: 'trap', a: a, b: c, h: h2 }, sol: ['½ × (' + a + ' + ' + c + ') × ' + h2 + ' = ½ × ' + (a + c) + ' × ' + h2 + ' = ' + dtext(Q((a + c) * h2, 2)) + ' cm².'] }); }
      var a3 = r.int(4, 10), b3 = r.int(a3 + 2, a3 + 10), h3 = r.int(2, 9) * 2, area = (a3 + b3) * h3 / 2;
      return K.int('A trapezium has an area of ' + area + ' cm². Its parallel sides are ' + a3 + ' cm and ' + b3 + ' cm. Find its perpendicular height.', h3, { suffix: 'cm', hint: 'Area = ½(a + b)h. Put in what you know, then solve for h.', params: { kind: 'trapH', a: a3, b: b3, area: area }, sol: ['½ × (' + a3 + ' + ' + b3 + ') × h = ' + area + '.', (a3 + b3) / 2 + ' × h = ' + area + ', so h = ' + h3 + ' cm.'] });
    },
    verify: function (q) {
      var p = q.params, v = q.check.value !== undefined ? parseFloat(q.check.value) : NaN;
      if (p.kind === 'tri') return Math.abs(v * 2 - p.b * p.h) < 1e-9;
      if (p.kind === 'para') return v === p.b * p.h;
      if (p.kind === 'trap') { var tri = p.h * (p.b - p.a) / 2, rect = p.a * p.h; return Math.abs(v - (tri + rect)) < 1e-9; }
      return Math.abs(v * (p.a + p.b) / 2 - p.area) < 1e-9;
    } });

  function crossLines(a, label2) { var R = 95, rad = a * Math.PI / 180, cx = 130, cy = 105; return V.svg(260, 210, V.line(cx - R, cy, cx + R, cy, { w: 4 }) + V.line((cx - R * Math.cos(rad)).toFixed(1), (cy + R * Math.sin(rad)).toFixed(1), (cx + R * Math.cos(rad)).toFixed(1), (cy - R * Math.sin(rad)).toFixed(1), { w: 4 }) + V.t(cx + 40 * Math.cos(rad / 2), cy - 40 * Math.sin(rad / 2), a + '°', { size: 14, weight: 'bold' }) + (label2 ? V.t(cx - 40 * Math.cos(rad / 2), cy + 40 * Math.sin(rad / 2), label2, { size: 14, weight: 'bold', fill: V.colors.berry }) : '')); }
  K.gen({ id: 'y7Angles', objective: 'Y7-G-02', title: 'Angles at a point, on a line, vertically opposite',
    make: function (r, L) {
      if (L === 1) { var a = r.int(25, 85), b = r.int(25, 155 - a); return K.int('Three angles lie on a straight line. Two of them are ' + a + '° and ' + b + '°. Find the third.', 180 - a - b, { suffix: '°', hint: 'Angles on a straight line add up to 180°.', params: { known: [a, b], total: 180 }, sol: ['180 − ' + a + ' − ' + b + ' = ' + (180 - a - b) + '°.'] }); }
      if (L === 2) { var x = r.int(50, 130), y = r.int(40, 110), z = r.int(40, Math.min(150, 330 - x - y)); return K.int('Four angles meet at a point: ' + x + '°, ' + y + '°, ' + z + '° and <i>a</i>. Find <i>a</i>.', 360 - x - y - z, { suffix: '°', hint: 'Angles at a point add up to 360°.', params: { known: [x, y, z], total: 360 }, sol: ['360 − ' + x + ' − ' + y + ' − ' + z + ' = ' + (360 - x - y - z) + '°.'] }); }
      var k = r.int(2, 5), c = r.int(1, 20), xv = r.int(8, 30), ang = k * xv + c; if (ang >= 170) { xv = 10; ang = k * 10 + c; }
      return K.solve('Two straight lines cross. One angle is ' + ang + '°. The angle vertically opposite it is <b>(' + k + 'x + ' + c + ')°</b>. Find x.', String(xv), { visual: crossLines(ang, '(' + k + 'x + ' + c + ')°'), hint: 'Vertically opposite angles are equal: ' + k + 'x + ' + c + ' = ' + ang + '.', params: { k: k, c: c, ang: ang }, sol: [k + 'x + ' + c + ' = ' + ang + '.', k + 'x = ' + (ang - c) + ', so x = ' + xv + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k) return p.k * parseFloat(q.check.value) + p.c === p.ang; return p.known.reduce(function (s, x) { return s + x; }, q.check.value) === p.total; } });

  var POLY7 = { 5: 'pentagon', 6: 'hexagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };
  K.gen({ id: 'y7AngleSum', objective: 'Y7-G-03', title: 'Angle sums in triangles and polygons',
    make: function (r, L) {
      if (L === 1) { var apex = r.int(20, 140); if (apex % 2) apex++; return K.int('An isosceles triangle has a top angle of ' + apex + '°. The other two angles are equal. Find one of them.', (180 - apex) / 2, { suffix: '°', hint: 'Angles in a triangle add to 180°. Share what is left equally.', params: { apex: apex, k: 'iso' }, sol: ['180 − ' + apex + ' = ' + (180 - apex) + '°.', (180 - apex) + ' ÷ 2 = ' + (180 - apex) / 2 + '°.'] }); }
      var n = +r.pick(Object.keys(POLY7));
      if (L === 2) return K.int('What is the sum of the interior angles of a <b>' + POLY7[n] + '</b>?', (n - 2) * 180, { suffix: '°', hint: 'Split it into triangles from one corner. A ' + n + '-sided shape makes ' + (n - 2) + ' triangles.', params: { n: n, k: 'sum' }, sol: [(n - 2) + ' triangles × 180° = ' + (n - 2) * 180 + '°.'] });
      var ext = r.pick([20, 24, 30, 36, 40, 45, 60, 72]);
      return K.int('Each exterior angle of a regular polygon is ' + ext + '°. How many sides does it have?', 360 / ext, { hint: 'The exterior angles of any polygon add up to 360°.', params: { ext: ext, k: 'ext' }, sol: ['360 ÷ ' + ext + ' = ' + 360 / ext + ' sides.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; if (p.k === 'iso') return p.apex + 2 * v === 180; if (p.k === 'sum') { var tri = 0; for (var i = 2; i < p.n; i++) tri += 180; return tri === v; } return v * p.ext === 360; } });

  K.gen({ id: 'y7Measure', objective: 'Y7-G-04', title: 'Measuring angles and scale drawings',
    make: function (r, L) {
      if (L === 1) { var deg = r.int(3, 33) * 5; return K.int('Read the protractor. What is the size of the angle?', deg, { suffix: '°', visual: V.protractor(deg), hint: 'Start from the 0 on the arm along the base line. Is the angle acute or obtuse?', params: { deg: deg }, sol: ['The angle is ' + (deg < 90 ? 'acute' : deg === 90 ? 'a right angle' : 'obtuse') + '. It measures ' + deg + '°.'] }); }
      if (L === 2) { var sc = r.pick([10000, 20000, 25000, 50000]), cm = r.int(2, 12), real = A.div(Q(sc * cm), Q(100000)); return K.dec('A map has a scale of <b>1 : ' + fmt(sc) + '</b>. Two towns are ' + cm + ' cm apart on the map. How far apart are they in real life, in km?', dtext(real), { suffix: 'km', hint: '1 cm on the map is ' + fmt(sc) + ' cm in real life. 1 km = 100,000 cm.', params: { sc: sc, cm: cm }, sol: [cm + ' × ' + fmt(sc) + ' = ' + fmt(sc * cm) + ' cm.', fmt(sc * cm) + ' cm ÷ 100,000 = ' + dtext(real) + ' km.'] }); }
      var per = r.pick([2, 4, 5]), len = r.int(7, 39); return K.dec('On a plan, 1 cm represents ' + per + ' m. A wall is ' + len + ' m long. How long is it on the plan?', dtext(Q(len, per)), { suffix: 'cm', hint: 'Divide the real length by ' + per + '.', params: { per: per, len: len }, sol: [len + ' ÷ ' + per + ' = ' + dtext(Q(len, per)) + ' cm.'] });
    },
    verify: function (q) { var p = q.params; if (p.deg) return q.check.value === p.deg; if (p.sc) return Math.abs(parseFloat(q.check.value) * 100000 - p.sc * p.cm) < 1e-6; return Math.abs(parseFloat(q.check.value) * p.per - p.len) < 1e-9; } });

  var SYM = [['square', 4, 4], ['rectangle', 2, 2], ['isosceles triangle', 1, 1], ['equilateral triangle', 3, 3], ['parallelogram', 0, 2], ['rhombus', 2, 2], ['kite', 1, 1], ['regular pentagon', 5, 5], ['regular hexagon', 6, 6], ['regular octagon', 8, 8]];
  K.gen({ id: 'y7Symmetry', objective: 'Y7-G-05', title: 'Symmetry, parallel and perpendicular lines',
    make: function (r, L) {
      var s = r.pick(SYM);
      if (L === 1) return K.int('How many <b>lines of symmetry</b> does a <b>' + s[0] + '</b> have?', s[1], { hint: 'Imagine folding it so both halves match exactly.', params: { s: s[0], i: 1 }, sol: ['A ' + s[0] + ' has ' + s[1] + ' line' + (s[1] === 1 ? '' : 's') + ' of symmetry.'] });
      if (L === 2) return K.int('What is the <b>order of rotational symmetry</b> of a <b>' + s[0] + '</b>?', s[2], { hint: 'How many times does it look the same in one full turn?', params: { s: s[0], i: 2 }, sol: ['A ' + s[0] + ' looks the same ' + s[2] + ' time' + (s[2] === 1 ? '' : 's') + ' in a full turn, so its order is ' + s[2] + '.'] });
      var qn = r.pick([['has exactly one pair of parallel sides', 'trapezium'], ['has two pairs of parallel sides but no right angles and all sides equal', 'rhombus'], ['has diagonals that cross at right angles and exactly one line of symmetry', 'kite'], ['has four right angles and sides that are not all equal', 'rectangle']]);
      return K.choice('Which quadrilateral ' + qn[0] + '?', r.shuffle(['trapezium', 'rhombus', 'kite', 'rectangle']), qn[1], { hint: 'Think about parallel sides, equal sides, right angles and symmetry.', params: { qn: qn }, sol: ['A ' + qn[1] + ' ' + qn[0] + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.qn) return q.check.value === { 'has exactly one pair of parallel sides': 'trapezium', 'has two pairs of parallel sides but no right angles and all sides equal': 'rhombus', 'has diagonals that cross at right angles and exactly one line of symmetry': 'kite', 'has four right angles and sides that are not all equal': 'rectangle' }[p.qn[0]];
      var m = /regular (\w+)/.exec(p.s); if (m) return q.check.value === { pentagon: 5, hexagon: 6, octagon: 8 }[m[1]];
      var known = { square: [4, 4], rectangle: [2, 2], 'isosceles triangle': [1, 1], 'equilateral triangle': [3, 3], parallelogram: [0, 2], rhombus: [2, 2], kite: [1, 1] }[p.s];
      return q.check.value === known[p.i - 1];
    } });

  // ================= STATISTICS AND PROBABILITY (Signal Tower) =================
  K.gen({ id: 'y7Averages', objective: 'Y7-S-01', title: 'Mean, median, mode and range',
    make: function (r, L) {
      var n = r.int(6, 9), xs = []; for (var i = 0; i < n; i++) xs.push(r.int(2, 30)); if (L === 1) xs.push(xs[0]);
      var sorted = xs.slice().sort(function (a, b) { return a - b; });
      if (L === 1) { var what = r.pick(['range', 'median']); if (what === 'median' && sorted.length % 2 === 0) sorted.pop(), xs = r.shuffle(sorted.slice());
        var s2 = xs.slice().sort(function (a, b) { return a - b; }), ans = what === 'range' ? s2[s2.length - 1] - s2[0] : s2[(s2.length - 1) / 2];
        return K.int('Find the <b>' + what + '</b> of: &nbsp;' + xs.join(', '), ans, { hint: what === 'range' ? 'Range = largest − smallest.' : 'Put them in order and find the middle one.', params: { xs: xs, what: what }, sol: ['In order: ' + s2.join(', ') + '.', what === 'range' ? s2[s2.length - 1] + ' − ' + s2[0] + ' = ' + ans + '.' : 'The middle value is ' + ans + '.'] }); }
      if (L === 2) { var tot = K.sum(xs), mean = A.div(Q(tot), Q(xs.length)); return K.approx('Find the <b>mean</b> of: &nbsp;' + xs.join(', ') + '. Give your answer to 1 decimal place if it is not exact.', A.qText(mean), { dp: 1 }, { calc: true, hint: 'Add them all up, then divide by how many there are.', params: { xs: xs, what: 'mean' }, sol: ['Total: ' + tot + '. There are ' + xs.length + ' values.', tot + ' ÷ ' + xs.length + ' = ' + A.round(A.qText(mean), { dp: 1 }) + '.'] }); }
      var a = { mean: r.int(12, 20), range: r.int(3, 6) }, b = { mean: a.mean + r.pick([-1, 0, 1]), range: a.range + r.int(5, 12) };
      return K.choice('Team A scores have mean ' + a.mean + ' and range ' + a.range + '. Team B scores have mean ' + b.mean + ' and range ' + b.range + '. Which team is <b>more consistent</b>?', [{ value: 'A', label: 'Team A' }, { value: 'B', label: 'Team B' }], 'A', { hint: 'Consistency is about spread. A smaller range means more consistent.', params: { ra: a.range, rb: b.range, what: 'compare' }, sol: ['Team A has the smaller range (' + a.range + ' compared with ' + b.range + '), so its scores are more consistent.'] });
    },
    verify: function (q) {
      var p = q.params, s = p.xs ? p.xs.slice().sort(function (a, b) { return a - b; }) : null;
      if (p.what === 'range') return q.check.value === s[s.length - 1] - s[0];
      if (p.what === 'median') return s.filter(function (x) { return x < q.check.value; }).length <= (s.length - 1) / 2 && s.filter(function (x) { return x > q.check.value; }).length <= (s.length - 1) / 2;
      if (p.what === 'mean') return Math.abs(parseFloat(A.round(q.check.value, { dp: 1 })) - Math.round(p.xs.reduce(function (t, x) { return t + x; }, 0) / p.xs.length * 10) / 10) < 1e-9;
      return q.check.value === (p.ra < p.rb ? 'A' : 'B');
    } });

  K.gen({ id: 'y7Charts', objective: 'Y7-S-02', title: 'Tables, bar charts and pie charts',
    make: function (r, L) {
      var cats = r.pick([['Bus', 'Car', 'Walk', 'Cycle'], ['Rock', 'Pop', 'Rap', 'Jazz'], ['Maths', 'Art', 'PE', 'Music']]);
      if (L === 1) { var vals = cats.map(function () { return r.int(2, 18); }), i = r.int(0, 3), j = (i + r.int(1, 3)) % 4;
        if (vals[i] === vals[j]) vals[i] = vals[j] < 18 ? vals[j] + 2 : vals[j] - 2;
        if (vals[i] < vals[j]) { var sw = i; i = j; j = sw; }
        return K.int('The bar chart shows how students travel to school. How many more chose <b>' + cats[i] + '</b> than <b>' + cats[j] + '</b>?', vals[i] - vals[j], { keys: 'signed', visual: V.barChart({ cats: cats, values: vals, step: 2, max: 20, labelEvery: 1, ylabel: 'Students' }), hint: 'Read both bars, then subtract.', params: { vals: vals, i: i, j: j }, sol: [cats[i] + ': ' + vals[i] + '. ' + cats[j] + ': ' + vals[j] + '.', vals[i] + ' − ' + vals[j] + ' = ' + (vals[i] - vals[j]) + '.'] }); }
      if (L === 2) { var total = r.pick([36, 60, 72, 90, 120]), angles = r.pick([[90, 120, 60, 90], [180, 90, 45, 45], [120, 120, 60, 60], [150, 90, 60, 60]]), k = r.int(0, 3), f = angles[k] * total / 360;
        if (f % 1) { total = 72; f = angles[k] / 5; }
        return K.int(total + ' people were asked. In the pie chart, the <b>' + cats[k] + '</b> slice has an angle of ' + angles[k] + '°. How many people chose ' + cats[k] + '?', angles[k] * total / 360, { visual: V.pieChart(cats, angles, { title: total + ' people' }), hint: 'Each person is worth 360 ÷ ' + total + ' = ' + 360 / total + '°.', params: { total: total, ang: angles[k] }, sol: [angles[k] + '° out of 360° is ' + F(angles[k] / OM.gcd(angles[k], 360), 360 / OM.gcd(angles[k], 360)) + ' of the people.', F(angles[k] / OM.gcd(angles[k], 360), 360 / OM.gcd(angles[k], 360)) + ' of ' + total + ' = ' + angles[k] * total / 360 + '.'] }); }
      var scores = [0, 1, 2, 3, 4], freq = scores.map(function () { return r.int(1, 9); }), N = K.sum(freq), tot = K.sum(scores.map(function (s, i) { return s * freq[i]; })), mean = A.div(Q(tot), Q(N));
      return K.approx('The table shows the number of goals scored in some matches. Work out the <b>mean</b> number of goals. Give your answer to 2 decimal places.', A.qText(mean), { dp: 2 }, { calc: true, visual: V.table(['Goals', 'Frequency'], scores.map(function (s, i) { return [String(s), String(freq[i])]; })), hint: 'Multiply each number of goals by its frequency, add these up, then divide by the total frequency.', params: { freq: freq },
        sol: ['Total goals: ' + scores.map(function (s, i) { return s + '×' + freq[i]; }).join(' + ') + ' = ' + tot + '.', 'Matches: ' + N + '.', tot + ' ÷ ' + N + ' = ' + A.round(A.qText(mean), { dp: 2 }) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.vals) return q.check.value === p.vals[p.i] - p.vals[p.j]; if (p.total) return q.check.value * 360 === p.ang * p.total; var t = 0, n = 0; p.freq.forEach(function (f, i) { for (var k = 0; k < f; k++) { t += i; n++; } }); return Math.abs(parseFloat(A.round(q.check.value, { dp: 2 })) - Math.round(t / n * 100) / 100) < 1e-9; } });

  K.gen({ id: 'y7ProbScale', objective: 'Y7-P-01', title: 'The probability scale and relative frequency',
    make: function (r, L) {
      if (L === 1) { var ev = r.pick([['rolling a 7 on an ordinary dice', 'impossible'], ['getting heads when you flip a fair coin', 'even chance'], ['the sun rising tomorrow', 'certain'], ['rolling a number less than 6 on a dice', 'likely'], ['picking a red card from a pack where 1 card in 10 is red', 'unlikely']]);
        return K.choice('Which word best describes the probability of <b>' + ev[0] + '</b>?', ['impossible', 'unlikely', 'even chance', 'likely', 'certain'], ev[1], { hint: 'Think of the probability scale from 0 (impossible) to 1 (certain).', params: { ev: ev }, sol: ['The probability of ' + ev[0] + ' is ' + ev[1] + '.'] }); }
      if (L === 2) { var n = r.pick([20, 25, 40, 50, 80, 100]), h = r.int(Math.floor(n * .3), Math.ceil(n * .7)); return K.dec('A drawing pin is dropped ' + n + ' times. It lands point up ' + h + ' times. What is the <b>relative frequency</b> of landing point up? Give it as a decimal.', dtext(Q(h, n)), { hint: 'Relative frequency = number of times it happened ÷ number of trials.', params: { h: h, n: n }, sol: [h + ' ÷ ' + n + ' = ' + dtext(Q(h, n)) + '.'] }); }
      var p = r.pick(['0.1', '0.15', '0.2', '0.25', '0.3', '0.35', '0.4']), trials = r.pick([60, 80, 120, 200, 300, 400]), ex = A.mul(Qs(p), Q(trials));
      if (ex.d !== 1n) { trials = 200; ex = A.mul(Qs(p), Q(200)); }
      return K.int('The probability that a spinner lands on red is ' + p + '. It is spun ' + trials + ' times. How many times would you <b>expect</b> it to land on red?', Number(ex.n), { hint: 'Expected number = probability × number of trials.', params: { p: p, t: trials }, sol: [p + ' × ' + trials + ' = ' + Number(ex.n) + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.ev) { var t = p.ev[0], want = /7 on an ordinary/.test(t) ? 'impossible' : /coin/.test(t) ? 'even chance' : /sun/.test(t) ? 'certain' : /less than 6/.test(t) ? 'likely' : 'unlikely'; return q.check.value === want; }
      if (p.h !== undefined) return Math.abs(parseFloat(q.check.value) * p.n - p.h) < 1e-9;
      return Math.abs(q.check.value - parseFloat(p.p) * p.t) < 1e-9;
    } });

  K.gen({ id: 'y7ProbSum', objective: 'Y7-P-02', title: 'Probabilities add up to 1',
    make: function (r, L) {
      if (L === 1) { var p = dtext(Q(r.int(5, 95), 100)); return K.dec('The probability that it rains tomorrow is ' + p + '. What is the probability that it does <b>not</b> rain?', dtext(A.sub(Q(1), Qs(p))), { hint: 'The probabilities of rain and no rain add up to 1.', params: { known: [p] }, sol: ['1 − ' + p + ' = ' + dtext(A.sub(Q(1), Qs(p))) + '.'] }); }
      var cols = ['Red', 'Blue', 'Green', 'Yellow'], ps = [r.int(1, 4), r.int(1, 4), r.int(1, 3)].map(function (x) { return x * 5; }), last = 100 - K.sum(ps);
      if (L === 2) { var k = r.int(0, 3), all = ps.concat([last]), shown = all.map(function (x, i) { return i === k ? '?' : dtext(Q(x, 100)); });
        return K.dec('A spinner has four colours. Find the missing probability.', dtext(Q(all[k], 100)), { visual: V.table(['Colour'].concat(cols), [['Probability'].concat(shown)]), hint: 'All the probabilities add up to 1.', params: { known: all.filter(function (x, i) { return i !== k; }).map(function (x) { return dtext(Q(x, 100)); }) }, sol: ['The others add up to ' + dtext(Q(100 - all[k], 100)) + '.', '1 − ' + dtext(Q(100 - all[k], 100)) + ' = ' + dtext(Q(all[k], 100)) + '.'] }); }
      var a = r.int(1, 4) * 5, b = r.int(1, 3) * 5, rest = 100 - a - b; if (rest % 3) { a += rest % 3 === 1 ? 5 : 10; rest = 100 - a - b; } if (rest % 3) { a = 10; b = 15; rest = 75; }
      var x = rest / 3;
      return K.dec('The probabilities of four outcomes are ' + dtext(Q(a, 100)) + ', ' + dtext(Q(b, 100)) + ', <i>x</i> and <i>2x</i>. Find <i>x</i>.', dtext(Q(x, 100)), { hint: dtext(Q(a, 100)) + ' + ' + dtext(Q(b, 100)) + ' + x + 2x = 1, so 3x = ' + dtext(Q(rest, 100)) + '.', params: { known: [dtext(Q(a, 100)), dtext(Q(b, 100))], xs: true }, sol: ['3x = 1 − ' + dtext(Q(a + b, 100)) + ' = ' + dtext(Q(rest, 100)) + '.', 'x = ' + dtext(Q(x, 100)) + '.'] });
    },
    verify: function (q) { var p = q.params, s = p.known.reduce(function (t, k) { return A.add(t, Qs(k)); }, A.Q(0)), v = Qs(q.check.value); return A.eq(A.add(s, p.xs ? A.mul(v, A.Q(3)) : v), A.Q(1)); } });

  K.gen({ id: 'y7ProbCalc', objective: 'Y7-P-03', title: 'Theoretical probability and sample spaces',
    make: function (r, L) {
      if (L === 1) { var c = [r.int(1, 6), r.int(1, 6), r.int(1, 6)], names = ['red', 'blue', 'green'], k = r.int(0, 2), t = K.sum(c), s = simp(c[k], t);
        return K.frac('A bag holds ' + c[0] + ' red, ' + c[1] + ' blue and ' + c[2] + ' green counters. One is taken at random. What is the probability it is <b>' + names[k] + '</b>?', s[0], s[1], { hint: 'Probability = number of ' + names[k] + ' counters ÷ total number of counters.', params: { c: c, k: k }, sol: ['There are ' + t + ' counters and ' + c[k] + ' are ' + names[k] + '.', 'P(' + names[k] + ') = ' + F(c[k], t) + (s[1] !== t ? ' = ' + F(s[0], s[1]) : '') + '.'] }); }
      if (L === 2) { var ev = r.pick([['a prime number', [2, 3, 5]], ['a multiple of 3', [3, 6]], ['a number greater than 4', [5, 6]], ['an even number', [2, 4, 6]], ['a factor of 6', [1, 2, 3, 6]]]), s2 = simp(ev[1].length, 6);
        return K.frac('A fair six-sided dice is rolled. What is the probability of rolling <b>' + ev[0] + '</b>?', s2[0], s2[1], { hint: 'List the numbers 1 to 6 that are ' + ev[0] + '.', params: { ev: ev[0], set: ev[1] }, sol: ['The outcomes that work are ' + ev[1].join(', ') + '.', 'P = ' + F(ev[1].length, 6) + (s2[1] !== 6 ? ' = ' + F(s2[0], s2[1]) : '') + '.'] }); }
      var target = r.int(3, 11), ways = 6 - Math.abs(target - 7), s3 = simp(ways, 36);
      return K.frac('Two fair dice are rolled and the scores are <b>added</b>. What is the probability that the total is <b>' + target + '</b>?', s3[0], s3[1], { hint: 'Draw a 6 by 6 sample space grid of all 36 totals. Count the ' + target + 's.', params: { target: target }, sol: ['There are 36 equally likely outcomes.', ways + ' of them total ' + target + '.', 'P = ' + F(ways, 36) + (s3[1] !== 36 ? ' = ' + F(s3[0], s3[1]) : '') + '.'] });
    },
    verify: function (q) {
      var p = q.params, v = q.check.n / q.check.d;
      if (p.c) return Math.abs(v - p.c[p.k] / (p.c[0] + p.c[1] + p.c[2])) < 1e-12;
      if (p.set) { var test = { 'a prime number': function (n) { return [2, 3, 5].indexOf(n) >= 0; }, 'a multiple of 3': function (n) { return n % 3 === 0; }, 'a number greater than 4': function (n) { return n > 4; }, 'an even number': function (n) { return n % 2 === 0; }, 'a factor of 6': function (n) { return 6 % n === 0; } }[p.ev]; var c = 0; for (var i = 1; i <= 6; i++) if (test(i)) c++; return Math.abs(v - c / 6) < 1e-12; }
      var w = 0; for (var a = 1; a <= 6; a++) for (var b = 1; b <= 6; b++) if (a + b === p.target) w++; return Math.abs(v - w / 36) < 1e-12;
    } });
})(typeof window !== 'undefined' ? window : globalThis);
