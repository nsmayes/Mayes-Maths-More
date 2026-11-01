/* Learn with Pip — characters: the owl tutor, the Cat King and his guards (inline SVG).
   Flat, rounded shapes with soft two-tone shading; no outlines except where they carry expression (eyes, brows). */
(function (G) {
  'use strict';
  var OM = G.OM;
  var INK = '#15292a', BEAK = '#ffb020', BEAK_D = '#e08a00';
  // [body, shade, face and belly]
  OM.OWL_COLOURS = { brown: ['#8d5d3d', '#6b4329', '#f4e4c9'], grey: ['#7f8996', '#5e6773', '#eef1f4'], snowy: ['#ece6da', '#c9bfac', '#ffffff'], ginger: ['#d9822b', '#ad6118', '#fde8cc'] };

  // hats are drawn for a head whose top is at y = 25 (the owl); animals move and shrink them to fit their own head
  var HATS = {
    acorn: '<path d="M30 26 Q60 0 90 26 Z" fill="#9a6232"/><path d="M30 26 Q60 16 90 26" stroke="#7a4a22" stroke-width="3" fill="none"/><rect x="57" y="2" width="6" height="10" rx="3" fill="#5a3818"/>',
    party: '<path d="M60 -12 L45 22 Q60 27 75 22 Z" fill="#c0434b"/><path d="M50 12 Q60 15 70 12" stroke="#fff" stroke-width="3" fill="none"/><circle cx="60" cy="-12" r="5" fill="#ffc53d"/>',
    wizard: '<path d="M66 -15 L38 24 L84 24 Z" fill="#4a5fd6"/><ellipse cx="60" cy="24" rx="32" ry="6" fill="#3647ad"/><path d="M58 4 l2 4 l4 .6 l-3 2.8 l.7 4 l-3.7 -2 l-3.7 2 l.7 -4 l-3 -2.8 l4 -.6 z" fill="#ffc53d"/>',
    leaves: '<path d="M28 28 Q30 10 44 20 Q48 2 60 14 Q72 2 76 20 Q90 10 92 28 Q60 22 28 28 Z" fill="#3e9a5c"/><path d="M44 20 L48 26 M60 14 L60 23 M76 20 L72 26" stroke="#2f7a5f" stroke-width="2" stroke-linecap="round"/>',
    explorer: '<ellipse cx="60" cy="25" rx="40" ry="7" fill="#b89462"/><path d="M38 25 Q40 4 60 4 Q80 4 82 25 Z" fill="#d3b27e"/><rect x="38" y="18" width="44" height="5" rx="2" fill="#6b4329"/>'
  };
  OM.HAT = function (name) { return HATS[name] || ''; };

  OM.owlSVG = function (o) {
    o = o || {};
    var col = OM.OWL_COLOURS[o.colour || 'brown'] || OM.OWL_COLOURS.brown, mood = o.mood || 'happy', size = o.size || 120;
    var body = col[0], shade = col[1], face = col[2];
    var eyes;
    if (mood === 'happy' || mood === 'cheer') {
      eyes = '<circle cx="43" cy="52" r="14" fill="#fff"/><circle cx="77" cy="52" r="14" fill="#fff"/>' +
        '<path d="M35 55 Q43 45 51 55" stroke="' + INK + '" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M69 55 Q77 45 85 55" stroke="' + INK + '" stroke-width="4.5" fill="none" stroke-linecap="round"/>';
    } else {
      var dx = mood === 'think' ? 3 : 0, dy = mood === 'think' ? -3 : mood === 'sad' ? 2 : 0;
      eyes = '<g class="blink"><circle cx="43" cy="52" r="14" fill="#fff"/><circle cx="77" cy="52" r="14" fill="#fff"/>' +
        '<circle cx="' + (43 + dx) + '" cy="' + (52 + dy) + '" r="8.5" fill="' + INK + '"/><circle cx="' + (77 + dx) + '" cy="' + (52 + dy) + '" r="8.5" fill="' + INK + '"/>' +
        '<circle cx="' + (46 + dx) + '" cy="' + (48.5 + dy) + '" r="3" fill="#fff"/><circle cx="' + (80 + dx) + '" cy="' + (48.5 + dy) + '" r="3" fill="#fff"/></g>';
      if (mood === 'sad') eyes += '<path d="M32 39 L51 34 M88 39 L69 34" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/>';
      if (mood === 'think') eyes += '<path d="M67 33 Q77 27 88 33" stroke="' + INK + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
    }
    var wings = mood === 'cheer'
      ? '<path class="flap-l" d="M24 70 Q4 54 6 28 Q24 40 32 62 Z" fill="' + shade + '"/><path class="flap-r" d="M96 70 Q116 54 114 28 Q96 40 88 62 Z" fill="' + shade + '"/>'
      : '<path class="wing-l" d="M22 66 Q8 92 24 114 Q34 96 31 68 Z" fill="' + shade + '"/><path class="wing-r" d="M98 66 Q112 92 96 114 Q86 96 89 68 Z" fill="' + shade + '"/>';
    var belly = '<ellipse cx="60" cy="97" rx="25" ry="23" fill="' + face + '"/>';
    [[50, 89], [62, 89], [56, 99], [68, 99], [62, 109]].forEach(function (c) { belly += '<path d="M' + (c[0] - 4) + ' ' + c[1] + ' l4 3.5 l4 -3.5" stroke="' + shade + '" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>'; });
    var hat = o.hat ? OM.HAT(o.hat) : '';
    var gear = '';
    if (o.tier === 'big') gear = '<path d="M30 104 Q60 82 92 68" stroke="#7a4a22" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="18" y="98" width="24" height="20" rx="5" fill="#9a6232"/><path d="M18 104 H42" stroke="#7a4a22" stroke-width="2.5"/>' +
      (o.hat ? '' : '<path d="M26 30 Q60 18 94 30" stroke="#3d2a1a" stroke-width="5" fill="none"/><circle cx="46" cy="27" r="9" fill="#9fd8ef" stroke="#c9a227" stroke-width="3.5"/><circle cx="74" cy="27" r="9" fill="#9fd8ef" stroke="#c9a227" stroke-width="3.5"/><circle cx="43" cy="24" r="2.5" fill="#fff" opacity=".8"/><circle cx="71" cy="24" r="2.5" fill="#fff" opacity=".8"/>');
    // pro: Pip becomes mission control, with a headset and microphone
    if (o.tier === 'pro') gear = (o.hat ? '' : '<path d="M28 46 Q60 2 92 46" stroke="#26323a" stroke-width="5" fill="none" stroke-linecap="round"/>') +
      '<rect x="86" y="40" width="12" height="20" rx="5" fill="#26323a"/><rect x="88" y="43" width="8" height="14" rx="3" fill="#2ec4b6"/><path d="M92 58 Q90 76 72 78" stroke="#26323a" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="70" cy="78" r="4" fill="#2ec4b6"/>';
    if (o.tier === 'little') gear = '<circle cx="29" cy="68" r="7" fill="#ff8a7a" opacity=".35"/><circle cx="91" cy="68" r="7" fill="#ff8a7a" opacity=".35"/><path d="M58 22 Q54 12 62 10 Q58 16 64 20" stroke="' + shade + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
    var scarf = o.scarf ? '<path d="M25 74 Q60 90 95 74 L95 83 Q60 99 25 83 Z" fill="' + o.scarf + '"/><path d="M76 86 L84 110 Q78 112 72 108 Z" fill="' + o.scarf + '"/>' : '';
    var glasses = o.glasses ? '<circle cx="43" cy="52" r="16" fill="none" stroke="' + INK + '" stroke-width="3"/><circle cx="77" cy="52" r="16" fill="none" stroke="' + INK + '" stroke-width="3"/><path d="M59 51 L61 51" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' : '';
    return '<svg class="owl char ' + mood + ' ' + (o.cls || '') + '" style="--d:-' + (Math.random() * 5).toFixed(2) + 's" viewBox="0 -16 120 150" width="' + size + '" height="' + size * 1.25 + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<ellipse cx="60" cy="129" rx="30" ry="4" fill="' + INK + '" opacity=".12"/>' +
      '<g class="breathe">' + wings +
      '<path d="M27 6 L42 24 Q60 17 78 24 L93 6 Q104 30 102 58 Q103 100 84 118 Q60 130 36 118 Q17 100 18 58 Q16 30 27 6 Z" fill="' + body + '"/>' +
      '<path d="M27 6 L42 24 Q36 26 33 30 Z M93 6 L78 24 Q84 26 87 30 Z" fill="' + shade + '" opacity=".6"/>' +
      belly + scarf +
      '<path d="M60 40 Q50 30 40 32 Q24 34 24 52 Q24 70 42 70 Q54 70 60 62 Q66 70 78 70 Q96 70 96 52 Q96 34 80 32 Q70 30 60 40 Z" fill="' + face + '"/>' +
      '<circle cx="31" cy="67" r="5" fill="#ff8a7a" opacity=".35"/><circle cx="89" cy="67" r="5" fill="#ff8a7a" opacity=".35"/>' +
      eyes + glasses +
      '<path d="M54.5 62 Q60 59 65.5 62 Q63 70 60 74 Q57 70 54.5 62 Z" fill="' + BEAK + '"/><path d="M57 67 Q60 69 63 67" stroke="' + BEAK_D + '" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="47" cy="124" rx="8" ry="4.5" fill="' + BEAK + '"/><ellipse cx="73" cy="124" rx="8" ry="4.5" fill="' + BEAK + '"/>' + gear + hat + '</g></svg>';
  };

  OM.GUARD_FURS = [['#d59a5a', '#a8713a'], ['#8a8f96', '#62676e'], ['#e8e0d0', '#bcb3a0'], ['#3d3a3a', '#232121'], ['#c98e56', '#8f5f30'], ['#a3a3b8', '#7b7b92'], ['#e0a3b0', '#b87988'], ['#6b8fb3', '#4d6f91']];
})(typeof window !== 'undefined' ? window : globalThis);
