import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Theme colours ── */
const TRICOLORE_BLUE = '#2563eb';
const TRICOLORE_RED = '#dc2626';
const GOLD = '#f59e0b';
const EMERALD = '#10b981';
const VIOLET = '#8b5cf6';
const TEAL = '#14b8a6';
const ROSE = '#f43f5e';
const SLATE = '#94a3b8';
const ASH = '#cbd5e1';
const AMBER = '#d97706';
const SKY = '#38bdf8';
const ORANGE = '#f97316';
const BURGUNDY = '#991b1b';
const SAND = '#d4a574';

const FIGURE_COLORS = [TRICOLORE_BLUE, TRICOLORE_RED, GOLD, EMERALD, VIOLET, TEAL, ROSE, AMBER];

/* ── Interfaces ── */
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

/* ── Key Stats ── */
const KEY_STATS: InsightEntry[] = [
  { label: '12 million km²', detail: 'French colonial empire at peak — second only to the British Empire' },
  { label: '$21 billion', detail: 'Equivalent paid by Haiti to France until 1947 — as "reparations" for slaveowners\' lost property' },
  { label: '500,000 killed', detail: 'Algerians killed during the Algerian War of Independence (1954–1962)' },
  { label: '16,000 captured', detail: 'French soldiers at Dien Bien Phu (1954) — end of French Indochina' },
  { label: '500,000 enslaved', detail: 'People in Saint-Domingue (Haiti) by 1789 — France\'s most profitable colony' },
  { label: '9 military bases', detail: 'France still maintains bases in 9 African countries today (Françafrique)' },
];

/* ── First French Empire (1534–1814) ── */
const FIRST_EMPIRE_TIMELINE: TimelineEntry[] = [
  { year: '1534', title: 'Jacques Cartier Explores the St. Lawrence', description: 'Cartier claims Canada for France, beginning French presence in North America. He names the territory "Canada" from the Iroquoian word kanata, meaning "village."', color: TRICOLORE_BLUE },
  { year: '1608', title: 'Champlain Founds Quebec', description: 'Samuel de Champlain establishes Quebec City — the first permanent French settlement in North America. He builds alliances with the Huron-Wendat and Algonquin nations, entering their wars against the Iroquois. The fur trade becomes the economic backbone of New France.', color: TRICOLORE_BLUE },
  { year: '1625–1700', title: 'New France Expands', description: 'French traders, missionaries, and coureurs des bois push deep into the continent, building a network of alliances with indigenous nations. Unlike the British who settled densely, the French relied on trade partnerships and relatively small settler populations.', color: EMERALD },
  { year: '1635–1697', title: 'Caribbean Sugar Islands', description: 'France takes Martinique (1635), Guadeloupe (1635), and western Hispaniola — Saint-Domingue (Haiti, 1697). These sugar islands, worked by hundreds of thousands of enslaved Africans, become France\'s most profitable colonies by far.', color: GOLD },
  { year: '1699–1763', title: 'Louisiana', description: 'France claims the vast Mississippi basin — Louisiana stretches from the Great Lakes to the Gulf of Mexico. But it remains thinly settled. New Orleans, founded in 1718, is the jewel of a largely empty territory.', color: TEAL },
  { year: '1763', title: 'Loss of New France', description: 'The Seven Years\' War (1756–1763) is a catastrophe. Britain takes Canada, and France loses nearly all its North American possessions. Voltaire dismisses the loss as "a few acres of snow." France retains its Caribbean sugar islands — which it values far more.', color: TRICOLORE_RED },
  { year: '1803', title: 'The Louisiana Purchase', description: 'Napoleon, needing money for his European wars and having lost Haiti, sells the entire Louisiana Territory to the United States for $15 million — roughly 4 cents per acre. It doubles the size of the US overnight.', color: AMBER },
];

const SAINT_DOMINGUE_INSIGHTS: InsightEntry[] = [
  { label: 'The Richest Colony in the World', detail: 'By 1789, Saint-Domingue (Haiti) was the single most profitable colony on Earth — producing 40% of Europe\'s sugar and 50% of its coffee. It generated more wealth than all 13 American colonies combined.' },
  { label: '500,000 Enslaved People', detail: 'The sugar economy ran on the labor of half a million enslaved Africans. Conditions were so brutal that the enslaved population could not sustain itself — constant importation of new captives was required to replace those who died.' },
  { label: 'The Code Noir (1685)', detail: 'Louis XIV\'s "Black Code" regulated slavery in French colonies. It required baptism of enslaved people and technically limited punishments — but in practice, plantation owners ignored every protection. The Code\'s real function was to legally define humans as property.' },
  { label: 'Sugar and Slavery', detail: 'Sugar was the oil of the 18th century. French coffee houses, British tea with sugar, the entire European sweet tooth — all of it was built on the backs of enslaved people in Caribbean plantations. Saint-Domingue was the engine of French wealth.' },
];

/* ── Haitian Revolution (1791–1804) ── */
const HAITIAN_REVOLUTION_TIMELINE: TimelineEntry[] = [
  { year: '1791', title: 'The Revolution Begins', description: 'On August 22, enslaved people in Saint-Domingue rise in mass revolt. The Bois Caïman ceremony — a Vodou gathering — sparks the insurrection. Within weeks, a thousand plantations are burning. It is the largest slave uprising since Spartacus.', color: TRICOLORE_RED },
  { year: '1793–1798', title: 'Toussaint Louverture Rises', description: 'Toussaint Louverture, a formerly enslaved man, emerges as a military genius. He defeats Spanish and British forces who try to seize the colony, outmaneuvers French factions, and effectively rules Saint-Domingue. He abolishes slavery and establishes a new constitution.', color: GOLD },
  { year: '1802', title: 'Napoleon Sends 40,000 Soldiers', description: 'Napoleon dispatches his brother-in-law Leclerc with 40,000 troops to re-enslave Haiti. Toussaint is captured through treachery and dies in a French prison. But the resistance continues under Jean-Jacques Dessalines — and yellow fever devastates the French army.', color: BURGUNDY },
  { year: '1804 (Jan 1)', title: 'Haitian Independence', description: 'Jean-Jacques Dessalines declares Haiti independent — the first free Black republic in history, and the only nation born from a successful slave revolution. The news terrifies slaveholding societies from Virginia to Brazil.', color: EMERALD },
];

const HAITIAN_DEBT: InsightEntry[] = [
  { label: '150 Million Francs', detail: 'In 1825, France sends warships to Haiti and demands 150 million francs (later reduced to 90 million) as "reparations" — not to the formerly enslaved, but to the former slaveholders, for the "loss" of their human property.' },
  { label: 'Pay or Be Invaded', detail: 'Haiti, a new nation with no allies, has no choice. It accepts the demand. To pay, Haiti must borrow from French banks — at interest. The debt becomes a trap: Haiti pays to service the debt on the debt it was forced to take on to pay the original extortion.' },
  { label: '$21 Billion in Today\'s Money', detail: 'A 2022 New York Times investigation calculated that Haiti paid the equivalent of $21 billion (in today\'s dollars) to France over 122 years, finally completing payments in 1947. This single debt explains much of Haiti\'s modern poverty.' },
  { label: 'No Apology, No Reparations', detail: 'France has never formally apologized for the debt or discussed reparations to Haiti. When President Aristide demanded repayment in 2003, he was overthrown in a coup shortly after — with French and American involvement.' },
];

/* ── Second French Empire (1830–1962) ── */
const SECOND_EMPIRE_TIMELINE: TimelineEntry[] = [
  { year: '1830', title: 'France Invades Algeria', description: 'France invades Algeria ostensibly over a diplomatic insult (the "fly-whisk incident"). The real motive: domestic politics, imperial prestige, and settler colonialism. It begins 132 years of French rule — the longest and most brutal of all French colonies.', color: TRICOLORE_RED },
  { year: '1854–1895', title: 'West Africa Conquered', description: 'France expands across West Africa — Senegal, Mali, Guinea, Ivory Coast, Burkina Faso, Benin, Niger, and more. General Faidherbe and his successors carve out a vast territory, often through military force against organized African states.', color: AMBER },
  { year: '1858–1887', title: 'Indochina Taken', description: 'France seizes Saigon (1859), gradually conquers all of Vietnam, adds Cambodia (1863) and Laos (1893). French Indochina becomes a major colonial territory, exploited for rubber, rice, and opium revenues.', color: EMERALD },
  { year: '1881–1912', title: 'North Africa Completed', description: 'Tunisia becomes a French protectorate (1881), Morocco follows (1912). With Algeria, France now controls the entire Maghreb — the largest colonial territory in Africa.', color: TRICOLORE_BLUE },
  { year: '1896', title: 'Madagascar Annexed', description: 'France conquers Madagascar after a brief war. The island becomes a colony, with forced labor and land expropriation. France also takes Djibouti, Comoros, and territories across the Pacific.', color: TEAL },
  { year: '1920s', title: 'Empire at Peak', description: 'The French colonial empire reaches 12 million km² — second only to the British. It spans four continents: Africa, Asia, the Americas, and the Pacific. France governs 110 million colonial subjects.', color: GOLD },
];

/* ── Mission Civilisatrice ── */
const MISSION_CIVILISATRICE: InsightEntry[] = [
  { label: 'The "Civilizing Mission"', detail: 'France justified colonialism as a mission to spread Enlightenment values, education, and French culture to "primitive" peoples. Jules Ferry (1884): "The superior races have a right, because they have a duty... to civilize the inferior races."' },
  { label: 'The Reality: Forced Labor', detail: 'The corvée system forced colonized people to work without pay on roads, railways, and plantations. In French West Africa, forced labor built the Congo-Océan railway — an estimated 17,000 workers died during its construction.' },
  { label: 'Cultural Suppression', detail: 'Education was conducted only in French. Local languages were suppressed in schools and government. Indigenous cultural practices were discouraged or banned. The goal was to create "évolués" — Africans and Asians who thought and acted French.' },
  { label: 'Assimilation — A Broken Promise', detail: 'The assimilation policy promised that colonized peoples could become fully French through education and cultural adoption. In practice, full citizenship was almost always withheld. The "Four Communes" of Senegal were a rare exception — most colonial subjects remained subjects, not citizens.' },
  { label: 'Forced Taxation', detail: 'Colonial governments imposed taxes payable only in French currency — forcing subsistence farmers into wage labor on European-owned plantations. This wasn\'t accidental: it was designed to create a dependent labor force for colonial enterprises.' },
  { label: 'Indigénat System', detail: 'The Code de l\'Indigénat (1887) created a separate legal system for colonial subjects — they could be punished without trial for offenses like "disrespect" or failure to pay taxes. French citizens in the same colonies were governed by French law. Colonialism was apartheid before the word existed.' },
];

/* ── Algeria (1830–1962) ── */
const ALGERIA_CONQUEST: InsightEntry[] = [
  { label: 'Systematic Terror', detail: 'General Bugeaud\'s strategy: the razzia. Burn crops, destroy villages, drive populations from their land. Entire communities were smoked out of caves. The goal was not just military victory but the destruction of Algerian society to make room for European settlers.' },
  { label: 'Demographic Catastrophe', detail: 'Algeria\'s population fell from approximately 3 million to 2.1 million in the first 40 years of French rule — a loss of nearly one-third of the population through violence, famine, disease, and displacement.' },
  { label: 'Settler Colonialism', detail: 'By 1962, one million European settlers — the pieds-noirs — lived in Algeria. They owned the best land, controlled the economy, and had full French citizenship. The 9 million Muslim Algerians were subjects with almost no political rights.' },
  { label: 'Land Theft', detail: 'The French systematically confiscated Algerian land. By the 1930s, European settlers — 10% of the population — owned 35% of the arable land, including the most fertile areas. Algerian farmers were pushed onto marginal land or became laborers on their own former property.' },
];

const ALGERIAN_WAR_TIMELINE: TimelineEntry[] = [
  { year: '1945', title: 'Sétif Massacre', description: 'On VE Day, Algerians march for independence. French forces and settler militias respond with mass killings. Estimates range from 6,000 to 45,000 Algerians killed. France celebrates victory in Europe while massacring its colonial subjects.', color: TRICOLORE_RED },
  { year: '1954 (Nov 1)', title: 'FLN Launches the War', description: 'The Front de Libération Nationale (FLN) launches coordinated attacks across Algeria — "Toussaint Rouge" (Red All Saints\' Day). The Algerian War of Independence begins. France sends hundreds of thousands of troops.', color: BURGUNDY },
  { year: '1957', title: 'Battle of Algiers', description: 'French paratroopers use systematic torture — electric shock, waterboarding, rape — to dismantle FLN networks in Algiers. They succeed tactically but create lasting moral damage. The methods are officially documented but denied for decades.', color: TRICOLORE_RED },
  { year: '1958', title: 'De Gaulle Returns to Power', description: 'The Algerian crisis collapses the Fourth Republic. Charles de Gaulle returns as president, initially declaring "Algeria is French." He gradually realizes the war is unwinnable and begins secret negotiations with the FLN.', color: TRICOLORE_BLUE },
  { year: '1961', title: 'Paris Massacre (October 17)', description: 'French police kill an estimated 200+ Algerians during a peaceful protest in Paris. Bodies are thrown into the Seine. The event is covered up for decades — France only officially acknowledged it in 2012.', color: BURGUNDY },
  { year: '1962 (Mar)', title: 'Évian Accords — Independence', description: 'The Évian Accords end the war. Algeria is independent. 500,000 Algerians are dead, 2 million displaced. 1.5 million pieds-noirs flee to France, where they arrive as traumatized refugees. The war leaves wounds that have never fully healed.', color: EMERALD },
];

/* ── Vietnam (1858–1954) ── */
const VIETNAM_TIMELINE: TimelineEntry[] = [
  { year: '1859', title: 'France Takes Saigon', description: 'France seizes Saigon and gradually conquers all of Vietnam. Cambodia (1863) and Laos (1893) follow. French Indochina is born — governed for the profit of French companies and settlers.', color: TRICOLORE_BLUE },
  { year: '1890s–1940s', title: 'Rubber Plantations', description: 'Michelin and other French companies run rubber plantations with forced labor. Conditions are brutal: workers are beaten, underfed, and die in large numbers. Vietnamese call the plantations "hell on earth." Michelin\'s Vietnamese plantations become a symbol of colonial exploitation.', color: BURGUNDY },
  { year: '1919', title: 'Ho Chi Minh at Versailles', description: 'A young Ho Chi Minh, then known as Nguyễn Ái Quốc, tries to petition Woodrow Wilson at the Paris Peace Conference for Vietnamese self-determination. He is ignored. The experience radicalizes him — he turns to communism as the only ideology willing to support colonial liberation.', color: AMBER },
  { year: '1945 (Sep 2)', title: 'Vietnam Declares Independence', description: 'Ho Chi Minh declares Vietnamese independence in Hanoi, quoting the American Declaration of Independence: "All men are created equal." He appeals directly to the US for support against French re-colonization. The US, prioritizing Cold War alliances, sides with France.', color: EMERALD },
  { year: '1946–1954', title: 'First Indochina War', description: 'France refuses to grant independence. War erupts. The Viet Minh, led by General Vo Nguyen Giap, wage guerrilla war across Vietnam. France pours in troops and American money — the US funds 80% of France\'s war costs by 1954.', color: TRICOLORE_RED },
  { year: '1954 (May 7)', title: 'Battle of Dien Bien Phu', description: 'The Viet Minh besiege the French garrison at Dien Bien Phu for 57 days. 16,000 French soldiers are captured. It is the most decisive colonial defeat since Yorktown. France\'s empire in Asia is finished.', color: GOLD },
  { year: '1954 (Jul)', title: 'Geneva Accords', description: 'Vietnam is temporarily divided at the 17th parallel pending elections. The elections never happen. The US steps into France\'s role, beginning two decades of American involvement that will end in the same result — Vietnamese victory.', color: TEAL },
];

/* ── Decolonization ── */
const DECOLONIZATION: InsightEntry[] = [
  { label: 'France Fought to Keep Its Empire', detail: 'Unlike Britain, which (often reluctantly) negotiated transitions, France fought bloody wars to maintain control. The Algerian and Indochina wars cost hundreds of thousands of lives and ultimately failed. France\'s refusal to accept decolonization made the process far more violent than it needed to be.' },
  { label: '1960: "Year of Africa"', detail: 'In a single year, 14 French colonies in West and Central Africa gained independence — often through negotiated transitions rather than war. Senegal, Mali, Ivory Coast, Cameroon, Congo, and others became sovereign nations. But independence came with strings attached.' },
  { label: 'Françafrique', detail: 'After independence, France maintained military, economic, and political influence in its former colonies through a system known as "Françafrique." France propped up friendly dictators, intervened militarily when they were threatened, and ensured French companies maintained privileged access to resources.' },
  { label: 'Military Interventions', detail: 'France has intervened militarily in Africa over 50 times since 1960. From propping up dictators in Chad and Central African Republic to operations in Mali and Libya. French special forces were present at the assassination of Burkina Faso\'s Thomas Sankara in 1987.' },
  { label: 'The CFA Franc', detail: 'Created in 1945, the CFA franc is used by 14 African countries. These nations must deposit 50% of their foreign exchange reserves with the French Treasury. France effectively controls monetary policy for 180 million people — a financial arrangement with no parallel in modern history.' },
];

/* ── Legacy Today ── */
const LEGACY_TODAY: InsightEntry[] = [
  { label: 'CFA Franc Zone', detail: '14 countries in West and Central Africa still use the CFA franc, pegged first to the French franc and now to the euro. France influences monetary policy for 180 million people. Critics call it "monetary colonialism" — defenders say it provides stability.' },
  { label: 'French Military Presence', detail: 'France maintains military bases in 9 African countries: Senegal, Ivory Coast, Gabon, Djibouti, Chad, Niger, Burkina Faso, Mali, and Central African Republic. Recently, anti-French sentiment has led to expulsions from Mali (2022), Burkina Faso (2023), and Niger (2023).' },
  { label: 'Immigration and Social Tension', detail: 'Millions of people from former French colonies live in France. The banlieues (suburbs) where many settle face poverty, discrimination, and police violence. The 2005 riots, the Yellow Vests movement, and ongoing protests all carry echoes of colonial history.' },
  { label: 'Memorialization', detail: 'France only began legally acknowledging Algerian War crimes in 2018. The 1961 Paris massacre of Algerians was not officially recognized until 2012. The torture debate — whether France systematically used torture in Algeria — remains politically charged.' },
  { label: '280 Million Francophones', detail: 'French is spoken by 280 million people worldwide and is an official language in 29 countries. It is the fastest-growing language in Africa. By 2050, an estimated 700 million people will speak French — most of them in Africa.' },
  { label: 'The Reparations Question', detail: 'Haiti\'s $21 billion debt to France. Algeria\'s demand for acknowledgment of colonial crimes. Growing movements across Francophone Africa demanding the end of the CFA franc and French military presence. The colonial past is not past — it is an active political issue.' },
];

/* ── Key Figures ── */
const KEY_FIGURES: FigureEntry[] = [
  { name: 'Samuel de Champlain', years: '1567–1635', contribution: 'Founded Quebec (1608), the "Father of New France." Built alliances with indigenous nations and established the fur trade network that sustained the colony for 150 years.' },
  { name: 'Toussaint Louverture', years: '1743–1803', contribution: 'Former enslaved person who became the leader of the Haitian Revolution. Military genius who defeated French, Spanish, and British armies. Captured through treachery, died in a French prison. Called "the Black Napoleon."' },
  { name: 'Jean-Jacques Dessalines', years: '1758–1806', contribution: 'Declared Haitian independence on January 1, 1804, creating the first free Black republic. A formerly enslaved person who fought under Toussaint and finished what he started.' },
  { name: 'Ho Chi Minh', years: '1890–1969', contribution: 'Vietnamese communist nationalist who spent years in Paris, petitioned Wilson at Versailles (1919), declared independence quoting the US Declaration. Led Vietnam through two wars of liberation — against France and the United States.' },
  { name: 'General Vo Nguyen Giap', years: '1911–2013', contribution: 'Self-taught military strategist who defeated both France (Dien Bien Phu, 1954) and the United States. One of the greatest guerrilla commanders in military history.' },
  { name: 'Frantz Fanon', years: '1925–1961', contribution: 'Martinique-born psychiatrist and revolutionary who joined the FLN in Algeria. His books — "Black Skin, White Masks" and "The Wretched of the Earth" — became foundational texts for decolonization movements worldwide.' },
  { name: 'Aimé Césaire', years: '1913–2008', contribution: 'Martinican poet, politician, and founder of the Négritude movement. His "Discourse on Colonialism" (1950) is one of the most powerful indictments of European colonialism ever written.' },
  { name: 'Abdelkader El Djezairi', years: '1808–1883', contribution: 'Led Algerian resistance against the French invasion for 15 years (1832–1847). Built a proto-state in western Algeria before being defeated by France\'s overwhelming military force.' },
];

/* ── Sub-components ── */

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
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          style={{ borderLeft: `3px solid ${e.color}`, paddingLeft: 18, paddingTop: 4, paddingBottom: 4 }}
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 18 }}
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

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {figures.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${FIGURE_COLORS[i % FIGURE_COLORS.length]}33`, borderRadius: 10, padding: 18 }}
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

/* ── Callout Box ── */
function CalloutBox({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: `${color}08`,
        border: `2px solid ${color}44`,
        borderRadius: 12,
        padding: 24,
        marginTop: 20,
        marginBottom: 8,
      }}
    >
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color, marginBottom: 12 }}>
        {title}
      </h3>
      <div style={{ color: ASH, lineHeight: 1.8, fontSize: '0.95rem' }}>
        {children}
      </div>
    </motion.div>
  );
}

/* ── Main Component ── */

export default function FrenchColonialHistoryPage() {
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
    <div style={{ minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* Back link */}
        <div style={{ paddingTop: 28 }}>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            &larr; Back to Timeline
          </Link>
        </div>

        {/* ── Hero ── */}
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
              background: `linear-gradient(135deg, ${TRICOLORE_BLUE}, ${TRICOLORE_RED})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Libert&eacute;, &Eacute;galit&eacute;&hellip; For Whom? &mdash; French Colonial History (1534&ndash;1962)
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <p style={{ color: ASH, lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 800, marginBottom: 16 }}>
              From Caribbean sugar islands to the jungles of Indochina, from the Sahara to the Pacific &mdash;
              France built the world&rsquo;s second-largest empire under the banner of a &ldquo;civilizing mission.&rdquo;
              It enslaved half a million people to sweeten Europe&rsquo;s coffee. It fought two devastating wars
              to keep colonies that didn&rsquo;t want to be kept. And when the empire finally fell, it left behind
              a web of military bases, monetary control, and political influence that persists to this day.
            </p>
            <p style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 800 }}>
              This is the story of how enslaved people in Haiti defeated Napoleon&rsquo;s army and then
              were forced to pay their former masters $21 billion for the privilege of freedom &mdash;
              how France tortured its way through Algeria and lost anyway &mdash; and how Ho Chi Minh
              quoted Jefferson, was ignored, and defeated two empires.
            </p>
          </motion.div>
        </header>

        {/* ── Key Stats Bar ── */}
        <section style={{ paddingBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {KEY_STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                style={{
                  backgroundColor: 'rgba(37,99,235,0.06)',
                  border: `1px solid ${TRICOLORE_BLUE}33`,
                  borderRadius: 10,
                  padding: '14px 18px',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: TRICOLORE_BLUE, fontWeight: 700, fontSize: '1.2rem', marginBottom: 4 }}>
                  {stat.label}
                </p>
                <p style={{ color: ASH, fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {stat.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── First French Empire ── */}
        <SectionWrapper
          id="first-empire"
          icon="&#x1F6F6;"
          title="The First French Empire (1534–1814)"
          accentColor={TRICOLORE_BLUE}
          intro="France's first empire stretched from the snows of Quebec to the sugarcane fields of Haiti. New France was vast but thinly settled — a network of fur traders, missionaries, and indigenous allies spread across half a continent. But the real wealth was in the Caribbean, where enslaved Africans produced the sugar and coffee that made France rich."
        >
          <TimelineCard entries={FIRST_EMPIRE_TIMELINE} />
        </SectionWrapper>

        {/* ── Saint-Domingue Callout ── */}
        <SectionWrapper
          id="saint-domingue"
          icon="&#x1F3DD;&#xFE0F;"
          title="Saint-Domingue — The Richest Colony on Earth"
          accentColor={GOLD}
          intro="By 1789, the French colony of Saint-Domingue (modern Haiti) was the single most profitable piece of real estate on the planet. It produced more wealth than all 13 American colonies combined. This wealth was built entirely on the labor of 500,000 enslaved Africans living and dying in conditions so brutal that the population could never sustain itself."
        >
          <InsightGrid items={SAINT_DOMINGUE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Haitian Revolution ── */}
        <SectionWrapper
          id="haitian-revolution"
          icon="&#x1F525;"
          title="The Haitian Revolution (1791–1804) — The Only Successful Slave Revolution in History"
          accentColor={TRICOLORE_RED}
          intro="What happened in Haiti between 1791 and 1804 has no parallel in human history. Half a million enslaved people rose up, defeated the armies of three European empires — France, Spain, and Britain — and created the first free Black republic in the world. It terrified every slaveholding society on Earth. And then France made Haiti pay for its own freedom."
        >
          <TimelineCard entries={HAITIAN_REVOLUTION_TIMELINE} />
          <CalloutBox title="The $21 Billion Ransom — Haiti's 'Debt' to France" color={ROSE}>
            <InsightGrid items={HAITIAN_DEBT} />
          </CalloutBox>
        </SectionWrapper>

        {/* ── Second French Empire ── */}
        <SectionWrapper
          id="second-empire"
          icon="&#x1F30D;"
          title="The Second French Empire (1830–1962)"
          accentColor={AMBER}
          intro="Having lost most of its first empire, France built a second one — even larger. Beginning with the invasion of Algeria in 1830, France conquered vast territories across Africa, Southeast Asia, and the Pacific. At its peak in the 1920s, the French empire covered 12 million square kilometres and governed 110 million people. It was the second-largest empire in history."
        >
          <TimelineCard entries={SECOND_EMPIRE_TIMELINE} />
        </SectionWrapper>

        {/* ── Mission Civilisatrice ── */}
        <SectionWrapper
          id="mission-civilisatrice"
          icon="&#x1F4DC;"
          title='The "Mission Civilisatrice" — The Ideology of Empire'
          accentColor={VIOLET}
          intro='France justified its empire with an idea: the "mission civilisatrice" — the civilizing mission. France wasn\'t conquering peoples, it was enlightening them. It wasn\'t exploiting, it was educating. The reality was forced labor, cultural destruction, and a two-tier legal system in which the colonized were subjects, never citizens.'
        >
          <InsightGrid items={MISSION_CIVILISATRICE} />
        </SectionWrapper>

        {/* ── Algeria ── */}
        <SectionWrapper
          id="algeria"
          icon="&#x1F3F4;"
          title="Algeria (1830–1962) — France's Most Brutal Colony"
          accentColor={SAND}
          intro="Algeria was not just a colony — it was legally part of France. Three départements, as French as Paris in law. In practice, it was a settler state where one million Europeans ruled nine million Arabs and Berbers through land theft, legal discrimination, and — when challenged — systematic violence. The Algerian War of Independence (1954–1962) was one of the bloodiest decolonization struggles in history."
        >
          <InsightGrid items={ALGERIA_CONQUEST} />
          <div style={{ marginTop: 32 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
            >
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: TRICOLORE_RED, marginBottom: 16 }}>
                The Algerian War of Independence (1954&ndash;1962)
              </h3>
            </motion.div>
            <TimelineCard entries={ALGERIAN_WAR_TIMELINE} />
          </div>
        </SectionWrapper>

        {/* ── Vietnam ── */}
        <SectionWrapper
          id="vietnam"
          icon="&#x1F33F;"
          title="Vietnam (1858–1954) — From Colony to Superpower's Graveyard"
          accentColor={EMERALD}
          intro="France conquered Vietnam for rubber, rice, and prestige. It held it through forced labor and cultural suppression. When a Vietnamese nationalist quoted Jefferson to declare independence, France chose war — and lost. The defeat at Dien Bien Phu ended French Indochina and led directly to American involvement in the same unwinnable war."
        >
          <TimelineCard entries={VIETNAM_TIMELINE} />
        </SectionWrapper>

        {/* ── Decolonization ── */}
        <SectionWrapper
          id="decolonization"
          icon="&#x1F5F3;&#xFE0F;"
          title="Decolonization and Françafrique (1945–Present)"
          accentColor={SKY}
          intro="France's empire didn't end with independence. Through a system known as Françafrique, France maintained military bases, controlled currencies, propped up dictators, and extracted resources from its former colonies for decades after they became sovereign nations. The colonial relationship was redesigned, not dissolved."
        >
          <InsightGrid items={DECOLONIZATION} />
        </SectionWrapper>

        {/* ── Key Figures ── */}
        <SectionWrapper
          id="figures"
          icon="&#x1F464;"
          title="Key Figures of French Colonial History"
          accentColor={GOLD}
          intro="From the explorer who founded Quebec to the psychiatrist who theorized decolonization, these are the people who shaped — and fought — France's colonial empire."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Legacy Today ── */}
        <SectionWrapper
          id="legacy"
          icon="&#x1F30D;"
          title="Legacy — The Empire That Never Quite Ended"
          accentColor={ORANGE}
          intro="The French colonial empire officially ended decades ago. But its structures persist: military bases across Africa, monetary control through the CFA franc, millions of immigrants from former colonies living as second-class citizens in French suburbs, and a reparations debate that France refuses to have. The colonial past is not past."
        >
          <InsightGrid items={LEGACY_TODAY} />
        </SectionWrapper>

        {/* ── Connection Links ── */}
        <section style={{ padding: '32px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
              Explore Connected History
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                { to: '/slavery', label: 'History of Slavery' },
                { to: '/decolonization', label: 'Decolonization' },
                { to: '/french-revolution', label: 'The French Revolution' },
                { to: '/vietnam-war', label: 'The Vietnam War' },
                { to: '/haitian-revolution', label: 'The Haitian Revolution' },
                { to: '/spanish-empire', label: 'The Spanish Empire' },
              ].map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  style={{
                    color: TRICOLORE_BLUE,
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    padding: '8px 16px',
                    border: `1px solid ${TRICOLORE_BLUE}44`,
                    borderRadius: 8,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${TRICOLORE_BLUE}15`)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {link.label} &rarr;
                </Link>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px 0 48px', marginTop: 24, textAlign: 'center' }}>
          <p style={{ color: SLATE, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 20px', fontStyle: 'italic' }}>
            &ldquo;We revolt simply because, for many reasons, we can no longer breathe.&rdquo; &mdash; Frantz Fanon, <em>The Wretched of the Earth</em> (1961)
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            &larr; Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
