'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  QrCode, Users, Star, TrendingUp, Coffee, Smartphone,
  ArrowRight, Check, Zap, Globe, Sparkles, LayoutDashboard, Search
} from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { FaqAccordion } from '@/components/landing/FaqAccordion';
import { useI18n } from '@/i18n/context';

export default function LandingPage() {
  const d = useI18n().t.home;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-amber-500/30">
      <Navbar />

      {/* ───── HERO ───── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Modern ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-soft-light" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              <Badge variant="outline" className="mb-8 px-4 py-2 text-sm font-medium rounded-full bg-background/50 backdrop-blur-md border-amber-500/20 text-amber-700 dark:text-amber-400">
                <Sparkles className="w-4 h-4 mr-2 inline-block text-amber-500" />
                {d.hero.badge}
              </Badge>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-foreground mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 ease-out">
              {d.hero.title}{' '}
              <span className="block mt-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent pb-2">
                {d.hero.titleHighlight}
              </span>
            </h1>

            <p className="text-lg sm:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 ease-out">
              {d.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 ease-out">
              <Link href="/register">
                <Button size="lg" className="text-base px-8 h-14 rounded-full shadow-xl shadow-amber-500/20 hover:scale-105 transition-transform bg-foreground text-background hover:bg-foreground/90">
                  {d.hero.startFree}
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-base px-8 h-14 rounded-full bg-background/50 backdrop-blur-md hover:bg-muted">
                  {d.hero.watchDemo}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground font-medium animate-in fade-in duration-700 delay-500">
              {d.hero.noCard}
            </p>
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-500">
           <div className="rounded-2xl border border-border/50 bg-background/40 backdrop-blur-xl shadow-2xl p-2 sm:p-4 relative">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 rounded-2xl pointer-events-none" />
             <div className="rounded-xl overflow-hidden border border-border bg-card shadow-inner">
               {/* Mockup Header */}
               <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 gap-2">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                   <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                   <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                 </div>
                 <div className="ml-4 w-64 h-6 rounded-md bg-background border border-border/50 flex items-center px-2">
                    <Search className="w-3 h-3 text-muted-foreground" />
                 </div>
               </div>
               {/* Mockup Body */}
               <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                 <div className="md:col-span-3 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { l: d.hero.stats.orders, v: '124', c: '+12%' },
                        { l: d.hero.stats.revenue, v: '$3,240', c: '+24%' },
                        { l: d.hero.stats.returning, v: '48%', c: '+5%' }
                      ].map((s, i) => (
                        <div key={i} className="p-4 rounded-lg border border-border bg-background">
                          <div className="text-sm text-muted-foreground mb-2">{s.l}</div>
                          <div className="text-2xl font-bold">{s.v}</div>
                          <div className="text-xs text-emerald-500 font-medium mt-1">{s.c} {d.hero.stats.vsYesterday}</div>
                        </div>
                      ))}
                    </div>
                    <div className="h-48 rounded-lg border border-border bg-background flex items-end p-4 gap-2">
                      {[40, 60, 45, 80, 55, 90, 75, 100, 85, 65].map((h, i) => (
                        <div key={i} className="flex-1 bg-amber-500/20 hover:bg-amber-500/40 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                             ${h * 10}
                           </div>
                        </div>
                      ))}
                    </div>
                 </div>
                 <div className="space-y-4">
                   <div className="p-4 rounded-lg border border-border bg-background h-full">
                     <div className="text-sm font-semibold mb-4">Live Activity</div>
                     <div className="space-y-4">
                       {[1, 2, 3, 4].map((_, i) => (
                         <div key={i} className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                             <Coffee className="w-4 h-4 text-muted-foreground" />
                           </div>
                           <div className="flex-1">
                             <div className="w-3/4 h-3 rounded bg-muted mb-1.5" />
                             <div className="w-1/2 h-2 rounded bg-muted/60" />
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* ───── LOGOS / SOCIAL PROOF ───── */}
      <section className="py-12 border-y border-border/50 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-8">{d.social.subtitle}</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Simulated Logos */}
             <div className="flex items-center gap-2 text-xl font-bold"><Coffee className="w-6 h-6"/> Bean & Bloom</div>
             <div className="flex items-center gap-2 text-xl font-bold font-serif italic">The Daily Grind</div>
             <div className="flex items-center gap-2 text-xl font-black tracking-tighter">ROAST<span className="text-amber-500">CO</span></div>
             <div className="flex items-center gap-2 text-xl font-medium tracking-widest uppercase">Artisan</div>
             <div className="flex items-center gap-2 text-xl font-bold"><Zap className="w-6 h-6"/> QuickBite</div>
          </div>
        </div>
      </section>

      {/* ───── BENTO FEATURES ───── */}
      <section className="py-32 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">{d.features.title}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{d.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Bento Item 1: Large */}
            <div className="md:col-span-2 group rounded-3xl p-8 bg-gradient-to-br from-muted/50 to-muted border border-border/50 relative overflow-hidden transition-all hover:border-amber-500/30">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                <QrCode className="w-32 h-32" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end min-h-[300px]">
                <div className="w-12 h-12 bg-foreground text-background rounded-xl flex items-center justify-center mb-6">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{d.features.items[0].title}</h3>
                <p className="text-muted-foreground text-lg max-w-md">{d.features.items[0].desc}</p>
              </div>
            </div>

            {/* Bento Item 2 */}
            <div className="group rounded-3xl p-8 bg-card border border-border/50 transition-all hover:border-amber-500/30">
               <div className="w-12 h-12 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-xl flex items-center justify-center mb-6">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{d.features.items[1].title}</h3>
                <p className="text-muted-foreground">{d.features.items[1].desc}</p>
            </div>

            {/* Bento Item 3 */}
            <div className="group rounded-3xl p-8 bg-card border border-border/50 transition-all hover:border-amber-500/30">
               <div className="w-12 h-12 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{d.features.items[2].title}</h3>
                <p className="text-muted-foreground">{d.features.items[2].desc}</p>
            </div>

            {/* Bento Item 4: Large */}
            <div className="md:col-span-2 group rounded-3xl p-8 bg-gradient-to-br from-amber-500/5 to-orange-500/10 border border-border/50 transition-all hover:border-amber-500/50">
               <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center mb-6">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{d.features.items[3].title}</h3>
                <p className="text-muted-foreground text-lg max-w-md">{d.features.items[3].desc}</p>
            </div>
            
            {/* Bento Item 5 & 6 */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
               <div className="rounded-3xl p-8 bg-card border border-border/50 flex items-start gap-6">
                 <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold mb-2">{d.features.items[5].title}</h3>
                    <p className="text-muted-foreground">{d.features.items[5].desc}</p>
                 </div>
               </div>
               <div className="rounded-3xl p-8 bg-card border border-border/50 flex items-start gap-6">
                 <div className="w-12 h-12 bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 rounded-xl flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold mb-2">{d.features.items[8].title}</h3>
                    <p className="text-muted-foreground">{d.features.items[8].desc}</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS (Timeline/Flow) ───── */}
      <section className="py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-16 tracking-tight">{d.howItWorks.title}</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center relative max-w-5xl mx-auto">
             {/* Connection Line */}
             <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />
             
             {d.howItWorks.steps.map((step, i) => (
               <div key={i} className="relative z-10 flex flex-col items-center group mb-12 md:mb-0">
                 <div className="w-16 h-16 rounded-2xl bg-background border-2 border-border shadow-sm flex items-center justify-center mb-4 group-hover:border-amber-500 transition-colors group-hover:scale-110 duration-300">
                    <span className="text-xl font-bold text-muted-foreground group-hover:text-amber-500 transition-colors">{i + 1}</span>
                 </div>
                 <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                 <p className="text-sm text-muted-foreground text-center max-w-[150px]">{step.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section id="pricing" className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">{d.pricing.title}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{d.pricing.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {d.pricing.plans.map((plan, i) => {
              const popular = plan.name === 'Growth';
              return (
                <div key={i} className={`relative flex flex-col rounded-3xl p-8 ${popular ? 'bg-foreground text-background shadow-2xl scale-105 z-10' : 'bg-card border border-border/50'}`}>
                  {popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                        {d.pricing.mostPopular}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <p className={`text-sm ${popular ? 'text-muted' : 'text-muted-foreground'}`}>{plan.desc}</p>
                  </div>
                  
                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    {plan.period && <span className={`text-sm font-medium ${popular ? 'text-muted' : 'text-muted-foreground'}`}>{plan.period}</span>}
                  </div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 shrink-0 ${popular ? 'text-amber-400' : 'text-emerald-500'}`} />
                        <span className={`text-sm ${popular ? 'text-background/90' : 'text-foreground/80'}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/register" className="mt-auto">
                    <Button 
                      className={`w-full h-12 rounded-xl text-base font-semibold transition-all ${
                        popular 
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20' 
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <FaqAccordion items={d.faq.items} title={d.faq.title} subtitle={d.faq.subtitle} />

      {/* ───── CTA ───── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-rose-500/20" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-6xl font-extrabold text-background mb-8 tracking-tight">{d.cta.title}</h2>
          <p className="text-xl text-background/80 mb-12 max-w-2xl mx-auto leading-relaxed">{d.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-base px-10 h-14 rounded-full bg-background text-foreground hover:bg-background/90 shadow-2xl hover:scale-105 transition-all">
                {d.cta.startFree}
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-background/50 text-sm font-medium tracking-wide">{d.cta.noCard}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
