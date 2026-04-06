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
      <header
        className="shrink-0 border-b"
        style={{
          background: "var(--color-bg-elevated)",
          borderColor: "var(--color-border)",
          padding: "var(--space-md) var(--space-2xl)",
        }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm font-medium cursor-pointer
                       transition-colors duration-150 hover:opacity-80"
            style={{ color: "var(--color-primary-light)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            {strings.navigation.back}
          </button>
          <h1
            className="text-lg font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {strings.settings.title}
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: "var(--space-xl) var(--space-2xl)" }}
      >
        <div className="max-w-lg mx-auto flex flex-col gap-5">
          {/* Reset Progress */}
          <div
            className="rounded-xl"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-sm)",
              padding: "var(--space-lg)",
            }}
          >
            <h2
              className="text-base font-semibold mb-1.5"
              style={{ color: "var(--color-text)" }}
            >
              {strings.settings.resetProgress}
            </h2>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {strings.settings.resetConfirm}
            </p>

            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-5 py-2 text-sm font-semibold rounded-lg border-2
                           transition-all duration-200 cursor-pointer hover:shadow-sm"
                style={{
                  color: "var(--color-error)",
                  borderColor: "var(--color-error-border)",
                  background: "transparent",
                }}
              >
                {strings.settings.resetProgress}
              </button>
            ) : (
              <div className="flex gap-3 animate-feedback">
                <button
                  onClick={handleReset}
                  className="px-5 py-2 text-sm font-semibold text-white rounded-lg
                             transition-all duration-200 cursor-pointer
                             hover:shadow-md active:scale-[0.98]"
                  style={{ background: "var(--color-error)" }}
                >
                  {strings.settings.confirm}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2 text-sm font-medium rounded-lg border
                             transition-all duration-200 cursor-pointer hover:shadow-sm"
                  style={{
                    color: "var(--color-text-secondary)",
                    borderColor: "var(--color-border)",
                    background: "transparent",
                  }}
                >
                  {strings.settings.cancel}
                </button>
              </div>
            )}

            {resetDone && (
              <p
                className="mt-3 text-sm font-medium animate-feedback"
                style={{ color: "var(--color-success)" }}
              >
                {strings.settings.resetSuccess}
              </p>
            )}
          </div>

          {/* Version info */}
          <div
            className="rounded-xl"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-sm)",
              padding: "var(--space-lg)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {strings.settings.version}:{" "}
              <span className="font-semibold" style={{ color: "var(--color-text)" }}>
                0.1.0-alpha
              </span>
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
              Prometheus — Physics Learning Platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
