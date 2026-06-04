import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/marketing/Navbar';
import { LoginForm } from '@/components/auth/LoginForm';
import en from '@/i18n/en';

const d = en.auth.login;

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold">{d.title}</CardTitle>
              <CardDescription>{d.subtitle}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <LoginForm d={d} />

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {d.noAccount}{' '}
                  <Link href="/register" className="text-amber-600 hover:text-amber-700 font-medium">{d.signUp}</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-background border-t py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CafeFlow. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
