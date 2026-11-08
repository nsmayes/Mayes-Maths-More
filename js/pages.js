/* Mayes Maths & More — the way back from the front page, About page and Help page, so none of them is a dead end.
   Links into these pages say where the reader came from: ?from=app (the app itself, where an installed app has no Back
   button) or ?from=site (the landing page at mayesmathsandmore.com). This keeps a clear "Back to …" link at the top
   of the page, carries the same from= on to the other pages, and points "Front page" back to wherever they started. */
(function (G) {
  'use strict';
  var doc = G.document, SITE = 'https://mayesmathsandmore.com/';
  var from = (G.location.search.match(/[?&]from=(app|site)\b/) || [])[1] || '';
  // the installed app opens these pages inside its own window, with no browser Back button
  var installed = G.matchMedia && (G.matchMedia('(display-mode: standalone)').matches || G.matchMedia('(display-mode: minimal-ui)').matches) || G.navigator.standalone === true;
  if (!from && installed) from = 'app';
  var back = from === 'site' ? { href: SITE, words: 'Back to mayesmathsandmore.com' } : from === 'app' ? { href: 'play.html', words: 'Back to the app' } : null;

  // carry where they came from on to the other pages, and send "Front page" home
  if (from) [].forEach.call(doc.querySelectorAll('a[href]'), function (a) {
    var h = a.getAttribute('href'), m = h.match(/^(index\.html|about\.html|help\.html)(#.*)?$/);
    if (!m) return;
    if (m[1] === 'index.html' && from === 'site' && !m[2]) { a.setAttribute('href', SITE); return; }
    if (m[1] === 'index.html' && from === 'app' && !m[2]) { a.setAttribute('href', 'play.html'); if (a.textContent === 'Front page') { a.textContent = 'Back to the app'; a.setAttribute('data-home', ''); } return; }
    a.setAttribute('href', m[1] + '?from=' + from + (m[2] || ''));
  });
  // inside the app, "Front page" has become "Back to the app", so a second "Open the app" next to it is not needed
  if (from === 'app' && doc.querySelector('footer a[data-home]')) [].forEach.call(doc.querySelectorAll('footer a[href="play.html"]:not([data-home])'), function (a) {
    var sep = a.previousSibling; if (sep && sep.nodeType === 3 && /·\s*$/.test(sep.nodeValue)) sep.nodeValue = sep.nodeValue.replace(/\s*·\s*$/, ' ');
    a.remove();
  });
  if (!back) return;
  var link = doc.createElement('a'); link.className = 'backlink'; link.href = back.href;
  link.innerHTML = '<span aria-hidden="true">←</span> ' + back.words;
  var bar = doc.querySelector('.topbar .wrap');
  if (bar) bar.appendChild(link);
  else { var top = doc.createElement('div'); top.className = 'backbar'; var w = doc.createElement('div'); w.className = 'wrap'; w.appendChild(link); top.appendChild(w); doc.body.insertBefore(top, doc.body.firstChild); }
})(typeof window !== 'undefined' ? window : globalThis);
