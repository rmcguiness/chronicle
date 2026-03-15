/**
 * MedievalEuropePage — comprehensive deep-dive on Medieval Europe (500–1500 CE).
 *
 * Route: /medieval-europe
 *
 * Sections:
 *  1. Hero — "Not Dark, Just Different" headline, myth-busting opener
 *  2. The "Dark Ages" Myth — debunking the label
 *  3. The Early Middle Ages (500–1000 CE) — Germanic kingdoms, Charlemagne, Vikings
 *  4. Feudalism — the medieval social order
 *  5. The High Middle Ages (1000–1300 CE) — civilization at its peak
 *  6. The Crusades (1095–1291) — summary with link to /crusades
 *  7. Medieval Women — countering stereotypes
 *  8. The Black Death (1347–1353) — dramatic centerpiece
 *  9. Medieval Technology and Innovation — clock, eyeglasses, universities
 * 10. Late Middle Ages and Decline of Feudalism (1300–1500)
 * 11. Legacy — what medieval Europe gave us
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const ASH = '#94a3b8';
const SLATE = '#64748b';
const STONE = '#78716c';
const CRIMSON = '#dc2626';
const GOLD = '#f59e0b';
const AMBER = '#d97706';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const ROSE = '#f43f5e';
const PURPLE = '#a855f7';
const FOREST = '#15803d';
const SKY = '#38bdf8';
const BURGUNDY = '#881337';
const CATHEDRAL = '#7c3aed';
const PLAGUE = '#65a30d';
const IRON = '#57534e';
const PARCHMENT = '#d4a574';
const CROSS_RED = '#b91c1c';

const FIGURE_COLORS = [SKY, AMBER, CRIMSON, FOREST, GOLD, TEAL, INDIGO, ROSE, PURPLE, PARCHMENT, CATHEDRAL, IRON];

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

// ── Key Stats ───────────────────────────────────────────────────────────────

const KEY_STATS: { label: string; value: string; context: string; color: string }[] = [
  { label: 'Black Death', value: '30–60%', context: 'Of European population killed (25–50 million) in 6 years', color: PLAGUE },
  { label: 'University of Bologna', value: '1088 CE', context: 'Oldest operating university in the world — still running', color: CATHEDRAL },
  { label: 'Charlemagne\'s Empire', value: '1.1M km²', context: 'Largest Western European empire since Rome', color: GOLD },
  { label: 'Chartres Cathedral', value: '66 Years', context: 'To build — still standing after 800 years', color: INDIGO },
  { label: 'Population Recovery', value: '30M → 70M → 50M → 70M', context: '900 → 1300 → 1400 (plague) → 1500', color: TEAL },
  { label: 'Medieval Period', value: '500–1500 CE', context: '1,000 years of transformation — not darkness', color: PARCHMENT },
];

// ── The "Dark Ages" Myth ────────────────────────────────────────────────────

const DARK_AGES_INSIGHTS: InsightEntry[] = [
  {
    label: 'Who Coined "Dark Ages" — and Why',
    detail:
      'The term "Dark Ages" was popularized by 19th-century historians who saw the period between the fall of Rome (476 CE) and the Renaissance as a time of intellectual darkness — a gap between two "enlightened" eras. The Italian scholar Petrarch first used the metaphor in the 14th century to contrast his own time with classical antiquity. But this framing was always polemical, not analytical. Modern historians have largely abandoned the term because it misrepresents what actually happened during the medieval period.',
  },
  {
    label: 'Real Declines — But Not Darkness',
    detail:
      'The fall of the Western Roman Empire did bring real losses. Population declined significantly. Long-distance trade networks contracted. Literacy rates dropped as Roman educational institutions collapsed. Urban centers shrank — Rome itself went from over a million people to perhaps 30,000. Infrastructure deteriorated. These were genuine setbacks. But calling this period "dark" implies nothing was happening, which is profoundly wrong.',
  },
  {
    label: 'What Was Thriving While Europe "Declined"',
    detail:
      'While Western Europe reorganized after Rome\'s fall, the Islamic Golden Age (8th–14th century) was advancing mathematics, astronomy, medicine, and philosophy. The Byzantine Empire preserved Roman law, Greek learning, and Christian scholarship for another thousand years. In Western Europe itself, monasteries became centers of learning that preserved and copied ancient texts. Irish monks, in particular, are credited with saving much of classical Latin literature from oblivion.',
  },
  {
    label: 'Why Modern Historians Reject the Term',
    detail:
      'The medieval period produced universities, Gothic cathedrals, parliamentary government, common law, the mechanical clock, eyeglasses, the compass, gunpowder adoption, and the printing press. It saw the emergence of nation-states, international banking, and the foundations of modern science. Calling this "dark" is like calling the entire period between two bright spots invisible. The Middle Ages were not dark — they were different, and full of innovation that shaped the modern world.',
  },
];

// ── Early Middle Ages ───────────────────────────────────────────────────────

const EARLY_TIMELINE: TimelineEntry[] = [
  {
    year: '476–600 CE',
    title: 'Germanic Kingdoms Replace Roman Provinces',
    description:
      'After the Western Roman Empire\'s collapse, Germanic peoples who had been migrating into Roman territory for centuries established new kingdoms. The Franks dominated Gaul (modern France), the Visigoths ruled Spain, the Ostrogoths and later the Lombards controlled Italy, and the Anglo-Saxons settled Britain. These were not purely destructive invasions — many Germanic leaders had served as Roman military commanders and adopted Roman administrative practices. The transition was messier and more gradual than "Rome fell, barbarians took over" suggests.',
    color: IRON,
  },
  {
    year: '500–800 CE',
    title: 'The Church Fills the Power Vacuum',
    description:
      'As Roman political structures collapsed, the Catholic Church became the most powerful institution in Western Europe. Bishops took on civic leadership roles in cities. Monasteries — following the Rule of St. Benedict (c. 529) — became centers of learning, agriculture, and economic production. Missionaries like St. Patrick (Ireland), St. Augustine of Canterbury (England), and St. Boniface (Germany) converted pagan populations and extended the Church\'s reach. The Pope in Rome increasingly claimed authority over secular rulers — a claim that would define medieval politics for centuries.',
    color: CROSS_RED,
  },
  {
    year: '742–814 CE',
    title: 'Charlemagne Unites Western Europe',
    description:
      'Charles the Great (Charlemagne), King of the Franks, conquered and united most of Western Europe through decades of military campaigns. On Christmas Day 800 CE, Pope Leo III crowned him "Emperor of the Romans" — reviving the idea of a Western Roman Empire and establishing the precedent for the Holy Roman Empire. Charlemagne\'s empire stretched from the Pyrenees to the Elbe, from the North Sea to central Italy — 1.1 million km², the largest Western European state since Rome.',
    color: GOLD,
  },
  {
    year: '800–843 CE',
    title: 'The Carolingian Renaissance',
    description:
      'Charlemagne was more than a conqueror — he promoted education, literacy, and art. He established palace schools, standardized handwriting (Carolingian minuscule — the ancestor of modern lowercase letters), commissioned the copying of ancient texts, and attracted scholars from across Europe and the Islamic world. This "Carolingian Renaissance" preserved much of classical learning and created an educational infrastructure that would endure long after his empire fragmented.',
    color: CATHEDRAL,
  },
  {
    year: '843 CE',
    title: 'Treaty of Verdun — France, Germany, and Italy Emerge',
    description:
      'Charlemagne\'s empire didn\'t survive his grandsons. The Treaty of Verdun (843) divided it into three parts: West Francia (roughly modern France), East Francia (roughly modern Germany), and Middle Francia (a strip from the Netherlands to Italy that would be fought over for the next thousand years). This division is one of the foundational moments of European political geography — France and Germany, the two powers that would dominate European history, trace their origins to this treaty.',
    color: AMBER,
  },
  {
    year: '793–1000 CE',
    title: 'The Age of Invasions',
    description:
      'The 9th and 10th centuries brought waves of devastating raids. Vikings from Scandinavia attacked from the north, reaching Paris, London, and Constantinople. Magyar horsemen invaded from the east, raiding deep into Germany, France, and Italy. Saracen (Muslim) raiders attacked Mediterranean coasts and even established a base at Fraxinetum in southern France. These invasions accelerated the development of feudalism as local lords built castles and raised armies — because distant kings couldn\'t protect them.',
    color: CRIMSON,
  },
];

// ── Feudalism ───────────────────────────────────────────────────────────────

const FEUDALISM_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Feudal Pyramid',
    detail:
      'Medieval society was organized as a hierarchy: the king at the top, granting land (fiefs) to nobles in exchange for military service. Nobles in turn granted land to lesser nobles and knights, who provided armed service. At the bottom, peasants worked the land and owed labor, produce, and obedience to their lords. This system was not designed — it evolved organically as the collapse of centralized Roman authority forced people to seek local protection.',
  },
  {
    label: 'Serfs: Not Slaves, But Not Free',
    detail:
      'Serfs were bound to the land — they couldn\'t leave their manor without their lord\'s permission. But unlike slaves, they had recognized legal rights: they couldn\'t be sold separately from the land, their families couldn\'t be broken up, and they had customary rights to farm certain plots. In exchange for protection and access to land, serfs owed their lord labor (typically 3 days per week on the lord\'s fields), a share of their harvest, and various fees for using the lord\'s mill, oven, or wine press.',
  },
  {
    label: 'The Manor Economy',
    detail:
      'The manor was the basic economic unit of medieval Europe — a largely self-sufficient estate producing its own food, clothing, tools, and building materials. Long-distance trade had collapsed with the Roman Empire, so most people lived and died within a few miles of where they were born. The manor included the lord\'s demesne (his personal lands), peasant strips in the common fields, shared pasture, woodland, and a village. This was subsistence agriculture — there was little surplus, little trade, and little social mobility.',
  },
  {
    label: 'The Church\'s Parallel Hierarchy',
    detail:
      'Running parallel to the feudal system was the Church hierarchy: Pope → archbishops → bishops → priests, with monasteries operating semi-independently. The Church was the largest landowner in medieval Europe, controlling perhaps one-third of all arable land. Bishops and abbots were feudal lords in their own right, commanding armies and administering justice. This dual hierarchy — secular and ecclesiastical — created constant tension between kings and popes over who held ultimate authority.',
  },
];

// ── High Middle Ages ────────────────────────────────────────────────────────

const HIGH_TIMELINE: TimelineEntry[] = [
  {
    year: '900–1300 CE',
    title: 'The Agricultural Revolution',
    description:
      'Three innovations transformed medieval agriculture. The heavy wheeled plow could break the dense clay soils of northern Europe that Roman plows couldn\'t handle. The horse collar (adopted from China via Central Asia) allowed horses to replace oxen — horses are 50% faster. Three-field crop rotation (spring crop, winter crop, fallow) increased productive land from 50% to 67%. Together, these innovations roughly doubled agricultural output, enabling the population explosion from 30 million (900 CE) to 70 million (1300 CE).',
    color: FOREST,
  },
  {
    year: '1000–1300 CE',
    title: 'Towns and Trade Revive',
    description:
      'As agricultural surplus grew, towns re-emerged as centers of trade and craft production. Merchants organized into guilds that regulated quality, prices, and access to trades. International commerce revived — the Champagne fairs in France became Europe\'s premier marketplace, where Italian, Flemish, German, and English merchants traded cloth, spices, and financial instruments. Venice, Genoa, and other Italian city-states dominated Mediterranean trade, growing fabulously wealthy as middlemen between Europe and the Islamic world.',
    color: GOLD,
  },
  {
    year: '1088–1200s',
    title: 'The Invention of the University',
    description:
      'The medieval university is one of the period\'s most enduring legacies. Bologna (1088) was first, focused on law. Paris (c. 1150) became the center of theology and philosophy. Oxford (c. 1096) and Cambridge (1209) followed. These were not schools — they were self-governing corporations of scholars with the right to grant degrees, elect their own leaders, and operate under their own laws. The institutional DNA of the modern university — lectures, examinations, degrees, academic freedom — is medieval.',
    color: CATHEDRAL,
  },
  {
    year: '1163–1300s',
    title: 'Gothic Cathedrals — Engineering Marvels',
    description:
      'Gothic cathedrals represent the greatest engineering achievement of the Middle Ages. The key innovation was the flying buttress — external support arches that transferred the weight of the roof outward, allowing walls to be thinner and filled with enormous stained glass windows. Notre Dame de Paris (begun 1163), Chartres (begun 1194, completed 1220), and Cologne Cathedral represent decades of construction by thousands of skilled craftsmen. Chartres took 66 years to build and is still standing after 800 years — a testament to medieval engineering.',
    color: INDIGO,
  },
  {
    year: '1200s',
    title: 'Scholasticism — Synthesizing Faith and Reason',
    description:
      'Thomas Aquinas (1225–1274) undertook one of the most ambitious intellectual projects in history: reconciling Aristotelian philosophy (which had been reintroduced to Europe via Arabic translations) with Christian theology. His Summa Theologica attempted to prove that faith and reason were compatible — that the truths of philosophy and the truths of revelation could not contradict each other. Scholasticism transformed European intellectual life, establishing logical argumentation as the standard method of academic inquiry.',
    color: PURPLE,
  },
];

// ── Crusades ────────────────────────────────────────────────────────────────

const CRUSADES_INSIGHTS: InsightEntry[] = [
  {
    label: 'Why the Crusades Happened',
    detail:
      'In 1095, Pope Urban II called the First Crusade in response to the Seljuk Turk expansion into Byzantine territory and reports of persecution of Christian pilgrims in the Holy Land. But the motives were mixed: religious fervor, the promise of land and plunder, the Pope\'s desire to reunify Eastern and Western Christianity, and the need to redirect the violence of Europe\'s warrior class outward. "God wills it!" became the rallying cry — but God\'s will was conveniently aligned with political and economic interests.',
  },
  {
    label: 'Nine Crusades, Two Centuries',
    detail:
      'The First Crusade (1096–1099) succeeded in capturing Jerusalem, establishing four Crusader states along the eastern Mediterranean coast. But these gains were gradually lost. Saladin recaptured Jerusalem in 1187. The Third Crusade (1189–1192) — featuring Richard the Lionheart — failed to retake it. The Fourth Crusade (1204) never reached the Holy Land at all, instead sacking Constantinople — a Christian city. Subsequent crusades accomplished increasingly little. The last Crusader stronghold, Acre, fell in 1291.',
  },
  {
    label: 'Impact on Europe',
    detail:
      'The Crusades had profound effects on Europe. They brought back Islamic knowledge — Arabic numerals, algebra, advanced medicine, Aristotelian philosophy preserved in Arabic translation. They stimulated trade in spices, silk, and luxury goods that enriched Italian city-states. They weakened feudal nobility (many crusading lords sold or mortgaged their lands). But they also intensified anti-Semitism — Jewish communities were massacred during several crusades — and established a legacy of Christian-Muslim hostility that echoes to this day.',
  },
];

// ── Medieval Women ──────────────────────────────────────────────────────────

const WOMEN_INSIGHTS: InsightEntry[] = [
  {
    label: 'Eleanor of Aquitaine (1122–1204)',
    detail:
      'Eleanor was one of the most powerful figures of the 12th century — male or female. She inherited the Duchy of Aquitaine (the largest and richest duchy in France) at age 15, was Queen of France (married to Louis VII), went on the Second Crusade, divorced Louis, married Henry II of England, was Queen of England, ruled England as regent while Richard the Lionheart was on crusade, and patronized troubadour poetry and courtly love literature. She was imprisoned by Henry for 16 years for supporting their sons\' rebellion — and outlived him.',
  },
  {
    label: 'Hildegard of Bingen (1098–1179)',
    detail:
      'Hildegard was a Benedictine abbess who was also a composer, theologian, naturalist, pharmacologist, and visionary — a genuine polymath. She composed over 70 liturgical songs (some still performed today), wrote treatises on natural history and medicine, corresponded with popes and emperors, and described mystical visions that combined theology with detailed observations of the natural world. She is one of the few medieval women whose intellectual and creative output can be studied in detail because so much of it survived.',
  },
  {
    label: 'Christine de Pizan (1364–1430)',
    detail:
      'Christine de Pizan is considered the first professional female writer in European literature. After her husband\'s death left her with three children and no income, she turned to writing — and succeeded. Her most famous work, "The Book of the City of Ladies" (1405), systematically refuted misogynistic arguments by cataloging the achievements of women throughout history. She wrote over 40 works on politics, ethics, and women\'s rights, and was one of the first European writers to make a living entirely from literary output.',
  },
  {
    label: 'Peasant Women: Working Partners, Not Passive Victims',
    detail:
      'Medieval peasant women were not idle or powerless. They worked alongside men in the fields during planting and harvest, managed households, tended gardens and livestock, produced dairy products, brewed ale (brewing was a female-dominated trade), spun wool and wove cloth, raised children, and managed household finances. In many ways, the peasant household was an economic partnership. Women\'s economic contribution was essential and recognized — though this didn\'t translate to legal equality.',
  },
  {
    label: 'The Church\'s Contradictory View',
    detail:
      'The medieval Church held deeply contradictory views of women. On one hand, women were cast as daughters of Eve — temptresses who led men to sin, morally weaker, intellectually inferior. On the other, the cult of the Virgin Mary elevated feminine piety, compassion, and maternal devotion to the highest spiritual plane. This contradiction created space for exceptional women (especially in religious life) while simultaneously justifying the subordination of most women. The convent was one of the few spaces where women could pursue intellectual and spiritual life independently.',
  },
];

// ── The Black Death ─────────────────────────────────────────────────────────

const PLAGUE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Origin and Spread',
    detail:
      'The Black Death (bubonic plague) originated in Central Asia and traveled westward along Mongol trade routes — the same Silk Road networks that carried silk and spices also carried Yersinia pestis. It reached the Crimean port of Caffa in 1346 (legend says the besieging Mongols catapulted infected corpses over the city walls — one of history\'s first biological weapons). From Caffa, Genoese trading ships carried it to Sicily in October 1347. Within five years, it had swept across every country in Europe.',
  },
  {
    label: 'The Scale of Death',
    detail:
      'Between 1347 and 1353, the Black Death killed an estimated 30–60% of Europe\'s population — between 25 and 50 million people. Some regions lost 80% or more of their inhabitants. Entire villages were wiped out. Cities lost so many people that there weren\'t enough survivors to bury the dead — mass graves (plague pits) are still being discovered across Europe. The population of Europe in 1400 was lower than it had been in 1200. It took nearly 200 years for the population to recover to pre-plague levels.',
  },
  {
    label: 'Social Upheaval',
    detail:
      'The plague\'s most lasting impact was economic. With 30–60% of the population dead, labor became desperately scarce. Surviving peasants could demand higher wages, better conditions, and freedom from serfdom — because lords needed workers more than workers needed lords. This power shift accelerated the end of feudalism. Peasants who had been bound to the land for centuries suddenly had bargaining power. When lords and governments tried to freeze wages and restrict movement (like England\'s Statute of Labourers, 1351), the result was explosive unrest.',
  },
  {
    label: 'Scapegoating and Persecution',
    detail:
      'Unable to explain the plague, Europeans searched for someone to blame. Jewish communities across Europe were massacred — accused of poisoning wells, despite the obvious fact that Jews were dying of the plague too. Hundreds of Jewish communities were destroyed in the Rhineland, Switzerland, and across Central Europe. Pope Clement VI issued a papal bull defending Jews and pointing out the absurdity of the accusations, but it did little to stop the violence. The Black Death pogroms were among the worst episodes of anti-Semitic violence before the Holocaust.',
  },
  {
    label: 'The Church Weakened',
    detail:
      'The plague devastated the Church\'s authority. Priests died at even higher rates than the general population (because they administered last rites to the dying). The Church couldn\'t explain why God had sent the plague or how to stop it. Flagellant movements — groups of laypeople who whipped themselves publicly to atone for sins — challenged Church authority by bypassing the clergy entirely. The seeds of the Protestant Reformation, still 170 years away, were planted in the Black Death\'s theological crisis.',
  },
];

// ── Medieval Technology ─────────────────────────────────────────────────────

const TECH_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Mechanical Clock (1280s)',
    detail:
      'Before the mechanical clock, time was approximate — measured by sundials, water clocks, and church bells. The invention of the verge escapement mechanism in the late 13th century made precise timekeeping possible for the first time. Mechanical clocks appeared in European cities from the 1280s onward, transforming daily life. For the first time, work hours, market hours, and civic activities could be precisely scheduled. The clock changed how Europeans conceived of time itself — from cyclical and approximate to linear and precise. It was arguably the medieval invention most essential to the eventual Industrial Revolution.',
  },
  {
    label: 'Eyeglasses (1280s, Italy)',
    detail:
      'Reading glasses were invented in northern Italy around 1286 — probably in Florence or Venice. They extended the working lives of scholars, scribes, and craftsmen by decades. Before eyeglasses, most literate people became functionally unable to read fine text by their 40s or 50s. Spectacles meant that experienced scholars could continue working for another 20–30 years. The cumulative effect on scholarship, craft production, and administration was enormous — and it\'s an invention that\'s easy to overlook because we take corrected vision for granted.',
  },
  {
    label: 'Wind and Water Mills: Harnessing Energy',
    detail:
      'Medieval Europe became the first civilization to make extensive use of non-human, non-animal energy. Water mills, inherited from Rome but vastly expanded, powered grain grinding, cloth fulling, iron smelting, and sawmills. Windmills (adapted from Islamic designs) spread across northern Europe where rivers were scarce. By 1086, England\'s Domesday Book recorded over 6,000 water mills — roughly one for every 300 people. This was an energy revolution that dramatically increased productivity and freed human labor for other tasks.',
  },
  {
    label: 'Gothic Architecture: Flying Buttresses',
    detail:
      'The flying buttress was a revolutionary structural innovation. By transferring the lateral thrust of a vaulted ceiling outward through an arched support, it allowed cathedral walls to be much thinner and filled with enormous stained glass windows. The result was buildings of unprecedented height flooded with colored light — a deliberate theological statement about the nature of divine illumination. Gothic cathedrals remain among the most impressive structures ever built — and they were designed and constructed without computers, steel, or modern engineering theory.',
  },
  {
    label: 'Agricultural Tools That Doubled Productivity',
    detail:
      'The heavy plow (with a coulter to cut the soil, a plowshare to slice it, and a moldboard to turn it) could break the thick clay soils of northern Europe that lightweight Roman plows couldn\'t handle. The padded horse collar (replacing the throat-and-girth harness that choked horses when they pulled hard) allowed horses to replace oxen — horses work 50% faster. Combined with three-field rotation, these tools roughly doubled agricultural productivity and made northern Europe — previously marginal farmland — into the continent\'s breadbasket.',
  },
  {
    label: 'The Printing Press (1440): End of the Medieval Era',
    detail:
      'Johannes Gutenberg\'s movable-type printing press (c. 1440) is sometimes treated as a Renaissance invention, but it emerged directly from medieval craft traditions — metallurgy, ink-making, paper production (introduced to Europe via the Islamic world). The press transformed information distribution: before Gutenberg, a single book could take months to copy by hand. Within decades, millions of printed books were circulating across Europe. The printing press ended the medieval era by making the monopoly on knowledge — held by the Church and universities — impossible to maintain.',
  },
];

// ── Late Middle Ages ────────────────────────────────────────────────────────

const LATE_TIMELINE: TimelineEntry[] = [
  {
    year: '1347–1353',
    title: 'Black Death Aftermath — The End of Feudalism Begins',
    description:
      'The Black Death killed 30–60% of Europe\'s population, creating an acute labor shortage. Surviving peasants — suddenly in demand — could negotiate better terms, higher wages, and personal freedom. The old feudal order, which depended on a surplus of cheap labor, began to crumble. When governments tried to suppress wages by law (England\'s Statute of Labourers, 1351), the result was fury, not compliance.',
    color: PLAGUE,
  },
  {
    year: '1381',
    title: 'The Peasants\' Revolt — England Burns',
    description:
      'In 1381, English peasants led by Wat Tyler marched on London, demanding an end to serfdom, lower taxes, and the right to negotiate wages freely. They captured the Tower of London and executed the Archbishop of Canterbury. King Richard II (age 14) met the rebels personally and promised reforms — then had the leaders executed once the revolt dispersed. The uprising was suppressed, but it demonstrated that the feudal order\'s days were numbered. Serfdom effectively disappeared from England within a century.',
    color: CRIMSON,
  },
  {
    year: '1337–1453',
    title: 'The Hundred Years War — England vs. France',
    description:
      'The Hundred Years War (actually 116 years) began as a dynastic dispute over the French throne and became a transformative conflict that helped forge national identities in both England and France. English longbowmen won stunning victories at Crécy (1346) and Agincourt (1415). But Joan of Arc — a teenage peasant girl who claimed divine visions — revived French morale, lifted the Siege of Orléans (1429), and helped crown Charles VII. She was captured, tried for heresy, and burned at the stake (1431) at age 19. France eventually won the war and emerged as a unified nation-state.',
    color: ROSE,
  },
  {
    year: '1378–1417',
    title: 'The Great Schism — Three Popes at Once',
    description:
      'From 1378 to 1417, the Western Church was split by the Great Schism — at one point, three men simultaneously claimed to be the legitimate Pope (in Rome, Avignon, and Pisa). This crisis devastated the Church\'s credibility. If even the Church couldn\'t agree on who was Pope, how could it claim infallible spiritual authority? The Conciliar movement argued that church councils should hold authority over popes. The schism was eventually resolved at the Council of Constance (1414–1418), but the damage to papal prestige was lasting.',
    color: CROSS_RED,
  },
  {
    year: '1453',
    title: 'Fall of Constantinople — End of the Roman World',
    description:
      'On May 29, 1453, Ottoman Sultan Mehmed II conquered Constantinople, ending the Byzantine Empire — the last surviving remnant of the Roman world, which had endured for 1,500 years. Greek scholars fled to Italy, bringing manuscripts of Plato, Aristotle, and other classical authors — directly fueling the Italian Renaissance. The fall also closed traditional overland trade routes to Asia, motivating the Portuguese and Spanish maritime exploration that would discover the Americas. One empire\'s end triggered the beginning of the modern world.',
    color: BURGUNDY,
  },
  {
    year: '1440',
    title: 'Gutenberg\'s Printing Press — Information Revolution',
    description:
      'Johannes Gutenberg\'s movable-type printing press transformed European civilization. Before Gutenberg, producing a single copy of the Bible took a scribe roughly two years. By 1500, an estimated 20 million volumes had been printed across Europe. The press made books affordable, spread literacy, enabled the rapid dissemination of new ideas, and made the Church\'s monopoly on knowledge impossible to maintain. Martin Luther\'s 95 Theses (1517) could never have sparked the Reformation without the printing press to distribute them. The medieval world ended — and the modern world began — with movable type.',
    color: PARCHMENT,
  },
];

// ── Legacy ──────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Universities — Still Running',
    detail:
      'The University of Bologna (1088), the University of Oxford (c. 1096), the University of Paris (c. 1150), and Cambridge (1209) are still operating — their institutional structure essentially unchanged after 800–900 years. The lecture, the examination, the degree, the academic department, tenure, academic freedom, the distinction between undergraduate and graduate study — all medieval inventions. When you attend a university graduation in cap and gown, you\'re wearing medieval academic dress.',
  },
  {
    label: 'Common Law — Still Governing',
    detail:
      'The English common law system — developed by medieval royal judges who traveled circuits hearing cases and gradually building a body of precedent — is the foundation of legal systems in the United States, Canada, Australia, India, and dozens of other countries. The principle of stare decisis (following precedent), the jury trial, habeas corpus, and the distinction between civil and criminal law are all medieval legal innovations. Roughly a third of the world\'s population lives under legal systems derived from medieval English common law.',
  },
  {
    label: 'Gothic Architecture — Still Standing',
    detail:
      'Notre Dame de Paris, Chartres, Canterbury, Cologne, Salisbury, York Minster — Gothic cathedrals built 700–900 years ago are still standing and still in use. They were the tallest buildings in Europe until the 19th century. Their construction required the coordination of thousands of workers over decades, sophisticated engineering knowledge passed down through mason\'s guilds, and enormous financial investment. They remain among the most impressive structures ever built by human hands.',
  },
  {
    label: 'The Nation-State Begins',
    detail:
      'The modern nation-state — a political unit defined by territory, language, and shared identity — began to coalesce in the medieval period. France, England, and Spain emerged as recognizable nations during the 14th and 15th centuries, forged by wars (the Hundred Years War was critical for French national identity), shared language, and centralized royal administration. The medieval foundations of these states — their borders, their legal systems, their parliamentary institutions — are still visible in the modern world.',
  },
  {
    label: 'Our Cultural Obsession',
    detail:
      'No historical period dominates popular culture like the Middle Ages. Game of Thrones, Lord of the Rings, Dungeons & Dragons, The Witcher, Dark Souls, Assassin\'s Creed, Monty Python, medieval fairs and Renaissance festivals — our culture is obsessed with the medieval world. This isn\'t accidental: the medieval period created many of the narrative archetypes (the quest, the knight, the siege, the court intrigue) that still structure our storytelling. We keep returning to the Middle Ages because it\'s where many of our cultural stories began.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Charlemagne',
    years: '742–814 CE',
    contribution:
      'King of the Franks and "Emperor of the Romans." United most of Western Europe, promoted education and literacy (Carolingian Renaissance), standardized handwriting. His empire\'s division (843) created the political map of modern Europe.',
  },
  {
    name: 'Thomas Aquinas',
    years: '1225–1274 CE',
    contribution:
      'Dominican friar and philosopher who synthesized Aristotelian philosophy with Christian theology in his Summa Theologica. Established that faith and reason are compatible — transforming European intellectual life and laying groundwork for modern scientific inquiry.',
  },
  {
    name: 'Eleanor of Aquitaine',
    years: '1122–1204 CE',
    contribution:
      'Queen of France, then Queen of England. Went on Crusade, ruled England as regent, patronized troubadour culture. One of the most powerful figures — male or female — of the 12th century.',
  },
  {
    name: 'Hildegard of Bingen',
    years: '1098–1179 CE',
    contribution:
      'Benedictine abbess, composer, theologian, and naturalist. Composed over 70 liturgical songs, wrote treatises on natural history and medicine, and corresponded with popes and emperors.',
  },
  {
    name: 'Joan of Arc',
    years: '1412–1431 CE',
    contribution:
      'Teenage peasant girl who claimed divine visions, led French armies to lift the Siege of Orléans, and helped crown Charles VII. Captured, tried for heresy, and burned at the stake at age 19. France\'s first national hero.',
  },
  {
    name: 'William the Conqueror',
    years: '1028–1087 CE',
    contribution:
      'Duke of Normandy who invaded England and won the Battle of Hastings (1066). The Norman Conquest transformed English language, law, and culture. Commissioned the Domesday Book (1086).',
  },
  {
    name: 'Saladin',
    years: '1137–1193 CE',
    contribution:
      'Sultan of Egypt and Syria who recaptured Jerusalem from the Crusaders (1187). Renowned for military genius and chivalry — even his enemies respected him. His conquest prompted the Third Crusade.',
  },
  {
    name: 'Christine de Pizan',
    years: '1364–1430 CE',
    contribution:
      'First professional female writer in European literature. Author of "The Book of the City of Ladies," which systematically refuted misogynistic arguments by cataloging women\'s achievements throughout history.',
  },
  {
    name: 'Johannes Gutenberg',
    years: 'c. 1400–1468 CE',
    contribution:
      'Inventor of the movable-type printing press (c. 1440). Transformed information distribution, enabled the spread of literacy, and made the Reformation possible. Arguably the most consequential inventor of the second millennium.',
  },
  {
    name: 'Roger Bacon',
    years: '1214–1292 CE',
    contribution:
      'Franciscan friar who advocated for empirical observation and experimentation — centuries before the Scientific Revolution. Wrote on optics, mathematics, and alchemy. Called "Doctor Mirabilis" (Wonderful Teacher).',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function TimelineCard({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {entries.map((e, i) => (
        <motion.div
          key={e.title}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: e.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '0.85rem', color: SLATE, fontWeight: 600 }}>{e.year}</span>
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{e.title}</h4>
          <p style={{ fontSize: '0.9rem', color: ASH, lineHeight: 1.65, margin: 0 }}>{e.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

function InsightGrid({ entries }: { entries: InsightEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {entries.map((e, i) => (
        <motion.div
          key={e.label}
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
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px' }}>{e.label}</h4>
          <p style={{ fontSize: '0.88rem', color: ASH, lineHeight: 1.65, margin: 0 }}>{e.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}

function FigureGrid({ entries }: { entries: FigureEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {entries.map((e, i) => (
        <motion.div
          key={e.name}
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
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: FIGURE_COLORS[i % FIGURE_COLORS.length], margin: '0 0 2px' }}>
            {e.name}
          </h4>
          <p style={{ fontSize: '0.82rem', color: SLATE, margin: '0 0 8px' }}>{e.years}</p>
          <p style={{ fontSize: '0.88rem', color: ASH, lineHeight: 1.65, margin: 0 }}>{e.contribution}</p>
        </motion.div>
      ))}
    </div>
  );
}

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
  intro?: string;
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
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>{icon}</span> {title}
        </h2>
        {intro && (
          <p style={{ fontSize: '0.93rem', color: ASH, lineHeight: 1.7, margin: '0 0 24px', maxWidth: 720 }}>{intro}</p>
        )}
      </motion.div>
      {children}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function MedievalEuropePage() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    if (root) root.style.overflow = 'auto';
    return () => {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      if (root) root.style.overflow = 'hidden';
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* ── Back link ─────────────────────────────────────────────────────── */}
        <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
          ← Back to Timeline
        </Link>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ margin: '40px 0 48px' }}
        >
          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 20px',
              background: `linear-gradient(135deg, ${PARCHMENT}, ${CATHEDRAL})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Middle Ages — Not Dark, Just Different (500–1500 CE)
          </h1>

          <p style={{ fontSize: '1rem', color: ASH, lineHeight: 1.75, margin: '0 0 16px', maxWidth: 760 }}>
            For centuries, the thousand years between the fall of Rome and the Renaissance were dismissed as the
            "Dark Ages" — a void of ignorance, superstition, and barbarism between two enlightened eras. This is
            one of history's most persistent myths. The medieval period produced universities, Gothic cathedrals,
            parliamentary government, common law, the mechanical clock, eyeglasses, and the printing press.
          </p>
          <p style={{ fontSize: '1rem', color: ASH, lineHeight: 1.75, margin: 0, maxWidth: 760 }}>
            It was a millennium of transformation — sometimes violent, often brilliant, always consequential.
            The world we live in was built on medieval foundations.
          </p>
        </motion.div>

        {/* ── Key Stats ─────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 14, marginBottom: 48 }}>
          {KEY_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: `1px solid ${s.color}33`,
                borderRadius: 10,
                padding: '14px 18px',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: SLATE, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: ASH, marginTop: 2 }}>{s.context}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Callout: "Dark Ages" ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: `${STONE}18`,
            borderLeft: `3px solid ${STONE}`,
            borderRadius: 8,
            padding: '20px 24px',
            marginBottom: 48,
          }}
        >
          <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
            "The term 'Dark Ages' was invented by people trying to make themselves look bright by comparison.
            Modern historians no longer use it — because the medieval period was anything but dark."
          </p>
        </motion.div>

        {/* ── Section 1: The "Dark Ages" Myth ─────────────────────────────── */}
        <SectionWrapper
          id="dark-ages-myth"
          icon="💡"
          title='The "Dark Ages" Myth — Debunked'
          accentColor={PARCHMENT}
          intro="The most damaging myth in popular history: that a thousand years of civilization simply stopped. Here's why it's wrong."
        >
          <InsightGrid entries={DARK_AGES_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 2: Early Middle Ages ─────────────────────────────────── */}
        <SectionWrapper
          id="early"
          icon="⚔"
          title="The Early Middle Ages (500–1000 CE)"
          accentColor={IRON}
          intro="The Roman world didn't vanish overnight. It was gradually replaced by something new — Germanic kingdoms, Christian monasteries, and eventually a new empire under Charlemagne."
        >
          <TimelineCard entries={EARLY_TIMELINE} />

          {/* Charlemagne callout */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: `${GOLD}18`,
              borderLeft: `3px solid ${GOLD}`,
              borderRadius: 8,
              padding: '20px 24px',
              marginTop: 24,
            }}
          >
            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>
              <strong>Carolingian minuscule:</strong> The lowercase letters you're reading right now descend
              from a handwriting style standardized at Charlemagne's court. Before this reform, Latin was written
              in an inconsistent mess of regional scripts. Charlemagne's scholars created a clear, readable script
              that Renaissance scholars later mistook for ancient Roman writing — and adopted as the basis for
              modern typography.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── Section 3: Feudalism ─────────────────────────────────────────── */}
        <SectionWrapper
          id="feudalism"
          icon="🏰"
          title="Feudalism — The Medieval Social Order"
          accentColor={AMBER}
          intro="Not designed by anyone — feudalism evolved organically as Rome's centralized authority collapsed and people turned to local lords for protection."
        >
          <InsightGrid entries={FEUDALISM_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 4: High Middle Ages ──────────────────────────────────── */}
        <SectionWrapper
          id="high"
          icon="🏛"
          title="The High Middle Ages (1000–1300 CE)"
          accentColor={CATHEDRAL}
          intro="Medieval civilization at its peak: population growth, agricultural revolution, the birth of universities, and Gothic cathedrals that still inspire awe."
        >
          <TimelineCard entries={HIGH_TIMELINE} />

          {/* University callout */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: `${CATHEDRAL}18`,
              borderLeft: `3px solid ${CATHEDRAL}`,
              borderRadius: 8,
              padding: '20px 24px',
              marginTop: 24,
            }}
          >
            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>
              <strong>Still running after 900 years:</strong> The University of Bologna (1088) is the oldest
              continuously operating university in the world. Oxford, Paris, and Cambridge followed within a
              century. When you attend a graduation ceremony in cap and gown, you're wearing medieval academic
              dress. The lecture, the exam, the degree — all medieval inventions.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── Section 5: The Crusades ──────────────────────────────────────── */}
        <SectionWrapper
          id="crusades"
          icon="⚔"
          title="The Crusades (1095–1291)"
          accentColor={CROSS_RED}
          intro="Two centuries of holy war that reshaped the relationship between Christianity and Islam — and transformed European trade, knowledge, and politics."
        >
          <InsightGrid entries={CRUSADES_INSIGHTS} />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: `${CROSS_RED}18`,
              borderLeft: `3px solid ${CROSS_RED}`,
              borderRadius: 8,
              padding: '20px 24px',
              marginTop: 24,
            }}
          >
            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>
              <strong>The Fourth Crusade's betrayal (1204):</strong> Intended to recapture Jerusalem, the Fourth
              Crusade was diverted by Venetian commercial interests and instead sacked Constantinople — the
              greatest Christian city in the world. Crusaders looted churches, destroyed priceless artifacts,
              and partitioned the Byzantine Empire. It was the single most destructive event in the long decline
              of Byzantium, and it permanently poisoned relations between Eastern and Western Christianity.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── Section 6: Medieval Women ────────────────────────────────────── */}
        <SectionWrapper
          id="women"
          icon="👑"
          title="Medieval Women — More Than the Stereotype"
          accentColor={ROSE}
          intro="Queens who ruled empires, abbesses who composed music, writers who challenged misogyny, and peasant women who were essential economic partners — not passive victims."
        >
          <InsightGrid entries={WOMEN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 7: The Black Death ───────────────────────────────────── */}
        <SectionWrapper
          id="black-death"
          icon="💀"
          title="The Black Death (1347–1353)"
          accentColor={PLAGUE}
          intro="The most devastating pandemic in human history. In six years, it killed 30–60% of Europe's population — and permanently transformed the continent's social, economic, and religious order."
        >
          <InsightGrid entries={PLAGUE_INSIGHTS} />

          {/* Death toll callout */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: `${PLAGUE}18`,
              borderLeft: `3px solid ${PLAGUE}`,
              borderRadius: 8,
              padding: '20px 24px',
              marginTop: 24,
            }}
          >
            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>
              <strong>The math of catastrophe:</strong> Europe's population was approximately 70 million in 1300.
              By 1400, after the plague, it was roughly 50 million. It did not recover to pre-plague levels until
              approximately 1500 — nearly 200 years later. No event in European history, including both World
              Wars, killed a comparable percentage of the population.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── Section 8: Medieval Technology ───────────────────────────────── */}
        <SectionWrapper
          id="technology"
          icon="⚙"
          title="Medieval Technology and Innovation"
          accentColor={TEAL}
          intro="The 'Dark Ages' produced the mechanical clock, eyeglasses, the printing press, and Gothic engineering — innovations that shaped the modern world."
        >
          <InsightGrid entries={TECH_INSIGHTS} />

          {/* Innovation callout */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: `${TEAL}18`,
              borderLeft: `3px solid ${TEAL}`,
              borderRadius: 8,
              padding: '20px 24px',
              marginTop: 24,
            }}
          >
            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.7, margin: '0 0 12px' }}>
              <strong>Medieval inventions still in daily use:</strong>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['mechanical clock', 'eyeglasses', 'printing press', 'university', 'compass', 'windmill', 'flying buttress', 'common law', 'parliament', 'double-entry bookkeeping', 'quarantine', 'blast furnace'].map((item) => (
                <span
                  key={item}
                  style={{
                    backgroundColor: `${TEAL}22`,
                    border: `1px solid ${TEAL}44`,
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: '0.85rem',
                    color: '#e2e8f0',
                    fontWeight: 500,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </SectionWrapper>

        {/* ── Section 9: Late Middle Ages ──────────────────────────────────── */}
        <SectionWrapper
          id="late"
          icon="🔥"
          title="The Late Middle Ages — Decline of Feudalism (1300–1500)"
          accentColor={BURGUNDY}
          intro="Plague, peasant revolts, a hundred-year war, three competing popes, the fall of Constantinople, and the printing press — the medieval order crumbles and the modern world begins."
        >
          <TimelineCard entries={LATE_TIMELINE} />
        </SectionWrapper>

        {/* ── Section 10: Legacy ───────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🌍"
          title="Legacy — What Medieval Europe Gave Us"
          accentColor={INDIGO}
          intro="Universities, common law, Gothic cathedrals, the nation-state, and the stories we still tell — the medieval world is still with us."
        >
          <InsightGrid entries={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ─────────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures"
          accentColor={GOLD}
          intro="Emperors, philosophers, queens, saints, heretics, and inventors — the individuals who shaped a millennium."
        >
          <FigureGrid entries={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Continue the Story ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ padding: '48px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 16px' }}>
            Continue the Story
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { to: '/roman-fall', label: 'The Fall of Rome' },
              { to: '/byzantine-empire', label: 'The Byzantine Empire' },
              { to: '/crusades', label: 'The Crusades' },
              { to: '/black-death', label: 'The Black Death' },
              { to: '/renaissance', label: 'The Renaissance' },
              { to: '/viking-age', label: 'The Viking Age' },
              { to: '/protestant-reformation', label: 'The Protestant Reformation' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: PARCHMENT,
                  textDecoration: 'none',
                  backgroundColor: `${PARCHMENT}15`,
                  border: `1px solid ${PARCHMENT}33`,
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: '0.88rem',
                }}
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 0', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: SLATE, fontStyle: 'italic', margin: '0 0 16px' }}>
            "The Middle Ages produced the university, the cathedral, the parliament, and the mechanical clock.
            Call that 'dark' if you like — but you're using their inventions to do it."
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
