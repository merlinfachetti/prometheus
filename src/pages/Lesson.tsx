import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadLesson, loadModule, loadModuleLessons } from "../services/contentLoader";
import { saveProgress } from "../services/progress";
import { useI18n } from "../hooks/useI18n";
import { LessonBlock } from "../components/LessonBlock";
import { ExerciseCard } from "../components/ExerciseCard";
import { ProgressBar } from "../components/ProgressBar";
import { TutorButton } from "../components/TutorButton";
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
  const [progressSaved, setProgressSaved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollToTop() {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (!lessonId) return;
    const loaded = loadLesson(lessonId);
    if (loaded) {
      setLesson(loaded);
      setPhase("content");
      setCompletedExercises(new Set());
      setScore(0);
      setProgressSaved(false);
    }
  }, [lessonId]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && lesson) {
        navigate(`/module/${lesson.moduleId}`);
      }
    },
    [navigate, lesson]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function handleExerciseComplete(exerciseId: string, correct: boolean) {
    setCompletedExercises((prev) => new Set(prev).add(exerciseId));
    if (correct) {
      setScore((prev) => prev + 1);
    }
  }

  const allExercisesDone =
    lesson !== null && completedExercises.size === lesson.exercises.length;

  useEffect(() => {
    if (allExercisesDone && phase === "exercises" && lesson && !progressSaved) {
      setPhase("completed");
      setProgressSaved(true);
      saveProgress(
        lesson.id,
        lesson.moduleId,
        score,
        lesson.exercises.length,
        true
      ).catch((err) => console.error("Failed to save progress:", err));
    }
  }, [allExercisesDone, phase, lesson, score, progressSaved]);

  function handleNextLesson() {
    if (!lesson) return;

    const mod = loadModule(lesson.moduleId);
    if (!mod) {
      navigate("/");
      return;
    }

    const lessons = loadModuleLessons(lesson.moduleId);
    const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
    const nextLesson = lessons[currentIndex + 1];

    if (nextLesson) {
      navigate(`/lesson/${nextLesson.id}`);
    } else {
      navigate(`/module/${lesson.moduleId}/complete`);
    }
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-[var(--color-text-muted)]">
          {strings.errors.contentLoadFailed}
        </p>
      </div>
    );
  }

  // Calculate lesson position in module
  const moduleLessons = loadModuleLessons(lesson.moduleId);
  const lessonIndex = moduleLessons.findIndex((l) => l.id === lesson.id);

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <header className="px-8 py-4 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(`/module/${lesson.moduleId}`)}
            className="text-[var(--color-primary-light)] text-base font-medium hover:underline cursor-pointer"
          >
            ← {strings.navigation.back}
          </button>
          <span className="text-sm text-[var(--color-text-muted)]">
            {strings.lesson.lessonOf
              .replace("{current}", String(lessonIndex + 1))
              .replace("{total}", String(moduleLessons.length))}
          </span>
          <div className="w-16" />
        </div>
        <h1 className="text-xl font-bold text-[var(--color-primary)] text-center mb-3">
          {lesson.title}
        </h1>
        {/* Exercise progress (only show during exercises phase) */}
        {(phase === "exercises" || phase === "completed") && (
          <ProgressBar
            current={completedExercises.size}
            total={lesson.exercises.length}
            label={strings.lesson.progress}
          />
        )}
      </header>

      {/* Content area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Lesson content blocks */}
          <div className="mb-8">
            {lesson.blocks.map((block, i) => (
              <LessonBlock key={i} block={block} />
            ))}
          </div>

          {/* Transition to exercises */}
          {phase === "content" && lesson.exercises.length > 0 && (
            <div className="text-center py-8 border-t border-gray-200 animate-fade-in">
              <p className="text-lg text-[var(--color-text-muted)] mb-4">
                {strings.lesson.practicePrompt}
              </p>
              <button
                onClick={() => { setPhase("exercises"); scrollToTop(); }}
                className="px-10 py-4 text-xl font-semibold text-white rounded-xl
                           bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]
                           transition-colors shadow-lg cursor-pointer"
              >
                {strings.lesson.startExercises}
              </button>
            </div>
          )}

          {/* Exercises */}
          {(phase === "exercises" || phase === "completed") && (
            <div className="border-t border-gray-200 pt-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                {strings.lesson.exercisesTitle}
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
            <div className="text-center py-8 border-t border-gray-200 mt-8 animate-fade-in">
              <div className="bg-green-50 border border-green-300 rounded-xl px-8 py-6 inline-block">
                <p className="text-2xl font-bold text-green-700 mb-2">
                  {strings.lesson.lessonComplete}
                </p>
                <p className="text-lg text-[var(--color-text)]">
                  {strings.lesson.scoreMessage
                    .replace("{score}", String(score))
                    .replace("{total}", String(lesson.exercises.length))}
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleNextLesson}
                  className="px-10 py-4 text-xl font-semibold text-white rounded-xl
                             bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]
                             transition-colors shadow-lg cursor-pointer"
                >
                  {strings.lesson.nextLesson} →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tutor — always available */}
      <TutorButton
        lessonTitle={lesson.title}
        lessonSummary={lesson.description}
      />
    </div>
  );
}
