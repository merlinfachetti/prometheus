import { useState, useCallback } from "react";
import { t, getLocale, setLocale } from "../services/i18n";
import type { UIStrings, Locale } from "../types/i18n";

interface UseI18nReturn {
  strings: UIStrings;
  locale: Locale;
  changeLocale: (locale: Locale) => void;
}

export function useI18n(): UseI18nReturn {
  const [locale, setCurrentLocale] = useState<Locale>(getLocale());

  const changeLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    setCurrentLocale(newLocale);
  }, []);

  return {
    strings: t(),
    locale,
    changeLocale,
  };
}
