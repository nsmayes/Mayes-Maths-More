/* Learn with Pip — Year 3 curriculum map and teaching content (adventure: the Crystal Caves).
   Every "statement" is the statutory requirement, word for word, from the DfE National Curriculum in England: mathematics
   programmes of study, Year 3 (Crown copyright, Open Government Licence v3.0). tests/run-checks.js compares each one with
   tools/nc-statements.json, taken from GOV.UK. */
(function (G) {
  'use strict';
  var OM = G.OM;
  var F = function (n, d, w) { return OM.frac(n, d, w); };
  var Y3 = {
    year: 3, label: 'Year 3', keyStage: 'Lower Key Stage 2', ages: '7–8',
    source: 'DfE National Curriculum in England: mathematics programmes of study (Year 3 statutory requirements)',
    tablesObjective: 'Y3-MD-01',
    regions: [
      { id: 'npv', name: 'Counting Cavern', strand: 'Number – number and place value', color: '#7b5cc4', icon: 'hash', guard: 'Tabitha the Tabby',
        objectives: [
          { id: 'Y3-NPV-01', statement: 'count from 0 in multiples of 4, 8, 50 and 100; find 10 or 100 more or less than a given number', title: 'Counting in steps; 10 and 100 more or less', gens: ['y3Count', 'y3TenHundred'],
            vocab: ['multiple', 'count on', 'count back', 'more', 'less'],
            intro: [
              { say: 'Counting in 4s from 0: 0, 4, 8, 12, 16… Counting in 8s is double: 0, 8, 16, 24, 32…', vis: function (V) { return V.numberLine({ min: 0, max: 40, step: 4, hops: [0, 1, 2, 3, 4].map(function (i) { return { from: i * 4, to: i * 4 + 4, label: '+4' }; }) }); } },
              { say: 'Counting in 50s goes 0, 50, 100, 150, 200. Two 50s make 100.' },
              { say: 'To find 10 more, add 1 to the tens digit. To find 100 more, add 1 to the hundreds digit.', vis: function (V) { return V.placeValue(['H', 'T', 'O'], ['3', '4', '6'], { highlight: 1 }) + V.placeValue(['H', 'T', 'O'], ['3', '5', '6'], { highlight: 1 }); } }
            ],
            method: ['Find the step between two numbers next to each other.', 'Keep adding (or taking away) the same step.', 'For 10 more or less, change the tens digit; for 100 more or less, change the hundreds digit.'],
            mistakes: ['Changing the wrong digit, for example the hundreds instead of the tens.', 'Forgetting that 10 more than 395 is 405, because 9 tens and 1 more ten make 10 tens.'] },
          { id: 'Y3-NPV-02', statement: 'recognise the place value of each digit in a 3-digit number (100s, 10s, 1s)', title: 'Hundreds, tens and ones', gens: ['y3PlaceValue'],
            vocab: ['hundreds', 'tens', 'ones', 'digit', 'value', 'partition'],
            intro: [
              { say: 'In 346, the 3 means 3 hundreds, the 4 means 4 tens and the 6 means 6 ones.', vis: function (V) { return V.placeValue(['H', 'T', 'O'], ['3', '4', '6']); } },
              { say: 'We can partition 346 into 300 + 40 + 6.', vis: function (V) { return V.base10(346); } }
            ],
            method: ['Put the number in a place value chart: H, T, O.', 'The value of a digit is the digit times its column: hundreds, tens or ones.', 'To partition, write each value and add them.'],
            mistakes: ['Saying the 4 in 346 is worth 4, when it is worth 40.', 'Forgetting a zero, for example writing 306 as 36.'] },
          { id: 'Y3-NPV-03', statement: 'compare and order numbers up to 1,000', title: 'Comparing and ordering to 1,000', gens: ['y3Compare'],
            vocab: ['greater than', 'less than', 'equal to', 'order', 'smallest', 'largest'],
            intro: [
              { say: 'The sign &lt; means "is less than" and &gt; means "is greater than". The open side faces the bigger number: 452 &lt; 524.' },
              { say: 'To compare, look at the hundreds first. If they are the same, look at the tens, then the ones.' }
            ],
            method: ['Compare the hundreds digits.', 'If they are the same, compare the tens, then the ones.', 'The first different digit decides which is bigger.'],
            mistakes: ['Looking at the ones first.', 'Pointing the &lt; or &gt; sign the wrong way.'] },
          { id: 'Y3-NPV-04', statement: 'identify, represent and estimate numbers using different representations', title: 'Number lines and blocks', gens: ['y3Represent'],
            vocab: ['number line', 'estimate', 'represent', 'base 10 blocks', 'between'],
            intro: [
              { say: 'Numbers can be shown in different ways: with base 10 blocks, in a place value chart, or on a number line.', vis: function (V) { return V.base10(253); } },
              { say: 'On a number line, work out what each step is worth before you read it.', vis: function (V) { return V.numberLine({ min: 0, max: 1000, step: 100, arrow: 350 }); } }
            ],
            method: ['Find the numbers at each end of the line.', 'Work out how much each step is worth.', 'Count the steps to the arrow, or estimate if it is between two marks.'],
            mistakes: ['Assuming every step is worth 1.', 'Counting the marks instead of the gaps.'] },
          { id: 'Y3-NPV-05', statement: 'read and write numbers up to 1,000 in numerals and in words', title: 'Numbers in words', gens: ['y3Words'],
            vocab: ['numerals', 'digits', 'words', 'hundred', 'thousand'],
            intro: [
              { say: '345 in words is three hundred and forty-five. We say the hundreds, then "and", then the tens and ones.' },
              { say: 'Use a hyphen between the tens and ones: twenty-one, forty-five, ninety-nine.' }
            ],
            method: ['Say the hundreds first: "three hundred".', 'Then say "and" followed by the tens and ones.', 'When writing numerals, use 0 for any empty column.'],
            mistakes: ['Writing three hundred and five as 3005 instead of 305.', 'Mixing up fourteen and forty.'] },
          { id: 'Y3-NPV-06', statement: 'solve number problems and practical problems involving these ideas', title: 'Number puzzles', gens: ['y3NumProblems'],
            vocab: ['digit', 'largest', 'smallest', 'odd', 'even'],
            intro: [
              { say: 'With digit cards 3, 7 and 1, the largest number is 731: biggest digit in the hundreds. The smallest is 137.' }
            ],
            method: ['Decide which column matters most: the hundreds.', 'For the largest number, put the biggest digit there; for the smallest, the smallest digit (not 0).', 'For odd or even, choose the ones digit first.'],
            mistakes: ['Putting 0 in the hundreds column, which makes a 2-digit number.', 'Forgetting a number must end in 0, 2, 4, 6 or 8 to be even.'] }
        ] },
      { id: 'as', name: 'Echo Tunnel', strand: 'Number – addition and subtraction', color: '#2f7fd0', icon: 'plusminus', guard: 'Sir Whiskers',
        objectives: [
          { id: 'Y3-AS-01', statement: 'add and subtract numbers mentally, including: a three-digit number and 1s; a three-digit number and 10s; a three-digit number and 100s', title: 'Adding and subtracting in your head', gens: ['y3Mental'],
            vocab: ['add', 'subtract', 'ones', 'tens', 'hundreds', 'mentally'],
            intro: [
              { say: '453 + 30: only the tens change. 5 tens + 3 tens = 8 tens, so the answer is 483.' },
              { say: '368 + 7: the ones go past 9. 8 + 7 = 15, so we get one more ten: 375.', vis: function (V) { return V.numberLine({ min: 365, max: 376, step: 1, hops: [{ from: 368, to: 370, label: '+2' }, { from: 370, to: 375, label: '+5' }] }); } }
            ],
            method: ['Look at what you are adding: ones, tens or hundreds.', 'Change that digit.', 'If it goes past 9 (or below 0), exchange with the next column.'],
            mistakes: ['Adding 30 to the ones digit instead of the tens.', 'Forgetting to exchange when the ones go past 9.'] },
          { id: 'Y3-AS-02', statement: 'add and subtract numbers with up to 3 digits, using formal written methods of columnar addition and subtraction', title: 'Column addition and subtraction', gens: ['y3ColAdd', 'y3ColSub'],
            vocab: ['column', 'exchange', 'ones', 'tens', 'hundreds', 'digit'],
            intro: [
              { say: 'Line up the digits: ones under ones, tens under tens, hundreds under hundreds. Start with the ones.', vis: function (V) { return V.column({ a: 247, b: 135, op: '+', answer: '382' }); } },
              { say: 'If a column adds up to 10 or more, exchange 10 ones for 1 ten and write it under the next column.' },
              { say: 'When subtracting, if the top digit is too small, exchange 1 ten for 10 ones.' }
            ],
            method: ['Write the numbers in columns, lining up the ones.', 'Start with the ones column.', 'Exchange when you need to.', 'Check by doing the inverse.'],
            mistakes: ['Starting on the left instead of the ones.', 'Taking the smaller digit from the bigger one when the bigger is on the bottom, instead of exchanging.'] },
          { id: 'Y3-AS-03', statement: 'estimate the answer to a calculation and use inverse operations to check answers', title: 'Estimate and check', gens: ['y3Estimate'],
            vocab: ['estimate', 'round', 'inverse', 'check', 'nearest hundred'],
            intro: [
              { say: 'To estimate 298 + 405, round each number: 300 + 400 = 700. The real answer should be close to 700.' },
              { say: 'Addition and subtraction are inverses. If 452 − 187 = 265, then 265 + 187 should equal 452.' }
            ],
            method: ['Round each number to the nearest ten or hundred.', 'Work out the easier calculation to get an estimate.', 'Check your real answer with the inverse operation.'],
            mistakes: ['Using the inverse the wrong way round.', 'Rounding 250 down instead of up to 300.'] },
          { id: 'Y3-AS-04', statement: 'solve problems, including missing number problems, using number facts, place value, and more complex addition and subtraction', title: 'Adding and subtracting problems', gens: ['y3ASProblems'],
            vocab: ['altogether', 'more', 'fewer', 'left', 'missing number'],
            intro: [
              { say: 'Read the problem carefully. "Altogether" or "more" usually means add. "Left" or "fewer" usually means subtract.' },
              { say: 'For ? + 245 = 600, use the inverse: 600 − 245 = 355.', vis: function (V) { return V.svg(440, 100, V.t(220, 14, '600', { size: 16, weight: 'bold' }) + V.rect(10, 30, 420, 30, { fill: '#cfe0fa' }) + V.rect(10, 62, 249, 30, { fill: '#fde3b6' }) + V.t(134, 78, '?', { size: 16, weight: 'bold' }) + V.rect(259, 62, 171, 30, { fill: '#fff' }) + V.t(344, 78, '245', { size: 16 })); } }
            ],
            method: ['Read the question and decide: add or subtract?', 'Write the calculation.', 'Work it out, then check it makes sense.'],
            mistakes: ['Adding when the question asks how many are left.', 'Doing only one step of a two-step problem.'] }
        ] },
      { id: 'md', name: 'Glow-worm Grotto', strand: 'Number – multiplication and division', color: '#d2475b', icon: 'array', guard: 'Countess Purrwell',
        objectives: [
          { id: 'Y3-MD-01', statement: 'recall and use multiplication and division facts for the 3, 4 and 8 multiplication tables', title: 'The 3, 4 and 8 times tables', gens: ['y3Tables'],
            vocab: ['times', 'multiply', 'divide', 'multiple', 'product'],
            intro: [
              { say: 'The 4 times table is double the 2 times table. The 8 times table is double the 4 times table.' },
              { say: '6 × 4 = 24 means 6 groups of 4. Division undoes it: 24 ÷ 4 = 6.', vis: function (V) { return V.array(4, 6); } }
            ],
            method: ['Learn each table by counting in steps.', 'Use doubling: 4s are double 2s, 8s are double 4s.', 'For division, ask: how many of these make the total?'],
            mistakes: ['Mixing up 7 × 8 and 6 × 8.', 'Forgetting that 3 × 8 and 8 × 3 give the same answer.'] },
          { id: 'Y3-MD-02', statement: 'write and calculate mathematical statements for multiplication and division using the multiplication tables that they know, including for two-digit numbers times one-digit numbers, using mental and progressing to formal written methods', title: 'Multiplying and dividing 2-digit numbers', gens: ['y3MulWritten', 'y3Div'],
            vocab: ['partition', 'multiply', 'divide', 'tens', 'ones'],
            intro: [
              { say: 'To work out 23 × 4, partition 23 into 20 and 3. 20 × 4 = 80 and 3 × 4 = 12. Then 80 + 12 = 92.' },
              { say: 'To work out 72 ÷ 4, split 72 into 40 and 32. 40 ÷ 4 = 10 and 32 ÷ 4 = 8, so 72 ÷ 4 = 18.' }
            ],
            method: ['Partition the 2-digit number into tens and ones.', 'Multiply (or divide) each part.', 'Add the parts together.'],
            mistakes: ['Multiplying only the ones.', 'Forgetting to add the two parts.'] },
          { id: 'Y3-MD-03', statement: 'solve problems, including missing number problems, involving multiplication and division, including positive integer scaling problems and correspondence problems in which n objects are connected to m objects', title: 'Multiplying and dividing problems', gens: ['y3MDProblems'],
            vocab: ['times as long', 'groups of', 'each', 'share', 'ways'],
            intro: [
              { say: '"3 times as long" means multiply the length by 3. This is called scaling.' },
              { say: 'With 3 hats and 4 scarves, each hat goes with 4 scarves: 3 × 4 = 12 different outfits.' }
            ],
            method: ['Read the question and find the numbers.', 'Decide: equal groups or "times as many" means multiply.', 'Write the calculation and work it out.'],
            mistakes: ['Adding instead of multiplying for "times as many".', 'Counting the hats and scarves instead of the pairs.'] }
        ] },
      { id: 'fr', name: 'Crystal Pool', strand: 'Number – fractions', color: '#d9861a', icon: 'pie', guard: 'Captain Clawdia',
        objectives: [
          { id: 'Y3-F-01', statement: 'count up and down in tenths; recognise that tenths arise from dividing an object into 10 equal parts and in dividing one-digit numbers or quantities by 10', title: 'Tenths', gens: ['y3Tenths'],
            vocab: ['tenth', 'equal parts', 'divide', 'numerator', 'denominator'],
            intro: [
              { say: 'If you cut something into 10 equal parts, each part is one tenth.', vis: function (V) { return V.fractionBar(10, 3); } },
              { say: 'Counting in tenths: one tenth, two tenths, three tenths… up to ten tenths, which is one whole.' },
              { say: 'Dividing by 10 makes tenths: 3 ÷ 10 = three tenths.' }
            ],
            method: ['Remember: tenths have a denominator of 10.', 'To count in tenths, add 1 to the numerator each time.', 'To divide a one-digit number by 10, write it over 10.'],
            mistakes: ['Thinking 1/10 is bigger than 1/2 because 10 is bigger.', 'Changing the denominator when counting.'] },
          { id: 'Y3-F-02', statement: 'recognise, find and write fractions of a discrete set of objects: unit fractions and non-unit fractions with small denominators', title: 'Fractions of a set', gens: ['y3FracOfSet'],
            vocab: ['fraction', 'equal groups', 'unit fraction', 'share', 'of'],
            intro: [
              { say: 'To find a quarter of 12, share 12 into 4 equal groups. Each group has 3.', vis: function (V) { return V.dots(12, { perRow: 12, group: 3 }); } },
              { say: 'Three quarters of 12 is 3 of those groups: 3 × 3 = 9.' }
            ],
            method: ['Divide the total by the denominator to find one part.', 'Multiply by the numerator to find that many parts.'],
            mistakes: ['Dividing by the numerator instead of the denominator.', 'Finding one part and forgetting to multiply by the numerator.'] },
          { id: 'Y3-F-03', statement: 'recognise and use fractions as numbers: unit fractions and non-unit fractions with small denominators', title: 'Fractions on a number line', gens: ['y3FracNumberLine'],
            vocab: ['fraction', 'number line', 'equal parts', 'between 0 and 1'],
            intro: [
              { say: 'Fractions are numbers too. They sit between whole numbers on a number line.', vis: function (V) { return V.numberLine({ min: 0, max: 1, step: 0.25, labels: 'ends', arrow: 0.75, format: function (v) { return String(v); } }); } },
              { say: 'This line from 0 to 1 is split into 4 equal parts, so each step is one quarter. The arrow is at three quarters.' }
            ],
            method: ['Count how many equal parts there are between 0 and 1: that is the denominator.', 'Count the steps to the arrow: that is the numerator.'],
            mistakes: ['Counting the marks instead of the gaps.', 'Forgetting that 0 is the start, not 1.'] },
          { id: 'Y3-F-04', statement: 'recognise and show, using diagrams, equivalent fractions with small denominators', title: 'Equivalent fractions', gens: ['y3EquivDiagram'],
            vocab: ['equivalent', 'equal', 'fraction', 'numerator', 'denominator'],
            intro: [
              { say: 'One half and two quarters cover the same amount. They are equivalent fractions.', vis: function (V) { return '<div class="pair">' + V.fractionBar(2, 1) + V.fractionBar(4, 2) + '</div>'; } },
              { say: 'Multiply the top and bottom by the same number to make an equivalent fraction.' }
            ],
            method: ['Look at how the denominator has changed.', 'Do the same to the numerator.', 'Check with a diagram that the shaded amounts match.'],
            mistakes: ['Changing only the denominator.', 'Adding the same number to top and bottom instead of multiplying.'] },
          { id: 'Y3-F-05', statement: 'add and subtract fractions with the same denominator within one whole [for example, 5/7 + 1/7 = 6/7]', title: 'Adding and subtracting fractions', gens: ['y3FracAddSub'],
            vocab: ['add', 'subtract', 'numerator', 'denominator', 'same'],
            intro: [
              { say: 'When the denominators are the same, add the numerators. The denominator stays the same.', vis: function (V) { return V.fractionBar(7, 6); } },
              { say: 'Five sevenths plus one seventh is six sevenths.' }
            ],
            method: ['Check the denominators are the same.', 'Add or subtract the numerators.', 'Keep the same denominator.'],
            mistakes: ['Adding the denominators too, for example 5/7 + 1/7 = 6/14.', 'Changing the denominator when subtracting.'] },
          { id: 'Y3-F-06', statement: 'compare and order unit fractions, and fractions with the same denominators', title: 'Comparing fractions', gens: ['y3FracCompare'],
            vocab: ['compare', 'order', 'unit fraction', 'greater', 'smaller'],
            intro: [
              { say: 'A unit fraction has 1 as its numerator. The more parts a whole is cut into, the smaller each part is: one third is bigger than one fifth.', vis: function (V) { return '<div class="pair">' + V.fractionBar(3, 1) + V.fractionBar(5, 1) + '</div>'; } },
              { say: 'With the same denominator, compare the numerators: four sevenths is bigger than two sevenths.' }
            ],
            method: ['For unit fractions, a bigger denominator means a smaller fraction.', 'For the same denominator, a bigger numerator means a bigger fraction.'],
            mistakes: ['Thinking 1/8 is bigger than 1/4 because 8 is bigger than 4.', 'Comparing denominators when they are the same.'] },
          { id: 'Y3-F-07', statement: 'solve problems that involve all of the above', title: 'Fraction problems', gens: ['y3FracProblems'],
            vocab: ['fraction', 'left', 'eaten', 'share', 'whole'],
            intro: [
              { say: 'There are 20 cakes and a quarter are eaten. A quarter of 20 is 5, so 15 are left.' },
              { say: 'If a pizza has 8 slices and 3 are eaten, five eighths are left.', vis: function (V) { return V.pie(8, 3); } }
            ],
            method: ['Find the fraction of the amount.', 'Decide if the question asks for the part or what is left.', 'Answer the question that was asked.'],
            mistakes: ['Giving the amount eaten when asked how many are left.', 'Forgetting that the whole is all the equal parts together.'] }
        ] },
      { id: 'me', name: 'Measuring Mine', strand: 'Measurement', color: '#3e9a5c', icon: 'ruler', guard: 'Baron Bramblepaw',
        objectives: [
          { id: 'Y3-M-01', statement: 'measure, compare, add and subtract: lengths (m/cm/mm); mass (kg/g); volume/capacity (l/ml)', title: 'Length, mass and capacity', gens: ['y3Measures'],
            vocab: ['metre', 'centimetre', 'millimetre', 'kilogram', 'gram', 'litre', 'millilitre'],
            intro: [
              { say: '1 metre = 100 centimetres. 1 centimetre = 10 millimetres.' },
              { say: '1 kilogram = 1,000 grams. 1 litre = 1,000 millilitres.' },
              { say: 'To compare 1 m 20 cm and 125 cm, make the units the same: 1 m 20 cm = 120 cm.' }
            ],
            method: ['Check the units are the same.', 'Add or subtract the numbers.', 'Write the unit in your answer.'],
            mistakes: ['Adding metres to centimetres without converting.', 'Forgetting that 1 kg is 1,000 g, not 100 g.'] },
          { id: 'Y3-M-02', statement: 'measure the perimeter of simple 2-D shapes', title: 'Perimeter', gens: ['y3Perimeter'],
            vocab: ['perimeter', 'side', 'length', 'rectangle', 'square'],
            intro: [
              { say: 'The perimeter is the distance all the way round the outside of a shape.', vis: function (V) { return V.labelledShape([[0, 0], [6, 0], [6, 3], [0, 3]], ['6 cm', '3 cm', '6 cm', '3 cm']); } },
              { say: 'For this rectangle: 6 + 3 + 6 + 3 = 18 cm.' }
            ],
            method: ['Find the length of every side.', 'Remember opposite sides of a rectangle are equal.', 'Add all the sides together.'],
            mistakes: ['Adding only the two labelled sides.', 'Forgetting to write the units.'] },
          { id: 'Y3-M-03', statement: 'add and subtract amounts of money to give change, using both £ and p in practical contexts', title: 'Money and change', gens: ['y3Money'],
            vocab: ['pound', 'pence', 'change', 'total', 'cost'],
            intro: [
              { say: '£1 = 100p. £3.45 means 3 pounds and 45 pence.' },
              { say: 'To find change from £5 for something costing £3.40, count up: £3.40 to £4 is 60p, then £4 to £5 is £1. Change is £1.60.' }
            ],
            method: ['Change everything to pence if it helps.', 'Add for a total; subtract (or count up) for change.', 'Write the answer with £ and two digits for the pence, or with p.'],
            mistakes: ['Writing £1.6 instead of £1.60.', 'Writing both £ and p, like £1.60p.'] },
          { id: 'Y3-M-04', statement: 'tell and write the time from an analogue clock, including using Roman numerals from I to XII, and 12-hour and 24-hour clocks', title: 'Telling the time', gens: ['y3Clock'],
            vocab: ['hour hand', 'minute hand', 'past', 'to', 'Roman numerals', '24-hour'],
            intro: [
              { say: 'The short hand shows the hour. The long hand shows the minutes; count them in 5s.', vis: function (V) { return V.clock(3, 20); } },
              { say: 'Some clocks use Roman numerals: I is 1, V is 5, X is 10 and XII is 12.', vis: function (V) { return V.clock(9, 45, { roman: true }); } },
              { say: 'On a 24-hour clock, afternoon times add 12 to the hour: 3:20 pm is 15:20.' }
            ],
            method: ['Read the hour from the short hand.', 'Count the minutes in 5s from the 12.', 'For a 24-hour time after noon, add 12 to the hour.'],
            mistakes: ['Mixing up the hour and minute hands.', 'Writing 3:20 pm as 03:20 instead of 15:20.'] },
          { id: 'Y3-M-05', statement: 'estimate and read time with increasing accuracy to the nearest minute; record and compare time in terms of seconds, minutes and hours; use vocabulary such as o’clock, am/pm, morning, afternoon, noon and midnight', title: 'Time to the minute; am and pm', gens: ['y3TimeVocab'],
            vocab: ['am', 'pm', 'noon', 'midnight', 'seconds', 'minutes'],
            intro: [
              { say: 'Each small mark on a clock is one minute. Count in 5s, then count on in 1s.', vis: function (V) { return V.clock(4, 37); } },
              { say: 'am is between midnight and noon (morning). pm is between noon and midnight (afternoon and evening).' }
            ],
            method: ['Count the minutes in 5s, then 1s.', 'Use am for morning times and pm for afternoon and evening times.', 'To compare times, change them to the same unit.'],
            mistakes: ['Saying 8 am for bedtime.', 'Thinking 90 seconds is less than 1 minute.'] },
          { id: 'Y3-M-06', statement: 'know the number of seconds in a minute and the number of days in each month, year and leap year', title: 'Facts about time', gens: ['y3TimeFacts'],
            vocab: ['second', 'minute', 'month', 'year', 'leap year'],
            intro: [
              { say: '60 seconds make 1 minute. 60 minutes make 1 hour. 24 hours make 1 day.' },
              { say: '"30 days has September, April, June and November. All the rest have 31, except February: 28 days, or 29 in a leap year."' },
              { say: 'A year has 365 days. A leap year has 366.' }
            ],
            method: ['Learn the rhyme for the days in each month.', 'Remember: 60 seconds in a minute.', 'Multiply to find more: 3 minutes = 3 × 60 seconds.'],
            mistakes: ['Thinking there are 100 seconds in a minute.', 'Forgetting February is different.'] },
          { id: 'Y3-M-07', statement: 'compare durations of events [for example, to calculate the time taken by particular events or tasks]', title: 'How long does it take?', gens: ['y3Durations'],
            vocab: ['duration', 'start', 'finish', 'how long', 'later'],
            intro: [
              { say: 'A duration is how long something takes. From 3:40 pm to 4:15 pm is 20 minutes to 4:00, then 15 more: 35 minutes.', vis: function (V) { return V.numberLine({ min: 0, max: 35, step: 5, labels: 'none', hops: [{ from: 0, to: 20, label: '20 min' }, { from: 20, to: 35, label: '15 min' }] }); } }
            ],
            method: ['Count on from the start time to the next o’clock.', 'Then count on to the finish time.', 'Add the parts together.'],
            mistakes: ['Subtracting times as if there were 100 minutes in an hour.', 'Forgetting to count the part to the next o’clock.'] }
        ] },
      { id: 'sh', name: 'Shape Chamber', strand: 'Geometry – properties of shapes', color: '#b5652a', icon: 'shapes', guard: 'Lady Mittens',
        objectives: [
          { id: 'Y3-G-01', statement: 'draw 2-D shapes and make 3-D shapes using modelling materials; recognise 3-D shapes in different orientations and describe them', title: '3-D shapes', gens: ['y3Shapes3D'],
            vocab: ['face', 'edge', 'vertex', 'vertices', 'cube', 'cylinder', 'prism'],
            intro: [
              { say: 'A 3-D shape has faces (flat or curved surfaces), edges (where faces meet) and vertices (corners).', vis: function (V) { return V.solid('cuboid'); } },
              { say: 'A cube has 6 square faces, 12 edges and 8 vertices.', vis: function (V) { return V.solid('cube'); } },
              { say: 'A shape is still the same shape when it is turned around.' }
            ],
            method: ['Look at the faces: flat or curved? What shape are they?', 'Count the faces, edges and vertices carefully.', 'Use the shape’s properties to name it.'],
            mistakes: ['Calling a 3-D cube a square.', 'Forgetting the hidden faces at the back.'] },
          { id: 'Y3-G-02', statement: 'recognise angles as a property of shape or a description of a turn', title: 'Angles and turns', gens: ['y3AnglesTurn'],
            vocab: ['angle', 'turn', 'clockwise', 'anticlockwise', 'quarter turn'],
            intro: [
              { say: 'An angle is made where two sides of a shape meet. It is also how far something turns.' },
              { say: 'Clockwise means turning the same way as clock hands: north, east, south, west.' }
            ],
            method: ['Count the corners to find the angles in a shape.', 'For a turn, count the quarter turns.', 'Check the direction: clockwise or anticlockwise.'],
            mistakes: ['Turning the wrong way.', 'Counting the sides instead of the corners.'] },
          { id: 'Y3-G-03', statement: 'identify right angles, recognise that 2 right angles make a half-turn, 3 make three-quarters of a turn and 4 a complete turn; identify whether angles are greater than or less than a right angle', title: 'Right angles', gens: ['y3RightAngles'],
            vocab: ['right angle', 'half turn', 'whole turn', 'greater than', 'less than'],
            intro: [
              { say: 'A right angle is a quarter turn, like the corner of a book. It is marked with a small square.', vis: function (V) { return V.angle(90); } },
              { say: '2 right angles make a half turn, 3 make a three-quarter turn and 4 make a whole turn.' }
            ],
            method: ['Compare the angle with a square corner.', 'If it is more open, it is greater than a right angle; if it is sharper, it is less.'],
            mistakes: ['Thinking longer arms make a bigger angle.', 'Missing right angles that are turned on their side.'] },
          { id: 'Y3-G-04', statement: 'identify horizontal and vertical lines and pairs of perpendicular and parallel lines', title: 'Kinds of lines', gens: ['y3Lines'],
            vocab: ['horizontal', 'vertical', 'parallel', 'perpendicular'],
            intro: [
              { say: 'Horizontal lines are flat, like the horizon. Vertical lines go straight up and down.' },
              { say: 'Parallel lines are always the same distance apart and never meet.', vis: function (V) { return V.linePair('parallel', 0); } },
              { say: 'Perpendicular lines meet at a right angle.', vis: function (V) { return V.linePair('perpendicular', 0); } }
            ],
            method: ['Check whether the lines would ever meet if they kept going.', 'If they meet, check for a right angle.'],
            mistakes: ['Thinking lines must be horizontal to be parallel.', 'Calling any crossing lines perpendicular.'] }
        ] },
      { id: 'st', name: 'Data Den', strand: 'Statistics', color: '#c04f9c', icon: 'chart', guard: 'The Cat King\'s Spy',
        objectives: [
          { id: 'Y3-S-01', statement: 'interpret and present data using bar charts, pictograms and tables', title: 'Bar charts, pictograms and tables', gens: ['y3ReadData'],
            vocab: ['bar chart', 'pictogram', 'table', 'scale', 'key'],
            intro: [
              { say: 'On a bar chart, read across from the top of a bar to the scale. Check how much each line is worth.', vis: function (V) { return V.barChart({ cats: ['Red', 'Blue', 'Green'], values: [6, 10, 4], step: 2, max: 12 }); } },
              { say: 'In a pictogram, the key tells you how much each picture stands for.' }
            ],
            method: ['Read the title and labels.', 'Check the scale or the key.', 'Read each value carefully.'],
            mistakes: ['Assuming every line on the scale is worth 1.', 'Counting pictures without using the key.'] },
          { id: 'Y3-S-02', statement: 'solve one-step and two-step questions [for example ‘How many more?’ and ‘How many fewer?’] using information presented in scaled bar charts and pictograms and tables', title: 'How many more? How many fewer?', gens: ['y3DataProblems'],
            vocab: ['how many more', 'how many fewer', 'altogether', 'difference', 'total'],
            intro: [
              { say: '"How many more" and "how many fewer" mean find the difference: subtract the smaller from the bigger.' },
              { say: '"Altogether" means add all the amounts.' }
            ],
            method: ['Read the two values you need.', 'Decide: difference (subtract) or total (add)?', 'Work it out and check it makes sense.'],
            mistakes: ['Adding when asked how many more.', 'Reading the wrong bar.'] }
        ] }
    ],
    papers: {
      arithmetic: { title: 'Arithmetic paper', minutes: 25, totalMarks: 20, desc: '20 calculations, 1 mark each, using Year 3 content.',
        list: [['y3Mental', 1], ['y3Mental', 2], ['y3Tables', 1], ['y3Tables', 2], ['y3ColAdd', 1], ['y3ColSub', 1], ['y3TenHundred', 1], ['y3MulWritten', 1], ['y3Div', 1], ['y3FracAddSub', 1],
          ['y3Mental', 3], ['y3Tables', 3], ['y3ColAdd', 2], ['y3ColSub', 2], ['y3MulWritten', 2], ['y3Div', 2], ['y3FracAddSub', 2], ['y3ColSub', 3], ['y3MulWritten', 3], ['y3Tables', 2]] },
      reasoning: { title: 'Reasoning paper', minutes: 30, totalMarks: 20, desc: 'Problems and reasoning across every Year 3 topic.',
        list: [['y3Words', 2], ['y3PlaceValue', 2], ['y3Compare', 2], ['y3Represent', 2], ['y3Count', 2], ['y3FracOfSet', 2], ['y3FracNumberLine', 2], ['y3EquivDiagram', 2], ['y3FracCompare', 2], ['y3Measures', 2],
          ['y3Perimeter', 2], ['y3Money', 2], ['y3Clock', 2], ['y3TimeFacts', 2], ['y3Durations', 2], ['y3Shapes3D', 2], ['y3RightAngles', 2], ['y3ReadData', 2], ['y3DataProblems', 2], ['y3MDProblems', 3]] }
    }
  };
  OM.CURRICULUM = OM.CURRICULUM || {};
  OM.CURRICULUM.Y3 = Y3;
  OM.objectiveIndex = OM.objectiveIndex || {};
  Y3.regions.forEach(function (r) { r.objectives.forEach(function (o) { o.region = r.id; o.year = 3; OM.objectiveIndex[o.id] = o; }); });
})(typeof window !== 'undefined' ? window : globalThis);
