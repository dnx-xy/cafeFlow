'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ShoppingCart, Plus, Minus, Trash2, X, Search, Loader2,
  Check, Coffee, ArrowLeft, LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePublicMenu } from '@/hooks/usePublicMenu';
import { usePublicOrder } from '@/hooks/usePublicOrder';
import { formatIDR } from '@/lib/format-idr';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function KioskPage() {
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [selectedTableNumber, setSelectedTableNumber] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  const { menu, cafe, loading: menuLoading, fetchMenuByTable } = usePublicMenu();
  const { submitOrder } = usePublicOrder();

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTableId) {
      fetchMenuByTable(selectedTableId);
      setCartItems([]);
      setActiveCategory('');
      setSearchQuery('');
      setCartOpen(false);
      setShowConfirm(false);
    }
  }, [selectedTableId]);

  const fetchTables = async () => {
    try {
      const res = await apiClient.get('/tables');
      const data = res.data.data || res.data || [];
      setTables(data);
    } catch {
      toast.error('Failed to load tables');
    }
  };

  const categories = menu?.categories?.filter(c =>
    c.menuItems?.some(i => i.available && !i.soldOut && !i.hidden)
  ) || [];

  const activeCat = activeCategory || categories[0]?.id || '';
  const currentCategory = categories.find(c => c.id === activeCat);

  const filteredItems = (currentCategory?.menuItems || []).filter(item => {
    if (!item.available || item.soldOut || item.hidden) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
  });

  const allItems = categories.flatMap(c =>
    (c.menuItems || []).filter(i => i.available && !i.soldOut && !i.hidden)
  );

  const searchedItems = searchQuery
    ? allItems.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleQuickAdd = (item: any) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.imageUrl || '',
        quantity: 1,
      }];
    });
    toast(`${item.name} added to cart`, { duration: 1500 });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCartItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
      ).filter(i => i.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = Math.round(cartSubtotal * 0.08);
  const cartTotal = cartSubtotal + tax;

  const handleSubmitOrder = async () => {
    if (!selectedTableId) { toast.error('Select a table first'); return; }
    if (cartItems.length === 0) { toast.error('Cart is empty'); return; }
    setSubmitting(true);
    try {
      const orderData = {
        tableId: selectedTableId,
        items: cartItems.map(i => ({
          menuItemId: i.id,
          quantity: i.quantity,
          notes: '',
          options: [],
        })),
        notes: orderNotes,
        paymentMethod: 'CASH' as const,
        customerName: customerName || 'Kiosk Order',
      };
      const result = await submitOrder(orderData);
      setLastOrder({ ...result, items: [...cartItems] });
      setShowConfirm(true);
      setCartItems([]);
      setOrderNotes('');
      setCustomerName('');
      setCartOpen(false);
      toast.success('Order submitted!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit order');
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedTableId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 max-w-4xl mx-auto px-4">
        <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center border border-amber-500/20 shadow-sm">
          <LayoutGrid className="w-10 h-10 text-amber-500" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground mb-2">Select a Table</h2>
          <p className="text-base font-medium text-muted-foreground">Choose a table to start taking orders</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6 w-full">
          {tables.map((t: any) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTableId(t.id);
                setSelectedTableNumber(t.tableNumber || t.number || t.name || '?');
              }}
              className="flex flex-col items-center gap-3 p-6 rounded-3xl border border-border/50 bg-card hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-2xl bg-muted/50 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center transition-colors text-muted-foreground">
                <Coffee className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-foreground group-hover:text-amber-600 transition-colors">
                {t.tableNumber || t.number || t.name || '?'}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showConfirm && lastOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 max-w-md mx-auto text-center px-4">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-200 dark:border-emerald-800">
          <Check className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-foreground mb-2">Order Submitted!</h2>
          <p className="text-base font-medium text-muted-foreground">
            Order <span className="font-mono font-bold text-foreground px-2 py-0.5 bg-muted rounded-md mx-1">{lastOrder.orderId}</span> for Table <strong className="text-foreground">{selectedTableNumber}</strong>
          </p>
        </div>
        <div className="w-full bg-card rounded-3xl border border-border/50 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 text-left border-b border-border/50 pb-2">Order Summary</p>
          <div className="space-y-3 mb-4">
            {lastOrder.items.map((item: CartItem) => (
              <div key={item.id} className="flex justify-between text-base font-medium">
                <span className="text-foreground"><span className="text-muted-foreground mr-2">{item.quantity}x</span> {item.name}</span>
                <span className="text-muted-foreground font-semibold">{formatIDR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-4 border-border/50" />
          <div className="flex justify-between text-xl font-extrabold">
            <span className="text-foreground">Total</span>
            <span className="text-amber-600 dark:text-amber-400">{formatIDR(lastOrder.totalAmount || cartSubtotal)}</span>
          </div>
        </div>
        <div className="flex w-full gap-3 mt-2">
          <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-border/50 text-base" onClick={() => { setShowConfirm(false); setLastOrder(null); }}>
            New Order
          </Button>
          <Button className="flex-1 h-12 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 text-base" onClick={() => { setShowConfirm(false); setLastOrder(null); setSelectedTableId(''); setSelectedTableNumber(''); }}>
            Change Table
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-10rem)]">
      {/* Menu Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header: Table info + Search */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => { setSelectedTableId(''); setSelectedTableNumber(''); }}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-lg shrink-0">
            <Coffee className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Table {selectedTableNumber}</span>
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search menu..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* Category Tabs */}
        {!searchQuery && categories.length > 0 && (
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 shrink-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCat === cat.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Menu Items Grid */}
        <ScrollArea className="flex-1 -mx-1 px-1">
          {menuLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
            </div>
          ) : searchQuery ? (
            searchedItems.length === 0 ? (
              <div className="text-center py-20 text-sm text-gray-400">No items found</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {searchedItems.map(item => (
                  <MenuItemCard key={item.id} item={item} onAdd={handleQuickAdd} />
                ))}
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.length === 0 ? (
                <div className="col-span-full text-center py-20 text-sm text-gray-400">No items in this category</div>
              ) : (
                filteredItems.map(item => (
                  <MenuItemCard key={item.id} item={item} onAdd={handleQuickAdd} />
                ))
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Cart Panel Toggle (mobile) */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <Button
          size="lg"
          className="rounded-full shadow-lg gap-2"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart ({cartCount})</span>
          <span className="text-amber-200">{formatIDR(cartSubtotal)}</span>
        </Button>
      </div>

      {/* Cart Panel (desktop sidebar) */}
      <div className={`fixed lg:static inset-0 lg:inset-auto z-40 lg:z-auto transition-transform duration-300 lg:w-80 ${
        cartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        {/* Overlay for mobile */}
        <div
          className={`lg:hidden absolute inset-0 bg-black/40 ${cartOpen ? '' : 'hidden'}`}
          onClick={() => setCartOpen(false)}
        />

        <div className="relative lg:static w-80 max-w-full h-full lg:h-auto bg-white dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent ml-auto flex flex-col border-l border-gray-200 dark:border-gray-800">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-gray-900 dark:text-white">Cart ({cartCount})</span>
            </div>
            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={() => setCartItems([])}
                  className="text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  Clear
                </button>
              )}
              <button onClick={() => setCartOpen(false)} className="lg:hidden">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <ScrollArea className="flex-1">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 text-sm text-gray-400">Cart is empty</div>
            ) : (
              <div className="p-4 space-y-3">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                    {item.image && (
                      <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatIDR(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-500 text-white hover:bg-amber-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 dark:border-gray-800 p-4 space-y-3">
              <Input
                placeholder="Customer name (optional)"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="text-sm h-9"
              />
              <Input
                placeholder="Order notes..."
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
                className="text-sm h-9"
              />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatIDR(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>PPN (8%)</span>
                  <span>{formatIDR(tax)}</span>
                </div>
                <Separator className="my-1.5" />
                <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>{formatIDR(cartTotal)}</span>
                </div>
              </div>
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleSubmitOrder}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {submitting ? 'Submitting...' : 'Submit Order'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuItemCard({ item, onAdd }: { item: any; onAdd: (item: any) => void }) {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600 transition-all hover:shadow-md group overflow-hidden">
      {item.imageUrl && (
        <div className="aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-gray-800">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}
      <CardContent className={`p-3 ${item.imageUrl ? '' : 'pt-4'}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
            {item.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
            )}
          </div>
          <button
            onClick={() => onAdd(item)}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-2">{formatIDR(item.price)}</p>
      </CardContent>
    </Card>
  );
}
