/* Learn with Pip — saving profiles and progress on this device (no internet, no accounts). */
(function (G) {
  'use strict';
  var OM = G.OM, KEY = 'owlmaths.v1';
  var blank = function () { return { profiles: [], settings: { pin: null, readAloud: 'auto', rate: 0.95, keypad: 'auto', sounds: true, muted: false, voice: null, motion: 'on', paperTimers: true, backupEvery: 'monthly' }, reports: [] }; };
  var data = blank();
  try { var raw = G.localStorage && G.localStorage.getItem(KEY); if (raw) data = Object.assign(blank(), JSON.parse(raw)); } catch (e) { /* private window or blocked storage: run without saving */ }
  data.settings = Object.assign(blank().settings, data.settings || {});
  // animations are on unless a grown-up has chosen otherwise (earlier versions followed the device setting by default)
  if (!data.settings.motionChosen) data.settings.motion = 'on';
  // Pip's natural voice has gone: anyone who had it goes back to the device's own voice
  var noNatural = function (o) { if (o && typeof o.voice === 'string' && o.voice.indexOf('pip:') === 0) o.voice = null; };
  noNatural(data.settings); data.profiles.forEach(noNatural);
  // the text style used to be one setting for everyone: each child keeps what was chosen
  if (data.settings.font) { if (data.settings.font === 'dyslexia') data.profiles.forEach(function (q) { if (!q.font) q.font = 'dyslexia'; }); delete data.settings.font; }

  // ---------- checking a child's record that came from another device ----------
  // A file or set of QR codes could have been edited by hand, so the record is rebuilt from scratch: only the parts the
  // app uses are kept, each one checked for its type and range. Text is shortened and loses < > " `; ids, years and
  // choices must be ones the app knows; numbers must be numbers. This stops a crafted file from putting code into the
  // page or breaking the app, whatever it contains.
  var DAY = /^\d{4}-\d{2}-\d{2}$/, IDKEY = /^[\w:.+\-]{1,60}$/, own = Object.prototype.hasOwnProperty;
  function txt(v, max) { return typeof v === 'string' ? v.replace(/[<>"`\u0000-\u001f\u007f]/g, '').trim().slice(0, max) : ''; }
  function num(v, lo, hi, d) { v = Number(v); return typeof v === 'number' && isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; }
  function int(v, lo, hi, d) { var n = num(v, lo, hi, d); return n === null || n === undefined ? n : Math.round(n); }
  function key(v) { return typeof v === 'string' && IDKEY.test(v) && v !== '__proto__' && v !== 'constructor' && v !== 'prototype'; }
  function keys(o) { return o && typeof o === 'object' && !Array.isArray(o) ? Object.keys(o).filter(key) : []; }
  function list(a, max) { return Array.isArray(a) ? a.slice(-max) : []; }
  function pick(v, ok, d) { return ok(v) ? v : d; }
  function cleanChild(c) {
    var o = {}, OMx = G.OM || {};
    o.id = pick(c.id, function (v) { return typeof v === 'string' && /^[a-z0-9]{1,40}$/i.test(v); }, null) || newId();
    o.name = txt(c.name, 30) || 'Explorer';
    o.year = int(c.year, 1, 11, 4);
    o.owlName = txt(c.owlName, 20) || 'Pip';
    o.colour = OMx.OWL_COLOURS && own.call(OMx.OWL_COLOURS, c.colour) ? c.colour : 'brown';
    o.avatar = (OMx.AVATARS || []).some(function (a) { return a.id === c.avatar; }) ? c.avatar : 'otter';
    o.baddie = OMx.BADDIES && own.call(OMx.BADDIES, c.baddie) ? c.baddie : 'cat';
    if ((OMx.TIERS || []).some(function (t) { return t.id === c.look; })) o.look = c.look;
    if (c.tier === 'foundation' || c.tier === 'higher') o.tier = c.tier;
    if ((OMx.EXAM_BOARDS || []).some(function (b) { return b.id === c.board; })) o.board = c.board;
    if (typeof c.voice === 'string' && /^[\w:.\-+ ()]{1,100}$/.test(c.voice) && c.voice.indexOf('pip:') !== 0) o.voice = c.voice;
    if (c.rate !== undefined) o.rate = num(c.rate, 0.5, 2, 0.95);
    if (/^\d{3}$/.test(String(c.code))) o.code = String(c.code);
    if (typeof c.codeOn === 'boolean') o.codeOn = c.codeOn;
    if (c.font === 'dyslexia') o.font = 'dyslexia';
    if (c.limits && OMx.playtime) o.limits = OMx.playtime.clean(c.limits);
    ['feathers', 'acorns', 'fixIts'].forEach(function (k) { o[k] = int(c[k], 0, 1e7, 0); });
    ['introSeen', 'escaped'].forEach(function (k) { o[k] = !!c[k]; });
    o.created = num(c.created, 0, 4e12, Date.now());
    if (typeof c.lastBonus === 'string' && DAY.test(c.lastBonus)) o.lastBonus = c.lastBonus;
    // outfits: ids like "hat:beanie:red", worn as { slot: "beanie:red" }
    o.owned = list(c.owned, 600).filter(key);
    o.wearing = {};
    keys(c.wearing).forEach(function (s) { if (c.wearing[s] === null || key(c.wearing[s])) o.wearing[s] = c.wearing[s]; });
    // progress on each topic the app knows
    o.progress = {};
    keys(c.progress).forEach(function (k) {
      var p = c.progress[k]; if (!p || typeof p !== 'object' || (OMx.objectiveIndex && !OMx.objectiveIndex[k])) return;
      var q = { level: int(p.level, 1, 3, 1), last: num(p.last, 0, 4e12, 0), lv: {} };
      [1, 2, 3].forEach(function (L) { var l = p.lv && p.lv[L] || {}; q.lv[L] = { c: int(l.c, 0, 1e6, 0), a: int(l.a, 0, 1e6, 0), recent: list(l.recent, 10).map(function (x) { return x ? 1 : 0; }) }; q.lv[L].c = Math.min(q.lv[L].c, q.lv[L].a); });
      o.progress[k] = q;
    });
    // the improvement tracker's day-by-day log (js/tracker.js): numbers only
    o.log = {};
    keys(c.log).filter(function (d) { return DAY.test(d); }).slice(-2000).forEach(function (d) {
      var e = c.log[d]; if (!e || typeof e !== 'object') return;
      var pair = function (v) { return Array.isArray(v) ? [int(v[0], 0, 1e6, 0), int(v[1], 0, 1e6, 0)] : [0, 0]; };
      var x = { a: int(e.a, 0, 1e6, 0), c: int(e.c, 0, 1e6, 0), g: int(e.g, 0, 1e5, 0), ms: num(e.ms, 0, 864e5, 0), t: num(e.t, 0, 4e12, 0), L: {}, o: {}, gs: {} };
      [1, 2, 3].forEach(function (L) { x.L[L] = pair(e.L && e.L[L]); });
      keys(e.o).slice(0, 500).forEach(function (k) { x.o[k] = pair(e.o[k]); });
      keys(e.gs).slice(0, 500).forEach(function (k) { x.gs[k] = int(e.gs[k], 0, 3, 0); });
      o.log[d] = x;
    });
    var kinds = ['guard', 'quiz', 'paper', 'tricks', 'eleven'];
    o.tests = list(c.tests, 2000).filter(function (t) { return t && typeof t === 'object' && kinds.indexOf(t.kind) >= 0; }).map(function (t) {
      var x = { date: num(t.date, 0, 4e12, 0), year: int(t.year, 1, 11, o.year), kind: t.kind, score: num(t.score, 0, 1000, 0), max: num(t.max, 1, 1000, 1) };
      ['paper', 'region', 'id', 'track'].forEach(function (k) { if (key(t[k])) x[k] = t[k]; });
      return x;
    });
    o.mtc = list(c.mtc, 2000).filter(function (t) { return t && typeof t === 'object'; }).map(function (t) { return { date: num(t.date, 0, 4e12, 0), year: int(t.year, 1, 11, 4), score: int(t.score, 0, 25, 0) }; });
    o.days = list(c.days, 4000).filter(function (d) { return typeof d === 'string' && DAY.test(d); });
    ['guards', 'papers', 'escapedYears'].forEach(function (k) { o[k] = {}; keys(c[k]).forEach(function (g) { if (c[k][g] === true) o[k][g] = true; }); });
    // left out when missing, so an older file's totals are worked out by Store.ledger
    if (c.earned && typeof c.earned === 'object') { o.earned = {}; keys(c.earned).filter(function (y) { return /^([1-9]|1[01])$/.test(y); }).forEach(function (y) { var e = c.earned[y] || {}; o.earned[y] = { f: int(e.f, 0, 1e7, 0), a: int(e.a, 0, 1e7, 0) }; }); }
    o.finished = {};
    keys(c.finished).filter(function (y) { return /^([1-9]|1[01])$/.test(y); }).forEach(function (y) {
      var e = c.finished[y] || {}, x = {}; if (typeof e.d === 'string' && DAY.test(e.d)) x.d = e.d; if (OMx.BADDIES && own.call(OMx.BADDIES, e.b)) x.b = e.b; o.finished[y] = x;
    });
    return o;
  }
  // every explorer gets a different id, even two added in the same millisecond
  function newId() { var id; do { id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); } while (data.profiles.some(function (q) { return q.id === id; })); return id; }
  // repair any explorers saved with the same id by an earlier version
  (function () { var seen = {}; data.profiles.forEach(function (q) { if (seen[q.id]) q.id = newId(); seen[q.id] = 1; }); })();
  var Store = OM.Store = {
    data: data,
    save: function () { try { G.localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch (e) { return false; } },
    settings: function () { return data.settings; },
    profiles: function () { return data.profiles; },
    get: function (id) { return data.profiles.filter(function (p) { return p.id === id; })[0]; },
    addProfile: function (name, year, owlName, colour) {
      var p = { id: newId(), name: name, year: year, owlName: owlName || 'Pip', colour: colour || 'brown', feathers: 0, acorns: 5,
        owned: [], wearing: {}, progress: {}, tests: [], guards: {}, mtc: [], days: [], fixIts: 0, introSeen: false, escaped: false, created: Date.now() };
      // every new child starts with a daily play time limit, which a grown-up can change or switch off
      if (OM.playtime) p.limits = OM.playtime.clean(OM.playtime.START);
      data.profiles.push(p); Store.save(); return p;
    },
    removeProfile: function (id) { data.profiles = data.profiles.filter(function (p) { return p.id !== id; }); Store.save(); },
    objProgress: function (p, objId) {
      var o = p.progress[objId];
      if (!o) o = p.progress[objId] = { lv: { 1: { c: 0, a: 0, recent: [] }, 2: { c: 0, a: 0, recent: [] }, 3: { c: 0, a: 0, recent: [] } }, level: 1, last: 0 };
      return o;
    },
    record: function (p, objId, level, correct) {
      var o = Store.objProgress(p, objId), l = o.lv[level], starsBefore = Store.stars(p, objId);
      l.a++; if (correct) l.c++;
      l.recent.push(correct ? 1 : 0); if (l.recent.length > 10) l.recent.shift();
      o.last = Date.now();
      var today = new Date().toISOString().slice(0, 10);
      if (p.days.indexOf(today) < 0) p.days.push(today);
      // the grown-ups' improvement tracker keeps a day-by-day log (js/tracker.js)
      if (OM.logAnswer) OM.logAnswer(p, objId, level, correct, starsBefore, Store.stars(p, objId));
      Store.save();
    },
    // A star for each level: at least 5 correct and at least 70% of the recent answers right, at that level OR HARDER.
    // Children move up a level after 3 right in a row, so strong answers at a harder level also prove the easier one.
    // Stars are always worked out from the saved answers, so this rule applies to stars earned before it too.
    stars: function (p, objId) {
      var o = p.progress[objId]; if (!o) return 0;
      var s = 0;
      [1, 2, 3].forEach(function (L) {
        var c = 0, rec = [];
        for (var k = L; k <= 3; k++) { c += o.lv[k].c; rec = rec.concat(o.lv[k].recent); }
        if (c >= 5 && rec.length && rec.reduce(function (a, b) { return a + b; }, 0) / rec.length >= 0.7) s++;
      });
      return s;
    },
    accuracy: function (p, objId) {
      var o = p.progress[objId]; if (!o) return null;
      var c = 0, a = 0; [1, 2, 3].forEach(function (L) { c += o.lv[L].c; a += o.lv[L].a; });
      return a ? Math.round(100 * c / a) : null;
    },
    // all the stars a child holds, across every year and section
    totalStars: function (p) { return Object.keys(p.progress || {}).reduce(function (t, id) { return t + Store.stars(p, id); }, 0); },
    streakDays: function (p) {
      var n = 0, d = new Date();
      for (;;) { var k = d.toISOString().slice(0, 10); if (p.days.indexOf(k) >= 0) { n++; d.setDate(d.getDate() - 1); } else break; }
      return n;
    },
    report: function (entry) { data.reports.push(entry); Store.save(); },
    // ---------- moving one child to another device (file or QR codes; js/transfer.js) ----------
    // The child's whole record travels: progress, stars, acorns, outfits, tests and the improvement log. Nothing else.
    childExport: function (id) {
      var c = Store.get(id); if (!c) throw new Error('No such explorer');
      return { app: 'Mayes Maths & More', kind: 'child', v: 1, exported: new Date().toISOString(), child: JSON.parse(JSON.stringify(c)) };
    },
    // read a file or QR message: one child, or every child in a full backup. Each record is checked and rebuilt
    // (cleanChild) before anything is shown or saved, because a file could have been edited by hand.
    childrenIn: function (obj) {
      var kids = obj && obj.kind === 'child' && obj.child && typeof obj.child === 'object' ? [obj.child] : obj && Array.isArray(obj.profiles) ? obj.profiles : null;
      if (!kids) throw new Error('This is not a Mayes Maths & More file');
      kids = kids.filter(function (c) { return c && typeof c === 'object' && typeof c.name === 'string' && c.name.trim(); }).slice(0, 40).map(cleanChild);
      if (!kids.length) throw new Error('This is not a Mayes Maths & More file');
      return kids;
    },
    // the same child on this device: the same id (moved before), else the same name and school year
    findMatch: function (c) {
      return Store.get(c.id) || data.profiles.filter(function (q) { return q.name.trim().toLowerCase() === String(c.name).trim().toLowerCase() && q.year === c.year; })[0] || null;
    },
    childSummary: function (c) {
      var answers = 0; Object.keys(c.progress || {}).forEach(function (k) { var o = c.progress[k]; [1, 2, 3].forEach(function (L) { answers += (o.lv && o.lv[L] ? o.lv[L].a : 0); }); });
      return { name: c.name, year: c.year, answers: answers, stars: Store.totalStars(c), days: (c.days || []).concat(Object.keys(c.log || {})).filter(function (d, i, all) { return all.indexOf(d) === i; }).length, tests: (c.tests || []).length };
    },
    // Add a child from another device. target: an explorer here to combine with, or null to add a new explorer.
    // Combining never loses anything and never double-counts: for every topic and every day it keeps the fuller record,
    // so bringing the same file in twice changes nothing.
    childMerge: function (c, target) {
      c = cleanChild(c);
      if (!target) {
        if (Store.get(c.id)) c.id = newId();
        ['owned', 'tests', 'mtc', 'days'].forEach(function (k) { if (!Array.isArray(c[k])) c[k] = []; });
        ['progress', 'guards', 'wearing'].forEach(function (k) { if (!c[k] || typeof c[k] !== 'object') c[k] = {}; });
        data.profiles.push(c); Store.save(); return c;
      }
      var t = target;
      Object.keys(c.progress || {}).forEach(function (k) {
        var a = t.progress[k], b = c.progress[k];
        if (!a) { t.progress[k] = b; return; }
        t.progress[k] = { lv: {}, level: Math.max(a.level || 1, b.level || 1), last: Math.max(a.last || 0, b.last || 0) };
        [1, 2, 3].forEach(function (L) { var x = a.lv[L] || { c: 0, a: 0, recent: [] }, y = b.lv[L] || { c: 0, a: 0, recent: [] }, best = y.a > x.a ? y : x; t.progress[k].lv[L] = { c: best.c, a: best.a, recent: (best.recent || []).slice() }; });
      });
      t.log = t.log || {};
      Object.keys(c.log || {}).forEach(function (d) { var a = t.log[d], b = c.log[d]; if (!a || (b && b.a > a.a)) t.log[d] = b; });
      var seen = {}; t.tests = (t.tests || []).concat(c.tests || []).filter(function (x) { var k = x.date + '|' + x.kind + '|' + x.score + '/' + x.max; if (seen[k]) return false; seen[k] = 1; return true; }).sort(function (x, y) { return x.date - y.date; });
      seen = {}; t.mtc = (t.mtc || []).concat(c.mtc || []).filter(function (x) { var k = x.date + '|' + x.score; if (seen[k]) return false; seen[k] = 1; return true; });
      t.days = (t.days || []).concat(c.days || []).filter(function (d, i, all) { return all.indexOf(d) === i; }).sort();
      t.owned = (t.owned || []).concat(c.owned || []).filter(function (d, i, all) { return all.indexOf(d) === i; });
      ['guards', 'papers', 'escapedYears'].forEach(function (k) { if (c[k]) { t[k] = t[k] || {}; Object.keys(c[k]).forEach(function (g) { if (c[k][g]) t[k][g] = true; }); } });
      // what was earned in each year: the fuller record, as for everything else; the first record of winning a year stands
      var le = Store.ledger(t), lc = Store.ledger(c);
      Object.keys(lc).forEach(function (y) { var a = le[y] || { f: 0, a: 0 }; le[y] = { f: Math.max(a.f, lc[y].f), a: Math.max(a.a, lc[y].a) }; });
      t.finished = t.finished || {}; Object.keys(c.finished || {}).forEach(function (y) { if (!t.finished[y]) t.finished[y] = c.finished[y]; });
      ['feathers', 'acorns', 'fixIts'].forEach(function (k) { t[k] = Math.max(t[k] || 0, c[k] || 0); });
      ['introSeen', 'escaped'].forEach(function (k) { t[k] = !!(t[k] || c[k]); });
      t.year = Math.max(t.year || 1, c.year || 1);
      if (!t.code && c.code) t.code = c.code;
      if (!t.board && c.board) t.board = c.board;
      if (!t.font && c.font) t.font = c.font;
      if (!t.tier && c.tier) t.tier = c.tier;
      Store.save(); return t;
    },
    // What a child has earned in each school year: { year: { f: feathers, a: acorns } }. Acorns earned, not the balance,
    // since buying outfits spends them. Children who started before this was kept have their totals so far put against
    // their current year (acorns earned = balance + spent on outfits − the 5 everyone starts with).
    ledger: function (p) {
      if (!p.earned) {
        var spent = (p.owned || []).reduce(function (t, id) { var it = OM.outfitById && OM.outfitById(id); return t + (it ? it.price : 0); }, 0);
        p.earned = {}; p.earned[p.year || 4] = { f: p.feathers || 0, a: Math.max(0, (p.acorns || 0) + spent - 5) };
      }
      return p.earned;
    },
    // call before adding to the child's totals
    earn: function (p, feathers, acorns) {
      var led = Store.ledger(p), y = p.year || 4, e = led[y] || (led[y] = { f: 0, a: 0 });
      e.f += feathers || 0; e.a += acorns || 0;
    },
    // a back-up is due once there is progress worth keeping, and none has been made within the time-frame a grown-up chose
    backupDue: function (now) {
      var n = { daily: 1, weekly: 7, monthly: 30 }[data.settings.backupEvery], last = data.settings.lastBackup;
      if (!n || !data.profiles.some(function (p) { return p.days.length > 0; })) return false;
      if (!last) return true;
      var day = function (t) { var d = new Date(t); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };
      return Math.round((day(now) - day(last)) / 86400000) >= n;
    },
    exportJSON: function () { return JSON.stringify(data, null, 2); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
