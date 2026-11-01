/* Learn with Pip — pictures used in lessons, questions and worked solutions (all inline SVG, no internet needed). */
(function (G) {
  'use strict';
  var OM = G.OM;
  var V = OM.V = {};
  var C = V.colors = { ink: '#2d2a26', soft: '#7a6f63', grid: '#d9cfbf', leaf: '#4f9d5d', leafLight: '#cfe8c9', amber: '#f2a33a',
    amberLight: '#fde3b6', berry: '#d9534f', berryLight: '#f6c9c7', sky: '#3d7bd9', skyLight: '#cfe0fa', plum: '#8a5bb8', plumLight: '#e3d4f2', paper: '#fffdf7' };
  var PV_COLORS = { 'Th': C.plum, 'H': C.berry, 'T': C.sky, 'O': C.leaf, 't': C.amber, 'h': '#c27c2c' };

  function svg(w, h, body, extra) {
    return '<svg class="vis" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" style="max-width:100%;height:auto" xmlns="http://www.w3.org/2000/svg" role="img"' + (extra || '') + '>' + body + '</svg>';
  }
  function t(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 16) + '" text-anchor="' + (o.anchor || 'middle') + '" fill="' + (o.fill || C.ink) +
      '" font-weight="' + (o.weight || 'normal') + '" dominant-baseline="' + (o.base || 'middle') + '" font-family="inherit">' + s + '</text>';
  }
  function line(x1, y1, x2, y2, o) {
    o = o || {};
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (o.stroke || C.ink) + '" stroke-width="' + (o.w || 2) + '"' +
      (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + ' stroke-linecap="round"/>';
  }
  function rect(x, y, w, h, o) {
    o = o || {};
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + (o.fill || 'none') + '" stroke="' + (o.stroke || C.ink) +
      '" stroke-width="' + (o.w === undefined ? 2 : o.w) + '"' + (o.rx ? ' rx="' + o.rx + '"' : '') + '/>';
  }
  V.t = t; V.line = line; V.rect = rect; V.svg = svg;

  // ---------- Number line ----------
  V.numberLine = function (o) {
    var W = o.width || 640, pad = 34, H = 90 + (o.hops ? 30 : 0), y = H - 40;
    var X = function (v) { return pad + (v - o.min) / (o.max - o.min) * (W - 2 * pad); };
    var b = line(pad - 12, y, W - pad + 12, y, { w: 3 });
    var n = Math.round((o.max - o.min) / o.step);
    for (var i = 0; i <= n; i++) {
      var v = o.min + i * o.step, x = X(v);
      var big = !o.labelEvery || i % o.labelEvery === 0;
      b += line(x, y - (big ? 10 : 6), x, y + (big ? 10 : 6), { w: big ? 2.5 : 1.5 });
      var lab = o.labels === 'ends' ? (i === 0 || i === n) : (o.labels === 'none' ? false : big);
      if (o.labelValues) lab = o.labelValues.indexOf(v) >= 0;
      if (lab) b += t(x, y + 26, o.format ? o.format(v) : OM.fmt(v), { size: 15 });
    }
    (o.hops || []).forEach(function (h) {
      var x1 = X(h.from), x2 = X(h.to), mx = (x1 + x2) / 2, top = y - 28 - Math.min(30, Math.abs(x2 - x1) / 4);
      b += '<path d="M' + x1 + ' ' + (y - 4) + ' Q' + mx + ' ' + top + ' ' + x2 + ' ' + (y - 4) + '" fill="none" stroke="' + (h.color || C.amber) + '" stroke-width="2.5"/>';
      b += '<polygon points="' + x2 + ',' + (y - 4) + ' ' + (x2 + (x2 > x1 ? -9 : 9)) + ',' + (y - 12) + ' ' + (x2 + (x2 > x1 ? -2 : 2)) + ',' + (y - 15) + '" fill="' + (h.color || C.amber) + '"/>';
      if (h.label) b += t(mx, top + 2, h.label, { size: 13, fill: C.soft, weight: 'bold' });
    });
    (o.points || []).forEach(function (p) {
      var x = X(p.v);
      b += '<circle cx="' + x + '" cy="' + y + '" r="7" fill="' + (p.color || C.berry) + '"/>';
      if (p.label) b += t(x, y - 20, p.label, { size: 14, weight: 'bold', fill: p.color || C.berry });
    });
    if (o.arrow !== undefined) {
      var ax = X(o.arrow);
      b += '<polygon points="' + (ax - 9) + ',' + (y - 34) + ' ' + (ax + 9) + ',' + (y - 34) + ' ' + ax + ',' + (y - 14) + '" fill="' + C.berry + '"/>';
      b += line(ax, y - 50, ax, y - 32, { stroke: C.berry, w: 4 });
    }
    return svg(W, H, b);
  };

  // ---------- Place value chart ----------
  // cols: ['Th','H','T','O'] (or with decimals 'O','t','h'); digits: array of strings ('' = empty)
  V.placeValue = function (cols, digits, o) {
    o = o || {};
    var cw = 74, W = cols.length * cw + 20, H = 110;
    var names = { Th: 'Th', H: 'H', T: 'T', O: 'O', t: 't', h: 'h' };
    var b = '';
    cols.forEach(function (c, i) {
      var x = 10 + i * cw, col = PV_COLORS[c] || C.soft, hl = o.highlight === i;
      b += rect(x, 10, cw, 34, { fill: col, stroke: C.paper, w: 2 });
      b += t(x + cw / 2, 27, names[c] || c, { fill: '#fff', weight: 'bold', size: 17 });
      b += rect(x, 44, cw, 56, { fill: hl ? C.amberLight : '#fff', stroke: C.grid, w: 2 });
      if (digits[i] !== undefined && digits[i] !== '') b += t(x + cw / 2, 73, digits[i], { size: 30, weight: 'bold', fill: hl ? C.berry : C.ink });
      if (o.pointAfter === i) b += '<circle cx="' + (x + cw) + '" cy="86" r="5" fill="' + C.ink + '"/>';
    });
    if (o.arrowShift) b += t(W / 2, H + 8, o.arrowShift, { size: 14, fill: C.soft });
    return svg(W, H + (o.arrowShift ? 20 : 0), b);
  };
  V.placeValueOf = function (n) {
    var s = String(n), cols = ['Th', 'H', 'T', 'O'].slice(4 - Math.max(s.length, 1));
    return V.placeValue(cols, s.split(''));
  };

  // ---------- Base 10 blocks ----------
  V.base10 = function (n) {
    var th = Math.floor(n / 1000), h = Math.floor(n / 100) % 10, te = Math.floor(n / 10) % 10, o = n % 10, u = 7;
    var x = 10, b = '', H = 10 * u + 40;
    for (var i = 0; i < th; i++) {
      var s = 10 * u, d = 16;
      b += '<polygon points="' + x + ',' + (20 + d) + ' ' + (x + d) + ',20 ' + (x + d + s) + ',20 ' + (x + s) + ',' + (20 + d) + '" fill="#b9a6dd" stroke="' + C.plum + '"/>';
      b += '<polygon points="' + (x + s) + ',' + (20 + d) + ' ' + (x + s + d) + ',20 ' + (x + s + d) + ',' + (20 + s) + ' ' + (x + s) + ',' + (20 + d + s) + '" fill="#9a83c9" stroke="' + C.plum + '"/>';
      b += rect(x, 20 + d, s, s, { fill: C.plumLight, stroke: C.plum, w: 1.5 });
      x += s + d + 12;
    }
    var top = 36;
    for (i = 0; i < h; i++) {
      b += rect(x, top, 10 * u, 10 * u, { fill: C.berryLight, stroke: C.berry, w: 1.5 });
      for (var g = 1; g < 10; g++) b += line(x + g * u, top, x + g * u, top + 10 * u, { stroke: C.berry, w: 0.5 }) + line(x, top + g * u, x + 10 * u, top + g * u, { stroke: C.berry, w: 0.5 });
      x += 10 * u + 8;
    }
    for (i = 0; i < te; i++) {
      b += rect(x, top, u, 10 * u, { fill: C.skyLight, stroke: C.sky, w: 1.5 });
      for (g = 1; g < 10; g++) b += line(x, top + g * u, x + u, top + g * u, { stroke: C.sky, w: 0.5 });
      x += u + 6;
    }
    x += 6;
    for (i = 0; i < o; i++) {
      b += rect(x + (i % 2) * (u + 4), top + 10 * u - (Math.floor(i / 2) + 1) * (u + 4), u, u, { fill: C.leafLight, stroke: C.leaf, w: 1.5 });
    }
    x += 2 * (u + 4) + 10;
    return svg(Math.max(x, 60), H + 20, b);
  };

  // ---------- Fractions ----------
  V.fractionBar = function (d, shaded, o) {
    o = o || {};
    var W = o.w || 380, H = o.h || 46, b = '', pw = W / d, y = o.y || 6;
    for (var i = 0; i < d; i++) b += rect(5 + i * pw, y, pw, H, { fill: i < shaded ? (o.color || C.amber) : '#fff', stroke: C.ink, w: 2 });
    if (o.label) b += t(5 + W + 12, y + H / 2, o.label, { anchor: 'start', size: 18 });
    if (o.raw) return b;
    return svg(W + (o.label ? 80 : 10), H + 12, b);
  };
  V.fractionWall = function (rows, o) {
    o = o || {};
    var W = o.w || 380, H = 44, b = '';
    rows.forEach(function (r, i) {
      b += V.fractionBar(r.d, r.shaded, { raw: true, w: W, h: H, y: 6 + i * (H + 10), color: [C.amber, C.leaf, C.sky, C.berry][i % 4], label: r.label });
    });
    return svg(W + 90, rows.length * (H + 10) + 6, b);
  };
  V.hundredSquare = function (shaded, o) {
    o = o || {};
    var s = o.size || 22, b = '';
    for (var c = 0; c < 10; c++) for (var r = 0; r < 10; r++) {
      var idx = c * 10 + r; // fill column by column so whole tenths appear as columns
      b += rect(5 + c * s, 5 + r * s, s, s, { fill: idx < shaded ? (o.color || C.sky) : '#fff', stroke: C.grid, w: 1 });
    }
    for (c = 0; c <= 10; c++) b += line(5 + c * s, 5, 5 + c * s, 5 + 10 * s, { stroke: C.ink, w: c % 10 === 0 ? 2.5 : 1.5 });
    b += line(5, 5, 5 + 10 * s, 5, { w: 2.5 }) + line(5, 5 + 10 * s, 5 + 10 * s, 5 + 10 * s, { w: 2.5 });
    return svg(10 * s + 10, 10 * s + 10, b);
  };
  V.barModel = function (o) {
    var W = 420, d = o.parts, pw = W / d, b = '';
    b += '<path d="M10 30 Q10 12 ' + (10 + W / 2) + ' 14 Q' + (10 + W) + ' 12 ' + (10 + W) + ' 30" fill="none" stroke="' + C.soft + '" stroke-width="2"/>';
    b += t(10 + W / 2, 8, o.total, { size: 16, weight: 'bold', base: 'hanging' });
    for (var i = 0; i < d; i++) {
      b += rect(10 + i * pw, 36, pw, 44, { fill: i < (o.shaded || 0) ? C.amberLight : '#fff' });
      if (o.partLabel !== undefined) b += t(10 + i * pw + pw / 2, 58, o.partLabel, { size: 15 });
    }
    return svg(W + 20, 90, b);
  };
  V.array = function (rows, cols) {
    var s = 26, b = '';
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) b += '<circle cx="' + (18 + c * s) + '" cy="' + (18 + r * s) + '" r="9" fill="' + C.amber + '" stroke="#b86e10"/>';
    return svg(cols * s + 10, rows * s + 10, b);
  };

  // ---------- Clock ----------
  V.clock = function (h, m, o) {
    o = o || {};
    var R = 90, cx = 100, cy = 100, b = '<circle cx="100" cy="100" r="' + R + '" fill="#fff" stroke="' + C.wood + '" stroke-width="7"/>';
    for (var i = 0; i < 60; i++) {
      var a = i * 6 * Math.PI / 180, big = i % 5 === 0;
      b += line(cx + Math.sin(a) * (R - (big ? 12 : 6)), cy - Math.cos(a) * (R - (big ? 12 : 6)), cx + Math.sin(a) * (R - 3), cy - Math.cos(a) * (R - 3), { w: big ? 2.5 : 1 });
    }
    for (i = 1; i <= 12; i++) {
      var a2 = i * 30 * Math.PI / 180;
      b += t(cx + Math.sin(a2) * (R - 26), cy - Math.cos(a2) * (R - 26) + 1, (o.roman ? OM.toRoman(i) : i), { size: o.roman ? 13 : 17, weight: 'bold' });
    }
    var ha = ((h % 12) + m / 60) * 30 * Math.PI / 180, ma = m * 6 * Math.PI / 180;
    b += line(cx, cy, cx + Math.sin(ha) * 48, cy - Math.cos(ha) * 48, { w: 7, stroke: C.ink });
    b += line(cx, cy, cx + Math.sin(ma) * 72, cy - Math.cos(ma) * 72, { w: 4, stroke: C.berry });
    b += '<circle cx="100" cy="100" r="6" fill="' + C.ink + '"/>';
    return svg(200, 200, b);
  };
  C.wood = '#8b5e3c';

  // ---------- Squared grid with shaded cells (area, symmetry) ----------
  V.gridShape = function (cells, o) {
    o = o || {};
    var cols = o.cols || 8, rows = o.rows || 6, s = o.cell || 34, b = '';
    var set = {};
    cells.forEach(function (c) { set[c[0] + ',' + c[1]] = true; });
    for (var x = 0; x < cols; x++) for (var y = 0; y < rows; y++) {
      b += rect(6 + x * s, 6 + y * s, s, s, { fill: set[x + ',' + y] ? (o.color || C.leaf) : '#fff', stroke: C.grid, w: 1 });
    }
    (o.extra || []).forEach(function (c) { b += rect(6 + c[0] * s, 6 + c[1] * s, s, s, { fill: o.extraColor || C.amber, stroke: C.grid, w: 1 }); });
    if (o.mirror) {
      var m = o.mirror;
      if (m.type === 'v') b += line(6 + m.at * s, 0, 6 + m.at * s, rows * s + 12, { stroke: C.berry, w: 3.5, dash: '10 6' });
      else b += line(0, 6 + m.at * s, cols * s + 12, 6 + m.at * s, { stroke: C.berry, w: 3.5, dash: '10 6' });
    }
    return svg(cols * s + 12, rows * s + 12, b);
  };

  // Point-in-polygon (ray casting) used to place edge labels outside a shape
  function inside(pt, poly) {
    var c = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi)) c = !c;
    }
    return c;
  }
  // Rectilinear shape drawn from unit coordinates, labels[i] = label for edge i (points[i] -> points[i+1])
  V.labelledShape = function (pts, labels, o) {
    o = o || {};
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs), minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    var sc = Math.min(300 / (maxX - minX), 200 / (maxY - minY));
    var P = pts.map(function (p) { return [70 + (p[0] - minX) * sc, 40 + (p[1] - minY) * sc]; });
    var W = 140 + (maxX - minX) * sc, H = 80 + (maxY - minY) * sc;
    var b = '<polygon points="' + P.map(function (p) { return p.join(','); }).join(' ') + '" fill="' + (o.fill || C.leafLight) + '" stroke="' + C.ink + '" stroke-width="3"/>';
    P.forEach(function (p, i) {
      var q = P[(i + 1) % P.length], lab = labels[i];
      if (lab === null || lab === undefined) return;
      var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.sqrt(dx * dx + dy * dy);
      var nx = dy / L, ny = -dx / L;
      if (inside([mx + nx * 4, my + ny * 4], P)) { nx = -nx; ny = -ny; }
      b += t(mx + nx * 24, my + ny * 18, lab, { size: 16, weight: 'bold', fill: lab === '?' ? C.berry : C.ink });
    });
    return svg(W, H, b);
  };

  // ---------- Polygons with equal-side ticks and right-angle markers ----------
  V.polygon = function (pts, o) {
    o = o || {};
    var rot = (o.rotate || 0) * Math.PI / 180;
    var cx = 0, cy = 0;
    pts.forEach(function (p) { cx += p[0]; cy += p[1]; }); cx /= pts.length; cy /= pts.length;
    var R = pts.map(function (p) { var x = p[0] - cx, y = p[1] - cy; return [x * Math.cos(rot) - y * Math.sin(rot), x * Math.sin(rot) + y * Math.cos(rot)]; });
    var xs = R.map(function (p) { return p[0]; }), ys = R.map(function (p) { return p[1]; });
    var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs), minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    var box = o.box || 220, sc = Math.min(box / (maxX - minX || 1), box * 0.8 / (maxY - minY || 1));
    var P = R.map(function (p) { return [30 + (p[0] - minX) * sc, 30 + (p[1] - minY) * sc]; });
    var W = 60 + (maxX - minX) * sc, H = 60 + (maxY - minY) * sc;
    var b = '<polygon points="' + P.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="' + (o.fill || C.skyLight) + '" stroke="' + C.ink + '" stroke-width="3" stroke-linejoin="round"/>';
    var n = P.length, lens = [];
    for (var i = 0; i < n; i++) { var a = pts[i], c = pts[(i + 1) % n]; lens.push(Math.hypot(c[0] - a[0], c[1] - a[1])); }
    if (o.ticks !== false) {
      // group equal sides; each group gets 1, 2, 3... tick marks
      var groups = [], gid = [];
      lens.forEach(function (L, i) {
        var g = -1;
        groups.forEach(function (gl, k) { if (Math.abs(gl - L) < 1e-6 * Math.max(1, L)) g = k; });
        if (g < 0) { groups.push(L); g = groups.length - 1; }
        gid[i] = g;
      });
      var counts = groups.map(function (_, k) { return gid.filter(function (x) { return x === k; }).length; });
      var tickNo = 0, tickFor = {};
      groups.forEach(function (_, k) { if (counts[k] > 1) tickFor[k] = ++tickNo; });
      for (i = 0; i < n; i++) {
        var k = tickFor[gid[i]];
        if (!k) continue;
        var p = P[i], q = P[(i + 1) % n], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
        var ux = dx / L, uy = dy / L;
        for (var j = 0; j < k; j++) {
          var off = (j - (k - 1) / 2) * 6;
          var tx = mx + ux * off, ty = my + uy * off;
          b += line(tx - uy * 8, ty + ux * 8, tx + uy * 8, ty - ux * 8, { w: 2 });
        }
      }
    }
    if (o.rightAngles !== false) {
      for (i = 0; i < n; i++) {
        var prev = pts[(i + n - 1) % n], cur = pts[i], next = pts[(i + 1) % n];
        var v1 = [prev[0] - cur[0], prev[1] - cur[1]], v2 = [next[0] - cur[0], next[1] - cur[1]];
        var dot = v1[0] * v2[0] + v1[1] * v2[1];
        if (Math.abs(dot) < 1e-6 * Math.hypot(v1[0], v1[1]) * Math.hypot(v2[0], v2[1])) {
          var Pp = P[(i + n - 1) % n], Pc = P[i], Pn = P[(i + 1) % n], s = 14;
          var a1 = [Pp[0] - Pc[0], Pp[1] - Pc[1]], a2 = [Pn[0] - Pc[0], Pn[1] - Pc[1]];
          var l1 = Math.hypot(a1[0], a1[1]), l2 = Math.hypot(a2[0], a2[1]);
          a1 = [a1[0] / l1 * s, a1[1] / l1 * s]; a2 = [a2[0] / l2 * s, a2[1] / l2 * s];
          b += '<polyline points="' + (Pc[0] + a1[0]) + ',' + (Pc[1] + a1[1]) + ' ' + (Pc[0] + a1[0] + a2[0]) + ',' + (Pc[1] + a1[1] + a2[1]) + ' ' + (Pc[0] + a2[0]) + ',' + (Pc[1] + a2[1]) + '" fill="none" stroke="' + C.ink + '" stroke-width="2"/>';
        }
      }
    }
    if (o.axis) { // line of symmetry through two points (in original coordinates), extended
      var A = o.axis.map(function (p) { var x = p[0] - cx, y = p[1] - cy; var rx = x * Math.cos(rot) - y * Math.sin(rot), ry = x * Math.sin(rot) + y * Math.cos(rot); return [30 + (rx - minX) * sc, 30 + (ry - minY) * sc]; });
      var ddx = A[1][0] - A[0][0], ddy = A[1][1] - A[0][1], LL = Math.hypot(ddx, ddy);
      b += line(A[0][0] - ddx / LL * 25, A[0][1] - ddy / LL * 25, A[1][0] + ddx / LL * 25, A[1][1] + ddy / LL * 25, { stroke: C.berry, w: 3, dash: '9 6' });
    }
    if (o.label) b += t(W / 2, H - 6, o.label, { size: 18, weight: 'bold' });
    return svg(W, H, b);
  };

  // ---------- Angles ----------
  V.angle = function (deg, o) {
    o = o || {};
    var rot = (o.rot || 0) * Math.PI / 180, L1 = o.len1 || 110, L2 = o.len2 || 110, S = 260;
    var a1 = rot, a2 = rot - deg * Math.PI / 180; // second arm anticlockwise (screen y is down)
    var p1 = [Math.cos(a1) * L1, Math.sin(a1) * L1], p2 = [Math.cos(a2) * L2, Math.sin(a2) * L2];
    var xs = [0, p1[0], p2[0]], ys = [0, p1[1], p2[1]];
    var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs), minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    var ox = 30 - minX, oy = 30 - minY, W = maxX - minX + 60, H = maxY - minY + 60 + (o.label ? 26 : 0);
    var b = line(ox, oy, ox + p1[0], oy + p1[1], { w: 4 }) + line(ox, oy, ox + p2[0], oy + p2[1], { w: 4 });
    if (Math.abs(deg - 90) < 0.01) {
      var s = 18, u1 = [Math.cos(a1) * s, Math.sin(a1) * s], u2 = [Math.cos(a2) * s, Math.sin(a2) * s];
      b += '<polyline points="' + (ox + u1[0]) + ',' + (oy + u1[1]) + ' ' + (ox + u1[0] + u2[0]) + ',' + (oy + u1[1] + u2[1]) + ' ' + (ox + u2[0]) + ',' + (oy + u2[1]) + '" fill="none" stroke="' + C.ink + '" stroke-width="2.5"/>';
    } else {
      var r = 30, q1 = [ox + Math.cos(a1) * r, oy + Math.sin(a1) * r], q2 = [ox + Math.cos(a2) * r, oy + Math.sin(a2) * r];
      b += '<path d="M' + q1[0] + ' ' + q1[1] + ' A' + r + ' ' + r + ' 0 ' + (deg > 180 ? 1 : 0) + ' 0 ' + q2[0] + ' ' + q2[1] + '" fill="none" stroke="' + C.amber + '" stroke-width="3"/>';
    }
    b += '<circle cx="' + ox + '" cy="' + oy + '" r="4" fill="' + C.ink + '"/>';
    if (o.label) b += t(W / 2, H - 12, o.label, { size: 20, weight: 'bold' });
    return svg(Math.max(W, S / 2), H, b);
  };

  // ---------- Coordinate grid (first quadrant) ----------
  V.coordGrid = function (o) {
    o = o || {};
    var n = o.size || 10, s = o.cell || 30, ox = 40, oy = 20 + n * s, W = n * s + 70, H = n * s + 60, b = '';
    var X = function (x) { return ox + x * s; }, Y = function (y) { return oy - y * s; };
    for (var i = 0; i <= n; i++) {
      b += line(X(i), Y(0), X(i), Y(n), { stroke: C.grid, w: 1 }) + line(X(0), Y(i), X(n), Y(i), { stroke: C.grid, w: 1 });
      b += t(X(i), Y(0) + 16, i, { size: 13 }) + (i ? t(X(0) - 14, Y(i), i, { size: 13 }) : '');
    }
    b += line(X(0), Y(0), X(n) + 10, Y(0), { w: 2.5 }) + line(X(0), Y(0), X(0), Y(n) - 10, { w: 2.5 });
    b += t(X(n) + 18, Y(0), 'x', { size: 16, weight: 'bold' }) + t(X(0), Y(n) - 18, 'y', { size: 16, weight: 'bold' });
    if (o.polygon) b += '<polygon points="' + o.polygon.map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' ') + '" fill="' + C.leafLight + '" stroke="' + C.leaf + '" stroke-width="3"/>';
    (o.segments || []).forEach(function (sg) { b += line(X(sg[0][0]), Y(sg[0][1]), X(sg[1][0]), Y(sg[1][1]), { stroke: C.sky, w: 3 }); });
    (o.arrows || []).forEach(function (a) {
      var x1 = X(a[0][0]), y1 = Y(a[0][1]), x2 = X(a[1][0]), y2 = Y(a[1][1]), L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L;
      b += line(x1, y1, x2 - ux * 8, y2 - uy * 8, { stroke: C.amber, w: 3, dash: '6 4' });
      b += '<polygon points="' + x2 + ',' + y2 + ' ' + (x2 - ux * 12 - uy * 6) + ',' + (y2 - uy * 12 + ux * 6) + ' ' + (x2 - ux * 12 + uy * 6) + ',' + (y2 - uy * 12 - ux * 6) + '" fill="' + C.amber + '"/>';
    });
    (o.points || []).forEach(function (p) {
      b += line(X(p.x) - 6, Y(p.y) - 6, X(p.x) + 6, Y(p.y) + 6, { stroke: p.color || C.berry, w: 3 }) + line(X(p.x) - 6, Y(p.y) + 6, X(p.x) + 6, Y(p.y) - 6, { stroke: p.color || C.berry, w: 3 });
      if (p.label) b += t(X(p.x) + 13, Y(p.y) - 13, p.label, { size: 16, weight: 'bold', fill: p.color || C.berry });
    });
    return svg(W, H, b);
  };

  // ---------- Charts ----------
  V.barChart = function (o) {
    var cats = o.cats, vals = o.values, step = o.step, max = o.max, n = cats.length;
    var ph = 220, bw = Math.min(64, 360 / n), gap = bw * 0.6, ox = 60, oy = 30 + ph, W = ox + n * (bw + gap) + 30, H = oy + 56, b = '';
    var Y = function (v) { return oy - v / max * ph; };
    var labelEvery = o.labelEvery || 1;
    for (var k = 0, v = 0; v <= max; v += step, k++) {
      b += line(ox, Y(v), W - 20, Y(v), { stroke: C.grid, w: 1 });
      if (k % labelEvery === 0) b += t(ox - 10, Y(v), OM.fmt(v), { size: 13, anchor: 'end' });
    }
    cats.forEach(function (c, i) {
      var x = ox + gap / 2 + i * (bw + gap);
      b += rect(x, Y(vals[i]), bw, oy - Y(vals[i]), { fill: [C.leaf, C.amber, C.sky, C.berry, C.plum, '#c27c2c'][i % 6], stroke: C.ink, w: 1.5 });
      b += t(x + bw / 2, oy + 16, c, { size: 13 });
    });
    b += line(ox, oy, W - 20, oy, { w: 2.5 }) + line(ox, oy, ox, 20, { w: 2.5 });
    if (o.ylabel) b += '<text x="16" y="' + (oy - ph / 2) + '" font-size="13" text-anchor="middle" transform="rotate(-90 16 ' + (oy - ph / 2) + ')" fill="' + C.soft + '">' + o.ylabel + '</text>';
    if (o.xlabel) b += t((ox + W) / 2, oy + 40, o.xlabel, { size: 13, fill: C.soft });
    if (o.title) b += t(W / 2, 10, o.title, { size: 15, weight: 'bold' });
    return svg(W, H, b);
  };
  V.lineGraph = function (o) {
    var xs = o.xlabels, vals = o.values, step = o.step, max = o.max, n = xs.length;
    var ph = 220, dx = Math.min(70, 420 / (n - 1)), ox = 60, oy = 30 + ph, W = ox + (n - 1) * dx + 40, H = oy + 56, b = '';
    var Y = function (v) { return oy - v / max * ph; }, X = function (i) { return ox + 10 + i * dx; };
    for (var k = 0, v = 0; v <= max; v += step, k++) {
      b += line(ox, Y(v), W - 20, Y(v), { stroke: C.grid, w: 1 });
      if (k % (o.labelEvery || 1) === 0) b += t(ox - 10, Y(v), OM.fmt(v), { size: 13, anchor: 'end' });
    }
    xs.forEach(function (x, i) { b += line(X(i), oy, X(i), oy + 6, { w: 1.5 }) + t(X(i), oy + 18, x, { size: 12 }); });
    b += '<polyline points="' + vals.map(function (v, i) { return X(i) + ',' + Y(v); }).join(' ') + '" fill="none" stroke="' + C.berry + '" stroke-width="3"/>';
    vals.forEach(function (v, i) { b += '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="4.5" fill="' + C.berry + '"/>'; });
    b += line(ox, oy, W - 20, oy, { w: 2.5 }) + line(ox, oy, ox, 20, { w: 2.5 });
    if (o.ylabel) b += '<text x="16" y="' + (oy - ph / 2) + '" font-size="13" text-anchor="middle" transform="rotate(-90 16 ' + (oy - ph / 2) + ')" fill="' + C.soft + '">' + o.ylabel + '</text>';
    if (o.xlabel) b += t((ox + W) / 2, oy + 40, o.xlabel, { size: 13, fill: C.soft });
    if (o.title) b += t(W / 2, 10, o.title, { size: 15, weight: 'bold' });
    return svg(W, H, b);
  };
  // Pictogram: symbol is an acorn-like circle; fractions of a symbol drawn as clipped segments
  V.pictogram = function (o) {
    var rowH = 46, nameW = 110, s = 34, H = o.cats.length * rowH + 60, maxSym = 0, b = '';
    o.cats.forEach(function (c, i) {
      var v = o.values[i] / o.key; maxSym = Math.max(maxSym, Math.ceil(v));
      var y = 10 + i * rowH;
      b += rect(4, y, nameW, rowH, { fill: '#fff', stroke: C.grid, w: 1 }) + t(10, y + rowH / 2, c, { anchor: 'start', size: 15 });
      var full = Math.floor(v), part = v - full;
      for (var k = 0; k < full; k++) b += sym(nameW + 14 + k * (s + 6), y + 6, 1);
      if (part > 1e-9) b += sym(nameW + 14 + full * (s + 6), y + 6, part);
    });
    function sym(x, y, f) {
      var id = 'c' + Math.round(x) + '_' + Math.round(y);
      var body = '<circle cx="' + (x + s / 2) + '" cy="' + (y + s / 2 + 2) + '" r="' + (s / 2 - 2) + '" fill="' + C.amber + '" stroke="#b86e10" stroke-width="2"/>' +
        '<path d="M' + (x + 3) + ' ' + (y + s / 2 - 2) + ' Q' + (x + s / 2) + ' ' + (y - 4) + ' ' + (x + s - 3) + ' ' + (y + s / 2 - 2) + 'Z" fill="' + C.wood + '"/>';
      if (f >= 1) return body;
      return '<clipPath id="' + id + '"><rect x="' + x + '" y="' + (y - 6) + '" width="' + (s * f) + '" height="' + (s + 12) + '"/></clipPath><g clip-path="url(#' + id + ')">' + body + '</g>';
    }
    var W = nameW + 30 + Math.max(maxSym, 4) * (s + 6);
    var ky = 20 + o.cats.length * rowH;
    b += sym(10, ky, 1) + t(52, ky + s / 2 + 2, '= ' + o.key + ' ' + (o.unit || ''), { anchor: 'start', size: 16, weight: 'bold' });
    return svg(W, H, b);
  };
  V.table = function (head, rows) {
    return '<table class="data-table"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
  };

  // ---------- Written column methods (HTML, used for worked-example frames) ----------
  // o: {a, b, op: '+'|'−'|'×', answer: string (digits shown so far, right-aligned), carries: {col: digit}, upto: number of columns done,
  //     exchanges: {col: {from: newDigit, to: newDigit}} for subtraction, highlight: col}
  V.column = function (o) {
    var a = String(o.a), b = String(o.b), width = Math.max(a.length, b.length) + 1;
    if (o.op === '−') width = Math.max(a.length, b.length);
    var ans = String(o.answer || ''), up = o.upto === undefined ? 99 : o.upto;
    var cell = function (ch, cls) { return '<td class="' + (cls || '') + '">' + (ch === undefined ? '' : ch) + '</td>'; };
    var row = function (s, cls, pre, colCls) {
      var html = '<tr class="' + (cls || '') + '"><td class="op">' + (pre || '') + '</td>';
      for (var i = width - 1; i >= 0; i--) {
        var ch = i < s.length ? s[s.length - 1 - i] : '';
        html += cell(ch, (o.highlight === i ? 'hl ' : '') + (colCls ? colCls(i) : ''));
      }
      return html + '</tr>';
    };
    var html = '<table class="colm"><tbody>';
    if (o.op === '−' && o.exchanges) {
      html += '<tr class="exch"><td class="op"></td>';
      for (var i = width - 1; i >= 0; i--) html += cell(o.exchanges[i] ? o.exchanges[i].to : '', o.highlight === i ? 'hl' : '');
      html += '</tr>';
      html += row(a, 'c-top', '', function (i) { return o.exchanges[i] ? 'crossed' : ''; });
    } else html += row(a, 'c-top', '');
    html += row(b, 'c-bottom', o.op);
    html += '<tr class="ans"><td class="op"></td>';
    for (i = width - 1; i >= 0; i--) html += cell(i < up && i < ans.length ? ans[ans.length - 1 - i] : '', 'ansc' + (o.highlight === i ? ' hl' : ''));
    html += '</tr>';
    if (o.op !== '−') {
      html += '<tr class="carry"><td class="op"></td>';
      for (i = width - 1; i >= 0; i--) html += cell(o.carries && o.carries[i] && i <= up ? o.carries[i] : '', o.highlight === i ? 'hl' : '');
      html += '</tr>';
    }
    return html + '</tbody></table>';
  };

  // Frames for an animated worked example of a column method. Returns [{html, text}]
  V.columnFrames = function (a, b, op) {
    var names = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions', 'ten millions'];
    var A = String(a), B = String(b), frames = [], carries = {}, ansDigits = [], exchanges = {};
    function d(s, i) { return i < s.length ? +s[s.length - 1 - i] : 0; }
    var width = Math.max(A.length, B.length);
    frames.push({ html: V.column({ a: a, b: b, op: op, answer: '', upto: 0 }), text: 'Write the numbers in columns, lining up the ones, tens, hundreds and thousands. Start with the ones column on the right.' });
    if (op === '+') {
      var carry = 0;
      for (var i = 0; i < width; i++) {
        var s = d(A, i) + d(B, i) + carry, txt = 'Add the ' + names[i] + ': ' + d(A, i) + ' + ' + d(B, i) + (carry ? ' + ' + carry + ' (exchanged)' : '') + ' = ' + s + '.';
        ansDigits.unshift(s % 10);
        if (s >= 10) { carries[i + 1] = 1; txt += ' That is more than 9, so write ' + (s % 10) + ' and exchange ten ' + names[i] + ' for one of the ' + names[i + 1] + '. Write the 1 under the ' + names[i + 1] + ' column.'; }
        else txt += ' Write ' + s + ' in the ' + names[i] + ' column.';
        carry = s >= 10 ? 1 : 0;
        frames.push({ html: V.column({ a: a, b: b, op: op, answer: ansDigits.join(''), carries: Object.assign({}, carries), upto: i + 1, highlight: i }), text: txt });
      }
      if (carry) { ansDigits.unshift(1); frames.push({ html: V.column({ a: a, b: b, op: op, answer: ansDigits.join(''), carries: carries, upto: width + 1, highlight: width }), text: 'There is an exchanged 1 in the ' + names[width] + ' column with nothing else to add, so write 1.' }); }
    } else if (op === '−') {
      var top = A.split('').reverse().map(Number);
      for (i = 0; i < width; i++) {
        var bot = d(B, i), txt2;
        if (top[i] < bot) {
          var j = i + 1;
          while (top[j] === 0) j++;
          // exchange chain from column j down to i
          var chain = [];
          for (var k = j; k > i; k--) {
            exchanges[k] = { to: top[k] - 1 + (k < j ? 10 : 0) };
            chain.push(names[k]);
            top[k] = top[k] - 1 + (k < j ? 10 : 0);
          }
          exchanges[i] = { to: top[i] + 10 };
          top[i] += 10;
          txt2 = 'In the ' + names[i] + ', ' + (top[i] - 10) + ' − ' + bot + ' needs more ' + names[i] + '. ' +
            (j > i + 1 ? 'There are no ' + names[i + 1] + ' to exchange, so first exchange 1 of the ' + names[j] + ' to make 10 ' + names[j - 1] + ', then ' : '') +
            'Exchange 1 of the ' + names[i + 1] + ' for 10 ' + names[i] + '. Now ' + top[i] + ' − ' + bot + ' = ' + (top[i] - bot) + '.';
        } else txt2 = 'Subtract the ' + names[i] + ': ' + top[i] + ' − ' + bot + ' = ' + (top[i] - bot) + '.';
        ansDigits.unshift(top[i] - bot);
        frames.push({ html: V.column({ a: a, b: b, op: op, answer: ansDigits.join(''), exchanges: JSON.parse(JSON.stringify(exchanges)), upto: i + 1, highlight: i }), text: txt2 });
      }
    } else if (op === '×') {
      var m = +B, c2 = 0;
      for (i = 0; i < A.length; i++) {
        var p = d(A, i) * m + c2, t3 = 'Multiply the ' + names[i] + ': ' + d(A, i) + ' × ' + m + ' = ' + (d(A, i) * m) + (c2 ? ', add the exchanged ' + c2 + ' to make ' + p : '') + '.';
        ansDigits.unshift(p % 10);
        if (p >= 10) { carries[i + 1] = Math.floor(p / 10); t3 += ' Write ' + (p % 10) + ' and exchange ' + Math.floor(p / 10) + ' into the ' + names[i + 1] + ' column.'; }
        else t3 += ' Write ' + p + '.';
        c2 = Math.floor(p / 10);
        frames.push({ html: V.column({ a: a, b: b, op: op, answer: ansDigits.join(''), carries: Object.assign({}, carries), upto: i + 1, highlight: i }), text: t3 });
      }
      if (c2) { ansDigits.unshift(c2); frames.push({ html: V.column({ a: a, b: b, op: op, answer: ansDigits.join(''), carries: carries, upto: A.length + 1, highlight: A.length }), text: 'Write the exchanged ' + c2 + ' in the ' + names[A.length] + ' column.' }); }
    }
    var result = op === '+' ? a + b : op === '−' ? a - b : a * b;
    frames.push({ html: V.column({ a: a, b: b, op: op, answer: String(result), carries: carries, exchanges: exchanges, upto: 9 }), text: 'So ' + OM.fmt(a) + ' ' + op + ' ' + OM.fmt(b) + ' = ' + OM.fmt(result) + '.' });
    return frames;
  };
})(typeof window !== 'undefined' ? window : globalThis);
