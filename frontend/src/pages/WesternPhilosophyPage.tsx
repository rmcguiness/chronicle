/**
 * WesternPhilosophyPage — comprehensive deep-dive on the history of Western philosophy.
 *
 * Route: /philosophy
 *
 * Sections:
 *  1. Hero — headline, the big questions
 *  2. Pre-Socratics (600–400 BCE)
 *  3. Socrates (470–399 BCE)
 *  4. Plato (428–348 BCE)
 *  5. Aristotle (384–322 BCE)
 *  6. Hellenistic schools (300 BCE–200 CE)
 *  7. Medieval philosophy (500–1400 CE)
 *  8. Early modern (1600s–1700s)
 *  9. 19th century
 * 10. 20th century
 * 11. Key figures gallery
 * 12. Philosophy's enduring legacy — big questions revisited
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#3b82f6';
const GOLD = '#f59e0b';
const RED = '#ef4444';
const GREEN = '#22c55e';
const PURPLE = '#a855f7';
const TEAL = '#14b8a6';
const ROSE = '#f43f5e';
const INDIGO = '#6366f1';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  color: string;
}

interface FigureEntry {
  name: string;
  years: string;
  contribution: string;
}

interface InsightEntry {
  label: string;
  detail: string;
}

// ── Pre-Socratics ────────────────────────────────────────────────────────────

const PRE_SOCRATICS: TimelineEntry[] = [
  {
    year: 'c. 624 BCE',
    title: 'Thales of Miletus — Water Is the Fundamental Substance',
    description:
      'Thales asked the most radical question in history: what is everything made of? His answer — water — was wrong, but the question itself was revolutionary. For the first time, someone tried to explain the natural world without invoking gods or myths. He predicted a solar eclipse, measured the height of pyramids using shadows, and is often called the first philosopher and first scientist.',
    color: ACCENT,
  },
  {
    year: 'c. 535 BCE',
    title: 'Heraclitus — Everything Is Flux',
    description:
      '"You cannot step in the same river twice." Heraclitus argued that change is the only constant — the universe is in perpetual flux, governed by an underlying rational principle he called the logos. Opposites are unified: day and night, life and death, are aspects of the same process. His emphasis on process over substance anticipated modern physics and process philosophy by 2,500 years.',
    color: GOLD,
  },
  {
    year: 'c. 515 BCE',
    title: 'Parmenides — Being Is Unchanging',
    description:
      'Parmenides took the opposite position from Heraclitus: change is an illusion. What exists (Being) must be eternal, unchanging, and indivisible — because something cannot come from nothing. His purely logical argument was the first sustained use of deductive reasoning in Western thought. The tension between Heraclitus and Parmenides — is reality change or permanence? — has driven philosophy ever since.',
    color: PURPLE,
  },
  {
    year: 'c. 460 BCE',
    title: 'Democritus — Atoms and the Void',
    description:
      'Democritus proposed that all matter is composed of tiny, indivisible particles (atomos) moving through empty space (the void). Different arrangements of atoms produce different substances. This was pure philosophical reasoning — there were no microscopes, no experiments. Yet his atomic theory was confirmed by physics over two thousand years later. He also argued that sensory qualities like color and taste exist only in our perception, not in atoms themselves.',
    color: GREEN,
  },
  {
    year: 'c. 570 BCE',
    title: 'Pythagoras — Numbers Are the Key to Reality',
    description:
      'Pythagoras discovered that musical harmony corresponds to mathematical ratios, and concluded that the structure of reality is fundamentally mathematical. His school combined mathematics, mysticism, and philosophy. The Pythagorean vision that nature is written in the language of mathematics would later inspire Galileo, Kepler, and modern physics.',
    color: TEAL,
  },
];

// ── Socrates ─────────────────────────────────────────────────────────────────

const SOCRATES_ENTRIES: TimelineEntry[] = [
  {
    year: 'c. 470 BCE',
    title: 'The Gadfly of Athens',
    description:
      'Socrates wrote nothing. Everything we know comes through Plato and Xenophon. He spent his life in the agora (marketplace) of Athens, engaging citizens in relentless dialogue. He compared himself to a gadfly — stinging the great horse of Athens into wakefulness. His targets were politicians, poets, and craftsmen who claimed expertise but could not define the concepts they used.',
    color: ACCENT,
  },
  {
    year: 'c. 450 BCE',
    title: 'The Socratic Method — Question Everything',
    description:
      'Socrates invented philosophy\'s most powerful tool: elenchus, the method of systematic questioning. He would ask someone to define a concept (justice, courage, beauty), then expose contradictions in their definition through follow-up questions. The goal was not to win arguments but to reveal ignorance — including his own. "I know that I know nothing" was not false modesty; it was a method. The Socratic method is still used in law schools, therapy (Socratic questioning in CBT), and critical thinking education.',
    color: GOLD,
  },
  {
    year: '399 BCE',
    title: 'Trial and Death — "The Unexamined Life Is Not Worth Living"',
    description:
      'Athens put Socrates on trial for corrupting the youth and impiety toward the gods. He was found guilty by a jury of 501 citizens (by a margin of about 60 votes). Offered the chance to propose exile as his sentence, he suggested Athens should reward him with free meals instead. Sentenced to death, he refused to escape and drank the hemlock poison. His death is philosophy\'s founding martyrdom — he chose truth over survival.',
    color: RED,
  },
];

// ── Plato ────────────────────────────────────────────────────────────────────

const PLATO_ENTRIES: TimelineEntry[] = [
  {
    year: 'c. 380 BCE',
    title: 'Theory of Forms — The Real World Is Not What You See',
    description:
      'Plato argued that the physical world we perceive is merely a shadow of a higher reality — the world of Forms (or Ideas). Every circle you draw is imperfect, but the Form of the Circle is perfect and eternal. Every act of justice is flawed, but the Form of Justice is absolute. True knowledge means grasping these eternal Forms through reason, not through the senses. This is the most influential metaphysical theory in Western history.',
    color: PURPLE,
  },
  {
    year: 'c. 380 BCE',
    title: 'The Allegory of the Cave',
    description:
      'Plato\'s most famous image: prisoners chained in a cave see only shadows on a wall and mistake them for reality. One prisoner escapes, sees the sunlight (truth/the Forms), and returns to tell the others — who refuse to believe him. The allegory captures philosophy\'s central claim: most people live in ignorance and resist enlightenment. It is also a metaphor for education, political awakening, and Socrates\' fate.',
    color: GOLD,
  },
  {
    year: 'c. 375 BCE',
    title: 'The Republic — Philosopher Kings and the Just City',
    description:
      'In The Republic, Plato designs an ideal city-state governed by philosopher-kings — those who have ascended from the cave and seen the Form of the Good. He divides society into producers, guardians, and rulers, mirroring his tripartite soul (appetite, spirit, reason). Justice, he argues, is each part doing its proper function. The Republic is simultaneously a work of political philosophy, psychology, epistemology, and ethics — the first comprehensive philosophical system.',
    color: ACCENT,
  },
  {
    year: 'c. 387 BCE',
    title: 'The Academy — The First University',
    description:
      'Plato founded the Academy in Athens, the Western world\'s first institution of higher learning. It operated for over 900 years (until 529 CE when the Roman emperor Justinian closed it). The Academy taught philosophy, mathematics, and astronomy, and produced Aristotle as its most famous student. Its emphasis on dialectic (structured argument) as the path to truth set the template for Western education.',
    color: TEAL,
  },
];

// ── Aristotle ────────────────────────────────────────────────────────────────

const ARISTOTLE_ENTRIES: TimelineEntry[] = [
  {
    year: 'c. 350 BCE',
    title: 'Empiricism — Knowledge Begins with the Senses',
    description:
      'Where Plato looked upward to abstract Forms, Aristotle looked outward at the observable world. He rejected the Theory of Forms and argued that form is embedded in matter, not separate from it. Knowledge begins with sensory experience and proceeds through abstraction to universal principles. This empirical instinct made Aristotle the intellectual ancestor of modern science — he collected specimens, classified animals, and observed the natural world with an attention to detail unmatched for centuries.',
    color: GREEN,
  },
  {
    year: 'c. 350 BCE',
    title: 'Logic — The Organon',
    description:
      'Aristotle invented formal logic — the systematic study of valid reasoning. His syllogistic logic ("All men are mortal; Socrates is a man; therefore Socrates is mortal") remained the standard framework for two thousand years, until Frege and Russell developed modern symbolic logic in the late 19th century. Aristotle saw logic not as a branch of philosophy but as the tool (organon) that makes all other knowledge possible.',
    color: ACCENT,
  },
  {
    year: 'c. 340 BCE',
    title: 'Eudaimonia — Happiness Through Virtue and Excellent Activity',
    description:
      'In the Nicomachean Ethics, Aristotle argued that the highest human good is eudaimonia — not mere pleasure, but flourishing through the exercise of virtue and excellence over a complete life. Virtue is a habit, not a feeling. The virtuous person doesn\'t just know what\'s right — they reliably do it because they have trained their character. His ethical framework has experienced a massive revival in contemporary "virtue ethics."',
    color: GOLD,
  },
  {
    year: 'c. 340 BCE',
    title: 'The Golden Mean — Virtue Between Extremes',
    description:
      'Aristotle\'s doctrine of the mean: every virtue is a midpoint between two vices (excess and deficiency). Courage lies between cowardice and recklessness. Generosity lies between stinginess and wastefulness. Wit lies between boorishness and buffoonery. The mean is not arithmetic — it depends on context and the individual. This nuanced, situation-specific approach to ethics contrasts sharply with rigid rule-based systems.',
    color: TEAL,
  },
  {
    year: 'c. 335 BCE',
    title: 'The Universal Scholar',
    description:
      'Aristotle wrote on logic, physics, metaphysics, biology, ethics, politics, rhetoric, poetics, psychology, and meteorology. He founded the Lyceum in Athens and tutored Alexander the Great. His biological works classified over 500 animal species. His Poetics defined tragedy and dramatic structure. His Politics analyzed constitutions from across Greece. No single thinker has ever covered more ground.',
    color: PURPLE,
  },
];

// ── Hellenistic schools ──────────────────────────────────────────────────────

const HELLENISTIC: TimelineEntry[] = [
  {
    year: 'c. 300 BCE',
    title: 'Stoicism — Focus on What You Can Control',
    description:
      'Founded by Zeno of Citium, Stoicism teaches that virtue (living according to reason and nature) is the only true good, and external things — wealth, health, reputation — are "preferred indifferents." The key insight: we cannot control events, only our responses to them. "It\'s not things that upset us, but our judgments about things" (Epictetus). Marcus Aurelius, a Roman emperor, practiced Stoicism on the battlefield. Stoicism is experiencing a massive modern revival — it\'s the philosophical ancestor of CBT.',
    color: ACCENT,
  },
  {
    year: 'c. 300 BCE',
    title: 'Epicureanism — Pleasure Is the Absence of Pain',
    description:
      'Epicurus is misunderstood. He did not advocate hedonistic indulgence — he argued that the highest pleasure is ataraxia (tranquility) and the absence of pain. Simple pleasures (friendship, modest food, philosophical conversation) are superior to luxury because they don\'t create anxiety. He urged withdrawal from politics, freedom from fear of death ("when death is, I am not"), and reliance on a close circle of friends. His materialism anticipated modern secularism.',
    color: GREEN,
  },
  {
    year: 'c. 360 BCE',
    title: 'Skepticism — Suspend Judgment',
    description:
      'Pyrrho of Elis argued that for every argument, an equally strong counterargument exists — therefore we should suspend judgment (epoché) on all matters of belief. This radical skepticism aimed at ataraxia: if you stop having opinions, you stop suffering from being wrong. Later Academic skeptics (Carneades) argued we can act on probable beliefs without claiming certainty. Skepticism\'s DNA is in modern philosophy of science — Karl Popper\'s falsifiability is its direct descendant.',
    color: PURPLE,
  },
  {
    year: 'c. 335 BCE',
    title: 'Cynicism — Diogenes and the Rejection of Convention',
    description:
      'Diogenes of Sinope lived in a barrel, carried a lantern in daylight "looking for an honest man," and told Alexander the Great to get out of his sunlight. The Cynics rejected wealth, status, and social norms as obstacles to virtue. They believed humans should live according to nature in the most literal sense. Cynicism influenced Stoicism and remains philosophy\'s most radical challenge to materialism and social conformity.',
    color: GOLD,
  },
];

// ── Medieval philosophy ──────────────────────────────────────────────────────

const MEDIEVAL: TimelineEntry[] = [
  {
    year: '354–430 CE',
    title: 'Augustine — Reconciling Plato with Christianity',
    description:
      'Augustine of Hippo fused Platonic philosophy with Christian theology. Plato\'s Forms became ideas in the mind of God. The soul\'s ascent from the cave became the soul\'s journey to God. His Confessions is the first autobiography in Western literature — an unflinching examination of desire, sin, and grace. His City of God, written as Rome fell, argued that earthly kingdoms are transient; only the heavenly city endures. Augustine\'s framework dominated Western thought for 800 years.',
    color: GOLD,
  },
  {
    year: '1225–1274',
    title: 'Thomas Aquinas — Reconciling Aristotle with Christianity',
    description:
      'When Aristotle\'s works were rediscovered in the 12th century (via Arabic translations), they threatened Christian orthodoxy with their emphasis on reason and the natural world. Aquinas performed the monumental synthesis: faith and reason are complementary, not contradictory. He developed natural law theory (moral principles discoverable by reason), and offered five rational proofs for God\'s existence (from motion, causation, contingency, degrees of perfection, and design). His Summa Theologica is the intellectual cathedral of medieval thought.',
    color: ACCENT,
  },
  {
    year: '980–1037',
    title: 'Avicenna (Ibn Sina) — The Flying Man',
    description:
      'The Persian philosopher Avicenna preserved and extended Aristotle\'s philosophy, developing a sophisticated metaphysics of existence and essence. His "Flying Man" thought experiment — imagine a person created floating in a void with no sensory input; they would still be aware of their own existence — anticipated Descartes\' cogito by 600 years. His Canon of Medicine was the standard medical text in Europe for centuries.',
    color: TEAL,
  },
  {
    year: '1126–1198',
    title: 'Averroes (Ibn Rushd) — The Commentator',
    description:
      'Averroes wrote the most authoritative commentaries on Aristotle in the medieval world — so influential that Aquinas simply called him "The Commentator." He argued that philosophy and religion describe the same truth in different languages. His defense of reason against religious literalism was so controversial that his books were burned in both the Islamic and Christian worlds, yet his ideas shaped the course of European thought.',
    color: PURPLE,
  },
];

// ── Early Modern ─────────────────────────────────────────────────────────────

const EARLY_MODERN: TimelineEntry[] = [
  {
    year: '1641',
    title: 'Descartes — Cogito Ergo Sum',
    description:
      'René Descartes systematically doubted everything: the senses deceive, mathematics could be the trick of an evil demon. But one thing cannot be doubted: the act of doubting itself proves a thinking thing exists. "I think, therefore I am" (cogito ergo sum) — the foundation of modern philosophy. Descartes\' mind-body dualism (the mind is a non-physical substance) created the "mind-body problem" that philosophy and neuroscience still grapple with. He is the father of rationalism: true knowledge comes from reason, not experience.',
    color: PURPLE,
  },
  {
    year: '1677',
    title: 'Spinoza — God Is Nature',
    description:
      'Baruch Spinoza argued that God and Nature are the same thing (Deus sive Natura) — there is only one substance, and everything is a mode of it. Mind and body are not separate substances but two aspects of the same reality. Free will is an illusion; everything follows necessarily from the nature of God/Nature. His Ethics, written in geometric proof format, was called "the most dangerous book ever written." Excommunicated by his Jewish community and banned by Christians, he is now considered one of philosophy\'s greatest minds.',
    color: TEAL,
  },
  {
    year: '1689',
    title: 'Locke — The Mind Is a Blank Slate',
    description:
      'John Locke rejected innate ideas: the mind at birth is a tabula rasa (blank slate), and all knowledge comes from experience. He distinguished primary qualities (shape, motion — in the object) from secondary qualities (color, taste — in the perceiver). His political philosophy — natural rights to life, liberty, and property; government by consent of the governed — directly influenced the American Declaration of Independence and modern liberal democracy.',
    color: ACCENT,
  },
  {
    year: '1710–1739',
    title: 'Berkeley and Hume — Empiricism\'s Radical Conclusions',
    description:
      'George Berkeley pushed empiricism to its logical extreme: if we only ever experience perceptions, not things-in-themselves, then the material world may not exist at all — "to be is to be perceived." David Hume went further: we never perceive causation, only constant conjunction (A always follows B). Our belief in cause and effect is a habit of the mind, not a rational certainty. Hume\'s skepticism about causation, the self, and induction "awoke Kant from his dogmatic slumber."',
    color: ROSE,
  },
  {
    year: '1781',
    title: 'Kant — The Copernican Revolution in Philosophy',
    description:
      'Immanuel Kant synthesized rationalism and empiricism with a radical insight: the mind does not passively receive experience — it actively structures it. Space, time, and causality are not features of the world but categories the mind imposes on experience. We can know appearances (phenomena) but never things-in-themselves (noumena). In ethics, Kant\'s categorical imperative — "act only according to rules you could will to be universal laws" — grounds morality in reason alone. Kant is the central figure of modern philosophy.',
    color: GOLD,
  },
  {
    year: '1714',
    title: 'Leibniz — Monads and the Best of All Possible Worlds',
    description:
      'Gottfried Wilhelm Leibniz proposed that reality consists of simple, indivisible substances called monads — each a self-contained universe reflecting all others. He argued this is the "best of all possible worlds" (satirized mercilessly by Voltaire in Candide). As a mathematician, he co-invented calculus (independently of Newton). His optimistic rationalism and logical innovations anticipated modern computation and possible-worlds semantics.',
    color: INDIGO,
  },
];

// ── 19th Century ─────────────────────────────────────────────────────────────

const NINETEENTH_CENTURY: TimelineEntry[] = [
  {
    year: '1807–1831',
    title: 'Hegel — History as the Unfolding of Spirit',
    description:
      'Georg Wilhelm Friedrich Hegel proposed that all of history is the progressive self-realization of Geist (Spirit/Mind). Reality develops through dialectic: a thesis generates its antithesis, and their conflict resolves in a higher synthesis — which becomes a new thesis. Freedom is not given but achieved through this historical process. Hegel\'s system is immense, opaque, and enormously influential — it shaped Marx, existentialism, and virtually all subsequent philosophy of history.',
    color: PURPLE,
  },
  {
    year: '1818–1860',
    title: 'Schopenhauer — The World as Will and Representation',
    description:
      'Arthur Schopenhauer argued that the thing-in-itself behind phenomena is the Will — a blind, aimless, insatiable striving. Life is suffering because desire can never be permanently satisfied. The only escapes are aesthetic contemplation (especially music, which directly expresses the Will) and ultimately, ascetic renunciation. His pessimism drew on Buddhism, influenced Nietzsche, Wagner, Freud, and Wittgenstein, and offered the first major Western engagement with Eastern philosophy.',
    color: TEAL,
  },
  {
    year: '1859–1863',
    title: 'John Stuart Mill — Utilitarianism Refined',
    description:
      'Mill refined Bentham\'s utilitarianism: the right action is the one that produces the greatest happiness for the greatest number. But not all pleasures are equal — "it is better to be Socrates dissatisfied than a fool satisfied." He championed individual liberty (harm principle: the only reason to restrict someone\'s freedom is to prevent harm to others), women\'s rights (The Subjection of Women), and free speech. Mill\'s liberalism remains the philosophical foundation of democratic societies.',
    color: GREEN,
  },
  {
    year: '1882–1888',
    title: 'Nietzsche — God Is Dead and We Have Killed Him',
    description:
      'Friedrich Nietzsche declared that the Enlightenment had killed God — not as a theological statement but as a cultural diagnosis. Without God, traditional morality loses its foundation. What fills the void? Nietzsche proposed the will to power (the drive to grow, overcome, create), the Übermensch (overman — one who creates their own values), and eternal recurrence (would you live your life again, identically, forever?). He attacked "slave morality" (Christian meekness as resentment disguised as virtue) and demanded that individuals forge their own meaning.',
    color: RED,
  },
  {
    year: '1848–1867',
    title: 'Marx — Philosophy Must Change the World',
    description:
      'Karl Marx turned Hegel on his head: it is not Spirit but material conditions (economics, class relations) that drive history. "The philosophers have only interpreted the world; the point is to change it." His analysis of capitalism — alienation of labor, commodity fetishism, the tendency of capital to concentrate — remains influential in economics, sociology, and political philosophy regardless of one\'s views on his political prescriptions. Historical materialism reframed philosophy as a tool for social transformation.',
    color: ROSE,
  },
  {
    year: '1813–1855',
    title: 'Kierkegaard — The First Existentialist',
    description:
      'Søren Kierkegaard rebelled against Hegel\'s grand system: philosophy should address the existing individual, not abstract Spirit. He explored anxiety, despair, and the "leap of faith" — the moment when rational argument runs out and you must choose. His three stages of existence (aesthetic, ethical, religious) describe paths of increasing commitment. Kierkegaard\'s insistence on subjective experience, individual choice, and the absurdity of existence made him the father of existentialism.',
    color: INDIGO,
  },
];

// ── 20th Century ─────────────────────────────────────────────────────────────

const TWENTIETH_CENTURY: TimelineEntry[] = [
  {
    year: '1905–1922',
    title: 'Russell and Early Wittgenstein — Analytic Philosophy',
    description:
      'Bertrand Russell and the early Ludwig Wittgenstein launched analytic philosophy — the dominant tradition in English-speaking universities. Russell sought to ground mathematics in logic (Principia Mathematica). Wittgenstein\'s Tractatus Logico-Philosophicus argued that the structure of language mirrors the structure of reality, and "whereof one cannot speak, thereof one must be silent." Analytic philosophy prized logical rigor, clarity, and the analysis of language over grand metaphysical systems.',
    color: ACCENT,
  },
  {
    year: '1953',
    title: 'Later Wittgenstein — Language Games',
    description:
      'In Philosophical Investigations, Wittgenstein repudiated his own earlier work. Meaning is not a picture of reality but a function of use — words get their meaning from the "language games" (social practices) in which they are embedded. "If a lion could speak, we would not understand him" — because meaning requires shared forms of life. This insight transformed philosophy of language, mind, and social science, and anticipated much of postmodern thought.',
    color: GOLD,
  },
  {
    year: '1927–1943',
    title: 'Heidegger — Being and Time',
    description:
      'Martin Heidegger asked the question philosophy had forgotten: what does it mean to be? His analysis of Dasein (human existence as "being-there") revealed that we are always already thrown into a world of meaning, projects, and mortality. Anxiety before death reveals the authenticity concealed by everyday conformism ("the They"). Heidegger\'s influence on existentialism, hermeneutics, and postmodernism is immense — though his Nazi party membership remains a profound moral stain on his legacy.',
    color: TEAL,
  },
  {
    year: '1943–1960',
    title: 'Sartre — Existence Precedes Essence',
    description:
      'Jean-Paul Sartre declared that humans have no fixed nature — "existence precedes essence." We are "condemned to be free": there is no God, no human nature, no predetermined purpose. You are nothing but what you make of yourself through your choices. Bad faith (mauvaise foi) is the self-deception of pretending you have no choice ("I had to do it"). Sartre\'s existentialism became the philosophy of postwar Paris — equal parts rigorous argument and café lifestyle.',
    color: PURPLE,
  },
  {
    year: '1942–1951',
    title: 'Camus — The Absurd',
    description:
      'Albert Camus argued that the fundamental philosophical problem is the absurd — the conflict between our human need for meaning and the universe\'s silent indifference. In The Myth of Sisyphus, he concluded that we must imagine Sisyphus happy: the proper response to absurdity is not suicide but revolt, living fully despite meaninglessness. Camus rejected both religious consolation and Sartre\'s systematic existentialism in favor of a lucid, defiant engagement with life.',
    color: RED,
  },
  {
    year: '1913–1960s',
    title: 'Husserl and Merleau-Ponty — Phenomenology',
    description:
      'Edmund Husserl founded phenomenology: the rigorous study of consciousness as it is experienced, bracketing assumptions about the external world. Maurice Merleau-Ponty extended this to the body — we don\'t just have bodies, we are bodies. Perception is not passive reception but active, embodied engagement with the world. Phenomenology influenced psychology, cognitive science, artificial intelligence research, and the entire continental philosophical tradition.',
    color: INDIGO,
  },
  {
    year: '1949',
    title: 'Simone de Beauvoir — "One Is Not Born, but Rather Becomes, a Woman"',
    description:
      'In The Second Sex, Beauvoir applied existentialist philosophy to the situation of women. Gender is not biology but a social construction — women have been defined as "the Other" by a male-dominated culture. Her analysis of how oppression is internalized and naturalized became the intellectual foundation of second-wave feminism. She demonstrated that existentialism without feminism is incomplete, and that philosophy must address lived experience of oppression.',
    color: ROSE,
  },
  {
    year: '1971',
    title: 'Rawls — Justice as Fairness',
    description:
      'John Rawls\' A Theory of Justice revived political philosophy with a single thought experiment: the "veil of ignorance." If you didn\'t know your place in society — your race, sex, wealth, talents — what principles would you choose to govern it? Rawls argued you\'d choose equal basic liberties and arrange inequalities only if they benefit the least advantaged. His theory of justice as fairness remains the starting point for virtually all subsequent political philosophy.',
    color: GREEN,
  },
  {
    year: '1975–1984',
    title: 'Foucault — Power/Knowledge',
    description:
      'Michel Foucault argued that power and knowledge are inseparable — what counts as "truth" is determined by systems of power, and knowledge in turn reinforces power structures. In Discipline and Punish, he showed how modern institutions (prisons, schools, hospitals) control individuals through surveillance and normalization rather than brute force. Foucault\'s analyses of how power operates through discourse, institutions, and the production of "normal" subjects transformed the humanities and social sciences.',
    color: PURPLE,
  },
];

// ── Key Figures ──────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  { name: 'Thales', years: 'c. 624–546 BCE', contribution: 'First philosopher. Asked what the world is made of without invoking myth. Founded the Milesian school.' },
  { name: 'Heraclitus', years: 'c. 535–475 BCE', contribution: 'Everything is flux. Logos as the rational principle governing change. Unity of opposites.' },
  { name: 'Socrates', years: '470–399 BCE', contribution: 'Invented the Socratic method. Martyr of philosophy. "The unexamined life is not worth living."' },
  { name: 'Plato', years: '428–348 BCE', contribution: 'Theory of Forms, the Republic, the Academy. Most influential philosopher in Western history.' },
  { name: 'Aristotle', years: '384–322 BCE', contribution: 'Invented logic, empiricism, virtue ethics. Wrote on everything from biology to poetry.' },
  { name: 'Epicurus', years: '341–270 BCE', contribution: 'Pleasure as absence of pain. Materialism, friendship, freedom from fear of death.' },
  { name: 'Epictetus', years: '50–135 CE', contribution: 'Stoic teacher. Former slave. "It\'s not things that upset us, but our judgments about things."' },
  { name: 'Marcus Aurelius', years: '121–180 CE', contribution: 'Roman emperor and Stoic philosopher. Meditations remains one of the most-read philosophy books.' },
  { name: 'Augustine', years: '354–430 CE', contribution: 'Fused Plato with Christianity. Confessions. Free will, original sin, the City of God.' },
  { name: 'Thomas Aquinas', years: '1225–1274', contribution: 'Reconciled Aristotle with Christianity. Five proofs of God. Natural law theory.' },
  { name: 'Descartes', years: '1596–1650', contribution: 'Father of modern philosophy. Cogito ergo sum. Mind-body dualism. Rationalism.' },
  { name: 'Spinoza', years: '1632–1677', contribution: 'God is Nature. Determinism. Monism. Ethics written in geometric form.' },
  { name: 'Hume', years: '1711–1776', contribution: 'Skepticism about causation, the self, and induction. Empiricism taken to its limits.' },
  { name: 'Kant', years: '1724–1804', contribution: 'Copernican revolution in philosophy. Categorical imperative. Phenomena vs. noumena.' },
  { name: 'Hegel', years: '1770–1831', contribution: 'Dialectic. History as unfolding of Spirit. Shaped Marx, existentialism, and continental thought.' },
  { name: 'Nietzsche', years: '1844–1900', contribution: 'God is dead. Will to power. Eternal recurrence. Master/slave morality. Overman.' },
  { name: 'Marx', years: '1818–1883', contribution: 'Historical materialism. Class struggle. Alienation. Philosophy as social transformation.' },
  { name: 'Wittgenstein', years: '1889–1951', contribution: 'Two revolutions: Tractatus (language pictures reality) and Investigations (meaning is use).' },
  { name: 'Sartre', years: '1905–1980', contribution: 'Existence precedes essence. Radical freedom. Bad faith. Being and Nothingness.' },
  { name: 'Beauvoir', years: '1908–1986', contribution: 'Feminist existentialism. The Second Sex. Gender as social construction.' },
  { name: 'Rawls', years: '1921–2002', contribution: 'Veil of ignorance. Justice as fairness. Revived political philosophy.' },
  { name: 'Foucault', years: '1926–1984', contribution: 'Power/knowledge. Discipline and Punish. Archaeology of knowledge.' },
];

// ── Philosophy's enduring questions ──────────────────────────────────────────

const BIG_QUESTIONS: InsightEntry[] = [
  { label: 'What exists? (Metaphysics)', detail: 'From Thales\' water to quantum fields — is reality material, mental, or something else? Do abstract objects (numbers, propositions) exist? Is there a God? Is free will real or an illusion?' },
  { label: 'What can we know? (Epistemology)', detail: 'From Socrates\' ignorance to Hume\'s skepticism to Kant\'s categories — what are the limits of human knowledge? Can reason alone discover truth? How do we distinguish knowledge from mere belief?' },
  { label: 'What is right? (Ethics)', detail: 'Virtue (Aristotle), duty (Kant), consequences (Mill), or care (feminist ethics)? How should we live? Are moral truths objective or culturally constructed? What do we owe each other?' },
  { label: 'What is justice? (Political Philosophy)', detail: 'From Plato\'s Republic to Rawls\' veil of ignorance — what makes a society just? How should power be distributed? What are our rights, and where do they come from?' },
  { label: 'What is the mind? (Philosophy of Mind)', detail: 'From Descartes\' dualism to Merleau-Ponty\'s embodiment — is the mind separate from the body? Can machines think? What is consciousness, and why does it exist at all?' },
];

const PHILOSOPHY_LEGACY: InsightEntry[] = [
  { label: 'Science Was Born from Philosophy', detail: 'Physics, biology, psychology, political science, linguistics, and logic all began as branches of philosophy. Every time a philosophical question becomes answerable by experiment, a new science is born.' },
  { label: 'Democracy and Human Rights', detail: 'The concepts of natural rights, consent of the governed, liberty, equality, and justice that underpin modern democracies were invented by philosophers — Locke, Rousseau, Kant, Mill, Rawls.' },
  { label: 'Critical Thinking Itself', detail: 'The Socratic method, formal logic, skepticism about authority, and the demand for evidence — philosophy invented the tools of rational inquiry that every discipline depends on.' },
  { label: 'Still Asking the Hard Questions', detail: 'AI ethics, climate justice, animal rights, the nature of consciousness, the meaning of life in a secular age — philosophy continues to tackle questions that science alone cannot answer.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SectionWrapper({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      style={{
        display: 'flex',
        gap: 16,
        padding: '18px 20px',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid ${entry.color}33`,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 100,
          fontSize: 12,
          fontWeight: 700,
          color: entry.color,
          fontFamily: 'monospace',
          paddingTop: 2,
        }}
      >
        {entry.year}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{entry.title}</div>
        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{entry.description}</div>
      </div>
    </motion.div>
  );
}

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
      {figures.map((f, i) => (
        <motion.div
          key={f.name}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          style={{
            padding: '14px 16px',
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>{f.name}</div>
          <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace', marginBottom: 8 }}>{f.years}</div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{f.contribution}</div>
        </motion.div>
      ))}
    </div>
  );
}

function QuestionsAndLegacy({ questions, legacy }: { questions: InsightEntry[]; legacy: InsightEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: PURPLE, marginBottom: 14 }}>The Questions That Never Go Away</h3>
        {questions.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(168,85,247,0.06)',
              border: '1px solid rgba(168,85,247,0.2)',
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#c4b5fd', marginBottom: 4 }}>{t.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{t.detail}</div>
          </motion.div>
        ))}
      </div>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 14 }}>What Philosophy Has Given Us</h3>
        {legacy.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.2)',
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#86efac', marginBottom: 4 }}>{r.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{r.detail}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function WesternPhilosophyPage() {
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
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div
          style={{
            padding: '40px 32px 36px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: `linear-gradient(135deg, rgba(7,14,34,0.98) 0%, ${PURPLE}10 100%)`,
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: '#64748b',
              textDecoration: 'none',
              marginBottom: 28,
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            &larr; Back to Timeline
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: 'clamp(24px, 4.5vw, 40px)',
              fontWeight: 800,
              color: '#f1f5f9',
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            Western Philosophy &mdash; 2,500 Years of Humanity&rsquo;s Hardest Questions
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              fontSize: 14,
              color: '#94a3b8',
              lineHeight: 1.7,
              maxWidth: 720,
              padding: '16px 20px',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            What exists? What can we know? What is right? What is beauty? What is justice?
            These are the questions that philosophy has been asking since the Pre-Socratics first
            tried to explain the world without myth. From <strong style={{ color: GOLD }}>Socrates&rsquo; hemlock</strong> to{' '}
            <strong style={{ color: PURPLE }}>Kant&rsquo;s categorical imperative</strong> to{' '}
            <strong style={{ color: RED }}>Nietzsche&rsquo;s death of God</strong> to{' '}
            <strong style={{ color: TEAL }}>Sartre&rsquo;s radical freedom</strong> &mdash; this is the story
            of humanity&rsquo;s longest, most ambitious attempt to understand itself.
          </motion.div>
        </div>

        {/* ── Pre-Socratics ────────────────────────────────────────────── */}
        <SectionWrapper title="The Pre-Socratics (600\u2013400 BCE)" icon={'\u{1F30A}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The first philosophers did something no one had done before: they tried to explain the world using
            reason instead of mythology. What is everything made of? Is reality permanent or constantly changing?
            Their answers were often wrong, but their questions created philosophy, science, and Western civilization.
          </p>
          {PRE_SOCRATICS.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Socrates ─────────────────────────────────────────────────── */}
        <SectionWrapper title="Socrates (470\u2013399 BCE) \u2014 The Gadfly of Athens" icon={'\u{1FAAB}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Socrates wrote nothing, yet he is the most important figure in Western philosophy. His method of
            relentless questioning, his insistence that the unexamined life is not worth living, and his
            willingness to die for his principles set the template for what philosophy is and what it demands.
          </p>
          {SOCRATES_ENTRIES.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Plato ────────────────────────────────────────────────────── */}
        <SectionWrapper title="Plato (428\u2013348 BCE) \u2014 The World of Forms" icon={'\u{1F4DC}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Alfred North Whitehead called all of Western philosophy &ldquo;a series of footnotes to Plato.&rdquo;
            He invented metaphysics, epistemology, political philosophy, and aesthetics as systematic disciplines.
            His dialogues remain the most widely read works of philosophy 2,400 years later.
          </p>
          {PLATO_ENTRIES.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Aristotle ────────────────────────────────────────────────── */}
        <SectionWrapper title="Aristotle (384\u2013322 BCE) \u2014 The First Scientist-Philosopher" icon={'\u{1F9EA}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            If Plato looked upward to ideal Forms, Aristotle looked outward at the world as it is.
            He invented logic, pioneered empirical observation, and wrote on virtually every subject.
            For 1,500 years, to cite &ldquo;The Philosopher&rdquo; meant to cite Aristotle.
          </p>
          {ARISTOTLE_ENTRIES.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Hellenistic Schools ──────────────────────────────────────── */}
        <SectionWrapper title="Hellenistic Schools (300 BCE\u2013200 CE)" icon={'\u{1F3DB}\u{FE0F}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            After Aristotle, philosophy shifted from grand theories of reality to practical questions:
            how should I live? The Hellenistic schools &mdash; Stoics, Epicureans, Skeptics, and Cynics &mdash;
            offered competing answers that remain remarkably relevant today.
          </p>
          {HELLENISTIC.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Medieval Philosophy ──────────────────────────────────────── */}
        <SectionWrapper title="Medieval Philosophy (500\u20131400 CE)" icon={'\u{26EA}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Medieval philosophy was not philosophy in a dark age &mdash; it was a sustained, sophisticated
            effort to reconcile Greek reason with revealed religion. Augustine married Plato to Christianity;
            Aquinas married Aristotle. Islamic philosophers preserved and extended the Greek tradition when
            Europe could not.
          </p>
          {MEDIEVAL.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Early Modern ─────────────────────────────────────────────── */}
        <SectionWrapper title="Early Modern Philosophy (1600s\u20131700s)" icon={'\u{1F52D}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The early modern period was philosophy&rsquo;s great civil war: rationalists (Descartes, Spinoza, Leibniz)
            said reason is the source of knowledge; empiricists (Locke, Berkeley, Hume) said experience is.
            Kant ended the war by showing both sides were partly right &mdash; and changed philosophy forever.
          </p>
          {EARLY_MODERN.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── 19th Century ─────────────────────────────────────────────── */}
        <SectionWrapper title="19th Century \u2014 The Age of Systems and Their Destroyers" icon={'\u{1F525}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The 19th century began with Hegel&rsquo;s grand system of absolute knowledge and ended with
            Nietzsche declaring God dead. Between them, philosophy addressed industrialization, democracy,
            evolution, and the growing suspicion that reason alone cannot ground morality or meaning.
          </p>
          {NINETEENTH_CENTURY.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── 20th Century ─────────────────────────────────────────────── */}
        <SectionWrapper title="20th Century \u2014 Analysis, Existence, and Power" icon={'\u{1F4A1}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The 20th century split philosophy in two: analytic philosophy (logic, language, science) dominated
            the English-speaking world, while continental philosophy (existentialism, phenomenology, critical theory)
            dominated Europe. Both traditions produced transformative insights about language, freedom, justice, and power.
          </p>
          {TWENTIETH_CENTURY.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper title={`Key Figures (${KEY_FIGURES.length})`} icon={'\u{1F9D1}\u{200D}\u{1F393}'}>
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Big Questions & Legacy ───────────────────────────────────── */}
        <SectionWrapper title="Philosophy\u2019s Enduring Legacy" icon={'\u{2753}'}>
          <QuestionsAndLegacy questions={BIG_QUESTIONS} legacy={PHILOSOPHY_LEGACY} />
        </SectionWrapper>

        {/* ── Bottom nav ───────────────────────────────────────────────── */}
        <div style={{ padding: '24px 32px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#60a5fa',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid rgba(96,165,250,0.3)',
              backgroundColor: 'rgba(96,165,250,0.08)',
            }}
          >
            &larr; Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
