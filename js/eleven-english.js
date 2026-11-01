/* Mayes Maths & More — 11+ English: spelling, vocabulary (synonyms and antonyms), word classes, punctuation and
   comprehension, in the five-option (A–E) multiple-choice style used by most 11+ English papers.
   The comprehension passages are original, written for this app. Each generator checks its answer another way:
   spelling against the word list, meanings against the word groups, punctuation against the rules, comprehension against the passage. */
(function (G) {
  'use strict';
  var OM = G.OM, K = OM.kit, XP = OM.CURRICULUM.YXP, LET = ['A', 'B', 'C', 'D', 'E'];
  // five options A–E; items are plain text; returns a choice question
  function five(prompt, items, right, o) {
    var q = K.choice(prompt, items.map(function (t, i) { return { value: LET[i], label: '<b class="mcl">' + LET[i] + '</b> ' + t }; }), LET[items.indexOf(right)], o);
    q.params.items = items; return q;
  }
  function picked(q) { return q.params.items[LET.indexOf(q.check.value)]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ================= E1 spelling =================
  // [correct spelling, a common misspelling]; all words use British spelling
  var SPELL = [['necessary', 'neccessary'], ['separate', 'seperate'], ['definitely', 'definately'], ['accommodate', 'acommodate'], ['beginning', 'begining'], ['believe', 'beleive'],
    ['receive', 'recieve'], ['weird', 'wierd'], ['friend', 'freind'], ['February', 'Febuary'], ['library', 'libary'], ['government', 'goverment'], ['environment', 'enviroment'],
    ['embarrass', 'embarass'], ['occasion', 'occassion'], ['disappear', 'dissapear'], ['tomorrow', 'tommorow'], ['until', 'untill'], ['beautiful', 'beautifull'], ['Wednesday', 'Wensday'],
    ['knowledge', 'knowlege'], ['rhythm', 'rythm'], ['conscience', 'consience'], ['existence', 'existance'], ['independent', 'independant'], ['immediately', 'immediatly'],
    ['sincerely', 'sincerly'], ['restaurant', 'restaurent'], ['privilege', 'priviledge'], ['achieve', 'acheive'], ['address', 'adress'], ['argument', 'arguement'], ['calendar', 'calender'],
    ['category', 'catagory'], ['committee', 'comittee'], ['conscious', 'concious'], ['curiosity', 'curiousity'], ['desperate', 'desparate'], ['especially', 'especialy'],
    ['exaggerate', 'exagerate'], ['familiar', 'familar'], ['foreign', 'foriegn'], ['forty', 'fourty'], ['guarantee', 'garantee'], ['height', 'heigth'], ['interrupt', 'interupt'],
    ['marvellous', 'marvelous'], ['mischievous', 'mischievious'], ['neighbour', 'nieghbour'], ['occurred', 'occured'], ['parliament', 'parliment'], ['persuade', 'pursuade'],
    ['possession', 'posession'], ['programme', 'programe'], ['recommend', 'reccomend'], ['rhyme', 'ryhme'], ['secretary', 'secratary'], ['signature', 'signiture'], ['soldier', 'soilder'],
    ['stomach', 'stomache'], ['sufficient', 'sufficent'], ['temperature', 'temprature'], ['thorough', 'thurough'], ['twelfth', 'twelth'], ['vegetable', 'vegtable'], ['vehicle', 'vehical'],
    ['yacht', 'yaght'], ['island', 'iland'], ['science', 'sience'], ['surprise', 'suprise'], ['probably', 'probly'], ['different', 'diffrent'], ['interest', 'intrest'], ['favourite', 'favorite'],
    ['colour', 'color'], ['actually', 'actualy'], ['business', 'buisness'], ['ancient', 'anceint'], ['bruise', 'bruse'], ['cemetery', 'cemetary'], ['competition', 'competision'], ['excellent', 'excelent']];
  var GOOD = {}; SPELL.forEach(function (p) { GOOD[p[0]] = 1; });
  K.gen({ id: 'xeSpell', objective: 'XP-E1', title: 'Spelling',
    make: function (r, L) {
      var pool = L === 1 ? SPELL.slice(0, 30) : L === 2 ? SPELL.slice(0, 60) : SPELL, ps = r.sample(pool, 5), bad = ps[0], items = r.shuffle([bad[1]].concat(ps.slice(1).map(function (p) { return p[0]; })));
      return five('Which word is spelt <b>incorrectly</b>?', items, bad[1], { hint: 'Say each word slowly in your head. Look for doubled letters, "ie" and "ei", and silent letters.', params: { wrong: bad[1] },
        sol: ['"' + bad[1] + '" is wrong: the correct spelling is <b>' + bad[0] + '</b>.', 'The other four are spelt correctly.'].map(function (s) { return K.S(s.replace(/<\/?b>/g, ''), s); }) });
    },
    verify: function (q) { var wrong = q.params.items.filter(function (w) { return !GOOD[w]; }); return wrong.length === 1 && picked(q) === wrong[0] && SPELL.some(function (p) { return p[1] === wrong[0]; }); } });

  // ================= E2 and E3 vocabulary =================
  // groups of words with (nearly) the same meaning; OPP pairs groups with opposite meanings. No word is in two groups.
  var GROUPS = {
    big: ['enormous', 'huge', 'vast', 'immense', 'gigantic'], small: ['tiny', 'minuscule', 'miniature', 'little', 'petite'],
    happy: ['cheerful', 'joyful', 'content', 'delighted', 'glad'], sad: ['miserable', 'gloomy', 'sorrowful', 'unhappy', 'dejected'],
    brave: ['courageous', 'fearless', 'heroic', 'bold', 'daring'], scared: ['afraid', 'frightened', 'fearful', 'timid', 'terrified'],
    fast: ['rapid', 'swift', 'speedy', 'quick', 'brisk'], slow: ['sluggish', 'leisurely', 'unhurried', 'gradual', 'dawdling'],
    clever: ['intelligent', 'bright', 'brilliant', 'wise', 'shrewd'], foolish: ['silly', 'stupid', 'senseless', 'unwise', 'reckless'],
    old: ['ancient', 'aged', 'antique', 'elderly', 'historic'], new: ['modern', 'recent', 'fresh', 'novel', 'current'],
    noisy: ['loud', 'rowdy', 'deafening', 'raucous', 'clamorous'], quiet: ['silent', 'hushed', 'peaceful', 'still', 'tranquil'],
    rich: ['wealthy', 'affluent', 'prosperous', 'well-off', 'opulent'], poor: ['penniless', 'needy', 'impoverished', 'broke', 'destitute'],
    kind: ['generous', 'caring', 'thoughtful', 'gentle', 'considerate'], cruel: ['heartless', 'vicious', 'unkind', 'callous', 'brutal'],
    begin: ['start', 'commence', 'launch', 'initiate', 'embark'], finish: ['end', 'complete', 'conclude', 'stop', 'cease'],
    easy: ['simple', 'effortless', 'straightforward', 'painless', 'elementary'], hard: ['difficult', 'tough', 'challenging', 'demanding', 'tricky'],
    angry: ['furious', 'cross', 'irate', 'livid', 'annoyed'], calm: ['relaxed', 'serene', 'composed', 'placid', 'untroubled'],
    beautiful: ['lovely', 'attractive', 'gorgeous', 'pretty', 'stunning'], ugly: ['hideous', 'unsightly', 'grotesque', 'plain', 'unattractive'],
    tired: ['exhausted', 'weary', 'sleepy', 'drained', 'fatigued'], lively: ['energetic', 'vigorous', 'spirited', 'active', 'sprightly'],
    honest: ['truthful', 'sincere', 'frank', 'genuine', 'trustworthy'], deceitful: ['dishonest', 'sly', 'cunning', 'sneaky', 'lying'],
    increase: ['expand', 'grow', 'enlarge', 'rise', 'swell'], decrease: ['reduce', 'shrink', 'lessen', 'decline', 'dwindle'],
    rare: ['scarce', 'uncommon', 'unusual', 'infrequent', 'sparse'], common: ['ordinary', 'usual', 'everyday', 'frequent', 'familiar'],
    praise: ['compliment', 'applaud', 'commend', 'admire', 'acclaim'], criticise: ['condemn', 'blame', 'scold', 'disapprove', 'denounce'],
    wet: ['damp', 'soaked', 'drenched', 'moist', 'soggy'], dry: ['arid', 'parched', 'dehydrated', 'withered', 'bone-dry'] };
  var OPP = [['big', 'small'], ['happy', 'sad'], ['brave', 'scared'], ['fast', 'slow'], ['clever', 'foolish'], ['old', 'new'], ['noisy', 'quiet'], ['rich', 'poor'], ['kind', 'cruel'],
    ['begin', 'finish'], ['easy', 'hard'], ['angry', 'calm'], ['beautiful', 'ugly'], ['tired', 'lively'], ['honest', 'deceitful'], ['increase', 'decrease'], ['rare', 'common'], ['praise', 'criticise'], ['wet', 'dry']];
  var KEYS = Object.keys(GROUPS), GROUP_OF = {};
  KEYS.forEach(function (k) { GROUP_OF[k] = k; GROUPS[k].forEach(function (w) { GROUP_OF[w] = k; }); });
  function opposite(k) { for (var i = 0; i < OPP.length; i++) { if (OPP[i][0] === k) return OPP[i][1]; if (OPP[i][1] === k) return OPP[i][0]; } return null; }
  function wordsOf(k) { return [k].concat(GROUPS[k]); }
  K.gen({ id: 'xeSynonym', objective: 'XP-E2', title: 'Synonyms',
    make: function (r, L) {
      var k = r.pick(KEYS), ws = r.shuffle(wordsOf(k)), w = ws[0], good = ws[1], others = r.shuffle(KEYS.filter(function (x) { return x !== k; }));
      // at harder levels one wrong option is an antonym: a common trap
      var opp = opposite(k), wrongGroups = L >= 2 && opp ? [opp].concat(others.filter(function (x) { return x !== opp; }).slice(0, 3)) : others.slice(0, 4);
      var items = r.shuffle([good].concat(wrongGroups.map(function (g) { return r.pick(wordsOf(g)); })));
      return five('Which word is <b>closest in meaning</b> to <b>' + w + '</b>?', items, good, { hint: 'Try each word in a sentence in place of "' + w + '". Watch out for opposites.', params: { w: w }, sol: ['"' + good + '" means nearly the same as "' + w + '".'] });
    },
    verify: function (q) { var g = GROUP_OF[q.params.w], same = q.params.items.filter(function (x) { return GROUP_OF[x] === g; }); return same.length === 1 && picked(q) === same[0] && same[0] !== q.params.w; } });
  K.gen({ id: 'xeAntonym', objective: 'XP-E3', title: 'Antonyms',
    make: function (r, L) {
      var pr = r.pick(OPP), flip = r.chance(0.5), k = pr[flip ? 1 : 0], o = pr[flip ? 0 : 1], ws = r.shuffle(wordsOf(k)), w = ws[0], good = r.pick(wordsOf(o));
      var others = r.shuffle(KEYS.filter(function (x) { return x !== k && x !== o; })), wrong = (L >= 2 ? [ws[1]] : []).concat(others.slice(0, L >= 2 ? 3 : 4).map(function (g) { return r.pick(wordsOf(g)); }));
      var items = r.shuffle([good].concat(wrong));
      return five('Which word is <b>most opposite</b> in meaning to <b>' + w + '</b>?', items, good, { hint: 'First think of a word that means the same as "' + w + '", then find its opposite. One option may mean the same: that is a trap.', params: { w: w }, sol: ['"' + good + '" is the opposite of "' + w + '".'] });
    },
    verify: function (q) { var o = opposite(GROUP_OF[q.params.w]), opp = q.params.items.filter(function (x) { return GROUP_OF[x] === o; }); return !!o && opp.length === 1 && picked(q) === opp[0]; } });

  // ================= E4 word classes =================
  var WC = { adjective: ['grey', 'clever', 'tiny', 'hungry', 'muddy', 'ancient', 'fierce', 'curious', 'gentle', 'shaggy'],
    noun: ['fox', 'girl', 'horse', 'knight', 'explorer', 'rabbit', 'farmer', 'robot', 'dragon', 'pilot'],
    verb: ['ran', 'wandered', 'raced', 'crept', 'hurried', 'danced', 'strolled', 'scrambled', 'marched', 'galloped'],
    adverb: ['quickly', 'quietly', 'slowly', 'happily', 'nervously', 'bravely', 'silently', 'carefully', 'eagerly', 'clumsily'],
    preposition: ['across', 'through', 'along', 'over', 'under', 'around', 'towards', 'beside', 'into', 'behind'] };
  var PLACES = ['field', 'river', 'bridge', 'forest', 'hill', 'garden', 'park', 'beach', 'meadow', 'castle'];
  var CLASS_OF = {}; Object.keys(WC).forEach(function (c) { WC[c].forEach(function (w) { CLASS_OF[w] = c; }); });
  K.gen({ id: 'xeWordClass', objective: 'XP-E4', title: 'Word classes',
    make: function (r, L) {
      var w = {}; Object.keys(WC).forEach(function (c) { w[c] = r.pick(WC[c]); });
      var place = r.pick(PLACES), front = L === 3 && r.chance(0.6), sent = front ? cap(w.adverb) + ', the ' + w.adjective + ' ' + w.noun + ' ' + w.verb + ' ' + w.preposition + ' the ' + place + '.' : 'The ' + w.adjective + ' ' + w.noun + ' ' + w.verb + ' ' + w.adverb + ' ' + w.preposition + ' the ' + place + '.';
      var want = r.pick(L === 1 ? ['noun', 'verb', 'adjective'] : Object.keys(WC)), items = r.shuffle(Object.keys(WC).map(function (c) { return w[c]; }));
      return five('In this sentence, which word is <b>' + (want === 'adjective' || want === 'adverb' ? 'an ' : 'a ') + want + '</b>?<br><i>' + sent + '</i>', items, w[want], { hint: { noun: 'A noun names a person, place or thing.', verb: 'A verb is a doing word.', adjective: 'An adjective describes a noun.', adverb: 'An adverb tells you how something was done; many end in -ly.', preposition: 'A preposition tells you where: across, under, through…' }[want],
        params: { want: want, sent: sent }, sol: ['"' + w[want] + '" is ' + (want === 'adjective' || want === 'adverb' ? 'an ' : 'a ') + want + '.'] });
    },
    verify: function (q) { var p = q.params, hits = p.items.filter(function (x) { return CLASS_OF[x] === p.want; }); return hits.length === 1 && picked(q) === hits[0] && p.items.every(function (x) { return p.sent.toLowerCase().indexOf(x) >= 0; }); } });

  // ================= E5 punctuation =================
  var NAMES = ['Mia', 'Omar', 'Priya', 'Jack', 'Zara', 'Leo', 'Amara', 'Finn', 'Ella', 'Sami'];
  var QS = ['Can we go to the park', 'Where is my coat', 'Is it raining outside', 'What time does the film start', 'Have you seen my book', 'Why is the sky blue'];
  var SAYS = ['Let me help you', 'The bus is late again', 'I found a shiny shell', 'We won the match', 'Dinner is ready'];
  var ITEMS = ['apples', 'pears', 'grapes', 'cheese', 'bread', 'crisps', 'oranges', 'biscuits', 'sandwiches', 'juice'];
  var OWN = [['dog', 'bowl'], ['cat', 'basket'], ['girl', 'bike'], ['teacher', 'desk'], ['farmer', 'tractor'], ['boy', 'kite']];
  // the rules each kind of sentence must follow (used to check every option independently)
  var RULE = {
    q: /^"[A-Z][^"?!.,]*\?" asked [A-Z][a-z]+\.$/,
    s: /^"[A-Z][^"?!.,]*," said [A-Z][a-z]+\.$/,
    list: function (s) { var m = /^We packed ([a-z]+(, [a-z]+)*) and ([a-z]+)\.$/.exec(s); return !!m && m[1].split(', ').length >= 2; },
    own: /^The [a-z]+'s [a-z]+ was by the door\.$/ };
  function rule(kind, s) { var t = RULE[kind]; return typeof t === 'function' ? t(s) : t.test(s); }
  K.gen({ id: 'xePunct', objective: 'XP-E5', title: 'Punctuation',
    make: function (r, L) {
      var kind = r.pick(L === 1 ? ['list', 'own'] : ['q', 's', 'list', 'own']), name = r.pick(NAMES), good, bad;
      if (kind === 'q') { var t = r.pick(QS), lt = t.charAt(0).toLowerCase() + t.slice(1);
        good = '"' + t + '?" asked ' + name + '.'; bad = ['"' + t + '" asked ' + name + '.', '"' + t + '"? asked ' + name + '.', '"' + lt + '?" asked ' + name + '.', '"' + t + '?" asked ' + name.toLowerCase() + '.', t + '?" asked ' + name + '.', '"' + t + '." asked ' + name + '.']; }
      else if (kind === 's') { var u = r.pick(SAYS), lu = u.charAt(0).toLowerCase() + u.slice(1);
        good = '"' + u + '," said ' + name + '.'; bad = ['"' + u + '" said ' + name + '.', '"' + u + '", said ' + name + '.', '"' + lu + '," said ' + name + '.', '"' + u + '," said ' + name.toLowerCase() + '.', '"' + u + '." said ' + name + '.', u + '," said ' + name + '.']; }
      else if (kind === 'list') { var it = r.sample(ITEMS, 4);
        good = 'We packed ' + it[0] + ', ' + it[1] + ', ' + it[2] + ' and ' + it[3] + '.'; bad = ['We packed ' + it[0] + ' ' + it[1] + ', ' + it[2] + ' and ' + it[3] + '.', 'We packed, ' + it[0] + ', ' + it[1] + ', ' + it[2] + ' and ' + it[3] + '.', 'We packed ' + it[0] + ', ' + it[1] + ', ' + it[2] + ' and ' + it[3], 'we packed ' + it[0] + ', ' + it[1] + ', ' + it[2] + ' and ' + it[3] + '.', 'We packed ' + it[0] + ', ' + it[1] + ' ' + it[2] + ' and ' + it[3] + '.', 'We packed ' + it[0] + '; ' + it[1] + ', ' + it[2] + ' and ' + it[3] + '.']; }
      else { var ow = r.pick(OWN);
        good = 'The ' + ow[0] + "'s " + ow[1] + ' was by the door.'; bad = ['The ' + ow[0] + 's ' + ow[1] + ' was by the door.', 'The ' + ow[0] + "s' " + ow[1] + ' was by the door.', 'The ' + ow[0] + "'s " + ow[1] + ' was by the door', 'the ' + ow[0] + "'s " + ow[1] + ' was by the door.', 'The ' + ow[0] + "'s " + ow[1] + "'s was by the door.", 'The ' + ow[0] + ' ' + ow[1] + "'s was by the door."]; }
      var items = r.shuffle([good].concat(r.sample(bad, 4)));
      return five('Which sentence is punctuated <b>correctly</b>?', items, good, { hint: { q: 'A question inside speech marks ends with ? before the closing speech mark.', s: 'Spoken words end with a comma inside the speech marks when the sentence carries on.', list: 'Commas separate items in a list; "and" comes before the last one.', own: 'One owner: add \'s to show that something belongs to it.' }[kind],
        params: { kind: kind }, sol: ['Correct: ' + good, { q: 'The question mark goes inside the speech marks, and the name has a capital letter.', s: 'The comma goes inside the speech marks.', list: 'A comma between each item, with "and" before the last, and a full stop.', own: 'There is one owner, so the apostrophe goes before the s.' }[kind]] });
    },
    verify: function (q) { var p = q.params, ok = p.items.filter(function (s) { return rule(p.kind, s); }); return ok.length === 1 && picked(q) === ok[0]; } });

  // ================= E6 comprehension (original passages) =================
  // each question: [question, right answer, four wrong answers, the words in the passage that prove the answer]
  var PASSAGES = [
    { title: 'The Lighthouse Keeper’s Cat', text: 'Every evening, when the last fishing boat had come home, Bramble the cat climbed the one hundred and twelve steps of the lighthouse. She did not hurry. She paused on the forty-second step, where a crack in the wall let in the smell of the sea, and again at the little window halfway up. At the top, old Mr Penhallow would be polishing the great lamp. He always saved her a sardine. Together they watched the beam sweep across the dark water, and Bramble purred so loudly that Mr Penhallow said she was the second engine of the lighthouse.',
      qs: [['How many steps does the lighthouse have?', 'one hundred and twelve', ['forty-two', 'one hundred', 'twelve', 'two hundred and twelve'], 'one hundred and twelve steps'],
        ['When does Bramble climb the lighthouse?', 'after the last fishing boat comes home', ['early every morning', 'when Mr Penhallow calls her', 'only when it is stormy', 'after she has eaten her sardine'], 'when the last fishing boat had come home'],
        ['What does "paused" mean in the passage?', 'stopped for a short time', ['ran quickly', 'fell asleep', 'turned back', 'called out'], 'She paused on the forty-second step'],
        ['Why does Bramble stop on the forty-second step?', 'she can smell the sea there', ['she is too tired to go on', 'Mr Penhallow meets her there', 'the steps are broken above it', 'she can see the boats from there'], 'let in the smell of the sea'],
        ['Why does Mr Penhallow call Bramble "the second engine of the lighthouse"?', 'her purring is very loud', ['she helps to turn the lamp', 'she is very fast on the steps', 'she keeps the lighthouse warm', 'she eats a lot of fish'], 'purred so loudly']] },
    { title: 'The Allotment', text: 'Grandad’s allotment was at the end of a lane lined with brambles. Ravi had always thought it was boring: rows of cabbages, a shed that smelt of damp sacks, and a water butt full of drowned leaves. But this spring, Grandad handed him a packet of seeds and a small square of earth. "Yours," he said. "Whatever grows, you decide what to do with it." Ravi chose sunflowers. For weeks nothing happened, and he nearly gave up. Then, one Saturday in June, he found a row of green shoots pushing through the soil like tiny fists. By August, the sunflowers were taller than Grandad.',
      qs: [['What did Ravi think of the allotment at first?', 'he found it boring', ['he loved it', 'he was scared of it', 'he thought it was too small', 'he had never seen it'], 'thought it was boring'],
        ['What did Grandad give Ravi?', 'a packet of seeds and a small square of earth', ['a spade and some sacks', 'a sunflower in a pot', 'the key to the shed', 'a book about gardening'], 'a packet of seeds and a small square of earth'],
        ['How did Ravi feel when nothing grew for weeks?', 'he nearly gave up', ['he was excited', 'he blamed Grandad', 'he planted more seeds', 'he did not notice'], 'he nearly gave up'],
        ['The shoots are compared to "tiny fists". What does this suggest?', 'they were pushing up strongly', ['they were angry', 'they were very pale', 'they were hard to see', 'they were dying'], 'pushing through the soil like tiny fists'],
        ['How tall were the sunflowers by August?', 'taller than Grandad', ['as tall as Ravi', 'taller than the shed', 'just above the soil', 'as high as the brambles'], 'taller than Grandad']] },
    { title: 'Honeybees', text: 'A honeybee colony can contain more than fifty thousand bees, yet only one of them, the queen, lays eggs. The worker bees are all female, and each has a job that changes as she grows older. Young workers clean the hive and feed the larvae. Later they build wax comb and guard the entrance. In the final weeks of their short lives, they fly out to collect nectar and pollen. A forager may visit hundreds of flowers on a single trip. When she finds a good patch, she returns and performs a "waggle dance", which tells the other bees the direction and distance of the flowers.',
      qs: [['How many bees in a colony lay eggs?', 'only one, the queen', ['all the females', 'about fifty thousand', 'the young workers', 'none of them'], 'only one of them, the queen, lays eggs'],
        ['What do young worker bees do?', 'clean the hive and feed the larvae', ['collect nectar and pollen', 'perform the waggle dance', 'guard the entrance', 'lay eggs'], 'Young workers clean the hive and feed the larvae'],
        ['When do worker bees collect nectar?', 'in the final weeks of their lives', ['as soon as they hatch', 'only in winter', 'before they build comb', 'when the queen tells them'], 'In the final weeks of their short lives'],
        ['What is the purpose of the waggle dance?', 'to show other bees where the flowers are', ['to warn of danger', 'to choose a new queen', 'to keep the hive warm', 'to scare away wasps'], 'tells the other bees the direction and distance'],
        ['The passage says workers have "short lives". Which word means the same as "short" here?', 'brief', ['small', 'rude', 'low', 'narrow'], 'short lives']] },
    { title: 'The Storm', text: 'By the time the girls reached the top of the hill, the sky had turned the colour of a bruise. Nell wanted to run for the farmhouse, but Kit, who was older and thought she knew everything, insisted they could beat the rain. They could not. The first drops were fat and slow; then the whole sky seemed to empty at once. They sheltered under an oak tree until a flash lit the field white, and Nell remembered her father’s warning: never stand under a tall tree in a thunderstorm. She grabbed Kit’s hand and pulled her, slipping and laughing, down the muddy path.',
      qs: [['What does "the colour of a bruise" tell us about the sky?', 'it was dark and purple', ['it was bright blue', 'it was clear', 'it was turning orange at sunset', 'it was white with snow'], 'the colour of a bruise'],
        ['Who wanted to run for the farmhouse?', 'Nell', ['Kit', 'both girls', 'Nell’s father', 'nobody'], 'Nell wanted to run for the farmhouse'],
        ['What does the passage suggest about Kit?', 'she was over-confident', ['she was frightened of storms', 'she was younger than Nell', 'she knew a lot about weather', 'she wanted to go home'], 'thought she knew everything'],
        ['Why did Nell pull Kit away from the oak tree?', 'it is dangerous to stand under a tall tree in a storm', ['the tree was about to fall', 'they were getting too wet', 'Kit was cold', 'the farmhouse was close'], 'never stand under a tall tree in a thunderstorm'],
        ['Which word best describes how the girls felt at the end?', 'relieved', ['furious', 'bored', 'lonely', 'jealous'], 'slipping and laughing']] },
    { title: 'The Great Fire of London', text: 'In the early hours of 2 September 1666, a fire began in a bakery on Pudding Lane. London’s houses were mostly made of wood, packed closely together, and the summer had been long and dry. A strong east wind carried sparks from roof to roof. People fled with whatever they could carry; some buried their valuables, and the diarist Samuel Pepys famously buried a cheese. The fire burned for four days. It destroyed over thirteen thousand houses and St Paul’s Cathedral, yet very few deaths were recorded. Afterwards, new buildings had to be made of brick and stone.',
      qs: [['Where did the fire start?', 'in a bakery on Pudding Lane', ['in St Paul’s Cathedral', 'at Samuel Pepys’s house', 'by the river', 'in a stable'], 'a fire began in a bakery on Pudding Lane'],
        ['Which of these helped the fire to spread?', 'a strong east wind', ['heavy rain', 'brick buildings', 'a cold winter', 'wide streets'], 'A strong east wind carried sparks'],
        ['How long did the fire burn?', 'four days', ['four weeks', 'one night', 'two days', 'thirteen days'], 'The fire burned for four days'],
        ['What did Samuel Pepys bury?', 'a cheese', ['his diary', 'his money', 'a loaf of bread', 'a painting'], 'buried a cheese'],
        ['What changed after the fire?', 'new buildings had to be made of brick and stone', ['houses had to be made of wood', 'bakeries were banned', 'nobody was allowed to live in London', 'the cathedral was never rebuilt'], 'new buildings had to be made of brick and stone']] }];
  var QLIST = []; PASSAGES.forEach(function (p, i) { p.qs.forEach(function (q, j) { QLIST.push([i, j]); }); });
  function passageBox(p) { return '<div class="passage"><h4>' + p.title + '</h4><p>' + p.text + '</p></div>'; }
  K.gen({ id: 'xeComp', objective: 'XP-E6', title: 'Comprehension',
    make: function (r, L) {
      // level 1: finding information; levels 2 and 3 add meaning, inference and language questions
      var pool = QLIST.filter(function (x) { var k = x[1]; return L === 1 ? [0, 1, 4].indexOf(k) >= 0 || (x[0] === 4) : L === 2 ? true : [2, 3, 4].indexOf(k) >= 0; });
      var pick = r.pick(pool), P = PASSAGES[pick[0]], Qn = P.qs[pick[1]], items = r.shuffle([Qn[1]].concat(Qn[2]));
      return five('Read the passage, then answer: <b>' + Qn[0] + '</b>', items, Qn[1], { visual: passageBox(P), hint: 'Find the part of the passage that answers the question. Read the sentences around it too.', params: { p: pick[0], k: pick[1] },
        sol: ['The answer is "' + Qn[1] + '".', 'The passage says: "' + Qn[3] + '".'] });
    },
    verify: function (q) { var Qn = PASSAGES[q.params.p].qs[q.params.k]; return picked(q) === Qn[1] && PASSAGES[q.params.p].text.indexOf(Qn[3]) >= 0 && q.params.items.length === 5 && new Set(q.params.items).size === 5; } });

  // ================= the 11+ English topics =================
  function o(id, title, gens, vocab, intro, method, mistakes) { return { id: id, statement: title, title: title, gens: gens, vocab: vocab, intro: intro, method: method, mistakes: mistakes, focus: '11+ practice' }; }
  var region = { id: 'xe', name: '11+ English', strand: '11+ English', color: '#c2552f', icon: 'book', eleven: true, objectives: [
    o('XP-E1', 'Spelling', ['xeSpell'], ['spelling', 'silent letter', 'double letter', 'prefix'], [{ say: 'Many 11+ spelling questions use tricky words: double letters (necessary), "ie" and "ei" (receive), and silent letters (island).' }], ['Read each word slowly.', 'Picture the word written down.', 'Remember "i before e, except after c" has exceptions, such as weird.'], ['Guessing without looking at every option.', 'Using American spellings, such as color.']),
    o('XP-E2', 'Synonyms', ['xeSynonym'], ['synonym', 'meaning', 'context'], [{ say: 'A synonym is a word with nearly the same meaning: huge and enormous are synonyms.' }], ['Think what the word means.', 'Put each option into a sentence.', 'Choose the closest meaning.'], ['Picking the opposite by mistake.', 'Choosing a word that is only linked, not the same.']),
    o('XP-E3', 'Antonyms', ['xeAntonym'], ['antonym', 'opposite', 'meaning'], [{ say: 'An antonym is a word with the opposite meaning: generous and cruel are antonyms.' }], ['Think of a synonym first.', 'Then look for its opposite.', 'Watch out for options that mean the same.'], ['Choosing a synonym instead of an opposite.', 'Choosing a word that is just different, not opposite.']),
    o('XP-E4', 'Word classes', ['xeWordClass'], ['noun', 'verb', 'adjective', 'adverb', 'preposition'], [{ say: 'Nouns name things. Verbs are actions. Adjectives describe nouns. Adverbs describe verbs. Prepositions show where.' }], ['Find the action word first: that is the verb.', 'Ask what describes it (adverb) and what describes the noun (adjective).', 'Where-words are prepositions.'], ['Mixing up adjectives and adverbs.', 'Thinking every -ly word is an adjective.']),
    o('XP-E5', 'Punctuation', ['xePunct'], ['speech marks', 'apostrophe', 'comma', 'capital letter'], [{ say: 'Punctuation inside speech goes inside the speech marks: "Where is my coat?" asked Jack.' }], ['Check capital letters at the start and for names.', 'Check the speech marks and what is inside them.', 'Check commas, apostrophes and the full stop.'], ['Putting the question mark outside the speech marks.', 'Adding an apostrophe to a plural, such as apple\'s.']),
    o('XP-E6', 'Comprehension', ['xeComp'], ['retrieve', 'infer', 'evidence', 'passage'], [{ say: 'Some answers are written in the passage. Others you must work out from clues: this is called inference.' }], ['Read the whole passage first.', 'Find the lines that answer the question.', 'Check every option against the passage.'], ['Choosing an answer that is true in real life but not in the passage.', 'Not reading the sentences around the answer.'])
  ] };
  XP.regions.push(region);
  region.objectives.forEach(function (ob) { ob.region = 'xe'; ob.year = 'XP'; OM.objectiveIndex[ob.id] = ob; });
  XP.tests.english = { title: '11+ English test', minutes: 25, count: 24, region: 'xe' };
})(typeof window !== 'undefined' ? window : globalThis);
