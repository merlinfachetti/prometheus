import { useState } from "react";
import type { Exercise } from "../types/content";
import { useI18n } from "../hooks/useI18n";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  onComplete: (exerciseId: string, correct: boolean) => void;
}

export function ExerciseCard({ exercise, index, onComplete }: ExerciseCardProps) {
  const { strings } = useI18n();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = selectedAnswer === exercise.correctAnswer;

  function handleSubmit() {
    if (!selectedAnswer) return;
    setSubmitted(true);
    onComplete(exercise.id, selectedAnswer === exercise.correctAnswer);
  }

  function handleRetry() {
    setSelectedAnswer(null);
    setSubmitted(false);
    setShowHint(false);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
      {/* Header */}
      <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wide mb-3">
        {strings.lesson.exercise} {index + 1}
      </p>

      {/* Question */}
      <p className="text-lg font-medium text-[var(--color-text)] mb-5">
        {exercise.question}
      </p>

      {/* Multiple Choice Options */}
      {exercise.type === "multiple_choice" && exercise.options && (
        <div className="space-y-3 mb-5">
          {exercise.options.map((option) => {
            let optionStyle = "border-gray-200 hover:border-[var(--color-primary-light)] hover:bg-gray-50";

            if (selectedAnswer === option.id && !submitted) {
              optionStyle = "border-[var(--color-primary)] bg-blue-50";
            }
            if (submitted && option.id === exercise.correctAnswer) {
              optionStyle = "border-green-500 bg-green-50";
            }
            if (submitted && selectedAnswer === option.id && !isCorrect) {
              optionStyle = "border-red-400 bg-red-50";
            }

            return (
              <button
                key={option.id}
                onClick={() => !submitted && setSelectedAnswer(option.id)}
                disabled={submitted}
                className={`w-full text-left px-5 py-3 rounded-lg border-2 transition-colors
                  text-[var(--color-text)] text-lg cursor-pointer
                  disabled:cursor-default ${optionStyle}`}
              >
                <span className="font-semibold mr-3 text-[var(--color-text-muted)]">
                  {option.id.toUpperCase()})
                </span>
                {option.text}
              </button>
            );
          })}
        </div>
      )}

      {/* True/False Options */}
      {exercise.type === "true_false" && (
        <div className="flex gap-4 mb-5">
          {[
            { id: "true", label: strings.lesson.trueLabel },
            { id: "false", label: strings.lesson.falseLabel },
          ].map((option) => {
            let optionStyle = "border-gray-200 hover:border-[var(--color-primary-light)] hover:bg-gray-50";

            if (selectedAnswer === option.id && !submitted) {
              optionStyle = "border-[var(--color-primary)] bg-blue-50";
            }
            if (submitted && option.id === exercise.correctAnswer) {
              optionStyle = "border-green-500 bg-green-50";
            }
            if (submitted && selectedAnswer === option.id && selectedAnswer !== exercise.correctAnswer) {
              optionStyle = "border-red-400 bg-red-50";
            }

            return (
              <button
                key={option.id}
                onClick={() => !submitted && setSelectedAnswer(option.id)}
                disabled={submitted}
                className={`flex-1 px-5 py-3 rounded-lg border-2 transition-colors
                  text-lg font-medium cursor-pointer
                  disabled:cursor-default ${optionStyle}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Hint */}
      {!submitted && exercise.hint && (
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-[var(--color-primary-light)] text-base underline mb-4 block cursor-pointer"
        >
          {showHint ? strings.lesson.hideHint : strings.lesson.hint}
        </button>
      )}
      {showHint && !submitted && (
        <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-lg mb-4">
          <p className="text-base text-amber-800">{exercise.hint}</p>
        </div>
      )}

      {/* Submit Button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className="px-8 py-3 text-lg font-semibold text-white rounded-lg
                     bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)]
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors cursor-pointer"
        >
          {strings.lesson.checkAnswer}
        </button>
      )}

      {/* Feedback */}
      {submitted && (
        <div className={`mt-4 px-5 py-4 rounded-lg animate-feedback ${
          isCorrect ? "bg-green-50 border border-green-300 animate-correct" : "bg-red-50 border border-red-300"
        }`}>
          <p className={`text-lg font-semibold mb-2 ${
            isCorrect ? "text-green-700" : "text-red-700"
          }`}>
            {isCorrect ? strings.lesson.correct : strings.lesson.incorrect}
          </p>
          <p className="text-base text-[var(--color-text)] leading-relaxed">
            {exercise.explanation}
          </p>
          {!isCorrect && (
            <button
              onClick={handleRetry}
              className="mt-3 px-6 py-2 text-base font-medium text-[var(--color-primary)]
                         border-2 border-[var(--color-primary)] rounded-lg
                         hover:bg-[var(--color-primary)] hover:text-white
                         transition-colors cursor-pointer"
            >
              {strings.lesson.tryAgain}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
