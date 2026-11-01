/* Learn with Pip — Year 4 generators: multiplication and division. */
(function (G) {
  'use strict';
  var OM = G.OM, V = OM.V, fmt = OM.fmt;
  function S(text, html) { return { text: text, html: html || '' }; }
  function repAdd(a, b) { var s = 0; for (var i = 0; i < b; i++) s += a; return s; } // independent multiplication check
  // The Multiplication Tables Check uses tables 2–12 with more questions from the 6, 7, 8, 9 and 12 tables
  var TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], TABLE_W = [1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2];
  OM.mtcPair = function (r) { return [r.weighted(TABLES, TABLE_W), r.int(2, 12)]; };

  OM.registerGen({
    id: 'timesTables', objective: 'Y4-MD-01', title: 'Times tables and division facts',
    make: function (r, L) {
      var p = OM.mtcPair(r), a = p[0], b = p[1], prod = a * b, sol, prompt, ans, q;
      if (r.chance(0.5)) { var t = a; a = b; b = t; }
      var arr = prod <= 60 ? V.array(Math.min(a, b), Math.max(a, b)) : '';
      if (L === 1) { prompt = '<span class="big-sum">' + a + ' × ' + b + ' = ?</span>'; ans = prod;
        sol = [S(a + ' lots of ' + b + ' = ' + prod + '.', arr), S('Fact family: ' + a + ' × ' + b + ' = ' + prod + ', ' + b + ' × ' + a + ' = ' + prod + ', ' + prod + ' ÷ ' + a + ' = ' + b + ', ' + prod + ' ÷ ' + b + ' = ' + a + '.')]; }
      else if (L === 2) { prompt = '<span class="big-sum">' + prod + ' ÷ ' + a + ' = ?</span>'; ans = b;
        sol = [S('Think: ' + a + ' × what = ' + prod + '?', arr), S(a + ' × ' + b + ' = ' + prod + ', so ' + prod + ' ÷ ' + a + ' = ' + b + '.')]; }
      else {
        var form = r.int(0, 2);
        ans = form === 2 ? a : b;
        var tpl = form === 0 ? a + ' × {0} = ' + prod : form === 1 ? '{0} × ' + a + ' = ' + prod : prod + ' ÷ {0} = ' + b;
        q = { prompt: 'Find the missing number.', input: { type: 'multi', template: '<span class="big-sum">' + tpl + '</span>', blanks: [{ keys: 'digits' }] },
          check: { kind: 'multi', parts: [{ kind: 'int', value: ans }] }, answerText: String(ans), hint: 'Use the fact family: multiplication and division undo each other.', params: { a: a, b: b, prod: prod, form: form },
          solution: [S(form === 2 ? prod + ' ÷ ? = ' + b + ' means ' + b + ' × ? = ' + prod + '.' : '? × ' + a + ' = ' + prod + ' means ' + prod + ' ÷ ' + a + ' = ?'), S(a + ' × ' + b + ' = ' + prod + ', so the missing number is ' + ans + '.', arr)] };
        return q;
      }
      return { prompt: prompt, input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: ans }, hint: L === 1 ? 'Count in ' + b + 's, or use a fact you know.' : 'What do you multiply ' + a + ' by to make ' + prod + '?',
        params: { a: a, b: b, prod: prod }, solution: sol };
    },
    verify: function (q) { var p = q.params; return repAdd(p.a, p.b) === p.prod && (q.check.value === p.prod || q.check.value === p.b || (q.check.parts && (q.check.parts[0].value === p.a || q.check.parts[0].value === p.b))); }
  });

  OM.registerGen({
    id: 'mentalMD', objective: 'Y4-MD-02', title: 'Mental multiplication and division',
    make: function (r, L) {
      var expr, ans, sol, n;
      if (L === 1) {
        n = r.int(2, 999); var t = r.int(0, 4);
        expr = [n + ' × 1', '1 × ' + n, n + ' × 0', '0 × ' + n, n + ' ÷ 1'][t]; ans = t === 2 || t === 3 ? 0 : n;
        sol = [S(t >= 2 && t <= 3 ? 'Any number multiplied by 0 is 0. Zero lots of anything is nothing!' : t === 4 ? 'Dividing by 1 does not change a number: ' + n + ' shared into 1 group is still ' + n + '.' : 'Multiplying by 1 does not change a number: one lot of ' + n + ' is ' + n + '.'), S(expr + ' = ' + fmt(ans) + '.')];
        return { prompt: '<span class="big-sum">' + expr + ' = ?</span>', input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: ans }, hint: 'Think about what multiplying by 0 or 1 does.', params: { expr: expr }, solution: sol };
      }
      if (L === 2) {
        var a = r.int(2, 12), b = r.int(2, 12), mul = r.pick([10, 100]);
        if (a * b * mul > 9999) mul = 10;
        var big = b * mul, prod = a * big;
        if (r.chance(0.5)) {
          return { prompt: '<span class="big-sum">' + a + ' × ' + fmt(big) + ' = ?</span>', input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: prod }, hint: 'Use ' + a + ' × ' + b + ', then make it ' + mul + ' times bigger.', params: { a: a, b: big, ans: prod, op: '×' },
            solution: [S('Known fact: ' + a + ' × ' + b + ' = ' + a * b + '.'), S(fmt(big) + ' is ' + mul + ' times bigger than ' + b + ', so the answer is ' + mul + ' times bigger: ' + fmt(a * b) + ' × ' + mul + ' = ' + fmt(prod) + '.', V.placeValueOf(a * b) + V.placeValueOf(prod))] };
        }
        return { prompt: '<span class="big-sum">' + fmt(prod) + ' ÷ ' + a + ' = ?</span>', input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: big }, hint: 'Use the fact ' + a * b + ' ÷ ' + a + ' = ' + b + '.', params: { a: prod, b: a, ans: big, op: '÷' },
          solution: [S('Known fact: ' + fmt(a * b) + ' ÷ ' + a + ' = ' + b + '.'), S(fmt(prod) + ' is ' + mul + ' times bigger than ' + fmt(a * b) + ', so the answer is ' + mul + ' times bigger: ' + fmt(big) + '.')] };
      }
      var pairs = [[2, 5], [5, 2], [4, 25], [25, 4], [2, 50], [5, 20], [20, 5]], pr = r.pick(pairs), third = r.int(3, 12);
      if (r.chance(0.3)) { pr = [r.int(2, 6), r.int(2, 6)]; third = r.int(2, 9); }
      var nums = r.shuffle([pr[0], pr[1], third]);
      ans = nums[0] * nums[1] * nums[2];
      return { prompt: '<span class="big-sum">' + nums.join(' × ') + ' = ?</span>', input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: ans },
        hint: 'You can multiply in any order. Which two numbers are easiest to multiply first?', params: { nums: nums },
        solution: [S('Multiply in an easy order: ' + pr[0] + ' × ' + pr[1] + ' = ' + pr[0] * pr[1] + '.'), S('Then ' + pr[0] * pr[1] + ' × ' + third + ' = ' + fmt(ans) + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.expr) { var m = /^(\d+) ([×÷]) (\d+)$/.exec(p.expr), x = +m[1], y = +m[3]; return q.check.value === (m[2] === '×' ? x * y : x / y); }
      if (p.nums) return q.check.value === repAdd(repAdd(p.nums[0], p.nums[1]), p.nums[2]);
      return p.op === '×' ? repAdd(p.a, p.b) === p.ans && q.check.value === p.ans : repAdd(p.ans, p.b) === p.a && q.check.value === p.ans;
    }
  });

  function factorPairsOf(n) { var out = []; for (var a = 1; a * a <= n; a++) if (n % a === 0) out.push([a, n / a]); return out; }
  OM.registerGen({
    id: 'factorPairs', objective: 'Y4-MD-03', title: 'Factor pairs',
    make: function (r, L) {
      if (L === 1) {
        var a = r.int(2, 12), b = r.int(2, 12), n = a * b;
        return { prompt: 'Complete the factor pair.', input: { type: 'multi', template: '<span class="big-sum">' + n + ' = ' + a + ' × {0}</span>', blanks: [{ keys: 'digits' }] },
          check: { kind: 'multi', parts: [{ kind: 'int', value: b }] }, answerText: String(b), hint: 'What do you multiply ' + a + ' by to make ' + n + '?', params: { n: n, a: a },
          solution: [S(n + ' ÷ ' + a + ' = ' + b + ', so ' + a + ' × ' + b + ' = ' + n + '.', n <= 60 ? V.array(a, b) : ''), S('By commutativity, ' + b + ' × ' + a + ' = ' + n + ' too: it is the same factor pair.')] };
      }
      var rich = [12, 18, 20, 24, 30, 36, 40, 42, 48, 60, 72, 84, 90, 96, 100];
      var N = r.pick(rich), fp = factorPairsOf(N);
      if (L === 2) {
        if (r.chance(0.3)) {
          var x = r.pick([12, 14, 15, 16, 18, 24, 25, 35, 45]), five = r.pick([5, 2, 4, 25].filter(function (k) { return k !== x; }));
          var ans2 = x * five, f = factorPairsOf(x).filter(function (p) { return p[0] > 1; });
          return { prompt: 'Use a factor pair to work out <b>' + x + ' × ' + five + '</b> in your head.', input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: ans2 },
            hint: 'Split ' + x + ' into a factor pair, then multiply in an easier order.', params: { x: x, y: five },
            solution: [S(f.length ? x + ' = ' + f[0][0] + ' × ' + f[0][1] + ', so ' + x + ' × ' + five + ' = ' + f[0][0] + ' × ' + f[0][1] + ' × ' + five + '.' : 'Multiply in an easy order.'), S('So ' + x + ' × ' + five + ' = ' + fmt(ans2) + '.')] };
        }
        var shown = r.sample(fp.filter(function (p) { return p[0] > 1; }), Math.min(3, fp.length - 1)).concat(fp.length > 3 ? [] : [fp[0]]);
        shown = shown.slice(0, 3);
        var wrongPair; var tries = 0;
        do { var w = r.pick(shown); wrongPair = r.chance(0.5) ? [w[0], w[1] + 1] : [w[0] + 1, w[1]]; tries++; } while (wrongPair[0] * wrongPair[1] === N && tries < 20);
        var opts = r.shuffle(shown.map(function (p) { return { value: p.join('x'), label: p[0] + ' × ' + p[1] }; }).concat([{ value: wrongPair.join('x'), label: wrongPair[0] + ' × ' + wrongPair[1] }]));
        return { prompt: 'Which of these is <b>not</b> a factor pair of ' + N + '?', input: { type: 'choice', options: opts }, check: { kind: 'choice', value: wrongPair.join('x'), label: wrongPair[0] + ' × ' + wrongPair[1] },
          hint: 'Multiply each pair. Which one does not make ' + N + '?', params: { N: N, wrong: wrongPair, shown: shown },
          solution: [S(shown.map(function (p) { return p[0] + ' × ' + p[1] + ' = ' + N; }).join(', ') + '.'), S(wrongPair[0] + ' × ' + wrongPair[1] + ' = ' + wrongPair[0] * wrongPair[1] + ', not ' + N + '.')] };
      }
      return { prompt: 'How many different factor pairs does <b>' + N + '</b> have?', input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: fp.length },
        hint: 'Start with 1 × ' + N + '. Then try 2, 3, 4… Stop when the pairs start to repeat.', params: { N: N },
        reject: ['counting the same pair twice, e.g. 3 × 8 and 8 × 3'],
        solution: [S('Work through systematically: ' + fp.map(function (p) { return p[0] + ' × ' + p[1]; }).join(', ') + '.'), S('After that the pairs repeat (e.g. ' + fp[fp.length - 1][1] + ' × ' + fp[fp.length - 1][0] + ' is the same pair). So ' + N + ' has ' + fp.length + ' factor pairs.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.a) return p.a * q.check.parts[0].value === p.n;
      if (p.x) return q.check.value === repAdd(p.x, p.y);
      var count = 0; for (var i = 1; i <= p.N; i++) if (p.N % i === 0 && i <= p.N / i) count++;
      if (p.wrong) return p.wrong[0] * p.wrong[1] !== p.N && p.shown.every(function (s) { return s[0] * s[1] === p.N; });
      return count === q.check.value;
    }
  });

  OM.registerGen({
    id: 'shortMult', objective: 'Y4-MD-04', title: 'Short multiplication',
    make: function (r, L) {
      var a, b, tries = 0;
      do { a = L === 1 ? r.int(12, 99) : r.int(102, 999); b = r.int(3, 9); tries++; } while ((a * b > 9999 || (a % 10) * b < 10) && tries < 200);
      var frames = V.columnFrames(a, b, '×');
      if (L === 3) {
        var item = r.pick(['pine cones', 'acorns', 'conkers', 'berries']), box = r.pick(['box', 'basket', 'sack']);
        return { prompt: 'A ' + box + ' holds ' + fmt(a) + ' ' + item + '. How many ' + item + ' are there in ' + b + ' ' + box + (box === 'box' ? 'es' : 's') + '?', input: { type: 'column', a: a, b: b, op: '×' },
          check: { kind: 'int', value: a * b }, hint: 'This is ' + fmt(a) + ' × ' + b + '. Use short multiplication.', params: { a: a, b: b },
          solution: [S('We need ' + b + ' lots of ' + fmt(a) + ': ' + fmt(a) + ' × ' + b + '. Estimate: about ' + fmt(Math.round(a / 100) * 100 || Math.round(a / 10) * 10) + ' × ' + b + '.')].concat(frames.map(function (f) { return S(f.text, f.html); })) };
      }
      return { prompt: 'Use short multiplication to work out <b>' + fmt(a) + ' × ' + b + '</b>.', input: { type: 'column', a: a, b: b, op: '×' },
        check: { kind: 'int', value: a * b }, hint: 'Multiply the ones first. Exchange tens into the next column, then add them after you multiply.', params: { a: a, b: b },
        solution: frames.map(function (f) { return S(f.text, f.html); }) };
    },
    verify: function (q) { return repAdd(q.params.a, q.params.b) === q.check.value; },
    constraints: function (q) { return q.params.b > 9 ? ['multiplier is not one digit'] : []; }
  });

  OM.registerGen({
    id: 'mdProblems', objective: 'Y4-MD-05', title: 'Multiplying problems',
    make: function (r, L) {
      var name = r.pick(OM.NAMES);
      if (L === 1) {
        var t = r.int(1, 9), o = r.int(1, 9), m = r.int(3, 9), n = t * 10 + o;
        return { prompt: 'Use partitioning to work out ' + n + ' × ' + m + '.', input: { type: 'multi', template: n + ' × ' + m + ' = ' + (t * 10) + ' × ' + m + ' + ' + o + ' × ' + m + ' = {0} + {1} = {2}', blanks: [{ keys: 'digits' }, { keys: 'digits' }, { keys: 'digits' }] },
          check: { kind: 'multi', parts: [{ kind: 'int', value: t * 10 * m }, { kind: 'int', value: o * m }, { kind: 'int', value: n * m }] }, answerText: (t * 10 * m) + ', ' + (o * m) + ', ' + (n * m),
          hint: 'Multiply the tens, multiply the ones, then add.', params: { n: n, m: m },
          solution: [S('Split ' + n + ' into ' + t * 10 + ' and ' + o + '.', V.barModel({ parts: 2, total: String(n), partLabel: '' })), S(t * 10 + ' × ' + m + ' = ' + t * 10 * m + ' and ' + o + ' × ' + m + ' = ' + o * m + '.'), S(t * 10 * m + ' + ' + o * m + ' = ' + n * m + '.')] };
      }
      if (L === 2) {
        if (r.chance(0.5)) {
          var len = r.int(3, 12), times = r.int(3, 9), unit = r.pick(['cm', 'm']), things = r.pick([['red ribbon', 'blue ribbon'], ['small path', 'long path'], ['short stick', 'long branch']]);
          return { prompt: 'The ' + things[0] + ' is ' + len + ' ' + unit + ' long. The ' + things[1] + ' is ' + times + ' times as long. How long is the ' + things[1] + '?', input: { type: 'number', keys: 'digits', suffix: unit },
            check: { kind: 'int', value: len * times }, answerText: len * times + ' ' + unit, hint: '"' + times + ' times as long" means multiply by ' + times + '.', params: { a: len, b: times },
            solution: [S('Draw a bar model: one bar for ' + len + ' ' + unit + ', the other ' + times + ' of those bars.', V.barModel({ parts: times, total: '?', partLabel: String(len) })), S(len + ' × ' + times + ' = ' + len * times + ' ' + unit + '.')] };
        }
        var c1 = r.int(2, 6), c2 = r.int(2, 6), pairs = r.pick([['hats', 'scarves'], ['types of sandwich', 'drinks'], ['T-shirts', 'pairs of shorts'], ['owl masks', 'capes']]);
        return { prompt: name + ' has ' + c1 + ' ' + pairs[0] + ' and ' + c2 + ' ' + pairs[1] + '. How many different combinations of one of each can ' + name + ' make?', input: { type: 'number', keys: 'digits' },
          check: { kind: 'int', value: c1 * c2 }, hint: 'Each of the ' + pairs[0] + ' can go with each of the ' + pairs[1] + '.', params: { a: c1, b: c2 },
          reject: [c1 + c2 + ' (adding instead of multiplying)'],
          solution: [S('Each of the ' + c1 + ' ' + pairs[0] + ' can be matched with ' + c2 + ' ' + pairs[1] + '.', V.array(c1, c2)), S(c1 + ' × ' + c2 + ' = ' + c1 * c2 + ' combinations.')] };
      }
      if (r.chance(0.35)) {
        var x = r.int(2, 4), y = r.int(2, 5), z = r.int(2, 3);
        return { prompt: 'At the forest café you can choose 1 of ' + x + ' breads, 1 of ' + y + ' fillings and 1 of ' + z + ' drinks. How many different lunches are possible?', input: { type: 'number', keys: 'digits' },
          check: { kind: 'int', value: x * y * z }, hint: 'Multiply the number of choices for each part.', params: { a: x * y, b: z, xyz: [x, y, z] },
          solution: [S(x + ' breads × ' + y + ' fillings = ' + x * y + ' sandwiches.'), S('Each sandwich can go with ' + z + ' drinks: ' + x * y + ' × ' + z + ' = ' + x * y * z + ' lunches.')] };
      }
      var each = r.int(15, 95), qty = r.int(3, 9), extra = r.int(25, 199), item = r.pick(['pencils', 'stickers', 'rubbers', 'bookmarks']), extraItem = r.pick(['a ruler', 'a notebook', 'a pencil case']);
      var total = each * qty + extra;
      return { prompt: item.charAt(0).toUpperCase() + item.slice(1) + ' cost ' + OM.money(each) + ' each. ' + name + ' buys ' + qty + ' ' + item + ' and ' + extraItem + ' that costs ' + OM.money(extra) + '. How much does ' + name + ' spend altogether?', marks: 2,
        input: { type: 'working', keys: 'working', moneyAnswer: true },
        check: { kind: 'working', final: { kind: 'money', pence: total }, plan: [{ op: '*', a: { g: each, alt: [each / 100] }, b: { g: qty } }, { op: '+', a: { s: 0 }, b: { g: extra, alt: [extra / 100] } }],
          exampleLines: [each + ' × ' + qty + ' = ' + each * qty, each * qty + ' + ' + extra + ' = ' + total] },
        hint: 'First find the cost of the ' + item + ', then add the cost of ' + extraItem + '.', params: { each: each, qty: qty, extra: extra },
        accept: [total + 'p'],
        solution: [S('Cost of ' + item + ': ' + each + 'p × ' + qty + ' = ' + each * qty + 'p.'), S('Add ' + extraItem + ': ' + each * qty + 'p + ' + extra + 'p = ' + total + 'p.'), S(total + 'p = ' + OM.pounds(total) + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.n) return q.check.parts[2].value === repAdd(p.n, p.m) && q.check.parts[0].value + q.check.parts[1].value === q.check.parts[2].value;
      if (p.each) return q.check.final.pence === repAdd(p.each, p.qty) + p.extra;
      return q.check.value === repAdd(p.a, p.b);
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
