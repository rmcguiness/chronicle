/**
 * CrusadesPage — comprehensive deep-dive on the Crusades (1095–1291).
 *
 * Route: /crusades
 *
 * Sections:
 *  1. Hero — headline, context
 *  2. Why the Crusades happened
 *  3. Nine Crusades overview timeline
 *  4. First Crusade (1096–1099)
 *  5. Second Crusade (1147–1149)
 *  6. Third Crusade (1189–1192) — Richard vs Saladin
 *  7. Fourth Crusade (1202–1204)
 *  8. Children's Crusade (1212)
 *  9. Fifth through Ninth Crusades
 * 10. Saladin profile
 * 11. The Military Orders
 * 12. Impact on Jewish communities
 * 13. Legacy & contested memory
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#3b82f6';
const GOLD = '#f59e0b';
const RED = '#ef4444';
const GREEN = '#22c55e';
const PURPLE = '#a855f7';
const TEAL = '#14b8a6';
const ROSE = '#f43f5e';
const INDIGO = '#6366f1';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  color: string;
}

interface FigureEntry {
  name: string;
  years: string;
  contribution: string;
}

interface InsightEntry {
  label: string;
  detail: string;
}

// ── Why the Crusades Happened ───────────────────────────────────────────────

const CONTEXT_ENTRIES: TimelineEntry[] = [
  {
    year: '1071',
    title: 'Battle of Manzikert \u2014 The Byzantine Disaster',
    description:
      'The Seljuk Turks crushed the Byzantine army at Manzikert in eastern Anatolia, capturing Emperor Romanos IV. This catastrophic defeat opened Asia Minor \u2014 the heartland of the Byzantine Empire \u2014 to Turkish settlement. Within a decade, the Byzantines lost most of Anatolia, their primary source of soldiers and grain. Emperor Alexios I Komnenos would desperately appeal to Western Christendom for military aid, setting the stage for the First Crusade.',
    color: RED,
  },
  {
    year: '1095',
    title: 'Pope Urban II at Clermont \u2014 "Deus Vult!"',
    description:
      'At the Council of Clermont in November 1095, Pope Urban II delivered one of history\'s most consequential speeches. He called on Christian knights to march east, liberate Jerusalem from Muslim control, and aid the beleaguered Byzantine Empire. He promised full remission of sins for anyone who took the cross \u2014 a spiritual reward equivalent to a lifetime of penance. The crowd reportedly erupted with the cry "Deus Vult!" (God wills it!). Within months, tens of thousands were on the march.',
    color: GOLD,
  },
  {
    year: 'Context',
    title: 'Jerusalem \u2014 Sacred to Three Faiths',
    description:
      'Jerusalem held profound significance for Christians (site of Christ\'s crucifixion and resurrection, the Holy Sepulchre), Muslims (al-Aqsa Mosque, the Prophet Muhammad\'s Night Journey), and Jews (Temple Mount, the Western Wall). The city had been under Muslim control since 638 CE, and Christian pilgrimage had generally been permitted. But the Seljuk Turk conquests disrupted pilgrim routes and provided the pretext Urban needed.',
    color: ACCENT,
  },
  {
    year: 'Context',
    title: 'Political Motivations Behind Holy War',
    description:
      'The Crusades were never purely religious. Pope Urban II saw an opportunity to assert papal authority over secular kings and potentially reunify the Eastern and Western churches. European nobility \u2014 especially younger sons who stood to inherit nothing \u2014 saw a chance to carve out new lands and lordships. Italian maritime republics (Venice, Genoa, Pisa) saw lucrative trade routes to the East. Peasants saw adventure and escape from feudal drudgery. The Crusades were a convergence of genuine piety, cynical politics, and economic opportunity.',
    color: PURPLE,
  },
];

// ── Nine Crusades Overview ──────────────────────────────────────────────────

const CRUSADES_OVERVIEW: TimelineEntry[] = [
  {
    year: '1096\u20131099',
    title: 'First Crusade \u2014 The Only "Successful" Crusade',
    description:
      'The only Crusade to achieve its primary military objective. Crusaders captured Antioch, then Jerusalem. Four Crusader States were established in the Levant. The siege and fall of Jerusalem was accompanied by a horrific massacre.',
    color: GREEN,
  },
  {
    year: '1147\u20131149',
    title: 'Second Crusade \u2014 Royal Catastrophe',
    description:
      'Triggered by the fall of Edessa (1144). Led by King Louis VII of France and Emperor Conrad III of Germany. Ended in a humiliating defeat at Damascus. The first major Crusade to completely fail.',
    color: RED,
  },
  {
    year: '1189\u20131192',
    title: 'Third Crusade \u2014 Richard vs Saladin',
    description:
      'The most famous Crusade. Richard I "Lionheart" of England, Philip II of France, and Frederick Barbarossa of Germany responded to Saladin\'s capture of Jerusalem. Ended in a negotiated treaty, not a decisive victory.',
    color: GOLD,
  },
  {
    year: '1202\u20131204',
    title: 'Fourth Crusade \u2014 The Shameful Detour',
    description:
      'Intended for Egypt, the Crusaders were diverted to Constantinople and sacked the greatest Christian city in the world. Fatally weakened the Byzantine Empire and deepened the Catholic-Orthodox schism permanently.',
    color: ROSE,
  },
  {
    year: '1217\u20131221',
    title: 'Fifth Crusade \u2014 Egypt Campaign',
    description:
      'Targeted Egypt as the key to controlling Jerusalem. Crusaders captured the port city of Damietta but overreached by marching on Cairo and were trapped by Nile floods. Forced to surrender Damietta and retreat.',
    color: TEAL,
  },
  {
    year: '1228\u20131229',
    title: 'Sixth Crusade \u2014 Frederick II\'s Diplomacy',
    description:
      'The excommunicated Emperor Frederick II achieved through diplomacy what armies could not: he negotiated a ten-year treaty with Sultan al-Kamil that returned Jerusalem, Bethlehem, and Nazareth to Christian control \u2014 without a single battle. The Pope was furious.',
    color: INDIGO,
  },
  {
    year: '1248\u20131254',
    title: 'Seventh Crusade \u2014 Louis IX\'s First Disaster',
    description:
      'King Louis IX of France invaded Egypt, captured Damietta again, then marched on Cairo. His entire army was defeated and captured, including Louis himself. He was ransomed for an enormous sum.',
    color: RED,
  },
  {
    year: '1270',
    title: 'Eighth Crusade \u2014 Louis IX Dies in Tunisia',
    description:
      'Louis IX launched another Crusade, this time targeting Tunis. Disease ravaged the army before any fighting occurred. Louis himself died of dysentery outside Tunis. He was later canonized as a saint.',
    color: PURPLE,
  },
  {
    year: '1271\u20131272',
    title: 'Ninth Crusade \u2014 The Last Crusade',
    description:
      'Prince Edward of England (future Edward I) led a small expedition to Acre but achieved little. The final Crusader stronghold, Acre, fell to the Mamluks in 1291, ending two centuries of Crusader presence in the Holy Land.',
    color: ACCENT,
  },
];

// ── First Crusade ───────────────────────────────────────────────────────────

const FIRST_CRUSADE: TimelineEntry[] = [
  {
    year: '1096',
    title: 'The People\'s Crusade \u2014 Peter the Hermit\'s Peasant Disaster',
    description:
      'Before the organized military expedition could depart, a charismatic preacher named Peter the Hermit led a ragtag army of peasants, poor knights, and religious zealots eastward. Undisciplined and poorly equipped, they looted their way across Hungary and the Balkans. The Byzantine emperor rushed them across the Bosporus to get them away from Constantinople. In Anatolia, the Seljuk Turks annihilated them almost to the last man. Only a fraction survived to join the main Crusader force.',
    color: RED,
  },
  {
    year: '1097\u20131098',
    title: 'Siege of Antioch \u2014 Eight Months of Hell',
    description:
      'The main Crusader army \u2014 roughly 35,000 strong, led by nobles like Godfrey of Bouillon, Bohemond of Taranto, and Raymond of Toulouse \u2014 besieged the massive, heavily fortified city of Antioch for eight brutal months. Starvation was so severe that some Crusaders reportedly resorted to cannibalism. The city finally fell through treachery when a tower guard was bribed to open a gate. Days later, a massive Muslim relief army arrived, and the Crusaders found themselves besieged inside the city they had just taken.',
    color: GOLD,
  },
  {
    year: '1098',
    title: 'The Holy Lance \u2014 Faith and Fraud',
    description:
      'Trapped inside Antioch with no supplies, the Crusaders were on the brink of collapse. Then a poor peasant named Peter Bartholomew claimed a vision had revealed the Holy Lance (the spear that pierced Christ\'s side) buried beneath a church. They dug and "found" a lance. Skeptics suspected fraud, but the morale boost was decisive. The Crusaders charged out and routed the besieging army in a battle that seemed miraculous. Whether genuine relic or planted deception, the Holy Lance saved the Crusade.',
    color: PURPLE,
  },
  {
    year: 'July 15, 1099',
    title: 'Fall of Jerusalem \u2014 The Massacre',
    description:
      'After a grueling march down the coast, the Crusaders reached Jerusalem and besieged it for five weeks. On July 15, 1099, they breached the walls. What followed was one of the most notorious massacres in medieval history. The Crusaders killed the Muslim and Jewish inhabitants indiscriminately \u2014 men, women, and children. Sources estimate between 10,000 and 70,000 were killed. Chronicles describe blood running ankle-deep in the streets. The al-Aqsa Mosque was turned into a slaughterhouse. Jewish residents were herded into their synagogue, which was set ablaze. This atrocity would echo through centuries of Muslim memory.',
    color: RED,
  },
  {
    year: '1099\u20131100',
    title: 'The Crusader States \u2014 A Latin East',
    description:
      'Victory at Jerusalem led to the establishment of four Crusader States: the Kingdom of Jerusalem (the most important, governed by Godfrey of Bouillon who refused the title "King" in the city where Christ wore a crown of thorns), the County of Edessa (the first to fall, in 1144), the Principality of Antioch (held by Bohemond\'s dynasty), and the County of Tripoli. These fragile European colonies in the Middle East would survive for nearly two centuries, dependent on reinforcements from Europe and constantly threatened by surrounding Muslim powers.',
    color: GREEN,
  },
];

// ── Second Crusade ──────────────────────────────────────────────────────────

const SECOND_CRUSADE: TimelineEntry[] = [
  {
    year: '1144',
    title: 'Fall of Edessa \u2014 The Wake-Up Call',
    description:
      'Zengi, the atabeg of Mosul and Aleppo, captured the County of Edessa \u2014 the first Crusader State to fall. The news shocked Europe. Pope Eugenius III issued a papal bull calling for a new Crusade, and the great Cistercian abbot Bernard of Clairvaux preached it with electrifying passion across France and Germany.',
    color: RED,
  },
  {
    year: '1147\u20131148',
    title: 'Kings March East \u2014 And Accomplish Nothing',
    description:
      'For the first time, reigning European monarchs led a Crusade: King Louis VII of France and Emperor Conrad III of Germany. Conrad\'s army was shattered by the Seljuks at the Battle of Dorylaeum. Louis\'s army was mauled crossing Anatolia. The survivors reached the Holy Land diminished and demoralized.',
    color: GOLD,
  },
  {
    year: '1148',
    title: 'Disaster at Damascus \u2014 Strategic Lunacy',
    description:
      'Instead of trying to recapture Edessa (the stated goal), the Crusader leaders decided to attack Damascus \u2014 which was actually allied with the Kingdom of Jerusalem against Zengi\'s successors. The siege lasted four days before the Crusaders retreated in humiliation. They had attacked the wrong city and turned a potential ally into an enemy. The Second Crusade achieved absolutely nothing and damaged European credibility in the East.',
    color: RED,
  },
];

// ── Third Crusade ───────────────────────────────────────────────────────────

const THIRD_CRUSADE: TimelineEntry[] = [
  {
    year: '1187',
    title: 'Battle of Hattin \u2014 Saladin Destroys the Crusader Army',
    description:
      'Saladin lured the main Crusader field army into the waterless desert near the Horns of Hattin in Galilee. Exhausted and dehydrated, the Crusaders were surrounded and annihilated. King Guy of Jerusalem was captured. The True Cross relic was lost. Within months, Saladin swept through the Crusader States, capturing city after city.',
    color: RED,
  },
  {
    year: '1187',
    title: 'Saladin Recaptures Jerusalem \u2014 A Stark Contrast',
    description:
      'When Saladin took Jerusalem in October 1187, he offered terms that stood in stark contrast to the 1099 massacre. There was no general slaughter. Christians were allowed to ransom themselves (and Saladin\'s brother paid the ransom for thousands who could not afford it). Churches were left intact. Saladin\'s chivalrous conduct became legendary in both the Islamic and Christian worlds, a rebuke to the Crusaders\' own behavior eighty-eight years earlier.',
    color: GREEN,
  },
  {
    year: '1189\u20131191',
    title: 'The Three Kings Set Out',
    description:
      'Three of Europe\'s most powerful rulers took the cross: Frederick Barbarossa of Germany, Philip II Augustus of France, and Richard I "Lionheart" of England. Barbarossa drowned crossing a river in Anatolia \u2014 his army largely disintegrated. Philip and Richard arrived by sea, quarreled constantly, and Philip eventually went home, leaving Richard to face Saladin alone.',
    color: GOLD,
  },
  {
    year: '1191',
    title: 'Battle of Arsuf \u2014 Richard\'s Tactical Masterpiece',
    description:
      'Richard I proved himself one of the greatest military commanders of the Middle Ages. At Arsuf, he maintained iron discipline over his marching column under constant harassment from Saladin\'s horse archers, then unleashed a devastating cavalry charge at precisely the right moment. It was Saladin\'s first significant defeat in the field and established Richard\'s fearsome military reputation.',
    color: ACCENT,
  },
  {
    year: '1191\u20131192',
    title: 'Richard vs Saladin \u2014 Mutual Respect Between Enemies',
    description:
      'The relationship between Richard and Saladin became legendary. When Richard fell ill, Saladin sent his personal physician and fresh fruit packed in snow. When Richard\'s horse was killed in battle, Saladin sent him two replacements \u2014 because a king should not fight on foot. They never met face to face, but communicated through intermediaries with extraordinary courtesy. Each recognized the other as a worthy opponent. Their chivalric rivalry became the defining image of the Third Crusade.',
    color: PURPLE,
  },
  {
    year: '1192',
    title: 'Treaty of Jaffa \u2014 Compromise, Not Victory',
    description:
      'Richard twice advanced within sight of Jerusalem but turned back, knowing he could not hold the city even if he took it. The Treaty of Jaffa gave Christians a coastal strip from Tyre to Jaffa, free access to Jerusalem for pilgrimage, but not possession of the city. It was a face-saving compromise. Richard headed home (where he would be captured and held for ransom in Germany). Saladin died the following year, having given away so much of his treasury that there was not enough to pay for his funeral.',
    color: TEAL,
  },
];

// ── Fourth Crusade ──────────────────────────────────────────────────────────

const FOURTH_CRUSADE: TimelineEntry[] = [
  {
    year: '1202',
    title: 'Venice\'s Bargain \u2014 The Crusade for Hire',
    description:
      'The Crusaders contracted Venice to build a fleet to transport them to Egypt. But far fewer Crusaders showed up than expected, and they could not pay the agreed price. The elderly, blind Doge Enrico Dandolo offered a deal: help Venice conquer the rebellious city of Zara (a Christian city!) to work off the debt. Pope Innocent III excommunicated the entire Crusade, but the expedition continued.',
    color: GOLD,
  },
  {
    year: '1203',
    title: 'The Byzantine Entanglement',
    description:
      'A Byzantine prince, Alexios Angelos, approached the Crusaders with a proposition: help him overthrow the usurper on the Byzantine throne, and he would pay off their debt to Venice, supply 10,000 soldiers for the Crusade, and reunify the Orthodox and Catholic churches. It was too good to be true \u2014 and it was. The Crusaders installed Alexios on the throne, but he could not deliver on his promises. Tensions escalated toward catastrophe.',
    color: PURPLE,
  },
  {
    year: 'April 1204',
    title: 'The Sack of Constantinople \u2014 Christianity\'s Shame',
    description:
      'When the puppet emperor was overthrown by a popular revolt, the Crusaders stormed Constantinople \u2014 the largest, richest Christian city in the world, a city they had set out to defend. The three-day sack was one of the most destructive in history. Crusaders looted churches, smashed sacred relics, stole the bronze horses of the Hippodrome (still displayed at St. Mark\'s in Venice), and destroyed irreplaceable manuscripts and artworks. Nuns were assaulted in convents. The Pope himself called it a "work of darkness." The Fourth Crusade never reached the Holy Land.',
    color: RED,
  },
  {
    year: '1204\u20131261',
    title: 'The Latin Empire \u2014 A Fatal Wound',
    description:
      'The Crusaders established a "Latin Empire" on the ruins of Byzantium. It lasted only 57 years before the Byzantines retook Constantinople in 1261, but the damage was permanent. The Byzantine Empire never recovered its former strength and would fall to the Ottoman Turks in 1453. The sack of 1204 made the Catholic-Orthodox schism irreparable \u2014 Orthodox Christians would never forgive or forget. When Constantinople finally fell to the Ottomans, some Byzantines reportedly said: "Better the Sultan\'s turban than the Cardinal\'s hat."',
    color: ROSE,
  },
];

// ── Children's Crusade ──────────────────────────────────────────────────────

const CHILDRENS_CRUSADE: TimelineEntry[] = [
  {
    year: '1212',
    title: 'The Children\'s Crusade \u2014 Innocence and Catastrophe',
    description:
      'In 1212, thousands of young people (some sources say children, others say poor young adults \u2014 the Latin word pueri could mean either) set out for the Holy Land, believing that God would part the seas for the innocent where he had denied victory to sinful adults. There were likely two separate movements: one in France led by a shepherd boy named Stephen of Cloyes, and one in Germany led by a boy named Nicholas of Cologne. Neither reached the Holy Land. Some turned back. Others reportedly reached Mediterranean ports where they were tricked onto ships and sold into slavery in North Africa. The Children\'s Crusade has become a symbol of the era\'s mixture of desperate faith and cynical exploitation.',
    color: INDIGO,
  },
];

// ── Later Crusades ──────────────────────────────────────────────────────────

const LATER_CRUSADES: TimelineEntry[] = [
  {
    year: '1217\u20131221',
    title: 'Fifth Crusade \u2014 The Nile Trap',
    description:
      'The Fifth Crusade correctly identified Egypt as the strategic key to the Holy Land. Crusaders captured the vital port of Damietta in 1219 after a long siege. Sultan al-Kamil offered to trade Jerusalem for Damietta \u2014 an extraordinary offer that the papal legate Pelagius rejected, insisting on total victory. The Crusaders marched toward Cairo but were trapped between branches of the flooding Nile and forced to surrender. They gave up Damietta and got nothing.',
    color: TEAL,
  },
  {
    year: '1228\u20131229',
    title: 'Frederick II \u2014 The Crusade Without a Battle',
    description:
      'Holy Roman Emperor Frederick II was the most remarkable figure of the later Crusades. Excommunicated by the Pope for delaying his Crusade, he finally went to the Holy Land and achieved what no army had managed since 1099: he got Jerusalem back. Through personal diplomacy with Sultan al-Kamil (the two men shared intellectual interests and corresponded in Arabic), he negotiated a ten-year treaty returning Jerusalem, Bethlehem, and Nazareth to Christian control. The Pope denounced the treaty. The Latin Patriarch of Jerusalem placed the city under interdict. Frederick crowned himself King of Jerusalem in an empty church. It was the strangest triumph of the Crusading era.',
    color: GOLD,
  },
  {
    year: '1248\u20131254',
    title: 'Louis IX\'s Egyptian Disaster',
    description:
      'King Louis IX of France, considered the model Christian king, launched an ambitious invasion of Egypt. He captured Damietta easily but then repeated the Fifth Crusade\'s mistake by marching on Cairo. At the Battle of al-Mansurah, his vanguard was destroyed (his brother Robert of Artois was killed), and the retreating army was ravaged by disease and Mamluk attacks. Louis himself was captured \u2014 the only French king ever taken prisoner on a Crusade. He was ransomed for 800,000 bezants and spent four years in the Holy Land strengthening fortifications before returning home.',
    color: RED,
  },
  {
    year: '1270\u20131272',
    title: 'The Last Crusades \u2014 And the End',
    description:
      'Louis IX launched one final Crusade in 1270, inexplicably targeting Tunis. Plague swept through the camp, and Louis died of dysentery (he was later canonized as Saint Louis). Prince Edward of England continued to Acre in what is sometimes called the Ninth Crusade (1271\u20131272), achieving little. The Crusader States slowly crumbled. Acre, the last major Crusader stronghold, fell to the Mamluks on May 18, 1291, ending 196 years of European presence in the Holy Land. The remaining fortresses were abandoned or destroyed.',
    color: PURPLE,
  },
];

// ── Saladin Profile ─────────────────────────────────────────────────────────

const SALADIN_ENTRIES: TimelineEntry[] = [
  {
    year: '1137/1138',
    title: 'Salah ad-Din \u2014 The Kurdish Boy Who Would Unite Islam',
    description:
      'Saladin (Salah ad-Din Yusuf ibn Ayyub) was born into a Kurdish military family in Tikrit (modern Iraq). He rose through the ranks serving the Syrian warlord Nur ad-Din, eventually becoming vizier of Egypt. Quietly and methodically, he consolidated power, overthrowing the Fatimid caliphate in Egypt and uniting Egypt and Syria under his personal rule for the first time in centuries. Unity was the precondition for challenging the Crusader States.',
    color: GOLD,
  },
  {
    year: '1187',
    title: 'The Reconquest of Jerusalem \u2014 Mercy, Not Massacre',
    description:
      'Saladin\'s reconquest of Jerusalem stands as one of the most celebrated acts of mercy in military history. Where the Crusaders of 1099 had massacred the city\'s inhabitants, Saladin offered generous terms: any Christian who could pay a ransom could leave freely with their possessions. His brother al-Adil asked for a thousand captives and freed them. Saladin himself freed many who could not pay. The Orthodox Christians, who had lived under Muslim rule for centuries, were allowed to remain. Churches were left intact (though the al-Aqsa Mosque was reconsecrated for Islamic worship).',
    color: GREEN,
  },
  {
    year: '1191\u20131192',
    title: 'Chivalry Across Enemy Lines',
    description:
      'Saladin\'s interactions with Richard I became legendary even in his lifetime. When Richard was ill with fever, Saladin sent his personal physician and peaches and snow from Mount Hermon. When Richard\'s horse was killed, Saladin sent two replacements. This was not mere propaganda \u2014 Saladin genuinely embodied the ideal of the noble warrior. Even his enemies acknowledged it. European troubadours wrote admiring songs about him, and he was eventually featured in Dante\'s Limbo alongside virtuous pagan heroes.',
    color: PURPLE,
  },
  {
    year: '1193',
    title: 'Death of Saladin \u2014 A Sultan Who Died Poor',
    description:
      'Saladin died in Damascus on March 4, 1193, at age 55 or 56. He had given away so much of his personal wealth to the poor and to charity that there was not enough in his treasury to pay for his funeral. He left behind no dynasty that could hold his empire together \u2014 it fragmented among his quarreling sons and brothers. But he left behind a legend that endures in both the Islamic and Western worlds: the image of a warrior who combined military brilliance with genuine compassion and generosity.',
    color: TEAL,
  },
];

// ── Military Orders ─────────────────────────────────────────────────────────

const MILITARY_ORDERS: TimelineEntry[] = [
  {
    year: 'c. 1119',
    title: 'The Knights Templar \u2014 Warrior Monks and Bankers',
    description:
      'The Poor Fellow-Soldiers of Christ and of the Temple of Solomon \u2014 the Knights Templar \u2014 were founded to protect pilgrims traveling to the Holy Land. They took monastic vows of poverty, chastity, and obedience, but also trained as elite warriors. Headquartered on the Temple Mount in Jerusalem, they became the most formidable fighting force in the Crusader States. They also invented early banking: pilgrims could deposit money in Europe and withdraw it in the Holy Land using letters of credit. Their white mantles with red crosses became the iconic image of the Crusades.',
    color: RED,
  },
  {
    year: 'c. 1099',
    title: 'The Knights Hospitaller \u2014 From Hospital to Battlefield',
    description:
      'The Order of St. John began as a hospital order, caring for sick and injured pilgrims in Jerusalem. After the First Crusade, they gradually took on a military role while maintaining their medical mission. They became the Templars\' great rivals, equally feared on the battlefield. When the Holy Land was lost, they retreated to Rhodes, then to Malta, where they held out against the Ottoman Empire for centuries. The Sovereign Military Order of Malta still exists today as a humanitarian organization with observer status at the United Nations.',
    color: ACCENT,
  },
  {
    year: 'c. 1190',
    title: 'The Teutonic Knights \u2014 From Acre to the Baltic',
    description:
      'The Teutonic Order was founded during the Siege of Acre in the Third Crusade. Primarily German, they combined military service with running hospitals. When the Crusader States collapsed, they relocated their crusading mission to the Baltic, waging a brutal campaign against pagan Prussians, Lithuanians, and Latvians. They carved out a monastic state in Prussia that lasted until the Reformation. Their black cross on white would later be adopted by the Prussian and German military tradition.',
    color: INDIGO,
  },
  {
    year: '1307\u20131312',
    title: 'The Fall of the Templars \u2014 Greed Disguised as Justice',
    description:
      'On Friday, October 13, 1307, King Philip IV of France arrested every Templar in his kingdom on charges of heresy, blasphemy, and sodomy. The charges were almost certainly fabricated \u2014 Philip owed the Templars enormous debts and coveted their wealth. Under torture, many confessed. Pope Clement V, pressured by Philip, dissolved the Order in 1312. The last Grand Master, Jacques de Molay, was burned at the stake in 1314. According to legend, from the flames he cursed both the Pope and the King \u2014 both died within a year. The Templar dissolution became the archetype of a powerful institution destroyed by a jealous state.',
    color: ROSE,
  },
];

// ── Impact on Jews ──────────────────────────────────────────────────────────

const JEWISH_IMPACT: TimelineEntry[] = [
  {
    year: '1096',
    title: 'Rhineland Massacres \u2014 The First Pogroms',
    description:
      'As the First Crusade gathered momentum, mobs of Crusaders asked a logical question: why travel thousands of miles to fight the enemies of Christ when "enemies of Christ" lived right next door? In the spring of 1096, crusading bands attacked Jewish communities throughout the Rhineland \u2014 Speyer, Worms, Mainz, Cologne, and other cities. Thousands of Jews were killed, many choosing mass suicide rather than forced conversion. The bishop of Worms tried to shelter Jews in his palace; the Crusaders broke in. These Rhineland massacres were the first large-scale anti-Jewish pogroms in European history and established a terrifying precedent that would echo through the centuries.',
    color: RED,
  },
  {
    year: '1099',
    title: 'Jerusalem \u2014 Jews Burned Alive in Their Synagogue',
    description:
      'When the Crusaders took Jerusalem, the Jewish community suffered alongside the Muslim inhabitants. According to multiple contemporary sources, the Crusaders herded Jewish residents into the main synagogue and set it ablaze. The Jewish community of Jerusalem \u2014 which had existed for millennia \u2014 was annihilated. It would not be reestablished under Crusader rule.',
    color: RED,
  },
  {
    year: '1190',
    title: 'York Massacre \u2014 Crusading Violence Comes to England',
    description:
      'The fervor of the Third Crusade triggered anti-Jewish violence across England. The worst incident occurred at York in March 1190, where the Jewish community took refuge in the royal castle (Clifford\'s Tower). Besieged by a mob, most of the Jewish men killed their families and then themselves rather than face forced conversion or murder. Those who surrendered were killed anyway. The rioters then went to York Minster and burned the records of debts owed to Jewish moneylenders \u2014 revealing the financial motives behind the religious violence.',
    color: ROSE,
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  { name: 'Pope Urban II', years: 'r. 1088\u20131099', contribution: 'Called the First Crusade at the Council of Clermont. Died two weeks after the fall of Jerusalem but before the news reached Europe.' },
  { name: 'Godfrey of Bouillon', years: 'c. 1060\u20131100', contribution: 'Leader of the First Crusade who became first ruler of Jerusalem. Refused the title "King" in the city where Christ wore a crown of thorns; styled himself "Advocate of the Holy Sepulchre."' },
  { name: 'Bohemond of Taranto', years: '1058\u20131111', contribution: 'Norman Italian adventurer who seized Antioch for himself during the First Crusade, founding the Principality of Antioch. A brilliant, ruthless opportunist.' },
  { name: 'Saladin', years: '1137\u20131193', contribution: 'Kurdish Muslim sultan who united Egypt and Syria, recaptured Jerusalem (1187) with mercy, and became a legend in both Islamic and Western traditions.' },
  { name: 'Richard I "Lionheart"', years: '1157\u20131199', contribution: 'King of England and supreme military commander of the Third Crusade. Brilliant tactician who could not retake Jerusalem but won enduring fame.' },
  { name: 'Frederick II', years: '1194\u20131250', contribution: 'Holy Roman Emperor who recovered Jerusalem through diplomacy, not war. Spoke Arabic, patronized science and philosophy. Called "Stupor Mundi" (Wonder of the World).' },
  { name: 'Louis IX (Saint Louis)', years: '1214\u20131270', contribution: 'King of France who led two Crusades, was captured in Egypt, and died of disease in Tunis. Canonized as the ideal of a Christian king.' },
  { name: 'Baibars', years: '1223\u20131277', contribution: 'Mamluk sultan who destroyed the remnants of Crusader power. A former slave who rose to rule Egypt and systematically dismantled the Crusader States.' },
  { name: 'Jacques de Molay', years: 'c. 1243\u20131314', contribution: 'Last Grand Master of the Knights Templar. Burned at the stake after the Order was destroyed by Philip IV of France. His curse on king and pope became legend.' },
];

// ── Legacy & Contested Memory ───────────────────────────────────────────────

const CONTESTED_MEMORY: InsightEntry[] = [
  { label: 'The Islamic Memory Gap', detail: 'For centuries, the Crusades were a relatively minor episode in Islamic historical memory \u2014 the Mongol invasions of the 1200s were far more traumatic. It was only in the 19th and 20th centuries, as European colonialism carved up the Middle East, that the Crusades were revived as a powerful narrative of Western aggression against Islam. This revival was largely a modern political construction, not a continuous memory.' },
  { label: 'The "Clash of Civilizations" Myth', detail: 'The popular notion that the Crusades represent an eternal Christian-Muslim conflict is historically misleading. Both sides frequently allied across religious lines when politically convenient. Crusader lords allied with Muslim emirs; Muslim factions invited Crusader help against rivals. The reality was far messier than a simple clash of civilizations.' },
  { label: 'Crusade as Political Language', detail: 'The word "crusade" has been repurposed endlessly: Eisenhower titled his WWII memoir "Crusade in Europe"; Bush used "crusade" after 9/11 (and was widely criticized); jihadist groups frame modern conflicts as a continuation of Crusader aggression. The Crusades have become a political Rorschach test, meaning whatever the speaker needs them to mean.' },
  { label: 'Religious vs Political Motivations', detail: 'Historians have debated for generations whether the Crusaders were primarily motivated by genuine religious devotion or by greed and ambition. Modern scholarship largely rejects this either/or framing: most Crusaders were genuinely pious AND hoped for material gain. The two motivations were not contradictory in medieval thinking \u2014 God rewarded the faithful.' },
];

const CRUSADE_LEGACY: InsightEntry[] = [
  { label: 'East-West Cultural Exchange', detail: 'Despite the violence, the Crusades accelerated cultural exchange between Europe and the Islamic world. Europeans encountered Arabic science, mathematics, medicine, and philosophy. They brought back new foods (sugar, spices, citrus), technologies (windmills, advanced siege weapons), and ideas. The Crusades helped pull Europe out of its intellectual isolation.' },
  { label: 'Rise of Italian Maritime Power', detail: 'Venice, Genoa, and Pisa leveraged the Crusades into commercial empires. They provided transport, supplies, and naval power in exchange for trading privileges in Crusader ports. The wealth generated helped fund the Italian Renaissance.' },
  { label: 'The Concept of "Just War"', detail: 'The Crusades forced Christian thinkers to develop elaborate theories of "just war" \u2014 when is violence morally legitimate? Under what authority? These debates, rooted in Augustine and developed during the Crusading era, remain the foundation of international law on armed conflict.' },
  { label: 'Permanent Catholic-Orthodox Divide', detail: 'The Fourth Crusade\'s sack of Constantinople (1204) created a wound between Catholic and Orthodox Christianity that has never fully healed. The event is still remembered with bitterness in the Orthodox world and was a major factor in the failure of subsequent attempts at church reunification.' },
  { label: 'The Military Orders\' Legacy', detail: 'The Templars, Hospitallers, and Teutonic Knights pioneered the concept of standing professional armies in medieval Europe, developed early banking systems, and left lasting architectural and cultural marks across Europe and the Middle East. The Hospitallers (as the Order of Malta) still exist today.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SectionWrapper({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: '28px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <h2
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 'clamp(17px, 3vw, 22px)',
          fontWeight: 700,
          color: '#e2e8f0',
          marginBottom: 18,
        }}
      >
        <span style={{ fontSize: 22 }}>{icon}</span>
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      style={{
        display: 'flex',
        gap: 14,
        marginBottom: 14,
        padding: '14px 16px',
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid ${entry.color}22`,
        borderLeft: `3px solid ${entry.color}`,
      }}
    >
      <div
        style={{
          minWidth: 72,
          fontSize: 11,
          fontWeight: 700,
          fontFamily: 'monospace',
          color: entry.color,
          paddingTop: 2,
        }}
      >
        {entry.year}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{entry.title}</div>
        <div style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.7 }}>{entry.description}</div>
      </div>
    </motion.div>
  );
}

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
      {figures.map((f, i) => (
        <motion.div
          key={f.name}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          style={{
            padding: '14px 16px',
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>{f.name}</div>
          <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace', marginBottom: 8 }}>{f.years}</div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{f.contribution}</div>
        </motion.div>
      ))}
    </div>
  );
}

function ContestedMemory({ contested, legacy }: { contested: InsightEntry[]; legacy: InsightEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: ROSE, marginBottom: 14 }}>Contested Memory &amp; Modern Use</h3>
        {contested.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(244,63,94,0.06)',
              border: '1px solid rgba(244,63,94,0.2)',
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fda4af', marginBottom: 4 }}>{t.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{t.detail}</div>
          </motion.div>
        ))}
      </div>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 14 }}>Lasting Impact</h3>
        {legacy.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.2)',
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#86efac', marginBottom: 4 }}>{r.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{r.detail}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function CrusadesPage() {
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
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div
          style={{
            padding: '40px 32px 36px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: `linear-gradient(135deg, rgba(7,14,34,0.98) 0%, ${RED}10 100%)`,
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: '#64748b',
              textDecoration: 'none',
              marginBottom: 28,
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            &larr; Back to Timeline
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: 'clamp(24px, 4.5vw, 40px)',
              fontWeight: 800,
              color: '#f1f5f9',
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            The Crusades &mdash; Holy War, Politics, and Two Centuries of Conflict (1095&ndash;1291)
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              fontSize: 14,
              color: '#94a3b8',
              lineHeight: 1.7,
              maxWidth: 720,
              padding: '16px 20px',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            For two centuries, European armies marched thousands of miles to fight for control of the Holy Land.
            From <strong style={{ color: GOLD }}>Pope Urban II&rsquo;s electrifying call to arms</strong> to{' '}
            <strong style={{ color: RED }}>the massacre at Jerusalem</strong> to{' '}
            <strong style={{ color: GREEN }}>Saladin&rsquo;s legendary mercy</strong> to{' '}
            <strong style={{ color: ROSE }}>the shameful sack of Constantinople</strong> &mdash; the Crusades
            were a collision of genuine faith, cynical politics, extraordinary courage, and appalling violence
            that still shapes how the West and the Islamic world see each other today.
          </motion.div>
        </div>

        {/* ── Why the Crusades Happened ───────────────────────────────────── */}
        <SectionWrapper title="Why the Crusades Happened" icon={'\u{1F3F0}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The Crusades did not erupt from nowhere. They emerged from a convergence of Byzantine desperation,
            papal ambition, feudal restlessness, and genuine religious devotion that made the idea of armed
            pilgrimage to Jerusalem irresistible to tens of thousands of Europeans.
          </p>
          {CONTEXT_ENTRIES.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Nine Crusades Overview ─────────────────────────────────────── */}
        <SectionWrapper title="The Nine Major Crusades (1096\u20131272)" icon={'\u{2694}\uFE0F'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Nine major Crusades were launched over nearly two centuries. Only the first achieved its
            primary goal. The rest were marked by military disaster, political betrayal, diplomatic
            ingenuity, and diminishing returns.
          </p>
          {CRUSADES_OVERVIEW.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── First Crusade ──────────────────────────────────────────────── */}
        <SectionWrapper title="The First Crusade (1096\u20131099) \u2014 Miracle and Massacre" icon={'\u{1F6E1}\uFE0F'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The First Crusade was the only one that fully achieved its military objective: the capture
            of Jerusalem. It was also a journey of staggering hardship, unlikely survival, and a final
            act of horrific violence that would poison relations between Christians and Muslims for
            centuries.
          </p>
          {FIRST_CRUSADE.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Second Crusade ─────────────────────────────────────────────── */}
        <SectionWrapper title="The Second Crusade (1147\u20131149) \u2014 Catastrophic Failure" icon={'\u{1F4A5}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The Second Crusade was the first major Crusade to fail completely. Led by two European
            kings, it ended in humiliation at Damascus and achieved nothing \u2014 worse than nothing,
            since it turned a Muslim ally into an enemy.
          </p>
          {SECOND_CRUSADE.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Third Crusade ──────────────────────────────────────────────── */}
        <SectionWrapper title="The Third Crusade (1189\u20131192) \u2014 Richard vs Saladin" icon={'\u{1F451}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The most famous Crusade pitted two legendary figures against each other: Richard I
            &ldquo;Lionheart&rdquo; of England and Saladin, sultan of Egypt and Syria. Their rivalry
            produced both brilliant military campaigns and acts of extraordinary chivalry between
            enemies.
          </p>
          {THIRD_CRUSADE.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Fourth Crusade ─────────────────────────────────────────────── */}
        <SectionWrapper title="The Fourth Crusade (1202\u20131204) \u2014 The Shameful Detour" icon={'\u{1F525}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The Fourth Crusade is the most infamous in history. Intended for Egypt, it was diverted
            by Venetian scheming and Byzantine intrigue into sacking Constantinople &mdash; the
            greatest Christian city in the world &mdash; an act that fatally wounded Christendom itself.
          </p>
          {FOURTH_CRUSADE.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Children's Crusade ─────────────────────────────────────────── */}
        <SectionWrapper title="The Children\u2019s Crusade (1212)" icon={'\u{1F9D2}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            One of the most haunting episodes of the Crusading era &mdash; thousands of young people
            marching toward the Holy Land, believing that innocence would succeed where arms had failed.
          </p>
          {CHILDRENS_CRUSADE.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Later Crusades ─────────────────────────────────────────────── */}
        <SectionWrapper title="The Later Crusades (1217\u20131272) \u2014 Diminishing Returns" icon={'\u{1F4C9}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The later Crusades saw diminishing enthusiasm, repeated strategic mistakes, one
            brilliant diplomatic triumph, and the final collapse of the Crusader presence in the
            Holy Land.
          </p>
          {LATER_CRUSADES.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Saladin ────────────────────────────────────────────────────── */}
        <SectionWrapper title="Saladin \u2014 The Sultan Who Became a Legend" icon={'\u{2B50}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Salah ad-Din Yusuf ibn Ayyub &mdash; Saladin &mdash; is one of the most celebrated
            figures in both Islamic and Western history. A Kurdish warrior who united the Muslim
            world, recaptured Jerusalem with mercy, and died having given away his fortune.
          </p>
          {SALADIN_ENTRIES.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Military Orders ────────────────────────────────────────────── */}
        <SectionWrapper title="The Military Orders \u2014 Warrior Monks" icon={'\u{1F6E1}\uFE0F'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The Crusades produced a unique institution: military religious orders whose members
            combined monastic vows with battlefield ferocity. They became the most disciplined
            fighting forces in the medieval world, invented early banking, and left legacies
            that endure to this day.
          </p>
          {MILITARY_ORDERS.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Impact on Jews ─────────────────────────────────────────────── */}
        <SectionWrapper title="Impact on Jewish Communities" icon={'\u{1F56F}\uFE0F'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The Crusades unleashed devastating violence against Jewish communities in Europe.
            Crusading mobs turned on &ldquo;the enemies of Christ&rdquo; closest to home,
            establishing a terrifying pattern of anti-Jewish persecution that would recur
            for centuries.
          </p>
          {JEWISH_IMPACT.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Key Figures ────────────────────────────────────────────────── */}
        <SectionWrapper title={`Key Figures (${KEY_FIGURES.length})`} icon={'\u{1F9D1}\u200D\u{1F393}'}>
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Legacy & Contested Memory ──────────────────────────────────── */}
        <SectionWrapper title="Legacy &amp; Contested Memory" icon={'\u{1F30D}'}>
          <ContestedMemory contested={CONTESTED_MEMORY} legacy={CRUSADE_LEGACY} />
        </SectionWrapper>

        {/* ── Bottom nav ─────────────────────────────────────────────────── */}
        <div style={{ padding: '24px 32px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#60a5fa',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid rgba(96,165,250,0.3)',
              backgroundColor: 'rgba(96,165,250,0.08)',
            }}
          >
            &larr; Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
