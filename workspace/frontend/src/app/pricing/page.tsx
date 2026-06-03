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

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6" variant="secondary">Pricing</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            {d.hero.title.split('Pricing')[0]}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">{d.hero.subtitle}</p>

          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>{d.hero.monthly}</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>{d.hero.annual}</span>
            {isAnnual && <Badge variant="secondary" className="text-xs">{d.hero.save}</Badge>}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {d.plans.map((plan, index) => {
              const popular = 'popular' in plan ? (plan as any).popular : false;
              const currencySymbol = plan.price.match(/^[^\d]*/)?.[0] || '';
              return (
                <Card key={index} className={`relative flex flex-col ${popular ? 'border-2 border-amber-500 shadow-xl' : 'border shadow-md'}`}>
                  {popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-amber-500 text-white">{d.hero.mostPopular}</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.desc}</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-foreground">
                          {isAnnual && plan.annualPrice !== plan.price ? plan.annualPrice : plan.price}
                        </span>
                        {plan.period && <span className="text-muted-foreground ml-2">{plan.period}</span>}
                      </div>
                      {isAnnual && plan.annualTotal && plan.annualTotal !== plan.price && (
                        <p className="text-sm text-muted-foreground mt-1">{plan.annualTotal} billed annually</p>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {'suitableFor' in plan && (plan as any).suitableFor && (
                      <div className="mb-6 pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-2 font-medium">{d.hero.suitableForLabel || 'Best for'}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {((plan as any).suitableFor as string[]).map((s: string, k: number) => (
                            <span key={k} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {'highlight' in plan && (plan as any).highlight && (
                      <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <p className="text-xs text-amber-800 dark:text-amber-200 italic">{(plan as any).highlight}</p>
                      </div>
                    )}
                    <Link href={plan.price !== 'Custom' ? '/register' : '/contact'} className="w-full mt-auto">
                      <Button className="w-full" variant={popular ? 'default' : 'outline'}>{plan.cta}</Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{d.faq.title}</h2>
            <p className="text-muted-foreground">{d.faq.subtitle}</p>
          </div>
          <div className="space-y-6">
            {d.faq.items.map((faq, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <HelpCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">{d.cta.title}</h2>
          <p className="text-lg text-muted-foreground mb-8">{d.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact"><Button size="lg" variant="outline">{d.cta.contact}</Button></Link>
            <Link href="/demo"><Button size="lg">{d.cta.demo}<ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
