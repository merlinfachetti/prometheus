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
        <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>
          {strings.errors.contentLoadFailed}
        </p>
      </div>
    );
  }

  const moduleLessons = loadModuleLessons(lesson.moduleId);
  const lessonIndex = moduleLessons.findIndex((l) => l.id === lesson.id);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header
        className="shrink-0 border-b"
        style={{
          background: "var(--color-bg-elevated)",
          borderColor: "var(--color-border)",
          padding: "var(--space-md) var(--space-2xl)",
        }}
      >
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate(`/module/${lesson.moduleId}`)}
              className="flex items-center gap-1.5 text-sm font-medium cursor-pointer
                         transition-colors duration-150 hover:opacity-80"
              style={{ color: "var(--color-primary-light)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              {strings.navigation.back}
            </button>

            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              {strings.lesson.lessonOf
                .replace("{current}", String(lessonIndex + 1))
                .replace("{total}", String(moduleLessons.length))}
            </span>

            <div className="w-16" />
          </div>

          <h1
            className="text-xl font-bold text-center mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            {lesson.title}
          </h1>

          {(phase === "exercises" || phase === "completed") && (
            <ProgressBar
              current={completedExercises.size}
              total={lesson.exercises.length}
              label={strings.lesson.progress}
            />
          )}
        </div>
      </header>

      {/* Content area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ padding: "var(--space-xl) var(--space-2xl)" }}
      >
        <div className="max-w-xl mx-auto">
          {/* Lesson content blocks */}
          <div className="mb-10">
            {lesson.blocks.map((block, i) => (
              <LessonBlock key={i} block={block} />
            ))}
          </div>

          {/* Transition to exercises */}
          {phase === "content" && lesson.exercises.length > 0 && (
            <div className="text-center py-10 animate-fade-in" style={{ borderTop: "1px solid var(--color-border)" }}>
              <p
                className="text-base mb-5"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {strings.lesson.practicePrompt}
              </p>
              <button
                onClick={() => { setPhase("exercises"); scrollToTop(); }}
                className="px-8 py-3.5 text-lg font-semibold text-white rounded-xl
                           transition-all duration-200 cursor-pointer
                           hover:shadow-lg active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                {strings.lesson.startExercises}
              </button>
            </div>
          )}

          {/* Exercises */}
          {(phase === "exercises" || phase === "completed") && (
            <div className="pt-8 animate-fade-in" style={{ borderTop: "1px solid var(--color-border)" }}>
              <h2
                className="text-xl font-bold mb-6"
                style={{ color: "var(--color-primary)" }}
              >
                {strings.lesson.exercisesTitle}
              </h2>
              <div className="flex flex-col gap-5">
                {lesson.exercises.map((exercise, i) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    index={i}
                    onComplete={handleExerciseComplete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completion */}
          {phase === "completed" && (
            <div className="text-center py-10 mt-8 animate-fade-in" style={{ borderTop: "1px solid var(--color-border)" }}>
              <div
                className="inline-block rounded-xl"
                style={{
                  background: "var(--color-success-light)",
                  border: "1px solid var(--color-success-border)",
                  padding: "var(--space-lg) var(--space-2xl)",
                }}
              >
                <p className="text-xl font-bold mb-1.5" style={{ color: "var(--color-success)" }}>
                  {strings.lesson.lessonComplete}
                </p>
                <p className="text-base" style={{ color: "var(--color-text)" }}>
                  {strings.lesson.scoreMessage
                    .replace("{score}", String(score))
                    .replace("{total}", String(lesson.exercises.length))}
                </p>
              </div>
              <div className="mt-8">
                <button
                  onClick={handleNextLesson}
                  className="group px-8 py-3.5 text-lg font-semibold text-white rounded-xl
                             transition-all duration-200 cursor-pointer
                             hover:shadow-lg active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  {strings.lesson.nextLesson}
                  <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <TutorButton
        lessonTitle={lesson.title}
        lessonSummary={lesson.description}
      />
    </div>
  );
}
