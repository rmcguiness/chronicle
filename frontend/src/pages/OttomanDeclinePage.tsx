import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Theme colours ── */
const CRIMSON = '#dc2626';
const GOLD = '#f59e0b';
const ROYAL_BLUE = '#2563eb';
const EMERALD = '#10b981';
const AMBER = '#d97706';
const VIOLET = '#8b5cf6';
const TEAL = '#14b8a6';
const ROSE = '#f43f5e';
const SLATE = '#94a3b8';
const ASH = '#cbd5e1';
const BURGUNDY = '#991b1b';
const ORANGE = '#f97316';
const SKY = '#38bdf8';
const BLOOD_RED = '#7f1d1d';

const FIGURE_COLORS = [GOLD, CRIMSON, ROYAL_BLUE, EMERALD, AMBER, VIOLET, TEAL, ROSE];

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
  { label: '623 years', detail: 'Ottoman Empire ruled from 1299 to 1922 — one of the longest-lasting empires in history' },
  { label: '5.2 million km\u00B2', detail: 'At peak: spanning three continents — Southeast Europe, Western Asia, and North Africa' },
  { label: '12 wars', detail: 'Russo-Ottoman wars between 1568 and 1918 — three centuries of conflict with Russia' },
  { label: '600K\u20131.5M killed', detail: 'Armenian Genocide (1915\u20131923) — first genocide of the 20th century' },
  { label: 'Overnight illiteracy', detail: 'Atat\u00FCrk replaced Arabic script with Latin alphabet in 1928 — entire population had to relearn reading' },
  { label: '1934', detail: 'Turkish women got the vote — 10 years before French women' },
];

/* ── Vienna and the Turn ── */
const VIENNA_TIMELINE: TimelineEntry[] = [
  { year: '1683', title: 'Second Siege of Vienna', description: 'The Ottomans make their second attempt to take Vienna with 150,000 troops. A Polish-Habsburg-German coalition led by King Jan III Sobieski smashes the Ottoman army in one of history\'s decisive battles. The largest cavalry charge in history — 18,000 horsemen — breaks the siege.', color: CRIMSON },
  { year: '1683\u20131699', title: 'The Great Turkish War', description: 'After Vienna, a Holy League of European powers pushes the Ottomans back across the Balkans. For the first time, the empire is losing territory in Europe — a psychological shock as much as a military one.', color: ORANGE },
  { year: '1699', title: 'Treaty of Karlowitz', description: 'The first major Ottoman territorial loss in Europe. Hungary, Transylvania, and Slavonia go to the Habsburgs. Morea goes to Venice. Podolia goes to Poland. The empire that had only ever expanded is now shrinking.', color: AMBER },
];

/* ── Sick Man of Europe ── */
const SICK_MAN_INSIGHTS: InsightEntry[] = [
  { label: 'Tsar Nicholas I\'s Diagnosis (1853)', detail: '"We have on our hands a sick man — a very sick man." The Russian Tsar\'s famous phrase for the Ottoman Empire became its epitaph. European powers circled like vultures, debating not whether the empire would fall but how to divide the spoils.' },
  { label: 'Military Technology Gap', detail: 'European armies adopted musket drills, professional officer corps, and industrial-era weapons. The Ottomans clung to traditional cavalry tactics and feudal levies. By the 1800s, the technological gap was insurmountable.' },
  { label: 'The Feudal Trap', detail: 'The timar system (land grants to cavalry officers) that once made the empire strong now prevented reform. Landed elites blocked any change that threatened their privileges — a pattern repeated across declining empires.' },
  { label: 'Economic Dependence', detail: 'The Capitulations — trade privileges granted to European powers — turned the empire into a semi-colonial economy. European manufactured goods destroyed Ottoman crafts. The empire became a raw material exporter, dependent on foreign loans.' },
  { label: 'The Janissary Problem', detail: 'Once the empire\'s elite fighting force, the Janissaries became a conservative power bloc. They murdered reforming sultans, blocked military modernization, and ran Istanbul\'s protection rackets. Sultan Mahmud II finally abolished them in the "Auspicious Incident" of 1826 — massacring thousands.' },
  { label: '12 Russo-Ottoman Wars', detail: 'From 1568 to 1918, Russia fought the Ottomans twelve times — more than any other pair of empires in history. Russia wanted warm-water ports, control of the Straits, and "protection" of Orthodox Christians. Each war cost the Ottomans territory, prestige, and lives.' },
];

/* ── Tanzimat Reforms ── */
const TANZIMAT_INSIGHTS: InsightEntry[] = [
  { label: 'G\u00FClhane Edict (1839)', detail: 'The Rose Chamber decree launched the Tanzimat — "reorganization." Guaranteed life, honour, and property for all subjects regardless of religion. On paper, revolutionary. In practice, enforcement was another matter entirely.' },
  { label: 'Equal Rights for Non-Muslims', detail: 'For the first time, Christians and Jews were declared legally equal to Muslims. This outraged conservative Muslims who saw the millet system — separate governance for each religious community — as divinely ordained.' },
  { label: 'Modern Courts and Education', detail: 'Secular courts were established alongside religious ones. New schools taught science, mathematics, and foreign languages. Military academies trained officers in European methods. A new bureaucratic elite began to emerge.' },
  { label: 'Inspired by European Enlightenment', detail: 'Young Ottoman intellectuals who had studied in Paris and London brought back ideas of constitutionalism, citizenship, and national identity. They believed modernization could save the empire — if only the Sultan would listen.' },
  { label: 'Resistance and Corruption', detail: 'Religious conservatives saw reforms as betrayal of Islam. Provincial governors ignored edicts from Istanbul. Corruption was endemic — reform decrees were published, celebrated, and then quietly shelved.' },
  { label: 'Ottoman Constitution (1876)', detail: 'The first constitutional monarchy in the Muslim world. Midhat Pasha drafted a constitution with a parliament, civil rights, and limits on sultanic power. It lasted 2 years. Sultan Abd\u00FClhamid II suspended it in 1878 and ruled as an autocrat for 30 years.' },
];

/* ── Nationalism and Balkans ── */
const BALKANS_TIMELINE: TimelineEntry[] = [
  { year: '1821\u20131829', title: 'Greek War of Independence', description: 'The first successful nationalist uprising against the Ottomans. European romantics — Lord Byron, Delacroix — championed the Greek cause. Britain, France, and Russia intervened, destroying the Ottoman fleet at Navarino (1827). Greece becomes independent in 1829.', color: ROYAL_BLUE },
  { year: '1804\u20131817', title: 'Serbian Revolts', description: 'Two uprisings win Serbia autonomous status within the empire. The Serbian state gradually expands through the century, becoming a model for other Balkan nationalist movements — and a thorn in Ottoman and later Habsburg sides.', color: EMERALD },
  { year: '1877\u20131878', title: 'Russo-Turkish War', description: 'Russia invades in support of Bulgarian rebels. The Ottoman army, despite fierce resistance at Plevna, is defeated. The war costs the empire Bulgaria, parts of Romania, and territory in the Caucasus.', color: CRIMSON },
  { year: '1878', title: 'Congress of Berlin', description: 'European powers redraw the map of the Balkans. Romania, Serbia, and Montenegro gain full independence. Bulgaria becomes autonomous. Austria-Hungary occupies Bosnia. Britain takes Cyprus. The "Eastern Question" becomes: who gets what when the empire dies?', color: AMBER },
  { year: '1908', title: 'Young Turk Revolution', description: 'Military officers of the Committee of Union and Progress (CUP) force Sultan Abd\u00FClhamid II to restore the constitution. Initial euphoria — Muslims, Christians, and Jews celebrate in the streets. But the Young Turks\' nationalism soon alienates non-Turkish minorities.', color: VIOLET },
  { year: '1912\u20131913', title: 'Balkan Wars', description: 'The final catastrophe in Europe. Greece, Serbia, Bulgaria, and Montenegro ally against the Ottomans and strip them of almost all remaining European territory in just two wars. The empire loses 83% of its European land and 69% of its European population. Istanbul is nearly surrounded by enemies.', color: CRIMSON },
];

/* ── Armenian Genocide ── */
const ARMENIAN_GENOCIDE: InsightEntry[] = [
  { label: 'Background', detail: 'Armenians were one of the oldest Christian communities in the world, living in Anatolia for millennia. As a prosperous but vulnerable minority in a Muslim empire, they occupied a precarious position — especially as nationalist ideologies replaced religious tolerance.' },
  { label: 'Accusation of Collaboration', detail: 'During WWI, the Young Turk government accused Armenians of collaborating with Russia. While some Armenian volunteers did fight for Russia, the vast majority were loyal Ottoman subjects. The accusation became a pretext for mass violence.' },
  { label: 'Systematic Deportation and Massacre', detail: 'Beginning in April 1915, Armenian intellectuals were arrested in Istanbul. Then came deportation orders: entire communities marched into the Syrian desert without food or water. Men were separated and shot. Women and children died on death marches. Villages were burned. Property was confiscated.' },
  { label: '600,000\u20131.5 Million Killed', detail: 'Estimates of the death toll range from 600,000 to 1.5 million. The International Association of Genocide Scholars puts the figure at over 1 million. An entire civilization — churches, schools, businesses, communities stretching back thousands of years — was destroyed.' },
  { label: 'First Genocide of the 20th Century', detail: 'The Armenian Genocide set a terrible precedent. Hitler reportedly said in 1939: "Who, after all, speaks today of the annihilation of the Armenians?" — using the world\'s indifference as licence for the Holocaust.' },
  { label: 'Raphael Lemkin and the Word "Genocide"', detail: 'Polish-Jewish lawyer Raphael Lemkin coined the word "genocide" in 1944, citing the Armenian massacres as a defining example. His work led to the UN Genocide Convention of 1948. The word itself was born from this tragedy.' },
  { label: 'Modern Recognition Controversy', detail: 'Turkey officially denies that the events constituted genocide, arguing they were wartime casualties and intercommunal violence. Over 30 countries, including the United States (2019), France, Germany, and Russia, formally recognize the Armenian Genocide. Most historians consider the evidence overwhelming.' },
];

/* ── WWI and the End ── */
const WWI_TIMELINE: TimelineEntry[] = [
  { year: '1914', title: 'Ottomans Join the Central Powers', description: 'Enver Pasha, the ambitious Young Turk war minister, brings the empire into WWI on Germany\'s side. It proves a fatal mistake. The empire is already exhausted from the Balkan Wars and cannot sustain a multi-front conflict.', color: CRIMSON },
  { year: '1915\u20131916', title: 'Gallipoli Campaign', description: 'The Allies attempt to seize the Dardanelles and capture Istanbul. An amphibious assault at Gallipoli fails catastrophically against fierce Ottoman resistance. The campaign\'s hero: Colonel Mustafa Kemal, who tells his troops: "I don\'t order you to fight — I order you to die." He would later become Atat\u00FCrk.', color: EMERALD },
  { year: '1916', title: 'Arab Revolt', description: 'Sharif Hussein of Mecca, with British backing and the help of T.E. Lawrence ("Lawrence of Arabia"), launches an Arab revolt against Ottoman rule. The Arabs are promised independence — a promise Britain and France have no intention of keeping.', color: GOLD },
  { year: '1916', title: 'Sykes-Picot Agreement', description: 'In secret, Britain and France draw lines on a map dividing the Arab provinces of the Ottoman Empire between themselves. Sir Mark Sykes and Fran\u00E7ois Georges-Picot create borders with little regard for ethnic, religious, or tribal realities. These lines become Iraq, Syria, Lebanon, Jordan, and Palestine.', color: ORANGE },
  { year: '1917', title: 'Balfour Declaration', description: 'British Foreign Secretary Arthur Balfour writes a letter promising "a national home for the Jewish people" in Ottoman/British-administered Palestine. One sentence, 67 words — laying the foundation for a century of conflict that continues today.', color: SKY },
  { year: '1918', title: 'Armistice of Mudros', description: 'The Ottoman Empire surrenders on October 30, 1918. Allied warships anchor in Istanbul\'s harbour. The empire that once made Europe tremble is occupied, partitioned, and humiliated. Six centuries of Ottoman rule end not with a battle but with a signature.', color: BURGUNDY },
];

/* ── Turkish War of Independence ── */
const INDEPENDENCE_TIMELINE: TimelineEntry[] = [
  { year: '1919', title: 'Greek Landing at Smyrna', description: 'With Allied approval, Greek forces land at Smyrna (Izmir). The Treaty of S\u00E8vres proposes carving up Anatolia itself — giving pieces to Greece, Armenia, Kurdistan, Italy, and France. The Turkish heartland is to be dismembered.', color: CRIMSON },
  { year: '1919', title: 'Mustafa Kemal Organizes Resistance', description: 'Sent to Anatolia ostensibly to disband remaining Ottoman forces, Kemal instead organizes a nationalist resistance movement. From Ankara, he defies both the Allies and the Sultan in Istanbul. A new Turkish government — the Grand National Assembly — is declared.', color: EMERALD },
  { year: '1921', title: 'Battle of Sakarya', description: 'Greek forces advance to within 80 km of Ankara. Kemal takes personal command. The 21-day Battle of Sakarya — one of the longest pitched battles in history — turns the tide. The Greeks are stopped and begin to retreat.', color: GOLD },
  { year: '1922', title: 'The Great Offensive', description: 'Kemal launches a decisive counterattack. The Greek army is routed and driven back to the sea. Smyrna is recaptured in September 1922 amid devastating fires and mass violence. The Greek population of Anatolia, present for 3,000 years, is expelled.', color: AMBER },
  { year: '1923', title: 'Treaty of Lausanne', description: 'Unlike the humiliating Treaty of S\u00E8vres, Lausanne is negotiated between equals. The Allies recognize the borders of modern Turkey. A massive population exchange: 1.2 million Greeks leave Turkey; 400,000 Muslims leave Greece. The modern Turkish state is born.', color: TEAL },
];

/* ── Atat\u00FCrk's Revolution ── */
const ATATURK_REFORMS: InsightEntry[] = [
  { label: 'Abolishes the Sultanate (1922)', detail: 'The last Ottoman sultan, Mehmed VI, flees Istanbul on a British warship. The 600-year Ottoman dynasty ends not with a revolution but with a quiet departure. The sultanate is formally abolished on November 1, 1922.' },
  { label: 'Abolishes the Caliphate (1924)', detail: 'Even more radical: Atat\u00FCrk abolishes the Islamic caliphate — the spiritual leadership of the Muslim world that the Ottomans had claimed since 1517. Muslims worldwide are shocked. Turkey declares itself a secular republic.' },
  { label: 'Republic of Turkey (October 29, 1923)', detail: 'Atat\u00FCrk declares the Republic of Turkey with its capital in Ankara — not Istanbul. Deliberately distancing the new nation from the Ottoman past. Atat\u00FCrk becomes the first president.' },
  { label: 'Latin Alphabet (1928)', detail: 'Overnight, the Arabic script used for 600 years is replaced with a Latin alphabet. The entire population effectively becomes "illiterate" and must relearn reading and writing. Atat\u00FCrk personally tours the country, teaching the new letters on blackboards.' },
  { label: 'Secular Law Codes', detail: 'Islamic sharia law is replaced with European-style civil, criminal, and commercial codes adapted from Switzerland, Italy, and Germany. Religious courts are abolished. Civil marriage becomes mandatory.' },
  { label: 'Women\'s Suffrage (1934)', detail: 'Turkish women gain the right to vote and run for parliament — before women in France (1944), Italy (1946), Belgium (1948), and Switzerland (1971). Atat\u00FCrk saw women\'s emancipation as essential to modernization.' },
  { label: 'Banning Religious Dress', detail: 'The fez (men\'s hat associated with Ottoman identity) is banned. Turbans and veils are discouraged. Western-style clothing is promoted. Atat\u00FCrk: "The civilized international dress is worthy and appropriate for our nation, and we will wear it."' },
  { label: '"Father of the Turks"', detail: 'In 1934, a new surname law requires all Turks to adopt family names (previously unnecessary). The parliament grants Kemal the surname "Atat\u00FCrk" — Father of the Turks. He remains the most revered figure in Turkey. Insulting his memory is still a criminal offence.' },
];

/* ── Ottoman Legacy in Middle East ── */
const MIDDLE_EAST_LEGACY: InsightEntry[] = [
  { label: 'Sykes-Picot Straight Lines', detail: 'Iraq, Syria, Lebanon, Jordan, Palestine — all drawn on a map by two European diplomats with little regard for who actually lived there. Sunni, Shia, Kurdish, Christian, and Druze communities were trapped within arbitrary borders. These lines still cause wars today.' },
  { label: 'Iraq\'s Impossible Borders', detail: 'The British stapled together three Ottoman provinces — Kurdish Mosul, Sunni Baghdad, and Shia Basra — into a single country. The resulting state has never been stable. The 2003 invasion and ISIS\'s rise were consequences of borders drawn a century ago.' },
  { label: 'The Kurdish Question', detail: 'The Kurds — the world\'s largest ethnic group without a state (~40 million people) — were divided among Turkey, Iraq, Syria, and Iran. The Treaty of S\u00E8vres (1920) promised them a state. The Treaty of Lausanne (1923) took it away. They\'re still fighting for autonomy.' },
  { label: 'Saudi Arabia and Wahhabism', detail: 'The Saudi-Wahhabi alliance opposed Ottoman religious authority. When the empire fell, the Saudis conquered the Arabian Peninsula (1920s). Their ultraconservative interpretation of Islam — funded by oil wealth — became a global force, often in direct opposition to the Ottoman tradition of relative tolerance.' },
  { label: 'The Palestinian Question', detail: 'The Balfour Declaration (1917) promised a Jewish homeland in Ottoman/British-administered Palestine. Jewish immigration accelerated under the British Mandate. The conflicting promises to Arabs and Jews created a conflict that, a century later, shows no sign of resolution.' },
  { label: 'Sunni-Shia Divisions', detail: 'The Ottomans, as Sunni rulers, had managed multi-sectarian territories for centuries. When artificial borders replaced imperial administration, sectarian identities became political identities. The Sunni-Shia fault line runs through Iraq, Syria, Lebanon, Bahrain, and Yemen.' },
];

/* ── Key Figures ── */
const KEY_FIGURES: FigureEntry[] = [
  { name: 'Mustafa Kemal Atat\u00FCrk', years: '1881\u20131938', contribution: 'Hero of Gallipoli, leader of the Turkish War of Independence, founder of the Republic of Turkey. Transformed a defeated empire into a modern secular state in a single decade. The most consequential leader of the early 20th century Middle East.' },
  { name: 'Sultan Mahmud II', years: '1785\u20131839', contribution: '"The Reformer" who destroyed the Janissaries in 1826 and launched the first serious modernization efforts. Westernized the army, reformed administration, and laid groundwork for the Tanzimat. Often compared to Peter the Great.' },
  { name: 'Midhat Pasha', years: '1822\u20131884', contribution: 'The "Father of the Constitution" — architect of the 1876 Ottoman Constitution, the first in the Muslim world. Twice Grand Vizier. Later exiled and murdered on Sultan Abd\u00FClhamid II\'s orders for his liberal politics.' },
  { name: 'Sultan Abd\u00FClhamid II', years: '1842\u20131918', contribution: 'The "Red Sultan" who suspended the constitution and ruled autocratically for 30 years (1878\u20131908). Built the Hejaz Railway and expanded the secret police. Presided over massacres of Armenians in the 1890s. Deposed by the Young Turks.' },
  { name: 'Enver Pasha', years: '1881\u20131922', contribution: 'Young Turk leader who brought the empire into WWI on Germany\'s side — its fatal mistake. Ambitious, reckless, and pan-Turkist, he bears significant responsibility for the Armenian Genocide. Died fighting in Central Asia.' },
  { name: 'Talat Pasha', years: '1874\u20131921', contribution: 'Interior Minister during WWI and chief architect of the Armenian deportations and genocide. Fled after the war, was assassinated in Berlin in 1921 by Soghomon Tehlirian, an Armenian genocide survivor. The assassin was acquitted by a German jury.' },
  { name: 'T.E. Lawrence', years: '1888\u20131935', contribution: '"Lawrence of Arabia" — British intelligence officer who helped organize the Arab Revolt against the Ottomans. His Seven Pillars of Wisdom romanticized the campaign. He later called the broken promises to the Arabs his "deepest shame."' },
  { name: 'Sharif Hussein bin Ali', years: '1853\u20131931', contribution: 'Sharif of Mecca who launched the Arab Revolt (1916) against the Ottomans, believing British promises of an independent Arab kingdom. Betrayed by Sykes-Picot. His sons became kings of Iraq and Jordan — dynasties that survived because they served British interests.' },
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

/* ── Main Component ── */

export default function OttomanDeclinePage() {
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
              background: `linear-gradient(135deg, ${CRIMSON}, ${AMBER})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Sick Man of Europe &mdash; Ottoman Decline and the Birth of Modern Turkey (1683&ndash;1923)
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <p style={{ color: ASH, lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 800, marginBottom: 16 }}>
              The empire that lasted 623 years &mdash; longer than Rome, longer than any European dynasty &mdash;
              did not fall in a single moment. It spent two and a half centuries dying. From the failed siege
              of Vienna in 1683 to the declaration of the Turkish Republic in 1923, the Ottoman Empire fought
              a losing battle against European modernization, nationalist uprisings, and its own inability to reform.
            </p>
            <p style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 800 }}>
              This is the story of how the world&rsquo;s mightiest Islamic empire became &ldquo;the Sick Man of
              Europe,&rdquo; how its collapse redrew the map of the Middle East with lines that still cause wars
              today, and how one man &mdash; Mustafa Kemal Atat&uuml;rk &mdash; forged a modern nation from the
              wreckage in a single extraordinary decade.
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
                  backgroundColor: 'rgba(220,38,38,0.06)',
                  border: `1px solid ${CRIMSON}33`,
                  borderRadius: 10,
                  padding: '14px 18px',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: CRIMSON, fontWeight: 700, fontSize: '1.2rem', marginBottom: 4 }}>
                  {stat.label}
                </p>
                <p style={{ color: ASH, fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {stat.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── The High Point and the Turn ── */}
        <SectionWrapper
          id="vienna"
          icon="&#x1F3F0;"
          title="The High Point and the Turn (1683)"
          accentColor={CRIMSON}
          intro="The second siege of Vienna was the Ottoman high-water mark. Never again would Ottoman armies threaten the heart of Europe. The defeat triggered the Great Turkish War and the Treaty of Karlowitz — the first time the empire ceded significant European territory. The tide had turned, and it would never turn back."
        >
          <TimelineCard entries={VIENNA_TIMELINE} />
        </SectionWrapper>

        {/* ── Sick Man of Europe ── */}
        <SectionWrapper
          id="sick-man"
          icon="&#x1FA7A;"
          title={'The "Sick Man of Europe" (1700s\u20131800s)'}
          accentColor={ORANGE}
          intro="By the 18th century, the Ottoman Empire was falling behind Europe in every measurable way: military technology, economic output, scientific progress, administrative efficiency. The empire that had once terrified Christendom was now a subject of pity, contempt, and predatory diplomacy. European powers didn't ask if the empire would collapse — only how to profit from its death."
        >
          <InsightGrid items={SICK_MAN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Tanzimat Reforms ── */}
        <SectionWrapper
          id="tanzimat"
          icon="&#x1F4DC;"
          title="Tanzimat Reforms (1839\u20131876)"
          accentColor={TEAL}
          intro="Faced with existential decline, Ottoman reformers launched the Tanzimat — a top-down modernization effort inspired by the European Enlightenment. Equal rights for non-Muslims, modern courts, secular education, and eventually a constitution. The reforms were visionary on paper. In practice, they were undermined by conservative resistance, corruption, and a sultan who preferred autocracy."
        >
          <InsightGrid items={TANZIMAT_INSIGHTS} />
        </SectionWrapper>

        {/* ── Nationalism and the Balkans ── */}
        <SectionWrapper
          id="balkans"
          icon="&#x1F3F4;"
          title="Nationalism and the Balkans (1804\u20131913)"
          accentColor={ROYAL_BLUE}
          intro="The great destroyer of the Ottoman Empire was not a foreign army — it was an idea: nationalism. One by one, the empire's European subjects — Greeks, Serbs, Romanians, Bulgarians — demanded independence. European powers, eager to weaken the Ottomans, supported them. By 1913, the empire had lost almost all of its European territory."
        >
          <TimelineCard entries={BALKANS_TIMELINE} />
        </SectionWrapper>

        {/* ── Armenian Genocide ── */}
        <SectionWrapper
          id="armenian-genocide"
          icon="&#x1F56F;&#xFE0F;"
          title="The Armenian Genocide (1915\u20131923)"
          accentColor={BLOOD_RED}
          intro="The darkest chapter. During World War I, the Ottoman government carried out the systematic deportation and massacre of its Armenian population. Between 600,000 and 1.5 million Armenians were killed — the first genocide of the 20th century. The word 'genocide' itself was coined partly because of these events. This history demands honest, unflinching accounting."
        >
          <InsightGrid items={ARMENIAN_GENOCIDE} />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              marginTop: 20,
              backgroundColor: 'rgba(127,29,29,0.08)',
              border: `1px solid ${BLOOD_RED}44`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
              <strong style={{ color: ROSE }}>A Note on Historical Responsibility:</strong> The scholarly consensus
              is clear: the events of 1915&ndash;1923 constitute genocide under international law. The
              International Association of Genocide Scholars, the International Center for Transitional Justice,
              and over 30 national governments have formally recognized it. Acknowledging this history is not
              anti-Turkish &mdash; it is a commitment to historical truth and the memory of the victims.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── WWI and the End ── */}
        <SectionWrapper
          id="wwi"
          icon="&#x1F4A3;"
          title="World War I and the End of Empire (1914\u20131918)"
          accentColor={AMBER}
          intro="The Ottoman decision to enter WWI on the side of Germany and Austria-Hungary sealed its fate. The empire fought on multiple fronts — Gallipoli, Mesopotamia, the Caucasus, Palestine, Arabia — and lost on most of them. But the war also produced the man who would build Turkey from the ruins: Mustafa Kemal."
        >
          <TimelineCard entries={WWI_TIMELINE} />
          {/* ── Sykes-Picot Callout ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              marginTop: 24,
              backgroundColor: 'rgba(249,115,22,0.06)',
              border: `1px solid ${ORANGE}44`,
              borderRadius: 10,
              padding: 20,
            }}
          >
            <h4 style={{ color: ORANGE, fontWeight: 700, fontSize: '1.1rem', marginBottom: 10 }}>
              Sykes-Picot: Lines Drawn on a Map That Still Cause Wars Today
            </h4>
            <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem', marginBottom: 10 }}>
              In 1916, Sir Mark Sykes (British) and Fran&ccedil;ois Georges-Picot (French) took a map of the
              Ottoman Arab provinces and drew straight lines across it. France got Syria and Lebanon. Britain got
              Iraq, Jordan, and Palestine. No one asked the people who lived there.
            </p>
            <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
              These arbitrary borders &mdash; cutting through tribal, ethnic, and religious communities &mdash;
              created states that were never meant to be nations. Iraq combined three mutually hostile provinces.
              Syria lumped together Sunnis, Alawites, Kurds, Christians, and Druze. Lebanon became a sectarian
              patchwork. Palestine was promised to both Arabs and Jews. A century later, every one of these borders
              is a source of conflict.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── Turkish War of Independence ── */}
        <SectionWrapper
          id="independence"
          icon="&#x2694;&#xFE0F;"
          title="The Turkish War of Independence (1919\u20131923)"
          accentColor={EMERALD}
          intro="When the Allies tried to partition Anatolia itself, they pushed too far. Mustafa Kemal — the hero of Gallipoli — organized a nationalist resistance from Ankara, defied the Sultan, defeated the Greek invasion, and forced the Allies to recognize a sovereign Turkish state. It was one of the most remarkable military and political achievements of the 20th century."
        >
          <TimelineCard entries={INDEPENDENCE_TIMELINE} />
        </SectionWrapper>

        {/* ── Atat\u00FCrk's Revolution ── */}
        <SectionWrapper
          id="ataturk"
          icon="&#x2B50;"
          title="Atat\u00FCrk\u2019s Revolution (1922\u20131938)"
          accentColor={GOLD}
          intro="What Atat\u00FCrk accomplished in a single decade has no parallel in modern history. He abolished a 600-year sultanate, eliminated the Islamic caliphate, replaced Arabic script with Latin letters, gave women the vote, separated mosque from state, and dragged a medieval empire into the 20th century — often over the furious resistance of his own people."
        >
          <InsightGrid items={ATATURK_REFORMS} />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              marginTop: 20,
              backgroundColor: 'rgba(245,158,11,0.06)',
              border: `1px solid ${GOLD}33`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
              <strong style={{ color: GOLD }}>The Alphabet Revolution:</strong> On November 1, 1928, the Latin
              alphabet became mandatory. Arabic-script books became unreadable overnight. Atat&uuml;rk personally
              traveled the country with a blackboard, teaching the new letters in village squares. Within a decade,
              literacy rates soared from ~10% to over 30%. It was cultural revolution by decree &mdash; and it worked.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── Ottoman Legacy in the Modern Middle East ── */}
        <SectionWrapper
          id="legacy"
          icon="&#x1F5FA;&#xFE0F;"
          title="The Ottoman Legacy in the Modern Middle East"
          accentColor={VIOLET}
          intro="The Ottoman Empire's collapse didn't just end a dynasty — it created the modern Middle East. The borders drawn by European diplomats, the promises broken to Arabs and Kurds, the sectarian divisions exploited and hardened, the Palestinian question born from competing colonial pledges — all trace directly back to the Ottoman endgame. Understanding these origins is essential to understanding why the region remains in turmoil a century later."
        >
          <InsightGrid items={MIDDLE_EAST_LEGACY} />
        </SectionWrapper>

        {/* ── Key Figures ── */}
        <SectionWrapper
          id="figures"
          icon="&#x1F464;"
          title="Key Figures of the Ottoman Decline"
          accentColor={GOLD}
          intro="From reforming sultans to nationalist revolutionaries, from genocide architects to liberation heroes — these are the people who shaped the Ottoman endgame and the birth of the modern Middle East."
        >
          <FigureGrid figures={KEY_FIGURES} />
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
                { to: '/ottoman-empire', label: 'Ottoman Empire: Rise & Peak' },
                { to: '/wwi', label: 'World War I' },
                { to: '/decolonization', label: 'Decolonization' },
                { to: '/arab-spring', label: 'The Arab Spring' },
              ].map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  style={{
                    color: CRIMSON,
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    padding: '8px 16px',
                    border: `1px solid ${CRIMSON}44`,
                    borderRadius: 8,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${CRIMSON}15`)}
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
            &ldquo;I don&rsquo;t order you to fight &mdash; I order you to die.&rdquo; &mdash; Mustafa Kemal at Gallipoli, 1915
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            &larr; Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
