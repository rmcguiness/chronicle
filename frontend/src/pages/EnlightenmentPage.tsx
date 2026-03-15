/**
 * EnlightenmentPage — comprehensive deep-dive on the Age of Enlightenment (1685–1815).
 *
 * Route: /enlightenment
 *
 * Sections:
 *  1. Hero — headline, overview
 *  2. What Was the Enlightenment — Sapere Aude, dare to know
 *  3. Precursors — Scientific Revolution, Reformation, New World
 *  4. Core Ideas — 8 foundational concepts
 *  5. The French Philosophes — Voltaire, Rousseau, Montesquieu, Diderot
 *  6. British Enlightenment — Locke, Hume, Smith, Wollstonecraft
 *  7. German Enlightenment — Kant, Leibniz, Lessing, Mendelssohn
 *  8. Scottish Enlightenment — Edinburgh as Athens of the North
 *  9. The Encyclopédie — Diderot's 28-volume revolution
 * 10. Enlightenment Salons — women who ran the intellectual gathering places
 * 11. Political Applications — American, French, Latin American revolutions
 * 12. Counter-Enlightenment — Romanticism pushes back
 * 13. Legacy — modern democracy, human rights, scientific method
 * 14. Key Figures
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
const INDIGO = '#6366f1';
const TEAL = '#14b8a6';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const PURPLE = '#a855f7';
const CRIMSON = '#dc2626';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const IVORY = '#fef3c7';
const COPPER = '#b45309';
const SAGE = '#84cc16';
const SKY = '#38bdf8';
const WINE = '#9f1239';
const PARCHMENT = '#fde68a';
const MIDNIGHT = '#312e81';

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

// ── What Was the Enlightenment ──────────────────────────────────────────────

const WHAT_WAS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Sapere Aude — Dare to Know',
    detail:
      'In 1784, Immanuel Kant published his essay "What Is Enlightenment?" and gave the movement its motto: Sapere aude — "dare to know." Enlightenment, Kant wrote, is "man\'s emergence from his self-imposed immaturity" — the courage to use your own reason without the guidance of another. It was a declaration of intellectual independence: stop accepting what priests, kings, and traditions tell you, and think for yourself. This single idea — that every human being possesses the capacity and the right to reason independently — is arguably the most revolutionary idea in human history.',
  },
  {
    label: 'Reason Applied to Everything',
    detail:
      'What made the Enlightenment revolutionary was not just the belief in reason — the ancient Greeks had that — but the insistence on applying reason to everything: government, religion, economics, education, law, morality, even the nature of knowledge itself. Nothing was sacred, nothing exempt from rational scrutiny. If a tradition could not justify itself before the tribunal of reason, it deserved to be overthrown. This was terrifying to established authorities, and with good reason: the Enlightenment did eventually overthrow monarchies, challenge churches, and reimagine the entire social order.',
  },
  {
    label: 'Not a Single Movement',
    detail:
      'The Enlightenment was not a unified movement with a single agenda. It was a sprawling, contentious, sometimes contradictory intellectual revolution that played out differently in France, Britain, Germany, Scotland, Italy, and the Americas. French philosophes tended toward radical anti-clericalism; British thinkers emphasized empiricism and commercial society; German philosophers pursued systematic metaphysics; Scottish thinkers combined philosophy with practical economics. What united them was the conviction that human reason could improve the human condition — and the audacity to try.',
  },
  {
    label: 'A Movement of Books, Letters, and Conversation',
    detail:
      'The Enlightenment was powered by a revolution in communication. The printing press had been around for 250 years, but in the 18th century, literacy rates surged, the cost of printing dropped, and a new institution — the periodical press — created an ongoing public conversation. Books circulated in lending libraries, ideas spread through coffeehouses and salons, and intellectuals across Europe maintained vast correspondence networks. Voltaire alone wrote an estimated 20,000 letters. The "Republic of Letters" was the 18th century\'s version of the internet: a decentralized network of minds exchanging ideas across borders.',
  },
];

// ── Precursors ──────────────────────────────────────────────────────────────

const PRECURSORS_TIMELINE: TimelineEntry[] = [
  {
    year: '1543–1687',
    title: 'The Scientific Revolution',
    description:
      'The Enlightenment did not emerge from nowhere. Copernicus (1543) placed the sun at the center of the solar system, overturning 1,400 years of Ptolemaic geocentrism. Galileo turned the telescope to the heavens and confirmed Copernicus — then was forced to recant by the Inquisition (1633), becoming the iconic martyr of reason vs. authority. Newton\'s Principia Mathematica (1687) unified terrestrial and celestial mechanics in a single mathematical framework, demonstrating that the universe obeyed rational, discoverable laws. If nature itself was rational, the philosophes asked, shouldn\'t human society be rational too?',
    color: BLUE,
  },
  {
    year: '1517–1648',
    title: 'The Reformation — Questioning Authority',
    description:
      'Martin Luther\'s 95 Theses (1517) cracked the monopoly of the Catholic Church on European thought. By asserting that individuals could interpret scripture for themselves, the Reformation — unintentionally — planted the seed of intellectual autonomy. The resulting Wars of Religion (culminating in the Thirty Years\' War, 1618–1648, which killed 8 million) also demonstrated the horrific cost of religious absolutism, making the case for tolerance. The Enlightenment\'s insistence on religious tolerance was born directly from a century of religious slaughter.',
    color: AMBER,
  },
  {
    year: '1492–1600s',
    title: 'Discovery of the Americas — A Larger World',
    description:
      'The European encounter with the Americas shattered established worldviews. Here were entire civilizations that the Bible, Aristotle, and Ptolemy had said nothing about. The existence of peoples with entirely different customs, religions, and social structures raised unsettling questions: Were European institutions really "natural" — or merely local? Could human societies be organized differently? Montaigne\'s essay "Of Cannibals" (1580) used the New World to question European assumptions about civilization. The Enlightenment\'s comparative, questioning approach to human institutions grew from this shock of discovery.',
    color: TEAL,
  },
  {
    year: '1688–1689',
    title: 'The Glorious Revolution — Power from Consent',
    description:
      'When the English Parliament deposed James II and installed William and Mary with a Bill of Rights (1689), it demonstrated that political authority could be changed by human decision rather than divine decree. John Locke\'s Two Treatises of Government (1689), written to justify the revolution, argued that government derives its legitimacy from the consent of the governed — and that the people retain the right to overthrow a government that violates their natural rights. This was the political template the Enlightenment would export to the world.',
    color: GOLD,
  },
];

// ── Core Ideas ──────────────────────────────────────────────────────────────

const CORE_IDEAS: InsightEntry[] = [
  {
    label: '1. Reason as the Highest Authority',
    detail:
      'The Enlightenment\'s most radical claim: reason — not tradition, not scripture, not royal decree, not "the way things have always been done" — is the ultimate standard by which ideas, institutions, and practices should be judged. This was not merely an intellectual preference; it was a direct assault on the two pillars of the old order: hereditary monarchy and established religion. If every belief must justify itself before reason, then "because God wills it" and "because the king commands it" are no longer acceptable answers. The implications were explosive, and the philosophes knew it.',
  },
  {
    label: '2. Natural Rights: Life, Liberty, Property',
    detail:
      'John Locke argued that human beings possess natural rights — life, liberty, and property — that exist prior to and independent of any government. These rights are not gifts from kings or gods; they belong to every person by virtue of being human. Government exists solely to protect these rights, and a government that violates them forfeits its legitimacy. Thomas Jefferson, drafting the Declaration of Independence, changed Locke\'s "property" to "the pursuit of happiness" — but the philosophical framework was pure Locke. This idea — that rights are inherent, not granted — is the foundation of modern human rights law.',
  },
  {
    label: '3. The Social Contract',
    detail:
      'If government doesn\'t come from God, where does it come from? The Enlightenment\'s answer: the social contract. Hobbes argued people surrender freedom to a sovereign to escape the "state of nature" (war of all against all). Locke refined this: people consent to government to protect their natural rights, and retain the right to rebel if it fails. Rousseau radicalized it further: legitimate government expresses the "general will" of the people, not the will of a monarch. The social contract demolished divine right and placed sovereignty in the people — the theoretical foundation of every modern democracy.',
  },
  {
    label: '4. Religious Tolerance',
    detail:
      'After a century of religious wars that killed millions, the Enlightenment insisted that religious belief was a private matter and that no government should impose a particular faith. Voltaire, who witnessed the execution of Jean Calas (a Protestant falsely convicted of murder by a Catholic court in Toulouse, 1762), became the most passionate advocate for tolerance. The phrase attributed to him — "I disapprove of what you say, but I will defend to the death your right to say it" — captured the principle perfectly. Locke\'s Letter Concerning Toleration (1689) provided the philosophical foundation. The result: the First Amendment, Article 10 of the Declaration of the Rights of Man, and eventually the Universal Declaration of Human Rights.',
  },
  {
    label: '5. The Idea of Progress',
    detail:
      'Before the Enlightenment, most cultures viewed history as cyclical or as decline from a golden age. The Enlightenment introduced a revolutionary idea: human society can improve over time through the application of reason and education. Condorcet, writing while hiding from the Terror during the French Revolution, sketched a vision of unlimited human progress — improved health, education, equality, and knowledge — in his "Sketch for a Historical Picture of the Progress of the Human Mind" (1795). He was arrested and died in prison, but his optimism became the defining attitude of the modern world.',
  },
  {
    label: '6. Empiricism: Knowledge from Observation',
    detail:
      'The Enlightenment embraced Francis Bacon\'s and John Locke\'s insistence that genuine knowledge comes from sensory experience, observation, and experiment — not from ancient texts, philosophical speculation, or religious revelation. Locke\'s concept of the mind as a tabula rasa (blank slate) — that we are born with no innate ideas and all knowledge comes through experience — was revolutionary. It implied that human nature was malleable, that education could transform society, and that no one was born inherently superior. It also grounded the scientific method as the path to truth.',
  },
  {
    label: '7. Separation of Church and State',
    detail:
      'The Enlightenment drew a sharp line between religious authority and political power. Locke argued that the state has no business saving souls, and the church has no business governing. Voltaire\'s attacks on the Catholic Church\'s political power in France were relentless. Montesquieu\'s separation of powers included limiting religious influence on law. Jefferson\'s "wall of separation between church and state" was a direct Enlightenment application. The idea was practical as well as principled: wherever church and state were fused, the result was persecution, corruption, and the suppression of free inquiry.',
  },
  {
    label: '8. Universal Humanity',
    detail:
      'Perhaps the Enlightenment\'s most profound idea: all human beings, regardless of nationality, religion, race, or sex, share a common rational nature and are entitled to basic rights and dignity. This idea was revolutionary in a world organized around hereditary hierarchy, religious exclusion, and racial slavery. The philosophes did not always live up to this ideal — many held racist or sexist views — but the principle they established would eventually be turned against every form of exclusion, including their own. The arc of modern liberation movements — abolition, suffrage, civil rights, decolonization — traces back to the Enlightenment\'s claim of universal human dignity.',
  },
];

// ── French Philosophes ──────────────────────────────────────────────────────

const FRENCH_PHILOSOPHES: InsightEntry[] = [
  {
    label: 'Voltaire (1694–1778) — The Satirist Who Terrified Kings',
    detail:
      'François-Marie Arouet, who took the pen name Voltaire, was the greatest literary celebrity of the 18th century and the Enlightenment\'s most effective propagandist. Imprisoned twice in the Bastille, exiled to England (where he discovered Locke and Newton), and repeatedly forced to flee France, Voltaire used wit, satire, and sheer volume of output (he wrote over 20,000 letters and 2,000 books and pamphlets) to attack religious intolerance, superstition, and tyranny. His novel Candide (1759) — a savage satire of philosophical optimism — remains one of the most widely read works of the era. His greatest campaign was the rehabilitation of Jean Calas, which turned a single judicial murder into an international cause célèbre for religious tolerance.',
  },
  {
    label: 'Jean-Jacques Rousseau (1712–1778) — The Romantic Revolutionary',
    detail:
      'Rousseau was the Enlightenment\'s most brilliant and most troublesome thinker. His Discourse on Inequality (1755) argued that civilization itself had corrupted humanity — that "man is born free, and everywhere he is in chains." His Social Contract (1762) proposed that legitimate government must express the "general will" of the people, a concept that inspired both democratic revolutionaries and totalitarian dictators. His novel Émile revolutionized education; his Confessions invented modern autobiography. Paranoid, quarrelsome, and hypocritical (he abandoned all five of his children to foundling homes), Rousseau was nonetheless prophetic: his critique of pure rationalism anticipated Romanticism, and his political ideas helped ignite the French Revolution.',
  },
  {
    label: 'Montesquieu (1689–1755) — The Architect of Modern Government',
    detail:
      'Charles-Louis de Secondat, Baron de Montesquieu, wrote The Spirit of the Laws (1748), arguably the most influential political treatise of the 18th century. His central insight — that political liberty requires the separation of executive, legislative, and judicial powers, each checking the others — became the structural blueprint of the United States Constitution. Madison, Hamilton, and Jay cited Montesquieu more than any other philosopher in the Federalist Papers. His comparative approach to politics — studying governments across cultures and climates — pioneered political science as a discipline. No single thinker did more to shape the institutional architecture of modern democracy.',
  },
  {
    label: 'Denis Diderot (1713–1784) — The Encyclopedist',
    detail:
      'Diderot spent 25 years of his life on the most ambitious intellectual project of the century: the Encyclopédie, ou dictionnaire raisonné des sciences, des arts et des métiers — 28 volumes compiling the sum of human knowledge, from anatomy to zinc-working. It was far more than a reference work: under the guise of neutral description, Diderot and his contributors systematically undermined religious authority, celebrated artisanal knowledge over aristocratic privilege, and promoted scientific thinking. The French government banned it. The Church condemned it. It was smuggled across Europe in secret. It sold 25,000 copies — an extraordinary number for the era — and became the Enlightenment\'s most powerful weapon.',
  },
];

// ── British Enlightenment ───────────────────────────────────────────────────

const BRITISH_ENLIGHTENMENT: InsightEntry[] = [
  {
    label: 'John Locke (1632–1704) — The Father of Liberalism',
    detail:
      'Locke\'s Two Treatises of Government (1689) provided the philosophical foundation for modern liberal democracy: government by consent, natural rights, and the right of revolution. His Essay Concerning Human Understanding (1689) argued that the mind at birth is a tabula rasa (blank slate), that all knowledge comes from experience, and that there are no innate ideas — demolishing the philosophical basis for claims of innate superiority. His Letter Concerning Toleration made the case for religious freedom. No single philosopher had a greater influence on the American founders: Jefferson called Locke one of "the three greatest men that have ever lived."',
  },
  {
    label: 'David Hume (1711–1776) — The Great Skeptic',
    detail:
      'Hume was the Enlightenment\'s most radical philosopher — so radical that his contemporaries often couldn\'t absorb his arguments. He demonstrated that cause and effect is not a logical certainty but a habit of mind; that there is no rational basis for believing in miracles; that the self is not a fixed entity but a "bundle of perceptions"; and that moral judgments come from sentiment, not reason. His Dialogues Concerning Natural Religion (published posthumously because even the fearless Hume thought it too dangerous) dismantled the arguments for God\'s existence with devastating precision. Kant said Hume "awakened me from my dogmatic slumber." He remains the most important philosopher in the English language.',
  },
  {
    label: 'Adam Smith (1723–1790) — The Inventor of Economics',
    detail:
      'Smith\'s An Inquiry into the Nature and Causes of the Wealth of Nations (1776) — published, by coincidence, the same year as the Declaration of Independence — invented modern economics. His key insights: the division of labor dramatically increases productivity; free markets coordinate economic activity through the "invisible hand" of self-interest; and trade between nations benefits both parties (overturning mercantilism). But Smith was no laissez-faire fundamentalist: he recognized market failures, argued for public education and infrastructure, and warned that businessmen "seldom meet together, even for merriment and diversion, but the conversation ends in a conspiracy against the public." His moral philosophy, in The Theory of Moral Sentiments (1759), grounded ethics in human sympathy.',
  },
  {
    label: 'Mary Wollstonecraft (1759–1797) — Enlightenment Applied to Women',
    detail:
      'Wollstonecraft\'s A Vindication of the Rights of Woman (1792) was the logical extension of Enlightenment principles that most Enlightenment men refused to make. If all human beings possess reason, and if rights derive from reason, then women — who possess reason equally — deserve equal rights and education. She demolished Rousseau\'s argument that women should be educated only to please men: "I do not wish [women] to have power over men; but over themselves." Scorned in her lifetime and after (her husband\'s posthumous memoir revealing her love affairs and suicide attempts was used to discredit her), Wollstonecraft is now recognized as the founder of modern feminism and the most important female philosopher of the 18th century.',
  },
];

// ── German Enlightenment ────────────────────────────────────────────────────

const GERMAN_ENLIGHTENMENT: InsightEntry[] = [
  {
    label: 'Immanuel Kant (1724–1804) — The Philosopher Who Changed Everything',
    detail:
      'Kant never traveled more than 50 miles from his hometown of Königsberg, but his mind traveled further than any of his contemporaries. His Critique of Pure Reason (1781) resolved the central philosophical dispute of the Enlightenment — between rationalists (who believed knowledge comes from reason alone) and empiricists (who believed it comes from experience alone) — by arguing that the mind actively structures experience through innate categories. His moral philosophy centered on the "categorical imperative": act only according to principles you could will to be universal laws. His essay "What Is Enlightenment?" (1784) gave the movement its definition and its motto. Along with Plato and Aristotle, Kant is one of the three most influential philosophers in Western history.',
  },
  {
    label: 'Gottfried Wilhelm Leibniz (1646–1716) — The Universal Genius',
    detail:
      'Leibniz co-invented calculus (independently of Newton, sparking a legendary priority dispute), built the first mechanical calculator that could add, subtract, multiply, and divide, pioneered binary arithmetic (the foundation of all modern computing), and developed a philosophical system of "monads" — indivisible units of reality — that anticipated aspects of modern physics. His philosophical optimism (this is "the best of all possible worlds") was famously satirized by Voltaire in Candide, but his contributions to mathematics, logic, and philosophy were enormous. He also envisioned a universal language of logic — a dream that would eventually be realized, in a sense, by computer programming languages.',
  },
  {
    label: 'Gotthold Ephraim Lessing (1729–1781) — Champion of Tolerance',
    detail:
      'Lessing was Germany\'s leading Enlightenment dramatist and critic. His play Nathan the Wise (1779) — set during the Crusades and featuring a wise Jewish merchant, a Muslim sultan, and a Christian knight — was the most powerful literary argument for religious tolerance produced in the German language. Its central parable of the three rings — representing Judaism, Christianity, and Islam — argued that no religion can prove it is the true one, so all should live in mutual respect. In an age when Jews faced systematic discrimination across Europe, Lessing\'s friendship with the Jewish philosopher Moses Mendelssohn was itself a radical act.',
  },
  {
    label: 'Moses Mendelssohn (1729–1786) — The Jewish Enlightenment',
    detail:
      'Mendelssohn was the leading figure of the Haskalah — the Jewish Enlightenment — which sought to integrate Jewish communities into European intellectual life while preserving Jewish identity. His book Jerusalem (1783) argued for the separation of church and state and for religious tolerance, drawing on both Jewish and Enlightenment traditions. He translated the Torah into German (in Hebrew characters) to bridge the two cultures. Mendelssohn proved, simply by existing as a respected philosopher, that the Enlightenment\'s promise of universal humanity could include Europe\'s most persecuted minority. He was the grandfather of the composer Felix Mendelssohn.',
  },
];

// ── Scottish Enlightenment ──────────────────────────────────────────────────

const SCOTTISH_ENLIGHTENMENT: InsightEntry[] = [
  {
    label: 'Edinburgh: The Athens of the North',
    detail:
      'In the second half of the 18th century, Edinburgh — a city of barely 50,000 people — produced an extraordinary concentration of genius: David Hume (philosophy), Adam Smith (economics), James Watt (steam engine), Joseph Black (chemistry), James Hutton (geology), Robert Burns (poetry), Adam Ferguson (sociology), Dugald Stewart (philosophy), and William Robertson (history). Voltaire declared: "We look to Scotland for all our ideas of civilization." How did a small, cold, poor nation on Europe\'s periphery produce such a burst of intellectual energy? The answer lies in Scotland\'s exceptional educational system — four universities, high literacy rates, and a culture that valued learning over birth.',
  },
  {
    label: 'The Practical Enlightenment',
    detail:
      'The Scottish Enlightenment was distinctive in its emphasis on practical application. Where French philosophes debated abstract principles and German philosophers built metaphysical systems, the Scots asked: how does this help? Adam Smith didn\'t just theorize about markets — he studied pin factories. James Watt didn\'t just discuss thermodynamics — he built engines. James Hutton didn\'t just philosophize about time — he read it in rocks. The Scottish approach combined philosophical rigor with empirical investigation and practical engineering, producing what we now call "applied science." This practical bent would profoundly influence the American Enlightenment, particularly through Benjamin Franklin and Thomas Jefferson.',
  },
  {
    label: 'The Science of Man',
    detail:
      'The Scottish thinkers pioneered what Hume called "the science of man" — the systematic study of human nature, society, and history using the same empirical methods that Newton applied to physics. Adam Ferguson\'s Essay on the History of Civil Society (1767) is sometimes called the first work of sociology. Smith\'s Theory of Moral Sentiments grounded ethics in human psychology. Hume\'s studies of human cognition anticipated modern cognitive science. This ambition — to create a rigorous science of human affairs — was uniquely Scottish and remains one of the Enlightenment\'s most important legacies.',
  },
  {
    label: 'Clubs, Societies, and Conversation',
    detail:
      'The Scottish Enlightenment was powered by a dense network of intellectual clubs and societies: the Select Society, the Poker Club, the Oyster Club, the Royal Society of Edinburgh. These gatherings brought together professors, lawyers, merchants, ministers, and gentlemen in an atmosphere of free intellectual exchange. Hume, Smith, Ferguson, Black, and Hutton were all members of overlapping clubs. The tradition of structured debate and interdisciplinary conversation — what we would now call "cross-pollination" — was central to Scotland\'s intellectual productivity and offers lessons for how innovation happens.',
  },
];

// ── The Encyclopédie ────────────────────────────────────────────────────────

const ENCYCLOPEDIE_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Most Dangerous Book in France',
    detail:
      'When Diderot and d\'Alembert began the Encyclopédie in 1751, it was commissioned as a simple French translation of Ephraim Chambers\' English Cyclopaedia. It became something far more radical: a 28-volume, 71,818-article, 3,129-illustration compendium that systematically challenged the intellectual authority of the Catholic Church and the French monarchy. Under the cover of neutral, factual articles, the Encyclopédie promoted reason, science, and tolerance — and subtly (and sometimes not so subtly) mocked superstition, religious dogma, and arbitrary authority. The French government suppressed it twice. The Pope condemned it. It was the most subversive publishing project in European history.',
  },
  {
    label: 'Knowledge as Liberation',
    detail:
      'The Encyclopédie\'s revolutionary insight was that knowledge itself is power — and that making knowledge accessible to everyone undermines the authority of those who claim a monopoly on truth. By including detailed articles on trades and crafts alongside philosophy and science, Diderot elevated artisanal knowledge to the level of aristocratic learning. A locksmith\'s knowledge of metallurgy was presented as worthy of the same respect as a theologian\'s knowledge of scripture. This was profoundly egalitarian: it implied that the craftsman\'s practical reason was as valuable as the scholar\'s abstract reason.',
  },
  {
    label: '150 Contributors, 25 Years',
    detail:
      'The Encyclopédie took 25 years to complete (1751–1772) and involved over 150 contributors, including some of the greatest minds of the age: Voltaire wrote articles on history and literature, Rousseau on music, d\'Holbach on chemistry and mineralogy, Montesquieu on political theory, and the Chevalier de Jaucourt — the unsung hero — wrote an astonishing 17,266 articles (nearly a quarter of the total). Diderot himself wrote articles on everything from philosophy to stocking-frame knitting. The project nearly destroyed Diderot\'s health and finances, but it survived censorship, betrayal (his publisher secretly expurgated controversial articles), and government suppression.',
  },
  {
    label: 'A Blueprint for Wikipedia',
    detail:
      'The Encyclopédie established the template that every general encyclopedia since has followed: comprehensive coverage, alphabetical arrangement, cross-references, expert contributors, and illustrations. Its ambition — to compile the entirety of human knowledge in a single accessible work — is the same ambition that drives Wikipedia today. Jimmy Wales, Wikipedia\'s co-founder, has explicitly cited the Encyclopédie as an inspiration. The difference: Diderot needed 150 experts and 25 years; Wikipedia uses millions of volunteers and updates in real time. But the dream is the same: democratize knowledge, and you democratize power.',
  },
];

// ── Enlightenment Salons ────────────────────────────────────────────────────

const SALON_INSIGHTS: InsightEntry[] = [
  {
    label: 'Women as Intellectual Gatekeepers',
    detail:
      'In an age when women were excluded from universities, academies, and political life, the salon was the one intellectual institution they controlled. Salonnières — the women who hosted salons — determined who was invited, what was discussed, and what ideas were promoted. They were not passive hostesses but active intellectual participants and patrons who shaped the Enlightenment\'s agenda. Without the salons, the Enlightenment\'s ideas would have circulated far more slowly and reached far fewer people. The salon was, in effect, the Enlightenment\'s social media platform — and women ran it.',
  },
  {
    label: 'Marie Thérèse Rodet Geoffrin (1699–1777)',
    detail:
      'Madame Geoffrin ran the most important salon in Paris for three decades (1740s–1770s). Her Monday dinners for artists and Wednesday dinners for philosophes were the premier intellectual gathering in Europe. Diderot, d\'Alembert, Montesquieu, and visiting luminaries like David Hume and Benjamin Franklin attended. She financed the Encyclopédie when official funds dried up and corresponded with Catherine the Great and King Stanisław of Poland. Born bourgeoise (not aristocratic), she demonstrated that intellectual merit could trump birth — an Enlightenment principle embodied in her own life.',
  },
  {
    label: 'Suzanne Necker (1737–1794)',
    detail:
      'Suzanne Necker — wife of the French finance minister Jacques Necker and mother of Madame de Staël — hosted one of the most politically influential salons of the pre-revolutionary period. Her Friday salon brought together philosophes and politicians, creating a space where Enlightenment ideas directly shaped government policy. She was also a pioneer of hospital reform, founding the Hospice de Charité (later the Necker Hospital, which still exists). Her daughter, Germaine de Staël, would become one of the most important intellectuals of the early 19th century and Napoleon\'s most formidable opponent.',
  },
  {
    label: 'Madame du Deffand and Julie de Lespinasse',
    detail:
      'Marie de Vichy-Chamrond, Marquise du Deffand, ran a salon that was the social center of Parisian intellectual life for decades. When she went blind, her companion Julie de Lespinasse — brilliant, charismatic, and encyclopedically well-read — began hosting a rival salon that attracted many of du Deffand\'s former guests, including d\'Alembert (who became her devoted companion). The split between the two salons was one of the great social dramas of the Enlightenment, but both contributed enormously to the circulation of ideas. Lespinasse\'s salon, in particular, was known for its intense philosophical discussions and its role in promoting the Encyclopédie.',
  },
];

// ── Political Applications ──────────────────────────────────────────────────

const POLITICAL_TIMELINE: TimelineEntry[] = [
  {
    year: '1776',
    title: 'The American Revolution — The Enlightenment Made Real',
    description:
      'The Declaration of Independence is the Enlightenment compressed into a single document. "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights" — this is Locke\'s natural rights theory, rewritten by Jefferson into the most famous sentence in political history. Montesquieu\'s separation of powers became the Constitution\'s structure. The Bill of Rights enacted Enlightenment principles of religious freedom, free speech, and due process. The American experiment was proof of concept: Enlightenment ideas could actually govern a nation.',
    color: BLUE,
  },
  {
    year: '1789',
    title: 'The French Revolution — Enlightenment Ideas Weaponized',
    description:
      'The French Revolution began with the Declaration of the Rights of Man and of the Citizen (1789) — an explicitly Enlightenment document modeled on Locke, Montesquieu, and Rousseau. Liberté, égalité, fraternité. But the Revolution quickly demonstrated the dark potential of Enlightenment rationalism: the Reign of Terror (1793–94), in which Robespierre sent 17,000 to the guillotine in the name of "virtue" and "reason," showed that reason unchecked by institutional restraint could be as tyrannical as any king. The Revolution\'s trajectory — from Enlightenment idealism to revolutionary terror to Napoleonic dictatorship — haunted political thought for centuries.',
    color: CRIMSON,
  },
  {
    year: '1791',
    title: 'The Haitian Revolution — The Enlightenment\'s Most Radical Test',
    description:
      'When enslaved people in Saint-Domingue (Haiti) rose in revolt in 1791, they took the Enlightenment at its word: if all men are created equal, then slavery is an abomination. Toussaint Louverture, a formerly enslaved man who had read Rousseau and the Abbé Raynal, led the revolution that created the first free Black republic in the Western Hemisphere (1804). The Haitian Revolution was the ultimate test of whether "universal rights" meant universal — and the answer from the Enlightenment powers (France, Britain, the US) was largely no. Haiti was punished for its freedom with diplomatic isolation and crippling debt. The hypocrisy exposed the Enlightenment\'s deepest contradiction.',
    color: GOLD,
  },
  {
    year: '1810s–1820s',
    title: 'Latin American Independence — Bolívar Reads Rousseau',
    description:
      'Simón Bolívar, José de San Martín, and the other liberators of Latin America were steeped in Enlightenment thought. Bolívar\'s famous Jamaica Letter (1815) cited Montesquieu, Rousseau, and the French Declaration of the Rights of Man. The constitutions of the new Latin American republics were modeled on Enlightenment principles: separation of powers, individual rights, popular sovereignty. But the region\'s colonial legacies — vast inequality, racial hierarchy, weak institutions — meant that Enlightenment ideals collided with entrenched realities, producing a pattern of democratic aspiration and authoritarian relapse that continues to this day.',
    color: TEAL,
  },
];

// ── Counter-Enlightenment ───────────────────────────────────────────────────

const COUNTER_INSIGHTS: InsightEntry[] = [
  {
    label: 'Edmund Burke (1729–1797) — The Conservative Critique',
    detail:
      'Burke\'s Reflections on the Revolution in France (1790) — written before the Terror, but prophetically anticipating it — became the founding text of modern conservatism. Burke didn\'t reject reason; he rejected the Enlightenment\'s faith that reason alone could redesign society from scratch. Traditions, customs, and inherited institutions, Burke argued, embody the accumulated wisdom of generations — a wisdom that abstract rationalism cannot replicate. Tearing down institutions because they seem "irrational" destroys the social fabric. Burke\'s critique — that the Enlightenment underestimated the complexity of human societies — remains the most powerful conservative argument against radical reform.',
  },
  {
    label: 'Johann Gottfried Herder (1744–1803) — Culture Against Universalism',
    detail:
      'Herder challenged the Enlightenment\'s universalism with the concept of Volksgeist — the unique spirit of each people expressed in language, folklore, and custom. Where the philosophes saw universal reason, Herder saw irreducible cultural diversity. Each culture, he argued, should be understood on its own terms, not measured against a French or English standard. This was a powerful corrective to Enlightenment arrogance, but it also planted the seed of romantic nationalism — the idea that each "people" has a unique destiny — which would fuel both liberation movements and, eventually, some of the 20th century\'s most destructive ideologies.',
  },
  {
    label: 'Joseph de Maistre (1753–1821) — The Reactionary',
    detail:
      'De Maistre represented the most extreme Counter-Enlightenment position: the French Revolution proved that human reason is too weak and corrupt to govern society. Only divine authority — embodied in the Pope and hereditary monarchy — can maintain social order. His defense of the executioner as the foundation of social order was deliberately provocative. De Maistre was brilliant, ruthless, and often prophetic: his warnings about the violence inherent in revolutionary utopianism anticipated the horrors of the 20th century. His thought influenced authoritarians from Napoleon III to 20th-century fascist intellectuals.',
  },
  {
    label: 'Romanticism — The Revolt of Feeling',
    detail:
      'The Romantic movement (late 18th–mid 19th century) was the broadest and most enduring Counter-Enlightenment response. Where the Enlightenment celebrated reason, the Romantics exalted emotion, imagination, and individual experience. Where the Enlightenment sought universal laws, the Romantics cherished the particular, the local, and the unique. Wordsworth, Goethe, Blake, Shelley, Beethoven, Delacroix — the Romantics didn\'t reject the Enlightenment entirely (many were political radicals), but they insisted that human life cannot be reduced to rational calculation. The tension between Enlightenment rationalism and Romantic expressiveness remains one of the defining polarities of modern culture.',
  },
];

// ── Legacy ──────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Modern Democracy',
    detail:
      'Every modern democracy is built on Enlightenment foundations: popular sovereignty, natural rights, separation of powers, constitutional government, religious freedom, free speech. The institutions we take for granted — elected legislatures, independent courts, bills of rights, free press — were Enlightenment inventions. Before 1689, no nation on Earth had a government based on these principles. By 2024, more than half the world\'s population lives under some form of democratic governance. The distance between those two facts is the measure of the Enlightenment\'s achievement.',
  },
  {
    label: 'Human Rights',
    detail:
      'The Universal Declaration of Human Rights (1948) — drafted by Eleanor Roosevelt, René Cassin, and others in the wake of the Holocaust — is a direct descendant of the Enlightenment\'s natural rights tradition. Every article can be traced to ideas articulated by Locke, Voltaire, Wollstonecraft, Kant, or their contemporaries. The very concept that human beings have rights simply by virtue of being human — not because of their nationality, religion, race, or sex — is an Enlightenment idea. It remains the most powerful idea in global politics.',
  },
  {
    label: 'The Scientific Method',
    detail:
      'The Enlightenment didn\'t invent science, but it created the institutional and cultural conditions that made modern science possible: academies, journals, public funding, the prestige of empirical investigation, and the principle that claims must be tested against evidence rather than accepted on authority. The Royal Society\'s motto — Nullius in verba, "take nobody\'s word for it" — captures the Enlightenment\'s scientific ethos. From Newton to Darwin to Einstein to the COVID vaccine, the scientific enterprise is the Enlightenment\'s most practically consequential legacy.',
  },
  {
    label: 'Public Education',
    detail:
      'The Enlightenment\'s faith that education could improve both individuals and society led directly to the creation of public education systems. If knowledge comes from experience (Locke) and human nature is malleable, then education can transform society. Condorcet proposed a comprehensive public education system during the French Revolution. Prussia implemented compulsory education in the 18th century. By the late 19th century, universal public education had become standard across the Western world. The idea that every child deserves an education — regardless of birth or wealth — is an Enlightenment legacy.',
  },
  {
    label: 'Secular Government',
    detail:
      'The Enlightenment\'s insistence on separating religious and political authority created the secular state — a form of government that neither promotes nor persecutes any religion. This was not anti-religious (many Enlightenment thinkers were deists or Christians); it was a practical response to centuries of religious warfare. The secular state protects religious freedom by keeping the government out of matters of conscience. The First Amendment, the French laïcité, and Article 18 of the Universal Declaration of Human Rights all embody this Enlightenment principle.',
  },
  {
    label: 'The Unfinished Project',
    detail:
      'The philosopher Jürgen Habermas called the Enlightenment "an unfinished project" — and it is. Its ideals of universal rights, rational governance, and human progress remain aspirational rather than achieved. Racism, authoritarianism, inequality, and irrationalism persist. The Enlightenment\'s own blind spots — its complicity with colonialism, its frequent exclusion of women and non-Europeans, its sometimes naive faith in progress — are legitimate criticisms. But the tools for criticizing the Enlightenment are themselves Enlightenment tools: reason, evidence, universal moral principles. That is perhaps the movement\'s most remarkable achievement: it created a framework that could correct its own mistakes.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Voltaire',
    years: '1694–1778',
    contribution:
      'The Enlightenment\'s most famous voice. Satirist, historian, playwright, and crusader for religious tolerance. Candide, the Calas affair, 20,000 letters. Made reason entertaining and intolerance shameful.',
  },
  {
    name: 'John Locke',
    years: '1632–1704',
    contribution:
      'Father of liberalism. Natural rights, government by consent, tabula rasa, religious tolerance. The single most important intellectual influence on the American founding.',
  },
  {
    name: 'Immanuel Kant',
    years: '1724–1804',
    contribution:
      'Resolved the rationalism-empiricism debate with the Critique of Pure Reason. Categorical imperative. "What Is Enlightenment?" Defined and culminated the movement.',
  },
  {
    name: 'Jean-Jacques Rousseau',
    years: '1712–1778',
    contribution:
      'Social contract, general will, "Man is born free." Romantic critique of rationalism. Émile revolutionized education. Inspired the French Revolution — for better and worse.',
  },
  {
    name: 'Montesquieu',
    years: '1689–1755',
    contribution:
      'Separation of powers. The Spirit of the Laws influenced every modern constitution. Pioneered comparative political science.',
  },
  {
    name: 'David Hume',
    years: '1711–1776',
    contribution:
      'Radical skeptic: cause-and-effect as mental habit, no rational basis for miracles, the self as "bundle of perceptions." Awakened Kant from his "dogmatic slumber."',
  },
  {
    name: 'Adam Smith',
    years: '1723–1790',
    contribution:
      'Invented modern economics. Wealth of Nations: division of labor, invisible hand, free trade. Also a moral philosopher: sympathy as the basis of ethics.',
  },
  {
    name: 'Denis Diderot',
    years: '1713–1784',
    contribution:
      'Editor of the Encyclopédie — 25 years, 28 volumes, 150 contributors. The most ambitious and subversive publishing project in European history.',
  },
  {
    name: 'Mary Wollstonecraft',
    years: '1759–1797',
    contribution:
      'A Vindication of the Rights of Woman — applied Enlightenment universalism to gender. Founded modern feminism. "I do not wish women to have power over men; but over themselves."',
  },
  {
    name: 'Benjamin Franklin',
    years: '1706–1790',
    contribution:
      'The American Enlightenment personified: scientist, inventor, printer, diplomat, constitution-maker. Proved that lightning is electrical. Celebrity philosophe in Paris.',
  },
  {
    name: 'Thomas Jefferson',
    years: '1743–1826',
    contribution:
      'Author of the Declaration of Independence — the Enlightenment\'s most consequential document. Champion of religious freedom, education, and reason. Also a slaveholder — the Enlightenment\'s deepest contradiction.',
  },
  {
    name: 'Marquis de Condorcet',
    years: '1743–1794',
    contribution:
      'Mathematician, early advocate for women\'s rights and abolition. Wrote the most optimistic Enlightenment vision of progress — while in hiding from the Terror. Died in prison.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Reusable components
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
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      style={{ marginBottom: 48 }}
    >
      <h2
        style={{
          fontSize: '1.6rem',
          fontWeight: 700,
          marginBottom: 14,
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
          fontSize: '0.98rem',
          maxWidth: 820,
          marginBottom: 20,
        }}
      >
        {intro}
      </p>
      {children}
    </motion.section>
  );
}

function TimelineCard({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {entries.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
            paddingBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: e.color,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {e.year}
          </span>
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

const FIGURE_COLORS = [GOLD, BLUE, INDIGO, TEAL, GREEN, ROSE, PURPLE, AMBER, CRIMSON, SKY, WINE, SAGE];

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

export default function EnlightenmentPage() {
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
        backgroundColor: '#0a0e1a',
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
              background: `linear-gradient(135deg, ${GOLD}, ${INDIGO})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Enlightenment — When Reason Became a Revolutionary Act (1685–1815)
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
              The ideas that created modern democracy, human rights, and science
              as we know them. For 130 years, a handful of philosophers, scientists,
              and writers dared to question everything — monarchy, religion,
              tradition, the very nature of knowledge — and in doing so, they
              built the intellectual foundations of the modern world.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              From Locke's natural rights to Voltaire's satirical crusades,
              from Kant's categorical imperative to Wollstonecraft's vindication
              of women — the Enlightenment asked a simple, dangerous question:
              What if we governed ourselves by reason instead of tradition?
              The answer reshaped civilization.
            </p>
          </motion.div>
        </header>

        {/* ── What Was the Enlightenment ─────────────────────────────── */}
        <SectionWrapper
          id="what-was"
          icon="💡"
          title="What Was the Enlightenment?"
          accentColor={GOLD}
          intro="Sapere aude — dare to know. The Enlightenment was not a single event but a sustained intellectual revolution: the insistence that reason, evidence, and individual judgment — not tradition, authority, or revelation — should be the basis of human knowledge, government, and morality. It was, in Kant's words, 'man's emergence from his self-imposed immaturity.'"
        >
          <InsightGrid items={WHAT_WAS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Precursors ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="precursors"
          icon="🔭"
          title="Precursors — What Made the Enlightenment Possible"
          accentColor={BLUE}
          intro="The Enlightenment did not appear from nowhere. It was built on the rubble of old certainties shattered by three transformative forces: the Scientific Revolution (which proved that the universe follows rational laws), the Reformation (which broke the Church's monopoly on truth), and the discovery of the Americas (which revealed that the world was far larger and stranger than Europeans had imagined)."
        >
          <TimelineCard entries={PRECURSORS_TIMELINE} />
        </SectionWrapper>

        {/* ── Core Ideas ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="core-ideas"
          icon="📜"
          title="Eight Ideas That Changed the World"
          accentColor={AMBER}
          intro="The Enlightenment produced a constellation of ideas so powerful that virtually every modern political, scientific, and moral institution rests on them. These eight core concepts — from the sovereignty of reason to the universality of human rights — form the intellectual architecture of the world we live in."
        >
          <InsightGrid items={CORE_IDEAS} />
        </SectionWrapper>

        {/* ── French Philosophes ──────────────────────────────────────── */}
        <SectionWrapper
          id="french-philosophes"
          icon="🇫🇷"
          title="The French Philosophes — Reason's Shock Troops"
          accentColor={CRIMSON}
          intro="France was the Enlightenment's epicenter. The philosophes — a loose network of writers, thinkers, and provocateurs centered in Paris — were the movement's most visible and combative champions. They wrote plays and novels, edited encyclopedias, corresponded with monarchs, and got themselves imprisoned, exiled, and censored — all in the service of reason against superstition and liberty against tyranny."
        >
          <InsightGrid items={FRENCH_PHILOSOPHES} />
        </SectionWrapper>

        {/* ── British Enlightenment ──────────────────────────────────── */}
        <SectionWrapper
          id="british"
          icon="🇬🇧"
          title="The British Enlightenment — Empiricism and Liberty"
          accentColor={INDIGO}
          intro="The British Enlightenment was quieter than the French — less dramatic, less revolutionary, but arguably more foundational. Where French thinkers fought the Church and the monarchy, British thinkers built the philosophical systems — empiricism, liberalism, free-market economics, and the rights of women — that would shape the modern world. Locke, Hume, Smith, and Wollstonecraft: four thinkers who changed everything."
        >
          <InsightGrid items={BRITISH_ENLIGHTENMENT} />
        </SectionWrapper>

        {/* ── German Enlightenment ───────────────────────────────────── */}
        <SectionWrapper
          id="german"
          icon="🇩🇪"
          title="The German Enlightenment (Aufklärung)"
          accentColor={PURPLE}
          intro="The German Enlightenment — the Aufklärung — was more philosophical and systematic than its French and British counterparts. Where the French wrote essays and novels, and the British wrote treatises on politics and economics, the Germans built grand philosophical systems. Kant, Leibniz, Lessing, and Mendelssohn represent the Aufklärung's range: from the deepest metaphysics to the most passionate advocacy of religious tolerance."
        >
          <InsightGrid items={GERMAN_ENLIGHTENMENT} />
        </SectionWrapper>

        {/* ── Scottish Enlightenment ─────────────────────────────────── */}
        <SectionWrapper
          id="scottish"
          icon="🏴󠁧󠁢󠁳󠁣󠁴󠁿"
          title="The Scottish Enlightenment — Athens of the North"
          accentColor={TEAL}
          intro="Edinburgh in the late 18th century was the most intellectually productive city on Earth per capita. The Scottish Enlightenment combined philosophical rigor with practical application, producing modern economics (Smith), radical philosophy (Hume), the steam engine (Watt), modern geology (Hutton), and the foundations of social science — all from a small, cold nation on Europe's northern edge."
        >
          <InsightGrid items={SCOTTISH_ENLIGHTENMENT} />
        </SectionWrapper>

        {/* ── The Encyclopédie ───────────────────────────────────────── */}
        <SectionWrapper
          id="encyclopedie"
          icon="📚"
          title="The Encyclopédie (1751–1772) — 28 Volumes That Shook the World"
          accentColor={COPPER}
          intro="Diderot's Encyclopédie was the Enlightenment's most ambitious single project: a 28-volume attempt to compile all human knowledge, from philosophy to pin-making. It was banned by the French government, condemned by the Pope, smuggled across Europe, and sold 25,000 copies. Under the guise of a neutral reference work, it systematically undermined religious authority and promoted scientific thinking. It was the most subversive publication in European history — and the direct ancestor of Wikipedia."
        >
          <InsightGrid items={ENCYCLOPEDIE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Enlightenment Salons ───────────────────────────────────── */}
        <SectionWrapper
          id="salons"
          icon="🕯️"
          title="The Salons — Women Who Ran the Enlightenment's Living Rooms"
          accentColor={ROSE}
          intro="In an age that excluded women from universities, academies, and political office, the salon was the one intellectual institution women controlled. The salonnières of Paris — Madame Geoffrin, Suzanne Necker, Madame du Deffand, Julie de Lespinasse — hosted the gatherings where philosophes debated, reputations were made, and ideas spread across Europe. The Enlightenment's most famous ideas were refined not in lecture halls but in drawing rooms run by women."
        >
          <InsightGrid items={SALON_INSIGHTS} />
        </SectionWrapper>

        {/* ── Political Applications ─────────────────────────────────── */}
        <SectionWrapper
          id="political"
          icon="⚔️"
          title="Political Revolutions — When Ideas Became Action"
          accentColor={BLUE}
          intro="The Enlightenment was not merely an intellectual exercise — it was a program for political transformation. Its ideas directly inspired the American Revolution, the French Revolution, the Haitian Revolution, and the liberation of Latin America. In each case, Enlightenment principles — natural rights, popular sovereignty, separation of powers — were translated into declarations, constitutions, and revolutions. The results were both glorious and terrible."
        >
          <TimelineCard entries={POLITICAL_TIMELINE} />
        </SectionWrapper>

        {/* ── Counter-Enlightenment ──────────────────────────────────── */}
        <SectionWrapper
          id="counter"
          icon="🌊"
          title="The Counter-Enlightenment — When Tradition Fights Back"
          accentColor={WINE}
          intro="The Enlightenment provoked a powerful backlash. Conservatives like Burke argued that abstract reason cannot replace the accumulated wisdom of tradition. Romantics like Herder and Wordsworth insisted that human life cannot be reduced to rational calculation. Reactionaries like de Maistre demanded a return to throne and altar. The Counter-Enlightenment was not simply wrong — its best arguments identified genuine blind spots in Enlightenment thinking. The tension between reason and tradition, universalism and particularity, progress and conservation remains unresolved."
        >
          <InsightGrid items={COUNTER_INSIGHTS} />
        </SectionWrapper>

        {/* ── Legacy ─────────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🌍"
          title="Legacy — The World the Enlightenment Built"
          accentColor={GREEN}
          intro="Modern democracy, human rights, the scientific method, public education, secular government, religious tolerance, free markets, the concept of progress itself — virtually everything that defines the modern world traces back to ideas articulated during the Enlightenment. No other intellectual movement has had a comparable impact on human civilization. Its work remains unfinished, its ideals imperfectly realized, its contradictions unresolved — but its legacy is the world we live in."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures of the Enlightenment"
          accentColor={GOLD}
          intro="The Enlightenment was made by individuals — philosophers, scientists, writers, and activists who dared to think for themselves and challenged their contemporaries to do the same. These are the people whose ideas built the modern world."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Footer ─────────────────────────────────────────────────── */}
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
            "Sapere aude! Have courage to use your own understanding!"
            — Immanuel Kant, "What Is Enlightenment?" (1784)
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
