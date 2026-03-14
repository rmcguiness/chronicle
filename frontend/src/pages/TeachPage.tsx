import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLessons, type LessonListItem } from '../api/client';

const GRADE_COLORS: Record<string, string> = {
  elementary: '#4CAF50',
  middle: '#2196F3',
  high: '#FF9800',
  college: '#9C27B0',
};

const GRADE_LABELS: Record<string, string> = {
  elementary: 'Elementary',
  middle: 'Middle School',
  high: 'High School',
  college: 'College',
};

export default function TeachPage() {
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLessons()
      .then(setLessons)
      .catch(() => setError('Failed to load lessons'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e0e0e0', fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav style={{
        padding: '12px 24px',
        borderBottom: '1px solid #1a1a2e',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <Link to="/" style={{ color: '#8ab4f8', textDecoration: 'none', fontSize: 14 }}>
          Chronicle
        </Link>
        <span style={{ color: '#555' }}>/</span>
        <span style={{ color: '#ccc', fontSize: 14 }}>Teach</span>
      </nav>

      {/* Hero */}
      <header style={{
        textAlign: 'center',
        padding: '64px 24px 48px',
        maxWidth: 720,
        margin: '0 auto',
      }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, margin: '0 0 16px', color: '#fff' }}>
          Chronicle for Educators
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: '#aaa', margin: 0 }}>
          Guided lesson plans that walk students through historical events in sequence.
          Each lesson includes learning objectives, primary-source perspectives,
          and discussion questions ready for the classroom.
        </p>
      </header>

      {/* Lesson Grid */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 64px' }}>
        {loading && <p style={{ textAlign: 'center', color: '#888' }}>Loading lessons...</p>}
        {error && <p style={{ textAlign: 'center', color: '#f44336' }}>{error}</p>}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/lesson/${lesson.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                background: '#12121a',
                border: '1px solid #1e1e2e',
                borderRadius: 12,
                padding: 24,
                transition: 'border-color 0.2s, transform 0.2s',
                cursor: 'pointer',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a5c';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1e1e2e';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 600, color: '#fff' }}>
                  {lesson.title}
                </h3>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  <span style={{
                    fontSize: 12,
                    padding: '3px 10px',
                    borderRadius: 12,
                    background: GRADE_COLORS[lesson.grade_level] + '22',
                    color: GRADE_COLORS[lesson.grade_level],
                    fontWeight: 500,
                  }}>
                    {GRADE_LABELS[lesson.grade_level] || lesson.grade_level}
                  </span>
                  <span style={{
                    fontSize: 12,
                    padding: '3px 10px',
                    borderRadius: 12,
                    background: '#1a2a3a',
                    color: '#8ab4f8',
                    fontWeight: 500,
                  }}>
                    {lesson.subject}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#888' }}>
                    {lesson.event_count} event{lesson.event_count !== 1 ? 's' : ''}
                  </span>
                  <span style={{ fontSize: 13, color: '#8ab4f8', fontWeight: 500 }}>
                    Start Lesson &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Create Your Own */}
        <section style={{
          marginTop: 48,
          padding: 32,
          background: '#12121a',
          border: '1px solid #1e1e2e',
          borderRadius: 12,
          textAlign: 'center',
        }}>
          <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 600, color: '#fff' }}>
            Create Your Own Lesson
          </h2>
          <p style={{ color: '#aaa', margin: '0 0 20px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            Use the Timeline Builder to curate a custom sequence of events tailored to your curriculum.
          </p>
          <Link
            to="/builder"
            style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: '#8ab4f8',
              color: '#0a0a0f',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Open Timeline Builder
          </Link>
        </section>
      </main>
    </div>
  );
}
