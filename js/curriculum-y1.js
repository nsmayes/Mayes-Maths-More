/* Learn with Pip — Year 1 curriculum map and teaching content (adventure: the Sunny Meadow).
   Every "statement" is the statutory requirement, word for word, from the DfE National Curriculum in England: mathematics
   programmes of study, Year 1 (Crown copyright, Open Government Licence v3.0). tests/run-checks.js compares each one with
   tools/nc-statements.json, taken from GOV.UK. Lessons use short sentences and lots of pictures. */
(function (G) {
  'use strict';
  var OM = G.OM;
  function o(id, statement, title, gens, vocab, intro, method, mistakes) { return { id: id, statement: statement, title: title, gens: gens, vocab: vocab, intro: intro, method: method, mistakes: mistakes }; }
  var Y1 = {
    year: 1, label: 'Year 1', keyStage: 'Key Stage 1', ages: '5–6',
    source: 'DfE National Curriculum in England: mathematics programmes of study (Year 1 statutory requirements)',
    regions: [
      { id: 'npv', name: 'Counting Clover', strand: 'Number – number and place value', color: '#7b5cc4', icon: 'hash', objectives: [
        o('Y1-NPV-01', 'count to and across 100, forwards and backwards, beginning with 0 or 1, or from any given number', 'Counting forwards and backwards', ['y1Count'], ['count on', 'count back', 'forwards', 'backwards'],
          [{ say: 'Counting on means each number is one more: 27, 28, 29, 30.', vis: function (V) { return V.numberLine({ min: 25, max: 32, step: 1 }); } },
           { say: 'Counting back means each number is one less: 30, 29, 28, 27.' }],
          ['Say the numbers out loud.', 'Point to each one as you say it.', 'After 9 in the ones comes a new ten: 29, then 30.'],
          ['Saying twenty-ten instead of thirty.', 'Skipping a number when counting back.']),
        o('Y1-NPV-02', 'count, read and write numbers to 100 in numerals; count in multiples of 2s, 5s and 10s', 'Counting in 2s, 5s and 10s', ['y1Steps'], ['count in 2s', 'count in 5s', 'count in 10s', 'pattern'],
          [{ say: 'Counting in 10s: 10, 20, 30, 40. Counting in 5s: 5, 10, 15, 20. Counting in 2s: 2, 4, 6, 8.' },
           { say: 'Counting in 2s is like counting pairs of socks.', vis: function (V) { return V.dots(8, { perRow: 8, group: 2 }); } }],
          ['Find the step: 2, 5 or 10.', 'Add the step to the last number.', 'Check the pattern in the ones.'],
          ['Counting in ones by mistake.', 'Losing the pattern after 10.']),
        o('Y1-NPV-03', 'given a number, identify 1 more and 1 less', '1 more and 1 less', ['y1MoreLess'], ['one more', 'one less', 'next', 'before'],
          [{ say: '1 more than 7 is 8. 1 less than 7 is 6.', vis: function (V) { return V.numberLine({ min: 4, max: 10, step: 1, hops: [{ from: 7, to: 8, label: '+1' }] }); } }],
          ['Find the number.', '1 more: count on one.', '1 less: count back one.'],
          ['Mixing up more and less.', 'Getting stuck at a new ten: 1 more than 39 is 40.']),
        o('Y1-NPV-04', 'identify and represent numbers using objects and pictorial representations including the number line, and use the language of: equal to, more than, less than (fewer), most, least', 'More, less, most and least', ['y1Compare'], ['more than', 'less than', 'fewer', 'most', 'least', 'equal to'],
          [{ say: 'Here are 6 dots. Count them in a line. Touch each one once.', vis: function (V) { return V.dots(6, { perRow: 6 }); } },
           { say: '9 is more than 4. 4 is less than 9. The biggest number is the most. The smallest is the least.' }],
          ['Count each thing once.', 'Bigger numbers come later when you count.', 'Most is the biggest. Least is the smallest.'],
          ['Counting a dot twice.', 'Thinking 21 is less than 12 because 1 is small.']),
        o('Y1-NPV-05', 'read and write numbers from 1 to 20 in numerals and words', 'Numbers in words', ['y1Words'], ['one', 'ten', 'twelve', 'twenty', 'word', 'digit'],
          [{ say: 'Numbers can be written in digits or in words. 12 is twelve. 15 is fifteen. 20 is twenty.' }],
          ['Say the number out loud.', 'Listen for teen: thirteen, fourteen, fifteen.', 'Check the spelling.'],
          ['Writing 31 for thirteen.', 'Spelling twelve as twelf.'])
      ] },
      { id: 'as', name: 'Buttercup Bank', strand: 'Number – addition and subtraction', color: '#2f7fd0', icon: 'plusminus', objectives: [
        o('Y1-AS-01', 'read, write and interpret mathematical statements involving addition (+), subtraction (−) and equals (=) signs', 'Number sentences', ['y1Statements'], ['add', 'plus', 'take away', 'equals', 'number sentence'],
          [{ say: '3 + 2 = 5 means 3 and 2 more make 5.', vis: function (V) { return V.dots(5, { perRow: 5, colours: ['#f2a33a', '#f2a33a', '#f2a33a', '#3d7bd9', '#3d7bd9'] }); } },
           { say: '5 − 2 = 3 means 5 take away 2 leaves 3. The = sign means is the same as.' }],
          ['+ means add more.', '− means take away.', '= means both sides are the same.'],
          ['Reading − as add.', 'Thinking = means the answer comes next.']),
        o('Y1-AS-02', 'represent and use number bonds and related subtraction facts within 20', 'Number bonds', ['y1Bonds'], ['number bond', 'make 10', 'pairs', 'total'],
          [{ say: 'Number bonds to 10: 6 and 4 make 10. So 10 − 6 = 4.', vis: function (V) { return V.dots(10, { perRow: 5, colours: ['#f2a33a', '#f2a33a', '#f2a33a', '#f2a33a', '#f2a33a', '#f2a33a', '#fff', '#fff', '#fff', '#fff'] }); } },
           { say: 'If 6 + 4 = 10, then 16 + 4 = 20.' }],
          ['Use a ten frame.', 'Count the empty spaces.', 'Use the bond to find the take away fact.'],
          ['Counting the full spaces instead of the empty ones.', 'Forgetting that 10 + 0 is also a bond.']),
        o('Y1-AS-03', 'add and subtract one-digit and two-digit numbers to 20, including 0', 'Adding and subtracting to 20', ['y1AddSub'], ['add', 'take away', 'count on', 'count back', 'zero'],
          [{ say: '8 + 5: start at 8 and count on 5. The answer is 13.', vis: function (V) { return V.numberLine({ min: 0, max: 20, step: 1, labelEvery: 5, hops: [{ from: 8, to: 13, label: '+5' }] }); } },
           { say: 'Adding 0 changes nothing: 7 + 0 = 7.' }],
          ['Start with the bigger number.', 'Count on to add.', 'Count back to take away.'],
          ['Counting the start number as one.', 'Thinking 7 − 0 = 0.']),
        o('Y1-AS-04', 'solve one-step problems that involve addition and subtraction, using concrete objects and pictorial representations, and missing number problems such as 7 = ? − 9', 'Story problems', ['y1Problems'], ['altogether', 'left', 'more', 'missing number'],
          [{ say: 'Sam has 5 apples and gets 3 more. Now Sam has 8 apples.' },
           { say: '7 = ? − 9. What take away 9 leaves 7? Add them: 7 + 9 = 16.' }],
          ['Read the story.', 'Is it more or fewer at the end?', 'Draw it if it helps.'],
          ['Adding when things are taken away.', 'Answering 2 for 7 = ? − 9.'])
      ] },
      { id: 'md', name: 'Beehive Corner', strand: 'Number – multiplication and division', color: '#d2475b', icon: 'array', objectives: [
        o('Y1-MD-01', 'solve one-step problems involving multiplication and division, by calculating the answer using concrete objects, pictorial representations and arrays with the support of the teacher', 'Groups and sharing', ['y1Groups'], ['groups of', 'share', 'equal', 'double', 'array'],
          [{ say: '3 groups of 2 make 6. Count in 2s: 2, 4, 6.', vis: function (V) { return V.array(3, 2); } },
           { say: 'Share 6 sweets between 2 friends. Each friend gets 3.' }],
          ['Make equal groups.', 'Count in 2s, 5s or 10s.', 'To share, give one at a time.'],
          ['Making groups that are not equal.', 'Counting the groups instead of the things.'])
      ] },
      { id: 'fr', name: 'Picnic Patch', strand: 'Number – fractions', color: '#d9861a', icon: 'pie', objectives: [
        o('Y1-F-01', 'recognise, find and name a half as 1 of 2 equal parts of an object, shape or quantity', 'Halves', ['y1Half'], ['half', 'halves', 'equal parts', 'whole'],
          [{ say: 'A half is 1 of 2 equal parts.', vis: function (V) { return V.splitRect([0.5, 0.5], [0], { w: 160, h: 56 }); } },
           { say: 'Half of 8 is 4. Share 8 into 2 equal groups.' }],
          ['Split into 2 parts.', 'Check the parts are the same size.', 'One part is a half.'],
          ['Calling a big piece a half.', 'Splitting into 2 parts that are not equal.']),
        o('Y1-F-02', 'recognise, find and name a quarter as 1 of 4 equal parts of an object, shape or quantity', 'Quarters', ['y1Quarter'], ['quarter', 'quarters', 'equal parts', 'four'],
          [{ say: 'A quarter is 1 of 4 equal parts.', vis: function (V) { return V.splitRect([0.25, 0.25, 0.25, 0.25], [0], { w: 200, h: 56 }); } },
           { say: 'A quarter of 12 is 3. Share 12 into 4 equal groups.' }],
          ['Split into 4 parts.', 'Check the parts are the same size.', 'One part is a quarter.'],
          ['Thinking a quarter is bigger than a half.', 'Using parts that are not equal.'])
      ] },
      { id: 'me', name: 'Daisy Dell', strand: 'Measurement', color: '#3e9a5c', icon: 'ruler', objectives: [
        o('Y1-M-01', 'compare, describe and solve practical problems for: lengths and heights [for example, long/short, longer/shorter, tall/short, double/half]; mass/weight [for example, heavy/light, heavier than, lighter than]; capacity and volume [for example, full/empty, more than, less than, half, half full, quarter]; time [for example, quicker, slower, earlier, later]', 'Comparing', ['y1CompareMeasure'], ['longer', 'shorter', 'heavier', 'lighter', 'full', 'empty'],
          [{ say: 'The red ribbon is longer than the blue ribbon. Line them up at the same start.', vis: function (V) { return V.svg(260, 70, V.rect(10, 8, 220, 18, { fill: '#d9534f', stroke: '#d9534f' }) + V.rect(10, 42, 140, 18, { fill: '#3d7bd9', stroke: '#3d7bd9' })); } },
           { say: 'On a balance, the heavier side goes down.' }],
          ['Line things up at the same start.', 'Compare the ends.', 'Use words like longer, heavier, fuller.'],
          ['Not lining up the start.', 'Thinking bigger always means heavier.']),
        o('Y1-M-02', 'measure and begin to record the following: lengths and heights; mass/weight; capacity and volume; time (hours, minutes, seconds); recognise and know the value of different denominations of coins and notes; sequence events in chronological order using language [for example, before and after, next, first, today, yesterday, tomorrow, morning, afternoon and evening]', 'Coins, measuring and order', ['y1Coins', 'y1Sequence'], ['coin', 'note', 'pence', 'pound', 'before', 'after'],
          [{ say: 'These are coins. Each one shows its value.', vis: function (V) { return V.coins([1, 2, 5, 10, 20, 50, 100, 200]); } },
           { say: 'Morning comes before afternoon. Evening comes after afternoon.' }],
          ['Read the number on each coin.', 'To find a total, start with the biggest coin.', 'For order, think: what happens first?'],
          ['Thinking a big coin is always worth more.', 'Mixing up yesterday and tomorrow.']),
        o('Y1-M-03', 'recognise and use language relating to dates, including days of the week, weeks, months and years', 'Days and months', ['y1Days'], ['day', 'week', 'month', 'year', 'Monday', 'January'],
          [{ say: 'There are 7 days in a week: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.' },
           { say: 'There are 12 months in a year. January is first and December is last.' }],
          ['Say the days in order.', 'Say the months in order.', 'Use them to find what comes next.'],
          ['Forgetting that Monday comes after Sunday.', 'Mixing up June and July.']),
        o('Y1-M-04', 'tell the time to the hour and half past the hour and draw the hands on a clock face to show these times', 'O’clock and half past', ['y1Clock'], ['o’clock', 'half past', 'hour hand', 'minute hand'],
          [{ say: 'When the long hand points to 12, it is o’clock. This is 3 o’clock.', vis: function (V) { return V.clock(3, 0); } },
           { say: 'When the long hand points to 6, it is half past. This is half past 3.', vis: function (V) { return V.clock(3, 30); } }],
          ['Look at the long hand first.', 'At 12 it is o’clock. At 6 it is half past.', 'The short hand shows the hour.'],
          ['Mixing up the long and short hands.', 'Reading half past 3 as half past 4.'])
      ] },
      { id: 'sh', name: 'Shape Garden', strand: 'Geometry – properties of shapes', color: '#b5652a', icon: 'shapes', objectives: [
        o('Y1-G-01', 'recognise and name common 2-D and 3-D shapes, including: 2-D shapes [for example, rectangles (including squares), circles and triangles]; 3-D shapes [for example, cuboids (including cubes), pyramids and spheres]', 'Naming shapes', ['y1Shapes'], ['circle', 'triangle', 'square', 'rectangle', 'cube', 'sphere'],
          [{ say: 'Flat shapes are 2-D. A triangle has 3 sides. A square has 4 equal sides.', vis: function (V) { return V.shape2d('triangle', { size: 70 }) + ' ' + V.shape2d('square', { size: 70 }) + ' ' + V.shape2d('circle', { size: 70 }); } },
           { say: 'Solid shapes are 3-D. A ball is a sphere. A dice is a cube.', vis: function (V) { return V.solid('cube'); } }],
          ['Count the sides and corners.', 'Is it flat or solid?', 'Does it have curved surfaces?'],
          ['Calling a cube a square.', 'Thinking a turned square is a different shape.'])
      ] },
      { id: 'po', name: 'Windmill Hill', strand: 'Geometry – position and direction', color: '#1e9494', icon: 'compass', objectives: [
        o('Y1-P-01', 'describe position, direction and movement, including whole, half, quarter and three-quarter turns', 'Turns', ['y1Turns'], ['whole turn', 'half turn', 'quarter turn', 'three-quarter turn'],
          [{ say: 'A whole turn goes all the way round. You end up facing the same way.', vis: function (V) { return V.turnScene(['tree', 'house', 'pond', 'swing'], 0); } },
           { say: 'A half turn faces the opposite way. A quarter turn faces the next thing round.' }],
          ['Stand up and try it.', 'Quarter: one step round.', 'Half: two steps. Three-quarter: three steps.'],
          ['Turning the wrong way.', 'Thinking a half turn is the same as a quarter turn.'])
      ] }
    ],
    papers: {
      arithmetic: { title: 'Number check', minutes: 15, totalMarks: 15, desc: '15 short sums to show what you know. Take your time.',
        list: [['y1MoreLess', 1], ['y1Steps', 1], ['y1Statements', 1], ['y1Bonds', 1], ['y1AddSub', 1], ['y1MoreLess', 2], ['y1Bonds', 2], ['y1AddSub', 2], ['y1Groups', 2], ['y1Half', 2],
          ['y1Steps', 2], ['y1Bonds', 3], ['y1AddSub', 3], ['y1Quarter', 2], ['y1Problems', 3]] },
      reasoning: { title: 'Puzzle paper', minutes: 20, totalMarks: 15, desc: 'Puzzles from every part of the meadow.',
        list: [['y1Count', 1], ['y1Compare', 1], ['y1Words', 1], ['y1Problems', 1], ['y1Groups', 1], ['y1Half', 1], ['y1Quarter', 1], ['y1CompareMeasure', 1], ['y1Coins', 1], ['y1Days', 1],
          ['y1Clock', 1], ['y1Shapes', 1], ['y1Turns', 1], ['y1Sequence', 2], ['y1Coins', 2]] }
    }
  };
  OM.CURRICULUM = OM.CURRICULUM || {};
  OM.CURRICULUM.Y1 = Y1;
  OM.objectiveIndex = OM.objectiveIndex || {};
  Y1.regions.forEach(function (r) { r.objectives.forEach(function (ob) { ob.region = r.id; ob.year = 1; OM.objectiveIndex[ob.id] = ob; }); });
})(typeof window !== 'undefined' ? window : globalThis);
