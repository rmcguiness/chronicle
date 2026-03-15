/**
 * LeadersPage — "The World's Most Influential Leaders"
 *
 * Route: /leaders
 *
 * Features:
 *  - 25 curated leader cards with rich detail
 *  - Filter by era / region / legacy type
 *  - Sort by chronological, influence score, region, legacy type
 *  - "Most Influential" top-5 ranked list with justification
 *  - Timeline bar with lifespan bars for all 25 leaders
 *  - "Surprising Inclusion" sidebar
 *  - "Find their events →" search links
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ────────────────────────────────────────────────────────────────────

interface Leader {
  slug: string;
  name: string;
  birthYear: number;
  deathYear: number;
  datesDisplay: string;
  title: string;
  civilization: string;
  region: string;
  era: string;
  knownFor: [string, string, string];
  legacyType: LegacyType;
  signatureAchievement: string;
  influenceScore: number;
  influenceJustification: string;
  quote: string;
  chronicleQuery: string;
}

type LegacyType = 'Empire-Builder' | 'Reformer' | 'Liberator' | 'Conqueror' | 'Patron';

type SortMode = 'chronological' | 'influence' | 'region' | 'legacy';

// ── Color maps ───────────────────────────────────────────────────────────────

const ERA_COLORS: Record<string, string> = {
  Ancient: '#8b5cf6',
  Classical: '#a855f7',
  'Late Antiquity': '#c084fc',
  Medieval: '#f59e0b',
  'Early Modern': '#f97316',
  Modern: '#3b82f6',
  Contemporary: '#22c55e',
};

const REGION_COLORS: Record<string, string> = {
  'Middle East': '#f59e0b',
  'Mediterranean': '#a855f7',
  'South Asia': '#ec4899',
  Europe: '#3b82f6',
  'Central Asia': '#f97316',
  'West Africa': '#22c55e',
  'East Asia': '#ef4444',
  'North America': '#06b6d4',
  'Southern Africa': '#10b981',
};

const LEGACY_COLORS: Record<LegacyType, string> = {
  'Empire-Builder': '#ef4444',
  Reformer: '#3b82f6',
  Liberator: '#22c55e',
  Conqueror: '#f59e0b',
  Patron: '#a855f7',
};

// ── Static data ──────────────────────────────────────────────────────────────

const LEADERS: Leader[] = [
  {
    slug: 'cyrus-the-great',
    name: 'Cyrus the Great',
    birthYear: -600,
    deathYear: -530,
    datesDisplay: '600–530 BCE',
    title: 'King of Kings, Founder of Achaemenid Empire',
    civilization: 'Persian Empire',
    region: 'Middle East',
    era: 'Ancient',
    knownFor: [
      'Founded the largest empire the world had yet seen',
      'Issued the Cyrus Cylinder — often called the first human rights charter',
      'Freed the Jews from Babylonian captivity',
    ],
    legacyType: 'Liberator',
    signatureAchievement: 'Created the model of tolerant, multi-ethnic empire governance',
    influenceScore: 9,
    influenceJustification: 'Invented the concept of governing diverse peoples through tolerance rather than suppression — a model copied for millennia.',
    quote: 'I am Cyrus, king of the world, great king, mighty king.',
    chronicleQuery: 'Cyrus the Great',
  },
  {
    slug: 'alexander-the-great',
    name: 'Alexander the Great',
    birthYear: -356,
    deathYear: -323,
    datesDisplay: '356–323 BCE',
    title: 'King of Macedon, Pharaoh of Egypt',
    civilization: 'Macedon / Hellenistic World',
    region: 'Mediterranean',
    era: 'Ancient',
    knownFor: [
      'Conquered from Greece to India in just 13 years',
      'Spread Greek culture across three continents (Hellenization)',
      'Never lost a single battle in his military career',
    ],
    legacyType: 'Conqueror',
    signatureAchievement: 'Created the Hellenistic world that fused Greek, Persian, Egyptian, and Indian cultures',
    influenceScore: 10,
    influenceJustification: 'Reshaped the entire ancient world in 13 years — the Hellenistic civilization he spawned influenced Rome, Christianity, Islam, and the Renaissance.',
    quote: 'There is nothing impossible to him who will try.',
    chronicleQuery: 'Alexander the Great',
  },
  {
    slug: 'ashoka',
    name: 'Ashoka',
    birthYear: -304,
    deathYear: -232,
    datesDisplay: '304–232 BCE',
    title: 'Emperor of the Maurya Dynasty',
    civilization: 'Maurya Empire, India',
    region: 'South Asia',
    era: 'Ancient',
    knownFor: [
      'Unified nearly all of the Indian subcontinent',
      'Converted to Buddhism after the bloody Kalinga War and renounced violence',
      'Spread Buddhist teachings and built thousands of stupas across Asia',
    ],
    legacyType: 'Reformer',
    signatureAchievement: 'Transformed from conqueror to pacifist ruler, spreading Buddhism across Asia',
    influenceScore: 8,
    influenceJustification: 'His conversion and missionary work made Buddhism a world religion — his edicts on governance by dharma influenced political philosophy for centuries.',
    quote: 'All men are my children. What I desire for my own children — I desire for all men.',
    chronicleQuery: 'Ashoka emperor',
  },
  {
    slug: 'julius-caesar',
    name: 'Julius Caesar',
    birthYear: -100,
    deathYear: -44,
    datesDisplay: '100–44 BCE',
    title: 'Dictator Perpetuo of the Roman Republic',
    civilization: 'Roman Republic',
    region: 'Mediterranean',
    era: 'Classical',
    knownFor: [
      'Conquered Gaul and extended Roman power to the Atlantic',
      'Crossed the Rubicon and ended the Roman Republic',
      'Reformed the calendar (Julian calendar used for 1,600 years)',
    ],
    legacyType: 'Conqueror',
    signatureAchievement: 'Transformed Rome from republic to dictatorship, paving the way for the Empire',
    influenceScore: 9,
    influenceJustification: 'His assassination and legacy directly created the Roman Empire — his name became synonymous with ruler (Kaiser, Tsar).',
    quote: 'Veni, vidi, vici — I came, I saw, I conquered.',
    chronicleQuery: 'Julius Caesar',
  },
  {
    slug: 'augustus-caesar',
    name: 'Augustus Caesar',
    birthYear: -63,
    deathYear: 14,
    datesDisplay: '63 BCE – 14 CE',
    title: 'First Roman Emperor',
    civilization: 'Roman Empire',
    region: 'Mediterranean',
    era: 'Classical',
    knownFor: [
      'Became first Roman Emperor and founded the Principate',
      'Initiated the Pax Romana — 200 years of relative peace',
      'Transformed Rome from a city of brick to a city of marble',
    ],
    legacyType: 'Empire-Builder',
    signatureAchievement: 'Created the Roman Empire and the Pax Romana that shaped Western civilization',
    influenceScore: 10,
    influenceJustification: 'Built the most influential empire in Western history — Roman law, language, infrastructure, and culture still underpin the modern world.',
    quote: 'I found Rome a city of bricks and left it a city of marble.',
    chronicleQuery: 'Augustus Caesar',
  },
  {
    slug: 'attila-the-hun',
    name: 'Attila the Hun',
    birthYear: 406,
    deathYear: 453,
    datesDisplay: '406–453 CE',
    title: 'Ruler of the Hunnic Empire',
    civilization: 'Hunnic Empire',
    region: 'Central Asia',
    era: 'Late Antiquity',
    knownFor: [
      'United the Hunnic tribes into a terrifying military force',
      'Invaded both the Eastern and Western Roman Empires',
      'Known as the "Scourge of God" — reshaped European demographics',
    ],
    legacyType: 'Conqueror',
    signatureAchievement: 'Accelerated the fall of the Western Roman Empire and the Great Migration of peoples',
    influenceScore: 7,
    influenceJustification: 'His invasions triggered massive population movements that reshaped Europe, contributing to the fall of Rome and the birth of medieval kingdoms.',
    quote: 'There, where I have passed, the grass will never grow again.',
    chronicleQuery: 'Attila the Hun',
  },
  {
    slug: 'justinian-i',
    name: 'Justinian I',
    birthYear: 482,
    deathYear: 565,
    datesDisplay: '482–565 CE',
    title: 'Byzantine Emperor',
    civilization: 'Byzantine Empire',
    region: 'Mediterranean',
    era: 'Late Antiquity',
    knownFor: [
      'Codified Roman law into the Corpus Juris Civilis (Justinian Code)',
      'Reconquered much of the former Western Roman Empire',
      'Built the Hagia Sophia — one of history\'s greatest architectural achievements',
    ],
    legacyType: 'Empire-Builder',
    signatureAchievement: 'Created the Justinian Code — the foundation of civil law used by most of the modern world',
    influenceScore: 8,
    influenceJustification: 'His legal code became the basis for civil law in continental Europe, Latin America, and beyond — more people live under Justinian\'s legal legacy than any other system.',
    quote: 'Justice is the constant and perpetual wish to render to every one his due.',
    chronicleQuery: 'Justinian emperor',
  },
  {
    slug: 'charlemagne',
    name: 'Charlemagne',
    birthYear: 742,
    deathYear: 814,
    datesDisplay: '742–814 CE',
    title: 'King of the Franks, Holy Roman Emperor',
    civilization: 'Frankish Empire / Holy Roman Empire',
    region: 'Europe',
    era: 'Medieval',
    knownFor: [
      'United most of Western Europe for the first time since Rome',
      'Crowned first Holy Roman Emperor by Pope Leo III in 800 CE',
      'Sparked the Carolingian Renaissance — revived learning and literacy',
    ],
    legacyType: 'Empire-Builder',
    signatureAchievement: 'Father of Europe — created the political and cultural foundation for Western European civilization',
    influenceScore: 9,
    influenceJustification: 'Unified Western Europe and fused Christianity with governance — his empire\'s divisions became France, Germany, and Italy.',
    quote: 'To have another language is to possess a second soul.',
    chronicleQuery: 'Charlemagne',
  },
  {
    slug: 'genghis-khan',
    name: 'Genghis Khan',
    birthYear: 1162,
    deathYear: 1227,
    datesDisplay: '1162–1227 CE',
    title: 'Great Khan of the Mongol Empire',
    civilization: 'Mongol Empire',
    region: 'Central Asia',
    era: 'Medieval',
    knownFor: [
      'Built the largest contiguous land empire in history',
      'Connected East and West via the Silk Road under Pax Mongolica',
      'Introduced meritocracy, religious tolerance, and a unified legal code (Yasa)',
    ],
    legacyType: 'Conqueror',
    signatureAchievement: 'Created the largest land empire in history, connecting civilizations from Korea to Hungary',
    influenceScore: 10,
    influenceJustification: 'Reshaped the entire Eurasian landmass — killed ~40 million people but also created unprecedented trade, cultural exchange, and genetic legacy.',
    quote: 'I am the punishment of God. If you had not committed great sins, God would not have sent a punishment like me upon you.',
    chronicleQuery: 'Genghis Khan',
  },
  {
    slug: 'kublai-khan',
    name: 'Kublai Khan',
    birthYear: 1215,
    deathYear: 1294,
    datesDisplay: '1215–1294 CE',
    title: 'Emperor of the Yuan Dynasty, Great Khan',
    civilization: 'Yuan Dynasty / Mongol Empire',
    region: 'East Asia',
    era: 'Medieval',
    knownFor: [
      'Founded the Yuan Dynasty and united all of China under Mongol rule',
      'Hosted Marco Polo, whose accounts opened European eyes to the East',
      'Expanded trade networks and attempted invasions of Japan and Southeast Asia',
    ],
    legacyType: 'Empire-Builder',
    signatureAchievement: 'Bridged Mongol conquest with Chinese civilization, creating the Yuan Dynasty',
    influenceScore: 7,
    influenceJustification: 'United China and Mongolia while facilitating the greatest East-West cultural exchange before the Age of Exploration.',
    quote: 'The greatest pleasure is to vanquish your enemies and chase them before you.',
    chronicleQuery: 'Kublai Khan',
  },
  {
    slug: 'mansa-musa',
    name: 'Mansa Musa',
    birthYear: 1280,
    deathYear: 1337,
    datesDisplay: '1280–1337 CE',
    title: 'Mansa (Emperor) of the Mali Empire',
    civilization: 'Mali Empire',
    region: 'West Africa',
    era: 'Medieval',
    knownFor: [
      'Richest person in recorded history — wealth so vast it is incalculable',
      'His hajj to Mecca crashed gold prices across North Africa and the Middle East',
      'Built Timbuktu into a world center of learning with the Sankore Madrasah',
    ],
    legacyType: 'Patron',
    signatureAchievement: 'Made Mali the intellectual and economic center of the medieval world',
    influenceScore: 8,
    influenceJustification: 'Put sub-Saharan Africa on the world map — his hajj demonstrated African wealth and sophistication to the entire Islamic world and Europe.',
    quote: 'I come from a land of gold.',
    chronicleQuery: 'Mansa Musa',
  },
  {
    slug: 'timur-tamerlane',
    name: 'Timur (Tamerlane)',
    birthYear: 1336,
    deathYear: 1405,
    datesDisplay: '1336–1405 CE',
    title: 'Founder of the Timurid Empire',
    civilization: 'Timurid Empire',
    region: 'Central Asia',
    era: 'Medieval',
    knownFor: [
      'Conquered from Delhi to Damascus to Moscow — killed ~17 million people',
      'Patron of arts and architecture during the Timurid Renaissance',
      'Ancestor of the Mughal dynasty through Babur',
    ],
    legacyType: 'Conqueror',
    signatureAchievement: 'Combined devastating conquest with extraordinary cultural patronage',
    influenceScore: 7,
    influenceJustification: 'His destruction reshaped Central Asia, while his cultural patronage seeded the Timurid Renaissance and the Mughal Empire.',
    quote: 'As there is but one God in heaven, there ought to be but one ruler on the earth.',
    chronicleQuery: 'Timur Tamerlane',
  },
  {
    slug: 'suleiman-the-magnificent',
    name: 'Suleiman the Magnificent',
    birthYear: 1494,
    deathYear: 1566,
    datesDisplay: '1494–1566 CE',
    title: 'Sultan of the Ottoman Empire',
    civilization: 'Ottoman Empire',
    region: 'Middle East',
    era: 'Early Modern',
    knownFor: [
      'Presided over the Ottoman golden age — largest territorial extent',
      'Reformed the legal system (known as "The Lawgiver" in the Islamic world)',
      'Patron of arts, architecture — Süleymaniye Mosque among the finest ever built',
    ],
    legacyType: 'Empire-Builder',
    signatureAchievement: 'Made the Ottoman Empire the most powerful state on Earth during his 46-year reign',
    influenceScore: 8,
    influenceJustification: 'His legal reforms and military expansion shaped the Middle East, North Africa, and Southeastern Europe for 400 years.',
    quote: 'The people think of wealth and power as the greatest fate, but in this world a spell of health is the best state.',
    chronicleQuery: 'Suleiman Ottoman',
  },
  {
    slug: 'akbar-the-great',
    name: 'Akbar the Great',
    birthYear: 1542,
    deathYear: 1605,
    datesDisplay: '1542–1605 CE',
    title: 'Mughal Emperor',
    civilization: 'Mughal Empire',
    region: 'South Asia',
    era: 'Early Modern',
    knownFor: [
      'Expanded the Mughal Empire to cover most of the Indian subcontinent',
      'Pioneered religious tolerance with the Din-i Ilahi syncretic faith',
      'Created a brilliant multicultural court that fused Hindu, Muslim, and Persian cultures',
    ],
    legacyType: 'Reformer',
    signatureAchievement: 'Proved that a vast, multi-religious empire could thrive on tolerance rather than coercion',
    influenceScore: 8,
    influenceJustification: 'His model of pluralistic governance presaged modern multiculturalism and remains central to India\'s identity debate today.',
    quote: 'No one should be interfered with on account of religion, and anyone is to be allowed to go over to a religion that pleases him.',
    chronicleQuery: 'Akbar Mughal',
  },
  {
    slug: 'elizabeth-i',
    name: 'Elizabeth I',
    birthYear: 1533,
    deathYear: 1603,
    datesDisplay: '1533–1603 CE',
    title: 'Queen of England and Ireland',
    civilization: 'England',
    region: 'Europe',
    era: 'Early Modern',
    knownFor: [
      'Defeated the Spanish Armada and established English naval supremacy',
      'Presided over the Elizabethan era — Shakespeare, Marlowe, Spenser',
      'Navigated religious conflict with the Elizabethan Religious Settlement',
    ],
    legacyType: 'Reformer',
    signatureAchievement: 'Transformed England from a second-rate island into a global power and cultural giant',
    influenceScore: 8,
    influenceJustification: 'Under her reign England became the seedbed of the English-speaking world — colonialism, the English language, and parliamentary democracy all accelerated.',
    quote: 'I know I have the body of a weak and feeble woman, but I have the heart and stomach of a king.',
    chronicleQuery: 'Elizabeth I',
  },
  {
    slug: 'peter-the-great',
    name: 'Peter the Great',
    birthYear: 1672,
    deathYear: 1725,
    datesDisplay: '1672–1725 CE',
    title: 'Tsar / Emperor of Russia',
    civilization: 'Russian Empire',
    region: 'Europe',
    era: 'Early Modern',
    knownFor: [
      'Modernized Russia through sweeping Western-style reforms',
      'Founded St. Petersburg as Russia\'s "window to the West"',
      'Built the Russian Navy from nothing and defeated Sweden in the Great Northern War',
    ],
    legacyType: 'Reformer',
    signatureAchievement: 'Dragged Russia from medieval isolation into the European great-power system',
    influenceScore: 8,
    influenceJustification: 'Without Peter, Russia might have remained a backwater — he created the great power that would shape European and world politics for 300 years.',
    quote: 'I have conquered an empire but I have not been able to conquer myself.',
    chronicleQuery: 'Peter the Great',
  },
  {
    slug: 'frederick-the-great',
    name: 'Frederick the Great',
    birthYear: 1712,
    deathYear: 1786,
    datesDisplay: '1712–1786 CE',
    title: 'King of Prussia',
    civilization: 'Kingdom of Prussia',
    region: 'Europe',
    era: 'Early Modern',
    knownFor: [
      'Transformed Prussia into a major European power through military genius',
      'Champion of Enlightened absolutism — religious tolerance, legal reform',
      'Patron of arts and philosophy — corresponded with Voltaire',
    ],
    legacyType: 'Reformer',
    signatureAchievement: 'Built the Prussian military state that would eventually unify Germany',
    influenceScore: 7,
    influenceJustification: 'Created the Prussian tradition of military excellence and efficient governance that Bismarck later used to forge Germany.',
    quote: 'A crown is merely a hat that lets the rain in.',
    chronicleQuery: 'Frederick the Great Prussia',
  },
  {
    slug: 'napoleon-bonaparte',
    name: 'Napoleon Bonaparte',
    birthYear: 1769,
    deathYear: 1821,
    datesDisplay: '1769–1821 CE',
    title: 'Emperor of the French',
    civilization: 'French Empire',
    region: 'Europe',
    era: 'Modern',
    knownFor: [
      'Conquered most of continental Europe in a decade of brilliant campaigns',
      'Created the Napoleonic Code — basis of civil law in 70+ countries today',
      'Spread revolutionary ideals of meritocracy and legal equality across Europe',
    ],
    legacyType: 'Conqueror',
    signatureAchievement: 'The Napoleonic Code — the most influential legal document since Roman law',
    influenceScore: 10,
    influenceJustification: 'Reshaped the map of Europe, destroyed the old feudal order, and exported revolutionary ideals — the modern world is largely a reaction to Napoleon.',
    quote: 'Impossible is a word to be found only in the dictionary of fools.',
    chronicleQuery: 'Napoleon Bonaparte',
  },
  {
    slug: 'abraham-lincoln',
    name: 'Abraham Lincoln',
    birthYear: 1809,
    deathYear: 1865,
    datesDisplay: '1809–1865 CE',
    title: '16th President of the United States',
    civilization: 'United States',
    region: 'North America',
    era: 'Modern',
    knownFor: [
      'Preserved the Union during the American Civil War',
      'Issued the Emancipation Proclamation, ending slavery',
      'Delivered the Gettysburg Address — redefining democracy and equality',
    ],
    legacyType: 'Liberator',
    signatureAchievement: 'Ended slavery and preserved the United States as a single nation',
    influenceScore: 9,
    influenceJustification: 'Had the Union dissolved, the 20th century would have unfolded entirely differently — no unified American superpower to fight two World Wars.',
    quote: 'Government of the people, by the people, for the people, shall not perish from the earth.',
    chronicleQuery: 'Abraham Lincoln',
  },
  {
    slug: 'otto-von-bismarck',
    name: 'Otto von Bismarck',
    birthYear: 1815,
    deathYear: 1898,
    datesDisplay: '1815–1898 CE',
    title: 'Chancellor of the German Empire',
    civilization: 'German Empire',
    region: 'Europe',
    era: 'Modern',
    knownFor: [
      'Unified Germany through three wars and masterful diplomacy ("blood and iron")',
      'Created the modern welfare state — health insurance, pensions, accident insurance',
      'Maintained European peace through the complex alliance system',
    ],
    legacyType: 'Empire-Builder',
    signatureAchievement: 'Unified Germany and invented the modern welfare state',
    influenceScore: 9,
    influenceJustification: 'Created the German nation-state whose power, ambitions, and insecurities shaped both World Wars and the entire 20th century.',
    quote: 'Politics is the art of the possible, the attainable — the art of the next best.',
    chronicleQuery: 'Otto von Bismarck',
  },
  {
    slug: 'vladimir-lenin',
    name: 'Vladimir Lenin',
    birthYear: 1870,
    deathYear: 1924,
    datesDisplay: '1870–1924 CE',
    title: 'Chairman of the Council of People\'s Commissars',
    civilization: 'Soviet Union',
    region: 'Europe',
    era: 'Modern',
    knownFor: [
      'Led the Bolshevik Revolution of 1917 — overthrew the Russian Empire',
      'Founded the world\'s first communist state',
      'Developed Marxism-Leninism as a governing ideology for the 20th century',
    ],
    legacyType: 'Reformer',
    signatureAchievement: 'Created the first communist state, sparking a global ideological struggle lasting 70 years',
    influenceScore: 9,
    influenceJustification: 'The Soviet experiment he launched divided the entire world into two ideological camps and shaped every major conflict of the 20th century.',
    quote: 'There are decades where nothing happens; and there are weeks where decades happen.',
    chronicleQuery: 'Vladimir Lenin',
  },
  {
    slug: 'franklin-d-roosevelt',
    name: 'Franklin D. Roosevelt',
    birthYear: 1882,
    deathYear: 1945,
    datesDisplay: '1882–1945 CE',
    title: '32nd President of the United States',
    civilization: 'United States',
    region: 'North America',
    era: 'Contemporary',
    knownFor: [
      'Led the United States through the Great Depression with the New Deal',
      'Guided America through World War II as Commander-in-Chief',
      'Served an unprecedented four terms — longest-serving US president',
    ],
    legacyType: 'Reformer',
    signatureAchievement: 'Saved American democracy during the Depression and led the Allied victory in WWII',
    influenceScore: 9,
    influenceJustification: 'The New Deal redefined the role of government in American life, and his WWII leadership established the US-led world order that persists today.',
    quote: 'The only thing we have to fear is fear itself.',
    chronicleQuery: 'Franklin Roosevelt',
  },
  {
    slug: 'winston-churchill',
    name: 'Winston Churchill',
    birthYear: 1874,
    deathYear: 1965,
    datesDisplay: '1874–1965 CE',
    title: 'Prime Minister of the United Kingdom',
    civilization: 'United Kingdom',
    region: 'Europe',
    era: 'Contemporary',
    knownFor: [
      'Rallied Britain to resist Nazi Germany when all seemed lost in 1940',
      'Forged the Allied coalition with FDR and Stalin',
      'Nobel Prize-winning author and orator — defined the English language in crisis',
    ],
    legacyType: 'Liberator',
    signatureAchievement: 'Held the line against fascism when Britain stood alone — saving democracy',
    influenceScore: 9,
    influenceJustification: 'Had Churchill accepted peace terms in 1940, Hitler would have consolidated Europe — his refusal to surrender may be the most consequential decision of the 20th century.',
    quote: 'We shall fight on the beaches, we shall fight on the landing grounds, we shall never surrender.',
    chronicleQuery: 'Winston Churchill',
  },
  {
    slug: 'mao-zedong',
    name: 'Mao Zedong',
    birthYear: 1893,
    deathYear: 1976,
    datesDisplay: '1893–1976 CE',
    title: 'Chairman of the Communist Party of China',
    civilization: 'People\'s Republic of China',
    region: 'East Asia',
    era: 'Contemporary',
    knownFor: [
      'Founded the People\'s Republic of China in 1949',
      'Launched the Great Leap Forward and Cultural Revolution — transforming and devastating China',
      'Made China a nuclear power and reshaped its society from feudalism to communism',
    ],
    legacyType: 'Empire-Builder',
    signatureAchievement: 'Unified and transformed China into the foundation of today\'s superpower',
    influenceScore: 9,
    influenceJustification: 'For better or worse, modern China — home to 1.4 billion people and the world\'s second superpower — is built on the state Mao created.',
    quote: 'Political power grows out of the barrel of a gun.',
    chronicleQuery: 'Mao Zedong',
  },
  {
    slug: 'nelson-mandela',
    name: 'Nelson Mandela',
    birthYear: 1918,
    deathYear: 2013,
    datesDisplay: '1918–2013 CE',
    title: 'President of South Africa',
    civilization: 'South Africa',
    region: 'Southern Africa',
    era: 'Contemporary',
    knownFor: [
      'Spent 27 years in prison for fighting apartheid',
      'Negotiated a peaceful transition to democracy — avoided civil war',
      'Became a global symbol of reconciliation and moral leadership',
    ],
    legacyType: 'Liberator',
    signatureAchievement: 'Ended apartheid through reconciliation rather than revenge',
    influenceScore: 8,
    influenceJustification: 'Proved that even the most entrenched injustice could be dismantled peacefully — his moral authority inspired movements worldwide.',
    quote: 'It always seems impossible until it\'s done.',
    chronicleQuery: 'Nelson Mandela',
  },
];

// ── Derived constants ────────────────────────────────────────────────────────

const ALL_ERAS = ['All', ...Array.from(new Set(LEADERS.map((l) => l.era)))];
const ALL_REGIONS = ['All', ...Array.from(new Set(LEADERS.map((l) => l.region))).sort()];
const ALL_LEGACIES: (string)[] = ['All', ...Array.from(new Set(LEADERS.map((l) => l.legacyType))).sort()];

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'chronological', label: 'Chronological' },
  { value: 'influence', label: 'Influence Score' },
  { value: 'region', label: 'Region' },
  { value: 'legacy', label: 'Legacy Type' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getLeaderOfTheDay(): Leader {
  const day = Math.floor(Date.now() / 86400000);
  return LEADERS[day % LEADERS.length];
}

function influenceDots(score: number): string {
  return '\u25CF'.repeat(score) + '\u25CB'.repeat(10 - score);
}

// ── Sub-components ───────────────────────────────────────────────────────────

function TimelineBar({ leaders, onSelect }: { leaders: Leader[]; onSelect: (slug: string) => void }) {
  const sorted = [...leaders].sort((a, b) => a.birthYear - b.birthYear);
  const minYear = sorted[0].birthYear;
  const maxYear = sorted[sorted.length - 1].deathYear;
  const span = maxYear - minYear;

  return (
    <div
      style={{
        position: 'relative',
        height: 80,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        marginBottom: 24,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          textTransform: 'uppercase',
          color: '#64748b',
          padding: '6px 16px 0',
        }}
      >
        Lifespans Timeline
      </div>
      {sorted.map((l) => {
        const leftPct = ((l.birthYear - minYear) / span) * 100;
        const widthPct = Math.max(((l.deathYear - l.birthYear) / span) * 100, 0.5);
        return (
          <div
            key={l.slug}
            onClick={() => onSelect(l.slug)}
            title={`${l.name} (${l.datesDisplay})`}
            style={{
              position: 'absolute',
              left: `calc(16px + ${leftPct}% * (100% - 32px) / 100%)`,
              top: 24 + (sorted.indexOf(l) % 4) * 13,
              width: `calc(${widthPct}% * (100% - 32px) / 100%)`,
              minWidth: 6,
              height: 8,
              borderRadius: 4,
              background: LEGACY_COLORS[l.legacyType] || '#6b7280',
              opacity: 0.7,
              cursor: 'pointer',
              transition: 'opacity 0.15s, transform 0.15s',
              zIndex: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scaleY(1.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.7';
              e.currentTarget.style.transform = 'scaleY(1)';
            }}
          />
        );
      })}
      <div style={{ position: 'absolute', bottom: 4, left: 16, fontSize: 10, color: '#64748b' }}>
        {sorted[0].datesDisplay.split('–')[0]}
      </div>
      <div style={{ position: 'absolute', bottom: 4, right: 16, fontSize: 10, color: '#64748b' }}>
        {sorted[sorted.length - 1].datesDisplay.split('–')[1] || sorted[sorted.length - 1].datesDisplay}
      </div>
    </div>
  );
}

function MostInfluentialList({ leaders }: { leaders: Leader[] }) {
  const top5 = [...leaders].sort((a, b) => b.influenceScore - a.influenceScore).slice(0, 5);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 24,
      }}
    >
      <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700 }}>
        Most Influential Leaders
      </h3>
      {top5.map((l, i) => (
        <div
          key={l.slug}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '8px 0',
            borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: `${LEGACY_COLORS[l.legacyType] || '#6b7280'}33`,
              color: LEGACY_COLORS[l.legacyType] || '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{l.name}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              {l.datesDisplay} — {l.civilization}
            </div>
            <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 2, lineHeight: 1.4 }}>
              {l.influenceJustification}
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: LEGACY_COLORS[l.legacyType] || '#6b7280',
              flexShrink: 0,
            }}
          >
            {l.influenceScore}/10
          </div>
        </div>
      ))}
    </div>
  );
}

function SurprisingInclusion() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(255,255,255,0.03))',
        border: '1px solid rgba(168,85,247,0.3)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 24,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: '#a855f7', marginBottom: 6 }}>
        Surprising Inclusion
      </div>
      <div style={{ fontWeight: 700, fontSize: 16 }}>Mansa Musa</div>
      <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 6, lineHeight: 1.5 }}>
        Most "greatest leaders" lists skew heavily toward Europe and Asia. Mansa Musa's inclusion
        corrects that blind spot. The richest person in recorded history, his 1324 hajj to Mecca
        was so lavish it crashed gold markets across North Africa. He built Timbuktu into a global
        center of Islamic learning with the Sankore Madrasah (housing 25,000 students). His Mali Empire
        was larger than Western Europe. Yet he rarely appears in Western-centric history — a reminder
        that some of history's most extraordinary stories remain undertold.
      </div>
    </div>
  );
}

function LeaderCard({ leader, index }: { leader: Leader; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.6) }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '16px 18px',
          borderRadius: 10,
          background: expanded ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${expanded ? (LEGACY_COLORS[leader.legacyType] || '#6b7280') + '88' : 'rgba(255,255,255,0.06)'}`,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!expanded) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.borderColor = `${LEGACY_COLORS[leader.legacyType] || '#6b7280'}55`;
          }
        }}
        onMouseLeave={(e) => {
          if (!expanded) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
          }
        }}
      >
        {/* Header: era + region badges + influence dots */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <div
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                background: `${ERA_COLORS[leader.era] || '#6b7280'}22`,
                color: ERA_COLORS[leader.era] || '#6b7280',
              }}
            >
              {leader.era}
            </div>
            <div
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                background: `${REGION_COLORS[leader.region] || '#6b7280'}22`,
                color: REGION_COLORS[leader.region] || '#6b7280',
              }}
            >
              {leader.region}
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', letterSpacing: 1 }}>
            {influenceDots(leader.influenceScore)}
          </div>
        </div>

        {/* Name & title */}
        <div style={{ fontWeight: 700, fontSize: 16, marginTop: 8 }}>{leader.name}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
          {leader.title} — {leader.datesDisplay}
        </div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
          {leader.civilization}
        </div>

        {/* Legacy type badge */}
        <div style={{ marginTop: 8 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              background: `${LEGACY_COLORS[leader.legacyType]}22`,
              color: LEGACY_COLORS[leader.legacyType],
            }}
          >
            {leader.legacyType}
          </span>
        </div>

        {/* Signature achievement */}
        <div
          style={{
            marginTop: 8,
            padding: '6px 10px',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.04)',
            fontSize: 12,
            color: '#cbd5e1',
            fontStyle: 'italic',
          }}
        >
          {leader.signatureAchievement}
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginTop: 12 }}>
                {/* Known for */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                    Known For
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>
                    {leader.knownFor.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Famous quote */}
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    background: 'rgba(255,255,255,0.04)',
                    borderLeft: `3px solid ${LEGACY_COLORS[leader.legacyType]}`,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    Famous Quote
                  </div>
                  <div style={{ fontSize: 13, fontStyle: 'italic', color: '#e2e8f0' }}>
                    "{leader.quote}"
                  </div>
                </div>

                {/* Influence justification */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    Why {leader.influenceScore}/10?
                  </div>
                  <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{leader.influenceJustification}</div>
                </div>

                {/* Find in Chronicle link */}
                <Link
                  to={`/search?q=${encodeURIComponent(leader.chronicleQuery)}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: 'rgba(59,130,246,0.15)',
                    color: '#60a5fa',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.25)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.15)'; }}
                >
                  Find their events &rarr;
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function LeadersPage() {
  const [eraFilter, setEraFilter] = useState<string>('All');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [legacyFilter, setLegacyFilter] = useState<string>('All');
  const [sortMode, setSortMode] = useState<SortMode>('chronological');

  const leaderOfTheDay = useMemo(() => getLeaderOfTheDay(), []);

  const filtered = useMemo(() => {
    let list = [...LEADERS];

    if (eraFilter !== 'All') list = list.filter((l) => l.era === eraFilter);
    if (regionFilter !== 'All') list = list.filter((l) => l.region === regionFilter);
    if (legacyFilter !== 'All') list = list.filter((l) => l.legacyType === legacyFilter);

    if (sortMode === 'chronological') list.sort((a, b) => a.birthYear - b.birthYear);
    else if (sortMode === 'influence') list.sort((a, b) => b.influenceScore - a.influenceScore);
    else if (sortMode === 'region') list.sort((a, b) => a.region.localeCompare(b.region));
    else if (sortMode === 'legacy') list.sort((a, b) => a.legacyType.localeCompare(b.legacyType));

    return list;
  }, [eraFilter, regionFilter, legacyFilter, sortMode]);

  function scrollToLeader(slug: string) {
    const el = document.getElementById(`leader-${slug}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#e2e8f0',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Breadcrumb */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '16px 24px',
          fontSize: 13,
        }}
      >
        <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>
          Chronicle
        </Link>
        <span style={{ color: '#475569' }}>/</span>
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Leaders</span>
      </nav>

      {/* Hero */}
      <header style={{ padding: '48px 24px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}
        >
          The World's Most Influential Leaders
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ color: '#94a3b8', marginTop: 8, fontSize: 16, maxWidth: 600 }}
        >
          25 rulers, reformers, and liberators who shaped the course of civilization — from Cyrus to Mandela.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap' }}
        >
          <StatBox value="25" label="Leaders" />
          <StatBox value="2,613 yrs" label="Span (600 BCE – 2013 CE)" />
          <StatBox value="5" label="Legacy Types" />
          <StatBox value="9" label="Regions" />
        </motion.div>
      </header>

      {/* Main content */}
      <section style={{ padding: '16px 24px 64px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Leader of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            padding: '20px 24px',
            borderRadius: 12,
            background: `linear-gradient(135deg, ${LEGACY_COLORS[leaderOfTheDay.legacyType] || '#6b7280'}15, rgba(255,255,255,0.03))`,
            border: `1px solid ${LEGACY_COLORS[leaderOfTheDay.legacyType] || '#6b7280'}44`,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
            Leader of the Day
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{leaderOfTheDay.name}</div>
              <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
                {leaderOfTheDay.title} — {leaderOfTheDay.datesDisplay}
              </div>
              <div style={{ fontSize: 14, color: '#cbd5e1', marginTop: 8, maxWidth: 600, lineHeight: 1.5 }}>
                {leaderOfTheDay.signatureAchievement}
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6, fontStyle: 'italic' }}>
                "{leaderOfTheDay.quote}"
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: 6,
                  background: `${LEGACY_COLORS[leaderOfTheDay.legacyType] || '#6b7280'}22`,
                  color: LEGACY_COLORS[leaderOfTheDay.legacyType] || '#6b7280',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {leaderOfTheDay.legacyType}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: LEGACY_COLORS[leaderOfTheDay.legacyType] || '#6b7280' }}>
                {leaderOfTheDay.influenceScore}/10
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeline bar */}
        <TimelineBar leaders={LEADERS} onSelect={scrollToLeader} />

        {/* Most Influential top-5 */}
        <MostInfluentialList leaders={LEADERS} />

        {/* Surprising Inclusion sidebar */}
        <SurprisingInclusion />

        {/* Filter + Sort controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Era filter pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginRight: 4 }}>Era</span>
              {ALL_ERAS.map((era) => (
                <button
                  key={era}
                  onClick={() => setEraFilter(era)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background:
                      eraFilter === era
                        ? era === 'All'
                          ? 'rgba(255,255,255,0.15)'
                          : `${ERA_COLORS[era] || '#6b7280'}33`
                        : 'rgba(255,255,255,0.05)',
                    color:
                      eraFilter === era
                        ? era === 'All'
                          ? '#e2e8f0'
                          : ERA_COLORS[era] || '#e2e8f0'
                        : '#94a3b8',
                  }}
                >
                  {era}
                </button>
              ))}
            </div>
            {/* Region filter pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginRight: 4 }}>Region</span>
              {ALL_REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() => setRegionFilter(region)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background:
                      regionFilter === region
                        ? region === 'All'
                          ? 'rgba(255,255,255,0.15)'
                          : `${REGION_COLORS[region] || '#6b7280'}33`
                        : 'rgba(255,255,255,0.05)',
                    color:
                      regionFilter === region
                        ? region === 'All'
                          ? '#e2e8f0'
                          : REGION_COLORS[region] || '#e2e8f0'
                        : '#94a3b8',
                  }}
                >
                  {region}
                </button>
              ))}
            </div>
            {/* Legacy type filter pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginRight: 4 }}>Legacy</span>
              {ALL_LEGACIES.map((legacy) => (
                <button
                  key={legacy}
                  onClick={() => setLegacyFilter(legacy)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background:
                      legacyFilter === legacy
                        ? legacy === 'All'
                          ? 'rgba(255,255,255,0.15)'
                          : `${LEGACY_COLORS[legacy as LegacyType] || '#6b7280'}33`
                        : 'rgba(255,255,255,0.05)',
                    color:
                      legacyFilter === legacy
                        ? legacy === 'All'
                          ? '#e2e8f0'
                          : LEGACY_COLORS[legacy as LegacyType] || '#e2e8f0'
                        : '#94a3b8',
                  }}
                >
                  {legacy}
                </button>
              ))}
            </div>
          </div>

          {/* Sort dropdown */}
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#e2e8f0',
              padding: '6px 12px',
              fontSize: 13,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: '#1e293b' }}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Leader cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 16,
          }}
        >
          {filtered.map((l, i) => (
            <div key={l.slug} id={`leader-${l.slug}`}>
              <LeaderCard leader={l} index={i} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 64, color: '#64748b' }}>
            No leaders match these filters.
          </div>
        )}
      </section>
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        padding: '12px 20px',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        minWidth: 120,
      }}
    >
      <div style={{ fontSize: value.length > 6 ? 16 : 28, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94a3b8' }}>{label}</div>
    </div>
  );
}
