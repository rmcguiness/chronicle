import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────── Theme ───────── */
const ACCENT = '#1a5276';    // French imperial blue
const BG = '#0a0c10';
const TEXT = '#e8e4de';
const TEXT_DIM = '#9a9486';
const TEXT_MUTED = '#6b6458';
const CARD_BG = 'rgba(26,82,118,0.05)';
const CARD_BORDER = 'rgba(26,82,118,0.18)';
const IMPERIAL_BLUE = '#1a5276';
const GOLD = '#c9a84c';         // Imperial eagle, coronation regalia
const CRIMSON = '#9b2226';      // Blood of the battlefield
const TEAL = '#1a8a7d';         // Reformist enlightenment
const OLIVE = '#6b8e23';        // Military campaigns
const FLAME = '#c2452d';        // Moscow burning
const BRONZE = '#8d6e63';       // The Grande Armée
const NAVY = '#0d3b66';         // Naval warfare, Continental System
const SNOW = '#7b9ea8';         // Russian winter

/* ───────── Types ───────── */
type SectionTab =
  | 'overview'
  | 'rise'
  | 'empire'
  | 'military'
  | 'battles'
  | 'grandearmee'
  | 'coalitions'
  | 'russia'
  | 'spain'
  | 'relationships'
  | 'waterloo'
  | 'exile'
  | 'legacy';

interface Battle {
  name: string;
  date: string;
  outcome: string;
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

/* ───────── Data ───────── */

const OVERVIEW_TEXT = 'Napoleon Bonaparte was a Corsican-born artillery officer who seized control of France during the chaos of the Revolution, crowned himself Emperor, rewrote European law, won more than 50 battles, built and lost the largest European empire since Rome — and was finally defeated not by a single general, but by the combined resources of every other major power on the continent. In barely 20 years, he remade the map of Europe, abolished the Holy Roman Empire, spread revolutionary ideals of meritocracy and legal equality, and unleashed the forces of nationalism that would shape the 19th and 20th centuries. He remains the most studied military commander in history.';

const ORIGINS = {
  overview: 'Napoleon was born Napoleone di Buonaparte on August 15, 1769, in Ajaccio, Corsica — just one year after France purchased the island from Genoa. He was technically an Italian-speaking foreigner in France. His father Carlo, a minor Corsican nobleman, secured young Napoleon a scholarship to a French military academy at Brienne (1779) and then the prestigious École Militaire in Paris (1784). Napoleon graduated in one year instead of the usual two, commissioning as an artillery officer at just 16.',
  outsider: 'Napoleon\'s Corsican accent, modest background, and "foreign" origins made him an outsider among the French aristocratic officer class. Fellow cadets mocked his accent and provincial manners. This outsider status drove a ferocious ambition — and gave him a revolutionary\'s contempt for inherited privilege. When the Revolution erupted in 1789, Napoleon saw his chance. While aristocratic officers fled France, Napoleon stayed, and the Revolution\'s meritocratic ideals aligned perfectly with his own beliefs: talent, not birth, should determine a man\'s fate.',
  toulon: 'Napoleon\'s first moment of glory came at the Siege of Toulon (1793), where British forces held the vital Mediterranean port. The 24-year-old captain devised a daring artillery plan to force the British fleet out of the harbor. It worked brilliantly. He was promoted to brigadier general virtually overnight — and came to the attention of the revolutionary leadership. A year later, on 13 Vendémiaire (October 5, 1795), he used "a whiff of grapeshot" to disperse a royalist mob threatening the government, earning him command of the Army of Italy.',
};

const RISE = {
  italy: {
    overview: 'The Italian Campaign (1796–97) made Napoleon a legend. Given command of a demoralized, underfed Army of Italy at just 26, he transformed it into a winning machine through charisma, speed, and tactical genius. In barely a year, he defeated the Austrians and Sardinians in a series of dazzling battles — Montenotte, Lodi, Arcole, Rivoli — forcing Austria to sue for peace and giving France control of northern Italy.',
    significance: 'Italy showed Napoleon\'s signature approach: divide enemy forces, strike each in detail before they could unite, use speed to compensate for inferior numbers, and inspire troops through personal bravery. At Arcole, he personally led a charge across a bridge under fire. At Rivoli, he defeated four separate Austrian columns in a single battle. He negotiated peace with Austria himself, ignoring the Directory\'s instructions — already acting more like a sovereign than a general.',
  },
  egypt: {
    overview: 'The Egyptian Campaign (1798–99) was a military failure but a political masterstroke. Napoleon invaded Egypt to threaten British trade routes to India, bringing 167 scholars and scientists alongside 38,000 soldiers. The army won the Battle of the Pyramids but was stranded when Nelson destroyed the French fleet at the Battle of the Nile (August 1798).',
    significance: 'While the military campaign stalled, the scholarly expedition transformed European understanding of ancient Egypt. The Rosetta Stone was discovered, Egyptian temples and tombs were documented, and the resulting "Description de l\'Égypte" sparked a continent-wide fascination with Egyptology. Napoleon abandoned his army in Egypt and sailed back to France, spinning the campaign as a triumph. His absence from France had made him more popular, not less — he was the conquering hero, untainted by the Directory\'s failures.',
  },
  brumaire: {
    overview: 'On November 9–10, 1799 (18 Brumaire by the revolutionary calendar), Napoleon overthrew the Directory in a coup d\'état and installed himself as First Consul — effectively dictator of France. The coup was messy — Napoleon nearly botched his speech to the legislature and had to be rescued by his brother Lucien and loyal grenadiers who cleared the chamber at bayonet point.',
    significance: 'France was exhausted by a decade of revolution, terror, corruption, and military setbacks. Napoleon offered stability and competence. As First Consul, he consolidated power through a new constitution that gave him near-absolute authority while maintaining a democratic facade. A national plebiscite approved the new constitution by an implausibly large margin. Within five years, the Republic would become an Empire and the First Consul would crown himself Emperor.',
  },
};

const EMPIRE_REFORMS = {
  overview: 'Between 1799 and 1804, Napoleon transformed France through reforms so fundamental that many survive to this day. He governed with the same energy and decisiveness he brought to the battlefield, often working 18-hour days and dictating orders to multiple secretaries simultaneously.',
  reforms: [
    { title: 'The Napoleonic Code (Code Civil, 1804)', detail: 'Napoleon\'s most lasting achievement. A comprehensive civil code that replaced the patchwork of feudal, Roman, and revolutionary laws with a single, clear, rational legal system. It established equality before the law, property rights, freedom of religion, and the end of feudal privileges. Napoleon personally presided over many drafting sessions. Today, the Napoleonic Code remains the basis of civil law in over 50 countries — France, Belgium, the Netherlands, Italy, Spain, Portugal, most of Latin America, Louisiana, Quebec, and much of the Middle East and Africa.', icon: '⚖️', color: TEAL },
    { title: 'Bank of France (1800)', detail: 'Created to stabilize France\'s chaotic finances after a decade of revolutionary inflation and economic mismanagement. It regulated the money supply, managed government debt, and established sound currency (the franc germinal). France went from near-bankruptcy to financial stability within a few years. The Bank of France still exists today.', icon: '🏦', color: GOLD },
    { title: 'Meritocracy', detail: 'Napoleon institutionalized the revolutionary principle that careers should be "open to talent" regardless of birth. He promoted generals from humble backgrounds, appointed administrators based on competence, and created the Légion d\'honneur (1802) to reward achievement in military and civil life. "Every soldier carries a marshal\'s baton in his knapsack" became his famous motto — and it was largely true in his army.', icon: '🎖️', color: IMPERIAL_BLUE },
    { title: 'Public Education', detail: 'Napoleon created the lycée system — state-run secondary schools with a standardized national curriculum emphasizing science, mathematics, and French language. He also established the Université impériale to oversee all education in France. The French education system today still bears his imprint. Education was the mechanism for meritocracy: talented boys from any background could rise through the system.', icon: '📚', color: OLIVE },
    { title: 'Infrastructure', detail: 'Napoleon built or improved thousands of kilometers of roads, bridges, and canals across France and the empire. He modernized Paris with new quays, bridges, and the beginnings of the grand boulevards. He ordered the construction of the Arc de Triomphe (completed after his death). These infrastructure projects served both military purposes (rapid troop movement) and economic growth.', icon: '🛤️', color: BRONZE },
    { title: 'Religious Settlement (Concordat of 1801)', detail: 'Napoleon ended a decade of conflict between revolutionary France and the Catholic Church by negotiating a Concordat with Pope Pius VII. Catholicism was recognized as the religion of "the great majority of French citizens" (not the state religion), while the state retained control over church appointments and property. It was a masterful compromise that reconciled Catholics to the new order while preserving revolutionary secularism.', icon: '⛪', color: NAVY },
  ],
  coronation: 'On December 2, 1804, Napoleon crowned himself Emperor of the French at Notre-Dame Cathedral in Paris. Pope Pius VII was present to consecrate the ceremony, but in a calculated act of power, Napoleon took the crown from the Pope\'s hands and placed it on his own head — symbolizing that his authority came from himself and the French people, not from the Church. He then crowned Joséphine as Empress. The message was unmistakable: this was a new kind of emperor, a product of revolution and merit, not divine right.',
};

const MILITARY_GENIUS = {
  overview: 'Napoleon is considered one of the greatest military commanders in history — perhaps the greatest. His innovations in strategy, tactics, and army organization influenced warfare for over a century and are still studied at military academies worldwide. He fought approximately 60 battles, losing only 7.',
  innovations: [
    { title: 'The Corps System', detail: 'Napoleon\'s most important organizational innovation. He divided his army into self-sufficient corps of 15,000–30,000 men, each with its own infantry, cavalry, artillery, and supply train. Corps marched separately along parallel roads (covering a wider front and living off different areas), then concentrated rapidly at the decisive point for battle. This gave Napoleon extraordinary strategic flexibility — any single corps could pin an enemy army long enough for the others to converge and destroy it.', icon: '🏗️', color: IMPERIAL_BLUE },
    { title: 'Speed and Maneuver', detail: 'Napoleon\'s armies moved faster than any in Europe. While his enemies planned methodically, Napoleon struck before they were ready. His soldiers marched 15–20 miles per day (vs. 8–10 for most armies). He used speed to achieve strategic surprise, appearing where the enemy least expected and forcing battle before they could concentrate. "I may lose a battle, but I shall never lose a minute," he said. Speed was his force multiplier.', icon: '⚡', color: GOLD },
    { title: 'The Decisive Point', detail: 'Napoleon\'s tactical hallmark was identifying the decisive point of a battle and concentrating overwhelming force there. He would pin the enemy along their front with diversionary attacks, then hurl his reserve — often the Imperial Guard — at the weakest or most critical point. He called this the "strategy of the central position": getting between separated enemy forces, defeating each in turn before they could unite.', icon: '🎯', color: CRIMSON },
    { title: 'Living Off the Land', detail: 'Napoleon\'s armies carried minimal supplies, foraging from the local countryside instead. This eliminated the need for slow-moving supply trains and allowed his armies to move at unprecedented speed. It worked brilliantly in the rich farmlands of Italy, Germany, and Austria — but proved catastrophic in the barren wastes of Spain and Russia, where there was little to forage and hostile populations destroyed what remained.', icon: '🌾', color: OLIVE },
    { title: 'Artillery Mastery', detail: 'An artillery officer by training, Napoleon used massed cannon fire more effectively than any commander before him. He concentrated his artillery into grande batteries of 50–100 guns to blast holes in enemy lines before sending in infantry and cavalry. At Wagram (1809), he massed 112 guns in a single battery. His famous maxim: "God is on the side of the big battalions" — but he meant it about big batteries.', icon: '💣', color: BRONZE },
    { title: 'Personal Leadership', detail: 'Napoleon led from the front, sharing hardships with his troops and appearing at critical moments to rally wavering units. He knew thousands of his soldiers by name, remembered their service records, and cultivated an almost religious devotion. His presence on the battlefield was worth 40,000 men, according to Wellington. Soldiers who had endured years of brutal campaigning would cheer and charge to their deaths at his command.', icon: '👑', color: GOLD },
  ],
};

const MAJOR_BATTLES: Battle[] = [
  { name: 'Toulon', date: 'September–December 1793', outcome: 'Victory', detail: 'Napoleon\'s first major action. His artillery plan forced the British to evacuate the port. Promoted to brigadier general at 24.', color: OLIVE },
  { name: 'Battle of the Pyramids', date: 'July 21, 1798', outcome: 'Victory', detail: 'Destroyed the Mamluk army outside Cairo using divisional squares against cavalry charges. "Soldiers, forty centuries look down upon you."', color: GOLD },
  { name: 'Marengo', date: 'June 14, 1800', outcome: 'Victory (narrow)', detail: 'Nearly defeated by the Austrians in Italy, saved by Desaix\'s counterattack (Desaix was killed). Secured Napoleon\'s political position as First Consul.', color: CRIMSON },
  { name: 'Austerlitz', date: 'December 2, 1805', outcome: 'Decisive Victory', detail: 'Napoleon\'s masterpiece. Feigned weakness on his right, lured the Allies to attack there, then smashed through their weakened center with Soult\'s corps. The Russo-Austrian army was destroyed. "The Battle of the Three Emperors" ended the Third Coalition.', color: IMPERIAL_BLUE },
  { name: 'Jena-Auerstedt', date: 'October 14, 1806', outcome: 'Decisive Victory', detail: 'Twin battles that annihilated the Prussian army in a single day. Napoleon crushed the main Prussian force at Jena while Davout\'s single corps defeated a larger Prussian army at Auerstedt — one of the greatest feats of arms of the era. Prussia was knocked out of the war in weeks.', color: OLIVE },
  { name: 'Eylau', date: 'February 7–8, 1807', outcome: 'Pyrrhic Victory', detail: 'A brutal, indecisive winter battle against Russia in Poland. 25,000 French casualties. Napoleon was shaken by the carnage — this was a preview of the attrition warfare that would eventually destroy him.', color: SNOW },
  { name: 'Friedland', date: 'June 14, 1807', outcome: 'Decisive Victory', detail: 'Destroyed the Russian army, forcing Tsar Alexander I to sue for peace at Tilsit. Napoleon was at the height of his power — master of continental Europe from the Atlantic to the Vistula.', color: GOLD },
  { name: 'Wagram', date: 'July 5–6, 1809', outcome: 'Victory', detail: 'Massive battle against Austria with 300,000+ combatants. Napoleon broke the Austrian center with a 112-gun grande battery followed by a massed infantry assault. Won, but at heavy cost — the battles were getting bloodier.', color: CRIMSON },
  { name: 'Borodino', date: 'September 7, 1812', outcome: 'Pyrrhic Victory', detail: 'The bloodiest single day of the Napoleonic Wars: 70,000+ casualties. Napoleon battered through Russian defenses but failed to destroy the Russian army, which retreated intact. He took Moscow a week later — but it was empty and soon ablaze.', color: FLAME },
  { name: 'Leipzig ("Battle of the Nations")', date: 'October 16–19, 1813', outcome: 'Decisive Defeat', detail: 'The largest battle in history before World War I: 600,000 combatants, 100,000+ casualties. Napoleon faced the combined armies of Russia, Prussia, Austria, and Sweden. Outnumbered nearly 2:1, he fought for three days before retreating. Leipzig ended Napoleon\'s control of Germany.', color: CRIMSON },
  { name: 'Ligny', date: 'June 16, 1815', outcome: 'Victory', detail: 'Napoleon\'s last victory. He defeated the Prussians under Blücher but failed to pursue and destroy them — a fatal error that allowed the Prussians to march to Waterloo two days later.', color: OLIVE },
  { name: 'Quatre Bras', date: 'June 16, 1815', outcome: 'Inconclusive', detail: 'Ney\'s corps fought Wellington\'s advance guard to a standstill. Ney failed to seize the crossroads quickly, allowing Wellington to fall back to his chosen defensive position at Waterloo.', color: BRONZE },
  { name: 'Waterloo', date: 'June 18, 1815', outcome: 'Decisive Defeat', detail: 'Napoleon\'s final battle. He hurled his army against Wellington\'s ridge all day but could not break through. When Blücher\'s Prussians arrived on his right flank in the late afternoon, the French army collapsed. The Imperial Guard retreated for the first and last time. Napoleon\'s career was over.', color: NAVY },
];

const AUSTERLITZ = {
  overview: 'The Battle of Austerlitz (December 2, 1805) is Napoleon\'s greatest victory and one of the most brilliant tactical performances in military history. It was fought on the first anniversary of his coronation, against the combined armies of Russia and Austria — the Third Coalition.',
  setup: 'Napoleon deliberately appeared weak. He abandoned the dominant Pratzen Heights and pulled back his right flank, making it look vulnerable. He even sent an envoy to the Allied camp requesting an armistice — a calculated deception to convince the Allies he was afraid. The Allied commanders, Tsar Alexander I of Russia and Austrian Emperor Francis I, fell for the trap. They decided to attack Napoleon\'s "weak" right flank to cut him off from Vienna.',
  trap: 'On the morning of December 2, the Allies moved the bulk of their forces south to attack Napoleon\'s right — exactly as he planned. As the Allies descended from the Pratzen Heights, they left the high ground nearly undefended. At the critical moment, Napoleon unleashed Soult\'s corps straight up the center into the now-empty Pratzen Heights. "One sharp blow and the war is over," Napoleon told Soult. The attack split the Allied army in two.',
  result: 'The Allied southern wing, now cut off and with French troops above them on the Heights, was surrounded and destroyed. Many drowned trying to flee across frozen ponds (legend says Napoleon ordered cannon fire to break the ice, though this is disputed). The Allied army lost 36,000 men killed, wounded, or captured — versus 9,000 French. Emperor Francis of Austria sued for peace immediately. Tsar Alexander retreated to Russia. The Third Coalition was shattered. It is still taught at military academies worldwide as a masterclass in deception, timing, and concentration of force.',
};

const GRANDE_ARMEE = {
  overview: 'The Grande Armée was the most powerful military force Europe had seen since the Roman legions. At its peak in 1812, it numbered over 600,000 men — the largest army ever assembled in European history to that point.',
  composition: 'The army that invaded Russia in 1812 was multinational: barely half were French. It included Poles (the largest contingent after France), Germans from the Confederation of the Rhine, Italians, Dutch, Swiss, Spaniards, Croats, Portuguese, and even some Austrians and Prussians (forced allies). This multinational character was both a strength (vast manpower) and a fatal weakness (varying loyalty, language barriers, supply complications).',
  building: 'Napoleon built the Grande Armée through a combination of conscription, revolutionary enthusiasm, and the promise of advancement. Every Frenchman was liable for military service (the levée en masse, introduced during the Revolution). Napoleon refined the system: annual draft classes provided fresh recruits, veterans formed the backbone, and the prospect of promotion attracted ambitious men from all classes. The army was organized into the revolutionary corps system, with each corps capable of independent action.',
  eliteUnits: [
    { title: 'The Imperial Guard (La Garde Impériale)', detail: 'The elite of the elite — 50,000+ hand-picked veterans who served as Napoleon\'s personal reserve. The Old Guard (Vieille Garde) had to have served 10+ years with distinguished records. They were the best-paid, best-equipped troops in Europe and were only committed at the decisive moment of a battle. At Waterloo, when the Guard retreated, the cry "La Garde recule!" (The Guard falls back!) shattered the army\'s morale.', color: IMPERIAL_BLUE },
    { title: 'The Chasseurs à Cheval', detail: 'Light cavalry that served as Napoleon\'s personal escort and scouts. The Chasseurs of the Guard rode with Napoleon himself and were among the most decorated units in the army.', color: OLIVE },
    { title: 'The Cuirassiers', detail: 'Heavy cavalry wearing steel breastplates (cuirasses), mounted on the largest horses in Europe. They were the shock troops of Napoleonic warfare, used for devastating charges against weakened infantry. At Waterloo, 5,000 French cuirassiers charged Wellington\'s infantry squares in one of the most famous cavalry actions in history — and were repulsed with terrible losses.', color: BRONZE },
    { title: 'The Voltigeurs', detail: 'Elite light infantry skirmishers who fought ahead of the main line, harassing enemy formations with accurate musket fire. Each infantry regiment had a voltigeur company, and the best were selected for the Guard Voltigeurs.', color: OLIVE },
  ],
};

const COALITIONS = {
  overview: 'Between 1792 and 1815, Europe formed seven coalitions against revolutionary and Napoleonic France. For over two decades, the combined might of Britain, Russia, Prussia, Austria, and numerous smaller states struggled to defeat a single nation. The coalitions kept losing because they were poorly coordinated, fought for divergent aims, and faced a military genius with a unified command.',
  list: [
    { name: 'First Coalition (1792–97)', detail: 'Austria, Prussia, Britain, Spain, and others vs. Revolutionary France. France won through mass conscription and revolutionary fervor. Napoleon\'s Italian Campaign (1796–97) knocked Austria out.', color: OLIVE },
    { name: 'Second Coalition (1798–1802)', detail: 'Britain, Austria, Russia, Ottoman Empire vs. France. Initially successful — Suvorov drove the French from Italy — but Napoleon returned from Egypt, won Marengo, and forced peace at Amiens (1802).', color: TEAL },
    { name: 'Third Coalition (1805)', detail: 'Britain, Austria, Russia, Sweden vs. France. Shattered by Napoleon\'s Austerlitz masterpiece. Austria humiliated, Russia retreated, the Holy Roman Empire dissolved.', color: IMPERIAL_BLUE },
    { name: 'Fourth Coalition (1806–07)', detail: 'Prussia, Russia, Britain, Sweden vs. France. Prussia destroyed at Jena-Auerstedt in a single day. Russia beaten at Friedland. Napoleon and Tsar Alexander divided Europe at Tilsit.', color: GOLD },
    { name: 'Fifth Coalition (1809)', detail: 'Austria and Britain vs. France. Austria tried again while Napoleon was bogged down in Spain. Napoleon won at Wagram but at heavy cost. Austria forced to become a French ally.', color: CRIMSON },
    { name: 'Sixth Coalition (1813–14)', detail: 'Russia, Prussia, Austria, Britain, Sweden, and Spain vs. France. After the Russian disaster, all of Europe united. Leipzig destroyed Napoleon\'s German empire. The Allies invaded France and took Paris. Napoleon abdicated and was exiled to Elba.', color: FLAME },
    { name: 'Seventh Coalition (1815)', detail: 'All of Europe vs. Napoleon after his escape from Elba. Ended at Waterloo in 100 days. The final coalition defeated Napoleon for the last time.', color: NAVY },
  ],
  whyLost: 'Europe kept losing because: (1) the coalitions were loose alliances with conflicting goals — Austria and Prussia distrusted each other as much as they feared Napoleon; (2) they could never match Napoleon\'s speed of decision and unity of command; (3) Napoleon defeated them in detail, knocking out one ally at a time before they could coordinate. They finally won when they learned to: (a) avoid fighting Napoleon personally (the "Trachtenberg Plan" of 1813 — attack his marshals, retreat before Napoleon himself); (b) coordinate their massive numerical superiority; (c) fight simultaneously on multiple fronts (Spain, Germany, Russia); and (d) keep reforming coalitions no matter how many times they lost.',
};

const CONTINENTAL_SYSTEM = {
  overview: 'The Continental System was Napoleon\'s attempt to defeat Britain through economic warfare. Unable to invade Britain (the Royal Navy made that impossible after Trafalgar in 1805), Napoleon decreed in the Berlin Decree (1806) that all European ports must close to British trade. The idea was to destroy the British economy by cutting off their largest export market.',
  whyFailed: 'The Continental System backfired for several reasons: (1) Britain controlled the seas and could trade with the rest of the world — the Americas, India, Asia; (2) European economies depended on British manufactured goods and colonial products (coffee, sugar, cotton) — enforcing the blockade caused economic hardship across the continent and bred resentment against Napoleon; (3) Smuggling was rampant and virtually impossible to stop along thousands of miles of coastline; (4) Russia\'s refusal to enforce the system was a direct cause of Napoleon\'s catastrophic 1812 invasion; (5) The system drove Portugal and eventually Spain into Britain\'s arms, opening the "Spanish Ulcer" that drained French resources.',
  irony: 'The ultimate irony: the Continental System, designed to strangle Britain, instead strangled Napoleon\'s own empire. It turned potential allies into enemies, provoked the ruinous Russian campaign, and kept the "Spanish Ulcer" festering. Britain, meanwhile, merely redirected trade to other markets and emerged economically stronger.',
};

const RUSSIAN_CAMPAIGN = {
  overview: 'The Russian Campaign of 1812 was the turning point that destroyed Napoleon\'s empire. It was the greatest military disaster in modern history to that point.',
  reasons: 'Napoleon invaded Russia for several reasons: Tsar Alexander I had withdrawn from the Continental System (devastating to Russia\'s economy), resumed trade with Britain, and was building a potential anti-French coalition. Napoleon also resented Alexander\'s refusal to support a marriage alliance. But the fundamental cause was that the Continental System could not work if Russia defied it — and enforcing the system required controlling all of Europe.',
  invasion: 'On June 24, 1812, Napoleon crossed the Niemen River with approximately 600,000 men and over 200,000 horses — the largest army ever assembled in Europe. It was multinational: roughly 300,000 French, with the rest drawn from Poland, Germany, Italy, Austria, and other vassal states.',
  russianStrategy: 'The Russians, under generals Barclay de Tolly and then Kutuzov, refused to give Napoleon the decisive battle he needed. They retreated deep into Russia, employing scorched-earth tactics: burning crops, poisoning wells, destroying bridges, and removing anything the French could use. Napoleon\'s strategy of living off the land — so successful in rich western Europe — became a death sentence in the vastness of Russia.',
  borodino: 'The Battle of Borodino (September 7, 1812) was the bloodiest single day of the Napoleonic Wars: over 70,000 casualties. Napoleon won a tactical victory but failed to destroy the Russian army, which retreated in good order. He later said: "The most terrible of all my battles was the one before Moscow. The French showed themselves worthy of victory, and the Russians showed themselves worthy of being invincible."',
  moscow: 'Napoleon entered Moscow on September 14, 1812 — and found it abandoned. That night, fires broke out across the city (likely set by the Russians on Governor Rostopchin\'s orders). Moscow burned for five days, destroying three-quarters of the city. Napoleon waited five weeks in the ruins for a peace offer that never came. Alexander I, strengthened by his generals and the Orthodox Church, refused all negotiations.',
  retreat: 'Napoleon began the retreat from Moscow on October 19, 1812. It became one of the most horrific episodes in military history. The army followed the devastated road it had already stripped bare. Temperatures dropped to -30°C. Horses died by the thousands, followed by men. Cossacks and Russian regulars harassed the retreating columns constantly. The crossing of the Berezina River (November 26–29) saw thousands drown or freeze in the icy water while fighting off Russian attacks.',
  aftermath: 'Of the approximately 600,000 who entered Russia, fewer than 100,000 combat-effective troops returned. Perhaps 200,000 more straggled back as prisoners, deserters, or wounded over the following months. The Grande Armée was destroyed. More importantly, the myth of Napoleon\'s invincibility was shattered. Prussia and Austria would soon turn against him, and the Sixth Coalition would drive him from power.',
};

const SPANISH_ULCER = {
  overview: 'Napoleon called the Peninsular War (1808–1814) his "Spanish Ulcer" — and it was. The occupation of Spain and Portugal became a six-year guerrilla nightmare that drained over 300,000 French troops, cost hundreds of thousands of casualties, and gave Britain a permanent continental bridgehead.',
  origins: 'In 1808, Napoleon deposed the Spanish Bourbon monarchy and placed his brother Joseph on the throne. He expected easy compliance — instead, the Spanish people erupted in a nationwide insurgency. The word "guerrilla" (little war) entered the language from this conflict.',
  guerrilla: 'Spanish guerrillas made French-occupied Spain ungovernable. Partisan bands ambushed convoys, assassinated couriers, tortured prisoners, and vanished into the mountains. The French controlled the cities; the guerrillas controlled the countryside. Every French soldier sent to maintain order was one less soldier available for Napoleon\'s other campaigns. The brutality was mutual — Goya\'s "Disasters of War" etchings capture the horror on both sides.',
  wellington: 'The Duke of Wellington (then Sir Arthur Wellesley) landed in Portugal in 1808 and spent six years methodically pushing the French back. Supplied by the Royal Navy, sheltered behind the impregnable Lines of Torres Vedras outside Lisbon, and supported by Spanish and Portuguese allies, Wellington fought a patient war of attrition that France could not win. By 1813, he had driven the French out of Spain entirely and invaded southern France.',
  cost: 'The Peninsular War cost France an estimated 300,000 casualties and tied down 200,000–350,000 troops at any given time — troops Napoleon desperately needed in central Europe. It proved that Napoleon\'s empire was overextended and that occupied peoples would not accept French rule. Wellington\'s victory also demonstrated that the French could be beaten consistently by a well-led, well-supplied army.',
};

const KEY_RELATIONSHIPS: Figure[] = [
  { name: 'Joséphine de Beauharnais', dates: '1763–1814', role: 'First wife; Empress of the French (1804–1810)', contribution: 'The love of Napoleon\'s life, divorced because she could not produce an heir', detail: 'Joséphine was a Creole widow from Martinique, six years Napoleon\'s senior, with two children from her first marriage. Napoleon fell passionately in love with her, writing letters of extraordinary intensity during his Italian Campaign. Their marriage was tempestuous — she was unfaithful early on, he was devastated, and the balance of power shifted as Napoleon grew more powerful. Despite deep love on both sides, Napoleon divorced her in 1809 because she could not bear him an heir. At the divorce ceremony, both wept. Joséphine kept her title and estates. Napoleon said on St. Helena: "I truly loved my Joséphine — but I did not respect her."', icon: '💐', color: CRIMSON },
  { name: 'Marie-Louise of Austria', dates: '1791–1847', role: 'Second wife; Empress of the French (1810–1814)', contribution: 'Married Napoleon for dynastic reasons; bore his heir, Napoleon II', detail: 'The daughter of Austrian Emperor Francis I — a Habsburg princess given in marriage to legitimize Napoleon\'s dynasty and cement the Franco-Austrian alliance. She bore Napoleon a son (Napoleon II, "King of Rome") in 1811. Marie-Louise never joined Napoleon in exile and eventually became Duchess of Parma under Austrian protection. Their marriage was political, not passionate — but Napoleon was reportedly a devoted, even tender husband.', icon: '👑', color: GOLD },
  { name: 'Napoleon II ("L\'Aiglon")', dates: '1811–1832', role: 'Son; King of Rome; Duke of Reichstadt', contribution: 'Napoleon\'s heir who never ruled — died of tuberculosis at 21', detail: 'Napoleon\'s only legitimate son, known as "L\'Aiglon" (The Eaglet). Proclaimed King of Rome at birth, he was taken to Austria after Napoleon\'s fall and raised as an Austrian prince under the title Duke of Reichstadt. Napoleon\'s partisans briefly declared him Napoleon II during the 1815 abdication, but he never exercised power. He died of tuberculosis in Vienna at 21, effectively ending the direct Bonaparte succession. Napoleon never saw his son after leaving for Waterloo.', icon: '🦅', color: IMPERIAL_BLUE },
  { name: 'Marshal Michel Ney', dates: '1769–1815', role: '"The Bravest of the Brave"', contribution: 'Napoleon\'s most famous marshal; led the rearguard in the Russian retreat; executed after Waterloo', detail: 'A red-haired, fiery son of a barrel-maker who became one of the greatest cavalry and infantry commanders of the era. Ney earned his reputation through insane personal bravery — leading charges, rallying broken troops, having horses shot under him. During the retreat from Moscow, he commanded the rearguard with superhuman courage, keeping the remnants of the army alive. He rallied to Napoleon during the Hundred Days but was captured after Waterloo, tried for treason, and executed by firing squad. He reportedly refused a blindfold and gave the order to fire himself.', icon: '⚔️', color: CRIMSON },
  { name: 'Marshal Louis-Nicolas Davout', dates: '1770–1823', role: 'The "Iron Marshal"', contribution: 'Napoleon\'s most reliable commander; never lost a battle', detail: 'Davout was the intellectual marshal — bald, bespectacled, austere, and the finest tactical mind among Napoleon\'s subordinates. At Auerstedt (1806), his single corps of 27,000 defeated the main Prussian army of 50,000 — one of the most remarkable feats of the era. He was the only marshal Napoleon fully trusted with independent command. Stern and disciplined, he was feared by his own troops but never beaten by an enemy.', icon: '🗡️', color: IMPERIAL_BLUE },
  { name: 'Marshal Nicolas Soult', dates: '1769–1851', role: 'Marshal of the Empire; later Prime Minister of France', contribution: 'Key commander at Austerlitz; fought Wellington in Spain; served three post-Napoleonic regimes', detail: 'Soult led the decisive assault on the Pratzen Heights at Austerlitz — the blow that won Napoleon\'s greatest victory. He spent most of the Peninsular War fighting Wellington in Spain with mixed results. A pragmatic survivor, he served under Napoleon, then the Bourbons, then the July Monarchy, eventually becoming Prime Minister. Wellington, meeting him at Queen Victoria\'s coronation, reportedly said: "I have you at last."', icon: '🎖️', color: OLIVE },
  { name: 'Marshal Joachim Murat', dates: '1767–1815', role: 'King of Naples; greatest cavalry commander of the era', contribution: 'Napoleon\'s brother-in-law; legendary cavalry leader; King of Naples', detail: 'The son of an innkeeper, Murat became the most flamboyant and daring cavalry commander in history. He led the decisive cavalry charge at Austerlitz, the charge at Eylau that saved the army, and countless other actions. He married Napoleon\'s sister Caroline and was made King of Naples. But he betrayed Napoleon in 1814, then rejoined him in 1815, then tried to reclaim Naples and was captured and shot. His last words, to the firing squad: "Soldiers, save my face. Aim for my heart. Fire!"', icon: '🏇', color: GOLD },
];

const ELBA_AND_HUNDRED_DAYS = {
  firstExile: 'After the Sixth Coalition captured Paris in March 1814, Napoleon\'s marshals refused to fight on (Ney famously told him: "The army will obey its generals"). Napoleon abdicated on April 6, 1814, and was exiled to Elba, a small Mediterranean island off the coast of Tuscany. In a remarkable concession, he was allowed to keep his title of Emperor and given sovereignty over Elba with 600 guards. The Bourbons were restored to the French throne under Louis XVIII.',
  escape: 'Napoleon escaped Elba on February 26, 1815, landing in southern France with about 1,000 men. What followed was one of the most dramatic episodes in history. As he marched north toward Paris, Louis XVIII sent regiment after regiment to stop him. At Laffrey, near Grenoble, Napoleon walked alone toward a royalist battalion, threw open his coat, and said: "Soldiers, if there is one among you who would shoot his Emperor, here I am." The soldiers rushed forward shouting "Vive l\'Empereur!" and joined him. Every unit sent to stop him defected. Ney, who had promised Louis XVIII to bring Napoleon back "in an iron cage," met Napoleon and burst into tears of loyalty. Louis XVIII fled Paris on March 19, and Napoleon entered the Tuileries Palace on March 20, exactly 20 days after landing.',
  hundredDays: 'Napoleon had 100 days to rebuild his army and face the combined forces of all Europe. He moved with characteristic speed, raising an army of 200,000 and marching into Belgium to defeat the British and Prussians before the Austrians and Russians could arrive. It was his last gamble — and it nearly worked.',
};

const WATERLOO = {
  context: 'The Waterloo Campaign (June 15–18, 1815) was Napoleon\'s final military operation. He aimed to defeat the Anglo-Allied army under Wellington and the Prussian army under Blücher separately before the Austrians and Russians could arrive — the classic Napoleonic strategy of defeating enemies in detail.',
  whatWentWrong: [
    { title: 'The Late Start', detail: 'Napoleon delayed the start of the battle until 11:30 AM on June 18, waiting for the muddy ground to dry so his artillery could be effective. Those lost hours proved fatal — they gave Blücher\'s Prussians time to march to the battlefield.', icon: '⏰', color: BRONZE },
    { title: 'Wellington\'s Defense', detail: 'Wellington chose his ground carefully: a ridge near the village of Waterloo with a sunken road along the crest. His infantry sheltered on the reverse slope, protected from French artillery. Wellington\'s multinational army (British, Dutch, Belgian, Hanoverian, and Brunswick troops) held the ridge all day against repeated French attacks.', icon: '🛡️', color: IMPERIAL_BLUE },
    { title: 'Ney\'s Premature Cavalry Charges', detail: 'Marshal Ney, seeing what he thought was a British retreat (actually wounded being evacuated), launched 5,000 cavalry against Wellington\'s unbroken infantry squares without infantry or artillery support. The charges were magnificent and futile — the cavalry swirled around the squares for two hours but could not break them. It was one of the greatest tactical errors of the war.', icon: '🏇', color: CRIMSON },
    { title: 'Grouchy\'s Failure', detail: 'Napoleon had detached Marshal Grouchy with 33,000 men to pursue the Prussians after Ligny and prevent them from joining Wellington. Grouchy followed the wrong Prussian corps and, despite hearing the guns of Waterloo, did not march to the sound of the guns. The Prussians arrived; Grouchy did not.', icon: '🧭', color: OLIVE },
    { title: 'The Prussian Arrival', detail: 'From 4:30 PM onward, Blücher\'s Prussians began arriving on Napoleon\'s right flank in ever-increasing numbers. Napoleon had to divert more and more troops to contain them, weakening his main assault on Wellington. By evening, 50,000 Prussians were on the field.', icon: '⚡', color: NAVY },
    { title: 'The Guard Retreats', detail: 'At 7:30 PM, Napoleon committed his last reserve — the Imperial Guard — in a final assault on Wellington\'s center. British Guards and the 52nd Light Infantry rose from the ground and poured devastating fire into the Guard\'s flanks. For the first and only time in its history, the Imperial Guard broke and retreated. The cry "La Garde recule!" spread through the French army like wildfire. Panic set in. The army disintegrated.', icon: '💀', color: CRIMSON },
  ],
  aftermath: 'Wellington called it "the nearest-run thing you ever saw in your life." Napoleon lost 25,000 killed and wounded, 8,000 captured. He fled to Paris, abdicated on June 22, and surrendered to the British on July 15. The Hundred Days were over. Europe celebrated. Napoleon would never command an army again.',
};

const ST_HELENA = {
  exile: 'Napoleon was exiled to Saint Helena, a remote volcanic island in the South Atlantic, 1,200 miles from the nearest land. The British were taking no chances this time. He was guarded by 2,000 soldiers, a naval squadron, and the iron will of Governor Sir Hudson Lowe, whose petty restrictions infuriated Napoleon. He lived at Longwood House, a damp and drafty building plagued by rats.',
  finalYears: 'On St. Helena, Napoleon dictated his memoirs, carefully crafting his legend for posterity. He portrayed himself as the champion of revolutionary ideals, the liberator of Europe, brought down by the jealousy and perfidy of kings. He played chess, gardened, argued with Hudson Lowe, and gradually wasted away. His health declined from 1818 onward, likely from stomach cancer (the same disease that killed his father).',
  death: 'Napoleon died on May 5, 1821, at age 51. His last words were reportedly: "France, the Army, head of the Army, Joséphine." An autopsy attributed the cause to stomach cancer. However, traces of arsenic found in his hair samples in the 1960s sparked enduring conspiracy theories about poisoning — though modern analysis suggests the arsenic came from the green wallpaper at Longwood (which contained arsenic-based pigments) or from arsenic-based medicines common at the time.',
  legend: 'In death, Napoleon became more powerful than in life. His memoirs, published posthumously, shaped the "Napoleonic legend" — the image of a brilliant, modern ruler brought down by the reactionary forces of old Europe. His remains were returned to France in 1840 with enormous ceremony and interred in Les Invalides in Paris, where they remain today under a massive red porphyry sarcophagus. The legend fed French nationalism, inspired Napoleon III\'s Second Empire, and ensured that Napoleon would remain one of the most famous people in history.',
};

const LEGACY = [
  { title: 'The Napoleonic Code', detail: 'Napoleon\'s most enduring legacy. The Code Civil of 1804 rationalized law, established equality before the law, protected property rights, and ended feudal privileges. It became the model for civil law systems worldwide — today over 50 countries base their legal codes on Napoleonic principles, including most of Europe, Latin America, the Middle East, and parts of Asia and Africa. "My true glory is not to have won forty battles," Napoleon said. "What nothing will destroy, what will live forever, is my Civil Code."', icon: '⚖️', color: TEAL },
  { title: 'Nationalism Unleashed', detail: 'This is Napoleon\'s great irony. He wanted a unified Europe under French hegemony — but by conquering and occupying so many nations, he ignited the very force that would destroy his empire: nationalism. German nationalism was born in resistance to Napoleon. Italian unification was inspired by the idea of self-determination he inadvertently spread. Polish nationalism was revived by his creation of the Duchy of Warsaw. Spanish national identity was forged in the guerrilla war against French occupation. The 19th-century "Age of Nationalism" that reshaped Europe traces directly to Napoleon.', icon: '🏴', color: CRIMSON },
  { title: 'Military Doctrine', detail: 'Napoleon\'s tactics, strategy, and operational art are still studied at every major military academy in the world — West Point, Sandhurst, Saint-Cyr. His corps system became the standard for all modern armies. His principles of concentration of force, central position, and rapid maneuver influenced Clausewitz (who fought against him), Jomini (who fought for and then against him), and through them every military thinker who followed. Grant, Lee, Moltke, Schlieffen, Patton, and Rommel all studied Napoleon.', icon: '🎓', color: IMPERIAL_BLUE },
  { title: 'The End of the Old Order', detail: 'Napoleon dismantled the Holy Roman Empire (which had lasted since 800 CE), reorganized Germany into the Confederation of the Rhine, abolished feudalism wherever he conquered, and spread the principles of the French Revolution — equality before the law, meritocracy, religious tolerance, rationalized administration. Even after his defeat, the Congress of Vienna could not fully restore the old order. The genie of revolutionary change was out of the bottle.', icon: '🔥', color: FLAME },
  { title: 'The "Napoleon Complex" Myth', detail: 'Napoleon was not short. He was approximately 5\'7" (170 cm) — average or slightly above average for Frenchmen of his era. The myth of his shortness was primarily British propaganda, fueled by: (1) confusion between French inches (which were longer than British inches — his French measurement of 5\'2" converted to roughly 5\'7" in British units); (2) his nickname "le petit caporal" (the little corporal), which was a term of affection, not a description of his size; (3) the fact that his Imperial Guard were all required to be tall, making him look short by comparison; and (4) James Gillray\'s devastating British caricatures depicting him as a tiny, strutting figure.', icon: '📏', color: BRONZE },
  { title: 'Modern France', detail: 'Napoleon\'s administrative reforms shaped the France that exists today. The prefectoral system of regional administration, the lycée secondary school system, the Banque de France, the Légion d\'honneur, the metric system\'s adoption in France, the Cour des comptes (national audit office), the Conseil d\'État (Council of State) — all are Napoleonic creations still functioning today. France\'s centralized, bureaucratic state is essentially Napoleon\'s design.', icon: '🇫🇷', color: IMPERIAL_BLUE },
];

/* ───────── Helper Components ───────── */

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: `${IMPERIAL_BLUE}15`, border: `1px solid ${IMPERIAL_BLUE}33`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: GOLD, fontFamily: 'monospace' }}>{value}</div>
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
        border: `1px solid ${active ? IMPERIAL_BLUE : CARD_BORDER}`,
        backgroundColor: active ? `${IMPERIAL_BLUE}22` : 'transparent',
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
  { key: 'overview', label: 'Overview', icon: '🏛️' },
  { key: 'rise', label: 'Origins & Rise', icon: '⭐' },
  { key: 'empire', label: 'Empire & Reforms', icon: '⚖️' },
  { key: 'military', label: 'Military Genius', icon: '🎯' },
  { key: 'battles', label: 'Battles', icon: '⚔️' },
  { key: 'grandearmee', label: 'Grande Armée', icon: '🏗️' },
  { key: 'coalitions', label: 'Coalitions', icon: '🌍' },
  { key: 'russia', label: 'Russian Campaign', icon: '❄️' },
  { key: 'spain', label: 'Spanish Ulcer', icon: '🔥' },
  { key: 'relationships', label: 'Key Relationships', icon: '👤' },
  { key: 'waterloo', label: 'Waterloo', icon: '💥' },
  { key: 'exile', label: 'Exile & Death', icon: '🏝️' },
  { key: 'legacy', label: 'Legacy', icon: '🌐' },
];

/* ───────── Main Component ───────── */

export default function NapoleonPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('overview');
  const [expandedFigure, setExpandedFigure] = useState<string | null>(null);
  const [expandedBattle, setExpandedBattle] = useState<string | null>(null);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: BG, color: TEXT, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* ─── Hero ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ padding: '48px 32px 36px', borderBottom: `1px solid ${CARD_BORDER}`, background: `linear-gradient(135deg, ${BG} 0%, rgba(26,82,118,0.10) 100%)` }}>
          <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '4px 0' }}>&larr; Back to Timeline</Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: `${IMPERIAL_BLUE}20`, border: `2px solid ${IMPERIAL_BLUE}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: `0 0 24px ${IMPERIAL_BLUE}30` }}>🦅</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, backgroundColor: `${IMPERIAL_BLUE}20`, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Deep Dive</span>
          </div>

          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 800, color: TEXT, lineHeight: 1.15, marginBottom: 14 }}>
            Napoleon Bonaparte &mdash; The Man Who Remade Europe{' '}
            <span style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 400, color: TEXT_DIM }}>(1769&ndash;1821)</span>
          </h1>

          <p style={{ fontSize: 15, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 20, maxWidth: 750 }}>
            A Corsican outsider who seized control of revolutionary France, crowned himself Emperor, rewrote European law, won 50+ battles, built the largest empire since Rome &mdash; and was finally brought down by the combined might of every other European power.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <StatBadge value="50+" label="Battles Won" />
            <StatBadge value="50+" label="Countries (Code)" />
            <StatBadge value="600K" label="Grande Armée" />
            <StatBadge value="1815" label="Final Defeat" />
          </div>
        </motion.div>

        {/* ─── Tabs ─── */}
        <div style={{ padding: '16px 32px', borderBottom: `1px solid ${CARD_BORDER}`, display: 'flex', flexWrap: 'wrap', gap: 6, position: 'sticky', top: 0, backgroundColor: BG, zIndex: 10 }}>
          {SECTION_TABS.map(t => (
            <TabButton key={t.key} label={t.label} icon={t.icon} active={activeTab === t.key} onClick={() => setActiveTab(t.key)} />
          ))}
        </div>

        {/* ─── Content ─── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} style={{ padding: '28px 32px 64px' }}>

            {/* ════════ OVERVIEW ════════ */}
            {activeTab === 'overview' && (
              <div>
                <SectionHeader icon="🏛️" title="Napoleon Bonaparte — An Overview" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 24 }}>{OVERVIEW_TEXT}</p>
                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, marginBottom: 8 }}>Key Insight</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>
                    Napoleon was not short. At roughly 5&rsquo;7&rdquo; (170 cm), he was average or slightly above average for his era. The &ldquo;Napoleon complex&rdquo; myth was British propaganda &mdash; fueled by confusion between French and British inches, his nickname &ldquo;le petit caporal&rdquo; (a term of affection), his tall Imperial Guard making him look short by comparison, and James Gillray&rsquo;s devastating caricatures.
                  </p>
                </div>
              </div>
            )}

            {/* ════════ ORIGINS & RISE ════════ */}
            {activeTab === 'rise' && (
              <div>
                <SectionHeader icon="⭐" title="Origins & Rise to Power" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 24 }}>{ORIGINS.overview}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Outsider</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 24 }}>{ORIGINS.outsider}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Toulon and the First Taste of Glory</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 24 }}>{ORIGINS.toulon}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Italian Campaign (1796–97)</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 8 }}>{RISE.italy.overview}</p>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${OLIVE}33`, backgroundColor: `${OLIVE}08`, marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: OLIVE, marginBottom: 4 }}>Why It Mattered</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{RISE.italy.significance}</p>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Egypt (1798–99)</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 8 }}>{RISE.egypt.overview}</p>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08`, marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, marginBottom: 4 }}>The Real Prize</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{RISE.egypt.significance}</p>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Coup of 18 Brumaire (1799)</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 8 }}>{RISE.brumaire.overview}</p>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${IMPERIAL_BLUE}33`, backgroundColor: `${IMPERIAL_BLUE}08` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: IMPERIAL_BLUE, marginBottom: 4 }}>From Republic to Empire</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{RISE.brumaire.significance}</p>
                </div>
              </div>
            )}

            {/* ════════ EMPIRE & REFORMS ════════ */}
            {activeTab === 'empire' && (
              <div>
                <SectionHeader icon="⚖️" title="The Empire & Napoleonic Reforms (1799–1804)" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 24 }}>{EMPIRE_REFORMS.overview}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 14 }}>The Reforms That Reshaped Europe</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  {EMPIRE_REFORMS.reforms.map((r, i) => (
                    <div key={i} style={{ padding: 16, borderRadius: 10, border: `1px solid ${r.color}33`, backgroundColor: `${r.color}08`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{r.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{r.title}</div>
                        <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{r.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Coronation (December 2, 1804)</h3>
                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08` }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{EMPIRE_REFORMS.coronation}</p>
                </div>
              </div>
            )}

            {/* ════════ MILITARY GENIUS ════════ */}
            {activeTab === 'military' && (
              <div>
                <SectionHeader icon="🎯" title="What Made Napoleon's Tactics Revolutionary" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 24 }}>{MILITARY_GENIUS.overview}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {MILITARY_GENIUS.innovations.map((inn, i) => (
                    <div key={i} style={{ padding: 16, borderRadius: 10, border: `1px solid ${inn.color}33`, backgroundColor: `${inn.color}08`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{inn.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{inn.title}</div>
                        <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{inn.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════ BATTLES ════════ */}
            {activeTab === 'battles' && (
              <div>
                <SectionHeader icon="⚔️" title="Major Battles" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 20 }}>Napoleon fought approximately 60 battles, losing only 7. Here are the most significant.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {MAJOR_BATTLES.map(b => {
                    const isOpen = expandedBattle === b.name;
                    return (
                      <div
                        key={b.name}
                        style={{ padding: 16, borderRadius: 10, border: `1px solid ${b.color}33`, backgroundColor: `${b.color}08`, cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={() => setExpandedBattle(isOpen ? null : b.name)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: b.outcome.includes('Defeat') ? CRIMSON : b.outcome.includes('Pyrrhic') ? FLAME : OLIVE, flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{b.name} <span style={{ fontSize: 12, fontWeight: 400, color: TEXT_MUTED }}>({b.date})</span></div>
                            <div style={{ fontSize: 12, color: b.outcome.includes('Defeat') ? CRIMSON : b.outcome.includes('Pyrrhic') ? FLAME : TEAL, fontWeight: 600 }}>{b.outcome}</div>
                          </div>
                          <span style={{ fontSize: 12, color: TEXT_MUTED, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>&#9660;</span>
                        </div>
                        {isOpen && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${b.color}22` }}>
                            <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{b.detail}</p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Austerlitz Breakdown */}
                <div style={{ padding: 24, borderRadius: 12, border: `1px solid ${IMPERIAL_BLUE}33`, backgroundColor: `${IMPERIAL_BLUE}08` }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, marginBottom: 12 }}>Austerlitz — The Masterpiece (December 2, 1805)</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 16 }}>{AUSTERLITZ.overview}</p>

                  <h4 style={{ fontSize: 14, fontWeight: 700, color: GOLD, marginBottom: 6 }}>The Setup: Feigned Weakness</h4>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 14 }}>{AUSTERLITZ.setup}</p>

                  <h4 style={{ fontSize: 14, fontWeight: 700, color: CRIMSON, marginBottom: 6 }}>The Trap</h4>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 14 }}>{AUSTERLITZ.trap}</p>

                  <h4 style={{ fontSize: 14, fontWeight: 700, color: TEAL, marginBottom: 6 }}>The Result</h4>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{AUSTERLITZ.result}</p>
                </div>
              </div>
            )}

            {/* ════════ GRANDE ARMÉE ════════ */}
            {activeTab === 'grandearmee' && (
              <div>
                <SectionHeader icon="🏗️" title="The Grande Armée" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 20 }}>{GRANDE_ARMEE.overview}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Composition</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 20 }}>{GRANDE_ARMEE.composition}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>How It Was Built</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 20 }}>{GRANDE_ARMEE.building}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Elite Units</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {GRANDE_ARMEE.eliteUnits.map((u, i) => (
                    <div key={i} style={{ padding: 16, borderRadius: 10, border: `1px solid ${u.color}33`, backgroundColor: `${u.color}08` }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{u.title}</div>
                      <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{u.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════ COALITIONS ════════ */}
            {activeTab === 'coalitions' && (
              <div>
                <SectionHeader icon="🌍" title="Seven Coalitions Against Napoleon" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 20 }}>{COALITIONS.overview}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  {COALITIONS.list.map((c, i) => (
                    <div key={i} style={{ padding: 16, borderRadius: 10, border: `1px solid ${c.color}33`, backgroundColor: `${c.color}08` }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{c.name}</div>
                      <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{c.detail}</p>
                    </div>
                  ))}
                </div>

                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08`, marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, marginBottom: 8 }}>Why Europe Kept Losing — Then Won</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{COALITIONS.whyLost}</p>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Continental System</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 12 }}>{CONTINENTAL_SYSTEM.overview}</p>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${NAVY}33`, backgroundColor: `${NAVY}08`, marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Why It Backfired</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{CONTINENTAL_SYSTEM.whyFailed}</p>
                </div>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${CRIMSON}33`, backgroundColor: `${CRIMSON}08` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: CRIMSON, marginBottom: 4 }}>The Ultimate Irony</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{CONTINENTAL_SYSTEM.irony}</p>
                </div>
              </div>
            )}

            {/* ════════ RUSSIAN CAMPAIGN ════════ */}
            {activeTab === 'russia' && (
              <div>
                <SectionHeader icon="❄️" title="The Russian Campaign (1812)" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 20 }}>{RUSSIAN_CAMPAIGN.overview}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Why Napoleon Invaded</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 20 }}>{RUSSIAN_CAMPAIGN.reasons}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Invasion</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 20 }}>{RUSSIAN_CAMPAIGN.invasion}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Russian Strategy: Scorched Earth</h3>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${OLIVE}33`, backgroundColor: `${OLIVE}08`, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{RUSSIAN_CAMPAIGN.russianStrategy}</p>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Borodino — The Bloodiest Day</h3>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${CRIMSON}33`, backgroundColor: `${CRIMSON}08`, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{RUSSIAN_CAMPAIGN.borodino}</p>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Moscow Burns</h3>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${FLAME}33`, backgroundColor: `${FLAME}08`, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{RUSSIAN_CAMPAIGN.moscow}</p>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Retreat — Hell on Earth</h3>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${SNOW}33`, backgroundColor: `${SNOW}08`, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{RUSSIAN_CAMPAIGN.retreat}</p>
                </div>

                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${NAVY}33`, backgroundColor: `${NAVY}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 8 }}>The Aftermath</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{RUSSIAN_CAMPAIGN.aftermath}</p>
                </div>
              </div>
            )}

            {/* ════════ SPANISH ULCER ════════ */}
            {activeTab === 'spain' && (
              <div>
                <SectionHeader icon="🔥" title="The &quot;Spanish Ulcer&quot; (1808–1814)" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 20 }}>{SPANISH_ULCER.overview}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Origins</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 20 }}>{SPANISH_ULCER.origins}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Guerrilla Warfare</h3>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${CRIMSON}33`, backgroundColor: `${CRIMSON}08`, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{SPANISH_ULCER.guerrilla}</p>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Wellington in the Peninsula</h3>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${IMPERIAL_BLUE}33`, backgroundColor: `${IMPERIAL_BLUE}08`, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{SPANISH_ULCER.wellington}</p>
                </div>

                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${FLAME}33`, backgroundColor: `${FLAME}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: FLAME, marginBottom: 8 }}>The Cost</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{SPANISH_ULCER.cost}</p>
                </div>
              </div>
            )}

            {/* ════════ KEY RELATIONSHIPS ════════ */}
            {activeTab === 'relationships' && (
              <div>
                <SectionHeader icon="👤" title="Key Relationships" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {KEY_RELATIONSHIPS.map(fig => {
                    const isOpen = expandedFigure === fig.name;
                    return (
                      <div
                        key={fig.name}
                        style={{ padding: 16, borderRadius: 10, border: `1px solid ${fig.color}33`, backgroundColor: `${fig.color}08`, cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={() => setExpandedFigure(isOpen ? null : fig.name)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 22, flexShrink: 0 }}>{fig.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{fig.name} <span style={{ fontSize: 12, fontWeight: 400, color: TEXT_MUTED }}>({fig.dates})</span></div>
                            <div style={{ fontSize: 12, color: fig.color, fontWeight: 600 }}>{fig.role}</div>
                          </div>
                          <span style={{ fontSize: 12, color: TEXT_MUTED, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>&#9660;</span>
                        </div>
                        {isOpen && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${fig.color}22` }}>
                            <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: '0 0 6px', fontWeight: 600 }}>{fig.contribution}</p>
                            <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{fig.detail}</p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ════════ WATERLOO ════════ */}
            {activeTab === 'waterloo' && (
              <div>
                <SectionHeader icon="💥" title="Waterloo — The Final Defeat (June 18, 1815)" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 20 }}>{WATERLOO.context}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Elba and the Hundred Days</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 12 }}>{ELBA_AND_HUNDRED_DAYS.firstExile}</p>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08`, marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, marginBottom: 4 }}>The Escape</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{ELBA_AND_HUNDRED_DAYS.escape}</p>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 24 }}>{ELBA_AND_HUNDRED_DAYS.hundredDays}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 14 }}>What Went Wrong at Waterloo</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  {WATERLOO.whatWentWrong.map((w, i) => (
                    <div key={i} style={{ padding: 16, borderRadius: 10, border: `1px solid ${w.color}33`, backgroundColor: `${w.color}08`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{w.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{w.title}</div>
                        <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{w.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${NAVY}33`, backgroundColor: `${NAVY}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 8 }}>The Aftermath</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{WATERLOO.aftermath}</p>
                </div>
              </div>
            )}

            {/* ════════ EXILE & DEATH ════════ */}
            {activeTab === 'exile' && (
              <div>
                <SectionHeader icon="🏝️" title="St. Helena — Exile and Death" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 20 }}>{ST_HELENA.exile}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Final Years</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 20 }}>{ST_HELENA.finalYears}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Death (May 5, 1821)</h3>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${CRIMSON}33`, backgroundColor: `${CRIMSON}08`, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{ST_HELENA.death}</p>
                </div>

                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, marginBottom: 8 }}>The Legend Grows</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{ST_HELENA.legend}</p>
                </div>
              </div>
            )}

            {/* ════════ LEGACY ════════ */}
            {activeTab === 'legacy' && (
              <div>
                <SectionHeader icon="🌐" title="The Legacy of Napoleon" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {LEGACY.map((item, i) => (
                    <div key={i} style={{ padding: 20, borderRadius: 10, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>{item.icon}</span>
                        <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{item.title}</div>
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
