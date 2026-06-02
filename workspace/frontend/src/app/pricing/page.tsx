'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Coffee,
  Check,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for trying out CafeFlow',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        '1 outlet',
        'Up to 50 menu items',
        'Basic QR codes',
        'Customer database',
        'Email support',
        'CafeFlow branding'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Starter',
      description: 'For small cafes getting started',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        'Up to 2 outlets',
        'Unlimited menu items',
        'Custom QR codes',
        'Customer CRM',
        'Review generation',
        'Basic loyalty program',
        'Email & chat support',
        'Remove CafeFlow branding'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Pro',
      description: 'For growing cafes',
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        'Up to 5 outlets',
        'Everything in Starter',
        'Advanced loyalty program',
        'Marketing campaigns',
        'WhatsApp integration',
        'Priority support',
        'Custom domain',
        'API access'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Enterprise',
      description: 'For cafe chains',
      monthlyPrice: null,
      annualPrice: null,
      features: [
        'Unlimited outlets',
        'Everything in Pro',
        'Dedicated account manager',
        'Custom integrations',
        'White-label option',
        'SLA guarantee',
        'Onboarding training',
        '24/7 phone support'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.'
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes, you save 2 months when you pay annually (17% discount).'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">CafeFlow</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Start Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6" variant="secondary">Pricing</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Simple, Transparent{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch 
              checked={isAnnual} 
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge variant="secondary" className="text-xs">
                Save 17%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative flex flex-col ${plan.popular ? 'border-2 border-amber-500 shadow-xl' : 'border shadow-md'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-amber-500 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-6">
                    {plan.monthlyPrice !== null ? (
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-foreground">
                          ${isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice}
                        </span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-foreground">Custom</div>
                    )}
                    {isAnnual && plan.annualPrice > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        ${plan.annualPrice} billed annually
                      </p>
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
                  
                  <Link href={plan.monthlyPrice !== null ? '/register' : '/contact'} className="w-full">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about pricing</p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <HelpCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our team is here to help you find the perfect plan for your cafe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg">
                Schedule Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">CafeFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © 2024 CafeFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
