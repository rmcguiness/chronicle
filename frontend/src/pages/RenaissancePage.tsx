/**
 * RenaissancePage — comprehensive deep-dive into the Renaissance (1300–1600).
 *
 * Sections (tab-navigated):
 *  1. Timeline & Phases
 *  2. Core Ideas
 *  3. Art & Architecture
 *  4. Science & Innovation
 *  5. Literature & Philosophy
 *  6. Patrons & City-States
 *  7. Northern Renaissance & Legacy
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── colour palette ─── */
const ACCENT = '#c2410c'; // warm Renaissance terracotta
const colors = {
  bg: '#070e22',
  bgCard: 'rgba(255,255,255,0.04)',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  border: 'rgba(255,255,255,0.08)',
};

/* ─── types ─── */
type Tab = 'timeline' | 'ideas' | 'art' | 'science' | 'literature' | 'patrons' | 'legacy';

interface Phase {
  name: string;
  period: string;
  summary: string;
  keyEvents: string[];
  color: string;
  icon: string;
}

interface CoreIdea {
  name: string;
  description: string;
  keyFigures: string[];
  icon: string;
  color: string;
}

interface Masterwork {
  title: string;
  artist: string;
  date: string;
  location: string;
  significance: string;
  icon: string;
}

interface ArtTechnique {
  name: string;
  description: string;
  pioneer: string;
}

interface ArchitecturalWork {
  name: string;
  architect: string;
  date: string;
  location: string;
  features: string;
  icon: string;
}

interface Innovation {
  name: string;
  figure: string;
  date: string;
  significance: string;
  category: string;
  icon: string;
}

interface LiteraryWork {
  title: string;
  author: string;
  date: string;
  significance: string;
  icon: string;
}

interface Patron {
  name: string;
  role: string;
  contribution: string;
  icon: string;
  color: string;
}

interface CityState {
  name: string;
  specialty: string;
  keyFigures: string[];
  icon: string;
  color: string;
}

interface NorthernFigure {
  name: string;
  country: string;
  contribution: string;
  icon: string;
}

/* ─── data ─── */

const PHASES: Phase[] = [
  {
    name: 'Proto-Renaissance',
    period: '1300–1400',
    summary: 'The seeds of the Renaissance were planted in late-medieval Italy. Giotto broke from Byzantine flatness to paint figures with weight and emotion, while Dante composed the Divine Comedy in vernacular Italian rather than Latin, signaling a new confidence in human expression.',
    keyEvents: [
      'Giotto\'s Arena Chapel frescoes (c. 1305)',
      'Dante\'s Divine Comedy completed (1320)',
      'Black Death devastates Europe (1347–1351)',
      'Petrarch crowned Poet Laureate in Rome (1341)',
      'Boccaccio writes the Decameron (1353)',
    ],
    color: '#a16207',
    icon: '🌱',
  },
  {
    name: 'Early Renaissance',
    period: '1400–1490',
    summary: 'Florence became the crucible of innovation. Brunelleschi engineered the seemingly impossible dome of the Florence Cathedral, Donatello revived freestanding sculpture, and Masaccio pioneered linear perspective in painting. The Medici family transformed banking wealth into cultural patronage on an unprecedented scale.',
    keyEvents: [
      'Brunelleschi\'s dome completed (1436)',
      'Donatello\'s bronze David (c. 1440)',
      'Gutenberg\'s printing press (c. 1440)',
      'Fall of Constantinople — Greek scholars flee west (1453)',
      'Botticelli\'s Primavera (c. 1482)',
      'Lorenzo de\' Medici rules Florence (1469–1492)',
    ],
    color: '#2563eb',
    icon: '🏛️',
  },
  {
    name: 'High Renaissance',
    period: '1490–1527',
    summary: 'The apex of Renaissance achievement. Leonardo, Michelangelo, and Raphael produced works of unsurpassed mastery in Rome and Florence. Popes Julius II and Leo X became lavish patrons, commissioning the Sistine Chapel ceiling and the new St. Peter\'s Basilica. This era ended abruptly with the Sack of Rome in 1527.',
    keyEvents: [
      'Leonardo\'s Last Supper (1495–1498)',
      'Michelangelo\'s David (1501–1504)',
      'Raphael\'s School of Athens (1509–1511)',
      'Sistine Chapel ceiling completed (1512)',
      'Machiavelli\'s The Prince written (1513)',
      'Martin Luther\'s 95 Theses (1517)',
      'Sack of Rome (1527)',
    ],
    color: '#dc2626',
    icon: '🎨',
  },
  {
    name: 'Northern Renaissance',
    period: '1450–1600',
    summary: 'Renaissance ideas crossed the Alps through trade, printing, and traveling scholars. The Northern Renaissance blended Italian humanism with local traditions: Dürer mastered printmaking in Germany, van Eyck perfected oil painting in Flanders, Erasmus championed Christian humanism, and Shakespeare brought Renaissance drama to its pinnacle in England.',
    keyEvents: [
      'Van Eyck perfects oil painting technique (c. 1430s)',
      'Erasmus publishes In Praise of Folly (1511)',
      'Dürer\'s engravings achieve fame across Europe (1510s)',
      'Thomas More\'s Utopia (1516)',
      'French Renaissance châteaux built (1520s–1550s)',
      'Shakespeare\'s major works (1590s–1610s)',
    ],
    color: '#16a34a',
    icon: '🌍',
  },
];

const CORE_IDEAS: CoreIdea[] = [
  {
    name: 'Humanism',
    description: 'The intellectual foundation of the Renaissance. Humanists studied Greek and Roman texts — literature, philosophy, history, rhetoric — believing that classical learning could improve human life. They championed education, critical thinking, and the idea that humans had the power to shape their own destinies, shifting focus from purely divine concerns to human potential.',
    keyFigures: ['Petrarch', 'Erasmus', 'Pico della Mirandola', 'Lorenzo Valla'],
    icon: '📜',
    color: '#eab308',
  },
  {
    name: 'Individualism',
    description: 'Medieval art and culture emphasized collective identity and religious conformity. The Renaissance celebrated individual genius, personal achievement, and unique perspective. Artists signed their works, writers explored personal experience, and portraiture — including self-portraits — flourished as people saw themselves as worthy subjects.',
    keyFigures: ['Leonardo da Vinci', 'Benvenuto Cellini', 'Leon Battista Alberti'],
    icon: '👤',
    color: '#3b82f6',
  },
  {
    name: 'Secularism',
    description: 'While Renaissance Europeans remained deeply religious, secular themes gained new prominence. Art depicted mythological and everyday scenes alongside sacred subjects. Wealthy merchants and politicians commissioned art celebrating civic life, classical heroes, and human beauty — not just saints and scripture.',
    keyFigures: ['Niccolò Machiavelli', 'Botticelli', 'Giovanni Boccaccio'],
    icon: '🏛️',
    color: '#a855f7',
  },
  {
    name: 'Classical Revival',
    description: 'Renaissance thinkers looked back to ancient Greece and Rome as models of excellence. They recovered lost manuscripts, studied classical architecture, and emulated Roman rhetoric and Greek philosophy. This was not mere imitation — they used classical knowledge as a springboard for new discoveries and creative achievements.',
    keyFigures: ['Poggio Bracciolini', 'Brunelleschi', 'Marsilio Ficino'],
    icon: '🏺',
    color: '#ef4444',
  },
  {
    name: 'New Approach to Knowledge',
    description: 'The Renaissance pioneered empirical observation and experimentation alongside classical study. Leonardo dissected cadavers to understand anatomy, Galileo pointed a telescope at Jupiter\'s moons, and Vesalius overturned centuries of accepted medical doctrine. Knowledge was no longer accepted on authority alone — it had to be verified by direct investigation.',
    keyFigures: ['Leonardo da Vinci', 'Galileo Galilei', 'Andreas Vesalius', 'Nicolaus Copernicus'],
    icon: '🔬',
    color: '#22c55e',
  },
];

const MASTERWORKS: Masterwork[] = [
  { title: 'The Last Supper', artist: 'Leonardo da Vinci', date: '1495–1498', location: 'Santa Maria delle Grazie, Milan', significance: 'Revolutionary use of perspective and psychological drama; each apostle reacts uniquely to Christ\'s announcement of betrayal', icon: '🖼️' },
  { title: 'Vitruvian Man', artist: 'Leonardo da Vinci', date: 'c. 1490', location: 'Gallerie dell\'Accademia, Venice', significance: 'Iconic fusion of art and science — the human body inscribed in perfect geometric forms, embodying Renaissance ideals of proportion', icon: '📐' },
  { title: 'Mona Lisa', artist: 'Leonardo da Vinci', date: '1503–1519', location: 'Louvre Museum, Paris', significance: 'Pioneered sfumato technique; her enigmatic expression and atmospheric depth set a new standard for portraiture', icon: '🖼️' },
  { title: 'David', artist: 'Michelangelo', date: '1501–1504', location: 'Galleria dell\'Accademia, Florence', significance: 'A 17-foot marble colossus capturing the moment before battle — symbol of Florentine civic pride and human perfection', icon: '🗿' },
  { title: 'Sistine Chapel Ceiling', artist: 'Michelangelo', date: '1508–1512', location: 'Vatican City, Rome', significance: 'Over 300 figures across 12,000 sq ft; The Creation of Adam became the most reproduced religious image in history', icon: '⛪' },
  { title: 'Pietà', artist: 'Michelangelo', date: '1498–1499', location: 'St. Peter\'s Basilica, Vatican City', significance: 'Carved at age 24; the only work Michelangelo ever signed. Extraordinary polish and emotional restraint in marble', icon: '🗿' },
  { title: 'The School of Athens', artist: 'Raphael', date: '1509–1511', location: 'Apostolic Palace, Vatican City', significance: 'Grand synthesis of classical philosophy and Renaissance art; features Plato, Aristotle, and contemporaries as ancient philosophers', icon: '🎨' },
  { title: 'The Birth of Venus', artist: 'Sandro Botticelli', date: 'c. 1485', location: 'Uffizi Gallery, Florence', significance: 'First large-scale mythological nude since antiquity; embodied the Neoplatonic ideal of divine beauty', icon: '🐚' },
  { title: 'Primavera', artist: 'Sandro Botticelli', date: 'c. 1482', location: 'Uffizi Gallery, Florence', significance: 'Allegorical celebration of spring with 500+ identified plant species; a masterpiece of Medici-era Florence', icon: '🌸' },
  { title: 'Venus of Urbino', artist: 'Titian', date: '1538', location: 'Uffizi Gallery, Florence', significance: 'Transformed the reclining nude genre; masterful use of Venetian colorito (rich, warm color) over Florentine disegno (drawing)', icon: '🎨' },
  { title: 'Assumption of the Virgin', artist: 'Titian', date: '1516–1518', location: 'Basilica di Santa Maria Gloriosa dei Frari, Venice', significance: 'Monumental altarpiece (22 ft tall) that established Titian as Venice\'s greatest painter; dramatic color and movement', icon: '⛪' },
  { title: 'Bronze David', artist: 'Donatello', date: 'c. 1440', location: 'Bargello Museum, Florence', significance: 'First freestanding nude sculpture since antiquity; revolutionary revival of classical form', icon: '🗿' },
  { title: 'Equestrian Statue of Gattamelata', artist: 'Donatello', date: '1453', location: 'Padua, Italy', significance: 'First large equestrian bronze since Roman times; revived the classical tradition of honoring military heroes', icon: '🐴' },
  { title: 'Gates of Paradise', artist: 'Lorenzo Ghiberti', date: '1425–1452', location: 'Florence Baptistery', significance: 'Gilded bronze doors with 10 relief panels of Old Testament scenes; Michelangelo reportedly called them worthy of Paradise', icon: '🚪' },
  { title: 'Melencolia I', artist: 'Albrecht Dürer', date: '1514', location: 'Various museums (prints)', significance: 'The Northern Renaissance\'s most complex engraving; dense with mathematical and alchemical symbolism, reflecting the intellectual ambition of the age', icon: '🖋️' },
  { title: 'Self-Portrait at Twenty-Eight', artist: 'Albrecht Dürer', date: '1500', location: 'Alte Pinakothek, Munich', significance: 'Boldly Christ-like frontal pose; asserted the artist\'s status as divine creator, not mere craftsman', icon: '🖋️' },
];

const ART_TECHNIQUES: ArtTechnique[] = [
  { name: 'Linear Perspective', description: 'Mathematical system for creating the illusion of depth on a flat surface. Parallel lines converge at a vanishing point, giving paintings architectural precision and spatial realism.', pioneer: 'Filippo Brunelleschi (demonstrated c. 1415); codified by Leon Battista Alberti' },
  { name: 'Chiaroscuro', description: 'Dramatic contrast between light and dark to model three-dimensional form. Creates volume, depth, and emotional intensity — figures seem to emerge from shadow.', pioneer: 'Leonardo da Vinci, later perfected by Caravaggio' },
  { name: 'Sfumato', description: 'Ultra-fine gradations of tone with no visible brushstrokes or harsh outlines. Creates a smoky, atmospheric quality — most famously seen in the Mona Lisa\'s face and the distant landscape behind her.', pioneer: 'Leonardo da Vinci' },
  { name: 'Oil Painting Technique', description: 'Slow-drying oil medium allowed layering, blending, and luminous glazes impossible with tempera. Enabled unprecedented realism in textures — skin, fabric, metal, gemstones.', pioneer: 'Jan van Eyck (perfected in Flanders, c. 1430s)' },
  { name: 'Contrapposto', description: 'Classical pose in which the figure\'s weight rests on one leg, creating a natural S-curve. Revived from ancient Greek sculpture, it gave Renaissance figures dynamic, lifelike movement.', pioneer: 'Donatello (David, c. 1440); Michelangelo (David, 1504)' },
];

const ARCHITECTURE: ArchitecturalWork[] = [
  { name: 'Florence Cathedral Dome', architect: 'Filippo Brunelleschi', date: '1420–1436', location: 'Florence, Italy', features: 'Double-shell dome spanning 144 ft without centering scaffolding — an engineering marvel. Brunelleschi invented new hoisting machines and a herringbone brick pattern. Still the largest masonry dome ever built.', icon: '⛪' },
  { name: 'St. Peter\'s Basilica', architect: 'Bramante, Michelangelo, Maderno, Bernini', date: '1506–1626', location: 'Vatican City, Rome', features: 'The world\'s largest church. Michelangelo designed the massive dome (inspired by Brunelleschi\'s). Combined centralized Greek-cross plan with a Latin-cross nave. Took 120 years and multiple architects.', icon: '⛪' },
  { name: 'Palazzo Medici Riccardi', architect: 'Michelozzo di Bartolomeo', date: '1444–1484', location: 'Florence, Italy', features: 'Prototype of the Renaissance palazzo: rusticated stone base, classical arched windows, interior courtyard. Set the template for aristocratic urban architecture across Italy.', icon: '🏰' },
  { name: 'Tempietto di San Pietro', architect: 'Donato Bramante', date: '1502', location: 'Rome, Italy', features: 'A small circular temple marking the supposed site of St. Peter\'s crucifixion. Pure classical proportions — Doric columns, dome, perfect symmetry. Considered the first masterpiece of High Renaissance architecture.', icon: '🏛️' },
  { name: 'Villa Rotonda', architect: 'Andrea Palladio', date: '1567–1592', location: 'Vicenza, Italy', features: 'Perfectly symmetrical on all four sides with identical temple-front porticos. Palladio\'s principles influenced architecture from Jefferson\'s Monticello to the US Capitol.', icon: '🏛️' },
];

const INNOVATIONS: Innovation[] = [
  { name: 'Heliocentric Model', figure: 'Nicolaus Copernicus', date: '1543', significance: 'De Revolutionibus placed the Sun at the center of the cosmos, overturning 1,400 years of Ptolemaic geocentrism and launching the Scientific Revolution.', category: 'Astronomy', icon: '☀️' },
  { name: 'Telescopic Astronomy', figure: 'Galileo Galilei', date: '1609–1610', significance: 'Observed Jupiter\'s moons, Saturn\'s rings, and lunar craters — providing empirical proof for Copernicus. His conflict with the Church became a defining moment for scientific freedom.', category: 'Astronomy', icon: '🔭' },
  { name: 'Printing Press', figure: 'Johannes Gutenberg', date: 'c. 1440', significance: 'Movable-type printing made books 80% cheaper within decades. By 1500, an estimated 20 million volumes had been printed. Ideas could spread faster than any authority could suppress them.', category: 'Technology', icon: '📖' },
  { name: 'Modern Anatomy', figure: 'Andreas Vesalius', date: '1543', significance: 'De Humani Corporis Fabrica replaced Galen\'s 1,300-year-old anatomical errors with observations from actual human dissection. Founded anatomy as an empirical science.', category: 'Medicine', icon: '🫀' },
  { name: 'Circumnavigation of the Globe', figure: 'Ferdinand Magellan / Juan Sebastián Elcano', date: '1519–1522', significance: 'First voyage around the Earth — proved the planet\'s true size and the existence of a vast Pacific Ocean. Only 18 of 270 crew survived.', category: 'Exploration', icon: '🌎' },
  { name: 'Discovery of the Americas', figure: 'Christopher Columbus', date: '1492', significance: 'Opened contact between the Old and New Worlds, transforming global trade, ecology, and demographics — with devastating consequences for indigenous peoples.', category: 'Exploration', icon: '⛵' },
  { name: 'Double-Entry Bookkeeping', figure: 'Luca Pacioli', date: '1494', significance: 'Codified the accounting system still used today. Enabled the tracking of complex financial transactions that powered Italian banking and global commerce.', category: 'Mathematics', icon: '📊' },
  { name: 'Advances in Cartography', figure: 'Gerardus Mercator', date: '1569', significance: 'The Mercator projection allowed straight-line navigation on maps for the first time, revolutionizing seafaring and our visual understanding of the world.', category: 'Geography', icon: '🗺️' },
];

const LITERARY_WORKS: LiteraryWork[] = [
  { title: 'The Divine Comedy', author: 'Dante Alighieri', date: '1308–1320', significance: 'Epic poem traversing Hell, Purgatory, and Paradise. Written in vernacular Italian rather than Latin — a revolutionary act that helped create the Italian language itself.', icon: '📕' },
  { title: 'The Canzoniere (Songbook)', author: 'Francesco Petrarch', date: 'c. 1327–1374', significance: 'Collection of 366 poems to his beloved Laura. Petrarch\'s introspective style and perfection of the sonnet form shaped European lyric poetry for centuries.', icon: '📜' },
  { title: 'The Decameron', author: 'Giovanni Boccaccio', date: '1353', significance: '100 tales told by ten young people fleeing the Black Death. Frank, witty, and secular — a landmark in prose fiction and social satire.', icon: '📖' },
  { title: 'The Prince', author: 'Niccolò Machiavelli', date: '1513 (published 1532)', significance: 'The first modern work of political science. Argued that effective rulers must be pragmatic rather than idealistic — "it is better to be feared than loved."', icon: '👑' },
  { title: 'In Praise of Folly', author: 'Desiderius Erasmus', date: '1511', significance: 'Satirical attack on Church corruption and scholastic pomposity. Erasmus became the most famous intellectual in Europe — a "Christian humanist" who wanted reform without revolution.', icon: '🃏' },
  { title: 'Utopia', author: 'Thomas More', date: '1516', significance: 'Described an ideal society on a fictional island. Coined the word "utopia" (Greek for "no place") and raised questions about property, tolerance, and justice still debated today.', icon: '🏝️' },
  { title: 'Hamlet, King Lear, Othello', author: 'William Shakespeare', date: '1600–1606', significance: 'Shakespeare\'s great tragedies explored the full range of human psychology with unprecedented depth. His 37 plays and 154 sonnets made him the most influential writer in the English language.', icon: '🎭' },
  { title: 'Oration on the Dignity of Man', author: 'Giovanni Pico della Mirandola', date: '1486', significance: 'Called the "Manifesto of the Renaissance" — argued that humans alone among God\'s creations can choose what to become, placing human free will at the center of philosophy.', icon: '📜' },
];

const PATRONS: Patron[] = [
  { name: 'The Medici Family', role: 'Rulers of Florence & bankers', contribution: 'The de facto rulers of Florence for much of the 15th century. Cosimo de\' Medici spent the equivalent of $500M+ on art and architecture. Lorenzo "the Magnificent" mentored a teenage Michelangelo. The family produced four popes and two queens of France.', icon: '🏦', color: '#eab308' },
  { name: 'Pope Julius II', role: 'The "Warrior Pope" (r. 1503–1513)', contribution: 'Commissioned Michelangelo\'s Sistine Chapel ceiling, Raphael\'s Vatican frescoes, and Bramante\'s design for the new St. Peter\'s. Used art as a tool of papal authority and Roman renewal.', icon: '⛪', color: '#a855f7' },
  { name: 'Pope Leo X (Giovanni de\' Medici)', role: 'Pope (r. 1513–1521)', contribution: 'Continued lavish papal patronage. Reportedly said, "Since God has given us the papacy, let us enjoy it." His spending on art helped trigger the sale of indulgences that provoked Luther\'s Reformation.', icon: '⛪', color: '#a855f7' },
  { name: 'Ludovico Sforza', role: 'Duke of Milan', contribution: 'Patron of Leonardo da Vinci for nearly two decades. Commissioned The Last Supper and supported Leonardo\'s scientific and engineering projects.', icon: '🏰', color: '#3b82f6' },
  { name: 'Isabella d\'Este', role: 'Marchioness of Mantua', contribution: 'Called "The First Lady of the Renaissance." Aggressively collected art, commissioned works from Mantegna, Perugino, and Titian. One of the era\'s most influential cultural tastemakers.', icon: '👑', color: '#ec4899' },
  { name: 'The Merchant Class', role: 'Wealthy guilds & bankers', contribution: 'Guilds like the Arte della Lana (wool merchants) and Arte di Calimala (cloth merchants) funded public art and architecture as civic duty and status display. Competition among wealthy families drove a golden age of patronage.', icon: '💰', color: '#22c55e' },
];

const CITY_STATES: CityState[] = [
  { name: 'Florence', specialty: 'Birthplace of the Renaissance — banking, sculpture, painting, architecture. The Medici-funded crucible where humanism, perspective, and civic art were invented.', keyFigures: ['Brunelleschi', 'Donatello', 'Botticelli', 'Michelangelo', 'Leonardo', 'Machiavelli'], icon: '🏛️', color: '#dc2626' },
  { name: 'Venice', specialty: 'Maritime republic and trading superpower. Known for rich, sensuous colour in painting (Venetian School), glassmaking, printing, and cosmopolitan tolerance.', keyFigures: ['Titian', 'Tintoretto', 'Veronese', 'Giovanni Bellini', 'Aldus Manutius'], icon: '🚢', color: '#2563eb' },
  { name: 'Rome', specialty: 'Center of papal patronage and the High Renaissance. Ancient ruins inspired architects; popes commissioned the era\'s grandest projects.', keyFigures: ['Michelangelo', 'Raphael', 'Bramante', 'Bernini'], icon: '⛪', color: '#a855f7' },
  { name: 'Milan', specialty: 'Wealthy duchy under the Sforza. Center for engineering, military innovation, and Leonardo\'s most productive years.', keyFigures: ['Leonardo da Vinci', 'Bramante (early career)', 'Ludovico Sforza'], icon: '🏰', color: '#16a34a' },
];

const NORTHERN_FIGURES: NorthernFigure[] = [
  { name: 'Albrecht Dürer', country: 'Germany', contribution: 'Master printmaker who bridged Italian and Northern traditions. His engravings and woodcuts spread Renaissance ideals across Northern Europe. First artist to create a series of self-portraits.', icon: '🖋️' },
  { name: 'Jan van Eyck', country: 'Flanders (Belgium)', contribution: 'Perfected oil painting technique, enabling astonishing realism. The Arnolfini Portrait and Ghent Altarpiece are landmarks of Northern art.', icon: '🎨' },
  { name: 'Hieronymus Bosch', country: 'Netherlands', contribution: 'Created fantastical, nightmarish imagery (The Garden of Earthly Delights) that remains mysterious and modern-seeming 500+ years later.', icon: '🎨' },
  { name: 'Pieter Bruegel the Elder', country: 'Netherlands', contribution: 'Painted vivid scenes of peasant life, landscapes, and proverbs. Democratized art by making ordinary people the subject rather than saints and nobles.', icon: '🎨' },
  { name: 'Desiderius Erasmus', country: 'Netherlands', contribution: 'The most famous intellectual in Europe. His editions of the Greek New Testament and satirical writings laid groundwork for both the Reformation and modern biblical scholarship.', icon: '📜' },
  { name: 'Thomas More', country: 'England', contribution: 'Lawyer, statesman, and author of Utopia. Lord Chancellor under Henry VIII; executed for refusing to accept the king\'s supremacy over the Church.', icon: '📜' },
  { name: 'William Shakespeare', country: 'England', contribution: 'Brought Renaissance drama to its pinnacle. Drew on Italian sources (Romeo and Juliet, The Merchant of Venice) and explored the full depth of human psychology.', icon: '🎭' },
  { name: 'Michel de Montaigne', country: 'France', contribution: 'Invented the essay form. His introspective Essais examined the self with radical honesty, influencing philosophy from Descartes to Nietzsche.', icon: '📜' },
  { name: 'François Rabelais', country: 'France', contribution: 'Author of Gargantua and Pantagruel — exuberant, bawdy satire that celebrated human appetite and mocked scholasticism. A landmark of French literature.', icon: '📖' },
];

/* ─── sub-components ─── */

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '12px 16px', background: colors.bgCard, borderRadius: 10, border: `1px solid ${colors.border}`, minWidth: 80 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: ACCENT }}>{value}</div>
      <div style={{ fontSize: 11, color: colors.textDim, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: colors.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</h2>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
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
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );
}

/* ─── section renderers ─── */

function TimelineSection() {
  return (
    <div>
      <SectionHeader icon="📅" title="Timeline & Phases" />
      <p style={{ color: colors.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 24, maxWidth: 800 }}>
        The Renaissance unfolded across three centuries in distinct phases, each building on the last. What began as a cultural stirring in 14th-century Italy grew into a continent-wide transformation of art, science, and thought.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {PHASES.map((phase, i) => (
          <motion.div
            key={phase.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${phase.color}44`,
              borderLeft: `4px solid ${phase.color}`,
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{phase.icon}</span>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: phase.color }}>{phase.name}</h3>
              <span style={{ fontSize: 13, color: colors.textDim, marginLeft: 'auto', fontWeight: 600 }}>{phase.period}</span>
            </div>
            <p style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1.7, margin: '8px 0 14px' }}>{phase.summary}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {phase.keyEvents.map(e => (
                <span key={e} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: `${phase.color}15`, color: phase.color, border: `1px solid ${phase.color}33` }}>{e}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function IdeasSection() {
  return (
    <div>
      <SectionHeader icon="💡" title="Five Core Renaissance Ideas" />
      <p style={{ color: colors.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 24, maxWidth: 800 }}>
        The Renaissance was not just an artistic movement — it was an intellectual revolution. Five interconnected ideas reshaped how Europeans understood themselves, their world, and their potential.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {CORE_IDEAS.map((idea, i) => (
          <motion.div
            key={idea.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${idea.color}44`,
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 24 }}>{idea.icon}</span>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: idea.color }}>{idea.name}</h3>
            </div>
            <p style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1.7, margin: '0 0 12px' }}>{idea.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {idea.keyFigures.map(f => (
                <span key={f} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 6, background: `${idea.color}15`, color: idea.color, border: `1px solid ${idea.color}33` }}>{f}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ArtSection() {
  const [showTechniques, setShowTechniques] = useState(false);

  return (
    <div>
      <SectionHeader icon="🎨" title="Art, Architecture & Masterworks" />
      <p style={{ color: colors.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 20, maxWidth: 800 }}>
        Renaissance artists did not merely create beautiful objects — they reinvented how humans see. Through new techniques and a relentless drive to understand nature, they produced works that still define Western art.
      </p>

      {/* Toggle for techniques */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => setShowTechniques(!showTechniques)}
          style={{
            padding: '8px 16px', borderRadius: 8, border: `1px solid ${ACCENT}44`,
            background: showTechniques ? `${ACCENT}22` : 'transparent',
            color: showTechniques ? ACCENT : colors.textMuted, fontWeight: 600, fontSize: 13,
            cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {showTechniques ? 'Hide' : 'Show'} Revolutionary Techniques
        </button>
        <AnimatePresence>
          {showTechniques && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, marginTop: 14 }}>
                {ART_TECHNIQUES.map(t => (
                  <div key={t.name} style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 16 }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: ACCENT }}>{t.name}</h4>
                    <p style={{ margin: '0 0 8px', fontSize: 13, color: colors.textMuted, lineHeight: 1.6 }}>{t.description}</p>
                    <div style={{ fontSize: 11, color: colors.textDim }}><strong>Pioneer:</strong> {t.pioneer}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Masterworks grid */}
      <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.text, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>16 Masterworks</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {MASTERWORKS.map((work, i) => (
          <motion.div
            key={work.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              padding: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>{work.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{work.title}</div>
                <div style={{ fontSize: 12, color: ACCENT }}>{work.artist} · {work.date}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 6 }}>{work.location}</div>
            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.6 }}>{work.significance}</p>
          </motion.div>
        ))}
      </div>

      {/* Architecture */}
      <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.text, marginTop: 32, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Architecture</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {ARCHITECTURE.map((a, i) => (
          <motion.div
            key={a.name}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{a.icon}</span>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colors.text }}>{a.name}</h4>
              <span style={{ fontSize: 12, color: colors.textDim, marginLeft: 'auto' }}>{a.date}</span>
            </div>
            <div style={{ fontSize: 12, color: ACCENT, marginBottom: 6 }}>{a.architect} · {a.location}</div>
            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.6 }}>{a.features}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ScienceSection() {
  const categories = ['All', ...Array.from(new Set(INNOVATIONS.map(i => i.category)))];
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? INNOVATIONS : INNOVATIONS.filter(i => i.category === filter);

  return (
    <div>
      <SectionHeader icon="🔬" title="Science & Innovation" />
      <p style={{ color: colors.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 20, maxWidth: 800 }}>
        The Renaissance did not just look backward to antiquity — it looked forward with new eyes. Empirical observation, experimentation, and bold hypotheses overturned ancient authorities and laid the groundwork for modern science.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {categories.map(c => (
          <TabButton key={c} label={c} active={filter === c} onClick={() => setFilter(c)} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((inn, i) => (
            <motion.div
              key={inn.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              style={{
                background: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                padding: 18,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{inn.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{inn.name}</div>
                  <div style={{ fontSize: 12, color: ACCENT }}>{inn.figure} · {inn.date}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 11, padding: '2px 8px', borderRadius: 4, background: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}33` }}>{inn.category}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.6 }}>{inn.significance}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LiteratureSection() {
  return (
    <div>
      <SectionHeader icon="📚" title="Literature & Philosophy" />
      <p style={{ color: colors.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 24, maxWidth: 800 }}>
        Renaissance writers reinvented literature in vernacular languages, challenged political orthodoxy, and explored the human condition with unprecedented depth. Their works remain foundational to Western culture.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
        {LITERARY_WORKS.map((work, i) => (
          <motion.div
            key={work.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{work.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{work.title}</div>
                <div style={{ fontSize: 12, color: ACCENT }}>{work.author} · {work.date}</div>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.6 }}>{work.significance}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PatronsSection() {
  return (
    <div>
      <SectionHeader icon="💰" title="Patrons & Power" />
      <p style={{ color: colors.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 24, maxWidth: 800 }}>
        The Renaissance was fuelled by money. Banking fortunes, papal treasuries, and guild wealth created an ecosystem where artists could thrive. Patronage was not charity — it was a tool of political power, civic pride, and personal glory.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
        {PATRONS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${p.color}44`,
              borderLeft: `4px solid ${p.color}`,
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 22 }}>{p.icon}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: p.color }}>{p.name}</h3>
                <div style={{ fontSize: 12, color: colors.textDim }}>{p.role}</div>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.6 }}>{p.contribution}</p>
          </motion.div>
        ))}
      </div>

      {/* City-States */}
      <SectionHeader icon="🏙️" title="Italian City-States" />
      <p style={{ color: colors.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 20, maxWidth: 800 }}>
        Renaissance Italy was not a unified country but a patchwork of competing city-states. Each developed its own cultural identity, and rivalry between them spurred innovation as cities competed for prestige.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {CITY_STATES.map((city, i) => (
          <motion.div
            key={city.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${city.color}44`,
              borderTop: `3px solid ${city.color}`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>{city.icon}</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: city.color }}>{city.name}</h3>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: colors.textMuted, lineHeight: 1.6 }}>{city.specialty}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {city.keyFigures.map(f => (
                <span key={f} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: `${city.color}15`, color: city.color, border: `1px solid ${city.color}33` }}>{f}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LegacySection() {
  return (
    <div>
      <SectionHeader icon="🌍" title="Northern Renaissance" />
      <p style={{ color: colors.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 20, maxWidth: 800 }}>
        Renaissance ideas spread north through trade routes, printed books, and traveling scholars. Northern artists and thinkers absorbed Italian innovations but blended them with distinctly local traditions — Flemish realism, German printmaking, English drama, and French philosophy.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14, marginBottom: 32 }}>
        {NORTHERN_FIGURES.map((fig, i) => (
          <motion.div
            key={fig.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              padding: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{fig.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{fig.name}</div>
                <div style={{ fontSize: 12, color: ACCENT }}>{fig.country}</div>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.6 }}>{fig.contribution}</p>
          </motion.div>
        ))}
      </div>

      {/* End of Renaissance */}
      <SectionHeader icon="🌅" title="End of the Renaissance" />
      <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <p style={{ margin: '0 0 12px', fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>
          The Italian Renaissance was brought to a violent end by the <strong style={{ color: colors.text }}>Italian Wars (1494–1559)</strong>, a series of devastating conflicts in which France, Spain, and the Holy Roman Empire fought over Italian territory. The <strong style={{ color: colors.text }}>Sack of Rome in 1527</strong> by the troops of Charles V was a particularly traumatic blow — unpaid imperial soldiers looted the Eternal City for months, scattering artists and destroying works.
        </p>
        <p style={{ margin: '0 0 12px', fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>
          Meanwhile, the <strong style={{ color: colors.text }}>Protestant Reformation</strong> (sparked by Luther in 1517) split Christendom and led the Catholic Church to launch the <strong style={{ color: colors.text }}>Counter-Reformation</strong>, which imposed new restrictions on art and intellectual freedom. The Council of Trent (1545–1563) tightened control over religious imagery.
        </p>
        <p style={{ margin: 0, fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>
          By the late 16th century, the Renaissance had evolved into <strong style={{ color: colors.text }}>Mannerism</strong> and then the <strong style={{ color: colors.text }}>Baroque</strong>. But its core achievements — empirical science, human-centered art, vernacular literature, and the belief in individual potential — had permanently transformed Western civilization.
        </p>
      </div>

      {/* Legacy */}
      <SectionHeader icon="✨" title="Legacy: How the Renaissance Created the Modern World" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {[
          { title: 'Modern Science', desc: 'The empirical method, born in Renaissance workshops and observatories, became the foundation of the Scientific Revolution and all modern scientific inquiry.', icon: '🔬', color: '#22c55e' },
          { title: 'Individual Rights', desc: 'Renaissance humanism — the belief in human dignity, reason, and potential — planted seeds that flowered into Enlightenment philosophy, democracy, and human rights.', icon: '⚖️', color: '#3b82f6' },
          { title: 'The Information Age', desc: 'Gutenberg\'s printing press was the internet of the 15th century. It democratized knowledge, enabled the Reformation, and made mass literacy possible.', icon: '📖', color: '#a855f7' },
          { title: 'Global Exploration', desc: 'Renaissance navigation and cartography launched the Age of Exploration, connecting continents and (for better and worse) creating the globalized world.', icon: '🌎', color: '#ef4444' },
          { title: 'Artistic Standards', desc: 'Perspective, anatomical accuracy, and emotional realism set standards that dominated art until the 20th century. Every museum is a Renaissance inheritance.', icon: '🖼️', color: '#eab308' },
          { title: 'Secular Education', desc: 'The humanist curriculum — history, literature, rhetoric, ethics — became the model for liberal arts education that universities still follow today.', icon: '🎓', color: '#ec4899' },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${item.color}44`,
              borderTop: `3px solid ${item.color}`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: item.color }}>{item.title}</h4>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.6 }}>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── main page component ─── */

const TABS: { key: Tab; label: string }[] = [
  { key: 'timeline', label: 'Timeline' },
  { key: 'ideas', label: 'Core Ideas' },
  { key: 'art', label: 'Art & Architecture' },
  { key: 'science', label: 'Science' },
  { key: 'literature', label: 'Literature' },
  { key: 'patrons', label: 'Patrons & Cities' },
  { key: 'legacy', label: 'Northern & Legacy' },
];

export default function RenaissancePage() {
  const [tab, setTab] = useState<Tab>('timeline');

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      color: colors.text,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      {/* Hero */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: '48px 24px 36px',
          maxWidth: 960,
          margin: '0 auto',
        }}
      >
        <Link to="/" style={{ color: colors.textDim, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>← Back to Timeline</Link>
        <h1 style={{
          margin: '20px 0 12px',
          fontSize: 'clamp(26px, 5vw, 42px)',
          fontWeight: 800,
          lineHeight: 1.15,
          background: `linear-gradient(135deg, ${ACCENT}, #f97316, #eab308)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          The Renaissance
        </h1>
        <p style={{
          margin: '0 0 20px',
          fontSize: 'clamp(15px, 2.5vw, 18px)',
          color: colors.textMuted,
          fontWeight: 500,
        }}>
          Rebirth of Human Potential · 1300–1600
        </p>

        {/* Overview */}
        <div style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
        }}>
          <p style={{ margin: '0 0 10px', fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>
            The Renaissance — meaning "rebirth" in French — was a cultural, intellectual, and artistic revolution that began in Italy around 1300 and spread across Europe over the next three centuries. It marked the transition from the medieval world to the modern age.
          </p>
          <p style={{ margin: '0 0 10px', fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>
            <strong style={{ color: colors.text }}>Why Italy?</strong> A unique combination of factors: the wealth of Italian city-states from Mediterranean trade, the survival of Roman ruins and manuscripts, the influx of Greek scholars fleeing Constantinople (1453), and fierce competition among cities like Florence, Venice, and Rome to outshine each other in cultural splendor.
          </p>
          <p style={{ margin: 0, fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>
            From Italy, Renaissance ideas radiated outward — carried by printed books, traveling artists, and diplomatic networks — to France, Germany, England, the Netherlands, and beyond, transforming art, science, politics, and thought across the entire continent.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <StatBadge value="300" label="Years" />
          <StatBadge value="16+" label="Masterworks" />
          <StatBadge value="5" label="Core Ideas" />
          <StatBadge value="8" label="Innovations" />
          <StatBadge value="4" label="City-States" />
          <StatBadge value="9" label="Northern Figures" />
        </div>
      </motion.header>

      {/* Tab navigation */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: `${colors.bg}ee`,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${colors.border}`,
        padding: '10px 24px',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TABS.map(t => (
            <TabButton key={t.key} label={t.label} active={tab === t.key} onClick={() => setTab(t.key)} />
          ))}
        </div>
      </div>

      {/* Tab content */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px 64px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {tab === 'timeline' && <TimelineSection />}
            {tab === 'ideas' && <IdeasSection />}
            {tab === 'art' && <ArtSection />}
            {tab === 'science' && <ScienceSection />}
            {tab === 'literature' && <LiteratureSection />}
            {tab === 'patrons' && <PatronsSection />}
            {tab === 'legacy' && <LegacySection />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
