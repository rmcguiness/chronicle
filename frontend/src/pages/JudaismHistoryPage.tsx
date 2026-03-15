/**
 * JudaismHistoryPage — comprehensive deep-dive on the History of Judaism.
 *
 * Route: /judaism-history
 *
 * Sections:
 *  1. Hero — Judaism as oldest monotheistic religion, 4,000 years of survival
 *  2. The Patriarchs (c.2000–1700 BCE) — Abraham, Isaac, Jacob
 *  3. Egypt and the Exodus (c.1300–1200 BCE) — Moses, Torah, Ten Commandments
 *  4. The Kingdom Period (c.1000–586 BCE) — Saul, David, Solomon, divided kingdom
 *  5. Babylonian Exile and Return (586–516 BCE) — transformation to Torah-centered faith
 *  6. Second Temple Period (516 BCE–70 CE) — Maccabees, Roman occupation, Temple destruction
 *  7. Rabbinic Judaism (70 CE–1800s) — Talmud, Diaspora, Golden Age, medieval persecution
 *  8. Modern Jewish History — Haskalah, Zionism, Holocaust, Israel
 *  9. Key Texts — Torah, Talmud, Midrash, Kabbalah, Maimonides
 * 10. Key Figures — 15+ figures from Abraham to Elie Wiesel
 * 11. Judaism's Contributions — monotheism, legal tradition, prophetic ethics
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const BLUE = '#3b82f6';
const AMBER = '#d97706';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const CRIMSON = '#dc2626';
const OLIVE = '#6b7a2e';
const ROSE = '#f43f5e';
const GREEN = '#22c55e';
const PURPLE = '#a855f7';
const STEEL = '#64748b';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const SAND = '#d4a574';
const ROYAL_BLUE = '#2563eb';
const DESERT = '#c2884e';
const PARCHMENT = '#e8d5b7';
const MENORAH_GOLD = '#daa520';
const STAR_BLUE = '#1e40af';

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

// ── The Patriarchs (c.2000–1700 BCE) ────────────────────────────────────────

const PATRIARCHS_INSIGHTS: InsightEntry[] = [
  {
    label: "Abraham's Covenant with God",
    detail:
      'In a world of polytheistic religions — where every city, river, and storm had its own deity — Abraham made a radical claim: there is one God, and He has chosen Abraham\'s descendants for a special covenant. God promised Abraham three things: monotheism (worship of one God alone), land (Canaan, "the Promised Land"), and descendants as numerous as the stars. In return, Abraham and his male descendants would be circumcised as a physical sign of the covenant. This was not merely a theological proposition — it was the foundation of an entirely new way of understanding humanity\'s relationship to the divine. Every synagogue, church, and mosque in the world traces its theological ancestry to this moment.',
  },
  {
    label: 'Isaac and Ishmael: Judaism and Islam\'s Common Ancestor Story',
    detail:
      'Abraham had two sons: Ishmael (by Hagar, Sarah\'s Egyptian handmaid) and Isaac (by Sarah, his wife). According to Jewish tradition, God\'s covenant passed through Isaac. According to Islamic tradition, Ishmael was the favored son — and the ancestor of the Prophet Muhammad. This divergence in a single family narrative became the theological foundation for two of the world\'s great religions. The binding of Isaac (the Akedah) — where God tests Abraham by commanding him to sacrifice his son, then stays his hand — is one of the most discussed passages in all of Western literature and theology.',
  },
  {
    label: 'Jacob Becomes Israel — 12 Sons, 12 Tribes',
    detail:
      'Isaac\'s son Jacob — a trickster who cheated his brother Esau out of his birthright and his father\'s blessing — had a mysterious nighttime encounter where he wrestled with a divine being until dawn. The being renamed him "Israel" (meaning "one who wrestles with God"), and this name would define an entire people. Jacob had twelve sons, each of whom became the ancestor of one of the twelve tribes of Israel: Reuben, Simeon, Levi, Judah, Dan, Naphtali, Gad, Asher, Issachar, Zebulun, Joseph, and Benjamin. The tribe of Judah would eventually give its name to "Judaism" and "Jews."',
  },
  {
    label: 'Historical Context: What Can We Know?',
    detail:
      'The patriarchal narratives in Genesis are not history in the modern sense — they are foundational stories that a people told about themselves. No archaeological evidence confirms the existence of Abraham, Isaac, or Jacob as historical individuals. The stories likely reflect traditions from the second millennium BCE, passed down orally for centuries before being written down. But their historical verifiability is almost beside the point: these narratives created a people, defined a covenant, and established a moral framework that has shaped three billion lives across four millennia. Few "historical" documents have had more impact on human civilization.',
  },
];

// ── Egypt and the Exodus (c.1300–1200 BCE) ──────────────────────────────────

const EXODUS_TIMELINE: TimelineEntry[] = [
  {
    year: 'c.1700 BCE',
    title: 'Joseph in Egypt — From Slave to Vizier',
    description:
      'Joseph, Jacob\'s favorite son, was sold into slavery by his jealous brothers and taken to Egypt. Through his ability to interpret dreams — including Pharaoh\'s dream of seven fat and seven lean cows, predicting seven years of plenty followed by seven years of famine — Joseph rose to become Egypt\'s vizier, second only to Pharaoh. He brought his family to Egypt during the famine. This migration set the stage for the central drama of Jewish history: the Israelites would thrive in Egypt, then be enslaved there for generations.',
    color: SAND,
  },
  {
    year: 'c.1300 BCE',
    title: 'Slavery in Egypt',
    description:
      'A new Pharaoh "who knew not Joseph" grew alarmed at the growing Israelite population and enslaved them. They were forced to build the store-cities of Pithom and Rameses. Pharaoh ordered the killing of all newborn Israelite boys. The experience of slavery became the defining memory of the Jewish people — referenced more than any other event in the Torah. "You were strangers in the land of Egypt" became the basis for Judaism\'s emphasis on social justice and compassion for the vulnerable.',
    color: CRIMSON,
  },
  {
    year: 'c.1250 BCE',
    title: 'Moses: Burning Bush and the Mission to Free Israel',
    description:
      'Moses — born an Israelite, raised as an Egyptian prince, and exiled as a fugitive after killing an Egyptian overseer — encountered God in a burning bush on Mount Horeb. God revealed His name as YHWH ("I Am Who I Am") and commanded Moses to return to Egypt and demand that Pharaoh release the Israelites. Moses protested that he was a poor speaker, so God appointed his brother Aaron as spokesman. The reluctant prophet became the greatest leader in Jewish history — lawgiver, liberator, and the man who spoke with God "face to face."',
    color: GOLD,
  },
  {
    year: 'c.1250 BCE',
    title: 'The Ten Plagues and the Exodus',
    description:
      'When Pharaoh refused to free the Israelites, God sent ten plagues upon Egypt: blood, frogs, lice, flies, livestock disease, boils, hail, locusts, darkness, and the death of the firstborn. On the night of the final plague, the Israelites marked their doorposts with lamb\'s blood so the Angel of Death would "pass over" their homes — the origin of Passover (Pesach), Judaism\'s most widely observed holiday. Pharaoh finally relented, and the Israelites fled — only for Pharaoh to change his mind and pursue them. The parting of the Red Sea (or "Sea of Reeds") and the drowning of the Egyptian army became the archetypal story of divine liberation.',
    color: ROYAL_BLUE,
  },
  {
    year: 'c.1200 BCE',
    title: 'Sinai: Torah, Ten Commandments, 613 Mitzvot',
    description:
      'At Mount Sinai, the Israelites received the Torah — the foundational text of Judaism. The Ten Commandments (worship one God, no idols, no taking God\'s name in vain, keep the Sabbath, honor parents, no murder, no adultery, no stealing, no false witness, no coveting) established the moral framework for Western civilization. But the Torah contains 613 commandments (mitzvot) total — governing everything from diet to criminal law to treatment of strangers to agricultural practices. This was not merely a religion: it was a complete legal and social system, the first of its kind in the ancient world.',
    color: MENORAH_GOLD,
  },
  {
    year: 'c.1200 BCE',
    title: 'The Archaeological Debate',
    description:
      'Modern archaeology has found no direct evidence for the Exodus as described in the biblical narrative — no Egyptian records of a mass Israelite departure, no trace of millions of people wandering the Sinai for 40 years. Some scholars argue the Exodus is entirely legendary; others suggest a smaller-scale migration that was later amplified in collective memory. The Merneptah Stele (c.1207 BCE), an Egyptian inscription, provides the earliest known reference to "Israel" as a people in Canaan. Whatever its historical basis, the Exodus narrative shaped Jewish identity more profoundly than any other story: Jews are a people defined by liberation from oppression.',
    color: STEEL,
  },
];

// ── The Kingdom Period (c.1000–586 BCE) ─────────────────────────────────────

const KINGDOM_TIMELINE: TimelineEntry[] = [
  {
    year: 'c.1020 BCE',
    title: 'Saul: First King of Israel (Reluctantly Anointed)',
    description:
      'The Israelites, tired of being governed by judges and threatened by the Philistines, demanded a king "like all the other nations." The prophet Samuel, who saw monarchy as a rejection of God\'s direct rule, reluctantly anointed Saul of the tribe of Benjamin. Saul\'s reign was troubled: he won military victories but suffered from what the text describes as an "evil spirit," made rash vows, disobeyed prophetic commands, and grew increasingly paranoid about his successor David. His story is a cautionary tale about the dangers of power — one of the earliest in world literature.',
    color: OLIVE,
  },
  {
    year: 'c.1000 BCE',
    title: 'David: United Monarchy and the City of Jerusalem',
    description:
      'David — shepherd, poet, giant-slayer, warrior, adulterer, and the greatest king in Jewish memory — united the twelve tribes into a single kingdom and conquered Jerusalem from the Jebusites, making it his capital. By choosing a city that belonged to no tribe, David created a neutral capital (like Washington, D.C.) that could unite the nation. He brought the Ark of the Covenant to Jerusalem, establishing it as the religious center of Israel. The Psalms tradition is attributed to David, and Jewish messianic expectation holds that the Messiah will come from the "House of David." Despite his many flaws — his affair with Bathsheba and murder of her husband Uriah — David remains the idealized king.',
    color: ROYAL_BLUE,
  },
  {
    year: 'c.957 BCE',
    title: 'Solomon: The First Temple and the Golden Age',
    description:
      'Solomon, David\'s son, built the First Temple in Jerusalem — the House of God, the holiest site in Judaism, where the Ark of the Covenant was housed in the innermost chamber (the Holy of Holies). The Temple took seven years to build and was, according to the biblical account, magnificently adorned with gold, cedar, and precious stones. Solomon was famous for his wisdom (the Judgment of Solomon), his wealth, his 700 wives and 300 concubines, and his authorship of Proverbs, Ecclesiastes, and the Song of Songs. But his heavy taxation and forced labor sowed the seeds of national division.',
    color: MENORAH_GOLD,
  },
  {
    year: 'c.930 BCE',
    title: 'The Kingdom Divides: Israel and Judah',
    description:
      'After Solomon\'s death, his son Rehoboam refused to reduce the tax burden, famously declaring: "My father chastised you with whips; I will chastise you with scorpions." Ten northern tribes revolted under Jeroboam and formed the Kingdom of Israel, with its capital eventually at Samaria. The two southern tribes (Judah and Benjamin) remained loyal to the House of David, forming the Kingdom of Judah with its capital at Jerusalem. This split weakened both kingdoms and left them vulnerable to the great empires of Mesopotamia.',
    color: AMBER,
  },
  {
    year: '721 BCE',
    title: 'Assyria Destroys the Northern Kingdom — The "Lost Ten Tribes"',
    description:
      'The Neo-Assyrian Empire, the most fearsome military power of the ancient Near East, conquered the northern Kingdom of Israel in 721 BCE. The Assyrians deported much of the population and resettled foreigners in the territory — their standard practice for destroying conquered peoples\' identity. The ten northern tribes effectively vanished from history, becoming the "Lost Ten Tribes of Israel" — one of history\'s great mysteries. Claims of descent from the Lost Tribes have been made by groups from Ethiopia to Japan to the Americas, but their fate remains unknown.',
    color: CRIMSON,
  },
  {
    year: '586 BCE',
    title: 'Babylon Destroys Jerusalem and the First Temple',
    description:
      'In 586 BCE, Nebuchadnezzar II of Babylon besieged and destroyed Jerusalem, burned the First Temple — which had stood for nearly 400 years — and deported the Judean elite to Babylon. This was the greatest catastrophe in Jewish history until the destruction of the Second Temple 656 years later. The Ark of the Covenant vanished (its fate remains unknown). The Babylonian Exile forced a fundamental transformation: how do you worship a God whose Temple has been destroyed, in a land far from home? The answer would reshape Judaism forever.',
    color: ROSE,
  },
];

// ── Babylonian Exile and Return (586–516 BCE) ───────────────────────────────

const EXILE_INSIGHTS: InsightEntry[] = [
  {
    label: '"By the Rivers of Babylon" — Psalm 137',
    detail:
      '"By the rivers of Babylon, there we sat down, yea, we wept, when we remembered Zion." This psalm captures the anguish of exile — and the fierce determination to remember. "If I forget thee, O Jerusalem, let my right hand forget her cunning." The Babylonian Exile lasted roughly 50 years, but it fundamentally transformed Judaism. Cut off from the Temple, Jews turned to the Torah — reading, studying, interpreting, and arguing about the text. Synagogues (houses of study and prayer) emerged as alternatives to Temple worship. Judaism became, uniquely among ancient religions, a portable faith — carried not in a building but in a book.',
  },
  {
    label: 'From Temple-Centered to Torah-Centered',
    detail:
      'Before the Exile, Israelite religion was centered on the Temple: animal sacrifice, priestly rituals, physical proximity to God\'s dwelling place. The Exile forced a revolution. Without the Temple, the text became the center. Torah study became the highest form of worship. Prayer replaced sacrifice. The rabbi (teacher) would eventually replace the priest. This transformation — from a religion of place to a religion of text — is why Judaism survived when every other ancient Near Eastern religion perished. The Egyptians, Babylonians, Assyrians, Philistines — all gone. The Jews, with their portable book, endured.',
  },
  {
    label: 'Cyrus the Great: The Messiah Who Wasn\'t Jewish',
    detail:
      'In 539 BCE, Cyrus the Great of Persia conquered Babylon and issued a decree allowing the Jews to return to Jerusalem and rebuild their Temple. The Hebrew Bible calls Cyrus "God\'s anointed" (mashiach — the same word translated as "Messiah") — the only non-Jew ever given this title in Jewish scripture. Not all Jews returned; many stayed in Babylon, establishing one of the most important diaspora communities in Jewish history — a community that would produce the Babylonian Talmud nearly a thousand years later. The Second Temple was completed around 516 BCE, but it was a modest structure compared to Solomon\'s original.',
  },
  {
    label: 'Ezra and Nehemiah: Codifying Jewish Identity',
    detail:
      'Ezra the Scribe and Nehemiah the governor, returning from Babylon in the mid-400s BCE, undertook two critical projects. Ezra publicly read the Torah to the assembled people and established it as the binding law of the community — perhaps the first public reading of scripture in history. Nehemiah rebuilt Jerusalem\'s walls. Together, they strengthened Jewish identity through adherence to Torah law, Sabbath observance, and endogamy (marriage within the community). The Judaism that emerged from the Exile was more text-centered, more law-focused, and more conscious of its distinctiveness than the Israelite religion that preceded it.',
  },
];

// ── Second Temple Period (516 BCE–70 CE) ────────────────────────────────────

const SECOND_TEMPLE_TIMELINE: TimelineEntry[] = [
  {
    year: '167–160 BCE',
    title: 'The Maccabean Revolt and the Hanukkah Story',
    description:
      'The Seleucid king Antiochus IV Epiphanes attempted to forcibly Hellenize the Jews: he outlawed Torah study, circumcision, and Sabbath observance, and desecrated the Temple by erecting an altar to Zeus and sacrificing a pig on it. A priestly family — Mattathias and his five sons, led by Judah "the Maccabee" (the Hammer) — launched a guerrilla revolt. Against overwhelming odds, they defeated the Seleucid army, recaptured Jerusalem, and rededicated the Temple. According to tradition, they found only one day\'s supply of ritually pure oil for the Temple menorah, but it miraculously burned for eight days — the origin of Hanukkah.',
    color: MENORAH_GOLD,
  },
  {
    year: '63 BCE',
    title: 'Roman Occupation Begins',
    description:
      'The Roman general Pompey conquered Jerusalem in 63 BCE, ending Jewish political independence. Judea became a Roman client state, eventually ruled by Herod the Great (37–4 BCE) — a brilliant builder who expanded the Second Temple into one of the ancient world\'s most magnificent structures, but also a paranoid tyrant who murdered his own wife and sons. After Herod, a series of increasingly incompetent and corrupt Roman governors drove the population toward revolt. The political context was explosive: foreign occupation, heavy taxation, religious tension, and messianic expectation.',
    color: CRIMSON,
  },
  {
    year: '1st Century CE',
    title: 'Jewish Sects: Pharisees, Sadducees, Essenes, Zealots',
    description:
      'Second Temple Judaism was not monolithic — it was a vibrant, contentious world of competing movements. The Sadducees were the priestly aristocracy, focused on Temple ritual and rejecting belief in resurrection. The Pharisees emphasized oral tradition alongside written Torah and believed in resurrection — they would become the ancestors of rabbinic Judaism. The Essenes withdrew to the desert (likely producing the Dead Sea Scrolls). The Zealots advocated armed revolt against Rome. Jesus of Nazareth was born into this context as one of many Jewish teachers and messianic claimants. Christianity began as a Jewish sect.',
    color: INDIGO,
  },
  {
    year: '70 CE',
    title: 'Rome Destroys the Second Temple — Central Catastrophe',
    description:
      'In 66 CE, the Jews revolted against Rome. After four years of brutal warfare, the Roman general Titus besieged Jerusalem. On the 9th of Av (Tisha B\'Av), 70 CE, the Second Temple was burned and destroyed. According to Josephus, 1.1 million Jews died in the siege. The Temple\'s destruction is the central catastrophe of Jewish history — commemorated annually on Tisha B\'Av, the saddest day in the Jewish calendar. The Western Wall (the "Wailing Wall") — the retaining wall of the Temple Mount — is all that remains, and it is the holiest site in Judaism today. Judaism would never again be centered on a Temple.',
    color: ROSE,
  },
  {
    year: '132–135 CE',
    title: 'Bar Kokhba Revolt — The Final Stand',
    description:
      'The last major Jewish revolt against Rome was led by Simon bar Kokhba, whom the great Rabbi Akiva proclaimed the Messiah. For three years, bar Kokhba established an independent Jewish state. But Rome\'s response was overwhelming: Emperor Hadrian crushed the revolt, killing an estimated 580,000 Jews. Hadrian renamed Judea "Syria Palaestina" (after the ancient Philistines — a deliberate insult), banned Jews from Jerusalem, and attempted to erase Jewish connection to the land. The revolt\'s failure ended Jewish sovereignty in the Land of Israel for nearly 1,800 years — until 1948.',
    color: CRIMSON,
  },
];

// ── Rabbinic Judaism (70 CE–1800s) ──────────────────────────────────────────

const RABBINIC_INSIGHTS: InsightEntry[] = [
  {
    label: 'Without Temple, Rabbis Become Leaders',
    detail:
      'The destruction of the Temple in 70 CE could have been the end of Judaism — it was, after all, the end of the Sadducees, the Essenes, and the Zealots. But the Pharisaic movement, led by Rabbi Yohanan ben Zakkai (who, according to tradition, was smuggled out of besieged Jerusalem in a coffin), established an academy at Yavneh and reinvented Judaism. Torah study replaced animal sacrifice. The rabbi replaced the priest. The synagogue replaced the Temple. Prayer replaced offering. This was one of the most remarkable religious adaptations in human history — a Temple religion that survived the permanent loss of its Temple.',
  },
  {
    label: 'Mishnah (c.200 CE) and Talmud (c.500 CE)',
    detail:
      'Rabbi Judah the Prince compiled the Mishnah around 200 CE — a comprehensive code of Jewish law organized into six orders covering agriculture, festivals, family law, civil law, Temple service, and ritual purity. The Mishnah became the basis for the Talmud — centuries of rabbinic discussion, debate, and commentary on the Mishnah. Two Talmuds were produced: the Jerusalem Talmud (c.400 CE) and the more authoritative Babylonian Talmud (c.500 CE). The Talmud is not a law code but a record of legal argument — minority opinions are preserved alongside majority rulings. This culture of debate and dissent became central to Jewish intellectual life.',
  },
  {
    label: 'The Diaspora: From Spain to Babylon to India',
    detail:
      'After the Bar Kokhba Revolt, Jewish communities spread across the known world — from Spain and North Africa to Mesopotamia, Persia, India, and eventually Eastern Europe. Despite geographic dispersion across thousands of miles and centuries, Jews maintained a remarkable cultural coherence through shared texts (Torah, Talmud), shared practices (Sabbath, dietary laws, prayer), shared language (Hebrew for prayer, local Jewish languages for daily life), and a shared longing for Jerusalem. No other people in history has maintained its identity through such prolonged dispersion without a homeland.',
  },
  {
    label: 'Golden Age in Islamic Spain (c.900–1100 CE)',
    detail:
      'Under Muslim rule in Al-Andalus (Spain), Jews experienced a cultural flowering unprecedented in the diaspora. Maimonides (1138–1204), perhaps the greatest Jewish thinker after Moses, produced the Mishneh Torah (a comprehensive code of Jewish law) and the Guide for the Perplexed (reconciling Aristotelian philosophy with Jewish theology). The poet Judah Halevi wrote some of the finest Hebrew poetry since the Psalms. Jewish scholars translated Greek philosophical and scientific texts from Arabic into Latin, helping transmit classical knowledge to medieval Europe. This "convivencia" (coexistence) was real but not without tensions — and it would not last.',
  },
  {
    label: 'Medieval Persecution: Crusades, Expulsions, Blood Libels',
    detail:
      'Medieval European Jews faced relentless persecution. The First Crusade (1096) brought massacres of Jewish communities in the Rhineland — entire communities chose mass suicide rather than forced conversion. Jews were expelled from England (1290), France (1306, 1394), and most devastatingly from Spain (1492 — the same year Columbus sailed, funded in part by confiscated Jewish wealth). The "blood libel" — the false accusation that Jews murdered Christian children to use their blood in rituals — led to pogroms across Europe for centuries. Jews were confined to ghettos, barred from most professions, forced to wear identifying badges, and made perpetual scapegoats for plague, famine, and social unrest.',
  },
  {
    label: 'Ashkenazi and Sephardic Jews: Two Great Traditions',
    detail:
      'The Jewish diaspora produced two major cultural streams. Ashkenazi Jews, centered in France, Germany, and Eastern Europe, developed Yiddish (a Germanic language written in Hebrew script), distinctive liturgical traditions, and a culture that produced the great yeshivot (academies) of Lithuania and Poland. Sephardic Jews, originating in Spain and Portugal, developed Ladino (a Romance language), their own liturgical and legal traditions, and spread across the Ottoman Empire, North Africa, and the Americas after 1492. While sharing the same Torah, Talmud, and fundamental beliefs, the two traditions developed distinct customs, pronunciations, music, and cuisine — a testament to Judaism\'s ability to adapt while preserving its core.',
  },
];

// ── Modern Jewish History ───────────────────────────────────────────────────

const MODERN_TIMELINE: TimelineEntry[] = [
  {
    year: '1700s–1800s',
    title: 'Haskalah: The Jewish Enlightenment',
    description:
      'Moses Mendelssohn (1729–1786), the "father of the Haskalah," argued that Jews could embrace European culture and Enlightenment values while remaining faithful to Judaism. He translated the Torah into German (in Hebrew script) and advocated for Jewish civil rights. The Haskalah transformed Jewish life: it produced Reform Judaism (adapting practice to modernity), Hasidism\'s mystical counter-movement (founded by the Baal Shem Tov), and eventually secular Jewish identity. The question the Haskalah posed — how to be both Jewish and modern — remains the central question of Jewish life today.',
    color: INDIGO,
  },
  {
    year: '1896',
    title: 'Theodor Herzl and Political Zionism',
    description:
      'Theodor Herzl, a Viennese journalist covering the Dreyfus Affair in Paris (where a Jewish French army officer was falsely convicted of treason amid virulent antisemitism), concluded that Jews would never be safe in Europe and needed their own state. His pamphlet Der Judenstaat ("The Jewish State," 1896) and the First Zionist Congress in Basel (1897) launched the political Zionist movement. Herzl wrote in his diary after Basel: "At Basel I founded the Jewish State. If I said this out loud today, I would be greeted by universal laughter. In five years perhaps, and certainly in fifty years, everyone will perceive it." Israel was established 51 years later.',
    color: STAR_BLUE,
  },
  {
    year: '1880–1924',
    title: 'The Great Migration: 2 Million Jews Flee to the Americas',
    description:
      'Between 1880 and 1924, approximately 2 million Jews fled Eastern Europe — driven by poverty, pogroms (organized massacres, especially after 1881 in the Russian Empire), and conscription into the Tsar\'s army for 25-year terms. Most went to America. They arrived at Ellis Island with almost nothing and settled in tenement neighborhoods like New York\'s Lower East Side. Within a generation, they had built a vibrant culture of Yiddish theater, labor unions, intellectual life, and upward mobility that would transform American culture. The 1924 Immigration Act severely restricted further immigration — a decision with devastating consequences when European Jews desperately needed refuge in the 1930s.',
    color: TEAL,
  },
  {
    year: '1933–1945',
    title: 'The Holocaust: 6 Million Murdered',
    description:
      'The Nazis murdered approximately 6 million Jews — one-third of all Jews alive in 1939. The Holocaust (Shoah) was not a pogrom or a massacre but an industrialized genocide: systematic identification, registration, ghettoization, deportation, and murder, carried out with bureaucratic precision across an entire continent. Auschwitz, Treblinka, Sobibor, Majdanek, Belzec, Chelmno — the names of the death camps are seared into Jewish memory. Entire communities that had existed for centuries were annihilated. The rich Yiddish-speaking civilization of Eastern Europe — its scholars, poets, musicians, rabbis, and ordinary families — was destroyed almost completely. The world that produced Sholem Aleichem and Marc Chagall ceased to exist.',
    color: CRIMSON,
  },
  {
    year: '1948',
    title: 'The Creation of Israel: "Never Again"',
    description:
      'On May 14, 1948, David Ben-Gurion proclaimed the State of Israel — the first Jewish sovereign state in nearly 1,900 years. "Never Again" became the founding principle: Jews would have a homeland where they could defend themselves. The Arab-Israeli War of 1948 began immediately, as five Arab armies invaded the new state. Israel survived, but the war produced roughly 700,000 Palestinian refugees (the Nakba, or "catastrophe," in Palestinian memory) — creating an Israeli-Palestinian conflict that remains unresolved. The establishment of Israel fulfilled the Zionist dream but opened new questions about Jewish identity, the meaning of diaspora, and the relationship between Judaism and political power.',
    color: STAR_BLUE,
  },
  {
    year: '1948–Present',
    title: 'American Jewish Experience',
    description:
      'The United States became home to the largest Jewish diaspora community in history — approximately 6 million, roughly equal to Israel\'s Jewish population. American Judaism developed three major denominations: Reform (emphasizing ethical monotheism and adaptation to modernity), Conservative (seeking a middle path between tradition and change), and Orthodox (maintaining strict adherence to halakha, Jewish law). American Jews became disproportionately influential in academia, law, medicine, entertainment, finance, literature, and politics — a remarkable trajectory for a community that arrived largely impoverished just decades earlier. The American Jewish experience raised its own questions: could Jewish identity survive in a society that welcomed rather than persecuted Jews?',
    color: GREEN,
  },
];

// ── Key Texts ───────────────────────────────────────────────────────────────

const KEY_TEXTS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Torah (The Five Books of Moses)',
    detail:
      'The Torah — Genesis, Exodus, Leviticus, Numbers, and Deuteronomy — is the foundational text of Judaism. Orthodox Jews believe it was dictated by God to Moses at Sinai; critical scholars see it as a composite of multiple sources compiled over centuries. Either way, it is the most influential text in Western history: it established monotheism, codified ethical law, and told the stories — Creation, the Flood, the Exodus, the giving of the Law — that shaped the moral imagination of three civilizations. The Torah scroll, handwritten on parchment by a trained scribe, is the most sacred object in a synagogue.',
  },
  {
    label: 'Talmud: The Sea of Learning',
    detail:
      'The Talmud (primarily the Babylonian Talmud, compiled c.500 CE) is the central text of rabbinic Judaism — 2,711 folio pages of legal discussion, ethical debate, biblical interpretation, folklore, medicine, astronomy, and story. It records centuries of rabbinic conversation: one rabbi argues one position, another disagrees, a third qualifies, a fourth raises an objection. Minority opinions are preserved alongside majority rulings. This format — argument as a form of worship, dissent as sacred — created a culture of intellectual inquiry that profoundly influenced Jewish civilization and, through it, Western intellectual traditions.',
  },
  {
    label: 'Midrash: Creative Biblical Interpretation',
    detail:
      'Midrash (from the Hebrew root meaning "to seek" or "to investigate") is a vast body of rabbinic literature that creatively interprets and expands on the biblical text. Where the Torah is terse, midrash fills in the gaps: What was Abraham\'s childhood like? What happened during Moses\'s years in Midian? Why did God choose Israel? Midrash is theology through storytelling — playful, imaginative, sometimes contradictory, always probing the text for deeper meaning. The midrashic method influenced Christian biblical interpretation and modern literary theory alike.',
  },
  {
    label: 'Kabbalah: Jewish Mysticism',
    detail:
      'Kabbalah (meaning "received tradition") is the mystical dimension of Judaism, reaching its fullest expression in the Zohar (13th century, attributed to Moses de Leon of Spain). Kabbalistic thought envisions God as the Ein Sof (the Infinite) who emanates through ten sefirot (divine attributes) to create and sustain the world. Human actions — especially the performance of mitzvot — can repair cosmic fractures (tikkun olam, "repairing the world"). Kabbalah influenced Jewish liturgy, Hasidic thought, and even secular thinkers. Its most famous modern popularizer was the 16th-century rabbi Isaac Luria of Safed.',
  },
  {
    label: 'Maimonides: The Guide for the Perplexed',
    detail:
      'Moses ben Maimon (Maimonides, 1138–1204) was the greatest Jewish philosopher of the Middle Ages — and one of the greatest of any tradition. His Mishneh Torah was the first systematic codification of all Jewish law. His Guide for the Perplexed (written in Arabic) attempted to reconcile Aristotelian philosophy with biblical revelation, arguing that reason and faith need not conflict. His Thirteen Principles of Faith became a standard formulation of Jewish belief. The saying "From Moses to Moses, there was none like Moses" captures his stature: he was considered second only to the biblical Moses himself.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Abraham',
    years: 'c.2000–1800 BCE (traditional)',
    contribution:
      'The first patriarch — made the founding covenant with God establishing monotheism. Father of Isaac (ancestor of the Jews) and Ishmael (ancestor of the Arabs). His willingness to leave his homeland and follow God\'s call established the model of faith that defines Judaism.',
  },
  {
    name: 'Moses',
    years: 'c.1300–1200 BCE (traditional)',
    contribution:
      'Liberator, lawgiver, prophet — the most important figure in Judaism. Led the Exodus from Egypt, received the Torah at Sinai, guided Israel through 40 years in the wilderness. Jewish tradition calls him Moshe Rabbeinu ("Moses our teacher"). No other prophet, the Torah states, spoke with God "face to face."',
  },
  {
    name: 'King David',
    years: 'c.1040–970 BCE',
    contribution:
      'United the tribes of Israel, conquered Jerusalem, established it as the eternal capital. Author of Psalms (traditional attribution). Founder of a royal dynasty from which the Messiah is expected to descend. His flaws — Bathsheba, Uriah — made him a deeply human figure and a model of repentance.',
  },
  {
    name: 'King Solomon',
    years: 'c.970–931 BCE',
    contribution:
      'Builder of the First Temple in Jerusalem — the central act of ancient Israelite religion. Famous for wisdom (the Judgment of Solomon), wealth, and diplomatic marriages. Traditional author of Proverbs, Ecclesiastes, and Song of Songs. His kingdom\'s division after his death shaped the rest of biblical history.',
  },
  {
    name: 'Ezra the Scribe',
    years: 'c.480–440 BCE',
    contribution:
      'Led the return from Babylonian exile and publicly read the Torah to the assembled people. Considered the "second Moses" for his role in establishing Torah as the central text of Jewish life. His insistence on Torah literacy created Judaism\'s distinctive emphasis on education and textual study.',
  },
  {
    name: 'Hillel the Elder',
    years: 'c.110 BCE–10 CE',
    contribution:
      'The most influential rabbi of the Second Temple period. When asked to summarize the Torah while standing on one foot, he replied: "What is hateful to you, do not do to your neighbor. That is the whole Torah; the rest is commentary — go and learn." His school of interpretation (Beit Hillel) generally prevailed over the stricter Beit Shammai.',
  },
  {
    name: 'Rabbi Akiva',
    years: 'c.50–135 CE',
    contribution:
      'One of the greatest Talmudic sages — an illiterate shepherd who began studying Torah at age 40 and became the leading scholar of his generation. Supported the Bar Kokhba Revolt and proclaimed Bar Kokhba the Messiah. Executed by the Romans; according to tradition, he died reciting the Shema with a smile, affirming his love of God to the last breath.',
  },
  {
    name: 'Rashi (Rabbi Shlomo Yitzchaki)',
    years: '1040–1105',
    contribution:
      'The preeminent commentator on the Torah and Talmud, writing from Troyes, France. His commentaries — clear, concise, and drawing on both plain meaning and midrash — became standard references. No Talmud page is printed without Rashi\'s commentary in the margin. He made the vast corpus of Jewish learning accessible to ordinary students.',
  },
  {
    name: 'Maimonides (Moses ben Maimon)',
    years: '1138–1204',
    contribution:
      'Philosopher, legal codifier, physician — born in Córdoba, Spain, fled Almohad persecution, settled in Egypt as physician to the Sultan. His Mishneh Torah systematized all Jewish law; his Guide for the Perplexed reconciled Aristotelian philosophy with Judaism. His Thirteen Principles of Faith became a standard creed. "From Moses to Moses, there was none like Moses."',
  },
  {
    name: 'Baal Shem Tov (Rabbi Israel ben Eliezer)',
    years: 'c.1698–1760',
    contribution:
      'Founder of Hasidic Judaism, a movement emphasizing joyous worship, direct experience of God, and the spiritual potential of ordinary people. Born in poverty in Ukraine, he taught that God could be served through joy, song, dance, and everyday actions — not just through Talmudic scholarship. Hasidism revitalized Judaism for the common Jew and remains a vital force today.',
  },
  {
    name: 'Moses Mendelssohn',
    years: '1729–1786',
    contribution:
      'The "father of the Haskalah" (Jewish Enlightenment). A hunchbacked, self-educated philosopher from Dessau who became one of the leading intellectuals in Berlin. His translation of the Torah into German and his advocacy for Jewish civil rights began the process of Jewish integration into European culture. He argued Jews could be loyal citizens while maintaining their faith.',
  },
  {
    name: 'Theodor Herzl',
    years: '1860–1904',
    contribution:
      'Founder of political Zionism. An assimilated Viennese journalist shocked by the antisemitism of the Dreyfus Affair, he wrote Der Judenstaat (1896) and organized the First Zionist Congress (1897). He predicted a Jewish state within 50 years — Israel was established 51 years later. Died at 44, exhausted by his campaign. Buried on Mount Herzl in Jerusalem.',
  },
  {
    name: 'David Ben-Gurion',
    years: '1886–1973',
    contribution:
      'Israel\'s founding father and first Prime Minister. A Polish-born Labor Zionist who immigrated to Ottoman Palestine in 1906. He proclaimed the State of Israel on May 14, 1948, and led the country through the War of Independence and its formative years. Shaped Israel\'s democratic institutions, absorbed millions of immigrants, and built a nation from scratch.',
  },
  {
    name: 'Henrietta Szold',
    years: '1860–1945',
    contribution:
      'Founder of Hadassah (the Women\'s Zionist Organization of America) and a pioneering figure in both American Judaism and the Yishuv (pre-state Israel). She organized Youth Aliyah, which rescued thousands of Jewish children from Nazi Europe. One of the most important women in modern Jewish history, she combined American organizational genius with Zionist idealism.',
  },
  {
    name: 'Elie Wiesel',
    years: '1928–2016',
    contribution:
      'Holocaust survivor, Nobel Peace Prize laureate (1986), and the world\'s most prominent witness to the Shoah. His memoir Night — a searing account of his experience at Auschwitz and Buchenwald as a teenager — became the definitive literary testimony of the Holocaust. He spent his life bearing witness: "For the dead and the living, we must bear witness." His work ensured that the world could not forget.',
  },
];

// ── Judaism's Contributions ─────────────────────────────────────────────────

const CONTRIBUTIONS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Monotheism: The Idea That Changed Everything',
    detail:
      'Judaism\'s most consequential contribution to human civilization was the concept of ethical monotheism — one God who is not capricious but moral, who demands not just worship but justice. This idea was "exported" to Christianity and Islam, which together account for over 3.8 billion people today. The Ten Commandments became the foundation of Western moral and legal systems. Without Judaism\'s radical insistence on one God with moral demands, the entire trajectory of Western civilization — and much of world history — would be unrecognizably different.',
  },
  {
    label: 'Legal Tradition and the Rule of Law',
    detail:
      'The Torah was the ancient world\'s first comprehensive legal code applied equally to all members of society — king and commoner alike. The biblical command "Justice, justice shall you pursue" (Deuteronomy 16:20) established law as a divine imperative. Talmudic legal reasoning — with its emphasis on precedent, argument, minority opinions, and the rights of the accused — influenced the development of Western legal traditions. The concept that even a king is subject to law (as the prophet Nathan rebuked King David) was revolutionary in the ancient world.',
  },
  {
    label: 'Emphasis on Literacy and Education',
    detail:
      'Judaism\'s transformation into a text-centered religion after the Temple\'s destruction created history\'s first culture of universal male literacy. By the first century CE, Jewish communities had established schools for children — more than a millennium before universal education became common in Europe. The Talmudic culture of questioning, debate, and intellectual rigor became embedded in Jewish life. This emphasis on education is often cited as a factor in the disproportionate Jewish contribution to science, literature, law, medicine, and the arts — including roughly 20% of Nobel Prize winners despite being 0.2% of the world\'s population.',
  },
  {
    label: 'Prophetic Ethics and Social Justice',
    detail:
      'The Hebrew prophets — Isaiah, Amos, Micah, Jeremiah — articulated a vision of social justice that reverberates through history. "Let justice roll down like waters, and righteousness like an ever-flowing stream" (Amos 5:24). The prophetic tradition insisted that ritual without ethics was worthless: God wanted justice for the poor, the widow, the orphan, and the stranger — not empty sacrifices. This prophetic ethic of social justice influenced Christianity, Islam, the abolitionist movement, the civil rights movement (Martin Luther King Jr. quoted the prophets extensively), and secular human rights discourse.',
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

const FIGURE_COLORS = [MENORAH_GOLD, ROYAL_BLUE, CRIMSON, TEAL, GREEN, INDIGO, AMBER, ROSE, PURPLE, SAND, STAR_BLUE, OLIVE, GOLD, STEEL, DESERT];

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

export default function JudaismHistoryPage() {
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
              background: `linear-gradient(135deg, ${MENORAH_GOLD}, ${STAR_BLUE})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Judaism — The World's Oldest Monotheistic Religion and 4,000 Years of Survival (c.2000 BCE–Present)
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
              The smallest of the major world religions — roughly 15 million
              adherents, barely 0.2% of humanity — yet disproportionately
              influential on human civilization. Judaism gave the world
              monotheism, the Ten Commandments, the concept of a weekly day of
              rest, prophetic ethics, and the foundational narratives that
              Christianity and Islam built upon. Its adherents have won roughly
              20% of all Nobel Prizes.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              This is the story of a people who lost their Temple — twice — were
              exiled from their homeland, scattered across the globe, survived
              two millennia of persecution culminating in the Holocaust, and
              somehow maintained their identity, their texts, and their faith
              through it all. No other civilization has a story quite like it.
            </p>
          </motion.div>
        </header>

        {/* ── The Patriarchs ─────────────────────────────────────────── */}
        <SectionWrapper
          id="patriarchs"
          icon="🕊️"
          title="The Patriarchs — Abraham, Isaac, Jacob (c.2000–1700 BCE)"
          accentColor={SAND}
          intro="Judaism begins not with a philosophy or a creed but with a family. Abraham, a man from Ur in Mesopotamia, heard a call from God: 'Go forth from your country, your birthplace, and your father's house to the land that I will show you.' He went. That act of faith — leaving everything familiar to follow a divine promise — became the founding story of the Jewish people."
        >
          <InsightGrid items={PATRIARCHS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Egypt and the Exodus ───────────────────────────────────── */}
        <SectionWrapper
          id="exodus"
          icon="🔥"
          title="Egypt and the Exodus (c.1300–1200 BCE)"
          accentColor={GOLD}
          intro="The Exodus from Egypt is the defining event of the Jewish narrative — not creation, not the patriarchs, but liberation from slavery. 'We were slaves in Egypt, and God brought us out with a mighty hand.' This story, retold at every Passover seder for over 3,000 years, shaped Judaism's core identity: a people forged in suffering, liberated by God, and bound by law."
        >
          <TimelineCard entries={EXODUS_TIMELINE} />
        </SectionWrapper>

        {/* ── The Kingdom Period ─────────────────────────────────────── */}
        <SectionWrapper
          id="kingdom"
          icon="👑"
          title="The Kingdom Period (c.1000–586 BCE)"
          accentColor={ROYAL_BLUE}
          intro="For roughly four centuries, the Israelites had kings, a capital, and a Temple — the institutional framework of a nation. This was the era of David and Solomon, of prophets thundering against injustice, of a kingdom that split in two and was ultimately destroyed by the great empires of Mesopotamia. The Kingdom Period produced much of the Hebrew Bible and established Jerusalem as the eternal Jewish capital."
        >
          <TimelineCard entries={KINGDOM_TIMELINE} />
        </SectionWrapper>

        {/* ── Babylonian Exile and Return ─────────────────────────────── */}
        <SectionWrapper
          id="exile"
          icon="📜"
          title="Babylonian Exile and Return (586–516 BCE)"
          accentColor={DESERT}
          intro="The Babylonian Exile was a catastrophe that became a crucible. Stripped of their Temple, their land, and their political independence, the Jewish people reinvented their religion around the one thing they could carry: the Torah. This transformation — from a religion of place to a religion of text — is why Judaism survived when every other ancient Near Eastern religion perished."
        >
          <InsightGrid items={EXILE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Second Temple Period ────────────────────────────────────── */}
        <SectionWrapper
          id="second-temple"
          icon="🏛️"
          title="Second Temple Period (516 BCE–70 CE)"
          accentColor={INDIGO}
          intro="The Second Temple period spans nearly 600 years — from the modest rebuilt Temple under Persian rule to its magnificent expansion under Herod to its catastrophic destruction by Rome. This era produced the Maccabees, the Dead Sea Scrolls, the Jewish sects that Jesus knew, and the single most consequential event in post-biblical Jewish history: the destruction of the Temple in 70 CE."
        >
          <TimelineCard entries={SECOND_TEMPLE_TIMELINE} />
        </SectionWrapper>

        {/* ── Rabbinic Judaism ───────────────────────────────────────── */}
        <SectionWrapper
          id="rabbinic"
          icon="📖"
          title="Rabbinic Judaism (70 CE–1800s)"
          accentColor={AMBER}
          intro="The destruction of the Second Temple could have been the end. Instead, it was a beginning. The rabbis who reinvented Judaism after 70 CE created a religion that could survive anywhere — a portable civilization carried in books, sustained by law, and transmitted through study. For nearly 1,800 years, this rabbinic framework sustained Jewish life across four continents, through golden ages and genocides alike."
        >
          <InsightGrid items={RABBINIC_INSIGHTS} />
        </SectionWrapper>

        {/* ── Modern Jewish History ──────────────────────────────────── */}
        <SectionWrapper
          id="modern"
          icon="✡️"
          title="Modern Jewish History — Enlightenment to Israel"
          accentColor={STAR_BLUE}
          intro="The modern era shattered and remade Jewish life. The Enlightenment opened European society to Jews for the first time — and posed the question of whether Jewish identity could survive assimilation. Pogroms drove millions to the Americas. Zionism envisioned a Jewish state. The Holocaust destroyed one-third of all Jews alive. And in 1948, after nearly two millennia, Jews again had sovereignty in their ancestral homeland."
        >
          <TimelineCard entries={MODERN_TIMELINE} />
        </SectionWrapper>

        {/* ── Key Texts ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="texts"
          icon="📚"
          title="Key Texts of Judaism"
          accentColor={PARCHMENT}
          intro="Judaism is, above all, a religion of the book — or rather, of books. The Jewish textual tradition is vast, spanning millennia, and it operates on a distinctive principle: every text generates commentary, every commentary generates further commentary, and disagreement is not merely tolerated but sacred. These are the texts that shaped and sustained Jewish civilization."
        >
          <InsightGrid items={KEY_TEXTS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures in Jewish History"
          accentColor={MENORAH_GOLD}
          intro="From Abraham's covenant to Elie Wiesel's testimony, Jewish history is shaped by individuals who wrestled with God, with empires, with texts, and with the meaning of survival. These figures span four millennia and represent the full range of Jewish experience — patriarchs, prophets, rabbis, philosophers, revolutionaries, and witnesses."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Judaism's Contributions ─────────────────────────────────── */}
        <SectionWrapper
          id="contributions"
          icon="🌍"
          title="Judaism's Contributions to Civilization"
          accentColor={TEAL}
          intro="A people numbering barely 15 million — less than the population of metropolitan Cairo — produced ideas that shaped billions of lives. Judaism's contributions to human civilization are not merely historical curiosities; they are the active foundation of the moral, legal, and intellectual frameworks that the modern world takes for granted."
        >
          <InsightGrid items={CONTRIBUTIONS_INSIGHTS} />
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
            "If I forget thee, O Jerusalem, let my right hand forget her cunning."
            — Psalm 137:5
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
