/* Mayes Maths & More — the dressing-up chest: the catalogue of outfits bought with acorns, and how each is drawn.
   Seven slots: hat, neck, eyes, badge, back, held (something to hold) and magic (an animated effect).
   Every item is drawn from the animal's own measurements (head top, eye height and spacing), so it fits all nine
   animals. Items are tagged with the age groups they suit (little = Years 1–2, mid = 3–4, big = 5–6, pro = 7–11);
   each age group sees about 100 of them. Prices run from a few acorns to Legendary items worth weeks of saving. */
(function (G) {
  'use strict';
  var OM = G.OM, INK = '#15292a';

  // ---------- colour helpers ----------
  function shade(hex, f) { var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; var m = function (v) { return Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))); }; return '#' + ((1 << 24) + (m(r) << 16) + (m(g) << 8) + m(b)).toString(16).slice(1); }
  var COL = { red: '#d9534f', blue: '#3d7bd9', green: '#3e9a5c', yellow: '#f2c53a', purple: '#8a5bb8', pink: '#e86fa0', orange: '#ef8a2b', teal: '#14a39a', black: '#2b2f36', white: '#f4f4f0', navy: '#2c3a78', brown: '#8a5a3a', grey: '#8b939c', gold: '#e8b520', silver: '#c3cad2', bronze: '#c27c3a' };
  var NAME = { red: 'Red', blue: 'Blue', green: 'Green', yellow: 'Yellow', purple: 'Purple', pink: 'Pink', orange: 'Orange', teal: 'Teal', black: 'Black', white: 'White', navy: 'Navy', brown: 'Brown', grey: 'Grey', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
  function star(cx, cy, R, r, fill, extra) { var pts = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r : R; pts.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1)); } return '<polygon points="' + pts.join(' ') + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function heart(cx, cy, s, fill, extra) { return '<path d="M' + cx + ' ' + (cy + s) + ' C' + (cx - s * 1.6) + ' ' + (cy - s * 0.1) + ' ' + (cx - s * 0.9) + ' ' + (cy - s * 1.4) + ' ' + cx + ' ' + (cy - s * 0.5) + ' C' + (cx + s * 0.9) + ' ' + (cy - s * 1.4) + ' ' + (cx + s * 1.6) + ' ' + (cy - s * 0.1) + ' ' + cx + ' ' + (cy + s) + ' Z" fill="' + fill + '"' + (extra || '') + '/>'; }

  // ---------- hats: drawn for a head whose top is at y = 25 (centre x = 60); animals move and shrink them ----------
  var HAT = {
    beanie: function (c) { return '<path d="M32 26 Q32 -2 60 -2 Q88 -2 88 26 Z" fill="' + c + '"/><rect x="30" y="18" width="60" height="10" rx="5" fill="' + shade(c, -0.25) + '"/><path d="M40 18 V28 M50 18 V28 M60 18 V28 M70 18 V28 M80 18 V28" stroke="' + shade(c, -0.4) + '" stroke-width="1.5" opacity=".5"/>'; },
    bobble: function (c) { return HAT.beanie(c) + '<path d="M36 8 Q60 2 84 8" stroke="#fff" stroke-width="4" fill="none" opacity=".8"/><circle cx="60" cy="-6" r="8" fill="#fff"/><circle cx="57" cy="-9" r="3" fill="#fff" opacity=".6"/>'; },
    cap: function (c) { return '<path d="M34 25 Q34 0 60 0 Q86 0 86 25 Z" fill="' + c + '"/><path d="M60 25 Q88 19 108 27 Q92 32 60 29 Z" fill="' + shade(c, -0.3) + '"/><circle cx="60" cy="1" r="3" fill="' + shade(c, -0.3) + '"/><path d="M60 2 V25" stroke="' + shade(c, -0.2) + '" stroke-width="1.5"/>'; },
    bucket: function (c) { return '<path d="M38 24 L42 2 Q60 -3 78 2 L82 24 Z" fill="' + c + '"/><path d="M24 26 Q60 16 96 26 L90 31 Q60 23 30 31 Z" fill="' + shade(c, -0.2) + '"/><path d="M40 16 Q60 12 80 16" stroke="' + shade(c, -0.35) + '" stroke-width="2.5" fill="none"/>'; },
    beret: function (c) { return '<ellipse cx="58" cy="16" rx="34" ry="12" fill="' + c + '" transform="rotate(-8 58 16)"/><path d="M28 24 Q60 30 90 22" stroke="' + shade(c, -0.3) + '" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="58" y="0" width="4" height="7" rx="2" fill="' + shade(c, -0.3) + '"/>'; },
    tophat: function (c) { return '<rect x="40" y="-18" width="40" height="40" rx="3" fill="' + c + '"/><rect x="40" y="10" width="40" height="7" fill="' + (c === COL.black ? COL.red : shade(c, -0.35)) + '"/><ellipse cx="60" cy="23" rx="32" ry="6" fill="' + shade(c, -0.15) + '"/><path d="M44 -14 V8" stroke="#fff" stroke-width="2" opacity=".25"/>'; },
    crown: function () { return '<path d="M32 26 L34 0 L46 14 L60 -6 L74 14 L86 0 L88 26 Q60 31 32 26 Z" fill="#f2c53a"/><path d="M32 26 Q60 31 88 26 L88 21 Q60 26 32 21 Z" fill="#c99a12"/><circle cx="60" cy="10" r="4" fill="#d9534f"/><circle cx="44" cy="17" r="3" fill="#3d7bd9"/><circle cx="76" cy="17" r="3" fill="#3e9a5c"/><path d="M38 4 l2 -4 l2 4 l-2 4 z" fill="#fff"/>'; },
    tiara: function (c) { return '<path d="M34 25 Q60 14 86 25" stroke="' + (c || '#c3cad2') + '" stroke-width="3.5" fill="none"/><path d="M44 21 L48 10 L52 19 M56 17 L60 2 L64 17 M68 19 L72 10 L76 21" stroke="' + (c || '#c3cad2') + '" stroke-width="3" fill="none" stroke-linejoin="round"/><circle cx="60" cy="4" r="3.5" fill="#e86fa0"/><circle cx="48" cy="11" r="2.5" fill="#9fd8ef"/><circle cx="72" cy="11" r="2.5" fill="#9fd8ef"/>'; },
    cowboy: function (c) { return '<path d="M20 22 Q36 30 60 28 Q84 30 100 22 Q98 30 60 33 Q22 30 20 22 Z" fill="' + shade(c, -0.15) + '"/><path d="M38 26 Q36 2 50 4 Q60 10 70 4 Q84 2 82 26 Z" fill="' + c + '"/><path d="M38 20 Q60 25 82 20" stroke="' + shade(c, -0.45) + '" stroke-width="4" fill="none"/>'; },
    pirate: function () { return '<path d="M22 24 Q36 -6 60 4 Q84 -6 98 24 Q60 16 22 24 Z" fill="#23262d"/><path d="M22 24 Q60 16 98 24" stroke="#e8b520" stroke-width="2.5" fill="none"/><circle cx="60" cy="12" r="5" fill="#fff"/><path d="M55 20 L65 14 M55 14 L65 20" stroke="#fff" stroke-width="2"/>'; },
    chef: function () { return '<rect x="40" y="10" width="40" height="15" fill="#fff" stroke="#d6d6d0" stroke-width="1.5"/><circle cx="44" cy="4" r="11" fill="#fff"/><circle cx="60" cy="-4" r="13" fill="#fff"/><circle cx="76" cy="4" r="11" fill="#fff"/><path d="M48 12 V24 M60 12 V24 M72 12 V24" stroke="#e2e2dc" stroke-width="1.5"/>'; },
    flowers: function () { var b = '<path d="M30 26 Q60 16 90 26" stroke="#3e9a5c" stroke-width="4" fill="none"/>'; [[34, 23, '#e86fa0'], [46, 19, '#f2c53a'], [60, 17, '#fff'], [74, 19, '#9fb6ff'], [86, 23, '#e86fa0']].forEach(function (f) { for (var k = 0; k < 5; k++) { var a = k * 72 * Math.PI / 180; b += '<circle cx="' + (f[0] + 4 * Math.cos(a)).toFixed(1) + '" cy="' + (f[1] + 4 * Math.sin(a)).toFixed(1) + '" r="3.2" fill="' + f[2] + '"/>'; } b += '<circle cx="' + f[0] + '" cy="' + f[1] + '" r="2.4" fill="#ef8a2b"/>'; }); return b; },
    gradcap: function () { return '<path d="M38 18 Q60 30 82 18 L82 26 Q60 34 38 26 Z" fill="#23262d"/><path d="M60 0 L102 12 L60 24 L18 12 Z" fill="#2b2f36"/><path d="M60 12 L92 16 L92 34" stroke="#e8b520" stroke-width="2.5" fill="none"/><circle cx="92" cy="36" r="3.5" fill="#e8b520"/>'; },
    knight: function () { return '<path d="M30 30 Q30 -4 60 -4 Q90 -4 90 30 Z" fill="#9aa6b1"/><path d="M30 30 Q60 24 90 30 L90 34 Q60 28 30 34 Z" fill="#6f7a85"/><path d="M60 -4 V28" stroke="#c3cad2" stroke-width="3"/><path d="M60 -4 Q70 -18 84 -18 Q76 -8 66 -2 Z" fill="#d9534f"/>'; },
    viking: function () { return '<path d="M30 28 Q30 0 60 0 Q90 0 90 28 Z" fill="#9aa6b1"/><rect x="28" y="22" width="64" height="7" rx="3" fill="#8a5a3a"/><path d="M32 16 Q14 10 14 -8 Q22 6 36 8 Z M88 16 Q106 10 106 -8 Q98 6 84 8 Z" fill="#f4ecd8"/><circle cx="60" cy="12" r="3" fill="#e8b520"/>'; },
    sunhat: function () { return '<ellipse cx="60" cy="24" rx="46" ry="9" fill="#e9cf8e"/><path d="M38 24 Q38 2 60 2 Q82 2 82 24 Z" fill="#f0d99e"/><rect x="38" y="16" width="44" height="6" fill="#e86fa0"/><circle cx="82" cy="18" r="5" fill="#fff"/><circle cx="82" cy="18" r="2" fill="#f2c53a"/>'; },
    witch: function () { return '<ellipse cx="60" cy="24" rx="40" ry="7" fill="#4c2f73"/><path d="M40 24 Q50 0 60 -8 Q66 -20 82 -18 Q70 -12 72 0 L80 24 Z" fill="#6b4596"/><rect x="40" y="16" width="40" height="5" fill="#f2c53a"/>'; },
    jester: function () { return '<path d="M34 26 Q30 0 14 -2 Q30 10 46 8 Q50 -12 60 -14 Q70 -12 74 8 Q90 10 106 -2 Q90 0 86 26 Z" fill="#8a5bb8"/><path d="M46 8 Q50 -12 60 -14 L60 26 L46 26 Z" fill="#f2c53a"/><circle cx="14" cy="-2" r="4" fill="#f2c53a"/><circle cx="60" cy="-14" r="4" fill="#d9534f"/><circle cx="106" cy="-2" r="4" fill="#3e9a5c"/><rect x="32" y="20" width="56" height="7" rx="3" fill="#2b2f36"/>'; },
    detective: function () { return '<path d="M34 26 Q32 0 60 0 Q88 0 86 26 Z" fill="#9c7a52"/><path d="M34 26 Q60 20 86 26 L96 30 Q60 24 24 30 Z" fill="#7a5c3a"/><path d="M40 8 H80 M36 16 H84 M48 2 V24 M60 0 V24 M72 2 V24" stroke="#6b4e30" stroke-width="1.5" opacity=".6"/>'; },
    santa: function () { return '<path d="M34 24 Q40 -6 70 -8 Q90 -6 98 12 Q84 4 78 8 L84 24 Z" fill="#d9534f"/><rect x="30" y="20" width="60" height="9" rx="4.5" fill="#fff"/><circle cx="98" cy="13" r="7" fill="#fff"/>'; },
    unicorn: function () { return '<path d="M32 25 Q60 18 88 25" stroke="#e86fa0" stroke-width="4" fill="none"/><path d="M54 20 L60 -14 L66 20 Z" fill="#f2c53a"/><path d="M56 12 L64 10 M57 4 L63 2 M58 -4 L62 -5" stroke="#c99a12" stroke-width="1.8"/><path d="M34 22 Q30 10 40 12 Q44 18 40 22 Z M86 22 Q90 10 80 12 Q76 18 80 22 Z" fill="#fff" stroke="#e86fa0" stroke-width="1.5"/>'; },
    antennae: function (c) { return '<path d="M32 25 Q60 18 88 25" stroke="' + c + '" stroke-width="4" fill="none"/><path d="M48 20 Q44 4 38 -4 M72 20 Q76 4 82 -4" stroke="' + c + '" stroke-width="3" fill="none"/><circle cx="38" cy="-5" r="6" fill="' + c + '"/><circle cx="82" cy="-5" r="6" fill="' + c + '"/><circle cx="36" cy="-7" r="2" fill="#fff"/><circle cx="80" cy="-7" r="2" fill="#fff"/>'; },
    headphones: function (c) { return '<path d="M28 34 Q28 -4 60 -4 Q92 -4 92 34" stroke="' + shade(c, -0.3) + '" stroke-width="6" fill="none"/><rect x="18" y="26" width="16" height="24" rx="7" fill="' + c + '"/><rect x="86" y="26" width="16" height="24" rx="7" fill="' + c + '"/><rect x="21" y="30" width="6" height="16" rx="3" fill="#fff" opacity=".35"/>'; },
    halo: function () { return '<ellipse cx="60" cy="-6" rx="24" ry="6" fill="none" stroke="#f7d54a" stroke-width="5"><animate attributeName="cy" values="-6;-10;-6" dur="2.4s" repeatCount="indefinite"/></ellipse>'; },
    party: function () { return OM.HAT('party'); }, acorn: function () { return OM.HAT('acorn'); }, wizard: function () { return OM.HAT('wizard'); }, leaves: function () { return OM.HAT('leaves'); }, explorer: function () { return OM.HAT('explorer'); }
  };

  // ---------- neckwear: drawn on the animal, neck at y ≈ 96 ----------
  function scarfShape(c) { return '<g transform="translate(60 0) scale(.86 1) translate(-60 0)"><path d="M25 92 Q60 106 95 92 L95 101 Q60 115 25 101 Z" fill="' + c + '"/><path d="M76 104 L84 126 Q78 128 72 124 Z" fill="' + c + '"/></g>'; }
  var NECK = {
    scarf: function (c) { return scarfShape(c); },
    stripes: function (c, c2) { return scarfShape(c) + '<g stroke="' + c2 + '" stroke-width="4">' + [36, 48, 60, 72, 84].map(function (x) { var y = 96 + Math.pow((x - 60) / 35, 2) * -4 + 4; return '<path d="M' + (60 + (x - 60) * 0.86) + ' ' + (y - 4) + ' V' + (y + 5) + '"/>'; }).join('') + '<path d="M73 112 L80 110 M75 118 L82 116"/></g>'; },
    bowtie: function (c) { return '<path d="M60 101 L46 94 L46 108 Z M60 101 L74 94 L74 108 Z" fill="' + c + '"/><rect x="56" y="97" width="8" height="8" rx="2" fill="' + shade(c, -0.25) + '"/>'; },
    tie: function (c) { return '<path d="M55 98 L65 98 L63 104 L57 104 Z" fill="' + shade(c, -0.2) + '"/><path d="M57 104 L63 104 L67 126 L60 132 L53 126 Z" fill="' + c + '"/><path d="M58 110 L65 116 M56 120 L66 126" stroke="' + shade(c, 0.35) + '" stroke-width="2" opacity=".6"/>'; },
    bandana: function (c) { return '<path d="M32 94 Q60 104 88 94 L60 122 Z" fill="' + c + '"/><circle cx="54" cy="104" r="1.6" fill="#fff"/><circle cx="66" cy="104" r="1.6" fill="#fff"/><circle cx="60" cy="112" r="1.6" fill="#fff"/>'; },
    medal: function (c) { return '<path d="M48 96 L58 116 M72 96 L62 116" stroke="#3d7bd9" stroke-width="5"/><circle cx="60" cy="120" r="8" fill="' + c + '" stroke="' + shade(c, -0.3) + '" stroke-width="2"/>' + star(60, 120, 4.5, 2, shade(c, -0.3)); },
    beads: function (c) { var b = ''; for (var i = 0; i <= 8; i++) { var x = 38 + i * 5.5, y = 98 + Math.sin(i / 8 * Math.PI) * 9; b += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.2" fill="' + (i % 2 ? c : shade(c, 0.45)) + '"/>'; } return b; },
    pearls: function () { var b = ''; for (var i = 0; i <= 10; i++) { var x = 36 + i * 4.8, y = 98 + Math.sin(i / 10 * Math.PI) * 10; b += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2.8" fill="#fbf8f0" stroke="#d8d2c4" stroke-width=".8"/>'; } return b; },
    chain: function () { return '<path d="M38 96 Q60 116 82 96" stroke="#e8b520" stroke-width="3" fill="none" stroke-dasharray="3 1.5"/>' + star(60, 112, 6, 2.6, '#f2c53a', ' stroke="#c99a12" stroke-width="1"'); },
    lei: function () { var b = ''; ['#e86fa0', '#f2c53a', '#ef8a2b', '#fff', '#e86fa0', '#9fb6ff', '#f2c53a', '#e86fa0'].forEach(function (f, i) { var x = 38 + i * 6.3, y = 98 + Math.sin(i / 7 * Math.PI) * 10; b += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4.2" fill="' + f + '"/><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.4" fill="#ef8a2b"/>'; }); return b; },
    ruff: function () { var b = ''; for (var i = 0; i < 9; i++) b += '<ellipse cx="' + (36 + i * 6) + '" cy="' + (98 + Math.sin(i / 8 * Math.PI) * 4) + '" rx="5" ry="6" fill="#fff" stroke="#d8d2c4" stroke-width="1"/>'; return b; },
    collar: function (c) { return '<path d="M34 95 Q60 107 86 95 L86 101 Q60 113 34 101 Z" fill="' + c + '"/><circle cx="60" cy="110" r="4.5" fill="#f2c53a" stroke="#c99a12" stroke-width="1.2"/><path d="M57 111 H63" stroke="#c99a12" stroke-width="1"/>'; }
  };

  // ---------- eyewear: at the animal's eyes (gy, gx) with lens radius gr ----------
  var EYES = {
    round: function (c, gy, gx, gr) { return '<g fill="none" stroke="' + c + '" stroke-width="2.8"><circle cx="' + (60 - gx) + '" cy="' + gy + '" r="' + gr + '"/><circle cx="' + (60 + gx) + '" cy="' + gy + '" r="' + gr + '"/><path d="M' + (60 - gx + gr) + ' ' + gy + ' Q60 ' + (gy - 4) + ' ' + (60 + gx - gr) + ' ' + gy + '"/></g>'; },
    square: function (c, gy, gx, gr) { return '<g fill="none" stroke="' + c + '" stroke-width="3.2"><rect x="' + (60 - gx - gr) + '" y="' + (gy - gr + 1) + '" width="' + gr * 2 + '" height="' + (gr * 2 - 2) + '" rx="3"/><rect x="' + (60 + gx - gr) + '" y="' + (gy - gr + 1) + '" width="' + gr * 2 + '" height="' + (gr * 2 - 2) + '" rx="3"/><path d="M' + (60 - gx + gr) + ' ' + gy + ' H' + (60 + gx - gr) + '"/></g>'; },
    star: function (c, gy, gx, gr) { return star(60 - gx, gy, gr + 4, gr * 0.62, c, ' fill-opacity=".35" stroke="' + c + '" stroke-width="2.4" stroke-linejoin="round"') + star(60 + gx, gy, gr + 4, gr * 0.62, c, ' fill-opacity=".35" stroke="' + c + '" stroke-width="2.4" stroke-linejoin="round"') + '<path d="M' + (60 - gx + gr) + ' ' + gy + ' H' + (60 + gx - gr) + '" stroke="' + c + '" stroke-width="2.4"/>'; },
    heart: function (c, gy, gx, gr) { return heart(60 - gx, gy - 1, gr * 0.85, c, ' fill-opacity=".35" stroke="' + c + '" stroke-width="2.4"') + heart(60 + gx, gy - 1, gr * 0.85, c, ' fill-opacity=".35" stroke="' + c + '" stroke-width="2.4"') + '<path d="M' + (60 - gx + gr) + ' ' + (gy - 3) + ' H' + (60 + gx - gr) + '" stroke="' + c + '" stroke-width="2.4"/>'; },
    shades: function (c, gy, gx, gr) { return '<g stroke="' + c + '" stroke-width="2.4"><rect x="' + (60 - gx - gr - 1) + '" y="' + (gy - gr + 3) + '" width="' + (gr * 2 + 2) + '" height="' + (gr * 1.6) + '" rx="' + gr * 0.6 + '" fill="#1d2228"/><rect x="' + (60 + gx - gr - 1) + '" y="' + (gy - gr + 3) + '" width="' + (gr * 2 + 2) + '" height="' + (gr * 1.6) + '" rx="' + gr * 0.6 + '" fill="#1d2228"/><path d="M' + (60 - gx + gr) + ' ' + (gy - gr + 6) + ' H' + (60 + gx - gr) + '"/></g><path d="M' + (60 - gx - gr + 3) + ' ' + (gy - gr + 7) + ' l5 0" stroke="#fff" stroke-width="2" opacity=".6"/><path d="M' + (60 + gx - gr + 3) + ' ' + (gy - gr + 7) + ' l5 0" stroke="#fff" stroke-width="2" opacity=".6"/>'; },
    aviator: function (c, gy, gx, gr) { var lens = function (x) { return '<path d="M' + (x - gr - 1) + ' ' + (gy - gr + 4) + ' H' + (x + gr + 1) + ' Q' + (x + gr + 1) + ' ' + (gy + gr + 2) + ' ' + x + ' ' + (gy + gr + 2) + ' Q' + (x - gr - 1) + ' ' + (gy + gr + 2) + ' ' + (x - gr - 1) + ' ' + (gy - gr + 4) + ' Z" fill="#5d6b78" fill-opacity=".85" stroke="' + c + '" stroke-width="2"/>'; }; return lens(60 - gx) + lens(60 + gx) + '<path d="M' + (60 - gx + gr) + ' ' + (gy - gr + 4) + ' Q60 ' + (gy - gr) + ' ' + (60 + gx - gr) + ' ' + (gy - gr + 4) + '" stroke="' + c + '" stroke-width="2" fill="none"/>'; },
    ski: function (c, gy, gx, gr) { return '<path d="M14 ' + gy + ' H106" stroke="' + COL.black + '" stroke-width="6"/><rect x="' + (60 - gx - gr - 5) + '" y="' + (gy - gr) + '" width="' + ((gx + gr + 5) * 2) + '" height="' + gr * 2 + '" rx="' + gr + '" fill="' + c + '" stroke="#2b2f36" stroke-width="2.5"/><path d="M' + (60 - gx - gr) + ' ' + (gy - gr + 5) + ' Q60 ' + (gy - gr - 2) + ' ' + (60 + gx) + ' ' + (gy - gr + 5) + '" stroke="#fff" stroke-width="2.5" fill="none" opacity=".6"/>'; },
    swim: function (c, gy, gx, gr) { return '<path d="M16 ' + gy + ' H104" stroke="' + c + '" stroke-width="3.5"/><ellipse cx="' + (60 - gx) + '" cy="' + gy + '" rx="' + (gr + 1) + '" ry="' + (gr - 1) + '" fill="#9fd8ef" fill-opacity=".55" stroke="' + c + '" stroke-width="3"/><ellipse cx="' + (60 + gx) + '" cy="' + gy + '" rx="' + (gr + 1) + '" ry="' + (gr - 1) + '" fill="#9fd8ef" fill-opacity=".55" stroke="' + c + '" stroke-width="3"/>'; },
    monocle: function (c, gy, gx, gr) { return '<circle cx="' + (60 + gx) + '" cy="' + gy + '" r="' + (gr + 1) + '" fill="#cfe8f6" fill-opacity=".3" stroke="#e8b520" stroke-width="2.8"/><path d="M' + (60 + gx + gr) + ' ' + (gy + 3) + ' Q' + (60 + gx + gr + 8) + ' ' + (gy + 24) + ' ' + (60 + gx + 2) + ' ' + (gy + 40) + '" stroke="#e8b520" stroke-width="1.5" fill="none" stroke-dasharray="2 1.5"/>'; },
    threed: function (c, gy, gx, gr) { return '<rect x="' + (60 - gx - gr - 3) + '" y="' + (gy - gr) + '" width="' + ((gx + gr + 3) * 2) + '" height="' + gr * 2 + '" rx="3" fill="#fff" stroke="#d0d0ca" stroke-width="1"/><rect x="' + (60 - gx - gr + 1) + '" y="' + (gy - gr + 3) + '" width="' + (gr * 2 - 2) + '" height="' + (gr * 2 - 6) + '" rx="2" fill="#e04a4a" fill-opacity=".8"/><rect x="' + (60 + gx - gr + 1) + '" y="' + (gy - gr + 3) + '" width="' + (gr * 2 - 2) + '" height="' + (gr * 2 - 6) + '" rx="2" fill="#3fa3e8" fill-opacity=".8"/>'; },
    mask: function (c, gy, gx, gr) { var hr = gr - 3, hole = function (cx) { return ' M' + (cx - hr) + ' ' + gy + ' a' + hr + ' ' + hr + ' 0 1 0 ' + 2 * hr + ' 0 a' + hr + ' ' + hr + ' 0 1 0 ' + (-2 * hr) + ' 0 Z'; };
      return '<path fill-rule="evenodd" d="M' + (60 - gx - gr - 6) + ' ' + (gy - 2) + ' Q' + (60 - gx) + ' ' + (gy - gr - 6) + ' 60 ' + (gy - gr + 2) + ' Q' + (60 + gx) + ' ' + (gy - gr - 6) + ' ' + (60 + gx + gr + 6) + ' ' + (gy - 2) + ' Q' + (60 + gx + gr) + ' ' + (gy + gr + 3) + ' 60 ' + (gy + gr - 2) + ' Q' + (60 - gx - gr) + ' ' + (gy + gr + 3) + ' ' + (60 - gx - gr - 6) + ' ' + (gy - 2) + ' Z' + hole(60 - gx) + hole(60 + gx) + '" fill="' + c + '"/><path d="M' + (60 - gx - gr - 6) + ' ' + (gy - 2) + ' l-8 6 M' + (60 + gx + gr + 6) + ' ' + (gy - 2) + ' l8 6" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>'; }
  };

  // ---------- badges on the chest ----------
  var BADGE = {
    star: function (cx, cy) { return star(cx, cy, 5.5, 2.4, '#fff'); },
    heart: function (cx, cy) { return heart(cx, cy, 4, '#fff'); },
    bolt: function (cx, cy) { return '<path d="M' + (cx + 1) + ' ' + (cy - 6) + ' L' + (cx - 4) + ' ' + (cy + 1) + ' H' + cx + ' L' + (cx - 1) + ' ' + (cy + 6) + ' L' + (cx + 4) + ' ' + (cy - 1) + ' H' + cx + ' Z" fill="#fff"/>'; },
    moon: function (cx, cy) { return '<path d="M' + (cx + 2) + ' ' + (cy - 5.5) + ' A5.5 5.5 0 1 0 ' + (cx + 2) + ' ' + (cy + 5.5) + ' A4 4 0 1 1 ' + (cx + 2) + ' ' + (cy - 5.5) + ' Z" fill="#fff"/>'; },
    sun: function (cx, cy) { var b = '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="#fff"/>'; for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; b += '<path d="M' + (cx + 4.2 * Math.cos(a)).toFixed(1) + ' ' + (cy + 4.2 * Math.sin(a)).toFixed(1) + ' L' + (cx + 6 * Math.cos(a)).toFixed(1) + ' ' + (cy + 6 * Math.sin(a)).toFixed(1) + '" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>'; } return b; },
    paw: function (cx, cy) { return '<ellipse cx="' + cx + '" cy="' + (cy + 2) + '" rx="3.2" ry="2.6" fill="#fff"/><circle cx="' + (cx - 3.6) + '" cy="' + (cy - 2) + '" r="1.5" fill="#fff"/><circle cx="' + (cx - 1.2) + '" cy="' + (cy - 3.8) + '" r="1.5" fill="#fff"/><circle cx="' + (cx + 1.2) + '" cy="' + (cy - 3.8) + '" r="1.5" fill="#fff"/><circle cx="' + (cx + 3.6) + '" cy="' + (cy - 2) + '" r="1.5" fill="#fff"/>'; },
    pi: function (cx, cy) { return '<text x="' + cx + '" y="' + (cy + 4) + '" font-size="12" font-weight="700" text-anchor="middle" fill="#fff" font-family="Georgia, serif">π</text>'; },
    plus: function (cx, cy) { return '<path d="M' + cx + ' ' + (cy - 5) + ' V' + (cy + 5) + ' M' + (cx - 5) + ' ' + cy + ' H' + (cx + 5) + '" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>'; },
    tick: function (cx, cy) { return '<path d="M' + (cx - 4.5) + ' ' + cy + ' L' + (cx - 1) + ' ' + (cy + 3.5) + ' L' + (cx + 5) + ' ' + (cy - 3.5) + '" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; },
    note: function (cx, cy) { return '<path d="M' + (cx + 2) + ' ' + (cy - 5) + ' V' + (cy + 3) + '" stroke="#fff" stroke-width="1.8"/><ellipse cx="' + (cx - 0.5) + '" cy="' + (cy + 3.5) + '" rx="2.8" ry="2.2" fill="#fff"/><path d="M' + (cx + 2) + ' ' + (cy - 5) + ' Q' + (cx + 6) + ' ' + (cy - 3) + ' ' + (cx + 5) + ' ' + cy + '" stroke="#fff" stroke-width="1.6" fill="none"/>'; },
    flower: function (cx, cy) { var b = ''; for (var k = 0; k < 5; k++) { var a = k * 72 * Math.PI / 180; b += '<circle cx="' + (cx + 3 * Math.cos(a)).toFixed(1) + '" cy="' + (cy + 3 * Math.sin(a)).toFixed(1) + '" r="2.3" fill="#fff"/>'; } return b + '<circle cx="' + cx + '" cy="' + cy + '" r="1.8" fill="#f2c53a"/>'; },
    rocket: function (cx, cy) { return '<path d="M' + cx + ' ' + (cy - 6) + ' Q' + (cx + 3.5) + ' ' + (cy - 2) + ' ' + (cx + 2.5) + ' ' + (cy + 3) + ' H' + (cx - 2.5) + ' Q' + (cx - 3.5) + ' ' + (cy - 2) + ' ' + cx + ' ' + (cy - 6) + ' Z" fill="#fff"/><path d="M' + (cx - 2.5) + ' ' + (cy + 1) + ' L' + (cx - 4.5) + ' ' + (cy + 5) + ' M' + (cx + 2.5) + ' ' + (cy + 1) + ' L' + (cx + 4.5) + ' ' + (cy + 5) + '" stroke="#fff" stroke-width="1.5"/>'; },
    smile: function (cx, cy) { return '<circle cx="' + (cx - 2.2) + '" cy="' + (cy - 1.8) + '" r="1.1" fill="#fff"/><circle cx="' + (cx + 2.2) + '" cy="' + (cy - 1.8) + '" r="1.1" fill="#fff"/><path d="M' + (cx - 3.4) + ' ' + (cy + 1.4) + ' Q' + cx + ' ' + (cy + 4.8) + ' ' + (cx + 3.4) + ' ' + (cy + 1.4) + '" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/>'; },
    football: function (cx, cy) { return '<circle cx="' + cx + '" cy="' + cy + '" r="5.2" fill="#fff"/><path d="M' + cx + ' ' + (cy - 2) + ' l2 1.4 l-.8 2.3 h-2.4 l-.8 -2.3 z" fill="#2b2f36"/>'; }
  };

  // ---------- on the back (drawn behind the animal), with straps in front for packs ----------
  var BACK = {
    cape: function (c) { return { back: '<path d="M36 96 Q60 104 84 96 L102 142 Q60 150 18 142 Z" fill="' + c + '"/><path d="M36 96 Q60 104 84 96 L90 112 Q60 118 30 112 Z" fill="' + shade(c, -0.2) + '"/>' }; },
    herocape: function (c) { return { back: '<path d="M36 96 Q60 104 84 96 L106 144 Q60 152 14 144 Z" fill="' + c + '" stroke="#f2c53a" stroke-width="3"/>' + star(16, 132, 6, 2.6, '#f2c53a') + star(104, 132, 6, 2.6, '#f2c53a'), front: '<circle cx="38" cy="98" r="3.5" fill="#f2c53a"/><circle cx="82" cy="98" r="3.5" fill="#f2c53a"/>' }; },
    fairy: function (c) { return { back: '<g fill="' + c + '" fill-opacity=".55" stroke="#fff" stroke-width="2"><ellipse cx="16" cy="96" rx="15" ry="26" transform="rotate(-25 16 96)"/><ellipse cx="104" cy="96" rx="15" ry="26" transform="rotate(25 104 96)"/><ellipse cx="22" cy="126" rx="10" ry="15" transform="rotate(20 22 126)"/><ellipse cx="98" cy="126" rx="10" ry="15" transform="rotate(-20 98 126)"/></g>' }; },
    butterfly: function (c, c2) { return { back: '<g stroke="' + shade(c, -0.4) + '" stroke-width="2"><path d="M40 104 Q4 70 6 104 Q8 124 40 116 Z" fill="' + c + '"/><path d="M80 104 Q116 70 114 104 Q112 124 80 116 Z" fill="' + c + '"/><path d="M40 116 Q14 120 18 136 Q30 140 42 122 Z" fill="' + c2 + '"/><path d="M80 116 Q106 120 102 136 Q90 140 78 122 Z" fill="' + c2 + '"/></g><circle cx="18" cy="98" r="4" fill="' + c2 + '"/><circle cx="102" cy="98" r="4" fill="' + c2 + '"/>' }; },
    dragon: function (c) { return { back: '<path d="M40 104 L4 70 Q10 86 2 96 Q14 96 12 108 Q22 104 22 118 Q30 110 40 118 Z" fill="' + c + '" stroke="' + shade(c, -0.35) + '" stroke-width="2" stroke-linejoin="round"/><path d="M80 104 L116 70 Q110 86 118 96 Q106 96 108 108 Q98 104 98 118 Q90 110 80 118 Z" fill="' + c + '" stroke="' + shade(c, -0.35) + '" stroke-width="2" stroke-linejoin="round"/>' }; },
    angel: function () { var b = ''; [[18, 1], [102, -1]].forEach(function (w) { for (var k = 0; k < 4; k++) b += '<ellipse cx="' + (w[0] - w[1] * k * 2) + '" cy="' + (86 + k * 10) + '" rx="' + (16 - k * 2) + '" ry="7" fill="#fff" stroke="#e2e2dc" stroke-width="1.2" transform="rotate(' + (w[1] * -30) + ' ' + (w[0] - w[1] * k * 2) + ' ' + (86 + k * 10) + ')"/>'; }); return { back: b }; },
    backpack: function (c) { return { back: '<rect x="20" y="100" width="80" height="40" rx="12" fill="' + c + '"/><rect x="16" y="114" width="10" height="18" rx="4" fill="' + shade(c, -0.25) + '"/><rect x="94" y="114" width="10" height="18" rx="4" fill="' + shade(c, -0.25) + '"/>', front: '<path d="M38 100 Q40 120 40 138 M82 100 Q80 120 80 138" stroke="' + shade(c, -0.3) + '" stroke-width="5" fill="none" stroke-linecap="round"/>' }; },
    jetpack: function () { return { back: '<rect x="14" y="98" width="16" height="34" rx="7" fill="#9aa6b1" stroke="#6f7a85" stroke-width="2"/><rect x="90" y="98" width="16" height="34" rx="7" fill="#9aa6b1" stroke="#6f7a85" stroke-width="2"/><g><path d="M16 132 Q22 150 28 132 Z M92 132 Q98 150 104 132 Z" fill="#ef8a2b"><animate attributeName="opacity" values="1;.5;1" dur=".5s" repeatCount="indefinite"/></path><path d="M19 132 Q22 142 25 132 Z M95 132 Q98 142 101 132 Z" fill="#f7d54a"/></g>', front: '<path d="M38 100 Q40 120 40 136 M82 100 Q80 120 80 136" stroke="#6f7a85" stroke-width="4" fill="none" stroke-linecap="round"/>' }; },
    shell: function () { return { back: '<ellipse cx="60" cy="122" rx="44" ry="26" fill="#3e8a3d"/><path d="M30 122 L44 104 H76 L90 122 L76 140 H44 Z" fill="#5cae5a" stroke="#2f6e2e" stroke-width="2"/>' }; }
  };

  // ---------- something to hold, at the animal's right side ----------
  var HELD = {
    balloon: function (c) { return '<path d="M92 124 Q100 100 104 80" stroke="#6b645b" stroke-width="1.2" fill="none"/><ellipse cx="106" cy="66" rx="12" ry="15" fill="' + c + '"/><path d="M104 81 L108 81 L106 84 Z" fill="' + c + '"/><ellipse cx="101" cy="60" rx="3" ry="5" fill="#fff" opacity=".45"/>'; },
    wand: function () { return '<path d="M90 126 L106 96" stroke="#2b2f36" stroke-width="3.5" stroke-linecap="round"/>' + star(107, 92, 8, 3.4, '#f2c53a', ' stroke="#c99a12" stroke-width="1"') + '<circle cx="114" cy="86" r="1.6" fill="#f2c53a"><animate attributeName="opacity" values="0;1;0" dur="1.4s" repeatCount="indefinite"/></circle>'; },
    lolly: function (c) { return '<path d="M92 128 L100 98" stroke="#f4f4f0" stroke-width="3" stroke-linecap="round"/><circle cx="102" cy="90" r="10" fill="' + c + '"/><path d="M102 90 m-6 0 a6 6 0 1 1 6 6 a4 4 0 1 1 -4 -4" stroke="#fff" stroke-width="2" fill="none"/>'; },
    icecream: function (c) { return '<path d="M94 106 L102 132 L110 106 Z" fill="#e3b072" stroke="#c48a4a" stroke-width="1.2"/><circle cx="102" cy="100" r="8" fill="' + c + '"/><circle cx="102" cy="89" r="6.5" fill="' + shade(c, 0.4) + '"/><circle cx="104" cy="83" r="2.5" fill="#d9534f"/>'; },
    football: function () { return '<circle cx="102" cy="128" r="11" fill="#fff" stroke="#2b2f36" stroke-width="1.5"/><path d="M102 124 l4 3 l-1.6 4.6 h-4.8 l-1.6 -4.6 z" fill="#2b2f36"/><path d="M102 124 V117 M106 127 L112 125 M104.4 131.6 L108 137 M99.6 131.6 L96 137 M98 127 L92 125" stroke="#2b2f36" stroke-width="1.2"/>'; },
    book: function (c) { return '<g transform="rotate(-12 102 118)"><rect x="92" y="106" width="20" height="26" rx="2" fill="' + c + '"/><rect x="94" y="108" width="2" height="22" fill="' + shade(c, -0.3) + '"/><path d="M99 114 H109 M99 118 H107" stroke="#fff" stroke-width="1.5" opacity=".7"/></g>'; },
    telescope: function () { return '<g transform="rotate(-40 100 116)"><rect x="84" y="111" width="34" height="9" rx="3" fill="#c99a12"/><rect x="80" y="112" width="8" height="7" rx="2" fill="#8a5a3a"/><rect x="114" y="109" width="8" height="13" rx="2" fill="#e8b520"/></g>'; },
    magnifier: function () { return '<path d="M92 132 L100 118" stroke="#8a5a3a" stroke-width="4.5" stroke-linecap="round"/><circle cx="105" cy="108" r="10" fill="#cfe8f6" fill-opacity=".5" stroke="#2b2f36" stroke-width="3"/>'; },
    trophy: function () { return '<path d="M94 102 H112 V108 Q112 120 103 121 Q94 120 94 108 Z" fill="#f2c53a" stroke="#c99a12" stroke-width="1.5"/><path d="M94 105 Q86 105 88 112 Q90 116 95 114 M112 105 Q120 105 118 112 Q116 116 111 114" stroke="#c99a12" stroke-width="2" fill="none"/><rect x="100" y="121" width="6" height="7" fill="#c99a12"/><rect x="95" y="128" width="16" height="5" rx="1.5" fill="#8a5a3a"/>' + star(103, 110, 4, 1.8, '#fff'); },
    flag: function (c) { return '<path d="M96 136 V74" stroke="#8a5a3a" stroke-width="3" stroke-linecap="round"/><path d="M96 76 Q108 72 118 78 Q108 82 118 90 Q108 86 96 90 Z" fill="' + c + '"/>'; },
    umbrella: function (c) { return '<path d="M98 138 V64" stroke="#2b2f36" stroke-width="2.5"/><path d="M98 138 Q98 142 94 142" stroke="#2b2f36" stroke-width="2.5" fill="none"/><path d="M70 66 Q98 36 126 66 Q119 60 112 66 Q105 60 98 66 Q91 60 84 66 Q77 60 70 66 Z" fill="' + c + '"/>'; },
    guitar: function () { return '<g transform="rotate(30 102 118)"><rect x="100" y="76" width="5" height="34" fill="#5a3818"/><rect x="98" y="72" width="9" height="8" rx="2" fill="#2b2f36"/><path d="M102 106 Q90 108 92 120 Q90 132 102 134 Q114 132 112 120 Q114 108 102 106 Z" fill="#d9822b" stroke="#9a5a1a" stroke-width="1.5"/><circle cx="102" cy="120" r="3.5" fill="#2b2f36"/></g>'; },
    mic: function () { return '<path d="M92 132 L100 108" stroke="#2b2f36" stroke-width="5" stroke-linecap="round"/><circle cx="102" cy="102" r="7.5" fill="#9aa6b1" stroke="#6f7a85" stroke-width="1.5"/><path d="M96 100 H108 M96 104 H108" stroke="#6f7a85" stroke-width="1"/>'; },
    racket: function (c) { return '<path d="M92 136 L100 116" stroke="#2b2f36" stroke-width="4" stroke-linecap="round"/><ellipse cx="104" cy="104" rx="9" ry="12" fill="#f4f4f0" fill-opacity=".3" stroke="' + c + '" stroke-width="3" transform="rotate(20 104 104)"/><path d="M98 98 L110 110 M100 94 L112 106 M96 102 L108 114 M104 94 L98 112 M108 96 L102 114" stroke="#d6d6d0" stroke-width=".8"/>'; },
    pencil: function () { return '<g transform="rotate(-30 102 110)"><rect x="98" y="80" width="9" height="44" fill="#f2c53a"/><path d="M98 124 L102.5 134 L107 124 Z" fill="#e3b072"/><path d="M101.5 131.5 L102.5 134 L103.5 131.5 Z" fill="#2b2f36"/><rect x="98" y="76" width="9" height="5" fill="#c3cad2"/><rect x="98" y="71" width="9" height="6" rx="2" fill="#e86fa0"/></g>'; },
    ruler: function () { var b = '<g transform="rotate(-25 104 108)"><rect x="98" y="72" width="10" height="64" rx="1.5" fill="#f2d675" stroke="#c9a227" stroke-width="1"/>'; for (var k = 0; k < 12; k++) b += '<path d="M98 ' + (76 + k * 5) + ' h' + (k % 2 ? 3 : 5) + '" stroke="#6b4e30" stroke-width=".9"/>'; return b + '</g>'; },
    protractor: function () { var b = '<path d="M86 124 A18 18 0 0 1 122 124 Z" fill="#9fd8ef" fill-opacity=".6" stroke="#3d7bd9" stroke-width="1.5"/>'; for (var k = 1; k < 9; k++) { var a = Math.PI - k * Math.PI / 9; b += '<path d="M' + (104 + 18 * Math.cos(a)).toFixed(1) + ' ' + (124 - 18 * Math.sin(a)).toFixed(1) + ' L' + (104 + 14 * Math.cos(a)).toFixed(1) + ' ' + (124 - 14 * Math.sin(a)).toFixed(1) + '" stroke="#3d7bd9" stroke-width="1"/>'; } return b + '<circle cx="104" cy="124" r="1.5" fill="#3d7bd9"/>'; },
    calculator: function () { var b = '<rect x="92" y="104" width="22" height="30" rx="3" fill="#2b3a40"/><rect x="95" y="107" width="16" height="7" rx="1" fill="#c8d8c4"/>'; for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) b += '<rect x="' + (95.5 + c * 5.5) + '" y="' + (117 + r * 5.5) + '" width="4" height="4" rx="1" fill="' + (r === 2 && c === 2 ? '#1aa391' : '#eef2f1') + '"/>'; return b; },
    teddy: function () { return '<circle cx="96" cy="112" r="4" fill="#a8713a"/><circle cx="110" cy="112" r="4" fill="#a8713a"/><circle cx="103" cy="118" r="8" fill="#c98e56"/><ellipse cx="103" cy="131" rx="9" ry="8" fill="#c98e56"/><ellipse cx="103" cy="121" rx="3.5" ry="2.5" fill="#f1dcb9"/><circle cx="100" cy="116" r="1.2" fill="' + INK + '"/><circle cx="106" cy="116" r="1.2" fill="' + INK + '"/>'; },
    sword: function () { return '<path d="M92 134 L112 82" stroke="#c3cad2" stroke-width="5" stroke-linecap="round"/><path d="M90 120 L102 126" stroke="#8a5a3a" stroke-width="4" stroke-linecap="round"/><path d="M92 134 L96 124" stroke="#8a5a3a" stroke-width="5" stroke-linecap="round"/>'; },
    paintbrush: function (c) { return '<path d="M92 134 L106 100" stroke="#8a5a3a" stroke-width="3.5" stroke-linecap="round"/><path d="M104 104 L108 94 Q112 88 110 98 L108 104 Z" fill="' + c + '"/><circle cx="98" cy="88" r="3" fill="' + c + '" opacity=".6"/>'; },
    skateboard: function (c) { return '<g transform="rotate(-70 104 116)"><rect x="82" y="112" width="44" height="7" rx="3.5" fill="' + c + '"/><circle cx="90" cy="122" r="3" fill="#2b2f36"/><circle cx="118" cy="122" r="3" fill="#2b2f36"/></g>'; },
    globe: function () { return '<rect x="98" y="130" width="12" height="4" rx="1.5" fill="#8a5a3a"/><path d="M104 130 V124" stroke="#8a5a3a" stroke-width="2"/><circle cx="104" cy="112" r="11" fill="#3d7bd9"/><path d="M96 106 Q102 104 104 110 Q100 114 98 118 M108 104 Q112 108 110 114 Q106 116 106 120" fill="#3e9a5c" stroke="#3e9a5c" stroke-width="3" stroke-linecap="round"/>'; }
  };

  // ---------- magic: animated effects around the whole animal (front, with a few parts behind) ----------
  function anim(attr, vals, dur, begin) { return '<animate attributeName="' + attr + '" values="' + vals + '" dur="' + dur + 's" begin="' + (begin || 0) + 's" repeatCount="indefinite"/>'; }
  var MAGIC = {
    sparkles: function () { var b = ''; [[14, 40, 0], [104, 30, 0.5], [12, 110, 1], [108, 104, 1.5], [60, -4, 0.8]].forEach(function (s) { b += '<g opacity="0">' + anim('opacity', '0;1;0', 2, s[2]) + star(s[0], s[1], 6, 1.8, '#f7d54a') + '</g>'; }); return { front: b }; },
    hearts: function () { var b = ''; [[16, 0], [104, 1.2], [60, 2.2]].forEach(function (h) { b += '<g opacity="0">' + anim('opacity', '0;1;0', 3, h[1]) + '<animateTransform attributeName="transform" type="translate" values="0 0;0 -40" dur="3s" begin="' + h[1] + 's" repeatCount="indefinite"/>' + heart(h[0], 110, 5, '#e86fa0') + '</g>'; }); return { front: b }; },
    orbit: function () { return { front: '<g><animateTransform attributeName="transform" type="rotate" values="0 60 70;360 60 70" dur="6s" repeatCount="indefinite"/>' + star(60, 4, 6, 2.4, '#f7d54a') + star(60, 136, 5, 2, '#9fd8ef') + star(-4, 70, 5, 2, '#e86fa0') + star(124, 70, 6, 2.4, '#f7d54a') + '</g>' }; },
    rainbow: function () { var cols = ['#e04a4a', '#ef8a2b', '#f2c53a', '#3e9a5c', '#3d7bd9', '#8a5bb8'], b = ''; cols.forEach(function (c, i) { b += '<path d="M' + (-4 + i * 4) + ' 112 A' + (64 - i * 4) + ' ' + (64 - i * 4) + ' 0 0 1 ' + (124 - i * 4) + ' 112" stroke="' + c + '" stroke-width="4" fill="none" opacity=".75"/>'; }); return { back: b }; },
    glow: function () { return { back: '<defs><radialGradient id="glw"><stop offset="0" stop-color="#ffe680" stop-opacity=".9"/><stop offset="1" stop-color="#ffe680" stop-opacity="0"/></radialGradient></defs><ellipse cx="60" cy="80" rx="64" ry="72" fill="url(#glw)">' + anim('opacity', '.6;1;.6', 2.4) + '</ellipse>' }; },
    bubbles: function () { var b = ''; [[18, 0, 5], [100, 0.9, 4], [36, 1.8, 3.5], [88, 2.6, 6]].forEach(function (s) { b += '<circle cx="' + s[0] + '" cy="140" r="' + s[2] + '" fill="#9fd8ef" fill-opacity=".35" stroke="#5fb4dc" stroke-width="1.2" opacity="0">' + anim('opacity', '0;1;0', 3.4, s[1]) + anim('cy', '140;20', 3.4, s[1]) + '</circle>'; }); return { front: b }; },
    snow: function () { var b = ''; [[12, 0], [34, 1.4], [86, 0.6], [108, 2], [60, 2.8]].forEach(function (s) { b += '<g opacity="0">' + anim('opacity', '0;1;1;0', 4, s[1]) + '<animateTransform attributeName="transform" type="translate" values="0 0;4 150" dur="4s" begin="' + s[1] + 's" repeatCount="indefinite"/><path d="M' + s[0] + ' -12 v8 M' + (s[0] - 4) + ' -8 h8 M' + (s[0] - 3) + ' -11 l6 6 M' + (s[0] + 3) + ' -11 l-6 6" stroke="#9fc6e8" stroke-width="1.6" stroke-linecap="round"/></g>'; }); return { front: b }; },
    notes: function () { var b = ''; [[14, 0], [104, 1.3], [24, 2.4]].forEach(function (s) { b += '<g opacity="0">' + anim('opacity', '0;1;0', 3, s[1]) + '<animateTransform attributeName="transform" type="translate" values="0 0;6 -46" dur="3s" begin="' + s[1] + 's" repeatCount="indefinite"/><path d="M' + (s[0] + 3) + ' 96 V84 L' + (s[0] + 11) + ' 82 V94" stroke="#8a5bb8" stroke-width="2" fill="none"/><circle cx="' + s[0] + '" cy="96" r="3" fill="#8a5bb8"/><circle cx="' + (s[0] + 8) + '" cy="94" r="3" fill="#8a5bb8"/></g>'; }); return { front: b }; },
    fireflies: function () { var b = ''; [[10, 60, 0], [110, 46, 0.7], [20, 120, 1.4], [104, 116, 2.1], [60, 2, 1]].forEach(function (s) { b += '<circle cx="' + s[0] + '" cy="' + s[1] + '" r="3" fill="#f7f06a" opacity="0">' + anim('opacity', '0;1;0', 2.2, s[2]) + anim('cx', s[0] + ';' + (s[0] + 6) + ';' + s[0], 2.2, s[2]) + '</circle>'; }); return { front: b }; },
    leaves: function () { var b = ''; [[16, 0, '#ef8a2b'], [100, 1.5, '#d9534f'], [58, 2.6, '#f2c53a']].forEach(function (s) { b += '<g opacity="0">' + anim('opacity', '0;1;1;0', 4, s[1]) + '<animateTransform attributeName="transform" type="translate" values="0 0;10 150" dur="4s" begin="' + s[1] + 's" repeatCount="indefinite"/><path d="M' + s[0] + ' -10 q6 -6 10 2 q-6 6 -10 -2 z" fill="' + s[2] + '"/></g>'; }); return { front: b }; },
    lightning: function () { return { front: '<g opacity="0">' + anim('opacity', '0;0;1;0;1;0;0', 2.6) + '<path d="M14 30 L6 52 H14 L8 72 L24 44 H16 L22 30 Z M106 30 L114 52 H106 L112 72 L96 44 H104 L98 30 Z" fill="#f7d54a" stroke="#e8b520" stroke-width="1"/></g>' }; },
    confetti: function () { var cols = ['#e04a4a', '#3d7bd9', '#f2c53a', '#3e9a5c', '#e86fa0', '#8a5bb8'], b = ''; for (var i = 0; i < 10; i++) { var x = 6 + i * 12, d = (i * 0.37) % 2.6; b += '<rect x="' + x + '" y="-12" width="4" height="7" rx="1" fill="' + cols[i % 6] + '" opacity="0">' + anim('opacity', '0;1;1;0', 3, d) + anim('y', '-12;140', 3, d) + '</rect>'; } return { front: b }; }
  };

  // ---------- the catalogue ----------
  // [slot, design, label, price, ages, colours (optional list of colour names)]
  var L = 'little', M = 'mid', B = 'big', P = 'pro';
  var DESIGNS = [
    // hats
    ['hat', 'acorn', 'Acorn cap', 5, [L]], ['hat', 'leaves', 'Leaf crown', 8, [L, M]], ['hat', 'party', 'Party hat', 10, [L, M]], ['hat', 'explorer', 'Explorer hat', 20, [M, B]], ['hat', 'wizard', 'Wizard hat', 35, [L, M, B]],
    ['hat', 'beanie', 'beanie', 12, [M, B, P], ['red', 'blue', 'green', 'black', 'grey']],
    ['hat', 'bobble', 'bobble hat', 14, [L, M], ['red', 'blue', 'pink', 'green', 'purple', 'orange']],
    ['hat', 'cap', 'cap', 18, [B, P], ['red', 'blue', 'green', 'black', 'navy', 'orange']],
    ['hat', 'bucket', 'bucket hat', 22, [B, P], ['yellow', 'teal', 'black', 'green']],
    ['hat', 'beret', 'beret', 26, [P], ['red', 'black', 'navy', 'purple']],
    ['hat', 'tophat', 'top hat', 70, [B, P], ['black', 'purple', 'red']],
    ['hat', 'antennae', 'alien antennae', 22, [L], ['green', 'pink', 'purple']],
    ['hat', 'headphones', 'headphones', 120, [B, P], ['black', 'white', 'red', 'teal', 'purple']],
    ['hat', 'flowers', 'Flower crown', 30, [L, M]], ['hat', 'tiara', 'Sparkly tiara', 80, [L, M]], ['hat', 'unicorn', 'Unicorn horn', 90, [L]],
    ['hat', 'chef', 'Chef’s hat', 28, [L, M]], ['hat', 'cowboy', 'Cowboy hat', 60, [M, B]], ['hat', 'pirate', 'Pirate hat', 65, [L, M]],
    ['hat', 'sunhat', 'Straw sun hat', 24, [L, M, P]], ['hat', 'santa', 'Santa hat', 30, [L, M, B, P]], ['hat', 'witch', 'Witch’s hat', 45, [L, M]],
    ['hat', 'jester', 'Jester’s hat', 85, [M, B]], ['hat', 'detective', 'Detective’s hat', 75, [M, B, P]], ['hat', 'knight', 'Knight’s helmet', 140, [M, B]],
    ['hat', 'viking', 'Viking helmet', 180, [B, P]], ['hat', 'gradcap', 'Graduation cap', 250, [P]], ['hat', 'crown', 'Golden crown', 400, [L, M, B, P]], ['hat', 'halo', 'Floating halo', 600, [B, P]],
    // neck
    ['neck', 'scarf', 'scarf', 6, [L, M, B, P], ['red', 'blue', 'gold', 'green', 'purple', 'pink', 'black', 'teal']],
    ['neck', 'stripes', 'striped scarf', 16, [B, P], [['red', 'white'], ['blue', 'yellow'], ['green', 'yellow'], ['purple', 'pink'], ['black', 'red']]],
    ['neck', 'bowtie', 'bow tie', 15, [L, M, P], ['red', 'blue', 'black', 'pink', 'yellow']],
    ['neck', 'tie', 'tie', 30, [P], ['navy', 'red', 'black', 'teal', 'purple']],
    ['neck', 'bandana', 'bandana', 14, [M, B], ['red', 'blue', 'black', 'green']],
    ['neck', 'collar', 'collar with a bell', 10, [L], ['red', 'blue', 'pink']],
    ['neck', 'beads', 'bead necklace', 18, [L], ['pink', 'blue', 'purple', 'green']],
    ['neck', 'medal', 'medal', 100, [L, M, B, P], ['gold', 'silver', 'bronze']],
    ['neck', 'lei', 'Flower garland', 28, [L, M]], ['neck', 'ruff', 'Royal ruff', 90, [B, P]], ['neck', 'pearls', 'Pearl necklace', 200, [P]], ['neck', 'chain', 'Gold star chain', 300, [B, P]],
    // eyes
    ['eyes', 'round', 'round glasses', 12, [M, B, P], ['black', 'red', 'blue', 'gold']],
    ['eyes', 'square', 'square glasses', 16, [B, P], ['black', 'navy', 'purple']],
    ['eyes', 'star', 'star glasses', 22, [L, M], ['yellow', 'pink', 'blue']],
    ['eyes', 'heart', 'heart glasses', 22, [L, M], ['pink', 'red', 'purple']],
    ['eyes', 'shades', 'sunglasses', 40, [B, P], ['black', 'white', 'red']],
    ['eyes', 'aviator', 'aviator sunglasses', 120, [P], ['gold', 'silver']],
    ['eyes', 'ski', 'ski goggles', 60, [B, P], ['orange', 'teal', 'purple']],
    ['eyes', 'swim', 'swimming goggles', 16, [L], ['blue', 'pink']],
    ['eyes', 'mask', 'hero mask', 30, [L, M, B], ['black', 'red', 'blue']],
    ['eyes', 'threed', '3D glasses', 45, [B, P]], ['eyes', 'monocle', 'Gold monocle', 220, [P]],
    // badges
    ['badge', 'star', 'star badge', 5, [L, M, B, P], ['red', 'blue', 'green', 'gold']], ['badge', 'heart', 'heart badge', 5, [L], ['pink', 'red', 'purple']],
    ['badge', 'bolt', 'lightning badge', 8, [M, B], ['yellow', 'blue']], ['badge', 'moon', 'Moon badge', 8, [L, P]], ['badge', 'sun', 'Sun badge', 8, [L]],
    ['badge', 'paw', 'Paw badge', 6, [L]], ['badge', 'pi', 'Pi badge', 40, [P]], ['badge', 'plus', 'Plus badge', 10, [M, B]], ['badge', 'tick', 'Tick badge', 10, [M, P]],
    ['badge', 'note', 'Music badge', 12, [B, P]], ['badge', 'flower', 'Flower badge', 6, [L]], ['badge', 'rocket', 'Rocket badge', 12, [L, M, B]], ['badge', 'smile', 'Smiley badge', 5, [L]], ['badge', 'football', 'Football badge', 10, [M, B]],
    // back
    ['back', 'cape', 'cape', 40, [L, M, B, P], ['red', 'blue', 'purple', 'green', 'black']],
    ['back', 'herocape', 'superhero cape', 150, [L, M, B], ['red', 'blue', 'purple']],
    ['back', 'fairy', 'fairy wings', 110, [L, M], ['pink', 'blue', 'purple', 'green']],
    ['back', 'butterfly', 'butterfly wings', 130, [L, M], [['orange', 'black'], ['blue', 'yellow'], ['pink', 'purple']]],
    ['back', 'backpack', 'backpack', 35, [M, B, P], ['red', 'blue', 'green', 'black', 'orange']],
    ['back', 'shell', 'Turtle shell', 70, [L]], ['back', 'angel', 'Angel wings', 350, [B, P]], ['back', 'dragon', 'dragon wings', 420, [M, B, P], ['green', 'red', 'purple']], ['back', 'jetpack', 'Jetpack', 750, [B, P]],
    // held
    ['held', 'balloon', 'balloon', 8, [L], ['red', 'blue', 'yellow', 'green', 'pink', 'purple']],
    ['held', 'lolly', 'lollipop', 6, [L], ['red', 'pink', 'green']], ['held', 'icecream', 'ice cream', 10, [L, M], ['pink', 'yellow', 'brown']],
    ['held', 'teddy', 'Teddy bear', 25, [L]], ['held', 'wand', 'Magic wand', 60, [L, M]], ['held', 'book', 'book', 12, [M, B, P], ['red', 'blue', 'green']],
    ['held', 'football', 'Football', 15, [L, M, B]], ['held', 'racket', 'tennis racket', 35, [B, P], ['blue', 'red']], ['held', 'flag', 'flag', 14, [M, B], ['red', 'blue', 'green', 'yellow']],
    ['held', 'umbrella', 'umbrella', 22, [L, P], ['red', 'blue', 'yellow', 'black']], ['held', 'magnifier', 'Magnifying glass', 35, [M, B]], ['held', 'telescope', 'Telescope', 110, [B, P]],
    ['held', 'pencil', 'Giant pencil', 18, [L, M]], ['held', 'ruler', 'Ruler', 15, [M, B]], ['held', 'protractor', 'Protractor', 30, [P]], ['held', 'calculator', 'Calculator', 45, [B, P]],
    ['held', 'paintbrush', 'paintbrush', 16, [L], ['red', 'blue', 'purple']], ['held', 'skateboard', 'skateboard', 150, [B, P], ['red', 'teal', 'black']], ['held', 'globe', 'Globe', 80, [M, P]],
    ['held', 'sword', 'Toy sword', 55, [M, B]], ['held', 'mic', 'Microphone', 160, [B, P]], ['held', 'guitar', 'Guitar', 280, [B, P]], ['held', 'trophy', 'Golden trophy', 600, [L, M, B, P]],
    // magic
    ['magic', 'sparkles', 'Sparkles', 150, [L, M, B, P]], ['magic', 'hearts', 'Floating hearts', 150, [L, M]], ['magic', 'bubbles', 'Bubbles', 120, [L, M]], ['magic', 'leaves', 'Autumn leaves', 130, [M, B]],
    ['magic', 'snow', 'Snowfall', 160, [L, M, B, P]], ['magic', 'notes', 'Music notes', 180, [B, P]], ['magic', 'fireflies', 'Fireflies', 220, [L, M, B, P]], ['magic', 'confetti', 'Confetti shower', 300, [L, M, B]],
    ['magic', 'orbit', 'Orbiting stars', 420, [M, B, P]], ['magic', 'lightning', 'Lightning', 480, [B, P]], ['magic', 'rainbow', 'Rainbow', 650, [L, M, B]], ['magic', 'glow', 'Golden glow', 900, [L, M, B, P]]
  ];
  var SLOTS = [['hat', 'Hats'], ['neck', 'Neck'], ['eyes', 'Glasses'], ['badge', 'Badges'], ['back', 'On your back'], ['held', 'To hold'], ['magic', 'Magic']];
  OM.OUTFIT_SLOTS = SLOTS;
  // the old scarf colours (saved as hex) stay wearable
  var OLD_SCARF = { '#d9534f': 'red', '#3d7bd9': 'blue', '#f2c53a': 'gold' };
  var items = [];
  DESIGNS.forEach(function (d) {
    var cols = d[5] || [null];
    cols.forEach(function (cc) {
      var c1 = Array.isArray(cc) ? cc[0] : cc, c2 = Array.isArray(cc) && cc.length > 1 && COL[cc[1]] ? cc[1] : null, cname = Array.isArray(cc) && cc[1] && !COL[cc[1]] ? cc[1] : null;
      var v = d[1] + (c1 ? ':' + c1 + (c2 ? '+' + c2 : '') : '');
      var label = c1 ? (cname || NAME[c1] + (c2 ? ' and ' + NAME[c2].toLowerCase() : '')) + ' ' + d[2] : d[2];
      items.push({ id: d[0] + ':' + v, slot: d[0], v: v, label: label.charAt(0).toUpperCase() + label.slice(1), price: d[3], ages: d[4] });
    });
  });
  OM.OUTFITS = items;
  OM.rarity = function (price) { return price >= 250 ? 'Legendary' : price >= 100 ? 'Epic' : price >= 30 ? 'Rare' : 'Common'; };
  OM.outfitsFor = function (tier) { return items.filter(function (it) { return it.ages.indexOf(tier) >= 0; }); };
  OM.outfitById = function (id) { return items.filter(function (it) { return it.id === id; })[0]; };

  // ---------- drawing what an animal is wearing ----------
  // wear: { hat, neck, eyes, badge, back, held, magic } as item values (e.g. 'beanie:red'); older saves used scarf (a colour) and glasses (true)
  function parse(v) { var p = String(v).split(':'), cs = (p[1] || '').split('+'); return { d: p[0], c: COL[cs[0]] || null, c2: COL[cs[1]] || null }; }
  OM.drawOutfit = function (wear, sp) {
    var w = Object.assign({}, wear || {}), back = '', front = '';
    if (w.scarf && !w.neck) w.neck = 'scarf:' + (OLD_SCARF[w.scarf] || 'red');
    if (w.glasses === true && !w.eyes) w.eyes = 'round:black';
    var gy = sp.eyes[0], gx = sp.eyes[1], gr = (sp.eyeR || 8.5) + 4, top = sp.top || 30, hs = sp.hatS || .82;
    if (w.magic) { var m = parse(w.magic), mg = MAGIC[m.d] && MAGIC[m.d](); if (mg) { back += mg.back || ''; front += mg.front || ''; } }
    if (w.back) { var b = parse(w.back), bk = BACK[b.d] && BACK[b.d](b.c || COL.red, b.c2 || COL.yellow); if (bk) { back += bk.back || ''; front += bk.front || ''; } }
    var mid = '';
    if (w.neck) { var n = parse(w.neck); if (NECK[n.d]) mid += NECK[n.d](n.c || COL.red, n.c2 || COL.white); }
    if (w.badge) { var bd = parse(w.badge); if (BADGE[bd.d]) mid += '<circle cx="74" cy="110" r="8.5" fill="' + (bd.c || ({ moon: COL.navy, sun: COL.orange, paw: COL.brown, pi: COL.purple, plus: COL.teal, tick: COL.green, note: COL.purple, flower: COL.pink, rocket: COL.navy, smile: COL.yellow, football: COL.green })[bd.d] || COL.blue) + '" stroke="#fff" stroke-width="1.8"/>' + BADGE[bd.d](74, 110); }
    if (w.eyes) { var e = parse(w.eyes); if (EYES[e.d]) mid += EYES[e.d](e.c || INK, gy, gx, gr); }
    if (w.hat) { var h = parse(w.hat), hd = HAT[h.d] ? HAT[h.d](h.c || COL.red) : OM.HAT(w.hat); if (hd) mid += '<g transform="translate(60 ' + top + ') scale(' + hs + ') translate(-60 -25)">' + hd + '</g>'; }
    if (w.held) { var hd = parse(w.held); if (HELD[hd.d]) mid += HELD[hd.d](hd.c || COL.red); }
    return { back: back, front: mid + front };
  };
})(typeof window !== 'undefined' ? window : globalThis);
