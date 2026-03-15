/**
 * RomanFallPage — comprehensive deep-dive on the fall of the Western Roman
 * Empire (200–476 CE).
 *
 * Route: /roman-fall
 *
 * Sections:
 *  1. Hero — headline, key stats bar
 *  2. Rome at Its Peak — 117 CE, Pax Romana, scale of achievement
 *  3. The Long Decline — Crisis of Third Century, inflation, plague, overextension
 *  4. Diocletian and the Division — east/west split, Constantine, Christianity
 *  5. The Germanic Migrations — Huns, Visigoths, foederati
 *  6. The Sack of Rome (410 CE) — Alaric, psychological shock
 *  7. The Final Collapse — Attila, Vandals, puppet emperors, 476 CE
 *  8. Why Did Rome Fall? The Great Debate — historians' theories
 *  9. What Actually Fell — western vs eastern, "Dark Ages" myth
 * 10. The Aftermath — successor states, Church, Charlemagne
 * 11. Legacy for Today — law, language, echoes in modern debates
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const CRIMSON = '#dc2626';
const GOLD = '#f59e0b';
const AMBER = '#d97706';
const BLUE = '#3b82f6';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const PURPLE = '#a855f7';
const ASH = '#94a3b8';
const SLATE = '#64748b';
const IMPERIAL_PURPLE = '#7c3aed';
const BRONZE = '#b45309';
const LEGION_RED = '#b91c1c';
const STEEL = '#64748b';

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

interface StatEntry {
  value: string;
  label: string;
  color: string;
}

interface DebateEntry {
  historian: string;
  theory: string;
  detail: string;
  color: string;
}

interface ConnectionCard {
  to: string;
  label: string;
  description: string;
  color: string;
}

// ── Key Stats ───────────────────────────────────────────────────────────────

const KEY_STATS: StatEntry[] = [
  { value: '70M', label: 'People at peak (21% of world)', color: GOLD },
  { value: '2M mi\u00B2', label: 'Territory: Scotland to Mesopotamia', color: IMPERIAL_PURPLE },
  { value: '50+', label: 'Emperors in 50 years (235\u2013284 CE)', color: CRIMSON },
  { value: '476 CE', label: 'Western Empire falls', color: LEGION_RED },
  { value: '1453 CE', label: 'Eastern Empire (Byzantine) falls', color: TEAL },
  { value: '977 yrs', label: 'Eastern outlasted Western', color: BLUE },
];

// ── Rome at Its Peak ────────────────────────────────────────────────────────

const PEAK_INSIGHTS: InsightEntry[] = [
  {
    label: '70 Million People \u2014 21% of the World',
    detail:
      'At its height under Emperor Trajan in 117 CE, the Roman Empire encompassed roughly 70 million people \u2014 more than one in five humans alive. It stretched from Hadrian\'s Wall in northern Britain to the deserts of Mesopotamia, from the Rhine and Danube rivers to the Sahara. No single political entity would govern this many people in the West again until the modern era. The city of Rome itself held over one million inhabitants \u2014 a population European cities wouldn\'t match for over a thousand years.',
  },
  {
    label: 'The Roman Achievement: Roads, Law, and Commerce',
    detail:
      'Rome built 250,000 miles of roads, including 50,000 miles of paved highways \u2014 an infrastructure network not surpassed until the 19th century. Roman aqueducts delivered 300 million gallons of fresh water daily to the capital. Roman law \u2014 codified in the Corpus Juris Civilis \u2014 became the foundation of most European legal systems. A common currency, standardized weights and measures, and enforced contracts created a Mediterranean-wide economy. A merchant in Roman Britain could do business with a trader in Roman Syria using the same legal framework.',
  },
  {
    label: 'Pax Romana: 200 Years of Relative Peace',
    detail:
      'From Augustus (27 BCE) to Marcus Aurelius (180 CE), the Roman Empire enjoyed the Pax Romana \u2014 roughly 200 years of relative internal stability and prosperity. This wasn\'t peace in the modern sense: Rome fought frontier wars constantly. But within the empire\'s borders, the rule of law largely held, trade flourished, cities grew, and millions lived in a level of material comfort not seen again in Europe until the Renaissance. Edward Gibbon called this period "the most happy and prosperous" in the history of the human race.',
  },
  {
    label: 'Why the Fall Matters',
    detail:
      'The collapse of the Western Roman Empire ended a continuous civilization that had lasted over 500 years (or over 1,000 years counting the Roman Republic). In its wake, Western Europe entered a period of political fragmentation, economic contraction, population decline, and loss of literacy that lasted centuries. Long-distance trade collapsed. Cities shrank to a fraction of their former size. The population of Rome fell from over 1 million to roughly 30,000. The fall of Rome remains one of the most consequential events in world history.',
  },
];

// ── The Long Decline ────────────────────────────────────────────────────────

const DECLINE_TIMELINE: TimelineEntry[] = [
  {
    year: '235\u2013284 CE',
    title: 'Crisis of the Third Century: 50 Emperors in 50 Years',
    description:
      'After the Severan dynasty ended in 235 CE, the empire descended into chaos. Over the next 50 years, more than 50 men claimed the title of emperor \u2014 most murdered by their own troops or rival generals. The empire briefly split into three competing states: the Gallic Empire in the west, the Palmyrene Empire in the east, and the rump Roman Empire in between. Civil war was constant. Armies that should have defended the frontiers instead fought each other. The legitimacy of imperial authority \u2014 the glue holding the empire together \u2014 was shattered.',
    color: CRIMSON,
  },
  {
    year: '212\u2013300 CE',
    title: 'Inflation and Currency Debasement',
    description:
      'Emperor Caracalla began debasing the Roman denarius \u2014 reducing its silver content to pay the army. Subsequent emperors followed suit until the denarius was essentially a bronze coin with a thin silver wash. Prices rose roughly 1,000% by 300 CE. The government increasingly collected taxes in kind (grain, goods) rather than money because currency was nearly worthless. Trade networks that depended on stable currency began to break down. The Roman economy, once the most sophisticated in the ancient world, was reverting to barter in many regions.',
    color: AMBER,
  },
  {
    year: '249\u2013262 CE',
    title: 'The Plague of Cyprian',
    description:
      'Named after the Bishop of Carthage who described it, this pandemic \u2014 possibly smallpox or a hemorrhagic fever \u2014 devastated the empire for over a decade. At its peak, it killed an estimated 5,000 people per day in Rome alone. Entire regions were depopulated. The army couldn\'t recruit enough soldiers. Fields went unplanted. Tax revenues collapsed. The plague struck an empire already weakened by civil war and economic crisis, compounding every existing problem. Some historians estimate it killed 25\u201333% of the empire\'s population.',
    color: ROSE,
  },
  {
    year: '200\u2013400 CE',
    title: 'Military Overextension',
    description:
      'The empire\'s borders stretched roughly 10,000 miles \u2014 from Hadrian\'s Wall to the Euphrates. Defending this enormous perimeter required an army of 400,000\u2013600,000 soldiers, which the empire increasingly couldn\'t recruit or pay. Rome\'s solution was to hire Germanic and other non-Roman soldiers (foederati), but their loyalty was to their commanders, not to Rome. The professional legions that had conquered the world gave way to a patchwork of mercenary forces with divided allegiances.',
    color: STEEL,
  },
  {
    year: '200\u2013400 CE',
    title: 'Bureaucratic Bloat',
    description:
      'As military and economic crises multiplied, the Roman government\'s response was to grow: more officials, more regulations, more taxes to pay for it all. Diocletian\'s administrative reforms multiplied the number of provinces from 50 to over 100, each with its own governor, staff, and bureaucracy. The tax burden on ordinary Romans became crushing. Many small farmers abandoned their land rather than face the tax collector. A civilization that had once thrived on commerce and civic engagement was strangling itself with its own administrative apparatus.',
    color: BRONZE,
  },
];

// ── Diocletian and the Division ─────────────────────────────────────────────

const DIVISION_INSIGHTS: InsightEntry[] = [
  {
    label: 'Diocletian\'s Reforms (284\u2013305 CE)',
    detail:
      'Emperor Diocletian, a former soldier who seized power in 284 CE, stabilized the empire through radical reorganization. He created the Tetrarchy \u2014 splitting imperial authority among four co-emperors ruling different regions. He doubled the size of the army, reformed taxation, imposed price controls (the Edict on Maximum Prices, 301 CE), and created a court ceremonial modeled on Persian monarchy. The emperor was no longer "first citizen" (princeps) but "lord and god" (dominus et deus). Diocletian\'s reforms bought the empire another century, but at the cost of transforming Rome from a republic-in-spirit into an openly authoritarian state.',
  },
  {
    label: 'Constantine and the New Capital (306\u2013337 CE)',
    detail:
      'Constantine the Great reunified the empire after another round of civil wars and made two decisions that changed history forever. In 330 CE, he moved the imperial capital from Rome to a "New Rome" \u2014 Constantinople (modern Istanbul) \u2014 strategically located at the crossroads of Europe and Asia. The move was a tacit admission that the empire\'s center of gravity had shifted east. Rome, the eternal city, was effectively abandoned as the seat of power. Constantinople would remain the capital of the Eastern Roman Empire for over 1,100 years.',
  },
  {
    label: 'The Edict of Milan (313 CE): Christianity Legalized',
    detail:
      'Constantine\'s second world-changing decision was the Edict of Milan (313 CE), which legalized Christianity throughout the empire. Within a generation, Christianity went from a persecuted minority religion to the official state religion (under Theodosius I in 380 CE). The consequences were enormous: pagan temples were closed, Christian bishops became political power brokers, theological disputes became matters of state, and the Church began to build the institutional structure that would survive the empire\'s collapse and shape European civilization for the next millennium.',
  },
  {
    label: 'The Permanent East-West Split (395 CE)',
    detail:
      'When Emperor Theodosius I died in 395 CE, he divided the empire between his two sons: Arcadius received the East (capital: Constantinople) and Honorius received the West (capital: Ravenna, not Rome). The division was meant to be administrative, not permanent \u2014 but the two halves never reunited. The wealthier, more urbanized, more defensible East would survive and thrive. The poorer, more rural, more exposed West would crumble. The question "why did Rome fall?" is really the question "why did the West fall while the East survived?"',
  },
];

// ── The Germanic Migrations ─────────────────────────────────────────────────

const MIGRATIONS_TIMELINE: TimelineEntry[] = [
  {
    year: '370s CE',
    title: 'The Huns Arrive \u2014 A Domino Effect',
    description:
      'The Huns \u2014 fierce nomadic warriors from the Central Asian steppe \u2014 burst into Eastern Europe in the 370s CE, shattering the Gothic kingdoms north of the Danube. The Huns didn\'t invade Rome directly (not yet); instead, they set off a chain reaction. Germanic peoples who had lived along Rome\'s borders for centuries \u2014 Visigoths, Ostrogoths, Vandals, Burgundians, Franks \u2014 were pushed toward and across Roman frontiers by Hunnic pressure. What Romans called "barbarian invasions" were often desperate migrations by peoples fleeing an even more terrifying enemy.',
    color: CRIMSON,
  },
  {
    year: '376 CE',
    title: 'Visigoths Cross the Danube \u2014 Rome\'s Fatal Mistake',
    description:
      'In 376 CE, a massive group of Visigoths \u2014 perhaps 100,000 men, women, and children \u2014 appeared at the Danube, fleeing the Huns, and begged Emperor Valens for permission to settle inside Roman territory. Valens agreed, seeing an opportunity for cheap military recruits. But Roman officials treated the Visigoths abominably: they were settled on barren land, sold spoiled food at extortionate prices, and Roman commanders reportedly sold Visigothic children into slavery in exchange for dog meat to feed starving refugees. The Visigoths revolted.',
    color: GOLD,
  },
  {
    year: '378 CE',
    title: 'Battle of Adrianople \u2014 The Day Rome\'s Army Died',
    description:
      'On August 9, 378 CE, Emperor Valens led the Eastern Roman field army against the rebellious Visigoths near Adrianople (modern Edirne, Turkey). The Romans attacked before reinforcements could arrive. The Visigothic cavalry smashed the Roman flanks, surrounded the legions, and annihilated them. Valens was killed \u2014 his body never found. Two-thirds of the Eastern Roman army was destroyed. It was the worst Roman military disaster since Cannae, 600 years earlier. The empire never fully recovered its military capacity. After Adrianople, Rome would increasingly rely on Germanic foederati to defend its own borders.',
    color: LEGION_RED,
  },
  {
    year: '380s\u2013400s CE',
    title: 'The Foederati Problem \u2014 Barbarians Defending Rome',
    description:
      'After Adrianople, Rome could no longer recruit enough Roman soldiers to defend its frontiers. The solution was to settle entire Germanic tribes inside the empire as foederati \u2014 allies who provided military service in exchange for land and subsidies. Germanic generals like Stilicho (half-Vandal) and Ricimer rose to become the real powers behind the Western Roman throne. The Roman army became increasingly "barbarianized" \u2014 its soldiers and commanders were the very people it was supposed to be defending against. The distinction between Roman and barbarian was dissolving.',
    color: STEEL,
  },
];

// ── The Sack of Rome (410 CE) ───────────────────────────────────────────────

const SACK_410_INSIGHTS: InsightEntry[] = [
  {
    label: 'Alaric and the Visigothic Siege',
    detail:
      'Alaric, king of the Visigoths, didn\'t want to destroy Rome \u2014 he wanted a legitimate place within it. For years he negotiated with the Western court for land, grain, and an official military command. When Emperor Honorius (safely hidden in the marshes of Ravenna) repeatedly broke promises and refused reasonable terms, Alaric besieged Rome three times. On August 24, 410 CE, someone inside the city opened the Salarian Gate. The Visigoths poured in. For the first time in 800 years \u2014 since the Gauls under Brennus in 390 BCE \u2014 an enemy army occupied Rome.',
  },
  {
    label: 'Three Days of Plunder',
    detail:
      'The sack lasted three days. By the standards of ancient warfare, it was relatively restrained: Alaric, a Christian, ordered his troops to spare churches and those who took refuge in them. There was looting, violence, and captive-taking, but no wholesale massacre or deliberate destruction. The physical damage to Rome was far less severe than what the Vandals would inflict 45 years later. Yet the psychological impact was shattering. The "Eternal City," unconquered for eight centuries, symbol of civilization itself, had fallen to barbarians.',
  },
  {
    label: 'The Shock Heard Around the World',
    detail:
      'The news of Rome\'s sack sent shockwaves through the entire Mediterranean. Saint Jerome, writing from Bethlehem, declared: "The city which had taken the whole world was itself taken." Refugees from Rome flooded into North Africa, Palestine, and Constantinople. Pagans blamed Christianity \u2014 arguing that Rome had been protected by the old gods and fell because it abandoned them. In response, Saint Augustine spent 13 years writing The City of God, arguing that earthly empires are transient but God\'s kingdom is eternal \u2014 a work that became one of the most influential books in Western history.',
  },
  {
    label: 'The Emperor Who Didn\'t Care',
    detail:
      'A famous anecdote (possibly apocryphal) captures the absurdity of the Western Empire\'s final decades. When a servant told Emperor Honorius that "Rome has perished," Honorius \u2014 who kept pet chickens \u2014 reportedly cried out in distress, thinking his favorite bird named "Roma" had died. When told it was the city that had fallen, he was relieved. Whether true or not, the story perfectly illustrates the detachment and incompetence of the late Western emperors, most of whom were puppets controlled by Germanic military commanders.',
  },
];

// ── The Final Collapse ──────────────────────────────────────────────────────

const COLLAPSE_TIMELINE: TimelineEntry[] = [
  {
    year: '434\u2013453 CE',
    title: 'Attila the Hun \u2014 The Scourge of God',
    description:
      'Attila united the Hunnic tribes into a terrifying empire stretching from the Rhine to the Ural Mountains. He extorted massive tributes from both halves of the Roman Empire \u2014 the Eastern Empire paid him 2,100 pounds of gold annually to stay away. In 451 CE, Attila invaded Gaul with a force of perhaps 500,000 warriors. He was defeated at the Battle of the Catalaunian Plains by a combined Roman-Visigothic army under the general Aetius \u2014 one of the last great Roman military victories. Attila invaded Italy the following year but withdrew (legend credits Pope Leo I\'s intervention, but plague and famine in his army were likely more persuasive). Attila died in 453 CE \u2014 reportedly of a nosebleed on his wedding night \u2014 and his empire disintegrated immediately.',
    color: CRIMSON,
  },
  {
    year: '455 CE',
    title: 'The Vandals Sack Rome \u2014 Second Sack in 45 Years',
    description:
      'In June 455 CE, the Vandals \u2014 a Germanic people who had conquered Roman North Africa and built a powerful naval kingdom based in Carthage \u2014 sailed to Italy and sacked Rome for two weeks. Unlike Alaric\'s relatively restrained sack, the Vandal plundering was thorough and systematic: they stripped the Temple of Jupiter, carried off treasures from the Temple of Peace (including items looted from Jerusalem by Titus in 70 CE), took thousands of Roman captives including the Empress, and loaded their ships with everything of value. The word "vandalism" entered European languages as a result.',
    color: ROSE,
  },
  {
    year: '455\u2013476 CE',
    title: 'Puppet Emperors \u2014 The Walking Dead',
    description:
      'After 455 CE, the Western Roman emperors were puppets of Germanic military commanders. Real power was held by men like Ricimer (half-Vandal, half-Visigoth), who made and unmade emperors at will \u2014 installing and deposing four emperors in 16 years. The Western Empire controlled only Italy and bits of southern Gaul. Gaul, Spain, Africa, and Britain had all been lost to Germanic kingdoms. The "Roman Empire" in the West was a fiction maintained by a Germanic strongman ruling through a Roman figurehead.',
    color: STEEL,
  },
  {
    year: '476 CE',
    title: 'Romulus Augustulus \u2014 The Last Emperor',
    description:
      'On September 4, 476 CE, Odoacer \u2014 a Germanic chieftain commanding the foederati troops who made up virtually the entire Western Roman army \u2014 deposed the teenage emperor Romulus Augustulus. The irony was poetic: the last emperor shared names with both Rome\'s legendary founder (Romulus) and its first emperor (Augustus), though the diminutive "Augustulus" ("little Augustus") was a mocking nickname. Odoacer sent the imperial regalia to Constantinople with a message: there was no need for a Western emperor. The Eastern Emperor Zeno grudgingly accepted. There was no battle, no dramatic last stand \u2014 just a quiet bureaucratic memo ending 500 years of Western Roman rule.',
    color: LEGION_RED,
  },
  {
    year: '476\u20131453 CE',
    title: 'But the East Survived \u2014 The Byzantine Empire',
    description:
      'The fall of the Western Empire in 476 CE was not the fall of the Roman Empire. The Eastern Roman Empire \u2014 what historians call the Byzantine Empire \u2014 continued for nearly another thousand years, until Constantinople fell to the Ottoman Turks in 1453 CE. The Byzantines preserved Roman law, Greek learning, and Christian civilization. Under Justinian I (527\u2013565 CE), they even reconquered parts of the West. The Byzantines considered themselves Romans to the very end. The "fall of Rome" was really the fall of Rome\'s western provinces \u2014 the eastern half outlived the west by 977 years.',
    color: TEAL,
  },
];

// ── The Great Debate ────────────────────────────────────────────────────────

const DEBATE_ENTRIES: DebateEntry[] = [
  {
    historian: 'Edward Gibbon (1776)',
    theory: 'Christianity sapped Roman martial virtue',
    detail:
      'In his monumental Decline and Fall of the Roman Empire (6 volumes, 1.5 million words \u2014 still in print after 250 years), Gibbon argued that Christianity replaced the warlike civic virtues of pagan Rome with passive, otherworldly values. Romans who once fought for glory and country now joined monasteries and argued about theology. The Church diverted wealth, talent, and energy away from defending the empire. Gibbon\'s thesis was controversial in his own time and is largely rejected by modern historians, but his work remains the most famous historical narrative ever written.',
    color: PURPLE,
  },
  {
    historian: 'Henri Pirenne (1937)',
    theory: 'Arab conquests, not barbarians, ended Rome',
    detail:
      'Belgian historian Henri Pirenne argued that the Germanic invasions didn\'t really end Roman civilization \u2014 trade, cities, and Latin culture continued under the barbarian successor kingdoms. What truly killed the Roman Mediterranean world, Pirenne claimed, was the Arab conquests of the 7th century, which cut off Western Europe from eastern trade routes and forced it into an agrarian, feudal economy. "Without Islam, the Frankish Empire would probably never have existed. Without Mohammed, Charlemagne would have been inconceivable."',
    color: GOLD,
  },
  {
    historian: 'Peter Heather (2005)',
    theory: 'Barbarian invasions were the primary cause',
    detail:
      'Oxford historian Peter Heather argues that Rome didn\'t "decline" \u2014 it was pushed. The Hunnic invasion of Europe set off a chain reaction of barbarian migrations that overwhelmed Roman defenses. The Germanic peoples who entered the empire were not passive refugees but organized, militarized groups that seized Roman territory by force. Without the external pressure of the Huns and the military capabilities of groups like the Visigoths and Vandals, the Western Empire \u2014 weakened but functional \u2014 would likely have survived.',
    color: CRIMSON,
  },
  {
    historian: 'Bryan Ward-Perkins (2005)',
    theory: 'Real catastrophic collapse \u2014 not a "transformation"',
    detail:
      'British archaeologist Bryan Ward-Perkins used material evidence \u2014 pottery, roof tiles, coin finds, animal bones \u2014 to show that the end of the Western Empire was a genuine catastrophe, not a gentle "transformation." Living standards plummeted. The sophistication of pottery production in post-Roman Britain fell to levels below those of the pre-Roman Iron Age. Roof tiles disappeared from buildings for centuries. Average cattle size shrank (indicating less sophisticated animal husbandry). This wasn\'t a gentle transition \u2014 it was civilizational collapse.',
    color: ROSE,
  },
  {
    historian: 'Guy Halsall (2007)',
    theory: 'Internal Roman political failures, not external pressure',
    detail:
      'Guy Halsall argues that the barbarian "invasions" were largely caused by the collapse of Roman political authority on the frontiers, not the other way around. Germanic groups that had been kept in check by Roman power moved into the vacuum created by Roman civil wars, usurpations, and administrative failures. The barbarians didn\'t destroy Rome; Rome destroyed itself through political dysfunction, and the barbarians moved into the ruins.',
    color: INDIGO,
  },
  {
    historian: 'Modern Consensus',
    theory: 'Multicausal \u2014 no single reason',
    detail:
      'Most historians today agree the fall was multicausal. The leading factors: political instability (50+ emperors in 50 years), economic problems (currency debasement, overtaxation, trade decline), military overextension and reliance on Germanic troops, climate change and pandemics (the Antonine and Cyprian plagues killed millions), external pressure from the Huns pushing Germanic tribes into Roman territory, and a gradual loss of civic identity and administrative capacity. No single cause was sufficient \u2014 but together they created a cascade of failures that no empire could survive.',
    color: GREEN,
  },
];

// ── What Actually Fell ──────────────────────────────────────────────────────

const WHAT_FELL_INSIGHTS: InsightEntry[] = [
  {
    label: 'Western Empire: Collapsed 476 CE',
    detail:
      'The Western Roman Empire \u2014 Italy, Gaul, Spain, Britain, and North Africa \u2014 fragmented into Germanic successor kingdoms. Cities shrank. Long-distance trade collapsed. Literacy declined dramatically. The population of Rome fell from over 1 million at its peak to roughly 30,000 by the 6th century. Roads and aqueducts fell into disrepair. The sophisticated money economy reverted to barter in many regions. By any material measure, the standard of living in Western Europe declined sharply and didn\'t recover for centuries.',
  },
  {
    label: 'Eastern Empire (Byzantine): Survived Until 1453 CE',
    detail:
      'The Eastern Roman Empire \u2014 centered on Constantinople, controlling Greece, Anatolia, the Levant, and Egypt \u2014 not only survived but thrived. Under Justinian I (527\u2013565 CE), it reconquered North Africa, Italy, and parts of Spain. Constantinople was the largest and wealthiest city in Europe for most of the medieval period. The Byzantines preserved Roman law (the Corpus Juris Civilis), Greek philosophy, and classical learning that would later fuel the Renaissance. The Eastern Empire outlived the West by 977 years \u2014 nearly a millennium.',
  },
  {
    label: 'The "Dark Ages" Myth \u2014 Mostly True in the West',
    detail:
      'The term "Dark Ages" has fallen out of favor among historians, but the reality it describes is undeniable for Western Europe. Archaeological evidence shows dramatic declines in: pottery quality, building construction, coin circulation, trade volume, urban population, and literacy rates between the 5th and 8th centuries. This wasn\'t universal \u2014 monasteries preserved learning, Germanic law codes emerged, and some regions fared better than others. But the overall trajectory was clearly downward. Meanwhile, the Islamic world and Byzantine Empire experienced golden ages.',
  },
  {
    label: 'What Survived: Law, Language, and the Church',
    detail:
      'Rome didn\'t vanish \u2014 it transformed. Roman law survived through Justinian\'s codification and became the basis of most continental European legal systems. Latin evolved into the Romance languages: French, Spanish, Italian, Portuguese, and Romanian. The Roman Catholic Church \u2014 headquartered in Rome, organized along Roman administrative lines, conducting services in Latin \u2014 became the most powerful institution in medieval Europe. In many ways, the Church was Rome\'s most successful and enduring creation, outlasting the empire by 1,500 years and counting.',
  },
];

// ── The Aftermath ───────────────────────────────────────────────────────────

const AFTERMATH_INSIGHTS: InsightEntry[] = [
  {
    label: 'Germanic Successor States',
    detail:
      'The Western Empire didn\'t become a wasteland \u2014 it became a patchwork of Germanic kingdoms that adopted Roman culture even as they replaced Roman rule. The Ostrogothic Kingdom ruled Italy (493\u2013553 CE), maintaining Roman laws and institutions. The Visigothic Kingdom controlled Spain (418\u2013711 CE). The Frankish Kingdom dominated Gaul and would evolve into France and Germany. These kingdoms preserved elements of Roman administration, converted to Christianity, and used Latin as their language of governance and religion.',
  },
  {
    label: 'The Church Fills the Vacuum',
    detail:
      'As Roman political authority collapsed, the Catholic Church stepped into the void. Bishops became the de facto rulers of cities. Monasteries \u2014 particularly the Benedictine order \u2014 preserved classical texts, maintained agricultural knowledge, ran schools, and provided the only social services available. Pope Gregory the Great (590\u2013604 CE) essentially governed Rome and its surrounding territory, negotiating with Lombard invaders, feeding the city\'s poor, and administering justice. The papacy evolved from a religious office into a political power.',
  },
  {
    label: 'Charlemagne: "Roman Emperor" Again (800 CE)',
    detail:
      'On Christmas Day 800 CE, Pope Leo III crowned the Frankish king Charlemagne as "Emperor of the Romans." It was the first time a "Roman Emperor" had ruled in the West since 476 CE. Charlemagne\'s empire covered modern France, Germany, the Low Countries, and northern Italy. The "Holy Roman Empire" \u2014 which Voltaire famously noted was "neither holy, nor Roman, nor an empire" \u2014 would endure in various forms until Napoleon dissolved it in 1806. The ghost of Rome haunted European politics for over a millennium.',
  },
  {
    label: 'The Great Irony',
    detail:
      'Rome fell to people who wanted to BE Roman, not destroy Rome. The Visigoths, Ostrogoths, Vandals, and Franks all admired Roman civilization. They wanted land within the empire, Roman titles, and acceptance into the Roman system. Odoacer didn\'t declare himself "King of the Germans" \u2014 he ruled Italy as a Roman-style administrator. Theodoric the Ostrogoth spoke Latin, patronized Roman arts, and preserved the Roman Senate. The "barbarian invasions" were more like a hostile takeover of a declining corporation by people who wanted to run it, not shut it down.',
  },
];

// ── Legacy for Today ────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Roman Law: Foundation of Western Legal Systems',
    detail:
      'The Corpus Juris Civilis \u2014 Justinian\'s codification of Roman law \u2014 is the foundation of civil law in continental Europe, Latin America, and much of the world. Concepts we take for granted \u2014 innocent until proven guilty, the right to a fair trial, the distinction between civil and criminal law, contract law, property rights \u2014 all have Roman origins. English common law developed differently but still absorbed Roman legal principles. Every time you sign a contract or stand trial, you are participating in a system the Romans created.',
  },
  {
    label: 'Latin: The Language That Never Died',
    detail:
      'Latin didn\'t die \u2014 it evolved. Five major world languages are direct descendants of Latin: French, Spanish, Italian, Portuguese, and Romanian. Together these Romance languages are spoken by over 900 million people as native languages. Latin vocabulary permeates English (roughly 60% of English words have Latin roots). Latin remained the language of science, law, medicine, and the Catholic Church well into the modern era. The biological classification system (Homo sapiens) is in Latin. Latin inscriptions grace courthouses and universities worldwide.',
  },
  {
    label: 'The Idea of Rome: A Political Ghost',
    detail:
      'The idea of Rome \u2014 universal empire, civilizational authority, imperial destiny \u2014 has haunted Western politics for 1,500 years. The Holy Roman Empire claimed Roman legitimacy for 1,000 years. Napoleon crowned himself with Roman imagery. Mussolini explicitly modeled his fascist state on Rome, using the fasces (a Roman symbol of authority) as his emblem. The word "emperor" derives from imperator, "senate" from senatus, "republic" from res publica. American founders consciously modeled their republic on Rome \u2014 the Senate, the Capitol, the eagle, the architecture of Washington, D.C.',
  },
  {
    label: '"Decline and Fall" as a Warning',
    detail:
      'The fall of Rome has been invoked as a warning by every generation since Gibbon. The parallels are debated endlessly: military overextension, growing inequality, political dysfunction and polarization, reliance on foreign labor, loss of civic virtue, unsustainable debt, declining trust in institutions. Whether these analogies are valid is debatable \u2014 modern states differ fundamentally from ancient empires. But the lesson that civilizations are mortal, that decline is not inevitable but possible, that complex societies can and do collapse, remains as relevant as ever. Rome reminds us that nothing lasts forever unless it is actively maintained.',
  },
];

// ── Connection Cards ────────────────────────────────────────────────────────

const CONNECTIONS: ConnectionCard[] = [
  {
    to: '/roman-republic',
    label: 'The Roman Republic',
    description: 'How Rome built its empire \u2014 from city-state to superpower',
    color: CRIMSON,
  },
  {
    to: '/byzantine-empire',
    label: 'The Byzantine Empire',
    description: 'The Eastern Empire that survived 977 years longer',
    color: TEAL,
  },
  {
    to: '/medieval-europe',
    label: 'Medieval Europe',
    description: 'What came after: feudalism, the Church, and Charlemagne',
    color: GOLD,
  },
  {
    to: '/barbarian-kingdoms',
    label: 'The Barbarian Kingdoms',
    description: 'Germanic successor states that replaced the Western Empire',
    color: INDIGO,
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

function StatsBar({ stats }: { stats: StatEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 14,
        marginBottom: 8,
      }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${s.color}33`,
            borderRadius: 10,
            padding: '14px 16px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: s.color,
              fontSize: '1.5rem',
              fontWeight: 800,
              marginBottom: 4,
            }}
          >
            {s.value}
          </p>
          <p style={{ color: ASH, fontSize: '0.8rem', lineHeight: 1.4 }}>
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function DebateGrid({ entries }: { entries: DebateEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {entries.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${e.color}33`,
            borderRadius: 10,
            padding: 18,
          }}
        >
          <h4
            style={{
              fontWeight: 700,
              color: e.color,
              marginBottom: 4,
              fontSize: '1.05rem',
            }}
          >
            {e.historian}
          </h4>
          <p
            style={{
              color: '#f1f5f9',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginBottom: 10,
              fontStyle: 'italic',
            }}
          >
            &ldquo;{e.theory}&rdquo;
          </p>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
            {e.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function ConnectionCards({ cards }: { cards: ConnectionCard[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 14,
      }}
    >
      {cards.map((c, i) => (
        <Link
          key={i}
          to={c.to}
          style={{ textDecoration: 'none' }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${hovered === i ? `${c.color}88` : `${c.color}33`}`,
              borderRadius: 10,
              padding: 18,
              transition: 'border-color 0.2s',
            }}
          >
            <h4
              style={{
                fontWeight: 600,
                color: c.color,
                marginBottom: 6,
                fontSize: '1rem',
              }}
            >
              {c.label} &rarr;
            </h4>
            <p style={{ color: ASH, fontSize: '0.85rem', lineHeight: 1.5 }}>
              {c.description}
            </p>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function RomanFallPage() {
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
            &larr; Back to Timeline
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
              background: `linear-gradient(135deg, ${LEGION_RED}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Fall of Rome &mdash; How a 500-Year Civilization Collapsed
            (200&ndash;476&nbsp;CE)
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
              The Roman Empire &mdash; 70&nbsp;million people,
              2&nbsp;million&nbsp;square miles, the most powerful civilization
              the ancient world ever produced &mdash; didn&rsquo;t fall in a
              day. It took centuries of crisis, plague, invasion, and political
              dysfunction to bring down an empire that stretched from Scotland
              to Mesopotamia. Its collapse ended the Pax Romana, fragmented
              Western Europe into warring kingdoms, and launched the era once
              called the &ldquo;Dark Ages.&rdquo;
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              Yet the fall wasn&rsquo;t total. The Eastern Roman Empire survived
              nearly 1,000&nbsp;more years. Roman law, Latin language, and the
              Catholic Church outlived the empire and shaped the modern world.
              The fall of Rome remains history&rsquo;s greatest cautionary
              tale &mdash; and its most debated mystery.
            </p>
          </motion.div>
        </header>

        {/* ── Key Stats Bar ─────────────────────────────────────────── */}
        <StatsBar stats={KEY_STATS} />

        {/* ── Rome at Its Peak ──────────────────────────────────────── */}
        <SectionWrapper
          id="peak"
          icon="🏛️"
          title="Rome at Its Peak — The Greatest Empire of the Ancient World (117 CE)"
          accentColor={GOLD}
          intro="At its zenith under Emperor Trajan, Rome encompassed 21% of the world's population, built 250,000 miles of roads, delivered 300 million gallons of water daily to its capital, and maintained 200 years of relative peace across the Mediterranean. Nothing like it had existed before — and nothing like it would exist again in the West for over a thousand years."
        >
          <InsightGrid items={PEAK_INSIGHTS} />
        </SectionWrapper>

        {/* ── The Long Decline ──────────────────────────────────────── */}
        <SectionWrapper
          id="decline"
          icon="📉"
          title="The Long Decline — Crisis, Plague, and Inflation (200–400 CE)"
          accentColor={CRIMSON}
          intro="Rome didn't fall overnight. For two centuries, the empire was battered by an accelerating cascade of crises: civil wars that destroyed political legitimacy, currency debasement that wrecked the economy, plagues that killed millions, military overextension that drained the treasury, and a bloating bureaucracy that strangled the society it was meant to serve."
        >
          <TimelineCard entries={DECLINE_TIMELINE} />
        </SectionWrapper>

        {/* ── Diocletian and the Division ────────────────────────────── */}
        <SectionWrapper
          id="division"
          icon="⚖️"
          title="Diocletian and the Division — Splitting the Empire (284–395 CE)"
          accentColor={IMPERIAL_PURPLE}
          intro="Diocletian stabilized the empire through radical reforms — but at the cost of transforming it into an authoritarian state. Constantine moved the capital east and legalized Christianity. By 395 CE, the empire was permanently divided into East and West. The wealthier, more defensible East would survive a millennium. The poorer, more exposed West had less than a century left."
        >
          <InsightGrid items={DIVISION_INSIGHTS} />
        </SectionWrapper>

        {/* ── The Germanic Migrations ───────────────────────────────── */}
        <SectionWrapper
          id="migrations"
          icon="⚔️"
          title="The Germanic Migrations — Pushed by the Huns, Pulled by Rome"
          accentColor={AMBER}
          intro="The 'barbarian invasions' weren't a sudden assault — they were a decades-long process of migration, settlement, and conflict, driven by the terrifying Hunnic expansion from Central Asia. Germanic peoples who had lived alongside Rome for centuries were pushed across Roman frontiers by forces beyond their control. Rome's fatal mistake was not keeping its promises to those it let in."
        >
          <TimelineCard entries={MIGRATIONS_TIMELINE} />
        </SectionWrapper>

        {/* ── The Sack of Rome (410 CE) ─────────────────────────────── */}
        <SectionWrapper
          id="sack-410"
          icon="🔥"
          title="The Sack of Rome — 410 CE: The Eternal City Falls"
          accentColor={LEGION_RED}
          intro="On August 24, 410 CE, the Visigoths under Alaric entered Rome — the first enemy to breach the city in 800 years. The psychological shock reverberated across the entire Mediterranean world. Saint Jerome wept in Bethlehem. Saint Augustine began writing The City of God. The 'Eternal City' was eternal no more."
        >
          <InsightGrid items={SACK_410_INSIGHTS} />
        </SectionWrapper>

        {/* ── The Final Collapse ────────────────────────────────────── */}
        <SectionWrapper
          id="collapse"
          icon="💀"
          title="The Final Collapse — From Attila to the Last Emperor (410–476 CE)"
          accentColor={ROSE}
          intro="After the sack of 410, the Western Empire stumbled on for another 66 years — but it was a walking corpse. Attila the Hun devastated Gaul and Italy. The Vandals sacked Rome again in 455. Puppet emperors came and went at the whim of Germanic generals. Finally, in 476 CE, a Germanic chieftain named Odoacer quietly deposed the last Western Roman emperor — a teenager mockingly called 'Little Augustus.' There was no dramatic last stand. The empire simply ceased to exist."
        >
          <TimelineCard entries={COLLAPSE_TIMELINE} />
        </SectionWrapper>

        {/* ── The Great Debate ──────────────────────────────────────── */}
        <SectionWrapper
          id="debate"
          icon="🤔"
          title="Why Did Rome Fall? — The Great Debate"
          accentColor={PURPLE}
          intro="For 250 years, historians have argued about why Rome fell. Over 200 theories have been proposed — from lead poisoning to moral decay to climate change. Edward Gibbon blamed Christianity. Peter Heather blamed barbarians. Guy Halsall blamed Roman political dysfunction. The truth is probably: all of the above. Here are the major theories."
        >
          <DebateGrid entries={DEBATE_ENTRIES} />
        </SectionWrapper>

        {/* ── What Actually Fell ────────────────────────────────────── */}
        <SectionWrapper
          id="what-fell"
          icon="🗺️"
          title="What Actually Fell — And What Survived"
          accentColor={TEAL}
          intro="The 'fall of Rome' is misleading. Only the Western half fell in 476 CE. The Eastern Roman Empire — the Byzantine Empire — survived and thrived for nearly 1,000 more years, until Constantinople fell to the Ottoman Turks in 1453 CE. Roman law, Latin, and the Catholic Church all outlived the empire itself. Rome's most enduring creations weren't its legions or aqueducts — they were its ideas."
        >
          <InsightGrid items={WHAT_FELL_INSIGHTS} />
        </SectionWrapper>

        {/* ── The Aftermath ─────────────────────────────────────────── */}
        <SectionWrapper
          id="aftermath"
          icon="⛪"
          title="The Aftermath — From Roman Ruins to Medieval Europe"
          accentColor={BRONZE}
          intro="The Western Empire didn't become a void — it transformed. Germanic kingdoms adopted Roman culture. The Catholic Church filled the power vacuum, preserving learning and providing governance. Charlemagne crowned himself 'Roman Emperor' in 800 CE. The great irony of Rome's fall: it was destroyed by people who wanted to be Roman, not destroy Rome."
        >
          <InsightGrid items={AFTERMATH_INSIGHTS} />
        </SectionWrapper>

        {/* ── Legacy for Today ──────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🌍"
          title="Legacy for Today — Why Rome Still Matters"
          accentColor={GREEN}
          intro="Roman law underpins most European legal systems. Five major world languages descend from Latin. The Catholic Church is a direct institutional successor to Rome's religious role. Every generation since Gibbon has seen its own society reflected in Rome's decline — overextension, inequality, political dysfunction. Rome reminds us that civilizations are mortal."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Connections ───────────────────────────────────────────── */}
        <SectionWrapper
          id="connections"
          icon="🔗"
          title="Explore Related Topics"
          accentColor={BLUE}
          intro="The fall of Rome connects to nearly every major theme in Western history. Explore these related deep-dives."
        >
          <ConnectionCards cards={CONNECTIONS} />
        </SectionWrapper>

        {/* ── Footer ───────────────────────────────────────────────── */}
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
            &ldquo;The decline of Rome was the natural and inevitable effect of
            immoderate greatness. Prosperity ripened the principle of decay; the
            cause of the destruction multiplied with the extent of conquest;
            and, as soon as time or accident had removed the artificial
            supports, the stupendous fabric yielded to the pressure of its own
            weight.&rdquo;
            &mdash; Edward Gibbon, <em>The History of the Decline and Fall of
            the Roman Empire</em> (1776)
          </p>
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
