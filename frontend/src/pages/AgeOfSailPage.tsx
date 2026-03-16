/**
 * AgeOfSailPage — comprehensive deep-dive on the Age of Sail (~1400–1870).
 *
 * Route: /age-of-sail
 *
 * Sections:
 *  1. Hero — headline, overview of the era that connected the globe
 *  2. Origins — caravel, lateen sail, astrolabe, compass, portolan charts
 *  3. Portuguese Pioneers — Henry the Navigator, Bartholomeu Dias, Vasco da Gama
 *  4. Spanish Expansion — Columbus, Magellan, Manila Galleons, Treaty of Tordesillas
 *  5. Dutch Golden Age — VOC, first stock exchange, spice trade dominance
 *  6. English Sea Power — Drake, Hawkins, defeat of Spanish Armada (1588)
 *  7. Navigation — dead reckoning → celestial nav → Harrison's chronometer
 *  8. Naval Warfare — broadside tactics, ship ratings, Trafalgar (1805)
 *  9. Life at Sea — hierarchy, scurvy, press gangs, discipline, mutinies
 * 10. The Slave Trade — triangular trade, Middle Passage, economic legacy
 * 11. Pirates & Privateers — letters of marque, Tortuga, Blackbeard, Roberts
 * 12. East India Companies — British EIC, Dutch VOC, corporate colonialism
 * 13. End of the Age — steam power, Suez Canal (1869), iron hulls
 * 14. Legacy — maritime law, global trade routes, colonial consequences
 * 15. Timeline of Key Voyages, Battles, and Figures
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const NAVY = '#1e3a5f';
const OCEAN = '#0ea5e9';
const TEAL = '#14b8a6';
const GOLD = '#f59e0b';
const CRIMSON = '#dc2626';
const AMBER = '#d97706';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const ROSE = '#f43f5e';
const GREEN = '#22c55e';
const INDIGO = '#6366f1';
const PURPLE = '#a855f7';
const RED = '#ef4444';
const COPPER = '#c2410c';
const SAND = '#d4a574';
const BLUE = '#3b82f6';
const STEEL = '#64748b';
const MAHOGANY = '#7c2d12';

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
// Section data
// ─────────────────────────────────────────────────────────────────────────────

// ── Origins ─────────────────────────────────────────────────────────────────

const ORIGINS_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Caravel — Ship That Changed History',
    detail:
      'The Portuguese caravel was the technological breakthrough that launched the Age of Sail. Small (50–80 tons), nimble, and capable of sailing close to the wind thanks to its lateen (triangular) rigging, the caravel could explore shallow coastal waters, tack against Atlantic trade winds, and — crucially — sail home again. Earlier European ships could ride the wind south along the African coast but couldn\'t beat back north against it. The caravel solved this problem. Columbus\'s Niña and Pinta were caravels. Without this humble ship, the Age of Exploration never begins.',
  },
  {
    label: 'The Lateen Sail — Borrowed from the Arab World',
    detail:
      'The triangular lateen sail, adapted from Arab dhows encountered during the Crusades and Mediterranean trade, allowed ships to sail at sharp angles to the wind — "close-hauled" in sailing terminology. European square-rigged vessels could only sail efficiently with the wind behind them. The lateen sail, combined with the square rig in hybrid "caravel redonda" configurations, gave Portuguese explorers the ability to navigate the complex wind patterns of the open Atlantic. It was the crucial piece of technology transfer from the Islamic world that enabled European expansion.',
  },
  {
    label: 'The Magnetic Compass',
    detail:
      'Chinese in origin (first described c. 1088), the magnetic compass reached Europe via Arab intermediaries by the 12th century. Before the compass, Mediterranean sailors relied on landmarks, stars, and dead reckoning — fine for coastal sailing in the relatively predictable Mediterranean, but useless on the open Atlantic under overcast skies. The dry pivot compass (needle on a pin, rotating inside a compass rose card) became standard on Portuguese ships by the early 1400s. Combined with portolan charts — detailed coastal maps with compass bearing lines — it transformed navigation from art to science.',
  },
  {
    label: 'The Astrolabe and Cross-Staff',
    detail:
      'The mariner\'s astrolabe (simplified from the complex Islamic astronomical astrolabe) and the cross-staff allowed navigators to measure the altitude of Polaris or the sun above the horizon, giving them their latitude — their north-south position. This was revolutionary for open-ocean sailing. A captain who knew his latitude could run down a parallel: sail to the right latitude, turn east or west, and follow it to the destination. Longitude (east-west position) remained unsolvable for another 300 years, making the latitude-running technique the backbone of all Age of Sail navigation.',
  },
  {
    label: 'Portolan Charts and Rutters',
    detail:
      'Portolan charts — detailed coastal maps crisscrossed with rhumb lines (compass bearings) — originated in 13th-century Italy and became essential tools for Portuguese exploration. Complementing them were "rutters" (Portuguese: roteiros) — written sailing directions recording distances, depths, currents, landmarks, and anchorages compiled by generations of pilots. These were state secrets: the Portuguese crown classified its rutters and charts, making the Casa da Índia (House of India) one of history\'s first intelligence agencies. The information asymmetry they created was a strategic weapon as powerful as any cannon.',
  },
];

// ── Portuguese Pioneers ──────────────────────────────────────────────────────

const PORTUGUESE_TIMELINE: TimelineEntry[] = [
  {
    year: '1415',
    title: 'Capture of Ceuta — The Starting Gun',
    description:
      'The Portuguese conquest of Ceuta, a Muslim trading port on the North African coast opposite Gibraltar, marked the beginning of European overseas expansion. The young Prince Henry (later "the Navigator") participated in the assault and became fascinated by the trans-Saharan gold and slave trade routes he learned about from captured merchants. He would spend the next 45 years systematically sending expeditions down the African coast, seeking a sea route to bypass the Muslim middlemen who controlled the overland gold trade.',
    color: GOLD,
  },
  {
    year: '1418–1460',
    title: 'Henry the Navigator — Systematic Exploration',
    description:
      'Prince Henry never sailed himself, but he organized and financed dozens of voyages from his base at Sagres on Portugal\'s southwestern tip. He gathered cartographers, astronomers, and shipbuilders; he insisted that each captain sail farther than the last and report back what they found. His captains discovered and colonized Madeira (1419) and the Azores (1427), rounded the feared Cape Bojador (1434) — beyond which medieval legend said the sea boiled — and reached the Senegal River and Cape Verde by the 1440s. Henry created the template for state-sponsored exploration that every European power would follow.',
    color: TEAL,
  },
  {
    year: '1488',
    title: 'Bartholomeu Dias Rounds the Cape of Good Hope',
    description:
      'After decades of incremental progress down the African coast, Bartholomeu Dias became the first European to sail around the southern tip of Africa. Blown south by a violent storm, his ships rounded the Cape without seeing it, and Dias only realized he\'d passed Africa when the coastline began trending northeast. He wanted to continue to India, but his exhausted crew forced him to turn back. He named it the "Cape of Storms," but King João II renamed it the "Cape of Good Hope" — the hope of reaching India by sea was now a certainty, not a dream.',
    color: OCEAN,
  },
  {
    year: '1497–1498',
    title: 'Vasco da Gama — The Route to India',
    description:
      'Vasco da Gama\'s voyage from Lisbon to Calicut (modern Kozhikode, India) was the most important single voyage in the Age of Sail. Departing with four ships and 170 men, da Gama swung far west into the Atlantic to catch favorable winds (a technique called the "volta do mar"), rounded the Cape of Good Hope, sailed up the East African coast — where he encountered sophisticated Muslim trading cities that had been trading with India and China for centuries — and crossed the Indian Ocean with the help of an Arab pilot. He reached Calicut on May 20, 1498, opening a direct sea route between Europe and Asia that destroyed the overland monopolies that had enriched Venice and the Ottoman Empire.',
    color: GOLD,
  },
  {
    year: '1500–1550',
    title: 'The Portuguese Maritime Empire',
    description:
      'Within 50 years of da Gama\'s voyage, tiny Portugal (population ~1.5 million) controlled a chain of fortified trading posts stretching from Brazil to Japan. Afonso de Albuquerque conquered Goa (1510), Malacca (1511), and Hormuz (1515), seizing control of the three critical chokepoints of Indian Ocean trade. Portuguese ships mounted cannons that outmatched anything in Asian waters. The Estado da Índia (State of India) was not a territorial empire — Portugal lacked the manpower — but a network of naval bases, trade monopolies, and cartazes (licensing permits) that forced Asian merchants to pay for the privilege of trading in their own ocean.',
    color: TEAL,
  },
];

const PORTUGUESE_FIGURES: FigureEntry[] = [
  {
    name: 'Prince Henry the Navigator',
    years: '1394–1460',
    contribution:
      'Organized and financed systematic Portuguese exploration of the West African coast for 40+ years. Never sailed himself, but created the institutional framework — financing, cartography, ship design, pilot training — that made the Age of Exploration possible. The patron saint of state-sponsored R&D.',
  },
  {
    name: 'Bartholomeu Dias',
    years: 'c. 1450–1500',
    contribution:
      'First European to round the Cape of Good Hope (1488), proving that the Atlantic and Indian Oceans were connected and that a sea route to India was possible. Died in a storm off the Cape in 1500, ironically while sailing with Cabral\'s fleet that discovered Brazil.',
  },
  {
    name: 'Vasco da Gama',
    years: 'c. 1460–1524',
    contribution:
      'Completed the first direct European voyage to India (1497–1498), opening the spice trade sea route that would enrich Portugal for a century. Ruthless and violent — he bombarded Calicut, burned a ship full of Muslim pilgrims, and terrorized Indian Ocean shipping — but his voyage was the hinge point that connected Europe to Asia by sea.',
  },
  {
    name: 'Afonso de Albuquerque',
    years: '1453–1515',
    contribution:
      'The architect of the Portuguese maritime empire in Asia. Conquered Goa, Malacca, and Hormuz, establishing Portuguese control over the three key chokepoints of Indian Ocean trade. His strategy of controlling straits and harbors rather than conquering territory was a model of efficient imperialism that the Dutch and British would later copy.',
  },
];

// ── Spanish Expansion ────────────────────────────────────────────────────────

const SPANISH_TIMELINE: TimelineEntry[] = [
  {
    year: '1492',
    title: 'Columbus — The Accidental Discovery',
    description:
      'Christopher Columbus did not discover a new route to Asia — he discovered two continents that no European knew existed, and he died still insisting he\'d reached the outskirts of Japan. Sailing west from Spain with three small ships (the Santa María, Pinta, and Niña), he reached the Bahamas on October 12, 1492. His miscalculation of the Earth\'s circumference (he thought Asia was 2,400 miles west of the Canaries; the actual distance is 12,000 miles) was a spectacular error that happened to work because the Americas were in the way. The consequences — for indigenous peoples, for global trade, for the biological exchange between hemispheres — were incalculable.',
    color: CRIMSON,
  },
  {
    year: '1494',
    title: 'Treaty of Tordesillas — Dividing the World',
    description:
      'Pope Alexander VI, a Spaniard, drew a line down the Atlantic granting Spain everything west and Portugal everything east. The Treaty of Tordesillas adjusted this line to 370 leagues west of the Cape Verde Islands — which happened to give Portugal a bulge of South America that would become Brazil. Two nations with a combined population of about 10 million casually divided the entire non-Christian world between them, with no consultation of the billions of people who actually lived there. It was the founding act of European colonialism.',
    color: GOLD,
  },
  {
    year: '1519–1522',
    title: 'Magellan\'s Circumnavigation',
    description:
      'Ferdinand Magellan\'s expedition — five ships and 270 men — accomplished the first circumnavigation of the Earth, proving once and for all that the world was round and that a westward route to Asia existed. Magellan himself didn\'t make it: he was killed in the Philippines in April 1521, stabbed and hacked to death by warriors on the island of Mactan after intervening in a local conflict. Only one ship, the Victoria, with 18 emaciated survivors under Juan Sebastián Elcano, completed the circuit. The voyage proved that the Pacific was far vaster than anyone had imagined — Magellan\'s fleet spent 99 days crossing it, surviving on sawdust, rats, and ox-hide leather soaked in seawater.',
    color: OCEAN,
  },
  {
    year: '1565–1815',
    title: 'The Manila Galleons — 250 Years of Trans-Pacific Trade',
    description:
      'For 250 years, one or two enormous Spanish galleons (up to 2,000 tons) sailed annually between Manila in the Philippines and Acapulco in Mexico, carrying Chinese silk, porcelain, and spices west and Mexican silver east. This was the first regular trans-Pacific trade route and the link that completed the first truly global trading system. Chinese merchants in Manila exchanged goods for silver that lubricated the Chinese economy. The galleon route made Manila a global entrepôt and flooded China with New World silver — which some historians argue destabilized the Ming Dynasty.',
    color: AMBER,
  },
];

// ── Dutch Golden Age ─────────────────────────────────────────────────────────

const DUTCH_INSIGHTS: InsightEntry[] = [
  {
    label: 'The VOC — World\'s First Megacorporation',
    detail:
      'The Vereenigde Oost-Indische Compagnie (Dutch East India Company), founded in 1602, was the world\'s first joint-stock company — shareholders could buy and sell shares on the Amsterdam Stock Exchange (itself the world\'s first). At its peak, the VOC was the richest company in history: adjusted for inflation, its market capitalization reached an estimated $7.9 trillion. It had its own military (40,000 soldiers, 150 warships), the power to negotiate treaties, wage war, establish colonies, and mint coins. The VOC was not a trading company that happened to have an army — it was a sovereign corporate state.',
  },
  {
    label: 'The Spice Trade — Nutmeg Worth More Than Gold',
    detail:
      'The spice trade was the economic engine of the Age of Sail. Nutmeg, cloves, mace, and pepper from the Indonesian archipelago (the "Spice Islands") were worth more by weight than gold in European markets. A single successful voyage could return 400% profit. The Dutch fought wars — with the Portuguese, the English, and indigenous peoples — for monopoly control over the sources. Their most extreme act was the Banda Islands massacre of 1621, in which VOC governor Jan Pieterszoon Coen enslaved or killed virtually the entire population of the nutmeg-producing islands to enforce the Dutch monopoly.',
  },
  {
    label: 'Financial Innovation — The Birth of Modern Capitalism',
    detail:
      'The Dutch Golden Age produced financial instruments that underpin the global economy today. The Amsterdam Stock Exchange (1602) created a market for company shares. The Amsterdam Exchange Bank (1609) standardized currency and enabled reliable international payments. Dutch merchants invented futures contracts, options trading, short selling, and the first recorded speculative bubble (Tulip Mania, 1637). Dutch legal innovations in maritime insurance and limited liability made it possible to spread the enormous risks of intercontinental trade. Modern Wall Street is a direct descendant of 17th-century Amsterdam.',
  },
  {
    label: 'Dutch Reach — Global but Thin',
    detail:
      'At its height, the Dutch Republic (population ~2 million) controlled trading posts from New Amsterdam (New York) to Nagasaki, from the Cape of Good Hope to Batavia (Jakarta). Dutch was the only European language permitted in Japan for over 200 years. The Dutch established Cape Colony in South Africa (1652), colonized parts of Brazil, dominated the Baltic grain trade, and controlled the Atlantic slave trade for decades. But the Republic was always overstretched: too few people, too many commitments, and increasingly outcompeted by the much larger English and French empires.',
  },
];

// ── English Sea Power ────────────────────────────────────────────────────────

const ENGLISH_TIMELINE: TimelineEntry[] = [
  {
    year: '1560s–1580s',
    title: 'Drake, Hawkins, and the Sea Dogs',
    description:
      'England\'s rise to naval power began not with its Royal Navy but with its pirates — politely called "sea dogs" or "privateers." Francis Drake circumnavigated the globe (1577–1580), raiding Spanish ports and treasure ships along the way and returning with plunder worth £600,000 (roughly £300 million today). Queen Elizabeth I, an investor in his voyage, personally knighted him aboard the Golden Hind. John Hawkins pioneered English involvement in the slave trade and later redesigned the English fleet with lower, faster, more heavily armed ships that would prove decisive against the Spanish Armada.',
    color: CRIMSON,
  },
  {
    year: '1588',
    title: 'Defeat of the Spanish Armada',
    description:
      'King Philip II of Spain sent 130 ships and 26,000 men to invade Protestant England. The "Invincible Armada" was one of the largest naval forces ever assembled. But everything went wrong: English ships — smaller, faster, with longer-range guns — harassed the Armada up the English Channel without letting it close to boarding range. Fire ships scattered the fleet at Gravelines. Then storms destroyed what the English hadn\'t. Fewer than half the Spanish ships returned home. The Armada\'s defeat did not end Spanish power overnight, but it shattered the myth of Spanish invincibility and announced England as a naval power.',
    color: OCEAN,
  },
  {
    year: '1600s–1700s',
    title: 'The Navigation Acts and Mercantilism',
    description:
      'England\'s rise to maritime supremacy was built on aggressive economic policy, not just naval battles. The Navigation Acts (1651–1696) required that all goods imported into English colonies be carried on English ships, effectively creating a closed trading system that enriched English merchants at the expense of Dutch and other competitors. Three Anglo-Dutch Wars (1652–1674) were fought largely over trade routes and naval dominance. England acquired New Amsterdam (renamed New York) in 1664. By 1700, England had replaced the Dutch Republic as the dominant maritime trading power.',
    color: BLUE,
  },
  {
    year: '1700s–1805',
    title: 'Britannia Rules the Waves',
    description:
      'The 18th century was the age of British naval supremacy. The Royal Navy grew to become the largest and most powerful fleet in the world, with global reach supported by a chain of naval bases (Gibraltar, Malta, Cape Town, Singapore, Hong Kong). Britain\'s naval dominance secured its colonial empire, protected its trade routes, and allowed it to project power anywhere on the globe. The culmination was Nelson\'s victory at Trafalgar (1805), which ended any serious naval challenge to British supremacy for a century.',
    color: GOLD,
  },
];

// ── Navigation ───────────────────────────────────────────────────────────────

const NAVIGATION_INSIGHTS: InsightEntry[] = [
  {
    label: 'Dead Reckoning — Educated Guessing',
    detail:
      'Before precision instruments, navigators used "dead reckoning" — estimating position by tracking direction (compass), speed (a log line thrown overboard and timed with a sandglass), and elapsed time. Errors accumulated rapidly: currents, wind shifts, and imprecise speed measurements meant that after weeks at sea, a ship could be hundreds of miles from where its navigator thought it was. Dead reckoning killed more sailors than enemy fire. Countless ships were wrecked on shores they didn\'t know were there.',
  },
  {
    label: 'Celestial Navigation — Finding Latitude',
    detail:
      'Measuring the angle of Polaris (or the noon sun) above the horizon gives latitude with reasonable accuracy. By the 1500s, navigators using astrolabes, cross-staffs, and later the backstaff and octant could determine their north-south position to within about 30 nautical miles. This made "latitude sailing" possible: sail to the correct latitude, then run east or west along it until you hit your destination. It was crude but it worked — most of the great voyages of discovery were accomplished with latitude sailing alone.',
  },
  {
    label: 'The Longitude Problem — 300 Years Unsolved',
    detail:
      'Longitude — east-west position — was the great unsolved problem of the Age of Sail. Unlike latitude, which can be measured from star positions, longitude requires knowing the exact time difference between your location and a reference point (because the Earth rotates 15° per hour). But no clock in the 17th century could keep accurate time on a rolling, temperature-changing ship. The inability to determine longitude caused catastrophic shipwrecks: in 1707, four Royal Navy ships struck the Isles of Scilly, killing nearly 2,000 men, because the fleet\'s navigators had their longitude wrong by 100 miles.',
  },
  {
    label: 'Harrison\'s Chronometer — Solved (1773)',
    detail:
      'John Harrison, a self-taught Yorkshire carpenter and clockmaker, spent 31 years building a series of increasingly precise marine timekeepers. His H4, completed in 1759, was a large pocket watch that kept time to within 5 seconds over 81 days at sea — accurate enough to determine longitude within one nautical mile. Despite this triumph, the Board of Longitude (dominated by astronomers who favored a rival celestial method) delayed his prize for years. Harrison finally received the full £20,000 Longitude Prize in 1773, at age 80, only after King George III personally intervened. His chronometer technology became standard by the 1800s, transforming navigation.',
  },
  {
    label: 'Charts, Sextants, and the Modern Era',
    detail:
      'By the late 18th century, navigators had all the tools they needed: the sextant (1757) for precise celestial measurements, Harrison\'s chronometer for longitude, detailed charts from voyages like Cook\'s, and published nautical almanacs with pre-calculated star positions. Captain James Cook\'s three voyages (1768–1779) demonstrated the power of this toolkit: he charted the Pacific with unprecedented accuracy, disproved the mythical southern continent, and suffered almost no losses to navigational error. The Age of Sail ended with navigation transformed from a dark art into an exact science.',
  },
];

// ── Naval Warfare ────────────────────────────────────────────────────────────

const WARFARE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Broadside Tactics — The Wall of Guns',
    detail:
      'The defining tactic of Age of Sail naval warfare was the broadside: a ship firing all its guns on one side simultaneously. Because cannons could only fire sideways through gun ports, fleet tactics revolved around getting your broadside to bear while avoiding the enemy\'s. The "line of battle" — ships sailing in a single-file line to maximize broadside firepower — became the standard formation. This is why capital warships were called "ships of the line." Battles were thunderous, smoke-choked affairs where fleets traded broadsides at ranges of 50–400 yards.',
  },
  {
    label: 'Rating System — Ships of the Line',
    detail:
      'The Royal Navy classified warships by "rate" based on the number of guns. First-rates carried 100+ guns on three decks and were floating fortresses (HMS Victory: 104 guns, crew of 850). Second-rates had 84–98 guns. Third-rates (64–80 guns) were the workhorses of battle fleets. Fourth-rates (50–60 guns) were too weak for the line of battle but useful for convoy escort. Fifth and sixth-rates were frigates and sloops — fast, independent cruisers used for scouting, commerce raiding, and patrol. A first-rate ship of the line cost as much to build and maintain as a modern aircraft carrier relative to GDP.',
  },
  {
    label: 'Trafalgar (1805) — Nelson\'s Masterpiece',
    detail:
      'The Battle of Trafalgar, fought off the coast of Spain on October 21, 1805, was the most decisive naval battle of the Age of Sail. Admiral Horatio Nelson, commanding 27 British ships against 33 Franco-Spanish vessels, deliberately broke the rules. Instead of forming a parallel line of battle, he drove two columns perpendicular to the enemy line, cutting it into three isolated groups. The gamble worked: 22 enemy ships were captured or destroyed, with no British ships lost. Nelson was killed by a French sniper during the battle, dying below decks after being told of his victory. Trafalgar ended Napoleon\'s invasion plans and secured British naval supremacy for a century.',
  },
  {
    label: 'Fireships, Bombs, and Unconventional Tactics',
    detail:
      'Not all naval warfare was line-of-battle slugging matches. Fireships — old vessels loaded with combustibles, set ablaze, and sailed into enemy anchorages — were devastating (the English used them against the Armada at Gravelines in 1588). Bomb vessels carried large mortars for shore bombardment. Cutting-out expeditions — sending boats to capture enemy ships at anchor under cover of darkness — were a specialty of the Royal Navy. And raking fire — shooting along the length of an enemy ship from bow or stern, where it had no guns to reply — could be devastating, as each cannonball tore the entire length of the deck.',
  },
];

// ── Life at Sea ──────────────────────────────────────────────────────────────

const LIFE_AT_SEA_INSIGHTS: InsightEntry[] = [
  {
    label: 'Hierarchy — A Floating Caste System',
    detail:
      'A warship was a rigidly hierarchical society. The captain was an absolute ruler whose word was law. Officers (lieutenants, midshipmen) were overwhelmingly from the gentry. Warrant officers (boatswain, carpenter, gunner, sailing master) were skilled professionals. Common sailors were divided into "able seamen" (experienced), "ordinary seamen" (competent), and "landsmen" (raw recruits). Marines were stationed aboard to fight — and to prevent mutiny. The captain\'s quarters occupied the spacious stern cabin with windows; common sailors slept in hammocks slung 14 inches apart on the gun deck.',
  },
  {
    label: 'Scurvy — The Sailor\'s Plague',
    detail:
      'Scurvy — caused by vitamin C deficiency — was the single greatest killer of sailors in the Age of Sail. On long voyages, it was catastrophic: Anson\'s circumnavigation (1740–1744) lost 1,854 of 1,955 men, mostly to scurvy. Symptoms began with lethargy and spotty skin, progressed to swollen bleeding gums, reopening of old wounds, and ended in delirium and death. James Lind demonstrated in 1747 that citrus fruit cured scurvy, but the Admiralty didn\'t mandate lemon juice until 1795 — 48 years and hundreds of thousands of deaths later. The delay is one of the most tragic examples of institutional inertia in medical history.',
  },
  {
    label: 'Press Gangs — Forced Naval Service',
    detail:
      'The Royal Navy\'s insatiable need for manpower was met partly by "impressment" — forcibly seizing men from merchant ships and port towns. Press gangs roamed coastal cities, grabbing any able-bodied man who looked like a sailor. Legally, only experienced seamen could be pressed, but in practice the gangs took whoever they could catch. Impressment was technically legal under English law but universally hated. It was one of the grievances that led to the War of 1812 with the United States — the British practice of boarding American ships and pressing sailors they claimed were British subjects.',
  },
  {
    label: 'Discipline — The Cat-o\'-Nine-Tails',
    detail:
      'Discipline on warships was maintained through a brutal punishment code. The cat-o\'-nine-tails — a whip of nine knotted cords — was the standard punishment for offenses from drunkenness to sleeping on watch. A sailor sentenced to a dozen lashes would be tied to a grating on the main deck and flogged in front of the entire crew. More serious offenses earned "flogging around the fleet" (rowed to each ship in the harbor to receive lashes at each one) or "running the gauntlet." Mutiny and desertion were punishable by hanging from the yardarm. The most notorious punishment was "keelhauling" — dragging a man under the ship\'s barnacle-encrusted hull — though this was more common in the Dutch navy.',
  },
  {
    label: 'Diet — Salt Beef, Hardtack, and Grog',
    detail:
      'A sailor\'s diet was monotonous and often foul. Staples were salt beef or pork (preserved in brine barrels for months), hardtack (biscuits baked rock-hard, frequently infested with weevils), dried peas, oatmeal, and cheese. The daily grog ration — half a pint of rum diluted with water, introduced by Admiral Vernon in 1740 — was the highlight of the day and the primary tool for maintaining morale. Fresh food was rare at sea; when available (after port calls), it was a luxury. Officers ate somewhat better, purchasing their own provisions, but even captains endured the same fundamental problem: nothing stayed fresh on a wooden ship.',
  },
  {
    label: 'Mutinies — When the Crew Had Enough',
    detail:
      'Despite savage discipline, mutinies happened. The most famous was the Bounty mutiny (1789): Fletcher Christian and 18 men seized the ship from Captain William Bligh in the South Pacific, setting Bligh adrift in a small boat (he navigated 3,600 miles to safety in one of history\'s greatest feats of seamanship). The mutineers settled on remote Pitcairn Island, where their descendants live today. The Nore Mutiny (1797) was more significant: the entire Channel Fleet — Britain\'s last line of defense during a war with France — refused to sail until pay and conditions were improved. The Admiralty made concessions. Leaders were hanged.',
  },
];

// ── The Slave Trade ──────────────────────────────────────────────────────────

const SLAVE_TRADE_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Triangular Trade',
    detail:
      'The Atlantic slave trade operated on a triangular circuit. Leg 1: European ships carried manufactured goods (textiles, iron, guns, rum) from Europe to West Africa. Leg 2 (the "Middle Passage"): enslaved Africans were packed into ships and transported across the Atlantic to the Caribbean and the Americas. Leg 3: Colonial products (sugar, tobacco, cotton, rum) were shipped back to Europe. Each leg generated profit. Between 1500 and 1870, an estimated 12.5 million Africans were forcibly embarked on slave ships; approximately 10.7 million survived the crossing. It was the largest forced migration in human history.',
  },
  {
    label: 'The Middle Passage — Industrialized Horror',
    detail:
      'The Middle Passage — the 6-to-12-week Atlantic crossing — was a nightmare of industrialized cruelty. Enslaved people were packed below decks in spaces sometimes less than 18 inches high, chained together, lying in their own waste. Mortality rates averaged 15–20% but could reach 50% on bad voyages. Disease (dysentery, smallpox, measles), dehydration, and despair killed thousands. Some captives starved themselves; slavers used a device called a speculum oris to force-feed them. Others jumped overboard when brought on deck for "exercise." The ships were designed specifically for this cargo — naval architects optimized hull shapes and between-deck heights for maximum human packing density.',
  },
  {
    label: 'Economic Foundations of the Modern World',
    detail:
      'The slave trade and slave labor were not peripheral to the rise of Western capitalism — they were central to it. Liverpool and Bristol became wealthy ports on the back of the slave trade. Caribbean sugar plantations (worked by enslaved Africans) were the most profitable enterprises in the 18th-century world. Cotton picked by enslaved people in the American South fed the textile mills of Manchester and Lancashire that powered the Industrial Revolution. Banks, insurance companies (Lloyd\'s of London insured slave ships), and entire financial systems were built on slave-generated capital. The wealth of the Age of Sail was inseparable from the exploitation of millions of human beings.',
  },
  {
    label: 'Abolition — A Long and Incomplete Victory',
    detail:
      'Britain abolished the slave trade in 1807 and slavery itself in 1833 (though "apprenticeship" continued until 1838). The Royal Navy\'s West Africa Squadron intercepted slave ships for decades, freeing an estimated 150,000 enslaved people. France, Spain, Portugal, the Netherlands, and Brazil followed over the next 60 years, with Brazil being the last Western Hemisphere nation to abolish slavery in 1888. The abolition movement was driven by religious conviction (Quakers, Evangelicals), economic shifts (slave labor was becoming less competitive with industrial wage labor), and — crucially — by the relentless resistance and revolts of enslaved people themselves, most dramatically the Haitian Revolution (1791–1804).',
  },
];

// ── Pirates and Privateers ───────────────────────────────────────────────────

const PIRATES_INSIGHTS: InsightEntry[] = [
  {
    label: 'Letters of Marque — State-Sponsored Piracy',
    detail:
      'The line between pirate and patriot was a legal document called a "letter of marque" — government authorization to attack and plunder enemy shipping in wartime. Privateers were private warships fighting for profit under national flags. Francis Drake was a privateer. Henry Morgan was a privateer (sort of). The difference between a privateer and a pirate was purely legal: same ships, same violence, same treasure — but one had paperwork. When wars ended, thousands of experienced sailors with guns and no income often turned to outright piracy. Every major war produced a wave of pirates in its aftermath.',
  },
  {
    label: 'The Golden Age of Piracy (c. 1650–1730)',
    detail:
      'The "Golden Age" of Atlantic piracy was concentrated in three periods: the buccaneers of the 1650s–1680s (based at Tortuga and Port Royal, raiding Spanish shipping), the pirate round of the 1690s (Madagascar-based pirates raiding the Indian Ocean), and the post-Spanish Succession pirates of 1714–1726 (the most famous era). Thousands of pirates operated in the Caribbean, along the American coast, and across the Atlantic. At its peak, piracy was a genuine economic and military threat: pirates disrupted trade routes, held colonial ports hostage, and even briefly established their own republics.',
  },
  {
    label: 'Blackbeard, Roberts, and the Reality of Pirate Life',
    detail:
      'Edward Teach ("Blackbeard") cultivated a terrifying image — slow-burning fuses woven into his beard, bristling with pistols — but was active for only about two years before being killed by the Royal Navy in 1718. Bartholomew Roberts ("Black Bart") was far more successful: he captured over 400 ships and terrorized the Atlantic from Brazil to Newfoundland before being killed in battle in 1722. The reality of pirate life was less romantic than the legends: short careers (average 2–3 years), constant danger, disease, alcoholism, and usually death by hanging or in battle. But pirate ships were surprisingly democratic: captains were elected, loot was divided by agreed shares, and some crews had disability compensation — social contracts more egalitarian than anything in the legitimate navies of the era.',
  },
  {
    label: 'Port Royal and Tortuga — Pirate Havens',
    detail:
      'Port Royal, Jamaica, was the pirate capital of the Caribbean — "the wickedest city on Earth" according to contemporary accounts. English colonial authorities tolerated (and profited from) the buccaneers who used it as a base, because they attacked Spanish shipping and settlements. The city was destroyed by a massive earthquake in 1692, which contemporaries interpreted as divine judgment. Tortuga, a small island off the coast of Hispaniola, was the original buccaneer base — a lawless haven where French, English, and Dutch pirates planned raids on the Spanish Main. Nassau in the Bahamas served a similar role during the early 1700s until Woodes Rogers arrived as governor in 1718 with a royal pardon in one hand and a hangman\'s noose in the other.',
  },
];

// ── East India Companies ─────────────────────────────────────────────────────

const EIC_INSIGHTS: InsightEntry[] = [
  {
    label: 'The British East India Company (1600–1874)',
    detail:
      'The English (later British) East India Company was founded in 1600 as a trading venture and ended up ruling a subcontinent. From modest beginnings trading pepper and textiles, the EIC gradually built a private army (at its peak, 260,000 soldiers — twice the size of the British Army), conquered Bengal after the Battle of Plassey (1757), and by the early 19th century controlled most of India. It administered justice, collected taxes, fought wars, and made policy for 200 million people — all while technically remaining a private company answerable to shareholders. The EIC was the original "too big to fail" corporation.',
  },
  {
    label: 'The Dutch VOC (1602–1799)',
    detail:
      'The VOC focused on the spice trade of Southeast Asia rather than territorial conquest in India. It monopolized nutmeg, cloves, and mace production through a combination of military force, treaty manipulation, and outright genocide (the Banda Islands). The VOC established Batavia (Jakarta) as its Asian headquarters, controlled the Cape of Good Hope as a resupply station, and was the only European power allowed to trade with Japan (through the tiny artificial island of Dejima in Nagasaki harbor). The VOC paid dividends averaging 18% per year for almost 200 years before collapsing under corruption, debt, and competition in 1799.',
  },
  {
    label: 'Corporate Colonialism — The Template',
    detail:
      'The East India Companies pioneered a model of colonialism where the initial conquest and administration was outsourced to profit-driven private enterprises. This had two consequences. First, it made colonialism self-financing — companies paid for their own armies and administrators from trade profits, not from tax revenue. Second, it meant colonial policy was driven by shareholder returns, not by any concept of governance or welfare. The result was exploitation optimized for extraction: the Bengal famine of 1770 killed an estimated 10 million people while the EIC continued to collect taxes and export grain. Modern multinational corporations are the direct descendants — structurally and legally — of the East India Companies.',
  },
  {
    label: 'Opium, Tea, and the China Trade',
    detail:
      'The EIC\'s most profitable — and most destructive — trade was opium. British India grew opium poppies and the EIC sold the opium to China, creating millions of addicts. When the Chinese government tried to stop the trade, Britain fought two Opium Wars (1839–1842, 1856–1860) to force China to accept the drug. The Treaty of Nanking (1842) ceded Hong Kong to Britain and opened five Chinese ports to British trade. Meanwhile, the EIC\'s tea trade with China was so enormous that it shaped world history: the Boston Tea Party (1773) was a protest against the EIC\'s tea monopoly, helping trigger the American Revolution.',
  },
];

// ── End of the Age ───────────────────────────────────────────────────────────

const END_TIMELINE: TimelineEntry[] = [
  {
    year: '1807',
    title: 'Fulton\'s Steamboat — The Beginning of the End',
    description:
      'Robert Fulton\'s Clermont made the first commercially successful steamboat voyage up the Hudson River. Steam power was initially used on rivers and coastal routes, where its independence from wind direction was most valuable. Early steamships were unreliable, coal-hungry, and still carried masts and sails as backup. But the technology improved rapidly: by the 1840s, the Cunard Line was running regular transatlantic steamship service. Each decade, steamships became faster, more reliable, and more economical. The age of sail didn\'t end with a bang — it slowly became obsolete.',
    color: STEEL,
  },
  {
    year: '1840s–1860s',
    title: 'The Clipper Ship Era — Sail\'s Last Glory',
    description:
      'Before they surrendered to steam, sailing ships had one final golden age. The clipper ships of the 1840s–1860s were the fastest sailing vessels ever built: long, narrow, with enormous sail areas. The Flying Cloud set a New York-to-San Francisco record of 89 days in 1854. Clipper ships raced to bring Chinese tea to London (the annual "tea race" was front-page news). The Cutty Sark (1869, now preserved in Greenwich) is the most famous survivor. But clippers were optimized for speed at the expense of cargo capacity — and steam ships, which could keep a schedule regardless of wind, steadily took their business.',
    color: OCEAN,
  },
  {
    year: '1860s',
    title: 'Ironclads — The End of Wooden Warships',
    description:
      'The Battle of Hampton Roads (1862) between the USS Monitor and CSS Virginia (formerly Merrimack) demonstrated that iron-armored warships made wooden navies obsolete overnight. Within a decade, every major navy was building ironclad warships. Iron hulls were stronger, more durable, and could be built larger than wooden ones. Combined with steam propulsion, armored turrets, and rifled guns, the ironclad represented such a complete break with the past that the world\'s greatest wooden sailing navy — Britain\'s Royal Navy — had to rebuild itself from scratch.',
    color: SLATE,
  },
  {
    year: '1869',
    title: 'The Suez Canal — Geography Rewritten',
    description:
      'The opening of the Suez Canal on November 17, 1869, cut the sea route from Europe to Asia by 4,300 miles — eliminating the need to sail around Africa entirely. But the canal\'s narrow confines and lack of wind made it useless for sailing ships; only steamships could transit it. This single engineering feat shifted the competitive balance decisively: sailing ships now had to sail an extra 4,300 miles compared to their steam-powered rivals. The Suez Canal didn\'t just change trade routes — it rendered the entire sailing ship technology stack economically unviable for long-distance commerce.',
    color: GOLD,
  },
  {
    year: '1870s–1900s',
    title: 'The Long Twilight of Sail',
    description:
      'Sailing ships didn\'t vanish overnight. Massive steel-hulled sailing ships (like the "windjammers" and "tall ships") continued carrying bulk cargo — grain, guano, coal, nitrates — on routes where speed didn\'t matter and coal was expensive, particularly the long hauls around Cape Horn to the Pacific coast of South America. The last commercial sailing vessels plied these routes into the 1930s. But by 1900, the world\'s trade was overwhelmingly carried by steam. The Age of Sail, which had connected the globe, explored every coast, and built (and destroyed) empires, was over.',
    color: SAND,
  },
];

// ── Legacy ───────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Maritime Law — The Legal Foundation of Globalization',
    detail:
      'The Age of Sail created the legal framework for international commerce that still governs global trade. Freedom of the seas (Hugo Grotius\'s Mare Liberum, 1609), prize law, maritime insurance, bills of lading, admiralty courts, quarantine regulations, and the law of salvage all evolved during this era. The principle that the high seas belong to no nation — and that all nations have the right to navigate them — remains the foundation of international maritime law under the UN Convention on the Law of the Sea.',
  },
  {
    label: 'Global Trade Routes — Lines Drawn by Wind and Current',
    detail:
      'The trade routes established during the Age of Sail — following prevailing winds and ocean currents — determined the locations of major ports, the patterns of global commerce, and the economic geography of the modern world. Singapore, Hong Kong, Cape Town, Panama, and Suez are all strategic because of routes discovered or optimized by Age of Sail navigators. Container ships today follow routes that would be recognizable to a 17th-century ship captain, because the underlying geography — straits, capes, canals — hasn\'t changed.',
  },
  {
    label: 'The Columbian Exchange — Biology Transformed',
    detail:
      'The Age of Sail triggered the "Columbian Exchange" — the massive transfer of plants, animals, diseases, and people between the Old and New Worlds. Potatoes, tomatoes, maize, and tobacco went from the Americas to Europe, Asia, and Africa. Wheat, horses, cattle, and (devastatingly) smallpox, measles, and influenza went from Europe to the Americas. Old World diseases killed an estimated 90% of the indigenous population of the Americas — the greatest demographic catastrophe in human history. The Columbian Exchange reshaped global agriculture, diet, and population patterns in ways that are still unfolding.',
  },
  {
    label: 'Colonial Consequences — A World Shaped by Sail',
    detail:
      'The Age of Sail created the colonial world order whose consequences dominate international politics today. European nations, empowered by naval technology and navigational knowledge, conquered, colonized, and exploited most of Africa, Asia, and the Americas. The borders drawn by colonial powers (often with no regard for ethnic, linguistic, or cultural boundaries) became the borders of modern nations. The wealth extracted from colonies funded European industrialization. The racial hierarchies invented to justify colonialism persist as structural racism. The Age of Sail connected the world — but on terms dictated by those who had the ships and the guns.',
  },
];

// ── Master Timeline ──────────────────────────────────────────────────────────

const MASTER_TIMELINE: TimelineEntry[] = [
  { year: '1415', title: 'Portuguese capture Ceuta', description: 'Beginning of European overseas expansion.', color: GOLD },
  { year: '1419', title: 'Discovery of Madeira', description: 'Portuguese settle first Atlantic island colony.', color: TEAL },
  { year: '1434', title: 'Gil Eanes rounds Cape Bojador', description: 'Breaks the psychological barrier — "sea of darkness" myth dispelled.', color: TEAL },
  { year: '1488', title: 'Dias rounds Cape of Good Hope', description: 'Proves sea route to Indian Ocean exists.', color: OCEAN },
  { year: '1492', title: 'Columbus reaches the Americas', description: 'Accidental discovery of New World while seeking westward route to Asia.', color: CRIMSON },
  { year: '1494', title: 'Treaty of Tordesillas', description: 'Spain and Portugal divide the non-Christian world between them.', color: GOLD },
  { year: '1497–98', title: 'Da Gama reaches India', description: 'First direct European sea route to Asia — the hinge voyage.', color: GOLD },
  { year: '1500', title: 'Cabral discovers Brazil', description: 'Portuguese claim South America while sailing the volta do mar to India.', color: GREEN },
  { year: '1511', title: 'Portuguese conquer Malacca', description: 'Control of the critical strait connecting Indian Ocean to Pacific.', color: TEAL },
  { year: '1519–22', title: 'Magellan\'s circumnavigation', description: 'First voyage around the world — 18 of 270 men survive.', color: OCEAN },
  { year: '1565', title: 'Manila Galleon trade begins', description: 'First regular trans-Pacific trade route: Manila to Acapulco.', color: AMBER },
  { year: '1577–80', title: 'Drake\'s circumnavigation', description: 'English "sea dog" circles the globe, raiding Spanish ports.', color: CRIMSON },
  { year: '1588', title: 'Defeat of Spanish Armada', description: 'England breaks Spanish naval dominance; rise of English sea power.', color: OCEAN },
  { year: '1600', title: 'British East India Company founded', description: 'Private company that will eventually rule India.', color: BLUE },
  { year: '1602', title: 'Dutch VOC founded', description: 'World\'s first joint-stock company and megacorporation.', color: AMBER },
  { year: '1607', title: 'Jamestown founded', description: 'First permanent English settlement in the Americas.', color: GREEN },
  { year: '1621', title: 'Banda Islands massacre', description: 'VOC enslaves/kills islanders to monopolize nutmeg production.', color: RED },
  { year: '1652', title: 'First Anglo-Dutch War', description: 'England and Netherlands fight for maritime trade supremacy.', color: BLUE },
  { year: '1664', title: 'England seizes New Amsterdam', description: 'Renamed New York — Dutch colonial holdings in North America end.', color: BLUE },
  { year: '1694', title: 'Bank of England founded', description: 'Financial institution born from the need to fund naval warfare.', color: GOLD },
  { year: '1707', title: 'Scilly naval disaster', description: 'Four Royal Navy ships wrecked — 1,900 dead — because longitude was unknown.', color: RED },
  { year: '1718', title: 'Blackbeard killed', description: 'End of the Golden Age of Piracy\'s most infamous captain.', color: CRIMSON },
  { year: '1757', title: 'Battle of Plassey', description: 'EIC conquers Bengal — beginning of British control of India.', color: INDIGO },
  { year: '1759', title: 'Harrison completes H4', description: 'Marine chronometer solves the longitude problem.', color: TEAL },
  { year: '1768–79', title: 'Cook\'s three voyages', description: 'Charts the Pacific, maps New Zealand and Australia\'s east coast.', color: OCEAN },
  { year: '1773', title: 'Harrison receives Longitude Prize', description: 'After 31 years of work — King George III intervenes to force payment.', color: GOLD },
  { year: '1789', title: 'Mutiny on the Bounty', description: 'Fletcher Christian seizes ship from Bligh in the South Pacific.', color: ROSE },
  { year: '1797', title: 'Spithead and Nore mutinies', description: 'Royal Navy Channel Fleet refuses to sail — concessions won.', color: CRIMSON },
  { year: '1805', title: 'Battle of Trafalgar', description: 'Nelson destroys Franco-Spanish fleet; secures century of British supremacy.', color: BLUE },
  { year: '1807', title: 'British abolish slave trade', description: 'Royal Navy begins intercepting slave ships off Africa.', color: GREEN },
  { year: '1807', title: 'Fulton\'s steamboat', description: 'Clermont demonstrates commercial viability of steam navigation.', color: STEEL },
  { year: '1839–42', title: 'First Opium War', description: 'Britain forces China to accept opium trade; cedes Hong Kong.', color: RED },
  { year: '1854', title: 'Flying Cloud record', description: 'Clipper ship New York to San Francisco in 89 days — sail\'s peak speed.', color: OCEAN },
  { year: '1862', title: 'Battle of Hampton Roads', description: 'Ironclads duel — wooden warships obsolete overnight.', color: STEEL },
  { year: '1869', title: 'Suez Canal opens', description: 'Cuts 4,300 miles from Europe-to-Asia route; useless for sailing ships.', color: GOLD },
];

// ── Key Figures ──────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  { name: 'Henry the Navigator', years: '1394–1460', contribution: 'Organized Portuguese exploration of the African coast. Never sailed, but funded and systematized the entire enterprise.' },
  { name: 'Christopher Columbus', years: '1451–1506', contribution: 'Reached the Americas (1492) while seeking a westward route to Asia. Triggered the European colonization of the New World.' },
  { name: 'Vasco da Gama', years: 'c. 1460–1524', contribution: 'First European to reach India by sea (1498). Opened the spice trade route that transformed global commerce.' },
  { name: 'Ferdinand Magellan', years: '1480–1521', contribution: 'Organized first circumnavigation (1519–22). Killed in the Philippines; 18 of his 270 men completed the voyage.' },
  { name: 'Francis Drake', years: 'c. 1540–1596', contribution: 'English privateer, circumnavigator, and Armada hero. Raided Spanish shipping across the globe with royal backing.' },
  { name: 'John Harrison', years: '1693–1776', contribution: 'Self-taught clockmaker who solved the longitude problem with his H4 marine chronometer after 31 years of work.' },
  { name: 'James Cook', years: '1728–1779', contribution: 'Charted the Pacific with unprecedented accuracy across three voyages. Mapped New Zealand, Australia\'s east coast, and Hawaii.' },
  { name: 'Horatio Nelson', years: '1758–1805', contribution: 'Britain\'s greatest naval hero. Won decisive victories at the Nile, Copenhagen, and Trafalgar, where he died in the moment of triumph.' },
  { name: 'Bartholomew Roberts', years: '1682–1722', contribution: 'Most successful pirate of the Golden Age — captured 400+ ships. Killed in battle off West Africa.' },
  { name: 'Zheng He', years: '1371–1433', contribution: 'Chinese admiral who led seven massive treasure fleet voyages across the Indian Ocean (1405–1433), decades before the Portuguese. China then turned inward.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Reusable layout components
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
        initial={{ opacity: 0, y: 24 }}
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
          {icon} {title}
        </h2>
        <p
          style={{
            color: ASH,
            lineHeight: 1.8,
            fontSize: '1rem',
            marginBottom: 20,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {entries.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.06 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
            paddingBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: e.color,
              letterSpacing: '0.04em',
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

const FIGURE_COLORS = [OCEAN, GOLD, CRIMSON, TEAL, BLUE, RED, AMBER, GREEN, ROSE, INDIGO];

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

export default function AgeOfSailPage() {
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
              background: `linear-gradient(135deg, ${NAVY}, ${OCEAN}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Age of Sail — When Wind and Canvas Connected the World (~1400–1870)
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
              For four and a half centuries, wooden ships powered by nothing more than
              wind reshaped the entire planet. They connected continents that had been
              isolated for millennia, built and destroyed empires, carried spices and
              silver and enslaved human beings across oceans, and created the global
              trading system we live in today. The Age of Sail was an era of
              extraordinary courage, staggering cruelty, and world-altering
              consequence.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              It began with Portuguese caravels cautiously creeping down the African
              coast and ended with clipper ships racing steamers around Cape Horn. In
              between: Columbus stumbled on the Americas, Magellan's crew circled the
              globe, the Dutch invented the stock market to fund the spice trade,
              Blackbeard terrorized the Caribbean, the Royal Navy ruled the oceans,
              and 12.5 million Africans were forced across the Atlantic in chains.
              This is the story of the age when sail was everything.
            </p>
          </motion.div>
        </header>

        {/* ── Origins ──────────────────────────────────────────────────── */}
        <SectionWrapper
          id="origins"
          icon="⚓"
          title="Origins — The Technology That Made It Possible"
          accentColor={TEAL}
          intro="The Age of Sail was enabled by a cluster of technologies — most of them borrowed from the Arab and Chinese worlds — that converged in 15th-century Portugal. The caravel, the lateen sail, the magnetic compass, the astrolabe, and the portolan chart together gave European mariners the ability to leave the Mediterranean, cross open oceans, and — crucially — find their way home again."
        >
          <InsightGrid items={ORIGINS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Portuguese Pioneers ──────────────────────────────────────── */}
        <SectionWrapper
          id="portuguese"
          icon="🇵🇹"
          title="Portuguese Pioneers — Opening the World"
          accentColor={GOLD}
          intro="Portugal — a small, poor kingdom on the western edge of Europe with barely 1.5 million people — launched the Age of Exploration and built a maritime empire that stretched from Brazil to Japan. How? Relentless state-sponsored exploration, superior naval technology, strategic chokepoint control, and a willingness to use extreme violence to enforce trade monopolies."
        >
          <TimelineCard entries={PORTUGUESE_TIMELINE} />
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: GOLD, marginBottom: 14 }}>
              Key Portuguese Figures
            </h3>
            <FigureGrid figures={PORTUGUESE_FIGURES} />
          </div>
        </SectionWrapper>

        {/* ── Spanish Expansion ────────────────────────────────────────── */}
        <SectionWrapper
          id="spanish"
          icon="🇪🇸"
          title="Spanish Expansion — Columbus, Magellan, and the Manila Galleons"
          accentColor={CRIMSON}
          intro="While Portugal went east, Spain went west. Columbus's accidental discovery of the Americas in 1492 gave Spain an entirely new hemisphere to exploit. Magellan's expedition proved the world could be circled. The Manila Galleons connected Spanish America to Asia. And the Treaty of Tordesillas — in which two nations casually divided the entire planet between them — set the template for 400 years of European colonialism."
        >
          <TimelineCard entries={SPANISH_TIMELINE} />
        </SectionWrapper>

        {/* ── Dutch Golden Age ─────────────────────────────────────────── */}
        <SectionWrapper
          id="dutch"
          icon="🇳🇱"
          title="The Dutch Golden Age — When Amsterdam Ruled the Seas"
          accentColor={AMBER}
          intro="The Dutch Republic — a tiny, swampy nation of 2 million people that had only just won its independence from Spain — built the world's most powerful trading empire in the 17th century. The Dutch didn't just trade spices; they invented the financial instruments to fund it: the stock exchange, the joint-stock company, futures contracts, and maritime insurance. Modern capitalism was born in Amsterdam, and it was built on nutmeg and cloves."
        >
          <InsightGrid items={DUTCH_INSIGHTS} />
        </SectionWrapper>

        {/* ── English Sea Power ────────────────────────────────────────── */}
        <SectionWrapper
          id="english"
          icon="🇬🇧"
          title="English Sea Power — From Pirates to Empire"
          accentColor={OCEAN}
          intro="England's path to naval supremacy began with Elizabeth I's 'sea dogs' — state-sponsored pirates who raided Spanish shipping — and culminated with the Royal Navy's unchallenged global dominance after Trafalgar in 1805. Along the way, England defeated the Spanish Armada, fought three wars with the Dutch for trade supremacy, and used aggressive mercantilist policy to build the commercial empire that would eventually span a quarter of the globe."
        >
          <TimelineCard entries={ENGLISH_TIMELINE} />
        </SectionWrapper>

        {/* ── Navigation ───────────────────────────────────────────────── */}
        <SectionWrapper
          id="navigation"
          icon="🧭"
          title="Navigation — From Dead Reckoning to the Chronometer"
          accentColor={INDIGO}
          intro="The Age of Sail's greatest intellectual challenge wasn't building ships or fighting battles — it was figuring out where you were. Latitude (north-south) could be determined from the stars by the 1500s. But longitude (east-west) remained unsolvable for 300 years, killing thousands of sailors and wrecking countless ships. The solution, when it finally came, was not from an astronomer but from a self-taught Yorkshire clockmaker."
        >
          <InsightGrid items={NAVIGATION_INSIGHTS} />
        </SectionWrapper>

        {/* ── Naval Warfare ────────────────────────────────────────────── */}
        <SectionWrapper
          id="warfare"
          icon="⚔️"
          title="Naval Warfare — Broadsides, Ships of the Line, and Trafalgar"
          accentColor={BLUE}
          intro="Age of Sail naval combat was a terrifying business: wooden ships pounding each other with cannons at close range in smoke so thick that crews couldn't see what they were shooting at. Tactics evolved from medieval-style ramming and boarding to the sophisticated line-of-battle formations that culminated at Trafalgar — Nelson's masterpiece that secured British naval supremacy for a century."
        >
          <InsightGrid items={WARFARE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Life at Sea ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="life-at-sea"
          icon="🚢"
          title="Life at Sea — Hierarchy, Scurvy, Grog, and the Lash"
          accentColor={COPPER}
          intro="A sailing ship was a self-contained floating world: a rigidly hierarchical society of 200–800 men crammed into a wooden vessel, often at sea for months, eating wormy biscuits, drinking diluted rum, and living under a discipline code enforced by the cat-o'-nine-tails. It was a hard, dangerous, often brutal life — and yet navies never lacked for volunteers (though they supplemented them with pressed men dragged from pubs and merchant ships)."
        >
          <InsightGrid items={LIFE_AT_SEA_INSIGHTS} />
        </SectionWrapper>

        {/* ── The Slave Trade ──────────────────────────────────────────── */}
        <SectionWrapper
          id="slave-trade"
          icon="⛓️"
          title="The Atlantic Slave Trade — The Age of Sail's Darkest Chapter"
          accentColor={MAHOGANY}
          intro="No account of the Age of Sail is complete without confronting the Atlantic slave trade — the forced transportation of 12.5 million Africans across the ocean to labor on plantations in the Americas. The slave trade was not a peripheral side effect of the Age of Sail; it was central to it. The wealth it generated funded European industrialization, built cities like Liverpool and Bristol, and created economic structures whose consequences persist today."
        >
          <InsightGrid items={SLAVE_TRADE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Pirates and Privateers ───────────────────────────────────── */}
        <SectionWrapper
          id="pirates"
          icon="🏴‍☠️"
          title="Pirates and Privateers — Letters of Marque, Tortuga, and Blackbeard"
          accentColor={ROSE}
          intro="The Age of Sail's most romanticized — and most misunderstood — figures were its pirates. In reality, piracy was a complex spectrum from state-sponsored privateering (legal plunder with government paperwork) to outright criminality. Pirates were often former naval sailors or privateers turned freelance by peacetime unemployment. Their careers were short, violent, and usually fatal — but pirate ships were, paradoxically, among the most democratic institutions of their era."
        >
          <InsightGrid items={PIRATES_INSIGHTS} />
        </SectionWrapper>

        {/* ── East India Companies ─────────────────────────────────────── */}
        <SectionWrapper
          id="east-india-companies"
          icon="🏛️"
          title="East India Companies — Corporate Colonialism"
          accentColor={PURPLE}
          intro="The East India Companies — British (EIC, 1600) and Dutch (VOC, 1602) — were the most extraordinary corporations in history. They started as trading ventures and became de facto sovereign states: raising armies, fighting wars, governing millions of people, and extracting wealth on a continental scale. They were the prototypes of the modern multinational corporation, and their model of profit-driven colonialism shaped the world we live in."
        >
          <InsightGrid items={EIC_INSIGHTS} />
        </SectionWrapper>

        {/* ── End of the Age ───────────────────────────────────────────── */}
        <SectionWrapper
          id="end-of-age"
          icon="🔥"
          title="The End of the Age — Steam, Iron, and Suez"
          accentColor={STEEL}
          intro="The Age of Sail didn't end in a single dramatic moment — it was a slow, decades-long twilight as steam power, iron hulls, and the Suez Canal progressively rendered sailing ships obsolete. The clipper ships of the 1850s–1860s were the fastest and most beautiful sailing vessels ever built, but they were racing against a technology they couldn't beat. By 1900, the world's commerce moved by steam."
        >
          <TimelineCard entries={END_TIMELINE} />
        </SectionWrapper>

        {/* ── Legacy ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🌍"
          title="Legacy — The World That Sail Built"
          accentColor={GREEN}
          intro="The Age of Sail created the modern world — for better and for worse. It connected continents, created global trade, produced maritime law, and spread the Columbian Exchange of plants, animals, and diseases that reshaped human civilization. It also created colonialism, the Atlantic slave trade, and patterns of exploitation whose consequences are still unfolding. Every container ship, every international border, every spice in your kitchen — the Age of Sail is still with us."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Master Timeline ──────────────────────────────────────────── */}
        <SectionWrapper
          id="timeline"
          icon="📜"
          title="Timeline — Key Voyages, Battles, and Turning Points"
          accentColor={OCEAN}
          intro="From Ceuta (1415) to the Suez Canal (1869), the milestones of the Age of Sail in chronological order."
        >
          <TimelineCard entries={MASTER_TIMELINE} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures of the Age of Sail"
          accentColor={GOLD}
          intro="Navigators, conquerors, pirates, clockmakers, and admirals — the individuals who shaped four centuries of maritime history."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            marginTop: 48,
            paddingTop: 24,
            paddingBottom: 48,
            textAlign: 'center',
            color: SLATE,
            fontSize: '0.85rem',
          }}
        >
          <p>
            <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none' }}>
              ← Back to Timeline
            </Link>
          </p>
          <p style={{ marginTop: 12, opacity: 0.6 }}>
            Chronicle — An Immersive Journey Through History
          </p>
        </footer>
      </div>
    </div>
  );
}
