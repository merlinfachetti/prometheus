import { useState } from "react";

interface TutorButtonProps {
  lessonTitle: string;
  lessonSummary: string;
}

/**
 * Floating tutor button.
 *
 * Business rule: "Tutor always available — user never gets stuck."
 * Provides contextual help based on the current lesson.
 * Phase 3 will expand this with adaptive responses.
 */
export function TutorButton({ lessonTitle, lessonSummary }: TutorButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full
                   text-white text-lg font-bold
                   transition-all duration-200 cursor-pointer
                   flex items-center justify-center z-50
                   hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
          boxShadow: "var(--shadow-lg)",
        }}
        title="Precisa de ajuda?"
      >
        ?
      </button>

      {/* Help panel */}
      {open && (
        <div
          className="fixed bottom-20 right-6 w-80 max-h-96 rounded-xl overflow-hidden z-50 animate-slide-up"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {/* Panel header */}
          <div
            className="flex items-center justify-between"
            style={{
              background: "var(--color-primary)",
              padding: "var(--space-md) var(--space-lg)",
            }}
          >
            <h3 className="text-sm font-semibold text-white">Precisa de ajuda?</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white text-base cursor-pointer
                         transition-colors duration-150"
            >
              ✕
            </button>
          </div>

          {/* Panel content */}
          <div
            className="overflow-y-auto max-h-72"
            style={{ padding: "var(--space-md) var(--space-lg)" }}
          >
            <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
              Você está na aula: <strong style={{ color: "var(--color-text)" }}>{lessonTitle}</strong>
            </p>

            <div className="flex flex-col gap-3">
              {/* Lesson summary */}
              <div
                className="rounded-lg"
                style={{
                  background: "var(--color-info-light)",
                  border: "1px solid var(--color-info-border)",
                  padding: "var(--space-sm) var(--space-md)",
                }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: "var(--color-info)" }}
                >
                  Resumo da aula
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
                  {lessonSummary}
                </p>
              </div>

              {/* General tips */}
              <div
                className="rounded-lg"
                style={{
                  background: "var(--color-accent-light)",
                  border: "1px solid var(--color-accent)",
                  padding: "var(--space-sm) var(--space-md)",
                }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: "var(--color-accent-hover)" }}
                >
                  Dicas gerais
                </p>
                <div className="text-sm flex flex-col gap-1" style={{ color: "var(--color-text)" }}>
                  <p>Leia o conteúdo com calma, sem pressa</p>
                  <p>Preste atenção nos destaques coloridos</p>
                  <p>Nos exercícios, use as dicas se precisar</p>
                  <p>Errar faz parte — leia a explicação</p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                    Pressione ESC para voltar à lista de aulas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
