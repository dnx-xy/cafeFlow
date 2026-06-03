'use client';

import Link from 'next/link';
import { Coffee } from 'lucide-react';
import { useI18n } from '@/i18n/context';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-foreground/[0.02] border-t border-border/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">CafeFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.footer.description}</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">{t.footer.product}</h4>
            <ul className="space-y-2.5">
              <li><Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.features}</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.pricing}</Link></li>
              <li><Link href="/demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.demo}</Link></li>
              <li><Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.signUp}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">{t.footer.company}</h4>
            <ul className="space-y-2.5">
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.blog}</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.about}</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">{t.footer.resources}</h4>
            <ul className="space-y-2.5">
              <li><Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.documentation}</Link></li>
              <li><Link href="/api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.api}</Link></li>
              <li><Link href="/status" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.status}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">{t.footer.legal}</h4>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.privacy}</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.terms}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CafeFlow. {t.footer.rights}
          </p>
          <div className="flex gap-5">
            {['Twitter', 'GitHub', 'LinkedIn'].map((s) => (
              <Link key={s} href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{s}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
