/* Learn with Pip — Year 2 question generators. Numbers stay within Year 2 (mostly up to 100); no decimals or negative numbers.
   Money uses whole pence or whole pounds. Each generator's verify() works the answer out another way.
   Levels: 1 getting there, 2 expected, 3 greater depth. */
(function (G) {
  'use strict';
  var OM = G.OM, K = OM.kit, V = OM.V, S = K.S, F = K.fr;
  function opts(r, correct, wrongs) { var seen = {}; return r.shuffle([correct].concat(wrongs).filter(function (x) { var k = String(x); if (seen[k]) return false; seen[k] = 1; return true; })).map(function (x) { return { value: String(x), label: String(x) }; }); }
  function tens(n) { return Math.floor(n / 10); } function ones(n) { return n % 10; }

  // ================= NUMBER AND PLACE VALUE =================
  K.gen({ id: 'y2Count', objective: 'Y2-NPV-01', title: 'Counting in 2s, 3s, 5s and 10s',
    make: function (r, L) {
      var step = L === 1 ? r.pick([2, 10]) : L === 2 ? r.pick([3, 5]) : r.pick([3, 5, 10]), down = L === 3 && r.chance(0.5);
      var start = step === 10 ? (L === 1 ? 10 * r.int(0, 4) : r.int(1, 9) + 10 * r.int(0, 3)) : step * r.int(0, Math.floor(60 / step));
      var terms = []; for (var i = 0; i < 6; i++) terms.push(start + i * step);
      if (down) terms.reverse();
      var blanks = r.sample([1, 2, 3, 4, 5], 2).sort();
      var tpl = terms.map(function (t, i) { var b = blanks.indexOf(i); return b >= 0 ? '{' + b + '}' : String(t); }).join(', ');
      return K.multi('Count ' + (down ? 'back' : 'on') + ' in <b>' + step + 's</b>. Fill in the missing numbers.', tpl, blanks.map(function (b) { return { kind: 'int', value: terms[b] }; }),
        { blanks: blanks.map(function () { return { keys: 'digits', small: true }; }), hint: 'Each number is ' + step + ' ' + (down ? 'less' : 'more') + ' than the one before.', params: { terms: terms, step: step, down: down, blanks: blanks }, answer: blanks.map(function (b) { return terms[b]; }).join(' and '), sol: ['The numbers go: ' + terms.join(', ') + '.'] });
    },
    verify: function (q) { var p = q.params; return p.blanks.every(function (b, i) { return q.check.parts[i].value === p.terms[0] + (p.down ? -1 : 1) * p.step * b; }); } });

  K.gen({ id: 'y2PlaceValue', objective: 'Y2-NPV-02', title: 'Tens and ones',
    make: function (r, L) {
      var n = r.int(21, 99); if (ones(n) === 0) n++;
      if (L === 1) return K.int('How many does this show?', n, { visual: V.base10(n), hint: 'Count the tens sticks in 10s, then count the ones.', params: { n: n, k: 'read' }, sol: ['There are ' + tens(n) + ' tens and ' + ones(n) + ' ones.', 'That makes ' + n + '.'] });
      var askT = r.chance(0.5);
      if (L === 2) return K.int('What is the <b>value</b> of the digit <b>' + (askT ? tens(n) : ones(n)) + '</b> in ' + n + '?', askT ? tens(n) * 10 : ones(n), { hint: 'Is the digit in the tens or the ones?', params: { n: n, t: askT, k: 'val' }, sol: ['In ' + n + ' the ' + tens(n) + ' means ' + tens(n) * 10 + ' and the ' + ones(n) + ' means ' + ones(n) + '.'] });
      return K.multi('Fill in the gaps.', n + ' = {0} tens and {1} ones', [{ kind: 'int', value: tens(n) }, { kind: 'int', value: ones(n) }], { hint: 'Split ' + n + ' into tens and ones.', params: { n: n, k: 'split' }, answer: tens(n) + ' tens and ' + ones(n) + ' ones', sol: [n + ' = ' + tens(n) * 10 + ' + ' + ones(n) + '.'] });
    },
    verify: function (q) { var p = q.params, s = String(p.n); if (p.k === 'read') return q.check.value === p.n; if (p.k === 'val') return q.check.value === (p.t ? +s[0] * 10 : +s[1]); return q.check.parts[0].value * 10 + q.check.parts[1].value === p.n; } });

  K.gen({ id: 'y2NumberLine', objective: 'Y2-NPV-03', title: 'Numbers on a number line',
    make: function (r, L) {
      var max = L === 1 ? 20 : 100, step = L === 1 ? 1 : 10, n = L === 1 ? r.int(1, 19) : L === 2 ? 10 * r.int(1, 9) : r.int(2, 9) * 10 + r.pick([5]);
      if (L < 3) return K.int('What number is the arrow pointing to?', n, { visual: V.numberLine({ min: 0, max: max, step: step, labelEvery: L === 1 ? 5 : 5, arrow: n }), hint: 'Count the steps from the nearest number you know.', params: { n: n, max: max }, sol: ['Count along from 0 in ' + step + 's. The arrow is at ' + n + '.'] });
      return K.int('The arrow is halfway between two marks. What number is it?', n, { visual: V.numberLine({ min: 0, max: 100, step: 10, labelEvery: 5, arrow: n }), hint: 'Halfway between two tens is the 5.', params: { n: n, max: 100 }, sol: ['It is halfway between ' + (n - 5) + ' and ' + (n + 5) + ', so it is ' + n + '.'] });
    },
    verify: function (q) { var p = q.params; return q.check.value === p.n && p.n > 0 && p.n < p.max; } });

  K.gen({ id: 'y2CompareSigns', objective: 'Y2-NPV-04', title: 'Using <, > and =',
    make: function (r, L) {
      if (L < 3) { var a = r.int(10, 99), b = L === 1 ? r.int(10, 99) : tens(a) * 10 + r.int(0, 9); if (L === 2 && r.chance(0.2)) b = a; var sign = a < b ? '<' : a > b ? '>' : '=';
        return K.choice('Which sign goes in the gap?<br><b>' + a + ' ? ' + b + '</b>', [{ value: '<', label: '< (less than)' }, { value: '>', label: '> (greater than)' }, { value: '=', label: '= (equal to)' }], sign, { hint: 'Compare the tens first, then the ones. The open side faces the bigger number.', params: { a: a, b: b, k: 'sign' }, sol: [a + ' ' + sign + ' ' + b + '.'] }); }
      var nums = r.sample([12, 21, 34, 43, 56, 65, 78, 87, 19, 91], 4), sorted = nums.slice().sort(function (x, y) { return x - y; });
      return K.order('Put these in order, <b>smallest first</b>.', nums.map(function (x) { return { value: String(x), label: String(x) }; }), sorted.map(String), { hint: 'Look at the tens digit first.', params: { nums: nums, k: 'order' }, answer: sorted.join(', '), sol: ['Smallest to biggest: ' + sorted.join(', ') + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'sign') { var d = String(p.a).localeCompare(String(p.b)); return q.check.value === (d < 0 ? '<' : d > 0 ? '>' : '='); } return q.check.order.every(function (v, i, a) { return !i || +a[i - 1] < +v; }); } });

  K.gen({ id: 'y2Words', objective: 'Y2-NPV-05', title: 'Numbers to 100 in words',
    make: function (r, L) {
      var n = r.int(L === 1 ? 11 : 21, 99), w = K.toWords(n);
      if (L === 1) return K.int('Write in digits: <b>' + w + '</b>', n, { hint: 'The first word tells you the tens.', params: { n: n }, sol: ['"' + w + '" is ' + n + '.'] });
      if (L === 2) return K.choice('Which is <b>' + n + '</b> in words?', opts(r, w, [K.toWords(ones(n) * 10 + tens(n) || n + 1), K.toWords(n + 10 > 99 ? n - 10 : n + 10)]), w, { hint: 'Say the tens first, then the ones.', params: { n: n }, sol: [n + ' is "' + w + '".'] });
      return K.words('Write <b>' + n + '</b> in words.', n, { hint: 'Write the tens word, a hyphen, then the ones word.', params: { n: n }, answer: w, sol: [n + ' in words is "' + w + '".'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; return (typeof v === 'number' ? v : K.fromWords(v)) === p.n; } });

  K.gen({ id: 'y2PVProblems', objective: 'Y2-NPV-06', title: 'Place value problems',
    make: function (r, L) {
      if (L === 1) { var t = r.int(1, 9), o = r.int(0, 9); return K.int('I have ' + t + ' tens and ' + o + ' ones. What number am I?', t * 10 + o, { hint: t + ' tens is ' + t * 10 + '.', params: { t: t, o: o, k: 'make' }, sol: [t * 10 + ' + ' + o + ' = ' + (t * 10 + o) + '.'] }); }
      var ds = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 2), big = r.chance(0.5), ans = big ? Math.max(ds[0], ds[1]) * 10 + Math.min(ds[0], ds[1]) : Math.min(ds[0], ds[1]) * 10 + Math.max(ds[0], ds[1]);
      if (L === 2) return K.int('Use the digits <b>' + ds[0] + '</b> and <b>' + ds[1] + '</b>. Make the <b>' + (big ? 'biggest' : 'smallest') + '</b> number you can.', ans, { hint: 'The tens digit matters most.', params: { ds: ds, big: big, k: 'digits' }, sol: ['Put the ' + (big ? 'bigger' : 'smaller') + ' digit in the tens: ' + ans + '.'] });
      var n = r.int(20, 89), add = r.pick([10, 20, 30]);
      return K.int('What is <b>' + add + ' more</b> than ' + n + '?', n + add, { hint: 'Only the tens digit changes.', params: { n: n, add: add, k: 'tens' }, sol: [n + ' + ' + add + ' = ' + (n + add) + '. The tens go up by ' + add / 10 + '.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; if (p.k === 'make') return v === +(String(p.t) + p.o); if (p.k === 'digits') { var a = +('' + p.ds[0] + p.ds[1]), b = +('' + p.ds[1] + p.ds[0]); return v === (p.big ? Math.max(a, b) : Math.min(a, b)); } return tens(v) - tens(p.n) === p.add / 10 && ones(v) === ones(p.n); } });

  // ================= ADDITION AND SUBTRACTION =================
  K.gen({ id: 'y2ASProblems', objective: 'Y2-AS-01', title: 'Adding and subtracting problems',
    make: function (r, L) {
      var name = r.pick(OM.NAMES);
      if (L === 1) { var a = r.int(11, 40), b = r.int(5, 30); return K.int(name + ' has ' + a + ' stickers. ' + name + ' is given ' + b + ' more. How many now?', a + b, { hint: 'Add the two numbers.', params: { a: a, b: b, k: 'add' }, sol: [a + ' + ' + b + ' = ' + (a + b) + '.'] }); }
      if (L === 2) { var c = r.int(40, 95), d = r.int(12, c - 10); return K.int('There are ' + c + ' children in the hall. ' + d + ' go out to play. How many are left in the hall?', c - d, { hint: 'Take away the children who went out.', params: { a: c, b: d, k: 'sub' }, sol: [c + ' − ' + d + ' = ' + (c - d) + '.'] }); }
      var x = r.int(25, 60), y = r.int(20, 45); if (x === y) y--;
      return K.int('A red ribbon is ' + x + ' cm long. A blue ribbon is ' + y + ' cm long. How much longer is the ' + (x > y ? 'red' : 'blue') + ' ribbon?', Math.abs(x - y), { suffix: 'cm', hint: 'Find the difference: take the smaller from the bigger.', params: { a: Math.max(x, y), b: Math.min(x, y), k: 'diff' }, sol: ['Difference: ' + Math.max(x, y) + ' − ' + Math.min(x, y) + ' = ' + Math.abs(x - y) + ' cm.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; if (p.k === 'add') return v - p.b === p.a; return v + p.b === p.a; } });

  K.gen({ id: 'y2Facts', objective: 'Y2-AS-02', title: 'Number facts to 20 and to 100',
    make: function (r, L) {
      var a = r.int(3, 9), b = r.int(10 - a, 9), add = L === 1 || r.chance(0.5);
      if (L < 3) return add ? K.int('<b>' + a + ' + ' + b + ' = ?</b>', a + b, { hint: 'Make 10 first: ' + a + ' + ' + (10 - a) + ' = 10.', params: { a: a, b: b, add: true, m: 1 }, sol: [a + ' + ' + b + ' = ' + (a + b) + '.'] })
        : K.int('<b>' + (a + b) + ' − ' + b + ' = ?</b>', a, { hint: 'Use the fact ' + a + ' + ' + b + ' = ' + (a + b) + '.', params: { a: a + b, b: b, add: false, m: 1 }, sol: [a + ' + ' + b + ' = ' + (a + b) + ', so ' + (a + b) + ' − ' + b + ' = ' + a + '.'] });
      var x = r.int(1, 9), y = r.int(1, 10 - x); if (x + y > 10) y = 10 - x;
      return add ? K.int('If ' + x + ' + ' + y + ' = ' + (x + y) + ', what is <b>' + x * 10 + ' + ' + y * 10 + '</b>?', (x + y) * 10, { hint: 'It is the same fact, but with tens.', params: { a: x * 10, b: y * 10, add: true, m: 10 }, sol: [x + ' tens + ' + y + ' tens = ' + (x + y) + ' tens = ' + (x + y) * 10 + '.'] })
        : K.int('If ' + (x + y) + ' − ' + y + ' = ' + x + ', what is <b>' + (x + y) * 10 + ' − ' + y * 10 + '</b>?', x * 10, { hint: 'It is the same fact, but with tens.', params: { a: (x + y) * 10, b: y * 10, add: false, m: 10 }, sol: [(x + y) + ' tens − ' + y + ' tens = ' + x + ' tens = ' + x * 10 + '.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; return p.add ? v - p.b === p.a && v <= 100 : v + p.b === p.a; } });

  K.gen({ id: 'y2AddSub', objective: 'Y2-AS-03', title: 'Adding and subtracting 2-digit numbers',
    make: function (r, L) {
      var kind = L === 1 ? r.pick(['ones', 'tens']) : L === 2 ? r.pick(['two', 'three']) : 'two', add = kind === 'three' || r.chance(0.5), a, b, c;
      if (kind === 'ones') { a = r.int(21, 89); b = r.int(1, 9); }
      else if (kind === 'tens') { a = r.int(12, 59); b = 10 * r.int(1, 4); }
      else if (kind === 'two') { a = r.int(L === 3 ? 35 : 21, 69); b = r.int(11, L === 3 ? 29 : 25); if (L === 2 && add) b = tens(b) * 10 + Math.min(ones(b), 9 - ones(a)); if (L === 2 && !add) b = tens(b) * 10 + Math.min(ones(b), ones(a)); }
      else { a = r.int(2, 9); b = r.int(2, 9); c = r.int(2, 9); }
      if (!add && b > a) { var t = a; a = b; b = t; }
      if (kind === 'three') return K.int('<b>' + a + ' + ' + b + ' + ' + c + ' = ?</b>', a + b + c, { hint: 'Look for two numbers that make 10, or add a double first.', params: { list: [a, b, c], add: true }, sol: [a + ' + ' + b + ' = ' + (a + b) + '.', (a + b) + ' + ' + c + ' = ' + (a + b + c) + '.'] });
      var ans = add ? a + b : a - b;
      return K.int('<b>' + a + (add ? ' + ' : ' − ') + b + ' = ?</b>', ans, { hint: kind === 'tens' ? 'Only the tens change.' : 'Add or subtract the tens, then the ones.', params: { list: [a, b], add: add },
        visual: kind === 'two' ? V.base10(a) : '', sol: kind === 'two' ? [a + (add ? ' + ' : ' − ') + tens(b) * 10 + ' = ' + (add ? a + tens(b) * 10 : a - tens(b) * 10) + '.', (add ? a + tens(b) * 10 : a - tens(b) * 10) + (add ? ' + ' : ' − ') + ones(b) + ' = ' + ans + '.'] : [a + (add ? ' + ' : ' − ') + b + ' = ' + ans + '.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; if (p.add) return p.list.reduce(function (s, x) { return s + x; }, 0) === v; return v + p.list[1] === p.list[0]; } });

  K.gen({ id: 'y2Commutative', objective: 'Y2-AS-04', title: 'Order in adding and subtracting',
    make: function (r, L) {
      var a = r.int(3, 15), b = r.int(3, 15); while (b === a) b = r.int(3, 15);
      if (L < 3) { var right = b + ' + ' + a; return K.choice('Which gives the same answer as <b>' + a + ' + ' + b + '</b>?', opts(r, right, [Math.max(a, b) + ' − ' + Math.min(a, b), (a + 1) + ' + ' + b]), right, { hint: 'You can add two numbers in any order.', params: { a: a, b: b, k: 'add' }, sol: [a + ' + ' + b + ' = ' + (a + b) + ' and ' + b + ' + ' + a + ' = ' + (a + b) + '.'] }); }
      var big = Math.max(a, b), small = Math.min(a, b);
      return K.choice('Is <b>' + big + ' − ' + small + '</b> the same as <b>' + small + ' − ' + big + '</b>?', [{ value: 'no', label: 'No, the order matters' }, { value: 'yes', label: 'Yes, it is the same' }], 'no', { hint: 'Can you take ' + big + ' away from ' + small + '?', params: { a: big, b: small, k: 'sub' }, sol: [big + ' − ' + small + ' = ' + (big - small) + '.', 'Swapping the numbers does not work for take away.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'sub') return q.check.value === 'no' && p.a !== p.b; var m = q.check.value.match(/^(\d+) \+ (\d+)$/); return !!m && +m[1] + +m[2] === p.a + p.b && +m[1] === p.b; } });

  K.gen({ id: 'y2Inverse', objective: 'Y2-AS-05', title: 'Inverse and missing numbers',
    make: function (r, L) {
      var a = r.int(12, 45), b = r.int(11, 40), c = a + b;
      if (L === 1) return K.int('Find the missing number: <b>? + ' + b + ' = ' + c + '</b>', a, { hint: 'Use the inverse: ' + c + ' − ' + b + '.', params: { a: a, b: b, c: c }, sol: [c + ' − ' + b + ' = ' + a + '.'] });
      if (L === 2) return K.int('Find the missing number: <b>' + c + ' − ? = ' + a + '</b>', b, { hint: 'What do you take from ' + c + ' to leave ' + a + '?', params: { a: a, b: b, c: c }, sol: [c + ' − ' + a + ' = ' + b + '.'] });
      var right = a + ' + ' + b + ' = ' + c;
      return K.choice('Which calculation checks that <b>' + c + ' − ' + b + ' = ' + a + '</b>?', opts(r, right, [c + ' + ' + b + ' = ' + (c + b), c + ' + ' + a + ' = ' + (c + a)]), right, { hint: 'Adding undoes subtracting.', params: { a: a, b: b, c: c, k: 'check' }, sol: ['Add back what you took away: ' + right + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'check') { var m = q.check.value.match(/^(\d+) \+ (\d+) = (\d+)$/); return !!m && +m[3] === p.c && +m[1] + +m[2] === p.c; } return p.a + p.b === p.c && (q.check.value === p.a || q.check.value === p.b) && p.c - q.check.value === (q.check.value === p.a ? p.b : p.a); } });

  // ================= MULTIPLICATION AND DIVISION =================
  K.gen({ id: 'y2Tables', objective: 'Y2-MD-01', title: '2, 5 and 10 times tables; odd and even',
    make: function (r, L) {
      var t = r.pick([2, 5, 10]), n = r.int(1, 12);
      if (L === 1) return K.int('<b>' + n + ' × ' + t + ' = ?</b>', n * t, { hint: 'Count in ' + t + 's, ' + n + ' times.', params: { a: n, b: t, k: 'mul' }, sol: [n + ' × ' + t + ' = ' + n * t + '.'] });
      if (L === 2) return K.int('<b>' + n * t + ' ÷ ' + t + ' = ?</b>', n, { hint: 'How many ' + t + 's make ' + n * t + '?', params: { a: n * t, b: t, k: 'div' }, sol: [n + ' × ' + t + ' = ' + n * t + ', so ' + n * t + ' ÷ ' + t + ' = ' + n + '.'] });
      var x = r.int(11, 99), odd = r.chance(0.5);
      if ((x % 2 === 1) !== odd) x++;
      var nums = r.shuffle([x, x + 1 > 99 ? x - 1 : x + 1, x + 3 > 99 ? x - 3 : x + 3]);
      return K.choice('Which number is <b>' + (odd ? 'odd' : 'even') + '</b>?', nums.map(String), String(x), { big: true, hint: 'Look at the ones digit. Even numbers end in 0, 2, 4, 6 or 8.', params: { nums: nums, odd: odd, k: 'odd' }, sol: [x + ' ends in ' + ones(x) + ', so it is ' + (odd ? 'odd.' : 'even.')] });
    },
    verify: function (q) { var p = q.params, v = q.check.value, s = 0, i; if (p.k === 'mul') { for (i = 0; i < p.a; i++) s += p.b; return s === v; } if (p.k === 'div') { for (i = 0; i < v; i++) s += p.b; return s === p.a; } return [1, 3, 5, 7, 9].indexOf(+String(v).slice(-1)) >= 0 === p.odd && p.nums.filter(function (n) { return (n % 2 === 1) === p.odd; }).length === 1; } });

  K.gen({ id: 'y2MulDivStatements', objective: 'Y2-MD-02', title: 'Writing × and ÷ sentences',
    make: function (r, L) {
      var rows = r.int(2, 5), cols = r.pick([2, 5, 10]);
      if (L === 1) { var right = rows + ' × ' + cols + ' = ' + rows * cols; return K.choice('Which number sentence matches the array?', opts(r, right, [rows + ' + ' + cols + ' = ' + (rows + cols), rows + ' × ' + cols + ' = ' + (rows * cols + cols)]), right, { visual: V.array(rows, cols), hint: 'There are ' + rows + ' rows of ' + cols + '.', params: { rows: rows, cols: cols, k: 'arr' }, sol: [rows + ' rows of ' + cols + ': ' + right + '.'] }); }
      if (L === 2) return K.int('There are ' + rows * cols + ' dots in ' + rows + ' equal rows. Complete: <b>' + rows * cols + ' ÷ ' + rows + ' = ?</b>', cols, { visual: V.array(rows, cols), hint: 'How many in each row?', params: { tot: rows * cols, rows: rows, k: 'div' }, sol: [rows * cols + ' ÷ ' + rows + ' = ' + cols + '.'] });
      var t = r.pick([2, 5, 10]), n = r.int(2, 12);
      return K.multi('Fill in the missing numbers.', '{0} × ' + t + ' = ' + n * t + ' &nbsp; and &nbsp; ' + n * t + ' ÷ {1} = ' + n, [{ kind: 'int', value: n }, { kind: 'int', value: t }], { hint: 'Use the ' + t + ' times table.', params: { n: n, t: t, k: 'fam' }, answer: n + ' and ' + t, sol: [n + ' × ' + t + ' = ' + n * t + ' and ' + n * t + ' ÷ ' + t + ' = ' + n + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'arr') { var m = q.check.value.match(/^(\d+) × (\d+) = (\d+)$/); return !!m && +m[3] === p.rows * p.cols; } if (p.k === 'div') return q.check.value * p.rows === p.tot; return q.check.parts[0].value * p.t === p.n * p.t && q.check.parts[1].value === p.t; } });

  K.gen({ id: 'y2MulCommutative', objective: 'Y2-MD-03', title: 'Order in multiplying and dividing',
    make: function (r, L) {
      var a = r.pick([2, 5, 10]), b = r.int(3, 12);
      if (L < 3) return K.int('<b>' + a + ' × ' + b + ' = ' + a * b + '</b>. So what is <b>' + b + ' × ' + a + '</b>?', a * b, { visual: L === 1 && b <= 6 ? V.array(a, b) : '', hint: 'You can multiply in any order.', params: { a: a, b: b, k: 'mul' }, sol: ['Multiplying in any order gives the same answer: ' + a * b + '.'] });
      return K.choice('Is <b>' + a * b + ' ÷ ' + a + '</b> the same as <b>' + a + ' ÷ ' + a * b + '</b>?', [{ value: 'no', label: 'No, the order matters' }, { value: 'yes', label: 'Yes, it is the same' }], 'no', { hint: 'Sharing ' + a * b + ' between ' + a + ' is not the same as sharing ' + a + ' between ' + a * b + '.', params: { a: a, b: b, k: 'div' }, sol: [a * b + ' ÷ ' + a + ' = ' + b + '.', 'Swapping the numbers does not work for dividing.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'div') return q.check.value === 'no'; var s = 0; for (var i = 0; i < p.a; i++) s += p.b; return s === q.check.value; } });

  K.gen({ id: 'y2MDProblems', objective: 'Y2-MD-04', title: 'Multiplying and dividing problems',
    make: function (r, L) {
      var t = r.pick([2, 5, 10]), n = r.int(2, 10), name = r.pick(OM.NAMES);
      if (L === 1) return K.int('A bike has 2 wheels. How many wheels do ' + n + ' bikes have?', 2 * n, { hint: 'Count in 2s.', params: { a: n, b: 2, k: 'mul' }, sol: [n + ' × 2 = ' + 2 * n + '.'] });
      if (L === 2) return K.int(name + ' puts ' + n * t + ' pencils into pots. Each pot holds ' + t + '. How many pots are needed?', n, { hint: 'How many ' + t + 's make ' + n * t + '?', params: { tot: n * t, b: t, k: 'div' }, sol: [n * t + ' ÷ ' + t + ' = ' + n + ' pots.'] });
      var cost = r.pick([2, 5, 10]), k = r.int(3, 9);
      return K.int('Apples cost ' + cost + 'p each. ' + name + ' has ' + cost * k + 'p. How many apples can ' + name + ' buy?', k, { hint: 'How many lots of ' + cost + 'p are in ' + cost * k + 'p?', params: { tot: cost * k, b: cost, k: 'div' }, sol: [cost * k + ' ÷ ' + cost + ' = ' + k + ' apples.'] });
    },
    verify: function (q) { var p = q.params, s = 0, i; if (p.k === 'mul') { for (i = 0; i < p.a; i++) s += p.b; return s === q.check.value; } for (i = 0; i < q.check.value; i++) s += p.b; return s === p.tot; } });

  // ================= FRACTIONS =================
  var FR2 = [[1, 2], [1, 3], [1, 4], [2, 4], [3, 4]];
  K.gen({ id: 'y2Fractions', objective: 'Y2-F-01', title: 'Thirds and quarters',
    make: function (r, L) {
      var f = r.pick(L === 1 ? [[1, 2], [1, 3], [1, 4]] : FR2), lab = function (x) { return x[0] + '/' + x[1]; };
      if (L < 3) { var pic = r.chance(0.5) ? V.pie(f[1], f[0], { r: 56 }) : V.fractionBar(f[1], f[0], { w: 260 });
        return K.choice('What fraction is shaded?', FR2.filter(function (x) { return !(x[0] === 2 && f[0] !== 2 && L === 1); }).map(function (x) { return { value: lab(x), label: F(x[0], x[1]) }; }).filter(function (x, i, a) { return a.length <= 4 || x.value !== '2/4' || f[0] === 2; }), lab(f),
          { visual: pic, hint: 'Count the equal parts. That is the bottom number. Count the shaded parts. That is the top number.', params: { f: f, k: 'shade' }, sol: [f[0] + ' of ' + f[1] + ' equal parts are shaded: ' + F(f[0], f[1]) + '.'] }); }
      var n = f[1] * r.int(2, 6);
      return K.int('What is ' + F(f[0], f[1]) + ' of ' + n + '?', n / f[1] * f[0], { visual: V.dots(n, { perRow: n / f[1] }), hint: 'Share ' + n + ' into ' + f[1] + ' equal groups. Then take ' + f[0] + ' of the groups.', params: { f: f, n: n, k: 'qty' }, sol: [n + ' ÷ ' + f[1] + ' = ' + n / f[1] + ' in each group.', f[0] + ' group' + (f[0] > 1 ? 's' : '') + ': ' + n / f[1] * f[0] + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'shade') { var s = q.check.value.split('/'); return +s[0] === p.f[0] && +s[1] === p.f[1]; } var g = 0, left = p.n; while (left > 0) { left -= p.f[1]; g++; } return g * p.f[0] === q.check.value; } });

  K.gen({ id: 'y2FracOf', objective: 'Y2-F-02', title: 'Writing fractions; ½ and 2/4',
    make: function (r, L) {
      if (L === 1) { var n = 2 * r.int(2, 10); return K.int('Complete: ' + F(1, 2) + ' of ' + n + ' = ?', n / 2, { hint: 'Half means 2 equal groups.', params: { n: n, d: 2, k: 'half' }, sol: [F(1, 2) + ' of ' + n + ' = ' + n / 2 + '.'] }); }
      if (L === 2) { var m = 4 * r.int(1, 5); return K.int('Complete: ' + F(1, 4) + ' of ' + m + ' = ?', m / 4, { hint: 'A quarter means 4 equal groups.', params: { n: m, d: 4, k: 'half' }, sol: [F(1, 4) + ' of ' + m + ' = ' + m / 4 + '.'] }); }
      return K.choice('Which fraction is the same as ' + F(2, 4) + '?', [{ value: '1/2', label: F(1, 2) }, { value: '1/4', label: F(1, 4) }, { value: '3/4', label: F(3, 4) }, { value: '1/3', label: F(1, 3) }], '1/2',
        { visual: V.fractionBar(4, 2, { w: 240 }) + '<br>' + V.fractionBar(2, 1, { w: 240 }), hint: 'Look at the two bars. Is the same amount shaded?', params: { k: 'eq' }, sol: [F(2, 4) + ' and ' + F(1, 2) + ' cover the same amount, so they are equal.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'eq') return q.check.value === '1/2' && 2 * 2 === 4 * 1; var s = 0; for (var i = 0; i < p.d; i++) s += q.check.value; return s === p.n; } });

  // ================= MEASUREMENT =================
  var UNIT_Q = [['the length of a pencil', 'cm'], ['the height of a door', 'm'], ['the mass of an apple', 'g'], ['the mass of a big dog', 'kg'], ['how much water is in a bath', 'litres'], ['how much medicine is in a spoon', 'ml'], ['how hot the day is', '°C']];
  K.gen({ id: 'y2Units', objective: 'Y2-M-01', title: 'Choosing units and reading scales',
    make: function (r, L) {
      if (L === 1) { var u = r.pick(UNIT_Q), all = ['cm', 'm', 'g', 'kg', 'litres', 'ml', '°C'];
        return K.choice('Which unit would you use to measure <b>' + u[0] + '</b>?', opts(r, u[1], r.sample(all.filter(function (x) { return x !== u[1]; }), 2)), u[1], { hint: 'cm and m are for length. g and kg are for mass. ml and litres are for liquid. °C is for temperature.', params: { u: u }, sol: ['We measure ' + u[0] + ' in ' + u[1] + '.'] }); }
      var step = L === 2 ? r.pick([2, 5]) : 10, k = r.int(2, 8), v = step * k + (L === 3 ? 5 : 0), max = step * 10;
      var unit = r.pick(['cm', 'g', 'ml', '°C']);
      return K.int('Read the scale. What does the arrow show?', v, { suffix: unit, visual: V.numberLine({ min: 0, max: max, step: step, labelEvery: L === 2 ? 5 : 2, arrow: v }), hint: L === 3 ? 'The arrow is halfway between two marks.' : 'Each small step is worth ' + step + '.', params: { v: v, step: step, max: max }, sol: ['Each mark is worth ' + step + '.', 'The arrow shows ' + v + ' ' + unit + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.u) return q.check.value === p.u[1]; return q.check.value === p.v && p.v < p.max; } });

  K.gen({ id: 'y2CompareMeasures', objective: 'Y2-M-02', title: 'Comparing measures with <, > and =',
    make: function (r, L) {
      var u = r.pick(['cm', 'kg', 'ml', 'm', 'g']);
      if (L < 3) { var a = r.int(10, 99), b = r.int(10, 99); if (L === 2) b = tens(a) * 10 + ones(b); var sign = a < b ? '<' : a > b ? '>' : '=';
        return K.choice('Which sign goes in the gap?<br><b>' + a + ' ' + u + ' ? ' + b + ' ' + u + '</b>', [{ value: '<', label: '<' }, { value: '>', label: '>' }, { value: '=', label: '=' }], sign, { big: true, hint: 'Compare the numbers. The open side faces the bigger one.', params: { a: a, b: b, k: 'sign' }, sol: [a + ' ' + u + ' ' + sign + ' ' + b + ' ' + u + '.'] }); }
      var vals = r.sample([15, 51, 25, 52, 35, 53, 45, 54], 3), ord = vals.slice().sort(function (x, y) { return x - y; });
      return K.order('Order these from <b>lightest</b> to <b>heaviest</b>.', vals.map(function (v) { return { value: String(v), label: v + ' kg' }; }), ord.map(String), { hint: 'Compare the tens digits first.', params: { vals: vals, k: 'order' }, answer: ord.map(function (v) { return v + ' kg'; }).join(', '), sol: ['Lightest to heaviest: ' + ord.join(' kg, ') + ' kg.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'sign') return q.check.value === (p.a - p.b < 0 ? '<' : p.a - p.b > 0 ? '>' : '='); return q.check.order.every(function (v, i, a) { return !i || +a[i - 1] < +v; }); } });

  K.gen({ id: 'y2Money', objective: 'Y2-M-03', title: '£ and p: adding coins',
    make: function (r, L) {
      if (L === 1) { var list = r.sample([1, 2, 5, 10, 20], 3), tot = K.sum(list); return K.int('How much money is there?', tot, { suffix: 'p', visual: V.coins(list.sort(function (a, b) { return b - a; })), hint: 'Start with the biggest coin and count on.', params: { list: list }, sol: [list.join('p + ') + 'p = ' + tot + 'p.'] }); }
      if (L === 2) { var l2 = r.sample([5, 10, 20, 50], 3).concat([r.pick([1, 2, 5])]), t2 = K.sum(l2); return K.int('How much money is there?', t2, { suffix: 'p', visual: V.coins(l2.sort(function (a, b) { return b - a; })), hint: 'Start with the biggest coin and count on.', params: { list: l2 }, sol: [l2.join('p + ') + 'p = ' + t2 + 'p.'] }); }
      var l3 = r.sample([100, 200, 500, 1000, 2000], 3), t3 = K.sum(l3) / 100;
      return K.int('How many pounds is this altogether?', t3, { prefix: '£', visual: V.coins(l3.sort(function (a, b) { return b - a; })), hint: 'Add the notes first, then the coins.', params: { list: l3, pounds: true }, sol: [l3.map(K.coinName).join(' + ') + ' = £' + t3 + '.'] });
    },
    verify: function (q) { var p = q.params, s = 0; p.list.forEach(function (c) { s += c; }); return p.pounds ? s === q.check.value * 100 : s === q.check.value; } });

  K.gen({ id: 'y2CoinCombos', objective: 'Y2-M-04', title: 'Different ways to make an amount',
    make: function (r, L) {
      var target = L === 1 ? r.pick([10, 20]) : L === 2 ? r.pick([30, 40, 50]) : r.pick([60, 70, 80, 100]);
      var ways = { 10: [[5, 5], [5, 2, 2, 1]], 20: [[10, 10], [10, 5, 5], [10, 5, 2, 2, 1]], 30: [[20, 10], [10, 10, 10], [20, 5, 5]], 40: [[20, 20], [20, 10, 10], [20, 10, 5, 5]], 50: [[20, 20, 10], [20, 10, 10, 10], [20, 20, 5, 5]],
        60: [[50, 10], [20, 20, 20], [50, 5, 5]], 70: [[50, 20], [50, 10, 10], [20, 20, 20, 10]], 80: [[50, 20, 10], [20, 20, 20, 20], [50, 10, 10, 10]], 100: [[50, 50], [50, 20, 20, 10], [20, 20, 20, 20, 20]] }[target];
      var good = r.pick(ways), bad = good.slice(); bad[bad.length - 1] = bad[bad.length - 1] === 1 ? 2 : bad[bad.length - 1] === 2 ? 1 : bad[bad.length - 1] / (bad[bad.length - 1] === 10 ? 2 : bad[bad.length - 1] === 5 ? 2.5 : 2);
      var bad2 = good.slice(0, -1); if (!bad2.length) bad2 = [good[0] / 2];
      var lab = function (l) { return l.map(K.coinName).join(' + '); };
      return K.choice('Which set of coins makes exactly <b>' + target + 'p</b>?', opts(r, lab(good), [lab(bad), lab(bad2)]), lab(good), { hint: 'Add up each set.', params: { target: target }, sol: [lab(good) + ' = ' + target + 'p.'] });
    },
    verify: function (q) { var p = q.params; return q.check.value.split(' + ').reduce(function (s, c) { return s + parseInt(c, 10); }, 0) === p.target; } });

  K.gen({ id: 'y2Change', objective: 'Y2-M-05', title: 'Money problems and change',
    make: function (r, L) {
      var name = r.pick(OM.NAMES), item = r.pick(['a pencil', 'a rubber', 'a lolly', 'a sticker', 'a comic']);
      if (L === 1) { var a = r.int(11, 40), b = r.int(5, 40); return K.int(name + ' buys ' + item + ' for ' + a + 'p and a drink for ' + b + 'p. How much is that altogether?', a + b, { suffix: 'p', hint: 'Add the two prices.', params: { paid: a + b, cost: b, a: a, k: 'tot' }, sol: [a + 'p + ' + b + 'p = ' + (a + b) + 'p.'] }); }
      var paid = L === 2 ? r.pick([20, 50]) : 100, cost = r.int(Math.floor(paid / 3), paid - 3);
      return K.int(name + ' buys ' + item + ' for ' + cost + 'p and pays with a ' + (paid === 100 ? '£1 coin' : paid + 'p coin') + '. How much change?', paid - cost, { suffix: 'p', hint: 'Count on from ' + cost + 'p to ' + paid + 'p.', params: { paid: paid, cost: cost, k: 'change' }, sol: [(paid === 100 ? '£1 = 100p. ' : '') + paid + ' − ' + cost + ' = ' + (paid - cost) + 'p.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; if (p.k === 'tot') return v - p.cost === p.a; return v + p.cost === p.paid; } });

  K.gen({ id: 'y2TimeIntervals', objective: 'Y2-M-06', title: 'Comparing lengths of time',
    make: function (r, L) {
      if (L === 1) { var ev = r.shuffle([['brushing your teeth', 2], ['a school day', 360], ['a night’s sleep', 600]]), longest = ev.slice().sort(function (a, b) { return b[1] - a[1]; })[0][0];
        return K.choice('Which usually takes the <b>longest</b>?', ev.map(function (e) { return e[0]; }), longest, { hint: 'Think about how long each one takes.', params: { ev: ev }, sol: ['A night’s sleep lasts many hours, so it is longest.'] }); }
      var n1 = r.pick(OM.NAMES), n2 = r.pick(OM.NAMES.filter(function (x) { return x !== n1; })), a = r.pick([[30, 'half an hour'], [60, 'an hour'], [15, 'a quarter of an hour']]), b = r.int(10, 50);
      if (b === a[0]) b += 5;
      if (L === 2) return K.choice(n1 + ' reads for ' + a[1] + '. ' + n2 + ' reads for ' + b + ' minutes. Who reads for <b>longer</b>?', [n1, n2], a[0] > b ? n1 : n2, { hint: 'An hour is 60 minutes. Half an hour is 30 minutes.', params: { a: a[0], b: b, n1: n1, n2: n2 }, sol: [a[1] + ' = ' + a[0] + ' minutes.', (a[0] > b ? n1 : n2) + ' reads for longer.'] });
      var times = r.sample([5, 15, 20, 35, 40, 50], 3);
      var ord = times.slice().sort(function (x, y) { return x - y; });
      return K.order('Put these in order, <b>shortest</b> first.', times.map(function (t) { return { value: String(t), label: t + ' minutes' }; }), ord.map(String), { hint: 'Fewer minutes is shorter.', params: { times: times }, answer: ord.map(function (t) { return t + ' minutes'; }).join(', '), sol: ['Shortest first: ' + ord.join(', ') + ' minutes.'] });
    },
    verify: function (q) { var p = q.params; if (p.ev) return q.check.value === 'a night’s sleep'; if (p.times) return q.check.order.every(function (v, i, a) { return !i || +a[i - 1] < +v; }); return q.check.value === (p.a > p.b ? p.n1 : p.n2); } });

  K.gen({ id: 'y2Clock', objective: 'Y2-M-07', title: 'Time to five minutes',
    make: function (r, L) {
      var h = r.int(1, 12), m = L === 1 ? r.pick([0, 15, 30, 45]) : 5 * r.int(1, 11), w = OM.clockWords(h, m);
      if (L < 3) { var wr = [OM.clockWords(h, (m + 30) % 60), OM.clockWords(h % 12 + 1, m), OM.clockWords(h, (m + 10) % 60)];
        return K.choice('What time does the clock show?', opts(r, w, wr.filter(function (x) { return x !== w; })), w, { visual: V.clock(h, m), hint: 'The long hand counts minutes in 5s. Past the 6, we say "to" the next hour.', params: { h: h, m: m }, sol: ['The long hand points at ' + (m / 5 || 12) + ', so that is ' + (m <= 30 ? m + ' minutes past' : (60 - m) + ' minutes to') + '.', 'It is ' + w + '.'] }); }
      var choices = r.shuffle([[h, m], [h, (m + 30) % 60], [(h + 1) % 12 + 1, m]]);
      return K.choice('Which clock shows <b>' + w + '</b>?', choices.map(function (c) { return { value: c[0] + ':' + c[1], label: V.clock(c[0], c[1]).replace(/width="\d+"/, 'width="120"') }; }), h + ':' + m, { hint: '"Past" times: long hand on the right. "To" times: long hand on the left.', params: { h: h, m: m, pick: true }, sol: [w + ': the long hand points at ' + (m / 5 || 12) + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.pick) return q.check.value === p.h + ':' + p.m; var m = p.m, h = p.h, nh = h === 12 ? 1 : h + 1; var exp = m === 0 ? h + ' o’clock' : m === 30 ? 'half past ' + h : m === 15 ? 'quarter past ' + h : m === 45 ? 'quarter to ' + nh : m < 30 ? m + ' minutes past ' + h : (60 - m) + ' minutes to ' + nh; return q.check.value === exp; } });

  K.gen({ id: 'y2TimeFacts', objective: 'Y2-M-08', title: 'Minutes in an hour, hours in a day',
    make: function (r, L) {
      if (L === 1) { var f = r.pick([['minutes', 'an hour', 60], ['hours', 'a day', 24]]); return K.int('How many ' + f[0] + ' are there in ' + f[1] + '?', f[2], { hint: f[2] === 60 ? 'The long hand goes all the way round in one hour.' : 'The short hand goes round the clock twice in one day.', params: { f: f }, sol: ['There are ' + f[2] + ' ' + f[0] + ' in ' + f[1] + '.'] }); }
      if (L === 2) { var hrs = r.pick([2, 3]); return K.int('How many minutes are there in ' + hrs + ' hours?', 60 * hrs, { suffix: 'minutes', hint: 'Each hour is 60 minutes.', params: { per: 60, n: hrs }, sol: [hrs + ' × 60 = ' + 60 * hrs + ' minutes.'] }); }
      var d = r.pick([2, 3]); return K.int('How many hours are there in ' + d + ' days?', 24 * d, { suffix: 'hours', hint: 'Each day is 24 hours.', params: { per: 24, n: d }, sol: [d + ' × 24 = ' + 24 * d + ' hours.'] });
    },
    verify: function (q) { var p = q.params; if (p.f) return q.check.value === (p.f[0] === 'minutes' ? 60 : 24); var s = 0; for (var i = 0; i < p.n; i++) s += p.per; return s === q.check.value; } });

  // ================= GEOMETRY =================
  var POLY = ['triangle', 'square', 'rectangle', 'pentagon', 'hexagon', 'octagon'];
  K.gen({ id: 'y2Shape2D', objective: 'Y2-G-01', title: 'Sides, vertices and symmetry',
    make: function (r, L) {
      var s = r.pick(POLY);
      if (L === 1) return K.int('How many <b>sides</b> does this shape have?', K.SIDES[s], { visual: V.shape2d(s), hint: 'Put your finger on one side and count round.', params: { s: s }, sol: ['A ' + s + ' has ' + K.SIDES[s] + ' sides.'] });
      if (L === 2) return K.int('How many <b>vertices</b> (corners) does a ' + s + ' have?', K.SIDES[s], { visual: V.shape2d(s), hint: 'A vertex is a corner where two sides meet.', params: { s: s }, sol: ['A ' + s + ' has ' + K.SIDES[s] + ' vertices.'] });
      var shapes = [['square', true], ['rectangle', true], ['triangle', true], ['pentagon', true], ['hexagon', true], ['circle', true]], pick = r.pick(shapes)[0], yes = r.chance(0.6);
      var cand = yes ? pick : 'semicircle';
      return K.choice('Is the dashed line a <b>line of symmetry</b>?', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], cand === 'semicircle' ? 'no' : 'yes', { visual: cand === 'semicircle' ? V.svg(150, 110, V.rect(10, 20, 130, 70, { fill: '#cfe0fa', stroke: '#2d2a26', w: 3 }) + V.line(52, 8, 52, 102, { dash: '6 5', w: 2, stroke: '#d9534f' })) : V.shape2d(cand, { sym: true }),
        hint: 'If you folded the shape along the line, would the two halves match?', params: { s: cand }, sol: [cand === 'semicircle' ? 'The line is not in the middle. The two parts are different sizes, so it is not a line of symmetry.' : 'Both halves match exactly, so it is a line of symmetry.'] });
    },
    verify: function (q) { var p = q.params; if (q.check.kind === 'choice') return q.check.value === (p.s === 'semicircle' ? 'no' : 'yes'); var pts = { triangle: 3, square: 4, rectangle: 4, pentagon: 5, hexagon: 6, octagon: 8 }; return pts[p.s] === q.check.value; } });

  var SOLID_FACTS = { cube: [6, 12, 8], cuboid: [6, 12, 8], 'square-based pyramid': [5, 8, 5], 'triangular prism': [5, 9, 6] };
  K.gen({ id: 'y2Shape3D', objective: 'Y2-G-02', title: 'Faces, edges and vertices',
    make: function (r, L) {
      var s = r.pick(Object.keys(SOLID_FACTS)), what = L === 1 ? 'faces' : L === 2 ? 'vertices' : 'edges', i = { faces: 0, edges: 1, vertices: 2 }[what];
      return K.int('How many <b>' + what + '</b> does a ' + s + ' have?', SOLID_FACTS[s][i], { visual: V.solid(s), hint: what === 'faces' ? 'Faces are the flat surfaces.' : what === 'edges' ? 'Edges are where two faces meet.' : 'Vertices are the corners.', params: { s: s, i: i },
        sol: ['A ' + s + ' has ' + SOLID_FACTS[s][0] + ' faces, ' + SOLID_FACTS[s][1] + ' edges and ' + SOLID_FACTS[s][2] + ' vertices.'] });
    },
    verify: function (q) { var p = q.params, f = K.SOLIDS[p.s]; return q.check.value === [f.faces, f.edges, f.vertices][p.i]; } });

  var FACE_Q = [['cylinder', 'circle'], ['cone', 'circle'], ['cube', 'square'], ['square-based pyramid', 'triangle'], ['triangular prism', 'triangle'], ['cuboid', 'rectangle']];
  K.gen({ id: 'y2Faces', objective: 'Y2-G-03', title: '2-D shapes on 3-D shapes',
    make: function (r, L) {
      var f = r.pick(L === 1 ? FACE_Q.slice(0, 3) : FACE_Q);
      return K.choice('What 2-D shape can you see on the surface of this ' + f[0] + '?', opts(r, f[1], ['circle', 'square', 'triangle', 'rectangle'].filter(function (x) { return x !== f[1]; }).slice(0, 2)), f[1], { visual: V.solid(f[0]), hint: 'Imagine printing with it in paint. What shape would the print be?', params: { f: f },
        sol: ['A ' + f[0] + ' has ' + (f[1] === 'circle' ? 'a circle' : f[1] === 'triangle' ? 'triangles' : f[1] === 'square' ? 'squares' : 'rectangles') + ' on its surface.'] });
    },
    verify: function (q) { var p = q.params; return FACE_Q.some(function (x) { return x[0] === p.f[0] && x[1] === q.check.value; }); } });

  K.gen({ id: 'y2Sort', objective: 'Y2-G-04', title: 'Sorting shapes',
    make: function (r, L) {
      if (L < 3) { var four = r.pick(['square', 'rectangle']), others = r.sample(['triangle', 'pentagon', 'hexagon', 'circle'], 2);
        return K.choice('Which shape has exactly <b>4 sides</b>?', r.shuffle([four].concat(others)).map(function (s) { return { value: s, label: V.shape2d(s, { size: 60 }) + '<br>' + s }; }), four, { hint: 'Count the sides of each shape.', params: { s: four, k: 'four' }, sol: ['A ' + four + ' has 4 sides.'] }); }
      var set = r.pick([[['cube', 'cuboid', 'square-based pyramid'], 'sphere', 'It is the only one with no flat faces.'], [['sphere', 'cylinder', 'cone'], 'cube', 'It is the only one that cannot roll.'], [['triangle', 'square', 'pentagon'], 'circle', 'It is the only one with no straight sides.']]);
      var all = r.shuffle(set[0].concat([set[1]]));
      return K.choice('Which is the <b>odd one out</b>?', all, set[1], { hint: 'What do three of them have in common?', params: { odd: set[1], k: 'odd' }, sol: ['The odd one out is the ' + set[1] + '.', set[2]] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'four') return K.SIDES[q.check.value] === 4; return q.check.value === p.odd; } });

  K.gen({ id: 'y2Patterns', objective: 'Y2-P-01', title: 'Patterns and sequences',
    make: function (r, L) {
      var unit = L === 1 ? r.sample(['circle', 'square', 'triangle'], 2) : r.sample(['circle', 'square', 'triangle', 'star'], 3), len = unit.length * 2 + 1;
      var seq = []; for (var i = 0; i < len; i++) seq.push(unit[i % unit.length]);
      var pos = L === 3 ? r.int(12, 20) : len + 1, ans = unit[(pos - 1) % unit.length];
      return K.choice(L === 3 ? 'The pattern keeps repeating. What will the <b>' + pos + 'th</b> shape be?' : 'What comes next in the pattern?', unit.slice().sort(), ans, { visual: V.shapeRow(seq.concat(L === 3 ? [] : ['?'])), hint: L === 3 ? 'The pattern repeats every ' + unit.length + ' shapes. Count on in ' + unit.length + 's.' : 'Say the pattern out loud.', params: { unit: unit, pos: pos },
        sol: ['The pattern repeats: ' + unit.join(', ') + '.', 'Shape number ' + pos + ' is a ' + ans + '.'] });
    },
    verify: function (q) { var p = q.params, i = 0; for (var k = 1; k < p.pos; k++) i = i + 1 === p.unit.length ? 0 : i + 1; return q.check.value === p.unit[i]; } });

  K.gen({ id: 'y2Turns', objective: 'Y2-P-02', title: 'Turns, right angles and direction',
    make: function (r, L) {
      var things = r.pick([['tree', 'house', 'pond', 'swing'], ['door', 'window', 'board', 'sink'], ['castle', 'bridge', 'river', 'tower']]), face = r.int(0, 3);
      if (L === 1) { var t = r.pick([1, 2, 3]), name = { 1: 'a quarter turn', 2: 'a half turn', 3: 'a three-quarter turn' }[t]; return K.int('How many <b>right angles</b> are there in ' + name + '?', t, { hint: 'A quarter turn is 1 right angle.', params: { t: t, k: 'ra' }, sol: [name.charAt(2).toUpperCase() === 'Q' ? 'A quarter turn is 1 right angle.' : name + ' is ' + t + ' right angles.'] }); }
      var turn = L === 2 ? r.pick([1, 2]) : r.pick([1, 3]), cw = r.chance(0.5), steps = cw ? turn : 4 - turn, end = (face + steps) % 4;
      var name2 = { 1: 'a quarter turn', 2: 'a half turn', 3: 'a three-quarter turn' }[turn];
      return K.choice('Pip faces the <b>' + things[face] + '</b>. Pip makes ' + name2 + ' <b>' + (cw ? 'clockwise' : 'anti-clockwise') + '</b>. What does Pip face now?', r.shuffle(things.slice()), things[end],
        { visual: V.turnScene(things, face), hint: 'Clockwise turns the same way as clock hands. Anti-clockwise turns the other way.', params: { things: things, face: face, turn: turn, cw: cw, k: 'turn' }, sol: [name2 + ' ' + (cw ? 'clockwise' : 'anti-clockwise') + ' from the ' + things[face] + ' ends facing the ' + things[end] + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'ra') return q.check.value === p.t; var i = p.face; for (var k = 0; k < p.turn; k++) i = p.cw ? (i + 1) % 4 : (i + 3) % 4; return q.check.value === p.things[i]; } });

  // ================= STATISTICS =================
  var CATS = [['apples', 'bananas', 'grapes', 'pears'], ['red', 'blue', 'green', 'yellow'], ['cats', 'dogs', 'fish', 'rabbits']];
  K.gen({ id: 'y2Pictogram', objective: 'Y2-S-01', title: 'Pictograms, tally charts and block diagrams',
    make: function (r, L) {
      var cats = r.pick(CATS), i = r.int(0, 3);
      if (L === 1) { var n = r.int(3, 18); return K.int('How many does this tally show?', n, { visual: V.tally(n), hint: 'Each bundle with a line across is 5.', params: { n: n, k: 'tally' }, sol: [Math.floor(n / 5) + ' fives and ' + n % 5 + ' more make ' + n + '.'] }); }
      var key = L === 2 ? 1 : 2, vals = cats.map(function () { return key * r.int(1, 8); });
      return K.int('The pictogram shows favourite ' + (cats[0] === 'red' ? 'colours' : cats[0] === 'cats' ? 'pets' : 'fruit') + '. How many chose <b>' + cats[i] + '</b>?', vals[i], { visual: V.pictogram({ cats: cats, values: vals, key: key, unit: key === 1 ? 'child' : 'children' }), hint: key === 1 ? 'Each picture is 1 child.' : 'Each picture is 2 children. Count in 2s.', params: { vals: vals, i: i, key: key, k: 'pic' }, sol: [cats[i] + ' has ' + vals[i] / key + ' picture' + (vals[i] / key > 1 ? 's' : '') + '.', 'That is ' + vals[i] + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'tally') return q.check.value === p.n; var s = 0; for (var j = 0; j < p.vals[p.i] / p.key; j++) s += p.key; return s === q.check.value; } });

  K.gen({ id: 'y2Sorting', objective: 'Y2-S-02', title: 'Most and least popular',
    make: function (r, L) {
      var cats = r.pick(CATS), vals = r.sample([2, 3, 4, 5, 6, 7, 8, 9, 10], 4), most = r.chance(0.5);
      var vis = V.barChart({ cats: cats, values: vals, step: 1, max: 10, labelEvery: 2, ylabel: 'Children' });
      if (L < 3) { var ans = cats[vals.indexOf(most ? Math.max.apply(null, vals) : Math.min.apply(null, vals))];
        return K.choice('Which was the <b>' + (most ? 'most' : 'least') + '</b> popular?', cats.slice(), ans, { visual: vis, hint: 'Find the ' + (most ? 'tallest' : 'shortest') + ' block.', params: { cats: cats, vals: vals, most: most, k: 'pick' }, sol: [ans + ' has the ' + (most ? 'tallest' : 'shortest') + ' block.'] }); }
      var ord = cats.slice().sort(function (a, b) { return vals[cats.indexOf(b)] - vals[cats.indexOf(a)]; });
      return K.order('Sort them from <b>most</b> popular to <b>least</b> popular.', cats.map(function (c) { return { value: c, label: c }; }), ord, { visual: vis, hint: 'Start with the tallest block.', params: { cats: cats, vals: vals, k: 'order' }, answer: ord.join(', '), sol: ['Most to least: ' + ord.join(', ') + '.'] });
    },
    verify: function (q) { var p = q.params, v = function (c) { return p.vals[p.cats.indexOf(c)]; }; if (p.k === 'pick') return p.vals.every(function (x) { return p.most ? x <= v(q.check.value) : x >= v(q.check.value); }); return q.check.order.every(function (c, i, a) { return !i || v(a[i - 1]) > v(c); }); } });

  K.gen({ id: 'y2DataTotals', objective: 'Y2-S-03', title: 'Totals and differences in data',
    make: function (r, L) {
      var cats = r.pick(CATS), vals = r.sample([2, 3, 4, 5, 6, 7, 8, 9, 10], 4), i = r.int(0, 3), j = (i + r.int(1, 3)) % 4;
      var vis = V.table(['Choice', 'Children'], cats.map(function (c, k) { return [c, String(vals[k])]; }));
      if (L === 1) return K.int('How many children chose <b>' + cats[i] + '</b> or <b>' + cats[j] + '</b>?', vals[i] + vals[j], { visual: vis, hint: 'Add the two numbers.', params: { vals: vals, use: [i, j], k: 'sum' }, sol: [vals[i] + ' + ' + vals[j] + ' = ' + (vals[i] + vals[j]) + '.'] });
      var big = vals[i] > vals[j] ? i : j, small = big === i ? j : i;
      if (L === 2) return K.int('How many <b>more</b> children chose ' + cats[big] + ' than ' + cats[small] + '?', vals[big] - vals[small], { visual: vis, hint: 'Find the difference: take the smaller from the bigger.', params: { vals: vals, big: big, small: small, k: 'diff' }, sol: [vals[big] + ' − ' + vals[small] + ' = ' + (vals[big] - vals[small]) + '.'] });
      return K.int('How many children were asked <b>altogether</b>?', K.sum(vals), { visual: vis, hint: 'Add all four numbers.', params: { vals: vals, use: [0, 1, 2, 3], k: 'sum' }, sol: [vals.join(' + ') + ' = ' + K.sum(vals) + '.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; if (p.k === 'diff') return v + p.vals[p.small] === p.vals[p.big]; var s = 0; p.use.forEach(function (k) { for (var n = 0; n < p.vals[k]; n++) s++; }); return s === v; } });
})(typeof window !== 'undefined' ? window : globalThis);
