/* Learn with Pip — natural offline voice ("Cori"), using the Piper speech engine running inside the browser.
   The engine and voice live in voice/engine.js and voice/cori.js (built by tools/build-voice.py). They are only loaded
   when the natural voice is wanted, because they are large (about 100 MB together). Until they are ready, and on any
   browser that cannot run them, speech.js falls back to the device's own voices, so reading aloud never goes silent. */
(function (G) {
  'use strict';
  var OM = G.OM, doc = G.document;
  var state = 'idle', loading = null, session = null, cfg = null, phonWasm = null, phonData = null, ctx = null;
  var cache = new Map(), playing = null;

  function supported() { return !!(G.WebAssembly && (G.AudioContext || G.webkitAudioContext) && G.atob && G.Blob && G.URL && doc); }
  function bytes(b64) { var bin = G.atob(b64), n = bin.length, u = new Uint8Array(n); for (var i = 0; i < n; i++) u[i] = bin.charCodeAt(i); return u.buffer; }
  function addScript(src) {
    return new Promise(function (resolve, reject) {
      var s = doc.createElement('script'); s.src = src; s.async = true;
      s.onload = resolve; s.onerror = function () { reject(new Error('Could not load ' + src)); };
      doc.head.appendChild(s);
    });
  }

  function load() {
    if (loading) return loading;
    if (!supported()) { state = 'failed'; return (loading = Promise.reject(new Error('not supported'))); }
    state = 'loading';
    loading = addScript('voice/engine.js').then(function () { return addScript('voice/cori.js'); }).then(function () {
      var A = G.PIPER_ASSETS, V = G.PIPER_VOICES.cori, ort = G.ort;
      ort.env.wasm.numThreads = 1; ort.env.wasm.proxy = false;
      ort.env.wasm.wasmPaths = { 'ort-wasm-simd.wasm': URL.createObjectURL(new Blob([bytes(A.ortSimd)], { type: 'application/wasm' })) };
      phonWasm = bytes(A.phonemizeWasm); phonData = bytes(A.phonemizeData);
      cfg = V.config;
      var model = bytes(V.model);
      // free the large text copies once they are turned into binary
      A.ortSimd = A.phonemizeWasm = A.phonemizeData = null; V.model = null;
      return ort.InferenceSession.create(model, { executionProviders: ['wasm'] });
    }).then(function (s) {
      session = s;
      return synth('Hello.', 1).catch(function () {}); // the first run is slower: do it now, before anyone is waiting
    }).then(function () { state = 'ready'; return true; }, function (e) { state = 'failed'; throw e; });
    return loading;
  }

  // text -> phoneme ids, using eSpeak NG (inside piper_phonemize). One copy of the phonemiser is kept and reused;
  // if it cannot be run twice it is rebuilt.
  var phonMod = null, phonOut = null;
  function phonModule() {
    if (phonMod) return phonMod;
    phonMod = G.createPiperPhonemize({
      wasmBinary: phonWasm, noExitRuntime: true,
      getPreloadedPackage: function () { return phonData.slice(0); },
      print: function (line) { if (phonOut) phonOut(line); },
      printErr: function () {},
      locateFile: function (u) { return u; }
    });
    return phonMod;
  }
  function phonemize(text) {
    return phonModule().then(function (m) {
      var ids = null;
      phonOut = function (line) { try { var r = JSON.parse(line); if (r.phoneme_ids) ids = r.phoneme_ids; } catch (e) { /* not the result line */ } };
      try { m.callMain(['-l', cfg.espeak.voice, '--input', JSON.stringify([{ text: text }]), '--espeak_data', '/espeak-ng-data']); } catch (e) { /* exit() throws after printing */ }
      phonOut = null;
      if (ids) return ids;
      phonMod = null; // could not be reused: build a fresh one once
      return phonModule().then(function (m2) {
        phonOut = function (line) { try { var r = JSON.parse(line); if (r.phoneme_ids) ids = r.phoneme_ids; } catch (e) { /* skip */ } };
        try { m2.callMain(['-l', cfg.espeak.voice, '--input', JSON.stringify([{ text: text }]), '--espeak_data', '/espeak-ng-data']); } catch (e) { /* see above */ }
        phonOut = null; phonMod = null;
        if (!ids) throw new Error('no phonemes');
        return ids;
      });
    });
  }
  var timing = {};
  function synth(text, rate) {
    var key = rate + '|' + text;
    if (cache.has(key)) return Promise.resolve(cache.get(key));
    var t0 = Date.now();
    return phonemize(text).then(function (ids) {
      timing.phonemize = Date.now() - t0; t0 = Date.now();
      var ort = G.ort, inf = cfg.inference;
      var feeds = {
        input: new ort.Tensor('int64', BigInt64Array.from(ids, function (x) { return BigInt(x); }), [1, ids.length]),
        input_lengths: new ort.Tensor('int64', BigInt64Array.from([BigInt(ids.length)]), [1]),
        scales: new ort.Tensor('float32', Float32Array.from([inf.noise_scale, inf.length_scale / (rate || 1), inf.noise_w]), [3])
      };
      if (cfg.num_speakers > 1) feeds.sid = new ort.Tensor('int64', BigInt64Array.from([0n]), [1]);
      return session.run(feeds);
    }).then(function (out) {
      var pcm = out.output.data;
      timing.model = Date.now() - t0; timing.audioMs = Math.round(1000 * pcm.length / cfg.audio.sample_rate); timing.chars = text.length;
      if (cache.size > 80) cache.delete(cache.keys().next().value);
      cache.set(key, pcm);
      return pcm;
    });
  }
  // short pieces start sooner: speak the first piece while the next one is being made.
  // Sentences are split at full stops, then long ones at ", " (never inside numbers such as 5,428).
  function pieces(text) {
    var sentences = String(text).replace(/\s+/g, ' ').trim().match(/[^.!?;:]+[.!?;:]*["”’)]*\s*/g) || [], out = [];
    sentences.forEach(function (sn) {
      sn = sn.trim(); if (!sn) return;
      var parts = sn.length > 45 ? sn.split(/(?<=,)\s+/) : [sn];
      // still long with no commas: break just before a joining word near the middle, where a speaker would pause
      parts = [].concat.apply([], parts.map(function (p) {
        if (p.length <= 60) return [p];
        var best = -1, re = / (?=(?:when|and|because|then|so|but|which|that|until|while|if) )/g, m;
        while ((m = re.exec(p))) if (m.index > 15 && p.length - m.index > 15 && (best < 0 || Math.abs(m.index - p.length / 2) < Math.abs(best - p.length / 2))) best = m.index;
        return best > 0 ? [p.slice(0, best), p.slice(best + 1)] : [p];
      }));
      parts.forEach(function (p) {
        if (out.length && (out[out.length - 1].length < 14 || p.length < 8)) out[out.length - 1] += ' ' + p; else out.push(p);
      });
    });
    return out;
  }
  // make the first piece ahead of time, so pressing play starts straight away
  function prepare(text, rate) { if (state !== 'ready') return; var list = pieces(text); if (list.length) synth(list[0], rate).catch(function () {}); }

  function stop() {
    if (!playing) return;
    var p = playing; playing = null; p.cancelled = true;
    if (p.source) { try { p.source.onended = null; p.source.stop(); } catch (e) { /* already stopped */ } }
  }
  /* speak(text, { rate, onstart, onend }). Calls onend once, whether finished, stopped or failed. */
  function speak(text, o) {
    stop();
    o = o || {};
    var job = { cancelled: false, source: null }, list = pieces(text), i = 0, ended = false;
    playing = job;
    ctx = ctx || new (G.AudioContext || G.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    function finish() { if (ended) return; ended = true; if (playing === job) playing = null; if (o.onend) o.onend(); }
    var next = list.length ? synth(list[0], o.rate) : null;
    function step() {
      if (job.cancelled) return finish();
      if (!next) return finish();
      next.then(function (pcm) {
        if (job.cancelled) return finish();
        i++;
        next = i < list.length ? synth(list[i], o.rate) : null;
        var buf = ctx.createBuffer(1, pcm.length, cfg.audio.sample_rate);
        buf.copyToChannel(pcm, 0);
        var src = ctx.createBufferSource(); src.buffer = buf; src.connect(ctx.destination);
        job.source = src; src.onended = step;
        if (i === 1 && o.onstart) o.onstart();
        src.start();
      }, finish);
    }
    step();
    return job;
  }

  OM.neural = {
    voices: [{ id: 'pip:cori', name: 'Cori', accent: 'British', offline: true, natural: true }],
    supported: supported,
    state: function () { return state; },
    load: load,
    speak: speak,
    prepare: prepare,
    stop: stop,
    // the sound for some text, without playing it: { pcm, rate } (used by tools/promo to record the narration)
    render: function (text, rate) { return synth(text, rate || 1).then(function (pcm) { return { pcm: pcm, rate: cfg.audio.sample_rate }; }); },
    timing: function () { return timing; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
