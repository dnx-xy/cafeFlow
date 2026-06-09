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

      <section className="pt-32 pb-12 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-soft-light pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center max-w-3xl mx-auto" initial="initial" animate="animate" variants={staggerContainer}>
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 mb-6 shadow-sm border border-amber-200 dark:border-amber-800">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule a Demo
              </span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              {d.hero.title.split('Works')[0]}
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Works</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-4 font-medium">{d.hero.subtitle}</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Card className="h-full rounded-3xl border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Coffee className="w-32 h-32 text-amber-500" />
                </div>
                <CardContent className="p-8 relative z-10">
                  <h3 className="text-2xl font-bold text-foreground mb-6">{d.expect.title}</h3>
                  <ul className="space-y-6">
                    {d.expect.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-10 h-10 rounded-xl bg-background shadow-sm flex items-center justify-center mr-4 flex-shrink-0">
                          {index === 0 ? <Clock className="w-5 h-5 text-amber-600" />
                            : index === 1 ? <User className="w-5 h-5 text-amber-600" />
                            : index === 2 ? <Store className="w-5 h-5 text-amber-600" />
                            : <Check className="w-5 h-5 text-amber-600" />}
                        </div>
                        <div>
                          <span className="text-foreground font-semibold block mb-1">{item.title}</span>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 pt-8 border-t border-amber-200/50 dark:border-amber-800/30">
                    <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">{d.availability.title}</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center text-foreground font-medium">
                        <Clock className="w-4 h-4 mr-3 text-amber-500" />
                        {d.availability.weekdays}: {d.availability.weekdayTime}
                      </div>
                      <div className="flex items-center text-foreground font-medium">
                        <Clock className="w-4 h-4 mr-3 text-amber-500" />
                        {d.availability.weekend}: {d.availability.weekendTime}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="lg:col-span-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card className="shadow-2xl rounded-3xl border border-border/50 bg-background/80 backdrop-blur-xl">
                <CardContent className="p-8 sm:p-10">
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-foreground mb-2">{d.form.title}</h2>
                        <p className="text-muted-foreground">{d.form.subtitle}</p>
                      </div>
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">{d.form.name} *</Label>
                            <Input id="name" name="name" placeholder={d.form.namePlaceholder} value={formData.name} onChange={handleInputChange} required className="h-12 bg-muted/50 border-0 focus-visible:ring-amber-500" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">{d.form.email} *</Label>
                            <Input id="email" name="email" type="email" placeholder={d.form.emailPlaceholder} value={formData.email} onChange={handleInputChange} required className="h-12 bg-muted/50 border-0 focus-visible:ring-amber-500" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                           <div className="space-y-2">
                            <Label htmlFor="cafeName" className="text-sm font-medium">{d.form.cafeName} *</Label>
                            <Input id="cafeName" name="cafeName" placeholder={d.form.cafePlaceholder} value={formData.cafeName} onChange={handleInputChange} required className="h-12 bg-muted/50 border-0 focus-visible:ring-amber-500" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium">{d.form.phone}</Label>
                            <Input id="phone" name="phone" type="tel" placeholder={d.form.phonePlaceholder} value={formData.phone} onChange={handleInputChange} className="h-12 bg-muted/50 border-0 focus-visible:ring-amber-500" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-sm font-medium">{d.form.message}</Label>
                          <Textarea id="message" name="message" placeholder={d.form.messagePlaceholder} value={formData.message} onChange={handleInputChange} rows={4} className="bg-muted/50 border-0 focus-visible:ring-amber-500 resize-none" />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-14 text-base font-bold shadow-xl shadow-amber-500/20 bg-amber-500 hover:bg-amber-600 text-white transition-all hover:scale-[1.02] rounded-xl mt-4">
                        {d.form.submit}<ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-4">We respect your privacy. No spam, ever.</p>
                    </form>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-3xl font-extrabold text-foreground mb-3">{d.form.success}</h3>
                      <p className="text-lg text-muted-foreground mb-10 max-w-sm mx-auto">
                        Thank you for your interest, {formData.name}. We'll be in touch shortly to confirm your schedule.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/"><Button variant="outline" className="h-12 px-6 rounded-xl">Back to Home</Button></Link>
                        <Link href="/features"><Button className="h-12 px-6 rounded-xl">Explore Features<ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
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
