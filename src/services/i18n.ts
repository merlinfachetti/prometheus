import type { UIStrings, Locale } from "../types/i18n";

import ptBR from "../../content/locales/pt-BR/ui.json";
import en from "../../content/locales/en/ui.json";

const locales: Record<Locale, UIStrings> = {
  "pt-BR": ptBR as UIStrings,
  en: en as UIStrings,
};

const DEFAULT_LOCALE: Locale = "pt-BR";

let currentLocale: Locale = DEFAULT_LOCALE;

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(): UIStrings {
  return locales[currentLocale];
}
