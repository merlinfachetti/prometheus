import type { LessonBlock as LessonBlockType } from "../types/content";

interface LessonBlockProps {
  block: LessonBlockType;
}

export function LessonBlock({ block }: LessonBlockProps) {
  switch (block.type) {
    case "text":
      return (
        <p
          className="text-base leading-relaxed mb-6"
          style={{ color: "var(--color-text)" }}
        >
          {block.content}
        </p>
      );

    case "highlight":
      return (
        <div
          className="mb-6 rounded-lg"
          style={{
            borderLeft: "4px solid var(--color-accent)",
            background: "var(--color-accent-light)",
            padding: "var(--space-md) var(--space-lg)",
          }}
        >
          <p className="text-base font-semibold" style={{ color: "var(--color-primary)" }}>
            {block.content}
          </p>
        </div>
      );

    case "example":
      return (
        <div
          className="mb-6 rounded-lg"
          style={{
            background: "var(--color-info-light)",
            border: "1px solid var(--color-info-border)",
            padding: "var(--space-md) var(--space-lg)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-wider mb-2"
            style={{ color: "var(--color-info)" }}
          >
            Exemplo
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--color-text)" }}>
            {block.content}
          </p>
        </div>
      );

    case "formula":
      return (
        <div
          className="mb-6 rounded-lg text-center"
          style={{
            background: "var(--color-bg-subtle)",
            padding: "var(--space-lg) var(--space-xl)",
          }}
        >
          <p
            className="text-xl font-mono font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {block.content}
          </p>
        </div>
      );

    case "image":
      return (
        <div className="mb-6 flex justify-center">
          <img
            src={block.content}
            alt=""
            className="max-w-full rounded-lg"
            style={{ boxShadow: "var(--shadow-md)" }}
          />
        </div>
      );

    default:
      return null;
  }
}
