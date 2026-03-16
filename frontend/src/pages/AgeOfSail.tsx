/**
 * AgeOfSail — comprehensive deep-dive on the Age of Sail (~1400–1860s).
 *
 * Route: /age-of-sail
 *
 * Sections:
 *  1. Hero — headline, scope of the age that connected the world
 *  2. Origins — Iberian seafaring, caravel, navigation advances
 *  3. Portuguese Voyages — Dias, da Gama, Albuquerque, spice trade
 *  4. Spanish Empire of the Seas — Columbus, Magellan, Manila Galleons, silver fleets
 *  5. Dutch Golden Age — VOC, Spice Islands, financial innovations
 *  6. English Sea Power — Drake, Raleigh, East India Company, Armada
 *  7. Naval Warfare Evolution — broadside warships, line of battle, Trafalgar
 *  8. The Slave Trade — triangular trade, Middle Passage, 12.5 million enslaved
 *  9. Piracy — Golden Age of Piracy, buccaneers, privateers
 * 10. Navigation Revolution — chronometer, celestial navigation, cartography
 * 11. End of the Age — steam, Suez Canal, iron hulls
 * 12. Legacy — globalization, colonialism, modern world
 * 13. Key Figures
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
const TEAL = '#14b8a6';
const CRIMSON = '#dc2626';
const AMBER = '#d97706';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const COPPER = '#b45309';
const DARK_RED = '#991b1b';
const EMERALD = '#059669';
const SKY = '#38bdf8';
const ORANGE = '#ea580c';
const SAND = '#d4a373';

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
// Section Data
// ─────────────────────────────────────────────────────────────────────────────

// ── Origins ─────────────────────────────────────────────────────────────────

const ORIGINS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Prince Henry the Navigator (1394–1460)',
    detail:
      'The Portuguese Infante Henrique — Prince Henry — never sailed far himself, but he ignited the Age of Exploration. From his base at Sagres on Portugal\'s windswept southwestern tip, he sponsored dozens of expeditions down the West African coast, established a navigation school, and pushed Portuguese sailors past the psychological barrier of Cape Bojador (1434) — the point beyond which medieval Europeans believed monsters lurked and the sea boiled. Under his patronage, Portugal leapfrogged every other European maritime power. His investment in navigation, cartography, and shipbuilding created the infrastructure that would allow a tiny nation of 1 million people to build a global empire.',
  },
  {
    label: 'The Caravel: The Ship That Changed Everything',
    detail:
      'The Portuguese caravel was the spacecraft of the 15th century — a revolutionary vessel that made oceanic exploration possible. Small (50–80 tons), nimble, and equipped with lateen (triangular) sails, it could sail closer to the wind than any European ship before it. This was critical: European ships could sail south along the African coast easily with prevailing winds, but getting back required tacking against them. The caravel solved this problem. Later versions — the caravela redonda — added square sails for open-ocean speed. Virtually every major Portuguese discovery was made in a caravel.',
  },
  {
    label: 'Navigation: From Guesswork to Science',
    detail:
      'Medieval European navigation was crude — hugging coastlines, estimating speed by watching flotsam, steering by the North Star. The Age of Sail demanded better. Portuguese navigators adopted the magnetic compass (from China via Arab traders), the astrolabe and cross-staff (measuring the angle of the sun or Polaris above the horizon to determine latitude), and increasingly accurate portolan charts. They developed the volta do mar — sailing west into the open Atlantic to catch favorable winds back to Europe, rather than fighting coastal headwinds. This counterintuitive technique was a closely guarded state secret.',
  },
  {
    label: 'Why Portugal? The Unlikely Superpower',
    detail:
      'Portugal was small, poor, and perched on the edge of Europe. But this was precisely its advantage. Blocked from Mediterranean trade by Italian city-states and with the Reconquista against the Moors largely complete by 1249 (over two centuries before Spain), Portugal turned to the Atlantic. Its long coastline produced experienced sailors. Its geographic position was ideal for catching the trade winds to Africa and the Americas. And its rulers — especially Prince Henry, then King João II and King Manuel I — made oceanic exploration a national project, investing crown funds and establishing a state monopoly on the spice trade that generated enormous returns.',
  },
];

// ── Portuguese Voyages ──────────────────────────────────────────────────────

const PORTUGUESE_TIMELINE: TimelineEntry[] = [
  {
    year: '1434',
    title: 'Cape Bojador — Breaking the Fear Barrier',
    description:
      'Gil Eanes, on his second attempt, sailed past Cape Bojador on the western Saharan coast — the point medieval European sailors believed marked the edge of the navigable world. Maps showed sea monsters, boiling waters, and a "Green Sea of Darkness" beyond it. The reality was anticlimactic: more coastline. But psychologically, it was the moon landing of the 15th century. Once Bojador was passed, Portuguese exploration accelerated rapidly southward along the African coast.',
    color: TEAL,
  },
  {
    year: '1488',
    title: 'Bartolomeu Dias Rounds the Cape of Good Hope',
    description:
      'After being blown south by a fierce storm for 13 days, Dias realized he had sailed around the southern tip of Africa without seeing it. When he turned east and found the coastline running northeast, he knew the route to the Indian Ocean was open. He named it the "Cape of Storms," but King João II renamed it the "Cape of Good Hope" — hope that the sea route to India\'s spice markets was finally within reach. Dias had solved the geographic puzzle that had consumed Portugal for 70 years.',
    color: OCEAN,
  },
  {
    year: '1498',
    title: 'Vasco da Gama Reaches India',
    description:
      'Da Gama\'s fleet of four ships arrived at Calicut (Kozhikode) on India\'s Malabar Coast on May 20, 1498, after a 10-month voyage from Lisbon. The local zamorin (ruler) was unimpressed by da Gama\'s trade goods — cloth and trinkets that were laughable compared to the silks and spices of the East. But the voyage was transformative: da Gama returned to Lisbon with a cargo of pepper and cinnamon worth 60 times the cost of the expedition. The spice trade — previously monopolized by Venetian and Arab middlemen — was about to be disrupted forever.',
    color: GOLD,
  },
  {
    year: '1500–1515',
    title: 'Afonso de Albuquerque — Empire by Force',
    description:
      'Albuquerque, the "Caesar of the East," built the Portuguese maritime empire through strategic violence. He seized Goa (1510, making it the capital of Portuguese India), Malacca (1511, controlling the strait between the Indian Ocean and the South China Sea), and Hormuz (1515, dominating the entrance to the Persian Gulf). His strategy was simple: capture chokepoints. By controlling the narrow straits and key ports, a tiny fleet could tax and control the entire Indian Ocean trade. At its peak, Portugal — with a total population under 2 million — dominated maritime trade from Mozambique to Macau.',
    color: CRIMSON,
  },
  {
    year: '1500',
    title: 'Pedro Álvares Cabral — Brazil "Discovered"',
    description:
      'Sailing to India via da Gama\'s route, Cabral swung so far west to catch the volta do mar winds that he struck the coast of Brazil. Whether this was accidental or a deliberate detour (Portugal may have known about the landmass from prior secret voyages) remains debated. Regardless, the Treaty of Tordesillas (1494) — which split the non-Christian world between Spain and Portugal — conveniently placed Brazil on Portugal\'s side of the line. Brazil would become Portugal\'s most valuable colony, first for brazilwood dye, then sugar, then gold and diamonds.',
    color: EMERALD,
  },
];

// ── Spanish Empire ──────────────────────────────────────────────────────────

const SPANISH_TIMELINE: TimelineEntry[] = [
  {
    year: '1492',
    title: 'Columbus: The Miscalculation That Changed the World',
    description:
      'Christopher Columbus didn\'t discover a new route to Asia — he discovered a new continent by accident. His key error: he calculated the Earth\'s circumference at roughly 25,000 km (the actual figure is ~40,000 km), making the westward distance to Japan seem manageable. No reputable geographer agreed — they were right. Columbus would have died at sea if the Americas hadn\'t been in the way. He went to his grave in 1506 still insisting he\'d reached Asia. His four voyages (1492–1504) opened the Americas to European colonization and initiated the Columbian Exchange — the transfer of plants, animals, diseases, and people between hemispheres that killed an estimated 90% of the indigenous American population.',
    color: AMBER,
  },
  {
    year: '1519–1522',
    title: 'Magellan\'s Circumnavigation — The Most Dangerous Voyage in History',
    description:
      'Ferdinand Magellan, a Portuguese navigator sailing for Spain, departed with five ships and 270 men. He navigated the treacherous strait at South America\'s southern tip (now the Strait of Magellan), crossed the vast Pacific — which he named for its deceptive calm — and reached the Philippines, where he was killed in a skirmish with indigenous warriors on Mactan Island in April 1521. His Basque navigator Juan Sebastián Elcano completed the circumnavigation, arriving in Spain in September 1522 with one battered ship (the Victoria) and just 18 survivors. The 26 tons of cloves in the hold were worth more than the entire expedition had cost.',
    color: CRIMSON,
  },
  {
    year: '1565–1815',
    title: 'The Manila Galleons — 250 Years of Transpacific Trade',
    description:
      'For 250 years, the Manila Galleons — massive Spanish treasure ships — sailed annually between Acapulco, Mexico, and Manila in the Philippines. They carried Mexican silver east and Chinese silk, porcelain, spices, and lacquerware west. This was the world\'s first regular transpacific trade route, and it was enormously profitable: a single galleon could carry goods worth millions of pesos. The route connected three continents: American silver flowed to China (which demanded it for its monetary system), Asian luxury goods reached Europe via Mexico, and the global economy began to knit together. The route was so regular and so profitable that English and Dutch privateers considered capturing a Manila Galleon the ultimate prize.',
    color: GOLD,
  },
  {
    year: '1545–1700s',
    title: 'Silver Fleets and the Treasure of Potosí',
    description:
      'The discovery of massive silver deposits at Potosí (in modern Bolivia) and Zacatecas (Mexico) gave Spain access to more precious metal than any empire in history. The Spanish treasure fleet system — twice-yearly convoys of armed galleons — carried this silver from Havana to Seville. Between 1500 and 1800, approximately 150,000 tons of silver crossed the Atlantic. This flood of silver caused a "price revolution" in Europe (sustained inflation as the money supply expanded), funded Spain\'s wars across Europe, and ultimately flowed to China, which absorbed roughly half the world\'s silver production to back its economy. Potosí, at 4,000 meters altitude, killed an estimated 8 million indigenous and African slave laborers over three centuries.',
    color: ROSE,
  },
];

// ── Dutch Golden Age ────────────────────────────────────────────────────────

const DUTCH_INSIGHTS: InsightEntry[] = [
  {
    label: 'The VOC: History\'s First Multinational Corporation',
    detail:
      'The Vereenigde Oost-Indische Compagnie (Dutch East India Company, or VOC), chartered in 1602, was the world\'s first publicly traded company. It could negotiate treaties, wage war, establish colonies, and mint coins — a corporation with sovereign powers. At its peak, the VOC employed 50,000 people, operated 200 ships, and controlled the global spice trade. It established Batavia (Jakarta) as its Asian headquarters and ruthlessly monopolized the production of cloves, nutmeg, and mace in the Moluccas (Spice Islands) — including the systematic massacre of the Bandanese people and destruction of rival spice trees. The VOC\'s stock was traded on the Amsterdam Stock Exchange, the world\'s first stock exchange, making it both a marvel of financial innovation and an instrument of colonial violence.',
  },
  {
    label: 'Financial Innovations: Inventing Modern Capitalism',
    detail:
      'The Dutch Golden Age (c. 1600–1700) produced financial innovations that underpin modern capitalism. The Amsterdam Stock Exchange (1602) allowed shares to be freely traded, creating the modern concept of stock markets. The Amsterdam Wisselbank (1609) operated as a proto-central bank, providing stable currency and clearing services. Joint-stock companies spread investment risk across thousands of shareholders. Futures contracts, short selling, and options trading all appeared in Amsterdam. Tulip mania (1637) — history\'s first recorded speculative bubble — demonstrated the dangers of these innovations. The Dutch invented many of the financial instruments that Wall Street uses today.',
  },
  {
    label: 'The Spice Islands: Monopoly Through Violence',
    detail:
      'Nutmeg and cloves, native only to a few tiny islands in the Moluccas (modern Maluku, Indonesia), were worth more per pound than gold in 17th-century Europe. The VOC established a monopoly through extreme violence. On the Banda Islands — the world\'s sole source of nutmeg — the VOC governor Jan Pieterszoon Coen orchestrated the near-complete genocide of the Bandanese population in 1621: of approximately 15,000 inhabitants, most were killed, enslaved, or starved. The islands were then repopulated with Dutch-controlled plantations worked by enslaved laborers. This monopoly on nutmeg lasted over 150 years, until the British successfully smuggled seedlings to their own colonies.',
  },
  {
    label: 'Dutch Naval Power: Defeating the Superpowers',
    detail:
      'The tiny Dutch Republic — seven provinces with 2 million people — built the world\'s largest merchant fleet and one of its most powerful navies. In the early 1600s, more ships sailed under the Dutch flag than the rest of Europe combined. Dutch admirals like Michiel de Ruyter humiliated the English Royal Navy multiple times, most spectacularly in the Raid on the Medway (1667), when Dutch warships sailed up the Thames, broke through the chain barrier, and towed away the English flagship HMS Royal Charles. The Dutch also fought the Spanish, Portuguese, and French simultaneously. Their advantage: superior ship design, better-trained crews, and the wealth generated by their commercial empire.',
  },
];

// ── English Sea Power ───────────────────────────────────────────────────────

const ENGLISH_TIMELINE: TimelineEntry[] = [
  {
    year: '1577–1580',
    title: 'Sir Francis Drake — Pirate, Patriot, Circumnavigator',
    description:
      'Drake\'s circumnavigation of the globe (only the second ever) was part exploration, part piracy, and all audacity. Sailing through the Strait of Magellan, he raided undefended Spanish ports and treasure ships along South America\'s Pacific coast — a region Spain considered its private lake — capturing enough silver and gold to return a 4,700% profit on the expedition\'s investment. Queen Elizabeth I knighted him on the deck of the Golden Hind and took a personal share of the plunder. Spain called him "El Draque" — a near-mythical figure of terror. Drake proved that no Spanish possession was safe from English sea power.',
    color: OCEAN,
  },
  {
    year: '1588',
    title: 'The Spanish Armada — The Battle That Reshaped Europe',
    description:
      'Philip II of Spain assembled the largest fleet Europe had ever seen — 130 ships carrying 30,000 men — to invade England, overthrow the Protestant Elizabeth I, and restore Catholicism. The English fleet, smaller but faster and better-gunned, harassed the Armada through the English Channel. At Gravelines, English fireships scattered the Spanish formation, and a running battle inflicted serious damage. But the killing blow came from the weather: fierce storms drove the Armada around Scotland and Ireland, wrecking dozens of ships. Only 67 ships and fewer than 10,000 men returned to Spain. The Armada\'s defeat didn\'t end Spanish power immediately, but it shattered the myth of Spanish invincibility and opened the oceans to English and Dutch expansion.',
    color: CRIMSON,
  },
  {
    year: '1600',
    title: 'The English East India Company — The Corporation That Conquered India',
    description:
      'Chartered by Elizabeth I on December 31, 1600, the English East India Company (EIC) began as a spice-trading venture. Outcompeted by the Dutch in the Spice Islands, the EIC pivoted to India — a decision that would reshape global history. Over two centuries, the company evolved from traders to rulers: it maintained private armies, collected taxes, administered justice, and governed territories with more people than most European nations. By the mid-1800s, the EIC effectively controlled the Indian subcontinent with 260,000 soldiers — twice the size of the British Army. It was the most powerful corporation in human history, and its legacy — for better and worse — defines modern South Asia.',
    color: GOLD,
  },
  {
    year: '1607–1620s',
    title: 'English Colonization of North America',
    description:
      'England\'s American colonies began with Jamestown (1607, Virginia) — a near-disaster that survived only through the neighboring Powhatan Confederacy\'s assistance and the discovery that tobacco was enormously profitable. The Pilgrims followed at Plymouth (1620) and the Puritans at Massachusetts Bay (1630). Unlike Spain\'s conquest-and-extraction model, English colonization involved permanent settlement and displacement of indigenous populations. These small coastal settlements, seemingly insignificant compared to Spain\'s American empire, would eventually produce the United States — the dominant world power. England\'s maritime capabilities, developed during the Age of Sail, made this colonial project possible.',
    color: TEAL,
  },
];

// ── Naval Warfare ───────────────────────────────────────────────────────────

const NAVAL_WARFARE_INSIGHTS: InsightEntry[] = [
  {
    label: 'From Ramming to Broadside: The Gunship Revolution',
    detail:
      'Medieval naval warfare was essentially land warfare on floating platforms — ships rammed and grappled each other, and soldiers fought hand-to-hand. The introduction of heavy cannons on warships in the 15th–16th centuries transformed everything. The development of the gunport (cutting holes in the hull to mount cannon below the main deck) allowed ships to carry dozens of heavy guns on multiple decks. By the mid-1600s, a first-rate ship of the line carried 100+ cannons and could fire a devastating broadside — the simultaneous discharge of all guns on one side. Naval warfare became an artillery duel, and the ship itself became the weapon.',
  },
  {
    label: 'The Line of Battle: Naval Warfare\'s Defining Tactic',
    detail:
      'The "line of battle" — warships sailing in a single file line, each able to fire its broadside at the enemy — became the standard naval tactic by the 1650s. It maximized firepower while minimizing the risk of ships masking each other\'s guns. Battles became stately, almost choreographed affairs: two long lines of warships pounding each other at close range. The tactic demanded standardized ships (hence "ships of the line"), iron discipline, and signaling systems. It dominated naval warfare for 200 years — until Nelson shattered the convention at Trafalgar.',
  },
  {
    label: 'Battle of Trafalgar (October 21, 1805)',
    detail:
      'The decisive naval battle of the Napoleonic Wars. Admiral Horatio Nelson, commanding 27 British ships against 33 French and Spanish vessels off Cape Trafalgar, Spain, broke every rule of conventional naval warfare. Instead of forming a parallel line, he drove two columns of ships perpendicular to the enemy line, cutting it into three sections and creating a chaotic close-range melee where British gunnery superiority was decisive. The Franco-Spanish fleet lost 22 ships; the British lost none. Nelson was killed by a French sniper during the battle — his last words reportedly "Thank God, I have done my duty." Trafalgar ensured British naval supremacy for the next century.',
  },
  {
    label: 'Ships of the Line: Floating Fortresses',
    detail:
      'A first-rate ship of the line was the most complex and expensive machine of the pre-industrial age. HMS Victory (Nelson\'s flagship at Trafalgar, launched 1765) required 6,000 trees — primarily oak — to build, equivalent to 100 acres of forest. She displaced 3,500 tons, carried 104 guns on three decks, and needed a crew of 850 men. Building, maintaining, and manning these ships consumed enormous national resources: Britain\'s Royal Dockyards were the largest industrial enterprises in 18th-century Europe. A single broadside from Victory fired over half a ton of iron shot — devastating at the typical engagement range of 100–400 yards.',
  },
];

// ── Slave Trade ─────────────────────────────────────────────────────────────

const SLAVE_TRADE_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Triangular Trade: A System of Human Commodification',
    detail:
      'The Atlantic slave trade operated on a three-legged route that maximized profit at every stage. Ships sailed from European ports (Liverpool, Bristol, Nantes, Amsterdam) to West Africa carrying manufactured goods — textiles, guns, iron bars, alcohol — which were exchanged for enslaved Africans. The "Middle Passage" carried these captives across the Atlantic to the Caribbean, Brazil, and the American South. The ships then returned to Europe loaded with slave-produced commodities: sugar, tobacco, cotton, coffee, indigo. Every leg of the triangle generated profit. The system operated for over 350 years and was the economic engine of the Atlantic world.',
  },
  {
    label: 'The Middle Passage: A Horror Beyond Description',
    detail:
      'Between 10 and 12 weeks crammed into ships, enslaved Africans were chained in spaces barely 18 inches high, lying in their own waste. "Tight packing" — cramming the maximum number of bodies into the hold — was standard practice on most ships, despite mortality rates of 15–20%. Disease (dysentery, smallpox, scurvy), dehydration, and suffocation killed millions during the crossing. Captives who refused food were force-fed using a speculum oris (a metal device that pried open the jaw). Those who died were thrown overboard. Some captives chose suicide by jumping into the sea. The Zong massacre (1781) — where 133 enslaved people were thrown overboard alive so the ship\'s owners could collect insurance — epitomized the trade\'s dehumanization.',
  },
  {
    label: 'The Numbers: Scale of the Catastrophe',
    detail:
      'Between 1500 and 1870, an estimated 12.5 million Africans were forcibly embarked on slave ships. Roughly 10.7 million survived the Middle Passage — 1.8 million died at sea. But these numbers capture only the transatlantic crossing: millions more died during capture, forced marches to the coast, and in coastal holding pens (barracoons). The total death toll attributable to the slave trade may exceed 20 million. The largest destinations: Brazil (5.5 million), the Caribbean (4 million), Spanish America (1.3 million), and North America (400,000). The trade depopulated vast regions of West and Central Africa, distorted African political systems (as coastal kingdoms raided interior peoples for captives), and created the African diaspora.',
  },
  {
    label: 'Abolition: The Long Fight to End the Trade',
    detail:
      'Britain abolished the slave trade in 1807 (after decades of campaigning by abolitionists like William Wilberforce, Thomas Clarkson, and formerly enslaved people like Olaudah Equiano) and slavery itself in 1833. The Royal Navy\'s West Africa Squadron patrolled the Atlantic to enforce the ban, intercepting slave ships and freeing captives — though the trade continued illegally for decades. The United States banned the importation of enslaved people in 1808 but domestic slavery persisted until 1865. Brazil, the last Western Hemisphere nation, didn\'t abolish slavery until 1888. Abolition was not merely humanitarian — it was also driven by economic shifts (industrial capitalism replacing plantation economics) and the resistance of enslaved people themselves, most dramatically in the Haitian Revolution (1791–1804).',
  },
];

// ── Piracy ──────────────────────────────────────────────────────────────────

const PIRACY_TIMELINE: TimelineEntry[] = [
  {
    year: '1560s–1600s',
    title: 'Privateers and Sea Dogs — State-Sponsored Pirates',
    description:
      'The line between pirate and patriot was deliberately blurred. European monarchs issued "letters of marque" — legal licenses authorizing private ship captains to attack enemy merchant vessels and keep a share of the plunder. English "Sea Dogs" like Drake, Hawkins, and Raleigh were celebrated national heroes who were, in practice, pirates with government backing. Privateering was cheap warfare: monarchs got naval power without paying for a navy, and captains got rich. The system persisted for centuries — the United States issued letters of marque as late as the War of 1812.',
    color: OCEAN,
  },
  {
    year: '1630s–1690s',
    title: 'Buccaneers of the Caribbean',
    description:
      'The original buccaneers were French, English, and Dutch outcasts on Hispaniola who hunted wild cattle and smoked the meat on wooden frames called "boucans." Driven off the island by the Spanish, they turned to piracy. Operating from Tortuga and later Port Royal, Jamaica (nicknamed "the wickedest city on Earth"), buccaneers like Henry Morgan raided Spanish colonial cities with devastating effectiveness. Morgan\'s sack of Panama City in 1671 — a 1,200-man overland expedition across the Isthmus of Panama — was one of the most audacious military operations of the century. He was arrested, sent to England, knighted, and returned to Jamaica as lieutenant governor.',
    color: COPPER,
  },
  {
    year: '1690s–1730s',
    title: 'The Golden Age of Piracy',
    description:
      'The Golden Age of Piracy (roughly 1690–1730) produced the pirates who entered legend: Blackbeard (Edward Teach), who lit slow fuses in his beard to appear demonic; Bartholomew "Black Bart" Roberts, the most successful pirate in history (400+ ships captured); Anne Bonny and Mary Read, who fought alongside "Calico Jack" Rackham; and Samuel Bellamy, the "Robin Hood of the Sea." Most Golden Age pirates were former sailors and navy men, displaced by the end of the War of Spanish Succession (1714), who chose piracy over poverty. They operated democratically: captains were elected, plunder was shared relatively equally, and articles of agreement governed conduct. An estimated 1,000–2,000 pirates at the peak disrupted global trade routes.',
    color: GOLD,
  },
  {
    year: '1700s–1800s',
    title: 'The Barbary Corsairs and Beyond',
    description:
      'Piracy was not exclusively a Caribbean phenomenon. The Barbary corsairs of North Africa (based in Algiers, Tunis, and Tripoli) raided European shipping and coastlines for centuries, enslaving an estimated 1–1.25 million Europeans between 1530 and 1780. Pirate republics thrived in Madagascar, serving as bases for raiding Indian Ocean trade routes. Chinese pirate fleets in the South China Sea could number hundreds of ships — Zheng Yi Sao (Ching Shih) commanded an estimated 1,800 vessels and 80,000 pirates in the early 1800s, making her the most powerful pirate in history. Piracy was a global phenomenon, not just a Caribbean one.',
    color: ROSE,
  },
];

// ── Navigation Revolution ───────────────────────────────────────────────────

const NAVIGATION_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Longitude Problem: The Greatest Scientific Challenge of the Age',
    detail:
      'Latitude — your north-south position — could be determined by measuring the angle of the sun or Polaris above the horizon. Longitude — your east-west position — was a different matter entirely. Without knowing longitude, ships could be hundreds of miles off course, leading to shipwrecks, starvation, and disaster. The Scilly naval disaster of 1707 — when four Royal Navy ships struck rocks off southwest England, killing nearly 2,000 sailors — made solving the longitude problem a national priority. In 1714, the British Parliament offered the Longitude Prize: £20,000 (roughly £3 million today) for a practical method of determining longitude at sea.',
  },
  {
    label: 'John Harrison\'s Chronometer: A Carpenter Who Defeated the Astronomers',
    detail:
      'The scientific establishment believed longitude would be solved by astronomy — comparing the moon\'s position against star tables to calculate time at a reference meridian. John Harrison, a self-taught carpenter from Yorkshire with no formal education, proposed a simpler solution: a clock accurate enough to keep the time at the port of departure. Since the Earth rotates 360° in 24 hours (15° per hour), knowing the time difference between your location and your home port gives you your longitude. The problem: no clock of the era could maintain accuracy on a pitching, rolling, salt-sprayed ship across weeks of sailing. Harrison spent 31 years building five increasingly refined marine chronometers. His H4 (1761) — a large pocket-watch-sized masterpiece — lost only 5 seconds over an 81-day Atlantic voyage. The Board of Longitude, dominated by astronomers, grudgingly acknowledged his success but delayed his prize for years.',
  },
  {
    label: 'Dead Reckoning to Celestial Navigation',
    detail:
      'The evolution of navigation during the Age of Sail was dramatic. Early sailors used "dead reckoning" — estimating position based on speed (measured by throwing a log overboard and timing how quickly the ship passed it), direction (compass), and elapsed time. Errors accumulated dangerously over long voyages. Celestial navigation — using the sun, moon, stars, and planets to fix position — gradually replaced dead reckoning. The sextant (developed in the 1730s) allowed precise angular measurements even on a moving ship. Combined with Harrison\'s chronometer and published nautical almanacs (tables of celestial body positions), 18th-century navigators could fix their position to within a few miles anywhere on Earth.',
  },
  {
    label: 'Cartography: Mapping the Unknown World',
    detail:
      'The Age of Sail transformed cartography from medieval fantasy to scientific precision. The Mercator projection (1569) — which distorts area but preserves compass bearings — became the standard navigational chart and remains so today. Portuguese and Spanish cartographers produced increasingly detailed charts of coastlines, harbors, currents, and winds. By the 18th century, Captain James Cook\'s three voyages (1768–1779) mapped the Pacific with unprecedented accuracy, charting New Zealand, the east coast of Australia, and dozens of Pacific islands. Cook\'s charts were so accurate that some remained in use well into the 20th century.',
  },
];

// ── End of the Age ──────────────────────────────────────────────────────────

const END_OF_AGE_TIMELINE: TimelineEntry[] = [
  {
    year: '1807',
    title: 'Robert Fulton\'s Clermont — Steam Power Arrives',
    description:
      'Fulton\'s North River Steamboat (commonly called the Clermont) demonstrated the commercial viability of steam-powered navigation on the Hudson River. While not the first steamboat, it was the first to be commercially successful, making the 150-mile trip from New York City to Albany in 32 hours — against the current. Steam power freed ships from dependence on wind, making voyages predictable and timetables possible for the first time. Sailing ships didn\'t disappear overnight — they remained competitive on long routes through the 1860s — but the writing was on the wall.',
    color: SLATE,
  },
  {
    year: '1838–1840s',
    title: 'Transatlantic Steamships — The Ocean Conquered',
    description:
      'The SS Great Western (1838) proved that steamships could cross the Atlantic reliably and profitably. Isambard Kingdom Brunel\'s SS Great Britain (1845) — the first iron-hulled, screw-propeller-driven ocean liner — pointed toward the future of ship design. Steam packet services established regular transatlantic schedules, reducing crossing times from weeks (dependent on wind) to days (dependent only on coal). The Cunard Line (founded 1840) institutionalized reliable transatlantic service. By the 1860s, sail was marginalized on major trade routes, surviving mainly on long-distance bulk cargo routes where fuel costs favored wind.',
    color: INDIGO,
  },
  {
    year: '1869',
    title: 'The Suez Canal — Shortcut That Killed Sail',
    description:
      'The Suez Canal, connecting the Mediterranean to the Red Sea, reduced the London-to-Mumbai voyage from 12,000 miles (around the Cape of Good Hope) to 6,000 miles. But the narrow, windless canal was useless to sailing ships — they needed to be towed through by steam tugs, negating any advantage. Steamships, however, could transit under their own power and refuel at coaling stations along the route. The Suez Canal was the death blow for long-distance commercial sail: any trade route to Asia now massively favored steam. Within two decades of the canal\'s opening, sailing ships were relics on major shipping lanes.',
    color: AMBER,
  },
  {
    year: '1860s–1890s',
    title: 'Iron Hulls, Steel Ships, and the Last Clippers',
    description:
      'Iron-hulled ships (from the 1830s) and steel-hulled ships (from the 1870s) could be built larger, stronger, and more durable than wooden vessels. The clipper ships — the ultimate expression of sailing technology — made their last stand on the wool and grain routes to Australia, where the long open-ocean runs still favored sail. Ships like the Cutty Sark (1869) and Thermopylae were among the fastest sailing vessels ever built, achieving speeds over 17 knots. But even the clippers couldn\'t compete with steam on cost and reliability. By 1900, commercial sail was effectively dead on all major routes. An age that had begun with the Portuguese caravel ended with the steam whistle.',
    color: OCEAN,
  },
];

// ── Legacy ──────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'The First Globalization',
    detail:
      'The Age of Sail created the first truly global economy. Before the 15th century, the world\'s major civilizations — European, Islamic, Indian, Chinese — were loosely connected by overland routes and coastal trade. By the 18th century, a web of maritime trade routes linked every inhabited continent. Chinese tea was consumed in London drawing rooms, Mexican silver circulated in Manila markets, Caribbean sugar sweetened European coffee, and Indian textiles dressed West African elites. For the first time, events on one side of the world could cause economic ripples on the other. This maritime-driven globalization — built on wind, wood, and human muscle — was the direct ancestor of today\'s global economy.',
  },
  {
    label: 'Colonialism: The Dark Foundation of the Modern World',
    detail:
      'The Age of Sail enabled European colonialism — the domination of most of the non-European world by a handful of European nations. By 1914, European empires controlled 84% of the world\'s land surface. The consequences were devastating: the near-annihilation of indigenous peoples in the Americas (from an estimated 60 million in 1492 to a nadir of perhaps 6 million); the enslavement and forced transportation of 12.5 million Africans; the subjugation of South and Southeast Asia; and the extraction of wealth that fueled Europe\'s industrialization. The political boundaries, economic structures, ethnic tensions, and power imbalances created by colonial empires continue to shape the modern world.',
  },
  {
    label: 'Naval Supremacy and Geopolitics',
    detail:
      'The Age of Sail established a principle that persists today: whoever controls the seas controls global commerce and, by extension, the world order. Portugal\'s chokepoint strategy, the Dutch commercial empire, British naval supremacy after Trafalgar — all demonstrated that maritime power was the foundation of global influence. Alfred Thayer Mahan\'s "The Influence of Sea Power upon History" (1890) codified these lessons and influenced the naval buildups that preceded World War I. Today, the US Navy\'s aircraft carrier battle groups serve the same function as the Royal Navy\'s ships of the line: projecting power across oceans and ensuring freedom of navigation on which global trade depends.',
  },
  {
    label: 'The Columbian Exchange: Biology as Destiny',
    detail:
      'The Age of Sail enabled the greatest biological exchange in human history. European diseases (smallpox, measles, influenza, typhus) killed an estimated 90% of indigenous Americans — the most catastrophic demographic event in human history. In return, New World crops (potatoes, maize, tomatoes, tobacco, cacao, chili peppers) transformed Old World agriculture and diets. The potato alone may have added 200 million people to the European population by 1900. Horses, cattle, pigs, and wheat were introduced to the Americas. Sugar, originally from Southeast Asia, was planted in the Caribbean and Brazil, creating the plantation economy that drove the slave trade. The biological consequences of the Age of Sail were more transformative than any war, treaty, or invention.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Prince Henry the Navigator',
    years: '1394–1460',
    contribution:
      'Portuguese prince who launched the Age of Exploration. Never sailed far himself, but sponsored the voyages that mapped the West African coast, developed the caravel, and established Portugal as the world\'s leading maritime power. Without Henry, the Age of Sail might have begun a century later.',
  },
  {
    name: 'Vasco da Gama',
    years: 'c. 1460–1524',
    contribution:
      'First European to reach India by sea (1498), opening the spice trade route that made Portugal fabulously wealthy. His second voyage (1502) was marked by extreme violence, including the bombardment of Calicut and the burning of a ship full of Muslim pilgrims. He was appointed Viceroy of India shortly before his death.',
  },
  {
    name: 'Christopher Columbus',
    years: '1451–1506',
    contribution:
      'Genoese navigator who, sailing for Spain, reached the Caribbean in 1492 — initiating sustained European contact with the Americas. His geographic error (underestimating the Earth\'s size by 40%) led to one of history\'s most consequential accidents. His treatment of indigenous peoples was brutal even by the standards of his time.',
  },
  {
    name: 'Ferdinand Magellan',
    years: '1480–1521',
    contribution:
      'Portuguese navigator leading a Spanish expedition that achieved the first circumnavigation of the globe (1519–1522). Magellan himself was killed in the Philippines, but his voyage proved the Earth\'s true size and opened the Pacific to European trade. Only 18 of his original 270 crew survived.',
  },
  {
    name: 'Sir Francis Drake',
    years: 'c. 1540–1596',
    contribution:
      'English privateer, explorer, and circumnavigator (the second after Magellan/Elcano). His raids on Spanish treasure ships and colonies returned enormous profits to Elizabeth I. Vice-admiral during the defeat of the Spanish Armada (1588). To the English, a national hero; to the Spanish, a pirate.',
  },
  {
    name: 'Afonso de Albuquerque',
    years: '1453–1515',
    contribution:
      'Built the Portuguese maritime empire in the Indian Ocean by capturing strategic chokepoints: Goa, Malacca, and Hormuz. His strategy — control the straits, tax the trade — allowed a tiny nation to dominate an ocean. Often called the "Caesar of the East" or the "Portuguese Mars."',
  },
  {
    name: 'Zheng He',
    years: '1371–1433',
    contribution:
      'Chinese Muslim eunuch admiral who commanded seven massive voyages (1405–1433) across the Indian Ocean with fleets of up to 300 ships — including "treasure ships" four times the size of Columbus\'s vessels. Reached East Africa decades before the Portuguese. China\'s decision to halt these voyages remains one of history\'s great what-ifs.',
  },
  {
    name: 'Horatio Nelson',
    years: '1758–1805',
    contribution:
      'Britain\'s greatest naval commander. His victories at the Nile (1798), Copenhagen (1801), and Trafalgar (1805) destroyed Napoleon\'s naval ambitions and established British maritime supremacy for a century. Killed at Trafalgar at the moment of his greatest triumph. His flagship HMS Victory survives as a museum ship in Portsmouth.',
  },
  {
    name: 'James Cook',
    years: '1728–1779',
    contribution:
      'The greatest navigator of the Age of Sail. His three voyages (1768–1779) mapped the Pacific with unprecedented accuracy, charted New Zealand and Australia\'s east coast, crossed the Antarctic Circle, and disproved the existence of a habitable southern continent. Killed in Hawaii in 1779. His charts remained in use for over a century.',
  },
  {
    name: 'John Harrison',
    years: '1693–1776',
    contribution:
      'Self-taught English clockmaker who solved the longitude problem — the greatest navigational challenge of the age. His marine chronometer H4 (1761) kept time accurately enough at sea to determine longitude, saving countless lives and enabling precise navigation. The scientific establishment resisted his solution for decades.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shared presentational components
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

const FIGURE_COLORS = [OCEAN, GOLD, CRIMSON, TEAL, INDIGO, EMERALD, AMBER, PURPLE, SKY, COPPER];

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

export default function AgeOfSail() {
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
            The Age of Sail — When Wind and Wood Connected the World (c. 1400–1860)
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
              For four centuries, wooden ships powered by nothing but wind
              reshaped the entire planet. They carried explorers past the edge of
              every known map, traders to every habitable coast, soldiers to
              establish empires, and millions of enslaved people across oceans
              in chains. The Age of Sail created the modern world — its global
              economy, its political boundaries, its demographic reality, and
              its deepest injustices.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              It began with Portuguese caravels probing the coast of West Africa
              and ended with steam engines making sails obsolete. In between: the
              discovery of the Americas, the circumnavigation of the globe, the
              rise and fall of the world's first multinational corporations,
              the largest forced migration in human history, the Golden Age of
              Piracy, and naval battles that decided the fate of empires. This
              is the story of the age when mastering the wind meant mastering
              the world.
            </p>
          </motion.div>
        </header>

        {/* ── Origins ──────────────────────────────────────────────────── */}
        <SectionWrapper
          id="origins"
          icon="⛵"
          title="Origins — Portugal and the Birth of Oceanic Exploration"
          accentColor={TEAL}
          intro="The Age of Sail began in the most unlikely place: a small, poor kingdom on the western edge of Europe with barely a million inhabitants. Portugal had no business becoming a maritime superpower — but a combination of geographic luck, royal investment, and technological innovation turned it into the first nation to systematically explore the world's oceans."
        >
          <InsightGrid items={ORIGINS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Portuguese Voyages ───────────────────────────────────────── */}
        <SectionWrapper
          id="portuguese"
          icon="🧭"
          title="Portuguese Voyages — Mapping the Route to the East"
          accentColor={OCEAN}
          intro="For 80 years, Portuguese navigators inched down the African coast, around its southern tip, and across the Indian Ocean to India, Southeast Asia, and China. Each voyage pushed the boundary of the known world a little further. The route they established — around Africa to the spice markets of the East — broke the Venetian-Arab monopoly on the spice trade and made Portugal, per capita, the wealthiest nation in Europe."
        >
          <TimelineCard entries={PORTUGUESE_TIMELINE} />
        </SectionWrapper>

        {/* ── Spanish Empire ───────────────────────────────────────────── */}
        <SectionWrapper
          id="spanish"
          icon="🏴‍☠️"
          title="The Spanish Empire of the Seas — Silver, Conquest, and Global Trade"
          accentColor={AMBER}
          intro="While Portugal went east, Spain went west — and stumbled upon two continents. Spain's American empire, built on conquest and silver, made it the richest and most powerful nation in 16th-century Europe. The Manila Galleons connected Asia to the Americas, Spanish silver flooded the global economy, and the treasure fleets that carried it home became the most tempting targets on the seas."
        >
          <TimelineCard entries={SPANISH_TIMELINE} />
        </SectionWrapper>

        {/* ── Dutch Golden Age ─────────────────────────────────────────── */}
        <SectionWrapper
          id="dutch"
          icon="🌷"
          title="The Dutch Golden Age — Trade, Finance, and the VOC"
          accentColor={ORANGE}
          intro="The Dutch Republic proved that a tiny nation could dominate global trade through commercial innovation rather than territorial conquest. The VOC — the world's first multinational corporation — controlled the spice trade through a combination of financial sophistication, naval power, and ruthless violence. The Dutch invented modern capitalism at sea."
        >
          <InsightGrid items={DUTCH_INSIGHTS} />
        </SectionWrapper>

        {/* ── English Sea Power ────────────────────────────────────────── */}
        <SectionWrapper
          id="english"
          icon="🇬🇧"
          title="English Sea Power — From Pirates to Empire"
          accentColor={INDIGO}
          intro="England came late to oceanic exploration but ultimately surpassed all rivals. Beginning with state-sponsored pirates who raided Spanish treasure ships, England built a maritime tradition that evolved into the most powerful navy in history, the world's largest commercial empire, and colonies that spanned from Virginia to Bengal."
        >
          <TimelineCard entries={ENGLISH_TIMELINE} />
        </SectionWrapper>

        {/* ── Naval Warfare ────────────────────────────────────────────── */}
        <SectionWrapper
          id="naval-warfare"
          icon="⚔️"
          title="Naval Warfare Evolution — From Boarding to Broadside"
          accentColor={CRIMSON}
          intro="The Age of Sail transformed naval warfare from essentially land combat on floating platforms into a sophisticated art of gunnery, seamanship, and fleet tactics. The warships of the 18th century were the most complex and expensive machines of the pre-industrial age — floating fortresses carrying enough firepower to level a city."
        >
          <InsightGrid items={NAVAL_WARFARE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Slave Trade ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="slave-trade"
          icon="⛓️"
          title="The Atlantic Slave Trade — History's Greatest Crime"
          accentColor={DARK_RED}
          intro="The Age of Sail's darkest chapter: the forced transportation of 12.5 million Africans across the Atlantic over 350 years. The slave trade was not a sideshow — it was the economic engine of the Atlantic world, generating the wealth that fueled European industrialization while devastating African societies and creating the African diaspora. No honest account of the Age of Sail can omit its central role."
        >
          <InsightGrid items={SLAVE_TRADE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Piracy ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="piracy"
          icon="🏴‍☠️"
          title="Piracy — The Shadow Economy of the Seas"
          accentColor={GOLD}
          intro="Where wealth flows, pirates follow. The Age of Sail created a golden age of piracy — from state-sponsored privateers who blurred the line between patriotism and plunder, to Caribbean buccaneers who sacked Spanish cities, to the legendary outlaws of the early 1700s who briefly terrorized the Atlantic. Piracy was the dark mirror of maritime trade: democratic, violent, and surprisingly egalitarian."
        >
          <TimelineCard entries={PIRACY_TIMELINE} />
        </SectionWrapper>

        {/* ── Navigation Revolution ────────────────────────────────────── */}
        <SectionWrapper
          id="navigation"
          icon="🔭"
          title="The Navigation Revolution — From Dead Reckoning to Precision"
          accentColor={SKY}
          intro="The Age of Sail drove a revolution in navigation — from medieval guesswork to the precision science that could fix a ship's position to within a few miles anywhere on Earth. The longitude problem consumed the brightest minds in Europe for centuries and was finally solved not by an astronomer but by a self-taught carpenter from Yorkshire."
        >
          <InsightGrid items={NAVIGATION_INSIGHTS} />
        </SectionWrapper>

        {/* ── End of the Age ───────────────────────────────────────────── */}
        <SectionWrapper
          id="end-of-age"
          icon="🚂"
          title="The End of the Age — Steam, Iron, and the Death of Sail"
          accentColor={SLATE}
          intro="The Age of Sail didn't end with a single event but with a technological revolution that made wind power obsolete. Steam engines freed ships from dependence on weather, iron hulls replaced oak timbers, and the Suez Canal — useless to sailing ships — gave steamships an unbeatable shortcut to Asia. By 1900, four centuries of sailing supremacy were over."
        >
          <TimelineCard entries={END_OF_AGE_TIMELINE} />
        </SectionWrapper>

        {/* ── Legacy ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🌍"
          title="Legacy — The World the Age of Sail Built"
          accentColor={GREEN}
          intro="The Age of Sail created the modern world — for better and worse. It produced the first global economy, enabled European colonialism that reshaped every continent, initiated the greatest biological exchange in history, and established the principle that maritime power equals global power. We live in the world the Age of Sail built."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures of the Age of Sail"
          accentColor={GOLD}
          intro="The Age of Sail was shaped by visionary princes, ruthless admirals, brilliant navigators, and self-taught inventors. These are the people who pushed beyond the edge of every known map, built empires on ocean trade, and solved the navigational challenges that made it all possible."
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
            "He that would learn to pray, let him go to sea."
            — George Herbert (1593–1633)
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
