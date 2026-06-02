"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Star,
  Coffee,
  Leaf,
  UtensilsCrossed,
  ChefHat,
  MapPin,
  Clock,
  Award,
  Gift,
  Loader2,
  Plus,
  MessageCircle,
  Bell,
  ChevronDown,
  CupSoda,
  BottleWine,
  Beer,
  Soup,
  Salad,
  Sandwich,
  Pizza,
  Beef,
  Fish,
  Drumstick,
  Egg,
  EggFried,
  IceCreamCone,
  IceCreamBowl,
  Cake,
  CakeSlice,
  Cookie,
  Croissant,
  Cherry,
  Apple,
  Banana,
  Grape,
  Citrus,
  Milk,
  GlassWater,
  Carrot,
  Flame,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useMenuCart } from "@/hooks/useMenuCart";
import { usePublicMenu } from "@/hooks/usePublicMenu";
import { usePublicOrder } from "@/hooks/usePublicOrder";
import { findUpsell, UpsellRule } from "@/lib/upsell-rules";
import { formatIDR } from "@/lib/format-idr";
import { toast } from "sonner";
import { generateWhatsAppMessage } from "@/lib/whatsapp";

const categoryIcons: Record<string, any> = {
  // Coffee & Espresso
  coffee: Coffee,
  espresso: Coffee,
  latte: Coffee,
  cappuccino: Coffee,
  americano: Coffee,
  mocha: Coffee,
  macchiato: Coffee,
  flatwhite: Coffee,
  kopi: Coffee,
  
  // Tea
  tea: CupSoda,
  teh: CupSoda,
  matcha: CupSoda,
  greentea: Leaf,
  blacktea: CupSoda,
  thaitea: CupSoda,
  
  // Juices & Smoothies
  juice: GlassWater,
  jus: GlassWater,
  smoothie: CupSoda,
  blend: CupSoda,
  milkshake: Milk,
  
  // Soft Drinks & Water
  soda: CupSoda,
  softdrink: CupSoda,
  water: GlassWater,
  air: GlassWater,
  minuman: CupSoda,
  beverage: CupSoda,
  drink: CupSoda,
  
  // Alcoholic
  beer: Beer,
  wine: BottleWine,
  cocktail: GlassWater,
  alcohol: BottleWine,
  
  // Rice & Noodles
  rice: Soup,
  nasi: Soup,
  noodle: Soup,
  mie: Soup,
  noodles: Soup,
  kwetiau: Soup,
  bihun: Soup,
  pasta: Soup,
  spaghetti: Soup,
  ramen: Soup,
  udon: Soup,
  
  // Indonesian Specials
  sate: Beef,
  satay: Beef,
  bakso: Soup,
  gadogado: Salad,
  rendang: Beef,
  gulai: Soup,
  soto: Soup,
  sop: Soup,
  ayam: Drumstick,
  chicken: Drumstick,
  
  // Western
  burger: Sandwich,
  pizza: Pizza,
  steak: Beef,
  beef: Beef,
  lamb: Beef,
  
  // Seafood
  fish: Fish,
  seafood: Fish,
  shrimp: Fish,
  squid: Fish,
  
  // Breakfast
  breakfast: Egg,
  pancake: Cake,
  waffle: Cake,
  toast: Croissant,
  
  // Snacks & Appetizers
  snack: UtensilsCrossed,
  appetizer: UtensilsCrossed,
  springroll: UtensilsCrossed,
  lumpia: UtensilsCrossed,
  
  // Desserts
  dessert: IceCreamCone,
  icecream: IceCreamCone,
  cake: Cake,
  pastry: Croissant,
  pastryshop: Croissant,
  roti: Croissant,
  bread: Croissant,
  cookie: Cookie,
  kue: CakeSlice,
  
  // Salads & Healthy
  salad: Salad,
  healthy: Carrot,
  vegan: Leaf,
  vegetarian: Leaf,
  
  // Fruits
  fruit: Apple,
  buah: Apple,
  
  // Spicy
  spicy: Flame,
  pedas: Flame,
  sambal: Flame,
  
  // Default
  food: ChefHat,
  dishes: UtensilsCrossed,
  maincourse: UtensilsCrossed,
  menu: ChefHat,
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
      <div className="h-52 w-full bg-gradient-to-br from-amber-200 to-orange-200 animate-pulse" />
      <div className="p-4">
        <div className="mb-6 h-12 rounded-lg bg-muted animate-pulse" />
        <div className="mb-6 h-32 rounded-xl bg-muted animate-pulse" />
        <div className="mb-4 h-11 rounded-lg bg-muted animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 w-full rounded-xl bg-muted animate-pulse" />
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
  const [upsell, setUpsell] = useState<{ item: any; rule: UpsellRule } | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { count: cartCount, items: cartItems, addItem } = useMenuCart();
  const { menu, cafe, loading, error, fetchMenuByTable } = usePublicMenu();
  const { submitOrder } = usePublicOrder();
  const businessId = cafe?.businessId || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('last_order') || '{}').businessId : null);

  useEffect(() => {
    if (tableId) {
      localStorage.setItem('cafe_table_id', tableId);
      fetchMenuByTable(tableId);
    }
  }, [tableId]);

  useEffect(() => {
    if (cafe) localStorage.setItem('cafe_info', JSON.stringify(cafe));
  }, [cafe]);

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

    const rule = findUpsell(item.name);
    if (rule) {
      setUpsell({ item, rule });
    }
  };

  const handleUpsellAdd = () => {
    if (!upsell) return;
    addItem({
      id: `${upsell.item.id}-upsell-${upsell.rule.suggestion.name}`,
      name: `${upsell.item.name} + ${upsell.rule.suggestion.name}`,
      price: upsell.item.price + upsell.rule.suggestion.priceAdjustment,
      image: upsell.item.imageUrl || '',
      quantity: 1,
    });
    toast.success(`${upsell.rule.suggestion.name} ditambahkan!`, { duration: 1500 });
    setUpsell(null);
  };

  const handleWaOrder = async () => {
    if (cartItems.length === 0) {
      const url = generateWhatsAppMessage([], cafe?.tableNumber || tableId, '', cafe?.name || 'Cafe', cafe?.phoneNumber);
      window.open(url, '_blank');
      return;
    }
    try {
      await submitOrder({
        tableId,
        items: cartItems.map(i => ({
          menuItemId: i.id,
          quantity: i.quantity,
          notes: i.customization ? Object.values(i.customization).filter(Boolean).join(', ') : '',
          options: [],
        })),
        notes: '',
        paymentMethod: 'WA_TRANSFER',
        orderType: 'WHATSAPP',
      });
      const url = generateWhatsAppMessage(cartItems, cafe?.tableNumber || tableId, '', cafe?.name || 'Cafe', cafe?.phoneNumber);
      window.open(url, '_blank');
      toast.success("Order sent via WhatsApp!");
    } catch {
      const url = generateWhatsAppMessage(cartItems, cafe?.tableNumber || tableId, '', cafe?.name || 'Cafe', cafe?.phoneNumber);
      window.open(url, '_blank');
    }
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
      {/* Header */}
      <div className="relative">
        <div className="h-52 w-full overflow-hidden bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500">
          {cafe?.logo && (
            <img
              src={cafe.logo}
              alt={cafe.name}
              className="h-full w-full object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </div>

        {/* Cafe Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end gap-3">
            {cafe?.logo ? (
              <img
                src={cafe.logo}
                alt="Logo"
                className="h-16 w-16 rounded-full border-[3px] border-white/80 object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-white/80 bg-white/20 shadow-lg backdrop-blur-sm">
                <Coffee className="h-8 w-8 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold leading-tight text-white drop-shadow-sm">{cafe?.name || "Cafe"}</h1>
              {cafe?.description && (
                <p className="mt-0.5 text-sm leading-snug text-white/80">{cafe.description}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-md backdrop-blur">
              <MapPin className="h-3 w-3 text-amber-500" />
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

      {/* Main Content */}
      <div className="px-4 pb-4 pt-5">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 rounded-xl border-border/50 bg-card pl-10 pr-4 text-sm shadow-sm placeholder:text-muted-foreground/60 focus-visible:ring-amber-500/20"
          />
        </div>

        {/* Carousels */}
        {categories.length > 0 && (
          <>
            {!searchQuery && hasPromos && (
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                    <Award className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <h2 className="text-sm font-semibold tracking-tight">Special Offers</h2>
                </div>
                <AnimatedCarousel items={promoItems} />
              </div>
            )}
            {!searchQuery && featuredItems.length > 0 && (
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                    <Star className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <h2 className="text-sm font-semibold tracking-tight">Featured Items</h2>
                </div>
                <AnimatedCarousel items={featuredItems} />
              </div>
            )}
          </>
        )}

        {/* Sentinel */}
        <div ref={sentinelRef} />

        {/* Sticky Header */}
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
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                            isActive
                              ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                              : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
                          }`}
                        >
                          {(() => { const Icon = getCategoryIcon(cat); return <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-muted-foreground"}`} />; })()}
                          {cat.name}
                          <span className="text-[10px] opacity-60">({filteredItems(cat.id).length})</span>
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
          <div className="mt-2">
            {currentCategory && (
              <div className="space-y-4">
                {visibleItems.length === 0 ? (
                  <div className="py-12 text-center">
                    <Coffee className="mx-auto h-12 w-12 text-muted-foreground/30" />
                    <p className="mt-3 text-sm text-muted-foreground">No items found</p>
                  </div>
                ) : (
                  visibleItems.map((item) => (
                    <div key={item.id} className="group relative">
                      <Link href={`/menu/item/${item.id}`}>
                        <Card className="overflow-hidden border border-border/40 bg-card shadow-sm transition-all duration-200 hover:border-amber-200 hover:shadow-md">
                          <div className="flex gap-4 p-4">
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                                  <Coffee className="h-8 w-8 text-amber-300" />
                                </div>
                              )}
                              {item.soldOut && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                                  <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white">Sold Out</span>
                                </div>
                              )}
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className={`truncate text-[15px] font-semibold tracking-tight ${item.soldOut ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                    {item.name}
                                  </h3>
                                  <div className="flex shrink-0 gap-1.5">
                                    {item.isFeatured && (
                                      <div className="flex h-5 items-center gap-0.5 rounded-full bg-green-100 px-2 text-[10px] font-medium text-green-700">
                                        <Star className="h-2.5 w-2.5 fill-green-700" />
                                        Featured
                                      </div>
                                    )}
                                    {item.isSpecialOffer && (
                                      <div className="flex h-5 items-center gap-0.5 rounded-full bg-amber-100 px-2 text-[10px] font-medium text-amber-700">
                                        <Gift className="h-2.5 w-2.5" />
                                        Promo
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {item.description && (
                                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground/80">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <span className={`text-[15px] font-bold ${item.soldOut ? "text-muted-foreground" : "text-amber-600"}`}>
                                  {formatIDR(Number(item.price))}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                      {!item.soldOut && (
                        <Button
                          size="icon"
                          className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:bg-amber-600 hover:shadow-amber-600/30 active:scale-95"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuickAdd(item); }}
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
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

      {/* Upsell Popup */}
      {upsell && (
        <div className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom-4 fade-in">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <Star className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{upsell.rule.suggestion.description}</p>
                  <p className="text-xs text-muted-foreground">Add to your order?</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setUpsell(null)}>
                    Skip
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 bg-amber-500 text-xs text-white hover:bg-amber-600"
                    onClick={handleUpsellAdd}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FABs */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {cafe?.phoneNumber && (
          <>
            <button
              onClick={handleWaOrder}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-amber-600 active:scale-95"
            >
              <MessageCircle className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <a
              href={`https://wa.me/${cafe.phoneNumber.replace(/[^0-9]/g, '')}?text=Halo%2C%20saya%20dari%20Meja%20${cafe.tableNumber || tableId}%2C%20minta%20bantuan`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600 active:scale-95"
            >
              <Bell className="h-6 w-6" />
            </a>
          </>
        )}
      </div>
    </div>
  );
}
