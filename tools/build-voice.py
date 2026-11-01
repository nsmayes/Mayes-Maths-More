"""Builds the offline natural voice for Learn with Pip.

Packs three free components into plain script files, so the app can load them even when play.html is opened by
double-clicking (browsers will not let a page opened that way fetch .wasm or .onnx files, but they do run <script> files):

  voice/engine.js  onnxruntime-web 1.18.0 (MIT) + piper_phonemize from @diffusionstudio/piper-wasm 1.0.0 (MIT; contains
                   eSpeak NG, GPL-3.0), with eSpeak's data trimmed to English only
  voice/cori.js    Piper voice en_GB-cori-medium (public domain: trained from scratch on public-domain LibriVox recordings)

Usage:  python tools/build-voice.py <folder containing the downloaded parts>
The folder must hold: o/package/dist/ort.wasm.min.js, o/package/dist/ort-wasm-simd.wasm (every current browser supports SIMD),
w/package/build/piper_phonemize.{js,wasm,data}, cori-medium.onnx, cori-medium.onnx.json
"""
import base64, hashlib, json, os, re, sys

src = sys.argv[1]
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
out = os.path.join(root, 'voice')
os.makedirs(out, exist_ok=True)

def b64(path):
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode('ascii')

# ---- check the voice is the published one (md5 from rhasspy/piper-voices voices.json) ----
EXPECT = {'cori-medium.onnx': 'f143307611eccea9d976235d0895f57c', 'cori-medium.onnx.json': '12b1dc45d8919f3475cf296d5f16a4c6'}
for name, md5 in EXPECT.items():
    with open(os.path.join(src, name), 'rb') as f:
        got = hashlib.md5(f.read()).hexdigest()
    assert got == md5, name + ' does not match the published file'

# ---- trim eSpeak NG data to English ----
pj = open(os.path.join(src, 'w/package/build/piper_phonemize.js'), encoding='utf8').read()
m = re.search(r'loadPackage\((\{"files":\[.*?\],"remote_package_size":\d+\})\)', pj)
meta = json.loads(m.group(1))
data = open(os.path.join(src, 'w/package/build/piper_phonemize.data'), 'rb').read()
keep, blob, pos = [], bytearray(), 0
for f in meta['files']:
    name = f['filename']
    if name.endswith('_dict') and not name.endswith('/en_dict'):
        continue
    chunk = data[f['start']:f['end']]
    keep.append({'filename': name, 'start': pos, 'end': pos + len(chunk)})
    blob += chunk; pos += len(chunk)
new_meta = {'files': keep, 'remote_package_size': len(blob)}
pj = pj[:m.start(1)] + json.dumps(new_meta, separators=(',', ':')) + pj[m.end(1):]
pj = pj.replace('var REMOTE_PACKAGE_SIZE=metadata["remote_package_size"]', 'var REMOTE_PACKAGE_SIZE=metadata["remote_package_size"]')
print('eSpeak data: %d files, %.1f MB -> %d files, %.2f MB' % (len(meta['files']), len(data) / 1e6, len(keep), len(blob) / 1e6))

ort = open(os.path.join(src, 'o/package/dist/ort.wasm.min.js'), encoding='utf8').read()
engine = ('/* Learn with Pip offline voice engine. Built by tools/build-voice.py - do not edit.\n'
          '   onnxruntime-web 1.18.0 (MIT, Microsoft). piper_phonemize (MIT, Michael Hansen) with eSpeak NG (GPL-3.0). See voice/LICENCES.txt. */\n'
          + ort + '\n;\n' + pj + '\n;\n'
          'window.createPiperPhonemize = createPiperPhonemize;\n'
          'window.PIPER_ASSETS = {\n'
          '  ortSimd: "' + b64(os.path.join(src, 'o/package/dist/ort-wasm-simd.wasm')) + '",\n'
          '  phonemizeWasm: "' + b64(os.path.join(src, 'w/package/build/piper_phonemize.wasm')) + '",\n'
          '  phonemizeData: "' + base64.b64encode(bytes(blob)).decode('ascii') + '"\n};\n'
          'if (window.PIPER_LOADED) window.PIPER_LOADED("engine");\n')
open(os.path.join(out, 'engine.js'), 'w', encoding='utf8', newline='\n').write(engine)

cfg = json.load(open(os.path.join(src, 'cori-medium.onnx.json'), encoding='utf8'))
voice = ('/* Piper voice en_GB-cori-medium by Bryce Beattie: public domain (trained from scratch on public-domain LibriVox recordings).\n'
         '   Source: https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_GB/cori/medium  Built by tools/build-voice.py - do not edit. */\n'
         'window.PIPER_VOICES = window.PIPER_VOICES || {};\n'
         'window.PIPER_VOICES.cori = { name: "Cori", accent: "British", config: ' + json.dumps(cfg, separators=(',', ':'), ensure_ascii=True) + ',\n'
         '  model: "' + b64(os.path.join(src, 'cori-medium.onnx')) + '" };\n'
         'if (window.PIPER_LOADED) window.PIPER_LOADED("cori");\n')
open(os.path.join(out, 'cori.js'), 'w', encoding='utf8', newline='\n').write(voice)
for n in ('engine.js', 'cori.js'):
    print(n, '%.1f MB' % (os.path.getsize(os.path.join(out, n)) / 1e6))
