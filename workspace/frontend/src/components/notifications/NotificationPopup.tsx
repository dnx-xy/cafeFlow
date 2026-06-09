'use client';

import { ShoppingCart, CreditCard, X } from 'lucide-react';

export interface NotificationPopupData {
  type: 'order' | 'payment';
  orderId: string;
  tableNumber?: string;
  totalAmount: number;
  status?: string;
  id?: string;
}

function formatCurrency(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}

export function NotificationPopupContent({ data, onDismiss }: { data: NotificationPopupData; onDismiss?: () => void }) {
  const isOrder = data.type === 'order';
  const isStatusUpdate = isOrder && data.status;
  const title = isStatusUpdate
    ? `Order ${data.status}`
    : isOrder
      ? 'Pesanan Baru'
      : 'Pembayaran';

  return (
    <div
      className={`relative flex items-start gap-3.5 w-[360px] rounded-xl border-l-4 shadow-lg bg-white dark:bg-gray-900 p-4 ${
        isStatusUpdate
          ? 'border-l-amber-500 dark:border-l-amber-400'
          : isOrder
            ? 'border-l-blue-500 dark:border-l-blue-400'
            : 'border-l-emerald-500 dark:border-l-emerald-400'
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          isStatusUpdate
            ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
            : isOrder
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
        }`}
      >
        {isOrder ? <ShoppingCart className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {data.orderId}
          {data.tableNumber ? ` - Meja ${data.tableNumber}` : ''}
        </p>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-1.5">
          {formatCurrency(data.totalAmount)}
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
