/**
 * ProtestantReformationPage — comprehensive deep-dive on the Protestant
 * Reformation (1517–1648).
 *
 * Route: /protestant-reformation
 *
 * Sections:
 *  1. Hero — "Here I Stand" headline, overview
 *  2. The Medieval Catholic Church — context and corruption
 *  3. Gutenberg and the Printing Press — technology enabling revolution
 *  4. Martin Luther — the 95 Theses and break with Rome
 *  5. Luther's Core Theology — sola scriptura, sola fide, priesthood of all
 *  6. The Reformation Spreads — Calvin, Zwingli, Henry VIII, Anabaptists
 *  7. The Religious Wars — Peasants' War, French Wars of Religion, Thirty Years War
 *  8. The Counter-Reformation — Council of Trent, Jesuits, Inquisition
 *  9. Why It Still Matters — literacy, science, capitalism, religious freedom
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const ASH = '#94a3b8';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const GOLD = '#f59e0b';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const BLUE = '#3b82f6';
const PARCHMENT = '#d4a76a';
const CHURCH_RED = '#991b1b';
const REFORMATION_GOLD = '#b8860b';
const BLOOD_RED = '#7f1d1d';
const PAPAL_PURPLE = '#7e22ce';
const QUILL_BROWN = '#92400e';

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

// ── The Medieval Catholic Church ────────────────────────────────────────────

const MEDIEVAL_CHURCH: InsightEntry[] = [
  {
    label: 'A Pan-European Superpower',
    detail:
      'By 1500, the Catholic Church owned roughly one-third of all land in Western Europe. It was the only institution that spanned every kingdom, duchy, and city-state on the continent. It ran the courts, the universities, and the hospitals. It crowned kings and excommunicated emperors. No medieval European could be born, married, or buried without the Church. It was not merely a religious institution — it was the operating system of Western civilization.',
  },
  {
    label: 'The Indulgence Trade',
    detail:
      'Indulgences began as remissions of penance for sins already confessed, but by the late medieval period they had become a massive commercial enterprise. Pope Leo X authorized a special indulgence in 1515 to fund the construction of St. Peter\'s Basilica in Rome. The Dominican friar Johann Tetzel became its most aggressive salesman, reportedly declaring: "As soon as the coin in the coffer rings, a soul from purgatory springs." The poor were paying money they couldn\'t afford to buy salvation they couldn\'t purchase — and the revenue went to Rome.',
  },
  {
    label: 'Corruption at the Highest Levels',
    detail:
      'Pope Alexander VI (Rodrigo Borgia, r. 1492–1503) fathered at least seven children, bribed his way to the papacy, and used the Church as a vehicle for his family\'s political ambitions. He was not an anomaly — he was an extreme example of a systemic problem. Bishoprics were bought and sold. Multiple popes maintained mistresses. Clerical offices were held by men who never visited their parishes. Many village priests were barely literate, reciting Latin prayers they could not understand. The gap between Christian ideals and institutional practice had become a chasm.',
  },
  {
    label: 'Precursors: Reformers Who Died for the Cause',
    detail:
      'Luther was not the first to challenge Rome. John Wycliffe (c. 1328–1384) in England argued for translating the Bible into the vernacular and denied papal authority — his followers, the Lollards, were persecuted after his death. Jan Hus (c. 1372–1415) in Bohemia preached against indulgences and clerical corruption. He was promised safe conduct to the Council of Constance, then burned at the stake. His execution sparked the Hussite Wars. What made Luther different was not his ideas — it was his timing. He had the printing press.',
  },
  {
    label: 'The Great Schism and Institutional Fractures',
    detail:
      'The Church had already fractured once: the Great Schism of 1054 split Christianity into Catholic West and Orthodox East, a division that remains unhealed. Then came the Western Schism (1378–1417), when rival popes reigned simultaneously in Rome and Avignon, each excommunicating the other\'s followers. At one point there were three competing popes. The Conciliar movement tried to establish Church councils as superior to papal authority but ultimately failed. These crises eroded the Church\'s claim to be the singular, unified voice of God on earth.',
  },
  {
    label: 'But Also: Monasteries as Civilization\'s Lifeline',
    detail:
      'For all its corruption, the medieval Church preserved Western civilization. Monasteries copied and preserved ancient manuscripts — without them, we would have lost Aristotle, Cicero, and much of classical learning. The Church ran the only hospitals and schools available to common people. It provided the legal and administrative framework that held post-Roman Europe together. Cathedrals were engineering marvels. The great medieval universities — Paris, Oxford, Bologna — were Church foundations. Reformers were not attacking civilization; they were attacking an institution they believed had betrayed its own ideals.',
  },
];

// ── Gutenberg and the Printing Press ────────────────────────────────────────

const GUTENBERG_INSIGHTS: InsightEntry[] = [
  {
    label: 'Before Gutenberg: The Cost of Knowledge',
    detail:
      'Before movable type, every book in Europe was copied by hand — usually by monks in scriptoria. A single Bible could take a scribe two to three years of full-time work. The cost of a complete Bible was equivalent to roughly three years\' wages for a skilled worker. Books were chained to library desks because they were as valuable as houses. Knowledge was a luxury good, controlled by those who could afford to produce and restrict it: the Church, the nobility, and a handful of universities.',
  },
  {
    label: 'Gutenberg\'s Revolution (c. 1440)',
    detail:
      'Johannes Gutenberg, a goldsmith from Mainz, combined existing technologies — the screw press, oil-based ink, and metal alloy — into the first practical system for printing with movable type. His masterpiece, the Gutenberg Bible (c. 1455), demonstrated that books could be mass-produced with consistent quality. Approximately 180 copies were printed; 49 survive today. Within a generation, printing presses spread to every major European city. By 1500, an estimated 20 million volumes had been printed — more books than all the scribes of Europe had produced in the previous thousand years.',
  },
  {
    label: 'Why the Printing Press Made the Reformation Possible',
    detail:
      'When Luther posted his 95 Theses in October 1517, they were translated from Latin to German and reprinted across Germany within two weeks. Within two months, they had reached every corner of Europe. This would have been physically impossible before print. Previous reformers like Hus and Wycliffe had their writings suppressed, their followers scattered, their ideas contained. Luther\'s ideas were unstoppable because they could be reproduced faster than any authority could confiscate them. The printing press was to the Reformation what social media was to the Arab Spring — the technology that turned a local protest into an uncontrollable movement.',
  },
  {
    label: 'The Pamphlet Wars',
    detail:
      'Between 1517 and 1530, Luther alone was responsible for roughly one-third of all German-language publications. His short pamphlets — affordable, accessible, written in vigorous German rather than academic Latin — sold in the hundreds of thousands. Woodcut illustrations made them accessible even to the illiterate. Pro-Reformation satirical prints depicted the Pope as the Antichrist, monks as pigs, and indulgence sellers as thieves. The Catholic Church tried to respond with its own publications, but it was fighting a losing battle against a decentralized media revolution.',
  },
];

// ── Martin Luther: The Break ────────────────────────────────────────────────

const LUTHER_TIMELINE: TimelineEntry[] = [
  {
    year: 'October 31, 1517',
    title: 'The 95 Theses',
    description:
      'Martin Luther, a 33-year-old Augustinian monk and theology professor at the University of Wittenberg, composed 95 propositions challenging the sale of indulgences. Written in Latin as an invitation to academic debate, they were probably not dramatically nailed to the castle church door (though the legend persists). What mattered was that they were printed. Luther\'s central arguments: indulgences had no scriptural basis, only God could forgive sins, and the Pope had no authority over purgatory. Within weeks, the academic dispute had become a public sensation.',
    color: REFORMATION_GOLD,
  },
  {
    year: '1518–1520',
    title: 'Escalation: From Debate to Defiance',
    description:
      'Rome initially dismissed Luther as "a drunken German who will think differently when sober." But Luther kept writing, and each publication was more radical than the last. In 1520, he published three revolutionary treatises: "Address to the Christian Nobility" (calling on German princes to reform the Church), "On the Babylonian Captivity of the Church" (attacking the sacramental system), and "On the Freedom of a Christian" (arguing that faith alone saves). Pope Leo X issued the bull Exsurge Domine, giving Luther 60 days to recant. Luther publicly burned it.',
    color: CRIMSON,
  },
  {
    year: 'April 1521',
    title: 'Diet of Worms: "Here I Stand"',
    description:
      'Summoned before Emperor Charles V and the assembled princes of the Holy Roman Empire at the Diet of Worms, Luther was shown a table piled with his writings and asked to recant. After a day of deliberation, he reportedly declared: "Unless I am convinced by the testimony of the Scriptures or by clear reason, I cannot and will not recant anything, for to go against conscience is neither right nor safe. Here I stand, I can do no other. God help me." He was declared an outlaw — anyone could kill him without legal consequence.',
    color: AMBER,
  },
  {
    year: 'May 1521 – March 1522',
    title: 'Wartburg Castle: The German Bible',
    description:
      'Frederick the Wise, Elector of Saxony, staged a fake kidnapping to spirit Luther to Wartburg Castle. In hiding, Luther accomplished one of the most consequential literary feats in history: he translated the entire New Testament from Greek into German in approximately ten months. His translation was not merely accurate — it was beautiful, vivid, and written in a common German that could be understood across dialects. The Luther Bible effectively created modern standard German, unifying a fragmented linguistic landscape. It would become the most widely read German book for centuries.',
    color: TEAL,
  },
  {
    year: '1522 onward',
    title: 'The Reformation Takes Institutional Form',
    description:
      'Returning to Wittenberg, Luther began building a new church structure. He reformed worship services (now in German, not Latin), abolished mandatory clerical celibacy (he married Katharina von Bora, a former nun, in 1525), eliminated monasticism, and placed churches under the authority of local princes rather than Rome. The priesthood of all believers became practice, not just theory. But Luther\'s reformation also had limits: he was fiercely hostile to Jews, especially in his later writings, and he sided with princes against peasants during the German Peasants\' War — decisions that would cast long shadows.',
    color: INDIGO,
  },
];

// ── Luther's Core Theology ──────────────────────────────────────────────────

const THEOLOGY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Sola Scriptura — Scripture Alone',
    detail:
      'Luther argued that the Bible — not the Pope, not Church councils, not centuries of tradition — was the sole authority for Christian doctrine. If a belief or practice could not be found in Scripture, it had no binding authority. This single principle demolished the entire power structure of the medieval Church, which rested on the claim that the Pope, as Peter\'s successor, held the keys to heaven and could authoritatively interpret God\'s will. If every Christian could read and interpret Scripture, what did they need the Pope for?',
  },
  {
    label: 'Sola Fide — Faith Alone',
    detail:
      'Salvation comes through faith in Christ alone — not through good works, not through indulgences, not through pilgrimages or penances or payments to the Church. This was Luther\'s answer to the anxiety that drove the indulgence trade: the medieval terror that one might die with unconfessed sins and spend millennia in purgatory. Luther taught that God\'s grace was free and sufficient. The implications were revolutionary: if works cannot earn salvation, the entire economy of medieval religion — relics, pilgrimages, masses for the dead, indulgences — was spiritually worthless.',
  },
  {
    label: 'Priesthood of All Believers',
    detail:
      'Every Christian, Luther argued, is a priest before God. There is no special spiritual status conferred by ordination, no intermediary required between the individual and the divine. Every believer can read Scripture, pray directly to God, and interpret God\'s word. This was the most socially radical of Luther\'s ideas: it collapsed the distinction between clergy and laity, between sacred and secular vocations. A cobbler at his bench serves God as truly as a priest at the altar. It was a theological atom bomb lobbed at the most powerful institution in Europe.',
  },
  {
    label: 'Why These Ideas Were Revolutionary',
    detail:
      'Taken together, sola scriptura, sola fide, and the priesthood of all believers didn\'t merely challenge specific Church practices — they undermined the entire conceptual foundation of the medieval Catholic order. If Scripture is the only authority, the Pope has no special power. If faith alone saves, the Church cannot sell salvation. If every Christian is a priest, the clerical hierarchy is spiritually unnecessary. Luther was not tinkering with the system; he was pulling out the load-bearing wall. Once these ideas took hold, the medieval Church could never fully reconstitute itself.',
  },
];

// ── The Reformation Spreads ─────────────────────────────────────────────────

const SPREAD_INSIGHTS: InsightEntry[] = [
  {
    label: 'Zwingli in Zurich (1519)',
    detail:
      'Huldrych Zwingli launched an independent reform movement in Zurich, arriving at many of Luther\'s conclusions through his own study of Scripture. Zwingli was more radical than Luther in some respects: he rejected all religious imagery (Zurich\'s churches were whitewashed bare), and he disagreed sharply with Luther on the Eucharist. Their 1529 meeting at the Marburg Colloquy failed to unite the two movements — a harbinger of Protestantism\'s tendency to fragment over theological details.',
  },
  {
    label: 'John Calvin and Geneva (1536)',
    detail:
      'John Calvin, a French lawyer turned theologian, published his "Institutes of the Christian Religion" in 1536 and built Geneva into a model Reformed city — what John Knox called "the most perfect school of Christ since the apostles." Calvin\'s theology centered on predestination: God has already chosen who will be saved and who will be damned, and no human action can change this divine decree. His system of church governance — rule by elders (presbyters) rather than bishops — became the model for Presbyterian and Reformed churches worldwide.',
  },
  {
    label: 'Calvinist Influence Across Europe',
    detail:
      'Calvin\'s ideas proved more exportable than Luther\'s. John Knox brought Calvinism to Scotland, where it became Presbyterianism. Dutch Calvinists fueled the revolt against Catholic Spain. French Calvinists (Huguenots) became a powerful minority that would trigger decades of civil war. English Puritans carried Calvinist theology to New England. The Reformed tradition\'s emphasis on discipline, literacy, and active engagement with the world made it particularly influential in shaping modern Western culture.',
  },
  {
    label: 'Henry VIII and the Church of England (1534)',
    detail:
      'England\'s break with Rome had nothing to do with theology and everything to do with dynastic politics. Henry VIII wanted to annul his marriage to Catherine of Aragon to marry Anne Boleyn and produce a male heir. When Pope Clement VII refused — partly because Catherine\'s nephew, Emperor Charles V, had recently sacked Rome — Henry declared himself Supreme Head of the Church of England via the Act of Supremacy (1534). He dissolved 800 monasteries, seized their vast wealth, and redistributed it to the nobility, creating a powerful class with a financial stake in the break with Rome. The Church of England was Catholic in structure but increasingly Protestant in theology — a unique hybrid that still defines Anglicanism.',
  },
  {
    label: 'The Anabaptists: The Radical Reformation',
    detail:
      'The Anabaptists pushed reform further than Luther, Calvin, or Zwingli ever intended. They rejected infant baptism (insisting on adult believer\'s baptism), advocated complete separation of church and state, practiced pacifism, and lived in egalitarian communities. These ideas were centuries ahead of their time — and for them, they were severely persecuted by Catholics and Protestants alike. Thousands were executed by drowning (a grim irony, given their insistence on adult baptism). Their spiritual descendants include the Mennonites, Amish, and Hutterites. Their principle of church-state separation would eventually become a foundation of modern democracy.',
  },
];

// ── The Religious Wars ──────────────────────────────────────────────────────

const WARS_TIMELINE: TimelineEntry[] = [
  {
    year: '1524–1525',
    title: 'The German Peasants\' War',
    description:
      'Inspired by Luther\'s teachings about Christian freedom and equality before God, German peasants rose in revolt against their feudal lords, demanding an end to serfdom, reduced taxes, and the right to choose their own pastors. An estimated 300,000 peasants took up arms across southern and central Germany. Luther initially sympathized, then turned violently against them, writing "Against the Murderous, Thieving Hordes of Peasants," urging the princes to "smite, slay, and stab" the rebels. The revolt was crushed; approximately 100,000 peasants were killed. Luther\'s alliance with the princes saved the Reformation politically but cost it the support of the common people.',
    color: QUILL_BROWN,
  },
  {
    year: '1562–1598',
    title: 'French Wars of Religion',
    description:
      'France was torn apart by eight successive civil wars between Catholics and Huguenots (French Calvinists). The nadir came on St. Bartholomew\'s Day, August 24, 1572: Catholic mobs, encouraged by the royal court, massacred Huguenots in Paris and across France. Estimates range from 3,000 to 30,000 Protestants killed in a matter of days. The violence was so extreme that the Tiber River reportedly ran red and bodies were stacked in the streets. The wars ended only with the Edict of Nantes (1598), in which Henry IV (a Protestant who converted to Catholicism, reportedly saying "Paris is worth a Mass") granted limited tolerance to Huguenots.',
    color: CRIMSON,
  },
  {
    year: '1618–1648',
    title: 'The Thirty Years\' War',
    description:
      'What began as a religious conflict between Protestant and Catholic states in the Holy Roman Empire became the most destructive war in European history before the twentieth century. Every major European power was drawn in. Armies marched and counter-marched across Germany for three decades, leaving devastation in their wake. An estimated 8 million people died — roughly one-third of Germany\'s entire population. Some regions lost 50–70% of their inhabitants. Entire villages disappeared. The war demonstrated that the question "which Christianity is correct?" could not be answered by force — it could only be managed by political compromise.',
    color: BLOOD_RED,
  },
  {
    year: '1648',
    title: 'The Peace of Westphalia',
    description:
      'The Peace of Westphalia ended the Thirty Years\' War and established the modern international system. Its key principle — cuius regio, eius religio ("whose realm, his religion") — meant that each ruler could determine the religion of their territory, but subjects of a different faith were guaranteed the right to practice privately. More fundamentally, Westphalia established the concept of state sovereignty: no external power, not even the Pope, could interfere in a state\'s internal affairs. This was the birth of the nation-state system that still governs international relations today.',
    color: TEAL,
  },
];

// ── The Counter-Reformation ─────────────────────────────────────────────────

const COUNTER_REFORMATION: InsightEntry[] = [
  {
    label: 'The Council of Trent (1545–1563)',
    detail:
      'Meeting intermittently over 18 years, the Council of Trent was the Catholic Church\'s definitive response to the Protestant challenge. It reaffirmed Catholic doctrines that Protestants had rejected — transubstantiation, the necessity of both faith and works for salvation, the authority of tradition alongside Scripture, the seven sacraments — while also addressing legitimate grievances. It banned the sale of indulgences, established seminaries to properly educate clergy, required bishops to reside in their dioceses, and standardized the Mass. Trent drew a clear line: reform yes, surrender no.',
  },
  {
    label: 'The Jesuits (Society of Jesus, 1540)',
    detail:
      'Founded by Ignatius of Loyola, a former Spanish soldier who experienced a spiritual conversion while recovering from battle wounds, the Society of Jesus became the intellectual and missionary elite of the Catholic Church. Jesuits emphasized rigorous education, personal spiritual discipline, and absolute obedience to the Pope. They established schools and universities across Europe that became models of academic excellence. Jesuit missionaries traveled to China, Japan, India, and the Americas, making Catholicism a truly global religion. Their educational and scientific contributions were extraordinary — Jesuit astronomers, mathematicians, and linguists advanced knowledge across multiple fields.',
  },
  {
    label: 'The Inquisition Strengthened',
    detail:
      'The Roman Inquisition, reorganized in 1542, became the Church\'s instrument for enforcing doctrinal conformity. It prosecuted heresy, censored publications, and maintained the Index Librorum Prohibitorum (Index of Forbidden Books) — a list of works Catholics were forbidden to read that included works by Galileo, Kepler, and Descartes. Galileo\'s 1633 trial and forced recantation of heliocentrism became the most famous case, symbolizing the tension between religious authority and scientific inquiry. The Index was not abolished until 1966.',
  },
  {
    label: 'Genuine Internal Reform',
    detail:
      'The Counter-Reformation was not merely reactionary. Much of it represented genuine, internally motivated reform. New religious orders — the Jesuits, Ursulines, Capuchins — brought renewed spiritual energy. Seminaries dramatically improved clergy education. Baroque art and architecture created spaces of overwhelming beauty designed to inspire devotion. Mystics like Teresa of Ávila and John of the Cross deepened Catholic spiritual practice. The Church that emerged from the Counter-Reformation was leaner, more disciplined, and more clearly defined than the sprawling medieval institution it replaced — even if it was also more rigid.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Martin Luther',
    years: '1483–1546',
    contribution:
      'Augustinian monk and theology professor who launched the Reformation with his 95 Theses. Created modern standard German through his Bible translation. His theology of grace, faith, and Scripture dismantled medieval Catholicism\'s power structure. Also deeply flawed: his violent antisemitism in later works (particularly "On the Jews and Their Lies," 1543) was cited by Nazis four centuries later.',
  },
  {
    name: 'John Calvin',
    years: '1509–1564',
    contribution:
      'French theologian whose systematic theology and model city-state in Geneva shaped Reformed Christianity worldwide. His doctrine of predestination and emphasis on moral discipline influenced Puritanism, Presbyterianism, and — according to Max Weber — the development of capitalism itself.',
  },
  {
    name: 'Henry VIII',
    years: '1491–1547',
    contribution:
      'King of England who broke with Rome over a marriage annulment, not theology. Created the Church of England, dissolved 800 monasteries, and redistributed ecclesiastical wealth to the crown and nobility. His six marriages and the religious whiplash of his children\'s reigns (Edward VI: Protestant; Mary I: Catholic; Elizabeth I: Protestant compromise) made England a religious battlefield for a century.',
  },
  {
    name: 'Ignatius of Loyola',
    years: '1491–1556',
    contribution:
      'Former soldier who founded the Society of Jesus (Jesuits), the most influential religious order of the Counter-Reformation. His "Spiritual Exercises" remain a foundational text in Christian spirituality. The Jesuits\' commitment to education, missionary work, and intellectual rigor made them the Catholic Church\'s most effective response to Protestantism.',
  },
  {
    name: 'Johannes Gutenberg',
    years: 'c. 1400–1468',
    contribution:
      'Goldsmith from Mainz who invented the first practical movable-type printing system. His technology was the essential precondition for the Reformation: without mass printing, Luther\'s ideas would have been suppressed as Hus\'s and Wycliffe\'s were. Gutenberg himself died in relative obscurity, never knowing that his invention would reshape civilization.',
  },
  {
    name: 'Jan Hus',
    years: 'c. 1372–1415',
    contribution:
      'Czech priest and reformer who challenged indulgences, clerical corruption, and papal authority a century before Luther. Promised safe conduct to the Council of Constance, he was instead arrested, tried for heresy, and burned at the stake. His execution radicalized Bohemia and sparked the Hussite Wars — proving that reform movements could not be extinguished by executing their leaders.',
  },
  {
    name: 'Erasmus of Rotterdam',
    years: '1466–1536',
    contribution:
      'The greatest humanist scholar of his age, Erasmus published a critical Greek New Testament that exposed errors in the Latin Vulgate — inadvertently providing Luther\'s ammunition. His satirical "In Praise of Folly" mocked Church corruption. But Erasmus refused to join Luther\'s movement, believing reform should come from within. He was mocked by both sides — too Protestant for Catholics, too Catholic for Protestants.',
  },
  {
    name: 'Thomas Müntzer',
    years: 'c. 1489–1525',
    contribution:
      'Radical reformer who took Luther\'s ideas to their logical social conclusion: if all Christians are equal before God, why should peasants serve lords? Müntzer became a leader of the German Peasants\' War, preaching a revolutionary theology of liberation. Captured after the Battle of Frankenhausen, he was tortured and beheaded. Marx and Engels later claimed him as a proto-communist revolutionary.',
  },
];

const FIGURE_COLORS = [REFORMATION_GOLD, INDIGO, ROSE, TEAL, PARCHMENT, CRIMSON, GREEN, AMBER, PURPLE, BLUE];

// ── Impact and Legacy ───────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Literacy: Reading as Religious Duty',
    detail:
      'The Protestant emphasis on every believer reading Scripture for themselves drove the first mass literacy campaigns in history. Lutheran Germany established compulsory education for both boys and girls. Scotland\'s 1616 Education Act mandated a school in every parish. By the 18th century, Protestant regions of Europe had significantly higher literacy rates than Catholic ones. The connection between Protestantism and literacy reshaped the modern world: a literate population is also a population that can read political pamphlets, scientific papers, and philosophical arguments.',
  },
  {
    label: 'Language: Luther\'s Bible Creates German',
    detail:
      'Before Luther, there was no standard German — only a patchwork of regional dialects so different that a Bavarian and a Saxon could barely understand each other. Luther\'s Bible translation, written in a vigorous, accessible common German, became the most widely read book in the German-speaking world. Over generations, it standardized the language. Luther gave German its literary voice in the same way that the King James Bible (1611) shaped English prose. A unified German language preceded — and arguably enabled — a unified German nation.',
  },
  {
    label: 'Science: From Religious Skepticism to Scientific Skepticism',
    detail:
      'The Reformation\'s core argument — that received authority (the Pope, tradition) should be tested against direct evidence (Scripture) — laid the conceptual groundwork for the Scientific Revolution. If you can question the Pope, you can question Aristotle. Protestant regions of Europe disproportionately led the Scientific Revolution: the Royal Society in England, the Dutch universities, the Scandinavian academies. This is not coincidence. The habit of challenging authority, once established in religion, proved impossible to contain.',
  },
  {
    label: 'Capitalism: Max Weber\'s Protestant Ethic',
    detail:
      'Sociologist Max Weber argued in 1905 that Calvinist theology — particularly the idea that worldly success might be a sign of God\'s favor (a "calling") combined with strict discipline and thrift — created the psychological conditions for modern capitalism. The thesis remains debated, but the correlation is striking: the most economically dynamic regions of early modern Europe were overwhelmingly Protestant (the Netherlands, England, northern Germany). Whether Protestantism caused capitalism or merely accompanied it, the two were deeply intertwined.',
  },
  {
    label: 'Religious Pluralism: The Fragmentation That Never Stopped',
    detail:
      'Once Luther established the principle that individual conscience, guided by Scripture, is the final authority — there was no mechanism to prevent endless fragmentation. If Luther can break with the Pope, Calvin can break with Luther, and the Anabaptists can break with everyone. Today there are an estimated 40,000+ Protestant denominations worldwide. The Reformation\'s greatest legacy may be its most ironic: it didn\'t establish the "true" Christianity; it established the principle that no single institution can claim a monopoly on truth.',
  },
  {
    label: 'Church-State Separation: Born from Exhaustion',
    detail:
      'The separation of church and state — now a foundational principle of liberal democracy — emerged not from Enlightenment philosophy but from sheer exhaustion with religious war. After 130 years of killing over whose Christianity was correct, Europeans gradually concluded that the state should not enforce religious belief. This principle traveled to America with the Puritans (themselves refugees from religious persecution) and was enshrined in the First Amendment. The American experiment in religious freedom is a direct legacy of the Reformation\'s bloody aftermath.',
  },
  {
    label: 'America: A Reformation Colony',
    detail:
      'The Puritans who settled New England were Calvinist dissenters fleeing the Church of England — itself a product of the Reformation. The Quakers in Pennsylvania, the Baptists in Rhode Island, the German Lutherans and Reformed in the mid-Atlantic — America was colonized by the Reformation\'s religious refugees. The Constitution\'s prohibition of established religion, the cultural emphasis on individual conscience, the democratic suspicion of centralized authority — these are Reformation values secularized. America is, in many ways, the Reformation\'s most successful experiment.',
  },
];

// ── Key Statistics ───────────────────────────────────────────────────────────

const KEY_STATS: { stat: string; context: string; color: string }[] = [
  { stat: '40,000+', context: 'Protestant denominations exist today — once authority fractures, it keeps fracturing', color: INDIGO },
  { stat: '8 million', context: 'dead in the Thirty Years\' War — one-third of Germany\'s entire population', color: CRIMSON },
  { stat: '3,000–30,000', context: 'Huguenots killed in the St. Bartholomew\'s Day Massacre, August 1572', color: BLOOD_RED },
  { stat: '10 months', context: 'Luther translated the New Testament into German while hiding at Wartburg Castle', color: REFORMATION_GOLD },
  { stat: '49 survive', context: 'of 180 Gutenberg Bibles printed (c. 1455) — each worth ~$30 million today', color: PARCHMENT },
  { stat: '131 years', context: 'from Luther\'s 95 Theses (1517) to the Peace of Westphalia (1648)', color: TEAL },
];

// ── Denominations tree data ─────────────────────────────────────────────────

const DENOMINATIONS: { branch: string; founder: string; key: string; color: string }[] = [
  { branch: 'Lutheran', founder: 'Martin Luther (1517)', key: 'Justification by faith, Bible authority, retained liturgy', color: REFORMATION_GOLD },
  { branch: 'Reformed / Calvinist', founder: 'John Calvin (1536)', key: 'Predestination, elder governance, strict discipline', color: INDIGO },
  { branch: 'Anglican', founder: 'Henry VIII (1534)', key: 'Catholic structure, Protestant theology, royal supremacy', color: ROSE },
  { branch: 'Anabaptist', founder: 'Conrad Grebel, Felix Manz (1525)', key: 'Adult baptism, pacifism, church-state separation', color: GREEN },
  { branch: 'Presbyterian', founder: 'John Knox (1560s)', key: 'Calvinist theology, elder governance, Scottish heritage', color: TEAL },
  { branch: 'Puritan / Congregational', founder: 'English dissenters (1560s–)', key: 'Calvinist, local church autonomy, moral strictness', color: AMBER },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

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
        {children}
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
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
              A monk posts 95 propositions on a church door. Within a generation,
              Christianity is shattered, Europe is at war, and the medieval world
              is over. The Protestant Reformation was more than a religious
              dispute — it was the earthquake that cracked open the modern world:
              mass literacy, the nation-state, the Scientific Revolution,
              capitalism, religious freedom, and the very concept that authority
              must justify itself to the individual conscience.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              From Luther's 95 Theses in 1517 to the Peace of Westphalia in
              1648, the Reformation triggered 131 years of theological argument,
              political revolution, and devastating warfare. 8 million died in
              the Thirty Years' War alone. But from the wreckage emerged the
              principles that define the modern West: that no institution has a
              monopoly on truth, that every person can read and reason for
              themselves, and that the state cannot compel belief.
            </p>
          </motion.div>
        </header>

        {/* ── Gutenberg Callout ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: 'rgba(184, 134, 11, 0.08)',
            border: `1px solid ${REFORMATION_GOLD}44`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <p
            style={{
              color: PARCHMENT,
              fontSize: '1.15rem',
              fontWeight: 600,
              fontStyle: 'italic',
              lineHeight: 1.6,
              textAlign: 'center',
            }}
          >
            "Without the printing press, Luther is just another heretic burned
            at the stake."
          </p>
          <p
            style={{
              color: SLATE,
              fontSize: '0.85rem',
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            Jan Hus had the same ideas. He was burned alive in 1415. Luther had
            Gutenberg.
          </p>
        </motion.div>

        {/* ── Key Stats ────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 12,
            marginBottom: 8,
          }}
        >
          {KEY_STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: `1px solid ${s.color}33`,
                borderRadius: 10,
                padding: 16,
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  color: s.color,
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  marginBottom: 4,
                }}
              >
                {s.stat}
              </p>
              <p style={{ color: ASH, fontSize: '0.78rem', lineHeight: 1.5 }}>
                {s.context}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Section 1: The Medieval Catholic Church ──────────────────── */}
        <SectionWrapper
          id="medieval-church"
          icon="⛪"
          title="The Medieval Catholic Church — Power, Corruption, and Civilization"
          accentColor={PAPAL_PURPLE}
          intro="To understand why Luther's challenge ignited a revolution, you must understand the institution he was challenging. The Catholic Church was not merely a religious organization — it was the most powerful institution in Europe, owning a third of all land, crowning kings, and controlling access to salvation itself. It was also riddled with corruption so blatant that even loyal Catholics were appalled."
        >
          <InsightGrid items={MEDIEVAL_CHURCH} />
        </SectionWrapper>

        {/* ── Section 2: Gutenberg and the Printing Press ──────────────── */}
        <SectionWrapper
          id="gutenberg"
          icon="📜"
          title="Gutenberg and the Printing Press — The Technology That Changed Everything"
          accentColor={PARCHMENT}
          intro="The Reformation was a religious movement enabled by a technological revolution. Without Johannes Gutenberg's movable-type printing press (c. 1440), Luther's ideas would have been contained and suppressed, just as Hus's and Wycliffe's had been. The printing press made ideas unstoppable — and the Reformation was the first movement to prove it."
        >
          <InsightGrid items={GUTENBERG_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 3: Martin Luther ─────────────────────────────────── */}
        <SectionWrapper
          id="luther"
          icon="📖"
          title="Martin Luther — The Monk Who Broke the Church"
          accentColor={REFORMATION_GOLD}
          intro="Martin Luther did not set out to split Christianity. He was an Augustinian monk and theology professor at the University of Wittenberg, troubled by the gap between what Scripture said and what the Church practiced. His challenge to the indulgence trade escalated — through a combination of conviction, stubbornness, and the printing press — into the most consequential religious revolution in Western history."
        >
          <TimelineCard entries={LUTHER_TIMELINE} />
        </SectionWrapper>

        {/* ── Section 4: Luther's Core Theology ────────────────────────── */}
        <SectionWrapper
          id="theology"
          icon="✝️"
          title="Luther's Core Theological Innovations"
          accentColor={GOLD}
          intro="Luther's theology can be reduced to three principles — each of which was a direct assault on the power structure of the medieval Catholic Church. Together, they didn't just challenge specific practices; they demolished the conceptual foundation on which 1,000 years of Church authority rested."
        >
          <InsightGrid items={THEOLOGY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 5: The Reformation Spreads ───────────────────────── */}
        <SectionWrapper
          id="spread"
          icon="🌍"
          title="The Reformation Spreads — Calvin, Henry VIII, and the Radical Fringe"
          accentColor={INDIGO}
          intro="Luther opened the door, but the Reformation quickly escaped his control. Within two decades, independent reform movements had erupted across Europe — each taking Luther's core insights in different directions, and each creating new churches, new conflicts, and new visions of Christian society."
        >
          <InsightGrid items={SPREAD_INSIGHTS} />
        </SectionWrapper>

        {/* ── Denominations Tree ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{ padding: '24px 0 48px' }}
        >
          <h3
            style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: 18,
            }}
          >
            The Protestant Family Tree
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DENOMINATIONS.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  borderLeft: `3px solid ${d.color}`,
                  paddingLeft: 16,
                  paddingTop: 6,
                  paddingBottom: 6,
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: d.color, fontSize: '1rem', marginBottom: 2 }}>
                    {d.branch}
                  </p>
                  <p style={{ color: SLATE, fontSize: '0.8rem', marginBottom: 4 }}>{d.founder}</p>
                  <p style={{ color: ASH, fontSize: '0.88rem', lineHeight: 1.6 }}>{d.key}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Section 6: The Religious Wars ────────────────────────────── */}
        <SectionWrapper
          id="wars"
          icon="⚔️"
          title="The Religious Wars — 131 Years of Blood (1524–1648)"
          accentColor={CRIMSON}
          intro="The Reformation's ideas were liberating in theory but devastating in practice. The question 'which Christianity is correct?' could not be answered by argument alone — and so it was answered by force. For over a century, Europe tore itself apart in religious wars that killed millions and devastated entire regions."
        >
          <TimelineCard entries={WARS_TIMELINE} />
        </SectionWrapper>

        {/* ── Section 7: The Counter-Reformation ───────────────────────── */}
        <SectionWrapper
          id="counter-reformation"
          icon="🏛️"
          title="The Catholic Counter-Reformation"
          accentColor={CHURCH_RED}
          intro="The Catholic Church did not simply collapse under the Protestant challenge. It fought back — with theology, education, missionary zeal, and force. The Counter-Reformation was both a genuine internal reform movement and a determined effort to halt Protestantism's advance."
        >
          <InsightGrid items={COUNTER_REFORMATION} />
        </SectionWrapper>

        {/* ── Section 8: Key Figures ────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures of the Reformation"
          accentColor={GOLD}
          intro="The Reformation was shaped by theologians, kings, printers, and radicals — visionaries who reshaped Christianity and pragmatists who exploited the chaos for power."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Section 9: Why It Still Matters ──────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🔗"
          title="Why It Still Matters — The Reformation's Living Legacy"
          accentColor={TEAL}
          intro="The Reformation didn't just split one church into many — it reshaped how human beings relate to authority, knowledge, work, and each other. The principles born in the religious upheavals of the 16th century became the foundations of the modern world."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Connection links ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: 24,
            marginTop: 16,
          }}
        >
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: 14,
            }}
          >
            Continue the Story
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { to: '/scientific-revolution', label: 'The Scientific Revolution' },
              { to: '/enlightenment', label: 'The Enlightenment' },
              { to: '/french-revolution', label: 'The French Revolution' },
              { to: '/human-rights-history', label: 'Human Rights History' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: '#60a5fa',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: '1px solid rgba(96,165,250,0.25)',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = 'rgba(96,165,250,0.1)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </motion.div>

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
            "Unless I am convinced by the testimony of the Scriptures or by
            clear reason, I cannot and will not recant anything, for to go
            against conscience is neither right nor safe. Here I stand, I can do
            no other. God help me."
            — Martin Luther, Diet of Worms, April 18, 1521
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
