import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../hooks/useI18n";
import { loadAllModules } from "../services/contentLoader";
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
    <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-fade-in">
      {/* Decorative top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))" }}
      />

      {/* Logo / Title */}
      <div className="mb-10">
        <h1
          className="text-6xl font-extrabold tracking-tight mb-3"
          style={{ color: "var(--color-primary)" }}
        >
          {strings.app.title}
        </h1>
        <p
          className="text-lg font-medium tracking-wide uppercase"
          style={{ color: "var(--color-text-muted)", letterSpacing: "0.12em" }}
        >
          {strings.app.subtitle}
        </p>
      </div>

      {/* Divider */}
      <div
        className="w-16 h-1 rounded-full mb-10"
        style={{ background: "var(--color-accent)" }}
      />

      {/* Welcome message */}
      <div className="max-w-md mb-12">
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: "var(--color-text)" }}
        >
          {strings.welcome.heading}
        </h2>
        <p
          className="text-base leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {strings.welcome.description}
        </p>
      </div>

      {/* Primary action */}
      {!loading && (
        <button
          onClick={handleStart}
          className="group relative px-10 py-4 text-lg font-semibold text-white rounded-xl
                     transition-all duration-200 cursor-pointer
                     hover:shadow-lg active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {hasProgress ? strings.welcome.continueButton : strings.welcome.startButton}
          <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </button>
      )}
    </div>
  );
}
