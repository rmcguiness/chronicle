/**
 * DecolonizationPage — comprehensive deep-dive on the collapse of European
 * empires and the birth of 80+ new nations between 1945 and 1975.
 *
 * Self-contained: all styles inline, no external CSS.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── colour palette ───────────────────────────────────────────────── */
const BG = '#0a0c10';
const TEXT = '#e8e4de';
const TEXT_DIM = '#9a9486';
const TEXT_FAINT = '#6b6458';
const CARD_BG = 'rgba(34,80,52,0.08)';
const CARD_BORDER = 'rgba(34,80,52,0.22)';
const GREEN = '#2d8659';
const GOLD = '#c9a227';
const CRIMSON = '#b33a3a';
const TEAL = '#2a8a8a';
const OCHRE = '#b87333';
const INDIGO = '#5b5ea6';
const FLAME = '#c45a2a';

/* ─── types ────────────────────────────────────────────────────────── */
type SectionTab =
  | 'overview'
  | 'south-asia'
  | 'africa'
  | 'middle-east'
  | 'southeast-asia'
  | 'leaders'
  | 'methods'
  | 'neocolonialism'
  | 'cold-war'
  | 'legacy';

interface TabDef {
  key: SectionTab;
  label: string;
  icon: string;
}

interface Leader {
  name: string;
  nation: string;
  years: string;
  role: string;
  colour: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  detail: string;
  colour: string;
}

/* ─── data ─────────────────────────────────────────────────────────── */
const SECTION_TABS: TabDef[] = [
  { key: 'overview', label: 'Overview', icon: '🌍' },
  { key: 'south-asia', label: 'South Asia', icon: '🇮🇳' },
  { key: 'africa', label: 'Africa', icon: '🌅' },
  { key: 'middle-east', label: 'Middle East', icon: '🕌' },
  { key: 'southeast-asia', label: 'Southeast Asia', icon: '🌿' },
  { key: 'leaders', label: 'Leaders', icon: '✊' },
  { key: 'methods', label: 'Methods', icon: '⚖️' },
  { key: 'neocolonialism', label: 'Neocolonialism', icon: '🔗' },
  { key: 'cold-war', label: 'Cold War', icon: '🧊' },
  { key: 'legacy', label: 'Legacy', icon: '🗺️' },
];

const OVERVIEW_TEXT =
  'In 1945, European empires still controlled roughly one-third of Earth\'s land surface and governed hundreds of millions of people who had no say in their own destinies. Within just 30 years, over 80 new nations would gain independence — the most rapid political transformation in recorded history. Entire continents were remade. The modern world map is, in large part, the decolonization map.';

const WHY_NOW: { title: string; detail: string; colour: string }[] = [
  {
    title: 'WWII Shattered European Power',
    detail:
      'Britain was bankrupt. France had been occupied. The Netherlands and Belgium were devastated. The moral authority to rule "lesser peoples" evaporated when European nations proved unable to defend even themselves. Colonial subjects who had fought and died for their colonizers demanded reciprocity.',
    colour: CRIMSON,
  },
  {
    title: 'The Atlantic Charter (1941)',
    detail:
      'Churchill and Roosevelt declared "the right of all peoples to choose the form of government under which they will live." Churchill meant Europeans under Nazi occupation. Colonial subjects took the words literally — and used them as a weapon.',
    colour: TEAL,
  },
  {
    title: 'The UN Charter (1945)',
    detail:
      'The newly formed United Nations enshrined principles of national sovereignty and self-determination. It created a framework — and a stage — for colonized peoples to press their claims before the world.',
    colour: INDIGO,
  },
  {
    title: 'Decades of Nationalist Movements',
    detail:
      'The Indian National Congress was founded in 1885. Pan-African congresses began in 1900. Vietnamese nationalists organized in the 1920s. By 1945 these movements had deep roots, experienced leadership, and millions of supporters ready to act.',
    colour: GREEN,
  },
  {
    title: 'Superpower Opposition to Colonialism',
    detail:
      'The US opposed European empires partly from anti-colonial ideology, partly to open markets. The USSR opposed them as part of the global struggle against capitalism. For very different reasons, both superpowers pressured European powers to let go — even as they built their own spheres of influence.',
    colour: GOLD,
  },
];

const AFRICA_TIMELINE: TimelineEvent[] = [
  {
    year: '1951',
    title: 'Libya Independent',
    detail: 'First African nation to gain independence after WWII, from Italian/British/French administration under UN mandate.',
    colour: OCHRE,
  },
  {
    year: '1954–62',
    title: 'Algerian War of Independence',
    detail:
      'Eight years of brutal guerrilla war against France. An estimated 1 million Algerians killed. France used torture, mass detention, and napalm. The war brought down the French Fourth Republic and brought de Gaulle to power.',
    colour: CRIMSON,
  },
  {
    year: '1952–60',
    title: 'Mau Mau Uprising (Kenya)',
    detail:
      'Kikuyu-led revolt against British settler colonialism. Britain responded with detention camps holding 1.5 million people, systematic torture, and extrajudicial killings. Documents proving atrocities were hidden for decades.',
    colour: CRIMSON,
  },
  {
    year: '1957',
    title: 'Ghana: First Sub-Saharan Independence',
    detail:
      'Kwame Nkrumah led the Gold Coast to independence as Ghana — the first sub-Saharan African nation to break free. "We prefer self-government with danger to servitude in tranquility." His success electrified the continent.',
    colour: GREEN,
  },
  {
    year: '1960',
    title: 'Year of Africa — 17 Nations Independent',
    detail:
      'In a single year: Cameroon, Senegal, Togo, Mali, Madagascar, Congo (Kinshasa), Somalia, Benin, Niger, Burkina Faso, Ivory Coast, Chad, Central African Republic, Congo (Brazzaville), Gabon, Mauritania, and Mali all gained independence. The political map of Africa was redrawn overnight.',
    colour: GOLD,
  },
  {
    year: '1960',
    title: 'Congo Crisis & Lumumba Assassination',
    detail:
      'Belgium granted the Congo independence with almost no preparation — the country had fewer than 30 university graduates. Patrice Lumumba, the first democratically elected PM, was overthrown in a CIA-backed coup and assassinated within months. The Congo descended into chaos that reverberates today.',
    colour: CRIMSON,
  },
  {
    year: '1962',
    title: 'Algeria Wins Independence',
    detail:
      'After 8 years and roughly 1 million dead, France finally recognized Algerian independence. Nearly 1 million European settlers (pieds-noirs) fled. The war remains one of the defining traumas of both nations.',
    colour: FLAME,
  },
  {
    year: '1963',
    title: 'Kenya Independent',
    detail:
      'Jomo Kenyatta, who had been imprisoned during the Emergency, became the first president. Britain\'s brutal suppression of the Mau Mau was officially acknowledged only in 2013.',
    colour: GREEN,
  },
  {
    year: '1975',
    title: 'Portuguese Africa — The Last to Fall',
    detail:
      'Angola and Mozambique gained independence only after a military coup in Portugal itself (the Carnation Revolution, 1974). These were among the bloodiest late-colonial wars. Angola immediately descended into a devastating Cold War proxy conflict lasting until 2002.',
    colour: CRIMSON,
  },
];

const LEADERS: Leader[] = [
  { name: 'Mahatma Gandhi', nation: 'India', years: '1869–1948', role: 'Architect of nonviolent resistance. Led salt marches, boycotts, and civil disobedience that made British rule morally untenable. Assassinated 1948.', colour: GOLD },
  { name: 'Jawaharlal Nehru', nation: 'India', years: '1889–1964', role: 'First PM of independent India. Championed non-alignment, secular democracy, and industrialization. Shaped the post-colonial world order at Bandung (1955).', colour: TEAL },
  { name: 'Muhammad Ali Jinnah', nation: 'Pakistan', years: '1876–1948', role: 'Founder of Pakistan. Argued Muslims needed a separate state. The partition he championed displaced 15 million and killed over 1 million.', colour: GREEN },
  { name: 'Kwame Nkrumah', nation: 'Ghana', years: '1909–1972', role: 'Led Ghana to independence in 1957 — first sub-Saharan African nation. Pan-Africanist visionary. Later overthrown in a coup (1966) with alleged CIA involvement.', colour: GOLD },
  { name: 'Julius Nyerere', nation: 'Tanzania', years: '1922–1999', role: '"Mwalimu" (Teacher). Led Tanzania to independence peacefully. Promoted African socialism (Ujamaa). One of few African leaders to leave power voluntarily.', colour: GREEN },
  { name: 'Gamal Abdel Nasser', nation: 'Egypt', years: '1918–1970', role: 'Overthrew the monarchy (1952), nationalized the Suez Canal (1956), humiliated Britain and France. Became the symbol of Arab nationalism and anti-imperialism.', colour: OCHRE },
  { name: 'Patrice Lumumba', nation: 'Congo', years: '1925–1961', role: 'First democratically elected leader of independent Congo. Overthrown and assassinated with CIA and Belgian complicity within months. Became a martyr of African independence.', colour: CRIMSON },
  { name: 'Ho Chi Minh', nation: 'Vietnam', years: '1890–1969', role: 'Led Vietnamese independence from France (1945) and resistance to the US. Defeated France at Dien Bien Phu (1954). Inspired anti-colonial movements worldwide.', colour: FLAME },
  { name: 'Sukarno', nation: 'Indonesia', years: '1901–1970', role: 'Declared Indonesian independence from the Netherlands (1945). Hosted the Bandung Conference (1955), founding the Non-Aligned Movement. Later overthrown by Suharto (1967).', colour: TEAL },
  { name: 'Jomo Kenyatta', nation: 'Kenya', years: '1897–1978', role: 'Imprisoned by Britain during the Mau Mau Emergency, emerged to become Kenya\'s first president (1963). Promoted national unity with "Harambee" (pulling together).', colour: GREEN },
  { name: 'Nelson Mandela', nation: 'South Africa', years: '1918–2013', role: '27 years imprisoned. Led the end of apartheid. First Black president of South Africa (1994). The moral symbol of the entire decolonization era, though his victory came latest.', colour: GOLD },
  { name: 'Frantz Fanon', nation: 'Martinique / Algeria', years: '1925–1961', role: 'Psychiatrist, revolutionary, intellectual. "The Wretched of the Earth" became the bible of anti-colonial movements. Argued colonialism was psychological as well as political violence.', colour: INDIGO },
  { name: 'Ahmed Ben Bella', nation: 'Algeria', years: '1916–2012', role: 'Led the FLN during the Algerian War. First president of independent Algeria (1962). Imprisoned by France, then overthrown by his own military (1965).', colour: FLAME },
  { name: 'Léopold Sédar Senghor', nation: 'Senegal', years: '1906–2001', role: 'Poet, philosopher, first president of Senegal. Co-developed Négritude — the intellectual assertion of Black African identity and culture against colonial erasure.', colour: INDIGO },
  { name: 'Tunku Abdul Rahman', nation: 'Malaysia', years: '1903–1990', role: 'Negotiated Malayan independence from Britain (1957) peacefully. "Father of Malaysia." His approach became a model for non-violent transfer of power in Southeast Asia.', colour: TEAL },
];

/* ─── helper components ────────────────────────────────────────────── */
function TabButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 6,
        border: active ? `1px solid ${GREEN}` : `1px solid ${CARD_BORDER}`,
        background: active ? 'rgba(34,80,52,0.18)' : 'transparent',
        color: active ? TEXT : TEXT_DIM,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{icon}</span> {label}
    </button>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <h2
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 'clamp(18px, 3vw, 24px)',
        fontWeight: 700,
        color: TEXT,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        margin: '0 0 20px',
      }}
    >
      <span>{icon}</span> {title}
    </h2>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 8,
        padding: '10px 16px',
        textAlign: 'center',
        minWidth: 80,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: GREEN }}>{value}</div>
      <div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function NarrativeCard({
  title,
  children,
  colour = GREEN,
}: {
  title?: string;
  children: React.ReactNode;
  colour?: string;
}) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderLeft: `3px solid ${colour}`,
        borderRadius: 8,
        padding: '18px 22px',
        marginBottom: 16,
      }}
    >
      {title && (
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: colour,
            margin: '0 0 8px',
          }}
        >
          {title}
        </h3>
      )}
      <div style={{ fontSize: 14, lineHeight: 1.7, color: TEXT }}>{children}</div>
    </div>
  );
}

function QuoteBlock({
  quote,
  attribution,
  colour = GOLD,
}: {
  quote: string;
  attribution: string;
  colour?: string;
}) {
  return (
    <blockquote
      style={{
        borderLeft: `3px solid ${colour}`,
        margin: '20px 0',
        padding: '12px 20px',
        fontStyle: 'italic',
        color: TEXT_DIM,
        fontSize: 15,
        lineHeight: 1.7,
      }}
    >
      "{quote}"
      <div
        style={{
          marginTop: 8,
          fontStyle: 'normal',
          fontSize: 12,
          color: TEXT_FAINT,
        }}
      >
        — {attribution}
      </div>
    </blockquote>
  );
}

/* ─── main component ───────────────────────────────────────────────── */
export default function DecolonizationPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('overview');

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: BG,
        color: TEXT,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: '48px 32px 36px',
          borderBottom: `1px solid ${CARD_BORDER}`,
          background: `linear-gradient(135deg, ${BG} 0%, rgba(34,80,52,0.10) 100%)`,
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: 13,
            color: TEXT_DIM,
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: 16,
          }}
        >
          ← Back to Timeline
        </Link>

        <h1
          style={{
            fontSize: 'clamp(26px, 4vw, 40px)',
            fontWeight: 800,
            color: TEXT,
            margin: '0 0 10px',
            lineHeight: 1.15,
          }}
        >
          Decolonization — How Empires Fell and New Nations Rose
          <span style={{ color: GREEN }}> (1945–1975)</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: TEXT_DIM,
            maxWidth: 780,
            lineHeight: 1.6,
            margin: '0 0 20px',
          }}
        >
          In 30 years, over 80 new nations gained independence — the most rapid
          political transformation in history.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <StatBadge value="80+" label="New Nations" />
          <StatBadge value="30" label="Years" />
          <StatBadge value="1/3" label="Earth's Land" />
          <StatBadge value="15+" label="Independence Leaders" />
          <StatBadge value="1945" label="Era Begins" />
        </div>
      </motion.div>

      {/* ── sticky tab bar ── */}
      <div
        style={{
          padding: '16px 32px',
          borderBottom: `1px solid ${CARD_BORDER}`,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          position: 'sticky',
          top: 0,
          backgroundColor: BG,
          zIndex: 10,
        }}
      >
        {SECTION_TABS.map((t) => (
          <TabButton
            key={t.key}
            label={t.label}
            icon={t.icon}
            active={activeTab === t.key}
            onClick={() => setActiveTab(t.key)}
          />
        ))}
      </div>

      {/* ── content area ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          style={{ padding: '28px 32px 64px', maxWidth: 960 }}
        >
          {/* ═══ OVERVIEW ═══ */}
          {activeTab === 'overview' && (
            <div>
              <SectionHeader icon="🌍" title="The End of Empire" />
              <NarrativeCard>
                <p style={{ margin: '0 0 14px' }}>{OVERVIEW_TEXT}</p>
                <p style={{ margin: 0 }}>
                  This page traces the astonishing collapse of the European colonial
                  order — from India&apos;s partition in 1947 to the last Portuguese
                  colonies in 1975. It examines the leaders who led the charge, the
                  methods they used, the violence they endured, and the complicated
                  legacies they left behind.
                </p>
              </NarrativeCard>

              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: GOLD,
                  margin: '32px 0 16px',
                }}
              >
                The State of the World in 1945
              </h3>
              <NarrativeCard colour={TEAL}>
                <p style={{ margin: '0 0 12px' }}>
                  At the end of World War II, the British Empire still governed India,
                  Burma, Malaya, much of Africa, the Middle East mandate territories,
                  and scattered islands across every ocean. France held Indochina,
                  most of West and Equatorial Africa, North Africa, Madagascar, and
                  Pacific territories. The Netherlands ruled Indonesia. Belgium
                  controlled the Congo and Rwanda-Burundi. Portugal held Angola,
                  Mozambique, Guinea-Bissau, and East Timor. Italy had lost its
                  colonies but had held Libya, Eritrea, and Somalia.
                </p>
                <p style={{ margin: 0 }}>
                  Hundreds of millions of people — the vast majority of Asia and
                  nearly all of Africa — were governed by a handful of European
                  capitals. Most had no vote, no representation, and no legal path to
                  self-rule. That was about to change, faster than anyone predicted.
                </p>
              </NarrativeCard>

              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: GOLD,
                  margin: '32px 0 16px',
                }}
              >
                Why It Happened When It Did
              </h3>
              {WHY_NOW.map((item) => (
                <NarrativeCard key={item.title} title={item.title} colour={item.colour}>
                  {item.detail}
                </NarrativeCard>
              ))}

              <QuoteBlock
                quote="The wind of change is blowing through this continent. Whether we like it or not, this growth of national consciousness is a political fact."
                attribution="Harold Macmillan, British PM, to the South African Parliament, 1960"
              />
            </div>
          )}

          {/* ═══ SOUTH ASIA ═══ */}
          {activeTab === 'south-asia' && (
            <div>
              <SectionHeader icon="🇮🇳" title="South Asia — Partition & Independence (1947)" />

              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  The independence of India and Pakistan in August 1947 was both a
                  triumph and a catastrophe. After nearly 200 years of British rule,
                  the subcontinent was free — but the price was one of the largest
                  mass displacements and communal bloodbaths in history.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>10–15 million people</strong> were displaced.{' '}
                  <strong>Over 1 million</strong> were killed in communal violence as
                  Hindus, Muslims, and Sikhs fled across hastily drawn borders. The
                  Radcliffe Line — the partition boundary — was drawn in five weeks
                  by a British lawyer who had never been to India.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                Gandhi&apos;s Nonviolent Revolution
              </h3>
              <NarrativeCard colour={GOLD}>
                <p style={{ margin: '0 0 12px' }}>
                  Mohandas Gandhi transformed Indian politics by turning resistance
                  into moral theater. The Salt March (1930) — a 240-mile walk to the
                  sea to make salt in defiance of British monopoly — captured the
                  world&apos;s attention. The Quit India Movement (1942) demanded immediate
                  British withdrawal during WWII.
                </p>
                <p style={{ margin: 0 }}>
                  Gandhi&apos;s genius was making the colonizer&apos;s violence visible. When
                  peaceful protesters were beaten, the moral cost of empire became
                  impossible to ignore. His methods would later inspire Martin Luther
                  King Jr. and Nelson Mandela.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                Nehru, Jinnah, Mountbatten — The Split
              </h3>
              <NarrativeCard colour={TEAL}>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Jawaharlal Nehru</strong> envisioned a united, secular,
                  democratic India. <strong>Muhammad Ali Jinnah</strong>, leader of
                  the Muslim League, argued that Muslims would be permanent minorities
                  in a Hindu-majority state and demanded a separate Pakistan.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Lord Mountbatten</strong>, the last Viceroy, accelerated the
                  timeline from June 1948 to August 1947 — giving the new nations
                  barely 10 weeks to prepare. The rushed partition created chaos:
                  armies were split, civil services divided, and 562 princely states
                  told to choose sides.
                </p>
                <p style={{ margin: 0 }}>
                  The consequences were immediate and devastating. Trains arrived at
                  stations full of corpses. Entire communities that had coexisted for
                  centuries turned on each other. Kashmir remained disputed — and
                  remains so today. The wounds of partition still shape India-Pakistan
                  relations nearly 80 years later.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="At the stroke of the midnight hour, when the world sleeps, India will awake to life and freedom."
                attribution="Jawaharlal Nehru, speech to the Indian Constituent Assembly, August 14, 1947"
                colour={GREEN}
              />

              <QuoteBlock
                quote="The loss of India would reduce us to the status of a minor power."
                attribution="Winston Churchill, opposing Indian independence"
                colour={CRIMSON}
              />
            </div>
          )}

          {/* ═══ AFRICA ═══ */}
          {activeTab === 'africa' && (
            <div>
              <SectionHeader icon="🌅" title="Africa — The Wind of Change (1950s–1970s)" />

              <NarrativeCard>
                <p style={{ margin: '0 0 12px' }}>
                  Africa&apos;s decolonization was the largest and most varied chapter of
                  the entire story. Fifty-four nations gained independence over roughly
                  two decades. Some transitions were peaceful. Others involved
                  devastating wars, massacres, and betrayals. Almost all were shaped
                  by the arbitrary borders Europeans had drawn at the Berlin Conference
                  of 1884–85 — lines that split ethnic groups, merged rivals, and
                  created states with no historical precedent.
                </p>
                <p style={{ margin: 0 }}>
                  The human cost was immense. In Algeria alone, roughly 1 million
                  people died. In the Congo, the assassination of Patrice Lumumba set
                  off decades of dictatorship and conflict. In Kenya, British detention
                  camps and torture were covered up for half a century.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 16px' }}>
                Timeline of African Independence
              </h3>
              {AFRICA_TIMELINE.map((evt) => (
                <div
                  key={evt.year + evt.title}
                  style={{
                    display: 'flex',
                    gap: 16,
                    marginBottom: 18,
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      minWidth: 64,
                      fontWeight: 700,
                      fontSize: 14,
                      color: evt.colour,
                      paddingTop: 2,
                    }}
                  >
                    {evt.year}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: CARD_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      borderLeft: `3px solid ${evt.colour}`,
                      borderRadius: 8,
                      padding: '14px 18px',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 15, color: TEXT, marginBottom: 6 }}>
                      {evt.title}
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM }}>
                      {evt.detail}
                    </div>
                  </div>
                </div>
              ))}

              <QuoteBlock
                quote="We prefer self-government with danger to servitude in tranquility."
                attribution="Kwame Nkrumah, 1957"
                colour={GREEN}
              />
              <QuoteBlock
                quote="For my part, the partition of Africa into French, English, and Portuguese zones is an absurdity."
                attribution="Léopold Sédar Senghor"
                colour={INDIGO}
              />
            </div>
          )}

          {/* ═══ MIDDLE EAST ═══ */}
          {activeTab === 'middle-east' && (
            <div>
              <SectionHeader icon="🕌" title="Middle East — Mandates, Oil & the Creation of Israel" />

              <NarrativeCard colour={OCHRE}>
                <p style={{ margin: '0 0 12px' }}>
                  The Middle East was carved up after World War I when the Ottoman
                  Empire collapsed. Britain and France divided the region into
                  "mandates" — effectively colonies with better branding. Britain took
                  Palestine, Transjordan, and Iraq. France took Syria and Lebanon.
                  These artificial borders, drawn to serve European interests, are the
                  source of many conflicts that persist today.
                </p>
                <p style={{ margin: 0 }}>
                  Decolonization here was entangled with oil politics, the creation of
                  Israel, and the Cold War — making it uniquely complex and
                  consequential.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                The Creation of Israel (1948) and Its Consequences
              </h3>
              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  In 1917, the Balfour Declaration promised a "national home for the
                  Jewish people" in Palestine — while Palestine was still part of the
                  Ottoman Empire and overwhelmingly Arab. After WWII and the
                  Holocaust, pressure for a Jewish state intensified. In 1947, the UN
                  voted to partition Palestine. In 1948, Israel declared independence.
                </p>
                <p style={{ margin: 0 }}>
                  The result was the 1948 Arab-Israeli War, the displacement of
                  700,000+ Palestinians (the Nakba), and a conflict that remains
                  unresolved. The creation of Israel was simultaneously a post-colonial
                  act (Jews escaping European persecution) and a colonial one
                  (displacing the existing population) — a tension that defines the
                  conflict to this day.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                The Suez Crisis (1956) — Empire&apos;s Last Gasp
              </h3>
              <NarrativeCard colour={TEAL}>
                <p style={{ margin: '0 0 12px' }}>
                  When Egypt&apos;s Nasser nationalized the Suez Canal, Britain, France,
                  and Israel invaded. The US and USSR both demanded they withdraw.
                  Britain and France, humiliated, complied. The Suez Crisis proved
                  definitively that European powers could no longer act as imperial
                  forces — the age of empires was over.
                </p>
                <p style={{ margin: 0 }}>
                  Nasser emerged as a hero of the Arab world and the Non-Aligned
                  Movement. The canal remained Egyptian. And Britain quietly began
                  accelerating its withdrawal from remaining colonies.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                Oil and Independence
              </h3>
              <NarrativeCard colour={OCHRE}>
                Oil transformed the decolonization equation in the Gulf. Saudi Arabia,
                Iraq, Iran, Kuwait, and the Gulf states leveraged petroleum wealth to
                assert sovereignty. The creation of OPEC (1960) was itself a
                decolonizing act — former colonial subjects taking control of the
                resource that powered the industrial world. The 1973 oil embargo
                showed the new nations had real economic leverage.
              </NarrativeCard>

              <QuoteBlock
                quote="We are not combating imperialism to substitute one form of domination for another."
                attribution="Gamal Abdel Nasser"
                colour={OCHRE}
              />
            </div>
          )}

          {/* ═══ SOUTHEAST ASIA ═══ */}
          {activeTab === 'southeast-asia' && (
            <div>
              <SectionHeader icon="🌿" title="Southeast Asia — Revolution, War & Negotiation" />

              <NarrativeCard>
                Southeast Asia saw every mode of decolonization — armed revolution
                (Vietnam, Indonesia), brutal colonial war (Vietnam vs France),
                negotiated transfer (Malaya), and lingering conflict that drew in
                superpowers (the US-Vietnam War). The region&apos;s experience shows that
                there was no single path from colony to nation.
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: FLAME, margin: '24px 0 12px' }}>
                Vietnam (1945–1954): Defeating the French Empire
              </h3>
              <NarrativeCard colour={FLAME}>
                <p style={{ margin: '0 0 12px' }}>
                  Ho Chi Minh declared Vietnamese independence on September 2, 1945 —
                  quoting the American Declaration of Independence. France refused to
                  accept it. What followed was a nine-year war ending at{' '}
                  <strong>Dien Bien Phu (1954)</strong>, where Vietnamese forces under
                  General Vo Nguyen Giap besieged and defeated the French garrison in
                  one of the most stunning military upsets in modern history.
                </p>
                <p style={{ margin: 0 }}>
                  The Geneva Accords divided Vietnam at the 17th parallel. The US,
                  fearing communist expansion, refused to allow reunification elections
                  and propped up South Vietnam — planting the seeds for the American
                  war that would kill over 3 million Vietnamese and 58,000 Americans.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: TEAL, margin: '24px 0 12px' }}>
                Indonesia (1945): Sukarno vs the Netherlands
              </h3>
              <NarrativeCard colour={TEAL}>
                <p style={{ margin: '0 0 12px' }}>
                  Sukarno and Mohammad Hatta proclaimed Indonesian independence on
                  August 17, 1945, two days after Japan&apos;s surrender. The Netherlands
                  refused to recognize it and launched two "police actions" (military
                  invasions) to retake the colony. Under intense UN and US pressure,
                  the Dutch finally recognized Indonesian sovereignty in 1949.
                </p>
                <p style={{ margin: 0 }}>
                  Indonesia, the world&apos;s largest archipelago with over 17,000 islands
                  and hundreds of ethnic groups, became a crucial voice in the
                  Non-Aligned Movement. Sukarno hosted the landmark Bandung Conference
                  (1955), where leaders of newly independent Asian and African nations
                  declared themselves a "Third World" — neither Western nor Soviet.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GREEN, margin: '24px 0 12px' }}>
                Malaya/Malaysia (1957): The Peaceful Model
              </h3>
              <NarrativeCard colour={GREEN}>
                <p style={{ margin: '0 0 12px' }}>
                  Tunku Abdul Rahman negotiated Malayan independence from Britain
                  through constitutional means — no guerrilla war, no mass violence.
                  The British, exhausted by conflicts elsewhere, were willing to
                  transfer power to a stable, anti-communist leadership.
                </p>
                <p style={{ margin: 0 }}>
                  Malaya (later Malaysia) became a model of peaceful decolonization,
                  though the process was complicated by the Malayan Emergency
                  (1948–1960), a communist insurgency that Britain suppressed before
                  handing over power. The "success" of the Malayan model partly
                  depended on defeating the radical alternative first.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="All men are created equal. They are endowed by their Creator with certain inalienable rights; among these are Life, Liberty, and the pursuit of Happiness."
                attribution="Ho Chi Minh, Vietnamese Declaration of Independence (1945), quoting the American one"
                colour={FLAME}
              />
            </div>
          )}

          {/* ═══ LEADERS ═══ */}
          {activeTab === 'leaders' && (
            <div>
              <SectionHeader icon="✊" title="Independence Leaders" />
              <NarrativeCard>
                The leaders of decolonization were among the most remarkable political
                figures of the 20th century. Many were educated in the colonial
                metropole — studying law in London, philosophy in Paris, politics in
                Moscow — and turned Western ideas of liberty and self-determination
                against the empires that taught them. Many were imprisoned. Several
                were assassinated. Almost all faced impossible choices between
                idealism and pragmatism.
              </NarrativeCard>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 16,
                  marginTop: 20,
                }}
              >
                {LEADERS.map((l) => (
                  <div
                    key={l.name}
                    style={{
                      background: CARD_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      borderTop: `3px solid ${l.colour}`,
                      borderRadius: 8,
                      padding: '16px 20px',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 16, color: l.colour }}>
                      {l.name}
                    </div>
                    <div style={{ fontSize: 12, color: TEXT_FAINT, margin: '4px 0 8px' }}>
                      {l.nation} · {l.years}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: TEXT_DIM }}>
                      {l.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ METHODS ═══ */}
          {activeTab === 'methods' && (
            <div>
              <SectionHeader icon="⚖️" title="Methods of Liberation" />

              <NarrativeCard>
                How do you overthrow an empire? The decolonization era saw three
                broad approaches, each with its own logic, costs, and consequences.
                The method often depended less on the colonized and more on the
                colonizer — how willing they were to leave, and how much violence
                they were prepared to inflict to stay.
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                1. Nonviolent Resistance (The Gandhi Model)
              </h3>
              <NarrativeCard colour={GOLD}>
                <p style={{ margin: '0 0 12px' }}>
                  Gandhi&apos;s satyagraha (truth-force) demonstrated that nonviolent
                  resistance could defeat an empire — if the empire had some residual
                  moral sensitivity and if the movement had mass participation. Civil
                  disobedience, boycotts, strikes, and peaceful marches made the cost
                  of repression visible to the world.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Where it worked:</strong> India, Ghana (partly), Zambia, much
                  of the British Commonwealth. Britain, with its parliamentary
                  traditions and free press, was more susceptible to moral pressure
                  than authoritarian colonial powers.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: CRIMSON, margin: '24px 0 12px' }}>
                2. Armed Struggle
              </h3>
              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  Where colonizers refused to negotiate, armed resistance became the
                  only option. Frantz Fanon argued that violence was not just
                  strategically necessary but psychologically liberating — that
                  colonized people needed to physically resist to reclaim their
                  humanity. Whether or not one accepts this, the historical record is
                  clear: some empires only left at gunpoint.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Where it was necessary:</strong> Algeria (vs France), Vietnam
                  (vs France, then US), Kenya (Mau Mau vs Britain), Angola and
                  Mozambique (vs Portugal), Indonesia (vs Netherlands). The human cost
                  was catastrophic — millions of lives lost.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: TEAL, margin: '24px 0 12px' }}>
                3. Negotiated Transfer (Commonwealth Approach)
              </h3>
              <NarrativeCard colour={TEAL}>
                <p style={{ margin: '0 0 12px' }}>
                  In many cases, especially later in the process, colonial powers
                  negotiated an orderly transfer of power — often to leaders they
                  considered "moderate" or "responsible." Britain was most willing to
                  use this approach, partly from pragmatism and partly because the
                  Commonwealth structure allowed continued influence.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Examples:</strong> Malaya (1957), Nigeria (1960), Jamaica
                  (1962), many Caribbean and Pacific island nations. These transitions
                  were less violent but often left colonial economic structures intact —
                  which critics called neocolonialism by another name.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="At the individual level, violence is a cleansing force. It frees the native from his inferiority complex and from his despair and inaction."
                attribution="Frantz Fanon, The Wretched of the Earth (1961)"
                colour={CRIMSON}
              />
              <QuoteBlock
                quote="First they ignore you, then they laugh at you, then they fight you, then you win."
                attribution="Attributed to Gandhi (likely apocryphal, but captures the spirit)"
                colour={GOLD}
              />
            </div>
          )}

          {/* ═══ NEOCOLONIALISM ═══ */}
          {activeTab === 'neocolonialism' && (
            <div>
              <SectionHeader icon="🔗" title="The Neocolonialism Problem" />

              <NarrativeCard colour={OCHRE}>
                <p style={{ margin: '0 0 12px' }}>
                  Independence lowered flags and changed anthems. But for many new
                  nations, formal political sovereignty masked continuing economic and
                  political dependence on former colonial powers — and new ones.
                  Kwame Nkrumah called this <strong>neocolonialism</strong>: "the last
                  stage of imperialism."
                </p>
                <p style={{ margin: 0 }}>
                  The structures of extraction that colonialism built — mines, cash
                  crop plantations, export-oriented railways, unequal trade agreements
                  — didn&apos;t disappear with independence. In many cases, the same
                  companies continued to operate, the same trade patterns persisted,
                  and the same debts accumulated.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                Why New Nations Struggled
              </h3>
              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Colonial borders created artificial states.</strong> The
                  borders drawn by Europeans at the Berlin Conference (1884–85) split
                  ethnic groups across multiple countries and forced rivals into the
                  same state. Nigeria alone contains over 250 ethnic groups. These
                  borders — drawn for European administrative convenience — became the
                  borders of independent nations, a recipe for internal conflict.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Education and institutions were deliberately stunted.</strong>{' '}
                  Belgium left the Congo with fewer than 30 university graduates and
                  no Congolese officers in the army. Colonial education systems
                  produced clerks, not engineers or administrators. The departure of
                  European bureaucrats often left a governance vacuum.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Economic structures served the metropole.</strong> Colonial
                  economies were designed to extract raw materials and export them to
                  Europe, then import finished goods back. Roads ran from mines to
                  ports, not between cities. Diversified economies didn&apos;t exist. New
                  nations inherited economies structurally dependent on their former
                  rulers.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                Françafrique — France&apos;s Shadow Empire
              </h3>
              <NarrativeCard colour={INDIGO}>
                France maintained the most systematic neocolonial network. The CFA
                franc — a currency controlled by the French Treasury — bound 14
                African nations to France economically. French military bases remained
                across Africa. France intervened militarily in its former colonies
                over 50 times between 1960 and 2023. Presidents who defied Paris were
                overthrown; those who complied were protected regardless of
                corruption or repression.
              </NarrativeCard>

              <QuoteBlock
                quote="The essence of neo-colonialism is that the State which is subject to it is, in theory, independent and has all the outward trappings of international sovereignty. In reality its economic system and thus its political policy is directed from outside."
                attribution="Kwame Nkrumah, Neo-Colonialism: The Last Stage of Imperialism (1965)"
                colour={GOLD}
              />
            </div>
          )}

          {/* ═══ COLD WAR ═══ */}
          {activeTab === 'cold-war' && (
            <div>
              <SectionHeader icon="🧊" title="Cold War Overlay" />

              <NarrativeCard colour={INDIGO}>
                <p style={{ margin: '0 0 12px' }}>
                  Decolonization didn&apos;t happen in a vacuum — it happened in the
                  middle of the Cold War. Every independence movement, every new
                  government, every civil conflict was viewed through the lens of
                  US-Soviet competition. Both superpowers intervened relentlessly,
                  turning local struggles into proxy wars and backing dictators who
                  served their interests.
                </p>
                <p style={{ margin: 0 }}>
                  For new nations trying to build functioning states, the Cold War was
                  both an opportunity (both sides offered aid) and a curse (both sides
                  demanded loyalty and punished neutrality).
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: CRIMSON, margin: '24px 0 12px' }}>
                Coups and Interventions
              </h3>
              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Congo (1960–61):</strong> The CIA helped orchestrate the
                  overthrow and assassination of Patrice Lumumba after he sought Soviet
                  assistance. Mobutu Sese Seko, installed with Western backing, ruled
                  as a kleptocratic dictator for 32 years.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Indonesia (1965):</strong> A CIA-backed military takeover by
                  Suharto led to the massacre of 500,000–1 million alleged communists.
                  Western governments supplied kill lists and looked away.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Chile (1973):</strong> While not colonial, the US-backed coup
                  against democratically elected Salvador Allende showed the pattern:
                  Cold War logic trumped self-determination.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Angola (1975–2002):</strong> After independence from Portugal,
                  Angola became a Cold War battleground. The US and South Africa backed
                  UNITA, the USSR and Cuba backed the MPLA. The resulting civil war
                  lasted 27 years and killed over 500,000 people.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: TEAL, margin: '24px 0 12px' }}>
                The Non-Aligned Movement
              </h3>
              <NarrativeCard colour={TEAL}>
                <p style={{ margin: '0 0 12px' }}>
                  Many new nations refused to choose sides. The Bandung Conference
                  (1955), organized by Sukarno, Nehru, and Nasser, brought together
                  leaders from 29 Asian and African nations to declare a "Third Way"
                  — neither American capitalism nor Soviet communism.
                </p>
                <p style={{ margin: 0 }}>
                  The Non-Aligned Movement formalized this stance in 1961, eventually
                  growing to over 120 member states. In practice, non-alignment was
                  difficult to maintain — both superpowers punished fence-sitters. But
                  it represented an important assertion of autonomy by nations tired of
                  being pawns in someone else&apos;s game.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="We do not intend to be the playthings of others."
                attribution="Sukarno, at the Bandung Conference (1955)"
                colour={TEAL}
              />
            </div>
          )}

          {/* ═══ LEGACY ═══ */}
          {activeTab === 'legacy' && (
            <div>
              <SectionHeader icon="🗺️" title="Legacy — The World Decolonization Made" />

              <NarrativeCard colour={GREEN}>
                <p style={{ margin: '0 0 12px' }}>
                  Today&apos;s world map is the decolonization map. The 193 member states
                  of the United Nations include over 80 that didn&apos;t exist as
                  independent nations in 1945. The political transformation was
                  staggering in speed and scope — but the legacies are complicated,
                  contested, and very much alive.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                Colonial Borders, Modern Conflicts
              </h3>
              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  Many of today&apos;s most intractable conflicts trace directly to
                  colonial border-drawing. The Rwandan genocide (1994) was rooted in
                  Belgian policies that hardened Hutu-Tutsi distinctions. The
                  Israel-Palestine conflict stems from British mandate-era decisions.
                  Iraq&apos;s internal tensions reflect the Ottoman provinces Britain
                  stitched together. Kashmir remains disputed because of partition.
                  Nigeria&apos;s Biafra War, Sudan&apos;s split, Somalia&apos;s collapse — all carry
                  colonial fingerprints.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                Economic Legacies
              </h3>
              <NarrativeCard colour={OCHRE}>
                The global economic order still reflects colonial extraction patterns.
                Many former colonies remain primary commodity exporters. The wealth gap
                between former colonizers and colonized has narrowed in some cases
                (East Asia) but persists or widened in others (sub-Saharan Africa).
                Debates over reparations, debt cancellation, and structural adjustment
                continue. The question of who owes what to whom remains explosive.
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                Cultural Decolonization
              </h3>
              <NarrativeCard colour={INDIGO}>
                Political independence was only the beginning. The struggle to
                decolonize education, language, art, and thought continues. Countries
                debate whether to keep colonial languages (English, French, Portuguese)
                as official languages. Universities reassess curricula built on
                European knowledge systems. Museums face demands to return looted
                artifacts. The psychological dimensions Fanon described — internalized
                inferiority, cultural alienation — remain subjects of intense
                discussion and activism.
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                What Was Won
              </h3>
              <NarrativeCard colour={GREEN}>
                <p style={{ margin: '0 0 12px' }}>
                  For all the complications, something extraordinary happened between
                  1945 and 1975. Hundreds of millions of people gained the right to
                  govern themselves. The idea that one race had the right to rule
                  another was discredited. New literatures, philosophies, and political
                  traditions emerged. The UN expanded from 51 to 144 members, becoming
                  genuinely global for the first time.
                </p>
                <p style={{ margin: 0 }}>
                  Decolonization was messy, violent, incomplete, and often betrayed by
                  those who came after. But it remains one of the great liberation
                  movements in human history — and its story is far from over.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="The last great area of unredeemed earth — Africa — today stands on the threshold of its own redemption."
                attribution="W.E.B. Du Bois"
                colour={GREEN}
              />
              <QuoteBlock
                quote="Each generation must, out of relative obscurity, discover its mission, fulfill it, or betray it."
                attribution="Frantz Fanon, The Wretched of the Earth"
                colour={INDIGO}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
