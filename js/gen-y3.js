/* Learn with Pip — Year 3 question generators. Numbers stay within Year 3 (up to 1,000; decimals only for money).
   Each generator's verify() works the answer out a different way from make(). Levels: 1 getting there, 2 expected, 3 greater depth. */
(function (G) {
  'use strict';
  var OM = G.OM, K = OM.kit, V = OM.V, S = K.S, fmt = OM.fmt, F = K.fr;
  function pick3(r, lo, hi) { return r.int(lo, hi); }
  function hund(n) { return Math.floor(n / 100); } function tens(n) { return Math.floor(n / 10) % 10; } function ones(n) { return n % 10; }
  function shuffleOpts(r, correct, wrongs) { return r.shuffle([correct].concat(wrongs)).map(function (x) { return { value: String(x), label: String(x) }; }); }

  // ================= NUMBER AND PLACE VALUE =================
  K.gen({ id: 'y3Count', objective: 'Y3-NPV-01', title: 'Counting in 4s, 8s, 50s and 100s',
    make: function (r, L) {
      var step = L === 1 ? r.pick([4, 100]) : L === 2 ? r.pick([8, 50]) : r.pick([4, 8, 50, 100]);
      var maxStart = Math.floor(1000 / step) - 6, k0 = L === 1 ? 0 : r.int(1, Math.max(1, Math.min(maxStart, 12))), down = L === 3 && r.chance(0.5);
      var terms = []; for (var i = 0; i < 6; i++) terms.push((k0 + i) * step);
      if (down) terms.reverse();
      var blanks = r.sample([1, 2, 3, 4, 5], 2).sort();
      var tpl = terms.map(function (t, i) { var b = blanks.indexOf(i); return b >= 0 ? '{' + b + '}' : fmt(t); }).join(', ');
      return K.multi('This sequence counts ' + (down ? 'back' : 'on') + ' in ' + step + 's. Write the missing numbers.', tpl, blanks.map(function (b) { return { kind: 'int', value: terms[b] }; }), {
        hint: 'Each number is ' + step + ' ' + (down ? 'less' : 'more') + ' than the one before.', params: { terms: terms, step: step, down: down, blanks: blanks },
        answer: blanks.map(function (b) { return fmt(terms[b]); }).join(' and '),
        sol: ['Count ' + (down ? 'back' : 'on') + ' in ' + step + 's: ' + terms.map(fmt).join(', ') + '.', 'Every number is a multiple of ' + step + ', so it is in the ' + step + ' times table count from 0.'] });
    },
    verify: function (q) { var p = q.params, t = p.terms; return t.every(function (x, i) { return x % p.step === 0 && x <= 1000 && (i === 0 || Math.abs(x - t[i - 1]) === p.step); }) && q.check.parts.every(function (c, i) { return c.value === t[p.blanks[i]]; }); } });

  K.gen({ id: 'y3TenHundred', objective: 'Y3-NPV-01', title: '10 or 100 more or less',
    make: function (r, L) {
      var by = r.pick([10, 100]), more = r.chance(0.5), n;
      do { n = r.int(L === 1 ? 110 : 100, L === 1 ? 880 : 990); } while (more ? n + by > 999 : n - by < 0 || (L === 1 && (more ? tens(n) === 9 : tens(n) === 0) && by === 10));
      if (L < 3) {
        var ans = more ? n + by : n - by;
        return K.int('What is ' + by + ' ' + (more ? 'more' : 'less') + ' than ' + n + '?', ans, { hint: 'Only the ' + (by === 10 ? 'tens' : 'hundreds') + ' digit changes' + (by === 10 ? ', unless it goes past 9 or below 0.' : '.'), params: { n: n, by: by, more: more, inv: false },
          visual: V.placeValueOf(n), sol: [S(n + ' has ' + hund(n) + ' hundreds, ' + tens(n) + ' tens and ' + ones(n) + ' ones.', V.placeValueOf(n)), S(n + (more ? ' + ' : ' − ') + by + ' = ' + ans + '.', V.placeValueOf(ans))] });
      }
      var target = more ? n + by : n - by;
      return K.int('I think of a number. ' + by + ' ' + (more ? 'more' : 'less') + ' than my number is ' + target + '. What is my number?', n, { hint: 'Work backwards: do the opposite.', params: { n: target, by: by, more: !more, inv: true, orig: n },
        sol: ['Do the inverse: ' + (more ? target + ' − ' + by : target + ' + ' + by) + ' = ' + n + '.', 'Check: ' + n + (more ? ' + ' : ' − ') + by + ' = ' + target + ' ✓'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; return p.more ? K.addCheck(p.n, p.by) === v : K.subCheck(p.n, p.by) === v; } });

  K.gen({ id: 'y3PlaceValue', objective: 'Y3-NPV-02', title: 'Hundreds, tens and ones',
    make: function (r, L) {
      var n = r.int(101, 999), d = K.digits(n);
      if (L === 1) {
        var pos = r.int(0, 2), val = d[pos] * [100, 10, 1][pos];
        if (d[pos] === 0) { pos = 0; val = d[0] * 100; }
        return K.int('What is the value of the digit <b>' + d[pos] + '</b> in <b>' + n + '</b>?', val, { hint: 'Is it in the hundreds, tens or ones column?', params: { n: n, pos: pos }, visual: V.placeValueOf(n),
          sol: [S('Put ' + n + ' in a place value chart.', V.placeValueOf(n)), 'The ' + d[pos] + ' is in the ' + ['hundreds', 'tens', 'ones'][pos] + ' column, so its value is ' + val + '.'] });
      }
      if (L === 2) {
        var miss = r.int(0, 2), parts = [d[0] * 100, d[1] * 10, d[2]];
        var tpl = n + ' = ' + parts.map(function (x, i) { return i === miss ? '{0}' : x; }).join(' + ');
        return K.multi('Complete the partition.', tpl, [{ kind: 'int', value: parts[miss] }], { hint: 'Split the number into hundreds, tens and ones.', params: { n: n, miss: miss, parts: parts },
          sol: [n + ' = ' + parts[0] + ' + ' + parts[1] + ' + ' + parts[2] + '.', 'The missing part is ' + parts[miss] + '.'] });
      }
      var h = r.int(1, 8), t = r.int(10, 19), o = r.int(0, 9), val3 = h * 100 + t * 10 + o;
      return K.int('What number has <b>' + h + ' hundreds</b>, <b>' + t + ' tens</b> and <b>' + o + ' ones</b>?', val3, { hint: t + ' tens is more than 10 tens. 10 tens = 1 hundred.', params: { h: h, t: t, o: o },
        sol: [t + ' tens = ' + t * 10 + ', which is 1 hundred and ' + (t - 10) + ' tens.', 'So the number has ' + (h + 1) + ' hundreds, ' + (t - 10) + ' tens and ' + o + ' ones: ' + val3 + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.pos !== undefined) return q.check.value === +(String(p.n)[p.pos] + '00'.slice(0, 2 - p.pos));
      if (p.parts) return K.sum(p.parts) === p.n && q.check.parts[0].value === p.parts[p.miss];
      return q.check.value === +String((p.h + Math.floor(p.t / 10)) * 100 + (p.t % 10) * 10 + p.o);
    } });

  K.gen({ id: 'y3Compare', objective: 'Y3-NPV-03', title: 'Comparing and ordering to 1,000',
    make: function (r, L) {
      if (L === 1) {
        var a = r.int(100, 999), b = r.chance(0.3) ? a : r.int(Math.max(100, a - 60), Math.min(999, a + 60));
        var sym = a < b ? '<' : a > b ? '>' : '=';
        return K.choice('Which sign makes this true? &nbsp;<b>' + a + ' ? ' + b + '</b>', [{ value: '<', label: '&lt;' }, { value: '>', label: '&gt;' }, { value: '=', label: '=' }], sym,
          { big: true, hint: 'Compare the hundreds first, then the tens, then the ones.', params: { a: a, b: b }, answer: a + ' ' + sym + ' ' + b, sol: ['Compare digit by digit from the hundreds.', a + ' ' + sym + ' ' + b + '.'] });
      }
      if (L === 2) {
        var nums = []; while (nums.length < 4) { var x = r.int(100, 999); if (nums.indexOf(x) < 0) nums.push(x); }
        if (r.chance(0.5)) { var base = r.int(1, 9) * 100; nums = r.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 4).map(function (k) { return base + k * 10 + r.int(0, 9); }); }
        var sorted = nums.slice().sort(function (p, q) { return p - q; });
        return K.order('Put these numbers in order, starting with the <b>smallest</b>. Tap them in order.', nums.map(function (v) { return { value: String(v), label: String(v) }; }), sorted.map(String),
          { hint: 'Look at the hundreds digits first.', params: { nums: nums }, answer: sorted.join(', '), sol: ['Compare hundreds, then tens, then ones.', 'Smallest to largest: ' + sorted.join(', ') + '.'] });
      }
      var hh = r.int(2, 8), tt = r.int(1, 8), oo = r.int(0, 9), other = hh * 100 + tt * 10 + oo;
      var opts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], ok = opts.filter(function (d) { return hh * 100 + d * 10 + 5 > other; });
      var correct = r.pick(ok.length ? ok : [9]), wrong = r.sample(opts.filter(function (d) { return ok.indexOf(d) < 0; }), Math.min(3, 10 - ok.length));
      return K.choice('Which digit could go in the box to make this true? &nbsp;<b>' + hh + '▢5 &gt; ' + other + '</b>', r.shuffle([correct].concat(wrong)).map(String), String(correct),
        { big: true, hint: 'The hundreds are the same, so compare the tens.', params: { hh: hh, other: other, d: correct }, sol: ['Both numbers have ' + hh + ' hundreds, so compare the tens.', 'With ' + correct + ': ' + (hh * 100 + correct * 10 + 5) + ' &gt; ' + other + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.nums) { var s = p.nums.map(function (n) { return String(n).padStart(3, '0'); }).sort(); return s.map(Number).join() === q.check.order.join(); }
      if (p.other) return String(p.hh * 100 + p.d * 10 + 5) > String(p.other);
      var A = String(p.a), B = String(p.b); return q.check.value === (A < B ? '<' : A > B ? '>' : '=');
    } });

  K.gen({ id: 'y3Represent', objective: 'Y3-NPV-04', title: 'Number lines and blocks to 1,000',
    make: function (r, L) {
      if (L === 1) {
        var n = r.int(110, 899);
        return K.int('What number do the base 10 blocks show?', n, { visual: V.base10(n), hint: 'Count the hundreds, then the tens, then the ones.', params: { n: n },
          sol: [hund(n) + ' hundreds, ' + tens(n) + ' tens and ' + ones(n) + ' ones.', hund(n) * 100 + ' + ' + tens(n) * 10 + ' + ' + ones(n) + ' = ' + n + '.'] });
      }
      var lo = L === 2 ? 0 : r.int(1, 8) * 100, hi = L === 2 ? 1000 : lo + 100, stp = L === 2 ? 100 : 10;
      var v = L === 2 ? r.int(1, 19) * 50 : lo + r.int(1, 9) * 10;
      if (v === lo || v === hi) v = lo + stp;
      var wrongs = [v + stp, v - stp, L === 2 ? v + 2 * stp : v + 5].filter(function (x) { return x > lo && x < hi && x !== v; }).slice(0, 3);
      while (wrongs.length < 3) wrongs.push(v + (wrongs.length + 3) * stp);
      return K.choice('What number is the arrow pointing to?', shuffleOpts(r, v, wrongs), String(v), { visual: V.numberLine({ min: lo, max: hi, step: stp, labelEvery: L === 2 ? 1 : 10, arrow: v }),
        hint: 'Work out how much each small step is worth.', params: { lo: lo, hi: hi, step: stp, v: v }, sol: ['The line goes from ' + lo + ' to ' + hi + ' in steps of ' + stp + '.', 'The arrow is at ' + v + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.lo === undefined) return q.check.value === hund(p.n) * 100 + tens(p.n) * 10 + ones(p.n); return +q.check.value === p.v && p.v > p.lo && p.v < p.hi; } });

  K.gen({ id: 'y3Words', objective: 'Y3-NPV-05', title: 'Numbers in numerals and words',
    make: function (r, L) {
      var n = r.pick([r.int(101, 999), r.int(1, 9) * 100 + r.int(1, 19), r.int(11, 99) * 10]);
      if (L === 1) {
        var w = [n + 10, n + 100 <= 999 ? n + 100 : n - 100, hund(n) * 100 + ones(n) * 10 + tens(n)].filter(function (x) { return x !== n && x > 0 && x < 1000; });
        var opts = r.shuffle([n].concat(w.slice(0, 3))).map(function (x) { return { value: String(x), label: K.toWords(x) }; });
        return K.choice('Which words say <b>' + n + '</b>?', opts, String(n), { hint: 'Say the hundreds, then the tens and ones.', params: { n: n, opts: opts.map(function (o) { return o.label; }) },
          answer: K.toWords(n), sol: [n + ' is ' + K.toWords(n) + '.'] });
      }
      if (L === 2) return K.int('Write this number in numerals: <b>' + K.toWords(n) + '</b>', n, { hint: 'Write the hundreds digit first. Use 0 for an empty column.', params: { n: n, words: K.toWords(n) },
        sol: [K.toWords(n) + ' = ' + n + '.', 'Check each column: ' + hund(n) + ' hundreds, ' + tens(n) + ' tens, ' + ones(n) + ' ones.'] });
      return K.words('Write <b>' + n + '</b> in words.', n, { hint: 'Hundreds first, then "and", then the tens and ones.', params: { n: n }, answer: K.toWords(n), sol: [n + ' in words is "' + K.toWords(n) + '".'] });
    },
    verify: function (q) { var p = q.params; if (K.fromWords(K.toWords(p.n)) !== p.n) return false; if (p.opts) return new Set(p.opts).size === p.opts.length; if (p.words) return K.fromWords(p.words) === q.check.value; return q.check.value === p.n; } });

  function perms(ds) { var out = []; (function go(a, rest) { if (!rest.length) return out.push(+a.join('')); rest.forEach(function (d, i) { go(a.concat([d]), rest.slice(0, i).concat(rest.slice(i + 1))); }); })([], ds); return out.filter(function (n) { return n >= 100; }); }
  K.gen({ id: 'y3NumProblems', objective: 'Y3-NPV-06', title: 'Number puzzles',
    make: function (r, L) {
      var ds = r.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 3); if (ds.every(function (d) { return d === 0; })) ds = [1, 2, 3];
      var all = perms(ds), want = L === 1 ? 'largest' : L === 2 ? 'smallest' : r.pick(['largest even', 'smallest odd']);
      var pool = all.filter(function (n) { return want.indexOf('even') >= 0 ? n % 2 === 0 : want.indexOf('odd') >= 0 ? n % 2 === 1 : true; });
      if (!pool.length) { want = 'largest'; pool = all; }
      var ans = want.indexOf('largest') === 0 ? Math.max.apply(null, pool) : Math.min.apply(null, pool);
      return K.int('Use each digit card once: <b>' + ds.map(function (d) { return '<span class="card-digit">' + d + '</span>'; }).join(' ') + '</b>. Make the <b>' + want + '</b> 3-digit number you can.', ans,
        { hint: want.indexOf('largest') === 0 ? 'Put the biggest digit in the hundreds column.' : 'Put the smallest digit you can (not 0) in the hundreds column.', params: { ds: ds, want: want },
          sol: [(want.indexOf('even') >= 0 ? 'An even number ends in 0, 2, 4, 6 or 8. ' : want.indexOf('odd') >= 0 ? 'An odd number ends in 1, 3, 5, 7 or 9. ' : '') + 'Choose the hundreds digit first, then the tens.', 'The answer is ' + ans + '.'] });
    },
    verify: function (q) { var p = q.params, all = perms(p.ds).filter(function (n) { return p.want.indexOf('even') >= 0 ? n % 2 === 0 : p.want.indexOf('odd') >= 0 ? n % 2 === 1 : true; });
      all.sort(function (a, b) { return a - b; }); return q.check.value === (p.want.indexOf('largest') === 0 ? all[all.length - 1] : all[0]); } });

  // ================= ADDITION AND SUBTRACTION =================
  K.gen({ id: 'y3Mental', objective: 'Y3-AS-01', title: 'Adding and subtracting ones, tens and hundreds',
    make: function (r, L) {
      var unit = r.pick([1, 10, 100]), k = r.int(1, 9), by = unit * k, add = r.chance(0.5), n;
      if (add && by > 899) add = false; // keep the answer within 3 digits
      var tries = 0;
      do { n = add ? r.int(100, 999 - by) : r.int(Math.max(100, by), 999); tries++; } while (tries < 500 && ((add ? n + by > 999 : n - by < 0) || (L === 1 && (unit === 1 ? (add ? ones(n) + k > 9 : ones(n) < k) : unit === 10 ? (add ? tens(n) + k > 9 : tens(n) < k) : false)) || (L === 2 && unit !== 100 && !(unit === 1 ? (add ? ones(n) + k > 9 : ones(n) < k) : (add ? tens(n) + k > 9 : tens(n) < k)))));
      var ans = add ? n + by : n - by;
      if (L === 3) return K.multi('Find the missing number.', add ? n + ' + {0} = ' + ans : n + ' − {0} = ' + ans, [{ kind: 'int', value: by }], { hint: 'What has changed: the ones, the tens or the hundreds?', params: { n: n, by: by, add: add, ans: ans },
        sol: ['Compare ' + n + ' and ' + ans + ': ' + (add ? ans + ' − ' + n : n + ' − ' + ans) + ' = ' + by + '.', 'The missing number is ' + by + '.'] });
      return K.int('Work out <b>' + n + (add ? ' + ' : ' − ') + by + '</b>.', ans, { hint: unit === 1 ? 'Add or take away the ones.' : unit === 10 ? 'Count on or back in tens.' : 'Only the hundreds digit changes.', params: { n: n, by: by, add: add },
        sol: ['Partition: ' + n + ' = ' + hund(n) * 100 + ' + ' + tens(n) * 10 + ' + ' + ones(n) + '.', (add ? 'Add ' : 'Take away ') + by + ': ' + n + (add ? ' + ' : ' − ') + by + ' = ' + ans + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.ans !== undefined) return (p.add ? K.addCheck(p.n, q.check.parts[0].value) : K.subCheck(p.n, q.check.parts[0].value)) === p.ans; return (p.add ? K.addCheck(p.n, p.by) : K.subCheck(p.n, p.by)) === q.check.value; } });

  function exAdd(a, b) { var c = 0, n = 0, A = K.digits(a).reverse(), B = K.digits(b).reverse(); for (var i = 0; i < Math.max(A.length, B.length); i++) { var s = (A[i] || 0) + (B[i] || 0) + c; c = s >= 10 ? 1 : 0; n += c; } return n; }
  function exSub(a, b) { var br = 0, n = 0, A = K.digits(a).reverse(), B = K.digits(b).reverse(); for (var i = 0; i < A.length; i++) { var t = A[i] - br - (B[i] || 0); br = t < 0 ? 1 : 0; n += br; } return n; }
  function frames(a, b, op) { return V.columnFrames(a, b, op).map(function (f) { return S(f.text, f.html); }); }
  K.gen({ id: 'y3ColAdd', objective: 'Y3-AS-02', title: 'Column addition',
    make: function (r, L) {
      var a, b, t = 0;
      do { a = r.int(100, 800); b = L === 1 ? r.int(10, 99) : r.int(100, 899); t++; } while (t < 500 && (a + b > 999 || (L === 1 ? exAdd(a, b) > 1 : L === 2 ? exAdd(a, b) !== 1 : exAdd(a, b) < 2)));
      return { prompt: 'Use column addition to work out <b>' + a + ' + ' + b + '</b>.', input: { type: 'column', a: a, b: b, op: '+' }, check: { kind: 'int', value: a + b },
        hint: 'Start with the ones. If a column makes 10 or more, exchange 10 for 1 in the next column.', params: { a: a, b: b }, solution: frames(a, b, '+') };
    },
    verify: function (q) { return K.addCheck(q.params.a, q.params.b) === q.check.value && q.check.value <= 999; } });
  K.gen({ id: 'y3ColSub', objective: 'Y3-AS-02', title: 'Column subtraction',
    make: function (r, L) {
      var a, b, t = 0;
      do {
        t++;
        if (L === 3) { a = r.int(2, 9) * 100 + r.pick([0, r.int(1, 9)]); b = r.int(100, a - 20); }
        else { a = r.int(200, 999); b = L === 1 ? r.int(10, 99) : r.int(100, a - 10); }
      } while (t < 500 && (L === 1 ? exSub(a, b) > 1 : L === 2 ? exSub(a, b) !== 1 : exSub(a, b) < 2));
      return { prompt: 'Use column subtraction to work out <b>' + a + ' − ' + b + '</b>.', input: { type: 'column', a: a, b: b, op: '−' }, check: { kind: 'int', value: a - b },
        hint: 'Start with the ones. If the top digit is smaller, exchange 1 from the next column for 10.', params: { a: a, b: b },
        solution: frames(a, b, '−').concat([S('Check with the inverse: ' + (a - b) + ' + ' + b + ' = ' + a + ' ✓')]) };
    },
    verify: function (q) { return K.subCheck(q.params.a, q.params.b) === q.check.value && q.check.value > 0; } });

  K.gen({ id: 'y3Estimate', objective: 'Y3-AS-03', title: 'Estimate and check',
    make: function (r, L) {
      var a = r.int(110, 440), b = r.int(110, 440), round100 = function (x) { return Math.round(x / 100) * 100; };
      if (L === 1) {
        var est = round100(a) + round100(b), wr = [est + 100, est - 100, a + b].filter(function (x) { return x !== est; });
        return K.choice('Which is the best <b>estimate</b> for ' + a + ' + ' + b + '?', shuffleOpts(r, est, wr.slice(0, 3)), String(est), { hint: 'Round each number to the nearest hundred first.', params: { a: a, b: b, est: est },
          sol: [a + ' rounds to ' + round100(a) + ' and ' + b + ' rounds to ' + round100(b) + '.', round100(a) + ' + ' + round100(b) + ' = ' + est + '.'] });
      }
      var big = a + b;
      if (L === 2) {
        return K.choice('Sam works out ' + big + ' − ' + b + ' = ' + a + '. Which calculation <b>checks</b> the answer?', [
          { value: 'inv', label: a + ' + ' + b + ' = ' + big }, { value: 'w1', label: big + ' + ' + b + ' = ' + (big + b) }, { value: 'w2', label: a + ' − ' + b + ' = ' + (a - b) }].filter(function (o) { return o.value !== 'w2' || a > b; }), 'inv',
          { hint: 'Addition undoes subtraction.', params: { a: a, b: b, big: big }, sol: ['Subtraction and addition are inverses.', 'If ' + big + ' − ' + b + ' = ' + a + ', then ' + a + ' + ' + b + ' = ' + big + '.'] });
      }
      var wrongTotal = r.chance(0.5) ? big : big + r.pick([10, -10, 100]);
      return K.choice('Ella says ' + a + ' + ' + b + ' = ' + wrongTotal + '. Use the inverse to check. Is Ella right?', [{ value: 'yes', label: 'Yes, she is right' }, { value: 'no', label: 'No, she is wrong' }], wrongTotal === big ? 'yes' : 'no',
        { hint: 'Work out ' + wrongTotal + ' − ' + b + '. Do you get ' + a + '?', params: { a: a, b: b, claim: wrongTotal }, sol: [wrongTotal + ' − ' + b + ' = ' + (wrongTotal - b) + '.', (wrongTotal - b === a ? 'That is ' + a + ', so Ella is right.' : 'That is not ' + a + ', so Ella is wrong. The answer is ' + big + '.')] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.est !== undefined) return +q.check.value === Math.round(p.a / 100) * 100 + Math.round(p.b / 100) * 100;
      if (p.claim !== undefined) return q.check.value === (K.subCheck(p.claim, p.b) === p.a ? 'yes' : 'no');
      return K.addCheck(p.a, p.b) === p.big && q.check.value === 'inv';
    } });

  K.gen({ id: 'y3ASProblems', objective: 'Y3-AS-04', title: 'Adding and subtracting problems',
    make: function (r, L) {
      var name = r.pick(OM.NAMES), it = r.pick(['stickers', 'shells', 'conkers', 'marbles', 'beads']);
      if (L === 1) {
        var a = r.int(120, 600), b = r.int(30, 300), add = r.chance(0.5);
        if (!add && b > a) b = a - r.int(20, 90);
        return K.int(add ? name + ' has ' + a + ' ' + it + ' and is given ' + b + ' more. How many ' + it + ' does ' + name + ' have now?' : name + ' has ' + a + ' ' + it + ' and gives away ' + b + '. How many are left?', add ? a + b : a - b,
          { hint: add ? '"More" means add.' : '"Gives away" means subtract.', params: { a: a, b: b, add: add }, sol: [(add ? a + ' + ' + b : a + ' − ' + b) + ' = ' + (add ? a + b : a - b) + '.'] });
      }
      if (L === 2) {
        var c = r.int(3, 9) * 100, k = r.int(110, c - 50);
        return K.multi('Find the missing number.', r.chance(0.5) ? '{0} + ' + k + ' = ' + c : k + ' + {0} = ' + c, [{ kind: 'int', value: c - k }], { hint: 'Use the inverse: ' + c + ' − ' + k + '.', params: { c: c, k: k },
          sol: ['The missing number is ' + c + ' − ' + k + ' = ' + (c - k) + '.', 'Check: ' + (c - k) + ' + ' + k + ' = ' + c + ' ✓'] });
      }
      var start = r.int(300, 700), out1 = r.int(40, 150), in1 = r.int(40, 200);
      return K.int('A shop has ' + start + ' ' + it + '. It sells ' + out1 + ', then a delivery brings ' + in1 + ' more. How many ' + it + ' does the shop have now?', start - out1 + in1,
        { hint: 'Do it in two steps: subtract, then add.', params: { s: start, o: out1, i: in1 }, sol: [start + ' − ' + out1 + ' = ' + (start - out1) + '.', (start - out1) + ' + ' + in1 + ' = ' + (start - out1 + in1) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.c !== undefined) return K.addCheck(q.check.parts[0].value, p.k) === p.c; if (p.s !== undefined) return K.addCheck(K.subCheck(p.s, p.o), p.i) === q.check.value; return (p.add ? K.addCheck(p.a, p.b) : K.subCheck(p.a, p.b)) === q.check.value; } });

  // ================= MULTIPLICATION AND DIVISION =================
  K.gen({ id: 'y3Tables', objective: 'Y3-MD-01', title: 'The 3, 4 and 8 times tables',
    make: function (r, L) {
      var t = L === 1 ? r.pick([3, 4]) : L === 2 ? r.pick([8, 3, 4]) : r.pick([3, 4, 8]), k = r.int(L === 1 ? 1 : 2, 12), prod = t * k;
      if (L === 1) return K.int('<span class="big-sum">' + k + ' × ' + t + ' = ?</span>', prod, { hint: 'Count in ' + t + 's, ' + k + ' times.', params: { t: t, k: k, form: 'mul' }, sol: ['Count in ' + t + 's: ' + Array.from({ length: k }, function (_, i) { return (i + 1) * t; }).join(', ') + '.', k + ' × ' + t + ' = ' + prod + '.'] });
      if (L === 2) return K.int('<span class="big-sum">' + prod + ' ÷ ' + t + ' = ?</span>', k, { hint: 'How many ' + t + 's make ' + prod + '?', params: { t: t, k: k, form: 'div' }, sol: ['Think: ? × ' + t + ' = ' + prod + '.', k + ' × ' + t + ' = ' + prod + ', so ' + prod + ' ÷ ' + t + ' = ' + k + '.'] });
      return K.multi('Find the missing number.', '{0} × ' + t + ' = ' + prod, [{ kind: 'int', value: k }], { hint: 'Use division: ' + prod + ' ÷ ' + t + '.', params: { t: t, k: k, form: 'miss' }, sol: [prod + ' ÷ ' + t + ' = ' + k + '.'] });
    },
    verify: function (q) { var p = q.params, v = p.form === 'miss' ? q.check.parts[0].value : q.check.value; return p.form === 'mul' ? K.mulCheck(p.t, p.k) === v : K.mulCheck(p.t, v) === p.t * p.k; } });

  K.gen({ id: 'y3MulWritten', objective: 'Y3-MD-02', title: '2-digit × 1-digit',
    make: function (r, L) {
      var b = L === 1 ? r.pick([2, 3, 4, 5, 10]) : r.pick([3, 4, 5, 8]), a = L === 1 ? r.int(11, 24) : L === 2 ? r.int(13, 39) : r.int(41, 99);
      var t = Math.floor(a / 10) * 10, o = a % 10;
      return K.int('Work out <b>' + a + ' × ' + b + '</b>.', a * b, { hint: 'Partition: ' + t + ' × ' + b + ' and ' + o + ' × ' + b + ', then add.', params: { a: a, b: b },
        sol: ['Partition ' + a + ' into ' + t + ' and ' + o + '.', t + ' × ' + b + ' = ' + t * b + ' and ' + o + ' × ' + b + ' = ' + o * b + '.', t * b + ' + ' + o * b + ' = ' + a * b + '.'] });
    },
    verify: function (q) { return K.mulCheck(q.params.a, q.params.b) === q.check.value; } });
  K.gen({ id: 'y3Div', objective: 'Y3-MD-02', title: 'Dividing 2-digit numbers',
    make: function (r, L) {
      var d = L === 1 ? r.pick([2, 5, 10]) : r.pick([3, 4, 8]), qn = L === 1 ? r.int(2, 12) : r.int(11, Math.floor(99 / d)), n = d * qn;
      return K.int('Work out <b>' + n + ' ÷ ' + d + '</b>.', qn, { hint: L === 1 ? 'Use your ' + d + ' times table.' : 'Partition ' + n + ' into a multiple of ' + d * 10 + ' and the rest.', params: { n: n, d: d },
        sol: L === 1 ? [qn + ' × ' + d + ' = ' + n + ', so ' + n + ' ÷ ' + d + ' = ' + qn + '.'] : [n + ' = ' + d * 10 + ' + ' + (n - d * 10) + '.', d * 10 + ' ÷ ' + d + ' = 10 and ' + (n - d * 10) + ' ÷ ' + d + ' = ' + (qn - 10) + '.', '10 + ' + (qn - 10) + ' = ' + qn + '.'] });
    },
    verify: function (q) { return K.mulCheck(q.params.d, q.check.value) === q.params.n; } });

  K.gen({ id: 'y3MDProblems', objective: 'Y3-MD-03', title: 'Multiplying and dividing problems',
    make: function (r, L) {
      var name = r.pick(OM.NAMES);
      if (L === 1) { var k = r.pick([3, 4, 8]), n = r.int(3, 12); return K.int('There are ' + n + ' boxes. Each box holds ' + k + ' pencils. How many pencils are there?', n * k, { hint: n + ' lots of ' + k + '.', params: { a: n, b: k, kind: 'mul' }, sol: [n + ' × ' + k + ' = ' + n * k + '.'] }); }
      if (L === 2) { var len = r.int(2, 12), f = r.pick([2, 3, 4, 5, 8]); return K.int('A worm is ' + len + ' cm long. A snake is ' + f + ' times as long. How long is the snake?', len * f, { suffix: 'cm', hint: '"' + f + ' times as long" means multiply by ' + f + '.', params: { a: len, b: f, kind: 'mul' }, sol: [len + ' cm × ' + f + ' = ' + len * f + ' cm.'] }); }
      var h = r.int(2, 5), s = r.int(2, 6);
      return K.int(name + ' has ' + h + ' hats and ' + s + ' scarves. How many different ways can ' + name + ' wear one hat and one scarf?', h * s, { hint: 'Each hat goes with every scarf.', params: { a: h, b: s, kind: 'mul' },
        sol: ['Each of the ' + h + ' hats can go with ' + s + ' scarves.', h + ' × ' + s + ' = ' + h * s + ' ways.'] });
    },
    verify: function (q) { return K.mulCheck(q.params.a, q.params.b) === q.check.value; } });

  // ================= FRACTIONS =================
  K.gen({ id: 'y3Tenths', objective: 'Y3-F-01', title: 'Counting in tenths',
    make: function (r, L) {
      if (L === 1) { var s0 = r.int(1, 5), up = r.chance(0.6), seq = [0, 1, 2].map(function (i) { return up ? s0 + i : 9 - s0 - i + 1; }), nx = up ? seq[2] + 1 : seq[2] - 1;
        return K.frac('What comes next? &nbsp;' + seq.map(function (x) { return F(x, 10); }).join(', &nbsp;') + ', &nbsp;?', nx, 10, { form: 'denominator', denom: 10, hint: 'The tenths go ' + (up ? 'up' : 'down') + ' by 1 each time.', params: { seq: seq, nx: nx, up: up },
          sol: ['Count ' + (up ? 'on' : 'back') + ' in tenths.', 'The next number is ' + F(nx, 10) + '.'] }); }
      if (L === 2) { var n = r.int(1, 9); return K.frac('Work out <b>' + n + ' ÷ 10</b>. Write your answer as a fraction.', n, 10, { form: 'denominator', denom: 10, hint: 'Share ' + n + ' into 10 equal parts.', params: { n: n },
        sol: ['Dividing by 10 makes tenths.', n + ' ÷ 10 = ' + F(n, 10) + '.'] }); }
      var parts = r.int(2, 9);
      return K.frac('A ribbon is cut into 10 equal pieces. ' + r.pick(OM.NAMES) + ' takes ' + parts + ' pieces. What fraction of the ribbon is that?', parts, 10, { hint: 'Each piece is one tenth.', params: { n: parts },
        visual: V.fractionBar(10, parts), sol: [S('Each piece is ' + F(1, 10) + ' of the ribbon.', V.fractionBar(10, parts)), parts + ' pieces = ' + F(parts, 10) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.seq) return q.check.n === p.seq[2] + (p.up ? 1 : -1) && q.check.d === 10 && q.check.n > 0 && q.check.n < 10; return q.check.n === p.n && q.check.d === 10; } });

  K.gen({ id: 'y3FracOfSet', objective: 'Y3-F-02', title: 'Fractions of a set',
    make: function (r, L) {
      var d = r.pick([2, 3, 4, 5, 8]), each = r.int(2, d <= 4 ? 6 : 4), total = d * each, n = L === 1 ? 1 : r.int(2, d - 1);
      if (d === 2 && n > 1) n = 1;
      if (L < 3) return K.int('What is ' + F(n, d) + ' of ' + total + '?', n * each, { visual: V.dots(total, { perRow: Math.min(total, each * Math.min(d, 4)), group: each }), hint: 'Share ' + total + ' into ' + d + ' equal groups.', params: { n: n, d: d, total: total },
        sol: [total + ' ÷ ' + d + ' = ' + each + ', so ' + F(1, d) + ' of ' + total + ' is ' + each + '.'].concat(n > 1 ? [F(n, d) + ' is ' + n + ' lots of ' + each + ' = ' + n * each + '.'] : []) });
      return K.int(F(1, d) + ' of a number is ' + each + '. What is the number?', total, { hint: 'There are ' + d + ' equal parts, each worth ' + each + '.', params: { n: 1, d: d, total: total, inv: true },
        sol: ['The whole has ' + d + ' parts of ' + each + '.', each + ' × ' + d + ' = ' + total + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.inv) return K.mulCheck(p.total / p.d, p.d) === q.check.value; return K.mulCheck(q.check.value, p.d) === K.mulCheck(p.total, p.n); } });

  K.gen({ id: 'y3FracNumberLine', objective: 'Y3-F-03', title: 'Fractions on a number line',
    make: function (r, L) {
      var d = L === 1 ? r.pick([2, 3, 4]) : r.pick([3, 4, 5, 6, 8, 10]), k = r.int(1, d - 1);
      return K.frac('What fraction is the arrow pointing to?', k, d, { visual: V.numberLine({ min: 0, max: 1, step: 1 / d, labels: 'ends', arrow: k / d, format: function (v) { return String(v); } }),
        hint: 'Count how many equal parts the line from 0 to 1 is split into.', params: { k: k, d: d },
        sol: ['From 0 to 1 is split into ' + d + ' equal parts, so each part is ' + F(1, d) + '.', 'The arrow is ' + k + ' part' + (k > 1 ? 's' : '') + ' along: ' + F(k, d) + '.'] });
    },
    verify: function (q) { return q.check.n * q.params.d === q.params.k * q.check.d && q.params.k < q.params.d; } });

  K.gen({ id: 'y3EquivDiagram', objective: 'Y3-F-04', title: 'Equivalent fractions with diagrams',
    make: function (r, L) {
      var pairs = L === 1 ? [[1, 2, 2], [1, 2, 4], [1, 3, 2], [1, 4, 2], [2, 3, 2], [1, 2, 3]] :
        [[1, 2, 3], [1, 4, 2], [1, 3, 3], [2, 3, 2], [3, 4, 2], [1, 5, 2], [2, 5, 2], [1, 2, 5], [3, 5, 2], [4, 5, 2], [1, 2, 6], [3, 4, 3], [2, 3, 3], [1, 6, 2], [1, 3, 4], [1, 4, 3]];
      var pr = r.pick(pairs), n = pr[0], d = pr[1], m = pr[2];
      var showBars = '<div class="pair">' + V.fractionBar(d, n) + V.fractionBar(d * m, n * m) + '</div>';
      if (L === 3) return K.frac('Find the missing number: &nbsp;' + F(n, d) + ' = ?/' + d * m, n * m, d * m, { form: 'denominator', denom: d * m, hint: 'What has ' + d + ' been multiplied by to make ' + d * m + '? Do the same to the top.', params: { n: n, d: d, D: d * m },
        sol: [d + ' × ' + m + ' = ' + d * m + '.', n + ' × ' + m + ' = ' + n * m + ', so ' + F(n, d) + ' = ' + F(n * m, d * m) + '.'] });
      return K.frac('The two bars are the same length. The top bar shows ' + F(n, d) + '. What fraction of the bottom bar is shaded the same amount?', n * m, d * m, { form: 'denominator', denom: d * m, visual: showBars,
        hint: 'Count the shaded parts in the bottom bar and how many parts there are.', params: { n: n, d: d, D: d * m }, sol: [S('The bottom bar has ' + d * m + ' equal parts and ' + n * m + ' are shaded.', showBars), F(n, d) + ' = ' + F(n * m, d * m) + '.'] });
    },
    verify: function (q) { var p = q.params; return q.check.n * p.d === p.n * q.check.d && q.check.d === p.D; } });

  K.gen({ id: 'y3FracAddSub', objective: 'Y3-F-05', title: 'Adding and subtracting fractions',
    make: function (r, L) {
      var d = r.pick([4, 5, 6, 7, 8, 9, 10]), add = L === 1 ? true : L === 2 ? false : r.chance(0.5), a, b;
      if (add) { a = r.int(1, d - 2); b = r.int(1, d - a); } else { a = r.int(2, d); b = r.int(1, a - 1); }
      var ans = add ? a + b : a - b;
      return K.frac('Work out &nbsp;' + F(a, d) + (add ? ' + ' : ' − ') + F(b, d), ans, d, { hint: 'The denominators are the same, so ' + (add ? 'add' : 'subtract') + ' the numerators. The denominator stays ' + d + '.', params: { a: a, b: b, d: d, add: add },
        visual: V.fractionBar(d, ans), sol: [(add ? 'Add' : 'Subtract') + ' the numerators: ' + a + (add ? ' + ' : ' − ') + b + ' = ' + ans + '.', 'The answer is ' + F(ans, d) + '.'] });
    },
    verify: function (q) { var p = q.params, num = p.add ? K.addCheck(p.a, p.b) : K.subCheck(p.a, p.b); return q.check.n * p.d === num * q.check.d && num <= p.d; } });

  K.gen({ id: 'y3FracCompare', objective: 'Y3-F-06', title: 'Comparing and ordering fractions',
    make: function (r, L) {
      if (L === 1) {
        var ds = r.sample([2, 3, 4, 5, 6, 8, 10], 2), big = Math.min(ds[0], ds[1]);
        return K.choice('Which fraction is <b>bigger</b>?', ds.map(function (d) { return { value: String(d), label: F(1, d) }; }), String(big), { big: true, hint: 'The more parts the whole is cut into, the smaller each part is.', params: { ds: ds },
          sol: [S('Compare ' + F(1, ds[0]) + ' and ' + F(1, ds[1]) + '.', '<div class="pair">' + V.fractionBar(ds[0], 1) + V.fractionBar(ds[1], 1) + '</div>'), F(1, big) + ' is bigger because the whole is cut into fewer parts.'] });
      }
      if (L === 2) {
        var d = r.pick([5, 6, 7, 8, 9, 10]), ns = r.sample([1, 2, 3, 4], 2).map(function (x) { return Math.min(x + r.int(0, 2), d - 1); });
        var sym = ns[0] < ns[1] ? '<' : ns[0] > ns[1] ? '>' : '=';
        return K.choice('Which sign makes this true? &nbsp;' + F(ns[0], d) + ' ? ' + F(ns[1], d), [{ value: '<', label: '&lt;' }, { value: '>', label: '&gt;' }, { value: '=', label: '=' }], sym, { big: true, hint: 'Same denominator: compare the numerators.', params: { a: ns[0], b: ns[1], d: d },
          sol: ['The denominators are both ' + d + ', so compare the numerators ' + ns[0] + ' and ' + ns[1] + '.'] });
      }
      var dd = r.sample([2, 3, 4, 5, 6, 8, 10], 3), order = dd.slice().sort(function (a, b) { return b - a; });
      return K.order('Put these fractions in order, starting with the <b>smallest</b>.', dd.map(function (x) { return { value: String(x), label: F(1, x) }; }), order.map(String),
        { hint: 'For unit fractions, the bigger the denominator, the smaller the fraction.', params: { dd: dd }, answer: order.map(function (x) { return '1/' + x; }).join(', '), sol: ['Smallest first: ' + order.map(function (x) { return F(1, x); }).join(', ') + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.dd) return q.check.order.every(function (x, i, a) { return i === 0 || 1 * +a[i - 1] > 1 * +x; });
      if (p.ds) return +q.check.value === (p.ds[0] * 1 < p.ds[1] * 1 ? p.ds[0] : p.ds[1]);
      return q.check.value === (p.a * p.d < p.b * p.d ? '<' : p.a > p.b ? '>' : '=');
    } });

  K.gen({ id: 'y3FracProblems', objective: 'Y3-F-07', title: 'Fraction problems',
    make: function (r, L) {
      var name = r.pick(OM.NAMES), d = r.pick([2, 3, 4, 5]), each = r.int(2, 8), total = d * each;
      if (L === 1) return K.int('There are ' + total + ' strawberries. ' + name + ' eats ' + F(1, d) + ' of them. How many does ' + name + ' eat?', each, { hint: 'Divide ' + total + ' by ' + d + '.', params: { total: total, d: d, n: 1, ask: 'part' }, sol: [total + ' ÷ ' + d + ' = ' + each + '.'] });
      if (L === 2) { var n = r.int(1, d - 1); return K.int('There are ' + total + ' cakes. ' + F(n, d) + ' are eaten. How many cakes are <b>left</b>?', total - n * each, { hint: 'Find ' + F(n, d) + ' first, then subtract.', params: { total: total, d: d, n: n, ask: 'left' },
        sol: [F(1, d) + ' of ' + total + ' = ' + each + ', so ' + F(n, d) + ' = ' + n * each + '.', total + ' − ' + n * each + ' = ' + (total - n * each) + ' left.'] }); }
      var m = r.int(1, d - 1);
      return K.frac('A pizza is cut into ' + d + ' equal slices. ' + name + ' eats ' + m + ' slice' + (m > 1 ? 's' : '') + '. What fraction of the pizza is <b>left</b>?', d - m, d, { visual: V.pie(d, m), hint: 'How many slices are left out of ' + d + '?', params: { d: d, m: m },
        sol: [d + ' − ' + m + ' = ' + (d - m) + ' slices are left.', 'That is ' + F(d - m, d) + ' of the pizza.'] });
    },
    verify: function (q) { var p = q.params; if (p.m !== undefined) return q.check.n * p.d === (p.d - p.m) * q.check.d; var part = K.mulCheck(p.total / p.d, p.n); return q.check.value === (p.ask === 'left' ? K.subCheck(p.total, part) : part); } });

  // ================= MEASUREMENT =================
  K.gen({ id: 'y3Measures', objective: 'Y3-M-01', title: 'Length, mass and capacity',
    make: function (r, L) {
      var kinds = [['cm', 'ribbon', 'long'], ['g', 'flour', 'heavy'], ['ml', 'juice', 'full']], k = r.pick(kinds);
      if (L === 1) { var a = r.int(15, 95), b = r.int(12, 95); return K.int('A ' + k[1] + ' measure is ' + a + ' ' + k[0] + ' and another is ' + b + ' ' + k[0] + '. What is the total?', a + b, { suffix: k[0], hint: 'Add the two amounts.', params: { a: a, b: b, add: true }, sol: [a + ' + ' + b + ' = ' + (a + b) + ' ' + k[0] + '.'] }); }
      if (L === 2) {
        var unit = r.pick([['kg', 'g', 'flour'], ['l', 'ml', 'water']]), take = r.int(1, 19) * 50;
        return K.int('A bag holds 1 ' + unit[0] + ' of ' + unit[2] + '. ' + take + ' ' + unit[1] + ' is used. How much is left?', 1000 - take, { suffix: unit[1], hint: '1 ' + unit[0] + ' = 1,000 ' + unit[1] + '.', params: { a: 1000, b: take, add: false },
          sol: ['1 ' + unit[0] + ' = 1000 ' + unit[1] + '.', '1000 − ' + take + ' = ' + (1000 - take) + ' ' + unit[1] + '.'] });
      }
      var m = r.int(1, 3), cm = r.int(5, 95), other = m * 100 + cm + r.pick([-15, -5, 5, 15]);
      var bigger = m * 100 + cm > other ? 'a' : 'b';
      return K.choice('Which is <b>longer</b>?', [{ value: 'a', label: m + ' m ' + cm + ' cm' }, { value: 'b', label: other + ' cm' }], bigger, { hint: '1 m = 100 cm.', params: { m: m, cm: cm, other: other },
        sol: [m + ' m ' + cm + ' cm = ' + (m * 100 + cm) + ' cm.', 'Compare ' + (m * 100 + cm) + ' cm and ' + other + ' cm.'] });
    },
    verify: function (q) { var p = q.params; if (p.m !== undefined) return q.check.value === (p.m * 100 + p.cm > p.other ? 'a' : 'b'); return (p.add ? K.addCheck(p.a, p.b) : K.subCheck(p.a, p.b)) === q.check.value; } });

  K.gen({ id: 'y3Perimeter', objective: 'Y3-M-02', title: 'Perimeter',
    make: function (r, L) {
      if (L === 3 || (L === 2 && r.chance(0.4))) {
        var s = [r.int(3, 9), r.int(3, 9), r.int(3, 9)]; while (s[0] + s[1] <= s[2] || s[0] + s[2] <= s[1] || s[1] + s[2] <= s[0]) s = [r.int(3, 9), r.int(3, 9), r.int(3, 9)];
        var ax = (s[0] * s[0] + s[2] * s[2] - s[1] * s[1]) / (2 * s[0]), ay = Math.sqrt(Math.max(0, s[2] * s[2] - ax * ax));
        return K.int('Find the perimeter of this triangle.', K.sum(s), { suffix: 'cm', visual: V.labelledShape([[0, 0], [s[0], 0], [ax, -ay]], s.map(function (x) { return x + ' cm'; })), hint: 'Add the lengths of all three sides.', params: { sides: s },
          sol: [s.join(' + ') + ' = ' + K.sum(s) + ' cm.'] });
      }
      var w = r.int(2, 12), h = r.int(2, 9), sq = L === 1 && r.chance(0.4);
      if (sq) h = w;
      return K.int('Find the perimeter of this ' + (sq ? 'square' : 'rectangle') + '.', 2 * (w + h), { suffix: 'cm', visual: V.labelledShape([[0, 0], [w, 0], [w, h], [0, h]], [w + ' cm', h + ' cm', null, null]), hint: 'Opposite sides are the same length. Add all four sides.', params: { sides: [w, h, w, h] },
        sol: ['The sides are ' + w + ', ' + h + ', ' + w + ' and ' + h + ' cm.', w + ' + ' + h + ' + ' + w + ' + ' + h + ' = ' + 2 * (w + h) + ' cm.'] });
    },
    verify: function (q) { return q.params.sides.reduce(function (s, x) { return K.addCheck(s, x); }, 0) === q.check.value; } });

  K.gen({ id: 'y3Money', objective: 'Y3-M-03', title: 'Money and change',
    make: function (r, L) {
      var name = r.pick(OM.NAMES), item = r.pick(['a comic', 'a yo-yo', 'a pencil case', 'a snack', 'a toy car']);
      if (L === 1) { var c = r.int(10, 95), paid = 100; return K.money(name + ' buys ' + item + ' for ' + c + 'p and pays with £1. How much change does ' + name + ' get?', paid - c, 'p', { hint: '£1 = 100p. Count on from ' + c + 'p to 100p.', params: { paid: paid, cost: c },
        sol: ['£1 = 100p.', '100p − ' + c + 'p = ' + (100 - c) + 'p.'] }); }
      if (L === 2) { var p1 = r.int(105, 395), p2 = r.int(45, 395); return K.money(name + ' buys ' + item + ' for ' + OM.pounds(p1) + ' and a drink for ' + (p2 < 100 ? p2 + 'p' : OM.pounds(p2)) + '. How much is that altogether?', p1 + p2, '£', { hint: 'Add the pounds and the pence. 100p = £1.', params: { a: p1, b: p2, add: true },
        sol: ['Turn both into pence: ' + p1 + 'p + ' + p2 + 'p = ' + (p1 + p2) + 'p.', (p1 + p2) + 'p = ' + OM.pounds(p1 + p2) + '.'] }); }
      var note = r.pick([500, 1000]), cost = r.int(120, note - 30);
      return K.money(name + ' buys ' + item + ' for ' + OM.pounds(cost) + ' and pays with a ' + OM.pounds(note).replace('.00', '') + ' note. How much change?', note - cost, '£', { hint: 'Count up from ' + OM.pounds(cost) + ' to ' + OM.pounds(note) + '.', params: { a: note, b: cost, add: false },
        sol: [OM.pounds(note) + ' − ' + OM.pounds(cost) + ' = ' + OM.pounds(note - cost) + '.', 'Check: ' + OM.pounds(cost) + ' + ' + OM.pounds(note - cost) + ' = ' + OM.pounds(note) + ' ✓'] });
    },
    verify: function (q) { var p = q.params; if (p.paid) return K.subCheck(p.paid, p.cost) === q.check.pence; return (p.add ? K.addCheck(p.a, p.b) : K.subCheck(p.a, p.b)) === q.check.pence; } });

  K.gen({ id: 'y3Clock', objective: 'Y3-M-04', title: 'Telling the time',
    make: function (r, L) {
      var h = r.int(1, 12), m = r.int(0, 11) * 5, mins = (h % 12) * 60 + m;
      if (L === 1) return K.time('What time does the clock show?', mins, 'clock', { visual: V.clock(h, m), hint: 'The short hand shows the hour. The long hand counts minutes in 5s.', params: { h: h, m: m },
        answer: OM.time12(mins, false), sol: ['The hour hand is ' + (m === 0 ? 'on ' : 'past ') + h + '. The minute hand is on ' + (m / 5 || 12) + ', which is ' + m + ' minutes.', 'The time is ' + OM.time12(mins, false) + '.'] });
      if (L === 2) return K.time('This clock uses Roman numerals. What time does it show?', mins, 'clock', { visual: V.clock(h, m, { roman: true }), hint: 'XII is 12, III is 3, VI is 6 and IX is 9.', params: { h: h, m: m },
        answer: OM.time12(mins, false), sol: ['Read the Roman numerals: the hour hand is near ' + OM.toRoman(h) + ' (' + h + ').', 'The time is ' + OM.time12(mins, false) + '.'] });
      var pm = r.chance(0.6), mm = (h % 12) * 60 + m + (pm ? 720 : 0);
      return K.time('It is the ' + (pm ? 'afternoon or evening' : 'morning') + '. Write the time on the clock as a <b>24-hour</b> time.', mm, '24', { visual: V.clock(h, m), hint: pm ? 'For pm times, add 12 to the hour.' : 'Morning times keep the same hour. Use 4 digits.', params: { h: h, m: m, pm: pm },
        answer: OM.time24(mm), sol: ['The clock shows ' + OM.time12((h % 12) * 60 + m, false) + ' ' + (pm ? 'pm' : 'am') + '.', 'As a 24-hour time: ' + OM.time24(mm) + '.'] });
    },
    verify: function (q) { var p = q.params; return q.check.mins === ((p.h === 12 ? 0 : p.h) + (p.pm ? 12 : 0)) * 60 + p.m; } });

  K.gen({ id: 'y3TimeVocab', objective: 'Y3-M-05', title: 'Time to the minute; am and pm',
    make: function (r, L) {
      if (L === 1) { var h = r.int(1, 12), m = r.int(1, 59); if (m % 5 === 0) m++; var mins = (h % 12) * 60 + m;
        return K.time('What time does the clock show? Read it to the nearest minute.', mins, 'clock', { visual: V.clock(h, m), hint: 'Count in 5s to the nearest number, then count on the small marks.', params: { h: h, m: m },
          answer: OM.time12(mins, false), sol: ['Count in 5s to ' + Math.floor(m / 5) * 5 + ', then ' + m % 5 + ' more minute' + (m % 5 === 1 ? '' : 's') + '.', 'The time is ' + OM.time12(mins, false) + '.'] }); }
      if (L === 2) { var ev = r.pick(EVENTS);
        return K.choice('Which time is the most sensible for a child to ' + ev[0] + '?', [{ value: 'am', label: ev[1] + ':' + (ev[1] === 12 ? '15' : '00') + ' am' }, { value: 'pm', label: ev[1] + ':' + (ev[1] === 12 ? '15' : '00') + ' pm' }], ev[2],
          { hint: 'am is from midnight to noon. pm is from noon to midnight.', params: { ev: ev }, sol: ['am means before noon; pm means after noon.', 'The sensible time is ' + ev[1] + ':' + (ev[1] === 12 ? '15' : '00') + ' ' + ev[2] + '.'] }); }
      var a = r.int(50, 150), b = r.int(1, 3), longer = a > b * 60 ? 'a' : 'b';
      if (a === b * 60) a += 10;
      longer = a > b * 60 ? 'a' : 'b';
      return K.choice('Which is <b>longer</b>?', [{ value: 'a', label: a + ' seconds' }, { value: 'b', label: K.plural(b, 'minute') }], longer, { hint: '1 minute = 60 seconds.', params: { a: a, b: b },
        sol: [K.plural(b, 'minute') + ' = ' + b * 60 + ' seconds.', 'Compare ' + a + ' seconds and ' + b * 60 + ' seconds.'] });
    },
    // independent: the hour on a 24-hour clock tells whether it is am (before noon) or pm
    verify: function (q) { var p = q.params; if (p.ev) return q.check.value === (EVENT_24H[p.ev[0]] >= 12 ? 'pm' : 'am'); if (p.b !== undefined) return q.check.value === (p.a > p.b * 60 ? 'a' : 'b'); return q.check.mins === (p.h % 12) * 60 + p.m; } });

  var EVENTS = [['eat breakfast', 7, 'am'], ['have lunch', 12, 'pm'], ['go to bed', 8, 'pm'], ['start school', 9, 'am'], ['eat dinner', 6, 'pm']];
  var EVENT_24H = { 'eat breakfast': 7, 'have lunch': 12, 'go to bed': 20, 'start school': 9, 'eat dinner': 18 };
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  K.gen({ id: 'y3TimeFacts', objective: 'Y3-M-06', title: 'Seconds, months and leap years',
    make: function (r, L) {
      if (L === 1) { var f = r.pick([['seconds are in 1 minute', 60], ['minutes are in 1 hour', 60], ['hours are in 1 day', 24], ['days are in 1 week', 7], ['months are in 1 year', 12]]);
        return K.int('How many ' + f[0] + '?', f[1], { hint: 'Think about the units of time.', params: { f: f }, sol: ['There are ' + f[1] + ' ' + f[0] + '.'] }); }
      if (L === 2) { var mi = r.int(0, 11); return K.int('How many days are there in <b>' + MONTHS[mi] + '</b>' + (mi === 1 ? ' (not in a leap year)' : '') + '?', MDAYS[mi], { hint: '"30 days has September, April, June and November…"', params: { mi: mi },
        sol: ['30 days: September, April, June and November. February has 28 (29 in a leap year). All the rest have 31.', MONTHS[mi] + ' has ' + MDAYS[mi] + ' days.'] }); }
      var k = r.pick(['leap', 'year', 'mins']);
      if (k === 'leap') return K.int('How many days are there in a <b>leap year</b>?', 366, { hint: 'A leap year has one extra day, 29 February.', params: { k: k }, sol: ['A normal year has 365 days.', 'A leap year has one extra day: 366.'] });
      if (k === 'year') return K.int('How many days are there in a year that is <b>not</b> a leap year?', 365, { hint: 'Add up the days in each month.', params: { k: k }, sol: ['A normal year has 365 days.'] });
      var n = r.int(2, 9); return K.int('How many seconds are there in <b>' + n + ' minutes</b>?', n * 60, { hint: '1 minute = 60 seconds.', params: { k: k, n: n }, sol: [n + ' × 60 = ' + n * 60 + ' seconds.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.mi !== undefined) return q.check.value === new Date(2023, p.mi + 1, 0).getDate();
      if (p.k === 'leap') return q.check.value === Math.round((new Date(2024, 11, 31) - new Date(2023, 11, 31)) / 864e5);
      if (p.k === 'year') return q.check.value === Math.round((new Date(2023, 11, 31) - new Date(2022, 11, 31)) / 864e5);
      if (p.k === 'mins') return K.mulCheck(60, p.n) === q.check.value;
      return { 'seconds are in 1 minute': 60, 'minutes are in 1 hour': 60, 'hours are in 1 day': 24, 'days are in 1 week': 7, 'months are in 1 year': 12 }[p.f[0]] === q.check.value;
    } });

  K.gen({ id: 'y3Durations', objective: 'Y3-M-07', title: 'How long does it take?',
    make: function (r, L) {
      var name = r.pick(OM.NAMES), start = r.int(7, 17) * 60 + r.int(0, 11) * 5, len = L === 1 ? r.int(2, 9) * 5 : L === 2 ? r.int(5, 15) * 5 : r.int(8, 22) * 5;
      if (L === 1) start = Math.floor(start / 60) * 60 + r.int(0, 5) * 5;
      var end = start + len, f = function (x) { return OM.time12(x, true); };
      if (L < 3) return K.int(name + ' starts reading at ' + f(start) + ' and stops at ' + f(end) + '. How many minutes is that?', len, { suffix: 'minutes', hint: 'Count on from the start time to the end time.', params: { s: start, e: end },
        sol: ['Count on from ' + f(start) + ' to ' + f(end) + '.', 'That is ' + len + ' minutes.'] });
      return K.time('A film starts at ' + f(start) + ' and lasts ' + len + ' minutes. What time does it finish?', end, 'clock', { hint: 'Add the minutes. 60 minutes make 1 hour.', params: { s: start, len: len },
        answer: f(end), sol: ['Add ' + len + ' minutes to ' + f(start) + '.', 'The film finishes at ' + f(end) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.e !== undefined) return K.subCheck(p.e, p.s) === q.check.value; return q.check.mins === K.addCheck(p.s, p.len); } });

  // ================= GEOMETRY =================
  var SOLID_NAMES = ['cube', 'cuboid', 'cylinder', 'cone', 'sphere', 'square-based pyramid', 'triangular prism'];
  K.gen({ id: 'y3Shapes3D', objective: 'Y3-G-01', title: '3-D shapes',
    make: function (r, L) {
      if (L === 1) { var nm = r.pick(SOLID_NAMES), opts = r.shuffle([nm].concat(r.sample(SOLID_NAMES.filter(function (x) { return x !== nm; }), 3)));
        return K.choice('What is the name of this 3-D shape?', opts, nm, { visual: V.solid(nm), hint: 'Look at the faces: are they flat or curved?', params: { nm: nm }, sol: ['This shape is a ' + nm + '.'] }); }
      var poly = r.pick(['cube', 'cuboid', 'square-based pyramid', 'triangular prism']), what = r.pick(['faces', 'edges', 'vertices']);
      if (L === 2) return K.int('How many <b>' + what + '</b> does a ' + poly + ' have?', K.SOLIDS[poly][what], { visual: V.solid(poly), hint: what === 'faces' ? 'Faces are the flat surfaces.' : what === 'edges' ? 'Edges are where two faces meet.' : 'Vertices are the corners.', params: { poly: poly, what: what },
        sol: ['A ' + poly + ' has ' + K.SOLIDS[poly].faces + ' faces, ' + K.SOLIDS[poly].edges + ' edges and ' + K.SOLIDS[poly].vertices + ' vertices.'] });
      var clues = [['I have 6 faces. They are all squares.', 'cube'], ['I have one curved face and one flat circle face.', 'cone'], ['I have 2 triangle faces and 3 rectangle faces.', 'triangular prism'], ['I have a square face and 4 triangle faces.', 'square-based pyramid'], ['I have 2 flat circle faces and one curved face.', 'cylinder']];
      var c = r.pick(clues), o2 = r.shuffle([c[1]].concat(r.sample(SOLID_NAMES.filter(function (x) { return x !== c[1]; }), 3)));
      return K.choice('Which 3-D shape am I? <i>' + c[0] + '</i>', o2, c[1], { hint: 'Picture each shape and count its faces.', params: { clue: c[0], nm: c[1] }, sol: ['The shape is a ' + c[1] + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.poly) { var s = K.SOLIDS[p.poly]; return s.faces + s.vertices - s.edges === 2 && q.check.value === s[p.what]; }
      if (p.clue) return { 'I have 6 faces. They are all squares.': 'cube', 'I have one curved face and one flat circle face.': 'cone', 'I have 2 triangle faces and 3 rectangle faces.': 'triangular prism', 'I have a square face and 4 triangle faces.': 'square-based pyramid', 'I have 2 flat circle faces and one curved face.': 'cylinder' }[p.clue] === q.check.value;
      return SOLID_NAMES.indexOf(q.check.value) >= 0 && q.check.value === p.nm;
    } });

  var DIRS = ['north', 'east', 'south', 'west'];
  K.gen({ id: 'y3AnglesTurn', objective: 'Y3-G-02', title: 'Angles and turns',
    make: function (r, L) {
      if (L === 1) { var n = r.int(3, 8), pts = []; for (var i = 0; i < n; i++) pts.push([Math.cos(2 * Math.PI * i / n) * 10, Math.sin(2 * Math.PI * i / n) * 10]);
        return K.int('How many angles does this shape have?', n, { visual: V.polygon(pts, { ticks: false }), hint: 'An angle is made at each corner where two sides meet.', params: { n: n }, sol: ['Count the corners: there is an angle at each one.', 'This shape has ' + n + ' angles.'] }); }
      var from = r.int(0, 3), k = r.int(1, 3), cw = r.chance(0.6), to = (from + (cw ? k : 4 - k)) % 4;
      if (L === 2) return K.int('Pip faces <b>' + DIRS[from] + '</b> and turns ' + (cw ? 'clockwise' : 'anticlockwise') + ' to face <b>' + DIRS[to] + '</b>. How many right angles has Pip turned?', k, { hint: 'A quarter turn is one right angle.', params: { from: from, to: to, cw: cw },
        sol: ['Each quarter turn is one right angle.', 'From ' + DIRS[from] + ' to ' + DIRS[to] + ' ' + (cw ? 'clockwise' : 'anticlockwise') + ' is ' + K.plural(k, 'right angle') + '.'] });
      return K.choice('Pip faces <b>' + DIRS[from] + '</b> and turns <b>' + K.plural(k, 'right angle') + '</b> ' + (cw ? 'clockwise' : 'anticlockwise') + '. Which way is Pip facing now?', DIRS.map(function (d) { return { value: d, label: d }; }), DIRS[to],
        { hint: 'Clockwise goes north, east, south, west.', params: { from: from, k: k, cw: cw }, sol: ['Turn one right angle at a time ' + (cw ? 'clockwise' : 'anticlockwise') + ' from ' + DIRS[from] + '.', 'Pip faces ' + DIRS[to] + '.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.n) return q.check.value === p.n;
      if (p.to !== undefined) { var steps = 0, d = p.from; while (d !== p.to) { d = (d + (p.cw ? 1 : 3)) % 4; steps++; } return steps === q.check.value; }
      var dd = p.from; for (var i = 0; i < p.k; i++) dd = (dd + (p.cw ? 1 : 3)) % 4; return DIRS[dd] === q.check.value;
    } });

  K.gen({ id: 'y3RightAngles', objective: 'Y3-G-03', title: 'Right angles and turns',
    make: function (r, L) {
      if (L === 1) { var deg = r.pick([90, 90, r.int(20, 75), r.int(105, 165)]), ans = deg === 90 ? 'equal' : deg < 90 ? 'less' : 'greater';
        return K.choice('Compare this angle with a right angle.', [{ value: 'less', label: 'Less than a right angle' }, { value: 'equal', label: 'A right angle' }, { value: 'greater', label: 'Greater than a right angle' }], ans,
          { visual: V.angle(deg, { rot: r.int(0, 3) * 30 }), hint: 'A right angle is like the corner of a book.', params: { deg: deg }, sol: ['Compare it with a square corner.', 'It is ' + (ans === 'equal' ? 'a right angle' : ans + ' than a right angle') + '.'] }); }
      if (L === 2) { var t = r.pick([['a half turn', 2], ['a three-quarter turn', 3], ['a whole turn', 4], ['a quarter turn', 1]]);
        return K.int('How many right angles make <b>' + t[0] + '</b>?', t[1], { hint: 'A quarter turn is 1 right angle.', params: { t: t }, sol: ['4 right angles make a whole turn.', t[0] + ' is ' + K.plural(t[1], 'right angle') + '.'] }); }
      var shapes = [['rectangle', [[0, 0], [8, 0], [8, 5], [0, 5]]], ['right-angled triangle', [[0, 0], [8, 0], [0, 6]]], ['L-shape', [[0, 0], [8, 0], [8, 3], [3, 3], [3, 7], [0, 7]]], ['kite', [[0, 0], [3, -4], [6, 0], [3, 7]]], ['square', [[0, 0], [6, 0], [6, 6], [0, 6]]]];
      var sh = r.pick(shapes), count = rightAnglesInside(sh[1]);
      return K.int('How many right angles are <b>inside</b> this ' + sh[0] + '?', count, { visual: V.polygon(sh[1], { ticks: false }), hint: 'Look for square corners inside the shape.', params: { pts: sh[1] }, sol: ['The square corners are marked.', 'There ' + (count === 1 ? 'is 1 right angle' : 'are ' + count + ' right angles') + ' inside the shape.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.deg) return q.check.value === (p.deg === 90 ? 'equal' : p.deg < 90 ? 'less' : 'greater');
      if (p.t) return { 'a quarter turn': 1, 'a half turn': 2, 'a three-quarter turn': 3, 'a whole turn': 4 }[p.t[0]] === q.check.value;
      // independent: interior angles from side directions (degrees), count the 90s
      var pts = p.pts, n = pts.length, area = 0, c = 0;
      for (var i = 0; i < n; i++) area += pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1];
      for (i = 0; i < n; i++) {
        var a = pts[(i + n - 1) % n], b = pts[i], d = pts[(i + 1) % n];
        var t1 = Math.atan2(b[1] - a[1], b[0] - a[0]), t2 = Math.atan2(d[1] - b[1], d[0] - b[0]), turn = (t2 - t1) * 180 / Math.PI;
        while (turn <= -180) turn += 360; while (turn > 180) turn -= 360;
        var interior = 180 - (area > 0 ? turn : -turn);
        if (Math.abs(interior - 90) < 0.01) c++;
      }
      return c === q.check.value;
    } });
  function rightAnglesInside(pts) {
    var n = pts.length, c = 0, area = 0, i;
    for (i = 0; i < n; i++) area += pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1];
    for (i = 0; i < n; i++) {
      var a = pts[(i + n - 1) % n], b = pts[i], d = pts[(i + 1) % n], v1 = [a[0] - b[0], a[1] - b[1]], v2 = [d[0] - b[0], d[1] - b[1]];
      var cross = v1[0] * v2[1] - v1[1] * v2[0], dot = v1[0] * v2[0] + v1[1] * v2[1];
      if (Math.abs(dot) < 1e-9 && (area > 0 ? cross < 0 : cross > 0)) c++;
    }
    return c;
  }

  K.gen({ id: 'y3Lines', objective: 'Y3-G-04', title: 'Horizontal, vertical, parallel and perpendicular',
    make: function (r, L) {
      if (L === 1) { var hz = r.chance(0.5); return K.choice('Is the line horizontal or vertical?', ['horizontal', 'vertical'], hz ? 'horizontal' : 'vertical',
        { visual: V.svg(220, 160, hz ? V.line(30, 80, 190, 80, { w: 6, stroke: V.colors.sky }) : V.line(110, 20, 110, 140, { w: 6, stroke: V.colors.sky })), hint: 'Horizontal is flat like the horizon. Vertical goes straight up and down.', params: { hz: hz },
          sol: ['This line is ' + (hz ? 'horizontal: flat, like the horizon.' : 'vertical: straight up and down.')] }); }
      if (L === 2) { var kind = r.pick(['parallel', 'perpendicular', 'neither']), rot = r.pick([0, 20, 45, 70]);
        return K.choice('Are these two lines parallel, perpendicular or neither?', ['parallel', 'perpendicular', 'neither'], kind, { visual: V.linePair(kind, rot), hint: 'Parallel lines never meet. Perpendicular lines meet at a right angle.', params: { kind: kind, rot: rot },
          sol: ['Parallel lines stay the same distance apart. Perpendicular lines meet at a right angle.', 'These lines are ' + kind + '.'] }); }
      var shp = r.pick([['rectangle', 2], ['square', 2], ['right-angled triangle', 0], ['trapezium', 1], ['regular hexagon', 3]]);
      return K.int('How many pairs of <b>parallel</b> sides does a ' + shp[0] + ' have?', shp[1], { hint: 'Parallel sides go in the same direction and never meet.', params: { shp: shp[0] }, sol: ['A ' + shp[0] + ' has ' + K.plural(shp[1], 'pair') + ' of parallel sides.'] });
    },
    verify: function (q) {
      var p = q.params;
      if (p.hz !== undefined) return q.check.value === (p.hz ? 'horizontal' : 'vertical');
      if (p.kind) return q.check.value === p.kind;
      var P = { rectangle: [[0, 0], [8, 0], [8, 5], [0, 5]], square: [[0, 0], [5, 0], [5, 5], [0, 5]], 'right-angled triangle': [[0, 0], [6, 0], [0, 4]], trapezium: [[0, 0], [10, 0], [7, 4], [2, 4]], 'regular hexagon': [0, 1, 2, 3, 4, 5].map(function (i) { return [Math.cos(i * Math.PI / 3), Math.sin(i * Math.PI / 3)]; }) }[p.shp];
      var n = P.length, dirs = [], pairs = 0;
      for (var i = 0; i < n; i++) dirs.push([P[(i + 1) % n][0] - P[i][0], P[(i + 1) % n][1] - P[i][1]]);
      for (i = 0; i < n; i++) for (var j = i + 1; j < n; j++) if (Math.abs(dirs[i][0] * dirs[j][1] - dirs[i][1] * dirs[j][0]) < 1e-9) pairs++;
      return pairs === q.check.value;
    } });

  // ================= STATISTICS =================
  function dataSet(r, L) {
    var themes = [['Favourite fruit', ['Apple', 'Banana', 'Grapes', 'Pear', 'Orange']], ['Pets', ['Cats', 'Dogs', 'Fish', 'Rabbits', 'Birds']], ['Birds seen', ['Robin', 'Blackbird', 'Pigeon', 'Sparrow', 'Owl']]];
    var th = r.pick(themes), n = 4, step = L === 1 ? 2 : r.pick([2, 5, 10]), cats = th[1].slice(0, n), vals = cats.map(function () { return step * r.int(1, 9); });
    return { title: th[0], cats: cats, vals: vals, step: step };
  }
  K.gen({ id: 'y3ReadData', objective: 'Y3-S-01', title: 'Bar charts, pictograms and tables',
    make: function (r, L) {
      var d = dataSet(r, L), i = r.int(0, 3), usePict = L === 2 && r.chance(0.5) || L === 3;
      var vis = usePict ? V.pictogram({ cats: d.cats, values: d.vals, key: d.step }) : V.barChart({ cats: d.cats, values: d.vals, step: d.step, max: d.step * 10, ylabel: 'Number of children', title: d.title });
      return K.int('How many children chose <b>' + d.cats[i] + '</b>?', d.vals[i], { visual: vis, hint: usePict ? 'Each symbol stands for ' + d.step + '.' : 'Each line on the scale goes up in ' + d.step + 's.', params: { vals: d.vals, i: i, step: d.step, pict: usePict },
        sol: [usePict ? d.cats[i] + ' has ' + d.vals[i] / d.step + ' symbols. Each is worth ' + d.step + ': ' + d.vals[i] / d.step + ' × ' + d.step + ' = ' + d.vals[i] + '.' : 'Read across from the top of the ' + d.cats[i] + ' bar: ' + d.vals[i] + '.'] });
    },
    verify: function (q) { var p = q.params; return K.mulCheck(p.step, p.vals[p.i] / p.step) === q.check.value; } });
  K.gen({ id: 'y3DataProblems', objective: 'Y3-S-02', title: 'How many more? How many fewer?',
    make: function (r, L) {
      var d = dataSet(r, L), ij = r.sample([0, 1, 2, 3], 2), a = d.vals[ij[0]], b = d.vals[ij[1]];
      if (a === b) { d.vals[ij[0]] += d.step; a = d.vals[ij[0]]; }
      var vis = L === 3 ? V.pictogram({ cats: d.cats, values: d.vals, key: d.step }) : L === 2 ? V.table(['', 'Number'], d.cats.map(function (c, k) { return [c, d.vals[k]]; })) : V.barChart({ cats: d.cats, values: d.vals, step: d.step, max: d.step * 10, title: d.title });
      if (L === 3 && r.chance(0.5)) { var tot = K.sum(d.vals); return K.int('How many children voted <b>altogether</b>?', tot, { visual: vis, hint: 'Find each amount, then add them all.', params: { vals: d.vals.slice(), all: true }, sol: ['Add them up: ' + d.vals.join(' + ') + ' = ' + tot + '.'] }); }
      var big = Math.max(a, b), small = Math.min(a, b), bigC = a > b ? d.cats[ij[0]] : d.cats[ij[1]], smallC = a > b ? d.cats[ij[1]] : d.cats[ij[0]], fewer = r.chance(0.4);
      return K.int(fewer ? 'How many <b>fewer</b> children chose ' + smallC + ' than ' + bigC + '?' : 'How many <b>more</b> children chose ' + bigC + ' than ' + smallC + '?', big - small, { visual: vis, hint: 'Find both amounts, then subtract the smaller from the bigger.', params: { big: big, small: small },
        sol: [bigC + ': ' + big + '. ' + smallC + ': ' + small + '.', big + ' − ' + small + ' = ' + (big - small) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.all) return p.vals.reduce(function (s, x) { return K.addCheck(s, x); }, 0) === q.check.value; return K.subCheck(p.big, p.small) === q.check.value; } });
})(typeof window !== 'undefined' ? window : globalThis);
