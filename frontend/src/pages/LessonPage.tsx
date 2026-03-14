import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchLesson, type LessonDetail, type LessonEventItem } from '../api/client';

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

const CATEGORY_COLORS: Record<string, string> = {
  war: '#e53935',
  discovery: '#43a047',
  political: '#1e88e5',
  cultural: '#8e24aa',
  natural: '#f4511e',
  person: '#fdd835',
};

function formatYear(yearApprox: number | null, isBce: boolean): string {
  if (yearApprox == null) return 'Date unknown';
  if (isBce || yearApprox < 0) return `${Math.abs(yearApprox)} BCE`;
  return `${yearApprox} CE`;
}

function EventCard({ event, index, studentMode }: { event: LessonEventItem; index: number; studentMode: boolean }) {
  const catColor = CATEGORY_COLORS[event.category ?? ''] || '#666';

  return (
    <div style={{
      display: 'flex',
      gap: 20,
      padding: 24,
      background: '#12121a',
      border: '1px solid #1e1e2e',
      borderRadius: 12,
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: catColor + '33',
        color: catColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 18,
        flexShrink: 0,
      }}>
        {index + 1}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
          <Link
            to={`/event/${event.slug}`}
            style={{ color: '#fff', textDecoration: 'none', fontSize: 17, fontWeight: 600 }}
          >
            {event.title}
          </Link>
          {event.category && (
            <span style={{
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 10,
              background: catColor + '22',
              color: catColor,
              fontWeight: 500,
              textTransform: 'capitalize',
            }}>
              {event.category}
            </span>
          )}
        </div>

        {!studentMode && (
          <div style={{ fontSize: 13, color: '#8ab4f8', marginBottom: 8 }}>
            {formatYear(event.year_approx, event.is_bce)}
            {event.geo_modern && <span style={{ color: '#666' }}> &middot; {event.geo_modern}</span>}
          </div>
        )}

        {studentMode && (
          <div style={{ fontSize: 13, color: '#666', marginBottom: 8, fontStyle: 'italic' }}>
            When did this happen? Place it in the sequence!
          </div>
        )}

        {event.summary && (
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#aaa' }}>
            {event.summary}
          </p>
        )}
      </div>
    </div>
  );
}

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentMode, setStudentMode] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchLesson(id)
      .then(setLesson)
      .catch(() => setError('Failed to load lesson'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        Loading lesson...
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f44336', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        {error || 'Lesson not found'}
      </div>
    );
  }

  const gradeColor = GRADE_COLORS[lesson.grade_level] || '#666';

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
        <Link to="/" style={{ color: '#8ab4f8', textDecoration: 'none', fontSize: 14 }}>Chronicle</Link>
        <span style={{ color: '#555' }}>/</span>
        <Link to="/teach" style={{ color: '#8ab4f8', textDecoration: 'none', fontSize: 14 }}>Teach</Link>
        <span style={{ color: '#555' }}>/</span>
        <span style={{ color: '#ccc', fontSize: 14 }}>{lesson.title}</span>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 64px' }}>
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 12px', color: '#fff' }}>
            {lesson.title}
          </h1>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 13,
              padding: '4px 12px',
              borderRadius: 12,
              background: gradeColor + '22',
              color: gradeColor,
              fontWeight: 500,
            }}>
              {GRADE_LABELS[lesson.grade_level] || lesson.grade_level}
            </span>
            <span style={{
              fontSize: 13,
              padding: '4px 12px',
              borderRadius: 12,
              background: '#1a2a3a',
              color: '#8ab4f8',
              fontWeight: 500,
            }}>
              {lesson.subject}
            </span>
            <span style={{ fontSize: 13, color: '#666' }}>
              {lesson.events.length} event{lesson.events.length !== 1 ? 's' : ''}
            </span>
          </div>
        </header>

        {/* Learning Objectives */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 12px', color: '#fff' }}>
            Learning Objectives
          </h2>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {lesson.learning_objectives.map((obj, i) => (
              <li key={i} style={{ marginBottom: 8, lineHeight: 1.5, color: '#ccc', fontSize: 15 }}>
                {obj}
              </li>
            ))}
          </ul>
        </section>

        {/* Student Mode Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
          padding: '12px 16px',
          background: studentMode ? '#1a2a1a' : '#12121a',
          border: `1px solid ${studentMode ? '#2e7d32' : '#1e1e2e'}`,
          borderRadius: 10,
        }}>
          <button
            onClick={() => setStudentMode(!studentMode)}
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              border: 'none',
              background: studentMode ? '#4CAF50' : '#333',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <div style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#fff',
              position: 'absolute',
              top: 3,
              left: studentMode ? 23 : 3,
              transition: 'left 0.2s',
            }} />
          </button>
          <div>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>Student Mode</span>
            <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>
              {studentMode ? 'Dates hidden — students sequence events themselves' : 'Toggle to hide dates for sequencing exercise'}
            </span>
          </div>
        </div>

        {/* Event Cards */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', color: '#fff' }}>
            Events
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {lesson.events.map((event, i) => (
              <EventCard key={event.slug} event={event} index={i} studentMode={studentMode} />
            ))}
          </div>
        </section>

        {/* Guiding Questions */}
        <section style={{
          padding: 24,
          background: '#12121a',
          border: '1px solid #1e1e2e',
          borderRadius: 12,
          marginBottom: 40,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', color: '#fff' }}>
            Discussion Questions
          </h2>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            {lesson.guiding_questions.map((q, i) => (
              <li key={i} style={{ marginBottom: 12, lineHeight: 1.6, color: '#ccc', fontSize: 15 }}>
                {q}
              </li>
            ))}
          </ol>
        </section>

        {/* Print button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: '10px 24px',
              background: 'transparent',
              color: '#8ab4f8',
              border: '1px solid #8ab4f8',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Print Lesson
          </button>
        </div>
      </main>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: #fff !important; color: #000 !important; }
          nav { display: none !important; }
          div[style*="background: #0a0a0f"] { background: #fff !important; }
          div[style*="background: #12121a"] { background: #f5f5f5 !important; border-color: #ddd !important; }
          * { color: #000 !important; }
          a { color: #1a73e8 !important; }
          button { display: none !important; }
          h1, h2, h3 { color: #000 !important; }
          span[style*="background"] { border: 1px solid #ccc !important; }
        }
      `}</style>
    </div>
  );
}
