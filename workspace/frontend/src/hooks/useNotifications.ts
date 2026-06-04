'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

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

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      path: '/notifications',
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
