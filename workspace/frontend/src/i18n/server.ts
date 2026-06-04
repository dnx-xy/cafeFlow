import type { Translations } from './en';
import en from './en';
import id from './id';

const translations: Record<string, Translations> = { en, id };

export function getTranslations(lang: string = 'en'): Translations {
  if (lang === 'id') return translations.id;
  return translations.en;
}
