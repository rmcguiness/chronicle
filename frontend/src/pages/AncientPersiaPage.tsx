/**
 * AncientPersiaPage — comprehensive deep-dive on the Achaemenid Empire.
 *
 * Route: /ancient-persia
 *
 * Sections:
 *  1. Hero — headline, overview of scale (44% of world population)
 *  2. Rise of the Achaemenid Empire — Cyrus the Great, Cyrus Cylinder
 *  3. Territory at peak — Darius I, satrapies, Royal Road
 *  4. Persian Kings — Cyrus, Cambyses, Darius, Xerxes
 *  5. Persian Wars with Greece — Marathon, Thermopylae, Salamis, Plataea
 *  6. Culture and achievements — Zoroastrianism, art, gardens, polo
 *  7. Persepolis — ceremonial capital, Apadana reliefs
 *  8. Fall to Alexander — Issus, Gaugamela, Darius III
 *  9. Legacy — later empires, Iran today, Zoroastrian influence
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const RED = '#ef4444';
const GREEN = '#22c55e';
const PURPLE = '#a855f7';
const TEAL = '#14b8a6';
const BLUE = '#3b82f6';
const ROSE = '#f43f5e';
const INDIGO = '#6366f1';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const PERSIAN_BLUE = '#1e3a5f';
const SAFFRON = '#e6a817';
const TURQUOISE = '#0d9488';

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

interface FigureEntry {
  name: string;
  years: string;
  contribution: string;
}

// ── Rise of the Achaemenid Empire ──────────────────────────────────────────

const RISE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Cyrus the Great (559–530 BCE)',
    detail:
      'Born as a vassal king of the small Persian tribe of Anshan, Cyrus revolted against his Median overlord Astyages in 553 BCE and united the Persian and Median tribes into a single empire. Within two decades he conquered the Lydian kingdom of Croesus (546 BCE) — whose legendary wealth gave us the phrase "rich as Croesus" — and then turned east to subdue Central Asia. His conquests were remarkable not for their brutality, but for their restraint.',
  },
  {
    label: 'Conquest of Babylon (539 BCE)',
    detail:
      'Cyrus\'s greatest diplomatic triumph. The Babylonian king Nabonidus had alienated his own priests by neglecting the god Marduk. Cyrus exploited this, presenting himself as Marduk\'s chosen liberator. Babylon\'s gates opened with minimal resistance. The world\'s greatest city — with its hanging gardens and massive ziggurats — fell not to siege engines but to superior politics.',
  },
  {
    label: 'The Cyrus Cylinder',
    detail:
      'After taking Babylon, Cyrus issued a clay cylinder declaration that freed slaves, allowed deported peoples to return home, and restored temples of conquered nations. The Jews of the Babylonian Captivity were allowed to return to Jerusalem and rebuild their Temple — an event celebrated in the Hebrew Bible (Ezra 1:1–4). Some scholars call this the world\'s first declaration of human rights, though others debate whether it was genuinely humanitarian or standard Mesopotamian royal propaganda. Either way, it was extraordinary for its era.',
  },
  {
    label: 'Why Cyrus Was Different',
    detail:
      'Most ancient conquerors razed cities, enslaved populations, and imposed their gods. Cyrus practiced religious tolerance, allowed local governance, and respected conquered cultures. He left local administrators in place, demanded tribute rather than cultural submission, and presented himself as a liberator rather than a subjugator. This was not mere kindness — it was strategic genius. Tolerance reduced rebellion and made governing a vast, diverse empire actually possible.',
  },
  {
    label: 'Death and Legend',
    detail:
      'Cyrus died in 530 BCE fighting the Massagetae, a nomadic people on his northeastern frontier. According to Herodotus, the Massagetae queen Tomyris had his head placed in a wineskin filled with blood, saying: "I warned you that I would quench your thirst for blood." His tomb at Pasargadae still stands — a modest stone structure that Alexander the Great later visited with reverence.',
  },
];

// ── Territory at Peak ──────────────────────────────────────────────────────

const TERRITORY_INSIGHTS: InsightEntry[] = [
  {
    label: '5.5 Million km² at Peak',
    detail:
      'Under Darius I (521–486 BCE), the Achaemenid Empire stretched from Libya and the Aegean coast in the west to the Indus River valley in the east, from the Aral Sea in the north to the Persian Gulf and Upper Egypt in the south. At approximately 5.5 million km², it was the largest empire the world had ever seen — and would not be exceeded for two centuries.',
  },
  {
    label: '44% of the World\'s Population',
    detail:
      'At its peak, an estimated 44% of the world\'s population lived under Achaemenid rule — roughly 50 million people out of a global population of about 112 million. No empire in history has ever governed a higher percentage of humanity. This included Persians, Medes, Babylonians, Egyptians, Greeks, Jews, Indians, Scythians, and dozens of other peoples.',
  },
  {
    label: '20+ Satrapies',
    detail:
      'Darius organized the empire into approximately 20–30 satrapies (provinces), each governed by a satrap — a local governor who collected taxes, administered justice, and maintained order. Satraps had enormous autonomy but were checked by a royal secretary, a military commander, and a network of inspectors known as the "King\'s Eyes and Ears." This system of centralized authority with local autonomy was revolutionary and influenced every subsequent empire.',
  },
  {
    label: 'The Royal Road',
    detail:
      'A 2,700-kilometer highway from Sardis (near the Aegean coast of modern Turkey) to Susa (the administrative capital in modern Iran). Relay stations were positioned every 24 kilometers, where fresh horses and riders waited to carry messages. A royal courier could travel the entire road in just 7 days — a journey that took ordinary travelers 90 days. Herodotus wrote: "Neither snow nor rain nor heat nor darkness of night prevents these couriers from completing their designated stages with utmost speed." Sound familiar? The US Postal Service motto is adapted from this description — 2,500 years later.',
  },
  {
    label: 'Universal Currency',
    detail:
      'Darius introduced the gold daric and silver siglos as standardized coinage across the empire. This created the world\'s first common currency zone, facilitating trade from Greece to India. The daric became so trusted that it was accepted as currency even outside the empire\'s borders — the ancient equivalent of the US dollar as a reserve currency.',
  },
  {
    label: 'Qanat Water System',
    detail:
      'The Persians perfected the qanat — an underground aqueduct system that used gravity to bring water from mountain aquifers to arid lowlands without evaporation. Some qanats stretched over 70 kilometers. This technology turned desert into farmland and supported cities in regions that would otherwise be uninhabitable. Qanats are still in use in Iran today, and the technology spread across the Islamic world to Spain and North Africa.',
  },
];

// ── Persian Kings ──────────────────────────────────────────────────────────

const KINGS: FigureEntry[] = [
  {
    name: 'Cyrus the Great',
    years: '559–530 BCE',
    contribution:
      'Founded the Achaemenid Empire by uniting Persia and Media, conquering Lydia and Babylon. Practiced religious tolerance and local governance. Freed the Jews from Babylonian captivity. Issued the Cyrus Cylinder. Called "Father" by the Persians, "Liberator" by the Jews, and "Lawgiver" by the Greeks. His tomb inscription read: "O man, whoever you are, from wherever you come, for I know you shall come — I am Cyrus, who gave the Persians their empire. Do not grudge me this patch of earth that covers my body."',
  },
  {
    name: 'Cambyses II',
    years: '530–522 BCE',
    contribution:
      'Son of Cyrus. Conquered Egypt in 525 BCE, adding the ancient Nile civilization to the Persian Empire. His campaign was brilliant — he used local knowledge, camels carrying water for desert crossing, and even psychological warfare (placing sacred cats on shields, knowing Egyptians wouldn\'t harm them). However, he became increasingly erratic: allegedly killing the sacred Apis bull, executing his own brother Bardiya (or did he?), and dying mysteriously on the road home. His death triggered a succession crisis.',
  },
  {
    name: 'Darius I "The Great"',
    years: '521–486 BCE',
    contribution:
      'Seized power after Cambyses\' death by defeating the usurper Gaumata (whose true identity remains one of history\'s great mysteries). The administrative genius of the Achaemenids: organized the satrapies, built the Royal Road, standardized weights and currency, constructed Persepolis, and created the first empire-wide postal system. Carved his achievements into a cliff face at Behistun — the "Rosetta Stone" of cuneiform. Launched the first Persian invasion of Greece, which ended in defeat at Marathon (490 BCE). Despite this setback, his administrative innovations outlasted every military victory.',
  },
  {
    name: 'Xerxes I',
    years: '486–465 BCE',
    contribution:
      'Son of Darius. Assembled the largest military force the ancient world had ever seen — perhaps 200,000+ troops (Herodotus claimed 5 million, which is wild exaggeration) — for a second invasion of Greece. Built a pontoon bridge across the Hellespont and a canal through Mount Athos. Won at Thermopylae, burned Athens, but was decisively defeated at Salamis (480 BCE) and withdrew. He spent his remaining years as a builder rather than a warrior, completing the Gate of All Nations at Persepolis. Assassinated by his own bodyguard in 465 BCE.',
  },
  {
    name: 'Artaxerxes I',
    years: '465–424 BCE',
    contribution:
      'Known as "Longimanus" (Long-Handed). Consolidated the empire after Xerxes\' assassination. Made peace with Greece (Peace of Callias, c. 449 BCE), ending the Greco-Persian Wars. Allowed the Jewish leader Ezra to return to Jerusalem with additional settlers and funds to rebuild. A competent administrator who maintained stability during a difficult period.',
  },
  {
    name: 'Darius III',
    years: '336–330 BCE',
    contribution:
      'The last Achaemenid king. Not incompetent, as often portrayed, but faced an impossible opponent in Alexander the Great. Defeated at Issus (333 BCE), where Alexander captured his family (and treated them with honor), and again at Gaugamela (331 BCE), despite outnumbering Alexander roughly 2-to-1. Fled eastward, trying to raise new armies, but was murdered by his own officer Bessus in 330 BCE. Alexander reportedly wept when he found the body and gave Darius a royal funeral.',
  },
];

// ── Persian Wars ───────────────────────────────────────────────────────────

const WARS_TIMELINE: TimelineEntry[] = [
  {
    year: '499 BCE',
    title: 'The Ionian Revolt',
    description:
      'Greek cities along the Anatolian coast (Ionia), subjects of Persia, revolted with support from Athens and Eretria. They burned the Persian regional capital of Sardis. The revolt was crushed by 494 BCE, but Darius never forgot Athens\'s interference. The Greek historian Herodotus wrote that Darius ordered a servant to remind him three times every day at dinner: "Master, remember the Athenians."',
    color: AMBER,
  },
  {
    year: '490 BCE',
    title: 'Battle of Marathon',
    description:
      'Darius sent a punitive expedition across the Aegean. Roughly 25,000 Persians landed at Marathon, 40 km northeast of Athens. The Athenian general Miltiades, with about 10,000 hoplites and no cavalry, charged the Persian line in a tactical masterstroke — weakening his center but crushing both wings, then enveloping the Persian middle. The Persians lost 6,400 men; the Athenians just 192. A runner (Pheidippides) raced to Athens with news of the victory — the origin of the modern marathon. This was the upset heard round the ancient world: a citizen army had defeated the superpower.',
    color: GOLD,
  },
  {
    year: '480 BCE — THERMOPYLAE',
    title: 'Three Days at the Hot Gates',
    description:
      'Xerxes invaded with the largest army Greece had ever faced. At the narrow coastal pass of Thermopylae, King Leonidas of Sparta led 300 Spartans and roughly 7,000 Greek allies in a desperate delaying action. For two days they held the pass, slaughtering Persians in the narrows where numbers meant nothing. On the third day, a Greek traitor named Ephialtes revealed a mountain path that allowed the Persians to encircle the defenders. Leonidas dismissed most of the army and fought to the death with his 300 Spartans and 700 Thespians. Their sacrifice bought Greece invaluable time to prepare its naval defense.',
    color: CRIMSON,
  },
  {
    year: '480 BCE — SALAMIS',
    title: 'The Battle That Saved Western Civilization',
    description:
      'After Thermopylae, Xerxes burned Athens (which had been evacuated). But the Athenian strategist Themistocles lured the massive Persian fleet into the narrow straits of Salamis, where their superior numbers became a liability. In the confined waters, the smaller, more maneuverable Greek triremes devastated the Persian fleet. Xerxes watched the disaster from a golden throne on shore. He withdrew to Asia with most of his army, leaving his general Mardonius behind with an occupation force.',
    color: BLUE,
  },
  {
    year: '479 BCE',
    title: 'Battle of Plataea — The Final Stand',
    description:
      'The decisive land battle. A combined Greek army of roughly 80,000 — the largest Greek force ever assembled — met Mardonius\'s Persian army near Plataea. After days of maneuvering, the Spartans and Tegeans shattered the Persian center. Mardonius was killed. The remnants of his army were destroyed. On the same day, according to tradition, the Greek fleet destroyed the remaining Persian ships at Mycale on the Anatolian coast. The Persian threat to Greece was over.',
    color: GREEN,
  },
  {
    year: '449 BCE',
    title: 'Peace of Callias',
    description:
      'After decades of intermittent fighting, Athens and Persia agreed to a peace treaty. Persia recognized the independence of Greek cities in Ionia, agreed to keep its navy out of the Aegean, and accepted the reality that Greece could not be conquered. The wars were over. Their significance cannot be overstated: had Persia won, the Athens that produced democracy, philosophy, drama, and the foundations of Western civilization might never have existed.',
    color: TEAL,
  },
];

// ── Culture and Achievements ───────────────────────────────────────────────

const CULTURE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Zoroastrianism — The First Monotheistic Religion',
    detail:
      'Founded by the prophet Zarathustra (Zoroaster), possibly as early as 1500 BCE, Zoroastrianism was the dominant religion of the Persian Empire. It taught that the universe was a cosmic battleground between Ahura Mazda (the Wise Lord, representing truth and order) and Angra Mainyu (the Destructive Spirit, representing lies and chaos). This dualistic framework profoundly influenced Judaism during the Babylonian exile, and through it, Christianity and Islam. The concepts of heaven and hell, a final judgment day, angels and demons, a coming savior, and an apocalyptic end of history — all central to Abrahamic religions — can be traced to Zoroastrian origins.',
  },
  {
    label: 'Persian Gardens — The Origin of "Paradise"',
    detail:
      'The English word "paradise" comes from the Old Persian "pairidaeza" — literally "walled enclosure." Persian gardens were carefully designed spaces combining water channels, fruit trees, flowers, and shade in a geometric layout representing the four quarters of the world. They were not merely decorative: in a region of harsh deserts, a garden was a triumph of engineering and civilization over nature. The concept spread to Islamic garden design, the Mughal gardens of India (including the Taj Mahal), and European formal gardens.',
  },
  {
    label: 'Art of Persepolis',
    detail:
      'The palace reliefs at Persepolis are one of the ancient world\'s great artistic achievements. The Apadana staircase shows 23 delegations from across the empire — Medes, Elamites, Babylonians, Egyptians, Indians, Scythians, and more — each wearing their distinctive national dress and bringing tribute. Unlike Assyrian art, which glorified military conquest and impaled enemies, Persian art celebrated multicultural cooperation and the dignity of subject peoples. It was propaganda, yes, but propaganda of inclusion rather than terror.',
  },
  {
    label: 'Persian Cuisine and Trade',
    detail:
      'The Persians were sophisticated gourmets who spread culinary traditions along their trade routes. They cultivated saffron (the world\'s most expensive spice, still grown in Iran), developed sophisticated techniques for preserving fruits and creating sweets, and introduced rice cultivation to the Middle East. Persian cuisine influenced cooking from India to Greece. The tradition of lavish feasting was central to Persian court culture — Herodotus noted that Persians discussed every important decision twice: once while drunk, once while sober (or vice versa).',
  },
  {
    label: 'Polo — The Sport of Kings',
    detail:
      'Polo was invented by the Persians as a training exercise for cavalry units. What began as military practice became the sport of the aristocracy, played by both men and women. The Persian poet Ferdowsi describes elaborate polo matches in the Shahnameh. The sport spread from Persia to Central Asia, India, China, and eventually to the British Empire. The word "polo" itself derives from the Tibetan "pulu" (ball), but the game\'s origins are unmistakably Persian.',
  },
  {
    label: 'Textiles and Carpets',
    detail:
      'Persian textiles were among the most prized luxury goods of the ancient world. The tradition of Persian carpet-weaving — which continues today — dates back to at least the Achaemenid period. The oldest known carpet, the Pazyryk carpet (c. 500 BCE), was likely of Persian manufacture, found preserved in a Scythian tomb in Siberia. Persian silk, wool, and cotton fabrics were traded from China to the Mediterranean.',
  },
];

// ── Persepolis ─────────────────────────────────────────────────────────────

const PERSEPOLIS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Construction (518–460 BCE)',
    detail:
      'Begun by Darius I around 518 BCE and expanded by Xerxes and Artaxerxes I. Persepolis was not the administrative capital (that was Susa) or the oldest capital (Pasargadae). It was the ceremonial heart of the empire — where the annual Nowruz (New Year) festival was celebrated and tribute delegations were received. Built on a massive stone terrace 125,000 m², it included the Apadana (audience hall), the Gate of All Nations, the Throne Hall, and the imperial treasury.',
  },
  {
    label: 'The Apadana Reliefs',
    detail:
      'The great staircase of the Apadana contains one of the most remarkable multicultural records from the ancient world: 23 delegations from every corner of the empire, carved in exquisite detail. Each delegation wears its distinctive national dress, hairstyle, and accessories, and brings characteristic gifts — the Armenians bring horses, the Babylonians bring textiles, the Indians bring gold dust and a donkey, the Ethiopians bring an okapi and elephant tusks. These reliefs are not scenes of humiliation but of dignified participation in a shared civilization.',
  },
  {
    label: 'Gate of All Nations',
    detail:
      'Built by Xerxes, this grand entrance hall featured massive stone lamassu (human-headed winged bulls) at each doorway and inscriptions in three languages: Old Persian, Elamite, and Babylonian. Its very name — "Gate of All Nations" — reflected the Achaemenid ideology of a universal empire that embraced diverse peoples. Visitors from across the known world passed through these gates.',
  },
  {
    label: 'Burned by Alexander (330 BCE)',
    detail:
      'Alexander the Great conquered Persepolis in January 330 BCE and seized its legendary treasury — reportedly 120,000 talents of gold and silver, requiring 20,000 mules and 5,000 camels to transport. Months later, the great palace complex was burned. Was it deliberate revenge for Xerxes\' burning of Athens 150 years earlier? A drunken accident, as some ancient sources suggest? Or a calculated political message that the Achaemenid era was truly over? Historians still debate. What is certain is that one of the ancient world\'s greatest architectural achievements was reduced to ruins in a single night.',
  },
];

// ── Fall to Alexander ──────────────────────────────────────────────────────

const FALL_TIMELINE: TimelineEntry[] = [
  {
    year: '334 BCE',
    title: 'Alexander Crosses into Asia',
    description:
      'Alexander of Macedon — 22 years old, with 47,000 troops — crossed the Hellespont into Persian territory. At the river Granicus, he defeated the local Persian satraps. He then swept down the Anatolian coast, liberating Greek cities and cutting off the Persian fleet from its ports. The campaign that would destroy the greatest empire in the world had begun.',
    color: PURPLE,
  },
  {
    year: '333 BCE',
    title: 'Battle of Issus',
    description:
      'Darius III met Alexander in person for the first time at Issus, in a narrow coastal plain in southern Turkey. Despite outnumbering Alexander, Darius\'s larger army couldn\'t deploy effectively in the restricted terrain. Alexander led a cavalry charge directly at Darius. The Great King fled the battlefield — leaving behind his mother, wife, and children. Alexander treated the royal family with complete respect, reportedly telling Darius\'s mother: "He too is Alexander" — meaning that Darius\'s son was under his protection.',
    color: AMBER,
  },
  {
    year: '331 BCE',
    title: 'Battle of Gaugamela — The End of an Empire',
    description:
      'The decisive battle. Darius chose a flat plain near modern Erbil, Iraq, where his chariots and cavalry could operate freely. He outnumbered Alexander perhaps 2-to-1. But Alexander\'s tactical genius was unmatched: he created a gap in the Persian line through a feigned retreat on one wing, then drove his Companion cavalry through the opening directly at Darius. Once again, Darius fled. The Achaemenid Empire — 220 years old and the greatest the world had known — effectively died on this field.',
    color: CRIMSON,
  },
  {
    year: '330 BCE',
    title: 'Death of Darius III — End of the Achaemenids',
    description:
      'Darius fled east, trying to raise new armies. But his own officer Bessus, satrap of Bactria, seized him, hoping to bargain with Alexander or claim the throne himself. When Alexander closed in, Bessus stabbed Darius and left him dying on the roadside. Alexander found the body and reportedly wept. He gave Darius a full royal funeral at Persepolis and later hunted down Bessus, executing him for regicide. In death, Alexander honored the dynasty he had destroyed.',
    color: ROSE,
  },
  {
    year: '330–323 BCE',
    title: 'Alexander Becomes Persian',
    description:
      'Rather than imposing Greek culture, Alexander adopted Persian royal dress, court ceremony, and administrative structures. He married Roxana (a Bactrian princess) and later Stateira (Darius\'s daughter), and ordered his officers to marry Persian noblewomen at the mass wedding at Susa. He kept the satrap system largely intact. His vision was a fusion of Greek and Persian civilizations — a vision cut short by his death in Babylon in 323 BCE, at age 32.',
    color: INDIGO,
  },
];

// ── Legacy ─────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Parthian Empire (247 BCE–224 CE)',
    detail:
      'After Alexander\'s successors (the Seleucids) weakened, the Parthians — an Iranian people from the northeast — reclaimed Persian lands and built an empire that rivaled Rome. The Parthians ruled for nearly 500 years, famously defeating Roman legions at Carrhae (53 BCE) where Crassus was killed. They preserved Persian culture, language, and Zoroastrian religion while adopting Hellenistic elements.',
  },
  {
    label: 'Sassanid Empire (224–651 CE)',
    detail:
      'The Sassanids overthrew the Parthians and declared themselves heirs to the Achaemenids. For over 400 years, they were Rome\'s (and later Byzantium\'s) primary rival. They built magnificent palaces, codified Zoroastrian scripture, and created a sophisticated bureaucratic state. Their art, architecture, and court culture profoundly influenced the early Islamic civilization that conquered them in the 7th century.',
  },
  {
    label: 'Zoroastrian Legacy in World Religions',
    detail:
      'Zoroastrian concepts that entered Judaism during the Babylonian exile and later spread to Christianity and Islam include: heaven and hell as places of reward and punishment; a final judgment day; resurrection of the dead; angels and demons as spiritual beings; a messianic savior figure; and an apocalyptic end of history followed by renewal. The magi (Zoroastrian priests) are the "three wise men" of the Christian nativity story. When you hear about the battle between good and evil, you\'re hearing Zarathustra\'s echo.',
  },
  {
    label: 'Iran Today',
    detail:
      'Modern Iran is the direct cultural descendant of ancient Persia. "Iran" (from "Aryanam" — land of the Aryans, the original Persian self-designation) has been the native name of the country for millennia. The Persian language (Farsi) has changed remarkably little since the medieval period and still uses many words traceable to Old Persian. Nowruz — the Zoroastrian New Year festival celebrated at Persepolis by Darius — is still Iran\'s most important holiday, celebrated by over 300 million people across the former Persian cultural sphere.',
  },
  {
    label: 'The Achaemenid Model',
    detail:
      'The Achaemenid approach to empire — tolerance, local autonomy, standardized infrastructure, universal trade networks — influenced every subsequent multiethnic empire. The Romans adopted and adapted the satrap system. The Islamic caliphates inherited Persian administrative traditions. The very idea that a vast, diverse empire could be governed through inclusive institutions rather than pure military terror was an Achaemenid innovation. In an era of rising nationalism and cultural division, the Persian model of unity through diversity remains remarkably relevant.',
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
    <section
      id={id}
      style={{
        padding: '48px 0',
        borderTop: `1px solid ${accentColor}33`,
      }}
    >
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
          }}
        >
          {icon} {title}
        </h2>
        <p
          style={{
            color: ASH,
            lineHeight: 1.7,
            maxWidth: 800,
            marginBottom: 28,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {entries.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: e.color,
              marginRight: 8,
              verticalAlign: 'middle',
            }}
          />
          <p
            style={{
              display: 'inline',
              color: e.color,
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {e.year}
          </p>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#f1f5f9',
              marginTop: 4,
              marginBottom: 6,
            }}
          >
            {e.title}
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>
            {e.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function InsightGrid({ items }: { items: InsightEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: 18,
          }}
        >
          <h4
            style={{
              fontWeight: 600,
              color: '#f1f5f9',
              marginBottom: 8,
              fontSize: '1rem',
            }}
          >
            {item.label}
          </h4>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
            {item.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

const FIGURE_COLORS = [SAFFRON, BLUE, ROSE, GOLD, INDIGO, TEAL, TURQUOISE, PURPLE];

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {figures.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${FIGURE_COLORS[i % FIGURE_COLORS.length]}33`,
            borderRadius: 10,
            padding: 18,
          }}
        >
          <h4
            style={{
              fontWeight: 600,
              color: FIGURE_COLORS[i % FIGURE_COLORS.length],
              marginBottom: 2,
              fontSize: '1.05rem',
            }}
          >
            {f.name}
          </h4>
          <p
            style={{
              fontSize: '0.8rem',
              color: SLATE,
              marginBottom: 8,
            }}
          >
            {f.years}
          </p>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
            {f.contribution}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function AncientPersiaPage() {
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
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* Back link */}
        <div style={{ paddingTop: 28 }}>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            ← Back to Timeline
          </Link>
        </div>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header style={{ paddingTop: 40, paddingBottom: 32 }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 20,
              background: `linear-gradient(135deg, ${SAFFRON}, ${TURQUOISE})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Ancient Persia — The First World Empire (550–330 BCE)
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p
              style={{
                color: ASH,
                lineHeight: 1.8,
                fontSize: '1.05rem',
                maxWidth: 800,
                marginBottom: 16,
              }}
            >
              At its peak, 44% of the world's population lived under Persian
              rule — the largest share any empire has ever governed. The
              Achaemenid Empire stretched from Libya to India, encompassed over
              50 million people, and pioneered an approach to governing
              diversity that every subsequent empire would imitate. They built
              the world's first highway system, first postal service, and first
              common currency zone. They practiced religious tolerance when
              their contemporaries practiced extermination.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              This is the story of how a small tribe from the mountains of
              southwestern Iran built the ancient world's greatest empire — and
              why its legacy still shapes our world today.
            </p>
          </motion.div>
        </header>

        {/* ── Rise of the Achaemenid Empire ────────────────────────────── */}
        <SectionWrapper
          id="rise"
          icon="🏛️"
          title="Rise of the Achaemenid Empire"
          accentColor={SAFFRON}
          intro="The Achaemenid dynasty began as minor vassals of the Median Empire. In a single generation, Cyrus the Great transformed them into rulers of the largest empire the world had ever seen — not primarily through brutality, but through a revolutionary combination of military genius and political tolerance."
        >
          <InsightGrid items={RISE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Territory at Peak ────────────────────────────────────────── */}
        <SectionWrapper
          id="territory"
          icon="🗺️"
          title="Territory at Peak — The World's Largest Empire"
          accentColor={TURQUOISE}
          intro="Under Darius I, the Achaemenid Empire reached its greatest extent. Governing this vast territory required innovations in administration, communication, and economics that were centuries ahead of their time — innovations that still influence how we organize societies today."
        >
          <InsightGrid items={TERRITORY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Persian Kings ────────────────────────────────────────────── */}
        <SectionWrapper
          id="kings"
          icon="👑"
          title="The Achaemenid Kings"
          accentColor={GOLD}
          intro="Six kings defined the arc of the Achaemenid dynasty — from its founding genius through its golden age to its final, tragic fall. Each left an indelible mark on history."
        >
          <FigureGrid figures={KINGS} />
        </SectionWrapper>

        {/* ── Persian Wars ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="wars"
          icon="⚔️"
          title="The Persian Wars with Greece (499–449 BCE)"
          accentColor={CRIMSON}
          intro="The clash between the Persian Empire and the Greek city-states was one of history's most consequential conflicts. Persia was the superpower; Greece was a collection of fractious, independent city-states with a fraction of Persia's resources. The Greek victories — improbable, narrow, and hard-fought — preserved the independence that allowed Athens to develop democracy, philosophy, and drama. The ripple effects shaped the entire trajectory of Western civilization."
        >
          <TimelineCard entries={WARS_TIMELINE} />
        </SectionWrapper>

        {/* ── Culture and Achievements ─────────────────────────────────── */}
        <SectionWrapper
          id="culture"
          icon="🔥"
          title="Persian Culture and Achievements"
          accentColor={AMBER}
          intro="The Persian contribution to world civilization extends far beyond military conquest. From the religion that shaped Judaism, Christianity, and Islam, to the gardens that gave us the word 'paradise,' to the sport of polo and the art of carpet-weaving — Persian innovations are woven into the fabric of daily life across the globe."
        >
          <InsightGrid items={CULTURE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Persepolis ───────────────────────────────────────────────── */}
        <SectionWrapper
          id="persepolis"
          icon="🏛️"
          title="Persepolis — Ceremonial Heart of the Empire"
          accentColor={INDIGO}
          intro="Persepolis was not a city in the ordinary sense — it was a stage for imperial ceremony, a monument to the idea of a universal empire embracing all peoples. Its ruins, still standing in southwestern Iran, remain one of the most impressive archaeological sites on Earth."
        >
          <InsightGrid items={PERSEPOLIS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Fall to Alexander ────────────────────────────────────────── */}
        <SectionWrapper
          id="fall"
          icon="⚡"
          title="Fall to Alexander the Great (334–330 BCE)"
          accentColor={PURPLE}
          intro="The Achaemenid Empire, which had endured for 220 years and seemed invincible, was destroyed in just four years by a 22-year-old Macedonian king with a fraction of Persia's manpower. Alexander's conquests were astonishing — but equally remarkable was his deep respect for the civilization he conquered."
        >
          <TimelineCard entries={FALL_TIMELINE} />
        </SectionWrapper>

        {/* ── Legacy ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🌍"
          title="Legacy — 2,500 Years and Counting"
          accentColor={TEAL}
          intro="The Achaemenid Empire fell, but Persian civilization never died. Two more great Persian empires followed — the Parthians and Sassanids — carrying the torch for another 900 years. And the cultural, religious, and political innovations of ancient Persia are still alive today."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '32px 0 48px',
            marginTop: 24,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: SLATE,
              fontSize: '0.9rem',
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto 20px',
              fontStyle: 'italic',
            }}
          >
            "I am Cyrus, king of the world. When I entered Babylon I did not
            allow anyone to terrorize the land. I kept in view the needs of the
            people and all its sanctuaries to promote their well-being."
            — Cyrus Cylinder, c. 539 BCE
          </p>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            ← Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
