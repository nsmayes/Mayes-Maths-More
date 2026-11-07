/* Mayes Maths & More — working offline: asking the browser to keep saved progress, and the Install button. Used by the app (grown-ups' area) and by the front page. Plain functions on OM.offline. */
(function (G) {
  'use strict';
  var OM = G.OM = G.OM || {}, nav = G.navigator || {};
  var web = !!(G.location && /^https?:/.test(G.location.protocol));

  OM.offline = {
    // can this copy save itself for offline use? (only when opened from a web address, not from a file)
    canSave: web && 'serviceWorker' in nav && 'caches' in G,
    // true once the offline worker is looking after this page, i.e. the app's files are saved on the device
    appSaved: function () { return !!(nav.serviceWorker && nav.serviceWorker.controller); },
    register: function () { if (OM.offline.canSave) return nav.serviceWorker.register('sw.js').catch(function () {}); },
    installed: function () { return !!((G.matchMedia && G.matchMedia('(display-mode: standalone)').matches) || nav.standalone); },

    // ask the browser not to clear saved progress when space runs low ("persistent storage")
    keepProgress: function () { return nav.storage && nav.storage.persist ? nav.storage.persist().catch(function () { return false; }) : Promise.resolve(false); },
    progressKept: function () { return nav.storage && nav.storage.persisted ? nav.storage.persisted().catch(function () { return false; }) : Promise.resolve(false); },

    // the Install button: browsers that support it offer an install prompt we can show on a button
    installPrompt: null,
    install: function () { var p = OM.offline.installPrompt; if (!p) return Promise.resolve(false); OM.offline.installPrompt = null; p.prompt(); return p.userChoice.then(function (c) { return c && c.outcome === 'accepted'; }); }
  };
  if (G.addEventListener) {
    G.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); OM.offline.installPrompt = e; if (OM.offline.onInstallReady) OM.offline.onInstallReady(); });
    G.addEventListener('appinstalled', function () { OM.offline.installPrompt = null; if (OM.offline.onInstalled) OM.offline.onInstalled(); });
  }
})(typeof window !== 'undefined' ? window : globalThis);
