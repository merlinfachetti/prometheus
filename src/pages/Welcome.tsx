import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../hooks/useI18n";
import { loadAllModules, loadModuleLessons } from "../services/contentLoader";
import { getLastCompletedLessonId, getCompletedLessonIds } from "../services/progress";

export function Welcome() {
  const { strings } = useI18n();
  const navigate = useNavigate();
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const [hasProgress, setHasProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findNextLesson() {
      try {
        const completedIds = await getCompletedLessonIds();
        const lastCompleted = await getLastCompletedLessonId();

        if (completedIds.size === 0 || !lastCompleted) {
          // No progress — start from the beginning
          const modules = loadAllModules();
          if (modules.length > 0) {
            const lessons = loadModuleLessons(modules[0].id);
            if (lessons.length > 0) {
              setNextLessonId(lessons[0].id);
            }
          }
          setLoading(false);
          return;
        }

        setHasProgress(true);

        // Find the next uncompleted lesson
        const modules = loadAllModules();
        for (const mod of modules) {
          const lessons = loadModuleLessons(mod.id);
          for (const lesson of lessons) {
            if (!completedIds.has(lesson.id)) {
              setNextLessonId(lesson.id);
              setLoading(false);
              return;
            }
          }
        }

        // All lessons completed — go to first lesson (review mode)
        if (modules.length > 0) {
          const lessons = loadModuleLessons(modules[0].id);
          if (lessons.length > 0) {
            setNextLessonId(lessons[0].id);
          }
        }
      } catch {
        // If DB fails (e.g., first run before migration), start from beginning
        const modules = loadAllModules();
        if (modules.length > 0) {
          const lessons = loadModuleLessons(modules[0].id);
          if (lessons.length > 0) {
            setNextLessonId(lessons[0].id);
          }
        }
      }
      setLoading(false);
    }

    findNextLesson();
  }, []);

  function handleStart() {
    if (nextLessonId) {
      navigate(`/lesson/${nextLessonId}`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      {/* Logo / Title */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-[var(--color-primary)] mb-4">
          {strings.app.title}
        </h1>
        <p className="text-xl text-[var(--color-text-muted)]">
          {strings.app.subtitle}
        </p>
      </div>

      {/* Welcome message */}
      <div className="max-w-lg mb-12">
        <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">
          {strings.welcome.heading}
        </h2>
        <p className="text-lg text-[var(--color-text-muted)] leading-relaxed">
          {strings.welcome.description}
        </p>
      </div>

      {/* Primary action */}
      {!loading && (
        <button
          onClick={handleStart}
          disabled={!nextLessonId}
          className="px-10 py-4 text-xl font-semibold text-white rounded-xl
                     bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors duration-200 shadow-lg
                     focus-visible:outline-3 focus-visible:outline-[var(--color-accent)]
                     cursor-pointer"
        >
          {hasProgress ? strings.welcome.continueButton : strings.welcome.startButton}
        </button>
      )}
    </div>
  );
}
