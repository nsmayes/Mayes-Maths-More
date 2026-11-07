/* Learn with Pip — read-aloud, using the device's own voices, and sound effects. */
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
  function pickVoice() {
    var list = englishVoices(), want = chosenVoice();
    voice = (want && list.filter(function (v) { return v.voiceURI === want; })[0]) || list[0] || null;
    return voice;
  }
  if (G.speechSynthesis) { pickVoice(); G.speechSynthesis.onvoiceschanged = function () { pickVoice(); if (OM.onVoicesChanged) OM.onVoicesChanged(); }; }
  OM.canSpeak = function () { return !!G.speechSynthesis; };
  OM.voices = function () {
    return englishVoices().map(function (v) {
      var accent = { 'en-GB': 'British', 'en-US': 'American', 'en-AU': 'Australian', 'en-IE': 'Irish', 'en-IN': 'Indian', 'en-CA': 'Canadian', 'en-NZ': 'New Zealand', 'en-ZA': 'South African' }[v.lang.replace('_', '-')] || v.lang;
      return { id: v.voiceURI, name: v.name.replace(/^(Microsoft|Google)\s+/, '').replace(/\s+(Online \(Natural\)\s+)?-\s+English.*$/, ''), accent: accent, offline: v.localService };
    });
  };
  OM.currentVoiceId = function () { pickVoice(); return voice ? voice.voiceURI : null; };
  OM.setVoice = function (id) { var p = who(); if (p) p.voice = id || null; else OM.Store.settings().voice = id || null; OM.Store.save(); pickVoice(); };
  OM.soundOn = function () { return !OM.Store.settings().muted; };
  OM.say = function (htmlOrText, opts) {
    var s = OM.Store.settings();
    if (s.muted) return;
    if (s.readAloud === 'off' && !(opts && opts.force)) return;
    OM.stopSpeaking();
    var text = OM.speakable(htmlOrText);
    if (!text) return;
    pickVoice();
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
  OM.stopSpeaking = function () { if (G.speechSynthesis) G.speechSynthesis.cancel(); if (current) { current = null; notify(null); } };
  OM.autoSay = function (t) {
    if (OM.Store.settings().readAloud === 'auto') return OM.say(t);
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
