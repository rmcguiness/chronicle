/**
 * ChineseDynastiesPage — comprehensive deep-dive on Chinese dynastic history (~2100 BCE–1912 CE).
 *
 * Route: /chinese-dynasties
 *
 * Sections:
 *  1. Hero — "The Middle Kingdom — 4,000 Years of Chinese Dynasties"
 *  2. Why China's History Matters — overview
 *  3. Legendary Origins & Xia Dynasty (~2100–1600 BCE)
 *  4. Shang Dynasty (1600–1046 BCE)
 *  5. Zhou Dynasty (1046–256 BCE)
 *  6. Qin Dynasty (221–206 BCE)
 *  7. Han Dynasty (206 BCE–220 CE)
 *  8. Period of Division (220–589 CE)
 *  9. Tang Dynasty (618–907 CE)
 * 10. Song Dynasty (960–1279 CE)
 * 11. Yuan Dynasty (1271–1368 CE)
 * 12. Ming Dynasty (1368–1644 CE)
 * 13. Qing Dynasty (1644–1912 CE)
 * 14. Legacy
 * 15. Key Figures
 * 16. Connection cards
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
const JADE = '#059669';
const DRAGON_GREEN = '#16a34a';
const BLUE = '#3b82f6';
const SKY_BLUE = '#38bdf8';
const INDIGO = '#6366f1';
const PURPLE = '#a855f7';
const TEAL = '#14b8a6';
const AMBER = '#d97706';
const TERRACOTTA = '#c2410c';
const BRONZE = '#b45309';
const STONE = '#78716c';
const ASH = '#94a3b8';
const SLATE = '#64748b';
const EARTH = '#92400e';
const SILK_WHITE = '#fef3c7';

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

interface ConnectionCard {
  title: string;
  description: string;
  path: string;
  color: string;
}

interface StatEntry {
  label: string;
  value: string;
  color: string;
}

// ── Hero Stats ──────────────────────────────────────────────────────────────

const HERO_STATS: StatEntry[] = [
  { label: 'Continuous Civilization', value: '4,000+ years', color: GOLD },
  { label: 'Great Wall Total Length', value: '13,170 miles', color: IMPERIAL_RED },
  { label: 'Terracotta Warriors', value: '8,000+', color: TERRACOTTA },
  { label: 'Han Dynasty Population', value: '60 million', color: JADE },
  { label: 'Taiping Rebellion Dead', value: '20–30 million', color: CRIMSON },
  { label: "Zheng He's Fleet", value: '300 ships', color: BLUE },
];

// ── Overview ────────────────────────────────────────────────────────────────

const OVERVIEW_INSIGHTS: InsightEntry[] = [
  {
    label: "World's Longest Continuous Civilization",
    detail:
      "China's recorded history stretches back roughly 4,000 years — making it the world's longest continuous civilization. While Egypt, Mesopotamia, and the Indus Valley had earlier beginnings, China is unique in maintaining an unbroken cultural and political thread from the Bronze Age to the present. The same writing system, philosophical traditions, and sense of cultural identity have persisted through millennia of dynastic change, foreign conquest, and revolution.",
  },
  {
    label: 'One-Fifth of Humanity',
    detail:
      "For most of recorded history, roughly one in five humans on Earth has been Chinese. This demographic weight meant that Chinese innovations — agricultural techniques, bureaucratic systems, philosophical frameworks — shaped the lives of more people than any other single civilization. What happened in China was never a regional story; it was always a global one.",
  },
  {
    label: 'The Four Great Inventions',
    detail:
      "Paper, printing, gunpowder, and the magnetic compass — all four were invented in China and spread westward along the Silk Road to transform the world. Paper and printing enabled the democratization of knowledge. Gunpowder revolutionized warfare. The compass made oceanic navigation possible. Francis Bacon wrote that these three inventions (he didn't know about paper) 'changed the whole face and state of things throughout the world.'",
  },
  {
    label: 'The Dynastic Cycle',
    detail:
      "Chinese history follows a recurring pattern: a strong founding emperor establishes a new dynasty, followed by a golden age of stability and prosperity. Gradually, corruption spreads, taxes rise, infrastructure decays, and the peasantry suffers. Natural disasters are interpreted as Heaven withdrawing its mandate. Rebellions erupt, the dynasty collapses, and after a period of chaos, a new dynasty rises — and the cycle begins again. This pattern repeated for 4,000 years.",
  },
];

// ── Xia & Legendary Origins ────────────────────────────────────────────────

const XIA_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Yellow Emperor (Huangdi)',
    detail:
      "Chinese civilization traces its mythological origins to the Yellow Emperor (Huangdi), said to have reigned around 2697 BCE. According to legend, he invented the calendar, Chinese medicine, and silk cultivation. He is considered the ancestor of all Han Chinese people. Whether historical or mythological, the Yellow Emperor represents the Chinese concept of a civilizing sage-king who brings order from chaos — a template for every dynasty founder who followed.",
  },
  {
    label: 'Yu the Great and the Xia Dynasty',
    detail:
      "The Xia Dynasty (~2100–1600 BCE) is traditionally considered China's first dynasty, founded by Yu the Great. According to legend, a catastrophic flood threatened civilization. Yu's father tried to stop the water with dams — and failed. Yu instead spent 13 years channeling the water through a system of irrigation canals, passing by his own home three times without stopping to visit his family. His success proved his worthiness to rule, and the sage-emperor Shun abdicated in Yu's favor. The Xia remains semi-legendary — no inscriptions from the dynasty have been found — but archaeological sites at Erlitou may correspond to Xia culture.",
  },
  {
    label: 'The Mandate of Heaven — Origins',
    detail:
      "The concept that Heaven (Tian) granted authority to a just ruler — and could withdraw it from a corrupt one — has roots going back to these earliest periods. The Xia dynasty's fall is attributed to its last ruler, Jie, whose tyranny caused Heaven to transfer the mandate to the Shang. This idea would become the most powerful political concept in Chinese history: no dynasty's rule was permanent, and rebellion against a corrupt ruler was not treason but Heaven's will.",
  },
];

// ── Shang Dynasty ───────────────────────────────────────────────────────────

const SHANG_INSIGHTS: InsightEntry[] = [
  {
    label: 'Oracle Bones — The Birth of Chinese Writing',
    detail:
      "The Shang dynasty gave us the earliest confirmed Chinese writing — inscriptions on oracle bones dating to ~1250 BCE. Diviners would inscribe questions on turtle shells or ox shoulder blades, then heat the bones until they cracked. The pattern of cracks was interpreted as answers from ancestors and spirits. Over 150,000 oracle bone fragments have been discovered, recording questions about warfare, harvests, weather, and royal births. These inscriptions are the direct ancestors of modern Chinese characters — a writing system with an unbroken 3,200-year history.",
  },
  {
    label: 'Bronze Age Mastery',
    detail:
      "Shang bronze casting reached levels of sophistication unmatched anywhere in the ancient world. Ritual bronze vessels — used for offerings to ancestors — were cast using complex piece-mold techniques rather than the lost-wax method used elsewhere. Some vessels weigh over 800 kg. The artistry and technical skill reveal a highly organized society with specialized artisans, controlled access to copper and tin, and an elite obsessed with ritual propriety.",
  },
  {
    label: 'Ancestor Worship and Human Sacrifice',
    detail:
      "The Shang believed that dead ancestors could influence the living world and needed to be appeased through elaborate rituals. Royal burials included mass human sacrifice — hundreds of victims at major tombs, often prisoners of war. The tomb of Lady Fu Hao (one of Shang king Wu Ding's wives and a military commander) contained 16 sacrificed humans, 6 dogs, bronze weapons, jade objects, and 7,000 cowrie shells. This practice reflected a worldview where the boundary between the living and dead was porous and where the dead required servants in the afterlife.",
  },
];

// ── Zhou Dynasty ────────────────────────────────────────────────────────────

const ZHOU_TIMELINE: TimelineEntry[] = [
  {
    year: '1046 BCE',
    title: 'Western Zhou — The Feudal Order',
    description:
      "King Wu of Zhou overthrew the last Shang king (the legendarily cruel King Zhou) at the Battle of Muye. The Zhou established a feudal system, granting territories to relatives and allies as vassal states. They formalized the Mandate of Heaven doctrine — the Zhou justified their conquest by claiming the Shang had lost Heaven's favor through moral corruption. This established the precedent that political legitimacy required moral governance, not just military power. The Western Zhou lasted until 771 BCE, when nomadic raids forced the capital's relocation eastward.",
    color: JADE,
  },
  {
    year: '770–476 BCE',
    title: 'Spring and Autumn Period — 170 States in Contest',
    description:
      "As Zhou royal power weakened, roughly 170 vassal states competed for dominance. Five 'hegemons' (ba) rose and fell in succession. Despite constant warfare, this was also an intellectual golden age. The breakdown of the old feudal order created a market for new ideas — rulers hired traveling scholars who offered competing visions of how to restore order. Confucius (551–479 BCE) wandered from court to court, largely ignored in his lifetime, teaching that moral cultivation and ritual propriety could restore social harmony.",
    color: BLUE,
  },
  {
    year: '475–221 BCE',
    title: 'Warring States Period — Seven Kingdoms at War',
    description:
      "The 170 states consolidated into seven major powers: Qi, Chu, Yan, Han, Zhao, Wei, and Qin. Warfare became total — armies of hundreds of thousands, iron weapons replacing bronze, cavalry replacing chariots, and the emergence of professional military strategists like Sun Tzu (author of The Art of War). Diplomatic alliances shifted constantly. The Qin state, in the west, adopted Legalist reforms that made it the most efficiently governed (and most ruthlessly militaristic) of the seven.",
    color: IMPERIAL_RED,
  },
];

const HUNDRED_SCHOOLS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Confucianism — Moral Order Through Ritual',
    detail:
      "Confucius (Kong Qiu, 551–479 BCE) taught that social harmony came from proper relationships: ruler and subject, father and son, husband and wife, elder and younger brother, friend and friend. Each relationship carried mutual obligations. Education, moral self-cultivation, and ritual propriety (li) were the path to a just society. Confucius didn't seek to overthrow the system — he wanted to reform it by producing morally superior people (junzi) who would govern wisely. His ideas were largely ignored in his lifetime but became China's state ideology under the Han dynasty and shaped East Asian civilization for 2,000 years.",
  },
  {
    label: 'Taoism — The Way of Nature',
    detail:
      "Attributed to the semi-legendary Laozi (and later developed by Zhuangzi), Taoism offered a radical alternative to Confucian activism. The Tao (the Way) is the fundamental principle underlying all reality — formless, nameless, beyond human comprehension. The ideal life means aligning with the Tao through wu wei ('non-action' or effortless action), like water flowing around obstacles. Where Confucianism emphasized social duty and hierarchy, Taoism valued spontaneity, simplicity, and harmony with nature. The tension between these two philosophies — duty vs. freedom, society vs. nature — has defined Chinese culture ever since.",
  },
  {
    label: 'Legalism — Power Through Law',
    detail:
      "Legalists like Han Feizi and Shang Yang had no interest in moral cultivation. They believed humans were inherently selfish and could only be controlled through clear laws, harsh punishments, and a powerful state apparatus. Rewards for obedience, severe penalties for disobedience — no exceptions for the nobility. The state of Qin adopted Legalism wholesale: farmers and soldiers were rewarded, merchants and scholars were suppressed, and the state became a ruthlessly efficient war machine. Legalism unified China — and nearly destroyed it. Every subsequent dynasty used Legalist methods in practice while publicly endorsing Confucian values.",
  },
  {
    label: 'Mohism — Universal Love and Practical Science',
    detail:
      "Mozi (c. 470–391 BCE) rejected Confucian emphasis on ritual and family loyalty, arguing instead for 'universal love' (jian ai) — impartial concern for all people regardless of social status or kinship. Mohists opposed offensive warfare, developed siege defense technology, and practiced a form of consequentialist ethics. They were also early scientists: Mohist texts contain observations on optics, mechanics, and geometry. Mohism rivaled Confucianism in influence during the Warring States period but eventually declined under the Han, when Confucianism became the state ideology.",
  },
];

// ── Qin Dynasty ─────────────────────────────────────────────────────────────

const QIN_INSIGHTS: InsightEntry[] = [
  {
    label: 'Qin Shi Huang — The First Emperor',
    detail:
      "In 221 BCE, King Zheng of Qin conquered the last rival state and declared himself Qin Shi Huang — 'First Emperor of Qin.' He didn't just conquer China; he invented the idea of a unified Chinese empire. He standardized everything: writing (one script to replace regional variants), weights and measures, currency (round coins with square holes), and even axle widths (so all carts could use the same roads). He connected existing defensive walls into the first version of the Great Wall. He built a national road network radiating from the capital, Xianyang. China as a unified political entity — rather than a collection of warring kingdoms — was his creation.",
  },
  {
    label: 'The Terracotta Army',
    detail:
      "Discovered in 1974 by farmers digging a well, the Terracotta Army is one of archaeology's greatest finds. Over 8,000 life-size warriors, 130 chariots, 670 horses, and hundreds of non-military figures guard the emperor's tomb — each warrior with a unique face, hairstyle, and expression. The army was arranged in battle formation in three massive underground pits. The main tomb itself remains unexcavated. Ancient historian Sima Qian described it as containing rivers of mercury, a map of the empire on the floor, and crossbow traps for tomb raiders. Soil analysis has confirmed anomalously high mercury levels.",
  },
  {
    label: 'Book Burning and Scholar Burying',
    detail:
      "Qin Shi Huang's Legalist government suppressed intellectual dissent. In 213 BCE, Chancellor Li Si persuaded the emperor to burn all books except practical manuals on medicine, agriculture, and divination — and texts in the imperial library. Confucian scholars who protested were reportedly buried alive (the exact number is debated by historians). This intellectual purge, while devastating, was not as total as later Confucian historians claimed — they had strong motivation to vilify the dynasty that tried to destroy their tradition.",
  },
  {
    label: 'Collapse After 15 Years',
    detail:
      "The Qin dynasty, for all its revolutionary achievements, lasted only 15 years (221–206 BCE). The brutal pace of construction — the Great Wall, the emperor's tomb, roads, canals — crushed the peasantry with forced labor and heavy taxation. When Qin Shi Huang died in 210 BCE, his weak son took the throne and was manipulated by the eunuch Zhao Gao. Peasant rebellions erupted within a year. The dynasty that unified China collapsed into civil war, proving the Legalist paradox: a system that relies on force alone cannot survive the death of the strong man who wields it.",
  },
];

// ── Han Dynasty ─────────────────────────────────────────────────────────────

const HAN_TIMELINE: TimelineEntry[] = [
  {
    year: '206 BCE',
    title: 'Liu Bang — The Peasant Emperor',
    description:
      "Liu Bang, a minor provincial official of peasant origin, defeated the aristocratic warlord Xiang Yu in a brutal civil war and founded the Han dynasty. He was China's first commoner-emperor — proof that the Mandate of Heaven could pass to anyone, regardless of birth. He softened the harshest Qin laws while keeping the centralized state structure. The name 'Han' became so synonymous with Chinese identity that the majority ethnic group in China is still called 'Han Chinese' today.",
    color: JADE,
  },
  {
    year: '141–87 BCE',
    title: 'Emperor Wu — The Martial Emperor',
    description:
      "The most consequential Han ruler, Emperor Wu (Wu Di) made Confucianism the state ideology, established the examination system for selecting officials, and vastly expanded the empire. His armies pushed into Central Asia, Korea, and Vietnam. He dispatched Zhang Qian westward in 138 BCE — the mission that opened the Silk Road, connecting China to Rome via Central Asia for the first time. Under Emperor Wu, Han China rivaled the Roman Empire in size, population, and power.",
    color: GOLD,
  },
  {
    year: '~105 CE',
    title: 'Cai Lun Improves Papermaking',
    description:
      "Court official Cai Lun refined the papermaking process using bark, hemp, rags, and fishnets — producing paper that was cheaper and better than earlier materials. While paper may have existed in crude form earlier, Cai Lun's method was standardized and spread throughout the empire. Paper replaced bamboo strips and silk as writing material, dramatically reducing the cost of record-keeping and education. It reached the Islamic world by the 8th century and Europe by the 12th — each time revolutionizing the civilization that adopted it.",
    color: SILK_WHITE,
  },
  {
    year: '~65 CE onward',
    title: 'Buddhism Arrives from India',
    description:
      "Buddhism entered China via Silk Road merchants and monks, probably reaching the imperial court by the mid-1st century CE. It offered something Confucianism and Taoism did not: a systematic explanation of suffering and a promise of salvation. Initially seen as a foreign curiosity, Buddhism would eventually become one of the three pillars of Chinese spiritual life alongside Confucianism and Taoism — a coexistence unique in world civilizations.",
    color: PURPLE,
  },
];

const HAN_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Silk Road — Connecting East and West',
    detail:
      "The Silk Road was not a single road but a network of trade routes stretching 4,000 miles from Chang'an (Xi'an) to the Roman Empire. Silk, porcelain, tea, and paper flowed west; gold, glass, horses, and grapes flowed east. More importantly, ideas traveled: Buddhism, Islam, and Christianity all spread along these routes. The Silk Road was the internet of the ancient world — the primary channel for the exchange of goods, technologies, religions, and diseases between civilizations.",
  },
  {
    label: 'Han China and Rome — Twin Empires',
    detail:
      "At their peaks, the Han and Roman Empires were the two largest states on Earth, each governing around 50–60 million people. They knew of each other — Roman records mention 'Serica' (the silk land), and Chinese records mention 'Daqin' (the Roman Empire). But direct contact was rare; the Parthian Empire in between controlled the lucrative middleman trade. Both empires fell in the same general period (3rd–5th centuries CE), plunging their respective regions into centuries of division.",
  },
];

// ── Period of Division ──────────────────────────────────────────────────────

const DIVISION_INSIGHTS: InsightEntry[] = [
  {
    label: 'Three Kingdoms (220–280 CE)',
    detail:
      "After the Han collapsed, China fractured into three rival states: Wei (north), Shu (southwest), and Wu (southeast). This period — immortalized in the 14th-century novel 'Romance of the Three Kingdoms' — produced some of China's most beloved heroes and villains: the cunning strategist Zhuge Liang, the virtuous warrior Guan Yu (later deified as the god of war), and the ambitious Cao Cao. The Three Kingdoms era is to Chinese culture what the Arthurian legends are to the West — a foundational mythology of heroism, loyalty, and tragedy.",
  },
  {
    label: 'Buddhism Spreads — Comfort in Chaos',
    detail:
      "The centuries of warfare and instability following the Han dynasty created fertile ground for Buddhism. As people sought meaning amid suffering, Buddhist monasteries offered refuge, education, and community. Chinese Buddhism developed distinctive schools — Chan (Zen) Buddhism emphasized meditation and sudden enlightenment, Pure Land Buddhism offered salvation through faith. Buddhism also inspired extraordinary art: the cave temples at Dunhuang, Longmen, and Yungang contain thousands of carved Buddhas spanning centuries of artistic evolution.",
  },
  {
    label: 'Northern and Southern Dynasties (420–589 CE)',
    detail:
      "China split along the Yangtze River: the north was conquered by a succession of non-Chinese steppe peoples (Xiongnu, Xianbei, Di, Qiang, Jie), while Chinese aristocrats fled south and established their own dynasties. This division had lasting consequences: northern China absorbed steppe traditions (horse culture, military governance, more fluid social hierarchies), while the south developed its own distinctive culture (rice agriculture, commercial wealth, literary sophistication). When China was reunified under the Sui and Tang, the synthesis of northern and southern traditions produced something new and vibrant.",
  },
];

// ── Tang Dynasty ────────────────────────────────────────────────────────────

const TANG_TIMELINE: TimelineEntry[] = [
  {
    year: '618',
    title: "The Tang Founded — China's Golden Age Begins",
    description:
      "The Li family overthrew the short-lived Sui dynasty (which had reunified China but exhausted it with massive construction projects, including the Grand Canal). The Tang dynasty would become China's most celebrated era — a time of territorial expansion, cultural brilliance, and unprecedented cosmopolitanism. The capital, Chang'an (modern Xi'an), was the world's largest city with over a million inhabitants, hosting merchants, monks, and diplomats from Persia, India, Arabia, Korea, Japan, and Southeast Asia.",
    color: GOLD,
  },
  {
    year: '690–705',
    title: "Empress Wu Zetian — China's Only Female Emperor",
    description:
      "Wu Zetian rose from concubine to empress consort to — uniquely in Chinese history — emperor in her own right, founding her own brief dynasty (the Zhou). She ruled through intelligence, ruthlessness, and political brilliance. She expanded the examination system to recruit talent regardless of aristocratic birth, promoted Buddhism over Confucianism (which excluded women from power), and maintained the empire's territorial integrity. Confucian historians despised her — but modern scholars recognize her as one of China's most capable rulers.",
    color: PURPLE,
  },
  {
    year: '712–756',
    title: 'Emperor Xuanzong and Yang Guifei',
    description:
      "Emperor Xuanzong presided over the Tang's cultural zenith — then destroyed it. His early reign was brilliant: poetry, painting, music, and scholarship flourished. But he became obsessed with his concubine Yang Guifei, one of China's legendary 'Four Beauties.' He neglected governance, empowered her corrupt relatives, and allowed frontier general An Lushan to amass dangerous military power. In 755, An Lushan launched a devastating rebellion. Fleeing the capital, Xuanzong's own guards demanded Yang Guifei's execution. He complied. Their love story — passion destroying an empire — became China's greatest romance and tragedy.",
    color: IMPERIAL_RED,
  },
  {
    year: '~700–800s',
    title: 'Poetry Golden Age — Li Bai and Du Fu',
    description:
      "The Tang dynasty produced China's greatest poets. Li Bai (701–762), the 'Immortal of Poetry,' was a Taoist romantic who wrote of moonlight, wine, friendship, and the transcendence of nature. Du Fu (712–770), the 'Sage of Poetry,' was a Confucian realist who documented the suffering of common people during the An Lushan Rebellion. Together, they represent the two poles of Chinese literary sensibility — ecstatic individualism and compassionate social conscience. Over 48,900 Tang poems survive from 2,200 known poets.",
    color: SKY_BLUE,
  },
  {
    year: '~700 CE',
    title: 'Block Printing Invented',
    description:
      "The Tang dynasty saw the invention of woodblock printing — carving text in reverse on wooden blocks, inking them, and pressing paper against them. The oldest known printed book, the Diamond Sutra (868 CE), was produced in China. Block printing made books dramatically cheaper and more accessible than hand-copied manuscripts. This technology spread to Korea and Japan, and eventually (via the Silk Road) influenced Gutenberg's development of movable type in 15th-century Europe.",
    color: TEAL,
  },
];

// ── Song Dynasty ────────────────────────────────────────────────────────────

const SONG_INSIGHTS: InsightEntry[] = [
  {
    label: "Paper Money — World's First (10th Century)",
    detail:
      "The Song dynasty invented paper currency — the world's first. Merchants in Sichuan, burdened by heavy iron coins, began issuing private promissory notes. The government took over, issuing official paper money backed by coin reserves. This financial innovation fueled commercial expansion: the Song economy was the most monetized and commercially sophisticated in the world. But it also introduced the world to inflation — when later dynasties printed money without adequate backing, the results were devastating.",
  },
  {
    label: 'Gunpowder Weapons',
    detail:
      "While gunpowder was invented during the Tang dynasty (possibly earlier, by Taoist alchemists seeking an elixir of immortality), the Song weaponized it. Fire arrows, bombs, grenades, fire lances (proto-guns), and early cannons appeared on Song battlefields. The 'fire lance' — a bamboo tube packed with gunpowder and projectiles — was the ancestor of all firearms. These weapons spread westward through the Mongol conquests and the Silk Road, eventually reaching Europe in the 13th–14th centuries and transforming global warfare forever.",
  },
  {
    label: 'Compass Navigation',
    detail:
      "Chinese sailors were using magnetic compasses for navigation by the 11th century — centuries before Europeans. Song-era ships, equipped with compasses, watertight compartments, and sternpost rudders, were the most advanced in the world. Maritime trade boomed: Chinese merchants sailed to Southeast Asia, India, and East Africa. The compass reached Europe by the 12th century, enabling the Age of Exploration. Three of the four great Chinese inventions (gunpowder, printing, compass) were Song-era developments.",
  },
  {
    label: 'Urban Revolution — 100 Million People',
    detail:
      "The Song was the world's first society to cross 100 million in population. Cities like Kaifeng and Hangzhou had over a million residents — with restaurants, theaters, night markets, fire brigades, and a sophisticated urban culture that Marco Polo later described (of Hangzhou) as 'beyond dispute the finest and the noblest city in the world.' A merchant class emerged, challenging the traditional Confucian social hierarchy that ranked merchants at the bottom. The Song urban experience was more recognizably modern than anything in contemporary Europe.",
  },
  {
    label: 'Neo-Confucianism — Zhu Xi',
    detail:
      "The philosopher Zhu Xi (1130–1200) synthesized Confucian ethics with Buddhist and Taoist metaphysics, creating Neo-Confucianism. He proposed that all things contain li (principle/pattern) and qi (material force), and that moral cultivation meant aligning with universal principles through study and self-reflection. Zhu Xi's commentaries on the Confucian classics became the standard for the imperial examination system and remained so for 700 years. Neo-Confucianism spread to Korea, Japan, and Vietnam, shaping East Asian intellectual life into the modern era.",
  },
];

// ── Yuan Dynasty ────────────────────────────────────────────────────────────

const YUAN_INSIGHTS: InsightEntry[] = [
  {
    label: "Kublai Khan — Genghis Khan's Grandson",
    detail:
      "Kublai Khan (r. 1271–1294), grandson of Genghis Khan, conquered the Southern Song and founded the Yuan dynasty — making China part of the vast Mongol Empire for the first time. He moved the capital to Dadu (modern Beijing) and adopted many Chinese governance practices while maintaining Mongol military supremacy. He attempted to invade Japan twice (1274, 1281) — both fleets were destroyed by typhoons the Japanese called 'kamikaze' (divine wind). Kublai Khan was a pragmatist: he patronized Chinese art, Tibetan Buddhism, and Persian astronomy simultaneously.",
  },
  {
    label: "Marco Polo's Visit",
    detail:
      "The Venetian merchant Marco Polo claimed to have lived in China for 17 years (1275–1292), serving in Kublai Khan's court. His account, 'The Travels of Marco Polo,' introduced Europeans to a civilization that seemed impossibly advanced: paper money, coal heating, a postal relay system, massive cities, and organized fire brigades. Skeptics have questioned whether Polo actually reached China (he never mentioned tea, chopsticks, or the Great Wall), but his book — whether fully accurate or partly embellished — fired European imagination and inspired later explorers, including Columbus.",
  },
  {
    label: 'Chinese Resentment and Rebellion',
    detail:
      "The Mongol Yuan dynasty divided society into four classes: Mongols at the top, then Central Asians, then northern Chinese, and southern Chinese at the bottom. Chinese were barred from top government positions and forbidden to carry weapons. By the 1340s, a series of natural disasters — floods, droughts, and plague — combined with corruption and discriminatory policies sparked massive uprisings. The Red Turban rebellions, drawing on Buddhist millenarian beliefs, eventually produced Zhu Yuanzhang — a former beggar and monk who would found the Ming dynasty.",
  },
];

// ── Ming Dynasty ────────────────────────────────────────────────────────────

const MING_TIMELINE: TimelineEntry[] = [
  {
    year: '1368',
    title: 'Zhu Yuanzhang — From Beggar to Emperor',
    description:
      "Zhu Yuanzhang, orphaned by famine and plague, became a Buddhist monk, then a rebel leader, then the founding emperor of the Ming dynasty (taking the reign name Hongwu). He was brilliant, paranoid, and brutal — purging thousands of officials in his later years. He restored Chinese rule after nearly a century of Mongol domination, rebuilt the agricultural economy, and established the governmental structure that would last until 1912. His was the ultimate rags-to-riches story in Chinese history.",
    color: IMPERIAL_RED,
  },
  {
    year: '1405–1433',
    title: "Zheng He's Treasure Voyages",
    description:
      "Admiral Zheng He, a Muslim eunuch, led seven massive naval expeditions across Southeast Asia, India, Arabia, and East Africa. His treasure fleet was staggering: up to 300 ships and 28,000 crew. His flagship was roughly 400 feet long — Columbus's Santa Maria was 85 feet. These voyages projected Chinese power across the Indian Ocean, established diplomatic relations, and collected exotic goods (including a giraffe, presented to the emperor as a qilin — a mythical beast signaling virtuous rule). Then, abruptly, the voyages stopped. The Confucian bureaucracy viewed them as wasteful extravagance, and China turned inward.",
    color: BLUE,
  },
  {
    year: '1406–1420',
    title: 'The Forbidden City Built',
    description:
      "Emperor Yongle (who also sponsored Zheng He) built the Forbidden City in Beijing — the largest palace complex in the world, with 980 buildings across 180 acres. It served as the imperial palace for nearly 500 years (1420–1912). The complex embodies Chinese cosmological principles: the emperor, the 'Son of Heaven,' sat at the center of the world, facing south, mediating between Heaven and Earth. Over a million workers constructed it using materials from across the empire.",
    color: GOLD,
  },
  {
    year: '1400s–1600s',
    title: 'The Great Wall Rebuilt',
    description:
      "The Great Wall that tourists visit today is overwhelmingly Ming-era construction. While earlier dynasties (Qin, Han, Northern Qi) built defensive walls, the Ming rebuilt and extended the wall system into the massive stone-and-brick fortification familiar to the modern world. The complete Ming wall and its branches stretched over 5,500 miles. It was not an impenetrable barrier — it was a military infrastructure system: watchtowers for signaling, garrison stations, and a means of controlling trade and migration across the northern frontier.",
    color: STONE,
  },
  {
    year: '1500s–1644',
    title: 'The Isolationist Turn',
    description:
      "After Zheng He, the Ming government banned overseas voyages and restricted foreign trade to a few supervised ports. The 'sea ban' (haijin) was partly motivated by piracy, partly by Confucian suspicion of merchants, and partly by the belief that China already had everything it needed. This inward turn happened just as Europeans were beginning their Age of Exploration. The consequences were enormous: by the time European ships reached Chinese waters in the 16th century, China had voluntarily surrendered the maritime dominance it had held for centuries.",
    color: SLATE,
  },
];

// ── Qing Dynasty ────────────────────────────────────────────────────────────

const QING_TIMELINE: TimelineEntry[] = [
  {
    year: '1644',
    title: 'The Manchu Conquest',
    description:
      "The Manchus, a semi-nomadic people from northeast of the Great Wall, conquered China after a Ming general opened the gates of the Great Wall — inviting them in to help suppress a peasant rebellion. The Manchus established the Qing dynasty, requiring all Han Chinese men to adopt the Manchu queue hairstyle (shaved forehead with a long braided pigtail) as a sign of submission. Resistance was met with massacre. Despite being foreign conquerors, the Manchus adopted Chinese governance systems and Confucian ideology, presenting themselves as legitimate inheritors of the Chinese imperial tradition.",
    color: INDIGO,
  },
  {
    year: '1661–1796',
    title: 'The High Qing — Kangxi and Qianlong',
    description:
      "The Kangxi Emperor (r. 1661–1722) and his grandson the Qianlong Emperor (r. 1735–1796) presided over 135 years of prosperity that represented the zenith of the Chinese imperial system. The empire expanded to its largest-ever extent — incorporating Mongolia, Tibet, Taiwan, and Xinjiang. Population doubled, then doubled again, reaching 300 million. Literature, art, and scholarship flourished: the Kangxi Dictionary standardized Chinese characters, and the Siku Quanshu (Complete Library of the Four Treasuries) collected the entire Chinese literary heritage in 36,000 volumes.",
    color: GOLD,
  },
  {
    year: '1839–1860',
    title: 'The Opium Wars — Century of Humiliation Begins',
    description:
      "British merchants, desperate to balance their trade deficit with China (they bought vast quantities of tea, silk, and porcelain but had little China wanted), smuggled Indian opium into China. When the Qing government destroyed 20,000 chests of British opium, Britain declared war. China lost both Opium Wars decisively, forced to cede Hong Kong, open ports to foreign trade, legalize opium, and grant extraterritorial rights to foreigners. These 'unequal treaties' began what Chinese historians call the 'Century of Humiliation' — a national trauma that shapes Chinese politics to this day.",
    color: CRIMSON,
  },
  {
    year: '1850–1864',
    title: 'Taiping Rebellion — History\'s Deadliest Civil War',
    description:
      "Hong Xiuquan, a failed civil service examination candidate who came to believe he was the brother of Jesus Christ, led the Taiping Rebellion — the bloodiest civil war in human history. The Taiping Heavenly Kingdom controlled much of southern China for over a decade, with a capital at Nanjing. They preached a syncretic Christianity, banned opium and foot-binding, and advocated land redistribution. The eventual suppression of the Taiping cost an estimated 20–30 million lives — more than World War I. The Qing survived but never recovered.",
    color: IMPERIAL_RED,
  },
  {
    year: '1912',
    title: 'Fall of the Last Dynasty',
    description:
      "After decades of humiliation, failed reforms, and revolutionary agitation, the Qing dynasty finally fell in 1912. The Wuchang Uprising of October 1911 triggered a chain reaction of provincial secessions. Sun Yat-sen was declared provisional president of the Republic of China. The last emperor, Puyi, was six years old when he abdicated — ending 4,000 years of dynastic rule in China. The boy who lost an empire lived to see the Communist revolution, was 're-educated,' and died as an ordinary citizen and gardener in Beijing in 1967.",
    color: TERRACOTTA,
  },
];

// ── Legacy ──────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'The End of 4,000 Years',
    detail:
      "The fall of the Qing in 1912 ended the longest continuous political tradition in human history. The dynastic cycle — repeated dozens of times over four millennia — finally broke. What replaced it was not another dynasty but a century of revolution, civil war, foreign invasion, and ideological transformation. Yet the deeper continuities persisted: the writing system, the philosophical traditions, the cultural identity, and the idea of China as a unified civilization-state rather than a mere nation.",
  },
  {
    label: 'The Chinese Diaspora',
    detail:
      "Over 50 million ethnic Chinese live outside China, primarily in Southeast Asia — where Chinese merchants have been trading for over a thousand years. Chinese diaspora communities shaped the economies and cultures of Malaysia, Singapore, Indonesia, Thailand, the Philippines, and beyond. Chinatowns exist in virtually every major city on Earth. This global dispersion carried Chinese culture, cuisine, medicine, and business practices worldwide, making Chinese civilization one of the most influential cultural forces in human history.",
  },
  {
    label: 'Four Inventions That Changed the World',
    detail:
      "Paper and printing enabled the democratization of knowledge that made the Renaissance, Reformation, and Scientific Revolution possible. Gunpowder transformed warfare from aristocratic combat to industrial slaughter. The compass enabled oceanic navigation and the Age of Exploration. These four inventions, all originating in China and transmitted westward via the Silk Road, are arguably the most consequential technological contributions of any single civilization to the modern world. Europe's rise was built on Chinese foundations.",
  },
  {
    label: 'The Confucian World',
    detail:
      "Confucian values — emphasis on education, filial piety, social harmony, meritocratic governance — continue to shape China, Korea, Japan, Vietnam, and Singapore. The modern examination systems of East Asian countries, the emphasis on academic achievement, respect for teachers and elders, and the concept of government by educated meritocracy all trace back to Confucius and the system the Han dynasty built around his ideas. A philosophy developed in the 5th century BCE remains a living force in the 21st century.",
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  { name: 'Qin Shi Huang', years: '259–210 BCE', contribution: 'First Emperor: unified China, standardized writing/currency/weights, built the Great Wall and Terracotta Army' },
  { name: 'Confucius (Kong Qiu)', years: '551–479 BCE', contribution: 'Philosopher whose teachings on morality, governance, and social harmony became the foundation of Chinese civilization for 2,000 years' },
  { name: 'Laozi', years: 'c. 6th century BCE', contribution: 'Legendary founder of Taoism, author of the Tao Te Ching — philosophy of harmony with nature and wu wei (effortless action)' },
  { name: 'Emperor Wu of Han', years: '156–87 BCE', contribution: 'Made Confucianism state ideology, opened the Silk Road, expanded the empire to rival Rome' },
  { name: 'Cai Lun', years: '~50–121 CE', contribution: 'Improved papermaking process — one of the most consequential inventions in human history' },
  { name: 'Wu Zetian', years: '624–705 CE', contribution: "China's only female emperor — rose from concubine to sole ruler through political brilliance" },
  { name: 'Li Bai', years: '701–762 CE', contribution: "Tang dynasty 'Immortal of Poetry' — wrote of moonlight, wine, and transcendence" },
  { name: 'Du Fu', years: '712–770 CE', contribution: "Tang dynasty 'Sage of Poetry' — documented the suffering of common people with profound compassion" },
  { name: 'Zhu Xi', years: '1130–1200 CE', contribution: 'Neo-Confucian philosopher whose commentaries shaped the examination system for 700 years' },
  { name: 'Zheng He', years: '1371–1433 CE', contribution: 'Muslim eunuch admiral who commanded treasure fleets of 300 ships across the Indian Ocean' },
  { name: 'Kublai Khan', years: '1215–1294 CE', contribution: "Genghis Khan's grandson who conquered China and founded the Yuan dynasty, uniting East and West" },
  { name: 'Kangxi Emperor', years: '1654–1722 CE', contribution: 'Longest-reigning emperor (61 years), expanded the Qing to its greatest extent, patron of arts and learning' },
];

const FIGURE_COLORS = [IMPERIAL_RED, GOLD, JADE, BLUE, PURPLE, TEAL, AMBER, INDIGO, TERRACOTTA, DRAGON_GREEN, SKY_BLUE, BRONZE];

// ── Connections ─────────────────────────────────────────────────────────────

const CONNECTIONS: ConnectionCard[] = [
  { title: 'Ancient India', description: 'Buddhism traveled from India to China, transforming both civilizations', path: '/ancient-india', color: PURPLE },
  { title: 'The Mongol Empire', description: "Genghis Khan's descendants conquered China and founded the Yuan dynasty", path: '/mongol-empire', color: CRIMSON },
  { title: 'The Silk Road', description: 'The trade network that carried Chinese inventions westward and connected civilizations', path: '/silk-road', color: GOLD },
  { title: 'Ancient China', description: 'Explore the cultural and philosophical foundations in greater depth', path: '/ancient-china', color: IMPERIAL_RED },
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
    <section id={id} style={{ padding: '48px 0', borderTop: `1px solid ${accentColor}33` }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor, marginBottom: 12 }}>
          {icon} {title}
        </h2>
        <p style={{ maxWidth: 800, color: ASH, lineHeight: 1.7, marginBottom: 24, fontSize: '1rem' }}>
          {intro}
        </p>
      </motion.div>
      {children}
    </section>
  );
}

function TimelineCard({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {entries.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
            paddingBottom: 4,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: e.color,
              backgroundColor: `${e.color}18`,
              padding: '2px 10px',
              borderRadius: 6,
              marginBottom: 6,
            }}
          >
            {e.year}
          </span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>
            {e.title}
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>{e.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

function InsightGrid({ items }: { items: InsightEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: 18,
          }}
        >
          <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 8 }}>
            {item.label}
          </h4>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>{item.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {figures.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${FIGURE_COLORS[i % FIGURE_COLORS.length]}33`,
            borderRadius: 10,
            padding: 18,
          }}
        >
          <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: FIGURE_COLORS[i % FIGURE_COLORS.length] }}>
            {f.name}
          </h4>
          <p style={{ fontSize: '0.8rem', color: SLATE, marginBottom: 6 }}>{f.years}</p>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>{f.contribution}</p>
        </motion.div>
      ))}
    </div>
  );
}

function StatsBar({ stats }: { stats: StatEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14, marginTop: 24 }}>
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
          style={{
            textAlign: 'center',
            padding: '14px 8px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${s.color}33`,
            borderRadius: 10,
          }}
        >
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: '0.75rem', color: SLATE, marginTop: 4 }}>{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

function InventionsCallout() {
  const inventions = [
    { name: 'Paper', era: 'Han Dynasty (~105 CE)', icon: '📜', impact: 'Democratized knowledge — replaced bamboo strips and silk as writing material' },
    { name: 'Printing', era: 'Tang Dynasty (~700 CE)', icon: '🖨️', impact: 'Made books affordable — led to the Gutenberg revolution in Europe' },
    { name: 'Gunpowder', era: 'Tang/Song Dynasty', icon: '💥', impact: 'Transformed warfare — ended the age of castles and armored knights' },
    { name: 'Compass', era: 'Song Dynasty (~11th c.)', icon: '🧭', impact: 'Enabled oceanic navigation — made the Age of Exploration possible' },
  ];

  return (
    <div style={{
      background: `linear-gradient(135deg, rgba(245,158,11,0.08), rgba(220,38,38,0.06))`,
      border: `1px solid ${GOLD}33`,
      borderRadius: 12,
      padding: 24,
      marginTop: 20,
      marginBottom: 8,
    }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: GOLD, marginBottom: 16 }}>
        🏛️ The Four Great Inventions
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {inventions.map((inv, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 8,
              padding: 14,
            }}
          >
            <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{inv.icon}</div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 2 }}>{inv.name}</h4>
            <p style={{ fontSize: '0.75rem', color: GOLD, marginBottom: 6 }}>{inv.era}</p>
            <p style={{ fontSize: '0.85rem', color: ASH, lineHeight: 1.6 }}>{inv.impact}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ZhengHeComparison() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(20,184,166,0.06))',
      border: `1px solid ${BLUE}33`,
      borderRadius: 12,
      padding: 24,
      marginTop: 20,
      marginBottom: 8,
    }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: BLUE, marginBottom: 16 }}>
        ⚓ Zheng He vs. Columbus — A Comparison
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 16 }}>
          <h4 style={{ color: BLUE, fontWeight: 700, marginBottom: 10 }}>Zheng He (1405–1433)</h4>
          <div style={{ color: ASH, fontSize: '0.9rem', lineHeight: 1.8 }}>
            <div><strong style={{ color: '#f1f5f9' }}>Ships:</strong> up to 300</div>
            <div><strong style={{ color: '#f1f5f9' }}>Crew:</strong> 28,000</div>
            <div><strong style={{ color: '#f1f5f9' }}>Flagship:</strong> ~400 ft long</div>
            <div><strong style={{ color: '#f1f5f9' }}>Voyages:</strong> 7 expeditions</div>
            <div><strong style={{ color: '#f1f5f9' }}>Reach:</strong> SE Asia, India, Arabia, East Africa</div>
          </div>
        </div>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 16 }}>
          <h4 style={{ color: TEAL, fontWeight: 700, marginBottom: 10 }}>Columbus (1492)</h4>
          <div style={{ color: ASH, fontSize: '0.9rem', lineHeight: 1.8 }}>
            <div><strong style={{ color: '#f1f5f9' }}>Ships:</strong> 3</div>
            <div><strong style={{ color: '#f1f5f9' }}>Crew:</strong> 90</div>
            <div><strong style={{ color: '#f1f5f9' }}>Flagship:</strong> ~85 ft long</div>
            <div><strong style={{ color: '#f1f5f9' }}>Voyages:</strong> 4 expeditions</div>
            <div><strong style={{ color: '#f1f5f9' }}>Reach:</strong> Caribbean, Central America</div>
          </div>
        </div>
      </div>
      <p style={{ color: SLATE, fontSize: '0.85rem', fontStyle: 'italic', marginTop: 14, textAlign: 'center' }}>
        Zheng He sailed 60 years before Columbus — with 100× the ships and 300× the crew. Then China stopped.
      </p>
    </div>
  );
}

function DynasticCycleBox() {
  const stages = [
    { stage: '1. Founding', desc: 'A strong leader defeats rivals, establishes a new dynasty, and restores order', color: JADE },
    { stage: '2. Golden Age', desc: 'Peace, prosperity, population growth, cultural flourishing, territorial expansion', color: GOLD },
    { stage: '3. Decline', desc: 'Corruption spreads, taxes rise, infrastructure decays, court factions struggle for power', color: AMBER },
    { stage: '4. Crisis', desc: 'Natural disasters, famine, peasant suffering — interpreted as Heaven withdrawing its mandate', color: IMPERIAL_RED },
    { stage: '5. Collapse', desc: 'Rebellions erupt, the dynasty falls, chaos reigns — until a new founder emerges', color: CRIMSON },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.06))',
      border: `1px solid ${INDIGO}33`,
      borderRadius: 12,
      padding: 24,
      marginTop: 20,
      marginBottom: 8,
    }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: INDIGO, marginBottom: 16 }}>
        🔄 The Dynastic Cycle
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {stages.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 8,
              padding: 12,
              borderLeft: `3px solid ${s.color}`,
            }}
          >
            <span style={{ fontWeight: 700, color: s.color, fontSize: '0.9rem', minWidth: 100 }}>{s.stage}</span>
            <span style={{ color: ASH, fontSize: '0.9rem', lineHeight: 1.6 }}>{s.desc}</span>
          </motion.div>
        ))}
      </div>
      <p style={{ color: SLATE, fontSize: '0.85rem', fontStyle: 'italic', marginTop: 14, textAlign: 'center' }}>
        This cycle repeated for 4,000 years — until 1912.
      </p>
    </div>
  );
}

function ConnectionCards({ cards }: { cards: ConnectionCard[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        >
          <Link
            to={c.path}
            style={{
              display: 'block',
              textDecoration: 'none',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${c.color}33`,
              borderRadius: 10,
              padding: 18,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${c.color}66`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${c.color}33`; }}
          >
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: c.color, marginBottom: 6 }}>{c.title}</h4>
            <p style={{ color: ASH, fontSize: '0.85rem', lineHeight: 1.6 }}>{c.description}</p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function ChineseDynastiesPage() {
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
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </div>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <header style={{ paddingTop: 40, paddingBottom: 32 }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 16,
              background: `linear-gradient(135deg, ${IMPERIAL_RED}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Middle Kingdom — 4,000 Years of Chinese Dynasties
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ color: ASH, fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 780, marginBottom: 12 }}
          >
            From the mythological Yellow Emperor to the last child-emperor Puyi, China's dynastic
            history spans four millennia — the longest continuous civilization on Earth. One-fifth of
            humanity, the world's most transformative inventions, and a political cycle that repeated
            for 4,000 years.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ color: SLATE, fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 780 }}
          >
            Paper, printing, gunpowder, and the compass — all four were invented in China and
            spread westward along the Silk Road to reshape the world. Every dynasty followed the same
            arc: a founding emperor, a golden age, decline, chaos, and rebirth.
          </motion.p>

          <StatsBar stats={HERO_STATS} />
        </header>

        {/* ── Overview ────────────────────────────────────────────────── */}
        <SectionWrapper
          id="overview"
          icon="🌏"
          title="Why China's History Matters"
          accentColor={GOLD}
          intro="China is not just another ancient civilization — it is the ancient civilization that never ended. Its continuity, demographic weight, and inventive genius shaped the modern world more than any other single culture."
        >
          <InsightGrid items={OVERVIEW_INSIGHTS} />
          <DynasticCycleBox />
        </SectionWrapper>

        {/* ── Xia Dynasty ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="xia"
          icon="🐉"
          title="Legendary Origins & Xia Dynasty (~2100–1600 BCE)"
          accentColor={BRONZE}
          intro="Chinese civilization begins in myth — sage-kings who tamed floods and founded the first dynasty. The boundary between legend and history here is deliberately blurred."
        >
          <InsightGrid items={XIA_INSIGHTS} />
        </SectionWrapper>

        {/* ── Shang Dynasty ───────────────────────────────────────────── */}
        <SectionWrapper
          id="shang"
          icon="🦴"
          title="Shang Dynasty (1600–1046 BCE)"
          accentColor={AMBER}
          intro="China's first archaeologically confirmed dynasty — the era of oracle bones, bronze masterpieces, and the birth of Chinese writing."
        >
          <InsightGrid items={SHANG_INSIGHTS} />
        </SectionWrapper>

        {/* ── Zhou Dynasty ────────────────────────────────────────────── */}
        <SectionWrapper
          id="zhou"
          icon="📜"
          title="Zhou Dynasty (1046–256 BCE) — China's Longest Dynasty"
          accentColor={JADE}
          intro="Eight centuries of feudalism, fragmentation, and the most productive intellectual explosion in Chinese history. The ideas born in the Zhou shaped China for the next 2,000 years."
        >
          <TimelineCard entries={ZHOU_TIMELINE} />
        </SectionWrapper>

        <SectionWrapper
          id="hundred-schools"
          icon="🎓"
          title="The Hundred Schools of Thought"
          accentColor={INDIGO}
          intro="The breakdown of Zhou order created a marketplace of ideas. Wandering scholars offered competing visions of how to restore harmony — their debates produced the philosophical foundations of Chinese civilization."
        >
          <InsightGrid items={HUNDRED_SCHOOLS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Qin Dynasty ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="qin"
          icon="⚔️"
          title="Qin Dynasty (221–206 BCE) — China's First Empire"
          accentColor={TERRACOTTA}
          intro="Fifteen years that changed everything. One man unified China, standardized its systems, built the Great Wall, and created the concept of a Chinese empire — then his dynasty collapsed almost overnight."
        >
          <InsightGrid items={QIN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Han Dynasty ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="han"
          icon="🏛️"
          title="Han Dynasty (206 BCE–220 CE) — China's Golden Age"
          accentColor={JADE}
          intro="Comparable to Rome in size and power, the Han dynasty defined Chinese identity so thoroughly that the majority ethnic group still calls itself 'Han Chinese.' This was the age of the Silk Road, Confucian government, and the invention of paper."
        >
          <TimelineCard entries={HAN_TIMELINE} />
          <InsightGrid items={HAN_INSIGHTS} />
          <InventionsCallout />
        </SectionWrapper>

        {/* ── Period of Division ───────────────────────────────────────── */}
        <SectionWrapper
          id="division"
          icon="⚡"
          title="Period of Division (220–589 CE)"
          accentColor={STONE}
          intro="Four centuries of fragmentation, warfare, and cultural transformation. The Han empire shattered — but from the chaos came the spread of Buddhism and the seeds of a new, richer Chinese civilization."
        >
          <InsightGrid items={DIVISION_INSIGHTS} />
        </SectionWrapper>

        {/* ── Tang Dynasty ────────────────────────────────────────────── */}
        <SectionWrapper
          id="tang"
          icon="🎭"
          title="Tang Dynasty (618–907 CE) — Cosmopolitan Golden Age"
          accentColor={GOLD}
          intro="The Tang was China at its most open and confident — a cosmopolitan empire where merchants, poets, and monks from across Asia mingled in the world's largest city. Poetry reached its zenith, block printing was invented, and a woman ruled as emperor."
        >
          <TimelineCard entries={TANG_TIMELINE} />
        </SectionWrapper>

        {/* ── Song Dynasty ────────────────────────────────────────────── */}
        <SectionWrapper
          id="song"
          icon="🔬"
          title="Song Dynasty (960–1279 CE) — Economic & Technological Revolution"
          accentColor={TEAL}
          intro="The Song may be the most underrated dynasty in world history. Paper money, gunpowder weapons, compass navigation, a population of 100 million, and cities more modern than anything in contemporary Europe."
        >
          <InsightGrid items={SONG_INSIGHTS} />
        </SectionWrapper>

        {/* ── Yuan Dynasty ────────────────────────────────────────────── */}
        <SectionWrapper
          id="yuan"
          icon="🏇"
          title="Yuan Dynasty (1271–1368 CE) — Mongol Rule"
          accentColor={CRIMSON}
          intro="For the first time, China was ruled by outsiders. Kublai Khan's Mongol dynasty connected China to the vast Mongol Empire — but the Chinese never accepted foreign domination."
        >
          <InsightGrid items={YUAN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Ming Dynasty ────────────────────────────────────────────── */}
        <SectionWrapper
          id="ming"
          icon="🚢"
          title="Ming Dynasty (1368–1644 CE)"
          accentColor={BLUE}
          intro="The dynasty that rebuilt the Great Wall, sent massive treasure fleets across the Indian Ocean, built the Forbidden City — and then closed itself off from the world at the very moment Europe was opening up."
        >
          <TimelineCard entries={MING_TIMELINE} />
          <ZhengHeComparison />
        </SectionWrapper>

        {/* ── Qing Dynasty ────────────────────────────────────────────── */}
        <SectionWrapper
          id="qing"
          icon="👑"
          title="Qing Dynasty (1644–1912 CE) — Manchu Rule"
          accentColor={INDIGO}
          intro="China's last dynasty — the Manchu conquest, the empire's greatest territorial extent, and the traumatic collision with Western imperialism that ended 4,000 years of dynastic rule."
        >
          <TimelineCard entries={QING_TIMELINE} />
        </SectionWrapper>

        {/* ── Legacy ──────────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🌐"
          title="Legacy"
          accentColor={IMPERIAL_RED}
          intro="Four thousand years of dynastic history ended in 1912 — but the civilization that produced it continues to shape the modern world."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures"
          accentColor={GOLD}
          intro="The emperors, philosophers, poets, and admirals who shaped four millennia of Chinese history."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Connections ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="connections"
          icon="🔗"
          title="Explore Related Topics"
          accentColor={BLUE}
          intro="Chinese history intersects with civilizations across Asia and the world."
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
          <p style={{ color: SLATE, fontStyle: 'italic', maxWidth: 600, margin: '0 auto 16px' }}>
            "The empire, long divided, must unite; long united, must divide. Thus it has ever been."
            <br />
            <span style={{ fontSize: '0.85rem' }}>— Opening line of <em>Romance of the Three Kingdoms</em></span>
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
