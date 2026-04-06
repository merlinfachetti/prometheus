/**
 * Core content types for the Prometheus learning platform.
 * Content is stored as JSON and loaded from locale-specific directories.
 */

export interface LessonBlock {
  type: "text" | "formula" | "image" | "example" | "highlight";
  content: string;
}

export interface ExerciseOption {
  id: string;
  text: string;
}

export interface Exercise {
  id: string;
  type: "multiple_choice" | "fill_blank" | "true_false";
  question: string;
  options?: ExerciseOption[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  description: string;
  blocks: LessonBlock[];
  exercises: Exercise[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: string[]; // lesson IDs in order
}

export interface UserProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  attempts: number;
  lastAttempt: string; // ISO date
}
