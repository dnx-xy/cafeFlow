'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Coffee,
  Menu,
  X,
  ArrowRight,
  Check,
  Calendar,
  Clock,
  Mail,
  Phone,
  Store,
  User,
  MessageSquare
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

export default function DemoPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cafeName: '',
    phone: '',
    message: ''
  });

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/demo', label: 'Demo' },
    { href: '/blog', label: 'Blog' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Same as landing page */}
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
                  className={`text-sm font-medium transition-colors ${
                    link.href === '/demo' 
                      ? 'text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
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
      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700 mb-6">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule a Demo
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6"
            >
              See CafeFlow in{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Action
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-muted-foreground mb-4"
            >
              Get a personalized walkthrough of how CafeFlow can help your cafe grow. 
              Our team will show you how to turn QR scans into loyal customers.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Demo Request Form Section */}
      <section className="py-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left side - Info */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    What to expect
                  </h3>
                  <ul className="space-y-4">
                    {[
                      { icon: Clock, text: '30-minute personalized demo' },
                      { icon: User, text: 'One-on-one with our team' },
                      { icon: Store, text: 'Tailored to your cafe\'s needs' },
                      { icon: Check, text: 'No commitment required' },
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                          <item.icon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-muted-foreground">{item.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-8 border-t border-amber-200 dark:border-amber-800/50">
                    <p className="text-sm text-muted-foreground mb-4">
                      Preferred times available:
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2 text-amber-500" />
                        Monday - Friday: 9AM - 6PM
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2 text-amber-500" />
                        Saturday: 10AM - 4PM
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right side - Form */}
            <motion.div 
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                          Request a Demo
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          Fill in your details and we\'ll be in touch to schedule your demo.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-muted-foreground" />
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="h-11"
                          />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@yourcafe.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="h-11"
                          />
                        </div>

                        {/* Cafe Name Field */}
                        <div className="space-y-2">
                          <Label htmlFor="cafeName" className="flex items-center">
                            <Store className="w-4 h-4 mr-2 text-muted-foreground" />
                            Cafe Name *
                          </Label>
                          <Input
                            id="cafeName"
                            name="cafeName"
                            type="text"
                            placeholder="The Coffee Corner"
                            value={formData.cafeName}
                            onChange={handleInputChange}
                            required
                            className="h-11"
                          />
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="h-11"
                          />
                        </div>

                        {/* Message Field */}
                        <div className="space-y-2">
                          <Label htmlFor="message" className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
                            Message (Optional)
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Tell us about your cafe and what you\'re looking for..."
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={4}
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base font-medium"
                      >
                        Request Demo
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        We respect your privacy. Your information will never be shared.
                      </p>
                    </form>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        Demo Request Received!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for your interest, {formData.name}. Our team will reach out to you at{' '}
                        <span className="font-medium text-foreground">{formData.email}</span>{' '}
                        within 24 hours to schedule your personalized demo.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/">
                          <Button variant="outline">
                            Back to Home
                          </Button>
                        </Link>
                        <Link href="/features">
                          <Button>
                            Explore Features
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer - Same as landing page */}
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
