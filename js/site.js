/* Mayes Maths & More — the front page: save the app for offline use, offer the Install button, and open the install
   steps for the device in use. */
(function (G) {
  'use strict';
  var O = G.OM.offline, doc = G.document, status = doc.getElementById('status'), btn = doc.getElementById('installBtn');
  function say(t) { if (status) status.textContent = t; }
  // already opened as an installed app: go straight in
  if (O.installed()) { G.location.replace('play.html'); return; }
  if (O.canSave) {
    O.register();
    // (on iPhone and iPad the Home Screen app saves its own copy the first time it is opened, so Safari's copy is not the one that counts)
    var apple = /iphone|ipad|ipod/i.test(G.navigator.userAgent) || (/macintosh/i.test(G.navigator.userAgent) && G.navigator.maxTouchPoints > 1);
    G.navigator.serviceWorker.ready.then(function () { if (!apple) say('Saved on this device: the app now works offline.'); });
  } else if (status) say('Opened from a file: to use it offline, open it from its web address instead.');
  if (btn) {
    var show = function () { btn.hidden = !O.installPrompt; };
    O.onInstallReady = show; show();
    btn.onclick = function () { O.install().then(function (ok) { if (ok) say('Installed. Look for Pip’s icon on this device.'); show(); }); };
    O.onInstalled = function () { btn.hidden = true; say('Installed. Look for Pip’s icon on this device.'); };
  }
  // open the install steps for this device
  var ua = (G.navigator.userAgent || '').toLowerCase(), os = /iphone|ipad|ipod/.test(ua) || (/macintosh/.test(ua) && G.navigator.maxTouchPoints > 1) ? 'ios' : /android/.test(ua) ? 'android' : /firefox/.test(ua) ? 'firefox' : /cros/.test(ua) ? 'chromeos' : /macintosh/.test(ua) ? 'mac' : /windows/.test(ua) ? 'windows' : 'linux';
  var first = doc.querySelector('details[data-os~="' + os + '"]');
  if (first) first.open = true;
  // iPhone and iPad have no install prompt, so the button shows the Add to Home Screen steps instead.
  // Inside another app (WhatsApp, Facebook, Gmail…) the page cannot be added at all: say to open it in Safari first.
  if (os === 'ios' && btn) {
    var inApp = !/safari\//.test(ua) || /fban|fbav|instagram|gsa\/|line\//.test(ua);
    btn.hidden = false; btn.textContent = /ipad/.test(ua) || G.navigator.maxTouchPoints > 1 && !/iphone/.test(ua) ? 'Install on this iPad' : 'Install on this iPhone';
    O.onInstallReady = null;
    btn.onclick = function () {
      var steps = doc.getElementById('iosSteps'); if (!steps) return;
      steps.open = true; steps.classList.add('pulse'); steps.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function () { steps.classList.remove('pulse'); }, 2400);
    };
    if (inApp) say('To install, first open this page in Safari: use this app’s ⋯ menu or the compass icon, then “Open in Safari”.');
  }
})(typeof window !== 'undefined' ? window : globalThis);
