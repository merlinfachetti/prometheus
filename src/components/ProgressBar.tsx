interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}
          >
            {label}
          </span>
          <span
            className="text-xs font-bold tabular-nums"
            style={{ color: "var(--color-primary)" }}
          >
            {current}/{total}
          </span>
        </div>
      )}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: "var(--color-bg-subtle)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: percentage === 100
              ? "var(--color-success)"
              : "linear-gradient(90deg, var(--color-accent), var(--color-accent-hover))",
          }}
        />
      </div>
    </div>
  );
}
