/* Learn with Pip — Year 4 generators: measurement. */
(function (G) {
  'use strict';
  var OM = G.OM, V = OM.V, fmt = OM.fmt;
  function S(text, html) { return { text: text, html: html || '' }; }
  function un(count, plural) { return count === 1 ? plural.replace(/s$/, '') : plural; }
  var UNITS = [['km', 'm', 1000, 'kilometres', 'metres'], ['m', 'cm', 100, 'metres', 'centimetres'], ['cm', 'mm', 10, 'centimetres', 'millimetres'],
    ['kg', 'g', 1000, 'kilograms', 'grams'], ['l', 'ml', 1000, 'litres', 'millilitres']];

  OM.registerGen({
    id: 'convertUnits', objective: 'Y4-M-01', title: 'Converting units',
    make: function (r, L) {
      var u = r.pick(UNITS), big = u[0], small = u[1], f = u[2], n;
      if (L === 1) {
        n = r.int(2, 9);
        return { prompt: 'Complete: &nbsp;<b>' + n + ' ' + big + ' = ___ ' + small + '</b>', input: { type: 'number', keys: 'digits', suffix: small }, check: { kind: 'int', value: n * f }, answerText: fmt(n * f) + ' ' + small,
          hint: '1 ' + big + ' = ' + fmt(f) + ' ' + small + '. Big unit to small unit: multiply.', params: { n: n, f: f, dir: 'bs' },
          solution: [S('1 ' + big + ' = ' + fmt(f) + ' ' + small + '.'), S(n + ' × ' + fmt(f) + ' = ' + fmt(n * f) + ', so ' + n + ' ' + big + ' = ' + fmt(n * f) + ' ' + small + '.')] };
      }
      if (L === 2) {
        if (r.chance(0.5)) {
          n = r.int(2, 9);
          return { prompt: 'Complete: &nbsp;<b>' + fmt(n * f) + ' ' + small + ' = ___ ' + big + '</b>', input: { type: 'number', keys: 'digits', suffix: big }, check: { kind: 'int', value: n }, answerText: n + ' ' + big,
            hint: 'Small unit to big unit: divide by ' + fmt(f) + '.', params: { n: n, f: f, dir: 'sb' },
            solution: [S('1 ' + big + ' = ' + fmt(f) + ' ' + small + '.'), S(fmt(n * f) + ' ÷ ' + fmt(f) + ' = ' + n + ', so ' + fmt(n * f) + ' ' + small + ' = ' + n + ' ' + big + '.')] };
        }
        n = r.int(1, 9); var extra = r.int(f === 10 ? 1 : f / 10 + 1, f - 1);
        return { prompt: 'Complete: &nbsp;<b>' + n + ' ' + big + ' ' + extra + ' ' + small + ' = ___ ' + small + '</b>', input: { type: 'number', keys: 'digits', suffix: small }, check: { kind: 'int', value: n * f + extra }, answerText: fmt(n * f + extra) + ' ' + small,
          hint: 'Convert the ' + big + ' first, then add the ' + small + '.', params: { n: n, f: f, extra: extra, dir: 'mix' },
          solution: [S(n + ' ' + big + ' = ' + fmt(n * f) + ' ' + small + '.'), S(fmt(n * f) + ' + ' + extra + ' = ' + fmt(n * f + extra) + ' ' + small + '.')] };
      }
      u = r.pick([UNITS[0], UNITS[3], UNITS[4]]); big = u[0]; small = u[1]; f = u[2];
      var k = r.int(0, 2);
      if (k === 0) {
        n = r.int(1, 9); var ex = r.int(1, 99);
        return { prompt: 'Complete: &nbsp;<b>' + n + ' ' + big + ' ' + ex + ' ' + small + ' = ___ ' + small + '</b>', input: { type: 'number', keys: 'digits', suffix: small }, check: { kind: 'int', value: n * 1000 + ex }, answerText: fmt(n * 1000 + ex) + ' ' + small,
          hint: 'Careful with place value: ' + ex + ' ' + small + ' has 0 hundreds.', params: { n: n, f: 1000, extra: ex, dir: 'mix' },
          reject: [fmt(n * 1000 + ex * (ex < 10 ? 100 : 10)) + ' (the ' + small + ' put in the wrong place)'],
          solution: [S(n + ' ' + big + ' = ' + fmt(n * 1000) + ' ' + small + '.', V.placeValue(['Th', 'H', 'T', 'O'], String(n * 1000 + ex).split(''))), S(fmt(n * 1000) + ' + ' + ex + ' = ' + fmt(n * 1000 + ex) + ' ' + small + '. The hundreds digit is 0.')] };
      }
      if (k === 1) {
        var tot = r.int(1001, 9999); if (tot % 1000 === 0) tot += 7;
        return { prompt: 'Complete: &nbsp;<b>' + fmt(tot) + ' ' + small + ' = ___ ' + big + ' ___ ' + small + '</b>', input: { type: 'multi', template: fmt(tot) + ' ' + small + ' = {0} ' + big + ' {1} ' + small, blanks: [{ keys: 'digits' }, { keys: 'digits' }] },
          check: { kind: 'multi', parts: [{ kind: 'int', value: Math.floor(tot / 1000) }, { kind: 'int', value: tot % 1000 }] }, answerText: Math.floor(tot / 1000) + ' ' + big + ' ' + tot % 1000 + ' ' + small,
          hint: 'How many whole thousands of ' + small + ' are there?', params: { tot: tot },
          solution: [S('Every 1,000 ' + small + ' make 1 ' + big + '. ' + fmt(tot) + ' has ' + Math.floor(tot / 1000) + ' thousands.'), S(fmt(tot) + ' ' + small + ' = ' + Math.floor(tot / 1000) + ' ' + big + ' ' + tot % 1000 + ' ' + small + '.')] };
      }
      var a = r.int(1, 8), b1 = r.int(10, 99), A = a * 1000 + b1 * 10, B = a * 1000 + b1;
      var optsAB = r.shuffle([{ value: 'A', label: fmt(A) + ' ' + small }, { value: 'B', label: a + ' ' + big + ' ' + b1 + ' ' + small }]);
      return { prompt: 'Which is <b>more</b>?', input: { type: 'choice', options: optsAB }, check: { kind: 'choice', value: 'A', label: fmt(A) + ' ' + small },
        hint: 'Change both into ' + small + ' first.', params: { A: A, B: B },
        solution: [S(a + ' ' + big + ' ' + b1 + ' ' + small + ' = ' + fmt(B) + ' ' + small + '.'), S(fmt(A) + ' is more than ' + fmt(B) + ', so ' + fmt(A) + ' ' + small + ' is more.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.dir === 'bs') return q.check.value === p.n * p.f;
      if (p.dir === 'sb') return q.check.value * p.f === p.n * p.f && q.check.value === p.n;
      if (p.dir === 'mix') return q.check.value - p.extra === p.n * p.f && p.extra < p.f;
      if (p.tot) return q.check.parts[0].value * 1000 + q.check.parts[1].value === p.tot;
      return p.A > p.B && q.check.value === 'A';
    }
  });

  // Perimeter of rectilinear shapes. Points are in units; edges listed in order.
  function edgeLens(pts) { return pts.map(function (p, i) { var q = pts[(i + 1) % pts.length]; return Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]); }); }
  OM.registerGen({
    id: 'perimeter', objective: 'Y4-M-02', title: 'Perimeter',
    make: function (r, L) {
      var unit = r.pick(['cm', 'm']);
      if (L === 1) {
        if (r.chance(0.3)) {
          var s = r.int(2, 12);
          return { prompt: 'This is a square with sides of ' + s + ' ' + unit + '. What is its perimeter?', visual: V.labelledShape([[0, 0], [1, 0], [1, 1], [0, 1]], [s + ' ' + unit, null, null, null]),
            input: { type: 'number', keys: 'digits', suffix: unit }, check: { kind: 'int', value: 4 * s }, answerText: 4 * s + ' ' + unit, hint: 'A square has 4 equal sides.', params: { pts: [[0, 0], [s, 0], [s, s], [0, s]] },
            solution: [S('All 4 sides are ' + s + ' ' + unit + '.'), S(s + ' + ' + s + ' + ' + s + ' + ' + s + ' = ' + s + ' × 4 = ' + 4 * s + ' ' + unit + '.')] };
        }
        var w = r.int(3, 15), h = r.int(2, 12); if (w === h) w++;
        var pts = [[0, 0], [w, 0], [w, h], [0, h]];
        return { prompt: 'What is the perimeter of this rectangle?', visual: V.labelledShape(pts, [w + ' ' + unit, h + ' ' + unit, w + ' ' + unit, h + ' ' + unit]),
          input: { type: 'number', keys: 'digits', suffix: unit }, check: { kind: 'int', value: 2 * (w + h) }, answerText: 2 * (w + h) + ' ' + unit, hint: 'Add all four sides.', params: { pts: pts },
          solution: [S('Add every side: ' + w + ' + ' + h + ' + ' + w + ' + ' + h + '.'), S('Perimeter = ' + 2 * (w + h) + ' ' + unit + '.')] };
      }
      if (L === 3 && r.chance(0.3)) {
        var side = r.int(3, 15);
        return { prompt: 'A square has a perimeter of ' + 4 * side + ' ' + unit + '. How long is one side?', input: { type: 'number', keys: 'digits', suffix: unit }, check: { kind: 'int', value: side }, answerText: side + ' ' + unit,
          hint: 'A square has 4 equal sides. Share the perimeter between them.', params: { pts: [[0, 0], [side, 0], [side, side], [0, side]], reverse: true },
          solution: [S('The perimeter is 4 equal sides added together.', V.labelledShape([[0, 0], [1, 0], [1, 1], [0, 1]], ['?', '?', '?', '?'])), S(4 * side + ' ÷ 4 = ' + side + ' ' + unit + '.')] };
      }
      var W = r.int(5, 14), H = r.int(4, 11), cw = r.int(1, W - 2), ch = r.int(1, H - 2), left = r.chance(0.5), P;
      P = left ? [[cw, 0], [W, 0], [W, H], [0, H], [0, ch], [cw, ch]] : [[0, 0], [W - cw, 0], [W - cw, ch], [W, ch], [W, H], [0, H]];
      var lens = edgeLens(P), labels = lens.map(function (x) { return x + ' ' + unit; });
      var hidden = [];
      if (L === 3) {
        // hide one horizontal and one vertical inner edge; both can be worked out from the full width/height
        hidden = left ? [r.pick([0, 4]), r.pick([3, 5])] : [r.pick([0, 2]), r.pick([1, 3])];
        hidden.forEach(function (i) { labels[i] = '?'; });
      }
      var per = lens.reduce(function (a, b) { return a + b; }, 0);
      var sol = [];
      if (hidden.length) sol.push(S('Work out the missing sides first. The two short edges across the top add up to the whole width (' + W + ' ' + unit + '), and the two short edges down the side add up to the whole height (' + H + ' ' + unit + '). So the missing sides are ' + lens[hidden[0]] + ' ' + unit + ' and ' + lens[hidden[1]] + ' ' + unit + '.', V.labelledShape(P, lens.map(function (x) { return x + ' ' + unit; }))));
      sol.push(S('Add every side, going round the shape: ' + lens.join(' + ') + ' = ' + per + ' ' + unit + '.'));
      return { prompt: 'What is the perimeter of this shape?' + (hidden.length ? ' Some sides are not labelled.' : '') + ' All corners are right angles.', visual: V.labelledShape(P, labels),
        input: { type: 'number', keys: 'digits', suffix: unit }, check: { kind: 'int', value: per }, answerText: per + ' ' + unit,
        hint: hidden.length ? 'The top edges together are as long as the bottom edge. The side edges work the same way.' : 'Count the sides as you add them: there are 6.', params: { pts: P }, solution: sol };
    },
    verify: function (q) {
      var p = q.params, per = 0;
      for (var i = 0; i < p.pts.length; i++) { var a = p.pts[i], b = p.pts[(i + 1) % p.pts.length]; per += Math.hypot(b[0] - a[0], b[1] - a[1]); }
      return p.reverse ? q.check.value * 4 === per : q.check.value === per;
    }
  });

  function polyomino(r, k, cols, rows) {
    var cells = [[Math.floor(cols / 2), Math.floor(rows / 2)]], set = {}; set[cells[0].join(',')] = 1;
    var guard = 0;
    while (cells.length < k && guard++ < 1000) {
      var c = r.pick(cells), d = r.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]), n = [c[0] + d[0], c[1] + d[1]];
      if (n[0] < 0 || n[1] < 0 || n[0] >= cols || n[1] >= rows || set[n.join(',')]) continue;
      set[n.join(',')] = 1; cells.push(n);
    }
    return cells;
  }
  OM.polyomino = polyomino;
  OM.registerGen({
    id: 'area', objective: 'Y4-M-03', title: 'Area by counting squares',
    make: function (r, L) {
      if (L === 1) {
        var w = r.int(2, 6), h = r.int(2, 4), cells = [];
        for (var x = 0; x < w; x++) for (var y = 0; y < h; y++) cells.push([x + 1, y + 1]);
        return { prompt: 'Each square is 1 cm². What is the area of the shaded rectangle?', visual: V.gridShape(cells, { cols: 8, rows: 6 }), input: { type: 'number', keys: 'digits', suffix: 'cm²' },
          check: { kind: 'int', value: w * h }, answerText: w * h + ' cm²', hint: 'Count the squares. You could count in rows.', params: { cells: cells },
          solution: [S('There are ' + h + ' rows of ' + w + ' squares.'), S(h + ' × ' + w + ' = ' + w * h + ' squares, so the area is ' + w * h + ' cm².')] };
      }
      if (L === 2) {
        var c2 = polyomino(r, r.int(6, 16), 8, 6);
        return { prompt: 'Each square is 1 cm². What is the area of the shaded shape?', visual: V.gridShape(c2, { cols: 8, rows: 6 }), input: { type: 'number', keys: 'digits', suffix: 'cm²' },
          check: { kind: 'int', value: c2.length }, answerText: c2.length + ' cm²', hint: 'Count carefully row by row so you do not miss a square.', params: { cells: c2 },
          solution: [S('Count each row of shaded squares and add them up.'), S('There are ' + c2.length + ' squares, so the area is ' + c2.length + ' cm².')] };
      }
      if (r.chance(0.5)) {
        var A = polyomino(r, r.int(8, 15), 6, 5), B = polyomino(r, r.int(5, 14), 6, 5);
        if (A.length === B.length) A = polyomino(r, B.length + 2, 6, 5);
        var big = A.length > B.length ? 'A' : 'B';
        return { prompt: 'Each square is 1 cm². How much <b>larger</b> is the area of the bigger shape than the smaller shape?', visual: '<div class="pair"><div><b>A</b>' + V.gridShape(A, { cols: 6, rows: 5, cell: 28 }) + '</div><div><b>B</b>' + V.gridShape(B, { cols: 6, rows: 5, cell: 28, color: '#3d7bd9' }) + '</div></div>',
          input: { type: 'number', keys: 'digits', suffix: 'cm²' }, check: { kind: 'int', value: Math.abs(A.length - B.length) }, answerText: Math.abs(A.length - B.length) + ' cm²', hint: 'Find the area of each shape, then subtract.', params: { A: A, B: B },
          solution: [S('Area of A = ' + A.length + ' cm². Area of B = ' + B.length + ' cm².'), S('Difference: ' + Math.max(A.length, B.length) + ' − ' + Math.min(A.length, B.length) + ' = ' + Math.abs(A.length - B.length) + ' cm². Shape ' + big + ' is bigger.')] };
      }
      var area = r.pick([6, 8, 10, 12, 15, 16, 18, 20, 24]), fac = [];
      for (var a = 1; a <= 8; a++) if (area % a === 0 && area / a <= 6) fac.push(a);
      var ww = r.pick(fac), hh = area / ww, ex = [];
      for (x = 0; x < ww; x++) for (y = 0; y < hh; y++) ex.push(x + ',' + y);
      return { prompt: 'Tap squares to shade a <b>rectangle</b> with an area of <b>' + area + ' cm²</b>. Each square is 1 cm².', input: { type: 'tapgrid', cols: 8, rows: 6 },
        check: { kind: 'cellsRule', rule: 'rectangleArea', area: area, example: ex }, answerText: 'any rectangle of ' + area + ' squares, e.g. ' + ww + ' by ' + hh, hint: 'Think of a factor pair of ' + area + ': rows × squares in each row.',
        params: { area: area }, accept: ['any rectangle (or square) made of exactly ' + area + ' squares'],
        solution: [S('Find a factor pair of ' + area + ': ' + fac.map(function (f) { return f + ' × ' + area / f; }).join(', ') + '.'), S('For example, ' + hh + ' rows of ' + ww + ' squares:', V.gridShape(ex.map(function (k) { return k.split(',').map(Number); }), { cols: 8, rows: 6 }))] };
    },
    verify: function (q) {
      var p = q.params;
      function count(cs) { var s = {}; cs.forEach(function (c) { s[c.join(',')] = 1; }); return Object.keys(s).length; }
      if (p.cells) return count(p.cells) === q.check.value;
      if (p.A) return Math.abs(count(p.A) - count(p.B)) === q.check.value && count(p.A) !== count(p.B);
      return OM.cellRules.rectangleArea(q.check.example, q.check).ok;
    }
  });

  var ESTIMATES = [
    ['the height of a classroom door', '2 m', ['20 cm', '20 m', '2 km']], ['the length of a pencil', '15 cm', ['15 m', '15 mm', '150 m']],
    ['the mass of a bag of sugar', '1 kg', ['1 g', '100 kg', '10 g']], ['the capacity of a mug', '250 ml', ['25 litres', '2 ml', '250 litres']],
    ['the mass of an apple', '150 g', ['15 kg', '1,500 kg', '1 g']], ['the height of a Year 4 child', '130 cm', ['13 cm', '13 m', '1 km']],
    ['the distance you could walk in an hour', '4 km', ['4 m', '40 cm', '400 km']], ['the capacity of a bucket', '10 litres', ['10 ml', '100 ml', '1,000 litres']]
  ];
  OM.registerGen({
    id: 'moneyMeasures', objective: 'Y4-M-04', title: 'Money and measures',
    make: function (r, L) {
      var name = r.pick(OM.NAMES);
      if (L === 1) {
        var p = r.int(105, 999);
        if (r.chance(0.5)) return { prompt: 'Write <b>' + p + 'p</b> in pounds.', input: { type: 'number', keys: 'decimal', prefix: '£' }, check: { kind: 'money', pence: p, box: '£' }, hint: '100p = £1. Divide by 100.', params: { p: p },
          solution: [S(p + 'p = ' + Math.floor(p / 100) + ' pounds and ' + p % 100 + ' pence.'), S(p + 'p = ' + OM.pounds(p) + '.')] };
        return { prompt: 'Write <b>' + OM.pounds(p) + '</b> in pence.', input: { type: 'number', keys: 'digits', suffix: 'p' }, check: { kind: 'money', pence: p, box: 'p' }, hint: '£1 = 100p.', params: { p: p },
          solution: [S(OM.pounds(p) + ' is ' + Math.floor(p / 100) + ' pounds (' + Math.floor(p / 100) * 100 + 'p) and ' + p % 100 + 'p.'), S('So ' + OM.pounds(p) + ' = ' + p + 'p.')] };
      }
      if (L === 2) {
        var k = r.int(0, 2);
        if (k === 0) {
          var e = r.pick(ESTIMATES), opts = r.shuffle([e[1]].concat(e[2])).map(function (o) { return { value: o, label: o }; });
          return { prompt: 'Which is the best <b>estimate</b> for ' + e[0] + '?', input: { type: 'choice', options: opts }, check: { kind: 'choice', value: e[1], label: e[1] }, hint: 'Think about things you know: a ruler is 30 cm, a door is about 2 m, a bag of sugar is 1 kg.',
            params: { e: e }, solution: [S('Picture it and compare with something you know.'), S('The best estimate is ' + e[1] + '.')] };
        }
        if (k === 1) {
          var x = r.int(3, 9), y = r.int(0, 9);
          var pA = x * 100 + y, pB = x * 100 + y * 10 + r.pick([0, 5]); if (pA === pB) pB += 10;
          var shownA = OM.pounds(pA), shownB = pB + 'p';
          var o2 = r.shuffle([{ value: 'A', label: shownA }, { value: 'B', label: shownB }]);
          return { prompt: 'Which is <b>more</b>: ' + shownA + ' or ' + shownB + '?', input: { type: 'choice', options: o2 }, check: { kind: 'choice', value: pA > pB ? 'A' : 'B', label: pA > pB ? shownA : shownB },
            hint: 'Write them both in pence.', params: { pA: pA, pB: pB }, solution: [S(shownA + ' = ' + pA + 'p.'), S((pA > pB ? pA + 'p is more than ' + pB + 'p' : pB + 'p is more than ' + pA + 'p') + '.')] };
        }
        var items = r.sample([['a carrot', 35], ['an apple', 45], ['a banana', 30], ['a drink', 120], ['a sandwich', 275], ['a cake', 150], ['a yoghurt', 65]], 3);
        var tot = items.reduce(function (a, b) { return a + b[1]; }, 0);
        return { prompt: name + ' buys ' + items.map(function (i) { return i[0] + ' (' + OM.money(i[1]) + ')'; }).join(', ').replace(/, ([^,]*)$/, ' and $1') + '. How much is that altogether?', input: { type: 'number', keys: 'decimal', prefix: '£' },
          check: { kind: 'money', pence: tot, box: '£' }, hint: 'Change everything to pence, add, then change back to pounds.', params: { items: items },
          solution: [S('In pence: ' + items.map(function (i) { return i[1] + 'p'; }).join(' + ') + ' = ' + tot + 'p.'), S(tot + 'p = ' + OM.pounds(tot) + '.')] };
      }
      var each = r.int(25, 85), qty = r.int(2, 5), drink = r.int(95, 199), paid = r.pick([500, 1000]), fruit = r.pick(['apples', 'pears', 'oranges', 'plums']);
      var spend = each * qty + drink; if (spend >= paid) paid = 1000; var change = paid - spend;
      return { prompt: name + ' buys ' + qty + ' ' + fruit + ' at ' + each + 'p each and a drink for ' + OM.pounds(drink) + '. ' + name + ' pays with a ' + OM.pounds(paid).replace('.00', '') + ' note. How much change does ' + name + ' get?', marks: 2,
        input: { type: 'working', keys: 'working', moneyAnswer: true },
        check: { kind: 'working', final: { kind: 'money', pence: change },
          plans: [[{ op: '*', a: { g: each, alt: [each / 100] }, b: { g: qty } }, { op: '+', a: { s: 0 }, b: { g: drink, alt: [drink / 100] } }, { op: '-', a: { g: paid, alt: [paid / 100] }, b: { s: 1 } }],
            [{ op: '*', a: { g: each, alt: [each / 100] }, b: { g: qty } }, { op: '-', a: { g: paid, alt: [paid / 100] }, b: { s: 0 } }, { op: '-', a: { s: 1 }, b: { g: drink, alt: [drink / 100] } }]],
          exampleLines: [each + ' × ' + qty + ' = ' + each * qty, each * qty + ' + ' + drink + ' = ' + spend, paid + ' − ' + spend + ' = ' + change] },
        hint: 'Step 1: cost of the ' + fruit + '. Step 2: add the drink. Step 3: take the total away from the money paid.', params: { each: each, qty: qty, drink: drink, paid: paid },
        solution: [S(fruit.charAt(0).toUpperCase() + fruit.slice(1) + ': ' + each + 'p × ' + qty + ' = ' + each * qty + 'p.'), S('Add the drink: ' + each * qty + 'p + ' + drink + 'p = ' + spend + 'p = ' + OM.pounds(spend) + '.'), S('Change: ' + OM.pounds(paid) + ' − ' + OM.pounds(spend) + ' = ' + OM.pounds(change) + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.p) return q.check.pence === p.p;
      if (p.e) return true;
      if (p.pA) return (p.pA > p.pB ? 'A' : 'B') === q.check.value && p.pA !== p.pB;
      if (p.items) { var s = 0; p.items.forEach(function (i) { s += i[1]; }); return s === q.check.pence; }
      var sp = 0; for (var i = 0; i < p.qty; i++) sp += p.each; sp += p.drink;
      return q.check.final.pence === p.paid - sp && p.paid - sp > 0;
    }
  });

  OM.registerGen({
    id: 'clocks', objective: 'Y4-M-05', title: 'Analogue, 12-hour and 24-hour time',
    make: function (r, L) {
      var h, m, mins;
      if (L === 1) {
        h = r.int(1, 12); m = r.int(0, 11) * 5; mins = (h % 12) * 60 + m;
        return { prompt: 'What time does the clock show? Write it as a 12-hour digital time.', visual: V.clock(h, m), input: { type: 'text', keys: 'time', placeholder: 'e.g. 3:45' },
          check: { kind: 'time', mins: mins, format: 'clock' }, answerText: OM.time12(mins, false), hint: 'The short hand shows the hour. Count the minutes in 5s for the long hand.', params: { h: h, m: m },
          solution: [S('The hour hand has passed ' + h + (m === 0 ? ' (it is pointing at it)' : '') + '. The minute hand points to ' + (m / 5 || 12) + ', which is ' + m + ' minutes.'), S('The time is ' + OM.time12(mins, false) + '.')] };
      }
      if (L === 2) {
        mins = r.int(0, 23) * 60 + r.int(0, 11) * 5;
        if (r.chance(0.6) && mins < 720) mins += 720;
        return { prompt: 'Write <b>' + OM.time12(mins, true) + '</b> as a 24-hour time.', input: { type: 'text', keys: 'time', placeholder: 'e.g. 14:30' }, check: { kind: 'time', mins: mins, format: '24' }, answerText: OM.time24(mins),
          hint: mins >= 720 ? 'For pm times, add 12 to the hour (except 12 pm).' : 'For am times, keep the hour (12 am becomes 00).', params: { mins: mins },
          solution: [S(mins >= 780 ? 'It is pm, so add 12 to the hour: ' + (Math.floor(mins / 60) - 12) + ' + 12 = ' + Math.floor(mins / 60) + '.' : mins >= 720 ? '12 pm is midday, which stays as 12 in 24-hour time.' : mins < 60 ? '12 am is midnight, which is 00 in 24-hour time.' : 'It is am, so the hour stays the same. Use 4 digits.'), S(OM.time12(mins, true) + ' = ' + OM.time24(mins) + '.')] };
      }
      if (r.chance(0.5)) {
        mins = r.pick([r.int(13, 23) * 60 + r.int(0, 59), r.int(0, 11) * 60 + r.int(0, 59), r.int(0, 0) * 60 + r.int(0, 59), 12 * 60 + r.int(0, 59)]);
        return { prompt: 'Write <b>' + OM.time24(mins) + '</b> as a 12-hour time. Remember am or pm.', input: { type: 'text', keys: 'time', placeholder: 'e.g. 7:05 pm' }, check: { kind: 'time', mins: mins, format: '12' }, answerText: OM.time12(mins, true),
          hint: 'If the hour is 13 or more, take away 12 and write pm.', params: { mins: mins },
          solution: [S(Math.floor(mins / 60) >= 13 ? 'The hour is ' + Math.floor(mins / 60) + ': take away 12 to get ' + (Math.floor(mins / 60) - 12) + ', and it is pm.' : Math.floor(mins / 60) === 12 ? '12:xx is just after midday, so it is pm.' : Math.floor(mins / 60) === 0 ? '00:xx is just after midnight: 12 am.' : 'The hour is less than 12, so it is am.'), S(OM.time24(mins) + ' = ' + OM.time12(mins, true) + '.')] };
      }
      h = r.int(1, 12); m = r.int(0, 59); var pm = r.chance(0.5);
      mins = ((h % 12) + (pm ? 12 : 0)) * 60 + m;
      return { prompt: 'This clock shows a time in the ' + (pm ? 'afternoon or evening' : 'morning') + '. Write the time as a <b>24-hour</b> time.', visual: V.clock(h, m), input: { type: 'text', keys: 'time', placeholder: 'e.g. 14:37' },
        check: { kind: 'time', mins: mins, format: '24' }, answerText: OM.time24(mins), hint: 'Read the clock first. Then, for afternoon times, add 12 to the hour.', params: { mins: mins, h: h, m: m, pm: pm },
        solution: [S('The clock shows ' + OM.time12(mins, false) + ' (' + m + ' minute' + (m === 1 ? '' : 's') + ' past ' + h + ').'), S(pm ? (h === 12 ? 'Just after midday stays 12: ' : 'Afternoon/evening: add 12 to the hour: ') + OM.time24(mins) + '.' : 'Morning: ' + OM.time24(mins) + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      // independent conversion from the clock hands / 12-hour reading
      if (p.h !== undefined && p.pm === undefined) return q.check.mins === (p.h === 12 ? 0 : p.h) * 60 + p.m;
      if (p.h !== undefined) { var hh = p.h === 12 ? (p.pm ? 12 : 0) : p.h + (p.pm ? 12 : 0); return q.check.mins === hh * 60 + p.m; }
      var t = OM.parseTime(OM.time12(p.mins, true)), t2 = OM.parseTime(OM.time24(p.mins));
      return t.mins === p.mins && t2.mins === p.mins && q.check.mins === p.mins;
    }
  });

  OM.registerGen({
    id: 'timeConvert', objective: 'Y4-M-06', title: 'Converting units of time',
    make: function (r, L) {
      var facts = [['hours', 'minutes', 60], ['minutes', 'seconds', 60], ['weeks', 'days', 7], ['years', 'months', 12]], f = r.pick(facts), n;
      if (L === 1) {
        n = r.int(2, 10);
        return { prompt: 'Complete: &nbsp;<b>' + n + ' ' + f[0] + ' = ___ ' + f[1] + '</b>', input: { type: 'number', keys: 'digits', suffix: f[1] }, check: { kind: 'int', value: n * f[2] }, answerText: n * f[2] + ' ' + f[1],
          hint: '1 ' + f[0].replace(/s$/, '') + ' = ' + f[2] + ' ' + f[1] + '.', params: { a: n, b: f[2] },
          solution: [S('1 ' + f[0].replace(/s$/, '') + ' = ' + f[2] + ' ' + f[1] + '.'), S(n + ' × ' + f[2] + ' = ' + n * f[2] + ' ' + f[1] + '.')] };
      }
      if (L === 2) {
        n = r.int(1, 5); var extra = r.int(1, f[2] - 1);
        if (r.chance(0.5)) return { prompt: 'Complete: &nbsp;<b>' + n + ' ' + (n === 1 ? f[0].replace(/s$/, '') : f[0]) + ' ' + extra + ' ' + un(extra, f[1]) + ' = ___ ' + f[1] + '</b>', input: { type: 'number', keys: 'digits', suffix: f[1] }, check: { kind: 'int', value: n * f[2] + extra }, answerText: (n * f[2] + extra) + ' ' + f[1],
          hint: 'Convert the ' + f[0] + ' first, then add the extra ' + f[1] + '.', params: { a: n, b: f[2], c: extra },
          solution: [S(n + ' × ' + f[2] + ' = ' + n * f[2] + ' ' + f[1] + '.'), S(n * f[2] + ' + ' + extra + ' = ' + (n * f[2] + extra) + ' ' + f[1] + '.')] };
        var tot = n * f[2] + extra;
        return { prompt: 'Complete: &nbsp;<b>' + tot + ' ' + f[1] + ' = ___ ' + f[0] + ' ___ ' + f[1] + '</b>', input: { type: 'multi', template: tot + ' ' + f[1] + ' = {0} ' + f[0] + ' {1} ' + f[1], blanks: [{ keys: 'digits' }, { keys: 'digits' }] },
          check: { kind: 'multi', parts: [{ kind: 'int', value: n }, { kind: 'int', value: extra }] }, answerText: n + ' ' + un(n, f[0]) + ' ' + extra + ' ' + un(extra, f[1]),
          hint: 'How many lots of ' + f[2] + ' fit into ' + tot + '? The rest are left over.', params: { tot: tot, b: f[2] },
          reject: [Math.floor(tot / 100) + ' ' + f[0] + ' ' + tot % 100 + ' ' + f[1] + ' (time is not in hundreds)'],
          solution: [S(f[2] + ' × ' + n + ' = ' + n * f[2] + '. That leaves ' + tot + ' − ' + n * f[2] + ' = ' + extra + '.'), S(tot + ' ' + f[1] + ' = ' + n + ' ' + un(n, f[0]) + ' ' + extra + ' ' + un(extra, f[1]) + '.')] };
      }
      var k = r.int(0, 2), name = r.pick(OM.NAMES);
      if (k === 0) {
        var start = r.int(8, 20) * 60 + r.int(0, 11) * 5, dh = r.int(1, 2), dm = r.int(1, 11) * 5, end = start + dh * 60 + dm;
        if (end >= 1440) end -= 120, start -= 120;
        return { prompt: 'A film starts at <b>' + OM.time24(start) + '</b>. It lasts ' + dh + ' hour' + (dh > 1 ? 's' : '') + ' ' + dm + ' minutes. What time does it finish? Give your answer as a 24-hour time.', input: { type: 'text', keys: 'time', placeholder: 'e.g. 16:20' },
          check: { kind: 'time', mins: end, format: '24' }, answerText: OM.time24(end), hint: 'Add the hours first, then the minutes. 60 minutes make 1 hour.', params: { start: start, dh: dh, dm: dm },
          solution: [S('Add ' + dh + ' hour' + (dh > 1 ? 's' : '') + ': ' + OM.time24(start) + ' → ' + OM.time24(start + dh * 60) + '.'), S('Add ' + dm + ' minutes: ' + OM.time24(start + dh * 60) + ' → ' + OM.time24(end) + '.' + ((start % 60) + dm >= 60 ? ' (The minutes went past 60, so the hour went up by 1.)' : ''))] };
      }
      if (k === 1) {
        var y = r.int(7, 10), mo = r.int(1, 11);
        return { prompt: name + ' is ' + y + ' years and ' + mo + ' month' + (mo > 1 ? 's' : '') + ' old. How old is ' + name + ' in months?', input: { type: 'number', keys: 'digits', suffix: 'months' }, check: { kind: 'int', value: y * 12 + mo }, answerText: (y * 12 + mo) + ' months',
          hint: '1 year = 12 months.', params: { a: y, b: 12, c: mo }, solution: [S(y + ' × 12 = ' + y * 12 + ' months.'), S(y * 12 + ' + ' + mo + ' = ' + (y * 12 + mo) + ' months.')] };
      }
      var s1 = r.int(130, 290), mm = r.int(2, 4), ss = r.int(5, 55); if (mm * 60 + ss === s1) s1 += 3;
      var other = mm * 60 + ss, opts = r.shuffle([{ value: 'A', label: s1 + ' seconds' }, { value: 'B', label: mm + ' minutes ' + ss + ' seconds' }]);
      return { prompt: 'Which is <b>longer</b>?', input: { type: 'choice', options: opts }, check: { kind: 'choice', value: s1 > other ? 'A' : 'B', label: s1 > other ? s1 + ' seconds' : mm + ' minutes ' + ss + ' seconds' },
        hint: 'Change the minutes into seconds: 1 minute = 60 seconds.', params: { s1: s1, other: other },
        solution: [S(mm + ' minutes ' + ss + ' seconds = ' + mm + ' × 60 + ' + ss + ' = ' + other + ' seconds.'), S((s1 > other ? s1 + ' seconds is longer' : other + ' seconds is longer') + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.start !== undefined) return q.check.mins === p.start + p.dh * 60 + p.dm;
      if (p.tot) return q.check.parts[0].value * p.b + q.check.parts[1].value === p.tot && q.check.parts[1].value < p.b;
      if (p.s1) return (p.s1 > p.other ? 'A' : 'B') === q.check.value;
      var v = 0; for (var i = 0; i < p.a; i++) v += p.b; return q.check.value === v + (p.c || 0);
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
