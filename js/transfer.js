/* Mayes Maths & More — moving a child's progress to another device, with no internet and no server.
   Two ways, both from Grown-ups' area → Backup & move:
   - a FILE: Share (AirDrop, WhatsApp, email to yourself, Google Drive…) or download, then open it on the other device;
   - QR CODES: this device shows a short looping sequence of QR codes; the other device scans them with its camera.
   Either way the other device shows what it has received and the grown-up chooses to add it as a new explorer or to
   combine it with the same child already there (OM.Store.childMerge keeps the fuller record, so nothing is lost).
   QR codes are drawn with qrcode-generator (MIT) and read with the browser's own BarcodeDetector where it has one,
   otherwise jsQR (Apache 2.0). Both live in js/vendor/ and are loaded only when needed. */
(function (G) {
  'use strict';
  var OM = G.OM, doc = G.document;
  var CHUNK = 600, FRAME_MS = 380, TAG = 'MMM1';

  // ---------- packing: JSON → (deflate) → base64url ----------
  function b64(bytes) { var s = '', i; for (i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function unb64(t) { t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; var s = atob(t), u = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; }
  function pipe(bytes, Stream, mode) { return new Response(new Blob([bytes]).stream().pipeThrough(new Stream(mode))).arrayBuffer().then(function (b) { return new Uint8Array(b); }); }
  var canZip = typeof G.CompressionStream === 'function' && typeof G.DecompressionStream === 'function';
  function pack(obj) {
    var raw = new TextEncoder().encode(JSON.stringify(obj));
    return canZip ? pipe(raw, G.CompressionStream, 'deflate-raw').then(function (z) { return 'z' + b64(z); }) : Promise.resolve('j' + b64(raw));
  }
  function unpack(text) {
    var kind = text.charAt(0), bytes = unb64(text.slice(1));
    var p = kind === 'z' ? pipe(bytes, G.DecompressionStream, 'deflate-raw') : Promise.resolve(bytes);
    return p.then(function (u) { return JSON.parse(new TextDecoder().decode(u)); });
  }
  // split into QR-sized frames: MMM1:session:index:count:part
  function frames(payload) {
    var sid = Math.random().toString(36).slice(2, 6), n = Math.max(1, Math.ceil(payload.length / CHUNK)), out = [];
    for (var i = 0; i < n; i++) out.push([TAG, sid, i + 1, n, payload.slice(i * CHUNK, (i + 1) * CHUNK)].join(':'));
    return out;
  }
  // a collector for scanned frames; returns the full payload once every frame has arrived
  function collector() {
    var sid = null, parts = {}, count = 0;
    return {
      add: function (text) {
        var m = /^MMM1:([a-z0-9]+):(\d+):(\d+):(.*)$/.exec(text || ''); if (!m) return null;
        if (m[1] !== sid) { sid = m[1]; parts = {}; count = +m[3]; }
        parts[m[2]] = m[4];
        return { got: Object.keys(parts).length, of: count, done: Object.keys(parts).length === count ? Array.apply(null, Array(count)).map(function (_, i) { return parts[i + 1]; }).join('') : null };
      }
    };
  }
  OM.transfer = { pack: pack, unpack: unpack, frames: frames, collector: collector };
  if (!doc) return;

  // ---------- loading the QR libraries only when needed ----------
  function need(src, test) { return test() ? Promise.resolve() : new Promise(function (ok, bad) { var s = doc.createElement('script'); s.src = src; s.onload = ok; s.onerror = function () { bad(new Error('Could not load ' + src)); }; doc.head.appendChild(s); }); }
  function qrLib() { return need('js/vendor/qrcode-generator.js', function () { return typeof G.qrcode === 'function'; }); }
  function scanLib() { return 'BarcodeDetector' in G ? G.BarcodeDetector.getSupportedFormats().then(function (f) { if (f.indexOf('qr_code') < 0) throw 0; return 'native'; }).catch(function () { return need('js/vendor/jsQR.js', function () { return typeof G.jsQR === 'function'; }).then(function () { return 'jsqr'; }); })
    : need('js/vendor/jsQR.js', function () { return typeof G.jsQR === 'function'; }).then(function () { return 'jsqr'; }); }
  // a QR code as an SVG with a white quiet zone, so it reads on any background
  function qrSVG(text) {
    var q = G.qrcode(0, 'L'); q.addData(text); q.make();
    var n = q.getModuleCount(), m = 4, size = n + m * 2, d = '';
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (q.isDark(y, x)) d += 'M' + (x + m) + ' ' + (y + m) + 'h1v1h-1z';
    return '<svg viewBox="0 0 ' + size + ' ' + size + '" shape-rendering="crispEdges" role="img" aria-label="QR code"><rect width="' + size + '" height="' + size + '" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>';
  }

  // ---------- the overlay used by all three steps ----------
  function overlay(html) {
    var o = doc.createElement('div'); o.className = 'xfer'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true');
    o.innerHTML = '<div class="xbox card">' + html + '</div>'; doc.body.appendChild(o);
    var onKey = function (e) { if (e.key === 'Escape') close(); };
    function close() { if (o.cleanup) o.cleanup(); o.remove(); doc.removeEventListener('keydown', onKey); }
    doc.addEventListener('keydown', onKey);
    o.close = close; o.querySelectorAll('[data-x="close"]').forEach(function (b) { b.onclick = close; });
    return o;
  }

  // ---------- sending: a file ----------
  function fileName(obj) { var c = obj.child || {}; return (c.name || 'explorer').replace(/[^\w-]+/g, '-') + '-mayes-maths-' + new Date().toISOString().slice(0, 10) + '.json'; }
  OM.transfer.shareFile = function (obj) {
    var name = fileName(obj), file = new File([JSON.stringify(obj)], name, { type: 'application/json' });
    if (G.navigator.canShare && G.navigator.canShare({ files: [file] })) {
      return G.navigator.share({ files: [file], title: 'Mayes Maths & More: ' + obj.child.name + '’s progress', text: 'Open this in Mayes Maths & More: Grown-ups’ area → Backup & move → Open a file.' })
        .then(function () { return 'shared'; }).catch(function (e) { if (e && e.name === 'AbortError') return 'cancelled'; return download(file); });
    }
    return Promise.resolve(download(file));
  };
  function download(file) { var a = doc.createElement('a'); a.href = URL.createObjectURL(file); a.download = file.name; doc.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000); return 'downloaded'; }
  OM.transfer.readFile = function (file) { return file.text().then(function (t) { return JSON.parse(t); }); };

  // ---------- sending: QR codes ----------
  OM.transfer.showQR = function (obj) {
    var name = obj.child.name;
    return Promise.all([qrLib(), pack(obj)]).then(function (r) {
      var fs = frames(r[1]), svgs = fs.map(qrSVG), i = 0, slow = false, timer = null;
      var o = overlay('<div class="xhead"><h3>Scan to move ' + OM.esc(name) + '</h3><button class="xclose" data-x="close" aria-label="Close">✕</button></div>' +
        '<p class="small-note">On the other device, open <b>Grown-ups’ area → Backup &amp; move → Scan QR codes</b> and point its camera at this screen. ' + (fs.length > 1 ? 'The ' + fs.length + ' codes play on a loop; keep pointing until it says it has them all.' : '') + '</p>' +
        '<div class="qrwrap"><div class="qr"></div></div><div class="qrmeta"><span class="qrn"></span><button class="btn small ghost" data-x="slow">Slower</button></div>');
      var box = o.querySelector('.qr'), meta = o.querySelector('.qrn');
      function show() { box.innerHTML = svgs[i]; meta.textContent = fs.length > 1 ? 'Code ' + (i + 1) + ' of ' + fs.length : 'One code'; i = (i + 1) % fs.length; }
      function run() { clearInterval(timer); show(); if (fs.length > 1) timer = setInterval(show, slow ? FRAME_MS * 2.2 : FRAME_MS); }
      o.querySelector('[data-x="slow"]').onclick = function (e) { slow = !slow; e.target.textContent = slow ? 'Faster' : 'Slower'; run(); };
      if (fs.length < 2) o.querySelector('[data-x="slow"]').hidden = true;
      o.cleanup = function () { clearInterval(timer); };
      run();
      return o;
    });
  };

  // ---------- receiving: scanning QR codes with the camera ----------
  OM.transfer.scan = function (onData) {
    var o = overlay('<div class="xhead"><h3>Scan the QR codes</h3><button class="xclose" data-x="close" aria-label="Close">✕</button></div>' +
      '<p class="small-note">On the other device, choose <b>Show QR codes</b> for the child you are moving, then point this camera at its screen. Hold steady; it collects the codes as they play.</p>' +
      '<div class="camwrap"><video playsinline muted></video><div class="camframe"></div></div><div class="vprog"><span></span></div><p class="scanstate" aria-live="polite">Starting the camera…</p>');
    var video = o.querySelector('video'), bar = o.querySelector('.vprog span'), state = o.querySelector('.scanstate'), stream = null, stop = false, col = collector(), canvas = doc.createElement('canvas'), ctx = canvas.getContext('2d', { willReadFrequently: true });
    o.cleanup = function () { stop = true; if (stream) stream.getTracks().forEach(function (t) { t.stop(); }); };
    if (!G.navigator.mediaDevices || !G.navigator.mediaDevices.getUserMedia) { state.textContent = 'This browser cannot use the camera. Use “Share as a file” instead.'; return o; }
    Promise.all([scanLib(), G.navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })]).then(function (r) {
      var how = r[0]; stream = r[1]; video.srcObject = stream; video.play();
      var detector = how === 'native' ? new G.BarcodeDetector({ formats: ['qr_code'] }) : null;
      state.textContent = 'Looking for the codes…';
      function read() {
        if (stop) return;
        if (video.readyState < 2) return setTimeout(read, 150);
        var found = detector ? detector.detect(video).then(function (cs) { return cs.map(function (c) { return c.rawValue; }); }) : Promise.resolve((function () {
          var w = Math.min(720, video.videoWidth), h = Math.round(video.videoHeight * w / video.videoWidth); canvas.width = w; canvas.height = h; ctx.drawImage(video, 0, 0, w, h);
          var res = G.jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'dontInvert' }); return res ? [res.data] : [];
        })());
        found.then(function (texts) {
          var last = null; texts.forEach(function (t) { var r2 = col.add(t); if (r2) last = r2; });
          if (last) { bar.style.width = Math.round(100 * last.got / last.of) + '%'; state.textContent = 'Got ' + last.got + ' of ' + last.of + ' codes'; }
          if (last && last.done) { state.textContent = 'Got them all. Reading…'; o.cleanup(); return unpack(last.done).then(function (obj) { o.close(); onData(obj); }); }
          setTimeout(read, 120);
        }).catch(function () { setTimeout(read, 200); });
      }
      read();
    }).catch(function (e) {
      state.textContent = e && e.name === 'NotAllowedError' ? 'The camera was not allowed. Allow it in the browser’s site settings, or use “Share as a file” instead.' : 'The camera could not start. Use “Share as a file” instead.';
    });
    return o;
  };

  // ---------- receiving: what's in it, and where to put it ----------
  // onDone(message) is called after anything is added, so the page can refresh
  OM.transfer.review = function (obj, onDone) {
    var kids;
    try { kids = OM.Store.childrenIn(obj); } catch (e) { G.alert(e.message); return; }
    var rows = kids.map(function (c, i) {
      var s = OM.Store.childSummary(c), match = OM.Store.findMatch(c);
      return '<li class="xkid" data-i="' + i + '"><div><b>' + OM.esc(c.name) + '</b> · Year ' + c.year + '<br><small>' + s.answers + ' answers, ' + s.stars + ' stars, ' + s.days + ' days practised, ' + s.tests + ' tests</small>' +
        (match ? '<br><small class="xmatch">' + OM.esc(match.name) + ' (Year ' + match.year + ') is already on this device.</small>' : '') + '</div><div class="row">' +
        (match ? '<button class="btn small" data-x="combine">Combine with ' + OM.esc(match.name) + '</button><button class="btn small ghost" data-x="new">Add as a separate explorer</button>' : '<button class="btn small" data-x="new">Add ' + OM.esc(c.name) + '</button>') + '</div></li>';
    }).join('');
    var o = overlay('<div class="xhead"><h3>' + (kids.length > 1 ? 'Explorers in this backup' : 'Progress from another device') + '</h3><button class="xclose" data-x="close" aria-label="Close">✕</button></div>' +
      '<p class="small-note">Combining keeps the fuller record for every topic and day, so nothing on either device is lost, and adding the same progress twice changes nothing.</p><ul class="xkids">' + rows + '</ul>');
    o.querySelectorAll('.xkid').forEach(function (li) {
      var c = kids[+li.getAttribute('data-i')];
      li.querySelectorAll('[data-x]').forEach(function (b) {
        b.onclick = function () {
          var t = b.getAttribute('data-x') === 'combine' ? OM.Store.findMatch(c) : null, done = OM.Store.childMerge(c, t);
          li.innerHTML = '<div><b>' + OM.esc(done.name) + '</b>: ' + (t ? 'combined' : 'added') + ' ✓</div>';
          if (onDone) onDone((t ? 'Combined ' : 'Added ') + done.name + '.');
          if (!o.querySelector('.xkid [data-x]')) setTimeout(o.close, 900);
        };
      });
    });
    return o;
  };
})(typeof window !== 'undefined' ? window : globalThis);
