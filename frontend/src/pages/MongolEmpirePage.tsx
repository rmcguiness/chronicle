/**
 * MongolEmpirePage — comprehensive deep-dive into the Mongol Empire (1206–1368).
 *
 * Sections (tab-navigated):
 *  1. Timeline & Phases
 *  2. Genghis Khan
 *  3. Military Tactics
 *  4. Major Conquests
 *  5. The Four Khanates
 *  6. Successors
 *  7. Pax Mongolica
 *  8. Governance
 *  9. Black Death Connection
 * 10. Legacy & Decline
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── colour palette ─── */
const ACCENT = '#b45309'; // steppe amber/gold
const colors = {
  bg: '#070e22',
  bgCard: 'rgba(255,255,255,0.04)',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  border: 'rgba(255,255,255,0.08)',
};

/* ─── types ─── */
type Tab =
  | 'timeline'
  | 'genghis'
  | 'military'
  | 'conquests'
  | 'khanates'
  | 'successors'
  | 'pax'
  | 'governance'
  | 'plague'
  | 'legacy';

interface Phase {
  name: string;
  period: string;
  summary: string;
  keyEvents: string[];
  color: string;
  icon: string;
}

interface MilitaryTactic {
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Conquest {
  name: string;
  period: string;
  casualties: string;
  significance: string;
  details: string;
  icon: string;
  color: string;
}

interface Khanate {
  name: string;
  territory: string;
  founder: string;
  period: string;
  keyRulers: string[];
  fate: string;
  color: string;
  icon: string;
}

interface Successor {
  name: string;
  title: string;
  reign: string;
  achievements: string[];
  icon: string;
  color: string;
}

interface LegacyItem {
  title: string;
  description: string;
  icon: string;
}

/* ─── data ─── */

const PHASES: Phase[] = [
  {
    name: 'Unification of the Mongol Tribes',
    period: '1180–1206',
    summary:
      'Temüjin, born into a minor noble family and orphaned young, spent decades forging alliances, defeating rivals, and uniting the fractious Mongol and Turkic steppe tribes. In 1206, a great kurultai (assembly) proclaimed him Genghis Khan — "Universal Ruler" — creating a single Mongol nation for the first time.',
    keyEvents: [
      'Temüjin born near Burkhan Khaldun (c. 1162)',
      'Father Yesügei poisoned by Tatars (c. 1171)',
      'Alliance with Toghrul of the Keraites (c. 1185)',
      'Defeat of the Merkits — rescue of Börte (c. 1184)',
      'Victory over Jamukha at Battle of Dalan Balzhut (1187)',
      'Defeat of the Naimans — unification complete (1204)',
      'Kurultai proclaims Temüjin as Genghis Khan (1206)',
    ],
    color: '#a16207',
    icon: '🐎',
  },
  {
    name: 'Expansion under Genghis Khan',
    period: '1206–1227',
    summary:
      'Genghis Khan unleashed the most devastating military campaigns in recorded history. He shattered the Western Xia and Jin dynasties in northern China, then turned west to annihilate the Khwarezmian Empire, leaving a trail of destroyed cities from Beijing to the Caspian Sea. His armies covered more territory in 25 years than the Romans conquered in 400.',
    keyEvents: [
      'Invasion of Western Xia begins (1209)',
      'Campaign against the Jin Dynasty (1211–1215)',
      'Fall of Zhongdu (Beijing) (1215)',
      'Destruction of the Khwarezmian Empire (1219–1221)',
      'Sack of Samarkand, Bukhara, Merv, Nishapur (1220–1221)',
      'Subutai and Jebe\'s reconnaissance raid into Russia and the Caucasus (1221–1223)',
      'Death of Genghis Khan during Western Xia campaign (1227)',
    ],
    color: '#dc2626',
    icon: '⚔️',
  },
  {
    name: 'Continued Expansion',
    period: '1227–1260',
    summary:
      'Under Ögedei, Güyük, and Möngke Khan, the empire reached its zenith. Mongol armies invaded Europe, destroyed the Abbasid Caliphate, and pushed deep into Southeast Asia. The empire stretched from Korea to Hungary — 24 million km² — making it the largest contiguous land empire ever.',
    keyEvents: [
      'Ögedei elected Great Khan (1229)',
      'Conquest of the Jin Dynasty completed (1234)',
      'Batu Khan\'s invasion of Kievan Rus (1237–1240)',
      'Battle of Legnica and Battle of Mohi in Europe (1241)',
      'Ögedei\'s death halts European campaign (1241)',
      'Möngke becomes Great Khan (1251)',
      'Hülegü destroys Baghdad — end of Abbasid Caliphate (1258)',
      'Battle of Ain Jalut — Mamluks defeat Mongols (1260)',
    ],
    color: '#7c3aed',
    icon: '🌍',
  },
  {
    name: 'The Four Khanates Era',
    period: '1260–1335',
    summary:
      'After Möngke Khan\'s death, the empire fractured into four largely independent khanates: the Yuan Dynasty in China, the Chagatai Khanate in Central Asia, the Ilkhanate in Persia, and the Golden Horde in Russia. Though nominally united, civil wars between Kublai and Ariq Böke ended real unity. The Pax Mongolica flourished as trade routes connected East and West.',
    keyEvents: [
      'Kublai Khan vs. Ariq Böke civil war (1260–1264)',
      'Kublai founds Yuan Dynasty in China (1271)',
      'Failed invasions of Japan — kamikaze storms (1274, 1281)',
      'Marco Polo arrives at Kublai\'s court (c. 1275)',
      'Fall of the Song Dynasty — China unified under Mongols (1279)',
      'Ilkhanate converts to Islam under Ghazan (1295)',
      'Death of Abu Said — Ilkhanate collapses (1335)',
    ],
    color: '#2563eb',
    icon: '🏛️',
  },
  {
    name: 'Decline and Dissolution',
    period: '1335–1368+',
    summary:
      'The Mongol khanates gradually disintegrated through plague, internal strife, assimilation into local cultures, and rebellion. The Black Death ravaged the Golden Horde and accelerated decline. In 1368, the Ming Dynasty expelled the Mongols from China, ending Yuan rule. The Chagatai Khanate fragmented, and the Golden Horde splintered into successor states over the next century.',
    keyEvents: [
      'Ilkhanate collapses (1335)',
      'Black Death spreads along Mongol trade routes (1340s)',
      'Red Turban Rebellion in China (1351)',
      'Ming Dynasty overthrows Yuan (1368)',
      'Timur (Tamerlane) claims Mongol legacy (1370s)',
      'Golden Horde defeated at Great Stand on the Ugra (1480)',
      'Last Chagatai remnants absorbed by 1680s',
    ],
    color: '#6b7280',
    icon: '🌅',
  },
];

const GENGHIS_ORIGIN = {
  birthName: 'Temüjin',
  birthYear: 'c. 1162',
  birthPlace: 'Khentii Mountains, Mongolia',
  deathYear: '1227',
  story: [
    {
      title: 'Abandoned and Outcast',
      text: 'Born into the Borjigin clan, Temüjin\'s father Yesügei was poisoned by rival Tatars when the boy was just nine. His clan abandoned the family, leaving Temüjin, his mother Hoelun, and his siblings to survive alone on the harsh Mongolian steppe. This crucible of hardship forged his iron will and deep loyalty to those who proved faithful.',
      icon: '👦',
    },
    {
      title: 'Forging Alliances',
      text: 'As a young man, Temüjin secured the patronage of Toghrul, khan of the Keraites, and befriended (then later defeated) his blood brother Jamukha. He learned that loyalty must be earned, not inherited — a principle that would reshape steppe society. He rescued his wife Börte from the Merkits, cementing his reputation as a decisive leader.',
      icon: '🤝',
    },
    {
      title: 'Uniting the Tribes',
      text: 'Through a combination of military brilliance, strategic marriages, and ruthless elimination of enemies, Temüjin systematically conquered or absorbed every major steppe confederation: the Merkits, Naimans, Tatars, and Keraites. He replaced tribal loyalty with loyalty to himself, promoting men by merit rather than birth — revolutionary for the feudal steppe.',
      icon: '🏹',
    },
    {
      title: 'Becoming Genghis Khan',
      text: 'In 1206, a grand kurultai on the banks of the Onon River proclaimed Temüjin as Genghis Khan — "Universal Ruler." He immediately reorganized all Mongol society into a decimal military system, codified the Yasa law code, and declared that the Eternal Blue Sky (Tengri) had given him a mandate to conquer the world. He was approximately 44 years old.',
      icon: '👑',
    },
    {
      title: 'World Conqueror',
      text: 'Over the next 21 years, Genghis Khan conquered more territory than any individual in history. His empire stretched from the Pacific Ocean to the Caspian Sea. He died in 1227 during a campaign against Western Xia, and his burial site remains unknown — legend says his funeral escort killed anyone they encountered to keep the location secret.',
      icon: '🌏',
    },
  ],
};

const MILITARY_TACTICS: MilitaryTactic[] = [
  {
    name: 'Horse Archery',
    description:
      'Every Mongol warrior was an expert mounted archer, trained from age 3 to ride and shoot. They could fire accurately at full gallop, shooting backwards (the "Parthian shot"), and each warrior carried 2–3 bows with 60+ arrows. Their composite bows had a range of 350+ meters, outranging most contemporary weapons.',
    icon: '🏇',
    color: '#b45309',
  },
  {
    name: 'Feigned Retreat (Mangudai)',
    description:
      'The Mongols\' most devastating tactic: a forward unit would engage the enemy then "flee" in apparent disorder, drawing pursuers into a stretched, disorganized chase. Hidden wings would then close in from flanks and rear, enveloping the enemy. This tactic destroyed armies at Legnica, Mohi, and dozens of other battles.',
    icon: '🔄',
    color: '#dc2626',
  },
  {
    name: 'Psychological Terror',
    description:
      'Genghis Khan weaponized fear itself. Cities that surrendered were spared; cities that resisted were destroyed utterly, with survivors sent ahead as refugees to spread panic. Pyramids of skulls were left as warnings. This strategy caused many cities to surrender without a fight, saving Mongol lives.',
    icon: '💀',
    color: '#7c3aed',
  },
  {
    name: 'Siege Warfare Mastery',
    description:
      'Despite being nomads, the Mongols became expert siege engineers by conscripting Chinese, Persian, and Arab engineers. They deployed trebuchets, gunpowder bombs, fire arrows, and even diverted rivers to flood cities. They reduced supposedly impregnable fortifications across the Islamic world and China.',
    icon: '🏰',
    color: '#0891b2',
  },
  {
    name: 'Decimal Unit System',
    description:
      'The army was organized into units of 10 (arban), 100 (jagun), 1,000 (minghan), and 10,000 (tumen). Units were deliberately mixed from different tribes to break old loyalties and forge a unified army. Promotion was strictly by merit. Desertion from a unit of 10 meant death for all 9 remaining members.',
    icon: '🔢',
    color: '#059669',
  },
  {
    name: 'Superior Intelligence Network',
    description:
      'The Mongols maintained the Yam postal relay system — a network of stations every 25–30 miles across the empire — enabling rapid communication across thousands of miles. Before each campaign, extensive spy networks and merchant informants mapped enemy defenses, political divisions, and terrain.',
    icon: '🕵️',
    color: '#d946ef',
  },
  {
    name: 'Speed and Endurance',
    description:
      'Each warrior maintained 3–5 horses, switching mounts to maintain speed. Mongol armies could cover 100+ miles per day — three times the pace of European armies. They campaigned in winter when rivers froze into highways, and survived on dried meat, fermented mare\'s milk, and horse blood.',
    icon: '⚡',
    color: '#eab308',
  },
  {
    name: 'Encirclement (Tulughma)',
    description:
      'The Mongols perfected large-scale encirclement, using their speed advantage to surround entire armies. The nerge hunting technique — where thousands of riders would slowly encircle game across dozens of miles — was directly applied to warfare, trapping enemies in contracting rings of mounted archers.',
    icon: '⭕',
    color: '#f97316',
  },
];

const CONQUESTS: Conquest[] = [
  {
    name: 'Northern China / Jin Dynasty',
    period: '1211–1234',
    casualties: '30+ million estimated dead',
    significance:
      'The Mongols conquered one of the world\'s most powerful empires, gaining access to Chinese siege technology, gunpowder weapons, and administrative expertise that fueled all subsequent conquests.',
    details:
      'Genghis Khan invaded the Jurchen Jin Dynasty in 1211 with roughly 100,000 cavalry against a population of 50 million. The fall of Zhongdu (Beijing) in 1215 was followed by two more decades of grinding warfare. The Jin were finally destroyed in 1234 under Ögedei Khan, with entire regions depopulated.',
    icon: '🏯',
    color: '#dc2626',
  },
  {
    name: 'Khwarezmian Empire',
    period: '1219–1221',
    casualties: '10–15 million estimated dead',
    significance:
      'The complete annihilation of Central Asia\'s greatest Islamic empire in just two years — one of the most devastating campaigns in history. Destroyed Samarkand, Bukhara, Merv, Nishapur, and dozens of other cities.',
    details:
      'When Shah Muhammad II executed Mongol ambassadors, Genghis Khan unleashed total war. Bukhara fell in days; Samarkand\'s garrison of 110,000 was destroyed. At Merv, reportedly 700,000–1.3 million were killed. Nishapur was razed so completely that the site was plowed and sown with barley. The Shah fled and died on a Caspian island.',
    icon: '🕌',
    color: '#b45309',
  },
  {
    name: 'Kievan Rus',
    period: '1237–1242',
    casualties: 'Half the population killed or enslaved',
    significance:
      'Destroyed the fragmented Rus principalities, establishing Mongol (Golden Horde) dominance over Russia for 240 years. Fundamentally shaped Russian political culture, centralization, and relations with the West.',
    details:
      'Batu Khan and the brilliant general Subutai invaded in winter, using frozen rivers as highways. Ryazan, Vladimir, Moscow, and Kiev were sacked. Kiev — once Europe\'s largest city — was so thoroughly destroyed that a traveler six years later counted "countless skulls and bones." Only Novgorod escaped, saved by spring thaw turning roads to mud.',
    icon: '🏰',
    color: '#7c3aed',
  },
  {
    name: 'Abbasid Caliphate / Sack of Baghdad',
    period: '1258',
    casualties: '200,000–2 million killed in Baghdad alone',
    significance:
      'Ended the 500-year Abbasid Caliphate and the Islamic Golden Age. The destruction of Baghdad\'s libraries — including the House of Wisdom — was an incalculable loss to human knowledge. The Tigris reportedly ran black with ink from destroyed books, then red with blood.',
    details:
      'Hülegü Khan besieged Baghdad with 150,000 troops. After the city fell, a week-long massacre ensued. The last Abbasid Caliph was rolled in a carpet and trampled to death by horses (Mongols believed royal blood should not touch the earth). The Grand Library was destroyed, irrigation systems were wrecked, and Mesopotamia\'s agricultural base never fully recovered.',
    icon: '📚',
    color: '#0891b2',
  },
  {
    name: 'Battle of Legnica (Liegnitz)',
    period: '1241',
    casualties: 'Allied army nearly annihilated',
    significance:
      'A combined force of Polish, German, and Teutonic Knights was destroyed using the feigned retreat. Europe was saved only by Ögedei Khan\'s death, which called the Mongol princes back for succession. The Mongols "stopped at the gates of Europe" not from defeat but from politics.',
    details:
      'At Legnica, Duke Henry II of Silesia led a coalition army against a Mongol force under Baidar and Kadan. The Mongol feigned retreat drew the European heavy cavalry into a trap. Henry was killed and his head displayed on a lance. Two days later at Mohi, Subutai annihilated the Hungarian army of 80,000 with a masterful double envelopment.',
    icon: '🛡️',
    color: '#059669',
  },
  {
    name: 'Song Dynasty / Southern China',
    period: '1235–1279',
    casualties: 'Tens of millions over 44 years of warfare',
    significance:
      'The conquest of the Song Dynasty gave the Mongols control of the world\'s richest and most technologically advanced civilization. Kublai Khan established the Yuan Dynasty, ruling 60+ million Chinese from Beijing. The final Song defeat at the naval Battle of Yamen (1279) unified all of China under foreign rule.',
    details:
      'The Song Dynasty, protected by the Yangtze River and superior naval technology, held out for 44 years — the longest resistance any civilization mounted against the Mongols. Kublai Khan eventually prevailed through a combination of defections, naval innovations, and the strategic fortress of Xiangyang (besieged for 5 years). The Song court\'s final stand at sea ended with the mass suicide of loyalists.',
    icon: '⛵',
    color: '#d946ef',
  },
];

const KHANATES: Khanate[] = [
  {
    name: 'Yuan Dynasty',
    territory: 'China, Mongolia, Tibet, Korea',
    founder: 'Kublai Khan',
    period: '1271–1368',
    keyRulers: [
      'Kublai Khan (1260–1294) — founded the dynasty, hosted Marco Polo',
      'Temür Khan (1294–1307) — maintained stability',
      'Toghon Temür (1333–1368) — last Yuan emperor, fled to Mongolia',
    ],
    fate: 'Overthrown by the Ming Dynasty in 1368 after the Red Turban Rebellion. The Mongol court retreated to the steppe as the "Northern Yuan."',
    color: '#dc2626',
    icon: '🏯',
  },
  {
    name: 'Golden Horde (Kipchak Khanate)',
    territory: 'Russia, Ukraine, Kazakhstan, Western Siberia',
    founder: 'Batu Khan (grandson of Genghis)',
    period: '1227–1502',
    keyRulers: [
      'Batu Khan (1227–1255) — conquered Russia, founded Sarai',
      'Berke Khan (1258–1266) — first Mongol ruler to convert to Islam',
      'Özbeg Khan (1313–1341) — peak of Golden Horde power',
      'Tokhtamysh (1380–1395) — briefly reunited, then crushed by Timur',
    ],
    fate: 'Fragmented into the khanates of Kazan, Astrakhan, Crimea, and Sibir. Russia gradually conquered all successor states by the 16th–18th centuries.',
    color: '#eab308',
    icon: '🐺',
  },
  {
    name: 'Chagatai Khanate',
    territory: 'Central Asia — modern Uzbekistan, Tajikistan, Xinjiang, Afghanistan',
    founder: 'Chagatai Khan (son of Genghis)',
    period: '1227–1347 (then fragments to 1680s)',
    keyRulers: [
      'Chagatai Khan (1227–1242)',
      'Alghu (1260–1266) — asserted independence',
      'Kebek Khan (1318–1326) — established capital at Qarshi',
      'Tughlugh Timur (1347–1363) — last unified khan',
    ],
    fate: 'Split into western (Transoxiana, eventually conquered by Timur) and eastern (Moghulistan) halves. Last remnants absorbed into the Dzungar and Kazakh khanates.',
    color: '#059669',
    icon: '🏜️',
  },
  {
    name: 'Ilkhanate',
    territory: 'Persia, Iraq, Afghanistan, Turkmenistan, Armenia, Azerbaijan, Georgia',
    founder: 'Hülegü Khan (grandson of Genghis)',
    period: '1256–1335',
    keyRulers: [
      'Hülegü Khan (1256–1265) — destroyed Baghdad, defeated Assassins',
      'Abaqa (1265–1282) — allied with Crusaders against Mamluks',
      'Ghazan (1295–1304) — converted to Islam, major reforms',
      'Abu Said (1316–1335) — last effective Ilkhan',
    ],
    fate: 'Collapsed into rival successor states after Abu Said died without an heir. Persia remained fragmented until Timur\'s conquests in the 1380s.',
    color: '#7c3aed',
    icon: '🕌',
  },
];

const SUCCESSORS: Successor[] = [
  {
    name: 'Ögedei Khan',
    title: 'Second Great Khan',
    reign: '1229–1241',
    achievements: [
      'Completed conquest of the Jin Dynasty (1234)',
      'Launched the great western campaign into Europe under Batu and Subutai',
      'Built Karakorum as the imperial capital with a silver fountain that dispensed koumiss, wine, mead, and rice beer',
      'Expanded the Yam postal system across the entire empire',
      'His sudden death (likely from alcoholism) saved Europe from further Mongol invasion',
    ],
    icon: '🏗️',
    color: '#2563eb',
  },
  {
    name: 'Güyük Khan',
    title: 'Third Great Khan',
    reign: '1246–1248',
    achievements: [
      'Elected after a 5-year regency by his mother Töregene',
      'Received the papal envoy Giovanni da Pian del Carpine',
      'Sent a famous letter to Pope Innocent IV declaring Mongol supremacy over all nations',
      'Died after only 2 years, possibly poisoned — his brief reign destabilized succession',
    ],
    icon: '📜',
    color: '#6b7280',
  },
  {
    name: 'Möngke Khan',
    title: 'Fourth Great Khan',
    reign: '1251–1259',
    achievements: [
      'Restored centralized authority after a succession crisis',
      'Launched two-pronged campaign: Hülegü westward against Baghdad, Kublai southward against Song China',
      'Conducted the first empire-wide census',
      'Hosted the famous religious debate at Karakorum between Christians, Muslims, and Buddhists',
      'Died during the siege of Fishing Town in China, triggering the final imperial fracture',
    ],
    icon: '⚖️',
    color: '#7c3aed',
  },
  {
    name: 'Kublai Khan',
    title: 'Fifth Great Khan / Yuan Emperor',
    reign: '1260–1294',
    achievements: [
      'Founded the Yuan Dynasty — first foreign dynasty to rule all of China',
      'Completed the 44-year conquest of the Song Dynasty (1279)',
      'Built the magnificent capital Khanbaliq (modern Beijing) and the summer palace Xanadu',
      'Patronized arts, science, and religious diversity; hosted Marco Polo for 17 years',
      'Attempted (and failed) invasions of Japan (1274, 1281), Vietnam, Java, and Burma',
      'Introduced paper money on a massive scale across the empire',
    ],
    icon: '👑',
    color: '#b45309',
  },
];

const PAX_MONGOLICA = {
  overview:
    'The Pax Mongolica (c. 1250–1350) was a century of relative stability across Eurasia under Mongol rule. For the first and only time in history, a single political authority controlled the entire Silk Road from China to the Mediterranean. Trade, ideas, technology, religions, and disease flowed freely across the largest contiguous land empire ever.',
  elements: [
    {
      title: 'Silk Road Reopened',
      description:
        'Mongol armies eliminated the bandits, competing states, and tolls that had choked the Silk Road for centuries. A merchant could travel from Tabriz to Beijing under a single system of laws and protections. Chinese silk, Persian carpets, Indian spices, and European silver flowed in volumes never seen before.',
      icon: '🐫',
    },
    {
      title: 'Technology Transfer',
      description:
        'Gunpowder, the compass, and printing — China\'s "Three Great Inventions" — spread westward along Mongol trade routes, eventually transforming European warfare, navigation, and knowledge. Paper money, blast furnaces, and medical knowledge also diffused across the empire.',
      icon: '🧭',
    },
    {
      title: 'Marco Polo\'s Journey',
      description:
        'The Venetian merchant Marco Polo traveled to Kublai Khan\'s court (c. 1275–1292) and returned with tales of paper money, coal, postal systems, and cities larger than any in Europe. His book "Il Milione" (The Travels) shaped European imagination about the East for centuries and inspired Columbus.',
      icon: '📖',
    },
    {
      title: 'Religious Exchange',
      description:
        'Nestorian Christians, Buddhists, Muslims, Daoists, and shamans all coexisted under Mongol rule. Missionaries like William of Rubruck visited the Mongol court. Churches stood alongside mosques and temples in Karakorum. This tolerance was remarkable for the 13th century.',
      icon: '🕊️',
    },
    {
      title: 'Diplomatic Networks',
      description:
        'For the first time, European powers had direct diplomatic contact with East Asian empires. Papal envoys reached Karakorum, Genoese merchants established trading posts in Crimea, and Persian historians recorded Chinese innovations. The world became suddenly smaller.',
      icon: '🌐',
    },
    {
      title: 'The Dark Side: Plague Highways',
      description:
        'The same trade routes that carried silk and spices also carried Yersinia pestis — the Black Death. Originating in Central Asia, the plague traveled along Mongol trade networks, reaching Crimea by 1346 and devastating Europe by 1347–1351, killing 30–60% of the population.',
      icon: '☠️',
    },
  ],
};

const GOVERNANCE = [
  {
    title: 'The Yasa (Jasagh) — The Great Law Code',
    description:
      'Genghis Khan codified Mongol customary law into the Yasa, a comprehensive legal code covering everything from military discipline to property rights. The death penalty applied to theft, adultery, deliberate lying, and urinating in running water. All subjects — from princes to peasants — were theoretically equal before the Yasa.',
    icon: '📜',
  },
  {
    title: 'Religious Tolerance',
    description:
      'The Mongols practiced remarkable religious freedom. All religions were exempt from taxation. Genghis Khan himself consulted Daoist sages, Buddhist monks, Christian priests, and Muslim scholars. He believed the Eternal Blue Sky (Tengri) encompassed all faiths. This tolerance was both philosophical and pragmatic — it prevented religious revolts across a diverse empire.',
    icon: '🕊️',
  },
  {
    title: 'Meritocracy',
    description:
      'Genghis Khan\'s most revolutionary innovation was the abolition of inherited aristocratic privilege. Generals, governors, and administrators were appointed by ability, not birth. A shepherd\'s son could become a general; a defeated enemy who fought bravely might be promoted over Mongol nobles. This system attracted talented people from across the conquered lands.',
    icon: '⭐',
  },
  {
    title: 'The Yam (Postal Relay System)',
    description:
      'A vast network of relay stations (örtöö) spaced every 25–30 miles across the empire, maintained thousands of horses, riders, and supplies. Official messages could travel 200+ miles per day. Marco Polo reported 10,000 stations with 300,000 horses. The system also provided food, shelter, and fresh mounts for merchants and diplomats.',
    icon: '📮',
  },
  {
    title: 'Trade Protection',
    description:
      'Merchants received special protection and passports (paiza/gerege). Caravan routes were patrolled, and robbery was punishable by death. The empire standardized weights and measures, reduced tariffs, and provided caravanserais (rest stops). This made long-distance trade safer than at any previous point in history.',
    icon: '🛡️',
  },
  {
    title: 'Census and Taxation',
    description:
      'The Mongols conducted regular censuses across their vast empire — an administrative feat unmatched until modern times. Taxes were systematic and relatively light compared to many contemporary states: typically 10% of production. Skilled artisans, doctors, and religious leaders were tax-exempt.',
    icon: '📊',
  },
];

const BLACK_DEATH = {
  overview:
    'The Mongol Empire inadvertently created the conditions for the worst pandemic in human history. The Black Death (1346–1353) killed an estimated 75–200 million people across Eurasia, and its spread was directly facilitated by the Mongol-maintained trade networks of the Pax Mongolica.',
  connections: [
    {
      title: 'Origin in Central Asia',
      description:
        'The plague bacterium Yersinia pestis likely originated in the marmot populations of the Central Asian steppe — the heart of the Mongol Empire. Archaeological evidence of plague has been found in Kyrgyzstan dating to the 1330s, in communities along the Silk Road.',
      icon: '🦠',
    },
    {
      title: 'Mongol Trade Routes as Vectors',
      description:
        'The Pax Mongolica\'s greatest achievement — safe, rapid trade across Eurasia — became the plague\'s highway. Infected fleas traveled on rats in grain shipments, caravans, and merchant ships. The same routes that carried silk and spices now carried death.',
      icon: '🐀',
    },
    {
      title: 'The Siege of Caffa (1346)',
      description:
        'In the most infamous episode, the Golden Horde army besieging the Genoese trading port of Caffa in Crimea catapulted plague-infected corpses over the walls — one of history\'s first recorded instances of biological warfare. Genoese ships fleeing Caffa carried the plague to Constantinople, Sicily, and Marseille.',
      icon: '⚓',
    },
    {
      title: 'Devastation of the Golden Horde',
      description:
        'The plague didn\'t just pass through Mongol territories — it devastated them. The Golden Horde lost enormous numbers, weakening its grip on Russia and contributing to its eventual fragmentation. The Ilkhanate\'s collapse in 1335 may have been partly plague-related.',
      icon: '💀',
    },
    {
      title: 'Europe Transformed',
      description:
        'Arriving in Europe in 1347, the plague killed 30–60% of the population within five years. The resulting labor shortage ended feudalism, raised wages, and contributed to the social upheavals that eventually led to the Renaissance. The Mongol Empire thus indirectly catalyzed the transformation of European civilization.',
      icon: '🌍',
    },
  ],
};

const LEGACY_ITEMS: LegacyItem[] = [
  {
    title: 'Genetic Legacy',
    description:
      'Approximately 1 in 200 men worldwide (16 million) carry a Y-chromosome lineage traced back to Genghis Khan or his close male relatives. In parts of Central Asia, up to 8% of men carry this genetic signature — the most successful genetic lineage in human history.',
    icon: '🧬',
  },
  {
    title: 'Nations Shaped',
    description:
      'Modern Russia, China, Iran, Iraq, Korea, and most of Central Asia were profoundly shaped by Mongol rule. Russia\'s autocratic political traditions, China\'s Grand Canal expansion, Persia\'s administrative systems, and Central Asia\'s ethnic composition all bear Mongol imprints.',
    icon: '🗺️',
  },
  {
    title: 'Cultural Mixing',
    description:
      'The Mongol Empire created unprecedented cultural exchange. Chinese techniques reached Persia, Islamic astronomy reached China, and European goods reached East Asia. Blue-and-white porcelain — using cobalt from Persia and Chinese ceramic techniques — symbolizes this fusion.',
    icon: '🎨',
  },
  {
    title: 'Military Revolution',
    description:
      'Mongol tactics influenced warfare for centuries. The Ottoman Empire, Mughal India (named for "Mongol"), and Timurid empires all claimed Mongol heritage and adapted their military methods. Gunpowder\'s spread via Mongol routes transformed warfare globally.',
    icon: '💥',
  },
  {
    title: 'Place Names and Language',
    description:
      'The word "horde" (from Mongol "orda" = camp), "mogul" (from "Mongol"), and "khan" entered dozens of languages. Place names like Kazan, Astrakhan, and the Crimean cities preserve Mongol and Golden Horde heritage.',
    icon: '📝',
  },
  {
    title: 'Trade Infrastructure',
    description:
      'The Mongol postal system influenced later communication networks. Their standardization of weights, measures, and trade protections anticipated modern free-trade principles. The Silk Road\'s peak under Mongol rule was not surpassed until the age of European maritime empires.',
    icon: '🛤️',
  },
  {
    title: 'Religious Tolerance Precedent',
    description:
      'The Mongol policy of religious freedom was centuries ahead of its time. While medieval Europe burned heretics, the Mongol court hosted debates between Christians, Muslims, Buddhists, and others. This model of pragmatic tolerance influenced later Central Asian empires.',
    icon: '☮️',
  },
  {
    title: 'The Successor Empires',
    description:
      'Timur (Tamerlane), the Mughal Dynasty (literally "Mongol Dynasty") in India, the Ottoman concept of universal empire, and the Russian tsars\' autocratic traditions all drew legitimacy or inspiration from the Mongol imperial model. The Mongol shadow stretched across Eurasia for centuries.',
    icon: '👑',
  },
];

const TAB_CONFIG: { key: Tab; label: string }[] = [
  { key: 'timeline', label: 'Timeline' },
  { key: 'genghis', label: 'Genghis Khan' },
  { key: 'military', label: 'Military' },
  { key: 'conquests', label: 'Conquests' },
  { key: 'khanates', label: 'Khanates' },
  { key: 'successors', label: 'Successors' },
  { key: 'pax', label: 'Pax Mongolica' },
  { key: 'governance', label: 'Governance' },
  { key: 'plague', label: 'Black Death' },
  { key: 'legacy', label: 'Legacy' },
];

/* ─── sub-components ─── */

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <h2
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          color: colors.text,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 18px',
        borderRadius: 8,
        border: active ? `1px solid ${ACCENT}` : `1px solid ${colors.border}`,
        background: active ? `${ACCENT}22` : 'transparent',
        color: active ? ACCENT : colors.textMuted,
        fontWeight: 600,
        fontSize: 13,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        background: `${ACCENT}18`,
        border: `1px solid ${ACCENT}44`,
        borderRadius: 10,
        padding: '10px 18px',
        textAlign: 'center',
        minWidth: 120,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800, color: ACCENT }}>{value}</div>
      <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

/* ─── section renderers ─── */

function TimelineSection() {
  return (
    <div>
      <SectionHeader icon="📅" title="Timeline & Phases" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {PHASES.map((phase, i) => (
          <motion.div
            key={phase.name}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${phase.color}44`,
              borderLeft: `4px solid ${phase.color}`,
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{phase.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>
                  {phase.name}
                </div>
                <div style={{ fontSize: 12, color: phase.color, fontWeight: 600 }}>
                  {phase.period}
                </div>
              </div>
            </div>
            <p style={{ color: colors.textMuted, fontSize: 13, lineHeight: 1.7, margin: '8px 0 12px' }}>
              {phase.summary}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {phase.keyEvents.map((evt) => (
                <div
                  key={evt}
                  style={{
                    fontSize: 12,
                    color: colors.textDim,
                    paddingLeft: 14,
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      color: phase.color,
                      fontWeight: 700,
                    }}
                  >
                    ›
                  </span>
                  {evt}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GenghisSection() {
  return (
    <div>
      <SectionHeader icon="👑" title="Genghis Khan — From Outcast to World Conqueror" />
      <div
        style={{
          background: colors.bgCard,
          border: `1px solid ${ACCENT}44`,
          borderRadius: 10,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: colors.textDim, textTransform: 'uppercase' }}>Birth Name</div>
            <div style={{ fontSize: 14, color: colors.text, fontWeight: 600 }}>{GENGHIS_ORIGIN.birthName}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: colors.textDim, textTransform: 'uppercase' }}>Born</div>
            <div style={{ fontSize: 14, color: colors.text, fontWeight: 600 }}>{GENGHIS_ORIGIN.birthYear}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: colors.textDim, textTransform: 'uppercase' }}>Birthplace</div>
            <div style={{ fontSize: 14, color: colors.text, fontWeight: 600 }}>{GENGHIS_ORIGIN.birthPlace}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: colors.textDim, textTransform: 'uppercase' }}>Died</div>
            <div style={{ fontSize: 14, color: colors.text, fontWeight: 600 }}>{GENGHIS_ORIGIN.deathYear}</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {GENGHIS_ORIGIN.story.map((chapter, i) => (
          <motion.div
            key={chapter.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{chapter.icon}</span>
              <div style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>{chapter.title}</div>
            </div>
            <p style={{ color: colors.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              {chapter.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MilitarySection() {
  return (
    <div>
      <SectionHeader icon="⚔️" title="Military Tactics & Organization" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {MILITARY_TACTICS.map((tactic, i) => (
          <motion.div
            key={tactic.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${tactic.color}44`,
              borderTop: `3px solid ${tactic.color}`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{tactic.icon}</span>
              <div style={{ fontWeight: 700, fontSize: 14, color: colors.text }}>{tactic.name}</div>
            </div>
            <p style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.7, margin: 0 }}>
              {tactic.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ConquestsSection() {
  return (
    <div>
      <SectionHeader icon="🗡️" title="Major Conquests" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {CONQUESTS.map((conquest, i) => (
          <motion.div
            key={conquest.name}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${conquest.color}44`,
              borderLeft: `4px solid ${conquest.color}`,
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{conquest.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>
                  {conquest.name}
                </div>
                <div style={{ fontSize: 12, color: conquest.color, fontWeight: 600 }}>
                  {conquest.period}
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'inline-block',
                background: '#dc262622',
                border: '1px solid #dc262644',
                borderRadius: 6,
                padding: '3px 10px',
                fontSize: 11,
                color: '#f87171',
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              {conquest.casualties}
            </div>
            <p style={{ color: colors.textMuted, fontSize: 13, lineHeight: 1.7, margin: '0 0 8px' }}>
              {conquest.details}
            </p>
            <div
              style={{
                background: `${conquest.color}11`,
                borderRadius: 6,
                padding: '8px 12px',
                fontSize: 12,
                color: colors.textMuted,
                fontStyle: 'italic',
                borderLeft: `3px solid ${conquest.color}66`,
              }}
            >
              <strong style={{ color: colors.text }}>Significance:</strong> {conquest.significance}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function KhanatesSection() {
  return (
    <div>
      <SectionHeader icon="🗺️" title="The Four Khanates" />
      <p style={{ color: colors.textMuted, fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
        After the death of Möngke Khan in 1259, the Mongol Empire fractured into four largely
        independent khanates. Though they sometimes cooperated and all acknowledged a nominal Great
        Khan, they increasingly went their own ways — even fighting wars against each other.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {KHANATES.map((khanate, i) => (
          <motion.div
            key={khanate.name}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${khanate.color}44`,
              borderTop: `4px solid ${khanate.color}`,
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{khanate.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: colors.text }}>
                  {khanate.name}
                </div>
                <div style={{ fontSize: 12, color: khanate.color, fontWeight: 600 }}>
                  {khanate.period}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, marginBottom: 10 }}>
              <span style={{ color: colors.textDim }}>Territory: </span>
              <span style={{ color: colors.textMuted }}>{khanate.territory}</span>
            </div>
            <div style={{ fontSize: 12, marginBottom: 10 }}>
              <span style={{ color: colors.textDim }}>Founded by: </span>
              <span style={{ color: colors.textMuted }}>{khanate.founder}</span>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: colors.textDim, textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
                Key Rulers
              </div>
              {khanate.keyRulers.map((ruler) => (
                <div
                  key={ruler}
                  style={{
                    fontSize: 11,
                    color: colors.textMuted,
                    paddingLeft: 12,
                    position: 'relative',
                    marginBottom: 3,
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ position: 'absolute', left: 0, color: khanate.color }}>›</span>
                  {ruler}
                </div>
              ))}
            </div>
            <div
              style={{
                background: `${khanate.color}11`,
                borderRadius: 6,
                padding: '8px 12px',
                fontSize: 11,
                color: colors.textMuted,
                borderLeft: `3px solid ${khanate.color}66`,
              }}
            >
              <strong style={{ color: colors.text }}>Fate:</strong> {khanate.fate}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SuccessorsSection() {
  return (
    <div>
      <SectionHeader icon="🏛️" title="Genghis Khan's Successors" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SUCCESSORS.map((successor, i) => (
          <motion.div
            key={successor.name}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${successor.color}44`,
              borderLeft: `4px solid ${successor.color}`,
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{successor.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>
                  {successor.name}
                </div>
                <div style={{ fontSize: 12, color: successor.color, fontWeight: 600 }}>
                  {successor.title} — {successor.reign}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
              {successor.achievements.map((achievement) => (
                <div
                  key={achievement}
                  style={{
                    fontSize: 12,
                    color: colors.textMuted,
                    paddingLeft: 14,
                    position: 'relative',
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      color: successor.color,
                      fontWeight: 700,
                    }}
                  >
                    ›
                  </span>
                  {achievement}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PaxSection() {
  return (
    <div>
      <SectionHeader icon="🕊️" title="Pax Mongolica — Trade & Cultural Exchange" />
      <p style={{ color: colors.textMuted, fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
        {PAX_MONGOLICA.overview}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {PAX_MONGOLICA.elements.map((el, i) => (
          <motion.div
            key={el.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{el.icon}</span>
              <div style={{ fontWeight: 700, fontSize: 14, color: colors.text }}>{el.title}</div>
            </div>
            <p style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.7, margin: 0 }}>
              {el.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GovernanceSection() {
  return (
    <div>
      <SectionHeader icon="⚖️" title="Mongol Governance & Administration" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {GOVERNANCE.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div style={{ fontWeight: 700, fontSize: 14, color: colors.text }}>{item.title}</div>
            </div>
            <p style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.7, margin: 0 }}>
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PlagueSection() {
  return (
    <div>
      <SectionHeader icon="☠️" title="The Black Death Connection" />
      <div
        style={{
          background: '#dc262211',
          border: '1px solid #dc262644',
          borderRadius: 10,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <p style={{ color: colors.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          {BLACK_DEATH.overview}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {BLACK_DEATH.connections.map((conn, i) => (
          <motion.div
            key={conn.title}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderLeft: '4px solid #dc2626',
              borderRadius: 10,
              padding: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{conn.icon}</span>
              <div style={{ fontWeight: 700, fontSize: 14, color: colors.text }}>{conn.title}</div>
            </div>
            <p style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.7, margin: 0 }}>
              {conn.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LegacySection() {
  return (
    <div>
      <SectionHeader icon="🌍" title="Legacy & Decline" />
      <div
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
          borderRadius: 10,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>
          Why Did the Empire Fall?
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            'The Black Death devastated Mongol populations and trade networks (1340s–1350s)',
            'Overextension — the empire was simply too vast to govern from a single center',
            'Assimilation — Mongol rulers adopted local cultures (Islam in Persia, Chinese in Yuan), losing unifying identity',
            'Succession crises — every transition of power risked civil war without a clear system',
            'Local rebellions — conquered peoples eventually organized resistance (Ming in China, Russians vs Golden Horde)',
            'Loss of military edge — as armies settled, they lost the steppe cavalry skills that made them invincible',
          ].map((reason) => (
            <div
              key={reason}
              style={{
                fontSize: 12,
                color: colors.textMuted,
                paddingLeft: 14,
                position: 'relative',
                lineHeight: 1.6,
              }}
            >
              <span style={{ position: 'absolute', left: 0, color: ACCENT, fontWeight: 700 }}>
                ›
              </span>
              {reason}
            </div>
          ))}
        </div>
      </div>

      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: colors.text,
          margin: '0 0 14px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Enduring Legacy
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {LEGACY_ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div style={{ fontWeight: 700, fontSize: 14, color: colors.text }}>{item.title}</div>
            </div>
            <p style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.7, margin: 0 }}>
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── main component ─── */

export default function MongolEmpirePage() {
  const [tab, setTab] = useState<Tab>('timeline');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.bg,
        color: colors.text,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── header ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          padding: '32px 24px 24px',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <Link
          to="/"
          style={{
            color: colors.textDim,
            textDecoration: 'none',
            fontSize: 13,
            display: 'inline-block',
            marginBottom: 16,
          }}
        >
          ← Back to Timeline
        </Link>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            margin: '0 0 6px',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}
        >
          The Mongol Empire
        </h1>
        <p style={{ color: colors.textMuted, fontSize: 15, margin: '0 0 20px' }}>
          The Largest Contiguous Land Empire in History (1206–1368)
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <StatBadge value="24M km²" label="Peak Territory" />
          <StatBadge value="~40M" label="Killed (~10% of World)" />
          <StatBadge value="5M km" label="Road Network" />
          <StatBadge value="4" label="Khanates at Split" />
          <StatBadge value="162 yrs" label="Empire Duration" />
        </div>
      </motion.header>

      {/* ── sticky tab nav ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: `${colors.bg}ee`,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${colors.border}`,
          padding: '10px 24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            maxWidth: 1100,
            margin: '0 auto',
            overflowX: 'auto',
            paddingBottom: 2,
          }}
        >
          {TAB_CONFIG.map((t) => (
            <TabButton
              key={t.key}
              label={t.label}
              active={tab === t.key}
              onClick={() => setTab(t.key)}
            />
          ))}
        </div>
      </div>

      {/* ── tab content ── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 60px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {tab === 'timeline' && <TimelineSection />}
            {tab === 'genghis' && <GenghisSection />}
            {tab === 'military' && <MilitarySection />}
            {tab === 'conquests' && <ConquestsSection />}
            {tab === 'khanates' && <KhanatesSection />}
            {tab === 'successors' && <SuccessorsSection />}
            {tab === 'pax' && <PaxSection />}
            {tab === 'governance' && <GovernanceSection />}
            {tab === 'plague' && <PlagueSection />}
            {tab === 'legacy' && <LegacySection />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
