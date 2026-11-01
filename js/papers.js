/* Learn with Pip — tests: practice papers in the KS2 SATs format, guard challenges, topic quizzes and the daily mix.
   There are no official Year 4 SATs papers; these follow the KS2 layout (an arithmetic paper and a reasoning paper)
   using only Year 4 content, and are marked with the KS2 mark-scheme conventions. */
(function (G) {
  'use strict';
  var OM = G.OM;
  function make(list, seed) {
    var r = OM.makeRng(seed);
    var seen = {};
    // a question that would repeat one already in the paper is left out
    return list.map(function (it) { return OM.generateFresh(it[0], it[1], r, seen); }).filter(Boolean);
  }
  // GCSE (9–1) Mathematics paper formats by exam board, checked against the boards' published specifications (October 2026).
  // Every board teaches the same DfE subject content; boards differ in paper layout. A formulae sheet is provided in the exam.
  OM.EXAM_BOARDS = [
    { id: 'aqa', name: 'AQA', spec: '8300', papers: [{ name: 'Paper 1', calc: false }, { name: 'Paper 2', calc: true }, { name: 'Paper 3', calc: true }], minutes: 90, marks: 80 },
    { id: 'edexcel', name: 'Edexcel (Pearson)', spec: '1MA1', papers: [{ name: 'Paper 1', calc: false }, { name: 'Paper 2', calc: true }, { name: 'Paper 3', calc: true }], minutes: 90, marks: 80 },
    { id: 'ocr', name: 'OCR', spec: 'J560', papers: [{ name: 'Paper 1', calc: true }, { name: 'Paper 2', calc: false }, { name: 'Paper 3', calc: true }], minutes: 90, marks: 100, higherNumbers: [4, 5, 6] },
    { id: 'eduqas', name: 'Eduqas', spec: 'C300', papers: [{ name: 'Component 1', calc: false }, { name: 'Component 2', calc: true }], minutes: 135, marks: 120 }
  ];
  OM.GCSE_TIERS = [{ id: 'foundation', name: 'Foundation', grades: '1–5' }, { id: 'higher', name: 'Higher', grades: '4–9' }];
  OM.boardById = function (id) { return OM.EXAM_BOARDS.filter(function (b) { return b.id === id; })[0] || null; };
  OM.papers = {
    arithmetic: {
      title: 'Arithmetic paper', minutes: 30, totalMarks: 25,
      desc: '25 calculations, 1 mark each. Like KS2 Paper 1, but with Year 4 content.',
      build: function (seed) {
        return make([['thousandMoreLess', 1], ['timesTables', 1], ['timesTables', 1], ['mentalMD', 1], ['columnAdd', 1], ['columnSub', 1], ['timesTables', 2], ['timesTables', 2],
          ['fracAddSub', 1], ['mentalMD', 2], ['shortMult', 1], ['divide10100', 1], ['columnAdd', 2], ['fractionOfAmount', 1], ['fracAddSub', 1], ['mentalMD', 2],
          ['columnSub', 2], ['timesTables', 3], ['shortMult', 2], ['divide10100', 2], ['fractionOfAmount', 2], ['mentalMD', 3], ['fracAddSub', 2], ['columnSub', 3], ['shortMult', 2]], seed);
      }
    },
    reasoning: {
      title: 'Reasoning paper', minutes: 35, totalMarks: 28,
      desc: 'Problems and reasoning across every Year 4 topic, including 2-mark questions where working earns a method mark. Like KS2 Papers 2 and 3.',
      build: function (seed) {
        return make([['representNumbers', 2], ['rounding', 2], ['roman', 2], ['compareOrder', 3], ['readCoordinates', 2], ['classifyShapes', 2], ['equivFractions', 2], ['convertUnits', 2],
          ['estimateInverse', 2], ['readGraphs', 2], ['angles', 2], ['decimalTenthsHundredths', 2], ['clocks', 2], ['asTwoStep', 2], ['area', 2], ['factorPairs', 2],
          ['compareDecimals', 2], ['symmetryLines', 2], ['timeConvert', 2], ['perimeter', 3], ['mdProblems', 2], ['translations', 3], ['decimalProblems', 2], ['completeSymmetry', 2],
          ['graphProblems', 3], ['moneyMeasures', 3]], seed);
      }
    }
  };

  // papers for a school year: Year 4's are above; other years list theirs in their curriculum file as
  // papers: { key: { title, minutes, totalMarks, desc, list: [[generatorId, level], ...] } }
  var built = {};
  OM.papersFor = function (year, profile) {
    if ((year || 4) === 4) return OM.papers;
    if (OM.CURRICULUM['Y' + year] && OM.CURRICULUM['Y' + year].gcse) return OM.gcsePapers(year, (profile && profile.board) || 'aqa', (profile && profile.tier) || 'foundation');
    if (built[year]) return built[year];
    var c = OM.CURRICULUM['Y' + year], out = {};
    Object.keys((c && c.papers) || {}).forEach(function (k) {
      var spec = c.papers[k];
      // total marks come from the questions themselves (working questions are worth 2 or 3 marks)
      var total = make(spec.list, 1).reduce(function (a, q) { return a + q.marks; }, 0);
      out[k] = { title: spec.title, calc: k === 'calc', minutes: spec.minutes, totalMarks: total, desc: spec.desc.replace(/\d+ marks?/, total + ' marks'), build: function (seed) { return make(spec.list, seed); } };
    });
    return (built[year] = out);
  };
  // GCSE practice papers (Years 10 and 11) in the layout of the chosen exam board, at half length so they fit a study session:
  // the same number of papers, the same calculator rules and half the marks and time. Year 10 papers use Year 10 topics;
  // Year 11 papers are full mocks across both years. Foundation papers lean on the Grade 1–3 and 4–5 bands; Higher on 4–5 and 6–7.
  // AQA papers open with multiple-choice questions, as the real ones do.
  var gcseBuilt = {};
  OM.gcsePapers = function (year, boardId, tier) {
    var key = year + '|' + boardId + '|' + tier;
    if (gcseBuilt[key]) return gcseBuilt[key];
    var board = OM.boardById(boardId) || OM.boardById('aqa'), out = {}, total = board.marks / 2, minutes = board.minutes / 2;
    var objs = Object.keys(OM.objectiveIndex).filter(function (id) { var o = OM.objectiveIndex[id]; return (o.year === year || (year === 11 && o.year === 10)) && (o.tier !== 'H' || tier === 'higher'); }).sort();
    var levels = tier === 'higher' ? [2, 2, 3] : [1, 1, 2], tName = tier === 'higher' ? 'Higher' : 'Foundation';
    board.papers.forEach(function (pp, pi) {
      var n = board.higherNumbers && tier === 'higher' ? board.higherNumbers[pi] : pi + 1;
      var name = board.id === 'ocr' ? 'Paper ' + n : pp.name;
      out['gcse' + (pi + 1)] = { calc: pp.calc, title: board.name + '-style ' + name + ' (' + tName + ', ' + (pp.calc ? 'calculator' : 'non-calculator') + ')', minutes: minutes, totalMarks: total,
        desc: 'Half-length practice in the ' + board.name + ' layout: ' + total + ' marks in ' + (minutes === 45 ? '45 minutes' : minutes + ' minutes') + (pp.calc ? '. Calculator allowed.' : '. No calculator.') + (board.id === 'aqa' ? ' Starts with multiple-choice questions.' : '') + ' In the real exam, longer questions also give method marks.',
        build: function (seed) {
          var r = OM.makeRng(seed * 7 + pi + 1), seen = {}, qs = [], marks = 0, tries = 0, pool = r.shuffle(objs.slice()), k = 0;
          function pickQ(level, wantChoice) {
            for (var t = 0; t < 60; t++) {
              var o = OM.objectiveIndex[pool[k++ % pool.length]], q = OM.generateFresh(r.pick(o.gens), level, r, seen);
              if (!q) continue;
              if (!pp.calc && q.calc) continue; // no calculator questions on a non-calculator paper
              if (wantChoice && q.check.kind !== 'choice') continue;
              return q;
            }
            return null;
          }
          if (board.id === 'aqa') for (var m = 0; m < 4; m++) { var mc = pickQ(levels[0], true); if (mc) { qs.push(mc); marks += mc.marks; } }
          while (marks < total && tries++ < 400) {
            var q = pickQ(levels[qs.length % 3]); if (!q) continue;
            if (marks + q.marks > total) continue;
            qs.push(q); marks += q.marks;
          }
          // easier questions first, as on a real paper (multiple choice stays at the start)
          var head = board.id === 'aqa' ? qs.slice(0, 4) : [], rest = board.id === 'aqa' ? qs.slice(4) : qs;
          return head.concat(rest.sort(function (a, b) { return a.level - b.level; }));
        } };
    });
    return (gcseBuilt[key] = out);
  };
  // Higher-tier-only GCSE topics are shown only to children whose tier is set to Higher
  OM.objVisible = function (o, profile) { return (o.tier !== 'H' || !!(profile && profile.tier === 'higher')) && (o.from === undefined || ((profile && profile.year) || 4) >= o.from); };
  OM.regionObjectives = function (regionId, year, profile) {
    var c = OM.CURRICULUM['Y' + (year || 4)] || OM.CURRICULUM.Y4;
    var reg = c.regions.filter(function (r) { return r.id === regionId; })[0];
    return reg ? reg.objectives.filter(function (o) { return OM.objVisible(o, profile); }) : [];
  };
  // Guard challenge: 8 questions across a region, mostly "expected" level with some "greater depth"
  OM.buildGuardTest = function (regionId, seed, year, profile) {
    var r = OM.makeRng(seed), objs = OM.regionObjectives(regionId, year, profile), qs = [], seen = {}, i = 0;
    var order = r.shuffle(objs);
    // 8 questions, every one different: a topic that has run out is skipped
    while (qs.length < 8 && i < order.length * 8 + 40) { var o = order[i++ % order.length], q = OM.freshFromObjective(o, qs.length < 5 ? 2 : 3, r, seen); if (q) qs.push(q); }
    return qs;
  };
  OM.buildQuiz = function (objId, seed) {
    var o = OM.objectiveIndex[objId], r = OM.makeRng(seed), seen = {};
    return [1, 2, 2, 2, 3].map(function (L) { return OM.freshFromObjective(o, L, r, seen); }).filter(Boolean);
  };
  // Daily mix: favour topics with fewer stars and topics not practised for a while (spaced practice)
  OM.pickMixObjective = function (profile, r) {
    var y = profile.year || 4, all = Object.keys(OM.objectiveIndex).filter(function (id) { return OM.objectiveIndex[id].year === y && OM.objVisible(OM.objectiveIndex[id], profile); }), now = Date.now();
    var weights = all.map(function (id) {
      var p = profile.progress[id], stars = OM.Store.stars(profile, id);
      if (!p) return 1;
      var days = (now - p.last) / 86400000;
      return (4 - stars) * 2 + Math.min(days, 14) / 2 + 1;
    });
    return r.weighted(all, weights);
  };
})(typeof window !== 'undefined' ? window : globalThis);
