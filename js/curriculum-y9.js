/* Learn with Pip — Year 9 curriculum map and teaching content (adventure: the Lost Temple).
   Every "statement" is a Key Stage 3 statutory statement, word for word, from the DfE National Curriculum in England:
   mathematics programme of study (Crown copyright, Open Government Licence v3.0); "focus" says what Year 9 covers.
   With Years 7 and 8, every Key Stage 3 statement is covered; tests/run-checks.js checks this against tools/nc-statements.json. */
(function (G) {
  'use strict';
  var OM = G.OM;
  var F = function (n, d, w) { return OM.frac(n, d, w); };
  function o(id, statement, focus, title, gens, vocab, intro, method, mistakes) { return { id: id, statement: statement, focus: focus, title: title, gens: gens, vocab: vocab, intro: intro, method: method, mistakes: mistakes }; }
  var PYTHAG_TRIG = 'use Pythagoras’ Theorem and trigonometric ratios in similar triangles to solve problems involving right-angled triangles';
  var Y9 = {
    year: 9, label: 'Year 9', keyStage: 'Key Stage 3', ages: '13–14',
    source: 'DfE National Curriculum in England: mathematics programme of study, Key Stage 3 (statutory requirements)',
    regions: [
      { id: 'npv', name: 'Glyph Hall', strand: 'Number', color: '#7b5cc4', icon: 'hash', objectives: [
        o('Y9-N-01', 'appreciate the infinite nature of the sets of integers, real and rational numbers', 'Rational and irrational numbers, recurring decimals and counting integers', 'Types of number', ['y9NumberSets'], ['rational', 'irrational', 'recurring decimal', 'integer', 'infinite'],
          [{ say: 'A rational number can be written as a fraction of two integers: 0.75 = ' + F(3, 4) + ', and 0.333… = ' + F(1, 3) + '. An irrational number cannot: √2 and π go on forever without repeating.' },
           { say: 'There are infinitely many integers, and between any two fractions there is always another one.' }],
          ['Can it be written as a fraction? Then it is rational.', 'Recurring decimals are rational.', 'Square roots of non-square numbers are irrational.'],
          ['Thinking every decimal that goes on forever is irrational.', 'Thinking √9 is irrational (it is 3).']),
        o('Y9-N-02', 'interpret and compare numbers in standard form A x 10n 1≤A<10, where n is a positive or negative integer or 0', 'Multiplying, dividing and adding in standard form', 'Calculating in standard form', ['y9StdFormCalc'], ['standard form', 'index laws', 'power of 10'],
          [{ say: '(3 × 10⁴) × (2 × 10⁵): multiply the numbers (6) and add the powers (10⁹). Answer: 6 × 10⁹.' },
           { say: '(5 × 10³) × (4 × 10⁶) = 20 × 10⁹, which is not standard form. Rewrite it: 2 × 10¹⁰.' }],
          ['Multiply or divide the numbers.', 'Use the index laws on the powers of 10.', 'Make sure the first number is from 1 up to (not including) 10.'],
          ['Leaving 20 × 10⁹ as the answer.', 'Adding the powers when you should subtract them (dividing).']),
        o('Y9-N-03', 'use approximation through rounding to estimate answers and calculate possible resulting errors expressed using inequality notation a<x≤b', 'Error intervals for decimal places and significant figures; bounds in calculations', 'Error intervals and bounds', ['y9Bounds'], ['lower bound', 'upper bound', 'error interval', 'degree of accuracy'],
          [{ say: '3.7 to 1 decimal place could be anything from 3.65 up to (not including) 3.75: 3.65 ≤ x < 3.75.' },
           { say: 'For the largest possible perimeter, use the upper bound of every length.' }],
          ['Find half of the unit you rounded to.', 'Subtract it for the lower bound, add it for the upper bound.', 'In calculations, choose bounds that make the answer biggest or smallest.'],
          ['Using ≤ at the upper end.', 'Using half of 1 instead of half of 0.1 for 1 decimal place.'])
      ] },
      { id: 'al', name: 'Serpent Stair', strand: 'Algebra', color: '#1e9494', icon: 'algebra', objectives: [
        o('Y9-A-01', 'simplify and manipulate algebraic expressions to maintain equivalence by: collecting like terms; multiplying a single term over a bracket; taking out common factors; expanding products of 2 or more binomials', 'Factorising quadratics and the difference of two squares', 'Factorising quadratics', ['y9Factorise'], ['factorise', 'quadratic', 'product', 'sum', 'difference of two squares'],
          [{ say: 'To factorise x² + 7x + 12, find two numbers that multiply to 12 and add to 7: 3 and 4. So x² + 7x + 12 = (x + 3)(x + 4).' },
           { say: 'x² − 49 is a difference of two squares: (x + 7)(x − 7).' }],
          ['Look for a common factor first.', 'Find two numbers: product = the number, sum = the x coefficient.', 'Check by expanding.'],
          ['Getting the signs wrong: x² − x − 12 = (x − 4)(x + 3).', 'Writing (x − 7)² for x² − 49.']),
        o('Y9-A-02', 'recognise, sketch and produce graphs of linear and quadratic functions of 1 variable with appropriate scaling, using equations in x and y and the Cartesian plane', 'Quadratic graphs: tables, roots and turning points', 'Quadratic graphs', ['y9Quadratics'], ['quadratic', 'parabola', 'roots', 'turning point', 'symmetry'],
          [{ say: 'The graph of y = x² − 2x − 3 is a U-shaped curve (a parabola). It crosses the x-axis at the roots, x = −1 and x = 3.', vis: function (V) { return V.plot({ x: [-3, 5], y: [-5, 12], gy: 2, fns: [{ f: function (x) { return x * x - 2 * x - 3; } }] }); } },
           { say: 'The turning point is the lowest point. Here it is at (1, −4), halfway between the roots.' }],
          ['Make a table of values, including negative x.', 'Plot the points and join them with a smooth curve.', 'Roots: where y = 0. Turning point: on the line of symmetry.'],
          ['Joining the points with straight lines.', 'Squaring a negative and getting a negative answer.']),
        o('Y9-A-03', 'interpret mathematical relationships both algebraically and graphically', 'Matching equations to graphs; parallel lines', 'Equations and their graphs', ['y9MatchGraphs'], ['linear', 'quadratic', 'cubic', 'reciprocal', 'parallel'],
          [{ say: 'Linear graphs are straight. Quadratic graphs are U or ∩ shaped. Cubic graphs are S-shaped. Reciprocal graphs (y = 1/x) have two separate curves.' },
           { say: 'Parallel lines have the same gradient: y = 3x + 1 and y = 3x − 5 are parallel.' }],
          ['Look at the highest power of x.', 'Check where the graph crosses the axes.', 'For parallel lines, match the gradient.'],
          ['Thinking every curve is quadratic.', 'Matching the intercept instead of the gradient for parallel lines.'])
      ] },
      { id: 'po', name: 'Star Map', strand: 'Using graphs', color: '#4a6fc4', icon: 'compass', objectives: [
        o('Y9-A-04', 'use linear and quadratic graphs to estimate values of y for given values of x and vice versa and to find approximate solutions of simultaneous linear equations', 'Reading graphs; simultaneous equations and quadratics solved graphically', 'Solving with graphs', ['y9GraphSolve'], ['simultaneous equations', 'intersection', 'solution', 'read off'],
          [{ say: 'Two straight lines cross at one point. Its coordinates solve both equations at once: that is the solution of the simultaneous equations.' },
           { say: 'To solve x² − 2x = 3 using the graph of y = x² − 2x, draw the line y = 3 and read where it meets the curve.' }],
          ['Find the x value on the x-axis, go to the graph, read across.', 'For simultaneous equations, find where the lines cross.', 'For a quadratic = k, draw y = k.'],
          ['Giving only the x value of a solution.', 'Reading the scale wrongly.']),
        o('Y9-A-05', 'find approximate solutions to contextual problems from given graphs of a variety of functions, including piece-wise linear, exponential and reciprocal graphs', 'Distance–time graphs and exponential growth', 'Real-life graphs', ['y9RealGraphs'], ['distance–time graph', 'speed', 'exponential', 'growth'],
          [{ say: 'On a distance–time graph, a flat section means stopped, and a steeper line means faster. Speed = distance ÷ time for each section.' },
           { say: 'Exponential growth multiplies by the same amount each step: doubling every hour gives 50, 100, 200, 400…' }],
          ['Read the axis labels and units.', 'For speed, find the change in distance over the change in time.', 'For exponential growth, multiply repeatedly.'],
          ['Thinking a flat line means moving at a steady speed.', 'Adding instead of multiplying for growth.'])
      ] },
      { id: 'ra', name: 'Gold Scales', strand: 'Ratio, proportion and rates of change', color: '#2f7fd0', icon: 'ratio', objectives: [
        o('Y9-R-01', 'solve problems involving percentage change, including: percentage increase, decrease and original value problems and simple interest in financial mathematics', 'Multipliers, compound interest and depreciation', 'Compound interest and depreciation', ['y9CompoundInterest'], ['multiplier', 'compound interest', 'depreciation', 'repeated percentage change'],
          [{ say: 'To increase by 3%, multiply by 1.03. To decrease by 12%, multiply by 0.88.' },
           { say: 'Compound interest adds interest to the interest. £2,000 at 3% for 2 years: 2,000 × 1.03² = £2,121.80.' }],
          ['Write the multiplier.', 'Raise it to the power of the number of years.', 'Round money to the nearest penny at the end.'],
          ['Working out simple interest when the question says compound.', 'Using 0.12 instead of 0.88 for a 12% decrease.']),
        o('Y9-R-02', 'relate the language of ratios and the associated calculations to the arithmetic of fractions and to linear functions', 'Ratios as fractions and as straight-line equations', 'Ratio and linear relationships', ['y9RatioLinear'], ['ratio', 'proportional', 'linear function', 'constant of proportionality'],
          [{ say: 'If y : x = 3 : 2, then y is ' + F(3, 2) + ' of x: y = 1.5x. The graph is a straight line through the origin.' },
           { say: 'If a : b = 5 : 3 and a + b = 64, then a is ' + F(5, 8) + ' of 64 = 40.' }],
          ['A ratio a : b means the first is a/b of the second.', 'Proportional quantities give y = kx.', 'Use the total parts to find fractions of a whole.'],
          ['Writing y = ' + F(2, 3) + 'x when y : x = 3 : 2.', 'Dividing by one part instead of the total.']),
        o('Y9-R-03', 'solve problems involving direct and inverse proportion, including graphical and algebraic representations', 'Inverse proportion and proportion to a square', 'Inverse proportion', ['y9InverseProportion'], ['inverse proportion', 'direct proportion', 'constant', 'y = k/x'],
          [{ say: 'Inverse proportion: as one doubles, the other halves. 4 workers take 6 days, so 1 worker takes 24 days and 3 workers take 8 days.' },
           { say: 'Algebraically: y = k/x for inverse proportion; y = kx² if y is proportional to x².' }],
          ['Decide: direct (both go up) or inverse (one goes up, one down)?', 'Write the equation and find k.', 'Use it to find the missing value.'],
          ['Treating inverse proportion as direct.', 'Forgetting to square x in y = kx².'])
      ] },
      { id: 'sh', name: 'Pyramid Court', strand: 'Triangles and transformations', color: '#b5652a', icon: 'shapes', objectives: [
        o('Y9-G-01', PYTHAG_TRIG, 'Pythagoras’ theorem, including distances between points', 'Pythagoras’ theorem', ['y9Pythagoras'], ['Pythagoras', 'hypotenuse', 'right-angled triangle', 'square root'],
          [{ say: 'In a right-angled triangle, a² + b² = c², where c is the hypotenuse (the longest side, opposite the right angle).', vis: function (V) { return V.rightTri({ w: 4, h: 3, base: '4 cm', height: '3 cm', hyp: '5 cm' }); } },
           { say: 'To find a shorter side, subtract: a² = c² − b².' }],
          ['Find the hypotenuse first.', 'Longest side: add the squares. Shorter side: subtract.', 'Square root at the end.'],
          ['Adding the squares when finding a shorter side.', 'Forgetting to square root.']),
        o('Y9-G-02', PYTHAG_TRIG, 'Sine, cosine and tangent for missing sides and angles', 'Trigonometry', ['y9Trig'], ['sine', 'cosine', 'tangent', 'opposite', 'adjacent', 'SOH CAH TOA'],
          [{ say: 'Label the sides from the angle: opposite, adjacent and hypotenuse. sin = O/H, cos = A/H, tan = O/A (SOH CAH TOA).', vis: function (V) { return V.rightTri({ w: 5, h: 3, base: 'adjacent', height: 'opposite', hyp: 'hypotenuse', angle: 'θ' }); } },
           { say: 'To find an angle, use the inverse: θ = tan⁻¹(opposite ÷ adjacent).' }],
          ['Label O, A and H from the angle.', 'Pick the ratio that uses the two sides you have.', 'Make sure your calculator is in degrees.'],
          ['Labelling the sides from the right angle.', 'Calculator set to radians.']),
        o('Y9-G-03', 'identify and construct congruent triangles, and construct similar shapes by enlargement, with and without coordinate grids', 'Enlargement from a centre, including scale factor ½', 'Enlargement', ['y9Enlargement'], ['enlargement', 'scale factor', 'centre of enlargement', 'similar'],
          [{ say: 'To enlarge by scale factor 2 from a centre, double the distance from the centre to each point.' },
           { say: 'A scale factor between 0 and 1, like ½, makes the shape smaller.' }],
          ['Find the move from the centre to the point.', 'Multiply the move by the scale factor.', 'Make that move from the centre.'],
          ['Measuring from the origin instead of the centre.', 'Adding the scale factor instead of multiplying.']),
        o('Y9-G-04', 'use the standard conventions for labelling the sides and angles of triangle ABC, and know and use the criteria for congruence of triangles', 'Labelling triangles; SSS, SAS, ASA and RHS', 'Congruent triangles', ['y9Congruence'], ['congruent', 'SSS', 'SAS', 'ASA', 'RHS'],
          [{ say: 'In triangle ABC, side a is opposite angle A (so a = BC), side b = AC and side c = AB.' },
           { say: 'Triangles are congruent (identical) if they match by SSS, SAS, ASA or RHS. Three equal angles only show they are similar.' }],
          ['Name each side by the angle it is opposite.', 'List what you know: sides, angles, right angles.', 'Match it to SSS, SAS, ASA or RHS.'],
          ['Using AAA to prove congruence.', 'Using SSA (the angle not between the sides).'])
      ] },
      { id: 'me', name: 'Moon Courtyard', strand: 'Geometric reasoning', color: '#3e9a5c', icon: 'ruler', objectives: [
        o('Y9-G-05', 'apply angle facts, triangle congruence, similarity and properties of quadrilaterals to derive results about angles and sides, including Pythagoras’ Theorem, and use known results to obtain simple proofs', 'Exterior angles, quadrilateral angles and giving reasons in proofs', 'Angle reasoning and proof', ['y9AngleReasons'], ['proof', 'reason', 'exterior angle', 'co-interior'],
          [{ say: 'The exterior angle of a triangle equals the sum of the two opposite interior angles.' },
           { say: 'A proof is a chain of steps, each with a reason, such as "alternate angles are equal".' }],
          ['Write each step on its own line.', 'Give a reason for every step.', 'Use the proper names of angle facts.'],
          ['Writing "Z angles" instead of "alternate angles".', 'Assuming lines are parallel without being told.']),
        o('Y9-G-06', 'derive and illustrate properties of triangles, quadrilaterals, circles, and other plane figures [for example, equal lengths and angles] using appropriate language and technologies', 'Properties of quadrilateral diagonals, circles and regular polygons', 'Properties of shapes', ['y9Properties'], ['diagonal', 'bisect', 'radius', 'isosceles', 'regular polygon'],
          [{ say: 'The diagonals of a rhombus cross at right angles and cut each other in half. A rectangle’s diagonals are equal.' },
           { say: 'Two radii and a chord make an isosceles triangle, because the radii are equal.' }],
          ['Sketch the shape.', 'Mark equal sides and angles.', 'Use those facts to find what is missing.'],
          ['Assuming a rectangle’s diagonals cross at right angles.', 'Forgetting that all radii are equal.']),
        o('Y9-G-07', 'use the properties of faces, surfaces, edges and vertices of cubes, cuboids, prisms, cylinders, pyramids, cones and spheres to solve problems in 3-D', 'Faces, edges and vertices; Euler’s formula; surface area', '3-D shapes', ['y9Solids3D'], ['face', 'edge', 'vertex', 'Euler', 'surface area'],
          [{ say: 'A prism with an n-sided end has n + 2 faces, 3n edges and 2n vertices.' },
           { say: 'Euler’s formula: faces + vertices − edges = 2. Surface area is the total area of all the faces.' }],
          ['Picture or sketch the solid.', 'Count faces, edges and vertices carefully.', 'For surface area, add the area of every face.'],
          ['Counting hidden edges twice or missing them.', 'Giving volume when asked for surface area.']),
        o('Y9-G-08', 'interpret mathematical relationships both algebraically and geometrically', 'Writing and solving equations from shapes', 'Algebra in geometry', ['y9AlgGeo'], ['equation', 'angle sum', 'perimeter', 'solve'],
          [{ say: 'If the angles of a triangle are x, 2x and 3x, then 6x = 180, so x = 30.' },
           { say: 'A rectangle with sides (2x + 1) and (x + 3) has perimeter 2(3x + 4) = 6x + 8.' }],
          ['Use a geometry fact to write an equation.', 'Solve it.', 'Check the answer makes sense in the shape.'],
          ['Forgetting there are two lengths and two widths.', 'Stopping at x without answering the question.'])
      ] },
      { id: 'st', name: 'Oracle Pool', strand: 'Probability', color: '#c04f9c', icon: 'chart', objectives: [
        o('Y9-P-01', 'generate theoretical sample spaces for single and combined events with equally likely, mutually exclusive outcomes and use these to calculate theoretical probabilities', 'Combined events, with and without replacement', 'Combined probability', ['y9Combined'], ['independent', 'with replacement', 'without replacement', 'sample space'],
          [{ say: 'For two independent events, multiply: P(heads and a 6) = ' + F(1, 2) + ' × ' + F(1, 6) + ' = ' + F(1, 12) + '.' },
           { say: 'Without replacement, the second probability changes: from 3 red and 2 blue, P(two reds) = ' + F(3, 5) + ' × ' + F(2, 4) + ' = ' + F(3, 10) + '.' }],
          ['List the outcomes or draw a sample space.', 'With replacement: the probabilities stay the same.', 'Without replacement: take one away from the top and bottom.'],
          ['Adding probabilities that should be multiplied.', 'Forgetting to reduce the total without replacement.'])
      ] }
    ],
    papers: {
      noncalc: { title: 'Paper 1: non-calculator', minutes: 60, totalMarks: 35, desc: 'No calculator. Number, algebra and reasoning from Year 9.',
        list: [['y9NumberSets', 1], ['y9StdFormCalc', 1], ['y9Bounds', 1], ['y9Factorise', 1], ['y9Quadratics', 1], ['y9MatchGraphs', 1], ['y9GraphSolve', 1], ['y9RealGraphs', 1], ['y9CompoundInterest', 1], ['y9RatioLinear', 1],
          ['y9InverseProportion', 1], ['y9Pythagoras', 1], ['y9Enlargement', 1], ['y9Congruence', 1], ['y9AngleReasons', 1], ['y9Properties', 1], ['y9Solids3D', 1], ['y9AlgGeo', 1], ['y9Combined', 1], ['y9NumberSets', 2],
          ['y9StdFormCalc', 2], ['y9Bounds', 2], ['y9Factorise', 2], ['y9Quadratics', 2], ['y9MatchGraphs', 2], ['y9GraphSolve', 2], ['y9RatioLinear', 2], ['y9InverseProportion', 2], ['y9Enlargement', 2], ['y9Congruence', 2],
          ['y9AngleReasons', 2], ['y9Properties', 2], ['y9AlgGeo', 2], ['y9Factorise', 3], ['y9Combined', 3]] },
      calc: { title: 'Paper 2: calculator', minutes: 60, totalMarks: 35, desc: 'Calculator allowed. Trigonometry, Pythagoras, growth and problem solving.',
        list: [['y9Pythagoras', 2], ['y9Trig', 1], ['y9CompoundInterest', 2], ['y9StdFormCalc', 3], ['y9Bounds', 3], ['y9RealGraphs', 2], ['y9Solids3D', 2], ['y9Combined', 2], ['y9Pythagoras', 3], ['y9Trig', 2],
          ['y9CompoundInterest', 3], ['y9Trig', 3], ['y9NumberSets', 3], ['y9Quadratics', 3], ['y9MatchGraphs', 3], ['y9GraphSolve', 3], ['y9RealGraphs', 3], ['y9RatioLinear', 3], ['y9InverseProportion', 3], ['y9Enlargement', 3],
          ['y9Congruence', 3], ['y9AngleReasons', 3], ['y9Properties', 3], ['y9Solids3D', 3], ['y9AlgGeo', 3], ['y9Pythagoras', 1], ['y9Trig', 1], ['y9Bounds', 1], ['y9StdFormCalc', 2], ['y9CompoundInterest', 1],
          ['y9GraphSolve', 2], ['y9Quadratics', 2], ['y9Solids3D', 1], ['y9AlgGeo', 1], ['y9Combined', 2]] }
    }
  };
  OM.CURRICULUM = OM.CURRICULUM || {};
  OM.CURRICULUM.Y9 = Y9;
  OM.objectiveIndex = OM.objectiveIndex || {};
  Y9.regions.forEach(function (r) { r.objectives.forEach(function (ob) { ob.region = r.id; ob.year = 9; OM.objectiveIndex[ob.id] = ob; }); });
})(typeof window !== 'undefined' ? window : globalThis);
