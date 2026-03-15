import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────── Theme ───────── */
const ACCENT = '#c41e3a';   // Imperial red
const BG = '#0a0c10';
const TEXT = '#e8e4de';
const TEXT_DIM = '#9a9486';
const TEXT_MUTED = '#6b6458';
const CARD_BG = 'rgba(196,30,58,0.05)';
const CARD_BORDER = 'rgba(196,30,58,0.18)';
const IMPERIAL_RED = '#c41e3a';
const DYNASTY_GOLD = '#c9a84c';
const JADE_GREEN = '#2e8b57';
const SILK_PURPLE = '#7b3f9e';
const BRONZE_ORANGE = '#c9652a';
const WALL_GREY = '#7a8b8b';
const PAPER_CREAM = '#b5985a';
const SCHOLAR_BLUE = '#3a7ca5';

/* ───────── Types ───────── */
type SectionTab =
  | 'timeline'
  | 'qinshihuang'
  | 'inventions'
  | 'confucius'
  | 'daoism'
  | 'silkroad'
  | 'science'
  | 'greatwall'
  | 'civilservice'
  | 'figures'
  | 'legacy';

interface TimelineEvent {
  date: string;
  title: string;
  detail: string;
  color: string;
}

interface Figure {
  name: string;
  dates: string;
  role: string;
  contribution: string;
  detail: string;
  icon: string;
  color: string;
}

/* ───────── Data ───────── */

const CONTEXT_TEXT = 'Ancient China produced one of the most enduring civilizations in human history — one that invented paper, printing, gunpowder, and the compass; built a wall visible from space; developed a system of governance by meritocratic examination that lasted two millennia; and gave the world philosophical traditions that still shape the lives of over a billion people today. From the semi-mythical Xia dynasty to the cosmopolitan glory of the Tang, China\'s ancient history is a story of extraordinary innovation, philosophical depth, imperial ambition, and cultural continuity unmatched anywhere on Earth.';

const TIMELINE_EVENTS: TimelineEvent[] = [
  { date: '2100–1600 BCE', title: 'Xia Dynasty', detail: 'The legendary first dynasty of China, traditionally founded by Yu the Great after he controlled the catastrophic Yellow River floods through years of tireless engineering. Long considered semi-mythical, archaeological discoveries at Erlitou have provided evidence of a sophisticated Bronze Age culture in the right time and place. The Xia established the principle of hereditary rule that would define Chinese governance for four millennia.', color: BRONZE_ORANGE },
  { date: '1600–1046 BCE', title: 'Shang Dynasty', detail: 'The first Chinese dynasty confirmed by contemporary written records. The Shang developed oracle bone script — the earliest known form of Chinese writing — by inscribing questions to ancestral spirits on heated turtle shells and ox bones. They mastered bronze casting to an extraordinary degree, producing ritual vessels of a quality unmatched anywhere in the ancient world. Shang society was centered on ancestor worship, divination, and a powerful king who served as intermediary between the human and spirit worlds.', color: DYNASTY_GOLD },
  { date: '1046–256 BCE', title: 'Zhou Dynasty', detail: 'The longest dynasty in Chinese history, spanning nearly 800 years. The Zhou introduced the "Mandate of Heaven" — the idea that rulers govern by divine approval, which can be withdrawn from unjust kings. The later Zhou period (the "Spring and Autumn" and "Warring States" eras) was politically chaotic but intellectually explosive: Confucius, Laozi, Mencius, Sun Tzu, and dozens of other philosophers flourished in the "Hundred Schools of Thought." Iron tools transformed agriculture, and feudalism shaped society.', color: JADE_GREEN },
  { date: '221–206 BCE', title: 'Qin Dynasty', detail: 'Though lasting only 15 years, the Qin dynasty transformed China forever. Qin Shi Huang conquered all seven warring states and created the first unified Chinese empire. He standardized writing, currency, weights, measurements, and even axle widths. He began construction of the Great Wall and built the astonishing Terracotta Army. His adoption of Legalism as state philosophy was ruthlessly effective but brutally repressive — including the infamous burning of books and burying of scholars alive.', color: IMPERIAL_RED },
  { date: '206 BCE – 220 CE', title: 'Han Dynasty', detail: 'China\'s Golden Age. The Han dynasty consolidated Qin\'s unification with more humane governance, adopting Confucianism as state philosophy. The Silk Road opened, connecting China to Rome. Paper was invented (105 CE by Cai Lun). The civil service examination system was established — selecting officials by merit rather than birth. Buddhism arrived from India. Chinese identity became so associated with this dynasty that ethnic Chinese still call themselves "Han people" (hanren) today.', color: SCHOLAR_BLUE },
  { date: '220–589 CE', title: 'Three Kingdoms / Jin / Southern & Northern', detail: 'After the Han collapsed, China fractured into rival kingdoms for over three centuries. The Three Kingdoms period (Wei, Shu, Wu) produced some of China\'s most celebrated heroes and stories, immortalized in the Romance of the Three Kingdoms. Despite the political chaos, Buddhism flourished, the arts advanced, and the period produced iconic figures like Zhuge Liang (the "Sleeping Dragon" strategist) and Cao Cao.', color: SILK_PURPLE },
  { date: '589–907 CE', title: 'Sui and Tang Dynasties', detail: 'The Sui reunified China and built the Grand Canal — at 1,776 km, the longest artificial waterway in the world, connecting north and south China. The succeeding Tang dynasty (618–907) is considered China\'s cultural zenith: a cosmopolitan empire that welcomed traders, monks, and diplomats from across Eurasia. Tang poetry reached unmatched heights (Li Bai, Du Fu), Chang\'an became the world\'s largest city (1 million people), and Chinese influence spread across Korea, Japan, and Vietnam.', color: DYNASTY_GOLD },
];

const QIN_SHI_HUANG = {
  overview: 'Qin Shi Huang (259–210 BCE) — born Ying Zheng — is one of the most consequential and controversial rulers in all of human history. In just 15 years, he conquered all seven warring states and forged them into a single unified empire, creating the entity we now call "China." His reforms were so sweeping that they defined Chinese civilization for the next 2,000 years. Yet his methods were so ruthless that he has been both revered as the father of China and condemned as one of history\'s greatest tyrants.',
  unification: {
    title: 'Unification of the Seven Warring States (230–221 BCE)',
    detail: 'For over 250 years, seven major states (Qi, Chu, Yan, Han, Zhao, Wei, Qin) had fought endlessly for supremacy. The state of Qin, located in the west, had adopted Legalist reforms that created the most efficient military machine in China. Starting in 230 BCE, the young King Zheng launched a systematic campaign of conquest. In just nine years, he defeated all six rival states, often through a combination of military force, espionage, bribery, and diplomacy. By 221 BCE, for the first time in history, all of China was united under a single ruler. He declared himself "Shi Huang" — First Emperor — a title no one had ever used before.',
  },
  standardizations: [
    { title: 'Writing System', detail: 'China\'s warring states had developed divergent writing systems that made communication across regions nearly impossible. Qin Shi Huang imposed a single standardized script (Small Seal Script), ensuring that a merchant in the south could read an edict from the north. This unified writing system — evolved but unbroken — remains the foundation of Chinese characters today, 2,200 years later. It is arguably the most consequential standardization in human history.', icon: '📝', color: DYNASTY_GOLD },
    { title: 'Currency', detail: 'The chaotic variety of currencies — knife coins, spade coins, cowrie shells, gold ingots — was replaced by a single round copper coin with a square hole in the center (the ban liang). This iconic design would remain the basic form of Chinese currency for over 2,000 years, until the early 20th century.', icon: '🪙', color: BRONZE_ORANGE },
    { title: 'Weights and Measures', detail: 'Standardized units of weight, length, and volume were imposed across the empire. Every merchant, tax collector, and builder used the same measurements. Bronze standard weights were distributed to every province. This eliminated the chaos of regional systems and made trade, taxation, and construction projects consistent across the empire.', icon: '⚖️', color: JADE_GREEN },
    { title: 'Axle Widths and Roads', detail: 'Perhaps the most surprisingly practical reform: all cart axles were standardized to the same width. Since cart wheels cut ruts into unpaved roads, varying axle widths made roads impassable for carts of different sizes. Uniform axle widths meant a single road network could serve the entire empire — an ancient version of standardized railway gauges. A massive road system radiating from the capital connected the empire.', icon: '🛞', color: WALL_GREY },
  ],
  greatWall: {
    title: 'The First Great Wall — 700,000 Workers',
    detail: 'Qin Shi Huang ordered the connection and extension of existing defensive walls along China\'s northern frontier into a continuous barrier against nomadic raids. An estimated 700,000 laborers — many of them convicts and conscripted peasants — were forced to work on the project under brutal conditions. Thousands died from exhaustion, disease, and the harsh climate. The wall stretched over 5,000 km across mountains, deserts, and grasslands. While much of the Qin wall has crumbled, it established the concept and route that later dynasties would rebuild and extend into the Great Wall we know today.',
  },
  terracotta: {
    title: 'The Terracotta Army — 8,000 Soldiers for the Afterlife',
    detail: 'Discovered accidentally in 1974 by farmers digging a well near Xi\'an, the Terracotta Army is one of the most extraordinary archaeological finds in history. Over 8,000 life-sized clay soldiers, 670 horses, and 130 chariots stand in battle formation in underground pits surrounding Qin Shi Huang\'s massive tomb complex. Each soldier has a unique face — individualized hairstyles, expressions, and features suggesting they were modeled on real soldiers. They carry real bronze weapons (swords, crossbows, spears) that were still sharp after 2,200 years thanks to a chrome-plating technique not reinvented in the West until the 20th century. The army was intended to protect the Emperor in the afterlife — a testament to his obsession with power beyond death.',
  },
  legalism: {
    title: 'Legalism vs Confucianism — The Governing Philosophy Debate',
    detail: 'Qin Shi Huang adopted Legalism as his governing philosophy — a system developed by thinkers like Han Feizi and Li Si that held humans are inherently selfish and can only be controlled through strict laws, harsh punishments, and absolute authority. Legalism was ruthlessly effective: it created the most efficient state and military in China. But it was also brutally repressive. In 213 BCE, the Emperor ordered the burning of most books (especially Confucian and historical texts) and reportedly buried 460 Confucian scholars alive for criticizing his rule. This "Burning of Books and Burying of Scholars" became one of the most infamous acts of intellectual repression in history. After the Qin fell, the Han dynasty rejected Legalism in favor of Confucianism — but preserved most of Qin\'s administrative structures.',
  },
  death: {
    title: 'Death — The Obsession with Immortality',
    detail: 'Qin Shi Huang was obsessed with achieving immortality. He sent expeditions across the sea to find the legendary "Islands of the Immortals" and consumed mercury-laced "elixirs of life" prepared by court alchemists — which almost certainly hastened his death at age 49 (210 BCE). The supreme irony: the man who sought eternal life likely died of mercury poisoning from the very potions meant to make him immortal. His tomb, according to ancient historian Sima Qian, contained rivers of flowing mercury (soil tests around the tomb have confirmed abnormally high mercury levels), a ceiling set with pearls to represent the stars, and crossbow traps to deter grave robbers. The main burial chamber remains unopened to this day.',
  },
};

const FOUR_INVENTIONS = [
  { title: 'Paper (105 CE)', detail: 'Cai Lun, a Han dynasty court official, perfected the process of making paper from tree bark, hemp, old rags, and fishnets. Before paper, writing surfaces were bamboo strips (heavy and bulky), silk (expensive), or animal skins. Paper was cheap, light, and easy to produce in quantity. It spread to the Islamic world via the Battle of Talas (751 CE) when Arab forces captured Chinese papermakers, and reached Europe by the 12th century. Paper made books affordable, bureaucracy efficient, and the spread of knowledge possible on a mass scale. Without Chinese paper, there is no European Renaissance, no Reformation, no Scientific Revolution as we know them.', icon: '📜', color: PAPER_CREAM },
  { title: 'Printing (Block: 600s CE / Moveable Type: 1040 CE)', detail: 'Chinese artisans developed woodblock printing by the 7th century — carving entire pages in reverse on wooden blocks, inking them, and pressing paper onto the surface. The Diamond Sutra (868 CE), found in the Dunhuang caves, is the oldest dated printed book in the world. In 1040 CE, Bi Sheng invented moveable type using individual ceramic characters that could be rearranged and reused. Though Chinese characters (thousands of them) made moveable type less practical than in alphabetic languages, the concept was revolutionary. Gutenberg\'s famous press (1440s) followed the same principle — but Chinese printing preceded it by 400 years.', icon: '🖨️', color: SCHOLAR_BLUE },
  { title: 'Gunpowder (c. 850 CE)', detail: 'Chinese alchemists searching for an elixir of immortality accidentally discovered gunpowder (a mixture of saltpeter, sulfur, and charcoal) around 850 CE. The earliest recorded formula appears in a Tang dynasty text warning alchemists not to mix these ingredients (because it had already caused fires and explosions). By the 10th century, China had developed fire arrows, fire lances (proto-guns), bombs, and rockets for military use. Gunpowder reached the Islamic world by the 13th century and Europe by the 14th — where it would transform warfare, end the age of castles and knights, and ultimately enable European colonial expansion.', icon: '💥', color: IMPERIAL_RED },
  { title: 'Compass (c. 1088 CE)', detail: 'The Chinese discovered that magnetized iron (lodestone) points north-south as early as the 4th century BCE, initially using it for feng shui and divination. By the Song dynasty (1088 CE), the magnetic compass was being used for maritime navigation — fundamentally changing seafaring. Chinese ships with compasses sailed to Southeast Asia, India, and East Africa. The compass reached Europe by the 12th century, enabling the Age of Exploration. Without the Chinese compass, Columbus doesn\'t cross the Atlantic, Magellan doesn\'t circumnavigate the globe, and the modern interconnected world doesn\'t exist.', icon: '🧭', color: JADE_GREEN },
];

const CONFUCIUS_DATA = {
  overview: 'Confucius (Kong Qiu, 551–479 BCE) was a teacher, philosopher, and political thinker whose ideas shaped Chinese civilization more profoundly than any other individual. Born in the state of Lu during the chaotic Spring and Autumn period, he spent his life teaching, advising rulers (mostly unsuccessfully), and developing a comprehensive ethical system based on virtue, propriety, and social harmony. His students compiled his teachings in the Analerta (Lunyu) after his death. For the next 2,500 years — until the 20th century — Confucianism was the dominant philosophy of Chinese governance, education, and family life.',
  analects: 'The Analects is a collection of sayings and dialogues attributed to Confucius, compiled by his disciples after his death. It covers topics from personal ethics to political governance, always returning to the central question: how should a person live? Key ideas include ren (benevolence/humaneness — the highest virtue), li (ritual propriety — correct behavior in all social situations), xiao (filial piety — devotion to parents and ancestors), and junzi (the "gentleman" or "exemplary person" who cultivates virtue). The Analects became the most influential text in East Asian history.',
  fiveRelationships: [
    { title: 'Ruler and Subject', detail: 'The ruler governs with benevolence and virtue; the subject serves with loyalty and obedience. A ruler who is unjust loses the right to govern (echoing the Zhou "Mandate of Heaven"). Confucius believed good governance comes not from laws and punishments but from the moral example of the ruler.', icon: '👑', color: IMPERIAL_RED },
    { title: 'Father and Son', detail: 'The father provides, educates, and guides with kindness; the son obeys, respects, and cares for aging parents (filial piety). This was the foundational social relationship in Confucian thought — a good society begins with good families.', icon: '👨‍👦', color: DYNASTY_GOLD },
    { title: 'Husband and Wife', detail: 'The husband leads and protects; the wife supports and manages the household. While hierarchical by modern standards, Confucius emphasized mutual respect and complementary roles rather than domination.', icon: '💑', color: SILK_PURPLE },
    { title: 'Elder Brother and Younger Brother', detail: 'The elder brother guides and protects; the younger brother respects and follows. This extended to all age-based relationships — respect for elders became a cornerstone of East Asian culture.', icon: '👥', color: JADE_GREEN },
    { title: 'Friend and Friend', detail: 'The only relationship of equals. Friends help each other grow in virtue and hold each other accountable. Confucius valued friendship highly — "Have no friends not equal to yourself" — meaning seek friends who challenge you to be better.', icon: '🤝', color: SCHOLAR_BLUE },
  ],
  impact: 'Confucianism\'s impact on Chinese civilization is almost impossible to overstate. It shaped the civil service examination system (which selected officials based on knowledge of Confucian texts), the family structure (patriarchal, filial, ancestor-venerating), the education system (memorization and moral cultivation), diplomatic relations (hierarchy-based), and even eating habits (Confucius had opinions about food preparation). It spread to Korea, Japan, and Vietnam, profoundly influencing their cultures as well. Today, 1.4 billion Chinese people live in a society still deeply marked by Confucian values — respect for education, family loyalty, social harmony, and deference to authority.',
};

const DAOISM_DATA = {
  overview: 'Daoism (Taoism) emerged as both a philosophy and later a religion, traditionally attributed to Laozi (literally "Old Master"), a semi-legendary figure said to have been a contemporary of Confucius in the 6th century BCE. Where Confucianism focused on social order, hierarchy, and moral cultivation through active engagement with society, Daoism offered a radical alternative: alignment with the natural way of the universe (the Dao), simplicity, spontaneity, and the paradoxical power of non-action.',
  taoTeChing: 'The Tao Te Ching (Daodejing), attributed to Laozi, is one of the most translated books in human history — second only to the Bible. In just 5,000 characters (81 brief chapters), it presents a philosophy of profound depth through paradox, poetry, and metaphor. "The Dao that can be told is not the eternal Dao." "The softest thing in the universe overcomes the hardest." "When you are content to be simply yourself and don\'t compare or compete, everyone will respect you." Its influence extends far beyond China — it has inspired Western philosophers, artists, environmentalists, and spiritual seekers for centuries.',
  wuWei: {
    title: 'Wu Wei — The Art of Non-Action',
    detail: 'Wu wei does not mean doing nothing — it means acting in perfect alignment with the natural flow of things, without forcing, straining, or imposing your will. Like water flowing around obstacles rather than crashing through them. Like a skilled craftsman whose hands move without conscious effort because the skill is so deeply internalized. Wu wei is effortless action, spontaneous rightness. A Daoist ruler governs so naturally that the people barely know he exists. A Daoist sage lives so simply that nothing is lacking. It is the philosophical opposite of Legalism\'s rigid control and a counterbalance to Confucianism\'s structured propriety.',
  },
  contrast: 'Confucianism and Daoism represent the two great poles of Chinese thought — and most Chinese people have historically drawn from both. Confucianism governs public life: duty, hierarchy, education, governance, family obligations. Daoism governs inner life: spontaneity, nature, meditation, health, freedom from convention. A Chinese official might be a Confucian at court and a Daoist in retirement. The two philosophies are not contradictory but complementary — like yin and yang (itself a Daoist concept). Together with Buddhism (which arrived from India during the Han dynasty), they form the "Three Teachings" that have shaped Chinese spiritual life for two millennia.',
};

const SILK_ROAD = {
  overview: 'The Silk Road was not a single road but a vast network of trade routes stretching over 6,400 km from Chang\'an (modern Xi\'an) in China to the Mediterranean. Opened during the Han dynasty (around 130 BCE) when Emperor Wu sent the envoy Zhang Qian westward to seek allies against the Xiongnu nomads, the Silk Road became the most important commercial network in the ancient world — connecting Chinese, Indian, Persian, Arab, Greek, and Roman civilizations for over 1,500 years.',
  exports: [
    { title: 'Silk', detail: 'China\'s most famous export. The Chinese guarded the secret of silk production (sericulture) for centuries — legend says anyone caught smuggling silkworm eggs out of China faced execution. Roman aristocrats were so addicted to Chinese silk that the Senate repeatedly tried to ban it to prevent gold from flowing eastward. Silk was so valuable it served as currency along the trade routes.', icon: '🧵', color: SILK_PURPLE },
    { title: 'Porcelain', detail: 'Chinese porcelain ("china") was so technically advanced that no other civilization could replicate it for centuries. Fired at temperatures exceeding 1,300°C, it was translucent, resonant, and beautiful. European potters spent centuries trying to crack the secret — Meissen in Germany didn\'t succeed until 1708.', icon: '🏺', color: SCHOLAR_BLUE },
    { title: 'Paper', detail: 'Paper technology spread westward along the Silk Road after the Battle of Talas (751 CE), when captured Chinese papermakers taught the technique to their Arab captors. Within a century, paper mills operated in Baghdad, Damascus, and Cairo — and eventually throughout Europe.', icon: '📄', color: PAPER_CREAM },
    { title: 'Tea', detail: 'Tea cultivation began in China\'s Yunnan province and spread along the Silk Road and maritime routes. It became the world\'s most consumed beverage after water. The tea trade would later have enormous geopolitical consequences — the British East India Company\'s tea trade with China, the Opium Wars, and the American Revolution (Boston Tea Party) all trace back to Chinese tea.', icon: '🍵', color: JADE_GREEN },
    { title: 'Gunpowder', detail: 'Perhaps the most world-changing export. Gunpowder technology traveled westward along the Silk Road, reaching the Islamic world by the 13th century and Europe by the 14th. It would transform warfare, end feudalism, and enable European colonial expansion — consequences the Chinese alchemists who discovered it could never have imagined.', icon: '💣', color: IMPERIAL_RED },
  ],
};

const SCIENCE_TECH = [
  { title: 'Seismograph (132 CE)', detail: 'Zhang Heng, a Han dynasty polymath, invented the world\'s first seismoscope — a bronze vessel with eight dragon heads, each holding a bronze ball. When an earthquake occurred, the mechanism inside would cause the ball facing the earthquake\'s direction to drop into a waiting toad\'s mouth below. It reportedly detected an earthquake 500 km away that no one in the capital had felt — and messengers arriving days later confirmed it. No Western equivalent existed for another 1,700 years.', icon: '🐉', color: DYNASTY_GOLD },
  { title: 'Cast Iron (c. 500 BCE)', detail: 'China mastered cast iron smelting (achieving temperatures above 1,130°C) by the 5th century BCE — roughly 1,800 years before Europe. This allowed mass production of iron tools, weapons, and agricultural implements. The Chinese blast furnace produced liquid iron that could be poured into molds, enabling standardized production at scale. This technological advantage was fundamental to China\'s agricultural productivity and military power.', icon: '⚒️', color: WALL_GREY },
  { title: 'Wheelbarrow (c. 200 CE)', detail: 'Invented during the Han dynasty (and possibly used as a military supply vehicle by Zhuge Liang during the Three Kingdoms period), the Chinese wheelbarrow had its wheel centered under the load rather than at the front — allowing a single person to carry far heavier loads. It didn\'t reach Europe until the 12th or 13th century.', icon: '🛒', color: BRONZE_ORANGE },
  { title: 'Mechanical Clock (725 CE)', detail: 'Yi Xing and Liang Lingzan built the first known mechanical clock — an astronomical instrument driven by a water wheel with an escapement mechanism that regulated its motion. Later, Su Song built an elaborate 12-meter-tall astronomical clock tower (1088 CE) with an armillary sphere, celestial globe, and rotating figures that announced the hours. Mechanical clockwork wouldn\'t appear in Europe until the 13th century.', icon: '⏰', color: SCHOLAR_BLUE },
  { title: 'Paper Money (7th–10th century CE)', detail: 'China invented paper money during the Tang dynasty (as "flying cash" — merchant certificates) and formalized it during the Song dynasty. The concept was revolutionary: instead of carrying heavy metal coins, merchants could use lightweight paper notes backed by the government. Marco Polo was astonished by it in the 13th century. Paper currency wouldn\'t appear in Europe until the 17th century — over 700 years later.', icon: '💴', color: JADE_GREEN },
  { title: 'Crossbow (c. 600 BCE)', detail: 'China developed the crossbow with a sophisticated bronze trigger mechanism centuries before it appeared in Europe. Mass-produced crossbows gave Chinese armies a devastating advantage — they could be used by conscript soldiers with minimal training, unlike the longbow which required years of practice. Qin dynasty crossbow trigger mechanisms were standardized and interchangeable — an early example of mass production with interchangeable parts.', icon: '🏹', color: IMPERIAL_RED },
];

const GREAT_WALL = {
  overview: 'The Great Wall of China is not a single wall but a series of walls, fortifications, watchtowers, and natural barriers built by multiple dynasties over more than 2,000 years. Its total length — including all branches, secondary sections, and associated fortifications — is approximately 21,196 km (13,171 miles), according to a comprehensive 2012 survey by China\'s State Administration of Cultural Heritage.',
  why: {
    title: 'Why It Was Built',
    detail: 'The primary threat was the nomadic peoples of the northern steppe — particularly the Xiongnu, Turks, and later the Mongols. These highly mobile horseback warriors could strike quickly, raid settlements, seize livestock and captives, and retreat before Chinese infantry could respond. Walls served as barriers to slow raiders, as elevated platforms for signal fires (which could relay warnings across hundreds of kilometers in hours), and as bases for garrison troops. The wall also controlled trade and immigration, serving as a customs border.',
  },
  dynasties: [
    { title: 'Qin Dynasty (221–206 BCE)', detail: 'Qin Shi Huang connected and extended existing walls into the first continuous northern barrier. An estimated 700,000 workers were conscripted. The Qin wall was primarily rammed earth — most of it has since eroded away.', icon: '🧱', color: IMPERIAL_RED },
    { title: 'Han Dynasty (206 BCE – 220 CE)', detail: 'Extended the wall westward into the Gobi Desert to protect Silk Road trade routes, reaching its greatest length under any single dynasty. Han wall sections stretched to Dunhuang and beyond — over 10,000 km total. Watchtowers served as signal stations and trade checkpoints.', icon: '🏯', color: SCHOLAR_BLUE },
    { title: 'Ming Dynasty (1368–1644 CE)', detail: 'Built the iconic stone-and-brick wall that tourists visit today. After the humiliation of Mongol rule (Yuan dynasty), the Ming invested massive resources in wall construction. The most famous sections (Badaling, Mutianyu, Jinshanling) date from this period — featuring crenellated parapets, guard towers every few hundred meters, and sophisticated drainage systems.', icon: '🏰', color: DYNASTY_GOLD },
  ],
  effectiveness: 'Was the Great Wall effective? The debate continues. It never completely stopped determined invaders — the Mongols under Genghis Khan bypassed or breached it, and the Manchus entered through a gate opened by a treasonous general (1644). But this misses the point. The wall was never meant to be an impenetrable barrier — it was a system of border control, early warning, and force multiplication. It slowed raiders, gave defenders time to mobilize, channeled invaders into kill zones, and protected trade routes. For most of its history, it served these purposes effectively. Its greatest failure was also its greatest testament: it took the most formidable military force in human history (the Mongols) to overcome it.',
};

const CIVIL_SERVICE = {
  overview: 'The Chinese civil service examination system — selecting government officials through standardized tests rather than aristocratic birth — was one of the most revolutionary innovations in the history of governance. First established in rudimentary form during the Han dynasty (206 BCE – 220 CE) and fully formalized during the Sui (605 CE) and Tang dynasties, it created the world\'s first meritocratic bureaucracy.',
  how: {
    title: 'How It Worked',
    detail: 'Candidates studied for years — sometimes decades — memorizing the Confucian classics, mastering literary composition, and learning to write the rigid "eight-legged essay" format. Exams were held at three levels: local (xiucai), provincial (juren), and national (jinshi). The national exam, held in the capital, was the most prestigious — passing it guaranteed high office. Candidates were locked in individual cells for days, writing essays on assigned topics. Papers were copied by clerks to prevent handwriting identification, and graded by multiple anonymous examiners. The system was remarkably meritocratic for its time — a peasant\'s son who passed the exam outranked a nobleman who didn\'t.',
  },
  impact: 'The examination system\'s impact was profound and far-reaching. It created a educated governing class selected by ability rather than heredity — preventing China from developing the hereditary aristocratic governance that dominated Europe until the modern era. It made education the primary path to social advancement, creating a culture that valued learning above almost everything else. It ensured administrative continuity across dynasties — emperors came and went, but the bureaucracy endured. The system lasted from 605 CE until 1905 — exactly 1,300 years. It influenced the development of modern civil service systems worldwide: the British civil service (established 1855) was explicitly modeled on the Chinese examination system, and through Britain\'s example, it influenced civil service reforms in the United States, France, and other nations.',
};

const KEY_FIGURES: Figure[] = [
  { name: 'Qin Shi Huang', dates: '259–210 BCE', role: 'First Emperor of unified China', contribution: 'Unified China, standardized writing/currency/measures, began Great Wall', detail: 'Conquered all seven warring states in 15 years, creating the first unified Chinese empire. His reforms — standardized script, currency, weights, and road widths — created the infrastructure of a unified civilization. His Terracotta Army and unexcavated tomb remain among the world\'s greatest archaeological mysteries. Brilliant, ruthless, and obsessed with immortality, he died at 49 from the mercury elixirs meant to make him live forever.', icon: '👑', color: IMPERIAL_RED },
  { name: 'Confucius (Kong Qiu)', dates: '551–479 BCE', role: 'Philosopher, teacher, political thinker', contribution: 'Founded Confucianism — shaped Chinese civilization for 2,500 years', detail: 'A traveling teacher who believed good governance came from virtuous rulers and educated citizens, not harsh laws. His Analects became the most influential text in East Asian history. Confucianism\'s emphasis on education, family loyalty, social harmony, and meritocratic governance shaped China, Korea, Japan, and Vietnam for millennia. More than any emperor, Confucius determined how Chinese civilization would think, govern, and organize itself.', icon: '📚', color: DYNASTY_GOLD },
  { name: 'Laozi', dates: 'c. 6th century BCE', role: 'Legendary founder of Daoism', contribution: 'Tao Te Ching — one of the most translated books in human history', detail: 'A semi-legendary figure said to have been an older contemporary of Confucius. The Tao Te Ching, attributed to him, offers a philosophy of spontaneity, simplicity, and alignment with nature\'s way. Where Confucius emphasized social duty, Laozi emphasized inner freedom. Together, they created the two poles of Chinese philosophical thought that have endured for 2,500 years.', icon: '☯️', color: JADE_GREEN },
  { name: 'Emperor Wu of Han', dates: '156–87 BCE', role: 'Greatest Han dynasty emperor', contribution: 'Opened Silk Road, adopted Confucianism as state philosophy, expanded empire', detail: 'Ruled for 54 years — the longest reign in Han history. He sent Zhang Qian westward to find allies, inadvertently opening the Silk Road. He made Confucianism the official state ideology (displacing Legalism), established the Imperial Academy to train officials in the classics, and expanded Chinese territory into Central Asia, Korea, and Vietnam. Under his rule, the Han dynasty reached its greatest extent and influence.', icon: '🗡️', color: SCHOLAR_BLUE },
  { name: 'Cai Lun', dates: 'c. 50–121 CE', role: 'Inventor and court official', contribution: 'Perfected papermaking — one of the Four Great Inventions', detail: 'A Han dynasty eunuch and court official who, in 105 CE, perfected the process of making paper from tree bark, hemp, old rags, and fishnets. While paper-like materials existed before him, Cai Lun\'s method produced affordable, high-quality paper suitable for writing. His invention spread across the world and made the mass dissemination of knowledge possible. Some historians rank his invention as the single most important in human history.', icon: '📜', color: PAPER_CREAM },
  { name: 'Zhuge Liang', dates: '181–234 CE', role: 'Chancellor of Shu Han, legendary strategist', contribution: 'The "Sleeping Dragon" — China\'s most celebrated military genius', detail: 'Prime minister and chief strategist of the Shu Han kingdom during the Three Kingdoms period. His exploits — many embellished by the Romance of the Three Kingdoms — made him the archetype of the brilliant strategist in Chinese culture. He is credited with inventing the wheelbarrow, improving the crossbow, and developing the "Eight Trigrams Formation." His devotion to his lord Liu Bei and his tireless service until death ("giving one\'s all until death") became the ideal of loyal service in Chinese culture.', icon: '🐉', color: SILK_PURPLE },
  { name: 'Ban Zhao', dates: 'c. 45–116 CE', role: 'Historian, scholar, first known female Chinese historian', contribution: 'Completed the Book of Han, pioneered female scholarship', detail: 'Completed the monumental Book of Han (Hanshu) after her father Ban Biao and brother Ban Gu both died before finishing it. She became the first known female historian in Chinese history and one of the most learned scholars of her era. She also served as tutor to the Empress and ladies of the court. Her Lessons for Women (Nujie), while reinforcing traditional gender roles, demonstrated that women could achieve the highest levels of scholarly accomplishment in Han dynasty China.', icon: '✍️', color: BRONZE_ORANGE },
];

const LEGACY = [
  { title: 'Continuous Civilization', detail: 'China is the only civilization that has maintained continuous cultural identity for over 4,000 years. The writing system, while evolved, is recognizably descended from Shang dynasty oracle bones. A literate Chinese person today can read texts from 2,000 years ago — something no European, Middle Eastern, or Indian civilization can claim with comparable directness. This continuity is unparalleled in human history.', icon: '🏛️', color: DYNASTY_GOLD },
  { title: 'The Four Inventions That Built the Modern World', detail: 'Paper made mass literacy possible. Printing made mass knowledge dissemination possible. Gunpowder transformed warfare and ended feudalism. The compass enabled global navigation and exploration. These four Chinese inventions are not incidental contributions — they are foundational technologies without which the modern world literally could not exist. Francis Bacon wrote in 1620 that these three inventions (paper, gunpowder, compass) "have changed the whole face and state of things throughout the world."', icon: '💡', color: IMPERIAL_RED },
  { title: 'Confucian Values Across East Asia', detail: 'Confucianism didn\'t just shape China — it shaped Korea, Japan, Vietnam, and Singapore. The emphasis on education, family loyalty, respect for authority, and social harmony that characterizes East Asian cultures traces directly to Confucius. The extraordinary educational achievement of East Asian nations today — consistently topping international rankings — reflects a 2,500-year-old Confucian value system that treats learning as the highest human activity.', icon: '📖', color: JADE_GREEN },
  { title: 'The Chinese Script', detail: 'Chinese characters — used by 1.4 billion people — represent the oldest continuously used writing system in the world. Unlike alphabetic scripts, each character is a unit of meaning rather than sound, allowing speakers of mutually unintelligible Chinese dialects to read the same texts. This shared written language was crucial to Chinese political unity across vast distances and diverse populations.', icon: '漢', color: SCHOLAR_BLUE },
  { title: 'Meritocratic Governance', detail: 'The idea that government officials should be selected by examination rather than birth — pioneered by China\'s civil service system — is now the global standard. Every modern civil service, from Britain\'s to India\'s to America\'s, traces its intellectual lineage to the Chinese examination system. The concept that talent and education, not bloodline, should determine who governs was revolutionary — and it was Chinese.', icon: '🎓', color: SILK_PURPLE },
  { title: '1.4 Billion People', detail: 'One in five humans alive today is Chinese. The civilization that began along the Yellow River five thousand years ago is now the world\'s second-largest economy, a spacefaring nation, and a global superpower. The values, technologies, and administrative systems developed in ancient China — from characters to Confucianism to centralized governance — continue to shape the lives of more people than any other ancient civilization\'s legacy.', icon: '🌏', color: BRONZE_ORANGE },
];

/* ───────── Tab config ───────── */
const TABS: { key: SectionTab; label: string; icon: string }[] = [
  { key: 'timeline', label: 'Dynasty Timeline', icon: '📜' },
  { key: 'qinshihuang', label: 'Qin Shi Huang', icon: '👑' },
  { key: 'inventions', label: 'Four Inventions', icon: '💡' },
  { key: 'confucius', label: 'Confucius', icon: '📚' },
  { key: 'daoism', label: 'Laozi & Daoism', icon: '☯️' },
  { key: 'silkroad', label: 'Silk Road', icon: '🐫' },
  { key: 'science', label: 'Science & Tech', icon: '🔬' },
  { key: 'greatwall', label: 'Great Wall', icon: '🏯' },
  { key: 'civilservice', label: 'Civil Service', icon: '🎓' },
  { key: 'figures', label: 'Key Figures', icon: '👤' },
  { key: 'legacy', label: 'Legacy', icon: '🌏' },
];

/* ───────── Helpers ───────── */
function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
      <span style={{ fontSize: 26 }}>{icon}</span>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT, margin: 0 }}>{title}</h2>
    </div>
  );
}

/* ───────── Component ───────── */
export default function AncientChinaPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('timeline');
  const [expandedFigure, setExpandedFigure] = useState<string | null>(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, color: TEXT, fontFamily: "'Inter', sans-serif" }}>
      {/* ─── Hero ─── */}
      <div style={{ padding: '56px 32px 40px', textAlign: 'center', borderBottom: `1px solid ${CARD_BORDER}`, background: `linear-gradient(180deg, rgba(196,30,58,0.08) 0%, transparent 100%)` }}>
        <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', display: 'inline-block', marginBottom: 24, padding: '6px 14px', borderRadius: 6, border: `1px solid ${CARD_BORDER}`, backgroundColor: CARD_BG }}>← Back to Timeline</Link>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT, margin: '0 0 10px', lineHeight: 1.25 }}>Ancient China</h1>
        <p style={{ fontSize: 15, color: ACCENT, fontWeight: 600, margin: '0 0 20px' }}>Five Thousand Years of Continuous Civilization (2100 BCE – 618 CE)</p>
        <p style={{ fontSize: 13, color: TEXT_MUTED, maxWidth: 740, margin: '0 auto', lineHeight: 1.7 }}>{CONTEXT_TEXT}</p>
      </div>

      {/* ─── Tab Bar ─── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '16px 24px', borderBottom: `1px solid ${CARD_BORDER}`, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '8px 14px', border: `1px solid ${activeTab === t.key ? ACCENT : CARD_BORDER}`,
              borderRadius: 8, backgroundColor: activeTab === t.key ? `${ACCENT}18` : 'transparent',
              color: activeTab === t.key ? ACCENT : TEXT_DIM, cursor: 'pointer', fontSize: 12,
              fontWeight: activeTab === t.key ? 700 : 500, display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.15s ease',
            }}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ─── Content ─── */}
      <div style={{ maxWidth: 820, margin: '0 auto' }}>

        {/* ─── Timeline ─── */}
        {activeTab === 'timeline' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="📜" title="Dynasty Timeline — From Myth to Empire" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>The rise and fall of dynasties — each building on the last, each leaving indelible marks on Chinese civilization.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {TIMELINE_EVENTS.map((ev, i) => (
                <motion.div key={ev.title} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.09, duration: 0.4 }} style={{ display: 'flex', gap: 20, padding: '22px 0', borderBottom: i < TIMELINE_EVENTS.length - 1 ? `1px solid ${CARD_BORDER}` : 'none' }}>
                  <div style={{ minWidth: 100, textAlign: 'right' }}>
                    <span style={{ fontSize: 12, fontFamily: 'monospace', color: ev.color, fontWeight: 700 }}>{ev.date}</span>
                  </div>
                  <div style={{ width: 3, backgroundColor: ev.color, borderRadius: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: ev.color, marginBottom: 6 }}>{ev.title}</div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{ev.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Qin Shi Huang ─── */}
        {activeTab === 'qinshihuang' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="👑" title="Qin Shi Huang — The First Emperor" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>{QIN_SHI_HUANG.overview}</p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: IMPERIAL_RED, margin: '24px 0 14px' }}>{QIN_SHI_HUANG.unification.title}</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${IMPERIAL_RED}33`, backgroundColor: `${IMPERIAL_RED}08`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{QIN_SHI_HUANG.unification.detail}</div>
            </motion.div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: DYNASTY_GOLD, margin: '24px 0 14px' }}>The Great Standardizations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {QIN_SHI_HUANG.standardizations.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: WALL_GREY, margin: '24px 0 14px' }}>{QIN_SHI_HUANG.greatWall.title}</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${WALL_GREY}33`, backgroundColor: `${WALL_GREY}08`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{QIN_SHI_HUANG.greatWall.detail}</div>
            </motion.div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: BRONZE_ORANGE, margin: '24px 0 14px' }}>{QIN_SHI_HUANG.terracotta.title}</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${BRONZE_ORANGE}33`, backgroundColor: `${BRONZE_ORANGE}08`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{QIN_SHI_HUANG.terracotta.detail}</div>
            </motion.div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: SILK_PURPLE, margin: '24px 0 14px' }}>{QIN_SHI_HUANG.legalism.title}</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${SILK_PURPLE}33`, backgroundColor: `${SILK_PURPLE}08`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{QIN_SHI_HUANG.legalism.detail}</div>
            </motion.div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: JADE_GREEN, margin: '24px 0 14px' }}>{QIN_SHI_HUANG.death.title}</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${JADE_GREEN}33`, backgroundColor: `${JADE_GREEN}08` }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{QIN_SHI_HUANG.death.detail}</div>
            </motion.div>
          </section>
        )}

        {/* ─── Four Great Inventions ─── */}
        {activeTab === 'inventions' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="💡" title="The Four Great Inventions — Technologies That Changed the World" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>Paper, printing, gunpowder, and the compass — four Chinese inventions that fundamentally transformed human civilization. Francis Bacon wrote that they "changed the whole face and state of things throughout the world."</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FOUR_INVENTIONS.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
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

        {/* ─── Confucius ─── */}
        {activeTab === 'confucius' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="📚" title="Confucius — The Teacher Who Shaped a Civilization" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>{CONFUCIUS_DATA.overview}</p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: DYNASTY_GOLD, margin: '24px 0 14px' }}>The Analects (Lunyu)</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${DYNASTY_GOLD}33`, backgroundColor: `${DYNASTY_GOLD}08`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{CONFUCIUS_DATA.analects}</div>
            </motion.div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: IMPERIAL_RED, margin: '24px 0 14px' }}>The Five Relationships</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {CONFUCIUS_DATA.fiveRelationships.map((rel, i) => (
                <motion.div key={rel.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${rel.color}33`, backgroundColor: `${rel.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{rel.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: rel.color }}>{rel.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{rel.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: JADE_GREEN, margin: '24px 0 14px' }}>2,500 Years of Impact</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${JADE_GREEN}33`, backgroundColor: `${JADE_GREEN}08` }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{CONFUCIUS_DATA.impact}</div>
            </motion.div>
          </section>
        )}

        {/* ─── Daoism ─── */}
        {activeTab === 'daoism' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="☯️" title="Laozi and Daoism — The Way of Nature" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>{DAOISM_DATA.overview}</p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: JADE_GREEN, margin: '24px 0 14px' }}>The Tao Te Ching</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${JADE_GREEN}33`, backgroundColor: `${JADE_GREEN}08`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{DAOISM_DATA.taoTeChing}</div>
            </motion.div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: SCHOLAR_BLUE, margin: '24px 0 14px' }}>{DAOISM_DATA.wuWei.title}</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${SCHOLAR_BLUE}33`, backgroundColor: `${SCHOLAR_BLUE}08`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{DAOISM_DATA.wuWei.detail}</div>
            </motion.div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: SILK_PURPLE, margin: '24px 0 14px' }}>Confucianism vs Daoism — The Two Poles of Chinese Thought</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${SILK_PURPLE}33`, backgroundColor: `${SILK_PURPLE}08` }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{DAOISM_DATA.contrast}</div>
            </motion.div>
          </section>
        )}

        {/* ─── Silk Road ─── */}
        {activeTab === 'silkroad' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🐫" title="The Silk Road — China's Gift to the Connected World" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>{SILK_ROAD.overview}</p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: DYNASTY_GOLD, margin: '24px 0 14px' }}>What China Exported</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {SILK_ROAD.exports.map((item, i) => (
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

        {/* ─── Science & Technology ─── */}
        {activeTab === 'science' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🔬" title="Chinese Science and Technology — Centuries Ahead" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>For most of recorded history, China was the world's most technologically advanced civilization. Many inventions that Europeans "discovered" had been in use in China for centuries — sometimes millennia — earlier.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {SCIENCE_TECH.map((item, i) => (
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

        {/* ─── Great Wall ─── */}
        {activeTab === 'greatwall' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🏯" title="The Great Wall — 21,000 Kilometers of History" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>{GREAT_WALL.overview}</p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: IMPERIAL_RED, margin: '24px 0 14px' }}>{GREAT_WALL.why.title}</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${IMPERIAL_RED}33`, backgroundColor: `${IMPERIAL_RED}08`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{GREAT_WALL.why.detail}</div>
            </motion.div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: DYNASTY_GOLD, margin: '24px 0 14px' }}>Dynasties That Built the Wall</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {GREAT_WALL.dynasties.map((d, i) => (
                <motion.div key={d.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${d.color}33`, backgroundColor: `${d.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{d.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: d.color }}>{d.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{d.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: WALL_GREY, margin: '24px 0 14px' }}>The Effectiveness Debate</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${WALL_GREY}33`, backgroundColor: `${WALL_GREY}08` }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{GREAT_WALL.effectiveness}</div>
            </motion.div>
          </section>
        )}

        {/* ─── Civil Service ─── */}
        {activeTab === 'civilservice' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🎓" title="The Civil Service Examination — Meritocracy Before the World Knew the Word" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>{CIVIL_SERVICE.overview}</p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: SCHOLAR_BLUE, margin: '24px 0 14px' }}>{CIVIL_SERVICE.how.title}</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${SCHOLAR_BLUE}33`, backgroundColor: `${SCHOLAR_BLUE}08`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{CIVIL_SERVICE.how.detail}</div>
            </motion.div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: DYNASTY_GOLD, margin: '24px 0 14px' }}>1,300 Years of Impact</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${DYNASTY_GOLD}33`, backgroundColor: `${DYNASTY_GOLD}08` }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{CIVIL_SERVICE.impact}</div>
            </motion.div>
          </section>
        )}

        {/* ─── Key Figures ─── */}
        {activeTab === 'figures' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="👤" title="Key Figures of Ancient China" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>The emperors, philosophers, inventors, and strategists who shaped five thousand years of civilization.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {KEY_FIGURES.map((fig, i) => (
                <motion.div key={fig.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ borderRadius: 12, border: `1px solid ${fig.color}33`, backgroundColor: `${fig.color}08`, overflow: 'hidden' }}>
                  <button onClick={() => setExpandedFigure(expandedFigure === fig.name ? null : fig.name)} style={{ width: '100%', padding: '16px 22px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
                    <span style={{ fontSize: 28 }}>{fig.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: fig.color }}>{fig.name}</div>
                      <div style={{ fontSize: 12, color: TEXT_DIM, fontFamily: 'monospace' }}>{fig.dates}</div>
                      <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{fig.role}</div>
                    </div>
                    <span style={{ fontSize: 13, color: TEXT_MUTED, transform: expandedFigure === fig.name ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                  </button>
                  <AnimatePresence>
                    {expandedFigure === fig.name && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '0 22px 18px', borderTop: `1px solid ${fig.color}22` }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: fig.color, margin: '14px 0 6px' }}>{fig.contribution}</div>
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

        {/* ─── Legacy ─── */}
        {activeTab === 'legacy' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🌏" title="Legacy — Five Thousand Years and Counting" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>How a civilization born along the Yellow River shaped the modern world — through inventions, philosophy, governance, and sheer continuity.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {LEGACY.map((item, i) => (
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
