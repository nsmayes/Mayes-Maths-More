/* Learn with Pip — Year 4 curriculum map and teaching content.
   Every "statement" below is the statutory requirement, word for word, from:
   DfE, "National curriculum in England: mathematics programmes of study", Year 4 (Crown copyright, Open Government Licence v3.0).
   Checked against the GOV.UK web version on 28 Oct 2026. The automated checks (tests/run-checks.js) fail if any
   objective is missing a lesson, method, common-mistakes list, vocabulary or question generator. */
(function (G) {
  'use strict';
  var OM = G.OM;
  var F = function (n, d, w) { return OM.frac(n, d, w); };

  var Y4 = {
    year: 4, label: 'Year 4', keyStage: 'Lower Key Stage 2', ages: '8–9',
    source: 'DfE National Curriculum in England: mathematics programmes of study (Year 4 statutory requirements)',
    regions: [
      {
        id: 'npv', name: 'Number Glade', strand: 'Number – number and place value', color: '#7b5cc4', icon: 'hash',
        guard: 'Tabitha the Tabby',
        objectives: [
          { id: 'Y4-NPV-01', statement: 'count in multiples of 6, 7, 9, 25 and 1,000', title: 'Counting in 6s, 7s, 9s, 25s and 1,000s', gens: ['countMultiples'],
            vocab: ['multiple', 'sequence', 'step', 'count on', 'count back'],
            intro: [
              { say: 'A multiple is what you land on when you count in equal steps from zero. Counting in 7s: 0, 7, 14, 21, 28…', vis: function (V) { return V.numberLine({ min: 0, max: 42, step: 7, hops: [{ from: 0, to: 7, label: '+7' }, { from: 7, to: 14, label: '+7' }, { from: 14, to: 21, label: '+7' }, { from: 21, to: 28, label: '+7' }, { from: 28, to: 35, label: '+7' }, { from: 35, to: 42, label: '+7' }] }); } },
              { say: 'Counting in 25s is like counting in quarters of 100: 25, 50, 75, 100, 125… Every four steps you reach the next hundred.', vis: function (V) { return V.numberLine({ min: 0, max: 200, step: 25, hops: [{ from: 0, to: 25, label: '+25' }, { from: 25, to: 50, label: '+25' }, { from: 50, to: 75, label: '+25' }, { from: 75, to: 100, label: '+25' }] }); } },
              { say: 'To find a missing number in a sequence, find the step between two numbers that sit next to each other, then count on or back by that step.' }
            ],
            method: ['Find two numbers next to each other and work out the difference: that is the step.', 'Check the step works for the other pairs.', 'Count on (or back) by the step to fill each gap.', 'Check: the next number should still fit the pattern.'],
            mistakes: ['Using the wrong step because you only looked at one pair.', 'Counting on when the sequence is going down.', 'With 25s, forgetting that 75 + 25 = 100 (not 90).'] },
          { id: 'Y4-NPV-02', statement: 'find 1,000 more or less than a given number', title: '1,000 more or less', gens: ['thousandMoreLess'],
            vocab: ['thousands', 'more', 'less', 'digit', 'place value'],
            intro: [
              { say: 'When you find 1,000 more, only the thousands digit changes. 3,456 add 1,000 is 4,456.', vis: function (V) { return V.placeValue(['Th', 'H', 'T', 'O'], ['3', '4', '5', '6'], { highlight: 0 }) + V.placeValue(['Th', 'H', 'T', 'O'], ['4', '4', '5', '6'], { highlight: 0 }); } },
              { say: 'For 1,000 less, the thousands digit goes down by one. The hundreds, tens and ones stay exactly the same.' }
            ],
            method: ['Find the thousands digit.', 'Add 1 to it for 1,000 more, or take 1 away for 1,000 less.', 'Copy the hundreds, tens and ones digits exactly.'],
            mistakes: ['Changing the hundreds digit instead of the thousands.', 'For a 3-digit number, forgetting there are 0 thousands: 1,000 more than 456 is 1,456.', 'Changing other digits by mistake.'] },
          { id: 'Y4-NPV-03', statement: 'count backwards through 0 to include negative numbers', title: 'Counting back past zero', gens: ['negativeCount'],
            vocab: ['negative', 'positive', 'zero', 'minus', 'below zero', 'temperature'],
            intro: [
              { say: 'Numbers carry on below zero. These are negative numbers: −1, −2, −3… The further left on the number line, the smaller the number.', vis: function (V) { return V.numberLine({ min: -10, max: 10, step: 1, labelEvery: 1, format: function (v) { return v < 0 ? '−' + (-v) : String(v); } }); } },
              { say: 'Counting back in 2s from 4: 4, 2, 0, −2, −4. Keep taking the same step even after you pass zero.', vis: function (V) { return V.numberLine({ min: -6, max: 6, step: 1, format: function (v) { return v < 0 ? '−' + (-v) : String(v); }, hops: [{ from: 4, to: 2, label: '−2' }, { from: 2, to: 0, label: '−2' }, { from: 0, to: -2, label: '−2' }, { from: -2, to: -4, label: '−2' }] }); } },
              { say: 'Temperatures use negative numbers. −3°C is colder than 2°C.' }
            ],
            method: ['Draw or picture a number line with zero in the middle.', 'Start at the first number.', 'Take equal jumps to the left to count back (and to the right to count on).', 'Remember: after 0 comes −1, −2, −3 when counting back.'],
            mistakes: ['Thinking −5 is bigger than −2 (it is smaller: further from zero on the left).', 'Missing out zero when counting through it.', 'Forgetting to write the minus sign.'] },
          { id: 'Y4-NPV-04', statement: 'recognise the place value of each digit in a four-digit number (1,000s, 100s, 10s, and 1s)', title: 'Place value in 4-digit numbers', gens: ['placeValue'],
            vocab: ['digit', 'thousands', 'hundreds', 'tens', 'ones', 'partition', 'value'],
            intro: [
              { say: 'In 4,732 each digit has a value that depends on its place. The 4 means 4 thousands, the 7 means 7 hundreds, the 3 means 3 tens and the 2 means 2 ones.', vis: function (V) { return V.placeValue(['Th', 'H', 'T', 'O'], ['4', '7', '3', '2']); } },
              { say: 'We can show it with base 10 blocks: 4 thousand cubes, 7 hundred squares, 3 ten sticks and 2 ones.', vis: function (V) { return V.base10(4732); } },
              { say: 'Partitioning means splitting a number by place value: 4,732 = 4,000 + 700 + 30 + 2.' }
            ],
            method: ['Put the number in a place value chart: Th, H, T, O.', 'The value of a digit = the digit × the value of its column.', 'To partition, write each digit\'s value and add them: thousands + hundreds + tens + ones.', 'A 0 is a place holder: it means none of that column.'],
            mistakes: ['Saying the value of 7 in 4,732 is 7 (it is 700).', 'Forgetting a 0 place holder, e.g. writing 2,609 as 269.', 'Mixing up the columns when the parts are given in a jumbled order.'] },
          { id: 'Y4-NPV-05', statement: 'order and compare numbers beyond 1,000', title: 'Comparing and ordering big numbers', gens: ['compareOrder'],
            vocab: ['greater than', 'less than', 'equal to', 'order', 'ascending', 'descending', 'largest', 'smallest'],
            intro: [
              { say: 'The sign < means "is less than" and > means "is greater than". The open mouth always faces the bigger number: 3,450 < 3,540.' },
              { say: 'To compare, line the numbers up in a place value chart. Start with the biggest place value column. If the thousands are the same, look at the hundreds, then the tens, then the ones.', vis: function (V) { return V.placeValue(['Th', 'H', 'T', 'O'], ['3', '4', '5', '0'], { highlight: 1 }) + V.placeValue(['Th', 'H', 'T', 'O'], ['3', '5', '4', '0'], { highlight: 1 }); } }
            ],
            method: ['Check how many digits each number has: more digits means bigger (for whole numbers).', 'Compare the thousands digits.', 'If they are the same, compare the hundreds, then tens, then ones.', 'The first column that is different decides which number is bigger.'],
            mistakes: ['Looking at the ones digit first.', 'Pointing the < or > sign the wrong way.', 'Thinking a number with more 9s is bigger (e.g. 999 is less than 1,000).'] },
          { id: 'Y4-NPV-06', statement: 'identify, represent and estimate numbers using different representations', title: 'Number lines and representations', gens: ['representNumbers'],
            vocab: ['number line', 'interval', 'estimate', 'represent', 'halfway'],
            intro: [
              { say: 'On a number line, first work out what each small step is worth. Here, 0 to 1,000 is split into 10 equal steps, so each step is 100.', vis: function (V) { return V.numberLine({ min: 0, max: 1000, step: 100, arrow: 600 }); } },
              { say: 'The same number can be shown in different ways: digits, words, base 10 blocks or a place value chart.', vis: function (V) { return V.base10(1325); } }
            ],
            method: ['Look at the two labelled numbers and count the steps between them.', 'Step size = difference ÷ number of steps.', 'Count on in steps from the nearest label to the arrow.', 'For blocks: count thousands, hundreds, tens and ones, then put the digits together.'],
            mistakes: ['Assuming every step is worth 1 or 10.', 'Counting the marks instead of the jumps between marks.', 'Forgetting a zero place holder when there are no tens or hundreds.'] },
          { id: 'Y4-NPV-07', statement: 'round any number to the nearest 10, 100 or 1,000', title: 'Rounding to 10, 100 and 1,000', gens: ['rounding'],
            vocab: ['round', 'nearest', 'multiple', 'halfway', 'estimate'],
            intro: [
              { say: 'Rounding means finding the nearest "friendly" number. 3,640 to the nearest 100: it is between 3,600 and 3,700. It is nearer 3,600.', vis: function (V) { return V.numberLine({ min: 3600, max: 3700, step: 10, labels: 'ends', labelValues: [3600, 3650, 3700], points: [{ v: 3640, label: '3,640' }] }); } },
              { say: 'If a number is exactly halfway, we round up. 3,650 rounds up to 3,700.' }
            ],
            method: ['Find the two multiples the number sits between (e.g. 3,600 and 3,700).', 'Find the halfway number (3,650).', 'Look at the digit to the right of the place you are rounding to: 5 or more → round up; 4 or less → round down.', 'Digits after the rounding place become zeros.'],
            mistakes: ['Looking at the wrong digit to decide.', 'Rounding down when the number is exactly halfway (halfway rounds up).', 'Forgetting to change the digit when rounding up across a boundary, e.g. 4,960 to the nearest 100 is 5,000.'] },
          { id: 'Y4-NPV-08', statement: 'solve number and practical problems that involve all of the above and with increasingly large positive numbers', title: 'Number puzzles', gens: ['digitPuzzles'],
            vocab: ['digit', 'largest', 'smallest', 'even', 'odd', 'closest'],
            intro: [
              { say: 'With digit cards 3, 8, 1 and 6, the largest number puts the biggest digits in the biggest places: 8,631. The smallest is 1,368.' },
              { say: 'A zero can never go first in a 4-digit number. The smallest number with 0, 2, 5, 7 is 2,057.' }
            ],
            method: ['Read the question carefully: largest, smallest, even, odd, or closest to something?', 'For largest: put digits in order from biggest to smallest.', 'For smallest: smallest first, but never 0 at the front.', 'For even numbers: the ones digit must be 0, 2, 4, 6 or 8. Choose that first, then make the rest as big (or small) as possible.', 'Check you used every card exactly once.'],
            mistakes: ['Putting 0 at the front of the number.', 'Using a card twice or leaving one out.', 'For "largest even", making the largest number and forgetting it must end in an even digit.'] },
          { id: 'Y4-NPV-09', statement: 'read Roman numerals to 100 (I to C) and know that over time, the numeral system changed to include the concept of 0 and place value', title: 'Roman numerals', gens: ['roman'],
            vocab: ['Roman numeral', 'I', 'V', 'X', 'L', 'C', 'place value', 'zero'],
            intro: [
              { say: 'The Romans used letters for numbers: I is 1, V is 5, X is 10, L is 50 and C is 100.', vis: function () { return OM.V.table(['I', 'V', 'X', 'L', 'C'], [['1', '5', '10', '50', '100']]); } },
              { say: 'Usually you add the values: XVI = 10 + 5 + 1 = 16. But if a smaller numeral comes before a bigger one, you take it away: IV = 4, IX = 9, XL = 40, XC = 90.' },
              { say: 'Roman numerals have no zero and no place value. Our number system uses zero and place value, which makes big numbers much easier to write.' }
            ],
            method: ['Write the value under each numeral.', 'Read left to right. If a numeral is smaller than the one after it, subtract it.', 'Otherwise add it.', 'To write a number in Roman numerals: split it into tens and ones (e.g. 49 = 40 + 9 = XL + IX = XLIX).'],
            mistakes: ['Writing IIII for 4 (it is IV).', 'Reading IX as 11 (it is 9).', 'Writing 49 as IL (Romans write XLIX).'] }
        ]
      },
      {
        id: 'as', name: 'Adding Brook', strand: 'Number – addition and subtraction', color: '#2f7fd0', icon: 'plusminus',
        guard: 'Sir Whiskers',
        objectives: [
          { id: 'Y4-AS-01', statement: 'add and subtract numbers with up to 4 digits using the formal written methods of columnar addition and subtraction where appropriate', title: 'Column addition and subtraction', gens: ['columnAdd', 'columnSub'],
            vocab: ['column', 'exchange', 'ones', 'tens', 'hundreds', 'thousands', 'total', 'difference'],
            intro: [
              { say: 'Column addition: line up the digits by place value and add one column at a time, starting with the ones.', vis: function (V) { return V.column({ a: 2475, b: 1368, op: '+', answer: '', upto: 0 }); } },
              { say: 'If a column adds up to 10 or more, exchange ten of them for one in the next column. Write the exchanged 1 under the next column.', vis: function (V) { return V.base10(15); } },
              { say: 'Column subtraction: if the top digit is smaller than the bottom digit, exchange one from the next column on the left. 1 ten becomes 10 ones.' }
            ],
            method: ['Write the numbers in columns: thousands under thousands, hundreds under hundreds, and so on.', 'Start with the ones column (on the right).', 'Adding: if a column total is 10 or more, write the ones digit and exchange the ten into the next column.', 'Subtracting: if the top digit is smaller, exchange 1 from the column to the left (it becomes 10 in this column).', 'Work right to left until every column is done.', 'Check with the inverse: subtraction checks addition, addition checks subtraction.'],
            mistakes: ['Not lining up the columns (especially when one number has fewer digits).', 'Forgetting to add the exchanged digit.', 'In subtraction, taking the smaller digit from the larger one instead of exchanging.', 'When exchanging across a zero, forgetting to exchange from the next column first.'] },
          { id: 'Y4-AS-02', statement: 'estimate and use inverse operations to check answers to a calculation', title: 'Estimate and check', gens: ['estimateInverse'],
            vocab: ['estimate', 'round', 'inverse', 'check', 'approximately'],
            intro: [
              { say: 'An estimate is a sensible guess. Round the numbers first: 3,478 + 2,215 is about 3,500 + 2,200 = 5,700.' },
              { say: 'Addition and subtraction are inverse operations: they undo each other. If 6,213 − 2,847 = 3,366, then 3,366 + 2,847 should equal 6,213.' }
            ],
            method: ['To estimate, round each number (to the nearest 100 or 1,000, as asked).', 'Do the easier calculation with the rounded numbers.', 'Compare your answer with the estimate. If they are far apart, check again.', 'To check with the inverse: for a − b = c, work out c + b; for a + b = c, work out c − b.'],
            mistakes: ['Rounding to the wrong place value.', 'Using the same operation again instead of the inverse.', 'Adding the answer to the first number instead of the second.'] },
          { id: 'Y4-AS-03', statement: 'solve addition and subtraction two-step problems in contexts, deciding which operations and methods to use and why', title: 'Two-step problems', gens: ['asTwoStep'],
            vocab: ['altogether', 'total', 'left', 'more than', 'fewer than', 'difference', 'step'],
            intro: [
              { say: 'A two-step problem needs two calculations. Read it carefully and decide what to do first.' },
              { say: 'Bar models help. If a shop has 2,345 books, gets 1,278 more and then sells 965, first add to find the new total, then subtract.', vis: function (V) { return V.barModel({ parts: 2, total: '2,345 + 1,278', partLabel: '' }); } },
              { say: 'In a test, always show your working. Even if your final answer is wrong, a correct method can earn you a mark.' }
            ],
            method: ['Read the problem twice. Underline the numbers and the question.', 'Decide step 1: add or subtract? Why?', 'Use the answer from step 1 in step 2.', 'Write each calculation in the working box, e.g. 2,345 + 1,278 = 3,623.', 'Check: is the answer sensible? Use estimation or the inverse.'],
            mistakes: ['Only doing one step.', 'Adding when the question needs subtraction ("how many are left", "how many more").', 'Not showing working, so no method mark is possible.'] }
        ]
      },
      {
        id: 'md', name: 'Times Table Thicket', strand: 'Number – multiplication and division', color: '#d2475b', icon: 'array',
        guard: 'Countess Purrwell',
        objectives: [
          { id: 'Y4-MD-01', statement: 'recall multiplication and division facts for multiplication tables up to 12 × 12', title: 'Times tables to 12 × 12', gens: ['timesTables'],
            vocab: ['multiply', 'times', 'divide', 'product', 'multiple', 'fact family'],
            intro: [
              { say: 'An array shows multiplication: 3 rows of 4 is 3 × 4 = 12, and it is also 4 × 3.', vis: function (V) { return V.array(3, 4); } },
              { say: 'Every multiplication fact gives you division facts too. 7 × 8 = 56, so 56 ÷ 8 = 7 and 56 ÷ 7 = 8. This is a fact family.' },
              { say: 'In June of Year 4 you take the Multiplication Tables Check: 25 questions, 6 seconds each. Practise in the Tables Tree to get speedy!' }
            ],
            method: ['Know your facts: practise a little every day.', 'Use facts you know: 6 × 7 is double 3 × 7.', '9 times table: 10 times it, then take one lot away (9 × 7 = 70 − 7).', 'For division, think: what times this number makes the total?'],
            mistakes: ['Mixing up 6 × 8 and 7 × 8 (48 and 56).', 'Adding instead of multiplying.', 'For division, dividing the wrong way round.'] },
          { id: 'Y4-MD-02', statement: 'use place value, known and derived facts to multiply and divide mentally, including: multiplying by 0 and 1; dividing by 1; multiplying together 3 numbers', title: 'Mental multiplying and dividing', gens: ['mentalMD'],
            vocab: ['multiply', 'divide', 'derived fact', 'zero', 'one', 'place value'],
            intro: [
              { say: 'Any number × 1 stays the same. Any number × 0 is 0. Any number ÷ 1 stays the same.' },
              { say: 'Use known facts with place value: 6 × 7 = 42, so 6 × 70 = 420 (ten times bigger).', vis: function (V) { return V.placeValue(['H', 'T', 'O'], ['', '4', '2']) + V.placeValue(['H', 'T', 'O'], ['4', '2', '0']); } },
              { say: 'Multiplying 3 numbers: you can multiply them in any order. 2 × 7 × 5 is easier as 2 × 5 = 10, then 10 × 7 = 70.' }
            ],
            method: ['Look for × 0, × 1 or ÷ 1 first: these are quick.', 'For multiples of 10 or 100: use the known fact, then make it 10 or 100 times bigger.', 'For three numbers: pick the pair that is easiest to multiply first (look for 2 × 5, 4 × 25 or a 10).'],
            mistakes: ['Thinking 5 × 0 = 5 (it is 0).', 'Adding a zero to the wrong number when using place value.', 'Multiplying only two of the three numbers.'] },
          { id: 'Y4-MD-03', statement: 'recognise and use factor pairs and commutativity in mental calculations', title: 'Factor pairs', gens: ['factorPairs'],
            vocab: ['factor', 'factor pair', 'commutative', 'product', 'array'],
            intro: [
              { say: 'A factor pair is two numbers that multiply to make a number. 24 = 1 × 24, 2 × 12, 3 × 8, 4 × 6.', vis: function (V) { return V.array(4, 6); } },
              { say: 'Commutativity means you can multiply in any order: 4 × 6 = 6 × 4. So 6 × 4 is not a new factor pair.' }
            ],
            method: ['Start at 1: 1 × the number is always a factor pair.', 'Try 2, 3, 4… Does it divide exactly? If yes, find its partner.', 'Stop when the pairs start repeating.', 'Use factor pairs to make calculations easier, e.g. 16 × 5 = 8 × 2 × 5 = 8 × 10 = 80.'],
            mistakes: ['Forgetting the pair 1 × the number.', 'Counting 4 × 6 and 6 × 4 as two different pairs.', 'Missing a pair in the middle.'] },
          { id: 'Y4-MD-04', statement: 'multiply two-digit and three-digit numbers by a one-digit number using formal written layout', title: 'Short multiplication', gens: ['shortMult'],
            vocab: ['short multiplication', 'exchange', 'column', 'product'],
            intro: [
              { say: 'Short multiplication: write the bigger number on top and the one-digit number underneath on the right.', vis: function (V) { return V.column({ a: 347, b: 6, op: '×', answer: '', upto: 0 }); } },
              { say: 'Multiply each digit, starting with the ones. If the answer is 10 or more, write the ones digit and exchange the tens into the next column. Add exchanged digits after you multiply the next column.' }
            ],
            method: ['Write the numbers in columns, with the one-digit number under the ones.', 'Multiply the ones digit. Write the ones of the answer; exchange any tens under the tens column.', 'Multiply the tens digit, then add the exchanged digit.', 'Repeat for the hundreds.', 'Estimate first to check: 347 × 6 is about 350 × 6 = 2,100.'],
            mistakes: ['Adding the exchanged digit before multiplying (it is added after).', 'Forgetting the exchanged digit altogether.', 'Writing the whole of a two-digit product in one column.'] },
          { id: 'Y4-MD-05', statement: 'solve problems involving multiplying and adding, including using the distributive law to multiply two-digit numbers by 1 digit, integer scaling problems and harder correspondence problems such as n objects are connected to m objects', title: 'Multiplying problems', gens: ['mdProblems'],
            vocab: ['times as many', 'scale', 'combinations', 'partition', 'distributive'],
            intro: [
              { say: 'The distributive law: split a number to multiply it. 23 × 4 = 20 × 4 + 3 × 4 = 80 + 12 = 92.', vis: function (V) { return V.barModel({ parts: 2, total: '23 × 4', partLabel: '' }); } },
              { say: 'Scaling: "5 times as long" means multiply by 5.' },
              { say: 'Correspondence: 3 hats and 4 scarves make 3 × 4 = 12 different outfits, because each hat can go with each scarf.' }
            ],
            method: ['Decide what the problem is asking: scaling, combinations, or a total.', 'For the distributive law: split into tens and ones, multiply each, then add.', 'For combinations: multiply the number of choices for each thing.', 'For multi-step problems: write each step in the working box.'],
            mistakes: ['Adding 3 + 4 for combinations instead of multiplying.', 'Forgetting to add the two parts in the distributive law.', 'Forgetting the extra item in a "buy and add" problem.'] }
        ]
      },
      {
        id: 'fr', name: 'Fraction Falls', strand: 'Number – fractions (including decimals)', color: '#d9861a', icon: 'pie',
        guard: 'Captain Clawdia',
        objectives: [
          { id: 'Y4-F-01', statement: 'recognise and show, using diagrams, families of common equivalent fractions', title: 'Equivalent fractions', gens: ['equivFractions'],
            vocab: ['equivalent', 'numerator', 'denominator', 'fraction', 'whole'],
            intro: [
              { say: 'Equivalent fractions are worth the same amount. One half is the same as two quarters and four eighths.', vis: function (V) { return V.fractionWall([{ d: 2, shaded: 1, label: F(1, 2) }, { d: 4, shaded: 2, label: F(2, 4) }, { d: 8, shaded: 4, label: F(4, 8) }]); } },
              { say: 'To make an equivalent fraction, multiply (or divide) the numerator and the denominator by the same number.' }
            ],
            method: ['Look at the denominators: what has the first been multiplied by to make the second?', 'Do the same to the numerator.', 'Check with a diagram: the shaded amount should be the same.'],
            mistakes: ['Adding the same number to top and bottom (that does not make an equivalent fraction).', 'Only changing the denominator.', 'Multiplying the numerator by a different number to the denominator.'] },
          { id: 'Y4-F-02', statement: 'count up and down in hundredths; recognise that hundredths arise when dividing an object by 100 and dividing tenths by 10', title: 'Hundredths', gens: ['hundredths'],
            vocab: ['hundredth', 'tenth', 'decimal', 'decimal point'],
            intro: [
              { say: 'Split a whole into 100 equal parts: each part is one hundredth. 37 parts shaded is ' + F(37, 100) + ', or 0.37.', vis: function (V) { return V.hundredSquare(37); } },
              { say: 'One tenth split into 10 equal parts makes 10 hundredths. So 3 tenths = 30 hundredths.' },
              { say: 'Counting up in hundredths: 0.08, 0.09, 0.10, 0.11. After 9 hundredths comes 1 tenth.' }
            ],
            method: ['Hundredths are written with a denominator of 100, or with 2 digits after the decimal point.', 'Counting in hundredths: add 1 to the hundredths digit. After 9, exchange for 1 tenth.', 'To change tenths to hundredths: multiply the number of tenths by 10.'],
            mistakes: ['After 0.09, writing 0.010 instead of 0.10.', 'Thinking 3 tenths is 3 hundredths.', 'Writing 7 hundredths as 0.7 (it is 0.07).'] },
          { id: 'Y4-F-03', statement: 'solve problems involving increasingly harder fractions to calculate quantities, and fractions to divide quantities, including non-unit fractions where the answer is a whole number', title: 'Fractions of amounts', gens: ['fractionOfAmount'],
            vocab: ['fraction of', 'unit fraction', 'non-unit fraction', 'divide', 'equal parts'],
            intro: [
              { say: 'To find ' + F(1, 4) + ' of 28, divide 28 into 4 equal parts: 28 ÷ 4 = 7.', vis: function (V) { return V.barModel({ parts: 4, total: '28', partLabel: '7', shaded: 1 }); } },
              { say: 'To find ' + F(3, 4) + ' of 28, find one quarter (7), then take 3 of them: 7 × 3 = 21.', vis: function (V) { return V.barModel({ parts: 4, total: '28', partLabel: '7', shaded: 3 }); } }
            ],
            method: ['Divide by the denominator to find one part.', 'Multiply by the numerator to find how many parts you need.', 'Draw a bar model if it helps.'],
            mistakes: ['Dividing by the numerator instead of the denominator.', 'Finding one part and forgetting to multiply by the numerator.', 'For "how many are left?", forgetting the extra step.'] },
          { id: 'Y4-F-04', statement: 'add and subtract fractions with the same denominator', title: 'Adding and subtracting fractions', gens: ['fracAddSub'],
            vocab: ['numerator', 'denominator', 'improper fraction', 'mixed number', 'whole'],
            intro: [
              { say: 'When the denominators are the same, add or subtract the numerators. The denominator stays the same. ' + F(2, 7) + ' + ' + F(3, 7) + ' = ' + F(5, 7) + '.', vis: function (V) { return V.fractionBar(7, 5); } },
              { say: 'If the answer is more than one whole, you can write it as an improper fraction or a mixed number: ' + F(11, 8) + ' = ' + F(3, 8, 1) + '.' },
              { say: 'One whole is the same as ' + F(8, 8) + '. So 1 − ' + F(3, 8) + ' = ' + F(8, 8) + ' − ' + F(3, 8) + ' = ' + F(5, 8) + '.' }
            ],
            method: ['Check the denominators are the same.', 'Add or subtract the numerators only.', 'Keep the same denominator.', 'If subtracting from a whole number, change the whole into a fraction with the same denominator.'],
            mistakes: ['Adding the denominators too (2/7 + 3/7 is not 5/14).', 'Forgetting that 1 = 8/8 when subtracting from one whole.', 'Mistakes changing an improper fraction to a mixed number.'] },
          { id: 'Y4-F-05', statement: 'recognise and write decimal equivalents of any number of tenths or hundreds', title: 'Tenths and hundredths as decimals', gens: ['decimalTenthsHundredths'],
            note: 'The GOV.UK web page reads "tenths or hundreds"; the published PDF reads "tenths or hundredths". We teach hundredths, as in the PDF.',
            vocab: ['decimal', 'decimal point', 'tenths', 'hundredths', 'equivalent'],
            intro: [
              { say: 'The first place after the decimal point is tenths. ' + F(7, 10) + ' = 0.7.', vis: function (V) { return V.placeValue(['O', 't', 'h'], ['0', '7', ''], { pointAfter: 0 }); } },
              { say: 'The second place after the decimal point is hundredths. ' + F(23, 100) + ' = 0.23 (2 tenths and 3 hundredths).', vis: function (V) { return V.placeValue(['O', 't', 'h'], ['0', '2', '3'], { pointAfter: 0 }); } },
              { say: 'Careful: ' + F(3, 100) + ' = 0.03, not 0.3. The zero holds the tenths place.' }
            ],
            method: ['Tenths: write the numerator in the tenths column: 7/10 = 0.7.', 'Hundredths: the numerator fills the tenths and hundredths columns: 23/100 = 0.23.', 'If there are fewer than 10 hundredths, put a 0 in the tenths column: 3/100 = 0.03.', 'Decimals to fractions: two decimal places → denominator 100.'],
            mistakes: ['Writing 3/100 as 0.3.', 'Writing 0.45 as 45/10.', 'Forgetting the 0 before the decimal point (we write 0.7, not .7).'] },
          { id: 'Y4-F-06', statement: 'recognise and write decimal equivalents to 1/4, 1/2, 3/4', title: 'Quarters and halves as decimals', gens: ['decimalQuarters'],
            vocab: ['half', 'quarter', 'three quarters', 'decimal'],
            intro: [
              { say: 'Half of 100 squares is 50 squares: ' + F(1, 2) + ' = ' + F(50, 100) + ' = 0.5.', vis: function (V) { return V.hundredSquare(50); } },
              { say: 'A quarter of 100 is 25: ' + F(1, 4) + ' = 0.25. Three quarters is 75: ' + F(3, 4) + ' = 0.75.', vis: function (V) { return V.hundredSquare(75); } }
            ],
            method: ['Remember: 1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75.', 'Think of money: a quarter of £1 is 25p = £0.25.', 'To compare a fraction and a decimal, change them both into decimals.'],
            mistakes: ['Writing 1/4 as 0.4 or 0.14.', 'Writing 3/4 as 0.34.', 'Thinking 0.5 is smaller than 0.25 because 5 < 25.'] },
          { id: 'Y4-F-07', statement: 'find the effect of dividing a one- or two-digit number by 10 and 100, identifying the value of the digits in the answer as ones, tenths and hundredths', title: 'Dividing by 10 and 100', gens: ['divide10100'],
            vocab: ['divide', 'ten times smaller', 'tenths', 'hundredths', 'place value'],
            intro: [
              { say: 'Dividing by 10 makes a number ten times smaller. Every digit moves one place to the right. 36 ÷ 10 = 3.6.', vis: function (V) { return V.placeValue(['T', 'O', 't', 'h'], ['3', '6', '', ''], { pointAfter: 1 }) + V.placeValue(['T', 'O', 't', 'h'], ['', '3', '6', ''], { pointAfter: 1 }); } },
              { say: 'Dividing by 100 moves every digit two places to the right. 7 ÷ 100 = 0.07: 0 ones, 0 tenths and 7 hundredths.' }
            ],
            method: ['Put the number in a place value chart.', '÷ 10: move every digit one place right. ÷ 100: two places right.', 'Put a 0 in the ones column if it is empty, and zeros as place holders where needed.', 'Say the value of each digit: e.g. in 3.6, the 3 is 3 ones and the 6 is 6 tenths.'],
            mistakes: ['Moving the digits the wrong way (getting a bigger number).', 'Writing 7 ÷ 100 as 0.7.', '"Taking off a zero" — this does not work for numbers like 36.'] },
          { id: 'Y4-F-08', statement: 'round decimals with 1 decimal place to the nearest whole number', title: 'Rounding decimals', gens: ['roundDecimals'],
            vocab: ['round', 'nearest whole number', 'tenths', 'halfway'],
            intro: [
              { say: '4.7 is between 4 and 5. It is nearer 5, so 4.7 rounds to 5.', vis: function (V) { return V.numberLine({ min: 40, max: 50, step: 1, labels: 'ends', labelValues: [40, 45, 50], format: function (v) { return OM.fromScaled(v, 1).replace('.0', ''); }, points: [{ v: 47, label: '4.7' }] }); } },
              { say: 'Look at the tenths digit. 5 or more rounds up; 4 or less rounds down. 6.5 rounds up to 7.' }
            ],
            method: ['Find the two whole numbers it sits between.', 'Look at the tenths digit.', '0–4: round down to the smaller whole number. 5–9: round up to the bigger whole number.'],
            mistakes: ['Rounding 6.5 down (halfway rounds up).', 'Rounding to the nearest tenth instead of the nearest whole number.', 'Rounding 9.6 to 9 instead of 10.'] },
          { id: 'Y4-F-09', statement: 'compare numbers with the same number of decimal places up to 2 decimal places', title: 'Comparing decimals', gens: ['compareDecimals'],
            vocab: ['compare', 'greater than', 'less than', 'tenths', 'hundredths', 'order'],
            intro: [
              { say: 'Compare decimals like whole numbers: start with the biggest place value. For 0.54 and 0.45, look at the tenths: 5 tenths is more than 4 tenths, so 0.54 > 0.45.', vis: function (V) { return V.placeValue(['O', 't', 'h'], ['0', '5', '4'], { pointAfter: 0, highlight: 1 }) + V.placeValue(['O', 't', 'h'], ['0', '4', '5'], { pointAfter: 0, highlight: 1 }); } }
            ],
            method: ['Line the numbers up by the decimal point.', 'Compare the ones first, then the tenths, then the hundredths.', 'The first column that is different decides.'],
            mistakes: ['Looking at the last digit first.', 'Pointing the < or > sign the wrong way.', 'Thinking 0.45 > 0.54 because 5 is the bigger last digit.'] },
          { id: 'Y4-F-10', statement: 'solve simple measure and money problems involving fractions and decimals to 2 decimal places', title: 'Money and measure problems', gens: ['decimalProblems'],
            vocab: ['pounds', 'pence', 'change', 'total', 'metres', 'decimal'],
            intro: [
              { say: '£1 = 100p. £3.45 means 3 pounds and 45 pence. Always write 2 digits after the decimal point for pence: £2.50, not £2.5.' },
              { say: 'To find change, subtract from the money paid: £5.00 − £3.45. Count up: £3.45 → £3.50 is 5p, £3.50 → £5.00 is £1.50. Change = £1.55.', vis: function (V) { return V.numberLine({ min: 345, max: 500, step: 5, labels: 'none', labelValues: [345, 350, 500], format: function (v) { return OM.pounds(v); }, hops: [{ from: 345, to: 350, label: '5p' }, { from: 350, to: 500, label: '£1.50' }] }); } }
            ],
            method: ['Write amounts with the same units (all £ or all p).', 'Line up the decimal points if using the column method.', 'For change: subtract, or count up from the price to the amount paid.', 'Write money answers with two decimal places: £1.50.'],
            mistakes: ['Writing £1.5 instead of £1.50.', 'Mixing £ and p in one calculation.', 'Not lining up decimal points.'] }
        ]
      },
      {
        id: 'me', name: 'Measuring Marsh', strand: 'Measurement', color: '#3e9a5c', icon: 'ruler',
        guard: 'Baron Bramblepaw',
        objectives: [
          { id: 'Y4-M-01', statement: 'convert between different units of measure [for example, kilometre to metre; hour to minute]', title: 'Converting units', gens: ['convertUnits'],
            vocab: ['kilometre', 'metre', 'centimetre', 'millimetre', 'kilogram', 'gram', 'litre', 'millilitre', 'convert'],
            intro: [
              { say: 'Key facts: 1 km = 1,000 m. 1 m = 100 cm. 1 cm = 10 mm. 1 kg = 1,000 g. 1 litre = 1,000 ml.', vis: function () { return OM.V.table(['Length', 'Mass', 'Capacity'], [['1 km = 1,000 m', '1 kg = 1,000 g', '1 l = 1,000 ml'], ['1 m = 100 cm', '', ''], ['1 cm = 10 mm', '', '']]); } },
              { say: 'Big unit to small unit: multiply. 4 km = 4 × 1,000 = 4,000 m. Small unit to big unit: divide. 6,000 g = 6 kg.' }
            ],
            method: ['Find the conversion fact (e.g. 1 km = 1,000 m).', 'Big → small: multiply. Small → big: divide.', 'For mixed units like 3 km 450 m: convert the km, then add the m: 3,000 + 450 = 3,450 m.'],
            mistakes: ['Multiplying when you should divide.', 'Using the wrong fact (1 m = 1,000 cm is wrong).', 'For 4 km 50 m, writing 4,500 m instead of 4,050 m.'] },
          { id: 'Y4-M-02', statement: 'measure and calculate the perimeter of a rectilinear figure (including squares) in centimetres and metres', title: 'Perimeter', gens: ['perimeter'],
            vocab: ['perimeter', 'rectilinear', 'side', 'length', 'width', 'centimetre', 'metre'],
            intro: [
              { say: 'The perimeter is the distance all the way around the outside of a shape. Add up the lengths of all the sides.', vis: function (V) { return V.labelledShape([[0, 0], [6, 0], [6, 4], [0, 4]], ['6 cm', '4 cm', '6 cm', '4 cm']); } },
              { say: 'A rectilinear shape has only straight sides that meet at right angles. If a side is not labelled, work it out from the other sides.', vis: function (V) { return V.labelledShape([[0, 0], [5, 0], [5, 2], [3, 2], [3, 4], [0, 4]], ['5 cm', '2 cm', '?', '2 cm', '3 cm', '4 cm']); } }
            ],
            method: ['Find any missing side lengths first (opposite sides add up to the same total).', 'Mark a starting corner and go around, adding each side.', 'Count the sides as you go so you do not miss one.', 'Write the units (cm or m).', 'Square: perimeter = side × 4. Rectangle: (length + width) × 2.'],
            mistakes: ['Only adding the labelled sides and missing unlabelled ones.', 'Counting a side twice.', 'Mixing up perimeter (around the edge) and area (the space inside).'] },
          { id: 'Y4-M-03', statement: 'find the area of rectilinear shapes by counting squares', title: 'Area by counting squares', gens: ['area'],
            vocab: ['area', 'square centimetre', 'cm²', 'rectilinear', 'counting squares'],
            intro: [
              { say: 'Area is the amount of space inside a shape. On squared paper, count the squares. Each square here is 1 square centimetre (1 cm²).', vis: function (V) { return V.gridShape([[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2], [1, 3]], { cols: 6, rows: 5 }); } },
              { say: 'For a rectangle you can count rows: 3 rows of 4 squares = 12 squares.' }
            ],
            method: ['Count the squares carefully: mark each one as you count it (or count in rows).', 'Write the units: cm² (square centimetres).', 'To compare two shapes, find both areas, then subtract.'],
            mistakes: ['Counting a square twice or missing one.', 'Counting the edges (perimeter) instead of the squares.', 'Forgetting the units.'] },
          { id: 'Y4-M-04', statement: 'estimate, compare and calculate different measures, including money in pounds and pence', title: 'Money and measures', gens: ['moneyMeasures'],
            vocab: ['pounds', 'pence', 'total', 'change', 'compare', 'estimate'],
            intro: [
              { say: '100p = £1. To change pence into pounds, divide by 100: 350p = £3.50.' },
              { say: 'To compare amounts, write them in the same units first: £3.05 is 305p, which is less than 350p.' }
            ],
            method: ['Change all the amounts into the same unit.', 'Add to find a total; subtract to find change or a difference.', 'Estimate first to check your answer is sensible.', 'In multi-step problems, show each calculation.'],
            mistakes: ['Writing 350p as £35.0 or £3.5.', 'Comparing £ with p without converting.', 'Forgetting one of the items in a total.'] },
          { id: 'Y4-M-05', statement: 'read, write and convert time between analogue and digital 12- and 24-hour clocks', title: 'Telling the time', gens: ['clocks'],
            vocab: ['analogue', 'digital', '12-hour', '24-hour', 'am', 'pm', 'midnight', 'noon'],
            intro: [
              { say: 'On an analogue clock, the short hand shows the hour and the long hand shows the minutes. Each number on the clock is 5 minutes for the minute hand.', vis: function (V) { return V.clock(3, 40); } },
              { say: 'am means morning (after midnight) and pm means afternoon or evening (after noon). The 24-hour clock does not need am or pm: after 12:59 comes 13:00, which is 1 pm.' },
              { say: 'To change pm times to 24-hour, add 12 to the hour: 4:20 pm = 16:20. 24-hour times always have 4 digits: 7 am is 07:00.' }
            ],
            method: ['Analogue: read the hour hand first (the last number it has passed), then count the minutes in 5s.', '12-hour pm → 24-hour: add 12 to the hour (except 12 pm, which stays 12).', '24-hour → 12-hour: if the hour is 13 or more, take away 12 and write pm.', 'Midnight is 00:00 and 12 am; noon is 12:00 and 12 pm.'],
            mistakes: ['Reading the hour as the number the hour hand is nearest to, instead of the one it has passed.', 'Writing 16:20 pm (no am/pm with 24-hour times).', 'Changing 12:30 am to 12:30 (it is 00:30).'] },
          { id: 'Y4-M-06', statement: 'solve problems involving converting from hours to minutes, minutes to seconds, years to months, weeks to days', title: 'Converting time', gens: ['timeConvert'],
            vocab: ['hour', 'minute', 'second', 'week', 'day', 'month', 'year', 'duration'],
            intro: [
              { say: 'Time facts: 1 hour = 60 minutes. 1 minute = 60 seconds. 1 week = 7 days. 1 year = 12 months.', vis: function () { return OM.V.table(['Fact', ''], [['1 hour', '60 minutes'], ['1 minute', '60 seconds'], ['1 week', '7 days'], ['1 year', '12 months']]); } },
              { say: '2 hours 15 minutes = 2 × 60 + 15 = 135 minutes. Time is not in 100s, so be careful!' }
            ],
            method: ['Find the fact you need.', 'Bigger unit → smaller unit: multiply. e.g. 3 hours × 60 = 180 minutes.', 'Smaller → bigger: divide, and any remainder stays in the smaller unit: 150 seconds = 2 minutes 30 seconds.', 'For finishing times: add the hours, then the minutes, and exchange 60 minutes for 1 hour.'],
            mistakes: ['Using 100 minutes in an hour.', 'Forgetting to add the extra minutes after multiplying the hours.', 'Writing 150 seconds as 1 minute 50 seconds.'] }
        ]
      },
      {
        id: 'sh', name: 'Shape Stones', strand: 'Geometry – properties of shapes', color: '#b5652a', icon: 'shapes',
        guard: 'Lady Mittens',
        objectives: [
          { id: 'Y4-G-01', statement: 'compare and classify geometric shapes, including quadrilaterals and triangles, based on their properties and sizes', title: 'Quadrilaterals and triangles', gens: ['classifyShapes'],
            vocab: ['quadrilateral', 'square', 'rectangle', 'rhombus', 'parallelogram', 'trapezium', 'kite', 'equilateral', 'isosceles', 'scalene', 'right-angled', 'parallel'],
            intro: [
              { say: 'Little dashes on sides show which sides are equal. A small square in a corner shows a right angle.', vis: function (V) { return V.polygon([[0, 0], [4, 0], [4, 4], [0, 4]], { label: 'square' }) + V.polygon([[0, 0], [6, 0], [6, 3], [0, 3]], { label: 'rectangle' }); } },
              { say: 'A rhombus has 4 equal sides but no right angles. A parallelogram has opposite sides equal and parallel. A kite has two pairs of equal sides next to each other. A trapezium has one pair of parallel sides.', vis: function (V) { return V.polygon([[0, 0], [4, 0], [6, 3], [2, 3]], { label: 'parallelogram' }) + V.polygon([[0, 3], [2, 0], [4, 3], [2, 8]], { label: 'kite' }); } },
              { say: 'Triangles: equilateral has 3 equal sides, isosceles has 2 equal sides, scalene has no equal sides, and a right-angled triangle has a right angle.' }
            ],
            method: ['Count the sides: 3 = triangle, 4 = quadrilateral.', 'Look for equal-side marks and right-angle marks.', 'Use the properties to choose the name — do not go by how the shape is turned.'],
            mistakes: ['Thinking a square turned on its corner is a different shape (it is still a square).', 'Mixing up rhombus and parallelogram.', 'Mixing up isosceles and equilateral.'] },
          { id: 'Y4-G-02', statement: 'identify acute and obtuse angles and compare and order angles up to 2 right angles by size', title: 'Acute and obtuse angles', gens: ['angles'],
            vocab: ['angle', 'acute', 'obtuse', 'right angle', 'straight line', 'turn'],
            intro: [
              { say: 'An angle is an amount of turn. A right angle is a quarter turn. Acute angles are smaller than a right angle. Obtuse angles are bigger than a right angle but smaller than a straight line (2 right angles).', vis: function (V) { return V.angle(45, { label: 'acute' }) + V.angle(90, { label: 'right' }) + V.angle(130, { label: 'obtuse' }); } },
              { say: 'The size of an angle is about the turn between the lines — not how long the lines are!', vis: function (V) { return V.angle(40, { len1: 150, len2: 150 }) + V.angle(70, { len1: 60, len2: 60 }); } }
            ],
            method: ['Compare the angle with a right angle (use the corner of a piece of paper).', 'Smaller than a right angle → acute. Exactly → right angle. Bigger (but less than a straight line) → obtuse.', 'To order angles, compare how wide the opening is, not the length of the arms.'],
            mistakes: ['Thinking longer arms mean a bigger angle.', 'Mixing up acute and obtuse.', 'Calling an angle that is almost a right angle a right angle — look for the square mark.'] },
          { id: 'Y4-G-03', statement: 'identify lines of symmetry in 2-D shapes presented in different orientations', title: 'Lines of symmetry', gens: ['symmetryLines'],
            vocab: ['line of symmetry', 'mirror line', 'symmetrical', 'reflect', 'orientation'],
            intro: [
              { say: 'A line of symmetry splits a shape into two halves that match exactly, like a mirror. If you folded the shape along the line, the halves would fit on top of each other.', vis: function (V) { return V.polygon([[0, 0], [4, 0], [4, 4], [0, 4]], { axis: [[2, 0], [2, 4]] }); } },
              { say: 'Shapes can have more than one line of symmetry. A square has 4. A rectangle has 2 (not the diagonals!). Turning a shape does not change how many lines of symmetry it has.' }
            ],
            method: ['Imagine folding the shape along the line.', 'Check each corner has a partner the same distance from the line on the other side.', 'Try vertical, horizontal and diagonal lines.', 'Rotate the page in your head: the number of lines stays the same.'],
            mistakes: ['Thinking a rectangle\'s diagonal is a line of symmetry.', 'Missing diagonal lines of symmetry in a square.', 'Getting confused when the shape is turned.'] },
          { id: 'Y4-G-04', statement: 'complete a simple symmetric figure with respect to a specific line of symmetry', title: 'Completing symmetric shapes', gens: ['completeSymmetry'],
            vocab: ['reflect', 'mirror line', 'symmetric', 'opposite', 'distance'],
            intro: [
              { say: 'To complete a symmetric shape, reflect each square across the mirror line. A square 1 away from the line has a partner 1 away on the other side.', vis: function (V) { return V.gridShape([[2, 1], [3, 1], [3, 2]], { cols: 8, rows: 4, mirror: { type: 'v', at: 4 }, extra: [[4, 1], [5, 1], [4, 2]] }); } }
            ],
            method: ['Pick one shaded square.', 'Count how many squares it is from the mirror line.', 'Count the same number on the other side and shade it.', 'Repeat for every square, then check the whole shape looks like a mirror image.'],
            mistakes: ['Copying the shape instead of reflecting it (it should be flipped).', 'Counting from the edge of the grid instead of the mirror line.', 'Missing a square.'] }
        ]
      },
      {
        id: 'po', name: 'Compass Clearing', strand: 'Geometry – position and direction', color: '#1e9494', icon: 'compass',
        guard: 'General Thistlewhisk',
        objectives: [
          { id: 'Y4-P-01', statement: 'describe positions on a 2-D grid as coordinates in the first quadrant', title: 'Coordinates', gens: ['readCoordinates'],
            vocab: ['coordinates', 'x-axis', 'y-axis', 'grid', 'origin', 'plot'],
            intro: [
              { say: 'Coordinates tell you where a point is. Go along the x-axis first, then up the y-axis. Point A is at (3, 5): 3 along, 5 up.', vis: function (V) { return V.coordGrid({ size: 6, points: [{ x: 3, y: 5, label: 'A' }], arrows: [[[0, 0], [3, 0]], [[3, 0], [3, 5]]] }); } },
              { say: 'Remember: "along the corridor, then up the stairs". The point (0, 0) is called the origin.' }
            ],
            method: ['Start at (0, 0).', 'Count along the x-axis to below the point: that is the first number.', 'Count up to the point: that is the second number.', 'Write them in brackets with a comma: (x, y).'],
            mistakes: ['Writing the numbers the wrong way round (up first).', 'Counting the squares instead of the lines.', 'Forgetting the brackets or comma.'] },
          { id: 'Y4-P-02', statement: 'describe movements between positions as translations of a given unit to the left/right and up/down', title: 'Translations', gens: ['translations'],
            vocab: ['translate', 'translation', 'left', 'right', 'up', 'down', 'units'],
            intro: [
              { say: 'A translation slides a point or shape without turning it. Moving 4 right adds 4 to the x-coordinate; moving 2 up adds 2 to the y-coordinate.', vis: function (V) { return V.coordGrid({ size: 8, points: [{ x: 2, y: 3, label: 'A' }, { x: 6, y: 5, label: 'B', color: '#2f7fd0' }], arrows: [[[2, 3], [6, 3]], [[6, 3], [6, 5]]] }); } },
              { say: 'Left takes away from x; down takes away from y.' }
            ],
            method: ['Right → add to x. Left → subtract from x.', 'Up → add to y. Down → subtract from y.', 'To describe a translation from A to B: find the change in x (left/right), then the change in y (up/down).'],
            mistakes: ['Changing the wrong coordinate.', 'Mixing up left and right.', 'Counting the starting square as one of the moves.'] },
          { id: 'Y4-P-03', statement: 'plot specified points and draw sides to complete a given polygon', title: 'Completing shapes on a grid', gens: ['completePolygon'],
            vocab: ['plot', 'vertex', 'vertices', 'polygon', 'rectangle', 'square'],
            intro: [
              { say: 'Three corners of a rectangle are plotted. The missing corner must line up with the others: it shares an x-coordinate with one corner and a y-coordinate with another.', vis: function (V) { return V.coordGrid({ size: 8, points: [{ x: 1, y: 2, label: 'A' }, { x: 6, y: 2, label: 'B' }, { x: 6, y: 5, label: 'C' }], segments: [[[1, 2], [6, 2]], [[6, 2], [6, 5]]] }); } }
            ],
            method: ['Look at which corners are joined.', 'For a rectangle or square, the missing corner is straight across from one corner and straight up/down from another.', 'For a square, check all the sides are the same length.', 'Write the coordinates and check by drawing the sides.'],
            mistakes: ['Writing the coordinates the wrong way round.', 'Placing the corner so the shape is not a rectangle.', 'For a square, making two sides different lengths.'] }
        ]
      },
      {
        id: 'st', name: 'Data Den', strand: 'Statistics', color: '#c04f9c', icon: 'chart',
        guard: 'The Cat King\'s Spy',
        objectives: [
          { id: 'Y4-S-01', statement: 'interpret and present discrete and continuous data using appropriate graphical methods, including bar charts and time graphs', title: 'Bar charts and time graphs', gens: ['readGraphs'],
            vocab: ['bar chart', 'time graph', 'axis', 'scale', 'data', 'interval'],
            intro: [
              { say: 'Always look at the scale first. Here each gridline is worth 2. A bar halfway between 6 and 8 shows 7.', vis: function (V) { return V.barChart({ cats: ['Owls', 'Bats', 'Foxes'], values: [6, 7, 4], step: 2, max: 10, ylabel: 'Number seen' }); } },
              { say: 'A time graph shows how something changes over time, like temperature through the day. Find the time on the bottom, go up to the line, then across to read the value.', vis: function (V) { return V.lineGraph({ xlabels: ['9am', '10am', '11am', '12pm', '1pm'], values: [8, 10, 13, 15, 14], step: 2, max: 16, ylabel: '°C' }); } }
            ],
            method: ['Read the title and the labels on each axis.', 'Work out the scale: what is each gridline worth?', 'Use a ruler (or your finger) to go across from the top of the bar or the point to the axis.', 'If it is between gridlines, work out the halfway value.'],
            mistakes: ['Assuming each gridline is worth 1.', 'Reading the wrong bar.', 'Misreading a value halfway between two gridlines.'] },
          { id: 'Y4-S-02', statement: 'solve comparison, sum and difference problems using information presented in bar charts, pictograms, tables and other graphs', title: 'Solving data problems', gens: ['graphProblems'],
            vocab: ['pictogram', 'key', 'table', 'total', 'difference', 'how many more', 'fewer'],
            intro: [
              { say: 'In a pictogram, the key tells you what each picture is worth. Half a picture is worth half as much.', vis: function (V) { return V.pictogram({ cats: ['Monday', 'Tuesday'], values: [10, 6], key: 4, unit: 'acorns' }); } },
              { say: '"How many more" means find the difference: subtract the smaller from the bigger. "Altogether" means add.' }
            ],
            method: ['Read each value carefully (use the key or the scale).', 'Decide: compare (which is more?), sum (add), or difference (subtract)?', 'Do the calculation and check your answer is sensible.'],
            mistakes: ['Counting pictures instead of using the key.', 'Treating a part picture as a whole one.', 'Adding when the question asks "how many more".'] }
        ]
      }
    ]
  };

  OM.CURRICULUM = OM.CURRICULUM || {};
  Y4.tablesObjective = 'Y4-MD-01';
  OM.CURRICULUM.Y4 = Y4;
  OM.objectiveIndex = OM.objectiveIndex || {};
  Y4.regions.forEach(function (r) { r.objectives.forEach(function (o) { o.region = r.id; o.year = 4; OM.objectiveIndex[o.id] = o; }); });
})(typeof window !== 'undefined' ? window : globalThis);
