/**
 * EnlightenmentPage — deep-dive into the Age of Enlightenment (1685–1815).
 *
 * Route: /enlightenment
 *
 * Sections:
 *  1. Hero — title, subtitle, key stats
 *  2. What Was the Enlightenment — overview
 *  3. Core Ideas — 8 revolutionary ideas with implications
 *  4. Key Figures — 13+ thinkers with bios
 *  5. The Salons — intellectual culture of the Enlightenment
 *  6. Enlightenment → Revolution — direct causal links
 *  7. Counter-Enlightenment — Romanticism pushes back
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type IdeaCategory = 'Politics' | 'Economics' | 'Science' | 'Rights' | 'Society';

interface CoreIdea {
  title: string;
  thinker: string;
  implication: string;
  detail: string;
  category: IdeaCategory;
}

interface KeyFigure {
  name: string;
  years: string;
  summary: string;
  detail: string;
  nationality: string;
}

interface RevolutionLink {
  idea: string;
  thinker: string;
  outcome: string;
  year: string;
  color: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STAGGER = 0.04;

const CATEGORY_COLORS: Record<IdeaCategory, string> = {
  Politics: '#a855f7',
  Economics: '#22c55e',
  Science: '#3b82f6',
  Rights: '#f59e0b',
  Society: '#ec4899',
};

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const CORE_IDEAS: CoreIdea[] = [
  {
    title: 'Natural Rights',
    thinker: 'John Locke',
    implication: 'Governments exist to protect life, liberty, and property — not the reverse. If they fail, the people may revolt.',
    detail: 'Locke\'s Two Treatises of Government (1689) argued that rights are not granted by kings but are inherent in human nature. This was dynamite: it meant no monarch ruled by divine right. Jefferson would lift this framework almost verbatim for the Declaration of Independence.',
    category: 'Rights',
  },
  {
    title: 'Social Contract',
    thinker: 'Jean-Jacques Rousseau',
    implication: 'Government legitimacy comes from the consent of the governed — sovereignty belongs to the people.',
    detail: 'Rousseau\'s The Social Contract (1762) opened with "Man is born free, and everywhere he is in chains." He argued that legitimate political authority must rest on a social contract agreed upon by all citizens. His concept of the "general will" directly fueled the French Revolution.',
    category: 'Politics',
  },
  {
    title: 'Separation of Powers',
    thinker: 'Montesquieu',
    implication: 'Executive, legislative, and judicial branches must be separate to prevent tyranny.',
    detail: 'In The Spirit of the Laws (1748), Montesquieu studied governments ancient and modern and concluded that liberty requires the separation and balance of powers. Madison, Hamilton, and the Framers used this as the architectural blueprint for the US Constitution.',
    category: 'Politics',
  },
  {
    title: 'Free Market Economics',
    thinker: 'Adam Smith',
    implication: 'The "invisible hand" of self-interest, channeled through markets, produces collective prosperity better than state planning.',
    detail: 'The Wealth of Nations (1776) argued that division of labor, free trade, and competition — not mercantilism — create wealth. Smith wasn\'t celebrating greed; he was describing a system where self-interest, properly channeled, serves the public good. This became capitalism\'s intellectual foundation.',
    category: 'Economics',
  },
  {
    title: 'Religious Tolerance',
    thinker: 'Voltaire',
    implication: 'No one should be persecuted for their beliefs. "Écrasez l\'infâme" — crush the infamous thing (fanaticism and intolerance).',
    detail: 'Voltaire spent years in exile and prison for his critiques of the Church and French aristocracy. His Treatise on Tolerance (1763) argued that religious persecution was both immoral and irrational. His wit and satire made Enlightenment ideas accessible to a broad audience.',
    category: 'Society',
  },
  {
    title: 'Scientific Method',
    thinker: 'Newton & Bacon',
    implication: 'Truth comes from empirical observation and experiment — not scripture, tradition, or authority.',
    detail: 'Francis Bacon laid the philosophical groundwork: knowledge comes from systematic observation, not deduction from first principles. Newton proved it spectacularly — his Principia (1687) explained gravity, motion, and the cosmos with mathematical precision. If nature followed laws discoverable by reason, perhaps society could too.',
    category: 'Science',
  },
  {
    title: 'Universal Education',
    thinker: 'Condorcet',
    implication: 'Enlightenment should reach all people — education is the engine of human progress.',
    detail: 'The Marquis de Condorcet argued in his Sketch for a Historical Picture of the Progress of the Human Mind (1795) that humanity was on an irreversible march toward perfection through education and reason. He proposed universal public education, equal for men and women — radical for the 18th century.',
    category: 'Society',
  },
  {
    title: 'Prison & Justice Reform',
    thinker: 'Cesare Beccaria',
    implication: 'Torture and capital punishment are barbaric. Justice should be proportional, certain, and swift — not cruel.',
    detail: 'Beccaria\'s On Crimes and Punishments (1764) was a sensation across Europe. He argued that the purpose of criminal justice is deterrence, not revenge. Punishment should fit the crime, torture produces false confessions, and the death penalty is neither useful nor necessary. These ideas shaped modern criminal justice systems worldwide.',
    category: 'Rights',
  },
];

const KEY_FIGURES: KeyFigure[] = [
  {
    name: 'René Descartes',
    years: '1596–1650',
    summary: '"I think, therefore I am" — rationalism and coordinate geometry',
    detail: 'Descartes is the father of modern philosophy. His Meditations (1641) began by doubting everything — senses, memory, even mathematics — until he reached one certainty: "Cogito, ergo sum." He also invented the Cartesian coordinate system, bridging algebra and geometry.',
    nationality: '🇫🇷 French',
  },
  {
    name: 'John Locke',
    years: '1632–1704',
    summary: 'Natural rights, tabula rasa, and the foundation of liberal democracy',
    detail: 'Locke\'s Two Treatises of Government argued for natural rights and government by consent. His Essay Concerning Human Understanding proposed the mind as a "blank slate" — knowledge comes from experience, not innate ideas. Jefferson called him one of the three greatest men who ever lived.',
    nationality: '🇬🇧 English',
  },
  {
    name: 'Isaac Newton',
    years: '1643–1727',
    summary: 'Principia, gravity, calculus — the hero of the Enlightenment',
    detail: 'Newton\'s Principia Mathematica (1687) unified terrestrial and celestial mechanics with three laws of motion and universal gravitation. He co-invented calculus, discovered the spectrum of light, and showed the universe runs on discoverable mathematical laws. Alexander Pope wrote: "Nature and Nature\'s laws lay hid in night: God said, Let Newton be! and all was light."',
    nationality: '🇬🇧 English',
  },
  {
    name: 'Voltaire',
    years: '1694–1778',
    summary: 'Candide, religious tolerance, and wit as a weapon against tyranny',
    detail: 'Voltaire was the Enlightenment\'s greatest popularizer. Exiled to England, he brought back admiration for Newton and Locke. Candide (1759) savaged philosophical optimism. He fought for judicial reform after the Calas affair. His 20,000+ letters are a portrait of 18th-century intellectual life.',
    nationality: '🇫🇷 French',
  },
  {
    name: 'Montesquieu',
    years: '1689–1755',
    summary: 'Spirit of the Laws and the separation of powers',
    detail: 'Charles-Louis de Secondat, Baron de Montesquieu, studied comparative government for twenty years before publishing The Spirit of the Laws (1748). His analysis of the English system — separating executive, legislative, and judicial power — became the direct blueprint for the US Constitution and countless democracies since.',
    nationality: '🇫🇷 French',
  },
  {
    name: 'David Hume',
    years: '1711–1776',
    summary: 'Scottish Enlightenment — empiricism and skepticism of miracles',
    detail: 'Hume pushed empiricism to its logical extremes. We can\'t prove causation — only observe "constant conjunction." Miracles violate the laws of nature, so the evidence for them can never be sufficient. His philosophy was so unsettling that Kant said Hume "woke him from his dogmatic slumber."',
    nationality: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scottish',
  },
  {
    name: 'Jean-Jacques Rousseau',
    years: '1712–1778',
    summary: 'Social contract, general will, and inspiration for the French Revolution',
    detail: 'Rousseau was the Enlightenment\'s most paradoxical figure. He celebrated nature over civilization ("Man is born free...") yet designed the social contract that justified the state. His concept of the "general will" inspired Robespierre and the Jacobins. Émile (1762) revolutionized education theory.',
    nationality: '🇨🇭 Genevan',
  },
  {
    name: 'Adam Smith',
    years: '1723–1790',
    summary: 'Wealth of Nations — capitalism, division of labor, the invisible hand',
    detail: 'Smith was a moral philosopher first — The Theory of Moral Sentiments (1759) argued empathy is the basis of morality. The Wealth of Nations (1776) then showed how self-interest in free markets produces collective prosperity. He wasn\'t a laissez-faire absolutist: he supported public education, infrastructure, and regulation of banking.',
    nationality: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scottish',
  },
  {
    name: 'Immanuel Kant',
    years: '1724–1804',
    summary: '"Sapere aude" — dare to know. The categorical imperative.',
    detail: 'Kant\'s essay "What Is Enlightenment?" (1784) defined the movement: "Dare to know! Have the courage to use your own understanding." His Critique of Pure Reason synthesized rationalism and empiricism. The categorical imperative — act only by rules you\'d want to be universal laws — remains foundational to ethics.',
    nationality: '🇩🇪 Prussian',
  },
  {
    name: 'Benjamin Franklin',
    years: '1706–1790',
    summary: 'Electricity, diplomacy, and American Founding Father',
    detail: 'Franklin embodied the Enlightenment ideal: self-made, scientifically curious, politically engaged. His electricity experiments were world-famous. As diplomat to France, he secured the alliance that won the Revolution. He helped draft the Declaration of Independence and the Constitution. His Autobiography became a model of self-improvement.',
    nationality: '🇺🇸 American',
  },
  {
    name: 'Thomas Jefferson',
    years: '1743–1826',
    summary: '"All men are created equal" — Declaration of Independence',
    detail: 'Jefferson channeled Locke into the most consequential sentence in political history: "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights." Yet the slaveholder who wrote those words is the Enlightenment\'s greatest contradiction.',
    nationality: '🇺🇸 American',
  },
  {
    name: 'Mary Wollstonecraft',
    years: '1759–1797',
    summary: 'A Vindication of the Rights of Woman — proto-feminism',
    detail: 'Wollstonecraft argued in her Vindication (1792) that women are not naturally inferior — they only appear so because of lack of education. If Enlightenment principles of reason and rights apply to all humans, they must apply to women. Her daughter, Mary Shelley, would write Frankenstein.',
    nationality: '🇬🇧 English',
  },
  {
    name: 'Denis Diderot',
    years: '1713–1784',
    summary: 'Encyclopédie — 28 volumes systematizing all human knowledge',
    detail: 'Diderot spent 25 years editing the Encyclopédie (1751–1772), enlisting 150+ contributors including Voltaire, Rousseau, and d\'Alembert. Its 72,000 articles aimed to collect and organize all human knowledge. It was banned twice by the French government and placed on the papal Index — which only increased demand.',
    nationality: '🇫🇷 French',
  },
];

const REVOLUTION_LINKS: RevolutionLink[] = [
  {
    idea: 'Natural Rights',
    thinker: 'John Locke',
    outcome: 'American Declaration of Independence — "Life, Liberty, and the pursuit of Happiness" is Locke\'s "life, liberty, and property" with one word changed.',
    year: '1776',
    color: '#3b82f6',
  },
  {
    idea: 'Separation of Powers',
    thinker: 'Montesquieu',
    outcome: 'US Constitution — three branches of government, checks and balances. Madison called The Spirit of the Laws the "oracle" of constitutional design.',
    year: '1787',
    color: '#a855f7',
  },
  {
    idea: 'Social Contract',
    thinker: 'Rousseau',
    outcome: 'French Revolution — the Declaration of the Rights of Man and Citizen proclaimed sovereignty belongs to the nation, not the king.',
    year: '1789',
    color: '#ef4444',
  },
  {
    idea: 'Prison Reform',
    thinker: 'Beccaria',
    outcome: 'Modern criminal justice — proportional sentencing, abolition of torture, presumption of innocence. The US Bill of Rights\' 8th Amendment bans "cruel and unusual punishments."',
    year: '1791',
    color: '#22c55e',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#070e22',
      color: '#f1f5f9',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

function SectionWrapper({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section style={{
      padding: '32px 32px 28px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <h2 style={{
        fontSize: 13,
        fontWeight: 700,
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{
      padding: '10px 16px',
      borderRadius: 8,
      backgroundColor: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>
        {value}
      </div>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginTop: 2,
      }}>
        {label}
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section style={{
      padding: '48px 32px 32px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'linear-gradient(180deg, rgba(168,85,247,0.08) 0%, transparent 100%)',
    }}>
      <Link to="/" style={{
        fontSize: 13,
        color: '#64748b',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 24,
      }}>
        ← Back to Timeline
      </Link>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 40 }}>💡</span>
        <div>
          <h1 style={{
            fontSize: 'clamp(24px, 4.5vw, 42px)',
            fontWeight: 800,
            color: '#f1f5f9',
            lineHeight: 1.15,
            margin: 0,
          }}>
            The Age of Reason — The Enlightenment
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 2vw, 17px)',
            color: '#94a3b8',
            marginTop: 6,
            margin: '6px 0 0',
            lineHeight: 1.4,
          }}>
            When humanity dared to think for itself — and changed politics, science, and society forever (1685–1815)
          </p>
        </div>
      </div>

      <p style={{
        fontSize: 14,
        color: '#94a3b8',
        lineHeight: 1.7,
        maxWidth: 680,
        margin: '0 0 24px',
      }}>
        A philosophical revolution championing reason, individualism, and skepticism of
        authority — both church and crown. The Enlightenment gave humanity democracy,
        human rights, modern science, and the radical idea that all people are born equal.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 10,
      }}>
        <StatBadge value="1685–1815" label="Span" />
        <StatBadge value="8" label="Core Ideas" />
        <StatBadge value="13+" label="Key Thinkers" />
        <StatBadge value="3" label="Revolutions Sparked" />
      </div>
    </section>
  );
}

function WhatWasSection() {
  return (
    <SectionWrapper title="What Was the Enlightenment?" icon="🔍">
      <div style={{
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <p style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.7, margin: '0 0 12px' }}>
          The Enlightenment was the intellectual earthquake that shattered the old world order. For centuries,
          authority rested on tradition, scripture, and the divine right of kings. Then, starting in the late
          17th century, a generation of philosophers, scientists, and writers began asking dangerous questions:
        </p>
        <div style={{
          padding: '16px 20px',
          borderRadius: 8,
          backgroundColor: 'rgba(168,85,247,0.08)',
          border: '1px solid rgba(168,85,247,0.15)',
          marginBottom: 12,
        }}>
          <p style={{ fontSize: 14, color: '#c4b5fd', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
            What if truth comes from reason and evidence, not authority? What if all people have
            inherent rights? What if the purpose of government is to serve the people, not rule them?
          </p>
        </div>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
          These weren't abstract musings — they were blueprints for revolution. Within a century, the ideas
          born in European salons and coffeehouses would topple monarchies, create constitutions, abolish
          torture, and launch the scientific revolution. Immanuel Kant captured the movement's spirit in
          two Latin words: <strong style={{ color: '#e2e8f0' }}>Sapere aude</strong> — dare to know.
        </p>
      </div>
    </SectionWrapper>
  );
}

function CoreIdeasSection() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <SectionWrapper title="Core Enlightenment Ideas" icon="⚡">
      <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginTop: 0, marginBottom: 20 }}>
        Eight ideas that remade the world. Click any card for the full story.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 14,
      }}>
        {CORE_IDEAS.map((idea, i) => {
          const isExpanded = expandedIdx === i;
          const color = CATEGORY_COLORS[idea.category];
          return (
            <motion.div
              key={idea.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * STAGGER, duration: 0.35, ease: 'easeOut' }}
              onClick={() => setExpandedIdx(isExpanded ? null : i)}
              style={{
                padding: 20,
                borderRadius: 10,
                backgroundColor: isExpanded ? `${color}0d` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isExpanded ? `${color}33` : 'rgba(255,255,255,0.08)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color,
                  backgroundColor: `${color}18`,
                  padding: '2px 8px',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {idea.category}
                </span>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  {idea.thinker}
                </span>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px' }}>
                {idea.title}
              </h3>
              <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.6, margin: '0 0 0' }}>
                {idea.implication}
              </p>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{
                      fontSize: 13,
                      color: '#94a3b8',
                      lineHeight: 1.65,
                      margin: '12px 0 0',
                      paddingTop: 12,
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      {idea.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{
                fontSize: 11,
                color: '#475569',
                marginTop: 10,
                fontStyle: 'italic',
              }}>
                {isExpanded ? '↑ click to collapse' : '↓ click to expand'}
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

function KeyFiguresSection() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <SectionWrapper title="Key Figures" icon="🧠">
      <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginTop: 0, marginBottom: 20 }}>
        The thinkers who dared to reason — and changed the world. Click any figure to read more.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {KEY_FIGURES.map((figure, i) => {
          const isExpanded = expandedIdx === i;
          return (
            <motion.div
              key={figure.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * STAGGER, duration: 0.4, ease: 'easeOut' }}
              onClick={() => setExpandedIdx(isExpanded ? null : i)}
              style={{
                display: 'flex',
                gap: 16,
                padding: '16px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                alignItems: 'flex-start',
              }}
            >
              {/* Years */}
              <div style={{
                minWidth: 90,
                fontFamily: 'monospace',
                fontSize: 12,
                fontWeight: 700,
                color: '#a855f7',
                textAlign: 'right',
                flexShrink: 0,
                paddingTop: 2,
              }}>
                {figure.years}
              </div>

              {/* Timeline dot */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
                paddingTop: 6,
              }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#a855f7',
                  boxShadow: '0 0 8px rgba(168,85,247,0.4)',
                  flexShrink: 0,
                }} />
                <div style={{
                  width: 2,
                  flex: 1,
                  backgroundColor: 'rgba(168,85,247,0.2)',
                  marginTop: 4,
                  minHeight: 20,
                }} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                    {figure.name}
                  </h3>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    {figure.nationality}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.55, margin: 0 }}>
                  {figure.summary}
                </p>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{
                        fontSize: 13,
                        color: '#c4b5fd',
                        lineHeight: 1.65,
                        margin: '10px 0 0',
                        paddingTop: 10,
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        {figure.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

function SalonsSection() {
  return (
    <SectionWrapper title="The Salons — Where Ideas Met" icon="☕">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 14,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.4, ease: 'easeOut' }}
          style={{
            padding: 20,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 10px' }}>
            Paris Salons
          </h3>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
            The Enlightenment was born in conversation. Paris salons — hosted by women like Madame Geoffrin
            and Madame du Deffand — brought together philosophers, scientists, writers, and aristocrats.
            Voltaire, Diderot, d'Alembert, and Rousseau debated ideas that would reshape the world,
            over wine and candlelight. These were the "think tanks" of the 18th century.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4, ease: 'easeOut' }}
          style={{
            padding: 20,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 10px' }}>
            Coffeehouses & Print
          </h3>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
            London's coffeehouses were called "penny universities" — for the price of a coffee, anyone
            could sit and debate. The explosion of printing made ideas portable: pamphlets, newspapers,
            and the Encyclopédie spread Enlightenment thought far beyond the elite. Diderot's 28-volume
            Encyclopédie (1751–1772) aimed to collect and organize all human knowledge — and succeeded.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.4, ease: 'easeOut' }}
          style={{
            padding: 20,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 10px' }}>
            The Philosophes
          </h3>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
            The philosophes weren't just philosophers — they were public intellectuals who believed
            ideas should change society. They wrote for a broad audience, not just academics. Voltaire's
            wit, Rousseau's passion, and Diderot's encyclopedic ambition made the Enlightenment a
            popular movement, not just an academic one. They were, in modern terms, both the professors
            and the influencers.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

function RevolutionConnectionsSection() {
  return (
    <SectionWrapper title="Enlightenment → Revolution" icon="🔥">
      <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginTop: 0, marginBottom: 20 }}>
        Ideas don't stay in books. Each Enlightenment idea found its way into founding documents and revolutions.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {REVOLUTION_LINKS.map((link, i) => (
          <motion.div
            key={link.idea}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
            style={{
              padding: 20,
              borderRadius: 10,
              backgroundColor: `${link.color}08`,
              border: `1px solid ${link.color}25`,
              display: 'flex',
              gap: 20,
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            {/* Left: the idea */}
            <div style={{ minWidth: 160, flex: '0 0 auto' }}>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: link.color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 4,
              }}>
                {link.idea}
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>
                {link.thinker}
              </div>
            </div>

            {/* Arrow */}
            <div style={{
              fontSize: 20,
              color: link.color,
              flexShrink: 0,
              paddingTop: 2,
            }}>
              →
            </div>

            {/* Right: the outcome */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{
                fontFamily: 'monospace',
                fontSize: 12,
                fontWeight: 700,
                color: '#64748b',
                marginBottom: 4,
              }}>
                {link.year}
              </div>
              <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
                {link.outcome}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function CounterEnlightenmentSection() {
  return (
    <SectionWrapper title="The Counter-Enlightenment" icon="🌙">
      <div style={{
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(239,68,68,0.05)',
        border: '1px solid rgba(239,68,68,0.12)',
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ef4444', margin: '0 0 12px' }}>
          Romanticism Pushes Back
        </h3>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 12px' }}>
          Not everyone celebrated reason's triumph. The Romantics — poets, painters, and philosophers —
          argued that the Enlightenment had gone too far. They championed emotion over reason, intuition
          over logic, nature over industry, and the particular over the universal.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginTop: 16,
        }}>
          {[
            { title: 'Emotion over Reason', detail: 'Wordsworth, Shelley, and Keats argued that feelings and imagination reveal truths that logic cannot reach.' },
            { title: 'Nationalism', detail: 'Herder and Fichte argued that each nation has a unique "spirit" (Volksgeist) — against Enlightenment universalism.' },
            { title: 'Religion\'s Return', detail: 'Burke, de Maistre, and the Restoration championed tradition, faith, and inherited institutions over rational redesign.' },
            { title: 'Nature over Industry', detail: 'Thoreau, the Lake Poets, and Romantic painters celebrated wilderness as the antidote to industrial civilization.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
              style={{
                padding: 14,
                borderRadius: 8,
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', margin: '0 0 6px' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function EnlightenmentPage() {
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
    <PageShell>
      <HeroSection />
      <WhatWasSection />
      <CoreIdeasSection />
      <KeyFiguresSection />
      <SalonsSection />
      <RevolutionConnectionsSection />
      <CounterEnlightenmentSection />

      {/* Footer nav */}
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <Link to="/" style={{
          fontSize: 13,
          color: '#64748b',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
        }}>
          ← Back to Timeline
        </Link>
      </div>
    </PageShell>
  );
}
