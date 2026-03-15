/**
 * AncientRomePage — "The Eternal City — Ancient Rome (753 BCE – 476 CE)"
 *
 * Route: /ancient-rome
 *
 * Sections:
 *  1. Hero — title, subtitle, key stats
 *  2. Era filter — navigable era pills
 *  3. Eras of Rome — 5 eras with key events and figures
 *  4. Key Figures Gallery — 20+ historical figures
 *  5. Roman Innovations — 7 lasting contributions
 *  6. Daily Life — gladiators, baths, Forum, slavery
 *  7. Greatest Battles — 5 pivotal battles
 *  8. Legacy — modern institutions derived from Rome
 *
 * All data is static/curated — no backend API needed.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type EraKey = 'MONARCHY' | 'REPUBLIC' | 'PAX_ROMANA' | 'CRISIS' | 'LATE_EMPIRE';

interface EraEvent {
  date: string;
  title: string;
  detail: string;
  slug?: string;
}

interface RomanEra {
  key: EraKey;
  title: string;
  period: string;
  color: string;
  icon: string;
  summary: string;
  events: EraEvent[];
}

interface HistoricalFigure {
  name: string;
  years: string;
  role: string;
  detail: string;
  era: EraKey;
  icon: string;
}

interface Innovation {
  name: string;
  icon: string;
  color: string;
  stat?: string;
  description: string;
}

interface DailyLifeItem {
  title: string;
  icon: string;
  color: string;
  description: string;
}

interface Battle {
  name: string;
  date: string;
  combatants: string;
  outcome: string;
  tactics: string;
  significance: string;
  color: string;
}

interface LegacyItem {
  title: string;
  icon: string;
  color: string;
  roman: string;
  modern: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const ERAS: RomanEra[] = [
  {
    key: 'MONARCHY',
    title: 'Roman Kingdom',
    period: '753–509 BCE',
    color: '#a78bfa',
    icon: '\u{1F451}',
    summary: 'According to legend, Romulus and Remus — twin sons of Mars — founded Rome on the Palatine Hill in 753 BCE. Seven kings ruled before the monarchy was overthrown. Etruscan influence shaped early Roman religion, architecture, and the toga. The kings drained the Forum marshes, built the first sewer (Cloaca Maxima), and established Rome\'s earliest institutions.',
    events: [
      { date: '753 BCE', title: 'Founding of Rome', detail: 'Romulus kills his brother Remus in a dispute over the city\'s location and becomes the first King of Rome. The date — April 21, 753 BCE — becomes the anchor of the Roman calendar (AUC, "from the founding of the city").' },
      { date: 'c. 750–650 BCE', title: 'The Regal Period Begins', detail: 'Rome grows from a hilltop settlement into a small city-state under its first kings. The early kings establish the Senate (advisory council of elders), the Roman legions, and religious institutions.' },
      { date: 'c. 616–509 BCE', title: 'Etruscan Kings', detail: 'The last three kings — Tarquinius Priscus, Servius Tullius, and Tarquinius Superbus — are of Etruscan origin. They bring advanced engineering (the Cloaca Maxima, the first paved Forum), but Tarquinius Superbus\'s tyranny triggers revolution.' },
      { date: '509 BCE', title: 'Overthrow of the Monarchy', detail: 'After Tarquinius Superbus\'s son assaults Lucretia, a Roman noblewoman, the outraged aristocracy expels the king. Lucius Junius Brutus leads the revolt and becomes one of the first two consuls. Romans swear never again to be ruled by a king.' },
    ],
  },
  {
    key: 'REPUBLIC',
    title: 'Roman Republic',
    period: '509–27 BCE',
    color: '#3b82f6',
    icon: '\u{1F3DB}',
    summary: 'The Republic introduced the Senate, dual consuls, and the idea that power should be shared. It expanded from a city-state to master of the Mediterranean through the Punic Wars, conquered Greece, and built the foundations of Roman law. But success bred inequality — land concentration, slave revolts, and ambitious generals tore the Republic apart in its final century.',
    events: [
      { date: '494 BCE', title: 'Conflict of the Orders', detail: 'Plebeians (commoners) secede from the city, refusing to serve in the army until given political representation. The result: Tribunes of the Plebs, officials who can veto any act of government — a radical check on aristocratic power.' },
      { date: '451–449 BCE', title: 'Twelve Tables', detail: 'Rome\'s first written law code, inscribed on bronze tablets in the Forum. For the first time, the law is public — no longer the secret knowledge of patrician priests. The Twelve Tables remain the foundation of Roman law for centuries.' },
      { date: '264–146 BCE', title: 'Punic Wars', detail: 'Three wars against Carthage transform Rome from regional power to Mediterranean superpower. Hannibal crosses the Alps with elephants (218 BCE) and devastates Italy for 15 years. Scipio Africanus defeats him at Zama (202 BCE). In 146 BCE, Rome destroys Carthage utterly — salt-the-earth legend aside, the city is leveled.' },
      { date: '133–121 BCE', title: 'Gracchi Reforms', detail: 'Brothers Tiberius and Gaius Gracchus attempt land reform to help dispossessed farmers. Both are murdered by the Senate — establishing a precedent of political violence that will destroy the Republic.' },
      { date: '107–86 BCE', title: 'Marius vs. Sulla', detail: 'Gaius Marius professionalizes the army (soldiers now loyal to generals, not the state). Lucius Cornelius Sulla marches on Rome — the first time a Roman army attacks its own city — and becomes dictator. Civil war becomes normal.' },
      { date: '73–71 BCE', title: 'Spartacus Revolt', detail: 'Spartacus, a Thracian gladiator, leads 70,000 escaped slaves against Rome. After two years of victories, Crassus crushes the revolt. 6,000 survivors are crucified along the Appian Way — one every 30 meters for 200 km.' },
      { date: '60–44 BCE', title: 'Caesar\'s Rise and Fall', detail: 'Julius Caesar conquers Gaul (58–50 BCE), crosses the Rubicon ("the die is cast"), defeats Pompey in civil war, and becomes dictator perpetuo. His reforms — calendar, citizenship, public works — are transformative. On March 15, 44 BCE (the Ides of March), he is stabbed 23 times by senators led by Brutus and Cassius.' },
      { date: '44–27 BCE', title: 'Fall of the Republic', detail: 'Caesar\'s assassination triggers another round of civil wars. Mark Antony and Cleopatra ally against Octavian (Caesar\'s adopted heir). Octavian defeats them at the Battle of Actium (31 BCE). Antony and Cleopatra commit suicide. In 27 BCE, Octavian takes the name Augustus and the Republic is over.' },
    ],
  },
  {
    key: 'PAX_ROMANA',
    title: 'Early Empire — Pax Romana',
    period: '27 BCE–180 CE',
    color: '#22c55e',
    icon: '\u{1F33F}',
    summary: 'Two centuries of relative peace and prosperity — the Pax Romana. Augustus transformed Rome from a city of brick into a city of marble. The empire reached its greatest extent under Trajan (117 CE), stretching from Britain to Mesopotamia. Population peaked at 60–70 million. Trade reached China via the Silk Road. The Five Good Emperors (96–180 CE) governed wisely through adoption rather than heredity.',
    events: [
      { date: '27 BCE', title: 'Augustus Becomes Emperor', detail: 'Octavian receives the title "Augustus" from the Senate. He maintains the fiction of republican government while holding absolute power. His reign (27 BCE–14 CE) establishes the Principate — 41 years of peace, building, and cultural flowering.' },
      { date: '37–68 CE', title: 'Julio-Claudian Dynasty', detail: 'Tiberius (paranoid recluse), Caligula (possibly insane, assassinated), Claudius (effective administrator, conquered Britain), Nero (great fire of Rome 64 CE, first persecutions of Christians, suicide in 68 CE). The dynasty ends in chaos.' },
      { date: '69 CE', title: 'Year of Four Emperors', detail: 'Galba, Otho, Vitellius, and Vespasian fight for the throne in a single year. Vespasian — a common-born general — wins and founds the Flavian dynasty, bringing stability.' },
      { date: '79 CE', title: 'Destruction of Pompeii', detail: 'Mount Vesuvius erupts, burying Pompeii and Herculaneum under meters of volcanic ash. Thousands die, but the ash preserves an entire Roman city — streets, shops, graffiti, food — a time capsule unmatched in archaeology.' },
      { date: '80 CE', title: 'Colosseum Opens', detail: 'Titus inaugurates the Flavian Amphitheatre (Colosseum) with 100 days of games. Seating 50,000, it hosts gladiatorial combat, animal hunts, and mock naval battles. It remains the largest amphitheatre ever built.' },
      { date: '96–180 CE', title: 'Five Good Emperors', detail: 'Nerva, Trajan, Hadrian, Antoninus Pius, and Marcus Aurelius rule through adoption — each choosing the most capable successor. Trajan expands the empire to its maximum extent (117 CE). Hadrian builds his famous wall in Britain (122 CE). Marcus Aurelius, the philosopher-emperor, writes Meditations while fighting on the Danube frontier.' },
      { date: '117 CE', title: 'Greatest Territorial Extent', detail: 'Under Trajan, the Roman Empire reaches 5 million km² — from Scotland to Mesopotamia, from the Rhine to the Sahara. 60–70 million people live under Roman rule, roughly 25% of the world\'s population.' },
    ],
  },
  {
    key: 'CRISIS',
    title: 'Crisis of the Third Century',
    period: '235–284 CE',
    color: '#f97316',
    icon: '\u{1F525}',
    summary: 'After Marcus Aurelius broke the adoption system by naming his son Commodus as heir, the empire entered a slow decline. The third century saw 50 emperors in 50 years — most murdered. Plague, economic collapse, barbarian invasions, and breakaway empires (Gaul, Palmyra) nearly destroyed Rome. The empire survived, but the old Principate was dead.',
    events: [
      { date: '235–238 CE', title: 'Maximinus Thrax', detail: 'The first "barracks emperor" — a Thracian soldier who never visited Rome. His reign opens five decades of military anarchy, where armies make and unmake emperors at will.' },
      { date: '250–270 CE', title: 'Plague of Cyprian', detail: 'A devastating pandemic (possibly smallpox or Ebola-like hemorrhagic fever) kills up to 5,000 people per day in Rome at its peak. The empire loses an estimated 15–25% of its population.' },
      { date: '260 CE', title: 'Emperor Valerian Captured', detail: 'Valerian is captured by the Sasanian Persian king Shapur I — the only Roman emperor ever taken prisoner. According to Persian sources, he was used as a human footstool. The empire fragments into three parts.' },
      { date: '260–274 CE', title: 'Breakaway Empires', detail: 'The Gallic Empire (modern France, Britain, Spain) and the Palmyrene Empire (Syria, Egypt) break away. Queen Zenobia of Palmyra rules a vast territory before Aurelian reunifies the empire by 274 CE.' },
      { date: '270–275 CE', title: 'Aurelian Restores Unity', detail: 'Emperor Aurelian ("Restorer of the World") reconquers the breakaway states, defeats barbarian invasions, and builds new defensive walls around Rome — an admission that the city itself is no longer safe.' },
    ],
  },
  {
    key: 'LATE_EMPIRE',
    title: 'Late Empire & Fall',
    period: '284–476 CE',
    color: '#ef4444',
    icon: '\u{1F3F0}',
    summary: 'Diocletian stabilized the empire through radical reform — splitting it into East and West, creating the Tetrarchy, and imposing price controls. Constantine legalized Christianity and founded Constantinople. But the Western Empire could not hold. Waves of Germanic migration, economic decline, and military overextension brought the end. The last Western emperor was deposed in 476 CE — though the Eastern Empire (Byzantium) survived until 1453.',
    events: [
      { date: '284–305 CE', title: 'Diocletian\'s Reforms', detail: 'Diocletian creates the Tetrarchy (rule of four), dividing the empire between two Augusti and two Caesars. He fixes prices (Edict on Maximum Prices), reorganizes provinces, and doubles the army. The old Principate gives way to the authoritarian Dominate.' },
      { date: '312 CE', title: 'Constantine\'s Conversion', detail: 'Before the Battle of the Milvian Bridge, Constantine reportedly sees a cross in the sky with the words "In this sign, conquer." He defeats Maxentius and issues the Edict of Milan (313 CE), legalizing Christianity throughout the empire.' },
      { date: '330 CE', title: 'Constantinople Founded', detail: 'Constantine refounds the Greek city of Byzantium as "New Rome" — Constantinople. Built on seven hills like Rome, it becomes the capital of the Eastern Empire and will outlast the West by a millennium.' },
      { date: '361–363 CE', title: 'Julian the Apostate', detail: 'Emperor Julian attempts to restore traditional Roman paganism, reopening temples and stripping Christian privileges. His early death in battle against Persia (363 CE) ends the last serious pagan revival.' },
      { date: '380 CE', title: 'Christianity Becomes State Religion', detail: 'Emperor Theodosius issues the Edict of Thessalonica, making Nicene Christianity the official state religion. Pagan temples are closed, the Olympic Games banned (393 CE), and the Vestal Virgins disbanded.' },
      { date: '410 CE', title: 'Visigoths Sack Rome', detail: 'Alaric I leads the Visigoths into Rome — the first time the city falls to a foreign enemy in 800 years. The three-day sack shocks the entire Mediterranean world. Augustine writes "The City of God" in response, arguing that earthly cities always fall.' },
      { date: '455 CE', title: 'Vandals Sack Rome', detail: 'The Vandals under Gaiseric sack Rome for two weeks, far more thoroughly than the Visigoths. They strip the Temple of Jupiter and carry off treasures, including items looted from Jerusalem by Titus in 70 CE.' },
      { date: '476 CE', title: 'Fall of the Western Empire', detail: 'The Germanic chieftain Odoacer deposes Romulus Augustulus, the last Western Roman emperor — a teenager with an ironic name combining Rome\'s founder and first emperor. Odoacer sends the imperial regalia to Constantinople. The Western Roman Empire is over; the Eastern Empire (Byzantium) endures until 1453.' },
    ],
  },
];

const KEY_FIGURES: HistoricalFigure[] = [
  { name: 'Romulus', years: 'c. 771–c. 717 BCE', role: 'Legendary Founder & First King', detail: 'Son of Mars, raised by a she-wolf. Killed his twin Remus and founded Rome. Established the Senate, the legions, and the asylum tradition — welcoming outcasts who became Rome\'s first citizens.', era: 'MONARCHY', icon: '\u{1F43A}' },
  { name: 'Scipio Africanus', years: '236–183 BCE', role: 'General — Victor of Zama', detail: 'Defeated Hannibal at the Battle of Zama (202 BCE), ending the Second Punic War. Invaded Africa directly, forcing Hannibal to abandon Italy. Regarded as Rome\'s greatest general before Caesar.', era: 'REPUBLIC', icon: '\u2694\uFE0F' },
  { name: 'Tiberius Gracchus', years: '163–133 BCE', role: 'Tribune — Land Reformer', detail: 'Proposed redistributing public land to dispossessed farmers. When the Senate blocked him, he bypassed them — and was clubbed to death by senators. His murder began a century of political violence.', era: 'REPUBLIC', icon: '\u{1F33E}' },
  { name: 'Gaius Gracchus', years: '154–121 BCE', role: 'Tribune — Social Reformer', detail: 'Continued his brother\'s work, adding grain subsidies and road-building programs. Also killed by political enemies. Together, the Gracchi exposed the Republic\'s inability to reform peacefully.', era: 'REPUBLIC', icon: '\u{1F33E}' },
  { name: 'Gaius Marius', years: '157–86 BCE', role: 'General & Consul (7 times)', detail: 'Opened the army to the landless poor, creating a professional military. Won wars in Africa and against Germanic tribes. His rivalry with Sulla led to the first civil wars. Held an unprecedented seven consulships.', era: 'REPUBLIC', icon: '\u{1FA96}' },
  { name: 'Lucius Cornelius Sulla', years: '138–78 BCE', role: 'Dictator — First to March on Rome', detail: 'First Roman general to march his legions on the city itself. After defeating Marius\'s faction, he introduced proscriptions — hit lists of political enemies whose property was confiscated. Voluntarily resigned the dictatorship.', era: 'REPUBLIC', icon: '\u{1F5E1}\uFE0F' },
  { name: 'Marcus Tullius Cicero', years: '106–43 BCE', role: 'Orator, Senator, Philosopher', detail: 'Rome\'s greatest orator and a defender of the Republic. His speeches against Catiline and his philosophical works preserved Greek thought for the Western world. Executed during the proscriptions of the Second Triumvirate.', era: 'REPUBLIC', icon: '\u{1F4DC}' },
  { name: 'Julius Caesar', years: '100–44 BCE', role: 'Dictator Perpetuo', detail: 'Conquered Gaul, crossed the Rubicon, won the civil war, reformed the calendar, and was assassinated on the Ides of March. His career destroyed the Republic and his adopted heir created the Empire.', era: 'REPUBLIC', icon: '\u{1F525}' },
  { name: 'Mark Antony', years: '83–30 BCE', role: 'Triumvir & Caesar\'s Ally', detail: 'Caesar\'s loyal general who delivered the famous funeral speech ("Friends, Romans, countrymen"). Allied with Cleopatra against Octavian. Defeated at Actium (31 BCE) and committed suicide in Alexandria.', era: 'REPUBLIC', icon: '\u2694\uFE0F' },
  { name: 'Cleopatra VII', years: '69–30 BCE', role: 'Queen of Egypt & Roman Ally', detail: 'Last active ruler of the Ptolemaic Kingdom. Allied with Caesar, then Antony, in a bid to preserve Egyptian independence. Spoke nine languages. Her death marked the end of the Hellenistic world and Egypt\'s absorption into Rome.', era: 'REPUBLIC', icon: '\u{1F451}' },
  { name: 'Augustus (Octavian)', years: '63 BCE–14 CE', role: 'First Emperor', detail: 'Caesar\'s adopted heir who defeated all rivals and became the first Roman emperor. Ruled for 41 years, established the Praetorian Guard, built roads and aqueducts, and ushered in the Pax Romana. "I found Rome a city of brick and left it a city of marble."', era: 'PAX_ROMANA', icon: '\u{1F33F}' },
  { name: 'Livia Drusilla', years: '59 BCE–29 CE', role: 'Empress & Political Power', detail: 'Wife of Augustus for 51 years and one of the most powerful women in Roman history. Advised Augustus on policy, secured the succession for her son Tiberius, and was deified after death. A model of Roman feminine virtue — and, according to rumor, ruthless political calculation.', era: 'PAX_ROMANA', icon: '\u{1F3DB}\uFE0F' },
  { name: 'Tiberius', years: '42 BCE–37 CE', role: 'Second Emperor', detail: 'Capable general and reluctant emperor. Withdrew to Capri in his later years, ruling through correspondence. Under his rule, Jesus of Nazareth was crucified in the province of Judaea.', era: 'PAX_ROMANA', icon: '\u{1F3DD}\uFE0F' },
  { name: 'Caligula', years: '12–41 CE', role: 'Third Emperor', detail: 'Began well but descended into megalomania — allegedly planned to make his horse a consul, declared himself a god, and terrorized the Senate. Assassinated by the Praetorian Guard after just four years.', era: 'PAX_ROMANA', icon: '\u26A1' },
  { name: 'Claudius', years: '10 BCE–54 CE', role: 'Fourth Emperor', detail: 'Dismissed as a fool due to his stammer and limp, Claudius proved an effective administrator. He conquered Britain (43 CE), expanded citizenship, and improved the legal system. Possibly poisoned by his wife Agrippina.', era: 'PAX_ROMANA', icon: '\u{1F4DA}' },
  { name: 'Nero', years: '37–68 CE', role: 'Fifth Emperor', detail: 'Fancied himself an artist and musician. Blamed Christians for the Great Fire of Rome (64 CE) and launched persecutions. Killed his mother and two wives. His suicide ended the Julio-Claudian dynasty.', era: 'PAX_ROMANA', icon: '\u{1F3B5}' },
  { name: 'Vespasian', years: '9–79 CE', role: 'Founder of Flavian Dynasty', detail: 'Rose from common origins to become emperor. Restored order after the civil war of 69 CE, began construction of the Colosseum, and stabilized imperial finances. Famous last words: "Dear me, I think I\'m becoming a god."', era: 'PAX_ROMANA', icon: '\u{1F3DF}\uFE0F' },
  { name: 'Titus', years: '39–81 CE', role: 'Emperor — Destroyer of Jerusalem', detail: 'As general, destroyed the Temple in Jerusalem (70 CE). As emperor, dealt compassionately with the eruption of Vesuvius (79 CE) and a plague in Rome. Called "the delight of mankind" for his generosity.', era: 'PAX_ROMANA', icon: '\u{1F30B}' },
  { name: 'Hadrian', years: '76–138 CE', role: 'Emperor — Builder & Traveler', detail: 'Consolidated rather than expanded — built Hadrian\'s Wall in Britain (122 CE) and the Pantheon in Rome. Traveled the empire extensively. A cultured Hellenophile who wrote poetry and designed architecture.', era: 'PAX_ROMANA', icon: '\u{1F9F1}' },
  { name: 'Marcus Aurelius', years: '121–180 CE', role: 'Philosopher-Emperor', detail: 'Last of the Five Good Emperors. Wrote "Meditations" — Stoic philosophy composed in a military tent on the Danube frontier. Spent most of his reign fighting wars he never wanted. His death marks the end of the Pax Romana.', era: 'PAX_ROMANA', icon: '\u{1F4D6}' },
  { name: 'Constantine the Great', years: '272–337 CE', role: 'First Christian Emperor', detail: 'Legalized Christianity (Edict of Milan, 313 CE), presided over the Council of Nicaea (325 CE), and founded Constantinople. Transformed the Roman Empire from pagan to Christian — the most consequential religious shift in Western history.', era: 'LATE_EMPIRE', icon: '\u271D\uFE0F' },
  { name: 'Augustine of Hippo', years: '354–430 CE', role: 'Bishop, Theologian, Philosopher', detail: 'Wrote "Confessions" and "The City of God" — two of the most influential works in Western thought. Developed the doctrine of original sin and just war theory. Shaped Christian theology for the next millennium.', era: 'LATE_EMPIRE', icon: '\u{1F4D6}' },
];

const INNOVATIONS: Innovation[] = [
  { name: 'Roman Law', icon: '\u2696\uFE0F', color: '#a855f7', stat: 'Basis of civil law in 150+ nations', description: 'The Twelve Tables (451 BCE) established the principle that law must be written and public. Roman jurists developed concepts still used today: innocent until proven guilty, burden of proof, legal precedent, contracts, property rights, and the distinction between public and private law. The Corpus Juris Civilis (compiled under Justinian, 534 CE) became the foundation of most European legal systems.' },
  { name: 'Aqueducts', icon: '\u{1F4A7}', color: '#3b82f6', stat: '11 aqueducts, 500 km of channels', description: 'Rome built 11 aqueducts delivering 1 million cubic meters of water daily — more per capita than many modern cities. Using gravity alone (a gradient of just 1:4,800), they carried water across valleys on massive stone arches. The Aqua Appia (312 BCE) was the first; the Aqua Traiana served fountains, baths, and mills. Several are still partially functional.' },
  { name: 'Roman Roads', icon: '\u{1F6E3}\uFE0F', color: '#22c55e', stat: '80,000 km — "All roads lead to Rome"', description: 'The Roman road network connected every corner of the empire — 80,000 km of stone-paved highways with drainage, milestones, and way-stations. The Via Appia (312 BCE) was the first major road. Built to move legions quickly, roads also enabled trade, communication, and cultural integration. Many modern European highways follow Roman routes.' },
  { name: 'Roman Concrete (Opus Caementicium)', icon: '\u{1F3DB}\uFE0F', color: '#f97316', stat: 'Still standing after 2,000 years', description: 'Roman concrete mixed volcanic ash (pozzolana) with lime and seawater, creating a material stronger than modern Portland cement — and one that actually strengthens over time as seawater crystallizes within it. The Pantheon\'s unreinforced concrete dome (43m span) remains the largest in the world after 1,900 years.' },
  { name: 'The Julian Calendar', icon: '\u{1F4C5}', color: '#ec4899', stat: '365.25 days — basis of the Gregorian calendar', description: 'Julius Caesar reformed the chaotic Roman calendar in 46 BCE, creating a 365-day year with a leap day every four years. Advised by the Alexandrian astronomer Sosigenes, the Julian Calendar was only 11 minutes off per year. It served as the Western standard for 1,600 years until Pope Gregory XIII refined it in 1582.' },
  { name: 'Latin Language & Roman Numerals', icon: '\u{1F524}', color: '#eab308', stat: 'Root of 5 Romance languages + scientific nomenclature', description: 'Latin evolved into Italian, Spanish, Portuguese, French, and Romanian — spoken by 900+ million people today. Latin remains the language of law, medicine, science, and the Catholic Church. Roman numerals (I, V, X, L, C, D, M) are still used for clocks, outlines, and Super Bowls.' },
  { name: 'Military Organization', icon: '\u{1FA96}', color: '#ef4444', stat: 'Legions: 5,000 soldiers, subdivided into centuries', description: 'The Roman army was the ancient world\'s most effective fighting force. Legions of 5,000 were divided into cohorts (480) and centuries (80). Professional soldiers served 25-year terms with standardized equipment, rigorous training, and engineering skills — every legion could build a fortified camp in hours. Military discipline, chain of command, and logistics influenced every army since.' },
];

const DAILY_LIFE: DailyLifeItem[] = [
  { title: 'Gladiatorial Games', icon: '\u2694\uFE0F', color: '#ef4444', description: 'Gladiators were slaves, criminals, or volunteers who fought in arenas across the empire. Fights were rarely to the death (trained gladiators were expensive), but the spectacle was brutal. Types included the retiarius (net and trident) vs. secutor (sword and shield). The Colosseum could flood for mock naval battles (naumachiae).' },
  { title: 'Chariot Racing (Circus Maximus)', icon: '\u{1F3C7}', color: '#f97316', description: 'The Circus Maximus held 250,000 spectators — the largest venue in the ancient world. Four factions (Blues, Greens, Reds, Whites) competed in seven-lap races that were violent and often fatal. Chariot racing was Rome\'s most popular entertainment, dwarfing gladiatorial combat. Riots between fan factions could topple governments.' },
  { title: 'Roman Baths (Thermae)', icon: '\u{1F6C1}', color: '#3b82f6', description: 'Public baths were social centers — Romans bathed, exercised, debated, and conducted business there. The Baths of Caracalla (216 CE) covered 25 acres and served 6,000 bathers simultaneously. A typical visit progressed through cold (frigidarium), warm (tepidarium), and hot (caldarium) rooms. Admission was cheap or free — even the poor could bathe daily.' },
  { title: 'Insulae (Apartment Blocks)', icon: '\u{1F3E2}', color: '#a855f7', description: 'Most Romans lived in insulae — apartment blocks up to 7 stories tall. Ground floors held shops (tabernae); upper floors were cramped, poorly lit, and prone to fire and collapse. Augustus limited building height to 21 meters. The wealthy lived in single-family domus with atriums and gardens.' },
  { title: 'The Forum', icon: '\u{1F3DB}\uFE0F', color: '#22c55e', description: 'The Roman Forum was the heart of public life — temples, law courts, the Senate house, and market stalls crowded into a single valley. This is where Cicero gave speeches, Caesar was eulogized, and emperors built triumphal arches. Every Roman city had its own forum modeled on the original.' },
  { title: 'Patron-Client System', icon: '\u{1F91D}', color: '#eab308', description: 'Roman society ran on patronage. Wealthy patrons provided legal protection, food, and money to their clients, who in turn supported their patron politically and socially. The morning salutatio — clients visiting their patron\'s home — was a daily ritual. The system extended from individuals to entire cities and provinces.' },
  { title: 'Slavery', icon: '\u26D3\uFE0F', color: '#64748b', description: 'An estimated 30–40% of Rome\'s population were enslaved — perhaps 2–3 million in the city at its peak. Slaves worked farms, mines, households, and gladiatorial arenas. Some were highly educated (Greek tutors, doctors). Manumission was common; freed slaves (liberti) could become citizens and even wealthy. But the system was fundamentally brutal — slaves were property with no legal rights.' },
];

const GREATEST_BATTLES: Battle[] = [
  { name: 'Battle of Cannae', date: '216 BCE', combatants: 'Rome vs. Carthage (Hannibal)', outcome: 'Devastating Roman defeat — 50,000–70,000 killed', tactics: 'Hannibal\'s double envelopment is the most studied tactical maneuver in military history. He weakened his center deliberately, letting the Romans push forward, then closed his cavalry wings around them like a closing fist. The entire Roman army was surrounded and annihilated.', significance: 'The worst defeat in Roman history. Rome lost 1/5 of its male citizens in a single afternoon. Yet Rome refused to surrender — its resilience after Cannae became legendary.', color: '#ef4444' },
  { name: 'Battle of Zama', date: '202 BCE', combatants: 'Rome (Scipio Africanus) vs. Carthage (Hannibal)', outcome: 'Decisive Roman victory — ends the Second Punic War', tactics: 'Scipio neutralized Hannibal\'s war elephants by opening lanes in his formation, letting them pass through harmlessly. Roman cavalry (with Numidian allies) defeated Carthaginian cavalry, then returned to strike Hannibal\'s infantry from behind — reversing Cannae\'s tactics against their inventor.', significance: 'Ended Carthage as a major power and established Roman dominance over the Western Mediterranean. Hannibal, undefeated for 15 years in Italy, finally met his match.', color: '#3b82f6' },
  { name: 'Battle of Alesia', date: '52 BCE', combatants: 'Rome (Julius Caesar) vs. Gaul (Vercingetorix)', outcome: 'Roman victory — conquest of Gaul complete', tactics: 'Caesar besieged the hilltop fortress by building 18 km of fortifications around it (circumvallation), then built a second 21 km ring facing outward (contravallation) to defend against a Gallic relief army. Trapped between two armies, Caesar held both lines and won.', significance: 'Completed the Roman conquest of Gaul (modern France). Vercingetorix surrendered personally to Caesar. The siege engineering remains unparalleled in ancient warfare.', color: '#22c55e' },
  { name: 'Battle of Actium', date: '31 BCE', combatants: 'Octavian vs. Mark Antony & Cleopatra', outcome: 'Octavian\'s decisive naval victory', tactics: 'Octavian\'s admiral Agrippa blockaded Antony\'s fleet in the Gulf of Ambracia. When Antony attempted a breakout, Cleopatra\'s squadron fled through a gap, and Antony followed — abandoning his fleet and army. Most of his forces surrendered.', significance: 'Ended the Roman civil wars and the Republic itself. Octavian became Augustus, sole ruler of the Roman world. Egypt was annexed, ending the Ptolemaic dynasty.', color: '#a855f7' },
  { name: 'Battle of Adrianople', date: '378 CE', combatants: 'Rome (Emperor Valens) vs. Visigoths (Fritigern)', outcome: 'Catastrophic Roman defeat — Emperor Valens killed', tactics: 'Valens attacked the Visigothic wagon laager without waiting for reinforcements. Gothic cavalry, returning from foraging, struck the Roman flanks while they were engaged with infantry. The Roman army was enveloped and destroyed — two-thirds of the Eastern army killed.', significance: 'Often cited as the beginning of the end for the Roman Empire. Demonstrated that Germanic cavalry could defeat Roman legions. The empire never fully recovered its military strength.', color: '#f97316' },
];

const LEGACY: LegacyItem[] = [
  { title: 'Republican Government', icon: '\u{1F3DB}\uFE0F', color: '#3b82f6', roman: 'The Roman Senate, dual consuls, checks and balances, vetoes, and term limits', modern: 'The U.S. Senate, separation of powers, presidential term limits, and the concept of "republic" itself all derive from Roman models. The Founders studied Roman history obsessively — the Capitol Building is named after the Capitoline Hill.' },
  { title: 'Legal Systems', icon: '\u2696\uFE0F', color: '#a855f7', roman: 'Written law codes, legal precedent, trial by jury, contracts, property rights, innocent until proven guilty', modern: 'Civil law (used in 150+ countries) descends directly from Roman law. Common law systems (UK, US) absorbed Roman concepts. Legal Latin persists: habeas corpus, pro bono, subpoena, de facto, de jure.' },
  { title: 'Architecture & Engineering', icon: '\u{1F3DB}\uFE0F', color: '#22c55e', roman: 'Arches, domes, concrete, aqueducts, roads, amphitheatres, basilicas', modern: 'The U.S. Capitol dome, St. Peter\'s Basilica, triumphal arches worldwide, and the basilica floor plan (used in churches and courthouses) all trace to Rome. Modern concrete technology was inspired by rediscovery of Roman opus caementicium.' },
  { title: 'Christianity', icon: '\u271D\uFE0F', color: '#ec4899', roman: 'Born in a Roman province, spread along Roman roads, legalized by Constantine (313 CE), made state religion by Theodosius (380 CE)', modern: 'Christianity — the world\'s largest religion (2.4 billion adherents) — was shaped by Roman infrastructure, Roman law, and Roman political decisions. The Pope sits in Rome. The Church\'s organizational structure mirrors Roman provincial administration.' },
  { title: 'Calendar & Language', icon: '\u{1F4C5}', color: '#eab308', roman: 'Julian calendar (365.25 days), Latin language, Roman numerals', modern: 'The Gregorian calendar (used worldwide) is a refinement of Caesar\'s. Month names (January–August), language of science and law, and Romance languages (900M+ speakers) all flow from Rome. July and August are named for Julius Caesar and Augustus.' },
  { title: 'Military & Citizenship', icon: '\u{1FA96}', color: '#ef4444', roman: 'Professional standing army, military engineering, citizenship as a reward for service, veterans\' benefits', modern: 'Professional armies, military ranks (general, captain, sergeant from Latin), veterans\' land grants, and the concept of earning citizenship through military service all have Roman origins. NATO\'s structure echoes Roman allied command.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shared small components
// ─────────────────────────────────────────────────────────────────────────────

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: '8px 14px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', fontFamily: 'monospace' }}>{value}</span>
      <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function FilterPill({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid',
        borderColor: active ? (color || '#60a5fa') : 'rgba(255,255,255,0.1)',
        backgroundColor: active ? `${color || '#60a5fa'}22` : 'rgba(255,255,255,0.04)',
        color: active ? (color || '#60a5fa') : '#94a3b8',
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <h2 style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 6, marginTop: 0, display: 'flex', alignItems: 'center', gap: 10, lineHeight: 1.3 }}>
      <span>{icon}</span>{title}
    </h2>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section components
// ─────────────────────────────────────────────────────────────────────────────

function EraSection({ era }: { era: RomanEra }) {
  const [expanded, setExpanded] = useState(false);
  const visibleEvents = expanded ? era.events : era.events.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '24px 28px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${era.color}33` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: `${era.color}18`, border: `2px solid ${era.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{era.icon}</span>
        <div>
          <h3 style={{ fontSize: 19, fontWeight: 800, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>{era.title}</h3>
          <span style={{ fontSize: 13, color: era.color, fontFamily: 'monospace', fontWeight: 600 }}>{era.period}</span>
        </div>
      </div>
      <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 18px 0' }}>{era.summary}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {visibleEvents.map((ev, i) => (
          <motion.div
            key={ev.title}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            style={{ display: 'flex', gap: 14, padding: '12px 16px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${era.color}55` }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: era.color, fontFamily: 'monospace', minWidth: 100, flexShrink: 0, paddingTop: 2 }}>{ev.date}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{ev.title}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{ev.detail}</div>
            </div>
          </motion.div>
        ))}
      </div>
      {era.events.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ marginTop: 14, padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid ${era.color}33`, backgroundColor: `${era.color}11`, color: era.color, transition: 'all 0.2s' }}
        >
          {expanded ? 'Show less' : `Show all ${era.events.length} events`}
        </button>
      )}
    </motion.div>
  );
}

function FigureCard({ figure, index }: { figure: HistoricalFigure; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const eraColor = ERAS.find((e) => e.key === figure.era)?.color || '#64748b';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
      onClick={() => setExpanded(!expanded)}
      style={{ padding: '16px 20px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${eraColor}33`, cursor: 'pointer', transition: 'border-color 0.2s' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 24 }}>{figure.icon}</span>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>{figure.name}</h4>
          <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{figure.years}</div>
        </div>
        <span style={{ fontSize: 11, color: '#64748b', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>{'\u25BC'}</span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: eraColor, marginBottom: 4 }}>{figure.role}</div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginTop: 8 }}>{figure.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InnovationCard({ innovation, index }: { innovation: Innovation; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }}
      onClick={() => setExpanded(!expanded)}
      style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${innovation.color}33`, cursor: 'pointer', transition: 'border-color 0.2s' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: `${innovation.color}18`, border: `2px solid ${innovation.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{innovation.icon}</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{innovation.name}</h3>
          {innovation.stat && <div style={{ fontSize: 12, fontWeight: 600, color: innovation.color, marginTop: 2 }}>{innovation.stat}</div>}
        </div>
        <span style={{ fontSize: 11, color: '#64748b', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>{'\u25BC'}</span>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.75, marginTop: 4 }}>{innovation.description}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DailyLifeCard({ item, index }: { item: DailyLifeItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }}
      style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${item.color}33` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${item.color}18`, border: `2px solid ${item.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{item.title}</h3>
      </div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.75 }}>{item.description}</div>
    </motion.div>
  );
}

function BattleCard({ battle, index }: { battle: Battle; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      onClick={() => setExpanded(!expanded)}
      style={{ padding: '24px 28px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${battle.color}33`, cursor: 'pointer', transition: 'border-color 0.2s' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>{battle.name}</h3>
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <span style={{ fontSize: 12, color: battle.color, fontFamily: 'monospace', fontWeight: 600 }}>{battle.date}</span>
            <span style={{ fontSize: 12, color: '#64748b' }}>{battle.combatants}</span>
          </div>
        </div>
        <span style={{ fontSize: 12, color: '#64748b', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>{'\u25BC'}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: battle.color, marginBottom: 8 }}>{battle.outcome}</div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Tactics</div>
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.75, marginBottom: 14 }}>{battle.tactics}</div>
              <div style={{ fontSize: 13, color: battle.color, lineHeight: 1.65, padding: '10px 14px', borderRadius: 8, backgroundColor: `${battle.color}0d`, borderLeft: `3px solid ${battle.color}55` }}>
                <strong>Significance:</strong> {battle.significance}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LegacyCard({ item, index }: { item: LegacyItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      onClick={() => setExpanded(!expanded)}
      style={{ padding: '24px 28px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${item.color}33`, cursor: 'pointer', transition: 'border-color 0.2s' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <span style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: `${item.color}18`, border: `2px solid ${item.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', margin: 0, flex: 1 }}>{item.title}</h3>
        <span style={{ fontSize: 12, color: '#64748b', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>{'\u25BC'}</span>
      </div>
      <div style={{ fontSize: 13, color: item.color, lineHeight: 1.5, fontWeight: 600, marginBottom: 4 }}>Rome: {item.roman}</div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <div style={{ marginTop: 10, fontSize: 13, color: '#94a3b8', lineHeight: 1.75, padding: '12px 16px', borderRadius: 8, backgroundColor: `${item.color}0d`, borderLeft: `3px solid ${item.color}55` }}>
              <strong style={{ color: '#f1f5f9' }}>Today:</strong> {item.modern}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

const ERA_KEYS: EraKey[] = ['MONARCHY', 'REPUBLIC', 'PAX_ROMANA', 'CRISIS', 'LATE_EMPIRE'];

export default function AncientRomePage() {
  const [selectedEra, setSelectedEra] = useState<EraKey | 'ALL'>('ALL');
  const [figureEra, setFigureEra] = useState<EraKey | 'ALL'>('ALL');

  const filteredEras = useMemo(() => {
    if (selectedEra === 'ALL') return ERAS;
    return ERAS.filter((e) => e.key === selectedEra);
  }, [selectedEra]);

  const filteredFigures = useMemo(() => {
    if (figureEra === 'ALL') return KEY_FIGURES;
    return KEY_FIGURES.filter((f) => f.era === figureEra);
  }, [figureEra]);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ padding: '48px 32px 36px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(167,139,250,0.08) 100%)' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 28, padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)' }}>{'\u2190'} Back to Timeline</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: 'rgba(167,139,250,0.15)', border: '2px solid rgba(167,139,250,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: '0 0 24px rgba(167,139,250,0.2)' }}>{'\u{1F3DB}'}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, backgroundColor: 'rgba(167,139,250,0.15)', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Topic Page</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.15, marginBottom: 14 }}>The Eternal City {'\u2014'} Ancient Rome (753 BCE {'\u2013'} 476 CE)</h1>
          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, maxWidth: 700, margin: 0 }}>1,200 years of republic, empire, law, and legacy {'\u2014'} from a hilltop village on the Tiber to the greatest empire the ancient world had ever seen.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
            <StatBadge value="5" label="Eras" />
            <StatBadge value="22" label="Key Figures" />
            <StatBadge value="7" label="Innovations" />
            <StatBadge value="5" label="Pivotal Battles" />
            <StatBadge value="1,229" label="Years of History" />
          </div>
        </motion.div>

        {/* Era Filters */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>Era:</span>
          <FilterPill label="All Eras" active={selectedEra === 'ALL'} onClick={() => setSelectedEra('ALL')} />
          {ERAS.map((era) => (
            <FilterPill key={era.key} label={`${era.title.replace('Early Empire — ', '')} (${era.period})`} active={selectedEra === era.key} onClick={() => setSelectedEra(era.key)} color={era.color} />
          ))}
        </div>

        {/* Eras of Rome */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u{1F3DB}'} title={`Eras of Rome \u2014 ${filteredEras.length} ${filteredEras.length === 1 ? 'Era' : 'Eras'}`} />
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>From legendary kings to the fall of the West. Click any era to explore its key events.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {filteredEras.map((era) => <EraSection key={era.key} era={era} />)}
          </div>
        </section>

        {/* Key Figures Gallery */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u{1F464}'} title={`Key Figures \u2014 ${filteredFigures.length} Historical Figures`} />
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 12, marginTop: 0 }}>The people who shaped Rome. Click any figure to read more.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
            <FilterPill label={`All (${KEY_FIGURES.length})`} active={figureEra === 'ALL'} onClick={() => setFigureEra('ALL')} />
            {ERAS.map((era) => {
              const count = KEY_FIGURES.filter((f) => f.era === era.key).length;
              return count > 0 ? (
                <FilterPill key={era.key} label={`${era.title.replace('Early Empire — ', '')} (${count})`} active={figureEra === era.key} onClick={() => setFigureEra(era.key)} color={era.color} />
              ) : null;
            })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            <AnimatePresence mode="popLayout">
              {filteredFigures.map((f, i) => <FigureCard key={f.name} figure={f} index={i} />)}
            </AnimatePresence>
          </div>
        </section>

        {/* Roman Innovations */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u{1F527}'} title="Roman Innovations" />
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>The technologies and systems Rome invented or perfected that still shape the modern world. Click to expand.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {INNOVATIONS.map((inn, i) => <InnovationCard key={inn.name} innovation={inn} index={i} />)}
          </div>
        </section>

        {/* Daily Life */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u{1F3E0}'} title="Daily Life in Rome" />
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>What was it like to live in the ancient city? From the roar of the Circus Maximus to the daily salutatio.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {DAILY_LIFE.map((item, i) => <DailyLifeCard key={item.title} item={item} index={i} />)}
          </div>
        </section>

        {/* Greatest Battles */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u2694\uFE0F'} title="Rome\u2019s Greatest Battles" />
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Five pivotal battles that decided the fate of Rome. Click for tactical details.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {GREATEST_BATTLES.map((b, i) => <BattleCard key={b.name} battle={b} index={i} />)}
          </div>
        </section>

        {/* Legacy */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u{1F3DB}\uFE0F'} title="Rome\u2019s Living Legacy" />
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Modern institutions, languages, and ideas that trace directly back to ancient Rome. Click to see the connection.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {LEGACY.map((item, i) => <LegacyCard key={item.title} item={item} index={i} />)}
          </div>
        </section>

        {/* Footer */}
        <div style={{ padding: '32px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', padding: '8px 16px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)' }}>{'\u2190'} Back to Timeline</Link>
        </div>
      </div>
    </div>
  );
}
