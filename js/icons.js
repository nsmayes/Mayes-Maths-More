/* Learn with Pip — line icons drawn for this app (24 × 24 grid, stroke uses the text colour).
   OM.icon(name, {size, cls, label}) returns inline SVG. Decorative unless a label is given. */
(function (G) {
  'use strict';
  var OM = G.OM;
  var P = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    next: '<path d="M9 6l6 6-6 6"/>',
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    speaker: '<path d="M11 5L6 9H3v6h3l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 010 7"/><path d="M18.5 5.5a9 9 0 010 13"/>',
    mute: '<path d="M11 5L6 9H3v6h3l5 4z" fill="currentColor"/><path d="M16 9.5l5 5"/><path d="M21 9.5l-5 5"/>',
    sliders: '<path d="M4 7h9"/><path d="M17 7h3"/><circle cx="15" cy="7" r="2"/><path d="M4 17h3"/><path d="M11 17h9"/><circle cx="9" cy="17" r="2"/>',
    feather: '<path d="M20 4C11 4 6 9 6 18"/><path d="M20 4c0 8-5 13-13 13"/><path d="M6 18l-2 3"/><path d="M10 14l4-4"/>',
    acorn: '<path d="M4.5 10h15a7.5 5 0 00-15 0z" fill="currentColor" fill-opacity=".25"/><path d="M6 10c0 6 3 10 6 11 3-1 6-5 6-11"/><path d="M12 5V2.5"/>',
    flame: '<path d="M12 3c.5 4 6 6 6 11a6 6 0 01-12 0c0-3 1.5-4.5 2.5-6.5 1.5 1.5 2.5 3 2.5 5 1.5-2.5 1.5-6 1-9.5z"/>',
    book: '<path d="M4 19.5V5a2 2 0 012-2h14v15H6a2 2 0 00-2 2 2 2 0 002 2h14"/><path d="M9 7h7"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    pencil: '<path d="M4 20l4-1L19 8l-3-3L5 16z"/><path d="M14 7l3 3"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 00-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0012 3z"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9z"/><path d="M8.5 11h7"/><path d="M8.5 15h4.5"/>',
    tree: '<path d="M12 2.5l6 8h-3l4 5.5H5l4-5.5H6z"/><path d="M12 16v5.5"/>',
    gate: '<path d="M4 21V7l2-2 2 2V4h3v3h2V4h3v3l2-2 2 2v14z"/><path d="M9.5 21v-4.5a2.5 2.5 0 015 0V21"/>',
    nest: '<path d="M3 11h18l-1.6 6.5A4 4 0 0115.5 21h-7a4 4 0 01-3.9-3.5z"/><path d="M7 15h10"/><circle cx="9.5" cy="8" r="2.5"/><circle cx="14.5" cy="8" r="2.5"/>',
    leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5.5 15-14 15z"/><path d="M5 19l8-8"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
    half: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 010 17z" fill="currentColor"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V10"/><path d="M10 2.5h4"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16v4M17 18h4"/>',
    warn: '<path d="M12 3.5L2.5 20h19z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.3" r=".6" fill="currentColor"/>',
    download: '<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',
    upload: '<path d="M12 20V9"/><path d="M7 14l5-5 5 5"/><path d="M5 4h14"/>',
    play: '<path d="M8 5l11 7-11 7z"/>',
    playf: '<path d="M8 4.5l11.5 7.5L8 19.5z" fill="currentColor"/>',
    stopf: '<rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor"/>',
    refresh: '<path d="M20 11a8 8 0 10-2.3 5.7"/><path d="M20 4v7h-7"/>',
    pencil: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    swap: '<path d="M4 8h13"/><path d="M14 4.5L17.5 8 14 11.5"/><path d="M20 16H7"/><path d="M10 12.5L6.5 16 10 19.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 01-8 0z"/><path d="M8 6H5a3 3 0 003 4"/><path d="M16 6h3a3 3 0 01-3 4"/><path d="M12 13v4"/><path d="M8.5 21h7l-1-4h-5z"/>',
    // region icons
    hash: '<path d="M5 9h14"/><path d="M5 15h14"/><path d="M10 4L8 20"/><path d="M16 4l-2 16"/>',
    plusminus: '<path d="M8 3.5v9"/><path d="M3.5 8h9"/><path d="M13 17.5h8"/>',
    array: '<circle cx="6" cy="6" r="1.8" fill="currentColor"/><circle cx="12" cy="6" r="1.8" fill="currentColor"/><circle cx="18" cy="6" r="1.8" fill="currentColor"/><circle cx="6" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="18" cy="12" r="1.8" fill="currentColor"/><circle cx="6" cy="18" r="1.8" fill="currentColor"/><circle cx="12" cy="18" r="1.8" fill="currentColor"/><circle cx="18" cy="18" r="1.8" fill="currentColor"/>',
    pie: '<circle cx="12" cy="12" r="8.5"/><path d="M12 12V3.5"/><path d="M12 12h8.5"/><path d="M12 3.5A8.5 8.5 0 0120.5 12H12z" fill="currentColor"/>',
    ruler: '<path d="M3 16.5L16.5 3 21 7.5 7.5 21z"/><path d="M7.5 12l2 2"/><path d="M10.5 9l1.5 1.5"/><path d="M13.5 6l2 2"/>',
    shapes: '<path d="M7.5 3l5 8.5h-10z"/><rect x="13" y="13" width="8" height="8" rx="1"/><circle cx="7.5" cy="17" r="4"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5L13.5 13.5 8.5 15.5 10.5 10.5z" fill="currentColor" fill-opacity=".3"/>',
    calc: '<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 7.5h8"/><path d="M8.5 12h1M14.5 12h1M8.5 16.5h1M14.5 16.5h1"/>',
    ratio: '<circle cx="7" cy="7" r="3"/><circle cx="17" cy="17" r="3"/><path d="M18 5L6 19"/>',
    algebra: '<path d="M4 6l6 12"/><path d="M10 6L4 18"/><path d="M14 8l3 5 3-5"/><path d="M17 13l-2.5 6"/>',
    qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2"/>',
    chart: '<path d="M4 20h16"/><rect x="5.5" y="12" width="3" height="8"/><rect x="10.5" y="6" width="3" height="14"/><rect x="15.5" y="9" width="3" height="11"/>'
  };
  OM.ICONS = P;
  // ---------- Brand: Mayes Maths & More ----------
  // The mark: a crafted cream M on a deep teal dial (gradient, faint graph-paper grid, protractor ticks and a gold ring),
  // with Pip the owl on its top-right corner as the "cubed" power (M³); turned a quarter-turn the M is a sigma (Σ), his gold
  // tummy carrying the 3. Small sizes (48 px and under) use a simpler version: the M with a gold 3 as the power.
  // The artwork lives in img/brand/mark.svg and img/brand/mark-small.svg; this is the same drawing, inline.
  OM.APP_NAME = 'Mayes Maths & More';
  OM.TAGLINE = 'Learning for Years 1 to 11';
  var MARK = '<defs><linearGradient id="mmM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf6"/><stop offset="1" stop-color="#efe4cb"/></linearGradient><radialGradient id="mmC" cx=".35" cy=".28" r=".8"><stop offset="0" stop-color="#2a8477"/><stop offset="1" stop-color="#135249"/></radialGradient></defs><circle cx="100" cy="116" r="80" fill="#f2b632"/><circle cx="100" cy="116" r="74" fill="url(#mmC)"/><circle cx="100" cy="116" r="70.5" fill="none" stroke="#fbf7eb" stroke-opacity=".35" stroke-width="1"/><g class="mletter"><path d="M44 163 V113 Q44 106 51 106 H61.5 Q65.5 106 66.5 109 L83 139 L99.5 109 Q100.5 106 104.5 106 H115 Q122 106 122 113 V163 Q122 166 119 166 H103.5 Q100.5 166 100.5 163 V129.2 L86 157.8 Q83 161 80 157.8 L65.5 129.2 V163 Q65.5 166 62.5 166 H47 Q44 166 44 163 Z" transform="translate(2.6 3.6)" fill="#0f3d38" fill-opacity="0.62"/><path d="M44 163 V113 Q44 106 51 106 H61.5 Q65.5 106 66.5 109 L83 139 L99.5 109 Q100.5 106 104.5 106 H115 Q122 106 122 113 V163 Q122 166 119 166 H103.5 Q100.5 166 100.5 163 V129.2 L86 157.8 Q83 161 80 157.8 L65.5 129.2 V163 Q65.5 166 62.5 166 H47 Q44 166 44 163 Z" fill="url(#mmM)"/></g><ellipse class="mcontact" cx="118.5" cy="107.2" rx="6.5" ry="2.4" fill="#0e2a2f" fill-opacity="0.28"/><g class="pip"><g transform="translate(133.5 68) scale(1.2)"><g fill="#fbf7eb" stroke="#fbf7eb" stroke-width="5.5" stroke-linejoin="round"><path d="M-16 -25 Q-21 -30 -25 -37 Q-14 -37 -7 -29 Z M16 -25 Q21 -30 25 -37 Q14 -37 7 -29 Z"/><ellipse cx="-22.5" cy="7" rx="6.5" ry="12.5" transform="rotate(14 -22.5 7)"/><ellipse cx="22.5" cy="7" rx="6.5" ry="12.5" transform="rotate(-14 22.5 7)"/><ellipse cx="0" cy="0" rx="25" ry="30"/></g><path d="M-16 -25 Q-21 -30 -25 -37 Q-14 -37 -7 -29 Z M16 -25 Q21 -30 25 -37 Q14 -37 7 -29 Z" fill="#0e2a2f"/><ellipse cx="-22.5" cy="7" rx="6.5" ry="12.5" fill="#0e2a2f" transform="rotate(14 -22.5 7)"/><ellipse cx="22.5" cy="7" rx="6.5" ry="12.5" fill="#0e2a2f" transform="rotate(-14 22.5 7)"/><ellipse cx="0" cy="0" rx="25" ry="30" fill="#0e2a2f"/><circle cx="-10" cy="-11" r="11" fill="#fbf7eb"/><circle cx="10" cy="-11" r="11" fill="#fbf7eb"/><circle cx="-8.6" cy="-10" r="5.6" fill="#0e2a2f"/><circle cx="11.4" cy="-10" r="5.6" fill="#0e2a2f"/><circle cx="-6.6" cy="-12.3" r="2.3" fill="#fbf7eb"/><circle cx="13.4" cy="-12.3" r="2.3" fill="#fbf7eb"/><circle cx="-10.4" cy="-8" r="1" fill="#fbf7eb"/><circle cx="9.6" cy="-8" r="1" fill="#fbf7eb"/><polygon points="-3.8,-2.5 3.8,-2.5 0,3" fill="#f2b632"/><circle cx="0" cy="16" r="12.5" fill="#f2b632"/><path d="M-5.3 9.7 Q0 6.6 4.4 9 Q7.1 11.9 2.8 14.8 L0.6 15.8 L3.1 16.4 Q7.6 18.5 5.3 23 Q1.2 26.8 -5.3 23.6" stroke="#0e2a2f" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-16 28 Q-14 33 -11 30.5 Q-9 34 -6 30.5 Q-3 33 -2 28 Z" fill="#f2b632"/><path d="M2 28 Q3 33 6 30.5 Q9 34 11 30.5 Q14 33 16 28 Z" fill="#f2b632"/></g></g>';
  var MARK_SMALL = '<defs><radialGradient id="msC" cx=".35" cy=".28" r=".8"><stop offset="0" stop-color="#2a8477"/><stop offset="1" stop-color="#135249"/></radialGradient><linearGradient id="msM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf6"/><stop offset="1" stop-color="#efe4cb"/></linearGradient></defs><circle cx="100" cy="100" r="95" fill="#f2b632"/><circle cx="100" cy="100" r="87" fill="url(#msC)"/><circle cx="100" cy="100" r="82.5" fill="none" stroke="#fbf7eb" stroke-opacity=".35" stroke-width="1.2"/><g transform="translate(-24 -61) scale(1.3)"><path d="M44 163 V113 Q44 106 51 106 H61.5 Q65.5 106 66.5 109 L83 139 L99.5 109 Q100.5 106 104.5 106 H115 Q122 106 122 113 V163 Q122 166 119 166 H103.5 Q100.5 166 100.5 163 V129.2 L86 157.8 Q83 161 80 157.8 L65.5 129.2 V163 Q65.5 166 62.5 166 H47 Q44 166 44 163 Z" transform="translate(2.2 3)" fill="#0f3d38" fill-opacity="0.62"/><path d="M44 163 V113 Q44 106 51 106 H61.5 Q65.5 106 66.5 109 L83 139 L99.5 109 Q100.5 106 104.5 106 H115 Q122 106 122 113 V163 Q122 166 119 166 H103.5 Q100.5 166 100.5 163 V129.2 L86 157.8 Q83 161 80 157.8 L65.5 129.2 V163 Q65.5 166 62.5 166 H47 Q44 166 44 163 Z" fill="url(#msM)"/></g><circle cx="150" cy="60" r="27" fill="#f2b632" stroke="#fbf7eb" stroke-width="7"/><path d="M139.5 46.5 Q150 40 159 44.5 Q165 51 155.5 57.5 L151 60 L156.5 61.2 Q166 66 161 75.5 Q152.5 84 139.5 77.5" stroke="#0e2a2f" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  OM.logoMark = function (o) {
    o = o || {}; var sz = o.size || 64, small = o.small !== undefined ? o.small : sz <= 48;
    return '<svg class="logo-mark' + (small ? ' lm-small' : '') + (o.cls ? ' ' + o.cls : '') + '" viewBox="0 0 200 200" width="' + sz + '" height="' + sz + '"' +
      (o.decorative ? ' aria-hidden="true" focusable="false"' : ' role="img" aria-label="' + (o.label || OM.APP_NAME) + '"') + '>' + (small ? MARK_SMALL : MARK) + '</svg>';
  };
  // the full lock-up: the mark, "Mayes Maths & More" and the line underneath. dark: for navy backgrounds; stack: mark above the words
  OM.logo = function (o) {
    o = o || {};
    return '<span class="logo' + (o.dark ? ' logo-dark' : '') + (o.stack ? ' logo-stack' : '') + (o.cls ? ' ' + o.cls : '') + '"' + (o.id ? ' id="' + o.id + '"' : '') + ' role="img" aria-label="' + OM.APP_NAME + ': ' + OM.TAGLINE + '">' +
      OM.logoMark({ size: o.size || 120, decorative: true, small: false }) +
      '<span class="logo-words" aria-hidden="true"><span class="logo-name">Mayes Maths <span class="logo-more">&amp; More</span></span>' + (o.tagline === false ? '' : '<span class="logo-tag">' + OM.TAGLINE + '</span>') + '</span></span>';
  };
  OM.icon = function (name, o) {
    o = o || {};
    var s = o.size || 24, body = P[name] || P.spark;
    return '<svg class="ic' + (o.cls ? ' ' + o.cls : '') + '" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (o.stroke || 2) +
      '" stroke-linecap="round" stroke-linejoin="round"' + (o.label ? ' role="img" aria-label="' + o.label + '"' : ' aria-hidden="true" focusable="false"') + '>' + body + '</svg>';
  };
  OM.starIcon = function (on, s) {
    return '<svg class="ic star' + (on ? ' on' : '') + '" width="' + (s || 22) + '" height="' + (s || 22) + '" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" stroke-linejoin="round" stroke-width="1.8"/></svg>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
