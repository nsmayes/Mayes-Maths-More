/* Mayes Maths & More — the player's animal for Years 7 to 11, drawn more and more life-like as the years go up.
   OM.naturalAnimal(kind, { real, size, mood, wear }) is used by OM.animalSVG (js/animals.js) for older children;
   real runs from 0.2 (Year 7) to 1 (Year 11):
     Year 7   natural proportions, natural eyes, soft shading (no outlines, no cartoon smile)
     Year 8   + muzzle, nose and inner-ear detail
     Year 9   + fur texture begins
     Year 10  + denser fur, fine whiskers, rim light
     Year 11  + full fur texture and shading
   Every head is built from point lists, smoothed into curves; fur is drawn as many short strokes inside the head, in
   the direction the fur grows. A seeded random number generator keeps each animal identical every time it is drawn.
   The same 120 x 152 frame as the younger animals, so the dressing-up chest's items still fit (top, eyes, eyeR).
   The baddies (role 'king' or 'guard') use the same heads, with scheming eyes, and a crown and robe or a helmet and armour. */
(function (G) {
  'use strict';
  var OM = G.OM, uid = 0;

  // ---------- small geometry helpers ----------
  function rng(seed) { var s = seed >>> 0; return function () { s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function f(n) { return Math.round(n * 10) / 10; }
  // a closed, smooth outline through the points (Catmull-Rom curves)
  function smooth(p, open) {
    var n = p.length, d = 'M' + f(p[0][0]) + ' ' + f(p[0][1]);
    for (var i = 0; i < (open ? n - 1 : n); i++) {
      var a = p[(i - 1 + n) % n], b = p[i], c = p[(i + 1) % n], e = p[(i + 2) % n];
      if (open) { if (i === 0) a = b; if (i + 2 >= n) e = c; }
      d += ' C' + f(b[0] + (c[0] - a[0]) / 6) + ' ' + f(b[1] + (c[1] - a[1]) / 6) + ' ' + f(c[0] - (e[0] - b[0]) / 6) + ' ' + f(c[1] - (e[1] - b[1]) / 6) + ' ' + f(c[0]) + ' ' + f(c[1]);
    }
    return d + (open ? '' : ' Z');
  }
  // many points along the smooth outline (for fur edges and for filling with fur)
  function dense(p, per) {
    var n = p.length, out = [];
    for (var i = 0; i < n; i++) {
      var a = p[(i - 1 + n) % n], b = p[i], c = p[(i + 1) % n], e = p[(i + 2) % n];
      for (var k = 0; k < per; k++) {
        var t = k / per, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map(function (j) { return 0.5 * ((2 * b[j]) + (-a[j] + c[j]) * t + (2 * a[j] - 5 * b[j] + 4 * c[j] - e[j]) * t2 + (-a[j] + 3 * b[j] - 3 * c[j] + e[j]) * t3); }));
      }
    }
    return out;
  }
  function centre(p) { var x = 0, y = 0; p.forEach(function (q) { x += q[0]; y += q[1]; }); return [x / p.length, y / p.length]; }
  function inside(poly, x, y) { var c = false; for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) { var a = poly[i], b = poly[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
  // the outline with a soft fringe of fur tufts: amp 0 gives the plain smooth outline
  function furry(p, amp, r) {
    if (amp < 0.3) return smooth(p);
    var pts = dense(p, 6), c = centre(p), d = 'M';
    pts.forEach(function (q, i) {
      var dx = q[0] - c[0], dy = q[1] - c[1], l = Math.sqrt(dx * dx + dy * dy) || 1, o = i % 2 ? amp * (0.55 + 0.45 * r()) : -amp * 0.15;
      d += f(q[0] + dx / l * o) + ' ' + f(q[1] + dy / l * o) + (i === pts.length - 1 ? ' Z' : ' L');
    });
    return d;
  }
  // short strokes of fur inside a shape, pointing away from a flow point (where the fur grows from)
  function fur(p, count, flow, len, colour, width, opacity, r, spread) {
    if (count < 1) return '';
    var poly = dense(p, 4), xs = poly.map(function (q) { return q[0]; }), ys = poly.map(function (q) { return q[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys), d = '';
    for (var i = 0, tries = 0; i < count && tries < count * 20; tries++) {
      var x = x0 + (x1 - x0) * r(), y = y0 + (y1 - y0) * r();
      if (!inside(poly, x, y)) continue;
      var a = Math.atan2(y - flow[1], x - flow[0]) + (r() - 0.5) * (spread || 0.6), l = len * (0.6 + 0.7 * r());
      d += 'M' + f(x) + ' ' + f(y) + 'l' + f(Math.cos(a) * l) + ' ' + f(Math.sin(a) * l);
      i++;
    }
    return '<path d="' + d + '" stroke="' + colour + '" stroke-width="' + width + '" stroke-linecap="round" opacity="' + opacity + '" fill="none"/>';
  }
  function shape(p, fill, extra) { return '<path d="' + smooth(p) + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function mix(a, b, t) { // blend two #rrggbb colours
    var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
    return '#' + [16, 8, 0].map(function (s) { var v = Math.round(((x >> s) & 255) * (1 - t) + ((y >> s) & 255) * t); return (v < 16 ? '0' : '') + v.toString(16); }).join('');
  }
  function mirror(p) { return p.map(function (q) { return [120 - q[0], q[1]]; }).reverse(); }

  // ---------- eyes: an almond of dark rim, a glowing iris, the pupil and a catchlight ----------
  // e: { x, y, r, iris, pupil: 'round' | 'slit' | 'bar' | 'bead', tilt, ring, lid (fur colour, for a smiling lower lid) }
  function eye(e, happy, id) {
    var bead = e.pupil === 'bead', w = e.r * (bead ? 1.1 : 1.45), h = e.r * (bead ? 1.0 : 1.05), x = e.x, y = e.y, t = e.tilt || 0;
    // an almond for most eyes; a near-circle for the round, dark eyes of otters, rabbits, mice and squirrels
    var alm = bead ? 'M' + f(x - w) + ' ' + f(y) + ' C' + f(x - w) + ' ' + f(y - h * 1.32) + ' ' + f(x + w) + ' ' + f(y - h * 1.32) + ' ' + f(x + w) + ' ' + f(y) + ' C' + f(x + w) + ' ' + f(y + h * 1.32) + ' ' + f(x - w) + ' ' + f(y + h * 1.32) + ' ' + f(x - w) + ' ' + f(y) + ' Z'
      : 'M' + f(x - w) + ' ' + f(y) + ' Q' + f(x) + ' ' + f(y - h * 1.5) + ' ' + f(x + w) + ' ' + f(y) + ' Q' + f(x) + ' ' + f(y + h * 1.35) + ' ' + f(x - w) + ' ' + f(y) + ' Z';
    var g = '<g transform="rotate(' + t + ' ' + x + ' ' + y + ')">';
    if (e.ring) g += '<path d="' + alm + '" transform="translate(' + x + ' ' + y + ') scale(' + (bead ? 1.22 : 1.35) + ') translate(' + -x + ' ' + -y + ')" fill="' + e.ring + '" opacity=".9"/>';
    g += '<path d="' + alm + '" fill="#140d0a"/><clipPath id="' + id + 'c"><path d="' + alm + '" transform="translate(' + x + ' ' + y + ') scale(.84) translate(' + -x + ' ' + -y + ')"/></clipPath>';
    g += '<g clip-path="url(#' + id + 'c)"><circle cx="' + x + '" cy="' + y + '" r="' + f(e.r * 1.05) + '" fill="url(#' + e.irisId + ')"/>';
    if (e.sly) g += '<g class="shifty">';
    if (e.pupil === 'slit') g += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + f(e.r * 0.22) + '" ry="' + f(e.r * 0.95) + '" fill="#0b0705"/>';
    else if (e.pupil === 'bar') g += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + f(e.r * 0.7) + '" ry="' + f(e.r * 0.3) + '" fill="#0b0705"/>';
    else if (e.pupil !== 'bead') g += '<circle cx="' + x + '" cy="' + y + '" r="' + f(e.r * 0.5) + '" fill="#0b0705"/>';
    if (e.sly) g += '</g>';
    // shadow of the upper lid across the top of the eye
    g += '<rect x="' + f(x - w) + '" y="' + f(y - h * 1.6) + '" width="' + f(w * 2) + '" height="' + f(h * 1.1) + '" fill="#000" opacity="' + (bead ? .18 : .28) + '"/></g>';
    g += '<circle cx="' + f(x - e.r * 0.35) + '" cy="' + f(y - e.r * 0.35) + '" r="' + f(e.r * 0.24) + '" fill="#fff" opacity=".95"/><circle cx="' + f(x + e.r * 0.3) + '" cy="' + f(y + e.r * 0.25) + '" r="' + f(e.r * 0.1) + '" fill="#fff" opacity=".6"/>';
    if (e.sly && e.lid) {
      var ox = x - e.side * w * 1.35, ix = x + e.side * w * 1.35;
      g += '<path d="M' + f(ox) + ' ' + f(y - h * 0.7) + ' L' + f(ix) + ' ' + f(y - h * 0.05) + ' L' + f(ix) + ' ' + f(y - h * 1.6) + ' Q' + f(x) + ' ' + f(y - h * 2.1) + ' ' + f(ox) + ' ' + f(y - h * 1.6) + ' Z" fill="' + e.lid + '"/>' +
        '<path d="M' + f(ox) + ' ' + f(y - h * 0.7) + ' L' + f(ix) + ' ' + f(y - h * 0.05) + '" stroke="' + (e.brow || '#0b0705') + '" stroke-width="' + (e.brow ? 2 : 1.6) + '" stroke-linecap="round" opacity=".75"/>';
    }
    // a smile shows in the eyes: the lower lid rises
    if (happy && e.lid) g += '<path d="M' + f(x - w * 1.2) + ' ' + f(y + h * 1.4) + ' L' + f(x - w * 1.2) + ' ' + f(y + h * 0.35) + ' Q' + f(x) + ' ' + f(y - h * 0.15) + ' ' + f(x + w * 1.2) + ' ' + f(y + h * 0.35) + ' L' + f(x + w * 1.2) + ' ' + f(y + h * 1.4) + ' Z" fill="' + e.lid + '"/>';
    return g + '</g>';
  }
  function irisDef(id, c) { return '<radialGradient id="' + id + 'i" cx=".45" cy=".42" r=".6"><stop offset="0" stop-color="' + mix(c, '#ffffff', 0.35) + '"/><stop offset=".55" stop-color="' + c + '"/><stop offset="1" stop-color="' + mix(c, '#000000', 0.55) + '"/></radialGradient>'; }
  function whiskers(pts, len, colour, opacity, n, r) {
    var d = '';
    pts.forEach(function (q) { for (var i = 0; i < n; i++) { var s = q[2], a = (s > 0 ? 0 : Math.PI) + (i - (n - 1) / 2) * 0.16 + (r() - 0.5) * 0.08, l = len * (0.8 + 0.3 * r()); d += 'M' + f(q[0]) + ' ' + f(q[1] + i * 1.6) + ' q' + f(Math.cos(a) * l * 0.5) + ' ' + f(Math.sin(a) * l * 0.5 - 2) + ' ' + f(Math.cos(a) * l) + ' ' + f(Math.sin(a) * l + 1); } });
    return '<path d="' + d + '" stroke="' + colour + '" stroke-width=".7" fill="none" stroke-linecap="round" opacity="' + opacity + '"/>';
  }

  // ---------- the nine animals ----------
  // each: colours, eye settings, where hats and glasses go (top, eyes [y, dx], eyeR), and draw(L) returning the head.
  // L: { real, r (random), id, happy, fringe, furN (how many fur strokes), defs (push gradient definitions) }
  var NAT = {
    fox: { top: 22, hatY: 24, hatS: 0.95, eyes: [55, 17], eyeR: 6, col: { fur: '#d4652a', light: '#f09a55', shade: '#94400f', white: '#f6efe4', black: '#24170f' }, throat: '#f6efe4',
      eye: { r: 5.4, iris: '#e3a03a', pupil: 'slit', tilt: -12 },
      draw: function (L, c) {
        var earL = [[20, 50], [14, 26], [16, 4], [34, 14], [52, 30]], head = [[40, 26], [60, 21], [80, 26], [96, 36], [104, 50], [111, 64], [96, 70], [84, 81], [70, 93], [60, 99], [50, 93], [36, 81], [24, 70], [9, 64], [16, 50], [24, 36]];
        var cheeks = [[11, 64], [24, 61], [38, 67], [49, 78], [56, 90], [60, 99], [64, 90], [71, 78], [82, 67], [96, 61], [109, 64], [98, 75], [84, 86], [70, 97], [60, 101], [50, 97], [36, 86], [22, 75]];
        var s = '';
        [earL, mirror(earL)].forEach(function (e, i) {
          s += '<path d="' + furry(e, L.fringe * .6, L.r) + '" fill="url(#' + L.id + 'h)"/>';
          var tip = e[2], top = [[tip[0] - 7, tip[1] + 14], [tip[0], tip[1] - 1], [tip[0] + 8, tip[1] + 12], [tip[0] + 2, tip[1] + 17]];
          s += '<path d="' + furry(top, L.fringe * .4, L.r) + '" fill="' + c.black + '"/>';
          var inner = e.map(function (q) { var m = centre(e); return [m[0] + (q[0] - m[0]) * .5, m[1] + (q[1] - m[1]) * .5 + 6]; });
          s += shape(inner, c.white, ' opacity=".9"') + fur(inner, L.furN * .12, [i ? 82 : 38, 34], 4, '#d9cbb8', .8, .8, L.r, 1.2);
        });
        s += '<path d="' + furry(head, L.fringe, L.r) + '" fill="url(#' + L.id + 'h)"/>';
        s += fur(head, L.furN, [60, 64], 4.5, c.shade, .9, .45, L.r) + fur(head, L.furN * .5, [60, 64], 3.5, c.light, .8, .5, L.r);
        // the muzzle bridge, a little lighter
        s += shape([[52, 50], [60, 46], [68, 50], [66, 76], [60, 88], [54, 76]], c.light, ' opacity=".55"');
        s += '<path d="' + furry(cheeks, L.fringe * .7, L.r) + '" fill="' + c.white + '"/>' + fur(cheeks, L.furN * .35, [60, 96], 3.5, '#cfc2b0', .8, .7, L.r);
        // the dark tear lines from the eyes towards the muzzle
        s += '<path d="M48 60 Q50 70 55 79 M72 60 Q70 70 65 79" stroke="' + c.shade + '" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="' + (.35 + .3 * L.real) + '"/>';
        s += '<ellipse cx="60" cy="89" rx="6.5" ry="4.6" fill="' + c.black + '"/><ellipse cx="58" cy="87.6" rx="2.2" ry="1.1" fill="#fff" opacity=".45"/>';
        s += '<path d="M60 93.5 V96 M54 97 Q60 ' + (L.happy ? 101 : 99) + ' 66 97" stroke="' + c.black + '" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".8"/>';
        if (L.real > .5) s += whiskers([[52, 92, -1], [68, 92, 1]], 22, '#2a1d14', .45 * L.real, 3, L.r);
        return s;
      } },
    otter: { top: 26, hatY: 30, hatS: 1.02, eyes: [54, 18], eyeR: 5.5, col: { fur: '#6e4a31', light: '#946748', shade: '#43281a', cream: '#d6bf9c' }, throat: '#d6bf9c',
      eye: { r: 4.4, iris: '#2a1810', pupil: 'bead' },
      draw: function (L, c) {
        var head = [[30, 40], [60, 28], [90, 40], [99, 58], [96, 76], [82, 90], [60, 96], [38, 90], [24, 76], [21, 58]], s = '';
        [[25, 42], [95, 42]].forEach(function (e) { s += '<circle cx="' + e[0] + '" cy="' + e[1] + '" r="6.5" fill="' + c.shade + '"/><circle cx="' + e[0] + '" cy="' + (e[1] + 1) + '" r="3" fill="#2a1810"/>'; });
        s += '<path d="' + furry(head, L.fringe * .7, L.r) + '" fill="url(#' + L.id + 'h)"/>';
        s += fur(head, L.furN, [60, 70], 3.6, c.shade, .8, .4, L.r) + fur(head, L.furN * .4, [60, 70], 3, c.light, .7, .45, L.r);
        var chin = [[34, 78], [46, 72], [60, 74], [74, 72], [86, 78], [80, 90], [60, 97], [40, 90]];
        s += '<path d="' + furry(chin, L.fringe * .5, L.r) + '" fill="' + c.cream + '"/>';
        // the broad whisker pads and the big nose
        s += '<ellipse cx="50" cy="75" rx="12" ry="8.5" fill="' + mix(c.cream, c.fur, .35) + '"/><ellipse cx="70" cy="75" rx="12" ry="8.5" fill="' + mix(c.cream, c.fur, .35) + '"/>';
        s += '<g fill="' + c.shade + '" opacity=".55"><circle cx="45" cy="74" r=".9"/><circle cx="49" cy="77" r=".9"/><circle cx="44" cy="78" r=".9"/><circle cx="75" cy="74" r=".9"/><circle cx="71" cy="77" r=".9"/><circle cx="76" cy="78" r=".9"/></g>';
        s += '<path d="M51 66 Q60 62 69 66 Q67 73 60 74 Q53 73 51 66 Z" fill="#1c120c"/><path d="M55 66 Q60 64.5 63 66" stroke="#fff" stroke-width="1" opacity=".35" fill="none"/>';
        s += '<path d="M60 74 V79 M55 81 Q60 ' + (L.happy ? 85 : 83) + ' 65 81" stroke="#1c120c" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/>';
        s += whiskers([[46, 75, -1], [74, 75, 1]], 24, '#f2e6d4', .4 + .4 * L.real, L.real > .6 ? 5 : 3, L.r);
        return s;
      } },
    rabbit: { top: 30, hatY: 33, hatS: 0.82, eyes: [56, 21], eyeR: 6, col: { fur: '#9c8266', light: '#c4ad90', shade: '#6a543f', cream: '#eee2d0', pink: '#d6a094' }, throat: '#eee2d0',
      eye: { r: 5.6, iris: '#3b2416', pupil: 'bead', ring: '#e9dcc8', tilt: 8 },
      draw: function (L, c) {
        var ear = [[44, 36], [36, 14], [33, -6], [40, -10], [48, 2], [54, 22], [56, 36]], head = [[38, 34], [60, 30], [82, 34], [92, 50], [94, 68], [86, 84], [72, 94], [60, 96], [48, 94], [34, 84], [26, 68], [28, 50]], s = '<g class="ears">';
        [ear, mirror(ear)].forEach(function (e) {
          s += '<path d="' + furry(e, L.fringe * .5, L.r) + '" fill="url(#' + L.id + 'h)"/>';
          var inner = e.map(function (q) { var m = centre(e); return [m[0] + (q[0] - m[0]) * .55, m[1] + (q[1] - m[1]) * .8 + 2]; });
          s += shape(inner, c.pink, ' opacity=".75"');
          if (L.real > .5) s += '<path d="' + smooth(e.slice(1, 5), true) + '" stroke="#3a2c20" stroke-width="2" fill="none" opacity=".5"/>';
        });
        s += '</g><path d="' + furry(head, L.fringe, L.r) + '" fill="url(#' + L.id + 'h)"/>';
        s += fur(head, L.furN, [60, 74], 3.6, c.shade, .8, .45, L.r) + fur(head, L.furN * .5, [60, 74], 3, c.light, .7, .5, L.r);
        s += shape([[46, 72], [60, 68], [74, 72], [72, 88], [60, 94], [48, 88]], c.cream, ' opacity=".9"');
        s += '<path d="M56 74 Q60 72 64 74 Q62 78 60 78.5 Q58 78 56 74 Z" fill="' + c.pink + '"/><path d="M60 78.5 V82 M60 82 Q56 85 53 83 M60 82 Q64 85 67 83" stroke="#5a4232" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
        if (L.real > .4) s += whiskers([[52, 80, -1], [68, 80, 1]], 20, '#f4ece0', .35 + .35 * L.real, 3, L.r);
        return s;
      } },
    hedgehog: { top: 30, hatY: 9, hatS: 1.05, eyes: [60, 15], eyeR: 5, col: { fur: '#c9a47c', light: '#e3c9a6', shade: '#8f6c4a', spine: '#5d4936', tip: '#e6d8c0' }, throat: '#d9bf9c',
      eye: { r: 3.8, iris: '#1a120d', pupil: 'bead' },
      draw: function (L, c) {
        var dome = [[8, 74], [10, 46], [28, 18], [60, 4], [92, 18], [110, 46], [112, 74], [96, 64], [60, 52], [24, 64]], s = '';
        s += '<path d="' + furry(dome, 3 + L.fringe * 1.5, L.r) + '" fill="' + c.spine + '"/>';
        // spines: dark at the root, pale at the tip, pointing away from the face
        var n = Math.round(60 + 140 * L.real), dk = '', lt = '', poly = dense(dome, 4);
        for (var i = 0, tries = 0; i < n && tries < n * 30; tries++) {
          var x = 8 + 104 * L.r(), y = 4 + 70 * L.r(); if (!inside(poly, x, y)) continue;
          var a = Math.atan2(y - 66, x - 60) + (L.r() - .5) * .3, l = 9 + 6 * L.r();
          dk += 'M' + f(x) + ' ' + f(y) + 'l' + f(Math.cos(a) * l * .65) + ' ' + f(Math.sin(a) * l * .65);
          lt += 'M' + f(x + Math.cos(a) * l * .65) + ' ' + f(y + Math.sin(a) * l * .65) + 'l' + f(Math.cos(a) * l * .35) + ' ' + f(Math.sin(a) * l * .35); i++;
        }
        s += '<path d="' + dk + '" stroke="#2e231a" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="' + lt + '" stroke="' + c.tip + '" stroke-width="1.3" stroke-linecap="round" fill="none"/>';
        var face = [[26, 54], [40, 44], [60, 40], [80, 44], [94, 54], [90, 68], [76, 80], [66, 92], [60, 99], [54, 92], [44, 80], [30, 68]];
        [[34, 44], [86, 44]].forEach(function (e) { s += '<circle cx="' + e[0] + '" cy="' + e[1] + '" r="5.5" fill="' + c.shade + '"/><circle cx="' + e[0] + '" cy="' + (e[1] + 1) + '" r="2.6" fill="#3e2c1e"/>'; });
        s += '<path d="' + furry(face, L.fringe * .6, L.r) + '" fill="url(#' + L.id + 'h)"/>' + fur(face, L.furN * .8, [60, 92], 3, c.shade, .7, .4, L.r);
        s += '<ellipse cx="60" cy="95" rx="5" ry="3.8" fill="#16100c"/><ellipse cx="58.6" cy="93.8" rx="1.6" ry=".8" fill="#fff" opacity=".5"/>';
        s += '<path d="M56 99 Q60 ' + (L.happy ? 102 : 101) + ' 64 99" stroke="#16100c" stroke-width="1.1" fill="none" opacity=".6"/>';
        return s;
      } },
    badger: { top: 24, hatY: 26, hatS: 1.0, eyes: [54, 16], eyeR: 5.5, col: { fur: '#8f9196', light: '#b3b5b9', shade: '#5c5e62', white: '#f2f0ea', black: '#1c1c1e' }, throat: '#2a2a2d',
      eye: { r: 4, iris: '#4a2c1c', pupil: 'bead' },
      draw: function (L, c) {
        var head = [[32, 30], [60, 24], [88, 30], [98, 48], [96, 66], [84, 82], [70, 94], [60, 98], [50, 94], [36, 82], [24, 66], [22, 48]], s = '';
        [[23, 44], [97, 44]].forEach(function (e) { s += '<circle cx="' + e[0] + '" cy="' + e[1] + '" r="7" fill="' + c.black + '"/><path d="M' + (e[0] - 6) + ' ' + (e[1] - 3) + ' Q' + e[0] + ' ' + (e[1] - 10) + ' ' + (e[0] + 6) + ' ' + (e[1] - 3) + '" stroke="' + c.white + '" stroke-width="2.4" fill="none"/>'; });
        s += '<path d="' + furry(head, L.fringe, L.r) + '" fill="url(#' + L.id + 'w)"/>';
        // grey cheeks, then the two black stripes from the nose over the eyes
        var stripe = [[34, 27], [46, 25], [52, 42], [55, 62], [57, 84], [55, 87], [49, 74], [40, 60], [33, 46], [30, 34]];
        s += '<path d="' + furry(stripe, L.fringe * .4, L.r) + '" fill="' + c.black + '"/><path d="' + furry(mirror(stripe), L.fringe * .4, L.r) + '" fill="' + c.black + '"/>';
        s += fur(stripe, L.furN * .3, [56, 90], 4, '#4a4a4f', .8, .6, L.r) + fur(mirror(stripe), L.furN * .3, [64, 90], 4, '#4a4a4f', .8, .6, L.r) + fur(head, L.furN * .5, [60, 92], 4, '#c9c6be', .8, .5, L.r);
        s += '<ellipse cx="60" cy="92" rx="7.5" ry="4.8" fill="' + c.black + '"/><ellipse cx="58" cy="90.4" rx="2.4" ry="1" fill="#fff" opacity=".4"/>';
        s += '<path d="M54 98 Q60 ' + (L.happy ? 101 : 100) + ' 66 98" stroke="' + c.black + '" stroke-width="1.3" fill="none" opacity=".6"/>';
        return s;
      } },
    squirrel: { top: 26, hatY: 30, hatS: 0.9, eyes: [54, 17], eyeR: 7, col: { fur: '#b4521e', light: '#da7c42', shade: '#76320f', cream: '#f1e1c9' }, throat: '#f1e1c9',
      eye: { r: 5.4, iris: '#2b170d', pupil: 'bead', ring: '#e8c9a4' },
      draw: function (L, c) {
        var ear = [[34, 36], [32, 18], [36, 6], [44, 18], [48, 32]], head = [[34, 32], [60, 28], [86, 32], [96, 48], [94, 64], [84, 78], [70, 88], [60, 92], [50, 88], [36, 78], [26, 64], [24, 48]], s = '';
        [ear, mirror(ear)].forEach(function (e, i) {
          s += '<path d="' + furry(e, L.fringe * .5, L.r) + '" fill="' + c.fur + '"/>';
          // the tufts on the ear tips
          s += fur([[e[2][0] - 6, e[2][1] + 6], [e[2][0], e[2][1] - 6], [e[2][0] + 6, e[2][1] + 6]], 8 + 14 * L.real, [e[2][0], e[2][1] + 14], 7, c.shade, 1.2, .9, L.r, .5);
        });
        s += '<path d="' + furry(head, L.fringe, L.r) + '" fill="url(#' + L.id + 'h)"/>' + fur(head, L.furN, [60, 80], 3.6, c.shade, .8, .45, L.r) + fur(head, L.furN * .5, [60, 80], 3, c.light, .7, .5, L.r);
        var chin = [[40, 72], [50, 70], [60, 74], [70, 70], [80, 72], [76, 84], [60, 93], [44, 84]];
        s += '<path d="' + furry(chin, L.fringe * .5, L.r) + '" fill="' + c.cream + '"/>';
        s += '<path d="M56 79 Q60 77 64 79 Q62 82.5 60 83 Q58 82.5 56 79 Z" fill="#4a2a1c"/><path d="M60 83 V86 M56 88 Q60 ' + (L.happy ? 91 : 89.5) + ' 64 88" stroke="#4a2a1c" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
        if (L.real > .4) s += whiskers([[54, 84, -1], [66, 84, 1]], 20, '#2a160c', .3 + .3 * L.real, 3, L.r);
        return s;
      } },
    mouse: { top: 36, hatY: 38, hatS: 0.88, eyes: [58, 16], eyeR: 7, col: { fur: '#977657', light: '#b99978', shade: '#654c36', cream: '#efe6d9', pink: '#dba69d' }, throat: '#efe6d9',
      eye: { r: 6.2, iris: '#140c08', pupil: 'bead' },
      draw: function (L, c) {
        var head = [[36, 42], [60, 36], [84, 42], [94, 56], [88, 72], [74, 84], [64, 94], [60, 97], [56, 94], [46, 84], [32, 72], [26, 56]], s = '<g class="ears">';
        [[30, 34], [90, 34]].forEach(function (e) {
          s += '<circle cx="' + e[0] + '" cy="' + e[1] + '" r="18" fill="' + c.light + '"/><circle cx="' + e[0] + '" cy="' + (e[1] + 1.5) + '" r="14.5" fill="' + c.pink + '" opacity=".85"/>';
          if (L.real > .5) s += '<path d="M' + e[0] + ' ' + (e[1] + 12) + ' q-4 -10 -2 -20 M' + e[0] + ' ' + (e[1] + 12) + ' q5 -9 6 -16" stroke="#b9786e" stroke-width=".8" fill="none" opacity=".6"/>';
        });
        s += '</g><path d="' + furry(head, L.fringe * .8, L.r) + '" fill="url(#' + L.id + 'h)"/>' + fur(head, L.furN, [60, 90], 3.4, c.shade, .7, .45, L.r) + fur(head, L.furN * .4, [60, 90], 3, c.light, .7, .5, L.r);
        s += shape([[48, 76], [60, 72], [72, 76], [68, 90], [60, 97], [52, 90]], c.cream, ' opacity=".85"');
        s += '<ellipse cx="60" cy="93" rx="4" ry="3.2" fill="' + mix(c.pink, '#000000', .1) + '"/><path d="M56 99 Q60 ' + (L.happy ? 102 : 100.5) + ' 64 99" stroke="#5a3a30" stroke-width="1" fill="none"/>';
        s += whiskers([[54, 92, -1], [66, 92, 1]], 26, '#2a1d14', .35 + .35 * L.real, L.real > .6 ? 5 : 3, L.r);
        return s;
      } },
    frog: { top: 32, hatY: 34, hatS: 0.95, eyes: [44, 21], eyeR: 9, col: { fur: '#5e9a3e', light: '#9cc86c', shade: '#3a6826', belly: '#e4e0b4', spot: '#2f5420' }, throat: '#e4e0b4',
      eye: { r: 7.4, iris: '#c9a23a', pupil: 'bar' },
      draw: function (L, c) {
        var head = [[18, 62], [26, 50], [40, 44], [60, 46], [80, 44], [94, 50], [102, 62], [102, 74], [92, 84], [76, 90], [60, 92], [44, 90], [28, 84], [18, 74]], s = '';
        s += shape(head, 'url(#' + L.id + 'h)');
        // the bulging eyes sit on top of the head
        [[39, 44], [81, 44]].forEach(function (e) { s += '<ellipse cx="' + e[0] + '" cy="' + e[1] + '" rx="13.5" ry="12" fill="' + c.fur + '"/><ellipse cx="' + e[0] + '" cy="' + (e[1] - 4) + '" rx="10" ry="6" fill="' + c.light + '" opacity=".45"/>'; });
        // smooth skin: blotches, the ear drum behind each eye, a pale jaw line and a shine
        var sp = '', rr = L.r, n = Math.round(4 + 14 * L.real);
        for (var i = 0; i < n; i++) { var x = 26 + 68 * rr(), y = 52 + 30 * rr(); if (inside(dense(head, 3), x, y) && Math.abs(x - 60) > 6) sp += '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(1.5 + 2.5 * rr()) + '" ry="' + f(1.2 + 1.8 * rr()) + '" fill="' + c.spot + '" opacity="' + f(.35 + .3 * L.real) + '"/>'; }
        s += sp + '<circle cx="24" cy="64" r="6" fill="' + c.shade + '" opacity=".65"/><circle cx="96" cy="64" r="6" fill="' + c.shade + '" opacity=".65"/>';
        s += '<path d="M22 76 Q60 ' + (L.happy ? 96 : 92) + ' 98 76" stroke="' + c.shade + '" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M28 80 Q60 96 92 80 L88 86 Q60 96 32 86 Z" fill="' + c.belly + '" opacity=".75"/>';
        s += '<circle cx="54" cy="60" r="1.6" fill="' + c.spot + '"/><circle cx="66" cy="60" r="1.6" fill="' + c.spot + '"/>';
        s += '<path d="M40 54 Q60 49 80 54" stroke="#fff" stroke-width="2.5" fill="none" opacity="' + f(.15 + .25 * L.real) + '" stroke-linecap="round"/>';
        return s;
      } },
    cat: { top: 28, hatY: 30, hatS: 0.95, eyes: [58, 18], eyeR: 7, col: { fur: '#d1883f', light: '#efb173', shade: '#94531f', stripe: '#8a4718', white: '#f6eee3', pink: '#e09a9a' }, throat: '#f6eee3',
      eye: { r: 6, iris: '#a6b83a', pupil: 'slit', tilt: -8 },
      draw: function (L, c) {
        var ear = [[24, 46], [22, 24], [26, 8], [40, 20], [50, 32]], head = [[36, 30], [60, 26], [84, 30], [98, 44], [104, 60], [98, 76], [84, 88], [66, 96], [60, 97], [54, 96], [36, 88], [22, 76], [16, 60], [22, 44]], s = '';
        [ear, mirror(ear)].forEach(function (e) {
          s += '<path d="' + furry(e, L.fringe * .5, L.r) + '" fill="' + c.fur + '"/>';
          var inner = e.map(function (q) { var m = centre(e); return [m[0] + (q[0] - m[0]) * .55, m[1] + (q[1] - m[1]) * .6 + 3]; });
          s += shape(inner, c.pink, ' opacity=".7"') + fur(inner, 6 + 10 * L.real, [centre(inner)[0], centre(inner)[1] + 10], 5, '#f6eee3', .8, .8, L.r, .5);
        });
        s += '<path d="' + furry(head, L.fringe, L.r) + '" fill="url(#' + L.id + 'h)"/>' + fur(head, L.furN, [60, 76], 4, c.shade, .8, .4, L.r) + fur(head, L.furN * .5, [60, 76], 3.4, c.light, .7, .5, L.r);
        // tabby stripes: the M on the forehead and lines on the cheeks
        s += '<path d="M46 34 L50 46 M54 30 L56 44 M60 29 V43 M66 30 L64 44 M74 34 L70 46 M20 62 Q28 64 34 62 M18 70 Q27 71 35 68 M100 62 Q92 64 86 62 M102 70 Q93 71 85 68" stroke="' + c.stripe + '" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/>';
        s += '<path d="' + furry([[40, 74], [52, 70], [60, 74], [68, 70], [80, 74], [76, 88], [60, 96], [44, 88]], L.fringe * .5, L.r) + '" fill="' + c.white + '"/>';
        s += '<path d="M55 74 L65 74 L60 79.5 Z" fill="' + c.pink + '"/><path d="M60 79.5 V83 M60 83 Q56 86.5 52.5 84.5 M60 83 Q64 86.5 67.5 84.5" stroke="#5a3424" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
        s += whiskers([[50, 82, -1], [70, 82, 1]], 30, '#ffffff', .55 + .3 * L.real, L.real > .6 ? 5 : 3, L.r);
        return s;
      } }
,
    // the two baddies that are never a player's animal
    wolf: { top: 22, hatY: 24, hatS: 0.95, eyes: [55, 17], eyeR: 6, col: { fur: '#868d95', light: '#c0c5ca', shade: '#4b5158', white: '#e9ebed', black: '#24272b' }, throat: '#e9ebed',
      eye: { r: 5, iris: '#d69a2e', pupil: 'round', tilt: -10 },
      draw: function (L, c) {
        var earL = [[22, 46], [16, 22], [21, 2], [38, 15], [50, 28]], head = [[38, 24], [60, 20], [82, 24], [98, 36], [108, 52], [115, 68], [100, 75], [86, 85], [72, 97], [60, 103], [48, 97], [34, 85], [20, 75], [5, 68], [12, 52], [22, 36]], s = '';
        [earL, mirror(earL)].forEach(function (e, i) {
          s += '<path d="' + furry(e, L.fringe * .6, L.r) + '" fill="' + c.black + '"/>';
          var inner = e.map(function (q) { var m = centre(e); return [m[0] + (q[0] - m[0]) * .62, m[1] + (q[1] - m[1]) * .62 + 4]; });
          s += shape(inner, c.light) + fur(inner, L.furN * .12, [i ? 82 : 38, 34], 4, '#8d949b', .8, .8, L.r, 1.2);
        });
        s += '<path d="' + furry(head, L.fringe * 1.2, L.r) + '" fill="url(#' + L.id + 'h)"/>';
        s += fur(head, L.furN * 1.1, [60, 66], 5, c.shade, .9, .45, L.r) + fur(head, L.furN * .6, [60, 66], 4, c.light, .8, .5, L.r);
        // pale cheek ruffs, the long pale muzzle and a dark saddle over the brow
        var ruff = [[6, 68], [22, 66], [34, 76], [44, 92], [30, 90], [16, 82]];
        s += '<path d="' + furry(ruff, L.fringe, L.r) + '" fill="' + c.white + '"/><path d="' + furry(mirror(ruff), L.fringe, L.r) + '" fill="' + c.white + '"/>';
        s += '<path d="M30 40 Q60 30 90 40 L84 50 Q60 42 36 50 Z" fill="' + c.shade + '" opacity=".55"/>';
        var muz = [[47, 62], [60, 57], [73, 62], [75, 82], [67, 97], [60, 101], [53, 97], [45, 82]];
        s += '<path d="' + furry(muz, L.fringe * .5, L.r) + '" fill="' + c.white + '"/>' + fur(muz, L.furN * .25, [60, 100], 3, '#b7bcc2', .7, .7, L.r);
        s += '<path d="M54 62 Q60 60 66 62 L64 80 Q60 84 56 80 Z" fill="' + c.light + '" opacity=".6"/>';
        s += '<ellipse cx="60" cy="90" rx="7.5" ry="5.2" fill="' + c.black + '"/><ellipse cx="57.8" cy="88.4" rx="2.4" ry="1.1" fill="#fff" opacity=".4"/>';
        s += '<path d="M60 95 V98 M53 99 Q60 101.5 67 98" stroke="' + c.black + '" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"/>';
        if (L.real > .5) s += whiskers([[52, 93, -1], [68, 93, 1]], 22, '#2a2e33', .4 * L.real, 3, L.r);
        return s;
      } },
    crow: { top: 20, hatY: 24, hatS: 0.9, eyes: [52, 19], eyeR: 6, col: { fur: '#22252c', light: '#4b5468', shade: '#0e1014', beak: '#2b2d33', sheen: '#6a7aa8' }, throat: '#22252c',
      eye: { r: 5.6, iris: '#e8df98', pupil: 'round', ring: '#5a6170', brow: '#8a93a6' },
      draw: function (L, c) {
        var head = [[30, 46], [38, 30], [60, 22], [82, 30], [90, 46], [93, 64], [86, 82], [72, 93], [60, 96], [48, 93], [34, 82], [27, 64]], s = '';
        s += '<path d="' + furry(head, L.fringe * .5, L.r) + '" fill="url(#' + L.id + 'h)"/>';
        // feathers: small overlapping arcs, with a blue-purple sheen where the light catches them
        var n = Math.round(30 + 160 * L.real), arcs = '', shine = '', poly = dense(head, 4);
        for (var i = 0, tries = 0; i < n && tries < n * 20; tries++) {
          var x = 28 + 64 * L.r(), y = 24 + 70 * L.r(); if (!inside(poly, x, y)) continue;
          var seg = 'M' + f(x - 2.6) + ' ' + f(y) + ' q2.6 2.6 5.2 0';
          if (x + y < 110 && L.r() < .6) shine += seg; else arcs += seg; i++;
        }
        s += '<path d="' + arcs + '" stroke="#000" stroke-width=".8" fill="none" opacity=".3"/><path d="' + shine + '" stroke="' + c.sheen + '" stroke-width=".9" fill="none" opacity="' + f(.3 + .35 * L.real) + '"/>';
        // shaggy throat feathers
        s += fur([[40, 82], [60, 90], [80, 82], [74, 96], [60, 100], [46, 96]], 10 + 30 * L.real, [60, 70], 6, '#3a3f4a', 1.1, .7, L.r, .4);
        // the heavy beak, pointing down from between the eyes, with bristles over the nostrils
        s += '<linearGradient id="' + L.id + 'b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2d33"/><stop offset=".45" stop-color="#6b707b"/><stop offset="1" stop-color="#1f2126"/></linearGradient>';
        s += '<path d="M48 54 Q60 48 72 54 L69 70 Q64 86 60 100 Q56 86 51 70 Z" fill="url(#' + L.id + 'b)"/><path d="M60 52 Q61 72 60 96" stroke="#5b606b" stroke-width="1.4" fill="none" opacity=".7"/>';
        s += '<path d="M53 72 Q60 76 67 72" stroke="#111" stroke-width="1.3" fill="none" opacity=".75"/><path d="M52 56 Q56 60 54 64 M68 56 Q64 60 66 64" stroke="#3a3f4a" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
        s += '<path d="M56 55 Q60 53 64 55" stroke="#9aa3b5" stroke-width="1.2" fill="none" opacity=".5"/>';
        return s;
      } }
  };
  // the baddies' colours: a smoky grey Cat King, a darker fox; realistic coats for the Cat King's guards
  var BAD = { cat: { fur: '#7c7684', light: '#aaa4b2', shade: '#45404d', stripe: '#3f3a47', white: '#e7e3ea', pink: '#c497a2', iris: '#c3d14a' }, fox: { fur: '#c35a22', light: '#e58d4b', shade: '#7d330c', iris: '#e0b23c' } };
  var REALFUR = { '#d59a5a': '#cf8c4c', '#8a8f96': '#8b8f95', '#e8e0d0': '#e3d8c4', '#3d3a3a': '#33302e', '#c98e56': '#9a7552', '#a3a3b8': '#a19dab', '#e0a3b0': '#c9a07c', '#6b8fb3': '#7c8794' };

  /* OM.naturalAnimal(kind, { real, size, mood, wear, cls }) — the player's animal, Years 7 to 11 */
  OM.naturalAnimal = function (kind, o) {
    o = o || {};
    var role = o.role || 'avatar', bad = role !== 'avatar';
    var A = NAT[kind] || NAT.otter, c = Object.assign({}, A.col), iris = A.eye.iris, real = Math.max(0.2, Math.min(1, o.real || 0.2)), size = o.size || 120, id = 'na' + (++uid), happy = o.mood === 'happy' || o.mood === 'cheer';
    var seed = 0; for (var i = 0; i < kind.length; i++) seed = seed * 31 + kind.charCodeAt(i);
    if (bad && BAD[kind]) { Object.assign(c, BAD[kind]); iris = BAD[kind].iris || iris; }
    // a guard's own coat colour (the Cat King's guards are each a different cat)
    if (o.fur) { var base = REALFUR[String(o.fur).toLowerCase()] || o.fur; c.fur = base; c.light = mix(base, '#ffffff', .32); c.shade = mix(base, '#000000', .42); c.stripe = mix(base, '#000000', .5); }
    // what they wear: a zip jacket with headphones (Years 7–8), a navy jacket (Years 9–10), a charcoal one (Year 11)
    // [main, dark, collar, trim]
    o.jacket = o.jacket || (real < .5 ? ['#2f3d46', '#1b252b', '#465965', '#2ec4b6'] : real < .9 ? ['#2b3a5c', '#18223a', '#3e5280', '#d9b44a'] : ['#3a3d42', '#1f2124', '#55595f', '#c9ced6']);
    var L = { real: real, r: rng(seed), id: id, happy: happy, fringe: real < .3 ? 0 : 0.8 + 2.4 * (real - .4), furN: real < .3 ? 0 : Math.round(30 + 240 * (real - .4)) };
    // shading over the head: lit from the top left
    var defs = '<radialGradient id="' + id + 'h" gradientUnits="userSpaceOnUse" cx="48" cy="30" r="78"><stop offset="0" stop-color="' + c.light + '"/><stop offset=".5" stop-color="' + c.fur + '"/><stop offset="1" stop-color="' + mix(c.shade, c.fur, .35 - .25 * real) + '"/></radialGradient>' +
      irisDef(id, iris) + '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1a8"/><stop offset=".45" stop-color="#e8b52a"/><stop offset="1" stop-color="#9c6a08"/></linearGradient>' +
      '<linearGradient id="' + id + 's" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef1f4"/><stop offset=".5" stop-color="#9ea9b4"/><stop offset="1" stop-color="#56606a"/></linearGradient>' + (c.white ? '<radialGradient id="' + id + 'w" cx=".45" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="' + c.white + '"/><stop offset="1" stop-color="' + mix(c.white, '#7a756c', .35 + .15 * real) + '"/></radialGradient>' : '') + '<linearGradient id="' + id + 'j" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + o.jacket[0] + '"/><stop offset="1" stop-color="' + o.jacket[1] + '"/></linearGradient>';
    var head = A.draw(L, c);
    // eyes (smaller and more natural as the years go up), with a raised lower lid when happy
    var er = A.eye.r * (1.25 - 0.25 * real), lid = kind === 'badger' ? c.black : 'url(#' + id + 'h)', eyes = '<g class="blink">' +
      eye({ x: 60 - A.eyes[1], y: A.eyes[0], r: er, iris: iris, pupil: A.eye.pupil, tilt: -(A.eye.tilt || 0), ring: A.eye.ring, lid: lid, sly: bad, side: 1, brow: A.eye.brow, irisId: id + 'i' }, happy, id + 'l') +
      eye({ x: 60 + A.eyes[1], y: A.eyes[0], r: er, iris: iris, pupil: A.eye.pupil, tilt: A.eye.tilt || 0, ring: A.eye.ring, lid: lid, sly: bad, side: -1, brow: A.eye.brow, irisId: id + 'i' }, happy, id + 'r') + '</g>';
    if (bad) return baddie(kind, role, o, A, c, L, id, defs, head, eyes, size, real);
    // the body: a jacket over the shoulders, the animal's own throat fur showing at the collar
    var J = o.jacket, body = '<path d="M14 140 Q14 110 36 101 Q48 97 60 97 Q72 97 84 101 Q106 110 106 140 Z" fill="url(#' + id + 'j)"/>' +
      '<path d="M46 98 L60 120 L74 98 Q60 94 46 98 Z" fill="' + A.throat + '"/>' + (kind === 'frog' ? '' : fur([[48, 98], [72, 98], [60, 116]], L.furN * .1, [60, 92], 3, '#000', .6, .25, L.r)) +
      '<path d="M44 98 L60 122 L56 140 M76 98 L60 122" stroke="' + J[2] + '" stroke-width="4" fill="none" stroke-linejoin="round"/><path d="M60 122 V140" stroke="' + J[3] + '" stroke-width="2"/>' +
      // folds in the fabric, stronger as the drawing gets more life-like
      '<path d="M30 116 Q36 126 34 140 M90 116 Q84 126 86 140 M44 128 Q48 134 47 140" stroke="#000" stroke-width="2" fill="none" opacity="' + f(.1 + .2 * real) + '" stroke-linecap="round"/>' +
      '<path d="M24 112 Q30 104 40 101" stroke="#fff" stroke-width="2" fill="none" opacity="' + f(.08 + .14 * real) + '" stroke-linecap="round"/>';
    if (o.mood !== 'cheer') body += '<path d="M18 140 Q16 118 26 108 Q30 124 30 140 Z M102 140 Q104 118 94 108 Q90 124 90 140 Z" fill="' + J[1] + '" opacity=".55"/>';
    // headphones round the neck for Years 7 to 9
    if (real < .7) body += '<path d="M38 100 Q60 116 82 100" stroke="#1b2227" stroke-width="4.5" fill="none" stroke-linecap="round"/><rect x="29" y="92" width="12" height="16" rx="5.5" fill="#1b2227"/><rect x="79" y="92" width="12" height="16" rx="5.5" fill="#1b2227"/><rect x="31" y="95" width="8" height="10" rx="4" fill="' + J[3] + '"/><rect x="81" y="95" width="8" height="10" rx="4" fill="' + J[3] + '"/>';
    // cheering: both arms up, in the jacket's sleeves, with the animal's own paws
    var arms = o.mood === 'cheer' ? '<g class="arm-l"><path d="M24 112 Q12 96 14 78" stroke="' + J[0] + '" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="14" cy="74" r="6.5" fill="' + (kind === 'frog' ? c.fur : c.fur) + '"/></g>' +
      '<g class="arm-r"><path d="M96 112 Q108 96 106 78" stroke="' + J[0] + '" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="106" cy="74" r="6.5" fill="' + c.fur + '"/></g>' : '';
    var outfit = '', back = '';
    if (OM.drawOutfit) {
      // things worn on the back are scaled up to these wider shoulders; anything held gets a sleeved arm and a paw round
      // its handle (the younger animals have their own little arms)
      var sp = { top: A.hatY || A.top, hatS: A.hatS, eyes: A.eyes, eyeR: A.eyeR }, wear = Object.assign({}, o.wear || {}), held = wear.held; delete wear.held;
      var dr = OM.drawOutfit(wear, sp); outfit = dr.front; back = dr.back ? '<g transform="translate(60 112) scale(1.32) translate(-60 -112)">' + dr.back + '</g>' : '';
      if (held) {
        var hd = OM.drawOutfit({ held: held }, sp);
        back += hd.back;
        outfit += o.mood === 'cheer' ? hd.front : '<path d="M101 110 Q104 120 94 126" stroke="' + o.jacket[0] + '" stroke-width="12" fill="none" stroke-linecap="round"/>' + hd.front +
          '<ellipse cx="93" cy="126" rx="6.5" ry="5.5" fill="' + c.fur + '"/><path d="M89 124 Q93 122 97 124" stroke="' + c.shade + '" stroke-width="1" fill="none" opacity=".6"/>';
      }
    }
    // a soft shadow where the head meets the body
    var shadow = '<ellipse cx="60" cy="100" rx="30" ry="6" fill="#000" opacity="' + f(.12 + .12 * real) + '"/>';
    return '<svg class="char avatar real ' + kind + ' ' + (o.cls || '') + '" overflow="visible" style="--d:-' + (Math.random() * 5).toFixed(2) + 's" viewBox="0 -8 120 152" width="' + size + '" height="' + Math.round(size * 1.27) + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>' + defs + '</defs>' +
      '<ellipse cx="60" cy="142" rx="38" ry="4" fill="#15292a" opacity=".14"/>' + back + '<g class="breathe">' + body + shadow + head + eyes + outfit + arms + '</g></svg>';
  };
  // the rulers wear a gold crown and a velvet robe with an ermine collar; guards wear a steel helmet and armour over a
  // tunic in their area's colour
  function baddie(kind, role, o, A, c, L, id, defs, head, eyes, size, real) {
    var T = A.top, body = '', top = '', S = 'url(#' + id + 's)', Gd = 'url(#' + id + 'g)';
    if (role === 'king') {
      defs += '<linearGradient id="' + id + 'v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a8283a"/><stop offset="1" stop-color="#4f0c18"/></linearGradient>';
      body = '<path d="M12 140 Q12 108 36 100 Q48 96 60 96 Q72 96 84 100 Q108 108 108 140 Z" fill="url(#' + id + 'v)"/>' +
        '<path d="M30 116 Q36 128 34 140 M90 116 Q84 128 86 140" stroke="#000" stroke-width="2.2" fill="none" opacity="' + f(.15 + .2 * real) + '"/>';
      // the ermine collar: white fur with black tail tips
      var stole = [[14, 120], [22, 104], [40, 98], [60, 106], [80, 98], [98, 104], [106, 120], [86, 112], [60, 118], [34, 112]];
      body += '<path d="' + furry(stole, 1 + 2 * real, L.r) + '" fill="#f6f2ea"/>' + fur(stole, 10 + 40 * real, [60, 90], 3, '#cfc8bb', .8, .7, L.r);
      [[26, 108], [42, 104], [78, 104], [94, 108], [60, 112]].forEach(function (q) { body += '<path d="M' + q[0] + ' ' + (q[1] - 3) + ' q2 3 0 7 q-2 -4 0 -7 Z" fill="#141414"/>'; });
      body += '<path d="M40 110 Q60 130 80 110" stroke="' + Gd + '" stroke-width="2.6" fill="none" stroke-dasharray="3 2"/><circle cx="60" cy="125" r="6.5" fill="' + Gd + '"/><circle cx="60" cy="125" r="3" fill="#3a6fd6"/><circle cx="59" cy="124" r="1" fill="#fff" opacity=".8"/>';
      // the crown, sitting on top of the head
      top = '<g class="crown" transform="translate(60 ' + (T + 2) + ') scale(' + (kind === 'crow' ? .8 : .92) + ') translate(-60 -26)">' +
        '<path d="M34 28 L36 4 L48 16 L60 -4 L72 16 L84 4 L86 28 Q60 32 34 28 Z" fill="' + Gd + '"/><path d="M34 28 Q60 32 86 28 L86 22 Q60 26 34 22 Z" fill="#7a1220"/>' +
        '<path d="M36 4 L48 16 L60 -4 L72 16 L84 4" stroke="#fff3c2" stroke-width="1" fill="none" opacity=".7"/>' +
        '<circle cx="60" cy="12" r="4" fill="#c0263a"/><circle cx="46" cy="19" r="2.8" fill="#2f6ad6"/><circle cx="74" cy="19" r="2.8" fill="#2f6ad6"/><circle cx="59" cy="11" r="1.2" fill="#fff" opacity=".8"/>' +
        '<circle cx="36" cy="4" r="2.4" fill="' + Gd + '"/><circle cx="60" cy="-4" r="2.6" fill="' + Gd + '"/><circle cx="84" cy="4" r="2.4" fill="' + Gd + '"/><path class="shine" d="M40 10 L42 6 L44 10 L42 14 Z" fill="#fff"/></g>';
    } else {
      var tun = o.colour || c.shade;
      defs += '<linearGradient id="' + id + 't" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + mix(tun, '#ffffff', .15) + '"/><stop offset="1" stop-color="' + mix(tun, '#000000', .45) + '"/></linearGradient>';
      body = '<path d="M12 140 Q12 108 36 100 Q48 96 60 96 Q72 96 84 100 Q108 108 108 140 Z" fill="url(#' + id + 't)"/>' +
        '<path d="M38 104 Q60 96 82 104 L80 130 Q60 138 40 130 Z" fill="' + S + '"/><path d="M42 108 Q60 101 78 108" stroke="#fff" stroke-width="1.5" fill="none" opacity=".5"/><path d="M60 100 V134" stroke="#56606a" stroke-width="1.2" opacity=".6"/>' +
        '<ellipse cx="27" cy="110" rx="15" ry="10" fill="' + S + '"/><ellipse cx="93" cy="110" rx="15" ry="10" fill="' + S + '"/><path d="M14 110 Q27 100 40 110 M80 110 Q93 100 106 110" stroke="#eef1f4" stroke-width="1.5" fill="none" opacity=".6"/>' +
        '<rect x="34" y="130" width="52" height="7" rx="2" fill="#3a2a1c"/><rect x="55" y="128.5" width="10" height="10" rx="2" fill="' + Gd + '"/>';
      // the helmet over the top of the head, with a plume
      top = '<g transform="translate(60 ' + (T + 4) + ') scale(' + (kind === 'crow' ? .82 : .95) + ') translate(-60 -26)">' +
        '<path d="M24 32 Q24 -6 60 -8 Q96 -6 96 32 Q60 24 24 32 Z" fill="' + S + '"/><path d="M24 32 Q60 24 96 32 L96 38 Q60 30 24 38 Z" fill="#5d6670"/>' +
        '<path d="M60 -8 V28" stroke="#dfe5ea" stroke-width="3" opacity=".8"/><path d="M36 6 Q46 -2 58 -4" stroke="#fff" stroke-width="2" fill="none" opacity=".55"/>' +
        '<circle cx="32" cy="33" r="1.6" fill="#dfe5ea"/><circle cx="46" cy="30" r="1.6" fill="#dfe5ea"/><circle cx="74" cy="30" r="1.6" fill="#dfe5ea"/><circle cx="88" cy="33" r="1.6" fill="#dfe5ea"/>' +
        '<path class="plume" d="M60 -8 Q66 -24 82 -24 Q74 -12 64 -4 Z" fill="#b8263a"/></g>';
    }
    var shadow = '<ellipse cx="60" cy="100" rx="30" ry="6" fill="#000" opacity="' + f(.15 + .12 * real) + '"/>';
    return '<svg class="char ' + role + ' real ' + kind + ' ' + (o.cls || '') + '" overflow="visible" style="--d:-' + (Math.random() * 5).toFixed(2) + 's" viewBox="0 -8 120 152" width="' + size + '" height="' + Math.round(size * 1.27) + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>' + defs + '</defs>' +
      '<ellipse cx="60" cy="142" rx="38" ry="4" fill="#15292a" opacity=".14"/><g class="breathe">' + body + shadow + head + eyes + top + '</g></svg>';
  }

  OM.naturalKinds = Object.keys(NAT);
})(typeof window !== 'undefined' ? window : globalThis);
