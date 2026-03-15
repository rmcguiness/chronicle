import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────── Theme ───────── */
const ACCENT = '#8b0000';   // Roman imperial red
const BG = '#0a0c10';
const TEXT = '#e8e4de';
const TEXT_DIM = '#9a9486';
const TEXT_MUTED = '#6b6458';
const CARD_BG = 'rgba(139,0,0,0.05)';
const CARD_BORDER = 'rgba(139,0,0,0.18)';
const ROMAN_RED = '#8b0000';
const SENATE_PURPLE = '#6b3fa0';
const LEGION_GOLD = '#c9a84c';
const MARBLE_WHITE = '#b0a89a';
const CARTHAGE_ORANGE = '#d4731a';
const BRONZE = '#8d6e63';
const REPUBLIC_TEAL = '#1a8a7d';
const CRISIS_CRIMSON = '#9b2226';

/* ───────── Types ───────── */
type SectionTab =
  | 'republic'
  | 'constitution'
  | 'social'
  | 'army'
  | 'expansion'
  | 'punic'
  | 'figures'
  | 'crisis'
  | 'spartacus'
  | 'caesar'
  | 'legacy';

interface TimelineEvent {
  date: string;
  title: string;
  detail: string;
  color: string;
}

interface Figure {
  name: string;
  dates: string;
  role: string;
  contribution: string;
  detail: string;
  icon: string;
  color: string;
}

interface PunicWar {
  name: string;
  dates: string;
  overview: string;
  detail: string;
  icon: string;
  color: string;
}

/* ───────── Data ───────── */

const CONTEXT_TEXT = 'In 509 BCE, the Romans overthrew their last king, Lucius Tarquinius Superbus, and swore never to be ruled by a monarch again. What they built in its place — a republic governed by elected magistrates, a powerful Senate, and an intricate system of checks and balances — would last nearly five centuries and become the most influential political system in Western history. The Roman Republic transformed a small city-state on the Tiber River into the dominant power of the entire Mediterranean world, conquering Italy, destroying Carthage, absorbing the Greek kingdoms, and amassing an empire so vast that its own institutions could no longer govern it. The story of the Republic is one of extraordinary achievement and ultimate tragedy: the very success of Roman expansion created the conditions that destroyed Roman liberty.';

const WHAT_WAS_REPUBLIC = {
  overview: 'The Roman Republic (res publica — "the public thing") was a system of government in which power was shared among elected magistrates, a hereditary Senate, and popular assemblies. Unlike a monarchy, no single person held permanent power. Unlike a democracy, real authority rested with a narrow aristocratic elite. It was, in Roman eyes, a mixed constitution — combining elements of monarchy (the consuls), aristocracy (the Senate), and democracy (the assemblies) — and the Greek historian Polybius argued this balance was the secret of Roman success.',
  spqr: 'SPQR — Senatus Populusque Romanus ("The Senate and People of Rome") — was the official name of the Roman state. It appeared on coins, standards, buildings, and military equipment. The phrase embodied the Republican ideal: that Rome was governed jointly by its aristocratic Senate and its citizen body. In practice, the Senate dominated, but the fiction of shared sovereignty was foundational to Roman political identity.',
  institutions: [
    { title: 'Consuls (2)', detail: 'Two consuls served as joint heads of state for one-year terms. Each could veto the other — preventing any one man from becoming a tyrant. They commanded armies, presided over the Senate, and executed laws. After their term, they became senators. In emergencies, the Senate could appoint a dictator with absolute power for six months.', icon: '👑', color: ROMAN_RED },
    { title: 'The Senate (~300 members)', detail: 'The Senate was the Republic\'s most powerful body — composed of former magistrates, predominantly patricians, serving for life. It controlled foreign policy, finances, and provincial governance. Senators wore togas with a broad purple stripe (latus clavus). While technically advisory, the Senate\'s "advice" (senatus consultum) was almost always followed. It was the institutional memory of the Republic.', icon: '🏛️', color: SENATE_PURPLE },
    { title: 'Tribunes of the Plebs (10)', detail: 'Created in 494 BCE after the plebeians threatened to secede from Rome. Tribunes were sacrosanct (anyone who harmed them was cursed) and held the power of veto (intercessio) over any magistrate\'s action, including other tribunes. They could propose legislation directly to the plebeian assembly. The tribunate was the most radical democratic element of the Roman constitution — and the office that ambitious men later weaponized to challenge the Senate.', icon: '✊', color: REPUBLIC_TEAL },
    { title: 'Popular Assemblies', detail: 'Roman citizens voted in several assemblies: the Comitia Centuriata (organized by wealth class — the rich voted first and had more voting units), the Comitia Tributa (organized by tribe — somewhat more democratic), and the Concilium Plebis (plebeians only, presided over by tribunes). These assemblies elected magistrates and passed laws, but voting was weighted to favor the wealthy, and the elite controlled the agenda.', icon: '🗳️', color: LEGION_GOLD },
    { title: 'Cursus Honorum', detail: 'The "course of honors" was the fixed sequence of offices a Roman politician had to hold: quaestor (financial officer) → aedile (public works) → praetor (judge/military commander) → consul. Minimum ages and intervals between offices prevented young men from rising too fast. This system channeled aristocratic ambition into service to the state — until the Late Republic, when men like Pompey and Caesar bypassed it entirely.', icon: '📊', color: BRONZE },
  ],
};

const CONSTITUTION = {
  overview: 'Rome never had a written constitution. Instead, the Republic was governed by mos maiorum — "the way of the ancestors" — a body of customs, traditions, precedents, and unwritten rules that had the force of law. This system was remarkably flexible, allowing Rome to adapt to new challenges, but also dangerously fragile: once ambitious men chose to ignore tradition, there was no written document to restrain them.',
  checksAndBalances: [
    { title: 'Collegiality', detail: 'Every magistracy was held by at least two people. Each colleague could veto the other. This prevented any individual from accumulating unchecked power — but it could also lead to paralysis when colleagues disagreed.', icon: '⚖️', color: SENATE_PURPLE },
    { title: 'Annuality', detail: 'Almost all magistracies lasted one year only, with no immediate re-election. This ensured rotation of power and prevented any individual from entrenching themselves. Ex-magistrates who abused power could be prosecuted after leaving office.', icon: '📅', color: ROMAN_RED },
    { title: 'Tribune\'s Veto', detail: 'Any tribune could veto any action by any magistrate — even a consul. The veto (intercessio) was absolute. This gave the common people a powerful defensive weapon against aristocratic overreach. The phrase "I forbid" (veto) entered every European language.', icon: '🚫', color: REPUBLIC_TEAL },
    { title: 'Senatorial Authority', detail: 'The Senate controlled the treasury, assigned provinces and armies, and set foreign policy. No magistrate could act effectively without senatorial cooperation. This collective aristocratic control was the Republic\'s center of gravity.', icon: '🏛️', color: LEGION_GOLD },
    { title: 'Provocatio', detail: 'A Roman citizen could appeal (provocatio) any magistrate\'s death sentence to the popular assembly. This was considered a fundamental right of citizenship — "Civis Romanus sum" ("I am a Roman citizen") was a legal shield. St. Paul invoked this right centuries later.', icon: '🛡️', color: BRONZE },
  ],
  usInfluence: 'The American Founders studied the Roman Republic obsessively. The separation of powers (executive/legislative/judicial), the system of checks and balances, the bicameral legislature (Senate and House, echoing the Roman Senate and assemblies), the concept of a limited-term executive, the veto power, and even the word "Senate" itself — all derive directly from Roman Republican institutions. John Adams, Alexander Hamilton, and James Madison explicitly cited Roman examples in The Federalist Papers. The Founders also studied Rome\'s collapse as a warning: they designed the Constitution to prevent the concentration of power that destroyed the Republic.',
};

const SOCIAL_STRUCTURE = {
  overview: 'Roman society was sharply divided between patricians (the hereditary aristocracy who claimed descent from Rome\'s founding families) and plebeians (everyone else — from wealthy merchants and farmers to urban poor). For the first centuries of the Republic, patricians monopolized political office, religious authority, and legal knowledge. The plebeians fought for generations to win equal rights.',
  struggleOfOrders: {
    overview: 'The Struggle of the Orders (494–287 BCE) was a two-century-long political conflict between patricians and plebeians. Through organized resistance — including multiple threatened secessions (secessio plebis, where the plebeians literally walked out of Rome and threatened to found their own city) — the common people gradually won legal equality, access to political office, and protections against aristocratic abuse.',
    milestones: [
      { date: '494 BCE', title: 'First Secession — Creation of the Tribune', detail: 'Plebeians withdrew to the Sacred Mount outside Rome, refusing to serve in the army or work until granted their own magistrates. The patricians, needing plebeian soldiers, agreed to create the Tribune of the Plebs — sacrosanct officials who could veto any action harming plebeian interests. This was the first major democratic concession in Roman history.', color: REPUBLIC_TEAL },
      { date: '450 BCE', title: 'The Twelve Tables — Written Law', detail: 'Plebeians demanded that the law be written down so patrician judges couldn\'t interpret it arbitrarily. A commission of ten men (decemviri) produced the Twelve Tables — Rome\'s first written legal code. Displayed publicly in the Forum, they covered property, family, inheritance, and legal procedure. They remained the foundation of Roman law for centuries and influenced every Western legal system.', color: LEGION_GOLD },
      { date: '445 BCE', title: 'Lex Canuleia — Intermarriage', detail: 'The Lex Canuleia legalized marriage between patricians and plebeians. Previously, such marriages were forbidden, keeping the bloodlines (and wealth) of the two orders strictly separate. This was a crucial step toward social integration.', color: SENATE_PURPLE },
      { date: '367 BCE', title: 'Licinian-Sextian Laws — Consuls for Plebeians', detail: 'After a decade-long struggle, the Licinian-Sextian laws required that at least one of the two consuls be a plebeian. This broke the patrician monopoly on the highest office. By 342 BCE, both consuls could be plebeian.', color: ROMAN_RED },
      { date: '287 BCE', title: 'Lex Hortensia — Plebeian Laws Bind All', detail: 'The final victory: laws passed by the Plebeian Assembly (plebiscita) were now binding on all Roman citizens, including patricians, without Senate approval. This effectively made the plebeian assembly a full legislature. The Struggle of the Orders was over — at least in theory.', color: REPUBLIC_TEAL },
    ],
  },
  classes: 'Even after legal equality was achieved, Roman society remained deeply hierarchical. A new nobility (nobilitas) emerged — wealthy plebeian families who had held the consulship merged with patrician families to form a closed governing elite. Below them: equites (wealthy businessmen and knights), ordinary citizens, freedmen (former slaves with limited rights), and at the bottom, slaves — who had no rights at all and made up perhaps 20–30% of Italy\'s population by the Late Republic.',
};

const ARMY = {
  overview: 'The Roman army was the engine of the Republic\'s expansion and, ultimately, the instrument of its destruction. For most of the Republic, it was a citizen militia: Roman men of property served when called, fought for a campaign season, and returned to their farms. This system produced fiercely motivated soldiers who fought for their own land and community — but it could not sustain the demands of permanent overseas empire.',
  features: [
    { title: 'The Legion', detail: 'The standard unit was the legion — approximately 4,200–5,000 infantry (later 5,000–6,000) plus cavalry. Each legion was divided into centuries (80 men), maniples (2 centuries), and later cohorts (6 centuries). A consul typically commanded two legions plus allied contingents — roughly 20,000 men. At its peak, Rome could field over 30 legions simultaneously.', icon: '🏴', color: ROMAN_RED },
    { title: 'Manipular Tactics', detail: 'The manipular formation (used ~4th–2nd centuries BCE) deployed troops in three lines: hastati (young soldiers) in front, principes (experienced veterans) behind, and triarii (elite reserves) in the rear. Each line could relieve the one ahead when it tired — giving Roman armies endurance that no phalanx could match. The flexible checkerboard (quincunx) formation could adapt to rough terrain where rigid Greek phalanxes broke apart.', icon: '🔲', color: LEGION_GOLD },
    { title: 'Discipline', detail: 'Roman military discipline was legendary — and brutal. Soldiers who fled battle could face decimation (every tenth man in a unit was beaten to death by his comrades). Units that lost their standards were disgraced. But discipline also meant engineering: every night, Roman legions built a fortified camp (castrum) with ditches, walls, and organized streets. Enemy generals repeatedly underestimated the Romans — and died for it.', icon: '⚔️', color: CRISIS_CRIMSON },
    { title: 'Engineering', detail: 'Roman soldiers were as much builders as fighters. They constructed roads, bridges, siege works, aqueducts, and fortifications. Julius Caesar\'s legions built a bridge across the Rhine in 10 days and besieged Alesia by constructing 18 km of fortifications — facing both inward (to contain the besieged) and outward (to repel a relief army). This engineering capability was unique in the ancient world.', icon: '🔨', color: BRONZE },
    { title: 'Marian Reforms (107 BCE)', detail: 'Gaius Marius transformed the army from a citizen militia into a professional force. He eliminated the property requirement (allowing the landless poor to enlist), standardized equipment, made the cohort the basic tactical unit, and promised veterans land after 20+ years of service. This created a superb fighting force — but soldiers now owed their loyalty and livelihood to their commanding general, not to Rome. The Marian reforms are the single most important factor in the Republic\'s collapse.', icon: '⚠️', color: CARTHAGE_ORANGE },
  ],
};

const EXPANSION_TIMELINE: TimelineEvent[] = [
  { date: '509–396 BCE', title: 'Conquest of Central Italy', detail: 'After expelling the kings, Rome spent over a century fighting its Latin and Etruscan neighbors. The capture of the Etruscan city of Veii (396 BCE) after a legendary 10-year siege doubled Rome\'s territory and marked the beginning of its transformation from city-state to regional power. Rome granted varying levels of citizenship to conquered peoples — a revolutionary policy that turned enemies into allies.', color: ROMAN_RED },
  { date: '390 BCE', title: 'The Gallic Sack of Rome', detail: 'A Gallic army under Brennus defeated the Romans at the Battle of the Allia and sacked Rome itself. According to legend, the sacred geese on the Capitoline Hill alerted defenders to a night attack. Brennus demanded a ransom in gold; when Romans complained the scales were rigged, he threw his sword on them and declared "Vae victis!" — "Woe to the conquered!" This humiliation traumatized Rome and drove its obsession with military security.', color: CARTHAGE_ORANGE },
  { date: '343–290 BCE', title: 'Samnite Wars — Mastery of Southern Italy', detail: 'Three wars against the fierce Samnite hill tribes of central-southern Italy. The Romans suffered humiliating defeats (the Caudine Forks, 321 BCE, where an entire army was forced to march under a yoke) but ultimately prevailed through persistence and their alliance system. By 290 BCE, Rome dominated the Italian peninsula south of the Po Valley.', color: LEGION_GOLD },
  { date: '280–275 BCE', title: 'Pyrrhic War — Rome vs. Greek World', detail: 'King Pyrrhus of Epirus invaded Italy with 25,000 troops and 20 war elephants to defend the Greek city of Tarentum. He won two battles but suffered such heavy casualties that he reportedly said: "One more such victory and I shall be lost" — the origin of "Pyrrhic victory." He eventually withdrew, and Rome absorbed the Greek cities of southern Italy, gaining its first direct contact with Greek culture.', color: SENATE_PURPLE },
  { date: '264–146 BCE', title: 'Punic Wars — Destruction of Carthage', detail: 'Three wars against Carthage, the great Phoenician commercial empire based in North Africa. These wars transformed Rome from an Italian power to the dominant force in the western Mediterranean. The Second Punic War (Hannibal) was the most devastating conflict in Roman history. See the dedicated Punic Wars section.', color: CARTHAGE_ORANGE },
  { date: '214–148 BCE', title: 'Macedonian Wars — Conquest of Greece', detail: 'Four wars against the Macedonian kingdom. At the Battle of Cynoscephalae (197 BCE), Roman legions decisively defeated the Macedonian phalanx — proving that flexible Roman tactics could beat the formation that had conquered the known world under Alexander. By 146 BCE, Greece was a Roman province. Roman general Mummius destroyed Corinth the same year Carthage fell.', color: REPUBLIC_TEAL },
  { date: '133–63 BCE', title: 'Eastern Conquests', detail: 'Rome absorbed the wealthy Hellenistic kingdoms of the eastern Mediterranean: the kingdom of Pergamum (bequeathed by will in 133 BCE), Pontus (defeated by Pompey after Mithridates\' wars), Seleucid Syria, and eventually Ptolemaic Egypt (30 BCE under Octavian). These conquests brought immense wealth — and destabilizing inequality — flooding into Rome.', color: LEGION_GOLD },
];

const PUNIC_WARS: PunicWar[] = [
  { name: 'First Punic War (264–241 BCE)', dates: '264–241 BCE', overview: 'Rome vs. Carthage for control of Sicily', detail: 'Rome and Carthage, the two dominant powers of the western Mediterranean, collided over Sicily — the largest and richest island in the region. Rome had no navy; Carthage was the greatest naval power of the age. The Romans built a fleet from scratch, reportedly copying a captured Carthaginian warship, and invented the corvus — a boarding bridge that turned sea battles into land fights. Despite catastrophic naval disasters (storms destroyed multiple Roman fleets, killing over 100,000 men), Roman persistence prevailed. After 23 years, Carthage ceded Sicily, paid a massive indemnity, and Rome became a naval power. The war cost both sides dearly: an estimated 400,000 lives on each side.', icon: '⚓', color: REPUBLIC_TEAL },
  { name: 'Second Punic War (218–201 BCE)', dates: '218–201 BCE', overview: 'Hannibal\'s invasion of Italy — the greatest military crisis Rome ever faced', detail: 'The most famous and devastating of the three wars. Hannibal Barca, Carthage\'s greatest general, marched an army of 50,000 soldiers, 9,000 cavalry, and 37 war elephants from Spain across the Pyrenees, through Gaul, and over the Alps into Italy — one of the most audacious military operations in history. He lost nearly half his army to cold, starvation, and hostile tribes in the Alpine crossing, but arrived in northern Italy and proceeded to inflict the worst series of defeats in Roman history.\n\nAt the Trebia (218 BCE), he ambushed and destroyed a Roman army. At Lake Trasimene (217 BCE), he annihilated an entire consular army of 25,000 in the largest ambush in military history. Then came Cannae (216 BCE) — the battle that military commanders study to this day.\n\nAt Cannae, Hannibal\'s outnumbered army (50,000 vs. 86,000 Romans) executed a perfect double envelopment: his center deliberately retreated, drawing the Romans forward into a U-shaped trap, then his cavalry crushed both Roman flanks and sealed the encirclement. In a single afternoon, approximately 50,000–70,000 Roman soldiers were killed — the worst single-day military disaster in Western history until the Somme in 1916. Rome lost roughly 20% of all its male citizens over 17 in one battle.\n\nYet Rome refused to surrender. The Senate rejected Hannibal\'s peace offers, banned the word "peace" from public discourse, and mobilized everything. Hannibal remained in Italy for 15 years but could never take Rome itself — he lacked siege equipment and reinforcements. Meanwhile, the brilliant young general Publius Cornelius Scipio (later "Africanus") conquered Carthaginian Spain and then invaded Africa itself, forcing Hannibal to return home. At the Battle of Zama (202 BCE), Scipio defeated Hannibal, ending the war. Carthage lost its empire, its fleet, and its independence in all but name.', icon: '🐘', color: CARTHAGE_ORANGE },
  { name: 'Third Punic War (149–146 BCE)', dates: '149–146 BCE', overview: '"Carthago delenda est" — Carthage must be destroyed', detail: 'By 150 BCE, Carthage had recovered economically (though it remained militarily neutered). The elder Roman senator Cato the Censor became obsessed with the idea that Carthage still posed a threat. He allegedly ended every Senate speech — regardless of the topic — with "Ceterum censeo Carthaginem esse delendam" ("Furthermore, I consider that Carthage must be destroyed"). Rome manufactured a pretext for war.\n\nThe Romans besieged Carthage for three years. The Carthaginians fought with extraordinary desperation: women cut their hair to make bowstrings, citizens melted gold statues for weapons, and the city held out far longer than expected. In 146 BCE, Scipio Aemilianus (adopted grandson of Scipio Africanus) finally breached the walls. The Romans methodically destroyed the city building by building in six days of savage street fighting. Of 500,000 inhabitants, approximately 50,000 survivors were sold into slavery. The city was razed to the ground.\n\nThe famous story that the Romans salted the earth so nothing would grow is probably a later invention — but the sentiment was real. Carthage was obliterated as a political entity. The site was eventually re-founded as a Roman colony by Julius Caesar. The destruction of Carthage marked Rome\'s transition from a republic defending itself to an imperial power that destroyed rivals preemptively.', icon: '🔥', color: CRISIS_CRIMSON },
];

const KEY_FIGURES: Figure[] = [
  { name: 'Scipio Africanus', dates: '236–183 BCE', role: 'Victor of the Second Punic War', contribution: 'Defeated Hannibal at Zama — saved the Republic at its darkest hour', detail: 'Publius Cornelius Scipio was 25 when he took command in Spain after his father and uncle were killed by Carthaginians. With no formal authority (the Senate granted him imperium as a private citizen — unprecedented), he conquered all of Carthaginian Spain in four years through brilliant tactics and personal charisma. He then invaded Africa itself, defeating Hannibal at Zama (202 BCE) and earning the cognomen "Africanus." He was arguably the greatest Roman general before Caesar. His career set a dangerous precedent: a young, charismatic commander who bypassed the normal cursus honorum and commanded a personal army. Later men (Pompey, Caesar) would follow the same path — with less restraint.', icon: '🦅', color: ROMAN_RED },
  { name: 'Tiberius Gracchus', dates: '163–133 BCE', role: 'Tribune — Land reform champion', contribution: 'Attempted to redistribute public land to the poor — murdered by senators', detail: 'Tiberius Gracchus, a nobleman from one of Rome\'s most distinguished families, was elected tribune in 133 BCE. He proposed an agrarian law to redistribute public land (ager publicus) — much of it illegally occupied by wealthy senators — to landless Roman citizens. The law was moderate and legal, but the Senate was outraged. When another tribune vetoed the bill, Tiberius had him deposed (an unprecedented and arguably unconstitutional act). He passed the law, then sought re-election as tribune (also unprecedented). A group of senators, led by his cousin Scipio Nasica, murdered Tiberius and 300 of his supporters with clubs and furniture legs on the Capitoline Hill. It was the first political murder in Rome in nearly 400 years. The precedent of political violence would accelerate the Republic\'s death.', icon: '🌾', color: REPUBLIC_TEAL },
  { name: 'Gaius Gracchus', dates: '154–121 BCE', role: 'Tribune — Expanded brother\'s reforms', contribution: 'Broader reform program — also killed by senatorial violence', detail: 'Ten years after his brother\'s murder, Gaius Gracchus became tribune and launched an even more ambitious reform program: subsidized grain for the urban poor (the first welfare program in Western history), road-building projects to create jobs, extending Roman citizenship to Italian allies, jury reform to break senatorial control of courts, and founding overseas colonies. The Senate used a new weapon — the senatus consultum ultimum ("ultimate decree of the Senate") — declaring a state of emergency. In the ensuing violence, Gaius had a slave kill him rather than be captured. Three thousand of his supporters were killed. The Senate had now established that political opponents could be legally murdered through emergency decrees.', icon: '⚖️', color: REPUBLIC_TEAL },
  { name: 'Gaius Marius', dates: '157–86 BCE', role: 'Consul 7 times — Army reformer', contribution: 'Saved Rome from invasion but created the conditions for civil war', detail: 'A "new man" (novus homo) from the Italian countryside, Marius rose through military talent rather than birth. He defeated Jugurtha in Africa and destroyed massive Germanic invasions (the Cimbri and Teutones) that threatened to overrun Italy. Elected consul an unprecedented seven times, he reformed the Roman army: eliminating the property requirement for service, standardizing equipment, and creating a professional military. These reforms produced superb soldiers — but soldiers who depended on their general for pay, plunder, and retirement land, not on the state. Marius himself set the precedent of using veteran soldiers for political intimidation in Rome, and his rivalry with Sulla led to the first Roman civil war.', icon: '🛡️', color: LEGION_GOLD },
  { name: 'Lucius Cornelius Sulla', dates: '138–78 BCE', role: 'Dictator — First to march on Rome', contribution: 'Marched his army against Rome itself — proved the Republic could be overthrown by force', detail: 'A patrician general who served under Marius, Sulla became his bitter rival. In 88 BCE, when the Senate awarded Sulla command of the war against Mithridates but the tribune Sulpicius transferred it to Marius, Sulla did the unthinkable: he marched his legions on Rome itself. No Roman general had ever turned the army against the city. He seized power, outlawed Marius, and left for the east. When Marius\'s faction regained control and massacred Sulla\'s supporters, Sulla returned (83 BCE), won a bloody civil war, and declared himself dictator. He posted proscription lists — names of enemies whose property was confiscated and who could be killed on sight by anyone (the killer received a reward). Up to 9,000 people were killed. Sulla then reformed the constitution to strengthen the Senate, then — astonishingly — resigned and retired. He died in 78 BCE. His precedent of using the army to seize power was far more influential than his reforms.', icon: '⚔️', color: CRISIS_CRIMSON },
  { name: 'Gnaeus Pompeius Magnus (Pompey)', dates: '106–48 BCE', role: 'Triumvir — The Republic\'s greatest general (before Caesar)', contribution: 'Conquered the East but lost the civil war that ended the Republic', detail: 'Pompey was the Alexander of his generation: he cleared the Mediterranean of pirates in three months, conquered Mithridates, annexed Syria and Judea, and reorganized the entire eastern Mediterranean. He celebrated three triumphs — over three different continents. Pompey was immensely powerful but politically inept. He joined Caesar and Crassus in the First Triumvirate (60 BCE) for mutual advantage, but after Crassus died at Carrhae (53 BCE), the alliance collapsed. The Senate chose Pompey to defend the Republic against Caesar. At the Battle of Pharsalus (48 BCE), Caesar\'s veteran legions crushed Pompey\'s larger but less experienced army. Pompey fled to Egypt, where he was murdered on the beach by advisers of the boy-king Ptolemy XIII.', icon: '🌍', color: SENATE_PURPLE },
  { name: 'Marcus Licinius Crassus', dates: '115–53 BCE', role: 'Triumvir — Richest man in Rome', contribution: 'Defeated Spartacus, bankrolled the First Triumvirate', detail: 'Crassus made his fortune through slave labor, real estate speculation (including allegedly buying burning buildings cheap), and proscription profiteering during Sulla\'s dictatorship. He defeated Spartacus\'s slave rebellion in 71 BCE, crucifying 6,000 captured slaves along the Appian Way from Rome to Capua. As the wealthiest man in Roman history (estimated fortune: 200 million sesterces, roughly $2–8 billion today), he bankrolled both Caesar and Pompey. He joined the First Triumvirate seeking military glory to match his rivals. He invaded Parthia in 53 BCE and was catastrophically defeated at the Battle of Carrhae — he and his son were killed, and 20,000 Roman soldiers died. Legend says the Parthians poured molten gold into his mouth as commentary on his greed. His death removed the balancing force in the Triumvirate and made war between Caesar and Pompey inevitable.', icon: '💰', color: LEGION_GOLD },
  { name: 'Julius Caesar', dates: '100–44 BCE', role: 'Dictator — The man who ended the Republic', contribution: 'Conquered Gaul, crossed the Rubicon, and made himself dictator for life', detail: 'See the dedicated Caesar section for full details. The most consequential Roman who ever lived: brilliant general, gifted writer, ambitious politician, and the man whose seizure of permanent power transformed the Republic into a dictatorship. His assassination on the Ides of March (44 BCE) did not save the Republic — it triggered 13 more years of civil war that ended with one-man rule under his adopted heir.', icon: '🗡️', color: ROMAN_RED },
  { name: 'Marcus Tullius Cicero', dates: '106–43 BCE', role: 'Orator, Senator, Consul', contribution: 'The Republic\'s greatest voice — and its most futile defender', detail: 'Cicero was the greatest orator in Roman history and one of the most important political philosophers of the ancient world. A "new man" who reached the consulship through talent alone, he suppressed the Catiline conspiracy (63 BCE) and spent his career defending the Senate and Republican institutions through speeches and philosophical writings. His works — On the Republic, On the Laws, On Duties — profoundly influenced the Enlightenment and the American Founders. But Cicero was politically outmaneuvered: he opposed Caesar, tried to use Octavian against Antony, and was ultimately proscribed and killed by the Second Triumvirate. His head and hands were nailed to the speakers\' platform in the Forum. He remains the most eloquent symbol of Republican values — and of their futility against armed force.', icon: '📜', color: BRONZE },
  { name: 'Mark Antony (Marcus Antonius)', dates: '83–30 BCE', role: 'Caesar\'s lieutenant — Triumvir', contribution: 'Fought for Caesar\'s legacy, lost everything to Octavian', detail: 'A talented general and fiercely loyal to Caesar, Antony delivered the famous funeral speech ("Friends, Romans, countrymen...") that turned the Roman mob against Caesar\'s assassins. He formed the Second Triumvirate with Octavian and Lepidus, defeated the assassins at Philippi (42 BCE), and took control of the wealthy eastern provinces. His political and romantic alliance with Cleopatra VII of Egypt alienated Roman opinion. Octavian\'s propaganda portrayed him as a traitor enslaved by a foreign queen. At the naval Battle of Actium (31 BCE), Antony and Cleopatra\'s fleet was defeated. Both committed suicide in Alexandria in 30 BCE — Antony by falling on his sword, Cleopatra (according to legend) by asp bite. Their deaths ended the last challenge to Octavian\'s sole rule.', icon: '🏛️', color: CRISIS_CRIMSON },
  { name: 'Octavian (Augustus)', dates: '63 BCE–14 CE', role: 'Caesar\'s heir — First Emperor', contribution: 'Won the civil wars and transformed the Republic into the Empire', detail: 'Caesar\'s grand-nephew and adopted heir, Octavian was 18 when Caesar was assassinated. He outmaneuvered politicians three times his age, formed and broke alliances ruthlessly, and fought a series of civil wars that eliminated every rival. After defeating Antony at Actium (31 BCE), he controlled the entire Roman world. In 27 BCE, he ostentatiously "restored the Republic" — while keeping control of the army, the treasury, and all major provinces. The Senate granted him the title "Augustus" ("the revered one"). He was technically princeps ("first citizen"), not rex ("king"), but he held absolute power until his death in 14 CE. His genius was maintaining Republican forms while exercising monarchical authority. The Republic was dead; the Empire had begun.', icon: '👑', color: LEGION_GOLD },
  { name: 'Hannibal Barca', dates: '247–183 BCE', role: 'Carthaginian general — Rome\'s greatest enemy', contribution: 'Nearly destroyed Rome — one of history\'s greatest military commanders', detail: 'The son of Hamilcar Barca (who fought in the First Punic War), Hannibal swore as a child to be the eternal enemy of Rome. He spent his life fulfilling that oath. His crossing of the Alps with elephants and his devastating victories at Trebia, Lake Trasimene, and Cannae made him the most feared enemy Rome ever faced. For 15 years, he ravaged Italy, winning every major battle but unable to take Rome itself. He was finally recalled to defend Carthage and defeated by Scipio Africanus at Zama (202 BCE). Exiled from Carthage, he spent years advising Rome\'s enemies before poisoning himself rather than be captured. Even centuries later, Roman mothers frightened their children with "Hannibal ad portas!" — "Hannibal is at the gates!" His tactical genius at Cannae is still studied at military academies worldwide.', icon: '🐘', color: CARTHAGE_ORANGE },
  { name: 'Spartacus', dates: '~111–71 BCE', role: 'Gladiator — Leader of the great slave revolt', contribution: 'Led history\'s most famous slave rebellion — exposed the brutality of Roman slavery', detail: 'A Thracian gladiator who escaped from a training school in Capua with 70 companions in 73 BCE. His revolt snowballed into an army of 70,000–120,000 escaped slaves and dispossessed people that defeated multiple Roman armies and ravaged Italy for two years. Spartacus was reportedly a brilliant tactician who wanted to escape Italy over the Alps, but many of his followers preferred to stay and plunder. He was finally cornered and defeated by Crassus in 71 BCE. Spartacus died in battle; 6,000 captured slaves were crucified along the 200-km Appian Way from Capua to Rome — their bodies left to rot as a warning. The revolt terrified the Roman elite and revealed the vast, violent underclass that sustained the Republic\'s economy.', icon: '⛓️', color: BRONZE },
  { name: 'Mithridates VI of Pontus', dates: '134–63 BCE', role: 'King of Pontus — Eastern nemesis of Rome', contribution: 'Three wars against Rome — ordered the massacre of 80,000 Romans in one day', detail: 'The "Poison King" (he allegedly immunized himself against assassination by taking small doses of poison daily) ruled the kingdom of Pontus on the Black Sea coast. In 88 BCE, exploiting Roman civil strife, he ordered the massacre of all Romans and Italians in Asia Minor — an estimated 80,000 were killed in a single day (the Asiatic Vespers). Three Mithridatic Wars followed (88–63 BCE), involving Sulla, Lucullus, and finally Pompey. Mithridates was finally defeated by Pompey in 63 BCE and died by poison (having to ask a bodyguard to stab him when the poison didn\'t work, thanks to his built-up immunity). His wars demonstrated how vulnerable Rome\'s eastern provinces were — and gave ambitious generals (Sulla, Pompey) the armies and prestige to challenge the Republic.', icon: '☠️', color: SENATE_PURPLE },
  { name: 'Cato the Younger', dates: '95–46 BCE', role: 'Senator — Republic\'s last true believer', contribution: 'Died rather than live under Caesar\'s dictatorship', detail: 'Great-grandson of Cato the Censor, the Younger Cato was the Senate\'s most stubborn defender of Republican principles. He opposed Caesar at every turn, refused every compromise, and blocked reforms that might have prevented civil war. When Caesar won the civil war, Cato retreated to Utica in North Africa and, after reading Plato\'s Phaedo (on the immortality of the soul), stabbed himself in the stomach. When doctors sewed the wound, he tore out his own entrails. His suicide made him a martyr for Republican liberty. Dante placed him as the guardian of Purgatory; George Washington staged a play about him at Valley Forge. Whether Cato was a noble defender of freedom or an inflexible obstructionist who helped cause the very catastrophe he sought to prevent remains debated.', icon: '🏛️', color: MARBLE_WHITE },
];

const LATE_REPUBLIC_CRISIS: TimelineEvent[] = [
  { date: '133 BCE', title: 'Tiberius Gracchus — First Blood', detail: 'Tribune Tiberius Gracchus proposed redistributing public land to the poor. When the Senate blocked him, he bypassed normal procedures. A mob of senators murdered him and 300 supporters — the first political killing in Rome in nearly 400 years. The precedent of political violence was established.', color: REPUBLIC_TEAL },
  { date: '121 BCE', title: 'Gaius Gracchus — The Pattern Repeats', detail: 'Gaius Gracchus expanded his brother\'s reforms: subsidized grain, road building, jury reform. The Senate issued the senatus consultum ultimum (emergency decree) for the first time, authorizing the consul to "see that the Republic suffer no harm." Gaius and 3,000 supporters were killed. Political murder was now institutionalized.', color: REPUBLIC_TEAL },
  { date: '107–100 BCE', title: 'Marius\'s Consulships and Army Reforms', detail: 'Marius was elected consul seven times (unprecedented). His army reforms created professional soldiers loyal to their commander rather than the state. Marius used his veterans to intimidate political opponents in Rome. The general-as-politician became the dominant figure in Roman politics.', color: LEGION_GOLD },
  { date: '88 BCE', title: 'Sulla Marches on Rome — The Rubicon Before the Rubicon', detail: 'When a tribune transferred Sulla\'s eastern command to Marius, Sulla marched his legions on Rome — the first time a Roman general used the army against the city. He seized power, outlawed Marius, then left for the east. The taboo against using military force in domestic politics was shattered forever.', color: CRISIS_CRIMSON },
  { date: '83–82 BCE', title: 'Sulla\'s Return — Proscriptions and Dictatorship', detail: 'Sulla returned from the east, won a civil war against Marius\'s faction, and declared himself dictator. He posted proscription lists — names of enemies who could be killed on sight, their property confiscated. Up to 9,000 people were murdered. Sulla reformed the constitution to empower the Senate, then resigned. His reforms didn\'t last; his precedent of armed seizure of power did.', color: CRISIS_CRIMSON },
  { date: '73–71 BCE', title: 'Spartacus Revolt', detail: 'A gladiator revolt grew into an army of 70,000–120,000 escaped slaves that defeated multiple Roman armies. Crassus finally crushed the rebellion; 6,000 captured slaves were crucified along the Appian Way. The revolt exposed the massive, exploited slave population that sustained the Republic\'s economy.', color: BRONZE },
  { date: '60 BCE', title: 'First Triumvirate: Caesar, Pompey, Crassus', detail: 'Three of Rome\'s most powerful men formed an unofficial alliance to bypass the Senate. Caesar got the consulship and then command of Gaul; Pompey got his eastern settlements ratified; Crassus got a command against Parthia. The Senate was sidelined. The Republic now functioned only at the sufferance of three warlords.', color: SENATE_PURPLE },
  { date: '53 BCE', title: 'Crassus Dies at Carrhae', detail: 'Crassus invaded Parthia seeking military glory to match his partners. At Carrhae, the Parthian horse archers annihilated his army — 20,000 killed, 10,000 captured. Crassus and his son were killed. The Triumvirate was now a duumvirate: Caesar vs. Pompey. War was inevitable.', color: LEGION_GOLD },
  { date: '49 BCE', title: 'Caesar Crosses the Rubicon — "Alea Iacta Est"', detail: 'The Senate, backed by Pompey, ordered Caesar to disband his army or be declared an enemy of the state. On January 10, 49 BCE, Caesar led the 13th Legion across the Rubicon River — the boundary between his province and Italy. Crossing it under arms was treason. Caesar allegedly said "alea iacta est" — "the die is cast." Civil war began. "Crossing the Rubicon" became a permanent metaphor for an irrevocable decision.', color: ROMAN_RED },
  { date: '48 BCE', title: 'Battle of Pharsalus — Caesar Defeats Pompey', detail: 'Caesar\'s outnumbered veterans crushed Pompey\'s larger army in Greece. Pompey fled to Egypt, where he was murdered on the beach by courtiers seeking Caesar\'s favor. Caesar reportedly wept when presented with Pompey\'s head. He then became entangled with Cleopatra in Egypt.', color: ROMAN_RED },
  { date: '44 BCE', title: 'Ides of March — Caesar Assassinated', detail: 'On March 15, 44 BCE, 23 senators stabbed Caesar to death in the Senate house at the foot of Pompey\'s statue. The conspirators, led by Brutus and Cassius, believed they were saving the Republic. Caesar\'s last words were disputed: Suetonius reports "Et tu, Brute?" ("And you, Brutus?") in Greek. The assassination did not save the Republic — it triggered 13 more years of civil war.', color: CRISIS_CRIMSON },
  { date: '43 BCE', title: 'Second Triumvirate and Proscriptions', detail: 'Octavian (Caesar\'s heir), Mark Antony, and Lepidus formed the Second Triumvirate — this time as an official, legally constituted office with dictatorial powers. They immediately proscribed their enemies: 300 senators and 2,000 equites were marked for death. Cicero was among the first killed — his head and hands were nailed to the Forum\'s speakers\' platform.', color: CRISIS_CRIMSON },
  { date: '42 BCE', title: 'Battle of Philippi — Assassins Defeated', detail: 'Antony and Octavian defeated Brutus and Cassius at Philippi in Macedonia. Both assassins committed suicide. The Republic\'s last defenders were dead. The Roman world was now divided between Octavian (the West) and Antony (the East).', color: ROMAN_RED },
  { date: '31 BCE', title: 'Battle of Actium — Octavian Wins Everything', detail: 'The final showdown: Octavian\'s fleet (commanded by Agrippa) defeated Antony and Cleopatra off the coast of western Greece. Antony and Cleopatra fled to Egypt and committed suicide the following year. Octavian was now sole ruler of the Roman world. In 27 BCE, he took the title "Augustus" — the Republic was dead. The Roman Empire had begun.', color: LEGION_GOLD },
];

const SPARTACUS = {
  overview: 'The Third Servile War (73–71 BCE) — better known as the Spartacus Revolt — was the largest and most famous slave uprising in Roman history. It exposed the terrifying reality beneath the Republic\'s grandeur: an economy built on the labor of millions of enslaved human beings.',
  story: 'Spartacus was a Thracian, possibly a former Roman auxiliary soldier, who had been enslaved and forced into gladiatorial training at a school (ludus) in Capua owned by Lentulus Batiatus. In 73 BCE, about 70 gladiators escaped using kitchen implements as weapons. They seized a supply of gladiatorial weapons and armor, then retreated to Mount Vesuvius.\n\nThe revolt grew with astonishing speed. Escaped slaves, rural laborers, and dispossessed free people flocked to Spartacus. Within months, he commanded an army of 70,000–120,000. He defeated multiple Roman forces sent against him — including two consular armies. Roman commanders initially dismissed the rebellion as a slave rabble; they paid for their contempt with their lives.\n\nSpartacus reportedly wanted to march north over the Alps and disperse — each person returning to their homeland. But many of his followers preferred to stay in Italy and plunder. The army turned south, ravaging the Italian countryside. The Senate, now terrified, appointed Crassus to crush the revolt with eight legions.',
  defeat: 'Crassus cornered Spartacus in the toe of Italy and built a wall across the peninsula to trap him. Spartacus broke through but was eventually brought to battle in 71 BCE. The final battle was ferocious — Spartacus fought his way toward Crassus personally but was cut down. His body was never identified.\n\n6,000 captured slaves were crucified along the 200-km Appian Way from Capua to Rome. The crosses lined both sides of the road, a grotesque monument to Roman power and Roman cruelty. The bodies were left to rot as a warning to any slave who might think of rebellion.',
  significance: 'The Spartacus revolt revealed several uncomfortable truths about the Roman Republic: that its economy depended on mass enslavement; that the enslaved vastly outnumbered their masters in many regions; that Roman military supremacy was not invincible; and that the Republican government was slow to respond to internal threats. The revolt also advanced the careers of both Crassus and Pompey (who arrived after the battle was won but claimed credit for mopping up stragglers), contributing to the political dynamics that would destroy the Republic.\n\nSpartacus became a symbol of resistance against oppression that has endured for over two thousand years. Karl Marx called him "the most splendid fellow in the whole of ancient history." His story has been retold in novels, films, and political movements worldwide.',
};

const CAESAR_SECTION = {
  earlyLife: 'Gaius Julius Caesar was born in 100 BCE into an ancient patrician family — the Julii claimed descent from Venus herself. Despite their noble pedigree, the family was not wealthy or politically prominent by Late Republican standards. Caesar\'s aunt Julia married Marius, connecting him to the popularis (popular) faction. During Sulla\'s proscriptions, the young Caesar was targeted but escaped. When told to divorce his wife Cornelia (daughter of a Marius ally), he refused — a dangerous act of defiance that nearly cost him his life.',
  rise: 'Caesar rose through the cursus honorum — quaestor, aedile, praetor — spending lavishly on public games and building a populist reputation. He went deep into debt to fund his career (reportedly owing 25 million sesterces before holding a single major office). As governor of Further Spain, he proved his military talent. In 60 BCE, he formed the First Triumvirate with Pompey and Crassus, securing the consulship for 59 BCE and then a five-year command in Gaul.',
  gallicWars: 'The Gallic Wars (58–50 BCE) made Caesar one of history\'s greatest military commanders. In eight years, he conquered all of Gaul (modern France, Belgium, parts of Germany and Switzerland), adding territory the size of Spain to Roman control. He defeated the Helvetii migration, crushed the Germanic king Ariovistus, pacified the Belgae, bridged the Rhine (twice), and invaded Britain (twice — 55 and 54 BCE). He suppressed a massive Gallic revolt led by Vercingetorix at the siege of Alesia (52 BCE) — where he built 18 km of double fortifications, fighting both the besieged garrison and a relief army of 250,000 simultaneously.\n\nCaesar\'s own account, Commentarii de Bello Gallico (Commentaries on the Gallic War), is one of the greatest military memoirs ever written — and a masterpiece of political propaganda. Written in elegant third person, it justified his conquests while building his public image in Rome. His campaigns killed an estimated 1 million Gauls and enslaved another million — a devastating toll that modern historians increasingly characterize as genocide.',
  rubicon: 'By 50 BCE, Caesar\'s command was expiring and his enemies in the Senate (led by Cato and backed by Pompey) prepared to prosecute him the moment he became a private citizen. Caesar demanded to stand for consul in absentia (to maintain legal immunity); the Senate refused. On January 10, 49 BCE, Caesar led the 13th Legion across the Rubicon River into Italy. "Alea iacta est" — "The die is cast." The civil war had begun.\n\nCaesar swept through Italy in weeks — Pompey and the Senate fled to Greece, then to Egypt. Caesar defeated Pompey\'s forces at Pharsalus (48 BCE), intervened in Egypt\'s civil war (installing Cleopatra as co-ruler), defeated Pompeian holdouts in Africa (Thapsus, 46 BCE) and Spain (Munda, 45 BCE).',
  dictatorship: 'By 45 BCE, Caesar was master of the Roman world. He was appointed dictator perpetuo — dictator for life. He initiated sweeping reforms: a new calendar (the Julian calendar, basis of our modern calendar, with its famous correction of the accumulated drift — "the last year of confusion" in 46 BCE lasted 445 days), settlement of veterans on public land, extension of citizenship to Gauls and Spaniards, expansion of the Senate to 900 members, and grand building projects. He was worshipped as a god in some provinces.\n\nBut Caesar displayed contempt for Republican forms. He received the Senate while seated (instead of standing as protocol demanded), dressed in royal purple, and accepted honors that evoked monarchy. He made no effort to disguise his permanent power. Republican senators, horrified by what they saw as tyranny, began to plot.',
  assassination: 'On March 15, 44 BCE — the Ides of March — a conspiracy of 23 senators struck. As Caesar entered the Senate meeting (held in the Theatre of Pompey), the conspirators surrounded him. Servilius Casca struck first; the others followed. Caesar suffered 23 stab wounds. Ancient sources disagree on his last words: Suetonius reports the Greek phrase "Kai su, teknon?" ("And you, child?") addressed to Brutus, whom some said was his illegitimate son. He fell at the base of Pompey\'s statue.\n\nThe assassins — led by Marcus Junius Brutus and Gaius Cassius Longinus — called themselves the Liberators and believed they had saved the Republic. They were wrong. Caesar\'s murder triggered a chain of events — the rise of Octavian, the Second Triumvirate, the proscriptions, and 13 more years of civil war — that destroyed the very Republic they sought to preserve. The Roman people, who had loved Caesar, turned against the assassins. Within three years, every major conspirator was dead.',
};

const LEGACY = [
  { title: 'The Senate Model', detail: 'The Roman Senate\'s structure — a deliberative body of experienced statesmen providing continuity across annual magistracies — became the model for legislative bodies worldwide. The word "Senate" itself (from senex, "old man") was adopted directly by the United States, France, Italy, and dozens of other nations. The concept of a bicameral legislature (the Senate representing stability and experience, popular assemblies representing democratic will) originated in Rome and was explicitly copied by the American Founders.', icon: '🏛️', color: SENATE_PURPLE },
  { title: 'Roman Law', detail: 'Roman legal principles form the foundation of most Western legal systems (civil law tradition). Key concepts that originated in Roman law: the presumption of innocence, the right to a defense, the distinction between public and private law, the concept of legal persons (corporations), contract law, property rights, and the principle that law should be written, public, and applied equally. The Twelve Tables (450 BCE) established the principle that law must be transparent. Justinian\'s later codification (6th century CE) transmitted Roman legal thought to medieval and modern Europe.', icon: '⚖️', color: LEGION_GOLD },
  { title: 'The Latin Language', detail: 'Latin, the language of the Republic, became the dominant language of Western civilization for nearly two thousand years. It evolved into the Romance languages (Italian, French, Spanish, Portuguese, Romanian) spoken by nearly a billion people today. Latin remained the language of science, law, medicine, philosophy, and the Catholic Church well into the modern era. Over 60% of English words have Latin roots. Every educated European until the 20th century read Latin; many of the fundamental texts of Western thought were written in it.', icon: '📖', color: BRONZE },
  { title: 'Roads, Engineering & Infrastructure', detail: 'The Roman road network — over 400,000 km of roads connecting every corner of the Republic and later the Empire — was the ancient world\'s greatest infrastructure achievement. Built by legionary soldiers, Roman roads were marvels of engineering: multiple layers of gravel, sand, and stone, crowned for drainage, and so well-built that some remain in use today. The Appian Way (312 BCE) was the first. Roman engineering also produced aqueducts, sewers (the Cloaca Maxima), concrete (the Pantheon\'s dome), and arches that influenced architecture for millennia. "All roads lead to Rome" was literally true.', icon: '🛣️', color: ROMAN_RED },
  { title: 'Checks and Balances — Warning and Inspiration', detail: 'The Roman Republic\'s system of checks and balances directly inspired the American Constitution. But its collapse was equally instructive. The Founders studied how the Republic fell — through land inequality, military loyalty to generals over the state, political violence, emergency powers, and the erosion of norms — and designed safeguards against each. Madison wrote in Federalist No. 63 that the Senate was needed to prevent the "blunders of democracy" that destroyed Rome. The Republic serves as both model and cautionary tale: proof that democratic institutions can be built, and proof that they can be destroyed when citizens and leaders stop defending them.', icon: '🗽', color: REPUBLIC_TEAL },
  { title: 'The Concept of the Republic Itself', detail: 'Before Rome, large states were ruled by kings, pharaohs, or tyrants. The idea that a major state could be governed by elected officials serving limited terms, checked by other institutions, was revolutionary. The word "republic" (res publica — "the public thing") entered every European language directly from Latin. Every republic since — from Renaissance Florence and Venice to the American, French, and modern democratic republics — has drawn on the Roman model. The Republic proved that self-governance could produce a superpower; its fall proved that maintaining a republic requires constant vigilance.', icon: '🌍', color: CARTHAGE_ORANGE },
];

/* ───────── Sub-components ───────── */

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: `${ROMAN_RED}15`, border: `1px solid ${ROMAN_RED}33`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: ROMAN_RED, fontFamily: 'monospace' }}>{value}</div>
      <div style={{ fontSize: 11, color: TEXT_DIM, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function TabButton({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 8,
        border: `1px solid ${active ? ROMAN_RED : CARD_BORDER}`,
        backgroundColor: active ? `${ROMAN_RED}22` : 'transparent',
        color: active ? TEXT : TEXT_DIM,
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.2s',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
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

/* ───────── Section tabs config ───────── */

const SECTION_TABS: { key: SectionTab; label: string; icon: string }[] = [
  { key: 'republic', label: 'What Was the Republic', icon: '🏛️' },
  { key: 'constitution', label: 'Constitution', icon: '📜' },
  { key: 'social', label: 'Social Structure', icon: '⚖️' },
  { key: 'army', label: 'The Roman Army', icon: '🛡️' },
  { key: 'expansion', label: 'Expansion', icon: '🗺️' },
  { key: 'punic', label: 'Punic Wars', icon: '🐘' },
  { key: 'figures', label: 'Key Figures', icon: '👤' },
  { key: 'crisis', label: 'Late Republic Crisis', icon: '⚠️' },
  { key: 'spartacus', label: 'Spartacus', icon: '⛓️' },
  { key: 'caesar', label: 'Julius Caesar', icon: '🗡️' },
  { key: 'legacy', label: 'Legacy', icon: '🌍' },
];

/* ───────── Main Component ───────── */

export default function RomanRepublicPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('republic');
  const [expandedFigure, setExpandedFigure] = useState<string | null>(null);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: BG, color: TEXT, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* ─── Hero ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ padding: '48px 32px 36px', borderBottom: `1px solid ${CARD_BORDER}`, background: `linear-gradient(135deg, ${BG} 0%, rgba(139,0,0,0.10) 100%)` }}>
          <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '4px 0' }}>← Back to Timeline</Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: `${ROMAN_RED}20`, border: `2px solid ${ROMAN_RED}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: `0 0 24px ${ROMAN_RED}30` }}>🏛️</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, backgroundColor: `${ROMAN_RED}20`, color: ROMAN_RED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Deep Dive</span>
          </div>

          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 800, color: TEXT, lineHeight: 1.15, marginBottom: 14 }}>
            The Roman Republic — How a City-State Became the Ancient World's Superpower{' '}
            <span style={{ fontSize: 'clamp(18px, 3vw, 28px)', color: TEXT_DIM, fontWeight: 400 }}>(509–27 BCE)</span>
          </h1>

          <p style={{ fontSize: 16, color: TEXT_DIM, lineHeight: 1.7, maxWidth: 700, margin: 0 }}>
            From the overthrow of kings to the rise of Caesar — how a small city on the Tiber built a republic of senators, consuls, and legions that conquered the Mediterranean, then tore itself apart.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
            <StatBadge value="482" label="Years" />
            <StatBadge value="SPQR" label="Senate & People" />
            <StatBadge value="3" label="Punic Wars" />
            <StatBadge value="15+" label="Key Figures" />
            <StatBadge value="30+" label="Legions at Peak" />
          </div>
        </motion.div>

        {/* ─── Tab Navigation ─── */}
        <div style={{ padding: '16px 32px', borderBottom: `1px solid ${CARD_BORDER}`, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, backgroundColor: BG }}>
          {SECTION_TABS.map(tab => (
            <TabButton key={tab.key} label={tab.label} icon={tab.icon} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} />
          ))}
        </div>

        {/* ─── What Was the Republic ─── */}
        {activeTab === 'republic' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🏛️" title="What Was the Roman Republic?" />
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${BRONZE}33`, backgroundColor: `${BRONZE}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{CONTEXT_TEXT}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: SENATE_PURPLE, marginBottom: 12 }}>The Republican System</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${SENATE_PURPLE}33`, backgroundColor: `${SENATE_PURPLE}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{WHAT_WAS_REPUBLIC.overview}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: LEGION_GOLD, marginBottom: 12 }}>SPQR — Senatus Populusque Romanus</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${LEGION_GOLD}33`, backgroundColor: `${LEGION_GOLD}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{WHAT_WAS_REPUBLIC.spqr}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Key Institutions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {WHAT_WAS_REPUBLIC.institutions.map((inst, i) => (
                <motion.div key={inst.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${inst.color}44`, backgroundColor: `${inst.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{inst.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: inst.color }}>{inst.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{inst.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Constitution ─── */}
        {activeTab === 'constitution' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="📜" title="The Roman Constitution — Unwritten but Powerful" />

            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${BRONZE}33`, backgroundColor: `${BRONZE}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{CONSTITUTION.overview}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: SENATE_PURPLE, marginBottom: 12 }}>Checks and Balances</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {CONSTITUTION.checksAndBalances.map((cb, i) => (
                <motion.div key={cb.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${cb.color}33`, backgroundColor: `${cb.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{cb.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{cb.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{cb.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: REPUBLIC_TEAL, marginBottom: 12 }}>How Rome Influenced the US Constitution</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${REPUBLIC_TEAL}33`, backgroundColor: `${REPUBLIC_TEAL}08` }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{CONSTITUTION.usInfluence}</p>
            </div>
          </section>
        )}

        {/* ─── Social Structure ─── */}
        {activeTab === 'social' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="⚖️" title="Patricians vs. Plebeians — The Struggle of the Orders" />

            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${SENATE_PURPLE}33`, backgroundColor: `${SENATE_PURPLE}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{SOCIAL_STRUCTURE.overview}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: REPUBLIC_TEAL, marginBottom: 12 }}>The Struggle of the Orders (494–287 BCE)</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${REPUBLIC_TEAL}33`, backgroundColor: `${REPUBLIC_TEAL}08`, marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{SOCIAL_STRUCTURE.struggleOfOrders.overview}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Key Milestones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {SOCIAL_STRUCTURE.struggleOfOrders.milestones.map((m, i) => (
                <motion.div key={m.date} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${m.color}44`, backgroundColor: `${m.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: m.color, fontFamily: 'monospace', padding: '3px 10px', borderRadius: 6, backgroundColor: `${m.color}15`, border: `1px solid ${m.color}33` }}>{m.date}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>{m.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{m.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: BRONZE, marginBottom: 12 }}>Social Reality After the Struggle</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${BRONZE}33`, backgroundColor: `${BRONZE}08` }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{SOCIAL_STRUCTURE.classes}</p>
            </div>
          </section>
        )}

        {/* ─── The Roman Army ─── */}
        {activeTab === 'army' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🛡️" title="The Roman Army — Engine of Conquest" />

            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${ROMAN_RED}33`, backgroundColor: `${ROMAN_RED}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{ARMY.overview}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Key Features</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {ARMY.features.map((feat, i) => (
                <motion.div key={feat.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${feat.color}44`, backgroundColor: `${feat.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{feat.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: feat.color }}>{feat.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{feat.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Expansion Timeline ─── */}
        {activeTab === 'expansion' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🗺️" title="Roman Expansion — From City-State to Mediterranean Empire" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>From Italian unification through the Punic Wars to the conquest of the Greek East — 400 years of relentless expansion.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {EXPANSION_TIMELINE.map((evt, i) => (
                <motion.div key={evt.date} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${evt.color}44`, backgroundColor: `${evt.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: evt.color, fontFamily: 'monospace', padding: '3px 10px', borderRadius: 6, backgroundColor: `${evt.color}15`, border: `1px solid ${evt.color}33` }}>{evt.date}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>{evt.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{evt.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Punic Wars ─── */}
        {activeTab === 'punic' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🐘" title="The Punic Wars (264–146 BCE) — Rome vs. Carthage" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>Three wars over 118 years that transformed Rome from an Italian power into the dominant force of the Mediterranean. The Second Punic War — Hannibal's invasion of Italy — was the most devastating conflict in Roman history.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {PUNIC_WARS.map((war, i) => (
                <motion.div key={war.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, duration: 0.4 }} style={{ padding: '22px 26px', borderRadius: 14, border: `1px solid ${war.color}44`, backgroundColor: `${war.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 28 }}>{war.icon}</span>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: war.color }}>{war.name}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_DIM, fontFamily: 'monospace' }}>{war.overview}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{war.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Key Figures ─── */}
        {activeTab === 'figures' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="👤" title="Key Figures of the Roman Republic" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>Generals, reformers, dictators, and enemies — the people who made and destroyed the Republic.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {KEY_FIGURES.map((fig, i) => (
                <motion.div key={fig.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}>
                  <button onClick={() => setExpandedFigure(expandedFigure === fig.name ? null : fig.name)} style={{ width: '100%', background: 'none', border: `1px solid ${fig.color}33`, borderRadius: expandedFigure === fig.name ? '12px 12px 0 0' : 12, padding: '14px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: expandedFigure === fig.name ? `${fig.color}12` : 'transparent', transition: 'background-color 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                      <span style={{ fontSize: 20 }}>{fig.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{fig.name} <span style={{ fontSize: 11, fontWeight: 500, color: TEXT_DIM }}>({fig.dates})</span></div>
                        <div style={{ fontSize: 12, color: fig.color, fontWeight: 600 }}>{fig.role}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 18, color: TEXT_DIM, transform: expandedFigure === fig.name ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}>▼</span>
                  </button>
                  <AnimatePresence>
                    {expandedFigure === fig.name && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden', borderRadius: '0 0 12px 12px', border: `1px solid ${fig.color}33`, borderTop: 'none', backgroundColor: `${fig.color}08` }}>
                        <div style={{ padding: '14px 18px' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: fig.color, marginBottom: 8 }}>{fig.contribution}</div>
                          <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{fig.detail}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Late Republic Crisis ─── */}
        {activeTab === 'crisis' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="⚠️" title="The Late Republic Crisis (133–27 BCE) — Why the Republic Collapsed" />
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${CRISIS_CRIMSON}33`, backgroundColor: `${CRISIS_CRIMSON}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>The Republic's success destroyed it. Conquests brought vast wealth — but it flowed to the elite while small farmers lost their land to slave-worked plantations (latifundia). Landless citizens flooded into Rome, dependent on grain handouts. Generals commanded professional armies loyal to them personally. Political norms eroded as ambitious men used violence, emergency decrees, and military force to achieve their goals. In a century of escalating crisis, the Republic tore itself apart.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {LATE_REPUBLIC_CRISIS.map((evt, i) => (
                <motion.div key={evt.date} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${evt.color}44`, backgroundColor: `${evt.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: evt.color, fontFamily: 'monospace', padding: '3px 10px', borderRadius: 6, backgroundColor: `${evt.color}15`, border: `1px solid ${evt.color}33` }}>{evt.date}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>{evt.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{evt.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Spartacus ─── */}
        {activeTab === 'spartacus' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="⛓️" title="The Spartacus Revolt (73–71 BCE)" />

            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${BRONZE}33`, backgroundColor: `${BRONZE}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{SPARTACUS.overview}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: ROMAN_RED, marginBottom: 12 }}>The Revolt</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${ROMAN_RED}33`, backgroundColor: `${ROMAN_RED}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{SPARTACUS.story}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: CRISIS_CRIMSON, marginBottom: 12 }}>Defeat and Crucifixion</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${CRISIS_CRIMSON}33`, backgroundColor: `${CRISIS_CRIMSON}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{SPARTACUS.defeat}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: REPUBLIC_TEAL, marginBottom: 12 }}>Significance</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${REPUBLIC_TEAL}33`, backgroundColor: `${REPUBLIC_TEAL}08` }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{SPARTACUS.significance}</p>
            </div>
          </section>
        )}

        {/* ─── Julius Caesar ─── */}
        {activeTab === 'caesar' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🗡️" title="Julius Caesar — The Man Who Ended the Republic" />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: BRONZE, marginBottom: 12 }}>Early Life & Rise</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${BRONZE}33`, backgroundColor: `${BRONZE}08`, marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{CAESAR_SECTION.earlyLife}</p>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${SENATE_PURPLE}33`, backgroundColor: `${SENATE_PURPLE}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{CAESAR_SECTION.rise}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: ROMAN_RED, marginBottom: 12 }}>The Gallic Wars (58–50 BCE)</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${ROMAN_RED}33`, backgroundColor: `${ROMAN_RED}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{CAESAR_SECTION.gallicWars}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: LEGION_GOLD, marginBottom: 12 }}>Crossing the Rubicon (49 BCE)</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${LEGION_GOLD}33`, backgroundColor: `${LEGION_GOLD}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{CAESAR_SECTION.rubicon}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: SENATE_PURPLE, marginBottom: 12 }}>Dictatorship & Reforms</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${SENATE_PURPLE}33`, backgroundColor: `${SENATE_PURPLE}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{CAESAR_SECTION.dictatorship}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: CRISIS_CRIMSON, marginBottom: 12 }}>The Ides of March (44 BCE)</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${CRISIS_CRIMSON}33`, backgroundColor: `${CRISIS_CRIMSON}08` }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{CAESAR_SECTION.assassination}</p>
            </div>
          </section>
        )}

        {/* ─── Legacy ─── */}
        {activeTab === 'legacy' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🌍" title="Legacy — The Republic's Enduring Impact" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>How a city-state's experiment in self-governance shaped law, language, government, and civilization itself — for over two thousand years.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {LEGACY.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Footer ─── */}
        <div style={{ padding: 32, textAlign: 'center', borderTop: `1px solid ${CARD_BORDER}` }}>
          <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', padding: '8px 16px', borderRadius: 6, border: `1px solid ${CARD_BORDER}`, backgroundColor: CARD_BG }}>← Back to Timeline</Link>
        </div>

      </div>
    </div>
  );
}
