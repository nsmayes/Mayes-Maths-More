/* Learn with Pip — core helpers shared by the app and the automated content checks.
   Loaded as a classic script so the app works by double-clicking play.html (no server needed). */
(function (G) {
  'use strict';
  var OM = G.OM = G.OM || {};

  // ---------- Seeded random numbers (so any question can be regenerated exactly from its seed) ----------
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  OM.makeRng = function (seed) {
    var r = mulberry32(seed);
    var rng = {
      seed: seed,
      next: r,
      int: function (a, b) { return a + Math.floor(r() * (b - a + 1)); },
      pick: function (arr) { return arr[Math.floor(r() * arr.length)]; },
      chance: function (p) { return r() < p; },
      shuffle: function (arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
        return a;
      },
      sample: function (arr, n) { return rng.shuffle(arr).slice(0, n); },
      weighted: function (items, weights) {
        var total = weights.reduce(function (s, w) { return s + w; }, 0), x = r() * total;
        for (var i = 0; i < items.length; i++) { x -= weights[i]; if (x < 0) return items[i]; }
        return items[items.length - 1];
      }
    };
    return rng;
  };
  OM.newSeed = function () { return Math.floor(Math.random() * 2147483646) + 1; };

  // ---------- Number formatting (UK conventions: comma thousands separator, £ and p) ----------
  OM.fmt = function (n) {
    var neg = n < 0, s = String(Math.abs(n));
    var parts = s.split('.');
    if (Math.abs(n) >= 1000) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '−' : '') + parts.join('.');
  };
  // Exact decimal from an integer count of 1/10^dp (avoids floating point): fromScaled(345, 2) -> "3.45"
  OM.fromScaled = function (int, dp) {
    if (!dp) return String(int);
    var neg = int < 0, s = String(Math.abs(int));
    while (s.length <= dp) s = '0' + s;
    var out = s.slice(0, s.length - dp) + '.' + s.slice(s.length - dp);
    return (neg ? '−' : '') + out;
  };
  OM.money = function (pence) {
    if (pence < 100) return pence + 'p';
    return '£' + OM.fromScaled(pence, 2);
  };
  OM.pounds = function (pence) { return '£' + OM.fromScaled(pence, 2); };

  // ---------- Fractions ----------
  OM.gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; };
  var DEN_WORDS = { 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['quarter', 'quarters'], 5: ['fifth', 'fifths'],
    6: ['sixth', 'sixths'], 7: ['seventh', 'sevenths'], 8: ['eighth', 'eighths'], 9: ['ninth', 'ninths'],
    10: ['tenth', 'tenths'], 11: ['eleventh', 'elevenths'], 12: ['twelfth', 'twelfths'], 15: ['fifteenth', 'fifteenths'],
    16: ['sixteenth', 'sixteenths'], 20: ['twentieth', 'twentieths'], 24: ['twenty-fourth', 'twenty-fourths'],
    100: ['hundredth', 'hundredths'] };
  OM.fracWords = function (n, d) {
    var w = DEN_WORDS[d];
    if (!w) return n + ' over ' + d;
    return (n === 1 ? 'one ' + w[0] : n + ' ' + w[1]);
  };
  // Stacked fraction HTML. data-say lets the read-aloud voice say "three quarters" rather than "3 slash 4".
  OM.frac = function (n, d, whole) {
    var say = (whole ? whole + ' and ' : '') + OM.fracWords(n, d);
    return '<span class="frac-wrap" data-say="' + say + '">' + (whole ? '<span class="frac-whole">' + whole + '</span>' : '') +
      '<span class="frac"><span class="fn">' + n + '</span><span class="fd">' + d + '</span></span></span>';
  };
  OM.fracText = function (n, d) { return n + '/' + d; };

  // ---------- Parsing what a child types ----------
  // Accepts "4,732", "4 732", "−3", "-3". Returns integer or null.
  OM.parseIntLoose = function (s) {
    if (s === null || s === undefined) return null;
    s = String(s).trim().replace(/[−–—]/g, '-');
    if (!/^-?\d{1,3}([, ]\d{3})*$/.test(s) && !/^-?\d+$/.test(s)) return null;
    return parseInt(s.replace(/[, ]/g, ''), 10);
  };
  // Decimal string -> integer scaled to dp places, or null if it has more places / is invalid. "3.5",2 -> 350
  OM.parseScaled = function (s, dp) {
    if (s === null || s === undefined) return null;
    s = String(s).trim().replace(/[−–—]/g, '-').replace(/,(?=\d{3}(\D|$))/g, '');
    var m = /^(-?)(\d*)(?:\.(\d*))?$/.exec(s);
    if (!m || (m[2] === '' && (m[3] === undefined || m[3] === ''))) return null;
    var frac = m[3] || '';
    if (frac.length > dp) {
      if (/[1-9]/.test(frac.slice(dp))) return null; // extra non-zero places: not equal at this precision
      frac = frac.slice(0, dp);
    }
    while (frac.length < dp) frac += '0';
    var v = parseInt((m[2] || '0') + frac, 10);
    return m[1] ? -v : v;
  };
  OM.decimalPlaces = function (s) { var m = /\.(\d+)/.exec(String(s)); return m ? m[1].length : 0; };

  // ---------- Text to speech friendly ----------
  // Turn question text into words a voice reads the way a maths teacher would say them:
  // 10⁴ "10 to the power 4", x² "x squared", √ "the square root of", 3/8 "three eighths", ≤ "is less than or equal to", £3.50 "3 pounds 50"…
  var SUPS = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', 'ⁿ': 'n' };
  function powerWords(p) { return p === '2' ? ' squared' : p === '3' ? ' cubed' : ' to the power ' + p.replace(/^-/, 'minus '); }
  OM.speakable = function (html) {
    if (!html) return '';
    var s = String(html)
      .replace(/<span class="frac-wrap" data-say="([^"]*)">[\s\S]*?<\/span><\/span><\/span>/g, ' $1 ')
      .replace(/<span class="colvec"[^>]*aria-label="([^"]*)"[\s\S]*?<span class="par">\)<\/span><\/span>/g, ' $1 ')
      .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
      .replace(/<sup>([^<]*)<\/sup>/g, function (m, p) { return powerWords(p); })
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ').replace(/&lt;=?/g, function (m) { return m.length > 4 ? ' is less than or equal to ' : ' is less than '; }).replace(/&gt;=?/g, function (m) { return m.length > 4 ? ' is greater than or equal to ' : ' is greater than '; }).replace(/&amp;/g, ' and ');
    // units with powers first, so "cm³" is not read as "cm cubed"
    s = s.replace(/g\/cm³/g, ' grams per cubic centimetre').replace(/N\/m²/g, ' newtons per square metre').replace(/km\/h/g, ' kilometres per hour').replace(/m\/s\b/g, ' metres per second')
      .replace(/(mm|cm|km|m)³/g, function (m, u) { return ' cubic ' + { mm: 'millimetres', cm: 'centimetres', km: 'kilometres', m: 'metres' }[u]; })
      .replace(/(mm|cm|km|m)²/g, function (m, u) { return ' square ' + { mm: 'millimetres', cm: 'centimetres', km: 'kilometres', m: 'metres' }[u]; });
    // powers written with superscripts (10⁴, x², 10⁻³, aⁿ) or with ^ (1.03^3, x^2)
    s = s.replace(/tan⁻¹/g, ' inverse tan ').replace(/sin⁻¹/g, ' inverse sine ').replace(/cos⁻¹/g, ' inverse cos ')
      .replace(/([A-Za-z0-9)π])([⁻⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ]+)/g, function (m, b, p) { return b + (b === ')' ? ', all' : '') + powerWords(p.split('').map(function (c) { return SUPS[c]; }).join('')); })
      .replace(/\^\(?(-?[\w.]+)\)?/g, function (m, p) { return powerWords(p); });
    // money, percentages, degrees and other units
    s = s.replace(/£(\d[\d,]*)\.(\d\d)\b/g, function (m, a, b) { return a + (a === '1' ? ' pound' : ' pounds') + (b === '00' ? '' : ' ' + b); }).replace(/£(\d[\d,]*)/g, function (m, a) { return a + (a === '1' ? ' pound' : ' pounds'); })
      .replace(/(\d)p\b/g, '$1 pence').replace(/%/g, ' percent').replace(/°C/g, ' degrees Celsius').replace(/°/g, ' degrees')
      .replace(/(\d)\s*cm\b/g, '$1 centimetres').replace(/(\d)\s*mm\b/g, '$1 millimetres').replace(/(\d)\s*km\b/g, '$1 kilometres').replace(/(\d)\s*kg\b/g, '$1 kilograms')
      .replace(/(\d)\s*ml\b/g, '$1 millilitres').replace(/(\d)\s*m\b/g, '$1 metres').replace(/(\d)\s*g\b/g, '$1 grams').replace(/(\d)\s*N\b/g, '$1 newtons');
    // fractions typed with a slash, ratios, functions and trigonometry
    s = s.replace(/(^|[^\d.\/])(\d{1,2})\/(\d{1,2})(?![\d\/])/g, function (m, pre, n, d) { return pre + ' ' + (OM.fracWords ? OM.fracWords(+n, +d) : n + ' over ' + d) + ' '; })
      .replace(/(\d) : (\d)/g, '$1 to $2').replace(/\b([fg])\(([^)]*)\)/g, '$1 of $2')
      .replace(/\bsin\b/g, 'sine').replace(/\bcos\b/g, 'cosine').replace(/\btan\b/g, 'tan');
    // symbols
    s = s.replace(/√\(/g, ' the square root of (').replace(/√/g, ' the square root of ').replace(/∛/g, ' the cube root of ')
      .replace(/≤/g, ' is less than or equal to ').replace(/≥/g, ' is greater than or equal to ').replace(/≠/g, ' is not equal to ').replace(/≡/g, ' is identical to ')
      .replace(/</g, ' is less than ').replace(/>/g, ' is greater than ').replace(/±/g, ' plus or minus ').replace(/π/g, ' pi ').replace(/θ/g, ' theta ')
      .replace(/∪/g, ' union ').replace(/∩/g, ' intersection ').replace(/ξ/g, ' the universal set ').replace(/→/g, ' gives ').replace(/…/g, ', ')
      .replace(/½/g, ' a half').replace(/¼/g, ' a quarter').replace(/¾/g, ' three quarters').replace(/⅓/g, ' a third').replace(/⅔/g, ' two thirds').replace(/⁴⁄₃/g, ' four thirds')
      .replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ').replace(/(^|[\s(=,])-(?=\d)/g, '$1 minus ').replace(/\s\+\s/g, ' plus ').replace(/=/g, ' equals ')
      .replace(/_{2,}/g, ' blank ').replace(/\?{1}(?=\s*$)/, '?')
      .replace(/\s+/g, ' ').replace(/\s([,.?!;:])/g, '$1').trim();
    return s;
  };

  // ---------- Names and contexts for word problems ----------
  OM.NAMES = ['Amara', 'Ben', 'Chloe', 'Dev', 'Ella', 'Finn', 'Grace', 'Harry', 'Isla', 'Jay', 'Kai', 'Leah', 'Mo', 'Noor',
    'Oli', 'Priya', 'Ruby', 'Sam', 'Tom', 'Zara', 'Aisha', 'Leo', 'Maya', 'Ravi', 'Sofia', 'Theo', 'Yusuf', 'Evie'];
  OM.ITEMS = ['acorns', 'pine cones', 'conkers', 'berries', 'leaves', 'feathers', 'pebbles', 'stickers', 'marbles', 'shells'];

  // ---------- Generator registry ----------
  OM.gens = {};
  OM.registerGen = function (g) {
    if (!g.levels) g.levels = [1, 2, 3];
    OM.gens[g.id] = g;
  };
  // What makes two questions "the same" to a child: the same wording, picture and answer (as seen: the numbered ids
  // inside pictures, e.g. a stripe pattern "st12", are ignored, so two identical-looking pictures count as the same).
  function seenAs(s) { return String(s).replace(/(id=\\?"|url\(#|href=\\?"#)([A-Za-z_-]*)\d+/g, '$1$2'); }
  // Multiple-choice options count in any order (the same options reshuffled are still the same question), without their A–E letters.
  OM.qKey = function (q) {
    var opts = ((q.input && (q.input.options || q.input.items)) || []).map(function (o) { return seenAs(String(typeof o === 'object' ? o.label : o).replace(/<b>[A-E]<\/b>/g, '')); }).sort();
    return seenAs(String(q.prompt).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() + '|' + (q.input && q.input.template || '') + '|' + (q.visual || '') + '|' + opts.join('¦'));
  };
  // A question not already in `seen` (a round, quiz, test or paper), so a sequence NEVER repeats a question. Small topics
  // can run out at one level, so the nearest other levels are tried next; if every level is used up it returns null
  // and the caller picks another topic or ends the round early, rather than show a repeat.
  OM.generateFresh = function (genId, level, rng, seen) {
    var g = OM.gens[genId], levels = [level].concat((g ? g.levels : []).filter(function (L) { return L !== level; }).sort(function (a, b) { return Math.abs(a - level) - Math.abs(b - level) || b - a; }));
    for (var li = 0; li < levels.length; li++) {
      for (var tries = 0; tries < 80; tries++) {
        var q = OM.generate(genId, levels[li], rng.int(1, 2147483646)), k = OM.qKey(q);
        if (!seen[k]) { seen[k] = 1; return q; }
      }
    }
    return null;
  };
  // a fresh question from any of a topic's generators (starting with a random one), or null when the topic is used up
  OM.freshFromObjective = function (o, level, rng, seen) {
    var gens = rng.shuffle(o.gens.slice());
    for (var i = 0; i < gens.length; i++) { var q = OM.generateFresh(gens[i], level, rng, seen); if (q) return q; }
    return null;
  };
  OM.generate = function (genId, level, seed) {
    var g = OM.gens[genId];
    if (!g) throw new Error('Unknown generator ' + genId);
    if (g.levels.indexOf(level) < 0) level = g.levels[Math.min(g.levels.length - 1, Math.max(0, level - 1))];
    seed = seed || OM.newSeed();
    var q = g.make(OM.makeRng(seed), level);
    q.gen = genId; q.level = level; q.seed = seed;
    q.objective = q.objective || g.objective;
    q.marks = q.marks || 1;
    q.solution = q.solution || [];
    q.accept = q.accept || []; q.reject = q.reject || [];
    if (!q.answerText && OM.answerTextFor) q.answerText = OM.answerTextFor(q.check);
    return q;
  };

  OM.esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
})(typeof window !== 'undefined' ? window : globalThis);
