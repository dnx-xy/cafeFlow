'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n/context';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import {
  MessageSquare, Send, Phone, Search, ExternalLink, Loader2,
  Smartphone, RefreshCw, CheckCircle2, XCircle,
} from 'lucide-react';

interface Conversation {
  customer: string;
  phone: string;
  lastMessage: string;
  lastDate: string;
  unread: number;
  messages: any[];
}

export default function MessagesPage() {
  const { t } = useI18n();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [sessionStatus, setSessionStatus] = useState<string>('checking');
  const [sessionUser, setSessionUser] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const checkSession = useCallback(async () => {
    try {
      const res = await apiClient.get('/whatsapp/session/status');
      setSessionStatus(res.data.status);
      setSessionUser(res.data.user || null);
    } catch {
      setSessionStatus('gateway_unreachable');
    }
  }, []);

  useEffect(() => {
    checkSession();
    loadConversations();
    const interval = setInterval(() => {
      loadConversations();
      checkSession();
    }, 5000);
    return () => clearInterval(interval);
  }, [checkSession]);

  useEffect(() => {
    if (selectedPhone) loadMessages(selectedPhone);
  }, [selectedPhone]);

  useEffect(() => {
    if (sessionStatus === 'scan_required' || sessionStatus === 'connecting') {
      const poll = setInterval(checkSession, 3000);
      return () => clearInterval(poll);
    }
  }, [sessionStatus, checkSession]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await apiClient.get('/whatsapp/session/qr');
      setSessionStatus(res.data.status);
      if (res.data.qrBase64) setQrCode(res.data.qrBase64);
      if (res.data.status === 'scan_required') {
        toast.info('Scan QR code dengan WhatsApp Anda');
      }
    } catch {
      toast.error('Gagal menghubungkan WhatsApp');
    } finally {
      setConnecting(false);
    }
  };

  const loadConversations = async () => {
    try {
      const res = await apiClient.get('/whatsapp/conversations');
      setConversations(res.data);
    } catch {} finally { setLoading(false); }
  };

  const loadMessages = async (from: string) => {
    try {
      const res = await apiClient.get(`/whatsapp/messages?from=${encodeURIComponent(from)}`);
      setMessages(res.data);
    } catch {}
  };

  const unreadCount = conversations.reduce((s, c) => s + c.unread, 0);
  const filtered = conversations.filter(c =>
    c.customer.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const selectedConv = conversations.find(c => c.phone === selectedPhone);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedPhone) return;
    setSending(true);
    try {
      await apiClient.post('/whatsapp/reply', { to: selectedPhone, text: replyText });
      toast.success('Pesan terkirim');
      setReplyText('');
      if (selectedPhone) loadMessages(selectedPhone);
      loadConversations();
    } catch { toast.error('Gagal mengirim pesan'); }
    finally { setSending(false); }
  };

  const handleMarkAllRead = async () => {
    if (!selectedPhone) return;
    try {
      await apiClient.post('/whatsapp/mark-read', { from: selectedPhone });
      loadConversations();
    } catch {}
  };

  const isConnected = sessionStatus === 'authenticated';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.dashboard.whatsapp.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.whatsapp.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Badge className="text-[10px] bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20 gap-1">
              <CheckCircle2 className="w-3 h-3" /> Terhubung
            </Badge>
          ) : sessionStatus === 'gateway_unreachable' ? (
            <Badge className="text-[10px] bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20 gap-1">
              <XCircle className="w-3 h-3" /> Gateway offline
            </Badge>
          ) : null}
          {unreadCount > 0 && (
            <Badge variant="outline" className="text-[10px] bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </div>

      {!isConnected && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/5 dark:to-orange-500/5 rounded-xl border border-amber-100 dark:border-amber-500/10 p-5">
          <div className="flex flex-col items-center text-center">
            <Smartphone className="w-10 h-10 text-amber-600 dark:text-amber-400 mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Hubungkan WhatsApp</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-md">
              Scan QR code dengan WhatsApp Anda untuk menerima dan membalas pesan pelanggan langsung dari dashboard.
            </p>
            {qrCode ? (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCode} alt="WhatsApp QR Code" className="w-48 h-48" />
              </div>
            ) : (
              <Button onClick={handleConnect} disabled={connecting} size="sm" className="h-9">
                {connecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                {connecting ? 'Menghubungkan...' : 'Tampilkan QR Code'}
              </Button>
            )}
            {sessionStatus === 'connecting' && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Menunggu scan...
              </p>
            )}
            {sessionStatus === 'scan_required' && (
              <p className="text-xs text-gray-500 mt-2">
                Buka WhatsApp &gt; Titik tiga &gt; Perangkat tertaut &gt; Scan
              </p>
            )}
          </div>
        </div>
      )}

      {isConnected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1 bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={`${t.dashboard.orders.search}...`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800/50 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="p-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
              ) : filtered.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-400 dark:text-gray-500">{t.dashboard.whatsapp.noMessages}</div>
              ) : filtered.map(conv => (
                <button
                  key={conv.phone}
                  onClick={() => { setSelectedPhone(conv.phone); handleMarkAllRead(); }}
                  className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${selectedPhone === conv.phone ? 'bg-amber-50 dark:bg-amber-500/5' : ''}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        {conv.customer.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{conv.customer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {conv.unread > 0 && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
                      <span className="text-[10px] text-gray-400">{formatTime(conv.lastDate)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 ml-9">{conv.lastMessage}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 flex flex-col">
            {selectedConv ? (
              <>
                <div className="p-5 border-b border-gray-100 dark:border-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {selectedConv.customer.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedConv.customer}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Phone className="w-3 h-3" /> {selectedConv.phone}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs"
                      onClick={() => window.open(`https://wa.me/${selectedConv.phone.replace(/[^0-9]/g, '')}`, '_blank')}>
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Open in WhatsApp
                    </Button>
                  </div>
                </div>

                <div className="flex-1 p-5 overflow-y-auto min-h-[300px] max-h-[400px] space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">Belum ada pesan</div>
                  ) : messages.map((msg: any) => {
                    const isIncoming = msg.direction === 'incoming';
                    return (
                      <div key={msg.id} className={`flex ${isIncoming ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${isIncoming ? 'bg-gray-50 dark:bg-gray-800/40 rounded-tl-none' : 'bg-amber-50 dark:bg-amber-500/10 rounded-tr-none'}`}>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{msg.body}</p>
                          <p className="text-[10px] text-gray-400 mt-2">{formatTime(msg.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800/50">
                  <div className="flex gap-2">
                    <Input
                      placeholder={t.dashboard.whatsapp.placeholder}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !sending && handleSendReply()}
                      className="flex-1 h-10 text-sm"
                    />
                    <Button onClick={handleSendReply} disabled={!replyText.trim() || sending}
                      className="h-10 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-1.5" />}
                      {t.dashboard.whatsapp.send}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 dark:text-gray-500">
                <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm">{t.dashboard.whatsapp.noMessages}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const msgDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const timeStr = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });

  if (msgDate.getTime() === today.getTime()) return timeStr;
  if (msgDate.getTime() === yesterday.getTime()) return `Kemarin ${timeStr}`;
  const dayDiff = Math.floor((today.getTime() - msgDate.getTime()) / 86400000);
  if (dayDiff < 7) {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return `${days[d.getDay()]} ${timeStr}`;
  }
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ` ${timeStr}`;
}
