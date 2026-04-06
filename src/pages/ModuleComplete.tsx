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
        <p className="text-xl text-[var(--color-text-muted)]">Carregando...</p>
      </div>
    );
  }

  const percentage = totalExercises > 0 ? Math.round((totalScore / totalExercises) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      {/* Trophy */}
      <div className="text-8xl mb-8">
        {percentage >= 80 ? "🏆" : percentage >= 50 ? "🎯" : "📚"}
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-[var(--color-primary)] mb-4">
        {strings.moduleComplete.title}
      </h1>

      <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-2">
        {mod.title}
      </h2>

      <p className="text-lg text-[var(--color-text-muted)] mb-8 max-w-md">
        {strings.moduleComplete.congratulations}
      </p>

      {/* Stats */}
      <div className="bg-white border border-gray-200 rounded-xl px-8 py-6 mb-8 shadow-sm">
        <div className="flex gap-12">
          <div className="text-center">
            <p className="text-3xl font-bold text-[var(--color-accent)]">{totalScore}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{strings.moduleComplete.hits}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[var(--color-primary)]">{totalExercises}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{strings.moduleComplete.exercises}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{percentage}%</p>
            <p className="text-sm text-[var(--color-text-muted)]">{strings.moduleComplete.performance}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/module/${moduleId}`)}
          className="px-8 py-3 text-lg font-medium text-[var(--color-primary)]
                     border-2 border-[var(--color-primary)] rounded-xl
                     hover:bg-[var(--color-primary)] hover:text-white
                     transition-colors cursor-pointer"
        >
          {strings.moduleComplete.reviewLessons}
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 text-lg font-semibold text-white rounded-xl
                     bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]
                     transition-colors shadow-lg cursor-pointer"
        >
          {strings.moduleComplete.backToHome}
        </button>
      </div>
    </div>
  );
}
