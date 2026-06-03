"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Shield,
} from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { useI18n } from "@/i18n/context";

const mainIcons = [Smartphone, QrCode, Users, Star, Award, BarChart3];
const mainColors = [
  "bg-blue-100 text-blue-600", "bg-amber-100 text-amber-600", "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600", "bg-rose-100 text-rose-600", "bg-indigo-100 text-indigo-600",
];
const extraIcons = [MessageSquare, Zap, Gift, Clock, Shield, Sparkles];

export default function FeaturesPage() {
  const { t } = useI18n();
  const d = t.features;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6" variant="secondary">Features</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            {d.hero.title.split('Grow Your Cafe')[0]}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              {' '}Grow Your Cafe
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{d.hero.subtitle}</p>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">{d.mainFeatures.title}</h2>
            <p className="text-lg text-muted-foreground">{d.mainFeatures.subtitle}</p>
          </div>
          <div className="space-y-20">
            {d.mainFeatures.items.map((feature, index) => {
              const Icon = mainIcons[index];
              const isOdd = index % 2 === 1;
              return (
                <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
                  <div className={isOdd ? "lg:order-2" : ""}>
                    <div className={`w-16 h-16 ${mainColors[index]} rounded-2xl flex items-center justify-center mb-6`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">{feature.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">{feature.desc}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-medium mb-6">{feature.benefit}</div>
                  </div>
                  <div className={isOdd ? "lg:order-1" : ""}>
                    <Card className="border-0 shadow-xl">
                      <CardContent className="p-8">
                        <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                          <div className={`w-24 h-24 ${mainColors[index]} rounded-2xl flex items-center justify-center`}>
                            <Icon className="w-12 h-12" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">{d.extraFeatures.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {d.extraFeatures.items.map((feature, index) => {
              const Icon = extraIcons[index];
              return (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{d.cta.title}</h2>
          <p className="text-xl text-white/90 mb-8">{d.cta.subtitle}</p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 bg-white text-amber-600 hover:bg-white/90">
              {d.cta.startFree}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
