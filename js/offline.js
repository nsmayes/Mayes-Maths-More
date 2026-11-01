/* Mayes Maths & More — working offline: saving Pip's voice on the device, asking the browser to keep saved progress,
   and the Install button. Used by the app (grown-ups' area) and by the front page. Plain functions on OM.offline. */
(function (G) {
  'use strict';
  var OM = G.OM = G.OM || {}, nav = G.navigator || {};
  var VOICE = 'mmm-voice-v1', VOICE_FILES = ['voice/engine.js', 'voice/cori.js'], VOICE_MB = 97;
  var web = !!(G.location && /^https?:/.test(G.location.protocol));
  function abs(f) { return new URL(f, G.location.href).href; }

  OM.offline = {
    VOICE_MB: VOICE_MB,
    // can this copy save itself for offline use? (only when opened from a web address, not from a file)
    canSave: web && 'serviceWorker' in nav && 'caches' in G,
    // true once the offline worker is looking after this page, i.e. the app's files are saved on the device
    appSaved: function () { return !!(nav.serviceWorker && nav.serviceWorker.controller); },
    register: function () { if (OM.offline.canSave) return nav.serviceWorker.register('sw.js').catch(function () {}); },
    installed: function () { return !!((G.matchMedia && G.matchMedia('(display-mode: standalone)').matches) || nav.standalone); },

    // Pip's natural voice: is it saved on this device?
    voiceSaved: function () {
      if (!('caches' in G)) return Promise.resolve(false);
      return G.caches.open(VOICE).then(function (c) { return Promise.all(VOICE_FILES.map(function (f) { return c.match(abs(f)); })); })
        .then(function (hits) { return hits.every(Boolean); }).catch(function () { return false; });
    },
    // download the voice into the device's store, reporting progress from 0 to 1
    downloadVoice: function (onProgress) {
      var total = VOICE_MB * 1048576, done = 0;
      return G.caches.open(VOICE).then(function (c) {
        return VOICE_FILES.reduce(function (p, f) {
          return p.then(function () {
            return c.match(abs(f)).then(function (hit) {
              if (hit) return hit.blob().then(function (b) { done += b.size; if (onProgress) onProgress(Math.min(1, done / total)); });
              return G.fetch(abs(f), { cache: 'reload' }).then(function (res) {
                if (!res.ok) throw new Error('Could not download ' + f);
                if (!res.body || !res.body.getReader) return res.blob().then(function (b) { done += b.size; return b; });
                var reader = res.body.getReader(), parts = [];
                var pump = function () { return reader.read().then(function (r) { if (r.done) return new Blob(parts, { type: 'text/javascript' }); parts.push(r.value); done += r.value.length; if (onProgress) onProgress(Math.min(0.99, done / total)); return pump(); }); };
                return pump();
              }).then(function (blob) { return c.put(abs(f), new Response(blob, { headers: { 'Content-Type': 'text/javascript' } })); });
            });
          });
        }, Promise.resolve());
      }).then(function () { voiceReady(); if (onProgress) onProgress(1); });
    },
    // Pip's natural voice is optional: it is never downloaded by itself, only when a grown-up chooses (downloadVoice)
    voiceIsSaved: false,
    removeVoice: function () { return G.caches ? G.caches.delete(VOICE) : Promise.resolve(); },

    // ask the browser not to clear saved progress when space runs low ("persistent storage")
    keepProgress: function () { return nav.storage && nav.storage.persist ? nav.storage.persist().catch(function () { return false; }) : Promise.resolve(false); },
    progressKept: function () { return nav.storage && nav.storage.persisted ? nav.storage.persisted().catch(function () { return false; }) : Promise.resolve(false); },

    // the Install button: browsers that support it offer an install prompt we can show on a button
    installPrompt: null,
    install: function () { var p = OM.offline.installPrompt; if (!p) return Promise.resolve(false); OM.offline.installPrompt = null; p.prompt(); return p.userChoice.then(function (c) { return c && c.outcome === 'accepted'; }); }
  };
  // once the voice is known to be saved, the app can start using it
  function voiceReady() { OM.offline.voiceIsSaved = true; if (OM.onVoicesChanged) OM.onVoicesChanged(); if (OM.prepareVoice) OM.prepareVoice(); }
  if (OM.offline.canSave) OM.offline.voiceSaved().then(function (v) { if (v) voiceReady(); });
  if (G.addEventListener) {
    G.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); OM.offline.installPrompt = e; if (OM.offline.onInstallReady) OM.offline.onInstallReady(); });
    G.addEventListener('appinstalled', function () { OM.offline.installPrompt = null; if (OM.offline.onInstalled) OM.offline.onInstalled(); });
  }
})(typeof window !== 'undefined' ? window : globalThis);
