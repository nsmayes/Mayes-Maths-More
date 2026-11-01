/* Learn with Pip — Year 8 curriculum map and teaching content (adventure: Deep-Sea Station).
   Every "statement" is a Key Stage 3 statutory statement, word for word, from the DfE National Curriculum in England:
   mathematics programme of study (Crown copyright, Open Government Licence v3.0); "focus" says what Year 8 covers.
   tests/run-checks.js compares each statement with tools/nc-statements.json, taken from GOV.UK. */
(function (G) {
  'use strict';
  var OM = G.OM;
  var F = function (n, d, w) { return OM.frac(n, d, w); };
  function o(id, statement, focus, title, gens, vocab, intro, method, mistakes) { return { id: id, statement: statement, focus: focus, title: title, gens: gens, vocab: vocab, intro: intro, method: method, mistakes: mistakes }; }
  var Y8 = {
    year: 8, label: 'Year 8', keyStage: 'Key Stage 3', ages: '12–13',
    source: 'DfE National Curriculum in England: mathematics programme of study, Key Stage 3 (statutory requirements)',
    regions: [
      { id: 'npv', name: 'Pearl Bay', strand: 'Number', color: '#7b5cc4', icon: 'hash', objectives: [
        o('Y8-N-01', 'interpret and compare numbers in standard form A x 10n 1≤A<10, where n is a positive or negative integer or 0', 'Writing, reading and comparing numbers in standard form', 'Standard form', ['y8StdForm'], ['standard form', 'power of 10', 'index', 'scientific notation'],
          [{ say: 'Standard form writes very big or very small numbers as A × 10ⁿ, where A is at least 1 and less than 10. 45,000 = 4.5 × 10⁴.' },
           { say: 'Small numbers have negative powers: 0.00037 = 3.7 × 10⁻⁴. To compare, look at the power of 10 first.' }],
          ['Put the decimal point after the first non-zero digit.', 'Count how many places it moved: that is n.', 'Big numbers: n is positive. Small numbers: n is negative.'],
          ['Writing 45 × 10³ (45 is not between 1 and 10).', 'Getting the sign of the power wrong for small numbers.']),
        o('Y8-N-02', 'use a calculator and other technologies to calculate results accurately and then interpret them appropriately', 'Using brackets and powers on a calculator, and interpreting the display in context', 'Using a calculator', ['y8Calculator'], ['calculator', 'brackets', 'display', 'interpret', 'round up'],
          [{ say: 'For (12.6 + 4.8) ÷ 2.5², use brackets on your calculator, or work out the top and bottom first.' },
           { say: 'The display might say 7.8125 minibuses. You cannot have part of a minibus, so you need 8.' }],
          ['Type brackets exactly as the question shows them.', 'Write down the full display before you round.', 'Ask what the answer means: round up or down?'],
          ['Typing 17.4 ÷ 2.5² without brackets around the top.', 'Giving 7.8 minibuses as the answer.']),
        o('Y8-N-03', 'use integer powers and associated real roots (square, cube and higher), recognise powers of 2, 3, 4, 5 and distinguish between exact representations of roots and their decimal approximations', 'Index laws; zero and negative powers', 'Index laws', ['y8Indices'], ['index', 'power', 'index laws', 'negative index', 'reciprocal'],
          [{ say: 'a⁵ × a³ = a⁸: multiplying, add the indices. a⁹ ÷ a⁴ = a⁵: dividing, subtract. (a⁴)³ = a¹²: a power of a power, multiply.' },
           { say: 'Anything to the power 0 is 1. A negative power means "one over": 2⁻³ = 1/8.' }],
          ['Same letter or number? Use the index laws.', 'Multiply: add. Divide: subtract. Power of a power: multiply.', 'Negative power: write 1 over the positive power.'],
          ['Multiplying the indices when you should add them.', 'Thinking 2⁻³ is negative.'])
      ] },
      { id: 'al', name: 'Kelp Forest', strand: 'Algebra', color: '#1e9494', icon: 'algebra', objectives: [
        o('Y8-A-01', 'understand and use standard mathematical formulae; rearrange formulae to change the subject', 'Changing the subject of a formula', 'Rearranging formulae', ['y8Rearrange'], ['subject', 'rearrange', 'formula', 'inverse operation'],
          [{ say: 'To make x the subject of y = 3x − 5: add 5 to both sides, y + 5 = 3x, then divide by 3: x = (y + 5)/3.' }],
          ['Look at what has been done to the letter you want.', 'Undo it in reverse order, doing the same to both sides.', 'Finish with that letter on its own.'],
          ['Only dividing part of one side.', 'Undoing the steps in the wrong order.']),
        o('Y8-A-02', 'model situations or procedures by translating them into algebraic expressions or formulae and by using graphs', 'Writing expressions and formulae from words', 'Forming expressions and formulae', ['y8Modelling'], ['expression', 'formula', 'variable', 'model'],
          [{ say: 'A taxi charges £3 plus £2 per mile. For m miles, the cost is C = 2m + 3.' },
           { say: 'An expression has no equals sign; a formula links two letters: C = 2m + 3.' }],
          ['Choose letters for the unknowns.', 'Turn each part of the words into a term.', 'Simplify and check with a number.'],
          ['Writing 2 + 3m when the fixed charge is £3.', 'Forgetting that 3 lots of a is 3a, not a + 3.']),
        o('Y8-A-03', 'simplify and manipulate algebraic expressions to maintain equivalence by: collecting like terms; multiplying a single term over a bracket; taking out common factors; expanding products of 2 or more binomials', 'Expanding double brackets', 'Double brackets', ['y8DoubleBrackets'], ['binomial', 'expand', 'grid method', 'like terms'],
          [{ say: '(x + 3)(x + 5): multiply every term by every term. x² + 5x + 3x + 15 = x² + 8x + 15.' },
           { say: '(x + 4)² means (x + 4)(x + 4) = x² + 8x + 16, not x² + 16.' }],
          ['Draw a 2 by 2 grid, or use FOIL.', 'Multiply each pair of terms.', 'Collect the two x terms.'],
          ['Writing (x + 4)² = x² + 16.', 'Sign errors with negatives: (x − 2)(x + 5) has −2 × 5 = −10.']),
        o('Y8-A-04', 'use algebraic methods to solve linear equations in 1 variable (including all forms that require rearrangement)', 'Unknowns on both sides, brackets and fractions', 'Harder linear equations', ['y8Equations'], ['solve', 'both sides', 'expand', 'denominator'],
          [{ say: '3(x − 2) = 2x + 10: expand to 3x − 6 = 2x + 10. Subtract 2x: x − 6 = 10. So x = 16.' },
           { say: '(x + 4)/3 = 5: multiply both sides by 3 to get x + 4 = 15, so x = 11.' }],
          ['Remove fractions by multiplying both sides.', 'Expand any brackets.', 'Collect x terms on one side, then solve.'],
          ['Multiplying only one term by the denominator.', 'Moving a term across without changing its sign.']),
        o('Y8-A-05', 'recognise geometric sequences and appreciate other sequences that arise', 'Geometric, Fibonacci-type and square-number sequences', 'Geometric and other sequences', ['y8OtherSequences'], ['geometric', 'common ratio', 'Fibonacci', 'square numbers'],
          [{ say: 'In a geometric sequence you multiply by the same number each time: 3, 6, 12, 24 (× 2). The common ratio is 2.' },
           { say: 'In a Fibonacci-type sequence each term is the sum of the two before: 1, 1, 2, 3, 5, 8.' }],
          ['Check for a common difference (arithmetic).', 'Check for a common ratio (geometric).', 'Look for squares or a Fibonacci pattern.'],
          ['Adding when you should multiply.', 'Calling every sequence arithmetic.'])
      ] },
      { id: 'po', name: 'Sonar Grid', strand: 'Graphs and transformations', color: '#4a6fc4', icon: 'compass', objectives: [
        o('Y8-A-06', 'recognise, sketch and produce graphs of linear and quadratic functions of 1 variable with appropriate scaling, using equations in x and y and the Cartesian plane', 'Straight-line graphs from tables of values', 'Straight-line graphs', ['y8LinearGraphs'], ['table of values', 'linear', 'plot', 'equation of a line'],
          [{ say: 'To draw y = 2x + 1, make a table: when x = 0, y = 1; when x = 1, y = 3; when x = 2, y = 5. Plot the points and join them with a ruler.', vis: function (V) { return V.plot({ x: [-3, 3], y: [-6, 8], gy: 2, fns: [{ f: function (x) { return 2 * x + 1; } }] }); } }],
          ['Pick some x values.', 'Work out y for each one.', 'Plot and join with a straight line.'],
          ['Plotting (y, x) instead of (x, y).', 'Forgetting that a negative x times a positive number is negative.']),
        o('Y8-A-07', 'reduce a given linear equation in 2 variables to the standard form y = mx + c; calculate and interpret gradients and intercepts of graphs of such linear equations numerically, graphically and algebraically', 'Gradient and y-intercept from equations and two points', 'y = mx + c', ['y8Gradient'], ['gradient', 'intercept', 'steepness', 'y = mx + c'],
          [{ say: 'In y = mx + c, m is the gradient (how steep) and c is where the line crosses the y-axis.' },
           { say: 'Gradient between two points = change in y ÷ change in x. From (2, 3) to (6, 11): 8 ÷ 4 = 2.' }],
          ['Rearrange to y = … first.', 'Read m and c.', 'For two points, use rise ÷ run.'],
          ['Reading the gradient of 2y = 6x + 4 as 6.', 'Doing change in x ÷ change in y.']),
        o('Y8-G-05', 'identify properties of, and describe the results of, translations, rotations and reflections applied to given figures', 'Translating by vectors, reflecting in lines and rotating about the origin', 'Transformations', ['y8Transform'], ['translation', 'vector', 'reflection', 'rotation', 'image'],
          [{ say: 'A translation by the column vector with 3 on top and −2 below moves 3 right and 2 down.' },
           { say: 'Reflecting in y = x swaps the coordinates: (2, 5) goes to (5, 2). A rotation needs a centre, an angle and a direction.' }],
          ['Translation: top number across, bottom number up or down.', 'Reflection: same distance on the other side of the mirror line.', 'Rotation: use tracing paper, or the rules for 90° and 180°.'],
          ['Mixing up the two numbers in a vector.', 'Rotating the wrong way (clockwise versus anticlockwise).'])
      ] },
      { id: 'ra', name: 'Current Exchange', strand: 'Ratio, proportion and rates of change', color: '#2f7fd0', icon: 'ratio', objectives: [
        o('Y8-R-01', 'use scale factors, scale diagrams and maps', 'Model scales, map scales and scale factors', 'Scale factors and maps', ['y8Scale'], ['scale', 'scale factor', 'map', 'enlargement'],
          [{ say: 'A scale of 1 : 40 means the real object is 40 times bigger than the model.' },
           { say: 'On a 1 : 50,000 map, 1 cm is 50,000 cm, which is 0.5 km.' }],
          ['Multiply to go from the model or map to real life.', 'Divide to go from real life to the map.', 'Convert units at the end.'],
          ['Forgetting to change cm into m or km.', 'Adding the scale factor instead of multiplying.']),
        o('Y8-R-02', 'understand that a multiplicative relationship between 2 quantities can be expressed as a ratio or a fraction', 'Moving between ratios and fractions', 'Ratios and fractions', ['y8RatioFraction'], ['ratio', 'fraction', 'part', 'whole'],
          [{ say: 'If red : blue = 3 : 5, there are 8 parts, so ' + F(3, 8) + ' of the counters are red.' },
           { say: 'If A is ' + F(2, 3) + ' of B, then A : B = 2 : 3.' }],
          ['Add the parts to find the whole.', 'A part over the whole gives the fraction.', 'A fraction a/b of something gives the ratio a : b.'],
          ['Saying ' + F(3, 5) + ' are red when the ratio is 3 : 5.', 'Mixing up part : part with part : whole.']),
        o('Y8-R-03', 'solve problems involving direct and inverse proportion, including graphical and algebraic representations', 'Direct proportion: recipes, best buys and y = kx', 'Direct proportion', ['y8Direct'], ['direct proportion', 'unitary method', 'best value', 'constant'],
          [{ say: 'The unitary method: find the value for one, then multiply. 4 people need 300 g, so 1 person needs 75 g and 10 people need 750 g.' },
           { say: 'If y is directly proportional to x, then y = kx, and the graph is a straight line through the origin.' }],
          ['Find the value for one unit.', 'Multiply up.', 'For y = kx, find k from the values given.'],
          ['Adding instead of multiplying.', 'Comparing prices without using the same amount.']),
        o('Y8-R-04', 'use compound units such as speed, unit pricing and density to solve problems', 'Speed, density and unit pricing; converting km/h to m/s', 'Compound units', ['y8Compound'], ['speed', 'density', 'km/h', 'm/s', 'unit price'],
          [{ say: 'Speed = distance ÷ time. Density = mass ÷ volume. Unit price = cost ÷ quantity.' },
           { say: '72 km/h = 72,000 m in 3,600 seconds = 20 m/s.' }],
          ['Write down the formula.', 'Check the units match (hours or minutes?).', 'Rearrange if you need distance, time, mass or volume.'],
          ['Using 1.5 hours as 1 hour 50 minutes.', 'Multiplying when you should divide.']),
        o('Y8-R-05', 'solve problems involving percentage change, including: percentage increase, decrease and original value problems and simple interest in financial mathematics', 'Percentage change, simple interest and reverse percentages', 'Percentage change', ['y8PercentChange'], ['percentage change', 'simple interest', 'original value', 'reverse percentage'],
          [{ say: 'Percentage change = change ÷ original × 100. From £40 to £46 is a change of £6, so 6 ÷ 40 × 100 = 15%.' },
           { say: 'After a 20% reduction a coat costs £64. That is 80% of the original, so 1% is £0.80 and 100% is £80.' }],
          ['Always divide by the original amount.', 'Simple interest is the same every year.', 'For original value, work out what percentage you have.'],
          ['Finding 20% of £64 and adding it on.', 'Dividing by the new amount instead of the original.'])
      ] },
      { id: 'sh', name: 'Shipwreck Hull', strand: 'Geometry and measures', color: '#b5652a', icon: 'shapes', objectives: [
        o('Y8-G-01', 'calculate and solve problems involving: perimeters of 2-D shapes (including circles), areas of circles and composite shapes', 'Circumference, area of circles and semicircles', 'Circles', ['y8Circles'], ['circumference', 'radius', 'diameter', 'pi', 'semicircle'],
          [{ say: 'Circumference = π × diameter. Area = π × radius². π is about 3.14159.', vis: function (V) { return V.circleParts('radius', '5 cm'); } },
           { say: 'For a circle of radius 5 cm: circumference = 10π ≈ 31.4 cm and area = 25π ≈ 78.5 cm².' }],
          ['Decide: distance round (circumference) or space inside (area)?', 'Use the radius for area and the diameter for circumference.', 'Give answers in terms of π, or round as asked.'],
          ['Using the diameter in πr².', 'Squaring π instead of the radius.']),
        o('Y8-G-02', 'derive and apply formulae to calculate and solve problems involving: perimeter and area of triangles, parallelograms, trapezia, volume of cuboids (including cubes) and other prisms (including cylinders)', 'Volume of prisms and cylinders; capacity', 'Volume of prisms', ['y8Volume'], ['prism', 'cross-section', 'cylinder', 'volume', 'capacity'],
          [{ say: 'A prism has the same cross-section all the way along. Volume = area of cross-section × length.' },
           { say: 'A cylinder is a prism with a circle cross-section: V = πr²h. 1,000 cm³ = 1 litre.' }],
          ['Find the area of the cross-section.', 'Multiply by the length (or height).', 'Use cubic units.'],
          ['Using the wrong face as the cross-section.', 'Writing cm² for a volume.']),
        o('Y8-G-03', 'understand and use the relationship between parallel lines and alternate and corresponding angles', 'Alternate, corresponding and co-interior angles', 'Angles in parallel lines', ['y8ParallelAngles'], ['parallel', 'alternate', 'corresponding', 'co-interior', 'transversal'],
          [{ say: 'When a line crosses two parallel lines: corresponding angles (an F shape) are equal, alternate angles (a Z shape) are equal, and co-interior angles (a C shape) add up to 180°.', vis: function (V) { return V.parallel(60, ['ll', 0, '60°'], ['ur', 1, 'x']); } }],
          ['Look for an F, Z or C shape.', 'F and Z: the angles are equal. C: they add to 180°.', 'Give the reason by name.'],
          ['Calling co-interior angles equal.', 'Using these facts when the lines are not parallel.']),
        o('Y8-G-04', 'derive and use the standard ruler and compass constructions (perpendicular bisector of a line segment, constructing a perpendicular to a given line from/at a given point, bisecting a given angle); recognise and use the perpendicular distance from a point to a line as the shortest distance to the line', 'Choosing constructions; the shortest distance to a line', 'Constructions', ['y8Constructions'], ['perpendicular bisector', 'angle bisector', 'compasses', 'equidistant', 'shortest distance'],
          [{ say: 'A perpendicular bisector cuts a line in half at right angles. Every point on it is the same distance from both ends.' },
           { say: 'An angle bisector splits an angle in half. The shortest distance from a point to a line is the perpendicular distance.' }],
          ['Keep the compasses the same width for each pair of arcs.', 'Leave the construction arcs showing.', 'Shortest distance: go at right angles to the line.'],
          ['Changing the compass width halfway through.', 'Measuring a slanted distance as the shortest one.'])
      ] },
      { id: 'st', name: 'Lantern Fish Lab', strand: 'Statistics and probability', color: '#c04f9c', icon: 'chart', objectives: [
        o('Y8-P-01', 'enumerate sets and unions/intersections of sets systematically, using tables, grids and Venn diagrams', 'Venn diagrams: intersections, unions and complements', 'Venn diagrams', ['y8Venn'], ['Venn diagram', 'intersection', 'union', 'set', 'universal set'],
          [{ say: 'The overlap of two circles is the intersection: things in both sets. Everything inside either circle is the union.', vis: function (V) { return V.venn({ a: 8, both: 5, b: 6, out: 3 }, ['Tea', 'Coffee']); } }],
          ['Fill in the overlap first.', 'Then the rest of each circle.', 'Then the outside, so the total is right.'],
          ['Forgetting the overlap when counting one set.', 'Counting the overlap twice in a union.']),
        o('Y8-S-01', 'describe simple mathematical relationships between 2 variables (bivariate data) in observational and experimental contexts and illustrate using scatter graphs', 'Scatter graphs, correlation and lines of best fit', 'Scatter graphs', ['y8Scatter'], ['scatter graph', 'correlation', 'line of best fit', 'outlier', 'extrapolation'],
          [{ say: 'Positive correlation: as one goes up, so does the other. Negative: as one goes up, the other goes down.' },
           { say: 'A line of best fit lets you estimate. Estimates inside the data range are more reliable than outside it.' }],
          ['Look at the overall direction of the points.', 'Draw a line of best fit through the middle of the points.', 'Read estimates from the line, not from single points.'],
          ['Joining the points dot to dot.', 'Thinking correlation proves one thing causes the other.']),
        o('Y8-S-02', 'describe, interpret and compare observed distributions of a single variable through: appropriate graphical representation involving discrete, continuous and grouped data; and appropriate measures of central tendency (mean, mode, median) and spread (range, consideration of outliers)', 'Grouped data: modal class, estimated mean and the median class', 'Grouped frequency tables', ['y8Grouped'], ['class interval', 'midpoint', 'modal class', 'estimated mean'],
          [{ say: 'With grouped data you do not know the exact values. Use the midpoint of each class to estimate the mean.' },
           { say: 'The modal class has the highest frequency. To find the median class, count up the frequencies.' }],
          ['Add a midpoint column.', 'Multiply each midpoint by its frequency and add.', 'Divide by the total frequency.'],
          ['Dividing by the number of classes.', 'Using the class width instead of the midpoint.'])
      ] }
    ],
    papers: {
      noncalc: { title: 'Paper 1: non-calculator', minutes: 45, totalMarks: 30, desc: 'No calculator. Number, algebra, graphs and angles from Year 8.',
        list: [['y8StdForm', 1], ['y8Indices', 1], ['y8Rearrange', 1], ['y8Modelling', 1], ['y8DoubleBrackets', 1], ['y8Equations', 1], ['y8OtherSequences', 1], ['y8LinearGraphs', 1], ['y8Gradient', 1], ['y8Transform', 1],
          ['y8RatioFraction', 1], ['y8ParallelAngles', 1], ['y8Venn', 1], ['y8StdForm', 2], ['y8Indices', 2], ['y8Rearrange', 2], ['y8Modelling', 2], ['y8DoubleBrackets', 2], ['y8Equations', 2], ['y8LinearGraphs', 2],
          ['y8Gradient', 2], ['y8Transform', 2], ['y8ParallelAngles', 2], ['y8Venn', 2], ['y8PercentChange', 1], ['y8Indices', 3], ['y8DoubleBrackets', 3], ['y8Equations', 3], ['y8Gradient', 3], ['y8Transform', 3]] },
      calc: { title: 'Paper 2: calculator', minutes: 45, totalMarks: 30, desc: 'Calculator allowed. Measures, proportion, data and problem solving.',
        list: [['y8Calculator', 1], ['y8Scale', 1], ['y8Direct', 1], ['y8Compound', 1], ['y8Circles', 1], ['y8Volume', 1], ['y8Constructions', 1], ['y8Scatter', 1], ['y8Grouped', 1], ['y8PercentChange', 2],
          ['y8Calculator', 2], ['y8Scale', 2], ['y8RatioFraction', 2], ['y8Direct', 2], ['y8Compound', 2], ['y8Circles', 2], ['y8Volume', 2], ['y8Constructions', 2], ['y8Scatter', 2], ['y8Grouped', 2],
          ['y8Calculator', 3], ['y8Scale', 3], ['y8RatioFraction', 3], ['y8Direct', 3], ['y8Compound', 3], ['y8PercentChange', 3], ['y8Circles', 3], ['y8Volume', 3], ['y8Venn', 3], ['y8Grouped', 3]] }
    }
  };
  OM.CURRICULUM = OM.CURRICULUM || {};
  OM.CURRICULUM.Y8 = Y8;
  OM.objectiveIndex = OM.objectiveIndex || {};
  Y8.regions.forEach(function (r) { r.objectives.forEach(function (ob) { ob.region = r.id; ob.year = 8; OM.objectiveIndex[ob.id] = ob; }); });
})(typeof window !== 'undefined' ? window : globalThis);
