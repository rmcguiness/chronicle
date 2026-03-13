/**
 * QuizQuestion — renders a single quiz question with multiple-choice options.
 *
 * Owns: question display, option selection, correct/incorrect feedback.
 * Does NOT own: quiz state management, question generation, scoring.
 */
import { useState } from 'react';

/** Shape of a question from the API. */
export interface Question {
  type: 'year_guess' | 'region' | 'chronological';
  question: string;
  options: string[];
  correct_index: number;
  event_title: string;
  explanation: string;
}

interface QuizQuestionProps {
  /** The question data to display. */
  question: Question;
  /** Current question number (1-indexed). */
  questionNumber: number;
  /** Total number of questions in the quiz. */
  totalQuestions: number;
  /** Callback when user confirms their answer. */
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
}

/** Type badge colors keyed by question type. */
const TYPE_LABELS: Record<Question['type'], { label: string; color: string }> = {
  year_guess: { label: '📅 Year', color: 'bg-blue-100 text-blue-800' },
  region: { label: '🌍 Region', color: 'bg-green-100 text-green-800' },
  chronological: { label: '⏳ Order', color: 'bg-purple-100 text-purple-800' },
};

/**
 * Renders a quiz question with selectable options and feedback after answering.
 */
export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuizQuestionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedIndex(idx);
  };

  const handleConfirm = () => {
    if (selectedIndex === null || answered) return;
    setAnswered(true);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    onAnswer(selectedIndex, selectedIndex === question.correct_index);
  };

  const typeInfo = TYPE_LABELS[question.type];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress + type badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeInfo.color}`}>
          {typeInfo.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-1.5 mb-6">
        <div
          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question text */}
      <h2 className="text-xl font-semibold text-white mb-6">{question.question}</h2>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, idx) => {
          let optionStyle = 'border-gray-600 hover:border-indigo-400 bg-gray-800';

          if (answered) {
            if (idx === question.correct_index) {
              optionStyle = 'border-green-500 bg-green-900/30';
            } else if (idx === selectedIndex && idx !== question.correct_index) {
              optionStyle = 'border-red-500 bg-red-900/30';
            } else {
              optionStyle = 'border-gray-700 bg-gray-800 opacity-50';
            }
          } else if (idx === selectedIndex) {
            optionStyle = 'border-indigo-500 bg-indigo-900/30';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all
                text-gray-200 ${optionStyle} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="font-medium text-gray-400 mr-3">
                {String.fromCharCode(65 + idx)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback after answering */}
      {answered && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            selectedIndex === question.correct_index
              ? 'bg-green-900/20 border border-green-700'
              : 'bg-red-900/20 border border-red-700'
          }`}
        >
          <p className="font-semibold mb-1 text-white">
            {selectedIndex === question.correct_index ? '✅ Correct!' : '❌ Incorrect'}
          </p>
          <p className="text-sm text-gray-300">{question.explanation}</p>
        </div>
      )}

      {/* Action button */}
      {!answered ? (
        <button
          onClick={handleConfirm}
          disabled={selectedIndex === null}
          className="w-full py-3 rounded-lg font-semibold transition-all
            bg-indigo-600 hover:bg-indigo-500 text-white
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-lg font-semibold transition-all
            bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          {questionNumber < totalQuestions ? 'Next Question →' : 'See Results →'}
        </button>
      )}
    </div>
  );
}
