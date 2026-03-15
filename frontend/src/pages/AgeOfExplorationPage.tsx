/**
 * AgeOfExplorationPage — comprehensive deep-dive on the Age of Exploration.
 *
 * Route: /age-of-exploration
 *
 * Sections:
 *  1. Hero — headline, overview
 *  2. Why it happened when it did — Ottoman blockade, new tech, spice hunger
 *  3. Portugal leads the way (1415–1498)
 *  4. Christopher Columbus (1492)
 *  5. The Columbian Exchange — biology that changed the world
 *  6. Mapping the new world — Vespucci, Magellan-Elcano
 *  7. Conquest — Cortés and the Aztecs, Pizarro and the Incas
 *  8. Dividing the world — Treaty of Tordesillas, spice trade
 *  9. Impact on indigenous peoples
 * 10. Key figures
 * 11. Legacy
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
const CYAN = '#06b6d4';
const ORANGE = '#f97316';

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

// ── Why It Happened When It Did ──────────────────────────────────────────────

const WHY_NOW: InsightEntry[] = [
  {
    label: 'Ottomans Block the Silk Road (1453)',
    detail:
      'When the Ottoman Empire conquered Constantinople in 1453, they didn\'t completely close overland trade routes to Asia — but they made them far more expensive, dangerous, and subject to Ottoman middlemen. European merchants who had relied on the Silk Road for spices, silk, and luxury goods suddenly needed an alternative. The incentive to find a sea route became overwhelming.',
  },
  {
    label: 'New Ship Technology: The Caravel',
    detail:
      'The Portuguese caravel was the spacecraft of the 15th century. Combining European square sails with Arab lateen (triangular) sails, it could sail against the wind — a revolutionary capability that made long-distance ocean exploration possible. Combined with the magnetic compass (from China via Arabs), the astrolabe (for latitude), and improved mapmaking, Europeans finally had the technology to sail into the unknown and find their way back.',
  },
  {
    label: 'European Hunger for Spices',
    detail:
      'This wasn\'t about making food taste better — it was about money. Pepper was literally worth its weight in silver. Cinnamon, nutmeg, and cloves were luxury goods that only the wealthy could afford. A single shipload of spices from the East Indies could make a merchant fabulously rich. The profit motive driving exploration was enormous — comparable to the space race or tech startups today.',
  },
  {
    label: 'Portugal\'s Geographic Advantage',
    detail:
      'Portugal sat on the Atlantic coast, facing the open ocean, with easy access to Africa. Prince Henry the Navigator (1394–1460) established a school of navigation at Sagres, systematically funding expeditions down the African coast, collecting geographic knowledge, and training sailors. No other country invested so deliberately in exploration — Portugal was the first nation to treat oceanic discovery as a state project.',
  },
  {
    label: 'Competition Between Crowns',
    detail:
      'The rivalry between the Spanish and Portuguese crowns created an arms race of exploration. When Portugal found one route, Spain funded an alternative. When Columbus sailed west for Spain, Portugal accelerated its push around Africa. This competition drove both nations to take increasingly bold risks — and ultimately divided the entire non-European world between them.',
  },
];

// ── Portugal Leads the Way ───────────────────────────────────────────────────

const PORTUGAL_TIMELINE: TimelineEntry[] = [
  {
    year: '1415',
    title: 'Ceuta Captured — First Colonial Foothold',
    description:
      'Portuguese forces captured Ceuta, a Muslim trading port in North Africa (modern Morocco). It was a military venture, not an exploration — but it gave Portugal its first overseas territory and a taste for expansion. The gold, spices, and trade goods flowing through North African ports convinced the Portuguese crown that Africa held vast wealth worth pursuing.',
    color: GOLD,
  },
  {
    year: '1420s–1460',
    title: 'Prince Henry\'s Systematic Exploration',
    description:
      'Prince Henry the Navigator never actually sailed himself, but he funded and organized decades of expeditions down the African coast. Each voyage pushed a little further south — Madeira (1420), the Azores (1427), Cape Bojador (1434, previously considered the edge of the navigable world), Senegal and Gambia (1440s). Henry built an entire infrastructure of exploration: ships, maps, navigational tools, and trained sailors.',
    color: BLUE,
  },
  {
    year: '1488',
    title: 'Bartolomeu Dias Rounds the Cape of Good Hope',
    description:
      'Dias sailed around the southern tip of Africa — proving that Africa had a southern end and that the Indian Ocean was accessible by sea. He wanted to continue to India, but his exhausted crew forced him to turn back. He named it the "Cape of Storms"; King João II renamed it the "Cape of Good Hope" — because it gave hope of reaching India by sea.',
    color: TEAL,
  },
  {
    year: '1498',
    title: 'Vasco da Gama Reaches India',
    description:
      'Da Gama sailed from Lisbon around Africa to Calicut (modern Kozhikode) on India\'s southwest coast — a 24,000-mile round trip that took over two years. He lost two of four ships and half his crew to scurvy and storms. But he returned with a cargo of spices worth 60 times the cost of the entire expedition. The sea route to Asia was open. The Silk Road was bypassed. The world would never be the same.',
    color: GREEN,
  },
];

// ── Columbus ─────────────────────────────────────────────────────────────────

const COLUMBUS_TIMELINE: TimelineEntry[] = [
  {
    year: '1484–1492',
    title: 'The Pitch: Sailing West to Reach East',
    description:
      'Columbus, a Genoese sailor, believed he could reach Asia by sailing west across the Atlantic. He wasn\'t wrong that the Earth was round — educated Europeans already knew that. He was wrong about its size: he estimated the distance to Japan at about 3,000 miles. The actual distance is 12,500 miles. Portugal\'s experts rejected his plan because they knew his math was wrong. Spain\'s Isabella and Ferdinand funded it anyway — a gamble that paid off, though not in the way anyone expected.',
    color: BLUE,
  },
  {
    year: 'October 12, 1492',
    title: 'Landfall in the Bahamas',
    description:
      'After 36 days at sea, Columbus landed on an island in the Bahamas (probably San Salvador). He encountered the Taíno people and immediately called them "Indians" — believing he had reached the East Indies near Asia. He noted in his journal that they would make good servants and could easily be converted to Christianity. The first encounter set the tone for everything that followed.',
    color: GOLD,
  },
  {
    year: '1492–1504',
    title: 'Four Voyages, Never Knew What He Found',
    description:
      'Columbus made four voyages to the Caribbean and Central/South American coast. He established the first European settlements in the Americas, enslaved indigenous people, and governed so brutally that he was arrested and sent back to Spain in chains on his third voyage. He died in 1506 still insisting he had reached Asia. He never understood that he had stumbled upon continents unknown to Europeans.',
    color: AMBER,
  },
  {
    year: '1492 onward',
    title: 'Columbus\'s Legacy Debate',
    description:
      'Was Columbus a brave explorer or an initiator of genocide? The honest answer is: both are true. He was courageous, skilled, and tenacious. He also enslaved, tortured, and killed indigenous people, and his voyages launched a process that would destroy entire civilizations and kill tens of millions. Understanding Columbus requires holding both truths simultaneously — he changed the world, and much of that change was catastrophic for those already living in it.',
    color: CRIMSON,
  },
];

// ── The Columbian Exchange ───────────────────────────────────────────────────

const EXCHANGE_TO_WORLD: InsightEntry[] = [
  {
    label: 'Potatoes — Transformed European Diet',
    detail:
      'The potato, domesticated in the Andes, became the most important New World crop in Europe. It could grow in poor soil, produced more calories per acre than any European grain, and could be stored underground (safe from marching armies). The potato ended cyclical famines in Northern Europe, fueled population growth, and made the Industrial Revolution possible by feeding factory workers cheaply. Ireland became so dependent on it that when potato blight struck in the 1840s, a million people died.',
  },
  {
    label: 'Tomatoes — Italian Cuisine Wouldn\'t Exist',
    detail:
      'There were no tomatoes in Italy before Columbus. No marinara sauce, no pizza margherita, no bruschetta. Europeans initially feared the tomato (it\'s related to deadly nightshade), but by the 1700s it had transformed Mediterranean cooking. The same goes for chili peppers — Thai, Indian, and Sichuan cuisines as we know them are post-Columbian inventions, built on a New World ingredient.',
  },
  {
    label: 'Corn, Chocolate, Tobacco, Vanilla',
    detail:
      'Corn (maize) became a global staple from Africa to China. Chocolate — originally a bitter Aztec drink — was transformed into Europe\'s favorite luxury. Tobacco created entire colonial economies (Virginia was built on it). Vanilla, turkeys, peanuts, sunflowers, rubber — the New World\'s biological gifts to the Old World were staggering in their variety and impact.',
  },
];

const EXCHANGE_TO_AMERICAS: InsightEntry[] = [
  {
    label: 'Disease: 90% Population Collapse',
    detail:
      'Smallpox, measles, influenza, typhus, and other Old World diseases devastated indigenous populations who had no immunity. Estimates suggest 30 to 100 million people died — roughly 90% of the pre-contact population of the Americas. Entire civilizations collapsed not from European swords but from European germs. Smallpox reached the Aztecs before Cortés did, killing millions and destroying the empire\'s ability to resist. This was the largest demographic catastrophe in human history.',
  },
  {
    label: 'Horses — Transformed the Plains',
    detail:
      'There were no horses in the Americas (they had gone extinct 10,000 years earlier). Spanish horses that escaped or were traded spread across North America, transforming Plains Indian cultures. Nations like the Comanche, Sioux, and Cheyenne became mounted warriors and buffalo hunters, developing entirely new ways of life built around the horse — cultures that lasted until the 19th century.',
  },
  {
    label: 'Sugar + Slavery: The Caribbean Nightmare',
    detail:
      'Sugar cane, brought from the Old World, thrived in the Caribbean. But sugar plantations required enormous labor — and indigenous populations had been decimated by disease. The solution was the Atlantic slave trade. Over 12 million Africans were forcibly transported to the Americas, the majority to sugar plantations in Brazil and the Caribbean. Sugar didn\'t just sweeten European tea — it drove the largest forced migration in human history.',
  },
  {
    label: 'Wheat, Rice, Cattle, Pigs',
    detail:
      'European livestock and crops transformed the American landscape. Cattle and pigs — with no natural predators — multiplied explosively, destroying indigenous croplands and spreading further disease. Wheat replaced native crops. The Americas were biologically colonized alongside their human populations. The ecological transformation was as profound as the political one.',
  },
];

// ── Mapping the New World ────────────────────────────────────────────────────

const MAPPING_TIMELINE: TimelineEntry[] = [
  {
    year: '1499–1502',
    title: 'Amerigo Vespucci: "These Are New Continents"',
    description:
      'Vespucci, a Florentine navigator sailing for Spain and Portugal, explored the coast of South America and realized something Columbus never accepted: this was not Asia. These were entirely new continents, unknown to European, Asian, or African geographers. His letters, widely published, convinced European intellectuals of the discovery. A German mapmaker named the new lands "America" after him in 1507. Columbus discovered the Americas, but Vespucci got the naming.',
    color: INDIGO,
  },
  {
    year: '1519–1522',
    title: 'Magellan-Elcano Circumnavigation',
    description:
      'Ferdinand Magellan, a Portuguese captain sailing for Spain, set out to find a western route to the Spice Islands. He navigated the treacherous strait at the southern tip of South America (now the Strait of Magellan), entered an ocean so calm he named it the "Pacific," and crossed it in a horrific 99-day voyage where his crew ate rats, sawdust, and leather. Magellan was killed in the Philippines in April 1521.',
    color: CYAN,
  },
  {
    year: 'September 6, 1522',
    title: 'Elcano Completes the Journey',
    description:
      'Juan Sebastián Elcano, a Basque sailor, took command after Magellan\'s death and brought one ship — the Victoria — back to Spain with just 18 survivors of the original 270 men and 5 ships. It was the first circumnavigation of the Earth. Proof that the world could be sailed around, that the Pacific existed, and that the Americas were truly separate continents between two vast oceans. The map of the world was finally, roughly, correct.',
    color: TEAL,
  },
];

// ── Conquest ─────────────────────────────────────────────────────────────────

const CONQUEST_TIMELINE: TimelineEntry[] = [
  {
    year: '1519–1521',
    title: 'Hernán Cortés and the Aztecs',
    description:
      'Cortés landed in Mexico with about 500 soldiers, 16 horses, and a few cannons. He was facing the Aztec Empire — a civilization of millions with a capital city, Tenochtitlan, larger than any city in Europe. How did he win? Four factors: indigenous allies (the Aztecs had many enemies who joined Cortés), superior steel weapons and horses, ruthless tactical brilliance, and above all, smallpox — which killed millions of Aztecs, including Emperor Cuitláhuac, before Cortés launched his final assault. By August 1521, Tenochtitlan lay in ruins.',
    color: CRIMSON,
  },
  {
    year: '1532',
    title: 'Francisco Pizarro and the Incas',
    description:
      'Pizarro, an illiterate former swineherd, conquered the Inca Empire with just 168 men. He arrived during an Inca civil war and captured Emperor Atahualpa at the Battle of Cajamarca through an audacious ambush. Atahualpa offered to fill a room with gold and two rooms with silver as ransom. Pizarro took the treasure — the largest ransom in history — and executed Atahualpa anyway. The Inca Empire, which had ruled 12 million people across 2,500 miles of the Andes, collapsed within a generation.',
    color: GOLD,
  },
];

// ── Dividing the World ───────────────────────────────────────────────────────

const TRADE_AND_TREATIES: InsightEntry[] = [
  {
    label: 'Treaty of Tordesillas (1494)',
    detail:
      'After Columbus\'s first voyage, Pope Alexander VI drew a line down the Atlantic — everything west of it belonged to Spain, everything east to Portugal. The Treaty of Tordesillas adjusted this line, giving Portugal Brazil (which is why Brazil speaks Portuguese while the rest of South America speaks Spanish). Two European nations, with the Pope\'s blessing, simply divided the entire non-European world between themselves. No one asked the people who lived there.',
  },
  {
    label: 'The Spice Trade Economics',
    detail:
      'Nutmeg from the tiny Banda Islands in Indonesia was worth more than gold by weight in European markets. A sack of pepper could buy a house. These astronomical profit margins drove the Dutch East India Company into Indonesia (where they would rule for 350 years), the British into India, and the Portuguese to build a chain of trading posts from Mozambique to Macau. The spice trade was the engine of European colonial expansion — every empire was built on the quest for profit.',
  },
];

// ── Impact on Indigenous Peoples ─────────────────────────────────────────────

const INDIGENOUS_IMPACT: InsightEntry[] = [
  {
    label: 'Population Collapse',
    detail:
      'The indigenous population of the Americas fell by an estimated 90% within 150 years of contact — from perhaps 60-100 million to fewer than 6 million. This was the largest demographic catastrophe in recorded history. Entire peoples, languages, and cultures vanished. The Caribbean Taíno, the first people Columbus encountered, were effectively extinct within 50 years.',
  },
  {
    label: 'Encomienda System',
    detail:
      'The Spanish encomienda system granted colonists the right to demand tribute and forced labor from indigenous communities. In practice, it was slavery in all but name. Indigenous people were worked to death in mines and on plantations. Bartolomé de las Casas, a Spanish priest who witnessed the brutality firsthand, wrote devastating accounts that shocked Europe — though they changed little on the ground.',
  },
  {
    label: 'Cultural Destruction',
    detail:
      'European colonizers systematically destroyed indigenous knowledge systems, religious practices, and cultural institutions. The Spanish burned virtually all Aztec and Maya codices (books). Missionaries suppressed indigenous religions. Languages were forbidden. The loss to human knowledge was incalculable — imagine if someone had burned every library in Europe and made it illegal to speak European languages.',
  },
  {
    label: 'Resistance and Survival',
    detail:
      'Indigenous peoples were not passive victims. The Mapuche of Chile resisted Spanish conquest for over 300 years. The Aztec siege of Tenochtitlan lasted months. Countless communities adapted, negotiated, and preserved cultural practices in secret. Indigenous peoples and their descendants — over 40 million in the Americas today — carry forward traditions, languages, and knowledge that survived centuries of attempted erasure.',
  },
];

// ── Key Figures ──────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Prince Henry the Navigator',
    years: '1394–1460',
    contribution:
      'Never sailed himself, but funded and organized Portugal\'s systematic exploration of the African coast. Created the infrastructure — navigation school, ship design, mapmaking — that made Portugal the world\'s first maritime superpower. Without Henry, the Age of Exploration might have started decades later.',
  },
  {
    name: 'Vasco da Gama',
    years: '1460–1524',
    contribution:
      'First European to reach India by sea (1498), opening the spice trade route that would make Portugal the wealthiest nation in Europe. His voyage was brutal — he lost half his crew — and his diplomacy in India was arrogant and violent. But the route he pioneered connected Europe and Asia by sea for the first time.',
  },
  {
    name: 'Christopher Columbus',
    years: '1451–1506',
    contribution:
      'Reached the Americas in 1492, initiating permanent European contact with the New World. A skilled navigator and tenacious self-promoter, he was also a brutal colonial governor. His four voyages launched the Columbian Exchange — the most consequential biological event since the Ice Age — and began the process that would reshape every continent.',
  },
  {
    name: 'Amerigo Vespucci',
    years: '1451–1512',
    contribution:
      'Explored the coast of South America and, crucially, recognized that these lands were new continents — not Asia. His published letters convinced Europe of the discovery, and a German mapmaker named the continents "America" after him in 1507. Columbus found the Americas; Vespucci understood what they were.',
  },
  {
    name: 'Ferdinand Magellan',
    years: '1480–1521',
    contribution:
      'Led the first expedition to circumnavigate the Earth (though he died in the Philippines before it was completed). Navigated the strait that bears his name and named the Pacific Ocean. Proved that the world could be sailed around and that the Americas were truly separate from Asia.',
  },
  {
    name: 'Hernán Cortés',
    years: '1485–1547',
    contribution:
      'Conquered the Aztec Empire with a tiny force, exploiting indigenous divisions, superior weapons, and the devastating impact of smallpox. Destroyed Tenochtitlan and built Mexico City on its ruins. One of history\'s most ruthlessly effective military commanders — and one of its most destructive.',
  },
  {
    name: 'Bartolomé de las Casas',
    years: '1484–1566',
    contribution:
      'Spanish priest who became the first great advocate for indigenous rights. His "A Short Account of the Destruction of the Indies" (1552) documented Spanish atrocities in graphic detail. He argued that indigenous people were fully human with natural rights — a radical position for his time. Called "Protector of the Indians," though his proposed alternative (importing African slaves) created its own legacy of horror.',
  },
  {
    name: 'Francisco Pizarro',
    years: '1478–1541',
    contribution:
      'Conquered the Inca Empire with just 168 men, exploiting a civil war and executing Emperor Atahualpa after receiving the largest ransom in history. An illiterate former swineherd who became one of the wealthiest men in the world — and was eventually assassinated by rivals in his own faction.',
  },
];

// ── Legacy ───────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Modern World Map',
    detail:
      'Before 1492, no civilization knew the full geography of the Earth. By 1522, the basic shape of the world was known. The Age of Exploration created the map we still use — connecting continents that had been isolated for tens of thousands of years. For better and worse, it made the world one interconnected system for the first time.',
  },
  {
    label: 'Global Trade Systems',
    detail:
      'The trade networks established during the Age of Exploration — Atlantic triangular trade, the Manila Galleon route, Portuguese trading posts from Africa to Japan — became the foundation of the modern global economy. The shipping lanes, port cities, and trade relationships established in the 1500s still shape international commerce today.',
  },
  {
    label: 'Racial Hierarchy and Colonialism',
    detail:
      'Europeans constructed racial hierarchy concepts to justify their conquest and enslavement of non-European peoples. The idea that Europeans were inherently superior — and therefore entitled to rule others — became embedded in legal systems, religious doctrine, and cultural attitudes that shaped colonialism for 500 years. The racial categories created during this period still influence societies worldwide.',
  },
  {
    label: 'Columbian Exchange Biology',
    detail:
      'We still live with the biological consequences of the Columbian Exchange every day. The food on your plate — potatoes, tomatoes, corn, wheat, rice, beef, chicken — reflects the mixing of Old and New World species. The demographic composition of the Americas — with populations of European, African, and indigenous descent — is a direct result of the movements of people, plants, animals, and diseases that began in 1492.',
  },
  {
    label: 'The Central Lesson',
    detail:
      'The Age of Exploration shows how technological capability, economic incentive, and political competition can combine to reshape the entire world in just a few generations. It also shows the human cost of that transformation — the tens of millions who died, the civilizations destroyed, the cultures erased. Understanding this era means understanding both the remarkable human drive to explore and connect, and the devastating consequences when exploration becomes conquest.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SectionWrapper({
  title,
  icon,
  borderColor,
  children,
}: {
  title: string;
  icon: string;
  borderColor: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        marginTop: 56,
        borderTop: `2px solid ${borderColor}`,
        paddingTop: 32,
      }}
    >
      <h2
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: borderColor,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 28 }}>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TimelineCard({
  entry,
  index,
}: {
  entry: TimelineEntry;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      style={{
        position: 'relative',
        paddingLeft: 28,
        marginBottom: 32,
        borderLeft: `3px solid ${entry.color}`,
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: -7,
          top: 4,
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: entry.color,
          boxShadow: `0 0 8px ${entry.color}88`,
        }}
      />
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: entry.color,
          marginBottom: 2,
          letterSpacing: 0.5,
        }}
      >
        {entry.year}
      </p>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: '#f1f5f9' }}>
        {entry.title}
      </h3>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: '#94a3b8' }}>
        {entry.description}
      </p>
    </motion.div>
  );
}

function InsightGrid({ items, accentColor }: { items: InsightEntry[]; accentColor: string }) {
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
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${accentColor}33`,
            borderRadius: 10,
            padding: '18px 20px',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = `${accentColor}88`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = `${accentColor}33`;
          }}
        >
          <h4
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: accentColor,
              marginBottom: 8,
            }}
          >
            {item.label}
          </h4>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: '#94a3b8' }}>
            {item.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  const colors = [RED, BLUE, ROSE, GOLD, INDIGO, TEAL, CYAN, ORANGE];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {figures.map((fig, i) => {
        const c = colors[i % colors.length];
        return (
          <motion.div
            key={fig.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${c}33`,
              borderRadius: 10,
              padding: '18px 20px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = `${c}88`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = `${c}33`;
            }}
          >
            <h4 style={{ fontSize: 16, fontWeight: 700, color: c, marginBottom: 2 }}>
              {fig.name}
            </h4>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{fig.years}</p>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: '#94a3b8' }}>
              {fig.contribution}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

export default function AgeOfExplorationPage() {
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
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', sans-serif",
        overflowX: 'hidden',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 28px 80px' }}>
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <header
          style={{
            paddingTop: 48,
            paddingBottom: 40,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              fontSize: 13,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 24,
            }}
          >
            ← Back to Timeline
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: 38,
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 20,
              background: `linear-gradient(135deg, ${GOLD}, ${TEAL})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Age of Exploration — When Europe Reached Out and Changed the World Forever
            (1415–1620)
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ fontSize: 17, lineHeight: 1.75, color: '#94a3b8', maxWidth: 780 }}
          >
            In 200 years, Europeans connected every continent — transforming{' '}
            <span style={{ color: GOLD, fontWeight: 600 }}>global trade</span>, culture,
            disease, and demographics. Driven by the{' '}
            <span style={{ color: TEAL, fontWeight: 600 }}>hunger for spices</span>, armed
            with new ship technology, and racing against rival crowns, Portuguese and Spanish
            explorers sailed into the unknown and stumbled upon{' '}
            <span style={{ color: BLUE, fontWeight: 600 }}>continents no European knew existed</span>.
            What followed was the{' '}
            <span style={{ color: GREEN, fontWeight: 600 }}>Columbian Exchange</span> — the
            most consequential biological event since the Ice Age — alongside{' '}
            <span style={{ color: CRIMSON, fontWeight: 600 }}>conquest, enslavement, and the
            destruction of civilizations</span> that had flourished for millennia.
          </motion.p>
        </header>

        {/* ── Why It Happened When It Did ────────────────────────────── */}
        <SectionWrapper title="Why It Happened When It Did" icon="⚡" borderColor={AMBER}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            The Age of Exploration didn't happen randomly. Five forces converged in the 15th
            century that made oceanic exploration both possible and irresistible — a combination
            of geopolitical crisis, technological breakthrough, economic incentive, geographic
            advantage, and political competition.
          </p>
          <InsightGrid items={WHY_NOW} accentColor={AMBER} />
        </SectionWrapper>

        {/* ── Portugal Leads the Way ─────────────────────────────────── */}
        <SectionWrapper title="Portugal Leads the Way (1415–1498)" icon="⛵" borderColor={BLUE}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            Portugal — a small nation on the edge of Europe — became the world's first maritime
            superpower through decades of systematic, state-funded exploration. While other
            European nations fought internal wars, Portugal was methodically pushing down the
            African coast, inching toward the prize: a sea route to India and the spice trade.
          </p>
          {PORTUGAL_TIMELINE.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Christopher Columbus ───────────────────────────────────── */}
        <SectionWrapper title="Christopher Columbus (1492)" icon="🧭" borderColor={GOLD}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            Columbus didn't discover America — millions of people already lived there. He didn't
            prove the Earth was round — educated Europeans already knew that. What he did was
            establish permanent contact between the Eastern and Western hemispheres, launching
            the most transformative — and destructive — exchange in human history.
          </p>
          {COLUMBUS_TIMELINE.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── The Columbian Exchange ─────────────────────────────────── */}
        <SectionWrapper
          title="The Columbian Exchange: Biology That Changed the World"
          icon="🌱"
          borderColor={GREEN}
        >
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            The Columbian Exchange — the transfer of plants, animals, diseases, and people
            between the Old and New Worlds — was the most consequential biological event since
            the Ice Age. It reshaped diets, demographics, and ecosystems on every continent.
            We still live with its effects every single day.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 700, color: GREEN, marginBottom: 16 }}>
            Americas → World
          </h3>
          <InsightGrid items={EXCHANGE_TO_WORLD} accentColor={GREEN} />

          <h3 style={{ fontSize: 18, fontWeight: 700, color: CRIMSON, marginTop: 32, marginBottom: 16 }}>
            World → Americas
          </h3>
          <InsightGrid items={EXCHANGE_TO_AMERICAS} accentColor={CRIMSON} />
        </SectionWrapper>

        {/* ── Mapping the New World ──────────────────────────────────── */}
        <SectionWrapper title="Mapping the New World" icon="🗺" borderColor={INDIGO}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            After Columbus, a generation of explorers mapped the true shape of the Americas
            and proved that the world could be circumnavigated. Within 30 years of Columbus's
            first voyage, the basic geography of the Earth was known for the first time in
            human history.
          </p>
          {MAPPING_TIMELINE.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Conquest ───────────────────────────────────────────────── */}
        <SectionWrapper title="Conquest: Steel, Germs, and Empires" icon="⚔" borderColor={CRIMSON}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            The two most dramatic conquests in history happened within a decade of each other.
            Tiny bands of Spanish conquistadors — armed with steel, horses, guns, indigenous
            allies, and above all, epidemic disease — toppled the two largest empires in the
            Americas.
          </p>
          {CONQUEST_TIMELINE.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Dividing the World ─────────────────────────────────────── */}
        <SectionWrapper title="Dividing the World: Treaties and Trade" icon="📜" borderColor={PURPLE}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            As European powers realized the scale of what they had found, they moved to claim
            and divide the world among themselves — with the Pope's blessing. The economics of
            the spice trade drove colonial empires that would last for centuries.
          </p>
          <InsightGrid items={TRADE_AND_TREATIES} accentColor={PURPLE} />
        </SectionWrapper>

        {/* ── Impact on Indigenous Peoples ────────────────────────────── */}
        <SectionWrapper
          title="Impact on Indigenous Peoples"
          icon="🪶"
          borderColor={ROSE}
        >
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            The Age of Exploration was, for the people already living in the "discovered" lands,
            an age of catastrophe. The scale of death, displacement, and cultural destruction
            was unlike anything in recorded history.
          </p>
          <InsightGrid items={INDIGENOUS_IMPACT} accentColor={ROSE} />
        </SectionWrapper>

        {/* ── Key Figures ────────────────────────────────────────────── */}
        <SectionWrapper title="Key Figures" icon="👤" borderColor={CYAN}>
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Legacy ─────────────────────────────────────────────────── */}
        <SectionWrapper title="Legacy: The World We Live In" icon="🌍" borderColor={TEAL}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            The Age of Exploration created the modern world — for better and worse. Every
            continent was connected, every ocean was mapped, and the biological, cultural, and
            political consequences still shape our daily lives 500 years later.
          </p>
          <InsightGrid items={LEGACY_INSIGHTS} accentColor={TEAL} />
        </SectionWrapper>

        {/* ── Bottom nav ──────────────────────────────────────────────── */}
        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              fontSize: 14,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ← Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
