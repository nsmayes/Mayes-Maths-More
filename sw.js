/* Mayes Maths & More — the offline worker. Once the app has been opened from its web address, everything it needs is
   saved on the device, so it then works with no internet connection at all.
   - The app's own files are saved when it is installed (FILES), in a store named after this version. On each visit the
     newest copy is fetched if the device is online, so updates arrive by themselves; offline, the saved copy is used.
   - Pip's natural voice (voice/, about 97 MB) is kept in a separate store that app updates never delete. It is saved the
     first time the voice is used, or straight away with "Download Pip's voice" in the grown-ups' area, and after that it
     is always read from the device, never downloaded again.
   When any file changes, change VERSION so devices pick up the new copy. tests/run-checks.js checks FILES is complete. */
var VERSION = 'v57';
var CACHE = 'mmm-app-' + VERSION, VOICE = 'mmm-voice-v1';
var FILES = ['./', 'index.html', 'play.html', 'about.html', 'css/fonts.css', 'css/app.css', 'css/site.css', 'manifest.webmanifest', 'icon.svg', 'img/brand/mark.svg', 'img/brand/mark-small.svg',
  'img/icons/icon-192.png', 'img/icons/icon-512.png', 'img/icons/maskable-512.png', 'img/icons/apple-touch-icon-180.png', 'img/icons/favicon-32.png',
  'js/core.js', 'js/marking.js', 'js/algebra.js', 'js/visuals.js', 'js/curriculum-y1.js', 'js/curriculum-y2.js', 'js/curriculum-y3.js', 'js/curriculum-y4.js', 'js/curriculum-y5.js',
  'js/curriculum-y6.js', 'js/curriculum-y7.js', 'js/curriculum-y8.js', 'js/curriculum-y9.js', 'js/gcse-content.js', 'js/curriculum-y10.js', 'js/curriculum-y11.js', 'js/kit.js',
  'js/gen-number.js', 'js/gen-muldiv.js', 'js/gen-fractions.js', 'js/gen-measure.js', 'js/gen-geometry.js', 'js/gen-stats.js', 'js/gen-y1.js', 'js/gen-y2.js', 'js/gen-y3.js',
  'js/gen-y5.js', 'js/gen-y6.js', 'js/gen-y7.js', 'js/gen-y8.js', 'js/gen-y9.js', 'js/gen-y10.js', 'js/gen-y11.js', 'js/gen-higher.js', 'js/gen-hparts.js', 'js/working.js',
  'js/eleven.js', 'js/eleven-english.js', 'js/demos.js', 'js/tricks.js', 'js/papers.js', 'js/illustrations.js', 'js/certificate.js', 'js/icons.js', 'js/worlds.js', 'js/characters.js', 'js/animals.js', 'js/animals-real.js', 'js/outfits.js',
  'js/tracker.js', 'js/store.js', 'js/neural.js', 'js/speech.js', 'js/offline.js', 'js/transfer.js', 'js/vendor/qrcode-generator.js', 'js/vendor/jsQR.js', 'js/vendor/APACHE-LICENSE-2.0.txt', 'js/widgets.js', 'js/calculator.js', 'js/app.js', 'js/site.js', 'js/boot.js', 'js/version.js'];

self.addEventListener('install', function (e) {
  // cache: 'reload' skips the browser's own cache, so a new version saves new files
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES.map(function (f) { return new Request(f, { cache: 'reload' }); })); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  // remove older versions of the app (and the store used before this one), but never the saved voice
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE && k !== VOICE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || req.url.indexOf(self.location.origin) !== 0) return;
  // the voice: from the device if saved; otherwise download it once and keep it
  if (/\/voice\/[^/]+\.js$/.test(new URL(req.url).pathname)) {
    e.respondWith(caches.open(VOICE).then(function (c) {
      return c.match(req, { ignoreSearch: true }).then(function (hit) {
        return hit || fetch(req).then(function (res) { if (res.ok) c.put(req, res.clone()); return res; });
      });
    }));
    return;
  }
  // everything else: the newest copy when online (and save it), the saved copy when offline
  e.respondWith(fetch(req).then(function (res) {
    if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (hit) {
      return hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined);
    });
  }));
});
