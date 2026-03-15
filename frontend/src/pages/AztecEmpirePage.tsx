/**
 * AztecEmpirePage — comprehensive deep-dive on the Aztec Empire (~1300–1521).
 *
 * Route: /aztec-empire
 *
 * Sections:
 *  1. Hero — headline, key stats (Tenochtitlan 200k+, 5-6M subjects, Cortés's 508 soldiers)
 *  2. Origins & The Mexica — migration from Aztlan, founding of Tenochtitlan 1325
 *  3. Triple Alliance — Tenochtitlan + Texcoco + Tlacopan (1428)
 *  4. Tenochtitlan — city of 200,000+, chinampas, causeways, aqueducts
 *  5. Society & Class — tlatoani, nobles, warriors, pochteca, farmers, slaves
 *  6. Religion & Cosmology — five suns, Huitzilopochtli, Quetzalcoatl, Tlaloc, calendars
 *  7. Human Sacrifice — Templo Mayor, scale debates, flower wars
 *  8. Military & Conquest — Eagle/Jaguar knights, obsidian weapons, tributary empire
 *  9. Agriculture & Food — chocolate, corn, tomatoes, avocados, chili peppers
 * 10. Spanish Conquest — Cortés, Moctezuma II, La Noche Triste, smallpox, fall
 * 11. Legacy — Mexico City on Tenochtitlan, 1.5M Nahuatl speakers, culinary legacy
 * 12. Connection cards — links to related deep-dives
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const OBSIDIAN = '#1a1a2e';
const TURQUOISE = '#2dd4bf';
const TERRACOTTA = '#c2410c';
const GOLD = '#f59e0b';
const JADE = '#059669';
const CRIMSON = '#dc2626';
const BLOOD_RED = '#991b1b';
const SUN_ORANGE = '#ea580c';
const BLUE = '#3b82f6';
const TEAL = '#14b8a6';
const ASH = '#94a3b8';
const SLATE = '#64748b';
const AMBER = '#d97706';
const PURPLE = '#a855f7';
const ROSE = '#f43f5e';
const GREEN = '#22c55e';
const INDIGO = '#6366f1';
const CACAO = '#92400e';
const MAIZE = '#fbbf24';

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

// ── Origins & The Mexica ────────────────────────────────────────────────────

const ORIGINS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Aztlan — The Mythic Homeland',
    detail:
      'According to Aztec tradition, the Mexica people began their journey from Aztlan — "Place of the Herons" — a legendary island homeland somewhere to the north. Whether Aztlan was a real place or a mythological origin point remains debated by scholars. The migration story served as a founding narrative that unified the Mexica identity: they were a chosen people, guided by their patron god Huitzilopochtli, destined to build a great empire. The word "Aztec" itself derives from Aztlan, though the people called themselves Mexica — the origin of the word "Mexico."',
  },
  {
    label: 'Two Centuries of Wandering (~1100–1325)',
    detail:
      'The Mexica migration lasted roughly two centuries. They were not welcome. Arriving in the Valley of Mexico in the 13th century, they found the fertile lakeside lands already claimed by established city-states — Colhuacan, Azcapotzalco, Texcoco. The Mexica were considered barbarians, chichimeca ("dog people"), and were repeatedly driven from place to place. They served as mercenaries for more powerful states, earning a reputation as fierce but uncivilized warriors. This outsider status would fuel their ambition to dominate the very peoples who had rejected them.',
  },
  {
    label: 'The Eagle on the Cactus (1325)',
    detail:
      'Huitzilopochtli had told the Mexica to look for a sign: an eagle perched on a prickly pear cactus growing from a rock, devouring a serpent. According to legend, they found this sign on a small, marshy island in Lake Texcoco in 1325. There they founded Tenochtitlan — "Place of the Prickly Pear Cactus." The island location, while initially inhospitable, proved strategically brilliant: surrounded by water, it was easily defensible, and the lake provided fish, waterfowl, and — through the ingenious chinampa system — some of the most productive agricultural land in the Americas. That eagle-on-cactus image is on the Mexican flag today.',
  },
  {
    label: 'From Tributaries to Power Brokers',
    detail:
      'For the first century after founding Tenochtitlan, the Mexica were vassals of Azcapotzalco, the dominant power in the Valley of Mexico. They paid tribute, provided military service, and made strategic marriage alliances. They learned statecraft from their overlords. They adopted the Toltec cultural legacy — art, architecture, religious practices — to legitimize themselves as heirs to Mesoamerican civilization rather than upstart barbarians. By the early 1400s, the Mexica had grown powerful enough to challenge their masters. The stage was set for the Triple Alliance.',
  },
];

// ── Triple Alliance ─────────────────────────────────────────────────────────

const ALLIANCE_TIMELINE: TimelineEntry[] = [
  {
    year: '1426',
    title: 'Death of Chimalpopoca — The Spark',
    description:
      'The Mexica ruler Chimalpopoca was assassinated — likely on orders from Maxtla, the new ruler of Azcapotzalco, who saw the growing Mexica power as a threat. His death united the Mexica elite behind a bold plan: overthrow their overlords entirely. Itzcoatl, a seasoned warrior and political strategist, was chosen as the new tlatoani (ruler). His chief advisor was his nephew Tlacaelel, who would become the architect of Aztec imperial ideology.',
    color: CRIMSON,
  },
  {
    year: '1428',
    title: 'The Triple Alliance Formed',
    description:
      'Itzcoatl forged a military alliance with two other city-states chafing under Azcapotzalco\'s dominance: Texcoco (led by the brilliant poet-king Nezahualcoyotl) and Tlacopan. Together, they defeated Azcapotzalco in 1428 and destroyed it. The Triple Alliance — also called the "Aztec Empire" — divided the spoils: Tenochtitlan received 2/5 of all tribute, Texcoco 2/5, and Tlacopan 1/5. In practice, Tenochtitlan quickly became the dominant partner, and the "alliance" increasingly resembled an empire with one capital.',
    color: GOLD,
  },
  {
    year: '1428–1440',
    title: 'Tlacaelel Rewrites History',
    description:
      'After the victory, Tlacaelel — the power behind Itzcoatl\'s throne — ordered the burning of existing historical codices. He then commissioned new histories that recast the Mexica as the chosen people of Huitzilopochtli, destined to rule. He elevated human sacrifice from a Mesoamerican practice to an imperial ideology: the sun required human blood to rise each day, and it was the Mexica\'s sacred duty to provide it. This deliberate rewriting of history and theology created the ideological framework that justified Aztec expansion for the next 90 years.',
    color: TERRACOTTA,
  },
  {
    year: '1440–1469',
    title: 'Moctezuma I — The Empire Expands',
    description:
      'Under Moctezuma I (not to be confused with Moctezuma II, who faced Cortés), the Aztec Empire expanded dramatically. He conquered the Huastec and Totonac peoples to the east, pushed south into Oaxaca, and established the "Flower Wars" — ritualized battles with unconquered neighbors like Tlaxcala, ostensibly to capture warriors for sacrifice. He also built the first great aqueduct to bring fresh water to Tenochtitlan and expanded the Templo Mayor. The empire now controlled much of central Mexico.',
    color: JADE,
  },
  {
    year: '1502–1520',
    title: 'Moctezuma II — Zenith and Crisis',
    description:
      'By the time Moctezuma II took power in 1502, the Aztec Empire controlled 5–6 million people across 500+ tributary states spanning from the Gulf of Mexico to the Pacific. Tenochtitlan was a city of 200,000–300,000 — larger than any European city at the time (London had roughly 50,000). But the empire was fragile: it ruled through fear and tribute extraction, not incorporation. Conquered peoples hated the Mexica. When Cortés arrived in 1519, he would find no shortage of allies eager to destroy Tenochtitlan.',
    color: BLUE,
  },
];

// ── Tenochtitlan ────────────────────────────────────────────────────────────

const TENOCHTITLAN_INSIGHTS: InsightEntry[] = [
  {
    label: 'A City on Water',
    detail:
      'Tenochtitlan was built on an island in Lake Texcoco, connected to the mainland by three massive causeways — each wide enough for eight horsemen to ride abreast. The causeways had removable bridges that could be destroyed to defend the city (as the Spanish learned during La Noche Triste). A 16-kilometer aqueduct brought fresh water from springs at Chapultepec. The city was crisscrossed by canals — the "Venice of the New World" — with canoes serving as the primary transportation. When Cortés\'s soldiers first saw it from the mountains above, they thought they were dreaming.',
  },
  {
    label: 'Chinampas — Floating Gardens',
    detail:
      'The Aztecs fed their enormous city with chinampas — artificial agricultural islands created by layering mud, vegetation, and lake sediment in shallow lake areas, then anchoring them with willow trees. These "floating gardens" (they didn\'t actually float) were extraordinarily productive: chinampas could yield up to seven harvests per year, compared to one or two for European farmland. A single chinampa could feed 20 people. The system supported the densest population in the pre-Columbian Americas and remained in use until the Spanish drained Lake Texcoco. A few chinampas survive today in Xochimilco, now a UNESCO World Heritage Site.',
  },
  {
    label: 'The Great Market of Tlatelolco',
    detail:
      'The market at Tlatelolco (Tenochtitlan\'s sister city on a neighboring island, later absorbed) was the largest in the Americas and possibly the world. Spanish conquistador Bernal Díaz del Castillo wrote that 60,000 people traded there daily — more than any market in Europe. You could buy everything: jade, gold, chocolate, feathers, obsidian blades, jaguar skins, slaves, live animals, medicines, dyes, pottery, cotton cloth. Prices were set in cacao beans (the standard currency) and specialized judges patrolled the market to settle disputes and punish cheaters. Cortés himself admitted he had never seen anything like it.',
  },
  {
    label: 'Urban Planning and Sanitation',
    detail:
      'Tenochtitlan was one of the best-planned cities in the world. Streets were laid out on a grid aligned with cardinal directions. Fresh water was separated from saltwater by dikes — a massive engineering project directed by Nezahualcoyotl of Texcoco. Human waste was collected by canoe and used as fertilizer on chinampas (an early recycling system). Streets were swept daily by a workforce of 1,000 cleaners. Public latrines dotted the causeways. When the Spanish arrived in 1519, Tenochtitlan was cleaner than any city in Europe — where raw sewage ran through the streets and plague was a regular visitor.',
  },
  {
    label: 'The Sacred Precinct',
    detail:
      'At the heart of Tenochtitlan stood the Sacred Precinct — a walled compound containing the Templo Mayor (the Great Temple), dozens of smaller temples, a ball court, priests\' quarters, and an enormous skull rack (tzompantli). The Templo Mayor was a 60-meter-tall double pyramid with twin temples at the summit: one painted blue for Tlaloc (rain god) and one painted red for Huitzilopochtli (sun and war god). It was rebuilt and expanded seven times, each time over the previous structure. In 1978, electrical workers accidentally discovered the Templo Mayor\'s remains beneath downtown Mexico City, launching one of the most important archaeological projects in the Americas.',
  },
];

// ── Society & Class ─────────────────────────────────────────────────────────

const SOCIETY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Tlatoani — The Speaker Who Rules',
    detail:
      'The Aztec emperor was called the Huey Tlatoani — "Great Speaker." Despite the title, this was not a democracy: the tlatoani held absolute power over life, death, and the empire\'s direction. He was chosen by a council of nobles from the royal lineage, not by birth order — meaning the most capable (or best-connected) candidate was selected. The tlatoani was considered semi-divine: commoners were forbidden to look at him or touch the ground he walked on. He ate behind a screen, communicated through intermediaries, and was carried on a litter. Upon death, some of his servants were sacrificed to serve him in the afterlife.',
  },
  {
    label: 'Nobles (Pipiltin) and Commoners (Macehualtin)',
    detail:
      'Aztec society was rigidly stratified. The pipiltin (nobles) owned land, held government and military offices, attended elite schools (calmecac), and wore distinctive clothing — including cotton garments and jade jewelry forbidden to commoners. The macehualtin (commoners) formed the bulk of society: they farmed communal lands (calpulli), served as soldiers, and attended local schools (telpochcalli). Social mobility was possible but rare: a commoner who captured enemies in battle could earn noble privileges. Clothing laws (sumptuary laws) enforced visible class boundaries — wearing the wrong fabric could mean death.',
  },
  {
    label: 'Pochteca — The Merchant-Spies',
    detail:
      'The pochteca were long-distance merchants who formed a powerful, semi-independent class. They organized caravans that traveled hundreds of miles to trade luxury goods: quetzal feathers from Guatemala, jade from Oaxaca, cacao from the Gulf Coast, turquoise from the north. But they were also intelligence agents: pochteca traveling through unconquered territories reported on military defenses, political situations, and economic resources. Many Aztec conquests were preceded by pochteca reconnaissance missions. They had their own courts, their own god (Yacatecuhtli), and enough wealth to rival nobles — though they were careful to hide their riches to avoid jealousy.',
  },
  {
    label: 'Slavery — Different from European Models',
    detail:
      'Aztec slavery (tlacotin) was fundamentally different from the chattel slavery later practiced in the Americas. Slaves retained legal rights: they could own property, marry free people, and their children were born free. People became slaves through debt, criminal punishment, or voluntary self-sale during famine. Slaves could buy their freedom. A slave who escaped and reached the tlatoani\'s palace was automatically freed. Masters who mistreated slaves could have them taken away. The system functioned more like indentured servitude than the brutal, hereditary, race-based slavery of the colonial period.',
  },
];

// ── Religion & Cosmology ────────────────────────────────────────────────────

const RELIGION_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Five Suns — A World Destroyed Four Times',
    detail:
      'Aztec cosmology held that the current world was the fifth in a series of creations and destructions. Each previous "sun" (world-age) was ruled by a different god and ended in catastrophe: the first sun was destroyed by jaguars, the second by hurricanes, the third by a rain of fire, and the fourth by a great flood. The current Fifth Sun was created when the god Nanahuatzin sacrificed himself by leaping into a fire at Teotihuacan to become the sun. But the Fifth Sun was fragile — it required human blood to keep moving across the sky. Without sacrifice, the sun would stop, and the world would end. This belief was the theological engine driving Aztec human sacrifice.',
  },
  {
    label: 'Huitzilopochtli — The Hummingbird of the South',
    detail:
      'Huitzilopochtli, the Mexica\'s patron god, was the deity of sun and war. According to myth, he was born fully armed from his mother Coatlicue and immediately defeated his 400 siblings (the stars) and his sister Coyolxauhqui (the moon) — re-enacting the daily battle between sun and darkness. Every sunrise was Huitzilopochtli\'s victory; every sunset was his death. Human sacrifice at the Templo Mayor was understood as feeding Huitzilopochtli the blood he needed to rise again. His temple — painted blood-red — sat atop the Templo Mayor, the symbolic center of the universe.',
  },
  {
    label: 'Quetzalcoatl — The Feathered Serpent',
    detail:
      'Quetzalcoatl — "Feathered Serpent" — was one of the oldest gods in Mesoamerica, worshipped long before the Aztecs. He was associated with wind, learning, priesthood, and the morning star. Aztec tradition held that the god-king Quetzalcoatl (or his priest) had been exiled from the Toltec capital of Tula and had sailed east across the sea, promising to return. This legend has often been cited as the reason Moctezuma II hesitated when Cortés arrived from the east — though modern scholars debate whether Moctezuma actually believed Cortés was Quetzalcoatl or whether this was a post-conquest narrative imposed by Spanish chroniclers.',
  },
  {
    label: 'Tlaloc — The Rain Who Demanded Children',
    detail:
      'Tlaloc, the rain god, was arguably more important to daily survival than even Huitzilopochtli — without rain, the crops died. Tlaloc\'s temple sat alongside Huitzilopochtli\'s atop the Templo Mayor. His sacrificial demands were uniquely disturbing even by Aztec standards: he required the sacrifice of children, whose tears were believed to bring rain. Spanish sources — and Aztec ones — describe children being made to cry before sacrifice. Tlaloc\'s paradise, Tlalocan, was reserved for those who died by drowning, lightning, or water-related diseases. His cult was ancient, predating the Aztecs by centuries.',
  },
  {
    label: 'Two Calendars, One System',
    detail:
      'The Aztecs used two interlocking calendars. The xiuhpohualli (365-day solar calendar) organized the agricultural year into 18 months of 20 days, plus 5 "unlucky" days (nemontemi) at year\'s end. The tonalpohualli (260-day ritual calendar) combined 20 day signs with 13 numbers to create 260 unique day combinations — each with its own religious significance, governing everything from when to go to war to what a child\'s fate would be. The two calendars aligned every 52 years in the "Calendar Round," an event of enormous religious significance marked by the New Fire Ceremony — when all fires in the empire were extinguished and relit from a single flame on a sacrificial victim\'s chest.',
  },
];

// ── Human Sacrifice ─────────────────────────────────────────────────────────

const SACRIFICE_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Templo Mayor — Center of the Universe',
    detail:
      'Human sacrifice at the Templo Mayor was a public, political, and religious spectacle. Victims — usually captured warriors — were led up the steep steps of the pyramid. At the summit, a priest cut open the victim\'s chest with an obsidian knife and tore out the still-beating heart, offering it to the sun. The body was thrown down the steps. The skull was often displayed on the tzompantli (skull rack). In 2015, archaeologists discovered a massive tzompantli near the Templo Mayor ruins in Mexico City containing thousands of skulls — confirming that the practice operated at a scale even larger than some scholars had previously accepted.',
  },
  {
    label: 'Scale — The Numbers Debate',
    detail:
      'How many people did the Aztecs sacrifice? This remains one of the most contentious debates in Mesoamerican studies. Spanish sources — possibly exaggerating to justify conquest — claimed 20,000 victims at the dedication of the expanded Templo Mayor in 1487. Modern estimates vary wildly: serious scholars have proposed figures ranging from 1,000 to 20,000 per year across the empire. The archaeological discovery of the Huei Tzompantli skull rack in 2017 — containing at least 600 skulls, including women and children, not just warriors — complicated earlier theories. Whatever the exact number, human sacrifice was central to Aztec statecraft, not marginal.',
  },
  {
    label: 'Flower Wars (Xochiyaoyotl)',
    detail:
      'The "Flower Wars" were ritualized battles between the Aztec Triple Alliance and unconquered neighbors — particularly Tlaxcala, Huejotzingo, and Cholula. Officially, their purpose was to capture warriors for sacrifice and to provide military training. But scholars debate whether they were truly ritualized or simply wars the Aztecs couldn\'t win. Tlaxcala, completely surrounded by Aztec territory, was never conquered despite decades of Flower Wars. When Cortés arrived, the Tlaxcalans became his most crucial allies — providing thousands of warriors who fought alongside the Spanish to destroy Tenochtitlan. The Flower Wars may have been the Aztecs\' greatest strategic miscalculation.',
  },
  {
    label: 'Political Theater and Terror',
    detail:
      'Human sacrifice served political purposes as powerfully as religious ones. Foreign rulers and ambassadors were invited — sometimes compelled — to attend sacrificial ceremonies. Watching thousands of captives die was a message: resist the Aztec Empire, and this is your fate. The 1487 Templo Mayor dedication, where sacrifice continued for four days, was attended by rulers from across Mesoamerica, including enemies. It was state terrorism dressed in religious ceremony — and it worked. Many states chose tribute and submission over the risk of having their warriors\' hearts cut out on the Templo Mayor. But it also bred a deep, abiding hatred that Cortés would exploit.',
  },
];

// ── Military & Conquest ─────────────────────────────────────────────────────

const MILITARY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Eagle Warriors and Jaguar Knights',
    detail:
      'The Aztec military\'s elite were organized into two legendary warrior orders: the Eagle Warriors (cuāuhtli) and Jaguar Knights (ocēlōtl). Eagle Warriors wore feathered helmets shaped like eagle heads; Jaguar Knights wore suits of jaguar skin. To join either order, a warrior had to capture at least four enemies in battle — a feat that required extraordinary skill and courage. These were not just military units but social institutions with their own temples, ceremonies, and privileges. Eagle Warriors were associated with the sun; Jaguar Knights with the earth and night. Together they represented the dual forces that powered the Aztec universe.',
  },
  {
    label: 'Obsidian — Sharper Than Steel',
    detail:
      'The Aztecs\' primary weapon was the macuahuitl — a wooden club embedded with razor-sharp obsidian blades. Obsidian can be knapped to an edge only a few molecules thick — literally sharper than a modern surgical scalpel. Spanish accounts describe macuahuitl cutting the heads off horses in a single blow. The Aztecs also used atlatl (spear-throwers), bows, slings, and obsidian-tipped javelins. What they lacked was metal weapons and armor, horses, and gunpowder — disadvantages that would prove decisive against the Spanish. But in Mesoamerican warfare, where the goal was capturing enemies alive rather than killing them, Aztec weapons were devastatingly effective.',
  },
  {
    label: 'A Tributary Empire, Not a Territorial One',
    detail:
      'The Aztec Empire was fundamentally different from European empires. The Aztecs did not occupy conquered territories, install governors, or impose their language and culture. Instead, they demanded tribute: gold, jade, feathers, cotton, cacao, rubber, food, and — crucially — sacrificial victims. Conquered states kept their local rulers, their own gods, and their own customs, as long as tribute flowed. This made the empire cheap to run but fragile: there was no loyalty, no integration, no shared identity. Subject peoples were waiting for any opportunity to revolt. When that opportunity arrived in the form of Hernán Cortés, hundreds of thousands of indigenous warriors joined him.',
  },
  {
    label: 'The Scale of Aztec Power',
    detail:
      'At its height under Moctezuma II, the Aztec Empire encompassed roughly 500 tributary states and 5–6 million subjects across 200,000 square kilometers of central Mexico — from the Gulf of Mexico to the Pacific, from the arid north to the tropical south. The empire collected an staggering volume of tribute: annual shipments included 7,000 tons of maize, 4,000 tons of beans, 2 million cotton cloaks, vast quantities of cacao, gold dust, jade, and feathers. This wealth made Tenochtitlan the richest city in the Americas and funded the monumental architecture, massive ceremonies, and military campaigns that sustained Aztec power.',
  },
];

// ── Agriculture & Food ──────────────────────────────────────────────────────

const FOOD_INSIGHTS: InsightEntry[] = [
  {
    label: 'Chocolate (Xocolātl) — Drink of the Gods',
    detail:
      'The Aztecs didn\'t eat chocolate — they drank it, cold, mixed with chili peppers, vanilla, and sometimes maize. Xocolātl ("bitter water") was a luxury reserved for nobles, warriors, and ceremonies. Cacao beans were so valuable they served as currency: a turkey cost 100 beans, an avocado 3 beans, a tomato 1 bean. Moctezuma II reportedly drank 50 cups of xocolātl daily from gold goblets, which were then thrown away. When the Spanish brought cacao to Europe and added sugar, they created one of the world\'s most beloved foods. The $130 billion global chocolate industry traces directly to the Aztec cacao tradition.',
  },
  {
    label: 'Maize (Corn) — The Foundation of Civilization',
    detail:
      'Maize wasn\'t just food — it was sacred. Aztec creation myths held that humans were literally made from maize dough. The corn god Centeotl was among the most important deities. Mesoamerican peoples had domesticated maize from wild teosinte over thousands of years, transforming a scrawny grass into the world\'s most productive grain. The Aztecs consumed maize as tortillas, tamales, atole (a hot drink), and dozens of other preparations. Today, corn is the most produced crop on Earth — 1.15 billion metric tons annually — and every kernel descends from the Mesoamerican original. Without Aztec and broader Mesoamerican agriculture, the modern world doesn\'t eat.',
  },
  {
    label: 'Tomatoes, Avocados, and Chili Peppers',
    detail:
      'Italian cuisine without tomatoes. Thai food without chili peppers. California without avocados. Before 1492, all of these foods existed only in the Americas. The Aztecs cultivated tomatl (tomato), ahuacatl (avocado — the word means "testicle," referring to the fruit\'s shape on the tree), and chīlli (chili pepper) as staples. The Columbian Exchange carried them to Europe, Asia, and Africa, where they transformed every cuisine they touched. The Aztec dish combining tomatoes, chili peppers, and avocado — recognizable as salsa and guacamole — is now eaten on every continent. The global chili pepper market alone is worth over $3 billion annually.',
  },
  {
    label: 'Vanilla, Squash, and the Aztec Diet',
    detail:
      'The Aztec contribution to world cuisine extends beyond the famous trio. Vanilla (tlilxochitl — "black flower") was used to flavor xocolātl and is now the world\'s most popular flavor. Various squashes (including pumpkins and zucchini), beans, amaranth, chia seeds, and turkey were all Aztec staples. The Aztec diet was remarkably nutritious: the combination of maize and beans provides complete protein, chinampas supplied fresh vegetables year-round, and the lake provided fish and spirulina (a protein-rich algae the Aztecs harvested as "tecuitlatl"). Ironically, the average Aztec commoner may have been better nourished than the average European peasant of the same era.',
  },
];

// ── Spanish Conquest ────────────────────────────────────────────────────────

const CONQUEST_TIMELINE: TimelineEntry[] = [
  {
    year: 'February 1519',
    title: 'Cortés Lands at Cozumel',
    description:
      'Hernán Cortés — a 34-year-old minor nobleman, law school dropout, and failed farmer from Extremadura, Spain — sailed from Cuba with 11 ships, 508 soldiers, 16 horses, 13 muskets, and a few small cannons. He had been sent to explore and trade, not to conquer. But Cortés was driven by ambition, debt, and the hunger for gold. He burned his ships (or scuttled them — accounts differ) to prevent his men from retreating. He also acquired two interpreters who would prove more valuable than any weapon: Gerónimo de Aguilar (a shipwrecked Spaniard who spoke Mayan) and La Malinche (a Nahua woman who spoke both Mayan and Nahuatl). Communication would be Cortés\'s greatest advantage.',
    color: BLUE,
  },
  {
    year: 'September 1519',
    title: 'The Tlaxcalan Alliance',
    description:
      'After defeating the Tlaxcalans in battle, Cortés achieved his masterstroke: instead of demanding submission, he offered alliance. The Tlaxcalans — who had been locked in decades of Flower Wars with the Aztecs, surrounded by Aztec territory, denied salt and cotton by Aztec blockades — eagerly agreed. This was not a case of 508 Spaniards conquering millions. The conquest of the Aztec Empire was fundamentally an indigenous civil war in which the Spanish served as a catalyst. Tlaxcala eventually provided tens of thousands of warriors who did much of the actual fighting. Without the Tlaxcalans, Cortés would have died in the mountains.',
    color: JADE,
  },
  {
    year: 'November 8, 1519',
    title: 'Cortés Meets Moctezuma II',
    description:
      'Cortés and his army — now swelled by thousands of indigenous allies — marched down the great causeway into Tenochtitlan. Moctezuma II met them at the city gates with an elaborate welcome ceremony. Why didn\'t Moctezuma destroy the Spanish on the causeway, where they were utterly vulnerable? Historians have debated this for 500 years. Was he paralyzed by the Quetzalcoatl legend? Was he following diplomatic protocol? Was he gathering intelligence? Whatever the reason, Moctezuma\'s hospitality was a catastrophic miscalculation. Within days, Cortés had effectively taken him hostage in his own palace.',
    color: GOLD,
  },
  {
    year: 'June 30, 1520',
    title: 'La Noche Triste — The Night of Sorrows',
    description:
      'After months of rising tension — including the massacre at the Festival of Toxcatl by Pedro de Alvarado — the people of Tenochtitlan rose in revolt. Moctezuma was killed (either by Spanish hands or stones thrown by his own people — accounts conflict). Cortés ordered a nighttime retreat across the causeway. It was a disaster. Aztec warriors attacked from canoes, the bridges had been removed, and the causeway became a killing ground. The Spanish lost 600 soldiers, thousands of Tlaxcalan allies, most of their horses, and all their cannons and gold. Cortés reportedly wept under a cypress tree. But he survived — and he would return.',
    color: CRIMSON,
  },
  {
    year: '1520–1521',
    title: 'Smallpox — The Invisible Conqueror',
    description:
      'While Cortés retreated to Tlaxcala and rebuilt his forces, an invisible ally was doing more damage than any army could. Smallpox — brought to Mexico by an infected African slave in Pánfilo de Narváez\'s expedition — swept through Tenochtitlan with apocalyptic fury. The Aztecs had zero immunity. Cuitláhuac, Moctezuma\'s successor as tlatoani, died of smallpox after ruling only 80 days. An estimated 40% of Tenochtitlan\'s population died in the epidemic. The disease killed indiscriminately: warriors, priests, leaders, children. By the time Cortés returned, the city was already a charnel house. Over the next century, European diseases would kill an estimated 50–90% of the indigenous population of the Americas — one of the greatest demographic catastrophes in human history.',
    color: BLOOD_RED,
  },
  {
    year: 'August 13, 1521',
    title: 'The Fall of Tenochtitlan',
    description:
      'Cortés returned with a carefully planned siege: he built 13 brigantines (small warships) and launched them on Lake Texcoco, cutting off the city\'s food and water supply. His army now numbered perhaps 900 Spanish soldiers and 75,000–200,000 indigenous allies — Tlaxcalans, Texcocans, Totonacs, and others who saw a chance to destroy their hated overlords. The siege lasted 75 days. The defenders, led by the last tlatoani Cuauhtémoc, fought house by house. But starvation, smallpox, and overwhelming numbers made the outcome inevitable. On August 13, 1521, Cuauhtémoc was captured. Tenochtitlan — once the greatest city in the Americas — lay in ruins. Cortés built Mexico City directly on top of it.',
    color: TERRACOTTA,
  },
];

// ── Legacy ──────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Mexico City — Built on Tenochtitlan',
    detail:
      'Mexico City sits directly on the ruins of Tenochtitlan. The cathedral stands where the Templo Mayor once stood. Every construction project in the historic center uncovers Aztec artifacts. The city sinks several centimeters per year because it\'s built on the soft lake bed that once supported the Aztec capital. In 1978, a chance discovery of the Coyolxauhqui stone led to the excavation of the Templo Mayor, now a major archaeological site and museum in the heart of Mexico City. Modern Mexico is literally built on Aztec foundations — architecturally, culturally, and symbolically.',
  },
  {
    label: '1.5 Million Nahuatl Speakers Today',
    detail:
      'The Aztec language, Nahuatl, is not dead. Approximately 1.5 million people in Mexico still speak it as their primary language — more than speak Irish, Welsh, or Basque. Nahuatl words permeate global languages: chocolate, tomato, avocado, coyote, chili — all come from Nahuatl. The Mexican government has made efforts to preserve and revitalize the language, though speakers still face discrimination and economic marginalization. Nahuatl poetry and literature are experiencing a renaissance, with contemporary poets writing in the language of the Aztecs.',
  },
  {
    label: 'Culinary Legacy — Flavors That Conquered the World',
    detail:
      'The Aztec culinary legacy may be their most profound global impact. Chocolate, corn, tomatoes, avocados, chili peppers, vanilla, squash, and dozens of other foods from the Aztec diet are now foundational to cuisines worldwide. Italian marinara sauce, Indian curry, Thai stir-fry, American barbecue — none would exist in their current form without Aztec-cultivated ingredients. Mexican cuisine itself — recognized by UNESCO as an Intangible Cultural Heritage of Humanity — preserves Aztec cooking techniques, ingredients, and flavor profiles that are 500+ years old. Every time you eat guacamole, you\'re eating Aztec food.',
  },
  {
    label: 'National Identity and the Eagle on the Flag',
    detail:
      'Modern Mexico\'s relationship with its Aztec past is complex and central to national identity. The eagle on the cactus from the Tenochtitlan founding myth adorns the Mexican flag and coat of arms. Aztec imagery pervades Mexican art, architecture, and public spaces. The last tlatoani, Cuauhtémoc, is celebrated as a national hero of resistance — while Cortés and especially La Malinche (Malintzin) remain controversial figures. The ideology of mestizaje — the blending of indigenous and Spanish heritage — positions the Aztec past as the foundation upon which Mexican civilization was built, not something that was merely conquered and destroyed.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Moctezuma II',
    years: 'r. 1502–1520',
    contribution:
      'The ninth tlatoani of Tenochtitlan who presided over the empire at its zenith. His fateful decision to welcome Cortés into the capital — rather than destroying the Spanish on the causeway — remains one of history\'s most debated choices. Killed during the Aztec revolt against Spanish occupation.',
  },
  {
    name: 'Hernán Cortés',
    years: '1485–1547',
    contribution:
      'The Spanish conquistador who destroyed the Aztec Empire with 508 soldiers, brilliant diplomacy, indigenous allies, and devastating luck. A master of alliance-building who exploited Aztec political fractures. Rewarded with wealth and a title, he died in Spain relatively forgotten.',
  },
  {
    name: 'La Malinche (Malintzin)',
    years: 'c. 1500–1529',
    contribution:
      'A Nahua woman given to Cortés as a slave who became his interpreter, advisor, and consort. Her fluency in Nahuatl and Mayan made Spanish-Aztec communication possible. Without her, the conquest may not have succeeded. Celebrated and vilified in equal measure in Mexican culture.',
  },
  {
    name: 'Cuauhtémoc',
    years: 'c. 1497–1525',
    contribution:
      'The last tlatoani of Tenochtitlan who led the desperate defense of the city during the 75-day siege. Captured on August 13, 1521. Tortured by the Spanish to reveal the location of hidden gold. Later executed by Cortés. Revered as a symbol of indigenous resistance in modern Mexico.',
  },
  {
    name: 'Tlacaelel',
    years: 'c. 1397–1487',
    contribution:
      'The power behind the throne for three tlatoani. Architect of Aztec imperial ideology: he burned the old histories, rewrote Mexica origins as divine destiny, and elevated human sacrifice from ritual practice to state policy. Arguably the most important figure in Aztec history.',
  },
  {
    name: 'Nezahualcoyotl',
    years: '1402–1472',
    contribution:
      'Philosopher-king of Texcoco and co-founder of the Triple Alliance. Renowned as a poet, lawgiver, and engineer — he designed the great dike that separated fresh and salt water in Lake Texcoco. His poetry questioning the nature of existence and the divine survives today.',
  },
];

// ── Connection cards ────────────────────────────────────────────────────────

interface ConnectionCard {
  title: string;
  path: string;
  description: string;
  color: string;
}

const CONNECTIONS: ConnectionCard[] = [
  {
    title: 'Ancient India',
    path: '/ancient-india',
    description: 'Another great civilization that combined monumental architecture, complex religion, and advanced agriculture — compare the caste system to Aztec social hierarchy.',
    color: AMBER,
  },
  {
    title: 'The Mongol Empire',
    path: '/mongol-empire',
    description: 'A conquest empire built on military innovation and terror — like the Aztecs, the Mongols ruled through fear and tribute rather than cultural integration.',
    color: CRIMSON,
  },
  {
    title: 'Age of Exploration',
    path: '/age-of-exploration',
    description: 'The maritime expansion that brought Cortés to Mexico — the broader context of European colonialism that destroyed the Aztec world.',
    color: BLUE,
  },
  {
    title: 'The Renaissance',
    path: '/renaissance',
    description: 'While Aztecs built Tenochtitlan, Europeans were rediscovering classical learning — two civilizations advancing in parallel, about to collide.',
    color: PURPLE,
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

const FIGURE_COLORS = [JADE, GOLD, TERRACOTTA, BLUE, CRIMSON, TURQUOISE, SUN_ORANGE, PURPLE, TEAL, AMBER];

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
// Hero stats callout
// ─────────────────────────────────────────────────────────────────────────────

interface StatEntry {
  value: string;
  label: string;
  color: string;
}

const HERO_STATS: StatEntry[] = [
  { value: '200,000–300,000', label: 'Tenochtitlan population (London: ~50,000)', color: TURQUOISE },
  { value: '5–6 million', label: 'subjects at empire\'s peak', color: GOLD },
  { value: '508', label: 'soldiers Cortés brought to Mexico', color: CRIMSON },
  { value: '50–90%', label: 'indigenous population killed by disease', color: BLOOD_RED },
  { value: '1.5 million', label: 'Nahuatl speakers today', color: JADE },
];

function StatsBar({ stats }: { stats: StatEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 14,
        marginTop: 28,
        marginBottom: 8,
      }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: `1px solid ${s.color}44`,
            borderRadius: 10,
            padding: '14px 16px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: s.color, fontWeight: 700, fontSize: '1.3rem', marginBottom: 4 }}>
            {s.value}
          </p>
          <p style={{ color: SLATE, fontSize: '0.78rem', lineHeight: 1.4 }}>
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Foods callout
// ─────────────────────────────────────────────────────────────────────────────

interface FoodItem {
  emoji: string;
  name: string;
  nahuatl: string;
  impact: string;
  color: string;
}

const FOODS_THAT_CHANGED_THE_WORLD: FoodItem[] = [
  { emoji: '\ud83c\udf6b', name: 'Chocolate', nahuatl: 'xocolātl', impact: '$130B global industry', color: CACAO },
  { emoji: '\ud83c\udf3d', name: 'Corn (Maize)', nahuatl: 'cintli', impact: 'Most produced crop on Earth', color: MAIZE },
  { emoji: '\ud83c\udf45', name: 'Tomato', nahuatl: 'tomatl', impact: 'Foundation of Italian, Indian cuisine', color: CRIMSON },
  { emoji: '\ud83e\udd51', name: 'Avocado', nahuatl: 'ahuacatl', impact: '$14B+ annual market', color: JADE },
  { emoji: '\ud83c\udf36\ufe0f', name: 'Chili Pepper', nahuatl: 'chīlli', impact: 'Transformed cuisines on every continent', color: SUN_ORANGE },
  { emoji: '\ud83c\udf3c', name: 'Vanilla', nahuatl: 'tlilxochitl', impact: 'World\'s most popular flavor', color: AMBER },
];

function FoodsCallout({ foods }: { foods: FoodItem[] }) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 24,
        marginTop: 8,
      }}
    >
      <h3
        style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          color: MAIZE,
          marginBottom: 18,
          textAlign: 'center',
        }}
      >
        Foods That Changed the World
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 14,
        }}
      >
        {foods.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${f.color}33`,
              borderRadius: 10,
              padding: '14px 16px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '1.8rem', marginBottom: 6 }}>{f.emoji}</p>
            <p style={{ color: f.color, fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>
              {f.name}
            </p>
            <p style={{ color: SLATE, fontSize: '0.75rem', fontStyle: 'italic', marginBottom: 6 }}>
              Nahuatl: {f.nahuatl}
            </p>
            <p style={{ color: ASH, fontSize: '0.8rem', lineHeight: 1.4 }}>
              {f.impact}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Connection cards component
// ─────────────────────────────────────────────────────────────────────────────

function ConnectionCards({ connections }: { connections: ConnectionCard[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16,
      }}
    >
      {connections.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
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
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${c.color}88`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${c.color}33`;
            }}
          >
            <h4
              style={{
                fontWeight: 600,
                color: c.color,
                marginBottom: 8,
                fontSize: '1.05rem',
              }}
            >
              {c.title} →
            </h4>
            <p style={{ color: ASH, lineHeight: 1.6, fontSize: '0.85rem' }}>
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

export default function AztecEmpirePage() {
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
              background: `linear-gradient(135deg, ${TERRACOTTA}, ${TURQUOISE})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Aztec Empire — Blood, Gold, and the City on the Lake (~1300–1521)
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
              In 1500 CE, the largest city in the Western Hemisphere sat on an
              island in a lake in central Mexico. Tenochtitlan — home to
              200,000–300,000 people — was bigger than London, Paris, or any
              city in Europe. It had running water, botanical gardens, a
              market where 60,000 people traded daily, and streets cleaner
              than anything in the Old World. Within 21 years, it would be
              destroyed — conquered by 508 Spanish soldiers, tens of thousands
              of indigenous allies, and a virus no one could see.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              This is the story of the Mexica people — how wandering refugees
              built an empire of 5–6 million subjects, created a civilization
              of staggering beauty and terrifying violence, gave the world
              chocolate, corn, tomatoes, and avocados, and were brought down
              in one of history's most dramatic collisions of worlds.
            </p>
          </motion.div>
          <StatsBar stats={HERO_STATS} />
        </header>

        {/* ── Origins & The Mexica ────────────────────────────────────── */}
        <SectionWrapper
          id="origins"
          icon="🦅"
          title="Origins & The Mexica — Wanderers Who Built an Empire (~1100–1428)"
          accentColor={TERRACOTTA}
          intro="The people we call 'Aztecs' called themselves Mexica. They arrived in the Valley of Mexico as despised outsiders — refugees, mercenaries, and squatters on the margins of established civilizations. Their founding myth — an eagle on a cactus, a god's command, a city on an island — is the origin story of modern Mexico itself."
        >
          <InsightGrid items={ORIGINS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Triple Alliance ────────────────────────────────────────── */}
        <SectionWrapper
          id="alliance"
          icon="🤝"
          title="The Triple Alliance — How Three Cities Built an Empire (1428)"
          accentColor={GOLD}
          intro="The 'Aztec Empire' was technically a triple alliance between three city-states: Tenochtitlan, Texcoco, and Tlacopan. In practice, it was Tenochtitlan's empire. The alliance was forged in revolution — a rebellion against the dominant power of Azcapotzalco — and immediately set about conquering everything within reach."
        >
          <TimelineCard entries={ALLIANCE_TIMELINE} />
        </SectionWrapper>

        {/* ── Tenochtitlan ───────────────────────────────────────────── */}
        <SectionWrapper
          id="tenochtitlan"
          icon="🏛️"
          title="Tenochtitlan — The Greatest City in the Americas"
          accentColor={TURQUOISE}
          intro="When Bernal Díaz del Castillo, a soldier in Cortés's army, first saw Tenochtitlan from the mountains above, he wrote: 'We were amazed and said that it was like the enchantments they tell of in the legend of Amadís... Some of our soldiers even asked whether the things that we saw were not a dream.' It wasn't a dream. It was the largest, most sophisticated city in the Western Hemisphere — and they were about to destroy it."
        >
          <InsightGrid items={TENOCHTITLAN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Society & Class ────────────────────────────────────────── */}
        <SectionWrapper
          id="society"
          icon="👑"
          title="Society & Class — From Tlatoani to Slave"
          accentColor={AMBER}
          intro="Aztec society was rigidly hierarchical — but not entirely static. A commoner who captured four enemies in battle could earn noble privileges. A noble who failed in war could lose them. The system balanced hereditary privilege with meritocratic advancement, sustained by elaborate sumptuary laws that made your social status visible in every garment you wore."
        >
          <InsightGrid items={SOCIETY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Religion & Cosmology ───────────────────────────────────── */}
        <SectionWrapper
          id="religion"
          icon="☀️"
          title="Religion & Cosmology — Five Suns and a Hungry Universe"
          accentColor={SUN_ORANGE}
          intro="The Aztec universe was beautiful, terrifying, and fragile. The world had been created and destroyed four times already. The current Fifth Sun survived only because the gods had sacrificed themselves to set it in motion — and it would continue to rise only if humans returned the favor. This cosmology made human sacrifice not cruelty but cosmic duty: the price of sunrise."
        >
          <InsightGrid items={RELIGION_INSIGHTS} />
        </SectionWrapper>

        {/* ── Human Sacrifice ────────────────────────────────────────── */}
        <SectionWrapper
          id="sacrifice"
          icon="💀"
          title="Human Sacrifice — The Heart of the Empire"
          accentColor={BLOOD_RED}
          intro="No aspect of Aztec civilization generates more debate, discomfort, and distortion than human sacrifice. It was real, it was large-scale, and it was central — not peripheral — to Aztec statecraft. It was also neither unique to the Aztecs nor as simple as 'bloodthirsty savages.' Scholars continue to debate the numbers, the motivations, and how much Spanish accounts exaggerated for political purposes."
        >
          <InsightGrid items={SACRIFICE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Military & Conquest ────────────────────────────────────── */}
        <SectionWrapper
          id="military"
          icon="⚔️"
          title="Military & Conquest — Eagle Knights, Jaguar Warriors, and Obsidian Blades"
          accentColor={JADE}
          intro="The Aztec military machine was one of the most effective in the pre-Columbian Americas. Its elite warrior orders — the Eagles and Jaguars — were among the most feared fighters in Mesoamerica. But the Aztecs fought to capture, not to kill, and their tributary empire was held together by terror rather than integration. Both of these facts would prove fatal when the Spanish arrived."
        >
          <InsightGrid items={MILITARY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Agriculture & Food ─────────────────────────────────────── */}
        <SectionWrapper
          id="food"
          icon="🌽"
          title="Agriculture & Food — The Aztec Pantry That Feeds the World"
          accentColor={MAIZE}
          intro="The Aztec Empire's most enduring legacy isn't its pyramids, its poetry, or its military conquests — it's what was on their plates. Chocolate, corn, tomatoes, avocados, chili peppers, vanilla: foods that are now so deeply embedded in global cuisine that we forget they all came from the same civilization."
        >
          <FoodsCallout foods={FOODS_THAT_CHANGED_THE_WORLD} />
          <div style={{ marginTop: 24 }}>
            <InsightGrid items={FOOD_INSIGHTS} />
          </div>
        </SectionWrapper>

        {/* ── Spanish Conquest ───────────────────────────────────────── */}
        <SectionWrapper
          id="conquest"
          icon="⚓"
          title="The Spanish Conquest — 508 Soldiers, 100,000 Allies, and One Virus (1519–1521)"
          accentColor={CRIMSON}
          intro="The fall of the Aztec Empire is often told as the story of Cortés's genius and Moctezuma's failure. The reality is more complex: the conquest was an indigenous civil war catalyzed by a handful of Spanish soldiers, enabled by devastating epidemics, and fueled by decades of Aztec oppression that turned subject peoples into willing accomplices in their overlords' destruction."
        >
          <TimelineCard entries={CONQUEST_TIMELINE} />
        </SectionWrapper>

        {/* ── Legacy ─────────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🇲🇽"
          title="Legacy — The Aztec World Lives On"
          accentColor={GREEN}
          intro="The Aztec Empire fell in 1521, but the Aztec world didn't disappear. Mexico City sits on Tenochtitlan's ruins. The Mexican flag bears the eagle on the cactus. 1.5 million people speak Nahuatl. And every time anyone on Earth eats chocolate, corn, tomatoes, or avocados, they're consuming the Aztec agricultural legacy."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures of the Aztec Empire"
          accentColor={GOLD}
          intro="From the visionary architect who invented Aztec imperial ideology to the last tlatoani who fought to the bitter end, these are the people who shaped — and were crushed by — the collision of two worlds."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Connections ────────────────────────────────────────────── */}
        <SectionWrapper
          id="connections"
          icon="🔗"
          title="Explore Connected Deep-Dives"
          accentColor={INDIGO}
          intro="The Aztec story connects to broader themes of empire, exploration, and cultural collision. Explore these related deep-dives to see the bigger picture."
        >
          <ConnectionCards connections={CONNECTIONS} />
        </SectionWrapper>

        {/* ── Footer ─────────────────────────────────────────────────── */}
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
            "Is it true that one lives on the earth? Not forever on earth, only
            a little while here. Though it be jade it will be broken, though
            it be gold it will be crushed."
            — Nezahualcoyotl, poet-king of Texcoco (c. 1430)
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
