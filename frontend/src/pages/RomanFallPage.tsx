/**
 * RomanFallPage — comprehensive deep-dive on the fall of the Western Roman Empire.
 *
 * Route: /roman-fall
 *
 * Sections:
 *  1. Hero — headline, framing the historiographical debate
 *  2. The Big Question — 200+ theories, Gibbon, modern framing
 *  3. Rome at Its Peak — 1st–2nd century CE statistics and achievements
 *  4. Crisis of the Third Century — 50 years of chaos
 *  5. Division of the Empire — Diocletian through Theodosius
 *  6. The Causes — multi-column breakdown (military/economic/social/external/disease/Christianity)
 *  7. The Germanic Kingdoms — 375–476 CE, barbarian incursions
 *  8. The Final Collapse — 455–476 CE
 *  9. What Actually Fell — debunking the myth of total collapse
 * 10. Legacy and Modern Lessons
 * 11. Key Figures
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const IMPERIAL_RED = '#dc2626';
const CRIMSON = '#991b1b';
const GOLD = '#f59e0b';
const PURPLE = '#a855f7';
const BLUE = '#3b82f6';
const TEAL = '#14b8a6';
const AMBER = '#d97706';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const STEEL = '#64748b';
const ASH = '#94a3b8';
const SLATE = '#64748b';
const BRONZE = '#b45309';
const ROSE = '#f43f5e';
const STONE = '#78716c';
const MARBLE = '#e2e8f0';

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

interface StatEntry {
  label: string;
  value: string;
  color: string;
}

interface ConnectionCard {
  title: string;
  description: string;
  path: string;
  color: string;
}

// ── Hero Stats ──────────────────────────────────────────────────────────────

const HERO_STATS: StatEntry[] = [
  { label: 'Western Empire Duration', value: '1,229 years', color: IMPERIAL_RED },
  { label: 'Eastern Empire Survived', value: '977 more years', color: PURPLE },
  { label: 'Peak Population', value: '70 million', color: GOLD },
  { label: 'Proposed Causes', value: '200+', color: TEAL },
  { label: 'Peak Territory', value: '5 million km²', color: BLUE },
];

// ── The Big Question ────────────────────────────────────────────────────────

const DEBATE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Gibbon\'s "Decline and Fall" (1776)',
    detail:
      'Edward Gibbon\'s six-volume masterwork blamed two forces: Christianity — which he argued replaced Roman civic and martial virtues with otherworldly passivity — and "barbarism," the relentless pressure of Germanic and nomadic peoples on the frontiers. Published the same year as the American Declaration of Independence, Gibbon\'s work shaped how the West understood Rome\'s fall for two centuries. His prose remains magnificent; his thesis, most modern historians agree, is oversimplified.',
  },
  {
    label: '200+ Proposed Causes',
    detail:
      'German historian Alexander Demandt catalogued over 200 distinct explanations scholars have proposed for Rome\'s fall — from lead poisoning to soil exhaustion to moral decay to excessive bathing. The sheer number of theories tells us something important: no single cause is sufficient. The fall of Rome was a convergence of military, economic, environmental, social, and political failures that reinforced each other over centuries.',
  },
  {
    label: 'Not a Collapse — A Transformation',
    detail:
      'Modern historians increasingly reject the word "fall" entirely. Peter Brown\'s influential "The World of Late Antiquity" (1971) reframed the period as a transformation rather than a catastrophe. Roman institutions, culture, law, and language didn\'t vanish — they evolved into medieval European civilization. The "fall of Rome" was less like a building collapsing and more like a building being slowly renovated into something different while people kept living in it.',
  },
  {
    label: 'The Eastern Counter-Example',
    detail:
      'The most powerful argument against any single-cause theory: the Eastern Roman Empire (Byzantine Empire), which shared Rome\'s religion, bureaucracy, and many of its supposed "weaknesses," survived for nearly 1,000 years after the West fell. Constantinople didn\'t fall until 1453 CE — to the Ottoman Turks, not Germanic tribes. Whatever killed the Western Empire, it wasn\'t Christianity, Roman culture, or imperial governance per se.',
  },
];

// ── Rome at Its Peak ────────────────────────────────────────────────────────

const PEAK_INSIGHTS: InsightEntry[] = [
  {
    label: 'One-Quarter of Humanity',
    detail:
      'At its height under Trajan (117 CE), the Roman Empire held approximately 70 million people — roughly one-quarter of the world\'s total population. The empire stretched from Britain to Mesopotamia, from the Rhine to the Sahara. A single currency, a single legal system, and a network of 250,000 miles of roads connected the Mediterranean world into the largest unified political entity the West had ever seen.',
  },
  {
    label: 'Pax Romana: 200 Years of Peace',
    detail:
      'From 27 BCE to 180 CE — the Pax Romana — the Roman world experienced two centuries of relative peace, stability, and prosperity unmatched in Western history until the modern era. Trade flourished from India to Scotland. Cities grew. Architecture reached new heights — the Colosseum, Pantheon, and aqueducts that still stand today were built during this era. Roman GDP may have constituted roughly 30% of the world total.',
  },
  {
    label: 'The Five Good Emperors',
    detail:
      'Nerva, Trajan, Hadrian, Antoninus Pius, and Marcus Aurelius (96–180 CE) — adopted rather than hereditary successors — produced what Gibbon called "the period in the history of the world during which the condition of the human race was most happy and prosperous." Each chose his successor based on merit, not blood. This system of adoptive succession ended when Marcus Aurelius broke the pattern and named his son Commodus as heir. Commodus was a disaster.',
  },
  {
    label: 'Engineering and Infrastructure',
    detail:
      'Rome\'s infrastructure was staggering: 250,000 miles of roads (50,000 paved), 11 aqueducts supplying Rome with 300 million gallons of fresh water daily, public baths that could hold thousands, a postal system spanning three continents, and concrete so durable that Roman harbors still stand underwater 2,000 years later. No European state would match Rome\'s engineering until the Industrial Revolution.',
  },
];

// ── Crisis of the Third Century ────────────────────────────────────────────

const CRISIS_TIMELINE: TimelineEntry[] = [
  {
    year: '235 CE',
    title: 'Assassination of Severus Alexander — Chaos Begins',
    description:
      'The murder of Emperor Severus Alexander by his own troops in 235 CE opened a 50-year period of near-total political collapse. Over the next half-century, more than 50 men claimed the title of emperor — most ruling only months before being assassinated by rivals or their own soldiers. The army, not the Senate, made and unmade emperors at will.',
    color: IMPERIAL_RED,
  },
  {
    year: '249–262 CE',
    title: 'Plague of Cyprian — 5,000 Dead Per Day',
    description:
      'A devastating pandemic — possibly smallpox or a hemorrhagic fever — swept the empire for over a decade. At its peak, the plague reportedly killed 5,000 people per day in Rome alone. Total deaths may have reached 5 million across the empire. The plague devastated the army, depopulated frontier provinces, and shattered tax revenue. Combined with constant civil war, it nearly destroyed the empire.',
    color: ROSE,
  },
  {
    year: '260 CE',
    title: 'Economic Collapse — Currency Debased to Nothing',
    description:
      'To pay armies and fund wars, emperors debased the currency relentlessly. The silver content of the denarius plummeted from 85% under Nero to roughly 5% by the reign of Gallienus. The result was hyperinflation: prices rose by an estimated 1,000% over the century. Confidence in Roman currency collapsed. Soldiers demanded payment in kind — grain and goods — rather than worthless coins. The sophisticated monetary economy that had powered Rome\'s trade networks disintegrated.',
    color: AMBER,
  },
  {
    year: '260–274 CE',
    title: 'The Empire Fractures',
    description:
      'The empire nearly split permanently into three parts: the Gallic Empire (Britain, Gaul, Hispania) under Postumus, the Palmyrene Empire (Syria, Egypt) under Queen Zenobia, and a rump central empire in Italy and the Balkans. For 14 years, three separate governments claimed to be the legitimate Roman Empire. That the empire was reunified at all — by the soldier-emperor Aurelian — was remarkable. He earned the title "Restorer of the World."',
    color: PURPLE,
  },
  {
    year: '284 CE',
    title: 'Diocletian — The Crisis Ends',
    description:
      'Diocletian, a low-born Dalmatian soldier who rose through the ranks, seized power in 284 CE and ended the Crisis of the Third Century through radical reforms. He divided the empire into a Tetrarchy (rule of four), reorganized the provinces, reformed taxation, attempted price controls (the Edict on Maximum Prices), and doubled the size of the army. His reforms stabilized the empire but also transformed it: the relatively free Principate became the authoritarian Dominate.',
    color: TEAL,
  },
];

// ── Division of the Empire ──────────────────────────────────────────────────

const DIVISION_TIMELINE: TimelineEntry[] = [
  {
    year: '285 CE',
    title: 'Diocletian Splits the Empire',
    description:
      'Recognizing that one man could not govern and defend an empire stretching from Scotland to Iraq, Diocletian created the Tetrarchy: two senior emperors (Augusti) and two junior emperors (Caesares), one pair for the East and one for the West. It was a pragmatic solution — the empire had grown too large and faced threats on too many frontiers for centralized rule. The division was meant to be administrative, not permanent. It became permanent.',
    color: TEAL,
  },
  {
    year: '306–337 CE',
    title: 'Constantine I — Christianity and Constantinople',
    description:
      'Constantine reunified the empire after a series of civil wars, converted to Christianity (the Edict of Milan in 313 CE legalized the faith), and made the fateful decision to build a new capital — Constantinople — on the site of the Greek city of Byzantium. The "New Rome" was strategically brilliant: positioned on the Bosphorus, it controlled trade between Europe and Asia, was nearly impregnable behind its massive walls, and anchored the wealthier, more urbanized eastern half of the empire. Constantinople would outlast Rome by a millennium.',
    color: GOLD,
  },
  {
    year: '361–363 CE',
    title: 'Julian the Apostate — The Last Pagan Emperor',
    description:
      'Julian, Constantine\'s nephew, attempted to reverse Christianization and restore traditional Roman religion. He reopened pagan temples, revoked Christian privileges, and tried to rebuild the Jewish Temple in Jerusalem. His brief reign — he died fighting the Sassanid Persians after only 20 months — demonstrated that Christianity had become too deeply rooted to uproot. After Julian, no emperor would seriously challenge Christianity\'s dominance.',
    color: BRONZE,
  },
  {
    year: '395 CE',
    title: 'Theodosius I — The Final Division',
    description:
      'Theodosius I was the last emperor to rule both halves of the Roman Empire. He made Christianity the official state religion (Edict of Thessalonica, 380 CE), banned pagan worship, and closed the ancient temples. When he died in 395 CE, the empire was divided between his two young sons: Arcadius received the East, Honorius the West. The two halves would never be reunited. The wealthier, more defensible East would survive; the West, hemorrhaging territory and revenue, had less than a century left.',
    color: IMPERIAL_RED,
  },
];

// ── The Causes — Military/Political ────────────────────────────────────────

const MILITARY_CAUSES: InsightEntry[] = [
  {
    label: 'Over-Extension: Too Large to Defend',
    detail:
      'The empire\'s frontier stretched over 10,000 miles — from Hadrian\'s Wall in Britain to the Euphrates River in Mesopotamia, along the Rhine, the Danube, and across North Africa. Defending this perimeter required an army of 400,000–600,000 men, a logistical and financial burden that consumed perhaps 70% of the imperial budget. When threats appeared on multiple frontiers simultaneously — as they increasingly did in the 4th and 5th centuries — there simply weren\'t enough soldiers to go around.',
  },
  {
    label: 'Foederati: Outsourcing Defense to the Enemy',
    detail:
      'As Roman manpower declined, the empire increasingly relied on Germanic foederati — allied barbarian warriors who fought under their own chiefs in exchange for land and payment. By the 5th century, "Roman" armies were largely barbarian in composition. The problem was loyalty: foederati served their own leaders, not Rome. When the interests of barbarian generals and Roman emperors diverged, the barbarian generals had the armies. The last Roman armies in the West were Roman in name only.',
  },
  {
    label: 'Constant Civil Wars',
    detail:
      'Rome never solved its succession problem. From the "Year of Four Emperors" (69 CE) to the final decades, civil wars bled the empire of soldiers, wealth, and legitimacy. The army learned it could make and unmake emperors — and frequently did. Between 235 and 284 CE alone, over 50 men claimed the purple. Every civil war meant Roman soldiers killing Roman soldiers while the frontiers went undefended.',
  },
  {
    label: 'Loss of Civic Virtue',
    detail:
      'In the Republic and early Empire, Roman citizens served in the legions out of duty and patriotism. By the late Empire, military service was avoided by the wealthy, who paid to be exempted, and increasingly filled by barbarian recruits who fought for pay, not for Rome. The citizen-soldier who had built the empire was replaced by professional mercenaries with no stake in Roman civilization.',
  },
];

// ── The Causes — Economic ──────────────────────────────────────────────────

const ECONOMIC_CAUSES: InsightEntry[] = [
  {
    label: 'Currency Debasement: 85% → 5% Silver',
    detail:
      'The story of Rome\'s economy is written in its coins. Under Augustus, the silver denarius was 98% pure. Nero reduced it to 85%. Septimius Severus brought it to 50%. By Gallienus (260s CE), the "silver" coin contained only about 5% silver — the rest was bronze washed with a thin silver coating. This wasn\'t a sudden crisis but a 300-year erosion of monetary credibility that destroyed savings, disrupted trade, and made long-term economic planning impossible.',
  },
  {
    label: 'Hyperinflation and the Collapse of Commerce',
    detail:
      'As the currency lost value, prices skyrocketed. Diocletian\'s Edict on Maximum Prices (301 CE) — which set price ceilings on over 1,000 goods and services, with the death penalty for violations — was a desperate response to inflation that had made the economy nearly ungovernable. The edict failed: merchants simply stopped selling goods. The sophisticated monetary economy of the Pax Romana gave way to a barter economy and payment in kind.',
  },
  {
    label: 'Tax Burden and Economic Flight',
    detail:
      'As the empire shrank and military costs grew, the tax burden on remaining provinces became crushing. Small farmers, unable to pay, abandoned their land or became coloni — essentially serfs tied to large estates owned by wealthy landowners who could negotiate tax exemptions. The productive middle class was squeezed out of existence. Tax revenue declined further, military spending couldn\'t be maintained, frontiers weakened — a vicious cycle.',
  },
  {
    label: 'Trade Network Collapse',
    detail:
      'The Pax Romana had sustained a Mediterranean-wide trade network: Egyptian grain fed Rome, Spanish silver funded the treasury, Gallic wine flowed east, eastern spices flowed west. As barbarian incursions disrupted trade routes, piracy returned to the Mediterranean, and provinces fell under barbarian control, this integrated economy fragmented. Cities shrank. Specialized production gave way to local self-sufficiency. The economic integration that had been Rome\'s greatest achievement unraveled.',
  },
];

// ── The Causes — Social/Political ──────────────────────────────────────────

const SOCIAL_CAUSES: InsightEntry[] = [
  {
    label: 'Corruption and Bureaucratic Bloat',
    detail:
      'Diocletian\'s administrative reforms saved the empire but created an enormous bureaucracy. The number of provinces was doubled, administrative layers multiplied, and a vast corps of officials — many of them corrupt — siphoned off resources. Offices were bought and sold. Tax collectors enriched themselves. The gap between the imperial court and the provinces it governed widened into an abyss.',
  },
  {
    label: 'Loss of Roman Identity',
    detail:
      'The Edict of Caracalla (212 CE) extended Roman citizenship to all free inhabitants of the empire — a seemingly generous act that actually devalued citizenship by making it universal. When everyone was a Roman citizen, the distinction meant nothing. The shared identity and civic obligation that had bound the Republic and early Empire together dissolved. Late Roman provincials felt little connection to a distant emperor in Constantinople or Ravenna.',
  },
  {
    label: 'Declining Civic Engagement',
    detail:
      'In the Republic, wealthy Romans competed to build temples, roads, and aqueducts — civic euergetism was the path to political prestige. By the late Empire, the wealthy retreated to private estates, avoided civic obligations, and sought exemptions from the crushing responsibilities of local governance. Cities, once the foundation of Roman civilization, decayed as their leading citizens stopped investing in public infrastructure and started investing in fortified rural villas.',
  },
];

// ── The Causes — External Pressure ─────────────────────────────────────────

const EXTERNAL_CAUSES: InsightEntry[] = [
  {
    label: 'The Huns: Domino Effect from Central Asia',
    detail:
      'In the 370s CE, the Huns — nomadic warriors from the Central Asian steppe — burst into Europe with a ferocity that terrified even the Germanic tribes. The Huns didn\'t directly destroy Rome, but they triggered a catastrophic chain reaction: fleeing the Huns, the Goths, Vandals, Burgundians, and other Germanic peoples surged into Roman territory in numbers too large to be stopped or absorbed. The Huns were the stone thrown into the pond; the waves wrecked the empire.',
  },
  {
    label: 'Pressure on All Frontiers',
    detail:
      'In the 1st and 2nd centuries, Rome faced threats on one or two frontiers at a time. By the 4th and 5th centuries, it faced them everywhere simultaneously: Goths on the Danube, Franks and Alamanni on the Rhine, Saxons raiding Britain, Vandals in North Africa, Persians in the East. The empire couldn\'t concentrate forces against any one threat without leaving another frontier exposed. This strategic overstretch was ultimately insoluble with the resources available.',
  },
];

// ── The Causes — Environmental/Disease ─────────────────────────────────────

const DISEASE_CAUSES: InsightEntry[] = [
  {
    label: 'Antonine Plague (165–180 CE)',
    detail:
      'Probably smallpox, brought back by soldiers returning from campaigns in Mesopotamia. The plague killed an estimated 5–10 million people across the empire — perhaps 10% of the population. It struck during the reign of Marcus Aurelius, killing soldiers, depopulating frontier provinces, and reducing tax revenue. Some historians date the beginning of Rome\'s decline to this plague, which ended the demographic growth of the Pax Romana.',
  },
  {
    label: 'Plague of Cyprian (249–262 CE)',
    detail:
      'Named for St. Cyprian, Bishop of Carthage, who described its horrors, this epidemic (possibly a viral hemorrhagic fever) devastated the empire during the already catastrophic Crisis of the Third Century. At its peak, 5,000 people reportedly died per day in Rome. The plague ravaged the army, depopulated cities, and contributed to the economic and military collapse of the mid-3rd century. Two emperors may have died of it.',
  },
  {
    label: 'Climate Cooling (5th Century)',
    detail:
      'Recent climate science has revealed that the "Roman Climate Optimum" — a period of warm, stable, and wet conditions that supported Mediterranean agriculture — ended in the late 4th and 5th centuries. Cooler temperatures, drought in some regions, and reduced agricultural yields compounded the empire\'s other problems. The Late Antique Little Ice Age (c. 536–660 CE) — triggered partly by volcanic eruptions — further destabilized post-Roman Europe.',
  },
  {
    label: 'Lead Poisoning (Controversial)',
    detail:
      'Some historians have argued that chronic lead poisoning from Roman water pipes (the word "plumbing" comes from the Latin plumbum, lead), lead-lined cookware, and lead-sweetened wine (sapa) impaired the Roman ruling class — causing infertility, cognitive decline, and erratic behavior. The theory is disputed: most Roman water pipes developed calcium deposits that limited lead leaching, and the poor (who didn\'t use lead cookware) suffered the same social decline. But the lead levels in Roman skeletons are measurably elevated.',
  },
];

// ── Christianity (Controversial) ───────────────────────────────────────────

const CHRISTIANITY_DEBATE: InsightEntry[] = [
  {
    label: 'Gibbon\'s Argument: From Civic Virtue to Spiritual Withdrawal',
    detail:
      'Gibbon argued that Christianity undermined Rome by shifting society\'s values from civic duty, military honor, and public engagement to otherworldly salvation, monasticism, and passive acceptance of suffering. Resources that once built roads and aqueducts were diverted to build churches and monasteries. The best minds, who might have been generals or administrators, became monks and theologians. Roman aggression was replaced by Christian meekness — and meekness, Gibbon implied, doesn\'t defend frontiers.',
  },
  {
    label: 'The Devastating Counter-Argument',
    detail:
      'The Eastern Roman Empire — which was just as Christian as the West, with an even more powerful church establishment — survived for nearly 1,000 years after the West fell. If Christianity caused Rome\'s fall, why did it only destroy the western half? The East was, if anything, more thoroughly Christianized. The obvious conclusion: Christianity was not a sufficient cause. The differences between East and West — wealth, defensibility, strategic depth, the quality of Constantinople\'s walls — mattered far more than religion.',
  },
];

// ── The Germanic Kingdoms ──────────────────────────────────────────────────

const GERMANIC_TIMELINE: TimelineEntry[] = [
  {
    year: '376 CE',
    title: 'Visigoths Cross the Danube — Rome\'s Fatal Mistake',
    description:
      'Fleeing the Huns, the Visigoths — perhaps 200,000 men, women, and children — begged Emperor Valens for permission to cross the Danube into Roman territory. Valens agreed, seeing a source of cheap soldiers. But Roman officials exploited the desperate refugees: they withheld food, sold dog meat at extortionate prices, and reportedly traded Gothic children into slavery for scraps. The Goths, starving and furious, revolted. Rome had created its own worst enemy.',
    color: AMBER,
  },
  {
    year: '378 CE',
    title: 'Battle of Adrianople — An Emperor Dies',
    description:
      'Emperor Valens marched against the rebelling Goths near Adrianople (modern Edirne, Turkey) without waiting for reinforcements from the Western Empire. The Gothic cavalry shattered the Roman lines. Two-thirds of the Eastern Roman army — perhaps 20,000 soldiers — were killed, including Valens himself, whose body was never recovered. Adrianople was the worst Roman military disaster since Cannae, 600 years earlier. It proved that barbarian armies could defeat Roman legions in a pitched battle.',
    color: IMPERIAL_RED,
  },
  {
    year: '410 CE',
    title: 'Sack of Rome by the Visigoths — Psychological Earthquake',
    description:
      'On August 24, 410 CE, Alaric I and his Visigoths entered Rome and sacked the city for three days. It was the first time in 800 years — since the Gauls in 390 BCE — that a foreign enemy had taken the Eternal City. The physical damage was relatively limited (Alaric was a Christian and spared churches), but the psychological impact was immense. St. Jerome, writing from Bethlehem, declared: "The city which had taken the whole world was itself taken." St. Augustine wrote "The City of God" in direct response, arguing that earthly empires are transient — only God\'s kingdom endures.',
    color: CRIMSON,
  },
  {
    year: '434–453 CE',
    title: 'Attila the Hun — "The Scourge of God"',
    description:
      'Attila united the Hunnic tribes and created an empire stretching from the Rhine to the Ural Mountains. He devastated the Balkans, extorted enormous tribute from Constantinople, invaded Gaul (where a combined Roman-Visigothic army stopped him at the Battle of the Catalaunian Plains in 451 CE), and ravaged Italy. Yet he never took Rome — legend credits Pope Leo I with persuading him to withdraw. Attila died in 453 CE on his wedding night (possibly of a nosebleed), and his empire immediately collapsed.',
    color: ROSE,
  },
  {
    year: '455 CE',
    title: 'Sack of Rome by the Vandals',
    description:
      'The Vandals, who had crossed from Spain to North Africa and built a naval power based in Carthage, sailed to Rome and sacked the city for two weeks — far more thoroughly than the Visigoths had in 410. They stripped the Temple of Jupiter, carried off treasures reportedly including items looted from Jerusalem by Titus in 70 CE, and took thousands of captives including the Empress Eudoxia. The word "vandalism" entered European languages as a result, though recent scholarship suggests the damage was more systematic looting than wanton destruction.',
    color: BRONZE,
  },
];

// ── The Final Collapse ─────────────────────────────────────────────────────

const FINAL_COLLAPSE_INSIGHTS: InsightEntry[] = [
  {
    label: 'An Empire Reduced to Italy',
    detail:
      'By 460 CE, the Western Roman Empire had lost virtually all its provinces: Britain (abandoned c. 410), Gaul (divided among Franks, Visigoths, and Burgundians), Spain (Visigoths and Suevi), North Africa (Vandals). The "Emperor" controlled little more than Italy itself — and even that was effectively governed by Germanic military strongmen. The imperial title had become a fiction maintained by barbarian generals who found it useful to rule through puppet emperors rather than claim the throne themselves.',
  },
  {
    label: 'Puppet Emperors, Barbarian Generals',
    detail:
      'The last two decades of the Western Empire were dominated by Germanic generals — Ricimer, Gundobad, Orestes — who installed and deposed emperors at will. Nine emperors reigned (if you can call it reigning) between 455 and 476 CE, most for only months. Real power lay with the military commanders, not the men wearing the purple. The imperial title was a costume, not a command.',
  },
  {
    label: 'September 4, 476 CE — The "End"',
    detail:
      'Odoacer, a Germanic chieftain who had served in the Roman army, deposed Romulus Augustulus — the last Western Roman Emperor, a teenage boy placed on the throne by his father, the general Orestes. Odoacer didn\'t kill the boy; he pensioned him off to a villa in Campania with a comfortable annual allowance. Odoacer then sent the imperial regalia to Constantinople, acknowledging the Eastern Emperor as the sole Roman Emperor. There would be no more Western emperors.',
  },
  {
    label: 'Nobody Noticed at the Time',
    detail:
      'The most remarkable thing about the "fall of Rome" is that contemporaries barely registered it. No one wrote "the Roman Empire fell today." The machinery of Roman life — tax collection, law courts, the Church, local governance — continued under Odoacer much as it had under the last emperors. Odoacer ruled Italy competently for 17 years. For most people, the transition from Roman emperor to barbarian king changed nothing in their daily lives. The fall of Rome was less a dramatic collapse than the final evaporation of a fiction.',
  },
];

// ── What Actually Fell ─────────────────────────────────────────────────────

const SURVIVED_INSIGHTS: InsightEntry[] = [
  {
    label: 'Roman Law — The Foundation of Western Legal Systems',
    detail:
      'Roman law survived the fall of the Western Empire and became the foundation of legal systems across continental Europe and, through colonialism, much of the world. Justinian\'s compilation of Roman law (the Corpus Juris Civilis, 529–534 CE) became the basis of the Napoleonic Code and, through it, the legal systems of France, Germany, Italy, Spain, Latin America, and much of Africa and Asia. Concepts like innocent until proven guilty, the right to a defense, and the distinction between public and private law are Roman innovations.',
  },
  {
    label: 'Latin → French, Spanish, Italian, Portuguese, Romanian',
    detail:
      'Latin didn\'t die — it evolved. The "vulgar Latin" spoken by soldiers, merchants, and farmers across the empire gradually diverged into the Romance languages: French, Spanish, Italian, Portuguese, and Romanian. Today, approximately 920 million people speak a language derived from Latin. Latin itself survived as the language of the Catholic Church, science, medicine, and law well into the modern era.',
  },
  {
    label: 'The Eastern Empire Continued Until 1453',
    detail:
      'The "other half" of Rome — the Eastern Roman Empire, which modern historians call the Byzantine Empire — survived for nearly a millennium after the fall of the West. Constantinople remained one of the world\'s greatest cities, Byzantine scholars preserved Greek and Roman learning, and the empire served as a Christian bulwark against Islamic expansion into Europe. The Byzantine Empire fell only when the Ottoman Turks finally breached Constantinople\'s legendary walls in 1453.',
  },
  {
    label: 'The Catholic Church Preserved Learning',
    detail:
      'The Roman Catholic Church became the primary institution that preserved Latin literacy, Roman administrative practices, and classical learning through the early medieval period. Monasteries copied manuscripts, bishops administered cities, and the Church\'s organizational structure — dioceses, provinces, a centralized hierarchy — was modeled directly on Roman imperial administration. The Pope, ruling from Rome, was in many ways the successor of the Western Emperor.',
  },
  {
    label: 'Charlemagne: The Revival of Rome (800 CE)',
    detail:
      'On Christmas Day 800 CE, Pope Leo III crowned Charlemagne, King of the Franks, as "Emperor of the Romans" — reviving the Western imperial title 324 years after its extinction. Charlemagne\'s empire (the Carolingian Empire) encompassed much of Western Europe and consciously modeled itself on Rome. The "Holy Roman Empire" that followed (962–1806 CE) claimed direct continuity with ancient Rome. The idea of Rome was so powerful that Europeans kept trying to resurrect it for over a thousand years.',
  },
];

// ── Legacy and Modern Lessons ──────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'The "Decline and Fall" Template',
    detail:
      'Ever since Gibbon, the fall of Rome has served as the default template for understanding imperial decline. The British Empire\'s retreat was compared to Rome. American commentators invoke Rome when discussing overstretch, debt, and political polarization. The European Union has been compared to Rome\'s multi-ethnic, multi-lingual experiment. Whether these comparisons are valid is debatable — but the fact that they\'re made constantly tells us how deeply Rome\'s fall shaped Western political imagination.',
  },
  {
    label: 'Internal Weakness, Not Just External Pressure',
    detail:
      'The central lesson historians draw from Rome: empires are not usually destroyed by external enemies alone. They are weakened by internal dysfunction — political instability, economic mismanagement, inequality, loss of social cohesion — until they can no longer resist external pressures that they once handled easily. The Germanic tribes that overran the West in the 5th century were not significantly stronger than the tribes Rome had defeated for centuries. Rome was weaker.',
  },
  {
    label: 'Transformation, Not Extinction',
    detail:
      'Perhaps the most important modern insight: Rome didn\'t "fall" — it transformed over centuries into medieval Europe. The Roman legal system evolved into medieval law. Latin evolved into Romance languages. Roman Christianity became medieval Catholicism. Roman cities became medieval towns. Roman roads remained Europe\'s primary transportation network for a thousand years. The fall of Rome was a political event; culturally and institutionally, Rome never truly ended.',
  },
  {
    label: 'The Complexity Lesson',
    detail:
      'With 200+ proposed causes, Rome\'s fall teaches us that complex systems fail for complex reasons. There is no silver bullet explanation — no single villain, no single mistake, no single cause. Military overstretch, economic decline, environmental change, disease, political corruption, and external invasion all played roles, and they reinforced each other in feedback loops that made recovery increasingly impossible. Anyone offering a simple explanation for the fall of Rome is selling something.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Marcus Aurelius',
    years: '121–180 CE',
    contribution:
      'The last of the "Five Good Emperors" and the Stoic philosopher-king who wrote the "Meditations" while campaigning on the Danube frontier. Widely considered the last emperor of Rome\'s golden age. His fateful decision to name his son Commodus as successor — breaking the adoptive tradition — marked the beginning of Rome\'s long decline.',
  },
  {
    name: 'Diocletian',
    years: '244–311 CE',
    contribution:
      'The pragmatic administrator who ended the Crisis of the Third Century through radical reforms: splitting the empire into the Tetrarchy, doubling the army, reorganizing provinces, and attempting price controls. He briefly stabilized the empire and then became the only Roman emperor to voluntarily retire — to a palace in Split, Croatia, where he famously grew cabbages.',
  },
  {
    name: 'Constantine I',
    years: '272–337 CE',
    contribution:
      'The emperor who Christianized Rome and founded Constantinople. His conversion — whether sincere or political — transformed the empire\'s religious character permanently. By moving the capital east, he ensured that the wealthier, more defensible half of the empire would survive. Constantine reshaped the Roman world more fundamentally than any emperor since Augustus.',
  },
  {
    name: 'Attila the Hun',
    years: 'c. 406–453 CE',
    contribution:
      'The "Scourge of God" who terrorized both halves of the Roman Empire. He united the Hunnic tribes, devastated the Balkans and Gaul, and invaded Italy. Yet he never took Rome or Constantinople. His empire collapsed immediately after his death, proving that the Hunnic threat was personal, not structural. The Huns\' real impact was indirect: by displacing Germanic tribes westward into Roman territory.',
  },
  {
    name: 'Romulus Augustulus',
    years: 'c. 460–after 476 CE',
    contribution:
      'The last Western Roman Emperor — a teenager placed on the throne by his father, the general Orestes. His name is bitterly ironic: "Romulus" was Rome\'s legendary founder, and "Augustulus" (little Augustus) mocked the greatness of the first emperor. When Odoacer deposed him, he was exiled to a Campanian villa — not executed. He was so insignificant that no one recorded when he died.',
  },
  {
    name: 'Odoacer',
    years: 'c. 433–493 CE',
    contribution:
      'The Germanic chieftain who "ended" the Western Roman Empire by deposing Romulus Augustulus in 476 CE. Rather than destroying Rome, he ruled Italy competently for 17 years, maintaining Roman administrative structures and governing through the Senate. He was eventually defeated and killed by the Ostrogothic king Theodoric, who also ruled Italy in Roman style — further blurring the line between "Roman" and "barbarian."',
  },
];

// ── Connection Cards ────────────────────────────────────────────────────────

const CONNECTIONS: ConnectionCard[] = [
  {
    title: 'The Roman Republic',
    description: 'How Rome grew from a city-state to a Mediterranean superpower — and why the Republic fell.',
    path: '/roman-republic',
    color: IMPERIAL_RED,
  },
  {
    title: 'Ancient Rome',
    description: 'The full sweep of Roman civilization, from founding myth to imperial peak.',
    path: '/ancient-rome',
    color: GOLD,
  },
  {
    title: 'The Byzantine Empire',
    description: 'The Eastern Roman Empire that survived for 1,000 years after the West fell.',
    path: '/byzantine-empire',
    color: PURPLE,
  },
  {
    title: 'The Barbarian Kingdoms',
    description: 'The Germanic successor states that replaced Roman rule in Western Europe.',
    path: '/barbarian-kingdoms',
    color: BRONZE,
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

const FIGURE_COLORS = [GOLD, TEAL, IMPERIAL_RED, BRONZE, STEEL, GREEN, PURPLE, BLUE, ROSE, AMBER];

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

function StatsBar({ stats }: { stats: StatEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 14,
        marginTop: 28,
      }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: `1px solid ${s.color}44`,
            borderRadius: 10,
            padding: '14px 16px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: s.color, fontWeight: 700, fontSize: '1.3rem' }}>
            {s.value}
          </p>
          <p style={{ color: SLATE, fontSize: '0.78rem', marginTop: 4 }}>
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function CurrencyDebasementChart() {
  const dataPoints = [
    { emperor: 'Augustus', year: '27 BCE', silver: 98, color: GOLD },
    { emperor: 'Nero', year: '64 CE', silver: 85, color: AMBER },
    { emperor: 'Trajan', year: '117 CE', silver: 85, color: BLUE },
    { emperor: 'M. Aurelius', year: '170 CE', silver: 75, color: TEAL },
    { emperor: 'Sept. Severus', year: '200 CE', silver: 50, color: BRONZE },
    { emperor: 'Caracalla', year: '215 CE', silver: 40, color: STEEL },
    { emperor: 'Gallienus', year: '260 CE', silver: 5, color: IMPERIAL_RED },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 24,
        marginTop: 20,
        marginBottom: 8,
      }}
    >
      <h4
        style={{
          fontWeight: 700,
          color: MARBLE,
          marginBottom: 20,
          fontSize: '1.05rem',
          textAlign: 'center',
        }}
      >
        Silver Content of the Roman Denarius Over 300 Years
      </h4>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, justifyContent: 'center' }}>
        {dataPoints.map((d, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${d.silver * 1.7}px` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            style={{
              width: 55,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <p
              style={{
                color: d.color,
                fontWeight: 700,
                fontSize: '0.85rem',
                marginBottom: 4,
              }}
            >
              {d.silver}%
            </p>
            <div
              style={{
                width: '100%',
                height: `${d.silver * 1.7}px`,
                background: `linear-gradient(180deg, ${d.color}, ${d.color}66)`,
                borderRadius: '6px 6px 0 0',
              }}
            />
          </motion.div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
        {dataPoints.map((d, i) => (
          <div key={i} style={{ width: 55, textAlign: 'center' }}>
            <p style={{ color: ASH, fontSize: '0.65rem', lineHeight: 1.3 }}>{d.emperor}</p>
            <p style={{ color: SLATE, fontSize: '0.6rem' }}>{d.year}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ConnectionCards({ cards }: { cards: ConnectionCard[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 14,
      }}
    >
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
        >
          <Link
            to={c.path}
            style={{
              display: 'block',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${c.color}33`,
              borderRadius: 10,
              padding: 18,
              textDecoration: 'none',
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
              {c.title}
            </h4>
            <p style={{ color: SLATE, fontSize: '0.85rem', lineHeight: 1.5 }}>
              {c.description}
            </p>
          </Link>
        </motion.div>
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
              background: `linear-gradient(135deg, ${IMPERIAL_RED}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Fall of Rome — How the Ancient World's Greatest Empire Collapsed (376–476 CE)
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
              For 1,500 years, historians have debated why the mightiest empire
              the ancient world ever produced — 70 million people, one-quarter
              of humanity, connected by 250,000 miles of roads — crumbled into a
              patchwork of barbarian kingdoms. Over 200 theories have been
              proposed. There is no single answer.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              The better question isn't "why did Rome fall?" but "how did a
              300-year transformation turn the ancient Mediterranean superpower
              into medieval Europe?" Rome didn't collapse in a day. It eroded —
              militarily, economically, demographically, and politically — until
              the final act, in 476 CE, was so anticlimactic that contemporaries
              barely noticed.
            </p>
          </motion.div>
          <StatsBar stats={HERO_STATS} />
        </header>

        {/* ── The Big Question ─────────────────────────────────────────── */}
        <SectionWrapper
          id="debate"
          icon="📜"
          title="The Question Historians Have Debated for 1,500 Years"
          accentColor={GOLD}
          intro="Edward Gibbon published 'The History of the Decline and Fall of the Roman Empire' in 1776 — the same year as the American Declaration of Independence. He blamed Christianity and barbarism. Modern historians have proposed over 200 different primary causes, from lead poisoning to climate change to moral decay. The real answer is that there is no single answer — and the framing of the question matters as much as any response."
        >
          <InsightGrid items={DEBATE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Rome at Its Peak ────────────────────────────────────────── */}
        <SectionWrapper
          id="peak"
          icon="🏛️"
          title="Rome at Its Peak — The Greatest Empire the West Had Ever Seen (1st–2nd Century CE)"
          accentColor={MARBLE}
          intro="To understand what was lost, you must first understand what Rome was at its height. In the 1st and 2nd centuries CE, the Roman Empire was the most powerful, wealthy, and sophisticated state the Western world had ever produced — and arguably the most successful large-scale political organization in human history until the modern era."
        >
          <InsightGrid items={PEAK_INSIGHTS} />
        </SectionWrapper>

        {/* ── Crisis of the Third Century ─────────────────────────────── */}
        <SectionWrapper
          id="crisis"
          icon="⚡"
          title="The Crisis of the Third Century — 50 Years, 50+ Emperors (235–284 CE)"
          accentColor={IMPERIAL_RED}
          intro="The Crisis of the Third Century nearly destroyed Rome 200 years before the final collapse. In half a century, the empire suffered constant civil war, devastating plague, economic meltdown, and territorial fragmentation. That Rome survived at all was remarkable — but it emerged a fundamentally different state, more authoritarian, more militarized, and more brittle."
        >
          <TimelineCard entries={CRISIS_TIMELINE} />
        </SectionWrapper>

        {/* ── Division of the Empire ──────────────────────────────────── */}
        <SectionWrapper
          id="division"
          icon="🗡️"
          title="The Division of the Empire — One Rome Becomes Two (285–395 CE)"
          accentColor={PURPLE}
          intro="Diocletian's decision to split the empire was pragmatic — one man couldn't govern territory stretching from Scotland to Iraq. Constantine's decision to build Constantinople was visionary — it ensured the eastern half would survive for another millennium. Theodosius's death in 395 CE made the split permanent. The West was left with the poorer, less defensible, more vulnerable half."
        >
          <TimelineCard entries={DIVISION_TIMELINE} />
        </SectionWrapper>

        {/* ── The Causes: Military ────────────────────────────────────── */}
        <SectionWrapper
          id="causes-military"
          icon="⚔️"
          title="The Causes — Military and Political"
          accentColor={IMPERIAL_RED}
          intro="Rome was built by its legions. When the legions could no longer defend the frontiers — because of overstretch, civil war, reliance on barbarian mercenaries, and the loss of the citizen-soldier tradition — the empire's political structure became indefensible."
        >
          <InsightGrid items={MILITARY_CAUSES} />
        </SectionWrapper>

        {/* ── The Causes: Economic ────────────────────────────────────── */}
        <SectionWrapper
          id="causes-economic"
          icon="💰"
          title="The Causes — Economic Collapse"
          accentColor={AMBER}
          intro="Rome's economy was the engine of its power — Mediterranean-wide trade, a trusted currency, a productive tax base. Over 300 years, every component failed: the currency was debased to nothing, trade networks collapsed, the tax base shrank, and the productive middle class was crushed between a parasitic aristocracy and an insatiable military."
        >
          <InsightGrid items={ECONOMIC_CAUSES} />
          <CurrencyDebasementChart />
        </SectionWrapper>

        {/* ── The Causes: Social ──────────────────────────────────────── */}
        <SectionWrapper
          id="causes-social"
          icon="🏚️"
          title="The Causes — Social and Political Decay"
          accentColor={STONE}
          intro="A state is only as strong as the civic bonds that hold its people together. In the late Empire, corruption metastasized, civic engagement collapsed, and the shared Roman identity that had once united the Mediterranean world dissolved into parochialism."
        >
          <InsightGrid items={SOCIAL_CAUSES} />
        </SectionWrapper>

        {/* ── The Causes: External ────────────────────────────────────── */}
        <SectionWrapper
          id="causes-external"
          icon="🐎"
          title="The Causes — External Pressure"
          accentColor={ROSE}
          intro="Rome had always faced enemies on its frontiers — but in the 4th and 5th centuries, the scale and simultaneity of external threats exceeded anything the empire had previously confronted. The arrival of the Huns from Central Asia triggered a catastrophic chain reaction that pushed entire nations into Roman territory."
        >
          <InsightGrid items={EXTERNAL_CAUSES} />
        </SectionWrapper>

        {/* ── The Causes: Disease/Environment ─────────────────────────── */}
        <SectionWrapper
          id="causes-disease"
          icon="🦠"
          title="The Causes — Disease and Environmental Change"
          accentColor={GREEN}
          intro="Recent scholarship has highlighted factors that earlier historians overlooked: devastating pandemics that killed millions, and climate shifts that undermined the agricultural base of Mediterranean civilization. Rome's decline was not just political — it was biological and environmental."
        >
          <InsightGrid items={DISEASE_CAUSES} />
        </SectionWrapper>

        {/* ── Christianity Debate ─────────────────────────────────────── */}
        <SectionWrapper
          id="christianity"
          icon="✝️"
          title="The Christianity Debate"
          accentColor={INDIGO}
          intro="Did Christianity weaken Rome? Gibbon thought so. But the Eastern Roman Empire — just as Christian — survived for 1,000 more years. The debate is one of the most enduring in historical scholarship."
        >
          <InsightGrid items={CHRISTIANITY_DEBATE} />
        </SectionWrapper>

        {/* ── The Germanic Kingdoms ───────────────────────────────────── */}
        <SectionWrapper
          id="germanic"
          icon="🛡️"
          title="The Germanic Kingdoms — The Barbarians at (and Through) the Gates (375–476 CE)"
          accentColor={BRONZE}
          intro="The final century of the Western Roman Empire was defined by the Germanic peoples who entered, settled, fought for, fought against, and ultimately replaced Roman authority. The relationship between Rome and the 'barbarians' was far more complex than simple invasion — it involved diplomacy, alliance, exploitation, betrayal, and gradual transformation."
        >
          <TimelineCard entries={GERMANIC_TIMELINE} />
        </SectionWrapper>

        {/* ── The Final Collapse ──────────────────────────────────────── */}
        <SectionWrapper
          id="final"
          icon="🏚️"
          title="The Final Collapse — Not with a Bang but a Whimper (455–476 CE)"
          accentColor={STEEL}
          intro="The last two decades of the Western Roman Empire were less a dramatic collapse than a slow evaporation. The 'emperor' controlled only Italy, and even that was ruled by Germanic generals who installed and deposed puppet rulers at will. When the end came, it was so quiet that contemporaries barely noticed."
        >
          <InsightGrid items={FINAL_COLLAPSE_INSIGHTS} />
        </SectionWrapper>

        {/* ── What Actually Fell ──────────────────────────────────────── */}
        <SectionWrapper
          id="survived"
          icon="🌍"
          title="What Actually Fell — And What Didn't"
          accentColor={TEAL}
          intro="The political structure of the Western Roman Empire collapsed in 476 CE. But Roman civilization — its law, its language, its religion, its architecture, its administrative traditions — did not. The 'fall of Rome' was far less total than popular imagination suggests. Much of what we think of as 'Western civilization' is Roman civilization, still living."
        >
          <InsightGrid items={SURVIVED_INSIGHTS} />
        </SectionWrapper>

        {/* ── Legacy ──────────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🔮"
          title="Legacy and Modern Lessons"
          accentColor={BLUE}
          intro="The fall of Rome is the template through which the West understands imperial decline. Every faltering superpower — Britain, the Soviet Union, the United States — has been compared to Rome. Whether these comparisons are valid matters less than the fact that Rome's fall has shaped how we think about power, civilization, and the fragility of complex societies."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures of Rome's Fall"
          accentColor={GOLD}
          intro="The story of Rome's fall is shaped by philosopher-kings and barbarian warlords, pragmatic administrators and teenage puppet emperors. These are the people who tried to save the empire, those who hastened its end, and those who built something new from its ruins."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Connections ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="connections"
          icon="🔗"
          title="Explore Connected Topics"
          accentColor={PURPLE}
          intro="The fall of the Western Roman Empire connects to the broader story of Roman civilization, the survival of the Eastern Empire, and the emergence of the medieval world."
        >
          <ConnectionCards cards={CONNECTIONS} />
        </SectionWrapper>

        {/* ── Footer ──────────────────────────────────────────────────── */}
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
            "The city which had taken the whole world was itself taken."
            — St. Jerome, on the sack of Rome, 410 CE
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
