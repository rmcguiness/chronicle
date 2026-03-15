/**
 * BritishEmpirePage — comprehensive deep-dive on the British Empire
 * (1497–1997).
 *
 * Route: /british-empire
 *
 * Sections:
 *  1. Hero — "The Empire on Which the Sun Never Sets"
 *  2. Origins (1497–1600)
 *  3. The First British Empire (1600–1783)
 *  4. The Second British Empire (1783–1900) — The Victorian Peak
 *  5. The Ideology — "The White Man's Burden"
 *  6. India Under the Raj (1858–1947)
 *  7. Africa Under British Rule
 *  8. The World Wars and Decline
 *  9. Decolonization (1947–1980)
 * 10. The Commonwealth Today
 * 11. Legacy — The Contested Accounting
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
const IMPERIAL_RED = '#b91c1c';
const NAVY_BLUE = '#1e3a5f';
const COLONIAL_GOLD = '#d4a017';
const RAJ_SAFFRON = '#e07020';
const EMPIRE_CRIMSON = '#991b1b';
const CROWN_PURPLE = '#7e22ce';
const TRADE_TEAL = '#0d9488';

const FIGURE_COLORS = [IMPERIAL_RED, NAVY_BLUE, COLONIAL_GOLD, RAJ_SAFFRON, TEAL, INDIGO, ROSE, PURPLE];

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

// ── Section 1: Origins ───────────────────────────────────────────────────────

const ORIGINS: TimelineEntry[] = [
  {
    year: '1497',
    title: "John Cabot's Voyage to North America",
    description:
      'Giovanni Caboto, a Venetian navigator sailing under the English flag, reached Newfoundland — the first English-sponsored voyage to the Americas. Henry VII had watched Spain and Portugal carve up the New World and wanted England\'s share. Cabot\'s voyage established England\'s claim to North America, though it would be over a century before permanent settlement followed.',
    color: NAVY_BLUE,
  },
  {
    year: '1558–1603',
    title: "Elizabeth I and the Privateers",
    description:
      'Elizabeth I couldn\'t match Spain\'s navy directly, so she licensed privateers — legal pirates — to raid Spanish treasure ships. Sir Francis Drake circumnavigated the globe (1577–80) while plundering Spanish ports. Sir Walter Raleigh attempted colonies in Virginia. These "sea dogs" generated enormous wealth for the Crown while weakening Spain. England was learning that overseas expansion paid.',
    color: COLONIAL_GOLD,
  },
  {
    year: '1600',
    title: 'East India Company Founded',
    description:
      'On December 31, 1600, Elizabeth I granted a royal charter to "The Governor and Company of Merchants of London Trading into the East Indies." It was a private corporation with shareholders, a board of directors — and eventually its own army of 260,000 soldiers. This single company would conquer the Indian subcontinent, making it the most powerful corporation in human history. The model of empire-by-corporation was born.',
    color: IMPERIAL_RED,
  },
  {
    year: '1550s–1600s',
    title: 'The Plantation System in Ireland',
    description:
      'Before conquering the world, England practiced on Ireland. The "Plantations" — confiscating Irish Catholic land and settling it with English and Scottish Protestants — established the template for colonialism: dispossess the native population, impose English law and language, suppress local culture and religion. The brutality of Cromwell\'s Irish campaign (1649–53) killed an estimated 40% of the Irish population. Ireland was the laboratory for empire.',
    color: CRIMSON,
  },
];

// ── Section 2: First British Empire ──────────────────────────────────────────

const FIRST_EMPIRE: InsightEntry[] = [
  {
    label: 'American Colonies: Jamestown to the Thirteen',
    detail:
      'Jamestown (1607) was England\'s first permanent American settlement — and nearly failed. The Pilgrims landed at Plymouth (1620), and by 1733 thirteen colonies stretched from Massachusetts to Georgia. These colonies were remarkably diverse: Puritan New England, slave-holding Virginia, Quaker Pennsylvania, Catholic Maryland. But all shared a growing sense of self-governance that would eventually destroy the First British Empire.',
  },
  {
    label: 'Caribbean Sugar Islands: The Real Prize',
    detail:
      'Barbados and Jamaica were far more valuable to Britain than all thirteen American colonies combined. Sugar was the oil of the 18th century — and it ran on enslaved labor. At its peak, tiny Barbados generated more trade revenue than all of New England. The Caribbean plantation system was extraordinarily brutal: the average enslaved person on a sugar plantation survived just 7 years. Britain fought wars primarily to protect these islands, not the American colonies.',
  },
  {
    label: 'The Atlantic Slave Trade Triangle',
    detail:
      'British ships carried manufactured goods to West Africa, traded them for enslaved people, transported those people across the Atlantic in horrific conditions (the Middle Passage killed 15% en route), sold them in the Americas, then returned to Britain with sugar, tobacco, and cotton. British ships transported 3.1 million enslaved Africans to the Americas — more than any other European nation except Portugal. The profits from this trade financed the Industrial Revolution.',
  },
  {
    label: 'East India Company: From Trading Posts to Territorial Control',
    detail:
      'The EIC began with small trading posts ("factories") at Surat, Madras, Bombay, and Calcutta. But as the Mughal Empire declined, the Company filled the power vacuum. After Robert Clive\'s victory at Plassey (1757) — won partly through bribery — the Company became the effective ruler of Bengal, collecting taxes from 30 million people. A private company was governing a subcontinent.',
  },
  {
    label: "Seven Years' War (1756–1763): 'The First World War'",
    detail:
      'Britain fought France across five continents simultaneously — in North America (the French and Indian War), the Caribbean, West Africa, India, and the Philippines. Britain\'s decisive victory gave it Canada, Florida, French territories east of the Mississippi, and dominance in India. It was the moment Britain became the world\'s preeminent colonial power. But the war\'s enormous cost led Britain to tax the American colonies — triggering the revolution that ended the First Empire.',
  },
  {
    label: 'American Revolution (1776): The Empire Cracks',
    detail:
      'Britain\'s attempt to recoup war debts through colonial taxation ("no taxation without representation") provoked revolt. The loss of the thirteen colonies in 1783 was humiliating — but paradoxically, it made the Empire more aggressive, not less. Having lost the settler colonies of North America, Britain pivoted to conquest in Asia and Africa, where it could extract resources without the complications of self-governing colonists.',
  },
];

// ── Section 3: Second British Empire ─────────────────────────────────────────

const SECOND_EMPIRE: TimelineEntry[] = [
  {
    year: '1788',
    title: 'Australia: Penal Colony to Dominion',
    description:
      'Having lost America as a dumping ground for convicts, Britain turned to Australia. The First Fleet landed at Botany Bay in 1788, beginning both a penal colony and the dispossession of Aboriginal Australians who had lived on the continent for 65,000 years. Gold rushes in the 1850s brought free settlers; by 1901 Australia became a self-governing dominion — built on the near-destruction of its indigenous peoples.',
    color: COLONIAL_GOLD,
  },
  {
    year: '1857',
    title: "Indian Rebellion ('Sepoy Mutiny')",
    description:
      'Indian soldiers (sepoys) in the East India Company\'s army revolted over rifle cartridges greased with cow and pig fat — offensive to both Hindu and Muslim troops. But the rebellion reflected far deeper grievances: land confiscation, cultural arrogance, and economic exploitation. The Company\'s brutal suppression included strapping rebels to cannons and blowing them apart. The rebellion ended the East India Company\'s rule; the British Crown took direct control of India.',
    color: RAJ_SAFFRON,
  },
  {
    year: '1867',
    title: 'Dominion of Canada',
    description:
      'Canada became the first self-governing dominion — a constitutional model that allowed white settler colonies effective independence while maintaining nominal loyalty to the Crown. This template would be extended to Australia, New Zealand, and South Africa. Notably, this self-governance was reserved for white settler populations; non-white colonies were governed directly from London.',
    color: IMPERIAL_RED,
  },
  {
    year: '1880s',
    title: "The Scramble for Africa",
    description:
      'At the Berlin Conference (1884–85), European powers literally drew lines on a map of Africa, dividing the continent among themselves with no African input. Within 20 years, 90% of Africa was under European control. Britain claimed the largest share: Egypt, Sudan, Kenya, Uganda, Nigeria, Gold Coast (Ghana), Sierra Leone, Rhodesia (Zimbabwe/Zambia), South Africa, and more. The phrase "the sun never sets on the British Empire" became literally true.',
    color: INDIGO,
  },
  {
    year: '1880s–1900',
    title: '"The Sun Never Sets"',
    description:
      'By the 1880s, the British Empire spanned 13.7 million square miles — 26% of the world\'s land surface — ruling 412 million people (23% of the world\'s population). It was the largest empire in human history. British naval supremacy (Pax Britannica) controlled global trade routes. The pound sterling was the world\'s reserve currency. London was the capital of global finance. No empire before or since has matched its geographic scope.',
    color: NAVY_BLUE,
  },
];

// ── Section 4: Ideology ─────────────────────────────────────────────────────

const IDEOLOGY: InsightEntry[] = [
  {
    label: "Kipling's 'The White Man's Burden' (1899)",
    detail:
      'Rudyard Kipling\'s poem urged America to colonize the Philippines, framing imperialism as a selfless duty to "civilize" non-white peoples. The poem captures the Victorian mindset perfectly: colonialism as charity, empire as moral obligation. The colonized are described as "half-devil and half-child" — people who need white guidance. This was not fringe ideology; it was mainstream Victorian thought, taught in schools and preached from pulpits.',
  },
  {
    label: 'Social Darwinism: Race Science as Imperial Justification',
    detail:
      'Victorian pseudo-science ranked human "races" in a hierarchy with Anglo-Saxons conveniently at the top. This "scientific racism" provided intellectual cover for conquest: if some races were naturally superior, then their dominance was not just acceptable but inevitable — even beneficial. Universities, museums, and government reports all reinforced this framework. It wouldn\'t be fully discredited until the mid-20th century.',
  },
  {
    label: 'The Reality: Extraction, Not Civilization',
    detail:
      'Whatever the rhetoric, the mechanics of empire were consistent: extract resources (gold, diamonds, rubber, cotton, tea, spices), exploit labor (enslaved, indentured, or underpaid), seize land from indigenous populations, and restructure local economies to serve British markets. Infrastructure like railways and ports were built not for local development but to move extracted resources to the coast for export to Britain.',
  },
  {
    label: 'Indirect Rule: Empire on the Cheap',
    detail:
      'Britain often governed through local elites — chiefs, maharajas, emirs — who administered on behalf of the Crown. This was cheaper than direct rule and gave colonialism a local face. But it also distorted traditional power structures: leaders who cooperated were empowered regardless of legitimacy; those who resisted were removed. In many colonies, Britain created or hardened ethnic divisions to prevent unified resistance.',
  },
  {
    label: "Macaulay's Minute: Cultural Conquest Through Education",
    detail:
      '"We must at present do our best to form a class of persons, Indian in blood and colour, but English in taste, in opinions, in morals, and in intellect." Thomas Babington Macaulay\'s 1835 Minute on Education reshaped Indian education to produce English-speaking administrators loyal to British interests. Local languages, knowledge systems, and cultural traditions were systematically devalued. This cultural imperialism left scars that persist today.',
  },
];

// ── Section 5: India Under the Raj ───────────────────────────────────────────

const INDIA_RAJ: InsightEntry[] = [
  {
    label: 'Scale of British India',
    detail:
      'The British Raj governed 300 million people — the largest colonial administration in history. India was "the jewel in the Crown," the most important possession in the Empire. British India encompassed modern-day India, Pakistan, Bangladesh, and Myanmar. It was administered by roughly 1,000 members of the Indian Civil Service — an astonishingly thin layer of British bureaucrats ruling a subcontinent.',
  },
  {
    label: 'Railways: Development or Extraction?',
    detail:
      'Britain built 42,000 miles of railway in India — often cited as proof that empire brought development. But the railway network was designed to move raw materials from the interior to ports for export, not to connect Indian cities to each other. Fares were set to discourage Indian passenger travel. Railway construction enriched British investors with guaranteed 5% returns, paid from Indian taxes. The steel, locomotives, and engineering all came from Britain. It was infrastructure for extraction, not development.',
  },
  {
    label: 'De-industrialization: Destroying Indian Manufacturing',
    detail:
      'In 1750, India produced 25% of the world\'s manufactured goods — primarily textiles. By 1900, that figure was 2%. Britain systematically destroyed India\'s textile industry to protect Lancashire mills: imposing tariffs on Indian cloth exports while flooding India with cheap British machine-made textiles. Indian weavers — among the most skilled in the world — were reduced to poverty. India was transformed from a manufacturing economy to a supplier of raw cotton.',
  },
  {
    label: 'The Famines: Millions Dead Under British Rule',
    detail:
      'The Great Bengal Famine (1770) killed an estimated 10 million people — one-third of Bengal\'s population — while the East India Company continued collecting taxes and exporting grain. The Bengal Famine of 1943 killed 2–3 million people while Churchill\'s government diverted food supplies to already well-supplied British soldiers and rejected offers of aid from Australia and Canada. Churchill\'s response: "I hate Indians. They are a beastly people with a beastly religion." Historians like Amartya Sen have demonstrated these famines were not natural disasters but policy failures — deaths caused by colonial extraction priorities.',
  },
  {
    label: 'The Drain of Wealth: $45 Trillion',
    detail:
      'Economist Utsa Patnaik\'s research calculates that Britain extracted approximately $45 trillion (in 2017 dollars) from India between 1765 and 1938. The mechanism was elegant theft: Britain used Indian tax revenues to buy Indian goods, then exported those goods — recording them as "trade" rather than tribute. India was simultaneously impoverished and credited with a trade surplus. This drain financed Britain\'s industrialization, its wars, and its global dominance.',
  },
  {
    label: "Gandhi and Independence",
    detail:
      'Mohandas Gandhi\'s strategy of non-violent resistance — satyagraha — transformed the independence movement from an elite political campaign into a mass movement. The Salt March (1930), in which Gandhi walked 240 miles to make salt from seawater in defiance of the British salt tax, became a global symbol of resistance to colonial injustice. India achieved independence on August 15, 1947.',
  },
  {
    label: 'Partition: The Hasty, Bloody Exit',
    detail:
      'British lawyer Cyril Radcliffe — who had never visited India — was given five weeks to draw the border between India and Pakistan. The result was catastrophe: 10–20 million people displaced, 1–2 million killed in communal violence, families separated, communities destroyed. The partition created wounds — particularly over Kashmir — that remain unresolved. Britain\'s hasty exit, after 200 years of divide-and-rule politics that had deepened Hindu-Muslim tensions, bears significant responsibility for this tragedy.',
  },
];

// ── Section 6: Africa Under British Rule ─────────────────────────────────────

const AFRICA: InsightEntry[] = [
  {
    label: 'Egypt and the Suez Canal (1882)',
    detail:
      'Britain occupied Egypt to control the Suez Canal — the vital shortcut to India. Egypt was never formally annexed (it was technically an Ottoman territory), but British troops and administrators ran the country for 40 years. The Canal epitomized imperial logic: infrastructure built with Egyptian forced labor, owned by European shareholders, controlled by British military power, serving British strategic interests.',
  },
  {
    label: 'Cecil Rhodes: The Empire Builder',
    detail:
      'Cecil Rhodes made a fortune in South African diamonds (De Beers) and gold, then used that wealth to build an empire stretching from Cape Town to Cairo. He founded Rhodesia (now Zimbabwe and Zambia), naming the territory after himself. Rhodes believed in Anglo-Saxon racial supremacy with absolute conviction: "I contend that we are the first race in the world and that the more of the world we inhabit the better it is for the human race." His legacy is a microcosm of empire\'s contested memory.',
  },
  {
    label: 'The Boer Wars (1899–1902): Concentration Camps',
    detail:
      'Britain fought the Boers (Dutch-descended settlers) for control of South African gold and diamond fields. When conventional tactics failed, the British adopted scorched-earth policies and invented the concentration camp — interning Boer civilians, primarily women and children, in camps where 28,000 died from disease and malnutrition. An additional 20,000 Black Africans died in separate camps. These camps shocked even British public opinion and foreshadowed the horrors of the 20th century.',
  },
  {
    label: 'Kenya: Land Theft and the Mau Mau',
    detail:
      'In Kenya, white settlers seized the most fertile land — the "White Highlands" — dispossessing the Kikuyu and other peoples. When the Mau Mau movement rose in the 1950s to fight for land and freedom, Britain declared a state of emergency. The suppression was savage: 1.5 million Kikuyu were forced into detention camps, systematic torture was widespread, and an estimated 20,000–100,000 Kenyans were killed. British documents detailing these atrocities were deliberately destroyed or hidden until 2011.',
  },
  {
    label: 'Nigeria, Ghana, and West Africa',
    detail:
      'Britain governed Nigeria — Africa\'s most populous nation — by amplifying ethnic and religious divisions between the predominantly Muslim north and the Christian/animist south. This "divide and rule" strategy made colonial administration easier but left a legacy of ethnic tension that contributed to the Biafran War (1967–70), which killed over a million people. Ghana (Gold Coast) became the first sub-Saharan African nation to gain independence in 1957 under Kwame Nkrumah.',
  },
  {
    label: 'Divide and Rule: Manufacturing Ethnic Conflict',
    detail:
      'Britain\'s most destructive legacy in Africa may be the deliberate creation or hardening of ethnic divisions. In Rwanda, Belgian colonizers (following British anthropological models) issued ethnic ID cards categorizing Hutus and Tutsis — groups that had previously been fluid social categories. These rigid classifications laid the groundwork for the 1994 genocide. Across the continent, colonial borders cut through ethnic groups and forced rival communities into artificial nations, creating conflicts that persist today.',
  },
];

// ── Section 7: World Wars and Decline ────────────────────────────────────────

const WORLD_WARS: TimelineEntry[] = [
  {
    year: '1914–1918',
    title: "WWI: The Empire's Manpower",
    description:
      '1.5 million Indian soldiers fought for Britain in World War I — on the Western Front, in Mesopotamia, in East Africa. Troops from Australia and New Zealand died at Gallipoli. Canadian forces proved decisive at Vimy Ridge. West Indian and African soldiers served across multiple theaters. The empire provided the manpower that sustained Britain through four years of total war — and in return, colonial peoples expected political rights they would not receive.',
    color: CRIMSON,
  },
  {
    year: '1919',
    title: 'Jallianwala Bagh Massacre',
    description:
      'In Amritsar, India, Brigadier General Reginald Dyer ordered troops to fire on an unarmed crowd of thousands gathered in a walled garden with limited exits. At least 379 people were killed (Indian estimates put the figure much higher) and over 1,200 wounded. Dyer was unrepentant: "I think it quite possible that I could have dispersed the crowd without firing, but they would have come back again and laughed." The massacre radicalized Indian public opinion and convinced Gandhi that British rule was fundamentally immoral.',
    color: IMPERIAL_RED,
  },
  {
    year: '1939–1945',
    title: 'WWII: Fighting for Freedom While Denying It',
    description:
      'Britain "fought for freedom" while holding an empire of 700 million unfree people. The contradiction was not lost on colonial subjects. 2.5 million Indian soldiers fought in WWII — the largest volunteer army in history — while Gandhi launched the Quit India movement (1942). Churchill, who genuinely believed in racial hierarchy, resisted all pressure to promise Indian independence. The war bankrupted Britain and made the empire economically unsustainable.',
    color: NAVY_BLUE,
  },
  {
    year: '1941',
    title: 'The Atlantic Charter',
    description:
      'Roosevelt and Churchill signed the Atlantic Charter, affirming "the right of all peoples to choose the form of government under which they will live." Churchill insisted this applied only to European nations under Nazi occupation, not to the British Empire. Roosevelt disagreed. The Charter became a weapon in the hands of anti-colonial movements worldwide — Britain\'s own wartime rhetoric was used to delegitimize its empire.',
    color: BLUE,
  },
  {
    year: '1945',
    title: 'Post-War Bankruptcy',
    description:
      'Britain emerged from WWII victorious but financially ruined. The country owed $3.4 billion to the United States (the Anglo-American Loan, not fully repaid until 2006) and could no longer afford to maintain military forces across the globe. The economic foundation of empire had collapsed. Within two years, Britain would withdraw from India. Within two decades, it would withdraw from Africa. The empire that had taken 350 years to build was dismantled in 33.',
    color: SLATE,
  },
];

// ── Section 8: Decolonization ────────────────────────────────────────────────

const DECOLONIZATION: TimelineEntry[] = [
  {
    year: '1947',
    title: 'India and Pakistan',
    description:
      'The jewel in the Crown was the first major loss. India and Pakistan gained independence on August 15 and 14, 1947, respectively. The partition triggered the largest mass migration in human history — 10–20 million people displaced — and communal violence that killed 1–2 million. Britain\'s 200 years of rule ended in a matter of weeks.',
    color: RAJ_SAFFRON,
  },
  {
    year: '1948',
    title: 'Palestine',
    description:
      'Britain\'s contradictory promises during WWI (the Balfour Declaration to Zionists, assurances to Arab leaders) created an intractable conflict. Unable to manage escalating violence between Jewish and Arab communities, Britain handed the problem to the United Nations and withdrew. The resulting Israeli-Palestinian conflict remains unresolved — another legacy of imperial border-drawing.',
    color: CRIMSON,
  },
  {
    year: '1956–1957',
    title: 'Sudan and Ghana: Africa Begins',
    description:
      'Sudan gained independence in 1956. Ghana (Gold Coast) followed in 1957 under Kwame Nkrumah — the first sub-Saharan African nation to achieve independence from a European colonial power. Nkrumah\'s famous declaration — "We prefer self-government with danger to servitude in tranquility" — captured the spirit of African decolonization.',
    color: GREEN,
  },
  {
    year: '1960',
    title: "Macmillan's 'Wind of Change'",
    description:
      'British Prime Minister Harold Macmillan addressed the South African parliament: "The wind of change is blowing through this continent. Whether we like it or not, this growth of national consciousness is a political fact." It was the British establishment acknowledging that African nationalism was unstoppable and that the age of empire was over.',
    color: TEAL,
  },
  {
    year: '1960–1968',
    title: 'The African Wave',
    description:
      'Nigeria (1960), Sierra Leone (1961), Tanzania (1961), Uganda (1962), Kenya (1963), Malawi (1964), Zambia (1964), Botswana (1966), Swaziland (1968). In less than a decade, Britain\'s African empire dissolved. 64 countries in total gained independence from Britain — more than from any other colonial power.',
    color: INDIGO,
  },
  {
    year: '1980–1997',
    title: 'The Final Chapters',
    description:
      'Rhodesia became Zimbabwe in 1980 after a protracted guerrilla war — the last major African colony. Hong Kong was returned to China in 1997 — marking the effective end of the British Empire. What had been the largest empire in human history was reduced to a handful of small overseas territories: Gibraltar, the Falklands, Bermuda, and a scattering of islands.',
    color: NAVY_BLUE,
  },
];

// ── Section 9: Commonwealth ─────────────────────────────────────────────────

const COMMONWEALTH: InsightEntry[] = [
  {
    label: '56 Nations, 2.5 Billion People',
    detail:
      'The Commonwealth of Nations — a voluntary association of mostly former British colonies — encompasses 56 member states and roughly one-third of the world\'s population. It is the institutional successor to the British Empire, though it operates on principles of equality and consensus rather than domination. Its practical significance is debated: it facilitates some trade and diplomatic cooperation, but critics see it as imperial nostalgia rebranded.',
  },
  {
    label: 'The Crown in Question',
    detail:
      'King Charles III serves as head of state in 15 Commonwealth realms — including Australia, Canada, New Zealand, Jamaica, and several Caribbean nations. But this is increasingly contested: Barbados became a republic in 2021, Jamaica and Australia have active republican movements, and several Caribbean nations are expected to follow Barbados\'s lead. The monarchy\'s role as a symbol of imperial continuity makes it a focal point for decolonization debates.',
  },
  {
    label: 'The Reparations Debate',
    detail:
      'Caribbean nations, led by the CARICOM Reparations Commission, have formally demanded reparations for the Atlantic slave trade and colonial exploitation. Their case is strengthened by a painful fact: when Britain abolished slavery in 1833, it paid £20 million in compensation — to the slaveowners, not the enslaved. This sum (equivalent to £17 billion today) was financed by a government loan that British taxpayers were still paying off until 2015. The formerly enslaved received nothing.',
  },
];

// ── Section 10: Legacy ──────────────────────────────────────────────────────

const LEGACY: InsightEntry[] = [
  {
    label: 'What Britain Built',
    detail:
      'The British Empire left institutional legacies that shaped the modern world: the common law system (used by a third of the world\'s population), parliamentary democracy (adopted by many former colonies), the English language (now the global language of business, science, and diplomacy), universities, cricket, and administrative systems. Whether these constitute "gifts" or impositions depends on perspective — they were never offered as a choice.',
  },
  {
    label: 'What Britain Took',
    detail:
      'Resources, sovereignty, cultural confidence, and millions of lives. The $45 trillion drained from India alone (Patnaik estimate) represents wealth that could have financed Indian industrialization. Famines killed tens of millions under British rule. Entire civilizations were restructured to serve British economic interests. The psychological damage of being told your culture, language, and religion are inferior persists across generations.',
  },
  {
    label: 'The Winston Churchill Question',
    detail:
      'Churchill epitomizes the contested legacy of empire. He is celebrated in Britain as the leader who saved democracy from Nazism — and he was. But he was also a committed imperialist who described Indians as "a beastly people with a beastly religion," oversaw policies that contributed to the 1943 Bengal Famine, advocated using chemical weapons against "uncivilised tribes," and opposed Indian independence until the very end. Both things are true. History demands we hold them together.',
  },
  {
    label: 'Memory Politics: Who Tells the Story?',
    detail:
      'The UK school curriculum has historically taught empire as a source of national pride — trade, exploration, the "abolition of slavery" (without mentioning the 200 years of British slave trading that preceded it). Former colonies remember differently: exploitation, cultural destruction, arbitrary borders, and famines. The 2020 toppling of Edward Colston\'s statue in Bristol — a slave trader honored with a public monument — symbolized a growing reckoning with imperial memory in Britain itself.',
  },
  {
    label: 'A Legacy That Shapes Today',
    detail:
      'The borders of the modern Middle East, the Hindu-Muslim tensions in South Asia, the ethnic conflicts in Africa, the racial hierarchies of the Caribbean, the land disputes in Kenya and Zimbabwe, the constitutional arrangements of Canada and Australia — all are direct products of British imperial decisions. The British Empire ended decades ago, but its consequences are the fabric of the contemporary world. Understanding empire is not about the past; it is about understanding the present.',
  },
];

// ── Key Figures ──────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Robert Clive',
    years: '1725–1774',
    contribution:
      'Military commander who established British control over Bengal after the Battle of Plassey (1757). His victories transformed the East India Company from a trading enterprise into a territorial power. Accused of corruption and looting, he defended himself by saying: "I stand astonished at my own moderation." He embodied the predatory origins of British India.',
  },
  {
    name: 'Queen Victoria',
    years: '1819–1901',
    contribution:
      'Empress of India from 1876, Victoria presided over the Empire at its zenith. Her 63-year reign (1837–1901) gave its name to the Victorian era — a period of industrial supremacy, imperial expansion, and deeply held beliefs in British civilizational superiority. The "Victorian values" that justified empire were inseparable from the racism that sustained it.',
  },
  {
    name: 'Cecil Rhodes',
    years: '1853–1902',
    contribution:
      'Diamond magnate, politician, and architect of British expansion in southern Africa. Founded De Beers and the colony of Rhodesia. His vision of a "Cape to Cairo" British Africa drove expansion that dispossessed millions. His will funded the Rhodes Scholarship — still prestigious, still controversial.',
  },
  {
    name: 'Mohandas Gandhi',
    years: '1869–1948',
    contribution:
      'Led India\'s independence movement through non-violent resistance (satyagraha). The Salt March (1930) became a global symbol of peaceful defiance against imperial injustice. His methods influenced Martin Luther King Jr. and anti-colonial movements worldwide. Assassinated in 1948 by a Hindu nationalist who opposed his conciliatory stance toward Muslims.',
  },
  {
    name: 'Winston Churchill',
    years: '1874–1965',
    contribution:
      'Wartime prime minister who led Britain through WWII, but also a committed imperialist who opposed Indian independence, oversaw the Bengal Famine response, and described colonized peoples in explicitly racist terms. His dual legacy — democratic hero and imperial ideologue — encapsulates the contradictions of British identity.',
  },
  {
    name: 'Kwame Nkrumah',
    years: '1909–1972',
    contribution:
      'Led Ghana to independence in 1957 — the first sub-Saharan African nation to break free from European colonial rule. A pan-Africanist who envisioned a united Africa, Nkrumah declared: "We face neither East nor West; we face forward." His achievement inspired independence movements across the continent.',
  },
  {
    name: 'Jawaharlal Nehru',
    years: '1889–1964',
    contribution:
      'India\'s first prime minister, who guided the new nation through partition and its aftermath. A product of British education who used that education to dismantle British rule, Nehru championed non-alignment, industrialization, and secular democracy. His "Tryst with Destiny" speech at independence remains one of history\'s great orations.',
  },
  {
    name: 'Jomo Kenyatta',
    years: '1897–1978',
    contribution:
      'Led Kenya to independence in 1963 after years of British detention. Imprisoned during the Mau Mau Emergency on dubious charges, he emerged to become Kenya\'s first president. His journey from colonial prisoner to head of state symbolized the transformation of an entire continent.',
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

export default function BritishEmpirePage() {
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
              background: `linear-gradient(135deg, ${IMPERIAL_RED}, ${COLONIAL_GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Empire on Which the Sun Never Sets — The British Empire
            (1600–1997)
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
              At its peak, the British Empire ruled 13.7 million square miles —
              26% of all land on Earth — and 412 million people, nearly a
              quarter of humanity. It was the largest empire in human history,
              spanning every continent and every ocean. It spread the English
              language, common law, and parliamentary democracy around the
              globe. It also enslaved 3.1 million Africans, drained an
              estimated $45 trillion from India, and left a legacy of
              partitioned nations, manufactured ethnic conflicts, and
              generational trauma that shapes the world today.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              The British Empire is not ancient history — it is the operating
              system of the modern world. The borders of the Middle East, the
              Hindu-Muslim tensions in South Asia, the ethnic conflicts in
              Africa, the racial hierarchies of the Caribbean, and the
              constitutional arrangements of nations from Canada to Australia
              are all direct products of British imperial decisions. To
              understand the present, you must understand the empire that made
              it.
            </p>
          </motion.div>
        </header>

        {/* ── EIC Callout ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: 'rgba(185, 28, 28, 0.08)',
            border: `1px solid ${IMPERIAL_RED}44`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <p
            style={{
              color: COLONIAL_GOLD,
              fontSize: '1.15rem',
              fontWeight: 600,
              fontStyle: 'italic',
              lineHeight: 1.6,
              textAlign: 'center',
            }}
          >
            "A private company that conquered a subcontinent"
          </p>
          <p
            style={{
              color: SLATE,
              fontSize: '0.85rem',
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            The East India Company had its own army of 260,000 soldiers —
            twice the size of the British Army — and ruled 300 million people
            in India.
          </p>
        </motion.div>

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
            { stat: '26%', label: "of Earth's land surface at peak", color: IMPERIAL_RED },
            { stat: '412M', label: 'people ruled (23% of world)', color: NAVY_BLUE },
            { stat: '3.1M', label: 'enslaved Africans transported', color: CRIMSON },
            { stat: '$45T', label: 'drained from India (1765–1938)', color: RAJ_SAFFRON },
            { stat: '64', label: 'nations gained independence', color: GREEN },
            { stat: '2015', label: 'year UK finished paying slaveowner compensation', color: GOLD },
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

        {/* ── Section 1: Origins ───────────────────────────────────────── */}
        <SectionWrapper
          id="origins"
          icon="⚓"
          title="Origins (1497–1600)"
          accentColor={NAVY_BLUE}
          intro="England came late to the imperial game. Spain and Portugal had been carving up the Americas and the East for decades before England made its first tentative moves overseas. But Elizabeth I's privateers, the plantation system in Ireland, and the founding of the East India Company laid the foundations for what would become the world's largest empire."
        >
          <TimelineCard entries={ORIGINS} />
        </SectionWrapper>

        {/* ── Section 2: First British Empire ──────────────────────────── */}
        <SectionWrapper
          id="first-empire"
          icon="⛵"
          title="The First British Empire (1600–1783)"
          accentColor={COLONIAL_GOLD}
          intro="The First British Empire was built on trade, settlement, and slavery. From the tobacco plantations of Virginia to the sugar islands of the Caribbean to the trading posts of India, Britain constructed a commercial empire that spanned the Atlantic — financed in large part by the profits of the slave trade. It ended with the loss of America."
        >
          <InsightGrid items={FIRST_EMPIRE} />
        </SectionWrapper>

        {/* ── Section 3: Second British Empire ─────────────────────────── */}
        <SectionWrapper
          id="second-empire"
          icon="👑"
          title="The Second British Empire (1783–1900) — The Victorian Peak"
          accentColor={IMPERIAL_RED}
          intro="The loss of America was humiliating — but paradoxically, it made the Empire more aggressive, not less. Having lost settler colonies that demanded self-governance, Britain pivoted to conquest in Asia and Africa, where it could extract resources without the complications of representative government. The result was the largest empire in human history."
        >
          <TimelineCard entries={SECOND_EMPIRE} />
        </SectionWrapper>

        {/* ── Wealth Drain Callout ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: 'rgba(224, 112, 32, 0.08)',
            border: `1px solid ${RAJ_SAFFRON}44`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <p
            style={{
              color: RAJ_SAFFRON,
              fontSize: '2rem',
              fontWeight: 800,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            $45 Trillion
          </p>
          <p
            style={{
              color: COLONIAL_GOLD,
              fontSize: '1rem',
              fontWeight: 600,
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            Economist Utsa Patnaik's estimate of wealth drained from India
            (1765–1938)
          </p>
          <p
            style={{
              color: SLATE,
              fontSize: '0.85rem',
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            In 1750, India produced 25% of global manufactured goods. By 1900,
            that figure was 2%. Britain didn't just take India's wealth — it
            destroyed India's capacity to create wealth.
          </p>
        </motion.div>

        {/* ── Section 4: Ideology ──────────────────────────────────────── */}
        <SectionWrapper
          id="ideology"
          icon="📜"
          title='The Ideology — "The White Man\'s Burden"'
          accentColor={CROWN_PURPLE}
          intro='Empire required justification — and the Victorians built an elaborate intellectual framework to provide it. Racial pseudo-science, civilizational narratives, and Christian missionary zeal combined to create a worldview in which British domination was not just acceptable but morally necessary. The colonized were cast as children who needed guidance, savages who needed civilization, souls who needed saving.'
        >
          <InsightGrid items={IDEOLOGY} />
        </SectionWrapper>

        {/* ── Section 5: India Under the Raj ───────────────────────────── */}
        <SectionWrapper
          id="india-raj"
          icon="🏛️"
          title="India Under the Raj (1858–1947)"
          accentColor={RAJ_SAFFRON}
          intro='India was "the jewel in the Crown" — the most important, most profitable, and most consequential possession of the British Empire. For 200 years, Britain extracted wealth, restructured the economy, and governed 300 million people with a bureaucracy of roughly 1,000 British civil servants. The story of British India is the story of empire in concentrated form: infrastructure that served extraction, famines caused by policy, and a civilization systematically subordinated to foreign interests.'
        >
          <InsightGrid items={INDIA_RAJ} />
        </SectionWrapper>

        {/* ── Section 6: Africa ────────────────────────────────────────── */}
        <SectionWrapper
          id="africa"
          icon="🌍"
          title="Africa Under British Rule"
          accentColor={INDIGO}
          intro="Britain's African empire was acquired in a frenzy of conquest during the 1880s–90s 'Scramble for Africa.' Unlike India, which had been gradually absorbed over two centuries, Africa was carved up in a matter of years — borders drawn in European conference rooms by men who had never set foot on the continent. The consequences — arbitrary borders, manufactured ethnic divisions, resource extraction, land theft — define African politics to this day."
        >
          <InsightGrid items={AFRICA} />
        </SectionWrapper>

        {/* ── Section 7: World Wars ────────────────────────────────────── */}
        <SectionWrapper
          id="world-wars"
          icon="⚔️"
          title="The World Wars and Decline"
          accentColor={CRIMSON}
          intro="Two world wars simultaneously demonstrated the Empire's strength and sealed its doom. Colonial troops fought and died in their millions for a freedom they themselves did not possess. The wars bankrupted Britain, empowered anti-colonial movements, and created an international order — led by America and the Soviet Union — that was hostile to European colonialism."
        >
          <TimelineCard entries={WORLD_WARS} />
        </SectionWrapper>

        {/* ── Decolonization Callout ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.08)',
            border: `1px solid ${GREEN}44`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <p
            style={{
              color: GREEN,
              fontSize: '2rem',
              fontWeight: 800,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            64 Countries in 33 Years
          </p>
          <p
            style={{
              color: TEAL,
              fontSize: '1rem',
              fontWeight: 600,
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            From India (1947) to Hong Kong (1997), the largest empire in history
            was dismantled in a single generation
          </p>
        </motion.div>

        {/* ── Section 8: Decolonization ────────────────────────────────── */}
        <SectionWrapper
          id="decolonization"
          icon="🕊️"
          title="Decolonization (1947–1997)"
          accentColor={GREEN}
          intro='The empire that had taken 350 years to build was dismantled in 33. From India in 1947 to Hong Kong in 1997, Britain withdrew from colony after colony — sometimes peacefully, sometimes violently, almost always leaving behind borders, institutions, and divisions that would shape the new nations for decades to come. 64 countries gained independence from Britain — more than from any other colonial power in history.'
        >
          <TimelineCard entries={DECOLONIZATION} />
        </SectionWrapper>

        {/* ── Section 9: Commonwealth ──────────────────────────────────── */}
        <SectionWrapper
          id="commonwealth"
          icon="🤝"
          title="The Commonwealth Today"
          accentColor={TRADE_TEAL}
          intro="The British Empire became the Commonwealth of Nations — a voluntary association of 56 mostly former colonies that encompasses one-third of humanity. It is the institutional afterlife of empire: stripped of coercion, rebranded around shared values, but haunted by the history that created it."
        >
          <InsightGrid items={COMMONWEALTH} />
        </SectionWrapper>

        {/* ── Section 10: Legacy ───────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="⚖️"
          title="Legacy — The Contested Accounting"
          accentColor={GOLD}
          intro='The British Empire is perhaps the most contested subject in modern historiography. Was it a force for progress that spread law, language, and liberty? Or a system of exploitation that enriched one island at the expense of a quarter of the world? The honest answer is that it was both — and the refusal to hold both truths simultaneously is itself a legacy of empire.'
        >
          <InsightGrid items={LEGACY} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures of Empire and Resistance"
          accentColor={COLONIAL_GOLD}
          intro="The story of the British Empire is shaped by conquerors, administrators, and — most importantly — the people who fought to end it. Empire's architects and its opponents alike left legacies that define the modern world."
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
              { to: '/decolonization', label: 'Decolonization' },
              { to: '/wwi', label: 'World War I' },
              { to: '/wwii', label: 'World War II' },
              { to: '/slavery', label: 'Slavery' },
              { to: '/spanish-empire', label: 'The Spanish Empire' },
              { to: '/gandhi', label: 'Gandhi' },
              { to: '/french-colonial-history', label: 'French Colonial History' },
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

        {/* ── Slavery Compensation Callout ──────────────────────────────── */}
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
              color: GOLD,
              fontSize: '1rem',
              fontWeight: 600,
              fontStyle: 'italic',
              lineHeight: 1.7,
              textAlign: 'center',
            }}
          >
            When Britain abolished slavery in 1833, Parliament paid £20 million
            in compensation — to the slaveowners, not the enslaved. The loan
            taken to finance this payment was not fully repaid until 2015.
            British taxpayers — including descendants of enslaved people — spent
            182 years paying off the debt incurred to compensate their
            ancestors' owners.
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
            "The British Empire was the largest the world has ever seen. Its
            legacy is not a settled question — it is the argument that defines
            the modern world."
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
