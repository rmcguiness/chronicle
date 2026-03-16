/**
 * HistoryOfLanguagePage — comprehensive deep-dive on the history of human language.
 *
 * Route: /history-of-language
 *
 * Sections:
 *  1. Hero — opening hook: 7,100 languages, dying at 1 every 2 weeks
 *  2. The Mystery of Language Origins — evolution, FOXP2, laryngeal descent
 *  3. How Many Languages Exist — the count, dialect vs. language politics
 *  4. The World's Language Families — Indo-European, Sino-Tibetan, etc.
 *  5. Proto-Indo-European — the reconstructed ghost language
 *  6. Writing Systems — pictographic to alphabetic evolution
 *  7. Chinese Characters — logographic system, 50,000+ characters
 *  8. The Great Vowel Shift — why English spelling is insane
 *  9. Lingua Francas — Akkadian → Greek → Latin → Arabic → French → English
 * 10. Creoles and Pidgins — how new languages are born
 * 11. Digital Age — emoji, textspeak, algorithmic language change
 * 12. Linguistic Milestones — notable moments timeline
 * 13. The Latin Legacy — Vulgar Latin → Romance languages
 * 14. The Spread of English — from Germanic dialect to global lingua franca
 * 15. Language Death — rate of extinction, what is lost
 * 16. Language Revival — Hebrew, Māori, Welsh, Irish
 * 17. Linguistic Relativity — Sapir-Whorf hypothesis, does language shape thought?
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const AMBER = '#d97706';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const ROSE = '#f43f5e';
const GREEN = '#22c55e';
const GOLD = '#f59e0b';
const PURPLE = '#a855f7';
const BLUE = '#3b82f6';
const CRIMSON = '#dc2626';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const COPPER = '#d97706';
const SKY = '#38bdf8';
const CORAL = '#fb7185';
const LIME = '#84cc16';

const ACCENT_COLORS = [AMBER, TEAL, INDIGO, ROSE, GREEN, GOLD, PURPLE, BLUE, CRIMSON, CORAL];

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

interface InsightEntry {
  label: string;
  detail: string;
}

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  color: string;
}

interface FamilyEntry {
  name: string;
  speakers: string;
  examples: string;
  note: string;
}

// ── Section 1: The Mystery of Language Origins ──────────────────────────────

const ORIGINS_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Defining Human Trait',
    detail:
      'Language is the single most important distinction between humans and every other species. More than tool use (crows and chimpanzees use tools), more than culture (elephants grieve, whales sing) — it is recursive language that sets us apart. We can embed phrases within phrases to infinite depth: "The dog that the cat that the rat bit chased ran away." No other animal does this.',
  },
  {
    label: 'When Did Language Evolve?',
    detail:
      'The honest answer is: we don\'t know. Estimates range from 50,000 to 200,000 BCE. The problem is that language leaves no fossils — soft tissue in the throat, neural wiring in the brain, neither preserves. We can only infer from indirect evidence: the size of the hypoglossal canal (nerve controlling the tongue), the shape of the hyoid bone, and the archaeological record of complex behavior.',
  },
  {
    label: 'The Laryngeal Descent Trade-Off',
    detail:
      'Modern humans have a descended larynx — the voice box sits lower in the throat than in any other primate. This creates a large resonating chamber above it (the pharynx), allowing us to produce the full range of vowel and consonant sounds. The trade-off is lethal: because the larynx sits below the point where the airway and food pipe diverge, humans are the only mammals that can choke to death on food. We literally risk death every time we eat — the price of speech.',
  },
  {
    label: 'Theories of Language Origin',
    detail:
      'No consensus exists. Major theories include: social grooming replacement (Robin Dunbar — as groups grew too large for physical grooming, language replaced it as social bonding), hunting coordination (language evolved to plan group hunts), sexual selection (eloquent speakers attracted mates), and mother-infant bonding (mothers needed to communicate with infants they couldn\'t always carry). Each theory explains some features of language but none explains all.',
  },
  {
    label: 'The "Language Gene": FOXP2',
    detail:
      'In 2001, researchers identified a family (the KE family) in which half the members had severe speech and language impairment — all traced to a mutation in a single gene, FOXP2. This was dubbed the "language gene," though the reality is more complex: FOXP2 affects fine motor control of the mouth and face, not grammar itself. Remarkably, Neanderthal DNA shows they shared the human version of FOXP2, suggesting they may have had some capacity for language.',
  },
  {
    label: 'The Behavioral Revolution (~50,000 BCE)',
    detail:
      'Around 50,000 BCE, the archaeological record shows an explosion: cave paintings, carved figurines, beaded jewelry, long-distance trade networks, specialized tools. Something changed in human cognition. Many linguists believe this "behavioral revolution" marks the moment language became fully recursive — when humans gained the ability to combine words into unlimited novel sentences. Before this, we may have had proto-language (individual words, fixed phrases) but not true syntax.',
  },
];

// ── Section 2: How Many Languages Exist ─────────────────────────────────────

const LANGUAGE_COUNT_INSIGHTS: InsightEntry[] = [
  {
    label: '~7,100 Living Languages Today',
    detail:
      'The Ethnologue database, the most comprehensive catalog of world languages, lists approximately 7,100 living languages as of today. But this number is approximate — it depends entirely on where you draw the line between "language" and "dialect," a distinction that is ultimately political, not linguistic.',
  },
  {
    label: '"A Language Is a Dialect with an Army and a Navy"',
    detail:
      'This famous quip (attributed to linguist Max Weinreich) captures a truth: the distinction between language and dialect is about power, not mutual intelligibility. Norwegian, Danish, and Swedish speakers can largely understand each other — but they are "different languages" because they belong to different nation-states. Meanwhile, Mandarin and Cantonese speakers cannot understand each other at all — but both are called "Chinese" because they belong to one political entity and share a writing system.',
  },
  {
    label: 'The Distribution Is Wildly Uneven',
    detail:
      'Half the world\'s population speaks one of just 23 languages. The other half speaks the remaining 7,077. Papua New Guinea alone — a country of 9 million people — has over 840 languages, the highest linguistic diversity on Earth. Indonesia has 700+. Nigeria has 500+. Meanwhile, vast swaths of Europe and East Asia are dominated by a single language each.',
  },
  {
    label: 'Chinese "Languages"',
    detail:
      'What we call "Chinese" is actually a family of mutually unintelligible languages. A Mandarin speaker from Beijing and a Cantonese speaker from Hong Kong cannot have a conversation — the difference is greater than between Spanish and Portuguese. Yet both are written using the same Chinese characters (with variations), creating a unified written culture across spoken linguistic boundaries. This is why the Chinese writing system was never replaced by an alphabet: it bridges languages that speech cannot.',
  },
];

// ── Section 3: The World's Language Families ────────────────────────────────

const LANGUAGE_FAMILIES: FamilyEntry[] = [
  {
    name: 'Indo-European',
    speakers: '~3 billion speakers',
    examples: 'English, Spanish, French, Hindi, Russian, Persian, Greek, Bengali, Portuguese, German',
    note: 'The largest language family, traced to a single ancestor language spoken by pastoral nomads on the Pontic steppe (~4500 BCE, modern Ukraine/southern Russia). Spread through migration and conquest across Europe, Iran, and India.',
  },
  {
    name: 'Sino-Tibetan',
    speakers: '~1.3 billion speakers',
    examples: 'Mandarin, Cantonese, Wu, Tibetan, Burmese',
    note: 'The second-largest family. Mandarin alone accounts for ~920 million native speakers, making it the most spoken first language on Earth. Tonal languages — meaning and word identity change based on pitch.',
  },
  {
    name: 'Afro-Asiatic',
    speakers: '~500 million speakers',
    examples: 'Arabic, Hebrew, Amharic, Berber, Hausa, Somali',
    note: 'One of the oldest identifiable language families, traced to approximately 18,000 BCE in North Africa or the Horn of Africa. Arabic alone — spread by Islam — accounts for 300+ million speakers across 25 countries.',
  },
  {
    name: 'Niger-Congo',
    speakers: '~500 million speakers',
    examples: 'Swahili, Yoruba, Zulu, Igbo, Shona, Xhosa',
    note: 'The largest language family by number of languages (500+), covering most of Sub-Saharan Africa. The Bantu expansion (~1000 BCE–500 CE) spread Bantu languages from West Africa across the southern half of the continent.',
  },
  {
    name: 'Austronesian',
    speakers: '~400 million speakers',
    examples: 'Malay, Indonesian, Tagalog, Javanese, Hawaiian, Māori, Malagasy',
    note: 'The most geographically spread language family: 1,200+ languages spanning from Madagascar (off Africa) to Easter Island (off South America) and from Taiwan to New Zealand. Spread by the greatest seafaring culture in human history.',
  },
  {
    name: 'Dravidian',
    speakers: '~250 million speakers',
    examples: 'Tamil, Telugu, Kannada, Malayalam',
    note: 'Southern India\'s indigenous language family, predating the arrival of Indo-European languages (Sanskrit) by millennia. Tamil has one of the oldest literary traditions in the world, with texts dating to the 3rd century BCE.',
  },
  {
    name: 'Language Isolates',
    speakers: 'Various',
    examples: 'Basque, Korean (debated), Japanese (debated), Ainu, Sumerian (extinct)',
    note: 'Languages with no demonstrated genetic relationship to any other language on Earth. Basque, spoken in northern Spain and southwestern France, has survived surrounded by Indo-European languages for thousands of years — its origins remain one of linguistics\' great mysteries.',
  },
];

// ── Section 4: Proto-Indo-European ──────────────────────────────────────────

const PIE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Reconstructing a Ghost Language',
    detail:
      'Proto-Indo-European (PIE) is a language that was never written down and has been extinct for over 6,000 years — yet linguists have reconstructed thousands of its words, its grammar, and even aspects of its speakers\' culture. This is one of the great intellectual achievements of the 19th and 20th centuries, accomplished entirely through the comparative method.',
  },
  {
    label: 'The Comparative Method',
    detail:
      'When the same word appears in similar form across languages that couldn\'t have borrowed it from each other, it points to a common ancestor. The word for "foot": *pṓds (PIE) → poús (Greek) → pēs (Latin) → foot (English) → Fuß (German) → pied (French) → pāda (Sanskrit). These systematic sound correspondences allow linguists to work backward from living languages to reconstruct their common parent.',
  },
  {
    label: 'The Pontic Steppe Homeland',
    detail:
      'Through reconstructed vocabulary, linguists determined that PIE speakers knew horses, wagons, wool, and cattle — but not the sea, olives, or grapes. They had words for snow, wolves, and birch trees. This pointed to the Pontic-Caspian steppe (modern Ukraine and southern Russia) around 4500 BCE. Archaeological confirmation came from the Yamnaya culture: pastoral nomads who herded cattle, rode horses, and built burial mounds (kurgans). DNA evidence now confirms massive Yamnaya migrations into Europe and South Asia.',
  },
  {
    label: 'The Spread: Migration and Conquest',
    detail:
      'Starting around 3000 BCE, speakers of PIE descendant languages spread outward in waves. Westward into Europe (displacing or absorbing pre-Indo-European populations), southward into Iran and India (the Indo-Aryan migrations), and eastward into Central Asia. By 1000 BCE, Indo-European languages dominated from Ireland to India — a linguistic empire built on horses, wheels, and bronze.',
  },
];

// ── Section 5: Writing Systems ──────────────────────────────────────────────

const WRITING_TIMELINE: TimelineEntry[] = [
  {
    year: '~3400 BCE',
    title: 'Cuneiform (Mesopotamia)',
    description:
      'The earliest known writing system: wedge-shaped marks pressed into clay tablets by Sumerian scribes. Initially pictographic (a picture of a cow meant "cow"), it evolved into a system of abstract symbols representing syllables. Used for 3,000 years across multiple languages.',
    color: AMBER,
  },
  {
    year: '~3200 BCE',
    title: 'Egyptian Hieroglyphs',
    description:
      'A mixed system: some symbols represent sounds, others represent whole words or concepts. Hieroglyphs were used for monumental inscriptions; hieratic and demotic scripts served everyday purposes. The Rosetta Stone (196 BCE) eventually allowed modern decipherment.',
    color: GOLD,
  },
  {
    year: '~1200 BCE',
    title: 'Chinese Characters',
    description:
      'Oracle bone script: questions carved on turtle shells and animal bones, heated until they cracked, with the cracks read as divine answers. Evolved into the modern Chinese character system — the only ancient writing system still in continuous use today. Each character represents a morpheme (unit of meaning), not a sound.',
    color: CRIMSON,
  },
  {
    year: '~1050 BCE',
    title: 'The Phoenician Alphabet',
    description:
      'The revolutionary innovation: a writing system where each symbol represents a single consonant sound. With ~22 symbols, any word in the language could be written. Phoenician traders spread it across the Mediterranean. It became the ancestor of virtually all alphabets used today — Greek, Latin, Arabic, Hebrew, Cyrillic, and more.',
    color: TEAL,
  },
  {
    year: '~800 BCE',
    title: 'The Greek Alphabet — Adding Vowels',
    description:
      'The Greeks adapted the Phoenician alphabet with one crucial innovation: they added vowel symbols. Phoenician (like Hebrew and Arabic) wrote only consonants — readers inferred vowels from context. Greek became the first true alphabet: every sound in the language, consonant and vowel, had its own symbol. This was the ancestor of the Latin alphabet used by English and most European languages.',
    color: BLUE,
  },
];

// ── Section 5b: Chinese Characters — The Enduring Logographic System ────────

const CHINESE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Oracle Bones to Modern Characters',
    detail:
      'Chinese writing began around 1200 BCE as divination marks carved on turtle shells and ox bones. These oracle bone scripts evolved through bronze inscriptions, seal script, clerical script, and finally the regular script still used today. It is the only ancient writing system to survive in continuous use for over 3,000 years.',
  },
  {
    label: '50,000+ Characters, but You Only Need 3,000',
    detail:
      'The Kangxi Dictionary (1716) lists 47,035 characters. Modern comprehensive dictionaries include over 80,000. But literacy requires only about 3,000–4,000: the Chinese government defines functional literacy as 2,500 characters for rural residents and 3,500 for urban residents. The average educated adult knows 6,000–8,000.',
  },
  {
    label: 'How Characters Work',
    detail:
      'About 90% of characters are phono-semantic compounds: one part (the radical) hints at meaning, the other hints at pronunciation. For example, 妈 (mā, "mother") combines 女 (woman radical) with 马 (mǎ, "horse" — for the sound). This is not an alphabet — each character represents a morpheme (unit of meaning), not a sound.',
  },
  {
    label: 'Simplified vs Traditional',
    detail:
      'In the 1950s and 1960s, the People\'s Republic of China simplified thousands of characters to boost literacy rates: 國 became 国, 學 became 学, 龍 became 龙. Taiwan, Hong Kong, and Macau retained traditional characters. Today, mainland China and Singapore use simplified; Taiwan, Hong Kong, and overseas Chinese communities often use traditional. This has created a cultural divide within the Chinese-speaking world.',
  },
  {
    label: 'Why No Alphabet?',
    detail:
      'Chinese characters serve a purpose no alphabet can: they unite speakers of mutually unintelligible languages. A Mandarin speaker in Beijing and a Cantonese speaker in Hong Kong can read the same newspaper despite being unable to understand each other\'s speech. The character 水 means "water" everywhere, even though it\'s pronounced "shuǐ" in Mandarin and "seoi" in Cantonese. An alphabet would shatter this unity.',
  },
];

// ── Section 5c: The Great Vowel Shift ───────────────────────────────────────

const VOWEL_SHIFT_INSIGHTS: InsightEntry[] = [
  {
    label: 'What Happened (1400–1700)',
    detail:
      'Over roughly 300 years, every long vowel in English systematically shifted its pronunciation. "Name" was once pronounced "NAH-muh." "Bite" was "BEE-tuh." "House" was "HOOSE." "Meet" was "MATE." This was not random — it was a chain reaction: when one vowel moved, the next one shifted to fill the gap, like a game of musical chairs in the mouth.',
  },
  {
    label: 'Why English Spelling Is Insane',
    detail:
      'William Caxton introduced the printing press to England in 1476 — right in the middle of the Great Vowel Shift. Spelling was standardized and frozen based on how words were pronounced BEFORE the shift completed. The result: English spelling reflects 15th-century pronunciation, not modern pronunciation. That\'s why "knight" has a silent K and GH (it was once pronounced "kuh-NIKHT"), and why "through," "tough," "though," "thought," and "thorough" all look similar but rhyme with nothing.',
  },
  {
    label: 'Nobody Knows Why It Started',
    detail:
      'The Great Vowel Shift is one of linguistics\' great mysteries. Theories include: the Black Death reshuffled populations and dialects; mass migration to southeastern England after the plague; prestige imitation of French vowels by the English upper class; or simple chain-shift dynamics that needed only a small initial push. No single explanation is widely accepted.',
  },
  {
    label: 'It Never Happened to Scots',
    detail:
      'Scottish English largely avoided the Great Vowel Shift, which is why Scots pronunciation often sounds closer to Middle English than modern Standard English does. Words like "house" (still "hoose" in Scots), "out" ("oot"), and "stone" ("stane") preserve older pronunciations. Scots is essentially what English would have sounded like without the shift.',
  },
];

// ── Section 5d: Lingua Francas Through History ──────────────────────────────

const LINGUA_FRANCA_TIMELINE: TimelineEntry[] = [
  {
    year: '~2400–600 BCE',
    title: 'Akkadian',
    description:
      'The first international diplomatic language. The Amarna Letters (1350 BCE) show that even the Egyptian pharaoh corresponded with other rulers in Akkadian — not Egyptian. It served as the lingua franca of the ancient Near East for nearly 2,000 years.',
    color: AMBER,
  },
  {
    year: '~300 BCE–600 CE',
    title: 'Koine Greek',
    description:
      'Alexander the Great\'s conquests spread Greek from Egypt to Afghanistan. Koine ("common") Greek became the language of trade, scholarship, and early Christianity across the eastern Mediterranean. The New Testament was written in Greek, not Hebrew or Aramaic.',
    color: BLUE,
  },
  {
    year: '~200 BCE–1700 CE',
    title: 'Latin',
    description:
      'Rome\'s language outlived Rome by a millennium. Latin remained the language of the Catholic Church, European scholarship, science, and law well into the 18th century. Newton\'s Principia Mathematica (1687) was written in Latin.',
    color: INDIGO,
  },
  {
    year: '~700–1500 CE',
    title: 'Arabic',
    description:
      'The Islamic Golden Age made Arabic the language of science, mathematics, philosophy, and medicine from Spain to Central Asia. Words like "algebra," "algorithm," "alcohol," and "zero" entered European languages from Arabic.',
    color: GREEN,
  },
  {
    year: '~1700–1914',
    title: 'French',
    description:
      'The language of European diplomacy, aristocracy, and culture. All international treaties were written in French. The Russian aristocracy spoke French at home (as depicted in War and Peace). The Treaty of Versailles (1919) was the first major treaty also written in English.',
    color: ROSE,
  },
  {
    year: '~1945–Present',
    title: 'English',
    description:
      'American postwar dominance made English the global lingua franca: the language of aviation, science, the internet, business, and popular culture. Today, most English conversations on Earth are between non-native speakers — the language belongs to the world, not to England or America.',
    color: TEAL,
  },
];

// ── Section 5e: Creoles and Pidgins ─────────────────────────────────────────

const CREOLE_INSIGHTS: InsightEntry[] = [
  {
    label: 'How New Languages Are Born',
    detail:
      'When speakers of different languages need to communicate — through trade, slavery, or colonization — they create a pidgin: a simplified contact language with basic grammar and limited vocabulary. When children grow up speaking a pidgin as their native language, they spontaneously complexify it, adding full grammar, tense systems, and expressive range. The result is a creole: a brand-new, fully formed language, created in a single generation.',
  },
  {
    label: 'The Bioprogramming Hypothesis',
    detail:
      'Linguist Derek Bickerton observed that creoles worldwide share remarkably similar grammatical structures — despite deriving from different parent languages on different continents. He proposed that when children receive insufficient linguistic input (a pidgin), their innate language faculty fills in the gaps with a "default grammar." This is powerful evidence for Chomsky\'s idea that humans are born with an innate capacity for language structure.',
  },
  {
    label: 'Major Creole Languages',
    detail:
      'Haitian Creole (French-based, 12 million speakers, official language of Haiti), Tok Pisin (English-based, official language of Papua New Guinea), Cape Verdean Creole (Portuguese-based), Jamaican Patois (English-based), Papiamento (Spanish/Portuguese-based, spoken in Curaçao and Aruba). Many creoles are official or co-official languages of sovereign nations.',
  },
  {
    label: 'The Prestige Problem',
    detail:
      'Despite being fully expressive languages with complete grammars, creoles are often stigmatized as "broken" or "bastardized" versions of their parent languages. This reflects social prejudice, not linguistic reality. Haitian Creole has its own literature, grammar books, and is used in education and government — yet many French speakers still dismiss it as "bad French." Every language was once a "corrupted" version of an older one.',
  },
];

// ── Section 5f: Digital Age and Language ─────────────────────────────────────

const DIGITAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'Emoji: The Return of Pictographic Communication',
    detail:
      'In 2015, Oxford Dictionaries named 😂 (Face with Tears of Joy) the Word of the Year — despite it not being a word at all. Emoji echo humanity\'s oldest writing: pictographs. Like Sumerian pictograms, they compress complex meaning into single symbols. Unlike those ancient systems, they are universal across languages — 🔥 means roughly the same thing in Tokyo and São Paulo.',
  },
  {
    label: 'Textspeak: Evolution, Not Degradation',
    detail:
      'Abbreviations like "u," "2," "lol," and "brb" are not signs of linguistic decay — they are creative adaptations to a new medium, just as shorthand evolved for rapid note-taking. Studies show that heavy texters score equally well on formal writing tests. Textspeak is a register, not a replacement: teenagers who write "c u l8r" can also write formal essays. Language has always adapted to its medium.',
  },
  {
    label: 'The Internet Killed 95% of Languages Online',
    detail:
      'Only about 500 of the world\'s 7,100 languages have a meaningful online presence. English dominates internet content (~60%), followed by Russian, Spanish, Turkish, and German. Languages without a digital presence face accelerated death: young speakers see their language as backward and useless in the modern economy. "If you can\'t Google in your language, your grandchildren won\'t speak it."',
  },
  {
    label: 'Algorithmic Language Change',
    detail:
      'Autocorrect, predictive text, and AI language models are now shaping how billions of people write. Autocorrect enforces standardized spelling, potentially slowing natural spelling evolution. Predictive text nudges users toward common phrases, possibly homogenizing expression. Meanwhile, social media algorithms amplify certain speech patterns (short, punchy, emotionally charged) over others. For the first time in history, machines are active participants in language change.',
  },
  {
    label: 'Code-Switching Goes Global',
    detail:
      'Social media has normalized multilingual code-switching — seamlessly mixing languages within a single sentence. "Just watched the latest 드라마 and I\'m not okay rn 😭" blends English, Korean, and emoji. This was always common in multilingual communities, but the internet made it visible and mainstream. Some linguists see this as the future of global communication: not one lingua franca, but fluid, hybrid speech.',
  },
];

// ── Section 5g: Linguistic Milestones Timeline ──────────────────────────────

const MILESTONES_TIMELINE: TimelineEntry[] = [
  {
    year: '~200,000–100,000 BCE',
    title: 'Emergence of Human Language',
    description: 'Homo sapiens develops the anatomical and cognitive capacity for speech. The exact timing remains one of science\'s greatest unsolved mysteries.',
    color: PURPLE,
  },
  {
    year: '~3400 BCE',
    title: 'Cuneiform: First Writing',
    description: 'Sumerian scribes in Mesopotamia press wedge-shaped marks into wet clay — the beginning of recorded history.',
    color: AMBER,
  },
  {
    year: '~1050 BCE',
    title: 'Phoenician Alphabet',
    description: '22 consonant symbols that became the ancestor of virtually every alphabet in use today: Greek, Latin, Arabic, Hebrew, Cyrillic.',
    color: TEAL,
  },
  {
    year: '~500 BCE',
    title: 'Pāṇini\'s Sanskrit Grammar',
    description: 'The Indian grammarian Pāṇini wrote the Aṣṭādhyāyī — 3,959 rules describing Sanskrit with mathematical precision. It remained the most sophisticated linguistic analysis for over 2,000 years.',
    color: GOLD,
  },
  {
    year: '196 BCE',
    title: 'The Rosetta Stone',
    description: 'A decree carved in three scripts (hieroglyphic, demotic, Greek) that would eventually allow Jean-François Champollion to crack Egyptian hieroglyphics in 1822.',
    color: CRIMSON,
  },
  {
    year: '1440s',
    title: 'Gutenberg\'s Printing Press',
    description: 'Movable type standardizes spelling and grammar, accelerates literacy, and freezes European languages into their modern forms.',
    color: BLUE,
  },
  {
    year: '1786',
    title: 'William Jones\'s Discovery',
    description: 'British judge in Calcutta notices deep similarities between Sanskrit, Greek, and Latin — launching comparative linguistics and the reconstruction of Proto-Indo-European.',
    color: INDIGO,
  },
  {
    year: '1822',
    title: 'Champollion Deciphers Hieroglyphics',
    description: 'Using the Rosetta Stone, Jean-François Champollion cracks the code of Egyptian hieroglyphics after years of work, unlocking 3,000 years of Egyptian history.',
    color: GOLD,
  },
  {
    year: '1887',
    title: 'Esperanto Published',
    description: 'L. L. Zamenhof publishes the first constructed international language. Despite never becoming dominant, it survives with ~2 million speakers and proves that languages can be deliberately created.',
    color: GREEN,
  },
  {
    year: '1953',
    title: 'Hebrew Revival Complete',
    description: 'Israel\'s first generation of native Hebrew speakers grows up — the only dead language ever fully revived to everyday use after 1,700 years without native speakers.',
    color: LIME,
  },
  {
    year: '2010s',
    title: 'Neural Machine Translation',
    description: 'Deep learning transforms machine translation from clunky phrase-matching to fluent, context-aware translation. Google Translate now handles 133 languages. The Tower of Babel problem may finally have a technological solution.',
    color: SKY,
  },
];

// ── Section 6: The Latin Legacy ─────────────────────────────────────────────

const LATIN_INSIGHTS: InsightEntry[] = [
  {
    label: 'Vulgar Latin: The Real Language',
    detail:
      'Classical Latin — the language of Cicero and Virgil — was a literary standard. The actual spoken language of Roman soldiers, merchants, and farmers was "Vulgar Latin" (from vulgus, "common people"). It varied by region and was constantly evolving. This is the Latin that became the Romance languages — not the elegant prose of senators.',
  },
  {
    label: 'The Slow Divergence',
    detail:
      'After the fall of Rome (476 CE), Vulgar Latin speakers across the former empire were no longer unified by Roman roads, administration, or education. Over 500 years, regional dialects drifted apart. People didn\'t decide to speak "French" one day — they simply noticed, gradually, that the Latin spoken in Paris was becoming unintelligible to Latin speakers in Rome or Madrid. By ~800 CE, the split was undeniable.',
  },
  {
    label: 'Romance Languages: Latin\'s Children',
    detail:
      'Spanish, French, Portuguese, Italian, and Romanian are all Vulgar Latin dialects that drifted far enough apart to become separate languages. Spanish and Portuguese remain close enough that speakers can often understand each other. French diverged more (heavy Germanic Frankish influence). Romanian, isolated in the Balkans, retains some archaic Latin features lost elsewhere.',
  },
  {
    label: 'Church Latin: The Preserved Fossil',
    detail:
      'While spoken Latin was evolving into new languages, the Catholic Church preserved Classical Latin as a written and liturgical standard for over a millennium. Church Latin was the language of law, theology, and scholarship across medieval Europe — a shared written language long after spoken Latin had splintered. Isaac Newton wrote the Principia in Latin (1687).',
  },
  {
    label: '60% of English Is Latin/French',
    detail:
      'When William the Conqueror invaded England in 1066, French-speaking Normans became the ruling class. For 300 years, French was the language of law, government, and prestige — while the English-speaking peasantry spoke Anglo-Saxon. The result: Modern English has a split vocabulary. Anglo-Saxon words for common things (house, food, water, child) and French/Latin words for elevated concepts (residence, cuisine, beverage, infant). About 60% of English vocabulary is Latin or French in origin.',
  },
];

// ── Section 7: The Spread of English ────────────────────────────────────────

const ENGLISH_TIMELINE: TimelineEntry[] = [
  {
    year: '~450 CE',
    title: 'Anglo-Saxon Invasion of Britain',
    description:
      'After Roman legions withdrew from Britain, Germanic tribes — Angles, Saxons, and Jutes — crossed the North Sea and settled. Their West Germanic dialects merged into Old English, a language almost unrecognizable to modern English speakers. "Hwæt! We Gardena in geardagum, þeodcyninga, þrym gefrunon" — the opening of Beowulf.',
    color: AMBER,
  },
  {
    year: '793–1066',
    title: 'Viking Influence',
    description:
      'Norse raiders and settlers brought Old Norse to England. The languages were similar enough that speakers could partly understand each other, and the two fused. Common English words from Norse: sky, window, egg, they, their, them, husband, wrong, ugly, knife, skill. English grammar simplified through contact — losing most noun cases and gender.',
    color: TEAL,
  },
  {
    year: '1066',
    title: 'Norman Conquest',
    description:
      'William the Conqueror\'s invasion layered French onto English. For 300 years, the ruling class spoke French while peasants spoke English. This created English\'s famous synonyms: cow/beef, pig/pork, sheep/mutton (English animal, French meat — peasants raised them, nobles ate them). The courts spoke French until 1362.',
    color: INDIGO,
  },
  {
    year: '1380s',
    title: 'Middle English: Chaucer',
    description:
      'By Chaucer\'s time, English had absorbed French and Norse, lost most of its Germanic inflections, and become recognizably the ancestor of modern English. Chaucer\'s Canterbury Tales demonstrated that English — not French or Latin — could be a language of great literature. "Whan that Aprille with his shoures soote / The droghte of March hath perced to the roote."',
    color: GOLD,
  },
  {
    year: '1476',
    title: 'The Printing Press Arrives',
    description:
      'William Caxton set up England\'s first printing press. Printing forced standardization: one spelling, one grammar had to be chosen. London dialect became the standard. But English spelling was frozen before the Great Vowel Shift completed — which is why English spelling is so chaotic today (through, tough, though, thought, thorough all rhyme with nothing).',
    color: GREEN,
  },
  {
    year: '1590s–1610s',
    title: 'Shakespeare and Early Modern English',
    description:
      'Shakespeare wrote during the transition to Early Modern English — close enough to modern English to be read, different enough to be challenging. He coined ~1,700 words still in use: assassination, lonely, bedroom, generous, obscene, eyeball, birthplace. The King James Bible (1611) further standardized the language.',
    color: PURPLE,
  },
  {
    year: '1600s–1900s',
    title: 'British Empire: Global Spread',
    description:
      'English spread to every continent through colonization: North America (1607), Caribbean, India (1600s), Australia (1788), Africa (1800s). By 1900, English was spoken across a quarter of the Earth\'s land surface. Each colony developed its own variety: American, Australian, Indian, South African, Caribbean English.',
    color: BLUE,
  },
  {
    year: '1945–Present',
    title: 'English as Global Lingua Franca',
    description:
      'American economic and cultural dominance after WWII cemented English as the world\'s lingua franca. It is the language of international aviation, science, diplomacy, internet, and business. Today: ~380 million native speakers, ~1.1 billion second-language speakers — 1.5 billion total. Most English conversations on Earth now happen between non-native speakers.',
    color: CRIMSON,
  },
];

// ── Section 8: Language Death ───────────────────────────────────────────────

const DEATH_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Rate of Extinction',
    detail:
      'One language dies approximately every two weeks. A language dies when its last fluent speaker dies — and with them, an entire way of understanding and describing the world vanishes forever. By 2100, linguists predict that 50% of the world\'s current 7,100 languages will be extinct.',
  },
  {
    label: 'Why Languages Die',
    detail:
      'Languages die when speakers shift to a dominant language for economic or social reasons. Children stop learning their parents\' language because the dominant language offers better education, jobs, and social status. Governments suppress minority languages through education policy. Urbanization scatters rural communities. Globalization — television, internet, social media — accelerates the shift. It usually takes three generations: grandparents speak the language, parents are bilingual, grandchildren speak only the dominant language.',
  },
  {
    label: 'What Is Lost: Unique Knowledge',
    detail:
      'Each language encodes centuries of accumulated knowledge about local ecology, medicine, navigation, and social organization. The Seri people of Mexico have a taxonomic system for marine life that marine biologists have found scientifically accurate and more detailed than Western classifications in some areas. When a language dies, this knowledge — never written down, existing only in speakers\' minds — dies with it. Each death is a library burning.',
  },
  {
    label: 'Untranslatable Concepts',
    detail:
      'Languages carve up reality differently. Finnish "sisu" — stoic determination, grit beyond endurance. Portuguese "saudade" — a melancholic longing for something absent, not quite sadness, not quite nostalgia. Japanese "komorebi" — sunlight filtering through leaves. Danish "hygge" — cozy togetherness. German "Schadenfreude" — pleasure at others\' misfortune. These aren\'t just vocabulary gaps — they represent cognitive categories that speakers of other languages don\'t habitually notice.',
  },
  {
    label: 'The Most Endangered',
    detail:
      'Over 500 languages have fewer than 10 speakers. Languages in greatest danger: indigenous languages of Australia (many with 1–5 elderly speakers), native Siberian languages, indigenous languages of the Americas, and minority languages of Southeast Asia. The Amazon basin, Papua New Guinea, and Aboriginal Australia are the world\'s linguistic "hotspots" — areas of extreme diversity and extreme threat.',
  },
];

// ── Section 9: Language Revival ─────────────────────────────────────────────

const REVIVAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'Hebrew: The Only Full Revival',
    detail:
      'Hebrew is the only language in history to be fully revived from "death" to everyday use. For approximately 1,700 years, Hebrew had no native speakers — it was used only for religious texts, prayer, and scholarly writing. Then Eliezer Ben-Yehuda (1858–1922), a Lithuanian Jew, moved to Palestine and refused to speak anything but Hebrew. He invented over 1,000 modern words: "newspaper" (iton), "dictionary" (milon), "towel" (magevet), "ice cream" (glida). He raised the first native Hebrew speaker in modern history — his son, Ben-Zion. Today: 9 million speakers.',
  },
  {
    label: 'Ben-Yehuda\'s Obsession',
    detail:
      'Ben-Yehuda\'s commitment was extreme. He forbade his wife from speaking anything but Hebrew to their children, even though she barely knew the language. He refused to let visitors speak other languages in his home. Neighbors thought he was insane. His son Ben-Zion was reportedly a late talker — unsurprising, since he was learning a language that lacked modern vocabulary. Ben-Yehuda spent decades compiling a 17-volume Complete Dictionary of Ancient and Modern Hebrew, working until his death.',
  },
  {
    label: 'Māori: Immersion Schools as Revival Engine',
    detail:
      'By the 1970s, Māori language use in New Zealand had declined catastrophically — fewer than 10,000 fluent speakers remained. The Kōhanga Reo ("language nest") movement, beginning in 1982, created Māori-immersion preschools where children were taught entirely in Māori by fluent elders. This expanded to Māori-medium primary and secondary schools. Combined with a Māori-language TV channel (2004), the number of speakers has grown to approximately 150,000.',
  },
  {
    label: 'Welsh: A Qualified Success',
    detail:
      'Welsh was in severe decline by the mid-20th century, with English dominant across Wales. Government intervention reversed the trend: Welsh-medium schools now educate ~25% of Welsh children, the TV channel S4C broadcasts entirely in Welsh, and Welsh is a required subject in all schools. Today: approximately 880,000 speakers (29% of the Welsh population). The decline has been arrested, but daily use outside education and media remains challenging.',
  },
  {
    label: 'Irish: Policy Without Practice',
    detail:
      'The Irish language has massive institutional support: it is the first official language of Ireland, required in schools, and used in government. Yet daily speakers number only about 80,000, mostly in small Gaeltacht regions. The gap between policy and practice illustrates a hard truth: government support alone cannot revive a language. Revival requires communities of speakers who actually use the language in daily life — not just students who pass exams in it.',
  },
];

// ── Section 10: Linguistic Relativity ───────────────────────────────────────

const RELATIVITY_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Sapir-Whorf Hypothesis',
    detail:
      'Does the language you speak shape the way you think? Edward Sapir and Benjamin Lee Whorf proposed that it does — that the structure of a language influences (or even determines) its speakers\' worldview and cognition. This is one of the most debated ideas in all of linguistics and cognitive science.',
  },
  {
    label: 'Strong Version: Discredited',
    detail:
      'Whorf\'s strongest claim — that language determines thought, that speakers of different languages literally cannot think the same thoughts — has been largely discredited. All humans share the same basic cognitive architecture. People can learn new concepts even when their language lacks words for them. Bilingual speakers don\'t have split personalities with incompatible worldviews.',
  },
  {
    label: 'Weak Version: Supported by Evidence',
    detail:
      'The weaker claim — that language influences some aspects of perception and thought — has substantial experimental support. Russian speakers, who have separate basic words for light blue (goluboy) and dark blue (siniy), can distinguish shades of blue faster than English speakers. Speakers of languages that use absolute directions ("the cup is to the north") rather than relative directions ("the cup is to the left") maintain better spatial orientation.',
  },
  {
    label: 'The Pirahã: A Linguistic Puzzle',
    detail:
      'The Pirahã people of the Amazon speak a language with no number words (not even "one" or "two"), no embedded clauses, no color terms beyond light and dark, and arguably no past or future tense. Linguist Daniel Everett, who spent decades with the Pirahã, claims their language reflects a cultural principle of "immediacy of experience" — they focus entirely on the present and directly witnessed events. His claims are controversial and have been challenged by Noam Chomsky and others.',
  },
  {
    label: 'The Hopi Time Controversy',
    detail:
      'Whorf\'s most famous claim was that the Hopi language had no concept of time — no past, present, or future tense — and therefore Hopi speakers experienced time fundamentally differently from English speakers. Later research by linguist Ekkehart Malotki showed this was wrong: Hopi does mark time, just differently than English. The episode illustrates both the appeal and the danger of the Sapir-Whorf hypothesis: it\'s an exciting idea that invites overstatement.',
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
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ padding: '48px 0', borderTop: `2px solid ${accentColor}33` }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: accentColor,
            marginBottom: 12,
            lineHeight: 1.3,
          }}
        >
          {icon} {title}
        </h2>
        <p style={{ color: ASH, fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 800, marginBottom: 28 }}>
          {intro}
        </p>
        {children}
      </motion.div>
    </section>
  );
}

function InsightGrid({ items }: { items: InsightEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: 18,
          }}
        >
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
            {item.label}
          </h4>
          <p style={{ fontSize: '0.9rem', color: ASH, lineHeight: 1.65 }}>{item.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}

function TimelineCard({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {entries.map((entry, i) => (
        <motion.div
          key={entry.title}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${entry.color}`,
            paddingLeft: 18,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: entry.color,
              position: 'absolute',
              left: -5.5,
              top: 6,
            }}
          />
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: entry.color, textTransform: 'uppercase', marginBottom: 4 }}>
            {entry.year}
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
            {entry.title}
          </div>
          <p style={{ fontSize: '0.9rem', color: ASH, lineHeight: 1.65 }}>{entry.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

function FamilyGrid({ families }: { families: FamilyEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {families.map((fam, i) => (
        <motion.div
          key={fam.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${ACCENT_COLORS[i % ACCENT_COLORS.length]}33`,
            borderRadius: 10,
            padding: 18,
          }}
        >
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: ACCENT_COLORS[i % ACCENT_COLORS.length], marginBottom: 4 }}>
            {fam.name}
          </h4>
          <div style={{ fontSize: '0.8rem', color: SLATE, marginBottom: 8 }}>{fam.speakers}</div>
          <div style={{ fontSize: '0.85rem', color: SKY, marginBottom: 8, fontStyle: 'italic' }}>{fam.examples}</div>
          <p style={{ fontSize: '0.9rem', color: ASH, lineHeight: 1.65 }}>{fam.note}</p>
        </motion.div>
      ))}
    </div>
  );
}

function StatCallout({ stat, description }: { stat: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        padding: '18px 24px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'baseline',
        gap: 14,
      }}
    >
      <span style={{ fontSize: '1.6rem', fontWeight: 800, color: GOLD, whiteSpace: 'nowrap' }}>{stat}</span>
      <span style={{ fontSize: '0.95rem', color: ASH, lineHeight: 1.5 }}>{description}</span>
    </motion.div>
  );
}

function ConnectionLinks() {
  const links = [
    { to: '/history-of-writing', label: 'History of Writing', note: 'How language was captured in symbols' },
    { to: '/ancient-egypt', label: 'Ancient Egypt', note: 'Hieroglyphics and the Rosetta Stone' },
    { to: '/mesopotamia', label: 'Mesopotamia', note: 'Cuneiform — the first writing' },
    { to: '/british-empire', label: 'British Empire', note: 'How English conquered the world' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginTop: 24 }}>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          style={{
            display: 'block',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '14px 18px',
            textDecoration: 'none',
            transition: 'border-color 0.15s',
          }}
        >
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: BLUE }}>{link.label}</div>
          <div style={{ fontSize: '0.8rem', color: SLATE, marginTop: 4 }}>{link.note}</div>
        </Link>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function HistoryOfLanguagePage() {
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
    <div style={{ background: '#070e22', color: '#f1f5f9', minHeight: '100vh', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>

        {/* ── Back link ─────────────────────────────────────────────────── */}
        <div style={{ padding: '24px 0 0' }}>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </div>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <header style={{ padding: '40px 0' }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 20,
              background: `linear-gradient(135deg, ${AMBER}, ${TEAL})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The First Technology — History of Human Language (200,000 BCE–Present)
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p style={{ color: ASH, fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 800, marginBottom: 14 }}>
              There are 7,100 living languages on Earth today. One dies every two weeks. Half the world's population speaks one of just 23 languages — the other half speaks the remaining 7,077. Language is the most powerful technology humans ever invented: older than fire control, older than agriculture, older than civilization itself. It is the medium through which all other human achievements are transmitted. And it is vanishing faster than the rainforest.
            </p>
            <p style={{ color: SLATE, fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 800 }}>
              This page traces the full arc of human language — from its mysterious origins in prehistoric Africa, through the great language families that span continents, to the accelerating crisis of language death and the remarkable stories of languages brought back from the brink.
            </p>
          </motion.div>
        </header>

        {/* ── Key Stats ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <StatCallout stat="7,100" description="living languages today — but one dies every two weeks" />
          <StatCallout stat="3 billion" description="people speak a language descended from Proto-Indo-European, a single tongue spoken by nomads on the Ukrainian steppe ~4500 BCE" />
          <StatCallout stat="50%" description="of current languages predicted extinct by 2100" />
          <StatCallout stat="1.5 billion" description="English speakers worldwide — most as a second language; the language grew from ~2 million speakers in 1600" />
          <StatCallout stat="1" description="dead language ever fully revived to modern use: Hebrew, after 1,700 years without native speakers" />
        </div>

        {/* ── Section 1: Origins ────────────────────────────────────────── */}
        <SectionWrapper
          id="origins"
          icon="🧬"
          title="The Mystery of Language Origins"
          accentColor={PURPLE}
          intro="Language is the defining human trait — and we have no idea exactly when or how it evolved. No fossils of speech survive. We are left with indirect evidence, educated guesses, and one gene."
        >
          <InsightGrid items={ORIGINS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 2: How Many Languages ─────────────────────────────── */}
        <SectionWrapper
          id="count"
          icon="🌍"
          title="How Many Languages Exist — and What Counts"
          accentColor={TEAL}
          intro="The answer depends on politics as much as linguistics. The line between 'language' and 'dialect' is drawn by armies, not by grammarians."
        >
          <InsightGrid items={LANGUAGE_COUNT_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 3: Language Families ───────────────────────────────── */}
        <SectionWrapper
          id="families"
          icon="🌳"
          title="The World's Language Families"
          accentColor={GREEN}
          intro="Nearly all of the world's 7,100 languages belong to a few dozen language families — groups of languages descended from a common ancestor. The largest families span continents and billions of speakers."
        >
          <FamilyGrid families={LANGUAGE_FAMILIES} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              marginTop: 24,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${GREEN}33`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: GREEN, marginBottom: 8 }}>
              Language Family World Map (Conceptual)
            </h4>
            <p style={{ fontSize: '0.9rem', color: ASH, lineHeight: 1.65 }}>
              Imagine a world map colored by language family: Indo-European dominates Europe, the Americas, Iran, and northern India in a single color — revealing the staggering reach of those Pontic steppe nomads.
              Sino-Tibetan covers China and mainland Southeast Asia. Niger-Congo blankets Sub-Saharan Africa. Austronesian dots the entire Pacific Ocean.
              And scattered across the map, small islands of color with no relatives: Basque in Spain, Korean in Korea, Ainu in Japan — ancient survivors surrounded by later arrivals.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── Section 4: Proto-Indo-European ─────────────────────────────── */}
        <SectionWrapper
          id="pie"
          icon="🏇"
          title="Proto-Indo-European: The Ancestor Language"
          accentColor={AMBER}
          intro="Linguists reconstructed a language that was never written down and has been dead for 6,000 years — and then archaeologists and geneticists confirmed they were right."
        >
          <InsightGrid items={PIE_INSIGHTS} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              marginTop: 24,
              background: `rgba(217,119,6,0.08)`,
              border: `1px solid ${AMBER}44`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: AMBER, marginBottom: 8 }}>
              The Word for "Foot" Across 6,000 Years
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#f1f5f9', lineHeight: 1.8, fontFamily: 'monospace' }}>
              *pṓds (PIE) → poús (Greek) → pēs (Latin) → foot (English) → Fuß (German) → pied (French) → pāda (Sanskrit)
            </p>
            <p style={{ fontSize: '0.85rem', color: ASH, lineHeight: 1.65, marginTop: 8 }}>
              These aren't coincidences — they are systematic sound changes that follow predictable rules (Grimm's Law, among others). This regularity is what allowed the reconstruction of an entire language from its descendants.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── Section 5: Writing Systems ─────────────────────────────────── */}
        <SectionWrapper
          id="writing"
          icon="✍️"
          title="Writing Systems: Technology Applied to Language"
          accentColor={GOLD}
          intro="Language exists without writing — humans spoke for at least 195,000 years before anyone wrote anything down. Writing is a technology invented independently only 3–4 times in human history, then borrowed and adapted everywhere else."
        >
          <TimelineCard entries={WRITING_TIMELINE} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              marginTop: 24,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${GOLD}33`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: GOLD, marginBottom: 8 }}>
              The Alphabet Revolution
            </h4>
            <p style={{ fontSize: '0.9rem', color: ASH, lineHeight: 1.65 }}>
              The invention of alphabetic writing was perhaps the most democratizing technology before the printing press. Cuneiform required learning hundreds of symbols; Chinese characters require thousands. But an alphabet — where each symbol represents a single sound — needs only 25–30 symbols to write any word in any language. This made literacy achievable for ordinary people, not just trained scribes. Most writing systems in use today descend from the Phoenician alphabet of ~1050 BCE.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── Section 5b: Chinese Characters ──────────────────────────────── */}
        <SectionWrapper
          id="chinese"
          icon="🀄"
          title="Chinese Characters: 3,000 Years and Counting"
          accentColor={CRIMSON}
          intro="The only ancient writing system still in continuous use. Over 50,000 characters exist, each one a unit of meaning rather than sound — a fundamentally different approach to writing that has unified a linguistically fragmented civilization for millennia."
        >
          <InsightGrid items={CHINESE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 5c: The Great Vowel Shift ────────────────────────────── */}
        <SectionWrapper
          id="vowel-shift"
          icon="🔊"
          title="The Great Vowel Shift (1400–1700)"
          accentColor={CORAL}
          intro="Why does 'cough' rhyme with 'off' but not with 'through' or 'though'? Why is the 'k' in 'knight' silent? Blame a 300-year chain reaction in English pronunciation that happened AFTER spelling was standardized."
        >
          <InsightGrid items={VOWEL_SHIFT_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 5d: Lingua Francas ────────────────────────────────────── */}
        <SectionWrapper
          id="lingua-francas"
          icon="🌍"
          title="Lingua Francas Through History"
          accentColor={GREEN}
          intro="Every era has a dominant language — not always the one with the most native speakers, but the one with the most power behind it. The story of lingua francas is the story of empire, trade, religion, and cultural prestige."
        >
          <TimelineCard entries={LINGUA_FRANCA_TIMELINE} />
        </SectionWrapper>

        {/* ── Section 5e: Creoles and Pidgins ──────────────────────────────── */}
        <SectionWrapper
          id="creoles"
          icon="🌱"
          title="Creoles and Pidgins: How New Languages Are Born"
          accentColor={LIME}
          intro="Languages don't just die — they are also born. When speakers of different languages are thrown together by trade, slavery, or colonization, entirely new languages can emerge in a single generation."
        >
          <InsightGrid items={CREOLE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 5f: Digital Age ──────────────────────────────────────── */}
        <SectionWrapper
          id="digital"
          icon="💬"
          title="Language in the Digital Age"
          accentColor={SKY}
          intro="For the first time in human history, machines are actively shaping how we use language. Emoji, autocorrect, algorithms, and AI are changing not just how we communicate — but what we say."
        >
          <InsightGrid items={DIGITAL_INSIGHTS} />
        </SectionWrapper>

        {/* ── Linguistic Milestones ────────────────────────────────────────── */}
        <SectionWrapper
          id="milestones"
          icon="📜"
          title="Notable Linguistic Milestones"
          accentColor={GOLD}
          intro="From the first words spoken by our ancestors to neural machine translation — the key moments that shaped how humanity communicates."
        >
          <TimelineCard entries={MILESTONES_TIMELINE} />
        </SectionWrapper>

        {/* ── Section 6: The Latin Legacy ────────────────────────────────── */}
        <SectionWrapper
          id="latin"
          icon="🏛️"
          title="The Latin Legacy"
          accentColor={INDIGO}
          intro="A language spoken by roughly 2 million people at Rome's peak became the ancestor of Spanish, French, Portuguese, Italian, and Romanian — and contributes 60% of English vocabulary."
        >
          <InsightGrid items={LATIN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 7: The Spread of English ──────────────────────────── */}
        <SectionWrapper
          id="english"
          icon="🌐"
          title="The Spread of English"
          accentColor={BLUE}
          intro="English began as an obscure West Germanic dialect spoken by a few thousand people on the North Sea coast. Through invasion, colonization, and cultural dominance, it became the most widely spoken language in human history."
        >
          <TimelineCard entries={ENGLISH_TIMELINE} />
        </SectionWrapper>

        {/* ── Section 8: Language Death ──────────────────────────────────── */}
        <SectionWrapper
          id="death"
          icon="🕯️"
          title="Language Death: Each One a Library Burning"
          accentColor={ROSE}
          intro="Languages are dying faster than species. When the last speaker of a language dies, an irreplaceable archive of human knowledge, accumulated over centuries, vanishes forever."
        >
          <InsightGrid items={DEATH_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 9: Language Revival ────────────────────────────────── */}
        <SectionWrapper
          id="revival"
          icon="🔥"
          title="Language Revival: Bringing the Dead Back to Life"
          accentColor={LIME}
          intro="Can a dead language be revived? In almost all cases, no. But one extraordinary success — Hebrew — proves it is not impossible. And several endangered languages are fighting back."
        >
          <InsightGrid items={REVIVAL_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 10: Linguistic Relativity ──────────────────────────── */}
        <SectionWrapper
          id="relativity"
          icon="🧠"
          title="Linguistic Relativity: Does Language Shape Reality?"
          accentColor={CORAL}
          intro="If you speak a different language, do you literally see the world differently? The Sapir-Whorf hypothesis says yes — and the evidence is more interesting than you might expect."
        >
          <InsightGrid items={RELATIVITY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Connections ────────────────────────────────────────────────── */}
        <section style={{ padding: '48px 0', borderTop: '2px solid rgba(255,255,255,0.08)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
              Related Deep Dives
            </h2>
            <p style={{ color: ASH, fontSize: '0.95rem', marginBottom: 16 }}>
              Language connects to everything. Explore how writing was invented, how empires spread languages, and how civilizations encoded knowledge.
            </p>
            <ConnectionLinks />
          </motion.div>
        </section>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px 0 48px', textAlign: 'center' }}>
          <p style={{ color: SLATE, fontSize: '0.9rem', fontStyle: 'italic', marginBottom: 16 }}>
            "The limits of my language mean the limits of my world." — Ludwig Wittgenstein
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </footer>

      </div>
    </div>
  );
}
