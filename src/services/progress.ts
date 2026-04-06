import type { UserProgress } from "../types/content";

/**
 * Progress service.
 *
 * Communicates with the SQLite database through the Tauri SQL plugin.
 * All data stays local — zero network dependency.
 */

let db: unknown = null;

async function getDb() {
  if (db) return db;
  // Dynamic import to avoid issues when running outside Tauri (e.g., browser dev)
  const { default: Database } = await import("@tauri-apps/plugin-sql");
  db = await Database.load("sqlite:prometheus.db");
  return db;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = { execute: (q: string, b?: unknown[]) => Promise<any>; select: (q: string, b?: unknown[]) => Promise<any[]> };

export async function saveProgress(
  lessonId: string,
  moduleId: string,
  score: number,
  totalExercises: number,
  completed: boolean
): Promise<void> {
  const database = (await getDb()) as DB;

  await database.execute(
    `INSERT INTO user_progress (lesson_id, module_id, completed, score, total_exercises, attempts, last_attempt, updated_at)
     VALUES ($1, $2, $3, $4, $5, 1, datetime('now'), datetime('now'))
     ON CONFLICT(lesson_id) DO UPDATE SET
       completed = CASE WHEN $3 = 1 THEN 1 ELSE completed END,
       score = CASE WHEN $4 > score THEN $4 ELSE score END,
       total_exercises = $5,
       attempts = attempts + 1,
       last_attempt = datetime('now'),
       updated_at = datetime('now')`,
    [lessonId, moduleId, completed ? 1 : 0, score, totalExercises]
  );
}

export async function getProgress(lessonId: string): Promise<UserProgress | null> {
  const database = (await getDb()) as DB;

  const rows = await database.select(
    "SELECT * FROM user_progress WHERE lesson_id = $1",
    [lessonId]
  );

  if (rows.length === 0) return null;

  const row = rows[0] as Record<string, unknown>;
  return {
    lessonId: row.lesson_id as string,
    completed: (row.completed as number) === 1,
    score: row.score as number,
    attempts: row.attempts as number,
    lastAttempt: row.last_attempt as string,
  };
}

export async function getAllProgress(): Promise<UserProgress[]> {
  const database = (await getDb()) as DB;

  const rows = await database.select(
    "SELECT * FROM user_progress ORDER BY updated_at DESC"
  );

  return rows.map((row: Record<string, unknown>) => ({
    lessonId: row.lesson_id as string,
    completed: (row.completed as number) === 1,
    score: row.score as number,
    attempts: row.attempts as number,
    lastAttempt: row.last_attempt as string,
  }));
}

export async function getLastCompletedLessonId(): Promise<string | null> {
  const database = (await getDb()) as DB;

  const rows = await database.select(
    "SELECT lesson_id FROM user_progress WHERE completed = 1 ORDER BY updated_at DESC LIMIT 1"
  );

  if (rows.length === 0) return null;
  return (rows[0] as Record<string, unknown>).lesson_id as string;
}

export async function resetAllProgress(): Promise<void> {
  const database = (await getDb()) as DB;
  await database.execute("DELETE FROM user_progress");
}

export async function getCompletedLessonIds(): Promise<Set<string>> {
  const database = (await getDb()) as DB;

  const rows = await database.select(
    "SELECT lesson_id FROM user_progress WHERE completed = 1"
  );

  return new Set(rows.map((row: Record<string, unknown>) => row.lesson_id as string));
}
