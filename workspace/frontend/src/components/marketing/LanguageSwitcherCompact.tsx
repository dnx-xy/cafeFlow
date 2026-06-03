'use client';

import { useI18n } from '@/i18n/context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcherCompact() {
  const { lang, setLang } = useI18n();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
      title={lang === 'en' ? 'Switch to Bahasa Indonesia' : 'Switch to English'}
    >
      <Globe className="w-4 h-4" />
      <span className="text-[10px] ml-0.5 font-medium">{lang === 'en' ? 'EN' : 'ID'}</span>
    </Button>
  );
}