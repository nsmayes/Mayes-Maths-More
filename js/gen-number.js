/* Learn with Pip — Year 4 generators: number & place value, addition & subtraction.
   Each generator: make(rng, level) builds a question; verify(q) re-derives the answer a different way;
   constraints(q) lists any breach of the Year 4 limits. Levels: 1 = getting there, 2 = expected, 3 = greater depth. */
(function (G) {
  'use strict';
  var OM = G.OM, V = OM.V, fmt = OM.fmt;
  function S(text, html) { return { text: text, html: html || '' }; }
  function neg(n) { return n < 0 ? '−' + (-n) : String(n); }
  function digits(n) { return String(n).split('').map(Number); }
  function seqTemplate(terms, blanks, f) {
    return terms.map(function (t, i) { var b = blanks.indexOf(i); return b >= 0 ? '{' + b + '}' : (f || fmt)(t); }).join(', ');
  }

  // ---------- Y4-NPV-01 count in multiples ----------
  OM.registerGen({
    id: 'countMultiples', objective: 'Y4-NPV-01', title: 'Missing numbers in a sequence',
    make: function (r, L) {
      var step, start, dir = 1;
      if (L === 1) { step = r.pick([25, 1000]); start = step * r.int(0, 3); }
      else if (L === 2) { step = r.pick([6, 7, 9]); start = step * r.int(1, 8); dir = r.chance(0.3) ? -1 : 1; if (dir < 0) start = step * r.int(7, 12); }
      else {
        step = r.pick([6, 7, 9, 25, 1000]); dir = r.chance(0.5) ? -1 : 1;
        start = step === 1000 ? r.int(1001, 3999) : step === 25 ? 25 * r.int(10, 30) + r.pick([0, 0, 5, 10, 15]) : r.int(1, 40);
        if (dir < 0) start = step === 1000 ? r.int(6000, 9999) : start + step * 8;
      }
      var terms = []; for (var i = 0; i < 6; i++) terms.push(start + dir * i * step);
      var blanks = r.sample([2, 3, 4, 5], 2).sort();
      var q = {
        prompt: 'This sequence goes ' + (dir > 0 ? 'up' : 'down') + ' in equal steps. Write the missing numbers.',
        input: { type: 'multi', template: seqTemplate(terms, blanks), blanks: [{ keys: 'digits' }, { keys: 'digits' }] },
        check: { kind: 'multi', parts: blanks.map(function (b) { return { kind: 'int', value: terms[b] }; }) },
        hint: 'Find the difference between the first two numbers. That is the step.',
        params: { terms: terms, step: step * dir, blanks: blanks },
        solution: [
          S('Find the step: ' + fmt(terms[1]) + ' − ' + fmt(terms[0]) + ' = ' + neg(terms[1] - terms[0]) + '. The sequence goes ' + (dir > 0 ? 'up' : 'down') + ' in ' + fmt(step) + 's.'),
          S('Count ' + (dir > 0 ? 'on' : 'back') + ' by ' + fmt(step) + ' each time: ' + terms.map(fmt).join(', ') + '.',
            terms[5] - terms[0] !== 0 && step !== 1000 && Math.abs(terms[5] - terms[0]) <= 120 ? V.numberLine({ min: Math.min(terms[0], terms[5]), max: Math.max(terms[0], terms[5]), step: step, hops: terms.slice(1).map(function (t, i) { return { from: terms[i], to: t, label: (dir > 0 ? '+' : '−') + step }; }) }) : '')
        ]
      };
      q.answerText = blanks.map(function (b) { return fmt(terms[b]); }).join(' and ');
      return q;
    },
    verify: function (q) {
      var t = q.params.terms, s = q.params.step;
      for (var i = 1; i < t.length; i++) if (t[i] - t[i - 1] !== s) return false;
      return [6, 7, 9, 25, 1000].indexOf(Math.abs(s)) >= 0 && q.check.parts.every(function (p, i) { return p.value === t[0] + q.params.blanks[i] * s; });
    },
    constraints: function (q) { return q.params.terms.some(function (x) { return x < 0 || x > 10000; }) ? ['term out of range 0–10,000'] : []; }
  });

  // ---------- Y4-NPV-02 1,000 more or less ----------
  OM.registerGen({
    id: 'thousandMoreLess', objective: 'Y4-NPV-02', title: '1,000 more or less',
    make: function (r, L) {
      var more = r.chance(0.5), n, ans, prompt, sol;
      if (L === 1) { n = more ? r.int(1000, 8999) : r.int(2000, 9999); }
      else if (L === 2) { n = more ? r.pick([r.int(100, 999), r.int(1000, 8999)]) : r.int(1000, 9999); }
      if (L < 3) {
        ans = more ? n + 1000 : n - 1000;
        prompt = 'What is 1,000 ' + (more ? 'more' : 'less') + ' than ' + fmt(n) + '?';
        sol = [S('Only the thousands digit changes. ' + (n < 1000 ? fmt(n) + ' has 0 thousands. ' : ''), V.placeValueOf(n)),
          S('The thousands digit goes ' + (more ? 'up' : 'down') + ' by 1: ' + fmt(n) + ' ' + (more ? '+' : '−') + ' 1,000 = ' + fmt(ans) + '.', V.placeValueOf(ans))];
      } else {
        var target = r.int(1000, 9999);
        if (more) { n = target; ans = target - 1000; prompt = 'I think of a number. 1,000 more than my number is ' + fmt(target) + '. What is my number?'; }
        else { n = r.int(1000, 8999); ans = n + 1000; prompt = 'I think of a number. 1,000 less than my number is ' + fmt(n) + '. What is my number?'; }
        sol = [S('Work backwards using the inverse. ' + (more ? '1,000 more was ' + fmt(n) + ', so take 1,000 away.' : '1,000 less was ' + fmt(n) + ', so add 1,000.')),
          S((more ? fmt(n) + ' − 1,000 = ' : fmt(n) + ' + 1,000 = ') + fmt(ans) + '.', V.placeValueOf(ans))];
      }
      return { prompt: prompt, input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: ans }, solution: sol,
        hint: 'Only the thousands digit changes.', params: { n: n, more: more, L: L } };
    },
    verify: function (q) { var p = q.params, v = q.check.value; return p.L < 3 ? v === p.n + (p.more ? 1000 : -1000) : v === p.n + (p.more ? -1000 : 1000); },
    constraints: function (q) { return q.check.value < 0 || q.check.value > 10000 ? ['answer out of range'] : []; }
  });

  // ---------- Y4-NPV-03 counting back through zero ----------
  OM.registerGen({
    id: 'negativeCount', objective: 'Y4-NPV-03', title: 'Counting back through zero',
    make: function (r, L) {
      var fl = function (v) { return neg(v); };
      if (L < 3) {
        var step = L === 1 ? 1 : r.pick([2, 3, 5, 10]);
        var start = L === 1 ? r.int(1, 4) : step === 10 ? r.pick([20, 30]) : step * r.int(1, 2) + r.int(0, step - 1);
        var terms = []; for (var i = 0; i < 6; i++) terms.push(start - i * step);
        if (L === 1 && r.chance(0.4)) { // count on from a negative number towards zero
          start = -r.int(3, 6); terms = []; for (i = 0; i < 6; i++) terms.push(start + i);
          var negs = [2, 3, 4, 5].filter(function (j) { return terms[j] < 0; });
          var bl = r.sample(negs.length >= 2 ? negs : [1, 2], 2).sort();
          return { prompt: 'Count on in 1s. Write the missing numbers.',
            input: { type: 'multi', template: seqTemplate(terms, bl, fl), blanks: [{ keys: 'signed' }, { keys: 'signed' }] },
            check: { kind: 'multi', parts: bl.map(function (b) { return { kind: 'int', value: terms[b] }; }) },
            answerText: bl.map(function (b) { return neg(terms[b]); }).join(' and '), hint: 'Counting on, the numbers get closer to zero: −3, −2, −1, 0.',
            params: { terms: terms, step: 1 },
            solution: [S('Add 1 each time. Negative numbers get closer to zero as you count on.', V.numberLine({ min: -10, max: 5, step: 1, format: fl, hops: terms.slice(1).map(function (t, k) { return { from: terms[k], to: t, label: '+1' }; }) })), S('The sequence is ' + terms.map(fl).join(', ') + '.')] };
        }
        // blanks go where the sequence has crossed zero, so the child must count into the negative numbers
        var negPos = [2, 3, 4, 5].filter(function (i) { return terms[i] <= 0; });
        var blanks = r.sample(negPos.length >= 2 ? negPos : [4, 5], 2).sort();
        var lo = Math.min(-10, terms[5] - step), hi = Math.max(10, start);
        return {
          prompt: 'Count back in ' + step + 's. Write the missing numbers.',
          input: { type: 'multi', template: seqTemplate(terms, blanks, fl), blanks: [{ keys: 'signed' }, { keys: 'signed' }] },
          check: { kind: 'multi', parts: blanks.map(function (b) { return { kind: 'int', value: terms[b] }; }) },
          answerText: blanks.map(function (b) { return neg(terms[b]); }).join(' and '),
          hint: 'Keep taking ' + step + ' away, even after you pass zero.',
          params: { terms: terms, step: -step },
          solution: [S('Take away ' + step + ' each time. After zero, the numbers are negative.',
            V.numberLine({ min: lo, max: hi, step: lo <= -20 || hi >= 20 ? 5 : 1, format: fl, hops: terms.slice(1).map(function (t, i) { return { from: terms[i], to: t, label: '−' + step }; }) })),
            S('The sequence is ' + terms.map(fl).join(', ') + '.')]
        };
      }
      var t0 = r.int(-6, 8), ch = r.int(3, 9) * (r.chance(0.6) ? -1 : 1);
      while (t0 + ch < -10 || t0 + ch > 10 || (t0 >= 0) === (t0 + ch >= 0)) { t0 = r.int(-6, 8); ch = r.int(3, 9) * (r.chance(0.6) ? -1 : 1); }
      var ans = t0 + ch;
      return {
        prompt: 'At 6 am the temperature in the forest was ' + neg(t0) + '°C. By midday it had ' + (ch < 0 ? 'fallen' : 'risen') + ' by ' + Math.abs(ch) + ' degrees. What was the temperature at midday?',
        input: { type: 'number', keys: 'signed', suffix: '°C' },
        check: { kind: 'int', value: ans }, answerText: neg(ans) + '°C',
        hint: 'Use a number line. ' + (ch < 0 ? 'Fallen means count back.' : 'Risen means count on.'),
        params: { t0: t0, ch: ch },
        solution: [S('Start at ' + neg(t0) + ' and count ' + (ch < 0 ? 'back' : 'on') + ' ' + Math.abs(ch) + '.', V.numberLine({ min: -10, max: 10, step: 1, format: fl, hops: [{ from: t0, to: ans, label: (ch < 0 ? '−' : '+') + Math.abs(ch) }] })),
          S('The temperature was ' + neg(ans) + '°C.')]
      };
    },
    verify: function (q) {
      if (q.params.terms) { var t = q.params.terms; return t.every(function (x, i) { return i === 0 || x - t[i - 1] === q.params.step; }) && t.some(function (x) { return x < 0; }); }
      return q.check.value === q.params.t0 + q.params.ch;
    },
    constraints: function (q) { var t = q.params.terms || [q.check.value]; return t.some(function (x) { return x < -30; }) ? ['negative number too far below zero for Y4'] : []; }
  });

  // ---------- Y4-NPV-04 place value ----------
  var PV_NAMES = ['thousands', 'hundreds', 'tens', 'ones'], PV_VAL = [1000, 100, 10, 1];
  OM.registerGen({
    id: 'placeValue', objective: 'Y4-NPV-04', title: 'Value of each digit',
    make: function (r, L) {
      var d;
      if (L === 1) {
        d = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 4);
        var n = +d.join(''), pos = r.int(0, 3), val = d[pos] * PV_VAL[pos];
        return { prompt: 'What is the value of the digit <b>' + d[pos] + '</b> in ' + fmt(n) + '?', input: { type: 'number', keys: 'digits' },
          check: { kind: 'int', value: val }, hint: 'Which column is the ' + d[pos] + ' in?', params: { n: n, pos: pos },
          reject: [d[pos] + ' on its own (that is the digit, not its value)'],
          solution: [S('Put ' + fmt(n) + ' in a place value chart. The ' + d[pos] + ' is in the ' + PV_NAMES[pos] + ' column.', V.placeValue(['Th', 'H', 'T', 'O'], d.map(String), { highlight: pos })),
            S('So its value is ' + d[pos] + ' × ' + fmt(PV_VAL[pos]) + ' = ' + fmt(val) + '.')] };
      }
      if (L === 2) {
        d = [r.int(1, 9), r.int(1, 9), r.int(1, 9), r.int(1, 9)];
        var n2 = +d.join(''), blank = r.int(0, 3), parts = d.map(function (x, i) { return x * PV_VAL[i]; });
        var tpl = fmt(n2) + ' = ' + parts.map(function (p, i) { return i === blank ? '{0}' : fmt(p); }).join(' + ');
        return { prompt: 'Complete the partition.', input: { type: 'multi', template: tpl, blanks: [{ keys: 'digits' }] },
          check: { kind: 'multi', parts: [{ kind: 'int', value: parts[blank] }] }, answerText: fmt(parts[blank]), hint: 'Each part is the value of one digit.',
          params: { n: n2, blank: blank, parts: parts },
          solution: [S('Split ' + fmt(n2) + ' into thousands, hundreds, tens and ones.', V.placeValue(['Th', 'H', 'T', 'O'], d.map(String), { highlight: blank })),
            S(fmt(n2) + ' = ' + parts.map(fmt).join(' + ') + '. The missing part is ' + fmt(parts[blank]) + '.')] };
      }
      if (r.chance(0.5)) {
        d = [r.int(1, 9), r.int(0, 9), r.int(0, 9), r.int(0, 9)];
        if (d.indexOf(0) < 0) d[r.int(1, 3)] = 0;
        var n3 = +d.join(''), order = r.shuffle([0, 1, 2, 3]);
        var desc = order.map(function (i) { return d[i] + ' ' + (d[i] === 1 ? PV_NAMES[i].replace(/s$/, '') : PV_NAMES[i]); });
        return { prompt: 'My number has ' + desc.slice(0, 3).join(', ') + ' and ' + desc[3] + '. What is my number?', input: { type: 'number', keys: 'digits' },
          check: { kind: 'int', value: n3 }, hint: 'Put each digit in its place in a place value chart. Watch out for zeros!', params: { d: d, order: order },
          solution: [S('Put each digit in the right column, whatever order they are given in.', V.placeValue(['Th', 'H', 'T', 'O'], d.map(String))), S('The number is ' + fmt(n3) + '. The 0 is a place holder.')] };
      }
      d = [r.int(2, 9), r.int(1, 9), r.int(1, 9), r.int(1, 9)];
      var n4 = +d.join(''), th = (d[0] - 1) * 1000, rest = d[2] * 10 + d[3], missing = n4 - th - rest;
      return { prompt: 'Complete: ' + fmt(n4) + ' = ' + fmt(th) + ' + ___ + ' + rest, input: { type: 'multi', template: fmt(n4) + ' = ' + fmt(th) + ' + {0} + ' + rest, blanks: [{ keys: 'digits' }] },
        check: { kind: 'multi', parts: [{ kind: 'int', value: missing }] }, answerText: fmt(missing), hint: 'This is not the usual partition. Work out what is left after taking away the other parts.',
        params: { n: n4, th: th, rest: rest },
        solution: [S('The parts must add up to ' + fmt(n4) + '. Take away the parts you know: ' + fmt(n4) + ' − ' + fmt(th) + ' − ' + rest + '.'), S(fmt(n4) + ' − ' + fmt(th) + ' = ' + fmt(n4 - th) + ', then ' + fmt(n4 - th) + ' − ' + rest + ' = ' + fmt(missing) + '. One thousand has been split into 10 hundreds.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.pos !== undefined) return q.check.value === Math.floor(p.n / PV_VAL[p.pos]) % 10 * PV_VAL[p.pos];
      if (p.parts) return p.parts.reduce(function (a, b) { return a + b; }, 0) === p.n && q.check.parts[0].value === p.parts[p.blank];
      if (p.d) return q.check.value === p.d[0] * 1000 + p.d[1] * 100 + p.d[2] * 10 + p.d[3];
      return p.th + q.check.parts[0].value + p.rest === p.n;
    }
  });

  // ---------- Y4-NPV-05 compare and order ----------
  function cmpNum(a, b) { var A = String(a), B = String(b); if (A.length !== B.length) return A.length < B.length ? -1 : 1; return A < B ? -1 : A > B ? 1 : 0; }
  OM.registerGen({
    id: 'compareOrder', objective: 'Y4-NPV-05', title: 'Compare and order',
    make: function (r, L) {
      if (L === 1) {
        var a = r.int(1000, 9999), b;
        var mode = r.int(0, 9);
        if (mode < 6) { b = Math.floor(a / 1000) * 1000 + r.int(0, 999); }
        else if (mode < 9) { b = r.int(1000, 9999); }
        else b = a;
        var rel = a < b ? '<' : a > b ? '>' : '=';
        var bShow = mode === 9 ? fmt(Math.floor(b / 1000) * 1000) + ' + ' + (b % 1000) : fmt(b);
        return { prompt: 'Choose the correct sign: &nbsp;<b>' + fmt(a) + ' &nbsp;?&nbsp; ' + bShow + '</b>', input: { type: 'choice', options: [{ value: '<', label: '&lt;' }, { value: '>', label: '&gt;' }, { value: '=', label: '=' }], big: true },
          check: { kind: 'choice', value: rel, label: rel === '<' ? '&lt;' : rel === '>' ? '&gt;' : '=' }, hint: 'Compare the thousands first, then the hundreds.', params: { a: a, b: b },
          solution: [S('Compare digit by digit, starting with the thousands.', V.placeValueOf(a) + V.placeValueOf(b)), S(fmt(a) + ' ' + (rel === '<' ? 'is less than' : rel === '>' ? 'is greater than' : 'is equal to') + ' ' + fmt(b) + ', so the sign is ' + (rel === '<' ? '&lt;' : rel === '>' ? '&gt;' : '=') + '.')] };
      }
      var ds = r.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 4);
      if (ds[0] === 0) ds = [ds[1], ds[0], ds[2], ds[3]];
      var nums = [], tries = 0;
      while (nums.length < 4 && tries++ < 200) {
        var p = r.shuffle(ds);
        if (p[0] === 0) continue;
        var v = +p.join('');
        if (nums.indexOf(v) < 0) nums.push(v);
      }
      if (L === 3 && r.chance(0.5)) nums[3] = +String(nums[3]).slice(1) || nums[3];
      var sorted = nums.slice().sort(cmpNum);
      if (L === 2) {
        var greatest = r.chance(0.5), ans = greatest ? sorted[3] : sorted[0];
        return { prompt: 'Which number is the <b>' + (greatest ? 'greatest' : 'smallest') + '</b>?', input: { type: 'choice', options: nums.map(function (x) { return { value: String(x), label: fmt(x) }; }) },
          check: { kind: 'choice', value: String(ans), label: fmt(ans) }, hint: 'Look at the thousands digits first.', params: { nums: nums, greatest: greatest },
          solution: [S('Compare the thousands digits. If they are the same, compare the hundreds.'), S('In order: ' + sorted.map(fmt).join(' &lt; ') + '. The ' + (greatest ? 'greatest' : 'smallest') + ' is ' + fmt(ans) + '.')] };
      }
      return { prompt: 'Put these numbers in order, starting with the <b>smallest</b>. Tap them in order.', input: { type: 'order', items: r.shuffle(nums).map(function (x) { return { value: String(x), label: fmt(x) }; }) },
        check: { kind: 'order', order: sorted.map(String), labels: sorted.map(fmt) }, hint: 'Count the digits first: a 3-digit number is smaller than any 4-digit number.', params: { nums: nums },
        solution: [S('Compare thousands, then hundreds, then tens, then ones.'), S('Smallest to largest: ' + sorted.map(fmt).join(', ') + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (q.check.kind === 'choice' && p.a !== undefined) return q.check.value === (p.a < p.b ? '<' : p.a > p.b ? '>' : '=');
      var s = p.nums.slice().sort(function (a, b) { return a - b; });
      if (q.check.kind === 'choice') return +q.check.value === (p.greatest ? s[3] : s[0]);
      return q.check.order.join() === s.map(String).join();
    }
  });

  // ---------- Y4-NPV-06 identify, represent, estimate ----------
  OM.registerGen({
    id: 'representNumbers', objective: 'Y4-NPV-06', title: 'Number lines and blocks',
    make: function (r, L) {
      if (r.chance(0.3)) {
        var n = L === 1 ? r.int(1, 3) * 1000 + r.int(1, 9) * 100 + r.int(1, 9) * 10 + r.int(1, 9) : r.int(1, 3) * 1000 + r.pick([0, r.int(1, 9)]) * 100 + r.pick([0, r.int(1, 9)]) * 10 + r.int(0, 9);
        return { prompt: 'What number is shown by these base 10 blocks?', visual: V.base10(n), input: { type: 'number', keys: 'digits' },
          check: { kind: 'int', value: n }, hint: 'Count the big cubes (thousands), the flat squares (hundreds), the sticks (tens) and the small cubes (ones).', params: { n: n, blocks: true },
          solution: [S('Thousands: ' + Math.floor(n / 1000) + ', hundreds: ' + Math.floor(n / 100) % 10 + ', tens: ' + Math.floor(n / 10) % 10 + ', ones: ' + n % 10 + '.', V.placeValueOf(n)), S('The number is ' + fmt(n) + '.')] };
      }
      var min, step, k, ticks, labels = 'ends';
      if (L === 1) { min = 0; step = 100; ticks = 10; labels = 'all'; }
      else if (L === 2) { min = r.int(0, 8) * 1000; step = 100; ticks = 10; }
      else { var opt = r.int(0, 2); if (opt === 0) { min = r.int(10, 90) * 100; step = 50; ticks = 10; } else if (opt === 1) { min = r.int(10, 98) * 100; step = 10; ticks = 10; } else { min = 0; step = 1000; ticks = 10; } }
      k = r.int(1, ticks - 1);
      var max = min + step * ticks, v = min + k * step;
      return { prompt: 'What number is the arrow pointing to?', visual: V.numberLine({ min: min, max: max, step: step, labels: labels, arrow: v }), input: { type: 'number', keys: 'digits' },
        check: { kind: 'int', value: v }, hint: 'Work out what each small step is worth: (' + fmt(max) + ' − ' + fmt(min) + ') ÷ ' + ticks + '.', params: { min: min, step: step, k: k, ticks: ticks },
        solution: [S('From ' + fmt(min) + ' to ' + fmt(max) + ' is ' + fmt(max - min) + '. There are ' + ticks + ' equal steps, so each step is ' + fmt(max - min) + ' ÷ ' + ticks + ' = ' + fmt(step) + '.'),
          S('The arrow is ' + k + ' steps after ' + fmt(min) + ': ' + fmt(min) + ' + ' + k + ' × ' + fmt(step) + ' = ' + fmt(v) + '.', V.numberLine({ min: min, max: max, step: step, labels: 'all', arrow: v, width: 700 }))] };
    },
    verify: function (q) { var p = q.params; return p.blocks ? q.check.value === p.n : q.check.value === p.min + p.k * p.step && p.k > 0 && p.k < p.ticks; }
  });

  // ---------- Y4-NPV-07 rounding ----------
  function roundTo(n, p) { var rem = n % p; return rem * 2 >= p ? n - rem + p : n - rem; }
  OM.registerGen({
    id: 'rounding', objective: 'Y4-NPV-07', title: 'Rounding',
    make: function (r, L) {
      var p, n;
      if (L === 1) { p = 10; n = r.chance(0.5) ? r.int(101, 999) : r.int(1001, 9999); if (n % 10 === 0) n += r.int(1, 9); }
      else if (L === 2) { p = r.pick([100, 1000]); n = r.int(1001, 9899); if (n % p === 0) n += 7; }
      else {
        if (r.chance(0.35)) {
          p = r.pick([10, 100]); var x = r.int(p === 10 ? 11 : 11, p === 10 ? 999 : 99) * p, smallest = r.chance(0.5);
          var ans = smallest ? x - p / 2 : x + p / 2 - 1;
          return { prompt: 'A whole number rounded to the nearest ' + p + ' is ' + fmt(x) + '. What is the <b>' + (smallest ? 'smallest' : 'largest') + '</b> the number could be?', input: { type: 'number', keys: 'digits' },
            check: { kind: 'int', value: ans }, hint: 'Think about the halfway numbers either side of ' + fmt(x) + '.', params: { p: p, x: x, smallest: smallest },
            solution: [S('Numbers from ' + fmt(x - p / 2) + ' to ' + fmt(x + p / 2 - 1) + ' round to ' + fmt(x) + '. (' + fmt(x - p / 2) + ' is halfway, and halfway rounds up.)', V.numberLine({ min: x - p, max: x + p, step: p / 10, labels: 'none', labelValues: [x - p, x - p / 2, x, x + p / 2, x + p], points: [{ v: ans, label: fmt(ans) }] })),
              S('So the ' + (smallest ? 'smallest' : 'largest') + ' number is ' + fmt(ans) + '.')] };
        }
        p = r.pick([10, 100, 1000]);
        var base = r.int(1, 8) * 1000 + (p === 1000 ? 0 : r.int(0, 9) * 100) + (p === 10 ? r.int(0, 9) * 10 : 0);
        n = r.chance(0.5) ? base + p - r.int(1, Math.ceil(p / 2) - 1) : base + p / 2;
        if (p === 1000 && r.chance(0.3)) n = 9500 + r.int(0, 499);
      }
      var a = roundTo(n, p), lo = n - n % p, hi = lo + p;
      return { prompt: 'Round ' + fmt(n) + ' to the nearest ' + fmt(p) + '.', input: { type: 'number', keys: 'digits' },
        check: { kind: 'int', value: a }, hint: 'Which two multiples of ' + fmt(p) + ' is it between? Which is it nearer to?', params: { n: n, p: p },
        solution: [S(fmt(n) + ' is between ' + fmt(lo) + ' and ' + fmt(hi) + '. Halfway is ' + fmt(lo + p / 2) + '.', V.numberLine({ min: lo, max: hi, step: p / 10, labels: 'none', labelValues: [lo, lo + p / 2, hi], points: [{ v: n, label: fmt(n) }] })),
          S((n - lo) * 2 >= p ? fmt(n) + ' is at or past halfway, so round up to ' + fmt(hi) + '.' : fmt(n) + ' is before halfway, so round down to ' + fmt(lo) + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.x !== undefined) return Math.round(q.check.value / p.p) * p.p === p.x && Math.round((q.check.value + (p.smallest ? -1 : 1)) / p.p) * p.p !== p.x;
      return q.check.value === Math.round(p.n / p.p) * p.p;
    }
  });

  // ---------- Y4-NPV-08 digit card problems ----------
  function perms(arr) { if (arr.length <= 1) return [arr]; var out = []; arr.forEach(function (x, i) { perms(arr.slice(0, i).concat(arr.slice(i + 1))).forEach(function (p) { out.push([x].concat(p)); }); }); return out; }
  OM.registerGen({
    id: 'digitPuzzles', objective: 'Y4-NPV-08', title: 'Digit card puzzles',
    make: function (r, L) {
      var ds = r.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 4), task, ans, name = r.pick(OM.NAMES);
      var tasks = L === 1 ? ['largest'] : L === 2 ? ['smallest', 'largest'] : ['largest even', 'smallest odd', 'closest to 5,000'];
      task = r.pick(tasks);
      var all = perms(ds).filter(function (p) { return p[0] !== 0; }).map(function (p) { return +p.join(''); });
      var fit;
      if (task === 'largest') ans = Math.max.apply(null, all);
      else if (task === 'smallest') ans = Math.min.apply(null, all);
      else if (task === 'largest even') { fit = all.filter(function (x) { return x % 2 === 0; }); if (!fit.length) return this.make(r, L); ans = Math.max.apply(null, fit); }
      else if (task === 'smallest odd') { fit = all.filter(function (x) { return x % 2 === 1; }); if (!fit.length) return this.make(r, L); ans = Math.min.apply(null, fit); }
      else {
        var best = all.slice().sort(function (a, b) { return Math.abs(a - 5000) - Math.abs(b - 5000); });
        if (Math.abs(best[0] - 5000) === Math.abs(best[1] - 5000)) return this.make(r, L);
        ans = best[0];
      }
      var cards = ds.map(function (d) { return '<span class="card-digit">' + d + '</span>'; }).join('');
      var sol = [];
      if (task === 'largest') sol.push(S('Put the digits in order from biggest to smallest: the biggest digit goes in the thousands.'));
      if (task === 'smallest') sol.push(S('Put the smallest digit first' + (ds.indexOf(0) >= 0 ? ' — but 0 cannot go first, so put the smallest non-zero digit first, then the 0' : '') + '.'));
      if (task === 'largest even') sol.push(S('An even number ends in 0, 2, 4, 6 or 8. Choose the smallest even card for the ones so the bigger digits can go in the bigger places.'));
      if (task === 'smallest odd') sol.push(S('An odd number ends in 1, 3, 5, 7 or 9. Choose the largest odd card for the ones, then make the rest as small as possible (no 0 first).'));
      if (task === 'closest to 5,000') sol.push(S('Try a thousands digit of 4 or 5. With 4 thousands, make the rest as big as possible; with 5 thousands, make the rest as small as possible. Compare how far each is from 5,000.'));
      sol.push(S('The answer is ' + fmt(ans) + '.'));
      return { prompt: name + ' has these digit cards: ' + cards + '<br>Using each card once, what is the <b>' + task + '</b> 4-digit number ' + name + ' can make?', input: { type: 'number', keys: 'digits' },
        check: { kind: 'int', value: ans }, hint: task.indexOf('even') >= 0 ? 'Even numbers end in 0, 2, 4, 6 or 8.' : task.indexOf('odd') >= 0 ? 'Odd numbers end in 1, 3, 5, 7 or 9.' : 'Think about which digit should go in the thousands place.',
        params: { ds: ds, task: task }, solution: sol };
    },
    verify: function (q) {
      // independent check: count up through every 4-digit number and test it uses exactly these cards
      var key = q.params.ds.slice().sort().join(''), t = q.params.task, best = null;
      for (var n = 1000; n <= 9999; n++) {
        if (String(n).split('').sort().join('') !== key) continue;
        if (t === 'largest even' && n % 2) continue;
        if (t === 'smallest odd' && n % 2 === 0) continue;
        if (best === null) best = n;
        else if (t === 'largest' || t === 'largest even') best = Math.max(best, n);
        else if (t === 'smallest' || t === 'smallest odd') best = Math.min(best, n);
        else if (Math.abs(n - 5000) < Math.abs(best - 5000)) best = n;
      }
      return best === q.check.value;
    }
  });

  // ---------- Y4-NPV-09 Roman numerals ----------
  function fromRoman(s) {
    var v = { I: 1, V: 5, X: 10, L: 50, C: 100 }, tot = 0;
    for (var i = 0; i < s.length; i++) { var a = v[s[i]], b = v[s[i + 1]] || 0; tot += a < b ? -a : a; }
    return tot;
  }
  OM.fromRoman = fromRoman;
  OM.registerGen({
    id: 'roman', objective: 'Y4-NPV-09', title: 'Roman numerals',
    make: function (r, L) {
      var n = L === 1 ? r.int(1, 39) : r.int(40, 100);
      if (L === 3) n = r.int(1, 100);
      var rn = OM.toRoman(n);
      var parts = [];
      if (n >= 10) parts.push(OM.toRoman(n - n % 10) + ' = ' + (n - n % 10));
      if (n % 10) parts.push(OM.toRoman(n % 10) + ' = ' + (n % 10));
      if (n === 100) parts = ['C = 100'];
      var sol = [S('I = 1, V = 5, X = 10, L = 50, C = 100. A smaller numeral before a bigger one is subtracted (IV = 4, IX = 9, XL = 40, XC = 90).'),
        S('Split into tens and ones: ' + parts.join(', ') + '.'), S(rn + ' = ' + n + '.')];
      if (L < 3) return { prompt: 'What number is shown by the Roman numerals <b class="roman">' + rn + '</b>?', input: { type: 'number', keys: 'digits' },
        check: { kind: 'int', value: n }, hint: 'Write the value under each letter. Is a smaller one before a bigger one?', params: { n: n, rn: rn }, solution: sol };
      return { prompt: 'Write <b>' + n + '</b> in Roman numerals.', input: { type: 'text', keys: 'roman', placeholder: 'e.g. XIV' },
        check: { kind: 'roman', value: rn }, hint: 'Split ' + n + ' into tens and ones first.', params: { n: n, rn: rn }, solution: sol,
        reject: ['non-standard forms such as IIII for 4 or IL for 49'] };
    },
    verify: function (q) { return fromRoman(q.params.rn) === q.params.n && OM.toRoman(q.params.n) === q.params.rn; }
  });

  // ---------- Column addition / subtraction ----------
  function exchangesAdd(a, b) { var c = 0, n = 0, A = digits(a).reverse(), B = digits(b).reverse(); for (var i = 0; i < Math.max(A.length, B.length); i++) { var s = (A[i] || 0) + (B[i] || 0) + c; c = s >= 10 ? 1 : 0; n += c; } return n; }
  function exchangesSub(a, b) { var br = 0, n = 0, A = digits(a).reverse(), B = digits(b).reverse(); for (var i = 0; i < A.length; i++) { var t = A[i] - br - (B[i] || 0); br = t < 0 ? 1 : 0; n += br; } return n; }
  // Digit-by-digit column algorithms used to verify answers independently of JavaScript's own + and −
  function colAddVerify(a, b) { var A = digits(a).reverse(), B = digits(b).reverse(), c = 0, out = []; for (var i = 0; i < Math.max(A.length, B.length); i++) { var s = (A[i] || 0) + (B[i] || 0) + c; out.unshift(s % 10); c = s >= 10 ? 1 : 0; } if (c) out.unshift(1); return +out.join(''); }
  function colSubVerify(a, b) { var A = digits(a).reverse(), B = digits(b).reverse(), br = 0, out = []; for (var i = 0; i < A.length; i++) { var t = A[i] - br - (B[i] || 0); br = t < 0 ? 1 : 0; out.unshift(t < 0 ? t + 10 : t); } return +out.join(''); }
  OM.colAddVerify = colAddVerify; OM.colSubVerify = colSubVerify;

  OM.registerGen({
    id: 'columnAdd', objective: 'Y4-AS-01', title: 'Column addition',
    make: function (r, L) {
      if (L === 3) {
        var c = r.pick([r.int(40, 99) * 100, r.int(3000, 9999)]), b = r.int(1000, c - 500), ans = c - b, first = r.chance(0.5);
        var tpl = first ? '{0} + ' + fmt(b) + ' = ' + fmt(c) : fmt(b) + ' + {0} = ' + fmt(c);
        return { prompt: 'Find the missing number.', input: { type: 'multi', template: tpl, blanks: [{ keys: 'digits' }] },
          check: { kind: 'multi', parts: [{ kind: 'int', value: ans }] }, answerText: fmt(ans), hint: 'Use the inverse: subtract to find a missing part.', params: { b: b, c: c },
          solution: [S('The missing number + ' + fmt(b) + ' = ' + fmt(c) + ', so the missing number = ' + fmt(c) + ' − ' + fmt(b) + '.')].concat(V.columnFrames(c, b, '−').slice(-1).map(function (f) { return S(f.text, f.html); })).concat([S('Check: ' + fmt(ans) + ' + ' + fmt(b) + ' = ' + fmt(c) + ' ✓')]) };
      }
      var a, bb, tries = 0;
      do {
        a = r.int(1000, 8999); bb = L === 1 ? r.int(100, 999) : r.int(1000, 8999); tries++;
      } while ((a + bb > 9999 || (L === 1 ? exchangesAdd(a, bb) !== 1 : exchangesAdd(a, bb) < 2)) && tries < 500);
      var frames = V.columnFrames(a, bb, '+');
      return { prompt: 'Use column addition to work out <b>' + fmt(a) + ' + ' + fmt(bb) + '</b>.', input: { type: 'column', a: a, b: bb, op: '+' },
        check: { kind: 'int', value: a + bb }, hint: 'Start with the ones. If a column makes 10 or more, exchange.', params: { a: a, b: bb },
        solution: frames.map(function (f) { return S(f.text, f.html); }) };
    },
    verify: function (q) { var p = q.params; return p.c !== undefined ? q.check.parts[0].value + p.b === p.c : colAddVerify(p.a, p.b) === q.check.value; },
    constraints: function (q) { var v = q.check.value || q.params.c; return v > 9999 ? ['answer has more than 4 digits'] : []; }
  });

  OM.registerGen({
    id: 'columnSub', objective: 'Y4-AS-01', title: 'Column subtraction',
    make: function (r, L) {
      var a, b, tries = 0;
      do {
        tries++;
        if (L === 1) { a = r.int(1000, 9999); b = r.int(100, 999); if (exchangesSub(a, b) !== 1) continue; }
        else if (L === 2) { a = r.int(2000, 9999); b = r.int(1000, a - 100); if (exchangesSub(a, b) < 2) continue; }
        else { a = r.int(2, 9) * 1000 + r.pick([0, 0, r.int(1, 9) * 10, r.int(1, 9)]); b = r.int(100, a - 50); if (exchangesSub(a, b) < 2) continue; }
        break;
      } while (tries < 500);
      var frames = V.columnFrames(a, b, '−');
      return { prompt: 'Use column subtraction to work out <b>' + fmt(a) + ' − ' + fmt(b) + '</b>.', input: { type: 'column', a: a, b: b, op: '−' },
        check: { kind: 'int', value: a - b }, hint: 'Start with the ones. If the top digit is smaller, exchange from the next column.', params: { a: a, b: b },
        solution: frames.map(function (f) { return S(f.text, f.html); }).concat([S('Check with the inverse: ' + fmt(a - b) + ' + ' + fmt(b) + ' = ' + fmt(a) + ' ✓')]) };
    },
    verify: function (q) { return colSubVerify(q.params.a, q.params.b) === q.check.value && q.check.value > 0; }
  });

  // ---------- Y4-AS-02 estimate and inverse ----------
  OM.registerGen({
    id: 'estimateInverse', objective: 'Y4-AS-02', title: 'Estimate and check',
    make: function (r, L) {
      var a, b, add = r.chance(0.5);
      if (L === 1) {
        var p = r.pick([100, 100, 1000]);
        do { a = add ? r.int(1100, 7900) : r.int(3000, 9800); b = r.int(1100, add ? 9800 - a : a - 1000); } while (a % p * 2 === p || b % p * 2 === p);
        var ra = roundTo(a, p), rb = roundTo(b, p), est = add ? ra + rb : ra - rb;
        return { prompt: 'Round each number to the nearest ' + fmt(p) + ' to <b>estimate</b> ' + fmt(a) + ' ' + (add ? '+' : '−') + ' ' + fmt(b) + '.', input: { type: 'number', keys: 'digits' },
          check: { kind: 'int', value: est }, hint: 'Round first, then calculate.', params: { a: a, b: b, p: p, add: add },
          solution: [S(fmt(a) + ' rounds to ' + fmt(ra) + '. ' + fmt(b) + ' rounds to ' + fmt(rb) + '.'), S('Estimate: ' + fmt(ra) + ' ' + (add ? '+' : '−') + ' ' + fmt(rb) + ' = ' + fmt(est) + '.')] };
      }
      a = r.int(2000, 8999); b = r.int(1000, add ? 9999 - a : a - 500);
      var c = add ? a + b : a - b;
      if (L === 2) {
        var opts = add ? [[fmt(c) + ' − ' + fmt(b), true], [fmt(c) + ' + ' + fmt(b), false], [fmt(a) + ' − ' + fmt(b), false], [fmt(c) + ' + ' + fmt(a), false]]
          : [[fmt(c) + ' + ' + fmt(b), true], [fmt(c) + ' − ' + fmt(b), false], [fmt(a) + ' + ' + fmt(b), false], [fmt(c) + ' + ' + fmt(a), false]];
        var sh = r.shuffle(opts.map(function (o, i) { return { value: 'o' + i, label: o[0], ok: o[1] }; }));
        var right = sh.filter(function (o) { return o.ok; })[0];
        return { prompt: 'Which calculation could you use to <b>check</b> that ' + fmt(a) + ' ' + (add ? '+' : '−') + ' ' + fmt(b) + ' = ' + fmt(c) + '?', input: { type: 'choice', options: sh.map(function (o) { return { value: o.value, label: o.label }; }) },
          check: { kind: 'choice', value: right.value, label: right.label }, hint: 'Use the inverse (opposite) operation.', params: { a: a, b: b, c: c, add: add, right: right.label },
          solution: [S((add ? 'Subtraction is the inverse of addition. If ' + fmt(a) + ' + ' + fmt(b) + ' = ' + fmt(c) + ', then ' + fmt(c) + ' − ' + fmt(b) + ' should be ' + fmt(a) + '.' : 'Addition is the inverse of subtraction. If ' + fmt(a) + ' − ' + fmt(b) + ' = ' + fmt(c) + ', then ' + fmt(c) + ' + ' + fmt(b) + ' should be ' + fmt(a) + '.')),
            S('So the check is ' + right.label + '.')] };
      }
      var name = r.pick(OM.NAMES), kind = r.int(0, 2), claim = kind === 0 ? c : kind === 1 ? c + 1000 : c - 1000;
      if (claim < 0) { kind = 1; claim = c + 1000; }
      if (claim > 9999) { kind = 2; claim = c - 1000; }
      var lab = ['Yes, it is about right', 'No, it is too big', 'No, it is too small'];
      var ra2 = roundTo(a, 1000), rb2 = roundTo(b, 1000), est2 = add ? ra2 + rb2 : ra2 - rb2;
      var ra3 = roundTo(a, 100), rb3 = roundTo(b, 100), est3 = add ? ra3 + rb3 : ra3 - rb3;
      return { prompt: name + ' says that ' + fmt(a) + ' ' + (add ? '+' : '−') + ' ' + fmt(b) + ' = ' + fmt(claim) + '. Use <b>estimation</b> to decide if this is sensible.', input: { type: 'choice', options: lab.map(function (l, i) { return { value: String(i), label: l }; }) },
        check: { kind: 'choice', value: String(kind), label: lab[kind] }, hint: 'Round both numbers to the nearest 100 and work out an estimate.', params: { a: a, b: b, c: c, claim: claim, add: add },
        solution: [S('Round to the nearest 100: ' + fmt(ra3) + ' ' + (add ? '+' : '−') + ' ' + fmt(rb3) + ' = ' + fmt(est3) + '.'), S(fmt(claim) + (kind === 0 ? ' is close to the estimate, so it is sensible.' : kind === 1 ? ' is about 1,000 more than the estimate: too big.' : ' is about 1,000 less than the estimate: too small.'))] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.p) return q.check.value === (p.add ? Math.round(p.a / p.p) * p.p + Math.round(p.b / p.p) * p.p : Math.round(p.a / p.p) * p.p - Math.round(p.b / p.p) * p.p);
      if (p.right) { var nums = p.right.replace(/,/g, '').split(/ [+−] /).map(Number), op = p.right.indexOf('+') >= 0 ? '+' : '−'; return (op === '+' ? nums[0] + nums[1] : nums[0] - nums[1]) === p.a && (p.add ? p.a + p.b : p.a - p.b) === p.c; }
      var trueC = p.add ? p.a + p.b : p.a - p.b, diff = p.claim - trueC;
      return (diff === 0 && q.check.value === '0') || (diff === 1000 && q.check.value === '1') || (diff === -1000 && q.check.value === '2');
    }
  });

  // ---------- Y4-AS-03 two-step problems (2 marks, method mark available) ----------
  OM.registerGen({
    id: 'asTwoStep', objective: 'Y4-AS-03', title: 'Two-step problems',
    make: function (r, L) {
      var lo = L === 1 ? 100 : 1000, hi = L === 1 ? 999 : 4999, name = r.pick(OM.NAMES), t = r.int(0, L === 3 ? 3 : 2);
      var a, b, c, ans, text, plans, ex, tries = 0;
      do {
        tries++;
        a = r.int(lo, hi); b = r.int(lo, hi); c = r.int(Math.floor(lo / 2), hi);
        if (t === 0) { ans = a + b - c; text = 'A forest library has ' + fmt(a) + ' books. ' + fmt(b) + ' new books arrive. Then ' + fmt(c) + ' books are taken out by readers. How many books are in the library now?';
          plans = [[{ op: '+', a: { g: a }, b: { g: b } }, { op: '-', a: { s: 0 }, b: { g: c } }], [{ op: '-', a: { g: a }, b: { g: c } }, { op: '+', a: { s: 0 }, b: { g: b } }]];
          ex = [fmt(a) + ' + ' + fmt(b) + ' = ' + fmt(a + b), fmt(a + b) + ' − ' + fmt(c) + ' = ' + fmt(ans)]; }
        else if (t === 1) { a = L === 1 ? r.int(500, 999) : r.int(lo * 3, Math.min(9999, hi * 3)); ans = a - b - c; text = name + ' has ' + fmt(a) + ' points in a game. ' + name + ' spends ' + fmt(b) + ' points on a hat and ' + fmt(c) + ' points on a scarf. How many points are left?';
          plans = [[{ op: '-', a: { g: a }, b: { g: b } }, { op: '-', a: { s: 0 }, b: { g: c } }], [{ op: '+', a: { g: b }, b: { g: c } }, { op: '-', a: { g: a }, b: { s: 0 } }], [{ op: '-', a: { g: a }, b: { g: c } }, { op: '-', a: { s: 0 }, b: { g: b } }]];
          ex = [fmt(a) + ' − ' + fmt(b) + ' = ' + fmt(a - b), fmt(a - b) + ' − ' + fmt(c) + ' = ' + fmt(ans)]; }
        else if (t === 2) { ans = a - c + b; text = 'A train has ' + fmt(a) + ' passengers. At the station, ' + fmt(c) + ' passengers get off and ' + fmt(b) + ' get on. How many passengers are on the train now?';
          plans = [[{ op: '-', a: { g: a }, b: { g: c } }, { op: '+', a: { s: 0 }, b: { g: b } }], [{ op: '+', a: { g: a }, b: { g: b } }, { op: '-', a: { s: 0 }, b: { g: c } }]];
          ex = [fmt(a) + ' − ' + fmt(c) + ' = ' + fmt(a - c), fmt(a - c) + ' + ' + fmt(b) + ' = ' + fmt(ans)]; }
        else { c = r.int(lo * 2, Math.min(9999, hi * 2)); ans = a + b - c; text = 'Team Owl collected ' + fmt(a) + ' acorns on Monday and ' + fmt(b) + ' acorns on Tuesday. Team Fox collected ' + fmt(c) + ' acorns altogether. How many more acorns did Team Owl collect than Team Fox?';
          plans = [[{ op: '+', a: { g: a }, b: { g: b } }, { op: '-', a: { s: 0 }, b: { g: c } }]];
          ex = [fmt(a) + ' + ' + fmt(b) + ' = ' + fmt(a + b), fmt(a + b) + ' − ' + fmt(c) + ' = ' + fmt(ans)]; }
      } while ((ans <= 0 || ans > 9999 || a > 9999 || a + b > 9999 || (t === 2 && a - c <= 0) || (t === 1 && a - b <= 0)) && tries < 500);
      return { prompt: text, marks: 2, input: { type: 'working', keys: 'working' },
        check: { kind: 'working', final: { kind: 'int', value: ans }, plans: plans, plan: plans[0], exampleLines: ex },
        hint: 'What do you need to work out first? Write each step in a working box.', params: { a: a, b: b, c: c, t: t },
        solution: [S('Step 1: ' + ex[0] + '.'), S('Step 2: ' + ex[1] + '.'), S('Answer: ' + fmt(ans) + '. Check with an estimate: is it sensible?')] };
    },
    verify: function (q) {
      var p = q.params, v = q.check.final.value;
      var expect = p.t === 0 ? p.a + p.b - p.c : p.t === 1 ? p.a - p.b - p.c : p.t === 2 ? p.a - p.c + p.b : p.a + p.b - p.c;
      // every listed method must reach the same answer
      var plansOk = q.check.plans.every(function (plan) {
        var vals = [];
        plan.forEach(function (st) { var x = st.a.s !== undefined ? vals[st.a.s] : st.a.g, y = st.b.s !== undefined ? vals[st.b.s] : st.b.g; vals.push(st.op === '+' ? x + y : x - y); });
        return vals[vals.length - 1] === v;
      });
      return v === expect && plansOk && v > 0;
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
