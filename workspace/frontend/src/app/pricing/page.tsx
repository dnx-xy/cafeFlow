'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Coffee, Check, ArrowRight, HelpCircle } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { useI18n } from '@/i18n/context';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const { t } = useI18n();
  const d = t.pricing;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Ambient glow for modern look */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-rose-500 blur-[80px] rounded-full mix-blend-multiply dark:mix-blend-soft-light" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge className="mb-6 bg-background border-amber-500/30 text-amber-600 dark:text-amber-400" variant="outline">{d.hero.title}</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            {d.hero.title.split('Pricing')[0]}
            <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-medium">{d.hero.subtitle}</p>

          <div className="flex items-center justify-center space-x-4 bg-background/50 backdrop-blur-sm p-2 rounded-full border border-border/50 inline-flex mx-auto">
            <span className={`text-sm font-medium px-4 py-2 rounded-full cursor-pointer transition-colors ${!isAnnual ? 'bg-foreground text-background shadow-md' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setIsAnnual(false)}>{d.hero.monthly}</span>
            <span className={`text-sm font-medium px-4 py-2 rounded-full cursor-pointer transition-colors flex items-center gap-2 ${isAnnual ? 'bg-foreground text-background shadow-md' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setIsAnnual(true)}>
               {d.hero.annual}
               <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30 transition-colors border-0">{d.hero.save}</Badge>
            </span>
          </div>
        </div>
      </section>

      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {d.plans.map((plan, index) => {
              const popular = 'popular' in plan ? (plan as any).popular : false;
              return (
                <div key={index} className={`relative flex flex-col rounded-3xl p-8 transition-all ${popular ? 'bg-foreground text-background shadow-2xl scale-105 z-10' : 'bg-card border border-border/50 hover:border-amber-500/30'}`}>
                  {popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                        {d.hero.mostPopular}
                      </div>
                    </div>
                  )}
                  <div className="pb-4">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className={`text-sm ${popular ? 'text-muted' : 'text-muted-foreground'}`}>{plan.desc}</p>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-5xl font-extrabold tracking-tight">
                          {isAnnual && plan.annualPrice !== plan.price ? plan.annualPrice : plan.price}
                        </span>
                        {plan.period && <span className={`ml-2 text-sm font-medium ${popular ? 'text-muted' : 'text-muted-foreground'}`}>{plan.period}</span>}
                      </div>
                      {isAnnual && plan.annualTotal && plan.annualTotal !== plan.price && (
                        <p className={`text-sm mt-2 font-medium ${popular ? 'text-amber-400' : 'text-emerald-600'}`}>{plan.annualTotal} billed annually</p>
                      )}
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${popular ? 'text-amber-400' : 'text-emerald-500'}`} />
                          <span className={popular ? 'text-background/90' : 'text-foreground/80'}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {'suitableFor' in plan && (plan as any).suitableFor && (
                      <div className="mb-6 pt-6 border-t border-border/20">
                        <p className={`text-xs mb-3 font-semibold uppercase tracking-wider ${popular ? 'text-muted' : 'text-muted-foreground'}`}>{d.hero.suitableForLabel || 'Best for'}</p>
                        <div className="flex flex-wrap gap-2">
                          {((plan as any).suitableFor as string[]).map((s: string, k: number) => (
                            <span key={k} className={`text-xs px-2.5 py-1 rounded-md font-medium ${popular ? 'bg-background/10 text-background/90' : 'bg-muted text-muted-foreground'}`}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {'highlight' in plan && (plan as any).highlight && (
                      <div className={`mb-6 p-4 rounded-xl border ${popular ? 'bg-background/5 border-background/10' : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'}`}>
                        <p className={`text-sm italic leading-relaxed ${popular ? 'text-amber-200' : 'text-amber-800 dark:text-amber-200'}`}>{(plan as any).highlight}</p>
                      </div>
                    )}
                    <Link href={plan.price !== 'Custom' ? '/register' : '/contact'} className="w-full mt-auto">
                      <Button className={`w-full h-12 rounded-xl text-base font-semibold transition-all ${popular ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'bg-muted hover:bg-muted/80 text-foreground'}`} variant={popular ? 'default' : 'secondary'}>{plan.cta}</Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center mt-12 text-sm text-muted-foreground font-medium">{d.hero.trial}</p>
        </div>
      </section>

      <section className="py-32 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">{d.faq.title}</h2>
            <p className="text-lg text-muted-foreground">{d.faq.subtitle}</p>
          </div>
          <div className="space-y-6">
            {d.faq.items.map((faq, index) => (
              <div key={index} className="bg-background rounded-2xl p-8 shadow-sm border border-border/50 transition-all hover:shadow-md">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-3">{faq.q}</h3>
                      <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-rose-500/20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-background mb-6">{d.cta.title}</h2>
          <p className="text-xl text-background/80 mb-10">{d.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact"><Button size="lg" className="h-14 px-8 rounded-full text-base bg-background/10 text-background hover:bg-background/20 border-0 backdrop-blur-sm">{d.cta.contact}</Button></Link>
            <Link href="/demo"><Button size="lg" className="h-14 px-8 rounded-full text-base bg-background text-foreground hover:bg-background/90 shadow-xl">{d.cta.demo}<ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
