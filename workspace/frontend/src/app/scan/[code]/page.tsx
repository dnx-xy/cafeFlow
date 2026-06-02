'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';

export default function ScanPage() {
  const params = useParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = params.code as string;
    if (!code) return;

    apiClient.get(`/qr-codes/scan/${code}`)
      .then((res) => {
        const { tableId } = res.data;
        router.replace(`/menu/${tableId}`);
      })
      .catch(() => {
        setError('Invalid or expired QR code');
      });
  }, [params.code, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Invalid QR Code</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4" />
        <p className="text-muted-foreground">Scanning QR code...</p>
      </div>
    </div>
  );
}
