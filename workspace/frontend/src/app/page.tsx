import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  QrCode, Users, Star, TrendingUp, Coffee, Smartphone, Award,
  BarChart3, ArrowRight, Check, ShoppingCart, MessageCircle, Target,
  Zap, Palette, Globe, Sparkles,
} from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { FaqAccordion } from '@/components/landing/FaqAccordion';
import en from '@/i18n/en';

const d = en.home;

const problemIcons = [Users, Smartphone, Star, Coffee, BarChart3, Target];
const problemColors = ['text-rose-500', 'text-orange-500', 'text-amber-500', 'text-blue-500', 'text-violet-500', 'text-teal-500'];
const problemBg = ['bg-rose-50', 'bg-orange-50', 'bg-amber-50', 'bg-blue-50', 'bg-violet-50', 'bg-teal-50'];

const flowIcons = [QrCode, Smartphone, ShoppingCart, Star, Award];
const flowColors = ['from-blue-500 to-blue-600', 'from-amber-500 to-amber-600', 'from-emerald-500 to-emerald-600', 'from-violet-500 to-violet-600', 'from-rose-500 to-rose-600'];

const featureIcons = [Smartphone, QrCode, Users, Star, Award, TrendingUp, Zap, Palette, Globe];
const featureColors = [
  'bg-blue-100 text-blue-600', 'bg-amber-100 text-amber-600', 'bg-emerald-100 text-emerald-600',
  'bg-violet-100 text-violet-600', 'bg-rose-100 text-rose-600', 'bg-indigo-100 text-indigo-600',
  'bg-green-100 text-green-600', 'bg-pink-100 text-pink-600', 'bg-cyan-100 text-cyan-600',
];

const statsIcons = [QrCode, ShoppingCart, TrendingUp, Users];
const statsColors = ['bg-emerald-100 text-emerald-600', 'bg-blue-100 text-blue-600', 'bg-amber-100 text-amber-600', 'bg-violet-100 text-violet-600'];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ───── HERO ───── */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent)/0.06),_transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div>
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-xs font-medium rounded-full">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block" />
                {d.hero.badge}
              </Badge>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
              {d.hero.title}{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                {d.hero.titleHighlight}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {d.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-base px-8 h-12 shadow-lg shadow-amber-500/20">
                  {d.hero.startFree}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-base px-8 h-12">
                  {d.hero.watchDemo}
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              {d.hero.noCard}
            </p>

            <div className="mt-16 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/5 to-transparent z-10 pointer-events-none" />
                <div className="p-6 sm:p-8 bg-gradient-to-br from-muted/30 to-muted/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: d.hero.stats.scans, value: '247', change: '+23%' },
                      { label: d.hero.stats.orders, value: '89', change: '+18%' },
                      { label: d.hero.stats.revenue, value: '$2,847', change: '+18%' },
                      { label: d.hero.stats.returning, value: '42%', change: '+8%' },
                    ].map((stat, i) => (
                      <Card key={i} className="bg-background/80 backdrop-blur-sm border-0 shadow-sm">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${statsColors[i]}`}>
                              {(() => { const Icon = statsIcons[i]; return <Icon className="w-4.5 h-4.5" />; })()}
                            </div>
                          </div>
                          <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{stat.value}</div>
                          <div className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <TrendingUp className="w-3 h-3" />
                            {stat.change}
                            <span className="text-muted-foreground font-normal ml-0.5">{d.hero.stats.vsYesterday}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-4 h-8 flex items-end gap-1 px-1">
                    {[35, 55, 40, 70, 60, 80, 45, 65, 90, 75, 50, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-amber-500/40 to-amber-400/20 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── PROBLEM ───── */}
      <section className="py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">{d.problem.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{d.problem.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {d.problem.points.map((point, i) => {
              const Icon = problemIcons[i];
              return (
                <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow h-full bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 ${problemBg[i]} rounded-xl flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5.5 h-5.5 ${problemColors[i]}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{point.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── SOLUTION FLOW ───── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">{d.howItWorks.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{d.howItWorks.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {d.howItWorks.steps.map((step, i) => {
              const Icon = flowIcons[i];
              return (
                <div key={i} className="relative">
                  <Card className="text-center h-full border-0 shadow-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 sm:p-8">
                      <div className={`w-16 h-16 bg-gradient-to-br ${flowColors[i]} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </CardContent>
                  </Card>
                  {i < 4 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 text-muted-foreground/40 z-10">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">{d.features.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{d.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {d.features.items.map((feature, i) => {
              const Icon = featureIcons[i];
              return (
                <Card key={i} className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 h-full bg-card">
                  <CardContent className="p-6 sm:p-8">
                    <div className={`w-12 h-12 ${featureColors[i]} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── SOCIAL PROOF ───── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">{d.social.title}</h2>
            <p className="text-lg text-muted-foreground">{d.social.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {[
              { value: '50K+', label: d.social.stats.scans },
              { value: '12K+', label: d.social.stats.orders },
              { value: '$2.4M', label: d.social.stats.revenue },
              { value: '98%', label: d.social.stats.satisfaction },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2 tracking-tight">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {d.social.testimonials.map((t, i) => (
              <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed text-sm">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">{t.name.split(' ').map((n: string) => n[0]).join('')}</div>
                    <div className="ml-3">
                      <div className="font-semibold text-foreground text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section id="pricing" className="py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">{d.pricing.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{d.pricing.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {d.pricing.plans.map((plan, i) => {
              const popular = plan.name === 'Growth';
              const isEnterprise = plan.name === 'Enterprise';
              return (
                <Card key={i} className={`border-0 shadow-sm h-full flex flex-col ${popular ? 'ring-2 ring-amber-500 relative' : ''}`}>
                  {popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 text-xs font-medium">
                        {d.pricing.mostPopular}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className={`pb-4 ${popular ? 'pt-8' : 'pt-6'}`}>
                    <CardTitle className="text-lg font-semibold">{plan.name}</CardTitle>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground tracking-tight">{plan.price}</span>
                      {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                    </div>
                    <CardDescription className="mt-2 text-sm">{plan.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 flex-1">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm">
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>
                    {'suitableFor' in plan && (plan as any).suitableFor && (
                      <div className="mt-6 pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-2 font-medium">{d.pricing.suitableForLabel || 'Best for'}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {((plan as any).suitableFor as string[]).map((s: string, k: number) => (
                            <span key={k} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {'highlight' in plan && (plan as any).highlight && (
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <p className="text-xs text-amber-800 dark:text-amber-200 italic">{(plan as any).highlight}</p>
                      </div>
                    )}
                    <Link href={isEnterprise ? '/contact' : '/register'} className="mt-8 block">
                      <Button className={`w-full ${popular ? '' : 'variant-outline'}`} variant={popular ? 'default' : 'outline'}>
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="text-center mt-8 text-sm text-muted-foreground">{d.pricing.trial}</p>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <FaqAccordion items={d.faq.items} title={d.faq.title} subtitle={d.faq.subtitle} />

      {/* ───── CTA ───── */}
      <section className="py-24 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_white/0.1,_transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">{d.cta.title}</h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">{d.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-base px-8 h-12 bg-white text-amber-700 hover:bg-white/90 shadow-xl">
                {d.cta.startFree}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-base px-8 h-12 border-white/30 text-white hover:bg-white/10">
                {d.cta.watchDemo}
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-white/60 text-sm">{d.cta.noCard}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
