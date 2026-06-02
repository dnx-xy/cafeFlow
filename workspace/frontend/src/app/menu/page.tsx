"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Mock data
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
  {
    id: "1",
    name: "Signature Latte",
    description: "Rich espresso with velvety steamed milk",
    price: 5.50,
    image: "https://images.unsplash.com/photo-1570968992193-6e584a94f04a?w=400&auto=format&fit=crop",
    tags: ["bestseller"],
    category: "coffee",
  },
  {
    id: "2",
    name: "Cold Brew",
    description: "Smooth 18-hour steeped coffee",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop",
    tags: ["bestseller"],
    category: "coffee",
  },
  {
    id: "3",
    name: "Matcha Latte",
    description: "Premium Japanese matcha with oat milk",
    price: 6.00,
    image: "https://images.unsplash.com/photo-1515825838458-f2a94b20105a?w=400&auto=format&fit=crop",
    tags: ["new"],
    category: "tea",
  },
];

const promotions = [
  {
    id: "promo1",
    title: "Happy Hour Deal",
    description: "20% off all pastries after 4 PM",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop",
    badge: "Limited Time",
  },
  {
    id: "promo2",
    title: "Buy 5 Get 1 Free",
    description: "Collect stamps with every coffee",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&auto=format&fit=crop",
    badge: "Loyalty",
  },
];

const menuItems: Record<string, Array<{
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
}>> = {
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

function getTagIcon(tag: string) {
  switch (tag) {
    case "bestseller":
      return <Flame className="h-3 w-3" />;
    case "new":
      return <Star className="h-3 w-3" />;
    case "promo":
      return <Gift className="h-3 w-3" />;
    default:
      return null;
  }
}

function getTagStyle(tag: string) {
  switch (tag) {
    case "bestseller":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "new":
      return "bg-green-100 text-green-700 border-green-200";
    case "promo":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "";
  }
}

function formatTagName(tag: string) {
  switch (tag) {
    case "bestseller":
      return "Bestseller";
    case "new":
      return "New";
    case "promo":
      return "Promo";
    default:
      return tag;
  }
}

export default function MenuHomePage() {
  const params = useParams();
  const tableId = params.tableId || "12";
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useState(2);

  const filteredItems = (category: string) => {
    if (!searchQuery) return menuItems[category] || [];
    return (menuItems[category] || []).filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header / Cover Image */}
      <div className="relative">
        <div className="h-48 w-full overflow-hidden">
          <img
            src={cafeInfo.coverImage}
            alt={cafeInfo.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        
        {/* Cafe Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end gap-3">
            <img
              src={cafeInfo.logo}
              alt="Logo"
              className="h-16 w-16 rounded-full border-4 border-background object-cover shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{cafeInfo.name}</h1>
              <p className="text-sm text-white/80">{cafeInfo.description}</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground shadow-lg backdrop-blur">
              <MapPin className="h-3 w-3" />
              Table {tableId}
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
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{cafeInfo.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{cafeInfo.hours}</span>
            </div>
          </div>
        </div>
      </div>

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
        {!searchQuery && (
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-semibold">Special Offers</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {promotions.map((promo) => (
                <Card key={promo.id} className="min-w-[280px] flex-shrink-0 overflow-hidden border-0 shadow-md">
                  <div className="relative h-28">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="h-full w-full object-cover"
                    />
                    <Badge className="absolute left-2 top-2 bg-amber-500 text-white hover:bg-amber-600">
                      {promo.badge}
                    </Badge>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="text-sm font-semibold">{promo.title}</h3>
                    <p className="text-xs text-muted-foreground">{promo.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Featured Section */}
        {!searchQuery && (
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-semibold">Featured Items</h2>
              </div>
              <Link href="/menu?category=all" className="text-xs text-amber-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {featuredItems.map((item) => (
                <Link key={item.id} href={`/menu/item/${item.id}`}>
                  <Card className="min-w-[160px] flex-shrink-0 overflow-hidden border-0 shadow-md transition-transform hover:scale-[1.02]">
                    <div className="relative h-24">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className={`absolute left-2 top-2 text-[10px] ${getTagStyle(tag)}`}
                        >
                          <span className="flex items-center gap-1">
                            {getTagIcon(tag)}
                            {formatTagName(tag)}
                          </span>
                        </Badge>
                      ))}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                      <p className="mt-1 text-sm font-bold text-amber-600">${item.price.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories & Menu */}
        <div>
          <h2 className="mb-3 text-sm font-semibold">Our Menu</h2>
          <Tabs defaultValue="coffee" className="w-full">
            <TabsList className="mb-4 h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
              {categories.map((category) => {
                const Icon = category.icon;
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
                <div className="space-y-3">
                  {filteredItems(category.id).map((item) => (
                    <Link key={item.id} href={`/menu/item/${item.id}`}>
                      <Card className="overflow-hidden border-0 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex gap-3 p-3">
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-center">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-medium">{item.name}</h3>
                              <div className="flex gap-1">
                                {item.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className={`px-1.5 py-0 text-[9px] ${getTagStyle(tag)}`}
                                  >
                                    {formatTagName(tag)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-sm font-bold text-amber-600">
                                ${item.price.toFixed(2)}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                  {filteredItems(category.id).length === 0 && (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No items found
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
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
