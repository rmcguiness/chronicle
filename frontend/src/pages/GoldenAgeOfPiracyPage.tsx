/**
 * GoldenAgeOfPiracyPage — comprehensive deep-dive on the Golden Age of Piracy (1650–1730).
 *
 * Route: /golden-age-of-piracy
 *
 * Sections:
 *  1. Hero — headline, overview of piracy's surprising reality
 *  2. Why It Happened — Atlantic trade, weak states, privateer pipeline, inequality
 *  3. Who Were the Pirates — demography, race, gender, backgrounds
 *  4. Pirate Democracy — elected captains, articles, worker's comp
 *  5. Famous Pirates — Blackbeard, Black Bart, Calico Jack, Every, Kidd
 *  6. Pirate Havens — Nassau, Tortuga, Libertalia, Port Royal
 *  7. Political Problem — trade disruption, class threat, revolutionary ideas
 *  8. End of the Golden Age — pardons, hangings, naval crackdown
 *  9. Myth vs Reality — walking the plank, buried treasure, Jolly Roger
 * 10. Legacy — maritime law, insurance, modern piracy
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const OCEAN = '#0c4a6e';
const RED = '#ef4444';
const BLUE = '#3b82f6';
const STEEL = '#64748b';
const ASH = '#94a3b8';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const GOLD = '#f59e0b';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const SKY = '#38bdf8';
const DARK_RED = '#991b1b';
const SAND = '#d4a574';
const NAVY = '#1e3a5f';

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

// ── Why the Golden Age Happened ─────────────────────────────────────────────

const CONDITIONS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Atlantic Trade Booming',
    detail:
      'By the late 17th century, the Atlantic was the richest shipping lane on Earth. Spanish silver from Peru and Mexico, sugar from the Caribbean, tobacco from Virginia, enslaved people from West Africa — massive wealth moving across oceans in wooden ships with minimal protection. For pirates, every merchant vessel was a floating treasure chest. The same trade routes that built European empires also created the richest hunting grounds in maritime history.',
  },
  {
    label: 'Weak State Power',
    detail:
      'Colonial navies were spread impossibly thin. The Royal Navy had to patrol thousands of miles of coastline, hundreds of islands, and multiple ocean shipping lanes — with a fleet designed primarily for European wars. Colonial governors had almost no enforcement capability. The Caribbean was essentially lawless water: no coast guard, no radio, no way to call for help. A pirate ship could operate for months without encountering a warship.',
  },
  {
    label: 'The Privateer-to-Pirate Pipeline',
    detail:
      'During wartime, European governments hired privateers — privately owned ships licensed to attack enemy commerce. Privateers were legal pirates, operating under "letters of marque." When wars ended, these licenses were revoked. Suddenly, thousands of experienced fighting sailors — men trained to board ships, use cannons, and navigate open ocean — had no legitimate employment. The transition from privateer to pirate was seamless: same skills, same ships, same targets, just without the government paperwork.',
  },
  {
    label: 'Economic Inequality at Sea',
    detail:
      'Merchant sailors lived in conditions that would shock modern readers. They were paid poverty wages (often months late), fed rotten food, beaten by officers, and could be press-ganged into naval service at any time. Scurvy, disease, and brutal discipline killed thousands every year. Piracy offered better pay (shares of plunder), democratic governance, and a chance at wealth. As one pirate said when asked why he turned: "In an honest service there is thin commons, low wages, and hard labor. In this, plenty and satiety, pleasure and ease, liberty and power."',
  },
  {
    label: 'Caribbean Geography',
    detail:
      'The Caribbean was a pirate\'s paradise geographically: hundreds of islands with hidden coves, shallow waters where large warships couldn\'t follow, dense mangrove coastlines for concealment, and reliable trade winds for fast getaways. The region\'s islands belonged to multiple competing colonial powers — English, French, Spanish, Dutch — creating jurisdictional chaos. A pirate chased by the English navy could shelter in a French port, and vice versa. The geography made policing nearly impossible.',
  },
];

// ── Who Were the Pirates ────────────────────────────────────────────────────

const DEMOGRAPHY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Former Sailors and Privateers',
    detail:
      'The vast majority of pirates were former merchant sailors, ex-privateers, or ex-naval men — working-class men with maritime skills and firsthand experience of the brutal conditions aboard legitimate ships. Many had served in the War of the Spanish Succession (1701–1714), which flooded the Atlantic with skilled, unemployed sailors when it ended. Some joined voluntarily; others were "forced men" — captured sailors who claimed they were coerced, though the line between willing and unwilling was often conveniently blurred.',
  },
  {
    label: 'Black Crew Members: 25–40%',
    detail:
      'One of the most remarkable facts about pirate ships: an estimated 25–40% of crew members on some pirate vessels were of African descent — escaped slaves, freed men, and men captured from slave ships. Under the pirate flag, Black crew members could find a degree of equality unimaginable in colonial society. They fought alongside white sailors, received equal shares of plunder, and in some cases held positions of authority. This wasn\'t utopian — racism existed on pirate ships too — but it was dramatically more egalitarian than the plantation colonies surrounding them.',
  },
  {
    label: 'Mixed Nationalities',
    detail:
      'Pirate crews were remarkably international: English, French, Dutch, Spanish, Portuguese, American colonials, Africans, and occasionally Indigenous peoples sailed together. National identity mattered less than maritime skill and willingness to fight. This cosmopolitan character was another way pirates rejected the rigid hierarchies of their era — on a pirate ship, a French sailor served alongside an English one, despite their nations being at war.',
  },
  {
    label: 'Young Men from Hard Backgrounds',
    detail:
      'The average pirate was about 27 years old, from a working-class maritime background, with years of brutal experience at sea. Many were runaway indentured servants — essentially debt slaves bound to colonial masters for 4–7 years. Life expectancy for an active pirate was roughly 2–3 years. Most knew they would likely hang or die in battle. They chose piracy anyway, which tells you everything about how bad the alternatives were.',
  },
  {
    label: 'Women Pirates: Bonny and Read',
    detail:
      'Anne Bonny and Mary Read are the most famous women pirates of the Golden Age. Both sailed with Captain "Calico Jack" Rackham, disguised as men. Bonny was an Irish immigrant to the Carolinas who left her husband for Rackham; Read had lived as a man since childhood, serving in the military before turning pirate. When Rackham\'s crew was captured in 1720, Bonny and Read were among the last fighting — most of the male crew was drunk below decks. Both were sentenced to death but "pleaded the belly" (claimed pregnancy) to delay execution. Read died in prison; Bonny\'s fate is unknown.',
  },
];

// ── Pirate Democracy ────────────────────────────────────────────────────────

const DEMOCRACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Elected Captains',
    detail:
      'Unlike naval or merchant ships, where captains were appointed by owners or the crown, pirate captains were elected by the crew and could be voted out at any time. The captain had absolute authority only in battle — at all other times, major decisions required crew consent. Captains who were too brutal, too cautious, or too unlucky were deposed. This was more democracy than most of these men had ever experienced in England, where only wealthy property owners could vote.',
  },
  {
    label: 'The Quartermaster: Check on Power',
    detail:
      'The quartermaster — also elected — served as the crew\'s representative and a check on the captain\'s power. He distributed plunder, settled disputes, and administered discipline. In many ways, the quartermaster had more day-to-day authority than the captain. This separation of powers — one leader for battle, another for governance — was a remarkably sophisticated political arrangement for men who were supposedly lawless brutes.',
  },
  {
    label: 'Articles of Agreement',
    detail:
      'Before sailing, pirate crews signed written articles — essentially a constitution — that spelled out the rules. These articles divided plunder shares (captain got 1.5–2x a regular share, not 10x or 100x like merchant captains), established rules of conduct, specified punishments for theft from crewmates or cowardice in battle, and guaranteed compensation for injuries. Every man signed or made his mark. These were binding contracts, voluntarily entered, decades before democratic constitutions became common.',
  },
  {
    label: 'Worker\'s Compensation — Pirate Style',
    detail:
      'Pirate articles typically included specific compensation for injuries sustained in battle: 600 pieces of eight for a lost right arm, 500 for a left arm, 100 for a lost eye. This was the original worker\'s compensation — centuries before any government mandated similar protections for laborers. The amounts varied by crew, but the principle was consistent: if you were hurt fighting for the common good, the community owed you.',
  },
  {
    label: 'Voting on Major Decisions',
    detail:
      'Pirate crews voted on where to sail, whether to attack a specific ship, when to careen the hull, and how to divide unusual plunder. Each man had one vote regardless of rank. Decisions were made by majority rule. Compare this to the Royal Navy, where captains had godlike authority and could order floggings at will, or to merchant ships where sailors had no voice whatsoever. The pirate ship was, paradoxically, one of the most democratic institutions in the Atlantic world.',
  },
];

// ── Famous Pirates ──────────────────────────────────────────────────────────

const FAMOUS_PIRATES: FigureEntry[] = [
  {
    name: 'Blackbeard (Edward Teach)',
    years: 'c. 1680–1718',
    contribution:
      'The most feared pirate of the Golden Age. Teach cultivated terror as a weapon: he wove slow-burning hemp fuses into his enormous black beard and lit them in battle, wreathing his face in smoke and giving him a demonic appearance. His flagship, Queen Anne\'s Revenge — a captured French slave ship he armed with 40 cannons — was one of the most powerful pirate vessels ever. Despite his fearsome reputation, Blackbeard was never proven to have murdered a single captive. His image did the work: ships surrendered without a fight. He operated primarily off the Carolina coast and was killed in a savage hand-to-hand battle with Lieutenant Robert Maynard of the Royal Navy on November 22, 1718. He reportedly suffered five gunshot wounds and twenty sword cuts before falling.',
  },
  {
    name: 'Bartholomew "Black Bart" Roberts',
    years: '1682–1722',
    contribution:
      'The most successful pirate in recorded history, capturing over 400 ships in a three-year career — more than any other pirate before or since. Roberts was an unlikely pirate: he was forced into piracy when his ship was captured, but rose to captain within weeks. He was known for his strict personal discipline (he didn\'t drink alcohol, unusual among pirates), his stylish dress (crimson damask waistcoat, diamond cross necklace), and his formalized pirate code — a detailed set of articles that became the model for other crews. He was killed by grapeshot during a battle with HMS Swallow off the coast of West Africa on February 10, 1722. His death is often cited as the effective end of the Golden Age.',
  },
  {
    name: 'Calico Jack Rackham',
    years: 'c. 1682–1720',
    contribution:
      'Remembered less for his piratical achievements (which were modest) than for his crew: Anne Bonny and Mary Read, the famous women pirates, both sailed under his command. Rackham got his nickname from his flamboyant calico clothing. He is also credited with designing the classic "skull and crossbones" Jolly Roger flag. Captured in October 1720 when his crew was surprised by a pirate hunter sloop; most of his men were too drunk to fight. Hanged in Port Royal, Jamaica, November 1720.',
  },
  {
    name: 'Henry Every (Avery)',
    years: '1659–c. 1696',
    contribution:
      'The "King of Pirates" — Every pulled off the single richest pirate raid in history when he captured the Mughal ship Ganj-i-Sawai in 1695, seizing treasure worth an estimated £600,000 (hundreds of millions in modern currency). The raid caused an international incident: the outraged Mughal Emperor threatened to cut off trade with the English East India Company. Every became the most wanted man in the world — and then vanished. He is one of the few Golden Age pirates believed to have retired with his loot. His legend inspired a generation of pirates and was the subject of the first pirate play, "The Successful Pyrate" (1713).',
  },
  {
    name: 'Captain William Kidd',
    years: '1645–1701',
    contribution:
      'The ultimate borderline case between privateer and pirate. Kidd was a wealthy New York ship owner commissioned by the English government to hunt pirates in the Indian Ocean. When he failed to find pirates, he turned to attacking merchant ships himself — most notoriously the Armenian-owned Quedagh Merchant. Arrested, shipped to London, and hanged in 1701, Kidd became a cautionary tale about the thin line between sanctioned and criminal violence. His alleged buried treasure has been searched for ever since — inspiring the pirate treasure myth that persists to this day.',
  },
  {
    name: 'Anne Bonny',
    years: 'c. 1697–unknown',
    contribution:
      'Irish-born, raised in the Carolinas. Left her husband to sail with Calico Jack Rackham. Known for her fierce temperament and combat skill. When Rackham\'s crew was captured in 1720, she reportedly told him: "Had you fought like a man, you need not have been hanged like a dog." Pleaded pregnancy to avoid hanging. Her ultimate fate remains one of piracy\'s enduring mysteries — she may have been ransomed by her father, released, or died in prison.',
  },
];

// ── Pirate Havens ───────────────────────────────────────────────────────────

const HAVENS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Nassau, Bahamas — The Pirate Republic (1713–1718)',
    detail:
      'At its peak, Nassau sheltered over 2,000 pirates and became what historians call a "Pirate Republic" — an informal self-governing community of pirates who had effectively seized the island from its absent British colonial government. Nassau offered everything pirates needed: a harbor too shallow for large warships, a defensible position, and proximity to busy shipping lanes. The Republic ended when Woodes Rogers arrived as the new governor in 1718, armed with royal pardons for those who surrendered and the gallows for those who didn\'t. He cleaned out the pirates within a year.',
  },
  {
    label: 'Tortuga, Haiti',
    detail:
      'The legendary buccaneer base off the northwest coast of Hispaniola. Tortuga was the original pirate haven, established in the 1630s by French buccaneers — hunters who had turned to piracy. Its rocky terrain and single narrow harbor made it nearly impregnable. For decades, Tortuga served as a base for raids on Spanish shipping and settlements. The buccaneers of Tortuga were the forerunners of the Golden Age pirates — men like Henry Morgan launched massive raids from here before the center of piracy shifted to Nassau and the Bahamas.',
  },
  {
    label: 'Libertalia, Madagascar — The Pirate Utopia',
    detail:
      'According to Captain Charles Johnson\'s 1724 book "A General History of the Pyrates," Libertalia was a utopian pirate colony on Madagascar where pirates created an egalitarian republic: no slavery, communal property, a democratic government. Scholars are divided on whether Libertalia actually existed or was a political fiction — an idealized portrait of what pirate democracy could be. Either way, the story reveals something important: the idea of pirate communities as alternative societies was powerful enough that contemporary writers used it to critique European class hierarchies.',
  },
  {
    label: 'Port Royal, Jamaica — "The Wickedest City on Earth"',
    detail:
      'In the mid-17th century, Port Royal was the richest and most debauched city in the Caribbean — a wide-open pirate port where buccaneers spent their plunder in taverns, brothels, and gambling houses. The English governors tolerated (and profited from) the pirates because they served as a cheap defense against Spanish attack. Port Royal\'s reign ended dramatically on June 7, 1692, when a massive earthquake and tsunami destroyed two-thirds of the city, killing 2,000 people instantly. Many considered it divine judgment. The sunken city remains an underwater archaeological site.',
  },
  {
    label: 'The Indian Ocean',
    detail:
      'While the Caribbean gets the most attention, the Indian Ocean was equally important to pirate history. Red Sea pirates — called the "Red Sea Men" — raided the fabulously wealthy Mughal ships traveling between India and the Middle East. Madagascar served as the main base of operations, its remoteness putting pirates beyond the reach of European navies. Henry Every\'s capture of the Ganj-i-Sawai and Captain Kidd\'s Indian Ocean adventures both took place in these waters. The Indian Ocean pirate round was one of the most profitable — and dangerous — runs in pirate history.',
  },
];

// ── Political Problem ───────────────────────────────────────────────────────

const POLITICAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'Disrupting Millions in Trade',
    detail:
      'At the height of the Golden Age, pirates disrupted Atlantic trade routes worth millions of pounds per year. Insurance rates for Caribbean shipping soared. Some colonial merchants refused to send ships without armed escorts. The economic damage was enormous — not just from stolen cargo but from the systemic effect of making ocean commerce unpredictable and expensive. For mercantile empires whose wealth depended on reliable shipping, piracy was an existential threat.',
  },
  {
    label: 'Challenging the State\'s Monopoly on Violence',
    detail:
      'Pirates weren\'t just thieves — they were a political challenge. By operating their own armed ships, making their own laws, and governing their own communities, they challenged the fundamental claim of European states to a monopoly on legitimate violence. A pirate ship was a floating counter-state, recognizing no king, no parliament, no law but its own articles. This is why pirate trials were so theatrical: the state needed to publicly demonstrate that it, not the pirates, held ultimate authority.',
  },
  {
    label: 'Inspiring the Poor',
    detail:
      'Perhaps the most dangerous thing about pirates was the idea they represented: that ordinary men could reject the social order, govern themselves, and get rich doing it. In an era when most working people were trapped in rigid class hierarchies, the pirate story — common sailors overthrowing their officers, sharing wealth equally, electing their leaders — was genuinely revolutionary. Authorities feared pirate sympathizers in port cities, and with good reason: many common people cheered for the pirates.',
  },
  {
    label: 'Rediker\'s Thesis: Pirates as Proto-Revolutionaries',
    detail:
      'Historian Marcus Rediker has argued that piracy in the Golden Age was a form of class war — a "hydrarchy" (rule of the sea) that represented a working-class rebellion against the emerging capitalist order. Pirates, in this view, weren\'t just criminals but social bandits who created an alternative economic and political system. Not all historians accept this interpretation — some see pirates as opportunistic criminals, not ideological rebels — but the debate reveals how seriously modern scholarship takes pirate social organization.',
  },
];

// ── End of the Golden Age ───────────────────────────────────────────────────

const END_TIMELINE: TimelineEntry[] = [
  {
    year: '1700',
    title: 'The Piracy Act',
    description:
      'The English Parliament passed the Act for the More Effectual Suppression of Piracy, which allowed piracy trials to be held in colonial vice-admiralty courts instead of requiring transport to London. Previously, pirates had to be shipped across the Atlantic for trial — expensive, logistically difficult, and often resulting in acquittals from sympathetic London juries. Now they could be tried and hanged where they were caught. The Act removed the legal bottleneck that had made piracy prosecution nearly impossible.',
    color: INDIGO,
  },
  {
    year: '1717',
    title: 'The Royal Proclamation — Pardons Offered',
    description:
      'King George I issued a proclamation offering a full pardon to any pirate who surrendered before September 5, 1718. This was a strategic masterstroke: it split the pirate community between those who wanted to retire (many accepted) and hardliners who refused. Hundreds of pirates took the pardon, including some prominent captains. The pardons simultaneously reduced pirate numbers and produced informants who helped the navy track down the holdouts.',
    color: GOLD,
  },
  {
    year: '1718',
    title: 'Woodes Rogers Takes Nassau',
    description:
      'Captain Woodes Rogers — a former privateer himself — arrived in Nassau as the new royal governor with a small fleet and the King\'s pardons. He found the "Pirate Republic" in full swing: over 2,000 pirates using Nassau as their base. Rogers offered pardons to those who surrendered and war to those who didn\'t. Most accepted. The holdouts — including Charles Vane, who dramatically sailed out of the harbor guns blazing — were hunted down. Rogers hanged eight pirates on the Nassau waterfront in December 1718, ending the Republic.',
    color: NAVY,
  },
  {
    year: 'November 22, 1718',
    title: 'Blackbeard Killed',
    description:
      'Lieutenant Robert Maynard of the Royal Navy cornered Blackbeard at Ocracoke Inlet, North Carolina, in a carefully planned ambush. The battle was savage: Maynard\'s men hid below decks to lure the pirates into boarding, then sprang a trap. Blackbeard fought like a demon — absorbing five gunshot wounds and twenty sword cuts before he finally fell. Maynard had his head cut off and hung from the bowsprit. The death of the Golden Age\'s most famous pirate sent a clear message: no one was untouchable.',
    color: CRIMSON,
  },
  {
    year: '1722',
    title: 'Black Bart Roberts Killed',
    description:
      'The death of Bartholomew "Black Bart" Roberts on February 10, 1722, is often cited as the effective end of the Golden Age. Roberts — the most successful pirate in history — was killed by grapeshot during a battle with HMS Swallow off Cape Lopez, West Africa. His crew, demoralized by his death, surrendered. The subsequent trial at Cape Coast Castle was the largest pirate trial in history: 264 men tried, 52 hanged, 37 sentenced to penal servitude in African mines. The Royal Navy had destroyed the last great pirate fleet.',
    color: DARK_RED,
  },
  {
    year: '1716–1726',
    title: 'The Systematic Hangings',
    description:
      'Over a decade, the British Empire executed over 400 pirates across the Atlantic world — in Nassau, Port Royal, London, Charleston, and Cape Coast Castle. The bodies were often displayed in iron cages (gibbets) at harbor entrances as a warning to sailors considering piracy. The message was unmistakable: the age of tolerance was over. Combined with expanded naval patrols, colonial courts with jurisdiction to try pirates, and economic recovery that provided alternative employment for sailors, the hangings ended the Golden Age as definitively as any battle.',
    color: STEEL,
  },
];

// ── Myth vs Reality ─────────────────────────────────────────────────────────

const MYTH_INSIGHTS: InsightEntry[] = [
  {
    label: 'Walking the Plank: Almost Certainly Fiction',
    detail:
      'Despite being the most iconic pirate punishment in popular culture, there are virtually no verified historical accounts of pirates forcing captives to walk the plank. Pirates did kill captives — by shooting, stabbing, or throwing them overboard — but the theatrical plank-walking ceremony appears to be an invention of 19th-century fiction. The earliest known reference is from 1837. Real pirates had no reason for elaborate execution rituals; they were practical men who dealt with prisoners quickly.',
  },
  {
    label: 'Buried Treasure: Extremely Rare',
    detail:
      'Pirates almost never buried their treasure. Why would they? The entire point of piracy was to spend the money — and pirates were legendary for blowing through their loot in port on alcohol, gambling, and prostitution. The buried treasure myth comes primarily from Captain Kidd, who actually did bury some treasure on Gardiners Island (it was quickly recovered), and from Robert Louis Stevenson\'s "Treasure Island" (1883). In reality, most pirate plunder was perishable goods — food, textiles, ship supplies — not chests of gold coins.',
  },
  {
    label: 'The Jolly Roger: More Complex Than You Think',
    detail:
      'The classic skull-and-crossbones flag was real, but the story is more complicated. The name "Jolly Roger" may derive from "jolie rouge" (pretty red) — a reference to the red flag flown by ships intending to give no quarter (no mercy). The black flag actually meant the opposite: surrender and you\'ll be treated fairly. Different pirates flew different designs — Blackbeard\'s flag showed a skeleton stabbing a heart; Black Bart\'s showed him standing on two skulls. The flags were psychological weapons: designed to terrify merchant crews into surrendering without a fight.',
  },
  {
    label: 'Parrots, Peg Legs, and Eye Patches',
    detail:
      'Most pirate stereotypes come from one source: Robert Louis Stevenson\'s "Treasure Island" (1883) and its character Long John Silver — a one-legged pirate with a parrot on his shoulder. Before Stevenson, pirates weren\'t imagined this way. That said, the stereotypes aren\'t entirely baseless: sailors did keep exotic birds as pets and trade goods, and the horrific injuries of maritime combat (amputations, eye injuries) were treated with the crude prosthetics of the era. But the specific image of the pirate — hook hand, wooden leg, eye patch, parrot — is a Victorian literary invention, later cemented by Disney.',
  },
  {
    label: 'The Romantic Pirate: A Modern Creation',
    detail:
      'The charming, swashbuckling pirate of movies bears almost no resemblance to reality. Real pirates lived short, violent, desperate lives. They suffered from malnutrition, tropical diseases, venereal infections, and alcoholism. Many were killed in their twenties. The romantic pirate was created in stages: 18th-century plays like "The Successful Pyrate," 19th-century novels like "Treasure Island" and "Peter Pan," and 20th-century Hollywood films. Each generation reinvented pirates as more glamorous and less violent. The actual Golden Age was brutal, dirty, and usually fatal.',
  },
];

// ── Legacy ──────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'International Maritime Law',
    detail:
      'The piracy crisis of the Golden Age was a primary driver in the development of international maritime law. The legal problems posed by pirates — who had no national allegiance, operated in international waters, and preyed on ships of all nations — forced European states to develop new frameworks for jurisdiction, cooperation, and enforcement at sea. The law of the sea that governs modern shipping has its roots in the piracy problem of 300 years ago.',
  },
  {
    label: '"Enemy of All Mankind" — Hostis Humani Generis',
    detail:
      'To prosecute pirates who operated outside any nation\'s jurisdiction, lawyers developed the concept of hostis humani generis — "enemy of all mankind." Pirates, by attacking ships of any nation, were considered enemies of all humanity and could be tried by any nation that captured them. This legal concept didn\'t die with piracy: it was later applied to slave traders, war criminals, and perpetrators of genocide. The idea that some crimes are so universal that any state can prosecute them — universal jurisdiction — began with pirate trials.',
  },
  {
    label: 'Lloyd\'s of London and Maritime Insurance',
    detail:
      'The piracy threat was one of several factors that drove the growth of maritime insurance, most famously through Lloyd\'s of London. Edward Lloyd\'s coffee house, where ship owners, merchants, and insurers gathered to share shipping intelligence and underwrite voyages, grew partly because of the need to price and manage piracy risk. The insurance industry\'s techniques for assessing maritime risk — which still underpin global shipping today — were refined during the Golden Age.',
  },
  {
    label: 'Pirate Democracy and Political Thought',
    detail:
      'Some scholars argue that pirate democratic practices — elected leaders, written constitutions, separation of powers, equal voting — influenced Enlightenment political thought, though this claim is debated. What is certain is that pirate ships operated as functioning democracies decades before the American or French Revolutions, and that contemporary writers used pirate societies as examples of alternative governance. Whether influence was direct or merely parallel, the pirates demonstrated that democratic self-governance could work in practice.',
  },
  {
    label: 'Modern Piracy: History Repeating',
    detail:
      'Somali piracy (2005–2012) mirrored the conditions of the Golden Age with eerie precision: a failed state (Somalia after 1991) created lawless waters near busy shipping lanes (the Gulf of Aden, through which 12% of world trade passes). Desperate young men with maritime skills turned to piracy because legitimate opportunities didn\'t exist. International navies struggled to police vast ocean areas. The parallels remind us that piracy isn\'t a quirk of history — it\'s what happens when wealth flows through waters that ungoverned, desperate people can reach.',
  },
];

// ── Key Stats ───────────────────────────────────────────────────────────────

const KEY_STATS: InsightEntry[] = [
  {
    label: '~80 Years',
    detail: 'Duration of the Golden Age of Piracy (c. 1650–1730).',
  },
  {
    label: '400+ Ships Captured',
    detail: 'Bartholomew "Black Bart" Roberts — the most successful pirate in recorded history.',
  },
  {
    label: '25–40% Black Crew Members',
    detail: 'Some pirate crews had greater racial diversity and equality than any contemporary institution.',
  },
  {
    label: 'Zero Proven Murders',
    detail: 'Blackbeard was never proven to have murdered a single captive — his reputation did the work.',
  },
  {
    label: '400+ Pirates Executed',
    detail: 'Hanged across the Atlantic world between 1716 and 1726 in the systematic crackdown.',
  },
  {
    label: '2,000+ Pirates in Nassau',
    detail: 'The "Pirate Republic" at its peak (1713–1718) before Governor Woodes Rogers ended it.',
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
          key={e.year}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
          }}
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

const FIGURE_COLORS = [OCEAN, GOLD, CRIMSON, TEAL, INDIGO, ROSE, AMBER, GREEN, PURPLE, SKY];

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

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function GoldenAgeOfPiracyPage() {
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

        {/* Hero */}
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
              background: `linear-gradient(135deg, ${OCEAN}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            No Quarter Given — The Golden Age of Piracy (1650–1730)
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p style={{ color: ASH, lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 800, marginBottom: 16 }}>
              For roughly 80 years, thousands of pirates terrorized the Atlantic and Indian Oceans — capturing hundreds of ships, building their own republics, and threatening the trade routes that European empires depended on. They were criminals, outcasts, and fugitives. They also ran some of the most democratic institutions in the Western world.
            </p>
            <p style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 800 }}>
              The Golden Age of Piracy wasn't an accident. It was the predictable result of booming trade, weak navies, desperate men, and a geography that made the ocean ungovernable. The pirates who emerged from these conditions created something remarkable: floating democracies with elected leaders, written constitutions, and worker's compensation — decades before the American Revolution. This is the reality behind the legends.
            </p>
          </motion.div>
        </header>

        {/* Pirate Democracy hook callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            backgroundColor: 'rgba(14, 165, 233, 0.08)',
            border: `1px solid ${SKY}44`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <h3 style={{ color: SKY, fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
            ⚓ The Surprise: Pirate Democracy
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>
            Pirate ships were more democratic than most European nations. Crews elected their captains, signed written articles dividing plunder equally, voted on major decisions, and guaranteed compensation for injuries in battle. Every man had one vote regardless of rank. The pirate ship was, paradoxically, one of the most egalitarian institutions in the 18th-century Atlantic world.
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
            {KEY_STATS.map((stat, i) => (
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

        {/* Section 1: Why It Happened */}
        <SectionWrapper
          id="conditions"
          icon="🌊"
          title="Why the Golden Age Happened"
          accentColor={TEAL}
          intro="Piracy didn't emerge from nowhere. It was the product of specific historical conditions: massive wealth moving across poorly policed oceans, a surplus of trained fighters with no legitimate work, and economic desperation that made the gallows seem like a reasonable trade-off for a few years of freedom."
        >
          <InsightGrid items={CONDITIONS_INSIGHTS} />
        </SectionWrapper>

        {/* Section 2: Who Were the Pirates */}
        <SectionWrapper
          id="demography"
          icon="🏴‍☠️"
          title="Who Were the Pirates?"
          accentColor={AMBER}
          intro="Pirates weren't noble rebels or cartoon villains. They were overwhelmingly working-class men from brutal maritime backgrounds — former sailors, ex-privateers, runaway servants, escaped slaves — who chose the risks of piracy over the certainty of exploitation in legitimate service."
        >
          <InsightGrid items={DEMOGRAPHY_INSIGHTS} />
        </SectionWrapper>

        {/* Section 3: Pirate Democracy */}
        <SectionWrapper
          id="democracy"
          icon="⚖️"
          title="Pirate Democracy — The Real Black Flag"
          accentColor={SKY}
          intro="The most surprising thing about Golden Age pirates isn't the violence — it's the governance. Pirate ships operated as functioning democracies with elected leaders, written constitutions, separation of powers, and social insurance. For men who had known only autocracy, the pirate ship was a radical experiment in self-governance."
        >
          <InsightGrid items={DEMOCRACY_INSIGHTS} />
        </SectionWrapper>

        {/* Section 4: Famous Pirates */}
        <SectionWrapper
          id="famous-pirates"
          icon="💀"
          title="The Famous Pirates"
          accentColor={GOLD}
          intro="A handful of pirates became legends — some through terrifying reputations, others through sheer audacity. Their stories, dramatized and distorted over three centuries, created the pirate mythology that still shapes popular culture."
        >
          <FigureGrid figures={FAMOUS_PIRATES} />
        </SectionWrapper>

        {/* Section 5: Pirate Havens */}
        <SectionWrapper
          id="havens"
          icon="🏝️"
          title="Pirate Havens"
          accentColor={GREEN}
          intro="Pirates needed safe harbors — places to repair ships, sell stolen goods, recruit crew, and spend their loot without being arrested. The most famous pirate havens were Caribbean islands and remote coastlines where colonial authority was weak or nonexistent."
        >
          <InsightGrid items={HAVENS_INSIGHTS} />
        </SectionWrapper>

        {/* Section 6: Political Problem */}
        <SectionWrapper
          id="political-problem"
          icon="⚔️"
          title="Why Pirates Were Such a Political Problem"
          accentColor={ROSE}
          intro="Pirates weren't just an economic nuisance — they were a political threat. By creating their own communities, making their own laws, and redistributing wealth, they challenged the legitimacy of the state itself. The pirate problem was, at its core, a question of authority."
        >
          <InsightGrid items={POLITICAL_INSIGHTS} />
        </SectionWrapper>

        {/* Section 7: End of the Golden Age */}
        <SectionWrapper
          id="end"
          icon="⛓️"
          title="The End of the Golden Age"
          accentColor={INDIGO}
          intro="The Golden Age didn't fade — it was crushed. When Britain decided that protecting Atlantic trade was worth the cost, the Empire deployed its full resources: expanded courts, royal pardons to split the pirates, aggressive naval patrols, and systematic public executions. Within a decade, the age of piracy was over."
        >
          <TimelineCard entries={END_TIMELINE} />
        </SectionWrapper>

        {/* Section 8: Myth vs Reality */}
        <SectionWrapper
          id="myth-vs-reality"
          icon="🎭"
          title="Myth vs. Reality"
          accentColor={PURPLE}
          intro="Almost everything you think you know about pirates comes from fiction — primarily Robert Louis Stevenson's 'Treasure Island' (1883) and the Disney movies it inspired. The real Golden Age was far less romantic and far more interesting."
        >
          <InsightGrid items={MYTH_INSIGHTS} />
        </SectionWrapper>

        {/* Section 9: Legacy */}
        <SectionWrapper
          id="legacy"
          icon="🌍"
          title="Why It Matters"
          accentColor={TEAL}
          intro="The Golden Age of Piracy lasted barely 80 years, but its consequences echo through international law, insurance, political theory, and — whenever a state fails near a busy shipping lane — modern maritime security."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* Connection links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          style={{
            padding: '32px 0',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
            Connected Deep Dives
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { to: '/age-of-exploration', label: 'Age of Exploration' },
              { to: '/spanish-empire', label: 'Spanish Empire' },
              { to: '/british-empire', label: 'British Empire' },
              { to: '/slavery', label: 'Slavery & the Atlantic World' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: SKY,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: `1px solid ${SKY}33`,
                  backgroundColor: `${SKY}0a`,
                  transition: 'background-color 0.2s',
                }}
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px 0 48px', marginTop: 24, textAlign: 'center' }}>
          <p style={{ color: SLATE, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 20px', fontStyle: 'italic' }}>
            "In an honest service there is thin commons, low wages, and hard labor. In this, plenty and satiety, pleasure and ease, liberty and power."
            — A pirate, when asked why he chose the black flag
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
