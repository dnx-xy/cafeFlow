"use client";

import { useState, useEffect } from "react";
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
  ChevronRight,
  MapPin,
  Clock,
  Award,
  Gift,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMenuCart } from "@/hooks/useMenuCart";
import { usePublicMenu } from "@/hooks/usePublicMenu";
import { useMenuSocket } from "@/hooks/useMenuSocket";

const categoryIcons: Record<string, any> = {
  coffee: Coffee,
  tea: Leaf,
  pastries: UtensilsCrossed,
  food: ChefHat,
};

function getTagIcon(tag: string) {
  switch (tag) {
    case "bestseller": return <Flame className="h-3 w-3" />;
    case "new": return <Star className="h-3 w-3" />;
    case "promo": return <Gift className="h-3 w-3" />;
    default: return null;
  }
}

function getTagStyle(tag: string) {
  switch (tag) {
    case "bestseller": return "bg-orange-100 text-orange-700 border-orange-200";
    case "new": return "bg-green-100 text-green-700 border-green-200";
    case "promo": return "bg-amber-100 text-amber-700 border-amber-200";
    default: return "";
  }
}

function formatTagName(tag: string) {
  switch (tag) {
    case "bestseller": return "Bestseller";
    case "new": return "New";
    case "promo": return "Promo";
    default: return tag;
  }
}

export default function MenuHomePage() {
  const params = useParams();
  const tableId = params.tableId as string;
  const [searchQuery, setSearchQuery] = useState("");
  const { count: cartCount } = useMenuCart();
  const { menu, cafe, loading, error, fetchMenuByTable } = usePublicMenu();
  const businessId = cafe?.businessId || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('last_order') || '{}').businessId : null);
  const { on } = useMenuSocket(businessId);

  useEffect(() => {
    if (tableId) fetchMenuByTable(tableId);
  }, [tableId]);

  useEffect(() => {
    const unsub = on('menuItem:updated', (data: any) => {
      fetchMenuByTable(tableId);
    });
    return unsub;
  }, [on, tableId]);

  const categories = menu?.categories?.filter(c => c.isActive !== false) || [];

  const allItems = categories.flatMap(c => (c.menuItems || []).filter(i => !i.hidden));
  const featuredItems = allItems.filter(i => i.isFeatured).slice(0, 5);
  const promoItems = allItems.filter(i => i.isSpecialOffer).slice(0, 5);
  const hasPromos = promoItems.length > 0;

  const filteredItems = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return [];
    const items = cat.menuItems?.filter(i => !i.hidden) || [];
    if (!searchQuery) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
  };

  const getCategoryIcon = (cat: any) => {
    const name = cat.name?.toLowerCase() || "";
    const Icon = categoryIcons[name] || Coffee;
    return Icon;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-amber-500" />
          <p className="mt-2 text-sm text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              {cafe?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{cafe.location}</span>
                </div>
              )}
              {cafe?.hours && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{cafe.hours}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 border-border/50 bg-card pl-10 pr-4 text-sm shadow-sm"
          />
        </div>

        {/* Promotions Section */}
        {!searchQuery && hasPromos && (
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-semibold">Special Offers</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {promoItems.map((item) => (
                <Link key={item.id} href={`/menu/item/${item.id}`}>
                  <Card className="min-w-[220px] flex-shrink-0 overflow-hidden border-0 shadow-md transition-transform hover:scale-[1.02]">
                    <div className={item.imageUrl ? "relative h-24" : "flex h-24 items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100"}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <Gift className="h-8 w-8 text-amber-400" />
                      )}
                      <Badge className="absolute left-2 top-2 bg-amber-500 text-white hover:bg-amber-600">
                        Special Offer
                      </Badge>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="text-sm font-semibold">{item.name}</h3>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                      )}
                      <p className="mt-1 text-sm font-bold text-amber-600">${Number(item.price).toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Featured Section */}
        {!searchQuery && featuredItems.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-semibold">Featured Items</h2>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {featuredItems.map((item) => (
                <Link key={item.id} href={`/menu/item/${item.id}`}>
                  <Card className="min-w-[160px] flex-shrink-0 overflow-hidden border-0 shadow-md transition-transform hover:scale-[1.02]">
                    <div className={item.imageUrl ? "relative h-24" : "flex h-24 items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100"}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <Star className="h-8 w-8 text-amber-300" />
                      )}
                      {item.isSpecialOffer && (
                        <Badge className="absolute left-2 top-2 text-[10px] bg-amber-100 text-amber-700 border-amber-200">
                          <span className="flex items-center gap-1"><Gift className="h-3 w-3" />Promo</span>
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                      )}
                      <p className="mt-1 text-sm font-bold text-amber-600">${Number(item.price).toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories & Menu */}
        {categories.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-semibold">Our Menu</h2>
            <Tabs defaultValue={categories[0]?.id} className="w-full">
              <TabsList className="mb-4 h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category);
                  return (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="h-9 rounded-full border border-border/50 bg-card px-4 data-[state=active]:border-amber-500 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                    >
                      <Icon className="mr-1.5 h-3.5 w-3.5" />
                      {category.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-0">
                  {filteredItems(category.id).length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No items found
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredItems(category.id).map((item) => (
                        <Link key={item.id} href={`/menu/item/${item.id}`}>
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
                              <div className="flex flex-1 flex-col justify-center">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className={`text-sm font-medium ${item.soldOut ? "text-muted-foreground line-through" : ""}`}>
                                    {item.name}
                                  </h3>
                                  <div className="flex gap-1">
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
                                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                                <div className="mt-2 flex items-center justify-between">
                                  <span className={`text-sm font-bold ${item.soldOut ? "text-muted-foreground" : "text-amber-600"}`}>
                                    ${Number(item.price).toFixed(2)}
                                  </span>
                                  {!item.soldOut && (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white"
                                    >
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
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
    </div>
  );
}
