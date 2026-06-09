'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export function useMenuSocket(businessId?: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const listenersRef = useRef<Map<string, Set<(...args: any[]) => void>>>(new Map());

  useEffect(() => {
    if (!businessId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    const socket = io(`${apiUrl}/menu-updates`, {
      transports: ['websocket', 'polling'],
      query: { businessId },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('subscribe', businessId);
    });

    socket.on('disconnect', () => {});

    return () => {
      socket.emit('unsubscribe', businessId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [businessId]);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event)!.add(handler);
    socketRef.current?.on(event, handler);
    return () => {
      listenersRef.current.get(event)?.delete(handler);
      socketRef.current?.off(event, handler);
    };
  }, []);

  const off = useCallback((event: string, handler: (...args: any[]) => void) => {
    listenersRef.current.get(event)?.delete(handler);
    socketRef.current?.off(event, handler);
  }, []);

  return { socket: socketRef.current, on, off };
}
