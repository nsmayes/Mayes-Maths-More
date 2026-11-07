/* Learn with Pip — toolkit for writing question generators quickly and safely (used by Years 1, 2, 3, 5 and 6).
   K.int / K.dec / K.money / K.choice / K.multi / K.frac / K.order / K.time / K.words build a question object;
   K.gen registers a generator and insists on an independent verify() check. Also: number words, and a few pictures. */
(function (G) {
  'use strict';
  var OM = G.OM, V = OM.V, fmt = OM.fmt;
  var K = OM.kit = {};
  K.S = function (text, html) { return { text: text, html: html || '' }; };
  K.fmt = fmt;
  function base(prompt, input, check, o) {
    o = o || {};
    var q = { prompt: prompt, input: input, check: check, hint: o.hint, solution: (o.sol || []).map(function (s) { return typeof s === 'string' ? K.S(s) : s; }), params: o.params || {} };
    if (o.visual) q.visual = o.visual;
    if (o.shown) q.shown = o.shown; // the same picture with the working drawn on, for worked examples and reviews
    if (o.answer) q.answerText = o.answer;
    if (o.marks) q.marks = o.marks;
    if (o.reject) q.reject = o.reject;
    if (o.calc) q.calc = true;
    if (o.accept) q.accept = o.accept;
    return q;
  }
  K.int = function (prompt, value, o) {
    o = o || {};
    return base(prompt, { type: 'number', keys: o.keys || (value < 0 ? 'signed' : 'digits'), prefix: o.prefix, suffix: o.suffix }, { kind: 'int', value: value }, o);
  };
  // value is an exact decimal string, e.g. '3.45'
  K.dec = function (prompt, value, o) { o = o || {}; return base(prompt, { type: 'number', keys: 'decimal', prefix: o.prefix, suffix: o.suffix }, { kind: 'dec', value: String(value) }, o); };
  // box: '£' (pounds box) or 'p' (pence box)
  K.money = function (prompt, pence, box, o) {
    o = o || {};
    return base(prompt, { type: 'number', keys: box === 'p' ? 'digits' : 'decimal', prefix: box === '£' ? '£' : undefined, suffix: box === 'p' ? 'p' : undefined }, { kind: 'money', pence: pence, box: box }, o);
  };
  // options: [{value, label}] or plain strings; correct: the value
  K.choice = function (prompt, options, correct, o) {
    o = o || {};
    var opts = options.map(function (x) { return typeof x === 'object' ? x : { value: String(x), label: String(x) }; });
    var lab = (opts.filter(function (x) { return String(x.value) === String(correct); })[0] || {}).label;
    return base(prompt, { type: 'choice', options: opts, big: o.big }, { kind: 'choice', value: String(correct), label: lab }, o);
  };
  // template with {0}, {1}...; parts: checks for each blank; blanks: input settings for each
  K.multi = function (prompt, template, parts, o) {
    o = o || {};
    return base(prompt, { type: 'multi', template: template, blanks: o.blanks || parts.map(function (p) { return { keys: p.kind === 'dec' ? 'decimal' : 'digits' }; }) }, { kind: 'multi', parts: parts, each: o.each }, o);
  };
  K.frac = function (prompt, n, d, o) {
    o = o || {};
    return base(prompt, { type: 'fraction', mixed: !!o.mixed }, { kind: 'frac', n: n, d: d, form: o.form, denom: o.denom, noMixed: o.noMixed }, o);
  };
  K.order = function (prompt, items, order, o) { return base(prompt, { type: 'order', items: items }, { kind: 'order', order: order }, o); };
  // mins since midnight; format: 'clock' (no am/pm needed), '12' (needs am/pm) or '24'
  K.time = function (prompt, mins, format, o) { return base(prompt, { type: 'text', keys: 'time', placeholder: format === '24' ? 'e.g. 14:05' : 'e.g. 3:45' }, { kind: 'time', mins: mins, format: format }, o); };
  // the child types a number in words
  K.words = function (prompt, value, o) { return base(prompt, { type: 'text', keys: 'text', placeholder: 'type the words' }, { kind: 'words', value: value }, o); };

  // ---------- secondary answer types (marked by js/algebra.js) ----------
  // an expression; form: 'any' | 'simplified' | 'expanded' | 'factorised'. answer is written with ^ for powers.
  K.expr = function (prompt, answer, form, o) { o = o || {}; var c = { kind: 'expr', answer: answer, form: form || 'any' }; if (o.lhs) c.lhs = o.lhs; return base(prompt, { type: 'text', keys: 'algebra', placeholder: o.placeholder || (o.lhs ? o.lhs + ' = …' : 'e.g. 3x + 2'), prefix: o.prefix }, c, o); };
  // the solution of an equation, as exact text ("7/2", "-3")
  K.solve = function (prompt, value, o) { o = o || {}; return base(prompt, { type: 'text', keys: 'algebra', placeholder: (o.v || 'x') + ' = …' }, { kind: 'solve', value: String(value), v: o.v || 'x' }, o); };
  // an inequality: lo/hi as text or null
  K.ineq = function (prompt, lo, loInc, hi, hiInc, o) { o = o || {}; return base(prompt, { type: 'text', keys: 'algebra', placeholder: 'e.g. ' + (o.v || 'x') + ' > 3' }, { kind: 'ineq', v: o.v || 'x', lo: lo, loInc: loInc, hi: hi, hiInc: hiInc }, o); };
  // a rounded answer: exact value text, and {dp} or {sf}
  K.approx = function (prompt, value, acc, o) { o = o || {}; var c = { kind: 'approx', value: String(value) }; if (acc.dp !== undefined) c.dp = acc.dp; else c.sf = acc.sf; return base(prompt, { type: 'number', keys: 'decimal', prefix: o.prefix, suffix: o.suffix }, c, o); };
  // a calculator answer accepted from lo to hi
  K.range = function (prompt, lo, hi, o) { o = o || {}; return base(prompt, { type: 'number', keys: 'decimal', prefix: o.prefix, suffix: o.suffix }, { kind: 'range', lo: String(lo), hi: String(hi) }, o); };
  K.stdform = function (prompt, m, e, o) { o = o || {}; return base(prompt, { type: 'text', keys: 'algebra', placeholder: 'e.g. 4.5 × 10^6' }, { kind: 'stdform', m: String(m), e: e }, o); };

  // A GCSE generator. levels: { 1: spec, 2: spec, 3: spec } where a spec is either
  //   ['y8Indices', 2]  - re-use a tested Key Stage 3 generator at that level (its own independent check is used), or
  //   { make: function (r) {...}, verify: function (q) {...} }  - new GCSE content.
  K.gcse = function (def) {
    K.gen({ id: def.id, objective: def.objective, title: def.title,
      make: function (r, L) {
        var spec = def.levels[L];
        if (Array.isArray(spec)) { var q = OM.gens[spec[0]].make(r, spec[1]); q.params = q.params || {}; q.params.__src = spec[0]; return q; }
        return spec.make(r);
      },
      verify: function (q) { return q.params && q.params.__src ? OM.gens[q.params.__src].verify(q) : def.levels[q.level].verify(q); } });
  };

  // Turn a question into a working question with GCSE-style marks.
  // marks: [{ code: 'M1', text: 'for …', any: [evidence] }, …, { code: 'A1', text: 'cao' }]; o.start: the equation being solved (for Pip's step check);
  // o.lines: the model working (shown in the solution and used by the checker); o.example: a hint shown above the lines.
  K.withSteps = function (q, marks, o) {
    o = o || {};
    q.input = { type: 'steps', final: q.input, lines: o.lineCount || 4, marks: marks.length, example: o.example, firstHint: o.firstHint };
    q.check = { kind: 'steps', final: q.check, marks: marks, start: o.start, v: o.v, exampleLines: o.lines || [] };
    q.marks = marks.length;
    return q;
  };

  // Register a generator. Every generator must be able to check its own answer another way.
  K.gen = function (def) {
    if (typeof def.verify !== 'function') throw new Error('Generator ' + def.id + ' has no independent check');
    OM.registerGen(def);
  };

  // ---------- small helpers ----------
  K.digits = function (n) { return String(n).split('').map(Number); };
  // for "what is the value of the digit...?": a position (from those allowed) whose digit is not 0 and appears only once
  // in all of ds, or -1 if there is none. If the digit appeared twice, the question and its explanation would be confusing.
  K.loneDigit = function (r, ds, allowed) {
    var ok = (allowed || ds.map(function (_, i) { return i; })).filter(function (i) { return ds[i] !== 0 && ds.indexOf(ds[i]) === ds.lastIndexOf(ds[i]); });
    return ok.length ? r.pick(ok) : -1;
  };
  K.sum = function (a) { return a.reduce(function (s, x) { return s + x; }, 0); };
  K.plural = function (n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); };
  K.fr = function (n, d, w) { return OM.frac(n, d, w); };
  // count up digit by digit: used to check column answers without JavaScript's own + and −
  K.addCheck = function (a, b) { return OM.colAddVerify(a, b); };
  K.subCheck = function (a, b) { return OM.colSubVerify(a, b); };
  // repeated addition: an independent way to check a multiplication
  K.mulCheck = function (a, b) { var s = 0; for (var i = 0; i < b; i++) s = OM.colAddVerify(s, a); return s; };

  // ---------- number words (UK style: "three hundred and forty-five") ----------
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function under1000(n, andWanted) {
    var h = Math.floor(n / 100), r = n % 100, out = [];
    if (h) out.push(ONES[h] + ' hundred');
    if (r) {
      var w = r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? '-' + ONES[r % 10] : '');
      out.push((h || andWanted ? 'and ' : '') + w);
    }
    return out.join(' ');
  }
  K.toWords = function (n) {
    if (n === 0) return 'zero';
    var parts = [], m = Math.floor(n / 1e6), th = Math.floor(n / 1000) % 1000, rest = n % 1000;
    if (m) parts.push(under1000(m) + ' million');
    if (th) parts.push(under1000(th) + ' thousand');
    if (rest) parts.push(under1000(rest, (m || th) && rest < 100));
    return parts.join(' ');
  };
  // misspellings that mark schemes accept because the meaning is clear
  var MISSPELT = { fourty: 'forty', ninty: 'ninety', nintey: 'ninety', fiveteen: 'fifteen', eightteen: 'eighteen', twelf: 'twelve', hundered: 'hundred', thousend: 'thousand', tweny: 'twenty' };
  // parse words back to a number (accepts with or without "and", hyphens or spaces); null if not valid
  K.fromWords = function (s) {
    var words = String(s || '').toLowerCase().replace(/[-,]/g, ' ').replace(/\band\b/g, ' ').trim().split(/\s+/).filter(Boolean)
      .map(function (w) { return MISSPELT[w] || w; });
    if (!words.length) return null;
    var total = 0, cur = 0, seen = false;
    for (var i = 0; i < words.length; i++) {
      var w = words[i], k = ONES.indexOf(w), tt = TENS.indexOf(w);
      if (k >= 0) { cur += k; seen = true; }
      else if (tt >= 2) { cur += tt * 10; seen = true; }
      else if (w === 'hundred') { if (!cur) return null; cur *= 100; }
      else if (w === 'thousand') { total += (cur || 1) * 1000; cur = 0; }
      else if (w === 'million') { total += (cur || 1) * 1e6; cur = 0; }
      else return null;
    }
    return seen || total ? total + cur : null;
  };

  // ---------- extra pictures ----------
  var C = V.colors;
  // 3-D shapes drawn simply, so a child can name them
  V.solid = function (name, o) {
    o = o || {};
    var f = o.fill || C.skyLight, s = C.ink, b = '';
    function poly(pts, fill) { return '<polygon points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="' + fill + '" stroke="' + s + '" stroke-width="2.5" stroke-linejoin="round"/>'; }
    function dash(x1, y1, x2, y2) { return V.line(x1, y1, x2, y2, { dash: '5 5', stroke: '#8a8a8a', w: 2 }); }
    if (name === 'cube' || name === 'cuboid') {
      var w = name === 'cube' ? 80 : 130, h = 80, d = 36;
      b = poly([[20, 40], [20 + w, 40], [20 + w, 40 + h], [20, 40 + h]], f) + poly([[20, 40], [20 + d, 40 - d * .7], [20 + w + d, 40 - d * .7], [20 + w, 40]], '#e3eefc') + poly([[20 + w, 40], [20 + w + d, 40 - d * .7], [20 + w + d, 40 + h - d * .7], [20 + w, 40 + h]], '#b9d0f2');
      return V.svg(w + d + 40, h + 70, b);
    }
    if (name === 'cylinder') {
      b = '<path d="M30 40 V140 A55 16 0 0 0 140 140 V40" fill="' + f + '" stroke="' + s + '" stroke-width="2.5"/><ellipse cx="85" cy="40" rx="55" ry="16" fill="#e3eefc" stroke="' + s + '" stroke-width="2.5"/>' + '<path d="M30 140 A55 16 0 0 1 140 140" fill="none" stroke="#8a8a8a" stroke-width="2" stroke-dasharray="5 5"/>';
      return V.svg(170, 170, b);
    }
    if (name === 'cone') {
      b = '<path d="M85 20 L30 140 A55 16 0 0 0 140 140 Z" fill="' + f + '" stroke="' + s + '" stroke-width="2.5" stroke-linejoin="round"/><path d="M30 140 A55 16 0 0 1 140 140" fill="none" stroke="#8a8a8a" stroke-width="2" stroke-dasharray="5 5"/>';
      return V.svg(170, 170, b);
    }
    if (name === 'sphere') {
      b = '<circle cx="85" cy="85" r="62" fill="' + f + '" stroke="' + s + '" stroke-width="2.5"/><path d="M23 85 A62 18 0 0 0 147 85" fill="none" stroke="' + s + '" stroke-width="2"/><path d="M23 85 A62 18 0 0 1 147 85" fill="none" stroke="#8a8a8a" stroke-width="2" stroke-dasharray="5 5"/>';
      return V.svg(170, 170, b);
    }
    if (name === 'square-based pyramid') {
      b = poly([[25, 130], [115, 130], [80, 22]], f) + poly([[115, 130], [150, 105], [80, 22]], '#b9d0f2') + dash(25, 130, 60, 105) + dash(60, 105, 150, 105) + dash(60, 105, 80, 22);
      return V.svg(175, 160, b);
    }
    if (name === 'triangular prism') {
      b = poly([[20, 130], [70, 40], [120, 130]], '#e3eefc') + poly([[70, 40], [170, 20], [220, 110], [120, 130]], f) + dash(20, 130, 120, 110) + dash(120, 110, 220, 110) + dash(120, 110, 170, 20) + V.line(20, 130, 120, 130, { w: 2.5 });
      return V.svg(240, 160, b);
    }
    return '';
  };
  K.SOLIDS = { 'cube': { faces: 6, edges: 12, vertices: 8 }, 'cuboid': { faces: 6, edges: 12, vertices: 8 }, 'square-based pyramid': { faces: 5, edges: 8, vertices: 5 },
    'triangular prism': { faces: 5, edges: 9, vertices: 6 }, 'cylinder': { faces: 3, edges: 2, vertices: 0 }, 'cone': { faces: 2, edges: 1, vertices: 1 }, 'sphere': { faces: 1, edges: 0, vertices: 0 } };
  // a circle cut into d equal slices, the first `shaded` coloured
  V.pie = function (d, shaded, o) {
    o = o || {};
    var R = o.r || 60, cx = R + 6, cy = R + 6, b = '';
    for (var i = 0; i < d; i++) {
      var a1 = (i / d) * 2 * Math.PI - Math.PI / 2, a2 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
      var x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1), x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
      b += '<path d="M' + cx + ' ' + cy + ' L' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' A' + R + ' ' + R + ' 0 ' + (a2 - a1 > Math.PI ? 1 : 0) + ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2) + ' Z" fill="' + (i < shaded ? (o.color || C.amber) : '#fff') + '" stroke="' + C.ink + '" stroke-width="2"/>';
    }
    if (d === 1) b = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="' + (shaded ? (o.color || C.amber) : '#fff') + '" stroke="' + C.ink + '" stroke-width="2"/>';
    return V.svg(2 * R + 12, 2 * R + 12, b);
  };
  // n objects in rows (for counting, sharing and fractions of a set); groups: draw a box around every `group`
  V.dots = function (n, o) {
    o = o || {};
    var per = o.perRow || 10, r = 11, gap = 30, rows = Math.ceil(n / per), b = '', colours = o.colours || [];
    for (var i = 0; i < n; i++) {
      var x = 20 + (i % per) * gap + (o.group ? Math.floor((i % per) / o.group) * 12 : 0), y = 20 + Math.floor(i / per) * gap;
      b += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + (colours[i] || o.fill || C.amber) + '" stroke="' + C.ink + '" stroke-width="1.5"/>';
    }
    var W = 20 + Math.min(n, per) * gap + (o.group ? Math.floor((per - 1) / o.group) * 12 : 0), H = 10 + rows * gap;
    return V.svg(W, H, b);
  };
  // a pair of line segments: 'parallel', 'perpendicular' or 'neither'; dir in degrees
  V.linePair = function (kind, rot) {
    var b = '', cx = 110, cy = 80, rad = (rot || 0) * Math.PI / 180;
    function seg(x1, y1, x2, y2, col) {
      function R(x, y) { var dx = x - cx, dy = y - cy; return [cx + dx * Math.cos(rad) - dy * Math.sin(rad), cy + dx * Math.sin(rad) + dy * Math.cos(rad)]; }
      var a = R(x1, y1), c = R(x2, y2); return V.line(a[0].toFixed(1), a[1].toFixed(1), c[0].toFixed(1), c[1].toFixed(1), { w: 5, stroke: col });
    }
    if (kind === 'parallel') b = seg(30, 50, 190, 50, C.sky) + seg(30, 110, 190, 110, C.berry);
    else if (kind === 'perpendicular') b = seg(30, 110, 190, 110, C.sky) + seg(110, 20, 110, 110, C.berry);
    else b = seg(30, 110, 190, 90, C.sky) + seg(60, 20, 140, 120, C.berry);
    return V.svg(220, 160, b);
  };
  // a protractor laid on an angle: one arm along 0°, the other at `deg` (0-180). Both scales are drawn, as on a real one.
  V.protractor = function (deg, o) {
    o = o || {};
    var cx = 200, cy = 200, R = 170, b = '';
    b += '<path d="M' + (cx - R) + ' ' + cy + ' A' + R + ' ' + R + ' 0 0 1 ' + (cx + R) + ' ' + cy + ' Z" fill="rgba(207,224,250,.55)" stroke="' + C.sky + '" stroke-width="2"/>';
    for (var a = 0; a <= 180; a++) {
      var rad = a * Math.PI / 180, big = a % 10 === 0, mid = a % 5 === 0, len = big ? 16 : mid ? 10 : 5;
      b += V.line((cx + Math.cos(rad) * R).toFixed(1), (cy - Math.sin(rad) * R).toFixed(1), (cx + Math.cos(rad) * (R - len)).toFixed(1), (cy - Math.sin(rad) * (R - len)).toFixed(1), { w: big ? 1.6 : 1, stroke: '#2c4a8a' });
      if (big) {
        b += V.t((cx + Math.cos(rad) * (R - 28)).toFixed(1), (cy - Math.sin(rad) * (R - 28)).toFixed(1), String(a), { size: 11, fill: '#2c4a8a' });
        b += V.t((cx + Math.cos(rad) * (R - 48)).toFixed(1), (cy - Math.sin(rad) * (R - 48)).toFixed(1), String(180 - a), { size: 10, fill: C.berry });
      }
    }
    var arm = deg * Math.PI / 180;
    b += V.line(cx, cy, cx + R + 20, cy, { w: 4, stroke: C.ink }) + V.line(cx, cy, (cx + Math.cos(arm) * (R + 20)).toFixed(1), (cy - Math.sin(arm) * (R + 20)).toFixed(1), { w: 4, stroke: C.ink });
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="' + C.ink + '"/>';
    return V.svg(420, 215, b).replace('width="420"', 'width="620"'); // drawn large so the scale can be read
  };
  // nets of 3-D shapes (faces laid flat)
  V.net = function (name) {
    var s = 40, b = '', fill = C.skyLight;
    function sq(x, y, w, h) { return V.rect(x, y, w, h, { fill: fill, w: 2 }); }
    function tri(p) { return '<polygon points="' + p.map(function (q) { return q.join(','); }).join(' ') + '" fill="' + fill + '" stroke="' + C.ink + '" stroke-width="2"/>'; }
    if (name === 'cube') { b = sq(s, 0, s, s) + sq(0, s, s, s) + sq(s, s, s, s) + sq(2 * s, s, s, s) + sq(3 * s, s, s, s) + sq(s, 2 * s, s, s); return V.svg(4 * s + 4, 3 * s + 4, '<g transform="translate(2 2)">' + b + '</g>'); }
    if (name === 'cuboid') { var w = 60, d = 30, h = 40; b = sq(d, 0, w, d) + sq(0, d, d, h) + sq(d, d, w, h) + sq(d + w, d, d, h) + sq(2 * d + w, d, w, h) + sq(d, d + h, w, d); return V.svg(2 * d + 2 * w + 4, 2 * d + h + 4, '<g transform="translate(2 2)">' + b + '</g>'); }
    if (name === 'square-based pyramid') { var c = 60, o = 50; b = sq(c, c, o, o) + tri([[c, c], [c + o, c], [c + o / 2, c - 52]]) + tri([[c + o, c], [c + o, c + o], [c + o + 52, c + o / 2]]) + tri([[c, c + o], [c + o, c + o], [c + o / 2, c + o + 52]]) + tri([[c, c], [c, c + o], [c - 52, c + o / 2]]); return V.svg(2 * c + o, 2 * c + o, b); }
    if (name === 'triangular prism') { var L = 90, e = 44, th = 38; b = sq(e, 40, L, e) + sq(e, 40 + e, L, e) + sq(e, 40 + 2 * e, L, e) + tri([[e, 40], [e, 40 + e], [e - th, 40 + e / 2]]) + tri([[e + L, 40], [e + L, 40 + e], [e + L + th, 40 + e / 2]]); return V.svg(2 * e + L + 4, 40 + 3 * e + 40, b); }
    if (name === 'tetrahedron') { b = tri([[60, 104], [120, 104], [90, 52]]) + tri([[60, 104], [90, 52], [30, 52]]) + tri([[120, 104], [90, 52], [150, 52]]) + tri([[60, 104], [120, 104], [90, 156]]); return V.svg(180, 170, b); }
    return '';
  };
  // a cuboid built from centimetre cubes, l across, w deep, h high
  V.cubes = function (l, w, h) {
    var u = 26, dx = u * 0.55, dy = u * 0.4, b = '', W = l * u + w * dx + 20, H = h * u + w * dy + 20;
    function cube(x, y, z) {
      var px = 10 + x * u + z * dx, py = H - 10 - (y + 1) * u - z * dy;
      return '<polygon points="' + px + ',' + py + ' ' + (px + u) + ',' + py + ' ' + (px + u) + ',' + (py + u) + ' ' + px + ',' + (py + u) + '" fill="#cfe0fa" stroke="' + C.ink + '" stroke-width="1.2"/>' +
        '<polygon points="' + px + ',' + py + ' ' + (px + dx) + ',' + (py - dy) + ' ' + (px + u + dx) + ',' + (py - dy) + ' ' + (px + u) + ',' + py + '" fill="#e8f0fd" stroke="' + C.ink + '" stroke-width="1.2"/>' +
        '<polygon points="' + (px + u) + ',' + py + ' ' + (px + u + dx) + ',' + (py - dy) + ' ' + (px + u + dx) + ',' + (py + u - dy) + ' ' + (px + u) + ',' + (py + u) + '" fill="#a9c2ec" stroke="' + C.ink + '" stroke-width="1.2"/>';
    }
    for (var z = w - 1; z >= 0; z--) for (var y = 0; y < h; y++) for (var x = 0; x < l; x++) b += cube(x, y, z);
    return V.svg(Math.ceil(W), Math.ceil(H), b);
  };
  // the factors of n in pairs, found by trying every number (used to check factor questions)
  K.factorPairs = function (n) { var out = []; for (var i = 1; i * i <= n; i++) if (n % i === 0) out.push([i, n / i]); return out; };
  K.isPrime = function (n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  // exact decimal arithmetic on strings, using whole numbers of thousandths
  K.th = function (s) { return OM.parseScaled(String(s), 3); };
  K.fromTh = function (n) { var s = OM.fromScaled(n, 3).replace('−', '-'); return s.replace(/\.?0+$/, '') || '0'; };
  // pie chart from values (whole numbers); labels beside each slice's middle
  V.pieChart = function (labels, values, o) {
    o = o || {};
    var tot = values.reduce(function (s, x) { return s + x; }, 0), R = 110, cx = 150, cy = 140, a0 = -Math.PI / 2, b = '', cols = [C.leaf, C.amber, C.sky, C.berry, C.plum, '#c27c2c'];
    values.forEach(function (v, i) {
      var a1 = a0 + v / tot * 2 * Math.PI, large = a1 - a0 > Math.PI ? 1 : 0;
      b += '<path d="M' + cx + ' ' + cy + ' L' + (cx + R * Math.cos(a0)).toFixed(2) + ' ' + (cy + R * Math.sin(a0)).toFixed(2) + ' A' + R + ' ' + R + ' 0 ' + large + ' 1 ' + (cx + R * Math.cos(a1)).toFixed(2) + ' ' + (cy + R * Math.sin(a1)).toFixed(2) + ' Z" fill="' + cols[i % cols.length] + '" stroke="#fff" stroke-width="2"/>';
      var mid = (a0 + a1) / 2;
      b += V.t((cx + (R + 34) * Math.cos(mid)).toFixed(1), (cy + (R + 22) * Math.sin(mid)).toFixed(1), labels[i] + (o.show ? ' ' + o.show(v) : ''), { size: 13, weight: 'bold' });
      a0 = a1;
    });
    if (o.title) b += V.t(cx, 12, o.title, { size: 14, weight: 'bold' });
    return V.svg(330, 290, b);
  };
  // a circle with its radius or diameter drawn and labelled
  V.circleParts = function (part, val) {
    var b = '<circle cx="120" cy="110" r="90" fill="' + C.skyLight + '" stroke="' + C.ink + '" stroke-width="3"/><circle cx="120" cy="110" r="4" fill="' + C.ink + '"/>';
    if (part === 'radius') b += V.line(120, 110, 210, 110, { w: 4, stroke: C.berry }) + V.t(165, 96, val || 'radius', { size: 15, weight: 'bold', fill: C.berry });
    if (part === 'diameter') b += V.line(30, 110, 210, 110, { w: 4, stroke: C.berry }) + V.t(120, 96, val || 'diameter', { size: 15, weight: 'bold', fill: C.berry });
    if (part === 'circumference') b = b.replace('stroke="' + C.ink + '" stroke-width="3"', 'stroke="' + C.berry + '" stroke-width="6"') + V.t(120, 214, val || 'circumference', { size: 15, weight: 'bold', fill: C.berry });
    return V.svg(240, 225, b);
  };
  // a coordinate grid with all four quadrants, from -n to n
  V.grid4 = function (o) {
    var n = o.n || 6, s = 24, c = n * s + 30, W = 2 * n * s + 60, b = '';
    var X = function (x) { return c + x * s; }, Y = function (y) { return c - y * s; };
    for (var i = -n; i <= n; i++) {
      b += V.line(X(i), Y(-n), X(i), Y(n), { stroke: C.grid, w: 1 }) + V.line(X(-n), Y(i), X(n), Y(i), { stroke: C.grid, w: 1 });
      if (i && i % 2 === 0) b += V.t(X(i), Y(0) + 13, i < 0 ? '−' + (-i) : i, { size: 11 }) + V.t(X(0) - 11, Y(i), i < 0 ? '−' + (-i) : i, { size: 11 });
    }
    b += V.line(X(-n), Y(0), X(n), Y(0), { w: 2.5 }) + V.line(X(0), Y(-n), X(0), Y(n), { w: 2.5 }) + V.t(X(n) + 12, Y(0), 'x', { size: 14, weight: 'bold' }) + V.t(X(0), Y(n) - 12, 'y', { size: 14, weight: 'bold' });
    if (o.polygon) b += '<polygon points="' + o.polygon.map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' ') + '" fill="' + C.leafLight + '" stroke="' + C.leaf + '" stroke-width="3" fill-opacity=".8"/>';
    (o.points || []).forEach(function (p) { b += '<circle cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="5" fill="' + C.berry + '"/>' + (p.label ? V.t(X(p.x) + 11, Y(p.y) - 11, p.label, { size: 14, weight: 'bold', fill: C.berry }) : ''); });
    return V.svg(W, W, b);
  };
  // parallelogram or triangle with base and perpendicular height marked
  V.baseHeight = function (kind, base, height, unit) {
    var sc = Math.min(28, 260 / (base + 3)), B = base * sc, H = height * sc, off = kind === 'parallelogram' ? Math.min(3, base / 2) * sc : base * sc * 0.35, ox = 20, oy = 20 + H, b = '';
    var pts = kind === 'parallelogram' ? [[ox, oy], [ox + B, oy], [ox + B + off, oy - H], [ox + off, oy - H]] : [[ox, oy], [ox + B, oy], [ox + off, oy - H]];
    b += '<polygon points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="' + C.leafLight + '" stroke="' + C.ink + '" stroke-width="3"/>';
    b += V.line(ox + off, oy - H, ox + off, oy, { dash: '6 5', w: 2, stroke: C.berry }) + V.t(ox + off + 8, oy - H / 2, height + ' ' + unit, { anchor: 'start', size: 14, weight: 'bold', fill: C.berry });
    b += '<polyline points="' + (ox + off) + ',' + (oy - 10) + ' ' + (ox + off + 10) + ',' + (oy - 10) + ' ' + (ox + off + 10) + ',' + oy + '" fill="none" stroke="' + C.berry + '" stroke-width="1.5"/>';
    b += V.t(ox + B / 2, oy + 18, base + ' ' + unit, { size: 14, weight: 'bold' });
    return V.svg(Math.ceil(B + off + 80), Math.ceil(H + 50), b);
  };
  // ---------- pictures for Years 1 and 2 ----------
  // coins and notes, values in pence: 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000
  K.coinName = function (p) { return p >= 100 ? '£' + p / 100 : p + 'p'; };
  V.coins = function (list, o) {
    o = o || {};
    var x = 8, b = '', H = 96;
    list.forEach(function (p) {
      var name = K.coinName(p);
      if (p >= 500) {
        var col = p === 500 ? '#7fb6a8' : p === 1000 ? '#d58a54' : '#9b7cc4';
        b += '<rect x="' + x + '" y="18" width="118" height="62" rx="8" fill="' + col + '" stroke="' + C.ink + '" stroke-width="2"/><rect x="' + (x + 8) + '" y="26" width="102" height="46" rx="5" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>' +
          V.t(x + 59, 50, name, { size: 22, weight: 'bold', fill: '#fff' });
        x += 130; return;
      }
      var R = { 1: 20, 2: 26, 5: 18, 10: 27, 20: 23, 50: 30, 100: 27, 200: 32 }[p] || 24, cx = x + R, cy = 48;
      var fill = p <= 2 ? '#c8794a' : p === 100 ? '#e2b33c' : p === 200 ? '#cfd3d6' : '#d4d8dc', edge = p <= 2 ? '#8a4f2c' : p === 100 ? '#a47a17' : '#8b9196';
      if (p === 20 || p === 50) {
        var pts = []; for (var i = 0; i < 7; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / 7; pts.push((cx + R * Math.cos(a)).toFixed(1) + ',' + (cy + R * Math.sin(a)).toFixed(1)); }
        b += '<polygon points="' + pts.join(' ') + '" fill="' + fill + '" stroke="' + edge + '" stroke-width="2.5" stroke-linejoin="round"/>';
      } else b += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="' + fill + '" stroke="' + edge + '" stroke-width="2.5"/>';
      if (p === 200) b += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R - 8) + '" fill="#e2b33c" stroke="#a47a17" stroke-width="1.5"/>';
      b += V.t(cx, cy + 1, name, { size: R > 22 ? 15 : 13, weight: 'bold', fill: C.ink });
      x += 2 * R + 10;
    });
    return V.svg(Math.max(x, 60), H, b);
  };
  // tally marks in groups of five
  V.tally = function (n, o) {
    o = o || {};
    var b = '', x = 6, g = 0;
    for (var i = 0; i < n; i++) {
      var k = i % 5;
      if (k < 4) b += V.line(x + k * 11, 6, x + k * 11, 44, { w: 3 });
      else { b += V.line(x - 5, 38, x + 38, 12, { w: 3 }); x += 60; g++; }
    }
    if (n % 5) x += (n % 5) * 11 + 12;
    return V.svg(Math.max(x, 30), 50, b);
  };
  // common 2-D shapes by name
  var SHAPE2D = {
    triangle: [[50, 5], [95, 85], [5, 85]], square: [[10, 10], [90, 10], [90, 90], [10, 90]], rectangle: [[0, 20], [120, 20], [120, 80], [0, 80]],
    pentagon: [[50, 4], [96, 38], [78, 92], [22, 92], [4, 38]], hexagon: [[27, 6], [73, 6], [96, 50], [73, 94], [27, 94], [4, 50]],
    octagon: [[32, 4], [68, 4], [96, 32], [96, 68], [68, 96], [32, 96], [4, 68], [4, 32]]
  };
  V.shape2d = function (name, o) {
    o = o || {};
    var s = (o.size || 100) / 100, f = o.fill || C.skyLight, b;
    if (name === 'circle') b = '<circle cx="' + 55 * s + '" cy="' + 55 * s + '" r="' + 45 * s + '" fill="' + f + '" stroke="' + C.ink + '" stroke-width="3"/>';
    else if (name === 'semicircle') b = '<path d="M' + 10 * s + ' ' + 80 * s + ' A' + 45 * s + ' ' + 45 * s + ' 0 0 1 ' + 100 * s + ' ' + 80 * s + ' Z" fill="' + f + '" stroke="' + C.ink + '" stroke-width="3"/>';
    else b = '<polygon points="' + SHAPE2D[name].map(function (p) { return (p[0] * s + 10 * s).toFixed(1) + ',' + (p[1] * s + 10 * s).toFixed(1); }).join(' ') + '" fill="' + f + '" stroke="' + C.ink + '" stroke-width="3" stroke-linejoin="round"/>';
    if (o.sym) b += V.line(55 * s + (name === 'rectangle' ? 15 * s : 0), 2 * s, 55 * s + (name === 'rectangle' ? 15 * s : 0), 108 * s, { dash: '6 5', w: 2, stroke: C.berry });
    return V.svg(Math.ceil((name === 'rectangle' ? 140 : 110) * s), Math.ceil(110 * s), b);
  };
  K.SIDES = { triangle: 3, square: 4, rectangle: 4, pentagon: 5, hexagon: 6, octagon: 8, circle: 0, semicircle: 1 };
  // a rectangle split into parts (widths add to 1); shaded part indexes
  V.splitRect = function (widths, shaded, o) {
    o = o || {};
    var W = o.w || 200, H = o.h || 70, x = 4, b = '';
    widths.forEach(function (w, i) { b += V.rect(x, 4, W * w, H, { fill: shaded.indexOf(i) >= 0 ? C.amber : '#fff', stroke: C.ink, w: 2.5 }); x += W * w; });
    return V.svg(W + 8, H + 8, b);
  };
  // a row of small shapes, for patterns ('?' draws a question box)
  V.shapeRow = function (names) {
    var b = '', x = 4, cols = { circle: C.berry, square: C.sky, triangle: C.leaf, star: C.amber, rectangle: C.plum };
    names.forEach(function (n) {
      var c = cols[n] || C.amber;
      if (n === '?') b += V.rect(x + 2, 6, 40, 40, { fill: '#fff', stroke: C.soft, w: 2 }) + V.t(x + 22, 27, '?', { size: 24, weight: 'bold', fill: C.soft });
      else if (n === 'circle') b += '<circle cx="' + (x + 22) + '" cy="26" r="19" fill="' + c + '"/>';
      else if (n === 'square') b += V.rect(x + 3, 7, 38, 38, { fill: c, stroke: c, w: 1 });
      else if (n === 'triangle') b += '<polygon points="' + (x + 22) + ',5 ' + (x + 43) + ',45 ' + (x + 1) + ',45" fill="' + c + '"/>';
      else if (n === 'star') { var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 9 : 21; p.push((x + 22 + r * Math.cos(a)).toFixed(1) + ',' + (27 + r * Math.sin(a)).toFixed(1)); } b += '<polygon points="' + p.join(' ') + '" fill="' + c + '"/>'; }
      else b += V.rect(x + 1, 14, 42, 24, { fill: c, stroke: c, w: 1 });
      x += 50;
    });
    return V.svg(x + 4, 52, b);
  };
  // a child in the middle with four things around them; arrow shows which way they face (0 up, 1 right, 2 down, 3 left)
  V.turnScene = function (things, facing) {
    var pos = [[150, 26], [272, 120], [150, 214], [28, 120]], b = '';
    things.forEach(function (t, i) { b += V.rect(pos[i][0] - 52, pos[i][1] - 18, 104, 36, { fill: C.amberLight, stroke: C.wood || C.ink, w: 2 }) + V.t(pos[i][0], pos[i][1] + 1, t, { size: 15, weight: 'bold' }); });
    b += '<circle cx="150" cy="120" r="24" fill="' + C.leafLight + '" stroke="' + C.leaf + '" stroke-width="3"/>';
    if (facing !== undefined) { var a = [-90, 0, 90, 180][facing] * Math.PI / 180; b += '<line x1="150" y1="120" x2="' + (150 + 52 * Math.cos(a)).toFixed(1) + '" y2="' + (120 + 52 * Math.sin(a)).toFixed(1) + '" stroke="' + C.berry + '" stroke-width="5" stroke-linecap="round" marker-end="url(#tsArrow)"/>'; }
    return V.svg(330, 240, '<defs><marker id="tsArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="' + C.berry + '"/></marker></defs>' + b);
  };
  // ---------- pictures for Years 8 and 9 ----------
  // a graph on a grid. o.x = [min, max], o.y = [min, max]; o.gx / o.gy grid steps; o.fns: [{ f: function or [[x, y]...], color, label }];
  // o.points: [{ x, y, label }]; o.cross: draw points as crosses (scatter graphs); o.xlabel / o.ylabel axis titles
  var plotN = 0;
  V.plot = function (o) {
    var X0 = o.x[0], X1 = o.x[1], Y0 = o.y[0], Y1 = o.y[1], gx = o.gx || 1, gy = o.gy || 1;
    var L = o.ylabel ? 58 : 40, T = 14, R = 16, B = o.xlabel ? 50 : 32, PW = o.w || 330, PH = o.h || 280, id = 'pc' + (++plotN);
    var px = function (x) { return L + (x - X0) / (X1 - X0) * PW; }, py = function (y) { return T + (Y1 - y) / (Y1 - Y0) * PH; };
    var b = '<defs><clipPath id="' + id + '"><rect x="' + L + '" y="' + T + '" width="' + PW + '" height="' + PH + '"/></clipPath></defs>', i, v;
    var nx = Math.round((X1 - X0) / gx), ny = Math.round((Y1 - Y0) / gy), lx = o.lx || (nx > 12 ? 2 : 1), ly = o.ly || (ny > 12 ? 2 : 1);
    var fmtN = function (n) { n = Math.round(n * 1000) / 1000; return n < 0 ? '−' + (-n) : String(n); };
    for (i = 0; i <= nx; i++) { v = X0 + i * gx; b += V.line(px(v), T, px(v), T + PH, { stroke: C.grid, w: 1 }); if (i % lx === 0) b += V.t(px(v), T + PH + 16, fmtN(v), { size: 11 }); }
    for (i = 0; i <= ny; i++) { v = Y0 + i * gy; b += V.line(L, py(v), L + PW, py(v), { stroke: C.grid, w: 1 }); if (i % ly === 0) b += V.t(L - 8, py(v), fmtN(v), { size: 11, anchor: 'end' }); }
    var ax = X0 <= 0 && X1 >= 0 ? px(0) : L, ay = Y0 <= 0 && Y1 >= 0 ? py(0) : T + PH;
    b += V.line(L, ay, L + PW, ay, { w: 2.2 }) + V.line(ax, T, ax, T + PH, { w: 2.2 });
    if (o.xlabel) b += V.t(L + PW / 2, T + PH + 38, o.xlabel, { size: 13, weight: 'bold' });
    if (o.ylabel) b += '<text x="14" y="' + (T + PH / 2) + '" font-size="13" font-weight="bold" text-anchor="middle" transform="rotate(-90 14 ' + (T + PH / 2) + ')" fill="' + C.ink + '">' + o.ylabel + '</text>';
    var cols = [C.sky, C.berry, C.leaf, C.plum];
    (o.fns || []).forEach(function (fn, k) {
      var pts = [];
      if (typeof fn.f === 'function') { for (i = 0; i <= 160; i++) { var x = X0 + (X1 - X0) * i / 160, y = fn.f(x); if (isFinite(y) && y > Y0 - (Y1 - Y0) && y < Y1 + (Y1 - Y0)) pts.push(px(x).toFixed(1) + ',' + py(y).toFixed(1)); else if (pts.length) { b += '<polyline clip-path="url(#' + id + ')" points="' + pts.join(' ') + '" fill="none" stroke="' + (fn.color || cols[k % 4]) + '" stroke-width="3"/>'; pts = []; } } }
      else pts = fn.f.map(function (p) { return px(p[0]).toFixed(1) + ',' + py(p[1]).toFixed(1); });
      if (pts.length) b += '<polyline clip-path="url(#' + id + ')" points="' + pts.join(' ') + '" fill="none" stroke="' + (fn.color || cols[k % 4]) + '" stroke-width="3" stroke-linejoin="round"/>';
      if (fn.label) { var lp = fn.labelAt || [X1 - (X1 - X0) * 0.08, typeof fn.f === 'function' ? fn.f(X1 - (X1 - X0) * 0.08) : fn.f[fn.f.length - 1][1]]; b += V.t(px(lp[0]), py(lp[1]) - 12, fn.label, { size: 13, weight: 'bold', fill: fn.color || cols[k % 4] }); }
    });
    (o.points || []).forEach(function (p) {
      var x = px(p.x), y = py(p.y);
      b += o.cross ? '<path d="M' + (x - 5) + ' ' + (y - 5) + 'L' + (x + 5) + ' ' + (y + 5) + 'M' + (x + 5) + ' ' + (y - 5) + 'L' + (x - 5) + ' ' + (y + 5) + '" stroke="' + C.ink + '" stroke-width="2.2"/>' : '<circle cx="' + x + '" cy="' + y + '" r="5" fill="' + C.berry + '"/>';
      if (p.label) b += V.t(x + 10, y - 10, p.label, { size: 13, weight: 'bold', fill: C.berry, anchor: 'start' });
    });
    return V.svg(L + PW + R, T + PH + B, b);
  };
  // a two-set Venn diagram; n = { a, both, b, out }; any value may be '?' or a label
  V.venn = function (n, names) {
    names = names || ['A', 'B'];
    var b = V.rect(6, 6, 348, 210, { fill: '#fff', stroke: C.ink, w: 2 }) + V.t(22, 24, 'ξ', { size: 16, weight: 'bold' }) +
      '<circle cx="140" cy="112" r="80" fill="' + C.skyLight + '" fill-opacity=".75" stroke="' + C.sky + '" stroke-width="3"/><circle cx="220" cy="112" r="80" fill="' + C.amberLight + '" fill-opacity=".65" stroke="' + C.amber + '" stroke-width="3"/>' +
      V.t(84, 40, names[0], { size: 15, weight: 'bold', fill: C.sky }) + V.t(276, 40, names[1], { size: 15, weight: 'bold', fill: '#b86e10' }) +
      V.t(105, 114, String(n.a), { size: 20, weight: 'bold' }) + V.t(180, 114, String(n.both), { size: 20, weight: 'bold' }) + V.t(255, 114, String(n.b), { size: 20, weight: 'bold' }) + V.t(326, 198, String(n.out), { size: 20, weight: 'bold' });
    return V.svg(360, 222, b);
  };
  // two parallel lines cut by a transversal at a degrees. pos: 'ur' | 'ul' | 'll' | 'lr' at intersection 0 (top) or 1 (bottom)
  V.parallel = function (a, given, unknown) {
    var rad = a * Math.PI / 180, P = [[190, 70], [130, 70 + 120]], b = '';
    b += V.line(20, 70, 380, 70, { w: 3 }) + V.line(20, 190, 380, 190, { w: 3 });
    [[60, 70], [60, 190]].forEach(function (p) { b += '<path d="M' + (p[0] - 8) + ' ' + (p[1] - 7) + ' L' + p[0] + ' ' + p[1] + ' L' + (p[0] - 8) + ' ' + (p[1] + 7) + '" fill="none" stroke="' + C.ink + '" stroke-width="2"/>'; });
    var dx = Math.cos(rad), dy = Math.sin(rad), t1 = 110, t2 = 110;
    // transversal through both intersections (they are chosen to lie on one line)
    P[1][0] = P[0][0] - 120 / Math.tan(rad);
    b += V.line((P[0][0] + dx * t1).toFixed(1), (P[0][1] - dy * t1).toFixed(1), (P[1][0] - dx * t2).toFixed(1), (P[1][1] + dy * t2).toFixed(1), { w: 3 });
    var dirs = { ur: a / 2, ul: (a + 180) / 2, ll: 180 + a / 2, lr: (180 + a + 360) / 2 };
    function lab(pos, i, text, col) { var d = dirs[pos] * Math.PI / 180, r = 30, p = P[i]; return V.t((p[0] + r * Math.cos(d)).toFixed(1), (p[1] - r * Math.sin(d)).toFixed(1), text, { size: 14, weight: 'bold', fill: col }); }
    b += lab(given[0], given[1], given[2], C.ink) + lab(unknown[0], unknown[1], unknown[2], C.berry);
    return V.svg(400, 260, b);
  };
  // a right-angled triangle: o.w, o.h set the shape; o.base, o.height, o.hyp are side labels; o.angle labels the angle at the bottom right
  V.rightTri = function (o) {
    var w = o.w || 4, h = o.h || 3, sc = Math.min(240 / w, 170 / h), W = w * sc, H = h * sc, x0 = 50, y0 = 20 + H;
    var b = '<polygon points="' + x0 + ',' + y0 + ' ' + (x0 + W) + ',' + y0 + ' ' + x0 + ',' + (y0 - H) + '" fill="' + C.skyLight + '" stroke="' + C.ink + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<polyline points="' + x0 + ',' + (y0 - 14) + ' ' + (x0 + 14) + ',' + (y0 - 14) + ' ' + (x0 + 14) + ',' + y0 + '" fill="none" stroke="' + C.ink + '" stroke-width="1.8"/>';
    if (o.base) b += V.t(x0 + W / 2, y0 + 20, o.base, { size: 15, weight: 'bold' });
    if (o.height) b += V.t(x0 - 10, y0 - H / 2, o.height, { size: 15, weight: 'bold', anchor: 'end' });
    if (o.hyp) b += V.t(x0 + W / 2 + 14, y0 - H / 2 - 10, o.hyp, { size: 15, weight: 'bold', anchor: 'start' });
    if (o.angle) { var ang = Math.atan2(H, W); b += '<path d="M' + (x0 + W - 34) + ' ' + y0 + ' A34 34 0 0 1 ' + (x0 + W - 34 * Math.cos(ang)).toFixed(1) + ' ' + (y0 - 34 * Math.sin(ang)).toFixed(1) + '" fill="none" stroke="' + C.berry + '" stroke-width="2.5"/>' + V.t(x0 + W - 52, y0 - 12, o.angle, { size: 14, weight: 'bold', fill: C.berry }); }
    return V.svg(Math.ceil(x0 + W + 90), Math.ceil(y0 + 32), b);
  };
  // any number answer (whole, negative, decimal or fraction), marked exactly
  K.num = function (prompt, value, o) { o = o || {}; return base(prompt, { type: 'text', keys: 'algebra', placeholder: o.placeholder || 'e.g. −3 or 2/5', prefix: o.prefix, suffix: o.suffix }, { kind: 'solve', value: String(value), v: o.v || 'x', plain: true }, o); };
  K.mean = function (xs) { return xs.reduce(function (s, x) { return s + x; }, 0) / xs.length; };
})(typeof window !== 'undefined' ? window : globalThis);
