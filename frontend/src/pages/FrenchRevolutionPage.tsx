/**
 * FrenchRevolutionPage — curated topic page: French Revolution deep-dive.
 *
 * Route: /french-revolution
 *
 * Sections:
 *  1. Hero — "The French Revolution — When the People Seized History (1789–1799)"
 *  2. Tab navigation — switch between sections
 *  3. The Powder Keg — causes (financial, social, intellectual, food crisis)
 *  4. Timeline — year-by-year 1789–1799
 *  5. Key Figures — Louis XVI, Marie Antoinette, Robespierre, Danton, etc.
 *  6. Reign of Terror — triggers, mechanisms, targets, end
 *  7. The Guillotine — invention, statistics, spectacle, symbolism
 *  8. Women in the Revolution — active roles, Olympe de Gouges, suppression
 *  9. Ideas Exported — revolutionary ideals across Europe and the Americas
 * 10. Legacy — Liberté Égalité Fraternité, feudalism's end, nationalism, debate
 *
 * All data is static/curated — no backend API needed.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme — French Revolution palette: tricolore blue/white/red, guillotine grey
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#1e3a8a';     // tricolore blue
const BG = '#0a0c10';         // near-black
const TEXT = '#e8e4de';        // warm off-white
const TEXT_DIM = '#9a9486';    // muted
const TEXT_MUTED = '#6b6458';  // darker muted
const CARD_BG = 'rgba(30,58,138,0.05)';
const CARD_BORDER = 'rgba(30,58,138,0.18)';
const BLUE = '#1e3a8a';       // tricolore blue
const RED = '#b91c1c';        // tricolore red
const WHITE = '#e8e4de';      // tricolore white (off-white for dark bg)
const GOLD = '#c9a84c';       // Versailles gold
const GREY = '#6b7280';       // guillotine steel
const CRIMSON = '#be123c';    // blood red (Terror)
const TEAL = '#0d9488';       // Enlightenment teal
const PURPLE = '#7c3aed';     // royalty purple
const AMBER = '#d97706';      // fire/revolution amber

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type SectionTab = 'causes' | 'timeline' | 'figures' | 'terror' | 'guillotine' | 'women' | 'exported' | 'legacy';

interface Cause {
  title: string;
  icon: string;
  color: string;
  points: string[];
}

interface TimelineYear {
  year: string;
  events: { title: string; detail: string }[];
  color: string;
}

interface Figure {
  name: string;
  dates: string;
  role: string;
  fate: string;
  significance: string;
  color: string;
  icon: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data — Tabs
// ─────────────────────────────────────────────────────────────────────────────

const TABS: { id: SectionTab; label: string }[] = [
  { id: 'causes', label: 'The Powder Keg' },
  { id: 'timeline', label: 'Timeline 1789–1799' },
  { id: 'figures', label: 'Key Figures' },
  { id: 'terror', label: 'Reign of Terror' },
  { id: 'guillotine', label: 'The Guillotine' },
  { id: 'women', label: 'Women' },
  { id: 'exported', label: 'Ideas Exported' },
  { id: 'legacy', label: 'Legacy' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Causes (The Powder Keg)
// ─────────────────────────────────────────────────────────────────────────────

const CAUSES: Cause[] = [
  {
    title: 'Financial Collapse',
    icon: '💰',
    color: GOLD,
    points: [
      'France was effectively bankrupt by 1788 — decades of war spending, including critical financial support for the American Revolution, had drained the treasury.',
      'The court at Versailles consumed roughly 6% of state revenue on lavish upkeep — while the government couldn\'t pay its debts.',
      'Successive finance ministers (Turgot, Necker, Calonne) tried reforms but were blocked by nobles who refused to give up tax exemptions.',
      'By 1789, debt service consumed over 50% of government revenue — the state was literally borrowing to pay interest on previous borrowing.',
    ],
  },
  {
    title: 'Social Inequality: The Three Estates',
    icon: '⚖️',
    color: BLUE,
    points: [
      'The First Estate (clergy) comprised ~0.5% of the population but owned 10% of the land and paid no taxes.',
      'The Second Estate (nobility) comprised ~1.5% of the population, held vast estates, and enjoyed tax exemptions plus feudal dues.',
      'The Third Estate (everyone else — 97%) bore almost the entire tax burden: taille, gabelle, vingtième, plus feudal obligations.',
      'A wealthy bourgeois merchant could pay more in taxes than a noble with ten times his income — the system was visibly, indefensibly unfair.',
    ],
  },
  {
    title: 'Intellectual Ferment: The Enlightenment',
    icon: '📖',
    color: TEAL,
    points: [
      'Locke\'s ideas on natural rights and government by consent had already fueled the American Revolution — French veterans returned with these ideas.',
      'Rousseau\'s "Social Contract" (1762) argued sovereignty belonged to the people, not the king — it became the revolution\'s philosophical engine.',
      'Voltaire\'s savage criticism of the Church and aristocratic privilege was widely read across all literate classes.',
      'Montesquieu\'s "Spirit of the Laws" provided the blueprint for separation of powers — directly influencing the revolutionary constitutions.',
      'Salons, coffeehouses, and an explosion of pamphlets spread these ideas far beyond the elite — even artisans and shopkeepers debated them.',
    ],
  },
  {
    title: 'The Bread Crisis',
    icon: '🍞',
    color: AMBER,
    points: [
      'The harvest of 1788 was catastrophic — drought followed by a devastating hailstorm in July destroyed crops across northern France.',
      'Bread prices soared to their highest level in a generation: a Paris laborer spent 80–90% of his wages just on bread for his family.',
      'The winter of 1788–89 was the coldest in decades, with the Seine freezing over — flour mills couldn\'t grind, compounding the shortage.',
      'Food riots erupted across France well before the Bastille fell — starving people don\'t wait for philosophical justification to revolt.',
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Timeline 1789–1799
// ─────────────────────────────────────────────────────────────────────────────

const TIMELINE: TimelineYear[] = [
  {
    year: '1789',
    color: BLUE,
    events: [
      { title: 'Estates-General Convenes (May 5)', detail: 'First meeting since 1614. Louis XVI called it to address the fiscal crisis, but the Third Estate immediately demanded equal representation and vote by head rather than order.' },
      { title: 'Tennis Court Oath (June 20)', detail: 'Locked out of their meeting hall, Third Estate delegates gathered at a nearby tennis court and swore not to disband until France had a constitution. It was the first direct defiance of royal authority.' },
      { title: 'Storming of the Bastille (July 14)', detail: 'A Parisian mob stormed the Bastille fortress-prison seeking weapons. Only 7 prisoners were inside, but the symbolism was seismic — the people had physically attacked royal power. The governor was killed and his head paraded on a pike.' },
      { title: 'Great Fear (July–August)', detail: 'Peasant revolts swept the countryside. Rumors of aristocratic plots triggered attacks on manor houses, destruction of feudal records, and the effective collapse of the old social order in rural France.' },
      { title: 'Declaration of the Rights of Man and Citizen (August 26)', detail: 'Adopted by the National Assembly, it proclaimed universal rights: liberty, property, security, resistance to oppression. "Men are born and remain free and equal in rights." It became the revolution\'s foundational document.' },
      { title: 'Women\'s March on Versailles (October 5–6)', detail: 'Thousands of market women, furious over bread prices, marched 12 miles from Paris to Versailles. They forced the royal family to return to Paris — the king was now effectively a hostage of the revolution.' },
    ],
  },
  {
    year: '1790',
    color: TEAL,
    events: [
      { title: 'Civil Constitution of the Clergy (July 12)', detail: 'Reorganized the Catholic Church in France: bishops elected by the people, clergy paid by the state, papal authority rejected. It split the clergy and made the Church an enemy of the revolution.' },
      { title: 'Church Property Seized', detail: 'The National Assembly nationalized all Church property — roughly 10% of France\'s land — and used it as backing for assignats (paper currency). The Church lost its economic independence overnight.' },
      { title: 'Fête de la Fédération (July 14)', detail: 'First anniversary of the Bastille, celebrated with a massive festival on the Champ de Mars. Louis XVI swore an oath to the constitution. For a brief moment, national unity seemed possible.' },
    ],
  },
  {
    year: '1791',
    color: PURPLE,
    events: [
      { title: 'Flight to Varennes (June 20–21)', detail: 'Louis XVI and Marie Antoinette attempted to flee France in disguise, heading for the Austrian border. Recognized at Varennes, they were brought back to Paris in humiliation. Any remaining trust in the king evaporated.' },
      { title: 'Champ de Mars Massacre (July 17)', detail: 'National Guard under Lafayette fired on a crowd petitioning for the king\'s removal. Dozens killed. The moderate revolution was already eating its own — a preview of things to come.' },
      { title: 'Constitutional Monarchy Established (September 3)', detail: 'The new constitution made France a constitutional monarchy with a Legislative Assembly. The king retained a suspensive veto. It was an attempt at compromise that satisfied almost no one.' },
    ],
  },
  {
    year: '1792',
    color: RED,
    events: [
      { title: 'War with Austria and Prussia (April 20)', detail: 'France declared war on Austria, beginning two decades of revolutionary and Napoleonic wars. Both sides wanted war — revolutionaries to spread the revolution, Austria to crush it.' },
      { title: 'Brunswick Manifesto (July 25)', detail: 'The Duke of Brunswick threatened to destroy Paris if the royal family was harmed. Instead of intimidating the populace, it enraged them and sealed the king\'s fate.' },
      { title: 'Storming of the Tuileries (August 10)', detail: 'A revolutionary mob attacked the Tuileries Palace. The Swiss Guard was massacred. Louis XVI was suspended from power and imprisoned with his family.' },
      { title: 'September Massacres (September 2–7)', detail: 'Mobs invaded Paris prisons and killed 1,200–1,400 prisoners — priests, nobles, common criminals alike. The killings were partly spontaneous, partly orchestrated. They shocked Europe and radicalized the revolution.' },
      { title: 'First French Republic Declared (September 22)', detail: 'The newly elected National Convention abolished the monarchy and declared France a republic. The revolution had crossed a point of no return.' },
      { title: 'Battle of Valmy (September 20)', detail: 'A French citizen army defeated the Prussian professional army. Goethe, witnessing it, declared: "From this place and from this day forth commences a new era in world history."' },
    ],
  },
  {
    year: '1793',
    color: CRIMSON,
    events: [
      { title: 'Execution of Louis XVI (January 21)', detail: 'Convicted of treason by the Convention, Louis XVI was guillotined at the Place de la Révolution. His last words were drowned out by a drum roll. The execution horrified monarchies across Europe.' },
      { title: 'Committee of Public Safety Formed (April 6)', detail: 'Created to defend the Republic against internal and external enemies. Under Robespierre\'s leadership (from July), it became the instrument of the Terror — a revolutionary dictatorship.' },
      { title: 'Assassination of Marat (July 13)', detail: 'Charlotte Corday, a Girondin sympathizer, stabbed Jean-Paul Marat in his bath. His death made him a revolutionary martyr and accelerated the radicalization.' },
      { title: 'Execution of Marie Antoinette (October 16)', detail: 'The former queen was guillotined after a show trial that included fabricated charges. She was 37. Her hair had turned white during imprisonment.' },
      { title: 'Execution of the Girondins (October 31)', detail: 'Twenty-one leading Girondins (moderate republicans) were guillotined in a single day. The revolution was now devouring its own architects.' },
      { title: 'War in the Vendée', detail: 'Catholic and royalist peasants in western France rose in revolt. The Republic\'s response was devastating — some historians estimate 170,000 died in the suppression, which some scholars consider genocidal.' },
    ],
  },
  {
    year: '1794',
    color: CRIMSON,
    events: [
      { title: 'Execution of Danton (April 5)', detail: 'Georges Danton, once the revolution\'s thundering voice, was guillotined for calling for an end to the Terror. His last words to the executioner: "Show my head to the people — it is worth seeing."' },
      { title: 'Festival of the Supreme Being (June 8)', detail: 'Robespierre attempted to create a new civic religion to replace Christianity. He presided over an elaborate ceremony on the Champ de Mars. Many saw it as proof of his megalomania.' },
      { title: 'Thermidorian Reaction (July 27 — 9 Thermidor)', detail: 'The Convention turned on Robespierre. He was arrested and guillotined the next day along with 21 allies. The Terror ended as suddenly as it began. Over the preceding year, roughly 17,000 had been officially executed; the true death toll (including summary executions) reached 40,000+.' },
    ],
  },
  {
    year: '1795–1798',
    color: GREY,
    events: [
      { title: 'The Directory Established (November 1795)', detail: 'A new constitution created a five-member Directory as executive. It was designed to prevent both monarchy and dictatorship, but proved corrupt, unstable, and incapable of solving France\'s chronic problems.' },
      { title: 'Napoleon\'s Italian Campaign (1796–1797)', detail: 'A young General Bonaparte conquered northern Italy in a brilliant campaign, making himself France\'s most celebrated military figure. He began to see himself as more than a general.' },
      { title: 'Egyptian Campaign (1798–1799)', detail: 'Napoleon invaded Egypt to threaten British India. Militarily inconclusive but culturally transformative — his scholars discovered the Rosetta Stone. He abandoned his army to return to French politics.' },
      { title: 'Ongoing Instability', detail: 'The Directory survived multiple coups, purges, and financial crises. France was exhausted — people yearned for stability, order, and a strong hand. The stage was set for a strongman.' },
    ],
  },
  {
    year: '1799',
    color: AMBER,
    events: [
      { title: 'Coup of 18 Brumaire (November 9)', detail: 'Napoleon Bonaparte overthrew the Directory in a carefully staged coup. He became First Consul — effectively dictator of France. The revolution that had begun with demands for liberty ended with a military strongman.' },
      { title: 'The Revolution Ends', detail: 'In ten years, France had gone from absolute monarchy to constitutional monarchy to republic to revolutionary dictatorship to unstable oligarchy to military dictatorship. The ideals survived; the reality was more complicated.' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Key Figures
// ─────────────────────────────────────────────────────────────────────────────

const FIGURES: Figure[] = [
  {
    name: 'Louis XVI',
    dates: '1754–1793',
    role: 'King of France',
    fate: 'Guillotined January 21, 1793',
    significance: 'Well-meaning but indecisive. Inherited a financial crisis, supported the American Revolution (worsening it), and proved unable to navigate the political storm. His flight to Varennes destroyed the possibility of constitutional monarchy.',
    color: PURPLE,
    icon: '👑',
  },
  {
    name: 'Marie Antoinette',
    dates: '1755–1793',
    role: 'Queen of France',
    fate: 'Guillotined October 16, 1793',
    significance: 'Austrian-born queen who became a symbol of royal excess (though "Let them eat cake" is almost certainly apocryphal). Used as a scapegoat for France\'s problems. Showed remarkable courage during her trial and execution.',
    color: PURPLE,
    icon: '👸',
  },
  {
    name: 'Maximilien Robespierre',
    dates: '1758–1794',
    role: 'Leader of the Committee of Public Safety',
    fate: 'Guillotined July 28, 1794',
    significance: 'The "Incorruptible" — a provincial lawyer who became the revolution\'s most powerful figure. Believed virtue could be imposed through terror. His fall ended the Terror but not the debate: visionary idealist or proto-totalitarian?',
    color: CRIMSON,
    icon: '⚡',
  },
  {
    name: 'Georges Danton',
    dates: '1759–1794',
    role: 'Revolutionary leader, first president of the Committee of Public Safety',
    fate: 'Guillotined April 5, 1794',
    significance: 'The revolution\'s great orator and man of action. Led the defense of France in 1792. When he called for mercy and an end to the Terror, Robespierre had him killed. "Show my head to the people — it is worth seeing."',
    color: RED,
    icon: '🗣️',
  },
  {
    name: 'Jean-Paul Marat',
    dates: '1743–1793',
    role: 'Radical journalist, "Friend of the People"',
    fate: 'Assassinated July 13, 1793',
    significance: 'His newspaper L\'Ami du peuple was the revolution\'s most radical voice, constantly demanding blood. Suffered a skin disease that kept him in the bath where Charlotte Corday stabbed him. David\'s painting of his death became iconic.',
    color: CRIMSON,
    icon: '📰',
  },
  {
    name: 'Marquis de Lafayette',
    dates: '1757–1834',
    role: 'Commander of the National Guard',
    fate: 'Survived — died in 1834',
    significance: 'Hero of the American Revolution who tried to replicate it in France. Proposed the Declaration of the Rights of Man. Too moderate for the radicals, too revolutionary for the royalists. Fled France in 1792 and was imprisoned by Austria.',
    color: BLUE,
    icon: '🇫🇷',
  },
  {
    name: 'Napoleon Bonaparte',
    dates: '1769–1821',
    role: 'General, then First Consul, then Emperor',
    fate: 'Exiled to St. Helena, died 1821',
    significance: 'A Corsican artillery officer who rose through revolutionary meritocracy. Ended the revolution with his 1799 coup but preserved many of its reforms (Napoleonic Code, meritocracy, end of feudalism). Both the revolution\'s heir and its gravedigger.',
    color: AMBER,
    icon: '⚔️',
  },
  {
    name: 'Olympe de Gouges',
    dates: '1748–1793',
    role: 'Playwright, activist, feminist pioneer',
    fate: 'Guillotined November 3, 1793',
    significance: 'Wrote the Declaration of the Rights of Woman and the Female Citizen (1791), arguing the revolution\'s ideals must apply to women. Opposed the execution of Louis XVI. Guillotined for her political writings — the revolution she fought for killed her.',
    color: TEAL,
    icon: '✊',
  },
  {
    name: 'Charlotte Corday',
    dates: '1768–1793',
    role: 'Girondin sympathizer, assassin of Marat',
    fate: 'Guillotined July 17, 1793',
    significance: 'A young Norman woman who believed killing Marat would save France from the Terror. Instead, it accelerated the radicalization. She remained composed at her execution, becoming a figure of tragic heroism for moderates.',
    color: GREY,
    icon: '🗡️',
  },
  {
    name: 'Jacques-Louis David',
    dates: '1748–1825',
    role: 'Painter, revolutionary propagandist',
    fate: 'Survived — exiled after Napoleon\'s fall, died 1825',
    significance: 'The revolution\'s visual propagandist. His paintings — "The Death of Marat," "The Tennis Court Oath," Napoleon\'s coronation — shaped how the world saw (and still sees) the revolution. Art as political weapon.',
    color: GOLD,
    icon: '🎨',
  },
  {
    name: 'Camille Desmoulins',
    dates: '1760–1794',
    role: 'Journalist, orator, friend of Danton and Robespierre',
    fate: 'Guillotined April 5, 1794 (same day as Danton)',
    significance: 'His speech at the Palais Royal on July 12, 1789, helped spark the storming of the Bastille. Later called for clemency in his newspaper Le Vieux Cordelier. Robespierre — his childhood friend — sent him to the guillotine.',
    color: BLUE,
    icon: '📝',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section Components
// ─────────────────────────────────────────────────────────────────────────────

function CausesSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: BLUE, fontSize: '1.8rem', marginBottom: '0.75rem' }}>The Powder Keg: Why France Exploded</h2>
      <p style={{ color: TEXT_DIM, marginBottom: '1.5rem', lineHeight: 1.7 }}>
        The French Revolution wasn't a single event with a single cause — it was the detonation of a powder
        keg that had been filling for decades. Financial collapse, social injustice, new ideas about human
        rights, and sheer hunger all converged in 1789 to produce the most consequential political upheaval
        in modern history.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {CAUSES.map((cause) => (
          <div key={cause.title} style={{
            background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12,
            padding: '1.5rem', borderLeft: `4px solid ${cause.color}`,
          }}>
            <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '1rem' }}>
              <span style={{ marginRight: '0.5rem' }}>{cause.icon}</span>
              {cause.title}
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyle: 'none' }}>
              {cause.points.map((point, i) => (
                <li key={i} style={{ color: TEXT_DIM, lineHeight: 1.7, marginBottom: '0.75rem', position: 'relative', paddingLeft: '0.5rem' }}>
                  <span style={{ position: 'absolute', left: '-1rem', color: cause.color }}>•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(185,28,28,0.06)', border: `1px solid ${RED}33`, borderRadius: 12,
        padding: '1.5rem', marginTop: '1.5rem', borderLeft: `4px solid ${RED}`,
      }}>
        <h3 style={{ color: TEXT, fontSize: '1.1rem', marginBottom: '0.75rem' }}>The Ignition</h3>
        <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
          When Louis XVI convened the Estates-General in May 1789 to address the fiscal crisis, he opened a
          door he couldn't close. The Third Estate — representing 97% of France — refused to be outvoted
          2-to-1 by clergy and nobles. They declared themselves the National Assembly, the people's
          representatives. The revolution had begun not with a bang, but with a vote.
        </p>
      </div>
    </motion.div>
  );
}

function TimelineSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: BLUE, fontSize: '1.8rem', marginBottom: '0.75rem' }}>Year by Year: 1789–1799</h2>
      <p style={{ color: TEXT_DIM, marginBottom: '1.5rem', lineHeight: 1.7 }}>
        Ten years that reshaped the world. From the fall of the Bastille to Napoleon's coup, the revolution
        moved through distinct phases — each more radical than the last, until it consumed itself and handed
        power to a military strongman.
      </p>

      <div style={{ position: 'relative' }}>
        {TIMELINE.map((yr, yi) => (
          <div key={yr.year} style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-block', background: yr.color, color: TEXT,
              fontSize: '1.1rem', fontWeight: 700, padding: '6px 16px', borderRadius: 8,
              marginBottom: '1rem',
            }}>
              {yr.year}
            </div>

            <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: `2px solid ${yr.color}44` }}>
              {yr.events.map((event, i) => (
                <div key={event.title} style={{ marginBottom: i < yr.events.length - 1 ? '1rem' : 0 }}>
                  <div style={{
                    position: 'absolute', left: -5, width: 10, height: 10, borderRadius: '50%',
                    background: yr.color, marginTop: 5,
                  }} />
                  <div style={{
                    background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 10,
                    padding: '1rem',
                  }}>
                    <div style={{ color: TEXT, fontWeight: 600, marginBottom: '0.25rem' }}>{event.title}</div>
                    <div style={{ color: TEXT_DIM, fontSize: '0.9rem', lineHeight: 1.6 }}>{event.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function FiguresSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: BLUE, fontSize: '1.8rem', marginBottom: '0.75rem' }}>Key Figures</h2>
      <p style={{ color: TEXT_DIM, marginBottom: '1.5rem', lineHeight: 1.7 }}>
        The revolution was shaped by extraordinary individuals — kings and queens, lawyers and journalists,
        generals and artists, idealists and fanatics. Most of them died violently. Here are the eleven who
        mattered most.
      </p>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {FIGURES.map((fig) => (
          <div key={fig.name} style={{
            background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12,
            padding: '1.5rem', borderLeft: `4px solid ${fig.color}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ color: TEXT, fontSize: '1.15rem', margin: 0 }}>
                  <span style={{ marginRight: '0.5rem' }}>{fig.icon}</span>
                  {fig.name}
                </h3>
                <div style={{ color: fig.color, fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>{fig.dates}</div>
              </div>
              <div style={{
                background: `${fig.color}22`, color: fig.color, fontSize: '0.75rem', fontWeight: 600,
                padding: '4px 10px', borderRadius: 6,
              }}>
                {fig.role}
              </div>
            </div>
            <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginTop: '0.75rem', marginBottom: '0.5rem' }}>
              {fig.significance}
            </p>
            <div style={{ color: TEXT_MUTED, fontSize: '0.85rem', fontStyle: 'italic' }}>
              Fate: {fig.fate}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TerrorSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: CRIMSON, fontSize: '1.8rem', marginBottom: '0.75rem' }}>The Reign of Terror</h2>
      <p style={{ color: TEXT_DIM, marginBottom: '0.5rem', lineHeight: 1.7, fontStyle: 'italic' }}>
        September 1793 – July 1794
      </p>
      <p style={{ color: TEXT_DIM, marginBottom: '1.5rem', lineHeight: 1.7 }}>
        The most radical and violent phase of the revolution. The Committee of Public Safety, led by
        Robespierre, wielded near-absolute power in the name of defending the Republic. "Terror is nothing
        other than justice, prompt, severe, inflexible," Robespierre declared. It became the template for
        every revolutionary purge that followed.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{
          background: 'rgba(190,18,60,0.06)', border: `1px solid ${CRIMSON}33`, borderRadius: 12,
          padding: '1.5rem', borderLeft: `4px solid ${CRIMSON}`,
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.15rem', marginBottom: '0.75rem' }}>What Triggered It</h3>
          <ul style={{ margin: 0, paddingLeft: '1rem', listStyle: 'none' }}>
            {[
              'France was at war with nearly every major European power simultaneously.',
              'Internal revolts in the Vendée, Lyon, Marseille, and Toulon threatened to split the Republic.',
              'Assassination of Marat (July 1793) convinced radicals that enemies were everywhere.',
              'Food shortages continued — the sans-culottes (urban poor) demanded action against hoarders and speculators.',
              'The Law of Suspects (September 17, 1793) allowed arrest of anyone "suspected" of disloyalty — vague enough to catch almost anyone.',
            ].map((point, i) => (
              <li key={i} style={{ color: TEXT_DIM, lineHeight: 1.7, marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                <span style={{ color: CRIMSON, marginRight: '0.5rem' }}>•</span>{point}
              </li>
            ))}
          </ul>
        </div>

        <div style={{
          background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12,
          padding: '1.5rem', borderLeft: `4px solid ${GREY}`,
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.15rem', marginBottom: '0.75rem' }}>How It Worked</h3>
          <ul style={{ margin: 0, paddingLeft: '1rem', listStyle: 'none' }}>
            {[
              'The Revolutionary Tribunal provided rapid "justice" — trials lasting hours, no right of appeal, only two verdicts: acquittal or death.',
              'Representatives-on-mission fanned out across France with virtually unlimited powers to enforce revolutionary policy.',
              'The Committee of Public Safety issued decrees controlling prices (Maximum), conscripting soldiers (levée en masse), and directing the war effort.',
              'Surveillance committees in every commune reported on suspicious behavior — neighbors informing on neighbors.',
              'The Law of 22 Prairial (June 1794) stripped the accused of defense counsel and made "enemies of the people" subject to death. The killing accelerated dramatically.',
            ].map((point, i) => (
              <li key={i} style={{ color: TEXT_DIM, lineHeight: 1.7, marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                <span style={{ color: GREY, marginRight: '0.5rem' }}>•</span>{point}
              </li>
            ))}
          </ul>
        </div>

        <div style={{
          background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12,
          padding: '1.5rem', borderLeft: `4px solid ${RED}`,
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.15rem', marginBottom: '0.75rem' }}>Who Was Targeted</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginBottom: '0.75rem' }}>
            The Terror's victims came from every class and faction:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {[
              { group: 'Nobles & Clergy', detail: 'Arrested en masse as class enemies' },
              { group: 'Girondins', detail: 'Moderate republicans purged by radicals' },
              { group: 'Hébertists', detail: 'Ultra-radicals who pushed too far left' },
              { group: 'Dantonists', detail: 'Moderates who called for mercy — killed for it' },
              { group: 'Sans-culottes', detail: 'Even working-class allies weren\'t safe' },
              { group: 'Provincial rebels', detail: 'Mass executions in Lyon, Nantes, Vendée' },
            ].map((v) => (
              <div key={v.group} style={{
                background: `${RED}11`, borderRadius: 8, padding: '0.75rem',
                border: `1px solid ${RED}22`,
              }}>
                <div style={{ color: TEXT, fontWeight: 600, fontSize: '0.9rem' }}>{v.group}</div>
                <div style={{ color: TEXT_DIM, fontSize: '0.85rem', marginTop: '0.25rem' }}>{v.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '1.5rem',
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.15rem', marginBottom: '0.75rem' }}>The Numbers</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { stat: '~17,000', label: 'Officially executed by guillotine' },
              { stat: '~10,000', label: 'Died in prison without trial' },
              { stat: '~40,000+', label: 'Total estimated deaths' },
              { stat: '~500,000', label: 'Arrested or detained' },
              { stat: '~85%', label: 'Of victims were Third Estate (commoners)' },
              { stat: '10 months', label: 'Duration of the Great Terror' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ color: CRIMSON, fontSize: '1.5rem', fontWeight: 700 }}>{s.stat}</div>
                <div style={{ color: TEXT_DIM, fontSize: '0.85rem', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'rgba(201,168,76,0.06)', border: `1px solid ${GOLD}33`, borderRadius: 12,
          padding: '1.5rem', borderLeft: `4px solid ${GOLD}`,
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.15rem', marginBottom: '0.75rem' }}>Why It Ended</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            By July 1794, the Terror had become self-devouring. Robespierre had executed Danton and the
            moderates, executed Hébert and the ultra-radicals, and was hinting at a new purge — but wouldn't
            say who was on the list. Terrified Convention members realized they might be next. On 9 Thermidor
            (July 27), they shouted Robespierre down, arrested him, and guillotined him the next day. The
            machinery of Terror was dismantled almost overnight — not from moral awakening, but from
            self-preservation.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function GuillotineSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: GREY, fontSize: '1.8rem', marginBottom: '0.75rem' }}>The Guillotine</h2>
      <p style={{ color: TEXT_DIM, marginBottom: '1.5rem', lineHeight: 1.7 }}>
        The revolution's most iconic instrument was, paradoxically, designed as a humanitarian reform.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{
          background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12,
          padding: '1.5rem', borderLeft: `4px solid ${TEAL}`,
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.15rem', marginBottom: '0.75rem' }}>Invention & Context</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            Dr. Joseph-Ignace Guillotin did not invent the device — he proposed that all executions use a
            painless, egalitarian method instead of the class-based system where nobles were beheaded (quick)
            and commoners were hanged, broken on the wheel, or burned (slow and agonizing). The actual machine
            was designed by surgeon Antoine Louis and built by Tobias Schmidt. It was first used on April 25,
            1792. The cruel irony: a machine designed to reduce suffering became the symbol of mass death.
          </p>
        </div>

        <div style={{
          background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12,
          padding: '1.5rem', borderLeft: `4px solid ${RED}`,
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.15rem', marginBottom: '0.75rem' }}>By the Numbers</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { stat: '~17,000', label: 'Official guillotine executions during the Revolution' },
              { stat: '~1/70 second', label: 'Time for the blade to fall' },
              { stat: '2,639', label: 'Executions in Paris alone during the Terror' },
              { stat: '1977', label: 'Year France finally abolished the guillotine' },
            ].map((s) => (
              <div key={s.label} style={{
                background: `${RED}11`, borderRadius: 8, padding: '1rem', textAlign: 'center',
                border: `1px solid ${RED}22`,
              }}>
                <div style={{ color: RED, fontSize: '1.3rem', fontWeight: 700 }}>{s.stat}</div>
                <div style={{ color: TEXT_DIM, fontSize: '0.85rem', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12,
          padding: '1.5rem', borderLeft: `4px solid ${AMBER}`,
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.15rem', marginBottom: '0.75rem' }}>Public Spectacle</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            Executions were public events. Crowds gathered at the Place de la Révolution (now Place de la
            Concorde), vendors sold programs listing the day's condemned, and women known as tricoteuses
            (knitters) sat by the scaffold knitting while heads fell. Executioner Charles-Henri Sanson
            performed over 2,700 executions. He was a professional who expressed private horror at the
            industrialization of death. The spectacle was both entertainment and political theater — a
            visible demonstration that the revolution would destroy its enemies.
          </p>
        </div>

        <div style={{
          background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12,
          padding: '1.5rem', borderLeft: `4px solid ${BLUE}`,
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.15rem', marginBottom: '0.75rem' }}>Symbolism</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            The guillotine embodied the revolution's contradictions. It was egalitarian — king and peasant
            died the same way. It was rational — designed by physicians for maximum efficiency. It was public —
            democratic in its terrible visibility. And it was insatiable — the easier death became, the more
            deaths there were. It remains the most potent symbol of how revolutionary idealism can become
            mechanized violence. Dickens captured it perfectly: "It was the best of times, it was the
            worst of times."
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function WomenSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: TEAL, fontSize: '1.8rem', marginBottom: '0.75rem' }}>Women in the Revolution</h2>
      <p style={{ color: TEXT_DIM, marginBottom: '1.5rem', lineHeight: 1.7 }}>
        Women were essential to the French Revolution — as organizers, protestors, writers, and fighters. The
        revolution proclaimed universal rights but refused to extend them to half the population. Women who
        demanded inclusion were silenced, imprisoned, or killed.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{
          background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12,
          padding: '1.5rem', borderLeft: `4px solid ${AMBER}`,
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.15rem', marginBottom: '0.75rem' }}>Active Roles</h3>
          <ul style={{ margin: 0, paddingLeft: '1rem', listStyle: 'none' }}>
            {[
              'The October Days (1789): Market women organized and led the march on Versailles — the most consequential popular action of the revolution\'s first year.',
              'Women ran political clubs, notably the Society of Revolutionary Republican Women (1793), which demanded price controls, arming of women, and enforcement of revolutionary laws.',
              'Women served as spies, couriers, and occasionally fighters. Some disguised themselves as men to join the revolutionary armies.',
              'Market women (les Halles) and laundresses were a powerful political force — their collective action over bread prices drove key moments of radicalization.',
            ].map((point, i) => (
              <li key={i} style={{ color: TEXT_DIM, lineHeight: 1.7, marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                <span style={{ color: AMBER, marginRight: '0.5rem' }}>•</span>{point}
              </li>
            ))}
          </ul>
        </div>

        <div style={{
          background: 'rgba(13,148,136,0.06)', border: `1px solid ${TEAL}33`, borderRadius: 12,
          padding: '1.5rem', borderLeft: `4px solid ${TEAL}`,
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.15rem', marginBottom: '0.75rem' }}>Declaration of the Rights of Woman (1791)</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginBottom: '1rem' }}>
            Olympe de Gouges wrote her <em>Declaration of the Rights of Woman and the Female Citizen</em> as
            a direct response to the 1789 Declaration of the Rights of Man. Article by article, she mirrored
            the original and extended every right to women.
          </p>
          <div style={{
            background: `${TEAL}11`, borderRadius: 8, padding: '1rem', border: `1px solid ${TEAL}22`,
            fontStyle: 'italic', color: TEXT_DIM, lineHeight: 1.7,
          }}>
            "Woman is born free and lives equal to man in her rights... Woman has the right to mount the
            scaffold; she must equally have the right to mount the rostrum."
            <div style={{ color: TEAL, fontStyle: 'normal', marginTop: '0.5rem', fontSize: '0.85rem' }}>
              — Olympe de Gouges, 1791
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(185,28,28,0.06)', border: `1px solid ${RED}33`, borderRadius: 12,
          padding: '1.5rem', borderLeft: `4px solid ${RED}`,
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.15rem', marginBottom: '0.75rem' }}>Suppression</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            The revolution's men had no intention of sharing power. In October 1793, the Convention banned all
            women's political clubs. Olympe de Gouges was guillotined in November 1793. The official
            justification was revealing: women who involved themselves in politics were "unnatural." The
            Napoleonic Code (1804) went further, stripping women of property rights and legal autonomy. It
            would take until 1944 for French women to gain the vote — 155 years after the revolution that
            proclaimed universal rights.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ExportedSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: BLUE, fontSize: '1.8rem', marginBottom: '0.75rem' }}>Ideas Exported: Revolution Goes Global</h2>
      <p style={{ color: TEXT_DIM, marginBottom: '1.5rem', lineHeight: 1.7 }}>
        The French Revolution didn't stay in France. Its ideas — popular sovereignty, constitutionalism, the
        abolition of feudalism, the rights of man — radiated outward and ignited movements across Europe,
        the Americas, and eventually the world.
      </p>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {[
          {
            region: 'Haiti (1791–1804)',
            detail: 'The revolution\'s Declaration of the Rights of Man inspired enslaved people in Saint-Domingue to demand the same rights. The Haitian Revolution — the only successful large-scale slave revolt in history — created the world\'s first Black republic. France\'s revolutionaries, who proclaimed universal rights, initially refused to extend them to enslaved people. The contradiction was explosive.',
            color: AMBER,
          },
          {
            region: 'Latin America (1810s–1820s)',
            detail: 'Simón Bolívar, José de San Martín, and other independence leaders explicitly invoked French revolutionary ideals. The collapse of Spanish authority (partly caused by Napoleon\'s invasion of Spain, itself a consequence of the revolution) created the opening. Constitutions across the new republics echoed the Declaration of the Rights of Man.',
            color: TEAL,
          },
          {
            region: 'Ireland (1798)',
            detail: 'The Society of United Irishmen, inspired by French revolutionary republicanism, launched the Irish Rebellion of 1798. France sent an invasion fleet to support the rebels (it failed). The uprising was crushed but planted seeds for Irish nationalism that endured for centuries.',
            color: '#166534',
          },
          {
            region: 'Europe: The Revolutionary Wars',
            detail: 'French armies carried revolutionary ideas across Europe at bayonet-point. Feudalism was abolished in conquered territories. New constitutions were imposed. Local elites were overthrown. Even after Napoleon\'s defeat, the old order could never fully be restored — people had seen an alternative.',
            color: BLUE,
          },
          {
            region: 'The 1848 Revolutions',
            detail: 'Half a century later, the "Springtime of Nations" swept Europe — revolutions in France, Germany, Italy, Austria, Hungary, and beyond. Every one invoked the spirit of 1789. The tricolor, the barricade, the declaration of rights — all were French Revolution legacies.',
            color: RED,
          },
          {
            region: 'Modern Revolutionary Movements',
            detail: 'From the Russian Revolution to anti-colonial movements to the Arab Spring, the French Revolution\'s template — mass mobilization, constitutional demands, radical phase, reaction — recurs again and again. The "Marseillaise" remains the world\'s most recognizable revolutionary anthem.',
            color: CRIMSON,
          },
        ].map((item) => (
          <div key={item.region} style={{
            background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12,
            padding: '1.5rem', borderLeft: `4px solid ${item.color}`,
          }}>
            <h3 style={{ color: TEXT, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.region}</h3>
            <p style={{ color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>{item.detail}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LegacySection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: BLUE, fontSize: '1.8rem', marginBottom: '0.75rem' }}>Legacy: Liberté, Égalité, Fraternité</h2>
      <p style={{ color: TEXT_DIM, marginBottom: '1.5rem', lineHeight: 1.7 }}>
        The French Revolution's legacy is immense, contradictory, and still debated. It created the modern
        world — and the modern world's problems.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{
          background: 'rgba(30,58,138,0.08)', border: `1px solid ${BLUE}33`, borderRadius: 12,
          padding: '1.5rem', borderLeft: `4px solid ${BLUE}`,
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>Liberté, Égalité, Fraternité</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            The revolution's motto became the foundation of modern democratic politics. The idea that all
            citizens are born equal in rights, that government derives its legitimacy from the people, and
            that solidarity binds a political community — these were revolutionary in 1789. Today they are
            so foundational that we forget someone had to fight and die for them. Every democracy on Earth
            owes a debt to the French Revolution, even if most prefer to forget the blood.
          </p>
        </div>

        <div style={{
          background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '1.5rem',
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>What It Destroyed</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Feudalism', detail: 'The abolition of feudal privileges on the Night of August 4, 1789 ended a system that had structured European society for a millennium.' },
              { label: 'Divine Right of Kings', detail: 'By executing Louis XVI, the revolution declared that no ruler was above the people\'s judgment. Monarchy survived in Europe, but never again unchallenged.' },
              { label: 'Church-State Fusion', detail: 'The Civil Constitution of the Clergy began the separation of church and state that defines modern secular governance.' },
              { label: 'Hereditary Privilege', detail: 'Titles of nobility were abolished. For the first time, careers were formally open to talent rather than birth.' },
            ].map((item) => (
              <div key={item.label} style={{ background: `${RED}08`, borderRadius: 8, padding: '1rem', border: `1px solid ${RED}18` }}>
                <div style={{ color: TEXT, fontWeight: 600, marginBottom: '0.25rem' }}>{item.label}</div>
                <div style={{ color: TEXT_DIM, fontSize: '0.9rem', lineHeight: 1.6 }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '1.5rem',
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>What It Created</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Modern Nationalism', detail: 'The revolution invented the idea of the "nation" as a political community of citizens rather than subjects of a monarch. This transformed world politics — for better and worse.' },
              { label: 'Citizen Armies', detail: 'The levée en masse (mass conscription) created armies motivated by ideology, not feudal obligation. It changed warfare forever and gave France a decisive advantage.' },
              { label: 'The Metric System', detail: 'Adopted in 1795 as a rational, universal system of measurement — perhaps the revolution\'s most unambiguously positive legacy.' },
              { label: 'Modern Political Spectrum', detail: 'The terms "left" and "right" come from the French Revolution — literally from where delegates sat in the National Assembly.' },
            ].map((item) => (
              <div key={item.label} style={{ background: `${BLUE}08`, borderRadius: 8, padding: '1rem', border: `1px solid ${BLUE}18` }}>
                <div style={{ color: TEXT, fontWeight: 600, marginBottom: '0.25rem' }}>{item.label}</div>
                <div style={{ color: TEXT_DIM, fontSize: '0.9rem', lineHeight: 1.6 }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'rgba(201,168,76,0.06)', border: `1px solid ${GOLD}33`, borderRadius: 12,
          padding: '1.5rem', borderLeft: `4px solid ${GOLD}`,
        }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>The Debate: Did It Succeed or Devour Itself?</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ background: `${TEAL}11`, borderRadius: 8, padding: '1rem', border: `1px solid ${TEAL}22` }}>
              <div style={{ color: TEAL, fontWeight: 600, marginBottom: '0.5rem' }}>The Case for Success</div>
              <p style={{ color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>
                Feudalism ended. Universal rights were proclaimed. Careers opened to talent. The Napoleonic Code
                rationalized law across Europe. Democracy, however imperfectly, triumphed. The world the
                revolution created — for all its flaws — is immeasurably freer than the one it destroyed.
              </p>
            </div>
            <div style={{ background: `${CRIMSON}11`, borderRadius: 8, padding: '1rem', border: `1px solid ${CRIMSON}22` }}>
              <div style={{ color: CRIMSON, fontWeight: 600, marginBottom: '0.5rem' }}>The Case Against</div>
              <p style={{ color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>
                The revolution that proclaimed liberty produced the Terror. It proclaimed equality but excluded
                women. It promised fraternity but descended into factional slaughter. It ended not with
                democracy but with a military dictatorship that plunged Europe into twenty years of war and
                millions of deaths. Zhou Enlai's famous quip — "It's too early to say" — may be apocryphal,
                but it captures a truth: we're still living with the consequences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────

export default function FrenchRevolutionPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('causes');

  const renderSection = () => {
    switch (activeTab) {
      case 'causes': return <CausesSection />;
      case 'timeline': return <TimelineSection />;
      case 'figures': return <FiguresSection />;
      case 'terror': return <TerrorSection />;
      case 'guillotine': return <GuillotineSection />;
      case 'women': return <WomenSection />;
      case 'exported': return <ExportedSection />;
      case 'legacy': return <LegacySection />;
      default: return <CausesSection />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: "'Inter', sans-serif" }}>
      {/* Back link */}
      <div style={{ padding: '1rem 2rem' }}>
        <Link to="/" style={{ color: BLUE, textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Back to Chronicle
        </Link>
      </div>

      {/* Hero */}
      <header style={{
        textAlign: 'center', padding: '3rem 2rem 2rem',
        background: `linear-gradient(135deg, ${BG} 0%, rgba(30,58,138,0.08) 50%, rgba(185,28,28,0.06) 100%)`,
        borderBottom: `1px solid ${CARD_BORDER}`,
      }}>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 800, color: TEXT, lineHeight: 1.2, maxWidth: 900, margin: '0 auto' }}>
          The French Revolution
        </h1>
        <p style={{ color: BLUE, fontSize: 'clamp(1rem, 2vw, 1.3rem)', marginTop: '0.75rem', fontWeight: 500 }}>
          When the People Seized History (1789–1799)
        </p>
        <p style={{ color: TEXT_DIM, fontSize: '0.95rem', marginTop: '1rem', maxWidth: 700, margin: '1rem auto 0', lineHeight: 1.6 }}>
          In ten years, France destroyed a thousand-year-old feudal order, executed its king,
          proclaimed universal human rights, descended into revolutionary terror, and handed power
          to a military dictator who would reshape Europe. Nothing was ever the same again.
        </p>

        {/* Tricolore accent bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginTop: '1.5rem' }}>
          <div style={{ width: 60, height: 4, background: BLUE, borderRadius: '4px 0 0 4px' }} />
          <div style={{ width: 60, height: 4, background: WHITE }} />
          <div style={{ width: 60, height: 4, background: RED, borderRadius: '0 4px 4px 0' }} />
        </div>
      </header>

      {/* Tab Navigation */}
      <nav style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.25rem', padding: '1rem 2rem',
        borderBottom: `1px solid ${CARD_BORDER}`, background: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
              background: activeTab === tab.id ? BLUE : 'transparent',
              color: activeTab === tab.id ? WHITE : TEXT_DIM,
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
        <AnimatePresence mode="wait">
          <div key={activeTab}>
            {renderSection()}
          </div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: `1px solid ${CARD_BORDER}`, color: TEXT_MUTED, fontSize: '0.8rem' }}>
        Chronicle — French Revolution Deep Dive | All data curated from historical sources
      </footer>
    </div>
  );
}
