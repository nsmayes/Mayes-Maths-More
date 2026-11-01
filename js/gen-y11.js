/* Learn with Pip — Year 11 (GCSE) question generators: ratio, geometry and statistics.
   Levels are grade bands: 1 = Grade 1–3, 2 = Grade 4–5, 3 = Grade 6–7 (Foundation-tier students stop at Grade 4–5).
   Many levels re-use tested Key Stage 3 generators (K.gcse in kit.js); new GCSE content is written here, each with its own check. */
(function (G) {
  'use strict';
  var OM = G.OM, K = OM.kit, V = OM.V, S = K.S, fmt = OM.fmt, F = K.fr, A = OM.alg, C = V.colors;
  function Q(n, d) { return A.Q(n, d); }
  function neg(n) { return n < 0 ? '−' + fmt(-n) : fmt(n); }
  function simp(n, d) { var g = OM.gcd(n, d); return [n / g, d / g]; }
  function rnd(x, dp) { var f = Math.pow(10, dp); return Math.round(x * f) / f; }
  var gc = K.gcse;

  // ---------- pictures ----------
  function circlePart(part) {
    var cx = 130, cy = 115, R = 90, b = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="' + C.skyLight + '" stroke="' + C.ink + '" stroke-width="3"/><circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="' + C.ink + '"/>', red = C.berry;
    var pt = function (deg) { var a = deg * Math.PI / 180; return [cx + R * Math.cos(a), cy - R * Math.sin(a)]; }, P = function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); };
    var a1 = pt(150), a2 = pt(30), s1 = pt(200), s2 = pt(320);
    if (part === 'radius') b += V.line(cx, cy, a2[0].toFixed(1), a2[1].toFixed(1), { w: 5, stroke: red });
    if (part === 'diameter') b += V.line(cx - R, cy, cx + R, cy, { w: 5, stroke: red });
    if (part === 'chord') b += V.line(a1[0].toFixed(1), a1[1].toFixed(1), a2[0].toFixed(1), a2[1].toFixed(1), { w: 5, stroke: red });
    if (part === 'tangent') b += V.line(cx - 110, cy - R, cx + 110, cy - R, { w: 5, stroke: red });
    if (part === 'arc') b += '<path d="M' + P(a1) + ' A' + R + ' ' + R + ' 0 0 1 ' + P(a2) + '" fill="none" stroke="' + red + '" stroke-width="7"/>';
    if (part === 'sector') b += '<path d="M' + cx + ' ' + cy + ' L' + P(s1) + ' A' + R + ' ' + R + ' 0 0 0 ' + P(s2) + ' Z" fill="' + C.berryLight + '" stroke="' + red + '" stroke-width="3"/>';
    if (part === 'segment') b += '<path d="M' + P(a1) + ' A' + R + ' ' + R + ' 0 0 1 ' + P(a2) + ' Z" fill="' + C.berryLight + '" stroke="' + red + '" stroke-width="3"/>';
    return V.svg(260, 230, b);
  }
  // a plan view: a grid of numbers showing how many cubes are stacked in each place (rows from back to front)
  function planGrid(h) {
    var s = 46, b = '';
    h.forEach(function (row, i) { row.forEach(function (v, j) { b += V.rect(10 + j * s, 10 + i * s, s, s, { fill: v ? C.amberLight : '#fff', stroke: C.ink, w: 2 }) + (v ? V.t(10 + j * s + s / 2, 10 + i * s + s / 2 + 1, String(v), { size: 18, weight: 'bold' }) : ''); }); });
    return V.svg(20 + h[0].length * s, 40 + h.length * s, b + V.t(10 + h[0].length * s / 2, 30 + h.length * s, 'front', { size: 13, fill: C.soft }));
  }
  // north line at A and a line to B at a bearing
  function bearingPic(brg) {
    var ax = 140, ay = 150, L = 100, a = brg * Math.PI / 180, bx = ax + L * Math.sin(a), by = ay - L * Math.cos(a);
    return V.svg(280, 280, V.line(ax, ay, ax, ay - 115, { w: 2.5 }) + '<path d="M' + (ax - 7) + ' ' + (ay - 105) + ' L' + ax + ' ' + (ay - 120) + ' L' + (ax + 7) + ' ' + (ay - 105) + 'Z" fill="' + C.ink + '"/>' + V.t(ax, ay - 128, 'N', { size: 15, weight: 'bold' }) +
      V.line(ax, ay, bx.toFixed(1), by.toFixed(1), { w: 3, stroke: C.berry }) + '<circle cx="' + ax + '" cy="' + ay + '" r="4" fill="' + C.ink + '"/>' + V.t(ax - 14, ay + 4, 'A', { size: 15, weight: 'bold' }) + '<circle cx="' + bx.toFixed(1) + '" cy="' + by.toFixed(1) + '" r="4" fill="' + C.berry + '"/>' + V.t((bx + 14).toFixed(1), (by + 4).toFixed(1), 'B', { size: 15, weight: 'bold', fill: C.berry }) +
      '<path d="M' + ax + ' ' + (ay - 34) + ' A34 34 0 ' + (brg > 180 ? 1 : 0) + ' 1 ' + (ax + 34 * Math.sin(a)).toFixed(1) + ' ' + (ay - 34 * Math.cos(a)).toFixed(1) + '" fill="none" stroke="' + C.sky + '" stroke-width="2.5"/>');
  }
  function vecHTML(a, b) { return '<span class="colvec" aria-label="column vector ' + neg(a) + ', ' + neg(b) + '"><span class="par">(</span><span class="cv"><span>' + neg(a) + '</span><span>' + neg(b) + '</span></span><span class="par">)</span></span>'; }

  // ================= RATIO, PROPORTION AND RATES =================
  gc({ id: 'g11Units', objective: 'Y11-R1', title: 'Converting standard and compound units', levels: { 1: ['y7Units', 2], 2: ['y7Units', 3], 3: ['y8Compound', 3] } });
  gc({ id: 'g11Scale', objective: 'Y11-R2', title: 'Scale factors, diagrams and maps', levels: { 1: ['y8Scale', 1], 2: ['y8Scale', 2], 3: ['y8Scale', 3] } });
  gc({ id: 'g11FracOf', objective: 'Y11-R3', title: 'One quantity as a fraction of another', levels: { 1: ['y7FracOf', 1], 2: ['y7FracOf', 2], 3: ['y7FracOf', 3] } });
  gc({ id: 'g11RatioNotation', objective: 'Y11-R4', title: 'Ratio notation', levels: { 1: ['y7RatioSimplify', 1], 2: ['y7RatioSimplify', 2], 3: ['y7RatioSimplify', 3] } });
  gc({ id: 'g11RatioShare', objective: 'Y11-R5', title: 'Sharing in a ratio and ratio problems', levels: { 1: ['y7RatioShare', 1], 2: ['y7RatioShare', 2], 3: ['y7RatioShare', 3] } });
  gc({ id: 'g11RatioFraction', objective: 'Y11-R6', title: 'Relationships as ratios or fractions', levels: { 1: ['y8RatioFraction', 1], 2: ['y8RatioFraction', 2], 3: ['y9RatioLinear', 1] } });
  gc({ id: 'g11Proportion', objective: 'Y11-R7', title: 'Proportion as equality of ratios', levels: {
    1: { make: function (r) { var a = r.int(1, 7), b = r.int(2, 9), k = r.int(2, 8); return K.int('Find the missing number: &nbsp;<b>' + a + ' : ' + b + ' = ' + a * k + ' : ?</b>', b * k, { hint: 'What has ' + a + ' been multiplied by to give ' + a * k + '?', params: { a: a, b: b, c: a * k }, sol: [a + ' × ' + k + ' = ' + a * k + ', so ' + b + ' × ' + k + ' = ' + b * k + '.'] }); },
      verify: function (q) { var p = q.params; return p.a * q.check.value === p.b * p.c; } },
    2: { make: function (r) { var a = r.int(2, 9), b = r.int(2, 9), k = r.pick([2, 3, 4, 5, 1.5, 2.5]), c = a * k, d = b * k; if (c % 1 || d % 1) { k = 3; c = a * 3; d = b * 3; }
      return K.dec('Find x: &nbsp;<b>x : ' + d + ' = ' + a + ' : ' + b + '</b>', String(c), { hint: 'The ratios are equal, so x ÷ ' + d + ' = ' + a + ' ÷ ' + b + '.', params: { a: a, b: b, d: d }, sol: [d + ' ÷ ' + b + ' = ' + k + '.', 'x = ' + a + ' × ' + k + ' = ' + c + '.'] }); },
      verify: function (q) { var p = q.params; return Math.abs(parseFloat(q.check.value) * p.b - p.a * p.d) < 1e-9; } },
    3: { make: function (r) { var f = r.int(3, 7), s = r.int(1, f - 1), k = r.int(20, 90) * 5; while (OM.gcd(f, s) !== 1) s = r.int(1, f - 1);
      return K.int('In a recipe, flour and sugar are in the ratio ' + f + ' : ' + s + '. Mo uses ' + f * k + ' g of flour. How much sugar should Mo use?', s * k, { suffix: 'g', hint: 'Keep the ratio equal: how many times bigger is ' + f * k + ' than ' + f + '?', params: { f: f, s: s, fl: f * k }, sol: [f * k + ' ÷ ' + f + ' = ' + k + '.', 'Sugar: ' + s + ' × ' + k + ' = ' + s * k + ' g.'] }); },
      verify: function (q) { var p = q.params; return q.check.value * p.f === p.fl * p.s; } } } });
  gc({ id: 'g11RatioLinear', objective: 'Y11-R8', title: 'Ratios, fractions and linear functions', levels: { 1: ['y9RatioLinear', 1], 2: ['y9RatioLinear', 2], 3: ['y9RatioLinear', 3] } });
  gc({ id: 'g11Percent', objective: 'Y11-R9', title: 'Percentages and percentage change', levels: { 1: ['y7Percent', 2], 2: ['y8PercentChange', 2], 3: ['y8PercentChange', 3] } });
  gc({ id: 'g11DirectInverse', objective: 'Y11-R10', title: 'Direct and inverse proportion', levels: { 1: ['y8Direct', 1], 2: ['y9InverseProportion', 1], 3: ['y9InverseProportion', 2] } });
  gc({ id: 'g11Compound', objective: 'Y11-R11', title: 'Speed, unit pricing, density and pressure', levels: {
    1: ['y8Compound', 1], 2: ['y8Compound', 2],
    3: { make: function (r) { var area = r.pick(['0.2', '0.4', '0.5', '0.8', '1.5', '2.5']), P = r.int(4, 40) * 10, Fv = A.mul(A.parseQ(area), Q(P)), findP = r.chance(0.5);
      if (findP) return K.dec('A force of ' + A.decText(Fv) + ' N acts on an area of ' + area + ' m². Work out the pressure. (Pressure = force ÷ area)', String(P), { suffix: 'N/m²', hint: 'Pressure = force ÷ area.', params: { F: A.decText(Fv), A: area, find: 'P' }, sol: [A.decText(Fv) + ' ÷ ' + area + ' = ' + P + ' N/m².'] });
      return K.dec('A pressure of ' + P + ' N/m² acts on an area of ' + area + ' m². Work out the force. (Pressure = force ÷ area)', A.decText(Fv), { suffix: 'N', hint: 'Force = pressure × area.', params: { P: P, A: area, find: 'F' }, sol: [P + ' × ' + area + ' = ' + A.decText(Fv) + ' N.'] }); },
      verify: function (q) { var p = q.params, v = parseFloat(q.check.value); return p.find === 'P' ? Math.abs(v * parseFloat(p.A) - parseFloat(p.F)) < 1e-9 : Math.abs(v / parseFloat(p.A) - p.P) < 1e-9; } } } });
  gc({ id: 'g11CompareRatio', objective: 'Y11-R12', title: 'Comparing lengths, areas and volumes with ratios', levels: (function () {
    function mk(kind) { return { make: function (r) { var a = r.int(1, 5), b = r.int(2, 6); while (a === b || OM.gcd(a, b) !== 1) b = r.int(2, 6);
      var shape = kind === 'vol' ? 'cubes' : 'squares', what = kind === 'len' ? 'perimeters' : kind === 'area' ? 'areas' : 'volumes', pw = kind === 'len' ? 1 : kind === 'area' ? 2 : 3, x = Math.pow(a, pw), y = Math.pow(b, pw);
      return K.multi('Two ' + shape + ' have sides of ' + a + ' cm and ' + b + ' cm. Write the ratio of their <b>' + what + '</b> in its simplest form.', '{0} : {1}', [{ kind: 'int', value: x }, { kind: 'int', value: y }], { hint: kind === 'len' ? 'Perimeters are in the same ratio as the sides.' : kind === 'area' ? 'Work out each area, or square the length ratio.' : 'Work out each volume, or cube the length ratio.', params: { a: a, b: b, pw: pw, shape: shape }, answer: x + ' : ' + y,
        sol: [kind === 'len' ? 'Perimeters: ' + 4 * a + ' cm and ' + 4 * b + ' cm.' : kind === 'area' ? 'Areas: ' + a * a + ' cm² and ' + b * b + ' cm².' : 'Volumes: ' + a * a * a + ' cm³ and ' + b * b * b + ' cm³.', 'Ratio: ' + x + ' : ' + y + '.'] }); },
      verify: function (q) { var p = q.params, f = p.shape === 'cubes' ? function (s) { return s * s * s; } : p.pw === 1 ? function (s) { return 4 * s; } : function (s) { return s * s; }, A1 = f(p.a), B1 = f(p.b), g = OM.gcd(A1, B1); return q.check.parts[0].value === A1 / g && q.check.parts[1].value === B1 / g; } }; }
    return { 1: mk('len'), 2: mk('area'), 3: mk('vol') };
  })() });
  gc({ id: 'g11InverseEq', objective: 'Y11-R13', title: 'Proportion equations', levels: { 1: ['y9InverseProportion', 2], 2: ['y9InverseProportion', 3], 3: ['y8Direct', 3] } });
  gc({ id: 'g11RateGraphs', objective: 'Y11-R14', title: 'Gradient as a rate of change; proportion graphs', levels: {
    1: { make: function (r) { var rate = r.int(2, 12), t = r.pick([5, 8, 10]); return K.int('The graph shows the volume of water in a tank as it fills. How many litres flow in each minute?', rate, { suffix: 'litres per minute', visual: V.plot({ x: [0, t], y: [0, rate * t], gy: rate * t / 10, ly: 2, fns: [{ f: function (x) { return rate * x; } }], xlabel: 'Time (minutes)', ylabel: 'Volume (litres)' }), hint: 'The gradient is the rate: change in volume ÷ change in time.', params: { rate: rate, t: t }, sol: ['In ' + t + ' minutes, ' + rate * t + ' litres flow in.', rate * t + ' ÷ ' + t + ' = ' + rate + ' litres per minute.'] }); },
      verify: function (q) { var p = q.params; return q.check.value * p.t === p.rate * p.t; } },
    2: { make: function (r) { var k = r.pick(['inverse', 'direct']), pics = { direct: V.plot({ x: [0, 6], y: [0, 12], gy: 2, fns: [{ f: function (x) { return 2 * x; } }] }).replace(/width="\d+"/, 'width="170"'), inverse: V.plot({ x: [0, 6], y: [0, 12], gy: 2, fns: [{ f: function (x) { return 6 / x; } }] }).replace(/width="\d+"/, 'width="170"'), linear: V.plot({ x: [0, 6], y: [0, 12], gy: 2, fns: [{ f: function (x) { return x + 4; } }] }).replace(/width="\d+"/, 'width="170"') };
      return K.choice('Which graph shows y <b>' + (k === 'direct' ? 'directly' : 'inversely') + ' proportional</b> to x?', r.shuffle(['direct', 'inverse', 'linear']).map(function (v) { return { value: v, label: pics[v] }; }), k, { hint: k === 'direct' ? 'Direct proportion: a straight line through the origin.' : 'Inverse proportion: as x doubles, y halves. The curve gets closer to the axes.', params: { k: k }, sol: [k === 'direct' ? 'A straight line through (0, 0) shows direct proportion.' : 'A curve like y = 6/x shows inverse proportion.'] }); },
      verify: function (q) { return q.check.value === q.params.k; } },
    3: { make: function (r) { var fixed = r.int(2, 8) * 5, rate = r.int(3, 9) * 5, h = r.int(2, 6);
      return K.int('A straight-line graph of the cost of hiring a van (£) against the number of hours passes through (0, ' + fixed + ') and (' + h + ', ' + (fixed + rate * h) + '). What is the gradient, and what does it represent?', rate, { prefix: '£', suffix: 'per hour', hint: 'Gradient = change in cost ÷ change in hours. It is the extra cost for each hour.', params: { pts: [0, fixed, h, fixed + rate * h] }, sol: ['Gradient = (' + (fixed + rate * h) + ' − ' + fixed + ') ÷ ' + h + ' = ' + rate + '.', 'It is the cost per hour: £' + rate + '. (The intercept, £' + fixed + ', is the fixed charge.)'] }); },
      verify: function (q) { var p = q.params.pts; return q.check.value * (p[2] - p[0]) === p[3] - p[1]; } } } });
  gc({ id: 'g11Growth', objective: 'Y11-R16', title: 'Growth and decay', levels: { 1: ['y9CompoundInterest', 1], 2: ['y9CompoundInterest', 2], 3: ['y9CompoundInterest', 3] } });

  // ================= GEOMETRY =================
  gc({ id: 'g11Terms', objective: 'Y11-G1', title: 'Geometric terms and notation', levels: { 1: ['y7Symmetry', 1], 2: ['y7Symmetry', 2], 3: ['y9Congruence', 1] } });
  gc({ id: 'g11Constructions', objective: 'Y11-G2', title: 'Constructions and loci', levels: { 1: ['y8Constructions', 1], 2: ['y8Constructions', 2], 3: ['y8Constructions', 3] } });
  gc({ id: 'g11AngleFacts', objective: 'Y11-G3', title: 'Angle facts and polygons', levels: { 1: ['y7Angles', 2], 2: ['y8ParallelAngles', 2], 3: ['y7AngleSum', 3] } });
  gc({ id: 'g11Quadrilaterals', objective: 'Y11-G4', title: 'Properties of quadrilaterals and triangles', levels: { 1: ['y7Symmetry', 3], 2: ['y9Properties', 1], 3: ['y9Properties', 2] } });
  gc({ id: 'g11Congruence', objective: 'Y11-G5', title: 'Congruence criteria', levels: { 1: ['y9Congruence', 2], 2: ['y9Congruence', 2], 3: ['y9Congruence', 3] } });
  gc({ id: 'g11Reasoning', objective: 'Y11-G6', title: 'Angle reasoning and simple proofs', levels: { 1: ['y9AngleReasons', 1], 2: ['y9AngleReasons', 2], 3: ['y9AngleReasons', 3] } });
  gc({ id: 'g11Transformations', objective: 'Y11-G7', title: 'Transformations and enlargement', levels: { 1: ['y8Transform', 2], 2: ['y8Transform', 3], 3: ['y9Enlargement', 3] } });
  var PARTS = [['radius', 'from the centre to the edge'], ['diameter', 'right across through the centre'], ['chord', 'a straight line joining two points on the circle'], ['tangent', 'a straight line that touches the circle at exactly one point'], ['arc', 'part of the circumference'], ['sector', 'a region between two radii and an arc'], ['segment', 'a region between a chord and an arc']];
  gc({ id: 'g11CircleParts', objective: 'Y11-G9', title: 'Parts of a circle', levels: (function () {
    function mk(pool, words) { return { make: function (r) { var p = r.pick(pool), names = PARTS.map(function (x) { return x[0]; });
      if (words) { var d = PARTS.filter(function (x) { return x[0] === p; })[0]; return K.choice('What is the name for ' + d[1] + '?', r.shuffle([p].concat(r.sample(names.filter(function (n) { return n !== p; }), 3))), p, { hint: 'Learn the seven names: radius, diameter, chord, tangent, arc, sector, segment.', params: { p: p }, sol: ['That is a ' + p + '.'] }); }
      return K.choice('What is the part of the circle shown in red?', r.shuffle([p].concat(r.sample(names.filter(function (n) { return n !== p; }), 3))), p, { visual: circlePart(p), hint: 'A line or a region? Does it go through the centre? Does it touch the circle once?', params: { p: p }, sol: ['This is a ' + p + ': ' + PARTS.filter(function (x) { return x[0] === p; })[0][1] + '.'] }); },
      verify: function (q) { return q.check.value === q.params.p; } }; }
    return { 1: mk(['radius', 'diameter', 'chord', 'tangent']), 2: mk(['arc', 'sector', 'segment', 'chord']), 3: mk(['chord', 'tangent', 'sector', 'segment', 'arc'], true) };
  })() });
  gc({ id: 'g11CoordGeom', objective: 'Y11-G11', title: 'Geometry on coordinate axes', levels: { 1: ['y7Coords', 2], 2: ['y7Coords', 3], 3: ['y9Pythagoras', 3] } });
  gc({ id: 'g11Solids', objective: 'Y11-G12', title: 'Faces, edges and vertices', levels: { 1: ['y9Solids3D', 1], 2: ['y9Solids3D', 2], 3: ['y9Solids3D', 3] } });
  gc({ id: 'g11Plans', objective: 'Y11-G13', title: 'Plans and elevations', levels: {
    1: { make: function (r) { var l = r.int(2, 8), w = r.int(2, 6), h = r.int(2, 7), view = r.pick(['front elevation', 'plan', 'side elevation']), dims = view === 'plan' ? [l, w] : view === 'front elevation' ? [l, h] : [w, h];
      return K.multi('A cuboid is ' + l + ' cm long, ' + w + ' cm wide and ' + h + ' cm high. Its <b>' + view + '</b> is a rectangle. What size is the rectangle?', '{0} cm by {1} cm', [{ kind: 'int', value: dims[0] }, { kind: 'int', value: dims[1] }], { hint: 'Plan: from above (length and width). Front elevation: from the front (length and height). Side elevation: from the side (width and height).', params: { l: l, w: w, h: h, view: view }, answer: dims[0] + ' cm by ' + dims[1] + ' cm', sol: ['The ' + view + ' shows the ' + (view === 'plan' ? 'length and width' : view === 'front elevation' ? 'length and height' : 'width and height') + ': ' + dims[0] + ' cm by ' + dims[1] + ' cm.'] }); },
      verify: function (q) { var p = q.params, want = p.view === 'plan' ? [p.l, p.w] : p.view === 'front elevation' ? [p.l, p.h] : [p.w, p.h]; return q.check.parts[0].value === want[0] && q.check.parts[1].value === want[1]; } },
    2: { make: function (r) { var rows = r.int(2, 3), cols = r.int(2, 4), h = []; for (var i = 0; i < rows; i++) { h.push([]); for (var j = 0; j < cols; j++) h[i].push(r.int(0, 3)); } if (h[0][0] === 0) h[0][0] = 1;
      var tot = h.reduce(function (s, row) { return s + row.reduce(function (a, b) { return a + b; }, 0); }, 0);
      return K.int('This plan shows a solid made of cubes. Each number tells you how many cubes are stacked in that place. How many cubes are there altogether?', tot, { visual: planGrid(h), hint: 'Add up all the numbers on the plan.', params: { h: h }, sol: ['Total: ' + h.map(function (row) { return row.join(' + '); }).join(' + ') + ' = ' + tot + '.'] }); },
      verify: function (q) { var c = 0; q.params.h.forEach(function (row) { row.forEach(function (v) { for (var k = 0; k < v; k++) c++; }); }); return c === q.check.value; } },
    3: { make: function (r) { var rows = r.int(2, 3), cols = r.int(3, 4), h = []; for (var i = 0; i < rows; i++) { h.push([]); for (var j = 0; j < cols; j++) h[i].push(r.int(1, 4)); }
      var front = 0; for (j = 0; j < cols; j++) front += Math.max.apply(null, h.map(function (row) { return row[j]; }));
      return K.int('This plan shows a solid made of cubes (the numbers are the stack heights). How many squares will you see in the <b>front elevation</b>?', front, { visual: planGrid(h), hint: 'From the front you see the tallest stack in each column.', params: { h: h }, sol: ['Tallest in each column (left to right): ' + h[0].map(function (_, j) { return Math.max.apply(null, h.map(function (row) { return row[j]; })); }).join(', ') + '.', 'Total: ' + front + ' squares.'] }); },
      verify: function (q) { var h = q.params.h, s = 0; for (var j = 0; j < h[0].length; j++) { var m = 0; h.forEach(function (row) { if (row[j] > m) m = row[j]; }); s += m; } return s === q.check.value; } } } });
  gc({ id: 'g11Measures', objective: 'Y11-G14', title: 'Standard units of measure', levels: { 1: ['y7Units', 1], 2: ['y7Measures', 2], 3: ['y7Units', 3] } });
  gc({ id: 'g11Bearings', objective: 'Y11-G15', title: 'Bearings and scale drawings', levels: {
    1: { make: function (r) { var d = r.pick([['east', 90], ['south', 180], ['west', 270], ['north-east', 45], ['south-west', 225], ['south-east', 135], ['north-west', 315]]);
      return K.int('What is the three-figure bearing of <b>' + d[0] + '</b>?', d[1], { suffix: '°', hint: 'Bearings are measured clockwise from north. East is a quarter turn: 090°.', params: { dir: d[0] }, sol: ['Measured clockwise from north, ' + d[0] + ' is ' + String(d[1]).padStart(3, '0') + '°.'] }); },
      verify: function (q) { var m = { east: 90, south: 180, west: 270, 'north-east': 45, 'south-west': 225, 'south-east': 135, 'north-west': 315 }; return q.check.value === m[q.params.dir] && q.check.value % 45 === 0; } },
    2: { make: function (r) { var b = r.int(1, 35) * 10 + r.pick([0, 5]); if (b === 180 || b >= 360) b = 65; var back = (b + 180) % 360;
      return K.int('The bearing of B from A is ' + String(b).padStart(3, '0') + '°. What is the bearing of A from B?', back, { suffix: '°', hint: 'The back bearing differs by 180°: add 180° if the bearing is less than 180°, otherwise subtract 180°.', params: { b: b }, sol: [String(b).padStart(3, '0') + '° ' + (b < 180 ? '+' : '−') + ' 180° = ' + String(back).padStart(3, '0') + '°.'] }); },
      verify: function (q) { var b = q.params.b, v = q.check.value; return Math.abs(v - b) === 180 && v >= 0 && v < 360; } },
    3: { make: function (r) { var brg = r.int(2, 34) * 10 + r.pick([0, 5]);
      return K.int('Find the bearing of B from A.', brg, { suffix: '°', visual: bearingPic(brg), hint: 'Start at the north line and measure clockwise to the line AB. Is the angle more or less than 90°? 180°?', params: { brg: brg }, sol: ['Measured clockwise from north, the angle is ' + brg + '°.', 'Bearing: ' + String(brg).padStart(3, '0') + '°.'] }); },
      verify: function (q) { return q.check.value === q.params.brg; } } } });
  gc({ id: 'g11AreaVolume', objective: 'Y11-G16', title: 'Area and volume formulae', levels: { 1: ['y7Area', 2], 2: ['y8Volume', 1], 3: ['y8Volume', 2] } });
  gc({ id: 'g11CirclesSolids', objective: 'Y11-G17', title: 'Circles, composite shapes, spheres, cones and pyramids', levels: {
    1: ['y8Circles', 1], 2: ['y8Circles', 2],
    3: { make: function (r) { var kind = r.pick(['sphere', 'cone', 'pyramid']), rad = r.int(2, 9), h = r.int(4, 15), v;
      if (kind === 'pyramid') { var s = r.int(3, 12); h = 3 * r.int(1, 6); v = s * s * h / 3; return K.int('A square-based pyramid has a base of side ' + s + ' cm and a perpendicular height of ' + h + ' cm. Find its volume. (Volume of a pyramid = ⅓ × area of base × height)', v, { suffix: 'cm³', hint: 'Area of the base = ' + s + ' × ' + s + '. Then multiply by the height and divide by 3.', params: { kind: kind, s: s, h: h }, sol: ['Base area: ' + s * s + ' cm².', '⅓ × ' + s * s + ' × ' + h + ' = ' + v + ' cm³.'] }); }
      v = kind === 'sphere' ? 4 / 3 * Math.PI * Math.pow(rad, 3) : Math.PI * rad * rad * h / 3;
      return K.approx(kind === 'sphere' ? 'Find the volume of a sphere of radius ' + rad + ' cm. (Volume of a sphere = ⁴⁄₃πr³) Give your answer to 1 decimal place.' : 'Find the volume of a cone with radius ' + rad + ' cm and perpendicular height ' + h + ' cm. (Volume of a cone = ⅓πr²h) Give your answer to 1 decimal place.', v.toFixed(12), { dp: 1 }, { calc: true, suffix: 'cm³', hint: 'Substitute into the formula given. Use the π button.', params: { kind: kind, r: rad, h: h }, sol: [kind === 'sphere' ? '⁴⁄₃ × π × ' + rad + '³ = ' + v.toFixed(3) + '…' : '⅓ × π × ' + rad + '² × ' + h + ' = ' + v.toFixed(3) + '…', 'To 1 decimal place: ' + A.round(v.toFixed(12), { dp: 1 }) + ' cm³.'] }); },
      verify: function (q) { var p = q.params; if (p.kind === 'pyramid') return q.check.value * 3 === p.s * p.s * p.h; var want = p.kind === 'sphere' ? 4 * Math.PI * p.r * p.r * p.r / 3 : Math.PI * p.r * p.r * p.h / 3; return Math.abs(parseFloat(A.round(q.check.value, { dp: 1 })) - rnd(want, 1)) < 1e-9; } } } });
  gc({ id: 'g11Sectors', objective: 'Y11-G18', title: 'Arcs and sectors', levels: (function () {
    function mk(what) { return { make: function (r) { var ang = r.pick([30, 40, 45, 60, 72, 80, 90, 100, 120, 135, 150, 210, 240, 270]), rad = r.int(3, 15), frac = ang / 360, arc = 2 * Math.PI * rad * frac, area = Math.PI * rad * rad * frac, val = what === 'area' ? area : what === 'arc' ? arc : arc + 2 * rad;
      return K.approx('A sector has radius ' + rad + ' cm and angle ' + ang + '°. Find its <b>' + (what === 'area' ? 'area' : what === 'arc' ? 'arc length' : 'perimeter') + '</b>. Give your answer to 1 decimal place.', val.toFixed(12), { dp: 1 }, { calc: true, suffix: what === 'area' ? 'cm²' : 'cm', hint: 'The sector is ' + ang + '/360 of the whole circle.' + (what === 'perimeter' ? ' The perimeter is the arc plus two radii.' : ''), params: { ang: ang, r: rad, what: what },
        sol: ['Fraction of the circle: ' + ang + ' ÷ 360.', what === 'area' ? ang + '/360 × π × ' + rad + '² = ' + area.toFixed(3) + '…' : 'Arc: ' + ang + '/360 × 2 × π × ' + rad + ' = ' + arc.toFixed(3) + '…' + (what === 'perimeter' ? ' Add 2 × ' + rad + ': ' + (arc + 2 * rad).toFixed(3) + '…' : ''), 'To 1 decimal place: ' + A.round(val.toFixed(12), { dp: 1 }) + '.'] }); },
      verify: function (q) { var p = q.params, ar = p.ang / 360 * Math.PI * 2 * p.r, want = p.what === 'area' ? p.ang / 360 * Math.PI * p.r * p.r : p.what === 'arc' ? ar : ar + 2 * p.r; return Math.abs(parseFloat(A.round(q.check.value, { dp: 1 })) - rnd(want, 1)) < 1e-9; } }; }
    return { 1: mk('area'), 2: mk('arc'), 3: mk('perimeter') };
  })() });
  gc({ id: 'g11Similar', objective: 'Y11-G19', title: 'Congruence and similarity', levels: (function () {
    function mk(kind) { return { make: function (r) { var a = r.int(3, 9), b = r.int(4, 12), sf = kind === 1 ? r.int(2, 4) : r.pick([1.5, 2.5, 0.5]), big = rnd(a * sf, 2), other = rnd(b * sf, 2);
      if (kind === 3) return K.dec('Triangle PQR is an enlargement of triangle ABC. AB = ' + a + ' cm and PQ = ' + big + ' cm. QR = ' + other + ' cm. Find BC.', String(b), { suffix: 'cm', hint: 'Scale factor from ABC to PQR = PQ ÷ AB. Divide QR by it.', params: { a: a, big: big, other: other, inv: true }, sol: ['Scale factor: ' + big + ' ÷ ' + a + ' = ' + sf + '.', 'BC = ' + other + ' ÷ ' + sf + ' = ' + b + ' cm.'] });
      return K.dec('Triangles ABC and PQR are similar. AB = ' + a + ' cm, BC = ' + b + ' cm and PQ = ' + big + ' cm. Find QR.', String(other), { suffix: 'cm', hint: 'Find the scale factor: PQ ÷ AB.', params: { a: a, b: b, big: big }, sol: ['Scale factor: ' + big + ' ÷ ' + a + ' = ' + sf + '.', 'QR = ' + b + ' × ' + sf + ' = ' + other + ' cm.'] }); },
      verify: function (q) { var p = q.params, v = parseFloat(q.check.value); return p.inv ? Math.abs(v / p.other - p.a / p.big) < 1e-9 : Math.abs(v / p.b - p.big / p.a) < 1e-9; } }; }
    return { 1: mk(1), 2: mk(2), 3: mk(3) };
  })() });
  gc({ id: 'g11PythagTrig', objective: 'Y11-G20', title: 'Pythagoras and trigonometry', levels: { 1: ['y9Pythagoras', 2], 2: ['y9Trig', 1], 3: ['y9Trig', 3] } });
  var EXACT = [['sin', 0, '0'], ['sin', 30, '1/2'], ['sin', 90, '1'], ['cos', 0, '1'], ['cos', 60, '1/2'], ['cos', 90, '0'], ['tan', 0, '0'], ['tan', 45, '1']];
  var SURDS = [['sin', 60, '√3/2'], ['cos', 30, '√3/2'], ['sin', 45, '√2/2'], ['cos', 45, '√2/2'], ['tan', 60, '√3'], ['tan', 30, '√3/3']];
  gc({ id: 'g11ExactTrig', objective: 'Y11-G21', title: 'Exact trigonometric values', levels: {
    1: { make: function (r) { var e = r.pick(EXACT); return K.num('Write down the exact value of <b>' + e[0] + ' ' + e[1] + '°</b>.', e[2], { placeholder: 'e.g. 1/2', hint: 'Learn the table of exact values for 0°, 30°, 45°, 60° and 90°.', params: { f: e[0], a: e[1] }, sol: [e[0] + ' ' + e[1] + '° = ' + e[2] + '.'] }); },
      verify: function (q) { var p = q.params, v = Math[p.f](p.a * Math.PI / 180); return Math.abs(A.num(A.parseQ(q.check.value)) - v) < 1e-9; } },
    2: { make: function (r) { var e = r.pick(SURDS), all = ['1/2', '√3/2', '√2/2', '√3', '√3/3', '1'];
      return K.choice('What is the exact value of <b>' + e[0] + ' ' + e[1] + '°</b>?', r.shuffle([e[2]].concat(r.sample(all.filter(function (x) { return x !== e[2]; }), 3))), e[2], { hint: 'Picture the 30-60-90 triangle (sides 1, √3, 2) and the 45-45-90 triangle (sides 1, 1, √2).', params: { f: e[0], a: e[1] }, sol: [e[0] + ' ' + e[1] + '° = ' + e[2] + '.'] }); },
      verify: function (q) { var p = q.params, val = function (s) { var m = /^(√(\d))?(\d*)?(?:\/(\d))?$/.exec(s); var top = (m[2] ? Math.sqrt(+m[2]) : 1) * (m[3] ? +m[3] : 1); return top / (m[4] ? +m[4] : 1); }; return Math.abs(val(q.check.value) - Math[p.f](p.a * Math.PI / 180)) < 1e-9; } },
    3: { make: function (r) { var hyp = r.int(2, 12) * 2, pair = r.pick([['opposite', 30], ['adjacent', 60]]), side = pair[0], ang = pair[1]; // the side that is half the hypotenuse
      return K.int('A right-angled triangle has a hypotenuse of ' + hyp + ' cm and an angle of ' + ang + '°. Without a calculator, find the length of the side ' + side + ' the ' + ang + '° angle.', hyp / 2, { suffix: 'cm', hint: side === 'opposite' ? 'opposite = hypotenuse × sin ' + ang + '°.' : 'adjacent = hypotenuse × cos ' + ang + '°.', params: { hyp: hyp, ang: ang, side: side }, sol: [side + ' = ' + hyp + ' × ' + (side === 'opposite' ? 'sin' : 'cos') + ' ' + ang + '° = ' + hyp + ' × ½ = ' + hyp / 2 + ' cm.'] }); },
      verify: function (q) { var p = q.params, f = p.side === 'opposite' ? Math.sin : Math.cos; return Math.abs(q.check.value - p.hyp * f(p.ang * Math.PI / 180)) < 1e-9; } } } });
  gc({ id: 'g11TranslateVec', objective: 'Y11-G24', title: 'Translations as vectors', levels: (function () {
    function mk(kind) { return { make: function (r) { var x1 = r.int(-5, 5), y1 = r.int(-5, 5), dx = r.int(-6, 6) || 3, dy = r.int(-6, 6) || -2; if (Math.abs(x1 + dx) > 7) dx = -dx; if (Math.abs(y1 + dy) > 7) dy = -dy; var x2 = x1 + dx, y2 = y1 + dy, back = kind === 3;
      var a = back ? -dx : dx, b = back ? -dy : dy;
      return K.multi(back ? 'Point A(' + neg(x1) + ', ' + neg(y1) + ') is translated to B(' + neg(x2) + ', ' + neg(y2) + '). Write the column vector for the translation that maps <b>B back to A</b>.' : 'Point A(' + neg(x1) + ', ' + neg(y1) + ') is translated to B(' + neg(x2) + ', ' + neg(y2) + '). Write the translation as a column vector.', 'top: {0} &nbsp; bottom: {1}', [{ kind: 'int', value: a }, { kind: 'int', value: b }], { blanks: [{ keys: 'signed' }, { keys: 'signed' }], visual: kind === 1 ? V.grid4({ n: 7, points: [{ x: x1, y: y1, label: 'A' }, { x: x2, y: y2, label: 'B' }] }) : '', hint: 'Top number: change in x (right is positive). Bottom number: change in y (up is positive).', params: { p: [x1, y1, x2, y2], back: back }, answer: 'top ' + neg(a) + ', bottom ' + neg(b),
        sol: [(back ? 'From B to A: ' : 'From A to B: ') + 'x changes by ' + neg(a) + ', y changes by ' + neg(b) + '.', 'Vector ' + vecHTML(a, b) + '.'] }); },
      verify: function (q) { var p = q.params.p, s = q.params.back ? -1 : 1; return q.check.parts[0].value === s * (p[2] - p[0]) && q.check.parts[1].value === s * (p[3] - p[1]); } }; }
    return { 1: mk(1), 2: mk(2), 3: mk(3) };
  })() });
  gc({ id: 'g11Vectors', objective: 'Y11-G25', title: 'Adding, subtracting and scaling vectors', levels: (function () {
    function mk(kind) { return { make: function (r) { var a = [r.int(-6, 6), r.int(-6, 6)], b = [r.int(-6, 6), r.int(-6, 6)], k1 = kind === 1 ? 1 : kind === 2 ? r.int(2, 3) : r.int(2, 4), k2 = kind === 1 ? 1 : kind === 2 ? -1 : r.pick([-2, -3, 2]);
      var res = [k1 * a[0] + k2 * b[0], k1 * a[1] + k2 * b[1]], expr = (k1 === 1 ? '' : k1) + '<b>a</b> ' + (k2 < 0 ? '− ' + (k2 === -1 ? '' : -k2) : '+ ' + (k2 === 1 ? '' : k2)) + '<b>b</b>';
      return K.multi('<b>a</b> = ' + vecHTML(a[0], a[1]) + ' and <b>b</b> = ' + vecHTML(b[0], b[1]) + '. Work out ' + expr + ' as a column vector.', 'top: {0} &nbsp; bottom: {1}', [{ kind: 'int', value: res[0] }, { kind: 'int', value: res[1] }], { blanks: [{ keys: 'signed' }, { keys: 'signed' }], hint: 'Multiply each vector by its number, then add the top numbers and add the bottom numbers.', params: { a: a, b: b, k1: k1, k2: k2 }, answer: 'top ' + neg(res[0]) + ', bottom ' + neg(res[1]),
        sol: ['Top: ' + k1 + ' × ' + neg(a[0]) + ' + ' + neg(k2) + ' × ' + neg(b[0]) + ' = ' + neg(res[0]) + '.', 'Bottom: ' + k1 + ' × ' + neg(a[1]) + ' + ' + neg(k2) + ' × ' + neg(b[1]) + ' = ' + neg(res[1]) + '.'] }); },
      verify: function (q) { var p = q.params, x = 0, y = 0, i; for (i = 0; i < Math.abs(p.k1); i++) { x += p.a[0]; y += p.a[1]; } for (i = 0; i < Math.abs(p.k2); i++) { x += Math.sign(p.k2) * p.b[0]; y += Math.sign(p.k2) * p.b[1]; } return q.check.parts[0].value === x && q.check.parts[1].value === y; } }; }
    return { 1: mk(1), 2: mk(2), 3: mk(3) };
  })() });

  // ================= STATISTICS =================
  var SAMPLING = [['A council asks people at a gym how often they exercise, to find out about everyone in the town.', 'biased', 'People at a gym exercise more than most people, so the sample is not representative.'],
    ['A school picks 50 students at random from the whole school register to ask about lunches.', 'fair', 'Choosing at random from the whole population makes a fair sample.'],
    ['A shop asks the first 5 customers on Monday morning what all its customers think.', 'biased', 'The sample is very small and only from one time of the week.'],
    ['A survey about public transport is handed out only at a car park.', 'biased', 'People at a car park are more likely to drive, so the sample is biased.'],
    ['A club numbers all its 400 members and uses a random number generator to choose 40 of them.', 'fair', 'Every member has an equal chance of being chosen.'],
    ['A website asks visitors to vote on whether people use the internet every day.', 'biased', 'Only internet users visit the website, so the sample is biased.']];
  gc({ id: 'g11Sampling', objective: 'Y11-S1', title: 'Populations and samples', levels: {
    1: { make: function (r) { var i = r.int(0, SAMPLING.length - 1), s = SAMPLING[i]; return K.choice(s[0] + ' Is this sample likely to be fair or biased?', [{ value: 'fair', label: 'Fair (representative)' }, { value: 'biased', label: 'Biased (not representative)' }], s[1], { hint: 'Does everyone in the population have an equal chance of being chosen?', params: { i: i }, sol: [s[2]] }); },
      verify: function (q) { return q.check.value === SAMPLING[q.params.i][1]; } },
    2: { make: function (r) { var n = r.pick([5, 8, 10]), pop = r.pick([600, 1200, 2000]);
      return K.choice('A head teacher wants to know what the ' + fmt(pop) + ' students at the school think about homework. They ask ' + n + ' students. What is the main problem with this sample?', r.shuffle(['The sample is too small', 'The sample is too large', 'Students cannot be asked about homework']), 'The sample is too small', { hint: 'A sample must be big enough to represent the whole population.', params: { n: n }, sol: [n + ' students out of ' + fmt(pop) + ' is too small a sample to be reliable.'] }); },
      verify: function (q) { return q.check.value === 'The sample is too small' && q.params.n <= 10; } },
    3: { make: function (r) { var pop = r.pick([200, 400, 500, 800]), want = r.pick([10, 20, 40, 50].filter(function (w) { return pop % w === 0; }));
      return K.int('A random sample of ' + want + ' is chosen from a population of ' + pop + '. What fraction of the population is in the sample? Write your answer as "1 in ?".', pop / want, { hint: 'Divide the population by the sample size.', params: { pop: pop, n: want }, sol: [pop + ' ÷ ' + want + ' = ' + pop / want + ', so 1 in ' + pop / want + ' people are sampled.'] }); },
      verify: function (q) { return q.check.value * q.params.n === q.params.pop; } } } });
  gc({ id: 'g11Charts', objective: 'Y11-S2', title: 'Tables, charts and diagrams', levels: { 1: ['y7Charts', 1], 2: ['y7Charts', 2], 3: ['y7Charts', 3] } });
  gc({ id: 'g11Averages', objective: 'Y11-S4', title: 'Averages, spread and comparing distributions', levels: { 1: ['y7Averages', 1], 2: ['y8Grouped', 2], 3: ['y7Averages', 3] } });
  gc({ id: 'g11Population', objective: 'Y11-S5', title: 'Using a sample to describe a population', levels: (function () {
    function mk(kind) { return { make: function (r) { var n = r.pick([20, 25, 40, 50, 80, 100]), k = r.int(Math.ceil(n * 0.1), Math.floor(n * 0.6)), pop = n * r.int(4, 30), est = A.div(Q(k * pop), Q(n)), it = r.pick(['walk to school', 'own a dog', 'play an instrument', 'cycle to work']);
      if (kind === 3) { var pc = A.decText(A.div(Q(k * 100), Q(n))); return K.dec('In a random sample of ' + n + ' people, ' + k + ' ' + it + '. What percentage of the sample is that? Use it to estimate how many of the ' + fmt(pop) + ' people in the town ' + it + '.', A.decText(est), { hint: 'Find the fraction of the sample, then apply it to the population.', params: { n: n, k: k, pop: pop }, sol: [k + ' ÷ ' + n + ' = ' + pc + '%.', pc + '% of ' + fmt(pop) + ' = ' + A.decText(est) + '.'] }); }
      return K.dec('In a random sample of ' + n + ' students, ' + k + ' ' + it + '. There are ' + fmt(pop) + ' students in the school. Estimate how many students ' + it + '.', A.decText(est), { hint: 'The fraction of the sample is ' + k + '/' + n + '. Apply it to the whole population.', params: { n: n, k: k, pop: pop }, sol: [F(k, n) + ' of ' + fmt(pop) + ' = ' + A.decText(est) + '.'] }); },
      verify: function (q) { var p = q.params; return Math.abs(parseFloat(q.check.value) * p.n - p.k * p.pop) < 1e-9; } }; }
    return { 1: mk(1), 2: mk(2), 3: mk(3) };
  })() });
  gc({ id: 'g11Scatter', objective: 'Y11-S6', title: 'Scatter graphs and correlation', levels: { 1: ['y8Scatter', 1], 2: ['y8Scatter', 2], 3: ['y8Scatter', 3] } });
})(typeof window !== 'undefined' ? window : globalThis);
