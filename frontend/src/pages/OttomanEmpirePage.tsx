/**
 * OttomanEmpirePage — curated topic page: Ottoman Empire deep-dive.
 *
 * Route: /ottoman-empire
 *
 * Sections:
 *  1. Hero — "The Ottoman Empire — 600 Years at the Crossroads of Civilizations (1299–1922)"
 *  2. Tab navigation — switch between sections
 *  3. Timeline — 6 major periods (Rise, Height, Stagnation, Decline, Reform, Fall)
 *  4. Sultans — 20+ key sultans with reign dates, achievements, legacy
 *  5. Constantinople — 1453 conquest dedicated section
 *  6. Empire at Peak — territory, population, trade routes
 *  7. Governance — millet system, devshirme, grand viziers, harem politics
 *  8. Military — janissaries, artillery, navy, siege warfare
 *  9. Culture — mosques, literature, miniature art, calligraphy, cuisine
 * 10. Economy — Silk Road, trade, currency, agriculture
 * 11. Europe — Crusades, Vienna 1683, capitulations, Eastern Question
 * 12. Decline — military defeats, Tanzimat, nationalism, WWI
 * 13. Fall — WWI defeat, Sèvres, Atatürk, Turkish Republic
 * 14. Legacy — 20+ modern nations, ongoing disputes, cultural impact
 * 15. Territory Map — interactive CSS/SVG expansion/contraction visual
 *
 * All data is static/curated — no backend API needed.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme — rich Ottoman palette: deep crimson, gold, teal
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#c41e3a'; // Ottoman crimson
const BG = '#0a0c10'; // near-black
const TEXT = '#e8e4de'; // warm off-white
const TEXT_DIM = '#9a9486'; // muted
const TEXT_MUTED = '#6b6458'; // darker muted
const CARD_BG = 'rgba(196,30,58,0.05)';
const CARD_BORDER = 'rgba(196,30,58,0.18)';
const GOLD = '#c9a84c'; // Ottoman gold
const TEAL = '#1a8a7d'; // tile teal
const CRIMSON = '#c41e3a';
const NAVY = '#1e3a5f'; // maritime
const PURPLE = '#6b3fa0'; // court
const EARTH = '#8b6914'; // Anatolian earth
const SAND = '#b8a070'; // desert

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type SectionTab = 'timeline' | 'sultans' | 'constantinople' | 'peak' | 'governance' | 'military' | 'culture' | 'economy' | 'europe' | 'decline' | 'fall' | 'legacy' | 'map';

interface Period {
  name: string;
  years: string;
  events: { date: string; title: string; detail: string }[];
  color: string;
}

interface Sultan {
  name: string;
  reign: string;
  epithet?: string;
  achievements: string;
  legacy: string;
  color: string;
  icon: string;
}

interface GovernanceTopic {
  title: string;
  description: string;
  details: string;
  icon: string;
  color: string;
}

interface MilitaryBranch {
  name: string;
  description: string;
  details: string;
  icon: string;
  color: string;
}

interface CultureItem {
  title: string;
  description: string;
  details: string;
  icon: string;
  color: string;
}

interface EuropeEvent {
  title: string;
  date: string;
  description: string;
  significance: string;
  color: string;
}

interface DeclineFactor {
  title: string;
  description: string;
  details: string;
  icon: string;
  color: string;
}

interface LegacyItem {
  title: string;
  text: string;
  color: string;
}

interface TerritoryEra {
  year: number;
  label: string;
  widthPct: number;
  heightPct: number;
  color: string;
  provinces: number;
  population: string;
  note: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data — Timeline Periods
// ─────────────────────────────────────────────────────────────────────────────

const PERIODS: Period[] = [
  {
    name: 'Rise of the Beylik',
    years: '1299–1453',
    color: EARTH,
    events: [
      { date: '1299', title: 'Founding of the Ottoman Beylik', detail: 'Osman I declares independence from the Seljuk Sultanate of Rum, establishing a small principality in northwestern Anatolia near Söğüt.' },
      { date: '1326', title: 'Capture of Bursa', detail: 'Orhan captures Bursa from the Byzantines, making it the first major Ottoman capital. The city becomes a center of trade and culture.' },
      { date: '1354', title: 'First European Foothold — Gallipoli', detail: 'Ottomans cross into Europe by seizing the Gallipoli peninsula after an earthquake damages its fortifications.' },
      { date: '1361', title: 'Capture of Adrianople (Edirne)', detail: 'Murad I conquers Adrianople, which becomes the new Ottoman capital and springboard for Balkan expansion.' },
      { date: '1389', title: 'Battle of Kosovo', detail: 'Murad I defeats a coalition of Serbian, Bosnian, and Albanian forces. Murad is killed but Ottoman control over the Balkans is secured.' },
      { date: '1396', title: 'Battle of Nicopolis', detail: 'Bayezid I crushes the last major Crusade, defeating a pan-European army led by Hungary. Europe is shocked.' },
      { date: '1402', title: 'Battle of Ankara — Interregnum begins', detail: 'Timur (Tamerlane) defeats and captures Bayezid I. The empire fractures into civil war among Bayezid\'s sons (1402–1413).' },
      { date: '1413–1421', title: 'Mehmed I reunites the empire', detail: 'After a decade of civil war, Mehmed I defeats his brothers and restores Ottoman unity, earning the title "the Restorer."' },
      { date: '1444', title: 'Battle of Varna', detail: 'Murad II defeats a Crusader army led by King Władysław III of Poland-Hungary, ending the last serious Crusade against the Ottomans.' },
    ],
  },
  {
    name: 'Imperial Height',
    years: '1453–1566',
    color: GOLD,
    events: [
      { date: '1453', title: 'Fall of Constantinople', detail: 'Mehmed II "the Conqueror" breaches the Theodosian Walls after a 53-day siege, ending the Byzantine Empire. Constantinople becomes Istanbul, the new capital.' },
      { date: '1459–1463', title: 'Conquest of Serbia & Bosnia', detail: 'Mehmed II annexes Serbia (1459) and Bosnia (1463), consolidating Ottoman control over the central Balkans.' },
      { date: '1517', title: 'Conquest of Egypt — Caliphate claimed', detail: 'Selim I defeats the Mamluks at Ridaniya, absorbing Egypt, Syria, and the Hejaz. The Ottomans claim custodianship of the Holy Cities and the Caliphate.' },
      { date: '1521', title: 'Capture of Belgrade', detail: 'Suleiman the Magnificent takes Belgrade, the key fortress guarding central Europe, opening the road to Hungary.' },
      { date: '1526', title: 'Battle of Mohács', detail: 'Suleiman destroys the Hungarian army in under two hours. King Louis II drowns fleeing. Hungary is partitioned, with the Ottomans controlling the center.' },
      { date: '1529', title: 'First Siege of Vienna', detail: 'Suleiman besieges Vienna but is forced to withdraw after supply lines overextend. It marks the western limit of Ottoman expansion in Europe.' },
      { date: '1538', title: 'Battle of Preveza — Mediterranean dominance', detail: 'Hayreddin Barbarossa defeats a combined Christian fleet, establishing Ottoman naval supremacy in the Mediterranean for decades.' },
      { date: '1553–1555', title: 'Ottoman-Safavid Peace — Treaty of Amasya', detail: 'Suleiman secures Iraq (including Baghdad) from Safavid Persia. The treaty defines the Ottoman-Persian border for decades.' },
    ],
  },
  {
    name: 'Stagnation & Transformation',
    years: '1566–1699',
    color: NAVY,
    events: [
      { date: '1566', title: 'Death of Suleiman at Szigetvár', detail: 'Suleiman dies during the siege of Szigetvár. His death marks the conventional end of the Ottoman "golden age." Selim II ("the Sot") succeeds.' },
      { date: '1571', title: 'Battle of Lepanto', detail: 'A Holy League fleet under Don John of Austria destroys the Ottoman navy off Greece. Though the fleet is rebuilt within a year, it signals the end of unchallenged sea power.' },
      { date: '1593–1606', title: 'Long Turkish War', detail: 'Thirteen years of inconclusive warfare with the Habsburgs in Hungary. The Treaty of Zsitvatorok (1606) is the first treaty where the Ottomans treat a European power as an equal.' },
      { date: '1622–1632', title: 'Janissary revolts & sultanicide', detail: 'Osman II is murdered by his own janissaries (1622) — a first in Ottoman history. Murad IV eventually restores order by brutally suppressing dissent.' },
      { date: '1645–1669', title: 'War of Crete', detail: 'The Ottomans besiege Candia (Heraklion) for 21 years — one of the longest sieges in history — finally wresting Crete from Venice.' },
      { date: '1656–1676', title: 'Köprülü Era — revival', detail: 'The Köprülü grand viziers (Mehmed, Fazıl Ahmed) restore fiscal discipline, rebuild the army, and reconquer territories, briefly reversing decline.' },
      { date: '1683', title: 'Second Siege of Vienna — the turning point', detail: 'Grand Vizier Kara Mustafa besieges Vienna. A relief army led by Polish King Jan III Sobieski routs the Ottomans. The empire never threatens central Europe again.' },
      { date: '1699', title: 'Treaty of Karlowitz', detail: 'The Ottomans cede Hungary, Transylvania, and most of Croatia to the Habsburgs, Morea to Venice, and Podolia to Poland. First major territorial loss.' },
    ],
  },
  {
    name: 'Decline & Retreat',
    years: '1699–1827',
    color: SAND,
    events: [
      { date: '1718', title: 'Treaty of Passarowitz', detail: 'Further losses to Austria (Belgrade, northern Serbia). The Tulip Era (1718–1730) follows — a period of cultural Westernization under Grand Vizier Nevşehirli Ibrahim Pasha.' },
      { date: '1730', title: 'Patrona Halil Revolt', detail: 'A janissary-led rebellion overthrows Ahmed III and ends the Tulip Era. The cycle of reform and reaction begins.' },
      { date: '1768–1774', title: 'Russo-Turkish War — Treaty of Küçük Kaynarca', detail: 'Russia defeats the Ottomans decisively. The treaty grants Russia rights to protect Orthodox Christians in the empire — a pretext for future intervention.' },
      { date: '1789', title: 'Selim III begins reforms', detail: 'Selim III creates the Nizam-i Cedid ("New Order") — a European-style army. Conservative opposition from the janissaries mounts.' },
      { date: '1798', title: 'Napoleon invades Egypt', detail: 'French invasion of Ottoman Egypt shocks the empire and reveals its military weakness. Britain helps expel the French by 1801.' },
      { date: '1804–1817', title: 'Serbian Revolution', detail: 'Serbian uprisings lead to autonomous status — the first Balkan Christian territory to break free from direct Ottoman rule.' },
      { date: '1821–1829', title: 'Greek War of Independence', detail: 'Greece wins independence with European support. The Treaty of Adrianople (1829) recognizes Greek sovereignty — a model for Balkan nationalism.' },
      { date: '1826', title: 'Abolition of the Janissaries — "Auspicious Incident"', detail: 'Mahmud II destroys the Janissary corps by artillery fire in their barracks. Thousands are killed. A modern army replaces the centuries-old institution.' },
    ],
  },
  {
    name: 'Reform Era (Tanzimat)',
    years: '1827–1908',
    color: TEAL,
    events: [
      { date: '1839', title: 'Gülhane Edict — Tanzimat begins', detail: 'The edict guarantees life, honor, and property for all subjects regardless of religion. It launches the Tanzimat reform era, modernizing law, education, and administration.' },
      { date: '1853–1856', title: 'Crimean War', detail: 'The Ottomans ally with Britain and France against Russia. Victory at Sevastopol props up the empire, and the Treaty of Paris (1856) admits the Ottomans into the "Concert of Europe."' },
      { date: '1856', title: 'Reform Edict (Islahat Fermanı)', detail: 'Extends equal citizenship to all religious communities. Non-Muslims gain access to military and civil service — creating both opportunity and resentment.' },
      { date: '1876', title: 'First Ottoman Constitution', detail: 'Midhat Pasha drafts the first constitution establishing a parliament. Sultan Abdülhamid II accepts it — then suspends it within two years.' },
      { date: '1877–1878', title: 'Russo-Turkish War — Treaty of Berlin', detail: 'Devastating loss. Romania, Serbia, and Montenegro gain full independence. Bulgaria becomes autonomous. Bosnia-Herzegovina goes to Austria. The empire shrinks dramatically.' },
      { date: '1881–1908', title: 'Abdülhamid II\'s autocracy', detail: 'The "Red Sultan" rules without parliament for 30 years. Modernizes infrastructure (Hejaz Railway, telegraph, schools) while brutally suppressing dissent. The Armenian massacres of 1894–1896 draw international condemnation.' },
      { date: '1882', title: 'British occupation of Egypt', detail: 'Though nominally Ottoman, Egypt falls under permanent British military control, ending Ottoman influence over the Nile Valley.' },
    ],
  },
  {
    name: 'Fall of the Empire',
    years: '1908–1922',
    color: CRIMSON,
    events: [
      { date: '1908', title: 'Young Turk Revolution', detail: 'The Committee of Union and Progress (CUP) forces Abdülhamid II to restore the constitution. A brief era of optimism follows before factionalism takes over.' },
      { date: '1911–1912', title: 'Italo-Turkish War', detail: 'Italy seizes Libya (Tripolitania) and the Dodecanese islands. The empire loses its last African territory.' },
      { date: '1912–1913', title: 'Balkan Wars', detail: 'A coalition of Balkan states drives the Ottomans from nearly all European territory. The empire loses 83% of its European land and 69% of its European population.' },
      { date: '1914', title: 'Entry into World War I', detail: 'Enver Pasha brings the empire into WWI on the side of the Central Powers. Secret alliance with Germany signed August 2, 1914.' },
      { date: '1915', title: 'Gallipoli Campaign & Armenian Genocide', detail: 'Ottoman forces repel the Allied invasion at Gallipoli under Mustafa Kemal. Meanwhile, the CUP government carries out the genocide of 1–1.5 million Armenians.' },
      { date: '1916–1918', title: 'Arab Revolt & British advances', detail: 'Sharif Hussein launches the Arab Revolt with British support. Britain captures Baghdad (1917), Jerusalem (1917), and Damascus (1918).' },
      { date: '1918', title: 'Armistice of Mudros', detail: 'The Ottoman Empire surrenders on October 30, 1918. Allied forces occupy Istanbul. The empire is effectively finished.' },
      { date: '1920', title: 'Treaty of Sèvres', detail: 'The Allies partition Anatolia itself: zones for Greece, France, Italy, Armenia, and Kurdistan. The harshest peace treaty of WWI.' },
      { date: '1919–1922', title: 'Turkish War of Independence', detail: 'Mustafa Kemal organizes resistance from Ankara. Defeats Greek, French, and Armenian forces. The Treaty of Lausanne (1923) replaces Sèvres.' },
      { date: '1922', title: 'Abolition of the Sultanate', detail: 'The Grand National Assembly abolishes the Ottoman sultanate on November 1, 1922. Mehmed VI flees Istanbul on a British warship. 623 years of Ottoman rule end.' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Sultans
// ─────────────────────────────────────────────────────────────────────────────

const SULTANS: Sultan[] = [
  { name: 'Osman I', reign: '1299–1326', epithet: 'Founder', achievements: 'Founded the Ottoman beylik in northwestern Anatolia. Established the dynasty that would rule for over 600 years. Expanded territory from a small frontier principality.', legacy: 'The dynasty and empire bear his name (Osmanlı). Symbol of humble origins growing into world power.', color: EARTH, icon: '🏔️' },
  { name: 'Orhan', reign: '1326–1362', epithet: 'The Builder', achievements: 'Captured Bursa (1326) and made it the capital. Organized the first regular Ottoman army. Crossed into Europe (Gallipoli, 1354). Established the first Ottoman coinage.', legacy: 'Transformed a tribal confederation into a structured state with professional soldiers and institutions.', color: EARTH, icon: '🏗️' },
  { name: 'Murad I', reign: '1362–1389', epithet: 'Lord of the Horizon', achievements: 'Conquered Adrianople (Edirne) — moved capital to Europe. Created the devshirme system and Janissary corps. Won the Battle of Kosovo (1389), dying on the battlefield.', legacy: 'Made the Ottomans a European power. The devshirme system provided elite soldiers and administrators for centuries.', color: EARTH, icon: '⚔️' },
  { name: 'Bayezid I', reign: '1389–1402', epithet: 'Thunderbolt (Yıldırım)', achievements: 'Rapid conquests earned his nickname. Defeated the Crusade at Nicopolis (1396). Besieged Constantinople. Expanded into Anatolia.', legacy: 'His defeat by Timur at Ankara (1402) triggered the Ottoman Interregnum — a cautionary tale of overexpansion.', color: CRIMSON, icon: '⚡' },
  { name: 'Mehmed I', reign: '1413–1421', epithet: 'The Restorer (Çelebi)', achievements: 'Won the civil war among Bayezid\'s sons. Reunified the empire after the Interregnum. Restored order, rebuilt the army, stabilized finances.', legacy: 'Saved the dynasty from collapse. His patient diplomacy and reconciliation became a model for successor sultans.', color: TEAL, icon: '🕊️' },
  { name: 'Murad II', reign: '1421–1451', epithet: 'The Warrior', achievements: 'Defeated the Crusade at Varna (1444) and the Second Battle of Kosovo (1448). Consolidated Balkan holdings. Uniquely abdicated twice in favor of his son Mehmed.', legacy: 'Set the stage for the conquest of Constantinople. His victories eliminated the last European coalitions against the Ottomans.', color: NAVY, icon: '🛡️' },
  { name: 'Mehmed II', reign: '1444–1446, 1451–1481', epithet: 'The Conqueror (Fatih)', achievements: 'Conquered Constantinople (1453), ending the Byzantine Empire. Rebuilt the city as Istanbul. Conquered Greece, Serbia, Bosnia, Albania, Crimea. Codified Ottoman law (Kanunname).', legacy: 'One of history\'s greatest conquerors. Transformed Istanbul into a cosmopolitan imperial capital. His legal code governed the empire for centuries.', color: GOLD, icon: '👑' },
  { name: 'Bayezid II', reign: '1481–1512', epithet: 'The Just', achievements: 'Consolidated his father\'s conquests. Welcomed Sephardic Jews expelled from Spain (1492). Expanded the navy. Built mosques and charitable institutions across the empire.', legacy: 'The Ottoman welcome of Jewish refugees became a defining moment of multicultural governance.', color: TEAL, icon: '⚖️' },
  { name: 'Selim I', reign: '1512–1520', epithet: 'The Grim (Yavuz)', achievements: 'Conquered the Mamluk Sultanate — absorbed Egypt, Syria, Hejaz (1517). Claimed the Caliphate. Doubled the empire\'s size in 8 years. Patron of poetry.', legacy: 'Made the Ottomans custodians of Mecca and Medina, adding religious legitimacy to imperial power.', color: CRIMSON, icon: '🗡️' },
  { name: 'Suleiman I', reign: '1520–1566', epithet: 'The Magnificent / The Lawgiver', achievements: 'Took Belgrade (1521), Rhodes (1522), defeated Hungary at Mohács (1526), besieged Vienna (1529). Reformed the legal system. Patronized the architect Sinan. Alliance with France against the Habsburgs.', legacy: 'The Ottoman golden age. Known in Europe as "the Magnificent" and in the Islamic world as "the Lawgiver" (Kanuni). Under him the empire reached its greatest territorial extent.', color: GOLD, icon: '✨' },
  { name: 'Selim II', reign: '1566–1574', epithet: 'The Sot (Sarhoş)', achievements: 'Conquest of Cyprus (1570). Loss at Lepanto (1571) but rapid naval reconstruction. Expanded into Yemen and the Caucasus.', legacy: 'First sultan to leave governance largely to his grand vizier (Sokollu Mehmed Pasha), beginning the pattern of vizierial government.', color: NAVY, icon: '🍷' },
  { name: 'Murad III', reign: '1574–1595', achievements: 'War with Safavid Persia — conquered Azerbaijan, Georgia, parts of Iran. Population and imperial revenue peaked. Inflation and currency debasement began.', legacy: 'The empire was at its largest territorial extent but internal rot was setting in — corruption, inflation, and factional politics.', color: PURPLE, icon: '📜' },
  { name: 'Ahmed I', reign: '1603–1617', achievements: 'Built the Sultan Ahmed Mosque (Blue Mosque) in Istanbul. Ended the practice of fratricide — brothers were confined to the kafes (golden cage) instead. Treaty of Zsitvatorok (1606).', legacy: 'The kafes system preserved dynastic blood but produced sheltered, inexperienced sultans in later generations.', color: TEAL, icon: '🕌' },
  { name: 'Murad IV', reign: '1623–1640', epithet: 'The Last Warrior Sultan', achievements: 'Recaptured Baghdad from Safavid Persia (1638). Restored discipline — banned alcohol, tobacco, coffee (on pain of death). Personally led armies into battle.', legacy: 'Brief return to sultanate vigor. His early death at 27 cut short what might have been a thorough imperial reform.', color: CRIMSON, icon: '🔥' },
  { name: 'Mehmed IV', reign: '1648–1687', epithet: 'The Hunter', achievements: 'Reign defined by the Köprülü grand viziers who restored imperial fortunes. Conquest of Crete (1669). Launched the siege of Vienna (1683) — disastrous failure.', legacy: 'The failed siege of Vienna in 1683 is the single most consequential turning point in Ottoman decline.', color: SAND, icon: '🏹' },
  { name: 'Ahmed III', reign: '1703–1730', epithet: 'The Tulip King', achievements: 'Presided over the "Tulip Era" — cultural flowering, first Ottoman printing press (1727), Western-style gardens and palaces. Defeated Peter the Great at the Pruth (1711).', legacy: 'The Tulip Era represented the first systematic Ottoman engagement with European culture and technology.', color: PURPLE, icon: '🌷' },
  { name: 'Mahmud II', reign: '1808–1839', epithet: 'The Reformer', achievements: 'Destroyed the Janissary corps (1826, "Auspicious Incident"). Created a modern army. Reformed education, dress code, administration. Lost Greece but preserved the core.', legacy: 'The most consequential reforming sultan since Suleiman. Made the Tanzimat era possible by removing the conservative military establishment.', color: TEAL, icon: '⚡' },
  { name: 'Abdülmecid I', reign: '1839–1861', achievements: 'Issued the Gülhane Edict (1839) launching the Tanzimat reforms. Equal rights for all subjects. Modernized law, education, infrastructure. Built Dolmabahçe Palace. Allied with Britain and France in the Crimean War.', legacy: 'The Tanzimat era under Abdülmecid was the empire\'s best chance at becoming a modern constitutional state.', color: TEAL, icon: '📖' },
  { name: 'Abdülhamid II', reign: '1876–1909', epithet: 'The Red Sultan / Ulu Hakan', achievements: 'Built the Hejaz Railway, vast telegraph network, modern schools. Ruled as autocrat for 30 years after suspending the constitution. Pan-Islamic foreign policy. The Armenian massacres stain his reign.', legacy: 'Deeply polarizing: modernizer and despot. His infrastructure projects transformed the empire, but his repression fueled the Young Turk revolution.', color: CRIMSON, icon: '🕸️' },
  { name: 'Mehmed V', reign: '1909–1918', achievements: 'Figurehead sultan after the Young Turk revolution. Declared jihad at the start of WWI (largely ineffective). Presided over the Balkan Wars and entry into WWI.', legacy: 'Symbolized the sultanate\'s powerlessness as the CUP triumvirate (Enver, Talat, Cemal) made all real decisions.', color: SAND, icon: '👤' },
  { name: 'Mehmed VI', reign: '1918–1922', epithet: 'The Last Sultan', achievements: 'Signed the Treaty of Sèvres (1920). Attempted to suppress the Turkish nationalist movement in Ankara. Cooperated with Allied occupation.', legacy: 'The last Ottoman sultan. Fled Istanbul on a British warship (November 17, 1922). Died in exile in San Remo, Italy.', color: CRIMSON, icon: '🚢' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Governance
// ─────────────────────────────────────────────────────────────────────────────

const GOVERNANCE: GovernanceTopic[] = [
  { title: 'Millet System', description: 'Self-governing religious communities', details: 'Non-Muslim communities (Greek Orthodox, Armenian, Jewish) governed their own civil and religious affairs through their religious leaders. Each millet had its own courts, schools, and taxation systems. This pragmatic system allowed the empire to govern diverse populations with minimal friction, though it also entrenched communal identities that later fueled nationalism.', icon: '🏛️', color: TEAL },
  { title: 'Devshirme (Child Levy)', description: 'Elite recruitment from Christian families', details: 'Every few years, Ottoman officials selected promising Christian boys (ages 8–18) from Balkan villages. They were converted to Islam, rigorously educated, and trained for service as Janissaries (elite soldiers) or palace administrators. Graduates could rise to the highest offices — including Grand Vizier. The system was simultaneously a mechanism of social mobility and a form of forced assimilation.', icon: '👦', color: CRIMSON },
  { title: 'Grand Viziers', description: 'The sultan\'s chief minister — often the real ruler', details: 'The Grand Vizier (Sadrazam) held the sultan\'s seal and exercised executive power. In strong reigns, the vizier served the sultan; in weak reigns, viziers ruled the empire. The Köprülü family produced four grand viziers in succession (1656–1710), effectively creating a vizierial dynasty. Some viziers like Sokollu Mehmed Pasha and Ibrahim Pasha wielded more power than their sultans.', icon: '📜', color: GOLD },
  { title: 'Imperial Harem & Sultanate of Women', description: 'Political power behind the veil', details: 'The "Sultanate of Women" (1533–1656) saw mothers and wives of sultans wield enormous political influence. Hürrem Sultan (Roxelana, wife of Suleiman) broke precedent by becoming the first concubine to be legally married to a sultan. Kösem Sultan dominated politics for decades. The Valide Sultan (queen mother) was often the most powerful person after the sultan, controlling patronage, diplomacy, and succession.', icon: '👸', color: PURPLE },
  { title: 'Kanun (Secular Law)', description: 'Dual legal system: sharia and sultanic law', details: 'The Ottomans operated a dual legal framework: religious law (sharia) administered by the şeyhülislam and kadis, and sultanic law (kanun) issued by the sultan covering taxation, criminal law, and administration. Suleiman\'s kanunname codified this system so comprehensively that he earned the title "Kanuni" (Lawgiver). The şeyhülislam could theoretically veto sultanic decisions by declaring them incompatible with sharia.', icon: '⚖️', color: EARTH },
  { title: 'Timar System', description: 'Land grants in exchange for military service', details: 'Cavalry soldiers (sipahis) received timar grants — the right to collect taxes from specific lands in exchange for maintaining mounted soldiers ready for campaign. Similar to European feudalism but with important differences: timars were revocable, not hereditary, keeping the landed class dependent on the sultan. The system declined as gunpowder warfare reduced the importance of cavalry.', icon: '🐴', color: SAND },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Military
// ─────────────────────────────────────────────────────────────────────────────

const MILITARY: MilitaryBranch[] = [
  { name: 'Janissary Corps (Yeniçeri)', description: 'Elite infantry — the sultan\'s household troops', details: 'Recruited through the devshirme, Janissaries were the first standing professional army in Europe. Originally forbidden from marrying or engaging in trade, they were fanatically loyal to the sultan. Armed with muskets from the 15th century, they were the backbone of Ottoman military power. By the 17th century, discipline eroded — Janissaries became a hereditary caste, involved in politics, and a force of conservatism blocking reform. Mahmud II destroyed the corps in 1826.', icon: '🎖️', color: CRIMSON },
  { name: 'Ottoman Artillery', description: 'The great cannon that broke Constantinople', details: 'The Ottomans were early adopters and innovators of gunpowder artillery. For the 1453 siege, Hungarian engineer Orban cast the "Basilica" — a monster cannon firing 600-pound stone balls. Ottoman siege artillery became the most advanced in the world, reducing fortresses that had stood for centuries. The emphasis on heavy bombardment artillery gave the Ottomans a decisive edge in siege warfare throughout the 15th and 16th centuries.', icon: '💣', color: EARTH },
  { name: 'Ottoman Navy', description: 'From pirates to Mediterranean masters', details: 'The navy grew from nothing under Bayezid I to Mediterranean dominance under Suleiman. Admirals like Hayreddin Barbarossa, a former North African corsair, built a fleet that controlled from Algeria to the Persian Gulf. The Battle of Preveza (1538) established Ottoman naval supremacy. After Lepanto (1571), the fleet was rebuilt in under a year. The navy also operated on the Red Sea, Indian Ocean, and eventually attempted to challenge Portuguese dominance in the spice trade.', icon: '⛵', color: NAVY },
  { name: 'Siege Warfare', description: 'Specialists in taking fortified cities', details: 'Ottoman siege craft was perhaps their greatest military achievement. They combined heavy artillery bombardment with mining (tunneling under walls), naval blockade, psychological warfare, and patient starvation tactics. The siege of Constantinople (1453), Rhodes (1522), and Candia (1648–1669) showcase their methodology. Armies included specialized sappers, miners, and engineering corps who could redirect rivers and build massive earthworks.', icon: '🏰', color: SAND },
  { name: 'Sipahi Cavalry', description: 'Feudal cavalry — the timar-holding horsemen', details: 'Provincial sipahis served as heavy cavalry in exchange for timar land grants. They brought their own horses, armor, and retainers. At peak strength (15th–16th centuries), the sipahi-timar system could mobilize over 100,000 cavalry. As gunpowder infantry became dominant, sipahi cavalry declined in importance, and many timars were converted to tax farms, weakening the provincial military structure.', icon: '🐎', color: GOLD },
  { name: 'Akıncı Raiders', description: 'Fast-moving frontier raiders and scouts', details: 'Irregular light cavalry who operated ahead of the main army, raiding deep into enemy territory to gather intelligence, spread terror, and disrupt communications. Often Turkmen tribesmen, they could cover enormous distances. Their raids into Austria, Poland, and Italy spread fear of the "Turkish menace" across Europe. The akıncı tradition declined after the failed 1683 Vienna siege.', icon: '🏇', color: PURPLE },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Culture
// ─────────────────────────────────────────────────────────────────────────────

const CULTURE: CultureItem[] = [
  { title: 'Hagia Sophia', description: 'From cathedral to mosque to museum', details: 'Mehmed II converted the 1,000-year-old Byzantine cathedral into a mosque immediately after the conquest of Constantinople (1453). Minarets were added, Christian mosaics were plastered over (preserving them), and it became the model for Ottoman mosque architecture. Sinan\'s later mosques were attempts to surpass it. In 1934, Atatürk converted it to a museum; in 2020, Turkey reconverted it to a mosque — each change reflecting Ottoman legacy\'s political weight.', icon: '🕌', color: GOLD },
  { title: 'Architect Sinan & the Great Mosques', description: 'The Michelangelo of Ottoman architecture', details: 'Mimar Sinan (1489–1588), a devshirme recruit, became the greatest Ottoman architect. His masterpieces include the Şehzade Mosque (his "apprentice work"), the Süleymaniye Mosque (his "journeyman work"), and the Selimiye Mosque in Edirne (his "masterwork"). He designed over 300 structures including mosques, bridges, baths, and aqueducts. His innovations in dome engineering surpassed even Hagia Sophia.', icon: '🏗️', color: TEAL },
  { title: 'Blue Mosque (Sultan Ahmed Mosque)', description: 'Six minarets and 20,000 Iznik tiles', details: 'Built for Ahmed I (1609–1616), the Blue Mosque is named for the blue-painted interior decorated with over 20,000 handmade İznik tiles. Its six minarets caused controversy (only the mosque in Mecca had six). It faces Hagia Sophia across the Hippodrome, creating Istanbul\'s most iconic skyline. The complex includes a madrasa, hospital, market, and tomb.', icon: '💎', color: TEAL },
  { title: 'Topkapı Palace', description: 'Heart of empire for 400 years', details: 'Built by Mehmed II after 1453, Topkapı served as the imperial residence and seat of government until 1856. Its four courtyards housed the Imperial Council (Divan), the treasury, the harem (over 300 rooms), the holy relics, and kitchens that fed 5,000 daily. The palace complex was a city within a city, overlooking the Bosphorus, Golden Horn, and Sea of Marmara.', icon: '🏰', color: GOLD },
  { title: 'Miniature Painting & Calligraphy', description: 'The book arts of the Ottoman court', details: 'Ottoman miniature painting depicted court life, battles, and the sultan\'s exploits — notably in the Surname manuscripts (festival books). Unlike Western art, perspective was deliberately flattened. Calligraphy was the highest art form: the tughra (sultan\'s monogram) is among history\'s most sophisticated examples of calligraphic design. The imperial nakkaşhane (painting studio) employed hundreds of artists.', icon: '🎨', color: PURPLE },
  { title: 'Ottoman Literature & Poetry', description: 'Divan poetry — Persian forms, Turkish soul', details: 'Ottoman court poetry (Divan) drew heavily on Persian forms (ghazel, kaside) while developing a distinctly Ottoman voice. Poets like Fuzuli, Baki, and Nedim are still revered. Literature ranged from Sufi mystical poetry to bawdy satire. The Meddah tradition (professional storytellers) brought literature to common people. Evliya Çelebi\'s Seyahatname (Book of Travels) is a masterpiece of 17th-century travel writing.', icon: '📚', color: EARTH },
  { title: 'Ottoman Cuisine', description: 'The palace kitchen that shaped a region\'s food', details: 'Topkapı\'s kitchens employed over 1,300 cooks preparing food for the palace population. Ottoman cuisine synthesized Central Asian, Persian, Arab, and Byzantine traditions. Dishes like kebab, baklava, börek, dolma, and Turkish delight (lokum) spread across the empire. Coffee culture originated from Yemen, reached Istanbul by the 1550s, and Ottoman coffeehouses became centers of social and political life across Europe.', icon: '🍽️', color: SAND },
  { title: 'İznik Ceramics', description: 'Blue, white, and red — the tiles that defined an empire', details: 'İznik (ancient Nicaea) produced some of history\'s finest ceramics from the 15th–17th centuries. The distinctive blue-and-white designs evolved to include brilliant "Armenian bole" red and emerald green. İznik tiles decorated mosques, palaces, and tombs across the empire. Production declined after the 17th century and the techniques were lost until modern revivals.', icon: '🏺', color: TEAL },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Economy
// ─────────────────────────────────────────────────────────────────────────────

const ECONOMY_TOPICS: GovernanceTopic[] = [
  { title: 'Control of the Silk Road & Spice Trade', description: 'Gatekeepers between East and West', details: 'The Ottomans controlled the western termini of both the Silk Road and the Indian Ocean spice routes. Goods from China, India, and Southeast Asia passed through Ottoman territory to reach Europe. This monopoly generated enormous customs revenue but also motivated European nations to find sea routes around Ottoman territory — directly spurring the Age of Exploration and Columbus\'s voyage.', icon: '🛤️', color: GOLD },
  { title: 'Trade with Venice & Genoa', description: 'Capitulations and commercial treaties', details: 'Italian city-states (especially Venice and Genoa) were the Ottomans\' primary European trading partners. "Capitulations" — trade agreements granting foreign merchants extraterritorial rights, low tariffs, and legal immunity — were initially granted from a position of strength. By the 18th–19th centuries, these same capitulations became instruments of European economic penetration, undermining Ottoman sovereignty.', icon: '🚢', color: NAVY },
  { title: 'Currency & Finance', description: 'The akçe, the gold sultani, and inflation', details: 'The silver akçe was the basic unit of Ottoman currency for centuries. Gold sultanis circulated for large transactions. Chronic warfare and silver imports from the Americas caused repeated currency debasements and inflation crises, particularly in the late 16th century ("Price Revolution"). By the 19th century, the empire was deeply indebted to European banks, leading to the Ottoman Public Debt Administration (1881) — effectively foreign control of imperial finances.', icon: '💰', color: EARTH },
  { title: 'Agriculture & Land Tenure', description: 'The backbone of the imperial economy', details: 'Agriculture was the empire\'s economic foundation. Most land was technically state-owned (miri), with cultivators holding use-rights. The timar system tied land tenure to military service. As the timar system broke down, tax farming (iltizam) replaced it — tax collectors bid for the right to collect taxes, often exploiting peasants. The shift from timars to tax farms is considered a key factor in Ottoman economic decline.', icon: '🌾', color: TEAL },
  { title: 'Guilds & Urban Economy', description: 'Regulated craftsmanship and trade', details: 'Ottoman cities were organized around guilds (esnaf) that regulated production, quality, prices, and training. Each craft — from silk weaving to coppersmithing — had its own guild with a hierarchical structure (apprentice, journeyman, master). Guilds were tied to Sufi orders and had social, religious, and economic functions. The Grand Bazaar in Istanbul, with over 4,000 shops, was the empire\'s commercial heart.', icon: '⚒️', color: SAND },
  { title: 'Vakıf (Charitable Endowments)', description: 'The economic engine of public welfare', details: 'Vakıfs (pious endowments) funded mosques, schools, hospitals, bridges, fountains, and soup kitchens. Revenue from shops, farms, and baths was endowed in perpetuity for charitable purposes. By some estimates, vakıf properties comprised up to one-third of all arable land in the empire. The vakıf system was the Ottoman equivalent of a welfare state — and a mechanism for elites to protect wealth from seizure.', icon: '🏥', color: PURPLE },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Relations with Europe
// ─────────────────────────────────────────────────────────────────────────────

const EUROPE_EVENTS: EuropeEvent[] = [
  { title: 'Crusade of Nicopolis (1396)', date: '1396', description: 'A pan-European crusading army led by Hungary, France, and Burgundy marched against Bayezid I. The Ottomans annihilated them, capturing thousands of knights.', significance: 'Ended the era of European crusading offensives against the Ottomans. Established the empire as a permanent European power.', color: CRIMSON },
  { title: 'Crusade of Varna (1444)', date: '1444', description: 'King Władysław III of Poland-Hungary broke a treaty to launch a surprise attack. Murad II came out of retirement to crush the crusade. The king was killed.', significance: 'The last serious attempt by Christian Europe to roll back Ottoman expansion through a Crusade. After Varna, Europe shifted to defensive strategies.', color: EARTH },
  { title: 'Franco-Ottoman Alliance (1536)', date: '1536', description: 'Francis I of France allied with Suleiman the Magnificent against their common enemy, Habsburg Emperor Charles V. French and Ottoman fleets cooperated in the Mediterranean.', significance: 'The first alliance between a Christian and Muslim state — scandalizing Europe. Demonstrated that raison d\'état trumped religious solidarity.', color: GOLD },
  { title: 'Battle of Lepanto (1571)', date: '1571', description: 'A Holy League fleet (Spain, Venice, Papacy) under Don John of Austria destroyed the Ottoman fleet off the coast of Greece. Over 30,000 Ottomans were killed.', significance: 'Celebrated across Europe as proof the Ottomans could be beaten at sea. However, the Ottomans rebuilt their fleet within a year and conquered Cyprus anyway.', color: NAVY },
  { title: 'Battle of Vienna (1683)', date: '1683', description: 'Grand Vizier Kara Mustafa Pasha besieged Vienna with 150,000 troops. After two months, a relief army led by Polish King Jan III Sobieski charged down the Kahlenberg and routed the Ottomans.', significance: 'THE turning point. The Ottomans never threatened central Europe again. Led directly to the Treaty of Karlowitz (1699) — the first major territorial losses.', color: CRIMSON },
  { title: 'Capitulations — from privilege to exploitation', date: '1500s–1800s', description: 'Trade agreements originally granted from Ottoman strength became instruments of European economic control. By the 19th century, European merchants paid lower taxes than Ottoman subjects.', significance: 'The capitulations eroded Ottoman economic sovereignty. Attempts to revoke them were blocked by European powers until the Treaty of Lausanne (1923).', color: SAND },
  { title: 'The "Eastern Question" (1774–1923)', date: '1774–1923', description: 'European diplomacy\'s central question for 150 years: what happens when the Ottoman Empire collapses? Britain, France, Russia, and Austria competed to control the outcome.', significance: 'The Eastern Question shaped European alliances, triggered wars (Crimean War, Russo-Turkish Wars), and ultimately contributed to WWI when Ottoman territory became the prize.', color: PURPLE },
  { title: 'Ottoman Entry into WWI (1914)', date: '1914', description: 'Enver Pasha, the dominant Young Turk leader, brought the empire into WWI allied with Germany against Russia, Britain, and France. The decision sealed the empire\'s fate.', significance: 'The final miscalculation. Allied victory led to partition, occupation, and the end of the 623-year-old Ottoman state.', color: CRIMSON },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Decline Factors
// ─────────────────────────────────────────────────────────────────────────────

const DECLINE_FACTORS: DeclineFactor[] = [
  { title: 'Military Defeats & Territorial Loss', description: 'From Vienna to the Balkans', details: 'After 1683, the empire suffered a relentless series of defeats: Karlowitz (1699), Passarowitz (1718), Küçük Kaynarca (1774), Berlin (1878), and the Balkan Wars (1912–1913). Each treaty meant lost provinces, lost revenue, and lost prestige. By 1913, the empire had lost 83% of its European territory.', icon: '⚔️', color: CRIMSON },
  { title: 'Tanzimat Reforms — Too Little, Too Late?', description: 'Modernization met fierce resistance', details: 'The Tanzimat era (1839–1876) introduced European-style law, equal citizenship, modern education, and administrative reform. But reforms alienated conservatives without satisfying liberals. Muslims resented equal status for Christians; Christians wanted independence, not equality. The reforms also created a new educated class that became the empire\'s sharpest critics (Young Ottomans, then Young Turks).', icon: '📋', color: TEAL },
  { title: 'Ethnic Nationalism', description: 'The empire\'s diversity became its weakness', details: 'Greek independence (1829) proved that nationalism could break Ottoman power. Serbian, Romanian, Bulgarian, and Albanian nationalisms followed. Arab nationalism emerged by the early 20th century. The millet system, which had managed diversity for centuries, inadvertently created the communal identities that nationalists exploited. Each independence movement was supported by one or more European powers.', icon: '🏴', color: EARTH },
  { title: 'Economic Weakness & Debt', description: 'From creditor to debtor', details: 'Chronic warfare, inflation, and lost trade routes drained the treasury. By 1875, the empire defaulted on its foreign debt. The Ottoman Public Debt Administration (1881) gave European creditors direct control over imperial revenues (salt, silk, tobacco taxes). Economic sovereignty was effectively lost decades before political sovereignty.', icon: '💸', color: GOLD },
  { title: 'Technological Gap', description: 'Europe industrialized; the Ottomans did not', details: 'By the 18th century, Europe\'s military-industrial revolution left the Ottomans behind. Steam-powered ships, rifled artillery, railways, and telegraph — each innovation gave European armies decisive advantages. Ottoman reformers tried to import technology, but without an industrial base, they remained dependent on European arms, engineers, and loans.', icon: '⚙️', color: NAVY },
  { title: 'Internal Conservatism', description: 'The Janissaries, the ulema, and resistance to change', details: 'Every reform attempt faced opposition from entrenched interests: Janissaries who feared losing privileges, religious scholars who saw Westernization as apostasy, provincial notables who resisted centralization. Sultan Selim III was deposed and murdered for his reform attempts (1807). Only Mahmud II\'s violent destruction of the Janissaries (1826) broke the cycle.', icon: '🔒', color: PURPLE },
  { title: 'WWI — the Final Catastrophe', description: 'Alliance with Germany sealed the empire\'s fate', details: 'Enver Pasha\'s decision to enter WWI on the German side was the final fatal miscalculation. The empire fought on multiple fronts: Gallipoli, Caucasus, Mesopotamia, Palestine, Arabia. Despite the victory at Gallipoli, defeats elsewhere were decisive. The Armenian Genocide, the Arab Revolt, and total military collapse led directly to partition and the end of the Ottoman state.', icon: '💀', color: CRIMSON },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Legacy
// ─────────────────────────────────────────────────────────────────────────────

const MODERN_NATIONS = [
  'Turkey', 'Greece', 'Bulgaria', 'Serbia', 'Romania', 'Hungary (partial)',
  'Bosnia & Herzegovina', 'North Macedonia', 'Albania', 'Montenegro', 'Kosovo',
  'Croatia (partial)', 'Moldova (partial)', 'Ukraine (Crimea)',
  'Iraq', 'Syria', 'Lebanon', 'Jordan', 'Israel/Palestine', 'Saudi Arabia (Hejaz)',
  'Yemen', 'Kuwait', 'Egypt', 'Libya', 'Tunisia', 'Algeria',
  'Cyprus', 'Armenia (eastern provinces)', 'Georgia (partial)',
];

const LEGACY_ITEMS: LegacyItem[] = [
  { title: '20+ Modern Nations from Ottoman Territory', text: 'The Ottoman Empire\'s dissolution created or reshaped more than 20 modern nations across Southeast Europe, the Middle East, and North Africa. Many of today\'s borders — Iraq, Syria, Lebanon, Jordan, Israel/Palestine — were drawn by European powers partitioning Ottoman territory after WWI (Sykes-Picot, 1916; San Remo Conference, 1920).', color: GOLD },
  { title: 'The Armenian Genocide — Unresolved', text: 'The systematic killing of 1–1.5 million Armenians by the CUP government (1915–1923) remains one of history\'s most consequential unresolved issues. Over 30 countries recognize it as genocide; Turkey disputes the characterization. The Armenian diaspora, the Turkish-Armenian border closure, and the absence of reconciliation continue to shape regional politics.', color: CRIMSON },
  { title: 'Cyprus — A Divided Island', text: 'Ottoman conquest (1570) established the Turkish Cypriot community. After British rule (1878–1960) and an independent republic, a Greek-backed coup prompted Turkey\'s 1974 invasion. The island remains divided between the Republic of Cyprus (EU member) and the Turkish Republic of Northern Cyprus (recognized only by Turkey).', color: NAVY },
  { title: 'Balkans — Ottoman Heritage in Europe', text: 'Five centuries of Ottoman rule left deep marks on Southeast Europe: Muslim communities in Bosnia, Kosovo, Albania, and Bulgaria; architectural landmarks (Mostar Bridge, Sarajevo\'s Old Town); legal and administrative traces; and unresolved ethnic tensions that erupted in the Yugoslav Wars of the 1990s.', color: TEAL },
  { title: 'The Modern Turkish Republic', text: 'Mustafa Kemal Atatürk founded the Republic of Turkey (1923) on explicitly anti-Ottoman principles: secularism, nationalism, Westernization, and the Latin alphabet. Yet Ottoman heritage remains central to Turkish identity and politics. Under the AKP government (2002–present), "Neo-Ottomanism" has become a significant political and foreign policy orientation.', color: EARTH },
  { title: 'Middle Eastern Borders & Conflicts', text: 'The post-Ottoman Middle East was shaped by European imperialism (British and French mandates) imposed on Ottoman provinces with little regard for ethnic, religious, or tribal realities. Iraq\'s combination of Sunni, Shia, and Kurdish populations; Syria\'s patchwork of communities; Lebanon\'s sectarian system — all trace directly to Ottoman administrative districts repackaged as nation-states.', color: SAND },
  { title: 'Caliphate & Pan-Islamism', text: 'The Ottoman claim to the Caliphate (1517–1924) made the sultan the nominal leader of the world\'s Sunni Muslims. Atatürk abolished the Caliphate in 1924, and no successor has been universally recognized since. ISIS\'s 2014 declaration of a "caliphate" exploited this vacuum. The idea of restoring Islamic political unity remains a potent force in global politics.', color: PURPLE },
  { title: 'Cultural Legacy — Coffee, Cuisine, Architecture', text: 'Ottoman influence pervades daily life across its former territories: Turkish coffee culture spread to Vienna, Venice, and beyond. Dishes like kebab, baklava, dolma, and yogurt are shared across 20+ national cuisines. Ottoman mosques, baths, bridges, and bazaars remain architectural treasures from Sarajevo to Baghdad. The Grand Bazaar in Istanbul is still one of the world\'s largest covered markets.', color: GOLD },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Territory Map (expansion/contraction visualization)
// ─────────────────────────────────────────────────────────────────────────────

const TERRITORY_ERAS: TerritoryEra[] = [
  { year: 1300, label: 'Founding Beylik', widthPct: 5, heightPct: 8, color: EARTH, provinces: 1, population: '~50,000', note: 'Small frontier beylik near Söğüt in NW Anatolia' },
  { year: 1389, label: 'After Kosovo', widthPct: 22, heightPct: 28, color: EARTH, provinces: 6, population: '~3 million', note: 'Balkans conquered; two capitals (Bursa, Edirne)' },
  { year: 1453, label: 'Fall of Constantinople', widthPct: 35, heightPct: 42, color: GOLD, provinces: 12, population: '~8 million', note: 'Istanbul capital; Greece, Serbia absorbed' },
  { year: 1520, label: 'Suleiman\'s Accession', widthPct: 55, heightPct: 60, color: GOLD, provinces: 22, population: '~15 million', note: 'Egypt, Syria, Hejaz added under Selim I' },
  { year: 1566, label: 'Peak Extent', widthPct: 80, heightPct: 85, color: CRIMSON, provinces: 32, population: '~25–30 million', note: '3 continents, Hungary, North Africa, Iraq, Yemen' },
  { year: 1683, label: 'Before Vienna', widthPct: 72, heightPct: 78, color: NAVY, provinces: 30, population: '~28 million', note: 'Still vast but cracks showing; Crete newly won' },
  { year: 1699, label: 'Treaty of Karlowitz', widthPct: 60, heightPct: 65, color: NAVY, provinces: 26, population: '~24 million', note: 'Hungary, Transylvania, Morea lost' },
  { year: 1800, label: 'Napoleonic Era', widthPct: 48, heightPct: 55, color: SAND, provinces: 22, population: '~26 million', note: 'Crimea lost; North Africa autonomous' },
  { year: 1878, label: 'Treaty of Berlin', widthPct: 32, heightPct: 40, color: SAND, provinces: 16, population: '~20 million', note: 'Romania, Serbia, Montenegro independent; Bulgaria autonomous; Bosnia to Austria' },
  { year: 1913, label: 'After Balkan Wars', widthPct: 22, heightPct: 32, color: TEAL, provinces: 12, population: '~18 million', note: 'Lost 83% of European territory; Libya gone' },
  { year: 1918, label: 'Armistice', widthPct: 14, heightPct: 22, color: CRIMSON, provinces: 6, population: '~14 million', note: 'Arab provinces lost; Anatolia under threat' },
  { year: 1922, label: 'End', widthPct: 12, heightPct: 18, color: CRIMSON, provinces: 0, population: '—', note: 'Sultanate abolished; Republic of Turkey (1923) inherits Anatolia + eastern Thrace' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: `${ACCENT}15`, border: `1px solid ${ACCENT}33`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: ACCENT, fontFamily: 'monospace' }}>{value}</div>
      <div style={{ fontSize: 11, color: TEXT_DIM, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function TabButton({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
        border: active ? `1px solid ${ACCENT}` : '1px solid rgba(196,30,58,0.15)',
        backgroundColor: active ? `${ACCENT}22` : 'rgba(196,30,58,0.06)',
        color: active ? ACCENT : TEXT_DIM,
        cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Inter', system-ui, sans-serif",
        display: 'flex', alignItems: 'center', gap: 5,
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>{label}
    </button>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT, margin: 0 }}>{title}</h2>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Tabs
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_TABS: { key: SectionTab; label: string; icon: string }[] = [
  { key: 'timeline', label: 'Timeline', icon: '📅' },
  { key: 'sultans', label: 'Sultans', icon: '👑' },
  { key: 'constantinople', label: 'Constantinople', icon: '🏛️' },
  { key: 'peak', label: 'Empire at Peak', icon: '🌍' },
  { key: 'governance', label: 'Governance', icon: '⚖️' },
  { key: 'military', label: 'Military', icon: '⚔️' },
  { key: 'culture', label: 'Culture', icon: '🕌' },
  { key: 'economy', label: 'Economy', icon: '💰' },
  { key: 'europe', label: 'Europe', icon: '🏰' },
  { key: 'decline', label: 'Decline', icon: '📉' },
  { key: 'fall', label: 'Fall', icon: '🏳️' },
  { key: 'legacy', label: 'Legacy', icon: '🌐' },
  { key: 'map', label: 'Territory Map', icon: '🗺️' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

export default function OttomanEmpirePage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('timeline');
  const [expandedPeriod, setExpandedPeriod] = useState<string | null>('Rise of the Beylik');
  const [expandedSultan, setExpandedSultan] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<number>(5); // peak extent

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: BG, color: TEXT, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ padding: '48px 32px 36px', borderBottom: `1px solid ${CARD_BORDER}`, background: `linear-gradient(135deg, ${BG} 0%, rgba(196,30,58,0.10) 100%)` }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: TEXT_DIM, textDecoration: 'none', marginBottom: 28, padding: '6px 12px', borderRadius: 6, border: `1px solid ${CARD_BORDER}`, backgroundColor: CARD_BG }}>{'\u2190'} Back to Timeline</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: `${ACCENT}20`, border: `2px solid ${ACCENT}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: `0 0 24px ${ACCENT}30` }}>{'🏛️'}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, backgroundColor: `${ACCENT}20`, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Topic Page</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 800, color: TEXT, lineHeight: 1.15, marginBottom: 14 }}>
            The Ottoman Empire {'\u2014'} 600 Years at the Crossroads of Civilizations <span style={{ fontSize: 'clamp(18px, 3vw, 28px)', color: TEXT_DIM, fontWeight: 400 }}>(1299{'\u2013'}1922)</span>
          </h1>
          <p style={{ fontSize: 16, color: TEXT_DIM, lineHeight: 1.7, maxWidth: 700, margin: 0 }}>
            From a tiny Anatolian beylik to an empire spanning three continents {'\u2014'} the Ottomans shaped 600 years of world history, leaving a legacy that still defines borders, conflicts, and cultures today.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
            <StatBadge value="623" label="Years of Rule" />
            <StatBadge value="36" label="Sultans" />
            <StatBadge value="3" label="Continents" />
            <StatBadge value="32" label="Provinces (Peak)" />
            <StatBadge value="20+" label="Modern Nations" />
          </div>
        </motion.div>

        {/* ── Tab Navigation ── */}
        <div style={{ padding: '16px 32px', borderBottom: `1px solid ${CARD_BORDER}`, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, backgroundColor: BG }}>
          {SECTION_TABS.map((tab) => (
            <TabButton key={tab.key} label={tab.label} icon={tab.icon} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} />
          ))}
        </div>

        {/* ── Timeline ── */}
        {activeTab === 'timeline' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'📅'} title="600 Years in Six Periods" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Click any period to expand its major events. From frontier beylik to world empire to dissolution.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PERIODS.map((period) => (
                <motion.div key={period.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <button
                    onClick={() => setExpandedPeriod(expandedPeriod === period.name ? null : period.name)}
                    style={{
                      width: '100%', textAlign: 'left', cursor: 'pointer',
                      padding: '16px 20px', borderRadius: expandedPeriod === period.name ? '12px 12px 0 0' : 12,
                      backgroundColor: expandedPeriod === period.name ? `${period.color}18` : CARD_BG,
                      border: `1px solid ${expandedPeriod === period.name ? `${period.color}55` : CARD_BORDER}`,
                      borderBottom: expandedPeriod === period.name ? 'none' : undefined,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontFamily: "'Inter', system-ui, sans-serif", transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontSize: 14, fontWeight: 900, color: period.color, fontFamily: 'monospace' }}>{period.years}</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{period.name}</span>
                      <span style={{ fontSize: 12, color: TEXT_DIM }}>{period.events.length} events</span>
                    </div>
                    <span style={{ fontSize: 18, color: TEXT_DIM, transform: expandedPeriod === period.name ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>{'\u25BC'}</span>
                  </button>
                  <AnimatePresence>
                    {expandedPeriod === period.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden', borderRadius: '0 0 12px 12px', border: `1px solid ${period.color}55`, borderTop: 'none', backgroundColor: `${period.color}08` }}
                      >
                        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                          {period.events.map((ev, i) => (
                            <motion.div
                              key={ev.title}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.06, duration: 0.3 }}
                              style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}
                            >
                              <div style={{ minWidth: 60, fontSize: 12, fontWeight: 700, color: period.color, fontFamily: 'monospace', paddingTop: 2 }}>{ev.date}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{ev.title}</div>
                                <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{ev.detail}</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Sultans ── */}
        {activeTab === 'sultans' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'👑'} title={`Key Sultans — ${SULTANS.length} Rulers`} />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>From Osman I to Mehmed VI — the dynasty that ruled for 36 generations. Click any sultan for full details.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SULTANS.map((sultan, i) => (
                <motion.div
                  key={sultan.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  onClick={() => setExpandedSultan(expandedSultan === sultan.name ? null : sultan.name)}
                  style={{ padding: '16px 20px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${sultan.color}33`, cursor: 'pointer', transition: 'border-color 0.2s' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                      <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${sultan.color}18`, border: `2px solid ${sultan.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{sultan.icon}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT, margin: 0 }}>{sultan.name}</h3>
                          {sultan.epithet && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, backgroundColor: `${sultan.color}22`, color: sultan.color, fontWeight: 600 }}>{sultan.epithet}</span>}
                        </div>
                        <div style={{ fontSize: 12, color: TEXT_DIM, fontFamily: 'monospace', marginTop: 2 }}>{sultan.reign}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 14, color: TEXT_MUTED, transform: expandedSultan === sultan.name ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>{'\u25BC'}</span>
                  </div>
                  <AnimatePresence>
                    {expandedSultan === sultan.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${sultan.color}22` }}>
                          <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 10 }}><strong style={{ color: TEXT }}>Achievements:</strong> {sultan.achievements}</div>
                          <div style={{ fontSize: 12, color: TEXT_DIM, lineHeight: 1.5, padding: '8px 12px', borderRadius: 6, backgroundColor: `${sultan.color}0d`, borderLeft: `3px solid ${sultan.color}44` }}>
                            <strong style={{ color: sultan.color }}>Legacy:</strong> {sultan.legacy}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Constantinople ── */}
        {activeTab === 'constantinople' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'🏛️'} title="The Fall of Constantinople — May 29, 1453" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
              The event that ended the Middle Ages and began the modern world. A 21-year-old sultan accomplished what armies had attempted for 800 years.
            </p>

            {/* Why it mattered */}
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Why It Mattered</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {[
                { title: 'End of the Roman Empire', detail: 'Constantinople was the last remnant of the Roman Empire, which had endured for 1,500 years. Its fall marked the definitive end of the ancient world.' },
                { title: 'Shift in World Power', detail: 'Control of the Bosphorus gave the Ottomans command of the land route between Europe and Asia. European powers were forced to seek sea routes — directly triggering the Age of Exploration.' },
                { title: 'Cultural Diaspora', detail: 'Greek scholars fleeing Constantinople brought manuscripts, knowledge, and classical learning to Italy, catalyzing the Renaissance. The connection between the fall of Constantinople and the European Renaissance is direct.' },
                { title: 'Islamic Triumph', detail: 'For the Muslim world, the conquest fulfilled a prophecy attributed to the Prophet Muhammad. Mehmed II became one of the most celebrated figures in Islamic history.' },
                { title: 'Psychological Shock to Christendom', detail: 'The loss of Constantinople — the greatest Christian city in the East — sent shockwaves across Europe. Multiple popes called for crusades to recapture it; none materialized.' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                  style={{ padding: '16px 20px', borderRadius: 10, backgroundColor: `${GOLD}0a`, border: `1px solid ${GOLD}33`, borderLeft: `4px solid ${GOLD}66` }}
                >
                  <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                </motion.div>
              ))}
            </div>

            {/* How it happened */}
            <div style={{ fontSize: 12, fontWeight: 700, color: CRIMSON, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>How It Happened — 53 Days</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {[
                { date: 'Apr 2', event: 'Ottoman army arrives', detail: 'Mehmed II arrives with 80,000–100,000 troops against Constantinople\'s 7,000 defenders under Emperor Constantine XI. The Theodosian Walls — triple fortifications that had resisted siege for 1,000 years — are the city\'s main defense.' },
                { date: 'Apr 6', event: 'Bombardment begins', detail: 'Orban\'s great cannon (the "Basilica") fires 600-pound stone balls at the walls. It can only fire 7 times a day but the psychological impact is enormous. Smaller cannon maintain constant pressure.' },
                { date: 'Apr 12', event: 'Naval chain blocks the Golden Horn', detail: 'The Byzantines stretch a massive chain across the Golden Horn to block the Ottoman fleet. Mehmed\'s navy is initially repulsed.' },
                { date: 'Apr 22', event: 'Ships over land', detail: 'In one of history\'s most audacious military maneuvers, Mehmed has 70 ships dragged overland on greased logs from the Bosphorus into the Golden Horn, bypassing the chain entirely.' },
                { date: 'May 29', event: 'Final assault', detail: 'Three waves of attacks: first irregulars, then Anatolian regulars, then the Janissary elite. Emperor Constantine XI dies fighting on the walls. The city falls. Mehmed enters through the Charisius Gate and rides to Hagia Sophia, converting it to a mosque.' },
              ].map((item, i) => (
                <motion.div
                  key={item.event}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 18px', borderRadius: 10, backgroundColor: CARD_BG, border: `1px solid ${CRIMSON}22` }}
                >
                  <div style={{ minWidth: 54, fontSize: 12, fontWeight: 700, color: CRIMSON, fontFamily: 'monospace', paddingTop: 2 }}>{item.date}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{item.event}</div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Global Impact */}
            <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Global Impact</div>
            <div style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${TEAL}33` }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {[
                  { title: 'The Renaissance', text: 'Greek scholars and manuscripts catalyzed the Italian Renaissance, transforming European art, philosophy, and science.' },
                  { title: 'Age of Exploration', text: 'Ottoman control of eastern trade routes pushed Europeans to seek sea routes to Asia — Columbus sailed in 1492.' },
                  { title: 'Ottoman Istanbul', text: 'Mehmed rebuilt the city as a cosmopolitan capital: repopulated with Muslims, Christians, and Jews; Hagia Sophia, Topkapı Palace, Grand Bazaar.' },
                  { title: 'End of Medieval Europe', text: 'Historians traditionally mark 1453 as the end of the Middle Ages and the beginning of the early modern period.' },
                ].map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEAL, marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.text}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Empire at Peak ── */}
        {activeTab === 'peak' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'🌍'} title="The Empire at Its Peak — Under Suleiman the Magnificent" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
              By the mid-16th century, the Ottoman Empire was the world's largest and most powerful state, spanning three continents and controlling the crossroads of global trade.
            </p>

            {/* Key stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
              {[
                { value: '~5.2M km²', label: 'Territory', color: GOLD },
                { value: '25–30M', label: 'Population', color: CRIMSON },
                { value: '32', label: 'Provinces (Eyalets)', color: TEAL },
                { value: '3', label: 'Continents', color: NAVY },
              ].map((stat) => (
                <div key={stat.label} style={{ padding: '14px 20px', borderRadius: 10, backgroundColor: `${stat.color}12`, border: `1px solid ${stat.color}33`, flex: 1, minWidth: 160, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: stat.color, fontFamily: 'monospace' }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Territory sections */}
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Territory by Region</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {[
                { region: 'Europe (Rumelia)', detail: 'Greece, Bulgaria, Serbia, Bosnia, Albania, Hungary, Romania, Moldova, Croatia (partial), southern Ukraine (Crimea). The Balkans were the empire\'s economic heartland and primary source of revenue.', color: NAVY },
                { region: 'Anatolia (Asia Minor)', detail: 'The geographic core — modern Turkey. Contained the original Ottoman heartlands, major cities (Bursa, Konya, Ankara), and the empire\'s agricultural base.', color: EARTH },
                { region: 'Arab Provinces', detail: 'Egypt (the wealthiest province), Syria, Iraq, the Hejaz (Mecca and Medina), Yemen, and parts of the Persian Gulf coast. Controlled the Suez land route and Indian Ocean trade.', color: GOLD },
                { region: 'North Africa (Maghreb)', detail: 'Algeria, Tunisia, Libya (Tripolitania). Governed as semi-autonomous regencies under local corsair rulers who paid tribute to Istanbul.', color: SAND },
                { region: 'Caucasus & Black Sea', detail: 'Georgia, parts of Armenia, Crimea (vassal Khanate). The Black Sea was effectively an "Ottoman lake" — no foreign warship entered it until 1774.', color: TEAL },
              ].map((item, i) => (
                <motion.div
                  key={item.region}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                  style={{ padding: '16px 20px', borderRadius: 10, backgroundColor: `${item.color}0a`, border: `1px solid ${item.color}33`, borderLeft: `4px solid ${item.color}66` }}
                >
                  <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 6 }}>{item.region}</div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                </motion.div>
              ))}
            </div>

            {/* Trade routes */}
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Trade Routes Controlled</div>
            <div style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
              {[
                'Silk Road (western terminus) — China to Bursa/Istanbul',
                'Spice Route — Indian Ocean via Red Sea to Egypt/Syria',
                'Bosphorus & Dardanelles — Black Sea to Mediterranean',
                'Danube River — central European trade artery',
                'Trans-Saharan trade — via North African regencies',
                'Persian Gulf — Basra to Indian Ocean',
              ].map((route, i) => (
                <motion.div
                  key={route}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: TEXT_DIM, marginBottom: 8 }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: GOLD, flexShrink: 0 }} />
                  {route}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Governance ── */}
        {activeTab === 'governance' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'⚖️'} title={`Governance — ${GOVERNANCE.length} Key Systems`} />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>The Ottoman system of governance was sophisticated, pragmatic, and — for its time — remarkably inclusive.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {GOVERNANCE.map((topic, i) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${topic.color}33` }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${topic.color}18`, border: `2px solid ${topic.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{topic.icon}</span>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0 }}>{topic.title}</h3>
                      <div style={{ fontSize: 12, color: topic.color, marginTop: 2 }}>{topic.description}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.75 }}>{topic.details}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Military ── */}
        {activeTab === 'military' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'⚔️'} title={`Military Innovations — ${MILITARY.length} Branches`} />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>The Ottoman military machine was the most advanced in the world from the 14th to 16th centuries.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {MILITARY.map((branch, i) => (
                <motion.div
                  key={branch.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${branch.color}33` }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${branch.color}18`, border: `2px solid ${branch.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{branch.icon}</span>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0 }}>{branch.name}</h3>
                      <div style={{ fontSize: 12, color: branch.color, marginTop: 2 }}>{branch.description}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.75 }}>{branch.details}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Culture ── */}
        {activeTab === 'culture' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'🕌'} title={`Culture & Architecture — ${CULTURE.length} Highlights`} />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Ottoman culture synthesized Central Asian, Persian, Arab, and Byzantine traditions into something uniquely its own.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: 16 }}>
              {CULTURE.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${item.color}33`, display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${item.color}18`, border: `2px solid ${item.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0 }}>{item.title}</h3>
                      <div style={{ fontSize: 12, color: item.color, marginTop: 2 }}>{item.description}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.details}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Economy ── */}
        {activeTab === 'economy' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'💰'} title={`Economy — ${ECONOMY_TOPICS.length} Key Topics`} />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>The Ottomans controlled the crossroads of world trade for centuries — until European sea routes bypassed them.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {ECONOMY_TOPICS.map((topic, i) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${topic.color}33` }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${topic.color}18`, border: `2px solid ${topic.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{topic.icon}</span>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0 }}>{topic.title}</h3>
                      <div style={{ fontSize: 12, color: topic.color, marginTop: 2 }}>{topic.description}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.75 }}>{topic.details}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Relations with Europe ── */}
        {activeTab === 'europe' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'🏰'} title={`Relations with Europe — ${EUROPE_EVENTS.length} Key Moments`} />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>From Crusade target to alliance partner to "Sick Man of Europe" — the Ottoman-European relationship defined 600 years of geopolitics.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {EUROPE_EVENTS.map((event, i) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  style={{ padding: '18px 22px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${event.color}33` }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: event.color, fontFamily: 'monospace', padding: '3px 8px', borderRadius: 4, backgroundColor: `${event.color}18` }}>{event.date}</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT, margin: 0 }}>{event.title}</h3>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 10 }}>{event.description}</div>
                  <div style={{ fontSize: 12, color: TEXT_DIM, lineHeight: 1.5, padding: '8px 12px', borderRadius: 6, backgroundColor: `${event.color}0d`, borderLeft: `3px solid ${event.color}44` }}>
                    <strong style={{ color: event.color }}>Significance:</strong> {event.significance}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Decline ── */}
        {activeTab === 'decline' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'📉'} title={`Decline — ${DECLINE_FACTORS.length} Key Factors`} />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>No single cause explains the Ottoman decline — it was a convergence of military, economic, social, and technological failures over three centuries.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {DECLINE_FACTORS.map((factor, i) => (
                <motion.div
                  key={factor.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${factor.color}33` }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${factor.color}18`, border: `2px solid ${factor.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{factor.icon}</span>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0 }}>{factor.title}</h3>
                      <div style={{ fontSize: 12, color: factor.color, marginTop: 2 }}>{factor.description}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.75 }}>{factor.details}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Fall ── */}
        {activeTab === 'fall' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'🏳️'} title="The Fall — From WWI to the Turkish Republic" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
              The final chapter: a disastrous world war, foreign occupation, a war of liberation, and the birth of a new nation from the ashes of empire.
            </p>

            {/* WWI */}
            <div style={{ fontSize: 12, fontWeight: 700, color: CRIMSON, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>World War I (1914–1918)</div>
            <div style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${CRIMSON}33`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.75 }}>
                Enver Pasha allied the empire with Germany, hoping to recover lost territory from Russia and Britain. The empire fought on five fronts simultaneously: Gallipoli (victory), Caucasus (disaster — Sarıkamış), Mesopotamia (loss of Baghdad), Palestine (loss of Jerusalem and Damascus), and Arabia (Arab Revolt). Despite the heroic defense at Gallipoli under Mustafa Kemal, the empire was exhausted. The Armenian Genocide (1915–1923) — the systematic deportation and murder of 1–1.5 million Armenians — remains the most devastating moral stain on the late Ottoman period. The Armistice of Mudros (October 30, 1918) ended Ottoman participation in the war.
              </div>
            </div>

            {/* Treaty of Sèvres */}
            <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Treaty of Sèvres (1920) — The Harshest Peace</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                'Greece receives Thrace and Smyrna (İzmir) region',
                'France receives Syria, Cilicia (southern Anatolia)',
                'Italy receives southwestern Anatolia',
                'Armenia gains eastern Anatolia',
                'Kurdistan promised autonomy with path to independence',
                'Istanbul and the Straits placed under international control',
                'Ottoman army reduced to 50,000',
                'Capitulations restored — full European economic control',
              ].map((term, i) => (
                <motion.div
                  key={term}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: TEXT_DIM, padding: '8px 14px', borderRadius: 6, backgroundColor: `${NAVY}0a`, border: `1px solid ${NAVY}22` }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: NAVY, flexShrink: 0 }} />
                  {term}
                </motion.div>
              ))}
            </div>

            {/* Atatürk & Independence */}
            <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Mustafa Kemal Atatürk & the War of Independence (1919–1923)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[
                { date: 'May 1919', event: 'Mustafa Kemal lands at Samsun', detail: 'Ostensibly sent to disband remaining Ottoman forces, Kemal instead begins organizing the nationalist resistance movement from Ankara.' },
                { date: 'Jun 1920', event: 'Greek offensive begins', detail: 'Greece, authorized by the Allies, invades western Anatolia from Smyrna. Greek forces advance deep into Anatolia toward Ankara.' },
                { date: 'Aug 1921', event: 'Battle of Sakarya', detail: 'A 22-day battle 50 miles from Ankara. Kemal commands personally. The Greek advance is halted — the turning point of the war.' },
                { date: 'Aug 1922', event: 'Great Offensive', detail: 'Turkish forces launch a massive counterattack. The Greek army is routed and driven into the sea at Smyrna. The city burns.' },
                { date: 'Oct 1922', event: 'Armistice of Mudanya', detail: 'Allies agree to Turkish control of eastern Thrace and Istanbul. The war is over. Kemal has won.' },
                { date: 'Jul 1923', event: 'Treaty of Lausanne', detail: 'Replaces Sèvres entirely. Turkey is recognized as a fully sovereign state within its current borders. Capitulations abolished. The only post-WWI treaty negotiated as equals.' },
                { date: 'Oct 1923', event: 'Republic of Turkey proclaimed', detail: 'The Grand National Assembly declares the Republic of Turkey on October 29, 1923. Mustafa Kemal becomes the first president. The Ottoman era is over.' },
              ].map((item, i) => (
                <motion.div
                  key={item.event}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                  style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 18px', borderRadius: 10, backgroundColor: `${TEAL}08`, border: `1px solid ${TEAL}22` }}
                >
                  <div style={{ minWidth: 70, fontSize: 12, fontWeight: 700, color: TEAL, fontFamily: 'monospace', paddingTop: 2 }}>{item.date}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{item.event}</div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Legacy ── */}
        {activeTab === 'legacy' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'🌐'} title="Legacy — The Ottoman Imprint on the Modern World" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
              The Ottoman Empire's dissolution reshaped the world. Its borders, conflicts, cultures, and unresolved questions still shape politics today.
            </p>

            {/* Modern Nations */}
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Modern Nations from Ottoman Territory ({MODERN_NATIONS.length})</div>
            <div style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}`, marginBottom: 28 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {MODERN_NATIONS.map((nation, i) => (
                  <motion.span
                    key={nation}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, backgroundColor: `${GOLD}15`, border: `1px solid ${GOLD}33`, color: TEXT_DIM }}
                  >
                    {nation}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Legacy items */}
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Key Legacy Areas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {LEGACY_ITEMS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${item.color}33` }}
                >
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0, marginBottom: 8 }}>{item.title}</h3>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.75 }}>{item.text}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Territory Map ── */}
        {activeTab === 'map' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'🗺️'} title="Interactive Territory Map — Rise & Fall" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
              Click any era to see how the empire expanded and contracted over 600 years. The area represents relative territorial extent.
            </p>

            {/* Era selector */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
              {TERRITORY_ERAS.map((era, i) => (
                <button
                  key={era.year}
                  onClick={() => setSelectedEra(i)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    border: selectedEra === i ? `1px solid ${era.color}` : '1px solid rgba(196,30,58,0.15)',
                    backgroundColor: selectedEra === i ? `${era.color}22` : 'rgba(196,30,58,0.06)',
                    color: selectedEra === i ? era.color : TEXT_DIM,
                    cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  {era.year}
                </button>
              ))}
            </div>

            {/* Visual territory representation */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320, marginBottom: 24 }}>
              <motion.div
                key={selectedEra}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                style={{
                  width: `${TERRITORY_ERAS[selectedEra].widthPct}%`,
                  height: `${TERRITORY_ERAS[selectedEra].heightPct * 3.2}px`,
                  minWidth: 60,
                  minHeight: 40,
                  borderRadius: '40% 55% 45% 50% / 50% 40% 55% 45%',
                  background: `radial-gradient(ellipse at 40% 40%, ${TERRITORY_ERAS[selectedEra].color}40, ${TERRITORY_ERAS[selectedEra].color}15)`,
                  border: `2px solid ${TERRITORY_ERAS[selectedEra].color}66`,
                  boxShadow: `0 0 40px ${TERRITORY_ERAS[selectedEra].color}20, inset 0 0 30px ${TERRITORY_ERAS[selectedEra].color}10`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 900, color: TERRITORY_ERAS[selectedEra].color, fontFamily: 'monospace' }}>{TERRITORY_ERAS[selectedEra].year}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, textAlign: 'center', marginTop: 4 }}>{TERRITORY_ERAS[selectedEra].label}</div>
                {/* Star for Istanbul */}
                <div style={{ position: 'absolute', top: '35%', left: '55%', width: 8, height: 8, borderRadius: '50%', backgroundColor: GOLD, boxShadow: `0 0 8px ${GOLD}`, border: `1px solid ${GOLD}` }} title="Istanbul" />
              </motion.div>
            </div>

            {/* Era details */}
            <motion.div
              key={`detail-${selectedEra}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${TERRITORY_ERAS[selectedEra].color}33`, marginBottom: 24 }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Year</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: TERRITORY_ERAS[selectedEra].color, fontFamily: 'monospace' }}>{TERRITORY_ERAS[selectedEra].year}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Provinces</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: TEXT, fontFamily: 'monospace' }}>{TERRITORY_ERAS[selectedEra].provinces}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Population</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: TEXT, fontFamily: 'monospace' }}>{TERRITORY_ERAS[selectedEra].population}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{TERRITORY_ERAS[selectedEra].note}</div>
            </motion.div>

            {/* Timeline bar */}
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Territorial Extent Over Time</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {TERRITORY_ERAS.map((era, i) => (
                <motion.div
                  key={era.year}
                  initial={{ width: 0 }}
                  animate={{ width: `${era.widthPct}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  onClick={() => setSelectedEra(i)}
                  style={{
                    height: 24, borderRadius: 4,
                    backgroundColor: selectedEra === i ? era.color : `${era.color}44`,
                    border: selectedEra === i ? `1px solid ${era.color}` : 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', paddingLeft: 8,
                    minWidth: 50, transition: 'background-color 0.2s',
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, color: selectedEra === i ? BG : TEXT_DIM, whiteSpace: 'nowrap' }}>{era.year}</span>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer ── */}
        <div style={{ padding: '32px', textAlign: 'center', borderTop: `1px solid ${CARD_BORDER}` }}>
          <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', padding: '8px 16px', borderRadius: 6, border: `1px solid ${CARD_BORDER}`, backgroundColor: CARD_BG }}>{'\u2190'} Back to Timeline</Link>
        </div>
      </div>
    </div>
  );
}
