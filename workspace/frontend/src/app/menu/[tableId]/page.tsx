"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Star,
  Flame,
  Coffee,
  Leaf,
  UtensilsCrossed,
  ChefHat,
  ChevronDown,
  MapPin,
  Clock,
  Award,
  Gift,
  Loader2,
  Plus,
  Bell,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useMenuCart } from "@/hooks/useMenuCart";
import { usePublicMenu } from "@/hooks/usePublicMenu";
import { useMenuSocket } from "@/hooks/useMenuSocket";
import { formatIDR } from "@/lib/format-idr";
import { toast } from "sonner";

const categoryIcons: Record<string, any> = {
  coffee: Coffee,
  tea: Leaf,
  pastries: UtensilsCrossed,
  food: ChefHat,
};

function AnimatedCarousel({ items }: { items: any[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    intervalRef.current = setInterval(next, 4000);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, items.length, next]);

  if (items.length === 0) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, idx) => (
          <Link key={item.id} href={`/menu/item/${item.id}`} className="w-full shrink-0">
            <Card className="mx-0 border-0 shadow-md overflow-hidden rounded-2xl">
              {item.imageUrl ? (
                <div className="relative h-44">
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <Badge className="absolute left-3 top-3 bg-amber-500 text-white border-0 shadow-md">
                    {idx === 0 ? "Promo" : "Special"}
                  </Badge>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-base font-bold text-white drop-shadow-sm">{item.name}</h3>
                  </div>
                </div>
              ) : (
                <div className="relative h-44 bg-gradient-to-br from-amber-100 to-orange-100">
                  <div className="flex h-full items-center justify-center">
                    <Gift className="h-12 w-12 text-amber-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <Badge className="absolute left-3 top-3 bg-amber-500 text-white border-0 shadow-md">
                    {idx === 0 ? "Promo" : "Special"}
                  </Badge>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-base font-bold text-white drop-shadow-sm">{item.name}</h3>
                  </div>
                </div>
              )}
              <div className="px-4 pb-4 pt-3">
                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-base font-bold text-amber-600">{formatIDR(Number(item.price))}</span>
                  <span className="text-[11px] text-muted-foreground">Tap to order</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-sm">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(idx); }}
              className={`h-1.5 rounded-full transition-all ${
                idx === current ? "w-5 bg-white" : "w-1.5 bg-white/50"
              }`}
            >
              <span className="sr-only">Slide {idx + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="h-48 w-full bg-gradient-to-br from-amber-200 to-orange-200 animate-pulse" />
      <div className="p-4">
        <div className="mb-6 h-12 rounded-lg bg-muted animate-pulse" />
        <div className="mb-6 h-32 rounded-xl bg-muted animate-pulse" />
        <div className="mb-4 h-11 rounded-lg bg-muted animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 w-full rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MenuHomePage() {
  const params = useParams();
  const tableId = params.tableId as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { count: cartCount, addItem } = useMenuCart();
  const { menu, cafe, loading, error, fetchMenuByTable } = usePublicMenu();
  const businessId = cafe?.businessId || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('last_order') || '{}').businessId : null);
  const { on } = useMenuSocket(businessId);

  useEffect(() => {
    if (tableId) {
      localStorage.setItem('cafe_table_id', tableId);
      fetchMenuByTable(tableId);
    }
  }, [tableId]);

  useEffect(() => {
    if (cafe) localStorage.setItem('cafe_info', JSON.stringify(cafe));
  }, [cafe]);

  useEffect(() => {
    const unsub = on('menuItem:updated', (data: any) => {
      fetchMenuByTable(tableId);
    });
    return unsub;
  }, [on, tableId]);

  const categories = menu?.categories?.filter(c => c.isActive !== false) || [];

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [categories]);
  const firstCategoryId = categories[0]?.id || "";
  const currentCategory = categories.find(c => c.id === (selectedCategory || firstCategoryId));

  const allItems = categories.flatMap(c => (c.menuItems || []).filter(i => !i.hidden));
  const featuredItems = allItems.filter(i => i.isFeatured).slice(0, 5);
  const promoItems = allItems.filter(i => i.isSpecialOffer).slice(0, 5);
  const hasPromos = promoItems.length > 0;

  const filteredItems = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return [];
    return cat.menuItems?.filter(i => !i.hidden) || [];
  };

  const searchResults = searchQuery
    ? categories.flatMap(c => (c.menuItems || []).filter(i => !i.hidden)).filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      )
    : [];

  const visibleItems = searchQuery ? searchResults : filteredItems(currentCategory?.id || "");

  const handleQuickAdd = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.imageUrl || '',
      quantity: 1,
    });
    toast.success(`${item.name} ditambahkan!`, { duration: 1500 });
  };

  const getCategoryIcon = (cat: any) => {
    const name = cat.name?.toLowerCase() || "";
    const Icon = categoryIcons[name] || Coffee;
    return Icon;
  };

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center px-4">
          <p className="text-sm text-red-500">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => fetchMenuByTable(tableId)}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header / Cover Image */}
      <div className="relative">
        <div className="h-48 w-full overflow-hidden bg-gradient-to-br from-amber-300 to-orange-400">
          {cafe?.logo && (
            <img
              src={cafe.logo}
              alt={cafe.name}
              className="h-full w-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Cafe Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end gap-3">
            {cafe?.logo ? (
              <img
                src={cafe.logo}
                alt="Logo"
                className="h-16 w-16 rounded-full border-4 border-background object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-amber-100 shadow-lg">
                <Coffee className="h-8 w-8 text-amber-600" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{cafe?.name || "Cafe"}</h1>
              {cafe?.description && (
                <p className="text-sm text-white/80">{cafe.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground shadow-lg backdrop-blur">
              <MapPin className="h-3 w-3" />
              Table {cafe?.tableNumber || tableId}
            </div>
          </div>
        </div>

        {/* Cart Button */}
        <Link href="/menu/cart">
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/90 shadow-lg backdrop-blur hover:bg-white"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Button>
        </Link>
      </div>

      {/* Cafe Details */}
      {(cafe?.location || cafe?.hours) && (
        <div className="border-b border-border bg-card px-4 py-3">
          <div className="space-y-1 text-xs text-muted-foreground">
            {cafe?.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span>{cafe.location}</span>
              </div>
            )}
            {cafe?.hours && (
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span>{cafe.hours}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Search — original location */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 border-border/50 bg-card pl-10 pr-4 text-sm shadow-sm"
          />
        </div>

        {/* Carousels — promos + featured */}
        {categories.length > 0 && (
          <>
            {!searchQuery && hasPromos && (
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  <h2 className="text-sm font-semibold">Special Offers</h2>
                </div>
                <AnimatedCarousel items={promoItems} />
              </div>
            )}
            {!searchQuery && featuredItems.length > 0 && (
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <h2 className="text-sm font-semibold">Featured Items</h2>
                </div>
                <AnimatedCarousel items={featuredItems} />
              </div>
            )}
          </>
        )}

        {/* Sentinel — detects when sticky kicks in */}
        <div ref={sentinelRef} />

        {/* Sticky Header — pills at rest, compact dropdown when stuck */}
        {categories.length > 0 && (
          <div className={`sticky top-0 z-20 -mx-4 bg-background px-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${isStuck ? "py-2.5" : "pb-2 pt-3 mb-3"}`}>
            {isStuck ? (
              <div className="flex items-center justify-between">
                <Select value={selectedCategory || firstCategoryId} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-9 gap-2 border border-border/50 bg-card px-3 text-sm font-medium shadow-none [&>span]:flex [&>span]:items-center [&>span]:gap-2">
                    {categories.map(cat => {
                      if (cat.id !== (selectedCategory || firstCategoryId)) return null;
                      const Icon = getCategoryIcon(cat);
                      return <Icon key={cat.id} className="h-4 w-4 text-amber-500" />;
                    })}
                    <span>{currentCategory?.name || "Select"}</span>
                    <span className="text-xs text-muted-foreground">
                      {visibleItems.length}
                    </span>
                    <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center gap-2">
                          {(() => { const Icon = getCategoryIcon(cat); return <Icon className="h-3.5 w-3.5 text-muted-foreground" />; })()}
                          {cat.name}
                          <span className="text-xs text-muted-foreground">({filteredItems(cat.id).length})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Link href="/menu/cart" className="relative shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <ShoppingCart className="h-4 w-4" />
                    {cartCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Our Menu</h2>
                  <Link href="/menu/cart" className="relative">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <ShoppingCart className="h-4 w-4" />
                      {cartCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-white">
                          {cartCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                </div>
                <div className="-mx-4 overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="flex gap-2">
                    {categories.map((cat) => {
                      const isActive = cat.id === (selectedCategory || firstCategoryId);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                            isActive
                              ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                              : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
                          }`}
                        >
                          {cat.name}
                          <span className="ml-1 text-[10px] opacity-60">({filteredItems(cat.id).length})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Items */}
        {categories.length > 0 && (
          <div>

            {currentCategory && (
              <div className="space-y-3">
                {visibleItems.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No items found
                  </div>
                ) : (
                  visibleItems.map((item) => (
                    <div key={item.id} className="group relative">
                      <Link href={`/menu/item/${item.id}`}>
                        <Card className="overflow-hidden border-0 shadow-sm transition-shadow hover:shadow-md">
                          <div className="flex gap-3 p-3">
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                  <Coffee className="h-6 w-6 text-muted-foreground/50" />
                                </div>
                              )}
                              {item.soldOut && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                  <span className="text-xs font-bold text-white">Sold Out</span>
                                </div>
                              )}
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col justify-center">
                              <div className="flex items-start justify-between gap-1">
                                <h3 className={`truncate text-sm font-medium ${item.soldOut ? "text-muted-foreground line-through" : ""}`}>
                                  {item.name}
                                </h3>
                                <div className="flex shrink-0 gap-1">
                                  {item.isFeatured && (
                                    <Badge variant="outline" className="px-1.5 py-0 text-[9px] bg-green-100 text-green-700 border-green-200">
                                      <Star className="mr-0.5 h-2 w-2" />Featured
                                    </Badge>
                                  )}
                                  {item.isSpecialOffer && (
                                    <Badge variant="outline" className="px-1.5 py-0 text-[9px] bg-amber-100 text-amber-700 border-amber-200">
                                      <Gift className="mr-0.5 h-2 w-2" />Promo
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {item.description && (
                                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                  {item.description}
                                </p>
                              )}
                              <div className="mt-2 flex items-center justify-between">
                                <span className={`text-sm font-bold ${item.soldOut ? "text-muted-foreground" : "text-amber-600"}`}>
                                  {formatIDR(Number(item.price))}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                      {!item.soldOut && (
                        <div className="absolute bottom-2 right-2 flex gap-1.5">
                          <Button
                            size="icon"
                            className="h-9 w-9 rounded-full bg-amber-500 text-white shadow-md hover:bg-amber-600 active:scale-95"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuickAdd(item); }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {categories.length === 0 && !loading && (
          <div className="py-12 text-center">
            <Coffee className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">Menu is not available</p>
          </div>
        )}
      </div>

      {/* Loyalty CTA */}
      <Link href="/menu/loyalty">
        <div className="mx-4 mt-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Join our Loyalty Program</h3>
              <p className="text-xs text-white/80">Earn points with every order</p>
            </div>
            <Button size="sm" variant="secondary" className="bg-white text-amber-600 hover:bg-white/90">
              Join Now
            </Button>
          </div>
        </div>
      </Link>

      {/* Call Waiter FAB */}
      {cafe?.phoneNumber && (
        <a
          href={`https://wa.me/${cafe.phoneNumber.replace(/[^0-9]/g, '')}?text=Halo%2C%20saya%20dari%20Meja%20${cafe.tableNumber || tableId}%2C%20minta%20bantuan`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600 active:scale-95"
        >
          <Bell className="h-6 w-6" />
        </a>
      )}
    </div>
  );
}
