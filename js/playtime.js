/* Mayes Maths & More: the rules for each child's play time limits, set in the grown-ups' area (the pop-up is in js/app.js).
   p.limits holds what a grown-up chose; a limit left out or null is off. p.pt holds the time used, in seconds, on this device.
   "In a row" runs until a break. "Each hour" and "every few hours" start when the child starts playing and last that long
   (not a rolling count, so a child who reaches a limit gets a clear time to come back, not a minute at a time).
   "Each day" runs until midnight. Each limit can be extended once, by 3 minutes, each time it comes round. */
(function (G) {
  'use strict';
  var OM = G.OM = G.OM || {}, HOUR = 3600000, MIN = 60000;
  var PT = OM.playtime = { BONUS_MINS: 3, IDLE_MS: 5 * MIN, KINDS: ['row', 'hour', 'span', 'day'], DEFAULTS: { row: 30, brk: 10, hour: 45, span: 90, spanH: 3, day: 60 } };
  function whole(v, lo, hi) { v = Math.round(Number(v)); return isFinite(v) && v >= lo ? Math.min(v, hi) : null; }
  function dayKey(now) { var d = new Date(now); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function midnight(now) { var d = new Date(now); return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime(); }

  // only sensible numbers are kept, whether they came from the form or from a file from another device
  PT.clean = function (l) {
    l = l && typeof l === 'object' ? l : {};
    var spanH = whole(l.spanH, 2, 24) || PT.DEFAULTS.spanH;
    return { row: whole(l.row, 1, 600), brk: whole(l.brk, 1, 240) || PT.DEFAULTS.brk, hour: whole(l.hour, 1, 60), span: whole(l.span, 1, spanH * 60), spanH: spanH, day: whole(l.day, 1, 1440), ext: l.ext === true };
  };
  PT.active = function (p) { var l = p.limits; return !!l && !!(l.row || l.hour || l.span || l.day); };
  function blank() { return { row: { u: 0, last: 0, x: false }, hour: { u: 0, start: 0, x: false }, span: { u: 0, start: 0, x: false }, day: { u: 0, key: '', x: false } }; }
  // the time used so far, with anything that has come to an end started afresh
  function roll(p, now) {
    var s = p.pt = p.pt || blank(), l = p.limits || {};
    if (s.row.last && now - s.row.last >= (l.brk || PT.DEFAULTS.brk) * MIN) s.row = { u: 0, last: 0, x: false };
    if (s.hour.start && now - s.hour.start >= HOUR) s.hour = { u: 0, start: 0, x: false };
    if (s.span.start && now - s.span.start >= (l.spanH || PT.DEFAULTS.spanH) * HOUR) s.span = { u: 0, start: 0, x: false };
    if (s.day.key !== dayKey(now)) s.day = { u: 0, key: dayKey(now), x: false };
    return s;
  }
  PT.add = function (p, secs, now) {
    var s = roll(p, now);
    ['hour', 'span'].forEach(function (k) { if (!s[k].start) s[k].start = now; });
    PT.KINDS.forEach(function (k) { s[k].u += secs; });
    s.row.last = now;
  };
  // a test is not counted, but it is not a break either
  PT.busy = function (p, now) { var s = roll(p, now); if (s.row.u > 0) s.row.last = now; };
  // the limits reached right now: which, how many minutes it allowed, and when it lifts
  PT.blocked = function (p, now) {
    if (!PT.active(p)) return [];
    var s = roll(p, now), l = p.limits, out = [];
    PT.KINDS.forEach(function (k) {
      if (!l[k]) return;
      var mins = l[k] + (s[k].x ? PT.BONUS_MINS : 0);
      if (s[k].u < mins * 60) return;
      out.push({ kind: k, mins: mins, at: k === 'row' ? s.row.last + l.brk * MIN : k === 'hour' ? s.hour.start + HOUR : k === 'span' ? s.span.start + l.spanH * HOUR : midnight(now) });
    });
    return out;
  };
  // extra time only helps if every limit reached can still be extended; each one can be, once
  PT.canExtend = function (p, now) {
    var b = PT.blocked(p, now);
    return !!(p.limits && p.limits.ext) && b.length > 0 && b.every(function (x) { return !p.pt[x.kind].x; });
  };
  PT.extend = function (p, now) {
    if (!PT.canExtend(p, now)) return false;
    PT.blocked(p, now).forEach(function (x) { p.pt[x.kind].x = true; });
    return true;
  };
  PT.usedToday = function (p, now) { return Math.floor(roll(p, now).day.u / 60); };
  PT.reset = function (p) { p.pt = blank(); };
})(typeof window !== 'undefined' ? window : globalThis);
