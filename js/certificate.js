/* Mayes Maths & More — the award certificate for finishing a school year's adventure.
   OM.cert.completed(p)  the years a child has won
   OM.cert.stats(p, y)   what they achieved in that year (stars, feathers, acorns, questions, guards, days)
   OM.cert.wording(p, y) the words on the certificate
   OM.cert.pdf(...)      wraps a JPEG picture in a one-page A4 landscape PDF. No library and no internet: a PDF holding one
                         picture is a short, plain file, so it works offline on every device.
   OM.cert.draw(p, y)    draws the certificate on a canvas; save() and print() hand it to the family. */
(function (G) {
  'use strict';
  var OM = G.OM, doc = G.document;
  var W = 2339, H = 1654; // A4 landscape at 200 dots per inch, sharp enough to print at home
  var TEAL = '#17675e', NAVY = '#0e2a2f', GOLD = '#c9971c', GOLD_L = '#f2c650', SOFT = '#50696a', PAPER = '#fffdf7', TILE = '#eef6f3';

  function won(p, y) { return y === 4 ? !!p.escaped : !!(p.escapedYears || {})[y]; }
  function ykey(k, y) { return y === 4 ? k : 'Y' + y + ':' + k; }
  function regions(y) { var c = OM.CURRICULUM['Y' + y]; return c ? c.regions : []; }
  // "the Sun Gate", never "the The Sun Gate"
  function gateName(y) { return 'the ' + OM.worldFor(y).gate.replace(/^The /, ''); }

  function completed(p) { var out = []; for (var y = 1; y <= 11; y++) if (OM.CURRICULUM['Y' + y] && won(p, y)) out.push(y); return out; }
  function baddieOf(p, y) { var f = (p.finished || {})[y], id = f && f.b; return OM.BADDIES[id] || OM.BADDIES[p.baddie] || OM.BADDIES.cat; }

  function stats(p, y) {
    var S = OM.Store, regs = regions(y), ids = {}, stars = 0, max = 0, questions = 0, full = 0, topics = 0;
    regs.forEach(function (r) {
      r.objectives.filter(function (o) { return OM.objVisible(o, p); }).forEach(function (o) {
        ids[o.id] = 1; topics++; var s = S.stars(p, o.id); stars += s; max += 3; if (s >= 3) full++;
        var pr = (p.progress || {})[o.id]; if (pr && pr.lv) [1, 2, 3].forEach(function (L) { questions += (pr.lv[L] && pr.lv[L].a) || 0; });
      });
    });
    var log = p.log || {}, days = Object.keys(log).filter(function (d) { var o = log[d] && log[d].o; return o && Object.keys(o).some(function (k) { return ids[k]; }); }).length;
    var earned = S.ledger(p)[y] || { f: 0, a: 0 };
    return { stars: stars, maxStars: max, feathers: earned.f, acorns: earned.a, questions: questions, topics: topics, fullTopics: full, days: days,
      guards: regs.filter(function (r) { return (p.guards || {})[ykey(r.id, y)]; }).length, totalGuards: regs.length };
  }
  // "Top skills added": the ten topics with the most stars that year (then the most questions, then curriculum order),
  // and how many more have at least one star. Only topics with a star count, so it never claims what they have not learned.
  function skills(p, y) {
    var S = OM.Store, all = [];
    regions(y).forEach(function (r) {
      r.objectives.filter(function (o) { return OM.objVisible(o, p); }).forEach(function (o) {
        var st = S.stars(p, o.id), pr = (p.progress || {})[o.id], asked = 0;
        if (pr && pr.lv) [1, 2, 3].forEach(function (L) { asked += (pr.lv[L] && pr.lv[L].a) || 0; });
        if (st > 0) all.push({ title: o.title, place: r.name, stars: st, asked: asked, at: all.length });
      });
    });
    all.sort(function (a, b) { return b.stars - a.stars || b.asked - a.asked || a.at - b.at; });
    return { top: all.slice(0, 10), more: Math.max(0, all.length - 10) };
  }
  function wording(p, y) {
    var f = (p.finished || {})[y], date = f && f.d ? new Date(f.d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    return { name: p.name, line: 'Congratulations for completing Year ' + y + ' by defeating ' + baddieOf(p, y).title + ' at ' + gateName(y), well: 'Well done! What a Year you have had', date: date, owl: p.owlName || 'Pip' };
  }

  // ---------- a PDF holding one JPEG, filling an A4 landscape page ----------
  function hexTitle(s) { var h = 'FEFF'; for (var i = 0; i < s.length; i++) h += ('000' + s.charCodeAt(i).toString(16)).slice(-4).toUpperCase(); return '<' + h + '>'; }
  function pdf(jpeg, w, h, title) {
    var enc = new TextEncoder(), parts = [], at = 0, offsets = [];
    function add(x) { var b = typeof x === 'string' ? enc.encode(x) : x; parts.push(b); at += b.length; }
    function obj(n, body) { offsets[n] = at; add(n + ' 0 obj\n' + body + '\nendobj\n'); }
    add('%PDF-1.4\n');
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    obj(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 841.89 595.28] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>');
    var draw = 'q 841.89 0 0 595.28 0 0 cm /Im0 Do Q';
    obj(4, '<< /Length ' + draw.length + ' >>\nstream\n' + draw + '\nendstream');
    offsets[5] = at;
    add('5 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + w + ' /Height ' + h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpeg.length + ' >>\nstream\n');
    add(jpeg); add('\nendstream\nendobj\n');
    obj(6, '<< /Title ' + hexTitle(title || 'Certificate') + ' /Creator (Mayes Maths & More) >>');
    var xref = at, x = 'xref\n0 7\n0000000000 65535 f \n';
    for (var i = 1; i <= 6; i++) x += ('0000000000' + offsets[i]).slice(-10) + ' 00000 n \n';
    add(x + 'trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n' + xref + '\n%%EOF\n');
    var out = new Uint8Array(at), pos = 0; parts.forEach(function (b) { out.set(b, pos); pos += b.length; });
    return out;
  }

  OM.cert = { completed: completed, stats: stats, skills: skills, wording: wording, gateName: gateName, baddieOf: baddieOf, pdf: pdf, W: W, H: H };
  if (!doc) return;

  // ---------- drawing ----------
  // an inline drawing from the app as a picture for the canvas (a data address, which keeps the canvas saveable on every browser)
  function picture(svgText, viewBox, w, h) {
    var s = svgText.replace(/^<svg /, '<svg data-x="1" ');
    if (!/xmlns=/.test(s.slice(0, 400))) s = s.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    if (viewBox) s = s.replace(/viewBox="[^"]*"/, 'viewBox="' + viewBox + '"');
    s = s.replace(/ width="[^"]*"/, ' width="' + w + '"').replace(/ height="[^"]*"/, ' height="' + h + '"').replace(/currentColor/g, TEAL);
    return new Promise(function (ok) {
      var img = new Image(); img.onload = function () { ok(img); }; img.onerror = function () { ok(null); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
    });
  }
  function many(n, word) { return n === 1 ? word : word + 's'; }
  function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function text(g, s, x, y, font, colour, align) { g.font = font; g.fillStyle = colour; g.textAlign = align || 'center'; g.textBaseline = 'alphabetic'; g.fillText(s, x, y); }
  function wrap(g, s, font, max) { g.font = font; var lines = [''], words = String(s).split(' '); words.forEach(function (w) { var t = (lines[lines.length - 1] + ' ' + w).trim(); if (g.measureText(t).width > max && lines[lines.length - 1]) lines.push(w); else lines[lines.length - 1] = t; }); return lines; }
  function star(g, cx, cy, R, colour) { g.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? R * 0.42 : R; g[i ? 'lineTo' : 'moveTo'](cx + r * Math.cos(a), cy + r * Math.sin(a)); } g.closePath(); g.fillStyle = colour; g.fill(); }

  function draw(p, y) {
    var c = doc.createElement('canvas'); c.width = W; c.height = H;
    var g = c.getContext('2d'), s = stats(p, y), w = wording(p, y), own = OM.tierForYear(y);
    var look = p.look && OM.tierIndex(p.look) >= 0 && OM.tierIndex(p.look) <= OM.tierIndex(own) ? p.look : own, real = look === 'pro' ? Math.min(1, Math.max(0.2, (y - 6) / 5)) : 0;
    var fonts = doc.fonts && doc.fonts.load ? Promise.all(['600 60px Fredoka', '400 30px Lexend'].map(function (f) { return doc.fonts.load(f); })).catch(function () {}) : Promise.resolve();
    return fonts.then(function () {
      return Promise.all([
        // room above and to the sides of the animal for tall hats, wings and things to hold
        picture(OM.animalSVG(p.avatar || 'otter', { role: 'avatar', size: 800, mood: 'happy', wear: p.wearing || {}, tier: look, real: real }), '-30 -44 180 196', 900, 980),
        picture(OM.animalSVG(baddieOf(p, y).id, { role: 'king', size: 300, tier: look, real: real }), '-10 -24 140 176', 280, 352),
        picture(OM.owlSVG({ mood: 'cheer', size: 220, colour: p.colour, tier: look }), null, 220, 220),
        picture(OM.logoMark({ size: 120, decorative: true }), null, 240, 240),
        picture(OM.icon('feather', { size: 24 }), null, 96, 96), picture(OM.icon('acorn', { size: 24 }), null, 96, 96),
        picture(OM.icon('check', { size: 24 }), null, 96, 96), picture(OM.icon('shield', { size: 24 }), null, 96, 96), picture(OM.icon('flame', { size: 24 }), null, 96, 96)
      ]);
    }).then(function (im) {
      g.scale(2, 2); // drawn on a page 1170 by 827, at twice that resolution
      var FEET = 247, RULE = 225; // where the animal stands, low enough that the tallest hat stays inside the border; the line under the name is a tenth of the way up the animal
      g.fillStyle = PAPER; g.fillRect(0, 0, 1170, 827);
      // a double gold border with a star in each corner: mostly white, so it is kind to home printers
      g.strokeStyle = GOLD; g.lineWidth = 5; g.strokeRect(24, 24, 1122, 779); g.strokeStyle = GOLD_L; g.lineWidth = 2; g.strokeRect(36, 36, 1098, 755);
      [[36, 36], [1134, 36], [36, 791], [1134, 791]].forEach(function (q) { g.beginPath(); g.arc(q[0], q[1], 19, 0, 6.29); g.fillStyle = PAPER; g.fill(); star(g, q[0], q[1], 16, GOLD); });
      // the tutor, top left, with the name beneath, ending level with the animal's feet: as much on this side of the page as the animal has on the other
      // a long owl name wraps, and gets smaller if it has to
      var os = 19, owl = wrap(g, w.owl + ' the owl', '600 ' + os + 'px Fredoka, sans-serif', 164);
      if (owl.length > 2 || owl.some(function (l) { g.font = '600 ' + os + 'px Fredoka, sans-serif'; return g.measureText(l).width > 164; })) { os = 15; owl = wrap(g, w.owl + ' the owl', '600 15px Fredoka, sans-serif', 164).slice(0, 2); }
      var oy = FEET - 18 - (owl.length - 1) * (os + 2);
      if (im[2]) g.drawImage(im[2], 86, oy - 161, 140, 140);
      owl.forEach(function (l, i) { text(g, l, 156, oy + i * (os + 2), '600 ' + os + 'px Fredoka, sans-serif', NAVY); });
      text(g, 'Your tutor', 156, FEET, '400 13px Lexend, sans-serif', SOFT);
      text(g, 'Certificate of Achievement', 585, 112, '600 50px Fredoka, sans-serif', TEAL);
      // the name, made smaller if it is a long one
      var size = 68; g.font = '600 ' + size + 'px Fredoka, sans-serif'; while (g.measureText(w.name).width > 690 && size > 26) { size -= 2; g.font = '600 ' + size + 'px Fredoka, sans-serif'; }
      text(g, w.name, 585, RULE - 26, '600 ' + size + 'px Fredoka, sans-serif', NAVY);
      g.strokeStyle = GOLD_L; g.lineWidth = 3; g.beginPath(); g.moveTo(385, RULE); g.lineTo(785, RULE); g.stroke();
      // break at "by defeating", so the baddie's name and the place stay together
      var cut = w.line.indexOf(' by defeating '), lines = cut > 0 ? [w.line.slice(0, cut), w.line.slice(cut + 1)] : [w.line];
      lines = [].concat.apply([], lines.map(function (l) { return wrap(g, l, '400 26px Lexend, sans-serif', 860); }));
      lines.forEach(function (l, i) { text(g, l, 585, RULE + 40 + i * 35, '400 26px Lexend, sans-serif', NAVY); });
      // the animal, top right, in everything they have chosen to wear, its feet just below the line under the name
      // (its feet are 213 down the 220-high picture; the space above them is for tall hats)
      if (im[0]) g.drawImage(im[0], 918, FEET - 213, 202, 220);
      // the top skills, under three stars
      var sk = skills(p, y);
      if (sk.top.length) {
        [-22, 0, 22].forEach(function (dx) { star(g, 237 + dx, 383, 10, GOLD_L); });
        text(g, 'Top skills added', 237, 418, '600 22px Fredoka, sans-serif', TEAL);
        sk.top.forEach(function (it, i) {
          var yy2 = 442 + i * 22, label = it.title, fs = 14;
          for (var n = 0; n < 3; n++) star(g, 68 + n * 12, yy2 - 5, 5.5, n < it.stars ? GOLD_L : '#e4e9e6');
          g.font = '400 ' + fs + 'px Lexend, sans-serif';
          while (g.measureText(label).width > 316 && fs > 11) { fs -= 0.5; g.font = '400 ' + fs + 'px Lexend, sans-serif'; }
          if (g.measureText(label).width > 316) { while (g.measureText(label + '…').width > 316 && label.length > 4) label = label.slice(0, -1); label = label.trim() + '…'; }
          text(g, label, 106, yy2, '400 ' + fs + 'px Lexend, sans-serif', NAVY, 'left');
        });
        if (sk.more) text(g, '+ ' + sk.more + ' more with at least one star earned', 237, 442 + sk.top.length * 22 + 2, '400 13px Lexend, sans-serif', SOFT);
      }
      // "Well done!", centred like the words above it, and the year in numbers
      text(g, w.well, 585, RULE + 124, '600 30px Fredoka, sans-serif', '#a8780c');
      var fmt = OM.fmt || String, tiles = [
        [null, fmt(s.stars), many(s.stars, 'star') + ' earned, out of ' + fmt(s.maxStars)], [im[4], fmt(s.feathers), many(s.feathers, 'feather') + ' earned'], [im[5], fmt(s.acorns), many(s.acorns, 'acorn') + ' earned'],
        [im[6], fmt(s.questions), many(s.questions, 'question') + ' answered'], [im[7], s.guards + ' of ' + s.totalGuards, 'guards beaten'], [im[8], s.days ? fmt(s.days) : '–', many(s.days, 'day') + ' practised']];
      tiles.forEach(function (t, i) {
        var col = i % 3, row = Math.floor(i / 3), x = (sk.top.length ? 440 : 258) + col * 222, yy = RULE + 146 + row * 150, tw = 210, th = 136;
        rr(g, x, yy, tw, th, 16); g.fillStyle = TILE; g.fill(); g.strokeStyle = '#cfe2dc'; g.lineWidth = 1.5; g.stroke();
        if (t[0]) g.drawImage(t[0], x + tw / 2 - 16, yy + 10, 32, 32); else star(g, x + tw / 2, yy + 27, 17, GOLD_L);
        var ns = 40; g.font = '600 ' + ns + 'px Fredoka, sans-serif'; while (g.measureText(t[1]).width > tw - 16 && ns > 20) { ns -= 2; g.font = '600 ' + ns + 'px Fredoka, sans-serif'; }
        text(g, t[1], x + tw / 2, yy + 86, '600 ' + ns + 'px Fredoka, sans-serif', NAVY);
        var ls = 15; g.font = '400 ' + ls + 'px Lexend, sans-serif'; while (g.measureText(t[2]).width > tw - 10 && ls > 10) { ls -= 0.5; g.font = '400 ' + ls + 'px Lexend, sans-serif'; }
        text(g, t[2], x + tw / 2, yy + 116, '400 ' + ls + 'px Lexend, sans-serif', SOFT);
      });
      // along the bottom: the baddie small in the corner, the date in the middle, the logo and name together bottom right
      if (im[1]) g.drawImage(im[1], 54, 690, 68, 86);
      if (w.date) { text(g, w.date, 585, 726, '400 20px Lexend, sans-serif', NAVY); g.strokeStyle = SOFT; g.lineWidth = 1; g.beginPath(); g.moveTo(465, 736); g.lineTo(705, 736); g.stroke(); text(g, 'Date', 585, 756, '400 14px Lexend, sans-serif', SOFT); }
      if (im[3]) g.drawImage(im[3], 796, 688, 84, 84);
      text(g, 'Mayes Maths & More', 886, 733, '600 22px Fredoka, sans-serif', TEAL, 'left');
      text(g, 'Learning for Years 1 to 11', 886, 755, '400 13px Lexend, sans-serif', SOFT, 'left');
      return c;
    });
  }
  function fileName(p, y) { return (String(p.name).replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/g, '') || 'explorer') + '-year-' + y + '-certificate.pdf'; }
  function asFile(p, y) {
    return draw(p, y).then(function (c) {
      return new Promise(function (ok, no) { c.toBlob(function (b) { if (b) ok(b); else no(new Error('no picture')); }, 'image/jpeg', 0.93); });
    }).then(function (b) { return b.arrayBuffer(); }).then(function (buf) {
      var bytes = pdf(new Uint8Array(buf), W, H, 'Year ' + y + ' certificate for ' + p.name);
      return new File([bytes], fileName(p, y), { type: 'application/pdf' });
    });
  }
  OM.cert.file = asFile;
  // phones and tablets get the share sheet (save to Files, print, send to a grown-up); computers get a download
  OM.cert.save = function (p, y) {
    return asFile(p, y).then(function (file) {
      var touch = G.matchMedia && G.matchMedia('(pointer: coarse)').matches, nav = G.navigator;
      if (touch && nav.canShare && nav.canShare({ files: [file] })) return nav.share({ files: [file], title: file.name }).then(function () { return 'shared'; }).catch(function (e) { if (e && e.name === 'AbortError') return 'cancelled'; return download(file); });
      return download(file);
    });
  };
  function download(file) { var a = doc.createElement('a'); a.href = URL.createObjectURL(file); a.download = file.name; doc.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); return 'downloaded'; }
  // print just the certificate, filling the page
  OM.cert.print = function (p, y) {
    return draw(p, y).then(function (c) {
      var box = doc.createElement('div'), st = doc.createElement('style'), img = new Image();
      st.textContent = '@page { size: A4 landscape; margin: 0; } @media print { html, body { height: auto !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; background: #fff !important; } body > *:not(.certprint) { display: none !important; } .certprint { display: block !important; width: 297mm; height: 209mm; overflow: hidden; break-after: avoid; page-break-after: avoid; } .certprint img { width: 100%; height: 100%; object-fit: contain; display: block; } } .certprint { display: none; }';
      box.className = 'certprint'; box.appendChild(img);
      return new Promise(function (ok) {
        img.onload = function () {
          doc.head.appendChild(st); doc.body.appendChild(box);
          var done = function () { G.removeEventListener('afterprint', done); box.remove(); st.remove(); ok(); };
          G.addEventListener('afterprint', done);
          G.print();
        };
        img.src = c.toDataURL('image/jpeg', 0.93);
      });
    });
  };
  OM.cert.draw = draw;
})(typeof window !== 'undefined' ? window : globalThis);
