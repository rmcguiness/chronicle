/**
 * ColonialismPage — curated topic page: Colonialism, Empire & Decolonization.
 *
 * Route: /colonialism
 *
 * Sections:
 *  1. Hero — "The Age of Empires — Colonialism and Its Long Shadow"
 *  2. Filter bar — empire region filters
 *  3. Colonial Empires at Peak — 8 empires with territory + impact data
 *  4. Methods of Colonialism — 6 systematic exploitation methods
 *  5. Resistance Movements — 10 chronological resistance events
 *  6. Decolonization Wave — decade-by-decade independence timeline
 *  7. Legacy Today — 4 lasting impact categories
 *
 * All data is static/curated — no backend API needed.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type EmpireRegion = 'Americas' | 'Africa' | 'Asia' | 'Pacific' | 'Global';

interface ColonialEmpire {
  name: string;
  period: string;
  territory: string;
  regions: EmpireRegion[];
  keyHoldings: string;
  impact: string;
  deathToll?: string;
  color: string;
  icon: string;
}

interface ColonialMethod {
  name: string;
  icon: string;
  examples: string;
  description: string;
  color: string;
}

interface ResistanceMovement {
  name: string;
  period: string;
  location: string;
  description: string;
  significance: string;
  icon: string;
  color: string;
  slug?: string;
}

interface DecolonizationDecade {
  decade: string;
  count: number;
  highlight?: string;
  examples: string[];
  color: string;
}

interface LegacyCategory {
  title: string;
  icon: string;
  color: string;
  summary: string;
  details: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const COLONIAL_EMPIRES: ColonialEmpire[] = [
  {
    name: 'Spanish Empire',
    period: '1492\u20131898',
    territory: '13.7M km\u00B2',
    regions: ['Americas', 'Asia'],
    keyHoldings: 'Americas (Mexico, Peru, Caribbean, Central America, much of South America), Philippines, parts of North Africa',
    impact: 'First European empire in the Americas. Extraction of silver and gold from Potos\u00ED and Mexican mines funded European wars and global trade. The encomienda and mita systems forced Indigenous labor. Spanish became the world\'s second-most spoken native language.',
    deathToll: '~8M Indigenous deaths in first century from disease, forced labor, and violence',
    color: '#ef4444',
    icon: '\u{1F1EA}\u{1F1F8}',
  },
  {
    name: 'Portuguese Empire',
    period: '1415\u20131999',
    territory: '10.4M km\u00B2',
    regions: ['Americas', 'Africa', 'Asia'],
    keyHoldings: 'Brazil, Angola, Mozambique, Goa (India), Macau (China), East Timor, Cape Verde',
    impact: 'The first global maritime empire. Pioneered the Atlantic slave trade, transporting an estimated 5.8 million Africans to Brazil alone. Established trade posts across Africa, India, and Southeast Asia. The longest-lasting colonial empire \u2014 Macau was returned to China in 1999.',
    color: '#22c55e',
    icon: '\u{1F1F5}\u{1F1F9}',
  },
  {
    name: 'British Empire',
    period: '1583\u20131997',
    territory: '35.5M km\u00B2',
    regions: ['Americas', 'Africa', 'Asia', 'Pacific', 'Global'],
    keyHoldings: 'India, Australia, Canada, South Africa, Kenya, Nigeria, Hong Kong, Egypt, Jamaica, and dozens more',
    impact: 'The largest empire in history \u2014 at its peak, the "sun never set" on British territory. Controlled a quarter of the world\'s land and population. India was the "jewel in the crown" \u2014 its wealth extraction deindustrialized the subcontinent. Imposed the English language, common law, and parliamentary systems that persist worldwide.',
    color: '#3b82f6',
    icon: '\u{1F1EC}\u{1F1E7}',
  },
  {
    name: 'French Empire',
    period: '1534\u20131962',
    territory: '11.5M km\u00B2',
    regions: ['Africa', 'Asia', 'Americas'],
    keyHoldings: 'West & North Africa (Algeria, Senegal, Mali, C\u00F4te d\'Ivoire), Indochina (Vietnam, Laos, Cambodia), Caribbean (Haiti, Guadeloupe, Martinique)',
    impact: 'Second-largest colonial empire. France\'s "civilizing mission" (mission civilisatrice) imposed French language, legal codes, and culture across Africa and Southeast Asia. Algeria was considered an integral part of France, making its independence war (1954\u20131962) especially brutal. France still maintains significant economic influence in former colonies via the CFA franc.',
    color: '#a855f7',
    icon: '\u{1F1EB}\u{1F1F7}',
  },
  {
    name: 'Dutch Empire',
    period: '1602\u20131975',
    territory: '5.5M km\u00B2',
    regions: ['Asia', 'Africa', 'Americas'],
    keyHoldings: 'Indonesia (Dutch East Indies), South Africa (Cape Colony), Suriname, Cura\u00E7ao, parts of Brazil, Sri Lanka',
    impact: 'Built on the world\'s first multinational corporation \u2014 the Dutch East India Company (VOC). Monopolized the spice trade through violence and forced cultivation (cultuurstelsel) in Java. The Dutch traded Manhattan to England for a nutmeg island (Run). Apartheid South Africa was founded by Dutch settlers (Boers).',
    color: '#f97316',
    icon: '\u{1F1F3}\u{1F1F1}',
  },
  {
    name: 'Belgian Congo',
    period: '1885\u20131960',
    territory: '2.3M km\u00B2',
    regions: ['Africa'],
    keyHoldings: 'Congo Free State (personal colony of Leopold II), later Belgian Congo, Rwanda-Urundi',
    impact: 'Perhaps the most brutal colonial regime in history. King Leopold II\'s personal colony extracted rubber through a system of forced labor, hostage-taking, and mutilation \u2014 soldiers cut off hands to prove they hadn\'t wasted ammunition. International outcry from E.D. Morel and Roger Casement eventually forced Belgium to take over the colony in 1908.',
    deathToll: '~10M Congolese deaths under Leopold II\'s rubber terror (1885\u20131908)',
    color: '#eab308',
    icon: '\u{1F1E7}\u{1F1EA}',
  },
  {
    name: 'German Colonial Empire',
    period: '1884\u20131919',
    territory: '2.6M km\u00B2',
    regions: ['Africa', 'Pacific'],
    keyHoldings: 'German East Africa (Tanzania), German South-West Africa (Namibia), Kamerun (Cameroon), Togoland, Pacific islands (Samoa, New Guinea)',
    impact: 'Though short-lived, Germany\'s colonial record includes the first genocide of the 20th century \u2014 the extermination of the Herero and Nama peoples in South-West Africa (1904\u20131908). General Lothar von Trotha issued an explicit extermination order. An estimated 65,000 Herero (80% of the population) and 10,000 Nama were killed. Germany formally recognized the genocide in 2021.',
    deathToll: '~75,000 Herero and Nama killed in genocide (1904\u20131908)',
    color: '#64748b',
    icon: '\u{1F1E9}\u{1F1EA}',
  },
  {
    name: 'Japanese Empire',
    period: '1895\u20131945',
    territory: '7.4M km\u00B2',
    regions: ['Asia', 'Pacific'],
    keyHoldings: 'Korea, Taiwan, Manchuria (Manchukuo), parts of China, Philippines, Indochina, Indonesia, Burma, Pacific Islands',
    impact: 'The only major non-European colonial empire. Japan\'s rapid modernization (Meiji Restoration, 1868) fueled imperial ambitions framed as "liberating" Asia from Western colonialism under the "Greater East Asia Co-Prosperity Sphere." In reality, Japan imposed brutal occupation: forced labor, comfort women, the Nanjing Massacre (1937), and harsh assimilation policies in Korea and Taiwan.',
    color: '#ec4899',
    icon: '\u{1F1EF}\u{1F1F5}',
  },
];

const COLONIAL_METHODS: ColonialMethod[] = [
  {
    name: 'Resource Extraction',
    icon: '\u26CF\uFE0F',
    examples: 'Silver (Potos\u00ED), cotton (India/Egypt), rubber (Congo/Amazon), palm oil (West Africa), diamonds (South Africa), tea (India/Ceylon)',
    description: 'Colonies existed primarily to extract wealth for the metropole. Raw materials flowed out; finished goods flowed back in at marked-up prices. India\'s share of world GDP fell from 24.4% in 1700 to 4.2% by 1950 under British extraction. The "drain of wealth" theory estimates Britain extracted $45 trillion from India over 173 years.',
    color: '#f97316',
  },
  {
    name: 'Forced Labor',
    icon: '\u26D3\uFE0F',
    examples: 'Atlantic slave trade (12.5M transported), corv\u00E9e labor (French Africa), mita system (Spanish Americas), indentured servitude (Indian workers in Caribbean/Fiji)',
    description: 'Colonial economies depended on coerced labor systems ranging from outright slavery to legally mandated unpaid work. The Atlantic slave trade (1500s\u20131800s) forcibly transported 12.5 million Africans to the Americas. After abolition, colonial powers replaced slavery with indentured servitude, importing workers from India and China under exploitative contracts.',
    color: '#ef4444',
  },
  {
    name: 'Cultural Erasure',
    icon: '\u{1F4DA}',
    examples: 'Residential schools (Canada/Australia), language bans (Korea under Japan, Welsh under England), forced name changes, missionary conversion campaigns',
    description: 'Colonizers systematically suppressed indigenous languages, religions, and cultural practices. In Canada and Australia, Indigenous children were forcibly removed from families and sent to residential/mission schools where they were forbidden to speak their languages. Japan banned the Korean language in schools. France insisted on French-only education across Africa.',
    color: '#a855f7',
  },
  {
    name: 'Land Seizure',
    icon: '\u{1F3D7}\uFE0F',
    examples: 'Terra nullius (Australia), enclosure (Kenya White Highlands), Native American removal (Trail of Tears), Zionist settlement (Palestine)',
    description: 'Colonial powers seized land through legal fictions like terra nullius ("nobody\'s land"), declaring inhabited territories empty to justify settlement. In Kenya, the British designated the fertile highlands for white settlers, displacing Kikuyu communities. In Australia, terra nullius wasn\'t overturned until the Mabo decision of 1992.',
    color: '#22c55e',
  },
  {
    name: 'Divide and Rule',
    icon: '\u{1F9E9}',
    examples: 'Hutu/Tutsi classification (Rwanda), Hindu-Muslim tensions (India), Igbo/Yoruba/Hausa divisions (Nigeria), Sinhalese/Tamil (Sri Lanka)',
    description: 'Colonial administrations deliberately amplified or invented ethnic, religious, and tribal divisions to prevent unified resistance. Belgium classified Rwandans as Hutu or Tutsi based on physical measurements, creating rigid categories from fluid identities \u2014 a division that culminated in the 1994 genocide. Britain exploited Hindu-Muslim tensions to justify continued rule in India.',
    color: '#ec4899',
  },
  {
    name: 'Unequal Treaties',
    icon: '\u{1F4DC}',
    examples: 'Treaty of Nanjing (1842), Treaty of Kanagawa (1854), Berlin Conference (1884\u20131885), Capitulations in Ottoman Empire',
    description: 'Military force or the threat of it compelled weaker states to sign treaties granting extraordinary privileges to colonial powers. China\'s "century of humiliation" (1839\u20131949) began with the Opium Wars, which forced China to cede Hong Kong, open ports to foreign trade, and grant extraterritorial rights. The Berlin Conference partitioned Africa without African participation.',
    color: '#3b82f6',
  },
];

const RESISTANCE_MOVEMENTS: ResistanceMovement[] = [
  {
    name: 'Haitian Revolution',
    period: '1791\u20131804',
    location: 'Haiti (Saint-Domingue)',
    description: 'The only fully successful slave revolt in history. Enslaved Africans in the French colony of Saint-Domingue rose up, defeated Napoleon\'s army, and established the first Black republic. Led by Toussaint Louverture and Jean-Jacques Dessalines, it was the largest slave uprising since Spartacus.',
    significance: 'Proved enslaved people could overthrow colonial powers militarily. Inspired abolition movements worldwide. France forced Haiti to pay 150M francs in "reparations" to former slaveholders \u2014 a debt that crippled the nation\'s economy until 1947.',
    icon: '\u{1F5E1}\uFE0F',
    color: '#ef4444',
  },
  {
    name: 'Indian Rebellion of 1857',
    period: '1857\u20131858',
    location: 'India',
    description: 'Also called the "Sepoy Mutiny" by the British or the "First War of Independence" by Indians. Indian soldiers (sepoys) in the British East India Company army revolted over greased cartridges (rumored to use pig and cow fat, offending both Muslims and Hindus). The rebellion spread across northern India, threatening British control.',
    significance: 'Led to the dissolution of the East India Company and direct British Crown rule (the Raj). Marked the beginning of organized anti-colonial consciousness in India. British reprisals were extraordinarily brutal \u2014 rebels were tied to cannon muzzles and blown apart.',
    icon: '\u{1F525}',
    color: '#f97316',
  },
  {
    name: 'Zulu Resistance',
    period: '1879',
    location: 'South Africa (Zululand)',
    description: 'The Zulu Kingdom under King Cetshwayo defeated a British force of 1,800 soldiers at the Battle of Isandlwana \u2014 the worst defeat the British army suffered against an indigenous force armed primarily with spears and shields. The Zulus exploited terrain and superior numbers to annihilate the column.',
    significance: 'Shattered the myth of European military invincibility in Africa. Though the British eventually conquered Zululand, Isandlwana became a symbol of African martial capability and resistance. The battle forced Britain to commit far more resources to southern African campaigns.',
    icon: '\u{1F6E1}\uFE0F',
    color: '#22c55e',
  },
  {
    name: 'Philippine-American War',
    period: '1899\u20131902',
    location: 'Philippines',
    description: 'After Spain ceded the Philippines to the US, Filipino independence fighters under Emilio Aguinaldo resisted American occupation. The US deployed 126,000 troops in a brutal counterinsurgency campaign involving concentration camps ("reconcentration zones"), water torture, and scorched-earth tactics.',
    significance: 'Exposed American imperialism\'s contradictions \u2014 a republic founded on liberty was suppressing another people\'s independence. An estimated 200,000\u20131,000,000 Filipino civilians died. Mark Twain and the Anti-Imperialist League vocally opposed the war.',
    icon: '\u2694\uFE0F',
    color: '#3b82f6',
  },
  {
    name: 'Indian Independence Movement',
    period: '1915\u20131947',
    location: 'India',
    description: 'Mohandas Gandhi\'s campaign of nonviolent civil disobedience (satyagraha) mobilized millions against British rule. Key moments: the Salt March (1930), Quit India Movement (1942), and the Indian National Congress\'s decades-long political struggle. Jawaharlal Nehru, Subhas Chandra Bose, and B.R. Ambedkar also played crucial roles.',
    significance: 'Achieved independence for the world\'s most populous colony. Gandhi\'s methods inspired civil rights movements globally (MLK, Mandela). Partition in 1947 created India and Pakistan amid horrific communal violence \u2014 1\u20132 million killed, 15 million displaced.',
    icon: '\u{1F54A}\uFE0F',
    color: '#14b8a6',
    slug: 'indian-independence',
  },
  {
    name: 'African Independence Wave',
    period: '1957\u20131975',
    location: 'Sub-Saharan Africa',
    description: 'Beginning with Ghana\'s independence under Kwame Nkrumah in 1957, African nations achieved independence in rapid succession. Key leaders: Jomo Kenyatta (Kenya, 1963), Julius Nyerere (Tanzania, 1961), L\u00E9opold S\u00E9dar Senghor (Senegal, 1960), Patrice Lumumba (Congo, 1960 \u2014 assassinated with CIA/Belgian involvement). 1960 was the "Year of Africa" with 17 nations gaining independence.',
    significance: 'Transformed the political map of Africa. However, many new nations inherited arbitrary colonial borders, weak institutions, and economies designed for extraction. Cold War superpowers competed for influence, often backing dictators. Lumumba\'s assassination became a symbol of neocolonial interference.',
    icon: '\u2728',
    color: '#eab308',
  },
  {
    name: 'Algerian War of Independence',
    period: '1954\u20131962',
    location: 'Algeria',
    description: 'One of the most violent decolonization struggles. The Front de Lib\u00E9ration Nationale (FLN) waged guerrilla war against France, which considered Algeria an integral part of metropolitan France \u2014 not a colony. France deployed 400,000 troops and used systematic torture. The Battle of Algiers (1957) became a textbook case of urban guerrilla warfare.',
    significance: 'Between 300,000 and 1.5 million Algerians killed. Nearly 1 million European settlers (pieds-noirs) fled to France. The war toppled the French Fourth Republic and brought de Gaulle to power. Algeria\'s independence in 1962 signaled the end of European colonial empires in North Africa.',
    icon: '\u{1F4A5}',
    color: '#a855f7',
  },
  {
    name: 'Vietnamese Independence Wars',
    period: '1945\u20131975',
    location: 'Vietnam',
    description: 'Ho Chi Minh declared Vietnamese independence in 1945, quoting the US Declaration of Independence. France attempted to reassert control, leading to the First Indochina War (1946\u20131954) ending in French defeat at Dien Bien Phu. The US then intervened, escalating into the Vietnam War (1955\u20131975) \u2014 one of the Cold War\'s deadliest conflicts.',
    significance: 'Combined anti-colonial and anti-imperialist struggle over three decades. 2\u20133 million Vietnamese, 58,000 Americans killed. US used 20 million gallons of Agent Orange. French and American defeats proved that technologically superior powers could be defeated by determined guerrilla movements. Inspired anti-colonial movements worldwide.',
    icon: '\u{1F343}',
    color: '#22c55e',
  },
  {
    name: 'Anti-Apartheid Movement',
    period: '1960\u20131994',
    location: 'South Africa',
    description: 'Resistance to South Africa\'s apartheid system \u2014 racial segregation enforced by law from 1948 to 1994. The African National Congress (ANC), led by Nelson Mandela, Oliver Tambo, and Walter Sisulu, organized strikes, boycotts, and armed resistance. The 1960 Sharpeville massacre (69 killed) and 1976 Soweto uprising galvanized international solidarity.',
    significance: 'Global boycotts, divestment campaigns, and sanctions eventually helped end apartheid. Mandela\'s 27-year imprisonment and subsequent presidency (1994) became the defining story of anti-colonial justice. South Africa\'s Truth and Reconciliation Commission offered a model for post-conflict societies worldwide.',
    icon: '\u270A',
    color: '#ec4899',
  },
  {
    name: 'Mau Mau Uprising',
    period: '1952\u20131960',
    location: 'Kenya',
    description: 'Kikuyu fighters, known as the Mau Mau, waged an armed insurgency against British colonial rule in Kenya. They fought primarily over land grievances \u2014 white settlers controlled the fertile "White Highlands." Britain responded with detention camps holding over 1.5 million Kenyans, systematic torture, forced village removals, and aerial bombing.',
    significance: 'Despite military defeat, the uprising made continued British rule untenable. Kenya gained independence in 1963. In 2013, the British government formally acknowledged abuse and paid \u00A319.9 million in compensation to survivors. The uprising revealed the violence at the heart of "benevolent" British colonialism.',
    icon: '\u{1F30D}',
    color: '#f59e0b',
  },
];

const DECOLONIZATION_DECADES: DecolonizationDecade[] = [
  {
    decade: '1940s',
    count: 6,
    examples: ['Philippines (1946)', 'India & Pakistan (1947)', 'Myanmar (1948)', 'Indonesia (1949)', 'Israel (1948)'],
    color: '#3b82f6',
  },
  {
    decade: '1950s',
    count: 14,
    examples: ['Libya (1951)', 'Sudan (1956)', 'Ghana (1957)', 'Malaysia (1957)', 'Guinea (1958)'],
    color: '#22c55e',
  },
  {
    decade: '1960s',
    count: 32,
    highlight: '"Year of Africa" (1960): 17 countries independent in one year',
    examples: ['Nigeria (1960)', 'Congo (1960)', 'Algeria (1962)', 'Kenya (1963)', 'Singapore (1965)'],
    color: '#eab308',
  },
  {
    decade: '1970s',
    count: 19,
    examples: ['Bangladesh (1971)', 'Guinea-Bissau (1973)', 'Mozambique (1975)', 'Angola (1975)', 'Papua New Guinea (1975)'],
    color: '#f97316',
  },
  {
    decade: '1980s',
    count: 6,
    examples: ['Zimbabwe (1980)', 'Vanuatu (1980)', 'Belize (1981)', 'Brunei (1984)'],
    color: '#a855f7',
  },
  {
    decade: '1990s',
    count: 9,
    highlight: 'End of apartheid, handover of Hong Kong & Macau',
    examples: ['Namibia (1990)', 'Eritrea (1993)', 'Palau (1994)', 'Hong Kong (1997)', 'Macau (1999)'],
    color: '#ec4899',
  },
];

const LEGACY_CATEGORIES: LegacyCategory[] = [
  {
    title: 'Economic',
    icon: '\u{1F4B0}',
    color: '#f97316',
    summary: 'Colonized nations remain on average 40% poorer than colonizer nations',
    details: 'Colonial economies were designed to extract wealth, not build it. Infrastructure (railways, ports) served extraction routes, not internal development. Post-independence nations inherited debt, mono-crop economies, and trade patterns that still favor former colonial powers. The CFA franc, used by 14 African nations, is still backed by the French Treasury. The average GDP per capita of formerly colonized nations is roughly 40% lower than that of nations that were never colonized.',
  },
  {
    title: 'Political',
    icon: '\u{1F5FA}\uFE0F',
    color: '#3b82f6',
    summary: 'Arbitrary borders and ethnic conflicts trace directly to colonial-era decisions',
    details: 'Africa\'s straight-line borders \u2014 drawn at the Berlin Conference (1884\u20131885) with no African participation \u2014 split ethnic groups across nations and forced rivals into the same state. Nigeria alone contains over 250 ethnic groups within colonial-era borders. The India-Pakistan partition, the Israel-Palestine conflict, and the Rwandan genocide all have direct colonial roots. Many post-colonial states inherited authoritarian security apparatus designed for control, not governance.',
  },
  {
    title: 'Cultural',
    icon: '\u{1F30D}',
    color: '#a855f7',
    summary: 'Languages, religions, and legal systems imposed during colonialism persist today',
    details: 'English is the official language in 67 countries, French in 29 \u2014 mostly former colonies. Christian missionary activity during colonialism transformed the religious landscape of Africa, the Pacific, and parts of Asia. Legal systems in most former colonies derive from British common law or French civil law. Education systems, sports (cricket in India, rugby in South Africa), and administrative structures all bear colonial imprints. Many indigenous languages face extinction.',
  },
  {
    title: 'Reparations Debate',
    icon: '\u2696\uFE0F',
    color: '#eab308',
    summary: 'Growing demands for acknowledgment, apology, and restitution from former colonial powers',
    details: 'The reparations debate has intensified in the 2020s. The Caribbean Community (CARICOM) has demanded reparations from the UK, France, and the Netherlands for slavery. Belgium returned the tooth of murdered Congolese leader Patrice Lumumba in 2022. European museums face pressure to return looted artifacts (Benin Bronzes returned by Germany, 2022). The UK has resisted formal reparations while paying \u00A320M to Mau Mau survivors. Jamaica, Barbados, and others have moved to become republics, removing the British monarch as head of state.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI helpers
// ─────────────────────────────────────────────────────────────────────────────

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function FilterPill({ label, active, color, onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: active ? `1px solid ${color ?? '#60a5fa'}` : '1px solid rgba(255,255,255,0.1)', backgroundColor: active ? `${color ?? '#60a5fa'}22` : 'rgba(255,255,255,0.04)', color: active ? color ?? '#60a5fa' : '#94a3b8', transition: 'all 0.15s' }}>
      {label}
    </button>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <h2 style={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
      <span>{icon}</span>{title}
    </h2>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section components
// ─────────────────────────────────────────────────────────────────────────────

function EmpireCard({ empire, index }: { empire: ColonialEmpire; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }}
      onClick={() => setExpanded(!expanded)}
      style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${empire.color}33`, cursor: 'pointer', transition: 'border-color 0.2s' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>{empire.icon}</span>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>{empire.name}</h3>
            <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{empire.period}</span>
          </div>
        </div>
        <span style={{ fontSize: 12, color: '#64748b', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>{'\u25BC'}</span>
      </div>

      {/* Territory + region badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 4, backgroundColor: `${empire.color}22`, color: empire.color }}>{empire.territory}</span>
        {empire.regions.map((r) => (
          <span key={r} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontWeight: 600 }}>{r}</span>
        ))}
      </div>

      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>
        {expanded ? empire.impact : empire.impact.slice(0, 140) + '...'}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Key Holdings</div>
              <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.65 }}>{empire.keyHoldings}</div>
            </div>
            {empire.deathToll && (
              <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.08)', borderLeft: '3px solid rgba(239,68,68,0.4)', fontSize: 13, color: '#fca5a5', lineHeight: 1.5 }}>
                {empire.deathToll}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MethodCard({ method, index }: { method: ColonialMethod; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }}
      style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${method.color}33`, display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${method.color}18`, border: `2px solid ${method.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{method.icon}</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{method.name}</h3>
      </div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{method.description}</div>
      <div style={{ fontSize: 12, color: method.color, lineHeight: 1.5, padding: '8px 12px', borderRadius: 6, backgroundColor: `${method.color}0d`, borderLeft: `3px solid ${method.color}44` }}>
        <strong>Examples:</strong> {method.examples}
      </div>
    </motion.div>
  );
}

function ResistanceCard({ movement, index }: { movement: ResistanceMovement; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '24px 28px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${movement.color}33`, display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: `${movement.color}18`, border: `2px solid ${movement.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{movement.icon}</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>{movement.name}</h3>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{movement.period}</span>
            <span style={{ fontSize: 12, color: '#64748b' }}>{movement.location}</span>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{movement.description}</div>
      <div style={{ fontSize: 13, color: movement.color, lineHeight: 1.65, padding: '10px 14px', borderRadius: 8, backgroundColor: `${movement.color}0d`, borderLeft: `3px solid ${movement.color}55` }}>
        <strong>Significance:</strong> {movement.significance}
      </div>
      {movement.slug && (
        <div style={{ marginTop: 4 }}>
          <Link to={`/event/${movement.slug}`} style={{ fontSize: 12, fontWeight: 600, color: '#60a5fa', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 4, border: '1px solid rgba(96,165,250,0.25)', backgroundColor: 'rgba(96,165,250,0.08)' }}>Find in Chronicle &rarr;</Link>
        </div>
      )}
    </motion.div>
  );
}

function DecolonizationBar({ decade, index, maxCount }: { decade: DecolonizationDecade; index: number; maxCount: number }) {
  const widthPct = (decade.count / maxCount) * 100;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 0' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', minWidth: 50, fontFamily: 'monospace' }}>{decade.decade}</span>
        <div style={{ flex: 1, height: 28, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${widthPct}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: 'easeOut' }}
            style={{ height: '100%', backgroundColor: `${decade.color}66`, borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 10, minWidth: 40 }}
          >
            <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>{decade.count}</span>
          </motion.div>
        </div>
      </div>
      {decade.highlight && (
        <div style={{ fontSize: 12, fontWeight: 600, color: decade.color, marginLeft: 62, padding: '4px 10px', borderRadius: 4, backgroundColor: `${decade.color}15`, display: 'inline-block', alignSelf: 'flex-start' }}>
          {decade.highlight}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginLeft: 62 }}>
        {decade.examples.map((ex) => (
          <span key={ex} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 500 }}>{ex}</span>
        ))}
      </div>
    </motion.div>
  );
}

function LegacyCard({ category, index }: { category: LegacyCategory; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      onClick={() => setExpanded(!expanded)}
      style={{ padding: '24px 28px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${category.color}33`, cursor: 'pointer', transition: 'border-color 0.2s' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <span style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: `${category.color}18`, border: `2px solid ${category.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{category.icon}</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{category.title}</h3>
        </div>
        <span style={{ fontSize: 12, color: '#64748b', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>{'\u25BC'}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: category.color, lineHeight: 1.5 }}>
        {category.summary}
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <div style={{ marginTop: 14, fontSize: 13, color: '#94a3b8', lineHeight: 1.75 }}>
              {category.details}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

const REGION_FILTERS: EmpireRegion[] = ['Americas', 'Africa', 'Asia', 'Pacific', 'Global'];

export default function ColonialismPage() {
  const [selectedRegion, setSelectedRegion] = useState<EmpireRegion | 'All'>('All');

  const filteredEmpires = useMemo(() => {
    if (selectedRegion === 'All') return COLONIAL_EMPIRES;
    return COLONIAL_EMPIRES.filter((e) => e.regions.includes(selectedRegion));
  }, [selectedRegion]);

  const maxDecolCount = Math.max(...DECOLONIZATION_DECADES.map((d) => d.count));
  const totalIndependence = DECOLONIZATION_DECADES.reduce((s, d) => s + d.count, 0);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ padding: '48px 32px 36px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(239,68,68,0.08) 100%)' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 28, padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)' }}>{'\u2190'} Back to Timeline</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: '0 0 24px rgba(239,68,68,0.2)' }}>{'\u{1F30D}'}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Topic Page</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.15, marginBottom: 14 }}>The Age of Empires {'\u2014'} Colonialism and Its Long Shadow</h1>
          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, maxWidth: 700, margin: 0 }}>How Europe reshaped the world {'\u2014'} and how the world pushed back. From the first colonial conquests to the decolonization wave that redrew the global map.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
            <StatBadge value="8" label="Colonial Empires" />
            <StatBadge value="10" label="Resistance Movements" />
            <StatBadge value={`${totalIndependence}+`} label="Nations Freed" />
            <StatBadge value="500+" label="Years of History" />
          </div>
        </motion.div>

        {/* Region Filters */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>Region:</span>
          <FilterPill label="All Empires" active={selectedRegion === 'All'} onClick={() => setSelectedRegion('All')} />
          {REGION_FILTERS.map((region) => (
            <FilterPill key={region} label={region} active={selectedRegion === region} onClick={() => setSelectedRegion(region)} />
          ))}
        </div>

        {/* Part 1: Colonial Empires */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u{1F451}'} title={`Colonial Empires at Peak \u2014 ${filteredEmpires.length} Empires`} />
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Click any empire to explore its territory, key holdings, and human impact.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            <AnimatePresence mode="popLayout">
              {filteredEmpires.map((e, i) => <EmpireCard key={e.name} empire={e} index={i} />)}
            </AnimatePresence>
          </div>
          {filteredEmpires.length === 0 && <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569', fontSize: 14 }}>No empires match the current filter.</div>}
        </section>

        {/* Part 2: Methods of Colonialism */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u{1F527}'} title="Methods of Colonialism" />
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>The systematic tools colonial powers used to control, exploit, and reshape societies.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {COLONIAL_METHODS.map((m, i) => <MethodCard key={m.name} method={m} index={i} />)}
          </div>
        </section>

        {/* Part 3: Resistance Movements */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u270A'} title={`Resistance Movements \u2014 ${RESISTANCE_MOVEMENTS.length} Uprisings`} />
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>From the Haitian Revolution to the fall of apartheid — how colonized peoples fought back.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {RESISTANCE_MOVEMENTS.map((m, i) => <ResistanceCard key={m.name} movement={m} index={i} />)}
          </div>
        </section>

        {/* Part 4: Decolonization Wave */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u{1F5FD}'} title="The Decolonization Wave" />
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Decade by decade: how many colonies gained independence. The 1960s saw the most dramatic wave, with 32 nations freed in a single decade.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {DECOLONIZATION_DECADES.map((d, i) => <DecolonizationBar key={d.decade} decade={d} index={i} maxCount={maxDecolCount} />)}
          </div>
        </section>

        {/* Part 5: Legacy Today */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u{1F4CC}'} title="Legacy Today" />
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Colonialism ended on paper — but its consequences shape every aspect of the modern world. Click to expand.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {LEGACY_CATEGORIES.map((c, i) => <LegacyCard key={c.title} category={c} index={i} />)}
          </div>
        </section>

        {/* Footer */}
        <div style={{ padding: '32px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', padding: '8px 16px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)' }}>{'\u2190'} Back to Timeline</Link>
        </div>
      </div>
    </div>
  );
}
