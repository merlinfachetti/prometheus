import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadModule, loadModuleLessons } from "../services/contentLoader";
import { getCompletedLessonIds } from "../services/progress";
import { useI18n } from "../hooks/useI18n";
import { ProgressBar } from "../components/ProgressBar";
import { LessonCard } from "../components/LessonCard";
import type { Module, Lesson } from "../types/content";

export function ModuleOverview() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { strings } = useI18n();
  const [mod, setMod] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!moduleId) return;

      const loadedMod = loadModule(moduleId);
      if (!loadedMod) {
        setLoading(false);
        return;
      }

      setMod(loadedMod);
      setLessons(loadModuleLessons(moduleId));

      try {
        const ids = await getCompletedLessonIds();
        setCompletedIds(ids);
      } catch {
        // First run — no progress yet
      }

      setLoading(false);
    }

    load();
  }, [moduleId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-[var(--color-text-muted)]">Carregando...</p>
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-[var(--color-text-muted)]">
          {strings.errors.contentLoadFailed}
        </p>
      </div>
    );
  }

  const completedCount = lessons.filter((l) => completedIds.has(l.id)).length;

  // Find first uncompleted lesson
  let firstUncompletedIndex = lessons.findIndex((l) => !completedIds.has(l.id));
  if (firstUncompletedIndex === -1) firstUncompletedIndex = lessons.length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 border-b border-gray-200 bg-white shrink-0">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="text-[var(--color-primary-light)] text-lg font-medium hover:underline cursor-pointer mb-4 block"
          >
            ← {strings.navigation.home}
          </button>
          <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">
            {mod.title}
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] mb-4">
            {mod.description}
          </p>
          <ProgressBar
            current={completedCount}
            total={lessons.length}
            label={strings.lesson.progress}
          />
        </div>
      </header>

      {/* Lesson list */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {lessons.map((lesson, index) => {
            const isCompleted = completedIds.has(lesson.id);
            const isCurrent = index === firstUncompletedIndex;
            // Lock lessons that are ahead of the first uncompleted (progressive blocking)
            const isLocked = index > firstUncompletedIndex;

            return (
              <LessonCard
                key={lesson.id}
                lessonId={lesson.id}
                title={lesson.title}
                description={lesson.description}
                order={lesson.order}
                completed={isCompleted}
                locked={isLocked}
                current={isCurrent}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
