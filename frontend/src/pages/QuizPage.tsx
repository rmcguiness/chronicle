/**
 * QuizPage — gamified history quiz with 10 random questions.
 *
 * Owns: quiz lifecycle (loading → playing → results), API fetching, state management.
 * Does NOT own: question rendering (QuizQuestion), result display (QuizResult).
 *
 * All quiz state lives in React state — no persistence between sessions.
 */
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizResult from '../components/quiz/QuizResult';
import type { Question } from '../components/quiz/QuizQuestion';
import type { AnswerRecord } from '../components/quiz/QuizResult';

const API_BASE =
  (typeof import.meta !== 'undefined' &&
    (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) ||
  'http://localhost:8000';

const QUESTION_COUNT = 10;

type QuizState = 'idle' | 'loading' | 'playing' | 'finished' | 'error';

/**
 * Main quiz page component. Manages the full quiz flow:
 * idle → loading → playing (question by question) → finished.
 */
export default function QuizPage() {
  const [state, setState] = useState<QuizState>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  /** Fetch questions from the API and start a new quiz. */
  const startQuiz = useCallback(async () => {
    setState('loading');
    setAnswers([]);
    setCurrentIndex(0);
    setErrorMsg('');

    try {
      const res = await axios.get<Question[]>(
        `${API_BASE}/api/quiz/questions?count=${QUESTION_COUNT}`
      );
      if (!res.data.length) {
        setErrorMsg('Not enough events in the database to generate a quiz.');
        setState('error');
        return;
      }
      setQuestions(res.data);
      setState('playing');
    } catch (err) {
      console.error('Failed to fetch quiz questions:', err);
      setErrorMsg('Failed to load quiz questions. Please try again.');
      setState('error');
    }
  }, []);

  /** Record an answer and advance to the next question or finish. */
  const handleAnswer = useCallback(
    (selectedIndex: number, isCorrect: boolean) => {
      const record: AnswerRecord = {
        question: questions[currentIndex],
        selectedIndex,
        isCorrect,
      };
      const newAnswers = [...answers, record];
      setAnswers(newAnswers);

      if (currentIndex + 1 >= questions.length) {
        setState('finished');
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [questions, currentIndex, answers]
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-indigo-400 hover:text-indigo-300">
          ← Chronicle
        </Link>
        <h1 className="text-lg font-semibold">🧠 History Quiz</h1>
        <div className="w-24" /> {/* Spacer for centering */}
      </nav>

      <div className="px-4 py-8">
        {/* Idle — start screen */}
        {state === 'idle' && (
          <div className="max-w-lg mx-auto text-center mt-16">
            <div className="text-6xl mb-6">🏛️</div>
            <h2 className="text-3xl font-bold mb-4">Historical Quiz</h2>
            <p className="text-gray-400 mb-8">
              Test your knowledge with {QUESTION_COUNT} questions about historical events.
              Questions cover dates, regions, and chronological order.
            </p>
            <button
              onClick={startQuiz}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white
                text-lg font-semibold rounded-lg transition-all"
            >
              Start Quiz
            </button>
          </div>
        )}

        {/* Loading */}
        {state === 'loading' && (
          <div className="max-w-lg mx-auto text-center mt-16">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-gray-400">Generating questions...</p>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div className="max-w-lg mx-auto text-center mt-16">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-400 mb-6">{errorMsg}</p>
            <button
              onClick={startQuiz}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white
                font-semibold rounded-lg transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Playing — show current question */}
        {state === 'playing' && questions[currentIndex] && (
          <QuizQuestion
            key={currentIndex}
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
          />
        )}

        {/* Finished — show results */}
        {state === 'finished' && (
          <QuizResult answers={answers} onPlayAgain={startQuiz} />
        )}
      </div>
    </div>
  );
}
