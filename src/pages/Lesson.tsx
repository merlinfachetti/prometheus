import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadLesson } from "../services/contentLoader";
import { useI18n } from "../hooks/useI18n";
import { LessonBlock } from "../components/LessonBlock";
import { ExerciseCard } from "../components/ExerciseCard";
import type { Lesson as LessonType } from "../types/content";

type LessonPhase = "content" | "exercises" | "completed";

export function Lesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { strings } = useI18n();
  const [lesson, setLesson] = useState<LessonType | null>(null);
  const [phase, setPhase] = useState<LessonPhase>("content");
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!lessonId) return;
    const loaded = loadLesson(lessonId);
    if (loaded) {
      setLesson(loaded);
    }
  }, [lessonId]);

  function handleExerciseComplete(exerciseId: string, correct: boolean) {
    setCompletedExercises((prev) => new Set(prev).add(exerciseId));
    if (correct) {
      setScore((prev) => prev + 1);
    }
  }

  const allExercisesDone =
    lesson !== null && completedExercises.size === lesson.exercises.length;

  useEffect(() => {
    if (allExercisesDone && phase === "exercises") {
      setPhase("completed");
    }
  }, [allExercisesDone, phase]);

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-[var(--color-text-muted)]">
          {strings.errors.contentLoadFailed}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={() => navigate("/")}
          className="text-[var(--color-primary-light)] text-lg font-medium hover:underline cursor-pointer"
        >
          ← {strings.navigation.home}
        </button>
        <h1 className="text-xl font-bold text-[var(--color-primary)]">
          {lesson.title}
        </h1>
        <div className="w-20" />
      </header>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Lesson content blocks */}
          <div className="mb-8">
            {lesson.blocks.map((block, i) => (
              <LessonBlock key={i} block={block} />
            ))}
          </div>

          {/* Transition to exercises */}
          {phase === "content" && lesson.exercises.length > 0 && (
            <div className="text-center py-8 border-t border-gray-200">
              <p className="text-lg text-[var(--color-text-muted)] mb-4">
                Hora de praticar o que você aprendeu!
              </p>
              <button
                onClick={() => setPhase("exercises")}
                className="px-10 py-4 text-xl font-semibold text-white rounded-xl
                           bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]
                           transition-colors shadow-lg cursor-pointer"
              >
                Iniciar Exercícios
              </button>
            </div>
          )}

          {/* Exercises */}
          {(phase === "exercises" || phase === "completed") && (
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                Exercícios
              </h2>
              {lesson.exercises.map((exercise, i) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  index={i}
                  onComplete={handleExerciseComplete}
                />
              ))}
            </div>
          )}

          {/* Completion */}
          {phase === "completed" && (
            <div className="text-center py-8 border-t border-gray-200 mt-8">
              <div className="bg-green-50 border border-green-300 rounded-xl px-8 py-6 inline-block">
                <p className="text-2xl font-bold text-green-700 mb-2">
                  Aula concluída!
                </p>
                <p className="text-lg text-[var(--color-text)]">
                  Você acertou {score} de {lesson.exercises.length} exercícios.
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/")}
                  className="px-10 py-4 text-xl font-semibold text-white rounded-xl
                             bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]
                             transition-colors shadow-lg cursor-pointer"
                >
                  {strings.navigation.continue}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
