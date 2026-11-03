/* Learn with Pip — the player's animal (avatar) and the baddies and their guards (inline SVG).
   Same flat, rounded style as the owl. Parts carry class names (blink, tail, shifty, breathe) that css/app.css animates. */
(function (G) {
  'use strict';
  var OM = G.OM, INK = '#15292a';

  // ---------- species: colours and head drawing (eyes are added separately) ----------
  function whiskers(y) {
    return '<path d="M16 ' + y + ' L40 ' + (y + 4) + ' M18 ' + (y + 10) + ' L40 ' + (y + 8) + ' M104 ' + y + ' L80 ' + (y + 4) + ' M102 ' + (y + 10) + ' L80 ' + (y + 8) + '" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>';
  }
  function smile(x, y, w) { return '<path d="M' + x + ' ' + y + ' Q' + (x - w / 2) + ' ' + (y + 6) + ' ' + (x - w) + ' ' + (y + 2) + ' M' + x + ' ' + y + ' Q' + (x + w / 2) + ' ' + (y + 6) + ' ' + (x + w) + ' ' + (y + 2) + '" stroke="' + INK + '" stroke-width="2" fill="none" stroke-linecap="round"/>'; }
  var SPECIES = {
    cat: { top: 32, name: 'Cat', c: ['#e3954f', '#b86a2a', '#fff3e3'], iris: '#e8f06a', eyes: [58, 15],
      head: function (c) {
        return '<path d="M20 60 L24 14 L48 34 Q60 31 72 34 L96 14 L100 60 Q102 96 60 98 Q18 96 20 60 Z" fill="' + c[0] + '"/>' +
          '<path d="M28 42 L29 24 L42 35 Z M92 42 L91 24 L78 35 Z" fill="#f3a9b8"/>' +
          '<path d="M54 36 L56 46 M60 34 L60 46 M66 36 L64 46" stroke="' + c[1] + '" stroke-width="3.5" stroke-linecap="round"/>' +
          '<ellipse cx="60" cy="78" rx="18" ry="13" fill="#fff" opacity=".35"/>' +
          '<path d="M56 71 L64 71 L60 76 Z" fill="#e0607a"/>' + smile(60, 76, 9) + whiskers(70);
      },
      tail: function (c) { return '<path class="tail" d="M84 132 Q112 130 110 104 Q108 90 98 92" stroke="' + c[0] + '" stroke-width="9" fill="none" stroke-linecap="round"/>'; } },
    fox: { top: 30, name: 'Fox', c: ['#e07a2e', '#b2541a', '#fff8ef'], iris: '#f5b83a', eyes: [54, 16],
      head: function (c) {
        return '<path d="M16 50 L22 8 L46 32 Q60 28 74 32 L98 8 L104 50 Q104 76 60 100 Q16 76 16 50 Z" fill="' + c[0] + '"/>' +
          '<path d="M27 30 L27 17 L39 30 Z M93 30 L93 17 L81 30 Z" fill="' + c[2] + '" opacity=".75"/>' +
          '<path d="M22 8 L24 20 L31 16 Z M98 8 L96 20 L89 16 Z" fill="#2a1a12"/>' +
          '<path d="M18 56 Q42 60 52 80 L60 100 L68 80 Q78 60 102 56 Q102 76 60 100 Q18 76 18 56 Z" fill="' + c[2] + '"/>' +
          '<ellipse cx="60" cy="86" rx="6" ry="4.5" fill="#2a1a12"/>' + smile(60, 91, 7);
      },
      tail: function (c) { return '<g class="tail"><path d="M84 136 Q120 136 114 96 Q100 112 82 120 Z" fill="' + c[0] + '"/><path d="M114 96 Q114 110 106 116 Q108 104 114 96 Z" fill="#fff"/></g>'; } },
    wolf: { top: 28, name: 'Wolf', c: ['#8b939c', '#5d646c', '#e3e6ea'], iris: '#9fd8ef', eyes: [52, 17],
      head: function (c) {
        return '<path d="M18 54 L20 6 L44 30 Q60 26 76 30 L100 6 L102 54 Q102 84 60 100 Q18 84 18 54 Z" fill="' + c[0] + '"/>' +
          '<path d="M25 32 L24 16 L38 30 Z M95 32 L96 16 L82 30 Z" fill="' + c[1] + '"/>' +
          '<path d="M42 62 Q60 56 78 62 Q80 92 60 98 Q40 92 42 62 Z" fill="' + c[2] + '"/>' +
          '<path d="M26 44 Q60 32 94 44 L92 50 Q60 40 28 50 Z" fill="' + c[1] + '" opacity=".55"/>' +
          '<ellipse cx="60" cy="72" rx="7" ry="5" fill="' + INK + '"/><path d="M60 77 L60 83" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>' + smile(60, 83, 10);
      },
      tail: function (c) { return '<g class="tail"><path d="M84 136 Q120 134 112 96 Q100 114 82 120 Z" fill="' + c[0] + '"/><path d="M112 96 Q112 108 106 114 Q106 104 112 96 Z" fill="' + c[1] + '"/></g>'; } },
    crow: { top: 22, name: 'Crow', c: ['#2f3440', '#1c2029', '#4a5060'], iris: '#f2d14a', eyes: [52, 16],
      head: function (c) {
        return '<path d="M50 26 Q48 8 60 14 Q66 4 70 24 Z" fill="' + c[0] + '"/><circle cx="60" cy="56" r="36" fill="' + c[0] + '"/>' +
          '<path d="M32 70 Q60 84 88 70 Q84 90 60 92 Q36 90 32 70 Z" fill="' + c[2] + '" opacity=".6"/>' +
          '<path d="M46 66 Q60 60 74 66 L60 94 Z" fill="#a3a9b3"/><path d="M48 70 Q60 74 72 70 L60 94 Z" fill="#7b818c"/>';
      },
      tail: function (c) { return '<path class="tail tail-c" d="M50 132 L42 146 L60 140 L78 146 L70 132 Z" fill="' + c[1] + '"/>'; } },
    otter: { top: 26, name: 'Otter', c: ['#8a5a3a', '#5f3c25', '#ead2b4'], eyes: [52, 17],
      head: function (c) {
        return '<circle cx="26" cy="36" r="9" fill="' + c[0] + '"/><circle cx="94" cy="36" r="9" fill="' + c[0] + '"/><circle cx="26" cy="36" r="4" fill="' + c[1] + '"/><circle cx="94" cy="36" r="4" fill="' + c[1] + '"/>' +
          '<ellipse cx="60" cy="60" rx="40" ry="35" fill="' + c[0] + '"/>' +
          '<path d="M28 66 Q60 54 92 66 Q92 94 60 95 Q28 94 28 66 Z" fill="' + c[2] + '"/>' +
          '<path d="M53 66 Q60 62 67 66 Q64 72 60 73 Q56 72 53 66 Z" fill="' + INK + '"/><path d="M60 73 L60 77" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>' + smile(60, 77, 9) +
          '<g fill="' + c[1] + '" opacity=".5"><circle cx="46" cy="74" r="1.3"/><circle cx="42" cy="78" r="1.3"/><circle cx="74" cy="74" r="1.3"/><circle cx="78" cy="78" r="1.3"/></g>' + whiskers(72);
      },
      tail: function (c) { return '<path class="tail" d="M82 136 Q116 134 118 104 Q106 122 80 120 Z" fill="' + c[1] + '"/>'; } },
    rabbit: { top: 30, name: 'Rabbit', c: ['#d8cbbd', '#b5a594', '#fbf6ef'], eyes: [58, 15],
      head: function (c) {
        return '<g class="ears"><path d="M40 34 Q28 -8 42 -6 Q54 -2 52 32 Z" fill="' + c[0] + '"/><path d="M42 28 Q36 2 43 2 Q48 6 47 28 Z" fill="#f3a9b8"/>' +
          '<path d="M80 34 Q92 -8 78 -6 Q66 -2 68 32 Z" fill="' + c[0] + '"/><path d="M78 28 Q84 2 77 2 Q72 6 73 28 Z" fill="#f3a9b8"/></g>' +
          '<ellipse cx="60" cy="62" rx="34" ry="32" fill="' + c[0] + '"/><ellipse cx="60" cy="79" rx="16" ry="12" fill="' + c[2] + '"/>' +
          '<path d="M56 72 L64 72 L60 77 Z" fill="#e0607a"/>' + smile(60, 77, 7) + '<rect x="57" y="81" width="6" height="6" rx="1.5" fill="#fff" stroke="' + c[1] + '" stroke-width="1"/>';
      },
      tail: function () { return '<circle cx="88" cy="132" r="8" fill="#fff"/>'; } },
    hedgehog: { top: 13, hatS: .9, name: 'Hedgehog', c: ['#a9774a', '#6e4a2c', '#f1dcb9'], eyes: [60, 13],
      head: function (c) {
        return '<path d="M12 64 L4 46 L20 46 L14 28 L32 32 L32 14 L48 24 L60 8 L72 24 L88 14 L88 32 L106 28 L100 46 L116 46 L108 64 Z" fill="' + c[1] + '"/>' +
          '<path d="M22 60 L18 46 L30 46 L28 32 L42 36 L46 22 L60 32 L74 22 L78 36 L92 32 L90 46 L102 46 L98 60 Z" fill="' + c[0] + '"/>' +
          '<circle cx="36" cy="44" r="6" fill="' + c[2] + '"/><circle cx="84" cy="44" r="6" fill="' + c[2] + '"/>' +
          '<ellipse cx="60" cy="66" rx="30" ry="28" fill="' + c[2] + '"/><ellipse cx="60" cy="80" rx="11" ry="8" fill="#fff4e2"/>' +
          '<circle cx="60" cy="76" r="4.5" fill="' + INK + '"/>' + smile(60, 82, 6);
      } },
    badger: { top: 22, name: 'Badger', c: ['#7f8389', '#55595e', '#f2f2ee'], eyes: [54, 14],
      head: function (c) {
        return '<circle cx="28" cy="34" r="9" fill="' + INK + '" stroke="' + c[2] + '" stroke-width="2"/><circle cx="92" cy="34" r="9" fill="' + INK + '" stroke="' + c[2] + '" stroke-width="2"/>' +
          '<ellipse cx="60" cy="58" rx="36" ry="37" fill="' + c[2] + '"/>' +
          '<path d="M24 58 Q24 32 38 26 L44 70 Q40 90 34 84 Q24 74 24 58 Z M96 58 Q96 32 82 26 L76 70 Q80 90 86 84 Q96 74 96 58 Z" fill="' + c[0] + '"/>' +
          '<path d="M38 22 Q46 18 50 28 L53 70 Q46 78 40 70 Z M82 22 Q74 18 70 28 L67 70 Q74 78 80 70 Z" fill="' + INK + '"/>' +
          '<ellipse cx="60" cy="84" rx="7" ry="5" fill="' + INK + '"/>' + smile(60, 89, 7);
      },
      tail: function (c) { return '<path class="tail" d="M84 134 Q102 138 100 122 Z" fill="' + c[1] + '"/>'; } },
    squirrel: { top: 30, name: 'Squirrel', c: ['#c8642c', '#9a4417', '#f6dcc0'], eyes: [56, 14],
      head: function (c) {
        return '<path d="M34 40 L30 8 L48 32 Z M86 40 L90 8 L72 32 Z" fill="' + c[0] + '"/><path d="M30 8 L25 -1 L35 5 Z M90 8 L95 -1 L85 5 Z" fill="' + c[1] + '"/>' +
          '<ellipse cx="60" cy="60" rx="33" ry="31" fill="' + c[0] + '"/>' +
          '<ellipse cx="40" cy="72" rx="10" ry="8" fill="' + c[2] + '"/><ellipse cx="80" cy="72" rx="10" ry="8" fill="' + c[2] + '"/><ellipse cx="60" cy="77" rx="12" ry="10" fill="' + c[2] + '"/>' +
          '<ellipse cx="60" cy="71" rx="4" ry="3" fill="' + INK + '"/>' + smile(60, 75, 6) + '<rect x="57" y="79" width="6" height="5" rx="1.5" fill="#fff"/>';
      },
      tail: function (c) { return '<path class="tail" d="M84 136 Q124 132 116 86 Q112 54 90 62 Q104 78 98 98 Q94 114 80 120 Z" fill="' + c[1] + '"/>'; } },
    mouse: { top: 36, name: 'Mouse', c: ['#a7a9b4', '#80828d', '#e7e8ee'], eyes: [60, 13],
      head: function (c) {
        return '<g class="ears"><circle cx="30" cy="32" r="20" fill="' + c[0] + '"/><circle cx="30" cy="32" r="12" fill="#f3a9b8"/><circle cx="90" cy="32" r="20" fill="' + c[0] + '"/><circle cx="90" cy="32" r="12" fill="#f3a9b8"/></g>' +
          '<ellipse cx="60" cy="64" rx="30" ry="29" fill="' + c[0] + '"/><ellipse cx="60" cy="80" rx="13" ry="10" fill="' + c[2] + '"/>' +
          '<circle cx="60" cy="75" r="4" fill="#e0607a"/>' + smile(60, 79, 6) + whiskers(74);
      },
      tail: function () { return '<path class="tail" d="M84 134 Q116 138 112 112 Q110 100 100 104" stroke="#e8a3ae" stroke-width="3.5" fill="none" stroke-linecap="round"/>'; } },
    frog: { top: 30, name: 'Frog', c: ['#5cae5a', '#3e8a3d', '#cdeac0'], eyes: [40, 22], eyeR: 9,
      head: function (c) {
        return '<circle cx="38" cy="42" r="16" fill="' + c[0] + '"/><circle cx="82" cy="42" r="16" fill="' + c[0] + '"/>' +
          '<ellipse cx="60" cy="66" rx="44" ry="29" fill="' + c[0] + '"/>' +
          '<circle cx="54" cy="62" r="1.8" fill="' + c[1] + '"/><circle cx="66" cy="62" r="1.8" fill="' + c[1] + '"/>' +
          '<path d="M34 72 Q60 92 86 72" stroke="' + c[1] + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
          '<circle cx="30" cy="74" r="6" fill="#ff8a7a" opacity=".35"/><circle cx="90" cy="74" r="6" fill="#ff8a7a" opacity=".35"/>';
      } }
  };
  // baddie versions are a little darker and sharper
  var BADDIE_COLOURS = { cat: ['#8c7fa8', '#6a5d88', '#d9d2e6'], fox: ['#c4622a', '#8f4316', '#fff1e2'], wolf: ['#7f8891', '#525961', '#dde1e6'], crow: ['#2f3440', '#1c2029', '#4a5060'] };

  function friendlyEyes(y, dx, r) {
    r = r || 8.5;
    return '<g class="blink"><circle cx="' + (60 - dx) + '" cy="' + y + '" r="' + r + '" fill="#fff"/><circle cx="' + (60 + dx) + '" cy="' + y + '" r="' + r + '" fill="#fff"/>' +
      '<circle cx="' + (60 - dx + 1) + '" cy="' + (y + 1) + '" r="' + (r * .62) + '" fill="' + INK + '"/><circle cx="' + (60 + dx + 1) + '" cy="' + (y + 1) + '" r="' + (r * .62) + '" fill="' + INK + '"/>' +
      '<circle cx="' + (60 - dx + 3) + '" cy="' + (y - 2) + '" r="' + (r * .22) + '" fill="#fff"/><circle cx="' + (60 + dx + 3) + '" cy="' + (y - 2) + '" r="' + (r * .22) + '" fill="#fff"/></g>';
  }
  function happyEyes(y, dx) {
    return '<path d="M' + (60 - dx - 7) + ' ' + (y + 2) + ' Q' + (60 - dx) + ' ' + (y - 7) + ' ' + (60 - dx + 7) + ' ' + (y + 2) + ' M' + (60 + dx - 7) + ' ' + (y + 2) + ' Q' + (60 + dx) + ' ' + (y - 7) + ' ' + (60 + dx + 7) + ' ' + (y + 2) + '" stroke="' + INK + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
  }
  // scheming eyes: lids flat across the top, slit pupils that glance from side to side
  function slyEyes(y, dx, iris, soft) {
    var l = 60 - dx, r = 60 + dx;
    return '<path d="M' + (l - 10) + ' ' + y + ' Q' + l + ' ' + (y - 8) + ' ' + (l + 10) + ' ' + y + ' Q' + l + ' ' + (y + 8) + ' ' + (l - 10) + ' ' + y + ' Z" fill="' + iris + '"/>' +
      '<path d="M' + (r - 10) + ' ' + y + ' Q' + r + ' ' + (y - 8) + ' ' + (r + 10) + ' ' + y + ' Q' + r + ' ' + (y + 8) + ' ' + (r - 10) + ' ' + y + ' Z" fill="' + iris + '"/>' +
      '<g class="shifty"><ellipse cx="' + l + '" cy="' + y + '" rx="2.2" ry="6" fill="' + INK + '"/><ellipse cx="' + r + '" cy="' + y + '" rx="2.2" ry="6" fill="' + INK + '"/></g>' +
      (soft ? '' : '<path d="M' + (l - 12) + ' ' + (y - 5) + ' L' + (l + 10) + ' ' + (y - 2) + ' M' + (r + 12) + ' ' + (y - 5) + ' L' + (r - 10) + ' ' + (y - 2) + '" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/>');
  }

  /* OM.animalSVG(kind, { role: 'avatar' | 'king' | 'guard', size, mood: 'happy' | 'cheer', colour (guard tunic), fur, dark }) */
  OM.animalSVG = function (kind, o) {
    o = o || {};
    // Years 7 to 11: a more life-like drawing (js/animals-real.js), more so each year, for the player and the baddies
    if (o.real && OM.naturalAnimal) return OM.naturalAnimal(kind, o);
    var sp = SPECIES[kind] || SPECIES.otter, role = o.role || 'avatar', size = o.size || 120;
    var c = (role === 'avatar' ? sp.c : BADDIE_COLOURS[kind] || sp.c).slice();
    if (o.fur) c[0] = o.fur; if (o.dark) c[1] = o.dark;
    var body = '';
    if (role === 'king') {
      body = '<path d="M18 140 Q16 104 36 94 L84 94 Q104 104 102 140 Z" fill="#a8323b"/><path d="M34 95 Q60 108 86 95 L86 100 Q60 113 34 100 Z" fill="#fbf6ec"/>' +
        '<circle cx="46" cy="103" r="1.6" fill="' + INK + '"/><circle cx="60" cy="107" r="1.6" fill="' + INK + '"/><circle cx="74" cy="103" r="1.6" fill="' + INK + '"/>';
    } else if (role === 'guard') {
      var tunic = o.colour || c[1];
      body = '<path d="M28 140 Q28 106 44 98 L76 98 Q92 106 92 140 Z" fill="' + tunic + '"/><path d="M50 98 L60 112 L70 98 Z" fill="' + c[0] + '"/>' +
        '<rect x="30" y="122" width="60" height="6" fill="' + INK + '" opacity=".55"/><rect x="56" y="121" width="8" height="8" rx="1.5" fill="#ffc53d"/>';
    } else if (kind === 'crow') {
      body = '<path d="M30 140 Q26 100 60 96 Q94 100 90 140 Z" fill="' + c[0] + '"/>';
    } else {
      var up = o.mood === 'cheer';
      body = '<path d="M30 140 Q26 100 60 96 Q94 100 90 140 Z" fill="' + c[0] + '"/><ellipse cx="60" cy="124" rx="17" ry="14" fill="' + c[2] + '"/>' +
        (up ? ''
          : '<ellipse cx="33" cy="116" rx="7" ry="12" fill="' + c[1] + '" transform="rotate(20 33 116)"/><ellipse cx="87" cy="116" rx="7" ry="12" fill="' + c[1] + '" transform="rotate(-20 87 116)"/>') +
        '<ellipse cx="46" cy="140" rx="9" ry="4" fill="' + c[1] + '"/><ellipse cx="74" cy="140" rx="9" ry="4" fill="' + c[1] + '"/>';
    }
    // cheering arms go in front of the head so they show
    var t = o.tier || 'mid', HOOD = '#3d4f9a', HOOD_D = '#2c3a78';
    // adventurer (Years 5-6): a hoodie with the hood down, drawstrings and backpack straps
    var hood = '', hoodie = '';
    if (role === 'avatar' && t === 'big' && kind !== 'crow') {
      hood = '<path d="M26 98 Q60 80 94 98 Q96 108 88 112 Q60 100 32 112 Q24 108 26 98 Z" fill="' + HOOD_D + '"/>';
      hoodie = '<path d="M30 140 Q26 102 60 99 Q94 102 90 140 Z" fill="' + HOOD + '"/><path d="M42 126 H78 Q80 136 76 140 H44 Q40 136 42 126 Z" fill="' + HOOD_D + '"/>' +
        '<path d="M54 102 L52 120 M66 102 L68 120" stroke="#e8ecff" stroke-width="2" stroke-linecap="round"/><circle cx="52" cy="121" r="2" fill="#e8ecff"/><circle cx="68" cy="121" r="2" fill="#e8ecff"/>' +
        '<path d="M34 104 Q36 122 38 138 M86 104 Q84 122 82 138" stroke="#c0434b" stroke-width="5" stroke-linecap="round" fill="none"/>';
      if (o.mood !== 'cheer') hoodie += '<ellipse cx="33" cy="117" rx="7.5" ry="12.5" fill="' + HOOD + '" transform="rotate(20 33 117)"/><ellipse cx="87" cy="117" rx="7.5" ry="12.5" fill="' + HOOD + '" transform="rotate(-20 87 117)"/>';
    }
    // pro (Years 7-11): a clean zip-up jacket and headphones round the neck
    if (role === 'avatar' && t === 'pro' && kind !== 'crow') {
      var JK = '#26323a', JK_L = '#33434d', TEAL = '#2ec4b6';
      hoodie = '<path d="M30 140 Q26 102 60 99 Q94 102 90 140 Z" fill="' + JK + '"/><path d="M60 100 V140" stroke="' + TEAL + '" stroke-width="2.5"/><path d="M46 100 L60 112 L74 100" fill="none" stroke="' + JK_L + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M32 128 H50 M70 128 H88" stroke="' + TEAL + '" stroke-width="2" opacity=".8"/>';
      if (o.mood !== 'cheer') hoodie += '<ellipse cx="33" cy="117" rx="7.5" ry="12.5" fill="' + JK + '" transform="rotate(20 33 117)"/><ellipse cx="87" cy="117" rx="7.5" ry="12.5" fill="' + JK + '" transform="rotate(-20 87 117)"/>';
      hood = '<path d="M36 98 Q60 114 84 98" stroke="#1b2227" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="26" y="90" width="13" height="17" rx="6" fill="#1b2227"/><rect x="81" y="90" width="13" height="17" rx="6" fill="#1b2227"/><rect x="28" y="93" width="9" height="11" rx="4" fill="' + TEAL + '"/><rect x="83" y="93" width="9" height="11" rx="4" fill="' + TEAL + '"/>';
    }
    var older = t === 'big' || t === 'pro';
    var arms = role === 'avatar' && kind !== 'crow' && o.mood === 'cheer' ? '<g class="arm-l"><ellipse cx="16" cy="88" rx="7" ry="14" fill="' + c[1] + '" transform="rotate(-28 16 88)"/></g><g class="arm-r"><ellipse cx="104" cy="88" rx="7" ry="14" fill="' + c[1] + '" transform="rotate(28 104 88)"/></g>' : '';
    var eyes = role === 'avatar' ? (o.mood === 'happy' || o.mood === 'cheer' ? happyEyes(sp.eyes[0], sp.eyes[1]) : friendlyEyes(sp.eyes[0], sp.eyes[1], (sp.eyeR || 8.5) * (t === 'little' ? 1.12 : 1)))
      : slyEyes(sp.eyes[0], sp.eyes[1], sp.iris || '#e8f06a', t === 'little');
    // little explorers have rosier cheeks; adventurers have confident eyebrows
    var face = '';
    if (role === 'avatar' && t === 'little') face = '<circle cx="' + (60 - sp.eyes[1] - 8) + '" cy="' + (sp.eyes[0] + 15) + '" r="6.5" fill="#ff8a7a" opacity=".38"/><circle cx="' + (60 + sp.eyes[1] + 8) + '" cy="' + (sp.eyes[0] + 15) + '" r="6.5" fill="#ff8a7a" opacity=".38"/>';
    if (role === 'avatar' && older && o.mood !== 'happy' && o.mood !== 'cheer') face = '<path d="M' + (60 - sp.eyes[1] - 8) + ' ' + (sp.eyes[0] - 13) + ' Q' + (60 - sp.eyes[1]) + ' ' + (sp.eyes[0] - 17) + ' ' + (60 - sp.eyes[1] + 8) + ' ' + (sp.eyes[0] - 13) + ' M' + (60 + sp.eyes[1] - 8) + ' ' + (sp.eyes[0] - 13) + ' Q' + (60 + sp.eyes[1]) + ' ' + (sp.eyes[0] - 17) + ' ' + (60 + sp.eyes[1] + 8) + ' ' + (sp.eyes[0] - 13) + '" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
    // older baddies wear armour
    var armour = '';
    if (older && role === 'guard') armour = '<ellipse cx="34" cy="104" rx="14" ry="9" fill="#7c8894"/><ellipse cx="86" cy="104" rx="14" ry="9" fill="#7c8894"/><path d="M24 104 Q34 96 44 104 M76 104 Q86 96 96 104" stroke="#aeb8c2" stroke-width="2.5" fill="none"/>';
    if (older && role === 'king') armour = '<path d="M30 96 L22 80 L40 92 Z M90 96 L98 80 L80 92 Z" fill="#7a1f27"/><path d="M44 100 L60 120 L76 100" stroke="#ffc53d" stroke-width="3" fill="none"/>';
    var crown = role === 'king' ? '<g class="crown"><path d="M36 26 L38 4 L50 16 L60 -2 L70 16 L82 4 L84 26 Q60 30 36 26 Z" fill="#ffc53d"/><path d="M36 26 Q60 30 84 26 L84 22 Q60 26 36 22 Z" fill="#d99a00"/>' +
      '<circle cx="60" cy="14" r="3.5" fill="#c0434b"/><circle cx="45" cy="18" r="2.5" fill="#4a5fd6"/><circle cx="75" cy="18" r="2.5" fill="#4a5fd6"/><path class="shine" d="M40 8 L42 4 L44 8 L42 12 Z" fill="#fff"/></g>' : '';
    var helmet = role === 'guard' ? '<path d="M30 40 Q32 12 60 12 Q88 12 90 40 Q60 34 30 40 Z" fill="#9aa6b1"/><path d="M30 40 Q60 34 90 40 L90 44 Q60 38 30 44 Z" fill="#6f7a85"/><path class="plume" d="M60 12 Q66 0 76 -2 Q70 8 64 14 Z" fill="#c0434b"/>' : '';
    // outfits bought with acorns (player's animal only)
    var outfit = '', outfitBack = '';
    if (role === 'avatar' && OM.drawOutfit) {
      // the dressing-up chest (js/outfits.js): wear is { hat, neck, eyes, badge, back, held, magic }; older callers pass hat/scarf/glasses
      var drawn = OM.drawOutfit(o.wear || { hat: o.hat, scarf: o.scarf, glasses: o.glasses }, sp);
      outfit = drawn.front; outfitBack = drawn.back;
    }
    return '<svg class="char ' + role + ' ' + kind + ' ' + (o.cls || '') + '" overflow="visible" style="--d:-' + (Math.random() * 5).toFixed(2) + 's" viewBox="0 -8 120 152" width="' + size + '" height="' + Math.round(size * 1.27) + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<ellipse cx="60" cy="142" rx="34" ry="4" fill="' + INK + '" opacity=".12"/>' +
      outfitBack + (sp.tail ? sp.tail(c) : '') + '<g class="breathe">' + body + hoodie + armour + hood + sp.head(c) + eyes + face + crown + helmet + outfit + arms + '</g></svg>';
  };

  // ---------- who can be what ----------
  OM.animalName = function (id) { return ((SPECIES[id] || SPECIES.otter).name).toLowerCase(); };
  OM.AVATARS = ['otter', 'rabbit', 'hedgehog', 'fox', 'badger', 'squirrel', 'mouse', 'frog', 'cat'].map(function (id) { return { id: id, name: SPECIES[id].name }; });
    // Guards are named per area. Area ids are shared by every year; Year 6 adds calc (all four operations), ra (ratio) and al (algebra).
  function guards(npv, as, md, fr, me, sh, po, st, calc, ra, al) { return { npv: npv, as: as, md: md, fr: fr, me: me, sh: sh, po: po, st: st, calc: calc, ra: ra, al: al }; }
  OM.BADDIES = {
    cat: { id: 'cat', title: 'the Cat King', short: 'Cat King', laugh: 'Mwah-ha-ha… *purr*.',
      guards: guards('Tabitha the Tabby', 'Sir Whiskers', 'Countess Purrwell', 'Captain Clawdia', 'Baron Bramblepaw', 'Lady Mittens', 'General Thistlewhisk', 'The Cat King’s Spy', 'Lord Tufton', 'Professor Purrkins', 'Madam Whiskerby') },
    wolf: { id: 'wolf', title: 'the Wolf King', short: 'Wolf King', laugh: 'Ah-hoooooo!',
      guards: guards('Grizzle the Grey', 'Sir Howlsworth', 'Lady Moonfang', 'Captain Snarl', 'Baron Bristleback', 'Countess Frostpaw', 'General Gnash', 'The Wolf King’s Spy', 'Lord Grimtooth', 'Professor Greymane', 'Madam Nightpaw') },
    crow: { id: 'crow', title: 'the Crow Queen', short: 'Crow Queen', laugh: 'Caw-caw-caw!',
      guards: guards('Inkwing', 'Sir Croakley', 'Lady Glint', 'Captain Caw', 'Baron Blackfeather', 'Countess Shadowquill', 'General Rookwood', 'The Crow Queen’s Spy', 'Lord Quillbeak', 'Professor Ravelle', 'Madam Murkwing') },
    fox: { id: 'fox', title: 'the Fox Queen', short: 'Fox Queen', laugh: 'Hee-hee-hee!',
      guards: guards('Rusty Redbrush', 'Sir Sniffwell', 'Lady Emberfur', 'Captain Pounce', 'Baron Brushwood', 'Countess Copperpaw', 'General Slyfoot', 'The Fox Queen’s Spy', 'Lord Bushytail', 'Professor Russet', 'Madam Foxglove') }
  };
  // an animal cannot be both the baddie and the player
  OM.avatarAllowed = function (avatar, baddie) { return avatar !== baddie; };

  // the cat drawings used before animals were added
  OM.catSVG = function (o) {
    o = o || {};
    return OM.animalSVG('cat', { role: o.king ? 'king' : o.helmet ? 'guard' : 'avatar', size: o.size, fur: o.fur || (o.king || o.helmet ? null : undefined), dark: o.dark, colour: o.colour });
  };
})(typeof window !== 'undefined' ? window : globalThis);
