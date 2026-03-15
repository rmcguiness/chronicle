/**
 * EconomicThoughtPage — comprehensive deep-dive on the history of economic thought.
 *
 * Route: /economic-thought
 *
 * Sections:
 *  1. Hero — headline, framing
 *  2. Pre-modern economics — Aristotle, medieval Church, mercantilism
 *  3. Classical economics (1776–1870) — Smith, Malthus, Ricardo, Mill
 *  4. Karl Marx and Das Kapital — labor theory of value, historical materialism
 *  5. The Marginalist Revolution (1870s) — Jevons, Menger, Walras
 *  6. Neoclassical economics (1870–1930) — mathematical models, rational actors
 *  7. John Maynard Keynes — General Theory, demand-side economics
 *  8. The Chicago School and Monetarism — Friedman, Hayek, Thatcher/Reagan
 *  9. Behavioral economics — Kahneman, Tversky, Thaler
 * 10. Modern debates — Piketty, MMT, post-2008, degrowth
 * 11. Key figures gallery
 * 12. Open questions — challenges & achievements
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
const EMERALD = '#10b981';

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

// ── Pre-modern economics ────────────────────────────────────────────────────

const PRE_MODERN: TimelineEntry[] = [
  {
    year: 'c. 350 BCE',
    title: 'Aristotle — Natural vs Unnatural Wealth',
    description:
      'In his Politics and Nicomachean Ethics, Aristotle distinguished between "oikonomia" (household management, the natural art of acquiring goods for use) and "chrematistike" (the art of money-making for its own sake). He considered trade acceptable when it served genuine needs but condemned usury — lending money at interest — as "the most hated sort" of wealth acquisition because money "breeds money" unnaturally. This moral framing of economic activity dominated Western thought for nearly two millennia.',
    color: GOLD,
  },
  {
    year: '1200s–1500s',
    title: 'Medieval Scholastics — Just Price and Usury Prohibition',
    description:
      'Thomas Aquinas and the Scholastic economists developed the doctrine of the "just price" — a price that reflected the true value of goods and allowed both buyer and seller to meet their needs without exploitation. The Catholic Church strictly prohibited usury, treating lending at interest as a mortal sin. These restrictions shaped European finance for centuries: banking innovations like bills of exchange were essentially workarounds to avoid usury laws while still enabling credit.',
    color: PURPLE,
  },
  {
    year: '1500–1800',
    title: 'Mercantilism — National Wealth as Gold Stockpile',
    description:
      'Mercantilism was not a single coherent theory but a set of practices that dominated European economic policy for 300 years. Its core ideas: a nation\'s wealth equals its stock of gold and silver; exports should exceed imports (the trade surplus obsession); colonies exist to supply raw materials and buy finished goods; government should actively manage trade through tariffs, monopolies, and navigation acts. It drove the colonial empires of Spain, Portugal, Britain, France, and the Netherlands. Adam Smith would define classical economics largely in opposition to mercantilist thinking.',
    color: ACCENT,
  },
  {
    year: '1600s–1700s',
    title: 'The Physiocrats — Land as the Source of All Wealth',
    description:
      'French economists led by François Quesnay argued that only agriculture produced genuine surplus — manufacturing and trade merely transformed what the land produced. Quesnay\'s "Tableau Économique" (1758) was the first attempt to model the entire economy as an interconnected system of flows. Though their answer was wrong (land isn\'t the only source of value), their method — trying to find natural economic laws — laid the groundwork for classical economics.',
    color: TEAL,
  },
];

// ── Classical economics (1776–1870) ─────────────────────────────────────────

const CLASSICAL: TimelineEntry[] = [
  {
    year: '1776',
    title: 'Adam Smith — "The Wealth of Nations"',
    description:
      'Smith\'s An Inquiry into the Nature and Causes of the Wealth of Nations is the founding text of modern economics. Its key insights: the division of labor dramatically increases productivity (the famous pin factory); individuals pursuing self-interest are "led by an invisible hand" to promote the public good; free trade benefits all nations, not just exporters; the true wealth of a nation is its productive capacity, not its gold reserves. Smith was not the laissez-faire absolutist he\'s often portrayed as — he supported public education, infrastructure, and regulation of banking.',
    color: ACCENT,
  },
  {
    year: '1798',
    title: 'Thomas Malthus — The Population Trap',
    description:
      'In An Essay on the Principle of Population, Malthus argued that population grows geometrically (2, 4, 8, 16...) while food production grows only arithmetically (1, 2, 3, 4...), meaning poverty and famine are inevitable unless population is checked by "preventive checks" (delayed marriage, abstinence) or "positive checks" (disease, war, famine). Was he wrong? Mostly — the Green Revolution and declining birth rates defied his predictions. But his logic influenced Darwin\'s theory of natural selection, and neo-Malthusian concerns about resource limits persist in environmental economics.',
    color: RED,
  },
  {
    year: '1817',
    title: 'David Ricardo — Comparative Advantage and Rent',
    description:
      'Ricardo\'s Principles of Political Economy made two lasting contributions. First, the theory of comparative advantage: even if one country is more efficient at producing everything, both countries benefit from trade when each specializes in what it produces relatively most efficiently. This remains the strongest argument for free trade. Second, the theory of rent: as population grows and less fertile land is cultivated, landlords collect rising rents on better land without doing anything — an early analysis of unearned income that influenced both Mill and Marx.',
    color: GOLD,
  },
  {
    year: '1848',
    title: 'John Stuart Mill — Classical Economics Refined',
    description:
      'Mill\'s Principles of Political Economy synthesized and refined classical economics while pushing it in progressive directions. He distinguished between the laws of production (which he saw as fixed, like physics) and the laws of distribution (which society could choose). He advocated worker cooperatives, women\'s economic rights (decades ahead of his time), progressive taxation, and limits on inheritance. His utilitarian framework — the greatest good for the greatest number — gave economics a moral compass beyond simple efficiency.',
    color: GREEN,
  },
];

// ── Karl Marx ───────────────────────────────────────────────────────────────

const MARX: TimelineEntry[] = [
  {
    year: '1848',
    title: 'The Communist Manifesto',
    description:
      'Marx and Engels published a pamphlet that would reshape world history. Its opening — "A spectre is haunting Europe: the spectre of communism" — announced a theory of history as class struggle: freeman vs slave, lord vs serf, bourgeoisie vs proletariat. It predicted that capitalism\'s internal contradictions would inevitably lead to revolution and a classless society. The Manifesto was more a political program than economics, but it laid the groundwork for Das Kapital.',
    color: RED,
  },
  {
    year: '1867',
    title: 'Das Kapital — The Labor Theory of Value',
    description:
      'Marx\'s magnum opus argued that the value of any commodity is determined by the "socially necessary labor time" required to produce it. Capitalists profit by paying workers less than the value they create — the difference is "surplus value," which Marx saw as systematic exploitation, not entrepreneurial reward. The capitalist accumulates surplus value through lengthening the working day, intensifying labor, or replacing workers with machines.',
    color: RED,
  },
  {
    year: '1867–1894',
    title: 'Historical Materialism — The Engine of History',
    description:
      'Marx proposed that the "material conditions of production" — technology, property relations, class structure — are the foundation on which all politics, law, religion, and culture are built. History follows a dialectical pattern: feudalism → capitalism → socialism → communism. Each stage contains contradictions that eventually destroy it. Capitalism\'s contradictions include the tendency for profit rates to fall, recurrent crises of overproduction, and the progressive immiseration of workers.',
    color: ROSE,
  },
  {
    year: 'Assessment',
    title: 'What Marx Got Right — and What Failed',
    description:
      'Right: Marx brilliantly described worker alienation (feeling disconnected from labor, product, fellow workers, and human potential). He predicted recurring crises of capitalism, concentration of capital in fewer hands, and globalization — all visible today. His analysis of ideology as serving class interests remains influential. Wrong: The predicted revolution occurred in feudal Russia, not advanced capitalist nations. The labor theory of value was superseded by marginalism. Central planning proved far less efficient than market prices at allocating resources. And communist states produced new forms of oppression rather than liberation.',
    color: PURPLE,
  },
];

// ── The Marginalist Revolution ──────────────────────────────────────────────

const MARGINALIST: TimelineEntry[] = [
  {
    year: '1871',
    title: 'William Stanley Jevons — "The Theory of Political Economy"',
    description:
      'Jevons independently developed the concept of marginal utility: the value of a good is not determined by the total labor required to produce it, but by the satisfaction (utility) gained from one additional unit. A diamond is more valuable than water not because it takes more labor to produce, but because the marginal utility of one more diamond (when you have few) far exceeds the marginal utility of one more glass of water (when you have plenty). This resolved the "diamond-water paradox" that had troubled economists since Smith.',
    color: ACCENT,
  },
  {
    year: '1871',
    title: 'Carl Menger — Austrian School Founded',
    description:
      'Working independently in Vienna, Menger developed his own theory of marginal utility and founded the Austrian school of economics. He emphasized that value is subjective — it exists in the mind of the individual, not in the object. He also stressed the importance of time and uncertainty in economic decisions, and developed the theory that money emerged spontaneously through trade rather than by government decree. The Austrian tradition (later continued by Hayek and Mises) would become a major alternative to mainstream economics.',
    color: GOLD,
  },
  {
    year: '1874',
    title: 'Léon Walras — General Equilibrium',
    description:
      'Walras asked: can we prove mathematically that supply and demand across all markets simultaneously reach equilibrium? His system of simultaneous equations showed (under idealized conditions) that all markets are interconnected, and if each individual market clears, general equilibrium exists. This was the beginning of mathematical economics — the use of formal models to reason about economic systems. It also planted the seed for a century-long debate about whether real economies actually tend toward equilibrium.',
    color: TEAL,
  },
];

// ── Neoclassical economics ──────────────────────────────────────────────────

const NEOCLASSICAL: TimelineEntry[] = [
  {
    year: '1890',
    title: 'Alfred Marshall — Supply and Demand Unified',
    description:
      'Marshall\'s Principles of Economics became the standard textbook for a generation. He unified the supply-side emphasis of classical economists with the demand-side insights of the marginalists, creating the familiar supply-and-demand cross diagram still taught in every introductory course. He introduced concepts like elasticity, consumer surplus, and the distinction between short-run and long-run analysis. Marshall made economics look like a science with precise diagrams and mathematical appendices.',
    color: ACCENT,
  },
  {
    year: '1890s–1920s',
    title: 'The Rise of Homo Economicus',
    description:
      'Neoclassical economics built its models on a simplified image of human behavior: "homo economicus" — the rational, self-interested individual who maximizes utility with perfect information and consistent preferences. This abstraction made mathematical modeling possible and produced elegant proofs about market efficiency. But it was always a caricature. Real people are emotional, poorly informed, inconsistent, and influenced by social context — a gap that behavioral economics would eventually exploit.',
    color: GOLD,
  },
  {
    year: '1906',
    title: 'Vilfredo Pareto — Efficiency and Distribution',
    description:
      'Pareto defined "Pareto efficiency" — a situation where no one can be made better off without making someone else worse off. This became the gold standard for evaluating economic outcomes. He also discovered the Pareto distribution: roughly 80% of wealth is owned by 20% of the population (the "80/20 rule"). His concept of Pareto efficiency is powerful but has a critical blind spot — it says nothing about fairness. A society where one person owns everything and everyone else starves can be "Pareto efficient."',
    color: PURPLE,
  },
  {
    year: '1920s–1930s',
    title: 'The Great Depression Exposes Neoclassical Limits',
    description:
      'Neoclassical theory predicted that free markets would self-correct — unemployment was temporary, prices would adjust, and equilibrium would be restored. Then came the Great Depression: by 1933, US unemployment hit 25%, industrial production fell by half, and prices did not adjust downward fast enough to restore equilibrium. The human cost was staggering. Classical economics had no adequate explanation and no policy prescription beyond "wait." The stage was set for Keynes.',
    color: RED,
  },
];

// ── Keynes ───────────────────────────────────────────────────────────────────

const KEYNES: TimelineEntry[] = [
  {
    year: '1936',
    title: 'The General Theory of Employment, Interest and Money',
    description:
      'Keynes\' masterwork was the most influential economics book of the 20th century. Its core argument: in a recession, the economy can get stuck in a "liquidity trap" where businesses won\'t invest because demand is low, and demand is low because people don\'t have jobs. Markets do NOT automatically self-correct. Government must step in to stimulate aggregate demand through spending — even deficit spending. "In the long run we are all dead" was Keynes\' devastating reply to classical economists who said markets would eventually correct themselves.',
    color: ACCENT,
  },
  {
    year: '1933–1945',
    title: 'The New Deal and WWII — Keynesianism Validated',
    description:
      'Roosevelt\'s New Deal programs — public works, Social Security, banking regulation — were partially Keynesian (though not directly inspired by Keynes). But it was WWII that provided the definitive test: massive government spending on the war effort eliminated unemployment, boosted industrial production to record levels, and ended the Depression. The lesson seemed clear: when private demand collapses, government spending can fill the gap. Keynes had been right.',
    color: GREEN,
  },
  {
    year: '1945–1970',
    title: 'The Keynesian Consensus — The Golden Age',
    description:
      'The postwar period was the golden age of managed capitalism. Keynesian ideas shaped policy in virtually every Western nation: governments used fiscal policy (spending and taxation) to smooth the business cycle, maintain full employment, and fund welfare states. Growth was strong, inequality declined, the middle class expanded, and economic crises were mild. Paul Samuelson\'s textbook (1948) enshrined the "neoclassical synthesis" — Keynesian macroeconomics married to neoclassical microeconomics — as the mainstream of the profession.',
    color: TEAL,
  },
  {
    year: '1944',
    title: 'Bretton Woods — Keynes Designs the Global Order',
    description:
      'Keynes was the chief British negotiator at Bretton Woods, where the postwar international monetary system was designed. The system pegged currencies to the US dollar (itself convertible to gold), created the International Monetary Fund and the World Bank, and established managed exchange rates. Keynes wanted an international clearing union with a new global currency ("bancor"), which was too radical for the Americans. But his influence shaped the architecture of global finance for the next 30 years.',
    color: INDIGO,
  },
];

// ── Chicago School and Monetarism ───────────────────────────────────────────

const CHICAGO_SCHOOL: TimelineEntry[] = [
  {
    year: '1962',
    title: 'Milton Friedman — "Capitalism and Freedom"',
    description:
      'Friedman was the most influential economist of the late 20th century. His monetarism argued that inflation is "always and everywhere a monetary phenomenon" — control the money supply and you control inflation. He opposed Keynesian fiscal policy, arguing that government spending "crowds out" private investment and that attempts to fine-tune the economy do more harm than good. He also advocated a negative income tax (a precursor to UBI), school vouchers, floating exchange rates, and the end of the military draft.',
    color: ACCENT,
  },
  {
    year: '1944–1974',
    title: 'Friedrich Hayek — The Case Against Central Planning',
    description:
      'Hayek\'s "The Road to Serfdom" (1944) argued that central economic planning inevitably leads to totalitarianism — you cannot control the economy without controlling people. His key insight was about information: prices in a free market aggregate the dispersed knowledge of millions of individuals in a way that no central planner could replicate. Hayek\'s ideas were marginalized during the Keynesian consensus but roared back when stagflation discredited government management of the economy.',
    color: GOLD,
  },
  {
    year: '1970s',
    title: 'Stagflation Breaks the Keynesian Consensus',
    description:
      'The 1970s dealt Keynesian economics its worst blow. The OPEC oil shocks produced something Keynesian theory said shouldn\'t exist: stagflation — simultaneous high inflation AND high unemployment. Keynesian models assumed a stable trade-off between inflation and unemployment (the Phillips curve). When both rose together, the models broke. Friedman had predicted exactly this scenario: sustained government stimulus would eventually produce inflation without reducing unemployment. The intellectual momentum shifted decisively toward free-market economics.',
    color: RED,
  },
  {
    year: '1979–1989',
    title: 'Thatcher and Reagan — Supply-Side Revolution',
    description:
      'Margaret Thatcher (UK, 1979) and Ronald Reagan (US, 1981) translated Chicago School ideas into policy: deregulation of industries, privatization of state enterprises, cuts to top tax rates, weakening of labor unions, tight monetary policy to crush inflation (at the cost of severe recessions). Thatcher\'s "There Is No Alternative" (TINA) became the mantra. The results were mixed: inflation was tamed and growth eventually recovered, but inequality surged, industrial communities were devastated, and the financial sector\'s growing power set the stage for future crises.',
    color: ROSE,
  },
  {
    year: '1989–2008',
    title: 'The Washington Consensus — Free Markets Go Global',
    description:
      'The fall of communism and the dominance of free-market ideas produced the "Washington Consensus" — a set of policies promoted by the IMF, World Bank, and US Treasury for developing nations: fiscal discipline, trade liberalization, privatization, deregulation, secure property rights. Applied from Latin America to post-Soviet Russia, the results were often painful: rapid privatization in Russia created oligarchs, structural adjustment in Africa deepened poverty. Globalization accelerated — lifting hundreds of millions out of poverty in China and India while hollowing out manufacturing in the West.',
    color: PURPLE,
  },
];

// ── Behavioral economics ────────────────────────────────────────────────────

const BEHAVIORAL: TimelineEntry[] = [
  {
    year: '1979',
    title: 'Kahneman and Tversky — Prospect Theory',
    description:
      'Daniel Kahneman and Amos Tversky\'s prospect theory demolished the assumption of rational actors at the heart of neoclassical economics. They showed that people evaluate gains and losses asymmetrically (loss aversion — a $100 loss hurts about twice as much as a $100 gain feels good), use mental shortcuts (heuristics) that produce systematic biases, and frame decisions based on how options are presented rather than their objective value. Homo economicus was a fiction.',
    color: ACCENT,
  },
  {
    year: '1980s–2000s',
    title: 'The Catalog of Cognitive Biases',
    description:
      'Behavioral economists documented an expanding catalog of ways humans deviate from rationality: anchoring (over-relying on the first number you see), availability bias (overweighting memorable events), sunk cost fallacy (throwing good money after bad), endowment effect (overvaluing what you already own), present bias (preferring immediate rewards over larger future ones), herding (following the crowd). These aren\'t occasional errors — they\'re systematic and predictable patterns hardwired by evolution.',
    color: GOLD,
  },
  {
    year: '2008',
    title: 'Richard Thaler — Nudge Theory',
    description:
      'Thaler and Cass Sunstein\'s "Nudge" proposed that instead of mandating behavior, policymakers should design "choice architecture" that makes the better option the default. Examples: automatic enrollment in retirement savings (opt-out instead of opt-in dramatically increases participation), putting healthy food at eye level in cafeterias, simplifying tax forms. Nudges preserve freedom of choice while steering people toward better outcomes. Governments worldwide established "nudge units" — the UK\'s Behavioral Insights Team became a model.',
    color: GREEN,
  },
  {
    year: '2002, 2017',
    title: 'Nobel Prizes Validate Behavioral Economics',
    description:
      'Daniel Kahneman won the Nobel Prize in Economics in 2002 (Tversky had died in 1996 and was ineligible). Richard Thaler won in 2017. These prizes cemented behavioral economics as mainstream, not a fringe critique. The implications are profound: if people are predictably irrational, then free-market outcomes are not necessarily optimal, and there\'s a role for well-designed interventions. But critics warn that nudges can be paternalistic, and that governments exploit biases too.',
    color: TEAL,
  },
];

// ── Modern debates ──────────────────────────────────────────────────────────

const MODERN_DEBATES: TimelineEntry[] = [
  {
    year: '2013',
    title: 'Thomas Piketty — "Capital in the Twenty-First Century"',
    description:
      'Piketty assembled 200 years of data from 20 countries to show that when the rate of return on capital (r) exceeds the rate of economic growth (g) — which it almost always does — wealth concentrates at the top. Inequality isn\'t a bug in capitalism, it\'s the default setting. The postwar reduction in inequality was the exception, driven by two world wars, depression, and deliberate policy choices. Without intervention (such as a global wealth tax), inequality will return to 19th-century levels. The book sold over 2.5 million copies and reignited inequality as a central economic debate.',
    color: RED,
  },
  {
    year: '2010s',
    title: 'Modern Monetary Theory (MMT)',
    description:
      'MMT, championed by Stephanie Kelton and others, argues that a government that issues its own currency can never "run out of money" — it can always create more. The real constraint is not the deficit but inflation: spend too much and you overheat the economy. This means deficit spending for full employment, healthcare, and green investment is affordable — just tax to control inflation. Critics (including mainstream Keynesians like Paul Krugman) argue MMT underestimates inflation risk and oversimplifies the relationship between money creation and price stability.',
    color: PURPLE,
  },
  {
    year: '2008–2020s',
    title: 'Post-2008: The Return of Keynesian Stimulus',
    description:
      'The 2008 financial crisis and COVID-19 pandemic brought Keynesian ideas roaring back. Central banks cut interest rates to zero (and below), implemented quantitative easing (buying trillions in bonds to inject money into the economy), and governments deployed massive fiscal stimulus. The 2020 COVID response saw "helicopter money" — direct cash payments to citizens — once considered radical. The result: faster recoveries, but also the return of inflation in 2022, reigniting the Friedman-vs-Keynes debate.',
    color: ACCENT,
  },
  {
    year: '2010s–present',
    title: 'Degrowth and Beyond-GDP Movements',
    description:
      'A growing movement argues that GDP growth is the wrong goal. Degrowth economists contend that infinite growth on a finite planet is physically impossible and ecologically suicidal. They propose measuring wellbeing through alternative metrics: Bhutan\'s Gross National Happiness, Kate Raworth\'s "Doughnut Economics" (meeting human needs without exceeding planetary boundaries), the Genuine Progress Indicator. Critics argue degrowth is politically impractical and could trap developing nations in poverty. But the climate crisis makes "business as usual" growth equally impractical.',
    color: EMERALD,
  },
  {
    year: '2020s',
    title: 'AI and the Future of Work',
    description:
      'The rapid advance of artificial intelligence raises questions that economics has no consensus on: Will AI automate enough jobs to cause mass unemployment, or will it create new jobs as past technologies did? Should the gains from AI-driven productivity be shared through universal basic income? If AI concentrates wealth further among technology owners, what happens to demand in a consumer economy? Economists from across the spectrum are scrambling to update their models for a world where cognitive labor — the one thing humans had over machines — is no longer uniquely human.',
    color: INDIGO,
  },
];

// ── Key figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  { name: 'Adam Smith', years: '1723–1790', contribution: 'Founder of modern economics. The Wealth of Nations established free trade, division of labor, and the invisible hand as foundational concepts.' },
  { name: 'David Ricardo', years: '1772–1823', contribution: 'Developed comparative advantage (the strongest argument for free trade) and the theory of economic rent on land.' },
  { name: 'Thomas Malthus', years: '1766–1834', contribution: 'Population theory — geometric population growth vs arithmetic food growth. Influenced Darwin and environmental economics.' },
  { name: 'Karl Marx', years: '1818–1883', contribution: 'Das Kapital, labor theory of value, historical materialism. His critique of capitalism shaped the 20th century\'s political landscape.' },
  { name: 'Alfred Marshall', years: '1842–1924', contribution: 'Unified supply and demand analysis. Created the foundational framework of neoclassical economics still taught today.' },
  { name: 'John Maynard Keynes', years: '1883–1946', contribution: 'The General Theory revolutionized macroeconomics. Government stimulus in recessions. Designed the postwar monetary order.' },
  { name: 'Friedrich Hayek', years: '1899–1992', contribution: 'The Road to Serfdom, price signals as distributed knowledge, spontaneous order. Nobel Prize 1974.' },
  { name: 'Milton Friedman', years: '1912–2006', contribution: 'Monetarism, inflation as a monetary phenomenon, free-market advocacy. Shaped Thatcher-Reagan economic policy. Nobel Prize 1976.' },
  { name: 'Paul Samuelson', years: '1915–2009', contribution: 'Neoclassical synthesis — merged Keynesian macro with neoclassical micro. His textbook taught economics to millions. Nobel Prize 1970.' },
  { name: 'John Stuart Mill', years: '1806–1873', contribution: 'Refined classical economics, applied utilitarianism, advocated worker cooperatives and women\'s economic rights.' },
  { name: 'Joseph Schumpeter', years: '1883–1950', contribution: '"Creative destruction" — capitalism progresses by constantly destroying old industries and creating new ones. Entrepreneurship theory.' },
  { name: 'Daniel Kahneman', years: '1934–2024', contribution: 'Prospect theory, cognitive biases, System 1/System 2 thinking. Demolished the rational actor assumption. Nobel Prize 2002.' },
  { name: 'Thomas Piketty', years: '1971–', contribution: 'Capital in the 21st Century — showed r > g drives inequality. Assembled the most comprehensive wealth data in economic history.' },
  { name: 'Amartya Sen', years: '1933–', contribution: 'Capabilities approach — development means expanding human freedoms, not just growing GDP. Welfare economics. Nobel Prize 1998.' },
  { name: 'Joan Robinson', years: '1903–1983', contribution: 'Theory of imperfect competition, critique of neoclassical capital theory, advocate for post-Keynesian economics. One of the most important economists never to receive the Nobel.' },
  { name: 'Richard Thaler', years: '1945–', contribution: 'Nudge theory, mental accounting, endowment effect. Made behavioral economics practical for policy. Nobel Prize 2017.' },
];

// ── Open questions ──────────────────────────────────────────────────────────

const CHALLENGES: InsightEntry[] = [
  { label: 'Inequality', detail: 'Wealth concentration has returned to pre-WWI levels in many nations. Neither free-market nor redistributive solutions have found lasting consensus.' },
  { label: 'Climate vs Growth', detail: 'Mainstream economics assumes perpetual growth; the climate crisis demands constraints on resource use. Reconciling these is the defining challenge of 21st-century economics.' },
  { label: 'Financial Instability', detail: 'Despite 2008\'s lessons, financial systems remain fragile. Shadow banking, crypto assets, and algorithmic trading create new systemic risks.' },
  { label: 'Modeling Failure', detail: 'The dominant DSGE models failed to predict the 2008 crisis. Economics still struggles to model real-world complexity, interconnection, and human irrationality.' },
  { label: 'Global Coordination', detail: 'Tax havens, currency manipulation, and trade wars show the limits of economics in a world where nations compete rather than cooperate.' },
];

const ACHIEVEMENTS: InsightEntry[] = [
  { label: 'Poverty Reduction', detail: 'Global extreme poverty fell from 36% in 1990 to under 10% by 2019 — the fastest reduction in human history, driven by trade, growth, and targeted policy.' },
  { label: 'Behavioral Revolution', detail: 'By accepting that humans are not perfectly rational, economics has become more realistic and its policy recommendations more effective.' },
  { label: 'Central Banking', detail: 'The development of modern monetary policy — inflation targeting, independent central banks — tamed the hyperinflation and currency crises that plagued earlier eras.' },
  { label: 'Development Economics', detail: 'Randomized controlled trials (Banerjee, Duflo, Kremer — Nobel 2019) brought rigorous evidence to anti-poverty programs, replacing ideology with data.' },
  { label: 'Understanding Trade', detail: 'From Ricardo to modern trade theory, economics has demonstrated the gains from specialization and exchange, lifting billions through globalization.' },
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

function ChallengesAndAchievements({ challenges, achievements }: { challenges: InsightEntry[]; achievements: InsightEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: RED, marginBottom: 14 }}>Unresolved Questions</h3>
        {challenges.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.2)',
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fca5a5', marginBottom: 4 }}>{t.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{t.detail}</div>
          </motion.div>
        ))}
      </div>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 14 }}>What Economics Has Achieved</h3>
        {achievements.map((r, i) => (
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

export default function EconomicThoughtPage() {
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
            background: `linear-gradient(135deg, rgba(7,14,34,0.98) 0%, ${EMERALD}10 100%)`,
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
            The History of Economic Thought &mdash; Ideas That Shaped How the World Distributes Wealth
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
            Economics is barely <strong style={{ color: ACCENT }}>250 years old</strong> as a discipline &mdash;
            Adam Smith published The Wealth of Nations in 1776. Since then, every major economic idea has been forged in
            crisis: classical economics from the collapse of mercantilism, Keynesianism from the Great Depression,
            monetarism from stagflation, behavioral economics from the failure of rational-actor models. Today,
            with <strong style={{ color: RED }}>inequality at Gilded Age levels</strong>, a climate emergency, and AI
            transforming labor, the history of economic thought is not academic &mdash; it&rsquo;s the story of the
            ideas that will shape what comes next.
          </motion.div>
        </div>

        {/* ── Pre-Modern Economics ───────────────────────────────────────── */}
        <SectionWrapper title="Pre-Modern Economics" icon={'\u{1F3DB}\u{FE0F}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            For over two thousand years, economic thinking was embedded in moral philosophy and theology.
            The questions were not &ldquo;how do markets work?&rdquo; but &ldquo;what is a just price?&rdquo;
            and &ldquo;is it moral to profit from lending?&rdquo; Mercantilism was the first attempt at
            systematic economic policy &mdash; and its failures created the conditions for classical economics.
          </p>
          {PRE_MODERN.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Classical Economics ─────────────────────────────────────────── */}
        <SectionWrapper title="Classical Economics (1776\u20131870)" icon={'\u{1F4D6}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The founding era of economics as a distinct discipline. These thinkers asked the big questions &mdash;
            what creates wealth? Why are some nations rich and others poor? How should the gains from trade
            be distributed? Their answers still shape every economics textbook.
          </p>
          {CLASSICAL.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Karl Marx ──────────────────────────────────────────────────── */}
        <SectionWrapper title="Karl Marx and the Critique of Capitalism" icon={'\u{2694}\u{FE0F}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Marx stands apart from other economists because his goal was not to explain capitalism
            but to overthrow it. Whether you agree or disagree with his conclusions, his analysis of
            exploitation, alienation, and capitalism&rsquo;s tendency toward crisis remains some of the
            most influential social theory ever written.
          </p>
          {MARX.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Marginalist Revolution ─────────────────────────────────────── */}
        <SectionWrapper title="The Marginalist Revolution (1870s)" icon={'\u{1F4CA}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Three economists, working independently in three countries, simultaneously discovered the same
            insight: value comes not from labor (as Smith, Ricardo, and Marx thought) but from marginal
            utility &mdash; the satisfaction gained from one additional unit. This was economics&rsquo;
            &ldquo;scientific revolution,&rdquo; making mathematical modeling possible for the first time.
          </p>
          {MARGINALIST.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Neoclassical Economics ──────────────────────────────────────── */}
        <SectionWrapper title="Neoclassical Economics (1870\u20131930)" icon={'\u{1F4D0}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The marginalists&rsquo; insights were built into a complete theoretical framework: supply and
            demand curves, general equilibrium, rational agents maximizing utility. It was elegant,
            mathematical, and internally consistent. It was also about to be shattered by the Great Depression.
          </p>
          {NEOCLASSICAL.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Keynes ─────────────────────────────────────────────────────── */}
        <SectionWrapper title="John Maynard Keynes \u2014 The 20th Century\u2019s Biggest Shift" icon={'\u{1F3DB}\u{FE0F}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Keynes didn&rsquo;t just add a new theory &mdash; he changed the purpose of economics. Before
            Keynes, economists described how markets work. After Keynes, they were expected to fix them.
            The idea that government should actively manage the economy was revolutionary in 1936 and
            remains the central fault line in economic debate today.
          </p>
          {KEYNES.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Chicago School ─────────────────────────────────────────────── */}
        <SectionWrapper title="The Chicago School and Monetarism (1960s\u20131980s)" icon={'\u{1F4B5}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The free-market counter-revolution. When Keynesian economics couldn&rsquo;t explain stagflation,
            Friedman and Hayek&rsquo;s ideas moved from the margins to the center of economic policy &mdash;
            reshaping the world through Thatcher, Reagan, and the Washington Consensus.
          </p>
          {CHICAGO_SCHOOL.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Behavioral Economics ────────────────────────────────────────── */}
        <SectionWrapper title="Behavioral Economics (1970s\u2013Present)" icon={'\u{1F9E0}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            What if the fundamental assumption of economics &mdash; that people are rational &mdash; is wrong?
            Behavioral economists proved it is. The implications are still unfolding: if people are
            predictably irrational, then markets are predictably imperfect, and smart policy design matters
            more than ideology.
          </p>
          {BEHAVIORAL.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Modern Debates ─────────────────────────────────────────────── */}
        <SectionWrapper title="Modern Debates" icon={'\u{1F310}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Economics today is more contested than ever. The 2008 crisis discredited the efficient-market
            hypothesis, Piketty put inequality back on the agenda, MMT challenges fiscal orthodoxy, and
            the climate crisis demands a rethinking of growth itself. The next chapter of economic thought
            is being written now.
          </p>
          {MODERN_DEBATES.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Key Figures ────────────────────────────────────────────────── */}
        <SectionWrapper title="Key Figures in Economic Thought" icon={'\u{1F464}'}>
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Open Questions ─────────────────────────────────────────────── */}
        <SectionWrapper title="The State of Economics Today" icon={'\u{2696}\u{FE0F}'}>
          <ChallengesAndAchievements challenges={CHALLENGES} achievements={ACHIEVEMENTS} />
        </SectionWrapper>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: '#64748b',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            &larr; Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
