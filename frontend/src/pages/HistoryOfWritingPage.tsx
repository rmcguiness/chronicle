/**
 * HistoryOfWritingPage — comprehensive deep-dive on the History of Writing Systems
 * (c. 35,000 BCE – Present).
 *
 * Route: /history-of-writing
 *
 * Sections:
 *  1. Hero — headline, key stats bar
 *  2. Before Writing — tally marks, cave paintings, tokens
 *  3. Sumerian Cuneiform — earliest writing, clay tablets
 *  4. Egyptian Hieroglyphics — sacred carvings, Rosetta Stone
 *  5. Chinese Writing — oracle bones, logographic system
 *  6. Phoenician Alphabet — 22 consonants, ancestor of Western alphabets
 *  7. Greek Alphabet — added vowels, left-to-right
 *  8. Latin Script — Roman Empire, modern scripts
 *  9. Arabic Script — right-to-left, spread with Islam
 * 10. Gutenberg's Printing Press — movable type, mass literacy
 * 11. Modern Era — typewriter, keyboard, digital text
 * 12. Internet & Emoji — text messaging, neo-pictographs
 * 13. Lost & Undeciphered Scripts — Linear A, Indus Valley, Proto-Sinaitic
 * 14. "King" in Ancient Scripts — interactive comparison
 * 15. Impact — how writing changed civilization
 * 16. Script Comparison Table
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const AMBER = '#d97706';
const BLUE = '#3b82f6';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const CRIMSON = '#dc2626';
const ORANGE = '#f97316';
const EMERALD = '#10b981';
const SKY = '#38bdf8';
const VIOLET = '#8b5cf6';
const CYAN = '#06b6d4';
const SAND = '#d4a574';
const TERRACOTTA = '#c2410c';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  color: string;
}

interface InsightEntry {
  label: string;
  detail: string;
}

interface ScriptComparisonRow {
  script: string;
  origin: string;
  type: string;
  direction: string;
  characters: string;
  usersToday: string;
  color: string;
}

interface AncientKingEntry {
  script: string;
  word: string;
  transliteration: string;
  color: string;
}

// ── Key Stats ───────────────────────────────────────────────────────────────

const KEY_STATS = [
  { value: '3,900+', label: 'Active writing systems' },
  { value: '3', label: 'Scripts used by >1B people' },
  { value: '1,400 yrs', label: 'Cuneiform to first alphabet' },
  { value: '776M', label: 'Adults still illiterate (UNESCO)' },
];

// ── Before Writing ──────────────────────────────────────────────────────────

const BEFORE_WRITING_INSIGHTS: InsightEntry[] = [
  {
    label: 'Cave Paintings (c. 35,000 BCE)',
    detail:
      'Long before writing, humans painted elaborate scenes on cave walls at Lascaux, Altamira, and Chauvet. These were not random doodles — they depicted animals, hunting scenes, and abstract symbols with remarkable sophistication. Some scholars interpret recurring symbols (dots, lines, hand stencils) as proto-communication systems: an attempt to record information and transmit it across time. The leap from "I see a bison" to "I will draw a bison so others can see it later" was the conceptual seed of writing.',
  },
  {
    label: 'Tally Marks (c. 30,000 BCE)',
    detail:
      'The Lebombo Bone (c. 43,000 BCE) and Ishango Bone (c. 18,000 BCE) bear notched tally marks that represent some of the oldest known information storage. These bones demonstrate that humans needed to record quantities — tracking lunar cycles, counting animals, or managing trade. Tally marks are, in a sense, the first "data format": a one-to-one correspondence between marks and things counted. Every modern spreadsheet is a descendant of these notched bones.',
  },
  {
    label: 'Clay Tokens (c. 8000–3500 BCE)',
    detail:
      'In ancient Mesopotamia, small clay tokens of different shapes — cones, spheres, discs, cylinders — were used to represent commodities: a cone for a measure of grain, a sphere for a sheep. By 3500 BCE, merchants began sealing groups of tokens inside hollow clay envelopes (bullae) to record transactions. Then someone had the insight to press the tokens into the wet clay surface of the envelope before sealing — creating visible impressions of the contents. This led directly to cuneiform: the impressions became the writing, and the tokens inside became unnecessary.',
  },
];

// ── Cuneiform ───────────────────────────────────────────────────────────────

const CUNEIFORM_TIMELINE: TimelineEntry[] = [
  {
    year: 'c. 3200 BCE',
    title: 'Birth of Cuneiform — From Tokens to Tablets',
    description:
      'In the Sumerian city of Uruk (modern Iraq), scribes began pressing wedge-shaped marks into wet clay tablets using a reed stylus. The earliest tablets were accounting records — lists of grain, livestock, and labor. The system began as pictographic (a picture of a cow meant "cow") but evolved rapidly into abstract wedge patterns that could represent sounds. This shift from pictograph to phonetic sign was the critical innovation that made true writing possible: once you can write sounds, you can write anything that can be spoken.',
    color: SAND,
  },
  {
    year: 'c. 2600 BCE',
    title: 'Cuneiform Becomes Literature',
    description:
      'What started as bookkeeping became the medium for humanity\'s first literature. The Epic of Gilgamesh, written in cuneiform on twelve clay tablets, tells of a king\'s quest for immortality — and includes a flood narrative that strikingly parallels the biblical story of Noah. Cuneiform was adopted by the Akkadians, Babylonians, Assyrians, Hittites, and Persians, becoming the dominant writing system of the ancient Near East for over three millennia. At its peak, cuneiform had roughly 600–1,000 signs.',
    color: TERRACOTTA,
  },
  {
    year: 'c. 100 CE',
    title: 'Death of Cuneiform',
    description:
      'After more than 3,000 years of continuous use, cuneiform slowly died as the alphabetic scripts of Aramaic and Greek proved simpler and more adaptable. The last known cuneiform text is an astronomical diary from 75 CE. Knowledge of how to read cuneiform was lost completely — until Henry Rawlinson deciphered it in the 1840s by scaling a sheer cliff face at Behistun, Iran, to copy a trilingual inscription carved 300 feet above the ground. His work unlocked 3,000 years of Mesopotamian history.',
    color: AMBER,
  },
];

// ── Egyptian Hieroglyphics ──────────────────────────────────────────────────

const HIEROGLYPHICS_TIMELINE: TimelineEntry[] = [
  {
    year: 'c. 3100 BCE',
    title: 'Egyptian Hieroglyphics — Sacred Carvings',
    description:
      'The ancient Egyptians called their writing "medu neter" — "words of the gods." Hieroglyphics combined logographic, syllabic, and alphabetic elements in a system of extraordinary beauty and complexity. Over 700 signs were in common use, carved into temple walls, painted on tomb interiors, and inscribed on papyrus scrolls. Hieroglyphics could be written left-to-right, right-to-left, or top-to-bottom — you determined the direction by looking at which way the animal and human figures faced.',
    color: GOLD,
  },
  {
    year: '196 BCE',
    title: 'The Rosetta Stone — Key to a Lost World',
    description:
      'A decree issued at Memphis in 196 BCE was inscribed on a granodiorite stele in three scripts: hieroglyphic, demotic (a cursive Egyptian script), and ancient Greek. When Napoleon\'s soldiers found this stone in 1799 near the town of Rashid (Rosetta), they realized it could be the key to deciphering hieroglyphics. The stone passed to the British after Napoleon\'s defeat and is now in the British Museum — the most visited object in the collection.',
    color: TEAL,
  },
  {
    year: '1822 CE',
    title: 'Champollion Cracks the Code',
    description:
      'Jean-Francois Champollion, a French linguist who had taught himself Coptic (the last descendant of ancient Egyptian), made the breakthrough in September 1822. He realized that hieroglyphics were not purely symbolic — they represented sounds. By matching Greek names in the Greek text (Ptolemy, Cleopatra) to cartouches in the hieroglyphic text, he cracked the phonetic values of key signs. His famous exclamation "Je tiens l\'affaire!" ("I\'ve got it!") opened a civilization that had been mute for 1,400 years. Champollion worked himself to exhaustion and died at 41, but he had given the world access to 3,000 years of Egyptian history.',
    color: BLUE,
  },
];

// ── Chinese Writing ─────────────────────────────────────────────────────────

const CHINESE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Oracle Bones (c. 1200 BCE) — Writing to the Gods',
    detail:
      'The earliest known Chinese writing appears on "oracle bones" — ox scapulae and turtle plastrons used for divination during the Shang Dynasty. A question was inscribed on the bone, which was then heated until it cracked; the pattern of cracks was interpreted as the gods\' answer. Over 150,000 oracle bone fragments have been discovered, bearing roughly 4,500 distinct characters — of which about 1,700 have been deciphered. These characters are recognizably ancestral to modern Chinese script, making Chinese the longest continuously used writing system in the world.',
  },
  {
    label: 'Logographic System — One Character, One Concept',
    detail:
      'Unlike alphabetic scripts where letters represent sounds, each Chinese character represents a word or morpheme. The system uses six categories of character formation: pictographs (a picture of the thing), ideographs (abstract concepts), compound ideographs, phonetic loans, semantic-phonetic compounds, and mutually explanatory characters. The Kangxi Dictionary (1716) lists 47,035 characters; modern comprehensive dictionaries contain over 50,000. An educated adult typically knows 6,000–8,000 characters. Literacy requires knowing roughly 3,000.',
  },
  {
    label: 'Cultural Unity Through Script',
    detail:
      'Chinese characters function as a unifying force across a linguistically diverse civilization. Mandarin, Cantonese, Wu, Min, and Hakka are mutually unintelligible when spoken — but their speakers can all read the same written text. This is because characters represent meanings, not sounds. The standardization of Chinese script by Emperor Qin Shi Huang in 221 BCE (who also built the Great Wall and the Terracotta Army) was one of the most consequential acts of cultural unification in history. It bound a continent-sized empire together through shared literacy.',
  },
];

// ── Phoenician Alphabet ─────────────────────────────────────────────────────

const PHOENICIAN_TIMELINE: TimelineEntry[] = [
  {
    year: 'c. 1050 BCE',
    title: 'The Phoenician Alphabet — 22 Letters That Changed Everything',
    description:
      'The Phoenicians, master traders based in modern Lebanon, developed a writing system of just 22 consonant signs — no vowels. This radical simplification (cuneiform had 600+ signs, hieroglyphics 700+) meant that ordinary merchants and sailors could learn to read and write, not just specialized scribes who trained for years. The Phoenician alphabet spread along Mediterranean trade routes to Greece, Arabia, and India. It is the direct ancestor of virtually every alphabetic script in use today: Latin, Greek, Cyrillic, Arabic, Hebrew, Devanagari, and more. Every letter you are reading right now descends from a Phoenician sign.',
    color: PURPLE,
  },
  {
    year: 'c. 1050 BCE',
    title: 'Why an Alphabet? — The Democratization of Literacy',
    description:
      'The alphabet was a technology of liberation. In societies that used cuneiform or hieroglyphics, literacy was restricted to a tiny elite of professional scribes — perhaps 1% of the population. Learning hundreds of signs took years of full-time study. But an alphabet of 22–30 signs could be learned in weeks. For the first time, ordinary people — merchants, soldiers, farmers — could read and write. This democratization of literacy would eventually lead to democratic governance: citizens who can read laws can challenge them.',
    color: EMERALD,
  },
];

// ── Greek Alphabet ──────────────────────────────────────────────────────────

const GREEK_TIMELINE: TimelineEntry[] = [
  {
    year: 'c. 800 BCE',
    title: 'The Greek Innovation — Adding Vowels',
    description:
      'When the Greeks adopted the Phoenician alphabet around 800 BCE, they made a crucial innovation: they added vowels. Phoenician script wrote only consonants (an "abjad"), which works well for Semitic languages where vowel patterns are predictable but creates ambiguity in Greek. The Greeks repurposed Phoenician consonant signs that had no equivalent in Greek — aleph (a glottal stop) became alpha (a), he became epsilon (e), yod became iota (i). This created the first true alphabet: a system where both consonants and vowels are written, eliminating ambiguity and making the script adaptable to virtually any language.',
    color: BLUE,
  },
  {
    year: 'c. 500 BCE',
    title: 'Left-to-Right Convention',
    description:
      'Early Greek texts were written in "boustrophedon" — literally "as the ox plows," alternating left-to-right and right-to-left on successive lines. By the 5th century BCE, Greeks standardized left-to-right writing. This convention was inherited by Latin and all scripts derived from it. The choice was not inevitable: Arabic and Hebrew write right-to-left, and Chinese traditionally writes top-to-bottom. But because Greek and Latin became the dominant scripts of Western civilization, left-to-right became the global default — influencing everything from book binding to web page layouts.',
    color: INDIGO,
  },
];

// ── Latin Script ────────────────────────────────────────────────────────────

const LATIN_TIMELINE: TimelineEntry[] = [
  {
    year: 'c. 700 BCE',
    title: 'From Greek to Latin via the Etruscans',
    description:
      'The Romans didn\'t invent their alphabet — they adapted it from the Etruscans, who had adapted it from the Greeks, who had adapted it from the Phoenicians. The early Latin alphabet had 21 letters; Y and Z were added later to transliterate Greek words. The letters J, U, and W were medieval additions. Despite this patchwork history, the Latin alphabet became the most widely used writing system in human history, currently used by an estimated 2.6 billion people across more than 100 languages.',
    color: CRIMSON,
  },
  {
    year: '1st–5th Century CE',
    title: 'Imperial Expansion — Script as Power',
    description:
      'The Latin script spread wherever Roman legions marched. From Britain to North Africa, from Spain to Syria, Latin became the language of law, administration, and commerce. When the Western Roman Empire fell in 476 CE, Latin survived as the language of the Catholic Church, and the Latin script was maintained and transmitted through medieval monasteries. Monks painstakingly copied manuscripts by hand — a single Bible could take a scribe an entire year to complete, producing 2–4 pages per day.',
    color: ORANGE,
  },
  {
    year: '15th Century – Present',
    title: 'Global Dominance Through Colonialism',
    description:
      'European colonialism carried the Latin script to the Americas, Africa, Asia, and Oceania. Languages that had never been written were given Latin-based orthographies by missionaries and colonial administrators. Turkish switched from Arabic to Latin script in 1928 under Ataturk. Vietnamese adopted a Latin-based alphabet (quoc ngu) developed by Portuguese missionaries. Today, Latin script is used to write more languages than any other script — from English and Spanish to Swahili, Vietnamese, Malay, and hundreds more.',
    color: TEAL,
  },
];

// ── Arabic Script ───────────────────────────────────────────────────────────

const ARABIC_TIMELINE: TimelineEntry[] = [
  {
    year: 'c. 400 CE',
    title: 'Origins — From Nabataean to Arabic',
    description:
      'The Arabic script evolved from the Nabataean alphabet (itself derived from Aramaic, which descended from Phoenician). Early Arabic inscriptions date to the 4th century CE, but the script was standardized and refined after the revelation of the Quran in the 7th century. Arabic is written right-to-left in a flowing cursive style where most letters connect to their neighbors. The script has 28 letters, each with up to four forms depending on position (initial, medial, final, isolated) — giving Arabic calligraphy its distinctive beauty.',
    color: EMERALD,
  },
  {
    year: '7th–13th Century',
    title: 'Spread with Islam — A Script for Scholarship',
    description:
      'As Islam expanded from Arabia across North Africa, the Middle East, Central Asia, and into South and Southeast Asia, Arabic script came with it. The Quran was written in Arabic, and Muslims everywhere learned to read the script regardless of their native language. Arabic became the language of science, philosophy, and medicine during the Islamic Golden Age — the works of Al-Khwarizmi, Ibn Sina, and Ibn Rushd were all written in Arabic script. Today, Arabic script is used to write not only Arabic but also Persian, Urdu, Pashto, Kurdish, and other languages — making it the second most widely used script in the world.',
    color: GOLD,
  },
];

// ── Gutenberg's Press ───────────────────────────────────────────────────────

const GUTENBERG_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Invention (c. 1440) — Movable Type Arrives in Europe',
    detail:
      'Johannes Gutenberg, a goldsmith from Mainz, Germany, combined several existing technologies — the screw press (used for wine and olive oil), oil-based ink, and individual cast-metal letter blocks — into the first practical movable-type printing system in Europe. (China\'s Bi Sheng had invented movable type in ceramic around 1040 CE, and Korea\'s Jikji was printed with metal type in 1377 — but neither system achieved the scale or impact of Gutenberg\'s.) His press could produce roughly 200 pages per day, compared to the 2–4 pages per day a skilled hand copyist could manage — a 50-to-100-fold increase in production speed.',
  },
  {
    label: 'The Gutenberg Bible (1455) — The Book That Changed Books',
    detail:
      'Gutenberg\'s masterpiece was a Latin Bible of 1,282 pages in two volumes, printed in an edition of approximately 180 copies. About 49 survive today, and they remain among the most valuable books in the world. The printing quality was so high that it rivaled the best hand-copied manuscripts — Gutenberg used a typeface (textura) that mimicked handwritten Gothic script. Each page required arranging roughly 2,600 individual type pieces, inking the form, and pressing it onto moistened vellum or paper.',
  },
  {
    label: 'The Revolution — Printing, Reformation, Science',
    detail:
      'Within 50 years of Gutenberg\'s invention, an estimated 20 million volumes had been printed in Europe. By 1600, the number reached 200 million. The printing press enabled Martin Luther\'s 95 Theses to spread across Germany in two weeks (1517), making the Protestant Reformation the first mass-media event. It allowed Copernicus, Galileo, and Newton to disseminate their ideas widely and rapidly. It standardized spelling and grammar, created national literary languages, and made books affordable to the middle class for the first time. The printing press didn\'t just change writing — it changed civilization.',
  },
];

// ── Modern Era ──────────────────────────────────────────────────────────────

const MODERN_TIMELINE: TimelineEntry[] = [
  {
    year: '1860s',
    title: 'The Typewriter — Mechanical Writing',
    description:
      'Christopher Latham Sholes patented the first commercially successful typewriter in 1868, introducing the QWERTY keyboard layout (designed to prevent jamming by separating commonly paired letters). The typewriter revolutionized business communication, opened clerical work to women (by the 1920s, typing was seen as a female profession), and standardized document formats. It also subtly changed writing itself: authors who typed composed differently than those who wrote by hand — faster, more directly, with less revision of individual sentences.',
    color: SLATE,
  },
  {
    year: '1960s–1980s',
    title: 'Computer Keyboards — From Punch Cards to Screens',
    description:
      'Early computers used punch cards and teletype machines. The development of video display terminals in the 1960s and personal computers in the 1980s put keyboards and screens together, creating the writing interface we still use today. The challenge of encoding the world\'s writing systems digitally led to ASCII (128 characters, English only), then extended character sets, and finally Unicode (1991), which now encodes over 154,000 characters across 161 scripts — from Latin to Linear B to emoji.',
    color: BLUE,
  },
  {
    year: '1990s–Present',
    title: 'Digital Text — Writing at Light Speed',
    description:
      'The World Wide Web (1991), email, and word processing transformed writing from a physical to a digital act. For the first time in history, text could be copied perfectly, searched instantly, and transmitted globally in milliseconds. Humanity now produces more written text in a single day than was produced in the entire first millennium CE. A single smartphone contains more text storage capacity than the Library of Alexandria, which held an estimated 400,000 scrolls.',
    color: CYAN,
  },
];

// ── Internet & Emoji ────────────────────────────────────────────────────────

const INTERNET_INSIGHTS: InsightEntry[] = [
  {
    label: 'Text Messaging — A New Literacy',
    detail:
      'SMS (introduced in 1992) and later WhatsApp, iMessage, and other platforms created a new form of writing — conversational, informal, abbreviated. "LOL," "BRB," and "IMHO" are not degradations of language but innovations: they encode tone and social cues that written language traditionally lacked. Text messaging has made writing the dominant form of daily communication for billions of people — most humans now write more in a day than their grandparents wrote in a month.',
  },
  {
    label: 'Emoji — Neo-Pictographs (1999–Present)',
    detail:
      'In 1999, Japanese artist Shigetaka Kurita designed the first set of 176 emoji for NTT DoCoMo\'s mobile platform. The idea was to add emotional nuance to text messages. By 2025, Unicode has standardized over 3,600 emoji, and they are used in an estimated 10 billion messages per day. Some linguists argue that emoji represent a return to pictographic communication — a 5,000-year circle from Sumerian pictographs to digital ideograms. Others note that emoji supplement rather than replace alphabetic text. Either way, they are the fastest-adopted "writing system" in human history.',
  },
  {
    label: 'AI and the Future of Writing',
    detail:
      'Large language models (2020s) represent another inflection point: for the first time, machines can generate coherent text that is difficult to distinguish from human writing. This raises profound questions about authorship, originality, and the nature of writing itself. Is text produced by AI "writing" in the same sense as text produced by a human mind? The history of writing has always been a story of tools — from reed styluses to quill pens to keyboards — but AI is the first tool that can write without a human directing each word.',
  },
];

// ── Lost & Undeciphered Scripts ─────────────────────────────────────────────

const LOST_SCRIPTS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Linear A (c. 1800–1450 BCE) — The Minoan Mystery',
    detail:
      'Linear A was used by the Minoan civilization on Crete for administrative and possibly religious purposes. Unlike its descendant Linear B (deciphered in 1952 by Michael Ventris as an early form of Greek), Linear A remains undeciphered. We can read many of the individual signs (since they overlap with Linear B), but we do not know what language they represent. Over 1,400 Linear A inscriptions have been found, primarily on clay tablets — a civilization\'s records that we can see but cannot read.',
  },
  {
    label: 'Indus Valley Script (c. 2600–1900 BCE) — The Harappan Enigma',
    detail:
      'The Indus Valley civilization — one of the world\'s three earliest urban civilizations, along with Mesopotamia and Egypt — left behind over 4,000 inscribed objects bearing roughly 400–600 distinct signs. The inscriptions are tantalizingly short (average length: 5 signs), mostly found on small seal stones. We do not know what language they encode, whether the script is logographic or syllabic, or even whether it represents true writing or a simpler symbol system. It is one of the greatest unsolved puzzles in the study of ancient civilizations.',
  },
  {
    label: 'Proto-Sinaitic (c. 1800 BCE) — The Missing Link',
    detail:
      'Found in the turquoise mines of Serabit el-Khadim in the Sinai Peninsula, Proto-Sinaitic inscriptions may represent the "missing link" between Egyptian hieroglyphics and the Phoenician alphabet. The theory is that Semitic-speaking miners simplified Egyptian hieroglyphic signs to write their own language — creating the ancestor of all alphabetic scripts. If correct, every alphabet in the world (Latin, Greek, Arabic, Hebrew, Cyrillic, Devanagari) ultimately derives from a group of miners scratching simplified Egyptian signs onto rock walls in a desert canyon 3,800 years ago.',
  },
];

// ── Decipherment Stories ────────────────────────────────────────────────────

const DECIPHERMENT_STORIES: InsightEntry[] = [
  {
    label: 'The Rosetta Stone (1799/1822) — Champollion\'s Triumph',
    detail:
      'Found by Napoleon\'s soldiers in 1799, the Rosetta Stone bore the same decree in hieroglyphic, demotic, and Greek. It took 23 years and the genius of Jean-Francois Champollion to crack the code. The breakthrough came when he realized hieroglyphics were not purely symbolic but partly phonetic — individual signs could represent sounds. His 1822 decipherment unlocked 3,000 years of Egyptian civilization that had been completely unreadable.',
  },
  {
    label: 'Linear B (1952) — An Architect Solves an Ancient Puzzle',
    detail:
      'Michael Ventris was not a professional linguist — he was a British architect who had been obsessed with Linear B since attending a lecture at age 14. In 1952, he deciphered it as an early form of Greek, pushing the history of the Greek language back 500 years. Ventris used techniques borrowed from wartime codebreaking, analyzing the frequency and distribution of signs. Tragically, he died in a car accident in 1956 at age 34, just four years after his triumph.',
  },
  {
    label: 'Behistun Inscription (1835–1847) — Cuneiform Unlocked',
    detail:
      'Henry Rawlinson, a British army officer, scaled a 300-foot cliff face at Behistun, Iran, to copy a trilingual inscription carved by the Persian king Darius I in 520 BCE. Written in Old Persian, Elamite, and Babylonian cuneiform, the inscription served the same function as the Rosetta Stone. Rawlinson\'s decipherment of cuneiform (1847) opened the entire literary and historical record of ancient Mesopotamia — including the Epic of Gilgamesh, the world\'s oldest known work of literature.',
  },
];

// ── "King" in Ancient Scripts ───────────────────────────────────────────────

const KING_IN_SCRIPTS: AncientKingEntry[] = [
  { script: 'Sumerian Cuneiform', word: '𒈗', transliteration: 'LUGAL', color: SAND },
  { script: 'Egyptian Hieroglyphics', word: '𓇓', transliteration: 'nsw (nesu)', color: GOLD },
  { script: 'Chinese (Oracle Bone)', word: '王', transliteration: 'wang', color: CRIMSON },
  { script: 'Phoenician', word: '𐤌𐤋𐤊', transliteration: 'MLK (malik)', color: PURPLE },
  { script: 'Ancient Greek', word: 'βασιλεύς', transliteration: 'basileus', color: BLUE },
  { script: 'Latin', word: 'REX', transliteration: 'rex', color: ORANGE },
];

// ── Script Comparison Table ─────────────────────────────────────────────────

const SCRIPT_COMPARISON: ScriptComparisonRow[] = [
  { script: 'Latin', origin: 'Italy, c. 700 BCE', type: 'Alphabet', direction: 'Left-to-right', characters: '26 (English)', usersToday: '~2.6 billion', color: ORANGE },
  { script: 'Chinese', origin: 'China, c. 1200 BCE', type: 'Logographic', direction: 'L-to-R / Top-to-bottom', characters: '50,000+', usersToday: '~1.5 billion', color: CRIMSON },
  { script: 'Arabic', origin: 'Arabia, c. 400 CE', type: 'Abjad', direction: 'Right-to-left', characters: '28', usersToday: '~1.1 billion', color: EMERALD },
  { script: 'Devanagari', origin: 'India, c. 700 CE', type: 'Abugida', direction: 'Left-to-right', characters: '47', usersToday: '~600 million', color: AMBER },
  { script: 'Cyrillic', origin: 'Bulgaria, 893 CE', type: 'Alphabet', direction: 'Left-to-right', characters: '33 (Russian)', usersToday: '~250 million', color: BLUE },
  { script: 'Hangul', origin: 'Korea, 1443 CE', type: 'Featural alphabet', direction: 'Left-to-right', characters: '24 (14+10)', usersToday: '~80 million', color: TEAL },
];

// ── Impact of Writing ───────────────────────────────────────────────────────

const IMPACT_INSIGHTS: InsightEntry[] = [
  {
    label: 'Law and Governance',
    detail:
      'Writing enabled law to exist independently of memory. The Code of Hammurabi (c. 1754 BCE) — 282 laws inscribed on a stone stele — established the principle that laws should be written, public, and consistent. Without writing, every legal dispute depended on the memory of elders. With writing, law became a system: impersonal, permanent, and (in theory) equally applied. Every constitution, contract, and court decision since then is a direct descendant of this innovation.',
  },
  {
    label: 'Collective Memory and History',
    detail:
      'Before writing, human knowledge was limited to what living people could remember. Oral traditions could preserve stories for generations, but details drifted, and entire knowledge systems could vanish when their carriers died. Writing created an external memory — a way to store information outside individual human brains. History itself only exists because of writing: "prehistory" is literally defined as the period before written records. Writing made it possible for each generation to build on the accumulated knowledge of all previous generations.',
  },
  {
    label: 'Science and Mathematics',
    detail:
      'Complex science requires precise notation. You cannot do algebra without symbols, navigate by the stars without star charts, or share experimental results without written reports. Writing made it possible to record observations, formalize theories, and transmit knowledge across time and space. Newton\'s Principia could build on Kepler, who built on Copernicus, who built on Ptolemy, who built on Hipparchus — a chain of cumulative knowledge spanning 1,800 years, held together by writing.',
  },
  {
    label: 'Religion and Sacred Texts',
    detail:
      'Every major world religion is organized around a written text: the Torah, the Bible, the Quran, the Vedas, the Tripitaka. Writing allowed religious ideas to be standardized, transmitted across vast distances, and preserved unchanged (in theory) across centuries. The decision to write down oral teachings — and which version to write down — shaped the development of every major faith. Writing didn\'t just record religion; it defined it.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SectionWrapper({
  id,
  icon,
  title,
  accentColor,
  intro,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  accentColor: string;
  intro: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} style={{ marginBottom: 56 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45 }}
      >
        <h2
          style={{
            fontSize: '1.7rem',
            fontWeight: 700,
            color: accentColor,
            marginBottom: 8,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {icon} {title}
        </h2>
        <p
          style={{
            color: ASH,
            fontSize: '1.02rem',
            lineHeight: 1.7,
            marginBottom: 20,
          }}
        >
          {intro}
        </p>
      </motion.div>
      {children}
    </section>
  );
}

function TimelineCard({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {entries.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
            paddingTop: 6,
            paddingBottom: 6,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: e.color,
              backgroundColor: e.color + '18',
              borderRadius: 6,
              padding: '2px 10px',
              marginBottom: 6,
            }}
          >
            {e.year}
          </span>
          <h3 style={{ fontSize: '1.08rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>
            {e.title}
          </h3>
          <p style={{ color: ASH, fontSize: '0.92rem', lineHeight: 1.65 }}>{e.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

function InsightGrid({ items }: { items: InsightEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '16px 20px',
          }}
        >
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 6 }}>
            {item.label}
          </h4>
          <p style={{ color: ASH, fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
            {item.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function HistoryOfWritingPage() {
  const [activeKingIdx, setActiveKingIdx] = useState<number | null>(null);

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

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        paddingBottom: 80,
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* ── Back link ─────────────────────────────────────────────── */}
        <div style={{ paddingTop: 28 }}>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            &larr; Back to Timeline
          </Link>
        </div>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: 36, marginBottom: 44 }}
        >
          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 14,
              color: '#f1f5f9',
            }}
          >
            The History of Writing
          </h1>
          <p
            style={{
              fontSize: '1.12rem',
              color: ASH,
              lineHeight: 1.7,
              maxWidth: 740,
              marginBottom: 28,
            }}
          >
            From the first tally marks scratched on bone 40,000 years ago to the billions of text
            messages sent every day, writing is the technology that made civilization possible. It
            allowed humans to store knowledge outside their brains, transmit ideas across oceans and
            centuries, and build on the accumulated discoveries of every generation that came before.
            This is the story of how marks became meaning.
          </p>

          {/* Key Stats Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 12,
            }}
          >
            {KEY_STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding: '14px 16px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: GOLD }}>{stat.value}</div>
                <div style={{ fontSize: '0.78rem', color: SLATE, marginTop: 2 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.header>

        {/* ── 1. Before Writing ─────────────────────────────────────── */}
        <SectionWrapper
          id="before-writing"
          icon="I"
          title="Before Writing — Proto-Communication"
          accentColor={SAND}
          intro="For tens of thousands of years before the first written word, humans devised ingenious ways to record information: paintings on cave walls, notches on bones, and small clay tokens representing goods. These proto-writing systems laid the cognitive and material groundwork for the invention of true writing."
        >
          <InsightGrid items={BEFORE_WRITING_INSIGHTS} />
        </SectionWrapper>

        {/* ── 2. Sumerian Cuneiform ────────────────────────────────── */}
        <SectionWrapper
          id="cuneiform"
          icon="II"
          title="Sumerian Cuneiform — The First Writing"
          accentColor={TERRACOTTA}
          intro="Around 3200 BCE in southern Mesopotamia, simple accounting marks on clay evolved into the world's first true writing system. Cuneiform — from the Latin cuneus ('wedge') — would be used continuously for over 3,000 years, recording everything from barley rations to epic poetry."
        >
          <TimelineCard entries={CUNEIFORM_TIMELINE} />
        </SectionWrapper>

        {/* ── 3. Egyptian Hieroglyphics ─────────────────────────────── */}
        <SectionWrapper
          id="hieroglyphics"
          icon="III"
          title="Egyptian Hieroglyphics — Words of the Gods"
          accentColor={GOLD}
          intro="Egyptian hieroglyphics appeared almost simultaneously with cuneiform and endured for 3,500 years. Their rediscovery — through the Rosetta Stone and the genius of Jean-Francois Champollion — is one of the greatest detective stories in intellectual history."
        >
          <TimelineCard entries={HIEROGLYPHICS_TIMELINE} />
        </SectionWrapper>

        {/* ── 4. Chinese Writing ────────────────────────────────────── */}
        <SectionWrapper
          id="chinese"
          icon="IV"
          title="Chinese Writing — The Longest Tradition"
          accentColor={CRIMSON}
          intro="Chinese is the only writing system in continuous use since its origins over 3,000 years ago. From oracle bone divination to modern simplified characters, Chinese script has evolved dramatically in form while preserving its fundamental logographic nature — each character a compressed packet of meaning."
        >
          <InsightGrid items={CHINESE_INSIGHTS} />
        </SectionWrapper>

        {/* ── 5. Phoenician Alphabet ────────────────────────────────── */}
        <SectionWrapper
          id="phoenician"
          icon="V"
          title="The Phoenician Alphabet — 22 Letters That Changed the World"
          accentColor={PURPLE}
          intro="Around 1050 BCE, Phoenician traders created something revolutionary: a writing system so simple that anyone could learn it. With just 22 consonant signs, they democratized literacy — and gave birth to virtually every alphabet used in the world today."
        >
          <TimelineCard entries={PHOENICIAN_TIMELINE} />
        </SectionWrapper>

        {/* ── 6. Greek Alphabet ─────────────────────────────────────── */}
        <SectionWrapper
          id="greek"
          icon="VI"
          title="The Greek Alphabet — Adding Vowels"
          accentColor={BLUE}
          intro="The Greeks made a single innovation that transformed the Phoenician consonant-only script into a fully explicit writing system: they added vowels. This seemingly small change eliminated ambiguity and created the first true alphabet — a system where every significant sound in the language has its own letter."
        >
          <TimelineCard entries={GREEK_TIMELINE} />
        </SectionWrapper>

        {/* ── 7. Latin Script ──────────────────────────────────────── */}
        <SectionWrapper
          id="latin"
          icon="VII"
          title="Latin Script — The World's Most Used Writing System"
          accentColor={ORANGE}
          intro="Adapted from the Greek alphabet via the Etruscans, the Latin script rode the expansion of the Roman Empire to become the most widely used writing system in human history. Today it is used by over 2.6 billion people to write more than 100 languages."
        >
          <TimelineCard entries={LATIN_TIMELINE} />
        </SectionWrapper>

        {/* ── 8. Arabic Script ─────────────────────────────────────── */}
        <SectionWrapper
          id="arabic"
          icon="VIII"
          title="Arabic Script — Calligraphy and Scholarship"
          accentColor={EMERALD}
          intro="The Arabic script — flowing, cursive, and written right-to-left — is the second most widely used writing system in the world. It spread from the Arabian Peninsula with the expansion of Islam and became the medium for one of history's greatest periods of scientific and philosophical achievement."
        >
          <TimelineCard entries={ARABIC_TIMELINE} />
        </SectionWrapper>

        {/* ── 9. Gutenberg's Press ─────────────────────────────────── */}
        <SectionWrapper
          id="gutenberg"
          icon="IX"
          title="Gutenberg's Printing Press — Mass Literacy"
          accentColor={AMBER}
          intro="In the 1440s, a goldsmith in Mainz combined existing technologies into a system that would transform the world as profoundly as the internet. Gutenberg's press increased the speed of book production 50-fold and set in motion the Reformation, the Scientific Revolution, and the rise of mass literacy."
        >
          <InsightGrid items={GUTENBERG_INSIGHTS} />

          {/* Production comparison callout */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{
              marginTop: 20,
              backgroundColor: AMBER + '12',
              border: `1px solid ${AMBER}33`,
              borderRadius: 10,
              padding: '18px 22px',
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: 16,
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: AMBER }}>2–4</div>
              <div style={{ fontSize: '0.8rem', color: ASH }}>pages/day by hand</div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: SLATE, alignSelf: 'center' }}>vs.</div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: GOLD }}>200</div>
              <div style={{ fontSize: '0.8rem', color: ASH }}>pages/day by press</div>
            </div>
          </motion.div>
        </SectionWrapper>

        {/* ── 10. Modern Era ───────────────────────────────────────── */}
        <SectionWrapper
          id="modern"
          icon="X"
          title="Typewriter to Digital Text"
          accentColor={CYAN}
          intro="The mechanization of writing — from typewriter to keyboard to touchscreen — compressed writing's evolution into less than two centuries. Each technology changed not just how we write, but what and how much we write."
        >
          <TimelineCard entries={MODERN_TIMELINE} />
        </SectionWrapper>

        {/* ── 11. Internet & Emoji ─────────────────────────────────── */}
        <SectionWrapper
          id="internet-emoji"
          icon="XI"
          title="The Internet and Emoji — Neo-Pictographs"
          accentColor={ROSE}
          intro="The internet transformed writing from a slow, deliberate act into an instantaneous, conversational one. And in a twist that would have delighted the Sumerians, we've come full circle: emoji are, in a sense, pictographs for the digital age."
        >
          <InsightGrid items={INTERNET_INSIGHTS} />
        </SectionWrapper>

        {/* ── 12. Lost & Undeciphered Scripts ──────────────────────── */}
        <SectionWrapper
          id="lost-scripts"
          icon="XII"
          title="Lost and Undeciphered Scripts"
          accentColor={VIOLET}
          intro="Not every writing system has yielded its secrets. Some scripts remain stubbornly undeciphered — tantalizing windows into civilizations whose voices we can see but cannot hear."
        >
          <InsightGrid items={LOST_SCRIPTS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Decipherment Stories Callout ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          style={{ marginBottom: 56 }}
        >
          <div
            style={{
              backgroundColor: INDIGO + '14',
              border: `1px solid ${INDIGO}40`,
              borderRadius: 12,
              padding: '24px 28px',
            }}
          >
            <h2
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: INDIGO,
                marginBottom: 16,
              }}
            >
              Decipherment Stories
            </h2>
            <p style={{ color: ASH, fontSize: '0.92rem', lineHeight: 1.65, marginBottom: 18 }}>
              Some of the greatest intellectual achievements in history were not discovering new things
              — but recovering old ones. These are the stories of how lost writing systems were
              cracked open, restoring the voices of silenced civilizations.
            </p>
            <InsightGrid items={DECIPHERMENT_STORIES} />
          </div>
        </motion.div>

        {/* ── "King" in Ancient Scripts ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          style={{ marginBottom: 56 }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: GOLD,
              marginBottom: 8,
            }}
          >
            One Word, Six Scripts: &ldquo;King&rdquo;
          </h2>
          <p style={{ color: ASH, fontSize: '0.95rem', lineHeight: 1.65, marginBottom: 20 }}>
            The concept of kingship existed in every literate civilization. Click on any script
            below to see how they wrote it.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 12,
            }}
          >
            {KING_IN_SCRIPTS.map((entry, i) => {
              const isActive = activeKingIdx === i;
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  onClick={() => setActiveKingIdx(isActive ? null : i)}
                  style={{
                    background: isActive ? entry.color + '22' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? entry.color + '66' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 10,
                    padding: '16px 12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: 6, lineHeight: 1.2 }}>{entry.word}</div>
                  <div style={{ fontSize: '0.72rem', color: entry.color, fontWeight: 600 }}>
                    {entry.script}
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                      style={{ marginTop: 8, fontSize: '0.78rem', color: ASH }}
                    >
                      {entry.transliteration}
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Script Comparison Table ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          style={{ marginBottom: 56 }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: TEAL,
              marginBottom: 16,
            }}
          >
            World Scripts at a Glance
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.85rem',
                color: '#f1f5f9',
              }}
            >
              <thead>
                <tr>
                  {['Script', 'Origin', 'Type', 'Direction', 'Characters', 'Users Today'].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'left',
                          padding: '10px 12px',
                          borderBottom: '1px solid rgba(255,255,255,0.15)',
                          color: SLATE,
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {SCRIPT_COMPARISON.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <td
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        fontWeight: 600,
                        color: row.color,
                      }}
                    >
                      {row.script}
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: ASH }}>
                      {row.origin}
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: ASH }}>
                      {row.type}
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: ASH }}>
                      {row.direction}
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: ASH }}>
                      {row.characters}
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: ASH }}>
                      {row.usersToday}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Impact Section ───────────────────────────────────────── */}
        <SectionWrapper
          id="impact"
          icon="XIII"
          title="How Writing Changed Civilization"
          accentColor={SKY}
          intro="Writing is not merely a way to record speech — it is a technology that restructured human society. Law, science, religion, history, and governance are all impossible without it. Writing didn't just preserve civilization; it created it."
        >
          <InsightGrid items={IMPACT_INSIGHTS} />
        </SectionWrapper>

        {/* ── Related Deep-Dives CTA ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{
            marginBottom: 56,
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '24px 28px',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>
            Continue Exploring
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { to: '/ancient-egypt', label: 'Ancient Egypt' },
              { to: '/mesopotamia', label: 'Mesopotamia' },
              { to: '/ancient-china', label: 'Ancient China' },
              { to: '/math-history', label: 'History of Mathematics' },
            ].map((link, i) => (
              <Link
                key={i}
                to={link.to}
                style={{
                  display: 'inline-block',
                  padding: '8px 18px',
                  backgroundColor: BLUE + '18',
                  border: `1px solid ${BLUE}44`,
                  borderRadius: 8,
                  color: '#60a5fa',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  transition: 'background-color 0.2s',
                }}
              >
                {link.label} &rarr;
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer style={{ paddingBottom: 40, textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            &larr; Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
