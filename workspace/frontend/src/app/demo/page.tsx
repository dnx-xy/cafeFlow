"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Coffee, ArrowRight, Check, Calendar, Clock, Mail, Phone, Store, User, MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { useI18n } from "@/i18n/context";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function DemoPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", cafeName: "", phone: "", message: "" });
  const { t } = useI18n();
  const d = t.demo;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-3xl mx-auto" initial="initial" animate="animate" variants={staggerContainer}>
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700 mb-6">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule a Demo
              </span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              {d.hero.title.split('in ')[0]}in{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Action</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-4">{d.hero.subtitle}</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Card className="h-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">{d.expect.title}</h3>
                  <ul className="space-y-4">
                    {d.expect.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                          {index === 0 ? <Clock className="w-3.5 h-3.5 text-amber-600" />
                            : index === 1 ? <User className="w-3.5 h-3.5 text-amber-600" />
                            : index === 2 ? <Store className="w-3.5 h-3.5 text-amber-600" />
                            : <Check className="w-3.5 h-3.5 text-amber-600" />}
                        </div>
                        <div>
                          <span className="text-muted-foreground font-medium">{item.title}</span>
                          <p className="text-sm text-muted-foreground/80">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-8 border-t border-amber-200 dark:border-amber-800/50">
                    <p className="text-sm text-muted-foreground mb-4">{d.availability.title}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2 text-amber-500" />
                        {d.availability.weekdays}: {d.availability.weekdayTime}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2 text-amber-500" />
                        {d.availability.weekend}: {d.availability.weekendTime}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="lg:col-span-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">{d.form.title}</h2>
                        <p className="text-muted-foreground text-sm">{d.form.subtitle}</p>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center"><User className="w-4 h-4 mr-2 text-muted-foreground" />{d.form.name} *</Label>
                          <Input id="name" name="name" placeholder={d.form.namePlaceholder} value={formData.name} onChange={handleInputChange} required className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center"><Mail className="w-4 h-4 mr-2 text-muted-foreground" />{d.form.email} *</Label>
                          <Input id="email" name="email" type="email" placeholder={d.form.emailPlaceholder} value={formData.email} onChange={handleInputChange} required className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cafeName" className="flex items-center"><Store className="w-4 h-4 mr-2 text-muted-foreground" />{d.form.cafeName} *</Label>
                          <Input id="cafeName" name="cafeName" placeholder={d.form.cafePlaceholder} value={formData.cafeName} onChange={handleInputChange} required className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center"><Phone className="w-4 h-4 mr-2 text-muted-foreground" />{d.form.phone}</Label>
                          <Input id="phone" name="phone" type="tel" placeholder={d.form.phonePlaceholder} value={formData.phone} onChange={handleInputChange} className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message" className="flex items-center"><MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />{d.form.message}</Label>
                          <Textarea id="message" name="message" placeholder={d.form.messagePlaceholder} value={formData.message} onChange={handleInputChange} rows={4} />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-12 text-base font-medium">{d.form.submit}<ArrowRight className="ml-2 w-5 h-5" /></Button>
                      <p className="text-xs text-center text-muted-foreground">{d.form.submit === 'Book Demo' ? 'We respect your privacy.' : 'Kami menghormati privasi Anda.'}</p>
                    </form>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">{d.form.success}</h3>
                      <p className="text-muted-foreground mb-6">
                        {d.form.title === 'Book Your Demo' ? `Thank you for your interest, ${formData.name}.` : `Terima kasih atas minat Anda, ${formData.name}.`}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/"><Button variant="outline">{d.form.submit === 'Book Demo' ? 'Back to Home' : 'Kembali'}</Button></Link>
                        <Link href="/features"><Button>{d.form.submit === 'Book Demo' ? 'Explore Features' : 'Jelajahi Fitur'}<ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
