'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Coffee, Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from '@/i18n/context';

const navLinks = [
  { href: '/features', key: 'features' as const },
  { href: '/pricing', key: 'pricing' as const },
  { href: '/demo', key: 'demo' as const },
  { href: '/blog', key: 'blog' as const },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useI18n();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">CafeFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {t.nav[link.key]}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <Link href="/login"><Button variant="ghost" size="sm">{t.nav.logIn}</Button></Link>
            <Link href="/register"><Button size="sm">{t.nav.startFree}</Button></Link>
          </div>

          <button className="md:hidden p-2 -mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>
                {t.nav[link.key]}
              </Link>
            ))}
            <div className="pt-3 border-t space-y-2">
              <div className="flex justify-center pb-2">
                <LanguageSwitcher />
              </div>
              <Link href="/login" className="block w-full"><Button variant="outline" className="w-full">{t.nav.logIn}</Button></Link>
              <Link href="/register" className="block w-full"><Button className="w-full">{t.nav.startFree}</Button></Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
