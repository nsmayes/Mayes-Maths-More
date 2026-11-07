/* Mayes Maths & More — the version number families see (About page, grown-ups' area). It must match VERSION in sw.js:
   tests/run-checks.js checks this, and `python tools/bump-version.py` changes both together. */
(function (G) {
  'use strict';
  var VERSION = 'v60';
  G.OM = G.OM || {};
  G.OM.VERSION = VERSION;
  G.OM.versionText = function () { return 'Version ' + VERSION.replace(/^v/, ''); };
  // fill in any element marked data-version
  var doc = G.document; if (!doc) return;
  function show() { doc.querySelectorAll('[data-version]').forEach(function (e) { e.textContent = G.OM.versionText(); }); }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', show); else show();
})(typeof window !== 'undefined' ? window : globalThis);
