/**
 * LeadersPage — curated gallery of history's most influential rulers and leaders.
 *
 * Route: /leaders
 *
 * Features:
 *  1. Hero banner — "The People Who Shaped the World"
 *  2. Filter bar — era, leadership type, region
 *  3. Simultaneous reign timeline bar
 *  4. Leader cards — name, dates, bio, quote, legacy, leadership type badge
 *  5. Impact ranking indicator
 *
 * All data is curated inline (no backend endpoint needed).
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type LeadershipType = 'Conqueror' | 'Builder' | 'Liberator' | 'Reformer' | 'Tyrant';
type Era = 'Ancient' | 'Classical' | 'Medieval' | 'Early Modern' | 'Modern';
type Region = 'Europe' | 'Asia' | 'Africa' | 'Americas' | 'Middle East';

interface Leader {
  name: string;
  dates: string;
  /** Negative for BCE */
  birthYear: number;
  deathYear: number;
  realm: string;
  realmEmoji: string;
  era: Era;
  region: Region;
  type: LeadershipType;
  bio: string;
  legacy: string;
  quote: string;
  slug: string;
  impactRank: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<LeadershipType, string> = {
  Conqueror: '#ef4444',
  Builder: '#3b82f6',
  Liberator: '#22c55e',
  Reformer: '#a855f7',
  Tyrant: '#f97316',
};

const TYPE_ICONS: Record<LeadershipType, string> = {
  Conqueror: '\u2694\uFE0F',
  Builder: '\uD83C\uDFDB\uFE0F',
  Liberator: '\uD83D\uDD4A\uFE0F',
  Reformer: '\u2696\uFE0F',
  Tyrant: '\uD83D\uDC51',
};

const ERA_COLORS: Record<Era, string> = {
  Ancient: '#d97706',
  Classical: '#dc2626',
  Medieval: '#7c3aed',
  'Early Modern': '#0891b2',
  Modern: '#059669',
};

const CARD_STAGGER = 0.05;

// ─────────────────────────────────────────────────────────────────────────────
// Data — 30 curated leaders
// ─────────────────────────────────────────────────────────────────────────────

const LEADERS: Leader[] = [
  {
    name: 'Cyrus the Great',
    dates: '590–530 BCE',
    birthYear: -590,
    deathYear: -530,
    realm: 'Achaemenid Persia',
    realmEmoji: '\uD83C\uDDEE\uD83C\uDDF7',
    era: 'Ancient',
    region: 'Middle East',
    type: 'Reformer',
    bio: 'Founded the Achaemenid Empire, the largest empire the world had yet seen. His Cyrus Cylinder is often cited as the first declaration of human rights. He practiced tolerance toward conquered peoples, allowing them to keep their customs and religions.',
    legacy: 'Established the model of a multicultural empire governed through tolerance rather than terror, influencing governance for millennia.',
    quote: '"I am Cyrus, king of the world, great king, mighty king."',
    slug: 'cyrus-the-great',
    impactRank: 8,
  },
  {
    name: 'Alexander the Great',
    dates: '356–323 BCE',
    birthYear: -356,
    deathYear: -323,
    realm: 'Macedonia / Hellenistic Empire',
    realmEmoji: '\uD83C\uDDEC\uD83C\uDDF7',
    era: 'Ancient',
    region: 'Europe',
    type: 'Conqueror',
    bio: 'Conquered territories from Greece to northwestern India by age 30, creating one of history\'s largest empires. Tutored by Aristotle, he spread Greek culture across the known world. His campaigns fundamentally reshaped the ancient world\'s political landscape.',
    legacy: 'Hellenistic civilization fused Greek, Persian, Egyptian, and Indian cultures, shaping art, science, and philosophy for centuries.',
    quote: '"There is nothing impossible to him who will try."',
    slug: 'alexander-the-great',
    impactRank: 3,
  },
  {
    name: 'Ashoka',
    dates: '304–232 BCE',
    birthYear: -304,
    deathYear: -232,
    realm: 'Maurya Empire, India',
    realmEmoji: '\uD83C\uDDEE\uD83C\uDDF3',
    era: 'Ancient',
    region: 'Asia',
    type: 'Reformer',
    bio: 'After the devastating Kalinga War, Emperor Ashoka converted to Buddhism and renounced violence. He erected pillars across his empire inscribed with edicts promoting tolerance, nonviolence, and welfare. His reign transformed the Maurya Empire into a beacon of ethical governance.',
    legacy: 'His edicts represent the earliest known government commitment to religious tolerance and animal welfare; the Ashoka Chakra adorns India\'s flag today.',
    quote: '"All men are my children. What I desire for my own children — I desire for all men."',
    slug: 'ashoka',
    impactRank: 12,
  },
  {
    name: 'Julius Caesar',
    dates: '100–44 BCE',
    birthYear: -100,
    deathYear: -44,
    realm: 'Roman Republic',
    realmEmoji: '\uD83C\uDDEE\uD83C\uDDF9',
    era: 'Classical',
    region: 'Europe',
    type: 'Conqueror',
    bio: 'Conquered Gaul, crossed the Rubicon, and became dictator of Rome, ending the Republic. He reformed the calendar (Julian calendar used for 1,600 years), expanded citizenship, and launched vast public works. His assassination on the Ides of March remains one of history\'s most dramatic moments.',
    legacy: 'Transformed Rome from republic to empire; the Julian calendar shaped timekeeping until the Gregorian reform; "Caesar" became a title synonymous with supreme rule.',
    quote: '"Veni, vidi, vici." — I came, I saw, I conquered.',
    slug: 'julius-caesar',
    impactRank: 5,
  },
  {
    name: 'Augustus Caesar',
    dates: '63 BCE–14 CE',
    birthYear: -63,
    deathYear: 14,
    realm: 'Roman Empire',
    realmEmoji: '\uD83C\uDDEE\uD83C\uDDF9',
    era: 'Classical',
    region: 'Europe',
    type: 'Builder',
    bio: 'Rome\'s first emperor ushered in the Pax Romana — two centuries of relative peace and prosperity. He reorganized the military, built infrastructure, and patronized the arts. His political genius turned a war-torn republic into a stable empire spanning the Mediterranean.',
    legacy: 'Created the administrative framework that sustained the Roman Empire for centuries; the month of August bears his name.',
    quote: '"I found Rome a city of bricks and left it a city of marble."',
    slug: 'augustus-caesar',
    impactRank: 6,
  },
  {
    name: 'Cleopatra VII',
    dates: '69–30 BCE',
    birthYear: -69,
    deathYear: -30,
    realm: 'Ptolemaic Egypt',
    realmEmoji: '\uD83C\uDDEA\uD83C\uDDEC',
    era: 'Classical',
    region: 'Africa',
    type: 'Builder',
    bio: 'The last active pharaoh of Egypt, Cleopatra was a polyglot diplomat who spoke nine languages. She forged strategic alliances with Julius Caesar and Mark Antony to preserve Egyptian independence. Her political acumen kept Egypt sovereign for two decades against Roman expansion.',
    legacy: 'Embodied the power of diplomacy and intellect in leadership; her death marked the end of the Hellenistic era and Egypt\'s absorption into Rome.',
    quote: '"I will not be triumphed over."',
    slug: 'cleopatra-vii',
    impactRank: 18,
  },
  {
    name: 'Constantine I',
    dates: '272–337 CE',
    birthYear: 272,
    deathYear: 337,
    realm: 'Roman Empire',
    realmEmoji: '\uD83C\uDDEE\uD83C\uDDF9',
    era: 'Classical',
    region: 'Europe',
    type: 'Reformer',
    bio: 'The first Roman emperor to convert to Christianity, Constantine issued the Edict of Milan legalizing Christian worship throughout the empire. He founded Constantinople as a "New Rome," shifting the empire\'s center eastward. He convened the Council of Nicaea, shaping Christian doctrine.',
    legacy: 'Christianized the Roman Empire, setting the religious trajectory of Western civilization for the next 1,700 years.',
    quote: '"In this sign, conquer."',
    slug: 'constantine-i',
    impactRank: 9,
  },
  {
    name: 'Charlemagne',
    dates: '747–814 CE',
    birthYear: 747,
    deathYear: 814,
    realm: 'Carolingian Empire / Holy Roman Empire',
    realmEmoji: '\uD83C\uDDEB\uD83C\uDDF7',
    era: 'Medieval',
    region: 'Europe',
    type: 'Builder',
    bio: 'Crowned Holy Roman Emperor in 800, Charlemagne united most of Western Europe for the first time since the fall of Rome. He championed education through the Carolingian Renaissance, standardized currency, and reformed the legal system. His empire laid the groundwork for modern France and Germany.',
    legacy: 'Often called the "Father of Europe," his reign revived learning and planted the seeds of European nationhood.',
    quote: '"To have another language is to possess a second soul."',
    slug: 'charlemagne',
    impactRank: 11,
  },
  {
    name: 'Genghis Khan',
    dates: '1162–1227',
    birthYear: 1162,
    deathYear: 1227,
    realm: 'Mongol Empire',
    realmEmoji: '\uD83C\uDDF2\uD83C\uDDF3',
    era: 'Medieval',
    region: 'Asia',
    type: 'Conqueror',
    bio: 'United the nomadic Mongol tribes and forged the largest contiguous land empire in history, stretching from China to Eastern Europe. He established the Yasa legal code, promoted meritocracy, and guaranteed religious freedom across his domains. His postal system (Yam) connected civilizations.',
    legacy: 'Opened the Silk Road to safe trade, connected East and West, and left a genetic legacy — an estimated 16 million living descendants.',
    quote: '"I am the punishment of God. If you had not committed great sins, God would not have sent a punishment like me."',
    slug: 'genghis-khan',
    impactRank: 2,
  },
  {
    name: 'Saladin',
    dates: '1137–1193',
    birthYear: 1137,
    deathYear: 1193,
    realm: 'Ayyubid Sultanate',
    realmEmoji: '\uD83C\uDDF5\uD83C\uDDF8',
    era: 'Medieval',
    region: 'Middle East',
    type: 'Liberator',
    bio: 'A Kurdish Muslim leader who recaptured Jerusalem from the Crusaders in 1187. Known for his chivalry even by his enemies, Saladin unified Egypt and Syria under the Ayyubid dynasty. He showed unusual mercy to defeated foes, earning respect across religious lines.',
    legacy: 'A rare figure admired by both Muslim and Christian historians; his chivalric conduct set a standard for honorable warfare.',
    quote: '"If you want to destroy any nation without war, make adultery or nudity common in the young generation."',
    slug: 'saladin',
    impactRank: 19,
  },
  {
    name: 'Kublai Khan',
    dates: '1215–1294',
    birthYear: 1215,
    deathYear: 1294,
    realm: 'Yuan Dynasty, China',
    realmEmoji: '\uD83C\uDDE8\uD83C\uDDF3',
    era: 'Medieval',
    region: 'Asia',
    type: 'Builder',
    bio: 'Grandson of Genghis Khan, Kublai completed the Mongol conquest of China and founded the Yuan Dynasty. He embraced Chinese culture while maintaining Mongol identity, building the magnificent capital of Khanbaliq (modern Beijing). His court welcomed Marco Polo and traders from across Eurasia.',
    legacy: 'Bridged Mongol and Chinese civilizations, expanded Grand Canal trade, and made China a center of global commerce.',
    quote: '"The greatest happiness is to vanquish your enemies, to chase them before you, to rob them of their wealth."',
    slug: 'kublai-khan',
    impactRank: 21,
  },
  {
    name: 'Mansa Musa',
    dates: '1280–1337',
    birthYear: 1280,
    deathYear: 1337,
    realm: 'Mali Empire',
    realmEmoji: '\uD83C\uDDF2\uD83C\uDDF1',
    era: 'Medieval',
    region: 'Africa',
    type: 'Builder',
    bio: 'Emperor of the Mali Empire and possibly the wealthiest person in history. His 1324 pilgrimage to Mecca was so lavish — distributing gold along the way — that he crashed the economies of cities he passed through. He built the legendary Timbuktu into a center of Islamic learning.',
    legacy: 'Put West Africa on the world map, literally — European cartographers depicted him on the Catalan Atlas; Timbuktu\'s Sankore University attracted scholars across the Muslim world.',
    quote: '"I have come from a land of much gold."',
    slug: 'mansa-musa',
    impactRank: 15,
  },
  {
    name: 'Tamerlane',
    dates: '1336–1405',
    birthYear: 1336,
    deathYear: 1405,
    realm: 'Timurid Empire',
    realmEmoji: '\uD83C\uDDFA\uD83C\uDDFF',
    era: 'Medieval',
    region: 'Asia',
    type: 'Conqueror',
    bio: 'A Turco-Mongol conqueror who built an empire spanning from Turkey to India through devastating military campaigns. Despite his brutal conquests, he was a patron of arts and architecture, making Samarkand one of the most beautiful cities in the world. His campaigns reshaped the political map of Central Asia.',
    legacy: 'His architectural patronage left Samarkand as a World Heritage Site; his military campaigns ended the power of the Delhi Sultanate and the Golden Horde.',
    quote: '"As there is but one God in heaven, there ought to be but one ruler on earth."',
    slug: 'tamerlane',
    impactRank: 22,
  },
  {
    name: 'Henry VIII',
    dates: '1491–1547',
    birthYear: 1491,
    deathYear: 1547,
    realm: 'Kingdom of England',
    realmEmoji: '\uD83C\uDDEC\uD83C\uDDE7',
    era: 'Early Modern',
    region: 'Europe',
    type: 'Tyrant',
    bio: 'Notorious for his six marriages and break with the Catholic Church, Henry VIII established the Church of England to secure an annulment the Pope would not grant. His Reformation reshaped English religion, politics, and identity. He dissolved the monasteries, redistributing vast wealth to the crown.',
    legacy: 'The English Reformation he triggered shaped the religious and political identity of the English-speaking world for centuries.',
    quote: '"I do not choose that anyone shall have it in his power to command me, nor will I ever suffer it."',
    slug: 'henry-viii',
    impactRank: 20,
  },
  {
    name: 'Suleiman the Magnificent',
    dates: '1494–1566',
    birthYear: 1494,
    deathYear: 1566,
    realm: 'Ottoman Empire',
    realmEmoji: '\uD83C\uDDF9\uD83C\uDDF7',
    era: 'Early Modern',
    region: 'Middle East',
    type: 'Builder',
    bio: 'Presided over the Ottoman Empire at its zenith, ruling the most powerful state in the Mediterranean world. He reformed the legal system (earning the title "The Lawgiver" in the East), patronized the arts, and oversaw Mimar Sinan\'s architectural masterworks. His reign saw the Ottomans dominate three continents.',
    legacy: 'Ottoman legal, artistic, and architectural achievements under his reign represent the high-water mark of Islamic imperial civilization.',
    quote: '"The people think of wealth and power as the greatest fate, but in this world a spell of health is the best state."',
    slug: 'suleiman-the-magnificent',
    impactRank: 14,
  },
  {
    name: 'Elizabeth I',
    dates: '1533–1603',
    birthYear: 1533,
    deathYear: 1603,
    realm: 'Kingdom of England',
    realmEmoji: '\uD83C\uDDEC\uD83C\uDDE7',
    era: 'Early Modern',
    region: 'Europe',
    type: 'Builder',
    bio: 'The "Virgin Queen" presided over England\'s golden age, defeating the Spanish Armada and nurturing a cultural renaissance that produced Shakespeare. She navigated religious tensions with the Elizabethan Settlement, establishing a middle way between Catholicism and Protestantism. Her 45-year reign brought stability after decades of turmoil.',
    legacy: 'The Elizabethan era defined English cultural identity; her reign proved that a woman could govern as effectively as any king.',
    quote: '"I know I have the body of a weak and feeble woman, but I have the heart and stomach of a king."',
    slug: 'elizabeth-i',
    impactRank: 13,
  },
  {
    name: 'Peter the Great',
    dates: '1672–1725',
    birthYear: 1672,
    deathYear: 1725,
    realm: 'Russian Empire',
    realmEmoji: '\uD83C\uDDF7\uD83C\uDDFA',
    era: 'Early Modern',
    region: 'Europe',
    type: 'Reformer',
    bio: 'Transformed Russia from a medieval kingdom into a European great power through forced modernization. He built Saint Petersburg as his "window to Europe," created the Russian Navy, and reformed government, education, and even dress codes. His Grand Embassy to Western Europe in 1697 was unprecedented for a reigning monarch.',
    legacy: 'Russia\'s emergence as a major European power and its Western-oriented identity trace directly to Peter\'s reforms.',
    quote: '"I have conquered an empire but have not been able to conquer myself."',
    slug: 'peter-the-great',
    impactRank: 16,
  },
  {
    name: 'Catherine the Great',
    dates: '1729–1796',
    birthYear: 1729,
    deathYear: 1796,
    realm: 'Russian Empire',
    realmEmoji: '\uD83C\uDDF7\uD83C\uDDFA',
    era: 'Early Modern',
    region: 'Europe',
    type: 'Reformer',
    bio: 'A German-born princess who became Russia\'s longest-reigning female ruler, Catherine expanded the empire dramatically and embraced Enlightenment ideals. She corresponded with Voltaire and Diderot, modernized education, and founded the Hermitage Museum. Her reign is considered Russia\'s Golden Age.',
    legacy: 'Expanded Russia to the Black Sea, championed Enlightenment culture, and proved that an outsider could become one of the most effective rulers in Russian history.',
    quote: '"Power without a nation\'s confidence is nothing."',
    slug: 'catherine-the-great',
    impactRank: 17,
  },
  {
    name: 'Napoleon Bonaparte',
    dates: '1769–1821',
    birthYear: 1769,
    deathYear: 1821,
    realm: 'French Empire',
    realmEmoji: '\uD83C\uDDEB\uD83C\uDDF7',
    era: 'Modern',
    region: 'Europe',
    type: 'Conqueror',
    bio: 'Rose from Corsican obscurity to dominate Europe, crowning himself Emperor of the French. The Napoleonic Code — his civil legal framework — influenced legal systems worldwide and remains the basis of law in many countries. He redrew the map of Europe before his final defeat at Waterloo.',
    legacy: 'The Napoleonic Code spread principles of legal equality and secular governance across Europe and beyond; modern civil law descends from his reforms.',
    quote: '"Impossible is a word to be found only in the dictionary of fools."',
    slug: 'napoleon-bonaparte',
    impactRank: 4,
  },
  {
    name: 'Sim\u00F3n Bol\u00EDvar',
    dates: '1783–1830',
    birthYear: 1783,
    deathYear: 1830,
    realm: 'Gran Colombia / South America',
    realmEmoji: '\uD83C\uDDFB\uD83C\uDDEA',
    era: 'Modern',
    region: 'Americas',
    type: 'Liberator',
    bio: 'Known as "El Libertador," Bol\u00EDvar led the liberation of six South American nations from Spanish colonial rule. He envisioned a united Latin American republic modeled on republican ideals. His military campaigns across the Andes remain among the most remarkable in military history.',
    legacy: 'Bolivia is named after him; his vision of Latin American unity continues to inspire political movements across the continent.',
    quote: '"A people that love freedom will in the end be free."',
    slug: 'simon-bolivar',
    impactRank: 14,
  },
  {
    name: 'Abraham Lincoln',
    dates: '1809–1865',
    birthYear: 1809,
    deathYear: 1865,
    realm: 'United States of America',
    realmEmoji: '\uD83C\uDDFA\uD83C\uDDF8',
    era: 'Modern',
    region: 'Americas',
    type: 'Liberator',
    bio: 'Preserved the American Union through the Civil War and abolished slavery with the Emancipation Proclamation and the 13th Amendment. A self-educated lawyer from humble origins, he became one of the most eloquent political communicators in history. His assassination made him a martyr for democracy.',
    legacy: 'Ended slavery in America, preserved the Union, and set the precedent that democracy could survive its greatest internal crisis.',
    quote: '"Government of the people, by the people, for the people, shall not perish from the earth."',
    slug: 'abraham-lincoln',
    impactRank: 7,
  },
  {
    name: 'Otto von Bismarck',
    dates: '1815–1898',
    birthYear: 1815,
    deathYear: 1898,
    realm: 'German Empire',
    realmEmoji: '\uD83C\uDDE9\uD83C\uDDEA',
    era: 'Modern',
    region: 'Europe',
    type: 'Builder',
    bio: 'The "Iron Chancellor" unified the German states into a single empire through a masterful combination of diplomacy and warfare — "blood and iron." He invented modern social welfare programs including health insurance, accident insurance, and old-age pensions. His realpolitik approach dominated European diplomacy for decades.',
    legacy: 'Created the German nation-state and pioneered the welfare state; his alliance system maintained European peace until it unraveled into World War I.',
    quote: '"Politics is the art of the possible, the attainable — the art of the next best."',
    slug: 'otto-von-bismarck',
    impactRank: 13,
  },
  {
    name: 'Queen Victoria',
    dates: '1819–1901',
    birthYear: 1819,
    deathYear: 1901,
    realm: 'British Empire',
    realmEmoji: '\uD83C\uDDEC\uD83C\uDDE7',
    era: 'Modern',
    region: 'Europe',
    type: 'Builder',
    bio: 'Reigned for 63 years during which the British Empire reached its zenith, covering a quarter of the world\'s land surface. The Victorian era saw the Industrial Revolution transform society, the expansion of democracy, and a cultural flowering. She became the symbolic matriarch of Europe through her children\'s royal marriages.',
    legacy: 'The Victorian era defined modernity — industrialization, global trade, and the spread of parliamentary democracy owe much to her reign.',
    quote: '"We are not interested in the possibilities of defeat. They do not exist."',
    slug: 'queen-victoria',
    impactRank: 16,
  },
  {
    name: 'Meiji Emperor',
    dates: '1852–1912',
    birthYear: 1852,
    deathYear: 1912,
    realm: 'Empire of Japan',
    realmEmoji: '\uD83C\uDDEF\uD83C\uDDF5',
    era: 'Modern',
    region: 'Asia',
    type: 'Reformer',
    bio: 'Presided over Japan\'s transformation from a feudal shogunate to a modern industrial and military power in just decades. The Meiji Restoration abolished the samurai class, established a constitution, and industrialized the economy. By 1905, Japan defeated Russia — the first Asian power to defeat a European one in modern times.',
    legacy: 'Japan\'s rise from isolation to world power in a single generation remains the most dramatic national modernization in history.',
    quote: '"Let knowledge be sought throughout the world so as to strengthen the foundations of imperial rule."',
    slug: 'meiji-emperor',
    impactRank: 15,
  },
  {
    name: 'Vladimir Lenin',
    dates: '1870–1924',
    birthYear: 1870,
    deathYear: 1924,
    realm: 'Soviet Union',
    realmEmoji: '\uD83C\uDDF7\uD83C\uDDFA',
    era: 'Modern',
    region: 'Europe',
    type: 'Tyrant',
    bio: 'Led the Bolshevik Revolution of 1917 that overthrew the Russian Empire and established the world\'s first communist state. His adaptation of Marxism — Marxism-Leninism — became the ideological foundation for revolutionary movements worldwide. He created the Soviet system of one-party rule that would dominate half the world.',
    legacy: 'Launched the communist experiment that shaped the 20th century\'s greatest ideological conflict; the Cold War was his ultimate legacy.',
    quote: '"There are decades where nothing happens; and there are weeks where decades happen."',
    slug: 'vladimir-lenin',
    impactRank: 10,
  },
  {
    name: 'Mahatma Gandhi',
    dates: '1869–1948',
    birthYear: 1869,
    deathYear: 1948,
    realm: 'India',
    realmEmoji: '\uD83C\uDDEE\uD83C\uDDF3',
    era: 'Modern',
    region: 'Asia',
    type: 'Liberator',
    bio: 'Pioneered nonviolent civil disobedience as a tool for political liberation, leading India to independence from the British Empire. His philosophy of satyagraha (truth-force) inspired civil rights movements worldwide. Through salt marches, hunger strikes, and moral persuasion, he proved that empires could be defeated without armies.',
    legacy: 'His methods inspired Martin Luther King Jr., Nelson Mandela, and countless liberation movements; he proved nonviolence could defeat empires.',
    quote: '"Be the change that you wish to see in the world."',
    slug: 'mahatma-gandhi',
    impactRank: 6,
  },
  {
    name: 'Franklin D. Roosevelt',
    dates: '1882–1945',
    birthYear: 1882,
    deathYear: 1945,
    realm: 'United States of America',
    realmEmoji: '\uD83C\uDDFA\uD83C\uDDF8',
    era: 'Modern',
    region: 'Americas',
    type: 'Builder',
    bio: 'The only US president elected four times, FDR guided America through the Great Depression with the New Deal and through World War II to victory. He created Social Security, reshaped the federal government\'s role in American life, and helped design the postwar international order. He led from a wheelchair, concealing his polio from the public.',
    legacy: 'The modern American welfare state, the United Nations, and America\'s role as a global superpower all trace to his presidency.',
    quote: '"The only thing we have to fear is fear itself."',
    slug: 'franklin-d-roosevelt',
    impactRank: 8,
  },
  {
    name: 'Winston Churchill',
    dates: '1874–1965',
    birthYear: 1874,
    deathYear: 1965,
    realm: 'United Kingdom',
    realmEmoji: '\uD83C\uDDEC\uD83C\uDDE7',
    era: 'Modern',
    region: 'Europe',
    type: 'Builder',
    bio: 'As wartime Prime Minister, Churchill rallied Britain to resist Nazi Germany when it stood alone in 1940. His speeches — "We shall fight on the beaches," "Their finest hour" — are among the most powerful in the English language. A Nobel Prize-winning author, painter, and soldier, he embodied defiant leadership in democracy\'s darkest hour.',
    legacy: 'His refusal to surrender in 1940 may have been the single most consequential personal decision in modern history.',
    quote: '"We shall fight on the beaches, we shall fight on the landing grounds, we shall never surrender."',
    slug: 'winston-churchill',
    impactRank: 7,
  },
  {
    name: 'Mao Zedong',
    dates: '1893–1976',
    birthYear: 1893,
    deathYear: 1976,
    realm: "People's Republic of China",
    realmEmoji: '\uD83C\uDDE8\uD83C\uDDF3',
    era: 'Modern',
    region: 'Asia',
    type: 'Tyrant',
    bio: 'Founded the People\'s Republic of China in 1949 after leading the Communist Party to victory in a civil war. His Great Leap Forward and Cultural Revolution caused millions of deaths but also unified and industrialized China. He remains the most consequential — and controversial — Chinese leader of the modern era.',
    legacy: 'Created modern China as a unified state; his ideology shaped the lives of over a billion people, for better and worse.',
    quote: '"Political power grows out of the barrel of a gun."',
    slug: 'mao-zedong',
    impactRank: 5,
  },
  {
    name: 'Nelson Mandela',
    dates: '1918–2013',
    birthYear: 1918,
    deathYear: 2013,
    realm: 'South Africa',
    realmEmoji: '\uD83C\uDDFF\uD83C\uDDE6',
    era: 'Modern',
    region: 'Africa',
    type: 'Liberator',
    bio: 'Imprisoned for 27 years for opposing apartheid, Mandela emerged to become South Africa\'s first Black president and lead a peaceful transition from racial oppression to democracy. Rather than seeking vengeance, he championed reconciliation through the Truth and Reconciliation Commission. His moral authority transcended borders.',
    legacy: 'Proved that reconciliation, not retribution, could heal deep societal wounds; a universal symbol of justice, forgiveness, and human dignity.',
    quote: '"It always seems impossible until it\'s done."',
    slug: 'nelson-mandela',
    impactRank: 9,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const ALL_ERAS: Era[] = ['Ancient', 'Classical', 'Medieval', 'Early Modern', 'Modern'];
const ALL_TYPES: LeadershipType[] = ['Conqueror', 'Builder', 'Liberator', 'Reformer', 'Tyrant'];
const ALL_REGIONS: Region[] = ['Europe', 'Asia', 'Africa', 'Americas', 'Middle East'];

/** Timeline range constants */
const TIMELINE_START = -600;
const TIMELINE_END = 2020;
const TIMELINE_SPAN = TIMELINE_END - TIMELINE_START;

function yearToPercent(year: number): number {
  return ((year - TIMELINE_START) / TIMELINE_SPAN) * 100;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function FilterPill({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 14px',
        borderRadius: 20,
        border: `1px solid ${active ? color : 'rgba(255,255,255,0.12)'}`,
        backgroundColor: active ? `${color}22` : 'rgba(255,255,255,0.04)',
        color: active ? color : '#94a3b8',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {label}
    </button>
  );
}

function TimelineBar({ leaders }: { leaders: Leader[] }) {
  return (
    <div
      style={{
        padding: '24px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        overflowX: 'auto',
      }}
    >
      <h3
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Simultaneous Reigns
      </h3>
      <div
        style={{
          position: 'relative',
          height: Math.max(leaders.length * 22 + 30, 60),
          minWidth: 700,
        }}
      >
        {/* Era labels */}
        {[
          { label: '500 BCE', year: -500 },
          { label: '1 CE', year: 1 },
          { label: '500', year: 500 },
          { label: '1000', year: 1000 },
          { label: '1500', year: 1500 },
          { label: '2000', year: 2000 },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              position: 'absolute',
              left: `${yearToPercent(m.year)}%`,
              top: 0,
              bottom: 0,
              borderLeft: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: -2,
                left: 4,
                fontSize: 9,
                color: '#475569',
                whiteSpace: 'nowrap',
              }}
            >
              {m.label}
            </span>
          </div>
        ))}

        {/* Reign bars */}
        {leaders.map((leader, i) => {
          const left = yearToPercent(leader.birthYear);
          const width = yearToPercent(leader.deathYear) - left;
          const color = TYPE_COLORS[leader.type];
          return (
            <div
              key={leader.slug}
              title={`${leader.name} (${leader.dates})`}
              style={{
                position: 'absolute',
                left: `${Math.max(0, left)}%`,
                width: `${Math.max(0.3, width)}%`,
                top: i * 22 + 20,
                height: 14,
                backgroundColor: `${color}44`,
                border: `1px solid ${color}88`,
                borderRadius: 3,
                cursor: 'default',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 4,
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  fontSize: 8,
                  color: '#e2e8f0',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {leader.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeaderCard({ leader, index }: { leader: Leader; index: number }) {
  const color = TYPE_COLORS[leader.type];
  const icon = TYPE_ICONS[leader.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * CARD_STAGGER }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${color}44`;
        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.05)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.03)';
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 20 }}>{leader.realmEmoji}</span>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#f1f5f9',
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {leader.name}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{leader.dates}</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>|</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{leader.realm}</span>
          </div>
        </div>
        {/* Impact rank */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Impact
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: leader.impactRank <= 5 ? '#fbbf24' : leader.impactRank <= 10 ? '#94a3b8' : '#64748b',
            }}
          >
            #{leader.impactRank}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 6,
            backgroundColor: `${color}22`,
            color,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {icon} {leader.type}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 6,
            backgroundColor: `${ERA_COLORS[leader.era]}22`,
            color: ERA_COLORS[leader.era],
          }}
        >
          {leader.era}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 6,
            backgroundColor: 'rgba(255,255,255,0.06)',
            color: '#94a3b8',
          }}
        >
          {leader.region}
        </span>
      </div>

      {/* Bio */}
      <p style={{ fontSize: 13, lineHeight: 1.65, color: '#cbd5e1', margin: 0 }}>{leader.bio}</p>

      {/* Legacy */}
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 8,
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderLeft: `3px solid ${color}66`,
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Legacy
        </span>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: '#94a3b8', margin: '6px 0 0' }}>{leader.legacy}</p>
      </div>

      {/* Quote */}
      <blockquote
        style={{
          margin: 0,
          padding: '10px 16px',
          borderLeft: '2px solid rgba(255,255,255,0.12)',
          fontStyle: 'italic',
          fontSize: 12,
          color: '#64748b',
          lineHeight: 1.5,
        }}
      >
        {leader.quote}
      </blockquote>

      {/* Find in Chronicle link */}
      <Link
        to={`/event/${leader.slug}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          fontWeight: 600,
          color,
          textDecoration: 'none',
          transition: 'opacity 0.15s',
          alignSelf: 'flex-start',
        }}
      >
        Find in Chronicle →
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

export default function LeadersPage() {
  const [selectedEras, setSelectedEras] = useState<Set<Era>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<LeadershipType>>(new Set());
  const [selectedRegions, setSelectedRegions] = useState<Set<Region>>(new Set());
  const [sortBy, setSortBy] = useState<'impact' | 'chronological'>('impact');

  const toggleFilter = <T,>(set: Set<T>, item: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setter(next);
  };

  const filtered = useMemo(() => {
    let result = LEADERS.filter((l) => {
      if (selectedEras.size > 0 && !selectedEras.has(l.era)) return false;
      if (selectedTypes.size > 0 && !selectedTypes.has(l.type)) return false;
      if (selectedRegions.size > 0 && !selectedRegions.has(l.region)) return false;
      return true;
    });
    if (sortBy === 'impact') {
      result = [...result].sort((a, b) => a.impactRank - b.impactRank);
    } else {
      result = [...result].sort((a, b) => a.birthYear - b.birthYear);
    }
    return result;
  }, [selectedEras, selectedTypes, selectedRegions, sortBy]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Hero */}
      <div
        style={{
          padding: '48px 32px 40px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(168,85,247,0.08) 100%)',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: '#64748b',
            textDecoration: 'none',
            marginBottom: 28,
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        >
          ← Back to Timeline
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: 'rgba(168,85,247,0.15)',
              border: '2px solid rgba(168,85,247,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              boxShadow: '0 0 30px rgba(168,85,247,0.2)',
            }}
          >
            👑
          </span>
          <div>
            <h1
              style={{
                fontSize: 'clamp(24px, 4vw, 38px)',
                fontWeight: 800,
                color: '#f1f5f9',
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              The People Who Shaped the World
            </h1>
            <p
              style={{
                fontSize: 15,
                color: '#94a3b8',
                margin: '6px 0 0',
                lineHeight: 1.5,
              }}
            >
              History's Greatest Leaders — from ancient empire-builders to modern liberators
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#64748b', marginTop: 20 }}>
          <span>{LEADERS.length} leaders</span>
          <span>|</span>
          <span>
            {ALL_TYPES.map((t) => {
              const count = LEADERS.filter((l) => l.type === t).length;
              return `${count} ${t}${count !== 1 ? 's' : ''}`;
            }).join(' · ')}
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div
        style={{
          padding: '20px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* Era filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 50 }}>
            Era
          </span>
          {ALL_ERAS.map((era) => (
            <FilterPill
              key={era}
              label={era}
              active={selectedEras.has(era)}
              color={ERA_COLORS[era]}
              onClick={() => toggleFilter(selectedEras, era, setSelectedEras)}
            />
          ))}
        </div>

        {/* Type filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 50 }}>
            Type
          </span>
          {ALL_TYPES.map((type) => (
            <FilterPill
              key={type}
              label={`${TYPE_ICONS[type]} ${type}`}
              active={selectedTypes.has(type)}
              color={TYPE_COLORS[type]}
              onClick={() => toggleFilter(selectedTypes, type, setSelectedTypes)}
            />
          ))}
        </div>

        {/* Region filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 50 }}>
            Region
          </span>
          {ALL_REGIONS.map((region) => (
            <FilterPill
              key={region}
              label={region}
              active={selectedRegions.has(region)}
              color="#60a5fa"
              onClick={() => toggleFilter(selectedRegions, region, setSelectedRegions)}
            />
          ))}
        </div>

        {/* Sort + count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>
            Showing {filtered.length} of {LEADERS.length} leaders
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setSortBy('impact')}
              style={{
                padding: '5px 14px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: sortBy === 'impact' ? 'rgba(251,191,36,0.15)' : 'transparent',
                color: sortBy === 'impact' ? '#fbbf24' : '#64748b',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Most Impactful
            </button>
            <button
              onClick={() => setSortBy('chronological')}
              style={{
                padding: '5px 14px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: sortBy === 'chronological' ? 'rgba(96,165,250,0.15)' : 'transparent',
                color: sortBy === 'chronological' ? '#60a5fa' : '#64748b',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Chronological
            </button>
          </div>
        </div>
      </div>

      {/* Timeline bar */}
      <TimelineBar leaders={filtered} />

      {/* Leader cards grid */}
      <div
        style={{
          padding: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
          gap: 20,
        }}
      >
        {filtered.map((leader, i) => (
          <LeaderCard key={leader.slug} leader={leader} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            padding: '80px 32px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: 15,
          }}
        >
          No leaders match the selected filters. Try broadening your selection.
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          padding: '32px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
          color: '#475569',
          fontSize: 12,
        }}
      >
        Chronicle — exploring history through connections, perspectives, and the people who shaped it.
      </div>
    </div>
  );
}
