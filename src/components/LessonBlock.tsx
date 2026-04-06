import type { LessonBlock as LessonBlockType } from "../types/content";

interface LessonBlockProps {
  block: LessonBlockType;
}

export function LessonBlock({ block }: LessonBlockProps) {
  switch (block.type) {
    case "text":
      return (
        <p className="text-lg leading-relaxed text-[var(--color-text)] mb-6">
          {block.content}
        </p>
      );

    case "highlight":
      return (
        <div className="border-l-4 border-[var(--color-accent)] bg-amber-50 px-6 py-4 mb-6 rounded-r-lg">
          <p className="text-lg font-semibold text-[var(--color-primary)]">
            {block.content}
          </p>
        </div>
      );

    case "example":
      return (
        <div className="bg-blue-50 border border-blue-200 px-6 py-4 mb-6 rounded-lg">
          <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">
            Exemplo
          </p>
          <p className="text-lg text-[var(--color-text)] leading-relaxed">
            {block.content}
          </p>
        </div>
      );

    case "formula":
      return (
        <div className="bg-gray-100 px-6 py-4 mb-6 rounded-lg text-center">
          <p className="text-xl font-mono text-[var(--color-primary)]">
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
            className="max-w-full rounded-lg shadow-md"
          />
        </div>
      );

    default:
      return null;
  }
}
