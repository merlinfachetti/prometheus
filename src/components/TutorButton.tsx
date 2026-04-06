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
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full
                   bg-[var(--color-primary)] text-white text-2xl
                   shadow-xl hover:bg-[var(--color-primary-light)]
                   transition-all duration-200 cursor-pointer
                   flex items-center justify-center z-50"
        title="Precisa de ajuda?"
      >
        ?
      </button>

      {/* Help panel */}
      {open && (
        <div className="fixed bottom-24 right-8 w-96 max-h-96 bg-white rounded-xl
                        shadow-2xl border border-gray-200 overflow-hidden z-50">
          <div className="px-6 py-4 bg-[var(--color-primary)] text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Precisa de ajuda?</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="px-6 py-4 overflow-y-auto max-h-72">
            <p className="text-base text-[var(--color-text)] mb-4">
              Você está na aula: <strong>{lessonTitle}</strong>
            </p>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <p className="text-sm font-semibold text-blue-700 mb-1">Resumo da aula</p>
                <p className="text-sm text-[var(--color-text)]">{lessonSummary}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <p className="text-sm font-semibold text-amber-700 mb-1">Dicas gerais</p>
                <ul className="text-sm text-[var(--color-text)] space-y-1">
                  <li>• Leia o conteúdo com calma, sem pressa</li>
                  <li>• Preste atenção nos destaques coloridos</li>
                  <li>• Nos exercícios, use as dicas se precisar</li>
                  <li>• Errar faz parte — leia a explicação com atenção</li>
                  <li>• Pressione ESC para voltar à lista de aulas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
