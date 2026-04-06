import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetAllProgress } from "../services/progress";
import { useI18n } from "../hooks/useI18n";

export function Settings() {
  const navigate = useNavigate();
  const { strings } = useI18n();
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  async function handleReset() {
    try {
      await resetAllProgress();
      setResetDone(true);
      setShowConfirm(false);
      setTimeout(() => setResetDone(false), 3000);
    } catch (err) {
      console.error("Failed to reset progress:", err);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <header className="px-8 py-4 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-[var(--color-primary-light)] text-base font-medium hover:underline cursor-pointer"
          >
            ← {strings.navigation.back}
          </button>
          <h1 className="text-xl font-bold text-[var(--color-primary)]">
            {strings.settings.title}
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-lg mx-auto space-y-8">
          {/* Reset Progress */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">
              {strings.settings.resetProgress}
            </h2>
            <p className="text-base text-[var(--color-text-muted)] mb-4">
              {strings.settings.resetConfirm}
            </p>

            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-6 py-2 text-base font-medium text-red-600
                           border-2 border-red-300 rounded-lg
                           hover:bg-red-50 transition-colors cursor-pointer"
              >
                {strings.settings.resetProgress}
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 text-base font-semibold text-white
                             bg-red-600 rounded-lg hover:bg-red-700
                             transition-colors cursor-pointer"
                >
                  {strings.settings.confirm}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-6 py-2 text-base font-medium text-[var(--color-text-muted)]
                             border-2 border-gray-200 rounded-lg
                             hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {strings.settings.cancel}
                </button>
              </div>
            )}

            {resetDone && (
              <p className="mt-3 text-green-600 font-medium animate-feedback">
                {strings.settings.resetSuccess}
              </p>
            )}
          </div>

          {/* Version info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p className="text-base text-[var(--color-text-muted)]">
              {strings.settings.version}: <span className="font-semibold text-[var(--color-text)]">0.1.0-alpha</span>
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Prometheus — Physics Learning Platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
