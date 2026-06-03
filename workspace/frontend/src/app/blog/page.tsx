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

      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6" variant="secondary">Blog</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              CafeFlow{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">{d.hero.subtitle}</p>
          </div>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" placeholder={d.hero.searchPlaceholder} className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categoryKeys.map((key, index) => (
              <Badge key={key} variant={index === 0 ? "default" : "outline"} className="cursor-pointer hover:bg-muted transition-colors text-sm px-4 py-1.5">
                {d.categories[key]}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 h-64 lg:h-auto flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Coffee className="w-10 h-10" />
                  </div>
                  <span className="text-sm font-medium uppercase tracking-wider opacity-90">{d.featured.title}</span>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="secondary">{d.posts[0].category}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground"><Calendar className="w-4 h-4 mr-1" />{d.posts[0].date}</div>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">{d.posts[0].title}</h2>
                <p className="text-muted-foreground mb-6 text-lg">{d.posts[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground"><Clock className="w-4 h-4 mr-1" />{d.posts[0].readTime}</div>
                  <Button variant="outline">{d.featured.readMore}<ArrowRight className="ml-2 w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {d.posts.slice(1).map((post, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <Coffee className="w-12 h-12 text-muted-foreground/30" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="outline" className="text-xs">{post.category}</Badge>
                    <div className="flex items-center text-xs text-muted-foreground"><Calendar className="w-3 h-3 mr-1" />{post.date}</div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground"><Clock className="w-3 h-3 mr-1" />{post.readTime}</div>
                    <Button variant="ghost" size="sm">{d.featured.readMore}<ArrowRight className="ml-1 w-3 h-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">{d.newsletter.title}</h2>
          <p className="text-muted-foreground mb-8">{d.newsletter.subtitle}</p>
          <div className="flex gap-3">
            <input type="email" placeholder={d.newsletter.placeholder} className="flex-1 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            <Button>{d.newsletter.button}</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
