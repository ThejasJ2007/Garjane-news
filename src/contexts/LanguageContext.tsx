'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language, Translations, translations } from '@/lib/translations';
import { formatRelativeTime, formatRelativeTimeKn, formatDate, formatDateKn } from '@/lib/utils';

const STORAGE_KEY = 'garjane_language';
const DEFAULT_LANGUAGE: Language = 'kn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  formatTime: (date: Date | string) => string;
  formatDateLang: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'kn' || stored === 'en') {
        setLanguageState(stored);
        document.documentElement.lang = stored;
      } else {
        document.documentElement.lang = DEFAULT_LANGUAGE;
      }
    } catch {
      // localStorage unavailable or restricted
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch {
      // localStorage error handling
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'kn' ? 'en' : 'kn');
  }, [language, setLanguage]);

  const formatTime = useCallback(
    (date: Date | string) => {
      return language === 'kn' ? formatRelativeTimeKn(date) : formatRelativeTime(date);
    },
    [language]
  );

  const formatDateLang = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      return language === 'kn' ? formatDateKn(date, options) : formatDate(date, options);
    },
    [language]
  );

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language],
    formatTime,
    formatDateLang,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Provide safe fallback if used outside provider
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: translations[DEFAULT_LANGUAGE],
      formatTime: (date) => formatRelativeTimeKn(date),
      formatDateLang: (date, options) => formatDateKn(date, options),
    };
  }
  return context;
}
