'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { playOrderNotificationSound, playPaymentNotificationSound } from '@/lib/notificationSound';
import { NotificationPopupContent, NotificationPopupData } from '@/components/notifications/NotificationPopup';

export interface AppNotification {
  id: string;
  type: 'order' | 'payment' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export function useNotifications(businessId?: string | null) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!businessId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    const socket = io(`${apiUrl}/notifications`, {
      transports: ['websocket', 'polling'],
      query: { businessId },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('subscribe', businessId);
    });

    socket.on('order:new', (data: any) => {
      const notification: AppNotification = {
        id: `order-${data.id}-${Date.now()}`,
        type: 'order',
        title: 'Pesanan Baru',
        message: `Pesanan ${data.orderId}${data.tableNumber ? ` - Meja ${data.tableNumber}` : ''} - ${formatCurrency(data.totalAmount)}`,
        link: `/dashboard/orders/${data.id}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      playOrderNotificationSound();

      const popupData: NotificationPopupData = {
        type: 'order',
        orderId: data.orderId,
        tableNumber: data.tableNumber,
        totalAmount: data.totalAmount,
        id: data.id,
      };

      toast.custom(
        (t) => (
          <a
            href={`/dashboard/orders/${data.id}`}
            onClick={() => toast.dismiss(t)}
            className="block no-underline"
          >
            <NotificationPopupContent
              data={popupData}
              onDismiss={() => toast.dismiss(t)}
            />
          </a>
        ),
        {
          duration: 6000,
          position: 'top-right',
          className: 'p-0 border-0 shadow-none',
          style: { padding: 0, border: 0 },
        },
      );
    });

    socket.on('order:status', (data: any) => {
      const statusLabels: Record<string, string> = {
        CONFIRMED: 'Confirmed',
        PREPARING: 'Preparing',
        READY: 'Ready',
        DELIVERED: 'Delivered',
        COMPLETED: 'Completed',
        CANCELLED: 'Cancelled',
      };
      const label = statusLabels[data.newStatus] || data.newStatus;
      const message = `Order ${data.orderId}${data.tableNumber ? ` - Table ${data.tableNumber}` : ''} → ${label}`;
      const notification: AppNotification = {
        id: `order-status-${data.id}-${Date.now()}`,
        type: 'order',
        title: `Order ${label}`,
        message,
        link: `/dashboard/orders/${data.id}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      playOrderNotificationSound();

      const popupData: NotificationPopupData = {
        type: 'order',
        orderId: data.orderId,
        tableNumber: data.tableNumber,
        totalAmount: data.totalAmount,
        status: label,
        id: data.id,
      };

      toast.custom(
        (t) => (
          <a
            href={`/dashboard/orders/${data.id}`}
            onClick={() => toast.dismiss(t)}
            className="block no-underline"
          >
            <NotificationPopupContent
              data={popupData}
              onDismiss={() => toast.dismiss(t)}
            />
          </a>
        ),
        {
          duration: 6000,
          position: 'top-right',
          className: 'p-0 border-0 shadow-none',
          style: { padding: 0, border: 0 },
        },
      );
    });

    socket.on('payment:update', (data: any) => {
      const statusText = data.paymentStatus === 'PAID' ? 'Lunas' : data.paymentStatus;
      const notification: AppNotification = {
        id: `payment-${data.orderId}-${Date.now()}`,
        type: 'payment',
        title: `Pembayaran ${statusText}`,
        message: `Pesanan ${data.orderId} - ${formatCurrency(data.totalAmount)} - ${statusText}`,
        link: `/dashboard/orders`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      playPaymentNotificationSound();

      const popupData: NotificationPopupData = {
        type: 'payment',
        orderId: data.orderId,
        totalAmount: data.totalAmount,
        status: data.paymentStatus,
      };

      toast.custom(
        (t) => (
          <a
            href="/dashboard/orders"
            onClick={() => toast.dismiss(t)}
            className="block no-underline"
          >
            <NotificationPopupContent
              data={popupData}
              onDismiss={() => toast.dismiss(t)}
            />
          </a>
        ),
        {
          duration: 6000,
          position: 'top-right',
          className: 'p-0 border-0 shadow-none',
          style: { padding: 0, border: 0 },
        },
      );
    });

    return () => {
      socket.emit('unsubscribe', businessId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [businessId]);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, markAllRead, clearAll };
}

function formatCurrency(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}
