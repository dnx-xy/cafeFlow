"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Calendar, Clock, ArrowRight, Search } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { useI18n } from "@/i18n/context";

export default function BlogPage() {
  const { t } = useI18n();
  const d = t.blog;

  const categoryKeys = ['all', 'growth', 'technology', 'marketing', 'reviews', 'analytics', 'design', 'loyalty'] as const;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-12 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-rose-500 blur-[80px] rounded-full mix-blend-multiply dark:mix-blend-soft-light" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <Badge className="mb-6 bg-background border-amber-500/30 text-amber-600 dark:text-amber-400" variant="outline">Insights & Updates</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              CafeFlow{' '}
              <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-medium">{d.hero.subtitle}</p>
          </div>
          <div className="max-w-xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-rose-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-background rounded-xl p-2 border border-border/50">
                <Search className="w-5 h-5 text-muted-foreground ml-3" />
                <input type="text" placeholder={d.hero.searchPlaceholder} className="w-full pl-4 pr-4 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-foreground" />
                <Button className="rounded-lg bg-amber-500 hover:bg-amber-600 text-white border-0">Search</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categoryKeys.map((key, index) => (
              <Badge key={key} variant={index === 0 ? "default" : "secondary"} className={`cursor-pointer transition-colors text-sm px-5 py-2 rounded-full ${index === 0 ? 'bg-foreground text-background hover:bg-foreground/90' : 'bg-muted hover:bg-muted/80 text-foreground/80'}`}>
                {d.categories[key]}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="group rounded-3xl overflow-hidden border border-border/50 shadow-xl hover:border-amber-500/30 transition-all bg-card cursor-pointer">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-gradient-to-br from-amber-400/20 to-orange-500/20 h-64 lg:h-auto flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-500/10 mix-blend-multiply group-hover:bg-amber-500/20 transition-colors" />
                <div className="text-center text-foreground relative z-10">
                  <div className="w-24 h-24 bg-background/50 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <Coffee className="w-10 h-10 text-amber-600" />
                  </div>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 border-0">{d.posts[0].category}</Badge>
                  <div className="flex items-center text-sm font-medium text-muted-foreground"><Calendar className="w-4 h-4 mr-2" />{d.posts[0].date}</div>
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4 leading-tight group-hover:text-amber-600 transition-colors">{d.posts[0].title}</h2>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{d.posts[0].excerpt}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center text-sm font-medium text-muted-foreground"><Clock className="w-4 h-4 mr-2" />{d.posts[0].readTime}</div>
                  <Button variant="ghost" className="font-semibold group-hover:translate-x-1 transition-transform">{d.featured.readMore}<ArrowRight className="ml-2 w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {d.posts.slice(1).map((post, index) => (
              <div key={index} className="group rounded-3xl border border-border/50 shadow-sm hover:shadow-xl transition-all hover:border-amber-500/30 bg-card overflow-hidden flex flex-col cursor-pointer">
                <div className="h-48 bg-muted/30 flex items-center justify-center relative overflow-hidden group-hover:bg-amber-500/5 transition-colors">
                   <Coffee className="w-12 h-12 text-muted-foreground/20 group-hover:text-amber-500/40 transition-colors group-hover:scale-110 duration-500" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="text-xs font-semibold">{post.category}</Badge>
                    <div className="flex items-center text-xs font-medium text-muted-foreground"><Calendar className="w-3.5 h-3.5 mr-1.5" />{post.date}</div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-amber-600 transition-colors">{post.title}</h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
                    <div className="flex items-center text-sm font-medium text-muted-foreground"><Clock className="w-4 h-4 mr-1.5" />{post.readTime}</div>
                    <span className="text-sm font-bold text-amber-600 group-hover:translate-x-1 transition-transform inline-flex items-center">Read <ArrowRight className="ml-1 w-4 h-4" /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-background mb-4">{d.newsletter.title}</h2>
          <p className="text-lg text-background/80 mb-10">{d.newsletter.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="email" placeholder={d.newsletter.placeholder} className="flex-1 px-6 py-4 rounded-xl border-0 bg-background/10 backdrop-blur-sm text-background placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            <Button size="lg" className="h-14 px-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base shadow-lg shadow-amber-500/20">{d.newsletter.button}</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
