import { useNavigate } from "react-router-dom";

interface LessonCardProps {
  lessonId: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
  locked: boolean;
  current: boolean;
}

export function LessonCard({
  lessonId,
  title,
  description,
  order,
  completed,
  locked,
  current,
}: LessonCardProps) {
  const navigate = useNavigate();

  function handleClick() {
    if (!locked) {
      navigate(`/lesson/${lessonId}`);
    }
  }

  // Compute visual state
  let containerStyle = "";
  let badgeBg = "";
  let badgeColor = "";
  let badgeContent: string | number = order;

  if (completed) {
    containerStyle = "hover:shadow-md cursor-pointer";
    badgeBg = "var(--color-success)";
    badgeColor = "#fff";
    badgeContent = "✓";
  } else if (current) {
    containerStyle = "hover:shadow-md cursor-pointer ring-2";
    badgeBg = "var(--color-accent)";
    badgeColor = "#fff";
    badgeContent = order;
  } else if (locked) {
    containerStyle = "opacity-50 cursor-not-allowed";
    badgeBg = "var(--color-bg-subtle)";
    badgeColor = "var(--color-text-muted)";
    badgeContent = order;
  } else {
    containerStyle = "hover:shadow-md cursor-pointer";
    badgeBg = "var(--color-bg-subtle)";
    badgeColor = "var(--color-text-secondary)";
  }

  return (
    <button
      onClick={handleClick}
      disabled={locked}
      className={`w-full text-left flex items-center gap-5 px-5 py-4 rounded-xl
                  transition-all duration-200 ${containerStyle}`}
      style={{
        background: current ? "var(--color-accent-light)" : "var(--color-bg-elevated)",
        border: `1px solid ${current ? "var(--color-accent)" : "var(--color-border)"}`,
        boxShadow: current ? "var(--shadow-md)" : "var(--shadow-sm)",
        ringColor: current ? "var(--color-accent)" : undefined,
      }}
    >
      {/* Order badge */}
      <div
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
        style={{ background: badgeBg, color: badgeColor }}
      >
        {badgeContent}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className="text-base font-semibold mb-0.5 truncate"
          style={{ color: locked ? "var(--color-text-muted)" : "var(--color-text)" }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-snug line-clamp-2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {description}
        </p>
      </div>

      {/* Arrow / Lock indicator */}
      <div className="shrink-0" style={{ color: "var(--color-text-muted)" }}>
        {locked ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        )}
      </div>
    </button>
  );
}
