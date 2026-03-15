/**
 * MathHistoryPage — comprehensive deep-dive on the History of Mathematics
 * (c. 43,000 BCE – Present).
 *
 * Route: /math-history
 *
 * Sections:
 *  1. Hero — headline, mathematics as humanity's universal language
 *  2. Prehistoric Counting — Ishango bone, Lebombo bone, why counting arose
 *  3. Ancient Mathematics — Mesopotamian, Egyptian, Babylonian
 *  4. Greek Mathematics — abstraction and proof (Thales → Hypatia)
 *  5. Indian Mathematics — the revolution (Aryabhata, Brahmagupta, zero)
 *  6. Islamic Golden Age — Al-Khwarizmi, algebra, algorithm
 *  7. European Renaissance & Early Modern — Fibonacci → Newton/Leibniz
 *  8. 18th–19th Century Explosion — Euler, Gauss, Galois, Riemann
 *  9. 20th Century — Hilbert, Gödel, Turing, Millennium problems
 * 10. Key Figures — 20+ mathematicians who shaped the discipline
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const AMBER = '#d97706';
const BLUE = '#3b82f6';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const CRIMSON = '#dc2626';
const ORANGE = '#f97316';
const EMERALD = '#10b981';
const SKY = '#38bdf8';
const VIOLET = '#8b5cf6';
const CYAN = '#06b6d4';
const SAND = '#d4a574';
const TERRACOTTA = '#c2410c';

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

// ── Prehistoric Counting ────────────────────────────────────────────────────

const PREHISTORIC_INSIGHTS: InsightEntry[] = [
  {
    label: 'Lebombo Bone (c. 43,000 BCE)',
    detail:
      'Found in the Lebombo Mountains between South Africa and Eswatini, this baboon fibula bears 29 tally marks — making it possibly the oldest known mathematical artifact in human history. The 29 marks may represent a lunar calendar cycle, suggesting that tens of thousands of years before written language, humans were already tracking astronomical patterns through counting. The bone demonstrates that mathematical thinking predates civilization itself.',
  },
  {
    label: 'Ishango Bone (c. 18,000 BCE)',
    detail:
      'Discovered in 1960 at Ishango in the Congo, this bone tool bears three columns of grouped tally marks that have fascinated mathematicians for decades. One column contains marks grouped as 11, 13, 17, and 19 — the prime numbers between 10 and 20. Another column seems to demonstrate doubling. Whether the creator understood primes is debated, but the bone clearly shows deliberate mathematical organization far beyond simple counting. It challenges the assumption that mathematical thinking began in the ancient Near East.',
  },
  {
    label: 'Why Counting Arose',
    detail:
      'The origins of counting are rooted in survival. Early humans needed to track the seasons for migration and planting, count animals in herds for hunting, manage trade and exchange of goods, and record debts within communities. The transition from one-to-one correspondence ("this many pebbles for that many sheep") to abstract number concepts ("the number five") was one of the greatest cognitive leaps in human history — and it happened independently in multiple cultures across the globe.',
  },
];

// ── Ancient Mathematics ─────────────────────────────────────────────────────

const ANCIENT_TIMELINE: TimelineEntry[] = [
  {
    year: '3000–300 BCE',
    title: 'Mesopotamian Mathematics — The Base-60 Revolution',
    description:
      'The Sumerians and Babylonians developed the most sophisticated mathematics of the ancient world. Their base-60 (sexagesimal) number system is why we still have 60 seconds in a minute, 60 minutes in an hour, and 360 degrees in a circle. They solved quadratic equations, compiled tables of reciprocals, squares, and cubes, and approximated π as 3.125. Most remarkably, the Plimpton 322 tablet (c. 1800 BCE) contains a table of Pythagorean triples — proving that the relationship a² + b² = c² was known a full millennium before Pythagoras was born.',
    color: SAND,
  },
  {
    year: '3000–300 BCE',
    title: 'Egyptian Mathematics — Building the Impossible',
    description:
      'Egyptian mathematics was above all practical — designed to survey land after Nile floods, calculate grain storage, and build monuments. The Rhind Papyrus (c. 1650 BCE), copied by the scribe Ahmes from an older work, contains 87 mathematical problems covering fractions, algebra, geometry, and arithmetic progressions. The Egyptians used unit fractions exclusively (1/n), developed formulas for areas and volumes, and built the Great Pyramid of Giza with an error in its base of less than 2.1 centimeters across 230 meters — a precision of 0.001% achieved through applied mathematics 4,500 years ago.',
    color: GOLD,
  },
  {
    year: '1800–300 BCE',
    title: 'Babylonian Mathematics — Place Value and Algebra',
    description:
      'The Babylonians invented the concept of place value — the idea that a digit\'s position determines its magnitude. This was revolutionary: earlier systems like Roman numerals had no place value, making calculation cumbersome. Babylonian scribes could solve systems of linear equations, compute square roots to remarkable accuracy (√2 ≈ 1.41421 on a tablet from 1800 BCE, accurate to five decimal places), and handle problems that today we would classify as algebra. Their mathematical tablets were preserved because they wrote on clay — paper and papyrus decay, but baked clay survives millennia.',
    color: TERRACOTTA,
  },
];

// ── Greek Mathematics ───────────────────────────────────────────────────────

const GREEK_TIMELINE: TimelineEntry[] = [
  {
    year: 'c. 624–546 BCE',
    title: 'Thales of Miletus — The Birth of Deductive Reasoning',
    description:
      'Thales is considered the first mathematician in the modern sense — not because he calculated, but because he proved. Before Thales, mathematics was a collection of practical recipes: "do this, get that." Thales introduced deductive reasoning: starting from axioms and deriving conclusions through logical steps. He proved that a circle is bisected by its diameter and that base angles of an isosceles triangle are equal. This shift from "how" to "why" — from computation to proof — was the foundational revolution that made mathematics a science rather than a craft.',
    color: BLUE,
  },
  {
    year: '570–495 BCE',
    title: 'Pythagoras — The Theorem and the Brotherhood',
    description:
      'Pythagoras founded a mystical-mathematical brotherhood in southern Italy that believed "all is number." The Pythagorean theorem (a² + b² = c²) bears his name, though Babylonians knew the relationship a millennium earlier — Pythagoras\'s contribution was proving it deductively. His school discovered that musical harmony has mathematical ratios (an octave is 2:1, a fifth is 3:2) and that irrational numbers exist (√2 cannot be expressed as a fraction) — a discovery so disturbing to their worldview that, according to legend, they drowned the member who revealed it.',
    color: INDIGO,
  },
  {
    year: 'c. 300 BCE',
    title: 'Euclid — The Elements, Template for All Proof',
    description:
      'Euclid\'s "Elements" is arguably the most influential textbook ever written. In 13 books, Euclid built the entire known geometry of his time from just five postulates and five common notions, using rigorous logical deduction. The structure — start with axioms, derive everything else through proof — became the template for all mathematical reasoning and influenced thinkers from Newton to Einstein. The Elements was the standard geometry textbook for over 2,000 years and, after the Bible, may be the most widely published book in Western history. Abraham Lincoln taught himself logical reasoning by studying Euclid.',
    color: TEAL,
  },
  {
    year: '287–212 BCE',
    title: 'Archimedes — The Greatest Mathematician of Antiquity',
    description:
      'Archimedes of Syracuse was centuries ahead of his time. He calculated π to between 3.1408 and 3.1429 using inscribed and circumscribed 96-sided polygons — a method of exhaustion that anticipated integral calculus by 1,900 years. He determined the volume and surface area of a sphere relative to its circumscribing cylinder (a result he was so proud of that it was inscribed on his tombstone), discovered the law of buoyancy, and designed war machines that held off the Roman siege of Syracuse for two years. He was killed by a Roman soldier during the fall of the city, reportedly while working on a geometry problem.',
    color: EMERALD,
  },
  {
    year: 'c. 276–194 BCE',
    title: 'Eratosthenes — Measuring the Earth with Shadows',
    description:
      'The librarian of Alexandria calculated the circumference of the Earth using nothing but shadows, geometry, and a remarkable insight. He noticed that at noon on the summer solstice, the sun was directly overhead in Syene (Aswan) — a stick cast no shadow — but in Alexandria, 500 miles north, a stick cast a shadow at an angle of about 7.2°. Since 7.2° is 1/50 of a full circle, the Earth\'s circumference must be about 50 × 500 = 25,000 miles. The actual value is 24,901 miles — Eratosthenes was accurate to within about 2%, using nothing more than sticks and geometry.',
    color: SKY,
  },
  {
    year: '360–415 CE',
    title: 'Hypatia of Alexandria — The First Known Female Mathematician',
    description:
      'Hypatia was the leading mathematician and philosopher of late Roman Alexandria. She edited and wrote commentaries on Diophantus\'s "Arithmetica" (the foundational text of algebra) and Apollonius\'s work on conic sections, and was renowned as a brilliant teacher who attracted students from across the Mediterranean. She was murdered by a Christian mob in 415 CE — dragged from her chariot, stripped, and beaten to death with roof tiles in a church. Her death is often seen as a symbol of the end of classical learning in the ancient world.',
    color: ROSE,
  },
];

// ── Indian Mathematics ──────────────────────────────────────────────────────

const INDIAN_INSIGHTS: InsightEntry[] = [
  {
    label: 'Aryabhata (476–550 CE) — The Quiet Revolutionary',
    detail:
      'At age 23, Aryabhata wrote the Aryabhatiya, one of the most important mathematical works in history. He developed a decimal place-value system, calculated π to 3.14159265 (correct to eight decimal places), created comprehensive trigonometry tables (defining sine, cosine, and versine), solved quadratic equations, and — most boldly — declared that the Earth rotates on its own axis, explaining the apparent motion of the stars. This heliocentric insight preceded Copernicus by a thousand years. His work was transmitted to the Islamic world and eventually to Europe, fundamentally shaping global mathematics.',
  },
  {
    label: 'Brahmagupta (598–668 CE) — The Man Who Invented Zero',
    detail:
      'In his Brahmasphutasiddhanta (628 CE), Brahmagupta did something no mathematician had done before: he treated zero as a number in its own right, not just a placeholder. He formulated rules for arithmetic with zero: any number plus zero equals itself, any number times zero equals zero, and zero minus zero equals zero. He struggled with division by zero (proposing 0/0 = 0, which we now know is undefined), but his framework for zero as a full participant in arithmetic was revolutionary. Without zero as a number, modern mathematics, science, and computing would be impossible.',
  },
  {
    label: 'The Decimal Place-Value System — India\'s Greatest Export',
    detail:
      'The decimal place-value system — ten digits (0–9) where a digit\'s position determines its value — was developed in India over several centuries. It is arguably the most important mathematical invention in human history. Try multiplying MCMXLVII by CDLXXXIX in Roman numerals, and you\'ll understand why. The system was transmitted to the Islamic world through trade and scholarly exchange (particularly through Al-Khwarizmi\'s 9th-century treatise), and from there to Europe, where the digits became known as "Arabic numerals." They should properly be called "Indian numerals" — but by the time Europe adopted them, the Indian origin had been forgotten.',
  },
];

// ── Islamic Golden Age ──────────────────────────────────────────────────────

const ISLAMIC_TIMELINE: TimelineEntry[] = [
  {
    year: '780–850 CE',
    title: 'Al-Khwarizmi — Algebra and Algorithm',
    description:
      'Muhammad ibn Musa al-Khwarizmi, working at the House of Wisdom in Baghdad, wrote two books that changed the world. His "Al-Kitab al-Mukhtasar fi Hisab al-Jabr wal-Muqabala" (The Compendious Book on Calculation by Completion and Balancing) gave us the word "algebra" — from "al-jabr" (completion/restoration). His treatise on Indian numerals introduced the decimal system to the Islamic world, and his name, Latinized as "Algoritmi," gave us the word "algorithm." Every time you use algebra or run an algorithm, you are using concepts named after this 9th-century Persian scholar.',
    color: EMERALD,
  },
  {
    year: '9th–12th Century',
    title: 'Transmission and Transformation of Indian Numerals',
    description:
      'Islamic scholars didn\'t merely transmit Indian mathematics — they transformed it. They refined the decimal system, developed decimal fractions, and created trigonometric functions (sine, cosine, tangent) in their modern form. Al-Kashi calculated π to 16 decimal places in 1424 — a record that stood for almost 200 years. The House of Wisdom in Baghdad and similar centers in Cairo, Córdoba, and Samarkand were the world\'s leading mathematical research institutions for nearly five centuries.',
    color: TEAL,
  },
  {
    year: '1048–1131 CE',
    title: 'Omar Khayyam — Cubics and Calendars',
    description:
      'Omar Khayyam — better known in the West as the poet of the Rubáiyát — was a brilliant mathematician who developed a geometric method for solving all types of cubic equations, classified cubic equations into 19 types, and contributed to the reform of the Persian calendar. His Jalali calendar, commissioned by Sultan Malik-Shah I, was more accurate than the Gregorian calendar that Europe wouldn\'t adopt for another 500 years. Khayyam also explored the parallel postulate — work that anticipated non-Euclidean geometry by 700 years.',
    color: VIOLET,
  },
];

// ── European Renaissance & Early Modern ─────────────────────────────────────

const RENAISSANCE_TIMELINE: TimelineEntry[] = [
  {
    year: '1170–1250',
    title: 'Fibonacci — Arabic Numerals Come to Europe',
    description:
      'Leonardo of Pisa, known as Fibonacci, traveled the Mediterranean as a young man and encountered the Indian-Arabic numeral system in North Africa. His "Liber Abaci" (1202) introduced these numerals to Europe, demonstrating their vast superiority over Roman numerals for calculation. He also posed the famous rabbit problem that produces the Fibonacci sequence (1, 1, 2, 3, 5, 8, 13, 21...) — a sequence that appears everywhere in nature, from sunflower spirals to pinecone patterns to galaxy arms. It took centuries for European merchants and scholars to fully adopt the new numerals — the old ways die hard.',
    color: AMBER,
  },
  {
    year: '1501–1576',
    title: 'Cardano — Cubics, Quartics, and Probability',
    description:
      'Gerolamo Cardano published solutions to cubic and quartic equations in his "Ars Magna" (1545) — though the cubic solution was actually discovered by Niccolò Tartaglia, leading to one of mathematics\' bitterest priority disputes. Cardano was also one of the first to analyze games of chance mathematically, writing "Liber de Ludo Aleae" — the first systematic treatment of probability. He was a physician, gambler, astrologer, and polymath whose personal life was as dramatic as his mathematics: his son was executed for murder, and Cardano himself was imprisoned for heresy.',
    color: CRIMSON,
  },
  {
    year: '1540–1603',
    title: 'Viète — The Birth of Algebraic Notation',
    description:
      'François Viète revolutionized mathematics by introducing the systematic use of letters to represent unknowns and known quantities in equations. Before Viète, algebra was written in prose: "the square of the thing plus three things equals ten." After Viète, it became symbolic: x² + 3x = 10. This seems like a minor notational convenience, but it was transformative — symbolic notation allowed mathematicians to see patterns, manipulate equations mechanically, and think at a level of abstraction that verbal algebra made nearly impossible.',
    color: BLUE,
  },
  {
    year: '1596–1650',
    title: 'Descartes — Where Algebra Meets Geometry',
    description:
      'René Descartes unified two branches of mathematics that had been separate for millennia: algebra and geometry. His Cartesian coordinate system — the x-y plane you learned in school — allows geometric shapes to be described by algebraic equations and algebraic equations to be visualized as geometric curves. Every graph you\'ve ever seen, every GPS coordinate, every pixel on your screen exists because Descartes realized that a point in space can be described by numbers. "La Géométrie" (1637) may be the most consequential appendix ever written — it was literally an appendix to his philosophical "Discourse on the Method."',
    color: INDIGO,
  },
  {
    year: '1665–1676',
    title: 'Newton AND Leibniz — The Calculus Wars',
    description:
      'Isaac Newton (1665–66) and Gottfried Wilhelm Leibniz (1675–76) independently invented calculus — the mathematics of change and accumulation. Newton developed "fluxions" to describe planetary motion; Leibniz developed a more elegant notation (dy/dx, ∫) that we still use today. What followed was one of the ugliest priority disputes in scientific history: Newton accused Leibniz of plagiarism, the Royal Society (stacked with Newton\'s allies) "investigated" and sided with Newton, and the feud poisoned relations between British and Continental mathematics for a century. The modern consensus: both invented calculus independently, and Leibniz\'s notation was better.',
    color: PURPLE,
  },
];

// ── 18th–19th Century Explosion ─────────────────────────────────────────────

const MODERN_TIMELINE: TimelineEntry[] = [
  {
    year: '1707–1783',
    title: 'Euler — The Most Prolific Mathematician in History',
    description:
      'Leonhard Euler\'s output is staggering: over 800 papers and books filling 92 volumes — more than any mathematician before or after. He introduced the notation we use today: f(x) for functions, e for the base of natural logarithms, i for √-1, π for the ratio of circumference to diameter, and Σ for summation. His identity e^(iπ) + 1 = 0 — connecting five fundamental constants in one equation — is widely considered the most beautiful equation in mathematics. He made groundbreaking contributions to number theory, graph theory (solving the Königsberg bridge problem), calculus, and mechanics. He was blind for the last 17 years of his life and his productivity actually increased.',
    color: GOLD,
  },
  {
    year: '1777–1855',
    title: 'Gauss — The Prince of Mathematics',
    description:
      'Carl Friedrich Gauss was a child prodigy who reportedly summed the integers 1 to 100 in seconds as a schoolboy (1+100=101, 2+99=101, ... 50 pairs × 101 = 5,050). His contributions span virtually every branch of mathematics: number theory ("Disquisitiones Arithmeticae," published at age 24, remains a masterpiece), statistics (the Gaussian/bell curve), non-Euclidean geometry (which he explored privately but never published, fearing controversy), differential geometry, magnetism, and astronomy. He proved the Fundamental Theorem of Algebra and discovered the construction of the regular 17-gon. His motto: "Few, but ripe."',
    color: BLUE,
  },
  {
    year: '1802–1829',
    title: 'Abel and Galois — Tragedy and Group Theory',
    description:
      'Niels Henrik Abel proved that there is no general formula for solving quintic (5th-degree) equations — a question that had haunted mathematicians for centuries. He died of tuberculosis at 26, penniless, two days before a letter arrived offering him a professorship. Évariste Galois, even more tragically, developed group theory — one of the most important structures in modern mathematics — and was killed in a duel at age 20. The night before the duel, he frantically wrote down his mathematical ideas, scrawling "I have no time" in the margins. His work, largely ignored during his lifetime, revolutionized algebra and underpins modern physics, cryptography, and coding theory.',
    color: ROSE,
  },
  {
    year: '1826–1866',
    title: 'Riemann — Geometry, Hypothesis, and Relativity',
    description:
      'Bernhard Riemann transformed mathematics in his brief 39 years. His 1854 habilitation lecture on the foundations of geometry introduced Riemannian geometry — the mathematics of curved spaces — which became the mathematical language Einstein needed for general relativity 60 years later. His 1859 paper on prime numbers introduced the Riemann zeta function and the Riemann Hypothesis: that all non-trivial zeros of the zeta function have real part 1/2. This single conjecture, still unproven after 165+ years, is considered the most important unsolved problem in mathematics. A proof would revolutionize our understanding of prime numbers.',
    color: CYAN,
  },
];

// ── 20th Century: Foundations and Crisis ─────────────────────────────────────

const TWENTIETH_INSIGHTS: InsightEntry[] = [
  {
    label: 'Hilbert\'s 23 Problems (1900) — Setting the Century\'s Agenda',
    detail:
      'At the International Congress of Mathematicians in Paris, David Hilbert presented a list of 23 unsolved problems that he believed would shape the future of mathematics. He was spectacularly right. The problems drove research for the entire 20th century: some were solved (the 10th, on Diophantine equations, was proven unsolvable by Matiyasevich in 1970), some remain open (the 8th, the Riemann Hypothesis), and some reshaped entire fields. Hilbert\'s vision — that every mathematical statement could eventually be proven true or false — would be shattered 31 years later by a young Austrian logician.',
  },
  {
    label: 'Gödel\'s Incompleteness Theorems (1931) — The Limits of Proof',
    detail:
      'Kurt Gödel\'s two incompleteness theorems are among the most profound results in the history of thought. The first theorem states that in any consistent formal system powerful enough to express basic arithmetic, there exist true statements that cannot be proven within the system. The second theorem states that such a system cannot prove its own consistency. In other words: mathematics will always contain truths it cannot prove, and it can never fully verify its own foundations. This shattered Hilbert\'s program and forced mathematicians to confront fundamental limits on what formal reasoning can achieve — limits that are inherent, not technical.',
  },
  {
    label: 'Turing (1912–1954) — The Foundation of Computer Science',
    detail:
      'Alan Turing\'s 1936 paper "On Computable Numbers" introduced the Turing machine — an abstract device that formalized the concept of computation and proved that some problems are fundamentally undecidable (no algorithm can solve them). This theoretical work became the foundation of all computer science. During World War II, Turing led the effort to break the German Enigma cipher at Bletchley Park — work estimated to have shortened the war by two years and saved millions of lives. Despite his extraordinary contributions, Turing was prosecuted for homosexuality in 1952, chemically castrated, and died of cyanide poisoning in 1954 at age 41. He received a royal pardon in 2013.',
  },
  {
    label: 'Ramanujan (1887–1920) — The Man Who Knew Infinity',
    detail:
      'Srinivasa Ramanujan, a self-taught mathematician from southern India with almost no formal training, produced results of extraordinary depth and originality. Working in isolation, he independently rediscovered and extended theorems that had taken European mathematicians centuries to develop. His 1913 letter to G.H. Hardy at Cambridge — containing theorems on infinite series, continued fractions, and number theory — led Hardy to call Ramanujan\'s talent "in the same league as Euler and Gauss." Ramanujan produced nearly 4,000 results, many still being verified and applied today. He died at 32, likely of hepatic amoebiasis, leaving notebooks full of unproven conjectures that mathematicians are still exploring a century later.',
  },
  {
    label: 'Unsolved Millennium Problems — $1 Million Each',
    detail:
      'In 2000, the Clay Mathematics Institute designated seven "Millennium Prize Problems," offering $1 million for the solution of each. Only one has been solved: the Poincaré Conjecture, proven by Grigori Perelman in 2003 (he declined the prize money and withdrew from mathematics). The remaining six include: the Riemann Hypothesis (distribution of prime numbers), P vs NP (can problems whose solutions are quickly verifiable also be quickly solved?), the Navier-Stokes equations (do smooth solutions always exist for fluid dynamics?), the Yang-Mills existence and mass gap (foundations of particle physics), the Hodge Conjecture, and the Birch and Swinnerton-Dyer Conjecture. These problems define the frontiers of 21st-century mathematics.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Euclid',
    years: 'c. 325–265 BCE',
    contribution:
      'Author of "The Elements" — the axiomatic foundation of geometry and the template for mathematical proof for over 2,000 years. His five postulates and rigorous deductive method defined what mathematics means.',
  },
  {
    name: 'Archimedes',
    years: '287–212 BCE',
    contribution:
      'Calculated π, discovered buoyancy, anticipated calculus by 1,900 years, and designed war machines. Widely considered the greatest mathematician of antiquity and one of the greatest of all time.',
  },
  {
    name: 'Hypatia of Alexandria',
    years: '360–415 CE',
    contribution:
      'First known female mathematician. Edited Diophantus\'s Arithmetica and Apollonius\'s Conics. A brilliant teacher and philosopher whose murder symbolizes the end of classical learning.',
  },
  {
    name: 'Aryabhata',
    years: '476–550 CE',
    contribution:
      'Developed decimal place-value notation, calculated π to eight decimal places, built trigonometry tables, and proposed Earth\'s rotation — a millennium before Copernicus.',
  },
  {
    name: 'Brahmagupta',
    years: '598–668 CE',
    contribution:
      'Defined zero as a number with full arithmetic rules — the conceptual leap that made modern mathematics possible. Also solved quadratic equations and developed interpolation formulas.',
  },
  {
    name: 'Al-Khwarizmi',
    years: '780–850 CE',
    contribution:
      'Father of algebra (from "al-jabr") and namesake of the algorithm. Transmitted Indian numerals to the Islamic world and systematized equation-solving methods still taught today.',
  },
  {
    name: 'Omar Khayyam',
    years: '1048–1131 CE',
    contribution:
      'Solved cubic equations geometrically, classified all cubics into 19 types, and created a calendar more accurate than the Gregorian. Also a celebrated poet.',
  },
  {
    name: 'Fibonacci',
    years: '1170–1250',
    contribution:
      'Introduced Arabic-Indian numerals to Europe via Liber Abaci. The Fibonacci sequence he described appears throughout nature and is foundational to modern computer science.',
  },
  {
    name: 'René Descartes',
    years: '1596–1650',
    contribution:
      'Created the Cartesian coordinate system, unifying algebra and geometry. Every graph, map coordinate, and pixel exists because of his insight that space can be described by numbers.',
  },
  {
    name: 'Isaac Newton',
    years: '1643–1727',
    contribution:
      'Co-inventor of calculus ("method of fluxions"), laws of motion and universal gravitation, and advances in optics. Used mathematics to explain the physical universe with unprecedented precision.',
  },
  {
    name: 'Gottfried Wilhelm Leibniz',
    years: '1646–1716',
    contribution:
      'Co-inventor of calculus with superior notation (dy/dx, ∫) still used today. Also invented binary arithmetic — the foundation of all digital computing — and pioneered symbolic logic.',
  },
  {
    name: 'Leonhard Euler',
    years: '1707–1783',
    contribution:
      'Most prolific mathematician in history (800+ papers). Introduced modern notation (f(x), e, i, π, Σ), proved e^(iπ) + 1 = 0, founded graph theory. Productive even after going blind.',
  },
  {
    name: 'Carl Friedrich Gauss',
    years: '1777–1855',
    contribution:
      '"Prince of Mathematics." Revolutionized number theory, statistics (Gaussian distribution), differential geometry, and magnetism. Child prodigy who proved the Fundamental Theorem of Algebra.',
  },
  {
    name: 'Évariste Galois',
    years: '1811–1832',
    contribution:
      'Created group theory — a pillar of modern abstract algebra — before being killed in a duel at age 20. His work, scribbled the night before his death, underpins modern physics and cryptography.',
  },
  {
    name: 'Bernhard Riemann',
    years: '1826–1866',
    contribution:
      'Riemannian geometry (the math behind Einstein\'s relativity) and the Riemann Hypothesis — the most important unsolved problem in mathematics, open for 165+ years.',
  },
  {
    name: 'Srinivasa Ramanujan',
    years: '1887–1920',
    contribution:
      'Self-taught Indian genius who produced nearly 4,000 results in number theory, infinite series, and continued fractions. Died at 32, his notebooks still yielding discoveries.',
  },
  {
    name: 'David Hilbert',
    years: '1862–1943',
    contribution:
      'His 23 problems (1900) set the agenda for 20th-century mathematics. Formalized mathematical logic and believed all math could be axiomatized — until Gödel proved otherwise.',
  },
  {
    name: 'Kurt Gödel',
    years: '1906–1978',
    contribution:
      'Incompleteness Theorems proved that mathematics contains truths it can never prove — one of the most profound results in intellectual history. Close friend of Einstein at Princeton.',
  },
  {
    name: 'Alan Turing',
    years: '1912–1954',
    contribution:
      'Invented the Turing machine (theoretical foundation of all computers), broke Enigma in WWII, and pioneered artificial intelligence. Persecuted for homosexuality; posthumously pardoned.',
  },
  {
    name: 'Emmy Noether',
    years: '1882–1935',
    contribution:
      'Noether\'s theorem links symmetry to conservation laws — foundational to modern physics. Einstein called her the most important woman in the history of mathematics. Revolutionized abstract algebra.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Reusable section components
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
    <section id={id} style={{ marginBottom: 56 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <h2
          style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            marginBottom: 12,
            color: accentColor,
          }}
        >
          <span style={{ marginRight: 10 }}>{icon}</span>
          {title}
        </h2>
        <p
          style={{
            color: ASH,
            lineHeight: 1.8,
            fontSize: '1rem',
            marginBottom: 24,
            maxWidth: 800,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {entries.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 20,
          }}
        >
          <span
            style={{
              fontSize: '0.8rem',
              color: e.color,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            {e.year}
          </span>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#e2e8f0',
              margin: '4px 0 8px',
            }}
          >
            {e.title}
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
            {e.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function InsightGrid({ items }: { items: InsightEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <h4
            style={{
              fontWeight: 600,
              color: '#e2e8f0',
              marginBottom: 8,
              fontSize: '1.05rem',
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

const FIGURE_COLORS = [GOLD, BLUE, ROSE, TEAL, EMERALD, INDIGO, AMBER, PURPLE, CYAN, CRIMSON, SKY, VIOLET, ORANGE, GREEN, TERRACOTTA, SAND];

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
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function MathHistoryPage() {
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
              background: `linear-gradient(135deg, ${GOLD}, ${CYAN})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The History of Mathematics — Humanity's Universal Language (10,000 BCE–Present)
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
              Mathematics is the only subject that is fully cross-cultural — a
              theorem proven in ancient Greece is still true today, a formula
              discovered in medieval India works identically in modern New York.
              No other human creation is so universal, so permanent, so
              indifferent to the politics and prejudices of its creators.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              From tally marks carved on bones 43,000 years ago to the
              million-dollar Millennium Prize problems that define the frontier
              of human knowledge, this is the story of how humanity learned to
              count, to prove, to abstract — and in doing so, built the
              language that describes the universe itself.
            </p>
          </motion.div>
        </header>

        {/* ── Prehistoric Counting ──────────────────────────────────────── */}
        <SectionWrapper
          id="prehistoric"
          icon="🦴"
          title="Prehistoric Counting — Before Civilization (43,000–3000 BCE)"
          accentColor={SAND}
          intro="Long before writing, before cities, before agriculture — humans counted. The oldest mathematical artifacts are carved bones tens of thousands of years old, bearing tally marks that suggest our ancestors were tracking lunar cycles, managing resources, and organizing their world through numbers in the deep Paleolithic."
        >
          <InsightGrid items={PREHISTORIC_INSIGHTS} />
        </SectionWrapper>

        {/* ── Ancient Mathematics ───────────────────────────────────────── */}
        <SectionWrapper
          id="ancient"
          icon="🏛️"
          title="Ancient Mathematics — Mesopotamia, Egypt, and Babylon (3000–300 BCE)"
          accentColor={GOLD}
          intro="The first civilizations didn't just count — they calculated. Mesopotamian scribes solved quadratic equations on clay tablets, Egyptian engineers built pyramids with astonishing precision, and Babylonian mathematicians developed a place-value number system and knew the Pythagorean theorem a millennium before Pythagoras. These weren't primitive precursors to 'real' math — they were sophisticated mathematical traditions that lasted three millennia."
        >
          <TimelineCard entries={ANCIENT_TIMELINE} />
        </SectionWrapper>

        {/* ── Greek Mathematics ─────────────────────────────────────────── */}
        <SectionWrapper
          id="greek"
          icon="🏛️"
          title="Greek Mathematics — The Invention of Proof (600 BCE–415 CE)"
          accentColor={BLUE}
          intro="The Greeks transformed mathematics from a collection of practical recipes into a deductive science. Their revolutionary insight: you don't just show that something works — you prove why it must be true, starting from axioms and proceeding through unassailable logic. This idea — that mathematical truth requires proof — is the single most important concept in the history of mathematics, and it originated in the Aegean world 2,600 years ago."
        >
          <TimelineCard entries={GREEK_TIMELINE} />
        </SectionWrapper>

        {/* ── Indian Mathematics ────────────────────────────────────────── */}
        <SectionWrapper
          id="indian"
          icon="🕉️"
          title="Indian Mathematics — The Revolution (500–1200 CE)"
          accentColor={ORANGE}
          intro="If the Greeks invented proof, India invented the tools. The decimal place-value system, zero as a number, trigonometry in its modern form, and solutions to indeterminate equations — all emerged from the Indian subcontinent. These innovations didn't just advance mathematics; they made modern mathematics possible. Without the Indian numeral system and the concept of zero, there would be no algebra, no calculus, no computers."
        >
          <InsightGrid items={INDIAN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Islamic Golden Age ────────────────────────────────────────── */}
        <SectionWrapper
          id="islamic"
          icon="🌙"
          title="Islamic Golden Age Mathematics (750–1200 CE)"
          accentColor={EMERALD}
          intro="The Islamic world didn't merely preserve Greek and Indian mathematics — it transformed and extended them. Working in the great centers of learning in Baghdad, Cairo, Córdoba, and Samarkand, Islamic scholars created algebra as a discipline, refined trigonometry, transmitted the Indian numeral system westward, and solved problems that had stumped the ancients. The words 'algebra' and 'algorithm' are Arabic — a permanent reminder of where these ideas were born."
        >
          <TimelineCard entries={ISLAMIC_TIMELINE} />
        </SectionWrapper>

        {/* ── European Renaissance & Early Modern ──────────────────────── */}
        <SectionWrapper
          id="renaissance"
          icon="📐"
          title="European Renaissance and Early Modern Mathematics (1170–1700)"
          accentColor={INDIGO}
          intro="Europe was a mathematical backwater for most of the Middle Ages — still using Roman numerals while the Islamic world had algebra and Indian numerals. The transformation began when Fibonacci brought Arabic numerals to Italy and accelerated through the Renaissance as algebraic notation, analytic geometry, and finally calculus emerged. The Newton-Leibniz calculus dispute remains one of the most dramatic feuds in intellectual history."
        >
          <TimelineCard entries={RENAISSANCE_TIMELINE} />
        </SectionWrapper>

        {/* ── 18th–19th Century ─────────────────────────────────────────── */}
        <SectionWrapper
          id="modern"
          icon="∞"
          title="The 18th–19th Century Explosion"
          accentColor={PURPLE}
          intro="Mathematics exploded in scope and depth. Euler was the most prolific mathematician who ever lived. Gauss was its prince. Galois, killed at 20, revolutionized algebra from beyond the grave. Riemann posed a hypothesis that remains unsolved after 165 years and whose geometry would underpin Einstein's theory of spacetime. Mathematics transformed from a single discipline into a vast archipelago of interconnected fields."
        >
          <TimelineCard entries={MODERN_TIMELINE} />
        </SectionWrapper>

        {/* ── 20th Century ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="twentieth"
          icon="🧠"
          title="The 20th Century — Foundations, Crisis, and Computers"
          accentColor={CYAN}
          intro="The 20th century began with Hilbert's bold vision that all mathematics could be axiomatized and every question resolved. Then Gödel proved it couldn't. Then Turing showed what could and couldn't be computed — and in doing so, invented the theoretical foundations of every computer on Earth. Mathematics confronted its own limits and, in the process, created the technologies that define our world."
        >
          <InsightGrid items={TWENTIETH_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ───────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures in the History of Mathematics"
          accentColor={GOLD}
          intro="From Euclid's axioms to Turing's machines, these are the mathematicians whose ideas built the universal language. Their work transcends time, culture, and politics — a theorem proven is proven forever."
        >
          <FigureGrid figures={KEY_FIGURES} />
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
            "Mathematics is the queen of the sciences and number theory is the
            queen of mathematics."
            — Carl Friedrich Gauss
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
