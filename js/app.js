/* Learn with Pip — the app: screens, game loop, tests and the grown-ups' area. */
(function (G) {
  'use strict';
  var OM = G.OM, S = OM.Store, V = OM.V, W = OM.W, doc = G.document;
  var root = doc.getElementById('app');
  var App = OM.App = { stack: [], profile: null };
  // each profile has a school year: it picks the curriculum, the adventure (world) and how grown-up the characters look
  function yearOf(p) { p = p || App.profile; return (p && p.year) || 4; }
  function CUR(p) { return OM.CURRICULUM['Y' + yearOf(p)] || OM.CURRICULUM.Y4; }
  function WORLD(p) { return OM.worldFor(yearOf(p)); }
  // progress on guards and papers is kept per year (Year 4 keeps its original keys)
  function ykey(k, p) { var y = yearOf(p); return y === 4 ? k : 'Y' + y + ':' + k; }
  function guardBeaten(r, p) { p = p || App.profile; return !!(p.guards || {})[ykey(r.id, p)]; }
  function escaped(p) { p = p || App.profile; return yearOf(p) === 4 ? !!p.escaped : !!(p.escapedYears || {})[yearOf(p)]; }
  function setEscaped(p) { p.finished = p.finished || {}; p.finished[yearOf(p)] = { d: OM.dayKey ? OM.dayKey(Date.now()) : new Date().toISOString().slice(0, 10), b: baddie(p).id }; if (yearOf(p) === 4) p.escaped = true; else { p.escapedYears = p.escapedYears || {}; p.escapedYears[yearOf(p)] = true; } }
  function tier(p) { p = p || App.profile || {}; var own = OM.tierForYear(yearOf(p)); return p.look && OM.tierIndex(p.look) >= 0 && OM.tierIndex(p.look) <= OM.tierIndex(own) ? p.look : own; }
  function tablesFor(y) { return y <= 1 ? [] : y === 2 ? [2, 5, 10] : y === 3 ? [2, 3, 4, 5, 8, 10] : [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }
  var LEVEL_NAMES = { 1: 'Getting there', 2: 'Expected', 3: 'Greater depth' };
  // GCSE years show grade bands; Foundation-tier students practise up to the Grade 4–5 band
  var GRADE_NAMES = { 1: 'Grade 1–3', 2: 'Grade 4–5', 3: 'Grade 6–7' };
  var HIGHER_NAMES = { 1: 'Grade 6', 2: 'Grade 7', 3: 'Grade 8–9' };
  function LV(L, p, tier) { return (tier === 'H' ? HIGHER_NAMES : yearOf(p) >= 10 ? GRADE_NAMES : LEVEL_NAMES)[L]; }
  function maxLevel(p) { return yearOf(p) >= 10 && (p || App.profile || {}).tier === 'foundation' ? 2 : 3; }
  // ---------- helpers ----------
  function esc(s) { return OM.esc(s); }
  function owl(mood, size, p) { p = p || App.profile || {}; var w = p.wearing || {}; return OM.owlSVG({ mood: mood, size: size, colour: p.colour, cls: mood === 'cheer' ? 'hopup' : '', tier: tier(p) }); }
  // the player's own animal, and the baddie they chose (the Cat King unless they picked another)
  // Years 7 to 11 have a more life-like animal, more so each year (0.2 in Year 7 up to 1 in Year 11), unless they chose an earlier look
  function realFor(p) { p = p || App.profile || {}; return tier(p) === 'pro' ? Math.min(1, Math.max(0.2, (yearOf(p) - 6) / 5)) : 0; }
  function avatar(size, p, mood, wear) { p = p || App.profile || {}; var w = wear || p.wearing || {}; return OM.animalSVG(p.avatar || 'otter', { role: 'avatar', size: size, mood: mood, wear: w, tier: tier(p), real: realFor(p) }); }
  function baddie(p) { p = p || App.profile || {}; return OM.BADDIES[p.baddie] || OM.BADDIES.cat; }
  function kingName(cap, p) { var t = baddie(p).title; return cap ? t.charAt(0).toUpperCase() + t.slice(1) : t; }
  function kingSVG(size, p) { return OM.animalSVG(baddie(p).id, { role: 'king', size: size, tier: tier(p), real: realFor(p) }); }
  function guardName(r, p) { var b = baddie(p); return (b.guards && b.guards[r.id]) || r.guard || 'The guard'; }
  function guardSVG(r, size, p) {
    var b = baddie(p), gi = CUR(p).regions.indexOf(r), t = tier(p);
    if (b.id !== 'cat') return OM.animalSVG(b.id, { role: 'guard', colour: r.color, size: size, tier: t, real: realFor(p) });
    var fur = OM.GUARD_FURS[Math.max(0, gi) % OM.GUARD_FURS.length];
    return OM.animalSVG('cat', { role: 'guard', fur: fur[0], dark: fur[1], colour: r.color, size: size, tier: t, real: realFor(p) });
  }
  // real: draw the choices in the child's own look (life-like for Years 7 to 11)
  function avatarPicker(sel, bad, real) {
    return '<div class="picker">' + OM.AVATARS.map(function (a) {
      var ok = OM.avatarAllowed(a.id, bad);
      return '<label class="pick' + (ok ? '' : ' off') + '"><input type="radio" name="avatar" value="' + a.id + '"' + (a.id === sel ? ' checked' : '') + (ok ? '' : ' disabled') + '>' +
        OM.animalSVG(a.id, { size: 62, real: real || 0 }) + '<span>' + esc(a.name) + '</span></label>';
    }).join('') + '</div><p class="small-note pick-note"></p>';
  }
  function baddiePicker(sel, real) {
    return '<div class="picker wide">' + Object.keys(OM.BADDIES).map(function (id) {
      var b = OM.BADDIES[id];
      return '<label class="pick"><input type="radio" name="baddie" value="' + id + '"' + (id === sel ? ' checked' : '') + '>' + OM.animalSVG(id, { role: 'king', size: 62, real: real || 0 }) + '<span>' + b.short + '</span></label>';
    }).join('') + '</div>';
  }
  // keep the two pickers fair: the baddie's animal cannot also be the player's animal
  function syncPickers(box) {
    var bad = (box.querySelector('[name="baddie"]:checked') || {}).value || 'cat', note = box.querySelector('.pick-note'), moved = '';
    box.querySelectorAll('[name="avatar"]').forEach(function (r) { var ok = OM.avatarAllowed(r.value, bad); r.disabled = !ok; r.closest('.pick').classList.toggle('off', !ok); if (!ok && r.checked) { r.checked = false; moved = r.value; } });
    if (moved) { var first = box.querySelector('[name="avatar"]:not(:disabled)'); first.checked = true; }
    if (note) note.textContent = bad === 'cat' || bad === 'fox' ? 'The ' + bad + ' can’t be your animal while ' + OM.BADDIES[bad].title + ' is the baddie.' : '';
  }
  function owlName() { return (App.profile && App.profile.owlName) || 'Pip'; }
  function T(s) { return String(s).replace(/\{owl\}/g, esc(owlName())).replace(/\bPip\b/g, esc(owlName())).replace(/\{King\}/g, esc(kingName(true))).replace(/\{king\}/g, esc(kingName())).replace(/\{laugh\}/g, esc(baddie().laugh)); }
  var I = OM.icon;
  function starsHTML(n) { return '<span class="stars" role="img" aria-label="' + n + ' of 3 stars">' + [1, 2, 3].map(function (i) { return OM.starIcon(i <= n); }).join('') + '</span>'; }
  function treeline() {
    var r = OM.makeRng(23), t = '';
    for (var x = -20; x < 1220; x += r.int(34, 60)) {
      var h = r.int(70, 170), w = h * .42, y = 240;
      t += '<g class="sway" style="animation-delay:-' + (r.next() * 6).toFixed(1) + 's"><path d="M' + x + ' ' + (y - h) + 'L' + (x + w) + ' ' + y + 'H' + (x - w) + 'Z" fill="' + r.pick(['#123a3c', '#15403f', '#184a45']) + '"/></g>';
    }
    return '<svg class="treeline" viewBox="0 0 1200 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + t + '</svg>';
  }
  function fireflies(n) {
    var r = OM.makeRng(11), s = '';
    for (var i = 0; i < (n || 18); i++) s += '<i style="left:' + r.int(2, 98) + '%;top:' + r.int(5, 95) + '%;animation-delay:' + (r.next() * 7).toFixed(2) + 's"></i>';
    return '<div class="fireflies" aria-hidden="true">' + s + '</div>';
  }
  // the forest area a topic belongs to (its colour carries into the topic's screens)
  function regionOf(objId) { var o = OM.objectiveIndex[objId]; var c = o && OM.CURRICULUM['Y' + o.year]; return (c && c.regions.filter(function (r) { return r.id === o.region; })[0]) || {}; }
  function region(id) { var c = /^x[a-z]$/.test(id) ? [OM.CURRICULUM.YXP, OM.CURRICULUM.YTR].filter(function (x) { return x && x.regions.some(function (r) { return r.id === id; }); })[0] : CUR(); return c.regions.filter(function (r) { return r.id === id; })[0]; }
  function elevenOn(p) { var y = yearOf(p); return !!OM.CURRICULUM.YXP && y >= 4 && y <= 6; }
  function toast(msg, cls) {
    var t = doc.createElement('div'); t.className = 'toast ' + (cls || ''); t.innerHTML = msg; doc.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 10); setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 400); }, 2600);
  }
  function confetti() {
    var c = doc.createElement('div'); c.className = 'confetti';
    for (var i = 0; i < 40; i++) { var s = doc.createElement('span'); s.style.left = Math.random() * 100 + '%'; s.style.background = ['#ffc53d', '#2f7a5f', '#4a5fd6', '#c0434b', '#7b5cc4'][i % 5]; s.style.animationDelay = Math.random() * 0.6 + 's'; c.appendChild(s); }
    doc.body.appendChild(c); setTimeout(function () { c.remove(); }, 2600);
  }
  function reward(feathers, acorns, why) {
    var p = App.profile; if (!p) return;
    if (acorns) { var wanted = acorns; acorns = OM.playtime.takeAcorns(p, acorns, Date.now()); if (acorns < wanted) bareTree(p); }
    S.earn(p, feathers, acorns); p.feathers += feathers || 0; p.acorns += acorns || 0; S.save();
    var b = doc.querySelector('.stat-f'); if (b) b.textContent = p.feathers;
    var a = doc.querySelector('.stat-a'); if (a) a.textContent = p.acorns;
    if (acorns) toast(I('acorn', { size: 18 }) + ' +' + acorns + ' acorn' + (acorns > 1 ? 's' : '') + (why ? ' — ' + why : ''), 'gold');
  }
  // all the acorns for today have been earned: said once a day, kindly, and the child can carry on for feathers and stars
  function bareTree(p) {
    if (p.acornDay.told) return;
    p.acornDay.told = true; S.save();
    gentlePop('acornTree', '<h2 id="gpTitle">The acorn tree is bare!</h2><p class="bigtext">You have collected all ' + OM.playtime.ACORNS_A_DAY + ' acorns for today. The acorns will grow back tomorrow.</p><p>You can still earn feathers and stars.</p>', [['ok', 'Keep going', true]]);
  }
  // a friendly pop-up from the owl: buttons are [action, words, main?]; a click closes it and runs the action
  function gentlePop(kind, words, buttons, onPick) {
    if (doc.querySelector('.gentle')) return;
    var box = doc.createElement('div'); box.className = 'ptover gentle ' + kind; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'gpTitle');
    box.innerHTML = '<div class="card ptcard">' + (kind === 'acornTree' ? '<div class="treeart" aria-hidden="true">' + I('tree', { size: 64, stroke: 1.8 }) + '</div>' : owl('happy', 90)) + words +
      '<div class="row ptbtns">' + buttons.map(function (b) { return '<button class="btn' + (b[2] ? ' big' : ' ghost') + '" data-gp="' + b[0] + '">' + b[1] + '</button>'; }).join('') + '</div></div>';
    OM.stopSpeaking(); W.hideKeypad(); root.inert = true;
    box.onclick = function (e) { var t = e.target.closest('[data-gp]'); if (!t) return; box.remove(); root.inert = false; if (onPick) onPick(t.getAttribute('data-gp')); };
    doc.body.appendChild(box); box.querySelector('button').focus();
  }
  function firstPracticeToday() {
    var p = App.profile, today = new Date().toISOString().slice(0, 10);
    if (p.lastBonus !== today) { p.lastBonus = today; reward(0, 2, 'first practice today'); }
  }

  // ---------- navigation ----------
  App.go = function (name, params, replace) {
    OM.stopSpeaking(); W.hideKeypad(); closeSoundPanel();
    if (App.cleanup) { App.cleanup(); App.cleanup = null; }
    if (replace) App.stack.pop();
    App.stack.push([name, params || {}]);
    render(name, params || {});
  };
  App.back = function () {
    OM.stopSpeaking(); W.hideKeypad(); closeSoundPanel();
    if (App.cleanup) { App.cleanup(); App.cleanup = null; }
    App.stack.pop();
    var top = App.stack[App.stack.length - 1] || ['home', {}];
    if (!App.stack.length) App.stack.push(top);
    render(top[0], top[1]);
  };
  function render(name, params) {
    G.scrollTo(0, 0);
    var s = Screens[name];
    root.innerHTML = '';
    root.className = 'screen-' + name;
    doc.body.style.setProperty('--world', App.profile ? WORLD().page : '#0e2a2f');
    applyFont();
    s(params);
    limitCheck();
  }
  function header(title, opts) {
    opts = opts || {};
    var p = App.profile;
    return '<header class="top" style="' + (opts.color ? '--top-accent:' + opts.color : '') + '">' +
      (opts.noBack ? '<span></span>' : '<button class="hbtn" data-act="back" aria-label="Back">' + I('back', { size: 26, stroke: 2.5 }) + '</button>') +
      '<h1><span class="brandmini" title="' + OM.APP_NAME + '">' + OM.logoMark({ size: 34, decorative: true }) + '</span>' + (opts.icon ? I(opts.icon, { size: 26 }) : '') + '<span>' + title + '</span></h1>' +
      '<div class="hright">' + soundBtn() + (p ? '<div class="hstats"><span title="Feathers">' + I('feather', { size: 20 }) + '<b class="stat-f">' + p.feathers + '</b><span class="sr">feathers</span></span><span title="Acorns">' + I('acorn', { size: 20 }) + '<b class="stat-a">' + p.acorns + '</b><span class="sr">acorns</span></span></div>' : '') +
        (p ? '<button class="hbtn pbtn" data-act="switchPlayer" title="Change player" aria-label="Change player (now ' + esc(p.name) + ')">' + OM.animalSVG(p.avatar || 'otter', { size: 30, tier: tier(p), real: realFor(p), wear: p.wearing }) + '<span class="pname">' + esc(p.name) + '</span>' + I('swap', { size: 18, stroke: 2.4 }) + '</button>' : '') + '</div>' +
      '</header>';
  }
  // Keep maths readable when lines wrap: a number stays with its unit ("5 cm"), short sums stay on one line ("1,093 + 155").
  var UNIT_RX = /(\d) (cm²|m²|cm|mm|km|kg|ml|m|g|l|p|°C|minutes?|hours?|seconds?|days?|weeks?|months?|years?|squares?|marks?)(?=[\s.,;:!?)]|$)/g;
  var NB = String.fromCharCode(160);
  var OP_RX = /(\S) ([+−×÷=<>]) (?=\S)/g;
  function tidyWrap(el) {
    var w = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n, list = [];
    while ((n = w.nextNode())) if (!n.parentNode.closest('svg, script, style, textarea')) list.push(n);
    list.forEach(function (t) { var v = t.nodeValue, nv = v.replace(UNIT_RX, '$1' + NB + '$2').replace(OP_RX, '$1' + NB + '$2' + NB); if (nv !== v) t.nodeValue = nv; });
    Array.prototype.forEach.call(el.querySelectorAll('b, strong'), function (b) { if (!b.closest('svg') && b.textContent.length <= 24) b.classList.add('nw'); });
  }
  function mount(html, acts) {
    if (OM.calc) OM.calc.enable(false); // screens that allow a calculator switch it back on after mounting
    root.innerHTML = html;
    tidyWrap(root);
    root.querySelectorAll('form[data-nosubmit]').forEach(function (f) { f.onsubmit = function (e) { e.preventDefault(); }; });
    root.onclick = function (e) {
      var t = e.target.closest('[data-act]');
      if (!t || t.disabled) return;
      var a = t.getAttribute('data-act');
      if (a === 'back') return App.back();
      if (a === 'switchPlayer') {
        var cur = (App.stack[App.stack.length - 1] || [])[0];
        if ((cur === 'test' || cur === 'mtc') && !G.confirm('Leave this test and change player? Answers so far will not be saved.')) return;
        OM.stopSpeaking(); App.profile = null; App.stack = []; return App.go('home');
      }
      if (a === 'sound') return toggleSoundPanel(t);
      if (a === 'mute') { setMuted(OM.soundOn()); return toast(OM.soundOn() ? 'Sound on' : 'Sound off'); }
      if (a === 'say') {
        if (t.classList.contains('playing')) return OM.stopSpeaking();
        if (!OM.soundOn()) return toast('Sound is off. Tap the speaker button at the top to turn it on.');
        return OM.say(t.getAttribute('data-say') || (t.closest('[data-speak]') || {}).innerHTML || '', { force: true });
      }
      if (acts && acts[a]) acts[a](t.getAttribute('data-arg'), t, e);
    };
  }
  // ---------- sound and voice panel (open to everyone, no PIN needed) ----------
  function soundBtn(extra) {
    var on = OM.soundOn();
    return '<span class="sgroup ' + (extra || '') + '">' +
      '<button class="hbtn stoggle' + (on ? '' : ' off') + '" data-act="mute" aria-pressed="' + (on ? 'false' : 'true') + '" aria-label="Sound off" title="' + (on ? 'Sound is on: tap to turn it off' : 'Sound is off: tap to turn it on') + '">' + I(on ? 'speaker' : 'mute', { size: 24 }) + '</button>' +
      '<button class="hbtn sbtn" data-act="sound" aria-haspopup="dialog" aria-expanded="' + (doc.querySelector('.soundpop') ? 'true' : 'false') + '" aria-label="Sound, voice and motion settings" title="Sound, voice and motion settings">' + I('sliders', { size: 22 }) + '</button></span>';
  }
  function setMuted(m) {
    var s = S.settings(); s.muted = m; S.save();
    if (m) OM.stopSpeaking(); else OM.sfx.tap();
    refreshSoundBtns();
    doc.querySelectorAll('[name="soundOn"]').forEach(function (sw) { sw.checked = !m; sw.closest('.sc').querySelector('fieldset').disabled = m; });
  }
  function soundControls() {
    var s = S.settings(), vs = OM.voices(), cur = OM.currentVoiceId();
    return '<div class="sc">' +
      '<label class="switch"><input type="checkbox" name="soundOn"' + (s.muted ? '' : ' checked') + '><span class="track" aria-hidden="true"></span><span><b>Sound</b><small>Turn all sound on or off</small></span></label>' +
      '<fieldset' + (s.muted ? ' disabled' : '') + '><label class="switch"><input type="checkbox" name="sounds"' + (s.sounds ? ' checked' : '') + '><span class="track" aria-hidden="true"></span><span><b>Sound effects</b><small>Chimes for right answers and rewards</small></span></label>' +
      '<label>Read questions aloud<select name="readAloud"><option value="auto">Automatically</option><option value="tap">Only when I tap the speaker</option><option value="off">Never</option></select></label>' +
      (OM.canSpeak() ? (App.profile ? '<p class="small-note">Voice and speed for <b>' + esc(App.profile.name) + '</b>. Each explorer can choose their own.</p>' : '<p class="small-note">The family voice, used by any explorer who has not chosen their own.</p>') + (vs.length ? '<label>Voice<select name="voice">' + vs.map(function (v) { return '<option value="' + esc(v.id) + '"' + (v.id === cur ? ' selected' : '') + '>' + esc(v.name) + ' (' + v.accent + (v.offline ? '' : ', needs internet') + ')</option>'; }).join('') + '</select></label>'
        : '<p class="small-note">No English voices are installed on this device. On Windows, add one in Settings, Time and language, Speech.</p>') +
        '<label>Speed<input type="range" name="rate" min="0.6" max="1.2" step="0.05" value="' + OM.voiceRate() + '"></label>' +
        '<button type="button" class="btn small ghost" data-sc="test">' + I('speaker', { size: 20 }) + 'Hear this voice</button>' : '<p class="small-note">This browser cannot read aloud.</p>') +
      '</fieldset>' +
      '<label>Animations<select name="motion"><option value="auto">Follow this device (' + (G.matchMedia && G.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'off here' : 'on here') + ')</option><option value="on">Always on</option><option value="off">Off</option></select></label>' +
      '</div>';
  }
  function bindSoundControls(box, onChange) {
    var s = S.settings(), f = function (n) { return box.querySelector('[name="' + n + '"]'); };
    if (f('readAloud')) f('readAloud').value = s.readAloud;
    if (f('motion')) f('motion').value = s.motion || 'auto';
    box.onchange = box.oninput = function (e) {
      var t = e.target;
      if (t.name === 'soundOn') { if (e.type === 'change') setMuted(!t.checked); return; }
      if (t.name === 'sounds') s.sounds = t.checked;
      if (t.name === 'readAloud') s.readAloud = t.value;
      if (t.name === 'rate') { if (App.profile) App.profile.rate = +t.value; else s.rate = +t.value; }
      if (t.name === 'motion') { s.motion = t.value; s.motionChosen = true; applyMotion(); }
      if (t.name === 'voice') { OM.setVoice(t.value); if (e.type === 'change') OM.say('Hoo hoo! I will read the questions in this voice.', { force: true }); }
      S.save();
    };
    box.onclick = function (e) { if (e.target.closest('[data-sc="test"]')) OM.say('Hoo hoo! What is 7 times 8?', { force: true }); };
  }
  function refreshSoundBtns() { doc.querySelectorAll('.sgroup').forEach(function (g) { g.outerHTML = soundBtn(g.classList.contains('floating') ? 'floating' : ''); }); }
  function closeSoundPanel() { var pop = doc.querySelector('.soundpop'); if (pop) pop.remove(); doc.querySelectorAll('.sbtn').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); }); }
  function toggleSoundPanel(btn) {
    if (doc.querySelector('.soundpop')) return closeSoundPanel();
    var pop = doc.createElement('div'); pop.className = 'soundpop'; pop.setAttribute('role', 'dialog'); pop.setAttribute("aria-label", "Sound, voice and motion");
    pop.innerHTML = '<div class="sphead"><h3>Sound, voice and motion</h3><button class="hbtn spclose" aria-label="Close">' + I('x', { size: 22 }) + '</button></div>' + soundControls();
    doc.body.appendChild(pop); btn.setAttribute('aria-expanded', 'true');
    bindSoundControls(pop, refreshSoundBtns);
    pop.querySelector('.spclose').onclick = function () { closeSoundPanel(); var b = doc.querySelector('.sbtn'); if (b) b.focus(); };
    var first = pop.querySelector('input'); if (first) first.focus();
  }
  // Enter goes to the next question as soon as Next appears; a held-down Enter never skips a question
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    if (e.repeat) { if (doc.activeElement && doc.activeElement.tagName === 'BUTTON') e.preventDefault(); return; }
    if (e.defaultPrevented) return; // this Enter already checked the answer; the next Enter moves on
    var nb = doc.querySelector('#fb .nextbtn');
    if (nb && doc.activeElement !== nb && !doc.querySelector('.soundpop')) { e.preventDefault(); nb.click(); }
  });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && doc.querySelector('.soundpop')) { closeSoundPanel(); var b = doc.querySelector('.sbtn'); if (b) b.focus(); } });
  doc.addEventListener('click', function (e) { var pop = doc.querySelector('.soundpop'); if (pop && !pop.contains(e.target) && !e.target.closest('.sgroup')) closeSoundPanel(); });
  // voices can arrive a moment after the page loads: rebuild the open panel so the list appears
  OM.onVoicesChanged = function () { var pop = doc.querySelector('.soundpop'); if (pop && !pop.querySelector('[name="voice"]')) { var b = doc.querySelector('.sbtn'); closeSoundPanel(); if (b) toggleSoundPanel(b); } };

  // Read-aloud button: play while quiet, stop while the voice is reading this text
  function speakBtn(text) { return '<button class="speak" data-act="say" data-say="' + esc(OM.speakable(text)) + '" aria-label="Read aloud" title="Read aloud">' + I('playf', { size: 20 }) + '</button>'; }
  function setSpeakBtn(b, playing) {
    if (b.classList.contains('playing') === playing) return;
    b.classList.toggle('playing', playing);
    b.innerHTML = I(playing ? 'stopf' : 'playf', { size: 20 });
    b.setAttribute('aria-label', playing ? 'Stop reading' : 'Read aloud'); b.title = playing ? 'Stop reading' : 'Read aloud';
  }
  OM.onSpeech = function (text) {
    var hit = false;
    doc.querySelectorAll('.speak').forEach(function (b) {
      var say = b.getAttribute('data-say'), on = text !== null && !hit && (say === text || OM.speakable(say) === text);
      if (on) hit = true;
      setSpeakBtn(b, on);
    });
  };

  var Screens = {};

  // ---------- HOME: choose an explorer ----------
  var backupLater = false;
  function saveBackup() {
    S.settings().lastBackup = Date.now(); S.save();
    var b = new Blob([S.exportJSON()], { type: 'application/json' }), a = doc.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'owl-maths-backup-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
    toast('Back-up saved. Look for it in your downloads and keep it somewhere safe.');
  }
  function backupWords() {
    var s = S.settings();
    return !s.lastBackup ? 'No back-up has been made yet.' : 'A back-up is due: the last one was on ' + new Date(s.lastBackup).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) + '.';
  }
  Screens.home = function () {
    App.profile = null; applyFont();
    var ps = S.profiles();
    mount(treeline() + fireflies(22) + soundBtn('floating') + '<div class="home">' +
      '<h1 class="home-logo">' + OM.logo({ dark: true, size: 132, id: 'homeLogo' }) + '</h1><p class="with-pip">Maths from Year 1 to GCSE, plus 11+ practice. Join Pip the owl on an adventure for your school year.</p>' +
      (S.backupDue(Date.now()) && !backupLater ? '<div class="card backupnudge homebackup"><span>' + I('download', { size: 22 }) + '</span><p><b>For grown-ups:</b> ' + backupWords() + '</p><div class="row"><button class="btn small" data-act="backup">Save a back-up</button><button class="btn small ghost" data-act="later">Not now</button></div></div>' : '') +
      '<h2>Who is exploring today?</h2>' +
      '<div class="profiles">' + ps.map(function (p) {
        return '<button class="pcard" data-act="pick" data-arg="' + p.id + '">' + avatar(76, p) + '<b>' + esc(p.name) + '</b><span>Year ' + p.year + '</span><span>' + I('feather', { size: 16 }) + p.feathers + ' feathers</span></button>';
      }).join('') + '<button class="pcard add" data-act="add"><span class="plus">' + I('plus', { size: 32, stroke: 2.5 }) + '</span><b>Add an explorer</b></button></div>' +
      '<p class="homelinks"><button class="link" data-act="parent">' + I('lock', { size: 18 }) + 'Grown-ups’ area</button><a class="link" href="help.html?from=app">Help and contact</a><a class="link" href="about.html?from=app">About and privacy</a></p></div>', {
      pick: function (id) { var p = S.get(id); if (codeOn(p)) App.go('code', { id: id }); else enterAs(p); },
      add: function () { App.go('newProfile'); },
      backup: function () { saveBackup(); App.go('home', {}, true); },
      later: function () { backupLater = true; App.go('home', {}, true); },
      parent: function () { App.go('parent', {}); }
    });
  };

  // ---------- SECRET CODE: each explorer's own 3-number code, so nobody plays as someone else by accident ----------
  // A simple lock, like the grown-ups' PIN (not security). Grown-ups can turn it off or reset it for each child.
  function codeOn(p) { return p.codeOn !== false; }
  function enterAs(p) { App.profile = p; OM.TUTOR = p.owlName; App.go(p.introSeen ? 'map' : 'story', { part: 0 }, true); }
  Screens.code = function (pr) {
    var p = S.get(pr.id); if (!p) return App.go('home', {}, true);
    var setting = !p.code, first = pr.first || '', typed = '', wrong = 0;
    var title = !setting ? 'Hello, ' + esc(p.name) + '! Type your secret code.' : first ? 'Type your secret code again to check it.' : 'Make up a secret code, ' + esc(p.name) + '!';
    var help = !setting ? 'It is the 3 numbers that only you know.'
      : first ? 'Type the same 3 numbers.' : 'Choose 3 numbers that only you know, like 4 7 2. Keep it secret from the others, and try not to forget it!';
    mount(treeline() + fireflies(14) + '<main class="codepage"><div class="card codecard">' + avatar(96, p) +
      '<h2 id="codeh">' + title + '</h2><p class="muted" id="codehelp">' + help + '</p>' +
      '<div class="codedots" aria-live="polite">' + [0, 1, 2].map(function () { return '<span></span>'; }).join('') + '</div>' +
      '<div class="codepad">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'notme'].map(function (k) {
        return k === 'del' ? '<button data-act="k" data-arg="del" aria-label="Delete">' + I('back', { size: 24 }) + '</button>' : k === 'notme' ? '<button class="ghostk" data-act="notme">Not me</button>' : '<button data-act="k" data-arg="' + k + '">' + k + '</button>';
      }).join('') + '</div></div></main>', {
      k: function (k) { press(k); },
      notme: function () { App.go('home', {}, true); }
    });
    var dots = root.querySelectorAll('.codedots span'), card = root.querySelector('.codecard');
    // while making up a code the numbers show; when typing it in later they are hidden as dots
    function show() { dots.forEach(function (d, i) { d.className = i < typed.length ? 'on' : ''; d.textContent = setting && i < typed.length ? typed[i] : ''; }); }
    function press(k) {
      if (k === 'del') { typed = typed.slice(0, -1); return show(); }
      if (typed.length >= 3) return;
      typed += k; if (OM.sfx && OM.sfx.tap) OM.sfx.tap(); show();
      if (typed.length === 3) setTimeout(done, 220);
    }
    function done() {
      if (setting && !first) return App.go('code', { id: p.id, first: typed }, true);
      if (setting) {
        if (typed === first) { p.code = typed; S.save(); toast('Your secret code is saved. Remember it!'); return enterAs(p); }
        toast('Those did not match. Let’s start again.'); return App.go('code', { id: p.id }, true);
      }
      if (typed === p.code) return enterAs(p);
      OM.sfx.wrong(); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      wrong++; typed = ''; show();
      doc.getElementById('codeh').textContent = 'That is not the right code. Try again.';
      doc.getElementById('codehelp').textContent = wrong >= 3 ? 'Forgotten it? Ask a grown-up to reset your code in the Grown-ups’ area.' : 'It is the 3 numbers that only you know.';
    }
    function onKey(e) { if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('del'); else if (e.key === 'Escape') App.go('home', {}, true); }
    doc.addEventListener('keydown', onKey);
    App.cleanup = function () { doc.removeEventListener('keydown', onKey); };
    OM.autoSay(setting ? (first ? 'Type your secret code again to check it.' : 'Make up a secret code: three numbers that only you know.') : 'Type your secret code.');
  };

  Screens.newProfile = function () {
    var years = [];
    for (var y = 1; y <= 11; y++) { var has = !!OM.CURRICULUM['Y' + y]; years.push('<option value="' + y + '"' + (y === 4 ? ' selected' : '') + (has ? '' : ' disabled') + '>Year ' + y + (has ? ' · ' + OM.worldFor(y).name : ' (coming soon)') + '</option>'); }
    mount(header('New explorer') + '<main class="narrow"><form class="card form" id="f">' +
      '<label>Your first name<input name="name" required maxlength="20" autocomplete="off"></label>' +
      '<label>School year<select name="year">' + years.join('') + '</select></label>' +
      '<p class="small-note">New explorers start with ' + OM.playtime.START.day + ' minutes of play a day. A grown-up can change this in the grown-ups’ area.</p>' +
      '<fieldset><legend>Choose your animal</legend>' + avatarPicker('otter', 'cat') + '</fieldset>' +
      '<fieldset><legend>Choose the baddie who traps ' + 'Pip' + ' in the wood</legend>' + baddiePicker('cat') + '</fieldset>' +
      '<label>Name your owl tutor<input name="owl" value="Pip" maxlength="16" autocomplete="off"></label>' +
      '<fieldset><legend>Owl colour</legend><div class="swatches">' + Object.keys(OM.OWL_COLOURS).map(function (c, i) {
        return '<label class="sw"><input type="radio" name="colour" value="' + c + '"' + (i === 0 ? ' checked' : '') + '>' + OM.owlSVG({ colour: c, size: 54 }) + '<span>' + c + '</span></label>';
      }).join('') + '</div></fieldset>' +
      '<button class="btn big" type="submit">Start the adventure' + I('next', { size: 22, stroke: 2.5 }) + '</button></form></main>', {});
    var form = doc.getElementById('f');
    form.addEventListener('change', function (e) { if (e.target.name === 'baddie') syncPickers(form); });
    syncPickers(form);
    form.onsubmit = function (e) {
      e.preventDefault();
      var f = e.target, name = f.name.value.trim();
      if (!name) return;
      App.profile = S.addProfile(name, +f.year.value, f.owl.value.trim() || 'Pip', f.colour.value);
      App.profile.avatar = (f.querySelector('[name="avatar"]:checked') || {}).value || 'otter';
      App.profile.baddie = (f.querySelector('[name="baddie"]:checked') || {}).value || 'cat'; S.save();
      // first time in: make up a secret code (it can be turned off in the grown-ups' area)
      var np = App.profile; App.profile = null;
      App.go('code', { id: np.id }, true);
    };
  };

  // ---------- STORY ----------
  Screens.story = function (pr) {
    var STORY = WORLD().story, i = pr.part || 0, s = STORY[i], last = i === STORY.length - 1;
    mount(treeline() + fireflies(16) + '<div class="story">' + '<div class="story-art">' + (s.who === 'owl' ? owl(s.mood, 170) : s.who === 'both' ? '<div class="duo">' + avatar(130, null, 'cheer') + owl(s.mood, 150) + '</div>' : kingSVG(170)) + '</div>' +
      '<div class="bubble big" data-speak><p>' + T(s.text) + '</p>' + speakBtn(T(s.text)) + '</div>' +
      '<div class="row"><button class="btn ghost" data-act="skip">Skip story</button><button class="btn big" data-act="next">' + (last ? 'Let’s go!' : 'Next' + I('next', { size: 22, stroke: 2.5 })) + '</button></div></div>', {
      next: function () { if (last) { App.profile.introSeen = true; S.save(); App.go('map', {}, true); } else App.go('story', { part: i + 1 }, true); },
      skip: function () { App.profile.introSeen = true; S.save(); App.go('map', {}, true); }
    });
    OM.autoSay(T(s.text));
  };

  // ---------- MAP: each year has its own adventure (js/worlds.js) ----------
  // Pip's Trick Box as a treasure chest in the bottom corner of every map (clear of the clearings on every layout):
  // the lid lifts and sparkles while there are tricks in it without a star
  function trickChest(p) {
    if (!OM.CURRICULUM.YTR) return '';
    var objs = OM.tricksFor(yearOf(p)), got = objs.filter(function (o) { return S.stars(p, o.id) > 0; }).length, X = 885, Y = 548, open = got < objs.length;
    return '<g class="node chest' + (open ? ' shiny' : '') + '" data-act="tricks" tabindex="0" role="button" aria-label="Pip’s Trick Box: ' + got + ' of ' + objs.length + ' tricks with a star">' +
      '<circle class="halo" cx="' + X + '" cy="' + (Y - 6) + '" r="74" fill="url(#glowGold)"/>' +
      '<g transform="translate(' + X + ' ' + Y + ')">' +
      // the box: wood planks, gold bands and a lock
      '<path class="ring" d="M-44 -4 H44 V30 Q44 36 38 36 H-38 Q-44 36 -44 30 Z" fill="#8a5a2b" stroke="#3b230f" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M-44 12 H44" stroke="#6e4520" stroke-width="2.5"/><path d="M-30 -4 V36 M30 -4 V36" stroke="#e8b33a" stroke-width="7"/>' +
      '<rect x="-8" y="0" width="16" height="18" rx="3" fill="#f2c650" stroke="#3b230f" stroke-width="2.5"/><circle cx="0" cy="8" r="2.6" fill="#3b230f"/><path d="M0 9 V14" stroke="#3b230f" stroke-width="2.4" stroke-linecap="round"/>' +
      // gold and light spilling out under the lid
      '<path d="M-38 -6 Q0 -20 38 -6 Z" fill="#ffd56b"/><circle cx="-14" cy="-10" r="5" fill="#ffe9a6"/><circle cx="6" cy="-12" r="6" fill="#ffc53d"/><circle cx="22" cy="-9" r="4.5" fill="#ffe9a6"/>' +
      // the lid, propped open
      '<g class="lid"><path d="M-46 -6 Q-46 -40 0 -44 Q46 -40 46 -6 Z" transform="rotate(-14 -46 -6)" fill="#9c6630" stroke="#3b230f" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M-31 -9 Q-31 -38 -16 -42 M29 -9 Q29 -36 14 -42" transform="rotate(-14 -46 -6)" stroke="#e8b33a" stroke-width="7" fill="none"/></g>' +
      '<g class="sparks"><path d="M-30 -50 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 Z" fill="#fff4c2"/><path d="M26 -46 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 Z" fill="#fff4c2"/><path d="M0 -62 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 Z" fill="#fff4c2"/></g>' +
      '</g>' +
      '<rect class="lab" x="' + (X - 84) + '" y="' + (Y + 46) + '" width="168" height="48" rx="24" fill="#0e2a2f" fill-opacity=".92"/>' +
      '<text x="' + X + '" y="' + (Y + 67) + '" font-family="Fredoka, sans-serif" font-size="18" font-weight="600" text-anchor="middle" fill="#ffd56b">Pip’s Trick Box</text>' +
      '<text x="' + X + '" y="' + (Y + 86) + '" font-family="Lexend, sans-serif" font-size="13" text-anchor="middle" fill="#a9c4bd">★ ' + got + ' of ' + objs.length + ' tricks</text></g>';
  }
  function mapIcon(name, x, y, s, colour) { return '<g style="color:' + colour + '">' + I(name, { size: s, stroke: 2.2 }).replace('<svg ', '<svg x="' + (x - s / 2) + '" y="' + (y - s / 2) + '" ') + '</g>'; }
  Screens.map = function (pr) {
    var p = App.profile, W = WORLD(), regs = CUR().regions, N = regs.length, NODES = OM.mapNodes(N), GATE = OM.MAP_GATE;
    var beaten = regs.filter(function (r) { return guardBeaten(r); }).length;
    var pts = [[40, 610]].concat(NODES, [GATE]);
    var d = function (list) { return 'M' + list.map(function (n) { return n[0] + ' ' + n[1]; }).join(' L'); };
    // just beaten a guard: start at the place we came from and travel on to the next one (only once: coming back to the map later does not replay it)
    var walk = pr && pr.walk && beaten >= 1 && beaten <= N; if (pr) delete pr.walk;
    var full = pts.slice(0, Math.min(beaten, N) + 2), lit = walk ? full.slice(0, -1) : full, from = full[full.length - 2], to = full[full.length - 1];
    var nodes = regs.map(function (r, i) {
      var vis = r.objectives.filter(function (o) { return OM.objVisible(o, p); }), n = NODES[i], got = vis.filter(function (o) { return S.stars(p, o.id) > 0; }).length, done = guardBeaten(r), here = i === beaten;
      return '<g class="node' + (done || here ? ' lit' : '') + '" data-act="region" data-arg="' + r.id + '" tabindex="0" role="button" aria-label="' + r.name + ', ' + got + ' of ' + vis.length + ' topics with a star' + (done ? ', guard beaten' : '') + '">' +
        '<circle class="halo" cx="' + n[0] + '" cy="' + n[1] + '" r="' + (done || here ? 86 : 70) + '" fill="url(#' + (done || here ? 'glowGold' : 'glowDim') + ')"/>' +
        '<circle class="ring" cx="' + n[0] + '" cy="' + n[1] + '" r="46" fill="' + r.color + '" stroke="' + (here ? '#ffc53d' : done ? '#fff4d1' : '#0e2a2f') + '" stroke-width="5"/>' +
        mapIcon(r.icon, n[0], n[1], 44, '#ffffff') +
        (done ? '<g transform="translate(' + (n[0] + 32) + ' ' + (n[1] - 36) + ')"><circle r="15" fill="#23855a" stroke="#0e2a2f" stroke-width="3"/>' + mapIcon('check', 0, 0, 20, '#fff') + '</g>' : '') +
        '<rect class="lab" x="' + (n[0] - 84) + '" y="' + (n[1] + 56) + '" width="168" height="48" rx="24" fill="#0e2a2f" fill-opacity=".92"/>' +
        '<text x="' + n[0] + '" y="' + (n[1] + 77) + '" font-family="Fredoka, sans-serif" font-size="18" font-weight="600" text-anchor="middle" fill="#fff">' + r.name + '</text>' +
        '<text x="' + n[0] + '" y="' + (n[1] + 96) + '" font-family="Lexend, sans-serif" font-size="13" text-anchor="middle" fill="#a9c4bd">★ ' + got + ' of ' + vis.length + ' topics</text></g>';
    }).join('');
    var pipAt = walk ? from : beaten >= N ? GATE : NODES[beaten], older = tier() === 'pro';
    var msg = walk ? (beaten >= N ? (older ? 'Every place cleared. Next stop: ' : 'Hop, hop, hop! On to ') + OM.cert.gateName(yearOf()) + ' to face ' + kingName() + '.' : (older ? regs[beaten - 1].name + ' cleared. On to ' : 'We got past! Hop, hop, hop… on to ') + regs[beaten].name + '!') : escaped() ? 'We did it! Keep practising to fill every topic with stars.' : beaten === 0 ? 'Let’s start at ' + regs[0].name + '. Tap a place on the map to learn and practise.' : beaten >= N ? 'Every guard is beaten! Now face ' + kingName() + ' at the ' + W.gate + '.' : 'You have beaten ' + beaten + ' guard' + (beaten > 1 ? 's' : '') + '. The next place is lit up.';
    function mi(act, icon, title, sub, cls) { return '<button class="mitem ' + (cls || '') + '" data-act="' + act + '"><span class="mi">' + I(icon, { size: 26 }) + '</span><span><b>' + title + '</b><small>' + sub + '</small></span>' + I('next', { size: 20 }) + '</button>'; }
    var tabs = tablesFor(yearOf()).length > 0;
    var html = (W.light ? '' : fireflies(14)) + header(W.name, { icon: W.icon }) +
      '<main class="mapwrap"><div class="mapcard"><svg viewBox="0 0 1000 660" class="map" role="group" aria-label="Forest map">' +
      '<defs><radialGradient id="glowGold"><stop offset="0" stop-color="#ffc53d" stop-opacity=".55"/><stop offset="1" stop-color="#ffc53d" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="glowDim"><stop offset="0" stop-color="#7fb8ad" stop-opacity=".22"/><stop offset="1" stop-color="#7fb8ad" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + W.sky[0] + '"/><stop offset="1" stop-color="' + W.sky[1] + '"/></linearGradient>' +
      '<filter id="soft"><feGaussianBlur stdDeviation="6"/></filter><filter id="glowf" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
      '<rect width="1000" height="660" fill="url(#sky)"/>' +
      (W.moon ? '<circle class="moonglow" cx="90" cy="80" r="56" fill="url(#glowGold)"/><circle cx="90" cy="80" r="38" fill="#fff4d1" opacity=".9"/><circle cx="106" cy="70" r="34" fill="' + W.sky[0] + '"/>' : '') +
      (W.sun ? '<circle class="moonglow" cx="110" cy="90" r="80" fill="url(#glowGold)"/><circle cx="110" cy="90" r="40" fill="#ffd56b"/>' : '') +
      OM.worldScenery(W, OM.makeRng(7 + yearOf()), NODES) +
      '<path d="' + d(pts) + '" fill="none" stroke="' + W.path[0] + '" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="' + d(pts) + '" fill="none" stroke="' + W.path[1] + '" stroke-width="3" stroke-dasharray="2 16" stroke-linecap="round"/>' +
      '<path class="litpath" d="' + d(lit) + '" fill="none" stroke="#ffc53d" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" opacity=".45" filter="url(#soft)"/>' +
      '<path class="litpath" d="' + d(lit) + '" fill="none" stroke="#ffd56b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 13"/>' +
      (walk ? '<path class="walklit" d="' + d([from, to]) + '" fill="none" stroke="#ffc53d" stroke-width="22" stroke-linecap="round" opacity=".45" filter="url(#soft)"/><path class="walklit" d="' + d([from, to]) + '" fill="none" stroke="#ffd56b" stroke-width="' + (older ? 6 : 5) + '" stroke-linecap="round"/>' : '') +
      (!tabs ? '' : '<g class="node" data-act="tables" tabindex="0" role="button" aria-label="Tables Tree"><circle class="halo" cx="470" cy="575" r="60" fill="url(#glowDim)"/><circle class="ring" cx="470" cy="575" r="36" fill="#22505a" stroke="#0e2a2f" stroke-width="5"/>' + mapIcon('tree', 470, 575, 36, '#ffc53d') +
      '<rect x="410" y="619" width="120" height="30" rx="15" fill="#0e2a2f" fill-opacity=".9"/><text x="470" y="635" font-family="Fredoka, sans-serif" font-size="16" font-weight="600" text-anchor="middle" fill="#fff">Tables Tree</text></g>') +
      trickChest(p) +
      '<g class="node' + (beaten >= N ? ' lit' : '') + '" data-act="gate" tabindex="0" role="button" aria-label="' + W.gate + '"><circle class="halo" cx="' + GATE[0] + '" cy="' + GATE[1] + '" r="90" fill="url(#' + (beaten >= N ? 'glowGold' : 'glowDim') + ')"/>' +
      '<path class="ring" d="M845 165V70l20-22 20 22V40h40v30l20-22 20 22v95z" fill="#2b1f33" stroke="' + (beaten >= N ? '#ffc53d' : '#0e2a2f') + '" stroke-width="5" stroke-linejoin="round"/><rect x="882" y="100" width="46" height="65" rx="23" fill="#120d16"/>' +
      '<g transform="translate(875 88)">' + kingSVG(60).replace('<svg ', '<svg x="0" y="0" ') + '</g>' +
      '<rect x="' + (GATE[0] - 80) + '" y="176" width="160" height="30" rx="15" fill="#0e2a2f" fill-opacity=".9"/><text x="' + GATE[0] + '" y="192" font-family="Fredoka, sans-serif" font-size="16" font-weight="600" text-anchor="middle" fill="#fff">' + W.gate + '</text></g>' +
      nodes + '<g id="pipWalk" transform="translate(' + (pipAt[0] - 56) + ' ' + (pipAt[1] - 124) + ')"><g class="pip-marker"><g class="hop">' + avatar(50, null, 'happy').replace('<svg ', '<svg x="0" y="10" ') + '</g>' + owl('happy', 58).replace('<svg ', '<svg x="48" y="0" ') + '</g></g></svg></div>' +
      '<div class="mapside"><div class="bubble">' + owl('happy', 64) + '<p>' + msg + '</p></div><nav class="menu" aria-label="More things to do">' +
      mi('mix', 'leaf', 'Daily mix', '10 questions from every topic', 'primary') +
      (tabs ? mi('tables', 'tree', 'Tables Tree', yearOf() === 4 ? 'Times tables check practice' : 'Times tables practice') : '') +
      mi('gate', 'gate', W.gate, 'Face ' + kingName() + ': ' + (yearOf() === 6 ? 'SATs-style papers' : 'practice papers')) +
      (OM.CURRICULUM.YTR ? mi('tricks', 'bulb', 'Pip’s Trick Box', 'Mental maths shortcuts and speed rounds') : '') +
      (elevenOn() ? mi('eleven', 'trophy', '11+ Training Camp', 'Maths and non-verbal reasoning, 11+ style') : '') +
      mi('shop', 'nest', 'Dressing-up chest', 'Spend acorns on outfits for your ' + esc(OM.animalName(App.profile.avatar))) +
      mi('team', 'user', 'Characters', 'Change your animal, ' + esc(owlName()) + '’s colour or the baddie') +
      (OM.cert.completed(p).length ? mi('certs', 'trophy', 'My certificates', 'Your award for finishing a year: save or print it') : '') +
      mi('help', 'book', 'Help book', 'How to do every topic') + '</nav>' +
      '<p class="streak"><span>' + I('leaf', { size: 18 }) + p.days.length + ' day' + (p.days.length === 1 ? '' : 's') + ' practised</span><span>' + I('refresh', { size: 18 }) + p.fixIts + ' brave fixes</span></p></div></main>';
    mount(html, {
      region: function (id) { App.go('region', { id: id }); },
      tables: function () { App.go('mtcIntro'); }, gate: function () { App.go('gate'); }, mix: function () { firstPracticeToday(); App.go('practice', { mix: true }); },
      shop: function () { App.go('shop'); }, team: function () { App.go('team'); }, help: function () { App.go('help', {}); }, eleven: function () { App.go('eleven'); }, tricks: function () { App.go('region', { id: 'xt' }); }, certs: function () { App.go('certificate', {}); }
    });
    // on a phone the map is shown larger and scrolls sideways: start with Pip's spot in the middle
    var mc = root.querySelector('.mapcard'), pm = root.querySelector('.pip-marker');
    if (mc && pm && mc.scrollWidth > mc.clientWidth) { var mr = mc.getBoundingClientRect(), pr2 = pm.getBoundingClientRect(); mc.scrollLeft = Math.max(0, pr2.left - mr.left + pr2.width / 2 - mc.clientWidth / 2); }
    root.querySelectorAll('.map .node').forEach(function (n) { n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); n.dispatchEvent(new MouseEvent('click', { bubbles: true })); } }); });
    if (walk) walkOn(from, to, older, d(full));
  };
  // Pip and the explorer travel along the path from the place just finished to the next one, lighting it as they go.
  // Younger years hop; Years 7 to 11 glide smoothly. With animations off they simply appear at the new place.
  function walkOn(from, to, glide, fullD) {
    var g = doc.getElementById('pipWalk'), mc = root.querySelector('.mapcard'), segs = root.querySelectorAll('.walklit'), lits = root.querySelectorAll('.litpath');
    var dx = to[0] - from[0], dy = to[1] - from[1], len = Math.sqrt(dx * dx + dy * dy), hops = Math.max(3, Math.round(len / 55)), hopMs = 460, dur = glide ? 1700 : hops * hopMs;
    var body = doc.body, reduced = body.classList.contains('motion-off') || (!body.classList.contains('motion-on') && G.matchMedia && G.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var ease = function (t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
    function place(s, lift) {
      g.setAttribute('transform', 'translate(' + (from[0] + dx * s - 56).toFixed(1) + ' ' + (from[1] + dy * s - 124 - lift).toFixed(1) + ')');
      segs.forEach(function (pth) { pth.setAttribute('stroke-dasharray', len.toFixed(1) + ' ' + (len + 40).toFixed(1)); pth.setAttribute('stroke-dashoffset', (len * (1 - s)).toFixed(1)); });
      // keep the travellers in view where the map scrolls sideways (phones)
      if (mc && mc.scrollWidth > mc.clientWidth) { var sx = (from[0] + dx * s) / 1000 * mc.scrollWidth; mc.scrollLeft = Math.max(0, sx - mc.clientWidth / 2); }
    }
    function arrive() {
      place(1, 0);
      segs.forEach(function (pth) { pth.parentNode.removeChild(pth); });
      lits.forEach(function (pth) { pth.setAttribute('d', fullD); });
      if (OM.sfx && OM.sfx.reward) OM.sfx.reward();
    }
    if (!g || reduced) return arrive();
    place(0, 0);
    var t0 = null;
    setTimeout(function () {
      (function frame(now) {
        if (!g.isConnected) return; // the explorer has left the map
        if (t0 === null) t0 = now;
        var t = Math.min(1, (now - t0) / dur), s, lift = 0;
        if (glide) s = ease(t);
        else { var k = Math.min(hops - 1, Math.floor(t * hops)), f = t * hops - k; s = (k + ease(f)) / hops; lift = Math.sin(Math.PI * f) * 34; }
        if (t < 1) { place(s, lift); G.requestAnimationFrame(frame); } else arrive();
      })(performance.now());
    }, 650);
  }

  // ---------- REGION ----------
  // ---------- REGION: a calm list of topics; the choices for a topic open when it is tapped ----------
  function keepTogether(t) { return String(t).replace(/(\S+-\S+)/g, '<span class="nw">$1</span>'); }
  function ring(pct, colour) {
    var c = 2 * Math.PI * 17, done = pct === null ? 0 : pct / 100;
    return '<svg class="ring" viewBox="0 0 44 44" width="44" height="44" aria-hidden="true"><circle cx="22" cy="22" r="17" fill="none" stroke="var(--line)" stroke-width="5"/>' +
      (done ? '<circle cx="22" cy="22" r="17" fill="none" stroke="' + colour + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="' + (c * done).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 22 22)"/>' : '') +
      '<text x="22" y="26.5" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="12" font-weight="600" fill="var(--ink)">' + (pct === null ? '–' : pct + '%') + '</text></svg>';
  }
  Screens.region = function (pr) {
    var r = region(pr.id), p = App.profile, objs = r.objectives.filter(function (o) { return OM.objVisible(o, p); }), n = objs.length;
    var starsOf = function (o) { return S.stars(p, o.id); };
    var withStar = objs.filter(function (o) { return starsOf(o) > 0; }).length, total = objs.reduce(function (t, o) { return t + starsOf(o); }, 0);
    // next up: the first topic (in curriculum order) with the fewest stars
    var next = null; objs.forEach(function (o) { if (starsOf(o) < 3 && (!next || starsOf(o) < starsOf(next))) next = o; });
    var beaten = guardBeaten(r), ready = withStar >= Math.ceil(n / 2);
    function tile(act, icon, title, sub, id, rec) {
      return '<button class="ttile' + (rec ? ' rec' : '') + '" data-act="' + act + '" data-arg="' + id + '">' + (rec ? '<span class="recbadge">Best next step</span>' : '') +
        '<span class="ti">' + I(icon, { size: 24 }) + '</span><b>' + title + '</b><small>' + sub + '</small></button>';
    }
    var rows = objs.map(function (o) {
      var st = starsOf(o), acc = S.accuracy(p, o.id), prog = p.progress[o.id], isOpen = pr.open === o.id;
      var status = acc === null ? 'Not started yet' : LV((prog && prog.level) || 1, null, o.tier) + ' level · ' + acc + '% correct';
      var started = acc !== null;
      return '<li class="trow' + (isOpen ? ' open' : '') + (next === o ? ' next' : '') + (st === 3 ? ' done' : '') + '">' +
        '<button class="thead" data-act="toggle" data-arg="' + o.id + '" aria-expanded="' + isOpen + '" aria-controls="tp-' + o.id + '">' +
        ring(acc, r.color) + '<span class="tname"><b>' + keepTogether(o.title) + '</b><small>' + status + '</small></span>' +
        (next === o ? '<span class="nextup">Next up</span>' : '') + starsHTML(st) + '<span class="chev">' + I('next', { size: 20, stroke: 2.4 }) + '</span></button>' +
        '<div class="tpanel" id="tp-' + o.id + '"' + (isOpen ? '' : ' inert') + '><div class="tpin"><div class="tiles">' +
        tile('learn', 'eye', 'Learn', esc(owlName()) + ' explains it, step by step', o.id, !started) +
        tile('practise', 'pencil', 'Practise', 'Questions at just the right level', o.id, started && st < 3) +
        tile('quiz', 'clipboard', 'Quiz', '5 questions, marked like a test', o.id, st === 3) +
        tile('helpt', 'bulb', 'Help', 'The method, mistakes and key words', o.id, false) +
        '</div></div></div></li>';
    }).join('');
    mount(header(r.name, { color: r.color, icon: r.icon }) + '<main class="region" style="--rc:' + r.color + '">' +
      '<section class="rbanner"><div class="rb-text"><p class="eyebrow">' + r.strand + '</p><h2>' + r.name + '</h2>' +
      '<div class="segs" role="img" aria-label="' + total + ' of ' + n * 3 + ' stars">' + objs.map(function (o) { return '<span class="seg s' + starsOf(o) + '"></span>'; }).join('') + '</div>' +
      '<p class="rb-sum"><span class="nw">' + withStar + ' of ' + n + ' topics have a star</span> <span class="dot">·</span> <span class="nw">' + total + ' of ' + n * 3 + ' stars</span></p></div>' +
      '<div class="rb-art">' + (r.eleven || r.tricks ? owl('cheer', 118) : guardSVG(r, 118)) + '</div></section>' +
      '<h3 class="listhead">Topics <small>Tap one to see what you can do</small></h3>' +
      '<ol class="tlist">' + rows + '</ol>' +
      (r.tricks ? speedCard() : r.eleven ? elevenTestCard({ xm: 'maths', xn: 'nvr', xe: 'english' }[r.id]) : '<section class="bosscard' + (beaten ? ' beaten' : ready ? ' ready' : '') + '"><div class="boss-art">' + guardSVG(r, 92) + '</div><div class="boss-text">' +
      '<h3>' + (beaten ? 'You beat ' + esc(guardName(r)) + '!' : 'Ready to face ' + esc(guardName(r)) + '?') + '</h3>' +
      '<p>' + (beaten ? 'Challenge again any time to keep your skills sharp.' : ready ? '8 questions from every topic here. Score 70% to move along the path.' : 'Get a star in a few topics first. It makes the challenge much easier.') + '</p></div>' +
      '<button class="btn big" data-act="guard">' + I('shield', { size: 24 }) + (beaten ? 'Challenge again' : 'Start the challenge') + '</button></section>') +
      '</main>', {
      toggle: function (id, btn) {
        var li = btn.closest('.trow'), opening = !li.classList.contains('open');
        root.querySelectorAll('.trow.open').forEach(function (x) { x.classList.remove('open'); x.querySelector('.thead').setAttribute('aria-expanded', 'false'); x.querySelector('.tpanel').setAttribute('inert', ''); });
        if (opening) { li.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); li.querySelector('.tpanel').removeAttribute('inert'); }
        var top = App.stack[App.stack.length - 1]; if (top) top[1].open = opening ? id : null; // remembered when coming back
        if (opening && li.getBoundingClientRect().bottom > G.innerHeight - 40) G.setTimeout(function () { li.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 220);
      },
      guard: function () { App.go('test', { kind: 'guard', region: r.id, seed: OM.newSeed() }); },
      xtest: function (t) { App.go('test', { kind: 'eleven', track: t, seed: OM.newSeed() }); },
      speed: function () { App.go('test', { kind: 'tricks', seed: OM.newSeed() }); },
      learn: function (id) { App.go('lesson', { id: id, i: 0, seed: OM.newSeed() }); },
      practise: function (id) { firstPracticeToday(); App.go('practice', { id: id }); },
      helpt: function (id) { App.go('helpTopic', { id: id }); },
      quiz: function (id) { App.go('test', { kind: 'quiz', id: id, seed: OM.newSeed() }); }
    });
  };

  // ---------- LESSON: Pip shows you ----------
  Screens.lesson = function (pr) {
    var o = OM.objectiveIndex[pr.id], ex = OM.generate(o.gens[0], 1, pr.seed);
    var slides = o.intro.map(function (s) { return { text: s.say, vis: s.vis ? s.vis(V) : '' }; });
    slides.push({ text: 'Now watch me solve one, step by step.', vis: '<div class="qprompt">' + ex.prompt + '</div>' + (ex.shown || ex.visual || ''), mood: 'think' });
    ex.solution.forEach(function (st, k) { slides.push({ text: '<b>Step ' + (k + 1) + ':</b> ' + st.text, vis: st.html, mood: 'think', head: ex.prompt }); });
    slides.push({ text: 'Your turn! Remember: ' + o.method[0], vis: '', mood: 'cheer', end: true });
    var i = Math.min(pr.i || 0, slides.length - 1), s = slides[i];
    mount(header('Learn: ' + o.title, { color: regionOf(o.id).color }) + '<main class="lesson">' +
      '<div class="progressbar"><span style="width:' + Math.round(100 * (i + 1) / slides.length) + '%"></span></div>' +
      (s.head ? '<div class="qprompt small">' + s.head + '</div>' : '') +
      '<div class="lesson-body"><div class="lesson-owl">' + owl(s.mood || 'happy', 110) + '</div><div class="bubble big" data-speak><p>' + T(s.text) + '</p>' + speakBtn(T(s.text)) + '</div></div>' +
      (s.vis ? '<div class="vis-wrap">' + s.vis + '</div>' : '') +
      '<div class="row nav"><button class="btn ghost" data-act="prev"' + (i === 0 ? ' disabled' : '') + '>' + I('back', { size: 22, stroke: 2.5 }) + 'Back</button>' +
      (s.end ? '<button class="btn big" data-act="practise">' + I('pencil', { size: 22 }) + 'Start practising</button>' : '<button class="btn big" data-act="next">Next' + I('next', { size: 22, stroke: 2.5 }) + '</button>') + '</div></main>', {
      prev: function () { App.go('lesson', { id: pr.id, i: i - 1, seed: pr.seed }, true); },
      next: function () { App.go('lesson', { id: pr.id, i: i + 1, seed: pr.seed }, true); },
      practise: function () { firstPracticeToday(); App.go('practice', { id: pr.id }, true); }
    });
    OM.autoSay(T(s.text));
  };

  // ---------- "Check your typing" pop-up (primary years): a number far too long to be meant is checked before marking ----------
  function typoGuard(q, resp, focusBack, go) {
    if (yearOf() > 6 || q._typoOk) return false;
    var ty = OM.typoCheck(q, resp); if (!ty) return false;
    var prev = doc.querySelector('.typopop'); if (prev) prev.remove();
    var pop = doc.createElement('div'); pop.className = 'typopop'; pop.setAttribute('role', 'alertdialog'); pop.setAttribute('aria-modal', 'true'); pop.setAttribute('aria-labelledby', 'typoh');
    pop.innerHTML = '<div class="typobox card">' + owl('think', 72) + '<div><h3 id="typoh">Check your typing</h3><p>You typed <b>' + esc(ty.typed) + '</b>. That number has more digits than we expected. Did a key get pressed twice?</p>' +
      '<div class="row"><button class="btn big" data-t="fix">' + I('pencil', { size: 20 }) + 'Let me fix it</button><button class="btn ghost" data-t="go">Yes, check it</button></div></div></div>';
    function close(fix) {
      pop.remove(); doc.removeEventListener('keydown', onKey, true);
      if (fix) focusBack(); else { q._typoOk = true; go(); }
    }
    function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); close(true); } }
    pop.addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (b) close(b.getAttribute('data-t') === 'fix'); else if (e.target === pop) close(true); });
    doc.addEventListener('keydown', onKey, true);
    doc.body.appendChild(pop); pop.querySelector('[data-t="fix"]').focus();
    OM.autoSay('Check your typing. You typed ' + ty.typed + '. Did a key get pressed twice?');
    return true;
  }
  // put the cursor back in the answer box that holds the typed number
  function refocusAnswer() { var f = Array.prototype.filter.call(doc.querySelectorAll('#qin input'), function (x) { return x.value && !x.disabled; }).pop(); if (f) { f.focus(); f.select && f.select(); } }

  // ---------- PRACTICE ----------
  // after a topic reaches 3 stars: the next topic in its place still short of 3 stars (in curriculum order, coming round to the start),
  // or, when every topic there has 3 stars, that place's guard if not yet beaten. Null when there is nothing left to go on to.
  function nextLevel(id) {
    var p = App.profile, r = regionOf(id); if (!r.objectives) return null;
    var objs = r.objectives.filter(function (o) { return OM.objVisible(o, p); }), at = objs.map(function (o) { return o.id; }).indexOf(id);
    for (var k = 1; k < objs.length; k++) { var o = objs[(at + k) % objs.length]; if (S.stars(p, o.id) < 3) return { topic: o }; }
    return !r.eleven && !r.tricks && !guardBeaten(r) ? { region: r } : null;
  }
  Screens.practice = function (pr) {
    var p = App.profile, mix = !!pr.mix, rng = OM.makeRng(OM.newSeed()), roundId = OM.newSeed();
    var st = { n: 0, right: 0, feathers: 0, streak: 0, wrongRun: 0, total: 10 };
    var q, ctl, attempt, revealed, objId, prog, seen = {};
    function next() {
      if (st.n >= st.total) return summary();
      st.n++; attempt = 1; revealed = false;
      // never repeat a question in a round: a topic that has run out is swapped (daily mix) or the round ends early
      q = null;
      for (var t = 0; !q && t < (mix ? 30 : 1); t++) {
        objId = mix ? OM.pickMixObjective(p, rng) : pr.id;
        var o = OM.objectiveIndex[objId];
        prog = S.objProgress(p, objId);
        // Higher-tier GCSE students start a new topic in the Grade 4–5 band
        if (yearOf(p) >= 10 && p.tier === 'higher' && !prog.lv[1].a && !prog.lv[2].a && !prog.lv[3].a && (prog.level || 1) < 2) prog.level = 2;
        q = OM.freshFromObjective(o, Math.min(prog.level || 1, maxLevel(p)), rng, seen);
      }
      if (!q) { st.n--; st.total = st.n; return summary(); }
      draw();
    }
    function tally() { return '<span>' + I('feather', { size: 18 }) + st.feathers + ' this round</span><span>' + I('check', { size: 18, stroke: 2.6 }) + st.right + ' right</span>'; }
    function draw() {
      var o = OM.objectiveIndex[objId];
      mount(header(mix ? 'Daily mix' : 'Practise: ' + o.title, { color: regionOf(o.id).color }) + '<main class="practice">' +
        '<div class="qcard card"><div class="qmeta"><span class="lvl l' + q.level + '">' + LV(q.level, null, o.tier) + '</span><span>Question ' + st.n + ' of ' + st.total + '</span>' +
        (mix ? '<span class="muted">' + o.title + '</span>' : '') + (q.calc ? '<span class="calcbadge">' + I('calc', { size: 16 }) + 'Calculator allowed</span>' : '') + '<span class="marks">' + q.marks + ' mark' + (q.marks > 1 ? 's' : '') + '</span></div>' +
        '<div class="qprompt" data-speak><div class="qtext">' + q.prompt + '</div>' + speakBtn(q.prompt) + '</div>' + (q.visual ? '<div class="vis-wrap">' + q.visual + '</div>' : '') +
        '<div class="qinput" id="qin"></div>' +
        '<div class="row qbtns"><button class="btn big" data-act="check" id="checkBtn">' + I('check', { size: 24, stroke: 2.6 }) + 'Check my answer</button><button class="btn ghost" data-act="hint">' + I('bulb', { size: 20 }) + 'Hint</button><button class="btn ghost" data-act="how">' + I('eye', { size: 20 }) + 'Show me how</button></div>' +
        '<div id="fb" class="feedback" aria-live="polite"></div></div>' +
        '<aside class="side"><div class="bubble" id="owlTalk">' + owl('happy', 90) + '<p id="owlSays">' + (st.streak >= 3 ? 'You are on a streak of ' + st.streak + '!' : 'Take your time. You can do it!') + '</p></div>' +
        '<div class="sessbar" id="sessbar">' + tally() + '</div>' +
        '<button class="link" data-act="report">' + I('flag', { size: 18 }) + 'Something wrong with this question?</button></aside></main>', acts);
      ctl = W.render(doc.getElementById('qin'), q, { onEnter: function () { var b = doc.getElementById('checkBtn'); if (b && !b.disabled) acts.check(); } });
      if (OM.calc) OM.calc.enable(!!q.calc, 'practice:' + (mix ? 'mix' : pr.id) + ':' + roundId);
      ctl.focus();
      OM.autoSay(q.prompt);
    }
    // Next sits beside the feedback headline, just under the answer: bring it into view and give it focus so Enter presses it
    function showNext() {
      var nb = doc.querySelector('#fb .nextbtn'); if (!nb) return;
      var r = nb.getBoundingClientRect();
      if (r.bottom > G.innerHeight - 12 || r.top < 70) nb.scrollIntoView({ block: 'center', behavior: 'smooth' });
      nb.focus({ preventScroll: true });
    }
    function say(msg, mood) { var t = doc.getElementById('owlTalk'); if (t) t.innerHTML = owl(mood || 'happy', 90) + '<p>' + msg + '</p>'; }
    function schemeBox(res) {
      return '<details class="scheme"><summary>' + I('clipboard', { size: 20 }) + 'How an examiner marks this</summary><ul>' + OM.schemeLines(q).map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul></details>';
    }
    function solutionHTML() {
      return '<div class="solution"><h3>How to do it</h3>' + q.solution.map(function (s, k) { return '<div class="step"><span class="stepn">' + (k + 1) + '</span><div><p>' + s.text + '</p>' + (s.html ? '<div class="vis-wrap">' + s.html + '</div>' : '') + '</div></div>'; }).join('') + '</div>';
    }
    var acts = {
      check: function () {
        if (typoGuard(q, ctl.get(), refocusAnswer, function () { acts.check(); })) return;
        var resp = ctl.get(), res = OM.mark(q, resp), fb = doc.getElementById('fb');
        if (attempt === 1 && !revealed) S.record(p, objId, q.level, res.correct);
        if (res.correct) {
          OM.sfx.correct(); ctl.disable(); doc.getElementById('checkBtn').disabled = true;
          var f = revealed ? 0 : attempt === 1 ? (q.level === 3 ? 2 : 1) + (q.marks === 2 ? 1 : 0) : 1;
          if (attempt === 2 && !revealed) { p.fixIts++; S.save(); }
          if (attempt === 1 && !revealed) { st.right++; st.streak++; st.wrongRun = 0; adapt(true); } else st.streak = 0;
          st.feathers += f; reward(f); doc.getElementById('sessbar').innerHTML = tally();
          if (st.streak && st.streak % 5 === 0) reward(0, 1, st.streak + ' in a row!');
          fb.innerHTML = '<div class="fb good"><div class="fbtop"><p class="fbh">' + I('check', { size: 26, stroke: 2.8 }) + (attempt === 2 ? 'Brave fixer! You fixed your mistake.' : 'Correct! ' + res.score + ' mark' + (res.score > 1 ? 's' : '') + '.') + (f ? '<span class="plusf">' + I('feather', { size: 18 }) + '+' + f + '</span>' : '') + '</p>' + '<button class="btn big nextbtn" data-act="next">Next' + I('next', { size: 22, stroke: 2.5 }) + '</button>' + '</div>' +
            (res.notes.length ? '<ul>' + res.notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>' : '') + schemeBox(res) + '</div>';
          showNext();
          say(attempt === 2 ? 'Fixing mistakes is how brains grow!' : ['Hoo-ray!', 'Brilliant!', 'Owl-standing!', 'Super work!', 'Wing-credible!'][st.n % 5], 'cheer');
          OM.autoSay(attempt === 2 ? 'Brave fixer! You fixed your mistake.' : 'Correct!');
        } else {
          OM.sfx.wrong();
          if (attempt === 1 && !revealed) { st.streak = 0; st.wrongRun++; adapt(false); }
          var partial = res.score > 0 ? '<b>' + res.score + ' mark out of ' + res.max + '.</b> ' : '';
          if (attempt === 1 && !revealed) {
            attempt = 2;
            fb.innerHTML = '<div class="fb try"><p class="fbh">' + I('refresh', { size: 22 }) + 'Not quite. Have another go.</p>' + partial + '<ul>' + res.notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '<li><b>Hint:</b> ' + T(q.hint) + '</li></ul></div>';
            say('Mistakes help us learn. Try again!', 'think');
            OM.autoSay('Not quite. ' + q.hint);
          } else {
            ctl.disable(); doc.getElementById('checkBtn').disabled = true;
            fb.innerHTML = '<div class="fb bad"><div class="fbtop"><p class="fbh">The answer is ' + q.answerText + '.</p>' + '<button class="btn big nextbtn" data-act="next">Next' + I('next', { size: 22, stroke: 2.5 }) + '</button>' + '</div>' + partial + (res.notes.length ? '<ul>' + res.notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>' : '') + '</div>' + solutionHTML() + schemeBox(res);
            showNext();
            say('Let’s look at it together. Next time it will be easier!', 'think');
            var wrongLine = doc.querySelector('.qcard .nltap'); if (wrongLine) OM.nlPlay(wrongLine);
          }
        }
      },
      hint: function () { var fb = doc.getElementById('fb'); if (!fb.querySelector('.hintbox')) fb.insertAdjacentHTML('afterbegin', '<div class="hintbox">' + I('bulb', { size: 22 }) + '<span>' + T(q.hint) + '</span></div>'); OM.say(q.hint); },
      how: function () {
        if (!revealed && attempt === 1) S.record(p, objId, q.level, false);
        revealed = true;
        var fb = doc.getElementById('fb');
        var addSolution = function () { if (doc.getElementById('fb') === fb && !fb.querySelector('.solution')) fb.insertAdjacentHTML('beforeend', solutionHTML() + '<p class="muted">Now try answering it yourself.</p>'); };
        // on a number line, count it out first, then give the written answer
        var jumpLine = doc.querySelector('.qcard .nltap');
        if (jumpLine) { jumpLine.scrollIntoView({ block: 'nearest' }); OM.nlPlay(jumpLine, addSolution); } else addSolution();
      },
      next: function () { next(); },
      report: function () { S.report({ date: Date.now(), profile: p.name, gen: q.gen, level: q.level, seed: q.seed, objective: q.objective, prompt: OM.speakable(q.prompt), response: JSON.stringify(ctl.get()) }); toast('Thanks! A grown-up can check this question in the grown-ups’ area.'); },
      again: function () { App.go('practice', pr, true); }
    };
    function adapt(ok) {
      var o = S.objProgress(p, objId);
      if (ok && st.streak > 0 && st.streak % 3 === 0 && o.level < maxLevel(p)) { o.level++; toast('Level up! Now: ' + LV(o.level)); }
      if (o.level > maxLevel(p)) o.level = maxLevel(p);
      if (!ok && st.wrongRun >= 2 && o.level > 1) { o.level--; st.wrongRun = 0; }
      S.save();
    }
    function summary() {
      var stars = mix ? '' : '<p>Stars for this topic: ' + starsHTML(S.stars(p, pr.id)) + '</p>';
      if (st.right >= 8) reward(0, 2, 'great round');
      // 3 stars: offer the next level, which opens the Learn lesson for the next topic here still short of 3 stars, or this place's guard once every topic has 3
      var up = !mix && S.stars(p, pr.id) >= 3 ? nextLevel(pr.id) : null;
      if (up) acts.up = function () { if (up.topic) App.go('lesson', { id: up.topic.id, i: 0, seed: OM.newSeed() }, true); else App.go('test', { kind: 'guard', region: up.region.id, seed: OM.newSeed() }, true); };
      mount(header('Round complete') + '<main class="narrow center"><div class="card">' + owl(st.right >= 7 ? 'cheer' : 'happy', 140) +
        '<h2>' + (st.right >= 8 ? 'Amazing!' : st.right >= 5 ? 'Well done!' : 'Good practising!') + '</h2><p class="bigtext">' + st.right + ' out of ' + st.total + ' correct first time</p><p class="purse earned">' + I('feather', { size: 24 }) + st.feathers + ' feathers earned</p>' + stars +
        (up ? '<p class="muted">Next up: <b>' + esc(up.topic ? up.topic.title : 'Challenge: ' + guardName(up.region)) + '</b></p>' : '') +
        '<div class="row" style="justify-content:center">' + (up ? '<button class="btn big" data-act="up">' + I('next', { size: 22, stroke: 2.5 }) + 'Next level</button>' : '') +
        '<button class="btn ' + (up ? 'ghost' : 'big') + '" data-act="again">' + I('refresh', { size: 22 }) + 'Another round</button><button class="btn ghost" data-act="back">Back</button></div></div></main>', acts);
      if (st.right >= 8) confetti();
    }
    next();
  };

  // ---------- TESTS (guard challenge, quiz, practice papers) ----------
  Screens.test = function (pr) {
    var p = App.profile, qs, title, minutes = 0;
    if (pr.kind === 'guard') { var r = region(pr.region); qs = OM.buildGuardTest(pr.region, pr.seed, yearOf(), p); title = 'Challenge: ' + guardName(r); }
    else if (pr.kind === 'quiz') { qs = OM.buildQuiz(pr.id, pr.seed); title = 'Quiz: ' + OM.objectiveIndex[pr.id].title; }
    else if (pr.kind === 'tricks') { var sp = OM.CURRICULUM.YTR.speed; qs = OM.buildTrickTest(yearOf(), pr.seed); title = 'Trick Box: ' + sp.title; minutes = S.settings().paperTimers ? sp.minutes : 0; }
    else if (pr.kind === 'eleven') { var xt = OM.CURRICULUM.YXP.tests[pr.track]; qs = OM.buildElevenTest(pr.track, pr.seed); title = xt.title; minutes = S.settings().paperTimers ? xt.minutes : 0; }
    else { var paper = OM.papersFor(yearOf(), p)[pr.paper]; qs = paper.build(pr.seed); title = paper.title; minutes = S.settings().paperTimers ? paper.minutes : 0; var paperCalc = !!paper.calc; }
    var i = 0, resps = [], ctl, timer = null, endAt = minutes ? Date.now() + minutes * 60000 : 0;
    if (endAt) {
      timer = setInterval(function () {
        var left = Math.max(0, endAt - Date.now()), el = doc.getElementById('clock');
        if (el) el.textContent = Math.floor(left / 60000) + ':' + String(Math.floor(left / 1000) % 60).padStart(2, '0');
        if (!left) { clearInterval(timer); save(); finish(true); }
      }, 1000);
      App.cleanup = function () { clearInterval(timer); };
    }
    function save() { if (ctl) resps[i] = ctl.get(); }
    function draw() {
      var q = qs[i];
      mount(header(title) + '<main class="practice test"><div class="qcard card"><div class="qmeta"><span>Question ' + (i + 1) + ' of ' + qs.length + '</span>' + (paperCalc || q.calc ? '<span class="calcbadge">' + I('calc', { size: 16 }) + 'Calculator allowed</span>' : '') + '<span class="marks">' + q.marks + ' mark' + (q.marks > 1 ? 's' : '') + '</span>' +
        (endAt ? '<span class="clock">' + I('timer', { size: 20 }) + '<b id="clock"></b></span>' : '') + '</div><div class="progressbar"><span style="width:' + Math.round(100 * i / qs.length) + '%"></span></div>' +
        '<div class="qprompt" data-speak><div class="qtext">' + q.prompt + '</div>' + speakBtn(q.prompt) + '</div>' + (q.visual ? '<div class="vis-wrap">' + q.visual + '</div>' : '') +
        '<div class="qinput" id="qin"></div><div class="row"><button class="btn big" data-act="next">' + (i === qs.length - 1 ? 'Finish' : 'Next') + I(i === qs.length - 1 ? 'check' : 'next', { size: 22, stroke: 2.5 }) + '</button></div>' +
        '<p class="muted">No hints in a test — just do your best. You will see how it was marked at the end.</p></div></main>', {
        next: function () {
          save();
          if (typoGuard(q, resps[i], refocusAnswer, function () { root.querySelector('[data-act="next"]').click(); })) return;
          if (i === qs.length - 1) finish(false); else { i++; draw(); }
        }
      });
      ctl = W.render(doc.getElementById('qin'), q, { onEnter: function () { root.querySelector('[data-act="next"]').click(); } });
      if (OM.calc) OM.calc.enable(paperCalc || !!q.calc, 'test:' + pr.kind + ':' + pr.seed);
      ctl.focus();
      OM.autoSay(q.prompt);
    }
    function finish(timeUp) {
      if (timer) clearInterval(timer);
      var results = qs.map(function (q, k) { return OM.mark(q, resps[k] === undefined ? null : resps[k]); });
      var score = results.reduce(function (a, b) { return a + b.score; }, 0), max = results.reduce(function (a, b) { return a + b.max; }, 0), pct = Math.round(100 * score / max);
      qs.forEach(function (q, k) { S.record(p, q.objective, q.level, results[k].correct); });
      p.tests.push({ date: Date.now(), year: yearOf(), kind: pr.kind, paper: pr.paper, region: pr.region, id: pr.id, track: pr.track, score: score, max: max }); S.save();
      reward(score);
      var msg = '', passed = false, first = false;
      if (pr.kind === 'guard') {
        var rg = region(pr.region);
        if (pct >= 70) { passed = true; first = !guardBeaten(rg); p.guards[ykey(rg.id)] = true; S.save(); if (first) reward(0, 5, 'guard beaten'); msg = 'You got past ' + esc(guardName(rg)) + '! ' + esc(owlName()) + ' hops along the path.'; confetti(); OM.sfx.reward(); }
        else msg = 'So close! ' + esc(guardName(rg)) + ' needs 70% to let us pass. Practise the clearings and try again.';
      }
      if (pr.kind === 'paper') {
        p.papers = p.papers || {};
        if (pct >= 60) { var newPass = !p.papers[ykey(pr.paper)]; p.papers[ykey(pr.paper)] = true; if (newPass) reward(0, 10, 'paper passed'); }
        var allPassed = Object.keys(OM.papersFor(yearOf(), p)).every(function (k) { return p.papers[ykey(k)]; });
        if (allPassed && !escaped()) { setEscaped(p); S.save(); msg = 'You beat ' + esc(kingName()) + '! ' + OM.cert.gateName(yearOf()).replace(/^the/, 'The') + ' opens and the adventure is won!'; confetti(); OM.sfx.reward(); }
        else msg = pct >= 60 ? 'Great paper! ' + esc(kingName(true)) + ' is getting worried…' : esc(kingName(true)) + ' laughs… but every practice paper makes you stronger.';
        S.save();
      }
      mount(header('Results') + '<main class="results narrow"><div class="card scorehead">' + owl(pct >= 70 ? 'cheer' : 'think', 110) +
        '<div><div class="big">' + score + '<small> out of ' + max + ' marks</small></div><p class="muted">' + pct + '%' + (timeUp ? ' · time ran out' : '') + '</p>' + (msg ? '<p class="bigtext">' + msg + '</p>' : '') + '</div></div>' +
        '<h3>How each question was marked</h3>' + qs.map(function (q, k) {
          var res = results[k];
          return '<details class="review card ' + (res.correct ? 'ok' : res.score ? 'part' : 'no') + '"><summary><span class="mark">' + I(res.correct ? 'check' : res.score ? 'half' : 'x', { size: 18, stroke: 3 }) + '</span><span class="qn">Q' + (k + 1) + '</span> <b>' + res.score + '/' + res.max + '</b> <span class="muted">' + OM.objectiveIndex[q.objective].title + '</span></summary>' +
            '<div class="qprompt small">' + q.prompt + '</div>' + (q.visual ? '<div class="vis-wrap">' + (q.shown || q.visual) + '</div>' : '') +
            '<p><b>Your answer:</b> ' + W.describe(q, resps[k]) + '</p><p><b>Correct answer:</b> ' + q.answerText + '</p>' +
            (res.notes.length ? '<ul class="notes">' + res.notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>' : '') +
            '<div class="scheme open"><b>' + I('clipboard', { size: 20 }) + 'Mark scheme</b><ul>' + OM.schemeLines(q).map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul></div>' +
            '<div class="solution"><h4>How to do it</h4>' + q.solution.map(function (s, n) { return '<div class="step"><span class="stepn">' + (n + 1) + '</span><div><p>' + s.text + '</p>' + (s.html ? '<div class="vis-wrap">' + s.html + '</div>' : '') + '</div></div>'; }).join('') + '</div></details>';
        }).join('') + '<div class="row">' + (pr.kind === 'paper' && escaped() ? '<button class="btn big" data-act="cert">' + I('trophy', { size: 22 }) + 'See your certificate</button>' : '') + '<button class="btn ' + (pr.kind === 'paper' && escaped() ? 'ghost' : 'big') + '" data-act="' + (passed ? 'tomap' : 'back') + '">Done</button></div></main>', {
        cert: function () { App.go('certificate', { year: yearOf() }, true); },
        // a guard passed: back to the map, where Pip and the explorer travel on to the next place (the first time it is beaten)
        tomap: function () { var k = App.stack.map(function (e) { return e[0]; }).lastIndexOf('map'); if (k >= 0) App.stack.length = k; App.go('map', first ? { walk: true } : {}); }
      });
    }
    draw();
  };

  // ---------- PIP'S TRICK BOX: a speed round of the tricks for this year ----------
  function speedCard() {
    var sp = OM.CURRICULUM.YTR.speed, best = App.profile.tests.filter(function (x) { return x.kind === 'tricks'; }).reduce(function (m, x) { return Math.max(m, Math.round(100 * x.score / x.max)); }, -1);
    return '<section class="bosscard ready"><div class="boss-art">' + owl('think', 92) + '</div><div class="boss-text"><h3>' + sp.title + '</h3>' +
      '<p>' + sp.count + ' quick questions mixed from your tricks' + (S.settings().paperTimers ? ', in ' + sp.minutes + ' minutes' : '') + '. Use the shortcuts to beat the clock!' + (best >= 0 ? ' Best so far: ' + best + '%.' : '') + '</p></div>' +
      '<button class="btn big" data-act="speed">' + I('timer', { size: 24 }) + 'Start a speed round</button></section>';
  }

  // ---------- 11+ TRAINING CAMP: maths and non-verbal reasoning, multiple choice A–E ----------
  function elevenBest(t, p) { p = p || App.profile; return p.tests.filter(function (x) { return x.kind === 'eleven' && x.track === t; }).reduce(function (m, x) { return Math.max(m, Math.round(100 * x.score / x.max)); }, -1); }
  function elevenTestCard(t) {
    var xt = OM.CURRICULUM.YXP.tests[t], best = elevenBest(t);
    return '<section class="bosscard ready"><div class="boss-art">' + owl('think', 92) + '</div><div class="boss-text"><h3>' + xt.title + '</h3>' +
      '<p>' + xt.count + ' multiple-choice questions' + (S.settings().paperTimers ? ' in ' + xt.minutes + ' minutes' : ' (timers are off in the grown-ups’ area)') + ', mixed from every topic here.' + (best >= 0 ? ' Best so far: ' + best + '%.' : '') + '</p></div>' +
      '<button class="btn big" data-act="xtest" data-arg="' + t + '">' + I('timer', { size: 24 }) + 'Start a timed test</button></section>';
  }
  Screens.eleven = function () {
    var p = App.profile, XP = OM.CURRICULUM.YXP;
    var card = function (rg, t) {
      var objs = rg.objectives, stars = objs.reduce(function (a, o) { return a + S.stars(p, o.id); }, 0), best = elevenBest(t);
      return '<div class="card xcard" style="--rc:' + rg.color + '"><div class="xhead"><span class="mi">' + I(rg.icon, { size: 30 }) + '</span><div><h3>' + rg.name + '</h3><p class="muted">' + objs.length + ' question types · ' + stars + ' of ' + objs.length * 3 + ' stars' + (best >= 0 ? ' · best test ' + best + '%' : '') + '</p></div></div>' +
        '<p class="xchips">' + objs.map(function (o) { return '<span class="chip">' + o.title + '</span>'; }).join(' ') + '</p>' +
        '<div class="row"><button class="btn" data-act="topics" data-arg="' + rg.id + '">' + I('pencil', { size: 22 }) + 'Learn and practise</button>' +
        '<button class="btn big" data-act="xtest" data-arg="' + t + '">' + I('timer', { size: 22 }) + 'Timed test</button></div></div>';
    };
    mount(header('11+ Training Camp', { icon: 'trophy' }) + '<main class="narrow eleven"><div class="bubble">' + owl('happy', 72) +
      '<p>Most 11+ tests are multiple choice: you pick A, B, C, D or E. Work out the answer first, then find it in the list.</p></div>' +
      card(XP.regions[0], 'maths') + card(XP.regions[1], 'nvr') + (XP.regions[2] ? card(XP.regions[2], 'english') : '') +
      '<p class="muted small">Practice in the usual 11+ style, using the Year 5 and 6 maths and English curriculum. The reading passages are written for this app. Tests differ by area and school, so ask your school which papers they use. This is not an official test.</p></main>', {
      topics: function (id) { App.go('region', { id: id }); },
      xtest: function (t) { App.go('test', { kind: 'eleven', track: t, seed: OM.newSeed() }); }
    });
  };

  // ---------- CAT KING'S GATE ----------
  Screens.gate = function () {
    var p = App.profile, papers = p.papers || {}, y = yearOf(), PP = OM.papersFor(y, p), keys = Object.keys(PP);
    mount(header(WORLD().gate, { icon: 'gate' }) + '<main class="narrow"><div class="card center">' + kingSVG(130) +
      '<p class="bigtext">“To get past me, you must score 60% or more on ' + (keys.length > 1 ? (keys.length === 2 ? 'BOTH' : 'ALL') + ' of my papers' : 'my paper') + '!”</p>' +
      '<p class="muted">' + (y >= 10 ? 'GCSE practice papers in the ' + (OM.boardById(p.board) || OM.boardById('aqa')).name + ' layout, ' + (p.tier === 'higher' ? 'Higher' : 'Foundation') + ' tier' + (p.board ? '' : ' (no exam board chosen yet, so AQA is used: choose the board in the grown-ups’ area)') + '. Year 11 papers are mocks covering Years 10 and 11.' : y >= 7 ? 'End-of-year practice papers in the GCSE style: one without a calculator and one with.' : y === 6 ? 'These follow the real KS2 SATs papers taken in May of Year 6: an arithmetic paper and reasoning papers, marked the same way.' : y <= 2 ? 'Short practice papers using Year ' + y + ' content, in the style of a real test. There are no official tests in Year ' + y + '; this is gentle practice.' : 'These follow the KS2 SATs layout (an arithmetic paper and a reasoning paper) using Year ' + y + ' content. There are no official Year ' + y + ' SATs; this is practice for the real thing in Year 6.') + ' Timers can be switched off in the grown-ups’ area.</p></div>' +
      keys.map(function (k) {
        var pp = PP[k], best = p.tests.filter(function (t) { return t.paper === k && (t.year || 4) === y; }).reduce(function (m, t) { return Math.max(m, Math.round(100 * t.score / t.max)); }, -1);
        return '<div class="card paper"><h3>' + pp.title + (papers[ykey(k)] ? ' <span class="beaten">' + I('check', { size: 20, stroke: 3 }) + 'passed</span>' : '') + '</h3><p>' + pp.desc + '</p><p class="muted">' + pp.totalMarks + ' marks · ' + pp.minutes + ' minutes' + (best >= 0 ? ' · best so far ' + best + '%' : '') + '</p>' +
          '<button class="btn big" data-act="start" data-arg="' + k + '">' + (y >= 10 ? 'Start this paper' : 'Start the ' + pp.title.toLowerCase()) + '</button></div>';
      }).join('') + '</main>', {
      start: function (k) { App.go('test', { kind: 'paper', paper: k, seed: OM.newSeed() }); }
    });
  };

  // ---------- PLAY TIME LIMITS (the rules are in js/playtime.js; a grown-up sets them for each child) ----------
  // Tests and practice papers are not counted and the pop-up never covers them. It appears when the child comes out of one.
  var PT = OM.playtime, NOT_COUNTED = { test: 1, mtc: 1 }, limitBox = null, limitShown = '', limitTick = Date.now(), lastTouch = Date.now(), limitSaved = 0;
  function limitWords(b, p) {
    var m = b.mins + ' minute' + (b.mins === 1 ? '' : 's');
    return b.kind === 'row' ? 'You have played for ' + m + ' in a row. Time for a break!' :
      b.kind === 'hour' ? 'You have used your ' + m + ' of play for this hour.' :
      b.kind === 'span' ? 'You have used your ' + m + ' of play for these ' + p.limits.spanH + ' hours.' :
      'You have used your ' + m + ' of play for today.';
  }
  function limitClose() {
    if (!limitBox) return;
    limitBox.remove(); limitBox = null; limitShown = ''; root.inert = false;
  }
  function limitCheck() {
    var p = App.profile, top = App.stack[App.stack.length - 1], now = Date.now();
    var b = p && top && !NOT_COUNTED[top[0]] ? PT.blocked(p, now) : [];
    if (!b.length) return limitClose();
    var last = b.reduce(function (m, x) { return x.at > m.at ? x : m; }), can = PT.canExtend(p, now), when = new Date(last.at),
      back = last.kind === 'day' ? 'You can play again tomorrow.' : 'You can play again at ' + when.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + '.', sig = b.map(function (x) { return x.kind + x.mins; }).join() + can + back;
    if (sig === limitShown) return;
    limitClose(); limitShown = sig;
    OM.stopSpeaking(); W.hideKeypad(); root.inert = true;
    limitBox = doc.createElement('div'); limitBox.className = 'ptover'; limitBox.setAttribute('role', 'dialog'); limitBox.setAttribute('aria-modal', 'true'); limitBox.setAttribute('aria-labelledby', 'ptTitle');
    limitBox.innerHTML = '<div class="card ptcard">' + owl('happy', 90) + '<h2 id="ptTitle">Play time limit</h2><p class="bigtext">' + limitWords(last, p) + '</p><p>' + back + '</p>' +
      (can ? '<button class="btn big" data-pt="extend">' + I('timer', { size: 22 }) + 'Extend by ' + PT.BONUS_MINS + ' minutes</button><p class="muted small-note">You can only do this once.</p>' : '') +
      '<div class="row ptbtns"><button class="btn ghost" data-pt="player">Change player</button></div>' +
      '<button class="link" data-pt="grownups">' + I('lock', { size: 18 }) + 'Grown-ups’ area</button></div>';
    limitBox.onclick = function (e) {
      var t = e.target.closest('[data-pt]'); if (!t) return;
      var a = t.getAttribute('data-pt');
      if (a === 'extend') { PT.extend(p, Date.now()); S.save(); limitCheck(); }
      else { App.profile = null; App.stack = []; App.go(a === 'player' ? 'home' : 'parent', {}); }
    };
    doc.body.appendChild(limitBox);
    limitBox.querySelector('button').focus();
  }
  ['pointerdown', 'keydown'].forEach(function (ev) { doc.addEventListener(ev, function () { lastTouch = Date.now(); }, true); });
  // counted once a second: only while this child has a limit, the app is on screen, and someone has touched it in the last few minutes
  G.setInterval(function () {
    var p = App.profile, top = App.stack[App.stack.length - 1], now = Date.now(), secs = Math.min(5, (now - limitTick) / 1000); limitTick = now;
    if (!p || !top) return limitClose();
    if (doc.visibilityState === 'visible' && now - lastTouch < PT.IDLE_MS) {
      if (NOT_COUNTED[top[0]]) PT.busy(p, now);
      else if (!limitBox) PT.add(p, secs, now);
      if (now - limitSaved > 15000) { limitSaved = now; S.save(); }
    }
    limitCheck();
    // after a good spell in a row, Pip suggests a break (never during a test, and not when a limit has just stopped play)
    if (!limitBox && !NOT_COUNTED[top[0]] && PT.nudgeDue(p, now)) {
      PT.nudged(p, now); S.save();
      gentlePop('breakNudge', '<h2 id="gpTitle">Time for a stretch?</h2><p class="bigtext">You have been practising for ' + PT.NUDGE_MINS + ' minutes in a row. Well done!</p><p>A short break helps your brain remember what you have learned.</p>',
        [['break', 'Take a break', true], ['more', 'Keep going']], function (a) { if (a === 'break') { App.profile = null; App.stack = []; App.go('home', {}); } });
    }
  }, 1000);
  doc.addEventListener('visibilitychange', function () { if (doc.visibilityState !== 'visible' && App.profile && App.profile.pt) S.save(); });

  // ---------- THE CERTIFICATE for finishing a year (js/certificate.js) ----------
  Screens.certificate = function (pr) {
    var p = pr.child ? S.get(pr.child) : App.profile; if (!p) return App.back();
    var years = OM.cert.completed(p), y = years.indexOf(+pr.year) >= 0 ? +pr.year : years[years.length - 1];
    if (!y) { mount(header('Certificates', { icon: 'trophy' }) + '<main class="narrow"><div class="card center"><p class="bigtext">' + esc(p.name) + ' has no certificates yet.</p><p>A certificate appears when the final challenge of a year has been won.</p></div></main>', {}); return; }
    mount(header('Certificates', { icon: 'trophy' }) + '<main class="certpage">' +
      (years.length > 1 ? '<div class="row certyears">' + years.map(function (v) { return '<button class="btn small ' + (v === y ? '' : 'ghost') + '" data-act="year" data-arg="' + v + '">Year ' + v + '</button>'; }).join('') + '</div>' : '') +
      '<div class="card center"><div class="certview" id="certview"><p class="muted">Drawing the certificate…</p></div>' +
      '<div class="row certbtns"><button class="btn big" data-act="pdf">' + I('download', { size: 22 }) + 'Save as PDF</button>' + (G.print ? '<button class="btn ghost" data-act="print">Print</button>' : '') + '</div>' +
      '<p class="small-note">It fits an A4 page. It shows ' + esc(p.name) + '’s animal wearing what they have on now, so dress up first if you like! ' + (pr.child ? '' : 'A grown-up can find it too, under Grown-ups’ area → Certificates.') + '</p></div></main>', {
      year: function (v) { App.go('certificate', { year: +v, child: pr.child }, true); },
      pdf: function () { OM.cert.save(p, y).then(function (how) { if (how === 'downloaded') toast('Saved. Look in your downloads folder.'); }).catch(function () { toast('The PDF could not be made on this device. Try Print instead.'); }); },
      print: function () { OM.cert.print(p, y).catch(function () { toast('Printing could not start on this device. Try Save as PDF instead.'); }); }
    });
    OM.cert.draw(p, y).then(function (c) {
      var box = doc.getElementById('certview'); if (!box) return;
      var s = OM.cert.stats(p, y), w = OM.cert.wording(p, y), img = new Image();
      img.src = c.toDataURL('image/jpeg', 0.88); img.className = 'certimg';
      img.alt = 'Certificate for ' + w.name + '. ' + w.line + '. ' + w.well + '. Stars: ' + s.stars + '. Feathers: ' + s.feathers + '. Acorns: ' + s.acorns + '.';
      box.innerHTML = ''; box.appendChild(img);
    }).catch(function () { var box = doc.getElementById('certview'); if (box) box.innerHTML = '<p class="muted">The certificate could not be drawn on this device.</p>'; });
  };

  // ---------- MULTIPLICATION TABLES CHECK ----------
  Screens.mtcIntro = function () {
    var p = App.profile, y = yearOf(), tb = tablesFor(y), best = p.mtc.filter(function (t) { return (t.year || 4) === y; }).reduce(function (m, t) { return Math.max(m, t.score); }, -1);
    mount(header('Tables Tree', { icon: 'tree' }) + '<main class="narrow"><div class="card center">' + owl('think', 100) +
      (y === 4 ? '<p class="bigtext">In June of Year 4, every child in England takes the <b>Multiplication Tables Check</b>.</p>' +
        '<p>It has <b>25 questions</b> from the 2 to 12 times tables. You have <b>6 seconds</b> for each one, with a 3-second pause in between. It is marked automatically: 1 mark for each correct answer.</p>'
        : '<p class="bigtext">Quick-fire times tables, just like the check every child takes in Year 4.</p><p><b>25 questions</b> from the ' + tb.join(', ').replace(/, (\d+)$/, ' and $1') + ' times tables. You have <b>' + (y <= 3 ? 9 : 6) + ' seconds</b> for each one.</p>') +
      (best >= 0 ? '<p>Your best score: <b>' + best + '/25</b></p>' : '') +
      '<button class="btn big" data-act="go">' + I('play', { size: 22 }) + 'Take a practice check</button></div>' +
      '<div class="card"><h3>Practise one table</h3><p class="muted">12 questions from one table, still 6 seconds each.</p><div class="tables">' +
      tb.map(function (t) { return '<button class="btn small" data-act="table" data-arg="' + t + '">× ' + t + '</button>'; }).join('') + '</div></div></main>', {
      go: function () { App.go('mtc', {}); }, table: function (t) { App.go('mtc', { table: +t }); }
    });
  };
  Screens.mtc = function (pr) {
    var rng = OM.makeRng(OM.newSeed()), qs = [];
    if (pr.table) { var bs = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]); qs = bs.map(function (b) { return rng.chance(0.5) ? [pr.table, b] : [b, pr.table]; }); }
    else { var tb = tablesFor(yearOf()), seen = {}, guard = 0; while (qs.length < 25 && guard++ < 5000) { var pq = yearOf() === 4 ? OM.mtcPair(rng) : [rng.pick(tb), rng.int(yearOf() <= 3 ? 1 : 2, 12)]; if (rng.chance(0.5)) pq.reverse(); var k = pq.join('x'); if (seen[k]) continue; /* never the same sum twice in one check */ seen[k] = 1; qs.push(pq); } }
    var secs = yearOf() <= 3 ? 9 : 6;
    var i = -1, answers = [], tmr = null, startT = 0;
    App.cleanup = function () { clearTimeout(tmr); clearInterval(tmr); };
    function pause() {
      i++;
      if (i >= qs.length) return done();
      mount(header(pr.table ? '× ' + pr.table + ' table' : 'Tables check') + '<main class="mtc"><p class="muted">Question ' + (i + 1) + ' of ' + qs.length + '</p><div class="mtc-wait">Get ready…</div></main>', {});
      tmr = setTimeout(ask, i === 0 ? 1500 : 3000);
    }
    function ask() {
      var q = qs[i];
      mount(header(pr.table ? '× ' + pr.table + ' table' : 'Tables check') + '<main class="mtc"><p class="muted">Question ' + (i + 1) + ' of ' + qs.length + '</p>' +
        '<div class="mtc-q">' + q[0] + ' × ' + q[1] + ' = <span id="mv" class="mtc-v"></span></div><div class="timebar"><span id="tb"></span></div>' +
        '<div class="mtc-pad">' + ['7', '8', '9', '4', '5', '6', '1', '2', '3', '⌫', '0', '↵'].map(function (k) { return '<button data-act="k" data-arg="' + k + '">' + k + '</button>'; }).join('') + '</div></main>', {
        k: function (k) { var v = doc.getElementById('mv'); if (k === '⌫') v.textContent = v.textContent.slice(0, -1); else if (k === '↵') submit(); else if (v.textContent.length < 3) v.textContent += k; }
      });
      startT = Date.now();
      var bar = doc.getElementById('tb');
      tmr = setInterval(function () { var f = Math.min(1, (Date.now() - startT) / (secs * 1000)); if (bar) bar.style.width = (100 - f * 100) + '%'; if (f >= 1) submit(); }, 50);
      doc.onkeydown = function (e) { var v = doc.getElementById('mv'); if (!v) return; if (/^\d$/.test(e.key) && v.textContent.length < 3) v.textContent += e.key; if (e.key === 'Backspace') v.textContent = v.textContent.slice(0, -1); if (e.key === 'Enter') submit(); };
    }
    function submit() {
      clearInterval(tmr); doc.onkeydown = null;
      var v = doc.getElementById('mv');
      answers[i] = v ? v.textContent : '';
      pause();
    }
    function done() {
      doc.onkeydown = null;
      var p = App.profile, score = qs.filter(function (q, k) { return +answers[k] === q[0] * q[1] && answers[k] !== ''; }).length;
      if (!pr.table) { p.mtc.push({ date: Date.now(), year: yearOf(), score: score }); }
      var tobj = CUR().tablesObjective;
      if (tobj) qs.forEach(function (q, k) { S.record(p, tobj, 1, +answers[k] === q[0] * q[1]); });
      S.save(); reward(Math.ceil(score / 2));
      if (!pr.table && score >= 20) { reward(0, 3, 'tables star'); confetti(); }
      var wrong = qs.map(function (q, k) { return { q: q, a: answers[k] }; }).filter(function (x) { return +x.a !== x.q[0] * x.q[1] || x.a === ''; });
      mount(header('Tables results') + '<main class="narrow"><div class="card center">' + owl(score >= qs.length * 0.8 ? 'cheer' : 'think', 100) +
        '<h2>' + score + ' out of ' + qs.length + '</h2>' + (wrong.length ? '<p>Facts to practise:</p><div class="chips">' + wrong.map(function (x) { return '<span class="chip">' + x.q[0] + ' × ' + x.q[1] + ' = <b>' + x.q[0] * x.q[1] + '</b>' + (x.a ? ' <s>' + esc(x.a) + '</s>' : ' <i>(no answer)</i>') + '</span>'; }).join('') + '</div>' : '<p class="bigtext">Every one right!</p>') +
        '<div class="row"><button class="btn big" data-act="again">' + I('refresh', { size: 22 }) + 'Go again</button><button class="btn ghost" data-act="back">Back</button></div></div></main>', {
        again: function () { App.go('mtc', pr, true); }
      });
    }
    pause();
  };

  // ---------- SHOP ----------
  // The dressing-up chest: about 100 outfits for each age group (js/outfits.js), in seven slots, from a few acorns to Legendary.
  // Tap an item to try it on in the big picture before buying.
  // items bought before the bigger chest keep working: old ids and how they were worn are renamed
  function migrateOutfits(p) {
    var ids = { 'scarf:red': 'neck:scarf:red', 'scarf:blue': 'neck:scarf:blue', 'scarf:gold': 'neck:scarf:gold', 'glasses:round': 'eyes:round:black' }, hex = { '#d9534f': 'red', '#3d7bd9': 'blue', '#f2c53a': 'gold' };
    p.owned = p.owned.map(function (id) { return ids[id] || id; });
    var w = p.wearing || (p.wearing = {});
    if (w.scarf) { w.neck = w.neck || 'scarf:' + (hex[w.scarf] || 'red'); delete w.scarf; }
    if (w.glasses) { w.eyes = w.eyes || 'round:black'; delete w.glasses; }
  }
  Screens.shop = function (pr) {
    var p = App.profile; migrateOutfits(p);
    var slot = pr.slot || 'hat', show = pr.show || 'all', sort = pr.sort || 'price', ageTier = OM.tierForYear(yearOf(p)), tryOn = pr.tryOn || null;
    var mine = function (it) { return p.owned.indexOf(it.id) >= 0; };
    var range = OM.OUTFITS.filter(function (it) { return it.ages.indexOf(ageTier) >= 0 || mine(it); });
    var inSlot = range.filter(function (it) { return it.slot === slot; });
    var list = inSlot.filter(function (it) { return show === 'all' || (show === 'mine' ? mine(it) : !mine(it) && it.price <= p.acorns); });
    list.sort(sort === 'price' ? function (a, b) { return a.price - b.price || a.label.localeCompare(b.label); } : sort === 'dear' ? function (a, b) { return b.price - a.price || a.label.localeCompare(b.label); } : function (a, b) { return a.label.localeCompare(b.label); });
    var wearPlus = function (it) { var w = Object.assign({}, p.wearing); w[it.slot] = it.v; return w; };
    var tried = tryOn && OM.outfitById(tryOn);
    var ownedN = range.filter(mine).length;
    mount(header('Dressing-up chest', { icon: 'nest' }) + '<main class="shopgrid"><div class="card center preview"><div id="bigav">' + avatar(170, null, 'cheer', tried ? wearPlus(tried) : null) + '</div>' +
      (tried ? '<p class="trying">Trying on: <b>' + tried.label + '</b></p>' : '') +
      '<p class="purse">' + I('acorn', { size: 28 }) + p.acorns + ' acorns</p><p class="muted small-note">Earn acorns by practising each day, getting answers right, beating guards and passing practice papers, up to ' + OM.playtime.ACORNS_A_DAY + ' a day. Save up for the Legendary ones!</p>' +
      '<p class="muted small-note">' + ownedN + ' of ' + range.length + ' items collected</p>' +
      '<button class="btn small ghost" data-act="undress">Take everything off</button></div>' +
      '<div><nav class="tabs shoptabs">' + OM.OUTFIT_SLOTS.map(function (s2) { var n = range.filter(function (it) { return it.slot === s2[0]; }).length; return '<button class="tab ' + (s2[0] === slot ? 'on' : '') + '" data-act="slot" data-arg="' + s2[0] + '">' + s2[1] + ' <small>' + n + '</small></button>'; }).join('') + '</nav>' +
      '<div class="row shopfilters"><label>Show <select id="shopshow"><option value="all">Everything</option><option value="afford">What I can buy now</option><option value="mine">Mine</option></select></label>' +
      '<label>Order <select id="shopsort"><option value="price">Cheapest first</option><option value="dear">Most special first</option><option value="name">A to Z</option></select></label></div>' +
      (list.length ? '<div class="items">' + list.map(function (it) {
        var own = mine(it), wearing = p.wearing[it.slot] === it.v, r = OM.rarity(it.price);
        return '<div class="item card r-' + r.toLowerCase() + (tryOn === it.id ? ' trying' : '') + '"><button class="tryon" data-act="try" data-arg="' + it.id + '" aria-label="Try on ' + it.label + '">' + avatar(72, p, null, wearPlus(it)) + '</button><b>' + it.label + '</b><span class="rar">' + r + '</span>' +
          (own ? '<button class="btn small ' + (wearing ? 'ghost' : 'green') + '" data-act="wear" data-arg="' + it.id + '">' + (wearing ? 'Take off' : 'Wear') + '</button>'
            : '<button class="btn small" data-act="buy" data-arg="' + it.id + '"' + (p.acorns < it.price ? ' disabled' : '') + ' aria-label="Buy for ' + it.price + ' acorns">' + I('acorn', { size: 20 }) + it.price + '</button>') + '</div>';
      }).join('') + '</div>' : '<p class="muted">' + (show === 'mine' ? 'Nothing here yet. Buy something with your acorns!' : 'Nothing you can buy here yet. Keep practising to earn more acorns!') + '</p>') +
      '<button class="mitem light" data-act="team"><span class="mi">' + I('user', { size: 26 }) + '</span><span><b>Change characters</b><small>Your animal, ' + esc(owlName()) + '’s colour and the baddie</small></span>' + I('next', { size: 20 }) + '</button></div></main>', {
      team: function () { App.go('team'); },
      slot: function (s2) { App.go('shop', { slot: s2, show: show, sort: sort }, true); },
      try: function (id) { App.go('shop', { slot: slot, show: show, sort: sort, tryOn: tryOn === id ? null : id }, true); },
      undress: function () { p.wearing = {}; S.save(); App.go('shop', { slot: slot, show: show, sort: sort }, true); },
      buy: function (id) { var it = OM.outfitById(id); if (!it || p.acorns < it.price || mine(it)) return; p.acorns -= it.price; p.owned.push(id); p.wearing[it.slot] = it.v; S.save(); OM.sfx.reward(); if (it.price >= 100) confetti(); toast('You bought the ' + it.label.toLowerCase() + '!'); App.go('shop', { slot: slot, show: show, sort: sort }, true); },
      wear: function (id) { var it = OM.outfitById(id); p.wearing[it.slot] = p.wearing[it.slot] === it.v ? null : it.v; S.save(); App.go('shop', { slot: slot, show: show, sort: sort, tryOn: null }, true); }
    });
    var ss = doc.getElementById('shopshow'), so = doc.getElementById('shopsort');
    ss.value = show; so.value = sort;
    ss.onchange = function () { App.go('shop', { slot: slot, show: ss.value, sort: sort }, true); };
    so.onchange = function () { App.go('shop', { slot: slot, show: show, sort: so.value }, true); };
  };

  // ---------- CHARACTERS: change your animal, the owl's colour and the baddie at any time ----------
  function owlColourPicker(sel) {
    return '<div class="swatches">' + Object.keys(OM.OWL_COLOURS).map(function (c) {
      return '<label class="sw"><input type="radio" name="colour" value="' + c + '"' + (c === sel ? ' checked' : '') + '>' + OM.owlSVG({ colour: c, size: 54 }) + '<span>' + c + '</span></label>';
    }).join('') + '</div>';
  }
  function lookPicker(p) {
    var own = OM.tierForYear(yearOf(p)), cur = tier(p);
    return '<div class="picker wide">' + OM.TIERS.filter(function (t) { return OM.tierIndex(t.id) <= OM.tierIndex(own); }).map(function (t) {
      return '<label class="pick"><input type="radio" name="look" value="' + t.id + '"' + (t.id === cur ? ' checked' : '') + '>' +
        OM.animalSVG(p.avatar || 'otter', { size: 62, tier: t.id, real: t.id === 'pro' ? Math.min(1, Math.max(0.2, (yearOf(p) - 6) / 5)) : 0 }) + '<span>' + t.name + (t.id === own ? ' <small class="muted">(Year ' + yearOf(p) + ')</small>' : '') + '</span></label>';
    }).join('') + '</div>';
  }
  Screens.team = function () {
    var p = App.profile;
    mount(header('Characters', { icon: 'user' }) + '<main class="team"><div class="card preview teamview"><div class="duo">' + avatar(120, null, 'cheer') + owl('happy', 140) + '</div>' +
      '<p class="vs">against</p>' + kingSVG(110) + '<p class="small-note">Changes save straight away. Your stars, feathers and acorns are kept.</p></div>' +
      '<form class="card form" id="who" data-nosubmit>' +
      '<fieldset><legend>Your animal</legend>' + avatarPicker(p.avatar || 'otter', p.baddie || 'cat', realFor(p)) + '</fieldset>' +
      (OM.tierForYear(yearOf(p)) !== 'little' ? '<fieldset><legend>Your look</legend><p class="small-note">Your characters grow up as you move up the school years. You can keep an earlier look if you like it better.</p>' + lookPicker(p) + '</fieldset>' : '') +
      (OM.canSpeak() && OM.voices().length ? '<fieldset><legend>' + esc(owlName()) + '’s voice</legend><p class="small-note">This is your own voice choice; other explorers can pick a different one.</p><div class="row"><select name="pipvoice" class="ans">' + OM.voices().map(function (v) { return '<option value="' + esc(v.id) + '"' + (v.id === OM.currentVoiceId() ? ' selected' : '') + '>' + esc(v.name) + ' (' + v.accent + ')</option>'; }).join('') + '</select><button type="button" class="btn small ghost" data-act="hearvoice">' + I('speaker', { size: 20 }) + 'Hear it</button></div></fieldset>' : '') +
      '<fieldset><legend>' + esc(owlName()) + '’s colour</legend>' + owlColourPicker(p.colour || 'brown') + '</fieldset>' +
      '<fieldset><legend>The baddie</legend><p class="small-note">The guards change to match. Guards you have already beaten stay beaten.</p>' + baddiePicker(p.baddie || 'cat', realFor(p)) + '</fieldset></form></main>', { hearvoice: function () { OM.say('Hoo hoo! What is 7 times 8?', { force: true }); } });
    var who = doc.getElementById('who');
    syncPickers(who);
    who.addEventListener('change', function (e) {
      if (e.target.name === 'pipvoice') { OM.setVoice(e.target.value); OM.say('Hoo hoo! I will read your questions in this voice.', { force: true }); return; }
      if (e.target.name === 'baddie') syncPickers(who);
      p.avatar = (who.querySelector('[name="avatar"]:checked') || {}).value || p.avatar;
      p.baddie = (who.querySelector('[name="baddie"]:checked') || {}).value || p.baddie;
      p.colour = (who.querySelector('[name="colour"]:checked') || {}).value || p.colour;
      var lk = who.querySelector('[name="look"]:checked'); if (lk) p.look = lk.value === OM.tierForYear(yearOf(p)) ? null : lk.value;
      S.save(); OM.sfx.tap();
      var y = G.scrollY, focus = e.target.name + '=' + e.target.value;
      App.go('team', {}, true); G.scrollTo(0, y);
      var again = doc.querySelector('[name="' + focus.split('=')[0] + '"][value="' + focus.split('=')[1] + '"]'); if (again && !again.disabled) again.focus();
    });
  };

  // ---------- HELP BOOK ----------
  Screens.help = function () {
    mount(header('Help book', { icon: 'book' }) + '<main><p>Choose a topic to see how to do it, the common mistakes to avoid, and a worked example.</p><div class="helpgrid">' +
      CUR().regions.map(function (r) {
        return '<div class="card" style="--rc:' + r.color + '"><h3>' + I(r.icon, { size: 26 }) + r.name + '</h3><p class="small-note">' + r.strand + '</p><div class="chips">' +
          r.objectives.filter(function (o) { return OM.objVisible(o, App.profile); }).map(function (o) { return '<button class="chip btnchip" data-act="topic" data-arg="' + o.id + '">' + o.title + (o.tier === 'H' ? ' <small class="htag">Higher</small>' : '') + '</button>'; }).join('') + '</div></div>';
      }).join('') + '</div></main>', { topic: function (id) { App.go('helpTopic', { id: id }); } });
  };
  Screens.helpTopic = function (pr) {
    var o = OM.objectiveIndex[pr.id], seed = pr.seed || OM.newSeed(), ex = OM.generate(o.gens[(pr.g || 0) % o.gens.length], 2, seed), step = pr.step || 0;
    mount(header('Help: ' + o.title, { color: regionOf(o.id).color }) + '<main class="helpt">' +
      '<div class="card"><h3>What you need to know</h3>' + o.intro.map(function (s) { return '<div class="kn"><p>' + T(s.say) + ' ' + speakBtn(s.say) + '</p>' + (s.vis ? '<div class="vis-wrap">' + s.vis(V) + '</div>' : '') + '</div>'; }).join('') + '</div>' +
      '<div class="card"><h3>How to do it</h3><ol class="method">' + o.method.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ol>' + speakBtn(o.method.join('. ')) + '</div>' +
      '<div class="card warn"><h3>' + I('warn', { size: 24 }) + 'Watch out for these mistakes</h3><ul>' + o.mistakes.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul></div>' +
      '<div class="card"><h3>Key words</h3><div class="chips">' + o.vocab.map(function (v) { return '<span class="chip">' + v + '</span>'; }).join('') + '</div></div>' +
      '<div class="card"><h3>Worked example</h3><div class="qprompt small">' + ex.prompt + '</div>' + (ex.visual ? '<div class="vis-wrap">' + (ex.shown || ex.visual) + '</div>' : '') +
      ex.solution.slice(0, step + 1).map(function (s, k) { return '<div class="step"><span class="stepn">' + (k + 1) + '</span><div><p>' + s.text + '</p>' + (s.html ? '<div class="vis-wrap">' + s.html + '</div>' : '') + '</div></div>'; }).join('') +
      (step + 1 < ex.solution.length ? '<button class="btn" data-act="step">Next step' + I('next', { size: 22, stroke: 2.5 }) + '</button>' : '<p><b>Answer: ' + ex.answerText + '</b></p>') +
      ' <button class="btn ghost" data-act="newex">Another example</button></div>' +
      '<details class="card"><summary>For grown-ups: the National Curriculum statement</summary><p><b>' + o.id + '</b> (Year ' + o.year + ', statutory): “' + o.statement + '”' + (o.focus ? ' <i>This year: ' + o.focus + '</i>' : '') + '</p>' + (o.note ? '<p class="muted">' + o.note + '</p>' : '') + '</details>' +
      '<div class="row"><button class="btn big" data-act="practise">' + I('pencil', { size: 22 }) + 'Practise this</button></div></main>', {
      step: function () { App.go('helpTopic', { id: pr.id, seed: seed, g: pr.g, step: step + 1 }, true); },
      newex: function () { App.go('helpTopic', { id: pr.id, g: (pr.g || 0) + 1 }, true); },
      practise: function () { if (!App.profile) return toast('Choose an explorer first.'); App.go('practice', { id: pr.id }); }
    });
  };

  // ---------- GROWN-UPS' AREA ----------
  Screens.parent = function (pr) {
    var s = S.settings();
    if (!pr.ok) {
      mount(header('Grown-ups’ area') + '<main class="narrow"><form class="card form" id="pf"><p>' + (s.pin ? 'Enter your 4-digit PIN.' : 'Create a 4-digit PIN so children cannot change settings. (This is a simple lock, not security.)') + '</p>' +
        '<input name="pin" inputmode="numeric" maxlength="4" pattern="\\d{4}" required autocomplete="off" class="pin"><button class="btn big" type="submit">' + (s.pin ? 'Open' : 'Save PIN') + '</button>' +
        (s.pin ? '<p class="muted small-note">Forgotten the PIN? Delete this app’s site data in your browser settings to reset everything.</p>' : '') + '</form></main>', {});
      doc.getElementById('pf').onsubmit = function (e) {
        e.preventDefault(); var v = e.target.pin.value;
        if (!/^\d{4}$/.test(v)) return;
        if (!s.pin) { s.pin = v; S.save(); }
        if (v === s.pin) App.go('parent', { ok: true, tab: 'progress' }, true); else toast('That PIN is not right.');
      };
      return;
    }
    var tab = pr.tab || 'progress', ps = S.profiles(), sel = pr.child || (ps[0] && ps[0].id);
    var repN = S.data.reports.length, sections = [
      ['Child settings', [['child', 'Year, text style and code'], ['limits', 'Time limits'], ['move', 'Move a child']]],
      ['Progress', [['progress', 'Stars and tests'], ['improve', 'Improvement'], ['certs', 'Certificates']]],
      ['Content' + (repN ? ' (' + repN + ')' : ''), [['reports', 'Reported questions (' + repN + ')'], ['review', 'Check the content'], ['about', 'How accuracy is checked']]],
      ['Settings and back-up', [['settings', 'Settings'], ['backup', 'Back-up']]]
    ], section = sections.filter(function (x) { return x[1].some(function (t) { return t[0] === tab; }); })[0];
    var picker = ps.length ? '<div class="row">' + ps.map(function (p) { return '<button class="btn small ' + (p.id === sel ? '' : 'ghost') + '" data-act="child" data-arg="' + p.id + '">' + esc(p.name) + '</button>'; }).join('') + '</div>' : '<p>No explorers yet.</p>';
    var openFile = '<label class="btn filebtn">' + I('download', { size: 20 }) + 'Open a file<input type="file" accept=".json,application/json" id="imp" hidden></label>';
    var body = '';
    if (tab === 'child') {
      var c = S.get(sel);
      body = picker;
      if (c) {
        body += '<div class="card yearcard"><label class="form">School year for ' + esc(c.name) + '<select id="yearsel">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter(function (y) { return OM.CURRICULUM['Y' + y]; }).map(function (y) { return '<option value="' + y + '"' + (y === yearOf(c) ? ' selected' : '') + '>Year ' + y + ' · ' + OM.worldFor(y).name + '</option>'; }).join('') + '</select></label>' +
          '<p class="small-note">Moving up a year starts that year’s adventure. Progress in every year is kept, so you can move back at any time.</p></div>';
        body += '<div class="card yearcard"><label class="form">Text style for ' + esc(c.name) + '<select id="fontsel"><option value="normal">Standard</option><option value="dyslexia"' + (c.font === 'dyslexia' ? ' selected' : '') + '>Dyslexia-friendly (wider spacing, simpler letters)</option></select></label>' +
          '<p class="small-note">Used whenever ' + esc(c.name) + ' is playing on this device. The page for choosing a name and this grown-ups’ area stay in the standard style.</p></div>';
        body += '<div class="card yearcard codeset"><h3>' + I('lock', { size: 20 }) + ' Secret code for ' + esc(c.name) + '</h3>' +
          '<label class="chk"><input type="checkbox" id="codeon"' + (codeOn(c) ? ' checked' : '') + '> Ask for ' + esc(c.name) + '’s 3-number secret code when they choose their name</label>' +
          '<p class="small-note">' + (!codeOn(c) ? 'Off: anyone can tap ' + esc(c.name) + '’s name and play.' : c.code ? 'On. ' + esc(c.name) + ' has chosen a code.' : 'On. ' + esc(c.name) + ' will make up a code the next time they choose their name.') +
          ' The code stops other children playing as ' + esc(c.name) + ' by accident. It is a simple lock, not security.</p>' +
          (c.code ? '<button class="btn small ghost" data-act="resetcode" data-arg="' + c.id + '">' + I('refresh', { size: 18 }) + 'Reset the code</button> <span class="muted small-note">' + esc(c.name) + ' will make up a new one next time.</span>' : '') + '</div>';
        if (yearOf(c) >= 7) { var bd = OM.boardById(c.board); body += '<div class="card yearcard"><h3>GCSE choices for ' + esc(c.name) + '</h3><div class="row">' +
          '<label class="form">Exam board<select id="boardsel"><option value="">Not chosen yet</option>' + OM.EXAM_BOARDS.map(function (b) { return '<option value="' + b.id + '"' + (c.board === b.id ? ' selected' : '') + '>' + b.name + '</option>'; }).join('') + '</select></label>' +
          '<label class="form">Tier<select id="tiersel"><option value="">Not chosen yet</option>' + OM.GCSE_TIERS.map(function (t) { return '<option value="' + t.id + '"' + (c.tier === t.id ? ' selected' : '') + '>' + t.name + ' (grades ' + t.grades + ')</option>'; }).join('') + '</select></label></div>' +
          '<p class="small-note">' + (bd ? bd.name + ': ' + bd.papers.length + ' papers of ' + (bd.minutes === 90 ? '1 hour 30 minutes' : '2 hours 15 minutes') + ', ' + bd.marks + ' marks each. ' + bd.papers.filter(function (x) { return !x.calc; }).map(function (x) { return x.name; }).join(', ') + ' is non-calculator. ' : '') +
          'Every board teaches the same content, so this only changes the layout of GCSE practice papers in Years 10 and 11. Ask school which board and tier they use. You can change these at any time.</p></div>'; }
        body += '<div class="card warn"><h3>Remove ' + esc(c.name) + '</h3><p class="small-note">This deletes ' + esc(c.name) + ' and all their progress from this device.</p><button class="btn small ghost" data-act="delp" data-arg="' + c.id + '">Remove ' + esc(c.name) + '</button></div>';
      }
    }
    if (tab === 'limits') {
      var tc = S.get(sel), lim = tc && (tc.limits || {}), dl = PT.DEFAULTS;
      var limNum = function (name, val, label, lo, hi) { return '<input class="ptn" type="number" inputmode="numeric" name="' + name + '" min="' + lo + '" max="' + hi + '" value="' + val + '" aria-label="' + label + '">'; };
      var limRow = function (name, words) { return '<div class="ptrow"><input type="checkbox" name="on_' + name + '" aria-label="Use this limit"' + (lim[name] ? ' checked' : '') + '><span class="ptwords">' + words + '</span></div>'; };
      body = picker;
      if (tc) body += '<form class="card ptset" id="ptform"><h3>' + I('timer', { size: 20 }) + ' Play time limits for ' + esc(tc.name) + '</h3>' +
        '<p>Tick the limits you want. Each child has their own, and anything left unticked has no limit.</p>' +
        limRow('row', 'No more than ' + limNum('row', lim.row || dl.row, 'Minutes in a row', 1, 600) + ' minutes in a row, then a break of ' + limNum('brk', lim.brk || dl.brk, 'Minutes of break', 1, 240) + ' minutes') +
        limRow('hour', 'No more than ' + limNum('hour', lim.hour || dl.hour, 'Minutes each hour', 1, 60) + ' minutes each hour') +
        limRow('span', 'No more than ' + limNum('span', lim.span || dl.span, 'Minutes over several hours', 1, 1440) + ' minutes every ' + limNum('spanH', lim.spanH || dl.spanH, 'Number of hours', 2, 24) + ' hours') +
        limRow('day', 'No more than ' + limNum('day', lim.day || dl.day, 'Minutes each day', 1, 1440) + ' minutes each day') +
        '<div class="ptrow ptext"><input type="checkbox" name="ext" aria-label="Allow extra minutes"' + (lim.ext ? ' checked' : '') + '><span class="ptwords">Let ' + esc(tc.name) + ' tap <b>Extend by ' + PT.BONUS_MINS + ' minutes</b> on the Play time limit pop-up, once for each limit. No more extensions are possible after that, until the limit starts again.</span></div>' +
        '<button class="btn big" type="submit">Save limits for ' + esc(tc.name) + '</button></form>' +
        '<div class="card ptfree"><h3>' + I('check', { size: 20, stroke: 2.6 }) + ' Tests and practice papers are not limited</h3>' +
        '<p>The time spent on these never counts towards any limit, and the Play time limit pop-up never appears during one:</p>' +
        '<ul><li>Practice papers, including SATs-style and GCSE-style papers</li><li>Challenges against the guards</li><li>Topic quizzes</li><li>Times tables checks on the Tables Tree</li><li>Trick Box speed rounds</li><li>11+ timed tests</li></ul>' +
        '<p>Everything else counts, including lessons, practice, the map and the dressing-up chest. If a limit has been reached, the pop-up appears when ' + esc(tc.name) + ' finishes, and they cannot start another test until they can play again.</p></div>' +
        '<div class="card"><h3>How time is counted</h3><ul>' +
        '<li>Whatever the limits, ' + esc(owlName()) + ' suggests a break after ' + PT.NUDGE_MINS + ' minutes in a row, and children can earn up to ' + PT.ACORNS_A_DAY + ' acorns a day, so playing for longer never earns more outfits.</li>' +
        '<li>Time counts only while the app is on screen. It pauses if nobody touches it for ' + PT.IDLE_MS / 60000 + ' minutes.</li>' +
        '<li>“In a row” starts again after the break you set. Time spent on a test does not count as a break.</li>' +
        '<li>“Each hour” and “every few hours” start when ' + esc(tc.name) + ' starts playing, and “each day” ends at midnight. The pop-up says when they can play again.</li>' +
        '<li>Time is counted on this device only, using its clock. This is a simple lock, not security.</li></ul>' +
        (PT.active(tc) ? '<p><b>' + esc(tc.name) + ' has played for ' + PT.usedToday(tc, Date.now()) + ' minutes today on this device.</b></p><button class="btn small ghost" type="button" data-act="ptreset" data-arg="' + tc.id + '">' + I('refresh', { size: 18 }) + 'Start the counted time again</button> <span class="muted small-note">Use this to give more time now. It also makes the extensions available again.</span>' : '') + '</div>';
    }
    if (tab === 'progress') {
      var c = S.get(sel);
      body = picker;
      if (c) {
        var regsC = CUR(c).regions, beaten = regsC.filter(function (r) { return guardBeaten(r, c); }).length, mtcBest = c.mtc.filter(function (t) { return (t.year || 4) === yearOf(c); }).reduce(function (m, t) { return Math.max(m, t.score); }, -1);
        body += '<div class="statgrid"><div><b>' + c.feathers + '</b>feathers</div><div><b>' + c.days.length + '</b>days practised</div><div><b>' + OM.playtime.acornsLeft(c, Date.now()) + '</b>acorns left today</div><div><b>' + beaten + '/' + regsC.length + '</b>guards beaten</div><div><b>' + (mtcBest < 0 ? '–' : mtcBest + '/25') + '</b>best tables check</div><div><b>' + c.fixIts + '</b>mistakes fixed</div></div>';
        body += '<table class="data-table prog"><thead><tr><th>Objective</th><th>Stars</th><th>Correct</th><th>Answered</th><th>Level now</th><th>Last practised</th></tr></thead><tbody>' +
          regsC.map(function (r) {
            return '<tr class="rh"><td colspan="6" style="background:' + r.color + '">' + r.name + ' — ' + r.strand + '</td></tr>' + r.objectives.map(function (o) {
              var pg = c.progress[o.id], att = pg ? pg.lv[1].a + pg.lv[2].a + pg.lv[3].a : 0, acc = S.accuracy(c, o.id);
              return '<tr><td><small>' + o.id + '</small> ' + o.title + '</td><td>' + starsHTML(S.stars(c, o.id)) + '</td><td>' + (acc === null ? '–' : acc + '%') + '</td><td>' + att + '</td><td>' + (pg ? LEVEL_NAMES[pg.level] : '–') + '</td><td>' + (pg && pg.last ? new Date(pg.last).toLocaleDateString('en-GB') : '–') + '</td></tr>';
            }).join('');
          }).join('') + '</tbody></table>';
        body += '<h3>Tests</h3>' + (c.tests.length ? '<table class="data-table"><thead><tr><th>Date</th><th>Test</th><th>Score</th></tr></thead><tbody>' + c.tests.slice().reverse().map(function (t) {
          var ty = t.year || 4, tc = OM.CURRICULUM['Y' + ty], tr = tc && tc.regions.filter(function (r) { return r.id === t.region; })[0];
          var name = t.kind === 'tricks' ? 'Trick Box speed round' : t.kind === 'eleven' ? '11+: ' + ((OM.CURRICULUM.YXP && OM.CURRICULUM.YXP.tests[t.track]) || { title: 'test' }).title : 'Year ' + ty + ': ' + (t.kind === 'paper' ? ((OM.papersFor(ty, c) || {})[t.paper] || { title: 'Paper' }).title : t.kind === 'guard' ? 'Guard challenge, ' + (tr ? tr.name : t.region) : 'Quiz, ' + ((OM.objectiveIndex[t.id] || {}).title || t.id));
          return '<tr><td>' + new Date(t.date).toLocaleString('en-GB') + '</td><td>' + name + '</td><td>' + t.score + '/' + t.max + ' (' + Math.round(100 * t.score / t.max) + '%)</td></tr>';
        }).join('') + '</tbody></table>' : '<p class="muted">No tests taken yet.</p>');
        body += '<p class="muted">Stars: a star is earned at each level (Getting there, Expected, Greater depth) after at least 5 correct answers with 70% or more of the last 10 correct.</p>';
      }
    }
    if (tab === 'improve') {
      var ci = S.get(sel);
      body = (picker) +
        (ci ? '<h2 class="thead2">How ' + esc(ci.name) + ' is improving</h2>' + OM.trackerHTML(ci, S.totalStars(ci)) : '');
    }
    if (tab === 'review') {
      var allYears = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter(function (y) { return OM.CURRICULUM['Y' + y]; });
      var oid = pr.obj || CUR(S.get(sel)).regions[0].objectives[0].id, o = OM.objectiveIndex[oid], seed = pr.seed || 12345;
      body = '<label>Objective <select id="objsel">' + [].concat.apply([], allYears.map(function (y) { return OM.CURRICULUM['Y' + y].regions; })).map(function (r) { return '<optgroup label="Year ' + r.objectives[0].year + ', ' + r.name + '">' + r.objectives.map(function (x) { return '<option value="' + x.id + '"' + (x.id === oid ? ' selected' : '') + '>' + x.id + ' ' + x.title + '</option>'; }).join('') + '</optgroup>'; }).join('') + '</select></label>' +
        '<div class="card"><p><b>Statutory requirement:</b> “' + o.statement + '”</p>' + (o.focus ? '<p><b>Year ' + o.year + ' focus:</b> ' + o.focus + '</p>' : '') + (o.note ? '<p class="muted">' + o.note + '</p>' : '') + '<p><b>Method taught:</b></p><ol>' + o.method.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ol><p><b>Common mistakes covered:</b> ' + o.mistakes.join(' · ') + '</p></div>' +
        '<p>Sample questions (each level), exactly as a child sees them, with the answer and mark scheme: <button class="btn small" data-act="more">Show different samples</button></p>' +
        o.gens.map(function (g) {
          return OM.gens[g].levels.map(function (L) {
            var q = OM.generate(g, L, seed + L * 31 + g.length);
            return '<details class="card review"><summary><b>' + LEVEL_NAMES[L] + '</b> · ' + OM.gens[g].title + ' — ' + OM.speakable(q.prompt).slice(0, 80) + '</summary><div class="qprompt small">' + q.prompt + '</div>' + (q.visual ? '<div class="vis-wrap">' + q.visual + '</div>' : '') +
              '<p><b>Answer:</b> ' + q.answerText + '</p><div class="scheme open"><ul>' + OM.schemeLines(q).map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul></div>' +
              '<div class="solution">' + q.solution.map(function (s2, n) { return '<div class="step"><span class="stepn">' + (n + 1) + '</span><div><p>' + s2.text + '</p>' + (s2.html ? '<div class="vis-wrap">' + s2.html + '</div>' : '') + '</div></div>'; }).join('') + '</div>' +
              '<p class="muted">Generator ' + g + ', level ' + L + ', seed ' + q.seed + '</p></details>';
          }).join('');
        }).join('');
    }
    if (tab === 'certs') {
      var kid = S.get(sel), won = kid ? OM.cert.completed(kid) : [];
      body = picker;
      if (kid) body += won.length ? won.map(function (v) {
        var st = OM.cert.stats(kid, v), wd = OM.cert.wording(kid, v);
        return '<div class="card certrow"><div><h3>Year ' + v + (wd.date ? ' <small class="muted">' + esc(wd.date) + '</small>' : '') + '</h3><p>' + esc(wd.line) + '.</p><p class="small-note">Stars: ' + st.stars + ' · Feathers: ' + st.feathers + ' · Acorns: ' + st.acorns + '</p></div><button class="btn" data-act="opencert" data-arg="' + kid.id + '|' + v + '">' + I('trophy', { size: 20 }) + 'Open, save or print</button></div>';
      }).join('') : '<div class="card"><p>' + esc(kid.name) + ' has no certificates yet. One appears here when they win the final challenge of a year, by passing all the practice papers at ' + esc(OM.cert.gateName(yearOf(kid))) + '.</p></div>';
    }
    if (tab === 'reports') {
      body = S.data.reports.length ? S.data.reports.slice().reverse().map(function (r, k) {
        var q = OM.generate(r.gen, r.level, r.seed);
        return '<details class="card review"><summary>' + new Date(r.date).toLocaleString('en-GB') + ' · ' + esc(r.profile) + ' · ' + r.objective + '</summary><div class="qprompt small">' + q.prompt + '</div>' + (q.visual ? '<div class="vis-wrap">' + q.visual + '</div>' : '') +
          '<p><b>Their answer at the time:</b> ' + esc(r.response) + '</p><p><b>Answer:</b> ' + q.answerText + '</p><ul>' + OM.schemeLines(q).map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul>' +
          '<p class="muted">To reproduce: generator ' + r.gen + ', level ' + r.level + ', seed ' + r.seed + '.</p><button class="btn small ghost" data-act="delrep" data-arg="' + (S.data.reports.length - 1 - k) + '">Remove</button></details>';
      }).join('') : '<p class="muted">Nothing reported. Children can tap “Something wrong with this question?” while practising.</p>';
    }
    if (tab === 'settings') {
      body = '<div class="card offlinecard" id="offbox"><h3>' + I('download', { size: 20 }) + ' Using Mayes Maths &amp; More offline</h3><p class="muted small-note">Checking…</p></div>' +
        '<div class="card form" id="sndbox"><h3>Sound, voice and motion</h3><p class="small-note">Changes save straight away. Children can also change these with the speaker button at the top of every screen.</p>' + soundControls() + '</div>' +
        '<form class="card form" id="sf"><h3>Other settings</h3>' +
        '<label>On-screen number keypad<select name="keypad"><option value="auto">Automatic (on for tablets)</option><option value="on">Always on</option><option value="off">Off (use the keyboard)</option></select></label>' +
        '<label class="chk"><input type="checkbox" name="paperTimers"' + (s.paperTimers ? ' checked' : '') + '> Time limits on practice papers</label>' +
        '<div class="row"><button class="btn" type="submit">Save settings</button><button type="button" class="btn ghost" data-act="newpin">Change PIN</button></div></form>';
    }
    if (tab === 'move') {
      var mc = S.get(sel);
      body = picker + (mc ? '<div class="card movecard"><h3>' + I('upload', { size: 20 }) + ' Move ' + esc(mc.name) + ' to another device</h3>' +
        '<p class="small-note">Their progress, stars, acorns, outfits, tests and improvement record go with them. Nothing passes through the internet: you send the file yourself, or the other device scans codes from this screen.</p>' +
        '<div class="row"><button class="btn small" data-act="sendfile" data-arg="' + mc.id + '">' + I('upload', { size: 18 }) + 'Share as a file</button>' +
        '<button class="btn small ghost" data-act="sendqr" data-arg="' + mc.id + '">' + I('qr', { size: 18 }) + 'Show QR codes</button></div></div>' : '') +
        '<div class="card movecard"><h3>' + I('download', { size: 20 }) + ' Add a child from another device</h3>' +
        '<p class="small-note">Open the file you were sent (or a full back-up), or scan the QR codes shown on the other device. You will see what is in it first, then choose to add the child or combine them with the same child here. Combining never loses anything.</p>' +
        '<div class="row">' + openFile + '<button class="btn ghost" data-act="scanqr">' + I('qr', { size: 20 }) + 'Scan QR codes</button></div></div>';
    }
    if (tab === 'backup') {
      var lastB = s.lastBackup ? 'Last back-up: <b>' + new Date(s.lastBackup).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + '</b>.' : '<b>No back-up made yet on this device.</b>';
      body = '<div class="card"><h3>' + I('download', { size: 20 }) + ' Back up everyone</h3><p>Progress is saved in this browser on this device only. A back-up file keeps every explorer safe if the device is lost or the browser data is cleared. ' + lastB + '</p>' +
        '<button class="btn" data-act="export">' + I('download', { size: 20 }) + 'Save a back-up now</button></div>' +
        '<div class="card"><label class="form">How often to back up<select id="backupsel">' + [['daily', 'Every day'], ['weekly', 'Every week'], ['monthly', 'Every month'], ['off', 'I will do it myself (no reminders)']].map(function (o) { return '<option value="' + o[0] + '"' + (s.backupEvery === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label>' +
        '<p class="small-note">When a back-up is due, a reminder appears on the page where children choose their name, and here in the grown-ups’ area. One tap saves the file. The app cannot save a file while it is closed, or without someone tapping, so please keep each file somewhere safe, away from this device if you can.</p></div>' +
        '<div class="card"><h3>Restore from a back-up</h3><p class="small-note">Each explorer in the file is added, or combined with the same explorer already here. Combining never loses anything.</p>' + openFile + '</div>';
    }
    if (tab === 'about') {
      var gensN = Object.keys(OM.gens).length, objN = Object.keys(OM.objectiveIndex).length;
      var yrs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter(function (y) { return OM.CURRICULUM['Y' + y]; });
      body = '<div class="card"><h3>Where the content comes from</h3><p>The Department for Education’s National Curriculum in England: mathematics programmes of study. Every one of the ' + objN + ' statutory statements for ' + yrs.map(function (y) { return 'Year ' + y; }).join(', ').replace(/, ([^,]*)$/, ' and $1') + ' is included word for word (see “Check the content”), with its own lesson, method, common mistakes, key words and question generator. The checker compares each one with the official text.</p>' +
        '<h3>How the questions are checked</h3><ul><li><b>' + gensN + ' question generators</b> make unlimited questions at three levels: Getting there, Expected and Greater depth.</li>' +
        '<li>Each generator has an <b>independent second check</b> that works the answer out a different way (for example, column methods digit by digit, shapes measured from their corners, digit puzzles by trying every number). A question is only right if both agree.</li>' +
        '<li><b>Limits for each year</b> are enforced, so questions only use numbers and ideas taught by then (for example Year 3 up to 1,000, Year 4 up to 10,000 with no degrees for angles, Year 5 up to 1,000,000).</li>' +
        '<li>Answers use <b>exact arithmetic</b> (no computer rounding errors). Methods and words match UK schools (e.g. “exchange”, never “borrow”).</li>' +
        '<li>Marking follows <b>KS2 mark-scheme conventions</b>: equivalent fractions accepted, money must be written correctly (£3.50 not £3.5), coordinates in the right order, 24-hour times without am/pm, and a <b>method mark</b> on 2-mark problems with no more than one arithmetic error.</li>' +
        '<li>The automated checker (<code>tests/run-checks.js</code>) generates tens of thousands of questions and fails if any answer is wrong, any limit is broken or any objective is missing content. The latest report is in <code>tests/content-report.md</code>.</li></ul>' +
        '<h3>What still needs a person</h3><p>No automated check is perfect. Please use “Check the content” to look over topics, and look at anything your child reports.</p><p class="small-note">' + OM.APP_NAME + ' · ' + (OM.versionText ? OM.versionText() : '') + ' · © 2026 Neil Mayes.</p></div>';
    }
    var nudge = S.backupDue(Date.now()) && tab !== 'backup' ? '<div class="card backupnudge"><span>' + I('download', { size: 22 }) + '</span><p>' + backupWords() + ' Progress is only saved on this device, so a back-up file keeps it safe if the device is lost or the browser data is cleared.</p><button class="btn small" data-act="tab" data-arg="backup">Make a back-up</button></div>' : '';
    mount(header('Grown-ups’ area', { icon: 'lock' }) + '<main class="parent">' + nudge + '<nav class="tabs">' + sections.map(function (x) { return '<button class="tab ' + (x === section ? 'on' : '') + '" data-act="tab" data-arg="' + x[1][0][0] + '">' + x[0] + '</button>'; }).join('') + '</nav>' +
      '<nav class="tabs subtabs">' + section[1].map(function (t) { return '<button class="tab ' + (t[0] === tab ? 'on' : '') + '" data-act="tab" data-arg="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</nav>' + body + '</main>', {
      tab: function (t) { App.go('parent', { ok: true, tab: t, child: sel }, true); },
      child: function (id) { App.go('parent', { ok: true, tab: tab, child: id }, true); },
      ptreset: function (id) { PT.reset(S.get(id)); S.save(); toast('Counted time started again.'); App.go('parent', { ok: true, tab: 'limits', child: id }, true); },
      more: function () { App.go('parent', { ok: true, tab: 'review', obj: pr.obj, seed: OM.newSeed() }, true); },
      opencert: function (v) { var q = String(v).split('|'); App.go('certificate', { child: q[0], year: +q[1] }); },
      delrep: function (k) { S.data.reports.splice(+k, 1); S.save(); App.go('parent', { ok: true, tab: 'reports' }, true); },
      testvoice: function () { OM.say('Hoo hoo! What is 7 times 8?', { force: true }); },
      newpin: function () { s.pin = null; S.save(); App.go('parent', {}, true); },
      export: function () { saveBackup(); App.go('parent', { ok: true, tab: 'backup', child: sel }, true); },
      resetcode: function (id) { var rc = S.get(id); if (G.confirm('Reset ' + rc.name + '’s secret code? They will make up a new one the next time they choose their name.')) { rc.code = null; S.save(); toast('Code reset.'); App.go('parent', { ok: true, tab: 'child', child: id }, true); } },
      sendfile: function (id) { OM.transfer.shareFile(S.childExport(id)).then(function (how) { if (how === 'downloaded') toast('Saved the file. Send it to the other device, then open it there.'); else if (how === 'shared') toast('Sent. Open the file on the other device.'); }); },
      sendqr: function (id) { OM.transfer.showQR(S.childExport(id)).catch(function () { toast('The QR codes could not be made on this device. Use “Share as a file” instead.'); }); },
      scanqr: function () { OM.transfer.scan(function (obj) { OM.transfer.review(obj, function (msg) { toast(msg); App.go('parent', { ok: true, tab: tab, child: sel }, true); }); }); },
      delp: function (id) { var p = S.get(id); if (G.confirm('Remove ' + p.name + ' and all their progress? This cannot be undone.')) { S.removeProfile(id); App.go('parent', { ok: true, tab: 'child' }, true); } }
    });
    if (tab === 'improve' && OM.bindTrackerTips) OM.bindTrackerTips(root);
    var bsel = doc.getElementById('backupsel');
    if (bsel) bsel.onchange = function () { s.backupEvery = bsel.value; S.save(); toast('Saved.'); };
    var ptf = doc.getElementById('ptform');
    if (ptf) ptf.onsubmit = function (e) {
      e.preventDefault(); var c = S.get(sel), f = ptf.elements, on = function (k) { return f['on_' + k].checked ? f[k].value : null; };
      if (!ptf.reportValidity()) return;
      c.limits = PT.clean({ row: on('row'), brk: f.brk.value, hour: on('hour'), span: on('span'), spanH: f.spanH.value, day: on('day'), ext: f.ext.checked });
      S.save(); toast('Limits saved for ' + esc(c.name) + '.'); App.go('parent', { ok: true, tab: 'limits', child: c.id }, true);
    };
    var objsel = doc.getElementById('objsel'); if (objsel) objsel.onchange = function () { App.go('parent', { ok: true, tab: 'review', obj: objsel.value }, true); };
    ['boardsel', 'tiersel'].forEach(function (id) { var el = doc.getElementById(id); if (el) el.onchange = function () { var c = S.get(sel); c[id === 'boardsel' ? 'board' : 'tier'] = el.value || null; S.save(); toast('Saved.'); App.go('parent', { ok: true, tab: 'child', child: c.id }, true); }; });
    var con = doc.getElementById('codeon');
    if (con) con.onchange = function () { var c = S.get(sel); c.codeOn = con.checked; S.save(); toast(con.checked ? 'Secret code turned on for ' + esc(c.name) + '.' : 'Secret code turned off for ' + esc(c.name) + '.'); App.go('parent', { ok: true, tab: 'child', child: c.id }, true); };
    var fsel = doc.getElementById('fontsel');
    if (fsel) fsel.onchange = function () { var c = S.get(sel); if (fsel.value === 'dyslexia') c.font = 'dyslexia'; else delete c.font; S.save(); toast('Text style saved for ' + esc(c.name) + '.'); };
    var ysel = doc.getElementById('yearsel');
    if (ysel) ysel.onchange = function () { var c = S.get(sel); c.year = +ysel.value; S.save(); toast(esc(c.name) + ' is now in Year ' + c.year + '.'); App.go('parent', { ok: true, tab: 'child', child: c.id }, true); };
    var offbox = doc.getElementById('offbox');
    if (offbox) fillOfflineCard(offbox);
    var sndbox = doc.getElementById('sndbox');
    if (sndbox) bindSoundControls(sndbox, refreshSoundBtns);
    var sf = doc.getElementById('sf');
    if (sf) {
      sf.keypad.value = s.keypad;
      sf.onsubmit = function (e) { e.preventDefault(); s.keypad = sf.keypad.value; s.paperTimers = sf.paperTimers.checked; S.save(); applyFont(); toast('Settings saved.'); };
    }
    var imp = doc.getElementById('imp');
    // any file: one child or a full backup; review it, then add or combine each explorer
    if (imp) imp.onchange = function () { var f = imp.files[0]; if (!f) return; OM.transfer.readFile(f).then(function (obj) { OM.transfer.review(obj, function (msg) { toast(msg); App.go('parent', { ok: true, tab: tab, child: sel }, true); }); }).catch(function () { toast('That file could not be read. Choose a Mayes Maths & More file.'); }); imp.value = ''; };
  };

  // the grown-ups' "Using it offline" card: is the app saved, is progress kept
  function fillOfflineCard(box) {
    var O = OM.offline;
    if (!O.canSave) {
      box.innerHTML = '<h3>' + I('download', { size: 20 }) + ' Using Mayes Maths &amp; More offline</h3><p>This copy was opened from a file, so it cannot save itself for offline use or update itself. Open it from its web address and choose <b>Install</b> to use it offline. See the front page for the steps on each device.</p>';
      return;
    }
    O.progressKept().then(function (kept) {
      box.innerHTML = '<h3>' + I('download', { size: 20 }) + ' Using Mayes Maths &amp; More offline</h3><ul class="offlist">' +
        '<li class="' + (O.appSaved() ? 'ok' : 'wait') + '"><b>The app</b>' + (O.appSaved() ? 'Saved on this device. It works with no internet connection and updates itself when you are online.' : 'Being saved now. Reload the page once and it will work offline.') + (O.installed() ? '' : ' Tip: install it from the front page so it opens like an app.') + '</li>' +
        '<li class="' + (kept ? 'ok' : 'wait') + '"><b>Saved progress</b>' + (kept ? 'The browser has agreed to keep progress on this device even when space runs low.' :
          'The browser may clear saved progress if the device runs short of space. <button class="btn small ghost" data-act="keepprog">Ask the browser to keep it</button> Making a backup now and then is the safest way.') + '</li></ul>';
      var kp = box.querySelector('[data-act="keepprog"]');
      if (kp) kp.onclick = function () { O.keepProgress().then(function (ok) { toast(ok ? 'The browser will keep progress on this device.' : 'This browser did not agree. Installing the app, and making backups, keeps progress safe.'); fillOfflineCard(box); }); };
    });
  }

  function applyFont() { doc.body.classList.toggle('dyslexia', !!App.profile && App.profile.font === 'dyslexia'); } // each child's own; pages with no child chosen use the standard style
  function applyMotion() { var m = S.settings().motion || 'auto'; doc.body.classList.toggle('motion-on', m === 'on'); doc.body.classList.toggle('motion-off', m === 'off'); }
  applyFont(); applyMotion();
  // Opening splash: the logo appears large on navy with the letter as a sigma (Σ), which swings a quarter-turn into the M;
  // then Pip hops onto its corner as the power (M³), and it all glides and shrinks into its place
  // on the player screen. Tap or press any key to skip.
  function splash() {
    var body = doc.body, reduced = body.classList.contains('motion-off') || (!body.classList.contains('motion-on') && G.matchMedia && G.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var d = doc.createElement('div'); d.className = 'splash'; d.setAttribute('role', 'img'); d.setAttribute('aria-label', OM.APP_NAME + ': ' + OM.TAGLINE);
    d.innerHTML = '<div class="splash-logo">' + OM.logo({ dark: true, size: 132 }) + '</div><div class="skip">Tap to start</div>';
    body.appendChild(d);
    var done = false;
    function finish() { d.classList.add('gone'); setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 550); doc.removeEventListener('keydown', onKey); }
    function go() {
      if (done) return; done = true;
      var el = d.querySelector('.splash-logo .logo'), target = doc.getElementById('homeLogo'), skip = d.querySelector('.skip'); if (skip) skip.remove();
      if (reduced || !target || !target.getBoundingClientRect().width) return finish();
      var a = el.getBoundingClientRect(), b = target.getBoundingClientRect();
      el.style.transition = 'transform .85s cubic-bezier(.6, 0, .2, 1)'; el.style.transformOrigin = 'top left';
      el.style.transform = 'translate(' + (b.left - a.left) + 'px, ' + (b.top - a.top) + 'px) scale(' + (b.width / a.width) + ')';
      d.classList.add('leaving');
      setTimeout(finish, 850);
    }
    function onKey() { go(); }
    d.onclick = go; doc.addEventListener('keydown', onKey);
    setTimeout(go, 3300);
  }
  App.go('home');
  splash();
})(window);
