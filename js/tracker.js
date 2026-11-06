/* Mayes Maths & More — improvement tracker for the grown-ups' area.
   Every first-attempt answer is logged against the child's own calendar day (p.log), with the level it was at,
   the topic, any star it earned and the time spent. OM.improvement() turns that log (and the tests list) into
   daily and weekly figures, week-on-week changes and the topics that improved or need more practice.
   OM.trackerHTML() draws it. The maths is plain functions so the checker can test it. */
(function (G) {
  'use strict';
  var OM = G.OM;
  var GAP = 5 * 60000; // answers more than 5 minutes apart start a new sitting, so time away is not counted

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  // the child's local calendar day, e.g. 2026-10-30
  OM.dayKey = function (d) { d = d ? new Date(d) : new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  function fromKey(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(k, n) { var d = fromKey(k); d.setDate(d.getDate() + n); return OM.dayKey(d); }
  // weeks start on Monday, as in UK schools
  function mondayOf(k) { var d = fromKey(k), wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return OM.dayKey(d); }

  // called by the store for every first-attempt answer
  OM.logAnswer = function (p, objId, level, correct, starsBefore, starsAfter, now) {
    now = now || Date.now();
    var k = OM.dayKey(now), log = p.log = p.log || {}, d = log[k] = log[k] || { a: 0, c: 0, L: { 1: [0, 0], 2: [0, 0], 3: [0, 0] }, o: {}, g: 0, gs: {}, ms: 0, t: 0 };
    d.a++; if (correct) d.c++;
    var lv = d.L[level] || (d.L[level] = [0, 0]); lv[0]++; if (correct) lv[1]++;
    var ob = d.o[objId] || (d.o[objId] = [0, 0]); ob[0]++; if (correct) ob[1]++;
    if (starsAfter > starsBefore) { d.g += starsAfter - starsBefore; d.gs[objId] = starsAfter; }
    if (d.t && now - d.t < GAP) d.ms += now - d.t;
    d.t = now;
  };

  function blank() { return { a: 0, c: 0, hard: 0, g: 0, ms: 0, days: 0, topics: {}, tests: [], o: {}, gs: {} }; }
  function addDay(s, d, tests) {
    if (d) {
      s.a += d.a; s.c += d.c; s.hard += (d.L[2] ? d.L[2][0] : 0) + (d.L[3] ? d.L[3][0] : 0); s.g += d.g; s.ms += d.ms;
      Object.keys(d.o).forEach(function (id) { var x = s.o[id] || (s.o[id] = [0, 0]); x[0] += d.o[id][0]; x[1] += d.o[id][1]; s.topics[id] = 1; });
      Object.keys(d.gs).forEach(function (id) { s.gs[id] = d.gs[id]; });
    }
    if (tests) s.tests = s.tests.concat(tests);
    if ((d && d.a) || (tests && tests.length)) s.days++;
    return s;
  }
  function finish(s) {
    s.acc = s.a ? Math.round(100 * s.c / s.a) : null;
    s.hardPct = s.a ? Math.round(100 * s.hard / s.a) : null;
    s.mins = Math.round(s.ms / 60000);
    s.topicN = Object.keys(s.topics).length;
    s.testAvg = s.tests.length ? Math.round(s.tests.reduce(function (x, t) { return x + t; }, 0) / s.tests.length) : null;
    return s;
  }

  // everything the tracker shows, worked out from the log; `today` can be given for testing
  OM.improvement = function (p, today, starsNow) {
    today = today || OM.dayKey();
    var log = p.log || {}, testsByDay = {};
    (p.tests || []).forEach(function (t) { var k = OM.dayKey(t.date); (testsByDay[k] = testsByDay[k] || []).push(Math.round(100 * t.score / t.max)); });
    var day = function (k) { return finish(addDay(blank(), log[k], testsByDay[k])); };
    var range = function (from, n) { var s = blank(); for (var i = 0; i < n; i++) { var k = addDays(from, i); if (k > today) break; addDay(s, log[k], testsByDay[k]); } return finish(s); };
    var daily = []; for (var i = 13; i >= 0; i--) { var k = addDays(today, -i); var d = day(k); d.key = k; daily.push(d); }
    var thisMon = mondayOf(today), weeks = [];
    for (var w = 7; w >= 0; w--) { var m = addDays(thisMon, -7 * w), ws = range(m, 7); ws.start = m; ws.current = w === 0; weeks.push(ws); }
    // stars held at the end of each week: today's total, less the stars earned after that week
    if (starsNow !== undefined) { var later = 0; for (var j = weeks.length - 1; j >= 0; j--) { weeks[j].starsEnd = starsNow - later; later += weeks[j].g; } }
    var thisWeek = weeks[weeks.length - 1], lastWeek = weeks[weeks.length - 2];
    // last week compared over the same number of days so far, so a Tuesday is not judged against a whole week
    var sofar = Math.round((fromKey(today) - fromKey(thisMon)) / 86400000) + 1, lastSoFar = range(addDays(thisMon, -7), sofar);
    // topics: accuracy this week against everything before it (at least 4 answers on each side)
    var before = blank(); Object.keys(log).forEach(function (k) { if (k < thisMon) addDay(before, log[k]); });
    var improved = [], weak = [];
    Object.keys(thisWeek.o).forEach(function (id) {
      var n = thisWeek.o[id], b = before.o[id], acc = Math.round(100 * n[1] / n[0]);
      if (n[0] >= 4 && b && b[0] >= 4) { var was = Math.round(100 * b[1] / b[0]); if (acc - was >= 10) improved.push({ id: id, from: was, to: acc }); }
      if (n[0] >= 4 && acc < 60) weak.push({ id: id, acc: acc, n: n[0] });
    });
    improved.sort(function (x, y) { return (y.to - y.from) - (x.to - x.from); });
    weak.sort(function (x, y) { return x.acc - y.acc; });
    var newStars = Object.keys(thisWeek.gs).map(function (id) { return { id: id, stars: thisWeek.gs[id] }; });
    return { today: today, daily: daily, weeks: weeks, thisWeek: thisWeek, lastWeek: lastWeek, lastSoFar: lastSoFar, sofar: sofar, improved: improved.slice(0, 6), weak: weak.slice(0, 6), newStars: newStars, logged: Object.keys(log).length > 0, since: Object.keys(log).sort()[0] };
  };

  // ---------- drawing (browser only) ----------
  var INK = '#2d2a26', MUTED = '#6b645b', GRID = '#e6e0d6', BAR = '#0f9a87', SURF = '#fff';
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function shortDate(k) { var d = fromKey(k); return d.getDate() + ' ' + MONTHS[d.getMonth()]; }
  function phone() { return typeof innerWidth === 'number' && innerWidth <= 700; } // charts are drawn narrower to fit, so the words stay readable
  function niceMax(v) { if (v <= 5) return 5; var p = Math.pow(10, Math.floor(Math.log10(v))), m = v / p; return (m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; }

  // one series, one hue; every bar has its own hover tooltip (a bigger invisible hit area) and the numbers are also in a table
  function barChart(items, o) {
    var W = phone() ? 360 : 680, H = 190, L = 40, R = 10, T = 14, B = 34, n = items.length, max = niceMax(Math.max.apply(null, items.map(function (x) { return x.v || 0; }).concat([o.min || 1]))),
      bw = (W - L - R) / n, b = '';
    [0, 0.5, 1].forEach(function (f) { var y = T + (H - T - B) * (1 - f); b += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '" stroke="' + GRID + '" stroke-width="1"/><text x="' + (L - 6) + '" y="' + (y + 4) + '" font-size="11" text-anchor="end" fill="' + MUTED + '">' + (o.fmt ? o.fmt(max * f) : Math.round(max * f)) + '</text>'; });
    items.forEach(function (x, i) {
      var cx = L + bw * i + bw / 2, h = x.v ? (H - T - B) * x.v / max : 0, w = Math.min(28, bw * 0.62), y = H - B - h;
      if (h > 0) { var r = Math.min(4, h / 2, w / 2); b += '<path d="M' + (cx - w / 2) + ' ' + (H - B) + 'V' + (y + r) + 'Q' + (cx - w / 2) + ' ' + y + ' ' + (cx - w / 2 + r) + ' ' + y + 'H' + (cx + w / 2 - r) + 'Q' + (cx + w / 2) + ' ' + y + ' ' + (cx + w / 2) + ' ' + (y + r) + 'V' + (H - B) + 'Z" fill="' + BAR + '"/>'; }
      if (x.lab) b += '<text x="' + cx + '" y="' + (H - B + 15) + '" font-size="11" text-anchor="middle" fill="' + (x.strong ? INK : MUTED) + '"' + (x.strong ? ' font-weight="700"' : '') + '>' + esc(x.lab) + '</text>';
      if (x.lab2) b += '<text x="' + cx + '" y="' + (H - B + 28) + '" font-size="10" text-anchor="middle" fill="' + MUTED + '">' + esc(x.lab2) + '</text>';
      b += '<rect class="hit" x="' + (L + bw * i) + '" y="' + T + '" width="' + bw + '" height="' + (H - T - B) + '" fill="transparent" data-tip="' + esc(x.tip) + '"/>';
    });
    b += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + (H - B) + '" y2="' + (H - B) + '" stroke="' + MUTED + '" stroke-width="1"/>';
    return '<figure class="tchart"><figcaption>' + o.title + '</figcaption><div class="tplot"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.title) + '">' + b + '</svg><div class="ttip" hidden></div></div></figure>';
  }
  // a percentage over time: 2px line through the days that have data, with 8px markers; 0–100% axis
  function lineChart(items, o) {
    var W = phone() ? 360 : 680, H = 170, L = 40, R = 10, T = 14, B = 34, n = items.length, bw = (W - L - R) / n, b = '', pts = [], segs = [[]];
    [0, 50, 100].forEach(function (v) { var y = T + (H - T - B) * (1 - v / 100); b += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '" stroke="' + GRID + '" stroke-width="1"/><text x="' + (L - 6) + '" y="' + (y + 4) + '" font-size="11" text-anchor="end" fill="' + MUTED + '">' + v + '%</text>'; });
    items.forEach(function (x, i) {
      var cx = L + bw * i + bw / 2;
      // the line breaks where there was no practice, rather than joining across the gap
      if (x.v !== null) { var pt = [cx, T + (H - T - B) * (1 - x.v / 100)]; pts.push(pt); segs[segs.length - 1].push(pt); } else if (segs[segs.length - 1].length) segs.push([]);
      if (x.lab) b += '<text x="' + cx + '" y="' + (H - B + 15) + '" font-size="11" text-anchor="middle" fill="' + (x.strong ? INK : MUTED) + '"' + (x.strong ? ' font-weight="700"' : '') + '>' + esc(x.lab) + '</text>';
      if (x.lab2) b += '<text x="' + cx + '" y="' + (H - B + 28) + '" font-size="10" text-anchor="middle" fill="' + MUTED + '">' + esc(x.lab2) + '</text>';
    });
    segs.forEach(function (sg) { if (sg.length > 1) b += '<polyline points="' + sg.map(function (q) { return q.join(','); }).join(' ') + '" fill="none" stroke="' + BAR + '" stroke-width="2" stroke-linejoin="round"/>'; });
    pts.forEach(function (q) { b += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="4.5" fill="' + BAR + '" stroke="' + SURF + '" stroke-width="2"/>'; });
    items.forEach(function (x, i) { b += '<rect class="hit" x="' + (L + bw * i) + '" y="' + T + '" width="' + bw + '" height="' + (H - T - B) + '" fill="transparent" data-tip="' + esc(x.tip) + '"/>'; });
    b += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + (H - B) + '" y2="' + (H - B) + '" stroke="' + MUTED + '" stroke-width="1"/>';
    return '<figure class="tchart"><figcaption>' + o.title + '</figcaption><div class="tplot"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.title) + '">' + b + '</svg><div class="ttip" hidden></div></div></figure>';
  }

  // a this-week figure with its change on last week (over the same days so far): an arrow AND words, never colour alone
  function tile(label, now, was, unit, better) {
    var txt = now === null ? '–' : now + (unit || ''), ch = '';
    if (now !== null && was !== null && was !== undefined) {
      var d = now - was, up = d > 0, good = better === 'down' ? d < 0 : d > 0;
      ch = d === 0 ? '<span class="tch same">= same as last week</span>' : '<span class="tch ' + (good ? 'good' : 'bad') + '">' + (up ? '▲ up ' : '▼ down ') + Math.abs(d) + (unit === '%' ? ' points' : unit || '') + '</span>';
    } else if (now !== null && (was === null || was === undefined)) ch = '<span class="tch same">nothing to compare yet</span>';
    return '<div class="ttile"><span class="tlab">' + label + '</span><b>' + txt + '</b>' + ch + '</div>';
  }
  function name(id) { var o = OM.objectiveIndex[id]; return '<span class="tn">' + (o ? esc(o.title) + (o.year && o.year !== 'TR' && o.year !== 'XP' ? ' <small>(Year ' + o.year + ')</small>' : '') : esc(id)) + '</span>'; }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }

  OM.trackerHTML = function (p, starsNow) {
    var im = OM.improvement(p, undefined, starsNow), tw = im.thisWeek, ls = im.lastSoFar, nm = esc(p.name);
    if (!im.logged && !(p.tests || []).length) return '<div class="card"><p>The improvement tracker starts counting from ' + nm + '’s next answer. Come back after a few days of practice to see daily and weekly changes.</p></div>';
    // a plain-English summary first
    var parts = [];
    if (tw.a) parts.push(nm + ' has answered <b>' + plural(tw.a, 'question') + '</b> this week' + (ls.a ? ' (' + (tw.a >= ls.a ? tw.a - ls.a + ' more' : ls.a - tw.a + ' fewer') + ' than by this point last week)' : '') + ', getting <b>' + tw.acc + '%</b> right first time' + (ls.acc !== null ? ' (' + (tw.acc === ls.acc ? 'the same as' : Math.abs(tw.acc - ls.acc) + ' points ' + (tw.acc > ls.acc ? 'better than' : 'lower than')) + ' last week)' : '') + '.');
    else parts.push(nm + ' has not practised yet this week.' + (im.lastWeek.a ? ' Last week: ' + plural(im.lastWeek.a, 'question') + ', ' + im.lastWeek.acc + '% right first time.' : ''));
    if (tw.g) parts.push('They earned <b>' + plural(tw.g, 'new star') + '</b>.');
    if (tw.a && tw.hardPct !== null) parts.push(tw.hardPct + '% of answers were at the Expected or Greater depth level.');
    if (im.improved.length) parts.push('Most improved: ' + OM.objectiveIndex[im.improved[0].id].title + ' (' + im.improved[0].from + '% → ' + im.improved[0].to + '%).');
    var h = '<div class="card tsum"><h3>This week so far <small>(Monday to today, compared with the same ' + plural(im.sofar, 'day') + ' last week)</small></h3><p>' + parts.join(' ') + '</p>' +
      '<div class="ttiles">' + tile('Questions answered', tw.a, ls.a) + tile('Right first time', tw.acc, ls.acc, '%') + tile('At harder levels', tw.hardPct, ls.hardPct, '%') + tile('New stars', tw.g, ls.g) +
      tile('Days practised', tw.days, ls.days) + tile('Minutes practising', tw.mins, ls.mins) + tile('Topics practised', tw.topicN, ls.topicN) + tile('Test average', tw.testAvg, ls.testAvg, '%') + '</div></div>';
    // daily: last 14 days
    var dItems = im.daily.map(function (d) { var dt = fromKey(d.key); return { lab: phone() ? DAYS[dt.getDay()].charAt(0) : DAYS[dt.getDay()], lab2: dt.getDate() + '', strong: d.key === im.today, d: d }; });
    h += '<div class="card"><h3>Day by day <small>(last 14 days)</small></h3>' +
      barChart(dItems.map(function (x) { return Object.assign({ v: x.d.a, tip: shortDate(x.d.key) + ': ' + plural(x.d.a, 'question') + (x.d.a ? ', ' + x.d.c + ' right first time' : '') + (x.d.mins ? ', ' + x.d.mins + ' min' : '') }, x); }), { title: 'Questions answered each day' }) +
      lineChart(dItems.map(function (x) { return Object.assign({ v: x.d.acc, tip: shortDate(x.d.key) + ': ' + (x.d.acc === null ? 'no practice' : x.d.acc + '% right first time (' + x.d.c + ' of ' + x.d.a + ')') }, x); }), { title: 'Right first time each day (%)' }) +
      '<details class="tdata"><summary>Show the numbers</summary><table class="data-table"><thead><tr><th>Day</th><th>Questions</th><th>Right first time</th><th>At harder levels</th><th>New stars</th><th>Minutes</th><th>Tests</th></tr></thead><tbody>' +
      im.daily.slice().reverse().map(function (d) { var dt = fromKey(d.key); return '<tr><td>' + DAYS[dt.getDay()] + ' ' + shortDate(d.key) + '</td><td>' + d.a + '</td><td>' + (d.acc === null ? '–' : d.acc + '%') + '</td><td>' + (d.hardPct === null ? '–' : d.hardPct + '%') + '</td><td>' + d.g + '</td><td>' + d.mins + '</td><td>' + (d.tests.length ? d.tests.map(function (t) { return t + '%'; }).join(', ') : '–') + '</td></tr>'; }).join('') + '</tbody></table></details></div>';
    // weekly: last 8 weeks
    var wItems = im.weeks.map(function (w) { return { lab: shortDate(w.start), lab2: w.current ? 'this week' : '', strong: w.current, w: w }; });
    h += '<div class="card"><h3>Week by week <small>(weeks start on Monday)</small></h3>' +
      lineChart(wItems.map(function (x) { return Object.assign({ v: x.w.acc, tip: 'Week of ' + shortDate(x.w.start) + ': ' + (x.w.acc === null ? 'no practice' : x.w.acc + '% right first time over ' + plural(x.w.a, 'question')) }, x); }), { title: 'Right first time each week (%)' }) +
      barChart(wItems.map(function (x) { return Object.assign({ v: x.w.g, tip: 'Week of ' + shortDate(x.w.start) + ': ' + plural(x.w.g, 'new star') + (x.w.starsEnd !== undefined ? ' (' + x.w.starsEnd + ' stars in total by the end of the week)' : '') }, x); }), { title: 'New stars earned each week' }) +
      '<details class="tdata"><summary>Show the numbers</summary><table class="data-table"><thead><tr><th>Week of</th><th>Days</th><th>Questions</th><th>Right first time</th><th>At harder levels</th><th>New stars</th><th>Stars in total</th><th>Minutes</th><th>Test average</th></tr></thead><tbody>' +
      im.weeks.slice().reverse().map(function (w) { return '<tr><td>' + shortDate(w.start) + (w.current ? ' (this week)' : '') + '</td><td>' + w.days + '</td><td>' + w.a + '</td><td>' + (w.acc === null ? '–' : w.acc + '%') + '</td><td>' + (w.hardPct === null ? '–' : w.hardPct + '%') + '</td><td>' + w.g + '</td><td>' + (w.starsEnd === undefined ? '–' : w.starsEnd) + '</td><td>' + w.mins + '</td><td>' + (w.testAvg === null ? '–' : w.testAvg + '%') + '</td></tr>'; }).join('') + '</tbody></table></details></div>';
    // topics
    h += '<div class="tgrid"><div class="card"><h3>' + OM.icon('check', { size: 20 }) + ' Improved this week</h3>' + (im.improved.length ? '<ul class="tlist2">' + im.improved.map(function (x) { return '<li>' + name(x.id) + '<span class="tch good">' + x.from + '% → ' + x.to + '%</span></li>'; }).join('') + '</ul>' : '<p class="muted">Topics show here when this week’s accuracy beats the earlier weeks by 10 points or more (at least 4 answers in each).</p>') + '</div>' +
      '<div class="card"><h3>' + OM.starIcon(true, 20) + ' New stars this week</h3>' + (im.newStars.length ? '<ul class="tlist2">' + im.newStars.map(function (x) { return '<li>' + name(x.id) + '<span class="tch good">' + x.stars + ' of 3 stars</span></li>'; }).join('') + '</ul>' : '<p class="muted">No new stars yet this week.</p>') + '</div>' +
      '<div class="card"><h3>' + OM.icon('bulb', { size: 20 }) + ' Worth more practice</h3>' + (im.weak.length ? '<ul class="tlist2">' + im.weak.map(function (x) { return '<li>' + name(x.id) + '<span class="tch bad">' + x.acc + '% of ' + x.n + '</span></li>'; }).join('') + '</ul>' : '<p class="muted">Nothing below 60% this week. Well done!</p>') + '</div></div>';
    h += '<p class="muted small-note">“Right first time” counts first attempts only, so fixing a mistake on the second try is not counted as right. “At harder levels” is the share of answers at the Expected or Greater depth level. Time counts only while answering: a gap of more than 5 minutes starts a new sitting.' + (im.since ? ' Tracking started on ' + shortDate(im.since) + '.' : '') + '</p>';
    return h;
  };
  // hover tooltips for the charts on the page
  OM.bindTrackerTips = function (root) {
    root.querySelectorAll('.tplot').forEach(function (pl) {
      var tip = pl.querySelector('.ttip');
      pl.querySelectorAll('.hit').forEach(function (r) {
        var showTip = function () { var box = pl.getBoundingClientRect(), rb = r.getBoundingClientRect(); tip.textContent = r.getAttribute('data-tip'); tip.hidden = false; var x = rb.left - box.left + rb.width / 2, half = Math.min(tip.offsetWidth / 2, box.width / 2); tip.style.left = Math.max(half, Math.min(box.width - half, x)) + 'px'; pl.querySelectorAll('.hit.on').forEach(function (e) { e.classList.remove('on'); }); r.classList.add('on'); };
        r.addEventListener('mouseenter', showTip); r.addEventListener('focus', showTip);
        r.addEventListener('mouseleave', function () { tip.hidden = true; r.classList.remove('on'); });
      });
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
