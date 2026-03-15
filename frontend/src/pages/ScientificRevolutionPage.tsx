/**
 * ScientificRevolutionPage — comprehensive deep-dive on the Scientific Revolution (1543–1687).
 *
 * Route: /scientific-revolution
 *
 * Sections:
 *  1. Hero — headline, overview of the 150-year transformation
 *  2. What Came Before — medieval worldview, Aristotle, Ptolemy, Church control
 *  3. Copernicus — heliocentric model, De Revolutionibus
 *  4. Tycho Brahe — precision observations, eccentric life
 *  5. Johannes Kepler — elliptical orbits, three laws
 *  6. Galileo Galilei — telescope discoveries, Inquisition trial
 *  7. Giordano Bruno — infinite universe, burned at the stake
 *  8. Francis Bacon — empiricism, the scientific method
 *  9. René Descartes — Cartesian coordinates, mechanistic universe
 * 10. Isaac Newton — Principia, calculus, universal gravitation
 * 11. The Institutional Revolution — Royal Society, journals, peer review
 * 12. Impact — legacy for all modern science and engineering
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const BLUE = '#3b82f6';
const INDIGO = '#6366f1';
const TEAL = '#14b8a6';
const GREEN = '#22c55e';
const PURPLE = '#a855f7';
const ROSE = '#f43f5e';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const COPPER = '#c2753a';
const CELESTIAL = '#7dd3fc';
const DEEP_RED = '#991b1b';

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

// ── What Came Before: The Medieval Worldview ────────────────────────────────

const MEDIEVAL_INSIGHTS: InsightEntry[] = [
  {
    label: "Aristotle's Physics — Wrong but Authoritative",
    detail:
      "For nearly two thousand years, European knowledge rested on the authority of Aristotle. His physics taught that heavier objects fall faster than lighter ones, that the Earth sat motionless at the center of the universe, and that celestial bodies moved in perfect circles embedded in crystal spheres. None of this was true — but questioning Aristotle meant questioning the entire intellectual edifice of medieval learning. Universities taught Aristotle's works as settled truth. Disagreement was not merely wrong; it was heresy.",
  },
  {
    label: 'The Church as Gatekeeper of Knowledge',
    detail:
      "The Catholic Church controlled education, literacy, and intellectual life across Europe. Monasteries were the only libraries, clerics the only scholars. The Inquisition policed ideas: books deemed dangerous were placed on the Index Librorum Prohibitorum (Index of Forbidden Books), and their authors risked imprisonment, torture, or death. Knowledge existed to serve theology. The purpose of studying nature was to understand God's creation — not to challenge it. Any discovery that contradicted Church doctrine was, by definition, wrong.",
  },
  {
    label: 'The Ptolemaic Model — Beautifully Wrong',
    detail:
      "Claudius Ptolemy's 2nd-century model placed Earth at the center of the universe. To account for the observed retrograde motion of planets (they appear to occasionally move backward), Ptolemy invented epicycles — small circles riding on larger circles. By adding enough epicycles, the model could actually predict planetary positions with reasonable accuracy. It worked for navigation and calendar-making, which made it useful — and useful things are hard to replace. The model survived for 1,400 years not because it was right, but because it was good enough.",
  },
  {
    label: 'Scholasticism — Reasoning Without Observing',
    detail:
      "Medieval scholars practiced scholasticism: resolving questions by analyzing ancient texts, not by observing nature. A debate about how many teeth a horse has would be settled by consulting Aristotle, not by opening a horse's mouth. Knowledge was derived from authority, logic was applied to premises assumed to be true, and the senses were considered unreliable. This method could produce impressive philosophical arguments — but it could not discover that the Earth orbits the Sun, because it never thought to look.",
  },
];

// ── Copernicus ──────────────────────────────────────────────────────────────

const COPERNICUS_INSIGHTS: InsightEntry[] = [
  {
    label: 'De Revolutionibus Orbium Coelestium (1543)',
    detail:
      "Copernicus's masterwork proposed what seemed like madness: the Sun, not the Earth, sat at the center of the solar system, and the Earth was just another planet orbiting it. Published in the year of his death — some say the first printed copy was placed in his hands as he lay dying — the book was technical, mathematical, and initially attracted little controversy. The Church didn't ban it until 1616, seventy-three years later, when Galileo made heliocentrism impossible to ignore.",
  },
  {
    label: '36 Years of Silence',
    detail:
      "Copernicus first conceived the heliocentric idea around 1507 but did not publish for 36 years. He circulated a brief summary (the Commentariolus) to a few trusted colleagues, but feared the reaction of the Church and of other scholars. He was a canon of the Catholic Church himself — a cleric proposing that the Church's cosmology was wrong. His friend Georg Joachim Rheticus finally persuaded him to publish. Copernicus's caution was not paranoia: Giordano Bruno, who championed similar ideas, would be burned alive 57 years later.",
  },
  {
    label: 'Right About the Center, Wrong About the Circles',
    detail:
      "Copernicus correctly placed the Sun at the center but retained circular orbits — a holdover from the Greek belief that celestial motion must be 'perfect' (i.e., circular). This meant his model actually wasn't much more accurate than Ptolemy's for predicting planetary positions. It still needed epicycles, just fewer of them. The crucial correction — that orbits are ellipses, not circles — would come from Kepler, using data that Copernicus never had.",
  },
];

// ── Tycho Brahe ─────────────────────────────────────────────────────────────

const BRAHE_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Greatest Pre-Telescope Astronomer',
    detail:
      "Without a telescope (it hadn't been invented yet), Tycho Brahe compiled the most precise astronomical observations in history. Working from his private island observatory Uraniborg, funded by the Danish crown, he measured stellar and planetary positions with an accuracy of about one arcminute — five times better than any previous astronomer. His obsessive precision over 20 years of nightly observations created the dataset that would enable Kepler's revolutionary discoveries.",
  },
  {
    label: 'The Eccentric Nobleman',
    detail:
      "Tycho lost part of his nose in a duel with a fellow student over a mathematical argument and wore a prosthetic made of gold and silver for the rest of his life. He kept a pet elk that reportedly died after drinking too much beer and falling down stairs. He employed a dwarf named Jepp whom he believed had psychic powers. His island observatory Uraniborg was essentially a Renaissance research campus — part palace, part laboratory, part printing press — funded at roughly 1% of Denmark's national budget.",
  },
  {
    label: 'The Compromise Model',
    detail:
      "Despite his revolutionary data, Tycho couldn't fully accept Copernicus. He proposed a hybrid model: the Sun and Moon orbit the Earth, but all other planets orbit the Sun. This preserved Earth's central position while accounting for some observations that didn't fit Ptolemy. It was wrong, but it shows how even the greatest scientists of the era struggled to abandon the geocentric worldview. Sometimes the data outpaces the imagination of the person collecting it.",
  },
];

// ── Kepler ───────────────────────────────────────────────────────────────────

const KEPLER_TIMELINE: TimelineEntry[] = [
  {
    year: '1600',
    title: "Inheriting Brahe's Data",
    description:
      "Kepler became Brahe's assistant in Prague — a fraught collaboration between the meticulous observer and the brilliant theorist. Brahe jealously guarded his data, parceling it out in small amounts. When Brahe died suddenly in 1601 (possibly from a burst bladder at a banquet where etiquette forbade him from leaving the table), Kepler secured the complete dataset. He later wrote that Brahe's data was 'a treasure chest' that unlocked the laws of planetary motion.",
    color: AMBER,
  },
  {
    year: '1609',
    title: 'First Two Laws — Ellipses and Equal Areas',
    description:
      "In Astronomia Nova, Kepler published his first two laws: (1) planets orbit the Sun in ellipses, not circles, with the Sun at one focus — destroying 2,000 years of circular orbit dogma; (2) a line from the Sun to a planet sweeps equal areas in equal times, meaning planets move faster when closer to the Sun. These laws emerged from years of painstaking calculation on Mars's orbit, trying and discarding dozens of models until the data forced him to abandon circles.",
    color: GOLD,
  },
  {
    year: '1619',
    title: 'Third Law — The Harmonic Law',
    description:
      "Kepler's third law related a planet's orbital period to its distance from the Sun: the square of the period is proportional to the cube of the semi-major axis (T² ∝ a³). This mathematical relationship, published in Harmonices Mundi, unified the solar system into a single elegant formula. Kepler, deeply religious and mystical, believed he had uncovered the mathematical harmonies God used to design the cosmos. Newton would later derive this law from his theory of gravity.",
    color: TEAL,
  },
  {
    year: 'Legacy',
    title: 'Still Used for Satellite Launches Today',
    description:
      "Kepler's three laws of planetary motion are not historical curiosities — they are operational equations used by NASA, ESA, and every space agency on Earth for orbital mechanics. Every satellite launch, every Mars trajectory, every space station rendezvous uses mathematics that Kepler derived from Brahe's naked-eye observations four centuries ago. The Kepler space telescope, which discovered over 2,600 exoplanets, was named in his honor.",
    color: CELESTIAL,
  },
];

// ── Galileo ─────────────────────────────────────────────────────────────────

const GALILEO_TIMELINE: TimelineEntry[] = [
  {
    year: '1609–1610',
    title: 'The Telescope Revolution',
    description:
      "Galileo did not invent the telescope (that was Dutch optician Hans Lippershey), but he improved it from 3x to 20x magnification and — crucially — pointed it at the sky. In a few months of observation, he shattered the medieval cosmos: he saw mountains and craters on the Moon (it wasn't a perfect sphere), discovered four moons orbiting Jupiter (not everything orbited Earth), observed the phases of Venus (proving it orbited the Sun), and saw sunspots (the Sun wasn't perfect either). He published these findings in Sidereus Nuncius (Starry Messenger), which became an immediate sensation.",
    color: CELESTIAL,
  },
  {
    year: '1610–1616',
    title: 'Phases of Venus — The Fatal Evidence',
    description:
      "The phases of Venus were the smoking gun. In the Ptolemaic (Earth-centered) model, Venus could only show crescent phases. But Galileo observed Venus going through a full set of phases — crescent, half, gibbous, full — just like the Moon. This was only possible if Venus orbited the Sun, not the Earth. It didn't prove Copernicus's full model, but it definitively killed Ptolemy's. The Church's cosmology was demonstrably wrong, and now anyone with a telescope could see it.",
    color: GOLD,
  },
  {
    year: '1632',
    title: 'Dialogue Concerning the Two Chief World Systems',
    description:
      "Galileo published his masterpiece as a dialogue between three characters: Salviati (the Copernican, clearly Galileo's voice), Sagredo (the intelligent layman), and Simplicio (the Aristotelian — whose name means 'simpleton' in Italian). Pope Urban VIII, who had given Galileo permission to write the book as long as it presented heliocentrism as hypothesis rather than fact, was furious: his own arguments had been placed in Simplicio's mouth. The Pope felt personally mocked. Galileo had made a powerful enemy.",
    color: AMBER,
  },
  {
    year: '1633',
    title: 'The Inquisition Trial',
    description:
      'Galileo was summoned before the Roman Inquisition, tried for "vehement suspicion of heresy," and forced to recant his belief that the Earth moves around the Sun. Kneeling before the tribunal, the 69-year-old scientist read a prepared statement denying heliocentrism. Legend says he muttered "Eppur si muove" ("And yet it moves") as he rose — almost certainly apocryphal, but symbolically perfect. He was sentenced to house arrest for life, his Dialogue banned. He remained under house arrest until his death in 1642, continuing to work on mechanics.',
    color: CRIMSON,
  },
  {
    year: 'Also',
    title: 'Father of Modern Kinematics',
    description:
      "Beyond astronomy, Galileo laid the foundations of mechanics. His rolling-ball experiments on inclined planes established that falling bodies accelerate uniformly regardless of mass (contra Aristotle). He described projectile motion as a parabola — the combination of horizontal uniform motion and vertical acceleration. He formulated the principle of inertia (objects in motion tend to stay in motion). These insights, developed during his years of house arrest, were published in Two New Sciences (1638) and directly influenced Newton's laws of motion.",
    color: TEAL,
  },
];

// ── Giordano Bruno ──────────────────────────────────────────────────────────

const BRUNO_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Infinite Universe',
    detail:
      "Bruno went far beyond Copernicus. He proposed that the universe was infinite, that the stars were distant suns with their own planets, that those planets might harbor life, and that there was no center to the universe at all. These ideas — remarkably prescient by modern standards — were not based on observation or mathematics but on philosophical reasoning. Bruno was a visionary, not a scientist in the modern sense, but his vision was closer to the truth than anything his contemporaries imagined.",
  },
  {
    label: 'Burned at the Stake — February 17, 1600',
    detail:
      "After years of wandering Europe, Bruno was lured to Venice, arrested by the Inquisition, and imprisoned for eight years. He refused to recant. On February 17, 1600, he was burned alive at the Campo de' Fiori in Rome, his tongue clamped in a metal gag to prevent him from speaking. His execution was not solely for his cosmological views — he was charged with multiple heresies including denying the Trinity and the divinity of Christ — but his infinite universe was part of the case. A statue of Bruno now stands at the site of his execution.",
  },
  {
    label: "The Contrast with Galileo",
    detail:
      "Bruno burned; Galileo recanted and survived under house arrest. The difference illustrates the Church's priorities: Bruno challenged theology directly (multiple heresies beyond astronomy), while Galileo's challenge was more narrowly scientific. Bruno refused any compromise; Galileo, pragmatically, submitted. Both suffered for challenging the established order, but Bruno's fate shows what happened when the Church perceived a total threat to its authority. Galileo learned from Bruno's example — survival meant knowing when to bend.",
  },
];

// ── Francis Bacon ───────────────────────────────────────────────────────────

const BACON_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Novum Organum (1620) — A New Way of Knowing',
    detail:
      'Bacon\'s title was a deliberate challenge to Aristotle\'s Organon (the ancient "instrument" of logical reasoning). Bacon proposed replacing deductive logic with inductive reasoning: instead of starting from assumed truths and reasoning downward, start from observations and reason upward. Observe nature, conduct experiments, collect data, look for patterns, form hypotheses, test them. This seems obvious now — but in 1620, it was revolutionary. Bacon essentially wrote the user manual for the scientific method.',
  },
  {
    label: 'The Four Idols — Enemies of Clear Thinking',
    detail:
      "Bacon identified four categories of cognitive error that prevent humans from understanding nature: Idols of the Tribe (biases inherent in human nature — we see patterns that aren't there), Idols of the Cave (individual prejudices from education and experience), Idols of the Marketplace (confusion caused by imprecise language), and Idols of the Theatre (blind allegiance to philosophical systems and authorities). This was, in essence, the first systematic analysis of cognitive bias — 400 years before behavioral psychology.",
  },
  {
    label: '"Instead of Philosophy Founded on Aristotle..."',
    detail:
      'Bacon wrote: "Instead of philosophy founded on Aristotle, found it on observations and experiments." He argued that knowledge should serve practical human purposes — reducing suffering, improving life, extending human capability. This utilitarian vision of science as a tool for human betterment, rather than a contemplative exercise, was profoundly influential. It shaped the Royal Society\'s founding mission and remains the dominant justification for scientific research funding today.',
  },
];

// ── Descartes ───────────────────────────────────────────────────────────────

const DESCARTES_INSIGHTS: InsightEntry[] = [
  {
    label: 'Cartesian Coordinates — His Name on Every Graph',
    detail:
      "Descartes unified algebra and geometry by inventing the coordinate system that bears his name. By placing two perpendicular number lines (x and y axes) on a plane, he showed that geometric shapes could be described by algebraic equations — and algebraic equations could be visualized as geometric shapes. This fusion of algebra and geometry (analytic geometry) was essential to Newton's calculus and remains fundamental to virtually all of mathematics, physics, and engineering. Every graph you've ever seen uses Descartes's invention.",
  },
  {
    label: '"Cogito, Ergo Sum" — I Think, Therefore I Am',
    detail:
      "In his Meditations on First Philosophy (1641), Descartes attempted to doubt everything — the existence of the physical world, the reliability of his senses, even mathematics. He found one thing he could not doubt: the fact that he was doubting. If he was thinking, he must exist. From this single certainty, he rebuilt a philosophical foundation for knowledge based on reason rather than authority. This radical skepticism — demanding proof for everything, taking nothing on faith — became the philosophical attitude that made science possible.",
  },
  {
    label: 'The Mechanistic Universe',
    detail:
      "Descartes proposed that the physical universe operates like a vast machine — all natural phenomena can be explained by matter in motion, governed by mathematical laws. Animals were automata, the human body a machine (with a soul connected at the pineal gland). God designed and set the clockwork in motion, but the mechanism ran on its own according to discoverable rules. This mechanistic philosophy stripped nature of mysticism and made it available for scientific investigation. It was incomplete and sometimes wrong, but it was the conceptual framework Newton needed.",
  },
];

// ── Isaac Newton ────────────────────────────────────────────────────────────

const NEWTON_TIMELINE: TimelineEntry[] = [
  {
    year: '1665–1666',
    title: 'The Annus Mirabilis — The Plague Year of Genius',
    description:
      "When plague closed Cambridge University, the 23-year-old Newton retreated to his family's farm in Woolsthorpe. In roughly 18 months of isolation, he invented calculus (the mathematics of change), discovered that white light is a spectrum of colors (using a prism), began formulating the theory of universal gravitation, and laid groundwork for his laws of motion. It is arguably the most productive period in the history of human thought. He told almost no one for years.",
    color: GOLD,
  },
  {
    year: '1687',
    title: 'Principia Mathematica — The Most Important Book in Science',
    description:
      'Philosophiæ Naturalis Principia Mathematica unified terrestrial and celestial mechanics into a single mathematical framework. Newton\'s three laws of motion (inertia, F=ma, action-reaction) and his law of universal gravitation (every mass attracts every other mass with force proportional to both masses and inversely proportional to distance squared) explained everything from falling apples to planetary orbits. He mathematically derived Kepler\'s three laws from first principles. Edmund Halley, who funded the publication, later used Newton\'s equations to predict the return of "his" comet.',
    color: CELESTIAL,
  },
  {
    year: 'Calculus',
    title: 'The Mathematics of Change',
    description:
      "Newton invented calculus — simultaneously with Leibniz, sparking a bitter priority dispute — to handle rates of change and accumulation. Differential calculus describes how things change (velocity, acceleration, slopes of curves); integral calculus describes accumulation (areas, volumes, total distance). Without calculus, modern physics, engineering, economics, and nearly every quantitative field would be impossible. It was the mathematical language the universe had been waiting for — the tool that turned Newton's physical intuitions into precise, provable statements.",
    color: INDIGO,
  },
  {
    year: 'Optics',
    title: 'White Light Is Every Color',
    description:
      "Using prisms, Newton demonstrated that white light is not pure — it is a mixture of all colors of the spectrum. He proved this with his 'crucial experiment': splitting white light into a spectrum with one prism, then recombining it into white light with a second. He also built the first reflecting telescope (Newtonian telescope), solving the chromatic aberration problem of refracting telescopes. His work on optics, published in 1704, founded the modern study of light and color.",
    color: ROSE,
  },
  {
    year: 'The Man',
    title: 'Genius, Recluse, Alchemist, Theologian',
    description:
      'Newton was brilliant, obsessive, vindictive, and deeply strange. He spent more time on alchemy and Biblical prophecy than on physics. He conducted vicious feuds with Hooke, Leibniz, and Flamsteed. He served as Warden of the Royal Mint, personally pursuing counterfeiters. He was likely celibate his entire life. His famous quote — "If I have seen further, it is by standing on the shoulders of giants" — was actually a veiled insult to the short Robert Hooke, with whom he was feuding. He may have had the most powerful mind in human history, and he used it for alchemy.',
    color: PURPLE,
  },
];

// ── The Institutional Revolution ────────────────────────────────────────────

const INSTITUTIONAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Royal Society (1660, London)',
    detail:
      'Founded in 1660, the Royal Society of London became the first major scientific institution. Its motto — "Nullius in verba" (Take nobody\'s word for it) — was a direct rejection of the Aristotelian tradition of arguing from authority. Members included Newton, Hooke, Boyle, Wren, and Halley. The Society published Philosophical Transactions, one of the world\'s first scientific journals, creating a system for sharing discoveries that replaced the secretive, letter-based communication of individual scholars.',
  },
  {
    label: 'Académie des Sciences (1666, Paris)',
    detail:
      "Founded by Louis XIV's minister Colbert, the French Académie was the first state-funded scientific institution — scientists received salaries from the crown. It organized collaborative research projects, including geodetic expeditions to measure the shape of the Earth. The contrast with the Royal Society (privately funded, loosely organized) established two models for scientific institutions — state-directed vs. independent — that persist to this day.",
  },
  {
    label: 'Scientific Journals and Peer Review',
    detail:
      "Before journals, scientists communicated through private letters, which meant discoveries were shared slowly, inconsistently, and without verification. The emergence of scientific journals in the 1660s — Philosophical Transactions in London, Journal des sçavans in Paris — created public, permanent records of discovery. The concept of peer review (having other experts evaluate claims before publication) emerged gradually from this system. Priority disputes (who discovered what first) drove the demand for published, dated records.",
  },
  {
    label: 'Science Separates from Theology',
    detail:
      "Perhaps the most profound institutional change: by the late 1600s, natural philosophy (science) had established itself as a distinct activity from theology. Scientists still believed in God — Newton was deeply religious — but the practice of investigating nature through observation, experiment, and mathematics was no longer subordinate to Biblical interpretation. The universe had its own rules, discoverable by human reason. This separation, hard-won through the trials of Galileo and the burning of Bruno, was the Scientific Revolution's most lasting institutional legacy.",
  },
];

// ── Impact ──────────────────────────────────────────────────────────────────

const IMPACT_INSIGHTS: InsightEntry[] = [
  {
    label: 'Newton → Industrial Revolution',
    detail:
      "Newton's mechanics provided the theoretical foundation for engineering. Understanding force, motion, and energy mathematically meant you could design machines, calculate stresses, predict trajectories, and build structures with confidence. The steam engine, the railroad, the factory — the entire Industrial Revolution — rested on Newtonian physics. Without the Principia, there is no James Watt, no locomotive, no industrial age.",
  },
  {
    label: 'Calculus → Modern Everything',
    detail:
      "Newton and Leibniz's calculus became the mathematical language of physics, engineering, economics, and every quantitative science. Maxwell's equations (electromagnetism), Einstein's general relativity, quantum mechanics, fluid dynamics, thermodynamics, signal processing, machine learning — all are written in the language of calculus. It is arguably the single most consequential mathematical invention in history.",
  },
  {
    label: 'The Empirical Method → All Modern Science',
    detail:
      "The Scientific Revolution's greatest legacy isn't any single discovery — it's the method. Observe nature, form hypotheses, test them with experiments, revise based on evidence, publish results for others to verify or refute. This cycle of conjecture and refutation, formalized by Bacon and practiced by Galileo and Newton, is the engine that drives all modern science. Every vaccine, every semiconductor, every space mission is a product of the method these 150 years created.",
  },
  {
    label: 'A New Way of Being Human',
    detail:
      "Before the Scientific Revolution, the fundamental human attitude toward nature was passive acceptance: the world was as God made it, and the best humans could do was contemplate divine wisdom. After Newton, humans understood themselves as agents capable of discovering nature's laws and using them to reshape the world. This shift in self-understanding — from subjects of a mysterious cosmos to investigators of a comprehensible one — is the deepest legacy of the Scientific Revolution, and it changed everything.",
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Nicolaus Copernicus',
    years: '1473–1543',
    contribution:
      'Polish-Prussian polymath who placed the Sun at the center of the solar system. A canon of the Catholic Church, he feared the reaction to his theory and delayed publication for 36 years. De Revolutionibus was published as he lay dying. His heliocentric model was the spark that ignited the entire Scientific Revolution.',
  },
  {
    name: 'Tycho Brahe',
    years: '1546–1601',
    contribution:
      'Danish nobleman whose obsessively precise astronomical observations — compiled over 20 years without a telescope — provided the data that enabled Kepler\'s laws. Eccentric, brilliant, and jealous of his data, he unwittingly armed the mathematical revolution he never fully embraced.',
  },
  {
    name: 'Johannes Kepler',
    years: '1571–1630',
    contribution:
      "German mathematician who discovered that planets move in ellipses, not circles — correcting Copernicus's last major error. His three laws of planetary motion, derived from Brahe's data, are still used for orbital mechanics today. Deeply religious, he believed mathematics was God's language.",
  },
  {
    name: 'Galileo Galilei',
    years: '1564–1642',
    contribution:
      "Italian polymath who turned the telescope on the sky and destroyed the medieval cosmos. His discoveries — Jupiter's moons, Venus's phases, lunar craters, sunspots — provided the observational evidence for Copernicanism. Tried by the Inquisition and confined to house arrest for life. Also founded modern kinematics through his experiments on motion.",
  },
  {
    name: 'Giordano Bruno',
    years: '1548–1600',
    contribution:
      'Italian friar and philosopher who proposed an infinite universe with countless worlds — ideas far ahead of his time. Burned at the stake by the Inquisition for multiple heresies. The most extreme example of the price paid for challenging the Church\'s intellectual authority.',
  },
  {
    name: 'Francis Bacon',
    years: '1561–1626',
    contribution:
      "English philosopher who codified the scientific method: observe, hypothesize, experiment, conclude. His Novum Organum rejected Aristotelian authority in favor of empirical investigation. His vision of science as a tool for human betterment shaped the Royal Society and remains the dominant philosophy of research.",
  },
  {
    name: 'René Descartes',
    years: '1596–1650',
    contribution:
      "French philosopher and mathematician who invented analytic geometry (Cartesian coordinates), proposed the mechanistic universe, and established radical doubt as a philosophical method. His 'I think, therefore I am' grounded certainty in reason rather than authority. Every graph uses his coordinate system.",
  },
  {
    name: 'Isaac Newton',
    years: '1643–1727',
    contribution:
      "English physicist and mathematician whose Principia Mathematica unified terrestrial and celestial mechanics. Invented calculus, discovered the spectrum of light, formulated the laws of motion and universal gravitation. Arguably the most influential scientist in history. Also spent decades on alchemy and Biblical prophecy.",
  },
  {
    name: 'Robert Hooke',
    years: '1635–1703',
    contribution:
      "English polymath who discovered Hooke's law (elasticity), coined the word 'cell' in biology, built improved microscopes and telescopes, and contributed to the theory of gravitation. His bitter feud with Newton overshadowed his contributions. Newton allegedly had Hooke's portrait destroyed after his death.",
  },
  {
    name: 'Christiaan Huygens',
    years: '1629–1695',
    contribution:
      "Dutch mathematician and physicist who invented the pendulum clock (the most accurate timekeeper for 300 years), discovered Saturn's rings and its moon Titan, and developed the wave theory of light in opposition to Newton's particle theory. One of the great unsung figures of the Scientific Revolution.",
  },
];

const FIGURE_COLORS = [GOLD, BLUE, AMBER, CRIMSON, DEEP_RED, TEAL, INDIGO, CELESTIAL, COPPER, PURPLE];

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

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function ScientificRevolutionPage() {
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
            &larr; Back to Timeline
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
              background: `linear-gradient(135deg, ${GOLD}, ${CELESTIAL})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Scientific Revolution — When Humans Learned How to Learn (1543–1687)
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
              A 150-year period when the foundations of modern science were
              laid — and the Church fought back. From Copernicus placing the Sun
              at the center of the solar system to Newton unifying the laws of
              heaven and Earth, a handful of thinkers dismantled a worldview that
              had stood for two millennia and replaced it with something that
              actually worked.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              Along the way, one was burned alive, one was imprisoned for life,
              several were excommunicated, and all were told they were wrong by
              every authority that existed. They were right anyway. The
              Scientific Revolution didn't just change what humans knew — it
              changed how humans know. Every vaccine, every satellite, every
              semiconductor traces back to the method these people created.
            </p>
          </motion.div>
        </header>

        {/* ── What Came Before ─────────────────────────────────────────── */}
        <SectionWrapper
          id="medieval"
          icon="📜"
          title="What Came Before — The Medieval Worldview"
          accentColor={COPPER}
          intro="To understand why the Scientific Revolution was revolutionary, you must understand what it overthrew. For nearly two thousand years, European intellectual life rested on three pillars: Aristotle's physics, Ptolemy's astronomy, and the Catholic Church's authority. All three were wrong about the physical world. All three reinforced each other. And all three had to be toppled before modern science could begin."
        >
          <InsightGrid items={MEDIEVAL_INSIGHTS} />
        </SectionWrapper>

        {/* ── Copernicus ───────────────────────────────────────────────── */}
        <SectionWrapper
          id="copernicus"
          icon="☀️"
          title="Nicolaus Copernicus (1473–1543) — The Spark"
          accentColor={GOLD}
          intro="A quiet Polish canon who spent his life in the service of the Church — and whose deathbed publication detonated the intellectual equivalent of an atomic bomb. Copernicus didn't just move the Sun to the center of the solar system; he moved the Earth from its throne and made it a planet. It took a century for the full implications to sink in, but once they did, nothing was ever the same."
        >
          <InsightGrid items={COPERNICUS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Tycho Brahe ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="brahe"
          icon="🔭"
          title="Tycho Brahe (1546–1601) — The Data Collector"
          accentColor={AMBER}
          intro="The most precise astronomical observer before the telescope — an eccentric Danish nobleman with a metal nose, a pet elk, and a private island observatory. Brahe couldn't let go of the geocentric model, but his obsessive, decades-long campaign to measure the heavens with unprecedented accuracy produced the dataset that would unlock the laws of planetary motion. Sometimes the person who gathers the evidence isn't the one who understands what it means."
        >
          <InsightGrid items={BRAHE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Kepler ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="kepler"
          icon="📐"
          title="Johannes Kepler (1571–1630) — The Mathematician"
          accentColor={TEAL}
          intro="A devoutly religious German mathematician who believed he was uncovering God's geometric design for the cosmos — and who, using Brahe's data, discovered that planetary orbits are ellipses, not circles. Kepler's three laws of planetary motion corrected Copernicus's last major error, and they're still used by NASA for every satellite launch. He spent years trying and failing with circular models before the data forced him to accept the truth: the universe doesn't care about our ideas of perfection."
        >
          <TimelineCard entries={KEPLER_TIMELINE} />
        </SectionWrapper>

        {/* ── Galileo ──────────────────────────────────────────────────── */}
        <SectionWrapper
          id="galileo"
          icon="🪐"
          title="Galileo Galilei (1564–1642) — The Observer-Champion"
          accentColor={CELESTIAL}
          intro="The man who pointed a telescope at the sky and shattered the medieval cosmos. Galileo discovered Jupiter's moons, Venus's phases, lunar craters, and sunspots — evidence so devastating to the old worldview that the Church put him on trial and sentenced him to house arrest for life. Science's most famous martyr (he survived, unlike Bruno), he also laid the foundations of modern mechanics through his experiments on motion. He fought the Inquisition and lost. He was right anyway."
        >
          <TimelineCard entries={GALILEO_TIMELINE} />
        </SectionWrapper>

        {/* ── Bruno ────────────────────────────────────────────────────── */}
        <SectionWrapper
          id="bruno"
          icon="🔥"
          title="Giordano Bruno (1548–1600) — The Martyr"
          accentColor={DEEP_RED}
          intro="Bruno went further than anyone: an infinite universe, countless worlds, no center, no special place for Earth or humanity. The Inquisition burned him alive in Rome's Campo de' Fiori in 1600, his tongue clamped in a gag. His execution was not solely for astronomy — he was charged with multiple heresies — but his vision of an infinite cosmos was part of the case. He refused to recant. A statue now stands where he burned."
        >
          <InsightGrid items={BRUNO_INSIGHTS} />
        </SectionWrapper>

        {/* ── Bacon ────────────────────────────────────────────────────── */}
        <SectionWrapper
          id="bacon"
          icon="🧪"
          title="Francis Bacon (1561–1626) — The Philosopher of Science"
          accentColor={GREEN}
          intro='While Galileo was observing and Kepler was calculating, Bacon was asking a more fundamental question: how should we investigate nature at all? His answer — observe, experiment, conclude, and reject all authority that contradicts evidence — became the scientific method. He didn&apos;t discover anything about nature, but he discovered how to discover. His Novum Organum was a declaration of war against two thousand years of arguing from Aristotle instead of looking at the world.'
        >
          <InsightGrid items={BACON_INSIGHTS} />
        </SectionWrapper>

        {/* ── Descartes ────────────────────────────────────────────────── */}
        <SectionWrapper
          id="descartes"
          icon="📊"
          title="René Descartes (1596–1650) — Mathematics as the Key to Nature"
          accentColor={INDIGO}
          intro="The French philosopher who gave us coordinate geometry (every graph you've ever seen), radical philosophical doubt ('I think, therefore I am'), and the vision of nature as a vast machine governed by mathematical laws. Descartes built the conceptual bridge between philosophical reasoning and mathematical physics — the bridge Newton would cross to unify the cosmos."
        >
          <InsightGrid items={DESCARTES_INSIGHTS} />
        </SectionWrapper>

        {/* ── Newton ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="newton"
          icon="🍎"
          title="Isaac Newton (1643–1727) — The Culmination"
          accentColor={CELESTIAL}
          intro='"If I have seen further, it is by standing on the shoulders of giants." Newton unified everything: Kepler&apos;s orbits, Galileo&apos;s mechanics, Descartes&apos;s mathematical physics — all synthesized into a single framework in the Principia Mathematica (1687). He invented calculus, discovered the spectrum of light, and formulated laws of motion and gravity that governed physics for 228 years (until Einstein). He was also deeply religious, spent more time on alchemy than physics, and was by most accounts unpleasant to be around.'
        >
          <TimelineCard entries={NEWTON_TIMELINE} />
        </SectionWrapper>

        {/* ── Institutional Revolution ─────────────────────────────────── */}
        <SectionWrapper
          id="institutions"
          icon="🏛️"
          title="The Institutional Revolution — How Science Became a Profession"
          accentColor={BLUE}
          intro="Individual genius drove the Scientific Revolution, but institutions made it permanent. The founding of scientific societies, the invention of scientific journals, and the emergence of peer review transformed science from isolated brilliance into a self-correcting, cumulative enterprise. By 1700, science had separated from theology, acquired its own institutions, and developed a method for reliably producing knowledge. This infrastructure of discovery is arguably the Revolution's most important legacy."
        >
          <InsightGrid items={INSTITUTIONAL_INSIGHTS} />
        </SectionWrapper>

        {/* ── Impact ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="impact"
          icon="🌍"
          title="Impact — How 150 Years Created the Foundation of All Modern Science"
          accentColor={PURPLE}
          intro="The Scientific Revolution didn't just produce Newton's equations or Kepler's laws — it produced the method by which all subsequent knowledge was generated. Newton's mechanics made the Industrial Revolution possible. Calculus made modern mathematics, physics, and engineering possible. The empirical method made all of modern science possible. Every technology, every medicine, every satellite traces its intellectual ancestry back to this 150-year period."
        >
          <InsightGrid items={IMPACT_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures of the Scientific Revolution"
          accentColor={GOLD}
          intro="The Scientific Revolution was driven by a remarkably small number of people — scattered across Europe, working in different languages, often in danger from the Church, and separated by decades. What connected them was a shared conviction that the universe was comprehensible and that mathematics and observation, not authority and tradition, were the tools to comprehend it."
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
            "If I have seen further, it is by standing on the shoulders of
            giants."
            — Isaac Newton, letter to Robert Hooke, 1675
          </p>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            &larr; Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
