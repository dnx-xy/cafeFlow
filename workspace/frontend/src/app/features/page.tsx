'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Users, 
  Star, 
  TrendingUp, 
  Coffee,
  Smartphone,
  Award,
  BarChart3,
  ArrowRight,
  Check,
  Sparkles,
  MessageSquare,
  Zap,
  Gift,
  Clock,
  Shield
} from 'lucide-react';

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Smartphone,
      title: 'Digital Menu',
      description: 'Beautiful, photo-rich digital menus that update in real-time. No more reprinting when prices change.',
      benefits: [
        'Unlimited menu items with photos',
        'Real-time availability updates',
        'Category organization',
        'Mobile-optimized design',
        'Multi-language support'
      ],
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: QrCode,
      title: 'QR Per Table',
      description: 'Unique QR codes for each table with detailed analytics and table-level insights.',
      benefits: [
        'Unique QR for every table',
        'Table-level analytics',
        'Scan tracking',
        'Custom QR designs',
        'Print-ready templates'
      ],
      color: 'bg-amber-100 text-amber-600'
    },
    {
      icon: Users,
      title: 'Customer CRM',
      description: 'Complete customer profiles with visit history, preferences, and lifetime value tracking.',
      benefits: [
        'Customer profiles',
        'Visit history',
        'Contact information',
        'Order preferences',
        'Customer segmentation'
      ],
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Star,
      title: 'Review Booster',
      description: 'Automatically generate more Google reviews and manage your online reputation.',
      benefits: [
        'Automated review requests',
        'Smart filtering (4+ stars)',
        'Private feedback collection',
        'Review analytics',
        'Response templates'
      ],
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Award,
      title: 'Loyalty Program',
      description: 'Points-based rewards system to increase customer retention and repeat visits.',
      benefits: [
        'Points per purchase',
        'Reward tiers',
        'Custom rewards',
        'Progress tracking',
        'Gamified experience'
      ],
      color: 'bg-rose-100 text-rose-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into revenue, customers, and business performance.',
      benefits: [
        'Revenue tracking',
        'Customer insights',
        'Popular items',
        'Peak hours analysis',
        'Cohort analysis'
      ],
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  const additionalFeatures = [
    {
      icon: MessageSquare,
      title: 'WhatsApp Integration',
      description: 'Send order confirmations and promotions via WhatsApp'
    },
    {
      icon: Zap,
      title: 'Instant Updates',
      description: 'Real-time menu and availability changes'
    },
    {
      icon: Gift,
      title: 'Promotions',
      description: 'Create special offers and discount campaigns'
    },
    {
      icon: Clock,
      title: 'Order Management',
      description: 'Streamlined order processing and tracking'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security for your data'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Insights',
      description: 'Smart recommendations for your business'
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
          <Badge className="mb-6" variant="secondary">Features</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Grow Your Cafe
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful tools designed specifically for cafes. From QR menus to loyalty programs, 
            we've got everything you need to turn customers into regulars.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {mainFeatures.map((feature, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">{feature.title}</h2>
                  <p className="text-lg text-muted-foreground mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-foreground">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <Card className="border-0 shadow-xl">
                    <CardContent className="p-8">
                      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                        <div className={`w-24 h-24 ${feature.color} rounded-2xl flex items-center justify-center`}>
                          <feature.icon className="w-12 h-12" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">And Much More</h2>
            <p className="text-lg text-muted-foreground">Additional features to supercharge your cafe</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Cafe?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start your free trial today. No credit card required.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 bg-white text-amber-600 hover:bg-white/90">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
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
