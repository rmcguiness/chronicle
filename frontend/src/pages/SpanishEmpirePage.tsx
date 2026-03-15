import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Theme colours ── */
const GOLD = '#f59e0b';
const CRIMSON = '#dc2626';
const ROYAL_BLUE = '#2563eb';
const EMERALD = '#10b981';
const AMBER = '#d97706';
const VIOLET = '#8b5cf6';
const TEAL = '#14b8a6';
const ROSE = '#f43f5e';
const SLATE = '#94a3b8';
const ASH = '#cbd5e1';
const SILVER = '#a1a1aa';
const SKY = '#38bdf8';
const ORANGE = '#f97316';
const BURGUNDY = '#991b1b';

const FIGURE_COLORS = [GOLD, CRIMSON, ROYAL_BLUE, EMERALD, AMBER, VIOLET, TEAL, ROSE];

/* ── Interfaces ── */
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

interface ExchangeItem {
  name: string;
  direction: 'toAmericas' | 'toEurope';
}

/* ── Key Stats ── */
const KEY_STATS: InsightEntry[] = [
  { label: '13 million km²', detail: 'Spanish Empire at peak — larger than the Roman Empire' },
  { label: '334 years', detail: 'Colonial period in the Americas (1492–1826)' },
  { label: '45,000 tons', detail: 'Silver extracted from Potosí — financed early European capitalism' },
  { label: '500+ million', detail: 'Spanish speakers today — 4th most spoken language worldwide' },
  { label: '21 countries', detail: 'With Spanish as an official language' },
  { label: '~50% of calories', detail: 'Tomatoes, potatoes, and corn now account for roughly half of global caloric intake' },
];

/* ── 1492: The Most Consequential Year ── */
const YEAR_1492: InsightEntry[] = [
  { label: 'Granada Falls (Jan 2)', detail: 'The last Moorish kingdom surrenders — ending 781 years of Reconquista. Spain is unified under Ferdinand and Isabella for the first time.' },
  { label: 'Alhambra Decree (Mar 31)', detail: 'Expulsion of all Jews from Spain. Up to 200,000 Sephardic Jews forced to convert or flee, devastating Spanish intellectual and economic life.' },
  { label: 'Columbus Sails (Aug 3)', detail: 'Funded by the newly unified crown, Columbus departs Palos de la Frontera with 3 ships and 90 men, seeking a westward route to Asia.' },
  { label: 'Columbus Lands (Oct 12)', detail: 'Makes landfall in the Bahamas, believing he has reached the East Indies. Begins the Columbian Exchange and sets in motion the conquest of two continents.' },
];

/* ── Spain Before Empire ── */
const RECONQUISTA_INSIGHTS: InsightEntry[] = [
  { label: '711 — Moorish Invasion', detail: 'Muslim armies from North Africa conquer most of Iberia within 7 years, establishing Al-Andalus — one of medieval Europe\'s most advanced civilizations.' },
  { label: '781 Years of Reconquista', detail: 'Christian kingdoms in northern Iberia spent nearly 8 centuries slowly reconquering the peninsula. This forged a warrior culture, intense Catholic identity, and crusader mentality.' },
  { label: 'Castile and Aragon Unite', detail: 'The 1469 marriage of Isabella of Castile and Ferdinand of Aragon merged Spain\'s two most powerful kingdoms. Together they completed the Reconquista and funded Columbus.' },
  { label: 'Crusader Mentality', detail: 'Centuries of religious warfare gave Spain a unique combination: battle-hardened soldiers, missionary zeal, and the conviction that conquest was God\'s work. This mindset transferred directly to the Americas.' },
  { label: 'The Spanish Inquisition', detail: 'Established in 1478 to enforce Catholic orthodoxy. Targeted conversos (converted Jews) and moriscos (converted Muslims). Created a culture of religious conformity that shaped colonial policy.' },
];

/* ── Columbian Exchange ── */
const COLUMBIAN_EXCHANGE: ExchangeItem[] = [
  { name: 'Horses', direction: 'toAmericas' },
  { name: 'Cattle', direction: 'toAmericas' },
  { name: 'Pigs', direction: 'toAmericas' },
  { name: 'Wheat', direction: 'toAmericas' },
  { name: 'Sugarcane', direction: 'toAmericas' },
  { name: 'Smallpox', direction: 'toAmericas' },
  { name: 'Measles', direction: 'toAmericas' },
  { name: 'Potatoes', direction: 'toEurope' },
  { name: 'Tomatoes', direction: 'toEurope' },
  { name: 'Corn (Maize)', direction: 'toEurope' },
  { name: 'Cacao (Chocolate)', direction: 'toEurope' },
  { name: 'Tobacco', direction: 'toEurope' },
  { name: 'Vanilla', direction: 'toEurope' },
  { name: 'Rubber', direction: 'toEurope' },
];

/* ── Conquistadors ── */
const CORTES_TIMELINE: TimelineEntry[] = [
  { year: '1519', title: 'Cortés Lands in Mexico', description: 'Hernán Cortés arrives with just 508 soldiers, 16 horses, and a few cannons. He scuttles his own ships to prevent retreat — there is no going back.', color: CRIMSON },
  { year: '1519', title: 'Alliance with the Tlaxcalans', description: 'The Tlaxcalans, bitter enemies of the Aztecs, join Cortés with tens of thousands of warriors. Without these indigenous allies, the conquest would have been impossible.', color: AMBER },
  { year: '1519', title: 'Montezuma\'s Hesitation', description: 'Aztec emperor Montezuma II receives Cortés in Tenochtitlán, uncertain whether the strangers are gods. Cortés takes him hostage in his own palace.', color: GOLD },
  { year: '1520', title: 'La Noche Triste', description: 'The Aztecs revolt and drive the Spanish out of Tenochtitlán. Cortés loses 600 soldiers and most of his treasure in a desperate nighttime retreat across the causeways.', color: CRIMSON },
  { year: '1520–21', title: 'Smallpox Devastates Tenochtitlán', description: 'A smallpox epidemic kills an estimated 40% of the city\'s population, including Montezuma\'s successor. The disease did more than any army could.', color: BURGUNDY },
  { year: '1521', title: 'Fall of Tenochtitlán', description: 'Cortés besieges the weakened city for 75 days. When it falls, the Aztec Empire is destroyed. 508 Spaniards and 200,000 native allies defeated an empire of 5–6 million.', color: CRIMSON },
];

const PIZARRO_TIMELINE: TimelineEntry[] = [
  { year: '1532', title: 'Pizarro Arrives in Peru', description: 'Francisco Pizarro lands with just 168 soldiers and 62 horses. The Inca Empire, stretching 4,000 km along the Andes, has a population of 12 million.', color: GOLD },
  { year: '1532', title: 'The Battle of Cajamarca', description: 'Pizarro lures Inca emperor Atahualpa to a meeting, then springs a trap. In 2 hours, the Spanish slaughter 2,000+ unarmed Inca guards. Atahualpa is captured.', color: CRIMSON },
  { year: '1533', title: 'The Ransom Room', description: 'Atahualpa offers to fill a room with gold and two rooms with silver for his freedom. The Spanish collect 6 tons of gold and 12 tons of silver — the largest ransom in history.', color: GOLD },
  { year: '1533', title: 'Execution of Atahualpa', description: 'Despite receiving the ransom, Pizarro has Atahualpa executed by garrote. The Inca Empire, already weakened by civil war and smallpox, collapses.', color: CRIMSON },
  { year: '1533–72', title: 'Inca Resistance', description: 'The Inca neo-state of Vilcabamba resists for 40 years. The last Inca emperor, Túpac Amaru, is captured and executed in 1572 in Cusco\'s main plaza.', color: AMBER },
];

const BRUTAL_REALITY: InsightEntry[] = [
  { label: 'Encomienda System', detail: 'Spanish colonists were "entrusted" with indigenous laborers who were forced to work in mines, fields, and construction. In practice it was slavery with a veneer of legality.' },
  { label: 'Population Collapse', detail: 'The indigenous population of the Americas fell from ~60 million in 1492 to ~6 million by 1600. Smallpox, measles, typhus, and forced labor caused the greatest demographic catastrophe in human history.' },
  { label: 'Aztec Population', detail: 'Pre-conquest: ~5–6 million. Within 100 years: ~1 million. A civilization that built floating gardens, aqueducts, and cities larger than anything in Europe — nearly erased.' },
  { label: 'Maya Resistance', detail: 'The most prolonged conquest: 1527–1697, taking 170 years. The Maya\'s decentralized city-states made them far harder to subdue than the centralized Aztec and Inca empires.' },
];

/* ── Empire at Peak ── */
const EMPIRE_PEAK: InsightEntry[] = [
  { label: '"The Sun Never Sets"', detail: 'At its height, Spain controlled the Americas, Philippines, parts of Italy, the Netherlands, Portugal (1580–1640), and territories in Africa — the first truly global empire.' },
  { label: 'Treasure Fleets', detail: 'Annual convoys carried silver from Potosí and Mexican mines to Seville. The Spanish Main became the world\'s most lucrative and dangerous shipping route, drawing pirates and privateers.' },
  { label: 'Manila Galleons', detail: 'Annual ships sailed from Manila to Acapulco (1565–1815), carrying Chinese silk, porcelain, and spices to the Americas in exchange for New World silver. The first truly global trade route.' },
  { label: '~80 Million People', detail: 'The Spanish Empire governed roughly a third of the world\'s population at its peak — more people than the Roman Empire ever controlled.' },
];

const POTOSI: InsightEntry[] = [
  { label: 'The Mountain That Eats Men', detail: 'Cerro Rico in Potosí (modern Bolivia) was the largest silver deposit ever found. At its peak in the early 1600s, Potosí was one of the largest cities in the world — larger than London, Paris, or Rome.' },
  { label: '45,000 Tons of Silver', detail: 'Between 1545 and 1825, an estimated 45,000 tons of silver were extracted. This wealth financed Spain\'s wars, the Counter-Reformation, and inadvertently funded early capitalism across Europe.' },
  { label: '8 Million Deaths', detail: 'An estimated 8 million indigenous and enslaved African workers died in the mines over three centuries. Workers descended into toxic tunnels, breathing mercury-laden air, with an average life expectancy of months.' },
  { label: 'Global Impact', detail: 'Potosí silver flowed to China via Manila, funded the Dutch East India Company, paid for the Thirty Years\' War, and caused the Price Revolution — massive inflation across Europe.' },
];

/* ── Catholic Mission ── */
const CATHOLIC_MISSION: InsightEntry[] = [
  { label: 'Missionary Conquest', detail: 'Every military expedition was accompanied by Catholic missionaries. Conversion was not optional — indigenous religions were systematically suppressed, temples destroyed, and sacred texts burned.' },
  { label: 'Bartolomé de las Casas', detail: 'Dominican friar who witnessed conquest atrocities and became the most vocal defender of indigenous rights. His 1542 "Short Account of the Destruction of the Indies" shocked Europe and sparked the earliest human rights debate.' },
  { label: 'The Mission System', detail: 'From California to Paraguay, missions became the primary instrument of colonization. The 21 California missions (1769–1833) are still landmarks today, but they were built on forced indigenous labor.' },
  { label: 'Cultural Destruction', detail: 'The Maya had a sophisticated writing system with thousands of texts. Spanish priests burned nearly all of them. Only 4 Maya codices survive — an incalculable loss to human knowledge.' },
  { label: 'Syncretism', detail: 'Despite suppression, indigenous beliefs survived by merging with Catholicism. The Virgin of Guadalupe (1531) — blending Catholic and Aztec imagery — became the most powerful symbol of Mexican identity.' },
];

/* ── Governance ── */
const CASTE_SYSTEM: InsightEntry[] = [
  { label: 'Peninsulares', detail: 'Spanish-born Europeans at the top. Held all major government and church positions. Approximately 0.1% of the colonial population.' },
  { label: 'Criollos (Creoles)', detail: 'People of pure Spanish descent born in the Americas. Wealthy landowners and merchants, but barred from the highest offices. Their resentment eventually fueled independence movements.' },
  { label: 'Mestizos', detail: 'Mixed Spanish and indigenous heritage. The fastest-growing group, forming the backbone of colonial society. Today, mestizo identity defines most of Latin America.' },
  { label: 'Mulatos', detail: 'Mixed Spanish and African heritage. Faced severe legal restrictions but carved out niches in trades, crafts, and the military.' },
  { label: 'Indigenous Peoples', detail: 'Legally "free" but subjected to forced labor (mita, encomienda), tribute payments, and forced relocation into reducciones (planned settlements). Their civilizations\' achievements were systematically erased.' },
  { label: 'Enslaved Africans', detail: 'At the bottom of the hierarchy. An estimated 1.5 million Africans were brought to Spanish America as enslaved laborers, primarily to Caribbean sugar plantations and coastal mines.' },
];

const GOVERNANCE: InsightEntry[] = [
  { label: 'Council of the Indies', detail: 'Based in Madrid, this body governed all Spanish territories in the Americas and Philippines. It wrote laws, appointed officials, and served as the supreme court for colonial disputes.' },
  { label: 'Viceroyalties', detail: 'Four massive administrative units: New Spain (Mexico/Central America), Peru (most of South America), New Granada (Colombia/Venezuela), and Río de la Plata (Argentina/Uruguay). Each had its own viceroy.' },
  { label: '300 Years of Administration', detail: 'The longest colonial period of any major European power. Spanish colonial institutions, legal codes, and city planning still shape Latin American governance today.' },
];

/* ── Rivals and Decline ── */
const DECLINE_TIMELINE: TimelineEntry[] = [
  { year: '1588', title: 'Spanish Armada Defeated', description: 'Philip II sends 130 ships to invade England. Storms and English fire ships destroy the fleet. The myth of Spanish invincibility is shattered, and England emerges as a naval power.', color: ROYAL_BLUE },
  { year: '1568–1648', title: 'Dutch Revolt / Eighty Years\' War', description: 'The Netherlands fights for independence from Spain. The conflict drains Spanish resources and ends with Dutch independence — and the rise of the Dutch Golden Age.', color: ORANGE },
  { year: '1585–1604', title: 'Sir Francis Drake\'s Raids', description: 'English privateer Francis Drake repeatedly raids Spanish treasure ships and colonial ports. His circumnavigation of the globe (1577–80) demonstrated Spain could be attacked anywhere.', color: SKY },
  { year: '1618–1648', title: 'Thirty Years\' War', description: 'Spain exhausts itself fighting for the Catholic cause across Europe. The war costs Spain its position as the dominant European power. The Treaty of Westphalia marks the beginning of the end.', color: CRIMSON },
  { year: '1700–1714', title: 'War of Spanish Succession', description: 'When the last Habsburg king dies without an heir, Europe erupts in war. Spain loses the Netherlands, Italy, and Gibraltar. The Bourbon dynasty replaces the Habsburgs on the Spanish throne.', color: VIOLET },
  { year: '1700s', title: 'The Silver Curse', description: 'Too much silver caused massive inflation (the Price Revolution) but not industrial development. Spain became dependent on New World wealth rather than building a productive economy — a classic "resource curse."', color: GOLD },
];

/* ── Independence ── */
const INDEPENDENCE_TIMELINE: TimelineEntry[] = [
  { year: '1808', title: 'Napoleon Invades Spain', description: 'Napoleon deposes the Spanish king and puts his brother on the throne. With the metropole in chaos, colonial elites see their chance. If the king is illegitimate, why obey his viceroys?', color: CRIMSON },
  { year: '1810', title: 'Mexican Independence Begins', description: 'Father Miguel Hidalgo rings his church bell and issues the Grito de Dolores, rallying indigenous and mestizo followers. Though Hidalgo is executed in 1811, the movement he started cannot be stopped.', color: EMERALD },
  { year: '1810–1824', title: 'Bolívar\'s Campaign', description: 'Simón Bolívar — "The Liberator" — fights across Venezuela, Colombia, Ecuador, Peru, and Bolivia. His vision: a united South American republic. Reality: fragmented nation-states.', color: GOLD },
  { year: '1816–1822', title: 'San Martín\'s Southern Liberation', description: 'José de San Martín leads armies from Argentina across the Andes to liberate Chile (1818) and Peru (1821). His famous meeting with Bolívar in Guayaquil (1822) remains one of history\'s great mysteries.', color: ROYAL_BLUE },
  { year: '1821', title: 'Mexico Achieves Independence', description: 'After 11 years of war, Agustín de Iturbide unites royalists and rebels to declare Mexican independence. The first Mexican Empire lasts only 2 years before becoming a republic.', color: EMERALD },
  { year: '1826', title: 'Mainland Americas Independent', description: 'By 1826, all of mainland Spanish America is independent. 334 years of empire end in less than 20 years — the fastest decolonization in world history. Only Cuba and Puerto Rico remain Spanish.', color: TEAL },
  { year: '1898', title: 'Spanish-American War', description: 'The final act. The United States defeats Spain and takes Cuba, Puerto Rico, Guam, and the Philippines. The empire that once spanned the globe is reduced to a few outposts in Africa.', color: ROSE },
];

/* ── Key Figures ── */
const KEY_FIGURES: FigureEntry[] = [
  { name: 'Christopher Columbus', years: '1451–1506', contribution: 'Genoese navigator who sailed west seeking Asia and found a "New World." His four voyages (1492–1504) began the era of European colonization — and the destruction of indigenous civilizations.' },
  { name: 'Hernán Cortés', years: '1485–1547', contribution: 'Conquered the Aztec Empire with 508 soldiers, native allies, and smallpox. Brilliant political manipulator who exploited divisions among indigenous peoples to overthrow Montezuma II.' },
  { name: 'Francisco Pizarro', years: '1478–1541', contribution: 'Illiterate pig farmer who conquered the Inca Empire with 168 men. Captured emperor Atahualpa, collected the largest ransom in history, then executed him anyway.' },
  { name: 'Bartolomé de las Casas', years: '1484–1566', contribution: 'Dominican friar and former encomendero who became the conscience of the conquest. His writings exposed Spanish atrocities and influenced the New Laws of 1542 protecting indigenous people.' },
  { name: 'Queen Isabella I', years: '1451–1504', contribution: 'Co-ruler of unified Spain who funded Columbus, completed the Reconquista, established the Inquisition, and laid the foundations for the Spanish Empire. One of history\'s most consequential monarchs.' },
  { name: 'Philip II', years: '1527–1598', contribution: 'Ruled the empire at its absolute peak. "Prudent King" who governed from his desk in El Escorial, managing territories across four continents. Lost the Armada but held the empire together.' },
  { name: 'Simón Bolívar', years: '1783–1830', contribution: '"The Liberator" who freed six nations from Spanish rule. Dreamed of a united South America but died disillusioned, saying "those who served the revolution have ploughed the sea."' },
  { name: 'José de San Martín', years: '1778–1850', contribution: 'Argentina\'s national hero who led armies across the Andes to liberate Chile and Peru. Unlike Bolívar, he quietly stepped aside from power — a rare act of selflessness among revolutionaries.' },
];

/* ── Spanish Golden Age ── */
const GOLDEN_AGE: InsightEntry[] = [
  { label: 'Miguel de Cervantes', detail: 'Published Don Quixote (1605/1615) — widely considered the first modern novel. A former soldier and Algerian captive, Cervantes created a work that satirized chivalric romance while inventing narrative techniques still used today.' },
  { label: 'Diego Velázquez', detail: 'Court painter to Philip IV whose masterpiece Las Meninas (1656) is considered one of the greatest paintings in Western art. His revolutionary use of light and perspective influenced every major painter who followed.' },
  { label: 'El Greco', detail: 'Greek-born painter who made Toledo his home. His elongated figures and dramatic lighting in works like The Burial of the Count of Orgaz (1586) were centuries ahead of their time — anticipating Expressionism by 300 years.' },
  { label: 'Lope de Vega', detail: 'The most prolific playwright in history — credited with 1,500+ plays (of which ~425 survive). He essentially invented the Spanish comedia and influenced every subsequent dramatist, including Shakespeare\'s contemporaries.' },
  { label: 'Bartolomé Esteban Murillo', detail: 'Seville\'s greatest painter, known for luminous religious works and unflinching depictions of street children. His paintings defined the image of the Immaculate Conception for centuries of Catholic art.' },
  { label: 'Funded by Silver', detail: 'The entire Golden Age was underwritten by American silver. Philip IV\'s court was the wealthiest in Europe, attracting artists, writers, and intellectuals — even as the empire\'s economic foundations were rotting beneath them.' },
];

/* ── Black Legend vs White Legend ── */
const BLACK_WHITE_LEGEND: InsightEntry[] = [
  { label: 'The Black Legend (La Leyenda Negra)', detail: 'Protestant England and the Netherlands portrayed Spanish colonialism as uniquely cruel — driven by greed, fanaticism, and sadism. While partly propaganda to justify their own imperial ambitions, the Black Legend drew on real and well-documented atrocities.' },
  { label: 'Bartolomé de las Casas\'s Testimony', detail: 'His 1542 "Short Account of the Destruction of the Indies" described mass killings, forced labor, and systematic cruelty in graphic detail. Written to convince the Spanish crown to reform, it was instead translated and weaponized by Spain\'s enemies across Europe.' },
  { label: 'The White Legend (La Leyenda Blanca)', detail: 'Spanish defenders argued that Spain built universities (the first in the Americas: Santo Domingo, 1538), hospitals, cathedrals, and legal protections for indigenous people — things no other colonial power did. The New Laws of 1542 technically abolished indigenous slavery.' },
  { label: 'The Reality', detail: 'Neither legend captures the truth. Spanish colonialism involved systematic exploitation, demographic catastrophe, and cultural destruction — but also individual dissenters, legal debates about indigenous rights (the Valladolid debate of 1550), and genuine attempts at reform. It was brutal even by contemporary standards, and the scale of death was unprecedented.' },
  { label: 'The Valladolid Debate (1550–1551)', detail: 'The Spanish crown convened a formal debate on whether indigenous peoples had souls and rights. Las Casas argued for their full humanity; Juan Ginés de Sepúlveda argued they were "natural slaves." No clear winner, but the debate itself was unique — no other colonial power questioned its own right to conquer.' },
];

/* ── Legacy ── */
const LEGACY: InsightEntry[] = [
  { label: 'Spanish Language', detail: '500+ million speakers across 21 countries. The 4th most spoken language in the world. From Buenos Aires to Manila, the linguistic legacy is inescapable.' },
  { label: 'Catholicism', detail: '40% of the world\'s Catholics live in Latin America. The region\'s churches, festivals, and cultural identity remain profoundly shaped by the missionary conquest.' },
  { label: 'The Columbian Exchange', detail: 'Potatoes saved millions from famine in Europe and Asia. Corn became a global staple. Tomatoes transformed Italian cuisine. Chocolate became universal. These New World crops now account for ~50% of global caloric intake.' },
  { label: 'Silver and Capitalism', detail: 'Potosí silver financed the rise of European capitalism, funded the Dutch East India Company, connected China to the global economy, and caused the Price Revolution that reshaped European society.' },
  { label: 'Mestizo Culture', detail: 'The blending of Spanish, indigenous, and African cultures created something new: Latin American civilization. Art, music, food, architecture, and identity across 21 nations bear the mark of this synthesis.' },
  { label: 'City Planning', detail: 'Spanish colonial cities from Mexico City to Buenos Aires follow the Laws of the Indies grid pattern: central plaza, cathedral, government buildings. This urban design persists in hundreds of cities.' },
  { label: 'Legal Systems', detail: 'Civil law traditions in Latin America descend directly from Spanish colonial codes. Land ownership patterns, social hierarchies, and political cultures remain shaped by 300 years of colonial administration.' },
];

/* ── Sub-components ── */

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
        <p style={{ color: ASH, lineHeight: 1.7, maxWidth: 800, marginBottom: 28 }}>
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
          style={{ borderLeft: `3px solid ${e.color}`, paddingLeft: 18, paddingTop: 4, paddingBottom: 4 }}
        >
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: e.color, marginRight: 8 }} />
          <p style={{ display: 'inline', color: e.color, fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {e.year}
          </p>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f1f5f9', marginTop: 4, marginBottom: 6 }}>
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 18 }}
        >
          <h4 style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 8, fontSize: '1rem' }}>
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

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {figures.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${FIGURE_COLORS[i % FIGURE_COLORS.length]}33`, borderRadius: 10, padding: 18 }}
        >
          <h4 style={{ fontWeight: 600, color: FIGURE_COLORS[i % FIGURE_COLORS.length], marginBottom: 2, fontSize: '1.05rem' }}>
            {f.name}
          </h4>
          <p style={{ fontSize: '0.8rem', color: SLATE, marginBottom: 8 }}>
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

function ExchangeVisual({ items }: { items: ExchangeItem[] }) {
  const toAmericas = items.filter(i => i.direction === 'toAmericas');
  const toEurope = items.filter(i => i.direction === 'toEurope');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'start' }}>
      {/* Europe → Americas */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${CRIMSON}33`, borderRadius: 10, padding: 20 }}
      >
        <h4 style={{ color: CRIMSON, fontWeight: 600, marginBottom: 12, fontSize: '0.95rem' }}>
          Europe &rarr; Americas
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {toAmericas.map((item, i) => (
            <span key={i} style={{
              color: item.name.includes('pox') || item.name.includes('easles') ? ROSE : ASH,
              fontSize: '0.9rem',
              fontWeight: item.name.includes('pox') || item.name.includes('easles') ? 600 : 400,
            }}>
              {item.name}{item.name.includes('pox') || item.name.includes('easles') ? ' (deadliest export)' : ''}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Arrow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 40, fontSize: '2rem', color: GOLD }}
      >
        &#x21C4;
      </motion.div>

      {/* Americas → Europe */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${EMERALD}33`, borderRadius: 10, padding: 20 }}
      >
        <h4 style={{ color: EMERALD, fontWeight: 600, marginBottom: 12, fontSize: '0.95rem' }}>
          Americas &rarr; Europe
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {toEurope.map((item, i) => (
            <span key={i} style={{ color: ASH, fontSize: '0.9rem' }}>
              {item.name}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main Component ── */

export default function SpanishEmpirePage() {
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
    <div style={{ minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* Back link */}
        <div style={{ paddingTop: 28 }}>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            &larr; Back to Timeline
          </Link>
        </div>

        {/* ── Hero ── */}
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
              background: `linear-gradient(135deg, ${GOLD}, ${CRIMSON})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Spanish Empire &mdash; From Reconquista to the Last Colony (1492&ndash;1898)
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <p style={{ color: ASH, lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 800, marginBottom: 16 }}>
              The first empire on which the sun never set. From a newly unified kingdom on Europe&rsquo;s western
              edge, Spain built a dominion spanning four continents, 13 million square kilometres, and 80 million
              people. Its conquistadors toppled civilizations with handfuls of soldiers. Its silver mines financed
              early capitalism. Its missionaries reshaped the spiritual landscape of half the world. And its
              collapse birthed 21 nations.
            </p>
            <p style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 800 }}>
              This is the story of how 508 soldiers defeated an empire of millions, how a single mountain
              killed 8 million workers, and how the foods we eat every day &mdash; potatoes, tomatoes,
              chocolate, corn &mdash; are the living legacy of the greatest ecological exchange in human history.
            </p>
          </motion.div>
        </header>

        {/* ── Key Stats Bar ── */}
        <section style={{ paddingBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {KEY_STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                style={{
                  backgroundColor: 'rgba(245,158,11,0.06)',
                  border: `1px solid ${GOLD}33`,
                  borderRadius: 10,
                  padding: '14px 18px',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: GOLD, fontWeight: 700, fontSize: '1.2rem', marginBottom: 4 }}>
                  {stat.label}
                </p>
                <p style={{ color: ASH, fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {stat.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 1492 Callout ── */}
        <SectionWrapper
          id="year-1492"
          icon="&#x1F451;"
          title="1492 — The Most Consequential Year in History"
          accentColor={GOLD}
          intro="Four events in a single year reshaped the world forever. The fall of Granada ended 781 years of religious war. The expulsion of the Jews shattered one of Europe's most vibrant communities. Columbus sailed west and stumbled onto two continents. And a newly unified Spain — battle-hardened, missionary-driven, and supremely confident — was unleashed upon the world."
        >
          <InsightGrid items={YEAR_1492} />
        </SectionWrapper>

        {/* ── Spain Before Empire ── */}
        <SectionWrapper
          id="reconquista"
          icon="&#x2694;&#xFE0F;"
          title="Spain Before Empire — The Reconquista (711–1492)"
          accentColor={CRIMSON}
          intro="You cannot understand the Spanish Empire without the Reconquista. For 781 years, Christian kingdoms fought to reclaim Iberia from Moorish rule. This centuries-long crusade forged everything that made Spain's conquests possible: hardened soldiers, unshakeable religious conviction, and the belief that warfare in God's name was not just permitted — it was holy."
        >
          <InsightGrid items={RECONQUISTA_INSIGHTS} />
        </SectionWrapper>

        {/* ── Columbian Exchange ── */}
        <SectionWrapper
          id="columbian-exchange"
          icon="&#x1F30D;"
          title="The Columbian Exchange — The Greatest Ecological Event in Human History"
          accentColor={EMERALD}
          intro="When Columbus connected the Old and New Worlds, he triggered the most transformative ecological exchange in history. Animals, plants, and diseases that had evolved separately for millions of years suddenly collided. Horses transformed Plains Indian cultures. Smallpox annihilated civilizations. And New World crops — potatoes, corn, tomatoes — would eventually feed billions and reshape every cuisine on Earth."
        >
          <ExchangeVisual items={COLUMBIAN_EXCHANGE} />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              marginTop: 20,
              backgroundColor: 'rgba(16,185,129,0.06)',
              border: `1px solid ${EMERALD}33`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
              <strong style={{ color: EMERALD }}>Treaty of Tordesillas (1494):</strong> Pope Alexander VI
              drew a line down the Atlantic, giving everything west to Spain and east to Portugal. This single
              papal decree determined why Brazil speaks Portuguese and the rest of Latin America speaks
              Spanish &mdash; a linguistic division that persists to this day across 600 million people.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── Cortés vs Aztecs ── */}
        <SectionWrapper
          id="cortes"
          icon="&#x1F5E1;&#xFE0F;"
          title="Hernán Cortés vs. the Aztec Empire (1519–1521)"
          accentColor={CRIMSON}
          intro="How did 508 Spanish soldiers defeat an empire of 5–6 million people? The answer is not European superiority — it's a devastating combination of biological warfare (smallpox killed 50–90% of indigenous populations), political cunning (Cortés exploited hatred of Aztec rule), military technology (steel, horses, guns), and 200,000 indigenous allies who wanted the Aztecs destroyed."
        >
          <TimelineCard entries={CORTES_TIMELINE} />
        </SectionWrapper>

        {/* ── Pizarro vs Inca ── */}
        <SectionWrapper
          id="pizarro"
          icon="&#x26F0;&#xFE0F;"
          title="Francisco Pizarro vs. the Inca Empire (1532–1572)"
          accentColor={GOLD}
          intro="If Cortés's conquest was improbable, Pizarro's was impossible. 168 men against an empire of 12 million that stretched 4,000 kilometres along the Andes. But the Inca Empire was already weakened by a civil war and a smallpox epidemic that arrived before the Spanish did — killing Emperor Huayna Capac and triggering a succession crisis."
        >
          <TimelineCard entries={PIZARRO_TIMELINE} />
        </SectionWrapper>

        {/* ── Brutal Reality ── */}
        <SectionWrapper
          id="brutal-reality"
          icon="&#x1F480;"
          title="The Brutal Reality of Conquest"
          accentColor={BURGUNDY}
          intro="Behind the tales of adventure lies the greatest demographic catastrophe in human history. Disease, forced labor, and violence reduced the indigenous population of the Americas by up to 90% in the century following contact. Entire civilizations — their languages, knowledge, art, and ways of life — were obliterated."
        >
          <InsightGrid items={BRUTAL_REALITY} />
        </SectionWrapper>

        {/* ── Empire at Peak ── */}
        <SectionWrapper
          id="peak"
          icon="&#x1F30E;"
          title="The Spanish Empire at Its Peak (1550–1700)"
          accentColor={ROYAL_BLUE}
          intro="By the late 1500s, Spain controlled more of the world than any empire before it. From Madrid, Philip II governed territories across four continents. Spanish treasure fleets crossed the Atlantic. Manila galleons crossed the Pacific. The empire was the first truly global system — and its silver was the first global currency."
        >
          <InsightGrid items={EMPIRE_PEAK} />
        </SectionWrapper>

        {/* ── Potosí ── */}
        <SectionWrapper
          id="potosi"
          icon="&#x26CF;&#xFE0F;"
          title="Potosí — The Mountain That Eats Men"
          accentColor={SILVER}
          intro="Cerro Rico de Potosí, in modern-day Bolivia, was the engine of the Spanish Empire and the tragedy of millions. Its silver financed wars, built palaces, funded exploration, and flowed to every corner of the globe. But every ounce came at a cost measured in human lives — an estimated 8 million workers died in its tunnels over three centuries."
        >
          <InsightGrid items={POTOSI} />
        </SectionWrapper>

        {/* ── Spanish Golden Age ── */}
        <SectionWrapper
          id="golden-age"
          icon="&#x1F3A8;"
          title="The Spanish Golden Age (1550–1650)"
          accentColor={AMBER}
          intro="Even as its empire strained under military overreach and economic mismanagement, Spain produced one of the greatest cultural flowerings in European history. The Siglo de Oro — the Golden Century — saw the invention of the modern novel, revolutionary painting techniques, and a theatrical output unmatched before or since. All of it was funded by American silver."
        >
          <InsightGrid items={GOLDEN_AGE} />
        </SectionWrapper>

        {/* ── Black Legend vs White Legend ── */}
        <SectionWrapper
          id="black-white-legend"
          icon="&#x2696;&#xFE0F;"
          title="The Black Legend vs. the White Legend"
          accentColor={SLATE}
          intro="How cruel was the Spanish Empire — and was it uniquely so? For five centuries, this question has been debated, distorted, and weaponized. Protestant rivals painted Spain as singularly barbaric. Spanish defenders pointed to their legal and religious contributions. The truth, as always, is more complicated — and more damning — than either side admits."
        >
          <InsightGrid items={BLACK_WHITE_LEGEND} />
        </SectionWrapper>

        {/* ── Catholic Mission ── */}
        <SectionWrapper
          id="catholic-mission"
          icon="&#x271D;&#xFE0F;"
          title="The Catholic Mission — Saving Souls, Destroying Cultures"
          accentColor={VIOLET}
          intro="The Spanish Empire was not just a political project — it was a religious one. Conversion of indigenous peoples was both a stated goal and a legal justification for conquest. Missionaries accompanied every expedition. Churches were built on the ruins of temples. But the story is not simple: some friars became the most vocal defenders of indigenous rights, creating the first human rights debate in Western history."
        >
          <InsightGrid items={CATHOLIC_MISSION} />
        </SectionWrapper>

        {/* ── Governance ── */}
        <SectionWrapper
          id="governance"
          icon="&#x1F3DB;&#xFE0F;"
          title="Governing a Global Empire"
          accentColor={TEAL}
          intro="Administering territories across four continents from Madrid required an elaborate bureaucratic system. The Spanish created the most sophisticated colonial administration of the early modern period — and imposed a rigid racial hierarchy that shaped Latin American society for centuries."
        >
          <InsightGrid items={GOVERNANCE} />
          <div style={{ marginTop: 24 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: TEAL, marginBottom: 16 }}>
                The Colonial Caste System
              </h3>
            </motion.div>
            <InsightGrid items={CASTE_SYSTEM} />
          </div>
        </SectionWrapper>

        {/* ── Decline ── */}
        <SectionWrapper
          id="decline"
          icon="&#x1F4C9;"
          title="Rivals and Decline (1588–1800)"
          accentColor={ORANGE}
          intro="Spain's decline was not a single event but a slow unravelling across two centuries. Military overreach, religious wars, economic mismanagement, and rising rivals — England, the Netherlands, France — gradually eroded the empire's power. The very silver that had made Spain rich became its curse."
        >
          <TimelineCard entries={DECLINE_TIMELINE} />
        </SectionWrapper>

        {/* ── Independence ── */}
        <SectionWrapper
          id="independence"
          icon="&#x1F3F4;"
          title="Latin American Independence (1808–1898)"
          accentColor={EMERALD}
          intro="When Napoleon invaded Spain in 1808, the colonial system lost its legitimacy overnight. Within two decades, every mainland colony declared independence — the fastest decolonization in world history. From Mexico to Argentina, a generation of revolutionaries transformed Spain's empire into 21 new nations."
        >
          <TimelineCard entries={INDEPENDENCE_TIMELINE} />
        </SectionWrapper>

        {/* ── Key Figures ── */}
        <SectionWrapper
          id="figures"
          icon="&#x1F464;"
          title="Key Figures of the Spanish Empire"
          accentColor={GOLD}
          intro="From the queen who funded discovery to the liberators who ended empire, these are the individuals who shaped three centuries of Spanish dominion — and its eventual collapse."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Legacy ── */}
        <SectionWrapper
          id="legacy"
          icon="&#x1F30E;"
          title="Legacy — The Empire That Shaped the Modern World"
          accentColor={AMBER}
          intro="The Spanish Empire ended nearly two centuries ago, but its fingerprints are everywhere. The language spoken by 500 million people. The Catholicism practiced across an entire continent. The foods on your plate. The cities built on its grid pattern. The racial and economic inequalities that persist in its former colonies. No empire — not even Rome — left a more enduring mark on the world."
        >
          <InsightGrid items={LEGACY} />
        </SectionWrapper>

        {/* ── Connection Links ── */}
        <section style={{ padding: '32px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
              Explore Connected History
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                { to: '/inca-empire', label: 'The Inca Empire' },
                { to: '/aztec-empire', label: 'The Aztec Empire' },
                { to: '/age-of-exploration', label: 'Age of Exploration' },
                { to: '/decolonization', label: 'Decolonization' },
                { to: '/american-revolution', label: 'American Revolution' },
              ].map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  style={{
                    color: GOLD,
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    padding: '8px 16px',
                    border: `1px solid ${GOLD}44`,
                    borderRadius: 8,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${GOLD}15`)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {link.label} &rarr;
                </Link>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px 0 48px', marginTop: 24, textAlign: 'center' }}>
          <p style={{ color: SLATE, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 20px', fontStyle: 'italic' }}>
            &ldquo;Those who served the revolution have ploughed the sea.&rdquo; &mdash; Sim&oacute;n Bol&iacute;var, 1830
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            &larr; Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
