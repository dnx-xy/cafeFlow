'use client';

import { useState } from 'react';
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
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/demo', label: 'Demo' },
    { href: '/blog', label: 'Blog' },
  ];

  const problemPoints = [
    { icon: Users, title: 'Customers never return', desc: 'No way to identify or re-engage visitors' },
    { icon: Smartphone, title: 'No customer database', desc: 'Missing valuable customer insights and data' },
    { icon: Star, title: 'Few Google reviews', desc: 'Struggling to build online reputation' },
    { icon: Coffee, title: 'Printed menus outdated', desc: 'Costly reprints every time prices change' },
    { icon: BarChart3, title: 'No customer behavior insights', desc: 'Operating blind without data-driven decisions' },
  ];

  const features = [
    { 
      icon: Smartphone, 
      title: 'Digital Menu', 
      desc: 'Beautiful, photo-rich menus with real-time availability updates',
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      icon: QrCode, 
      title: 'QR Per Table', 
      desc: 'Unique QR codes with table-level analytics and insights',
      color: 'bg-amber-100 text-amber-600'
    },
    { 
      icon: Users, 
      title: 'Customer CRM', 
      desc: 'Complete customer profiles with visit history and preferences',
      color: 'bg-green-100 text-green-600'
    },
    { 
      icon: Star, 
      title: 'Review Booster', 
      desc: 'Automated review generation and reputation management',
      color: 'bg-purple-100 text-purple-600'
    },
    { 
      icon: Award, 
      title: 'Loyalty Program', 
      desc: 'Points, rewards, and gamified customer retention',
      color: 'bg-rose-100 text-rose-600'
    },
    { 
      icon: TrendingUp, 
      title: 'Analytics', 
      desc: 'Revenue trends, customer insights, and business intelligence',
      color: 'bg-indigo-100 text-indigo-600'
    },
  ];

  const testimonials = [
    { 
      name: 'Sarah Chen', 
      role: 'Owner, Bean & Bloom Cafe',
      content: 'CafeFlow transformed our business. We went from 12 reviews to 127 in just 3 months, and repeat customers increased by 40%.',
      avatar: 'SC'
    },
    { 
      name: 'Michael Torres', 
      role: 'Manager, Roast & Co',
      content: 'The QR ordering system saved us so much time. Our staff can focus on creating amazing coffee instead of taking orders.',
      avatar: 'MT'
    },
    { 
      name: 'Emily Watson', 
      role: 'Owner, The Daily Grind',
      content: 'Finally, we know who our customers are. The CRM helped us build relationships we never knew we could have.',
      avatar: 'EW'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">CafeFlow</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Start Free</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t space-y-2">
                <Link href="/login" className="block w-full">
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/register" className="block w-full">
                  <Button className="w-full">Start Free</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6" variant="secondary">
                Now in Beta - Start Free
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6"
            >
              Turn Every Table Into{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Revenue
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Digital menu, customer loyalty, review generation, and customer insights in one simple platform. 
              Transform QR scans into repeat customers.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            {/* Hero Visual - Dashboard Preview */}
            <motion.div 
              variants={fadeInUp}
              className="mt-16 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border bg-card">
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-10" />
                <div className="p-8 bg-gradient-to-br from-muted/50 to-muted">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-background/80 backdrop-blur">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">QR Scans Today</p>
                            <p className="text-3xl font-bold text-foreground">247</p>
                          </div>
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <QrCode className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span>+23%</span>
                          <span className="text-muted-foreground ml-1">vs yesterday</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-background/80 backdrop-blur">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Revenue Today</p>
                            <p className="text-3xl font-bold text-foreground">$2,847</p>
                          </div>
                          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-amber-600" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span>+18%</span>
                          <span className="text-muted-foreground ml-1">vs yesterday</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-background/80 backdrop-blur">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Returning Customers</p>
                            <p className="text-3xl font-bold text-foreground">42%</p>
                          </div>
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span>+8%</span>
                          <span className="text-muted-foreground ml-1">vs last week</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Common Cafe Challenges
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These pain points are holding your cafe back from reaching its full potential
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemPoints.map((point, index) => (
              <Card key={index} className="border-l-4 border-l-red-400 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <point.icon className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{point.title}</h3>
                      <p className="text-sm text-muted-foreground">{point.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Flow Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How CafeFlow Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete customer journey from scan to loyalty
            </p>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[
                { icon: QrCode, title: 'QR Scan', desc: 'Customer scans table QR' },
                { icon: Smartphone, title: 'Order', desc: 'Browse and order digitally' },
                { icon: Star, title: 'Review', desc: 'Rate their experience' },
                { icon: Award, title: 'Loyalty', desc: 'Earn points & rewards' },
                { icon: Users, title: 'Return', desc: 'Come back for more' },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <Card className="text-center h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </CardContent>
                  </Card>
                  {index < 4 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed specifically for cafes and coffee shops
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Loved by Cafe Owners
            </h2>
            <p className="text-lg text-muted-foreground">
              Join hundreds of cafes already growing with CafeFlow
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { value: '50K+', label: 'QR Scans' },
              { value: '12K+', label: 'Orders Processed' },
              { value: '$2.4M', label: 'Revenue Generated' },
              { value: '300+', label: 'Happy Cafes' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Cafe?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join hundreds of cafes using CafeFlow to grow their customer base, increase revenue, and build lasting relationships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 bg-white text-amber-600 hover:bg-white/90">
                Start Free Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-white/70 text-sm">
            No credit card required • Free 14-day trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">CafeFlow</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                Customer Growth Platform for Cafes
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link href="/demo" className="text-muted-foreground hover:text-foreground">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 CafeFlow. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
