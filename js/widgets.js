/* Learn with Pip — answer widgets (one per kind of answer) and the on-screen keypad for tablets. */
(function (G) {
  'use strict';
  var OM = G.OM, W = OM.W = {};
  var doc = G.document;

  W.keypadOn = function () {
    var k = OM.Store.settings().keypad;
    if (k === 'on') return true;
    if (k === 'off') return false;
    return !!(G.matchMedia && G.matchMedia('(pointer: coarse)').matches);
  };
  var MODES = { digits: 'numeric', decimal: 'decimal', signed: 'text', signdec: 'text', time: 'text', roman: 'text', working: 'text', money: 'decimal', algebra: 'text' };
  function inp(keys, cls, ph, extra) {
    var mode = W.keypadOn() ? 'none' : (MODES[keys] || 'text');
    return '<input class="ans ' + (cls || '') + '" data-keys="' + (keys || 'digits') + '" inputmode="' + mode + '" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"' +
      (ph ? ' placeholder="' + OM.esc(ph) + '"' : '') + (extra || '') + '>';
  }
  function val(root, sel) { var e = root.querySelector(sel); return e ? e.value.trim() : ''; }

  // Returns a controller: { get(), disable(), focus() }
  // ---------- the symbol bar: the keys each kind of question needs ----------
  // [label, text inserted, tooltip]. "/" is always there for fractions (2/5, x = 7/2).
  var SYM = {
    '²': ['²', '²', 'Squared'], '³': ['³', '³', 'Cubed'], '^': ['^', '^', 'To the power, e.g. 10^6 or x^4'], '√': ['√', '√', 'Square root'], '/': ['/', '/', 'Fraction or divide, e.g. 2/5'],
    '×': ['×', '×', 'Times'], '÷': ['÷', '÷', 'Divide'], '+': ['+', '+', 'Add'], '−': ['−', '−', 'Minus or negative'], '=': ['=', '=', 'Equals'], '.': ['.', '.', 'Decimal point'],
    '(': ['(', '(', 'Open bracket'], ')': [')', ')', 'Close bracket'], '<': ['<', '<', 'Less than'], '>': ['>', '>', 'Greater than'], '≤': ['≤', '≤', 'Less than or equal to'], '≥': ['≥', '≥', 'Greater than or equal to'],
    'π': ['π', 'π', 'Pi'], '%': ['%', '%', 'Per cent'], '°': ['°', '°', 'Degrees'], '£': ['£', '£', 'Pounds'], ',': [',', ', ', 'Comma, e.g. for coordinates'],
    'std': ['×10ⁿ', ' × 10^', 'Times ten to the power (standard form)'], 'sin': ['sin', 'sin ', 'Sine'], 'cos': ['cos', 'cos ', 'Cosine'], 'tan': ['tan', 'tan ', 'Tangent']
  };
  var ORDER = ['²', '³', '^', '√', '/', '×', '÷', '+', '−', '=', '(', ')', '<', '>', '≤', '≥', '.', ',', 'π', '%', '°', '£', 'std', 'sin', 'cos', 'tan'];
  // working = true for the lines of working (which also need + and =); otherwise the answer box
  W.symbolsFor = function (q, working) {
    q = q || {};
    var c = q.check || {}, k = (c.kind === 'steps' || c.kind === 'working') && c.final ? c.final.kind : c.kind;
    var ob = OM.objectiveIndex && OM.objectiveIndex[q.objective], text = (String(q.prompt || '') + ' ' + String(q.visual || '') + ' ' + (ob ? ob.title : '')).replace(/<[^>]+>/g, ' ');
    var set = {
      expr: ['²', '³', '^', '√', '/', '×', '÷', '(', ')', '−'],
      solve: ['−', '/', '.', '²', '√', '^', '(', ')'],
      ineq: ['<', '>', '≤', '≥', '−', '/', '.'],
      stdform: ['std', '^', '−', '.'],
      pfactor: ['×', '^', '²', '³'],
      multi: ['(', ')', '−', '/', '^', '²', '.']
    }[k] || ['−', '.', '/', '×', '÷', '(', ')', '²', '√', '^'];
    set = set.concat(['/']); // always: fractions such as 2/5 or x = 7/2
    if (working) set.push('+', '−', '×', '÷', '=', '(', ')', '/', '.');
    if (/\bπ|circle|circumference|cylinder|sphere|cone|sector|\barc\b|semicircle|radius|diameter/i.test(text)) set.push('π');
    if (/\b(sin|cos|tan)\b|trigonometr|\bsine\b|cosine|angle of elevation|angle of depression|angle [A-Z]\b/i.test(text)) { set.push('sin', 'cos', 'tan'); if (working) set.push('°'); }
    else if (working && /°|angle|bearing/i.test(text)) set.push('°');
    if (working && /%/.test(text)) set.push('%');
    if (working && /£/.test(text)) set.push('£');
    if (/standard form|×\s*10\^?|× 10[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/.test(text) && k !== 'stdform') set.push('std');
    if (/³|cube|volume/i.test(text)) set.push('³');
    if (/[√]|surd|square root/i.test(text)) set.push('√');
    if (/[≤≥<>]|inequalit/.test(text) && (working || k === 'ineq')) set.push('<', '>', '≤', '≥');
    if (/coordinate|\(\s*−?\d+\s*,/.test(text) && k === 'multi') set.push(',');
    return ORDER.filter(function (x) { return set.indexOf(x) >= 0; });
  };
  function symbarHTML(keys) {
    return '<div class="symbar" aria-label="Insert a symbol">' + keys.map(function (k) { var d = SYM[k]; return '<button type="button" class="sym' + (d[0].length > 1 ? ' wide' : '') + '" data-sym="' + OM.esc(d[1]) + '" title="' + d[2] + '" aria-label="' + d[2] + '">' + d[0] + '</button>'; }).join('') + '</div>';
  }

  W.render = function (host, q, opts) {
    opts = opts || {};
    var I = q.input, t = I.type, ctl = { get: function () { return null; } };
    host.innerHTML = '';
    var box = doc.createElement('div'); box.className = 'widget w-' + t; host.appendChild(box);

    if (t === 'number' || t === 'text') {
      box.innerHTML = '<label class="ansline">' + (I.prefix ? '<span class="unit">' + I.prefix + '</span>' : '') + inp(I.keys, t === 'text' ? 'wide' : '', I.placeholder) +
        (I.suffix ? '<span class="unit">' + I.suffix + '</span>' : '') + '</label>' +
        (I.keys === 'algebra' ? symbarHTML(W.symbolsFor(q, false)) : '');
      box.querySelectorAll('.sym').forEach(function (b) {
        b.onmousedown = function (e) { e.preventDefault(); };
        b.onclick = function () {
          var f = box.querySelector('input'); if (!f || f.disabled) return;
          var a = f.selectionStart === null ? f.value.length : f.selectionStart, z = f.selectionEnd === null ? a : f.selectionEnd, k = b.getAttribute('data-sym');
          f.value = f.value.slice(0, a) + k + f.value.slice(z); f.focus(); f.setSelectionRange(a + k.length, a + k.length); if (opts.onChange) opts.onChange();
        };
      });
      ctl.get = function () { return val(box, 'input'); };
    }
    else if (t === 'choice') {
      box.innerHTML = '<div class="choices' + (I.big ? ' big' : '') + (I.nvr ? ' nvr' : '') + '">' + I.options.map(function (o) { return '<button type="button" class="choice" data-v="' + OM.esc(o.value) + '">' + o.label + '</button>'; }).join('') + '</div>';
      var chosen = null;
      box.querySelectorAll('.choice').forEach(function (b) {
        b.onclick = function () { if (box.classList.contains('locked')) return; box.querySelectorAll('.choice').forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); chosen = b.getAttribute('data-v'); OM.sfx.tap(); if (opts.onChange) opts.onChange(); };
      });
      ctl.get = function () { return chosen; };
    }
    else if (t === 'multi') {
      var html = I.template.replace(/\{(\d+)\}/g, function (m, i) {
        var b = I.blanks[+i] || {};
        if (b.select) return '<select class="ans sel" data-i="' + i + '"><option value="">…</option>' + b.select.map(function (s) { return '<option>' + s + '</option>'; }).join('') + '</select>';
        return inp(b.keys, 'blank' + (b.small ? ' small' : ''), '', ' data-i="' + i + '"');
      });
      box.innerHTML = '<div class="template">' + html + '</div>';
      ctl.get = function () { var out = []; box.querySelectorAll('[data-i]').forEach(function (e) { out[+e.getAttribute('data-i')] = e.value.trim(); }); return out; };
    }
    else if (t === 'fraction') {
      box.innerHTML = '<div class="fracin">' + (I.mixed ? '<div class="whole">' + inp('digits', 'w', '', ' aria-label="whole number"') + '<small>whole<br>(if any)</small></div>' : '') +
        '<div class="fstack">' + inp('digits', 'n', '', ' aria-label="numerator"') + '<span class="bar"></span>' + inp('digits', 'd', '', ' aria-label="denominator"') + '</div></div>';
      ctl.get = function () { return { w: val(box, 'input.w'), n: val(box, 'input.n'), d: val(box, 'input.d') }; };
    }
    else if (t === 'coord') {
      box.innerHTML = '<div class="coordin"><span>(</span>' + inp('digits', 'x', 'x') + '<span>,</span>' + inp('digits', 'y', 'y') + '<span>)</span></div>';
      ctl.get = function () { return { x: val(box, 'input.x'), y: val(box, 'input.y') }; };
    }
    else if (t === 'column') {
      var a = String(I.a), b2 = String(I.b), op = I.op;
      var width = op === '−' ? Math.max(a.length, b2.length) : Math.max(a.length, b2.length) + 1;
      var row = function (s, pre) { var h = '<tr><td class="op">' + (pre || '') + '</td>'; for (var i = width - 1; i >= 0; i--) h += '<td>' + (i < s.length ? s[s.length - 1 - i] : '') + '</td>'; return h + '</tr>'; };
      var cells = function (cls, keys) { var h = '<tr class="' + cls + '"><td class="op"></td>'; for (var i = width - 1; i >= 0; i--) h += '<td>' + inp('digits', cls + 'c', '', ' maxlength="1" data-col="' + i + '"') + '</td>'; return h + '</tr>'; };
      var hcol = '<tr class="heads"><td></td>' + ['TM', 'M', 'HTh', 'TTh', 'Th', 'H', 'T', 'O'].slice(8 - width).map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>';
      box.innerHTML = '<table class="colw">' + hcol + (op === '−' ? cells('exch') : '') + row(a, '') + row(b2, op) + cells('ans') + (op !== '−' ? cells('carry') : '') + '</table>' +
        '<p class="small-note">Type the answer digits in the boxes, starting with the ones (right). ' + (op === '−' ? 'Use the small top boxes for exchanges if you like.' : 'Use the small boxes under the line for exchanged digits if you like.') + '</p>';
      var ansCells = Array.prototype.slice.call(box.querySelectorAll('input.ansc'));
      ansCells.forEach(function (c, idx) {
        c.addEventListener('input', function () { c.value = c.value.replace(/\D/g, '').slice(-1); if (c.value && idx > 0) ansCells[idx - 1].focus(); });
        c.addEventListener('keydown', function (e) { if (e.key === 'Backspace' && !c.value && idx < ansCells.length - 1) { ansCells[idx + 1].focus(); } });
      });
      box.querySelectorAll('input.exchc, input.carryc').forEach(function (c) { c.addEventListener('input', function () { c.value = c.value.replace(/\D/g, '').slice(-2); }); });
      ctl.get = function () {
        var digs = ansCells.map(function (c) { return c.value.trim(); });
        var s = digs.join('|').replace(/^(\|)+/, '');
        while (digs.length && digs[0] === '') digs.shift();
        var answer = digs.some(function (d) { return d === ''; }) ? digs.map(function (d) { return d || ' '; }).join('') : digs.join('');
        return { answer: answer, cells: digs, raw: s };
      };
      ctl.focus = function () { ansCells[ansCells.length - 1].focus(); };
    }
    else if (t === 'tapgrid') {
      var cols = I.cols, rows = I.rows, fixed = {}, on = {};
      (I.fixed || []).forEach(function (k) { fixed[k] = 1; });
      var m = I.mirror, g = '<div class="tapgrid" style="grid-template-columns:repeat(' + cols + ',1fr)">';
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
        var key = x + ',' + y, editable = !fixed[key] && (!m || (m.type === 'v' ? x >= m.at : y >= m.at));
        var cls = 'cell' + (fixed[key] ? ' fixed' : '') + (editable ? ' edit' : ' locked') + (m && m.type === 'v' && x === m.at ? ' mirror-l' : '') + (m && m.type === 'h' && y === m.at ? ' mirror-t' : '');
        g += '<button type="button" class="' + cls + '" data-k="' + key + '" aria-label="square ' + (x + 1) + ', ' + (y + 1) + '"></button>';
      }
      box.innerHTML = g + '</div><button type="button" class="btn ghost small clear">Clear my squares</button>';
      box.querySelectorAll('.cell.edit').forEach(function (c) {
        c.onclick = function () { if (box.classList.contains('locked')) return; var k = c.getAttribute('data-k'); if (on[k]) { delete on[k]; c.classList.remove('on'); } else { on[k] = 1; c.classList.add('on'); } OM.sfx.tap(); };
      });
      box.querySelector('.clear').onclick = function () { on = {}; box.querySelectorAll('.cell.on').forEach(function (c) { c.classList.remove('on'); }); };
      ctl.get = function () { return Object.keys(on); };
    }
    else if (t === 'order') {
      var picked = [];
      box.innerHTML = '<div class="order-src">' + I.items.map(function (it) { return '<button type="button" class="choice" data-v="' + OM.esc(it.value) + '">' + it.label + '</button>'; }).join('') + '</div>' +
        '<div class="order-dst"><span class="lbl">Your order:</span> <span class="seq"><em>tap the items above</em></span></div><button type="button" class="btn ghost small reset">Start again</button>';
      var draw = function () {
        box.querySelector('.seq').innerHTML = picked.length ? picked.map(function (v, i) { var it = I.items.filter(function (x) { return x.value === v; })[0]; return '<span class="chip">' + (i + 1) + '. ' + it.label + '</span>'; }).join(' ') : '<em>tap the items above</em>';
        box.querySelectorAll('.order-src .choice').forEach(function (b) { b.disabled = picked.indexOf(b.getAttribute('data-v')) >= 0; });
      };
      box.querySelectorAll('.order-src .choice').forEach(function (b) { b.onclick = function () { if (box.classList.contains('locked')) return; picked.push(b.getAttribute('data-v')); OM.sfx.tap(); draw(); }; });
      box.querySelector('.reset').onclick = function () { picked = []; draw(); };
      ctl.get = function () { return picked.slice(); };
    }
    else if (t === 'steps') {
      // GCSE-style working space: lined steps (marked for method), then the answer in its own box (any answer type)
      var n0 = I.lines || 4, lastField = null;
      var lineHTML = function (i) { return '<div class="wline"><span>' + i + '</span>' + inp('algebra', 'wl', i === 1 ? (I.firstHint || 'first step') : '') + '</div>'; };
      box.innerHTML = '<div class="working paper"><div class="wlabel">' + OM.icon('pencil', { size: 18 }) + ' Working <small>one step per line, e.g. ' + OM.esc(I.example || '3x + 6 = 21') + '</small></div><div class="wlines">' +
        Array.apply(null, Array(n0)).map(function (_, i) { return lineHTML(i + 1); }).join('') + '</div>' +
        '<div class="wtools"><button type="button" class="link addline">+ Add a line</button>' + symbarHTML(W.symbolsFor(q, true)) + '</div></div>' +
        '<div class="final-wrap"><span class="final-lab">Answer</span><div class="final-host"></div></div>' +
        '<p class="small-note">' + (I.marks || 2) + ' marks. Method marks (M) are given for correct steps in your working, even if the final answer is wrong.</p>';
      var inner = W.render(box.querySelector('.final-host'), { input: I.final, check: q.check, prompt: q.prompt, visual: q.visual }, { onChange: opts.onChange });
      box.addEventListener('focusin', function (e) { if (e.target.matches('input')) lastField = e.target; });
      box.querySelector('.addline').onclick = function () { var wl = box.querySelector('.wlines'), k = wl.children.length + 1; if (k > 10) return; wl.insertAdjacentHTML('beforeend', lineHTML(k)); wl.lastChild.querySelector('input').focus(); };
      box.querySelectorAll('.wtools .sym').forEach(function (b) {
        b.onmousedown = function (e) { e.preventDefault(); };
        b.onclick = function () { var f = lastField || box.querySelector('input.wl'); if (!f || f.disabled) return; var a = f.selectionStart === null ? f.value.length : f.selectionStart, z = f.selectionEnd === null ? a : f.selectionEnd, k = b.getAttribute('data-sym'); f.value = f.value.slice(0, a) + k + f.value.slice(z); f.focus(); f.setSelectionRange(a + k.length, a + k.length); };
      });
      // Enter in a working line moves to the next line; Enter in the answer box checks the answer
      box.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' || !e.target.matches('input.wl')) return;
        e.preventDefault(); e.stopImmediatePropagation();
        var all = Array.prototype.slice.call(box.querySelectorAll('input.wl')), i = all.indexOf(e.target);
        if (i < all.length - 1) all[i + 1].focus(); else { var fin = box.querySelector('.final-host input, .final-host button'); if (fin) fin.focus(); }
      });
      ctl.get = function () { return { lines: Array.prototype.map.call(box.querySelectorAll('input.wl'), function (e) { return e.value; }), answer: inner.get() }; };
      ctl.focus = function () { var f = box.querySelector('input.wl'); if (f && !W.keypadOn()) f.focus(); };
    }
    else if (t === 'working') {
      box.innerHTML = '<div class="working"><div class="wlabel">Show your working <small>(e.g. 345 + 278 = 623)</small></div>' +
        [1, 2, 3].map(function (i) { return '<div class="wline"><span>' + i + '</span>' + inp('working', 'wl', '') + '</div>'; }).join('') +
        '</div><label class="ansline final"><b>Answer:</b> ' + inp(I.moneyAnswer ? 'money' : 'digits', 'fa', I.moneyAnswer ? 'e.g. £2.79' : '') + '</label>' +
        '<p class="small-note">This question is worth 2 marks. A correct method can earn 1 mark even if the answer is wrong.</p>';
      ctl.get = function () { return { lines: Array.prototype.map.call(box.querySelectorAll('input.wl'), function (e) { return e.value; }), answer: val(box, 'input.fa') }; };
    }

    ctl.disable = function () { box.classList.add('locked'); box.querySelectorAll('input,select').forEach(function (e) { e.disabled = true; }); box.querySelectorAll('button').forEach(function (b) { b.disabled = true; }); };
    ctl.focus = ctl.focus || function () { var f = box.querySelector('input,select'); if (f && !W.keypadOn()) f.focus(); };
    // Enter with an answer box still empty moves to the next empty box (like Tab) instead of marking a half-finished answer.
    // Working lines, exchange/carry boxes and the "whole (if any)" box are optional, so they never hold Enter up.
    function nextEmpty(from) {
      var col = box.querySelectorAll('input.ansc');
      if (col.length) { var any = Array.prototype.some.call(col, function (c) { return c.value.trim(); }); return any ? null : col[col.length - 1]; } // column sums: start at the ones
      var need = Array.prototype.filter.call(box.querySelectorAll('input, select, textarea'), function (f) {
        return !f.disabled && f.type !== 'hidden' && f.offsetParent !== null && !f.matches('input.wl, input.w, input.exchc, input.carryc');
      });
      var empty = need.filter(function (f) { return !String(f.value).trim(); });
      if (!empty.length) return null;
      var i = need.indexOf(from);
      return empty.filter(function (f) { return need.indexOf(f) > i; })[0] || empty[0];
    }
    if (opts.onEnter) box.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault(); if (e.repeat) return;
      var gap = nextEmpty(e.target);
      if (gap) { gap.focus(); gap.classList.remove('needfill'); void gap.offsetWidth; gap.classList.add('needfill'); return; }
      opts.onEnter();
    });
    return ctl;
  };

  // Display a response the way a marker would read it
  W.describe = function (q, r) {
    var I = q.input;
    if (r === null || r === undefined) return '<em>no answer</em>';
    switch (I.type) {
      case 'choice': var o = I.options.filter(function (x) { return String(x.value) === String(r); })[0]; return o ? o.label : '<em>no answer</em>';
      case 'multi': return I.template.replace(/\{(\d+)\}/g, function (m, i) { return '<u>' + (OM.esc(r[+i] || '') || '&nbsp;?&nbsp;') + '</u>'; });
      case 'fraction': return r.n || r.d ? (r.w ? r.w + ' ' : '') + OM.esc(r.n) + '/' + OM.esc(r.d) : '<em>no answer</em>';
      case 'coord': return '(' + OM.esc(r.x || '?') + ', ' + OM.esc(r.y || '?') + ')';
      case 'column': return OM.esc(r.answer || '') || '<em>no answer</em>';
      case 'tapgrid': return r.length + ' square' + (r.length === 1 ? '' : 's') + ' shaded';
      case 'order': return r.length ? r.map(function (v) { var it = I.items.filter(function (x) { return x.value === v; })[0]; return it ? it.label : v; }).join(', ') : '<em>no answer</em>';
      case 'working': return (r.lines || []).filter(function (l) { return l.trim(); }).map(OM.esc).join('<br>') + (r.answer ? '<br><b>Answer: ' + OM.esc(r.answer) + '</b>' : '<br><em>no final answer</em>');
      case 'steps': var ls = (r.lines || []).filter(function (l) { return String(l).trim(); }); return (ls.length ? '<span class="wshow">' + ls.map(function (l, i) { return '<span>' + (i + 1) + '. ' + OM.esc(l) + '</span>'; }).join('') + '</span>' : '<em>no working</em>') + '<br><b>Answer:</b> ' + W.describe({ input: I.final }, r.answer);
      default: return OM.esc(r) || '<em>no answer</em>';
    }
  };

  // ---------- On-screen keypad ----------
  var KEYS = {
    digits: ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'],
    signed: ['7', '8', '9', '4', '5', '6', '1', '2', '3', '−', '0'],
    signdec: ['7', '8', '9', '4', '5', '6', '1', '2', '3', '−', '.', '0'],
    decimal: ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0'],
    money: ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '£', 'p'],
    time: ['7', '8', '9', '4', '5', '6', '1', '2', '3', ':', '0', ' am', ' pm'],
    roman: ['I', 'V', 'X', 'L', 'C'],
    working: ['7', '8', '9', '+', '4', '5', '6', '−', '1', '2', '3', '×', '0', '.', '=', '÷'],
    algebra: ['7', '8', '9', 'x', 'y', '4', '5', '6', 'a', 'n', '1', '2', '3', '+', '−', '0', '.', '²', '(', ')', '×', '÷', '<', '>', '=']
  };
  var pad = null, target = null;
  function buildPad() {
    pad = doc.createElement('div'); pad.className = 'keypad hidden'; pad.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(pad);
    pad.addEventListener('mousedown', function (e) { e.preventDefault(); });
    pad.addEventListener('touchstart', function (e) { if (e.target.closest('button')) e.preventDefault(); }, { passive: false });
    pad.addEventListener('touchend', function (e) { var b = e.target.closest('button'); if (b) { e.preventDefault(); press(b.getAttribute('data-k')); } });
    pad.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) press(b.getAttribute('data-k')); });
  }
  function press(k) {
    if (!target) return;
    OM.sfx.tap();
    if (k === 'hide') { hide(); return; }
    if (k === 'next') { var all = Array.prototype.slice.call(doc.querySelectorAll('input.ans:not([disabled])')), i = all.indexOf(target); if (all[i + 1]) all[i + 1].focus(); else hide(); return; }
    var s = target.selectionStart === null || target.selectionStart === undefined ? target.value.length : target.selectionStart, e2 = target.selectionEnd === null || target.selectionEnd === undefined ? s : target.selectionEnd;
    if (k === 'back') {
      if (s === e2 && s > 0) s--;
      target.value = target.value.slice(0, s) + target.value.slice(e2);
    } else {
      var max = +target.getAttribute('maxlength') || 0;
      if (max && target.value.length >= max && s === e2) target.value = '';
      target.value = target.value.slice(0, s) + k + target.value.slice(e2);
      s += k.length;
    }
    try { target.setSelectionRange(s, s); } catch (err) { /* some inputs do not support selection */ }
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function show(inputEl) {
    if (!pad) buildPad();
    target = inputEl;
    var set = KEYS[inputEl.getAttribute('data-keys')] || KEYS.digits;
    pad.innerHTML = '<div class="keys k' + set.length + '">' + set.map(function (k) { return '<button type="button" data-k="' + k + '">' + k.trim() + '</button>'; }).join('') +
      '</div><div class="keys-side"><button type="button" data-k="back" class="kb">⌫</button><button type="button" data-k="next" class="kn">Next box</button><button type="button" data-k="hide" class="kh">Done</button></div>';
    pad.classList.remove('hidden'); doc.body.classList.add('pad-open');
  }
  function hide() { if (pad) pad.classList.add('hidden'); doc.body.classList.remove('pad-open'); target = null; }
  W.hideKeypad = hide;
  if (doc) doc.addEventListener('focusin', function (e) {
    var t = e.target;
    if (t && t.matches && t.matches('input.ans') && W.keypadOn()) show(t);
  });
})(typeof window !== 'undefined' ? window : globalThis);
