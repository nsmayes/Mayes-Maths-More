/* Mayes Maths & More — illustrations for lessons where a picture explains it best (circle theorems, graphs, trees,
   bar models, constructions…), and the diagrams some questions draw (OM.ill.*). All inline SVG, no internet needed.
   Loaded after the curriculum: each entry below either gives a topic's lesson slides their pictures, or replaces the
   slides with ones built around a picture. Diagrams on questions say "Not drawn accurately", as exam papers do. */
(function (G) {
  'use strict';
  var OM = G.OM, V = OM.V, C = V.colors, svg = V.svg, t = V.t;
  var INK = C.ink, SOFT = C.soft, HI = C.berry, HI2 = C.sky, FILL = C.skyLight, FILL2 = C.amberLight;

  // ---------- drawing helpers ----------
  function f(n) { return Math.round(n * 10) / 10; }
  function P(cx, cy, r, deg) { var a = deg * Math.PI / 180; return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; }
  function seg(a, b, o) { return V.line(f(a[0]), f(a[1]), f(b[0]), f(b[1]), o); }
  function path(pts, o) { o = o || {}; return '<path d="M' + pts.map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join(' L') + (o.open ? '' : ' Z') + '" fill="' + (o.fill || 'none') + '" stroke="' + (o.stroke || INK) + '" stroke-width="' + (o.w || 2) + '" stroke-linejoin="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>'; }
  function circ(cx, cy, r, o) { o = o || {}; return '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(r) + '" fill="' + (o.fill || 'none') + '" stroke="' + (o.stroke || INK) + '" stroke-width="' + (o.w || 2) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>'; }
  function dot(p, o) { o = o || {}; return '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="' + (o.r || 3.5) + '" fill="' + (o.fill || INK) + '"/>'; }
  // a point's letter, placed just outside the shape (away from c)
  function lab(p, s, c, d, o) { var dx = p[0] - c[0], dy = p[1] - c[1], l = Math.hypot(dx, dy) || 1; d = d || 16; return t(f(p[0] + dx / l * d), f(p[1] + dy / l * d), s, Object.assign({ size: 16, weight: 'bold' }, o || {})); }
  function unit(v, p) { var dx = p[0] - v[0], dy = p[1] - v[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; }
  // the angle at v between the lines to p1 and p2: an arc, and its label on the middle line
  function ang(v, p1, p2, label, o) {
    o = o || {};
    var r = o.r || 24, u1 = unit(v, p1), u2 = unit(v, p2), a1 = Math.atan2(u1[1], u1[0]), a2 = Math.atan2(u2[1], u2[0]), d = a2 - a1;
    while (d > Math.PI) d -= 2 * Math.PI; while (d <= -Math.PI) d += 2 * Math.PI;
    var s = [v[0] + r * u1[0], v[1] + r * u1[1]], e = [v[0] + r * u2[0], v[1] + r * u2[1]], col = o.col || HI;
    var out = '<path d="M' + f(s[0]) + ' ' + f(s[1]) + ' A' + r + ' ' + r + ' 0 0 ' + (d > 0 ? 1 : 0) + ' ' + f(e[0]) + ' ' + f(e[1]) + '" fill="none" stroke="' + col + '" stroke-width="2.2"/>';
    if (label) { var m = a1 + d / 2, lr = r + (o.gap || 15) + String(label).length * 2.2; out += t(f(v[0] + lr * Math.cos(m)), f(v[1] + lr * Math.sin(m)), label, { size: o.size || 15, fill: col, weight: 'bold' }); }
    return out;
  }
  function right(v, p1, p2, s) { s = s || 12; var u1 = unit(v, p1), u2 = unit(v, p2); return path([[v[0] + s * u1[0], v[1] + s * u1[1]], [v[0] + s * (u1[0] + u2[0]), v[1] + s * (u1[1] + u2[1])], [v[0] + s * u2[0], v[1] + s * u2[1]]], { open: true, stroke: HI, w: 2 }); }
  // equal-length ticks across the middle of a side; parallel arrows along a side
  function ticks(a, b, n) { var m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], u = unit(a, b), nrm = [-u[1], u[0]], o = ''; for (var i = 0; i < n; i++) { var k = (i - (n - 1) / 2) * 5, c = [m[0] + u[0] * k, m[1] + u[1] * k]; o += seg([c[0] - nrm[0] * 6, c[1] - nrm[1] * 6], [c[0] + nrm[0] * 6, c[1] + nrm[1] * 6], { w: 2 }); } return o; }
  function arrows(a, b, n) { var m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], u = unit(a, b), nrm = [-u[1], u[0]], o = ''; for (var i = 0; i < n; i++) { var c = [m[0] + u[0] * (i * 7), m[1] + u[1] * (i * 7)]; o += path([[c[0] - u[0] * 6 - nrm[0] * 5, c[1] - u[1] * 6 - nrm[1] * 5], c, [c[0] - u[0] * 6 + nrm[0] * 5, c[1] - u[1] * 6 + nrm[1] * 5]], { open: true, w: 2 }); } return o; }
  function arrowHead(a, b, col) { var u = unit(a, b), nrm = [-u[1], u[0]]; return path([[b[0] - u[0] * 11 - nrm[0] * 6, b[1] - u[1] * 11 - nrm[1] * 6], b, [b[0] - u[0] * 11 + nrm[0] * 6, b[1] - u[1] * 11 + nrm[1] * 6]], { fill: col || INK, stroke: col || INK, w: 1.5 }); }
  function vec(a, b, col, label, side) { var m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], u = unit(a, b), nrm = [-u[1] * (side || 1), u[0] * (side || 1)]; return seg(a, b, { stroke: col, w: 3 }) + arrowHead(a, b, col) + (label ? t(f(m[0] + nrm[0] * 16), f(m[1] + nrm[1] * 16), label, { size: 17, fill: col, weight: 'bold' }) : ''); }
  function note(w, h) { return t(8, h - 8, 'Not drawn accurately', { size: 11, fill: SOFT, anchor: 'start' }); }
  function caption(x, y, s, o) {
    o = Object.assign({ size: 14, fill: SOFT }, o || {});
    var max = o.max || 0, per = o.size * 0.52; if (!max || String(s).length * per <= max) return t(x, y, s, o);
    var words = String(s).split(' '), a = '', b = ''; words.forEach(function (w) { if (!b && (a + ' ' + w).length * per <= max) a = (a + ' ' + w).trim(); else b = (b + ' ' + w).trim(); });
    return t(x, y - o.size * 0.6, a, o) + t(x, y + o.size * 0.6, b, o);
  }
  function many(list, gap, perRow) { // several small diagrams side by side (perRow to a row), each [width, height, body]
    gap = gap || 20; perRow = perRow || list.length;
    var x = 0, y = 0, rowH = 0, W = 0, body = '';
    list.forEach(function (d, i) { if (i && i % perRow === 0) { y += rowH + gap; x = 0; rowH = 0; } body += '<g transform="translate(' + x + ' ' + y + ')">' + d[2] + '</g>'; x += d[0] + gap; W = Math.max(W, x - gap); rowH = Math.max(rowH, d[1]); });
    return svg(W, y + rowH, body);
  }

  // ---------- circle theorems (letters match the questions) ----------
  var CX = 150, CY = 140, R = 100, O = [CX, CY];
  function ring(withCentre) { return circ(CX, CY, R) + (withCentre ? dot(O) + t(CX + 13, CY - 11, 'O', { size: 15, weight: 'bold' }) : ''); }
  var ill = OM.ill = {
    // the angle at the centre is twice the angle at the circumference: at C (on the circle) and at O
    centre: function (o) { o = o || {}; var A = P(CX, CY, R, 215), B = P(CX, CY, R, 325), Cc = P(CX, CY, R, 100);
      return svg(300, 270, ring(true) + seg(Cc, A) + seg(Cc, B) + seg(O, A, { stroke: HI2 }) + seg(O, B, { stroke: HI2 }) + [A, B, Cc].map(function (p) { return dot(p); }).join('') +
        lab(A, 'A', O) + lab(B, 'B', O) + lab(Cc, 'C', O) + ang(Cc, A, B, o.c || 'x', { r: 30 }) + ang(O, A, B, o.o || '2x', { r: 22, col: HI2 }) + (o.note ? note(300, 270) : '')); },
    // the angle in a semicircle is 90°
    semi: function (o) { o = o || {}; var A = P(CX, CY, R, 180), B = P(CX, CY, R, 0), Cc = P(CX, CY, R, 118);
      return svg(300, 260, ring(true) + seg(A, B, { stroke: HI2 }) + seg(A, Cc) + seg(B, Cc) + [A, B, Cc].map(function (p) { return dot(p); }).join('') + lab(A, 'A', O) + lab(B, 'B', O) + lab(Cc, 'C', O) +
        right(Cc, A, B, 13) + (o.a ? ang(A, B, Cc, o.a, { r: 34 }) : '') + (o.b ? ang(B, A, Cc, o.b, { r: 30, col: HI2 }) : '') + (o.note ? note(300, 260) : '')); },
    // opposite angles of a cyclic quadrilateral add up to 180°
    cyclic: function (o) { o = o || {}; var A = P(CX, CY, R, 205), B = P(CX, CY, R, 120), Cc = P(CX, CY, R, 25), D = P(CX, CY, R, 290);
      return svg(300, 260, ring(false) + path([A, B, Cc, D], { fill: FILL }) + [A, B, Cc, D].map(function (p) { return dot(p); }).join('') + lab(A, 'A', O) + lab(B, 'B', O) + lab(Cc, 'C', O) + lab(D, 'D', O) +
        ang(A, B, D, o.a || 'a', { r: 28 }) + ang(Cc, B, D, o.c || '180° − a', { r: 26, col: HI2, gap: 22 }) + (o.note ? note(300, 260) : '')); },
    // angles in the same segment are equal: at C and D, both standing on chord AB
    segment: function (o) { o = o || {}; var A = P(CX, CY, R, 215), B = P(CX, CY, R, 325), Cc = P(CX, CY, R, 60), D = P(CX, CY, R, 125);
      return svg(300, 260, ring(false) + seg(A, B, { stroke: SOFT }) + seg(A, Cc) + seg(B, Cc) + seg(A, D, { stroke: HI2 }) + seg(B, D, { stroke: HI2 }) + [A, B, Cc, D].map(function (p) { return dot(p); }).join('') +
        lab(A, 'A', O) + lab(B, 'B', O) + lab(Cc, 'C', O) + lab(D, 'D', O) + ang(Cc, A, B, o.c || 'x', { r: 30 }) + ang(D, A, B, o.d || 'x', { r: 30, col: HI2 }) + (o.note ? note(300, 260) : '')); },
    // a tangent meets a radius at 90°: tangent at T, external point P
    tangent: function (o) { o = o || {}; var T = [CX, CY + R], Pp = [CX + 175, CY + R], Q = [CX - 90, CY + R];
      return svg(360, 270, ring(true) + seg(Q, [CX + 205, CY + R], { stroke: HI2 }) + seg(O, T) + seg(O, Pp) + [T, Pp].map(function (p) { return dot(p); }).join('') +
        t(T[0], T[1] + 18, 'T', { size: 16, weight: 'bold' }) + t(Pp[0], Pp[1] + 18, 'P', { size: 16, weight: 'bold' }) + right(T, O, Pp, 13) +
        (o.o ? ang(O, T, Pp, o.o, { r: 26 }) : '') + (o.p ? ang(Pp, O, T, o.p, { r: 40, col: HI2 }) : '') + (o.note ? note(360, 270) : '')); },
    // the alternate segment theorem: the tangent–chord angle at A equals the angle at C in the other segment
    alternate: function (o) { o = o || {}; var A = [CX, CY + R], B = P(CX, CY, R, 25), Cc = P(CX, CY, R, 150), T1 = [CX + 150, CY + R], T2 = [CX - 120, CY + R];
      return svg(320, 270, ring(false) + seg(T2, T1, { stroke: HI2 }) + seg(A, B) + seg(A, Cc) + seg(Cc, B) + [A, B, Cc].map(function (p) { return dot(p); }).join('') +
        t(A[0], A[1] + 18, 'A', { size: 16, weight: 'bold' }) + lab(B, 'B', O) + lab(Cc, 'C', O) + ang(A, T1, B, o.a || 'x', { r: 34 }) + ang(Cc, A, B, o.c || 'x', { r: 34 }) + (o.note ? note(320, 270) : '')); },

    // ---------- other diagrams used in lessons ----------
    sector: function () { var cx = 140, cy = 130, r = 100, a = P(cx, cy, r, 20), b = P(cx, cy, r, 110);
      return svg(320, 250, circ(cx, cy, r, { stroke: SOFT, dash: '5 5' }) + '<path d="M' + cx + ' ' + cy + ' L' + f(a[0]) + ' ' + f(a[1]) + ' A' + r + ' ' + r + ' 0 0 0 ' + f(b[0]) + ' ' + f(b[1]) + ' Z" fill="' + FILL2 + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<path d="M' + f(a[0]) + ' ' + f(a[1]) + ' A' + r + ' ' + r + ' 0 0 0 ' + f(b[0]) + ' ' + f(b[1]) + '" fill="none" stroke="' + HI + '" stroke-width="4"/>' + ang([cx, cy], a, b, 'θ', { r: 26 }) +
        t(f((cx + a[0]) / 2 + 12), f((cy + a[1]) / 2 + 12), 'r', { size: 16, weight: 'bold' }) + t(f(P(cx, cy, r + 18, 65)[0]), f(P(cx, cy, r + 18, 65)[1]), 'arc', { size: 14, fill: HI }) +
        caption(160, 240, 'Sector = θ/360 × πr²    Arc = θ/360 × 2πr')); },
    // a triangle labelled the GCSE way: side a opposite angle A, and so on
    abc: function (o) { o = o || {}; var A = [40, 190], B = [300, 190], Cc = [200, 40];
      return svg(340, 240, path([A, B, Cc], { fill: FILL }) + t(A[0] - 14, A[1] + 6, 'A', { size: 17, weight: 'bold' }) + t(B[0] + 14, B[1] + 6, 'B', { size: 17, weight: 'bold' }) + t(Cc[0], Cc[1] - 14, 'C', { size: 17, weight: 'bold' }) +
        t(270, 105, 'a', { size: 18, fill: HI, weight: 'bold' }) + t(105, 105, 'b', { size: 18, fill: HI, weight: 'bold' }) + t(170, 208, 'c', { size: 18, fill: HI, weight: 'bold' }) +
        ang(A, B, Cc, '', { r: 26, col: HI2 }) + ang(B, Cc, A, '', { r: 26, col: HI2 }) + ang(Cc, A, B, o.markC ? 'C' : '', { r: 22, col: HI2 }) + caption(170, 232, o.cap || 'Side a is opposite angle A, b opposite B, c opposite C')); },
    similar: function () { var s1 = [[30, 150], [130, 150], [60, 80]], k = 1.8, s2 = s1.map(function (p) { return [190 + (p[0] - 30) * k, 150 - (150 - p[1]) * k + 40]; });
      return svg(420, 210, path(s1, { fill: FILL }) + path(s2, { fill: FILL2 }) + t(80, 168, '5 cm', { size: 13 }) + t(190 + 90, 210 - 12, '9 cm', { size: 13 }) +
        '<path d="M140 110 Q165 90 190 110" fill="none" stroke="' + HI + '" stroke-width="2"/>' + t(165, 86, '× 1.8', { size: 15, fill: HI, weight: 'bold' }) + caption(210, 20, 'Same angles; every length × the same scale factor')); },
    scaleAreaVolume: function () {
      var sq = function (x, n, s) { var o = ''; for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) o += V.rect(x + i * s, 130 - (j + 1) * s, s, s, { fill: FILL }); return o; };
      return svg(440, 200, sq(20, 1, 30) + sq(90, 2, 30) + t(35, 150, '1', { size: 14 }) + t(120, 150, '4', { size: 14 }) + caption(110, 178, 'Lengths × 2 → area × 4', { max: 200 }) +
        cube(260, 120, 30) + cube(330, 120, 60) + t(275, 150, '1', { size: 14 }) + t(360, 150, '8', { size: 14 }) + caption(330, 178, 'Lengths × 2 → volume × 8', { max: 200 })); },
    cuboidDiagonal: function () { var x = 60, y = 70, w = 200, h = 100, dx = 70, dy = -40, A = [x, y + h], G1 = [x + w + dx, y + dy];
      return svg(380, 220, cuboid(x, y, w, h, dx, dy) + seg(A, G1, { stroke: HI, w: 3 }) + seg(A, [x + w + dx, y + h + dy], { stroke: HI2, w: 2, dash: '6 4' }) +
        t(x + w / 2, y + h + 18, 'a', { size: 16, weight: 'bold' }) + t(x + w + dx / 2 + 14, y + h + dy / 2 + 14, 'b', { size: 16, weight: 'bold' }) + t(x + w + dx + 14, y + h / 2 + dy, 'c', { size: 16, weight: 'bold' }) +
        t(200, 112, 'd', { size: 18, fill: HI, weight: 'bold' }) + caption(190, 210, 'd² = a² + b² + c²')); },
    exactTriangles: function () {
      var A = [30, 170], B = [170, 170], Cc = [170, 30], D = [220, 170], E = [380, 170], F = [220, 50];
      return svg(410, 210, path([A, B, Cc], { fill: FILL }) + right(B, A, Cc) + ang(A, B, Cc, '45°', { r: 30 }) + t(100, 188, '1', { size: 16 }) + t(186, 100, '1', { size: 16 }) + t(85, 92, '√2', { size: 16, fill: HI, weight: 'bold' }) +
        path([D, E, F], { fill: FILL2 }) + right(D, E, F) + ang(E, D, F, '30°', { r: 40 }) + ang(F, D, E, '60°', { r: 26 }) + t(300, 188, '√3', { size: 16 }) + t(206, 110, '1', { size: 16 }) + t(312, 98, '2', { size: 16, fill: HI, weight: 'bold' })); },
    vectors: function () { var Oo = [40, 170], A = [200, 170], B = [290, 60];
      return svg(340, 210, vec(Oo, A, HI2, 'a', -1) + vec(A, B, HI, 'b', -1) + vec(Oo, B, C.leaf, 'a + b', 1) + t(Oo[0] - 10, Oo[1] + 16, 'O', { size: 15, weight: 'bold' }) +
        caption(190, 200, 'a then b: the same journey as a + b', { max: 330 })); },
    perpBisector: function () { var A = [90, 120], B = [250, 120], m = 170;
      return svg(340, 240, seg(A, B) + dot(A) + dot(B) + t(A[0] - 14, A[1] + 4, 'A', { size: 16, weight: 'bold' }) + t(B[0] + 14, B[1] + 4, 'B', { size: 16, weight: 'bold' }) +
        '<path d="M' + (A[0] + 60) + ' 30 A110 110 0 0 1 ' + (A[0] + 60) + ' 210" fill="none" stroke="' + SOFT + '" stroke-width="1.6"/><path d="M' + (B[0] - 60) + ' 30 A110 110 0 0 0 ' + (B[0] - 60) + ' 210" fill="none" stroke="' + SOFT + '" stroke-width="1.6"/>' +
        seg([m, 20], [m, 220], { stroke: HI, w: 2.5 }) + ticks(A, [m, 120], 1) + ticks([m, 120], B, 1) + right([m, 120], B, [m, 20], 11) + caption(170, 234, 'Same-size arcs from A and B; join the crossings')); },
    angleBisector: function () { var V0 = [50, 190], A = [300, 190], B = P(50, 190, 260, 50);
      return svg(330, 220, seg(V0, A) + seg(V0, B) + '<path d="' + 'M' + f(P(50, 190, 110, 8)[0]) + ' ' + f(P(50, 190, 110, 8)[1]) + ' A110 110 0 0 0 ' + f(P(50, 190, 110, 42)[0]) + ' ' + f(P(50, 190, 110, 42)[1]) + '" fill="none" stroke="' + SOFT + '" stroke-width="1.6"/>' +
        seg(V0, P(50, 190, 280, 25), { stroke: HI, w: 2.5 }) + ang(V0, A, P(50, 190, 280, 25), '', { r: 50, col: HI2 }) + ang(V0, P(50, 190, 280, 25), B, '', { r: 56, col: HI2 }) + caption(165, 212, 'The bisector splits the angle into two equal angles')); },
    loci: function () {
      return many([[170, 170, circ(85, 80, 60, { stroke: HI, w: 2.5 }) + dot([85, 80]) + seg([85, 80], [145, 80], { dash: '4 4' }) + t(115, 70, '3 cm', { size: 13 }) + caption(85, 160, '3 cm from a point')],
        [230, 170, seg([60, 80], [170, 80], { w: 3 }) + '<path d="M60 40 H170 A40 40 0 0 1 170 120 H60 A40 40 0 0 1 60 40 Z" fill="none" stroke="' + HI + '" stroke-width="2.5"/>' + caption(115, 160, 'A fixed distance from a line')]]); },
    quads: function () {
      var sh = function (pts, name, extra) { return [140, 130, path(pts, { fill: FILL }) + (extra || '') + caption(70, 122, name, { fill: INK })]; };
      var sqr = [[20, 20], [110, 20], [110, 100], [20, 100]], rec = [[10, 30], [130, 30], [130, 95], [10, 95]], rh = [[70, 10], [125, 55], [70, 100], [15, 55]], par = [[35, 25], [135, 25], [105, 95], [5, 95]], kite = [[70, 10], [115, 45], [70, 105], [25, 45]], trap = [[40, 25], [100, 25], [130, 95], [10, 95]];
      return many([
        sh(sqr, 'Square', ticks(sqr[0], sqr[1], 1) + ticks(sqr[1], sqr[2], 1) + ticks(sqr[2], sqr[3], 1) + ticks(sqr[3], sqr[0], 1) + right(sqr[0], sqr[1], sqr[3])),
        sh(rec, 'Rectangle', ticks(rec[0], rec[1], 1) + ticks(rec[2], rec[3], 1) + ticks(rec[1], rec[2], 2) + ticks(rec[3], rec[0], 2) + right(rec[0], rec[1], rec[3])),
        sh(rh, 'Rhombus', ticks(rh[0], rh[1], 1) + ticks(rh[1], rh[2], 1) + ticks(rh[2], rh[3], 1) + ticks(rh[3], rh[0], 1)),
        sh(par, 'Parallelogram', arrows(par[0], par[1], 1) + arrows(par[3], par[2], 1) + arrows(par[3], par[0], 2) + arrows(par[2], par[1], 2)),
        sh(kite, 'Kite', ticks(kite[0], kite[1], 1) + ticks(kite[0], kite[3], 1) + ticks(kite[1], kite[2], 2) + ticks(kite[3], kite[2], 2)),
        sh(trap, 'Trapezium', arrows(trap[0], trap[1], 1) + arrows(trap[3], trap[2], 1))], 16, 3); },
    congruence: function () {
      var tri = [[10, 90], [110, 90], [40, 20]], tr = function (name, extra) { return [130, 125, path(tri, { fill: FILL }) + extra + caption(60, 116, name, { fill: INK, weight: 'bold' })]; };
      return many([tr('SSS', ticks(tri[0], tri[1], 1) + ticks(tri[1], tri[2], 2) + ticks(tri[2], tri[0], 3)),
        tr('SAS', ticks(tri[0], tri[1], 1) + ticks(tri[2], tri[0], 2) + ang(tri[0], tri[1], tri[2], '', { r: 18 })),
        tr('ASA', ticks(tri[0], tri[1], 1) + ang(tri[0], tri[1], tri[2], '', { r: 18 }) + ang(tri[1], tri[2], tri[0], '', { r: 18, col: HI2 })),
        [130, 125, path([[10, 90], [110, 90], [10, 20]], { fill: FILL }) + right([10, 90], [110, 90], [10, 20]) + ticks([110, 90], [10, 20], 2) + ticks([10, 90], [110, 90], 1) + caption(60, 116, 'RHS', { fill: INK, weight: 'bold' })]], 20, 2); },
    parallel: function () { var L1 = [[20, 70], [380, 70]], L2 = [[20, 170], [380, 170]], T1 = [120, 230], T2 = [300, 10], X1 = [272, 70], X2 = [168, 170];
      return svg(400, 280, seg(L1[0], L1[1]) + seg(L2[0], L2[1]) + arrows(L1[0], L1[1], 1) + arrows(L2[0], L2[1], 1) + seg(T1, T2, { stroke: SOFT }) +
        ang(X1, T1, L1[0], 'a', { r: 26, gap: 12 }) + ang(X2, T2, L2[1], 'a', { r: 26, gap: 12 }) + ang(X1, L1[1], T1, 'b', { r: 30, col: HI2, gap: 10 }) + ang(X2, T2, L2[1], '', { r: 0.1 }) + ang(X2, L2[1], T2, '', { r: 0.1 }) +
        caption(200, 262, 'Alternate angles (a) are equal; a + b = 180° on a straight line', { max: 390 })); },
    polygonSplit: function () { var pts = []; for (var i = 0; i < 5; i++) pts.push(P(130, 120, 95, 90 + i * 72));
      return svg(380, 240, path(pts, { fill: FILL }) + seg(pts[0], pts[2], { stroke: HI, dash: '6 4' }) + seg(pts[0], pts[3], { stroke: HI, dash: '6 4' }) + t(130, 140, '3 triangles', { size: 14, fill: HI }) +
        t(300, 90, 'Interior angles', { size: 14, weight: 'bold' }) + t(300, 112, '(n − 2) × 180°', { size: 15 }) + t(300, 134, '= 3 × 180° = 540°', { size: 15 }) + t(300, 170, 'Exterior angles', { size: 14, weight: 'bold' }) + t(300, 192, 'add up to 360°', { size: 15 })); },
    symmetry: function () {
      return many([[140, 150, path([[70, 15], [125, 110], [15, 110]], { fill: FILL }) + seg([70, 5], [70, 125], { stroke: HI, dash: '6 4' }) + caption(70, 140, 'one line of symmetry')],
        [140, 150, V.rect(25, 25, 90, 90, { fill: FILL }) + seg([70, 15], [70, 125], { stroke: HI, dash: '6 4' }) + seg([15, 70], [125, 70], { stroke: HI, dash: '6 4' }) + seg([15, 15], [125, 125], { stroke: HI, dash: '6 4' }) + seg([125, 15], [15, 125], { stroke: HI, dash: '6 4' }) + caption(70, 140, 'square: 4 lines, order 4')],
        [140, 150, path([[70, 15], [90, 55], [130, 65], [95, 85], [105, 125], [70, 105], [35, 125], [45, 85], [10, 65], [50, 55]], { fill: FILL2 }) + caption(70, 140, 'rotation order 5')]]); },
    angleSums: function () {
      var tri = [[20, 120], [160, 120], [70, 20]], q = [[200, 120], [340, 120], [310, 30], [220, 40]];
      return svg(360, 160, path(tri, { fill: FILL }) + ang(tri[0], tri[1], tri[2], 'a', { r: 22 }) + ang(tri[1], tri[2], tri[0], 'b', { r: 22 }) + ang(tri[2], tri[0], tri[1], 'c', { r: 20 }) + caption(90, 148, 'a + b + c = 180°') +
        path(q, { fill: FILL2 }) + q.map(function (p, i) { return ang(p, q[(i + 1) % 4], q[(i + 3) % 4], '', { r: 18, col: HI2 }); }).join('') + caption(270, 148, 'quadrilateral: 360°')); },
    samePerimeter: function () { var cell = 22, g = function (x, w, h, col) { var o = ''; for (var i = 0; i < w; i++) for (var j = 0; j < h; j++) o += V.rect(x + i * cell, 20 + j * cell, cell, cell, { fill: col, w: 1 }); return o; };
      var lab2 = function (y, s) { return t(300, y, s, { size: 13, fill: INK, anchor: 'start' }); };
      return svg(440, 200, g(10, 4, 3, FILL) + lab2(50, 'area 12') + lab2(68, 'perimeter 14') +
        g(10, 6, 2, FILL2).replace(/y="(\d+)"/g, function (m, v) { return 'y="' + (+v + 80) + '"'; }) + lab2(115, 'area 12') + lab2(133, 'perimeter 16') +
        g(10, 12, 1, C.leafLight).replace(/y="(\d+)"/g, function (m, v) { return 'y="' + (+v + 150) + '"'; }) + lab2(180, 'area 12, perimeter 26')); },
    cuboidVolume: function () { return svg(360, 200, cuboid(80, 70, 170, 80, 60, -40) + t(165, 168, 'length', { size: 14 }) + t(292, 138, 'width', { size: 14 }) + t(72, 110, 'height', { size: 14, anchor: 'end' }) + caption(180, 192, 'Volume = length × width × height')); },
    // y = mx + c: a line on a grid with its gradient triangle and where it crosses the y-axis
    straightLine: function () { return graph(function (x) { return 2 * x + 1; }, { label: 'y = 2x + 1', tri: [1, 2], mark: [0, 1], markLabel: '', cap: 'Gradient m = 2 (up 2 for every 1 across); crosses the y-axis at c = 1' }); },
    perpendicular: function () { return graph([function (x) { return 2 * x - 1; }, function (x) { return -0.5 * x + 4; }], { label: ['y = 2x − 1', 'y = −½x + 4'], right: [2, 3], cap: 'Gradients 2 and −½ multiply to −1' }); },
    transform: function () { return graph([function (x) { return x * x; }, function (x) { return x * x + 3; }, function (x) { return (x - 2) * (x - 2); }], { label: ['y = x²', 'y = x² + 3 (up 3)', 'y = (x − 2)² (right 2)'], ymax: 10, ymin: -1 }); },
    exponential: function () { return graph([function (x) { return Math.pow(2, x); }, function (x) { return Math.pow(0.5, x); }], { label: ['y = 2ˣ (growth)', 'y = (½)ˣ (decay)'], ymax: 9, ymin: -1, xmin: -3, xmax: 3 }); },
    circleGraph: function () { return graph([function () { return NaN; }], { circle: 5, equal: true, label: ['x² + y² = 25'], ymin: -6, ymax: 6, xmin: -6, xmax: 6, tangentAt: [3, 4], cap: 'The tangent at (3, 4) is at 90° to the radius' }); },
    turningPoint: function () { return graph(function (x) { return (x - 2) * (x - 2) - 3; }, { label: 'y = (x − 2)² − 3', mark: [2, -3], markLabel: 'turning point (2, −3)', ymin: -4, ymax: 6, xmin: -2, xmax: 6 }); },
    quadRoots: function () { return graph(function (x) { return (x - 1) * (x - 4); }, { label: 'y = (x − 1)(x − 4)', roots: [1, 4], ymin: -3, ymax: 6, xmin: -1, xmax: 6, cap: 'The solutions of (x − 1)(x − 4) = 0 are where it crosses the x-axis' }); },
    simultaneous: function () { return graph([function (x) { return x + 1; }, function (x) { return 7 - x; }], { label: ['y = x + 1', 'y = 7 − x'], mark: [3, 4], markLabel: 'x = 3, y = 4', ymin: -1, ymax: 8, xmin: -1, xmax: 7 }); },
    inequalityLine: function () {
      var X = function (v) { return 30 + (v + 1) * 40; }, o = seg([20, 50], [370, 50]); for (var v = -1; v <= 7; v++) o += seg([X(v), 44], [X(v), 56]) + t(X(v), 72, String(v).replace('-', '−'), { size: 13 });
      return svg(390, 130, o + seg([X(2), 30], [X(5), 30], { stroke: HI, w: 4 }) + circ(X(2), 30, 7, { fill: '#fff', stroke: HI, w: 3 }) + circ(X(5), 30, 7, { fill: HI, stroke: HI, w: 3 }) +
        caption(195, 100, '2 < x ≤ 5: open circle (not included), filled circle (included)')); },
    tree: function (o) { o = o || {};
      var b = '', x0 = 20, y0 = 120, x1 = 150, x2 = 290, ys1 = [60, 180], ys2 = [[30, 90], [150, 210]], p = o.p || ['3/5', '2/5'], q = o.q || [['3/5', '2/5'], ['3/5', '2/5']], n = o.n || ['Red', 'Blue'];
      [0, 1].forEach(function (i) { b += seg([x0, y0], [x1 - 8, ys1[i]]) + t((x0 + x1) / 2 - 6, (y0 + ys1[i]) / 2 + (i ? 14 : -10), p[i], { size: 14, fill: HI }) + t(x1 + 18, ys1[i], n[i], { size: 14, weight: 'bold' });
        [0, 1].forEach(function (j) { b += seg([x1 + 48, ys1[i]], [x2 - 8, ys2[i][j]]) + t((x1 + 48 + x2) / 2 - 4, (ys1[i] + ys2[i][j]) / 2 + (j ? 13 : -9), q[i][j], { size: 13, fill: HI }) + t(x2 + 18, ys2[i][j], n[j], { size: 14, weight: 'bold' }); }); });
      return svg(420, 262, b + caption(210, 248, o.r || 'Multiply along the branches: P(Red, Red) = 3/5 × 3/5 = 9/25', { size: 13, max: 410 }) + caption(85, 14, '1st pick', { size: 12 }) + caption(240, 14, '2nd pick', { size: 12 })); },
    dice: function () { var s = 30, b = '', x0 = 50, y0 = 40;
      for (var i = 1; i <= 6; i++) { b += t(x0 + (i - 0.5) * s, y0 - 12, i, { size: 14, weight: 'bold' }) + t(x0 - 14, y0 + (i - 0.5) * s, i, { size: 14, weight: 'bold' }); for (var j = 1; j <= 6; j++) b += V.rect(x0 + (j - 1) * s, y0 + (i - 1) * s, s, s, { fill: i + j === 7 ? FILL2 : '#fff', w: 1 }) + t(x0 + (j - 0.5) * s, y0 + (i - 0.5) * s, i + j, { size: 13 }); }
      return svg(330, 250, b + t(260, 120, 'Total of', { size: 13, fill: SOFT }) + t(260, 138, 'two dice', { size: 13, fill: SOFT }) + caption(165, 242, 'P(total 7) = 6/36: shaded cells')); },
    probScale: function () { var X = function (v) { return 30 + v * 340; }, b = seg([30, 60], [370, 60], { w: 3 });
      [[0, '0', 'impossible'], [0.25, '', 'unlikely'], [0.5, '½', 'even chance'], [0.75, '', 'likely'], [1, '1', 'certain']].forEach(function (k) { b += seg([X(k[0]), 50], [X(k[0]), 70]) + t(X(k[0]), 88, k[1], { size: 14, weight: 'bold' }) + t(X(k[0]), 34, k[2], { size: 12, fill: SOFT }); });
      return svg(400, 110, b); },
    boxPlot: function () { var X = function (v) { return 30 + v * 6.5; }, y = 60, s = [8, 20, 31, 38, 52];
      var b = seg([X(0), 105], [X(55), 105], { stroke: SOFT }); for (var v = 0; v <= 55; v += 5) b += seg([X(v), 100], [X(v), 110], { stroke: SOFT }) + t(X(v), 124, v, { size: 11, fill: SOFT });
      b += seg([X(s[0]), y], [X(s[1]), y]) + seg([X(s[3]), y], [X(s[4]), y]) + V.rect(X(s[1]), y - 20, X(s[3]) - X(s[1]), 40, { fill: FILL }) + seg([X(s[2]), y - 20], [X(s[2]), y + 20], { stroke: HI, w: 3 }) + seg([X(s[0]), y - 10], [X(s[0]), y + 10]) + seg([X(s[4]), y - 10], [X(s[4]), y + 10]);
      ['min', 'Q1', 'median', 'Q3', 'max'].forEach(function (n, i) { b += t(X(s[i]), 22, n, { size: 12, fill: i === 2 ? HI : SOFT, weight: 'bold' }); });
      return svg(400, 160, b + caption(200, 150, 'Interquartile range = Q3 − Q1 = 18')); },
    ratioBar: function (o) { o = o || {}; var a = o.a || 3, b2 = o.b || 2, w = 50, s = '';
      for (var i = 0; i < a; i++) s += V.rect(80 + i * w, 20, w, 40, { fill: FILL }); for (var j = 0; j < b2; j++) s += V.rect(80 + j * w, 80, w, 40, { fill: FILL2 });
      return svg(Math.max(380, 80 + Math.max(a, b2) * w + 30), 160, s + t(70, 40, o.n1 || 'Ali', { size: 14, anchor: 'end', weight: 'bold' }) + t(70, 100, o.n2 || 'Ben', { size: 14, anchor: 'end', weight: 'bold' }) + caption(190, 148, o.cap || 'Ratio 3 : 2 → 5 equal parts in total', { max: 370 })); },
    fractionCompare: function () { return svg(400, 140, bar(70, 15, 300, 3, 2, FILL) + bar(70, 70, 300, 4, 3, FILL2) + t(60, 35, '2/3', { size: 16, anchor: 'end', weight: 'bold' }) + t(60, 90, '3/4', { size: 16, anchor: 'end', weight: 'bold' }) + caption(220, 130, 'The same whole: 3/4 covers more, so 3/4 > 2/3', { max: 390 })); },
    mixedNumber: function () { var b = '';
      [0, 1].forEach(function (k) { var cx = 70 + k * 120, cy = 70, r = 50; for (var i = 0; i < 4; i++) { var a1 = 90 - i * 90, a2 = a1 - 90, p1 = P(cx, cy, r, a1), p2 = P(cx, cy, r, a2), full = k === 0 || i < 3;
        b += '<path d="M' + cx + ' ' + cy + ' L' + f(p1[0]) + ' ' + f(p1[1]) + ' A' + r + ' ' + r + ' 0 0 1 ' + f(p2[0]) + ' ' + f(p2[1]) + ' Z" fill="' + (full ? FILL2 : '#fff') + '" stroke="' + INK + '" stroke-width="2"/>'; } });
      return svg(330, 160, b + caption(130, 145, '1 ¾ = 7/4 (seven quarters)', { fill: INK }) + t(290, 70, '= 7/4', { size: 18, fill: HI, weight: 'bold' })); },
    fractionAdd: function () {
      return svg(420, 190, bar(60, 10, 340, 8, 3, FILL) + bar(60, 60, 340, 8, 2, FILL2) + bar(60, 110, 340, 8, 5, C.leafLight) + t(50, 30, '3/8', { size: 15, anchor: 'end', weight: 'bold' }) + t(50, 80, '+ 2/8', { size: 15, anchor: 'end', weight: 'bold' }) + t(50, 130, '= 5/8', { size: 15, anchor: 'end', weight: 'bold', fill: HI }) +
        caption(210, 176, 'Same denominator: add the numerators', { max: 410 })); },
    fractionMultiply: function () { var s = 40, b = '';
      for (var i = 0; i < 4; i++) for (var j = 0; j < 3; j++) b += V.rect(40 + i * s, 20 + j * s, s, s, { fill: i < 3 && j < 2 ? C.plumLight : i < 3 ? FILL : j < 2 ? FILL2 : '#fff', w: 1.5 });
      return svg(380, 170, b + t(100, 14, '3/4', { size: 14, fill: HI2, weight: 'bold' }) + t(26, 60, '2/3', { size: 14, fill: '#b86e10', weight: 'bold', anchor: 'end' }) + t(280, 60, '2/3 × 3/4 = 6/12', { size: 16, weight: 'bold' }) + t(280, 84, '= 1/2', { size: 16, weight: 'bold' }) + caption(190, 160, 'The overlap is 6 of the 12 small pieces')); },
    fractionDivide: function () { var b = '', w = 360;
      b += V.rect(20, 20, w * 0.5, 40, { fill: FILL }) + V.rect(20 + w * 0.5, 20, w * 0.5, 40, { fill: '#fff' }) + t(20 + w * 0.25, 40, '1/2', { size: 15, weight: 'bold' });
      for (var i = 0; i < 3; i++) b += V.rect(20 + i * w / 6, 80, w / 6, 40, { fill: i === 0 ? FILL2 : FILL });
      return svg(400, 170, b + V.rect(20 + w * 0.5, 80, w * 0.5, 40, { fill: '#fff' }) + t(20 + w / 12, 100, '1/6', { size: 14, weight: 'bold' }) + caption(200, 150, '1/2 ÷ 3: share a half into 3 equal parts → each is 1/6')); },
    factorArrays: function () { var a = function (rws, cls, s) { var o = ''; for (var r = 0; r < rws; r++) for (var c = 0; c < cls; c++) o += '<circle cx="' + (10 + c * s) + '" cy="' + (10 + r * s) + '" r="' + (s * 0.35) + '" fill="' + C.amber + '"/>'; return o; };
      return many([[300, 56, a(1, 12, 24) + caption(140, 44, '1 × 12')], [150, 80, a(2, 6, 24) + caption(65, 70, '2 × 6')], [110, 104, a(3, 4, 24) + caption(40, 96, '3 × 4')]], 24, 1).replace(/viewBox="0 0 (\d+) (\d+)"/, function (m, w, h) { return 'viewBox="0 0 ' + w + ' ' + (+h + 34) + '"'; }).replace('</svg>', '') + t(150, 278, '12 has factors 1, 2, 3, 4, 6 and 12', { size: 14, fill: HI, weight: 'bold' }) + '</svg>'; },
    prime: function () { var o = ''; for (var c = 0; c < 7; c++) o += '<circle cx="' + (20 + c * 26) + '" cy="30" r="9" fill="' + C.amber + '"/>';
      return svg(360, 90, o + caption(180, 70, '7 dots make only one rectangle (1 × 7): 7 is prime')); },
    mapScale: function () { var b = V.rect(20, 20, 330, 120, { fill: C.leafLight, w: 1.5 }) + '<path d="M40 110 C90 60 170 120 230 70 S320 50 330 40" fill="none" stroke="' + HI2 + '" stroke-width="4"/>' + dot([70, 90], { r: 5 }) + dot([300, 50], { r: 5 }) + t(70, 108, 'Ash', { size: 12 }) + t(300, 70, 'Bay', { size: 12 });
      for (var i = 0; i < 4; i++) b += V.rect(40 + i * 40, 150, 40, 10, { fill: i % 2 ? '#fff' : INK, w: 1 });
      return svg(370, 200, b + t(40, 176, '0', { size: 12 }) + t(120, 176, '1 km', { size: 12 }) + t(200, 176, '2 km', { size: 12 }) + caption(185, 194, 'Scale 1 : 25 000 — 4 cm on the map is 1 km')); },
    proportionGraphs: function () {
      return many([[200, 200, miniGraph(function (x) { return 1.5 * x; }) + caption(100, 190, 'direct: y = kx')], [200, 200, miniGraph(function (x) { return 12 / x; }, 0.5) + caption(100, 190, 'inverse: y = k / x')]]); },
    speedTriangle: function () { var A = [130, 20], B = [30, 170], Cc = [230, 170];
      return svg(260, 200, path([A, B, Cc], { fill: FILL }) + seg([60, 110], [200, 110]) + seg([130, 110], [130, 170]) + t(130, 85, 'D', { size: 24, weight: 'bold' }) + t(92, 142, 'S', { size: 24, weight: 'bold' }) + t(168, 142, 'T', { size: 24, weight: 'bold' }) +
        caption(130, 192, 'S = D ÷ T · T = D ÷ S · D = S × T')); },
    enlargeNegative: function () { var Cc = [200, 110], A = [[240, 70], [280, 70], [240, 40]], B = A.map(function (p) { return [Cc[0] - (p[0] - Cc[0]), Cc[1] - (p[1] - Cc[1])]; });
      return svg(400, 250, A.map(function (p, i) { return seg(p, B[i], { stroke: SOFT, dash: '5 4' }); }).join('') + path(A, { fill: FILL }) + path(B, { fill: FILL2 }) + dot(Cc, { r: 4.5, fill: HI }) + t(Cc[0] - 26, Cc[1] + 4, 'centre', { size: 12, fill: HI, anchor: 'end' }) +
        t(270, 30, 'object', { size: 12, fill: SOFT }) + t(112, 160, 'image', { size: 12, fill: SOFT, anchor: 'end' }) + caption(200, 232, 'Scale factor −1: through the centre and out the other side, upside down', { max: 390, size: 13 })); },
    combineTransform: function () { var s = 22, b = '', X = function (x) { return 20 + x * s; }, Y = function (y) { return 20 + y * s; };
      for (var i = 0; i <= 14; i++) b += seg([X(i), Y(0)], [X(i), Y(8)], { stroke: C.grid, w: 1 }); for (var j = 0; j <= 8; j++) b += seg([X(0), Y(j)], [X(14), Y(j)], { stroke: C.grid, w: 1 });
      var A = [[2, 1], [4, 1], [2, 3]], B = A.map(function (p) { return [14 - p[0], p[1]]; }), Cc = B.map(function (p) { return [p[0], 8 - p[1]]; }), sc = function (pts) { return pts.map(function (p) { return [X(p[0]), Y(p[1])]; }); };
      return svg(350, 262, b + seg([X(7), Y(0) - 6], [X(7), Y(8) + 6], { stroke: HI, dash: '6 4', w: 2.5 }) + seg([X(0) - 6, Y(4)], [X(14) + 6, Y(4)], { stroke: HI2, dash: '6 4', w: 2.5 }) +
        path(sc(A), { fill: FILL }) + path(sc(B), { fill: FILL2 }) + path(sc(Cc), { fill: C.leafLight }) + t(X(2.6), Y(1.6), 'A', { size: 14, weight: 'bold' }) + t(X(11.4), Y(1.6), 'B', { size: 14, weight: 'bold' }) + t(X(11.4), Y(6.4), 'C', { size: 14, weight: 'bold' }) +
        caption(175, 230, 'A → B: reflect in the red line. B → C: reflect in the blue line.', { size: 13, max: 340 }) + caption(175, 252, 'A → C in one move: a half turn about where the lines cross', { size: 13, fill: HI })); }
  };
  function bar(x, y, w, d, n, col) { var o = ''; for (var i = 0; i < d; i++) o += V.rect(x + i * w / d, y, w / d, 40, { fill: i < n ? col : '#fff' }); return o; }
  function cube(x, y, s) { var d = s * 0.4; return path([[x, y], [x + s, y], [x + s, y - s], [x, y - s]], { fill: FILL }) + path([[x, y - s], [x + d, y - s - d], [x + s + d, y - s - d], [x + s, y - s]], { fill: '#e6f0fd' }) + path([[x + s, y], [x + s + d, y - d], [x + s + d, y - s - d], [x + s, y - s]], { fill: '#b9d2f7' }); }
  function cuboid(x, y, w, h, dx, dy) { return path([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], { fill: FILL }) + path([[x, y], [x + dx, y + dy], [x + w + dx, y + dy], [x + w, y]], { fill: '#e6f0fd' }) + path([[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + w, y + h]], { fill: '#b9d2f7' }) +
    seg([x, y + h], [x + dx, y + h + dy], { stroke: SOFT, dash: '4 4', w: 1.5 }) + seg([x + dx, y + h + dy], [x + w + dx, y + h + dy], { stroke: SOFT, dash: '4 4', w: 1.5 }) + seg([x + dx, y + dy], [x + dx, y + h + dy], { stroke: SOFT, dash: '4 4', w: 1.5 }); }
  // a small set of axes with one curve, for side-by-side comparisons
  function miniGraph(fn, from) { var o = seg([20, 160], [190, 160]) + seg([20, 160], [20, 10]) + arrowHead([20, 160], [190, 160]) + arrowHead([20, 160], [20, 10]), d = '';
    for (var x = from || 0; x <= 10; x += 0.1) { var y = fn(x); if (y > 10 || y < 0) continue; d += (d ? ' L' : 'M') + f(20 + x * 16) + ' ' + f(160 - y * 14); }
    return o + '<path d="' + d + '" fill="none" stroke="' + HI + '" stroke-width="3"/>' + t(185, 176, 'x', { size: 12 }) + t(10, 14, 'y', { size: 12 }); }
  // axes on a grid with one or more functions plotted, and optional markers
  function graph(fns, o) {
    o = o || {}; fns = [].concat(fns); var labels = [].concat(o.label || []);
    var xmin = o.xmin === undefined ? -1 : o.xmin, xmax = o.xmax === undefined ? 5 : o.xmax, ymin = o.ymin === undefined ? -2 : o.ymin, ymax = o.ymax === undefined ? 12 : o.ymax;
    var W = 380, H = 300, pad = 30, sx = (W - 2 * pad) / (xmax - xmin), sy = (H - 2 * pad - 20) / (ymax - ymin);
    if (o.equal) { sx = sy = Math.min(sx, sy); W = sx * (xmax - xmin) + 2 * pad; }
    var X = function (x) { return pad + (x - xmin) * sx; }, Y = function (y) { return pad + (ymax - y) * sy; }, b = '', cols = [HI, HI2, C.leaf];
    for (var x = Math.ceil(xmin); x <= xmax; x++) b += seg([X(x), Y(ymin)], [X(x), Y(ymax)], { stroke: C.grid, w: 1 }) + (x ? t(X(x), Y(0) + 13, String(x).replace('-', '−'), { size: 10, fill: SOFT }) : '');
    var ystep = ymax - ymin > 14 ? 2 : 1;
    for (var y = Math.ceil(ymin); y <= ymax; y++) b += seg([X(xmin), Y(y)], [X(xmax), Y(y)], { stroke: C.grid, w: 1 }) + (y && y % ystep === 0 ? t(X(0) - 9, Y(y), String(y).replace('-', '−'), { size: 10, fill: SOFT, anchor: 'end' }) : '');
    b += seg([X(xmin), Y(0)], [X(xmax), Y(0)], { w: 1.8 }) + seg([X(0), Y(ymin)], [X(0), Y(ymax)], { w: 1.8 }) + t(X(xmax) - 4, Y(0) - 10, 'x', { size: 13 }) + t(X(0) + 10, Y(ymax) + 6, 'y', { size: 13 });
    fns.forEach(function (fn, i) { var d = ''; for (var x2 = xmin; x2 <= xmax + 1e-9; x2 += (xmax - xmin) / 200) { var y2 = fn(x2); if (!isFinite(y2) || y2 > ymax + 0.5 || y2 < ymin - 0.5) { if (d && d.slice(-1) !== 'M') d += ' M'; continue; } d += (d === '' || d.slice(-1) === 'M' ? (d ? '' : 'M') : ' L') + f(X(x2)) + ' ' + f(Y(y2)); }
      if (d) b += '<path d="' + d.replace(/M\s*$/, '') + '" fill="none" stroke="' + cols[i % 3] + '" stroke-width="3"/>'; });
    if (o.circle) { b += '<ellipse cx="' + f(X(0)) + '" cy="' + f(Y(0)) + '" rx="' + f(o.circle * sx) + '" ry="' + f(o.circle * sy) + '" fill="none" stroke="' + HI + '" stroke-width="3"/>'; }
    if (o.tangentAt) { var tx = o.tangentAt[0], ty = o.tangentAt[1], m = -tx / ty; b += seg([X(0), Y(0)], [X(tx), Y(ty)], { stroke: SOFT, dash: '5 4' }) + seg([X(tx - 2.5), Y(ty - 2.5 * m)], [X(tx + 2.5), Y(ty + 2.5 * m)], { stroke: HI2, w: 2.5 }) + dot([X(tx), Y(ty)]); }
    if (o.tri) { var x0 = o.tri[0], f0 = fns[0], y0 = f0(x0), y1 = f0(x0 + 1); b += seg([X(x0), Y(y0)], [X(x0 + 1), Y(y0)], { stroke: HI2, w: 2.5 }) + seg([X(x0 + 1), Y(y0)], [X(x0 + 1), Y(y1)], { stroke: HI2, w: 2.5 }) + t(X(x0 + 0.5), Y(y0) + 13, '1', { size: 12, fill: HI2, weight: 'bold' }) + t(X(x0 + 1) + 16, Y((y0 + y1) / 2), String(o.tri[1]), { size: 12, fill: HI2, weight: 'bold' }); }
    if (o.mark) b += dot([X(o.mark[0]), Y(o.mark[1])], { r: 5, fill: HI2 }) + t(X(o.mark[0]) + 8, Y(o.mark[1]) + 16, o.markLabel || '', { size: 12, fill: HI2, anchor: 'start', weight: 'bold' });
    if (o.roots) o.roots.forEach(function (rt) { b += dot([X(rt), Y(0)], { r: 5, fill: HI2 }); });
    if (o.right) { var px = o.right[0], py = o.right[1]; b += dot([X(px), Y(py)], { r: 4 }); }
    var key = labels.map(function (s, i) { return t(W - 10, 14 + i * 17, s, { size: 12, fill: cols[i % 3], anchor: 'end', weight: 'bold' }); }).join('');
    return svg(W, H + (o.cap ? 30 : 0), '<rect width="' + W + '" height="' + H + '" fill="#fff"/>' + b + key + (o.cap ? caption(W / 2, H + 14, o.cap, { size: 12, max: W - 10 }) : ''));
  }

  // ---------- which lessons get which pictures ----------
  // [slide number, picture] adds a picture to that slide; { say, vis } slides are added at the end; replace: whole new slides
  function L(fn, a) { return function () { return ill[fn](a); }; }
  var LESSONS = {
    'Y11-G10': { replace: [
      { say: 'The <b>angle at the centre is twice the angle at the circumference</b>, when both stand on the same arc AB.', vis: L('centre') },
      { say: 'The <b>angle in a semicircle is 90°</b>: when AB is a diameter, the angle at C on the circle is a right angle.', vis: L('semi') },
      { say: '<b>Opposite angles of a cyclic quadrilateral add up to 180°</b>. A cyclic quadrilateral has all four corners on the circle.', vis: L('cyclic') },
      { say: '<b>Angles in the same segment are equal</b>: angles at C and D, standing on the same chord AB on the same side, are equal.', vis: L('segment') },
      { say: 'A <b>tangent meets a radius at 90°</b>. A tangent touches the circle at one point, T.', vis: L('tangent') },
      { say: 'The <b>alternate segment theorem</b>: the angle between a tangent and a chord equals the angle in the alternate segment.', vis: L('alternate') }] },
    'Y11-G18': { pics: [[0, 'sector']] },
    'Y11-G22': { pics: [[0, 'abc']] },
    'Y11-G23': { pics: [[0, function () { return ill.abc({ markC: true, cap: 'Area = ½ab sin C: two sides and the angle between them' }); }]] },
    'Y11-G19': { pics: [[0, 'similar']] }, 'Y6-R-03': { pics: [[0, 'similar']] },
    'Y11-G19H': { pics: [[0, 'scaleAreaVolume']] }, 'Y11-R12': { pics: [[0, 'scaleAreaVolume']] },
    'Y11-G20H': { pics: [[0, 'cuboidDiagonal']] },
    'Y11-G21': { pics: [[0, 'exactTriangles']] },
    'Y11-G25': { pics: [[0, 'vectors']] }, 'Y11-G25H': { pics: [[0, 'vectors']] },
    'Y11-G2': { pics: [[0, 'perpBisector']], add: [{ say: 'A <b>locus</b> is all the points that follow a rule, such as “3 cm from a point” or “a fixed distance from a line”.', vis: L('loci') }] },
    'Y8-G04': { pics: [[0, 'perpBisector']], add: [{ say: 'To <b>bisect an angle</b>, draw an arc from the corner, then equal arcs from where it crosses each arm, and join the corner to where they meet.', vis: L('angleBisector') }] },
    'Y11-G4': { pics: [[0, 'quads']] }, 'Y9-G-06': { pics: [[0, 'quads']] },
    'Y11-G5': { pics: [[0, 'congruence']] }, 'Y9-G-04': { pics: [[0, 'congruence']] },
    'Y9-G-05': { pics: [[0, 'parallel']] }, 'Y11-G6': { pics: [[0, 'parallel']] },
    'Y7-G-03': { pics: [[0, 'polygonSplit']] },
    'Y7-G-05': { pics: [[0, 'symmetry']] },
    'Y6-G-03': { pics: [[0, 'angleSums']] },
    'Y6-M-04': { pics: [[0, 'samePerimeter']] },
    'Y6-M-05': { pics: [[0, 'cuboidVolume']] },
    'Y11-G7H': { pics: [[0, 'enlargeNegative']] },
    'Y11-G8': { pics: [[0, 'combineTransform']] },
    'Y10-A9': { pics: [[0, 'straightLine']] },
    'Y10-A9H': { pics: [[0, 'perpendicular']] },
    'Y10-A13': { pics: [[0, 'transform']] },
    'Y10-A14H': { pics: [[0, 'exponential']] },
    'Y10-A16': { pics: [[0, 'circleGraph']] },
    'Y10-A11H': { pics: [[0, 'turningPoint']] },
    'Y10-A18': { pics: [[0, 'quadRoots']] },
    'Y10-A19': { pics: [[0, 'simultaneous']] },
    'Y10-A22': { pics: [[0, 'inequalityLine']] },
    'Y9-P-01': { pics: [[0, 'tree']] }, 'Y10-P8': { pics: [[0, function () { return ill.tree({ q: [['2/4', '2/4'], ['3/4', '1/4']], r: 'Without replacement: the second-pick fractions change' }); }]] },
    'Y10-P7': { pics: [[0, 'dice']] },
    'Y7-P-01': { pics: [[0, 'probScale']] },
    'Y11-S4H': { pics: [[0, 'boxPlot']] },
    'Y7-R-01': { pics: [[0, 'ratioBar']] }, 'Y11-R4': { pics: [[0, 'ratioBar']] }, 'Y8-R-02': { pics: [[0, function () { return ill.ratioBar({ cap: '3 : 2 → Ali has 3/5 of the total, Ben 2/5' }); }]] },
    'Y6-R-01': { pics: [[0, function () { return ill.ratioBar({ a: 4, b: 1, n1: 'Squash', n2: 'Water', cap: 'For every 1 part squash there are 4 parts water' }).replace('Squash</text>', 'Water</text>').replace('Water</text>', 'Squash</text>'); }]] },
    'Y5-F-01': { pics: [[0, 'fractionCompare']] }, 'Y6-F-02': { pics: [[0, 'fractionCompare']] },
    'Y5-F-03': { pics: [[0, 'mixedNumber']] },
    'Y5-F-04': { pics: [[0, 'fractionAdd']] },
    'Y6-F-04': { pics: [[0, 'fractionMultiply']] },
    'Y6-F-05': { pics: [[0, 'fractionDivide']] },
    'Y5-MD-01': { pics: [[0, 'factorArrays']] },
    'Y5-MD-02': { pics: [[0, 'prime']] }, 'Y5-MD-03': { pics: [[0, 'prime']] },
    'Y8-R-01': { pics: [[0, 'mapScale']] }, 'Y11-R2': { pics: [[0, 'mapScale']] },
    'Y9-R-03': { pics: [[0, 'proportionGraphs']] }, 'Y11-R10': { pics: [[0, 'proportionGraphs']] },
    'Y8-R-04': { pics: [[0, 'speedTriangle']] }, 'Y11-R11': { pics: [[0, 'speedTriangle']] }, 'Y10-N13': { pics: [[0, 'speedTriangle']] }
  };
  function picture(p) { return typeof p === 'function' ? p : function () { return ill[p](); }; }
  OM.illustratedTopics = [];
  Object.keys(LESSONS).forEach(function (id) {
    var o = OM.objectiveIndex && OM.objectiveIndex[id], spec = LESSONS[id]; if (!o) return;
    if (spec.replace) o.intro = spec.replace.map(function (s) { return { say: s.say, vis: picture(s.vis) }; });
    (spec.pics || []).forEach(function (pk) { var s = o.intro[pk[0]]; if (s && !s.vis) s.vis = picture(pk[1]); });
    (spec.add || []).forEach(function (s) { o.intro.push({ say: s.say, vis: picture(s.vis) }); });
    OM.illustratedTopics.push(id);
  });
})(typeof window !== 'undefined' ? window : globalThis);
