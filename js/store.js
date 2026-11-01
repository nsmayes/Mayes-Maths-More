/* Learn with Pip — saving profiles and progress on this device (no internet, no accounts). */
(function (G) {
  'use strict';
  var OM = G.OM, KEY = 'owlmaths.v1';
  var blank = function () { return { profiles: [], settings: { pin: null, readAloud: 'auto', rate: 0.95, keypad: 'auto', font: 'normal', sounds: true, muted: false, voice: null, motion: 'on', paperTimers: true }, reports: [] }; };
  var data = blank();
  try { var raw = G.localStorage && G.localStorage.getItem(KEY); if (raw) data = Object.assign(blank(), JSON.parse(raw)); } catch (e) { /* private window or blocked storage: run without saving */ }
  data.settings = Object.assign(blank().settings, data.settings || {});
  // animations are on unless a grown-up has chosen otherwise (earlier versions followed the device setting by default)
  if (!data.settings.motionChosen) data.settings.motion = 'on';

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
    // read a file or QR message: one child, or every child in a full backup
    childrenIn: function (obj) {
      if (obj && obj.kind === 'child' && obj.child && obj.child.name) return [obj.child];
      if (obj && Array.isArray(obj.profiles)) return obj.profiles.filter(function (c) { return c && c.name; });
      throw new Error('This is not a Mayes Maths & More file');
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
      c = JSON.parse(JSON.stringify(c));
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
      ['feathers', 'acorns', 'fixIts'].forEach(function (k) { t[k] = Math.max(t[k] || 0, c[k] || 0); });
      ['introSeen', 'escaped'].forEach(function (k) { t[k] = !!(t[k] || c[k]); });
      t.year = Math.max(t.year || 1, c.year || 1);
      if (!t.code && c.code) t.code = c.code;
      if (!t.board && c.board) t.board = c.board;
      if (!t.tier && c.tier) t.tier = c.tier;
      Store.save(); return t;
    },
    exportJSON: function () { return JSON.stringify(data, null, 2); },
    importJSON: function (s) { var d = JSON.parse(s); if (!d || !Array.isArray(d.profiles)) throw new Error('Not a Mayes Maths & More backup file'); Object.keys(d).forEach(function (k) { data[k] = d[k]; }); data.settings = Object.assign(blank().settings, data.settings); Store.save(); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
