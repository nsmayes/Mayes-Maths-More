/* Learn with Pip — Year 4 generators: statistics. */
(function (G) {
  'use strict';
  var OM = G.OM, V = OM.V, fmt = OM.fmt;
  function S(text, html) { return { text: text, html: html || '' }; }
  var CONTEXTS = [
    { title: 'Favourite fruit', cats: ['Apple', 'Banana', 'Grapes', 'Pear', 'Plum'], y: 'Number of children', who: 'children chose' },
    { title: 'Birds seen in the forest', cats: ['Robin', 'Owl', 'Crow', 'Wren', 'Jay'], y: 'Number of birds', who: 'birds were' },
    { title: 'Books read by the class', cats: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], y: 'Number of books', who: 'books were read on' },
    { title: 'Trees in the wood', cats: ['Oak', 'Ash', 'Birch', 'Pine', 'Beech'], y: 'Number of trees', who: 'trees are' }
  ];
  function phrase(ctx, cat) {
    if (ctx.who === 'children chose') return 'How many children chose ' + cat.toLowerCase() + '?';
    if (ctx.who === 'birds were') return 'How many ' + cat.toLowerCase() + 's were seen?';
    if (ctx.who === 'books were read on') return 'How many books were read on ' + cat + '?';
    return 'How many ' + cat.toLowerCase() + ' trees are there?';
  }

  OM.registerGen({
    id: 'readGraphs', objective: 'Y4-S-01', title: 'Reading bar charts and time graphs',
    make: function (r, L) {
      if (L < 3) {
        var ctx = r.pick(CONTEXTS), n = r.int(4, 5), cats = ctx.cats.slice(0, n), step = r.pick([2, 5, 10]), max = step * 8;
        var vals = cats.map(function () { return L === 1 ? step * r.int(1, 8) : (step === 5 ? 5 * r.int(1, 8) : step * r.int(0, 7) + step / 2); });
        if (L === 2 && step === 5) { step = 10; max = 80; vals = cats.map(function () { return 10 * r.int(0, 7) + 5; }); }
        var i = r.int(0, n - 1), v = vals[i];
        return { prompt: phrase(ctx, cats[i]), visual: V.barChart({ cats: cats, values: vals, step: step, max: max, ylabel: ctx.y, title: ctx.title }), input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: v },
          hint: 'Each gridline is worth ' + step + '. Go across from the top of the bar to the scale.', params: { vals: vals, i: i, step: step },
          solution: [S('The scale goes up in ' + step + 's.'), S(v % step === 0 ? 'The ' + cats[i] + ' bar reaches the ' + v + ' line.' : 'The ' + cats[i] + ' bar stops halfway between ' + (v - step / 2) + ' and ' + (v + step / 2) + ', so it shows ' + v + '.')] };
      }
      var times = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm'], temps = [], t = r.int(4, 10);
      for (var k = 0; k < 7; k++) { temps.push(t); t = Math.max(1, Math.min(20, t + r.pick([-1, 1, 2, 3, 0, 2]))); }
      var g = V.lineGraph({ xlabels: times, values: temps, step: 2, max: 22, ylabel: 'Temperature (°C)', xlabel: 'Time', title: 'Temperature in the forest' });
      var kind = r.int(0, 2);
      if (kind === 0) {
        var j = r.int(0, 6);
        return { prompt: 'The time graph shows the temperature during one day. What was the temperature at <b>' + times[j] + '</b>?', visual: g, input: { type: 'number', keys: 'digits', suffix: '°C' }, check: { kind: 'int', value: temps[j] }, answerText: temps[j] + '°C',
          hint: 'Find ' + times[j] + ' on the bottom axis, go up to the line, then across.', params: { temps: temps, j: j }, solution: [S('Go up from ' + times[j] + ' to the line, then across to the temperature scale (it goes up in 2s).'), S('The temperature was ' + temps[j] + '°C.')] };
      }
      if (kind === 1) {
        var a = r.int(0, 3), b = r.int(a + 2, 6);
        if (temps[b] === temps[a]) temps[b] += 1;
        var g2 = V.lineGraph({ xlabels: times, values: temps, step: 2, max: 22, ylabel: 'Temperature (°C)', xlabel: 'Time', title: 'Temperature in the forest' });
        var diff = temps[b] - temps[a];
        return { prompt: 'By how many degrees did the temperature ' + (diff > 0 ? 'rise' : 'fall') + ' between ' + times[a] + ' and ' + times[b] + '?', visual: g2, input: { type: 'number', keys: 'digits', suffix: '°C' }, check: { kind: 'int', value: Math.abs(diff) }, answerText: Math.abs(diff) + '°C',
          hint: 'Read both temperatures, then find the difference.', params: { temps: temps, a: a, b: b }, solution: [S('At ' + times[a] + ' it was ' + temps[a] + '°C. At ' + times[b] + ' it was ' + temps[b] + '°C.'), S('Difference: ' + Math.max(temps[a], temps[b]) + ' − ' + Math.min(temps[a], temps[b]) + ' = ' + Math.abs(diff) + '°C.')] };
      }
      var mx = Math.max.apply(null, temps);
      if (temps.filter(function (x) { return x === mx; }).length > 1) { temps[temps.lastIndexOf(mx)] += 1; mx += 1; }
      var g3 = V.lineGraph({ xlabels: times, values: temps, step: 2, max: 22, ylabel: 'Temperature (°C)', xlabel: 'Time', title: 'Temperature in the forest' });
      var at = times[temps.indexOf(mx)];
      return { prompt: 'At what time was the temperature <b>highest</b>?', visual: g3, input: { type: 'choice', options: times.map(function (x) { return { value: x, label: x }; }) }, check: { kind: 'choice', value: at, label: at },
        hint: 'Find the highest point on the line.', params: { temps: temps }, solution: [S('The highest point on the line is ' + mx + '°C.'), S('That was at ' + at + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.vals) return q.check.value === p.vals[p.i] && p.vals.every(function (v) { return v * 2 % p.step === 0; });
      if (p.j !== undefined) return q.check.value === p.temps[p.j];
      if (p.a !== undefined) return q.check.value === Math.abs(p.temps[p.b] - p.temps[p.a]);
      var mx = Math.max.apply(null, p.temps), times = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm'];
      return p.temps.filter(function (x) { return x === mx; }).length === 1 && times[p.temps.indexOf(mx)] === q.check.value;
    }
  });

  OM.registerGen({
    id: 'graphProblems', objective: 'Y4-S-02', title: 'Data problems',
    make: function (r, L) {
      var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      if (L === 1) {
        var key = r.pick([2, 4, 10]), vals = days.slice(0, 4).map(function () { return key / 2 * r.int(1, 10); }), i = r.int(0, 3);
        return { prompt: 'The pictogram shows how many acorns ' + (OM.TUTOR || 'Pip') + ' collected. How many acorns were collected on <b>' + days[i] + '</b>?', visual: V.pictogram({ cats: days.slice(0, 4), values: vals, key: key, unit: 'acorns' }),
          input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: vals[i] }, hint: 'Each whole acorn picture is worth ' + key + '. Half a picture is worth ' + key / 2 + '.', params: { vals: vals, i: i, key: key },
          solution: [S(days[i] + ' has ' + Math.floor(vals[i] / key) + ' whole picture' + (Math.floor(vals[i] / key) === 1 ? '' : 's') + (vals[i] % key ? ' and a half' : '') + '.'), S(Math.floor(vals[i] / key) + ' × ' + key + (vals[i] % key ? ' + ' + key / 2 : '') + ' = ' + vals[i] + ' acorns.')] };
      }
      if (L === 2) {
        var ctx = r.pick(CONTEXTS), cats = ctx.cats.slice(0, 4), step = r.pick([2, 5, 10]), v = cats.map(function () { return step * r.int(1, 8); });
        var chart = V.barChart({ cats: cats, values: v, step: step, max: step * 8, ylabel: ctx.y, title: ctx.title });
        if (r.chance(0.5)) {
          var a = r.int(0, 3), b = (a + r.int(1, 3)) % 4;
          if (v[a] === v[b]) v[a] += step;
          if (v[a] < v[b]) { var t = a; a = b; b = t; }
          chart = V.barChart({ cats: cats, values: v, step: step, max: step * 9, ylabel: ctx.y, title: ctx.title });
          return { prompt: 'How many more for <b>' + cats[a] + '</b> than for <b>' + cats[b] + '</b>?', visual: chart, input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: v[a] - v[b] },
            hint: '"How many more" means find the difference: subtract.', params: { v: v, a: a, b: b, op: '−' },
            solution: [S(cats[a] + ': ' + v[a] + '. ' + cats[b] + ': ' + v[b] + '.'), S('Difference: ' + v[a] + ' − ' + v[b] + ' = ' + (v[a] - v[b]) + '.')] };
        }
        var tot = v.reduce(function (x, y) { return x + y; }, 0);
        return { prompt: 'What is the <b>total</b> of all the bars?', visual: chart, input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: tot }, hint: 'Read each bar, then add them all.', params: { v: v, op: '+' },
          solution: [S('The bars show ' + v.join(', ') + '.'), S(v.join(' + ') + ' = ' + tot + '.')] };
      }
      if (r.chance(0.5)) {
        var shop = ['Apples', 'Pears', 'Plums', 'Cherries'], nums = shop.map(function () { return r.int(15, 140); }), miss = r.int(0, 3), total = nums.reduce(function (x, y) { return x + y; }, 0);
        var rows = shop.map(function (s, k) { return [s, k === miss ? '?' : String(nums[k])]; }).concat([['<b>Total</b>', '<b>' + total + '</b>']]);
        return { prompt: 'The table shows the fruit sold at the forest market. How many <b>' + shop[miss].toLowerCase() + '</b> were sold?', visual: V.table(['Fruit', 'Number sold'], rows), input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: nums[miss] },
          hint: 'Add the numbers you know, then subtract from the total.', params: { nums: nums, miss: miss, total: total },
          solution: [S('Known numbers: ' + nums.filter(function (_, k) { return k !== miss; }).join(' + ') + ' = ' + (total - nums[miss]) + '.'), S('Missing: ' + total + ' − ' + (total - nums[miss]) + ' = ' + nums[miss] + '.')] };
      }
      var key2 = r.pick([4, 10]), vv = days.map(function () { return key2 / 2 * r.int(1, 9); });
      var sum2 = vv[0] + vv[1], f = vv[4];
      if (sum2 <= f) { vv[4] = key2 / 2; f = vv[4]; }
      return { prompt: 'The pictogram shows acorns collected each day. How many more acorns were collected on Monday and Tuesday <b>together</b> than on Friday?', visual: V.pictogram({ cats: days, values: vv, key: key2, unit: 'acorns' }),
        input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: sum2 - f }, hint: 'Step 1: add Monday and Tuesday. Step 2: subtract Friday.', params: { vv: vv, key: key2 },
        solution: [S('Monday: ' + vv[0] + ', Tuesday: ' + vv[1] + ', Friday: ' + vv[4] + '.'), S(vv[0] + ' + ' + vv[1] + ' = ' + sum2 + '. Then ' + sum2 + ' − ' + vv[4] + ' = ' + (sum2 - f) + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.vals) return q.check.value === p.vals[p.i] && p.vals.every(function (x) { return (x * 2) % p.key === 0; });
      if (p.op === '−') return q.check.value === p.v[p.a] - p.v[p.b] && q.check.value > 0;
      if (p.op === '+') { var s = 0; p.v.forEach(function (x) { s += x; }); return s === q.check.value; }
      if (p.nums) { var t = 0; p.nums.forEach(function (x) { t += x; }); return t === p.total && q.check.value === p.nums[p.miss]; }
      return q.check.value === p.vv[0] + p.vv[1] - p.vv[4] && q.check.value > 0 && p.vv.every(function (x) { return (x * 2) % p.key === 0; });
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
