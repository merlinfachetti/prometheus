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

  let cardStyle = "border-gray-200 hover:border-[var(--color-primary-light)] hover:shadow-md cursor-pointer";
  let statusIcon = "";
  let statusColor = "text-[var(--color-text-muted)]";

  if (completed) {
    cardStyle = "border-green-300 bg-green-50 hover:shadow-md cursor-pointer";
    statusIcon = "✓";
    statusColor = "text-green-600";
  } else if (current) {
    cardStyle = "border-[var(--color-accent)] bg-amber-50 shadow-md cursor-pointer";
    statusIcon = "→";
    statusColor = "text-[var(--color-accent)]";
  } else if (locked) {
    cardStyle = "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed";
    statusIcon = "🔒";
    statusColor = "text-gray-400";
  }

  return (
    <button
      onClick={handleClick}
      disabled={locked}
      className={`w-full text-left px-6 py-5 rounded-xl border-2 transition-all duration-200 ${cardStyle}`}
    >
      <div className="flex items-start gap-4">
        {/* Order number / status */}
        <div className={`text-2xl font-bold ${statusColor} min-w-[40px] text-center`}>
          {completed || current || locked ? statusIcon : order}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">
            {title}
          </h3>
          <p className="text-base text-[var(--color-text-muted)]">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
