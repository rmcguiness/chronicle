/**
 * LiteraturePage — history of the written word from cuneiform to the modern novel.
 *
 * Route: /literature
 *
 * Self-contained thematic page with 40+ literary milestones.
 * Features: era/genre/origin filters, "Great Firsts" section, difficulty ratings.
 */

import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Era = 'Ancient' | 'Medieval' | 'Early Modern' | 'Enlightenment & Romantic' | 'Realism & Modernism' | 'Contemporary';
type Genre = 'Epic' | 'Poetry' | 'Religious' | 'Philosophy' | 'Drama' | 'Novel' | 'Satire' | 'Gothic' | 'Sci-Fi' | 'Magical Realism' | 'Fable' | 'Adventure' | 'Mythology';
type Difficulty = 'Accessible' | 'Moderate' | 'Challenging' | 'Demanding';

interface LiteraryWork {
  id: number;
  title: string;
  author: string;
  year: string;
  yearSort: number;
  origin: string;
  originFlag: string;
  era: Era;
  genre: Genre;
  whyItMatters: string;
  literaryFirst: string;
  difficulty: Difficulty;
  stillInPrint: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data — 42 literary milestones
// ─────────────────────────────────────────────────────────────────────────────

const WORKS: LiteraryWork[] = [
  // ANCIENT
  {
    id: 1, title: 'Epic of Gilgamesh', author: 'Unknown (Sumerian)', year: '~2100 BCE', yearSort: -2100,
    origin: 'Mesopotamia', originFlag: '🇮🇶', era: 'Ancient', genre: 'Epic',
    whyItMatters: 'The oldest surviving work of literature, predating Homer by over a millennium. Its themes of mortality, friendship, and the search for meaning remain universal.',
    literaryFirst: 'First epic poem in human history', difficulty: 'Moderate', stillInPrint: true,
  },
  {
    id: 2, title: 'Egyptian Book of the Dead', author: 'Various scribes', year: '~1550 BCE', yearSort: -1550,
    origin: 'Egypt', originFlag: '🇪🇬', era: 'Ancient', genre: 'Religious',
    whyItMatters: 'A collection of funerary spells guiding the dead through the afterlife. It reveals the spiritual sophistication of ancient Egyptian civilization.',
    literaryFirst: 'First illustrated manuscript tradition', difficulty: 'Challenging', stillInPrint: true,
  },
  {
    id: 3, title: 'Rigveda', author: 'Vedic rishis', year: '~1500 BCE', yearSort: -1500,
    origin: 'India', originFlag: '🇮🇳', era: 'Ancient', genre: 'Religious',
    whyItMatters: 'Among the oldest religious texts in any Indo-European language. Its 1,028 hymns shaped Hindu philosophy and Sanskrit literary tradition for millennia.',
    literaryFirst: 'Oldest Sanskrit literary composition', difficulty: 'Demanding', stillInPrint: true,
  },
  {
    id: 4, title: 'Iliad', author: 'Homer', year: '~800 BCE', yearSort: -800,
    origin: 'Greece', originFlag: '🇬🇷', era: 'Ancient', genre: 'Epic',
    whyItMatters: 'The foundation of Western literature. Homer\'s tale of the Trojan War established narrative conventions — character arcs, dramatic irony, simile — still used today.',
    literaryFirst: 'Foundation of the Western literary canon', difficulty: 'Challenging', stillInPrint: true,
  },
  {
    id: 5, title: 'Odyssey', author: 'Homer', year: '~800 BCE', yearSort: -799,
    origin: 'Greece', originFlag: '🇬🇷', era: 'Ancient', genre: 'Epic',
    whyItMatters: 'The archetypal journey narrative. Its structure — the hero\'s departure, trials, and homecoming — became the template for storytelling across all cultures.',
    literaryFirst: 'First journey/quest narrative', difficulty: 'Moderate', stillInPrint: true,
  },
  {
    id: 6, title: 'Aesop\'s Fables', author: 'Aesop', year: '~620 BCE', yearSort: -620,
    origin: 'Greece', originFlag: '🇬🇷', era: 'Ancient', genre: 'Fable',
    whyItMatters: 'Short moral tales using animals as characters created an entire literary genre. "The Tortoise and the Hare" and "The Boy Who Cried Wolf" remain in everyday speech.',
    literaryFirst: 'First known fable collection', difficulty: 'Accessible', stillInPrint: true,
  },
  {
    id: 7, title: 'Analects', author: 'Confucius (disciples)', year: '~479 BCE', yearSort: -479,
    origin: 'China', originFlag: '🇨🇳', era: 'Ancient', genre: 'Philosophy',
    whyItMatters: 'A collection of sayings and ideas attributed to Confucius that shaped East Asian philosophy, governance, and social ethics for over two millennia.',
    literaryFirst: 'Most influential philosophical dialogue in East Asia', difficulty: 'Moderate', stillInPrint: true,
  },
  {
    id: 8, title: 'Oedipus Rex', author: 'Sophocles', year: '429 BCE', yearSort: -429,
    origin: 'Greece', originFlag: '🇬🇷', era: 'Ancient', genre: 'Drama',
    whyItMatters: 'The masterwork of Greek tragedy, perfecting dramatic irony and the tragic hero. Aristotle cited it as the ideal tragedy; Freud named a complex after it.',
    literaryFirst: 'Perfected dramatic irony in theatre', difficulty: 'Moderate', stillInPrint: true,
  },
  {
    id: 9, title: 'Tao Te Ching', author: 'Laozi', year: '~400 BCE', yearSort: -400,
    origin: 'China', originFlag: '🇨🇳', era: 'Ancient', genre: 'Philosophy',
    whyItMatters: 'In just 81 brief chapters, it distills the essence of Taoist philosophy. One of the most translated works in world literature after the Bible.',
    literaryFirst: 'Most concise foundational philosophical text', difficulty: 'Moderate', stillInPrint: true,
  },
  {
    id: 10, title: 'Mahabharata', author: 'Vyasa (traditional)', year: '~400 BCE', yearSort: -400,
    origin: 'India', originFlag: '🇮🇳', era: 'Ancient', genre: 'Epic',
    whyItMatters: 'At ~1.8 million words, it is the longest epic poem ever composed. It contains the Bhagavad Gita and explores duty, war, and dharma with unmatched scope.',
    literaryFirst: 'Longest literary work in human history', difficulty: 'Demanding', stillInPrint: true,
  },
  {
    id: 11, title: 'Ramayana', author: 'Valmiki', year: '~300 BCE', yearSort: -300,
    origin: 'India', originFlag: '🇮🇳', era: 'Ancient', genre: 'Epic',
    whyItMatters: 'One of the two great Sanskrit epics, the Ramayana shaped art, theatre, and moral philosophy across South and Southeast Asia for over two millennia.',
    literaryFirst: 'First poem (Adi Kavya) in Sanskrit tradition', difficulty: 'Moderate', stillInPrint: true,
  },
  {
    id: 12, title: 'Aeneid', author: 'Virgil', year: '19 BCE', yearSort: -19,
    origin: 'Rome', originFlag: '🇮🇹', era: 'Ancient', genre: 'Epic',
    whyItMatters: 'Rome\'s national epic linked Roman civilization to Trojan legend. Its literary craftsmanship influenced Dante, Milton, and the entire Western epic tradition.',
    literaryFirst: 'First "literary" (authored) epic vs. oral tradition', difficulty: 'Challenging', stillInPrint: true,
  },
  {
    id: 13, title: 'Metamorphoses', author: 'Ovid', year: '8 CE', yearSort: 8,
    origin: 'Rome', originFlag: '🇮🇹', era: 'Ancient', genre: 'Mythology',
    whyItMatters: 'A sweeping narrative poem retelling 250 Greek and Roman myths. It became the primary source of classical mythology for the entire Renaissance and beyond.',
    literaryFirst: 'First comprehensive mythological anthology', difficulty: 'Moderate', stillInPrint: true,
  },

  // MEDIEVAL
  {
    id: 14, title: 'Quran', author: 'Revelation to Muhammad', year: '632 CE', yearSort: 632,
    origin: 'Arabia', originFlag: '🇸🇦', era: 'Medieval', genre: 'Religious',
    whyItMatters: 'The central religious text of Islam, considered the finest work of classical Arabic literature. Its linguistic standard defined Arabic grammar and literary style.',
    literaryFirst: 'Established classical Arabic as a literary language', difficulty: 'Challenging', stillInPrint: true,
  },
  {
    id: 15, title: 'One Thousand and One Nights', author: 'Various (compiled)', year: '~800 CE', yearSort: 800,
    origin: 'Persia / Arabia', originFlag: '🇮🇷', era: 'Medieval', genre: 'Adventure',
    whyItMatters: 'A frame story containing tales within tales — Aladdin, Sinbad, Ali Baba. It pioneered the narrative frame device and influenced storytelling worldwide.',
    literaryFirst: 'First major frame narrative / story-within-a-story', difficulty: 'Accessible', stillInPrint: true,
  },
  {
    id: 16, title: 'Beowulf', author: 'Unknown (Anglo-Saxon)', year: '~900 CE', yearSort: 900,
    origin: 'England', originFlag: '🇬🇧', era: 'Medieval', genre: 'Epic',
    whyItMatters: 'The oldest surviving long poem in Old English. It preserves Germanic heroic legend and established English as a literary language centuries before Chaucer.',
    literaryFirst: 'Oldest surviving English-language epic', difficulty: 'Demanding', stillInPrint: true,
  },
  {
    id: 17, title: 'The Tale of Genji', author: 'Murasaki Shikibu', year: '~1010 CE', yearSort: 1010,
    origin: 'Japan', originFlag: '🇯🇵', era: 'Medieval', genre: 'Novel',
    whyItMatters: 'Often called the world\'s first novel, written by a lady-in-waiting at the Heian court. Its psychological depth and narrative sophistication were centuries ahead of Europe.',
    literaryFirst: 'First novel in world literature; first major female author', difficulty: 'Challenging', stillInPrint: true,
  },
  {
    id: 18, title: 'Divine Comedy', author: 'Dante Alighieri', year: '1320', yearSort: 1320,
    origin: 'Italy', originFlag: '🇮🇹', era: 'Medieval', genre: 'Poetry',
    whyItMatters: 'Dante\'s journey through Hell, Purgatory, and Paradise defined Italian as a literary language and shaped Western conceptions of the afterlife.',
    literaryFirst: 'First major literary work in a vernacular (Italian) instead of Latin', difficulty: 'Challenging', stillInPrint: true,
  },
  {
    id: 19, title: 'Canterbury Tales', author: 'Geoffrey Chaucer', year: '~1390', yearSort: 1390,
    origin: 'England', originFlag: '🇬🇧', era: 'Medieval', genre: 'Poetry',
    whyItMatters: 'A vivid cross-section of medieval English society told through pilgrims\' stories. Chaucer established Middle English as a literary language, earning the title "Father of English literature."',
    literaryFirst: 'First major work of English literature in the vernacular', difficulty: 'Challenging', stillInPrint: true,
  },
  {
    id: 20, title: 'Le Morte d\'Arthur', author: 'Thomas Malory', year: '1485', yearSort: 1485,
    origin: 'England', originFlag: '🇬🇧', era: 'Medieval', genre: 'Adventure',
    whyItMatters: 'The definitive compilation of Arthurian legend in English prose. It fixed the Knights of the Round Table, the Holy Grail, and Camelot in the Western imagination.',
    literaryFirst: 'First major English prose work printed by Caxton\'s press', difficulty: 'Moderate', stillInPrint: true,
  },

  // EARLY MODERN
  {
    id: 21, title: 'Collected Works (plays & sonnets)', author: 'William Shakespeare', year: '1590-1613', yearSort: 1600,
    origin: 'England', originFlag: '🇬🇧', era: 'Early Modern', genre: 'Drama',
    whyItMatters: 'Shakespeare invented over 1,700 English words and wrote 37 plays spanning comedy, tragedy, and history. No single author has had a greater impact on the English language.',
    literaryFirst: 'Most influential dramatist in any language', difficulty: 'Moderate', stillInPrint: true,
  },
  {
    id: 22, title: 'Don Quixote', author: 'Miguel de Cervantes', year: '1605', yearSort: 1605,
    origin: 'Spain', originFlag: '🇪🇸', era: 'Early Modern', genre: 'Novel',
    whyItMatters: 'Widely considered the first modern novel. By parodying chivalric romance, Cervantes invented literary realism, the unreliable narrator, and metafiction.',
    literaryFirst: 'First modern novel; invented literary realism', difficulty: 'Moderate', stillInPrint: true,
  },
  {
    id: 23, title: 'Paradise Lost', author: 'John Milton', year: '1667', yearSort: 1667,
    origin: 'England', originFlag: '🇬🇧', era: 'Early Modern', genre: 'Epic',
    whyItMatters: 'Milton\'s blank verse epic retelling the Fall of Man became the greatest long poem in English. Its sympathetic portrayal of Satan influenced Romantic literature.',
    literaryFirst: 'Greatest English-language epic poem', difficulty: 'Demanding', stillInPrint: true,
  },
  {
    id: 24, title: 'Robinson Crusoe', author: 'Daniel Defoe', year: '1719', yearSort: 1719,
    origin: 'England', originFlag: '🇬🇧', era: 'Early Modern', genre: 'Novel',
    whyItMatters: 'Often called the first English novel, it pioneered realistic fiction told in first person. It launched the castaway genre and the modern adventure novel.',
    literaryFirst: 'First English novel; first-person realistic fiction', difficulty: 'Accessible', stillInPrint: true,
  },

  // ENLIGHTENMENT & ROMANTIC
  {
    id: 25, title: 'Gulliver\'s Travels', author: 'Jonathan Swift', year: '1726', yearSort: 1726,
    origin: 'Ireland', originFlag: '🇮🇪', era: 'Enlightenment & Romantic', genre: 'Satire',
    whyItMatters: 'A masterpiece of political satire disguised as a travel narrative. Swift\'s savage wit targeting human folly pioneered satirical science fiction.',
    literaryFirst: 'First major satirical novel; proto-science fiction', difficulty: 'Moderate', stillInPrint: true,
  },
  {
    id: 26, title: 'Candide', author: 'Voltaire', year: '1759', yearSort: 1759,
    origin: 'France', originFlag: '🇫🇷', era: 'Enlightenment & Romantic', genre: 'Satire',
    whyItMatters: 'A razor-sharp novella attacking philosophical optimism. Voltaire\'s wit made complex Enlightenment ideas accessible and entertaining to a mass audience.',
    literaryFirst: 'Landmark of Enlightenment philosophical fiction', difficulty: 'Accessible', stillInPrint: true,
  },
  {
    id: 27, title: 'Pride and Prejudice', author: 'Jane Austen', year: '1813', yearSort: 1813,
    origin: 'England', originFlag: '🇬🇧', era: 'Enlightenment & Romantic', genre: 'Novel',
    whyItMatters: 'Austen perfected the novel of manners with razor-sharp social observation and free indirect discourse. It proved women\'s domestic fiction could be high art.',
    literaryFirst: 'Pioneered free indirect discourse in the English novel', difficulty: 'Accessible', stillInPrint: true,
  },
  {
    id: 28, title: 'Frankenstein', author: 'Mary Shelley', year: '1818', yearSort: 1818,
    origin: 'England', originFlag: '🇬🇧', era: 'Enlightenment & Romantic', genre: 'Gothic',
    whyItMatters: 'Written when Shelley was just 18, it launched both science fiction and the modern horror genre. Its questions about creation and responsibility remain urgent.',
    literaryFirst: 'First science fiction novel', difficulty: 'Moderate', stillInPrint: true,
  },
  {
    id: 29, title: 'Notre-Dame de Paris', author: 'Victor Hugo', year: '1831', yearSort: 1831,
    origin: 'France', originFlag: '🇫🇷', era: 'Enlightenment & Romantic', genre: 'Novel',
    whyItMatters: 'Hugo\'s gothic romance saved the real Notre-Dame cathedral from demolition by sparking a preservation movement. It proved novels could change public policy.',
    literaryFirst: 'First novel to directly trigger an architectural preservation movement', difficulty: 'Moderate', stillInPrint: true,
  },
  {
    id: 30, title: 'Moby-Dick', author: 'Herman Melville', year: '1851', yearSort: 1851,
    origin: 'United States', originFlag: '🇺🇸', era: 'Enlightenment & Romantic', genre: 'Novel',
    whyItMatters: 'A commercial failure upon publication, it is now considered the Great American Novel. Its encyclopaedic style and symbolic depth foreshadowed literary modernism.',
    literaryFirst: 'Pioneered the encyclopaedic novel form', difficulty: 'Demanding', stillInPrint: true,
  },

  // REALISM & MODERNISM
  {
    id: 31, title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', year: '1866', yearSort: 1866,
    origin: 'Russia', originFlag: '🇷🇺', era: 'Realism & Modernism', genre: 'Novel',
    whyItMatters: 'A psychological novel exploring guilt, morality, and redemption. Dostoevsky\'s deep dive into a murderer\'s psyche invented the modern psychological thriller.',
    literaryFirst: 'First psychological crime novel', difficulty: 'Challenging', stillInPrint: true,
  },
  {
    id: 32, title: 'War and Peace', author: 'Leo Tolstoy', year: '1869', yearSort: 1869,
    origin: 'Russia', originFlag: '🇷🇺', era: 'Realism & Modernism', genre: 'Novel',
    whyItMatters: 'An epic interweaving five aristocratic families against the Napoleonic Wars. Often called the greatest novel ever written, it redefined the scope of realistic fiction.',
    literaryFirst: 'Redefined the historical novel at unprecedented scale', difficulty: 'Demanding', stillInPrint: true,
  },
  {
    id: 33, title: 'Adventures of Huckleberry Finn', author: 'Mark Twain', year: '1884', yearSort: 1884,
    origin: 'United States', originFlag: '🇺🇸', era: 'Realism & Modernism', genre: 'Novel',
    whyItMatters: 'Hemingway said "all modern American literature comes from" this book. Twain\'s use of vernacular narration and racial critique transformed American fiction.',
    literaryFirst: 'First major novel written entirely in American vernacular', difficulty: 'Accessible', stillInPrint: true,
  },
  {
    id: 34, title: 'The Strange Case of Dr Jekyll and Mr Hyde', author: 'Robert Louis Stevenson', year: '1886', yearSort: 1886,
    origin: 'Scotland', originFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', era: 'Realism & Modernism', genre: 'Gothic',
    whyItMatters: 'A novella that gave the English language a metaphor for the duality of human nature. It influenced psychology (predating Freud\'s id/ego) and spawned the modern horror genre.',
    literaryFirst: 'Defined the literary doppelganger / split-personality trope', difficulty: 'Accessible', stillInPrint: true,
  },
  {
    id: 35, title: 'Ulysses', author: 'James Joyce', year: '1922', yearSort: 1922,
    origin: 'Ireland', originFlag: '🇮🇪', era: 'Realism & Modernism', genre: 'Novel',
    whyItMatters: 'Joyce\'s stream-of-consciousness masterpiece mapped one day in Dublin with unprecedented interior depth. It shattered narrative convention and redefined what a novel could be.',
    literaryFirst: 'Landmark of stream-of-consciousness technique', difficulty: 'Demanding', stillInPrint: true,
  },
  {
    id: 36, title: 'Mrs Dalloway', author: 'Virginia Woolf', year: '1925', yearSort: 1925,
    origin: 'England', originFlag: '🇬🇧', era: 'Realism & Modernism', genre: 'Novel',
    whyItMatters: 'Woolf perfected interior monologue and free indirect discourse in a single day\'s narration. It explored PTSD, sexuality, and class with radical formal innovation.',
    literaryFirst: 'Pioneered dual-consciousness narrative structure', difficulty: 'Challenging', stillInPrint: true,
  },
  {
    id: 37, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: '1925', yearSort: 1925,
    origin: 'United States', originFlag: '🇺🇸', era: 'Realism & Modernism', genre: 'Novel',
    whyItMatters: 'A slim, devastating critique of the American Dream. Initially a modest seller, it became the most widely read American novel of the 20th century after WWII.',
    literaryFirst: 'Definitive fictional critique of the American Dream', difficulty: 'Accessible', stillInPrint: true,
  },
  {
    id: 38, title: 'Nineteen Eighty-Four', author: 'George Orwell', year: '1949', yearSort: 1949,
    origin: 'England', originFlag: '🇬🇧', era: 'Realism & Modernism', genre: 'Sci-Fi',
    whyItMatters: 'Orwell\'s dystopia gave us "Big Brother," "doublethink," and "thoughtcrime." It remains the most influential political novel ever written, its vocabulary entering everyday speech.',
    literaryFirst: 'Defined the dystopian novel genre', difficulty: 'Accessible', stillInPrint: true,
  },
  {
    id: 39, title: 'One Hundred Years of Solitude', author: 'Gabriel Garcia Marquez', year: '1967', yearSort: 1967,
    origin: 'Colombia', originFlag: '🇨🇴', era: 'Realism & Modernism', genre: 'Magical Realism',
    whyItMatters: 'The defining work of magical realism, blending the fantastical with the mundane. It put Latin American literature on the world stage and won Marquez the Nobel Prize.',
    literaryFirst: 'Landmark of magical realism; catalysed the Latin American Boom', difficulty: 'Moderate', stillInPrint: true,
  },
  {
    id: 40, title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', year: '1979', yearSort: 1979,
    origin: 'England', originFlag: '🇬🇧', era: 'Realism & Modernism', genre: 'Sci-Fi',
    whyItMatters: 'Adams proved science fiction could be hilariously funny. "42" as the answer to life, the universe, and everything became a cultural touchstone for geek culture worldwide.',
    literaryFirst: 'Defined comedic science fiction as a genre', difficulty: 'Accessible', stillInPrint: true,
  },

  // CONTEMPORARY
  {
    id: 41, title: 'Beloved', author: 'Toni Morrison', year: '1987', yearSort: 1987,
    origin: 'United States', originFlag: '🇺🇸', era: 'Contemporary', genre: 'Novel',
    whyItMatters: 'Morrison\'s ghost story about the legacy of slavery won the Pulitzer and helped earn her the Nobel Prize. It redefined how American literature confronts racial trauma.',
    literaryFirst: 'Landmark of African-American literary fiction', difficulty: 'Challenging', stillInPrint: true,
  },
  {
    id: 42, title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', year: '1997', yearSort: 1997,
    origin: 'England', originFlag: '🇬🇧', era: 'Contemporary', genre: 'Novel',
    whyItMatters: 'Sparked a global reading phenomenon, selling 500+ million copies across the series. It proved children\'s literature could be a dominant cultural and commercial force.',
    literaryFirst: 'Largest-selling book series in history', difficulty: 'Accessible', stillInPrint: true,
  },
  {
    id: 43, title: 'The Kite Runner', author: 'Khaled Hosseini', year: '2003', yearSort: 2003,
    origin: 'Afghanistan / United States', originFlag: '🇦🇫', era: 'Contemporary', genre: 'Novel',
    whyItMatters: 'The first Afghan novel published in English became a global bestseller. It humanised Afghanistan for Western readers during a period of war and misunderstanding.',
    literaryFirst: 'First major Afghan novel in English', difficulty: 'Accessible', stillInPrint: true,
  },
  {
    id: 44, title: 'Kindle & the Rise of E-books', author: 'Amazon / Industry shift', year: '2007', yearSort: 2007,
    origin: 'United States', originFlag: '🇺🇸', era: 'Contemporary', genre: 'Novel',
    whyItMatters: 'The Kindle launched in 2007 and by 2011 e-book sales surpassed print on Amazon. The shift democratised publishing and enabled the self-publishing revolution.',
    literaryFirst: 'First mass-market dedicated e-reader', difficulty: 'Accessible', stillInPrint: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Great Firsts
// ─────────────────────────────────────────────────────────────────────────────

interface LiteraryFirst {
  label: string;
  work: string;
  author: string;
  year: string;
  detail: string;
}

const GREAT_FIRSTS: LiteraryFirst[] = [
  { label: 'First Epic', work: 'Epic of Gilgamesh', author: 'Unknown', year: '~2100 BCE', detail: 'The oldest surviving narrative poem in human history' },
  { label: 'First Novel', work: 'The Tale of Genji', author: 'Murasaki Shikibu', year: '~1010 CE', detail: 'Written by a Japanese noblewoman at the Heian court' },
  { label: 'First Modern Novel', work: 'Don Quixote', author: 'Cervantes', year: '1605', detail: 'Invented literary realism, metafiction, and the unreliable narrator' },
  { label: 'First English Novel', work: 'Robinson Crusoe', author: 'Defoe', year: '1719', detail: 'Pioneered first-person realistic fiction in English' },
  { label: 'First Female Author (major)', work: 'The Tale of Genji', author: 'Murasaki Shikibu', year: '~1010 CE', detail: 'The first great female novelist in any language' },
  { label: 'First Science Fiction', work: 'Frankenstein', author: 'Mary Shelley', year: '1818', detail: 'Written by an 18-year-old woman; launched an entire genre' },
  { label: 'First Dystopian Novel', work: 'Nineteen Eighty-Four', author: 'George Orwell', year: '1949', detail: 'Defined the genre and gave us "Big Brother" and "doublethink"' },
  { label: 'First Magical Realism', work: 'One Hundred Years of Solitude', author: 'Garcia Marquez', year: '1967', detail: 'Put Latin American fiction on the global literary map' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Filter options
// ─────────────────────────────────────────────────────────────────────────────

const ERAS: Era[] = ['Ancient', 'Medieval', 'Early Modern', 'Enlightenment & Romantic', 'Realism & Modernism', 'Contemporary'];
const GENRES: Genre[] = ['Epic', 'Poetry', 'Religious', 'Philosophy', 'Drama', 'Novel', 'Satire', 'Gothic', 'Sci-Fi', 'Magical Realism', 'Fable', 'Adventure', 'Mythology'];

const ERA_COLORS: Record<Era, string> = {
  'Ancient': '#f59e0b',
  'Medieval': '#ef4444',
  'Early Modern': '#a855f7',
  'Enlightenment & Romantic': '#3b82f6',
  'Realism & Modernism': '#22c55e',
  'Contemporary': '#ec4899',
};

const GENRE_COLORS: Record<Genre, string> = {
  'Epic': '#f59e0b',
  'Poetry': '#a855f7',
  'Religious': '#eab308',
  'Philosophy': '#6366f1',
  'Drama': '#ef4444',
  'Novel': '#3b82f6',
  'Satire': '#14b8a6',
  'Gothic': '#6b7280',
  'Sci-Fi': '#22c55e',
  'Magical Realism': '#ec4899',
  'Fable': '#f97316',
  'Adventure': '#0ea5e9',
  'Mythology': '#d946ef',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  'Accessible': '#22c55e',
  'Moderate': '#3b82f6',
  'Challenging': '#f59e0b',
  'Demanding': '#ef4444',
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

function SectionWrapper({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function MetaBadge({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 13,
        color,
        padding: '4px 10px',
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {icon} {label}
    </span>
  );
}

// ── Filter Bar ──────────────────────────────────────────────────────────────

interface FilterBarProps {
  selectedEra: Era | 'All';
  selectedGenre: Genre | 'All';
  onEraChange: (era: Era | 'All') => void;
  onGenreChange: (genre: Genre | 'All') => void;
}

function FilterBar({ selectedEra, selectedGenre, onEraChange, onGenreChange }: FilterBarProps) {
  return (
    <section style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Era filters */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, fontWeight: 700 }}>
          Era
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(['All', ...ERAS] as const).map((era) => {
            const active = selectedEra === era;
            const color = era === 'All' ? '#94a3b8' : ERA_COLORS[era];
            return (
              <button
                key={era}
                onClick={() => onEraChange(era)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
                  backgroundColor: active ? `${color}22` : 'transparent',
                  color: active ? color : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {era}
              </button>
            );
          })}
        </div>
      </div>

      {/* Genre filters */}
      <div>
        <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, fontWeight: 700 }}>
          Genre
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(['All', ...GENRES] as const).map((genre) => {
            const active = selectedGenre === genre;
            const color = genre === 'All' ? '#94a3b8' : GENRE_COLORS[genre];
            return (
              <button
                key={genre}
                onClick={() => onGenreChange(genre)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
                  backgroundColor: active ? `${color}22` : 'transparent',
                  color: active ? color : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Work Card ───────────────────────────────────────────────────────────────

function WorkCard({ work, index }: { work: LiteraryWork; index: number }) {
  const eraColor = ERA_COLORS[work.era];
  const genreColor = GENRE_COLORS[work.genre];
  const diffColor = DIFFICULTY_COLORS[work.difficulty];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: Math.min(index * 0.04, 0.8), duration: 0.35, ease: 'easeOut' }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid ${eraColor}33`,
        borderRadius: 12,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Top row: badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        {/* Origin flag */}
        <span style={{ fontSize: 18 }} title={work.origin}>{work.originFlag}</span>

        {/* Era badge */}
        <span
          style={{
            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
            backgroundColor: `${eraColor}22`, color: eraColor,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}
        >
          {work.era}
        </span>

        {/* Genre badge */}
        <span
          style={{
            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
            backgroundColor: `${genreColor}22`, color: genreColor,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}
        >
          {work.genre}
        </span>

        {/* Still in print */}
        {work.stillInPrint && (
          <span
            style={{
              fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 4,
              backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}
          >
            Still in Print
          </span>
        )}
      </div>

      {/* Title + author */}
      <div>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.3 }}>
          {work.title}
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 3 }}>
          {work.author} &middot; {work.year}
        </div>
      </div>

      {/* Why it matters */}
      <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.65 }}>
        {work.whyItMatters}
      </div>

      {/* Literary first */}
      <div
        style={{
          fontSize: 12, color: '#a78bfa', fontStyle: 'italic',
          padding: '8px 12px', borderRadius: 6,
          backgroundColor: 'rgba(167,139,250,0.08)',
          border: '1px solid rgba(167,139,250,0.15)',
        }}
      >
        {work.literaryFirst}
      </div>

      {/* Difficulty */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 4 }}>
        <span style={{ fontSize: 11, color: '#475569' }}>Difficulty:</span>
        <span
          style={{
            fontSize: 11, fontWeight: 700, color: diffColor,
            padding: '2px 8px', borderRadius: 4,
            backgroundColor: `${diffColor}15`,
          }}
        >
          {work.difficulty}
        </span>
      </div>
    </motion.div>
  );
}

// ── Great Firsts Section ────────────────────────────────────────────────────

function GreatFirstsSection() {
  return (
    <SectionWrapper title="Great Firsts in Literature" icon="&#127942;">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 12,
        }}
      >
        {GREAT_FIRSTS.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
            style={{
              padding: '14px 16px',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(167,139,250,0.2)',
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              {f.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>
              {f.work}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
              {f.author} &middot; {f.year}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
              {f.detail}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

export default function LiteraturePage() {
  const [selectedEra, setSelectedEra] = useState<Era | 'All'>('All');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');

  // Override body overflow for scrolling
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    if (root) root.style.overflow = 'auto';
    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      if (root) root.style.overflow = '';
    };
  }, []);

  const filtered = useMemo(() => {
    return WORKS
      .filter((w) => selectedEra === 'All' || w.era === selectedEra)
      .filter((w) => selectedGenre === 'All' || w.genre === selectedGenre)
      .sort((a, b) => a.yearSort - b.yearSort);
  }, [selectedEra, selectedGenre]);

  return (
    <PageShell>
      {/* Hero */}
      <div
        style={{
          padding: '40px 32px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(167,139,250,0.08) 100%)',
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
            marginBottom: 24,
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        >
          &#8592; Back to Timeline
        </Link>

        <h1
          style={{
            fontSize: 'clamp(24px, 5vw, 40px)',
            fontWeight: 800,
            color: '#f1f5f9',
            lineHeight: 1.15,
            marginBottom: 12,
          }}
        >
          History of Literature
        </h1>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6, maxWidth: 640, marginBottom: 20 }}>
          From cuneiform tablets to e-readers &mdash; 4,000 years of the written word.
          The works that shaped languages, toppled empires, and changed how humanity thinks.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <MetaBadge icon="&#128218;" label={`${WORKS.length} Works`} color="#a78bfa" />
          <MetaBadge icon="&#127758;" label="15+ Countries" color="#94a3b8" />
          <MetaBadge icon="&#128336;" label="2100 BCE - 2007 CE" color="#94a3b8" />
          <MetaBadge icon="&#128279;" label="Primary Texts" color="#60a5fa" />
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        selectedEra={selectedEra}
        selectedGenre={selectedGenre}
        onEraChange={setSelectedEra}
        onGenreChange={setSelectedGenre}
      />

      {/* Results count */}
      <div style={{ padding: '16px 32px 0', fontSize: 13, color: '#64748b' }}>
        Showing {filtered.length} of {WORKS.length} works
      </div>

      {/* Timeline */}
      <SectionWrapper title="Literary Timeline" icon="&#128220;">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((work, i) => (
              <WorkCard key={work.id} work={work} index={i} />
            ))}
          </AnimatePresence>
        </div>
        {filtered.length === 0 && (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: '#475569',
              fontSize: 14,
              fontStyle: 'italic',
            }}
          >
            No works match the selected filters.
          </div>
        )}
      </SectionWrapper>

      {/* Great Firsts */}
      <GreatFirstsSection />

      {/* Footer */}
      <div style={{ padding: '24px 32px', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: '#60a5fa',
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: 8,
            border: '1px solid rgba(96,165,250,0.3)',
            backgroundColor: 'rgba(96,165,250,0.08)',
          }}
        >
          &#8592; Back to Timeline
        </Link>
      </div>
    </PageShell>
  );
}
