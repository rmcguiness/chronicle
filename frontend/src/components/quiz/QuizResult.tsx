/**
 * QuizResult — displays the final score card and answer review.
 *
 * Owns: score display, answer review toggle, play-again trigger.
 * Does NOT own: quiz state reset logic, question generation.
 */
import { useState } from 'react';
import type { Question } from './QuizQuestion';

/** A completed answer record. */
export interface AnswerRecord {
  question: Question;
  selectedIndex: number;
  isCorrect: boolean;
}

interface QuizResultProps {
  /** All answers from the completed quiz. */
  answers: AnswerRecord[];
  /** Callback to start a new quiz. */
  onPlayAgain: () => void;
}

/** Score thresholds for different result messages. */
const PERFECT_SCORE = 1.0;
const GREAT_THRESHOLD = 0.7;
const OK_THRESHOLD = 0.4;

/**
 * Renders the quiz score card with optional answer review.
 */
export default function QuizResult({ answers, onPlayAgain }: QuizResultProps) {
  const [showReview, setShowReview] = useState(false);

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const total = answers.length;
  const ratio = total > 0 ? correctCount / total : 0;

  // Pick emoji + message based on score
  let emoji = '😅';
  let message = 'Keep studying!';
  if (ratio === PERFECT_SCORE) {
    emoji = '🏆';
    message = 'Perfect score! History master!';
  } else if (ratio >= GREAT_THRESHOLD) {
    emoji = '🎉';
    message = 'Great job!';
  } else if (ratio >= OK_THRESHOLD) {
    emoji = '📚';
    message = 'Not bad — keep learning!';
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Score card */}
      <div className="text-6xl mb-4">{emoji}</div>
      <h2 className="text-3xl font-bold text-white mb-2">
        {correctCount} / {total}
      </h2>
      <p className="text-lg text-gray-300 mb-8">{message}</p>

      {/* Action buttons */}
      <div className="flex gap-4 justify-center mb-8">
        <button
          onClick={onPlayAgain}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white
            font-semibold rounded-lg transition-all"
        >
          🔄 Play Again
        </button>
        <button
          onClick={() => setShowReview(!showReview)}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white
            font-semibold rounded-lg transition-all"
        >
          {showReview ? 'Hide Review' : '📋 Review Answers'}
        </button>
      </div>

      {/* Answer review */}
      {showReview && (
        <div className="text-left space-y-4">
          {answers.map((answer, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border ${
                answer.isCorrect
                  ? 'border-green-700 bg-green-900/20'
                  : 'border-red-700 bg-red-900/20'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-white text-sm">
                  {idx + 1}. {answer.question.question}
                </p>
                <span className="text-lg ml-2 flex-shrink-0">
                  {answer.isCorrect ? '✅' : '❌'}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Your answer:{' '}
                <span
                  className={answer.isCorrect ? 'text-green-400' : 'text-red-400'}
                >
                  {answer.question.options[answer.selectedIndex]}
                </span>
              </p>
              {!answer.isCorrect && (
                <p className="text-sm text-gray-400">
                  Correct:{' '}
                  <span className="text-green-400">
                    {answer.question.options[answer.question.correct_index]}
                  </span>
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {answer.question.explanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
