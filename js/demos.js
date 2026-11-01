/* Mayes Maths & More — animated worked examples ("Watch") for lessons and help pages, from Year 1 to GCSE.
   Each picture is an SVG that plays on a loop (SMIL animation, so it needs no script and works offline), e.g. the decimal
   point hopping one place at a time to put a number into standard form. The table at the end adds them to topics as extra
   lesson slides, straight after Pip's own explanation. */
(function (G) {
  'use strict';
  var OM = G.OM, V = OM.V, C = V.colors, t = V.t, line = V.line, rect = V.rect, svg = V.svg, fmt = OM.fmt;
  var D = OM.demo = {};
  var SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  function sup(n) { return String(n).replace('-', '⁻').replace(/\d/g, function (d) { return SUPD[d]; }); }
  function neg(n) { return n < 0 ? '−' + fmt(-n) : fmt(n); }
  function r3(x) { return Math.round(x * 1000) / 1000; }
  function dec(x) { return neg(+x.toFixed(6)); }

  // ---------- timeline helpers: everything loops every T seconds ----------
  function tl(T, pts) {
    pts = pts.slice().sort(function (a, b) { return a[0] - b[0]; });
    if (pts[0][0] > 0) pts.unshift([0, pts[0][1]]);
    if (pts[pts.length - 1][0] < T) pts.push([T, pts[pts.length - 1][1]]);
    return ' dur="' + T + 's" repeatCount="indefinite" keyTimes="' + pts.map(function (p) { return r3(Math.min(1, Math.max(0, p[0] / T))); }).join(';') + '" values="' + pts.map(function (p) { return p[1]; }).join(';') + '"';
  }
  // visible from t0 (fading in) until t1 (default: near the end of the loop)
  function show(T, t0, body, t1) { var e = t1 === undefined ? T - 0.6 : t1; return '<g opacity="0"><animate attributeName="opacity"' + tl(T, [[0, 0], [t0, 0], [t0 + 0.3, 1], [e, 1], [e + 0.3, 0]]) + '/>' + body + '</g>'; }
  // visible at the start, fading out at t0
  function hide(T, t0, body) { return '<g><animate attributeName="opacity"' + tl(T, [[0, 1], [t0, 1], [t0 + 0.3, 0], [T - 0.3, 0], [T, 1]]) + '/>' + body + '</g>'; }
  // pts: [[time, x, y], ...]
  function move(T, pts, body) { return '<g><animateTransform attributeName="transform" type="translate"' + tl(T, pts.map(function (p) { return [p[0], p[1] + ' ' + p[2]]; })) + '/>' + body + '</g>'; }
  function attr(T, name, pts) { return '<animate attributeName="' + name + '"' + tl(T, pts) + '/>'; }
  function circle(x, y, r, o) { o = o || {}; return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + (o.fill || C.ink) + '" stroke="' + (o.stroke || 'none') + '" stroke-width="' + (o.w || 2) + '"/>'; }
  function arc(x1, x2, y, h, col) { return '<path d="M' + x1 + ' ' + y + ' Q' + (x1 + x2) / 2 + ' ' + (y - h) + ' ' + x2 + ' ' + y + '" fill="none" stroke="' + (col || C.berry) + '" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M' + (x2 - (x2 > x1 ? 7 : -7)) + ' ' + (y - 7) + ' L' + x2 + ' ' + y + ' L' + (x2 - (x2 > x1 ? 9 : -9)) + ' ' + (y + 1) + '" fill="none" stroke="' + (col || C.berry) + '" stroke-width="2.5" stroke-linecap="round"/>'; }
  function poly(pts, o) { o = o || {}; return '<polygon points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="' + (o.fill || C.skyLight) + '" stroke="' + (o.stroke || C.sky) + '" stroke-width="2.5" stroke-linejoin="round"' + (o.dash ? ' stroke-dasharray="6 5"' : '') + '/>'; }

  // ---------- standard form: the decimal point hops one place at a time ----------
  D.stdForm = function (s) {
    var digits = s.replace('.', '').split(''), small = s.indexOf('0.') === 0, first = 0, last = digits.length - 1, i;
    while (digits[first] === '0') first++;
    while (digits[last] === '0' && last > first) last--;
    var start = small ? 1 : digits.length, target = first + 1, hops = Math.abs(target - start), power = start - target;
    var W = 40, x0 = 30, y = 74, hop = 0.9, t0 = 1.6, tEnd = t0 + hops * hop + 0.4, T = tEnd + 3.2, b = '';
    var mant = digits[first] + (last > first ? '.' + digits.slice(first + 1, last + 1).join('') : '');
    b += t(x0 + digits.length * W / 2, 22, (small ? s : fmt(+s)) + ' in standard form', { size: 16, weight: 'bold' });
    digits.forEach(function (d, k) {
      var spare = small ? k < first : k > last, cell = rect(x0 + k * W + 2, y - 20, W - 4, 40, { fill: '#fff', stroke: C.grid, rx: 6 }) + t(x0 + k * W + W / 2, y, d, { size: 24, weight: 'bold', fill: k === first ? C.sky : C.ink });
      b += spare ? '<g>' + cell + '<animate attributeName="opacity"' + tl(T, [[0, 1], [tEnd, 1], [tEnd + 0.4, 0.25], [T - 0.3, 0.25], [T, 1]]) + '/></g>' : cell;
    });
    for (i = 0; i < hops; i++) {
      var a = x0 + (start + (target > start ? i : -i)) * W, z = a + (target > start ? W : -W);
      b += show(T, t0 + i * hop + 0.3, arc(a, z, y + 26, -22, C.berry) + t((a + z) / 2, y + 52, String(i + 1), { size: 15, weight: 'bold', fill: C.berry }));
    }
    var pts = [[0, 0, 0], [t0, 0, 0]];
    for (i = 0; i < hops; i++) pts.push([t0 + i * hop + 0.55, (target > start ? 1 : -1) * W * (i + 1), 0], [t0 + (i + 1) * hop, (target > start ? 1 : -1) * W * (i + 1), 0]);
    pts.push([T - 0.3, (target - start) * W, 0], [T, 0, 0]);
    b += move(T, pts, circle(x0 + start * W, y + 22, 6, { fill: C.berry }));
    b += show(T, 0.4, t(x0 + start * W, y + 44, small ? '' : 'point', { size: 12, fill: C.soft }), t0);
    b += show(T, tEnd, t(x0 + digits.length * W / 2, y + 92, mant + ' × 10' + sup(power), { size: 26, weight: 'bold', fill: C.sky }) +
      t(x0 + digits.length * W / 2, y + 120, 'The point moved ' + hops + ' place' + (hops === 1 ? '' : 's') + ' to the ' + (power > 0 ? 'left, so the power is ' + power : 'right, so the power is −' + (-power)) + '.', { size: 14, fill: C.soft }));
    return svg(Math.max(x0 * 2 + digits.length * W, 420), y + 136, b);
  };

  // ---------- × and ÷ by 10, 100, 1,000: the digits slide across the place-value columns ----------
  var PV = { 6: 'M', 5: 'HTh', 4: 'TTh', 3: 'Th', 2: 'H', 1: 'T', 0: 'O', '-1': 't', '-2': 'h', '-3': 'th' };
  D.slideDigits = function (num, k, op) {
    var parts = num.split('.'), ds = [], sh = op === 'mul' ? k : -k, i;
    parts[0].split('').forEach(function (d, j) { ds.push({ d: d, p: parts[0].length - 1 - j }); });
    (parts[1] || '').split('').forEach(function (d, j) { ds.push({ d: d, p: -1 - j }); });
    ds = ds.filter(function (x, j) { return !(x.d === '0' && x.p > 0 && j === 0); });
    var ps = []; ds.forEach(function (x) { ps.push(x.p, x.p + sh); }); ps.push(0, -1);
    var hi = Math.max.apply(null, ps), lo = Math.min.apply(null, ps), W = 48, SW = Math.max((hi - lo + 1) * W + 40, 540), x0 = (SW - (hi - lo + 1) * W) / 2, top = 40, T = 7, b = '';
    var X = function (p) { return x0 + (hi - p) * W; };
    for (i = hi; i >= lo; i--) b += rect(X(i), top, W, 74, { fill: i >= 0 ? '#fff' : C.amberLight, stroke: C.grid, w: 1.5 }) + t(X(i) + W / 2, top + 14, PV[i], { size: 13, weight: 'bold', fill: C.soft });
    b += circle(X(0) + W, top + 60, 5, { fill: C.ink });
    ds.forEach(function (x) { b += move(T, [[0, 0, 0], [1.4, 0, 0], [3, -sh * W, 0], [T - 0.4, -sh * W, 0], [T, 0, 0]], t(X(x.p) + W / 2, top + 48, x.d, { size: 26, weight: 'bold', fill: C.sky })); });
    var finals = ds.map(function (x) { return x.p + sh; }), fmin = Math.min.apply(null, finals), fmax = Math.max.apply(null, finals), zeros = [];
    for (i = fmin - 1; i >= 0; i--) zeros.push(i);
    if (fmax < 0) for (i = 0; i > fmax; i--) if (finals.indexOf(i) < 0) zeros.push(i);
    zeros.forEach(function (p) { b += show(T, 3.2, t(X(p) + W / 2, top + 48, '0', { size: 26, weight: 'bold', fill: C.berry })); });
    var res = (+num * Math.pow(10, sh)).toFixed(Math.max(0, -Math.min(fmin, 0)));
    b += show(T, 3.6, t(SW / 2, top + 106, fmt(+num) + (op === 'mul' ? ' × ' : ' ÷ ') + fmt(Math.pow(10, k)) + ' = ' + fmt(+res), { size: 20, weight: 'bold' }));
    b += show(T, 0.3, t(SW / 2, 18, 'Every digit moves ' + k + ' place' + (k > 1 ? 's' : '') + ' to the ' + (op === 'mul' ? 'left' : 'right') + '. The decimal point stays still.', { size: 14, fill: C.soft }));
    return svg(SW, top + 124, b);
  };

  // ---------- jumps on a number line ----------
  D.jumps = function (o) {
    var lo = o.lo, hi = o.hi, n = hi - lo, W = Math.min(40, 460 / n), x0 = 24, y = 96, every = n > 30 ? 10 : n > 12 ? 5 : 1, T = 2.4 + o.steps.length * 1.3 + 2.6, b = '', i;
    var X = function (v) { return x0 + (v - lo) * W; };
    b += line(X(lo) - 8, y, X(hi) + 8, y, { w: 2.5 });
    for (i = lo; i <= hi; i++) b += line(X(i), y - (i % every === 0 ? 8 : 4), X(i), y + (i % every === 0 ? 8 : 4), { w: i === 0 ? 3 : 1.5 }) + (i % every === 0 ? t(X(i), y + 22, neg(i), { size: 13, weight: i === 0 ? 'bold' : 'normal' }) : '');
    var cur = o.start;
    b += show(T, 0.4, circle(X(cur), y, 7, { fill: C.sky }) + t(X(cur), y - 20, 'start', { size: 12, fill: C.sky }), 1.6);
    o.steps.forEach(function (d, k) {
      var nx = cur + d, h = Math.min(60, 18 + Math.abs(d) * W * 0.35);
      b += show(T, 1.6 + k * 1.3, arc(X(cur), X(nx), y - 4, h, k % 2 ? C.plum : C.berry) + t((X(cur) + X(nx)) / 2, y - 4 - h / 2 - 12, (d > 0 ? '+' : '−') + Math.abs(d), { size: 15, weight: 'bold', fill: k % 2 ? C.plum : C.berry }));
      cur = nx;
    });
    var tEnd = 1.6 + o.steps.length * 1.3;
    b += show(T, tEnd, circle(X(cur), y, 8, { fill: C.leaf }) + t(x0 + n * W / 2, y + 52, o.say || (neg(o.start) + o.steps.map(function (d) { return d < 0 ? ' − ' + -d : ' + ' + d; }).join('') + ' = ' + neg(cur)), { size: 20, weight: 'bold', fill: C.leaf }));
    return svg(x0 * 2 + n * W, y + 66, b);
  };

  // ---------- rounding: which end of the number line is nearer? ----------
  D.round = function (v, step, dp) {
    var q = v / step, lo = Math.floor(q + 1e-9) * step, hi = lo + step, mid = lo + step / 2, up = v >= mid - 1e-9, to = up ? hi : lo, L = 60, R = 420, y = 80, T = 7, b = '';
    var X = function (x) { return L + (x - lo) / step * (R - L); }, lab = function (x) { return dp ? x.toFixed(dp) : fmt(Math.round(x)); };
    b += line(L, y, R, y, { w: 2.5 }) + line(L, y - 10, L, y + 10, { w: 2.5 }) + line(R, y - 10, R, y + 10, { w: 2.5 }) + line(X(mid), y - 6, X(mid), y + 6, { w: 2, stroke: C.soft }) +
      t(L, y + 26, lab(lo), { size: 15, weight: 'bold' }) + t(R, y + 26, lab(hi), { size: 15, weight: 'bold' }) + t(X(mid), y + 26, lab(mid) + (dp ? '' : '') , { size: 12, fill: C.soft }) + t(X(mid), y + 40, 'halfway', { size: 11, fill: C.soft });
    b += show(T, 0.4, circle(X(v), y, 7, { fill: C.sky }) + t(X(v), y - 22, dp ? v.toFixed(dp + 1) : fmt(v), { size: 15, weight: 'bold', fill: C.sky }));
    b += show(T, 1.8, arc(X(v), X(to), y - 6, 34, C.berry));
    b += show(T, 3, t((L + R) / 2, y + 66, (dp ? v.toFixed(dp + 1) : fmt(v)) + ' is ' + (Math.abs(v - mid) < 1e-9 ? 'exactly halfway, so it rounds up' : 'nearer to ' + lab(to)) + ': it rounds to ' + lab(to) + '.', { size: 16, weight: 'bold', fill: C.berry }));
    return svg(480, y + 84, b);
  };

  // ---------- lines of working appearing one at a time, with what was done to each ----------
  D.steps = function (lines, notes, title) {
    var T = 1.2 + lines.length * 1.6 + 2.4, b = '', top = title ? 46 : 26;
    if (title) b += t(240, 18, title, { size: 14, fill: C.soft });
    lines.forEach(function (s, k) {
      b += show(T, 0.4 + k * 1.6, t(190, top + k * 40, s, { size: 22, weight: k === lines.length - 1 ? 'bold' : 'normal', fill: k === lines.length - 1 ? C.leaf : C.ink }) +
        (notes[k] ? t(330, top + k * 40, notes[k], { size: 14, fill: C.berry, anchor: 'start' }) : ''));
    });
    return svg(500, top + lines.length * 40, b);
  };

  // ---------- gradient: up m for every 1 across ----------
  D.gradient = function (m, c) {
    var xs = 5, ymax = c + m * xs, S = 240 / Math.max(xs, ymax), L = 50, B = 20 + ymax * S, T = 8, b = '', i;
    var X = function (x) { return L + x * S; }, Y = function (y) { return B - y * S; };
    for (i = 0; i <= xs; i++) b += line(X(i), Y(0), X(i), Y(ymax), { stroke: C.grid, w: 1 }) + t(X(i), B + 16, String(i), { size: 12 });
    for (i = 0; i <= ymax; i++) b += line(X(0), Y(i), X(xs), Y(i), { stroke: C.grid, w: 1 }) + (i % (ymax > 12 ? 2 : 1) === 0 ? t(L - 12, Y(i), String(i), { size: 12 }) : '');
    b += line(X(0), Y(0), X(xs), Y(0), { w: 2 }) + line(X(0), Y(0), X(0), Y(ymax), { w: 2 });
    var len = Math.hypot(xs * S, m * xs * S);
    b += '<line x1="' + X(0) + '" y1="' + Y(c) + '" x2="' + X(xs) + '" y2="' + Y(ymax) + '" stroke="' + C.sky + '" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="' + len + '">' + attr(T, 'stroke-dashoffset', [[0, len], [0.3, len], [1.8, 0], [T - 0.3, 0], [T, len]]) + '</line>';
    b += show(T, 2, circle(X(0), Y(c), 6, { fill: C.plum }) + t(X(0) + 12, Y(c) + 2, 'crosses the y-axis at ' + c, { size: 13, fill: C.plum, anchor: 'start', weight: 'bold' }));
    b += show(T, 3.4, line(X(1), Y(c + m), X(2), Y(c + m), { stroke: C.berry, w: 3 }) + t(X(1.5), Y(c + m) + 14, '1 across', { size: 13, fill: C.berry, weight: 'bold' }));
    b += show(T, 4.6, line(X(2), Y(c + m), X(2), Y(c + 2 * m), { stroke: C.leaf, w: 3 }) + t(X(2) + 8, Y(c + 1.5 * m), m + ' up', { size: 13, fill: C.leaf, weight: 'bold', anchor: 'start' }));
    var rx = X(xs) + 30;
    b += show(T, 5.6, t(rx, 40, 'y = ' + (m === 1 ? '' : m) + 'x' + (c ? ' + ' + c : ''), { size: 22, weight: 'bold', anchor: 'start', fill: C.sky }) + t(rx, 72, 'gradient = ' + m, { size: 16, anchor: 'start', fill: C.leaf, weight: 'bold' }) + t(rx, 98, 'y-intercept = ' + c, { size: 16, anchor: 'start', fill: C.plum, weight: 'bold' }));
    return svg(rx + 190, B + 30, b);
  };

  // ---------- expanding double brackets with a grid ----------
  D.expandGrid = function (a, b2) {
    var T = 8.5, s = '', x0 = 120, y0 = 66, w = [90, 70], h = [70, 50];
    var cells = [['x²', 0, 0], [a + 'x', 1, 0], [b2 + 'x', 0, 1], [String(a * b2), 1, 1]];
    s += t(240, 18, '(x + ' + a + ')(x + ' + b2 + ')', { size: 20, weight: 'bold' });
    s += t(x0 + w[0] / 2, y0 - 12, 'x', { size: 18, weight: 'bold', fill: C.sky }) + t(x0 + w[0] + w[1] / 2, y0 - 12, '+' + a, { size: 18, weight: 'bold', fill: C.sky }) +
      t(x0 - 16, y0 + h[0] / 2, 'x', { size: 18, weight: 'bold', fill: C.berry }) + t(x0 - 18, y0 + h[0] + h[1] / 2, '+' + b2, { size: 18, weight: 'bold', fill: C.berry });
    s += rect(x0, y0, w[0] + w[1], h[0] + h[1], { fill: '#fff' }) + line(x0 + w[0], y0, x0 + w[0], y0 + h[0] + h[1]) + line(x0, y0 + h[0], x0 + w[0] + w[1], y0 + h[0]);
    cells.forEach(function (c, k) { var cx = x0 + (c[1] ? w[0] + w[1] / 2 : w[0] / 2), cy = y0 + (c[2] ? h[0] + h[1] / 2 : h[0] / 2); s += show(T, 0.8 + k * 1.2, rect(cx - (c[1] ? w[1] : w[0]) / 2 + 3, cy - (c[2] ? h[1] : h[0]) / 2 + 3, (c[1] ? w[1] : w[0]) - 6, (c[2] ? h[1] : h[0]) - 6, { fill: [C.skyLight, C.amberLight, C.amberLight, C.leafLight][k], stroke: 'none', rx: 4 }) + t(cx, cy, c[0], { size: 20, weight: 'bold' })); });
    s += show(T, 5.8, t(240, y0 + h[0] + h[1] + 34, '= x² + ' + a + 'x + ' + b2 + 'x + ' + a * b2, { size: 17 }));
    s += show(T, 6.8, t(240, y0 + h[0] + h[1] + 62, '= x² + ' + (a + b2) + 'x + ' + a * b2, { size: 20, weight: 'bold', fill: C.leaf }));
    return svg(480, y0 + h[0] + h[1] + 78, s);
  };

  // ---------- a percentage of a 100 square ----------
  D.percent = function (p) {
    var S = 22, x0 = 20, y0 = 20, T = 2 + p * 0.04 + 3, b = '', i;
    for (i = 0; i < 100; i++) { var x = x0 + (i % 10) * S, y = y0 + Math.floor(i / 10) * S, cell = rect(x + 1, y + 1, S - 2, S - 2, { fill: C.amber, stroke: 'none', rx: 2 });
      b += rect(x, y, S, S, { fill: '#fff', stroke: C.grid, w: 1 }); if (i < p) b += show(T, 0.8 + i * 0.04, cell); }
    var tx = x0 + 10 * S + 30;
    b += show(T, 1 + p * 0.04, t(tx, 80, p + ' out of 100', { size: 18, weight: 'bold', anchor: 'start' }) + t(tx, 112, '= ' + p + '%', { size: 26, weight: 'bold', fill: C.berry, anchor: 'start' }) +
      t(tx, 144, '= ' + (p / 100).toFixed(2), { size: 18, anchor: 'start' }) + t(tx, 174, 'Per cent means "out of 100".', { size: 13, fill: C.soft, anchor: 'start' }));
    return svg(x0 + 10 * S + 230, y0 + 10 * S + 20, b);
  };

  // ---------- equivalent fractions: split every part ----------
  D.equivFrac = function (a, d, k) {
    var W = 360, x0 = 60, y0 = 40, H = 54, T = 7.5, b = '', i, j;
    for (i = 0; i < d; i++) b += rect(x0 + i * W / d, y0, W / d, H, { fill: i < a ? C.skyLight : '#fff', stroke: C.ink, w: 2.5 });
    b += t(x0 - 30, y0 + H / 2, a + '/' + d, { size: 20, weight: 'bold', fill: C.sky });
    for (i = 0; i < d; i++) for (j = 1; j < k; j++) b += show(T, 1.4 + i * 0.4, line(x0 + i * W / d + j * W / d / k, y0, x0 + i * W / d + j * W / d / k, y0 + H, { stroke: C.berry, w: 2, dash: '5 4' }));
    b += show(T, 1.6 + d * 0.4, t(x0 + W / 2, y0 + H + 30, 'Split every part into ' + k + ': now ' + a * k + ' of ' + d * k + ' equal parts are shaded.', { size: 14, fill: C.soft }) +
      t(x0 + W / 2, y0 + H + 64, a + '/' + d + ' = ' + a * k + '/' + d * k, { size: 26, weight: 'bold', fill: C.berry }));
    return svg(W + x0 + 30, y0 + H + 82, b);
  };

  // ---------- arrays: rows of dots ----------
  D.array = function (r, c) {
    var S = 34, x0 = 40, y0 = 30, T = 1.5 + r * 0.7 + 3, b = '', i, j;
    for (i = 0; i < r; i++) { var row = ''; for (j = 0; j < c; j++) row += circle(x0 + j * S + S / 2, y0 + i * S + S / 2, 11, { fill: [C.sky, C.berry, C.leaf, C.amber, C.plum][i % 5] });
      b += show(T, 0.6 + i * 0.7, row + t(x0 + c * S + 22, y0 + i * S + S / 2, String((i + 1) * c), { size: 14, fill: C.soft })); }
    b += show(T, 1 + r * 0.7, t(x0 + c * S / 2, y0 + r * S + 30, r + ' rows of ' + c + ': ' + r + ' × ' + c + ' = ' + r * c, { size: 20, weight: 'bold' }));
    return svg(Math.max(x0 + c * S + 60, 300), y0 + r * S + 48, b);
  };

  // ---------- the grid method for multiplying ----------
  function split(n) { var s = String(n), out = []; s.split('').forEach(function (d, i) { if (d !== '0') out.push(+d * Math.pow(10, s.length - 1 - i)); }); return out; }
  D.areaMult = function (a, b2) {
    var A = split(a), B = split(b2), x0 = 90, y0 = 52, cw = 110, ch = 52, T = 2 + A.length * B.length * 1 + 4, s = '', k = 0;
    s += t(240, 20, fmt(a) + ' × ' + fmt(b2), { size: 20, weight: 'bold' });
    A.forEach(function (v, i) { s += t(x0 + i * cw + cw / 2, y0 - 12, fmt(v), { size: 17, weight: 'bold', fill: C.sky }); });
    B.forEach(function (v, j) { s += t(x0 - 26, y0 + j * ch + ch / 2, fmt(v), { size: 17, weight: 'bold', fill: C.berry }); });
    B.forEach(function (w, j) { A.forEach(function (v, i) { s += rect(x0 + i * cw, y0 + j * ch, cw, ch, { fill: '#fff' }) + show(T, 1 + k++ * 1, t(x0 + i * cw + cw / 2, y0 + j * ch + ch / 2, fmt(v * w), { size: 18, weight: 'bold' })); }); });
    var parts = []; B.forEach(function (w) { A.forEach(function (v) { parts.push(v * w); }); });
    s += show(T, 1.4 + k, t(240, y0 + B.length * ch + 32, parts.map(fmt).join(' + ') + ' = ' + fmt(a * b2), { size: 18, weight: 'bold', fill: C.leaf }));
    return svg(Math.max(480, x0 + A.length * cw + 30), y0 + B.length * ch + 50, s);
  };

  // ---------- bars levelling out to the mean ----------
  D.levelMean = function (vals) {
    var n = vals.length, sum = vals.reduce(function (a, b) { return a + b; }, 0), mean = sum / n, mx = Math.max.apply(null, vals), S = 160 / mx, B = 190, x0 = 40, bw = 50, gap = 24, T = 8, b = '';
    b += line(x0 - 10, B, x0 + n * (bw + gap), B, { w: 2 });
    vals.forEach(function (v, i) { var x = x0 + i * (bw + gap);
      b += '<rect x="' + x + '" width="' + bw + '" y="' + (B - v * S) + '" height="' + v * S + '" fill="' + C.skyLight + '" stroke="' + C.sky + '" stroke-width="2">' + attr(T, 'y', [[0, B - v * S], [1.6, B - v * S], [3.4, B - mean * S], [T - 0.4, B - mean * S], [T, B - v * S]]) + attr(T, 'height', [[0, v * S], [1.6, v * S], [3.4, mean * S], [T - 0.4, mean * S], [T, v * S]]) + '</rect>';
      b += hide(T, 1.4, t(x + bw / 2, B - v * S - 12, String(v), { size: 15, weight: 'bold' })); });
    b += show(T, 3.6, line(x0 - 10, B - mean * S, x0 + n * (bw + gap), B - mean * S, { stroke: C.berry, w: 2.5, dash: '7 5' }) + t(x0 + n * (bw + gap) + 4, B - mean * S, 'mean ' + dec(mean), { size: 15, weight: 'bold', fill: C.berry, anchor: 'start' }));
    b += show(T, 4.4, t(x0 + n * (bw + gap) / 2, B + 28, 'Total ' + sum + ' shared equally between ' + n + ': ' + sum + ' ÷ ' + n + ' = ' + dec(mean), { size: 15, weight: 'bold' }));
    return svg(x0 + n * (bw + gap) + 110, B + 44, b);
  };

  // ---------- a bar model for sharing in a ratio ----------
  D.ratioBar = function (a, b2, total, names) {
    names = names || ['A', 'B']; var n = a + b2, one = total / n, W = 400, x0 = 60, y0 = 50, H = 44, pw = W / n, T = 3 + n * 0.25 + 4, s = '', i;
    s += t(x0 + W / 2, 20, 'Share ' + fmt(total) + ' in the ratio ' + a + ' : ' + b2, { size: 17, weight: 'bold' });
    s += t(x0 - 10, y0 + H / 2, names[0], { size: 16, weight: 'bold', fill: C.sky, anchor: 'end' }) + t(x0 - 10, y0 + H + 20 + H / 2, names[1], { size: 16, weight: 'bold', fill: C.berry, anchor: 'end' });
    for (i = 0; i < a; i++) s += show(T, 0.4 + i * 0.25, rect(x0 + i * pw, y0, pw, H, { fill: C.skyLight, stroke: C.sky }) + show(T, 2.8 + n * 0.25, t(x0 + i * pw + pw / 2, y0 + H / 2, dec(one), { size: 15, weight: 'bold' })));
    for (i = 0; i < b2; i++) s += show(T, 0.4 + (a + i) * 0.25, rect(x0 + i * pw, y0 + H + 20, pw, H, { fill: C.berryLight, stroke: C.berry }) + show(T, 2.8 + n * 0.25, t(x0 + i * pw + pw / 2, y0 + H + 20 + H / 2, dec(one), { size: 15, weight: 'bold' })));
    s += show(T, 1.2 + n * 0.25, t(x0 + W / 2, y0 + 2 * H + 52, n + ' parts altogether. One part = ' + fmt(total) + ' ÷ ' + n + ' = ' + dec(one) + '.', { size: 15 }));
    s += show(T, 3.4 + n * 0.25, t(x0 + W / 2, y0 + 2 * H + 82, names[0] + ': ' + a + ' × ' + dec(one) + ' = ' + dec(a * one) + ';  ' + names[1] + ': ' + b2 + ' × ' + dec(one) + ' = ' + dec(b2 * one), { size: 17, weight: 'bold', fill: C.leaf }));
    return svg(x0 + W + 30, y0 + 2 * H + 100, s);
  };

  // ---------- angles on a straight line ----------
  D.straightAngle = function (a) {
    var cx = 230, cy = 160, L = 170, T = 8, b = '', rad = function (d) { return d * Math.PI / 180; };
    var ex = cx + L * Math.cos(rad(a)), ey = cy - L * Math.sin(rad(a));
    b += line(cx - L, cy, cx + L, cy, { w: 3 });
    b += '<g><animateTransform attributeName="transform" type="rotate"' + tl(T, [[0, '0 ' + cx + ' ' + cy], [0.6, '0 ' + cx + ' ' + cy], [2.4, -a + ' ' + cx + ' ' + cy], [T - 0.4, -a + ' ' + cx + ' ' + cy], [T, '0 ' + cx + ' ' + cy]]) + '/>' + line(cx, cy, cx + L, cy, { w: 3, stroke: C.sky }) + '</g>';
    var r1 = 46, r2 = 62, p = function (r, d) { return (cx + r * Math.cos(rad(d))) + ' ' + (cy - r * Math.sin(rad(d))); };
    b += show(T, 2.6, '<path d="M' + p(r1, 0) + ' A' + r1 + ' ' + r1 + ' 0 0 0 ' + p(r1, a) + '" fill="none" stroke="' + C.sky + '" stroke-width="3"/>' + t(cx + 80 * Math.cos(rad(a / 2)), cy - 80 * Math.sin(rad(a / 2)), a + '°', { size: 18, weight: 'bold', fill: C.sky }));
    b += show(T, 3.8, '<path d="M' + p(r2, a) + ' A' + r2 + ' ' + r2 + ' 0 0 0 ' + p(r2, 180) + '" fill="none" stroke="' + C.berry + '" stroke-width="3"/>' + t(cx + 96 * Math.cos(rad((a + 180) / 2)), cy - 96 * Math.sin(rad((a + 180) / 2)), '?', { size: 20, weight: 'bold', fill: C.berry }));
    b += show(T, 5, t(cx, cy + 34, 'Angles on a straight line add up to 180°: ? = 180° − ' + a + '° = ' + (180 - a) + '°', { size: 15, weight: 'bold' }));
    void ex; void ey;
    return svg(460, cy + 50, b);
  };

  // ---------- transformations on a grid ----------
  function grid(nx, ny, S, x0, y0) { var b = '', i; for (i = 0; i <= nx; i++) b += line(x0 + i * S, y0, x0 + i * S, y0 + ny * S, { stroke: C.grid, w: 1 }); for (i = 0; i <= ny; i++) b += line(x0, y0 + i * S, x0 + nx * S, y0 + i * S, { stroke: C.grid, w: 1 }); return b; }
  var TRI = [[0, 0], [2, 0], [0, 2]];
  D.translate = function (dx, dy) {
    var S = 30, x0 = 20, y0 = 20, nx = 12, ny = 8, ox = 1, oy = 6, T = 8, b = grid(nx, ny, S, x0, y0);
    var P = function (q, sx, sy) { return [x0 + (q[0] + ox + (sx || 0)) * S, y0 + (oy - q[1] - (sy || 0)) * S]; };
    b += poly(TRI.map(function (q) { return P(q); }), { fill: C.skyLight, stroke: C.sky });
    b += move(T, [[0, 0, 0], [1, 0, 0], [2.6, dx * S, 0], [3.2, dx * S, 0], [4.8, dx * S, -dy * S], [T - 0.4, dx * S, -dy * S], [T, 0, 0]], poly(TRI.map(function (q) { return P(q); }), { fill: C.berryLight, stroke: C.berry }));
    var c = P([0, 0]);
    b += show(T, 2.6, line(c[0], c[1], c[0] + dx * S, c[1], { stroke: C.berry, w: 3 }) + t(c[0] + dx * S / 2, c[1] + 16, dx + ' right', { size: 13, fill: C.berry, weight: 'bold' }));
    b += show(T, 4.8, line(c[0] + dx * S, c[1], c[0] + dx * S, c[1] - dy * S, { stroke: C.berry, w: 3 }) + t(c[0] + dx * S + 8, c[1] - dy * S / 2, dy + ' up', { size: 13, fill: C.berry, weight: 'bold', anchor: 'start' }));
    b += show(T, 5.4, t(x0 + nx * S / 2, y0 + ny * S + 24, 'Every corner moves ' + dx + ' right and ' + dy + ' up.', { size: 14, weight: 'bold' }));
    return svg(x0 * 2 + nx * S, y0 + ny * S + 40, b);
  };
  D.reflect = function () {
    var S = 30, x0 = 20, y0 = 20, nx = 12, ny = 7, mx = x0 + 6 * S, T = 8, b = grid(nx, ny, S, x0, y0);
    var shape = [[x0 + 2 * S, y0 + 2 * S], [x0 + 4 * S, y0 + 2 * S], [x0 + 5 * S, y0 + 5 * S], [x0 + 2 * S, y0 + 5 * S]];
    b += line(mx, y0 - 6, mx, y0 + ny * S + 6, { stroke: C.plum, w: 3, dash: '8 5' }) + t(mx, y0 + ny * S + 20, 'mirror line', { size: 12, fill: C.plum, weight: 'bold' });
    b += poly(shape, { fill: C.skyLight, stroke: C.sky });
    b += '<g transform="translate(' + mx + ' 0)"><g><animateTransform attributeName="transform" type="scale"' + tl(T, [[0, '1 1'], [1, '1 1'], [3, '-1 1'], [T - 0.4, '-1 1'], [T, '1 1']]) + '/><g transform="translate(' + -mx + ' 0)">' + poly(shape, { fill: C.berryLight, stroke: C.berry }) + '</g></g></g>';
    b += show(T, 3.2, line(x0 + 5 * S, y0 + 5 * S, x0 + 7 * S, y0 + 5 * S, { stroke: C.leaf, w: 3 }) + t(mx, y0 + 5 * S + 16, '1 and 1', { size: 12, fill: C.leaf, weight: 'bold' }) +
      line(x0 + 2 * S, y0 + 2 * S, x0 + 10 * S, y0 + 2 * S, { stroke: C.leaf, w: 2, dash: '4 4' }) + t(mx, y0 + 2 * S - 12, '4 and 4', { size: 12, fill: C.leaf, weight: 'bold' }));
    b += show(T, 4.2, t(x0 + nx * S / 2, y0 + ny * S + 42, 'Each point is the same distance from the mirror.', { size: 14, weight: 'bold' }));
    return svg(x0 * 2 + nx * S, y0 + ny * S + 56, b);
  };
  D.enlarge = function (k) {
    var S = 26, x0 = 20, y0 = 20, nx = 14, ny = 10, O = [1, 1], tri = [[2, 2], [4, 2], [2, 4]], T = 8, b = grid(nx, ny, S, x0, y0);
    var P = function (q) { return [x0 + q[0] * S, y0 + (ny - q[1]) * S]; }, big = tri.map(function (q) { return [O[0] + k * (q[0] - O[0]), O[1] + k * (q[1] - O[1])]; });
    b += circle(P(O)[0], P(O)[1], 5, { fill: C.plum }) + t(P(O)[0] - 12, P(O)[1] + 12, 'O', { size: 14, weight: 'bold', fill: C.plum });
    b += poly(tri.map(P), { fill: C.skyLight, stroke: C.sky });
    big.forEach(function (q, i) { b += show(T, 0.8 + i * 0.5, line(P(O)[0], P(O)[1], P(q)[0], P(q)[1], { stroke: C.plum, w: 1.5, dash: '5 4' })); });
    b += show(T, 2.6, poly(big.map(P), { fill: 'none', stroke: C.berry }));
    b += show(T, 3.6, t(x0 + nx * S / 2, y0 + ny * S + 24, 'Scale factor ' + k + ': each point is ' + k + ' times as far from O.', { size: 14, weight: 'bold' }));
    return svg(x0 * 2 + nx * S, y0 + ny * S + 40, b);
  };

  // ---------- the nth term: the common difference and the zero term ----------
  D.nthTerm = function (a, d) {
    var W = 70, x0 = 100, y = 70, T = 9, b = '', i;
    b += show(T, 4.6, rect(x0 - W + 8, y - 22, W - 16, 44, { fill: '#fff', stroke: C.plum, rx: 8 }) + t(x0 - W / 2, y, String(a - d).replace('-', '−'), { size: 20, weight: 'bold', fill: C.plum }) + t(x0 - W / 2, y + 38, 'zero term', { size: 11, fill: C.plum }) + arc(x0 - W / 2 + 10, x0 + W / 2 - 10, y - 26, 26, C.plum));
    for (i = 0; i < 5; i++) b += rect(x0 + i * W + 8, y - 22, W - 16, 44, { fill: C.skyLight, stroke: C.sky, rx: 8 }) + t(x0 + i * W + W / 2, y, String(a + i * d), { size: 20, weight: 'bold' }) + t(x0 + i * W + W / 2, y + 38, 'n = ' + (i + 1), { size: 11, fill: C.soft });
    for (i = 0; i < 4; i++) b += show(T, 0.6 + i * 0.7, arc(x0 + i * W + W / 2 + 10, x0 + (i + 1) * W + W / 2 - 10, y - 26, 26, C.berry) + t(x0 + i * W + W, y - 46, '+' + d, { size: 14, weight: 'bold', fill: C.berry }));
    b += show(T, 3.4, t(x0 + 2 * W, y + 72, 'Goes up by ' + d + ' each time, so it starts ' + d + 'n.', { size: 15 }));
    b += show(T, 5.6, t(x0 + 2 * W, y + 102, 'nth term = ' + d + 'n ' + (a - d < 0 ? '− ' + (d - a) : '+ ' + (a - d)), { size: 22, weight: 'bold', fill: C.leaf }));
    return svg(x0 + 5 * W + 30, y + 118, b);
  };

  // ---------- index laws by writing the powers out ----------
  D.indexLaw = function (m, n) {
    var T = 8, b = '', W = 30, x0 = 40, y = 84, i, k = 0;
    b += t(250, 24, 'a' + sup(m) + ' × a' + sup(n), { size: 26, weight: 'bold' });
    for (i = 0; i < m; i++) b += show(T, 0.8 + k++ * 0.3, t(x0 + i * W * 1.5, y, 'a', { size: 24, weight: 'bold', fill: C.sky }) + (i < m - 1 ? t(x0 + i * W * 1.5 + W * 0.75, y, '×', { size: 18 }) : ''));
    b += show(T, 0.8 + m * 0.3, t(x0 + (m - 0.25) * W * 1.5, y, '×', { size: 18 }));
    for (i = 0; i < n; i++) b += show(T, 1 + k++ * 0.3, t(x0 + (m + i + 0.5) * W * 1.5, y, 'a', { size: 24, weight: 'bold', fill: C.berry }) + (i < n - 1 ? t(x0 + (m + i + 0.5) * W * 1.5 + W * 0.75, y, '×', { size: 18 }) : ''));
    b += show(T, 1.6 + k * 0.3, t(250, y + 40, m + ' a’s and ' + n + ' a’s make ' + (m + n) + ' a’s multiplied together.', { size: 15 }));
    b += show(T, 2.8 + k * 0.3, t(250, y + 80, 'a' + sup(m) + ' × a' + sup(n) + ' = a' + sup(m + n) + ' (add the powers)', { size: 22, weight: 'bold', fill: C.leaf }));
    return svg(500, y + 98, b);
  };

  // ---------- a factor tree growing ----------
  D.factorTree = function (n) {
    var levels = [], v = n, p = 2, primes = [];
    while (v > 1) { while (v % p) p++; primes.push(p); levels.push([p, v / p]); v /= p; }
    var T = 2 + levels.length * 1.1 + 4, b = '', x = 200, y = 34, dx = 46, dy = 50;
    b += t(x, y, fmt(n), { size: 20, weight: 'bold' });
    levels.forEach(function (lv, i) {
      var nx = x + dx * 0.9, px = x - dx * 0.9, ny = y + dy, last = lv[1] === 1;
      if (last) return;
      var isP = lv[1] > 1 && primes.indexOf(lv[1]) >= 0 && i === levels.length - 2;
      b += show(T, 0.8 + i * 1.1, line(x - 8, y + 12, px + 6, ny - 12, { w: 2 }) + line(x + 8, y + 12, nx - 6, ny - 12, { w: 2 }) +
        circle(px, ny, 17, { fill: C.leafLight, stroke: C.leaf }) + t(px, ny, String(lv[0]), { size: 17, weight: 'bold', fill: C.leaf }) +
        (isP ? circle(nx, ny, 17, { fill: C.leafLight, stroke: C.leaf }) : '') + t(nx, ny, fmt(lv[1]), { size: 17, weight: 'bold', fill: isP ? C.leaf : C.ink }));
      x = nx; y = ny;
    });
    var counts = {}; primes.forEach(function (q) { counts[q] = (counts[q] || 0) + 1; });
    var idx = Object.keys(counts).map(function (q) { return q + (counts[q] > 1 ? sup(counts[q]) : ''); }).join(' × ');
    b += show(T, 1.2 + levels.length * 1.1, t(220, y + 52, fmt(n) + ' = ' + primes.join(' × ') + ' = ' + idx, { size: 19, weight: 'bold', fill: C.berry }));
    return svg(Math.max(460, x + 60), y + 70, b);
  };

  // ---------- short division (bus stop) ----------
  D.busStop = function (n, d) {
    var ds = String(n).split('').map(Number), W = 36, x0 = 110, y = 96, T = 2 + ds.length * 1.4 + 4, b = '', rem = 0, q = '', started = false;
    b += t(x0 - 30, y, String(d), { size: 26, weight: 'bold', fill: C.berry }) + '<path d="M' + (x0 - 10) + ' ' + (y + 22) + ' Q' + (x0 - 2) + ' ' + y + ' ' + (x0 - 10) + ' ' + (y - 24) + ' L' + (x0 + ds.length * W + 10) + ' ' + (y - 24) + '" fill="none" stroke="' + C.ink + '" stroke-width="2.5"/>';
    ds.forEach(function (dg, i) {
      var cur = rem * 10 + dg, qd = Math.floor(cur / d), tt = 1 + i * 1.4;
      b += t(x0 + i * W + W / 2, y, String(dg), { size: 26, weight: 'bold' });
      if (rem) b += show(T, tt - 0.6, t(x0 + i * W + 6, y - 12, String(rem), { size: 13, weight: 'bold', fill: C.berry }));
      if (qd || started || i === ds.length - 1) { started = true; b += show(T, tt, t(x0 + i * W + W / 2, y - 44, String(qd), { size: 26, weight: 'bold', fill: C.sky })); q += qd; }
      b += show(T, tt, t(x0 + ds.length * W + 40, 30 + i * 22, cur + ' ÷ ' + d + ' = ' + qd + (cur - qd * d ? ' r ' + (cur - qd * d) : ''), { size: 14, fill: C.soft, anchor: 'start' }), tt + 1.3);
      rem = cur - qd * d;
    });
    b += show(T, 1.2 + ds.length * 1.4, t(x0 + ds.length * W / 2 + 40, y + 52, fmt(n) + ' ÷ ' + d + ' = ' + fmt(+q) + (rem ? ' r ' + rem : ''), { size: 22, weight: 'bold', fill: C.leaf }));
    return svg(x0 + ds.length * W + 210, y + 70, b);
  };

  // ---------- compound growth: the same multiplier every year ----------
  D.compound = function (P, r, years) {
    var m = 1 + r / 100, vals = [], i; for (i = 0; i <= years; i++) vals.push(P * Math.pow(m, i));
    var mx = vals[years], S = 150 / mx, B = 190, x0 = 50, bw = 54, gap = 22, T = 2 + years * 1.2 + 4, b = '';
    b += line(x0 - 10, B, x0 + (years + 1) * (bw + gap), B, { w: 2 });
    vals.forEach(function (v, k) { var x = x0 + k * (bw + gap);
      b += show(T, 0.4 + k * 1.2, rect(x, B - v * S, bw, v * S, { fill: k ? C.leafLight : C.skyLight, stroke: k ? C.leaf : C.sky }) + t(x + bw / 2, B - v * S - 12, '£' + v.toFixed(2), { size: 12, weight: 'bold' }) + t(x + bw / 2, B + 16, 'Year ' + k, { size: 12, fill: C.soft }) +
        (k ? t(x - gap / 2, B - v * S - 34, '× ' + m, { size: 12, fill: C.berry, weight: 'bold' }) : '')); });
    b += show(T, 1 + years * 1.2, t(x0 + (years + 1) * (bw + gap) / 2, B + 42, '£' + P + ' × ' + m + sup(years) + ' = £' + vals[years].toFixed(2) + ' (' + r + '% added to the new total each year)', { size: 14, weight: 'bold' }));
    return svg(x0 + (years + 1) * (bw + gap) + 30, B + 58, b);
  };

  // ---------- volume: layers of cubes stacking up ----------
  D.layers = function (l, w, h) {
    var S = 20, ox = 12, oy = 8, x0 = 50, B = 40 + h * S + w * oy, T = 2 + h * 0.8 + 4, b = '', i, j;
    for (i = 0; i < h; i++) {
      var y = B - (i + 1) * S, layer = '';
      for (j = w - 1; j >= 0; j--) layer += '<rect x="' + (x0 + j * ox) + '" y="' + (y - j * oy) + '" width="' + l * S + '" height="' + S + '" fill="' + (i % 2 ? C.skyLight : C.leafLight) + '" stroke="' + (i % 2 ? C.sky : C.leaf) + '" stroke-width="1.5"/>';
      for (j = 1; j < l; j++) layer += line(x0 + j * S, y, x0 + j * S, y + S, { stroke: i % 2 ? C.sky : C.leaf, w: 1 });
      b += show(T, 0.6 + i * 0.8, layer);
    }
    var tx = x0 + l * S + w * ox + 30;
    b += show(T, 0.6, t(tx, 50, 'One layer: ' + l + ' × ' + w + ' = ' + l * w + ' cubes', { size: 15, anchor: 'start' }));
    b += show(T, 1 + h * 0.8, t(tx, 84, h + ' layers: ' + l * w + ' × ' + h + ' = ' + l * w * h + ' cubes', { size: 15, anchor: 'start', weight: 'bold' }) + t(tx, 118, 'Volume = area of the base × height', { size: 15, anchor: 'start', fill: C.berry, weight: 'bold' }));
    return svg(tx + 270, B + 20, b);
  };

  // ================= which topics get which examples =================
  // [objective id, what Pip says, picture]
  var BIDMAS = function () { return D.steps(['3 + 4 × (5 − 2)²', '= 3 + 4 × 3²', '= 3 + 4 × 9', '= 3 + 36', '= 39'], ['', 'Brackets first', 'Then indices (powers)', 'Then × and ÷', 'Then + and −'], 'BIDMAS: brackets, indices, ÷ and ×, + and −'); };
  var SOLVE = function () { return D.steps(['3x + 4 = 19', '3x = 15', 'x = 5'], ['', '− 4 from both sides', '÷ 3 on both sides'], 'Keep the equation balanced: do the same to both sides'); };
  var DEMOS = [
    ['Y1-AS-03', 'Watch: to work out 8 + 5, jump to 10 first, then jump the rest.', function () { return D.jumps({ lo: 0, hi: 20, start: 8, steps: [2, 3] }); }],
    ['Y1-MD-01', 'Watch: 3 groups of 4. Count them: 4, 8, 12.', function () { return D.array(3, 4); }],
    ['Y2-AS-03', 'Watch: 34 + 25. Jump on 2 tens, then 5 ones.', function () { return D.jumps({ lo: 30, hi: 60, start: 34, steps: [10, 10, 5] }); }],
    ['Y2-MD-01', 'Watch: 2 rows of 5 make 10. That is 2 × 5.', function () { return D.array(2, 5); }],
    ['Y3-AS-01', 'Watch: 47 − 23. Jump back 2 tens, then 3 ones.', function () { return D.jumps({ lo: 20, hi: 50, start: 47, steps: [-10, -10, -3] }); }],
    ['Y3-MD-01', 'Watch: 4 rows of 8 dots make 32.', function () { return D.array(4, 8); }],
    ['Y3-F-04', 'Watch: cut every half into 2 pieces. One half becomes two quarters.', function () { return D.equivFrac(1, 2, 2); }],
    ['Y4-NPV-03', 'Watch: 3 − 5 means jumping back 5 from 3. We go past zero.', function () { return D.jumps({ lo: -5, hi: 5, start: 3, steps: [-5] }); }],
    ['Y4-MD-03', 'Watch: 3 rows of 6 make 18, so 3 and 6 are a factor pair of 18.', function () { return D.array(3, 6); }],
    ['Y4-F-01', 'Watch: split each third into 2. Two thirds is the same as four sixths.', function () { return D.equivFrac(2, 3, 2); }],
    ['Y4-F-07', 'Watch: dividing by 100 moves every digit 2 places to the right.', function () { return D.slideDigits('35', 2, 'div'); }],
    ['Y5-NPV-03', 'Watch: −4 + 7. Start at −4 and jump up 7.', function () { return D.jumps({ lo: -6, hi: 6, start: -4, steps: [7] }); }],
    ['Y5-NPV-04', 'Watch: is 36,472 nearer to 36,000 or 37,000?', function () { return D.round(36472, 1000); }],
    ['Y5-MD-04', 'Watch: split both numbers into tens and ones, multiply each part, then add.', function () { return D.areaMult(23, 14); }],
    ['Y5-MD-06', 'Watch: short division, one digit at a time. A remainder moves on to the next digit.', function () { return D.busStop(857, 4); }],
    ['Y5-MD-07', 'Watch: multiplying by 100 moves every digit 2 places to the left. A zero fills the empty place.', function () { return D.slideDigits('4.7', 2, 'mul'); }],
    ['Y5-MD-08', 'Watch: 4 rows of 4 make a square. 4 squared is 16.', function () { return D.array(4, 4); }],
    ['Y5-F-02', 'Watch: two fifths is the same as four tenths.', function () { return D.equivFrac(2, 5, 2); }],
    ['Y5-F-08', 'Watch: 3.68 rounded to 1 decimal place. Is it nearer 3.6 or 3.7?', function () { return D.round(3.68, 0.1, 1); }],
    ['Y5-F-11', 'Watch: 37 squares out of 100 are shaded. That is 37%.', function () { return D.percent(37); }],
    ['Y5-G-04', 'Watch: the two angles fill a straight line, so they add up to 180°.', function () { return D.straightAngle(130); }],
    ['Y5-P-01', 'Watch: a translation slides a shape. It does not turn or flip.', function () { return D.translate(4, 1); }],
    ['Y5-P-01', 'Watch: a reflection flips a shape over a mirror line.', function () { return D.reflect(); }],
    ['Y6-NPV-02', 'Watch: rounding 4,768,213 to the nearest 100,000.', function () { return D.round(4768213, 100000); }],
    ['Y6-NPV-03', 'Watch: from −7, a rise of 12 goes up past zero.', function () { return D.jumps({ lo: -8, hi: 8, start: -7, steps: [12] }); }],
    ['Y6-C-01', 'Watch: 36 × 24 with the grid method. It shows why long multiplication works.', function () { return D.areaMult(36, 24); }],
    ['Y6-C-02', 'Watch: 4,356 ÷ 12, one digit at a time. Each remainder joins the next digit.', function () { return D.busStop(4356, 12); }],
    ['Y6-C-06', 'Watch the order: brackets, then powers, then multiply, then add.', BIDMAS],
    ['Y6-F-01', 'Watch: three quarters is the same as six eighths.', function () { return D.equivFrac(3, 4, 2); }],
    ['Y6-F-07', 'Watch: dividing by 1,000 moves every digit 3 places to the right.', function () { return D.slideDigits('42', 3, 'div'); }],
    ['Y6-R-02', 'Watch: 35% means 35 out of every 100.', function () { return D.percent(35); }],
    ['Y6-R-04', 'Watch: sharing 40 in the ratio 2 : 3. Find one part first.', function () { return D.ratioBar(2, 3, 40, ['Amy', 'Ben']); }],
    ['Y6-A-02', 'Watch: this sequence goes up by 3 each time.', function () { return D.nthTerm(5, 3); }],
    ['Y6-A-03', 'Watch: undo each step, doing the same to both sides.', SOLVE],
    ['Y6-S-02', 'Watch: the mean is what each bar would be if the total were shared out equally.', function () { return D.levelMean([4, 7, 3, 6]); }],
    ['Y6-G-05', 'Watch: angles on a straight line add up to 180°.', function () { return D.straightAngle(115); }],
    ['Y6-P-02', 'Watch: in a reflection, every point is the same distance from the mirror.', function () { return D.reflect(); }],
    ['Y7-N-01', 'Watch: multiplying by 1,000 moves each digit 3 places left.', function () { return D.slideDigits('0.6', 3, 'mul'); }],
    ['Y7-N-03', 'Watch: rounding 2.746 to 2 decimal places.', function () { return D.round(2.746, 0.01, 2); }],
    ['Y7-N-05', 'Watch: −3 − 4 means starting at −3 and going 4 further down.', function () { return D.jumps({ lo: -9, hi: 3, start: -3, steps: [-4] }); }],
    ['Y7-N-07', 'Watch the order of operations, one step at a time.', BIDMAS],
    ['Y7-N-09', 'Watch: a factor tree splits 360 until every branch ends in a prime.', function () { return D.factorTree(360); }],
    ['Y7-N-13', 'Watch: 45% is 45 hundredths, or 0.45.', function () { return D.percent(45); }],
    ['Y7-A-04', 'Watch: multiply everything inside the bracket.', function () { return D.steps(['3(x + 4)', '= 3 × x + 3 × 4', '= 3x + 12'], ['', 'Multiply each term by 3', 'Simplify'], 'Expanding a bracket'); }],
    ['Y7-A-05', 'Watch: solving an equation by doing the same to both sides.', SOLVE],
    ['Y7-A-07', 'Watch: the difference gives the n part, and the zero term gives the number.', function () { return D.nthTerm(7, 4); }],
    ['Y7-R-02', 'Watch: share 64 in the ratio 3 : 5 using a bar model.', function () { return D.ratioBar(3, 5, 64, ['Kit', 'Raj']); }],
    ['Y7-S-01', 'Watch: levelling the bars out shows the mean.', function () { return D.levelMean([2, 9, 4, 5]); }],
    ['Y7-G-02', 'Watch: angles on a straight line make 180°.', function () { return D.straightAngle(70); }],
    ['Y8-N-01', 'Watch: for a big number, the decimal point hops left until there is one digit in front of it. Count the hops: that is the power.', function () { return D.stdForm('45000000'); }],
    ['Y8-N-01', 'Watch: for a small number, the point hops right. The power is negative.', function () { return D.stdForm('0.00032'); }],
    ['Y8-N-03', 'Watch: write the powers out in full and count the a’s.', function () { return D.indexLaw(3, 2); }],
    ['Y8-A-03', 'Watch: multiply every part of one bracket by every part of the other.', function () { return D.expandGrid(3, 5); }],
    ['Y8-A-04', 'Watch: get the x terms on one side first.', function () { return D.steps(['5x − 3 = 2x + 9', '3x − 3 = 9', '3x = 12', 'x = 4'], ['', '− 2x from both sides', '+ 3 to both sides', '÷ 3 on both sides'], 'Unknowns on both sides'); }],
    ['Y8-A-07', 'Watch: the gradient is how far the line goes up for every 1 across.', function () { return D.gradient(2, 1); }],
    ['Y8-G-02', 'Watch: a prism is layers stacked up. Volume = area of the cross-section × length.', function () { return D.layers(4, 3, 5); }],
    ['Y8-G-05', 'Watch: a translation moves every point the same way.', function () { return D.translate(3, 2); }],
    ['Y9-N-02', 'Watch: 602,000 in standard form. Count the hops of the decimal point.', function () { return D.stdForm('602000'); }],
    ['Y9-N-02', 'Watch: 0.000067 in standard form. The point hops right, so the power is negative.', function () { return D.stdForm('0.000067'); }],
    ['Y9-R-01', 'Watch: compound interest multiplies by the same number every year.', function () { return D.compound(200, 5, 4); }],
    ['Y9-G-03', 'Watch: an enlargement from a centre. Each point moves along a line from O.', function () { return D.enlarge(2); }],
    ['Y10-N3', 'Watch the order of operations.', BIDMAS],
    ['Y10-N4', 'Watch: a factor tree for 252.', function () { return D.factorTree(252); }],
    ['Y10-N7', 'Watch: why we add the powers when we multiply.', function () { return D.indexLaw(4, 3); }],
    ['Y10-N9', 'Watch: 3,060,000 in standard form. The point hops left 6 places.', function () { return D.stdForm('3060000'); }],
    ['Y10-N9', 'Watch: 0.0045 in standard form. The point hops right 3 places.', function () { return D.stdForm('0.0045'); }],
    ['Y10-A4', 'Watch: expanding double brackets with a grid.', function () { return D.expandGrid(2, 6); }],
    ['Y10-A10', 'Watch: reading the gradient and the intercept from a graph.', function () { return D.gradient(3, 2); }],
    ['Y10-A17', 'Watch: expand, collect the x terms, then solve.', function () { return D.steps(['4(x + 3) = 2x + 20', '4x + 12 = 2x + 20', '2x + 12 = 20', '2x = 8', 'x = 4'], ['', 'Expand the bracket', '− 2x from both sides', '− 12 from both sides', '÷ 2 on both sides'], 'Solving a linear equation'); }],
    ['Y10-A25', 'Watch: the common difference and the zero term give the nth term.', function () { return D.nthTerm(3, 5); }],
    ['Y11-R5', 'Watch: sharing in a ratio with a bar model.', function () { return D.ratioBar(4, 1, 150, ['Sam', 'Ali']); }],
    ['Y11-R16', 'Watch: growth by the same percentage each year.', function () { return D.compound(1000, 3, 5); }],
    ['Y11-G7', 'Watch: an enlargement by scale factor 3.', function () { return D.enlarge(3); }],
    ['Y11-G24', 'Watch: a translation by a column vector: across, then up.', function () { return D.translate(5, 2); }],
    ['Y11-G16', 'Watch: volume is the area of the base times the height.', function () { return D.layers(5, 3, 4); }],
    ['Y11-S4', 'Watch: the mean shares the total out equally.', function () { return D.levelMean([3, 8, 6, 2, 6]); }]
  ];
  DEMOS.forEach(function (d) {
    var o = OM.objectiveIndex[d[0]]; if (!o) throw new Error('demos.js: no topic ' + d[0]);
    o.intro.push({ say: d[1], vis: d[2], demo: true });
  });
})(typeof window !== 'undefined' ? window : globalThis);
