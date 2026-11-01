/* Mayes Maths & More — 11+ Training Camp: maths and non-verbal reasoning (English to follow).
   Most 11+ tests use multiple choice with five options (A–E); maths questions here re-use tested Year 5–6 generators at their harder
   levels and turn them into multiple choice with believable wrong answers. Non-verbal reasoning (NVR) uses a figure engine:
   each figure is data (shape, shading, size, rotation, inner marks, line style), drawn as SVG, and each question type checks that
   exactly one option fits its rule. Shapes are compared allowing for symmetry, so a square turned 90° counts as the same square. */
(function (G) {
  'use strict';
  var OM = G.OM, K = OM.kit, V = OM.V, S = K.S, fmt = OM.fmt, A = OM.alg;
  var LET = ['A', 'B', 'C', 'D', 'E'];

  // ================= multiple-choice maker for numeric questions =================
  function numAnswer(c) { if (c.kind === 'int') return { v: c.value, t: 'int' }; if (c.kind === 'dec') return { v: parseFloat(c.value), t: 'dec', dp: OM.decimalPlaces(c.value) }; if (c.kind === 'money') return { v: c.pence, t: 'money', box: c.box }; return null; }
  function show(a, v) { if (a.t === 'money') return a.box === 'p' ? v + 'p' : OM.pounds(v); if (a.t === 'dec') return OM.fmt(+v.toFixed(Math.max(a.dp, 1))).replace(/^(-?\d[\d,]*)$/, '$1') + (String(v.toFixed(a.dp)).indexOf('.') >= 0 && a.dp ? '' : ''); return (v < 0 ? '−' : '') + fmt(Math.abs(v)); }
  function decText(a, v) { return a.t === 'dec' ? String(+v.toFixed(a.dp)) : String(v); }
  OM.toMultipleChoice = function (q, r) {
    var a = numAnswer(q.check); if (!a) return q;
    // wrong answers a child might really give: a place-value slip (×10, ÷10) or an error in the second digit
    var v = a.v, cands = [], mag = Math.abs(v) >= 100 ? Math.pow(10, Math.floor(Math.log10(Math.abs(v))) - 1) : 1, step = a.t === 'dec' ? Math.max(Math.pow(10, -Math.max(a.dp, 1)), Math.abs(v) >= 1 ? Math.min(mag, 1) : 0) : mag;
    var digits = String(Math.abs(Math.round(v))), rev = +digits.split('').reverse().join('');
    [v * 10, v / 10, v + step, v - step, v + 10 * step, v - 10 * step, v + 2 * step, a.t === 'int' && digits.length > 1 && rev !== v ? rev : null, Math.round(v * 1.1), Math.round(v * 0.9), v + 100 * step]
      .forEach(function (x) { if (x === null || !isFinite(x)) return; x = a.t === 'dec' ? +x.toFixed(Math.max(a.dp, 1)) : Math.round(x); if (x === v || (v >= 0 && x < 0) || cands.indexOf(x) >= 0) return; cands.push(x); });
    var wrong = r.sample(cands.slice(0, 7), 4), opts = r.shuffle([v].concat(wrong));
    var orig = q.check, labels = opts.map(function (x) { return a.t === 'dec' ? decText(a, x) : show(a, x); });
    q.params = q.params || {}; q.params.__orig = orig;
    q.input = { type: 'choice', options: opts.map(function (x, i) { return { value: LET[i], label: '<b class="mcl">' + LET[i] + '</b> ' + labels[i] + (q.input && q.input.suffix ? ' ' + q.input.suffix : '') }; }) };
    q.check = { kind: 'choice', value: LET[opts.indexOf(v)], label: LET[opts.indexOf(v)] + ': ' + labels[opts.indexOf(v)] };
    return q;
  };
  // An 11+ maths generator: levels re-use other generators (as K.gcse does) and become multiple choice
  K.eleven = function (def) {
    K.gen({ id: def.id, objective: def.objective, title: def.title,
      make: function (r, L) { var spec = def.levels[L], q; if (Array.isArray(spec)) { q = OM.gens[spec[0]].make(r, spec[1]); q.params = q.params || {}; q.params.__src = spec[0]; } else q = spec.make(r); return def.written ? q : OM.toMultipleChoice(q, r); },
      verify: function (q) {
        var p = q.params || {}, c = q.check, ok;
        if (p.__orig) { q.check = p.__orig; ok = p.__src ? OM.gens[p.__src].verify(q) : def.levels[q.level].verify(q); q.check = c; var right = q.input.options.filter(function (o) { return o.value === c.value; })[0]; var a = numAnswer(p.__orig); return ok && !!right && right.label.indexOf(a.t === 'dec' ? decText(a, a.v) : show(a, a.v)) >= 0; }
        return p.__src ? OM.gens[p.__src].verify(q) : def.levels[q.level].verify(q);
      } });
  };

  // ================= 11+ maths =================
  K.eleven({ id: 'xNumber', objective: 'XP-M1', title: 'Number and place value', levels: { 1: ['y5PlaceValue', 2], 2: ['y6PlaceValue', 2], 3: ['y6Rounding', 3] } });
  K.eleven({ id: 'xCalc', objective: 'XP-M2', title: 'Calculation', levels: { 1: ['y5MentalMD', 3], 2: ['y6Mental', 3], 3: ['y6Order', 3] } });
  K.eleven({ id: 'xFDP', objective: 'XP-M3', title: 'Fractions, decimals and percentages', levels: { 1: ['y6Percent', 1], 2: ['y6Percent', 2], 3: ['y6FracDecimal', 2] } });
  K.eleven({ id: 'xRatio', objective: 'XP-M4', title: 'Ratio and proportion', levels: { 1: ['y6Ratio', 1], 2: ['y6Ratio', 3], 3: ['y6Sharing', 2] } });
  K.eleven({ id: 'xAlgebra', objective: 'XP-M5', title: 'Algebra and sequences', levels: { 1: ['y6Formula', 1], 2: ['y6MissingAlg', 3], 3: ['y6Formula', 3] } });
  K.eleven({ id: 'xMeasures', objective: 'XP-M6', title: 'Measures and time', levels: { 1: ['y6Convert', 1], 2: ['y6MeasureProblems', 2], 3: ['y6MeasureProblems', 3] } });
  K.eleven({ id: 'xShape', objective: 'XP-M7', title: 'Shape and space', levels: { 1: ['y6AnglesShapes', 2], 2: ['y6AreaParaTri', 2], 3: ['y6Volume', 3] } });
  K.eleven({ id: 'xData', objective: 'XP-M8', title: 'Data and averages', levels: { 1: ['y6Mean', 1], 2: ['y6PieChart', 2], 3: ['y6Mean', 3] } });
  K.eleven({ id: 'xPuzzles', objective: 'XP-M9', title: 'Problem solving and puzzles', levels: {
    1: { make: function (r) { var n = r.int(4, 25), m = r.int(2, 6), a = r.int(3, 20), s = r.chance(0.5); var res = s ? n * m - a : n * m + a;
      return K.int('Zara thinks of a number. She multiplies it by ' + m + ' and then ' + (s ? 'subtracts ' : 'adds ') + a + '. Her answer is ' + res + '. What number did she think of?', n, { hint: 'Work backwards with the inverse operations.', params: { m: m, a: s ? -a : a, res: res }, sol: [res + (s ? ' + ' : ' − ') + a + ' = ' + (res - (s ? -a : a)) + '.', (res - (s ? -a : a)) + ' ÷ ' + m + ' = ' + n + '.'] }); },
      verify: function (q) { var p = q.params; return q.check.value * p.m + p.a === p.res; } },
    2: { make: function (r) { var kid = r.int(5, 12), mult = r.int(3, 5), yrs = r.int(2, 10), mum = kid * mult;
      return K.int('Sam’s mum is ' + mult + ' times as old as Sam. Together their ages add up to ' + (kid + mum) + '. How old will Sam be in ' + yrs + ' years?', kid + yrs, { hint: 'Sam’s age is 1 part and Mum’s is ' + mult + ' parts: ' + (mult + 1) + ' parts altogether.', params: { mult: mult, tot: kid + mum, yrs: yrs }, sol: [(kid + mum) + ' ÷ ' + (mult + 1) + ' = ' + kid + ', so Sam is ' + kid + ' now.', 'In ' + yrs + ' years: ' + (kid + yrs) + '.'] }); },
      verify: function (q) { var p = q.params, now = q.check.value - p.yrs; return now * (p.mult + 1) === p.tot; } },
    3: { make: function (r) { var tw = r.int(2, 8), fv = r.int(2, 8), tot = tw * 20 + fv * 5, n = tw + fv;
      return K.int('A purse holds only 20p and 5p coins. There are ' + n + ' coins worth £' + (tot / 100).toFixed(2) + ' altogether. How many <b>20p</b> coins are there?', tw, { hint: 'If all ' + n + ' coins were 5p, they would be worth ' + n * 5 + 'p. Each swap to a 20p adds 15p.', params: { n: n, tot: tot }, sol: ['All 5p: ' + n * 5 + 'p. Extra needed: ' + (tot - n * 5) + 'p.', (tot - n * 5) + ' ÷ 15 = ' + tw + ' coins are 20p.'] }); },
      verify: function (q) { var p = q.params, t = q.check.value; return t >= 0 && t <= p.n && t * 20 + (p.n - t) * 5 === p.tot; } } } });

  // ================= Non-verbal reasoning: the figure engine =================
  var SHAPES = { circle: 0, square: 4, triangle: 3, pentagon: 5, hexagon: 6, diamond: 2, star: 5, cross: 4, arrow: 1, heart: 1 };
  var FILLS = ['white', 'grey', 'black', 'stripes'];
  // canonical description of what is SEEN: rotation reduced by the shape's symmetry, and dots on a black shape are
  // always drawn white (so their own shading cannot be told apart), so identical-looking figures compare equal
  function canon(f) {
    var sym = SHAPES[f.shape], rot = sym === 0 ? 0 : ((f.rot || 0) % (360 / sym) + 360 / sym) % (360 / sym);
    var parts = [f.shape, f.fill, f.size || 2, rot, f.dash ? 'd' : 's', f.inner ? f.inner.shape + ':' + f.inner.count + ':' + (f.fill === 'black' ? 'on-black' : f.inner.fill) : '-', f.mark ? f.mark.join(',') : '-', f.arrow !== undefined ? ((f.arrow % 360) + 360) % 360 : '-'];
    return parts.join('|');
  }
  OM.nvrCanon = canon;
  function poly(n, R, rot, star) { var pts = [], k = star ? n * 2 : n; for (var i = 0; i < k; i++) { var a = (rot - 90 + i * 360 / k) * Math.PI / 180, rr = star && i % 2 ? R * 0.45 : R; pts.push((50 + rr * Math.cos(a)).toFixed(1) + ',' + (50 + rr * Math.sin(a)).toFixed(1)); } return pts.join(' '); }
  var nvrId = 0;
  function fillAttr(fill, id) { return fill === 'black' ? '#222' : fill === 'grey' ? '#9aa3a8' : fill === 'stripes' ? 'url(#st' + id + ')' : '#fff'; }
  function shapeEl(shape, R, rot, fill, id, dash) {
    if (dash && fill !== 'white' && fill !== 'none') return shapeEl(shape, R, rot, fill, id, false).replace(/stroke="#222" stroke-width="3"/, 'stroke="#fff" stroke-width="5"') +
      shapeEl(shape, R, rot, 'none', id, true).replace(/fill="#fff"/, 'fill="none"'); // a dashed edge stays visible on dark shading
    var st = ' fill="' + fillAttr(fill, id) + '" stroke="#222" stroke-width="3"' + (dash ? ' stroke-dasharray="7 5"' : '') + ' stroke-linejoin="round"';
    if (shape === 'circle') return '<circle cx="50" cy="50" r="' + R + '"' + st + '/>';
    var g = function (inner) { return '<g transform="rotate(' + rot + ' 50 50)">' + inner + '</g>'; };
    if (shape === 'square') return g('<rect x="' + (50 - R * 0.85) + '" y="' + (50 - R * 0.85) + '" width="' + R * 1.7 + '" height="' + R * 1.7 + '"' + st + '/>');
    if (shape === 'diamond') return g('<polygon points="50,' + (50 - R) + ' ' + (50 + R * 0.62) + ',50 50,' + (50 + R) + ' ' + (50 - R * 0.62) + ',50"' + st + '/>');
    if (shape === 'cross') { var w = R * 0.36; return g('<polygon points="' + [[-w, -R], [w, -R], [w, -w], [R, -w], [R, w], [w, w], [w, R], [-w, R], [-w, w], [-R, w], [-R, -w], [-w, -w]].map(function (p) { return (50 + p[0]).toFixed(1) + ',' + (50 + p[1]).toFixed(1); }).join(' ') + '"' + st + '/>'); }
    if (shape === 'arrow') return g('<polygon points="' + [[0, -R], [R * 0.6, -R * 0.15], [R * 0.22, -R * 0.15], [R * 0.22, R], [-R * 0.22, R], [-R * 0.22, -R * 0.15], [-R * 0.6, -R * 0.15]].map(function (p) { return (50 + p[0]).toFixed(1) + ',' + (50 + p[1]).toFixed(1); }).join(' ') + '"' + st + '/>');
    if (shape === 'heart') return g('<path d="M50 ' + (50 + R * 0.85) + ' C' + (50 - R * 1.2) + ' ' + (50 + R * 0.1) + ' ' + (50 - R * 0.75) + ' ' + (50 - R * 0.95) + ' 50 ' + (50 - R * 0.35) + ' C' + (50 + R * 0.75) + ' ' + (50 - R * 0.95) + ' ' + (50 + R * 1.2) + ' ' + (50 + R * 0.1) + ' 50 ' + (50 + R * 0.85) + 'Z"' + st + '/>');
    return '<polygon points="' + poly(SHAPES[shape], R, rot, shape === 'star') + '"' + st + '/>';
  }
  var DOTS = { 1: [[0, 0]], 2: [[-1, 0], [1, 0]], 3: [[-1, 0.6], [1, 0.6], [0, -0.9]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]] };
  V.nvr = function (f, o) {
    o = o || {}; var id = ++nvrId, R = f ? [0, 22, 30, 38][f.size || 2] : 0, b = '<defs><pattern id="st' + id + '" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#fff"/><line x1="0" y1="0" x2="0" y2="7" stroke="#222" stroke-width="2.4"/></pattern></defs>';
    b += '<rect x="1" y="1" width="98" height="98" rx="6" fill="#fff" stroke="' + (o.q ? '#c9ced2' : '#d6dbde') + '" stroke-width="2"' + (o.q ? ' stroke-dasharray="5 4"' : '') + '/>';
    if (o.q) return V.svg(100, 100, b + V.t(50, 52, '?', { size: 38, weight: 'bold', fill: '#9aa3a8' })).replace(/width="100"/, 'width="' + (o.w || 86) + '"');
    b += shapeEl(f.shape, R, f.rot || 0, f.fill, id, f.dash);
    // dots on a black shape are drawn white so they can be seen
    if (f.inner) { var sp = R * 0.42, rr = Math.max(4, R * 0.16), dk = f.fill === 'black', dotFill = dk ? '#fff' : f.inner.fill === 'black' ? '#222' : '#fff', dotLine = dk ? '#fff' : '#222'; (DOTS[f.inner.count] || []).forEach(function (p) { b += f.inner.shape === 'dot' ? '<circle cx="' + (50 + p[0] * sp) + '" cy="' + (50 + p[1] * sp) + '" r="' + rr + '" fill="' + dotFill + '" stroke="' + dotLine + '" stroke-width="2"/>' : '<rect x="' + (50 + p[0] * sp - rr) + '" y="' + (50 + p[1] * sp - rr) + '" width="' + rr * 2 + '" height="' + rr * 2 + '" fill="' + dotFill + '" stroke="' + dotLine + '" stroke-width="2"/>'; }); }
    // marks and arrows have a white edge so they show up on black shading too
    if (f.mark) b += '<circle cx="' + (50 + f.mark[0] * 32) + '" cy="' + (50 + f.mark[1] * 32) + '" r="7" fill="#222" stroke="#fff" stroke-width="2.5"/>';
    if (f.arrow !== undefined) b += '<g transform="rotate(' + f.arrow + ' 50 50)"><line x1="50" y1="64" x2="50" y2="22" stroke="#fff" stroke-width="8" stroke-linecap="round"/><polygon points="50,14 43,26 57,26" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><line x1="50" y1="64" x2="50" y2="22" stroke="#222" stroke-width="4" stroke-linecap="round"/><polygon points="50,14 43,26 57,26" fill="#222"/></g>';
    return V.svg(100, 100, b).replace(/width="100"/, 'width="' + (o.w || 86) + '"');
  };
  function row(figs, qIndex) { return '<div class="nvr-row">' + figs.map(function (f, i) { return i === qIndex ? V.nvr(null, { q: true }) : V.nvr(f); }).join('') + '</div>'; }
  function clone(f) { return JSON.parse(JSON.stringify(f)); }
  function randFig(r, o) { o = o || {}; var shapes = o.shapes || ['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'diamond', 'star', 'cross', 'heart']; return { shape: r.pick(shapes), fill: r.pick(o.fills || ['white', 'grey', 'black', 'stripes']), size: o.size || 2, rot: 0, inner: o.inner === false ? null : (o.inner || null) }; }
  // build the A–E options from the right figure and some wrong ones, keeping them all different
  function options(r, right, wrongs) {
    var seen = {}, list = []; seen[canon(right)] = 1;
    wrongs.forEach(function (w) { var k = canon(w); if (w.inner && (w.inner.count < 1 || w.inner.count > 5)) return; // only 1 to 5 dots can be drawn
      if (!seen[k] && list.length < 4) { seen[k] = 1; list.push(w); } });
    var opts = r.shuffle([right].concat(list));
    return { figs: opts, answer: LET[opts.indexOf(right)] };
  }
  function nvrChoice(prompt, visual, opt, o) {
    var q = K.choice(prompt, opt.figs.map(function (f, i) { return { value: LET[i], label: '<span class="nvr-opt">' + V.nvr(f, { w: 78 }) + '<b>' + LET[i] + '</b></span>' }; }), opt.answer, { hint: o.hint, params: Object.assign({ opts: opt.figs.map(canon), optFigs: opt.figs }, o.params || {}), sol: o.sol });
    q.visual = visual; q.input.big = true; q.input.nvr = true; return q;
  }
  // checks shared by every NVR generator: five different options, and exactly one satisfies the rule
  function uniqueRight(q, test) { var p = q.params, ok = p.optFigs.filter(function (f) { return test(f); }); return p.opts.length === new Set(p.opts).size && ok.length === 1 && LET[p.optFigs.indexOf(ok[0])] === q.check.value; }

  // ---------- Series: what comes next ----------
  function seriesRule(r, L) {
    var rules = [];
    var rotShape = r.pick(['arrow', 'heart', 'triangle']), step = rotShape === 'triangle' ? r.pick([30, 60]) : r.pick([45, 90]);
    var all = [
      { name: 'turns ' + step + '° clockwise each time', base: { shape: rotShape }, apply: function (f, i) { f.rot = (i * step) % 360; } },
      { name: 'gains one dot each time', base: { inner: { shape: 'dot', count: 1, fill: 'black' } }, apply: function (f, i) { f.inner.count = 1 + i; } },
      { name: 'shading cycles white, grey, black', apply: function (f, i) { f.fill = ['white', 'grey', 'black'][i % 3]; } },
      { name: 'gets bigger, then starts again', apply: function (f, i) { f.size = 1 + i % 3; } },
      { name: 'the small arrow turns 90° clockwise each time', apply: function (f, i) { f.arrow = (i * 90) % 360; } }];
    var n = L === 1 ? 1 : 2, picked = r.sample(all.slice(0, 5), n);
    if (picked.some(function (x) { return /dot/.test(x.name); }) && picked.some(function (x) { return /arrow turns/.test(x.name); })) picked = [picked[0]];
    return picked;
  }
  K.gen({ id: 'xnSeries', objective: 'XP-N2', title: 'Series: what comes next?',
    make: function (r, L) {
      var rules = seriesRule(r, L), base = randFig(r, { fills: ['white', 'stripes'], shapes: ['circle', 'square', 'pentagon', 'hexagon'] });
      rules.forEach(function (rl) { if (rl.base) Object.keys(rl.base).forEach(function (k) { base[k] = clone(rl.base[k]); }); });
      if (rules.some(function (rl) { return /dot/.test(rl.name); }) && base.shape === 'arrow') base.shape = 'circle';
      var seq = [0, 1, 2, 3, 4].map(function (i) { var f = clone(base); rules.forEach(function (rl) { rl.apply(f, i); }); return f; });
      var qi = L === 3 ? r.pick([2, 4]) : 4, right = seq[qi], wrongs = [];
      rules.forEach(function (rl, k) { [1, 2, 3].forEach(function (d) { var w = clone(base); rules.forEach(function (r2, j) { r2.apply(w, j === k ? qi + d : qi); }); wrongs.push(w); }); });
      var w2 = clone(right); w2.fill = right.fill === 'black' ? 'white' : 'black'; wrongs.push(w2);
      var w3 = clone(right); w3.shape = right.shape === 'square' ? 'hexagon' : 'square'; wrongs.push(w3);
      var spare = []; ['white', 'grey', 'black', 'stripes'].forEach(function (fl) { var w = clone(right); w.fill = fl; spare.push(w); }); [1, 2, 3].forEach(function (sz) { var w = clone(right); w.size = sz; spare.push(w); });
      var opt = options(r, right, r.shuffle(wrongs).concat(r.shuffle(spare)));
      return nvrChoice('Which figure ' + (qi === 4 ? 'comes next in the series?' : 'is missing from the series?'), row(seq, qi), opt, { hint: 'Look at one feature at a time: shape, shading, size, turning, number of dots.', params: { seq: seq.map(canon), qi: qi, rules: rules.map(function (x) { return x.name; }) }, sol: ['The rule: the figure ' + rules.map(function (x) { return x.name; }).join(', and ') + '.', 'So the missing figure is ' + opt.answer + '.'] });
    },
    verify: function (q) { var p = q.params; return uniqueRight(q, function (f) { return canon(f) === p.seq[p.qi]; }); } });

  // ---------- Odd one out ----------
  var ODD = [
    { name: 'All the others have the same number of dots inside.', make: function (r) { var k = r.int(1, 4); return { good: function () { return { inner: { shape: 'dot', count: k, fill: 'black' } }; }, bad: function () { return { inner: { shape: 'dot', count: k === 4 ? 3 : k + 1, fill: 'black' } }; }, test: function (f) { return f.inner && f.inner.count === k; } }; } },
    { name: 'All the others are shaded the same way.', make: function (r) { var fl = r.pick(FILLS), other = r.pick(FILLS.filter(function (x) { return x !== fl; })); return { good: function () { return { fill: fl }; }, bad: function () { return { fill: other }; }, test: function (f) { return f.fill === fl; } }; }, varyFill: false },
    { name: 'All the others have straight sides only.', make: function (r) { return { good: function (r2) { return { shape: r2.pick(['square', 'triangle', 'pentagon', 'hexagon', 'star', 'cross', 'diamond']) }; }, bad: function (r2) { return { shape: r2.pick(['circle', 'heart']) }; }, test: function (f) { return ['circle', 'heart'].indexOf(f.shape) < 0; } }; }, varyShape: false },
    { name: 'In all the others the small arrow points the same way.', make: function (r) { var d = r.pick([0, 90, 180, 270]); return { good: function () { return { arrow: d }; }, bad: function () { return { arrow: (d + r.pick([90, 180])) % 360 }; }, test: function (f) { return f.arrow === d; } }; } },
    { name: 'In all the others the number of dots matches the number of sides.', make: function () { return { good: function (r2) { var s = r2.pick(['triangle', 'square']); return { shape: s, inner: { shape: 'dot', count: SHAPES[s], fill: 'black' } }; }, bad: function (r2) { var s = r2.pick(['triangle', 'square']); return { shape: s, inner: { shape: 'dot', count: s === 'square' ? 3 : 4, fill: 'black' } }; }, test: function (f) { return f.inner && f.inner.count === SHAPES[f.shape]; } }; }, varyShape: false, hard: true }];
  K.gen({ id: 'xnOdd', objective: 'XP-N1', title: 'Odd one out',
    make: function (r, L) {
      var pool = L === 1 ? ODD.slice(0, 2) : L === 2 ? ODD.slice(1, 4) : ODD.slice(3), rd = r.pick(pool), rule = rd.make(r);
      var figs = [], seen = {};
      for (var t = 0; figs.length < 4 && t < 80; t++) { var f = randFig(r, { fills: rd.varyFill === false ? undefined : ['white', 'grey', 'stripes'], shapes: rd.varyShape === false ? undefined : ['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'diamond'] }); Object.assign(f, rule.good(r)); if (rd.varyFill === false) {} if (!seen[canon(f)] && rule.test(f)) { seen[canon(f)] = 1; figs.push(f); } }
      var odd; for (t = 0; t < 40; t++) { odd = randFig(r, { fills: ['white', 'grey', 'stripes'], shapes: ['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'diamond'] }); Object.assign(odd, rule.bad(r)); if (!rule.test(odd) && !seen[canon(odd)]) break; }
      var opts = r.shuffle(figs.concat([odd])), opt = { figs: opts, answer: LET[opts.indexOf(odd)] };
      return nvrChoice('Which figure is the <b>odd one out</b>?', '', opt, { hint: 'Find something four of the figures have in common.', params: { rule: rd.name }, sol: [rd.name, 'Figure ' + opt.answer + ' is different.'] });
    },
    verify: function (q) { var p = q.params, rd = ODD.filter(function (x) { return x.name === p.rule; })[0], figs = p.optFigs; // recover the rule's test from the majority
      var keyFns = [function (f) { return f.inner ? f.inner.count : -1; }, function (f) { return f.fill; }, function (f) { return ['circle', 'heart'].indexOf(f.shape) < 0; }, function (f) { return f.arrow; }, function (f) { return f.inner && f.inner.count === SHAPES[f.shape]; }];
      var fn = keyFns[ODD.indexOf(rd)], vals = figs.map(fn), counts = {}; vals.forEach(function (v) { counts[v] = (counts[v] || 0) + 1; });
      var lone = figs.filter(function (f) { return counts[fn(f)] === 1; }); return lone.length === 1 && LET[figs.indexOf(lone[0])] === q.check.value && Object.keys(counts).length === 2 && p.opts.length === new Set(p.opts).size; } });

  // No second rule may point somewhere else: in odd one out, if four figures share ANY feature, the fifth must be the answer;
  // in most-like, the answer must share every feature the three boxed figures have in common.
  var FEAT = [function (f) { return f.shape; }, function (f) { return f.fill; }, function (f) { return f.inner ? f.inner.count : 0; }, function (f) { return f.arrow === undefined ? '-' : f.arrow; }, function (f) { return ['circle', 'heart'].indexOf(f.shape) < 0; }, function (f) { return f.size || 2; }];
  function oddAmbiguous(figs, ans) { return FEAT.some(function (fn) { var v = figs.map(function (f) { return String(fn(f)); }); return v.some(function (x, i) { var same = v.filter(function (y) { return y === x; }).length; return same === 1 && i !== ans && v.filter(function (y, j) { return j !== i; }).every(function (y) { return y === v[i === 0 ? 1 : 0]; }); }); }); }
  function likeAmbiguous(group, figs, ans) { return FEAT.some(function (fn) { var g = group.map(function (f) { return String(fn(f)); }); return g.every(function (x) { return x === g[0]; }) && String(fn(figs[ans])) !== g[0]; }); }
  function unambiguous(id, amb) { var g = OM.gens[id], mk = g.make, vf = g.verify; g.make = function (r, L) { var q; for (var t = 0; t < 60; t++) { q = mk(r, L); if (!amb(q)) return q; } return q; }; g.verify = function (q) { return vf(q) && !amb(q); }; }

  // ---------- Analogies: A is to B as C is to ? ----------
  var TRANS = [
    { name: 'turns 90° clockwise', f: function (x) { x.rot = (x.rot || 0) + 90; if (x.arrow !== undefined) x.arrow = (x.arrow + 90) % 360; } },
    { name: 'swaps white and black shading', f: function (x) { x.fill = x.fill === 'white' ? 'black' : x.fill === 'black' ? 'white' : x.fill; } },
    { name: 'gains a dot', f: function (x) { x.inner = x.inner ? { shape: x.inner.shape, count: Math.min(5, x.inner.count + 1), fill: x.inner.fill } : { shape: 'dot', count: 1, fill: 'black' }; } },
    { name: 'grows', f: function (x) { x.size = Math.min(3, (x.size || 2) + 1); } },
    { name: 'its line becomes dashed', f: function (x) { x.dash = !x.dash; } }];
  K.gen({ id: 'xnAnalogy', objective: 'XP-N3', title: 'Analogies',
    make: function (r, L) {
      var n = L === 1 ? 1 : 2, ts = r.sample(TRANS, n);
      if (ts.some(function (t) { return t.name === 'grows'; })) ts.forEach(function () {});
      var shp = ['arrow', 'heart', 'triangle', 'pentagon'], a = randFig(r, { fills: ['white', 'black'], shapes: shp, size: ts.some(function (t) { return t.name === 'grows'; }) ? 1 : 2 }), c = randFig(r, { fills: ['white', 'black'], shapes: shp, size: a.size });
      if (c.shape === a.shape) c.shape = shp[(shp.indexOf(a.shape) + 1) % shp.length];
      if (L === 3) { a.inner = { shape: 'dot', count: r.int(1, 3), fill: 'black' }; c.inner = { shape: 'dot', count: r.int(1, 3), fill: 'black' }; }
      var b = clone(a), d = clone(c); ts.forEach(function (t) { t.f(b); t.f(d); });
      var wrongs = [clone(c)]; TRANS.forEach(function (t) { var w = clone(c); t.f(w); wrongs.push(w); var w2 = clone(d); t.f(w2); wrongs.push(w2); });
      var opt = options(r, d, r.shuffle(wrongs));
      return nvrChoice('The first figure changes into the second. Which figure completes the second pair <b>in the same way</b>?', '<div class="nvr-row">' + V.nvr(a) + '<span class="nvr-arrow">→</span>' + V.nvr(b) + '<span class="nvr-gap"></span>' + V.nvr(c) + '<span class="nvr-arrow">→</span>' + V.nvr(null, { q: true }) + '</div>', opt, { hint: 'Work out exactly how the first figure changes into the second. Do the same to the third.', params: { d: canon(d), ts: ts.map(function (t) { return t.name; }) }, sol: ['In the first pair, the figure ' + ts.map(function (t) { return t.name; }).join(' and ') + '.', 'Do the same to the third figure: the answer is ' + opt.answer + '.'] });
    },
    verify: function (q) { var p = q.params; return uniqueRight(q, function (f) { return canon(f) === p.d; }); } });

  // ---------- Matrices ----------
  K.gen({ id: 'xnMatrix', objective: 'XP-N4', title: 'Matrices: complete the grid',
    make: function (r, L) {
      var size = L === 3 ? 3 : 2, shapes = r.sample(['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'star'], size), fills = r.sample(['white', 'grey', 'black', 'stripes'], size), grid = [], i, j;
      for (i = 0; i < size; i++) { grid.push([]); for (j = 0; j < size; j++) { var f = { shape: shapes[L === 3 ? (i + j) % 3 : i], fill: fills[L === 3 ? (2 * i + j) % 3 : j], size: 2, rot: 0, inner: L === 2 ? { shape: 'dot', count: j + 1, fill: 'black' } : null }; grid[i].push(f); } }
      var right = grid[size - 1][size - 1], wrongs = [];
      shapes.concat(['diamond']).forEach(function (s) { fills.forEach(function (fl) { var w = clone(right); w.shape = s; w.fill = fl; wrongs.push(w); }); });
      if (L === 2) { var w1 = clone(right); w1.inner.count = 1; wrongs.unshift(w1); }
      var opt = options(r, right, r.shuffle(wrongs));
      var vis = '<div class="nvr-grid g' + size + '">' + grid.map(function (rw, a) { return rw.map(function (f, b) { return a === size - 1 && b === size - 1 ? V.nvr(null, { q: true }) : V.nvr(f); }).join(''); }).join('') + '</div>';
      return nvrChoice('Which figure completes the grid?', vis, opt, { hint: size === 3 ? 'Each shape and each shading appears once in every row and every column.' : 'Look along the rows and down the columns: what stays the same?', params: { right: canon(right), grid: grid.map(function (rw) { return rw.map(canon); }) }, sol: [size === 3 ? 'Each row and column has one of each shape and one of each shading.' : 'Each row keeps the same shape; each column keeps the same shading' + (L === 2 ? ' and number of dots' : '') + '.', 'The missing figure is ' + opt.answer + '.'] });
    },
    verify: function (q) {
      var p = q.params, g = p.grid, n = g.length, cell = function (f) { return f.split('|'); };
      return uniqueRight(q, function (f) {
        var c = cell(canon(f));
        if (n === 2) { var rowShape = cell(g[1][0])[0], colFill = cell(g[0][1])[1], dots = cell(g[0][1])[5]; return c[0] === rowShape && c[1] === colFill && c[5] === dots; }
        var rowS = [cell(g[2][0])[0], cell(g[2][1])[0]], colS = [cell(g[0][2])[0], cell(g[1][2])[0]], rowF = [cell(g[2][0])[1], cell(g[2][1])[1]], colF = [cell(g[0][2])[1], cell(g[1][2])[1]];
        var allS = [cell(g[0][0])[0], cell(g[0][1])[0], cell(g[0][2])[0]], allF = [cell(g[0][0])[1], cell(g[0][1])[1], cell(g[0][2])[1]];
        return allS.indexOf(c[0]) >= 0 && rowS.indexOf(c[0]) < 0 && colS.indexOf(c[0]) < 0 && allF.indexOf(c[1]) >= 0 && rowF.indexOf(c[1]) < 0 && colF.indexOf(c[1]) < 0;
      });
    } });

  // ---------- Most like: which figure belongs with the first three? ----------
  K.gen({ id: 'xnSimilar', objective: 'XP-N5', title: 'Which is most like these?',
    make: function (r, L) {
      var rd = (L === 1 ? ODD.slice(0, 2) : L === 2 ? ODD.slice(1, 4) : ODD.slice(3)), pick = r.pick(rd), rule = pick.make(r), group = [], seen = {};
      var mk = function (good) { for (var t = 0; t < 60; t++) { var f = randFig(r, { fills: pick.varyFill === false ? undefined : ['white', 'grey', 'stripes'], shapes: pick.varyShape === false ? undefined : ['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'diamond'] }); Object.assign(f, good ? rule.good(r) : rule.bad(r)); if (rule.test(f) === good && !seen[canon(f)]) { seen[canon(f)] = 1; return f; } } return null; };
      for (var k = 0; k < 3; k++) group.push(mk(true));
      var right = mk(true), wrongs = [mk(false), mk(false), mk(false), mk(false)].filter(Boolean);
      var opt = options(r, right, wrongs);
      return nvrChoice('Which figure is <b>most like</b> the three figures in the box?', '<div class="nvr-row boxed">' + group.map(function (f) { return V.nvr(f); }).join('') + '</div>', opt, { hint: 'Find what the three figures in the box all have in common.', params: { rule: pick.name, groupFigs: group }, sol: [pick.name.replace('All the others', 'All three figures').replace('In all the others', 'In all three figures'), 'Only figure ' + opt.answer + ' shares this.'] });
    },
    verify: function (q) { var p = q.params, rd = ODD.filter(function (x) { return x.name === p.rule; })[0], idx = ODD.indexOf(rd);
      var keyFns = [function (f) { return f.inner ? f.inner.count : -1; }, function (f) { return f.fill; }, function (f) { return ['circle', 'heart'].indexOf(f.shape) < 0; }, function (f) { return f.arrow; }, function (f) { return f.inner && f.inner.count === SHAPES[f.shape]; }];
      var figs = p.optFigs, fn = keyFns[idx], right = figs[LET.indexOf(q.check.value)]; var others = figs.filter(function (f) { return f !== right; });
      return p.opts.length === new Set(p.opts).size && others.every(function (f) { return String(fn(f)) !== String(fn(right)); }); } });

  // ---------- Reflections ----------
  K.gen({ id: 'xnReflect', objective: 'XP-N6', title: 'Reflections',
    make: function (r, L) {
      var base = { shape: r.pick(['square', 'circle', 'hexagon']), fill: 'white', size: 3, rot: 0, inner: null, arrow: r.pick([45, 90, 135, 225, 270, 315, 30, 60]), mark: [r.pick([-0.6, 0.6]), r.pick([-0.6, 0.6])] };
      var reflV = function (f) { var g = clone(f); g.arrow = (360 - f.arrow) % 360; g.mark = [-f.mark[0], f.mark[1]]; return g; };
      var reflH = function (f) { var g = clone(f); g.arrow = (540 - f.arrow) % 360; g.mark = [f.mark[0], -f.mark[1]]; return g; };
      var rot180 = function (f) { var g = clone(f); g.arrow = (f.arrow + 180) % 360; g.mark = [-f.mark[0], -f.mark[1]]; return g; };
      var vertical = L < 3 || r.chance(0.5), right = vertical ? reflV(base) : reflH(base);
      var badMark = clone(right); badMark.mark = [-right.mark[0], right.mark[1]];
      var opt = options(r, right, r.shuffle([clone(base), vertical ? reflH(base) : reflV(base), rot180(base), badMark]));
      var mirror = vertical ? '<line x1="98" y1="0" x2="98" y2="100" stroke="#d9534f" stroke-width="3" stroke-dasharray="6 4"/>' : '<line x1="0" y1="98" x2="100" y2="98" stroke="#d9534f" stroke-width="3" stroke-dasharray="6 4"/>';
      var fig = V.nvr(base).replace('</svg>', mirror + '</svg>');
      return nvrChoice('Which figure shows the reflection in the dashed ' + (vertical ? 'vertical' : 'horizontal') + ' mirror line?', '<div class="nvr-row">' + fig + '</div>', opt, { hint: 'In a mirror, things swap sides but do not turn round. Check the dot and the arrow.', params: { right: canon(right), vertical: vertical, base: base }, sol: ['In a ' + (vertical ? 'vertical' : 'horizontal') + ' mirror, ' + (vertical ? 'left and right' : 'top and bottom') + ' swap over.', 'The dot and the arrow both flip: figure ' + opt.answer + '.'] });
    },
    // independent: reflect by mapping the points of the arrow tip and the dot as coordinates
    verify: function (q) { var p = q.params, b = p.base, tip = [Math.sin(b.arrow * Math.PI / 180), -Math.cos(b.arrow * Math.PI / 180)], want = p.vertical ? [-tip[0], tip[1]] : [tip[0], -tip[1]], wm = p.vertical ? [-b.mark[0], b.mark[1]] : [b.mark[0], -b.mark[1]];
      return uniqueRight(q, function (f) { var t = [Math.sin(f.arrow * Math.PI / 180), -Math.cos(f.arrow * Math.PI / 180)]; return Math.abs(t[0] - want[0]) < 1e-9 && Math.abs(t[1] - want[1]) < 1e-9 && f.mark[0] === wm[0] && f.mark[1] === wm[1] && f.shape === b.shape; }); } });

  // ---------- Codes ----------
  K.gen({ id: 'xnCodes', objective: 'XP-N7', title: 'Codes',
    make: function (r, L) {
      var shapes = r.sample(['circle', 'square', 'triangle', 'pentagon'], 3), fills = r.sample(['white', 'grey', 'black'], 3), dots = [1, 2, 3];
      var L1 = r.sample(['A', 'B', 'C', 'D'], 3), L2 = r.sample(['X', 'Y', 'Z'], 3), L3 = r.sample(['P', 'Q', 'R'], 3), three = L === 3;
      var code = function (s, f, d) { return L1[s] + L2[f] + (three ? L3[d] : ''); };
      var mk = function (s, f, d) { return { shape: shapes[s], fill: fills[f], size: 2, rot: 0, inner: three ? { shape: 'dot', count: dots[d], fill: fills[f] === 'black' ? 'white' : 'black' } : null }; };
      // examples cover every letter; the target is a new combination
      var ex = three ? [[0, 0, 1], [1, 1, 2], [2, 2, 0], [0, 1, 0]] : [[0, 0, 0], [1, 1, 0], [2, 2, 0], [0, 1, 0]];
      if (L === 1) ex = ex.slice(0, 3).concat([[1, 2, 0]]);
      var used = {}; ex.forEach(function (e) { used[e.join()] = 1; });
      var tgt; do { tgt = [r.int(0, 2), r.int(0, 2), three ? r.int(0, 2) : 0]; } while (used[tgt.join()]);
      var right = code(tgt[0], tgt[1], tgt[2]), wrongs = [];
      [[1, 0, 0], [0, 1, 0], [0, 0, 1], [2, 0, 0], [0, 2, 0]].forEach(function (dlt) { wrongs.push(code((tgt[0] + dlt[0]) % 3, (tgt[1] + dlt[1]) % 3, three ? (tgt[2] + dlt[2]) % 3 : 0)); });
      var opts = r.shuffle([right].concat(wrongs.filter(function (w, i, a) { return w !== right && a.indexOf(w) === i; }).slice(0, 4)));
      var vis = '<div class="nvr-row codes">' + ex.map(function (e) { return '<span class="nvr-code">' + V.nvr(mk(e[0], e[1], e[2])) + '<b>' + code(e[0], e[1], e[2]) + '</b></span>'; }).join('') + '<span class="nvr-code target">' + V.nvr(mk(tgt[0], tgt[1], tgt[2])) + '<b>?</b></span></div>';
      var q = K.choice('Each figure has a code. What is the code for the last figure?', opts.map(function (c) { return { value: c, label: '<b class="xcode">' + c + '</b>' }; }), right, { hint: 'Find figures that share a letter. What do they have in common? Each letter stands for one feature.', params: { ex: ex, tgt: tgt, letters: [L1, L2, L3], three: three }, sol: ['The first letter is for the shape' + ', the second for the shading' + (three ? ', the third for the number of dots' : '') + '.', 'The code is ' + right + '.'] });
      q.visual = vis; q.input.big = true; return q;
    },
    // independent: work out each letter's meaning from the examples, then decode
    verify: function (q) { var p = q.params, n = p.three ? 3 : 2, meaning = [{}, {}, {}];
      p.ex.forEach(function (e) { for (var k = 0; k < n; k++) { var letter = p.letters[k][e[k]]; if (meaning[k][letter] !== undefined && meaning[k][letter] !== e[k]) meaning[k].bad = true; meaning[k][letter] = e[k]; } });
      var dec = ''; for (var k = 0; k < n; k++) { var found = null; Object.keys(meaning[k]).forEach(function (l) { if (meaning[k][l] === p.tgt[k]) found = l; }); if (found === null || meaning[k].bad) return false; dec += found; }
      return q.check.value === dec && q.input.options.filter(function (o) { return o.value === dec; }).length === 1; } });

  unambiguous('xnOdd', function (q) { return oddAmbiguous(q.params.optFigs, LET.indexOf(q.check.value)); });
  unambiguous('xnSimilar', function (q) { return likeAmbiguous(q.params.groupFigs, q.params.optFigs, LET.indexOf(q.check.value)); });

  // ================= the 11+ curriculum (its own "year", so it never mixes into school-year practice) =================
  function o(id, title, gens, vocab, intro, method, mistakes) { return { id: id, statement: title, title: title, gens: gens, vocab: vocab, intro: intro, method: method, mistakes: mistakes, focus: '11+ practice' }; }
  var XP = {
    year: 'XP', label: '11+', keyStage: '11+ entrance tests', ages: '9–11', eleven: true,
    source: '11+ practice in the multiple-choice style used by most 11+ tests (not an official test)',
    regions: [
      { id: 'xm', name: '11+ Maths', strand: '11+ maths', color: '#2f7fd0', icon: 'calc', objectives: [
        o('XP-M1', 'Number and place value', ['xNumber'], ['place value', 'rounding', 'millions'], [{ say: '11+ maths uses Year 5 and 6 content, often in multi-step problems. Read every option before you choose.' }], ['Work it out before you look at the options.', 'Then find your answer among A to E.', 'If it is not there, check your working.'], ['Choosing an option that looks right without working it out.', 'Missing a zero in large numbers.']),
        o('XP-M2', 'Calculation', ['xCalc'], ['mental', 'order of operations', 'estimate'], [{ say: 'Estimate first: it lets you rule out options that are far too big or small.' }], ['Estimate.', 'Calculate carefully.', 'Match your answer to an option.'], ['Ignoring the order of operations.', 'Not estimating first.']),
        o('XP-M3', 'Fractions, decimals and percentages', ['xFDP'], ['fraction', 'decimal', 'percentage'], [{ say: 'Know the key equivalents: ½ = 0.5 = 50%, ¼ = 0.25 = 25%, ⅕ = 0.2 = 20%, ⅛ = 0.125.' }], ['Convert to the easiest form.', 'Find 10% and build up.', 'Check the option has the right form.'], ['Thinking 0.5 = 5%.', 'Finding the percentage of the wrong amount.']),
        o('XP-M4', 'Ratio and proportion', ['xRatio'], ['ratio', 'proportion', 'share'], [{ say: 'For every 2 red there are 3 blue: 5 parts in total.' }], ['Find the total parts.', 'Find one part.', 'Multiply.'], ['Dividing by the wrong number of parts.', 'Mixing up the order.']),
        o('XP-M5', 'Algebra and sequences', ['xAlgebra'], ['formula', 'unknown', 'sequence'], [{ say: '11+ algebra uses simple formulae and missing numbers: 4a + 7 = 31 means a = 6.' }], ['Substitute or work backwards.', 'Check by putting your answer back in.', 'Look for the pattern in sequences.'], ['Adding before multiplying.', 'Undoing steps in the wrong order.']),
        o('XP-M6', 'Measures and time', ['xMeasures'], ['convert', 'units', 'time'], [{ say: 'Watch the units: the options often include the same number in the wrong unit.' }], ['Convert to the same unit.', 'Calculate.', 'Check the unit of your answer.'], ['Mixing grams and kilograms.', 'Treating time as decimal.']),
        o('XP-M7', 'Shape and space', ['xShape'], ['angle', 'area', 'volume'], [{ say: 'Angles in a triangle add to 180°; in a quadrilateral, 360°. Area of a triangle is half base times height.' }], ['Mark what you know on the diagram.', 'Use the right fact or formula.', 'Check the units.'], ['Using the slanted side as the height.', 'Adding angles to the wrong total.']),
        o('XP-M8', 'Data and averages', ['xData'], ['mean', 'pie chart', 'table'], [{ say: 'Mean = total ÷ how many. In a pie chart, the whole circle is 360°.' }], ['Read the chart carefully.', 'Find the total first.', 'Then divide or find the fraction.'], ['Dividing by the wrong number.', 'Reading the wrong slice.']),
        o('XP-M9', 'Problem solving and puzzles', ['xPuzzles'], ['work backwards', 'trial and improvement', 'reasoning'], [{ say: 'Many 11+ puzzles can be solved by working backwards, or by trying an answer and improving it.' }], ['Read the whole question.', 'Choose a strategy: work backwards, or try and improve.', 'Check your answer fits every condition.'], ['Answering a different question from the one asked.', 'Not checking every condition.'])
      ] },
      { id: 'xn', name: 'Non-verbal reasoning', strand: '11+ non-verbal reasoning', color: '#8a5bb8', icon: 'shapes', objectives: [
        o('XP-N1', 'Odd one out', ['xnOdd'], ['shape', 'shading', 'odd one out'], [{ say: 'Four figures share something; one does not. Check one feature at a time: shape, shading, number of dots, direction, size.' }], ['List the features of each figure.', 'Find the feature four of them share.', 'The odd one breaks that rule.'], ['Choosing a figure that is only different in an unimportant way.', 'Stopping at the first difference you see.']),
        o('XP-N2', 'Series', ['xnSeries'], ['sequence', 'rotation', 'pattern'], [{ say: 'In a series the figures change by a rule: turning, growing, gaining dots or changing shading. Find every rule, not just one.' }], ['Compare neighbouring boxes.', 'Find what changes and by how much.', 'Apply all the rules to the missing box.'], ['Spotting one rule and missing a second one.', 'Turning the wrong way.']),
        o('XP-N3', 'Analogies', ['xnAnalogy'], ['analogy', 'change', 'transform'], [{ say: 'In an analogy, whatever changed the first figure into the second, do the same to the third.' }], ['Describe exactly how the first figure changed.', 'Do the same to the third figure.', 'Check every change is there.'], ['Copying B instead of changing C.', 'Missing one of the changes.']),
        o('XP-N4', 'Matrices', ['xnMatrix'], ['grid', 'row', 'column'], [{ say: 'In a grid, look along each row and down each column. Something usually stays the same, or each feature appears once.' }], ['Check the rows.', 'Check the columns.', 'Find the figure that fits both.'], ['Only checking the rows.', 'Missing the number of dots.']),
        o('XP-N5', 'Most like', ['xnSimilar'], ['similar', 'common feature', 'odd one out'], [{ say: 'Find what all the figures in the box have in common. The answer shares it; the others do not.' }], ['Find the shared feature.', 'Check each option.', 'Ignore differences that do not matter.'], ['Choosing the option that looks most similar overall.', 'Focusing on colour when the rule is about shape.']),
        o('XP-N6', 'Reflections', ['xnReflect'], ['mirror', 'reflection', 'flip'], [{ say: 'A mirror image swaps sides but does not turn. A dot on the left moves to the right in a vertical mirror.' }], ['Find the mirror line.', 'Flip each part across it.', 'Check every part, including small dots.'], ['Choosing a rotation instead of a reflection.', 'Flipping only part of the figure.']),
        o('XP-N7', 'Codes', ['xnCodes'], ['code', 'letter', 'feature'], [{ say: 'Each letter in a code stands for one feature. Find two figures that share a letter and see what they have in common.' }], ['Compare figures that share a letter.', 'Work out what each letter means.', 'Build the code for the new figure.'], ['Guessing letter order.', 'Mixing up which letter goes with which feature.'])
      ] }
    ],
    // timed tests in the usual 11+ style
    tests: { maths: { title: '11+ maths test', minutes: 25, count: 25, region: 'xm' }, nvr: { title: '11+ non-verbal reasoning test', minutes: 20, count: 24, region: 'xn' } }
  };
  OM.CURRICULUM.YXP = XP;
  XP.regions.forEach(function (rg) { rg.eleven = true; rg.objectives.forEach(function (ob) { ob.region = rg.id; ob.year = 'XP'; OM.objectiveIndex[ob.id] = ob; }); });
  OM.buildElevenTest = function (track, seed) {
    var t = XP.tests[track], reg = XP.regions.filter(function (x) { return x.id === t.region; })[0], r = OM.makeRng(seed), seen = {}, qs = [];
    for (var i = 0; qs.length < t.count && i < t.count * 4; i++) { var ob = reg.objectives[i % reg.objectives.length], q = OM.freshFromObjective(ob, [1, 2, 2, 3][qs.length % 4], r, seen); if (q) qs.push(q); }
    return r.shuffle(qs).sort(function (a, b) { return a.level - b.level; });
  };
})(typeof window !== 'undefined' ? window : globalThis);
