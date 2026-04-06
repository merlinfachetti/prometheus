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
        <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>Carregando...</p>
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>
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
      <header
        className="shrink-0 border-b"
        style={{
          background: "var(--color-bg-elevated)",
          borderColor: "var(--color-border)",
          padding: "var(--space-lg) var(--space-2xl)",
        }}
      >
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm font-medium mb-5 cursor-pointer
                       transition-colors duration-150 hover:opacity-80"
            style={{ color: "var(--color-primary-light)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            {strings.navigation.home}
          </button>

          <h1
            className="text-2xl font-bold mb-1.5"
            style={{ color: "var(--color-primary)" }}
          >
            {mod.title}
          </h1>
          <p
            className="text-sm mb-5 leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
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
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: "var(--space-lg) var(--space-2xl)" }}
      >
        <div className="max-w-xl mx-auto flex flex-col gap-3">
          {lessons.map((lesson, index) => {
            const isCompleted = completedIds.has(lesson.id);
            const isCurrent = index === firstUncompletedIndex;
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
