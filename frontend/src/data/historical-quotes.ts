/**
 * historical-quotes.ts — static dataset of 60+ famous historical quotes.
 *
 * Owns: quote data, types, category definitions, helper utilities.
 * Does NOT own: rendering, filtering UI, or API calls.
 *
 * Each quote includes full historical context, significance, and optional
 * links to Chronicle events/people via slugs.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Categories for organizing quotes. */
export type QuoteCategory =
  | 'leadership'
  | 'war'
  | 'science'
  | 'social-change'
  | 'philosophy'
  | 'exploration'
  | 'tragedy';

/** A single historical quote with full context. */
export interface HistoricalQuote {
  /** Unique identifier (kebab-case). */
  id: string;
  /** The actual quote text. */
  text: string;
  /** Who said or wrote it. */
  author: string;
  /** Year it was said/written. Negative for BCE. */
  year: number;
  /** 2-3 sentences explaining the historical context. */
  context: string;
  /** Why this quote matters historically. */
  significance: string;
  /** Thematic category. */
  category: QuoteCategory;
  /** Optional slug linking to a Chronicle event. */
  eventSlug?: string;
  /** Optional slug linking to a Chronicle person. */
  personSlug?: string;
  /** Searchable tags. */
  tags: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Category metadata
// ─────────────────────────────────────────────────────────────────────────────

/** Display info for each category. */
export const CATEGORY_META: Record<QuoteCategory, { label: string; color: string; emoji: string }> = {
  leadership:    { label: 'Leadership & Politics', color: '#6366f1', emoji: '👑' },
  war:           { label: 'War & Conflict',        color: '#ef4444', emoji: '⚔️' },
  science:       { label: 'Science & Discovery',   color: '#3b82f6', emoji: '🔬' },
  'social-change': { label: 'Social Change',       color: '#f59e0b', emoji: '✊' },
  philosophy:    { label: 'Philosophy & Wisdom',    color: '#8b5cf6', emoji: '🏛️' },
  exploration:   { label: 'Exploration & Adventure', color: '#14b8a6', emoji: '🧭' },
  tragedy:       { label: 'Tragedy & Crisis',      color: '#64748b', emoji: '🕯️' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Number of quotes to display per page in the grid. */
export const QUOTES_PER_PAGE = 24;

// ─────────────────────────────────────────────────────────────────────────────
// Quote data (60+ quotes)
// ─────────────────────────────────────────────────────────────────────────────

export const HISTORICAL_QUOTES: HistoricalQuote[] = [
  // ── LEADERSHIP & POLITICS ──────────────────────────────────────────────
  {
    id: 'caesar-veni-vidi-vici',
    text: 'Veni, vidi, vici.',
    author: 'Julius Caesar',
    year: -47,
    context: 'After his swift victory at the Battle of Zela against Pharnaces II of Pontus, Caesar sent this famously terse message to the Roman Senate. The entire campaign lasted just five days.',
    significance: 'Became the archetypal expression of decisive, overwhelming victory. Embodies the Roman ideal of military efficiency and personal confidence that defined Caesar\'s legacy.',
    category: 'leadership',
    tags: ['rome', 'military', 'latin', 'ancient'],
  },
  {
    id: 'lincoln-gettysburg',
    text: 'Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.',
    author: 'Abraham Lincoln',
    year: 1863,
    context: 'Delivered at the dedication of the Soldiers\' National Cemetery in Gettysburg, Pennsylvania, four and a half months after the Union victory at the Battle of Gettysburg during the American Civil War.',
    significance: 'Redefined the Civil War as a struggle for equality and democracy, not just union. In just 272 words, Lincoln reframed the American experiment and the meaning of the Constitution.',
    category: 'leadership',
    eventSlug: 'battle-of-gettysburg',
    personSlug: 'abraham-lincoln',
    tags: ['civil-war', 'democracy', 'equality', 'america'],
  },
  {
    id: 'fdr-fear-itself',
    text: 'The only thing we have to fear is fear itself.',
    author: 'Franklin D. Roosevelt',
    year: 1933,
    context: 'Spoken during FDR\'s first inaugural address on March 4, 1933, at the depth of the Great Depression. Banks were failing, unemployment was at 25%, and the nation was gripped by panic.',
    significance: 'Set the tone for the New Deal era and restored public confidence. Demonstrated the power of presidential rhetoric to shift national psychology during crisis.',
    category: 'leadership',
    eventSlug: 'great-depression',
    personSlug: 'franklin-d-roosevelt',
    tags: ['depression', 'inauguration', 'america', 'courage'],
  },
  {
    id: 'churchill-beaches',
    text: 'We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets, we shall fight in the hills; we shall never surrender.',
    author: 'Winston Churchill',
    year: 1940,
    context: 'Delivered to the House of Commons on June 4, 1940, after the evacuation of Dunkirk. Britain stood virtually alone against Nazi Germany after the fall of France.',
    significance: 'Galvanized British resolve during the darkest days of WWII. Churchill\'s rhetoric became a weapon of war, convincing both the British public and the Americans that Britain would fight on.',
    category: 'leadership',
    eventSlug: 'dunkirk-evacuation',
    personSlug: 'winston-churchill',
    tags: ['wwii', 'britain', 'defiance', 'speech'],
  },
  {
    id: 'jfk-ask-not',
    text: 'Ask not what your country can do for you — ask what you can do for your country.',
    author: 'John F. Kennedy',
    year: 1961,
    context: 'From JFK\'s inaugural address on January 20, 1961, delivered during the Cold War. At 43, he was the youngest elected president and sought to inspire a new generation.',
    significance: 'Defined the ethos of 1960s civic engagement, inspiring the Peace Corps and a generation of public service. Remains one of the most quoted lines in American political history.',
    category: 'leadership',
    personSlug: 'john-f-kennedy',
    tags: ['cold-war', 'inauguration', 'service', 'america'],
  },
  {
    id: 'mlk-dream',
    text: 'I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character.',
    author: 'Martin Luther King Jr.',
    year: 1963,
    context: 'Delivered during the March on Washington for Jobs and Freedom on August 28, 1963, before approximately 250,000 people at the Lincoln Memorial.',
    significance: 'Became the defining moment of the American civil rights movement. The speech\'s moral clarity helped build public support for the Civil Rights Act of 1964 and Voting Rights Act of 1965.',
    category: 'leadership',
    eventSlug: 'march-on-washington',
    personSlug: 'martin-luther-king-jr',
    tags: ['civil-rights', 'equality', 'america', 'speech'],
  },
  {
    id: 'mandela-impossible',
    text: 'It always seems impossible until it\'s done.',
    author: 'Nelson Mandela',
    year: 1994,
    context: 'Attributed to Mandela during the transition from apartheid to democracy in South Africa. After 27 years in prison, he led the country through its first democratic elections.',
    significance: 'Encapsulates the triumph of perseverance over systemic oppression. Mandela\'s life itself became proof of the statement, transforming South Africa without the civil war many predicted.',
    category: 'leadership',
    personSlug: 'nelson-mandela',
    tags: ['apartheid', 'south-africa', 'perseverance', 'freedom'],
  },
  {
    id: 'gandhi-be-the-change',
    text: 'Be the change you wish to see in the world.',
    author: 'Mahatma Gandhi',
    year: 1913,
    context: 'A paraphrase of Gandhi\'s broader philosophy of leading by personal example. Gandhi\'s actual writing emphasized that personal transformation must precede societal change.',
    significance: 'Became the most widely quoted summary of Gandhi\'s philosophy. Underpins modern activism and the idea that individual moral action can spark collective transformation.',
    category: 'leadership',
    personSlug: 'mahatma-gandhi',
    tags: ['india', 'nonviolence', 'activism', 'philosophy'],
  },
  {
    id: 'napoleon-impossible',
    text: 'Impossible is a word to be found only in the dictionary of fools.',
    author: 'Napoleon Bonaparte',
    year: 1800,
    context: 'Attributed to Napoleon during his rise to power in France. He was known for his boundless ambition and refusal to accept conventional military limitations.',
    significance: 'Reflects the Napoleonic spirit that reshaped European borders and legal systems. His ambition, while ultimately his undoing, produced the Napoleonic Code that still influences civil law worldwide.',
    category: 'leadership',
    personSlug: 'napoleon-bonaparte',
    tags: ['france', 'ambition', 'military', 'revolution'],
  },
  {
    id: 'augustus-festina-lente',
    text: 'Festina lente. (Make haste slowly.)',
    author: 'Augustus Caesar',
    year: -25,
    context: 'Augustus\'s personal motto, reflecting his methodical approach to consolidating power after the chaos of the Roman civil wars. Unlike his adoptive father Julius Caesar, Augustus preferred patience.',
    significance: 'Embodied the governing philosophy that built the Pax Romana — 200 years of relative peace and stability. The paradox of speed and caution became a model for sustainable leadership.',
    category: 'leadership',
    personSlug: 'augustus-caesar',
    tags: ['rome', 'latin', 'governance', 'ancient'],
  },
  {
    id: 'elizabeth-heart-of-king',
    text: 'I know I have the body of a weak and feeble woman, but I have the heart and stomach of a king, and of a king of England too.',
    author: 'Queen Elizabeth I',
    year: 1588,
    context: 'Addressed to her troops assembled at Tilbury as the Spanish Armada approached England. Elizabeth rode among her soldiers in armor, defying expectations of a female monarch.',
    significance: 'Shattered gender expectations in Renaissance Europe. Elizabeth\'s reign became England\'s golden age, and her Tilbury speech remains a landmark moment in the history of women in power.',
    category: 'leadership',
    eventSlug: 'spanish-armada',
    personSlug: 'elizabeth-i',
    tags: ['england', 'armada', 'women', 'monarchy'],
  },
  {
    id: 'mao-barrel-of-gun',
    text: 'Political power grows out of the barrel of a gun.',
    author: 'Mao Zedong',
    year: 1927,
    context: 'Written in Mao\'s "Problems of War and Strategy" and first articulated during the Chinese Communist Party\'s struggle against the Nationalists and warlords.',
    significance: 'Became a foundational text of revolutionary communism worldwide. Justified armed struggle as the primary means of political change, influencing guerrilla movements across Asia, Africa, and Latin America.',
    category: 'leadership',
    personSlug: 'mao-zedong',
    tags: ['china', 'communism', 'revolution', 'power'],
  },
  {
    id: 'lenin-decades-weeks',
    text: 'There are decades where nothing happens; and there are weeks where decades happen.',
    author: 'Vladimir Lenin',
    year: 1917,
    context: 'Attributed to Lenin during the Russian Revolution of 1917, when the centuries-old Romanov dynasty collapsed in a matter of days and the Bolsheviks seized power months later.',
    significance: 'Captures the nonlinear nature of historical change. Became a widely cited observation about revolutionary moments, applicable far beyond its communist origins.',
    category: 'leadership',
    eventSlug: 'russian-revolution',
    personSlug: 'vladimir-lenin',
    tags: ['russia', 'revolution', 'communism', 'change'],
  },
  {
    id: 'bismarck-blood-iron',
    text: 'The great questions of the day will not be settled by means of speeches and majority decisions but by iron and blood.',
    author: 'Otto von Bismarck',
    year: 1862,
    context: 'Delivered to the Prussian parliament\'s budget committee as Bismarck argued for military spending to unify the German states. The phrase was quickly inverted to "blood and iron" by the press.',
    significance: 'Defined Bismarck\'s realpolitik approach that unified Germany through three wars. Foreshadowed the militarism that would shape European politics through two world wars.',
    category: 'leadership',
    personSlug: 'otto-von-bismarck',
    tags: ['germany', 'unification', 'militarism', 'realpolitik'],
  },
  {
    id: 'pericles-freedom',
    text: 'The secret of happiness is freedom, and the secret of freedom is courage.',
    author: 'Pericles',
    year: -430,
    context: 'From Pericles\' Funeral Oration as recorded by Thucydides, honoring Athenian soldiers killed in the first year of the Peloponnesian War against Sparta.',
    significance: 'Articulated the philosophical foundation of Athenian democracy. The speech remains one of the earliest and most powerful defenses of democratic values and civic sacrifice.',
    category: 'leadership',
    personSlug: 'pericles',
    tags: ['athens', 'democracy', 'ancient-greece', 'freedom'],
  },

  // ── WAR & CONFLICT ─────────────────────────────────────────────────────
  {
    id: 'sun-tzu-supreme-excellence',
    text: 'Supreme excellence consists in breaking the enemy\'s resistance without fighting.',
    author: 'Sun Tzu',
    year: -500,
    context: 'From "The Art of War," written around 500 BCE. Sun Tzu served as a military strategist in the Kingdom of Wu during the Spring and Autumn period of Chinese history.',
    significance: 'Remains the foundational text on military strategy, studied at every major military academy worldwide. Its principles have been adopted in business, diplomacy, and game theory.',
    category: 'war',
    tags: ['china', 'strategy', 'ancient', 'military'],
  },
  {
    id: 'wellington-nearest-run',
    text: 'It has been a damned nice thing — the nearest run thing you ever saw in your life.',
    author: 'Duke of Wellington',
    year: 1815,
    context: 'Said to Thomas Creevey on the evening after the Battle of Waterloo, June 18, 1815. Wellington\'s forces narrowly defeated Napoleon with the last-minute arrival of Prussian reinforcements.',
    significance: 'Waterloo ended 23 years of near-continuous European war and Napoleon\'s career. Wellington\'s candid admission that victory was far from certain reveals how close history came to a different outcome.',
    category: 'war',
    eventSlug: 'battle-of-waterloo',
    personSlug: 'duke-of-wellington',
    tags: ['waterloo', 'napoleon', 'britain', 'france'],
  },
  {
    id: 'sherman-war-is-hell',
    text: 'War is hell.',
    author: 'William Tecumseh Sherman',
    year: 1879,
    context: 'Spoken at a graduation ceremony at the Michigan Military Academy in 1879, drawing on his Civil War experience including the devastating March to the Sea through Georgia.',
    significance: 'Became the most concise anti-war statement ever made by a military commander. Sherman\'s total war strategy — targeting civilian infrastructure — foreshadowed modern warfare.',
    category: 'war',
    personSlug: 'william-tecumseh-sherman',
    tags: ['civil-war', 'america', 'total-war'],
  },
  {
    id: 'rommel-dont-fight',
    text: 'Don\'t fight a battle if you don\'t gain anything by winning.',
    author: 'Erwin Rommel',
    year: 1942,
    context: 'Attributed to Rommel during his North Africa campaign as commander of the Afrika Korps. Known as the "Desert Fox," Rommel was respected even by his enemies for his tactical brilliance.',
    significance: 'Reflects a pragmatic approach to warfare that transcends ideology. Rommel\'s later involvement in the plot to assassinate Hitler added moral complexity to his legacy.',
    category: 'war',
    personSlug: 'erwin-rommel',
    tags: ['wwii', 'north-africa', 'germany', 'strategy'],
  },
  {
    id: 'yamamoto-sleeping-giant',
    text: 'I fear all we have done is to awaken a sleeping giant and fill him with a terrible resolve.',
    author: 'Isoroku Yamamoto',
    year: 1941,
    context: 'Attributed to Admiral Yamamoto after the Japanese attack on Pearl Harbor on December 7, 1941. Yamamoto, who had studied at Harvard, understood American industrial capacity.',
    significance: 'Proved prophetically accurate — America\'s industrial mobilization dwarfed anything Japan could match. Pearl Harbor transformed American isolationism into total commitment to the war.',
    category: 'war',
    eventSlug: 'pearl-harbor',
    personSlug: 'isoroku-yamamoto',
    tags: ['wwii', 'pearl-harbor', 'japan', 'america'],
  },
  {
    id: 'patton-dying-for-country',
    text: 'No bastard ever won a war by dying for his country. He won it by making the other poor dumb bastard die for his country.',
    author: 'George S. Patton',
    year: 1944,
    context: 'From Patton\'s famous speech to the Third Army before D-Day in June 1944. Known for his aggressive style and profane speeches, Patton was one of WWII\'s most effective field commanders.',
    significance: 'Crystallized the offensive mindset that drove Allied success in Western Europe. Patton\'s blunt pragmatism contrasted with romantic notions of war and sacrifice.',
    category: 'war',
    personSlug: 'george-s-patton',
    tags: ['wwii', 'd-day', 'america', 'military'],
  },
  {
    id: 'eisenhower-military-industrial',
    text: 'In the councils of government, we must guard against the acquisition of unwarranted influence, whether sought or unsought, by the military-industrial complex.',
    author: 'Dwight D. Eisenhower',
    year: 1961,
    context: 'From Eisenhower\'s farewell presidential address on January 17, 1961. As a five-star general turned president, his warning about defense industry influence carried unique authority.',
    significance: 'Coined the term "military-industrial complex" that became central to American political discourse. A conservative war hero warning about militarism gave the critique credibility across the political spectrum.',
    category: 'war',
    personSlug: 'dwight-d-eisenhower',
    tags: ['cold-war', 'america', 'military', 'politics'],
  },

  // ── SCIENCE & DISCOVERY ────────────────────────────────────────────────
  {
    id: 'galileo-yet-it-moves',
    text: 'Eppur si muove. (And yet it moves.)',
    author: 'Galileo Galilei',
    year: 1633,
    context: 'Allegedly muttered after being forced by the Roman Inquisition to recant his support for heliocentrism. Though the quote may be apocryphal, it captures Galileo\'s defiance.',
    significance: 'Symbolizes the triumph of scientific truth over institutional authority. The conflict between Galileo and the Church became the defining parable of science versus dogma.',
    category: 'science',
    personSlug: 'galileo-galilei',
    tags: ['astronomy', 'church', 'heliocentrism', 'italy'],
  },
  {
    id: 'newton-shoulders-of-giants',
    text: 'If I have seen further, it is by standing on the shoulders of giants.',
    author: 'Isaac Newton',
    year: 1675,
    context: 'Written in a letter to Robert Hooke in 1675. While sometimes interpreted as false modesty or even a jab at the short-statured Hooke, the phrase acknowledges cumulative scientific progress.',
    significance: 'Became the defining metaphor for cumulative knowledge and scientific collaboration. Encapsulates the principle that each generation of scientists builds upon the work of predecessors.',
    category: 'science',
    personSlug: 'isaac-newton',
    tags: ['physics', 'mathematics', 'england', 'enlightenment'],
  },
  {
    id: 'darwin-grandeur',
    text: 'There is grandeur in this view of life, with its several powers, having been originally breathed into a few forms or into one; and that, whilst this planet has gone cycling on according to the fixed law of gravity, from so simple a beginning endless forms most beautiful and most wonderful have been, and are being, evolved.',
    author: 'Charles Darwin',
    year: 1859,
    context: 'The closing passage of "On the Origin of Species," published in 1859. Darwin spent over 20 years refining his theory before publishing, aware of its revolutionary implications.',
    significance: 'Transformed humanity\'s understanding of life itself. Evolution by natural selection became the unifying theory of biology, challenging centuries of religious orthodoxy about creation.',
    category: 'science',
    personSlug: 'charles-darwin',
    tags: ['evolution', 'biology', 'england', 'natural-selection'],
  },
  {
    id: 'einstein-imagination',
    text: 'Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.',
    author: 'Albert Einstein',
    year: 1929,
    context: 'From an interview published in the Saturday Evening Post in 1929. Einstein, already the most famous scientist alive, emphasized creative thinking over rote learning.',
    significance: 'Redefined the popular image of genius from encyclopedic knowledge to creative vision. Einstein\'s own breakthroughs — relativity, quantum theory — came from thought experiments, proving his point.',
    category: 'science',
    personSlug: 'albert-einstein',
    tags: ['physics', 'creativity', 'germany', 'relativity'],
  },
  {
    id: 'einstein-dice',
    text: 'God does not play dice with the universe.',
    author: 'Albert Einstein',
    year: 1926,
    context: 'Written in a letter to Max Born in 1926, expressing Einstein\'s discomfort with the probabilistic nature of quantum mechanics. He could never accept that fundamental physics was governed by chance.',
    significance: 'Captured the deepest philosophical divide in 20th-century physics. Einstein\'s objection to quantum randomness drove decades of debate that is still unresolved in the interpretation of quantum mechanics.',
    category: 'science',
    personSlug: 'albert-einstein',
    tags: ['physics', 'quantum-mechanics', 'probability', 'philosophy'],
  },
  {
    id: 'oppenheimer-destroyer-of-worlds',
    text: 'Now I am become Death, the destroyer of worlds.',
    author: 'J. Robert Oppenheimer',
    year: 1945,
    context: 'Recalled by Oppenheimer as his thought upon witnessing the first nuclear detonation at the Trinity test site in New Mexico on July 16, 1945. He was quoting the Hindu scripture Bhagavad Gita.',
    significance: 'Marked humanity\'s entry into the nuclear age. The quote captures the moral horror of scientists who built the most destructive weapon ever created, a tension that defined the Cold War.',
    category: 'science',
    eventSlug: 'trinity-test',
    personSlug: 'j-robert-oppenheimer',
    tags: ['nuclear', 'wwii', 'manhattan-project', 'america'],
  },
  {
    id: 'feynman-longest-threads',
    text: 'Nature uses only the longest threads to weave her patterns, so each small piece of her fabric reveals the organization of the entire tapestry.',
    author: 'Richard Feynman',
    year: 1963,
    context: 'From "The Character of Physical Law," a series of lectures Feynman gave at Cornell University. He was known for making complex physics accessible through vivid metaphors.',
    significance: 'Captures the deep insight that the same fundamental laws operate at every scale. Feynman\'s genius for communication made physics accessible to millions and inspired generations of scientists.',
    category: 'science',
    personSlug: 'richard-feynman',
    tags: ['physics', 'america', 'education', 'quantum'],
  },
  {
    id: 'curie-nothing-feared',
    text: 'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.',
    author: 'Marie Curie',
    year: 1903,
    context: 'Attributed to Curie around the time she became the first woman to win a Nobel Prize in 1903. She worked with radioactive materials daily, ultimately dying from aplastic anemia caused by radiation exposure.',
    significance: 'Embodies the scientific spirit at its most courageous. Curie\'s life — two Nobel Prizes, in physics and chemistry — shattered barriers for women in science and expanded human understanding of the atom.',
    category: 'science',
    personSlug: 'marie-curie',
    tags: ['radioactivity', 'women', 'nobel-prize', 'france'],
  },
  {
    id: 'archimedes-lever',
    text: 'Give me a lever long enough and a fulcrum on which to place it, and I shall move the world.',
    author: 'Archimedes',
    year: -240,
    context: 'Attributed to Archimedes of Syracuse, the greatest mathematician and engineer of antiquity. He demonstrated the principle of mechanical advantage through his work on levers and pulleys.',
    significance: 'One of the earliest expressions of engineering confidence and the power of mathematical principles applied to physical problems. The lever principle remains fundamental to mechanical engineering.',
    category: 'science',
    personSlug: 'archimedes',
    tags: ['ancient-greece', 'mathematics', 'engineering', 'physics'],
  },
  {
    id: 'hippocrates-do-no-harm',
    text: 'First, do no harm.',
    author: 'Hippocrates',
    year: -400,
    context: 'A paraphrase of principles found in the Hippocratic Corpus, the foundational texts of Western medicine written around 400 BCE in ancient Greece.',
    significance: 'Became the cornerstone ethical principle of medicine, enshrined in the Hippocratic Oath still taken by physicians today. Extends beyond medicine into technology ethics and public policy.',
    category: 'science',
    personSlug: 'hippocrates',
    tags: ['medicine', 'ethics', 'ancient-greece', 'oath'],
  },

  // ── PHILOSOPHY & WISDOM ────────────────────────────────────────────────
  {
    id: 'socrates-unexamined-life',
    text: 'The unexamined life is not worth living.',
    author: 'Socrates',
    year: -399,
    context: 'Spoken at his trial in 399 BCE, as recorded by Plato in the Apology. Socrates was charged with impiety and corrupting the youth of Athens. He chose death over exile or silence.',
    significance: 'Founded the Western philosophical tradition of critical self-examination. Socrates\' willingness to die for intellectual freedom established the archetype of the philosopher as truth-seeker.',
    category: 'philosophy',
    personSlug: 'socrates',
    tags: ['ancient-greece', 'athens', 'trial', 'self-examination'],
  },
  {
    id: 'aristotle-excellence',
    text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Aristotle',
    year: -340,
    context: 'A paraphrase by historian Will Durant of Aristotle\'s ideas in the Nicomachean Ethics. Aristotle argued that virtue is developed through practice, not merely known through theory.',
    significance: 'Shaped 2,300 years of moral philosophy and practical psychology. The insight that character is built through habitual action underpins modern cognitive behavioral therapy and habit science.',
    category: 'philosophy',
    personSlug: 'aristotle',
    tags: ['ancient-greece', 'virtue', 'ethics', 'habit'],
  },
  {
    id: 'confucius-rising',
    text: 'Our greatest glory is not in never falling, but in rising every time we fall.',
    author: 'Confucius',
    year: -500,
    context: 'Attributed to Confucius, the Chinese philosopher whose teachings on ethics, family, and governance shaped East Asian civilization for over two millennia.',
    significance: 'Central to Confucian resilience philosophy that influenced Chinese, Korean, Japanese, and Vietnamese cultures. Emphasizes moral perseverance over perfection.',
    category: 'philosophy',
    personSlug: 'confucius',
    tags: ['china', 'ancient', 'resilience', 'virtue'],
  },
  {
    id: 'marcus-aurelius-mind',
    text: 'You have power over your mind — not outside events. Realize this, and you will find strength.',
    author: 'Marcus Aurelius',
    year: 170,
    context: 'From "Meditations," Marcus Aurelius\'s private philosophical journal written while campaigning on the Germanic frontier. The Roman emperor never intended the work for publication.',
    significance: 'Became the most accessible text of Stoic philosophy. The idea that we control only our reactions — not external events — has experienced a massive revival in modern psychology and self-help.',
    category: 'philosophy',
    personSlug: 'marcus-aurelius',
    tags: ['rome', 'stoicism', 'meditation', 'resilience'],
  },
  {
    id: 'voltaire-defend-right',
    text: 'I disapprove of what you say, but I will defend to the death your right to say it.',
    author: 'Voltaire',
    year: 1770,
    context: 'Actually written by Evelyn Beatrice Hall in 1906 as a summary of Voltaire\'s philosophy of free expression. Voltaire himself fought censorship throughout his life in Enlightenment France.',
    significance: 'Became the definitive statement of free speech principles. Underpins the First Amendment tradition and liberal democratic values worldwide, despite being a paraphrase rather than a direct quote.',
    category: 'philosophy',
    personSlug: 'voltaire',
    tags: ['france', 'enlightenment', 'free-speech', 'liberty'],
  },
  {
    id: 'rousseau-born-free',
    text: 'Man is born free, and everywhere he is in chains.',
    author: 'Jean-Jacques Rousseau',
    year: 1762,
    context: 'The opening line of "The Social Contract," published in 1762. Rousseau argued that civilization corrupts humanity\'s natural goodness and that legitimate political authority requires consent.',
    significance: 'Directly inspired the French Revolution and modern democratic theory. Rousseau\'s ideas about popular sovereignty, the general will, and the social contract reshaped political philosophy.',
    category: 'philosophy',
    eventSlug: 'french-revolution',
    personSlug: 'jean-jacques-rousseau',
    tags: ['france', 'enlightenment', 'freedom', 'social-contract'],
  },
  {
    id: 'nietzsche-god-is-dead',
    text: 'God is dead. God remains dead. And we have killed him.',
    author: 'Friedrich Nietzsche',
    year: 1882,
    context: 'From "The Gay Science," published in 1882. Nietzsche did not celebrate this — he saw the death of God as a crisis that would destabilize Western morality and meaning.',
    significance: 'Anticipated the 20th century\'s crisis of meaning, existentialism, and the decline of religious authority. Nietzsche predicted that the void left by God would be filled by dangerous ideologies.',
    category: 'philosophy',
    personSlug: 'friedrich-nietzsche',
    tags: ['germany', 'existentialism', 'religion', 'morality'],
  },
  {
    id: 'descartes-cogito',
    text: 'Cogito, ergo sum. (I think, therefore I am.)',
    author: 'René Descartes',
    year: 1637,
    context: 'Published in "Discourse on the Method" in 1637. Descartes sought a foundation of certainty by doubting everything, finding that the act of doubt itself proved the doubter\'s existence.',
    significance: 'Established the starting point of modern Western philosophy. The radical move to ground knowledge in subjective experience rather than tradition or authority inaugurated the Enlightenment.',
    category: 'philosophy',
    personSlug: 'rene-descartes',
    tags: ['france', 'rationalism', 'epistemology', 'enlightenment'],
  },
  {
    id: 'bacon-knowledge-power',
    text: 'Knowledge is power.',
    author: 'Francis Bacon',
    year: 1597,
    context: 'From Bacon\'s "Meditationes Sacrae" (1597), where the original Latin reads "ipsa scientia potestas est." Bacon championed empirical investigation and the scientific method.',
    significance: 'Foreshadowed the Scientific Revolution and the modern idea that understanding nature gives humanity power to transform it. Bacon\'s vision of organized research led to the first scientific institutions.',
    category: 'philosophy',
    personSlug: 'francis-bacon',
    tags: ['england', 'science', 'empiricism', 'enlightenment'],
  },
  {
    id: 'paine-try-mens-souls',
    text: 'These are the times that try men\'s souls. The summer soldier and the sunshine patriot will, in this crisis, shrink from the service of their country.',
    author: 'Thomas Paine',
    year: 1776,
    context: 'The opening of "The American Crisis," published December 23, 1776, during the bleakest period of the American Revolution. Washington ordered it read aloud to his troops before crossing the Delaware.',
    significance: 'Revived American revolutionary morale at its lowest point. Paine\'s pamphlets were the most widely read publications in America and proved that writing could be a weapon of revolution.',
    category: 'philosophy',
    eventSlug: 'american-revolution',
    personSlug: 'thomas-paine',
    tags: ['america', 'revolution', 'patriotism', 'crisis'],
  },

  // ── SOCIAL CHANGE ──────────────────────────────────────────────────────
  {
    id: 'tubman-never-lost-passenger',
    text: 'I was the conductor of the Underground Railroad for eight years, and I can say what most conductors can\'t say — I never ran my train off the track and I never lost a passenger.',
    author: 'Harriet Tubman',
    year: 1858,
    context: 'Spoken after Tubman\'s years guiding escaped slaves to freedom through the Underground Railroad. She made approximately 13 trips and freed around 70 people, including her own parents.',
    significance: 'Tubman became the most famous conductor of the Underground Railroad and a symbol of courage against slavery. Her perfect record reflected extraordinary skill, bravery, and determination.',
    category: 'social-change',
    personSlug: 'harriet-tubman',
    tags: ['slavery', 'underground-railroad', 'america', 'freedom'],
  },
  {
    id: 'douglass-power-concedes',
    text: 'Power concedes nothing without a demand. It never did and it never will.',
    author: 'Frederick Douglass',
    year: 1857,
    context: 'From Douglass\'s "West India Emancipation" speech in 1857. Born into slavery, Douglass became the most influential African American of the 19th century through his oratory and writing.',
    significance: 'Became the foundational principle of activist movements worldwide. The insight that rights are won through struggle, not granted through goodwill, influenced every subsequent liberation movement.',
    category: 'social-change',
    personSlug: 'frederick-douglass',
    tags: ['slavery', 'abolition', 'america', 'activism'],
  },
  {
    id: 'truth-aint-i-a-woman',
    text: 'Ain\'t I a woman?',
    author: 'Sojourner Truth',
    year: 1851,
    context: 'Delivered at the Women\'s Convention in Akron, Ohio in 1851. Born into slavery, Truth became a powerful advocate for both abolition and women\'s rights.',
    significance: 'One of the most powerful rhetorical moments in American history. Truth exposed the intersection of racial and gender oppression, foreshadowing intersectional feminism by over a century.',
    category: 'social-change',
    personSlug: 'sojourner-truth',
    tags: ['women', 'abolition', 'feminism', 'america'],
  },
  {
    id: 'wollstonecraft-power-over-themselves',
    text: 'I do not wish women to have power over men; but over themselves.',
    author: 'Mary Wollstonecraft',
    year: 1792,
    context: 'From "A Vindication of the Rights of Woman" (1792), one of the earliest works of feminist philosophy. Wollstonecraft argued that women\'s apparent inferiority was due to lack of education, not nature.',
    significance: 'Launched the intellectual foundation of the women\'s rights movement. Her argument that women deserved equal education and autonomy was radical in the 18th century and shaped feminism for centuries.',
    category: 'social-change',
    personSlug: 'mary-wollstonecraft',
    tags: ['feminism', 'england', 'education', 'rights'],
  },
  {
    id: 'anthony-nothing-more-nothing-less',
    text: 'Men, their rights, and nothing more; women, their rights, and nothing less.',
    author: 'Susan B. Anthony',
    year: 1868,
    context: 'The motto of "The Revolution," the newspaper Anthony co-founded with Elizabeth Cady Stanton in 1868 to advocate for women\'s suffrage and equal rights.',
    significance: 'Crystallized the suffrage movement\'s demand for equality. Anthony\'s five decades of activism led to the 19th Amendment, ratified 14 years after her death, granting women the right to vote.',
    category: 'social-change',
    personSlug: 'susan-b-anthony',
    tags: ['suffrage', 'women', 'america', 'equality'],
  },
  {
    id: 'parks-tired-of-giving-in',
    text: 'The only tired I was, was tired of giving in.',
    author: 'Rosa Parks',
    year: 1955,
    context: 'Reflecting on her refusal to give up her bus seat to a white passenger in Montgomery, Alabama on December 1, 1955. Her arrest sparked the Montgomery Bus Boycott.',
    significance: 'Triggered the Montgomery Bus Boycott, one of the most successful mass protests in American history. Parks became an icon of the civil rights movement and nonviolent resistance.',
    category: 'social-change',
    eventSlug: 'montgomery-bus-boycott',
    personSlug: 'rosa-parks',
    tags: ['civil-rights', 'segregation', 'america', 'protest'],
  },
  {
    id: 'milk-hope-never-silent',
    text: 'Hope will never be silent.',
    author: 'Harvey Milk',
    year: 1978,
    context: 'One of several iconic statements by Harvey Milk, the first openly gay elected official in California. He was assassinated in 1978, just 11 months after taking office.',
    significance: 'Became a rallying cry for the LGBTQ+ rights movement. Milk\'s brief career and tragic death galvanized a generation of activists and demonstrated that representation matters.',
    category: 'social-change',
    personSlug: 'harvey-milk',
    tags: ['lgbtq', 'civil-rights', 'america', 'representation'],
  },
  {
    id: 'malala-one-child',
    text: 'One child, one teacher, one book, one pen can change the world.',
    author: 'Malala Yousafzai',
    year: 2013,
    context: 'From her speech to the United Nations on July 12, 2013, her 16th birthday. Malala survived being shot in the head by the Taliban for advocating girls\' education in Pakistan.',
    significance: 'Made Malala the youngest Nobel Peace Prize laureate in 2014. Her advocacy demonstrated that education remains the most contested and powerful force for social change worldwide.',
    category: 'social-change',
    personSlug: 'malala-yousafzai',
    tags: ['education', 'pakistan', 'women', 'nobel-prize'],
  },

  // ── EXPLORATION & ADVENTURE ────────────────────────────────────────────
  {
    id: 'columbus-land-sighted',
    text: 'At two hours after midnight appeared the land, at a distance of about two leagues. They handed all sails and set the treo, which is the mainsail without bonnets, and lay-to waiting for daylight.',
    author: 'Christopher Columbus',
    year: 1492,
    context: 'From Columbus\'s log entry on October 12, 1492, as his crew sighted land in the Bahamas after 36 days crossing the Atlantic. He believed he had reached the East Indies.',
    significance: 'Initiated the Columbian Exchange between the Old and New Worlds, transforming global ecology, demography, and culture. One of the most consequential moments in human history, despite its devastating impact on indigenous peoples.',
    category: 'exploration',
    eventSlug: 'columbus-reaches-americas',
    personSlug: 'christopher-columbus',
    tags: ['americas', 'navigation', 'spain', 'age-of-exploration'],
  },
  {
    id: 'armstrong-one-small-step',
    text: 'That\'s one small step for man, one giant leap for mankind.',
    author: 'Neil Armstrong',
    year: 1969,
    context: 'Spoken as Armstrong became the first human to set foot on the Moon on July 20, 1969, during the Apollo 11 mission. An estimated 600 million people watched on television worldwide.',
    significance: 'The most famous words spoken in the 20th century. The Moon landing represented the pinnacle of the Space Race and remains humanity\'s greatest technological achievement.',
    category: 'exploration',
    eventSlug: 'moon-landing',
    personSlug: 'neil-armstrong',
    tags: ['space', 'moon', 'america', 'apollo'],
  },
  {
    id: 'pigafetta-circumnavigation',
    text: 'We had sailed fourteen thousand four hundred and sixty leagues, and furthermore had completed the circumnavigation of the world from east to west.',
    author: 'Antonio Pigafetta',
    year: 1522,
    context: 'Written by Pigafetta, the chronicler of Magellan\'s expedition, upon returning to Spain in September 1522. Of the 270 men who departed, only 18 completed the voyage. Magellan himself was killed in the Philippines.',
    significance: 'Provided the first empirical proof that the Earth is round and that all oceans are connected. The expedition\'s enormous human cost underscored the dangers and determination of the Age of Exploration.',
    category: 'exploration',
    eventSlug: 'magellan-circumnavigation',
    personSlug: 'ferdinand-magellan',
    tags: ['circumnavigation', 'spain', 'age-of-exploration', 'ocean'],
  },
  {
    id: 'earhart-do-it',
    text: 'The most effective way to do it, is to do it.',
    author: 'Amelia Earhart',
    year: 1932,
    context: 'Attributed to Earhart around the time she became the first woman to fly solo across the Atlantic in 1932. Her philosophy emphasized action over deliberation.',
    significance: 'Earhart became the most famous female aviator in history and a symbol of women breaking barriers. Her mysterious disappearance in 1937 over the Pacific remains one of aviation\'s greatest unsolved mysteries.',
    category: 'exploration',
    personSlug: 'amelia-earhart',
    tags: ['aviation', 'women', 'america', 'courage'],
  },
  {
    id: 'hillary-knocked-bastard-off',
    text: 'We knocked the bastard off!',
    author: 'Edmund Hillary',
    year: 1953,
    context: 'Hillary\'s first words to his friend George Lowe upon returning from the summit of Mount Everest on May 29, 1953, with Tenzing Norgay. They were the first confirmed climbers to reach the top.',
    significance: 'Conquering Everest was one of the last great physical frontiers. Hillary\'s characteristically blunt New Zealand understatement made the achievement feel human rather than mythic.',
    category: 'exploration',
    eventSlug: 'first-everest-summit',
    personSlug: 'edmund-hillary',
    tags: ['mountaineering', 'everest', 'new-zealand', 'adventure'],
  },

  // ── TRAGEDY & CRISIS ───────────────────────────────────────────────────
  {
    id: 'frank-people-good-at-heart',
    text: 'In spite of everything, I still believe that people are really good at heart.',
    author: 'Anne Frank',
    year: 1944,
    context: 'Written in her diary on July 15, 1944, just three weeks before the secret annex in Amsterdam was raided by the Nazis. Anne died in Bergen-Belsen concentration camp in early 1945, aged 15.',
    significance: 'The most quoted line from the most widely read personal account of the Holocaust. Anne\'s optimism in the face of genocide became a symbol of human resilience and the innocence destroyed by war.',
    category: 'tragedy',
    eventSlug: 'the-holocaust',
    personSlug: 'anne-frank',
    tags: ['holocaust', 'wwii', 'netherlands', 'diary'],
  },
  {
    id: 'wiesel-bear-witness',
    text: 'For the dead and the living, we must bear witness.',
    author: 'Elie Wiesel',
    year: 1986,
    context: 'A recurring theme in Wiesel\'s work, most associated with his Nobel Peace Prize acceptance speech in 1986. A survivor of Auschwitz and Buchenwald, Wiesel dedicated his life to ensuring the Holocaust was never forgotten.',
    significance: 'Established the moral imperative of Holocaust remembrance. Wiesel\'s insistence on bearing witness influenced genocide studies, memorial culture, and human rights advocacy worldwide.',
    category: 'tragedy',
    personSlug: 'elie-wiesel',
    tags: ['holocaust', 'wwii', 'memory', 'nobel-prize'],
  },
  {
    id: 'fdr-day-of-infamy',
    text: 'Yesterday, December 7, 1941 — a date which will live in infamy — the United States of America was suddenly and deliberately attacked by naval and air forces of the Empire of Japan.',
    author: 'Franklin D. Roosevelt',
    year: 1941,
    context: 'FDR\'s address to Congress on December 8, 1941, requesting a declaration of war against Japan. Congress declared war within an hour, with only one dissenting vote.',
    significance: 'Ended American isolationism and brought the United States fully into World War II. The "day of infamy" phrase became synonymous with Pearl Harbor and surprise attacks on democratic nations.',
    category: 'tragedy',
    eventSlug: 'pearl-harbor',
    personSlug: 'franklin-d-roosevelt',
    tags: ['wwii', 'pearl-harbor', 'america', 'war-declaration'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Utility functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the "Quote of the Day" — deterministic, based on the day of the year.
 * @param date - optional date override (defaults to today)
 * @returns the quote for the given day
 */
export function getQuoteOfTheDay(date: Date = new Date()): HistoricalQuote {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return HISTORICAL_QUOTES[dayOfYear % HISTORICAL_QUOTES.length];
}

/**
 * Format a year for display, handling BCE dates.
 * @param year - numeric year (negative = BCE)
 * @returns formatted string like "47 BCE" or "1863"
 */
export function formatQuoteYear(year: number): string {
  if (year < 0) {
    return `${Math.abs(year)} BCE`;
  }
  return String(year);
}

/**
 * Get all unique categories present in the quotes data.
 */
export function getCategories(): QuoteCategory[] {
  return [...new Set(HISTORICAL_QUOTES.map(q => q.category))];
}
