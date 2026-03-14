/**
 * SourcesPage — curated library of primary historical source documents.
 *
 * Route: /sources
 *
 * Sections:
 *  1. Hero — "Read the Original Words"
 *  2. Featured document highlight
 *  3. Search/filter bar (era + document type)
 *  4. 6 era sections with source cards
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Era = 'Ancient' | 'Classical' | 'Medieval' | 'Early Modern' | 'Modern' | 'Contemporary';
type DocCategory = 'Treaty' | 'Constitution' | 'Speech' | 'Letter' | 'Manifesto' | 'Legal' | 'Religious' | 'Scientific';

interface PrimarySource {
  title: string;
  author: string;
  date: string;
  year: number;
  era: Era;
  category: DocCategory;
  description: string;
  url: string;
  urlLabel: string;
  readingTime: string;
  searchQuery: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ERA_COLORS: Record<Era, string> = {
  Ancient: '#8b5cf6',
  Classical: '#a855f7',
  Medieval: '#f59e0b',
  'Early Modern': '#f97316',
  Modern: '#3b82f6',
  Contemporary: '#22c55e',
};

const CATEGORY_COLORS: Record<DocCategory, string> = {
  Treaty: '#3b82f6',
  Constitution: '#8b5cf6',
  Speech: '#ef4444',
  Letter: '#f59e0b',
  Manifesto: '#ec4899',
  Legal: '#6366f1',
  Religious: '#a855f7',
  Scientific: '#22c55e',
};

const ERAS: Era[] = ['Ancient', 'Classical', 'Medieval', 'Early Modern', 'Modern', 'Contemporary'];
const DOC_CATEGORIES: DocCategory[] = ['Treaty', 'Constitution', 'Speech', 'Letter', 'Manifesto', 'Legal', 'Religious', 'Scientific'];

// ─────────────────────────────────────────────────────────────────────────────
// Primary Sources Data
// ─────────────────────────────────────────────────────────────────────────────

const SOURCES: PrimarySource[] = [
  // ── Ancient ──
  {
    title: "Code of Hammurabi",
    author: "King Hammurabi of Babylon",
    date: "c. 1754 BCE",
    year: -1754,
    era: 'Ancient',
    category: 'Legal',
    description: "One of the oldest deciphered writings of significant length, this Babylonian legal code established 282 laws with scaled punishments. It represents one of humanity's first attempts at a comprehensive legal system.",
    url: "https://avalon.law.yale.edu/ancient/hamframe.asp",
    urlLabel: "Yale Avalon Project",
    readingTime: "45 min",
    searchQuery: "Hammurabi",
  },
  {
    title: "The Art of War",
    author: "Sun Tzu",
    date: "c. 5th century BCE",
    year: -500,
    era: 'Ancient',
    category: 'Scientific',
    description: "The most influential treatise on military strategy ever written, composed of 13 chapters covering warfare tactics, intelligence, and leadership. Its principles remain studied in military academies and business schools worldwide.",
    url: "https://www.gutenberg.org/ebooks/132",
    urlLabel: "Project Gutenberg",
    readingTime: "1.5 hrs",
    searchQuery: "Sun Tzu",
  },
  {
    title: "The Histories",
    author: "Herodotus",
    date: "c. 430 BCE",
    year: -430,
    era: 'Ancient',
    category: 'Scientific',
    description: "The foundational work of Western history, documenting the Greco-Persian Wars and the customs of ancient peoples. Herodotus is often called the 'Father of History' for pioneering historical inquiry as a discipline.",
    url: "https://www.gutenberg.org/ebooks/2707",
    urlLabel: "Project Gutenberg",
    readingTime: "12 hrs",
    searchQuery: "Herodotus",
  },
  {
    title: "History of the Peloponnesian War — The Melian Dialogue",
    author: "Thucydides",
    date: "c. 400 BCE",
    year: -400,
    era: 'Ancient',
    category: 'Scientific',
    description: "Thucydides' account of negotiations between Athens and the island of Melos is the foundational text of political realism. The dialogue starkly illustrates how power dynamics override moral arguments in interstate relations.",
    url: "http://classics.mit.edu/Thucydides/pelopwar.5.fifth.html",
    urlLabel: "MIT Classics",
    readingTime: "20 min",
    searchQuery: "Peloponnesian War",
  },
  {
    title: "The Republic",
    author: "Plato",
    date: "c. 375 BCE",
    year: -375,
    era: 'Ancient',
    category: 'Scientific',
    description: "Plato's most famous dialogue explores justice, the ideal state, and the nature of reality through the Allegory of the Cave. It laid the philosophical foundations for Western political thought and metaphysics.",
    url: "https://www.gutenberg.org/ebooks/1497",
    urlLabel: "Project Gutenberg",
    readingTime: "8 hrs",
    searchQuery: "Plato",
  },
  {
    title: "Bhagavad Gita",
    author: "Vyasa (traditional attribution)",
    date: "c. 200 BCE",
    year: -200,
    era: 'Ancient',
    category: 'Religious',
    description: "A 700-verse Hindu scripture that is part of the epic Mahabharata, presenting a conversation between prince Arjuna and the god Krishna about duty, righteousness, and the nature of reality. One of the most influential texts in world philosophy.",
    url: "https://www.gutenberg.org/ebooks/2388",
    urlLabel: "Project Gutenberg",
    readingTime: "3 hrs",
    searchQuery: "Bhagavad Gita",
  },

  // ── Classical ──
  {
    title: "The Gallic Wars",
    author: "Julius Caesar",
    date: "c. 50 BCE",
    year: -50,
    era: 'Classical',
    category: 'Scientific',
    description: "Caesar's firsthand account of his military campaigns in Gaul is both a masterpiece of Latin prose and a deliberate work of political propaganda. It remains a primary source for understanding Roman military tactics and Celtic cultures.",
    url: "https://www.gutenberg.org/ebooks/10657",
    urlLabel: "Project Gutenberg",
    readingTime: "6 hrs",
    searchQuery: "Julius Caesar Gaul",
  },
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    date: "c. 170–180 CE",
    year: 175,
    era: 'Classical',
    category: 'Scientific',
    description: "The private philosophical journal of the Roman Emperor, written during military campaigns. These Stoic reflections on duty, mortality, and virtue were never intended for publication but became one of the most influential works of philosophy.",
    url: "https://www.gutenberg.org/ebooks/2680",
    urlLabel: "Project Gutenberg",
    readingTime: "4 hrs",
    searchQuery: "Marcus Aurelius",
  },
  {
    title: "The Edict of Milan",
    author: "Emperors Constantine I & Licinius",
    date: "313 CE",
    year: 313,
    era: 'Classical',
    category: 'Legal',
    description: "This imperial proclamation established religious tolerance throughout the Roman Empire, effectively ending the persecution of Christians. It marked a turning point in the history of Christianity and religious freedom.",
    url: "https://sourcebooks.fordham.edu/source/edict-milan.asp",
    urlLabel: "Fordham Sourcebooks",
    readingTime: "10 min",
    searchQuery: "Edict Milan Constantine",
  },
  {
    title: "The Quran",
    author: "Islamic tradition: revealed to Prophet Muhammad",
    date: "c. 609–632 CE",
    year: 632,
    era: 'Classical',
    category: 'Religious',
    description: "The central religious text of Islam, believed by Muslims to be the word of God as revealed to Muhammad. It profoundly shaped the legal, cultural, and spiritual life of over a billion people across centuries.",
    url: "https://www.gutenberg.org/ebooks/7440",
    urlLabel: "Project Gutenberg",
    readingTime: "20 hrs",
    searchQuery: "Islam Quran",
  },
  {
    title: "The Corpus Juris Civilis",
    author: "Emperor Justinian I",
    date: "529–534 CE",
    year: 534,
    era: 'Classical',
    category: 'Legal',
    description: "Justinian's codification of Roman law became the foundation of legal systems across continental Europe and much of the world. This monumental compilation preserved and systematized a millennium of Roman legal thought.",
    url: "https://www.gutenberg.org/ebooks/5983",
    urlLabel: "Project Gutenberg",
    readingTime: "15 hrs",
    searchQuery: "Justinian Roman law",
  },
  {
    title: "Confessions",
    author: "Augustine of Hippo",
    date: "c. 397–400 CE",
    year: 400,
    era: 'Classical',
    category: 'Religious',
    description: "Considered the first Western autobiography, Augustine's spiritual memoir traces his journey from youthful hedonism to Christian faith. It profoundly influenced Christian theology and the Western literary tradition of self-examination.",
    url: "https://www.gutenberg.org/ebooks/3296",
    urlLabel: "Project Gutenberg",
    readingTime: "8 hrs",
    searchQuery: "Augustine Hippo",
  },

  // ── Medieval ──
  {
    title: "Magna Carta",
    author: "King John of England and rebel barons",
    date: "1215",
    year: 1215,
    era: 'Medieval',
    category: 'Legal',
    description: "The 'Great Charter' limited royal authority and established the principle that even the king was subject to law. It became the cornerstone of English constitutional law and inspired democratic movements worldwide.",
    url: "https://avalon.law.yale.edu/medieval/magframe.asp",
    urlLabel: "Yale Avalon Project",
    readingTime: "30 min",
    searchQuery: "Magna Carta",
  },
  {
    title: "Summa Theologica",
    author: "Thomas Aquinas",
    date: "1265–1274",
    year: 1265,
    era: 'Medieval',
    category: 'Religious',
    description: "The most influential work of medieval scholastic philosophy, systematically addressing theology, ethics, and natural law. Aquinas' synthesis of Aristotelian philosophy with Christian doctrine shaped Catholic thought for centuries.",
    url: "https://www.gutenberg.org/ebooks/17611",
    urlLabel: "Project Gutenberg",
    readingTime: "200+ hrs",
    searchQuery: "Thomas Aquinas",
  },
  {
    title: "The Divine Comedy",
    author: "Dante Alighieri",
    date: "1308–1320",
    year: 1308,
    era: 'Medieval',
    category: 'Religious',
    description: "Dante's epic poem journeys through Hell, Purgatory, and Paradise, creating a comprehensive vision of the medieval afterlife. It established the Tuscan dialect as the literary language of Italy and remains a masterpiece of world literature.",
    url: "https://www.gutenberg.org/ebooks/8800",
    urlLabel: "Project Gutenberg",
    readingTime: "10 hrs",
    searchQuery: "Dante",
  },
  {
    title: "The Travels of Marco Polo",
    author: "Marco Polo (with Rustichello da Pisa)",
    date: "c. 1300",
    year: 1300,
    era: 'Medieval',
    category: 'Scientific',
    description: "Marco Polo's account of his 24-year journey through Asia introduced Europeans to the civilizations of China and the Mongol Empire. It inspired generations of explorers, including Christopher Columbus.",
    url: "https://www.gutenberg.org/ebooks/10636",
    urlLabel: "Project Gutenberg",
    readingTime: "8 hrs",
    searchQuery: "Marco Polo",
  },
  {
    title: "The Muqaddimah",
    author: "Ibn Khaldun",
    date: "1377",
    year: 1377,
    era: 'Medieval',
    category: 'Scientific',
    description: "Often called the first work of historiography and sociology, Ibn Khaldun's prolegomenon analyzed the rise and fall of civilizations through social cohesion ('asabiyyah'). It anticipated modern social science by centuries.",
    url: "https://www.gutenberg.org/ebooks/61456",
    urlLabel: "Project Gutenberg",
    readingTime: "30 hrs",
    searchQuery: "Ibn Khaldun",
  },
  {
    title: "The Charter of Manden (Kurukan Fuga)",
    author: "Sundiata Keita and assembly",
    date: "1236",
    year: 1236,
    era: 'Medieval',
    category: 'Constitution',
    description: "One of the earliest declarations of human rights, proclaimed at the founding of the Mali Empire. It addressed governance, social organization, and individual rights, including provisions against slavery and for freedom of speech.",
    url: "https://en.wikisource.org/wiki/Manden_Charter",
    urlLabel: "Wikisource",
    readingTime: "10 min",
    searchQuery: "Mali Empire Sundiata",
  },

  // ── Early Modern ──
  {
    title: "Ninety-Five Theses",
    author: "Martin Luther",
    date: "1517",
    year: 1517,
    era: 'Early Modern',
    category: 'Manifesto',
    description: "Luther's protest against the sale of indulgences, reportedly nailed to a church door in Wittenberg, ignited the Protestant Reformation. It fundamentally reshaped Christianity, European politics, and the concept of individual conscience.",
    url: "https://avalon.law.yale.edu/16th_century/luther001.asp",
    urlLabel: "Yale Avalon Project",
    readingTime: "20 min",
    searchQuery: "Martin Luther Reformation",
  },
  {
    title: "Two Treatises of Government",
    author: "John Locke",
    date: "1689",
    year: 1689,
    era: 'Early Modern',
    category: 'Scientific',
    description: "Locke's argument for natural rights, government by consent, and the right of revolution became the intellectual foundation of liberal democracy. It directly influenced the American and French Revolutions.",
    url: "https://www.gutenberg.org/ebooks/7370",
    urlLabel: "Project Gutenberg",
    readingTime: "8 hrs",
    searchQuery: "John Locke",
  },
  {
    title: "English Bill of Rights",
    author: "Parliament of England",
    date: "1689",
    year: 1689,
    era: 'Early Modern',
    category: 'Constitution',
    description: "Enacted after the Glorious Revolution, this act limited the power of the monarchy, guaranteed parliamentary supremacy, and enshrined civil liberties. It became a model for the US Bill of Rights a century later.",
    url: "https://avalon.law.yale.edu/17th_century/england.asp",
    urlLabel: "Yale Avalon Project",
    readingTime: "15 min",
    searchQuery: "English Bill of Rights 1689",
  },
  {
    title: "Treaty of Westphalia",
    author: "European powers",
    date: "1648",
    year: 1648,
    era: 'Early Modern',
    category: 'Treaty',
    description: "The peace treaties that ended the Thirty Years' War established the modern concept of state sovereignty and non-interference in domestic affairs. They created the framework for the modern international system of nation-states.",
    url: "https://avalon.law.yale.edu/17th_century/westphal.asp",
    urlLabel: "Yale Avalon Project",
    readingTime: "40 min",
    searchQuery: "Treaty Westphalia",
  },
  {
    title: "Principia Mathematica",
    author: "Isaac Newton",
    date: "1687",
    year: 1687,
    era: 'Early Modern',
    category: 'Scientific',
    description: "Newton's masterwork laid out the laws of motion and universal gravitation, unifying terrestrial and celestial mechanics. It is considered the single most important work in the history of science.",
    url: "https://www.gutenberg.org/ebooks/28233",
    urlLabel: "Project Gutenberg",
    readingTime: "20 hrs",
    searchQuery: "Isaac Newton",
  },
  {
    title: "The Wealth of Nations",
    author: "Adam Smith",
    date: "1776",
    year: 1776,
    era: 'Early Modern',
    category: 'Scientific',
    description: "Smith's foundational work of classical economics introduced concepts like the division of labor, free markets, and the 'invisible hand.' It provided the intellectual framework for modern capitalism and economic policy.",
    url: "https://www.gutenberg.org/ebooks/3300",
    urlLabel: "Project Gutenberg",
    readingTime: "30 hrs",
    searchQuery: "Adam Smith",
  },
  {
    title: "United States Declaration of Independence",
    author: "Thomas Jefferson et al.",
    date: "1776",
    year: 1776,
    era: 'Early Modern',
    category: 'Constitution',
    description: "The Declaration proclaimed the colonies' separation from Britain and articulated the revolutionary principle that 'all men are created equal' with unalienable rights. It became the most influential statement of democratic ideals in history.",
    url: "https://avalon.law.yale.edu/18th_century/declare.asp",
    urlLabel: "Yale Avalon Project",
    readingTime: "15 min",
    searchQuery: "Declaration Independence",
  },

  // ── Modern ──
  {
    title: "Declaration of the Rights of Man and of the Citizen",
    author: "National Constituent Assembly of France",
    date: "1789",
    year: 1789,
    era: 'Modern',
    category: 'Constitution',
    description: "Born from the French Revolution, this declaration established that men are born free and equal in rights. It became the foundation of French constitutional law and inspired human rights movements globally.",
    url: "https://avalon.law.yale.edu/18th_century/rightsof.asp",
    urlLabel: "Yale Avalon Project",
    readingTime: "10 min",
    searchQuery: "French Revolution Rights of Man",
  },
  {
    title: "The Federalist Papers",
    author: "Alexander Hamilton, James Madison, John Jay",
    date: "1787–1788",
    year: 1788,
    era: 'Modern',
    category: 'Constitution',
    description: "A collection of 85 essays arguing for ratification of the US Constitution, these papers remain the most authoritative commentary on American constitutional design. They articulate the theory of federalism, separation of powers, and checks and balances.",
    url: "https://avalon.law.yale.edu/subject_menus/fed.asp",
    urlLabel: "Yale Avalon Project",
    readingTime: "25 hrs",
    searchQuery: "Federalist Papers",
  },
  {
    title: "The Communist Manifesto",
    author: "Karl Marx & Friedrich Engels",
    date: "1848",
    year: 1848,
    era: 'Modern',
    category: 'Manifesto',
    description: "The most influential political pamphlet ever written, calling for workers of the world to unite against capitalist exploitation. It provided the ideological foundation for communist movements that reshaped the 20th century.",
    url: "https://www.marxists.org/archive/marx/works/1848/communist-manifesto/",
    urlLabel: "Marxists.org",
    readingTime: "1.5 hrs",
    searchQuery: "Communist Manifesto Marx",
  },
  {
    title: "On the Origin of Species",
    author: "Charles Darwin",
    date: "1859",
    year: 1859,
    era: 'Modern',
    category: 'Scientific',
    description: "Darwin's theory of evolution by natural selection revolutionized biology and our understanding of life on Earth. It remains one of the most consequential scientific works ever published, reshaping science, philosophy, and culture.",
    url: "https://www.gutenberg.org/ebooks/1228",
    urlLabel: "Project Gutenberg",
    readingTime: "12 hrs",
    searchQuery: "Darwin Origin Species",
  },
  {
    title: "Gettysburg Address",
    author: "Abraham Lincoln",
    date: "November 19, 1863",
    year: 1863,
    era: 'Modern',
    category: 'Speech',
    description: "In just 272 words, Lincoln redefined the Civil War as a struggle for equality and democratic self-government. It is the most quoted speech in American history and a masterpiece of political rhetoric.",
    url: "https://www.loc.gov/resource/rbpe.24404500/",
    urlLabel: "Library of Congress",
    readingTime: "2 min",
    searchQuery: "Gettysburg Address Lincoln",
  },
  {
    title: "Emancipation Proclamation",
    author: "Abraham Lincoln",
    date: "January 1, 1863",
    year: 1863,
    era: 'Modern',
    category: 'Legal',
    description: "Lincoln's executive order declared enslaved people in Confederate states to be free, transforming the Civil War into a fight for human liberty. It paved the way for the Thirteenth Amendment and the abolition of slavery in America.",
    url: "https://www.archives.gov/exhibits/featured-documents/emancipation-proclamation",
    urlLabel: "National Archives",
    readingTime: "10 min",
    searchQuery: "Emancipation Proclamation",
  },
  {
    title: "Treaty of Versailles",
    author: "Allied and Associated Powers",
    date: "June 28, 1919",
    year: 1919,
    era: 'Modern',
    category: 'Treaty',
    description: "The peace treaty ending World War I imposed harsh reparations on Germany and redrew the map of Europe. Its punitive terms are widely seen as contributing to the rise of Nazism and the outbreak of World War II.",
    url: "https://avalon.law.yale.edu/subject_menus/versailles_menu.asp",
    urlLabel: "Yale Avalon Project",
    readingTime: "4 hrs",
    searchQuery: "Treaty Versailles",
  },
  {
    title: "Fourteen Points",
    author: "Woodrow Wilson",
    date: "January 8, 1918",
    year: 1918,
    era: 'Modern',
    category: 'Speech',
    description: "Wilson's speech to Congress outlined his vision for post-war peace, including self-determination, open diplomacy, and a League of Nations. Though imperfectly realized, it shaped the liberal internationalist order that followed.",
    url: "https://avalon.law.yale.edu/20th_century/wilson14.asp",
    urlLabel: "Yale Avalon Project",
    readingTime: "15 min",
    searchQuery: "Fourteen Points Wilson",
  },

  // ── Contemporary ──
  {
    title: "Universal Declaration of Human Rights",
    author: "United Nations General Assembly",
    date: "December 10, 1948",
    year: 1948,
    era: 'Contemporary',
    category: 'Legal',
    description: "Drafted in the aftermath of World War II, this landmark document proclaimed fundamental human rights to be universally protected. It has been translated into over 500 languages and remains the foundation of international human rights law.",
    url: "https://www.un.org/en/about-us/universal-declaration-of-human-rights",
    urlLabel: "United Nations",
    readingTime: "15 min",
    searchQuery: "Universal Declaration Human Rights",
  },
  {
    title: '"We Shall Fight on the Beaches"',
    author: "Winston Churchill",
    date: "June 4, 1940",
    year: 1940,
    era: 'Contemporary',
    category: 'Speech',
    description: "Delivered after the Dunkirk evacuation, Churchill's defiant speech rallied Britain to resist Nazi Germany when the nation stood virtually alone. Its rhetoric became the symbol of British resolve during the darkest days of World War II.",
    url: "https://hansard.parliament.uk/commons/1940-06-04/debates/2a3ec587-19ad-4b2c-8a9e-4a01a72e7f72/WarSituation",
    urlLabel: "UK Parliament Hansard",
    readingTime: "20 min",
    searchQuery: "Churchill beaches speech",
  },
  {
    title: '"I Have a Dream"',
    author: "Martin Luther King Jr.",
    date: "August 28, 1963",
    year: 1963,
    era: 'Contemporary',
    category: 'Speech',
    description: "Delivered at the March on Washington, King's soaring oration called for an end to racism and envisioned a future of racial harmony. It became the defining moment of the American civil rights movement and one of history's greatest speeches.",
    url: "https://www.archives.gov/files/press/exhibits/dream-speech.pdf",
    urlLabel: "National Archives",
    readingTime: "10 min",
    searchQuery: "Martin Luther King Dream",
  },
  {
    title: "Letter from Birmingham Jail",
    author: "Martin Luther King Jr.",
    date: "April 16, 1963",
    year: 1963,
    era: 'Contemporary',
    category: 'Letter',
    description: "Written on smuggled scraps of paper while imprisoned for nonviolent protest, King's letter articulated the moral imperative of civil disobedience against unjust laws. It became a foundational text of the civil rights movement.",
    url: "https://www.africa.upenn.edu/Articles_Gen/Letter_Birmingham.html",
    urlLabel: "UPenn African Studies",
    readingTime: "25 min",
    searchQuery: "King Birmingham Jail",
  },
  {
    title: "Geneva Conventions",
    author: "International community",
    date: "August 12, 1949",
    year: 1949,
    era: 'Contemporary',
    category: 'Treaty',
    description: "Four treaties and three additional protocols established the standards of international law for humanitarian treatment in war. They protect wounded soldiers, prisoners of war, and civilians, forming the core of international humanitarian law.",
    url: "https://www.un.org/en/genocideprevention/documents/atrocity-crimes/Doc.33_GC-IV-EN.pdf",
    urlLabel: "United Nations",
    readingTime: "3 hrs",
    searchQuery: "Geneva Conventions",
  },
  {
    title: "Nelson Mandela's Inaugural Address",
    author: "Nelson Mandela",
    date: "May 10, 1994",
    year: 1994,
    era: 'Contemporary',
    category: 'Speech',
    description: "Mandela's inauguration as South Africa's first Black president marked the end of apartheid and the beginning of democratic governance. His speech called for reconciliation and a 'rainbow nation at peace with itself.'",
    url: "https://en.wikisource.org/wiki/Nelson_Mandela%27s_inaugural_address",
    urlLabel: "Wikisource",
    readingTime: "10 min",
    searchQuery: "Mandela inauguration",
  },
  {
    title: "Charter of the United Nations",
    author: "Founding member states",
    date: "June 26, 1945",
    year: 1945,
    era: 'Contemporary',
    category: 'Treaty',
    description: "The founding document of the United Nations established an international organization dedicated to maintaining peace, developing friendly relations among nations, and promoting social progress. It created the framework for modern multilateral diplomacy.",
    url: "https://www.un.org/en/about-us/un-charter/full-text",
    urlLabel: "United Nations",
    readingTime: "1 hr",
    searchQuery: "United Nations Charter",
  },
  {
    title: "On the Electrodynamics of Moving Bodies",
    author: "Albert Einstein",
    date: "1905",
    year: 1905,
    era: 'Contemporary',
    category: 'Scientific',
    description: "Einstein's paper introducing special relativity fundamentally changed our understanding of space, time, and energy (E=mc²). It overturned Newtonian mechanics for objects moving near the speed of light and reshaped modern physics.",
    url: "https://www.fourmilab.ch/etexts/einstein/specrel/specrel.pdf",
    urlLabel: "Fourmilab (English translation)",
    readingTime: "2 hrs",
    searchQuery: "Einstein relativity 1905",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Featured document — rotate by era
// ─────────────────────────────────────────────────────────────────────────────

const FEATURED: PrimarySource = SOURCES.find(s => s.title === 'Magna Carta')!;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function SourcesPage() {
  const [eraFilter, setEraFilter] = useState<Era | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<DocCategory | 'All'>('All');
  const [searchText, setSearchText] = useState('');

  const filtered = useMemo(() => {
    return SOURCES.filter(s => {
      if (eraFilter !== 'All' && s.era !== eraFilter) return false;
      if (categoryFilter !== 'All' && s.category !== categoryFilter) return false;
      if (searchText) {
        const q = searchText.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [eraFilter, categoryFilter, searchText]);

  // Group by era for display
  const groupedByEra = useMemo(() => {
    const groups: Partial<Record<Era, PrimarySource[]>> = {};
    for (const s of filtered) {
      if (!groups[s.era]) groups[s.era] = [];
      groups[s.era]!.push(s);
    }
    return groups;
  }, [filtered]);

  const totalCount = filtered.length;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#e2e8f0',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Nav bar */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>
          Chronicle
        </Link>
        <span style={{ color: '#475569' }}>/</span>
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Sources</span>
        <div style={{ flex: 1 }} />
        <Link to="/historians" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}>
          Historians
        </Link>
      </nav>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          padding: '48px 24px 32px',
          textAlign: 'center',
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: 0,
            background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Read the Original Words
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 16, marginTop: 12, lineHeight: 1.6 }}>
          Primary sources that shaped history — treaties, constitutions, speeches, manifestos,
          and scientific works, freely available to read online.
        </p>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>
          {SOURCES.length} documents spanning {ERAS.length} eras of human history
        </p>
      </motion.section>

      {/* Featured Document */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ maxWidth: 900, margin: '0 auto 32px', padding: '0 24px' }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${ERA_COLORS[FEATURED.era]}18, rgba(15,23,42,0.95))`,
            border: `1px solid ${ERA_COLORS[FEATURED.era]}40`,
            borderRadius: 12,
            padding: 28,
            display: 'flex',
            gap: 24,
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: `${ERA_COLORS[FEATURED.era]}25`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            {'\u2B50'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: ERA_COLORS[FEATURED.era],
                }}
              >
                Featured Document
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: `${CATEGORY_COLORS[FEATURED.category]}25`,
                  color: CATEGORY_COLORS[FEATURED.category],
                  fontWeight: 600,
                }}
              >
                {FEATURED.category}
              </span>
            </div>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700 }}>{FEATURED.title}</h2>
            <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: 13 }}>
              {FEATURED.author} &middot; {FEATURED.date} &middot; {FEATURED.readingTime} read
            </p>
            <p style={{ margin: '0 0 14px', color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
              {FEATURED.description}
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a
                href={FEATURED.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: ERA_COLORS[FEATURED.era],
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: `1px solid ${ERA_COLORS[FEATURED.era]}50`,
                  background: `${ERA_COLORS[FEATURED.era]}15`,
                  transition: 'all 150ms ease',
                }}
              >
                Read on {FEATURED.urlLabel} {'\u2197'}
              </a>
              <Link
                to={`/?q=${encodeURIComponent(FEATURED.searchQuery)}`}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#94a3b8',
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                Chronicle events {'\u2192'}
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Search & Filter Bar */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{
          maxWidth: 900,
          margin: '0 auto 32px',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            padding: '16px 20px',
            borderRadius: 10,
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Search input */}
          <input
            type="text"
            placeholder="Search documents..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              flex: '1 1 200px',
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#e2e8f0',
              fontSize: 13,
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
            }}
          />

          {/* Era filter */}
          <select
            value={eraFilter}
            onChange={(e) => setEraFilter(e.target.value as Era | 'All')}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(15,23,42,0.9)',
              color: '#e2e8f0',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <option value="All">All Eras</option>
            {ERAS.map((era) => (
              <option key={era} value={era}>{era}</option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as DocCategory | 'All')}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(15,23,42,0.9)',
              color: '#e2e8f0',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <option value="All">All Types</option>
            {DOC_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Count */}
          <span style={{ color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>
            {totalCount} document{totalCount !== 1 ? 's' : ''}
          </span>
        </div>
      </motion.section>

      {/* Era Sections */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 64px' }}>
        <AnimatePresence mode="wait">
          {ERAS.map((era) => {
            const sources = groupedByEra[era];
            if (!sources || sources.length === 0) return null;
            return (
              <motion.section
                key={era}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ marginBottom: 40 }}
              >
                {/* Era header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 20,
                    paddingBottom: 12,
                    borderBottom: `1px solid ${ERA_COLORS[era]}30`,
                  }}
                >
                  <div
                    style={{
                      width: 4,
                      height: 28,
                      borderRadius: 2,
                      background: ERA_COLORS[era],
                    }}
                  />
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: ERA_COLORS[era] }}>
                    {era}
                  </h2>
                  <span style={{ color: '#64748b', fontSize: 13 }}>
                    {sources.length} source{sources.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Source cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                    gap: 16,
                  }}
                >
                  {sources.map((source, i) => (
                    <SourceCard key={source.title} source={source} index={i} />
                  ))}
                </div>
              </motion.section>
            );
          })}
        </AnimatePresence>

        {totalCount === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
            <p style={{ fontSize: 16 }}>No documents match your filters.</p>
            <button
              onClick={() => {
                setEraFilter('All');
                setCategoryFilter('All');
                setSearchText('');
              }}
              style={{
                marginTop: 12,
                padding: '8px 16px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: 13,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SourceCard
// ─────────────────────────────────────────────────────────────────────────────

function SourceCard({ source, index }: { source: PrimarySource; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? ERA_COLORS[source.era] + '40' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 10,
        padding: 20,
        transition: 'all 150ms ease',
        cursor: 'default',
      }}
    >
      {/* Header: category badge + reading time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 4,
            background: `${CATEGORY_COLORS[source.category]}20`,
            color: CATEGORY_COLORS[source.category],
            letterSpacing: '0.03em',
          }}
        >
          {source.category}
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: '#64748b' }}>
          {source.readingTime} read
        </span>
      </div>

      {/* Title */}
      <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, lineHeight: 1.35 }}>
        {source.title}
      </h3>

      {/* Author & date */}
      <p style={{ margin: '0 0 10px', fontSize: 12, color: '#94a3b8' }}>
        {source.author} &middot; {source.date}
      </p>

      {/* Description */}
      <p style={{ margin: '0 0 14px', fontSize: 13, color: '#cbd5e1', lineHeight: 1.55 }}>
        {source.description}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: ERA_COLORS[source.era],
            textDecoration: 'none',
            padding: '5px 10px',
            borderRadius: 5,
            border: `1px solid ${ERA_COLORS[source.era]}40`,
            background: `${ERA_COLORS[source.era]}10`,
            transition: 'all 150ms ease',
          }}
        >
          {source.urlLabel} {'\u2197'}
        </a>
        <Link
          to={`/?q=${encodeURIComponent(source.searchQuery)}`}
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: '#94a3b8',
            textDecoration: 'none',
            padding: '5px 10px',
            borderRadius: 5,
            border: '1px solid rgba(255,255,255,0.08)',
            transition: 'all 150ms ease',
          }}
        >
          Chronicle events {'\u2192'}
        </Link>
      </div>
    </motion.div>
  );
}
