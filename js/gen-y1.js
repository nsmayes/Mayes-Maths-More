/* Learn with Pip — Year 1 question generators. Numbers stay within 100; no decimals or negative numbers.
   Sentences are short and most questions have a picture. Each generator's verify() works the answer out another way.
   Levels: 1 getting there, 2 expected, 3 greater depth. */
(function (G) {
  'use strict';
  var OM = G.OM, K = OM.kit, V = OM.V, S = K.S;
  function opts(r, correct, wrongs) { var seen = {}; return r.shuffle([correct].concat(wrongs).filter(function (x) { var k = String(x); if (seen[k]) return false; seen[k] = 1; return true; })).map(function (x) { return { value: String(x), label: String(x) }; }); }
  function count(n) { var c = 0; for (var i = 0; i < n; i++) c++; return c; }
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  OM.clockWords = function (h, m) {
    var nh = h % 12 + 1;
    if (m === 0) return h + ' o’clock'; if (m === 30) return 'half past ' + h; if (m === 15) return 'quarter past ' + h; if (m === 45) return 'quarter to ' + nh;
    return m < 30 ? m + ' minutes past ' + h : (60 - m) + ' minutes to ' + nh;
  };

  // ================= NUMBER AND PLACE VALUE =================
  K.gen({ id: 'y1Count', objective: 'Y1-NPV-01', title: 'Counting forwards and backwards',
    make: function (r, L) {
      var down = L > 1 && r.chance(0.5), start = L === 1 ? r.int(0, 14) : L === 2 ? r.int(10, 60) : r.int(70, 94);
      if (down) start = L === 2 ? r.int(16, 60) : r.int(76, 100);
      var terms = []; for (var i = 0; i < 6; i++) terms.push(down ? start - i : start + i);
      var blanks = r.sample([1, 2, 3, 4, 5], L === 1 ? 1 : 2).sort();
      var tpl = terms.map(function (t, i) { var b = blanks.indexOf(i); return b >= 0 ? '{' + b + '}' : String(t); }).join(', ');
      return K.multi('Count ' + (down ? 'back' : 'on') + ' in ones. Fill in the missing ' + (blanks.length > 1 ? 'numbers.' : 'number.'), tpl, blanks.map(function (b) { return { kind: 'int', value: terms[b] }; }),
        { blanks: blanks.map(function () { return { keys: 'digits', small: true }; }), hint: down ? 'Each number is one less.' : 'Each number is one more.', params: { terms: terms, down: down, blanks: blanks }, answer: blanks.map(function (b) { return terms[b]; }).join(' and '),
          visual: V.numberLine({ min: Math.min(terms[0], terms[5]), max: Math.max(terms[0], terms[5]), step: 1, width: 360, labelValues: terms.filter(function (t, i) { return blanks.indexOf(i) < 0; }) }), sol: ['The numbers go: ' + terms.join(', ') + '.'] });
    },
    verify: function (q) { var p = q.params; return p.blanks.every(function (b, i) { return q.check.parts[i].value === p.terms[0] + (p.down ? -b : b); }) && Math.max.apply(null, p.terms) <= 100; } });

  K.gen({ id: 'y1Steps', objective: 'Y1-NPV-02', title: 'Counting in 2s, 5s and 10s',
    make: function (r, L) {
      var step = L === 1 ? 10 : L === 2 ? 5 : 2, k = r.int(0, Math.floor(100 / step) - 5), terms = [0, 1, 2, 3].map(function (i) { return (k + i) * step; });
      return K.int('Count in <b>' + step + 's</b>. What comes next?<br><b>' + terms.join(', ') + ', …</b>', terms[3] + step, { hint: 'Add ' + step + ' to the last number.', params: { terms: terms, step: step },
        sol: ['Counting in ' + step + 's: ' + terms.join(', ') + ', ' + (terms[3] + step) + '.'] });
    },
    verify: function (q) { var p = q.params, x = p.terms[3]; for (var i = 0; i < p.step; i++) x++; return x === q.check.value && x <= 100; } });

  K.gen({ id: 'y1MoreLess', objective: 'Y1-NPV-03', title: '1 more and 1 less',
    make: function (r, L) {
      var n = L === 1 ? r.int(2, 19) : L === 2 ? r.int(20, 98) : r.pick([19, 29, 39, 49, 59, 69, 79, 89, 20, 30, 40, 50, 60, 70, 80, 90]);
      var more = L === 3 ? n % 10 === 9 : r.chance(0.5);
      return K.int('What is <b>1 ' + (more ? 'more' : 'less') + '</b> than ' + n + '?', more ? n + 1 : n - 1, { hint: more ? 'Count on one.' : 'Count back one.', params: { n: n, more: more },
        visual: n <= 20 ? V.dots(n, { perRow: 10, group: 5 }) : '', sol: ['1 ' + (more ? 'more' : 'less') + ' than ' + n + ' is ' + (more ? n + 1 : n - 1) + '.'] });
    },
    verify: function (q) { var p = q.params; return p.more ? q.check.value - 1 === p.n : q.check.value + 1 === p.n; } });

  K.gen({ id: 'y1Compare', objective: 'Y1-NPV-04', title: 'More, less, most and least',
    make: function (r, L) {
      if (L === 1) { var n = r.int(3, 20); return K.int('How many dots are there?', n, { visual: V.dots(n, { perRow: 10, group: 5 }), hint: 'Count each dot once. Look for groups of 5.', params: { n: n, k: 'count' }, sol: ['There are ' + n + ' dots.'] }); }
      if (L === 2) { var a = r.int(2, 20), b = r.int(2, 20); while (b === a) b = r.int(2, 20); var askMore = r.chance(0.5);
        return K.choice('Which number is <b>' + (askMore ? 'more' : 'less') + '</b>?', [String(a), String(b)], String(askMore ? Math.max(a, b) : Math.min(a, b)), { big: true, hint: 'Which comes later when you count? That one is more.', params: { a: a, b: b, more: askMore, k: 'two' },
          sol: [Math.max(a, b) + ' is more than ' + Math.min(a, b) + '.'] }); }
      var nums = r.sample([12, 21, 15, 51, 34, 43, 27, 72, 9, 90, 46, 64, 38, 83], 3), most = r.chance(0.5);
      return K.choice('Which number is the <b>' + (most ? 'most' : 'least') + '</b>?', nums.map(String), String(most ? Math.max.apply(null, nums) : Math.min.apply(null, nums)), { big: true, hint: 'Look at the tens first.', params: { nums: nums, most: most, k: 'three' },
        sol: ['Compare the tens digits first.', 'The ' + (most ? 'most' : 'least') + ' is ' + (most ? Math.max.apply(null, nums) : Math.min.apply(null, nums)) + '.'] });
    },
    verify: function (q) { var p = q.params, v = +q.check.value; if (p.k === 'count') return count(p.n) === v; var list = p.k === 'two' ? [p.a, p.b] : p.nums, wantBig = p.k === 'two' ? p.more : p.most; return list.every(function (x) { return wantBig ? x <= v : x >= v; }); } });

  K.gen({ id: 'y1Words', objective: 'Y1-NPV-05', title: 'Numbers to 20 in words',
    make: function (r, L) {
      var n = r.int(L === 1 ? 1 : 6, L === 1 ? 10 : 20), w = K.toWords(n);
      if (L === 1) return K.int('Write this number in digits: <b>' + w + '</b>', n, { hint: 'Say the word. Then write the number.', params: { n: n, w: w }, visual: V.dots(n, { perRow: 10, group: 5 }), sol: ['"' + w + '" is ' + n + '.'] });
      if (L === 2) return K.choice('Which word is <b>' + n + '</b>?', opts(r, w, [K.toWords(n + 1 > 20 ? n - 2 : n + 1), K.toWords(n > 10 ? n - 10 : n + 10)]), w, { hint: 'Say the number out loud.', params: { n: n }, sol: [n + ' is "' + w + '".'] });
      return K.words('Write <b>' + n + '</b> in words.', n, { hint: 'Say it out loud, then spell it.', params: { n: n }, answer: w, sol: [n + ' in words is "' + w + '".'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; return (typeof v === 'number' ? v : K.fromWords(v)) === p.n && K.fromWords(K.toWords(p.n)) === p.n; } });

  // ================= ADDITION AND SUBTRACTION =================
  K.gen({ id: 'y1Statements', objective: 'Y1-AS-01', title: 'Reading + − and = sentences',
    make: function (r, L) {
      var a = r.int(1, 9), b = r.int(1, 9), add = L === 1 || r.chance(0.5); if (!add && b > a) { var t = a; a = b; b = t; }
      var ans = add ? a + b : a - b, sign = add ? '+' : '−';
      if (L === 1) return K.int('<b>' + a + ' + ' + b + ' = ?</b>', ans, { visual: V.dots(a + b, { perRow: 10, colours: Array.apply(null, Array(a + b)).map(function (x, i) { return i < a ? V.colors.amber : V.colors.sky; }) }), hint: 'Count all the dots.', params: { a: a, b: b, add: add }, sol: [a + ' and ' + b + ' more make ' + ans + '.'] });
      if (L === 2) { var right = a + ' ' + sign + ' ' + b + ' = ' + ans, story = add ? 'There are ' + a + ' ducks. ' + b + ' more come. Now there are ' + ans + '.' : 'There are ' + a + ' ducks. ' + b + ' fly away. Now there are ' + ans + '.';
        return K.choice(story + ' Which number sentence matches?', opts(r, right, [a + ' ' + (add ? '−' : '+') + ' ' + b + ' = ' + ans, a + ' ' + sign + ' ' + ans + ' = ' + b]), right, { hint: add ? 'More came, so add.' : 'Some went away, so take away.', params: { a: a, b: b, add: add, ans: ans }, sol: ['The sentence is ' + right + '.'] }); }
      var wrongAns = ans + r.pick([1, 2]), shown = r.chance(0.5) ? ans : wrongAns;
      return K.choice('Is this true or false?<br><b>' + a + ' ' + sign + ' ' + b + ' = ' + shown + '</b>', ['true', 'false'], shown === ans ? 'true' : 'false', { big: true, hint: 'Work out ' + a + ' ' + sign + ' ' + b + '.', params: { a: a, b: b, add: add, shown: shown }, sol: [a + ' ' + sign + ' ' + b + ' = ' + ans + ', so it is ' + (shown === ans ? 'true.' : 'false.')] });
    },
    verify: function (q) {
      var p = q.params, real = 0, i; for (i = 0; i < p.a; i++) real++; for (i = 0; i < p.b; i++) real += p.add ? 1 : -1;
      if (p.shown !== undefined) return q.check.value === (p.shown === real ? 'true' : 'false');
      if (p.ans !== undefined) { var m = q.check.value.match(/^(\d+) ([+−]) (\d+) = (\d+)$/); return +m[1] === p.a && +m[3] === p.b && +m[4] === real && (m[2] === '+') === p.add; }
      return q.check.value === real;
    } });

  K.gen({ id: 'y1Bonds', objective: 'Y1-AS-02', title: 'Number bonds to 10 and 20',
    make: function (r, L) {
      var tot = L === 1 ? 10 : L === 2 ? r.pick([10, 20]) : 20, a = r.int(1, tot - 1), sub = L === 3 && r.chance(0.5);
      if (sub) return K.int('<b>' + tot + ' − ' + a + ' = ?</b>', tot - a, { hint: 'Use the bond: ' + a + ' + ? = ' + tot + '.', params: { tot: tot, a: a }, sol: [a + ' + ' + (tot - a) + ' = ' + tot + ', so ' + tot + ' − ' + a + ' = ' + (tot - a) + '.'] });
      return K.int('<b>' + a + ' + ? = ' + tot + '</b>', tot - a, { visual: tot === 10 ? V.dots(10, { perRow: 5, colours: Array.apply(null, Array(10)).map(function (x, i) { return i < a ? V.colors.amber : '#fff'; }) }) : '', hint: tot === 10 ? 'Count the empty spaces.' : 'Think of the bond to 10 first.', params: { tot: tot, a: a },
        sol: [a + ' + ' + (tot - a) + ' = ' + tot + '.'] });
    },
    verify: function (q) { var p = q.params, c = p.a; while (c < p.tot) c++; return c - p.a === q.check.value; } });

  K.gen({ id: 'y1AddSub', objective: 'Y1-AS-03', title: 'Adding and subtracting to 20',
    make: function (r, L) {
      var add = r.chance(0.5), a, b;
      if (L === 1) { a = r.int(0, 9); b = r.int(0, 9 - Math.min(a, 9)); if (!add) { a = r.int(1, 10); b = r.int(0, a); } }
      else if (L === 2) { a = r.int(10, 18); b = r.int(0, add ? 20 - a : a - 10); }
      else { a = r.int(3, 9); b = r.int(10 - a + 1, 9); if (!add) { a = r.int(11, 18); b = r.int(a - 9, 9); } }
      var ans = add ? a + b : a - b;
      return K.int('<b>' + a + (add ? ' + ' : ' − ') + b + ' = ?</b>', ans, { hint: !b ? (add ? 'Adding 0 leaves the number the same.' : 'Taking away 0 leaves the number the same.') : (add ? 'Count up ' : 'Count back ') + b + ' from ' + a + '.', params: { a: a, b: b, add: add },
        // the line stays clean: the child draws the jumps, and "Show me how" counts them out
        visual: V.tapLine({ min: L === 2 ? 10 : 0, max: L === 1 ? 10 : 20, from: a, to: ans }),
        shown: V.numberLine({ min: 0, max: 20, step: 1, labelEvery: 1, hops: b ? [{ from: a, to: ans, label: (add ? '+' : '−') + b }] : [] }), sol: [a + (add ? ' + ' : ' − ') + b + ' = ' + ans + '.'] });
    },
    verify: function (q) { var p = q.params, x = p.a; for (var i = 0; i < p.b; i++) x += p.add ? 1 : -1; return x === q.check.value && x >= 0 && x <= 20; } });

  K.gen({ id: 'y1Problems', objective: 'Y1-AS-04', title: 'Story problems and missing numbers',
    make: function (r, L) {
      var name = r.pick(OM.NAMES), thing = r.pick(['apples', 'stickers', 'shells', 'marbles', 'cars']);
      if (L === 1) { var a = r.int(2, 9), b = r.int(1, 9); return K.int(name + ' has ' + a + ' ' + thing + '. ' + name + ' gets ' + b + ' more. How many now?', a + b, { visual: V.dots(a + b, { perRow: 10, group: 5 }), hint: 'Add them together.', params: { a: a, b: b, k: 'add' }, sol: [a + ' + ' + b + ' = ' + (a + b) + '.'] }); }
      if (L === 2) { var c = r.int(8, 20), d = r.int(1, c - 1); return K.int(name + ' has ' + c + ' ' + thing + '. ' + name + ' gives away ' + d + '. How many are left?', c - d, { hint: 'Take away ' + d + '.', params: { a: c, b: d, k: 'sub' }, sol: [c + ' − ' + d + ' = ' + (c - d) + '.'] }); }
      var x = r.int(1, 9), y = r.int(1, 9), whole = x + y;
      return K.int('Find the missing number: <b>' + x + ' = ? − ' + y + '</b>', whole, { hint: 'What number take away ' + y + ' leaves ' + x + '? Try adding ' + x + ' + ' + y + '.', params: { a: x, b: y, k: 'miss' }, sol: [x + ' + ' + y + ' = ' + whole + '.', 'So ' + x + ' = ' + whole + ' − ' + y + '.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value; if (p.k === 'add') return v - p.b === p.a; if (p.k === 'sub') return v + p.b === p.a; return v - p.b === p.a; } });

  // ================= MULTIPLICATION AND DIVISION =================
  K.gen({ id: 'y1Groups', objective: 'Y1-MD-01', title: 'Groups, sharing and doubling',
    make: function (r, L) {
      if (L === 1) { var g = r.int(2, 5), e = r.pick([2, 5, 10]); return K.int('There are ' + g + ' groups of ' + e + '. How many altogether?', g * e, { visual: V.array(g, e), hint: 'Count in ' + e + 's.', params: { g: g, e: e, k: 'groups' }, sol: ['Count in ' + e + 's ' + g + ' times: ' + g * e + '.'] }); }
      if (L === 2) { var n = r.int(1, 10); return K.int('What is <b>double ' + n + '</b>?', 2 * n, { visual: V.dots(2 * n, { perRow: n }), hint: 'Double means two lots of the same number.', params: { n: n, k: 'double' }, sol: ['Double ' + n + ' is ' + n + ' + ' + n + ' = ' + 2 * n + '.'] }); }
      var people = r.pick([2, 5, 10]), each = r.int(2, people === 10 ? 5 : 10), tot = people * each;
      return K.int(tot + ' sweets are shared equally between ' + people + ' children. How many does each child get?', each, { hint: 'Share them out one at a time.', params: { tot: tot, p: people, k: 'share' }, sol: [tot + ' shared between ' + people + ' is ' + each + ' each.'] });
    },
    verify: function (q) { var p = q.params, v = q.check.value, s = 0, i; if (p.k === 'groups') { for (i = 0; i < p.g; i++) s += p.e; return s === v; } if (p.k === 'double') return v - p.n === p.n; for (i = 0; i < p.p; i++) s += v; return s === p.tot; } });

  // ================= FRACTIONS =================
  function halfQuarter(id, obj, d, word) {
    K.gen({ id: id, objective: obj, title: 'Finding a ' + word,
      make: function (r, L) {
        if (L === 1) {
          var food = r.pick(['cake', 'pizza', 'sandwich', 'chocolate bar', 'pie', 'flapjack']), eqPics = [V.splitRect(d === 2 ? [0.5, 0.5] : [0.25, 0.25, 0.25, 0.25], [0], { w: 150, h: 56 }), V.pie(d, 1, { r: 34 }), V.fractionBar(d, 1, { w: 150, h: 40 })];
          var cut = function () { return r.pick(d === 2 ? [[0.3, 0.7], [0.25, 0.75], [0.68, 0.32], [0.72, 0.28]] : [[0.1, 0.2, 0.3, 0.4], [0.42, 0.15, 0.28, 0.15], [0.12, 0.45, 0.23, 0.2], [0.4, 0.3, 0.2, 0.1]]); };
          var pics = { eq: r.pick(eqPics), un1: V.splitRect(cut(), [0], { w: 150, h: 56 }), un2: r.chance(0.5) ? V.pie(d === 2 ? 3 : 3, 1, { r: 34 }) : V.splitRect(cut(), [0], { w: 150, h: 56 }) };
          return K.choice('Pip shares a ' + food + ' fairly. Which picture shows <b>one ' + word + '</b> shaded?', r.shuffle(['eq', 'un1', 'un2']).map(function (k) { return { value: k, label: pics[k] }; }), 'eq', { hint: 'A ' + word + ' is 1 of ' + d + ' <b>equal</b> parts.', params: { d: d, k: 'pic', food: food }, sol: ['The ' + word + ' must be 1 of ' + d + ' equal parts.'] });
        }
        var n = d * r.int(L === 2 ? 1 : d === 2 ? 6 : 3, L === 2 ? (d === 2 ? 10 : 5) : d === 2 ? 20 : 10);
        return K.int('What is <b>a ' + word + ' of ' + n + '</b>?', n / d, { visual: n <= 20 ? V.dots(n, { perRow: n / d }) : '', hint: 'Share ' + n + ' into ' + d + ' equal groups.', params: { n: n, d: d, k: 'qty' }, sol: [n + ' shared into ' + d + ' equal groups is ' + n / d + ' in each.'] });
      },
      verify: function (q) { var p = q.params; if (p.k === 'pic') return q.check.value === 'eq'; var s = 0; for (var i = 0; i < p.d; i++) s += q.check.value; return s === p.n; } });
  }
  halfQuarter('y1Half', 'Y1-F-01', 2, 'half');
  halfQuarter('y1Quarter', 'Y1-F-02', 4, 'quarter');

  // ================= MEASUREMENT =================
  K.gen({ id: 'y1CompareMeasure', objective: 'Y1-M-01', title: 'Longer, heavier, fuller, quicker',
    make: function (r, L) {
      if (L === 1) { var a = r.int(3, 9), b = r.int(3, 9); while (b === a) b = r.int(3, 9); var askLong = r.chance(0.5);
        return K.choice('Which ribbon is <b>' + (askLong ? 'longer' : 'shorter') + '</b>?', ['red', 'blue'], (a > b) === askLong ? 'red' : 'blue', { visual: V.svg(320, 80, V.rect(10, 10, a * 30, 20, { fill: V.colors.berry, stroke: V.colors.berry }) + V.rect(10, 48, b * 30, 20, { fill: V.colors.sky, stroke: V.colors.sky })),
          hint: 'Both start at the same place. Look where they end.', params: { a: a, b: b, long: askLong, k: 'rib' }, sol: ['The ' + ((a > b) === askLong ? 'red' : 'blue') + ' ribbon is ' + (askLong ? 'longer.' : 'shorter.')] }); }
      if (L === 2) { var p1 = r.pick(['a book', 'an apple', 'a bag of sugar']), w1 = r.int(2, 9), w2 = r.int(2, 9); while (w2 === w1) w2 = r.int(2, 9); var heavy = r.chance(0.5);
        return K.choice('A teddy weighs ' + w1 + ' cubes. A ball weighs ' + w2 + ' cubes. Which is <b>' + (heavy ? 'heavier' : 'lighter') + '</b>?', ['teddy', 'ball'], (w1 > w2) === heavy ? 'teddy' : 'ball', { hint: 'More cubes means heavier.', params: { a: w1, b: w2, long: heavy, k: 'wt' }, sol: ['The ' + ((w1 > w2) === heavy ? 'teddy' : 'ball') + ' is ' + (heavy ? 'heavier.' : 'lighter.')] }); }
      var len = r.int(2, 10), half = r.chance(0.5);
      if (half) len *= 2;
      return K.int('A snake is ' + len + ' cm long. Another snake is <b>' + (half ? 'half' : 'double') + '</b> as long. How long is it?', half ? len / 2 : len * 2, { suffix: 'cm', hint: half ? 'Half means share into 2 equal parts.' : 'Double means add it to itself.', params: { len: len, half: half, k: 'dh' }, sol: [(half ? 'Half of ' : 'Double ') + len + ' is ' + (half ? len / 2 : len * 2) + ' cm.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'dh') return p.half ? q.check.value + q.check.value === p.len : q.check.value === p.len + p.len; var first = p.k === 'rib' ? 'red' : 'teddy', second = p.k === 'rib' ? 'blue' : 'ball'; return q.check.value === ((p.a > p.b) === p.long ? first : second); } });

  var COINS = [1, 2, 5, 10, 20, 50, 100, 200];
  K.gen({ id: 'y1Coins', objective: 'Y1-M-02', title: 'Coins and notes',
    make: function (r, L) {
      if (L === 1) { var c = r.pick(COINS); return K.choice('What is this coin worth?', opts(r, K.coinName(c), r.sample(COINS.filter(function (x) { return x !== c; }), 2).map(K.coinName)), K.coinName(c), { visual: V.coins([c]), hint: 'Read the number on the coin.', params: { list: [c], k: 'name' }, sol: ['This is a ' + K.coinName(c) + ' coin.'] }); }
      var list = L === 2 ? r.sample([1, 2, 5, 10], 2) : r.sample([1, 2, 5, 10, 20], 3), tot = K.sum(list);
      return K.int('How much money is there altogether?', tot, { suffix: 'p', visual: V.coins(list.sort(function (a, b) { return b - a; })), hint: 'Start with the biggest coin and count on.', params: { list: list, k: 'sum' }, sol: [list.join('p + ') + 'p = ' + tot + 'p.'] });
    },
    verify: function (q) { var p = q.params; if (p.k === 'name') return q.check.value === (p.list[0] >= 100 ? '£' + p.list[0] / 100 : p.list[0] + 'p'); return p.list.reduce(function (s, x) { return s + x; }, 0) === q.check.value; } });

  var SEQ = [['morning', 'afternoon', 'evening'], ['breakfast', 'lunch', 'dinner'], ['yesterday', 'today', 'tomorrow'], ['first', 'next', 'last']];
  K.gen({ id: 'y1Sequence', objective: 'Y1-M-02', title: 'Before and after',
    make: function (r, L) {
      var s = r.pick(SEQ), i = L === 1 ? 0 : r.int(0, 1), after = L < 3 || r.chance(0.5);
      if (!after) i = r.int(1, 2);
      return K.choice('What comes <b>' + (after ? 'after' : 'before') + '</b> ' + s[i] + '?', r.shuffle(s.filter(function (x, k) { return k !== i; })), s[after ? i + 1 : i - 1], { hint: 'Say them in order: ' + s.join(', ') + '.', params: { s: s, i: i, after: after }, sol: ['In order: ' + s.join(', ') + '.', s[after ? i + 1 : i - 1] + ' comes ' + (after ? 'after ' : 'before ') + s[i] + '.'] });
    },
    verify: function (q) { var p = q.params, j = p.s.indexOf(q.check.value); return j - p.i === (p.after ? 1 : -1); } });

  K.gen({ id: 'y1Days', objective: 'Y1-M-03', title: 'Days, weeks and months',
    make: function (r, L) {
      if (L === 1) { var d = r.int(0, 5); return K.choice('What day comes after <b>' + DAYS[d] + '</b>?', opts(r, DAYS[d + 1], [DAYS[(d + 2) % 7], DAYS[(d + 6) % 7]]), DAYS[d + 1], { hint: 'Say the days of the week in order.', params: { list: DAYS, i: d, step: 1 }, sol: ['After ' + DAYS[d] + ' comes ' + DAYS[d + 1] + '.'] }); }
      if (L === 2) { var f = r.pick([['days', 'a week', 7], ['months', 'a year', 12]]); return K.int('How many ' + f[0] + ' are there in ' + f[1] + '?', f[2], { hint: f[2] === 7 ? 'Say the days of the week and count them.' : 'Say the months of the year and count them.', params: { f: f }, sol: ['There are ' + f[2] + ' ' + f[0] + ' in ' + f[1] + '.'] }); }
      var m = r.int(0, 10); return K.choice('Which month comes after <b>' + MONTHS[m] + '</b>?', opts(r, MONTHS[m + 1], [MONTHS[(m + 2) % 12], MONTHS[(m + 11) % 12]]), MONTHS[m + 1], { hint: 'Say the months in order, starting with January.', params: { list: MONTHS, i: m, step: 1 }, sol: ['After ' + MONTHS[m] + ' comes ' + MONTHS[m + 1] + '.'] });
    },
    verify: function (q) { var p = q.params; if (p.f) return q.check.value === (p.f[0] === 'days' ? DAYS.length : MONTHS.length); return p.list.indexOf(q.check.value) === p.i + 1; } });

  K.gen({ id: 'y1Clock', objective: 'Y1-M-04', title: 'O’clock and half past',
    make: function (r, L) {
      var h = r.int(1, 12), m = L === 1 ? 0 : L === 2 ? 30 : r.pick([0, 30]), w = OM.clockWords(h, m);
      if (L < 3) { var other = OM.clockWords(m ? h : h % 12 + 1, m ? 0 : 30); return K.choice('What time does the clock show?', opts(r, w, [other, OM.clockWords(h % 12 + 1, m), OM.clockWords((h + 4) % 12 + 1, m)]), w, { visual: V.clock(h, m), hint: m ? 'The long hand points down at 6. That means half past.' : 'The long hand points up at 12. That means o’clock.', params: { h: h, m: m }, sol: ['The short hand shows ' + h + (m ? ' and a bit' : '') + '. The long hand points at ' + (m ? '6' : '12') + '.', 'It is ' + w + '.'] }); }
      var choices = r.shuffle([[h, m], [h, 30 - m], [h % 12 + 1, m]]);
      return K.choice('Which clock shows <b>' + w + '</b>?', choices.map(function (c) { return { value: c[0] + ':' + c[1], label: V.clock(c[0], c[1]).replace(/width="\d+"/, 'width="120"') }; }), h + ':' + m, { hint: m ? 'Half past: the long hand points at 6.' : 'O’clock: the long hand points at 12.', params: { h: h, m: m, pick: true }, sol: [w + ': the short hand is at ' + h + (m ? ' (just past)' : '') + ' and the long hand at ' + (m ? '6.' : '12.')] });
    },
    verify: function (q) { var p = q.params; if (p.pick) return q.check.value === p.h + ':' + p.m; return q.check.value === (p.m === 0 ? p.h + ' o’clock' : 'half past ' + p.h); } });

  // ================= GEOMETRY =================
  var NAMES2D = ['circle', 'triangle', 'square', 'rectangle'], NAMES3D = ['cube', 'cuboid', 'sphere', 'cone', 'cylinder', 'square-based pyramid'];
  K.gen({ id: 'y1Shapes', objective: 'Y1-G-01', title: 'Naming 2-D and 3-D shapes',
    make: function (r, L) {
      if (L === 1) { var s = r.pick(NAMES2D); return K.choice('What is the name of this shape?', r.shuffle(NAMES2D.slice()), s, { visual: V.shape2d(s), hint: 'Count the sides and corners.', params: { s: s }, sol: ['This is a ' + s + '.'] }); }
      var t = r.pick(NAMES3D), lab = function (x) { return x === 'square-based pyramid' ? 'pyramid' : x; };
      if (L === 2) return K.choice('What is the name of this 3-D shape?', r.shuffle([t].concat(r.sample(NAMES3D.filter(function (x) { return x !== t; }), 2))).map(function (x) { return { value: x, label: lab(x) }; }), t, { visual: V.solid(t), hint: 'Is it round? Does it have flat faces? Does it have a point?', params: { s: t }, sol: ['This is a ' + lab(t) + '.'] });
      var roll = r.chance(0.5), ans = roll ? r.pick(['sphere', 'cylinder', 'cone']) : r.pick(['cube', 'cuboid', 'square-based pyramid']);
      return K.choice('Which shape can <b>' + (roll ? 'roll' : 'not roll') + '</b>?', r.shuffle([ans].concat(r.sample(NAMES3D.filter(function (x) { return roll ? ['sphere', 'cylinder', 'cone'].indexOf(x) < 0 : ['sphere', 'cylinder', 'cone'].indexOf(x) >= 0; }), 2))).map(function (x) { return { value: x, label: lab(x) }; }), ans,
        { hint: 'Shapes with a curved surface can roll.', params: { s: ans, roll: roll }, sol: ['A ' + lab(ans) + (roll ? ' has a curved surface, so it can roll.' : ' only has flat faces, so it cannot roll.')] });
    },
    verify: function (q) { var p = q.params; if (p.roll !== undefined) return (['sphere', 'cylinder', 'cone'].indexOf(q.check.value) >= 0) === p.roll; return q.check.value === p.s; } });

  K.gen({ id: 'y1Turns', objective: 'Y1-P-01', title: 'Whole, half and quarter turns',
    make: function (r, L) {
      var things = r.pick([['tree', 'house', 'pond', 'swing'], ['door', 'window', 'board', 'sink'], ['castle', 'bridge', 'river', 'tower']]), face = r.int(0, 3);
      var turn = L === 1 ? r.pick([4, 2]) : L === 2 ? r.pick([1, 2]) : r.pick([1, 3]), name = { 1: 'quarter turn', 2: 'half turn', 3: 'three-quarter turn', 4: 'whole turn' }[turn];
      var end = (face + turn) % 4;
      return K.choice('Pip faces the <b>' + things[face] + '</b>. Pip makes a <b>' + name + '</b>' + (turn % 2 ? ' to the right' : '') + '. What does Pip face now?', r.shuffle(things.slice()), things[end],
        { visual: V.turnScene(things, face), hint: 'A quarter turn moves to the next thing. A half turn faces the opposite way. A whole turn goes all the way round.', params: { things: things, face: face, turn: turn }, sol: ['A ' + name + ' from the ' + things[face] + ' ends facing the ' + things[end] + '.'] });
    },
    verify: function (q) { var p = q.params, i = p.face; for (var k = 0; k < p.turn; k++) i = i === 3 ? 0 : i + 1; return q.check.value === p.things[i]; } });
})(typeof window !== 'undefined' ? window : globalThis);
