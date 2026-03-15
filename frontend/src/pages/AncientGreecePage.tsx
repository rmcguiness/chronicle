import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────── Theme ───────── */
const ACCENT = '#1a6db5';   // Aegean blue
const BG = '#0a0c10';
const TEXT = '#e8e4de';
const TEXT_DIM = '#9a9486';
const TEXT_MUTED = '#6b6458';
const CARD_BG = 'rgba(26,109,181,0.05)';
const CARD_BORDER = 'rgba(26,109,181,0.18)';
const GOLD = '#c9a84c';
const OLIVE = '#6b8e23';
const MARBLE = '#d4c5a9';
const WINE = '#722f37';
const TEAL = '#1a8a7d';
const PURPLE = '#6b3fa0';
const BRONZE = '#cd7f32';

/* ───────── Types ───────── */
type SectionTab =
  | 'timeline'
  | 'citystates'
  | 'democracy'
  | 'persian'
  | 'golden'
  | 'peloponnesian'
  | 'figures'
  | 'religion'
  | 'achievements'
  | 'alexander'
  | 'hellenistic'
  | 'legacy';

interface Period {
  name: string;
  years: string;
  events: { date: string; title: string; detail: string }[];
  color: string;
}

interface Figure {
  name: string;
  dates: string;
  category: string;
  contribution: string;
  detail: string;
  icon: string;
  color: string;
}

interface Olympian {
  name: string;
  domain: string;
  symbol: string;
  icon: string;
}

interface Achievement {
  title: string;
  description: string;
  detail: string;
  icon: string;
  color: string;
}

/* ───────── Data ───────── */

const PERIODS: Period[] = [
  {
    name: 'Dark Ages',
    years: '1100–800 BCE',
    color: TEXT_MUTED,
    events: [
      { date: 'c. 1100', title: 'Collapse of Mycenaean civilization', detail: 'The palace cultures of Mycenae, Tiryns, and Pylos collapse amid invasions, earthquakes, and trade disruption, plunging Greece into centuries of decline.' },
      { date: 'c. 1050', title: 'Loss of writing', detail: 'Linear B script disappears along with palatial bureaucracy. Greece enters an illiterate period lasting roughly 300 years.' },
      { date: 'c. 900', title: 'Proto-geometric pottery emerges', detail: 'New pottery styles with geometric designs signal cultural revival and regional identity formation.' },
      { date: 'c. 850', title: 'Rise of the polis', detail: 'Scattered communities begin coalescing into city-states (poleis), each developing its own identity, laws, and governance.' },
      { date: 'c. 800', title: 'Adoption of the Phoenician alphabet', detail: 'Greeks adapt the Phoenician consonantal script by adding vowels, creating the first true alphabet — the ancestor of Latin and Cyrillic scripts.' },
    ],
  },
  {
    name: 'Archaic Period',
    years: '800–480 BCE',
    color: BRONZE,
    events: [
      { date: 'c. 776', title: 'First Olympic Games', detail: 'The first recorded games at Olympia honor Zeus. A four-year cycle (Olympiad) becomes the standard Greek chronological unit.' },
      { date: 'c. 750', title: 'Homer composes the Iliad and Odyssey', detail: 'These epic poems define Greek heroic values, religious thought, and literary tradition for millennia. They are the oldest surviving works of Western literature.' },
      { date: 'c. 750–550', title: 'Great Colonization', detail: 'Greek city-states establish colonies from the Black Sea to southern France and Libya, spreading Greek culture, trade networks, and the alphabet across the Mediterranean.' },
      { date: 'c. 700', title: 'Hesiod writes Theogony and Works and Days', detail: 'Hesiod systematizes Greek mythology (Theogony) and provides a farmer\'s almanac with moral instruction (Works and Days).' },
      { date: '621', title: 'Draco\'s law code in Athens', detail: 'Draco publishes Athens\' first written legal code — famously harsh (hence "draconian") but revolutionary in replacing oral aristocratic justice with written, public law.' },
      { date: '594', title: 'Solon\'s reforms', detail: 'Solon abolishes debt slavery, creates four property classes, and opens the Assembly to all citizens — laying early foundations for Athenian democracy.' },
      { date: '508', title: 'Cleisthenes\' democratic reforms', detail: 'Cleisthenes reorganizes Athens into 10 tribes based on residence (not kinship), creates the Council of 500, and establishes ostracism — effectively founding Athenian democracy.' },
    ],
  },
  {
    name: 'Classical Period',
    years: '480–323 BCE',
    color: ACCENT,
    events: [
      { date: '480', title: 'Battles of Thermopylae and Salamis', detail: 'Leonidas\' 300 Spartans delay Xerxes at Thermopylae while Themistocles destroys the Persian fleet at Salamis, saving Greece from conquest.' },
      { date: '479', title: 'Battle of Plataea', detail: 'The combined Greek army under Spartan command decisively defeats the Persian land forces, ending Xerxes\' invasion of Greece permanently.' },
      { date: '478', title: 'Delian League founded', detail: 'Athens organizes an alliance of Greek states against Persia. The league\'s treasury moves to Athens in 454, effectively becoming an Athenian empire.' },
      { date: '461–429', title: 'Age of Pericles', detail: 'Under Pericles\' leadership, Athens reaches its zenith: the Parthenon is built, drama and philosophy flourish, and radical democracy is perfected.' },
      { date: '447–432', title: 'Construction of the Parthenon', detail: 'Architects Iktinos and Kallikrates, with sculptor Phidias, build the temple of Athena on the Acropolis — the supreme example of Doric architecture.' },
      { date: '431–404', title: 'Peloponnesian War', detail: 'Athens and Sparta fight a devastating 27-year war. Athens falls in 404, ending its golden age and permanently weakening the Greek city-state system.' },
      { date: '399', title: 'Trial and death of Socrates', detail: 'Socrates is tried for impiety and corrupting the youth. He refuses exile, drinks hemlock, and becomes philosophy\'s first martyr.' },
      { date: '338', title: 'Battle of Chaeronea', detail: 'Philip II of Macedon defeats the combined forces of Athens and Thebes, effectively ending Greek city-state independence.' },
      { date: '336–323', title: 'Alexander the Great\'s reign', detail: 'Alexander conquers the Persian Empire, Egypt, and reaches India, creating the largest empire the ancient world had seen and spreading Greek culture from the Mediterranean to Central Asia.' },
    ],
  },
  {
    name: 'Hellenistic Period',
    years: '323–146 BCE',
    color: GOLD,
    events: [
      { date: '323', title: 'Death of Alexander; Wars of the Diadochi', detail: 'Alexander dies in Babylon aged 32. His generals (Diadochi) fight for 40 years, ultimately splitting the empire into Ptolemaic Egypt, Seleucid Asia, and Antigonid Macedon.' },
      { date: 'c. 300', title: 'Library of Alexandria founded', detail: 'Ptolemy I establishes the world\'s greatest repository of knowledge in Egypt. At its peak it holds an estimated 400,000+ scrolls.' },
      { date: 'c. 300', title: 'Euclid writes the Elements', detail: 'Working in Alexandria, Euclid compiles the definitive textbook of geometry — used for over 2,000 years and still the foundation of geometric proof.' },
      { date: 'c. 250', title: 'Archimedes\' discoveries', detail: 'In Syracuse, Archimedes discovers the principle of buoyancy, calculates pi, invents compound pulleys and the Archimedean screw, and lays foundations for calculus.' },
      { date: '146', title: 'Roman conquest of Greece', detail: 'Rome destroys Corinth and absorbs Greece as the province of Achaea. Greek culture, however, conquers Rome intellectually — "Captive Greece captured her fierce conqueror."' },
    ],
  },
  {
    name: 'Roman Absorption',
    years: '146 BCE onward',
    color: WINE,
    events: [
      { date: '146 BCE', title: 'Greece becomes Roman province', detail: 'The destruction of Corinth marks the end of Greek political independence. Greece becomes the province of Achaea under Roman administration.' },
      { date: '86 BCE', title: 'Sulla sacks Athens', detail: 'Roman general Sulla besieges and sacks Athens during the Mithridatic Wars, though the city retains its cultural prestige.' },
      { date: '31 BCE', title: 'Battle of Actium', detail: 'Octavian defeats Cleopatra and Mark Antony, ending the last Hellenistic kingdom (Ptolemaic Egypt) and completing Roman control of the Greek world.' },
      { date: '2nd c. CE', title: 'Greek cultural renaissance under Rome', detail: 'Emperors like Hadrian patronize Greek culture. Athens receives grand buildings. Greek remains the language of education, philosophy, and the eastern Empire.' },
      { date: '393 CE', title: 'Olympic Games abolished', detail: 'Emperor Theodosius I bans the Olympics as a pagan festival, ending over 1,000 years of athletic competition at Olympia.' },
    ],
  },
];

const CITY_STATE_COMPARISON: { category: string; athens: string; sparta: string }[] = [
  { category: 'Government', athens: 'Direct democracy — citizens vote on laws in the Assembly (Ekklesia). Council of 500 sets agenda. Sortition (random selection) fills most offices.', sparta: 'Mixed constitution — two hereditary kings (military commanders), 28-member Gerousia (senate of elders), and Apella (assembly of citizens). Ephors wielded real executive power.' },
  { category: 'Military', athens: 'Citizen-soldiers (hoplites) served when called; navy was Athens\' true strength. Triremes dominated the Aegean after Salamis. Military service from 18–60.', sparta: 'Professional army — boys entered the agoge at age 7 for brutal military training. Full-time warriors from 20–60. Considered the finest infantry in Greece.' },
  { category: 'Education', athens: 'Private tutors taught reading, writing, music, gymnastics, rhetoric, and philosophy. Education aimed at producing well-rounded citizens (kalokagathia).', sparta: 'State-controlled agoge from age 7: physical endurance, combat training, communal living, minimal literacy. Goal: producing fearless, disciplined warriors.' },
  { category: 'Women\'s Roles', athens: 'Women had no political rights, rarely left the house, couldn\'t own property. Married young (14–15) to older men. Confined largely to the domestic sphere.', sparta: 'Relatively liberated — women exercised, owned 40% of land, managed estates while men were at barracks. Could speak freely. Married later (18–20).' },
  { category: 'Economy', athens: 'Trade-based economy: pottery, silver (Laurion mines), olive oil. Athens\' port Piraeus was the busiest in the Mediterranean. Used coined money extensively.', sparta: 'Agricultural economy based on helot (serf) labor. Deliberately used heavy iron bars as currency to discourage trade. Spartans were forbidden from engaging in commerce.' },
  { category: 'Culture', athens: 'Cultural capital of Greece — drama (Sophocles, Euripides), philosophy (Socrates, Plato), history (Thucydides), art, and architecture (Parthenon).', sparta: 'Austere culture — valued brevity (laconic speech), obedience, and martial virtue. Limited art and literature. "Come back with your shield or on it."' },
];

const OTHER_CITY_STATES = [
  { name: 'Corinth', detail: 'Wealthy trade hub controlling the isthmus between mainland Greece and the Peloponnese. Famous for its pottery, shipbuilding, and the Corinthian order of architecture. Founded colonies including Syracuse.', icon: '⚓', color: TEAL },
  { name: 'Thebes', detail: 'Dominant power of Boeotia. Under Epaminondas, Thebes defeated Sparta at Leuctra (371 BCE) and briefly became the strongest Greek state. Home of the legendary Sacred Band — 150 pairs of male lovers who fought as elite shock troops.', icon: '🦁', color: PURPLE },
  { name: 'Argos', detail: 'One of the oldest continuously inhabited cities in the world. Rival of Sparta in the Peloponnese. Remained neutral during the Persian Wars. Known for its sculptors, especially Polykleitos, who defined ideal human proportions.', icon: '🏛️', color: OLIVE },
];

const DEMOCRACY_DETAILS = {
  reforms: [
    { title: 'Cleisthenes\' tribal system (508 BCE)', detail: 'Replaced the four old kinship tribes with 10 new tribes based on residence (demes). Each tribe mixed urban, coastal, and inland citizens — breaking aristocratic power and creating cross-class solidarity.' },
    { title: 'Council of 500 (Boule)', detail: '50 men from each tribe, chosen by lot, served one-year terms. They set the Assembly agenda, managed finances, and oversaw daily governance. No one could serve more than twice in a lifetime.' },
    { title: 'The Assembly (Ekklesia)', detail: 'Any of Athens\' ~30,000 male citizens could attend, debate, and vote. Met 40+ times per year on the Pnyx hill. Decisions required a quorum of 6,000. Votes were by show of hands.' },
    { title: 'Ostracism', detail: 'Once a year, citizens could vote to exile any person for 10 years by scratching a name on a pottery shard (ostrakon). Required 6,000 votes. Designed to prevent tyranny — the exiled person kept their property.' },
    { title: 'Sortition (selection by lot)', detail: 'Most officials were chosen randomly from eligible citizens, not elected. This prevented campaigning and ensured ordinary citizens held power. Only generals (strategoi) and financial officers were elected.' },
    { title: 'Pay for public service', detail: 'Pericles introduced pay for jurors, council members, and assembly attendees — enabling poorer citizens to participate without losing a day\'s wages.' },
  ],
  limitations: [
    'Only adult male citizens could participate — roughly 10–15% of the population',
    'Women had no political rights whatsoever',
    'Slaves (perhaps 30–40% of the population) were entirely excluded',
    'Metics (resident foreigners) paid taxes and served in the army but could not vote',
    'The system could be swayed by skilled orators (demagogues)',
    'Decisions made in the heat of passion were sometimes disastrous (e.g., the Mytilenean debate)',
  ],
  whyItMatters: 'Athens\' experiment proved that ordinary citizens — not just aristocrats or kings — could govern effectively. The concepts of civic participation, rule of law, public debate, accountability through elections, and trial by jury all trace directly to Athenian democracy. When the American Founders designed the Constitution, they studied Athens intensely, adopting and adapting its ideas for a new era.',
};

const PERSIAN_WARS = [
  {
    name: 'Battle of Marathon',
    date: '490 BCE',
    context: 'Darius I sent a punitive expedition against Athens for supporting the Ionian Revolt. A Persian force of ~25,000 landed at Marathon, 26 miles from Athens.',
    outcome: 'Athenian general Miltiades led 10,000 hoplites in a bold attack, strengthening the wings and deliberately weakening the center. The Persians broke through the middle but were enveloped from both sides. Persia lost ~6,400 men; Athens only 192. The runner Pheidippides legendarily ran to Athens with news of victory — inspiring the modern marathon.',
    icon: '🏃',
    color: ACCENT,
  },
  {
    name: 'Battle of Thermopylae',
    date: '480 BCE',
    context: 'Xerxes I invaded Greece with an army of 100,000–300,000 men (ancient sources say millions). King Leonidas of Sparta led 300 Spartans and ~7,000 allies to hold the narrow coastal pass at Thermopylae.',
    outcome: 'For two days the Greeks held the pass, slaughtering wave after wave of Persians in the narrow defile. When a traitor (Ephialtes) revealed a mountain path, Leonidas dismissed most allies and made a last stand with 300 Spartans, 700 Thespians, and 400 Thebans. All died. Their sacrifice bought time for Greece to prepare and became the ultimate symbol of courage against impossible odds. "Go tell the Spartans, stranger passing by, that here obedient to their laws we lie."',
    icon: '⚔️',
    color: WINE,
  },
  {
    name: 'Battle of Salamis',
    date: '480 BCE',
    context: 'After Thermopylae, Xerxes burned Athens. The Greek fleet of ~370 triremes, commanded by Themistocles, retreated to the narrow straits between Salamis island and the mainland.',
    outcome: 'Themistocles lured the larger Persian fleet (~800 ships) into the narrow straits where their numbers became a disadvantage. Greek triremes rammed and boarded the crowded Persian ships. Xerxes watched from a throne on shore as his fleet was destroyed. He retreated to Asia, leaving his general Mardonius with a land army. Salamis saved Greek civilization.',
    icon: '🚢',
    color: TEAL,
  },
  {
    name: 'Battle of Plataea',
    date: '479 BCE',
    context: 'Mardonius wintered in Thessaly with ~70,000 troops and offered Athens generous terms to switch sides. Athens refused. A combined Greek army of ~40,000 hoplites under Spartan regent Pausanias marched to confront him.',
    outcome: 'After days of maneuvering in Boeotia, the Greeks attacked. The Spartan phalanx broke the Persian center in fierce fighting. Mardonius was killed. The Persian army collapsed. On the same day, tradition says, the Greek fleet destroyed Persian remnants at Mycale in Ionia. The Persian threat to mainland Greece was over forever.',
    icon: '🛡️',
    color: GOLD,
  },
];

const GOLDEN_AGE = {
  pericles: 'Pericles (c. 495–429 BCE) dominated Athenian politics for 30 years. An aristocrat who championed radical democracy, he expanded pay for public service, built the Parthenon and other Acropolis monuments with Delian League funds, patronized the arts, and led Athens\' imperial expansion. His Funeral Oration (recorded by Thucydides) remains the greatest articulation of democratic ideals: "We do not say that a man who takes no interest in politics minds his own business; we say he has no business here at all."',
  parthenon: 'Built 447–432 BCE on the Acropolis, the Parthenon is the supreme expression of Doric architecture. Designed by Iktinos and Kallikrates with sculptural program by Phidias, it housed a 40-foot gold-and-ivory statue of Athena. Its columns employ subtle optical refinements — slight curves and tilts — to appear perfectly straight. The Elgin Marbles (Parthenon sculptures) remain a source of international controversy.',
  delianLeague: 'Originally a voluntary alliance against Persia (478 BCE), the Delian League became an Athenian empire. Athens moved the treasury from Delos to Athens (454 BCE) and used allied tribute to fund its building program. States that tried to leave were crushed militarily. By 440 BCE, Athens controlled 150–330 subject states across the Aegean.',
  arts: [
    { name: 'Tragedy', detail: 'Aeschylus, Sophocles, and Euripides transformed ritual into art. Annual festivals (City Dionysia) saw playwrights compete before audiences of 15,000. Sophocles\' Oedipus Rex remains the model of dramatic irony.', icon: '🎭' },
    { name: 'Comedy', detail: 'Aristophanes mocked politicians (Cleon), philosophers (Socrates in The Clouds), and even the war itself (Lysistrata). Old Comedy was fearlessly satirical — democracy\'s immune system.', icon: '😂' },
    { name: 'Philosophy', detail: 'Socrates questioned everything in the Agora. Plato founded the Academy (c. 387). Anaxagoras proposed the sun was a hot rock (and was exiled for it). Athens became the philosophical capital of the world.', icon: '🤔' },
    { name: 'History', detail: 'Herodotus ("Father of History") wrote the first systematic historical narrative. Thucydides then set the standard for critical, evidence-based history with his account of the Peloponnesian War.', icon: '📜' },
    { name: 'Sculpture & Art', detail: 'Phidias created the Athena Parthenos and Zeus at Olympia (one of the Seven Wonders). The Classical style achieved idealized yet naturalistic human forms that defined Western aesthetics for centuries.', icon: '🗿' },
  ],
};

const PELOPONNESIAN_WAR = {
  overview: 'The great war between Athens (and its Delian League) and Sparta (and its Peloponnesian League) from 431–404 BCE devastated Greece. Thucydides wrote its definitive history, identifying the "truest cause" as Spartan fear of Athens\' growing power.',
  phases: [
    {
      name: 'Archidamian War (431–421)',
      detail: 'Sparta invaded Attica annually; Pericles\' strategy was to retreat behind Athens\' walls and rely on naval superiority. The plan was sound but a devastating plague struck Athens in 430, killing perhaps 25% of the population — including Pericles himself in 429. The demagogue Cleon rose to prominence. The war ground on until the Peace of Nicias in 421.',
      color: ACCENT,
    },
    {
      name: 'Sicilian Expedition (415–413)',
      detail: 'The charismatic but unreliable Alcibiades persuaded Athens to invade Syracuse in Sicily. Before the fleet departed, he was accused of sacrilege (mutilating statues of Hermes). He fled to Sparta and revealed Athenian plans. The expedition was a catastrophe: Athens lost 200 ships, ~40,000 men, and its best generals. It was the turning point of the war.',
      color: WINE,
    },
    {
      name: 'Ionian/Decelean War (413–404)',
      detail: 'Sparta fortified Decelea in Attica (per Alcibiades\' advice), cutting off Athens year-round. Alcibiades switched sides again, briefly returning to Athens. Persia funded Spartan shipbuilding. In 405, Spartan admiral Lysander destroyed the Athenian fleet at Aegospotami. Athens, besieged and starving, surrendered in 404.',
      color: GOLD,
    },
  ],
  aftermath: 'Sparta tore down Athens\' walls, dissolved the Delian League, and installed the Thirty Tyrants — an oligarchic puppet government that killed 1,500 Athenians in eight months. Democracy was restored in 403, but Athens never regained its imperial power. The war permanently weakened the Greek city-state system, paving the way for Macedonian dominance.',
};

const KEY_FIGURES: Figure[] = [
  // Philosophers
  { name: 'Socrates', dates: '470–399 BCE', category: 'Philosophy', contribution: 'The Socratic method — relentless questioning to expose contradictions and approach truth', detail: 'Wrote nothing; known through Plato\'s dialogues. Questioned Athenian assumptions about virtue, justice, and knowledge. Claimed to know only that he knew nothing. Convicted of impiety and corrupting the youth; chose death over exile.', icon: '🤔', color: ACCENT },
  { name: 'Plato', dates: '428–348 BCE', category: 'Philosophy', contribution: 'Theory of Forms, The Republic, founding of the Academy', detail: 'Student of Socrates. Argued that the physical world is a shadow of a higher reality of perfect Forms. The Republic outlines an ideal state governed by philosopher-kings. His Academy (c. 387 BCE) operated for over 900 years — the first institution of higher learning in the Western world.', icon: '📚', color: PURPLE },
  { name: 'Aristotle', dates: '384–322 BCE', category: 'Philosophy', contribution: 'Formal logic, empirical science, ethics, politics — systematized virtually all knowledge', detail: 'Student of Plato, tutor of Alexander the Great. Founded the Lyceum. Wrote on logic, physics, biology, ethics, politics, rhetoric, and poetry. His works dominated Western thought for 2,000 years. "The master of those who know" (Dante).', icon: '🧠', color: TEAL },
  { name: 'Epicurus', dates: '341–270 BCE', category: 'Philosophy', contribution: 'Epicureanism — pleasure (ataraxia/tranquility) as the highest good', detail: 'Founded the Garden school in Athens. Taught that happiness comes from simple pleasures, friendship, and freedom from fear (especially of death and the gods). Atomic materialist. Often mischaracterized as advocating indulgence — actually taught moderation.', icon: '🌿', color: OLIVE },
  { name: 'Zeno of Citium', dates: '334–262 BCE', category: 'Philosophy', contribution: 'Founded Stoicism — virtue, reason, and acceptance of fate', detail: 'Taught at the Stoa Poikile (Painted Porch) in Athens. Stoicism taught that virtue is the only true good, that we should focus on what we can control, and that reason aligns us with nature\'s order. Later adopted by Romans (Seneca, Epictetus, Marcus Aurelius).', icon: '🏛️', color: MARBLE },

  // Leaders
  { name: 'Pericles', dates: 'c. 495–429 BCE', category: 'Leadership', contribution: 'Led Athens during its Golden Age; champion of democracy and the arts', detail: 'Strategos (general) for 30 years. Expanded democracy, built the Parthenon, led Athenian imperialism. His Funeral Oration defined democratic ideals. Died in the plague of Athens in 429.', icon: '👑', color: GOLD },
  { name: 'Leonidas I', dates: 'died 480 BCE', category: 'Leadership', contribution: 'Led 300 Spartans at Thermopylae — the ultimate symbol of sacrifice', detail: 'King of Sparta. When told Persian arrows would block out the sun, a Spartan replied: "Then we shall fight in the shade." Leonidas\' stand at Thermopylae delayed Xerxes and inspired all Greece to resist.', icon: '⚔️', color: WINE },
  { name: 'Themistocles', dates: 'c. 524–459 BCE', category: 'Leadership', contribution: 'Built Athens\' navy; mastermind of victory at Salamis', detail: 'Persuaded Athens to spend silver from Laurion mines on 200 triremes. Lured the Persian fleet into the narrows at Salamis. Arguably saved Western civilization. Later ostracized and ironically ended his life as a Persian governor.', icon: '🚢', color: TEAL },
  { name: 'Alexander the Great', dates: '356–323 BCE', category: 'Leadership', contribution: 'Conquered the Persian Empire and spread Greek culture to India', detail: 'Son of Philip II of Macedon, tutored by Aristotle. Conquered Persia, Egypt, and Central Asia in 10 years. Founded 20+ cities (most named Alexandria). Never lost a battle. Died at 32 in Babylon, leaving an empire from Greece to India.', icon: '🌍', color: ACCENT },

  // Scientists/Mathematicians
  { name: 'Pythagoras', dates: 'c. 570–495 BCE', category: 'Science', contribution: 'Pythagorean theorem; mathematics as the language of reality', detail: 'Founded a mystical-mathematical community in Croton (southern Italy). Discovered the relationship between string length and musical harmony. His theorem (a² + b² = c²) is foundational to geometry. Believed "all is number."', icon: '📐', color: BRONZE },
  { name: 'Euclid', dates: 'c. 325–265 BCE', category: 'Science', contribution: 'Elements — the definitive geometry textbook for 2,000+ years', detail: 'Working in Alexandria, Euclid compiled and organized all known geometry into 13 books of rigorous proofs. When Ptolemy asked for a shortcut, Euclid replied: "There is no royal road to geometry." Second only to the Bible in editions printed.', icon: '📏', color: ACCENT },
  { name: 'Archimedes', dates: 'c. 287–212 BCE', category: 'Science', contribution: 'Buoyancy, pi calculation, levers, compound pulleys, proto-calculus', detail: 'The greatest scientist of antiquity. "Give me a lever long enough and a place to stand, and I shall move the world." Killed by a Roman soldier during the siege of Syracuse, reportedly saying "Do not disturb my circles."', icon: '⚙️', color: TEAL },
  { name: 'Hippocrates', dates: 'c. 460–370 BCE', category: 'Science', contribution: 'Father of Medicine — separated medicine from superstition', detail: 'Founded a medical school on Kos. Taught that diseases have natural causes, not divine punishment. The Hippocratic Oath ("First, do no harm") is still sworn by doctors today. Introduced clinical observation and case histories.', icon: '⚕️', color: OLIVE },

  // Artists/Writers
  { name: 'Homer', dates: 'c. 8th century BCE', category: 'Arts', contribution: 'Iliad and Odyssey — the foundation of Western literature', detail: 'Traditionally a blind poet from Ionia. The Iliad depicts the rage of Achilles during the Trojan War. The Odyssey follows Odysseus\' 10-year journey home. Together they defined heroic values, narrative structure, and the Greek worldview. Whether Homer was one person or several remains debated.', icon: '📖', color: GOLD },
  { name: 'Sophocles', dates: 'c. 496–406 BCE', category: 'Arts', contribution: 'Oedipus Rex, Antigone — master of tragedy and dramatic irony', detail: 'Won 18 first prizes at the City Dionysia (more than any other playwright). Introduced the third actor, scene painting, and larger choruses. Oedipus Rex is Aristotle\'s model of the perfect tragedy. Antigone explores the conflict between divine law and state authority.', icon: '🎭', color: WINE },
  { name: 'Herodotus', dates: 'c. 484–425 BCE', category: 'Arts', contribution: 'Father of History — first systematic historical narrative', detail: 'Traveled the ancient world collecting accounts of the Persian Wars and the customs of diverse peoples. His Histories combine narrative history with ethnography, geography, and storytelling. Criticized for including myths, but modern archaeology has confirmed many of his claims.', icon: '🗺️', color: BRONZE },
  { name: 'Thucydides', dates: 'c. 460–400 BCE', category: 'Arts', contribution: 'History of the Peloponnesian War — critical, evidence-based history', detail: 'Athenian general exiled after losing Amphipolis. Wrote a rigorously analytical account of the war, avoiding myth and divine explanation. His analysis of power politics, democratic decision-making, and the psychology of war remains startlingly modern.', icon: '📜', color: ACCENT },
  { name: 'Sappho', dates: 'c. 630–570 BCE', category: 'Arts', contribution: 'Greatest lyric poet of antiquity — pioneer of personal, emotional poetry', detail: 'Lived on the island of Lesbos. Only fragments of her nine books of poetry survive. Her intensely personal love poetry — addressed to both men and women — influenced all subsequent lyric tradition. Plato called her "the tenth Muse."', icon: '💜', color: PURPLE },
];

const OLYMPIANS: Olympian[] = [
  { name: 'Zeus', domain: 'King of gods, sky, thunder, justice', symbol: 'Thunderbolt, eagle, oak', icon: '⚡' },
  { name: 'Hera', domain: 'Queen of gods, marriage, family', symbol: 'Peacock, cow, pomegranate', icon: '👑' },
  { name: 'Poseidon', domain: 'Sea, earthquakes, horses', symbol: 'Trident, horse, dolphin', icon: '🔱' },
  { name: 'Athena', domain: 'Wisdom, warfare, crafts', symbol: 'Owl, olive tree, aegis', icon: '🦉' },
  { name: 'Apollo', domain: 'Sun, music, prophecy, healing', symbol: 'Lyre, laurel wreath, sun', icon: '☀️' },
  { name: 'Artemis', domain: 'Hunt, moon, wilderness, childbirth', symbol: 'Bow, deer, crescent moon', icon: '🌙' },
  { name: 'Ares', domain: 'War, violence, bloodshed', symbol: 'Spear, shield, vulture', icon: '⚔️' },
  { name: 'Aphrodite', domain: 'Love, beauty, desire', symbol: 'Dove, myrtle, mirror', icon: '🕊️' },
  { name: 'Hephaestus', domain: 'Fire, forge, metalwork', symbol: 'Hammer, anvil, tongs', icon: '🔨' },
  { name: 'Hermes', domain: 'Messengers, trade, thieves, travelers', symbol: 'Caduceus, winged sandals', icon: '👟' },
  { name: 'Demeter', domain: 'Harvest, agriculture, seasons', symbol: 'Wheat sheaf, torch, cornucopia', icon: '🌾' },
  { name: 'Dionysus', domain: 'Wine, festivity, theater, ecstasy', symbol: 'Grapevine, thyrsus, leopard', icon: '🍷' },
];

const MYTHS = [
  { name: 'Prometheus & Fire', detail: 'The Titan Prometheus stole fire from the gods and gave it to humanity, enabling civilization. Zeus punished him by chaining him to a rock where an eagle ate his liver daily (it regrew each night). Prometheus represents rebellion against authority and the cost of progress.' },
  { name: 'Pandora\'s Box', detail: 'Zeus ordered Hephaestus to create the first woman, Pandora, as punishment for Prometheus\' theft. She was given a jar (mistranslated as "box") and told never to open it. Curiosity prevailed — she opened it, releasing all evils into the world. Only Hope remained inside.' },
  { name: 'The Trojan War', detail: 'Paris of Troy judged Aphrodite the fairest goddess; she rewarded him with Helen, wife of Spartan king Menelaus. The Greeks besieged Troy for 10 years. Achilles, greatest of warriors, killed Hector but was slain by an arrow to his heel. Odysseus devised the Trojan Horse, ending the war through deception.' },
  { name: 'The Oracle at Delphi', detail: 'The Pythia, priestess of Apollo at Delphi, was the most authoritative oracle in the Greek world. Kings and cities consulted her before wars, colonization, and major decisions. Her pronouncements were famously ambiguous — when Croesus asked about attacking Persia, she said "a great empire will fall." It was his own.' },
];

const ACHIEVEMENTS: Achievement[] = [
  { title: 'Democracy', description: 'Government by the people — citizens directly making laws and policy', detail: 'Athenian democracy (508–322 BCE) proved that ordinary citizens could govern effectively. Though limited by modern standards (excluding women, slaves, and foreigners), it established the principles of civic participation, majority rule, public debate, and accountability that underpin modern democratic states worldwide.', icon: '🏛️', color: ACCENT },
  { title: 'Philosophy', description: 'The systematic pursuit of wisdom through reason and argument', detail: 'Greek philosophers asked fundamental questions about reality, knowledge, ethics, and politics that we still grapple with today. Socratic questioning, Platonic idealism, Aristotelian logic and empiricism, Epicurean and Stoic ethics — these frameworks shape how we think about thinking itself.', icon: '🤔', color: PURPLE },
  { title: 'Mathematics', description: 'Rigorous proof-based geometry, number theory, and proto-calculus', detail: 'Pythagoras, Euclid, Archimedes, and others transformed mathematics from practical calculation into abstract, proof-based reasoning. Euclid\'s Elements remained the standard geometry textbook into the 20th century. The Greek insistence on rigorous proof remains the foundation of all modern mathematics.', icon: '📐', color: BRONZE },
  { title: 'Medicine', description: 'Hippocratic medicine — treating disease as natural, not supernatural', detail: 'Hippocrates and his school rejected the idea that illness was divine punishment. They introduced clinical observation, case histories, prognosis, and the ethical framework (Hippocratic Oath) that still guides medical practice. The shift from superstition to empirical medicine began here.', icon: '⚕️', color: OLIVE },
  { title: 'Olympic Games', description: 'Athletic competition as sacred festival, from 776 BCE to 393 CE', detail: 'The Olympics at Olympia were held every four years for over 1,000 years. During the games, a sacred truce (ekecheiria) halted wars across Greece. Events included running, wrestling, boxing, chariot racing, and the pentathlon. Revived in 1896, the modern Olympics directly descend from this Greek institution.', icon: '🏅', color: GOLD },
  { title: 'Theater', description: 'Tragedy and comedy as art forms exploring the human condition', detail: 'Greek drama invented the concepts of actors, dialogue, plot, dramatic irony, and audience catharsis. Tragedy (Aeschylus, Sophocles, Euripides) explored fate, justice, and human frailty. Comedy (Aristophanes, Menander) satirized politics and society. Every play, film, and TV show descends from Greek theater.', icon: '🎭', color: WINE },
  { title: 'Architecture', description: 'The three Classical orders: Doric, Ionic, and Corinthian', detail: 'Greek architects developed three column styles (orders) that define Western architecture to this day. Doric: simple, sturdy, masculine (Parthenon). Ionic: elegant scrolled capitals (Erechtheion). Corinthian: ornate acanthus-leaf capitals. The U.S. Supreme Court, British Museum, and countless government buildings worldwide use Greek architectural forms.', icon: '🏗️', color: MARBLE },
  { title: 'Historical Writing', description: 'Systematic inquiry into past events based on evidence', detail: 'Herodotus and Thucydides invented history as a discipline. Before them, the past was myth and legend. After them, it became subject to investigation, evidence, and critical analysis. Thucydides\' insistence on eyewitness testimony and skepticism of bias set standards that historians still follow.', icon: '📜', color: TEAL },
];

const ALEXANDER = {
  rise: 'Alexander III of Macedon was born in 356 BCE to King Philip II and Olympias of Epirus. Tutored by Aristotle from age 13, he absorbed Greek culture, Homer, and philosophy. At 16, he served as regent and crushed a Thracian revolt. When Philip was assassinated in 336, Alexander secured the throne at 20, executed rivals, and crushed Greek revolts (destroying Thebes as an example). He then turned east with 47,000 men to conquer the Persian Empire.',
  conquests: [
    { name: 'Granicus (334 BCE)', detail: 'First major battle against Persia. Alexander led a cavalry charge across the river and personally fought in the front lines, nearly dying. Victory opened Asia Minor to Macedonian control.' },
    { name: 'Issus (333 BCE)', detail: 'Alexander defeated Darius III despite being outnumbered ~2:1. Darius fled, abandoning his family. Alexander captured Darius\' wife, mother, and children — and treated them with royal respect.' },
    { name: 'Siege of Tyre (332 BCE)', detail: 'The island fortress of Tyre resisted for 7 months. Alexander built a causeway from the mainland to the island — a feat of engineering that permanently turned the island into a peninsula.' },
    { name: 'Egypt (332–331 BCE)', detail: 'Egypt welcomed Alexander as a liberator from Persian rule. He founded Alexandria (destined to become the greatest city of the ancient world) and visited the Oracle of Amun at Siwa, where he was proclaimed son of Zeus-Ammon.' },
    { name: 'Gaugamela (331 BCE)', detail: 'The decisive battle. Alexander defeated Darius\' massive army on a plain chosen to favor Persian chariots and elephants. Darius fled again and was later murdered by his own generals. Alexander became "King of Asia."' },
    { name: 'Central Asia & India (330–326 BCE)', detail: 'Alexander pushed through Afghanistan and Central Asia, crossed the Hindu Kush, and invaded India. At the Hydaspes (326 BCE), he defeated King Porus and his war elephants. His army, after 8 years of campaigning, finally refused to go further at the Hyphasis River.' },
  ],
  culturalFusion: 'Alexander deliberately blended Greek and Persian cultures: he wore Persian dress, adopted court rituals (proskynesis), married Roxana of Bactria and later Stateira (Darius\' daughter), and encouraged 10,000 of his men to marry Persian women at the mass wedding at Susa. He founded over 20 cities as centers of Greek culture, staffed them with Greek settlers and veterans, and spread the Greek language from Egypt to Afghanistan.',
  death: 'Alexander died in Babylon on June 10/11, 323 BCE, aged 32. The cause remains debated — typhoid fever, malaria, poisoning, or complications from alcoholism and old wounds. When asked who should inherit his empire, he reportedly said "the strongest" (or "Krateros," his general — the Greek is ambiguous). His empire immediately fractured.',
  empireSplit: 'After decades of brutal warfare (the Wars of the Diadochi), Alexander\'s empire split into three main successor kingdoms: Ptolemaic Egypt (Ptolemy\'s dynasty, ending with Cleopatra in 30 BCE), Seleucid Empire (controlling Persia, Mesopotamia, and parts of Central Asia), and Antigonid Macedon (controlling Greece). These Hellenistic kingdoms spread Greek culture for 300 years until Rome absorbed them all.',
};

const HELLENISTIC = [
  { name: 'Ptolemaic Egypt', detail: 'Ptolemy I, Alexander\'s general, founded a dynasty that ruled Egypt for 300 years. Alexandria became the intellectual capital of the world: the Library held 400,000+ scrolls, the Lighthouse was one of the Seven Wonders, and scholars like Euclid, Eratosthenes (who calculated Earth\'s circumference), and Aristarchus (who proposed heliocentrism) worked there. The dynasty ended with Cleopatra VII\'s death in 30 BCE.', icon: '📚', color: GOLD },
  { name: 'Seleucid Empire', detail: 'Seleucus I carved out the largest successor kingdom, stretching from Anatolia to Central Asia. The Seleucids founded dozens of Greek cities across the Near East, spreading Greek language, art, and philosophy. Gradually lost territory — Parthia and Bactria broke away, and the Maccabean revolt (167 BCE) freed Judea. Absorbed by Rome in 63 BCE.', icon: '🗺️', color: ACCENT },
  { name: 'Antigonid Macedon', detail: 'The Antigonid dynasty controlled Macedon and maintained hegemony over the Greek city-states. Faced constant challenges from Greek leagues (Achaean, Aetolian) seeking independence. Defeated by Rome at Cynoscephalae (197 BCE) and Pydna (168 BCE). Macedon became a Roman province in 146 BCE.', icon: '⚔️', color: WINE },
  { name: 'Greco-Bactrian Kingdom', detail: 'Greek kings ruled in Afghanistan and northern India for 200 years, creating a remarkable fusion of Greek and Buddhist art (Gandhara style). Greek-style Buddha statues and coins with bilingual Greek/Prakrit inscriptions testify to this cultural synthesis at the far edge of the Hellenistic world.', icon: '🏔️', color: TEAL },
  { name: 'Cultural Legacy', detail: 'The Hellenistic period saw Greek become the lingua franca from Italy to India. Koine Greek (the "common dialect") became the language of trade, diplomacy, and learning — and eventually the language in which the New Testament was written. Greek science, philosophy, and art influenced every culture they touched.', icon: '🌍', color: PURPLE },
];

const LEGACY_ITEMS = [
  { title: 'Rome', detail: 'Rome conquered Greece militarily but was conquered culturally. Wealthy Romans sent their sons to Athens to study. Latin literature, philosophy, architecture, and religion are deeply indebted to Greek models. As Horace wrote: "Conquered Greece took captive her savage conqueror and brought her arts into rustic Latium."', icon: '🏛️', color: WINE },
  { title: 'The Renaissance', detail: 'The "rebirth" of the 14th–17th centuries was explicitly a recovery of Greek texts, ideas, and aesthetic ideals. The fall of Constantinople (1453) sent Greek scholars and manuscripts flooding into Italy. Plato\'s works, rediscovered in the original Greek, inspired Neoplatonism and reshaped European thought.', icon: '🎨', color: GOLD },
  { title: 'Modern Democracy', detail: 'The American and French Revolutions drew directly on Greek democratic ideals. The U.S. Capitol building mimics Greek architecture. Terms like "democracy," "politics," "citizen," and "tyranny" are Greek words. The concept that legitimate government requires the consent of the governed traces to Athens.', icon: '🗳️', color: ACCENT },
  { title: 'Science & Philosophy', detail: 'The Greek commitment to rational inquiry — explaining the world through reason rather than myth — is the foundation of Western science. Aristotle\'s logic, Euclid\'s proofs, Hippocrates\' empiricism, and the pre-Socratics\' search for natural laws all contributed to the Scientific Revolution 2,000 years later.', icon: '🔬', color: TEAL },
  { title: 'Language', detail: 'English is saturated with Greek: philosophy, democracy, biology, psychology, technology, music, theater, politics, gymnasium, idea, energy, atom, cosmos. The Greek alphabet gave rise to Latin and Cyrillic scripts. Scientific nomenclature worldwide is built on Greek roots.', icon: '📝', color: PURPLE },
  { title: 'Art & Architecture', detail: 'Greek aesthetic ideals — proportion, harmony, idealized naturalism — defined Western art for millennia. Government buildings, museums, and universities worldwide use Greek columns. The human-centered, rational approach to beauty remains the baseline from which all Western art departs or reacts.', icon: '🏗️', color: MARBLE },
];

/* ───────── Sub-components ───────── */

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: `${ACCENT}15`, border: `1px solid ${ACCENT}33`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: ACCENT, fontFamily: 'monospace' }}>{value}</div>
      <div style={{ fontSize: 11, color: TEXT_DIM, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function TabButton({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 8,
        border: `1px solid ${active ? ACCENT : CARD_BORDER}`,
        backgroundColor: active ? `${ACCENT}22` : 'transparent',
        color: active ? TEXT : TEXT_DIM,
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.2s',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </button>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT, margin: 0 }}>{title}</h2>
    </div>
  );
}

/* ───────── Section tabs config ───────── */

const SECTION_TABS: { key: SectionTab; label: string; icon: string }[] = [
  { key: 'timeline', label: 'Timeline', icon: '📅' },
  { key: 'citystates', label: 'City-States', icon: '🏛️' },
  { key: 'democracy', label: 'Democracy', icon: '🗳️' },
  { key: 'persian', label: 'Persian Wars', icon: '⚔️' },
  { key: 'golden', label: 'Golden Age', icon: '✨' },
  { key: 'peloponnesian', label: 'Peloponnesian War', icon: '🔥' },
  { key: 'figures', label: 'Key Figures', icon: '👤' },
  { key: 'religion', label: 'Religion & Myth', icon: '⚡' },
  { key: 'achievements', label: 'Achievements', icon: '🏆' },
  { key: 'alexander', label: 'Alexander', icon: '🌍' },
  { key: 'hellenistic', label: 'Hellenistic', icon: '📚' },
  { key: 'legacy', label: 'Legacy', icon: '🌐' },
];

/* ───────── Main Component ───────── */

export default function AncientGreecePage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('timeline');
  const [expandedPeriod, setExpandedPeriod] = useState<string | null>('Dark Ages');
  const [expandedFigure, setExpandedFigure] = useState<string | null>(null);
  const [figureFilter, setFigureFilter] = useState<string>('All');

  const filteredFigures = figureFilter === 'All' ? KEY_FIGURES : KEY_FIGURES.filter(f => f.category === figureFilter);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: BG, color: TEXT, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* ─── Hero ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ padding: '48px 32px 36px', borderBottom: `1px solid ${CARD_BORDER}`, background: `linear-gradient(135deg, ${BG} 0%, rgba(26,109,181,0.10) 100%)` }}>
          <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '4px 0' }}>← Back to Timeline</Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: `${ACCENT}20`, border: `2px solid ${ACCENT}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: `0 0 24px ${ACCENT}30` }}>🏛️</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, backgroundColor: `${ACCENT}20`, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Deep Dive</span>
          </div>

          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 800, color: TEXT, lineHeight: 1.15, marginBottom: 14 }}>
            Ancient Greece — The Birthplace of Democracy, Philosophy, and Western Civilization{' '}
            <span style={{ fontSize: 'clamp(18px, 3vw, 28px)', color: TEXT_DIM, fontWeight: 400 }}>(800–146 BCE)</span>
          </h1>

          <p style={{ fontSize: 16, color: TEXT_DIM, lineHeight: 1.7, maxWidth: 700, margin: 0 }}>
            From scattered city-states on the Aegean to the cultural foundation of the entire Western world — Greece's ideas about democracy, reason, beauty, and human potential have shaped civilization for over 2,500 years.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
            <StatBadge value="~1,000" label="City-States" />
            <StatBadge value="654" label="Years (Classical Era)" />
            <StatBadge value="12" label="Olympian Gods" />
            <StatBadge value="1,168" label="Years of Olympics" />
            <StatBadge value="15+" label="Key Figures" />
          </div>
        </motion.div>

        {/* ─── Tab Navigation ─── */}
        <div style={{ padding: '16px 32px', borderBottom: `1px solid ${CARD_BORDER}`, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, backgroundColor: BG }}>
          {SECTION_TABS.map(tab => (
            <TabButton key={tab.key} label={tab.label} icon={tab.icon} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} />
          ))}
        </div>

        {/* ─── Timeline ─── */}
        {activeTab === 'timeline' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="📅" title="Five Periods of Ancient Greece" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Click any period to expand its major events.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PERIODS.map(period => (
                <motion.div key={period.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <button onClick={() => setExpandedPeriod(expandedPeriod === period.name ? null : period.name)} style={{ width: '100%', background: 'none', border: `1px solid ${period.color}44`, borderRadius: 12, padding: '14px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: expandedPeriod === period.name ? `${period.color}12` : 'transparent', transition: 'background-color 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontSize: 14, fontWeight: 900, color: period.color, fontFamily: 'monospace' }}>{period.years}</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{period.name}</span>
                      <span style={{ fontSize: 12, color: TEXT_DIM }}>{period.events.length} events</span>
                    </div>
                    <span style={{ fontSize: 18, color: TEXT_DIM, transform: expandedPeriod === period.name ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
                  </button>
                  <AnimatePresence>
                    {expandedPeriod === period.name && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden', borderRadius: '0 0 12px 12px', border: `1px solid ${period.color}55`, borderTop: 'none', backgroundColor: `${period.color}08` }}>
                        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                          {period.events.map((ev, i) => (
                            <motion.div key={ev.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                              <div style={{ minWidth: 60, fontSize: 12, fontWeight: 700, color: period.color, fontFamily: 'monospace', paddingTop: 2 }}>{ev.date}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{ev.title}</div>
                                <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{ev.detail}</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── City-States ─── */}
        {activeTab === 'citystates' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🏛️" title="Athens vs Sparta — Two Visions of Greek Life" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 28 }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 2 }}>
                <div style={{ padding: '12px 16px', backgroundColor: `${TEXT_MUTED}15`, borderRadius: '8px 0 0 0', fontSize: 12, fontWeight: 700, color: TEXT_DIM }}></div>
                <div style={{ padding: '12px 16px', backgroundColor: `${ACCENT}15`, textAlign: 'center', fontSize: 14, fontWeight: 800, color: ACCENT }}>🦉 Athens</div>
                <div style={{ padding: '12px 16px', backgroundColor: `${WINE}15`, borderRadius: '0 8px 0 0', textAlign: 'center', fontSize: 14, fontWeight: 800, color: WINE }}>⚔️ Sparta</div>
              </div>
              {CITY_STATE_COMPARISON.map((row, i) => (
                <div key={row.category} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 2 }}>
                  <div style={{ padding: '12px 16px', backgroundColor: `${TEXT_MUTED}10`, fontSize: 12, fontWeight: 700, color: TEXT_DIM, borderRadius: i === CITY_STATE_COMPARISON.length - 1 ? '0 0 0 8px' : 0 }}>{row.category}</div>
                  <div style={{ padding: '12px 16px', backgroundColor: `${ACCENT}08`, fontSize: 13, color: TEXT_DIM, lineHeight: 1.6 }}>{row.athens}</div>
                  <div style={{ padding: '12px 16px', backgroundColor: `${WINE}08`, fontSize: 13, color: TEXT_DIM, lineHeight: 1.6, borderRadius: i === CITY_STATE_COMPARISON.length - 1 ? '0 0 8px 0' : 0 }}>{row.sparta}</div>
                </div>
              ))}
            </div>

            <SectionHeader icon="🗺️" title="Other Major City-States" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {OTHER_CITY_STATES.map(cs => (
                <div key={cs.name} style={{ padding: '16px 20px', borderRadius: 12, border: `1px solid ${cs.color}33`, backgroundColor: `${cs.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{cs.icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: cs.color }}>{cs.name}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{cs.detail}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Democracy ─── */}
        {activeTab === 'democracy' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🗳️" title="Democracy in Athens — The World's First" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>How 30,000 citizens governed themselves — and why it still matters.</p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: ACCENT, marginBottom: 12 }}>Key Reforms & Institutions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {DEMOCRACY_DETAILS.reforms.map((r, i) => (
                <motion.div key={r.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} style={{ padding: '14px 18px', borderRadius: 10, border: `1px solid ${ACCENT}33`, backgroundColor: `${ACCENT}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 6 }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{r.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: WINE, marginBottom: 12 }}>Limitations</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${WINE}33`, backgroundColor: `${WINE}08`, marginBottom: 28 }}>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DEMOCRACY_DETAILS.limitations.map(lim => (
                  <li key={lim} style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.6 }}>{lim}</li>
                ))}
              </ul>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 12 }}>Why It Still Matters</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08` }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{DEMOCRACY_DETAILS.whyItMatters}</p>
            </div>
          </section>
        )}

        {/* ─── Persian Wars ─── */}
        {activeTab === 'persian' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="⚔️" title="The Persian Wars (490–479 BCE)" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>Four battles that saved Greek civilization from Persian conquest.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {PERSIAN_WARS.map((battle, i) => (
                <motion.div key={battle.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }} style={{ padding: '20px 24px', borderRadius: 12, border: `1px solid ${battle.color}44`, backgroundColor: `${battle.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>{battle.icon}</span>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: battle.color }}>{battle.name}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_DIM, fontFamily: 'monospace' }}>{battle.date}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, color: TEXT }}>Context: </span>{battle.context}
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>
                    <span style={{ fontWeight: 700, color: TEXT }}>Outcome: </span>{battle.outcome}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Golden Age ─── */}
        {activeTab === 'golden' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="✨" title="The Golden Age of Athens (480–404 BCE)" />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 12 }}>Pericles</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08`, marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{GOLDEN_AGE.pericles}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: MARBLE, marginBottom: 12 }}>The Parthenon</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${MARBLE}33`, backgroundColor: `${MARBLE}08`, marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{GOLDEN_AGE.parthenon}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: ACCENT, marginBottom: 12 }}>The Delian League</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${ACCENT}33`, backgroundColor: `${ACCENT}08`, marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{GOLDEN_AGE.delianLeague}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: WINE, marginBottom: 12 }}>Arts & Culture Flourishing</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {GOLDEN_AGE.arts.map((art, i) => (
                <motion.div key={art.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} style={{ padding: '14px 18px', borderRadius: 10, border: `1px solid ${CARD_BORDER}`, backgroundColor: CARD_BG }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16 }}>{art.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{art.name}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{art.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Peloponnesian War ─── */}
        {activeTab === 'peloponnesian' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🔥" title="The Peloponnesian War (431–404 BCE)" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.7, marginBottom: 20, marginTop: 0 }}>{PELOPONNESIAN_WAR.overview}</p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Three Phases</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {PELOPONNESIAN_WAR.phases.map((phase, i) => (
                <motion.div key={phase.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: '16px 20px', borderRadius: 12, border: `1px solid ${phase.color}44`, backgroundColor: `${phase.color}08` }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: phase.color, marginBottom: 8 }}>{phase.name}</div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{phase.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: WINE, marginBottom: 12 }}>Aftermath</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${WINE}33`, backgroundColor: `${WINE}08` }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{PELOPONNESIAN_WAR.aftermath}</p>
            </div>
          </section>
        )}

        {/* ─── Key Figures ─── */}
        {activeTab === 'figures' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="👤" title="Key Figures of Ancient Greece" />

            {/* Category filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {['All', 'Philosophy', 'Leadership', 'Science', 'Arts'].map(cat => (
                <button key={cat} onClick={() => setFigureFilter(cat)} style={{ padding: '5px 14px', borderRadius: 6, border: `1px solid ${figureFilter === cat ? ACCENT : CARD_BORDER}`, backgroundColor: figureFilter === cat ? `${ACCENT}22` : 'transparent', color: figureFilter === cat ? TEXT : TEXT_DIM, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredFigures.map((fig, i) => (
                <motion.div key={fig.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}>
                  <button onClick={() => setExpandedFigure(expandedFigure === fig.name ? null : fig.name)} style={{ width: '100%', background: 'none', border: `1px solid ${fig.color}33`, borderRadius: expandedFigure === fig.name ? '12px 12px 0 0' : 12, padding: '14px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: expandedFigure === fig.name ? `${fig.color}12` : 'transparent', transition: 'background-color 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                      <span style={{ fontSize: 20 }}>{fig.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{fig.name} <span style={{ fontSize: 11, fontWeight: 500, color: TEXT_DIM }}>({fig.dates})</span></div>
                        <div style={{ fontSize: 12, color: fig.color, fontWeight: 600 }}>{fig.category}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 18, color: TEXT_DIM, transform: expandedFigure === fig.name ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}>▼</span>
                  </button>
                  <AnimatePresence>
                    {expandedFigure === fig.name && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden', borderRadius: '0 0 12px 12px', border: `1px solid ${fig.color}33`, borderTop: 'none', backgroundColor: `${fig.color}08` }}>
                        <div style={{ padding: '14px 18px' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: fig.color, marginBottom: 8 }}>{fig.contribution}</div>
                          <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{fig.detail}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Religion & Mythology ─── */}
        {activeTab === 'religion' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="⚡" title="Greek Religion & Mythology" />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 14 }}>The Twelve Olympians</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 28 }}>
              {OLYMPIANS.map((god, i) => (
                <motion.div key={god.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} style={{ padding: '12px 16px', borderRadius: 10, border: `1px solid ${GOLD}22`, backgroundColor: `${GOLD}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{god.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>{god.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: TEXT, marginBottom: 4 }}>{god.domain}</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED }}>{god.symbol}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: PURPLE, marginBottom: 14 }}>Great Myths</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {MYTHS.map((myth, i) => (
                <motion.div key={myth.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} style={{ padding: '14px 18px', borderRadius: 10, border: `1px solid ${PURPLE}33`, backgroundColor: `${PURPLE}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: PURPLE, marginBottom: 6 }}>{myth.name}</div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{myth.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Achievements ─── */}
        {activeTab === 'achievements' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🏆" title="Greek Achievements That Shaped the World" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {ACHIEVEMENTS.map((ach, i) => (
                <motion.div key={ach.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${ach.color}33`, backgroundColor: `${ach.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{ach.icon}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: ach.color }}>{ach.title}</div>
                      <div style={{ fontSize: 12, color: TEXT_DIM }}>{ach.description}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{ach.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Alexander the Great ─── */}
        {activeTab === 'alexander' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🌍" title="Alexander the Great (356–323 BCE)" />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 12 }}>Rise to Power</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08`, marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{ALEXANDER.rise}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: ACCENT, marginBottom: 12 }}>Conquests</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {ALEXANDER.conquests.map((c, i) => (
                <motion.div key={c.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} style={{ padding: '14px 18px', borderRadius: 10, border: `1px solid ${ACCENT}33`, backgroundColor: `${ACCENT}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT, marginBottom: 6 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{c.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: TEAL, marginBottom: 12 }}>Cultural Fusion</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${TEAL}33`, backgroundColor: `${TEAL}08`, marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{ALEXANDER.culturalFusion}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: WINE, marginBottom: 12 }}>Death & Empire Split</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${WINE}33`, backgroundColor: `${WINE}08`, marginBottom: 10 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{ALEXANDER.death}</p>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08` }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{ALEXANDER.empireSplit}</p>
            </div>
          </section>
        )}

        {/* ─── Hellenistic Period ─── */}
        {activeTab === 'hellenistic' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="📚" title="The Hellenistic World (323–146 BCE)" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>Greek culture spreads from Egypt to India through Alexander's successor kingdoms.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {HELLENISTIC.map((item, i) => (
                <motion.div key={item.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.name}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Legacy ─── */}
        {activeTab === 'legacy' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🌐" title="How Greek Thought Shaped the World" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>From Rome to the Renaissance to modern democracy — Greece's influence is everywhere.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {LEGACY_ITEMS.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Footer ─── */}
        <div style={{ padding: 32, textAlign: 'center', borderTop: `1px solid ${CARD_BORDER}` }}>
          <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', padding: '8px 16px', borderRadius: 6, border: `1px solid ${CARD_BORDER}`, backgroundColor: CARD_BG }}>← Back to Timeline</Link>
        </div>

      </div>
    </div>
  );
}
