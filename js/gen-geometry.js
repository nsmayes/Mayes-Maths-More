/* Learn with Pip — Year 4 generators: geometry (properties of shapes; position and direction).
   Shape answers are checked by an independent classifier that measures the drawn shape's sides and angles.
   Year 4 does not measure angles in degrees (that is Year 5), so no question mentions degrees. */
(function (G) {
  'use strict';
  var OM = G.OM, V = OM.V;
  function S(text, html) { return { text: text, html: html || '' }; }
  var EPS = 1e-6;

  // ---------- shape builders ----------
  var rad = function (d) { return d * Math.PI / 180; };
  var SHAPES = {
    square: function (r) { var s = r.int(3, 6); return [[0, 0], [s, 0], [s, s], [0, s]]; },
    rectangle: function (r) { var w = r.int(4, 8), h = r.int(2, 5); if (w === h) w++; return [[0, 0], [w, 0], [w, h], [0, h]]; },
    rhombus: function (r) { var s = r.int(3, 5), t = rad(r.pick([55, 60, 65, 70, 115, 120, 125])); return [[0, 0], [s, 0], [s + s * Math.cos(t), s * Math.sin(t)], [s * Math.cos(t), s * Math.sin(t)]]; },
    parallelogram: function (r) { var a = r.int(5, 7), b = r.int(2, 4), t = rad(r.pick([50, 60, 65, 70])); return [[0, 0], [a, 0], [a + b * Math.cos(t), b * Math.sin(t)], [b * Math.cos(t), b * Math.sin(t)]]; },
    trapezium: function (r) { var b = r.int(7, 9), h = r.int(3, 4), o1 = r.int(1, 2), o2 = r.int(3, 4); if (r.chance(0.5)) { var t = o1; o1 = o2; o2 = t; } return [[0, 0], [b, 0], [b - o2, h], [o1, h]]; },
    kite: function (r) { var w = r.int(2, 3), a = r.int(2, 3), b = a + r.int(2, 4); return [[0, 0], [w, a], [0, a + b], [-w, a]]; },
    equilateral: function (r) { var s = r.int(4, 6); return [[0, 0], [s, 0], [s / 2, -s * Math.sqrt(3) / 2]]; },
    isosceles: function (r) { var b = r.int(3, 5), h = r.pick([b + 2, b + 3, 2 * b]); return [[0, 0], [b, 0], [b / 2, -h]]; },
    scalene: function (r) {
      // keep all three sides different (e.g. base 5, height 3, apex at 1 would give two sides of 5)
      for (;;) { var b = r.int(5, 7), h = r.int(3, 4), x = r.pick([1, b - 1, b + 1]), s1 = x * x + h * h, s2 = (b - x) * (b - x) + h * h;
        if (s1 !== s2 && s1 !== b * b && s2 !== b * b) return [[0, 0], [b, 0], [x, -h]]; }
    },
    rightScalene: function (r) { var b = r.int(3, 6), h = r.int(2, 5); if (b === h) b++; return [[0, 0], [b, 0], [0, -h]]; },
    rightIsosceles: function (r) { var s = r.int(3, 5); return [[0, 0], [s, 0], [0, -s]]; },
    isoTrapezium: function (r) { var b = r.int(7, 9), h = r.int(3, 4), o = r.int(1, 2); return [[0, 0], [b, 0], [b - o, h], [o, h]]; },
    regular: function (n) { var p = []; for (var k = 0; k < n; k++) p.push([Math.cos(2 * Math.PI * k / n - Math.PI / 2) * 4, Math.sin(2 * Math.PI * k / n - Math.PI / 2) * 4]); return p; }
  };

  // ---------- independent classifier (measures the shape) ----------
  function lens(p) { return p.map(function (a, i) { var b = p[(i + 1) % p.length]; return Math.hypot(b[0] - a[0], b[1] - a[1]); }); }
  function eq(a, b) { return Math.abs(a - b) < EPS * Math.max(1, a, b); }
  function rightAngles(p) {
    var n = p.length, c = 0;
    for (var i = 0; i < n; i++) { var a = p[(i + n - 1) % n], o = p[i], b = p[(i + 1) % n]; var v1 = [a[0] - o[0], a[1] - o[1]], v2 = [b[0] - o[0], b[1] - o[1]]; if (Math.abs(v1[0] * v2[0] + v1[1] * v2[1]) < EPS * Math.hypot(v1[0], v1[1]) * Math.hypot(v2[0], v2[1])) c++; }
    return c;
  }
  function parallelPairs(p) {
    var c = 0;
    for (var i = 0; i < 2; i++) { var a = p[i], b = p[i + 1], d = p[i + 2], e = p[(i + 3) % 4]; var u = [b[0] - a[0], b[1] - a[1]], v = [e[0] - d[0], e[1] - d[1]]; if (Math.abs(u[0] * v[1] - u[1] * v[0]) < EPS * Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1])) c++; }
    return c;
  }
  OM.classifyShape = function (p) {
    var L = lens(p), ra = rightAngles(p);
    if (p.length === 3) {
      var e = (eq(L[0], L[1]) ? 1 : 0) + (eq(L[1], L[2]) ? 1 : 0) + (eq(L[0], L[2]) ? 1 : 0);
      return { sides: e === 3 ? 'equilateral' : e === 1 ? 'isosceles' : 'scalene', right: ra > 0 };
    }
    var all = eq(L[0], L[1]) && eq(L[1], L[2]) && eq(L[2], L[3]), opp = eq(L[0], L[2]) && eq(L[1], L[3]), pp = parallelPairs(p);
    if (all && ra === 4) return { name: 'square' };
    if (all) return { name: 'rhombus' };
    if (opp && ra === 4) return { name: 'rectangle' };
    if (pp === 2) return { name: 'parallelogram' };
    if ((eq(L[0], L[1]) && eq(L[2], L[3])) || (eq(L[1], L[2]) && eq(L[3], L[0]))) return { name: 'kite' };
    if (pp === 1) return { name: 'trapezium' };
    return { name: 'quadrilateral' };
  };
  // count lines of symmetry by reflecting the vertices in every candidate axis through the centre
  OM.symmetryCount = function (p) {
    var cx = 0, cy = 0; p.forEach(function (a) { cx += a[0]; cy += a[1]; }); cx /= p.length; cy /= p.length;
    var cands = [];
    p.forEach(function (a, i) { var b = p[(i + 1) % p.length]; cands.push([a[0] - cx, a[1] - cy]); cands.push([(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy]); });
    var angles = [];
    cands.forEach(function (d) {
      if (Math.hypot(d[0], d[1]) < 1e-9) return;
      var ang = Math.atan2(d[1], d[0]); ang = ((ang % Math.PI) + Math.PI) % Math.PI;
      if (angles.some(function (x) { return Math.abs(x - ang) < 1e-6 || Math.abs(Math.abs(x - ang) - Math.PI) < 1e-6; })) return;
      if (OM.isMirror(p, [cx, cy], ang)) angles.push(ang);
    });
    return angles.length;
  };
  OM.isMirror = function (p, c, ang) {
    var ux = Math.cos(ang), uy = Math.sin(ang), sc = Math.max.apply(null, lens(p));
    return p.every(function (a) {
      var dx = a[0] - c[0], dy = a[1] - c[1], dot = dx * ux + dy * uy, rx = c[0] + 2 * dot * ux - dx, ry = c[1] + 2 * dot * uy - dy;
      return p.some(function (b) { return Math.hypot(b[0] - rx, b[1] - ry) < 1e-6 * sc; });
    });
  };

  // ---------- Y4-G-01 classify shapes ----------
  var QUADS = ['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezium', 'kite'];
  var FACTS = [
    { q: 'How many pairs of parallel sides does a parallelogram have?', a: 2 }, { q: 'How many pairs of parallel sides does a rectangle have?', a: 2 },
    { q: 'How many pairs of parallel sides does a kite have?', a: 0 }, { q: 'How many right angles does a rectangle have?', a: 4 },
    { q: 'How many equal sides does an equilateral triangle have?', a: 3 }, { q: 'How many equal sides does an isosceles triangle have?', a: 2 },
    { q: 'Which quadrilateral has 4 equal sides but no right angles?', a: 'rhombus', opts: ['square', 'rhombus', 'rectangle', 'kite'] },
    { q: 'Which quadrilateral has two pairs of equal sides that are next to each other?', a: 'kite', opts: ['kite', 'rectangle', 'parallelogram', 'trapezium'] },
    { q: 'Which quadrilateral has 4 right angles, but sides that are not all equal?', a: 'rectangle', opts: ['square', 'rectangle', 'rhombus', 'kite'] },
    { q: 'Which triangle has no equal sides?', a: 'scalene', opts: ['equilateral', 'isosceles', 'scalene'] },
    { q: 'Which triangle has exactly 2 equal sides?', a: 'isosceles', opts: ['equilateral', 'isosceles', 'scalene'] },
    { q: 'Which triangle has 3 equal sides?', a: 'equilateral', opts: ['equilateral', 'isosceles', 'scalene'] }
  ];
  OM.SHAPE_FACTS = FACTS;
  OM.registerGen({
    id: 'classifyShapes', objective: 'Y4-G-01', title: 'Naming quadrilaterals and triangles',
    make: function (r, L) {
      var rot = L === 1 ? r.pick([0, 0, 90, 180]) : r.int(0, 23) * 15;
      if (L === 1 || (L === 2 && r.chance(0.4))) {
        var name = r.pick(QUADS), pts = SHAPES[name](r);
        var others = r.sample(QUADS.filter(function (x) { return x !== name; }), 3);
        return { prompt: 'What is the name of this quadrilateral? The marks show equal sides and right angles.', visual: V.polygon(pts, { rotate: rot }), input: { type: 'choice', options: r.shuffle([name].concat(others)).map(function (x) { return { value: x, label: x }; }) },
          check: { kind: 'choice', value: name, label: name }, hint: 'Look at the dash marks (equal sides) and the little squares (right angles).', params: { pts: pts, name: name },
          solution: [S(describe(name)), S('So it is a ' + name + '. Turning a shape does not change its name.')] };
      }
      if (L === 2) {
        var tn = r.pick(['equilateral', 'isosceles', 'scalene', 'rightScalene', 'rightIsosceles']), tp = SHAPES[tn](r), bySides = tn === 'rightScalene' ? 'scalene' : tn === 'rightIsosceles' ? 'isosceles' : tn;
        if (r.chance(0.6)) return { prompt: 'Is this triangle equilateral, isosceles or scalene?', visual: V.polygon(tp, { rotate: rot }), input: { type: 'choice', options: ['equilateral', 'isosceles', 'scalene'].map(function (x) { return { value: x, label: x }; }) },
          check: { kind: 'choice', value: bySides, label: bySides }, hint: 'Count how many sides have the same dash marks.', params: { pts: tp, sides: bySides },
          solution: [S({ equilateral: 'All 3 sides have the same mark: they are all equal.', isosceles: 'Exactly 2 sides have the same mark.', scalene: 'No sides have matching marks: all 3 are different.' }[bySides]), S('So the triangle is ' + bySides + '.')] };
        var right = tn.indexOf('right') === 0;
        return { prompt: 'Does this triangle have a right angle?', visual: V.polygon(tp, { rotate: rot }), input: { type: 'choice', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
          check: { kind: 'choice', value: right ? 'yes' : 'no', label: right ? 'Yes' : 'No' }, hint: 'A right angle is shown with a small square in the corner.', params: { pts: tp, right: right },
          solution: [S(right ? 'One corner has the small square mark: it is a right angle. This is a right-angled triangle.' : 'No corner has a right-angle mark, and no corner is a square corner.')] };
      }
      var f = r.pick(FACTS);
      if (f.opts) return { prompt: f.q, input: { type: 'choice', options: r.shuffle(f.opts).map(function (x) { return { value: x, label: x }; }) }, check: { kind: 'choice', value: f.a, label: f.a },
        hint: 'Picture each shape and check its sides and angles.', params: { fact: f }, solution: [S(describe(f.a)), S('The answer is: ' + f.a + '.')] };
      return { prompt: f.q, input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: f.a }, hint: 'Draw the shape and check.', params: { fact: f }, solution: [S('The answer is ' + f.a + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.name) return OM.classifyShape(p.pts).name === p.name;
      if (p.sides) return OM.classifyShape(p.pts).sides === p.sides;
      if (p.right !== undefined) return OM.classifyShape(p.pts).right === p.right;
      return true; // fixed fact, listed in the report for a person to check
    }
  });
  function describe(n) {
    return { square: 'A square has 4 equal sides and 4 right angles.', rectangle: 'A rectangle has 4 right angles and opposite sides equal.', rhombus: 'A rhombus has 4 equal sides, but no right angles.',
      parallelogram: 'A parallelogram has opposite sides equal and parallel, but no right angles.', trapezium: 'A trapezium has one pair of parallel sides.', kite: 'A kite has two pairs of equal sides that are next to each other.',
      equilateral: 'An equilateral triangle has 3 equal sides.', isosceles: 'An isosceles triangle has exactly 2 equal sides.', scalene: 'A scalene triangle has no equal sides.' }[n] || '';
  }

  // ---------- Y4-G-02 angles ----------
  function pickAngle(r, kind) { return kind === 'right' ? 90 : kind === 'acute' ? r.int(4, 15) * 5 : r.int(21, 33) * 5; }
  OM.registerGen({
    id: 'angles', objective: 'Y4-G-02', title: 'Acute, right and obtuse angles',
    make: function (r, L) {
      if (L === 1) {
        var kind = r.pick(['acute', 'acute', 'right', 'obtuse', 'obtuse']), deg = pickAngle(r, kind);
        return { prompt: 'Is this angle acute, a right angle, or obtuse?', visual: V.angle(deg, { rot: r.int(0, 359) }), input: { type: 'choice', options: [{ value: 'acute', label: 'acute' }, { value: 'right', label: 'right angle' }, { value: 'obtuse', label: 'obtuse' }] },
          check: { kind: 'choice', value: kind, label: kind === 'right' ? 'right angle' : kind }, hint: 'Compare it with the corner of a piece of paper (a right angle).', params: { deg: deg },
          solution: [S(kind === 'right' ? 'The small square shows a right angle (a quarter turn).' : kind === 'acute' ? 'It is smaller than a right angle, so it is acute.' : 'It is bigger than a right angle but smaller than a straight line, so it is obtuse.')] };
      }
      var n = L === 2 ? 3 : 4, degs = [], tries = 0;
      while (degs.length < n && tries++ < 500) { var d = r.int(3, 34) * 5; if (degs.every(function (x) { return Math.abs(x - d) >= 20; })) degs.push(d); }
      var labels = ['A', 'B', 'C', 'D'].slice(0, n), maxD = Math.max.apply(null, degs), minD = Math.min.apply(null, degs);
      var pics = '<div class="pair">' + degs.map(function (d, i) {
        var short = d === maxD && r.chance(0.6); // the biggest angle often gets the shortest arms
        var ln = short ? 55 : r.int(80, 130);
        return '<div>' + V.angle(d, { rot: r.int(0, 359), len1: ln, len2: ln + r.int(-10, 10), label: labels[i] }) + '</div>';
      }).join('') + '</div>';
      if (L === 2) {
        var largest = r.chance(0.6), target = largest ? maxD : minD, idx = degs.indexOf(target);
        return { prompt: 'Which angle is the <b>' + (largest ? 'largest' : 'smallest') + '</b>?', visual: pics, input: { type: 'choice', options: labels.map(function (l) { return { value: l, label: 'Angle ' + l }; }) },
          check: { kind: 'choice', value: labels[idx], label: 'Angle ' + labels[idx] }, hint: 'Look at how wide the turn is between the two lines — not how long the lines are.', params: { degs: degs, largest: largest },
          solution: [S('The size of an angle is the amount of turn between the arms. Long arms do not make an angle bigger.'), S('Angle ' + labels[idx] + ' has the ' + (largest ? 'widest' : 'narrowest') + ' opening.')] };
      }
      var order = degs.map(function (d, i) { return [d, labels[i]]; }).sort(function (a, b) { return a[0] - b[0]; }).map(function (x) { return x[1]; });
      return { prompt: 'Put the angles in order of size, starting with the <b>smallest</b>. Tap them in order.', visual: pics, input: { type: 'order', items: labels.map(function (l) { return { value: l, label: 'Angle ' + l }; }) },
        check: { kind: 'order', order: order, labels: order.map(function (l) { return 'Angle ' + l; }) }, hint: 'Find the acute angles first, then the obtuse ones.', params: { degs: degs },
        solution: [S('Compare each angle with a right angle: acute ones are smaller, obtuse ones are bigger.'), S('Smallest to largest: ' + order.join(', ') + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.deg) return q.check.value === (p.deg < 90 ? 'acute' : p.deg === 90 ? 'right' : 'obtuse') && p.deg < 180;
      var labs = ['A', 'B', 'C', 'D'];
      if (p.largest !== undefined) { var t = p.largest ? Math.max.apply(null, p.degs) : Math.min.apply(null, p.degs); return labs[p.degs.indexOf(t)] === q.check.value; }
      var s = p.degs.map(function (d, i) { return { d: d, l: labs[i] }; }).sort(function (a, b) { return a.d - b.d; }).map(function (x) { return x.l; });
      return s.join() === q.check.order.join() && p.degs.every(function (d) { return d < 180; });
    }
  });

  // ---------- Y4-G-03 lines of symmetry ----------
  function reflectKey(k, m) { var x = +k.split(',')[0], y = +k.split(',')[1]; return m.type === 'v' ? (2 * m.at - 1 - x) + ',' + y : x + ',' + (2 * m.at - 1 - y); }
  OM.reflectCellKey = reflectKey;
  function halfShape(r, k, vertical) {
    // grow a shape in the half before the mirror that touches the mirror line
    var cols = vertical ? 4 : 8, rows = vertical ? 6 : 3;
    var cells = OM.polyomino(r, k, cols, rows).map(function (c) { return c[0] + ',' + c[1]; });
    var touches = cells.some(function (key) { return vertical ? +key.split(',')[0] === 3 : +key.split(',')[1] === 2; });
    if (!touches) cells.push(vertical ? '3,' + r.int(0, 5) : r.int(0, 7) + ',2');
    return cells.filter(function (v, i, a) { return a.indexOf(v) === i; });
  }
  var SYM_SHAPES = [['square', 4], ['rectangle', 2], ['equilateral triangle', 3], ['regular pentagon', 5], ['regular hexagon', 6], ['regular octagon', 8], ['rhombus', 2], ['kite', 1], ['isosceles triangle', 1], ['scalene triangle', 0], ['parallelogram', 0], ['isosceles trapezium', 1]];
  function symShape(r, name) {
    return { 'square': SHAPES.square, 'rectangle': SHAPES.rectangle, 'equilateral triangle': function () { return SHAPES.regular(3); }, 'regular pentagon': function () { return SHAPES.regular(5); },
      'regular hexagon': function () { return SHAPES.regular(6); }, 'regular octagon': function () { return SHAPES.regular(8); }, 'rhombus': SHAPES.rhombus, 'kite': SHAPES.kite,
      'isosceles triangle': SHAPES.isosceles, 'scalene triangle': SHAPES.scalene, 'parallelogram': SHAPES.parallelogram, 'isosceles trapezium': SHAPES.isoTrapezium }[name](r);
  }
  OM.registerGen({
    id: 'symmetryLines', objective: 'Y4-G-03', title: 'Lines of symmetry',
    make: function (r, L) {
      if (L === 1) {
        var vertical = r.chance(0.6), half = halfShape(r, r.int(3, 6), vertical), mirror = { type: vertical ? 'v' : 'h', at: vertical ? 4 : 3 };
        var cells = half.concat(half.map(function (k) { return reflectKey(k, mirror); }));
        var isSym = r.chance(0.5), shownMirror = mirror;
        if (!isSym) {
          if (r.chance(0.5)) { // spoil the shape with one extra square on one side
            var c = r.pick(half).split(',').map(Number), add = vertical ? (c[0] > 0 ? (c[0] - 1) + ',' + c[1] : c[0] + ',' + (c[1] > 0 ? c[1] - 1 : c[1] + 1)) : (c[1] > 0 ? c[0] + ',' + (c[1] - 1) : (c[0] > 0 ? c[0] - 1 : c[0] + 1) + ',' + c[1]);
            if (cells.indexOf(add) < 0 && cells.indexOf(reflectKey(add, mirror)) < 0) cells.push(add); else shownMirror = { type: mirror.type, at: mirror.at + 1 };
          } else shownMirror = { type: mirror.type, at: mirror.at + (r.chance(0.5) ? 1 : -1) };
        }
        var set = {}; cells.forEach(function (k) { set[k] = 1; });
        var truth = cells.every(function (k) { return set[reflectKey(k, shownMirror)]; });
        return { prompt: 'Is the dashed line a line of symmetry for the green shape?', visual: V.gridShape(cells.map(function (k) { return k.split(',').map(Number); }), { cols: 8, rows: 6, mirror: shownMirror }),
          input: { type: 'choice', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] }, check: { kind: 'choice', value: truth ? 'yes' : 'no', label: truth ? 'Yes' : 'No' },
          hint: 'Imagine folding along the dashed line. Would every square land on another square?', params: { cells: cells, mirror: shownMirror },
          solution: [S('Check each square: is there a matching square the same distance from the line on the other side?'), S(truth ? 'Every square has a partner, so yes — it is a line of symmetry.' : 'Some squares have no partner on the other side, so no — it is not a line of symmetry.')] };
      }
      if (L === 2) {
        var sh = r.pick(SYM_SHAPES), pts = symShape(r, sh[0]);
        return { prompt: 'This shape is a <b>' + sh[0] + '</b>. How many lines of symmetry does it have?', visual: V.polygon(pts, { rotate: r.int(0, 23) * 15, ticks: true }), input: { type: 'number', keys: 'digits' },
          check: { kind: 'int', value: sh[1] }, hint: 'Imagine folding the shape in different ways: up and down, across, and corner to corner.', params: { pts: pts },
          solution: [S('Try every possible fold: through corners and through the middles of sides.'), S('A ' + sh[0] + ' has ' + sh[1] + ' line' + (sh[1] === 1 ? '' : 's') + ' of symmetry. Turning the shape does not change this.')] };
      }
      var diag = r.pick([['square', [0, 2]], ['rectangle', [0, 2]], ['rhombus', [0, 2]], ['rhombus', [1, 3]], ['kite', [0, 2]], ['kite', [1, 3]], ['parallelogram', [0, 2]]]);
      var p3 = symShape(r, diag[0]), axis = [p3[diag[1][0]], p3[diag[1][1]]];
      var facts = { 'square02': true, 'rectangle02': false, 'rhombus02': true, 'rhombus13': true, 'kite02': true, 'kite13': false, 'parallelogram02': false };
      var ans = facts[diag[0] + diag[1].join('')];
      return { prompt: 'This shape is a <b>' + diag[0] + '</b>. Is the dashed line (corner to corner) a line of symmetry?', visual: V.polygon(p3, { rotate: r.int(0, 23) * 15, axis: axis }),
        input: { type: 'choice', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] }, check: { kind: 'choice', value: ans ? 'yes' : 'no', label: ans ? 'Yes' : 'No' },
        hint: 'If you folded along the line, would the two halves match exactly?', params: { pts: p3, axis: axis },
        solution: [S(ans ? 'Folding along this diagonal, the two halves match exactly.' : 'Folding along this diagonal, the corners do not land on each other.'), S(ans ? 'So yes, it is a line of symmetry.' : 'So no, it is not a line of symmetry. (A rectangle\'s diagonal is a common trick!)')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.cells) { var set = {}; p.cells.forEach(function (k) { set[k] = 1; }); var ok = p.cells.every(function (k) { return set[reflectKey(k, p.mirror)]; }); return (ok ? 'yes' : 'no') === q.check.value; }
      if (p.axis) { var c = [(p.axis[0][0] + p.axis[1][0]) / 2, (p.axis[0][1] + p.axis[1][1]) / 2], ang = Math.atan2(p.axis[1][1] - p.axis[0][1], p.axis[1][0] - p.axis[0][0]); return (OM.isMirror(p.pts, c, ang) ? 'yes' : 'no') === q.check.value; }
      return OM.symmetryCount(p.pts) === q.check.value;
    }
  });

  // ---------- Y4-G-04 complete a symmetric figure ----------
  OM.registerGen({
    id: 'completeSymmetry', objective: 'Y4-G-04', title: 'Complete the symmetric shape',
    make: function (r, L) {
      var vertical = L < 3 || r.chance(0.4), k = L === 1 ? r.int(3, 4) : L === 2 ? r.int(5, 7) : r.int(7, 10);
      var mirror = { type: vertical ? 'v' : 'h', at: vertical ? 4 : 3 }, cols = 8, rows = 6;
      var fixed = OM.polyomino(r, k, vertical ? 4 : 8, vertical ? 6 : 3).map(function (c) { return c[0] + ',' + c[1]; });
      var answer = fixed.map(function (key) { return reflectKey(key, mirror); });
      return { prompt: 'Tap the squares to complete the shape so that the dashed line is a <b>line of symmetry</b>.', input: { type: 'tapgrid', cols: cols, rows: rows, fixed: fixed, mirror: mirror, side: vertical ? 'right' : 'below' },
        check: { kind: 'cells', cells: answer }, answerText: 'the reflected shape shown in the solution', hint: 'For each green square, count how far it is from the line. Shade the square the same distance away on the other side.', params: { fixed: fixed, mirror: mirror },
        solution: [S('Reflect each square across the mirror line: same distance, other side.'), S('The completed shape:', V.gridShape(fixed.map(function (x) { return x.split(',').map(Number); }), { cols: cols, rows: rows, mirror: mirror, extra: answer.map(function (x) { return x.split(',').map(Number); }) }))] };
    },
    verify: function (q) {
      var p = q.params;
      return q.check.cells.every(function (key) {
        var x = +key.split(',')[0], y = +key.split(',')[1];
        // independent: distance from the line must equal that of a fixed square on the other side
        return p.fixed.some(function (f) { var fx = +f.split(',')[0], fy = +f.split(',')[1]; return p.mirror.type === 'v' ? fy === y && (p.mirror.at - fx) === (x + 1 - p.mirror.at) : fx === x && (p.mirror.at - fy) === (y + 1 - p.mirror.at); });
      }) && q.check.cells.length === p.fixed.length;
    }
  });

  // ---------- Y4-P-01 coordinates ----------
  OM.registerGen({
    id: 'readCoordinates', objective: 'Y4-P-01', title: 'Reading coordinates',
    make: function (r, L) {
      if (L === 1) {
        var x = r.int(0, 8), y = r.int(0, 8); if (x === y) x = (x + 3) % 9;
        return { prompt: 'What are the coordinates of point A?', visual: V.coordGrid({ size: 8, points: [{ x: x, y: y, label: 'A' }] }), input: { type: 'coord' }, check: { kind: 'coord', x: x, y: y },
          hint: 'Go along the x-axis first, then up.', params: { x: x, y: y },
          solution: [S('Go along ' + x + ', then up ' + y + '.', V.coordGrid({ size: 8, points: [{ x: x, y: y, label: 'A' }], arrows: [[[0, 0], [x, 0]], [[x, 0], [x, y]]] })), S('A is at (' + x + ', ' + y + ').')] };
      }
      if (L === 2) {
        var a = r.int(1, 8), b = r.int(0, 8); if (a === b) b = (b + 2) % 9;
        var pts = [{ x: a, y: b, label: 'A' }, { x: b, y: a, label: 'B' }, { x: r.int(0, 8), y: r.int(0, 8), label: 'C' }];
        if ((pts[2].x === a && pts[2].y === b) || (pts[2].x === b && pts[2].y === a)) pts[2].x = (pts[2].x + 1) % 9;
        var ask = r.pick(pts);
        return { prompt: 'What are the coordinates of point <b>' + ask.label + '</b>?', visual: V.coordGrid({ size: 8, points: pts }), input: { type: 'coord' }, check: { kind: 'coord', x: ask.x, y: ask.y },
          hint: 'Along the corridor, then up the stairs.', params: { x: ask.x, y: ask.y, pts: pts, label: ask.label },
          solution: [S(ask.label + ' is ' + ask.x + ' along and ' + ask.y + ' up.'), S(ask.label + ' = (' + ask.x + ', ' + ask.y + '). Careful: (' + ask.y + ', ' + ask.x + ') is a different point!')] };
      }
      var horiz = r.chance(0.5), d = r.int(1, 4) * 2, x1 = r.int(0, 10 - (horiz ? d : 0)), y1 = r.int(0, 10 - (horiz ? 0 : d));
      var A = [x1, y1], B = horiz ? [x1 + d, y1] : [x1, y1 + d], M = horiz ? [x1 + d / 2, y1] : [x1, y1 + d / 2];
      return { prompt: 'Point M is exactly halfway between A (' + A.join(', ') + ') and B (' + B.join(', ') + '). What are the coordinates of M?', visual: V.coordGrid({ size: 10, cell: 26, points: [{ x: A[0], y: A[1], label: 'A' }, { x: B[0], y: B[1], label: 'B' }], segments: [[A, B]] }),
        input: { type: 'coord' }, check: { kind: 'coord', x: M[0], y: M[1] }, hint: 'Which coordinate changes from A to B? Find the number halfway between.', params: { A: A, B: B },
        solution: [S((horiz ? 'The y-coordinate stays ' + y1 + '. The x-coordinate goes from ' + A[0] + ' to ' + B[0] : 'The x-coordinate stays ' + x1 + '. The y-coordinate goes from ' + A[1] + ' to ' + B[1]) + ': halfway is ' + (horiz ? M[0] : M[1]) + '.'), S('M = (' + M.join(', ') + ').')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.A) return q.check.x * 2 === p.A[0] + p.B[0] && q.check.y * 2 === p.A[1] + p.B[1];
      if (p.pts) return p.pts.filter(function (pt) { return pt.label === p.label; })[0].x === q.check.x && p.pts.filter(function (a) { return a.x === q.check.x && a.y === q.check.y; }).length === 1;
      return q.check.x === p.x && q.check.y === p.y;
    },
    constraints: function (q) { return [q.check.x, q.check.y].some(function (v) { return v < 0 || v > 10; }) ? ['coordinate outside first quadrant grid'] : []; }
  });

  // ---------- Y4-P-02 translations ----------
  OM.registerGen({
    id: 'translations', objective: 'Y4-P-02', title: 'Translations',
    make: function (r, L) {
      var x = r.int(1, 7), y = r.int(1, 7), dx = 0, dy = 0;
      if (L === 1) { if (r.chance(0.5)) dx = r.int(1, 3) * (r.chance(0.5) || x < 4 ? 1 : -1); else dy = r.int(1, 3) * (r.chance(0.5) || y < 4 ? 1 : -1); }
      else { dx = r.int(1, 4) * (x > 4 && r.chance(0.6) ? -1 : 1); dy = r.int(1, 4) * (y > 4 && r.chance(0.6) ? -1 : 1); }
      var nx = x + dx, ny = y + dy;
      if (nx < 0 || nx > 10 || ny < 0 || ny > 10) return this.make(r, L);
      function mv(d, a, b) { return Math.abs(d) + ' square' + (Math.abs(d) > 1 ? 's' : '') + ' ' + (d > 0 ? a : b); }
      var desc = [dx ? mv(dx, 'right', 'left') : '', dy ? mv(dy, 'up', 'down') : ''].filter(Boolean).join(' and ');
      var grid = V.coordGrid({ size: 10, cell: 26, points: [{ x: x, y: y, label: 'A' }].concat(L === 3 ? [{ x: nx, y: ny, label: 'B', color: '#3d7bd9' }] : []) });
      var solGrid = V.coordGrid({ size: 10, cell: 26, points: [{ x: x, y: y, label: 'A' }, { x: nx, y: ny, label: L === 3 ? 'B' : 'A\'', color: '#3d7bd9' }], arrows: [[[x, y], [nx, y]], [[nx, y], [nx, ny]]].filter(function (a) { return a[0][0] !== a[1][0] || a[0][1] !== a[1][1]; }) });
      if (L < 3) return { prompt: 'Point A is at (' + x + ', ' + y + '). It is translated <b>' + desc + '</b>. What are its new coordinates?', visual: grid, input: { type: 'coord' }, check: { kind: 'coord', x: nx, y: ny },
        hint: 'Right and left change the first number (x). Up and down change the second number (y).', params: { x: x, y: y, dx: dx, dy: dy },
        solution: [S((dx ? 'x: ' + x + (dx > 0 ? ' + ' : ' − ') + Math.abs(dx) + ' = ' + nx + '. ' : 'x stays ' + x + '. ') + (dy ? 'y: ' + y + (dy > 0 ? ' + ' : ' − ') + Math.abs(dy) + ' = ' + ny + '.' : 'y stays ' + y + '.'), solGrid), S('The new point is (' + nx + ', ' + ny + ').')] };
      return { prompt: 'Describe the translation that moves point A (' + x + ', ' + y + ') to point B (' + nx + ', ' + ny + ').', visual: grid,
        input: { type: 'multi', template: '{0} squares {1} and {2} squares {3}', blanks: [{ keys: 'digits' }, { select: ['left', 'right'] }, { keys: 'digits' }, { select: ['up', 'down'] }] },
        check: { kind: 'multi', parts: [{ kind: 'int', value: Math.abs(dx) }, { kind: 'choice', value: dx > 0 ? 'right' : 'left' }, { kind: 'int', value: Math.abs(dy) }, { kind: 'choice', value: dy > 0 ? 'up' : 'down' }] }, answerText: desc,
        hint: 'Compare the x-coordinates for left/right, then the y-coordinates for up/down.', params: { x: x, y: y, dx: dx, dy: dy },
        solution: [S('x goes from ' + x + ' to ' + nx + ': ' + mv(dx, 'right', 'left') + '. y goes from ' + y + ' to ' + ny + ': ' + mv(dy, 'up', 'down') + '.', solGrid), S('The translation is ' + desc + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (q.check.kind === 'coord') return q.check.x === p.x + p.dx && q.check.y === p.y + p.dy;
      var c = q.check.parts; return (c[1].value === 'right' ? 1 : -1) * c[0].value === p.dx && (c[3].value === 'up' ? 1 : -1) * c[2].value === p.dy && p.dx !== 0 && p.dy !== 0;
    }
  });

  // ---------- Y4-P-03 complete a polygon ----------
  OM.registerGen({
    id: 'completePolygon', objective: 'Y4-P-03', title: 'Complete the shape on a grid',
    make: function (r, L) {
      var V4, kind;
      if (L < 3) {
        var x1 = r.int(0, 4), y1 = r.int(0, 4), w = r.int(2, 5), h = L === 2 && r.chance(0.5) ? w : r.int(2, 5);
        kind = w === h ? 'square' : 'rectangle';
        V4 = [[x1, y1], [x1 + w, y1], [x1 + w, y1 + h], [x1, y1 + h]];
      } else {
        var p = r.int(1, 3), q = r.int(1, 3), ax = r.int(q, 9 - p), ay = r.int(0, 9 - p - q);
        V4 = [[ax, ay], [ax + p, ay + q], [ax + p - q, ay + q + p], [ax - q, ay + p]]; kind = 'square';
        if (V4.some(function (v) { return v[0] < 0 || v[1] < 0 || v[0] > 10 || v[1] > 10; })) return this.make(r, L);
      }
      var names = ['A', 'B', 'C', 'D'], miss = L === 1 ? 3 : r.int(0, 3);
      var shown = [0, 1, 2, 3].filter(function (i) { return i !== miss; });
      var segs = [[0, 1], [1, 2], [2, 3], [3, 0]].filter(function (s) { return s[0] !== miss && s[1] !== miss; }).map(function (s) { return [V4[s[0]], V4[s[1]]]; });
      var grid = V.coordGrid({ size: 10, cell: 26, points: shown.map(function (i) { return { x: V4[i][0], y: V4[i][1], label: names[i] }; }), segments: segs });
      var M = V4[miss];
      return { prompt: 'A, B, C and D are the corners of a <b>' + kind + '</b> ABCD. Three corners are plotted. What are the coordinates of <b>' + names[miss] + '</b>?', visual: grid, input: { type: 'coord' }, check: { kind: 'coord', x: M[0], y: M[1] },
        hint: L < 3 ? 'The missing corner lines up with the other corners: same x as one, same y as another.' : 'The sides of a square are all the same length. Copy the "along and up" movement of one side.', params: { V4: V4, miss: miss },
        solution: [S(L < 3 ? names[miss] + ' must line up with its neighbours: it has the same x-coordinate as one neighbour and the same y-coordinate as the other.' : 'The opposite side of a square goes the same way. Use the movement from one corner to the next to find the missing one.'),
          S(names[miss] + ' = (' + M.join(', ') + ').', V.coordGrid({ size: 10, cell: 26, polygon: V4, points: V4.map(function (v, i) { return { x: v[0], y: v[1], label: names[i] }; }) }))] };
    },
    verify: function (q) {
      var V4 = q.params.V4, m = q.params.miss;
      // missing vertex = sum of its two neighbours minus the opposite corner (parallelogram rule), then check right angles
      var a = V4[(m + 1) % 4], b = V4[(m + 2) % 4], c = V4[(m + 3) % 4];
      var D = [a[0] + c[0] - b[0], a[1] + c[1] - b[1]];
      return D[0] === q.check.x && D[1] === q.check.y && rightAngles(V4) === 4;
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
