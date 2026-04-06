import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadModule, loadModuleLessons } from "../services/contentLoader";
import { getAllProgress } from "../services/progress";
import { useI18n } from "../hooks/useI18n";
import type { Module } from "../types/content";
import type { UserProgress } from "../types/content";

export function ModuleComplete() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { strings } = useI18n();
  const [mod, setMod] = useState<Module | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [totalExercises, setTotalExercises] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!moduleId) return;

      const loadedMod = loadModule(moduleId);
      if (!loadedMod) {
        navigate("/");
        return;
      }

      setMod(loadedMod);

      const lessons = loadModuleLessons(moduleId);
      const allProgress = await getAllProgress();
      const progressMap = new Map<string, UserProgress>();
      allProgress.forEach((p) => progressMap.set(p.lessonId, p));

      let scoreSum = 0;
      let exerciseSum = 0;
      for (const lesson of lessons) {
        const progress = progressMap.get(lesson.id);
        if (progress) {
          scoreSum += progress.score;
        }
        exerciseSum += lesson.exercises.length;
      }

      setTotalScore(scoreSum);
      setTotalExercises(exerciseSum);
      setLoading(false);
    }

    load();
  }, [moduleId, navigate]);

  if (loading || !mod) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>Carregando...</p>
      </div>
    );
  }

  const percentage = totalExercises > 0 ? Math.round((totalScore / totalExercises) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-fade-in">
      {/* Trophy */}
      <div className="text-7xl mb-6">
        {percentage >= 80 ? "🏆" : percentage >= 50 ? "🎯" : "📚"}
      </div>

      {/* Title */}
      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: "var(--color-primary)" }}
      >
        {strings.moduleComplete.title}
      </h1>

      <h2
        className="text-xl font-semibold mb-2"
        style={{ color: "var(--color-text)" }}
      >
        {mod.title}
      </h2>

      <p
        className="text-base mb-8 max-w-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {strings.moduleComplete.congratulations}
      </p>

      {/* Stats */}
      <div
        className="rounded-xl mb-10"
        style={{
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-md)",
          padding: "var(--space-lg) var(--space-2xl)",
        }}
      >
        <div className="flex gap-14">
          <div className="text-center">
            <p className="text-3xl font-bold tabular-nums" style={{ color: "var(--color-accent)" }}>
              {totalScore}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "var(--color-text-muted)" }}>
              {strings.moduleComplete.hits}
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold tabular-nums" style={{ color: "var(--color-primary)" }}>
              {totalExercises}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "var(--color-text-muted)" }}>
              {strings.moduleComplete.exercises}
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold tabular-nums" style={{ color: "var(--color-success)" }}>
              {percentage}%
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "var(--color-text-muted)" }}>
              {strings.moduleComplete.performance}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/module/${moduleId}`)}
          className="px-6 py-3 text-base font-semibold rounded-xl border-2
                     transition-all duration-200 cursor-pointer
                     hover:shadow-md active:scale-[0.98]"
          style={{
            color: "var(--color-primary)",
            borderColor: "var(--color-primary)",
            background: "transparent",
          }}
        >
          {strings.moduleComplete.reviewLessons}
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 text-base font-semibold text-white rounded-xl
                     transition-all duration-200 cursor-pointer
                     hover:shadow-lg active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {strings.moduleComplete.backToHome}
        </button>
      </div>
    </div>
  );
}
