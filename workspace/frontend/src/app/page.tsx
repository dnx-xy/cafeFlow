'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  MessageCircle,
  Target,
  Zap,
  Shield,
  Clock,
  Sparkles,
  Palette,
  Globe,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Perfect for testing the waters',
    features: ['1 outlet', '3 staff accounts', '1 menu', '50 menu items', 'Basic analytics'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    desc: 'For growing cafes',
    features: ['3 outlets', '10 staff accounts', '3 menus', '200 menu items', 'Full analytics', 'Custom branding', 'Loyalty program'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/month',
    desc: 'For multi-location brands',
    features: ['10 outlets', '50 staff accounts', '10 menus', '1,000 menu items', 'Advanced analytics', 'Multi-language', 'Priority support', 'API access'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large-scale operations',
    features: ['Unlimited outlets', 'Unlimited staff', 'Unlimited menus', 'Unlimited items', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'Onboarding training'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  { q: 'How does the QR menu work?', a: 'Each table gets a unique QR code. Customers scan it with their phone camera to instantly view your full digital menu with photos, descriptions, and prices. No app download required.' },
  { q: 'Can I customize my digital menu?', a: 'Yes. Add categories, photos, descriptions, tags (Bestseller, New, Promo), and update availability in real-time. Changes reflect instantly on customer phones.' },
  { q: 'How does the loyalty program work?', a: 'Customers join by entering their name and WhatsApp number — no app install. They earn points with every purchase, unlock tier rewards, and receive updates via WhatsApp.' },
  { q: 'How do I get more Google Reviews?', a: 'After each order, customers are prompted to rate their experience. If they rate 4+ stars, they are directed to leave a Google Review. Lower ratings trigger a private feedback form so you can resolve issues.' },
  { q: 'Is there a free trial?', a: 'Yes. Start with a 14-day free trial of the Starter plan. No credit card required. Cancel anytime.' },
  { q: 'Can I use my own domain?', a: 'Yes, Pro and Enterprise plans support custom domains for your digital menu and ordering pages.' },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/demo', label: 'Demo' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
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
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link href="/register"><Button size="sm">Start Free</Button></Link>
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
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t space-y-2">
                <Link href="/login" className="block w-full"><Button variant="outline" className="w-full">Log in</Button></Link>
                <Link href="/register" className="block w-full"><Button className="w-full">Start Free</Button></Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ───── HERO ───── */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent)/0.06),_transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div className="text-center max-w-4xl mx-auto" initial="initial" animate="animate" variants={stagger}>
            <motion.div variants={fadeInUp}>
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-xs font-medium rounded-full">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block" />
                Now in Beta — Start Free
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
              Turn Every Table Into{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                Revenue
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Digital menu, customer loyalty, review generation, and customer insights in one simple platform.
              Transform QR scans into repeat customers.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-base px-8 h-12 shadow-lg shadow-amber-500/20">
                  Start Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-base px-8 h-12">
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            <motion.p variants={fadeInUp} className="mt-4 text-xs text-muted-foreground">
              No credit card required &middot; Free 14-day trial &middot; Cancel anytime
            </motion.p>

            {/* Hero Dashboard Preview */}
            <motion.div variants={scaleIn} className="mt-16 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/5 to-transparent z-10 pointer-events-none" />
                <div className="p-6 sm:p-8 bg-gradient-to-br from-muted/30 to-muted/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'QR Scans Today', value: '247', change: '+23%', icon: QrCode, color: 'bg-emerald-100 text-emerald-600' },
                      { label: 'Orders Today', value: '89', change: '+18%', icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
                      { label: 'Revenue Today', value: '$2,847', change: '+18%', icon: TrendingUp, color: 'bg-amber-100 text-amber-600' },
                      { label: 'Returning Customers', value: '42%', change: '+8%', icon: Users, color: 'bg-violet-100 text-violet-600' },
                    ].map((stat, i) => (
                      <Card key={i} className="bg-background/80 backdrop-blur-sm border-0 shadow-sm">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                              <stat.icon className="w-4.5 h-4.5" />
                            </div>
                          </div>
                          <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{stat.value}</div>
                          <div className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <TrendingUp className="w-3 h-3" />
                            {stat.change}
                            <span className="text-muted-foreground font-normal ml-0.5">vs yesterday</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {/* Mini chart bar */}
                  <div className="mt-4 h-8 flex items-end gap-1 px-1">
                    {[35, 55, 40, 70, 60, 80, 45, 65, 90, 75, 50, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-amber-500/40 to-amber-400/20 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───── PROBLEM ───── */}
      <section className="py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Common Cafe Challenges
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These pain points are holding your cafe back from reaching its full potential
            </motion.p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            {[
              { icon: Users, title: 'Customers never return', desc: 'No way to identify or re-engage visitors', color: 'text-rose-500', bg: 'bg-rose-50' },
              { icon: Smartphone, title: 'No customer database', desc: 'Missing valuable customer insights and data', color: 'text-orange-500', bg: 'bg-orange-50' },
              { icon: Star, title: 'Few Google reviews', desc: 'Struggling to build online reputation', color: 'text-amber-500', bg: 'bg-amber-50' },
              { icon: Coffee, title: 'Printed menus outdated', desc: 'Costly reprints every time prices change', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: BarChart3, title: 'No customer insights', desc: 'Operating blind without data-driven decisions', color: 'text-violet-500', bg: 'bg-violet-50' },
              { icon: Target, title: 'Low average order value', desc: 'Missing opportunities to upsell and cross-sell', color: 'text-teal-500', bg: 'bg-teal-50' },
            ].map((point, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 ${point.bg} rounded-xl flex items-center justify-center shrink-0`}>
                        <point.icon className={`w-5.5 h-5.5 ${point.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{point.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── SOLUTION FLOW ───── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              How CafeFlow Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete customer journey from scan to loyalty
            </motion.p>
          </motion.div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6" initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            {[
              { icon: QrCode, title: 'QR Scan', desc: 'Customer scans the table QR code', color: 'from-blue-500 to-blue-600' },
              { icon: Smartphone, title: 'Browse Menu', desc: 'View digital menu with photos', color: 'from-amber-500 to-amber-600' },
              { icon: ShoppingCart, title: 'Order', desc: 'Customize and place order', color: 'from-emerald-500 to-emerald-600' },
              { icon: Star, title: 'Review', desc: 'Rate & review their experience', color: 'from-violet-500 to-violet-600' },
              { icon: Award, title: 'Loyalty', desc: 'Earn points & come back', color: 'from-rose-500 to-rose-600' },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="relative">
                <Card className="text-center h-full border-0 shadow-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 sm:p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                      <step.icon className="w-8 h-8 text-white" />
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Everything You Need to Grow
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed specifically for cafes and coffee shops
            </motion.p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            {[
              { icon: Smartphone, title: 'Digital Menu', desc: 'Beautiful photo-rich menus with real-time availability updates. Categories, tags, and instant publishing.', color: 'bg-blue-100 text-blue-600' },
              { icon: QrCode, title: 'QR Per Table', desc: 'Unique QR codes for every table with detailed scan analytics. Know which tables are most active.', color: 'bg-amber-100 text-amber-600' },
              { icon: Users, title: 'Customer CRM', desc: 'Complete customer profiles with visit history, preferences, and lifetime value tracking.', color: 'bg-emerald-100 text-emerald-600' },
              { icon: Star, title: 'Review Booster', desc: 'Automated review generation. Happy customers go to Google, unhappy ones give private feedback.', color: 'bg-violet-100 text-violet-600' },
              { icon: Award, title: 'Loyalty Program', desc: 'Points, tiers, rewards, and gamified progress. No app download required for customers.', color: 'bg-rose-100 text-rose-600' },
              { icon: TrendingUp, title: 'Analytics & Insights', desc: 'Revenue trends, customer retention, peak hours, popular items, and scan-to-order conversion.', color: 'bg-indigo-100 text-indigo-600' },
              { icon: Zap, title: 'WhatsApp Integration', desc: 'Order notifications, loyalty updates, and marketing campaigns directly through WhatsApp.', color: 'bg-green-100 text-green-600' },
              { icon: Palette, title: 'Custom Branding', desc: 'Match your cafe identity with custom colors, logo, cover images, and domain.', color: 'bg-pink-100 text-pink-600' },
              { icon: Globe, title: 'Multi-Language', desc: 'Serve international customers with multi-language menu support (Pro plan and above).', color: 'bg-cyan-100 text-cyan-600' },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 h-full bg-card">
                  <CardContent className="p-6 sm:p-8">
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── SOCIAL PROOF ───── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Trusted by Cafe Owners
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground">
              Join hundreds of cafes already growing with CafeFlow
            </motion.p>
          </motion.div>

          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20" initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            {[
              { value: '50K+', label: 'QR Scans' },
              { value: '12K+', label: 'Orders Processed' },
              { value: '$2.4M', label: 'Revenue Generated' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            {[
              { name: 'Sarah Chen', role: 'Owner, Bean & Bloom Cafe', content: 'CafeFlow transformed our business. We went from 12 reviews to 127 in just 3 months, and repeat customers increased by 40%.', avatar: 'SC' },
              { name: 'Michael Torres', role: 'Manager, Roast & Co', content: 'The QR ordering system saved us so much time. Our staff can focus on creating amazing coffee instead of taking orders.', avatar: 'MT' },
              { name: 'Emily Watson', role: 'Owner, The Daily Grind', content: 'Finally, we know who our customers are. The CRM helped us build relationships we never knew we could have.', avatar: 'EW' },
            ].map((t, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-foreground mb-6 leading-relaxed text-sm">&ldquo;{t.content}&rdquo;</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {t.avatar}
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold text-foreground text-sm">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section id="pricing" className="py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade as you grow. No hidden fees.
            </motion.p>
          </motion.div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            {plans.map((plan, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className={`border-0 shadow-sm h-full flex flex-col ${plan.popular ? 'ring-2 ring-amber-500 relative' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 text-xs font-medium">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className={`pb-4 ${plan.popular ? 'pt-8' : 'pt-6'}`}>
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
                    <Link href={plan.name === 'Enterprise' ? '/contact' : '/register'} className="mt-8 block">
                      <Button
                        className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.p className="text-center mt-8 text-sm text-muted-foreground" variants={fadeInUp}>
            All plans include a 14-day free trial. No credit card required.
          </motion.p>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground">
              Everything you need to know about CafeFlow
            </motion.p>
          </motion.div>

          <motion.div className="space-y-3" initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="border border-border/50 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-medium text-foreground text-sm pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`px-5 transition-all duration-200 overflow-hidden ${openFaq === i ? 'pb-5 max-h-96' : 'max-h-0'}`}>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-24 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_white/0.1,_transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to Transform Your Cafe?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of cafes using CafeFlow to grow their customer base, increase revenue, and build lasting relationships.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-base px-8 h-12 bg-white text-amber-700 hover:bg-white/90 shadow-xl">
                  Start Free Today
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-base px-8 h-12 border-white/30 text-white hover:bg-white/10">
                  Watch Demo
                </Button>
              </Link>
            </motion.div>
            <motion.p variants={fadeInUp} className="mt-6 text-white/60 text-sm">
              No credit card required &middot; Free 14-day trial &middot; Cancel anytime
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
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
              <p className="text-sm text-muted-foreground leading-relaxed">
                Customer Growth Platform for Cafes
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-sm mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li><Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Demo</Link></li>
                <li><Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-sm mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-sm mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API</Link></li>
                <li><Link href="/status" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Status</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CafeFlow. All rights reserved.
            </p>
            <div className="flex gap-5">
              {['Twitter', 'GitHub', 'LinkedIn'].map((s) => (
                <Link key={s} href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{s}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
