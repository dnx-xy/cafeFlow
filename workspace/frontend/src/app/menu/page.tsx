"use client";

import { useState } from "react";
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
  ChevronRight,
  MapPin,
  Clock,
  Award,
} from "lucide-react";

const cafeInfo = {
  name: "Brew Haven Coffee",
  description: "Artisan coffee & cozy vibes",
  location: "123 Coffee Street, Downtown",
  hours: "7:00 AM - 9:00 PM",
  tableNumber: 12,
  coverImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop",
  logo: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop",
};

const categories = [
  { id: "coffee", name: "Coffee", icon: Coffee },
  { id: "tea", name: "Tea", icon: Leaf },
  { id: "pastries", name: "Pastries", icon: UtensilsCrossed },
  { id: "food", name: "Food", icon: ChefHat },
];

const featuredItems = [
  { id: "1", name: "Signature Latte", description: "Rich espresso with velvety steamed milk", price: 5.50, image: "https://images.unsplash.com/photo-1570968992193-6e584a94f04a?w=400&auto=format&fit=crop", tags: ["bestseller"] },
  { id: "2", name: "Cold Brew", description: "Smooth 18-hour steeped coffee", price: 4.50, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop", tags: ["bestseller"] },
  { id: "3", name: "Matcha Latte", description: "Premium Japanese matcha with oat milk", price: 6.00, image: "https://images.unsplash.com/photo-1515825838458-f2a94b20105a?w=400&auto=format&fit=crop", tags: ["new"] },
];

const promotions = [
  { id: "promo1", title: "Happy Hour Deal", description: "20% off all pastries after 4 PM", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop", badge: "Limited Time" },
  { id: "promo2", title: "Buy 5 Get 1 Free", description: "Collect stamps with every coffee", image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&auto=format&fit=crop", badge: "Loyalty" },
];

const menuItems: Record<string, Array<{ id: string; name: string; description: string; price: number; image: string; tags: string[] }>> = {
  coffee: [
    { id: "1", name: "Signature Latte", description: "Rich espresso with velvety steamed milk", price: 5.50, image: "https://images.unsplash.com/photo-1570968992193-6e584a94f04a?w=400&auto=format&fit=crop", tags: ["bestseller"] },
    { id: "2", name: "Cold Brew", description: "Smooth 18-hour steeped coffee", price: 4.50, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop", tags: ["bestseller"] },
    { id: "4", name: "Espresso", description: "Bold and intense single shot", price: 3.00, image: "https://images.unsplash.com/photo-1510707577719-ae7c14805b3a?w=400&auto=format&fit=crop", tags: [] },
    { id: "5", name: "Cappuccino", description: "Equal parts espresso, steamed milk, foam", price: 5.00, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&auto=format&fit=crop", tags: [] },
    { id: "6", name: "Americano", description: "Espresso with hot water", price: 3.50, image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&auto=format&fit=crop", tags: [] },
    { id: "7", name: "Mocha", description: "Espresso with chocolate and steamed milk", price: 5.75, image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&auto=format&fit=crop", tags: ["promo"] },
  ],
  tea: [
    { id: "3", name: "Matcha Latte", description: "Premium Japanese matcha with oat milk", price: 6.00, image: "https://images.unsplash.com/photo-1515825838458-f2a94b20105a?w=400&auto=format&fit=crop", tags: ["new"] },
    { id: "8", name: "Earl Grey", description: "Classic bergamot black tea", price: 3.50, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop", tags: [] },
    { id: "9", name: "Chai Latte", description: "Spiced tea with steamed milk", price: 5.00, image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop", tags: [] },
    { id: "10", name: "Green Tea", description: "Refreshing sencha green tea", price: 3.00, image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&auto=format&fit=crop", tags: [] },
    { id: "11", name: "Jasmine Tea", description: "Fragrant jasmine green tea", price: 3.50, image: "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=400&auto=format&fit=crop", tags: ["new"] },
  ],
  pastries: [
    { id: "12", name: "Butter Croissant", description: "Flaky, buttery French pastry", price: 3.75, image: "https://images.unsplash.com/photo-1555507036-ab1f40388085?w=400&auto=format&fit=crop", tags: ["bestseller"] },
    { id: "13", name: "Almond Croissant", description: "Croissant with almond filling", price: 4.50, image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&auto=format&fit=crop", tags: [] },
    { id: "14", name: "Chocolate Muffin", description: "Rich chocolate chip muffin", price: 3.50, image: "https://images.unsplash.com/photo-1607958996333-b6ef77529a8e?w=400&auto=format&fit=crop", tags: [] },
    { id: "15", name: "Cinnamon Roll", description: "Warm roll with cream cheese frosting", price: 4.25, image: "https://images.unsplash.com/photo-1509365089765-882415aba772?w=400&auto=format&fit=crop", tags: [] },
    { id: "16", name: "Blueberry Scone", description: "Fresh blueberry baked scone", price: 3.25, image: "https://images.unsplash.com/photo-1587080413959-06b859fb107d?w=400&auto=format&fit=crop", tags: [] },
  ],
  food: [
    { id: "17", name: "Avocado Toast", description: "Sourdough with smashed avocado", price: 9.50, image: "https://images.unsplash.com/photo-1588137372308-15f75323ca8d?w=400&auto=format&fit=crop", tags: ["bestseller"] },
    { id: "18", name: "Breakfast Sandwich", description: "Egg, cheese, bacon on brioche", price: 8.50, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop", tags: [] },
    { id: "19", name: "Acai Bowl", description: "Acai with granola and fresh fruit", price: 11.00, image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&auto=format&fit=crop", tags: ["new"] },
    { id: "20", name: "Quiche Lorraine", description: "Savory bacon and cheese quiche", price: 7.50, image: "https://images.unsplash.com/photo-1533358160823-753c169c7a2c?w=400&auto=format&fit=crop", tags: [] },
  ],
};

export default function MenuHomePage() {
  const params = useParams();
  const tableId = params.tableId || "12";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCat, setActiveCat] = useState("coffee");
  const [cartCount] = useState(2);

  const filteredItems = (category: string) => {
    if (!searchQuery) return menuItems[category] || [];
    return (menuItems[category] || []).filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const tagStyle = (tag: string) => {
    switch (tag) {
      case "bestseller": return { bg: "var(--menu-warm)", color: "var(--menu-gold-dark)" };
      case "new": return { bg: "#f0fdf4", color: "#15803d" };
      default: return { bg: "var(--menu-card-border)", color: "var(--menu-text-light)" };
    }
  };

  const tagName = (tag: string) => {
    switch (tag) {
      case "bestseller": return "Bestseller";
      case "new": return "New";
      default: return tag;
    }
  };

  const card: React.CSSProperties = {
    background: 'var(--menu-card)', borderRadius: 14,
    border: '1px solid var(--menu-card-border)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--menu-bg)' }}>
      <div className="elegant-header" style={{ minHeight: 200, maxHeight: 220 }}>
        <div className="elegant-header-bg">
          <img src={cafeInfo.coverImage} alt={cafeInfo.name} />
          <div className="elegant-header-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <img src={cafeInfo.logo} alt="Logo" style={{ width: 60, height: 60, borderRadius: '50%', border: '3px solid var(--menu-card)', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />
            <div style={{ flex: 1 }}>
              <h1 className="elegant-cafe-name">{cafeInfo.name}</h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{cafeInfo.description}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 500, color: 'var(--menu-charcoal)' }}>
              <MapPin style={{ width: 12, height: 12 }} />
              Table {tableId}
            </div>
          </div>
        </div>
        <Link href="/menu/cart" style={{ position: 'absolute', top: 16, right: 16, zIndex: 3 }}>
          <button className="elegant-cart-fab" style={{ position: 'static' }}>
            <ShoppingCart />
            {cartCount > 0 && <span className="elegant-cart-badge">{cartCount}</span>}
          </button>
        </Link>
      </div>

      <div style={{ borderBottom: '1px solid var(--menu-card-border)', padding: '10px 16px', background: 'var(--menu-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--menu-text-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin style={{ width: 14, height: 14 }} /><span>{cafeInfo.location}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock style={{ width: 14, height: 14 }} /><span>{cafeInfo.hours}</span></div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--menu-text-light)' }} />
          <input
            type="text" placeholder="Search menu..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', height: 46, padding: '0 16px 0 42px', borderRadius: 14, border: '1.5px solid var(--menu-card-border)', background: 'var(--menu-card)', outline: 'none', fontSize: 14, color: 'var(--menu-charcoal)' }}
          />
        </div>

        {!searchQuery && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Award style={{ width: 16, height: 16, color: 'var(--menu-gold)' }} />
              <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--menu-charcoal)' }}>Special Offers</h2>
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {promotions.map(promo => (
                <div key={promo.id} style={{ minWidth: 260, flexShrink: 0, ...card }}>
                  <div style={{ height: 96, position: 'relative', overflow: 'hidden' }}>
                    <img src={promo.image} alt={promo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', left: 8, top: 8, padding: '3px 8px', borderRadius: 100, background: 'var(--menu-gold)', color: '#fff', fontSize: 10, fontWeight: 600 }}>{promo.badge}</span>
                  </div>
                  <div style={{ padding: 12 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--menu-charcoal)' }}>{promo.title}</h3>
                    <p style={{ fontSize: 12, color: 'var(--menu-text-light)' }}>{promo.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!searchQuery && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star style={{ width: 16, height: 16, color: 'var(--menu-gold)' }} />
                <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--menu-charcoal)' }}>Featured Items</h2>
              </div>
              <Link href="/menu?category=all" style={{ fontSize: 12, color: 'var(--menu-gold-dark)', textDecoration: 'none' }}>View all</Link>
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {featuredItems.map(item => (
                <Link key={item.id} href={`/menu/item/${item.id}`} style={{ textDecoration: 'none', minWidth: 150, flexShrink: 0 }}>
                  <div style={card}>
                    <div style={{ height: 88, position: 'relative', overflow: 'hidden' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {item.tags.map(tag => (
                        <span key={tag} style={{ position: 'absolute', left: 6, top: 6, padding: '2px 6px', borderRadius: 100, fontSize: 9, fontWeight: 500, ...tagStyle(tag) }}>{tagName(tag)}</span>
                      ))}
                    </div>
                    <div style={{ padding: 10 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--menu-charcoal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--menu-text-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--menu-gold)', marginTop: 4 }}>${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--menu-charcoal)', marginBottom: 12 }}>Our Menu</h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCat === cat.id;
              return (
                <button key={cat.id} onClick={() => setActiveCat(cat.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '8px 16px', borderRadius: 100,
                    border: `1.5px solid ${isActive ? 'var(--menu-gold)' : 'var(--menu-card-border)'}`,
                    background: isActive ? 'var(--menu-gold)' : 'var(--menu-card)',
                    color: isActive ? '#fff' : 'var(--menu-text-muted)',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon style={{ width: 14, height: 14 }} />
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredItems(activeCat).map(item => (
              <Link key={item.id} href={`/menu/item/${item.id}`} style={{ textDecoration: 'none' }}>
                <div className="elegant-item-card" style={{ padding: 12, display: 'flex', gap: 12 }}>
                  <div style={{ width: 80, height: 80, flexShrink: 0, borderRadius: 10, overflow: 'hidden' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--menu-charcoal)' }}>{item.name}</h3>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {item.tags?.map(tag => (
                          <span key={tag} style={{ padding: '1px 6px', borderRadius: 100, fontSize: 9, fontWeight: 500, ...tagStyle(tag) }}>{tagName(tag)}</span>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--menu-text-light)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.description}</p>
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="elegant-item-price" style={{ fontSize: 14 }}>${item.price.toFixed(2)}</span>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--menu-warm)', color: 'var(--menu-gold-dark)' }}>
                        <ChevronRight style={{ width: 16, height: 16 }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {filteredItems(activeCat).length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', fontSize: 13, color: 'var(--menu-text-light)' }}>No items found</div>
            )}
          </div>
        </div>
      </div>

      <Link href="/menu/loyalty" style={{ textDecoration: 'none' }}>
        <div style={{ margin: '16px 16px 0', borderRadius: 12, background: 'var(--menu-charcoal)', padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Join our Loyalty Program</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Earn points with every order</p>
            </div>
            <button style={{ padding: '8px 16px', borderRadius: 100, background: '#fff', color: 'var(--menu-charcoal)', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Join Now</button>
          </div>
        </div>
      </Link>
    </div>
  );
}
