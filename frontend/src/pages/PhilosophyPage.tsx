/**
 * PhilosophyPage — historical philosophy explorer.
 *
 * Route: /philosophy
 *
 * Features:
 *  - 20 major schools of thought with key thinkers, quotes, impact
 *  - Timeline Gantt view of school eras colored by region
 *  - Eternal philosophical questions matrix
 *  - 10 famous thought experiments
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Types ────────────────────────────────────────────────────────────────────

interface Thinker {
  name: string;
  bio: string;
}

interface School {
  id: string;
  name: string;
  dates: string;
  start_year: number;
  end_year: number;
  region: string;
  core_question: string;
  thinkers: Thinker[];
  core_ideas: string[];
  famous_quote: string;
  quote_author: string;
  historical_impact: string;
  search_query: string;
}

interface EternalQuestion {
  question: string;
  description: string;
  schools: string[];
}

interface ThoughtExperiment {
  name: string;
  thinker: string;
  year: string;
  description: string;
  point: string;
}

interface PhilosophyData {
  schools: School[];
  questions: EternalQuestion[];
  thought_experiments: ThoughtExperiment[];
}

// ── Constants ────────────────────────────────────────────────────────────────

const REGION_COLORS: Record<string, string> = {
  Greek: '#f59e0b',
  'Greek/Roman': '#ef4444',
  'Roman/Late Antiquity': '#dc2626',
  Islamic: '#10b981',
  Western: '#3b82f6',
  Modern: '#8b5cf6',
};

function regionColor(region: string): string {
  return REGION_COLORS[region] ?? '#3b82f6';
}

type Section = 'schools' | 'timeline' | 'questions' | 'experiments';

// ── Component ────────────────────────────────────────────────────────────────

export default function PhilosophyPage() {
  const [activeSection, setActiveSection] = useState<Section>('schools');
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);
  const [expandedExperiment, setExpandedExperiment] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<PhilosophyData>({
    queryKey: ['philosophy'],
    queryFn: async () => {
      const res = await fetch(`${API}/api/philosophy`);
      if (!res.ok) throw new Error('Failed to load philosophy data');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
        <p style={{ fontSize: 18 }}>Loading philosophy data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontFamily: "'Inter', sans-serif" }}>
        <p>Failed to load philosophy data.</p>
      </div>
    );
  }

  const { schools, questions, thought_experiments } = data;

  // Timeline calculations
  const timelineMin = -650;
  const timelineMax = 2050;
  const timelineRange = timelineMax - timelineMin;

  function yearToPercent(year: number): number {
    return ((year - timelineMin) / timelineRange) * 100;
  }

  function formatYear(year: number): string {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  }

  const sectionBtns: { key: Section; label: string }[] = [
    { key: 'schools', label: 'Schools of Thought' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'questions', label: 'Eternal Questions' },
    { key: 'experiments', label: 'Thought Experiments' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      {/* Back nav */}
      <Link
        to="/"
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 40,
          padding: '8px 14px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(15,17,23,0.85)',
          backdropFilter: 'blur(8px)',
          color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500,
          textDecoration: 'none', transition: 'all 150ms ease',
        }}
      >
        ← Chronicle
      </Link>

      {/* ── Hero ── */}
      <header style={{ padding: '80px 24px 40px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.2, margin: 0, letterSpacing: -0.5 }}
        >
          Ideas That Changed the World
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ fontSize: 20, color: '#94a3b8', marginTop: 12, fontWeight: 400 }}
        >
          A History of Philosophy
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ fontSize: 15, color: '#64748b', marginTop: 16, lineHeight: 1.6, maxWidth: 680, margin: '16px auto 0' }}
        >
          From the first question about the nature of reality in ancient Miletus to the deconstruction
          of truth in postmodern Paris — 2,600 years of humanity's greatest ideas, the thinkers who
          shaped them, and the world they changed.
        </motion.p>

        {/* Stats bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 28 }}>
          {[
            { n: schools.length, label: 'Schools' },
            { n: schools.reduce((s, sc) => s + sc.thinkers.length, 0), label: 'Thinkers' },
            { n: questions.length, label: 'Eternal Questions' },
            { n: thought_experiments.length, label: 'Thought Experiments' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#3b82f6' }}>{s.n}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* ── Section Nav ── */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '0 24px 32px', flexWrap: 'wrap' }}>
        {sectionBtns.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: activeSection === s.key ? '#3b82f6' : 'rgba(255,255,255,0.06)',
              color: activeSection === s.key ? '#fff' : '#94a3b8',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* ── Schools of Thought ── */}
      {activeSection === 'schools' && (
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: 20 }}>
            {schools.map((school, i) => {
              const expanded = expandedSchool === school.id;
              return (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${expanded ? regionColor(school.region) : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 12, padding: 24, cursor: 'pointer',
                    transition: 'border-color 200ms ease',
                  }}
                  onClick={() => setExpandedSchool(expanded ? null : school.id)}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{school.name}</h3>
                      <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                        {school.dates} · <span style={{ color: regionColor(school.region) }}>{school.region}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{expanded ? '▲' : '▼'}</span>
                  </div>

                  {/* Core question */}
                  <p style={{ fontSize: 14, color: '#a78bfa', fontStyle: 'italic', margin: '8px 0 12px' }}>
                    "{school.core_question}"
                  </p>

                  {/* Key thinkers */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                    {school.thinkers.map((t) => (
                      <span
                        key={t.name}
                        title={t.bio}
                        style={{
                          padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                          background: 'rgba(255,255,255,0.06)', color: '#e2e8f0',
                        }}
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>

                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Thinker bios */}
                      <div style={{ marginBottom: 16 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Key Thinkers</h4>
                        {school.thinkers.map((t) => (
                          <div key={t.name} style={{ marginBottom: 6, fontSize: 13, color: '#cbd5e1' }}>
                            <strong style={{ color: '#e2e8f0' }}>{t.name}</strong> — {t.bio}
                          </div>
                        ))}
                      </div>

                      {/* Core ideas */}
                      <div style={{ marginBottom: 16 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Core Ideas</h4>
                        <ul style={{ margin: 0, paddingLeft: 18, listStyleType: 'disc' }}>
                          {school.core_ideas.map((idea, j) => (
                            <li key={j} style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 4, lineHeight: 1.5 }}>{idea}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Quote */}
                      <div style={{
                        background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${regionColor(school.region)}`,
                        padding: '12px 16px', borderRadius: '0 8px 8px 0', marginBottom: 16,
                      }}>
                        <p style={{ fontSize: 14, fontStyle: 'italic', color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
                          "{school.famous_quote}"
                        </p>
                        <p style={{ fontSize: 12, color: '#64748b', margin: '6px 0 0', textAlign: 'right' }}>
                          — {school.quote_author}
                        </p>
                      </div>

                      {/* Historical impact */}
                      <div style={{ marginBottom: 16 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Historical Impact</h4>
                        <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>{school.historical_impact}</p>
                      </div>

                      {/* Search link */}
                      <Link
                        to={`/search?q=${encodeURIComponent(school.search_query)}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'inline-block', padding: '8px 16px', borderRadius: 6,
                          background: regionColor(school.region), color: '#fff',
                          fontSize: 13, fontWeight: 600, textDecoration: 'none',
                          transition: 'opacity 150ms ease',
                        }}
                      >
                        Find in Chronicle →
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Timeline View ── */}
      {activeSection === 'timeline' && (
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>When Schools Flourished</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
            Horizontal bars show the approximate period each school was most active, colored by region of origin.
          </p>

          {/* Region legend */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
            {Object.entries(REGION_COLORS).map(([region, color]) => (
              <div key={region} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{region}</span>
              </div>
            ))}
          </div>

          {/* Timeline axis */}
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569' }}>
              {[-600, -400, -200, 0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000].map((y) => (
                <span key={y} style={{ position: 'absolute', left: `${yearToPercent(y)}%`, transform: 'translateX(-50%)' }}>
                  {y < 0 ? `${Math.abs(y)} BCE` : y === 0 ? '0' : y}
                </span>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div style={{ marginTop: 32 }}>
            {schools.map((school, i) => {
              const left = yearToPercent(school.start_year);
              const width = yearToPercent(school.end_year) - left;
              return (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  style={{ display: 'flex', alignItems: 'center', marginBottom: 6, gap: 0 }}
                >
                  <div style={{ width: 200, flexShrink: 0, fontSize: 12, fontWeight: 500, color: '#94a3b8', textAlign: 'right', paddingRight: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {school.name}
                  </div>
                  <div style={{ flex: 1, position: 'relative', height: 22 }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.02)', borderRadius: 4 }} />
                    <div
                      title={`${school.name}: ${school.dates}`}
                      style={{
                        position: 'absolute', top: 2, height: 18, borderRadius: 4,
                        left: `${left}%`, width: `${Math.max(width, 1)}%`,
                        background: regionColor(school.region),
                        opacity: 0.8,
                        cursor: 'pointer',
                        transition: 'opacity 150ms ease',
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Eternal Questions ── */}
      {activeSection === 'questions' && (
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>The Eternal Questions</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
            Six questions that have defined philosophy for millennia — and the schools that tried to answer them.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {questions.map((q, i) => (
              <motion.div
                key={q.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, padding: 24,
                }}
              >
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: '#a78bfa' }}>
                  {q.question}
                </h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.5 }}>
                  {q.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {q.schools.map((s) => {
                    const school = schools.find((sc) => sc.name === s);
                    return (
                      <span
                        key={s}
                        style={{
                          padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                          background: school ? `${regionColor(school.region)}22` : 'rgba(255,255,255,0.06)',
                          color: school ? regionColor(school.region) : '#94a3b8',
                          border: `1px solid ${school ? `${regionColor(school.region)}33` : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        {s}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Thought Experiments ── */}
      {activeSection === 'experiments' && (
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 64px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Famous Thought Experiments</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
            The ingenious scenarios philosophers invented to test our intuitions about reality, knowledge, ethics, and the mind.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {thought_experiments.map((te, i) => {
              const expanded = expandedExperiment === te.name;
              return (
                <motion.div
                  key={te.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${expanded ? '#a78bfa' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 12, padding: 20, cursor: 'pointer',
                    transition: 'border-color 200ms ease',
                  }}
                  onClick={() => setExpandedExperiment(expanded ? null : te.name)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{te.name}</h3>
                      <span style={{ fontSize: 12, color: '#64748b' }}>
                        {te.thinker} · {te.year}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: '#475569' }}>{expanded ? '▲' : '▼'}</span>
                  </div>

                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{ marginTop: 14 }}
                    >
                      <div style={{
                        background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid #a78bfa',
                        padding: '12px 16px', borderRadius: '0 8px 8px 0', marginBottom: 12,
                      }}>
                        <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
                          {te.description}
                        </p>
                      </div>
                      <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                        <strong style={{ color: '#a78bfa' }}>The point:</strong> {te.point}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', color: '#475569', fontSize: 12, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        Chronicle — Open-source historical events explorer · <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Back to timeline</Link>
      </footer>
    </div>
  );
}
