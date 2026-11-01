/* Learn with Pip — one adventure per school year. Each world sets the map's sky, scenery and path, the story, and the
   name of the final gate. Younger worlds are bright and gentle; older ones are bigger and more dramatic.
   Scenery parts reuse the animation classes in css/app.css (sway, tw, mf, mist, shoot, moonglow). */
(function (G) {
  'use strict';
  var OM = G.OM;

  // where the clearings sit on the 1000 x 660 map, for 7, 8 or 9 areas (the path runs in this order)
  var NODE_SETS = {
    6: [[130, 540], [300, 430], [190, 290], [400, 200], [600, 330], [760, 440]],
    7: [[120, 540], [275, 440], [150, 315], [335, 205], [525, 290], [690, 450], [770, 250]],
    8: [[120, 540], [275, 440], [150, 315], [335, 205], [525, 290], [655, 455], [820, 380], [735, 200]],
    9: [[110, 565], [255, 470], [130, 350], [290, 235], [465, 305], [560, 475], [720, 460], [830, 330], [720, 195]]
  };
  OM.mapNodes = function (n) { return NODE_SETS[n] || NODE_SETS[8]; };
  OM.MAP_GATE = [905, 105];

  function near(nodes, x, y, d) { return nodes.concat([OM.MAP_GATE, [470, 575]]).some(function (n) { return Math.hypot(n[0] - x, n[1] - y) < d; }); }
  function sway(r) { return '<g class="sway" style="animation-delay:-' + (r.next() * 6).toFixed(1) + 's;animation-duration:' + (5 + r.next() * 3).toFixed(1) + 's">'; }
  function stars(r, n, maxY, col) { var s = ''; for (var i = 0; i < n; i++) s += '<circle class="tw" style="animation-delay:-' + (r.next() * 4).toFixed(1) + 's" cx="' + r.int(0, 1000) + '" cy="' + r.int(0, maxY) + '" r="' + (r.next() * 1.3 + .4).toFixed(1) + '" fill="' + (col || '#dcebe6') + '" opacity="' + (r.next() * .5 + .2).toFixed(2) + '"/>'; return s; }
  function flies(r, n, col, minY) { var s = ''; for (var i = 0; i < n; i++) s += '<circle class="mf" style="animation-delay:-' + (r.next() * 9).toFixed(1) + 's;animation-duration:' + (7 + r.next() * 5).toFixed(1) + 's" cx="' + r.int(40, 960) + '" cy="' + r.int(minY || 220, 640) + '" r="2.6" fill="' + col + '"/>'; return '<g filter="url(#glowf)">' + s + '</g>'; }
  function clouds(r, n, col, op) {
    var s = '';
    for (var i = 0; i < n; i++) { var x = r.int(0, 900), y = r.int(30, 230), w = r.int(70, 140); s += '<g class="mist" style="animation-duration:' + r.int(30, 50) + 's;animation-delay:-' + r.int(0, 30) + 's" opacity="' + (op || .85) + '"><ellipse cx="' + x + '" cy="' + y + '" rx="' + w + '" ry="' + (w * .28) + '" fill="' + col + '"/><ellipse cx="' + (x - w * .3) + '" cy="' + (y - w * .14) + '" rx="' + (w * .4) + '" ry="' + (w * .3) + '" fill="' + col + '"/><ellipse cx="' + (x + w * .25) + '" cy="' + (y - w * .18) + '" rx="' + (w * .45) + '" ry="' + (w * .34) + '" fill="' + col + '"/></g>'; }
    return s;
  }
  function pine(x, y, s, fill) { return '<path d="M' + x + ' ' + (y - s * 1.6) + 'L' + (x + s * .55) + ' ' + (y - s * .7) + 'H' + (x + s * .3) + 'L' + (x + s * .75) + ' ' + y + 'H' + (x - s * .75) + 'L' + (x - s * .3) + ' ' + (y - s * .7) + 'H' + (x - s * .55) + 'Z" fill="' + fill + '"/>'; }

  var SCENERY = {
    // Year 1: rolling hills, flowers and drifting clouds in sunshine
    meadow: function (r, nodes) {
      var out = '<ellipse cx="200" cy="700" rx="520" ry="260" fill="#9ed67f"/><ellipse cx="820" cy="720" rx="560" ry="300" fill="#8fcf72"/><ellipse cx="520" cy="760" rx="600" ry="250" fill="#a9de86"/>' + clouds(r, 6, '#ffffff', .9);
      for (var i = 0; i < 90; i++) {
        var x = r.int(10, 990), y = r.int(300, 650); if (near(nodes, x, y, 80)) continue;
        if (r.chance(.25)) out += sway(r) + '<path d="M' + x + ' ' + y + ' q-14 -26 0 -38 q14 12 0 38" fill="#5fae55"/></g>';
        else out += sway(r) + '<path d="M' + x + ' ' + y + ' v-14" stroke="#4f9a4b" stroke-width="2"/><circle cx="' + x + '" cy="' + (y - 16) + '" r="5" fill="' + r.pick(['#ff8fb1', '#ffd23f', '#ffffff', '#b28dff', '#ff9b54']) + '"/><circle cx="' + x + '" cy="' + (y - 16) + '" r="1.8" fill="#ffb703"/></g>';
      }
      return out + flies(r, 10, '#fff3a3', 300);
    },
    // Year 2: a rainbow river with reeds, lily pads and round trees
    river: function (r, nodes) {
      var out = '<path class="riverband" d="M-20 470 C160 420 260 600 460 540 S760 380 1020 450 L1020 520 C760 450 640 640 440 610 S140 500 -20 545Z" fill="#5cc2e8" opacity=".85"/>' +
        '<path class="shimmer" d="M-20 500 C160 450 260 620 460 570 S760 410 1020 480" fill="none" stroke="#e8fbff" stroke-width="3" stroke-dasharray="18 26" opacity=".7"/>' +
        '<path d="M0 120 Q500 -60 1000 120" fill="none" stroke="#ff8fb1" stroke-width="10" opacity=".35"/><path d="M0 132 Q500 -48 1000 132" fill="none" stroke="#ffd23f" stroke-width="10" opacity=".35"/><path d="M0 144 Q500 -36 1000 144" fill="none" stroke="#7bd389" stroke-width="10" opacity=".35"/><path d="M0 156 Q500 -24 1000 156" fill="none" stroke="#6cb4ff" stroke-width="10" opacity=".35"/>' +
        clouds(r, 4, '#ffffff', .85);
      for (var i = 0; i < 60; i++) {
        var x = r.int(10, 990), y = r.int(200, 650); if (near(nodes, x, y, 85)) continue;
        var s = r.int(16, 28);
        if (r.chance(.5)) out += sway(r) + '<rect x="' + (x - 3) + '" y="' + (y - s) + '" width="6" height="' + s + '" fill="#8a5a3a"/><circle cx="' + x + '" cy="' + (y - s - s * .6) + '" r="' + s * .9 + '" fill="' + r.pick(['#5fae55', '#4f9d5d', '#6cbf5f']) + '"/></g>';
        else out += sway(r) + '<path d="M' + x + ' ' + y + ' q-3 -22 -1 -34 M' + (x + 5) + ' ' + y + ' q2 -18 6 -28" stroke="#3e8a3d" stroke-width="3" fill="none"/><ellipse cx="' + (x - 1) + '" cy="' + (y - 36) + '" rx="3" ry="8" fill="#8a5a3a"/></g>';
      }
      return out + flies(r, 8, '#ffffff', 300);
    },
    // Year 3: glowing crystal caves
    caves: function (r, nodes) {
      var out = '', i;
      for (i = 0; i < 26; i++) { var x = i * 40 + r.int(-8, 8), h = r.int(30, 110); out += '<path d="M' + (x - 18) + ' 0 L' + x + ' ' + h + ' L' + (x + 18) + ' 0Z" fill="' + r.pick(['#2b1f4f', '#33265c', '#251a45']) + '"/>'; }
      for (i = 0; i < 40; i++) {
        var cx = r.int(10, 990), cy = r.int(160, 650); if (near(nodes, cx, cy, 85)) continue;
        var col = r.pick(['#7ee8fa', '#c084fc', '#f472b6', '#86efac']), s = r.int(10, 22);
        out += '<g class="tw" style="animation-delay:-' + (r.next() * 4).toFixed(1) + 's;animation-duration:' + (3 + r.next() * 3).toFixed(1) + 's" filter="url(#glowf)"><path d="M' + cx + ' ' + (cy - s * 2.2) + ' L' + (cx + s * .5) + ' ' + (cy - s * .6) + ' L' + cx + ' ' + cy + ' L' + (cx - s * .5) + ' ' + (cy - s * .6) + 'Z" fill="' + col + '" opacity=".85"/>' +
          '<path d="M' + (cx + s * .7) + ' ' + (cy - s * 1.2) + ' L' + (cx + s * 1.0) + ' ' + (cy - s * .3) + ' L' + (cx + s * .7) + ' ' + cy + ' L' + (cx + s * .4) + ' ' + (cy - s * .3) + 'Z" fill="' + col + '" opacity=".6"/></g>';
      }
      return out + flies(r, 16, '#c4f1ff', 160);
    },
    // Year 4: the Whispering Wood at dusk
    wood: function (r, nodes) {
      var back = '', front = '';
      for (var i = 0; i < 70; i++) {
        var x = r.int(0, 1000), y = r.int(30, 660), s = r.int(22, 46);
        if (near(nodes, x, y - s * .6, 95)) continue;
        if (y < 360) back += sway(r) + pine(x, y, s * .8, r.pick(['#123a3c', '#15403f', '#10353a'])) + '</g>'; else front += sway(r) + pine(x, y, s, r.pick(['#184a45', '#1b5249', '#164440'])) + '</g>';
      }
      var mist = '<g class="mist" opacity=".16"><ellipse cx="300" cy="470" rx="260" ry="26" fill="#dcebe6" filter="url(#soft)"/><ellipse cx="760" cy="330" rx="220" ry="20" fill="#dcebe6" filter="url(#soft)"/></g>';
      return stars(r, 40, 200) + '<path class="shoot" d="M640 40 L700 70" stroke="#fff4d1" stroke-width="2.5" stroke-linecap="round"/>' + back + mist + front + flies(r, 14, '#ffd56b');
    },
    // Year 5: floating islands in a sunset sky
    sky: function (r, nodes) {
      var out = clouds(r, 7, '#ffe3ec', .55);
      nodes.concat([OM.MAP_GATE]).forEach(function (n, i) {
        var w = i === nodes.length ? 120 : 92;
        out += '<g class="float" style="animation-delay:-' + (i * .7).toFixed(1) + 's"><path d="M' + (n[0] - w) + ' ' + (n[1] + 30) + ' Q' + n[0] + ' ' + (n[1] + 12) + ' ' + (n[0] + w) + ' ' + (n[1] + 30) + ' L' + (n[0] + w * .3) + ' ' + (n[1] + 110) + ' L' + (n[0] - w * .2) + ' ' + (n[1] + 96) + 'Z" fill="#7a5a8c"/>' +
          '<path d="M' + (n[0] - w) + ' ' + (n[1] + 30) + ' Q' + n[0] + ' ' + (n[1] + 12) + ' ' + (n[0] + w) + ' ' + (n[1] + 30) + ' Q' + n[0] + ' ' + (n[1] + 42) + ' ' + (n[0] - w) + ' ' + (n[1] + 30) + 'Z" fill="#7bd389"/></g>';
      });
      for (var i = 0; i < 6; i++) { var bx = r.int(100, 900), by = r.int(60, 260); out += '<path class="mf" style="animation-duration:' + r.int(9, 14) + 's;animation-delay:-' + r.int(0, 9) + 's" d="M' + bx + ' ' + by + ' q6 -6 12 0 q6 -6 12 0" fill="none" stroke="#3b2a55" stroke-width="2.5" stroke-linecap="round"/>'; }
      return out + clouds(r, 3, '#ffffff', .7);
    },
    // Year 6: mountain peaks under an aurora
    peaks: function (r) {
      var out = stars(r, 70, 300, '#e6ecff') + '<path class="shoot" d="M640 40 L700 70" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>' +
        '<g class="mist" style="animation-duration:22s" opacity=".35"><path d="M-50 150 C200 60 400 220 600 110 S900 60 1050 140" fill="none" stroke="#5eead4" stroke-width="38" filter="url(#soft)"/><path d="M-50 190 C250 120 450 260 650 160 S900 120 1050 190" fill="none" stroke="#a78bfa" stroke-width="26" filter="url(#soft)"/></g>' +
        '<path d="M-20 660 L120 380 L230 520 L380 300 L520 500 L640 330 L780 520 L900 360 L1020 520 L1020 660Z" fill="#1c2550"/>' +
        '<path d="M-20 660 L80 520 L200 600 L330 470 L470 610 L610 480 L760 620 L880 500 L1020 600 L1020 660Z" fill="#232e63"/>' +
        '<path d="M380 300 L410 360 L395 352 L380 372 L362 350 L350 356Z M640 330 L668 384 L652 376 L640 394 L626 376 L614 382Z M120 380 L146 432 L132 424 L120 440 L108 426 L96 432Z" fill="#e6ecff" opacity=".85"/>';
      return out + flies(r, 10, '#a5f3fc', 300);
    }
  };

  // Year 7: Clockwork City at dusk — clock towers, turning gears, steam and lit windows
  function gear(x, y, R, teeth, col, dur, rev) {
    var p = '', n = teeth * 2;
    for (var i = 0; i < n; i++) { var a = i * Math.PI / teeth, r = i % 2 ? R * .82 : R; p += (i ? 'L' : 'M') + (x + r * Math.cos(a)).toFixed(1) + ' ' + (y + r * Math.sin(a)).toFixed(1); }
    return '<g class="spin" style="animation-duration:' + dur + 's' + (rev ? ';animation-direction:reverse' : '') + '"><path d="' + p + 'Z" fill="' + col + '"/><circle cx="' + x + '" cy="' + y + '" r="' + R * .32 + '" fill="#1a2433"/></g>';
  }
  SCENERY.city = function (r, nodes) {
    var out = stars(r, 30, 160, '#ffe9c7'), x, i;
    // far skyline
    for (x = -20; x < 1020; x += r.int(40, 80)) { var h = r.int(120, 260); out += '<rect x="' + x + '" y="' + (660 - h) + '" width="' + r.int(36, 70) + '" height="' + h + '" fill="#2b3550"/>'; }
    // clock towers
    [[70, 330], [480, 360], [960, 300]].forEach(function (t) {
      var tx = t[0], ty = t[1];
      out += '<rect x="' + (tx - 30) + '" y="' + ty + '" width="60" height="' + (660 - ty) + '" fill="#232c44"/><path d="M' + (tx - 38) + ' ' + ty + ' L' + tx + ' ' + (ty - 60) + ' L' + (tx + 38) + ' ' + ty + 'Z" fill="#1d253a"/>' +
        '<circle cx="' + tx + '" cy="' + (ty + 40) + '" r="22" fill="#ffe2a8" opacity=".9"/><g class="spin" style="animation-duration:60s;transform-origin:' + tx + 'px ' + (ty + 40) + 'px;transform-box:view-box"><path d="M' + tx + ' ' + (ty + 40) + ' V' + (ty + 24) + '" stroke="#3a2a12" stroke-width="3"/></g><path d="M' + tx + ' ' + (ty + 40) + ' H' + (tx + 11) + '" stroke="#3a2a12" stroke-width="3.5"/>';
    });
    // near rooftops with lit windows
    for (x = -10; x < 1020; x += r.int(60, 110)) {
      var hh = r.int(70, 150), w = r.int(50, 100);
      out += '<rect x="' + x + '" y="' + (660 - hh) + '" width="' + w + '" height="' + hh + '" fill="#1c2335"/>';
      for (i = 0; i < 6; i++) if (r.chance(.5)) out += '<rect class="tw" style="animation-duration:' + r.int(5, 11) + 's;animation-delay:-' + r.int(0, 9) + 's" x="' + (x + 8 + (i % 3) * (w / 3.4)) + '" y="' + (660 - hh + 14 + Math.floor(i / 3) * 26) + '" width="9" height="13" fill="#ffd27a" opacity=".85"/>';
    }
    // gears tucked between the clearings
    for (i = 0; i < 9; i++) { var gx = r.int(40, 960), gy = r.int(150, 600); if (near(nodes, gx, gy, 110)) continue; var R = r.int(18, 46); out += gear(gx, gy, R, r.int(8, 12), r.pick(['#b9873a', '#c99a4a', '#8f6a2e']), r.int(14, 30), r.chance(.5)); }
    // steam
    out += '<g class="mist" opacity=".22"><ellipse cx="260" cy="420" rx="200" ry="22" fill="#e9eef7" filter="url(#soft)"/><ellipse cx="760" cy="300" rx="180" ry="18" fill="#e9eef7" filter="url(#soft)"/></g>';
    return out + flies(r, 10, '#ffd27a', 200);
  };

  // Year 8: a deep-sea research station — light shafts, kelp, glowing jellyfish and rising bubbles
  SCENERY.sea = function (r, nodes) {
    var out = '', i;
    for (i = 0; i < 5; i++) { var lx = r.int(80, 920); out += '<path class="mist" style="animation-duration:' + r.int(18, 30) + 's" d="M' + lx + ' 0 L' + (lx + 70) + ' 0 L' + (lx + 210) + ' 660 L' + (lx + 60) + ' 660Z" fill="#9fe7ff" opacity=".06"/>'; }
    out += '<path d="M-20 660 Q120 600 260 630 T540 610 T820 630 T1020 600 L1020 660Z" fill="#0b2c3d"/>';
    for (i = 0; i < 46; i++) {
      var x = r.int(10, 990), y = r.int(380, 660); if (near(nodes, x, y - 30, 80)) continue;
      var h = r.int(50, 140), c = r.pick(['#1f6b5c', '#2a7f62', '#195a52']);
      out += sway(r) + '<path d="M' + x + ' ' + y + ' C' + (x - 18) + ' ' + (y - h * .35) + ' ' + (x + 18) + ' ' + (y - h * .65) + ' ' + (x - 4) + ' ' + (y - h) + '" stroke="' + c + '" stroke-width="' + r.int(5, 9) + '" fill="none" stroke-linecap="round"/></g>';
    }
    for (i = 0; i < 7; i++) { var jx = r.int(60, 940), jy = r.int(80, 360); if (near(nodes, jx, jy, 90)) continue; var jc = r.pick(['#f472b6', '#c084fc', '#7ee8fa']);
      out += '<g class="float" style="animation-delay:-' + r.int(0, 6) + 's" filter="url(#glowf)"><path d="M' + (jx - 16) + ' ' + jy + ' Q' + jx + ' ' + (jy - 26) + ' ' + (jx + 16) + ' ' + jy + 'Z" fill="' + jc + '" opacity=".75"/><path d="M' + (jx - 9) + ' ' + jy + ' q-3 14 2 26 M' + jx + ' ' + jy + ' q3 14 -2 28 M' + (jx + 9) + ' ' + jy + ' q-3 14 2 24" stroke="' + jc + '" stroke-width="2" fill="none" opacity=".6"/></g>'; }
    for (i = 0; i < 4; i++) { var fx = r.int(100, 900), fy = r.int(140, 520); out += '<path class="mf" style="animation-duration:' + r.int(10, 16) + 's;animation-delay:-' + r.int(0, 9) + 's" d="M' + fx + ' ' + fy + ' q12 -8 24 0 q-12 8 -24 0 Z M' + (fx + 24) + ' ' + fy + ' l8 -6 v12 Z" fill="#ffb347" opacity=".8"/>'; }
    return out + flies(r, 22, '#c4f1ff', 80);
  };
  // Year 9: a lost temple in the jungle at sunset — stepped pyramid, vines, glyph stones and fireflies
  SCENERY.temple = function (r, nodes) {
    var out = '', i;
    out += '<path d="M560 330 L940 330 L900 290 L600 290Z M600 290 L900 290 L865 250 L635 250Z M635 250 L865 250 L830 210 L670 210Z M670 210 L830 210 L800 172 L700 172Z" fill="#5a4a3a" opacity=".55"/>';
    out += '<path d="M-20 660 Q150 560 330 600 T700 570 T1020 590 L1020 660Z" fill="#203a26"/>';
    for (i = 0; i < 40; i++) {
      var x = r.int(0, 1000), y = r.int(200, 660), s = r.int(26, 52); if (near(nodes, x, y - s * .6, 95)) continue;
      out += sway(r) + '<path d="M' + x + ' ' + y + ' q-' + s + ' -' + s * .4 + ' -' + s * .2 + ' -' + s * 1.1 + ' q' + s * .2 + ' ' + s * .5 + ' ' + s * .2 + ' ' + s * 1.1 + ' q' + s + ' -' + s * .5 + ' ' + s * .3 + ' -' + s * 1.2 + ' q-' + s * .1 + ' ' + s * .6 + ' -' + s * .3 + ' ' + s * 1.2 + 'Z" fill="' + r.pick(['#2f5e35', '#3a6e3c', '#285230']) + '"/></g>';
    }
    for (i = 0; i < 8; i++) { var gx = r.int(40, 960), gy = r.int(220, 620); if (near(nodes, gx, gy, 100)) continue; out += '<rect x="' + (gx - 16) + '" y="' + (gy - 26) + '" width="32" height="26" rx="3" fill="#8a7a62"/><path d="M' + (gx - 8) + ' ' + (gy - 18) + ' h16 M' + (gx - 4) + ' ' + (gy - 12) + ' l4 -4 l4 4" stroke="#5a4a3a" stroke-width="2" fill="none"/>'; }
    for (i = 0; i < 6; i++) { var vx = r.int(0, 1000); out += sway(r) + '<path d="M' + vx + ' 0 q' + r.int(-30, 30) + ' ' + r.int(60, 120) + ' ' + r.int(-10, 10) + ' ' + r.int(140, 220) + '" stroke="#3d6b3a" stroke-width="4" fill="none"/></g>'; }
    return out + flies(r, 16, '#ffd56b', 240);
  };

  // Year 10: Neon City at night — glowing skyline outlines, holographic signs and drones
  SCENERY.neon = function (r, nodes) {
    var out = stars(r, 25, 140, '#c9b8ff'), x, i, cols = ['#ff4fd8', '#38e8ff', '#a66bff', '#4dffb8'];
    for (x = -20; x < 1020; x += r.int(50, 90)) { var h = r.int(160, 330), w = r.int(40, 80), c = r.pick(cols); out += '<rect x="' + x + '" y="' + (660 - h) + '" width="' + w + '" height="' + h + '" fill="#1a1338"/><path d="M' + x + ' 660 V' + (660 - h) + ' H' + (x + w) + ' V660" fill="none" stroke="' + c + '" stroke-width="2" opacity=".55" filter="url(#glowf)"/>';
      for (i = 0; i < 5; i++) if (r.chance(.45)) out += '<rect class="tw" style="animation-duration:' + r.int(4, 9) + 's;animation-delay:-' + r.int(0, 8) + 's" x="' + (x + 6 + r.int(0, w - 16)) + '" y="' + (660 - h + 14 + i * 28) + '" width="8" height="10" fill="' + c + '" opacity=".7"/>'; }
    for (i = 0; i < 5; i++) { var sx = r.int(60, 920), sy = r.int(120, 420); if (near(nodes, sx, sy, 110)) continue; var sc = r.pick(cols); out += '<g class="tw" style="animation-duration:' + r.int(3, 6) + 's"><rect x="' + sx + '" y="' + sy + '" width="54" height="26" rx="4" fill="none" stroke="' + sc + '" stroke-width="2.5" filter="url(#glowf)"/><path d="M' + (sx + 10) + ' ' + (sy + 13) + ' h34" stroke="' + sc + '" stroke-width="2" stroke-dasharray="6 4"/></g>'; }
    for (i = 0; i < 4; i++) { var dx = r.int(100, 900), dy = r.int(60, 250); out += '<g class="mf" style="animation-duration:' + r.int(10, 16) + 's;animation-delay:-' + r.int(0, 9) + 's"><rect x="' + dx + '" y="' + dy + '" width="18" height="6" rx="3" fill="#cfd8ff"/><circle cx="' + (dx + 9) + '" cy="' + (dy + 9) + '" r="2.5" fill="#ff4fd8"/></g>'; }
    return out + flies(r, 12, '#38e8ff', 300);
  };

  // Year 11: an ice citadel under the northern lights
  SCENERY.aurora = function (r) {
    var out = stars(r, 60, 280, '#e6f6ff');
    out += '<g class="mist" style="animation-duration:20s" opacity=".45"><path d="M-50 120 C200 30 420 190 640 80 S900 40 1050 120" fill="none" stroke="#4dffb8" stroke-width="44" filter="url(#soft)"/><path d="M-50 170 C240 100 470 230 680 140 S920 100 1050 170" fill="none" stroke="#a66bff" stroke-width="30" filter="url(#soft)"/></g>';
    out += '<path d="M-20 660 L110 400 L220 520 L360 330 L500 520 L620 360 L760 520 L880 380 L1020 520 L1020 660Z" fill="#163847"/><path d="M-20 660 L90 540 L210 610 L340 500 L480 620 L620 520 L760 630 L890 540 L1020 610 L1020 660Z" fill="#1d4757"/>';
    out += '<path d="M360 330 L392 392 L376 386 L360 404 L344 386 L330 392Z M620 360 L648 414 L632 408 L620 424 L606 408 L592 414Z M110 400 L136 452 L122 446 L110 462 L98 446 L84 452Z" fill="#e9f7ff" opacity=".9"/>';
    return out + flies(r, 14, '#c4f1ff', 300);
  };

  OM.WORLDS = {
    1: { name: 'Sunny Meadow', icon: 'leaf', scenery: 'meadow', page: '#1f5a8a', sky: ['#8fd3ff', '#d9f2c8'], light: true, sun: true, path: ['#f3e2b0', '#d6c28a'], gate: 'Garden Gate', goal: 'find the picnic',
      story: [
        { who: 'owl', mood: 'sad', text: 'Hello! I’m {owl}. I was getting ready for a picnic in the Sunny Meadow. But {king} has hidden all my picnic baskets!' },
        { who: 'king', text: '{King} says: “You can have your picnic back if you can solve my number puzzles! {laugh}”' },
        { who: 'both', mood: 'think', text: 'You came to help! Each part of the meadow has some maths to try. We earn feathers and acorns as we go.' },
        { who: 'owl', mood: 'cheer', text: 'Answer the guards’ puzzles to find the baskets. Then we go to the Garden Gate. Let’s go!' }] },
    2: { name: 'Rainbow River', icon: 'compass', scenery: 'river', page: '#17507a', sky: ['#9ed8f7', '#d4f1dd'], light: true, sun: true, path: ['#f1e0b8', '#cdb684'], gate: 'Waterfall Gate', goal: 'reach the waterfall',
      story: [
        { who: 'owl', mood: 'sad', text: 'Hoo-hoo! I’m {owl}. I was sailing down the Rainbow River when {king} built dams all the way along it!' },
        { who: 'king', text: '{King} says: “No boat gets past my dams… unless you can solve my maths puzzles! {laugh}”' },
        { who: 'both', mood: 'think', text: 'You’re here! Each stop on the river has a maths topic. Practise with me to earn feathers and acorns.' },
        { who: 'owl', mood: 'cheer', text: 'Beat each guard to open a dam. Then we sail to the Waterfall Gate and face {king}. Ready?' }] },
    3: { name: 'Crystal Caves', icon: 'spark', scenery: 'caves', page: '#1e1638', sky: ['#1d1536', '#3b2b62'], path: ['#4a3b78', '#6d5aa8'], gate: 'Crystal Door', goal: 'find the way out',
      story: [
        { who: 'owl', mood: 'sad', text: 'Hoo-hoo! I’m {owl}. I was exploring the Crystal Caves when {king} sealed every tunnel with magic crystals!' },
        { who: 'king', text: '{King} says: “My crystals only open for clever explorers. Solve my puzzles, if you can! {laugh}”' },
        { who: 'both', mood: 'think', text: 'You found me! Every cavern holds a different maths topic. Master them to earn feathers and acorns.' },
        { who: 'owl', mood: 'cheer', text: 'Beat each guard to light up the tunnels. Then we face {king} at the Crystal Door. Let’s go!' }] },
    4: { name: 'The Whispering Wood', icon: 'tree', scenery: 'wood', page: '#0e2a2f', sky: ['#0b2226', '#174a43'], path: ['#2a5d5a', '#3d7470'], gate: 'Forest Gate', goal: 'escape the wood', moon: true,
      story: [
        { who: 'owl', mood: 'sad', text: 'Hoo-hoo! I’m {owl}. I was exploring the Whispering Wood when {king} and the guards blocked every path home!' },
        { who: 'king', text: '{King} says: “No owl leaves MY wood… unless you can solve my maths puzzles! {laugh}”' },
        { who: 'both', mood: 'think', text: 'You came to help! Each clearing in the wood is a maths topic. If you help me practise, we earn feathers and acorns.' },
        { who: 'owl', mood: 'cheer', text: 'Beat each guard’s challenge to move along the path. Then we face {king} at the Forest Gate. Will you help me escape?' }] },
    5: { name: 'Sky Islands', icon: 'compass', scenery: 'sky', page: '#26305f', sky: ['#5b74d6', '#f6b8c4'], path: ['#f2d9a6', '#c9a86b'], gate: 'Cloud Castle', goal: 'rebuild the bridges', sun: true,
      story: [
        { who: 'owl', mood: 'think', text: 'Hoo-hoo! I’m {owl}, and I’ve learned to fly between the Sky Islands. But {king} has cut the rope bridges and taken over the Cloud Castle.' },
        { who: 'king', text: '{King} says: “Nobody crosses my sky unless they can out-think me. Good luck with that! {laugh}”' },
        { who: 'both', mood: 'think', text: 'You’re here! Each island holds a set of maths challenges. Master them to rebuild the bridges and earn feathers and acorns.' },
        { who: 'owl', mood: 'cheer', text: 'Beat every island’s guard, then take on {king} at the Cloud Castle. Ready for take-off?' }] },
    6: { name: 'Midnight Mountains', icon: 'trophy', scenery: 'peaks', page: '#0b1129', sky: ['#070b1f', '#28306a'], path: ['#3a4580', '#5b67b0'], gate: 'The Observatory', goal: 'reach the Observatory', moon: true,
      story: [
        { who: 'owl', mood: 'think', text: 'This is our biggest adventure yet. {King} has stolen the great telescope from the Observatory at the top of the Midnight Mountains.' },
        { who: 'king', text: '{King} says: “Climb my mountains if you dare. Only the sharpest minds will reach the top. {laugh}”' },
        { who: 'both', mood: 'think', text: 'You and me, all the way up. Each peak tests a different part of maths, just like the real SATs papers in May.' },
        { who: 'owl', mood: 'cheer', text: 'Conquer every peak, then face {king} at the Observatory. Let’s climb!' }] }
  };
  OM.WORLDS[7] = { name: 'Clockwork City', icon: 'timer', scenery: 'city', page: '#141b2b', sky: ['#1b2440', '#c0675a'], path: ['#7a6b55', '#a58e6a'], gate: 'The Great Clock', goal: 'restart the Great Clock', moon: true,
    story: [
      { who: 'owl', mood: 'think', text: 'New school, new city. I’m {owl}, and this time I’m your mission control. {King} has jammed the Great Clock, and every gear in Clockwork City has stopped.' },
      { who: 'king', text: '{King} says: “Time stands still until someone cracks my codes. Secondary maths is a different game. {laugh}”' },
      { who: 'both', mood: 'think', text: 'Each district runs on a different part of maths: number, algebra, ratio, geometry and data. Get them turning again and you earn feathers and acorns.' },
      { who: 'owl', mood: 'cheer', text: 'Beat each district’s guard, then take on {king} at the Great Clock. I’ll be on the headset. Let’s go.' }] };
  OM.WORLDS[8] = { name: 'Deep-Sea Station', icon: 'compass', scenery: 'sea', page: '#071b2a', sky: ['#0b3a55', '#04121e'], path: ['#2b6f86', '#4a93a8'], gate: 'The Sunken Vault', goal: 'reach the Sunken Vault',
    story: [
      { who: 'owl', mood: 'think', text: 'Mission control here. {owl} on the headset. {King} has taken over Deep-Sea Station and sealed the research decks one by one.' },
      { who: 'king', text: '{King} says: “Down here the pressure is crushing. Only real problem-solvers survive the deep. {laugh}”' },
      { who: 'both', mood: 'think', text: 'Each deck runs on a part of maths: number, algebra, graphs, ratio, geometry and data. Unlock them to earn feathers and acorns.' },
      { who: 'owl', mood: 'cheer', text: 'Beat every deck’s guard, then dive to the Sunken Vault to face {king}. Systems online. Let’s dive.' }] };
  OM.WORLDS[9] = { name: 'The Lost Temple', icon: 'trophy', scenery: 'temple', page: '#16130c', sky: ['#3a2a4a', '#e08a4f'], path: ['#9a8256', '#c2a774'], gate: 'The Sun Gate', goal: 'open the Sun Gate', sun: true,
    story: [
      { who: 'owl', mood: 'think', text: 'Our last adventure before GCSE. Deep in the jungle, {King} has locked the Lost Temple behind ancient maths puzzles.' },
      { who: 'king', text: '{King} says: “The Temple tests everything you have learned. Most explorers never reach the Sun Gate. {laugh}”' },
      { who: 'both', mood: 'think', text: 'Every chamber holds a harder kind of maths: Pythagoras, trigonometry, quadratics and proof. This is where GCSE begins.' },
      { who: 'owl', mood: 'cheer', text: 'Solve each chamber, beat its guard, then open the Sun Gate and face {king}. I’m with you all the way.' }] };
  OM.WORLDS[10] = { name: 'Neon City', icon: 'spark', scenery: 'neon', page: '#0d0920', sky: ['#120a2e', '#3b1f63'], path: ['#5b3fa0', '#8a6bd6'], gate: 'The Data Core', goal: 'reboot the Data Core',
    story: [
      { who: 'owl', mood: 'think', text: 'GCSE year one. {owl} here, mission control. {King} has hacked Neon City and locked the Data Core behind number, algebra and probability puzzles.' },
      { who: 'king', text: '{King} says: “Every light in this city answers to me now. You will need real exam skills to switch them back. {laugh}”' },
      { who: 'both', mood: 'think', text: 'Each district is a GCSE topic, with questions in grade bands from Grade 1–3 up to Grade 6–7. Practise to climb the bands.' },
      { who: 'owl', mood: 'cheer', text: 'Beat every district’s guard, then take on {king} at the Data Core with exam-style papers. Systems online. Let’s go.' }] };
  OM.WORLDS[11] = { name: 'The Aurora Citadel', icon: 'trophy', scenery: 'aurora', page: '#06151c', sky: ['#04121a', '#123a46'], path: ['#2e6b73', '#4f9aa0'], gate: 'The Crown Hall', goal: 'take back the Crown Hall', moon: true,
    story: [
      { who: 'owl', mood: 'think', text: 'This is it: the final year and the final adventure. {King} has taken the Aurora Citadel, high above the ice, and set the hardest challenges of all.' },
      { who: 'king', text: '{King} says: “Only someone ready for the real exam can reach my Crown Hall. Prove it. {laugh}”' },
      { who: 'both', mood: 'think', text: 'Each tower holds GCSE ratio, geometry and statistics. The papers at the Crown Hall are full mock exams in your exam board’s style.' },
      { who: 'owl', mood: 'cheer', text: 'Beat every tower’s guard, then pass the mock papers to win the Crown Hall. Everything you have learned since Year 1 leads here. Let’s finish this.' }] };
  OM.worldFor = function (year) { return OM.WORLDS[year] || OM.WORLDS[4]; };
  OM.worldScenery = function (world, rng, nodes) { return (SCENERY[world.scenery] || SCENERY.wood)(rng, nodes); };

  // the look of the characters grows with the child: little (Years 1-2), explorer (3-4), adventurer (5-6)
  OM.TIERS = [{ id: 'little', name: 'Little explorer' }, { id: 'mid', name: 'Explorer' }, { id: 'big', name: 'Adventurer' }, { id: 'pro', name: 'Pro' }];
  OM.tierForYear = function (year) { return year <= 2 ? 'little' : year <= 4 ? 'mid' : year <= 6 ? 'big' : 'pro'; };
  OM.tierIndex = function (t) { return ['little', 'mid', 'big', 'pro'].indexOf(t); };
})(typeof window !== 'undefined' ? window : globalThis);
