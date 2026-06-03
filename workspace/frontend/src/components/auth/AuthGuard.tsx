'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login');
      setAuthenticated(false);
    } else {
      setAuthenticated(true);
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading || authenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If authenticated, render children
  if (authenticated) {
    return <>{children}</>;
  }

  // If not authenticated, redirect happens above, so this shouldn't happen
  return null;
}