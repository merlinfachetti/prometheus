import type { Lesson, Module } from "../types/content";
import type { Locale } from "../types/i18n";
import { getLocale } from "./i18n";

/**
 * Content loader service.
 *
 * Loads lesson and module JSON files from the locale-specific content directory.
 * Uses Vite's import.meta.glob for static bundling of all content at build time,
 * which is essential for offline-first: no network requests needed.
 */

// Eagerly import all module and lesson JSON files at build time
const moduleFiles = import.meta.glob<Module>(
  "../../content/locales/*/modules/*/module.json",
  { eager: true, import: "default" }
);

const lessonFiles = import.meta.glob<Lesson>(
  "../../content/locales/*/modules/*/*.json",
  { eager: true, import: "default" }
);

export function loadModule(moduleId: string, locale?: Locale): Module | null {
  const lang = locale ?? getLocale();

  for (const [filePath, mod] of Object.entries(moduleFiles)) {
    if (filePath.includes(`/${lang}/modules/${moduleId}/module.json`)) {
      return mod;
    }
  }
  return null;
}

export function loadLesson(lessonId: string, locale?: Locale): Lesson | null {
  const lang = locale ?? getLocale();

  for (const [filePath, lesson] of Object.entries(lessonFiles)) {
    if (
      filePath.includes(`/${lang}/`) &&
      !filePath.endsWith("module.json") &&
      (lesson as Lesson).id === lessonId
    ) {
      return lesson as Lesson;
    }
  }
  return null;
}

export function loadAllModules(locale?: Locale): Module[] {
  const lang = locale ?? getLocale();
  const modules: Module[] = [];

  for (const [filePath, mod] of Object.entries(moduleFiles)) {
    if (filePath.includes(`/${lang}/`)) {
      modules.push(mod);
    }
  }

  return modules.sort((a, b) => a.order - b.order);
}

export function loadModuleLessons(moduleId: string, locale?: Locale): Lesson[] {
  const mod = loadModule(moduleId, locale);
  if (!mod) return [];

  const lessons: Lesson[] = [];
  for (const lessonId of mod.lessons) {
    const lesson = loadLesson(lessonId, locale);
    if (lesson) lessons.push(lesson);
  }

  return lessons.sort((a, b) => a.order - b.order);
}
