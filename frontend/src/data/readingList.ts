/**
 * Curated reading list data — real, well-known history books organized by
 * Chronicle's 6 historical eras.
 *
 * All data is static / hardcoded — no API calls needed.
 */

export type Era = 'ancient' | 'classical' | 'medieval' | 'early-modern' | 'modern' | 'contemporary';

export type BookTag = 'Primary Source' | 'Narrative History' | 'Academic' | 'Biography' | 'Popular Science';
export type Difficulty = 'Accessible' | 'Intermediate' | 'Scholarly';
export type ReadingStatus = 'Want to Read' | 'Reading' | 'Done';

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  emoji: string;
  description: string;
  tag: BookTag;
  difficulty: Difficulty;
  readTimeHours: number;
  era: Era;
  featured?: boolean;
}

export const ERA_LABELS: Record<Era, string> = {
  ancient: 'Ancient',
  classical: 'Classical',
  medieval: 'Medieval',
  'early-modern': 'Early Modern',
  modern: 'Modern',
  contemporary: 'Contemporary',
};

export const ERA_COLORS: Record<Era, string> = {
  ancient: '#f59e0b',
  classical: '#a855f7',
  medieval: '#ef4444',
  'early-modern': '#3b82f6',
  modern: '#22c55e',
  contemporary: '#06b6d4',
};

export const ERA_RANGES: Record<Era, string> = {
  ancient: '3000 BCE – 500 BCE',
  classical: '500 BCE – 500 CE',
  medieval: '500 – 1500',
  'early-modern': '1500 – 1800',
  modern: '1800 – 1945',
  contemporary: '1945 – Present',
};

export const BOOKS: Book[] = [
  // ── Ancient ────────────────────────────────────────────────────────────────
  {
    id: 'ancient-1',
    title: 'The Histories',
    author: 'Herodotus',
    year: -440,
    emoji: '🏛️',
    description:
      'The founding work of Western historiography, covering the Greco-Persian Wars and the cultures of the ancient Mediterranean. Herodotus weaves ethnography, geography, and storytelling into the first great narrative history.',
    tag: 'Primary Source',
    difficulty: 'Intermediate',
    readTimeHours: 24,
    era: 'ancient',
    featured: true,
  },
  {
    id: 'ancient-2',
    title: 'The Epic of Gilgamesh',
    author: 'Anonymous (trans. Andrew George)',
    year: -2100,
    emoji: '🗿',
    description:
      'The oldest surviving work of literature, from ancient Mesopotamia. This epic poem explores mortality, friendship, and the search for meaning through the adventures of King Gilgamesh.',
    tag: 'Primary Source',
    difficulty: 'Accessible',
    readTimeHours: 4,
    era: 'ancient',
  },
  {
    id: 'ancient-3',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    year: 2011,
    emoji: '🌍',
    description:
      'A sweeping account of how Homo sapiens came to dominate the planet, from the Cognitive Revolution to the Agricultural Revolution. Harari connects deep prehistory to the structures of modern civilization.',
    tag: 'Popular Science',
    difficulty: 'Accessible',
    readTimeHours: 15,
    era: 'ancient',
  },
  {
    id: 'ancient-4',
    title: 'Guns, Germs, and Steel',
    author: 'Jared Diamond',
    year: 1997,
    emoji: '🌾',
    description:
      'Why did Eurasian civilizations conquer others rather than the reverse? Diamond argues geography and biogeography shaped the fates of human societies far more than racial or cultural factors.',
    tag: 'Popular Science',
    difficulty: 'Accessible',
    readTimeHours: 16,
    era: 'ancient',
  },
  {
    id: 'ancient-5',
    title: 'The Oxford History of Ancient Egypt',
    author: 'Ian Shaw (ed.)',
    year: 2000,
    emoji: '🔺',
    description:
      'A comprehensive survey of Egyptian civilization from prehistory through the Roman period. Each chapter is written by a leading Egyptologist, covering dynasties, religion, art, and daily life.',
    tag: 'Academic',
    difficulty: 'Scholarly',
    readTimeHours: 22,
    era: 'ancient',
  },
  {
    id: 'ancient-6',
    title: 'The Art of War',
    author: 'Sun Tzu',
    year: -500,
    emoji: '⚔️',
    description:
      'The foundational Chinese treatise on military strategy, diplomacy, and statecraft. Its principles on deception, terrain, and leadership have influenced generals and executives for over two millennia.',
    tag: 'Primary Source',
    difficulty: 'Accessible',
    readTimeHours: 3,
    era: 'ancient',
  },
  {
    id: 'ancient-7',
    title: '1177 B.C.: The Year Civilization Collapsed',
    author: 'Eric H. Cline',
    year: 2014,
    emoji: '💥',
    description:
      'Why did every major Bronze Age civilization — Mycenaean, Hittite, Egyptian, Babylonian — collapse almost simultaneously? Cline reconstructs the catastrophic systems failure of the Late Bronze Age.',
    tag: 'Narrative History',
    difficulty: 'Accessible',
    readTimeHours: 8,
    era: 'ancient',
  },

  // ── Classical ──────────────────────────────────────────────────────────────
  {
    id: 'classical-1',
    title: 'The History of the Peloponnesian War',
    author: 'Thucydides',
    year: -400,
    emoji: '⚓',
    description:
      'The definitive account of the war between Athens and Sparta that reshaped the Greek world. Thucydides pioneered evidence-based history with his rigorous approach to sources and causation.',
    tag: 'Primary Source',
    difficulty: 'Scholarly',
    readTimeHours: 20,
    era: 'classical',
    featured: true,
  },
  {
    id: 'classical-2',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    year: 180,
    emoji: '🏛️',
    description:
      'The private philosophical journal of a Roman emperor, written during military campaigns. These Stoic reflections on duty, mortality, and self-discipline remain startlingly relevant today.',
    tag: 'Primary Source',
    difficulty: 'Accessible',
    readTimeHours: 5,
    era: 'classical',
  },
  {
    id: 'classical-3',
    title: 'The Decline and Fall of the Roman Empire',
    author: 'Edward Gibbon',
    year: 1776,
    emoji: '🏚️',
    description:
      'The monumental 18th-century work tracing Rome from the Antonines through the fall of Constantinople. Gibbon\'s prose and skeptical analysis set the standard for modern historical writing.',
    tag: 'Narrative History',
    difficulty: 'Scholarly',
    readTimeHours: 60,
    era: 'classical',
  },
  {
    id: 'classical-4',
    title: 'The Gallic Wars',
    author: 'Julius Caesar',
    year: -50,
    emoji: '🗡️',
    description:
      'Caesar\'s own account of the Roman conquest of Gaul, written as military dispatches. Both a primary source and a masterpiece of Latin prose — and a work of political self-promotion.',
    tag: 'Primary Source',
    difficulty: 'Intermediate',
    readTimeHours: 8,
    era: 'classical',
  },
  {
    id: 'classical-5',
    title: 'SPQR: A History of Ancient Rome',
    author: 'Mary Beard',
    year: 2015,
    emoji: '🦅',
    description:
      'A fresh, provocative history of Rome from its mythical founding to 212 CE. Beard challenges old narratives and brings alive the messy realities of Roman politics, empire, and daily life.',
    tag: 'Narrative History',
    difficulty: 'Accessible',
    readTimeHours: 14,
    era: 'classical',
  },
  {
    id: 'classical-6',
    title: 'The Republic',
    author: 'Plato',
    year: -375,
    emoji: '📜',
    description:
      'Plato\'s foundational dialogue on justice, governance, and the ideal state. Through Socratic questioning, it explores how individuals and societies should organize themselves for the good.',
    tag: 'Primary Source',
    difficulty: 'Intermediate',
    readTimeHours: 12,
    era: 'classical',
  },
  {
    id: 'classical-7',
    title: 'Rubicon: The Last Years of the Roman Republic',
    author: 'Tom Holland',
    year: 2003,
    emoji: '🌊',
    description:
      'The dramatic story of how the Roman Republic tore itself apart, from Sulla and Marius to Caesar and Pompey. Holland writes ancient history with the pace and tension of a thriller.',
    tag: 'Narrative History',
    difficulty: 'Accessible',
    readTimeHours: 12,
    era: 'classical',
  },

  // ── Medieval ───────────────────────────────────────────────────────────────
  {
    id: 'medieval-1',
    title: 'A Distant Mirror: The Calamitous 14th Century',
    author: 'Barbara W. Tuchman',
    year: 1978,
    emoji: '🪞',
    description:
      'Tuchman uses the life of a French nobleman to illuminate the catastrophes of the 14th century — plague, war, schism, and social upheaval. A masterwork of narrative history.',
    tag: 'Narrative History',
    difficulty: 'Intermediate',
    readTimeHours: 20,
    era: 'medieval',
    featured: true,
  },
  {
    id: 'medieval-2',
    title: 'The Civilization of the Middle Ages',
    author: 'Norman F. Cantor',
    year: 1993,
    emoji: '📖',
    description:
      'A comprehensive intellectual and cultural history of the medieval world, from the fall of Rome to the Renaissance. Cantor traces how medieval people understood faith, power, and knowledge.',
    tag: 'Academic',
    difficulty: 'Intermediate',
    readTimeHours: 18,
    era: 'medieval',
  },
  {
    id: 'medieval-3',
    title: 'The Name of the Rose',
    author: 'Umberto Eco',
    year: 1980,
    emoji: '🌹',
    description:
      'A murder mystery set in a 14th-century Italian monastery, rich with medieval theology, philosophy, and semiotics. Eco brings the intellectual world of the Middle Ages vividly to life.',
    tag: 'Narrative History',
    difficulty: 'Intermediate',
    readTimeHours: 16,
    era: 'medieval',
  },
  {
    id: 'medieval-4',
    title: 'The Crusades Through Arab Eyes',
    author: 'Amin Maalouf',
    year: 1984,
    emoji: '🌙',
    description:
      'The Crusades retold from the perspective of Arab historians and chroniclers. Maalouf draws on primary Arabic sources to show how the invasions looked from the other side.',
    tag: 'Narrative History',
    difficulty: 'Accessible',
    readTimeHours: 10,
    era: 'medieval',
  },
  {
    id: 'medieval-5',
    title: 'The Plantagenets',
    author: 'Dan Jones',
    year: 2012,
    emoji: '👑',
    description:
      'The epic story of the dynasty that ruled England for over 300 years, from Henry II to Richard III. Jones captures the ambition, violence, and drama of medieval kingship.',
    tag: 'Narrative History',
    difficulty: 'Accessible',
    readTimeHours: 14,
    era: 'medieval',
  },
  {
    id: 'medieval-6',
    title: 'The Muqaddimah',
    author: 'Ibn Khaldun',
    year: 1377,
    emoji: '🕌',
    description:
      'A pioneering work of historiography, sociology, and economics by a 14th-century North African scholar. Ibn Khaldun developed a cyclical theory of civilizations that anticipated modern social science.',
    tag: 'Primary Source',
    difficulty: 'Scholarly',
    readTimeHours: 30,
    era: 'medieval',
  },
  {
    id: 'medieval-7',
    title: 'The Time Traveler\'s Guide to Medieval England',
    author: 'Ian Mortimer',
    year: 2008,
    emoji: '🏰',
    description:
      'What was it actually like to live in 14th-century England? Mortimer reconstructs the sights, smells, food, and dangers of medieval daily life in this immersive social history.',
    tag: 'Popular Science',
    difficulty: 'Accessible',
    readTimeHours: 10,
    era: 'medieval',
  },

  // ── Early Modern ───────────────────────────────────────────────────────────
  {
    id: 'early-modern-1',
    title: 'Citizens: A Chronicle of the French Revolution',
    author: 'Simon Schama',
    year: 1989,
    emoji: '🇫🇷',
    description:
      'Schama\'s vivid, literary retelling of the French Revolution, focusing on the human stories behind the Terror. He argues that violence was embedded in the Revolution from its very beginning.',
    tag: 'Narrative History',
    difficulty: 'Intermediate',
    readTimeHours: 24,
    era: 'early-modern',
    featured: true,
  },
  {
    id: 'early-modern-2',
    title: 'The Prince',
    author: 'Niccolò Machiavelli',
    year: 1532,
    emoji: '🎭',
    description:
      'The infamous treatise on political power that shocked Renaissance Europe. Machiavelli\'s clear-eyed analysis of statecraft, deception, and pragmatism remains essential political philosophy.',
    tag: 'Primary Source',
    difficulty: 'Accessible',
    readTimeHours: 4,
    era: 'early-modern',
  },
  {
    id: 'early-modern-3',
    title: 'The Diary of Samuel Pepys',
    author: 'Samuel Pepys',
    year: 1669,
    emoji: '✒️',
    description:
      'An extraordinary firsthand account of Restoration London, the Great Plague, and the Great Fire. Pepys recorded everything — from affairs of state to his own romantic entanglements.',
    tag: 'Primary Source',
    difficulty: 'Intermediate',
    readTimeHours: 40,
    era: 'early-modern',
  },
  {
    id: 'early-modern-4',
    title: 'The Swerve: How the World Became Modern',
    author: 'Stephen Greenblatt',
    year: 2011,
    emoji: '📕',
    description:
      'How the rediscovery of Lucretius\'s ancient poem "On the Nature of Things" helped spark the Renaissance and modern thought. A story about the power of ideas to change the world.',
    tag: 'Narrative History',
    difficulty: 'Accessible',
    readTimeHours: 10,
    era: 'early-modern',
  },
  {
    id: 'early-modern-5',
    title: 'The Wealth of Nations',
    author: 'Adam Smith',
    year: 1776,
    emoji: '💰',
    description:
      'The foundational text of modern economics, arguing for free markets, division of labor, and limited government. Smith\'s ideas shaped the economic systems that would transform the modern world.',
    tag: 'Primary Source',
    difficulty: 'Scholarly',
    readTimeHours: 36,
    era: 'early-modern',
  },
  {
    id: 'early-modern-6',
    title: 'London: The Biography',
    author: 'Peter Ackroyd',
    year: 2000,
    emoji: '🌁',
    description:
      'Ackroyd\'s idiosyncratic, sprawling biography of London itself, tracing the city from Roman times through the modern era. A kaleidoscopic portrait of one of history\'s great cities.',
    tag: 'Narrative History',
    difficulty: 'Intermediate',
    readTimeHours: 22,
    era: 'early-modern',
  },
  {
    id: 'early-modern-7',
    title: 'The Embarrassment of Riches',
    author: 'Simon Schama',
    year: 1987,
    emoji: '🎨',
    description:
      'An interpretation of Dutch Golden Age culture through its art, wealth, and anxieties. Schama shows how the Dutch Republic grappled with the moral implications of its commercial success.',
    tag: 'Academic',
    difficulty: 'Scholarly',
    readTimeHours: 20,
    era: 'early-modern',
  },

  // ── Modern ─────────────────────────────────────────────────────────────────
  {
    id: 'modern-1',
    title: 'The Guns of August',
    author: 'Barbara W. Tuchman',
    year: 1962,
    emoji: '💣',
    description:
      'The classic account of the first month of World War I, showing how miscalculation, pride, and inflexibility plunged Europe into catastrophe. Won the Pulitzer Prize for its gripping narrative.',
    tag: 'Narrative History',
    difficulty: 'Accessible',
    readTimeHours: 14,
    era: 'modern',
    featured: true,
  },
  {
    id: 'modern-2',
    title: 'The Second World War',
    author: 'Winston Churchill',
    year: 1953,
    emoji: '🎖️',
    description:
      'Churchill\'s six-volume memoir of the war he helped win, combining personal narrative with grand strategy. A unique blend of primary source and literary history from a Nobel laureate.',
    tag: 'Biography',
    difficulty: 'Intermediate',
    readTimeHours: 80,
    era: 'modern',
  },
  {
    id: 'modern-3',
    title: 'The Power Broker: Robert Moses and the Fall of New York',
    author: 'Robert A. Caro',
    year: 1974,
    emoji: '🏗️',
    description:
      'The Pulitzer-winning biography of Robert Moses, the unelected official who reshaped New York City. Caro\'s masterpiece is a study of how political power is accumulated and wielded.',
    tag: 'Biography',
    difficulty: 'Intermediate',
    readTimeHours: 50,
    era: 'modern',
  },
  {
    id: 'modern-4',
    title: 'A People\'s History of the United States',
    author: 'Howard Zinn',
    year: 1980,
    emoji: '✊',
    description:
      'American history told from the perspective of workers, women, minorities, and the dispossessed. Zinn challenged the traditional narrative and sparked a movement for history from below.',
    tag: 'Narrative History',
    difficulty: 'Accessible',
    readTimeHours: 20,
    era: 'modern',
  },
  {
    id: 'modern-5',
    title: 'The Origins of Totalitarianism',
    author: 'Hannah Arendt',
    year: 1951,
    emoji: '⚖️',
    description:
      'Arendt traces the roots of Nazism and Stalinism through antisemitism, imperialism, and the destruction of political community. A dense but essential work of political philosophy.',
    tag: 'Academic',
    difficulty: 'Scholarly',
    readTimeHours: 24,
    era: 'modern',
  },
  {
    id: 'modern-6',
    title: 'King Leopold\'s Ghost',
    author: 'Adam Hochschild',
    year: 1998,
    emoji: '🌿',
    description:
      'The horrifying story of Belgium\'s exploitation of the Congo Free State and the activists who exposed it. A gripping account of colonialism at its most brutal and the first human rights campaign.',
    tag: 'Narrative History',
    difficulty: 'Accessible',
    readTimeHours: 12,
    era: 'modern',
  },
  {
    id: 'modern-7',
    title: 'The Autobiography of Malcolm X',
    author: 'Malcolm X with Alex Haley',
    year: 1965,
    emoji: '🔥',
    description:
      'Malcolm X\'s own account of his transformation from street hustler to Nation of Islam minister to global human rights advocate. One of the most influential autobiographies of the 20th century.',
    tag: 'Biography',
    difficulty: 'Accessible',
    readTimeHours: 14,
    era: 'modern',
  },

  // ── Contemporary ───────────────────────────────────────────────────────────
  {
    id: 'contemporary-1',
    title: 'On Tyranny: Twenty Lessons from the Twentieth Century',
    author: 'Timothy Snyder',
    year: 2017,
    emoji: '🚨',
    description:
      'A concise, urgent guide to defending democracy, drawing on the history of European fascism and communism. Snyder distills decades of scholarship into twenty actionable lessons.',
    tag: 'Popular Science',
    difficulty: 'Accessible',
    readTimeHours: 3,
    era: 'contemporary',
    featured: true,
  },
  {
    id: 'contemporary-2',
    title: 'Bloodlands: Europe Between Hitler and Stalin',
    author: 'Timothy Snyder',
    year: 2010,
    emoji: '🖤',
    description:
      'The harrowing history of the lands where Nazi and Soviet regimes killed 14 million civilians. Snyder synthesizes Eastern European history into a devastating portrait of state-driven mass murder.',
    tag: 'Academic',
    difficulty: 'Intermediate',
    readTimeHours: 16,
    era: 'contemporary',
  },
  {
    id: 'contemporary-3',
    title: '21 Lessons for the 21st Century',
    author: 'Yuval Noah Harari',
    year: 2018,
    emoji: '🧠',
    description:
      'Harari tackles the most urgent questions of our present: AI, fake news, terrorism, and the future of liberal democracy. A companion to Sapiens that turns the lens on today.',
    tag: 'Popular Science',
    difficulty: 'Accessible',
    readTimeHours: 11,
    era: 'contemporary',
  },
  {
    id: 'contemporary-4',
    title: 'The Cold War: A New History',
    author: 'John Lewis Gaddis',
    year: 2005,
    emoji: '❄️',
    description:
      'The definitive single-volume history of the Cold War, from its origins to the fall of the Soviet Union. Gaddis draws on newly available archives to reinterpret the 20th century\'s great standoff.',
    tag: 'Narrative History',
    difficulty: 'Intermediate',
    readTimeHours: 12,
    era: 'contemporary',
  },
  {
    id: 'contemporary-5',
    title: 'Postwar: A History of Europe Since 1945',
    author: 'Tony Judt',
    year: 2005,
    emoji: '🇪🇺',
    description:
      'A magisterial history of Europe from the ruins of WWII to the 21st century. Judt weaves together politics, culture, and economics across East and West in this definitive account.',
    tag: 'Academic',
    difficulty: 'Scholarly',
    readTimeHours: 30,
    era: 'contemporary',
  },
  {
    id: 'contemporary-6',
    title: 'The Looming Tower: Al-Qaeda and the Road to 9/11',
    author: 'Lawrence Wright',
    year: 2006,
    emoji: '🏢',
    description:
      'The Pulitzer-winning account of how al-Qaeda formed and how American intelligence failed to stop 9/11. Wright traces the intertwining stories of jihadists, FBI agents, and CIA officers.',
    tag: 'Narrative History',
    difficulty: 'Accessible',
    readTimeHours: 14,
    era: 'contemporary',
  },
  {
    id: 'contemporary-7',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    year: 2011,
    emoji: '🧪',
    description:
      'Nobel laureate Kahneman reveals the two systems that drive how we think — fast intuition and slow deliberation. Essential for understanding how humans make decisions and why we so often get them wrong.',
    tag: 'Popular Science',
    difficulty: 'Intermediate',
    readTimeHours: 16,
    era: 'contemporary',
  },
];

export const ERAS: Era[] = ['ancient', 'classical', 'medieval', 'early-modern', 'modern', 'contemporary'];
