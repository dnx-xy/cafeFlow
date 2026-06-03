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
    <div className="elegant-carousel" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="elegant-carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {items.map((item, idx) => (
          <Link key={item.id} href={`/menu/item/${item.id}`} className="elegant-carousel-slide">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} />
            ) : (
              <div style={{ height: 180, background: 'linear-gradient(135deg, var(--menu-warm) 0%, var(--menu-warm-hover) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Gift style={{ width: 48, height: 48, color: 'var(--menu-gold-light)' }} />
              </div>
            )}
            <div className="elegant-carousel-gradient" />
            <div className="elegant-carousel-content">
              <h3>{item.name}</h3>
              <div className="price">{formatIDR(Number(item.price))}</div>
            </div>
          </Link>
        ))}
      </div>
      {items.length > 1 && (
        <div className="elegant-carousel-dots">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(idx); }}
              className={`elegant-carousel-dot ${idx === current ? 'active' : ''}`}
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
    <div className="min-h-screen pb-24" style={{ background: 'var(--menu-bg)' }}>
      <div style={{ height: 240, background: 'linear-gradient(135deg, #e8d5a3 0%, #c9a96e 100%)', opacity: 0.3 }} />
      <div style={{ padding: 16 }}>
        <div className="elegant-search" style={{ marginTop: 16 }}>
          <div style={{ height: 48, borderRadius: 'var(--menu-radius)', background: 'var(--menu-card)', opacity: 0.5 }} />
        </div>
        <div className="elegant-carousel" style={{ height: 180, background: 'var(--menu-card)', opacity: 0.4, borderRadius: 'var(--menu-radius)', marginBottom: 24 }} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 38, width: 100, borderRadius: 100, background: 'var(--menu-card)', opacity: 0.4 }} />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 100, borderRadius: 'var(--menu-radius)', background: 'var(--menu-card)', opacity: 0.5 }} />
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
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--menu-bg)' }}>
        <div className="text-center px-4">
          <Coffee style={{ width: 48, height: 48, margin: '0 auto 16px', color: 'var(--menu-text-light)', opacity: 0.4 }} />
          <p style={{ fontSize: 14, color: 'var(--menu-text-muted)', marginBottom: 20 }}>{error}</p>
          <button
            onClick={() => fetchMenuByTable(tableId)}
            style={{
              padding: '10px 24px',
              borderRadius: 100,
              background: 'var(--menu-charcoal)',
              color: '#ffffff',
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--menu-bg)' }}>
      {/* Elegant Header */}
      <div className="elegant-header">
        <div className="elegant-header-bg">
          {cafe?.logo ? (
            <img src={cafe.logo} alt={cafe.name} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2d2a27 0%, #4a4540 100%)' }} />
          )}
          <div className="elegant-header-overlay" />
        </div>

        <div className="elegant-header-content">
          <div className="elegant-brand">
            {cafe?.logo ? (
              <img src={cafe.logo} alt="Logo" className="elegant-logo" />
            ) : (
              <div className="elegant-logo-placeholder">
                <Coffee />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <h1 className="elegant-cafe-name">{cafe?.name || "Cafe"}</h1>
              {cafe?.description && (
                <p className="elegant-cafe-desc">{cafe.description}</p>
              )}
            </div>
            <div className="elegant-table-badge">
              <MapPin />
              Table {cafe?.tableNumber || tableId}
            </div>
          </div>
        </div>

        {/* Cart FAB */}
        <Link href="/menu/cart" className="elegant-cart-fab">
          <ShoppingCart />
          {cartCount > 0 && (
            <span className="elegant-cart-badge">{cartCount}</span>
          )}
        </Link>
      </div>

      {/* Cafe Detail Bar */}
      {(cafe?.location || cafe?.hours) && (
        <div className="elegant-detail-bar">
          {cafe?.location && (
            <div className="elegant-detail-item">
              <MapPin />
              <span>{cafe.location}</span>
            </div>
          )}
          {cafe?.hours && (
            <div className="elegant-detail-item">
              <Clock />
              <span>{cafe.hours}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div style={{ padding: '16px 20px' }}>
        {/* Search */}
        <div className="elegant-search">
          <Search />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Carousels */}
        {categories.length > 0 && (
          <>
            {!searchQuery && hasPromos && (
              <div style={{ marginBottom: 24 }}>
                <div className="elegant-section-header">
                  <div className="icon-circle"><Award /></div>
                  <h2>Special Offers</h2>
                </div>
                <AnimatedCarousel items={promoItems} />
              </div>
            )}
            {!searchQuery && featuredItems.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div className="elegant-section-header">
                  <div className="icon-circle"><Star /></div>
                  <h2>Featured Items</h2>
                </div>
                <AnimatedCarousel items={featuredItems} />
              </div>
            )}
          </>
        )}

        {/* Sentinel */}
        <div ref={sentinelRef} />

        {/* Category Navigation */}
        {categories.length > 0 && (
          <div className={`elegant-sticky-header ${isStuck ? 'scrolled' : ''}`}>
            <div className="elegant-section-header" style={{ marginBottom: 12 }}>
              <h2 style={{ fontSize: 16 }}>Our Menu</h2>
            </div>
            <div className="elegant-category-pills">
              {categories.map((cat) => {
                const active = cat.id === (selectedCategory || firstCategoryId);
                const Icon = getCategoryIcon(cat);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`elegant-category-pill ${active ? 'active' : ''}`}
                  >
                    <Icon />
                    {cat.name}
                    <span className="count">({filteredItems(cat.id).length})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Items */}
        {categories.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {currentCategory && (
              <div className="space-y-3">
                {visibleItems.length === 0 ? (
                  <div className="elegant-empty">
                    <Coffee />
                    <p>No items found</p>
                  </div>
                ) : (
                  visibleItems.map((item) => (
                    <div key={item.id} className="elegant-item-card">
                      <Link href={`/menu/item/${item.id}`} style={{ display: 'contents' }}>
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="elegant-item-image" />
                        ) : (
                          <div className="elegant-item-image-placeholder">
                            <Coffee />
                          </div>
                        )}
                        <div className="elegant-item-info">
                          <div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                              <h3 className="elegant-item-name">{item.name}</h3>
                              <div className="elegant-item-badges">
                                {item.isFeatured && (
                                  <span className="elegant-badge featured">Featured</span>
                                )}
                                {item.isSpecialOffer && (
                                  <span className="elegant-badge promo">Promo</span>
                                )}
                              </div>
                            </div>
                            {item.description && (
                              <p className="elegant-item-desc">{item.description}</p>
                            )}
                          </div>
                          <div className="elegant-item-footer">
                            <span className="elegant-item-price">{formatIDR(Number(item.price))}</span>
                          </div>
                        </div>
                      </Link>
                      {!item.soldOut && (
                        <button
                          className="elegant-item-add"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuickAdd(item); }}
                        >
                          <Plus />
                        </button>
                      )}
                      {item.soldOut && (
                        <div style={{
                          position: 'absolute', inset: 0, borderRadius: 'var(--menu-radius)',
                          background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(2px)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
                        }}>
                          <span style={{
                            padding: '4px 14px', borderRadius: 100, background: 'var(--menu-charcoal)',
                            color: '#fff', fontSize: 12, fontWeight: 600,
                          }}>Sold Out</span>
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
          <div className="elegant-empty" style={{ paddingTop: 80 }}>
            <Coffee />
            <p>Menu is not available</p>
          </div>
        )}
      </div>

      {/* Loyalty CTA */}
      <Link href="/menu/loyalty">
        <div className="elegant-loyalty-cta">
          <div>
            <h3>Join our Loyalty Program</h3>
            <p>Earn points with every order</p>
          </div>
          <button>Join Now</button>
        </div>
      </Link>

      {/* Upsell Popup */}
      {upsell && (
        <div className="elegant-upsell">
          <div className="elegant-upsell-card">
            <div className="elegant-upsell-icon">
              <Star />
            </div>
            <div className="elegant-upsell-text">
              <p>{upsell.rule.suggestion.description}</p>
              <span>Add to your order?</span>
            </div>
            <div className="elegant-upsell-actions">
              <button className="skip" onClick={() => setUpsell(null)}>Skip</button>
              <button className="add" onClick={handleUpsellAdd}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* FABs */}
      <div className="elegant-fabs">
        {cafe?.phoneNumber && (
          <>
            <button className="elegant-fab wa" onClick={handleWaOrder}>
              <MessageCircle />
              {cartCount > 0 && (
                <span className="elegant-fab-badge">{cartCount}</span>
              )}
            </button>
            <a
              href={`https://wa.me/${cafe.phoneNumber.replace(/[^0-9]/g, '')}?text=Halo%2C%20saya%20dari%20Meja%20${cafe.tableNumber || tableId}%2C%20minta%20bantuan`}
              target="_blank"
              rel="noopener noreferrer"
              className="elegant-fab help"
            >
              <Bell />
            </a>
          </>
        )}
      </div>
    </div>
  );
}
