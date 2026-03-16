/**
 * AgeOfSailPage — comprehensive deep-dive on the Age of Sail (~1400–1850).
 *
 * Route: /age-of-sail
 *
 * Sections:
 *  1. Hero — overview of how sail transformed the world
 *  2. Precursors — Polynesian wayfinding, Arab dhows, Viking longships
 *  3. Portuguese Pioneers — Prince Henry, caravel, da Gama, Indian Ocean
 *  4. Spanish Conquest — Columbus, Magellan, treasure fleets
 *  5. Dutch Golden Age — VOC, spice trade monopoly
 *  6. British East India Company — EIC vs VOC, maritime dominance
 *  7. Ship Evolution — caravel → carrack → galleon → frigate → ship-of-the-line
 *  8. Navigation Technology — astrolabe, sextant, chronometer, dead reckoning
 *  9. Naval Warfare — line of battle, Trafalgar, broadside tactics
 * 10. The Slave Trade — triangular commerce, Middle Passage
 * 11. Golden Age of Piracy — Caribbean, Blackbeard, Roberts, letters of marque
 * 12. The Columbian Exchange — biological globalization
 * 13. Key Figures — Henry, Columbus, da Gama, Magellan, Drake, Cook, Nelson
 * 14. Decline — steam, iron, Suez Canal
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const NAVY = '#1e3a5f';
const OCEAN = '#0ea5e9';
const GOLD = '#f59e0b';
const AMBER = '#d97706';
const TEAL = '#14b8a6';
const CRIMSON = '#dc2626';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const SAND = '#d4a574';
const COPPER = '#b87333';
const MAHOGANY = '#8b4513';
const SAIL_WHITE = '#e2e8f0';
const STORM_GRAY = '#475569';
const BLOOD_RED = '#991b1b';
const SEA_GREEN = '#059669';
const DUTCH_ORANGE = '#ea580c';

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

interface ShipEntry {
  name: string;
  era: string;
  description: string;
  color: string;
}

// ── Precursors: Before the Age of Sail ──────────────────────────────────────

const PRECURSOR_INSIGHTS: InsightEntry[] = [
  {
    label: 'Polynesian Wayfinding (c. 1500 BCE–1200 CE)',
    detail:
      'Centuries before Europeans dared to leave sight of land, Polynesian navigators crossed thousands of miles of open Pacific in double-hulled canoes using nothing but the stars, ocean swells, cloud formations, and the flight paths of birds. They colonized Hawaii, New Zealand, Easter Island, and virtually every inhabitable island in the Pacific — the greatest feat of open-ocean navigation in human history. Their technique of "wayfinding" — reading the ocean itself as a map — was so sophisticated that modern scientists are still studying it. The Polynesian Triangle (Hawaii, New Zealand, Easter Island) encompasses an area larger than the continental United States, settled entirely by stone-age sailors with no instruments.',
  },
  {
    label: 'Arab Dhows and the Indian Ocean (c. 700–1500 CE)',
    detail:
      'Arab and Persian sailors mastered the monsoon winds of the Indian Ocean centuries before Portuguese ships rounded Africa. Their dhows — lateen-rigged vessels with triangular sails — could sail closer to the wind than any European square-rigger. Arab merchants connected East Africa, Arabia, India, and Southeast Asia in a vast maritime trade network carrying spices, textiles, gold, ivory, and enslaved people. They developed the kamal — a simple navigational device for measuring latitude by star altitude — and compiled detailed sailing manuals (rahmani). When Vasco da Gama reached the Indian Ocean in 1498, he found a thriving, sophisticated maritime world that had been operating for 800 years without him.',
  },
  {
    label: 'Viking Longships (c. 800–1100 CE)',
    detail:
      'The Vikings built the most versatile ships of the early medieval world. Their longships — shallow-draft, clinker-built vessels that could be rowed or sailed — crossed the North Atlantic, navigated rivers deep into Russia, raided Mediterranean cities, and reached North America 500 years before Columbus. Leif Erikson established a settlement at L\'Anse aux Meadows in Newfoundland around 1000 CE. Viking knarrs (cargo ships) maintained trade routes from Scandinavia to Constantinople. Their shipbuilding techniques — overlapping oak planks riveted to a keel — produced vessels that were simultaneously seaworthy enough for ocean crossings and shallow enough to beach on any shore.',
  },
  {
    label: 'Chinese Treasure Fleets (1405–1433)',
    detail:
      'Admiral Zheng He commanded the largest wooden ships ever built — treasure junks reportedly 400 feet long, dwarfing anything in Europe — on seven massive expeditions through Southeast Asia, India, Arabia, and East Africa. His fleets carried 27,000+ men, including soldiers, diplomats, and merchants. The treasure voyages demonstrated Chinese naval supremacy that no European power could match. Then, abruptly, the Ming dynasty ended the voyages, burned the ships, and made it illegal to build ocean-going vessels. Had China continued, it might have colonized the world before Europe. Instead, the decision opened the seas to the Portuguese, who arrived in the Indian Ocean just 65 years later.',
  },
];

// ── Portuguese Pioneers ─────────────────────────────────────────────────────

const PORTUGUESE_TIMELINE: TimelineEntry[] = [
  {
    year: '1415',
    title: 'Conquest of Ceuta — Portugal Looks South',
    description:
      'The capture of the Moroccan port city of Ceuta marks Portugal\'s first overseas conquest and the symbolic beginning of European maritime expansion. Prince Henry, third son of King João I, fought in the battle and became obsessed with what lay beyond Muslim North Africa. From his base at Sagres on the windswept southern tip of Portugal, Henry sponsored expedition after expedition down the West African coast — not out of pure curiosity, but to find gold, circumvent Muslim middlemen in the spice trade, and spread Christianity. He never sailed himself, but his relentless patronage earned him the posthumous title "Henry the Navigator."',
    color: GOLD,
  },
  {
    year: '1441–1460s',
    title: 'Creeping Down the African Coast',
    description:
      'Portuguese captains pushed steadily southward, overcoming the psychological barrier of Cape Bojador (1434) — long feared as the edge of the navigable world — and establishing trading posts for gold, ivory, and enslaved Africans. The caravel, a small, maneuverable ship with lateen sails, proved ideal for coastal exploration: it could sail close to the wind, navigate shallow waters, and be crewed by as few as 20 men. Each expedition mapped a few hundred more miles of coastline, creating the charts (portolans) that would guide future voyages. By the 1460s, Portuguese traders had reached the Gulf of Guinea and discovered that the African coast turned eastward — hinting at a route around the continent.',
    color: TEAL,
  },
  {
    year: '1488',
    title: 'Bartolomeu Dias Rounds the Cape of Good Hope',
    description:
      'After being blown south by a violent storm for 13 days, Dias realized he had rounded the southern tip of Africa without seeing it. When the coast appeared again, it ran northeast — toward the Indian Ocean. The route to Asia was open. Dias wanted to continue, but his exhausted crew forced him to turn back. King João II named the headland the "Cape of Good Hope" — good hope for reaching India. The rounding of the Cape was the breakthrough that made the entire Age of Sail possible: it proved that the Atlantic and Indian oceans were connected, and that Europe could reach Asia by sea.',
    color: OCEAN,
  },
  {
    year: '1498',
    title: 'Vasco da Gama Reaches India',
    description:
      'Da Gama\'s four ships rounded the Cape and crossed the Indian Ocean with the help of an Arab navigator, Ahmad ibn Majid, reaching Calicut (modern Kozhikode) on India\'s Malabar Coast on May 20, 1498. The cargo he brought back — pepper, cinnamon, cloves, and ginger — sold in Lisbon for 60 times the cost of the entire expedition. The profit margin was staggering: a single successful voyage could fund ten more. Within a decade, Portuguese warships were destroying Arab merchant fleets, seizing ports from Mozambique to Malacca, and establishing a maritime empire that stretched from Brazil to Japan. The Indian Ocean, an Arab lake for centuries, became a Portuguese one almost overnight.',
    color: CRIMSON,
  },
  {
    year: '1500s–1600s',
    title: 'Estado da Índia — The First Global Empire',
    description:
      'Portugal built history\'s first truly global maritime empire: Goa (India), Malacca (Malaysia), Macau (China), Nagasaki (Japan), Mozambique, Angola, Brazil. Rather than conquering territory, Portugal controlled chokepoints — fortified trading posts at strategic harbors that dominated sea lanes. Afonso de Albuquerque, the "Caesar of the East," conquered Goa (1510), Malacca (1511), and Hormuz (1515), establishing naval supremacy through superior gunnery and ruthless tactics. The tiny nation of Portugal — population barely 1 million — controlled the spice trade that had enriched Venice and the Arab world for centuries. It was the most audacious power projection relative to national size in history.',
    color: GREEN,
  },
];

// ── Spanish Conquest ────────────────────────────────────────────────────────

const SPANISH_TIMELINE: TimelineEntry[] = [
  {
    year: '1492',
    title: 'Columbus Sails West — The Accidental Discovery',
    description:
      'Christopher Columbus, a Genoese navigator who had been rejected by Portugal, convinced Spain\'s Ferdinand and Isabella to fund his westward voyage to Asia. His geography was wrong — he believed the Earth was far smaller than it actually is — but his error led him to the Bahamas on October 12, 1492. Columbus went to his grave insisting he had reached Asia. He never set foot on the North American mainland. His four voyages (1492–1504) brought him to the Caribbean, Central America, and Venezuela, but the man who "discovered" the New World never understood what he had found. What he did trigger — the Columbian Exchange, the conquest of the Americas, the Atlantic slave trade — reshaped the entire planet.',
    color: CRIMSON,
  },
  {
    year: '1494',
    title: 'Treaty of Tordesillas — The Pope Divides the World',
    description:
      'To prevent war between Spain and Portugal, Pope Alexander VI drew a line down the Atlantic: everything west of it belonged to Spain, everything east to Portugal. The Treaty of Tordesillas formalized this division. Neither nation consulted the people who actually lived in these territories. The line gave Brazil to Portugal (it bulged east of the meridian) and the rest of the Americas to Spain. The audacity of two European kingdoms dividing the entire non-Christian world between themselves, with papal blessing, captures the mentality of the age: the conviction that European Christianity had a God-given right to the planet.',
    color: GOLD,
  },
  {
    year: '1519–1522',
    title: 'Magellan\'s Circumnavigation — Proving the Earth\'s Size',
    description:
      'Ferdinand Magellan, a Portuguese navigator sailing for Spain, departed with five ships and 270 men to find a westward route to the Spice Islands. He navigated the treacherous strait at South America\'s tip (now the Strait of Magellan), crossed the Pacific — a voyage of 99 days without sighting land, during which the crew ate rats, sawdust, and leather — and reached the Philippines, where Magellan was killed in a battle with local warriors. Juan Sebastián Elcano brought one surviving ship, the Victoria, home with 18 men — completing the first circumnavigation of the Earth. It proved the planet\'s true size, the vastness of the Pacific, and that all the world\'s oceans were connected.',
    color: INDIGO,
  },
  {
    year: '1500s–1700s',
    title: 'The Treasure Fleets — Silver That Reshaped the World',
    description:
      'Spain\'s conquest of the Aztec and Inca empires unleashed a flood of silver that transformed the global economy. The mines of Potosí (Bolivia) and Zacatecas (Mexico) produced roughly 80% of the world\'s silver. Twice a year, treasure fleets (flotas) carried silver across the Atlantic to Spain, guarded by warships against pirates and rival navies. Much of the silver flowed onward to China — the world\'s largest economy — to pay for silk, porcelain, and tea, creating the first truly global trade circuit. The silver influx caused massive inflation in Europe (the "Price Revolution"), funded Spain\'s wars, and made the Manila galleon route (Acapulco to Manila) one of the most profitable trade routes in history.',
    color: AMBER,
  },
];

// ── Dutch Golden Age ────────────────────────────────────────────────────────

const DUTCH_INSIGHTS: InsightEntry[] = [
  {
    label: 'The VOC — World\'s First Multinational Corporation (1602)',
    detail:
      'The Vereenigde Oost-Indische Compagnie (Dutch East India Company) was the most powerful corporation in history. Founded in 1602 with a government-granted monopoly on Asian trade, the VOC was the world\'s first publicly traded company — the Amsterdam Stock Exchange was created specifically to trade its shares. At its peak, the VOC employed 50,000 people, operated 200 ships, maintained its own army of 30,000 soldiers, had the power to wage war, negotiate treaties, establish colonies, and mint coins. Its market capitalization, adjusted for inflation, was roughly $7.9 trillion — larger than Apple, Amazon, and Microsoft combined. It paid dividends averaging 18% annually for nearly 200 years.',
  },
  {
    label: 'The Spice Monopoly — Nutmeg Worth More Than Gold',
    detail:
      'The VOC\'s wealth was built on a simple monopoly: control the supply of spices at the source. Nutmeg, which grew only on the tiny Banda Islands in modern Indonesia, was worth more than gold by weight in Europe — used as a preservative, a medicine, and a status symbol. To secure its monopoly, the VOC committed genocide on the Banda Islands in 1621: Governor-General Jan Pieterszoon Coen massacred or enslaved virtually the entire indigenous population of roughly 15,000 people, replacing them with Dutch planters and enslaved laborers. The VOC then controlled the world\'s entire nutmeg supply. When the English held one Banda island (Run), the Dutch traded them Manhattan for it — the most lopsided real estate deal in history.',
  },
  {
    label: 'The Dutch Golden Age — Wealth From the Waves',
    detail:
      'The profits of the VOC (and its Atlantic counterpart, the WIC) funded the Dutch Golden Age: Rembrandt, Vermeer, Spinoza, Huygens, the microscope, the telescope, modern banking, the stock exchange, and religious tolerance that attracted persecuted minorities from across Europe. Amsterdam became the world\'s financial capital. The tiny Dutch Republic — fewer than 2 million people — was the richest and most culturally advanced nation on Earth. Its merchant fleet was larger than those of England, France, Spain, and Portugal combined. The Dutch proved that commercial power could rival territorial empires — and that a small, clever nation could dominate global trade through financial innovation rather than military conquest.',
  },
  {
    label: 'Dutch Decline — Overstretched and Outgunned',
    detail:
      'The VOC\'s decline was gradual but inevitable. Corruption became endemic — employees smuggled spices for personal profit, governors lived like kings, and the company\'s bureaucracy bloated. Three Anglo-Dutch Wars (1652–1674) and the French invasion of 1672 drained the Republic\'s military and financial resources. England and France, with larger populations and greater state power, steadily eroded Dutch commercial dominance. The VOC was dissolved in 1799, bankrupt after nearly two centuries. But its legacy endured: the financial instruments it pioneered — joint-stock companies, stock exchanges, futures contracts, limited liability — became the foundation of modern capitalism.',
  },
];

// ── British East India Company ──────────────────────────────────────────────

const BRITISH_INSIGHTS: InsightEntry[] = [
  {
    label: 'EIC vs VOC — The Contest for Asia',
    detail:
      'The English East India Company (EIC), founded in 1600 — two years before the VOC — was initially the weaker rival. Where the VOC dominated the Spice Islands, the EIC was pushed toward India\'s textile trade, which proved even more lucrative. Indian cotton and silk were in insatiable demand in Europe, Africa, and the Americas. By the mid-1700s, as the VOC rotted from corruption, the EIC was transforming from a trading company into a sovereign power — maintaining armies, collecting taxes, and administering territories. The EIC effectively conquered India not through national policy but through corporate expansion, making it the most consequential corporation in human history.',
  },
  {
    label: 'From Traders to Rulers — Plassey to Raj',
    detail:
      'Robert Clive\'s victory at the Battle of Plassey (1757) — won partly through bribery and treachery — gave the EIC control of Bengal, India\'s richest province. The company then extracted Bengal\'s wealth so ruthlessly that it contributed to a famine that killed an estimated 10 million people (one-third of Bengal\'s population) in 1770. The EIC progressively conquered or subjugated the rest of India through a combination of military force, diplomatic manipulation, and the exploitation of local rivalries. By the 1800s, the EIC ruled over 200 million Indians with its own army of 260,000 soldiers — twice the size of the British Army. A private company governed a subcontinent.',
  },
  {
    label: 'The Opium Trade — Profit Through Addiction',
    detail:
      'The EIC\'s most profitable and morally bankrupt enterprise was the opium trade. To solve a massive trade deficit with China (Britain bought tea, silk, and porcelain but had nothing China wanted), the EIC grew opium in India and smuggled it into China, creating millions of addicts. When the Qing dynasty tried to stop the drug trade, Britain fought two Opium Wars (1839–1842, 1856–1860) to force China to accept the trade, seize Hong Kong, and impose humiliating "unequal treaties." The opium trade — a state-backed drug cartel — generated enormous profits for the EIC and is one of the most shameful chapters in British imperial history.',
  },
  {
    label: 'Britannia Rules the Waves',
    detail:
      'By the Napoleonic Wars, Britain possessed the most powerful navy in the world — a supremacy that would last over a century. The Royal Navy protected British trade routes, enforced blockades against rivals, and projected power to every ocean. Britain\'s naval dominance enabled an empire spanning a quarter of the world\'s surface and a third of its population. The concept of "Pax Britannica" — a period of relative peace enforced by British naval power from 1815 to 1914 — rested entirely on the ability of wooden (and later iron) warships to reach any coast on Earth. Sea power, more than any army, built the British Empire.',
  },
];

// ── Ship Evolution ──────────────────────────────────────────────────────────

const SHIP_TYPES: ShipEntry[] = [
  {
    name: 'Caravel (1450s–1530s)',
    era: 'The Explorer\'s Ship',
    description:
      'Small (50–80 tons), fast, and maneuverable, the caravel was the workhorse of the Age of Discovery. Its lateen (triangular) sails — borrowed from Arab dhow design — allowed it to sail much closer to the wind than square-rigged vessels, making it ideal for coastal exploration and the return voyage against prevailing winds. Columbus\'s Niña and Pinta were caravels. The ship\'s shallow draft let it navigate rivers and coastal waters. What it lacked in cargo capacity it made up in versatility — the caravel could go where no European ship had gone before.',
    color: TEAL,
  },
  {
    name: 'Carrack (1400s–1600s)',
    era: 'The Workhorse of Empire',
    description:
      'The carrack (Portuguese: nau) was the large, ocean-going complement to the caravel. At 200–600 tons with high fore- and aft-castles, it combined square sails for running before the wind with lateen sails for maneuvering. Carracks carried the bulk of cargo on long-distance voyages — da Gama\'s São Gabriel and Columbus\'s Santa María were carracks. Their size made them seaworthy but slow and unwieldy in combat. The carrack was the first ship type designed specifically for transoceanic voyages, and it remained the dominant European ocean-going vessel for over a century.',
    color: COPPER,
  },
  {
    name: 'Galleon (1530s–1700s)',
    era: 'The Warship-Trader',
    description:
      'The galleon evolved from the carrack with lower, sleeker lines, a longer hull relative to beam, and the distinctive beaked prow. It was both a warship and a cargo carrier — Spanish treasure galleons hauled silver across the Atlantic while mounting 20–60 cannons for defense. The Manila galleon, at 1,000–2,000 tons, was among the largest wooden ships of its era. Drake\'s Golden Hind was a galleon. The English "race-built" galleons of the Elizabethan era — lower, faster, more heavily gunned — proved decisive against the Spanish Armada in 1588.',
    color: CRIMSON,
  },
  {
    name: 'Frigate (1600s–1800s)',
    era: 'The Eyes of the Fleet',
    description:
      'Fast, maneuverable warships carrying 24–44 guns on a single gun deck, frigates were the cruisers of the sailing navy — used for scouting, convoy escort, commerce raiding, and independent operations. Too light to stand in the line of battle, they were the most versatile and glamorous warships afloat. Frigate captains had the most independent commands in the navy, and their exploits filled the adventure novels of the era (Hornblower, Aubrey-Maturin). The USS Constitution ("Old Ironsides") was a heavy frigate whose victories in the War of 1812 stunned the Royal Navy.',
    color: OCEAN,
  },
  {
    name: 'Ship-of-the-Line (1650s–1850s)',
    era: 'The Floating Fortress',
    description:
      'The ultimate expression of wooden warship technology: three-masted, three-decked behemoths carrying 60–130 cannons and 600–900 men. Ships-of-the-line fought in formal battle lines (hence the name), exchanging devastating broadsides at close range. Nelson\'s HMS Victory (104 guns) is the most famous example. First-rate ships-of-the-line took years to build, consumed 6,000 trees (roughly 100 acres of forest), and cost as much as a modern aircraft carrier relative to national GDP. A single broadside could fire a ton of iron in under 30 seconds. They were the most powerful weapons platforms on Earth until the ironclad.',
    color: NAVY,
  },
];

// ── Navigation Technology ───────────────────────────────────────────────────

const NAV_INSIGHTS: InsightEntry[] = [
  {
    label: 'Dead Reckoning — Educated Guessing',
    detail:
      'Before reliable instruments, sailors navigated by dead reckoning: estimating position based on speed, direction, and time elapsed since the last known position. Speed was measured by dropping a log overboard and timing how fast the ship passed it (hence "knots" and "log book"). Direction came from the magnetic compass — adopted from China via the Arab world in the 12th century. Dead reckoning accumulated errors with every estimate, and after weeks at sea, a ship\'s calculated position could be hundreds of miles from its actual location. Entire fleets were lost to navigational errors — including four British warships wrecked on the Scilly Isles in 1707, killing 1,400 men.',
  },
  {
    label: 'The Astrolabe and Cross-Staff — Finding Latitude',
    detail:
      'Determining latitude (north-south position) was solved relatively early. The mariner\'s astrolabe — a simplified version of the astronomer\'s instrument — measured the altitude of the sun at noon or Polaris at night, giving latitude to within about one degree (60 nautical miles). The cross-staff and later the backstaff offered simpler alternatives. Portuguese navigators of the 15th century could determine their latitude with reasonable accuracy — which is why they "ran the latitude," sailing to the desired north-south position and then turning east or west until they hit their target. Latitude was the easy part. Longitude was the nightmare.',
  },
  {
    label: 'The Longitude Problem — The Greatest Unsolved Problem in Navigation',
    detail:
      'Longitude (east-west position) was the deadliest unsolved problem in navigation for 300 years. In theory, it was simple: compare local time (from the sun) with the time at a reference meridian. One hour of difference equals 15 degrees of longitude. In practice, no clock could keep accurate time on a rolling, salt-sprayed, temperature-fluctuating ship for months at sea. Pendulum clocks were useless. The British government offered a £20,000 prize (roughly £3 million today) in 1714 to anyone who could solve the problem. The scientific establishment expected an astronomical solution. Instead, a self-taught Yorkshire carpenter named John Harrison solved it.',
  },
  {
    label: 'Harrison\'s Chronometer (1761) — The Clock That Changed the World',
    detail:
      'John Harrison spent 31 years building increasingly sophisticated marine timekeepers. His masterpiece, the H4 — a large pocket watch rather than a clock — lost only 5 seconds over 81 days during its sea trial to Jamaica in 1761. For the first time in history, a navigator could determine longitude to within half a degree. The Board of Longitude, dominated by astronomers who favored their own lunar-distance method, grudgingly acknowledged Harrison\'s achievement but delayed his prize for years. Captain James Cook took a copy of H4 on his second voyage and called it "our never-failing guide." The marine chronometer made accurate ocean navigation possible and is arguably the most important invention of the Age of Sail.',
  },
  {
    label: 'The Sextant (1757) — Precision at Sea',
    detail:
      'The sextant replaced earlier instruments by allowing simultaneous measurement of the angle between the horizon and a celestial body — sun, moon, or star — with a precision of about one arc-minute. Unlike the astrolabe, which required a steady hand and a level platform (impossible on a moving ship), the sextant used a system of mirrors that automatically compensated for the ship\'s motion. Combined with Harrison\'s chronometer and published tables of celestial positions (nautical almanacs), the sextant gave navigators the tools to fix their position anywhere on the globe to within a few miles. The combination of sextant + chronometer + almanac was the GPS of the sailing age.',
  },
];

// ── Naval Warfare ───────────────────────────────────────────────────────────

const NAVAL_TIMELINE: TimelineEntry[] = [
  {
    year: '1571',
    title: 'Battle of Lepanto — The Last Galley Battle',
    description:
      'The Holy League (Spain, Venice, Papal States) defeated the Ottoman fleet in the Gulf of Patras, Greece, in the last major battle fought primarily between oar-powered galleys. Over 400 galleys clashed with 40,000 killed. Lepanto checked Ottoman expansion in the western Mediterranean and demonstrated that the "invincible" Ottoman navy could be beaten. But the battle also marked the end of an era — within decades, sailing warships with broadside cannons would make galleys obsolete.',
    color: CRIMSON,
  },
  {
    year: '1588',
    title: 'The Spanish Armada — Divine Wind Denied',
    description:
      'Philip II of Spain sent 130 ships and 30,000 men to invade England. The English fleet — smaller, faster, lower-built galleons commanded by Drake, Hawkins, and Howard — harassed the Armada up the Channel, preventing it from linking with the invasion army in the Netherlands. English fire ships scattered the Armada at Gravelines, and storms drove the surviving ships around Scotland and Ireland, where many wrecked on the rocky coasts. Spain lost roughly half its fleet and its reputation for naval invincibility. England\'s survival transformed it from a minor kingdom into a major naval power and ensured that Protestantism would survive in Northern Europe.',
    color: GOLD,
  },
  {
    year: '1652–1674',
    title: 'Anglo-Dutch Wars — Birth of the Line of Battle',
    description:
      'Three wars between England and the Dutch Republic for control of global trade produced the tactical revolution that defined naval warfare for 200 years: the line of battle. Instead of chaotic melees, admirals formed their ships into single-file lines, bringing maximum broadside firepower to bear in coordinated volleys. The Fighting Instructions of 1653 formalized the tactic. The wars also saw De Ruyter\'s audacious Raid on the Medway (1667) — Dutch warships sailed up the Thames, burning English ships at anchor and towing away the flagship Royal Charles. It remains the most humiliating naval defeat in English history.',
    color: DUTCH_ORANGE,
  },
  {
    year: '1805',
    title: 'Battle of Trafalgar — Nelson\'s Immortal Victory',
    description:
      'Off Cape Trafalgar, Spain, Horatio Nelson\'s 27 ships attacked the Franco-Spanish fleet of 33 ships in two perpendicular columns — deliberately breaking the line-of-battle orthodoxy to achieve decisive concentration. Nelson\'s fleet destroyed or captured 22 enemy ships without losing one. Nelson himself was killed by a sniper\'s bullet during the battle, dying in Victory\'s cockpit after learning of his triumph. Trafalgar ended any possibility of Napoleon invading Britain, confirmed British naval supremacy for a century, and made Nelson the greatest naval hero in history. His signal — "England expects that every man will do his duty" — became the most famous in naval history.',
    color: NAVY,
  },
];

// ── The Slave Trade ─────────────────────────────────────────────────────────

const SLAVE_TRADE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Triangular Trade — The Machine of Human Misery',
    detail:
      'The Atlantic slave trade operated on a brutal triangular circuit: European manufactured goods (guns, textiles, metalware, alcohol) sailed to West Africa, where they were traded for enslaved human beings. The enslaved were shipped across the Atlantic on the "Middle Passage" to the Americas, where they were sold for plantation commodities — sugar, tobacco, cotton, coffee, rice, indigo. These commodities sailed back to Europe, where they were sold at enormous profit, funding the purchase of more trade goods, and the cycle began again. This triangle operated for over 300 years and forcibly transported an estimated 12.5 million Africans across the Atlantic. Roughly 1.8 million died during the Middle Passage alone.',
  },
  {
    label: 'The Middle Passage — Hell at Sea',
    detail:
      'The Middle Passage — the voyage from Africa to the Americas — lasted 6–10 weeks and was one of the most horrific experiences in human history. Enslaved people were packed below decks in spaces sometimes only 18 inches high, chained together, lying in their own waste. Disease was rampant: dysentery, smallpox, ophthalmia (which caused blindness), and "flux" killed thousands. Mortality rates averaged 15–20% on early voyages; some ships lost half their cargo. Captains who feared disease would throw sick enslaved people overboard alive. Suicide attempts were common — some enslaved people refused to eat, and were force-fed with a speculum oris (a metal funnel forced into the mouth). Slave ships could be smelled from five miles downwind.',
  },
  {
    label: 'How Sail Enabled and Sustained Slavery',
    detail:
      'The Atlantic slave trade was impossible without the sailing ship. Only ocean-going vessels could transport hundreds of people across 3,000–5,000 miles of open water. The trade wind patterns of the Atlantic — northeast trades from Europe to Africa, southeast trades from Africa to the Caribbean, westerlies from America back to Europe — created a natural circuit that sailing ships could exploit. Sugar plantations in the Caribbean and Brazil, tobacco and cotton in North America, and coffee in Central America all depended on enslaved labor. The profits from slave-produced commodities fueled the Industrial Revolution, built Liverpool, Bristol, Nantes, and Amsterdam into major cities, and enriched families whose descendants still benefit from that wealth.',
  },
  {
    label: 'Abolition — From Complicity to Conscience',
    detail:
      'Britain, the dominant slave-trading nation by the 1700s, abolished its slave trade in 1807 and emancipation throughout the Empire in 1833 — using the Royal Navy to enforce the ban by intercepting slave ships. The abolition movement was driven by evangelical Christians (William Wilberforce), former enslaved people who told their stories (Olaudah Equiano), and Quakers who organized the first effective human rights campaign in history. The irony is inescapable: the same naval power that had enforced the slave trade was repurposed to end it. France, the Netherlands, Spain, Portugal, and Brazil continued the trade for decades after Britain stopped. The last known Atlantic slave voyage landed in Cuba in 1867.',
  },
];

// ── Golden Age of Piracy ────────────────────────────────────────────────────

const PIRACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Golden Age (1650s–1730s)',
    detail:
      'The "Golden Age of Piracy" flourished because the conditions were perfect: the Caribbean was full of poorly defended Spanish treasure ships, European wars created thousands of unemployed sailors, colonial governance was weak, and pirate havens like Port Royal (Jamaica), Nassau (Bahamas), and Tortuga (Haiti) offered safe harbors with no questions asked. Pirates were essentially freelance maritime predators exploiting the gaps in state control. At the peak, an estimated 1,000–2,000 pirates operated in the Caribbean, the West African coast, the Indian Ocean, and the American seaboard. Their era ended when European navies grew strong enough to patrol their colonial waters and when governors like Woodes Rogers offered pardons — or the gallows.',
  },
  {
    label: 'Blackbeard — Edward Teach (d. 1718)',
    detail:
      'The most famous pirate in history cultivated terror as a business strategy. Edward Teach ("Blackbeard") wove slow-burning fuses into his enormous black beard, creating a smoking, demonic appearance that terrified victims into surrendering without a fight — which was the point. Violence was expensive; intimidation was free. He blockaded the port of Charleston, South Carolina, operated a fleet of four ships, and terrified the American coast for two years. He was killed in a savage boarding action by Royal Navy sailors in November 1718, supposedly taking five musket balls and 20 sword cuts before falling. His severed head was hung from a ship\'s bowsprit.',
  },
  {
    label: 'Bartholomew Roberts — "Black Bart" (1682–1722)',
    detail:
      'The most successful pirate of the Golden Age captured over 400 ships — far more than Blackbeard or any other pirate. Roberts was unusual: he dressed flamboyantly, drank only tea, and maintained strict discipline (his ship\'s articles banned gambling and required lights out by 8 PM). He operated off West Africa, the Caribbean, and the American coast for three years, evading the Royal Navy through superior seamanship. His death in battle against HMS Swallow in 1722 is often cited as the end of the Golden Age of Piracy.',
  },
  {
    label: 'Privateers and Letters of Marque',
    detail:
      'The line between pirate and patriot was thin. Governments issued "letters of marque" — legal licenses to attack enemy shipping in wartime. Sir Francis Drake, who plundered Spanish treasure ships and circumnavigated the globe, was a privateer operating with Queen Elizabeth\'s blessing (and sharing the profits with her). Henry Morgan sacked Panama City as a privateer, then became the Lieutenant Governor of Jamaica. Many pirates started as legitimate privateers during wartime and simply continued raiding when peace broke out. The distinction between state-sanctioned violence at sea and criminal piracy was often a matter of paperwork.',
  },
];

// ── Columbian Exchange ──────────────────────────────────────────────────────

const EXCHANGE_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Biological Revolution',
    detail:
      'When Columbus connected the Old World and New World in 1492, he triggered the most significant biological event since the extinction of the dinosaurs. For 10,000+ years, the Americas had been biologically isolated from Eurasia and Africa. The reconnection exchanged plants, animals, diseases, and peoples between hemispheres — transforming diets, ecosystems, and populations on every continent. The Columbian Exchange, as historian Alfred Crosby named it, was the most important consequence of the Age of Sail — more significant than any empire, any war, or any trade route.',
  },
  {
    label: 'From the Americas to the World',
    detail:
      'The New World gave the Old World foods that now define cuisines worldwide: potatoes (which became the staple crop of Ireland, Germany, and Russia), tomatoes (essential to Italian cooking — there were no tomatoes in Italy before 1500), maize/corn (now the world\'s most produced grain), chocolate, vanilla, tobacco, peanuts, squash, peppers (both chili and bell), avocados, pineapples, cassava (manioc), sweet potatoes, turkeys, and rubber. The potato alone may have increased Europe\'s population by 25% and its urbanization by 30%. Without New World crops, the modern world\'s food supply would be unrecognizable.',
  },
  {
    label: 'From the Old World to the Americas',
    detail:
      'Europe brought to the Americas: horses (which transformed Plains Indian cultures), cattle, pigs, sheep, goats, chickens, wheat, barley, rice, sugarcane (the crop that built the slave economy), coffee, bananas, oranges, and grapes. But the most devastating export was invisible: diseases. Smallpox, measles, influenza, typhus, and malaria swept through indigenous populations with no immunity. Mortality rates of 90–95% were common. An estimated 56 million indigenous Americans died in the century after contact — roughly 90% of the pre-contact population. It was the largest demographic catastrophe in human history, and it made European conquest not just possible but inevitable.',
  },
  {
    label: 'Seeds of Globalization',
    detail:
      'The Columbian Exchange was the first chapter of globalization. Sugar grown in the Caribbean by enslaved Africans was sweetened tea from China drunk by factory workers in Manchester. Silver mined by conscripted indigenous laborers in Peru flowed to Manila to buy Chinese porcelain. Tobacco from Virginia was smoked in Istanbul. Potatoes from the Andes fed Prussian armies. The Age of Sail created the interconnected world economy we live in today — for better (global food diversity, cultural exchange) and worse (colonialism, slavery, ecological destruction, pandemic disease). There was no going back to isolated hemispheres.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Prince Henry the Navigator',
    years: '1394–1460',
    contribution:
      'Never actually navigated anywhere himself, but single-handedly launched the Age of Discovery by funding dozens of expeditions down the West African coast from his base at Sagres. He established a school of navigation, improved ship design (the caravel), and broke the psychological barrier of Cape Bojador. Without Henry\'s obsessive sponsorship, Portugal — a tiny, poor kingdom on Europe\'s western edge — would never have become the first global maritime empire.',
  },
  {
    name: 'Christopher Columbus',
    years: '1451–1506',
    contribution:
      'His 1492 voyage connected the Old and New Worlds permanently, triggering the Columbian Exchange, European colonization of the Americas, and the Atlantic slave trade. A brilliant navigator but a terrible governor — his administration of Hispaniola was so brutal that he was arrested and sent back to Spain in chains. He died believing he had reached Asia. His legacy is the most contested in exploration history: hero or harbinger of genocide, depending on perspective.',
  },
  {
    name: 'Vasco da Gama',
    years: '1460–1524',
    contribution:
      'First European to reach India by sea (1498), opening the spice trade route that had been the Holy Grail of Portuguese exploration for 80 years. His voyage was commercially transformative — the cargo he brought back paid for the expedition 60 times over. Da Gama was also ruthless: on his second voyage, he bombarded Calicut and burned a ship full of Muslim pilgrims, including women and children. He established the pattern of European behavior in the Indian Ocean: trade backed by overwhelming naval violence.',
  },
  {
    name: 'Ferdinand Magellan',
    years: '1480–1521',
    contribution:
      'Led the first expedition to circumnavigate the Earth, though he died in the Philippines before completing it. His voyage proved the Earth\'s true size, discovered the strait at South America\'s tip, crossed the Pacific, and demonstrated that all the world\'s oceans were connected. The 99-day Pacific crossing — with the crew eating rats and leather to survive — was the longest open-ocean voyage in history to that point. Of 270 men who departed, only 18 returned.',
  },
  {
    name: 'Sir Francis Drake',
    years: '1540–1596',
    contribution:
      'Privateer, circumnavigator, and England\'s most feared naval commander. Drake plundered Spanish treasure ships and ports throughout the Americas, circumnavigated the globe (1577–1580), and played a leading role in defeating the Spanish Armada (1588). To the English, he was a national hero; to the Spanish, he was "El Draque" — a pirate and a devil. His career embodied the era\'s blurred line between state-sponsored violence and outright piracy.',
  },
  {
    name: 'Captain James Cook',
    years: '1728–1779',
    contribution:
      'The greatest explorer-navigator in history. Cook\'s three Pacific voyages (1768–1779) mapped more of the Earth than any other individual: the coastlines of New Zealand and eastern Australia, Hawaii, hundreds of Pacific islands, and the edges of Antarctica. He proved that the mythical "Great Southern Continent" was ice, not habitable land. Cook virtually eliminated scurvy through diet management. He was killed in Hawaii in 1779. His charts were so accurate that some were still in use in the 20th century.',
  },
  {
    name: 'Admiral Horatio Nelson',
    years: '1758–1805',
    contribution:
      'The greatest naval commander in history. Blind in one eye, missing his right arm, seasick for much of his career — yet undefeated in battle. His victories at the Nile (1798), Copenhagen (1801), and Trafalgar (1805) destroyed French and Spanish naval power, saved Britain from invasion, and secured British maritime supremacy for a century. His death at Trafalgar — shot by a sniper at the moment of his greatest triumph — made him Britain\'s most celebrated military hero. His body was preserved in a barrel of brandy for the voyage home.',
  },
  {
    name: 'Zheng He',
    years: '1371–1433',
    contribution:
      'Chinese Muslim eunuch admiral who commanded the largest fleet the world had ever seen: 300+ ships, some reportedly 400 feet long, carrying 27,000 men. His seven voyages (1405–1433) visited Southeast Asia, India, Arabia, and East Africa — demonstrating Chinese naval power that dwarfed anything in Europe. Then the Ming dynasty canceled the voyages, burned the ships, and turned inward. Zheng He represents the greatest "what if" of naval history: what if China had continued exploring?',
  },
];

// ── Decline ─────────────────────────────────────────────────────────────────

const DECLINE_TIMELINE: TimelineEntry[] = [
  {
    year: '1807',
    title: 'SS Clermont — Steam Takes to the Water',
    description:
      'Robert Fulton\'s steamship Clermont made the first commercially successful steam-powered voyage on the Hudson River. Early steamships were unreliable and coal-hungry, but they offered what sail never could: independence from wind. A steamship could maintain a schedule, navigate against the wind, and operate in calms. By the 1840s, transatlantic steamship lines were running regular passenger services. Sailing ships could still compete on long bulk-cargo routes (coal was expensive), but their monopoly was broken.',
    color: STORM_GRAY,
  },
  {
    year: '1843',
    title: 'SS Great Britain — Iron and Screw Propeller',
    description:
      'Isambard Kingdom Brunel\'s Great Britain was the first ocean-going ship built of iron with a screw propeller — the template for every modern ship. Iron hulls were stronger, lighter, and more durable than wood; screw propellers were more efficient than paddle wheels. The Great Britain crossed the Atlantic in 14 days. Wooden sailing ships could not match iron steamships for speed, reliability, or cargo capacity. The future was iron, steam, and propellers — and the 400-year reign of the wooden sailing ship was ending.',
    color: SLATE,
  },
  {
    year: '1869',
    title: 'Suez Canal — The Shortcut That Killed Sail',
    description:
      'The Suez Canal cut the voyage from Europe to Asia by 4,000+ miles — but sailing ships couldn\'t use it. The canal was too narrow for tacking, and calms in the Red Sea could trap sailing vessels for weeks. Steamships could transit the canal easily, making them overwhelmingly faster on the Europe-to-Asia route that had been the economic backbone of the Age of Sail. The canal didn\'t just shorten the route; it made sailing ships economically obsolete on the most lucrative trade routes in the world.',
    color: SAND,
  },
  {
    year: '1870s–1900s',
    title: 'The Last Clippers — Beautiful and Doomed',
    description:
      'Clipper ships — the fastest and most beautiful sailing vessels ever built, with towering clouds of canvas and sleek, knife-like hulls — were the sailing world\'s last gasp. Ships like Cutty Sark and Thermopylae competed on the tea and wool routes where speed mattered and coal was expensive. A clipper could cover 400+ miles in a day. But economics were inexorable: steamships were more reliable, could carry more cargo, and kept to schedules. By 1900, commercial sailing ships had been pushed to the margins — bulk cargo routes like Australian wheat and Chilean nitrate. By World War I, the Age of Sail was effectively over. Four centuries of wind-powered exploration, conquest, and commerce had given way to coal, oil, and steam.',
    color: MAHOGANY,
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

function ShipCard({ ships }: { ships: ShipEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {ships.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${s.color}`,
            paddingLeft: 18,
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: s.color,
              marginBottom: 2,
            }}
          >
            {s.name}
          </h3>
          <p
            style={{
              fontSize: '0.8rem',
              color: SLATE,
              marginBottom: 8,
              fontStyle: 'italic',
            }}
          >
            {s.era}
          </p>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>
            {s.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

const FIGURE_COLORS = [GOLD, CRIMSON, TEAL, INDIGO, ROSE, OCEAN, NAVY, AMBER];

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
            The Age of Sail — When Wind Powered Empires (c. 1400–1850)
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
              For four centuries, the destiny of nations depended on the wind.
              Wooden ships carrying canvas sails connected every continent,
              created the first global economy, built and destroyed empires, and
              reshaped the biological makeup of the planet itself. The Age of
              Sail was the era when humanity went from a collection of isolated
              civilizations to a single, interconnected — and often violently
              unequal — world.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              It began with Portuguese caravels creeping down the African coast
              and ended with clipper ships racing steam-powered rivals they could
              never beat. In between: the spice trade, the slave trade, the
              Columbian Exchange, the rise and fall of maritime empires, the
              golden age of piracy, and the slow accumulation of navigational
              knowledge that turned the terrifying unknown ocean into a
              highway. This is the story of how wind and wood changed everything.
            </p>
          </motion.div>
        </header>

        {/* ── Precursors ────────────────────────────────────────────────── */}
        <SectionWrapper
          id="precursors"
          icon="⛵"
          title="Before the Age of Sail — The Navigators Who Came First"
          accentColor={TEAL}
          intro="Europeans were latecomers to ocean navigation. Polynesian, Arab, Viking, and Chinese sailors had been crossing open ocean for centuries — sometimes millennia — before Portuguese caravels left sight of land. The Age of Sail was a European phenomenon, but its precursors were global."
        >
          <InsightGrid items={PRECURSOR_INSIGHTS} />
        </SectionWrapper>

        {/* ── Portuguese Pioneers ───────────────────────────────────────── */}
        <SectionWrapper
          id="portuguese"
          icon="🧭"
          title="Portuguese Pioneers — The Nation That Started It All"
          accentColor={GREEN}
          intro="Portugal, a poor kingdom of barely one million people on Europe's Atlantic edge, launched the Age of Discovery. Driven by the desire for gold, spices, and Christian converts, Portuguese navigators spent 80 years methodically pushing down the African coast until they rounded the Cape of Good Hope and broke into the Indian Ocean — shattering the Arab-Venetian monopoly on the spice trade and creating history's first global maritime empire."
        >
          <TimelineCard entries={PORTUGUESE_TIMELINE} />
        </SectionWrapper>

        {/* ── Spanish Conquest ──────────────────────────────────────────── */}
        <SectionWrapper
          id="spanish"
          icon="⚓"
          title="Spanish Conquest — Columbus, Magellan, and the Treasure Fleets"
          accentColor={CRIMSON}
          intro="While Portugal sailed east, Spain sailed west — and stumbled into two continents that no European knew existed. Columbus's accidental discovery of the Americas, Magellan's circumnavigation proving the Earth's true size, and Spain's extraction of silver from the conquered Aztec and Inca empires created the first truly global economy. Spanish treasure fleets carried enough silver to reshape the monetary systems of Europe and Asia."
        >
          <TimelineCard entries={SPANISH_TIMELINE} />
        </SectionWrapper>

        {/* ── Dutch Golden Age ─────────────────────────────────────────── */}
        <SectionWrapper
          id="dutch"
          icon="🌷"
          title="The Dutch Golden Age — When a Corporation Ruled the Seas"
          accentColor={DUTCH_ORANGE}
          intro="The Dutch Republic — a tiny, flat, waterlogged nation with fewer than 2 million people — became the richest and most powerful maritime nation on Earth in the 17th century. Their secret weapon wasn't military might but financial innovation: the world's first multinational corporation, the first stock exchange, and a merchant fleet larger than those of all their rivals combined."
        >
          <InsightGrid items={DUTCH_INSIGHTS} />
        </SectionWrapper>

        {/* ── British East India Company ────────────────────────────────── */}
        <SectionWrapper
          id="british"
          icon="🏴"
          title="The British East India Company — Corporate Conquest"
          accentColor={NAVY}
          intro="The English East India Company started as a spice trader and ended as the ruler of a subcontinent. Over two centuries, the EIC evolved from a group of London merchants into a sovereign power with its own army, its own territory, and its own foreign policy — conquering India not as an act of national policy but as a byproduct of corporate profit-seeking. It was the most powerful and destructive corporation in history."
        >
          <InsightGrid items={BRITISH_INSIGHTS} />
        </SectionWrapper>

        {/* ── Ship Evolution ────────────────────────────────────────────── */}
        <SectionWrapper
          id="ships"
          icon="🚢"
          title="Ship Evolution — From Caravel to Ship-of-the-Line"
          accentColor={COPPER}
          intro="The history of the Age of Sail is inseparable from the evolution of the ships themselves. Each new design expanded what was possible: the caravel made coastal exploration feasible, the carrack enabled transoceanic voyages, the galleon combined commerce and warfare, the frigate provided speed and versatility, and the ship-of-the-line became the most powerful weapon on Earth. Four centuries of incremental improvement produced floating fortresses that could circle the globe."
        >
          <ShipCard ships={SHIP_TYPES} />
        </SectionWrapper>

        {/* ── Navigation Technology ─────────────────────────────────────── */}
        <SectionWrapper
          id="navigation"
          icon="🌟"
          title="Navigation Technology — Solving the Deadliest Puzzle"
          accentColor={GOLD}
          intro="The Age of Sail was ultimately a story of knowledge overcoming ignorance. Early navigators sailed into the unknown with little more than a compass and a prayer. Over four centuries, a series of inventions — the astrolabe, the cross-staff, the sextant, and finally Harrison's marine chronometer — transformed oceanic navigation from educated guessing into precise science. The longitude problem, unsolved for 300 years, was the greatest technical challenge of the era."
        >
          <InsightGrid items={NAV_INSIGHTS} />
        </SectionWrapper>

        {/* ── Naval Warfare ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="naval-warfare"
          icon="💥"
          title="Naval Warfare — Broadsides, Battle Lines, and Trafalgar"
          accentColor={CRIMSON}
          intro="Control of the sea meant control of trade, territory, and the fate of nations. Naval warfare evolved from chaotic galley melees to the disciplined line-of-battle, where hundred-gun ships exchanged devastating broadsides at close range. The great naval battles of the Age of Sail — Lepanto, the Armada, Trafalgar — decided the fates of empires and reshaped the map of the world."
        >
          <TimelineCard entries={NAVAL_TIMELINE} />
        </SectionWrapper>

        {/* ── The Slave Trade ──────────────────────────────────────────── */}
        <SectionWrapper
          id="slave-trade"
          icon="⛓️"
          title="The Atlantic Slave Trade — The Darkest Chapter"
          accentColor={BLOOD_RED}
          intro="The Age of Sail's greatest crime was the Atlantic slave trade. For over 300 years, European ships transported an estimated 12.5 million Africans across the Atlantic in conditions of unimaginable horror. The slave trade was not incidental to the Age of Sail — it was central. The profits from slave-produced commodities fueled European industrialization, built great cities, and created wealth whose effects persist to this day. The sailing ship made this atrocity possible on an industrial scale."
        >
          <InsightGrid items={SLAVE_TRADE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Golden Age of Piracy ─────────────────────────────────────── */}
        <SectionWrapper
          id="piracy"
          icon="🏴‍☠️"
          title="The Golden Age of Piracy — Outlaws of the Open Sea"
          accentColor={ROSE}
          intro="The Golden Age of Piracy (roughly 1650s–1730s) flourished in the gaps between empires — wherever treasure ships sailed and colonial navies were thin. Pirates were not the romantic adventurers of popular fiction: they were violent, desperate men (and a few women) operating in a lawless space where fortune and death were equally likely. But they were also, in their own brutal way, innovators: pirate ships were among the most democratic institutions of their era."
        >
          <InsightGrid items={PIRACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Columbian Exchange ────────────────────────────────────────── */}
        <SectionWrapper
          id="columbian-exchange"
          icon="🌍"
          title="The Columbian Exchange — When Biology Went Global"
          accentColor={SEA_GREEN}
          intro="The most consequential result of the Age of Sail wasn't any empire, battle, or trade route — it was the biological reconnection of the world's hemispheres. When European ships bridged the Atlantic, they triggered an exchange of plants, animals, diseases, and peoples that transformed every continent. Potatoes, tomatoes, and chocolate traveled east; horses, wheat, and smallpox traveled west. The Columbian Exchange reshaped global agriculture, demographics, and ecosystems in ways that are still unfolding."
        >
          <InsightGrid items={EXCHANGE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="key-figures"
          icon="👤"
          title="Key Figures — The Navigators, Admirals, and Empire-Builders"
          accentColor={GOLD}
          intro="The Age of Sail was shaped by individuals of extraordinary ambition, skill, and often ruthlessness. These are the navigators who sailed into the unknown, the admirals who commanded floating fortresses, and the empire-builders whose decisions echoed across centuries."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Decline ──────────────────────────────────────────────────── */}
        <SectionWrapper
          id="decline"
          icon="🏭"
          title="Decline — Steam, Iron, and the End of an Era"
          accentColor={STORM_GRAY}
          intro="The Age of Sail died not in battle but by obsolescence. Steam engines freed ships from the tyranny of the wind. Iron hulls replaced oak planking. The Suez Canal — impassable for sailing ships — rewrote the economics of global trade. By the late 1800s, the great sailing ships that had connected the world for four centuries were relics, outrun and outclassed by the industrial technology they had helped create."
        >
          <TimelineCard entries={DECLINE_TIMELINE} />
        </SectionWrapper>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer
          style={{
            padding: '48px 0 64px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                maxWidth: 700,
                margin: '0 auto 24px',
                fontSize: '0.95rem',
              }}
            >
              The Age of Sail lasted roughly 450 years — from Portuguese caravels
              nosing past Cape Bojador in 1434 to the last commercial clipper ships
              in the early 1900s. In that span, sailing ships connected every
              inhabited continent, created the first global economy, transported
              millions into slavery, exchanged the biological heritage of
              hemispheres, and built the world we live in. Every container ship in a
              modern port, every global supply chain, every international flight
              path follows routes that were first charted by sailors who had nothing
              but wind, wood, and nerve.
            </p>
            <Link
              to="/"
              style={{
                color: OCEAN,
                textDecoration: 'none',
                fontSize: '0.95rem',
              }}
            >
              ← Back to Timeline
            </Link>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
