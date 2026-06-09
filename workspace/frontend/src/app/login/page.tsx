'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/marketing/Navbar';
import { LoginForm } from '@/components/auth/LoginForm';
import { useI18n } from '@/i18n/context';
import { Coffee, Star, Quote } from 'lucide-react';

export default function LoginPage() {
  const d = useI18n().t.auth.login;
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <div className="md:hidden">
        <Navbar />
      </div>

      {/* Left side: Form */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="absolute top-8 left-8 hidden md:flex items-center gap-3">
           <Link href="/" className="flex items-center gap-3 group">
             <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
               <Coffee className="w-6 h-6 text-white" />
             </div>
             <span className="font-extrabold text-2xl tracking-tight text-foreground">CafeFlow</span>
           </Link>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{d.title}</h1>
            <p className="text-muted-foreground mt-2">{d.subtitle}</p>
          </div>

          <LoginForm d={d} />

          <div className="text-center md:text-left text-sm text-muted-foreground pt-4">
            {d.noAccount}{' '}
            <Link href="/register" className="text-amber-600 hover:text-amber-700 font-semibold hover:underline transition-all">
              {d.signUp}
            </Link>
          </div>
        </div>
      </main>

      {/* Right side: Visual / Testimonial */}
      <aside className="hidden md:flex flex-1 relative bg-muted/40 overflow-hidden border-l border-border/50 items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-background z-0" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent z-0" />
        
        <div className="relative z-10 w-full max-w-lg">
          <Card className="border-0 shadow-2xl bg-background/60 backdrop-blur-xl">
            <CardContent className="p-8">
              <Quote className="w-10 h-10 text-amber-500 mb-6 opacity-50" />
              <p className="text-xl font-medium leading-relaxed text-foreground mb-8">
                &ldquo;CafeFlow completely transformed how we run our daily operations. Our staff is less stressed, our tables turn faster, and we've seen a 40% jump in returning customers within just a few months.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  S
                </div>
                <div>
                  <div className="font-semibold text-foreground">Sarah Chen</div>
                  <div className="text-sm text-muted-foreground">Owner, Bean & Bloom Cafe</div>
                </div>
                <div className="ml-auto flex gap-1">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                   ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 flex gap-4 text-sm font-medium text-muted-foreground justify-center">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> System Operational</div>
            <div className="px-2 border-l border-border/50">Version 2.0</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
