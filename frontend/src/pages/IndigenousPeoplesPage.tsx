/**
 * IndigenousPeoplesPage — comprehensive deep-dive on the history and
 * resilience of indigenous peoples worldwide.
 *
 * Route: /indigenous-peoples
 *
 * Sections:
 *  1. Hero — "476 Million Voices" headline, overview
 *  2. Who Are Indigenous Peoples? — definitions, demographics, biodiversity
 *  3. The Americas Before Columbus — sophisticated pre-contact civilizations
 *  4. The Demographic Catastrophe — 90% population collapse
 *  5. Native North America Under Colonialism — removal, reservations, boarding schools
 *  6. Indigenous Australians — 65,000 years of continuous culture
 *  7. Latin American Indigenous Peoples — conquest, forced labor, modern resurgence
 *  8. Indigenous Peoples in the Pacific — Hawaii, Māori, Pacific Islands
 *  9. Africa's Indigenous Peoples — Khoisan, Maasai, San, colonial borders
 * 10. The Rights Movement and Today — UNDRIP, land rights, language revival
 * 11. Resilience and Living Cultures — NOT historical artifacts
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const ASH = '#94a3b8';
const SLATE = '#64748b';
const EARTH = '#92400e';
const TURQUOISE = '#14b8a6';
const TERRACOTTA = '#c2410c';
const FOREST = '#15803d';
const OCHRE = '#d97706';
const SKY = '#0ea5e9';
const CRIMSON = '#dc2626';
const GOLD = '#f59e0b';
const INDIGO = '#6366f1';
const ROSE = '#f43f5e';
const PURPLE = '#a855f7';
const GREEN = '#22c55e';
const BLUE = '#3b82f6';
const SAND = '#d4a76a';
const SUNSET = '#ea580c';

const FIGURE_COLORS = [TURQUOISE, OCHRE, TERRACOTTA, FOREST, SKY, GOLD, INDIGO, ROSE, PURPLE, GREEN, BLUE, SAND];

// ─────────────────────────────────────────────────────────────────────────────
// Data interfaces
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
// Key statistics
// ─────────────────────────────────────────────────────────────────────────────

const KEY_STATS: { stat: string; context: string; color: string }[] = [
  { stat: '476 Million', context: 'Indigenous people worldwide (6% of population)', color: TURQUOISE },
  { stat: '5,000+', context: 'Distinct indigenous peoples', color: OCHRE },
  { stat: '4,000+', context: 'Living indigenous languages', color: FOREST },
  { stat: '90%', context: 'Population loss in the Americas after 1492', color: CRIMSON },
  { stat: '80%', context: "Of world's biodiversity on indigenous lands", color: GREEN },
  { stat: '65,000 yrs', context: 'Australian Aboriginal continuous culture', color: SAND },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section: Who Are Indigenous Peoples?
// ─────────────────────────────────────────────────────────────────────────────

const WHO_INSIGHTS: InsightEntry[] = [
  {
    label: 'United Nations Definition',
    detail:
      'Peoples with historical continuity to pre-colonial societies who maintain distinct social, economic, cultural, and political institutions. Self-identification is a fundamental criterion.',
  },
  {
    label: '476 Million People',
    detail:
      'Indigenous peoples make up approximately 6% of the global population \u2014 476 million people across 90+ countries, belonging to 5,000+ distinct peoples speaking 4,000+ languages.',
  },
  {
    label: 'Geographic Distribution',
    detail:
      'Most indigenous peoples live in the Asia-Pacific region (70%), followed by Africa, then the Americas. They include Arctic Inuit, Amazon rainforest peoples, Australian Aboriginals, African pastoralists, and Pacific Islanders.',
  },
  {
    label: 'Biodiversity Guardians',
    detail:
      "Indigenous peoples occupy 22% of the world's land surface but protect 80% of the planet's remaining biodiversity. Their traditional land management practices are among the most effective conservation strategies on Earth.",
  },
  {
    label: 'Not a Monolith',
    detail:
      'There is no single "indigenous experience." From the S\u00e1mi reindeer herders of Scandinavia to the Maasai pastoralists of East Africa to the Navajo of the American Southwest \u2014 each people has its own history, language, governance, and worldview.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section: The Americas Before Columbus
// ─────────────────────────────────────────────────────────────────────────────

const BEFORE_COLUMBUS: InsightEntry[] = [
  {
    label: 'Cahokia \u2014 Larger Than London',
    detail:
      'Near modern St. Louis, Cahokia held 20,000 people around 1100 CE \u2014 larger than contemporary London. Its central Monks Mound covered 14 acres and rose 100 feet. This was a planned urban center with plazas, astronomical observatories, and extensive trade networks.',
  },
  {
    label: 'Mississippian Trade Networks',
    detail:
      'Mississippian cultures maintained extensive trade networks stretching from the Gulf of Mexico to the Great Lakes. Copper from Lake Superior, shells from the Gulf, obsidian from the Rockies \u2014 all circulated through sophisticated exchange systems.',
  },
  {
    label: 'Pacific Northwest Maritime Cultures',
    detail:
      'Sophisticated maritime peoples built massive cedar longhouses, carved totem poles as family histories and legal records, and held potlatch ceremonies \u2014 elaborate gift-giving feasts that redistributed wealth and reinforced social bonds.',
  },
  {
    label: 'Southwest Pueblo Peoples',
    detail:
      "Built apartment complexes up to 5 stories tall at Chaco Canyon and Mesa Verde. Developed sophisticated water management systems to farm in the desert. Chaco's Great Houses contained 700+ rooms and were precisely aligned with solar and lunar cycles.",
  },
  {
    label: 'Amazon "Garden Cities"',
    detail:
      'Recent archaeology has revealed dense, sophisticated settlements throughout the Amazon. Far from "untouched wilderness," the Amazon was actively managed \u2014 its rich "terra preta" (dark earth) soils were created by centuries of indigenous agriculture.',
  },
  {
    label: 'Haudenosaunee (Iroquois) Confederacy',
    detail:
      "A democratic federal system uniting five (later six) nations under the Great Law of Peace, possibly established as early as 1142 CE. Its structure \u2014 with representative councils, checks on power, and individual rights \u2014 is claimed to have influenced the US Constitution's federal design.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section: The Demographic Catastrophe
// ─────────────────────────────────────────────────────────────────────────────

const CATASTROPHE_INSIGHTS: InsightEntry[] = [
  {
    label: '60 Million \u2192 6 Million',
    detail:
      'The estimated indigenous population of the Americas fell from roughly 60 million in 1491 to approximately 6 million by 1650 \u2014 a 90% reduction. This represents the largest demographic collapse in recorded human history.',
  },
  {
    label: 'Disease as the Primary Killer',
    detail:
      'Smallpox, measles, typhus, influenza, and other Old World diseases killed the majority \u2014 often devastating communities before they ever saw a European. Having no prior exposure, indigenous peoples had no immunity to these pathogens.',
  },
  {
    label: 'The Myth of "Empty Lands"',
    detail:
      'The "virgin wilderness" that Europeans claimed to discover was largely recently emptied by disease waves. What settlers perceived as pristine nature was often a landscape recently depopulated \u2014 its gardens overgrown, its roads reclaimed by forest.',
  },
  {
    label: 'Compounding Catastrophe',
    detail:
      'Disease was devastating, but it was compounded by warfare, forced labor (especially in mines and plantations), deliberate starvation through displacement from food sources, and the destruction of social structures that maintained communities.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section: Native North America Under Colonialism
// ─────────────────────────────────────────────────────────────────────────────

const NORTH_AMERICA_TIMELINE: TimelineEntry[] = [
  {
    year: '1830',
    title: 'Indian Removal Act',
    description:
      'President Andrew Jackson signs the Indian Removal Act, authorizing the forced relocation of the Five "Civilized" Tribes (Cherokee, Chickasaw, Choctaw, Creek, Seminole) from the southeastern United States to "Indian Territory" (Oklahoma).',
    color: CRIMSON,
  },
  {
    year: '1838',
    title: 'Trail of Tears',
    description:
      'Cherokee are forced to march 1,200 miles to Oklahoma. Approximately 4,000 of 15,000 die from exposure, disease, and starvation along the way. The Cherokee word for the journey is "Nunna daul Tsuny" \u2014 "The Trail Where They Cried."',
    color: CRIMSON,
  },
  {
    year: '1860s\u20131880s',
    title: 'Buffalo Extermination',
    description:
      "The American bison population is deliberately destroyed \u2014 from 30 million to barely 1,000 by 1889. This was a conscious policy to destroy the Plains nations' food supply, economy, and way of life. General Philip Sheridan endorsed it as military strategy.",
    color: TERRACOTTA,
  },
  {
    year: '1870s\u20131970s',
    title: 'Boarding Schools',
    description:
      'Native children are forcibly removed from families and sent to boarding schools designed to eliminate indigenous identity. "Kill the Indian, save the man" was the explicit motto. Children were punished for speaking their languages or practicing their cultures.',
    color: EARTH,
  },
  {
    year: '1890',
    title: 'Wounded Knee Massacre',
    description:
      'US Army soldiers kill 250\u2013300 Lakota men, women, and children at Wounded Knee Creek, South Dakota. Many victims were unarmed. Twenty soldiers received the Medal of Honor \u2014 medals that Native American advocates continue to demand be rescinded.',
    color: CRIMSON,
  },
  {
    year: 'Ongoing',
    title: 'Broken Treaties',
    description:
      'The United States made approximately 500 treaties with Native nations and broke virtually every single one. The reservation system confined peoples to fractions of their original territories, often on the least productive land.',
    color: OCHRE,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section: Indigenous Australians
// ─────────────────────────────────────────────────────────────────────────────

const AUSTRALIA_INSIGHTS: InsightEntry[] = [
  {
    label: '65,000 Years of Continuous Culture',
    detail:
      "Australian Aboriginal peoples have inhabited the continent for at least 65,000 years, making theirs the world's oldest continuous culture. Their oral traditions, songlines, and Dreamtime stories preserve knowledge spanning millennia.",
  },
  {
    label: '1788: British Colonization',
    detail:
      'The arrival of the First Fleet in 1788 began a catastrophe. Disease devastated Aboriginal populations. The doctrine of "terra nullius" (nobody\'s land) denied the existence of Aboriginal sovereignty, treating a continent of hundreds of distinct nations as empty.',
  },
  {
    label: 'Stolen Generations (1910\u20131970)',
    detail:
      'Government policies forcibly removed Aboriginal and Torres Strait Islander children from their families to be raised in white institutions or foster families. The goal was cultural assimilation \u2014 to "breed out" Aboriginal identity. An estimated 1 in 3 Aboriginal children were taken.',
  },
  {
    label: '2008 National Apology',
    detail:
      'Prime Minister Kevin Rudd delivered a formal apology to the Stolen Generations \u2014 the first time the Australian government acknowledged this policy as wrong. The apology was met with both tears and criticism that words without reparations are insufficient.',
  },
  {
    label: 'Today: Persistent Inequality',
    detail:
      "Aboriginal and Torres Strait Islander peoples make up 3.8% of Australia's population. They face a life expectancy gap of 8+ years, disproportionate incarceration rates, and ongoing fights for land rights and constitutional recognition.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section: Latin American Indigenous Peoples
// ─────────────────────────────────────────────────────────────────────────────

const LATIN_AMERICA_INSIGHTS: InsightEntry[] = [
  {
    label: 'Empires Destroyed in Decades',
    detail:
      'The Aztec, Inca, and Maya empires \u2014 civilizations with millions of people, monumental architecture, advanced mathematics, and complex governance \u2014 were destroyed within decades of Spanish contact through a combination of disease, military force, and political manipulation.',
  },
  {
    label: 'Potos\u00ed: The Mountain That Eats Men',
    detail:
      'Under the mita system of forced labor, an estimated 8 million indigenous people died working the silver mines of Potos\u00ed (modern Bolivia). The silver enriched Spain and fueled the global economy while consuming entire generations of Andean peoples.',
  },
  {
    label: 'Mestizo Societies',
    detail:
      'Mixing between indigenous, European, and African peoples created new mestizo cultures. But this blending often came with a racial hierarchy \u2014 indigenous identity was suppressed, indigenous languages discouraged, and darker skin associated with lower status.',
  },
  {
    label: '45 Million Indigenous People Today',
    detail:
      'Latin America is home to 45 million indigenous people. Guatemala, Peru, and Bolivia have indigenous majorities or near-majorities. Indigenous languages like Quechua, Aymara, Guaran\u00ed, and dozens of Maya languages remain widely spoken.',
  },
  {
    label: 'Bolivia: Evo Morales',
    detail:
      "In 2006, Evo Morales became Bolivia's first indigenous president (Aymara). His government recognized Pachamama (Mother Earth) in the constitution, declared Bolivia a \"plurinational\" state, and made 36 indigenous languages co-official alongside Spanish.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section: Indigenous Peoples in the Pacific
// ─────────────────────────────────────────────────────────────────────────────

const PACIFIC_INSIGHTS: InsightEntry[] = [
  {
    label: "Hawai'i: From Kingdom to Annexation",
    detail:
      'The Hawaiian Kingdom was overthrown by American settlers in 1893 with US military support. Annexation followed in 1898. Today, the Hawaiian sovereignty movement seeks recognition and self-determination. The Hawaiian language, once nearly extinct, is being revived.',
  },
  {
    label: 'M\u0101ori and the Treaty of Waitangi',
    detail:
      'In 1840, the Treaty of Waitangi between M\u0101ori chiefs and the British Crown was supposed to protect M\u0101ori rights. Systematic land confiscation followed instead. Today, the Waitangi Tribunal process addresses historical grievances, and M\u0101ori language is co-official in New Zealand.',
  },
  {
    label: 'Philippine Indigenous Peoples',
    detail:
      '17 million indigenous Lumad and other peoples in the Philippines face displacement from mining, logging, and military operations. The Indigenous Peoples Rights Act (1997) recognizes ancestral domains, but enforcement remains weak.',
  },
  {
    label: 'Pacific Islands and Climate Change',
    detail:
      'Rising sea levels from climate change pose an existential threat to Pacific Island nations like Tuvalu, Kiribati, and the Marshall Islands. People who contributed almost nothing to greenhouse gas emissions face losing their homelands entirely \u2014 a new form of colonial injustice.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section: Africa's Indigenous Peoples
// ─────────────────────────────────────────────────────────────────────────────

const AFRICA_INSIGHTS: InsightEntry[] = [
  {
    label: "Khoisan: World's Oldest Genetic Lineage",
    detail:
      'The Khoisan peoples of Southern Africa carry the world\'s oldest genetic lineage \u2014 approximately 150,000 years. Their click languages are among the most phonetically complex on Earth. Despite their deep history, they face marginalization and land dispossession across Southern Africa.',
  },
  {
    label: 'Maasai: Pastoralists Under Pressure',
    detail:
      'The Maasai of Kenya and Tanzania are semi-nomadic pastoralists whose land rights are under constant pressure from conservation areas, tourism, and agricultural expansion. Their distinctive culture and resistance to assimilation have made them both iconic and vulnerable.',
  },
  {
    label: 'San/Bushmen: Displaced Knowledge-Keepers',
    detail:
      'The San peoples have been displaced from traditional lands across Botswana, Namibia, and South Africa \u2014 often in the name of conservation or diamond mining. Their extraordinary knowledge of tracking, plants, and survival in arid environments represents tens of thousands of years of accumulated wisdom.',
  },
  {
    label: 'Colonial Borders Through Indigenous Lands',
    detail:
      'European colonial powers drew arbitrary borders that cut through hundreds of indigenous territories, separating peoples who had lived together for millennia and forcing together those with distinct identities. These imposed borders remain a source of conflict and displacement today.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section: The Rights Movement and Today
// ─────────────────────────────────────────────────────────────────────────────

const RIGHTS_TIMELINE: TimelineEntry[] = [
  {
    year: '1969',
    title: 'Occupation of Alcatraz',
    description:
      'Native American activists occupy Alcatraz Island for 19 months, demanding recognition of indigenous rights. The occupation galvanizes the American Indian Movement and brings national attention to Native issues for the first time in decades.',
    color: TURQUOISE,
  },
  {
    year: '1973',
    title: 'Wounded Knee Occupation',
    description:
      'Members of the American Indian Movement occupy Wounded Knee, South Dakota \u2014 the site of the 1890 massacre \u2014 for 71 days in a standoff with federal forces, demanding treaty rights and tribal sovereignty.',
    color: OCHRE,
  },
  {
    year: '2007',
    title: 'UN Declaration on the Rights of Indigenous Peoples',
    description:
      'The UN General Assembly adopts UNDRIP with 143 votes in favor. Notably, Australia, Canada, the United States, and New Zealand initially vote against it \u2014 all four later reverse their positions. The declaration affirms rights to self-determination, land, culture, and language.',
    color: BLUE,
  },
  {
    year: '2016',
    title: 'Standing Rock',
    description:
      'The Standing Rock Sioux and thousands of supporters resist the Dakota Access Pipeline, which threatens sacred sites and water supplies. The protest becomes a global symbol of indigenous environmental resistance and the ongoing fight over treaty rights.',
    color: FOREST,
  },
  {
    year: 'Ongoing',
    title: 'Environmental Defenders',
    description:
      'Over 300 indigenous environmental defenders are killed per year \u2014 most in Latin America \u2014 for protecting their lands from mining, logging, and agribusiness. Indigenous peoples are the front line of environmental defense worldwide.',
    color: CRIMSON,
  },
];

const RIGHTS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Land Rights: The Central Issue',
    detail:
      'Worldwide, the most fundamental struggle for indigenous peoples is land. Land is not merely property \u2014 it is identity, spirituality, sustenance, and sovereignty. Without secure land rights, every other right is precarious.',
  },
  {
    label: 'Language Revival',
    detail:
      'Dozens of indigenous language revitalization efforts are underway worldwide. Hawaiian was rescued from near-extinction (50 speakers) to thousands through immersion schools. M\u0101ori has its own TV channel in New Zealand. Cherokee, Navajo, Welsh \u2014 each fights to keep ancient languages alive.',
  },
  {
    label: 'Cultural Sovereignty and Repatriation',
    detail:
      "Indigenous peoples are demanding the return of human remains and cultural artifacts from Western museums. The repatriation movement challenges the idea that indigenous heritage belongs in European collections \u2014 and raises fundamental questions about who owns the past.",
  },
  {
    label: 'Two-Spirit People',
    detail:
      'Many Native American traditions have long recognized Two-Spirit people \u2014 individuals embodying both masculine and feminine spirits. This recognition of gender diversity predates modern LGBTQ+ terminology by centuries and challenges Western binary categories.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section: Resilience and Living Cultures
// ─────────────────────────────────────────────────────────────────────────────

const RESILIENCE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Not Historical Artifacts',
    detail:
      'Indigenous peoples are not remnants of the past. They are living cultures actively maintaining, adapting, and innovating their traditions. Framing indigenous cultures as "ancient" or "traditional" in ways that deny their modernity is itself a form of erasure.',
  },
  {
    label: 'Language Revival Successes',
    detail:
      'M\u0101ori language recovery in New Zealand \u2014 from suppression to a national TV channel, immersion schools, and official status \u2014 is one of the great cultural achievements of the modern era. Hawaiian, once down to 50 native speakers, now has thousands of new speakers.',
  },
  {
    label: 'Political Representation',
    detail:
      "New Zealand's reserved M\u0101ori parliamentary seats (established 1867) ensure indigenous political voice. Bolivia's plurinational constitution recognizes 36 indigenous nations. Canada's Truth and Reconciliation process confronts the boarding school legacy.",
  },
  {
    label: 'Most Effective Environmental Protectors',
    detail:
      'Research consistently shows that territories under indigenous management have less deforestation, more biodiversity, and better carbon storage than other protected areas \u2014 including national parks. Indigenous land stewardship is not just culturally important; it is the most effective environmental strategy on Earth.',
  },
  {
    label: 'Cultural Renaissance',
    detail:
      'Indigenous art, music, literature, film, and philosophy are experiencing a global renaissance. From the M\u0101ori haka performed at international sporting events to Cherokee language apps to indigenous contemporary art in major museums \u2014 these cultures are vibrant and growing.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Key figures
// ─────────────────────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Sitting Bull (T\u021fat\u021f\u00e1\u014bka \u00cdyotake)',
    years: 'c. 1831\u20131890',
    contribution:
      'Hunkpapa Lakota leader who led resistance against US government policies, including the famous victory at the Battle of the Little Bighorn (1876). Killed by Indian agency police during the Ghost Dance movement.',
  },
  {
    name: 'Rigoberta Mench\u00fa',
    years: '1959\u2013present',
    contribution:
      "K'iche' Maya activist from Guatemala who won the 1992 Nobel Peace Prize for her work advocating for indigenous rights during Guatemala's civil war, which saw systematic genocide against Maya peoples.",
  },
  {
    name: 'Evo Morales',
    years: '1959\u2013present',
    contribution:
      'Aymara leader who became Bolivia\'s first indigenous president (2006\u20132019). Transformed Bolivia into a "plurinational" state recognizing 36 indigenous nations and made Pachamama (Mother Earth) a constitutional entity.',
  },
  {
    name: 'Berta C\u00e1ceres',
    years: '1971\u20132016',
    contribution:
      'Honduran Lenca environmental activist who led opposition to the Agua Zarca dam on the Gualcarque River, sacred to the Lenca people. Won the Goldman Environmental Prize in 2015. Assassinated in 2016.',
  },
  {
    name: 'Wilma Mankiller',
    years: '1945\u20132010',
    contribution:
      'First woman elected Principal Chief of the Cherokee Nation (1985). Revitalized Cherokee communities through infrastructure, education, and healthcare programs, becoming one of the most important Native American leaders of the 20th century.',
  },
  {
    name: 'Eddie Mabo',
    years: '1936\u20131992',
    contribution:
      'Torres Strait Islander man whose legal challenge led to the landmark Mabo v Queensland (1992) decision, which overturned the doctrine of terra nullius and recognized Aboriginal land rights in Australian law for the first time.',
  },
  {
    name: 'Davi Kopenawa',
    years: '1956\u2013present',
    contribution:
      'Yanomami shaman and spokesperson known as the "Dalai Lama of the Rainforest." Has spent decades fighting for the protection of Yanomami territory in the Brazilian Amazon against illegal mining and deforestation.',
  },
  {
    name: 'Te Whiti o Rongomai',
    years: 'c. 1830\u20131907',
    contribution:
      "M\u0101ori leader who pioneered nonviolent resistance at Parihaka decades before Gandhi. His community's peaceful resistance to land confiscation was met with military invasion, but his philosophy influenced protest movements worldwide.",
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
          <span style={{ color: e.color, fontSize: '0.7rem', marginRight: 6 }}>{'\u25CF'}</span>
          <p style={{ color: e.color, fontWeight: 700, fontSize: '0.85rem', margin: '0 0 2px' }}>
            {e.year}
          </p>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px', color: '#e2e8f0' }}>
            {e.title}
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.93rem', margin: 0 }}>
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
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px' }}>
            {item.label}
          </h4>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem', margin: 0 }}>
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
          <h4 style={{ color: FIGURE_COLORS[i % FIGURE_COLORS.length], fontSize: '0.95rem', fontWeight: 700, margin: '0 0 2px' }}>
            {f.name}
          </h4>
          <p style={{ color: SLATE, fontSize: '0.8rem', margin: '0 0 8px' }}>{f.years}</p>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem', margin: 0 }}>
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
    <section id={id} style={{ padding: '48px 0', borderTop: `1px solid ${accentColor}33` }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor, marginBottom: 12 }}>
          {icon} {title}
        </h2>
        <p style={{ color: ASH, lineHeight: 1.7, maxWidth: 800, marginBottom: 28 }}>{intro}</p>
        {children}
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

export default function IndigenousPeoplesPage() {
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
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            {'\u2190'} Back to Timeline
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
              background: `linear-gradient(135deg, ${TURQUOISE}, ${OCHRE})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            476 Million Voices {'\u2014'} The History and Resilience of Indigenous Peoples
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p style={{ color: ASH, lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 800 }}>
              476 million people. 5,000 distinct cultures. 4,000 living languages. Indigenous
              peoples are not relics of the past {'\u2014'} they are the custodians of humanity's oldest
              living traditions, the protectors of 80% of the world's remaining biodiversity,
              and the survivors of the most sustained campaigns of dispossession in human history.
            </p>
            <p style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 800 }}>
              Their story is not one of passive victimhood. From the great civilizations that
              flourished before European contact to the ongoing fights for land rights, language
              revival, and self-determination, indigenous peoples have maintained, adapted, and
              defended their cultures against centuries of colonialism. This is their history {'\u2014'}
              centering their experiences, their achievements, and their resilience.
            </p>
          </motion.div>
        </header>

        {/* Key statistics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 14,
            marginBottom: 40,
          }}
        >
          {KEY_STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: `1px solid ${s.color}33`,
                borderRadius: 10,
                padding: 16,
                textAlign: 'center',
              }}
            >
              <p style={{ color: s.color, fontWeight: 800, fontSize: '1.3rem', margin: '0 0 4px' }}>
                {s.stat}
              </p>
              <p style={{ color: SLATE, fontSize: '0.78rem', margin: 0, lineHeight: 1.4 }}>
                {s.context}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            backgroundColor: `${EARTH}15`,
            border: `1px solid ${EARTH}33`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 40,
          }}
        >
          <p style={{ color: '#e2e8f0', lineHeight: 1.7, fontSize: '0.95rem', margin: 0, fontStyle: 'italic' }}>
            {'\u201c'}We do not inherit the Earth from our ancestors {'\u2014'} we borrow it from our
            children.{'\u201d'}
          </p>
          <p style={{ color: SLATE, fontSize: '0.85rem', margin: '8px 0 0' }}>
            {'\u2014'} Proverb attributed to multiple indigenous traditions
          </p>
        </motion.div>

        {/* Sections */}

        <SectionWrapper
          id="who-are-indigenous-peoples"
          icon={'\ud83c\udf0d'}
          title="Who Are Indigenous Peoples?"
          accentColor={TURQUOISE}
          intro="Indigenous peoples are those who maintain historical continuity with pre-colonial societies and preserve distinct cultural, social, and political institutions. They are not defined by any single characteristic, but by the intersection of deep historical roots, cultural distinctiveness, and self-identification."
        >
          <InsightGrid items={WHO_INSIGHTS} />
        </SectionWrapper>

        <SectionWrapper
          id="before-columbus"
          icon={'\ud83c\udfdb\ufe0f'}
          title="The Americas Before Columbus"
          accentColor={OCHRE}
          intro="In 1491, the Americas were home to an estimated 60 million people \u2014 some scholars argue more. Far from the 'primitive' stereotype that colonizers projected onto them, the civilizations of the Americas included planned cities larger than European capitals, democratic federations, sophisticated agriculture, and astronomical knowledge rivaling anywhere in the world."
        >
          <InsightGrid items={BEFORE_COLUMBUS} />
        </SectionWrapper>

        <SectionWrapper
          id="demographic-catastrophe"
          icon={'\ud83d\udc80'}
          title="The Demographic Catastrophe"
          accentColor={CRIMSON}
          intro="What happened after 1492 was the largest demographic collapse in human history. Within 150 years of European contact, the indigenous population of the Americas fell by approximately 90%. This was not merely an unfortunate side effect of 'progress' \u2014 it was a catastrophe driven by disease, violence, enslavement, and deliberate dispossession."
        >
          <InsightGrid items={CATASTROPHE_INSIGHTS} />
        </SectionWrapper>

        <SectionWrapper
          id="native-north-america"
          icon={'\ud83e\udd85'}
          title="Native North America Under Colonialism"
          accentColor={TERRACOTTA}
          intro="After surviving the initial disease catastrophe, Native peoples of North America faced centuries of systematic dispossession through forced removal, treaty violations, cultural destruction, and outright massacre. Every single treaty between the United States and Native nations was broken."
        >
          <TimelineCard entries={NORTH_AMERICA_TIMELINE} />
        </SectionWrapper>

        <SectionWrapper
          id="indigenous-australians"
          icon={'\ud83c\udf0f'}
          title="Indigenous Australians"
          accentColor={SAND}
          intro="65,000 years of continuous habitation make Aboriginal Australians the custodians of the world's oldest living culture \u2014 a fact that makes the violence of colonization and the policies of the Stolen Generations all the more devastating."
        >
          <InsightGrid items={AUSTRALIA_INSIGHTS} />
        </SectionWrapper>

        <SectionWrapper
          id="latin-america"
          icon={'\ud83c\udf04'}
          title="Latin American Indigenous Peoples"
          accentColor={SUNSET}
          intro="The Spanish and Portuguese conquests destroyed some of the most sophisticated civilizations on Earth within decades. The colonial systems that followed \u2014 built on forced labor, racial hierarchy, and cultural suppression \u2014 shaped Latin American societies in ways that persist today. Yet 45 million indigenous people continue to maintain their identities, languages, and traditions."
        >
          <InsightGrid items={LATIN_AMERICA_INSIGHTS} />
        </SectionWrapper>

        <SectionWrapper
          id="pacific"
          icon={'\ud83c\udf0a'}
          title="Indigenous Peoples in the Pacific"
          accentColor={SKY}
          intro="From Hawai'i to Aotearoa (New Zealand) to the small island nations threatened by rising seas, Pacific indigenous peoples face distinct challenges \u2014 including the existential threat of climate change destroying homelands that they inhabited for thousands of years."
        >
          <InsightGrid items={PACIFIC_INSIGHTS} />
        </SectionWrapper>

        <SectionWrapper
          id="africa"
          icon={'\ud83c\udf0d'}
          title="Africa's Indigenous Peoples"
          accentColor={GOLD}
          intro="Africa is home to some of humanity's oldest peoples \u2014 the Khoisan, with 150,000 years of genetic continuity, and the San, whose knowledge of their environments represents the longest accumulated wisdom tradition on Earth. Colonial borders carved through their lands remain a source of conflict today."
        >
          <InsightGrid items={AFRICA_INSIGHTS} />
        </SectionWrapper>

        <SectionWrapper
          id="rights-movement"
          icon={'\u270a'}
          title="The Rights Movement and Today"
          accentColor={INDIGO}
          intro="From the occupation of Alcatraz to the UN Declaration on the Rights of Indigenous Peoples, the global indigenous rights movement has transformed the conversation \u2014 but the gap between declarations and reality remains vast. Land rights, language survival, and physical safety remain daily struggles."
        >
          <TimelineCard entries={RIGHTS_TIMELINE} />
          <div style={{ marginTop: 28 }}>
            <InsightGrid items={RIGHTS_INSIGHTS} />
          </div>
        </SectionWrapper>

        <SectionWrapper
          id="resilience"
          icon={'\ud83c\udf31'}
          title="Not Gone \u2014 Living Cultures"
          accentColor={FOREST}
          intro="Indigenous peoples are not museum exhibits or historical footnotes. They are vibrant, living cultures \u2014 adapting, innovating, and fiercely defending their identities. Their survival through centuries of colonialism is not just a testament to endurance; it represents some of humanity's most important knowledge about how to live sustainably on this planet."
        >
          <InsightGrid items={RESILIENCE_INSIGHTS} />
        </SectionWrapper>

        {/* Key Figures */}
        <SectionWrapper
          id="key-figures"
          icon={'\ud83d\udc64'}
          title="Voices of Resistance"
          accentColor={PURPLE}
          intro="From warriors and chiefs to Nobel laureates and environmental defenders, indigenous leaders have shaped history \u2014 often at the cost of their lives."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* Continue the Story */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: 28,
            marginTop: 48,
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 16 }}>
            Continue the Story
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { to: '/slavery', label: 'The History of Slavery' },
              { to: '/decolonization', label: 'Decolonization' },
              { to: '/aztec-empire', label: 'The Aztec Empire' },
              { to: '/inca-empire', label: 'The Inca Empire' },
              { to: '/maya-civilization', label: 'Maya Civilization' },
              { to: '/french-colonial-history', label: 'French Colonial History' },
              { to: '/british-empire', label: 'The British Empire' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: TURQUOISE,
                  textDecoration: 'none',
                  backgroundColor: `${TURQUOISE}15`,
                  border: `1px solid ${TURQUOISE}33`,
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: '0.88rem',
                }}
              >
                {link.label} {'\u2192'}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            marginTop: 56,
            padding: '40px 0 60px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: SLATE,
              fontStyle: 'italic',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto 24px',
            }}
          >
            {'\u201c'}The land is not just soil {'\u2014'} it is a fountain of energy that flows between the
            generations of all living things.{'\u201d'}
            <br />
            <span style={{ fontSize: '0.85rem' }}>{'\u2014'} Oren Lyons, Faithkeeper of the Onondaga Nation</span>
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            {'\u2190'} Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
