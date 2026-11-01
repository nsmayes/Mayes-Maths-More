/* Learn with Pip — Year 4 generators: fractions (including decimals).
   Decimals are handled as whole numbers of hundredths internally, so there are no floating-point errors. */
(function (G) {
  'use strict';
  var OM = G.OM, V = OM.V, fmt = OM.fmt, F = OM.frac, dec = OM.fromScaled;
  function S(text, html) { return { text: text, html: html || '' }; }
  // A fraction with a blank in it, for fill-in templates (no read-aloud attribute, so the blank marker survives)
  function fb(n, d) { return '<span class="frac"><span class="fn">' + n + '</span><span class="fd">' + d + '</span></span>'; }
  function cross(a, b, c, d) { return a * d === b * c; }

  OM.registerGen({
    id: 'equivFractions', objective: 'Y4-F-01', title: 'Equivalent fractions',
    make: function (r, L) {
      var bases = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 6], [5, 6]];
      var b = r.pick(bases), k, n2, d2;
      if (L === 1) { b = r.pick(bases.slice(0, 5)); k = r.int(2, Math.floor(12 / b[1])); }
      else k = r.int(2, b[1] <= 3 ? 6 : 4);
      n2 = b[0] * k; d2 = b[1] * k;
      if (L < 3) {
        var form = L === 1 ? 0 : r.int(0, 3), tpl, ans;
        if (form === 0) { tpl = fb(b[0], b[1]) + ' = ' + fb('{0}', d2); ans = n2; }
        else if (form === 1) { tpl = fb(b[0], b[1]) + ' = ' + fb(n2, '{0}'); ans = d2; }
        else if (form === 2) { tpl = fb('{0}', b[1]) + ' = ' + fb(n2, d2); ans = b[0]; }
        else { tpl = fb(b[0], '{0}') + ' = ' + fb(n2, d2); ans = b[1]; }
        return { prompt: 'Complete the equivalent fractions.', input: { type: 'multi', template: '<span class="big-sum">' + tpl + '</span>', blanks: [{ keys: 'digits', small: true }] },
          check: { kind: 'multi', parts: [{ kind: 'int', value: ans }] }, answerText: String(ans), hint: 'What have the ' + (form % 2 ? 'numerators' : 'denominators') + ' been ' + (form < 2 ? 'multiplied' : 'divided') + ' by? Do the same to the other part.',
          params: { b: b, k: k, form: form, n2: n2, d2: d2 },
          solution: [S(form < 2 ? 'The ' + (form === 0 ? 'denominator' : 'numerator') + ' has been multiplied by ' + k + '. Multiply the ' + (form === 0 ? 'numerator' : 'denominator') + ' by ' + k + ' too.' : 'The ' + (form === 2 ? 'denominator' : 'numerator') + ' has been divided by ' + k + '. Divide the other part by ' + k + ' too.'),
            S(F(b[0], b[1]) + ' = ' + F(n2, d2) + '. The shaded amount is the same:', V.fractionWall([{ d: b[1], shaded: b[0], label: F(b[0], b[1]) }, { d: d2, shaded: n2, label: F(n2, d2) }]))] };
      }
      var target = r.pick(bases), eqs = [2, 3, 4].map(function (m) { return [target[0] * m, target[1] * m]; });
      var wrong = r.chance(0.5) ? [target[0] + 1, target[1] + 1] : [target[0] + 2, target[1] * 2];
      if (cross(wrong[0], wrong[1], target[0], target[1])) wrong = [target[0] + 1, target[1] * 3];
      var opts = r.shuffle(eqs.concat([wrong]).map(function (f) { return { value: f.join('/'), label: F(f[0], f[1]) }; }));
      return { prompt: 'Which fraction is <b>not</b> equivalent to ' + F(target[0], target[1]) + '?', input: { type: 'choice', options: opts },
        check: { kind: 'choice', value: wrong.join('/'), label: F(wrong[0], wrong[1]) }, hint: 'Is the numerator and denominator multiplied by the same number?', params: { target: target, wrong: wrong, eqs: eqs },
        solution: [S(eqs.map(function (e) { return F(e[0], e[1]) + ' = ' + F(target[0], target[1]) + ' (× ' + e[0] / target[0] + ')'; }).join(', ') + '.'),
          S(F(wrong[0], wrong[1]) + ' is not made by multiplying the numerator and denominator by the same number, so it is not equivalent.', V.fractionWall([{ d: target[1], shaded: target[0], label: F(target[0], target[1]) }, { d: wrong[1], shaded: wrong[0], label: F(wrong[0], wrong[1]) }]))] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.form !== undefined) { var parts = [p.b[0], p.b[1], p.n2, p.d2]; var idx = [2, 3, 0, 1][p.form]; parts[idx] = q.check.parts[0].value; return cross(parts[0], parts[1], parts[2], parts[3]); }
      return !cross(p.wrong[0], p.wrong[1], p.target[0], p.target[1]) && p.eqs.every(function (e) { return cross(e[0], e[1], p.target[0], p.target[1]); });
    },
    constraints: function (q) { var p = q.params; return p.d2 > 24 ? ['denominator above 24'] : []; }
  });

  OM.registerGen({
    id: 'hundredths', objective: 'Y4-F-02', title: 'Hundredths',
    make: function (r, L) {
      if (L === 1) {
        var n = r.int(1, 99);
        return { prompt: 'The square is split into 100 equal parts. What fraction is shaded? Write it in <b>hundredths</b>.', visual: V.hundredSquare(n), input: { type: 'fraction' },
          check: { kind: 'frac', n: n, d: 100, form: 'denominator', denom: 100 }, hint: 'Count the full columns of 10, then the extra squares.', params: { n: n },
          solution: [S('There are ' + Math.floor(n / 10) + ' full columns of 10 and ' + n % 10 + ' more squares: ' + n + ' squares.'), S(n + ' out of 100 = ' + F(n, 100) + '.')] };
      }
      if (L === 2) {
        var up = r.chance(0.6), start = r.int(1, 8) * 10 + r.int(5, 9) - (up ? 3 : 0), terms = [];
        if (!up) start = r.int(1, 8) * 10 + r.int(1, 3) + 3;
        var whole = r.chance(0.3) ? r.int(1, 5) * 100 : 0;
        for (var i = 0; i < 6; i++) terms.push(whole + start + (up ? i : -i));
        var blanks = r.sample([2, 3, 4, 5], 2).sort();
        return { prompt: 'Count ' + (up ? 'up' : 'down') + ' in hundredths. Write the missing numbers.', input: { type: 'multi', template: terms.map(function (t, j) { var b = blanks.indexOf(j); return b >= 0 ? '{' + b + '}' : dec(t, 2); }).join(', '), blanks: [{ keys: 'decimal' }, { keys: 'decimal' }] },
          check: { kind: 'multi', parts: blanks.map(function (b) { return { kind: 'dec', value: dec(terms[b], 2) }; }) }, answerText: blanks.map(function (b) { return dec(terms[b], 2); }).join(' and '),
          hint: 'Each step changes the hundredths digit by 1. After 9 hundredths, exchange for 1 tenth.', params: { terms: terms, up: up },
          solution: [S('Hundredths are the second digit after the decimal point. ' + (up ? 'Add' : 'Subtract') + ' 0.01 each time.'), S('When the hundredths go ' + (up ? 'past 9, exchange 10 hundredths for 1 tenth' : 'below 0, exchange 1 tenth for 10 hundredths') + ': ' + terms.map(function (t) { return dec(t, 2); }).join(', ') + '.')] };
      }
      var t = r.int(1, 9);
      if (r.chance(0.5)) return { prompt: 'How many <b>hundredths</b> are equal to ' + t + ' tenth' + (t > 1 ? 's' : '') + '?', input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: t * 10 },
        hint: 'Each tenth splits into 10 hundredths.', params: { t: t, type: 'h' },
        solution: [S('1 tenth = 10 hundredths, so ' + t + ' tenths = ' + t + ' × 10 = ' + t * 10 + ' hundredths.', V.hundredSquare(t * 10)), S(F(t, 10) + ' = ' + F(t * 10, 100) + ' = ' + dec(t, 1) + '.')] };
      return { prompt: 'Divide ' + F(t, 10) + ' by 10. Write your answer as a fraction in hundredths.', input: { type: 'fraction' }, check: { kind: 'frac', n: t, d: 100, form: 'denominator', denom: 100 },
        hint: 'Dividing tenths by 10 makes hundredths.', params: { t: t, type: 'd' },
        solution: [S('One tenth divided by 10 is one hundredth.'), S('So ' + F(t, 10) + ' ÷ 10 = ' + F(t, 100) + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.n) return q.check.n === p.n;
      if (p.terms) return p.terms.every(function (x, i) { return i === 0 || x - p.terms[i - 1] === (p.up ? 1 : -1); }) && p.terms.every(function (x) { return x > 0; });
      return p.type === 'h' ? q.check.value === p.t * 10 : q.check.n === p.t && q.check.d === 100;
    }
  });

  OM.registerGen({
    id: 'fractionOfAmount', objective: 'Y4-F-03', title: 'Fractions of amounts',
    make: function (r, L) {
      var d = r.int(2, 10), k = r.int(2, 12), amt = d * k, n = L === 1 ? 1 : r.int(2, d - 1);
      if (d === 2 && L > 1) { d = 4; amt = d * k; n = 3; }
      if (L < 3) {
        var ans = n * k;
        return { prompt: 'What is ' + F(n, d) + ' of ' + amt + '?', input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: ans },
          hint: 'Divide by the denominator (' + d + ')' + (n > 1 ? ', then multiply by the numerator (' + n + ').' : '.'), params: { n: n, d: d, amt: amt },
          solution: [S('Split ' + amt + ' into ' + d + ' equal parts: ' + amt + ' ÷ ' + d + ' = ' + k + '.', V.barModel({ parts: d, total: String(amt), partLabel: String(k), shaded: n })),
            S(n > 1 ? 'We need ' + n + ' parts: ' + k + ' × ' + n + ' = ' + ans + '.' : 'So ' + F(1, d) + ' of ' + amt + ' = ' + k + '.')] };
      }
      d = r.pick([3, 4, 5, 6, 8, 10]); k = r.int(5, 25); amt = d * k; n = r.int(2, d - 1);
      var name = r.pick(OM.NAMES), item = r.pick(OM.ITEMS), taken = n * k, left = amt - taken;
      if (r.chance(0.5)) {
        return { prompt: 'There are ' + amt + ' ' + item + ' in a bag. ' + name + ' takes ' + F(n, d) + ' of them. How many ' + item + ' does ' + name + ' take?', input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: taken },
          hint: 'Find ' + F(1, d) + ' first.', params: { n: n, d: d, amt: amt },
          solution: [S(F(1, d) + ' of ' + amt + ' = ' + amt + ' ÷ ' + d + ' = ' + k + '.', V.barModel({ parts: d, total: String(amt), partLabel: String(k), shaded: n })), S(F(n, d) + ' of ' + amt + ' = ' + k + ' × ' + n + ' = ' + taken + '.')] };
      }
      return { prompt: 'There are ' + amt + ' ' + item + ' in a bag. ' + name + ' takes ' + F(n, d) + ' of them. How many ' + item + ' are <b>left</b> in the bag?', marks: 2, input: { type: 'working', keys: 'working' },
        check: { kind: 'working', final: { kind: 'int', value: left }, plans: [
          [{ op: '/', a: { g: amt }, b: { g: d } }, { op: '*', a: { s: 0 }, b: { g: n } }, { op: '-', a: { g: amt }, b: { s: 1 } }],
          [{ op: '/', a: { g: amt }, b: { g: d } }, { op: '*', a: { s: 0 }, b: { g: d - n } }]], exampleLines: [amt + ' ÷ ' + d + ' = ' + k, k + ' × ' + n + ' = ' + taken, amt + ' − ' + taken + ' = ' + left] },
        hint: 'Work out how many ' + name + ' takes, then how many are left.', params: { n: n, d: d, amt: amt, left: true },
        solution: [S(F(1, d) + ' of ' + amt + ' = ' + k + '. So ' + F(n, d) + ' = ' + k + ' × ' + n + ' = ' + taken + '.', V.barModel({ parts: d, total: String(amt), partLabel: String(k), shaded: n })),
          S('Left: ' + amt + ' − ' + taken + ' = ' + left + '. (Or: ' + F(d - n, d) + ' are left, ' + k + ' × ' + (d - n) + ' = ' + left + '.)')] };
    },
    verify: function (q) {
      var p = q.params, v = q.check.kind === 'working' ? q.check.final.value : q.check.value;
      if (p.amt % p.d) return false;
      return p.left ? v * p.d === p.amt * (p.d - p.n) : v * p.d === p.amt * p.n;
    }
  });

  OM.registerGen({
    id: 'fracAddSub', objective: 'Y4-F-04', title: 'Adding and subtracting fractions',
    make: function (r, L) {
      var d = r.int(3, 12), a, b, op, ans, tpl, sol;
      if (L === 1) {
        op = r.chance(0.5) ? '+' : '−';
        if (op === '+') { a = r.int(1, d - 2); b = r.int(1, d - 1 - a); ans = a + b; } else { a = r.int(2, d - 1); b = r.int(1, a - 1); ans = a - b; }
        tpl = F(a, d) + ' ' + op + ' ' + F(b, d);
        sol = [S('The denominators are the same, so ' + (op === '+' ? 'add' : 'subtract') + ' the numerators: ' + a + ' ' + op + ' ' + b + ' = ' + ans + '. The denominator stays ' + d + '.', V.fractionBar(d, ans)), S(tpl + ' = ' + F(ans, d) + '.')];
      } else if (L === 2) {
        op = r.chance(0.6) ? '+' : '−';
        if (op === '+') { a = r.int(2, d - 1); b = r.int(d - a + 1, d - 1); if (b < 1) b = 1; ans = a + b; } else { a = r.int(d + 1, 2 * d - 1); b = r.int(1, a - 1); ans = a - b; }
        tpl = F(a, d) + ' ' + op + ' ' + F(b, d);
        sol = [S((op === '+' ? 'Add' : 'Subtract') + ' the numerators: ' + a + ' ' + op + ' ' + b + ' = ' + ans + '. So the answer is ' + F(ans, d) + '.'),
          S(ans > d ? F(ans, d) + ' is more than one whole: ' + F(d, d) + ' = 1, so ' + F(ans, d) + ' = ' + F(ans - d, d, 1) + '. Either answer is fine.' : ans === d ? F(d, d) + ' = 1 whole.' : 'The answer is less than one whole.', V.fractionBar(d, Math.min(ans, d)) + (ans > d ? V.fractionBar(d, ans - d) : ''))];
      } else {
        if (r.chance(0.5)) { a = d; b = r.int(1, d - 1); ans = d - b; op = '−'; tpl = '1 − ' + F(b, d);
          sol = [S('One whole is the same as ' + F(d, d) + '.', V.fractionBar(d, d)), S(F(d, d) + ' − ' + F(b, d) + ' = ' + F(ans, d) + '.', V.fractionBar(d, ans))]; }
        else { a = r.int(2, d - 1); b = r.int(1, d - 1); var c = r.int(1, a + b - 1); ans = a + b - c; op = '+−'; tpl = F(a, d) + ' + ' + F(b, d) + ' − ' + F(c, d);
          sol = [S('All the denominators are ' + d + ', so work with the numerators: ' + a + ' + ' + b + ' − ' + c + ' = ' + ans + '.'), S('The answer is ' + F(ans, d) + (ans > d ? ' = ' + F(ans - d, d, 1) : '') + '.')]; b = [b, c]; }
      }
      return { prompt: 'Work out <span class="big-sum">' + tpl + '</span>', input: { type: 'fraction', mixed: true }, check: { kind: 'frac', n: ans, d: d },
        hint: 'Same denominators: only add or subtract the numerators.', params: { a: a, b: b, d: d, op: op, ans: ans },
        reject: ['answers where the denominators have been added or subtracted'], solution: sol };
    },
    verify: function (q) {
      var p = q.params, v;
      if (p.op === '+') v = p.a + p.b; else if (p.op === '−') v = p.a - p.b; else v = p.a + p.b[0] - p.b[1];
      return v === q.check.n && v > 0 && q.check.d === p.d;
    },
    constraints: function (q) { return q.check.n > 2 * q.check.d ? ['answer more than 2 wholes'] : []; }
  });

  OM.registerGen({
    id: 'decimalTenthsHundredths', objective: 'Y4-F-05', title: 'Tenths and hundredths as decimals',
    make: function (r, L) {
      if (L === 1) {
        if (r.chance(0.5)) { var t = r.int(1, 9); return { prompt: 'Write ' + F(t, 10) + ' as a decimal.', input: { type: 'number', keys: 'decimal' }, check: { kind: 'dec', value: dec(t, 1) },
          hint: 'Tenths go in the first place after the decimal point.', params: { h: t * 10 }, solution: [S(t + ' tenths: write ' + t + ' in the tenths column.', V.placeValue(['O', 't'], ['0', String(t)], { pointAfter: 0 })), S(F(t, 10) + ' = ' + dec(t, 1) + '.')] }; }
        var h = r.int(11, 99); if (h % 10 === 0) h++;
        return { prompt: 'Write ' + F(h, 100) + ' as a decimal.', input: { type: 'number', keys: 'decimal' }, check: { kind: 'dec', value: dec(h, 2) }, hint: 'Hundredths use two places after the decimal point.', params: { h: h },
          solution: [S(h + ' hundredths = ' + Math.floor(h / 10) + ' tenths and ' + h % 10 + ' hundredths.', V.placeValue(['O', 't', 'h'], ['0', String(Math.floor(h / 10)), String(h % 10)], { pointAfter: 0 })), S(F(h, 100) + ' = ' + dec(h, 2) + '.')] };
      }
      if (L === 2) {
        var hh = r.chance(0.4) ? r.int(1, 9) * 10 : r.int(11, 99);
        var dp = hh % 10 === 0 ? 1 : 2, shown = dp === 1 ? dec(hh / 10, 1) : dec(hh, 2);
        return { prompt: 'Write ' + shown + ' as a fraction.', input: { type: 'fraction' }, check: { kind: 'frac', n: dp === 1 ? hh / 10 : hh, d: dp === 1 ? 10 : 100 }, hint: 'One decimal place means tenths; two decimal places mean hundredths.', params: { h: hh },
          solution: [S(dp === 1 ? shown + ' is ' + hh / 10 + ' tenths.' : shown + ' is ' + hh + ' hundredths.', V.placeValue(['O', 't', 'h'], ['0', String(Math.floor(hh / 10)), dp === 2 ? String(hh % 10) : ''], { pointAfter: 0 })), S(shown + ' = ' + (dp === 1 ? F(hh / 10, 10) : F(hh, 100)) + '. Equivalent fractions are also correct.')] };
      }
      var kind = r.int(0, 2), w, tt, hu, val, prompt;
      if (kind === 0) { hu = r.int(1, 9); val = hu; prompt = 'Write ' + F(hu, 100) + ' as a decimal.'; }
      else if (kind === 1) { tt = r.int(1, 9); hu = r.int(1, 9); val = tt * 10 + hu; prompt = 'Write <b>' + tt + ' tenth' + (tt > 1 ? 's' : '') + ' and ' + hu + ' hundredth' + (hu > 1 ? 's' : '') + '</b> as a decimal.'; }
      else { w = r.int(1, 9); tt = r.int(0, 9); hu = r.int(1, 9); val = w * 100 + tt * 10 + hu; prompt = 'Write as a decimal: &nbsp;' + w + ' + ' + F(tt, 10) + ' + ' + F(hu, 100); if (tt === 0) prompt = 'Write as a decimal: &nbsp;' + w + ' + ' + F(hu, 100); }
      var ds = String(val + 1000).slice(1);
      return { prompt: prompt, input: { type: 'number', keys: 'decimal' }, check: { kind: 'dec', value: dec(val, 2) }, hint: 'Use a place value chart: ones, tenths, hundredths. Watch for empty columns!', params: { h: val },
        reject: kind === 0 ? [dec(hu, 1) + ' (that is ' + hu + ' tenths)'] : [],
        solution: [S('Put each part in its column. An empty column needs a 0 as a place holder.', V.placeValue(['O', 't', 'h'], [String(Math.floor(val / 100)), ds[1], ds[2]], { pointAfter: 0 })), S('The decimal is ' + dec(val, 2) + '.')] };
    },
    verify: function (q) {
      var h = q.params.h;
      if (q.check.kind === 'dec') return OM.parseScaled(q.check.value, 2) === (q.check.value.split('.')[1].length === 1 ? h : h);
      return q.check.n * 100 === h * q.check.d;
    }
  });

  OM.registerGen({
    id: 'decimalQuarters', objective: 'Y4-F-06', title: 'Halves and quarters as decimals',
    make: function (r, L) {
      var fr = r.pick([[1, 2, 50], [1, 4, 25], [3, 4, 75]]), w = L === 1 ? 0 : r.int(0, 9);
      if (L === 1 || (L === 2 && r.chance(0.5))) {
        return { prompt: 'Write ' + (w ? w + ' and ' : '') + F(fr[0], fr[1]) + ' as a decimal.', input: { type: 'number', keys: 'decimal' }, check: { kind: 'dec', value: dec(w * 100 + fr[2], 2).replace(/0$/, '') },
          hint: 'Think of 100 squares (or £1 = 100p).', params: { w: w, fr: fr },
          solution: [S(F(fr[0], fr[1]) + ' of 100 is ' + fr[2] + ', so ' + F(fr[0], fr[1]) + ' = ' + F(fr[2], 100) + ' = ' + dec(fr[2], 2).replace(/0$/, '') + '.', V.hundredSquare(fr[2])), S(w ? w + ' and ' + F(fr[0], fr[1]) + ' = ' + dec(w * 100 + fr[2], 2).replace(/0$/, '') + '.' : '')] };
      }
      if (L === 2) {
        var shown = dec(w * 100 + fr[2], 2).replace(/0$/, '');
        return { prompt: 'Write ' + shown + ' as a ' + (w ? 'mixed number' : 'fraction') + '.', input: { type: 'fraction', mixed: !!w }, check: { kind: 'frac', n: w * fr[1] + fr[0], d: fr[1] },
          hint: '0.5 is a half, 0.25 is a quarter and 0.75 is three quarters.', params: { w: w, fr: fr },
          solution: [S(dec(fr[2], 2).replace(/0$/, '') + ' = ' + F(fr[2], 100) + ' = ' + F(fr[0], fr[1]) + '.'), S(shown + ' = ' + (w ? F(fr[0], fr[1], w) : F(fr[0], fr[1])) + '. Equivalent fractions are also correct.')] };
      }
      var d1 = r.pick([10, 20, 30, 40, 60, 70, 80, 90, 25, 50, 75].filter(function (x) { return x !== fr[2]; }));
      var decStr = dec(d1, 2).replace(/0$/, ''), fracBigger = fr[2] > d1;
      var opts = r.shuffle([{ value: 'f', label: F(fr[0], fr[1]) }, { value: 'd', label: decStr }]);
      return { prompt: 'Which is <b>greater</b>: ' + F(fr[0], fr[1]) + ' or ' + decStr + '?', input: { type: 'choice', options: opts }, check: { kind: 'choice', value: fracBigger ? 'f' : 'd', label: fracBigger ? F(fr[0], fr[1]) : decStr },
        hint: 'Change the fraction into a decimal first.', params: { fr: fr, d1: d1 },
        solution: [S(F(fr[0], fr[1]) + ' = ' + dec(fr[2], 2) + ' and ' + decStr + ' = ' + dec(d1, 2) + '.'), S(dec(Math.max(fr[2], d1), 2) + ' is greater, so ' + (fracBigger ? F(fr[0], fr[1]) : decStr) + ' is greater.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (q.check.kind === 'dec') return OM.parseScaled(q.check.value, 2) * p.fr[1] === (p.w * p.fr[1] + p.fr[0]) * 100;
      if (q.check.kind === 'frac') return q.check.n * 100 === (p.w * 100 + p.fr[2]) * q.check.d;
      return (p.fr[0] * 100 / p.fr[1] > p.d1) === (q.check.value === 'f');
    }
  });

  OM.registerGen({
    id: 'divide10100', objective: 'Y4-F-07', title: 'Dividing by 10 and 100',
    make: function (r, L) {
      var n = r.chance(0.3) ? r.int(1, 9) : r.int(11, 99), by = L === 1 ? 10 : L === 2 ? r.pick([10, 100, 100]) : r.pick([10, 100]);
      var places = by === 10 ? 1 : 2, ans = dec(n, places).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
      var digitsIn = String(n), cols = ['T', 'O', 't', 'h'];
      var before = digitsIn.length === 2 ? [digitsIn[0], digitsIn[1], '', ''] : ['', digitsIn, '', ''];
      var afterArr = ['', '', '', ''];
      var ds = digitsIn.split('');
      for (var i = 0; i < ds.length; i++) afterArr[2 - ds.length + i + places] = ds[i];
      if (!afterArr[1]) afterArr[1] = '0';
      if (places === 2 && !afterArr[2]) afterArr[2] = '0';
      var pics = V.placeValue(cols, before, { pointAfter: 1 }) + V.placeValue(cols, afterArr, { pointAfter: 1, arrowShift: 'digits move ' + places + ' place' + (places > 1 ? 's' : '') + ' right' });
      if (L < 3 || r.chance(0.3)) {
        return { prompt: '<span class="big-sum">' + n + ' ÷ ' + by + ' = ?</span>', input: { type: 'number', keys: 'decimal' }, check: { kind: 'dec', value: ans },
          hint: 'Dividing by ' + by + ' moves every digit ' + places + ' place' + (places > 1 ? 's' : '') + ' to the right.', params: { n: n, by: by },
          solution: [S('Put ' + n + ' in a place value chart, then move each digit ' + places + ' place' + (places > 1 ? 's' : '') + ' to the right.', pics), S(n + ' ÷ ' + by + ' = ' + ans + '.')] };
      }
      if (r.chance(0.5)) {
        return { prompt: 'Find the missing number.', input: { type: 'multi', template: '<span class="big-sum">{0} ÷ ' + by + ' = ' + ans + '</span>', blanks: [{ keys: 'digits' }] }, check: { kind: 'multi', parts: [{ kind: 'int', value: n }] }, answerText: String(n),
          hint: 'Use the inverse: multiply ' + ans + ' by ' + by + '.', params: { n: n, by: by },
          solution: [S('Multiplying by ' + by + ' undoes dividing by ' + by + ': ' + ans + ' × ' + by + ' = ' + n + '.', pics)] };
      }
      // the digit asked about must be unique and not 0, otherwise "the digit" would be ambiguous
      if (ds.length === 2 && (ds[0] === ds[1] || ds[1] === '0')) return this.make(r, L);
      var val = ['ones', 'tenths', 'hundredths'], which = ds.length === 2 && r.chance(0.5) ? 0 : ds.length - 1;
      var dg = ds[which], correct = val[places - (ds.length - 1 - which)];
      return { prompt: 'Work out ' + n + ' ÷ ' + by + '. What is the value of the digit <b>' + dg + '</b> in the answer?', input: { type: 'choice', options: val.map(function (v) { return { value: v, label: dg + ' ' + v }; }) },
        check: { kind: 'choice', value: correct, label: dg + ' ' + correct }, hint: 'Find the answer first, then look at which column the ' + dg + ' is in.', params: { n: n, by: by, which: which },
        solution: [S(n + ' ÷ ' + by + ' = ' + ans + '.', pics), S('The ' + dg + ' is in the ' + correct + ' column, so it is worth ' + dg + ' ' + correct + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (q.check.kind === 'dec') return OM.parseScaled(q.check.value, 2) === p.n * 100 / p.by;
      if (q.check.kind === 'multi') return q.check.parts[0].value === p.n;
      var s = String(p.n), placesRight = (p.by === 10 ? 1 : 2) - (s.length - 1 - p.which);
      return q.check.value === ['ones', 'tenths', 'hundredths'][placesRight];
    }
  });

  OM.registerGen({
    id: 'roundDecimals', objective: 'Y4-F-08', title: 'Rounding decimals',
    make: function (r, L) {
      var w, t;
      function rnd(tenths) { return Math.floor(tenths / 10) + (tenths % 10 >= 5 ? 1 : 0); }
      if (L === 1) { w = r.int(1, 20); t = r.pick([1, 2, 3, 4, 6, 7, 8, 9]); }
      else if (L === 2) { w = r.pick([r.int(1, 99), 9, 19, 99]); t = r.pick([5, 5, r.int(1, 9)]); }
      if (L < 3) {
        var x = w * 10 + t, ans = rnd(x);
        return { prompt: 'Round <b>' + dec(x, 1) + '</b> to the nearest whole number.', input: { type: 'number', keys: 'digits' }, check: { kind: 'int', value: ans }, hint: 'Look at the tenths digit. 5 or more rounds up.', params: { x: x },
          solution: [S(dec(x, 1) + ' is between ' + w + ' and ' + (w + 1) + '.', V.numberLine({ min: w * 10, max: w * 10 + 10, step: 1, labels: 'none', labelValues: [w * 10, w * 10 + 5, w * 10 + 10], format: function (v) { return dec(v, 1).replace('.0', ''); }, points: [{ v: x, label: dec(x, 1) }] })),
            S('The tenths digit is ' + t + (t >= 5 ? ', which is 5 or more, so round up to ' + ans : ', which is less than 5, so round down to ' + ans) + '.')] };
      }
      if (r.chance(0.5)) {
        var thing = r.pick([['pumpkin', 'kg', 'mass'], ['plank of wood', 'm', 'length'], ['bucket of water', 'litres', 'capacity'], ['marrow', 'kg', 'mass']]);
        var xx = r.int(2, 30) * 10 + r.int(1, 9);
        return { prompt: 'The ' + thing[2] + ' of a ' + thing[0] + ' is ' + dec(xx, 1) + ' ' + thing[1] + '. What is this to the nearest whole ' + (thing[1] === 'kg' ? 'kilogram' : thing[1] === 'm' ? 'metre' : 'litre') + '?', input: { type: 'number', keys: 'digits', suffix: thing[1] },
          check: { kind: 'int', value: rnd(xx) }, answerText: rnd(xx) + ' ' + thing[1], hint: 'Look at the tenths digit.', params: { x: xx },
          solution: [S(dec(xx, 1) + ' is between ' + Math.floor(xx / 10) + ' and ' + (Math.floor(xx / 10) + 1) + '. The tenths digit is ' + xx % 10 + '.'), S('So it rounds to ' + rnd(xx) + ' ' + thing[1] + '.')] };
      }
      var N = r.int(2, 20), good = N * 10 + r.int(-5, 4), bads = [N * 10 + 5, N * 10 - 6, N * 10 + 7, N * 10 - 9];
      var opts = r.shuffle([good].concat(r.sample(bads, 3))).map(function (v) { return { value: String(v), label: dec(v, 1) }; });
      return { prompt: 'Which of these rounds to <b>' + N + '</b> to the nearest whole number?', input: { type: 'choice', options: opts }, check: { kind: 'choice', value: String(good), label: dec(good, 1) },
        hint: 'Numbers from ' + dec(N * 10 - 5, 1) + ' up to ' + dec(N * 10 + 4, 1) + ' round to ' + N + '.', params: { N: N, opts: opts.map(function (o) { return +o.value; }) },
        solution: [S('Numbers from ' + dec(N * 10 - 5, 1) + ' to ' + dec(N * 10 + 4, 1) + ' round to ' + N + '.'), S(dec(good, 1) + ' rounds to ' + N + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.x !== undefined) return q.check.value === Math.round(p.x / 10 + 1e-9) || q.check.value === Math.floor((p.x + 5) / 10);
      var hits = p.opts.filter(function (v) { return Math.floor((v + 5) / 10) === p.N; });
      return hits.length === 1 && String(hits[0]) === q.check.value;
    }
  });

  OM.registerGen({
    id: 'compareDecimals', objective: 'Y4-F-09', title: 'Comparing decimals',
    make: function (r, L) {
      var dp = L === 1 ? 1 : 2;
      if (L < 3) {
        var a = r.int(1, dp === 1 ? 99 : 999), b;
        b = r.chance(0.5) ? +String(a).split('').reverse().join('') : a + r.int(-15, 15);
        if (b <= 0 || b === a) b = a + r.int(1, 9);
        if (r.chance(0.1)) b = a;
        var rel = a < b ? '<' : a > b ? '>' : '=';
        return { prompt: 'Choose the correct sign: &nbsp;<b>' + dec(a, dp) + ' &nbsp;?&nbsp; ' + dec(b, dp) + '</b>', input: { type: 'choice', options: [{ value: '<', label: '&lt;' }, { value: '>', label: '&gt;' }, { value: '=', label: '=' }], big: true },
          check: { kind: 'choice', value: rel, label: rel === '<' ? '&lt;' : rel === '>' ? '&gt;' : '=' }, hint: 'Compare the ones, then the tenths' + (dp === 2 ? ', then the hundredths.' : '.'), params: { a: a, b: b, dp: dp },
          solution: [S('Line up the decimal points and compare from the left.', V.placeValue(dp === 1 ? ['T', 'O', 't'] : ['O', 't', 'h'], (dp === 1 ? String(a + 1000).slice(-3) : String(a + 1000).slice(-3)).split(''), { pointAfter: dp === 1 ? 1 : 0 }) + V.placeValue(dp === 1 ? ['T', 'O', 't'] : ['O', 't', 'h'], String(b + 1000).slice(-3).split(''), { pointAfter: dp === 1 ? 1 : 0 })),
            S(dec(a, dp) + ' ' + (rel === '<' ? 'is less than' : rel === '>' ? 'is greater than' : 'is equal to') + ' ' + dec(b, dp) + '.')] };
      }
      var ds = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3), set = [];
      [[0, 1, 2], [0, 2, 1], [1, 0, 2], [2, 1, 0], [1, 2, 0], [2, 0, 1]].forEach(function (p) { set.push(ds[p[0]] * 100 + ds[p[1]] * 10 + ds[p[2]]); });
      var nums = r.sample(set, 4), sorted = nums.slice().sort(function (x, y) { return x - y; });
      return { prompt: 'Put these decimals in order, starting with the <b>smallest</b>. Tap them in order.', input: { type: 'order', items: nums.map(function (x) { return { value: String(x), label: dec(x, 2) }; }) },
        check: { kind: 'order', order: sorted.map(String), labels: sorted.map(function (x) { return dec(x, 2); }) }, hint: 'Compare the ones first, then the tenths, then the hundredths.', params: { nums: nums },
        solution: [S('Compare the ones digits first. If they are the same, compare the tenths, then the hundredths.'), S('Smallest to largest: ' + sorted.map(function (x) { return dec(x, 2); }).join(', ') + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.nums) { var s = p.nums.map(function (x) { return dec(x, 2); }).sort(function (x, y) { return parseFloat(x) - parseFloat(y); }); return s.join() === q.check.labels.join(); }
      var A = dec(p.a, p.dp), B = dec(p.b, p.dp);
      return q.check.value === (parseFloat(A) < parseFloat(B) ? '<' : parseFloat(A) > parseFloat(B) ? '>' : '=');
    }
  });

  OM.registerGen({
    id: 'decimalProblems', objective: 'Y4-F-10', title: 'Money and measure problems',
    make: function (r, L) {
      var name = r.pick(OM.NAMES);
      if (L === 1) {
        var p1 = r.int(105, 499), p2 = r.int(105, 499), it = r.sample(['a book', 'a torch', 'a map', 'a compass', 'a water bottle', 'a sun hat'], 2);
        return { prompt: name + ' buys ' + it[0] + ' for ' + OM.pounds(p1) + ' and ' + it[1] + ' for ' + OM.pounds(p2) + '. How much does ' + name + ' spend altogether?', input: { type: 'number', keys: 'decimal', prefix: '£' },
          check: { kind: 'money', pence: p1 + p2, box: '£' }, hint: 'Add the pounds and the pence. 100p = £1.', params: { a: p1, b: p2, op: '+' },
          solution: [S(OM.pounds(p1) + ' + ' + OM.pounds(p2) + '. Add the pence: ' + p1 % 100 + 'p + ' + p2 % 100 + 'p = ' + (p1 % 100 + p2 % 100) + 'p' + (p1 % 100 + p2 % 100 >= 100 ? ' = £1 and ' + (p1 % 100 + p2 % 100 - 100) + 'p' : '') + '.'), S('Total: ' + OM.pounds(p1 + p2) + '.')] };
      }
      if (L === 2) {
        var paid = r.pick([500, 1000, 2000]), cost = r.int(Math.floor(paid * 0.3), paid - 5);
        return { prompt: name + ' pays for a toy costing ' + OM.pounds(cost) + ' with a ' + OM.pounds(paid).replace('.00', '') + ' note' + (paid === 500 ? '' : '') + '. How much change does ' + name + ' get?', input: { type: 'number', keys: 'decimal', prefix: '£' },
          check: { kind: 'money', pence: paid - cost, box: '£' }, hint: 'Count up from ' + OM.pounds(cost) + ' to ' + OM.pounds(paid) + '.', params: { a: paid, b: cost, op: '−' },
          solution: [S('Change = ' + OM.pounds(paid) + ' − ' + OM.pounds(cost) + '. Count up from the price:', V.numberLine({ min: cost, max: paid, step: (paid - cost) / 2, labels: 'ends', format: function (v) { return OM.pounds(v); } })),
            S('Change: ' + OM.pounds(paid - cost) + '.')] };
      }
      var k = r.int(0, 2);
      if (k === 0) {
        var len = r.int(15, 60) * 10, cut = r.int(1, Math.floor(len / 5) - 1) * 5;
        return { prompt: 'A ribbon is ' + dec(len, 2).replace(/0$/, '') + ' m long. ' + name + ' cuts off ' + dec(cut, 2) + ' m. How long is the ribbon now?', input: { type: 'number', keys: 'decimal', suffix: 'm' },
          check: { kind: 'dec', value: dec(len - cut, 2) }, answerText: dec(len - cut, 2) + ' m', hint: 'Line up the decimal points. ' + dec(len, 2).replace(/0$/, '') + ' = ' + dec(len, 2) + '.', params: { a: len, b: cut, op: '−d' },
          solution: [S('Write both with two decimal places: ' + dec(len, 2) + ' − ' + dec(cut, 2) + '.'), S('Answer: ' + dec(len - cut, 2) + ' m.')] };
      }
      var whole = r.pick([4, 6, 8, 10, 12, 2, 3, 5]) * 100, fr = r.pick([[1, 2], [1, 4], [3, 4], [1, 10], [3, 10]]);
      if ((whole * fr[0]) % fr[1]) whole = 800;
      var part = whole * fr[0] / fr[1];
      return { prompt: name + ' has ' + OM.pounds(whole) + '. ' + name + ' spends ' + F(fr[0], fr[1]) + ' of it on a present. How much does the present cost?', input: { type: 'number', keys: 'decimal', prefix: '£' },
        check: { kind: 'money', pence: part, box: '£' }, hint: 'Find ' + F(1, fr[1]) + ' of ' + OM.pounds(whole) + ' first. It may help to work in pence.', params: { whole: whole, fr: fr },
        solution: [S(OM.pounds(whole) + ' = ' + whole + 'p. ' + F(1, fr[1]) + ' of ' + whole + 'p = ' + whole / fr[1] + 'p.'), S(fr[0] > 1 ? whole / fr[1] + 'p × ' + fr[0] + ' = ' + part + 'p = ' + OM.pounds(part) + '.' : 'So the present costs ' + OM.pounds(part) + '.')] };
    },
    verify: function (q) {
      var p = q.params;
      if (p.op === '+') return q.check.pence === p.a + p.b;
      if (p.op === '−') return q.check.pence === p.a - p.b && q.check.pence > 0;
      if (p.op === '−d') return OM.parseScaled(q.check.value, 2) === p.a - p.b && p.a - p.b > 0;
      return q.check.pence * p.fr[1] === p.whole * p.fr[0];
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
