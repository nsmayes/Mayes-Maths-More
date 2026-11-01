/* Mayes Maths & More — Pip's Trick Box: mental maths shortcuts, e.g. "× 19 is × 20, then take away one lot".
   Its own section (like the 11+ Training Camp), open to every year: each trick has a "from" year and is shown
   from that year on. Every trick has lesson slides with a looping animation of the trick, practice at three levels
   whose worked solutions use the trick, and an independent check of every answer. A speed round mixes them. */
(function (G) {
  'use strict';
  var OM = G.OM, V = OM.V, K = OM.kit, C = V.colors, fmt = OM.fmt;

  // ---------- the animation: the sum, then each step of the trick appearing in turn ----------
  function r3(x) { return Math.round(x * 1000) / 1000; }
  function tl(T, pts) {
    if (pts[pts.length - 1][0] < T) pts.push([T, pts[pts.length - 1][1]]);
    return ' dur="' + T + 's" repeatCount="indefinite" keyTimes="' + pts.map(function (p) { return r3(Math.min(1, p[0] / T)); }).join(';') + '" values="' + pts.map(function (p) { return p[1]; }).join(';') + '"';
  }
  function show(T, t0, body) { return '<g opacity="0"><animate attributeName="opacity"' + tl(T, [[0, 0], [t0, 0], [t0 + 0.3, 1], [T - 0.6, 1], [T - 0.3, 0]]) + '/>' + body + '</g>'; }
  // problem: '34 × 19'; steps: [[note, line], ...] where note says what the step does and line is the result
  function flow(problem, steps, title) {
    var T = 1.4 + steps.length * 1.8 + 2.6, top = title ? 34 : 10, b = '', X = 200;
    if (title) b += V.t(260, 16, title, { size: 14, fill: C.soft });
    b += V.t(X, top + 26, problem, { size: 28, weight: 'bold', fill: C.sky });
    steps.forEach(function (s, k) {
      var y = top + 48 + k * 74, last = k === steps.length - 1;
      b += show(T, 1 + k * 1.8, V.line(X, y + 4, X, y + 30, { w: 2.5, stroke: C.berry }) + '<polygon points="' + (X - 6) + ',' + (y + 26) + ' ' + (X + 6) + ',' + (y + 26) + ' ' + X + ',' + (y + 34) + '" fill="' + C.berry + '"/>' +
        V.t(X + 16, y + 19, s[0], { size: 15, fill: C.berry, anchor: 'start' }));
      b += show(T, 1.6 + k * 1.8, V.t(X, y + 54, s[1], { size: last ? 26 : 23, weight: last ? 'bold' : 'normal', fill: last ? C.leaf : C.ink }));
    });
    return V.svg(520, top + 52 + steps.length * 74, b);
  }
  OM.trickFlow = flow;

  var x = ' × ', pl = ' + ', mi = ' − ';
  function sol(lines) { return lines.map(function (s) { return K.S(s); }); }
  function dsum(n) { return String(n).split('').reduce(function (a, d) { return a + +d; }, 0); }
  // exact decimals for money and percentages: work in whole numbers of thousandths
  function dstr(thousandths) { var s = (thousandths / 1000).toFixed(3).replace(/\.?0+$/, ''); return s; }

  // ---------- the tricks ----------
  // each: id, from (first school year), title, statement (what the trick is), vocab, say (lesson slides),
  // demo [caption, fn], method, mistakes, make(r, L), verify(q)
  var TRICKS = [
    { id: 'TR-01', from: 1, title: 'Near doubles', statement: 'Add two numbers next to each other by doubling and adding 1',
      vocab: ['double', 'near double', 'one more'],
      say: ['If you know your doubles, you know lots more facts for free. 6 + 7 is a <b>near double</b>: the numbers are next to each other.', 'Double the smaller number, then add 1. Double 6 is 12, and one more is 13.'],
      demo: ['Watch: 6 + 7 is double 6, and one more.', function () { return flow('6 + 7', [['double 6', '6 + 6 = 12'], ['add the extra 1', '12 + 1 = 13']]); }],
      method: ['Spot that the numbers are next to each other.', 'Double the smaller one.', 'Add 1.'], mistakes: ['Doubling the bigger number and still adding 1.', 'Forgetting to add the extra 1.'],
      make: function (r, L) {
        var s = L === 1 ? r.int(1, 5) : L === 2 ? r.int(5, 9) : r.int(10, 40), sw = r.chance(0.5), a = sw ? s + 1 : s, b = sw ? s : s + 1;
        return K.int('Use a <b>near double</b> to work out <b>' + a + pl + b + '</b>.', a + b, { hint: 'Double the smaller number, ' + s + ', then add 1.', params: { a: a, b: b },
          sol: sol([a + ' and ' + b + ' are next to each other, so this is a near double.', 'Double ' + s + ' is ' + 2 * s + '.', 'Add the extra 1: ' + 2 * s + ' + 1 = ' + (2 * s + 1) + '.']) });
      },
      verify: function (q) { var p = q.params; return Math.abs(p.a - p.b) === 1 && q.check.value === p.a + p.b; } },

    { id: 'TR-02', from: 1, title: 'Make ten first', statement: 'Add by making the next ten first, then adding what is left',
      vocab: ['number bond', 'make ten', 'split'],
      say: ['Tens are easy to add to. So when a sum goes past ten, <b>make ten first</b>.', '8 + 5: 8 needs 2 more to make 10. Split 5 into 2 and 3. 8 + 2 = 10, then 10 + 3 = 13.'],
      demo: ['Watch: 8 + 5. Make ten first.', function () { return flow('8 + 5', [['split 5 into 2 and 3', '8 + 2 + 3'], ['8 + 2 makes ten', '10 + 3'], ['add what is left', '13']]); }],
      method: ['How many more to make the next ten?', 'Split the other number into that and the rest.', 'Make the ten, then add the rest.'], mistakes: ['Splitting the number the wrong way.', 'Forgetting to add the rest after making ten.'],
      make: function (r, L) {
        var a = L === 1 ? 9 : L === 2 ? r.int(6, 8) : r.int(1, 8) * 10 + r.int(7, 9), u = a % 10, b = r.int(11 - u, 9), need = 10 - u, sum = a + b;
        return K.int('Make ten first to work out <b>' + a + pl + b + '</b>.', sum, { hint: a + ' needs ' + need + ' more to make ' + (a + need) + '. Take ' + need + ' from ' + b + '.', params: { a: a, b: b },
          sol: sol([a + ' needs ' + need + ' more to make ' + (a + need) + '.', 'Split ' + b + ' into ' + need + ' and ' + (b - need) + '.', a + pl + need + ' = ' + (a + need) + ', then ' + (a + need) + pl + (b - need) + ' = ' + sum + '.']) });
      },
      verify: function (q) { var p = q.params; return (p.a % 10) + p.b >= 10 && q.check.value === p.a + p.b; } },

    { id: 'TR-03', from: 2, title: 'Adding and taking away 9, 11, 19 and 21', statement: 'Add or subtract a number near a multiple of 10 by using the 10, then adjusting by 1',
      vocab: ['round', 'adjust', 'one too many'],
      say: ['Adding 9 is fiddly, but adding 10 is easy. So <b>add 10, then take away 1</b>: 47 + 9 = 57 − 1 = 56.', 'Adding 11? Add 10, then 1 more. Taking away 9? Take away 10, then add 1 back, because you took away one too many.'],
      demo: ['Watch: 47 + 9. Add 10, then take 1 off.', function () { return flow('47 + 9', [['add 10 instead', '47 + 10 = 57'], ['that was 1 too many: take 1 off', '57 − 1 = 56']]); }],
      method: ['Use the nearest 10 or 20 instead.', 'Add or take away that.', 'Adjust by 1 in the right direction.'], mistakes: ['Adjusting the wrong way when taking away (take away 9: take away 10, then ADD 1).', 'Forgetting to adjust at all.'],
      make: function (r, L) {
        var d = L === 1 ? r.pick([9, 11]) : L === 2 ? r.pick([9, 11]) : r.pick([19, 21]), sub = L === 2 || (L === 3 && r.chance(0.5)), k = Math.round(d / 10) * 10, adj = d - k;
        var a = L === 1 ? r.int(20, 88) : L === 2 ? r.int(30, 99) : sub ? r.int(40, 160) : r.int(40, 170), ans = sub ? a - d : a + d, mid = sub ? a - k : a + k;
        var lines = sub ? [a + mi + k + ' = ' + mid + '.', adj < 0 ? 'You took away 1 too many, so add 1 back: ' + mid + ' + 1 = ' + ans + '.' : 'You need to take away 1 more: ' + mid + ' − 1 = ' + ans + '.']
          : [a + pl + k + ' = ' + mid + '.', adj < 0 ? 'That was 1 too many, so take 1 off: ' + mid + ' − 1 = ' + ans + '.' : 'Add the extra 1: ' + mid + ' + 1 = ' + ans + '.'];
        return K.int('Work out <b>' + a + (sub ? mi : pl) + d + '</b> in your head.', ans, { hint: (sub ? 'Take away ' : 'Add ') + k + ', then adjust by 1.', params: { a: a, d: d, sub: sub },
          sol: sol([d + ' is ' + (adj < 0 ? 'one less than ' : 'one more than ') + k + ', so use ' + k + ' first.'].concat(lines)) });
      },
      verify: function (q) { var p = q.params; return q.check.value === (p.sub ? p.a - p.d : p.a + p.d); } },

    { id: 'TR-04', from: 3, title: 'Times 10 and 100: add zeros', statement: 'Multiply whole numbers by 10 or 100 by putting zeros on the end, and know why it does not work for decimals',
      vocab: ['place value', 'digit', 'placeholder'],
      say: ['Here is a quick trick: when you <b>multiply a whole number by 10, just add a zero on the end</b>. 36 × 10 = 360. Times 100? Add two zeros: 7 × 100 = 700.', 'Why it works: every digit moves one place to the left, and the zero fills the empty ones place.', 'Careful! For a <b>decimal</b>, adding a zero changes nothing: 4.5 and 4.50 are the same. So with decimals, move the digits instead: 4.5 × 10 = 45.'],
      demo: ['Watch: 4.5 × 10. The digits move one place left.', function () { return OM.demo && OM.demo.slideDigits ? OM.demo.slideDigits('4.5', 1, 'mul') : flow('4.5 × 10', [['every digit moves one place left', '45']]); }],
      method: ['Whole number × 10: put one zero on the end.', 'Whole number × 100: put two zeros on the end.', 'Decimals: move every digit, do not just add a zero.'], mistakes: ['Writing 4.5 × 10 = 4.50.', 'Adding a zero when dividing instead of taking one off.'],
      make: function (r, L) {
        var kind = L === 1 ? 'm10' : L === 2 ? r.pick(['m100', 'd10']) : r.pick(['dec10', 'dec100', 'decd']);
        if (kind === 'm10') { var n = r.int(2, 99); return K.int('Work out <b>' + n + ' × 10</b>.', n * 10, { hint: 'For a whole number, just put a zero on the end.', params: { n: n, k: 'm10' }, sol: sol(['Multiplying by 10 moves every digit one place to the left, and a zero fills the ones place.', 'So put a zero on the end: ' + n + ' × 10 = ' + n * 10 + '.']) }); }
        if (kind === 'm100') { var m = r.int(2, 9); return K.int('Work out <b>' + m + ' × 100</b>.', m * 100, { hint: 'Times 100: put two zeros on the end.', params: { n: m, k: 'm100' }, sol: sol(['Multiplying by 100 moves every digit two places to the left.', 'So put two zeros on the end: ' + m + ' × 100 = ' + m * 100 + '.']) }); }
        if (kind === 'd10') { var w = r.int(2, 99); return K.int('Work out <b>' + w * 10 + ' ÷ 10</b>.', w, { hint: 'Dividing by 10 is the opposite: take the zero off the end.', params: { n: w * 10, k: 'd10' }, sol: sol(['Dividing by 10 moves every digit one place to the right.', 'So take the zero off the end: ' + w * 10 + ' ÷ 10 = ' + w + '.']) }); }
        var t = r.int(11, 99); if (t % 10 === 0) t++;
        var s = (t / 10).toFixed(1);
        if (kind === 'dec10') return K.int('Work out <b>' + s + ' × 10</b>.', t, { hint: 'This is a decimal: adding a zero does not work. Move every digit one place left.', params: { tenths: t, k: 'dec10' }, sol: sol(['Careful: ' + s + '0 is still ' + s + ', so "add a zero" does not work for decimals.', 'Move every digit one place to the left: ' + s + ' × 10 = ' + t + '.']) });
        if (kind === 'dec100') return K.int('Work out <b>' + s + ' × 100</b>.', t * 10, { hint: 'Move every digit two places to the left.', params: { tenths: t, k: 'dec100' }, sol: sol(['This is a decimal, so move the digits rather than adding zeros.', 'Two places to the left: ' + s + ' × 100 = ' + t * 10 + '.']) });
        return K.dec('Work out <b>' + t + ' ÷ 10</b>.', s, { hint: 'Every digit moves one place to the right. There is no zero to take off.', params: { tenths: t, k: 'decd' }, sol: sol(['There is no zero on the end to take off, so move every digit one place to the right.', t + ' ÷ 10 = ' + s + '.']) });
      },
      verify: function (q) {
        var p = q.params, v = q.check.value;
        switch (p.k) {
          case 'm10': return v === p.n * 10;
          case 'm100': return v === p.n * 100;
          case 'd10': return v * 10 === p.n;
          case 'dec10': return v === p.tenths;
          case 'dec100': return v === p.tenths * 10;
          default: return Math.round(parseFloat(v) * 10) === p.tenths;
        }
      } },

    { id: 'TR-05', from: 3, title: 'Double, double again', statement: 'Multiply by 2, 4 and 8 by doubling',
      vocab: ['double', 'times 4', 'times 8'],
      say: ['<b>Times 4 is double, then double again.</b> 23 × 4: double 23 is 46, double 46 is 92.', 'Times 8? Double three times. To double a big number, double the tens and the ones separately: double 36 = 60 + 12 = 72.'],
      demo: ['Watch: 23 × 4 is double, double again.', function () { return flow('23 × 4', [['double it', '23 × 2 = 46'], ['double again', '46 × 2 = 92']]); }],
      method: ['× 2: double once. × 4: double twice. × 8: double three times.', 'Double the tens and the ones separately, then add.'], mistakes: ['Doubling only twice for × 8.', 'Doubling the tens but forgetting the ones.'],
      make: function (r, L) {
        var n = L === 1 ? r.int(13, 49) : L === 2 ? r.int(12, 60) : r.int(11, 99), times = L === 1 ? 2 : L === 2 ? 4 : 8, lines = [], v = n;
        if (L === 1) { var tn = n - n % 10; lines = ['Double the tens: double ' + tn + ' is ' + 2 * tn + '.', 'Double the ones: double ' + n % 10 + ' is ' + 2 * (n % 10) + '.', 'Add: ' + 2 * tn + pl + 2 * (n % 10) + ' = ' + 2 * n + '.']; }
        else { for (var k = 0; k < (L === 2 ? 2 : 3); k++) { lines.push((k ? 'Double again: ' : 'Double: ') + v + ' × 2 = ' + v * 2 + '.'); v *= 2; } }
        return K.int(L === 1 ? 'Double <b>' + n + '</b>.' : 'Work out <b>' + n + x + times + '</b> by doubling.', n * times, { hint: L === 1 ? 'Double the tens and the ones separately.' : '× ' + times + ' means double ' + (L === 2 ? 'twice' : 'three times') + '.', params: { n: n, t: times }, sol: sol(lines) });
      },
      verify: function (q) { var p = q.params, v = 0; for (var i = 0; i < p.t; i++) v += p.n; return q.check.value === v; } },

    { id: 'TR-06', from: 4, title: 'Times 5 and divide by 5', statement: 'Multiply by 5 by multiplying by 10 and halving; divide by 5 by doubling and dividing by 10',
      vocab: ['halve', 'double', 'times 10'],
      say: ['5 is half of 10. So <b>to multiply by 5, multiply by 10 and then halve</b>. 46 × 5: 460, half of 460 is 230.', 'To <b>divide by 5</b>, do it the other way: double, then divide by 10. 340 ÷ 5: double is 680, ÷ 10 is 68.'],
      demo: ['Watch: 46 × 5 is half of 46 × 10.', function () { return flow('46 × 5', [['times 10', '46 × 10 = 460'], ['halve it', '460 ÷ 2 = 230']]); }],
      method: ['× 5: × 10, then halve.', '÷ 5: double, then ÷ 10.'], mistakes: ['Halving when dividing by 5 (that is ÷ 10 × 2, the wrong way round).', 'Forgetting to halve after × 10.'],
      make: function (r, L) {
        if (L === 3) { var k = r.int(12, 199), m = k * 5; return K.int('Work out <b>' + fmt(m) + ' ÷ 5</b>.', k, { hint: 'Double it, then divide by 10.', params: { m: m, div: true }, sol: sol(['Dividing by 5 is the same as doubling and dividing by 10.', 'Double: ' + fmt(m) + ' × 2 = ' + fmt(2 * m) + '.', '÷ 10: ' + fmt(2 * m) + ' ÷ 10 = ' + k + '.']) }); }
        var n = L === 1 ? r.int(6, 49) * 2 : r.int(13, 199);
        return K.int('Work out <b>' + n + ' × 5</b>.', n * 5, { hint: 'Multiply by 10, then halve.', params: { n: n }, sol: sol(['× 5 is half of × 10.', n + ' × 10 = ' + fmt(n * 10) + '.', 'Halve it: ' + fmt(n * 10) + ' ÷ 2 = ' + fmt(n * 5) + '.']) });
      },
      verify: function (q) { var p = q.params; return p.div ? q.check.value * 5 === p.m : q.check.value === p.n * 5; } },

    { id: 'TR-07', from: 4, title: 'Times 9 and times 11', statement: 'Multiply by 9 or 11 by multiplying by 10 and taking away or adding one lot',
      vocab: ['one lot', 'times 10', 'adjust'],
      say: ['9 lots is one lot less than 10 lots. So <b>to multiply by 9, multiply by 10, then take away one lot</b>. 34 × 9: 340 − 34 = 306.', 'Times 11 is one lot more than times 10: 34 × 11 = 340 + 34 = 374.'],
      demo: ['Watch: 34 × 9. Times 10, then take away one 34.', function () { return flow('34 × 9', [['times 10', '34 × 10 = 340'], ['9 lots is one lot less: take away 34', '340 − 34 = 306']]); }],
      method: ['Multiply by 10.', '× 9: take away one lot. × 11: add one lot.'], mistakes: ['Taking away 1 instead of one lot (340 − 1).', 'Adding when it should be taking away.'],
      make: function (r, L) {
        var mul = L === 1 ? 9 : L === 2 ? 11 : r.pick([9, 11]), n = L === 3 ? r.int(101, 900) : r.int(12, L === 1 ? 60 : 90), ten = n * 10, ans = n * mul;
        return K.int('Work out <b>' + n + x + mul + '</b> in your head.', ans, { hint: 'Multiply by 10, then ' + (mul === 9 ? 'take away' : 'add') + ' one lot of ' + n + '.', params: { n: n, m: mul },
          sol: sol([n + ' × 10 = ' + fmt(ten) + '.', mul + ' lots is one lot ' + (mul === 9 ? 'less' : 'more') + ' than 10 lots, so ' + (mul === 9 ? 'take away' : 'add') + ' one ' + n + '.', fmt(ten) + (mul === 9 ? mi : pl) + n + ' = ' + fmt(ans) + '.']) });
      },
      verify: function (q) { var p = q.params; return q.check.value === p.n * p.m; } },

    { id: 'TR-08', from: 5, title: 'Times 19, 21, 99 and friends', statement: 'Multiply by a number one away from a multiple of 10 or 100: use the round number, then add or take away one lot',
      vocab: ['round number', 'one lot', 'adjust'],
      say: ['To multiply by 19, think of it as 20 lots, take away one lot. <b>Multiply by 10, then by 2, then take away one of the number.</b>', '23 × 19: 23 × 10 = 230, × 2 = 460, then 460 − 23 = 437. Times 21? Add one lot instead: 460 + 23 = 483.', 'It works for 29, 31, 39, 41, 99 and 101 too: 47 × 99 = 4,700 − 47 = 4,653.'],
      demo: ['Watch: 23 × 19. Times 10, times 2, then take away one 23.', function () { return flow('23 × 19', [['times 10', '23 × 10 = 230'], ['times 2 makes × 20', '230 × 2 = 460'], ['19 lots is one lot less: take away 23', '460 − 23 = 437']]); }],
      method: ['Find the round number next to it (19 → 20, 99 → 100).', 'Multiply by the round number (× 10, then × 2 for 20).', 'Take away one lot (for 19, 29, 99) or add one lot (for 21, 31, 101).'], mistakes: ['Taking away 1 instead of one lot of the number.', 'Adding when the multiplier is below the round number.'],
      make: function (r, L) {
        var mul = L === 1 ? r.pick([19, 21]) : L === 2 ? r.pick([29, 31, 39, 41]) : r.pick([99, 101]), base = Math.round(mul / 10) * 10, n = L === 3 ? r.int(12, 999) : r.int(12, L === 1 ? 60 : 99);
        var up = mul > base, ans = n * mul, lines = [];
        if (base === 100) lines.push(n + ' × 100 = ' + fmt(n * 100) + '.');
        else lines.push(n + ' × 10 = ' + fmt(n * 10) + '.', 'Times ' + base / 10 + ' to make × ' + base + ': ' + fmt(n * 10) + x + base / 10 + ' = ' + fmt(n * base) + '.');
        lines.push(mul + ' lots is one lot ' + (up ? 'more' : 'less') + ' than ' + base + ' lots: ' + fmt(n * base) + (up ? pl : mi) + n + ' = ' + fmt(ans) + '.');
        return K.int('Work out <b>' + n + x + mul + '</b> without writing a long multiplication.', ans, { hint: 'Multiply by ' + base + ', then ' + (up ? 'add' : 'take away') + ' one lot of ' + n + '.', params: { n: n, m: mul }, sol: sol(lines) });
      },
      verify: function (q) { var p = q.params, v = 0; for (var i = 0; i < p.m; i++) v += p.n; return q.check.value === v; } },

    { id: 'TR-09', from: 5, title: 'Times 50 and times 25', statement: 'Multiply by 50 by multiplying by 100 and halving; multiply by 25 by multiplying by 100 and halving twice',
      vocab: ['halve', 'quarter', 'times 100'],
      say: ['50 is half of 100, so <b>× 50 is × 100, then halve</b>. 36 × 50: 3,600, halved is 1,800.', '25 is a quarter of 100, so <b>× 25 is × 100, then halve and halve again</b>. 36 × 25: 3,600 → 1,800 → 900.'],
      demo: ['Watch: 36 × 25 is a quarter of 36 × 100.', function () { return flow('36 × 25', [['times 100', '36 × 100 = 3,600'], ['halve', '3,600 ÷ 2 = 1,800'], ['halve again', '1,800 ÷ 2 = 900']]); }],
      method: ['Multiply by 100.', '× 50: halve once. × 25: halve twice.'], mistakes: ['Halving only once for × 25.', 'Multiplying by 10 instead of 100.'],
      make: function (r, L) {
        var mul = L === 1 ? 50 : 25, n = L === 1 ? r.int(12, 198) : L === 2 ? r.int(4, 100) * 4 : r.int(13, 399), h = n * 100, lines = [n + ' × 100 = ' + fmt(h) + '.', 'Halve: ' + fmt(h) + ' ÷ 2 = ' + fmt(h / 2) + '.'];
        if (mul === 25) lines.push('Halve again: ' + fmt(h / 2) + ' ÷ 2 = ' + fmt(h / 4) + '.');
        return K.int('Work out <b>' + n + x + mul + '</b>.', n * mul, { hint: 'Multiply by 100, then halve' + (mul === 25 ? ' twice' : '') + '.', params: { n: n, m: mul }, sol: sol(lines) });
      },
      verify: function (q) { var p = q.params; return q.check.value === p.n * p.m; } },

    { id: 'TR-10', from: 3, title: 'Split it up to multiply', statement: 'Multiply by splitting a number into tens and ones, multiplying each part and adding',
      vocab: ['partition', 'tens', 'ones'],
      say: ['Big numbers are easier in pieces. 7 × 34: <b>split 34 into 30 and 4</b>.', '7 × 30 = 210 and 7 × 4 = 28. Add them: 210 + 28 = 238.'],
      demo: ['Watch: 7 × 34. Split 34 into 30 and 4.', function () { return flow('7 × 34', [['split 34 into 30 and 4', '7 × 30 and 7 × 4'], ['multiply each part', '210 and 28'], ['add the parts', '210 + 28 = 238']]); }],
      method: ['Split the bigger number into hundreds, tens and ones.', 'Multiply each part.', 'Add the answers.'], mistakes: ['Multiplying only the tens.', 'Writing 7 × 30 as 21.'],
      make: function (r, L) {
        var a = L === 1 ? r.int(12, 49) : L === 2 ? r.int(12, 99) : r.int(101, 333), b = L === 1 ? r.int(2, 5) : L === 2 ? r.int(6, 9) : r.int(2, 3);
        var parts = []; String(a).split('').forEach(function (d, i, all) { if (+d) parts.push(+d * Math.pow(10, all.length - 1 - i)); });
        return K.int('Work out <b>' + b + x + a + '</b> by splitting ' + a + ' up.', a * b, { hint: 'Split ' + a + ' into ' + parts.join(' + ') + '. Multiply each part by ' + b + '.', params: { a: a, b: b },
          sol: sol(['Split ' + a + ' into ' + parts.join(' + ') + '.', parts.map(function (p) { return b + x + p + ' = ' + p * b; }).join(', ') + '.', 'Add: ' + parts.map(function (p) { return p * b; }).join(pl) + ' = ' + a * b + '.']) });
      },
      verify: function (q) { var p = q.params; return q.check.value === p.a * p.b; } },

    { id: 'TR-11', from: 5, title: 'Halve one, double the other', statement: 'Make a multiplication easier by halving one number and doubling the other',
      vocab: ['halve', 'double', 'equal product'],
      say: ['If you halve one number and double the other, the answer stays the same. <b>Keep going until you reach a round number.</b>', '16 × 25 = 8 × 50 = 4 × 100 = 400. And 14 × 15 = 7 × 30 = 210.'],
      demo: ['Watch: 16 × 25. Halve one, double the other.', function () { return flow('16 × 25', [['halve 16, double 25', '8 × 50'], ['halve 8, double 50', '4 × 100'], ['now it is easy', '400']]); }],
      method: ['Halve the even number.', 'Double the other number.', 'Repeat until one number is round, then multiply.'], mistakes: ['Halving both numbers.', 'Doubling both numbers.'],
      make: function (r, L) {
        var a, b; if (L === 1) { a = r.int(6, 49) * 2; b = r.pick([15, 35, 45]); } else if (L === 2) { a = r.int(3, 30) * 4; b = 25; } else { a = r.int(2, 12) * 8; b = 125; }
        var lines = [], p = a, q2 = b, steps = L === 1 ? 1 : L === 2 ? 2 : 3;
        for (var k = 0; k < steps; k++) { lines.push('Halve ' + p + ' and double ' + q2 + ': ' + p / 2 + x + q2 * 2 + '.'); p /= 2; q2 *= 2; }
        lines.push(p + x + q2 + ' = ' + fmt(p * q2) + '.');
        return K.int('Work out <b>' + a + x + b + '</b> by halving and doubling.', a * b, { hint: 'Halve ' + a + ' and double ' + b + '. Keep going until it is easy.', params: { a: a, b: b }, sol: sol(lines) });
      },
      verify: function (q) { var p = q.params; return q.check.value === p.a * p.b; } },

    { id: 'TR-12', from: 3, title: 'Count on to take away', statement: 'Subtract numbers that are close together by counting up from the smaller to the larger',
      vocab: ['difference', 'count on', 'jump'],
      say: ['When two numbers are close, <b>count up from the smaller one</b> instead of taking away. 403 − 396: from 396, 4 more makes 400, then 3 more makes 403.', 'The difference is 4 + 3 = 7. No exchanging needed!'],
      demo: ['Watch: 403 − 396. Count up from 396.', function () { return OM.demo && OM.demo.jumps ? OM.demo.jumps({ lo: 394, hi: 404, start: 396, steps: [4, 3], say: '4 + 3 = 7, so 403 − 396 = 7' }) : flow('403 − 396', [['count up to 400', '4'], ['then up to 403', '3'], ['add the jumps', '7']]); }],
      method: ['Start at the smaller number.', 'Jump to the next round number.', 'Jump to the bigger number, then add the jumps.'], mistakes: ['Counting the starting number as a jump.', 'Forgetting one of the jumps.'],
      make: function (r, L) {
        var b, a, round;
        if (L === 1) { round = r.int(3, 9) * 10; b = round - r.int(1, 4); a = round + r.int(1, 5); }
        else if (L === 2) { round = r.int(2, 9) * 100; b = round - r.int(2, 9); a = round + r.int(1, 9); }
        else { round = r.int(2, 9) * 100; b = round - r.int(11, 40); a = round + r.int(10, 90); }
        var g1 = round - b, g2 = a - round;
        return K.int('Work out <b>' + a + mi + b + '</b> by counting on.', a - b, { hint: 'Count up from ' + b + ' to ' + round + ', then on to ' + a + '.', params: { a: a, b: b },
          sol: sol(['From ' + b + ' to ' + round + ' is ' + g1 + '.', 'From ' + round + ' to ' + a + ' is ' + g2 + '.', 'Add the jumps: ' + g1 + pl + g2 + ' = ' + (g1 + g2) + '.']) });
      },
      verify: function (q) { var p = q.params; return q.check.value + p.b === p.a; } },

    { id: 'TR-13', from: 5, title: 'The times 11 digit trick', statement: 'Multiply a two- or three-digit number by 11 by adding neighbouring digits',
      vocab: ['digit', 'neighbour', 'carry'],
      say: ['A magic one: to multiply a 2-digit number by 11, <b>write its digits apart and put their sum in the middle</b>. 43 × 11: 4, then 4 + 3 = 7, then 3. The answer is 473.', 'If the middle sum is 10 or more, carry the 1 to the left: 68 × 11 → 6, 14, 8 → 748.'],
      demo: ['Watch: 43 × 11. The middle digit is 4 + 3.', function () { return flow('43 × 11', [['write the outside digits: 4 _ 3', '4 _ 3'], ['the middle is 4 + 3 = 7', '473']]); }],
      method: ['Write the first and last digits.', 'Between them, write the sum of each pair of neighbouring digits.', 'If a sum is 10 or more, carry 1 to the left.'], mistakes: ['Writing 14 in the middle instead of carrying.', 'Adding all the digits instead of neighbours.'],
      make: function (r, L) {
        var n;
        if (L === 1) { do { n = r.int(12, 81); } while (n % 10 + Math.floor(n / 10) > 9 || n % 10 === 0); }
        else if (L === 2) { do { n = r.int(29, 99); } while (n % 10 + Math.floor(n / 10) < 10); }
        else n = r.int(102, 899);
        var d = String(n).split('').map(Number), sums = [d[0]];
        for (var i = 1; i < d.length; i++) sums.push(d[i - 1] + d[i]);
        sums.push(d[d.length - 1]);
        var carry = sums.some(function (s, k) { return k > 0 && s > 9; }), lines = ['Write the outside digits: ' + d[0] + ' … ' + d[d.length - 1] + '.', 'In between, add each pair of neighbours: ' + sums.slice(1, -1).map(function (s, k) { return d[k] + ' + ' + d[k + 1] + ' = ' + s; }).join(', ') + '.'];
        lines.push(carry ? 'That gives ' + sums.join(' | ') + '. Carry the 1s to the left: ' + fmt(n * 11) + '.' : 'So the answer is ' + sums.join('') + '.');
        return K.int('Use the 11 trick to work out <b>' + n + ' × 11</b>.', n * 11, { hint: 'Write the outside digits and put the sums of neighbouring digits between them.', params: { n: n }, sol: sol(lines) });
      },
      verify: function (q) { return q.check.value === q.params.n * 10 + q.params.n; } },

    { id: 'TR-14', from: 5, title: 'Divisibility tests', statement: 'Tell whether a number divides by 2, 3, 4, 5, 6, 9 or 10 without dividing',
      vocab: ['divisible', 'digit sum', 'multiple'],
      say: ['You can tell if a number divides exactly without doing the division. <b>2</b>: the last digit is even. <b>5</b>: it ends in 0 or 5. <b>10</b>: it ends in 0.', '<b>3</b>: add the digits; if the total is in the 3 times table, so is the number. <b>9</b>: the digits add up to a multiple of 9.', '<b>4</b>: the last two digits make a multiple of 4. <b>6</b>: it is even AND passes the test for 3.'],
      demo: ['Watch: is 4,212 divisible by 9? Add the digits.', function () { return flow('Is 4,212 divisible by 9?', [['add the digits', '4 + 2 + 1 + 2 = 9'], ['9 is in the 9 times table', 'Yes!']]); }],
      method: ['Pick the right test for the number.', 'Look at the last digit(s) or add the digits.', 'Decide yes or no.'], mistakes: ['Using the digit-sum test for 4 (it only works for 3 and 9).', 'Thinking every even number divides by 4.'],
      make: function (r, L) {
        var d = L === 1 ? r.pick([2, 5, 10]) : L === 2 ? r.pick([3, 9]) : r.pick([4, 6]), yes = r.chance(0.5), n;
        do { n = r.int(1000, 9999); } while ((n % d === 0) !== yes);
        var why;
        if (d === 2) why = 'The last digit is ' + n % 10 + ', which is ' + (n % 2 ? 'odd' : 'even') + '.';
        else if (d === 5) why = 'It ends in ' + n % 10 + (yes ? ', so yes.' : '. Only numbers ending in 0 or 5 divide by 5.');
        else if (d === 10) why = 'It ends in ' + n % 10 + (yes ? '.' : '. Only numbers ending in 0 divide by 10.');
        else if (d === 3 || d === 9) why = 'Add the digits: ' + String(n).split('').join(' + ') + ' = ' + dsum(n) + '. ' + dsum(n) + (dsum(n) % d ? ' is not' : ' is') + ' in the ' + d + ' times table.';
        else if (d === 4) why = 'The last two digits make ' + n % 100 + ', which ' + (n % 100 % 4 ? 'is not' : 'is') + ' in the 4 times table.';
        else why = (n % 2 ? 'It is odd, so it cannot divide by 6.' : 'It is even. The digits add up to ' + dsum(n) + ', which ' + (dsum(n) % 3 ? 'is not' : 'is') + ' in the 3 times table.');
        return K.choice('Without dividing, is <b>' + fmt(n) + '</b> divisible by <b>' + d + '</b>?', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], yes ? 'yes' : 'no',
          { hint: { 2: 'Is the last digit even?', 5: 'Does it end in 0 or 5?', 10: 'Does it end in 0?', 3: 'Add up the digits.', 9: 'Add up the digits.', 4: 'Look at the last two digits.', 6: 'It must be even AND pass the test for 3.' }[d], params: { n: n, d: d },
            sol: sol([why, 'So the answer is ' + (yes ? 'yes' : 'no') + ': ' + fmt(n) + (yes ? ' is' : ' is not') + ' divisible by ' + d + '.']) });
      },
      verify: function (q) { var p = q.params; return (q.check.value === 'yes') === (p.n % p.d === 0); } },

    { id: 'TR-15', from: 6, title: 'Percentages from 10%', statement: 'Find percentages of amounts by building them from 10%, 5% and 1%',
      vocab: ['percent', '10%', 'build up'],
      say: ['<b>10% is easy: divide by 10.</b> 10% of 340 is 34.', 'Then build what you need: 5% is half of 10%. 20% is double 10%. 15% is 10% + 5%. 25% is a quarter. 1% is ÷ 100.', '35% of 340? 30% is 3 × 34 = 102, 5% is 17, so 35% is 119.'],
      demo: ['Watch: 15% of 340 is 10% add 5%.', function () { return flow('15% of 340', [['10%: divide by 10', '34'], ['5% is half of 10%', '17'], ['15% = 10% + 5%', '34 + 17 = 51']]); }],
      method: ['Find 10% by dividing by 10.', 'Find 5% (half of 10%) or 1% (÷ 100) if you need them.', 'Add or multiply the pieces to make the percentage.'], mistakes: ['Thinking 5% is ÷ 5.', 'Forgetting to add the pieces together.'],
      make: function (r, L) {
        // pt: percentage in tenths of a percent, e.g. 125 = 12.5%
        var pc = L === 1 ? r.pick([10, 20, 5]) : L === 2 ? r.pick([15, 25, 30]) : r.pick([35, 45, 1, 12.5]), A = (pc === 1 ? r.int(2, 90) * 100 : pc === 12.5 || pc === 35 || pc === 45 ? r.int(2, 40) * 40 : r.int(2, 45) * 20);
        var ten = A / 10, five = A / 20, ans, steps;
        switch (pc) {
          case 10: steps = ['10% means divide by 10: ' + fmt(A) + ' ÷ 10 = ' + fmt(ten) + '.']; ans = ten; break;
          case 20: steps = ['10% = ' + fmt(ten) + '.', '20% is double 10%: ' + fmt(ten) + ' × 2 = ' + fmt(2 * ten) + '.']; ans = 2 * ten; break;
          case 5: steps = ['10% = ' + fmt(ten) + '.', '5% is half of 10%: ' + fmt(ten) + ' ÷ 2 = ' + fmt(five) + '.']; ans = five; break;
          case 15: steps = ['10% = ' + fmt(ten) + ' and 5% = ' + fmt(five) + '.', '15% = 10% + 5% = ' + fmt(ten) + ' + ' + fmt(five) + ' = ' + fmt(ten + five) + '.']; ans = ten + five; break;
          case 25: steps = ['25% is a quarter: halve, then halve again.', fmt(A) + ' → ' + fmt(A / 2) + ' → ' + fmt(A / 4) + '.']; ans = A / 4; break;
          case 30: steps = ['10% = ' + fmt(ten) + '.', '30% is 3 lots of 10%: ' + fmt(ten) + ' × 3 = ' + fmt(3 * ten) + '.']; ans = 3 * ten; break;
          case 35: steps = ['10% = ' + fmt(ten) + ', so 30% = ' + fmt(3 * ten) + '.', '5% is half of 10% = ' + fmt(five) + '.', '35% = ' + fmt(3 * ten) + ' + ' + fmt(five) + ' = ' + fmt(3 * ten + five) + '.']; ans = 3 * ten + five; break;
          case 45: steps = ['50% is half: ' + fmt(A / 2) + '.', '5% is half of 10% (' + fmt(ten) + '): ' + fmt(five) + '.', '45% = 50% − 5% = ' + fmt(A / 2) + ' − ' + fmt(five) + ' = ' + fmt(A / 2 - five) + '.']; ans = A / 2 - five; break;
          case 1: steps = ['1% means divide by 100: ' + fmt(A) + ' ÷ 100 = ' + fmt(A / 100) + '.']; ans = A / 100; break;
          default: steps = ['25% is a quarter: ' + fmt(A / 4) + '.', '12.5% is half of 25%: ' + fmt(A / 4) + ' ÷ 2 = ' + fmt(A / 8) + '.']; ans = A / 8;
        }
        return K.int('Work out <b>' + pc + '% of ' + fmt(A) + '</b> in your head.', ans, { hint: 'Start with 10%: divide by 10. Then build up.', params: { pc: pc, A: A }, sol: sol(steps) });
      },
      verify: function (q) { var p = q.params; return q.check.value * 1000 === p.A * p.pc * 10; } },

    { id: 'TR-16', from: 7, title: 'Squaring numbers ending in 5', statement: 'Square a number ending in 5 by multiplying its tens by the next number up and writing 25 on the end',
      vocab: ['square', 'tens', 'next number up'],
      say: ['To square a number ending in 5, <b>multiply the tens digit by the next number up, then write 25 on the end</b>.', '35²: 3 × 4 = 12, then 25: the answer is 1,225. 75²: 7 × 8 = 56, so 5,625.', 'Why? (10t + 5)² = 100t² + 100t + 25 = 100 × t(t + 1) + 25.'],
      demo: ['Watch: 35². Three times four, then 25.', function () { return flow('35²', [['tens digit 3, next number up 4', '3 × 4 = 12'], ['write 25 on the end', '1,225']]); }],
      method: ['Take the number of tens, t.', 'Work out t × (t + 1).', 'Write 25 after it.'], mistakes: ['Doing t × t instead of t × (t + 1).', 'Writing 5 on the end instead of 25.'],
      make: function (r, L) {
        var tt = L === 1 ? r.int(1, 4) : L === 2 ? r.int(5, 9) : r.int(10, 19), n = tt * 10 + 5, ans = n * n;
        return K.int('Work out <b>' + n + '²</b> using the trick for numbers ending in 5.', ans, { hint: 'Multiply ' + tt + ' by ' + (tt + 1) + ', then write 25 on the end.', params: { n: n },
          sol: sol(['The number of tens is ' + tt + '. The next number up is ' + (tt + 1) + '.', tt + x + (tt + 1) + ' = ' + tt * (tt + 1) + '.', 'Write 25 on the end: ' + n + '² = ' + fmt(ans) + '.']) });
      },
      verify: function (q) { var n = q.params.n; return q.check.value === n * n; } },

    { id: 'TR-17', from: 9, title: 'Either side of a round number', statement: 'Multiply two numbers the same distance either side of a round number using the difference of two squares',
      vocab: ['difference of two squares', 'square', 'round number'],
      say: ['49 × 51: both numbers are 1 away from 50. The answer is <b>50² − 1²</b> = 2,500 − 1 = 2,499.', 'It works for any distance: 47 × 53 = 50² − 3² = 2,500 − 9 = 2,491.', 'This is the difference of two squares: (a − b)(a + b) = a² − b².'],
      demo: ['Watch: 47 × 53. Both are 3 away from 50.', function () { return flow('47 × 53', [['both are 3 away from 50', '50² − 3²'], ['square each', '2,500 − 9'], ['take away', '2,491']]); }],
      method: ['Find the round number in the middle and how far away each number is.', 'Square the round number and square the distance.', 'Take the second square away from the first.'], mistakes: ['Adding the square of the distance instead of taking it away.', 'Forgetting to square the distance.'],
      make: function (r, L) {
        var m = L === 3 ? r.pick([100, 200, 300]) : r.int(2, 9) * 10, k = L === 1 ? 1 : L === 2 ? r.int(2, 4) : r.int(1, 9), a = m - k, b = m + k, sw = r.chance(0.5), ans = a * b;
        return K.int('Work out <b>' + (sw ? b : a) + x + (sw ? a : b) + '</b> in your head.', ans, { hint: 'Both numbers are ' + k + ' away from ' + m + '. Work out ' + m + '² − ' + k + '².', params: { a: a, b: b },
          sol: sol(['Both numbers are ' + k + ' away from ' + m + '.', m + '² = ' + fmt(m * m) + ' and ' + k + '² = ' + k * k + '.', fmt(m * m) + mi + k * k + ' = ' + fmt(ans) + '.']) });
      },
      verify: function (q) { var p = q.params; return q.check.value === p.a * p.b; } },

    { id: 'TR-18', from: 4, title: 'Prices ending in 99p', statement: 'Add or multiply prices like £4.99 by rounding to whole pounds and taking off the pennies',
      vocab: ['round', 'pence', 'adjust'],
      say: ['£4.99 is just 1p less than £5. So <b>round up to whole pounds, then take off the pennies</b>.', '£4.99 + £2.99: £5 + £3 = £8, take off 2p: £7.98. Three at £1.99: 3 × £2 = £6, take off 3p: £5.97.'],
      demo: ['Watch: 3 × £1.99. Use £2, then take off 3p.', function () { return flow('3 × £1.99', [['each one is 1p less than £2', '3 × £2 = £6'], ['take off 1p for each one', '£6 − 3p = £5.97']]); }],
      method: ['Round each price up to the next pound.', 'Add or multiply the whole pounds.', 'Take off the pennies you added.'], mistakes: ['Taking off only 1p when there are several items.', 'Forgetting to take off the pennies.'],
      make: function (r, L) {
        if (L === 1) {
          var a = r.int(1, 9), b = r.int(1, 9), tot = (a + 1 + b + 1) * 100 - 2;
          return K.money('Work out <b>£' + a + '.99 + £' + b + '.99</b>.', tot, '£', { hint: 'Round both up to whole pounds, then take off 2p.', params: { items: [[a * 100 + 99, 1], [b * 100 + 99, 1]] },
            sol: sol(['£' + a + '.99 is 1p less than £' + (a + 1) + ', and £' + b + '.99 is 1p less than £' + (b + 1) + '.', '£' + (a + 1) + ' + £' + (b + 1) + ' = £' + (a + b + 2) + '.', 'Take off 2p: £' + (a + b + 2) + ' − 2p = ' + OM.pounds(tot) + '.']) });
        }
        var n = L === 2 ? 3 : r.int(2, 6), p = L === 2 ? r.int(1, 9) : r.int(1, 19), off = L === 2 ? 1 : r.pick([1, 5]), price = (p + 1) * 100 - off, total = price * n;
        return K.money('A pen costs <b>' + OM.pounds(price) + '</b>. How much do <b>' + n + '</b> pens cost?', total, '£', { hint: 'Each costs ' + off + 'p less than £' + (p + 1) + '.', params: { items: [[price, n]] },
          sol: sol([OM.pounds(price) + ' is ' + off + 'p less than £' + (p + 1) + '.', n + ' × £' + (p + 1) + ' = £' + n * (p + 1) + '.', 'Take off ' + off + 'p for each one: ' + n + ' × ' + off + 'p = ' + n * off + 'p. £' + n * (p + 1) + ' − ' + n * off + 'p = ' + OM.pounds(total) + '.']) });
      },
      verify: function (q) { var t = 0; q.params.items.forEach(function (it) { for (var i = 0; i < it[1]; i++) t += it[0]; }); return q.check.pence === t; } }
  ];

  // ---------- register: generators, then the Trick Box section ----------
  var objectives = TRICKS.map(function (tr) {
    var gid = 'trick' + tr.id.slice(3);
    K.gen({ id: gid, objective: tr.id, title: tr.title, make: tr.make, verify: tr.verify });
    var intro = tr.say.map(function (s) { return { say: s }; });
    intro.push({ say: tr.demo[0], vis: tr.demo[1], demo: true });
    return { id: tr.id, statement: tr.statement, title: tr.title, gens: [gid], vocab: tr.vocab, intro: intro, method: tr.method, mistakes: tr.mistakes, from: tr.from, focus: 'Mental maths trick (from Year ' + tr.from + ')' };
  }).sort(function (a, b) { return a.from - b.from; });
  var TR = {
    year: 'TR', label: 'Tricks', keyStage: 'Mental maths tricks', ages: '5–16', tricks: true,
    source: 'Mental maths shortcuts written for this app. Each one is shown from the school year whose maths it needs.',
    regions: [{ id: 'xt', name: 'Pip’s Trick Box', strand: 'Mental maths tricks', color: '#e0782f', icon: 'bulb', tricks: true, objectives: objectives }],
    speed: { title: 'Speed round', count: 10, minutes: 5 }
  };
  OM.CURRICULUM.YTR = TR;
  objectives.forEach(function (ob) { ob.region = 'xt'; ob.year = 'TR'; OM.objectiveIndex[ob.id] = ob; });
  // the tricks a child can see: those from their school year or earlier
  OM.tricksFor = function (year) { return objectives.filter(function (o) { return o.from <= (year || 4); }); };
  // a speed round: 10 questions mixed from the child's tricks, the harder levels for older children
  OM.buildTrickTest = function (year, seed) {
    var objs = OM.tricksFor(year), r = OM.makeRng(seed), seen = {}, qs = [], pool = r.shuffle(objs.slice());
    for (var i = 0; qs.length < TR.speed.count && i < TR.speed.count * 4; i++) {
      var ob = pool[i % pool.length], lv = Math.min(3, Math.max(1, (year || 4) - ob.from + [1, 1, 2][i % 3])), q = OM.generateFresh(ob.gens[0], lv, r, seen);
      if (q) qs.push(q);
    }
    return qs;
  };
})(typeof window !== 'undefined' ? window : globalThis);
