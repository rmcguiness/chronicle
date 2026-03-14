/**
 * AboutPage — /about route.
 *
 * Sections: Hero, What Is Chronicle, How It Works, Key Features,
 * Open Source, Tech Stack, Contact.
 *
 * Fetches live stats from /api/stats (falls back to defaults).
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { fetchStats } from '../api/client';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Shape returned by /api/stats (or fallback). */
interface StatsData {
  events_count: number;
  causality_links_count: number;
  figures_count: number;
  year_span: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Hero section with logo heading, tagline, and live stats. */
function AboutHero({ stats }: { stats: StatsData | undefined }) {
  return (
    <div
      style={{
        padding: '80px 32px 48px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, rgba(59,130,246,0.08) 0%, rgba(7,14,34,1) 100%)',
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
          marginBottom: 32,
          padding: '6px 12px',
          borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}
      >
        ← Back to Timeline
      </Link>

      <h1
        style={{
          fontSize: 'clamp(40px, 8vw, 72px)',
          fontWeight: 900,
          color: '#f1f5f9',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: 20,
        }}
      >
        Chronicle
      </h1>

      <p
        style={{
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          color: '#94a3b8',
          lineHeight: 1.6,
          maxWidth: 640,
          margin: '0 auto 32px',
        }}
      >
        An open-source immutable historical timeline — explore the connected story of human civilization
      </p>

      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <StatChip label={`${stats.events_count.toLocaleString()} events`} />
          <StatChip label={`${stats.causality_links_count.toLocaleString()} causality links`} />
          <StatChip label={`${stats.figures_count} historical figures`} />
          <StatChip label={`spanning ${stats.year_span} of history`} />
        </motion.div>
      )}
    </div>
  );
}

/** Small inline chip for stats row. */
function StatChip({ label }: { label: string }) {
  return (
    <span
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: '#cbd5e1',
        padding: '6px 14px',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {label}
    </span>
  );
}

/** "What Is Chronicle" description section. */
function WhatIsChronicle() {
  return (
    <SectionBlock>
      <SectionHeading icon="📜" title="What is Chronicle?" />
      <Paragraph>
        Chronicle is a living, interconnected map of human history.
      </Paragraph>
      <Paragraph>
        Unlike a traditional timeline, every event is causally linked to the events that caused it
        and the events it caused — revealing the hidden threads that connect all of history.
      </Paragraph>
      <Paragraph>
        Built on FastAPI, PostgreSQL, React, and pgvector — Chronicle is fast, open-source,
        and designed to grow.
      </Paragraph>
    </SectionBlock>
  );
}

/** "How It Works" three-step section. */
function HowItWorks() {
  const steps = [
    {
      emoji: '🗺️',
      title: 'Explore',
      description:
        'Navigate the interactive timeline — zoom in on centuries, filter by region, follow causal chains',
    },
    {
      emoji: '🔗',
      title: 'Discover',
      description:
        'See which events led to other events — trace history backward and forward',
    },
    {
      emoji: '🎮',
      title: 'Play',
      description:
        'Test your knowledge with daily challenges, games, and puzzles',
    },
  ];

  return (
    <SectionBlock>
      <SectionHeading icon="⚙️" title="How It Works" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            style={{
              padding: '20px 20px',
              borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{s.emoji}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
              {s.title}
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
              {s.description}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionBlock>
  );
}

/** Key features icon grid. */
function KeyFeatures() {
  const features = [
    { emoji: '🌍', title: '1,500+ Historical Events', desc: 'From prehistory to the present' },
    { emoji: '🔗', title: '1,400+ Causal Links', desc: 'Every cause and effect mapped' },
    { emoji: '👤', title: '50+ Historical Figures', desc: 'Biographies and life timelines' },
    { emoji: '🎮', title: '5 Game Modes', desc: 'Daily challenge, guess-the-year, connections, six degrees, rabbit hole' },
    { emoji: '🔍', title: 'Semantic Search', desc: 'Find events by meaning, not just keywords' },
    { emoji: '🌐', title: '6 World Regions', desc: 'Deep dives into every corner of history' },
  ];

  return (
    <SectionBlock>
      <SectionHeading icon="✨" title="Key Features" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            style={{
              display: 'flex',
              gap: 14,
              padding: '16px 18px',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <span style={{ fontSize: 28, flexShrink: 0 }}>{f.emoji}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
                {f.title}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionBlock>
  );
}

/** Open source section with GitHub link. */
function OpenSourceSection() {
  return (
    <SectionBlock>
      <SectionHeading icon="📖" title="Open Source" />
      <div
        style={{
          padding: '24px 28px',
          borderRadius: 12,
          backgroundColor: 'rgba(59,130,246,0.06)',
          border: '1px solid rgba(59,130,246,0.15)',
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>
          Chronicle is open source
        </h3>
        <Paragraph>
          Built for historians, educators, students, and the curious.
        </Paragraph>
        <Paragraph>
          Contribute events, suggest improvements, or fork and run your own.
        </Paragraph>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
          <ExternalLink href="https://github.com/rmcguiness/chronicle" label="GitHub Repository" />
          <ExternalLink
            href="https://github.com/rmcguiness/chronicle/blob/main/CONTRIBUTING.md"
            label="Contributing Guide"
          />
        </div>
      </div>
    </SectionBlock>
  );
}

/** Tech stack section. */
function TechStack() {
  const stacks = [
    { label: 'Backend', value: 'FastAPI + PostgreSQL + PostGIS + pgvector' },
    { label: 'Frontend', value: 'React + ReactFlow + Vite + Tailwind CSS' },
    { label: 'AI', value: '384-dimension sentence embeddings for semantic search' },
    { label: 'Hosted on', value: 'Docker + local / cloud-deployable' },
  ];

  return (
    <SectionBlock>
      <SectionHeading icon="🛠️" title="Tech Stack" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {stacks.map((s) => (
          <div
            key={s.label}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'baseline',
              fontSize: 14,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: '#60a5fa',
                minWidth: 90,
                flexShrink: 0,
              }}
            >
              {s.label}
            </span>
            <span style={{ color: '#cbd5e1' }}>{s.value}</span>
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}

/** Contact / footer section. */
function ContactSection() {
  return (
    <SectionBlock last>
      <SectionHeading icon="💬" title="Get in Touch" />
      <Paragraph>
        Questions or ideas? Open an issue on GitHub.
      </Paragraph>
      <Paragraph>
        Built with ❤️ as a passion project.
      </Paragraph>
      <div style={{ marginTop: 16 }}>
        <ExternalLink
          href="https://github.com/rmcguiness/chronicle/issues"
          label="Open an Issue"
        />
      </div>
    </SectionBlock>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared layout helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Section wrapper with consistent spacing. */
function SectionBlock({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <section
      style={{
        padding: '32px 32px',
        borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {children}
    </section>
  );
}

/** Section heading row. */
function SectionHeading({ icon, title }: { icon: string; title: string }) {
  return (
    <h2
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span>{icon}</span>
      {title}
    </h2>
  );
}

/** Styled paragraph. */
function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 10px' }}>
      {children}
    </p>
  );
}

/** External link button. */
function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        fontWeight: 600,
        color: '#60a5fa',
        textDecoration: 'none',
        padding: '8px 16px',
        borderRadius: 8,
        border: '1px solid rgba(96,165,250,0.3)',
        backgroundColor: 'rgba(96,165,250,0.08)',
      }}
    >
      {label} →
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page shell (matches EventDetailPage pattern)
// ─────────────────────────────────────────────────────────────────────────────

/** Scrollable dark page wrapper. */
function PageShell({ children }: { children: React.ReactNode }) {
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
      <div style={{ maxWidth: 960, margin: '0 auto' }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * AboutPage — renders /about with project info, features, and live stats.
 */
export default function AboutPage() {
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

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <PageShell>
      <AboutHero stats={stats} />
      <WhatIsChronicle />
      <HowItWorks />
      <KeyFeatures />
      <OpenSourceSection />
      <TechStack />
      <ContactSection />
    </PageShell>
  );
}
