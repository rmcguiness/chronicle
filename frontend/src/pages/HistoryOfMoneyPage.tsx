/**
 * HistoryOfMoneyPage — comprehensive deep-dive on the History of Money (~9000 BCE–Present).
 *
 * Route: /history-of-money
 *
 * Sections:
 *  1. Hero — headline, overview of money's role in civilization
 *  2. Before Money — barter and the double coincidence of wants
 *  3. Commodity Money — cattle, grain, shells, salt, the word "salary"
 *  4. First Coins — Mesopotamian shekel, Lydian electrum, Greek/Roman coinage
 *  5. Roman Debasement — inflation through coin dilution, fall of empire
 *  6. Chinese Paper Money — Tang/Song dynasty jiaozi
 *  7. Medieval Banking — Italian bankers, bills of exchange, Medici
 *  8. Spanish Silver — Potosí, global price revolution
 *  9. Central Banking — Bank of England, Federal Reserve
 * 10. The Gold Standard — Bretton Woods, Nixon shock
 * 11. Inflation & Hyperinflation — Weimar, Zimbabwe, Venezuela
 * 12. Credit & Debt — ancient loans, credit cards, fractional reserve
 * 13. Cryptocurrency — Bitcoin, blockchain, the future
 * 14. Monetary Theories — mercantilism, quantity theory, Keynesian, MMT
 * 15. Timeline of Major Milestones
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const AMBER = '#d97706';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const CRIMSON = '#dc2626';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const SKY = '#38bdf8';
const ASH = '#94a3b8';
const COPPER = '#b87333';
const SILVER_METAL = '#c0c0c0';
const EMERALD = '#059669';
const ORANGE = '#f97316';

// ─────────────────────────────────────────────────────────────────────────────
// Data types
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

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

// ── Key Stats ───────────────────────────────────────────────────────────────

const KEY_STATS: InsightEntry[] = [
  {
    label: '~5,000 years',
    detail: 'The span of monetary history — from the Mesopotamian shekel (~3000 BCE) to Bitcoin. Money is as old as writing itself.',
  },
  {
    label: '$100+ trillion',
    detail: 'Total global money supply (M2) in 2024. More money exists today than at any point in human history — most of it digital, not physical.',
  },
  {
    label: '180 currencies',
    detail: 'Active national currencies worldwide. The US dollar, euro, Japanese yen, and British pound account for over 75% of global forex trading.',
  },
  {
    label: '3 hyperinflations',
    detail: 'Weimar Germany (1923), Zimbabwe (2008), Venezuela (2018) — each destroyed savings, trust, and governments. The pattern repeats because the temptation to print never fades.',
  },
  {
    label: 'August 15, 1971',
    detail: 'Nixon ended dollar-gold convertibility. For the first time in history, every major currency was backed by nothing but trust in the issuing government.',
  },
  {
    label: 'January 3, 2009',
    detail: 'Satoshi Nakamoto mined the Bitcoin genesis block, embedding a headline about bank bailouts. The first decentralized currency was born.',
  },
];

// ── Barter & Its Limits ─────────────────────────────────────────────────────

const BARTER_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Double Coincidence of Wants',
    detail:
      'Barter\'s fatal flaw: you need wheat and have fish, but the wheat farmer wants pottery, not fish. You need a three-way trade — or a four-way, or a ten-way chain. As economies grew beyond small villages, the combinatorial explosion of matching wants made pure barter unworkable. Money solved this by creating a universal medium of exchange: sell your fish for money, buy wheat with money. One step replaced an impossible coordination problem.',
  },
  {
    label: 'The Myth of the Barter Economy',
    detail:
      'Anthropologist David Graeber argued in "Debt: The First 5,000 Years" (2011) that pure barter economies never actually existed at scale. In practice, early societies used gift economies, social credit, and debt relationships. When you gave your neighbor grain, you didn\'t demand immediate payment — you trusted the community to reciprocate over time. Money didn\'t replace barter; it formalized and depersonalized ancient systems of mutual obligation.',
  },
  {
    label: 'Three Problems Money Solves',
    detail:
      'Money must serve three functions: (1) Medium of exchange — you can trade it for anything. (2) Store of value — it holds purchasing power over time. (3) Unit of account — it provides a common measuring stick for comparing prices. Barter fails at all three. A bushel of wheat is a terrible store of value (it rots), an awkward unit of account (how many chickens per cow?), and an inefficient medium of exchange (the coincidence problem). Any commodity that solves all three becomes money.',
  },
];

// ── Commodity Money ─────────────────────────────────────────────────────────

const COMMODITY_TIMELINE: TimelineEntry[] = [
  {
    year: '~9000 BCE',
    title: 'Cattle: The First Currency',
    description:
      'Cattle were among the earliest forms of money — portable wealth that could reproduce. The Latin word "pecunia" (money) derives from "pecus" (cattle). In many pastoral societies, wealth was literally counted in heads of cattle. The dowry, the fine for murder, the price of land — all measured in cows. Cattle had intrinsic value (milk, meat, leather, labor) and were universally desired, making them a natural medium of exchange. But they were indivisible (you can\'t make change from a cow), perishable, and hard to transport — problems that pushed societies toward smaller, more portable commodities.',
    color: AMBER,
  },
  {
    year: '~6000 BCE',
    title: 'Grain: The Mesopotamian Standard',
    description:
      'In the fertile crescent, barley became the dominant unit of account. Sumerian temples — which functioned as the first banks — recorded debts and wages in measures of barley (the "sila," about 1 liter). Workers were paid in barley rations. This wasn\'t primitive — it was practical. Barley was universally needed (for bread and beer), relatively uniform, and divisible. The Mesopotamian grain-based economy supported the world\'s first cities, writing systems (cuneiform began as accounting records), and bureaucracies.',
    color: GOLD,
  },
  {
    year: '~3000 BCE',
    title: 'Cowrie Shells: Pan-Continental Currency',
    description:
      'Cowrie shells (Monetaria moneta) were used as currency across Africa, South Asia, East Asia, and the Pacific for over 3,000 years — the longest-serving and most geographically widespread currency in human history. They were durable, portable, hard to counterfeit (each shell is unique), and beautiful. In China, the character for "money" (貝) is a pictograph of a cowrie shell. Cowries remained legal tender in parts of Africa into the 20th century. Their eventual downfall: European traders flooded African markets with cowries from the Maldives, causing inflation — the first currency manipulation through artificial supply increase.',
    color: TEAL,
  },
  {
    year: '~2000 BCE',
    title: 'Salt: Worth Its Weight in... Salary',
    description:
      'Roman soldiers were sometimes paid in salt — or at least given a "salarium" (salt allowance) to buy it. The English word "salary" descends directly from this practice. Salt was precious because it was essential: the only way to preserve meat before refrigeration. "Not worth his salt" meant a worker wasn\'t earning his pay. Salt routes became major trade highways (the Via Salaria in Rome). Salt taxes funded empires and sparked rebellions — Gandhi\'s 1930 Salt March challenged British colonial salt taxes in India.',
    color: SILVER_METAL,
  },
  {
    year: 'Various',
    title: 'The Commodity Money Menagerie',
    description:
      'Humans have used an astonishing variety of commodities as money: whale teeth in Fiji, tea bricks in Central Asia, cocoa beans among the Aztecs, tobacco in colonial Virginia (warehouse receipts for stored tobacco became the colony\'s paper money), giant stone discs (rai) on the island of Yap, iron nails in Scotland, beaver pelts in colonial Canada (the Hudson\'s Bay Company literally priced everything in beaver skins). Each reveals the same principle: anything scarce, durable, portable, divisible, and universally desired can become money.',
    color: COPPER,
  },
];

// ── First Coins ─────────────────────────────────────────────────────────────

const COINS_TIMELINE: TimelineEntry[] = [
  {
    year: '~3000 BCE',
    title: 'The Mesopotamian Shekel',
    description:
      'The shekel was not a coin but a unit of weight — about 8.3 grams of silver. Mesopotamian merchants weighed out silver to make payments, using standardized weights verified by temple authorities. This was the world\'s first standardized monetary system: the concept that a fixed weight of precious metal has a fixed purchasing power. The shekel system required scales and trusted weight standards — cumbersome, but revolutionary. It separated money from any specific commodity and linked it to abstract value. The Israeli shekel today carries the name forward across five millennia.',
    color: SILVER_METAL,
  },
  {
    year: '~640–600 BCE',
    title: 'Lydian Electrum Coins: The First True Coinage',
    description:
      'King Alyattes of Lydia (modern Turkey) produced the first true coins: small lumps of electrum (a natural gold-silver alloy) stamped with a lion\'s head — the royal seal that guaranteed weight and purity. This was the decisive innovation. Instead of weighing metal for every transaction, you could count coins. The king\'s stamp was a promise: "this coin contains the amount of precious metal I say it does." Trust shifted from the scale to the sovereign. Lydia became fabulously wealthy. King Croesus — Alyattes\' son — became a byword for wealth that persists today: "rich as Croesus."',
    color: GOLD,
  },
  {
    year: '~500 BCE',
    title: 'Greek Drachma: Democratic Money',
    description:
      'Greek city-states adopted coinage with enthusiasm. Athens\' silver drachma — stamped with Athena\'s owl — became the dominant trade currency of the Mediterranean. But Greek coinage was more than economics: it was politics. Each city-state minted its own coins with its own symbols — a statement of sovereignty and identity. Coins spread literacy (legends required reading), standardized trade across hundreds of independent polities, and financed the armies and navies that defended Greek independence. The Athenian "owls" were so trusted they circulated far beyond Greece — the dollar of the ancient world.',
    color: INDIGO,
  },
  {
    year: '~211 BCE',
    title: 'The Roman Denarius: Imperial Standard',
    description:
      'Rome\'s silver denarius became the most widely circulated coin in the ancient world — accepted from Britain to Mesopotamia. The word "denarius" gave us "denier" (French), "dinar" (Arabic), and "dinero" (Spanish). Rome\'s monetary system was sophisticated: gold aureus for large transactions, silver denarius for daily commerce, bronze sestertius and as for small purchases. Soldiers were paid in denarii (their "stipendium"), creating a cash economy that bound the empire together. The denarius worked because Rome enforced standards — and when those standards slipped, so did the empire.',
    color: CRIMSON,
  },
];

// ── Roman Debasement ────────────────────────────────────────────────────────

const DEBASEMENT_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Slow Poison of Debasement',
    detail:
      'In 64 CE, Nero reduced the denarius from 98% to 93% silver — a small change that set a catastrophic precedent. Each emperor facing fiscal pressure (wars, plagues, civil wars) reduced the silver content further. By 268 CE, the "silver" denarius contained less than 2% silver — it was essentially a bronze coin with a silver wash. Prices rose 1,000% over two centuries. This is the first well-documented inflation spiral in history, and it followed a pattern every subsequent civilization would repeat: governments debasing currency to fund spending they can\'t afford through taxation.',
  },
  {
    label: 'Diocletian\'s Price Edict (301 CE)',
    detail:
      'Emperor Diocletian attempted to fix inflation by decree — the Edict on Maximum Prices set legal maximums for over 1,000 goods and services, with the death penalty for violations. It failed completely. Merchants withdrew goods from markets rather than sell at a loss. Black markets flourished. The edict was quietly abandoned. It remains history\'s most dramatic demonstration that price controls cannot fix monetary debasement. You can\'t legislate away inflation caused by debasing the currency — you can only fix the currency.',
  },
  {
    label: 'Did Debasement Kill Rome?',
    detail:
      'Monetary debasement didn\'t directly cause Rome\'s fall, but it accelerated every other problem. Soldiers demanded payment in goods (not worthless coins), weakening military loyalty. Tax collection collapsed because citizens paid with debased coins worth a fraction of their face value. Trade contracted as merchants lost faith in Roman money. The empire fractured into regional economies. When Odoacer deposed the last western emperor in 476 CE, the Roman monetary system had been a zombie for two centuries — technically alive, functionally dead.',
  },
];

// ── Chinese Paper Money ─────────────────────────────────────────────────────

const PAPER_MONEY_TIMELINE: TimelineEntry[] = [
  {
    year: '7th century',
    title: 'Tang Dynasty: "Flying Money"',
    description:
      'Chinese merchants invented "feiqian" (flying money) — paper certificates that could be exchanged for coin at government offices in distant cities. This wasn\'t true paper money but something equally revolutionary: a transferable claim on deposited value. Merchants carrying heavy strings of copper coins on dangerous trade routes could instead carry a lightweight paper receipt. The idea that a piece of paper could represent real money — that value could be abstracted from physical substance — was one of the most consequential innovations in economic history.',
    color: CRIMSON,
  },
  {
    year: '~1024 CE',
    title: 'Song Dynasty Jiaozi: The First Banknotes',
    description:
      'The Song Dynasty government issued the world\'s first true paper currency — the jiaozi. Initially backed by coin reserves, jiaozi were lighter, cheaper to produce, and easier to transport than strings of copper cash. The government standardized denominations, used woodblock printing with anti-counterfeiting features (multiple colors, complex designs, serial numbers), and established redemption offices. For two centuries, the system worked brilliantly, enabling commerce at a scale impossible with metallic money alone. China was 700 years ahead of Europe.',
    color: GOLD,
  },
  {
    year: '13th century',
    title: 'Marco Polo\'s Astonishment',
    description:
      'When Marco Polo visited Kublai Khan\'s China in the 1270s, he was astounded to find an entire empire running on paper money. "The Great Khan causes the bark of trees to be stripped off, and made into something like paper, which is black... and he causes it to be accepted as money throughout his dominions." Europeans thought this was sorcery. Polo\'s account was widely disbelieved — Europeans wouldn\'t adopt paper money for another 400 years. The Yuan Dynasty\'s paper money was accepted from the Pacific to Persia.',
    color: AMBER,
  },
  {
    year: '14th–15th century',
    title: 'The Collapse: Printing Too Much',
    description:
      'Every dynasty that issued paper money eventually succumbed to the same temptation: printing more. The Yuan Dynasty funded wars by printing massive quantities of notes, causing severe inflation. The Ming Dynasty tried again with the "Da Ming Baochao" — and overprintedagain. By the 1450s, the Ming abandoned paper money entirely and returned to silver. China wouldn\'t use paper currency again until the 20th century. The lesson — that the power to print money is the power to destroy it — would be learned and forgotten by every civilization that followed.',
    color: ROSE,
  },
];

// ── Medieval Banking ────────────────────────────────────────────────────────

const BANKING_INSIGHTS: InsightEntry[] = [
  {
    label: 'Italian Banking Innovation',
    detail:
      'The word "bank" comes from "banca" — the bench where Italian money-changers sat in medieval marketplaces. Italian city-states (Florence, Venice, Genoa, Siena) invented most of modern banking: double-entry bookkeeping (tracking debits and credits), bills of exchange (transferring money across borders without physically moving it), letters of credit, and deposit banking. These weren\'t just financial tools — they were information technologies that made long-distance trade possible. A Florentine merchant could buy goods in Bruges without carrying a single coin.',
  },
  {
    label: 'The Medici Bank (1397–1494)',
    detail:
      'The Medici Bank was the largest in Europe for nearly a century — a multinational financial institution with branches in Florence, Rome, Venice, Milan, Bruges, London, and Avignon. The Medici pioneered the holding company structure, managed papal finances, invented new financial instruments, and used their wealth to sponsor the Renaissance (Brunelleschi, Botticelli, Michelangelo). They also produced four popes and two queens of France. The Medici proved that banking power could translate into political power — a lesson the Rothschilds, Morgans, and Goldman Sachs would later confirm.',
  },
  {
    label: 'Usury and the Church',
    detail:
      'Christianity, Islam, and Judaism all prohibited or restricted lending at interest ("usury"). This created a paradox: medieval economies needed credit to grow, but charging interest was a sin. The workaround was elaborate: interest was disguised as "fees," "penalties for late payment," or "foreign exchange commissions." Jewish moneylenders, barred from most other professions, became prominent in finance — creating antisemitic stereotypes that persisted for centuries. The theological prohibition on interest shaped banking\'s development and contributed to some of history\'s darkest prejudices.',
  },
  {
    label: 'Bills of Exchange: Invisible Money',
    detail:
      'The bill of exchange was medieval banking\'s killer app. A merchant in Florence could write a bill ordering his banker in Bruges to pay a specified amount to a named recipient. The bill traveled by courier; the money never moved. This was revolutionary — it meant that trade no longer required physical shipment of gold and silver across bandit-infested roads. Bills of exchange also created private money: they circulated as payment, endorsed from one merchant to another, functioning exactly like banknotes centuries before any government issued them.',
  },
];

// ── Spanish Silver ──────────────────────────────────────────────────────────

const SILVER_INSIGHTS: InsightEntry[] = [
  {
    label: 'Potosí: The Mountain of Silver',
    detail:
      'In 1545, the Spanish discovered Cerro Rico — the "Rich Mountain" — in present-day Bolivia. Potosí became the largest silver mine in history, producing an estimated 60% of the world\'s silver for over two centuries. By 1600, Potosí was one of the largest cities in the world (160,000 people — larger than London). The silver was extracted through forced indigenous labor (the mita system) and African slavery. An estimated 8 million indigenous and enslaved workers died in the mines. The phrase "vale un Potosí" (worth a Potosí) entered Spanish as a synonym for incalculable wealth.',
  },
  {
    label: 'The Price Revolution (1500–1650)',
    detail:
      'Spanish silver flooded Europe and then the world, causing a 150-year inflation that tripled or quadrupled prices across the continent. This was the first global monetary shock. The "price revolution" destroyed the feudal economic order (fixed rents became worthless in real terms), enriched merchants and debtors, impoverished aristocrats and creditors, and sparked economic theorizing about the relationship between money supply and prices. Jean Bodin\'s 1568 observation that prices rose because silver supply increased was the first articulation of the quantity theory of money.',
  },
  {
    label: 'The Spanish Dollar Goes Global',
    detail:
      'The Spanish "piece of eight" (real de a ocho) became the world\'s first global currency — accepted from Manila to Massachusetts. It was the standard trade coin in the Americas, East Asia, and much of Europe for three centuries. The US dollar symbol ($) likely derives from the "pillars and waves" design on the piece of eight. When the United States established its own dollar in 1792, it was defined as equivalent to the Spanish dollar. The globalization of money began with Spanish silver.',
  },
  {
    label: 'The Dutch Disease — Spain\'s Paradox',
    detail:
      'Despite controlling the world\'s richest silver mines, Spain went bankrupt repeatedly (1557, 1575, 1596, 1607, 1627). The silver flowed through Spain without enriching it — it paid for wars, imported goods, and debts to foreign bankers. Spain never developed domestic manufacturing because it was cheaper to buy goods from Holland and England with silver. This is history\'s first case of "resource curse" or "Dutch disease": a resource bonanza that paradoxically weakens an economy by making domestic production uncompetitive.',
  },
];

// ── Central Banking ─────────────────────────────────────────────────────────

const CENTRAL_BANK_TIMELINE: TimelineEntry[] = [
  {
    year: '1609',
    title: 'Bank of Amsterdam: Proto-Central Bank',
    description:
      'The Wisselbank (Exchange Bank) of Amsterdam was established to bring order to the chaotic Dutch monetary system, where hundreds of debased and foreign coins circulated. Merchants could deposit coins and receive standardized "bank money" credits. The bank didn\'t lend or create money — it simply provided a reliable unit of account. It worked brilliantly for 170 years, making Amsterdam the financial capital of Europe. The Wisselbank proved that a trusted central institution could stabilize a monetary system.',
    color: TEAL,
  },
  {
    year: '1694',
    title: 'Bank of England: The Template',
    description:
      'King William III needed money to fight France. A group of merchants proposed a deal: they would lend the government £1.2 million, and in return they would receive a royal charter to operate as a bank that could issue banknotes. The Bank of England was born — not from economic theory, but from the government\'s need to finance a war. This template — a central bank created to lend to the government — would be replicated worldwide. The Bank gradually assumed its modern functions: managing the money supply, acting as lender of last resort, and stabilizing the financial system.',
    color: GOLD,
  },
  {
    year: '1913',
    title: 'The Federal Reserve: America\'s Third Attempt',
    description:
      'The United States twice created and then abolished central banks (1791–1811, 1816–1836) before the Panic of 1907 convinced Congress that a central bank was necessary. J.P. Morgan personally organized the bailout of the 1907 crisis — making it uncomfortably clear that the nation\'s financial stability depended on one private citizen. The Federal Reserve Act of 1913 created a deliberately decentralized system: 12 regional banks overseen by a Board of Governors. It was a compromise between those who feared centralized power and those who demanded financial stability.',
    color: INDIGO,
  },
  {
    year: '1930s–present',
    title: 'Central Banks Go Global',
    description:
      'The Great Depression proved that central banks couldn\'t just be passive custodians of the money supply — they needed to actively manage economies. The Bank for International Settlements (1930) became the "central bank of central banks." After WWII, newly independent nations created central banks as symbols of sovereignty. Today, central banks wield enormous power: setting interest rates, conducting quantitative easing, supervising banks, and managing inflation expectations. The question that haunts the institution: can unelected technocrats be trusted with this much power over people\'s lives?',
    color: PURPLE,
  },
];

// ── Gold Standard & Bretton Woods ───────────────────────────────────────────

const GOLD_STANDARD_TIMELINE: TimelineEntry[] = [
  {
    year: '1821',
    title: 'Britain Adopts the Gold Standard',
    description:
      'Britain formally pegged the pound sterling to a fixed quantity of gold — £3 17s 10½d per troy ounce. Any holder of banknotes could demand gold in exchange. The gold standard provided extraordinary monetary stability: the purchasing power of the pound was roughly the same in 1914 as in 1821. It also imposed discipline — governments couldn\'t print money freely because every banknote had to be backed by gold reserves. As the world\'s dominant economy, Britain\'s adoption pulled other nations onto gold, creating a de facto international monetary system.',
    color: GOLD,
  },
  {
    year: '1870s–1914',
    title: 'The Classical Gold Standard',
    description:
      'By the 1870s, most major economies had adopted the gold standard, creating a unified global monetary system. Exchange rates were fixed (since each currency was defined in gold), international trade was frictionless, and capital flowed freely across borders. It was globalization\'s first golden age. But the system had a deflationary bias — economic growth required more money, but gold supply grew slowly. Farmers and debtors suffered from falling prices (William Jennings Bryan\'s famous "Cross of Gold" speech in 1896). The gold standard served creditors and industrial nations; it punished everyone else.',
    color: AMBER,
  },
  {
    year: '1944',
    title: 'Bretton Woods: Dollar as Gold',
    description:
      'In July 1944, delegates from 44 nations met at the Mount Washington Hotel in Bretton Woods, New Hampshire, to design the postwar monetary system. The agreement: the US dollar would be pegged to gold at $35/ounce, and all other currencies would be pegged to the dollar. The dollar became "as good as gold" — the foundation of the global financial system. Bretton Woods also created the IMF and World Bank. The system worked as long as the US maintained fiscal discipline and held enough gold to back its dollars. It didn\'t.',
    color: INDIGO,
  },
  {
    year: 'August 15, 1971',
    title: 'The Nixon Shock: Goodbye Gold',
    description:
      'By 1971, the US had printed far more dollars than its gold reserves could support — funding the Vietnam War and Great Society programs. Foreign governments, led by France, began demanding gold for their dollars. On August 15, President Nixon announced that the US would no longer convert dollars to gold. The announcement was made on a Sunday evening to prevent market panic. It was supposed to be temporary. It was permanent. For the first time in history, the entire global monetary system was based on fiat currency — money backed by nothing but government credibility. The dollar\'s value would now float, determined by markets, not gold.',
    color: CRIMSON,
  },
];

// ── Inflation & Hyperinflation ──────────────────────────────────────────────

const HYPERINFLATION_INSIGHTS: InsightEntry[] = [
  {
    label: 'Weimar Germany (1921–1923)',
    detail:
      'Germany\'s Weimar Republic printed money to pay WWI reparations, sparking the most famous hyperinflation in history. At its peak in November 1923, prices doubled every 3.7 days. A loaf of bread cost 200 billion marks. Workers were paid twice daily and rushed to spend their wages before they became worthless. Children played with bundles of worthless banknotes. The psychological trauma — watching a lifetime of savings become worthless in weeks — helped fuel the rise of Hitler. Weimar taught the world that hyperinflation doesn\'t just destroy money; it destroys social trust.',
  },
  {
    label: 'Zimbabwe (2007–2009)',
    detail:
      'Robert Mugabe\'s government printed money to fund land seizures and political patronage. Inflation reached 79.6 billion percent per month in November 2008 — the second-worst hyperinflation ever recorded. The government printed 100-trillion-dollar banknotes that couldn\'t buy a bus ticket. The Zimbabwean dollar was abandoned entirely; the country adopted the US dollar and South African rand. The economy only stabilized when the government lost the ability to print its own currency — proving that sometimes the best monetary policy is no monetary policy at all.',
  },
  {
    label: 'Venezuela (2016–present)',
    detail:
      'Venezuela\'s hyperinflation — driven by oil-dependent economic collapse, price controls, and money printing — reached an estimated 1.7 million percent in 2018. The bolívar became functionally worthless. Venezuelans carried cash in backpacks and weighed rather than counted it. The government issued a new currency (bolívar soberano) at 100,000:1 — which also inflated away. Millions of Venezuelans fled the country. The crisis demonstrated that hyperinflation in the 21st century creates refugee crises: when your money dies, you leave.',
  },
  {
    label: 'The Pattern',
    detail:
      'Every hyperinflation follows the same script: (1) Government spending exceeds revenue. (2) Government prints money to cover the gap. (3) Currency loses value, prices rise. (4) Government prints more to keep up. (5) Feedback loop accelerates until the currency is worthless. (6) New currency is introduced, often pegged to a foreign currency or gold. The pattern has repeated from ancient Rome to modern Zimbabwe. The lesson is simple and universally ignored: you cannot create real wealth by printing money.',
  },
];

// ── Credit & Debt ───────────────────────────────────────────────────────────

const CREDIT_INSIGHTS: InsightEntry[] = [
  {
    label: 'Debt Is Older Than Coins',
    detail:
      'The oldest written records — Sumerian clay tablets from ~3500 BCE — are debt records. "Owe 3 sila of barley, to be repaid at harvest." Debt predates coins by 3,000 years. The idea that money evolved from barter is largely myth; more likely, money evolved from systems of credit and obligation. Ancient temples and palaces kept accounts of who owed what to whom. Coins were a later innovation for impersonal, one-time transactions — debt was the original money.',
  },
  {
    label: 'Fractional Reserve Banking',
    detail:
      'Goldsmiths in 17th-century London discovered that depositors rarely all withdrew their gold at the same time. A goldsmith holding 100 pounds of gold could safely lend out 90 pounds and keep 10 in reserve. The receipts he issued for the lent gold circulated as money — meaning 100 pounds of real gold now supported 190 pounds of "money" in circulation. This is fractional reserve banking: the ability of banks to create money by lending. Modern banks typically keep reserves of 0–10%, meaning $100 in deposits can support $1,000+ in loans. Most money in modern economies is created this way — not printed by governments, but lent into existence by banks.',
  },
  {
    label: 'The Credit Card Revolution',
    detail:
      'In 1950, Frank McNamara forgot his wallet at a New York restaurant. Embarrassed, he created the Diners Club card — the first general-purpose charge card. Bank of America launched the BankAmericard (later Visa) in 1958 by mailing unsolicited cards to 60,000 residents of Fresno, California. Credit cards transformed consumer behavior: spending became frictionless, impulse purchases soared, and personal debt exploded. Americans now carry over $1 trillion in credit card debt. The card in your wallet is arguably the most consequential financial innovation of the 20th century — for better and worse.',
  },
  {
    label: 'The 2008 Financial Crisis',
    detail:
      'Banks created complex debt instruments (mortgage-backed securities, collateralized debt obligations) that disguised the risk of subprime mortgages. When housing prices fell, the entire edifice collapsed. Lehman Brothers failed. Global credit froze. Governments spent trillions on bailouts. The crisis proved that debt innovation can be as dangerous as it is profitable — and that when debt becomes too complex for even bankers to understand, catastrophe follows. Satoshi Nakamoto embedded a headline about bank bailouts in Bitcoin\'s genesis block as a direct response.',
  },
];

// ── Cryptocurrency ──────────────────────────────────────────────────────────

const CRYPTO_TIMELINE: TimelineEntry[] = [
  {
    year: '1983–2008',
    title: 'The Cypherpunk Precursors',
    description:
      'The idea of digital cash didn\'t begin with Bitcoin. David Chaum proposed "ecash" in 1983 — anonymous digital payments using cryptographic blind signatures. Wei Dai\'s "b-money" (1998) and Nick Szabo\'s "bit gold" (1998) proposed decentralized digital currencies with proof-of-work. Adam Back\'s Hashcash (1997) used computational puzzles to prevent email spam — the direct ancestor of Bitcoin\'s mining mechanism. These cypherpunks — cryptographers who believed privacy was essential to a free society — laid the intellectual groundwork. Satoshi Nakamoto solved the final puzzle: preventing double-spending without a central authority.',
    color: PURPLE,
  },
  {
    year: 'January 3, 2009',
    title: 'Bitcoin: The Genesis Block',
    description:
      'Satoshi Nakamoto — a pseudonym; the real identity remains unknown — mined Bitcoin\'s first block, embedding the message: "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks." The political statement was unmistakable. Bitcoin proposed an alternative to the entire banking system: a decentralized, peer-to-peer electronic cash system with a fixed supply of 21 million coins, no central authority, and no possibility of bailouts or money printing. Whether you see it as digital gold, a speculative bubble, or the future of money depends largely on how much you trust institutions.',
    color: GOLD,
  },
  {
    year: '2013–2021',
    title: 'The Crypto Ecosystem Expands',
    description:
      'Ethereum (2015) added programmable "smart contracts" — self-executing agreements on a blockchain. This spawned decentralized finance (DeFi), non-fungible tokens (NFTs), and thousands of alternative cryptocurrencies. Bitcoin surged from $1 (2011) to $69,000 (2021). El Salvador adopted Bitcoin as legal tender (2021). But the ecosystem also produced spectacular frauds: Mt. Gox collapse (2014, $460M lost), the ICO mania (2017), and the FTX implosion (2022, $8B in customer funds missing). Crypto simultaneously represents monetary innovation and a cautionary tale about unregulated markets.',
    color: TEAL,
  },
  {
    year: '2020s',
    title: 'CBDCs and the Future',
    description:
      'Central Bank Digital Currencies (CBDCs) represent governments\' response to crypto: digital money issued by central banks, combining the convenience of digital payment with the stability (and control) of government currency. China\'s digital yuan is the most advanced, with pilot programs covering hundreds of millions of users. The European Central Bank is developing a digital euro. CBDCs raise profound questions: should governments have real-time visibility into every transaction? Could they program money to expire, forcing spending? The future of money will be digital — the question is whether it will be decentralized (crypto) or centralized (CBDCs).',
    color: INDIGO,
  },
];

// ── Monetary Theories ───────────────────────────────────────────────────────

const THEORY_FIGURES: FigureEntry[] = [
  {
    name: 'Mercantilism (16th–18th century)',
    years: 'Dominant era: 1500s–1700s',
    contribution:
      'Wealth equals gold and silver. Nations should export more than they import, accumulating precious metals. Mercantilism drove colonialism (seize gold mines), trade wars (block imports), and the slave trade (maximize plantation exports). Adam Smith demolished it intellectually in "The Wealth of Nations" (1776), arguing that real wealth is productive capacity, not hoarded metal. But mercantilist thinking never fully died — modern trade wars and obsession with trade surpluses echo the same logic.',
  },
  {
    name: 'Quantity Theory of Money',
    years: 'Bodin (1568) → Fisher (1911) → Friedman (1960s)',
    contribution:
      'MV = PQ — the money supply (M) times velocity (V) equals the price level (P) times real output (Q). If you double the money supply and nothing else changes, prices double. Jean Bodin first noticed this when Spanish silver caused European inflation. Irving Fisher formalized it. Milton Friedman made it the centerpiece of monetarism: "Inflation is always and everywhere a monetary phenomenon." The theory is powerful but incomplete — velocity isn\'t constant, and money supply is hard to define in a world of complex financial instruments.',
  },
  {
    name: 'Keynesian Economics',
    years: 'John Maynard Keynes, 1936',
    contribution:
      '"The General Theory of Employment, Interest and Money" argued that market economies don\'t self-correct — they can get stuck in prolonged depressions. Government should spend during recessions (even running deficits) to compensate for collapsed private demand. Keynes transformed monetary policy: central banks should actively manage economies, not just maintain gold reserves. His ideas dominated from the 1940s through the 1970s, were challenged by monetarism and stagflation, and roared back after the 2008 crisis. The debate between Keynesians and their critics remains the central argument in monetary economics.',
  },
  {
    name: 'Modern Monetary Theory (MMT)',
    years: 'Mosler, Wray, Kelton — 2010s–present',
    contribution:
      'MMT argues that governments that issue their own currency can never "run out of money" — they can always print more. The real constraint isn\'t the deficit; it\'s inflation. Governments should spend whatever is needed to achieve full employment, using taxes (not borrowing) to control inflation. Critics call it a recipe for hyperinflation. Proponents say it simply describes how modern fiat money actually works. MMT became politically influential when Alexandria Ocasio-Cortez cited it to justify the Green New Deal. Whether it\'s dangerous nonsense or a paradigm shift depends on whom you ask.',
  },
];

// ── Master Timeline ─────────────────────────────────────────────────────────

const MASTER_TIMELINE: TimelineEntry[] = [
  { year: '~9000 BCE', title: 'Cattle used as currency', description: 'Pastoral societies count wealth in livestock — "pecunia" from "pecus."', color: AMBER },
  { year: '~6000 BCE', title: 'Barley standard in Mesopotamia', description: 'Sumerian temples record debts and wages in barley measures.', color: GOLD },
  { year: '~3000 BCE', title: 'Mesopotamian shekel', description: 'First standardized weight-based monetary system — 8.3g of silver.', color: SILVER_METAL },
  { year: '~3000 BCE', title: 'Cowrie shells as currency', description: 'Begin 3,000+ year reign as the world\'s most widespread currency.', color: TEAL },
  { year: '~640 BCE', title: 'First Lydian coins', description: 'Electrum coins stamped with royal seal — counting replaces weighing.', color: GOLD },
  { year: '~500 BCE', title: 'Athenian "owls" dominate trade', description: 'Silver drachma becomes the dollar of the ancient Mediterranean.', color: INDIGO },
  { year: '~211 BCE', title: 'Roman denarius introduced', description: 'Standard silver coin of an empire spanning Britain to Mesopotamia.', color: CRIMSON },
  { year: '64 CE', title: 'Nero debases the denarius', description: 'First in a 200-year debasement spiral — Rome\'s slow monetary death.', color: ROSE },
  { year: '7th c.', title: 'Tang "flying money"', description: 'Paper certificates for long-distance trade — paper represents metal.', color: CRIMSON },
  { year: '~1024', title: 'Song Dynasty jiaozi', description: 'World\'s first government-issued paper currency. 700 years ahead of Europe.', color: GOLD },
  { year: '1397', title: 'Medici Bank founded', description: 'Modern banking begins — holding companies, bills of exchange, papal finance.', color: EMERALD },
  { year: '1545', title: 'Potosí silver discovered', description: 'The mountain that reshaped global economics — and killed 8 million workers.', color: SILVER_METAL },
  { year: '1609', title: 'Bank of Amsterdam', description: 'Proto-central bank stabilizes Dutch monetary chaos.', color: TEAL },
  { year: '1694', title: 'Bank of England chartered', description: 'The template for central banking: lend to the government, issue notes.', color: GOLD },
  { year: '1821', title: 'British gold standard', description: '£ pegged to gold — a century of monetary stability begins.', color: AMBER },
  { year: '1913', title: 'Federal Reserve created', description: 'America\'s third attempt at a central bank — this one sticks.', color: INDIGO },
  { year: '1923', title: 'Weimar hyperinflation peaks', description: 'A loaf of bread costs 200 billion marks. Social trust collapses.', color: ROSE },
  { year: '1944', title: 'Bretton Woods Agreement', description: 'Dollar = gold. All other currencies pegged to the dollar.', color: INDIGO },
  { year: '1950', title: 'Diners Club card', description: 'The first general-purpose charge card — consumer credit goes mainstream.', color: ORANGE },
  { year: '1971', title: 'Nixon ends gold convertibility', description: 'All money becomes fiat — backed by nothing but government credibility.', color: CRIMSON },
  { year: '2008', title: 'Global financial crisis', description: 'Complex debt instruments collapse — $trillions in bailouts. Trust shatters.', color: ROSE },
  { year: '2009', title: 'Bitcoin genesis block', description: 'Satoshi Nakamoto mines the first block. "Chancellor on brink of second bailout."', color: GOLD },
  { year: '2021', title: 'El Salvador adopts Bitcoin', description: 'First nation to make cryptocurrency legal tender.', color: GREEN },
  { year: '2020s', title: 'CBDCs emerge', description: 'Central banks build digital currencies — the next chapter begins.', color: PURPLE },
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
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor, marginBottom: 12 }}>
          {icon} {title}
        </h2>
        <p style={{ color: ASH, lineHeight: 1.7, maxWidth: 800, marginBottom: 28 }}>
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
          key={e.year + e.title}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          style={{ borderLeft: `3px solid ${e.color}`, paddingLeft: 18 }}
        >
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: e.color, marginRight: 8 }} />
          <p style={{ display: 'inline', color: e.color, fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {e.year}
          </p>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f1f5f9', marginTop: 4, marginBottom: 6 }}>
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
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 16,
    }}>
      {items.map((item, i) => (
        <motion.div
          key={item.label}
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
          <h4 style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 8, fontSize: '1rem' }}>
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

const FIGURE_COLORS = [EMERALD, GOLD, CRIMSON, TEAL, INDIGO, ROSE, AMBER, GREEN, PURPLE, SKY];

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 16,
    }}>
      {figures.map((f, i) => (
        <motion.div
          key={f.name}
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
          <h4 style={{ fontWeight: 600, color: FIGURE_COLORS[i % FIGURE_COLORS.length], marginBottom: 2, fontSize: '1.05rem' }}>
            {f.name}
          </h4>
          <p style={{ fontSize: '0.8rem', color: SLATE, marginBottom: 8 }}>
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

function MilestoneTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {entries.map((e, i) => (
        <motion.div
          key={e.year + e.title}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.3, delay: i * 0.03 }}
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
            borderLeft: `2px solid ${e.color}44`,
            paddingLeft: 14,
            paddingBottom: 4,
          }}
        >
          <span style={{
            flexShrink: 0,
            width: 80,
            color: e.color,
            fontWeight: 700,
            fontSize: '0.82rem',
            fontFamily: 'monospace',
            paddingTop: 2,
          }}>
            {e.year}
          </span>
          <div>
            <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.92rem' }}>
              {e.title}
            </span>
            <span style={{ color: SLATE, fontSize: '0.85rem', marginLeft: 8 }}>
              {e.description}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function HistoryOfMoneyPage() {
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070e22',
      color: '#f1f5f9',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* Back link */}
        <div style={{ paddingTop: 28 }}>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </div>

        {/* Hero section */}
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
              background: `linear-gradient(135deg, ${GOLD}, ${EMERALD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            From Cattle to Crypto — The History of Money (~9000 BCE–Present)
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p style={{ color: ASH, lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 800, marginBottom: 16 }}>
              Money is humanity's most powerful abstraction. A dollar bill has no intrinsic value — it's cotton and ink. A Bitcoin is a number in a distributed ledger. Yet these abstractions move armies, build civilizations, and shape the daily lives of eight billion people. The history of money is the history of trust: who creates it, who controls it, and what happens when that trust breaks down.
            </p>
            <p style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 800 }}>
              From cattle traded on Neolithic plains to algorithmic stablecoins on blockchains, money has taken hundreds of forms across five millennia. Each transformation — cowrie shells to coins, coins to paper, paper to digits, digits to crypto — solved old problems and created new ones. This is the story of how humans learned to agree that something worthless could be worth everything, and what happened when that agreement failed.
            </p>
          </motion.div>
        </header>

        {/* Opening callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: `1px solid ${GOLD}44`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <h3 style={{ color: GOLD, fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
            The Core Paradox of Money
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>
            Money works because everyone believes it works. A $100 bill is worth $100 only because the person you hand it to believes someone else will accept it at the same value. This circular logic — money is valuable because people treat it as valuable — is simultaneously money's greatest strength and its fundamental vulnerability. Every monetary crisis in history is, at root, a crisis of belief.
          </p>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ marginBottom: 8 }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 12,
          }}>
            {KEY_STATS.map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 8,
                  padding: '14px 16px',
                }}
              >
                <span style={{ color: GOLD, fontWeight: 700, fontSize: '1.1rem' }}>
                  {stat.label}
                </span>
                <p style={{ color: ASH, fontSize: '0.85rem', marginTop: 4, lineHeight: 1.5 }}>
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 1: Barter */}
        <SectionWrapper
          id="barter"
          icon="🤝"
          title="Before Money: The Barter Problem"
          accentColor={AMBER}
          intro="Every economics textbook tells the same story: before money, people bartered. I'll give you three fish for your basket of wheat. It's a neat story — and it's mostly wrong. But barter's real limitations explain why money was inevitable."
        >
          <InsightGrid items={BARTER_INSIGHTS} />
        </SectionWrapper>

        {/* Section 2: Commodity Money */}
        <SectionWrapper
          id="commodity-money"
          icon="🐄"
          title="Commodity Money: When Things Were Money (~9000–600 BCE)"
          accentColor={COPPER}
          intro="Before coins existed, people used real things as money — anything scarce, durable, portable, and universally desired. Cattle, grain, shells, salt, and dozens of other commodities served as currency across cultures and millennia. Each choice reveals what a society valued most."
        >
          <TimelineCard entries={COMMODITY_TIMELINE} />
        </SectionWrapper>

        {/* Section 3: First Coins */}
        <SectionWrapper
          id="first-coins"
          icon="🪙"
          title="The Coin Revolution (~3000–200 BCE)"
          accentColor={GOLD}
          intro="Coins solved commodity money's biggest problem: trust. Instead of weighing and testing metal for every transaction, a sovereign's stamp guaranteed the value. This single innovation — a lump of metal with an official mark — created portable, standardized, countable money and transformed economies across the ancient world."
        >
          <TimelineCard entries={COINS_TIMELINE} />
        </SectionWrapper>

        {/* Section 4: Roman Debasement */}
        <SectionWrapper
          id="debasement"
          icon="⚖️"
          title="Roman Debasement: The First Inflation Spiral (64–476 CE)"
          accentColor={CRIMSON}
          intro="Rome's monetary collapse is the ur-story of inflation — and the reason central bankers still lose sleep. It started with a small, seemingly reasonable decision: reduce the silver content of coins by 5% to fund the empire's expenses. Over two centuries, that 5% became 98%. The Roman economy never recovered."
        >
          <InsightGrid items={DEBASEMENT_INSIGHTS} />
        </SectionWrapper>

        {/* Section 5: Chinese Paper Money */}
        <SectionWrapper
          id="paper-money"
          icon="📜"
          title="Chinese Paper Money: The Greatest Monetary Innovation (7th–15th century)"
          accentColor={CRIMSON}
          intro="China invented paper money 700 years before Europe. The idea that a piece of paper could represent value — that money could be pure abstraction, divorced from any physical commodity — was one of the most radical innovations in human history. And China also discovered the fatal flaw: the temptation to print too much."
        >
          <TimelineCard entries={PAPER_MONEY_TIMELINE} />
        </SectionWrapper>

        {/* Section 6: Medieval Banking */}
        <SectionWrapper
          id="medieval-banking"
          icon="🏦"
          title="Medieval Banking: Money Gets Sophisticated (13th–15th century)"
          accentColor={EMERALD}
          intro="Italian city-states invented modern banking — not in marble palaces, but on wooden benches in medieval marketplaces. Double-entry bookkeeping, bills of exchange, letters of credit, deposit banking: tools that made international trade possible and created fortunes that rivaled kings."
        >
          <InsightGrid items={BANKING_INSIGHTS} />
        </SectionWrapper>

        {/* Section 7: Spanish Silver */}
        <SectionWrapper
          id="spanish-silver"
          icon="⛏️"
          title="Spanish Silver: The First Global Currency (1500s–1700s)"
          accentColor={SILVER_METAL}
          intro="When Spain discovered the silver mines of Potosí, it triggered the first truly global monetary shock. Silver flowed from Bolivia to Seville to Shanghai, tripling prices across Europe, reshaping trade routes, and proving that money supply has real economic consequences — a lesson the world keeps learning."
        >
          <InsightGrid items={SILVER_INSIGHTS} />
        </SectionWrapper>

        {/* Section 8: Central Banking */}
        <SectionWrapper
          id="central-banking"
          icon="🏛️"
          title="Central Banking: The Lender of Last Resort (1609–present)"
          accentColor={INDIGO}
          intro="Central banks are the most powerful economic institutions ever created — unelected bodies that control the money supply, set interest rates, and can create or destroy trillions with a policy decision. They were born from crisis, designed to prevent crisis, and have sometimes caused crisis. Their story is the story of modern money itself."
        >
          <TimelineCard entries={CENTRAL_BANK_TIMELINE} />
        </SectionWrapper>

        {/* Section 9: Gold Standard */}
        <SectionWrapper
          id="gold-standard"
          icon="🥇"
          title="The Gold Standard and Its Death (1821–1971)"
          accentColor={GOLD}
          intro="For 150 years, gold anchored the global monetary system — providing stability, discipline, and a constraint on government spending. Its abandonment in 1971 was the most consequential monetary event of the 20th century: the moment all money became fiat, backed by nothing but trust."
        >
          <TimelineCard entries={GOLD_STANDARD_TIMELINE} />
        </SectionWrapper>

        {/* Section 10: Hyperinflation */}
        <SectionWrapper
          id="hyperinflation"
          icon="📉"
          title="When Money Dies: Inflation and Hyperinflation"
          accentColor={ROSE}
          intro="Hyperinflation is what happens when the social contract underlying money breaks completely. Prices don't just rise — they explode, doubling every few days, destroying savings, contracts, and social cohesion. Every case follows the same pattern, and every case leaves the same scar: a generation that never trusts institutions again."
        >
          <InsightGrid items={HYPERINFLATION_INSIGHTS} />
        </SectionWrapper>

        {/* Section 11: Credit & Debt */}
        <SectionWrapper
          id="credit-debt"
          icon="💳"
          title="Credit, Debt, and the Money Banks Create"
          accentColor={ORANGE}
          intro="Most people think governments print money. In reality, most money in modern economies is created by commercial banks when they make loans. This system — fractional reserve banking — is both the engine of economic growth and the source of its most devastating crashes. The story of credit is the story of leverage: amplifying both prosperity and catastrophe."
        >
          <InsightGrid items={CREDIT_INSIGHTS} />
        </SectionWrapper>

        {/* Section 12: Cryptocurrency */}
        <SectionWrapper
          id="cryptocurrency"
          icon="₿"
          title="Cryptocurrency: Money Without the State (2009–present)"
          accentColor={PURPLE}
          intro="In the wreckage of the 2008 financial crisis, an anonymous programmer proposed something radical: a monetary system with no central authority, no banks, no possibility of bailouts or debasement. Bitcoin and its descendants represent either the future of money or history's largest speculative bubble — and possibly both."
        >
          <TimelineCard entries={CRYPTO_TIMELINE} />
        </SectionWrapper>

        {/* Section 13: Monetary Theories */}
        <SectionWrapper
          id="monetary-theory"
          icon="📚"
          title="Monetary Theories: How We Think About Money"
          accentColor={TEAL}
          intro="For five centuries, economists have argued about what money is, how it works, and how governments should manage it. These aren't academic debates — they shape policies that affect billions of people. Every central bank decision, every fiscal stimulus, every inflation target reflects a theoretical commitment, even when policymakers don't realize it."
        >
          <FigureGrid figures={THEORY_FIGURES} />
        </SectionWrapper>

        {/* Section 14: Master Timeline */}
        <SectionWrapper
          id="timeline"
          icon="📅"
          title="Timeline: 11,000 Years of Money"
          accentColor={GOLD}
          intro="From cattle on Neolithic plains to central bank digital currencies — every major milestone in the history of money, compressed into a single chronology."
        >
          <MilestoneTimeline entries={MASTER_TIMELINE} />
        </SectionWrapper>

        {/* Footer */}
        <footer style={{
          padding: '48px 0 64px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
        }}>
          <p style={{ color: SLATE, fontSize: '0.9rem', lineHeight: 1.6 }}>
            Money is the most successful fiction in human history. Every coin, banknote, and Bitcoin
            is a collective agreement to pretend that something intrinsically worthless has value.
            This fiction has built civilizations, funded wars, sparked revolutions, and connected
            eight billion people in a web of mutual obligation. The next chapter — digital, decentralized,
            programmable — is already being written.
          </p>
          <div style={{ marginTop: 24 }}>
            <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
              ← Back to Timeline
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
