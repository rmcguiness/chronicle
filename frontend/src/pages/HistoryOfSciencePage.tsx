/**
 * HistoryOfSciencePage — comprehensive deep-dive on the history of science
 * from ancient observation to modern physics.
 *
 * Route: /history-of-science
 *
 * Sections:
 *  1. Hero — "How We Learned to Understand the Universe"
 *  2. How Science Works (explainer box)
 *  3. Ancient Science (3000–300 BCE)
 *  4. Hellenistic & Islamic Golden Age (300 BCE–1200 CE)
 *  5. The Scientific Revolution (1543–1700)
 *  6. Enlightenment Science (1700–1800)
 *  7. The 19th Century — Biology, Geology, Thermodynamics
 *  8. The Physics Revolution (1895–1930)
 *  9. Marie Curie Spotlight
 * 10. The 20th Century — Big Science
 * 11. Science Self-Corrects
 * 12. The Frontiers — What We Still Don't Know
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const ASH = '#94a3b8';
const CRIMSON = '#dc2626';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const GOLD = '#f59e0b';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const BLUE = '#3b82f6';
const COSMOS_BLUE = '#1e40af';
const QUANTUM_VIOLET = '#7c3aed';
const ATOM_CYAN = '#06b6d4';
const HELIX_GREEN = '#10b981';
const NEWTON_GOLD = '#eab308';
const ANCIENT_AMBER = '#d97706';
const ENLIGHTENMENT_CREAM = '#fbbf24';
const RELATIVITY_ORANGE = '#f97316';

const FIGURE_COLORS = [COSMOS_BLUE, QUANTUM_VIOLET, ATOM_CYAN, HELIX_GREEN, GOLD, INDIGO, ROSE, PURPLE];

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

// ── Section 1: Ancient Science ──────────────────────────────────────────────

const ANCIENT_SCIENCE: TimelineEntry[] = [
  {
    year: '~3000 BCE',
    title: 'Babylonian Astronomy: Empirical Without Theory',
    description:
      'Babylonian priests tracked planetary movements, predicted eclipses, and created sophisticated mathematical tables — all without any underlying theory of WHY the sky behaved as it did. They recorded observations on clay tablets for centuries, building the most accurate astronomical data in the ancient world. Their approach was pure empiricism: observe, record, predict. It worked remarkably well. The Greeks would later add the "why."',
    color: ANCIENT_AMBER,
  },
  {
    year: '~1600 BCE',
    title: 'Egyptian Medicine: The Edwin Smith Papyrus',
    description:
      'The Edwin Smith Papyrus is the oldest known surgical text — 48 case studies organized from head to toe, each with examination, diagnosis, and treatment. Crucially, it distinguishes between conditions that can be treated, might be treated, and cannot be treated. No invocations of gods. No magic spells. Rational, empirical diagnosis — 3,600 years ago. Egyptian medicine was not entirely free of magic, but this papyrus shows a tradition of clinical observation that rivaled anything until Hippocrates.',
    color: GOLD,
  },
  {
    year: '~585 BCE',
    title: 'Thales: The First Natural Philosopher',
    description:
      'Thales of Miletus proposed that everything is made of water. He was completely wrong — but the METHOD was revolutionary. For the first time in recorded history, someone tried to explain the natural world through natural causes, not gods or myths. "Why does the Nile flood?" The old answer: because the gods will it. Thales\'s answer: because of natural processes. That shift — from supernatural to natural explanation — is the founding moment of science.',
    color: COSMOS_BLUE,
  },
  {
    year: '~540 BCE',
    title: 'Anaximander: Evolution Before Darwin',
    description:
      'Anaximander proposed that life arose from moisture and that humans descended from fish-like creatures — an astonishing proto-evolutionary idea 2,400 years before Darwin. He also proposed that the Earth floats unsupported in space (no turtle, no pillars). Wrong on details, visionary in method: he sought natural explanations for the origin and diversity of life.',
    color: TEAL,
  },
  {
    year: '~440 BCE',
    title: 'Democritus: Atomic Theory',
    description:
      'Democritus proposed that all matter is composed of tiny, indivisible particles he called "atomos" — atoms. Between atoms is void (empty space). Different materials have different-shaped atoms. This was pure philosophical reasoning with no experimental evidence, yet it anticipated modern atomic theory by 2,300 years. Aristotle rejected atomism, and it was largely forgotten until the 17th century. Sometimes the right idea arrives too early.',
    color: ATOM_CYAN,
  },
  {
    year: '~350 BCE',
    title: 'Aristotle: The Systematic Observer',
    description:
      'Aristotle wrote on physics, biology, logic, meteorology, astronomy, and ethics. He classified hundreds of animal species, dissected marine creatures, and established logic as a formal discipline. His natural philosophy dominated Western thought for 1,900 years — which was both his greatest achievement and science\'s greatest obstacle. When Aristotle was wrong (and he often was — heavier objects fall faster, the Earth is at the center), his authority made it heresy to disagree.',
    color: INDIGO,
  },
  {
    year: '~250 BCE',
    title: 'Archimedes: The First Physicist',
    description:
      'Archimedes discovered the law of the lever, the principle of buoyancy ("Eureka!"), and calculated pi to remarkable precision. He developed methods for calculating areas and volumes that anticipated integral calculus by nearly 2,000 years. He was also a practical engineer who designed war machines that held off the Roman siege of Syracuse. When the Romans finally took the city, a soldier killed Archimedes — supposedly while he was working on a geometry problem.',
    color: NEWTON_GOLD,
  },
  {
    year: '~240 BCE',
    title: 'Eratosthenes: Measured the Earth',
    description:
      'Using the angle of shadows at noon in two Egyptian cities and the distance between them, Eratosthenes calculated the Earth\'s circumference at approximately 40,000 km — within 2% of the actual value (40,075 km). With a stick, some geometry, and brilliant reasoning, a single person measured the planet. This remains one of the most elegant experiments in the history of science.',
    color: GREEN,
  },
];

// ── Section 2: Hellenistic & Islamic Golden Age ─────────────────────────────

const HELLENISTIC_ISLAMIC: TimelineEntry[] = [
  {
    year: '~300 BCE',
    title: 'Alexandria: The First Research Institution',
    description:
      'The Library of Alexandria and its associated Museum (from "Museion" — temple of the Muses) constituted the world\'s first dedicated research institution. Scholars were paid salaries to do nothing but think, experiment, and write. At its peak, the Library held an estimated 400,000 scrolls. Euclid wrote his Elements here. Eratosthenes measured the Earth here. Archimedes may have studied here. It was destroyed gradually — not in a single dramatic fire — but its loss represents one of history\'s greatest intellectual tragedies.',
    color: COSMOS_BLUE,
  },
  {
    year: '~150 CE',
    title: 'Ptolemy: The Geocentric Model',
    description:
      'Ptolemy\'s Almagest placed the Earth at the center of the universe, with the Sun, Moon, planets, and stars orbiting around it. It was wrong — but it was brilliantly wrong. Using epicycles (circles upon circles), Ptolemy could predict planetary positions with remarkable accuracy. The model worked well enough for navigation and calendar-making for 1,400 years. It took Copernicus, Kepler, and Galileo to finally displace it — not because it didn\'t work, but because a simpler model worked better.',
    color: INDIGO,
  },
  {
    year: '129–216 CE',
    title: 'Galen: Anatomy from Animal Dissection',
    description:
      'Galen of Pergamon dissected Barbary apes and pigs (human dissection was forbidden in Rome) and extrapolated to human anatomy. He got much of it right — and much of it wrong. But his systematic approach and prolific writing made him THE authority on medicine for 1,300 years. No one seriously challenged Galen until Vesalius opened a human body in 1543 and saw, with his own eyes, that the master had been wrong about dozens of structures.',
    color: CRIMSON,
  },
  {
    year: '750–1250 CE',
    title: 'The Islamic Golden Age: Preservation and Innovation',
    description:
      'While medieval Europe largely lost access to Greek knowledge, Islamic scholars translated, preserved, and extended it. Baghdad\'s House of Wisdom became the intellectual center of the world. Al-Khwarizmi invented algebra (the word comes from his book "al-jabr"). Al-Razi classified chemical substances. Ibn Sina\'s Canon of Medicine was used in European universities until the 1600s. Without the Islamic Golden Age, much of Greek science would have been permanently lost.',
    color: GOLD,
  },
  {
    year: '965–1040 CE',
    title: 'Ibn al-Haytham: The First True Scientist',
    description:
      'Ibn al-Haytham (Alhazen) wrote the Book of Optics, which made two revolutionary contributions. First, he proved that light enters the eye rather than being emitted by it — overturning a Greek theory that had persisted for 1,000 years. Second, and more importantly, he insisted on experimental verification of hypotheses — the experimental method, 600 years before Galileo. He used darkened rooms (camera obscura), controlled variables, and systematic testing. Some historians consider him the true father of the scientific method.',
    color: ANCIENT_AMBER,
  },
];

// ── Section 3: Scientific Revolution ────────────────────────────────────────

const SCIENTIFIC_REVOLUTION: TimelineEntry[] = [
  {
    year: '1543',
    title: 'The Year Everything Changed — Twice',
    description:
      'In 1543, Copernicus published De revolutionibus (the Sun, not the Earth, is at the center) and Vesalius published De humani corporis fabrica (human anatomy based on direct observation, correcting Galen). Two books, one year — and the authority of the ancients crumbled. The key shift was philosophical: observation and experiment replace tradition and logic as the path to truth.',
    color: COSMOS_BLUE,
  },
  {
    year: '1609–1632',
    title: 'Galileo: The Telescope and the Trial',
    description:
      'Galileo turned a telescope to the sky and saw mountains on the Moon, moons orbiting Jupiter, and phases of Venus — all impossible under Ptolemy\'s geocentric model. His experiments on falling bodies (objects of different mass fall at the same rate) and inclined planes established the principle of inertia. The Church condemned him in 1633, forcing him to recant. He reportedly muttered "Eppur si muove" (And yet it moves). The conflict between science and authority had its first modern martyr.',
    color: QUANTUM_VIOLET,
  },
  {
    year: '1687',
    title: 'Newton: The Laws of Everything',
    description:
      'Newton\'s Principia Mathematica unified terrestrial and celestial mechanics in three laws of motion and the law of universal gravitation. The same force that makes an apple fall holds the Moon in orbit. He also co-invented calculus (the other inventor, Leibniz, developed it independently). Newton didn\'t just explain the universe — he showed that it could be explained, that nature follows mathematical laws discoverable by human reason. It was the most consequential scientific work ever published.',
    color: NEWTON_GOLD,
  },
];

// ── Section 4: Enlightenment Science ────────────────────────────────────────

const ENLIGHTENMENT_SCIENCE: InsightEntry[] = [
  {
    label: 'Scientific Societies: Institutionalizing Discovery',
    detail:
      'The Royal Society (London, 1660) and the French Academy of Sciences (Paris, 1666) transformed science from a hobby of wealthy gentlemen into an institutional enterprise. They published journals, reviewed papers, funded experiments, and created a community of practice. The motto of the Royal Society — "Nullius in verba" (Take nobody\'s word for it) — captured the Enlightenment spirit: test everything, accept nothing on authority alone.',
  },
  {
    label: 'Linnaeus: Naming Every Living Thing (1735)',
    detail:
      'Carl Linnaeus created the binomial nomenclature system — genus + species — that we still use today. Homo sapiens. Canis lupus. Every organism classified in a hierarchy: kingdom, phylum, class, order, family, genus, species. It was the first comprehensive attempt to organize the diversity of life. Linnaeus classified over 12,000 species personally. His system imposed order on nature\'s chaos and made biology a cumulative science.',
  },
  {
    label: 'The Chemistry Revolution: Lavoisier Kills Phlogiston (1778)',
    detail:
      'For a century, chemists believed burning released an invisible substance called "phlogiston." Antoine Lavoisier demonstrated that burning actually combines a substance with oxygen — a gas he identified and named. He established the law of conservation of mass (matter is neither created nor destroyed) and wrote the first modern chemistry textbook. The phlogiston theory died. Lavoisier was executed during the French Revolution; the judge reportedly said, "The Republic has no need of scientists."',
  },
  {
    label: 'Electricity: From Curiosity to Science',
    detail:
      'Benjamin Franklin proved lightning is electrical (1752). Luigi Galvani discovered that electricity makes dead frog legs twitch (1780s). Alessandro Volta built the first battery (1800). These were still parlor tricks and curiosities — but they were laying the groundwork for electromagnetism, electronics, and eventually the entire modern world. The 18th century asked "what is electricity?" The 19th would ask "what can we do with it?"',
  },
  {
    label: 'The Enlightenment Belief',
    detail:
      'The Enlightenment\'s core conviction was that reason and science could improve human society — not just explain nature, but transform civilization. This was genuinely new. The ancients studied nature out of curiosity. The Enlightenment studied nature to build a better world. This belief — that science leads to progress — became the operating philosophy of the modern West. Whether it was always justified is another question.',
  },
];

// ── Section 5: The 19th Century ─────────────────────────────────────────────

const NINETEENTH_CENTURY: TimelineEntry[] = [
  {
    year: '1830s',
    title: 'Geology Revolution: Deep Time',
    description:
      'James Hutton and Charles Lyell established that the Earth is unimaginably old — shaped by the same gradual processes (erosion, sedimentation, volcanism) we observe today, operating over billions of years. This "uniformitarianism" demolished the biblical timeline of 6,000 years and gave Darwin the deep time he needed for evolution to work. Before you can explain the diversity of life, you need enough time for it to evolve.',
    color: ANCIENT_AMBER,
  },
  {
    year: '1858–1859',
    title: 'Darwin & Wallace: Natural Selection',
    description:
      'Charles Darwin and Alfred Russel Wallace independently conceived natural selection — organisms vary, resources are limited, those best adapted to their environment survive and reproduce, passing on their traits. Darwin\'s On the Origin of Species (1859) is arguably the most consequential book in the history of biology. It explained the diversity of life without invoking design, connected all living things through common descent, and remains the foundation of modern biology. Wallace, who independently reached the same conclusion, is one of history\'s most under-credited scientists.',
    color: HELIX_GREEN,
  },
  {
    year: '1866',
    title: 'Mendel: The Laws of Heredity (Ignored for 34 Years)',
    description:
      'Gregor Mendel, an Augustinian friar, crossed pea plants for eight years and discovered the mathematical laws of heredity — dominant and recessive traits, the 3:1 ratio, independent assortment. His paper was published in 1866, and almost nobody read it. It was rediscovered in 1900, and suddenly genetics had its founding document. Mendel\'s work shows that great science can be invisible in its own time.',
    color: PURPLE,
  },
  {
    year: '1860s–1880s',
    title: 'Germ Theory: Pasteur and Koch',
    description:
      'Louis Pasteur and Robert Koch proved that diseases are caused by microorganisms — not bad air ("miasma"), divine punishment, or imbalanced humors. Pasteur developed pasteurization and vaccines for anthrax and rabies. Koch identified the specific bacteria causing tuberculosis, cholera, and anthrax. Germ theory is arguably the single most life-saving idea in human history — it led to antiseptic surgery, antibiotics, sanitation, and vaccines that have saved billions of lives.',
    color: CRIMSON,
  },
  {
    year: '1850s–1870s',
    title: 'Thermodynamics: The Laws of Energy',
    description:
      'Sadi Carnot, James Joule, and Lord Kelvin established the laws of thermodynamics: energy is conserved (First Law), entropy always increases (Second Law), and absolute zero is unreachable (Third Law). These laws govern everything from steam engines to black holes. The Second Law — that disorder always increases — may be the most universal law in all of physics, and it gives time its direction.',
    color: RELATIVITY_ORANGE,
  },
  {
    year: '1865',
    title: "Maxwell's Equations: The Great Unification",
    description:
      'James Clerk Maxwell unified electricity, magnetism, and light into four elegant equations. Light, he showed, is an electromagnetic wave. This was one of the greatest unifications in the history of science — three apparently separate phenomena revealed as one. Maxwell\'s equations predicted radio waves (confirmed by Hertz in 1887), led to radio, television, radar, and wireless communication, and directly inspired Einstein\'s special relativity.',
    color: ATOM_CYAN,
  },
];

// ── Section 6: The Physics Revolution (1895–1930) ───────────────────────────

const PHYSICS_REVOLUTION: TimelineEntry[] = [
  {
    year: '1895–1898',
    title: 'The Atom Cracks Open',
    description:
      'Wilhelm Röntgen discovered X-rays (1895) — invisible rays that pass through flesh but not bone. Henri Becquerel discovered radioactivity (1896). Marie and Pierre Curie isolated radium and polonium (1898), showing that atoms are not indivisible — they emit particles and energy. In three years, the atom — supposedly the ultimate, unbreakable building block of matter — was revealed to have an interior. Physics would never be the same.',
    color: ATOM_CYAN,
  },
  {
    year: '1900',
    title: 'Planck: Energy Is Quantized',
    description:
      'Max Planck, trying to solve a technical problem in radiation physics (the "ultraviolet catastrophe"), proposed that energy is emitted in discrete packets — quanta — not continuously. He considered it a mathematical trick, not a description of reality. It was both. Planck\'s quantum hypothesis launched a revolution that would overturn the deterministic, clockwork universe of Newton and replace it with a probabilistic one. Planck himself was uncomfortable with what he\'d started.',
    color: QUANTUM_VIOLET,
  },
  {
    year: '1905',
    title: 'Einstein\'s Miracle Year: Three Revolutions',
    description:
      'In a single year, a 26-year-old patent clerk published three papers that transformed physics. The photoelectric effect paper showed light behaves as particles (quanta), establishing quantum theory on firm ground. The Brownian motion paper proved atoms exist (still debated in 1905!). Special relativity revealed that space and time are relative, mass and energy are equivalent (E=mc²), and nothing can exceed the speed of light. Any ONE of these papers would have made a career. Einstein published all three in one year.',
    color: NEWTON_GOLD,
  },
  {
    year: '1915',
    title: 'General Relativity: Gravity Is Curved Spacetime',
    description:
      'Einstein\'s general theory of relativity replaced Newton\'s gravity (a force pulling objects together) with a geometric description: massive objects curve spacetime, and other objects follow that curvature. The Sun doesn\'t "pull" the Earth — it bends the space the Earth moves through. Confirmed by the 1919 solar eclipse (starlight bending around the Sun), general relativity predicts black holes, gravitational waves (detected 2015), the expansion of the universe, and GPS corrections. It remains our best theory of gravity.',
    color: RELATIVITY_ORANGE,
  },
  {
    year: '1913–1927',
    title: 'Quantum Mechanics: Nature Is Probabilistic',
    description:
      'Niels Bohr proposed quantized electron orbits (1913). Louis de Broglie showed particles behave as waves (1924). Werner Heisenberg formulated the uncertainty principle — you cannot simultaneously know a particle\'s exact position and momentum (1927). Erwin Schrödinger wrote the wave equation governing quantum systems (1926). The result: at the subatomic level, nature is fundamentally probabilistic. God, Einstein objected, "does not play dice." Bohr replied: "Stop telling God what to do."',
    color: QUANTUM_VIOLET,
  },
];

// ── Section 7: 20th Century Big Science ─────────────────────────────────────

const BIG_SCIENCE: TimelineEntry[] = [
  {
    year: '1942–1945',
    title: 'The Manhattan Project: Physics Becomes Destruction',
    description:
      'The Manhattan Project turned E=mc² into a weapon. 125,000 people, $2 billion (1945 dollars), and the brightest physicists on Earth produced the atomic bombs dropped on Hiroshima and Nagasaki. Science had always changed the world; now it could end it. Robert Oppenheimer quoted the Bhagavad Gita: "Now I am become Death, the destroyer of worlds." Physics was never again purely academic.',
    color: CRIMSON,
  },
  {
    year: '1953',
    title: 'DNA: The Structure of Heredity',
    description:
      'James Watson, Francis Crick, Rosalind Franklin, and Maurice Wilkins determined the double-helix structure of DNA — the molecule that carries the genetic instructions for all known living organisms. Franklin\'s X-ray crystallography (Photo 51) was crucial but she received no Nobel Prize (she died in 1958; the Prize is not awarded posthumously). The discovery unified genetics and biochemistry and launched molecular biology.',
    color: HELIX_GREEN,
  },
  {
    year: '1940s–1970s',
    title: 'The Green Revolution: Science Feeds the World',
    description:
      'Norman Borlaug\'s high-yield wheat varieties, combined with modern fertilizers and irrigation, transformed agriculture in Mexico, India, and Pakistan. Borlaug\'s work is credited with saving over a billion people from starvation. He won the Nobel Peace Prize in 1970. The Green Revolution showed science at its most directly humanitarian — and also raised questions about environmental sustainability and corporate agriculture.',
    color: GREEN,
  },
  {
    year: '1969',
    title: 'Moon Landing: Applied Newtonian Physics',
    description:
      'Apollo 11 landed humans on the Moon using physics understood since 1687 — Newton\'s laws of motion and gravitation, plus 20th-century engineering. The Saturn V rocket applied Newton\'s third law on an industrial scale. The trajectory calculations used Newton\'s gravitational equations. 282 years after the Principia, its predictions carried humans to another world. The Moon landing was the ultimate confirmation of the scientific method: understand → predict → engineer → achieve.',
    color: COSMOS_BLUE,
  },
  {
    year: '1960s',
    title: 'Plate Tectonics: The Earth Moves',
    description:
      'Alfred Wegener proposed continental drift in 1912 but was ridiculed because he couldn\'t explain the mechanism. In the 1960s, seafloor spreading, magnetic striping, and subduction zones provided the mechanism. The continents ride on tectonic plates driven by convection in the Earth\'s mantle. Plate tectonics unified geology the way evolution unified biology and Maxwell\'s equations unified electromagnetism — a single framework explaining earthquakes, volcanoes, mountain ranges, and the distribution of fossils.',
    color: TEAL,
  },
  {
    year: '1970s–2012',
    title: 'The Standard Model: The Fundamental Particles',
    description:
      'The Standard Model identifies 17 fundamental particles and describes three of the four fundamental forces (electromagnetic, weak nuclear, strong nuclear — but not gravity). It is the most precisely tested theory in physics: its predictions match experiment to 10 decimal places. The Higgs boson — the last missing piece — was confirmed at CERN in 2012. The Standard Model is extraordinarily successful and almost certainly incomplete: it doesn\'t include gravity, dark matter, or dark energy.',
    color: QUANTUM_VIOLET,
  },
];

// ── How Science Works ───────────────────────────────────────────────────────

const HOW_SCIENCE_WORKS: InsightEntry[] = [
  {
    label: 'The Scientific Method',
    detail:
      'Observe a phenomenon. Form a hypothesis (a testable explanation). Design an experiment to test it. Analyze the results. Revise the hypothesis. Repeat. The method is simple; applying it rigorously is not. The key insight is that science is not a body of facts — it is a process for discovering facts and discarding errors.',
  },
  {
    label: 'Peer Review: Imperfect but Self-Correcting',
    detail:
      'Before publication, scientific papers are reviewed by other experts in the field. Peer review catches errors, challenges assumptions, and filters out weak work. It is not perfect — reviewers have biases, important papers get rejected, and fraud sometimes slips through. But over time, the process is self-correcting: bad results are eventually challenged, replicated (or not), and revised.',
  },
  {
    label: 'Paradigm Shifts (Thomas Kuhn)',
    detail:
      'Kuhn argued in The Structure of Scientific Revolutions (1962) that science doesn\'t progress smoothly. Instead: normal science (puzzle-solving within an accepted framework) → anomalies accumulate → crisis → revolution (a new paradigm replaces the old). Ptolemy → Copernicus. Newton → Einstein. The old paradigm doesn\'t just get updated — the entire worldview shifts.',
  },
  {
    label: 'Falsifiability (Karl Popper)',
    detail:
      'A claim is scientific only if it can, in principle, be proven wrong. "All swans are white" is scientific because finding one black swan disproves it. "The universe was created by an undetectable being" is not scientific because no observation could disprove it. Falsifiability is the boundary between science and pseudoscience — not whether something is true, but whether it is testable.',
  },
];

// ── Science Self-Corrects ───────────────────────────────────────────────────

const SELF_CORRECTS: InsightEntry[] = [
  {
    label: 'Phlogiston (1667–1778)',
    detail:
      'For over a century, chemists believed that burning released an invisible substance called phlogiston. Lavoisier\'s oxygen theory demolished it. The important point: science didn\'t cling to phlogiston. When better evidence arrived, the old theory was abandoned. That\'s the system working.',
  },
  {
    label: 'Luminiferous Ether (1800s–1905)',
    detail:
      'Physicists assumed light waves needed a medium to travel through — the "luminiferous ether." The Michelson-Morley experiment (1887) failed to detect it. Einstein\'s special relativity (1905) eliminated the need for it entirely. A beautiful, intuitive idea — destroyed by a single experiment. That\'s science.',
  },
  {
    label: 'Spontaneous Generation (antiquity–1859)',
    detail:
      'For millennia, people believed life arose spontaneously from non-living matter — maggots from rotting meat, mice from grain. Pasteur\'s elegant swan-neck flask experiments (1859) proved that life comes only from existing life. An idea that had persisted for thousands of years, eliminated by a carefully designed experiment.',
  },
  {
    label: 'The Replication Crisis (2010s–present)',
    detail:
      'Many psychology and medical studies cannot be reproduced when repeated by other researchers. A 2015 study found that only 36% of psychology experiments could be replicated. This is science grappling honestly with its own methodology — identifying a problem and working to fix it through better statistical practices, pre-registration, and open data. Even the crisis itself is self-correction in action.',
  },
];

// ── The Frontiers ───────────────────────────────────────────────────────────

const FRONTIERS: InsightEntry[] = [
  {
    label: 'Dark Matter & Dark Energy: 95% Unknown',
    detail:
      'Ordinary matter — atoms, stars, planets, everything we can see — makes up only about 5% of the universe\'s total energy content. Dark matter (~27%) exerts gravitational effects but doesn\'t interact with light. Dark energy (~68%) is driving the accelerating expansion of the universe. We have no idea what either of them actually IS. The universe is mostly made of stuff we cannot explain.',
  },
  {
    label: 'Quantum Gravity: The Biggest Unsolved Problem',
    detail:
      'Einstein\'s general relativity (gravity, large scales) and quantum mechanics (subatomic scales) are both extraordinarily well-tested — and they are mathematically incompatible. At the singularity of a black hole or the first instant of the Big Bang, both theories apply and both break down. Unifying them into a theory of quantum gravity is the greatest unsolved problem in physics. String theory, loop quantum gravity, and other approaches are all attempts — none yet successful.',
  },
  {
    label: 'The Origin of Consciousness',
    detail:
      'How does subjective experience arise from physical matter? Why does it feel like something to see red or taste coffee? Neuroscience can correlate brain activity with conscious experience, but explaining WHY certain neural processes produce subjective awareness — the "hard problem of consciousness" (David Chalmers, 1995) — remains perhaps the hardest problem in all of science.',
  },
  {
    label: 'Climate Science: Knowledge vs. Action',
    detail:
      'The greenhouse effect has been understood since Fourier (1824) and Arrhenius (1896). We have 150+ years of temperature data, ice core records going back 800,000 years, and overwhelming scientific consensus that human activity is driving rapid climate change. The science is settled; the policy response is not. Climate change is the starkest example of a gap between what science knows and what society does about it.',
  },
  {
    label: 'CRISPR: Rewriting the Code of Life',
    detail:
      'CRISPR-Cas9 (2012) allows precise editing of DNA — cutting, inserting, or modifying genes with unprecedented accuracy. It can potentially cure genetic diseases, eliminate malaria-carrying mosquitoes, and create drought-resistant crops. It can also, in principle, be used to edit human embryos — raising questions about designer babies and human enhancement that science can enable but not answer. The ethical frontier is now ahead of the technical one.',
  },
];

// ── Key Figures ──────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Aristotle',
    years: '384–322 BCE',
    contribution:
      'Founder of systematic natural history, formal logic, and empirical biology. His works dominated Western science for nearly two millennia. Both the greatest enabler of ancient science and, through his authority, the greatest obstacle to its progress.',
  },
  {
    name: 'Ibn al-Haytham',
    years: '965–1040 CE',
    contribution:
      'Pioneered the experimental method in his Book of Optics. First to correctly explain vision (light enters the eye). His insistence on experimental verification over philosophical argument anticipated the Scientific Revolution by 600 years.',
  },
  {
    name: 'Galileo Galilei',
    years: '1564–1642',
    contribution:
      'Father of observational astronomy and modern physics. Telescope discoveries confirmed heliocentrism. Experiments on motion established inertia. His conflict with the Church became the defining story of science vs. authority.',
  },
  {
    name: 'Isaac Newton',
    years: '1643–1727',
    contribution:
      'Unified terrestrial and celestial mechanics. Three laws of motion, universal gravitation, co-inventor of calculus, and groundbreaking work on optics. The Principia Mathematica is the most important scientific work ever published.',
  },
  {
    name: 'Charles Darwin',
    years: '1809–1882',
    contribution:
      'Formulated the theory of evolution by natural selection — the unifying principle of all biology. On the Origin of Species (1859) explained the diversity of life through descent with modification, connecting all living things through common ancestry.',
  },
  {
    name: 'Marie Curie',
    years: '1867–1934',
    contribution:
      'First woman to win a Nobel Prize, first person to win Nobel Prizes in two different sciences (Physics 1903, Chemistry 1911). Pioneered research on radioactivity, discovered polonium and radium. Died of aplastic anemia caused by radiation exposure — her notebooks are still radioactive.',
  },
  {
    name: 'Albert Einstein',
    years: '1879–1955',
    contribution:
      'Special relativity, general relativity, photoelectric effect (quantum theory), mass-energy equivalence (E=mc²). Transformed our understanding of space, time, gravity, and energy. His 1905 "miracle year" produced three revolutionary papers — any one would have been a career-defining achievement.',
  },
  {
    name: 'Rosalind Franklin',
    years: '1920–1958',
    contribution:
      'Her X-ray crystallography image (Photo 51) was critical to determining the structure of DNA. Watson and Crick used her data, often without proper acknowledgment. She died at 37 of ovarian cancer, likely caused by radiation exposure, and was excluded from the Nobel Prize.',
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

export default function HistoryOfSciencePage() {
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
              background: `linear-gradient(135deg, ${COSMOS_BLUE}, ${ATOM_CYAN})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            How We Learned to Understand the Universe — The History of Science
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
              Science is humanity's most powerful invention — not a thing, but a
              process. A method for asking questions, testing answers, and
              discarding what doesn't work. In 2,600 years, it has taken us from
              Thales guessing that everything is made of water to detecting
              gravitational waves from colliding black holes a billion
              light-years away. Along the way, it has overturned every authority,
              demolished every certainty, and rebuilt our understanding of
              reality from the ground up — repeatedly.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              This is the story of how we learned to learn — from the first
              person who looked at the world and asked "why?" to the physicists
              who discovered that 95% of the universe is made of something we
              cannot see, touch, or explain.
            </p>
          </motion.div>
        </header>

        {/* ── Key Stats ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12,
            marginBottom: 24,
          }}
        >
          {[
            { stat: '13.8B', label: 'years — age of the universe', color: COSMOS_BLUE },
            { stat: '4.54B', label: 'years — age of the Earth', color: TEAL },
            { stat: '3B', label: 'base pairs in human genome', color: HELIX_GREEN },
            { stat: '299,792,458', label: 'm/s — speed of light (exact)', color: NEWTON_GOLD },
            { stat: '~10⁸⁰', label: 'atoms in observable universe', color: ATOM_CYAN },
            { stat: '5%', label: 'of universe is ordinary matter', color: QUANTUM_VIOLET },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
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
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, marginBottom: 4 }}>
                {s.stat}
              </p>
              <p style={{ color: ASH, fontSize: '0.8rem', lineHeight: 1.4 }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── How Science Works (explainer box) ──────────────────────── */}
        <SectionWrapper
          id="how-science-works"
          icon="🔬"
          title="How Science Actually Works"
          accentColor={ATOM_CYAN}
          intro="Science is not a collection of facts — it is a method for producing reliable knowledge. The method is simple: observe, hypothesize, test, revise. But the institutions, norms, and self-correcting mechanisms that make it work are the product of centuries of refinement."
        >
          <InsightGrid items={HOW_SCIENCE_WORKS} />
        </SectionWrapper>

        {/* ── Section 1: Ancient Science ──────────────────────────────── */}
        <SectionWrapper
          id="ancient-science"
          icon="🏛️"
          title="Ancient Science (3000–300 BCE)"
          accentColor={ANCIENT_AMBER}
          intro="Science began not with answers but with a new kind of question. For millennia, humans explained the world through myths and gods. Then, in Mesopotamia, Egypt, and Greece, people began observing nature systematically, recording patterns, and — most revolutionary of all — seeking natural explanations for natural phenomena. The question 'why does this happen?' replaced 'which god caused this?'"
        >
          <TimelineCard entries={ANCIENT_SCIENCE} />
        </SectionWrapper>

        {/* ── Section 2: Hellenistic & Islamic Golden Age ─────────────── */}
        <SectionWrapper
          id="hellenistic-islamic"
          icon="📚"
          title="The Hellenistic & Islamic Golden Age (300 BCE–1200 CE)"
          accentColor={GOLD}
          intro="After the Greek golden age, the center of scientific gravity shifted — first to Alexandria, then to the Islamic world. While medieval Europe largely lost access to Greek knowledge, Islamic scholars translated, preserved, and extended it. Without the House of Wisdom in Baghdad and scholars like Ibn al-Haytham and al-Khwarizmi, much of ancient science would have been permanently lost."
        >
          <TimelineCard entries={HELLENISTIC_ISLAMIC} />
        </SectionWrapper>

        {/* ── Section 3: Scientific Revolution ────────────────────────── */}
        <SectionWrapper
          id="scientific-revolution"
          icon="🔭"
          title="The Scientific Revolution (1543–1700) — The Transformation"
          accentColor={COSMOS_BLUE}
          intro="In less than 200 years, the entire framework for understanding nature was rebuilt. Observation and experiment replaced authority and logic. Mathematics became the language of nature. The geocentric universe gave way to the heliocentric one. Galen's anatomy was corrected by direct dissection. Newton's laws unified heaven and Earth. Nothing in the history of ideas compares to the speed and scope of this transformation."
        >
          <TimelineCard entries={SCIENTIFIC_REVOLUTION} />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: 'rgba(30, 64, 175, 0.08)',
              border: `1px solid ${COSMOS_BLUE}44`,
              borderRadius: 12,
              padding: 24,
              marginTop: 20,
            }}
          >
            <p
              style={{
                color: ATOM_CYAN,
                fontSize: '1rem',
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              See the{' '}
              <Link to="/scientific-revolution" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
                Scientific Revolution deep-dive
              </Link>{' '}
              for the full story of 1543–1700.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── Section 4: Enlightenment Science ────────────────────────── */}
        <SectionWrapper
          id="enlightenment"
          icon="💡"
          title="Enlightenment Science (1700–1800)"
          accentColor={ENLIGHTENMENT_CREAM}
          intro="The Enlightenment institutionalized science. Scientific societies published journals, governments funded research, and the belief took hold that reason and experiment could not just explain nature but improve human civilization. Chemistry was born as Lavoisier demolished phlogiston. Biology was organized as Linnaeus classified all life. Electricity went from a curiosity to a field of study."
        >
          <InsightGrid items={ENLIGHTENMENT_SCIENCE} />
        </SectionWrapper>

        {/* ── Section 5: 19th Century ─────────────────────────────────── */}
        <SectionWrapper
          id="nineteenth-century"
          icon="⚙️"
          title="The 19th Century — Biology, Geology, Thermodynamics"
          accentColor={HELIX_GREEN}
          intro="The 19th century was the century of unification. Darwin unified biology under natural selection. Maxwell unified electricity, magnetism, and light. Thermodynamics unified energy. Pasteur and Koch unified medicine under germ theory. Geology established deep time. Mendel discovered the laws of heredity. More foundational science was established in this century than any before it."
        >
          <TimelineCard entries={NINETEENTH_CENTURY} />
        </SectionWrapper>

        {/* ── Callout: Maxwell's Equations ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            border: `1px solid ${ATOM_CYAN}44`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <p
            style={{
              color: ATOM_CYAN,
              fontSize: '1.15rem',
              fontWeight: 600,
              fontStyle: 'italic',
              lineHeight: 1.6,
              textAlign: 'center',
            }}
          >
            "One scientific epoch ended and another began with James Clerk
            Maxwell."
          </p>
          <p
            style={{
              color: SLATE,
              fontSize: '0.85rem',
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            — Albert Einstein. Maxwell's four equations unified electricity,
            magnetism, and light — and directly inspired both quantum theory and
            relativity.
          </p>
        </motion.div>

        {/* ── Section 6: Physics Revolution ────────────────────────────── */}
        <SectionWrapper
          id="physics-revolution"
          icon="⚛️"
          title="The Physics Revolution (1895–1930)"
          accentColor={QUANTUM_VIOLET}
          intro="In 35 years, physics was completely rebuilt. X-rays revealed the atom's interior. Planck quantized energy. Einstein rewrote space and time — twice. Quantum mechanics showed that nature is fundamentally probabilistic. More revolutionary ideas per decade than any other period in history. The clockwork universe of Newton was replaced by something stranger, more beautiful, and more accurate."
        >
          <TimelineCard entries={PHYSICS_REVOLUTION} />
        </SectionWrapper>

        {/* ── Marie Curie Spotlight ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: 'rgba(124, 58, 237, 0.08)',
            border: `1px solid ${QUANTUM_VIOLET}44`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <p
            style={{
              color: QUANTUM_VIOLET,
              fontSize: '1.4rem',
              fontWeight: 800,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Marie Curie (1867–1934)
          </p>
          <p
            style={{
              color: ATOM_CYAN,
              fontSize: '1rem',
              fontWeight: 600,
              textAlign: 'center',
              lineHeight: 1.6,
              marginBottom: 12,
            }}
          >
            First woman to win a Nobel Prize. First person to win Nobel Prizes
            in two different sciences.
          </p>
          <p
            style={{
              color: ASH,
              fontSize: '0.9rem',
              lineHeight: 1.7,
              textAlign: 'center',
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            Born Maria Sklodowska in Warsaw, Poland. Moved to Paris, earned two
            degrees, discovered radioactivity's true nature, isolated polonium
            and radium, won the Nobel Prize in Physics (1903) with Pierre and
            Becquerel, then won the Nobel Prize in Chemistry (1911) alone. She
            drove mobile X-ray units ("petites Curies") to the front lines of
            World War I. She died of aplastic anemia caused by years of
            radiation exposure — her notebooks are still too radioactive to
            handle without protective equipment. She remains the only person in
            history to win Nobel Prizes in two different sciences.
          </p>
        </motion.div>

        {/* ── Section 7: 20th Century Big Science ─────────────────────── */}
        <SectionWrapper
          id="big-science"
          icon="🚀"
          title="The 20th Century — Big Science"
          accentColor={BLUE}
          intro="Science became industrial. The Manhattan Project employed 125,000 people. CERN's Large Hadron Collider cost $13.25 billion. The Human Genome Project sequenced 3 billion base pairs. Science was no longer a lone genius with a notebook — it was teams of thousands, budgets of billions, and machines the size of cities. The results matched the scale: nuclear energy, DNA, spaceflight, the Standard Model."
        >
          <TimelineCard entries={BIG_SCIENCE} />
        </SectionWrapper>

        {/* ── Science Self-Corrects ───────────────────────────────────── */}
        <SectionWrapper
          id="self-corrects"
          icon="🔄"
          title="Science Self-Corrects — Why Wrong Ideas Are OK"
          accentColor={GREEN}
          intro="Science does not claim to have the final truth — it claims to have a method for getting closer to it. Wrong ideas are not failures; they are the raw material of progress. Every discarded theory represents a successful correction. The history of science is a history of being wrong in increasingly precise and useful ways."
        >
          <InsightGrid items={SELF_CORRECTS} />
        </SectionWrapper>

        {/* ── The Frontiers ──────────────────────────────────────────── */}
        <SectionWrapper
          id="frontiers"
          icon="🌌"
          title="The Frontiers — What We Still Don't Know"
          accentColor={COSMOS_BLUE}
          intro="For all its triumphs, science has barely begun. We don't know what 95% of the universe is made of. We can't reconcile our two best physical theories. We don't understand consciousness. We know the climate is changing but struggle to act on that knowledge. The greatest discoveries of science may still be ahead."
        >
          <InsightGrid items={FRONTIERS} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures in the History of Science"
          accentColor={NEWTON_GOLD}
          intro="From the Greek natural philosophers who first asked 'why?' to the 20th-century physicists who rebuilt reality, these are the individuals whose ideas transformed our understanding of the universe."
        >
          <FigureGrid figures={KEY_FIGURES} />
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
              { to: '/industrial-revolution', label: 'The Industrial Revolution' },
              { to: '/digital-revolution', label: 'The Digital Revolution' },
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
                  (e.currentTarget.style.backgroundColor =
                    'rgba(96,165,250,0.1)')
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

        {/* ── Closing Callout ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: 24,
            marginTop: 16,
          }}
        >
          <p
            style={{
              color: NEWTON_GOLD,
              fontSize: '1rem',
              fontWeight: 600,
              fontStyle: 'italic',
              lineHeight: 1.7,
              textAlign: 'center',
            }}
          >
            "The most incomprehensible thing about the universe is that it is
            comprehensible." — Albert Einstein
          </p>
          <p
            style={{
              color: SLATE,
              fontSize: '0.85rem',
              textAlign: 'center',
              marginTop: 8,
              lineHeight: 1.6,
            }}
          >
            That the human mind — evolved to find food and avoid predators on
            the African savanna — can decode the laws governing galaxies a
            billion light-years away is the deepest mystery of all.
          </p>
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
            Science is the one human endeavor that consistently builds on what
            came before. Every generation stands on the shoulders of the last.
            The story of science is the story of cumulative, self-correcting
            progress — humanity's longest and most successful project.
          </p>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}
          >
            ← Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
