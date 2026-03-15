import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────── Theme ───────── */
const ACCENT = '#1a5276';   // Continental navy blue
const BG = '#0a0c10';
const TEXT = '#e8e4de';
const TEXT_DIM = '#9a9486';
const TEXT_MUTED = '#6b6458';
const CARD_BG = 'rgba(26,82,118,0.05)';
const CARD_BORDER = 'rgba(26,82,118,0.18)';
const PATRIOT_BLUE = '#1a5276';
const LIBERTY_RED = '#9b2226';
const PARCHMENT = '#c9a84c';
const FOREST = '#2d6a4f';
const MUSKET = '#8d6e63';
const ROYAL_PURPLE = '#6b3fa0';
const CANNON = '#5c4033';
const TEAL = '#1a8a7d';

/* ───────── Types ───────── */
type SectionTab =
  | 'causes'
  | 'sides'
  | 'battles'
  | 'figures'
  | 'declaration'
  | 'france'
  | 'valleyforge'
  | 'african'
  | 'women'
  | 'treaty'
  | 'government'
  | 'legacy';

interface CauseEvent {
  date: string;
  title: string;
  detail: string;
  color: string;
}

interface Battle {
  name: string;
  date: string;
  commanders: string;
  significance: string;
  detail: string;
  icon: string;
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

const CONTEXT_TEXT = 'After the Seven Years\' War (1756–1763), Britain had defeated France and secured dominance over North America — but at enormous cost. The national debt had nearly doubled to £130 million. Parliament looked to the American colonies, which had benefited from British military protection, to help pay the bill. The colonists saw it differently: they had no representatives in Parliament, and the principle of "no taxation without representation" became the rallying cry of resistance. What began as a tax dispute would escalate into a revolution that changed the world.';

const CAUSES: CauseEvent[] = [
  { date: '1765', title: 'The Stamp Act', detail: 'Parliament imposed the first direct tax on the colonies — requiring stamps on newspapers, legal documents, playing cards, and more. Colonial outrage was immediate. The Sons of Liberty organized protests, stamp distributors were threatened and hanged in effigy, and the Stamp Act Congress (9 colonies) declared that only colonial assemblies could tax colonists. Repealed in 1766, but Parliament simultaneously passed the Declaratory Act asserting its right to legislate for the colonies "in all cases whatsoever."', color: LIBERTY_RED },
  { date: '1767', title: 'Townshend Acts', detail: 'Chancellor of the Exchequer Charles Townshend imposed duties on imported glass, lead, paint, paper, and tea. Colonists responded with organized boycotts of British goods — women formed the Daughters of Liberty and spun homespun cloth to replace British textiles. British customs officials used writs of assistance (general search warrants) to crack down on smuggling, deepening colonial resentment. Revenue raised was negligible; the political damage was immense.', color: PATRIOT_BLUE },
  { date: '1770', title: 'The Boston Massacre', detail: 'On March 5, British soldiers fired into a crowd of colonists outside the Custom House, killing five — including Crispus Attucks, a Black man often called the first casualty of the Revolution. The soldiers were defended in court by John Adams (who believed in rule of law even for his opponents) and largely acquitted. But Paul Revere\'s inflammatory engraving of the event became a powerful propaganda tool, turning the incident into a symbol of British tyranny.', color: LIBERTY_RED },
  { date: '1773', title: 'The Boston Tea Party', detail: 'On December 16, the Sons of Liberty — disguised as Mohawk Indians — boarded three ships in Boston Harbor and dumped 342 chests of East India Company tea (worth ~£10,000, roughly $1.7 million today) into the harbor. They were protesting the Tea Act, which gave the East India Company a monopoly on colonial tea sales. Parliament responded with the Coercive Acts (called "Intolerable Acts" by colonists): closing Boston Harbor, revoking Massachusetts\' charter, and quartering British troops in private homes.', color: FOREST },
  { date: '1774', title: 'First Continental Congress', detail: 'Delegates from 12 colonies (Georgia abstained) met in Philadelphia to coordinate a response to the Intolerable Acts. They agreed on a boycott of British goods, petitioned King George III for redress, and resolved to meet again if grievances weren\'t addressed. Patrick Henry declared: "The distinctions between Virginians, Pennsylvanians, New Yorkers, and New Englanders, are no more. I am not a Virginian, but an American."', color: PATRIOT_BLUE },
  { date: '1775', title: 'Lexington and Concord', detail: 'On April 19, British General Gage sent 700 regulars to seize colonial weapons stores at Concord. Paul Revere and William Dawes rode through the night to warn the countryside. At Lexington, 77 minutemen faced the British — someone fired "the shot heard round the world." Eight Americans died. At Concord\'s North Bridge, the militia fought back and the British retreated to Boston under withering fire from behind stone walls and trees, suffering 273 casualties. The war had begun.', color: LIBERTY_RED },
];

const PATRIOTS_VS_LOYALISTS = {
  patriots: {
    overview: 'Patriots (also called Whigs, rebels, or revolutionaries) made up roughly 40–45% of the white colonial population. They were drawn from all classes: merchants tired of trade restrictions, farmers resentful of taxes, lawyers steeped in Enlightenment philosophy, artisans, and frontier settlers. They were concentrated in New England and Virginia.',
    motivations: [
      'No taxation without representation — fundamental principle of English liberty',
      'Enlightenment ideas: natural rights, social contract, consent of the governed (Locke, Montesquieu)',
      'Economic grievances: trade restrictions, navigation acts, currency controls',
      'Local self-governance: colonies had governed themselves for 150 years and resented parliamentary interference',
      'Religious dissent: many colonists had originally fled religious persecution in England',
    ],
  },
  loyalists: {
    overview: 'Loyalists (called Tories by Patriots) made up roughly 15–20% of the population — some historians estimate up to 30%. They included royal officials, Anglican clergy, wealthy merchants with British trade connections, recent immigrants from Britain, and many in the backcountry who feared Patriot elites more than Parliament. They were strongest in New York, New Jersey, Georgia, and the Carolinas.',
    motivations: [
      'Belief in legitimate authority: the Crown and Parliament were the lawful government',
      'Fear of mob rule and anarchy — the revolution was radical and uncertain',
      'Economic ties to Britain: merchants, creditors, and Crown officials had much to lose',
      'Ethnic and cultural identity: recent Scottish and Irish immigrants often remained loyal',
      'Pragmatism: Britain had the world\'s most powerful military — rebellion seemed doomed to fail',
    ],
  },
  neutral: 'The remaining 35–45% tried to stay neutral — ordinary farmers, tradespeople, and frontier settlers who just wanted to be left alone. Many were eventually forced to choose sides as the war engulfed their communities.',
};

const BATTLES: Battle[] = [
  { name: 'Lexington & Concord', date: 'April 19, 1775', commanders: 'Militia (Parker, Barrett) vs. British (Smith, Pitcairn)', significance: 'First shots of the Revolution — "the shot heard round the world"', detail: '77 minutemen at Lexington, then hundreds of militia at Concord. British suffered 273 casualties in the retreat to Boston as thousands of militiamen fired from behind walls and trees. Proved colonists would fight.', icon: '🔫', color: LIBERTY_RED },
  { name: 'Bunker Hill (Breed\'s Hill)', date: 'June 17, 1775', commanders: 'Prescott, Putnam vs. Howe', significance: 'Proved raw colonial militia could stand against British regulars', detail: '"Don\'t fire until you see the whites of their eyes!" Colonial forces repulsed two British assaults before running out of ammunition. The British took the hill but suffered over 1,000 casualties (40% of the attacking force). A Pyrrhic victory that made London realize this would be no easy war.', icon: '⛰️', color: MUSKET },
  { name: 'Siege of Boston', date: 'March 1776', commanders: 'Washington vs. Howe', significance: 'First major American victory; British evacuate Boston', detail: 'Henry Knox dragged 60 tons of artillery from captured Fort Ticonderoga across 300 miles of winter terrain. Washington placed the cannon on Dorchester Heights overlooking Boston. Howe, facing destruction of his fleet, evacuated 11,000 troops and 1,000 Loyalists to Halifax.', icon: '🏰', color: PATRIOT_BLUE },
  { name: 'Long Island (Brooklyn)', date: 'August 27, 1776', commanders: 'Washington vs. Howe, Clinton', significance: 'Largest battle of the war — devastating American defeat', detail: 'Howe landed 20,000 troops and outflanked Washington\'s 10,000 on Long Island. The Americans suffered 1,000+ casualties and 1,000 captured. Washington escaped total disaster only by a brilliant nighttime evacuation across the East River in fog. New York City fell and remained British for the rest of the war.', icon: '🌊', color: CANNON },
  { name: 'Trenton', date: 'December 26, 1776', commanders: 'Washington vs. Rall (Hessians)', significance: 'Christmas crossing of the Delaware — saved the Revolution', detail: 'With enlistments expiring and morale at rock bottom after months of defeats, Washington led 2,400 men across the ice-choked Delaware River on Christmas night. They surprised 1,400 Hessian mercenaries at dawn, capturing nearly 1,000 in 45 minutes with almost no American casualties. Thomas Paine had just written: "These are the times that try men\'s souls." Trenton proved the war wasn\'t over.', icon: '🚣', color: PARCHMENT },
  { name: 'Princeton', date: 'January 3, 1777', commanders: 'Washington vs. Mawhood', significance: 'Second surprise victory — revived the Patriot cause', detail: 'Days after Trenton, Washington outmaneuvered Cornwallis by slipping away at night (leaving campfires burning) and attacking the British garrison at Princeton. Another victory. These twin triumphs transformed Washington from a losing general into a symbol of resilience and convinced many wavering colonists to support the cause.', icon: '⚡', color: PATRIOT_BLUE },
  { name: 'Brandywine', date: 'September 11, 1777', commanders: 'Washington vs. Howe', significance: 'British victory opened the road to Philadelphia', detail: 'Howe outflanked Washington along Brandywine Creek in Pennsylvania. The Americans retreated in good order despite losing. Philadelphia — the Patriot capital and largest city in America — fell to the British two weeks later. Congress fled to York, Pennsylvania.', icon: '🏴', color: CANNON },
  { name: 'Germantown', date: 'October 4, 1777', commanders: 'Washington vs. Howe', significance: 'Defeat, but showed French observers American fighting spirit', detail: 'Washington launched an audacious four-column dawn attack on the British camp at Germantown. Dense fog caused confusion and friendly fire; the attack failed. But European observers (especially the French) were impressed that an army that had lost Philadelphia was counterattacking within weeks. This helped secure the French alliance.', icon: '🌫️', color: MUSKET },
  { name: 'Saratoga (Two Battles)', date: 'Sept 19 & Oct 7, 1777', commanders: 'Gates, Arnold vs. Burgoyne', significance: 'THE TURNING POINT — convinced France to enter the war', detail: 'British General Burgoyne marched south from Canada to split New England from the other colonies. At Freeman\'s Farm and Bemis Heights, American forces (with Benedict Arnold\'s heroic battlefield leadership) surrounded and destroyed Burgoyne\'s army. On October 17, Burgoyne surrendered 5,895 men — the first time an entire British army surrendered. News of Saratoga convinced France to formally ally with America in February 1778, changing the war\'s trajectory entirely.', icon: '🏆', color: PARCHMENT },
  { name: 'Monmouth', date: 'June 28, 1778', commanders: 'Washington vs. Clinton', significance: 'First battle where Continental Army matched British regulars in open combat', detail: 'After Valley Forge, the retrained Continental Army intercepted Clinton\'s column in New Jersey. In brutal 100°F heat, the Americans fought the British to a standstill. Washington rallied retreating troops (legend says Molly Pitcher manned a cannon here). The British withdrew at night. The Continental Army had become a professional fighting force.', icon: '🌡️', color: LIBERTY_RED },
  { name: 'Siege of Charleston', date: 'May 12, 1780', commanders: 'Lincoln vs. Clinton', significance: 'Worst American defeat of the war — 5,000 captured', detail: 'Clinton besieged Charleston, South Carolina with 14,000 troops. General Lincoln surrendered the entire garrison — approximately 5,000 men, the largest American surrender until the Civil War. The fall of Charleston shifted the war\'s focus to the Southern theater and began a brutal guerrilla campaign.', icon: '💥', color: CANNON },
  { name: 'Camden', date: 'August 16, 1780', commanders: 'Gates vs. Cornwallis', significance: 'Devastating American defeat in the South', detail: 'General Gates — the hero of Saratoga — led a largely militia force against Cornwallis near Camden, South Carolina. The militia broke and ran at the first British bayonet charge. Gates himself fled on horseback, riding 170 miles in three days. Baron de Kalb, a German volunteer, died fighting. The defeat ended Gates\' military career.', icon: '💨', color: MUSKET },
  { name: 'King\'s Mountain', date: 'October 7, 1780', commanders: 'Patriot militia vs. Ferguson (Loyalists)', significance: 'Patriot backcountry militia destroyed a Loyalist force — turned the tide in the South', detail: 'Overmountain Men (frontier militia from modern Tennessee and Virginia) surrounded and annihilated a 1,000-strong Loyalist force under Major Patrick Ferguson on a ridgetop in South Carolina. Ferguson was killed; 900 Loyalists were killed, wounded, or captured. Jefferson called it "the turn of the tide of success." It proved that British control of the Southern interior was an illusion.', icon: '🏔️', color: FOREST },
  { name: 'Cowpens', date: 'January 17, 1781', commanders: 'Morgan vs. Tarleton', significance: 'Tactical masterpiece — double envelopment destroyed Tarleton\'s force', detail: 'Daniel Morgan devised a brilliant plan: he placed unreliable militia in the front with orders to fire just two volleys then retreat (which they\'d do anyway), drawing the British into a pursuit — straight into the waiting Continental regulars and cavalry. It worked perfectly. Tarleton\'s feared British Legion was annihilated: 110 killed, 830 captured, against just 25 American dead. One of the most perfectly executed small battles in military history.', icon: '🎯', color: PARCHMENT },
  { name: 'Guilford Courthouse', date: 'March 15, 1781', commanders: 'Greene vs. Cornwallis', significance: 'British "victory" that cost Cornwallis a quarter of his army', detail: 'Nathanael Greene adopted Morgan\'s layered defense at Guilford Courthouse, North Carolina. Cornwallis won the field but lost 532 men — over 25% of his force. A Pyrrhic victory. Charles James Fox said in Parliament: "Another such victory would ruin the British army." Cornwallis, too weakened to continue in the Carolinas, marched to Virginia — and ultimately to his fate at Yorktown.', icon: '🩸', color: LIBERTY_RED },
  { name: 'Yorktown', date: 'Sept 28 – Oct 19, 1781', commanders: 'Washington, Rochambeau vs. Cornwallis', significance: 'THE FINAL BATTLE — British surrender effectively ended the war', detail: 'In a masterful strategic convergence, Washington and French General Rochambeau marched 7,000 troops 400 miles from New York to Virginia while French Admiral de Grasse\'s fleet (28 ships) sealed the Chesapeake Bay, trapping Cornwallis\' 8,000 men at Yorktown. After a three-week siege with relentless bombardment, Cornwallis surrendered on October 19. His band reportedly played "The World Turned Upside Down." When news reached London, Prime Minister Lord North exclaimed: "Oh God! It is all over!" It was.', icon: '🏳️', color: PATRIOT_BLUE },
];

const KEY_FIGURES: Figure[] = [
  { name: 'George Washington', dates: '1732–1799', role: 'Commander-in-Chief; First President', contribution: 'Held the army together through impossible odds — his leadership won the war', detail: 'A Virginia planter and veteran of the French and Indian War, Washington was chosen to lead the Continental Army in 1775. He lost more battles than he won, but his genius was strategic: he kept the army alive, retreated when necessary, and struck when opportunity arose (Trenton, Yorktown). His greatest act may have been voluntarily resigning his commission after the war — proving the republic was more important than any man. Later unanimously elected first President, he set precedents that still govern the office.', icon: '⭐', color: PATRIOT_BLUE },
  { name: 'Thomas Jefferson', dates: '1743–1826', role: 'Author of the Declaration of Independence', contribution: 'Articulated the philosophical foundation of American democracy', detail: 'A 33-year-old Virginia delegate, Jefferson was chosen to draft the Declaration partly because of his "peculiar felicity of expression." Drawing on Locke, Montesquieu, and Scottish Enlightenment philosophy, he wrote that "all men are created equal" with "unalienable Rights" to "Life, Liberty, and the pursuit of Happiness." The contradiction: Jefferson owned over 600 enslaved people in his lifetime. He later served as Secretary of State, Vice President, and the third President (Louisiana Purchase).', icon: '📜', color: PARCHMENT },
  { name: 'Benjamin Franklin', dates: '1706–1790', role: 'Diplomat, scientist, elder statesman', contribution: 'Secured the French alliance that won the war', detail: 'Already world-famous as a scientist (lightning experiments) and publisher (Poor Richard\'s Almanack), the 70-year-old Franklin went to Paris in 1776 to negotiate the alliance that would prove decisive. He charmed French society, playing the role of rustic philosopher to perfection. The 1778 Treaty of Alliance brought French money, troops, and — crucially — the navy that made Yorktown possible. He also helped negotiate the Treaty of Paris (1783) that ended the war.', icon: '⚡', color: PARCHMENT },
  { name: 'John Adams', dates: '1735–1826', role: 'Diplomat, Vice President, 2nd President', contribution: 'The "Atlas of Independence" who drove the Continental Congress toward revolution', detail: 'A Massachusetts lawyer who defended the British soldiers after the Boston Massacre (believing in the rule of law), Adams became the fiercest advocate for independence in Congress. He nominated Washington as commander, pushed the Congress to declare independence, and served as diplomat in Europe. He and Jefferson died on the same day — July 4, 1826, the 50th anniversary of the Declaration. His last words: "Thomas Jefferson survives" (Jefferson had actually died hours earlier).', icon: '⚖️', color: PATRIOT_BLUE },
  { name: 'Samuel Adams', dates: '1722–1803', role: 'Revolutionary agitator and organizer', contribution: 'Master propagandist who organized colonial resistance from the Stamp Act onward', detail: 'John Adams\' older cousin was the mastermind behind much of Boston\'s revolutionary activity. He organized the Sons of Liberty, the Committee of Correspondence (inter-colonial communication network), and likely planned the Boston Tea Party. He was a failure in business but a genius at political organization and propaganda. The British considered him the most dangerous man in America — when the troops marched on Lexington, Adams and John Hancock were their intended targets.', icon: '📢', color: LIBERTY_RED },
  { name: 'Alexander Hamilton', dates: '1755/57–1804', role: 'Washington\'s aide-de-camp; first Secretary of the Treasury', contribution: 'Designed the financial system that made the new nation viable', detail: 'Born in the Caribbean, orphaned young, Hamilton came to New York and became Washington\'s most trusted aide. He led the decisive assault at Yorktown. After the war, he co-wrote The Federalist Papers (51 of 85 essays), championed the Constitution, and as Treasury Secretary created the national bank, assumed state debts, and established American credit. His rivalry with Aaron Burr ended in the famous 1804 duel. His financial vision made America a great power.', icon: '💰', color: FOREST },
  { name: 'Marquis de Lafayette', dates: '1757–1834', role: 'French nobleman who fought for American liberty', contribution: 'Brought French support and became Washington\'s surrogate son', detail: 'At 19, Lafayette defied King Louis XVI and sailed to America to fight for liberty. He served without pay, was wounded at Brandywine, endured Valley Forge, and commanded troops at Yorktown. His lobbying in Paris was crucial to securing French military support. He became Washington\'s closest confidant — essentially an adopted son. Later he played a key role in the early French Revolution, giving the key to the Bastille to Washington (it still hangs at Mount Vernon).', icon: '🇫🇷', color: ROYAL_PURPLE },
  { name: 'Thomas Paine', dates: '1737–1809', role: 'Pamphleteer and revolutionary writer', contribution: 'Common Sense and The Crisis — the words that ignited and sustained the Revolution', detail: 'An Englishman who arrived in America in 1774, Paine published Common Sense in January 1776 — a 47-page pamphlet that sold 500,000 copies (in a population of 2.5 million). It made the case for independence in plain, powerful language that ordinary people could understand. Later, his Crisis papers ("These are the times that try men\'s souls") rallied the army at its darkest moments. Paine later wrote Rights of Man defending the French Revolution, and The Age of Reason challenging organized religion.', icon: '✍️', color: PARCHMENT },
  { name: 'Benedict Arnold', dates: '1741–1801', role: 'Patriot hero turned infamous traitor', contribution: 'Most brilliant American battlefield commander — then betrayed the cause', detail: 'Arnold was arguably the best combat general on either side. He captured Fort Ticonderoga, nearly conquered Canada, built a fleet on Lake Champlain (delaying the British by a year), and was the hero of Saratoga (wounded twice). But Congress repeatedly passed him over for promotion, others took credit for his victories, and he was court-martialed for minor charges. Bitter and in debt, he plotted to surrender West Point to the British for £20,000. The plot was discovered in 1780. He fled to the British side and his name became synonymous with treason.', icon: '🗡️', color: CANNON },
  { name: 'Lord Cornwallis', dates: '1738–1805', role: 'British general who surrendered at Yorktown', contribution: 'Commanded British forces in the South; his surrender ended the war', detail: 'Charles Cornwallis was a capable and aggressive general who opposed the Stamp Act in Parliament but fought dutifully for the Crown. He won victories at Camden and Guilford Courthouse, but each "victory" weakened his army. His fateful decision to march into Virginia and establish a base at Yorktown led to the decisive siege. After surrendering, he claimed illness and sent his deputy — Washington made the deputy surrender to his own deputy (Lincoln) rather than accept the sword himself. Cornwallis later served as Governor-General of India.', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: LIBERTY_RED },
  { name: 'King George III', dates: '1738–1820', role: 'King of Great Britain during the Revolution', contribution: 'The tyrant of the Declaration — though reality was more complex', detail: 'Jefferson\'s Declaration listed 27 grievances against George III personally, painting him as a tyrant. In reality, the King was a constitutional monarch who acted through Parliament. But he was stubborn: he refused to read the colonists\' Olive Branch Petition, declared the colonies in rebellion, and insisted on prosecuting the war long after his ministers wanted peace. He later suffered from recurring mental illness (possibly porphyria). His personal diary entry for July 4, 1776: "Nothing of importance happened today."', icon: '👑', color: ROYAL_PURPLE },
  { name: 'General Howe', dates: '1729–1814', role: 'British Commander-in-Chief 1775–1778', contribution: 'Won battles but repeatedly failed to destroy Washington\'s army', detail: 'William Howe was a competent general who sympathized with the colonists (he had opposed the Stamp Act). He won at Long Island, Brandywine, and Germantown but consistently failed to deliver the killing blow. He didn\'t pursue Washington after Long Island, didn\'t reinforce Burgoyne at Saratoga, and spent a comfortable winter in Philadelphia while the Americans froze at Valley Forge. Critics accused him of half-hearted warfare. He resigned in 1778 and returned to England.', icon: '🎖️', color: MUSKET },
  { name: 'Nathanael Greene', dates: '1742–1786', role: 'Continental Army Major General; commander of the Southern theater', contribution: 'Liberated the South through strategic brilliance — "We fight, get beat, rise, and fight again"', detail: 'A Rhode Island Quaker with no military experience before the war, Greene became Washington\'s most trusted general and perhaps the best strategic mind of the Revolution. Given command of the shattered Southern army after Camden, he adopted a strategy of dividing his force, retreating strategically, and forcing the British to chase him across the Carolinas. He lost every major battle but won the campaign: by 1782, the British held only Charleston and Savannah. His approach anticipated guerrilla warfare principles used for centuries after.', icon: '🧭', color: FOREST },
];

const DECLARATION = {
  drafting: 'On June 7, 1776, Richard Henry Lee of Virginia proposed independence. Congress appointed a Committee of Five — Thomas Jefferson (Virginia), John Adams (Massachusetts), Benjamin Franklin (Pennsylvania), Roger Sherman (Connecticut), and Robert Livingston (New York) — to draft a formal declaration. Jefferson wrote the initial draft in 17 days in a rented room in Philadelphia. Adams and Franklin made minor edits. Congress debated and revised the text for two days, cutting about a quarter of it — including a passage condemning the slave trade (removed at the insistence of South Carolina and Georgia delegates, and some Northern slave traders).',
  keyPhrases: [
    { phrase: '"We hold these truths to be self-evident, that all men are created equal"', meaning: 'Drawing on Locke\'s natural rights philosophy, Jefferson asserted universal human equality as the foundation of government. Revolutionary in an age of kings, hereditary aristocracy, and slavery — though the gap between ideal and practice would haunt America for centuries.' },
    { phrase: '"...endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness"', meaning: 'Locke had written "life, liberty, and property." Jefferson\'s substitution of "the pursuit of Happiness" broadened the concept from mere property rights to a vision of human flourishing — a subtle but profound philosophical shift.' },
    { phrase: '"...Governments are instituted among Men, deriving their just powers from the consent of the governed"', meaning: 'The social contract theory: government exists to serve the people, not the other way around. If it fails, the people have the right to alter or abolish it. This was a direct challenge to the divine right of kings and hereditary rule.' },
    { phrase: '"...a long train of abuses and usurpations"', meaning: 'Jefferson listed 27 specific grievances against George III to demonstrate that revolution was justified — not a rash act but a response to systematic tyranny.' },
  ],
  revolutionary: 'What made the Declaration revolutionary wasn\'t just its words but its logic: it grounded political legitimacy in universal human rights, not tradition, divine right, or military power. For the first time in history, a people declared their independence based on philosophical principles. The document became a template for revolution worldwide — from France (1789) to Haiti (1804) to Vietnam (1945), independence movements have echoed Jefferson\'s words.',
  excluded: 'The phrase "all men are created equal" did not, in practice, include everyone. Enslaved Africans (20% of the colonial population) remained in bondage. Women gained no political rights. Native Americans were mentioned only as "merciless Indian Savages." Free Black people, indentured servants, and the propertyless were excluded from the political community. The tension between the Declaration\'s ideals and America\'s reality has driven every major social movement in American history — from abolition to suffrage to civil rights.',
};

const FRANCE_ROLE = {
  whyJoined: 'France\'s alliance with America was driven by revenge, not ideology. Humiliated in the Seven Years\' War (losing Canada, India, and Caribbean islands to Britain), France saw the American Revolution as an opportunity to weaken its greatest rival. Foreign Minister Vergennes calculated that an independent America would break Britain\'s commercial monopoly and reduce its naval power. France initially provided covert aid through a front company (Hortalez & Cie, run by playwright Beaumarchais) — gunpowder, weapons, uniforms, and money. After Saratoga proved the Americans could win, France signed the Treaty of Alliance (February 6, 1778), openly entering the war.',
  contributions: [
    { title: 'Financial Support', detail: 'France provided approximately 1.3 billion livres in loans and gifts — roughly $13 billion in today\'s money. This funded much of the Continental Army\'s operations. The cost helped bankrupt the French treasury, contributing to the French Revolution a decade later.', icon: '💰', color: PARCHMENT },
    { title: 'Lafayette and French Officers', detail: 'The Marquis de Lafayette arrived in 1777 and became one of Washington\'s most trusted commanders. Hundreds of other French officers served, bringing professional military expertise. The Comte de Rochambeau commanded 5,500 French regulars who fought alongside Americans at Yorktown.', icon: '🎖️', color: ROYAL_PURPLE },
    { title: 'French Navy at Yorktown', detail: 'Admiral de Grasse\'s fleet of 28 ships of the line defeated the British fleet at the Battle of the Chesapeake (September 5, 1781), sealing the trap around Cornwallis at Yorktown. Without French naval superiority, the siege — and the war — could not have been won. This was arguably France\'s single most decisive contribution.', icon: '⚓', color: PATRIOT_BLUE },
    { title: 'Global Distraction', detail: 'France (joined by Spain in 1779 and the Netherlands in 1780) forced Britain to defend its interests worldwide — the Caribbean, India, Gibraltar, the English Channel. This stretched the Royal Navy thin and prevented Britain from concentrating its full might on America.', icon: '🌍', color: TEAL },
  ],
  wouldHaveLost: 'Most historians agree that America could not have won the war without France. The Continental Army lacked the money, supplies, professional training, and especially the naval power needed to defeat Britain. French money kept the army in the field; French officers helped professionalize it; and the French navy created the conditions for the decisive victory at Yorktown. As Washington himself wrote: "The interposition of France has been the most free & generous, perhaps, that is to be met with in history."',
};

const VALLEY_FORGE = {
  overview: 'From December 19, 1777 to June 19, 1778, the Continental Army endured six months of misery at Valley Forge, Pennsylvania — 18 miles northwest of British-occupied Philadelphia. It was Washington\'s darkest hour, but it became the crucible that forged a professional army.',
  conditions: [
    { title: 'Starvation', detail: 'The army of 12,000 men frequently went days without meat or bread. The quartermaster system had collapsed. Soldiers ate "fire cakes" (flour and water baked on hot stones). Washington warned Congress that the army was on the verge of "starve, dissolve, or disperse."', icon: '🍞', color: MUSKET },
    { title: 'Disease', detail: 'Typhus, dysentery, pneumonia, and smallpox ravaged the camp. Approximately 2,000 soldiers died — not from battle but from disease and exposure. Medical supplies were virtually nonexistent. The dead were buried in mass graves.', icon: '🏥', color: LIBERTY_RED },
    { title: 'Desertion', detail: 'Hundreds of soldiers deserted. Many went home to families who needed them. Others had simply endured enough. Washington ordered harsh punishments for deserters but also understood their desperation.', icon: '🚶', color: TEXT_MUTED },
    { title: 'Lack of Supplies', detail: 'Nearly one-third of the soldiers lacked shoes — their bloody footprints could be tracked in the snow. Blankets were scarce; men shared. Uniforms were in tatters. Congress, weak under the Articles of Confederation, couldn\'t compel states to provide supplies.', icon: '🥾', color: CANNON },
  ],
  vonSteuben: 'The transformation of Valley Forge came from an unlikely source: Baron Friedrich Wilhelm von Steuben, a Prussian military officer (who exaggerated his rank). Arriving in February 1778, von Steuben drilled the ragged army with Prussian precision — teaching them how to march, fire in coordinated volleys, execute bayonet charges, and move as unified formations. He personally trained a model company of 100 men, who then trained others. His "Blue Book" (Regulations for the Order and Discipline of the Troops) became the army\'s official manual. The army that marched out of Valley Forge in June was fundamentally transformed — as they proved at Monmouth weeks later.',
  significance: 'Valley Forge became the Revolution\'s defining myth: suffering endured, sacrifice rewarded, and an army reborn. The men who stayed through that winter became the professional core of the Continental Army. Their perseverance proved that the American cause had committed soldiers willing to endure anything for independence.',
};

const AFRICAN_AMERICANS = {
  overview: 'The American Revolution created a profound contradiction: a war fought for liberty in a nation built on slavery. Both sides recruited Black soldiers, and approximately 5,000–8,000 African Americans served in the Continental forces, while tens of thousands fled to British lines seeking freedom.',
  patriotSide: [
    { title: 'Initial Exclusion', detail: 'Washington initially barred Black enlistment in 1775, fearing Southern slaveholder backlash. After Lord Dunmore\'s Proclamation (see below), he reversed course. By war\'s end, Black soldiers served in every major engagement.', icon: '🚫', color: CANNON },
    { title: 'Service and Valor', detail: 'African Americans fought at Bunker Hill (Salem Poor, Peter Salem), Lexington, Trenton, Yorktown, and dozens of other battles. The 1st Rhode Island Regiment included an entire company of formerly enslaved men who fought with distinction. James Armistead Lafayette served as a double agent, gathering intelligence that helped win Yorktown.', icon: '⚔️', color: PATRIOT_BLUE },
    { title: 'Promises of Freedom', detail: 'Many enslaved people were promised freedom in exchange for military service — sometimes by their enslavers, sometimes by state governments. After the war, some gained their freedom; many others were returned to bondage despite their service.', icon: '🕊️', color: PARCHMENT },
  ],
  britishSide: [
    { title: 'Lord Dunmore\'s Proclamation (1775)', detail: 'Virginia\'s royal governor offered freedom to enslaved people who escaped Patriot owners and joined the British. Hundreds responded, forming the "Ethiopian Regiment" with "Liberty to Slaves" sewn on their uniforms. The proclamation outraged slaveholders and actually pushed some wavering Southerners toward the Patriot cause.', icon: '📜', color: LIBERTY_RED },
    { title: 'Mass Flight to British Lines', detail: 'Throughout the war, an estimated 80,000–100,000 enslaved people fled to British lines seeking freedom. Many served as laborers, scouts, and soldiers. After the war, approximately 3,000 Black Loyalists were evacuated to Nova Scotia (recorded in the "Book of Negroes"), though they faced discrimination there too.', icon: '🏃', color: MUSKET },
  ],
  contradiction: '"All men are created equal" — except the roughly 500,000 enslaved people in the colonies (20% of the population). The Revolution\'s language of liberty inspired some action: Northern states began gradual emancipation (Vermont 1777, Pennsylvania 1780, Massachusetts 1783). But the Constitution of 1787 protected slavery through the Three-Fifths Compromise and the Fugitive Slave Clause. The fundamental contradiction between American ideals and American slavery would not be resolved until the Civil War — 80 years later — and its legacy persists today.',
};

const WOMEN_ROLE = {
  overview: 'Women were excluded from political participation but played essential roles in the Revolution — as boycott organizers, propagandists, camp followers, spies, and even soldiers. The war disrupted gender norms and planted seeds (however slowly) for future women\'s rights movements.',
  figures: [
    { name: 'Abigail Adams', detail: 'Wife of John Adams and one of the most brilliant political minds of the era. Her letters to her husband are among the Revolution\'s most important documents. She famously warned: "Remember the Ladies, and be more generous and favorable to them than your ancestors. Do not put such unlimited power into the hands of the Husbands." John replied dismissively. Women would wait 144 years for the vote.', icon: '✉️', color: PATRIOT_BLUE },
    { name: 'Mercy Otis Warren', detail: 'Playwright, poet, and historian who used satire to attack British policies and Loyalist sympathizers. She published anti-British plays and poems under her own name — extraordinary for a woman in the 1770s. After the war, she wrote a three-volume History of the Rise, Progress, and Termination of the American Revolution (1805) — one of the first histories by an American woman.', icon: '🖋️', color: ROYAL_PURPLE },
    { name: 'Molly Pitcher (Mary Ludwig Hays)', detail: 'The most famous "Molly Pitcher" legend centers on Mary Ludwig Hays at the Battle of Monmouth (1778). She carried water ("molly pitcher" was a generic term) to soldiers and, when her husband collapsed from heat, took over his cannon. Whether one woman or a composite of many, "Molly Pitcher" represents the thousands of camp followers who cooked, washed, nursed the wounded, and sometimes fought.', icon: '💪', color: LIBERTY_RED },
    { name: 'Deborah Sampson', detail: 'Disguised herself as a man ("Robert Shurtliff") and served in the Continental Army for over a year (1782–83). She fought in multiple engagements, was wounded twice, and removed a musket ball from her own thigh to avoid detection. After the war, she lectured about her experiences and eventually received a military pension.', icon: '🎭', color: FOREST },
    { name: 'Camp Followers', detail: 'Thousands of women followed the army — not as an afterthought but as essential support. They cooked, did laundry, nursed the sick and wounded, and sometimes carried ammunition or fought. Washington tried to limit their numbers but recognized their necessity. At Valley Forge, women helped keep the army alive.', icon: '🏕️', color: MUSKET },
  ],
  impact: 'The Revolution created "Republican Motherhood" — the idea that women\'s civic contribution was raising virtuous, informed citizens. This led to expanded female education (more girls\' schools) but also confined women\'s political role to the domestic sphere. Abigail Adams\' call to "remember the ladies" went unanswered for generations, but the Revolution\'s language of rights and equality would eventually fuel the suffrage movement and the Seneca Falls Convention (1848).',
};

const TREATY_OF_PARIS = {
  overview: 'The Treaty of Paris, signed September 3, 1783, formally ended the American Revolutionary War. American negotiators — Benjamin Franklin, John Adams, and John Jay — secured remarkably favorable terms, partly because they secretly negotiated with Britain separately from France (violating their alliance obligations).',
  terms: [
    { title: 'British Recognition of Independence', detail: 'Britain formally recognized the United States as a free, sovereign, and independent nation. After eight years of war, the world\'s most powerful empire acknowledged defeat by its former colonies.', icon: '🗽', color: PATRIOT_BLUE },
    { title: 'Generous Borders', detail: 'The new nation stretched from the Atlantic Ocean to the Mississippi River, and from the Great Lakes to the 31st parallel (northern Florida). This was far more than the original 13 colonies — it doubled the new nation\'s territory and gave it room to expand westward.', icon: '🗺️', color: FOREST },
    { title: 'Fishing Rights', detail: 'Americans retained the right to fish off Newfoundland and Nova Scotia — vital for the New England economy. John Adams fought tenaciously for this provision.', icon: '🐟', color: TEAL },
    { title: 'Debts and Loyalists', detail: 'The treaty promised that Congress would "recommend" states restore Loyalist property and honor prewar debts to British creditors. In practice, most states ignored these provisions. An estimated 60,000–100,000 Loyalists left America — many to Canada (especially Nova Scotia and Ontario), the Bahamas, or Britain. They lost homes, land, and livelihoods.', icon: '💼', color: PARCHMENT },
    { title: 'British Withdrawal', detail: 'Britain agreed to evacuate all military posts in American territory "with all convenient speed." In practice, they held several Great Lakes forts for over a decade, using them to maintain influence with Native Americans and the fur trade.', icon: '🏴', color: LIBERTY_RED },
  ],
  loyalistExodus: 'The Loyalist exodus was one of the largest migrations in American history. An estimated 60,000–100,000 people left — proportionally equivalent to millions today. They included wealthy merchants, ordinary farmers, thousands of free Black Loyalists, and Indigenous peoples who had allied with Britain. Their departure reshaped Canada: the influx of English-speaking Loyalists into Quebec led to the creation of Upper Canada (Ontario) and New Brunswick. Many Loyalists received land grants from the Crown but faced hardship rebuilding their lives.',
};

const GOVERNMENT = {
  articles: {
    overview: 'The Articles of Confederation (ratified 1781) were America\'s first constitution — and a deliberate attempt to create a weak central government. After fighting a revolution against tyranny, the founders feared creating a new one.',
    failures: [
      'No power to tax — Congress could only request money from states (which often refused)',
      'No executive branch — no president, no way to enforce laws',
      'No national judiciary — disputes between states had no resolution mechanism',
      'Unanimous consent needed to amend — one state could block any change',
      'No power to regulate commerce — states imposed tariffs on each other',
      'No national currency — each state printed its own money, creating chaos',
      'Could not raise an army — relied on state militias that answered to governors',
      'Shays\' Rebellion (1786–87) — farmers in Massachusetts rebelled against debt collection; Congress couldn\'t raise troops to respond',
    ],
  },
  convention: 'Shays\' Rebellion convinced many leaders that the Articles had to go. In May 1787, 55 delegates gathered in Philadelphia — officially to revise the Articles, but quickly moving to write an entirely new Constitution. Washington presided; Madison (the "Father of the Constitution") designed the framework. Key compromises: the Great Compromise (bicameral legislature — House by population, Senate equal by state), the Three-Fifths Compromise (enslaved people counted as 3/5 of a person for representation — a moral catastrophe enshrined in law), and the Electoral College. The Constitution created a strong federal government with separation of powers (executive, legislative, judicial) and checks and balances.',
  billOfRights: 'Anti-Federalists (Patrick Henry, George Mason) refused to ratify without a Bill of Rights protecting individual liberties from government overreach. James Madison drafted 12 amendments; 10 were ratified in 1791. Key protections: freedom of speech, religion, press, and assembly (1st); right to bear arms (2nd); no unreasonable searches (4th); right to due process (5th); right to a jury trial (6th); and protections against cruel and unusual punishment (8th). The 9th and 10th Amendments reserved unenumerated rights to the people and powers to the states.',
};

const LEGACY = [
  { title: 'Template for Revolution', detail: 'The American Revolution proved that a colonial people could overthrow an empire through a combination of military resistance, philosophical argument, and international alliance. It directly inspired the French Revolution (1789), the Haitian Revolution (1791–1804), and Latin American independence movements (1810s–1820s). Ho Chi Minh quoted the Declaration of Independence in Vietnam\'s declaration of independence in 1945. The revolutionary template — natural rights, popular sovereignty, written constitutions — became the blueprint for modern democracy worldwide.', icon: '🌍', color: TEAL },
  { title: 'Republican Government', detail: 'For the first time since ancient Rome, a major nation was governed as a republic — without a king, hereditary aristocracy, or established church. The Constitution\'s system of federalism, separation of powers, and checks and balances influenced virtually every democratic constitution written since. The peaceful transfer of power between political opponents (starting with Adams to Jefferson in 1801) proved that democracy could work.', icon: '🏛️', color: PATRIOT_BLUE },
  { title: 'The Unfinished Revolution', detail: '"All men are created equal" was a promissory note that America has never fully redeemed. Slavery persisted for 87 more years. Women couldn\'t vote for 144 years. Native Americans were systematically dispossessed. Jim Crow laws enforced racial apartheid for a century after emancipation. Each subsequent movement for equality — abolition, suffrage, labor rights, civil rights, LGBTQ+ rights — has invoked the Declaration\'s language to demand that America live up to its founding promise. The Revolution is still ongoing.', icon: '⚖️', color: PARCHMENT },
  { title: 'American Exceptionalism', detail: 'The Revolution created the idea of America as a "city upon a hill" — a beacon of liberty with a special mission in history. This has inspired both extraordinary idealism (spreading democracy, welcoming immigrants, defending human rights) and troubling overreach (manifest destiny, imperialism, interventionism). The tension between America\'s ideals and its actions remains the central drama of its history.', icon: '🗽', color: LIBERTY_RED },
  { title: 'The Founders\' Debate', detail: 'The Revolution\'s leaders disagreed profoundly about what kind of nation they were building. Hamilton wanted a strong central government and industrial economy; Jefferson wanted an agrarian republic of small farmers. Federalists vs. Anti-Federalists, loose vs. strict constitutional interpretation, federal power vs. states\' rights — these debates, born in the Revolution, still define American politics today. The genius of the system was creating a framework flexible enough to contain these disagreements peacefully.', icon: '🤝', color: FOREST },
  { title: 'Impact on Britain', detail: 'Losing the American colonies was a shock to British prestige but not a death blow to the empire. Britain pivoted to India, Australia, and Africa. The loss influenced British imperial policy — the Durham Report (1839) recommended self-governance for settler colonies, leading eventually to Canadian, Australian, and New Zealand autonomy. Britain learned (partially) that colonies needed a degree of self-rule, though this lesson was applied unevenly and often too late.', icon: '🇬🇧', color: MUSKET },
];

/* ───────── Sub-components ───────── */

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: `${PATRIOT_BLUE}15`, border: `1px solid ${PATRIOT_BLUE}33`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: PATRIOT_BLUE, fontFamily: 'monospace' }}>{value}</div>
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
        border: `1px solid ${active ? PATRIOT_BLUE : CARD_BORDER}`,
        backgroundColor: active ? `${PATRIOT_BLUE}22` : 'transparent',
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
  { key: 'causes', label: 'Causes', icon: '📋' },
  { key: 'sides', label: 'Patriots vs Loyalists', icon: '⚔️' },
  { key: 'battles', label: 'Battles', icon: '💥' },
  { key: 'figures', label: 'Key Figures', icon: '👤' },
  { key: 'declaration', label: 'Declaration', icon: '📜' },
  { key: 'france', label: 'France\'s Role', icon: '🇫🇷' },
  { key: 'valleyforge', label: 'Valley Forge', icon: '❄️' },
  { key: 'african', label: 'African Americans', icon: '✊' },
  { key: 'women', label: 'Women\'s Roles', icon: '👩' },
  { key: 'treaty', label: 'Treaty of Paris', icon: '🕊️' },
  { key: 'government', label: 'New Government', icon: '🏛️' },
  { key: 'legacy', label: 'Legacy', icon: '🌍' },
];

/* ───────── Main Component ───────── */

export default function AmericanRevolutionPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('causes');
  const [expandedFigure, setExpandedFigure] = useState<string | null>(null);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: BG, color: TEXT, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* ─── Hero ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ padding: '48px 32px 36px', borderBottom: `1px solid ${CARD_BORDER}`, background: `linear-gradient(135deg, ${BG} 0%, rgba(26,82,118,0.10) 100%)` }}>
          <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '4px 0' }}>← Back to Timeline</Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: `${PATRIOT_BLUE}20`, border: `2px solid ${PATRIOT_BLUE}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: `0 0 24px ${PATRIOT_BLUE}30` }}>🇺🇸</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, backgroundColor: `${PATRIOT_BLUE}20`, color: PATRIOT_BLUE, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Deep Dive</span>
          </div>

          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 800, color: TEXT, lineHeight: 1.15, marginBottom: 14 }}>
            The American Revolution — When 13 Colonies Became a Nation{' '}
            <span style={{ fontSize: 'clamp(18px, 3vw, 28px)', color: TEXT_DIM, fontWeight: 400 }}>(1765–1783)</span>
          </h1>

          <p style={{ fontSize: 16, color: TEXT_DIM, lineHeight: 1.7, maxWidth: 700, margin: 0 }}>
            From tax protests to a new nation — how a dispute over stamps and tea became a revolution that reshaped the world, establishing self-governance, individual rights, and democratic ideals that echo to this day.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
            <StatBadge value="13" label="Colonies" />
            <StatBadge value="8" label="Years of War" />
            <StatBadge value="16+" label="Major Battles" />
            <StatBadge value="25,000" label="American Dead" />
            <StatBadge value="13+" label="Key Figures" />
          </div>
        </motion.div>

        {/* ─── Tab Navigation ─── */}
        <div style={{ padding: '16px 32px', borderBottom: `1px solid ${CARD_BORDER}`, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, backgroundColor: BG }}>
          {SECTION_TABS.map(tab => (
            <TabButton key={tab.key} label={tab.label} icon={tab.icon} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} />
          ))}
        </div>

        {/* ─── Causes ─── */}
        {activeTab === 'causes' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="📋" title="The Road to Revolution (1765–1775)" />
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${MUSKET}33`, backgroundColor: `${MUSKET}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{CONTEXT_TEXT}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Key Events</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {CAUSES.map((evt, i) => (
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

        {/* ─── Patriots vs Loyalists ─── */}
        {activeTab === 'sides' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="⚔️" title="Patriots vs. Loyalists — A Divided People" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
              {/* Patriots */}
              <div style={{ padding: '20px 24px', borderRadius: 12, border: `1px solid ${PATRIOT_BLUE}44`, backgroundColor: `${PATRIOT_BLUE}08` }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: PATRIOT_BLUE, marginTop: 0, marginBottom: 10 }}>Patriots (~40–45%)</h3>
                <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 14 }}>{PATRIOTS_VS_LOYALISTS.patriots.overview}</p>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 8 }}>Motivations</h4>
                <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {PATRIOTS_VS_LOYALISTS.patriots.motivations.map(m => (
                    <li key={m} style={{ fontSize: 12, color: TEXT_DIM, lineHeight: 1.6 }}>{m}</li>
                  ))}
                </ul>
              </div>

              {/* Loyalists */}
              <div style={{ padding: '20px 24px', borderRadius: 12, border: `1px solid ${LIBERTY_RED}44`, backgroundColor: `${LIBERTY_RED}08` }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: LIBERTY_RED, marginTop: 0, marginBottom: 10 }}>Loyalists (~15–30%)</h3>
                <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 14 }}>{PATRIOTS_VS_LOYALISTS.loyalists.overview}</p>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 8 }}>Motivations</h4>
                <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {PATRIOTS_VS_LOYALISTS.loyalists.motivations.map(m => (
                    <li key={m} style={{ fontSize: 12, color: TEXT_DIM, lineHeight: 1.6 }}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${TEXT_MUTED}33`, backgroundColor: `${TEXT_MUTED}08` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginTop: 0, marginBottom: 6 }}>The Undecided (~35–45%)</h4>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{PATRIOTS_VS_LOYALISTS.neutral}</p>
            </div>
          </section>
        )}

        {/* ─── Battles ─── */}
        {activeTab === 'battles' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="💥" title="Key Battles of the Revolution (1775–1781)" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>From the first shots at Lexington to the final siege at Yorktown — 16 battles that decided the fate of a nation.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {BATTLES.map((battle, i) => (
                <motion.div key={battle.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.35 }} style={{ padding: '20px 24px', borderRadius: 12, border: `1px solid ${battle.color}44`, backgroundColor: `${battle.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>{battle.icon}</span>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: battle.color }}>{battle.name}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_DIM, fontFamily: 'monospace' }}>{battle.date}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 8, fontStyle: 'italic' }}>{battle.commanders}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: battle.color, marginBottom: 8 }}>{battle.significance}</div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{battle.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Key Figures ─── */}
        {activeTab === 'figures' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="👤" title="Key Figures of the American Revolution" />
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

        {/* ─── Declaration of Independence ─── */}
        {activeTab === 'declaration' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="📜" title="The Declaration of Independence (July 4, 1776)" />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: PARCHMENT, marginBottom: 12 }}>Drafting</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${PARCHMENT}33`, backgroundColor: `${PARCHMENT}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{DECLARATION.drafting}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: PATRIOT_BLUE, marginBottom: 12 }}>Key Phrases & Their Meaning</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {DECLARATION.keyPhrases.map((kp, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${PATRIOT_BLUE}33`, backgroundColor: `${PATRIOT_BLUE}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 8, fontStyle: 'italic' }}>{kp.phrase}</div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{kp.meaning}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: FOREST, marginBottom: 12 }}>What Made It Revolutionary</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${FOREST}33`, backgroundColor: `${FOREST}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{DECLARATION.revolutionary}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: LIBERTY_RED, marginBottom: 12 }}>Who Was Excluded</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${LIBERTY_RED}33`, backgroundColor: `${LIBERTY_RED}08` }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{DECLARATION.excluded}</p>
            </div>
          </section>
        )}

        {/* ─── France's Role ─── */}
        {activeTab === 'france' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🇫🇷" title="France's Role — The Alliance That Won the War" />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: ROYAL_PURPLE, marginBottom: 12 }}>Why France Joined</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${ROYAL_PURPLE}33`, backgroundColor: `${ROYAL_PURPLE}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{FRANCE_ROLE.whyJoined}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: PATRIOT_BLUE, marginBottom: 12 }}>Key Contributions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {FRANCE_ROLE.contributions.map((c, i) => (
                <motion.div key={c.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${c.color}44`, backgroundColor: `${c.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{c.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: c.color }}>{c.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{c.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: PARCHMENT, marginBottom: 12 }}>Could America Have Won Without France?</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${PARCHMENT}33`, backgroundColor: `${PARCHMENT}08` }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{FRANCE_ROLE.wouldHaveLost}</p>
            </div>
          </section>
        )}

        {/* ─── Valley Forge ─── */}
        {activeTab === 'valleyforge' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="❄️" title="Valley Forge — Washington's Darkest Hour (1777–78)" />

            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${MUSKET}33`, backgroundColor: `${MUSKET}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{VALLEY_FORGE.overview}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: LIBERTY_RED, marginBottom: 12 }}>The Suffering</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {VALLEY_FORGE.conditions.map((c, i) => (
                <motion.div key={c.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${c.color}33`, backgroundColor: `${c.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{c.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{c.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{c.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: PATRIOT_BLUE, marginBottom: 12 }}>Von Steuben's Transformation</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${PATRIOT_BLUE}33`, backgroundColor: `${PATRIOT_BLUE}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{VALLEY_FORGE.vonSteuben}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: PARCHMENT, marginBottom: 12 }}>Significance</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${PARCHMENT}33`, backgroundColor: `${PARCHMENT}08` }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{VALLEY_FORGE.significance}</p>
            </div>
          </section>
        )}

        {/* ─── African Americans ─── */}
        {activeTab === 'african' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="✊" title="African Americans and the Revolution" />

            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${PARCHMENT}33`, backgroundColor: `${PARCHMENT}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{AFRICAN_AMERICANS.overview}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: PATRIOT_BLUE, marginBottom: 12 }}>On the Patriot Side</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {AFRICAN_AMERICANS.patriotSide.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: LIBERTY_RED, marginBottom: 12 }}>On the British Side</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {AFRICAN_AMERICANS.britishSide.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: PARCHMENT, marginBottom: 12 }}>The Fundamental Contradiction</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${PARCHMENT}33`, backgroundColor: `${PARCHMENT}08` }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{AFRICAN_AMERICANS.contradiction}</p>
            </div>
          </section>
        )}

        {/* ─── Women's Roles ─── */}
        {activeTab === 'women' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="👩" title="Women's Roles in the Revolution" />

            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${ROYAL_PURPLE}33`, backgroundColor: `${ROYAL_PURPLE}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{WOMEN_ROLE.overview}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Key Figures</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {WOMEN_ROLE.figures.map((fig, i) => (
                <motion.div key={fig.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${fig.color}44`, backgroundColor: `${fig.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{fig.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: fig.color }}>{fig.name}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{fig.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: PARCHMENT, marginBottom: 12 }}>Impact & Legacy</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${PARCHMENT}33`, backgroundColor: `${PARCHMENT}08` }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{WOMEN_ROLE.impact}</p>
            </div>
          </section>
        )}

        {/* ─── Treaty of Paris ─── */}
        {activeTab === 'treaty' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🕊️" title="The Treaty of Paris (1783)" />

            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${MUSKET}33`, backgroundColor: `${MUSKET}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{TREATY_OF_PARIS.overview}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: PATRIOT_BLUE, marginBottom: 12 }}>Key Terms</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {TREATY_OF_PARIS.terms.map((term, i) => (
                <motion.div key={term.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${term.color}44`, backgroundColor: `${term.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{term.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: term.color }}>{term.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{term.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: LIBERTY_RED, marginBottom: 12 }}>The Loyalist Exodus</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${LIBERTY_RED}33`, backgroundColor: `${LIBERTY_RED}08` }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{TREATY_OF_PARIS.loyalistExodus}</p>
            </div>
          </section>
        )}

        {/* ─── Creating a Government ─── */}
        {activeTab === 'government' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🏛️" title="From Revolution to Republic — Building a New Government" />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: LIBERTY_RED, marginBottom: 12 }}>Articles of Confederation — The First Attempt</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${LIBERTY_RED}33`, backgroundColor: `${LIBERTY_RED}08`, marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{GOVERNMENT.articles.overview}</p>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${CANNON}33`, backgroundColor: `${CANNON}08`, marginBottom: 24 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginTop: 0, marginBottom: 10 }}>Why the Articles Failed</h4>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {GOVERNMENT.articles.failures.map(f => (
                  <li key={f} style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.6 }}>{f}</li>
                ))}
              </ul>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: PATRIOT_BLUE, marginBottom: 12 }}>The Constitutional Convention (1787)</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${PATRIOT_BLUE}33`, backgroundColor: `${PATRIOT_BLUE}08`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{GOVERNMENT.convention}</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: PARCHMENT, marginBottom: 12 }}>The Bill of Rights (1791)</h3>
            <div style={{ padding: '16px 20px', borderRadius: 10, border: `1px solid ${PARCHMENT}33`, backgroundColor: `${PARCHMENT}08` }}>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{GOVERNMENT.billOfRights}</p>
            </div>
          </section>
        )}

        {/* ─── Legacy ─── */}
        {activeTab === 'legacy' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🌍" title="Legacy — The Revolution's Enduring Impact" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>How a colonial rebellion reshaped the modern world — and the debates it left unresolved.</p>
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
