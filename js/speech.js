/* Learn with Pip — read-aloud and sound effects.
   The natural offline voice (Cori, js/neural.js) is used when it is chosen and ready; otherwise the device's own voices. */
(function (G) {
  'use strict';
  var OM = G.OM, voice = null, current = null;
  function notify(text) { if (OM.onSpeech) OM.onSpeech(text); }
  // English voices installed on this device: British first, then ones that work offline, then by name
  function englishVoices() {
    var vs = (G.speechSynthesis && G.speechSynthesis.getVoices()) || [];
    function score(v) { return (/en[-_]GB/i.test(v.lang) ? 2 : 0) + (v.localService ? 1 : 0); }
    return vs.filter(function (v) { return /^en/i.test(v.lang); }).sort(function (a, b) { return score(b) - score(a) || a.name.localeCompare(b.name); });
  }
  // Each explorer can have their own voice and speed; anyone who has not chosen uses the family default (the grown-ups' choice)
  function who() { return OM.App && OM.App.profile; }
  function chosenVoice() { var p = who(); return p && p.voice ? p.voice : OM.Store.settings().voice; }
  function chosenRate() { var p = who(); return (p && p.rate) || OM.Store.settings().rate || 0.95; }
  OM.voiceRate = chosenRate;
  // Pip's natural voice is an optional 97 MB download. On the website it is only used once a grown-up has chosen to save
  // it on the device (Grown-ups' area → Settings, or the front page); a copy opened from a folder already includes it.
  function naturalReady() { return !OM.offline || !OM.offline.canSave || OM.offline.voiceIsSaved; }
  OM.naturalVoiceReady = naturalReady;
  // the natural voice is wanted when it is chosen, or when nothing is chosen and it is available
  function wantsNatural() { var w = chosenVoice(); return !!OM.neural && OM.neural.supported() && OM.neural.state() !== 'failed' && naturalReady() && (!w || w.indexOf('pip:') === 0); }
  function pickVoice() {
    var list = englishVoices(), want = chosenVoice();
    if (want && want.indexOf('pip:') === 0) want = null;
    voice = (want && list.filter(function (v) { return v.voiceURI === want; })[0]) || list[0] || null;
    return voice;
  }
  if (G.speechSynthesis) { pickVoice(); G.speechSynthesis.onvoiceschanged = function () { pickVoice(); if (OM.onVoicesChanged) OM.onVoicesChanged(); }; }
  OM.canSpeak = function () { return !!G.speechSynthesis || !!(OM.neural && OM.neural.supported()); };
  OM.voices = function () {
    var natural = OM.neural && OM.neural.supported() && OM.neural.state() !== 'failed' && naturalReady() ? OM.neural.voices.slice() : [];
    return natural.concat(englishVoices().map(function (v) {
      var accent = { 'en-GB': 'British', 'en-US': 'American', 'en-AU': 'Australian', 'en-IE': 'Irish', 'en-IN': 'Indian', 'en-CA': 'Canadian', 'en-NZ': 'New Zealand', 'en-ZA': 'South African' }[v.lang.replace('_', '-')] || v.lang;
      return { id: v.voiceURI, name: v.name.replace(/^(Microsoft|Google)\s+/, '').replace(/\s+(Online \(Natural\)\s+)?-\s+English.*$/, ''), accent: accent, offline: v.localService };
    }));
  };
  OM.currentVoiceId = function () { pickVoice(); return wantsNatural() ? OM.neural.voices[0].id : voice ? voice.voiceURI : null; };
  OM.setVoice = function (id) { var p = who(); if (p) p.voice = id || null; else OM.Store.settings().voice = id || null; OM.Store.save(); pickVoice(); if (wantsNatural()) OM.neural.load().catch(function () {}); };
  // start getting the natural voice ready in the background, so it is usually ready before the first question is read
  OM.prepareVoice = function () { if (wantsNatural() && OM.neural.state() === 'idle') OM.neural.load().catch(function () { if (OM.onVoicesChanged) OM.onVoicesChanged(); }); };
  OM.soundOn = function () { return !OM.Store.settings().muted; };
  OM.say = function (htmlOrText, opts) {
    var s = OM.Store.settings();
    if (s.muted) return;
    if (s.readAloud === 'off' && !(opts && opts.force)) return;
    OM.stopSpeaking();
    var text = OM.speakable(htmlOrText);
    if (!text) return;
    pickVoice();
    if (wantsNatural()) {
      if (OM.neural.state() === 'ready') {
        var job = {}; current = job; notify(text);
        OM.neural.speak(text, { rate: chosenRate(), onend: function () { if (current === job) { current = null; notify(null); } } });
        return;
      }
      OM.prepareVoice(); // not ready yet: use the device's voice this time
    }
    if (!G.speechSynthesis) return;
    var u = new G.SpeechSynthesisUtterance(text);
    if (voice || pickVoice()) u.voice = voice;
    u.lang = (voice && voice.lang) || 'en-GB';
    u.rate = chosenRate(); u.pitch = 1.05;
    u.onstart = function () { if (current === u) notify(text); };
    u.onend = u.onerror = function () { if (current === u) { current = null; notify(null); } };
    current = u; notify(text);
    G.speechSynthesis.speak(u);
  };
  OM.stopSpeaking = function () { if (G.speechSynthesis) G.speechSynthesis.cancel(); if (OM.neural) OM.neural.stop(); if (current) { current = null; notify(null); } };
  OM.autoSay = function (t) {
    var s = OM.Store.settings();
    if (s.readAloud === 'auto') return OM.say(t);
    if (!s.muted && wantsNatural()) OM.neural.prepare(OM.speakable(t), chosenRate());
  };

  var ctx = null;
  function tone(freq, start, dur, type, vol) {
    var st = OM.Store.settings();
    if (!st.sounds || st.muted) return;
    try {
      ctx = ctx || new (G.AudioContext || G.webkitAudioContext)();
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      g.gain.exponentialRampToValueAtTime(vol || 0.15, ctx.currentTime + start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
      o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + 0.05);
    } catch (e) { /* no audio available */ }
  }
  OM.sfx = {
    correct: function () { tone(660, 0, 0.15); tone(880, 0.12, 0.25); },
    wrong: function () { tone(300, 0, 0.25, 'triangle', 0.1); },
    reward: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.1, 0.25); }); },
    tick: function () { tone(1200, 0, 0.05, 'square', 0.03); },
    tap: function () { tone(500, 0, 0.06, 'sine', 0.05); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
