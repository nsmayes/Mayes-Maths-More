/* Mayes Maths & More — the Higher-only parts of GCSE statements examined at both tiers (tier FH in js/gcse-content.js),
   for example surds within N8 or the quadratic formula within A18. Each Higher part is its own topic, placed straight after
   its parent topic and shown only to Higher-tier students. It quotes the full DfE statement, like every GCSE topic.
   Levels are Higher grade bands: 1 = Grade 6, 2 = Grade 7, 3 = Grade 8–9. Each generator checks its answer another way. */
(function (G) {
  'use strict';
  var OM = G.OM, K = OM.kit, V = OM.V, S = K.S, fmt = OM.fmt, A = OM.alg, C = OM.GCSE_CONTENT, gc = K.gcse;
  function Q(n, d) { return A.Q(n, d); }
  function neg(n) { return n < 0 ? '−' + fmt(-n) : fmt(n); }
  function asc(s) { return String(s).replace(/−/g, '-'); }
  function simp(n, d) { var g = OM.gcd(n, d) || 1; if (d < 0) { n = -n; d = -d; } return [n / g, d / g]; }
  function qt(n, d) { var s = simp(n, d); return s[1] === 1 ? String(s[0]) : s[0] + '/' + s[1]; }
  function round(x, dp) { return Math.round(x * Math.pow(10, dp)) / Math.pow(10, dp); }
  function surdOf(n) { var a = 1, b = n; for (var k = 2; k * k <= b; k++) while (b % (k * k) === 0) { b /= k * k; a *= k; } return [a, b]; }
  function isSq(n) { var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function same(a, b) { var x = A.parse(asc(a)), y = A.parse(asc(b)); return !!x && !!y && A.equivalent(x, y); }
  // the value of an expression in one letter, e.g. at('3x^2 - 1', 'x', 2) = 11
  function at(e, v, x) { var p = A.poly(A.parse(asc(e).replace(new RegExp(v, 'g'), '(' + x + ')'))); return p ? A.num(p[''] || A.Q(0)) : NaN; }
  var SUP = { 2: '²', 3: '³', 4: '⁴' };
  // a polynomial from its coefficients, highest power first: poly([2, -3, 1]) = '2x² − 3x + 1'; ascii gives '2x^2 - 3x + 1'
  function poly(cs, v, ascii) {
    v = v || 'x'; var n = cs.length - 1, out = '';
    cs.forEach(function (c, i) {
      var p = n - i; if (!c) return;
      var a = Math.abs(c), t = (a === 1 && p ? '' : String(a)) + (p ? v + (p > 1 ? (ascii ? '^' + p : SUP[p]) : '') : '');
      out += out ? (c < 0 ? ' − ' : ' + ') + t : (c < 0 ? '−' : '') + t;
    });
    out = out || '0'; return ascii ? asc(out) : out;
  }
  function br(a, b, v) { return '(' + poly([a, b], v) + ')'; }
  function M(text, any) { return { code: 'M1', text: text, any: any }; }
  function A1(t) { return { code: 'A1', text: t || 'for the correct answer' }; }
  function cv(x, y) { return '<span class="cvec"><span>' + neg(x) + '</span><span>' + neg(y) + '</span></span>'; }
  var SIGNED = { keys: 'signed' }, SIGNDEC = { keys: 'signdec' };

  // ================= the topics =================
  // [parent code, title, generator, vocabulary, lesson, method, common mistakes]
  var PARTS = [
    ['N5', 'Counting with the product rule', 'hProduct', ['product rule', 'arrangement', 'combination', 'without repetition'],
      [{ say: 'If one choice can be made in m ways and a second in n ways, together they can be made in m × n ways.' },
       { say: 'Without repetition the choices shrink: 3 prizes for 8 runners can go 8 × 7 × 6 = 336 ways.' }],
      ['Count the choices for each position.', 'Reduce the count when an item cannot be used twice.', 'Multiply the choices together.', 'If order does not matter (pairs), divide by 2.'],
      ['Adding the choices instead of multiplying.', 'Forgetting that a used item cannot be chosen again.', 'Counting each pair twice.']],
    ['N6', 'Estimating powers and roots', 'hEstRoot', ['estimate', 'square root', 'cube root', 'power'],
      [{ say: '√40 is between √36 = 6 and √49 = 7. 40 is closer to 36, so √40 is about 6.3.' },
       { say: 'To estimate 2.98³, round first: 3³ = 27.' }],
      ['Find the square or cube numbers either side.', 'Decide which one it is closer to.', 'For powers of decimals, round the base first.'],
      ['Halving instead of square rooting.', 'Thinking √40 must be 6.5 because it is halfway.']],
    ['N7', 'Fractional and negative indices', 'hFracIndex', ['fractional index', 'root', 'reciprocal', 'negative index'],
      [{ say: 'A power of ½ means square root, and a power of ⅓ means cube root. So 27 to the power ⅓ is 3.' },
       { say: 'For 8 to the power ⅔: take the cube root (2), then square it (4). A negative power means one over it.' }],
      ['The bottom of the fraction is the root.', 'The top of the fraction is the power.', 'Take the root first, because the numbers stay small.', 'A negative index means the reciprocal.'],
      ['Thinking 16 to the power ½ is 8.', 'Thinking a negative power gives a negative answer.']],
    ['N8', 'Surds', 'hSurds', ['surd', 'simplify', 'rationalise', 'denominator'],
      [{ say: 'A surd is a root that is not a whole number, such as √2. Simplify using square factors: √48 = √16 × √3 = 4√3.' },
       { say: 'To rationalise 6/√3, multiply the top and bottom by √3: 6√3/3 = 2√3.' }],
      ['Find the largest square factor.', 'Take its square root outside.', 'Add or subtract only like surds (the same root).', 'Rationalise by multiplying top and bottom by the surd.'],
      ['Writing √12 + √3 = √15.', 'Using a square factor that is not the largest, e.g. √48 = 2√12.']],
    ['N10', 'Recurring decimals to fractions', 'hRecurring', ['recurring decimal', 'dot notation', 'equation', 'simplest form'],
      [{ say: 'Dots mark the digits that repeat. Let x = 0.272727… Then 100x = 27.2727…, and 100x − x = 27.' },
       { say: 'So 99x = 27, and x = 27/99 = 3/11.' }],
      ['Call the decimal x.', 'Multiply by 10, 100 or 1,000 to line up the repeating part.', 'Subtract to remove the repeating part.', 'Solve and simplify.'],
      ['Multiplying by the wrong power of 10.', 'Forgetting to simplify the fraction.']],
    ['N16', 'Bounds in calculations', 'hBoundsCalc', ['upper bound', 'lower bound', 'calculation', 'degree of accuracy'],
      [{ say: 'To find the upper bound of a − b, use the largest a and the smallest b.' },
       { say: 'For a ÷ b, the upper bound is the largest a divided by the smallest b.' }],
      ['Write down the bounds of each value.', 'Decide which bound makes the answer biggest or smallest.', 'Calculate with those bounds.'],
      ['Using the upper bound of b for the upper bound of a − b.', 'Using ±1 instead of ± half a unit.']],
    ['A4', 'Harder expanding and factorising', 'hAlgFrac', ['factorise', 'quadratic', 'algebraic fraction', 'three binomials'],
      [{ say: 'To factorise 2x² + 7x + 3, find two numbers that multiply to 2 × 3 = 6 and add to 7: 6 and 1.' },
       { say: 'Split the middle: 2x² + 6x + x + 3 = 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3).' }],
      ['Multiply a by c.', 'Find two numbers with that product that add to b.', 'Split the middle term and factorise in pairs.', 'To simplify a fraction, factorise and cancel a common bracket.'],
      ['Cancelling terms instead of whole brackets.', 'Losing a sign when expanding three brackets.']],
    ['A6', 'Algebraic proof', 'hProof', ['proof', 'even', 'odd', 'consecutive', 'multiple'],
      [{ say: 'Let n be any whole number. Then 2n is always even and 2n + 1 is always odd.' },
       { say: 'To prove something is always a multiple of 8, show that it can be written as 8 × (a whole number).' }],
      ['Write each number using n.', 'Expand and simplify.', 'Take out the factor you need.', 'Explain what it shows.'],
      ['Testing a few numbers and calling it a proof.', 'Using n and n for two different numbers.']],
    ['A7', 'Inverse and composite functions', 'hInvComp', ['inverse function', 'composite function', 'f⁻¹(x)', 'fg(x)'],
      [{ say: 'fg(x) means do g first, then f. If f(x) = 2x and g(x) = x + 1, then fg(3) = f(4) = 8.' },
       { say: 'To find f⁻¹(x), write y = f(x), swap to make x the subject, then rename.' }],
      ['For fg, work from the right: g first.', 'For an inverse, undo each step in reverse order.', 'Check: f(f⁻¹(x)) should give x.'],
      ['Doing f first in fg(x).', 'Thinking f⁻¹(x) means 1 ÷ f(x).']],
    ['A9', 'Perpendicular lines', 'hPerp', ['perpendicular', 'gradient', 'negative reciprocal', 'y = mx + c'],
      [{ say: 'Perpendicular lines meet at right angles. Their gradients multiply to −1.' },
       { say: 'If one line has gradient 3, a perpendicular line has gradient −⅓ (the negative reciprocal).' }],
      ['Find the gradient of the given line.', 'Flip it and change its sign.', 'Substitute the point to find c.'],
      ['Changing only the sign, or only flipping.', 'Using the original gradient by mistake.']],
    ['A11', 'Completing the square', 'hCompSq', ['completing the square', 'turning point', 'minimum', 'vertex'],
      [{ say: 'x² + 6x + 5 = (x + 3)² − 9 + 5 = (x + 3)² − 4. Halve the 6 to get 3.' },
       { say: 'The turning point of y = (x + 3)² − 4 is (−3, −4).' }],
      ['Halve the coefficient of x.', 'Square it and subtract it.', 'Read the turning point: change the sign inside the bracket.', 'If x² has a number in front, take it out first.'],
      ['Adding the square instead of subtracting it.', 'Giving the turning point as (3, −4).']],
    ['A12', 'Exponential and trigonometric graphs', 'hTrigGraph', ['exponential', 'sine', 'cosine', 'tangent', 'period'],
      [{ say: 'y = sin x and y = cos x repeat every 360° and stay between −1 and 1. y = tan x repeats every 180°.' },
       { say: 'y = 2ˣ is an exponential graph: it passes through (0, 1) and doubles for each step to the right.' }],
      ['Sketch the graph over the range given.', 'Use symmetry to find more solutions.', 'For y = abˣ, remember b to the power 0 is 1.'],
      ['Forgetting the second solution between 0° and 360°.', 'Thinking 2 to the power −1 is −2.']],
    ['A14', 'Exponential growth and decay graphs', 'hExpModel', ['exponential growth', 'exponential decay', 'multiplier', 'model'],
      [{ say: 'Growth by the same multiplier each step gives an exponential graph, such as a number doubling every hour.' },
       { say: 'A value that falls by 20% each year is multiplied by 0.8 each year.' }],
      ['Find the multiplier for one step.', 'Raise it to the number of steps.', 'For "first year below", work year by year.'],
      ['Subtracting 20% of the original value every year.', 'Multiplying by the number of years instead of using a power.']],
    ['A18', 'The quadratic formula and completing the square', 'hQuadFormula', ['quadratic formula', 'discriminant', 'completing the square', 'exact'],
      [{ say: 'For ax² + bx + c = 0, x = (−b ± √(b² − 4ac)) ÷ 2a.' },
       { say: 'Rearrange so one side is 0 before you start. Completing the square gives exact answers like −3 ± √7.' }],
      ['Rearrange to ax² + bx + c = 0.', 'Write down a, b and c with their signs.', 'Work out b² − 4ac first.', 'Find both solutions.'],
      ['Writing −b² instead of b² when b is negative.', 'Dividing only the square root by 2a.']],
    ['A19', 'Linear and quadratic simultaneous equations', 'hLinQuad', ['simultaneous', 'substitute', 'intersection', 'quadratic'],
      [{ say: 'To solve y = x² and y = x + 2, substitute: x² = x + 2. Rearrange to x² − x − 2 = 0, so x = 2 or x = −1.' },
       { say: 'Each x-value gives a point: put it into the linear equation to find y.' }],
      ['Substitute the linear equation into the quadratic.', 'Rearrange to = 0 and solve.', 'Find y for each x.', 'Pair the values up.'],
      ['Finding only one solution.', 'Mixing up which y goes with which x.']],
    ['A22', 'Quadratic inequalities and set notation', 'hQuadIneq', ['quadratic inequality', 'set notation', 'critical values', 'union'],
      [{ say: 'Solve (x − 1)(x − 5) < 0. The graph is below the x-axis between the roots, so 1 < x < 5.' },
       { say: 'For > 0 the answer is in two parts: {x : x < 1} ∪ {x : x > 5}.' }],
      ['Find the roots (critical values).', 'Sketch the curve.', 'Below the axis: between the roots. Above: outside them.'],
      ['Solving x² < 9 as x < ±3.', 'Writing a two-part answer as one inequality.']],
    ['A24', 'Geometric and other sequences', 'hGeoSeq', ['geometric sequence', 'common ratio', 'surd', 'Fibonacci-type'],
      [{ say: 'In a geometric sequence you multiply by the same number each time, e.g. 3, 6, 12, 24 (ratio 2).' },
       { say: 'The ratio can be a surd: 2, 2√3, 6, 6√3, 18 multiplies by √3 each time.' }],
      ['Divide a term by the one before to find the ratio.', 'Multiply on to find more terms.', 'The nth term is a × r to the power (n − 1).'],
      ['Adding instead of multiplying.', 'Using the power n instead of n − 1.']],
    ['A25', 'The nth term of quadratic sequences', 'hQuadNth', ['quadratic sequence', 'second difference', 'nth term', 'coefficient'],
      [{ say: 'If the second differences are all the same, the sequence is quadratic. Half the second difference is the number in front of n².' },
       { say: 'Subtract the an² part from each term; what is left is a linear sequence.' }],
      ['Find the first and second differences.', 'Halve the second difference to get a.', 'Subtract an² and find the linear part.'],
      ['Using the second difference itself as a.', 'Subtracting the wrong square numbers.']],
    ['R13', 'Proportion equations', 'hProportion', ['direct proportion', 'inverse proportion', 'constant of proportionality', 'k'],
      [{ say: '"y is proportional to x²" means y = kx². Use a pair of values to find k.' },
       { say: '"y is inversely proportional to x" means y = k/x: as x gets bigger, y gets smaller.' }],
      ['Write the equation with k.', 'Substitute the values you know and find k.', 'Use the equation to find the missing value.'],
      ['Using y = kx when the question says x².', 'Multiplying instead of dividing for inverse proportion.']],
    ['R16', 'Iterative processes', 'hIterate', ['iteration', 'model', 'term', 'growth'],
      [{ say: 'An iterative formula gives the next value from the one before, e.g. Pₙ₊₁ = 1.2Pₙ − 50.' },
       { say: 'Start with P₀, use it to find P₁, then use P₁ to find P₂, and so on.' }],
      ['Put the starting value into the formula.', 'Use each answer as the next input.', 'Keep full accuracy until the end.'],
      ['Using P₀ every time instead of the latest value.', 'Rounding too early.']],
    ['G7', 'Negative scale factors', 'hNegEnlarge', ['enlargement', 'negative scale factor', 'centre of enlargement', 'image'],
      [{ say: 'A negative scale factor puts the image on the other side of the centre, upside down.' },
       { say: 'From the centre to a point is (2, 1). With scale factor −3, go (−6, −3) from the centre instead.' }],
      ['Find the vector from the centre to the point.', 'Multiply it by the scale factor.', 'Add it to the centre.'],
      ['Measuring from the origin when the centre is somewhere else.', 'Ignoring the minus sign.']],
    ['G19', 'Areas and volumes of similar shapes', 'hSimilarAV', ['similar', 'scale factor', 'area factor', 'volume factor'],
      [{ say: 'If lengths are multiplied by k, areas are multiplied by k² and volumes by k³.' },
       { say: 'If the areas are in the ratio 4 : 9, the lengths are in the ratio 2 : 3, so the volumes are 8 : 27.' }],
      ['Find the length scale factor.', 'Square it for area; cube it for volume.', 'From an area ratio, square root first.'],
      ['Using the length factor for areas or volumes.', 'Squaring when you should cube.']],
    ['G20', 'Pythagoras and trigonometry in 3-D', 'h3DPyth', ['3-D', 'space diagonal', 'cuboid', 'angle with a plane'],
      [{ say: 'The longest diagonal of a cuboid is √(l² + w² + h²): Pythagoras twice.' },
       { say: 'For the angle with the base, use the right-angled triangle made by the height and the base diagonal.' }],
      ['Find the diagonal of the base first.', 'Use it with the height in a second triangle.', 'Use tan, sin or cos for the angle.'],
      ['Using a face diagonal as the space diagonal.', 'Choosing the wrong right-angled triangle for the angle.']],
    ['G25', 'Vector arguments and proof', 'hVectorArg', ['vector', 'parallel', 'collinear', 'ratio', 'column vector'],
      [{ say: 'Two vectors are parallel if one is a multiple of the other.' },
       { say: 'To get from O to a point P on AB, go to A then part of the way along AB: OP = OA + t AB.' }],
      ['Write each route as a sum of known vectors.', 'AB = b − a.', 'Parallel means one vector is a number times the other.'],
      ['Writing AB = a − b.', 'Adding vectors in the wrong direction.']],
    ['S4', 'Box plots and quartiles', 'hBoxPlot', ['box plot', 'quartile', 'inter-quartile range', 'outlier'],
      [{ say: 'Put the data in order. The median is in the middle; the lower and upper quartiles are a quarter and three quarters of the way.' },
       { say: 'The inter-quartile range is the upper quartile minus the lower quartile.' }],
      ['Order the data.', 'Find the median, then the middle of each half.', 'IQR = UQ − LQ.', 'An outlier is more than 1.5 × IQR beyond a quartile.'],
      ['Not ordering the data first.', 'Using the range instead of the IQR.']]
  ];
  PARTS.forEach(function (p) {
    var code = p[0], c = C[code], yr = /^[NAP]/.test(code) ? 10 : 11, cur = OM.CURRICULUM['Y' + yr], parent = OM.objectiveIndex['Y' + yr + '-' + code];
    var ob = { id: 'Y' + yr + '-' + code + 'H', gcse: code, tier: 'H', hpart: true, statement: c.text, title: p[1], gens: [p[2]], vocab: p[3], intro: p[4], method: p[5], mistakes: p[6],
      focus: 'Higher tier part of this statement: ' + c.higher + '.', region: parent.region, year: yr };
    cur.regions.forEach(function (r) { var i = r.objectives.indexOf(parent); if (i >= 0) r.objectives.splice(i + 1, 0, ob); });
    OM.objectiveIndex[ob.id] = ob;
  });

  // ================= N5 the product rule =================
  var DRULE = [
    ['the first digit cannot be 0', function (i, n, d) { return i > 0 || d > 0; }],
    ['the last digit must be even', function (i, n, d) { return i < n - 1 || d % 2 === 0; }],
    ['every digit must be odd', function (i, n, d) { return d % 2 === 1; }],
    ['the first digit must be 5 or more', function (i, n, d) { return i > 0 || d >= 5; }],
    ['the first and last digits cannot be 0', function (i, n, d) { return (i > 0 && i < n - 1) || d > 0; }]];
  var WORDS = ['MATHS', 'CLOUD', 'PRIDE', 'FRIEND', 'NUMBER', 'PLANET', 'SQUARE', 'TRIANGLE'];
  gc({ id: 'hProduct', objective: 'Y10-N5H', title: 'The product rule for counting', levels: {
    1: { make: function (r) { var n = r.int(2, 4), k = r.int(0, DRULE.length - 1), rule = DRULE[k], ch = [], tot = 1, what = r.pick(['A PIN', 'A lock code', 'A door code']);
      for (var i = 0; i < n; i++) { var c = 0; for (var d = 0; d < 10; d++) if (rule[1](i, n, d)) c++; ch.push(c); tot *= c; }
      return K.int(what + ' has ' + n + ' digits, each from 0 to 9. Digits can be repeated, but ' + rule[0] + '. How many different codes are possible?', tot, { hint: 'Count the choices for each digit, then multiply them.', params: { n: n, k: k }, sol: ['Choices for each digit: ' + ch.join(' × ') + '.', 'Total: ' + fmt(tot) + ' codes.'] }); },
      verify: function (q) { var p = q.params, rule = DRULE[p.k], c = 0, lim = Math.pow(10, p.n);
        for (var v = 0; v < lim; v++) { var s = String(v); while (s.length < p.n) s = '0' + s; if (s.split('').every(function (ch, i) { return rule[1](i, p.n, +ch); })) c++; }
        return c === q.check.value; } },
    2: { make: function (r) { var c = r.pick([['runners in a race', 'gold, silver and bronze be awarded', 3], ['people in a club', 'a chair, a secretary and a treasurer be chosen', 3], ['students in a team', 'a captain and a vice-captain be chosen', 2], ['films on a list', 'a first, second and third favourite be chosen', 3], ['songs', 'the first and second songs of a concert be chosen', 2], ['horses in a race', 'the first four places be filled', 4]]), n = r.int(5, 12), k = c[2], f = [], tot = 1;
      for (var i = 0; i < k; i++) { f.push(n - i); tot *= n - i; }
      return K.int('There are ' + n + ' ' + c[0] + '. In how many different ways can ' + c[1] + '? (No one can be chosen twice.)', tot, { hint: 'There are ' + n + ' choices for the first place, then one fewer for each place after that.', params: { n: n, k: k }, sol: [f.join(' × ') + ' = ' + fmt(tot) + '.'] }); },
      verify: function (q) { var p = q.params, c = 0; (function go(used, d) { if (d === p.k) { c++; return; } for (var i = 0; i < p.n; i++) if (used.indexOf(i) < 0) go(used.concat(i), d + 1); })([], 0); return c === q.check.value; } },
    3: { make: function (r) {
      if (r.chance(0.3)) { var w = r.pick(WORDS), n0 = w.length, f = [], t = 1; for (var i = n0; i >= 1; i--) { f.push(i); t *= i; }
        return K.int('How many different arrangements are there of all the letters of the word <b>' + w + '</b>? (Every letter is different.)', t, { hint: 'There are ' + n0 + ' choices for the first letter, ' + (n0 - 1) + ' for the second, and so on.', params: { k: 'arr', n: n0 }, sol: [f.join(' × ') + ' = ' + fmt(t) + '.'] }); }
      var c = r.pick(['people each shake hands once with every other person. How many handshakes are there?', 'teams in a league each play every other team once. How many matches are played?', 'pizza toppings are on offer. In how many ways can you choose 2 different toppings?', 'points lie on a circle. How many straight lines can be drawn joining two of the points?']), n = r.int(5, 30), tot = n * (n - 1) / 2;
      return K.int(n + ' ' + c, tot, { hint: 'Each of the ' + n + ' can pair with ' + (n - 1) + ' others, but that counts every pair twice.', params: { k: 'pairs', n: n }, sol: [n + ' × ' + (n - 1) + ' = ' + n * (n - 1) + ' counts every pair twice.', n * (n - 1) + ' ÷ 2 = ' + tot + '.'] }); },
      verify: function (q) { var p = q.params, c = 0, i, j;
        if (p.k === 'pairs') { for (i = 0; i < p.n; i++) for (j = i + 1; j < p.n; j++) c++; return c === q.check.value; }
        (function go(used) { if (used.length === p.n) { c++; return; } for (var i2 = 0; i2 < p.n; i2++) if (used.indexOf(i2) < 0) go(used.concat(i2)); })([]); return c === q.check.value; } } } });

  // ================= N6 estimating powers and roots =================
  gc({ id: 'hEstRoot', objective: 'Y10-N6H', title: 'Estimating powers and roots', levels: {
    1: { make: function (r) { var n; do n = r.int(5, 200); while (isSq(n)); var s = Math.sqrt(n), k = Math.floor(s);
      return K.range('Without a calculator, estimate <b>√' + n + '</b> to 1 decimal place.', round(s - 0.15, 2), round(s + 0.15, 2), { hint: 'Which square numbers is ' + n + ' between? Is it nearer the smaller or the larger one?', params: { n: n }, answer: String(round(s, 1)), sol: [k + '² = ' + k * k + ' and ' + (k + 1) + '² = ' + (k + 1) * (k + 1) + ', so √' + n + ' is between ' + k + ' and ' + (k + 1) + '.', n + ' is ' + (n - k * k) + ' of the ' + (2 * k + 1) + ' steps from ' + k * k + ', so √' + n + ' ≈ ' + round(s, 1) + '.'] }); },
      verify: function (q) { var s = Math.sqrt(q.params.n); return +q.check.lo <= s && s <= +q.check.hi && +q.check.hi - +q.check.lo < 0.31; } },
    2: { make: function (r) { var n, a; do { n = r.int(10, 999); a = Math.floor(Math.cbrt(n) + 1e-9); } while (a * a * a === n);
      return K.multi('<b>∛' + n + '</b> lies between which two consecutive whole numbers?', '{0} and {1}', [{ kind: 'int', value: a }, { kind: 'int', value: a + 1 }], { hint: 'List cube numbers: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1,000.', params: { n: n }, answer: a + ' and ' + (a + 1), sol: [a + '³ = ' + a * a * a + ' and ' + (a + 1) + '³ = ' + fmt((a + 1) * (a + 1) * (a + 1)) + '.', 'So ∛' + n + ' is between ' + a + ' and ' + (a + 1) + '.'] }); },
      verify: function (q) { var n = q.params.n, a = q.check.parts[0].value, b = q.check.parts[1].value; return b === a + 1 && a * a * a < n && n < b * b * b; } },
    3: { make: function (r) { var k = r.int(2, 9), p = r.int(2, 4), d = r.pick([-4, -3, -2, -1, 1, 2, 3, 4]), x = (k * 100 + d) / 100, xs = x.toFixed(2);
      var vals = [Math.pow(k, p), k * p, Math.pow(k, p - 1), Math.pow(k + 1, p), 10 * Math.pow(k, p), Math.pow(k, p + 1)], opts = [];
      vals.forEach(function (v) { if (opts.indexOf(v) < 0 && opts.length < 4) opts.push(v); });
      return K.choice('Which is the best estimate of <b>' + xs + SUP[p] + '</b>?', r.shuffle(opts.map(fmt)), fmt(Math.pow(k, p)), { hint: 'Round ' + xs + ' to the nearest whole number first.', params: { x: x, p: p, opts: opts }, sol: [xs + ' ≈ ' + k + '.', k + SUP[p] + ' = ' + fmt(Math.pow(k, p)) + '.'] }); },
      verify: function (q) { var p = q.params, t = Math.pow(p.x, p.p), best = p.opts.slice().sort(function (a, b) { return Math.abs(a - t) - Math.abs(b - t); })[0]; return +q.check.value.replace(/,/g, '') === best; } } } });

  // ================= N7 fractional indices =================
  function pw(b, e) { return '<b>' + b + '<sup>' + e + '</sup></b>'; }
  gc({ id: 'hFracIndex', objective: 'Y10-N7H', title: 'Fractional and negative indices', levels: {
    1: { make: function (r) {
      if (r.chance(0.35)) { var a, b; do { a = r.int(1, 9); b = r.int(2, 10); } while (OM.gcd(a, b) !== 1);
        return K.num('Work out ' + pw('(' + a * a + '/' + b * b + ')', '1/2') + '.', a + '/' + b, { hint: 'A power of ½ means square root: root the top and the bottom.', params: { bn: a * a, bd: b * b, en: 1, ed: 2 }, sol: ['√' + a * a + ' = ' + a + ' and √' + b * b + ' = ' + b + ', so the answer is ' + a + '/' + b + '.'] }); }
      var q2 = r.pick([2, 2, 3]), rt = q2 === 2 ? r.int(2, 15) : r.int(2, 10), base = Math.pow(rt, q2);
      return K.num('Work out ' + pw(fmt(base), '1/' + q2) + '.', String(rt), { hint: 'A power of 1/' + q2 + ' means the ' + (q2 === 2 ? 'square' : 'cube') + ' root.', params: { bn: base, bd: 1, en: 1, ed: q2 }, sol: [(q2 === 2 ? '√' : '∛') + fmt(base) + ' = ' + rt + ', because ' + rt + (q2 === 2 ? '²' : '³') + ' = ' + fmt(base) + '.'] }); },
      verify: function (q) { var p = q.params; return Math.abs(A.num(A.parseQ(asc(q.check.value))) - Math.pow(p.bn / p.bd, p.en / p.ed)) < 1e-9; } },
    2: { make: function (r) { var c = r.pick([[2, 3], [3, 2], [2, 5], [4, 3], [3, 4], [5, 2]]), e = c[0], rq = c[1], rt = r.int(2, rq === 2 ? 9 : rq === 3 ? 6 : rq === 4 ? 3 : 2), base = Math.pow(rt, rq), ans = Math.pow(rt, e);
      return K.num('Work out ' + pw(fmt(base), e + '/' + rq) + '.', String(ans), { hint: 'Take the root first (the bottom number, ' + rq + '), then raise to the power ' + e + '.', params: { bn: base, bd: 1, en: e, ed: rq }, sol: ['Root ' + rq + ' of ' + fmt(base) + ' is ' + rt + '.', rt + ' to the power ' + e + ' = ' + fmt(ans) + '.'] }); },
      verify: function (q) { var p = q.params; return Math.abs(A.num(A.parseQ(asc(q.check.value))) / Math.pow(p.bn / p.bd, p.en / p.ed) - 1) < 1e-9; } },
    3: { make: function (r) {
      if (r.chance(0.4)) { var a, b; do { a = r.int(1, 7); b = r.int(2, 9); } while (OM.gcd(a, b) !== 1 || a === b);
        return K.num('Work out ' + pw('(' + a * a + '/' + b * b + ')', '−1/2') + '.', qt(b, a), { hint: 'The negative power flips the fraction; the power ½ square roots it.', params: { bn: a * a, bd: b * b, en: -1, ed: 2 }, sol: ['Flip: (' + b * b + '/' + a * a + ') to the power ½.', 'Square root the top and bottom: ' + qt(b, a) + '.'] }); }
      var c = r.pick([[1, 2], [3, 2], [2, 3], [1, 3], [3, 4]]), rt = r.int(2, c[1] === 2 ? 9 : c[1] === 3 ? 5 : 3), base = Math.pow(rt, c[1]), den = Math.pow(rt, c[0]);
      return K.num('Work out ' + pw(fmt(base), '−' + c[0] + '/' + c[1]) + '. Give your answer as a fraction.', '1/' + den, { hint: 'The minus sign means one over. Then root (' + c[1] + ') and power (' + c[0] + ').', params: { bn: base, bd: 1, en: -c[0], ed: c[1] }, sol: [fmt(base) + ' to the power ' + c[0] + '/' + c[1] + ' = ' + fmt(den) + '.', 'The negative index gives 1/' + fmt(den) + '.'] }); },
      verify: function (q) { var p = q.params; return Math.abs(A.num(A.parseQ(asc(q.check.value))) / Math.pow(p.bn / p.bd, p.en / p.ed) - 1) < 1e-9; } } } });

  // ================= N8 surds =================
  var SQF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];
  function surdParts(a, b, hint, o) { return K.multi(o.prompt, '{0}√{1}', [{ kind: 'int', value: a }, { kind: 'int', value: b }], { blanks: [{ keys: 'digits', small: true }, { keys: 'digits', small: true }], hint: hint, params: o.params, answer: a + '√' + b, sol: o.sol }); }
  gc({ id: 'hSurds', objective: 'Y10-N8H', title: 'Surds', levels: {
    1: { make: function (r) { var a = r.int(2, 9), b = r.pick(SQF), n = a * a * b;
      return surdParts(a, b, 'Find the largest square number that is a factor of ' + n + '.', { prompt: 'Simplify <b>√' + n + '</b>. Write it as a√b, where b is as small as possible.', params: { n: n }, sol: [n + ' = ' + a * a + ' × ' + b + ', and ' + a * a + ' is a square number.', '√' + n + ' = √' + a * a + ' × √' + b + ' = ' + a + '√' + b + '.'] }); },
      verify: function (q) { var a = q.check.parts[0].value, b = q.check.parts[1].value; return a * a * b === q.params.n && surdOf(b)[0] === 1; } },
    2: { make: function (r) { var b = r.pick([2, 3, 5, 6, 7]), p = r.int(2, 6), q2 = r.int(1, 5), minus = r.chance(0.4); if (minus && q2 >= p) q2 = p - 1; if (q2 === p) q2++;
      var n1 = p * p * b, n2 = q2 * q2 * b, c = minus ? p - q2 : p + q2, t = function (k) { return k === 1 ? '√' + b : k + '√' + b; };
      if (c === 1) { minus = false; c = p + q2; }
      return surdParts(c, b, 'Simplify each surd first so that both have √' + b + '.', { prompt: 'Simplify <b>√' + n1 + (minus ? ' − ' : ' + ') + '√' + n2 + '</b>. Write it as a√b.', params: { n1: n1, n2: n2, minus: minus }, sol: ['√' + n1 + ' = ' + t(p) + ' and √' + n2 + ' = ' + t(q2) + '.', t(p) + (minus ? ' − ' : ' + ') + t(q2) + ' = ' + c + '√' + b + '.'] }); },
      verify: function (q) { var p = q.params, a = q.check.parts[0].value, b = q.check.parts[1].value; return Math.abs(a * Math.sqrt(b) - (Math.sqrt(p.n1) + (p.minus ? -1 : 1) * Math.sqrt(p.n2))) < 1e-9 && surdOf(b)[0] === 1; } },
    3: { make: function (r) {
      if (r.chance(0.4)) { var a = r.int(2, 9), b = r.pick(SQF), sg = r.chance(0.5);
        return K.int('Expand and simplify <b>(' + a + ' + √' + b + ')(' + a + ' − √' + b + ')</b>.', a * a - b, { keys: 'signed', hint: 'This is the difference of two squares: the √' + b + ' terms cancel.', params: { a: a, b: b, k: 'dots' }, sol: [a + '² − (√' + b + ')² = ' + a * a + ' − ' + b + ' = ' + neg(a * a - b) + '.'] }); }
      var b2 = r.pick([2, 3, 5, 6, 7, 10]), m = r.int(2, 9), k = m * b2;
      return surdParts(m, b2, 'Multiply the top and bottom by √' + b2 + '.', { prompt: 'Rationalise the denominator and simplify <b>' + k + '/√' + b2 + '</b>. Write it as a√b.', params: { k: k, b: b2 }, sol: [k + '/√' + b2 + ' = ' + k + '√' + b2 + '/' + b2 + '.', '= ' + m + '√' + b2 + '.'] }); },
      verify: function (q) { var p = q.params; if (p.k === 'dots') return Math.abs((p.a + Math.sqrt(p.b)) * (p.a - Math.sqrt(p.b)) - q.check.value) < 1e-9;
        var a = q.check.parts[0].value, b = q.check.parts[1].value; return Math.abs(a * Math.sqrt(b) - p.k / Math.sqrt(p.b)) < 1e-9 && surdOf(b)[0] === 1; } } } });

  // ================= N10 recurring decimals =================
  function dot(s) { return s.length === 1 ? s + '\u0307' : s[0] + '\u0307' + s.slice(1, -1) + s[s.length - 1] + '\u0307'; }
  function recur(pre, cyc, r) {
    var len = pre.length, n = +(pre + cyc) - (pre ? +pre : 0), d = (Math.pow(10, cyc.length) - 1) * Math.pow(10, len), s = simp(n, d);
    return K.frac('Write <b>0.' + pre + dot(cyc) + '</b> as a fraction in its simplest form.', s[0], s[1], { form: 'simplest', hint: 'Let x = 0.' + pre + cyc + cyc + '… Multiply by ' + fmt(Math.pow(10, len + cyc.length)) + (len ? ' and by ' + Math.pow(10, len) : '') + ', then subtract.', params: { pre: pre, cyc: cyc },
      sol: ['Let x = 0.' + pre + cyc + cyc + cyc + '…', fmt(Math.pow(10, len + cyc.length)) + 'x − ' + (len ? Math.pow(10, len) : '') + 'x = ' + n + ', so ' + fmt(d) + 'x = ' + n + '.', 'x = ' + n + '/' + fmt(d) + ' = ' + s[0] + '/' + s[1] + '.'] });
  }
  gc({ id: 'hRecurring', objective: 'Y10-N10H', title: 'Recurring decimals to fractions', levels: {
    1: { make: function (r) { var a, b; do { a = r.int(0, 9); b = r.int(0, 9); } while (a === b); return recur('', '' + a + b, r); },
      verify: function (q) { return recurOK(q); } },
    2: { make: function (r) { var a = r.int(0, 9), b; do b = r.int(1, 8); while (b === a); return recur('' + a, '' + b, r); },
      verify: function (q) { return recurOK(q); } },
    3: { make: function (r) {
      if (r.chance(0.5)) { var x, y, z; do { x = r.int(0, 9); y = r.int(0, 9); z = r.int(0, 9); } while ((x === y && y === z) || (x === 9 && y === 9 && z === 9)); return recur('', '' + x + y + z, r); }
      var a = r.int(0, 9), b, c; do { b = r.int(0, 9); c = r.int(0, 9); } while (b === c || a === c); return recur('' + a, '' + b + c, r); },
      verify: function (q) { return recurOK(q); } } } });
  function recurOK(q) { var p = q.params, n = q.check.n, d = q.check.d, want = p.pre, got = '', rem = n, i;
    while (want.length < 14) want += p.cyc;
    for (i = 0; i < 14; i++) { rem *= 10; got += Math.floor(rem / d); rem %= d; }
    return got === want.slice(0, 14) && OM.gcd(n, d) === 1 && n < d; }

  // ================= N16 bounds in calculations =================
  // v10 and u10 are the value and the unit in tenths, so the arithmetic is exact
  function bnd(v10, u10) { return [Q(2 * v10 - u10, 20), Q(2 * v10 + u10, 20)]; }
  function corners(ex, a, b) { var out = []; [a[0], a[1]].forEach(function (x) { [b[0], b[1]].forEach(function (y) { out.push(ex(A.num(x), A.num(y))); }); }); return out; }
  gc({ id: 'hBoundsCalc', objective: 'Y10-N16H', title: 'Bounds in calculations', levels: {
    1: { make: function (r) { var u = r.pick([10, 10, 1]), a10 = u === 10 ? 10 * r.int(12, 60) : r.int(50, 300), b10 = u === 10 ? 10 * r.int(3, 11) : r.int(10, 49), a = a10 / 10, b = b10 / 10, sub = r.chance(0.5), up = r.chance(0.5);
      var A0 = bnd(a10, u), B0 = bnd(b10, u), ans = sub ? A.sub(up ? A0[1] : A0[0], up ? B0[0] : B0[1]) : A.add(up ? A0[1] : A0[0], up ? B0[1] : B0[0]), acc = u === 10 ? 'to the nearest whole number' : 'to 1 decimal place';
      return K.dec('a = ' + a + ' and b = ' + b + ', both ' + acc + '. Find the <b>' + (up ? 'upper' : 'lower') + ' bound</b> of <b>a ' + (sub ? '−' : '+') + ' b</b>.', A.decText(ans), { hint: sub ? 'For a − b: the ' + (up ? 'largest' : 'smallest') + ' a and the ' + (up ? 'smallest' : 'largest') + ' b.' : 'Use the ' + (up ? 'upper' : 'lower') + ' bound of both.', params: { a: a10, b: b10, u: u, sub: sub, up: up },
        sol: ['a is between ' + A.decText(A0[0]) + ' and ' + A.decText(A0[1]) + '; b is between ' + A.decText(B0[0]) + ' and ' + A.decText(B0[1]) + '.', (up ? 'Upper' : 'Lower') + ' bound: ' + A.decText(sub ? (up ? A0[1] : A0[0]) : (up ? A0[1] : A0[0])) + (sub ? ' − ' : ' + ') + A.decText(sub ? (up ? B0[0] : B0[1]) : (up ? B0[1] : B0[0])) + ' = ' + A.decText(ans) + '.'] }); },
      verify: function (q) { var p = q.params, cs = corners(function (x, y) { return p.sub ? x - y : x + y; }, bnd(p.a, p.u), bnd(p.b, p.u)), want = p.up ? Math.max.apply(null, cs) : Math.min.apply(null, cs); return Math.abs(parseFloat(q.check.value) - want) < 1e-9; } },
    2: { make: function (r) { var a = r.int(5, 40), b = r.int(3, 30), up = r.chance(0.5), A0 = bnd(10 * a, 10), B0 = bnd(10 * b, 10), ans = A.mul(up ? A0[1] : A0[0], up ? B0[1] : B0[0]);
      return K.dec('A rectangle measures ' + a + ' cm by ' + b + ' cm, both to the nearest centimetre. Find the <b>' + (up ? 'upper' : 'lower') + ' bound</b> of its area.', A.decText(ans), { suffix: 'cm²', hint: 'Use the ' + (up ? 'upper' : 'lower') + ' bound of both lengths.', params: { a: a, b: b, up: up }, sol: ['The lengths are between ' + A.decText(A0[0]) + ' and ' + A.decText(A0[1]) + ', and between ' + A.decText(B0[0]) + ' and ' + A.decText(B0[1]) + '.', A.decText(up ? A0[1] : A0[0]) + ' × ' + A.decText(up ? B0[1] : B0[0]) + ' = ' + A.decText(ans) + ' cm².'] }); },
      verify: function (q) { var p = q.params, cs = corners(function (x, y) { return x * y; }, bnd(10 * p.a, 10), bnd(10 * p.b, 10)); return Math.abs(parseFloat(q.check.value) - (p.up ? Math.max.apply(null, cs) : Math.min.apply(null, cs))) < 1e-9; } },
    3: { make: function (r) { var d = r.int(10, 99) * 10, t = r.int(12, 60), up = r.chance(0.5), D = up ? d + 5 : d - 5, T = up ? t - 0.5 : t + 0.5, v = D / T;
      var q = K.approx('A runner travels ' + d + ' m, to the nearest 10 m, in ' + t + ' seconds, to the nearest second. Find the <b>' + (up ? 'upper' : 'lower') + ' bound</b> of the runner’s average speed. Give your answer to 2 decimal places.', v.toFixed(12), { dp: 2 }, { calc: true, suffix: 'm/s', hint: 'Speed = distance ÷ time. For the ' + (up ? 'upper' : 'lower') + ' bound use the ' + (up ? 'largest' : 'smallest') + ' distance and the ' + (up ? 'smallest' : 'largest') + ' time.', params: { d: d, t: t, up: up },
        sol: ['Distance: ' + (d - 5) + ' to ' + (d + 5) + ' m. Time: ' + (t - 0.5) + ' to ' + (t + 0.5) + ' s.', D + ' ÷ ' + T + ' = ' + v.toFixed(4) + '… = ' + A.round(v.toFixed(12), { dp: 2 }) + ' m/s.'] });
      return K.withSteps(q, [M('for ' + D + ' ÷ ' + T, [{ re: String(D) + '\\s*(÷|/)\\s*' + String(T).replace('.', '\\.') }]), A1()], { lines: [D + ' ÷ ' + T] }); },
      verify: function (q) { var p = q.params, cs = corners(function (x, y) { return x / y; }, bnd(10 * p.d, 100), bnd(10 * p.t, 10)), want = p.up ? Math.max.apply(null, cs) : Math.min.apply(null, cs); return parseFloat(A.round(q.check.final.value, { dp: 2 })) === round(want, 2); } } } });

  // ================= A4 harder factorising and algebraic fractions =================
  gc({ id: 'hAlgFrac', objective: 'Y10-A4H', title: 'Harder expanding and factorising', levels: {
    1: { make: function (r) { var a, p, q2, b; do { a = r.pick([2, 3, 5, 7]); p = r.int(-9, 9); q2 = r.int(-9, 9); b = a * q2 + p; } while (!p || !q2 || !b || OM.gcd(a, p) !== 1);
      var cs = [a, b, p * q2], ans = asc(br(a, p) + br(1, q2));
      return K.expr('Factorise <b>' + poly(cs) + '</b>.', ans, 'factorised', { placeholder: 'e.g. (2x + 1)(x + 3)', hint: 'Find two numbers that multiply to ' + a + ' × ' + neg(p * q2) + ' = ' + neg(a * p * q2) + ' and add to ' + neg(b) + '.', params: { cs: cs },
        sol: ['Two numbers with product ' + neg(a * p * q2) + ' and sum ' + neg(b) + ': ' + neg(a * q2) + ' and ' + neg(p) + '.', 'Split the middle term and factorise in pairs.', poly(cs) + ' = ' + br(a, p) + br(1, q2) + '.'] }); },
      verify: function (q) { return same(q.check.answer, poly(q.params.cs, 'x', true)) && /^\([^()]+\)\([^()]+\)$/.test(q.check.answer.replace(/\s/g, '')); } },
    2: { make: function (r) { var s = [r.int(-6, 6) || 1, r.int(-6, 6) || -2, r.int(-6, 6) || 3], a = s[0], b = s[1], c = s[2], cs = [1, a + b + c, a * b + b * c + c * a, a * b * c];
      return K.expr('Expand and simplify <b>' + br(1, a) + br(1, b) + br(1, c) + '</b>.', poly(cs, 'x', true), 'expanded', { placeholder: 'e.g. x³ + 2x² − x + 6', hint: 'Expand two of the brackets first, then multiply every term by the third bracket.', params: { s: s },
        sol: [br(1, a) + br(1, b) + ' = ' + poly([1, a + b, a * b]) + '.', '(' + poly([1, a + b, a * b]) + ')' + br(1, c) + ' = ' + poly(cs) + '.'] }); },
      verify: function (q) { var s = q.params.s; return same(q.check.answer, s.map(function (k) { return '(x + (' + k + '))'; }).join('*')) && [0, 1, 2, 3].every(function (x) { return at(q.check.answer, 'x', x) === (x + s[0]) * (x + s[1]) * (x + s[2]); }); } },
    3: { make: function (r) { var a, p, q2; do { a = r.int(1, 5); p = r.int(-9, 9); q2 = r.int(-9, 9); } while (!p || !q2 || p === a * q2);
      var cs = [a, a * q2 + p, p * q2], ans = poly([a, p], 'x', true);
      return K.expr('Simplify fully <b>(' + poly(cs) + ') ÷ ' + br(1, q2) + '</b>.', ans, 'any', { hint: 'Factorise the top. One of its brackets will be ' + br(1, q2) + '.', params: { cs: cs, q: q2 }, sol: [poly(cs) + ' = ' + br(a, p) + br(1, q2) + '.', 'Cancel ' + br(1, q2) + ' to leave ' + poly([a, p]) + '.'] }); },
      verify: function (q) { var p = q.params; return [0, 2, 5, 7].filter(function (x) { return x + p.q !== 0; }).every(function (x) { return Math.abs((p.cs[0] * x * x + p.cs[1] * x + p.cs[2]) / (x + p.q) - at(q.check.answer, 'x', x)) < 1e-9; }); } } } });

  // ================= A6 algebraic proof =================
  var PEXP = [['2n + 1', function (n) { return 2 * n + 1; }], ['2n − 1', function (n) { return 2 * n - 1; }], ['4n + 3', function (n) { return 4 * n + 3; }], ['2n + 5', function (n) { return 2 * n + 5; }], ['6n − 1', function (n) { return 6 * n - 1; }],
    ['2n', function (n) { return 2 * n; }], ['2n + 4', function (n) { return 2 * n + 4; }], ['4n − 2', function (n) { return 4 * n - 2; }], ['n(n + 1)', function (n) { return n * (n + 1); }], ['n² + n', function (n) { return n * n + n; }],
    ['3n', function (n) { return 3 * n; }], ['3n + 6', function (n) { return 3 * n + 6; }], ['6n + 3', function (n) { return 6 * n + 3; }], ['n³ − n', function (n) { return n * n * n - n; }], ['9n − 3', function (n) { return 9 * n - 3; }],
    ['4n', function (n) { return 4 * n; }], ['4n + 8', function (n) { return 4 * n + 8; }], ['8n − 4', function (n) { return 8 * n - 4; }], ['5n', function (n) { return 5 * n; }], ['5n + 10', function (n) { return 5 * n + 10; }], ['10n − 5', function (n) { return 10 * n - 5; }],
    ['n + 1', function (n) { return n + 1; }], ['n²', function (n) { return n * n; }], ['n + 2', function (n) { return n + 2; }], ['3n + 1', function (n) { return 3 * n + 1; }], ['n² + 1', function (n) { return n * n + 1; }], ['2n + 3', function (n) { return 2 * n + 3; }]];
  var PFN = {}; PEXP.forEach(function (e) { PFN[e[0]] = e[1]; });
  var PROPS = { 'always odd': function (v) { return Math.abs(v) % 2 === 1; }, 'always even': function (v) { return v % 2 === 0; }, 'always a multiple of 3': function (v) { return v % 3 === 0; }, 'always a multiple of 4': function (v) { return v % 4 === 0; }, 'always a multiple of 5': function (v) { return v % 5 === 0; } };
  function always(lab, want) { return [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7].every(function (n) { return PROPS[want](PFN[lab](n)); }); }
  gc({ id: 'hProof', objective: 'Y10-A6H', title: 'Algebraic proof', levels: {
    1: { make: function (r) { var want = r.pick(Object.keys(PROPS)), labs = PEXP.map(function (e) { return e[0]; }), good = r.pick(labs.filter(function (l) { return always(l, want); })), bad = r.shuffle(labs.filter(function (l) { return !always(l, want); })).slice(0, 3), opts = [good].concat(bad);
      return K.choice('n is any whole number. Which expression is <b>' + want + '</b>?', r.shuffle(opts.slice()), good, { hint: 'Try n = 1, 2 and 3 to rule options out, then check the one left by factorising.', params: { want: want, opts: opts }, sol: [good + ' is ' + want + '.', 'Each of the others fails for at least one value of n: try n = 1, 2 or 3.'] }); },
      verify: function (q) { var p = q.params; return always(q.check.value, p.want) && p.opts.filter(function (l) { return always(l, p.want); }).length === 1; } },
    2: { make: function (r) {
      if (r.chance(0.2)) { var k = r.int(3, 5), ev = r.chance(0.5), terms = [], cs = [0, 0]; for (var i = 0; i < k; i++) { terms.push(ev ? (i ? '(2n + ' + 2 * i + ')' : '2n') : (i ? '(n + ' + i + ')' : 'n')); cs[0] += ev ? 2 : 1; cs[1] += ev ? 2 * i : i; }
        return K.expr('The sum of ' + k + ' consecutive ' + (ev ? 'even numbers' : 'whole numbers') + ' is <b>' + terms.join(' + ') + '</b>. Simplify this expression.', poly(cs, 'n', true), 'any', { placeholder: 'e.g. 3n + 3', hint: 'Collect the n terms, then the numbers.', params: { e: terms.join(' + ') }, sol: [terms.join(' + ') + ' = ' + poly(cs, 'n') + '.', 'This is ' + cs[0] + '(n + ' + (cs[1] / cs[0]) + '), so it is always a multiple of ' + cs[0] + '.'] }); }
      var a = r.int(1, 6), b = r.int(1, 6), cs2 = [2 * (a + b), a * a - b * b];
      return K.expr('Expand and simplify <b>(n + ' + a + ')² − (n − ' + b + ')²</b>.', poly(cs2, 'n', true), 'any', { placeholder: 'e.g. 8n + 12', hint: 'Expand each square: (n + ' + a + ')² = n² + ' + 2 * a + 'n + ' + a * a + '. Be careful subtracting the second bracket.', params: { e: '(n + ' + a + ')^2 - (n - ' + b + ')^2' }, sol: ['(n² + ' + 2 * a + 'n + ' + a * a + ') − (n² − ' + 2 * b + 'n + ' + b * b + ').', '= ' + poly(cs2, 'n') + '.'] }); },
      verify: function (q) { return same(q.check.answer, q.params.e.replace(/(\d)n/g, '$1*n')) && [1, 2, 3].every(function (n) { return isFinite(at(q.check.answer, 'n', n)); }); } },
    3: { make: function (r) { var k = r.int(1, 4), a = r.int(1, 9), L = 4 * k * a, kn = k === 1 ? 'n' : k + 'n';
      return K.int('n is any positive whole number. <b>(' + kn + ' + ' + a + ')² − (' + kn + ' − ' + a + ')²</b> is always a multiple of a number. Expand and simplify to find the <b>largest</b> such number.', L, { hint: 'Expand both brackets: the n² terms and the number terms cancel.', params: { k: k, a: a }, sol: ['(' + kn + ' + ' + a + ')² − (' + kn + ' − ' + a + ')² = ' + 2 * k * a + 'n − (−' + 2 * k * a + 'n) = ' + L + 'n.', L + 'n = ' + L + ' × n, so it is always a multiple of ' + L + '.'] }); },
      verify: function (q) { var p = q.params, g = 0; for (var n = 1; n <= 12; n++) { var v = Math.pow(p.k * n + p.a, 2) - Math.pow(p.k * n - p.a, 2); g = OM.gcd(g, v); } return g === q.check.value; } } } });

  // ================= A7 inverse and composite functions =================
  gc({ id: 'hInvComp', objective: 'Y10-A7H', title: 'Inverse and composite functions', levels: {
    1: { make: function (r) { var a = r.int(2, 9), b = r.int(-12, 12) || 5, f, ans, sol;
      if (r.chance(0.6)) { f = poly([a, b]); ans = '(x' + (b < 0 ? ' + ' + -b : ' - ' + b) + ')/' + a; sol = ['y = ' + f + '. Subtract ' + neg(b) + ', then divide by ' + a + '.', 'f⁻¹(x) = (x ' + (b < 0 ? '+ ' + -b : '− ' + b) + ')/' + a + '.']; }
      else { f = '(x ' + (b < 0 ? '− ' + -b : '+ ' + b) + ')/' + a; ans = a + 'x' + (b < 0 ? ' + ' + -b : ' - ' + b); sol = ['y = ' + f + '. Multiply by ' + a + ', then subtract ' + neg(b) + '.', 'f⁻¹(x) = ' + poly([a, -b]) + '.']; }
      return K.expr('f(x) = <b>' + f + '</b>. Find <b>f⁻¹(x)</b>.', ans, 'any', { prefix: 'f⁻¹(x) =', placeholder: 'e.g. (x + 1)/2', hint: 'Undo each step of f in reverse order.', params: { f: asc(f) }, sol: sol }); },
      verify: function (q) { var f = q.params.f; return [0, 1, 3, -2].every(function (x) { return Math.abs(at(q.check.answer, 'x', at(f, 'x', x)) - x) < 1e-9; }); } },
    2: { make: function (r) { var a = r.int(2, 6), b = r.int(-9, 9) || 1, c = r.int(-9, 9) || -3, k = r.int(-4, 5), fg = r.chance(0.5), f = poly([a, b]), g = poly([1, 0, c]), ans = fg ? a * (k * k + c) + b : Math.pow(a * k + b, 2) + c;
      var inner = fg ? k * k + c : a * k + b;
      return K.int('f(x) = <b>' + f + '</b> and g(x) = <b>' + g + '</b>. Find <b>' + (fg ? 'fg' : 'gf') + '(' + neg(k) + ')</b>.', ans, { keys: 'signed', hint: (fg ? 'fg' : 'gf') + '(' + neg(k) + ') means find ' + (fg ? 'g' : 'f') + '(' + neg(k) + ') first, then put the answer into ' + (fg ? 'f' : 'g') + '.', params: { f: poly([a, b], 'x', true), g: poly([1, 0, c], 'x', true), fg: fg, k: k },
        sol: [(fg ? 'g' : 'f') + '(' + neg(k) + ') = ' + neg(inner) + '.', (fg ? 'f' : 'g') + '(' + neg(inner) + ') = ' + neg(ans) + '.'] }); },
      verify: function (q) { var p = q.params, o = p.fg ? at(p.f, 'x', at(p.g, 'x', p.k)) : at(p.g, 'x', at(p.f, 'x', p.k)); return o === q.check.value; } },
    3: { make: function (r) { var a = r.int(2, 6), b = r.int(-9, 9) || 2, c = r.int(2, 6), d = r.int(-9, 9) || -1, fg = r.chance(0.5), cs = fg ? [a * c, a * d + b] : [a * c, c * b + d];
      return K.expr('f(x) = <b>' + poly([a, b]) + '</b> and g(x) = <b>' + poly([c, d]) + '</b>. Find <b>' + (fg ? 'fg' : 'gf') + '(x)</b>, simplified.', poly(cs, 'x', true), 'any', { prefix: (fg ? 'fg' : 'gf') + '(x) =', hint: 'Replace x in ' + (fg ? 'f' : 'g') + ' with the whole of ' + (fg ? 'g' : 'f') + '(x).', params: { f: poly([a, b], 'x', true), g: poly([c, d], 'x', true), fg: fg },
        sol: [(fg ? 'f(' + poly([c, d]) + ') = ' + a + '(' + poly([c, d]) + ') ' + (b < 0 ? '− ' + -b : '+ ' + b) : 'g(' + poly([a, b]) + ') = ' + c + '(' + poly([a, b]) + ') ' + (d < 0 ? '− ' + -d : '+ ' + d)) + '.', '= ' + poly(cs) + '.'] }); },
      verify: function (q) { var p = q.params; return [-2, 0, 1, 4].every(function (x) { return at(q.check.answer, 'x', x) === (p.fg ? at(p.f, 'x', at(p.g, 'x', x)) : at(p.g, 'x', at(p.f, 'x', x))); }); } } } });

  // ================= A9 perpendicular lines =================
  function mx(n, d) { var s = n < 0 ? '−' : '', a = Math.abs(n); return s + (d === 1 ? (a === 1 ? '' : a) : OM.frac(a, d)) + 'x'; }
  gc({ id: 'hPerp', objective: 'Y10-A9H', title: 'Perpendicular lines', levels: {
    1: { make: function (r) { var m = r.pick([[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [-1, 1], [-2, 1], [-3, 1], [-4, 1], [1, 2], [1, 3], [-1, 2], [2, 3], [-3, 4], [3, 5], [-2, 5]]), c = r.int(-9, 9);
      return K.num('A line has equation <b>y = ' + mx(m[0], m[1]) + (c ? (c < 0 ? ' − ' + -c : ' + ' + c) : '') + '</b>. What is the gradient of a line <b>perpendicular</b> to it?', qt(-m[1], m[0]).replace('-', '-'), { hint: 'Flip the gradient upside down and change its sign.', params: { m: m }, sol: ['The gradient is ' + qt(m[0], m[1]).replace('-', '−') + '.', 'The negative reciprocal is ' + qt(-m[1], m[0]).replace('-', '−') + '. Check: they multiply to −1.'] }); },
      verify: function (q) { var m = q.params.m; return A.eq(A.mul(A.parseQ(asc(q.check.value)), Q(m[0], m[1])), Q(-1)); } },
    2: { make: function (r) { var m = r.pick([1, 2, 3, 4, 5, -1, -2, -3, -4]), c = r.int(-8, 8), p = m * r.int(-3, 3), q0 = r.int(-6, 6), c2 = q0 + p / m, am = Math.abs(m);
      var g = (m > 0 ? '-' : '') + 'x' + (am === 1 ? '' : '/' + am), ans = g + (c2 ? (c2 < 0 ? ' - ' + -c2 : ' + ' + c2) : '');
      return K.expr('Find the equation of the line that is perpendicular to <b>y = ' + poly([m, c]) + '</b> and passes through <b>(' + neg(p) + ', ' + neg(q0) + ')</b>.', ans, 'any', { lhs: 'y', placeholder: 'y = …', hint: 'The new gradient is the negative reciprocal of ' + m + '. Then substitute the point to find c.', params: { m: m, p: p, q: q0 },
        sol: ['Perpendicular gradient: ' + qt(-1, m).replace('-', '−') + '.', 'y = ' + qt(-1, m).replace('-', '−') + 'x + c through (' + neg(p) + ', ' + neg(q0) + '): ' + neg(q0) + ' = ' + qt(-1, m).replace('-', '−') + ' × ' + neg(p) + ' + c, so c = ' + neg(c2) + '.', 'y = ' + asc(ans).replace(/-/g, '−') + '.'] }); },
      verify: function (q) { var p = q.params, f = function (x) { return at(q.check.answer, 'x', x); }; return Math.abs(f(p.p) - p.q) < 1e-9 && Math.abs((f(p.p + 1) - f(p.p)) * p.m + 1) < 1e-9; } },
    3: { make: function (r) { var a = r.int(1, 6), b = r.pick([1, 2, 3, 4, -1, -2, -3]), s = r.pick([1, 2, -1]), yes = r.chance(0.5), d = yes ? b * s : a * s, e = yes ? -a * s : b * s + r.pick([1, 2]), c1 = r.int(1, 12), c2 = r.int(1, 12);
      if (!yes && a * d + b * e === 0) e += 1;
      var eq = function (x, y, c) { return poly([x, 0]) + (y < 0 ? ' − ' : ' + ') + (Math.abs(y) === 1 ? '' : Math.abs(y)) + 'y = ' + c; };
      return K.choice('Are the lines <b>' + eq(a, b, c1) + '</b> and <b>' + eq(d, e, c2) + '</b> perpendicular?', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], a * d + b * e === 0 ? 'yes' : 'no', { hint: 'Rearrange each into y = mx + c. Do the gradients multiply to −1?', params: { a: a, b: b, d: d, e: e },
        sol: ['Gradients: ' + qt(-a, b).replace('-', '−') + ' and ' + qt(-d, e).replace('-', '−') + '.', 'Their product is ' + qt(a * d, b * e).replace('-', '−') + (a * d + b * e === 0 ? ', which is −1, so they are perpendicular.' : ', not −1, so they are not perpendicular.')] }); },
      verify: function (q) { var p = q.params, m1 = -p.a / p.b, m2 = -p.d / p.e; return q.check.value === (Math.abs(m1 * m2 + 1) < 1e-9 ? 'yes' : 'no'); } } } });

  // ================= A11 completing the square =================
  gc({ id: 'hCompSq', objective: 'Y10-A11H', title: 'Completing the square', levels: {
    1: { make: function (r) { var p = r.int(-9, 9) || 4, q0 = r.int(-20, 20), cs = [1, 2 * p, p * p + q0];
      return K.multi('Write <b>' + poly(cs) + '</b> in the form <b>(x + p)² + q</b>. What are p and q? (They may be negative.)', 'p = {0} &nbsp; q = {1}', [{ kind: 'int', value: p }, { kind: 'int', value: q0 }], { blanks: [SIGNED, SIGNED], hint: 'p is half of ' + neg(2 * p) + '. Then q = ' + neg(p * p + q0) + ' − p².', params: { cs: cs }, answer: 'p = ' + neg(p) + ', q = ' + neg(q0),
        sol: ['Half of ' + neg(2 * p) + ' is ' + neg(p) + ': ' + poly(cs) + ' = (x ' + (p < 0 ? '− ' + -p : '+ ' + p) + ')² − ' + p * p + ' + ' + neg(p * p + q0) + '.', '= (x ' + (p < 0 ? '− ' + -p : '+ ' + p) + ')² ' + (q0 < 0 ? '− ' + -q0 : '+ ' + q0) + '.'] }); },
      verify: function (q) { var c = q.params.cs, p = q.check.parts[0].value, q0 = q.check.parts[1].value; return 2 * p === c[1] && p * p + q0 === c[2]; } },
    2: { make: function (r) { var p = r.int(-8, 8) || -3, q0 = r.int(-15, 15), cs = [1, 2 * p, p * p + q0];
      return { prompt: 'By completing the square, find the coordinates of the turning point of <b>y = ' + poly(cs) + '</b>.', input: { type: 'coord' }, check: { kind: 'coord', x: -p, y: q0 }, hint: 'Write it as (x + p)² + q. The turning point is (−p, q).', params: { cs: cs },
        solution: [S('y = (x ' + (p < 0 ? '− ' + -p : '+ ' + p) + ')² ' + (q0 < 0 ? '− ' + -q0 : '+ ' + q0) + '.'), S('The bracket is 0 when x = ' + neg(-p) + ', so the turning point is (' + neg(-p) + ', ' + neg(q0) + ').')] }; },
      verify: function (q) { var c = q.params.cs, y = function (x) { return c[0] * x * x + c[1] * x + c[2]; }, x = q.check.x; return y(x) === q.check.y && y(x - 1) === y(x + 1) && y(x - 1) > y(x); } },
    3: { make: function (r) { var a = r.int(2, 5), p = r.int(-6, 6) || 2, q0 = r.int(-20, 20), cs = [a, 2 * a * p, a * p * p + q0];
      return K.multi('Write <b>' + poly(cs) + '</b> in the form <b>a(x + p)² + q</b>.', 'a = {0} &nbsp; p = {1} &nbsp; q = {2}', [{ kind: 'int', value: a }, { kind: 'int', value: p }, { kind: 'int', value: q0 }], { blanks: [SIGNED, SIGNED, SIGNED], hint: 'Take ' + a + ' out of the first two terms: ' + a + '(x² ' + (p < 0 ? '− ' : '+ ') + Math.abs(2 * p) + 'x) ' + (cs[2] < 0 ? '− ' + -cs[2] : '+ ' + cs[2]) + '.', params: { cs: cs }, answer: 'a = ' + a + ', p = ' + neg(p) + ', q = ' + neg(q0),
        sol: [poly(cs) + ' = ' + a + '(x² ' + (p < 0 ? '− ' : '+ ') + Math.abs(2 * p) + 'x) ' + (cs[2] < 0 ? '− ' + -cs[2] : '+ ' + cs[2]) + '.', '= ' + a + '[(x ' + (p < 0 ? '− ' + -p : '+ ' + p) + ')² − ' + p * p + '] ' + (cs[2] < 0 ? '− ' + -cs[2] : '+ ' + cs[2]) + '.', '= ' + a + '(x ' + (p < 0 ? '− ' + -p : '+ ' + p) + ')² ' + (q0 < 0 ? '− ' + -q0 : '+ ' + q0) + '.'] }); },
      verify: function (q) { var c = q.params.cs, v = q.check.parts.map(function (x) { return x.value; }); return [-3, 0, 1, 5].every(function (x) { return v[0] * (x + v[1]) * (x + v[1]) + v[2] === c[0] * x * x + c[1] * x + c[2]; }); } } } });

  // ================= A12 exponential and trigonometric graphs =================
  var TFN = { sin: function (d) { return Math.sin(d * Math.PI / 180); }, cos: function (d) { return Math.cos(d * Math.PI / 180); }, tan: function (d) { return Math.tan(d * Math.PI / 180); } };
  var TRIGV = []; ['sin', 'cos', 'tan'].forEach(function (f) { [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360].forEach(function (d) {
    if (f === 'tan' && (d === 90 || d === 270)) return; var v = Math.round(TFN[f](d) * 1e9) / 1e9; if ([0, 1, -1, 0.5, -0.5].indexOf(v) >= 0) TRIGV.push([f, d, v]); }); });
  function vtext(v) { return v === 0.5 ? '1/2' : v === -0.5 ? '-1/2' : String(v); }
  gc({ id: 'hTrigGraph', objective: 'Y10-A12H', title: 'Exponential and trigonometric graphs', levels: {
    1: { make: function (r) { var t = r.pick(TRIGV), f = t[0], d = t[1];
      return K.num('Use the graph of <b>y = ' + f + ' x</b> to find the exact value of <b>' + f + ' ' + d + '°</b>.', vtext(t[2]), { visual: V.plot({ x: [0, 360], y: f === 'tan' ? [-3, 3] : [-1, 1], gx: 30, gy: f === 'tan' ? 1 : 0.5, lx: 3, fns: [{ f: function (x) { return TFN[f](x); } }], xlabel: 'x (degrees)' }), hint: 'Find ' + d + '° on the x-axis and read the height of the curve.', params: { f: f, d: d },
        sol: [f + ' ' + d + '° = ' + vtext(t[2]).replace('-', '−') + '.'] }); },
      verify: function (q) { var p = q.params; return Math.abs(TFN[p.f](p.d) - A.num(A.parseQ(asc(q.check.value)))) < 1e-9; } },
    2: { make: function (r) { var a = r.int(1, 5), b = r.int(2, 5), x = r.int(-2, 4), n = x >= 0 ? a * Math.pow(b, x) : a, d = x >= 0 ? 1 : Math.pow(b, -x), ex = a === 1 ? b + '<sup>x</sup>' : a + ' × ' + b + '<sup>x</sup>';
      return K.num('A graph has equation <b>y = ' + ex + '</b>. Find the value of y when <b>x = ' + neg(x) + '</b>.', qt(n, d), { hint: b + ' to the power 0 is 1, and a negative power means one over.', params: { a: a, b: b, x: x }, sol: ['y = ' + (a === 1 ? '' : a + ' × ') + b + ' to the power ' + neg(x) + ' = ' + qt(n, d) + '.'] }); },
      verify: function (q) { var p = q.params; return Math.abs(A.num(A.parseQ(asc(q.check.value))) - p.a * Math.pow(p.b, p.x)) < 1e-9; } },
    3: { make: function (r) { var f = r.pick(['sin', 'cos']), k = r.pick([-1, -0.5, 0, 0.3, 0.5, 0.8, 1, 1.2, -0.7]), rg = r.pick([[0, 360], [0, 720], [-180, 180]]), n = trigCount(f, k, rg);
      return K.int('How many solutions does <b>' + f + ' x = ' + String(k).replace('-', '−') + '</b> have for <b>' + neg(rg[0]) + '° ≤ x ≤ ' + rg[1] + '°</b>?', n, { visual: V.plot({ x: rg, y: [-1.5, 1.5], gx: 90, gy: 0.5, fns: [{ f: function (x) { return TFN[f](x); } }], xlabel: 'x (degrees)' }), hint: 'Imagine the line y = ' + String(k).replace('-', '−') + ' across the graph. Count where it meets the curve.', params: { f: f, k: k, rg: rg },
        sol: [Math.abs(k) > 1 ? f + ' x is never bigger than 1 or smaller than −1, so there are no solutions.' : 'The line y = ' + String(k).replace('-', '−') + ' meets the curve ' + n + ' time' + (n === 1 ? '' : 's') + ' in this range.'] }); },
      verify: function (q) { var p = q.params, c = 0; for (var d = p.rg[0]; d <= p.rg[1]; d += 0.25) { var v = TFN[p.f](d) - p.k, w = TFN[p.f](d + 0.25) - p.k; if (Math.abs(v) < 1e-12) c++; else if (d + 0.25 <= p.rg[1] && Math.abs(w) > 1e-12 && v * w < 0) c++; } return c === q.check.value; } } } });
  function trigCount(f, k, rg) { var c = 0; for (var d = rg[0]; d <= rg[1]; d++) { var v = TFN[f](d) - k, w = TFN[f](d + 1) - k; if (Math.abs(v) < 1e-9) c++; else if (d < rg[1] && Math.abs(w) > 1e-9 && v * w < 0) c++; } return c; }

  // ================= A14 exponential growth and decay =================
  gc({ id: 'hExpModel', objective: 'Y10-A14H', title: 'Exponential growth and decay', levels: {
    1: { make: function (r) { var n0 = r.int(2, 18) * 50, f = r.pick([2, 2, 3]), t = r.int(2, f === 2 ? 8 : 5), ans = n0 * Math.pow(f, t);
      return K.int('A colony of ' + n0 + ' bacteria ' + (f === 2 ? 'doubles' : 'triples') + ' in size every hour. How many bacteria are there after ' + t + ' hours?', ans, { hint: 'Multiply by ' + f + ' once for each hour: ' + n0 + ' × ' + f + ' to the power ' + t + '.', params: { n0: n0, f: f, t: t }, sol: [n0 + ' × ' + f + ' to the power ' + t + ' = ' + n0 + ' × ' + Math.pow(f, t) + ' = ' + fmt(ans) + '.'] }); },
      verify: function (q) { var p = q.params, v = p.n0; for (var i = 0; i < p.t; i++) v *= p.f; return v === q.check.value; } },
    2: { make: function (r) { var k = r.int(2, 9), a = r.int(2, 6), x1 = r.int(0, 2), x2 = x1 + 2, y1 = k * Math.pow(a, x1), y2 = k * Math.pow(a, x2);
      return K.int('The graph of <b>y = k × a<sup>x</sup></b> passes through <b>(' + x1 + ', ' + fmt(y1) + ')</b> and <b>(' + x2 + ', ' + fmt(y2) + ')</b>, where a is positive. Find <b>a</b>.', a, { hint: 'Divide the two y-values: going 2 to the right multiplies y by a².', params: { x1: x1, x2: x2, y1: y1, y2: y2 }, sol: [fmt(y2) + ' ÷ ' + fmt(y1) + ' = ' + a * a + ' = a².', 'a = √' + a * a + ' = ' + a + '.'] }); },
      verify: function (q) { var p = q.params, a = q.check.value, k = p.y1 / Math.pow(a, p.x1); return a > 0 && Math.abs(k * Math.pow(a, p.x2) - p.y2) < 1e-9 && Math.abs(k - Math.round(k)) < 1e-9; } },
    3: { make: function (r) { var P = r.int(16, 60) * 500, pc = r.pick([10, 15, 20, 25]), X = Math.round(P * r.pick([0.3, 0.4, 0.5, 0.6]) / 100) * 100, v = P, n = 0;
      while (v >= X) { v = v * (100 - pc) / 100; n++; }
      return K.int('A car costs £' + fmt(P) + '. Its value falls by ' + pc + '% each year. After how many whole years is its value first below £' + fmt(X) + '?', n, { calc: true, hint: 'Each year, multiply by ' + (100 - pc) / 100 + '. Keep going until the value is less than £' + fmt(X) + '.', params: { P: P, pc: pc, X: X }, sol: ['Value after n years: £' + fmt(P) + ' × ' + (100 - pc) / 100 + ' to the power n.', 'After ' + (n - 1) + ' years: £' + (P * Math.pow(1 - pc / 100, n - 1)).toFixed(2) + '. After ' + n + ' years: £' + (P * Math.pow(1 - pc / 100, n)).toFixed(2) + '.', 'So the answer is ' + n + ' years.'] }); },
      verify: function (q) { var p = q.params, m = 1 - p.pc / 100, n = q.check.value; return p.P * Math.pow(m, n) < p.X && p.P * Math.pow(m, n - 1) >= p.X; } } } });

  // ================= A18 the quadratic formula and completing the square =================
  function rootsQ(a, b, c) { var D = b * b - 4 * a * c; return [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)]; }
  function formulaQ(a, b, c, shown, sol0) {
    var rs = rootsQ(a, b, c), D = b * b - 4 * a * c;
    return K.multi('Solve <b>' + shown + '</b>. Give your solutions to 2 decimal places, the smaller one first.', 'x = {0} &nbsp; or &nbsp; x = {1}', [{ kind: 'approx', value: rs[0].toFixed(12), dp: 2 }, { kind: 'approx', value: rs[1].toFixed(12), dp: 2 }], { calc: true, blanks: [SIGNDEC, SIGNDEC], hint: 'Use x = (−b ± √(b² − 4ac)) ÷ 2a with a = ' + a + ', b = ' + neg(b) + ', c = ' + neg(c) + '.', params: { a: a, b: b, c: c }, answer: 'x = ' + A.round(rs[0].toFixed(12), { dp: 2 }) + ' or x = ' + A.round(rs[1].toFixed(12), { dp: 2 }),
      sol: (sol0 || []).concat(['a = ' + a + ', b = ' + neg(b) + ', c = ' + neg(c) + '. b² − 4ac = ' + neg(D) + '.', 'x = (' + neg(-b) + ' ± √' + D + ') ÷ ' + 2 * a + '.', 'x = ' + A.round(rs[0].toFixed(12), { dp: 2 }) + ' or x = ' + A.round(rs[1].toFixed(12), { dp: 2 }) + '.']) });
  }
  function rootsOK2(q) { var p = q.params, f = function (x) { return p.a * x * x + p.b * x + p.c; }, xs = q.check.parts.map(function (t) { return parseFloat(A.round(t.value, { dp: 2 })); });
    return xs[0] < xs[1] && xs.every(function (x) { var lo = x - 0.005, hi = x + 0.005; return f(lo) * f(hi) <= 0; }); }
  gc({ id: 'hQuadFormula', objective: 'Y10-A18H', title: 'The quadratic formula and completing the square', levels: {
    1: { make: function (r) { var b, c, D; do { b = r.int(-9, 9); c = r.int(-12, 12); D = b * b - 4 * c; } while (!c || D <= 0 || isSq(D)); return formulaQ(1, b, c, poly([1, b, c]) + ' = 0'); },
      verify: rootsOK2 },
    2: { make: function (r) { var a, b, c, D;
      if (r.chance(0.5)) { do { b = r.int(1, 9); c = r.int(2, 20); D = b * b + 4 * c; } while (isSq(D)); return formulaQ(1, b, -c, 'x(x + ' + b + ') = ' + c, ['Expand and rearrange: ' + poly([1, b, -c]) + ' = 0.']); }
      do { a = r.int(2, 5); b = r.int(-9, 9); c = r.int(-9, 9); D = b * b - 4 * a * c; } while (!c || D <= 0 || isSq(D)); return formulaQ(a, b, c, poly([a, b, c]) + ' = 0'); },
      verify: rootsOK2 },
    3: { make: function (r) { var p, c, q0; do { p = r.int(-7, 7); c = r.int(-15, 15); q0 = p * p - c; } while (!p || q0 <= 1 || isSq(q0) || surdOf(q0)[0] > 1);
      return K.multi('Solve <b>' + poly([1, 2 * p, c]) + ' = 0</b> by completing the square. Give your answer in the form x = a ± √b.', 'x = {0} ± √{1}', [{ kind: 'int', value: -p }, { kind: 'int', value: q0 }], { blanks: [SIGNED, { keys: 'digits', small: true }], hint: 'Write the left side as (x + ' + p + ')² + q, then rearrange.', params: { p: p, c: c }, answer: 'x = ' + neg(-p) + ' ± √' + q0,
        sol: ['(x ' + (p < 0 ? '− ' + -p : '+ ' + p) + ')² − ' + p * p + ' ' + (c < 0 ? '− ' + -c : '+ ' + c) + ' = 0.', '(x ' + (p < 0 ? '− ' + -p : '+ ' + p) + ')² = ' + q0 + ', so x ' + (p < 0 ? '− ' + -p : '+ ' + p) + ' = ±√' + q0 + '.', 'x = ' + neg(-p) + ' ± √' + q0 + '.'] }); },
      verify: function (q) { var p = q.params, a = q.check.parts[0].value, b = q.check.parts[1].value, f = function (x) { return x * x + 2 * p.p * x + p.c; }; return !isSq(b) && Math.abs(f(a + Math.sqrt(b))) < 1e-9 && Math.abs(f(a - Math.sqrt(b))) < 1e-9; } } } });

  // ================= A19 linear and quadratic simultaneous equations =================
  var TRIPLES = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
  gc({ id: 'hLinQuad', objective: 'Y10-A19H', title: 'Linear and quadratic simultaneous equations', levels: {
    1: { make: function (r) { var r1, r2; do { r1 = r.int(-6, 6); r2 = r.int(-6, 6); } while (r1 >= r2); var m = r1 + r2, c = r.int(-5, 5), k = c - r1 * r2;
      return K.multi('Solve the simultaneous equations <b>y = ' + poly([1, 0, c]) + '</b> and <b>y = ' + poly([m, k]) + '</b>. Give the x-values, smaller first.', 'x = {0} &nbsp; or &nbsp; x = {1}', [{ kind: 'int', value: r1 }, { kind: 'int', value: r2 }], { blanks: [SIGNED, SIGNED], hint: 'Set them equal: ' + poly([1, 0, c]) + ' = ' + poly([m, k]) + '. Rearrange to = 0 and factorise.', params: { m: m, k: k, c: c }, answer: 'x = ' + neg(r1) + ' or x = ' + neg(r2),
        sol: [poly([1, 0, c]) + ' = ' + poly([m, k]) + ', so ' + poly([1, -m, c - k]) + ' = 0.', '(x ' + (r1 < 0 ? '+ ' + -r1 : '− ' + r1) + ')(x ' + (r2 < 0 ? '+ ' + -r2 : '− ' + r2) + ') = 0.', 'x = ' + neg(r1) + ' or x = ' + neg(r2) + '.'] }); },
      verify: function (q) { var p = q.params, xs = q.check.parts.map(function (t) { return t.value; }); return xs[0] < xs[1] && xs.every(function (x) { return x * x + p.c === p.m * x + p.k; }); } },
    2: { make: function (r) { var r1, r2; do { r1 = r.int(-5, 5); r2 = r.int(-5, 5); } while (r1 >= r2); var m = r1 + r2, c = r.int(-4, 4), k = c - r1 * r2, y1 = m * r1 + k, y2 = m * r2 + k;
      return K.multi('Find the two points where <b>y = ' + poly([1, 0, c]) + '</b> and <b>y = ' + poly([m, k]) + '</b> meet. Give the point with the smaller x-value first.', '({0}, {1}) &nbsp; and &nbsp; ({2}, {3})', [{ kind: 'int', value: r1 }, { kind: 'int', value: y1 }, { kind: 'int', value: r2 }, { kind: 'int', value: y2 }], { blanks: [SIGNED, SIGNED, SIGNED, SIGNED], hint: 'Solve for x first, then put each x into y = ' + poly([m, k]) + '.', params: { m: m, k: k, c: c }, answer: '(' + neg(r1) + ', ' + neg(y1) + ') and (' + neg(r2) + ', ' + neg(y2) + ')',
        sol: [poly([1, -m, c - k]) + ' = 0 gives x = ' + neg(r1) + ' or x = ' + neg(r2) + '.', 'y = ' + neg(y1) + ' and y = ' + neg(y2) + '.'] }); },
      verify: function (q) { var p = q.params, v = q.check.parts.map(function (t) { return t.value; }); return v[0] < v[2] && [[v[0], v[1]], [v[2], v[3]]].every(function (pt) { return pt[1] === pt[0] * pt[0] + p.c && pt[1] === p.m * pt[0] + p.k; }); } },
    3: { make: function (r) { var t = r.pick(TRIPLES), a = t[0] * r.pick([1, -1]), b = t[1] * r.pick([1, -1]); if (r.chance(0.5)) { var s = a; a = b; b = s; }
      var R2 = t[2] * t[2], up = r.chance(0.5), x2 = up ? -b : b, k = up ? b - a : a + b, lo = Math.min(a, x2), hi = Math.max(a, x2), line = up ? poly([1, k]) : poly([-1, k]);
      return K.multi('Solve the simultaneous equations <b>x² + y² = ' + R2 + '</b> and <b>y = ' + line + '</b>. Give the x-values, smaller first.', 'x = {0} &nbsp; or &nbsp; x = {1}', [{ kind: 'int', value: lo }, { kind: 'int', value: hi }], { blanks: [SIGNED, SIGNED], hint: 'Substitute y = ' + line + ' into x² + y² = ' + R2 + ', expand and rearrange to = 0.', params: { R2: R2, up: up, k: k }, answer: 'x = ' + neg(lo) + ' or x = ' + neg(hi),
        sol: ['x² + (' + line + ')² = ' + R2 + '.', 'This simplifies to ' + poly([2, up ? 2 * k : -2 * k, k * k - R2]) + ' = 0.', 'x = ' + neg(lo) + ' or x = ' + neg(hi) + '.'] }); },
      verify: function (q) { var p = q.params, xs = q.check.parts.map(function (t) { return t.value; }); return xs[0] < xs[1] && xs.every(function (x) { var y = (p.up ? x : -x) + p.k; return x * x + y * y === p.R2; }); } } } });

  // ================= A22 quadratic inequalities =================
  function setLab(a, b, strict, outside) { var lt = strict ? '<' : '≤', gt = strict ? '>' : '≥';
    return outside ? '{x : x ' + lt + ' ' + neg(a) + '} ∪ {x : x ' + gt + ' ' + neg(b) + '}' : '{x : ' + neg(a) + ' ' + lt + ' x ' + lt + ' ' + neg(b) + '}'; }
  function inSet(lab, x) { return lab.split(' ∪ ').some(function (part) { var m = /\{x : (−?\d+) (<|≤) x (<|≤) (−?\d+)\}/.exec(part), v = function (s) { return +s.replace('−', '-'); };
    if (m) return (m[2] === '<' ? v(m[1]) < x : v(m[1]) <= x) && (m[3] === '<' ? x < v(m[4]) : x <= v(m[4]));
    m = /\{x : x (<|≤|>|≥) (−?\d+)\}/.exec(part); var c = v(m[2]); return m[1] === '<' ? x < c : m[1] === '≤' ? x <= c : m[1] === '>' ? x > c : x >= c; }); }
  gc({ id: 'hQuadIneq', objective: 'Y10-A22H', title: 'Quadratic inequalities', levels: {
    1: { make: function (r) { var k = r.int(1, 12), strict = r.chance(0.5), c = r.pick([0, 0, r.int(1, 20), -r.int(1, 9)]);
      return K.ineq('Solve <b>x² ' + (c ? (c < 0 ? '− ' + -c : '+ ' + c) + ' ' : '') + (strict ? '<' : '≤') + ' ' + neg(k * k + c) + '</b>.', String(-k), !strict, String(k), !strict, { hint: 'x² = ' + k * k + ' when x = ' + k + ' or x = −' + k + '. The graph of y = x² is below ' + k * k + ' between these.', params: { k: k, strict: strict, c: c }, answer: '−' + k + (strict ? ' < x < ' : ' ≤ x ≤ ') + k,
        sol: [(c ? 'Rearrange: x² ' + (strict ? '<' : '≤') + ' ' + k * k + '. ' : '') + 'The critical values are ±' + k + '.', 'x² is smaller between them: −' + k + (strict ? ' < x < ' : ' ≤ x ≤ ') + k + '.'] }); },
      verify: function (q) { var p = q.params, c = q.check, ok = function (x) { return p.strict ? x * x < p.k * p.k : x * x <= p.k * p.k; }, inside = function (x) { return (c.loInc ? x >= +c.lo : x > +c.lo) && (c.hiInc ? x <= +c.hi : x < +c.hi); };
        for (var x = -p.k - 2; x <= p.k + 2; x += 0.5) if (ok(x) !== inside(x)) return false; return true; } },
    2: { make: function (r) { var a, b; do { a = r.int(-8, 6); b = r.int(-6, 9); } while (a >= b); var strict = r.chance(0.5), shown = r.chance(0.5) ? br(1, -a) + br(1, -b) : poly([1, -(a + b), a * b]);
      return K.ineq('Solve <b>' + shown + ' ' + (strict ? '<' : '≤') + ' 0</b>.', String(a), !strict, String(b), !strict, { hint: 'Find where the expression is 0. The curve is a U shape, so it is below the axis between the roots.', params: { a: a, b: b, strict: strict }, answer: neg(a) + (strict ? ' < x < ' : ' ≤ x ≤ ') + neg(b),
        sol: ['Roots: x = ' + neg(a) + ' and x = ' + neg(b) + '.', 'Between the roots: ' + neg(a) + (strict ? ' < x < ' : ' ≤ x ≤ ') + neg(b) + '.'] }); },
      verify: function (q) { var p = q.params, c = q.check, f = function (x) { return (x - p.a) * (x - p.b); }, ok = function (x) { return p.strict ? f(x) < 0 : f(x) <= 0; }, inside = function (x) { return (c.loInc ? x >= +c.lo : x > +c.lo) && (c.hiInc ? x <= +c.hi : x < +c.hi); };
        for (var x = p.a - 2; x <= p.b + 2; x += 0.5) if (ok(x) !== inside(x)) return false; return true; } },
    3: { make: function (r) { var a, b; do { a = r.int(-7, 5); b = r.int(-5, 8); } while (a >= b || a === -b); var strict = r.chance(0.5), shown = poly([1, -(a + b), a * b]);
      var good = setLab(a, b, strict, true), opts = [good, setLab(a, b, strict, false), setLab(-b, -a, strict, true), setLab(a, b, !strict, true)];
      return K.choice('Solve <b>' + shown + ' ' + (strict ? '>' : '≥') + ' 0</b>. Which set is the solution?', r.shuffle(opts), good, { hint: 'Factorise to find the roots. Where is the U-shaped curve above the x-axis?', params: { a: a, b: b, strict: strict, opts: opts },
        sol: [shown + ' = ' + br(1, -a) + br(1, -b) + ', with roots ' + neg(a) + ' and ' + neg(b) + '.', 'The curve is above the axis outside the roots: ' + good + '.'] }); },
      verify: function (q) { var p = q.params, f = function (x) { return (x - p.a) * (x - p.b); }, ok = function (x) { return p.strict ? f(x) > 0 : f(x) >= 0; }, fits = function (lab) { for (var x = p.a - 3; x <= p.b + 3; x += 0.5) if (inSet(lab, x) !== ok(x)) return false; return true; };
        return fits(q.check.value) && p.opts.filter(fits).length === 1; } } } });

  // ================= A24 geometric and other sequences =================
  function rt(k, b) { return (k === 1 ? '' : fmt(k)) + '√' + b; }
  gc({ id: 'hGeoSeq', objective: 'Y10-A24H', title: 'Geometric and other sequences', levels: {
    1: { make: function (r) { var half = r.chance(0.25), rr = half ? 0.5 : r.pick([2, 3, 4, 5, -2, -3]), a = half ? 16 * r.int(1, 9) : r.int(1, 9), ts = [a];
      for (var i = 1; i < 5; i++) ts.push(ts[i - 1] * rr);
      return K.int('Find the next term of the geometric sequence <b>' + ts.slice(0, 4).map(neg).join(', ') + ', …</b>', ts[4], { keys: 'signed', hint: 'Divide a term by the one before it to find the common ratio.', params: { ts: ts.slice(0, 4) }, sol: ['Common ratio: ' + neg(ts[1]) + ' ÷ ' + neg(ts[0]) + ' = ' + String(rr).replace('-', '−') + '.', neg(ts[3]) + ' × ' + String(rr).replace('-', '−') + ' = ' + neg(ts[4]) + '.'] }); },
      verify: function (q) { var t = q.params.ts, rr = t[1] / t[0]; return t.every(function (x, i) { return !i || Math.abs(x / t[i - 1] - rr) < 1e-12; }) && Math.abs(q.check.value - t[3] * rr) < 1e-9; } },
    2: { make: function (r) { var a = r.int(1, 5), b = r.pick([2, 3, 5, 6, 7]), n = r.pick([5, 7]), ans = a * Math.pow(b, (n - 1) / 2);
      var ts = [fmt(a), rt(a, b), fmt(a * b), rt(a * b, b)];
      return K.int('The sequence <b>' + ts.join(', ') + ', …</b> is geometric. Find the <b>' + (n === 5 ? '5th' : '7th') + ' term</b>.', ans, { hint: 'The common ratio is √' + b + '. Multiplying by √' + b + ' twice is the same as multiplying by ' + b + '.', params: { a: a, b: b, n: n }, sol: ['Ratio: √' + b + '. The 3rd term is ' + a * b + ', the 5th is ' + fmt(a * b * b) + (n === 7 ? ', the 7th is ' + fmt(ans) : '') + '.'] }); },
      verify: function (q) { var p = q.params; return Math.abs(p.a * Math.pow(Math.sqrt(p.b), p.n - 1) - q.check.value) < 1e-6; } },
    3: { make: function (r) {
      if (r.chance(0.5)) { var u = [r.int(1, 9), r.int(1, 9)], n = r.int(7, 10); for (var i = 2; i < n; i++) u.push(u[i - 1] + u[i - 2]);
        return K.int('In a Fibonacci-type sequence, each term is the sum of the two terms before it. The first two terms are <b>' + u[0] + '</b> and <b>' + u[1] + '</b>. Find the <b>' + n + 'th term</b>.', u[n - 1], { hint: 'Write the terms out: add the last two each time.', params: { k: 'fib', u: u.slice(0, 2), n: n }, sol: ['Terms: ' + u.join(', ') + '.', 'The ' + n + 'th term is ' + u[n - 1] + '.'] }); }
      var a = r.int(1, 6), rr = r.pick([2, 3, -2]), n2 = r.int(5, rr === 3 ? 8 : 10), ans = a * Math.pow(rr, n2 - 1);
      return K.int('A geometric sequence has first term <b>' + a + '</b> and common ratio <b>' + neg(rr) + '</b>. Find the <b>' + n2 + 'th term</b>.', ans, { keys: 'signed', hint: 'nth term = a × r to the power (n − 1).', params: { k: 'geo', a: a, r: rr, n: n2 }, sol: [a + ' × (' + neg(rr) + ') to the power ' + (n2 - 1) + ' = ' + neg(ans) + '.'] }); },
      verify: function (q) { var p = q.params, v, i;
        if (p.k === 'fib') { var x = p.u[0], y = p.u[1]; for (i = 2; i < p.n; i++) { var z = x + y; x = y; y = z; } return y === q.check.value; }
        v = p.a; for (i = 1; i < p.n; i++) v *= p.r; return v === q.check.value; } } } });

  // ================= A25 nth term of quadratic sequences =================
  function qseq(r) { var a = r.int(1, 3), b = r.int(-6, 6), c = r.int(-6, 6), ts = []; for (var n = 1; n <= 5; n++) ts.push(a * n * n + b * n + c); return { a: a, b: b, c: c, ts: ts }; }
  function fromTerms(ts) { var a = (ts[2] - 2 * ts[1] + ts[0]) / 2, b = ts[1] - ts[0] - 3 * a, c = ts[0] - a - b; return [a, b, c]; }
  gc({ id: 'hQuadNth', objective: 'Y10-A25H', title: 'The nth term of quadratic sequences', levels: {
    1: { make: function (r) { var s = qseq(r);
      return K.int('The sequence <b>' + s.ts.map(neg).join(', ') + ', …</b> is quadratic. What is the coefficient of <b>n²</b> in its nth term?', s.a, { hint: 'Find the second differences, then halve them.', params: { ts: s.ts }, sol: ['First differences: ' + s.ts.slice(1).map(function (t, i) { return neg(t - s.ts[i]); }).join(', ') + '.', 'Second difference: ' + 2 * s.a + '. Half of it is ' + s.a + '.'] }); },
      verify: function (q) { var t = q.params.ts, d2 = t[2] - 2 * t[1] + t[0]; return t[3] - 2 * t[2] + t[1] === d2 && d2 / 2 === q.check.value; } },
    2: { make: function (r) { var s = qseq(r), lin = s.ts.map(function (t, i) { return t - s.a * (i + 1) * (i + 1); });
      return K.expr('Find the nth term of the quadratic sequence <b>' + s.ts.map(neg).join(', ') + ', …</b>', poly([s.a, s.b, s.c], 'n', true), 'any', { prefix: 'nth term =', placeholder: 'e.g. 2n² + 3n − 1', hint: 'Halve the second difference to get the n² coefficient. Subtract that many n² from each term to leave a linear sequence.', params: { ts: s.ts },
        sol: ['Second difference ' + 2 * s.a + ', so the nth term starts ' + (s.a === 1 ? '' : s.a) + 'n².', 'Subtracting ' + (s.a === 1 ? '' : s.a) + 'n² leaves ' + lin.map(neg).join(', ') + ', whose nth term is ' + poly([s.b, s.c], 'n') + '.', 'nth term: ' + poly([s.a, s.b, s.c], 'n') + '.'] }); },
      verify: function (q) { var t = q.params.ts; return t.every(function (v, i) { return at(q.check.answer, 'n', i + 1) === v; }); } },
    3: { make: function (r) { var s = qseq(r), N = r.pick([10, 12, 15, 20, 25, 30]), ans = s.a * N * N + s.b * N + s.c;
      return K.int('The sequence <b>' + s.ts.map(neg).join(', ') + ', …</b> is quadratic. Find its <b>' + N + 'th term</b>.', ans, { keys: 'signed', hint: 'Find the nth term first, then substitute n = ' + N + '.', params: { ts: s.ts, N: N }, sol: ['nth term: ' + poly([s.a, s.b, s.c], 'n') + '.', 'n = ' + N + ': ' + neg(ans) + '.'] }); },
      verify: function (q) { var p = q.params, c = fromTerms(p.ts); return c[0] * p.N * p.N + c[1] * p.N + c[2] === q.check.value; } } } });

  // ================= R13 proportion equations =================
  var PROP = { sq: ['the square of x', function (x) { return x * x; }, 'kx²'], cube: ['the cube of x', function (x) { return x * x * x; }, 'kx³'], root: ['the square root of x', function (x) { return Math.sqrt(x); }, 'k√x'],
    inv: ['x', function (x) { return x; }, 'k/x'], invsq: ['the square of x', function (x) { return x * x; }, 'k/x²'] };
  gc({ id: 'hProportion', objective: 'Y11-R13H', title: 'Proportion equations', levels: {
    1: { make: function (r) { var t = r.pick(['sq', 'cube', 'root']), P = PROP[t], k = r.int(2, 9), x1, x2;
      if (t === 'root') { x1 = Math.pow(r.int(1, 6), 2); do x2 = Math.pow(r.int(1, 12), 2); while (x2 === x1); } else { x1 = r.int(1, t === 'cube' ? 5 : 8); do x2 = r.int(1, t === 'cube' ? 8 : 15); while (x2 === x1); }
      var y1 = k * P[1](x1), y2 = k * P[1](x2);
      return K.int('y is directly proportional to ' + P[0] + '. When x = ' + x1 + ', y = ' + fmt(y1) + '. Find y when x = ' + x2 + '.', y2, { hint: 'Write y = ' + P[2] + '. Use the first pair of values to find k.', params: { t: t, x1: x1, y1: y1, x2: x2 }, sol: [fmt(y1) + ' = k × ' + fmt(P[1](x1)) + ', so k = ' + k + '.', 'y = ' + k + ' × ' + fmt(P[1](x2)) + ' = ' + fmt(y2) + '.'] }); },
      verify: function (q) { var p = q.params, f = PROP[p.t][1]; return Math.abs(q.check.value / f(p.x2) - p.y1 / f(p.x1)) < 1e-9; } },
    2: { make: function (r) { var t = r.pick(['inv', 'invsq']), P = PROP[t], x1 = r.int(1, 6), y1 = r.int(2, 20), k = y1 * P[1](x1), x2; do x2 = r.pick([2, 4, 5, 8, 10]); while (x2 === x1);
      var y2 = A.div(Q(k), Q(P[1](x2)));
      return K.dec('y is inversely proportional to ' + P[0] + '. When x = ' + x1 + ', y = ' + y1 + '. Find y when x = ' + x2 + '.', A.decText(y2), { hint: 'Write y = ' + P[2] + '. Find k by multiplying: k = y × ' + (t === 'inv' ? 'x' : 'x²') + '.', params: { t: t, x1: x1, y1: y1, x2: x2 }, sol: ['k = ' + y1 + ' × ' + P[1](x1) + ' = ' + fmt(k) + '.', 'y = ' + fmt(k) + ' ÷ ' + P[1](x2) + ' = ' + A.decText(y2) + '.'] }); },
      verify: function (q) { var p = q.params, f = PROP[p.t][1]; return Math.abs(parseFloat(q.check.value) * f(p.x2) - p.y1 * f(p.x1)) < 1e-9; } },
    3: { make: function (r) { var t = r.pick(['sq', 'cube', 'root', 'inv', 'invsq']), P = PROP[t], s = t === 'root' ? r.pick([4, 9, 16, 25]) : r.int(2, 5), inv = t === 'inv' || t === 'invsq', f = P[1](s), ans = inv ? '1/' + f : String(f);
      return K.num('y is ' + (inv ? 'inversely' : 'directly') + ' proportional to ' + P[0] + '. x is multiplied by ' + s + '. What is y multiplied by?', ans, { hint: 'y = ' + P[2] + '. Replace x with ' + s + 'x and see what happens to y.', params: { t: t, s: s }, sol: [(inv ? 'y = ' + P[2] + ': ' : 'y = ' + P[2] + ': ') + (t === 'root' ? '√' + s + ' = ' + f : s + (t === 'cube' ? '³' : t === 'inv' ? '' : '²') + ' = ' + f) + '.', 'So y is multiplied by ' + (inv ? '1/' + f + ' (it is divided by ' + f + ')' : f) + '.'] }); },
      verify: function (q) { var p = q.params, k = 7, x = 3, y = function (xx) { var v = PROP[p.t][1](xx); return p.t === 'inv' || p.t === 'invsq' ? k / v : k * v; }; return Math.abs(y(p.s * x) / y(x) - A.num(A.parseQ(asc(q.check.value)))) < 1e-9; } } } });

  // ================= R16 iterative processes =================
  function step(P, m, c) { return A.add(A.mul(P, m), Q(c)); }
  gc({ id: 'hIterate', objective: 'Y11-R16H', title: 'Iterative processes', levels: {
    1: { make: function (r) { var m = r.pick(['1.1', '1.2', '1.5', '0.9', '0.8']), c = r.int(1, 10) * 10 * r.pick([1, -1]), P0 = r.int(4, 20) * 50, M0 = A.parseQ(m), P1 = step(Q(P0), M0, c), P2 = step(P1, M0, c);
      return K.dec('The number of fish in a lake is modelled by <b>P<sub>n+1</sub> = ' + m + 'P<sub>n</sub> ' + (c < 0 ? '− ' + -c : '+ ' + c) + '</b>, where P<sub>0</sub> = ' + P0 + '. Find <b>P<sub>2</sub></b>.', A.decText(P2), { hint: 'Put P₀ in to get P₁, then put P₁ in to get P₂.', params: { m: m, c: c, P0: P0, n: 2 }, sol: ['P₁ = ' + m + ' × ' + P0 + ' ' + (c < 0 ? '− ' + -c : '+ ' + c) + ' = ' + A.decText(P1) + '.', 'P₂ = ' + m + ' × ' + A.decText(P1) + ' ' + (c < 0 ? '− ' + -c : '+ ' + c) + ' = ' + A.decText(P2) + '.'] }); },
      verify: function (q) { var p = q.params, v = p.P0; for (var i = 0; i < p.n; i++) v = parseFloat(p.m) * v + p.c; return Math.abs(parseFloat(q.check.value) - v) < 1e-6; } },
    2: { make: function (r) { var pc = r.pick([2, 3, 4, 5]), w = r.int(1, 10) * 50, P0 = r.int(20, 100) * 100, M0 = Q(100 + pc, 100), v = Q(P0), lines = [];
      for (var i = 1; i <= 3; i++) { v = step(v, M0, -w); lines.push('After year ' + i + ': £' + A.round(A.decText(v), { dp: 2 }) + '.'); }
      return K.approx('A savings account has £' + fmt(P0) + '. At the end of each year, ' + pc + '% interest is added, then £' + w + ' is taken out. How much is in the account after 3 years? Give your answer to the nearest penny.', A.decText(v), { dp: 2 }, { calc: true, prefix: '£', hint: 'Each year: multiply by ' + (1 + pc / 100) + ', then subtract ' + w + '. Do this three times.', params: { pc: pc, w: w, P0: P0 }, sol: ['Each year: new amount = ' + (1 + pc / 100) + ' × old amount − ' + w + '.'].concat(lines) }); },
      verify: function (q) { var p = q.params, m = 1 + p.pc / 100, L = p.w / (m - 1), v = Math.pow(m, 3) * (p.P0 - L) + L; return Math.abs(parseFloat(A.round(q.check.value, { dp: 2 })) - round(v, 2)) < 0.006; } },
    3: { make: function (r) { var m = r.pick(['1.1', '1.2', '1.25', '1.5']), c = r.int(1, 8) * 10, P0 = r.int(4, 20) * 50, T = P0 * r.pick([2, 3, 4, 5]), M0 = parseFloat(m), v = P0, n = 0;
      c = Math.min(c, Math.floor(P0 * (M0 - 1) / 20) * 10); // the population must grow by at least half of its natural growth
      while (v <= T) { v = M0 * v - c; n++; }
      return K.int('A population is modelled by <b>P<sub>n+1</sub> = ' + m + 'P<sub>n</sub> − ' + c + '</b>, where P<sub>0</sub> = ' + P0 + ' and n is the number of years. After how many years does the population first go above ' + fmt(T) + '?', n, { calc: true, hint: 'Use the formula again and again, keeping every digit, until the answer is above ' + fmt(T) + '.', params: { m: m, c: c, P0: P0, T: T }, sol: ['Apply the formula year by year.', 'After ' + n + ' years the population first goes above ' + fmt(T) + '.'] }); },
      verify: function (q) { var p = q.params, m = parseFloat(p.m), L = p.c / (m - 1), P = function (n) { return Math.pow(m, n) * (p.P0 - L) + L; }, n = q.check.value; return P(n) > p.T + 1e-9 && P(n - 1) <= p.T + 1e-9; } } } });

  // ================= G7 negative scale factors =================
  gc({ id: 'hNegEnlarge', objective: 'Y11-G7H', title: 'Negative scale factors', levels: {
    1: { make: function (r) { var x = r.int(-6, 6), y = r.int(-6, 6) || 2, k = r.pick([-1, -2, -3]);
      return { prompt: 'The point <b>A(' + neg(x) + ', ' + neg(y) + ')</b> is enlarged by scale factor <b>' + neg(k) + '</b>, centre the origin. Where is the image of A?', input: { type: 'coord' }, check: { kind: 'coord', x: k * x, y: k * y }, hint: 'Multiply both coordinates by ' + neg(k) + '.', params: { c: [0, 0], p: [x, y], k: k },
        solution: [S('(' + neg(x) + ' × ' + neg(k) + ', ' + neg(y) + ' × ' + neg(k) + ') = (' + neg(k * x) + ', ' + neg(k * y) + ').'), S('The image is on the opposite side of the origin.')] }; },
      verify: function (q) { return negOK(q, q.params.k); } },
    2: { make: function (r) { var a = r.int(-4, 4), b = r.int(-4, 4), dx = r.int(-3, 3), dy = r.int(-3, 3) || 1, k = r.pick([-2, -3]), x = a + dx, y = b + dy;
      return { prompt: 'The point <b>A(' + neg(x) + ', ' + neg(y) + ')</b> is enlarged by scale factor <b>' + neg(k) + '</b>, centre <b>(' + neg(a) + ', ' + neg(b) + ')</b>. Where is the image of A?', input: { type: 'coord' }, check: { kind: 'coord', x: a + k * dx, y: b + k * dy }, hint: 'Find the vector from the centre to A, multiply it by ' + neg(k) + ', then add it to the centre.', params: { c: [a, b], p: [x, y], k: k },
        solution: [S('Centre to A: (' + neg(dx) + ', ' + neg(dy) + ').'), S('× ' + neg(k) + ': (' + neg(k * dx) + ', ' + neg(k * dy) + ').'), S('Image: (' + neg(a) + ' + ' + neg(k * dx) + ', ' + neg(b) + ' + ' + neg(k * dy) + ') = (' + neg(a + k * dx) + ', ' + neg(b + k * dy) + ').')] }; },
      verify: function (q) { return negOK(q, q.params.k); } },
    3: { make: function (r) { var a = r.int(-4, 4), b = r.int(-4, 4), dx = 2 * r.int(-3, 3), dy = 2 * (r.int(-3, 3) || 1), x = a + dx, y = b + dy;
      if (r.chance(0.4)) { var k = r.pick([-2, -3, -1]); return K.num('A(' + neg(x) + ', ' + neg(y) + ') is enlarged about the centre (' + neg(a) + ', ' + neg(b) + ') to give A′(' + neg(a + k * dx) + ', ' + neg(b + k * dy) + '). What is the scale factor?', String(k), { hint: 'Compare the vectors from the centre to A and to A′.', params: { c: [a, b], p: [x, y], img: [a + k * dx, b + k * dy] }, sol: ['Centre to A: (' + neg(dx) + ', ' + neg(dy) + '). Centre to A′: (' + neg(k * dx) + ', ' + neg(k * dy) + ').', 'Scale factor: ' + neg(k) + '.'] }); }
      return { prompt: 'The point <b>A(' + neg(x) + ', ' + neg(y) + ')</b> is enlarged by scale factor <b>−½</b>, centre <b>(' + neg(a) + ', ' + neg(b) + ')</b>. Where is the image of A?', input: { type: 'coord' }, check: { kind: 'coord', x: a - dx / 2, y: b - dy / 2 }, hint: 'Halve the vector from the centre to A, reverse it, and add it to the centre.', params: { c: [a, b], p: [x, y], k: -0.5 },
        solution: [S('Centre to A: (' + neg(dx) + ', ' + neg(dy) + '). × −½: (' + neg(-dx / 2) + ', ' + neg(-dy / 2) + ').'), S('Image: (' + neg(a - dx / 2) + ', ' + neg(b - dy / 2) + ').')] }; },
      verify: function (q) { var p = q.params; if (p.img) { var k = A.num(A.parseQ(asc(q.check.value))); return p.c[0] + k * (p.p[0] - p.c[0]) === p.img[0] && p.c[1] + k * (p.p[1] - p.c[1]) === p.img[1] && k < 0; } return negOK(q, p.k); } } } });
  // the image lies on the line through the centre and A, on the other side, at |k| times the distance
  function negOK(q, k) { var p = q.params, c = p.c, u = [p.p[0] - c[0], p.p[1] - c[1]], w = [q.check.x - c[0], q.check.y - c[1]];
    return u[0] * w[1] - u[1] * w[0] === 0 && u[0] * w[0] + u[1] * w[1] < 0 && Math.abs(Math.hypot(w[0], w[1]) - Math.abs(k) * Math.hypot(u[0], u[1])) < 1e-9; }

  // ================= G19 areas and volumes of similar shapes =================
  gc({ id: 'hSimilarAV', objective: 'Y11-G19H', title: 'Areas and volumes of similar shapes', levels: {
    1: { make: function (r) { var k = r.int(2, 5), a = r.int(3, 40), big = r.chance(0.6), sh = r.pick(['triangles', 'rectangles', 'hexagons', 'logos']);
      if (big) return K.int('Two similar ' + sh + ' have lengths in the ratio 1 : ' + k + '. The smaller has an area of ' + a + ' cm². Find the area of the larger.', a * k * k, { suffix: 'cm²', hint: 'Lengths × ' + k + ' means areas × ' + k + '².', params: { k: k, a: a, big: big }, sol: ['Area scale factor: ' + k + '² = ' + k * k + '.', a + ' × ' + k * k + ' = ' + a * k * k + ' cm².'] });
      return K.int('Two similar ' + sh + ' have lengths in the ratio 1 : ' + k + '. The larger has an area of ' + a * k * k + ' cm². Find the area of the smaller.', a, { suffix: 'cm²', hint: 'Lengths ÷ ' + k + ' means areas ÷ ' + k + '².', params: { k: k, a: a * k * k, big: big }, sol: ['Area scale factor: ' + k + '² = ' + k * k + '.', a * k * k + ' ÷ ' + k * k + ' = ' + a + ' cm².'] }); },
      verify: function (q) { var p = q.params, ratio = p.big ? q.check.value / p.a : p.a / q.check.value; return Math.abs(Math.sqrt(ratio) - p.k) < 1e-9; } },
    2: { make: function (r) { var ab = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]]), n = r.int(1, 6), V1 = Math.pow(ab[0], 3) * n * r.pick([1, 2, 5]), V2 = V1 / Math.pow(ab[0], 3) * Math.pow(ab[1], 3), sol = r.pick(['bottles', 'cones', 'statues', 'boxes']);
      return K.int('Two similar ' + sol + ' have heights in the ratio ' + ab[0] + ' : ' + ab[1] + '. The smaller has a volume of ' + fmt(V1) + ' cm³. Find the volume of the larger.', V2, { suffix: 'cm³', hint: 'Volumes scale by the cube of the length ratio: ' + ab[0] + '³ : ' + ab[1] + '³.', params: { ab: ab, V1: V1 }, sol: ['Volume ratio: ' + Math.pow(ab[0], 3) + ' : ' + Math.pow(ab[1], 3) + '.', fmt(V1) + ' ÷ ' + Math.pow(ab[0], 3) + ' × ' + Math.pow(ab[1], 3) + ' = ' + fmt(V2) + ' cm³.'] }); },
      verify: function (q) { var p = q.params; return Math.abs(Math.cbrt(q.check.value / p.V1) - p.ab[1] / p.ab[0]) < 1e-9; } },
    3: { make: function (r) { var ab = r.pick([[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5], [4, 5]]), m = r.int(1, 5), n = r.int(1, 4), A1 = ab[0] * ab[0] * m, A2 = ab[1] * ab[1] * m, V1 = Math.pow(ab[0], 3) * n, V2 = Math.pow(ab[1], 3) * n;
      return K.int('Two similar solids have surface areas of ' + A1 + ' cm² and ' + A2 + ' cm². The smaller has a volume of ' + V1 + ' cm³. Find the volume of the larger.', V2, { suffix: 'cm³', hint: 'Square root the area ratio to get the length ratio, then cube it.', params: { A1: A1, A2: A2, V1: V1 }, sol: ['Area ratio ' + A1 + ' : ' + A2 + ' = ' + ab[0] * ab[0] + ' : ' + ab[1] * ab[1] + ', so lengths are ' + ab[0] + ' : ' + ab[1] + '.', 'Volumes are ' + Math.pow(ab[0], 3) + ' : ' + Math.pow(ab[1], 3) + '. ' + V1 + ' ÷ ' + Math.pow(ab[0], 3) + ' × ' + Math.pow(ab[1], 3) + ' = ' + V2 + ' cm³.'] }); },
      verify: function (q) { var p = q.params; return Math.abs(Math.pow(q.check.value / p.V1, 2 / 3) - p.A2 / p.A1) < 1e-9; } } } });

  // ================= G20 Pythagoras and trigonometry in 3-D =================
  var QUADS = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 5, 14, 15], [2, 10, 11, 15], [1, 12, 12, 17], [8, 9, 12, 17], [6, 10, 15, 19]];
  gc({ id: 'h3DPyth', objective: 'Y11-G20H', title: 'Pythagoras and trigonometry in 3-D', levels: {
    1: { make: function (r) { var t = r.pick(QUADS), s = r.int(1, 3), d = r.shuffle(t.slice(0, 3)).map(function (x) { return x * s; }), D = t[3] * s;
      return K.int('A cuboid measures ' + d[0] + ' cm by ' + d[1] + ' cm by ' + d[2] + ' cm. Find the length of the longest diagonal, from one corner to the opposite corner.', D, { suffix: 'cm', hint: 'Use √(l² + w² + h²).', params: { d: d }, sol: [d[0] + '² + ' + d[1] + '² + ' + d[2] + '² = ' + D * D + '.', '√' + D * D + ' = ' + D + ' cm.'] }); },
      verify: function (q) { var d = q.params.d, base = d[0] * d[0] + d[1] * d[1]; return base + d[2] * d[2] === q.check.value * q.check.value; } },
    2: { make: function (r) { var d = [r.int(2, 15), r.int(2, 15), r.int(2, 15)], D = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
      var q = K.approx('A box measures ' + d[0] + ' cm by ' + d[1] + ' cm by ' + d[2] + ' cm. Can a thin rod fit inside? Find the length of the longest rod that fits, to 1 decimal place.', D.toFixed(12), { dp: 1 }, { calc: true, suffix: 'cm', hint: 'The longest rod goes from one corner to the opposite corner: √(l² + w² + h²).', params: { d: d }, sol: ['Base diagonal: √(' + d[0] + '² + ' + d[1] + '²) = √' + (d[0] * d[0] + d[1] * d[1]) + '.', 'Space diagonal: √(' + (d[0] * d[0] + d[1] * d[1]) + ' + ' + d[2] + '²) = √' + (D * D).toFixed(0) + ' = ' + A.round(D.toFixed(12), { dp: 1 }) + ' cm.'] });
      return K.withSteps(q, [M('for ' + d[0] + '² + ' + d[1] + '² + ' + d[2] + '² = ' + Math.round(D * D), [{ value: String(Math.round(D * D)) }]), A1()], { lines: [d[0] + '² + ' + d[1] + '² + ' + d[2] + '² = ' + Math.round(D * D)] }); },
      verify: function (q) { var d = q.params.d, D = Math.hypot(Math.hypot(d[0], d[1]), d[2]); return parseFloat(A.round(q.check.final.value, { dp: 1 })) === round(D, 1); } },
    3: { make: function (r) { var l = r.int(3, 15), w = r.int(3, 15), h = r.int(2, 12), bd = Math.sqrt(l * l + w * w), ang = Math.atan(h / bd) * 180 / Math.PI;
      return K.approx('A cuboid has a base of ' + l + ' cm by ' + w + ' cm and a height of ' + h + ' cm. Find the angle between the longest diagonal and the base. Give your answer to 1 decimal place.', ang.toFixed(12), { dp: 1 }, { calc: true, suffix: '°', hint: 'Find the base diagonal first. Then tan θ = height ÷ base diagonal.', params: { l: l, w: w, h: h }, sol: ['Base diagonal: √(' + l + '² + ' + w + '²) = √' + (l * l + w * w) + ' = ' + bd.toFixed(3) + '… cm.', 'tan θ = ' + h + ' ÷ ' + bd.toFixed(3) + '…, so θ = ' + A.round(ang.toFixed(12), { dp: 1 }) + '°.'] }); },
      verify: function (q) { var p = q.params, D = Math.sqrt(p.l * p.l + p.w * p.w + p.h * p.h), a = Math.asin(p.h / D) * 180 / Math.PI; return parseFloat(A.round(q.check.value, { dp: 1 })) === round(a, 1); } } } });

  // ================= G25 vector arguments =================
  var VFR = { '1/2': '½', '1/3': '⅓', '2/3': '⅔', '1/4': '¼', '3/4': '¾', '2/5': '⅖', '3/5': '⅗', '1/5': '⅕', '4/5': '⅘' };
  function vco(n, d) { if (!n) return ''; var s = simp(Math.abs(n), d); return (n < 0 ? '−' : '') + (s[1] === 1 ? (s[0] === 1 ? '' : s[0]) : VFR[s[0] + '/' + s[1]]); }
  function vlab(c) { var a = vco(c[0], c[2]), b = vco(c[1], c[2]), out = '';
    if (c[0]) out = a + '<b>a</b>'; if (c[1]) out += (out ? (c[1] < 0 ? ' − ' + b.replace('−', '') : ' + ' + b) : b) + '<b>b</b>'; return out; }
  gc({ id: 'hVectorArg', objective: 'Y11-G25H', title: 'Vector arguments and proof', levels: {
    1: { make: function (r) { var a = [r.int(-6, 6), r.int(-6, 6) || 3], b = [r.int(-6, 6) || -2, r.int(-6, 6)], m = r.pick([2, 3, -1, -2]), n = r.pick([1, 2, 3, -3, -2]), res = [m * a[0] + n * b[0], m * a[1] + n * b[1]];
      var ex = (m === -1 ? '−' : neg(m)) + '<b>a</b> ' + (n < 0 ? '− ' + (n === -1 ? '' : -n) : '+ ' + (n === 1 ? '' : n)) + '<b>b</b>';
      return K.multi('<b>a</b> = ' + cv(a[0], a[1]) + ' and <b>b</b> = ' + cv(b[0], b[1]) + '. Work out ' + ex + ' as a column vector.', '<span class="cvec">{0}{1}</span>', [{ kind: 'int', value: res[0] }, { kind: 'int', value: res[1] }], { blanks: [{ keys: 'signed', small: true }, { keys: 'signed', small: true }], hint: 'Multiply each vector by its number, then add the top numbers and the bottom numbers.', params: { a: a, b: b, m: m, n: n }, answer: '(' + neg(res[0]) + ', ' + neg(res[1]) + ')',
        sol: ['Top: ' + neg(m) + ' × ' + neg(a[0]) + ' + ' + neg(n) + ' × ' + neg(b[0]) + ' = ' + neg(res[0]) + '.', 'Bottom: ' + neg(m) + ' × ' + neg(a[1]) + ' + ' + neg(n) + ' × ' + neg(b[1]) + ' = ' + neg(res[1]) + '.'] }); },
      verify: function (q) { var p = q.params, v = q.check.parts.map(function (t) { return t.value; }); return [0, 1].every(function (i) { return v[i] - p.n * p.b[i] === p.m * p.a[i]; }); } },
    2: { make: function (r) { var L = r.pick([['O', 'A', 'B', 'P'], ['O', 'P', 'Q', 'R'], ['O', 'C', 'D', 'M'], ['O', 'X', 'Y', 'Z'], ['O', 'S', 'T', 'U']]), rt0 = r.pick([[1, 1], [1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 4], [4, 1]]), D = rt0[0] + rt0[1], t = rt0[0];
      var good = [D - t, t, D], cands = [[t, D - t, D], [-1, 1, 1], [-t, t, D], [D, t, D], [D - t, -t, D]], opts = [good], seen = {}; seen[vlab(good)] = 1;
      cands.forEach(function (c) { var l = vlab(c); if (!seen[l] && opts.length < 4) { seen[l] = 1; opts.push(c); } });
      var labs = opts.map(vlab), map = {}; labs.forEach(function (l, i) { map[l] = opts[i]; });
      return K.choice(L[0] + L[1] + ' = <b>a</b> and ' + L[0] + L[2] + ' = <b>b</b>. ' + L[3] + ' is the point on ' + L[1] + L[2] + ' with ' + L[1] + L[3] + ' : ' + L[3] + L[2] + ' = ' + rt0[0] + ' : ' + rt0[1] + '. Which expression gives ' + L[0] + L[3] + '?', r.shuffle(labs.slice()), vlab(good), { hint: 'OP = OA + AP, and AP is ' + vco(t, D) + ' of AB = <b>b</b> − <b>a</b>.', params: { t: [t, D], map: map }, sol: ['AB = b − a, and AP = ' + rt0[0] + '/' + D + ' of AB.', 'OP = a + ' + rt0[0] + '/' + D + '(b − a) = ' + vlab(good).replace(/<\/?b>/g, '') + '.'] }); },
      verify: function (q) { var p = q.params, c = p.map[q.check.value], t = p.t[0] / p.t[1], A0 = [1, 0], B0 = [0, 1], P = [A0[0] + t * (B0[0] - A0[0]), A0[1] + t * (B0[1] - A0[1])]; return Math.abs(c[0] / c[2] - P[0]) < 1e-9 && Math.abs(c[1] / c[2] - P[1]) < 1e-9; } },
    3: { make: function (r) { var p = r.int(-6, 6) || 2, q0 = r.int(-6, 6) || -3, s = r.pick([2, 3, -2, -1, 4]), x = p * s, k = q0 * s;
      return K.int('AB = ' + cv(p, q0) + ' and CD = <span class="cvec"><span>' + neg(x) + '</span><span>k</span></span>. AB is parallel to CD. Find <b>k</b>.', k, { keys: 'signed', hint: 'Parallel vectors are multiples of each other. What number takes ' + neg(p) + ' to ' + neg(x) + '?', params: { p: p, q: q0, x: x }, sol: [neg(x) + ' ÷ ' + neg(p) + ' = ' + neg(s) + ', so CD = ' + neg(s) + ' × AB.', 'k = ' + neg(s) + ' × ' + neg(q0) + ' = ' + neg(k) + '.'] }); },
      verify: function (q) { var p = q.params; return p.p * q.check.value - p.q * p.x === 0; } } } });

  // ================= S4 box plots and quartiles =================
  function quart(xs) { var s = xs.slice().sort(function (a, b) { return a - b; }), n = s.length; return { lq: s[(n + 1) / 4 - 1], med: s[(n + 1) / 2 - 1], uq: s[3 * (n + 1) / 4 - 1], s: s }; }
  function boxPlot(v) { var y0 = 1, y1 = 3; return V.plot({ x: [0, 60], y: [0, 4], gx: 5, gy: 4, h: 110, fns: [{ f: [[v[0], 2], [v[1], 2]] }, { f: [[v[1], y0], [v[3], y0], [v[3], y1], [v[1], y1], [v[1], y0]] }, { f: [[v[2], y0], [v[2], y1]] }, { f: [[v[3], 2], [v[4], 2]] }, { f: [[v[0], 1.5], [v[0], 2.5]] }, { f: [[v[4], 1.5], [v[4], 2.5]] }].map(function (f) { f.color = V.colors.sky; return f; }), xlabel: 'Time (minutes)' }); }
  gc({ id: 'hBoxPlot', objective: 'Y11-S4H', title: 'Box plots and quartiles', levels: {
    1: { make: function (r) { var n = r.pick([7, 11, 15]), xs = []; for (var i = 0; i < n; i++) xs.push(r.int(1, 60)); var Qs = quart(xs), w = r.pick(['lq', 'uq', 'med']), name = { lq: 'lower quartile', uq: 'upper quartile', med: 'median' }[w];
      return K.int('Here are ' + n + ' test scores: <b>' + xs.join(', ') + '</b>. Find the <b>' + name + '</b>.', Qs[w], { hint: 'Put them in order first. With ' + n + ' values, the ' + name + ' is value number ' + { lq: (n + 1) / 4, uq: 3 * (n + 1) / 4, med: (n + 1) / 2 }[w] + '.', params: { xs: xs, w: w }, sol: ['In order: ' + Qs.s.join(', ') + '.', 'The ' + name + ' is ' + Qs[w] + '.'] }); },
      verify: function (q) { var p = q.params, s = p.xs.slice().sort(function (a, b) { return a - b; }), n = s.length, idx = { lq: (n - 3) / 4, med: (n - 1) / 2, uq: (3 * n - 1) / 4 }[p.w]; return s[idx] === q.check.value; } },
    2: { make: function (r) { var n = r.pick([7, 11, 15]), xs = []; for (var i = 0; i < n; i++) xs.push(r.int(10, 90)); var Qs = quart(xs);
      return K.int('Find the <b>inter-quartile range</b> of these ' + n + ' heights (in cm above 100 cm): <b>' + xs.join(', ') + '</b>.', Qs.uq - Qs.lq, { hint: 'Order the data, find the lower and upper quartiles, then subtract.', params: { xs: xs }, sol: ['In order: ' + Qs.s.join(', ') + '.', 'LQ = ' + Qs.lq + ', UQ = ' + Qs.uq + '.', 'IQR = ' + Qs.uq + ' − ' + Qs.lq + ' = ' + (Qs.uq - Qs.lq) + '.'] }); },
      verify: function (q) { var s = q.params.xs.slice().sort(function (a, b) { return a - b; }), n = s.length, lo = s.slice(0, (n - 1) / 2), hi = s.slice((n + 1) / 2); return hi[(hi.length - 1) / 2] - lo[(lo.length - 1) / 2] === q.check.value; } },
    3: { make: function (r) { var v = [r.int(0, 3)]; for (var i = 1; i < 5; i++) v.push(v[i - 1] + r.int(1, 2)); v = v.map(function (x) { return x * 5; }); var iqr = v[3] - v[1];
      if (r.chance(0.5)) return K.int('The box plot shows the times taken by a group of students to finish a puzzle. Find the <b>inter-quartile range</b>.', iqr, { suffix: 'minutes', visual: boxPlot(v), hint: 'The box goes from the lower quartile to the upper quartile.', params: { v: v, k: 'iqr' }, sol: ['LQ = ' + v[1] + ', UQ = ' + v[3] + '.', 'IQR = ' + v[3] + ' − ' + v[1] + ' = ' + iqr + ' minutes.'] });
      var out = r.chance(0.5), x = out ? v[3] + 1.5 * iqr + r.int(1, 10) : v[3] + r.int(1, Math.floor(1.5 * iqr));
      return K.choice('A data set has lower quartile ' + v[1] + ' and upper quartile ' + v[3] + '. An outlier is more than 1.5 × IQR above the upper quartile. Is the value <b>' + x + '</b> an outlier?', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], out ? 'yes' : 'no', { hint: 'IQR = ' + v[3] + ' − ' + v[1] + '. Add 1.5 × IQR to the upper quartile.', params: { v: v, x: x, k: 'out' }, sol: ['IQR = ' + iqr + '. 1.5 × ' + iqr + ' = ' + 1.5 * iqr + '.', 'Limit: ' + v[3] + ' + ' + 1.5 * iqr + ' = ' + (v[3] + 1.5 * iqr) + '.', x + (out ? ' is above this, so it is an outlier.' : ' is not above this, so it is not an outlier.')] }); },
      verify: function (q) { var p = q.params, v = p.v; if (p.k === 'iqr') return q.check.value === v[3] - v[1] && v[0] <= v[1] && v[1] <= v[2] && v[2] <= v[3] && v[3] <= v[4];
        return q.check.value === (p.x - v[3] > 1.5 * (v[3] - v[1]) ? 'yes' : 'no'); } } } });
})(typeof window !== 'undefined' ? window : globalThis);
