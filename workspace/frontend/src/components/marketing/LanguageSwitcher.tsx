'use client';

import { useI18n } from '@/i18n/context';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-muted/50"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span>{lang === 'en' ? 'EN' : 'ID'}</span>
      </button>
      <div className="absolute right-0 top-full mt-1 w-40 bg-background border border-border/50 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <button
          onClick={() => setLang('en')}
          className={`w-full text-left px-4 py-2.5 text-sm rounded-t-xl transition-colors ${lang === 'en' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-foreground hover:bg-muted/50'}`}
        >
          {t.language.en}
        </button>
        <button
          onClick={() => setLang('id')}
          className={`w-full text-left px-4 py-2.5 text-sm rounded-b-xl transition-colors ${lang === 'id' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-foreground hover:bg-muted/50'}`}
        >
          {t.language.id}
        </button>
      </div>
    </div>
  );
}
