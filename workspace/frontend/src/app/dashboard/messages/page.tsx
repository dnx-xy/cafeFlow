'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/i18n/context';
import { toast } from 'sonner';
import {
  MessageSquare, Send, Phone, Search, Check, Clock, ExternalLink,
} from 'lucide-react';

interface Message {
  id: string;
  customer: string;
  phone: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'replied';
  orderId?: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    customer: 'Sarah Chen',
    phone: '+62 812-3456-7890',
    message: 'Hi, I want to order 2 Iced Caramel Macchiato and 1 Avocado Toast for table 5',
    date: '2 min ago',
    status: 'unread',
    orderId: 'ORD-2026-0042',
  },
  {
    id: '2',
    customer: 'Budi Santoso',
    phone: '+62 811-2233-4455',
    message: 'Can I customize the Eggs Benedict? I want extra hollandaise sauce.',
    date: '15 min ago',
    status: 'unread',
    orderId: 'ORD-2026-0041',
  },
  {
    id: '3',
    customer: 'Emily Watson',
    phone: '+62 877-6543-2100',
    message: 'Is the Matcha Latte available with oat milk?',
    date: '1 hour ago',
    status: 'read',
  },
  {
    id: '4',
    customer: 'Michael Torres',
    phone: '+62 896-1122-3344',
    message: 'Thanks for the quick service! The coffee was amazing.',
    date: '3 hours ago',
    status: 'replied',
    orderId: 'ORD-2026-0039',
  },
];

export default function MessagesPage() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [search, setSearch] = useState('');

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const filtered = messages.filter(m =>
    m.customer.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    const waUrl = `https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(replyText)}`;
    window.open(waUrl, '_blank');
    setMessages(prev => prev.map(m =>
      m.id === selectedMessage.id ? { ...m, status: 'replied' as const } : m
    ));
    setSelectedMessage(prev => prev ? { ...prev, status: 'replied' as const } : prev);
    setReplyText('');
    toast.success('WhatsApp conversation opened in new tab');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.dashboard.whatsapp.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.whatsapp.subtitle}</p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="outline" className="text-[10px] bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20">
            {unreadCount} unread
          </Badge>
        )}
      </div>

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
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400 dark:text-gray-500">{t.dashboard.whatsapp.noMessages}</div>
            ) : filtered.map(msg => (
              <button
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${selectedMessage?.id === msg.id ? 'bg-amber-50 dark:bg-amber-500/5' : ''}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      {msg.customer.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{msg.customer}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {msg.status === 'unread' && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
                    <span className="text-[10px] text-gray-400">{msg.date}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 ml-9">{msg.message}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 flex flex-col">
          {selectedMessage ? (
            <>
              <div className="p-5 border-b border-gray-100 dark:border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {selectedMessage.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedMessage.customer}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Phone className="w-3 h-3" /> {selectedMessage.phone}
                        {selectedMessage.orderId && (
                          <>
                            <span>·</span>
                            <span>{selectedMessage.orderId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => window.open(`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Open in WhatsApp
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-5 overflow-y-auto min-h-[300px]">
                <div className="max-w-[80%] bg-gray-50 dark:bg-gray-800/40 rounded-2xl rounded-tl-none p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedMessage.message}</p>
                  <p className="text-[10px] text-gray-400 mt-2">{selectedMessage.date}</p>
                </div>

                {selectedMessage.status === 'replied' && (
                  <div className="max-w-[80%] ml-auto bg-amber-50 dark:bg-amber-500/10 rounded-2xl rounded-tr-none p-4 mt-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">Thank you for your order! We'll prepare it right away. 😊</p>
                    <p className="text-[10px] text-gray-400 mt-2">Sent via WhatsApp</p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-800/50">
                <div className="flex gap-2">
                  <Input
                    placeholder={t.dashboard.whatsapp.placeholder}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                    className="flex-1 h-10 text-sm"
                  />
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="h-10 bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                  >
                    <Send className="w-4 h-4 mr-1.5" /> {t.dashboard.whatsapp.send}
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
    </div>
  );
}