/**
 * IslamHistoryPage — comprehensive deep-dive on the origins and history of Islam.
 *
 * Route: /islam-history
 *
 * Sections:
 *  1. Hero — headline, overview of scale (1.8 billion Muslims, 24% of humanity)
 *  2. Arabian Peninsula Context — pre-610 CE tribal society, Mecca, trade
 *  3. The Prophet Muhammad — birth, revelation, Mecca years, Hijra, Medina, return
 *  4. The Five Pillars — Shahada, Salat, Zakat, Sawm, Hajj
 *  5. The Quran — revelation, compilation, significance
 *  6. The Caliphate Era — Rightly Guided Caliphs, Sunni-Shia split, Umayyads, Abbasids
 *  7. The Islamic Golden Age — House of Wisdom, mathematics, medicine, astronomy, philosophy
 *  8. Spread Through Trade — East Africa, Southeast Asia, West Africa, Sufi missionaries
 *  9. The Ottoman Empire — largest Muslim empire, 1299–1922
 * 10. Key Figures — 15+ historical figures
 * 11. Islam Today — Sunni/Shia/Sufi, global distribution, diversity
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const RED = '#ef4444';
const GREEN = '#22c55e';
const PURPLE = '#a855f7';
const TEAL = '#14b8a6';
const BLUE = '#3b82f6';
const ROSE = '#f43f5e';
const INDIGO = '#6366f1';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const EMERALD = '#10b981';
const DESERT_GOLD = '#c88b32';
const CALLIGRAPHY_BLUE = '#1e40af';

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

// ── Arabian Peninsula Context ────────────────────────────────────────────────

const ARABIA_INSIGHTS: InsightEntry[] = [
  {
    label: 'Tribal Society and the Desert',
    detail:
      'Pre-Islamic Arabia — known to Muslims as the Jahiliyyah ("Age of Ignorance") — was a land of fiercely independent Bedouin tribes bound by kinship, honor codes, and blood feuds. There was no central government, no written legal code, and no unifying political authority. Tribal loyalty was everything: your tribe was your identity, your protection, and your law. Poetry was the highest art form, and poets served as tribal propagandists, historians, and diplomats. A gifted poet could start or end wars.',
  },
  {
    label: 'Polytheistic Religion and the Kaaba',
    detail:
      'Most Arabs practiced polytheism, worshiping a pantheon of gods and spirits. The Kaaba in Mecca housed approximately 360 idols representing different tribal deities. The supreme god was Allah (literally "the God"), already recognized as the creator deity, but he was worshipped alongside daughters — al-Lat, al-Uzza, and Manat — and numerous lesser gods. Pilgrimage to the Kaaba was an ancient tradition predating Islam by centuries, and Arab tradition traced the Kaaba\'s origins to Abraham (Ibrahim) and his son Ishmael (Ismail).',
  },
  {
    label: 'Mecca: Trade Crossroads',
    detail:
      'Mecca sat at the intersection of major trade routes linking Yemen and the Indian Ocean trade to the Mediterranean world. The Quraysh tribe, guardians of the Kaaba, leveraged their religious authority into commercial dominance, organizing trading caravans that moved incense, spices, textiles, and slaves across Arabia. The annual pilgrimage season brought tribes together in a sacred truce — no fighting allowed — creating both a religious festival and the peninsula\'s most important trade fair. Mecca was simultaneously a religious center, a commercial hub, and a neutral meeting ground.',
  },
  {
    label: 'Jewish and Christian Communities',
    detail:
      'Arabia was not isolated from the Abrahamic traditions. Significant Jewish communities lived in Medina (then called Yathrib) and throughout Yemen — remnants of the Jewish diaspora and local converts. Christian communities existed in Najran (southern Arabia) and among some northern Arab tribes. Monks and hermits lived in the desert. Muhammad encountered these traditions through trade contacts, and the Quran demonstrates detailed familiarity with biblical narratives — Abraham, Moses, Jesus, and Mary all appear as honored prophets. Islam positioned itself not as a new religion but as the restoration and completion of this Abrahamic lineage.',
  },
];

// ── The Prophet Muhammad ─────────────────────────────────────────────────────

const MUHAMMAD_TIMELINE: TimelineEntry[] = [
  {
    year: '570 CE',
    title: 'Birth and Early Life',
    description:
      'Muhammad ibn Abdullah was born in Mecca into the Banu Hashim clan of the Quraysh tribe — respected but not wealthy. His father Abdullah died before his birth; his mother Amina died when he was six. Orphaned young, he was raised first by his grandfather Abd al-Muttalib, then by his uncle Abu Talib. He grew up without the privilege of wealth or political protection, giving him firsthand understanding of vulnerability in a society that valued tribal power above all.',
    color: DESERT_GOLD,
  },
  {
    year: '595 CE',
    title: 'Marriage to Khadijah',
    description:
      'Muhammad earned a reputation as "al-Amin" (the Trustworthy) working as a merchant. The wealthy widow Khadijah bint Khuwaylid — a successful businesswoman who managed her own trading caravans — was so impressed by his honesty that she proposed marriage. He was 25; she was approximately 40. Khadijah became his most important supporter: his first convert, his confidante during the terrifying early revelations, and the person who reassured him he was not losing his mind when the visions began. Their marriage lasted 25 years until her death, and Muhammad took no other wife during her lifetime.',
    color: GOLD,
  },
  {
    year: '610 CE',
    title: 'The First Revelation — "Iqra" (Read/Recite)',
    description:
      'At age 40, during a spiritual retreat in Cave Hira on Mount Nur outside Mecca, Muhammad experienced a visitation from the Angel Gabriel (Jibril). The angel commanded him to "Iqra" — Read, or Recite. Muhammad, reportedly illiterate, protested that he could not. The angel squeezed him three times until the words came: "Recite in the name of your Lord who created, created man from a clinging substance. Recite, and your Lord is the most Generous." (Quran 96:1–3). Terrified and shaking, Muhammad returned to Khadijah, who wrapped him in a cloak and assured him this was a divine calling, not madness. This night — Laylat al-Qadr (Night of Power) — marks the beginning of Islam.',
    color: CALLIGRAPHY_BLUE,
  },
  {
    year: '610–622 CE',
    title: 'Thirteen Years of Preaching in Mecca',
    description:
      'Muhammad began preaching radical monotheism — there is no god but Allah — combined with urgent calls for social justice: care for orphans, fair treatment of slaves, charity to the poor, and equality before God regardless of tribe or wealth. This directly threatened Mecca\'s establishment. The Quraysh elite derived their power from the pilgrimage trade around the Kaaba\'s 360 idols; monotheism would destroy their business model. They mocked Muhammad, boycotted his clan, and persecuted his followers — particularly slaves and the poor who had no tribal protection. Some early Muslims were tortured; Bilal, an enslaved African convert, was laid on hot sand with rocks on his chest until Abu Bakr purchased and freed him.',
    color: AMBER,
  },
  {
    year: '622 CE',
    title: 'The Hijra — Migration to Medina',
    description:
      'After 13 years of persecution in Mecca, and following the deaths of both Khadijah and his protector uncle Abu Talib (the "Year of Sorrow," 619 CE), Muhammad accepted an invitation from the people of Yathrib (Medina), 320 km north, who needed a neutral arbitrator for their tribal conflicts. The migration — the Hijra — was so transformative that it became Year 1 of the Islamic calendar. In Medina, Muhammad was not merely a preacher but a political leader, judge, and community builder. The small band of persecuted believers became the nucleus of a new kind of society.',
    color: GREEN,
  },
  {
    year: '622 CE',
    title: 'The Constitution of Medina',
    description:
      'One of history\'s most remarkable political documents. Muhammad drafted a charter that united the diverse tribes of Medina — Muslim emigrants from Mecca (Muhajirun), Medinan converts (Ansar), Jewish tribes, and pagan Arabs — into a single political community (ummah). Each group retained its religious laws and internal governance, but all were bound together for mutual defense and shared responsibility. The Jewish tribes were recognized as part of the community with their own religious autonomy. This was arguably the first multi-religious political compact in history — a model of coexistence within a shared civic framework.',
    color: TEAL,
  },
  {
    year: '630 CE',
    title: 'Return to Mecca — The Peaceful Conquest',
    description:
      'After years of conflict between the Medinan Muslim community and Meccan Quraysh — including the battles of Badr (624), Uhud (625), and the Siege of the Trench (627) — Muhammad marched on Mecca with 10,000 followers. Remarkably, the city surrendered with virtually no bloodshed. Muhammad granted a general amnesty to the Meccans who had persecuted him for two decades. He entered the Kaaba and personally destroyed the 360 idols, declaring: "Truth has come, and falsehood has departed." The Quraysh converted en masse. This combination of military strength and magnanimous mercy became a defining model for Islamic leadership.',
    color: EMERALD,
  },
  {
    year: '632 CE',
    title: 'The Farewell Sermon and Death',
    description:
      'During his final pilgrimage to Mecca, Muhammad delivered what became known as the Farewell Sermon to over 100,000 followers on the plain of Arafat. Its themes were revolutionary: "All mankind is from Adam and Eve. An Arab has no superiority over a non-Arab, nor does a non-Arab have any superiority over an Arab; a white has no superiority over a black, nor does a black have any superiority over a white — except by piety and good action." He emphasized women\'s rights, the prohibition of usury, and the sanctity of life and property. Three months later, Muhammad died in Medina at age 62. He left no designated successor — a gap that would shape Islam\'s political history for 1,400 years.',
    color: ROSE,
  },
];

// ── The Five Pillars ─────────────────────────────────────────────────────────

const PILLARS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Shahada — Declaration of Faith',
    detail:
      'La ilaha illa Allah, Muhammadun rasul Allah — "There is no god but God, and Muhammad is the messenger of God." This single sentence is the foundation of Islamic belief. Sincerely reciting the Shahada before witnesses is all that is required to become a Muslim. Its simplicity is deliberate: no priesthood, no baptism, no complex theology — just a direct declaration of monotheism and prophetic authority. The first half connects Islam to the entire Abrahamic tradition; the second half distinguishes it.',
  },
  {
    label: 'Salat — Five Daily Prayers',
    detail:
      'Muslims pray five times daily — at dawn (Fajr), noon (Dhuhr), afternoon (Asr), sunset (Maghrib), and night (Isha) — facing the direction of the Kaaba in Mecca. Each prayer involves a specific sequence of standing, bowing, prostrating, and sitting, accompanied by Quranic recitation in Arabic. The prayers structure the entire day around remembrance of God. The call to prayer (adhan), sung from minarets, is one of the most recognizable sounds in the world. Friday noon prayer (Jumu\'ah) is congregational and includes a sermon. Prayer creates both a personal discipline and a communal rhythm that unites Muslims worldwide in synchronized worship.',
  },
  {
    label: 'Zakat — Almsgiving (2.5% of Wealth)',
    detail:
      'Not charity but obligation: every Muslim with wealth above a minimum threshold (nisab) must annually give 2.5% of their accumulated wealth to the poor. This is not a tax on income but on stored wealth — a crucial distinction that discourages hoarding and encourages both generosity and economic circulation. Zakat is distributed to specific categories: the poor, the destitute, those in debt, travelers in need, and others. It functions as both a spiritual purification ("zakat" literally means "purification") and a systematic social safety net. In early Islamic society, zakat was collected and distributed by the state.',
  },
  {
    label: 'Sawm — Fasting During Ramadan',
    detail:
      'During the holy month of Ramadan — the month in which the first Quranic revelation occurred — Muslims fast from dawn to sunset: no food, no water, no smoking, no sexual relations. The fast cultivates self-discipline, empathy for the hungry, and spiritual reflection. Evenings are spent in communal meals (iftar), extra prayers (tarawih), and Quran recitation. The end of Ramadan is celebrated with Eid al-Fitr, one of Islam\'s two major festivals. Children, the elderly, the sick, pregnant women, and travelers are exempt. Ramadan creates a shared experience of sacrifice and community that transcends class and culture.',
  },
  {
    label: 'Hajj — Pilgrimage to Mecca',
    detail:
      'Every Muslim who is physically and financially able must make the pilgrimage to Mecca at least once in their lifetime. During Hajj, all pilgrims — rich and poor, kings and commoners — wear simple white garments (ihram), stripping away all markers of status and wealth. They circle the Kaaba seven times, walk between the hills of Safa and Marwa (retracing Hagar\'s desperate search for water for her son Ishmael), and stand together on the plain of Arafat in prayer. Over 2 million people perform Hajj annually, making it the largest annual gathering of human beings on Earth. Malcolm X famously described how the Hajj transformed his views on race after seeing Muslims of every color worshipping as equals.',
  },
];

// ── The Quran ────────────────────────────────────────────────────────────────

const QURAN_INSIGHTS: InsightEntry[] = [
  {
    label: 'Revelation Over 23 Years',
    detail:
      'The Quran was not delivered as a single text but revealed to Muhammad in portions over 23 years (610–632 CE), responding to specific events, questions, and challenges faced by the growing Muslim community. Revelations came in different forms — sometimes through the Angel Gabriel in human form, sometimes as a ringing like a bell that Muhammad would interpret, sometimes as direct inspiration. The gradual revelation allowed the Quran to address the evolving needs of a community that grew from a persecuted minority to a governing state.',
  },
  {
    label: 'Oral Memorization and Written Compilation',
    detail:
      'Muhammad could not read or write (Muslim tradition emphasizes his illiteracy as proof the Quran\'s eloquence was divine, not human). Revelations were memorized by companions (huffaz) and written on palm leaves, leather, and bone. After Muhammad\'s death, when many memorizers died in battle, Caliph Abu Bakr commissioned the first written compilation. Caliph Uthman (644–656 CE) standardized the text into a single authoritative version, sending copies to major cities and ordering variant copies destroyed. This Uthmanic codex is the Quran used today — remarkably, the text has remained virtually unchanged for nearly 1,400 years.',
  },
  {
    label: 'Content and Structure',
    detail:
      'The Quran contains 114 chapters (surahs) arranged roughly from longest to shortest (not chronologically). It covers theology (God\'s oneness, attributes, and mercy), law (inheritance, marriage, commerce, criminal justice), ethics (honesty, charity, patience), history (stories of previous prophets from Adam to Jesus), and spiritual guidance (descriptions of paradise, warnings of judgment). It frequently addresses its audience directly: "O you who believe..." or "Say: He is God, the One." The Quran self-describes as guidance (huda), mercy (rahma), and a clear criterion (furqan) between right and wrong.',
  },
  {
    label: 'Arabic Language and Translation',
    detail:
      'The Quran was revealed in Arabic and Muslims believe its divine eloquence is inseparable from that language. The Arabic of the Quran — with its intricate rhyme, rhythm, and layered meanings — is considered inimitable (i\'jaz). Translations into other languages are considered "interpretations of the meaning," not the Quran itself. This theological position has preserved Arabic as a living liturgical language across diverse cultures: a Malay Muslim, a Nigerian Muslim, and a Bosnian Muslim all recite the same Arabic verses in prayer. The Quran\'s influence on the Arabic language itself is immeasurable — it standardized classical Arabic and made it the lingua franca of a civilization.',
  },
];

// ── The Caliphate Era ────────────────────────────────────────────────────────

const CALIPHATE_TIMELINE: TimelineEntry[] = [
  {
    year: '632–634 CE',
    title: 'Abu Bakr — The First Caliph',
    description:
      'Muhammad\'s closest companion and father-in-law became the first caliph ("khalifa" — successor/deputy). His immediate challenge was the Ridda Wars (Wars of Apostasy): many Arabian tribes considered their allegiance personal to Muhammad and broke away after his death. Abu Bakr\'s decisive military campaigns reunited Arabia under Islamic rule within two years. He also launched the first expeditions into the Byzantine and Sassanid empires. His caliphate was brief — just two years — but his insistence that the community would be led by a successor, not a prophet, established the caliphate as a political institution.',
    color: DESERT_GOLD,
  },
  {
    year: '634–644 CE',
    title: 'Umar ibn al-Khattab — The Great Expander',
    description:
      'The second caliph transformed Islam from an Arabian movement into a world civilization. Under Umar, Muslim armies conquered Syria, Egypt, Mesopotamia, and Persia — an expansion so rapid it stunned the ancient world. Two great empires — the Byzantine and Sassanid — lost vast territories in less than a decade. Umar was also an administrative genius: he established the Islamic calendar, created a treasury (bayt al-mal), organized the military into a professional force with pensions, and set up a system of provincial governance. When he conquered Jerusalem in 637 CE, he personally visited the Church of the Holy Sepulchre and refused to pray inside, saying he feared future Muslims would convert it into a mosque. He was assassinated by a Persian slave in 644.',
    color: BLUE,
  },
  {
    year: '644–656 CE',
    title: 'Uthman ibn Affan — Compiler of the Quran',
    description:
      'The third caliph\'s greatest legacy was standardizing the Quran into a single authoritative text, preventing the kind of textual fragmentation that had affected other scriptures. Uthman continued territorial expansion — Muslim forces reached Central Asia and North Africa — and built the first Muslim navy. However, his later years were plagued by accusations of nepotism (he appointed relatives as governors) and financial mismanagement. Growing discontent erupted: rebels from Egypt besieged his house in Medina and assassinated him in 656 CE while he was reading the Quran. His murder traumatized the Muslim community and set the stage for Islam\'s first civil war.',
    color: AMBER,
  },
  {
    year: '656–661 CE',
    title: 'Ali ibn Abi Talib — The Fourth Caliph and the Fitna',
    description:
      'Ali — Muhammad\'s cousin, son-in-law (married to his daughter Fatimah), and one of the first converts — became caliph amid civil war. He faced immediate opposition from Aisha (Muhammad\'s widow) and the governors Talha and Zubayr at the Battle of the Camel (656), then a prolonged struggle with Muawiyah, the Umayyad governor of Syria, who refused to accept Ali\'s authority and demanded justice for Uthman\'s murder. The Battle of Siffin (657) ended in arbitration that weakened Ali. He was assassinated by a Kharijite extremist in 661. For Shia Muslims, Ali was the rightful successor from the beginning — Muhammad\'s designated heir — and his caliphate represents the last legitimate Islamic government.',
    color: GREEN,
  },
  {
    year: '656–680 CE',
    title: 'The Sunni-Shia Split',
    description:
      'The most consequential division in Islamic history. After Ali\'s death, Muawiyah established the Umayyad dynasty, making the caliphate hereditary. When his son Yazid inherited the throne, Ali\'s son Husayn ibn Ali — grandson of the Prophet — refused to pledge allegiance, viewing Umayyad rule as tyranny. At Karbala (680 CE, in modern Iraq), Yazid\'s army massacred Husayn and 72 of his companions. This tragedy became the defining event of Shia Islam — commemorated annually during Muharram with intense mourning. Sunnis (about 85–90% of Muslims today) accept the historical caliphate; Shia (10–15%) believe leadership should have passed through Ali and the Prophet\'s family (Ahl al-Bayt). This division — political in origin — developed into distinct theological, legal, and devotional traditions.',
    color: CRIMSON,
  },
  {
    year: '661–750 CE',
    title: 'The Umayyad Caliphate — Damascus',
    description:
      'The Umayyads moved the capital from Medina to Damascus and built the first hereditary Muslim dynasty. Under their rule, the Islamic empire reached its greatest territorial extent: from Spain and Morocco in the west to the Indus River and Central Asia in the east. The Umayyads built the Dome of the Rock in Jerusalem (691 CE) and the Great Mosque of Damascus. Arabic became the administrative language of the empire, and coinage was Islamized. However, the Umayyads were criticized for ruling as Arab kings rather than pious caliphs, and for privileging Arab Muslims over non-Arab converts (mawali), who were treated as second-class despite their faith. This resentment fueled the Abbasid revolution.',
    color: PURPLE,
  },
  {
    year: '750–1258 CE',
    title: 'The Abbasid Caliphate — Baghdad and the Golden Age',
    description:
      'The Abbasids overthrew the Umayyads in a revolution that drew support from non-Arab Muslims, Persian administrators, and Shia sympathizers (though the Abbasids were Sunni). They built a new capital: Baghdad, on the Tigris River, designed as a perfect circle — the "Round City." Baghdad quickly became the world\'s largest and most cosmopolitan city, with perhaps one million inhabitants. The Abbasids presided over the Islamic Golden Age: a period of extraordinary achievement in science, philosophy, medicine, and literature. They embraced Persian administrative traditions and championed a universal Islamic identity over Arab tribalism. The caliphate gradually lost political power to regional dynasties but retained symbolic religious authority until the Mongol sack of Baghdad in 1258.',
    color: INDIGO,
  },
];

// ── The Islamic Golden Age ───────────────────────────────────────────────────

const GOLDEN_AGE_INSIGHTS: InsightEntry[] = [
  {
    label: 'The House of Wisdom (Bayt al-Hikma)',
    detail:
      'Founded in Baghdad under Caliph al-Ma\'mun (r. 813–833), the House of Wisdom was the intellectual engine of the Islamic Golden Age. It was a library, translation center, and research academy rolled into one. Scholars — Muslim, Christian, Jewish, Zoroastrian, and Sabian — translated the complete works of Aristotle, Plato, Galen, Ptolemy, and Euclid from Greek, as well as Sanskrit mathematical texts from India and Persian scientific works. But they didn\'t merely translate — they critiqued, corrected, and expanded upon these works. The House of Wisdom proved that civilization advances when cultures share knowledge rather than hoard it.',
  },
  {
    label: 'Mathematics — Algebra and Algorithms',
    detail:
      'Muhammad ibn Musa al-Khwarizmi (c. 780–850), working at the House of Wisdom, wrote "Al-Kitab al-Mukhtasar fi Hisab al-Jabr wal-Muqabala" — the foundational text of algebra. The word "algebra" comes from "al-jabr" in the title. Al-Khwarizmi\'s name, Latinized as "Algoritmi," gave us the word "algorithm." He also transmitted the Indian numeral system (including zero) to the Islamic world; these "Arabic numerals" reached Europe through Islamic Spain and replaced the cumbersome Roman numeral system, making modern mathematics possible. Omar Khayyam (1048–1131) solved cubic equations geometrically. Al-Kashi calculated pi to 16 decimal places — a record that stood for over a century.',
  },
  {
    label: 'Medicine — Avicenna and the Hospital',
    detail:
      'Ibn Sina (Avicenna, 980–1037) wrote "The Canon of Medicine" — a million-word encyclopedia that systematized Greek, Indian, and Islamic medical knowledge. Translated into Latin, it was the standard medical textbook in European universities until the 17th century. Islamic civilization also pioneered the hospital: the bimaristan was a public institution offering free care to all patients regardless of religion, with separate wards for different conditions, pharmacies, medical libraries, and teaching programs. Al-Razi (Rhazes, 854–925) distinguished between smallpox and measles and wrote the first treatise on pediatric diseases. Al-Zahrawi (Albucasis) invented over 200 surgical instruments, many still used in modified form today.',
  },
  {
    label: 'Astronomy — Naming the Stars',
    detail:
      'Look up at the night sky: most bright stars have Arabic names. Aldebaran ("the follower"), Betelgeuse ("the hand of the giant"), Rigel ("foot"), Altair ("the flying one"), Deneb ("tail"), Vega (from "waqi" — "falling"), Fomalhaut ("mouth of the fish"). Islamic astronomers built sophisticated observatories, refined the astrolabe into a precision instrument, compiled star catalogs of unprecedented accuracy, and calculated the Earth\'s circumference with remarkable precision. Al-Battani corrected Ptolemy\'s astronomical tables. Ibn al-Haytham (Alhazen) wrote "The Book of Optics," establishing the scientific understanding that vision works by light entering the eye (not, as the Greeks believed, by rays emanating from it) — a founding text of the scientific method.',
  },
  {
    label: 'Philosophy — Averroes and the European Renaissance',
    detail:
      'Ibn Rushd (Averroes, 1126–1198), born in Córdoba, wrote the most influential commentaries on Aristotle in history. His argument that philosophical truth and religious truth cannot ultimately contradict each other (the "double truth" doctrine, as his European followers interpreted it) helped create the intellectual space for the European Renaissance and Enlightenment. Thomas Aquinas, who called him simply "The Commentator," built his synthesis of Christian theology and Aristotelian philosophy partly in response to Averroes. Al-Ghazali (1058–1111) mounted a powerful critique of Greek-influenced philosophy in "The Incoherence of the Philosophers," to which Averroes responded with "The Incoherence of the Incoherence" — a debate that shaped Islamic and Western thought for centuries.',
  },
  {
    label: 'The Fall: Mongol Sack of Baghdad (1258)',
    detail:
      'In February 1258, the Mongol army of Hulagu Khan besieged and conquered Baghdad. The last Abbasid caliph, al-Musta\'sim, was rolled in a carpet and trampled to death by horses. The city was sacked for 40 days. The Tigris River reportedly ran black with ink from the manuscripts of the House of Wisdom thrown into its waters, then red with the blood of scholars. Estimates of the dead range from 200,000 to over a million. Libraries, hospitals, mosques, and palaces were destroyed. The cultural and intellectual loss was catastrophic — comparable to the burning of the Library of Alexandria. Baghdad would not recover its former glory for centuries. The Golden Age was over.',
  },
];

// ── Spread Through Trade ─────────────────────────────────────────────────────

const TRADE_INSIGHTS: InsightEntry[] = [
  {
    label: 'East Africa — The Swahili Coast',
    detail:
      'Arab and Persian merchants sailing the Indian Ocean established trading posts along the East African coast from at least the 8th century. The resulting Swahili civilization — a fusion of Bantu African and Islamic Arab cultures — created prosperous city-states like Kilwa, Mombasa, and Zanzibar. Swahili language itself is Bantu in grammar with extensive Arabic vocabulary. Islam spread through intermarriage, trade partnerships, and cultural exchange rather than conquest. By the 14th century, Kilwa was one of the wealthiest cities in the world, minting its own gold currency.',
  },
  {
    label: 'Southeast Asia — Merchants and Mystics',
    detail:
      'Islam reached Indonesia, Malaysia, and the Philippines primarily through Muslim traders from India, Arabia, and China, beginning around the 13th century. Sufi missionaries — Islamic mystics emphasizing love, spiritual experience, and cultural adaptation — were particularly effective, often incorporating local traditions and artistic forms into Islamic practice. Today, Indonesia is the world\'s largest Muslim-majority nation (230+ million Muslims), and Islam in Southeast Asia retains distinctive characteristics shaped by this peaceful, culturally adaptive transmission. No Muslim army ever conquered Java or Sumatra — trade and persuasion did the work.',
  },
  {
    label: 'West Africa — Scholars and Empires',
    detail:
      'Trans-Saharan trade routes carried Islam into West Africa, where it was adopted by ruling elites and merchant classes from the 11th century onward. The great empires of Mali and Songhai were Muslim-ruled. Mansa Musa of Mali (r. 1312–1337) was so wealthy that his lavish pilgrimage to Mecca in 1324 — distributing gold along the way — crashed the gold market in Egypt for a decade. Timbuktu became a center of Islamic learning with the University of Sankore, housing hundreds of thousands of manuscripts. Islam in West Africa blended with local traditions, creating distinctive practices and scholarly traditions that continue today.',
  },
  {
    label: 'Sufi Missionaries — Islam\'s Soft Power',
    detail:
      'Sufism — Islamic mysticism focused on direct experience of the divine through meditation (dhikr), music, poetry, and spiritual disciplines — was perhaps Islam\'s most effective missionary movement. Sufi orders (tariqas) spread across the Islamic world and beyond, establishing lodges (khanqahs or zawiyas) that served as centers of education, hospitality, and spiritual guidance. Sufi missionaries adapted to local cultures: in India they engaged with Hindu philosophy, in West Africa they incorporated local musical traditions, in Central Asia they absorbed shamanic practices. The great Sufi poets — Rumi, Hafiz, Ibn Arabi — produced some of the world\'s most beloved literature.',
  },
];

// ── The Ottoman Empire ───────────────────────────────────────────────────────

const OTTOMAN_INSIGHTS: InsightEntry[] = [
  {
    label: 'Rise and Expansion (1299–1566)',
    detail:
      'Founded by Osman I as a small Turkic principality in Anatolia, the Ottoman state grew through a combination of military prowess, strategic marriages, and administrative innovation. The conquest of Constantinople in 1453 by Mehmed II — ending the 1,100-year Byzantine Empire — sent shockwaves through Christendom and established the Ottomans as a global power. Under Suleiman the Magnificent (r. 1520–1566), the empire reached its zenith: Ottoman territory stretched from Hungary to Yemen, from Algeria to Iraq. Suleiman\'s legal reforms earned him the title "Kanuni" (the Lawgiver) among his own subjects.',
  },
  {
    label: 'The Caliphate and the Millet System',
    detail:
      'The Ottoman sultans claimed the title of caliph — leader of the global Muslim community. They governed a vast, multi-ethnic, multi-religious empire through the millet system: each religious community (Greek Orthodox Christians, Armenian Christians, Jews) was organized as a semi-autonomous millet with its own religious leaders, courts, and laws for personal matters. While not equality in the modern sense — Muslims had legal privileges, and non-Muslims paid a special tax (jizya) — the millet system provided a framework for religious coexistence that allowed diverse communities to maintain their identity for centuries. Jews expelled from Spain in 1492 were welcomed by the Ottomans.',
  },
  {
    label: 'Architecture and Culture',
    detail:
      'The Ottomans were master builders. The architect Mimar Sinan (1489–1588) designed over 300 structures including the Suleymaniye Mosque in Istanbul — considered one of the greatest architectural achievements in Islamic history. Ottoman culture blended Turkish, Persian, and Arab traditions into a distinctive synthesis expressed in calligraphy, miniature painting, ceramics (Iznik tiles), music, and cuisine. The coffeehouse, which originated in Ottoman culture, became a center of social and intellectual life — and eventually spread to Europe, giving birth to the café culture that fueled the Enlightenment.',
  },
  {
    label: 'Decline and End (1683–1922)',
    detail:
      'The failed siege of Vienna in 1683 marked the beginning of Ottoman territorial retreat. Over the next two centuries, the empire lost ground to rising European powers, struggled with internal reform, and grappled with the challenge of modernization. The "Sick Man of Europe," as it was called in the 19th century, attempted reforms (Tanzimat) but could not reverse the decline. The empire\'s collapse after World War I — when it fought on the losing side alongside Germany and Austria-Hungary — led to the abolition of the sultanate (1922) and the caliphate (1924) by Mustafa Kemal Atatürk, who founded the secular Republic of Turkey. The end of the caliphate — an institution that had existed in some form for 1,292 years — remains a significant event in Islamic political consciousness.',
  },
];

// ── Key Figures ──────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Prophet Muhammad',
    years: '570–632 CE',
    contribution:
      'Founder of Islam. Received the Quran through divine revelation, unified Arabia under monotheism, established the first Muslim community in Medina, and created a social and spiritual framework that now guides 1.8 billion people. His life — recorded in extraordinary detail in the hadith literature — serves as the model for Muslim conduct in everything from prayer to commerce to governance.',
  },
  {
    name: 'Khadijah bint Khuwaylid',
    years: 'c. 555–619 CE',
    contribution:
      'Muhammad\'s first wife, first convert to Islam, and most important early supporter. A successful businesswoman in her own right, she provided emotional, financial, and spiritual support during the terrifying early revelations. Without Khadijah\'s unwavering belief, Muhammad might never have continued preaching. She is honored as one of the four most perfect women in Islamic tradition.',
  },
  {
    name: 'Abu Bakr al-Siddiq',
    years: '573–634 CE',
    contribution:
      'Muhammad\'s closest companion and the first caliph. Reunited Arabia after Muhammad\'s death during the Ridda Wars and launched the conquests that would create a world empire. Known as "al-Siddiq" (the Truthful) for immediately believing Muhammad\'s account of the Night Journey. His caliphate established the precedent of elected leadership rather than dynastic succession.',
  },
  {
    name: 'Umar ibn al-Khattab',
    years: '584–644 CE',
    contribution:
      'The second caliph, whose ten-year reign saw the most dramatic expansion in Islamic history. Conquered the Sassanid Persian Empire, took Syria and Egypt from the Byzantines, and established administrative systems that governed the Islamic world for centuries. His personal austerity and insistence on justice made him the model of the righteous ruler in Sunni tradition.',
  },
  {
    name: 'Ali ibn Abi Talib',
    years: '601–661 CE',
    contribution:
      'Muhammad\'s cousin and son-in-law, the fourth Rightly Guided Caliph for Sunnis and the first rightful Imam for Shia Muslims. Renowned for his courage in battle, his wisdom as a judge, and his eloquence as a speaker. His writings, collected in "Nahj al-Balagha" (Peak of Eloquence), are masterpieces of Arabic prose. His contested caliphate and assassination shaped the Sunni-Shia divide that endures today.',
  },
  {
    name: 'Husayn ibn Ali',
    years: '626–680 CE',
    contribution:
      'Grandson of the Prophet Muhammad. His refusal to pledge allegiance to the Umayyad caliph Yazid and his martyrdom at the Battle of Karbala became the foundational narrative of Shia Islam. His sacrifice — standing against tyranny despite certain death — is commemorated annually during Muharram and represents the Shia commitment to justice even at ultimate cost.',
  },
  {
    name: 'Al-Khwarizmi',
    years: 'c. 780–850 CE',
    contribution:
      'Persian mathematician and astronomer at the House of Wisdom. His treatise on algebra gave the field its name; his name gave us the word "algorithm." Transmitted the Indian numeral system (including zero) to the Islamic world and thence to Europe, enabling the mathematical revolution that underpins modern science, computing, and finance.',
  },
  {
    name: 'Ibn Sina (Avicenna)',
    years: '980–1037 CE',
    contribution:
      'Persian polymath whose "Canon of Medicine" was the most influential medical text in history, used in European universities for over 500 years. He also wrote on philosophy, astronomy, theology, and logic. His philosophical synthesis of Aristotelian and Islamic thought influenced both Islamic philosophy and the Latin scholastic tradition of medieval Europe.',
  },
  {
    name: 'Ibn Rushd (Averroes)',
    years: '1126–1198 CE',
    contribution:
      'Andalusian philosopher, jurist, and physician whose commentaries on Aristotle were so influential in Europe that he was known simply as "The Commentator." His defense of rational philosophy against theological criticism helped create the intellectual conditions for the European Renaissance. He also served as chief judge of Córdoba and wrote important works on Islamic jurisprudence.',
  },
  {
    name: 'Saladin (Salah ad-Din)',
    years: '1137–1193 CE',
    contribution:
      'Kurdish Muslim sultan who united Egypt and Syria, recaptured Jerusalem from the Crusaders in 1187, and became a symbol of chivalrous warfare. After taking Jerusalem, he allowed Christian pilgrims continued access, protected churches, and ransomed prisoners rather than massacring them — a stark contrast to the Crusaders\' bloodbath when they took the city in 1099. Even his enemies, including Richard the Lionheart, respected his honor.',
  },
  {
    name: 'Rumi (Jalal ad-Din Rumi)',
    years: '1207–1273 CE',
    contribution:
      'Persian Sufi mystic and poet whose works — particularly the Masnavi (sometimes called "the Persian Quran") and the Divan-e Shams — are among the most widely read poetry in the world. His verses on divine love, spiritual longing, and the unity of all existence transcend religious boundaries. He founded the Mevlevi Order, whose whirling dervish ceremony is a UNESCO-recognized cultural heritage. In the 21st century, he is consistently one of the best-selling poets in the United States.',
  },
  {
    name: 'Ibn Battuta',
    years: '1304–1368/69 CE',
    contribution:
      'Moroccan traveler who spent 30 years journeying across the Islamic world and beyond — from West Africa to China, from the Volga River to the Maldives — covering approximately 120,000 km (75,000 miles). His "Rihla" (Journey) is the most comprehensive first-person travel account of the medieval world, describing the extraordinary diversity and interconnectedness of Islamic civilization at its height.',
  },
  {
    name: 'Ibn Khaldun',
    years: '1332–1406 CE',
    contribution:
      'Tunisian historian and thinker whose "Muqaddimah" (Introduction to History) is considered one of the founding works of sociology, historiography, and economics. He analyzed the rise and fall of civilizations through concepts like asabiyyah (social cohesion), identified cyclical patterns in political power, and insisted on evidence-based historical analysis rather than mere chronicle. His work anticipated many ideas that Europeans would not develop for centuries.',
  },
  {
    name: 'Mimar Sinan',
    years: '1489–1588 CE',
    contribution:
      'Chief architect of the Ottoman Empire for 50 years under three sultans. He designed over 300 structures — mosques, bridges, palaces, bathhouses, and hospitals — including the Suleymaniye Mosque in Istanbul and the Selimiye Mosque in Edirne, considered the pinnacle of Ottoman architecture. His engineering innovations in dome construction rivaled and arguably surpassed those of his Italian contemporaries.',
  },
  {
    name: 'Fatimah al-Fihri',
    years: 'c. 800–880 CE',
    contribution:
      'Founded the University of al-Qarawiyyin in Fez, Morocco in 859 CE — recognized by UNESCO and the Guinness World Records as the oldest continuously operating degree-granting university in the world. She used her inheritance to fund the construction of both the mosque and the associated educational institution, which became a leading center of learning in the medieval Muslim world and influenced the development of the European university system.',
  },
];

// ── Islam Today ──────────────────────────────────────────────────────────────

const TODAY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Sunni Islam (85–90%)',
    detail:
      'The majority tradition, Sunni Islam takes its name from the "Sunnah" (practice) of the Prophet. Sunnis recognize the historical legitimacy of the four Rightly Guided Caliphs and organize religious authority through four major legal schools (madhhabs): Hanafi, Maliki, Shafi\'i, and Hanbali. Each school has distinct approaches to interpreting Islamic law, reflecting the diversity within Sunni thought. Sunni Islam has no formal clergy hierarchy — any learned Muslim can lead prayer or issue legal opinions, though the authority of established scholars and institutions (like Al-Azhar in Cairo) carries enormous weight.',
  },
  {
    label: 'Shia Islam (10–15%)',
    detail:
      'Shia Muslims believe that Ali ibn Abi Talib was Muhammad\'s rightful successor and that spiritual authority passed through a line of Imams descended from the Prophet\'s family. The largest Shia branch, Twelver Shia (predominant in Iran, Iraq, Bahrain, and Lebanon), believes in twelve Imams, the last of whom went into occultation and will return as the Mahdi. Shia Islam has developed distinctive theological concepts, devotional practices (including Muharram commemorations), and a more structured clerical hierarchy — culminating in the marja (source of emulation) system, where grand ayatollahs provide binding religious guidance.',
  },
  {
    label: 'Sufism — The Mystical Dimension',
    detail:
      'Sufism is not a separate sect but the mystical and spiritual dimension of Islam, found within both Sunni and Shia traditions. Sufis seek direct experience of the divine through disciplines like dhikr (remembrance of God), meditation, asceticism, and devotional music (like qawwali in South Asia and sama in Turkey). Organized into orders (tariqas) led by spiritual masters (shaykhs or pirs), Sufism has been one of Islam\'s most dynamic and culturally creative forces. Today, Sufi shrines draw millions of pilgrims across the Muslim world, and Sufi-inspired poetry and music enjoy global audiences — though Sufism also faces opposition from puritanical reform movements.',
  },
  {
    label: 'Global Distribution and Diversity',
    detail:
      'With approximately 1.8 billion adherents (24% of humanity), Islam is the world\'s second-largest religion and the fastest growing. The largest Muslim populations are in Indonesia (230M+), Pakistan (220M+), Bangladesh (155M+), and Egypt (100M+) — not in the Arab world, which contains only about 20% of all Muslims. Significant Muslim minorities live in India (200M+), China (25M+), Russia (20M+), and across Europe and the Americas. This diversity means there is no single "Muslim experience" — Islam is lived differently in Jakarta, Lagos, Tehran, Istanbul, and Detroit, shaped by local cultures, histories, and traditions while united by shared pillars of faith.',
  },
  {
    label: 'Challenges and Renewal',
    detail:
      'Contemporary Islam grapples with questions facing all major world religions in modernity: the relationship between religious law and secular governance, the role of women in religious leadership, interpretive authority in an age of mass literacy and social media, and how to maintain tradition while engaging with rapid social change. Internal debates between traditionalists, modernists, and revivalists are vigorous and ongoing. The legacy of colonialism, political instability in many Muslim-majority countries, and the rise of extremist movements have added urgency to these conversations. Yet the vast majority of the world\'s 1.8 billion Muslims navigate these challenges through the daily practice of a faith that emphasizes mercy, justice, knowledge, and community.',
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

const FIGURE_COLORS = [DESERT_GOLD, BLUE, ROSE, GOLD, INDIGO, TEAL, EMERALD, PURPLE, AMBER, CRIMSON, GREEN, CALLIGRAPHY_BLUE, RED, SLATE, GOLD];

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

export default function IslamHistoryPage() {
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
              background: `linear-gradient(135deg, ${DESERT_GOLD}, ${EMERALD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Islam — From Desert Revelation to World Civilization (610 CE–Present)
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
              With 1.8 billion adherents — 24% of humanity — Islam is the
              world's second-largest religion and one of the most powerful
              forces in human history. Born from a single man's revelation in a
              cave outside Mecca in 610 CE, Islam grew within a single century
              into a civilization stretching from Spain to Central Asia, and
              within a few centuries more into the dominant faith across a belt
              of the globe from West Africa to Southeast Asia.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              To understand Islam is to understand the origins of algebra, the
              hospitals, the star names we still use, the preservation of Greek
              philosophy that made the European Renaissance possible, and a
              living faith that shapes the daily lives of nearly a quarter of
              all humans. This is the story of how it began, what it teaches,
              and how it transformed the world.
            </p>
          </motion.div>
        </header>

        {/* ── Arabian Peninsula Context ──────────────────────────────── */}
        <SectionWrapper
          id="arabia"
          icon="🏜️"
          title="The Arabian Peninsula Before Islam (Pre-610 CE)"
          accentColor={DESERT_GOLD}
          intro="To understand Muhammad's revolution, you must understand the world he was born into. Seventh-century Arabia was a land of tribal warriors, caravan merchants, and competing religious traditions — a society that desperately needed the unifying vision Muhammad would provide."
        >
          <InsightGrid items={ARABIA_INSIGHTS} />
        </SectionWrapper>

        {/* ── The Prophet Muhammad ────────────────────────────────────── */}
        <SectionWrapper
          id="muhammad"
          icon="🕌"
          title="The Prophet Muhammad (570–632 CE)"
          accentColor={EMERALD}
          intro="Muhammad ibn Abdullah is the central human figure of Islam — not divine, Muslims insist, but the final prophet in a chain stretching from Adam through Abraham, Moses, and Jesus. His life, recorded in extraordinary detail, is simultaneously the story of a spiritual visionary, a social reformer, a military commander, and a state builder. No single individual has more directly shaped the daily lives of more human beings."
        >
          <TimelineCard entries={MUHAMMAD_TIMELINE} />
        </SectionWrapper>

        {/* ── The Five Pillars ────────────────────────────────────────── */}
        <SectionWrapper
          id="pillars"
          icon="🕋"
          title="The Five Pillars of Islam"
          accentColor={GOLD}
          intro="The Five Pillars are the core practices that define Muslim life — the non-negotiable obligations that every Muslim, regardless of culture, language, or legal school, shares. They are simultaneously acts of worship, social bonds, and a practical framework for living a life oriented toward God."
        >
          <InsightGrid items={PILLARS_INSIGHTS} />
        </SectionWrapper>

        {/* ── The Quran ───────────────────────────────────────────────── */}
        <SectionWrapper
          id="quran"
          icon="📖"
          title="The Quran — The Word of God"
          accentColor={CALLIGRAPHY_BLUE}
          intro="For Muslims, the Quran is not a book about God — it is the literal speech of God, revealed to Muhammad over 23 years through the Angel Gabriel. It is the foundation of Islamic law, theology, ethics, and daily devotion. Its influence on Arabic language, Islamic art (where calligraphy replaced figurative imagery), and Muslim civilization is immeasurable."
        >
          <InsightGrid items={QURAN_INSIGHTS} />
        </SectionWrapper>

        {/* ── The Caliphate Era ───────────────────────────────────────── */}
        <SectionWrapper
          id="caliphate"
          icon="⚔️"
          title="The Caliphate Era (632–1258 CE)"
          accentColor={INDIGO}
          intro="After Muhammad's death, the question of succession — who leads the Muslim community? — launched an era of breathtaking expansion and profound internal conflict. Within a century, former desert nomads ruled an empire larger than Rome's. But the political disputes of this era also created the Sunni-Shia divide that shapes Islam to this day."
        >
          <TimelineCard entries={CALIPHATE_TIMELINE} />
        </SectionWrapper>

        {/* ── The Islamic Golden Age ──────────────────────────────────── */}
        <SectionWrapper
          id="golden-age"
          icon="🔬"
          title="The Islamic Golden Age (750–1258 CE)"
          accentColor={AMBER}
          intro="While medieval Europe languished in relative intellectual stagnation, the Islamic world experienced one of history's greatest explosions of scientific, philosophical, and cultural achievement. Muslim, Christian, and Jewish scholars working in Baghdad, Córdoba, Cairo, and Samarkand preserved ancient knowledge, invented new disciplines, and laid foundations that modern civilization still stands on."
        >
          <InsightGrid items={GOLDEN_AGE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Spread Through Trade ────────────────────────────────────── */}
        <SectionWrapper
          id="trade"
          icon="🚢"
          title="Islam Spreads Through Trade — Not Only Conquest"
          accentColor={TEAL}
          intro="One of the most important and least understood aspects of Islamic history is how the faith spread beyond the territories conquered by Arab armies. Across East Africa, Southeast Asia, and West Africa, Islam arrived not through invasion but through merchants, scholars, and especially Sufi mystics — demonstrating that persuasion and cultural exchange could be more powerful than the sword."
        >
          <InsightGrid items={TRADE_INSIGHTS} />
        </SectionWrapper>

        {/* ── The Ottoman Empire ──────────────────────────────────────── */}
        <SectionWrapper
          id="ottoman"
          icon="🏰"
          title="The Ottoman Empire (1299–1922)"
          accentColor={PURPLE}
          intro="The longest-lasting and most powerful of the Islamic empires, the Ottoman state endured for over six centuries, governed territories from the Balkans to the Arabian Peninsula, and claimed the caliphate for the Sunni Muslim world. Its rise, zenith, and fall shaped the modern Middle East, southeastern Europe, and North Africa."
        >
          <InsightGrid items={OTTOMAN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures in Islamic History"
          accentColor={GOLD}
          intro="Islam's 1,400-year history has been shaped by prophets, scholars, warriors, mystics, scientists, and statesmen. These are some of the most consequential — people whose ideas, actions, and sacrifices defined the civilization."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Islam Today ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="today"
          icon="🌍"
          title="Islam Today — 1.8 Billion and Growing"
          accentColor={BLUE}
          intro="Islam in the 21st century is extraordinarily diverse — a faith practiced on every inhabited continent, in thousands of languages, across cultures as different as Indonesian Java and Senegalese Dakar. Understanding Islam today requires appreciating both its unifying pillars and its breathtaking internal variety."
        >
          <InsightGrid items={TODAY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Footer ─────────────────────────────────────────────────── */}
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
            "Read in the name of your Lord who created — created man from a
            clinging substance. Read, and your Lord is the most Generous."
            — Quran 96:1–3, the first words revealed to Muhammad
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
