'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import en, { type Translations } from './en';
import id from './id';

type Lang = 'en' | 'id';

const translations: Record<Lang, Translations> = { en, id };

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | null>(null);

const ID_TIMEZONES = new Set(['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura']);

function detectRegion(): Lang {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (ID_TIMEZONES.has(tz)) return 'id';
  } catch {}
  const navLang = navigator.language?.toLowerCase() || '';
  if (navLang.startsWith('id')) return 'id';
  return 'en';
}

function detectLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('cafe_lang') as Lang | null;
  if (stored && (stored === 'en' || stored === 'id')) return stored;
  return detectRegion();
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    setLangState(detectLang());
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('cafe_lang', l);
    document.documentElement.lang = l;
  }, []);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
