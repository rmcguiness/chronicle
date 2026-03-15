/**
 * ProtestantReformationPage — comprehensive deep-dive on the Protestant Reformation (1517–1648).
 *
 * Route: /protestant-reformation
 *
 * Sections:
 *  1. Hero — "Here I Stand", opening hook about 95 Theses going viral
 *  2. The Medieval Catholic Church — pre-1517 context, corruption, indulgences
 *  3. Martin Luther — The Spark — 95 Theses, Diet of Worms, excommunication
 *  4. Luther's Core Ideas — Sola Scriptura, Sola Fide, Priesthood of all believers
 *  5. The Spread — Zwingli, Calvin, Knox, Anabaptists
 *  6. The English Reformation — Henry VIII's personal break with Rome
 *  7. The Catholic Counter-Reformation — Council of Trent, Jesuits, Inquisition
 *  8. The Wars of Religion — Peasants' War through Thirty Years War
 *  9. Legacy — How the Reformation changed everything
 * 10. Key Figures
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const PARCHMENT = '#d4a574';
const RED = '#ef4444';
const BLUE = '#3b82f6';
const ASH = '#94a3b8';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const GOLD = '#f59e0b';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const CHURCH_RED = '#991b1b';
const REFORMATION_GOLD = '#ca8a04';

const FIGURE_COLORS = [REFORMATION_GOLD, BLUE, CRIMSON, TEAL, GREEN, RED, PURPLE, AMBER, GOLD, INDIGO];

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

// ── Section 1: Medieval Catholic Church ─────────────────────────────────────

const MEDIEVAL_CHURCH: TimelineEntry[] = [
  {
    year: 'c. 500–1500',
    title: 'Universal Religious Authority',
    description:
      'For a thousand years, the Roman Catholic Church was the single unifying institution of Western Europe. Every king, peasant, and scholar lived within its spiritual jurisdiction. There was one Bible (in Latin), one interpretation (the Church\'s), and one path to salvation (through the sacraments).',
    color: CHURCH_RED,
  },
  {
    year: 'c. 1000–1500',
    title: 'Corruption Takes Root',
    description:
      'Simony — the selling of church offices to the highest bidder. Nepotism — popes appointing relatives to powerful positions. Clerical immorality — some priests kept concubines, some bishops never visited their dioceses. The papacy itself became a political prize, with rival families fighting for control.',
    color: CRIMSON,
  },
  {
    year: '1440',
    title: 'Gutenberg\'s Printing Press',
    description:
      'Johannes Gutenberg invents movable type in Mainz, Germany. This single invention will make the Reformation possible — ideas that would have stayed local can now spread across an entire continent in weeks. Before printing, copying a Bible took a monk a year. Now it takes days.',
    color: AMBER,
  },
  {
    year: 'c. 1500–1517',
    title: 'The Indulgence Machine',
    description:
      'Indulgences — payments to the Church that supposedly reduced time in Purgatory. Pope Leo X authorizes a massive indulgence sale to fund the construction of St. Peter\'s Basilica in Rome. Johann Tetzel, a Dominican friar, sells them across Germany with the slogan: "As soon as the coin in the coffer rings, the soul from Purgatory springs."',
    color: GOLD,
  },
];

// ── Section 2: Martin Luther — The Spark ────────────────────────────────────

const LUTHER_TIMELINE: TimelineEntry[] = [
  {
    year: '1483',
    title: 'Born in Eisleben, Saxony',
    description:
      'Martin Luther is born to a copper-mining family. His father wants him to become a lawyer. A near-death experience in a thunderstorm leads him to join the Augustinian friars instead — a decision that will reshape the world.',
    color: REFORMATION_GOLD,
  },
  {
    year: '1505–1515',
    title: 'The Tormented Monk',
    description:
      'Luther becomes an Augustinian friar, then professor of theology at the University of Wittenberg. But he is consumed by a single question: How can a sinful human being ever be righteous before God? He fasts, prays, confesses for hours — nothing brings peace. Then he reads Paul\'s letter to the Romans: "The righteous shall live by faith." The breakthrough: salvation comes through faith alone, not human effort.',
    color: AMBER,
  },
  {
    year: 'October 31, 1517',
    title: '95 Theses Nailed to the Wittenberg Door',
    description:
      'Luther posts 95 propositions challenging the sale of indulgences on the door of the Castle Church in Wittenberg. Written in Latin for academic debate, they are quickly translated into German and printed. Within two weeks, they have spread across Germany. Within two months, across Europe. It is the first event in history to "go viral."',
    color: RED,
  },
  {
    year: '1520',
    title: 'Luther Burns the Papal Bull',
    description:
      'Pope Leo X issues a papal bull (Exsurge Domine) demanding Luther recant within 60 days or face excommunication. Luther publicly burns it outside the Wittenberg gate, along with books of Church law. The point of no return.',
    color: CRIMSON,
  },
  {
    year: 'April 1521',
    title: '"Here I Stand" — The Diet of Worms',
    description:
      'Luther is summoned before Emperor Charles V and the assembled princes of the Holy Roman Empire at the Diet of Worms. Asked to recant his writings, Luther replies: "Unless I am convinced by Scripture and plain reason — I do not accept the authority of popes and councils, for they have contradicted each other — my conscience is captive to the Word of God. I cannot and I will not recant anything, for to go against conscience is neither right nor safe. Here I stand. I can do no other. God help me." He is declared an outlaw.',
    color: INDIGO,
  },
  {
    year: '1521–1522',
    title: 'Hidden at the Wartburg Castle',
    description:
      'Frederick the Wise of Saxony secretly kidnaps Luther for his own protection and hides him in the Wartburg Castle. During ten months of isolation, Luther translates the entire New Testament from Greek into German — a literary masterpiece that will standardize the German language across 300+ dialects.',
    color: TEAL,
  },
];

// ── Section 3: Luther's Core Ideas ──────────────────────────────────────────

const CORE_IDEAS: InsightEntry[] = [
  {
    label: 'Sola Scriptura — Scripture Alone',
    detail:
      'The Bible is the sole authority for Christian faith and practice. Not the Pope, not Church councils, not centuries of tradition. Every believer can and should read Scripture for themselves. This was revolutionary — it meant the Church had no monopoly on truth.',
  },
  {
    label: 'Sola Fide — Faith Alone',
    detail:
      'Salvation comes through faith in Christ alone — not through good works, pilgrimages, indulgences, or sacraments. You cannot earn your way to heaven. This struck at the economic heart of the medieval Church, which sold salvation as a service.',
  },
  {
    label: 'Priesthood of All Believers',
    detail:
      'There is no special priestly class that mediates between God and humans. Every Christian has direct access to God. A cobbler at his bench is doing work as holy as a priest at his altar. This democratized Christianity — and planted seeds for political democracy.',
  },
  {
    label: 'Bible in the Vernacular',
    detail:
      'Luther\'s German Bible (1522–1534) was a literary revolution. He didn\'t just translate — he created a new standard German, drawing on Saxon dialect but accessible across regions. It did for German what the King James Bible later did for English: forged a national language.',
  },
  {
    label: 'Two Kingdoms Doctrine',
    detail:
      'God rules the spiritual realm through the Gospel and the worldly realm through law and government. The Church should not wield political power, and the state should not dictate conscience. This separation of spiritual and secular authority laid groundwork for the modern secular state.',
  },
];

// ── Section 4: Other Reformers ──────────────────────────────────────────────

const REFORMERS_TIMELINE: TimelineEntry[] = [
  {
    year: 'Zurich, 1519',
    title: 'Huldrych Zwingli — The Radical Swiss',
    description:
      'Zwingli launches reform in Zurich independently of Luther. He goes further: strips churches of all art, statues, and music. He insists the Eucharist is purely symbolic — not Christ\'s actual body and blood (as Luther believed). Luther and Zwingli meet at Marburg in 1529 but cannot agree. The Protestant movement fractures before it is even a decade old.',
    color: TEAL,
  },
  {
    year: 'Geneva, 1536',
    title: 'John Calvin — The Systematic Theologian',
    description:
      'A French lawyer-turned-theologian, Calvin transforms Geneva into a model Protestant city-state. His theology centers on predestination: God has already chosen who will be saved and who will be damned. This sounds grim, but it breeds intense discipline — if you are among the "elect," your life should show it through hard work and moral rigor. Max Weber will later argue this "Calvinist work ethic" helped create capitalism.',
    color: INDIGO,
  },
  {
    year: 'Scotland, 1560',
    title: 'John Knox — The Scottish Firebrand',
    description:
      'Knox brings Calvinist Protestantism to Scotland, founding the Presbyterian Church. His fierce preaching against Catholic Mary Queen of Scots terrifies even her — she said she feared his prayers more than an army of 10,000. Presbyterianism will later deeply influence American democracy through its system of elected church governance.',
    color: BLUE,
  },
  {
    year: '1520s–1530s',
    title: 'The Anabaptists — The Radicals Everyone Persecuted',
    description:
      'The Anabaptists reject infant baptism (only adults who consciously choose faith should be baptized), demand separation of church and state, and embrace pacifism. They are too radical for everyone: Catholics, Lutherans, and Calvinists all persecute them. Thousands are drowned, burned, or beheaded. The survivors become the Mennonites, Hutterites, Amish, and later influence the Baptists — today one of the world\'s largest Protestant groups.',
    color: GREEN,
  },
];

// ── Section 5: English Reformation ──────────────────────────────────────────

const ENGLISH_TIMELINE: TimelineEntry[] = [
  {
    year: '1509–1534',
    title: 'Henry VIII — Not Theology, It Was Personal',
    description:
      'Henry VIII wants a male heir. His wife Catherine of Aragon has produced only a daughter (Mary). He wants an annulment so he can marry Anne Boleyn. Pope Clement VII refuses — partly because Catherine\'s nephew is Emperor Charles V, who has just sacked Rome. Henry\'s solution: break with Rome entirely.',
    color: CRIMSON,
  },
  {
    year: '1534',
    title: 'The Act of Supremacy',
    description:
      'Parliament declares Henry VIII the "Supreme Head of the Church of England." England\'s break with Rome is political, not theological — Henry actually persecutes Protestants. Thomas More, his former Lord Chancellor and friend, refuses to acknowledge Henry\'s supremacy. More is beheaded. Henry dissolves the monasteries and seizes their vast wealth.',
    color: RED,
  },
  {
    year: '1547–1553',
    title: 'Edward VI — Protestant Reforms Deepen',
    description:
      'Henry\'s son Edward VI, only nine years old at his accession, is guided by Protestant advisors. English-language prayer books replace Latin liturgy. Protestant theology becomes official. But Edward dies at 15.',
    color: BLUE,
  },
  {
    year: '1553–1558',
    title: '"Bloody Mary" — Catholic Restoration',
    description:
      'Catherine of Aragon\'s daughter Mary I takes the throne and restores Catholicism. She burns nearly 300 Protestants at the stake, earning the nickname "Bloody Mary." But the burnings create Protestant martyrs and deepen anti-Catholic sentiment in England.',
    color: CHURCH_RED,
  },
  {
    year: '1558–1603',
    title: 'Elizabeth I — The "Middle Way"',
    description:
      'Anne Boleyn\'s daughter Elizabeth I crafts the Elizabethan Settlement: Protestant theology wrapped in Catholic-style ceremony. The Church of England becomes a "via media" — a middle way. Elizabeth famously declares she will not "make windows into men\'s souls." England becomes a Protestant nation, but one with room for ambiguity.',
    color: PURPLE,
  },
];

// ── Section 6: Counter-Reformation ──────────────────────────────────────────

const COUNTER_REFORMATION: TimelineEntry[] = [
  {
    year: '1545–1563',
    title: 'The Council of Trent',
    description:
      'The Catholic Church finally responds with a council that meets intermittently over 18 years. Trent clarifies Catholic doctrine, bans the worst abuses (no more selling indulgences for money), improves clergy education, and standardizes the Latin Mass. The Church reforms — but it does not compromise. Every Protestant idea is explicitly rejected.',
    color: CHURCH_RED,
  },
  {
    year: '1540',
    title: 'The Jesuits — God\'s Soldiers',
    description:
      'Ignatius of Loyola, a wounded Spanish soldier turned mystic, founds the Society of Jesus. The Jesuits combine military discipline with intellectual brilliance. They become the Church\'s elite missionaries, educators, and diplomats — spreading Catholicism to Asia, the Americas, and Africa. They will eventually found 400+ universities worldwide, including Georgetown, Fordham, and Boston College.',
    color: INDIGO,
  },
  {
    year: '1559',
    title: 'The Index of Forbidden Books',
    description:
      'The Church publishes a list of books Catholics are forbidden to read — including works by Luther, Calvin, Erasmus, and later Galileo, Descartes, and Voltaire. The Index will not be abolished until 1966. Information control as a weapon against reform.',
    color: AMBER,
  },
  {
    year: '1540s–1600s',
    title: 'The Inquisition Intensifies',
    description:
      'The Roman Inquisition is reorganized to root out Protestant ideas in Catholic lands. Spain\'s Inquisition, already operational since 1478, becomes a byword for religious persecution. The Inquisition succeeds: Protestantism is effectively eliminated from Spain, Italy, and Portugal.',
    color: CRIMSON,
  },
  {
    year: '1550s–1700s',
    title: 'Baroque Art — Catholic Propaganda in Stone and Paint',
    description:
      'The Church commissions dramatic, emotional art to inspire the faithful: Bernini\'s ecstatic sculptures, Caravaggio\'s chiaroscuro paintings, massive Baroque churches dripping with gold. If Protestants stripped churches bare, Catholics made them overwhelming. Art becomes a weapon of the Counter-Reformation.',
    color: GOLD,
  },
];

// ── Section 7: Wars of Religion ─────────────────────────────────────────────

const WARS_TIMELINE: TimelineEntry[] = [
  {
    year: '1524–1525',
    title: 'The German Peasants\' War',
    description:
      'Inspired by Luther\'s ideas about Christian freedom, German peasants revolt against their feudal lords, demanding the end of serfdom. Luther is horrified and writes "Against the Murderous, Thieving Hordes of Peasants," urging princes to slaughter the rebels. Up to 100,000 peasants are killed. Luther\'s alliance with the princes saves the Reformation but stains his legacy.',
    color: AMBER,
  },
  {
    year: '1546–1547',
    title: 'The Schmalkaldic Wars',
    description:
      'Protestant German princes form the Schmalkaldic League against Catholic Emperor Charles V. The emperor wins the first war but cannot force Protestantism back into the bottle. The Peace of Augsburg (1555) establishes "cuius regio, eius religio" — the ruler of each territory chooses its religion. A landmark, but it excludes Calvinists and plants seeds for more conflict.',
    color: BLUE,
  },
  {
    year: '1562–1598',
    title: 'French Wars of Religion — 3 Million Dead',
    description:
      'France tears itself apart in eight civil wars between Catholics and Huguenots (French Calvinists). The Huguenots are a minority (about 10%) but include powerful nobles. The wars are marked by massacres, assassinations, and shifting alliances. The eventual peace (Edict of Nantes, 1598) grants Huguenots limited toleration — a radical concept for the age.',
    color: CRIMSON,
  },
  {
    year: 'August 24, 1572',
    title: 'St. Bartholomew\'s Day Massacre',
    description:
      'The single most horrific event of the French Wars. Catherine de\' Medici and Catholic nobles orchestrate the mass murder of Huguenots gathered in Paris for a royal wedding. Between 5,000 and 30,000 are killed across France in a few days. Pope Gregory XIII celebrates with a Te Deum and a commemorative medal. Protestant Europe is shocked to its core.',
    color: RED,
  },
  {
    year: '1618–1648',
    title: 'The Thirty Years\' War — Europe\'s Apocalypse',
    description:
      'Beginning as a Catholic-Protestant conflict in Bohemia, the war engulfs all of Europe. It becomes the most destructive European conflict before World War I. Germany loses between 25% and 40% of its entire population — roughly 8 million people. Some regions lose two-thirds of their inhabitants. Famine and plague follow armies across the continent. The war proves that religious uniformity cannot be imposed by force.',
    color: CHURCH_RED,
  },
  {
    year: '1648',
    title: 'The Peace of Westphalia — The Modern World Begins',
    description:
      'The treaties ending the Thirty Years\' War establish the foundational principles of the modern international system: state sovereignty, territorial integrity, and non-interference in other states\' internal affairs (including religion). Calvinists finally gain legal recognition. The age of religious wars in Europe effectively ends — replaced by the age of national wars.',
    color: TEAL,
  },
];

// ── Section 8: Legacy ───────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Religious Pluralism',
    detail:
      'The Reformation shattered 1,000 years of Western Christian unity. Today there are 45,000+ Protestant denominations and 800 million Protestants (37% of all Christians). The idea that multiple religions can coexist in one society — unthinkable in 1500 — became the foundation of modern tolerance.',
  },
  {
    label: 'Individualism and Conscience',
    detail:
      'Luther at Worms — one man standing against the combined authority of Church and Empire, insisting that individual conscience is sovereign — became the template for Western individualism. The right to think for yourself, to interpret truth independently, begins here.',
  },
  {
    label: 'Literacy and Mass Education',
    detail:
      'If every Christian must read the Bible, every Christian must be able to read. Protestant regions pioneered universal education. Luther himself demanded that cities establish schools for boys and girls. Protestant literacy rates consistently exceeded Catholic ones for centuries.',
  },
  {
    label: 'The "Protestant Work Ethic"',
    detail:
      'Max Weber\'s famous thesis (1905): Calvinist ideas about predestination, "calling," and thrift created a cultural framework uniquely suited to capitalism. Whether or not Weber was right, the correlation between Protestant regions and early industrialization is striking.',
  },
  {
    label: 'Separation of Church and State',
    detail:
      'Luther\'s Two Kingdoms doctrine, the Anabaptist insistence on separating church and state, and the exhaustion of the religious wars all contributed to the Enlightenment idea that government should be secular. The First Amendment to the US Constitution is a direct descendant.',
  },
  {
    label: 'America as a Reformation Product',
    detail:
      'The Pilgrims (1620), Puritans (1630s), Quakers (Pennsylvania), Baptists (Rhode Island), Huguenots, Mennonites — many American colonies were founded by Protestant dissenters fleeing persecution. American democracy, with its emphasis on individual rights, elected governance, and religious freedom, is the Reformation\'s most consequential political legacy.',
  },
];

// ── Section 9: Key Figures ──────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Martin Luther',
    years: '1483–1546',
    contribution:
      'Augustinian friar whose 95 Theses ignited the Reformation. Translated the Bible into German, standardizing the language. His theology of "faith alone" and "Scripture alone" redefined Christianity for half of Western civilization.',
  },
  {
    name: 'John Calvin',
    years: '1509–1564',
    contribution:
      'French theologian who systematized Protestant thought in his Institutes of the Christian Religion. His doctrine of predestination and theocratic Geneva became the model for Reformed churches worldwide. Calvinist ideas arguably shaped modern capitalism.',
  },
  {
    name: 'Henry VIII',
    years: '1491–1547',
    contribution:
      'King of England who broke with Rome not over theology but over his desire for an annulment. Created the Church of England, dissolved the monasteries, and set in motion England\'s permanent break from Catholicism.',
  },
  {
    name: 'Ignatius of Loyola',
    years: '1491–1556',
    contribution:
      'Spanish soldier-turned-mystic who founded the Jesuits (Society of Jesus), the Catholic Church\'s most elite intellectual and missionary order. The Jesuits became the spearhead of the Counter-Reformation and founded 400+ universities.',
  },
  {
    name: 'Huldrych Zwingli',
    years: '1484–1531',
    contribution:
      'Swiss reformer who launched an independent reformation in Zurich. More radical than Luther — stripped churches bare and rejected any physical presence of Christ in the Eucharist. Killed in battle against Catholic cantons.',
  },
  {
    name: 'John Knox',
    years: '1514–1572',
    contribution:
      'Scottish reformer who founded Presbyterianism. His confrontations with Catholic Mary Queen of Scots became legendary. Presbyterian governance — elected elders, not appointed bishops — influenced democratic political theory.',
  },
  {
    name: 'Thomas More',
    years: '1478–1535',
    contribution:
      'Henry VIII\'s Lord Chancellor, author of Utopia, and devout Catholic. Refused to acknowledge Henry as head of the English Church. Beheaded for his conscience — canonized as a Catholic saint in 1935.',
  },
  {
    name: 'Elizabeth I',
    years: '1533–1603',
    contribution:
      'Queen of England who crafted the Elizabethan Settlement — a "middle way" between Protestantism and Catholicism. Her Anglican compromise prevented England from descending into the religious civil wars that devastated France and Germany.',
  },
  {
    name: 'Pope Leo X',
    years: '1475–1521',
    contribution:
      'The Medici pope whose lavish spending on St. Peter\'s Basilica and indulgence sales provoked Luther\'s 95 Theses. Reportedly said: "God has given us the papacy — let us enjoy it." Excommunicated Luther in 1521.',
  },
  {
    name: 'Johann Tetzel',
    years: '1465–1519',
    contribution:
      'Dominican friar whose aggressive indulgence sales across Germany — "As soon as the coin in the coffer rings, the soul from Purgatory springs" — became the immediate catalyst for Luther\'s protest.',
  },
];

// ── Stats ───────────────────────────────────────────────────────────────────

const KEY_STATS: InsightEntry[] = [
  {
    label: '95 Theses → Viral in 2 Weeks',
    detail:
      'Luther\'s 95 Theses spread across Germany within weeks via the printing press — the first "viral" media event in history. What should have been a local academic debate became a continental revolution.',
  },
  {
    label: '300+ Dialects → One Language',
    detail:
      'Luther\'s German Bible standardized the German language. Before Luther, Germans in different regions could barely understand each other. His translation created a common literary German that unified the language.',
  },
  {
    label: '8 Million Dead',
    detail:
      'The Thirty Years\' War (1618–1648) killed roughly 8 million people. Germany lost 25–40% of its entire population. Some regions lost two-thirds of their inhabitants. The most destructive European conflict before World War I.',
  },
  {
    label: '800 Million Protestants Today',
    detail:
      'From one monk\'s protest, Protestantism has grown to 800 million adherents — 37% of all Christians worldwide — spread across more than 45,000 denominations.',
  },
  {
    label: '400+ Jesuit Universities',
    detail:
      'The Jesuits, founded in 1540 as the Counter-Reformation\'s elite order, have established over 400 universities worldwide — including Georgetown, Fordham, and Boston College — still operating today.',
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

/** Comparison table for reformers */
function ReformerTable() {
  const reformers = [
    {
      name: 'Martin Luther',
      location: 'Germany',
      keyIdea: 'Faith alone, Scripture alone',
      eucharist: 'Christ truly present',
      churchStyle: 'Retained music, art, liturgy',
    },
    {
      name: 'Huldrych Zwingli',
      location: 'Switzerland (Zurich)',
      keyIdea: 'Radical simplification',
      eucharist: 'Purely symbolic',
      churchStyle: 'Stripped bare — no art, no music',
    },
    {
      name: 'John Calvin',
      location: 'Switzerland (Geneva)',
      keyIdea: 'Predestination, moral discipline',
      eucharist: 'Spiritual presence',
      churchStyle: 'Austere, theocratic governance',
    },
    {
      name: 'Anabaptists',
      location: 'Various',
      keyIdea: 'Adult baptism, pacifism, separation of church & state',
      eucharist: 'Symbolic',
      churchStyle: 'Small communities, no state ties',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      style={{ overflowX: 'auto', marginTop: 12 }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.88rem',
          color: ASH,
        }}
      >
        <thead>
          <tr>
            {['Reformer', 'Base', 'Key Idea', 'Eucharist', 'Church Style'].map(
              (h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderBottom: `2px solid ${REFORMATION_GOLD}44`,
                    color: REFORMATION_GOLD,
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {reformers.map((r, i) => (
            <tr
              key={i}
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <td
                style={{
                  padding: '10px 12px',
                  fontWeight: 600,
                  color: '#f1f5f9',
                }}
              >
                {r.name}
              </td>
              <td style={{ padding: '10px 12px' }}>{r.location}</td>
              <td style={{ padding: '10px 12px' }}>{r.keyIdea}</td>
              <td style={{ padding: '10px 12px' }}>{r.eucharist}</td>
              <td style={{ padding: '10px 12px' }}>{r.churchStyle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function ProtestantReformationPage() {
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
              background: `linear-gradient(135deg, ${REFORMATION_GOLD}, ${PARCHMENT})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Here I Stand — The Protestant Reformation (1517–1648)
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p
              style={{
                fontSize: '1.15rem',
                color: REFORMATION_GOLD,
                fontWeight: 600,
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              October 31, 1517: A German monk nails 95 propositions to a church
              door. The printing press makes them viral in two weeks. Within a
              generation, Christianity is split, Europe is at war, and the
              medieval world is over.
            </p>
            <p style={{ color: ASH, lineHeight: 1.7, marginBottom: 12 }}>
              The Protestant Reformation was the most consequential religious
              revolution in Western history. It began with one man's crisis of
              conscience — Martin Luther asking how a sinful human being could
              ever be righteous before God — and ended by shattering a
              thousand-year-old religious monopoly, unleashing devastating wars
              that killed millions, and planting the seeds of individualism,
              democracy, mass literacy, and the secular state.
            </p>
            <p style={{ color: ASH, lineHeight: 1.7 }}>
              Today, 800 million Protestants across 45,000+ denominations trace
              their origins to that church door in Wittenberg. The Reformation
              didn't just change Christianity — it made the modern world.
            </p>
          </motion.div>
        </header>

        {/* ── Key Stats ────────────────────────────────────────────────── */}
        <SectionWrapper
          id="stats"
          icon="📊"
          title="By the Numbers"
          accentColor={GOLD}
          intro="The Reformation in raw figures — from one monk's protest to a global transformation."
        >
          <InsightGrid items={KEY_STATS} />
        </SectionWrapper>

        {/* ── Medieval Catholic Church ─────────────────────────────────── */}
        <SectionWrapper
          id="medieval-church"
          icon="⛪"
          title="The Medieval Catholic Church — Before the Storm"
          accentColor={CHURCH_RED}
          intro="For a millennium, the Roman Catholic Church was the unchallenged spiritual authority of Western Europe. The Pope claimed supremacy over kings. The Bible existed only in Latin. Only clergy could interpret Scripture. Salvation was a service the Church sold — and by 1500, the corruption was staggering."
        >
          <TimelineCard entries={MEDIEVAL_CHURCH} />
        </SectionWrapper>

        {/* ── Martin Luther ────────────────────────────────────────────── */}
        <SectionWrapper
          id="luther"
          icon="🔨"
          title="Martin Luther — The Spark"
          accentColor={REFORMATION_GOLD}
          intro="An obscure Augustinian friar and theology professor at a small university in Saxony. A man tormented by the question of his own salvation, who stumbled onto an answer that would tear Christendom in two."
        >
          <TimelineCard entries={LUTHER_TIMELINE} />
        </SectionWrapper>

        {/* ── Core Ideas ───────────────────────────────────────────────── */}
        <SectionWrapper
          id="core-ideas"
          icon="📜"
          title="Luther's Core Ideas — The Five Pillars of the Reformation"
          accentColor={AMBER}
          intro="Luther didn't just protest corruption — he reimagined Christianity from the ground up. His ideas struck at the Church's monopoly on truth, salvation, and authority. Each one was a revolution in itself."
        >
          <InsightGrid items={CORE_IDEAS} />
        </SectionWrapper>

        {/* ── Other Reformers ──────────────────────────────────────────── */}
        <SectionWrapper
          id="reformers"
          icon="🌍"
          title="The Spread — Other Reformers"
          accentColor={TEAL}
          intro="Luther lit the fuse, but the Reformation quickly escaped his control. Across Europe, other reformers pushed in different directions — some more radical, some more systematic, some persecuted by everyone. The Protestant movement was never a single movement."
        >
          <TimelineCard entries={REFORMERS_TIMELINE} />
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#f1f5f9',
              marginTop: 32,
              marginBottom: 16,
            }}
          >
            Reformer Comparison
          </h3>
          <ReformerTable />
        </SectionWrapper>

        {/* ── English Reformation ──────────────────────────────────────── */}
        <SectionWrapper
          id="english-reformation"
          icon="👑"
          title="The English Reformation — Not Theology, It Was Personal"
          accentColor={PURPLE}
          intro="England's break with Rome had nothing to do with theology and everything to do with Henry VIII's desperate need for a male heir. It was a political revolution dressed in religious clothing — and it created the Anglican Church, a compromise that satisfied almost nobody but endured for centuries."
        >
          <TimelineCard entries={ENGLISH_TIMELINE} />
        </SectionWrapper>

        {/* ── Counter-Reformation ──────────────────────────────────────── */}
        <SectionWrapper
          id="counter-reformation"
          icon="🏛️"
          title="The Catholic Counter-Reformation (1545–1648)"
          accentColor={INDIGO}
          intro="The Catholic Church did not simply surrender half of Europe. It launched its own reformation — cleaning up corruption, clarifying doctrine, deploying the brilliant Jesuits as intellectual shock troops, and using art, censorship, and inquisition as weapons. The Counter-Reformation saved Catholicism and transformed it."
        >
          <TimelineCard entries={COUNTER_REFORMATION} />
        </SectionWrapper>

        {/* ── Wars of Religion ─────────────────────────────────────────── */}
        <SectionWrapper
          id="wars"
          icon="⚔️"
          title="The Wars of Religion (1524–1648)"
          accentColor={CRIMSON}
          intro="The Reformation's price was paid in blood. For over a century, Europe was consumed by religious warfare on an apocalyptic scale. The Thirty Years' War alone killed 8 million people and depopulated vast regions of Germany. These wars proved that religious uniformity could not be imposed by force — and from that exhaustion, the modern idea of tolerance was born."
        >
          <TimelineCard entries={WARS_TIMELINE} />
        </SectionWrapper>

        {/* ── Legacy ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🌎"
          title="Legacy — How the Reformation Made the Modern World"
          accentColor={GREEN}
          intro="The Reformation's consequences extend far beyond religion. It created the conditions for individualism, democracy, mass literacy, capitalism, and the separation of church and state. The modern West — with its pluralism, its emphasis on individual conscience, and its secular governance — is unthinkable without it."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures of the Reformation"
          accentColor={GOLD}
          intro="Monks and kings, theologians and soldiers, visionaries and tyrants — the Reformation was shaped by individuals whose decisions echoed across centuries. These are the people who broke the medieval Church and built the modern world on its ruins."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Connections ──────────────────────────────────────────────── */}
        <section
          style={{
            padding: '48px 0',
            borderTop: '1px solid rgba(255,255,255,0.08)',
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
                color: REFORMATION_GOLD,
                marginBottom: 12,
              }}
            >
              🔗 Connections
            </h2>
            <p
              style={{
                color: ASH,
                lineHeight: 1.7,
                maxWidth: 800,
                marginBottom: 20,
              }}
            >
              The Reformation sits at the hinge of history — shaped by the
              Renaissance, fueling the Scientific Revolution, and laying the
              intellectual groundwork for the Enlightenment and the American
              experiment.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {[
                { to: '/renaissance', label: 'The Renaissance' },
                { to: '/scientific-revolution', label: 'The Scientific Revolution' },
                { to: '/enlightenment', label: 'The Enlightenment' },
                { to: '/american-revolution', label: 'The American Revolution' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    display: 'inline-block',
                    padding: '8px 18px',
                    borderRadius: 8,
                    border: `1px solid ${REFORMATION_GOLD}44`,
                    color: REFORMATION_GOLD,
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.backgroundColor =
                      `${REFORMATION_GOLD}11`)
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.backgroundColor =
                      'transparent')
                  }
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────── */}
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
            "Unless I am convinced by Scripture and plain reason — my conscience
            is captive to the Word of God. Here I stand. I can do no other."
            — Martin Luther, Diet of Worms, 1521
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
