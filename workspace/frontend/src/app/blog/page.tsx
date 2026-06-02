'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Coffee,
  Calendar,
  Clock,
  ArrowRight,
  Search
} from 'lucide-react';

export default function BlogPage() {
  const featuredPost = {
    title: 'How to Increase Cafe Revenue by 40% with Digital Ordering',
    excerpt: 'Discover the proven strategies that successful cafes use to boost revenue through QR code ordering and customer engagement.',
    date: 'Dec 15, 2024',
    readTime: '8 min read',
    category: 'Growth',
    image: 'bg-gradient-to-br from-amber-400 to-orange-500'
  };

  const posts = [
    {
      title: 'The Complete Guide to QR Code Menus for Cafes',
      excerpt: 'Everything you need to know about implementing QR code menus in your cafe.',
      date: 'Dec 12, 2024',
      readTime: '6 min read',
      category: 'Technology'
    },
    {
      title: 'Building Customer Loyalty: 7 Proven Strategies',
      excerpt: 'Learn how to turn first-time visitors into regular customers.',
      date: 'Dec 10, 2024',
      readTime: '5 min read',
      category: 'Marketing'
    },
    {
      title: 'How to Get More Google Reviews for Your Cafe',
      excerpt: 'A step-by-step guide to boosting your online reputation.',
      date: 'Dec 8, 2024',
      readTime: '4 min read',
      category: 'Reviews'
    },
    {
      title: 'Understanding Your Cafe Analytics Dashboard',
      excerpt: 'Make data-driven decisions with these key metrics.',
      date: 'Dec 5, 2024',
      readTime: '7 min read',
      category: 'Analytics'
    },
    {
      title: 'Creating the Perfect Digital Menu Experience',
      excerpt: 'Design tips for menus that convert browsers into buyers.',
      date: 'Dec 3, 2024',
      readTime: '5 min read',
      category: 'Design'
    },
    {
      title: 'Loyalty Programs That Actually Work for Cafes',
      excerpt: 'Real examples from successful cafe loyalty programs.',
      date: 'Dec 1, 2024',
      readTime: '6 min read',
      category: 'Loyalty'
    }
  ];

  const categories = ['All', 'Growth', 'Technology', 'Marketing', 'Reviews', 'Analytics', 'Design', 'Loyalty'];

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
      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6" variant="secondary">Blog</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              CafeFlow{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Insights, tips, and strategies to help your cafe grow
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <Badge
                key={index}
                variant={index === 0 ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-muted transition-colors text-sm px-4 py-1.5"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className={`${featuredPost.image} h-64 lg:h-auto flex items-center justify-center`}>
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Coffee className="w-10 h-10" />
                  </div>
                  <span className="text-sm font-medium uppercase tracking-wider opacity-90">Featured</span>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="secondary">{featuredPost.category}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {featuredPost.date}
                  </div>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-6 text-lg">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {featuredPost.readTime}
                  </div>
                  <Button variant="outline">
                    Read Article
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-amber-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {post.date}
                    </div>
                    <Button variant="ghost" size="sm" className="text-amber-600">
                      Read
                      <ArrowRight className="ml-1 w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Cafe Growth Tips
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Subscribe to our newsletter for weekly insights on growing your cafe
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button size="lg" variant="secondary" className="bg-white text-amber-600 hover:bg-white/90">
              Subscribe
            </Button>
          </div>
          <p className="mt-4 text-white/70 text-sm">
            No spam. Unsubscribe anytime.
          </p>
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
