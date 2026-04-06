import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../hooks/useI18n";
import { loadAllModules, loadModuleLessons } from "../services/contentLoader";
import { getCompletedLessonIds } from "../services/progress";

export function Welcome() {
  const { strings } = useI18n();
  const navigate = useNavigate();
  const [hasProgress, setHasProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkProgress() {
      try {
        const completedIds = await getCompletedLessonIds();
        setHasProgress(completedIds.size > 0);
      } catch {
        // First run — no progress yet
      }
      setLoading(false);
    }
    checkProgress();
  }, []);

  function handleStart() {
    const modules = loadAllModules();
    if (modules.length > 0) {
      navigate(`/module/${modules[0].id}`);
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
          className="px-10 py-4 text-xl font-semibold text-white rounded-xl
                     bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]
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
