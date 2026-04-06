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

  function getOptionStyle(optionId: string): React.CSSProperties {
    if (submitted && optionId === exercise.correctAnswer) {
      return {
        background: "var(--color-success-light)",
        borderColor: "var(--color-success)",
        color: "var(--color-text)",
      };
    }
    if (submitted && selectedAnswer === optionId && !isCorrect) {
      return {
        background: "var(--color-error-light)",
        borderColor: "var(--color-error)",
        color: "var(--color-text)",
      };
    }
    if (selectedAnswer === optionId && !submitted) {
      return {
        background: "var(--color-info-light)",
        borderColor: "var(--color-primary-light)",
        color: "var(--color-text)",
      };
    }
    return {
      background: "var(--color-bg-elevated)",
      borderColor: "var(--color-border)",
      color: "var(--color-text)",
    };
  }

  return (
    <div
      className="rounded-xl"
      style={{
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border)",
        padding: "var(--space-lg)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <p
        className="text-xs font-bold uppercase tracking-wider mb-3"
        style={{ color: "var(--color-primary-lighter)" }}
      >
        {strings.lesson.exercise} {index + 1}
      </p>

      {/* Question */}
      <p
        className="text-base font-medium mb-5 leading-relaxed"
        style={{ color: "var(--color-text)" }}
      >
        {exercise.question}
      </p>

      {/* Multiple Choice Options */}
      {exercise.type === "multiple_choice" && exercise.options && (
        <div className="flex flex-col gap-2.5 mb-5">
          {exercise.options.map((option) => (
            <button
              key={option.id}
              onClick={() => !submitted && setSelectedAnswer(option.id)}
              disabled={submitted}
              className="w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-150
                         text-base cursor-pointer disabled:cursor-default
                         hover:shadow-sm"
              style={getOptionStyle(option.id)}
            >
              <span
                className="font-bold mr-2.5 text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {option.id.toUpperCase()})
              </span>
              {option.text}
            </button>
          ))}
        </div>
      )}

      {/* True/False Options */}
      {exercise.type === "true_false" && (
        <div className="flex gap-3 mb-5">
          {[
            { id: "true", label: strings.lesson.trueLabel },
            { id: "false", label: strings.lesson.falseLabel },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => !submitted && setSelectedAnswer(option.id)}
              disabled={submitted}
              className="flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-150
                         text-base font-medium cursor-pointer disabled:cursor-default
                         hover:shadow-sm"
              style={getOptionStyle(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Hint */}
      {!submitted && exercise.hint && (
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-sm font-medium mb-4 block cursor-pointer transition-colors duration-150"
          style={{ color: "var(--color-primary-light)" }}
        >
          {showHint ? strings.lesson.hideHint : strings.lesson.hint}
          <span className="ml-1">{showHint ? "↑" : "↓"}</span>
        </button>
      )}
      {showHint && !submitted && (
        <div
          className="rounded-lg mb-4 animate-feedback"
          style={{
            background: "var(--color-accent-light)",
            border: "1px solid var(--color-accent)",
            padding: "var(--space-md)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {exercise.hint}
          </p>
        </div>
      )}

      {/* Submit Button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className="px-6 py-2.5 text-base font-semibold text-white rounded-lg
                     transition-all duration-200 cursor-pointer
                     disabled:opacity-35 disabled:cursor-not-allowed
                     hover:shadow-md active:scale-[0.98]"
          style={{ background: "var(--color-primary)" }}
        >
          {strings.lesson.checkAnswer}
        </button>
      )}

      {/* Feedback */}
      {submitted && (
        <div
          className={`rounded-lg mt-4 animate-feedback ${isCorrect ? "animate-correct" : ""}`}
          style={{
            background: isCorrect ? "var(--color-success-light)" : "var(--color-error-light)",
            border: `1px solid ${isCorrect ? "var(--color-success-border)" : "var(--color-error-border)"}`,
            padding: "var(--space-md) var(--space-lg)",
          }}
        >
          <p
            className="text-base font-semibold mb-1.5"
            style={{ color: isCorrect ? "var(--color-success)" : "var(--color-error)" }}
          >
            {isCorrect ? strings.lesson.correct : strings.lesson.incorrect}
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {exercise.explanation}
          </p>
          {!isCorrect && (
            <button
              onClick={handleRetry}
              className="mt-3 px-5 py-2 text-sm font-semibold rounded-lg
                         border-2 transition-all duration-200 cursor-pointer
                         hover:shadow-sm active:scale-[0.98]"
              style={{
                color: "var(--color-primary)",
                borderColor: "var(--color-primary)",
                background: "transparent",
              }}
            >
              {strings.lesson.tryAgain}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
