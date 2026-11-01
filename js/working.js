/* Mayes Maths & More — working and method marks for multi-step questions (Years 7–11).
   Each entry turns a generator's question into a "show your working" question with GCSE-style marks: M marks for correct
   steps seen in the working (in any equivalent form), A marks for the correct answer. A question keeps its own answer check;
   the checker also confirms that the model working earns every M mark and contains no slips.
   GCSE generators that re-use these Key Stage 3 generators get the working automatically. */
(function (G) {
  'use strict';
  var OM = G.OM, K = OM.kit, A = OM.alg;
  function Q(n, d) { return A.Q(n, d); }
  function d(q) { return A.decText(q) || A.qText(q).replace('−', '-'); }
  function lin(a, b, v) { v = v || 'x'; var s = ''; if (a) s = (a === 1 ? '' : a === -1 ? '-' : a) + v; if (b) s += s ? (b < 0 ? ' - ' + (-b) : ' + ' + b) : String(b); return s || '0'; }
  function M(text, any) { return { code: 'M1', text: text, any: any }; }
  function A1(text) { return { code: 'A1', text: text || 'for the correct answer' }; }
  function r2(x) { return String(Math.round(x * 1e4) / 1e4); }
  // a linear equation's first step (ax + b = cx + d  ->  (a − c)x = d − b) and its solution
  function linStep(eq, v) {
    v = v || 'x'; var s = eq.split(' = '), P = function (t) { return A.poly(A.parse(t)); }, L = P(s[0]), R = P(s[1]);
    var a = A.sub(L[v + '^1'] || Q(0), R[v + '^1'] || Q(0)), b = A.sub(R[''] || Q(0), L[''] || Q(0));
    return { step: (A.eq(a, Q(1)) ? '' : d(a)) + v + ' = ' + d(b), ans: d(A.div(b, a)) };
  }
  var WORK = {
    // ----- Year 7 -----
    y7Solve: function (q, L) { if (L < 2) return null; var st = linStep(q.params.eq); return { marks: [M('for a correct first step, e.g. ' + st.step, [{ solve: 'x', value: st.ans, notLike: q.params.eq }]), A1('x = ' + st.ans)], o: { start: q.params.eq, lines: [st.step, 'x = ' + st.ans], example: st.step } }; },
    y7Percent: function (q, L) { if (L < 3) return null; var p = q.params, ch = Math.abs(p.pc - 100), v = A.mul(Q(p.amt), Q(ch, 100)); return { marks: [M('for finding ' + ch + '% of ' + p.amt + ' (' + d(v) + '), or using the multiplier ' + d(Q(p.pc, 100)), [{ value: d(v) }, { value: d(Q(p.pc, 100)) }]), A1()], o: { lines: [ch + '% of ' + p.amt + ' = ' + d(v), q.check.value], example: '10% of ' + p.amt + ' = ' + d(Q(p.amt, 10)) } }; },
    y7Area: function (q) { var p = q.params; if (p.kind === 'para') return { marks: [M('for base × perpendicular height, ' + p.b + ' × ' + p.h, [{ re: p.b + '[×x*]' + p.h + '|' + p.h + '[×x*]' + p.b }]), A1()], o: { lines: [p.b + ' × ' + p.h + ' = ' + p.b * p.h] } };
      if (p.kind === 'trap') return { marks: [M('for (' + p.a + ' + ' + p.b + ') ÷ 2 or (' + p.a + ' + ' + p.b + ') × ' + p.h, [{ value: d(Q(p.a + p.b, 2)) }, { value: String((p.a + p.b) * p.h) }]), A1()], o: { lines: ['(' + p.a + ' + ' + p.b + ') ÷ 2 = ' + d(Q(p.a + p.b, 2)), d(Q(p.a + p.b, 2)) + ' × ' + p.h + ' = ' + q.check.value] } };
      if (p.kind === 'trapH') return { marks: [M('for ½(' + p.a + ' + ' + p.b + ') × h = ' + p.area + ' oe', [{ value: d(Q(p.a + p.b, 2)) }, { solveAny: true, value: String(q.check.value) }]), A1()], o: { lines: ['½ × (' + p.a + ' + ' + p.b + ') = ' + d(Q(p.a + p.b, 2)), d(Q(p.a + p.b, 2)) + 'h = ' + p.area, 'h = ' + q.check.value] } }; return null; },
    y7RatioShare: function (q, L) { var p = q.params; if (L === 1) { var one = p.tot / (p.a + p.b); return { marks: [M('for one part = £' + one + ' (£' + p.tot + ' ÷ ' + (p.a + p.b) + ')', [{ value: String(one) }]), A1()], o: { lines: [p.tot + ' ÷ ' + (p.a + p.b) + ' = ' + one, one + ' × ' + p.b + ' = ' + q.check.value] } }; }
      if (L === 3) { var part = p.diff / Math.abs(p.b - p.a); return { marks: [M('for one part = £' + part, [{ value: String(part) }]), A1()], o: { lines: [p.diff + ' ÷ ' + Math.abs(p.b - p.a) + ' = ' + part, part + ' × ' + (p.a + p.b) + ' = ' + q.check.value] } }; } return null; },
    y7Averages: function (q, L) { if (L !== 2) return null; var t = q.params.xs.reduce(function (a, b) { return a + b; }, 0); return { marks: [M('for the total, ' + t, [{ value: String(t) }]), A1()], o: { lines: [q.params.xs.join(' + ') + ' = ' + t, t + ' ÷ ' + q.params.xs.length + ' = ' + r2(t / q.params.xs.length)] } }; },
    y7Fractions: function (q, L) { if (L !== 3) return null; var p = q.params; return { marks: [M('for writing the mixed numbers as improper fractions, ' + p.x + ' and ' + p.y, [{ value: p.x }, { value: p.y }]), A1()], o: { lines: [p.x + ' ' + (p.op === '*' ? '×' : '+') + ' ' + p.y], example: 'change to improper fractions first' } }; },
    // ----- Year 8 -----
    y8Equations: function (q) { var st = linStep(q.params.eq); return { marks: [M('for a correct first step towards solving, e.g. ' + st.step, [{ solve: 'x', value: st.ans, notLike: q.params.eq }]), A1('x = ' + st.ans)], o: { start: q.params.eq, lines: [st.step, 'x = ' + st.ans], example: st.step } }; },
    y8PercentChange: function (q, L) { var p = q.params;
      if (L === 1) { var ch = Math.abs(p.nw - p.old), fr = d(A.div(A.parseQ(String(ch)), Q(p.old))); return { marks: [M('for the change, £' + ch + ', divided by the original, £' + p.old, [{ value: fr }, { value: String(ch) }]), A1()], o: { lines: [p.nw + ' − ' + p.old + ' = ' + Math.round((p.nw - p.old) * 100) / 100, ch + ' ÷ ' + p.old + ' = ' + fr, fr + ' × 100 = ' + q.check.value] } }; }
      if (L === 2) { var y1 = p.P * p.rate / 100; return { marks: [M('for one year’s interest, £' + y1, [{ value: String(y1) }]), A1()], o: { lines: [p.rate + '% of ' + p.P + ' = ' + y1, y1 + ' × ' + p.yrs + ' = ' + q.check.value] } }; }
      var one = A.div(Q(p.now), Q(p.pct)); return { marks: [M('for 1% = £' + d(one) + ' (£' + p.now + ' ÷ ' + p.pct + ')', [{ value: d(one) }]), A1()], o: { lines: [p.now + ' ÷ ' + p.pct + ' = ' + d(one), d(one) + ' × 100 = ' + q.check.value] } }; },
    y8Compound: function (q, L) { var p = q.params; if (p.k === 'mass') return { marks: [M('for density × volume, ' + p.dens + ' × ' + p.vol, [{ re: p.dens + '[×x*]' + p.vol + '|' + p.vol + '[×x*]' + p.dens }]), A1()], o: { lines: [p.dens + ' × ' + p.vol + ' = ' + p.dens * p.vol] } }; if (p.k !== 'time') return null; var h = A.div(A.parseQ(p.d), Q(p.s)); return { marks: [M('for the time in hours, ' + d(h), [{ value: d(h) }]), A1()], o: { lines: [p.d + ' ÷ ' + p.s + ' = ' + d(h), d(h) + ' × 60 = ' + q.check.value] } }; },
    y8Circles: function (q, L) { var p = q.params; if (L > 2 || (p.what !== 'C' && p.what !== 'A')) return null; var C = p.what === 'C', ex = C ? 2 * Math.PI * p.r : Math.PI * p.r * p.r;
      return { marks: [M(C ? 'for π × ' + 2 * p.r : 'for π × ' + p.r + '²', [{ expr: (C ? 2 * p.r : p.r * p.r) + 'π' }, { value: r2(ex), tol: 0.06 }]), A1('for ' + A.round(ex.toFixed(12), { dp: 1 }))], o: { lines: [(C ? 2 * p.r : p.r * p.r) + 'π = ' + ex.toFixed(4), A.round(ex.toFixed(12), { dp: 1 })] } }; },
    y8Volume: function (q, L) { var p = q.params; if (p.k !== 'cyl') return null; var base = Math.PI * p.r * p.r; return { marks: [M('for the area of the circle, π × ' + p.r + '²', [{ expr: p.r * p.r + 'π' }, { value: r2(base), tol: 0.06 }]), A1()], o: { lines: [p.r * p.r + 'π = ' + base.toFixed(4), base.toFixed(4) + ' × ' + p.h + ' = ' + (base * p.h).toFixed(4)] } }; },
    y8Scale: function (q, L) { var p = q.params; if (p.k !== 'model') return null; return { marks: [M('for ' + p.cm + ' × ' + p.s + ' = ' + p.cm * p.s + ' cm', [{ value: String(p.cm * p.s) }]), A1()], o: { lines: [p.cm + ' × ' + p.s + ' = ' + p.cm * p.s, p.cm * p.s + ' ÷ 100 = ' + q.check.value] } }; },
    y8Direct: function (q, L) { var p = q.params; if (p.k === 'recipe') { var one = A.div(Q(p.amt), Q(p.n1)); return { marks: [M('for the amount for 1 person, ' + d(one) + ' g', [{ value: d(one) }]), A1()], o: { lines: [p.amt + ' ÷ ' + p.n1 + ' = ' + d(one), d(one) + ' × ' + p.n2 + ' = ' + q.check.value] } }; }
      if (p.k === 'kx') { var k = A.div(A.parseQ(p.y1), Q(p.x1)); return { marks: [M('for k = ' + d(k), [{ value: d(k) }]), A1()], o: { lines: ['k = ' + p.y1 + ' ÷ ' + p.x1 + ' = ' + d(k), 'y = ' + d(k) + ' × ' + p.x2 + ' = ' + q.check.value] } }; } return null; },
    // ----- Year 9 -----
    y9Pythagoras: function (q, L) { var p = q.params;
      if (p.find === 'hyp') { var s = p.a * p.a + p.b * p.b; return { marks: [M('for ' + p.a + '² + ' + p.b + '² = ' + s, [{ value: String(s) }]), A1()], o: { lines: [p.a + '² + ' + p.b + '² = ' + s, '√' + s + ' = ' + q.check.value] } }; }
      var sq = p.find === 'leg' ? p.h * p.h - p.a * p.a : p.dx * p.dx + p.dy * p.dy, rt = Math.sqrt(sq);
      return { marks: [M(p.find === 'leg' ? 'for ' + p.h + '² − ' + p.a + '² = ' + sq : 'for ' + p.dx + '² + ' + p.dy + '² = ' + sq, [{ value: String(sq) }]), M('for square-rooting: √' + sq, [{ value: r2(rt), tol: 0.06 }, { re: '√' + sq }]), A1()], o: { lines: [(p.find === 'leg' ? p.h + '² − ' + p.a + '²' : p.dx + '² + ' + p.dy + '²') + ' = ' + sq, '√' + sq + ' = ' + rt.toFixed(4), A.round(rt.toFixed(12), { dp: 1 })] } }; },
    y9Trig: function (q) { var p = q.params, f, re;
      if (p.which === 'angle') { re = 'tan.*' + p.o + '.*' + p.a; return { marks: [M('for tan θ = ' + p.o + '/' + p.a, [{ re: re }]), A1()], o: { lines: ['tan θ = ' + p.o + '/' + p.a, 'θ = tan⁻¹(' + p.o + ' ÷ ' + p.a + ')'] } }; }
      f = p.which === 'adj' ? 'cos' : 'sin';
      return { marks: [M('for a correct trig statement, e.g. ' + (p.which === 'hypFromOpp' ? 'x = ' + p.H + ' ÷ sin ' + p.ang : 'x = ' + p.H + ' × ' + f + ' ' + p.ang), [{ re: f + '\\(?' + p.ang + '(?!\\d)' }]), A1()], o: { lines: [p.which === 'hypFromOpp' ? 'x = ' + p.H + ' ÷ sin(' + p.ang + ')' : 'x = ' + p.H + ' × ' + f + '(' + p.ang + ')'] } }; },
    y9CompoundInterest: function (q, L) { if (L < 2) return null; var p = q.params, m = String(Math.round(p.m * 10000) / 10000), esc = m.replace('.', '\\.'), after1 = p.P * p.m;
      return { marks: [M('for using the multiplier ' + m + ' (e.g. ' + p.P + ' × ' + m + '^' + p.y + ')', [{ re: esc }, { value: r2(after1), tol: 0.01 }]), A1()], o: { lines: [p.P + ' × ' + m + '^' + p.y] } }; },
    y9InverseProportion: function (q, L) { var p = q.params; if (p.inv) { var k = p.x1 * p.y1; return { marks: [M('for k = ' + k + ' (y = k/x)', [{ value: String(k) }]), A1()], o: { lines: ['k = ' + p.x1 + ' × ' + p.y1 + ' = ' + k, 'y = ' + k + ' ÷ ' + p.x2 + ' = ' + q.check.value] } }; }
      if (p.ya) { var k2 = p.ya / (p.a * p.a); return { marks: [M('for k = ' + k2 + ' (y = kx²)', [{ value: String(k2) }]), A1()], o: { lines: ['k = ' + p.ya + ' ÷ ' + p.a + '² = ' + k2, 'y = ' + k2 + ' × ' + p.b + '² = ' + q.check.value] } }; } return null; },
    y9AlgGeo: function (q, L) { var p = q.params, eq;
      if (p.k) eq = (p.k[0] + p.k[1] + p.k[2]) + 'x = 180'; else if (p.a) eq = (p.a + p.b) + 'x + ' + (p.c1 + p.c2) + ' = 180'; else eq = (2 * p.p1 + 2) + 'x + ' + 2 * (p.q1 + p.q2) + ' = ' + p.per;
      return { marks: [M('for forming a correct equation, e.g. ' + eq, [{ eq: eq }]), A1()], o: { lines: [eq, 'x = ' + q.check.value] } }; },
    y9Combined: function (q, L) { var p = q.params; if (L !== 3 || p.rep !== false) return null; var second = d(Q(p.red - 1, p.t - 1)), first = d(Q(p.red, p.t)); return { marks: [M('for ' + (p.red - 1) + '/' + (p.t - 1) + ' as the second probability', [{ value: second }]), A1()], o: { lines: [p.red + '/' + p.t + ' × ' + (p.red - 1) + '/' + (p.t - 1)] } }; },
    // ----- GCSE -----
    g10SolveQuad: function (q, L) { if (L < 2) return null; var e = q.params.e, a = q.check.parts[0].value, b = q.check.parts[1].value, f = a === 0 ? 'x(' + lin(1, -b) + ')' : b === 0 ? 'x(' + lin(1, -a) + ')' : '(' + lin(1, -a) + ')(' + lin(1, -b) + ')';
      return { marks: [M('for factorising: ' + f.replace(/-/g, '−') + ' = 0', [{ factorised: e }]), A1('for both solutions')], o: { lines: [f + ' = 0', 'x = ' + a + ' or x = ' + b] } }; },
    g10Simultaneous: function (q) { var x = q.check.parts[0].value, y = q.check.parts[1].value;
      return { marks: [M('for eliminating one letter correctly (an equation in x alone)', [{ solve: 'x', value: String(x) }]), M('for substituting to find the other value', [{ solve: 'y', value: String(y) }]), A1('for x = ' + x + ' and y = ' + y)], o: { lines: [(x === 0 ? '3x = 0' : '2x = ' + 2 * x), x + ' + y = ' + (x + y)], lineCount: 4 } }; },
    g10Inequalities: function (q, L) { if (L !== 2) return null; var m = /<b>(.*?)<\/b>/.exec(q.prompt), orig = m ? m[1].replace(/−/g, '-') : '', bnd = q.check.lo !== null && q.check.lo !== undefined ? q.check.lo : q.check.hi;
      return { marks: [M('for a correct first step', [{ solve: 'x', value: String(bnd), notLike: orig }]), A1()], o: { lines: [OM.answerTextFor(q.check)] } }; },
    g10FormSolve: function (q, L) { var p = q.params, v = q.check.value, lines;
      if (L === 1) lines = [p.m + 'n + ' + p.a + ' = ' + p.t, p.m + 'n = ' + (p.t - p.a), 'n = ' + v];
      else if (L === 2) lines = ['x + x + ' + p.d + ' = ' + p.t, '2x = ' + (p.t - p.d), 'x = ' + v];
      else { var e = p.e, k = e[3] * e[1] - e[0] * e[4], rhs = e[3] * e[2] - e[0] * e[5]; lines = [e[0] + 'a + ' + e[1] + 'c = ' + e[2], e[3] + 'a + ' + e[4] + 'c = ' + e[5], k + 'c = ' + rhs, 'c = ' + v]; }
      return { marks: [M(L === 3 ? 'for eliminating one unknown correctly' : 'for forming a correct equation', [{ solveAny: true, value: String(v) }]), A1()], o: { lines: lines, lineCount: L === 3 ? 5 : 3 } }; },
    g11Sectors: function (q) { var p = q.params, fr = d(Q(p.ang, 360)), ex = p.what === 'area' ? p.ang / 360 * Math.PI * p.r * p.r : p.ang / 360 * 2 * Math.PI * p.r + (p.what === 'perimeter' ? 2 * p.r : 0);
      return { marks: [M('for ' + p.ang + '/360 × ' + (p.what === 'area' ? 'π × ' + p.r + '²' : '2 × π × ' + p.r), [{ value: fr }, { value: r2(p.ang / 360 * (p.what === 'area' ? Math.PI * p.r * p.r : 2 * Math.PI * p.r)), tol: 0.06 }]), A1()], o: { lines: [p.ang + '/360 = ' + fr, r2(ex)] } }; },
    g11CirclesSolids: function (q, L) { if (L !== 3) return null; var p = q.params;
      if (p.kind === 'pyramid') return { marks: [M('for the base area, ' + p.s * p.s, [{ value: String(p.s * p.s) }]), A1()], o: { lines: [p.s + ' × ' + p.s + ' = ' + p.s * p.s, p.s * p.s + ' × ' + p.h + ' ÷ 3 = ' + q.check.value] } };
      var ex = p.kind === 'sphere' ? 4 / 3 * Math.PI * Math.pow(p.r, 3) : Math.PI * p.r * p.r * p.h / 3;
      return { marks: [M('for substituting into the formula correctly', [{ value: r2(ex), tol: 0.06 }, { expr: p.kind === 'sphere' ? '4*π*' + Math.pow(p.r, 3) + '/3' : 'π*' + p.r * p.r * p.h + '/3' }]), A1()], o: { lines: [ex.toFixed(4)] } }; },
    g11Similar: function (q) { var p = q.params, sf = A.div(A.parseQ(String(p.big)), A.parseQ(String(p.a))); return { marks: [M('for the scale factor, ' + d(sf), [{ value: d(sf) }, { value: d(A.div(Q(1), sf)) }]), A1()], o: { lines: ['scale factor = ' + p.big + ' ÷ ' + p.a + ' = ' + d(sf)] } }; },
    g11RateGraphs: function (q, L) { if (L !== 3) return null; var p = q.params.pts; return { marks: [M('for the change in cost, ' + (p[3] - p[1]), [{ value: String(p[3] - p[1]) }]), A1()], o: { lines: [p[3] + ' − ' + p[1] + ' = ' + (p[3] - p[1]), (p[3] - p[1]) + ' ÷ ' + p[2] + ' = ' + q.check.value] } }; }
  };
  OM.WORKING = WORK;
  // does the model working earn every method mark, with no slips?
  OM.workingSelfCheck = function (q) {
    var c = q.check; if (c.kind !== 'steps') return true;
    var lines = c.exampleLines || [];
    var hits = c.marks.filter(function (m) { return m.code.charAt(0) !== 'A'; }).every(function (m) { return lines.some(function (l) { return (m.any || []).some(function (ev) { return A.evidenceIn(ev, l, c); }); }); });
    return hits && !A.firstSlip(c, lines);
  };
  Object.keys(WORK).forEach(function (id) {
    var g = OM.gens[id]; if (!g) return;
    var make = g.make, verify = g.verify;
    g.make = function (r, L) { var q = make(r, L), spec = WORK[id](q, L); if (spec) K.withSteps(q, spec.marks, spec.o || {}); return q; };
    g.verify = function (q) { if (q.check.kind !== 'steps') return verify(q); var c = q.check; q.check = c.final; var ok = verify(q); q.check = c; return ok; };
  });
})(typeof window !== 'undefined' ? window : globalThis);
