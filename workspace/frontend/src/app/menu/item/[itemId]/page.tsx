"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Minus,
  Heart,
  Share2,
  Star,
  Coffee,
  Leaf,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  tags: string[];
  category: string;
  calories?: number;
  allergens?: string[];
  customization: {
    sizes: { name: string; price: number }[];
    milkOptions: string[];
    sugarLevels: string[];
    iceLevels: string[];
  };
}

const allMenuItems: Record<string, MenuItem> = {
  "1": {
    id: "1",
    name: "Signature Latte",
    description: "Rich espresso with velvety steamed milk",
    longDescription: "Our signature latte combines perfectly pulled espresso shots with silky steamed milk, creating a harmonious balance of bold coffee flavors and creamy sweetness. Topped with delicate latte art.",
    price: 5.50,
    image: "https://images.unsplash.com/photo-1570968992193-6e584a94f04a?w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    category: "coffee",
    calories: 180,
    allergens: ["Milk"],
    customization: {
      sizes: [
        { name: "Small (8oz)", price: 0 },
        { name: "Medium (12oz)", price: 0.50 },
        { name: "Large (16oz)", price: 1.00 },
      ],
      milkOptions: ["Whole Milk", "Oat Milk", "Almond Milk", "Soy Milk", "Skim Milk"],
      sugarLevels: ["0%", "25%", "50%", "75%", "100%"],
      iceLevels: ["Hot", "Iced - Light Ice", "Iced - Regular", "Iced - Extra Ice"],
    },
  },
  "2": {
    id: "2",
    name: "Cold Brew",
    description: "Smooth 18-hour steeped coffee",
    longDescription: "Slow-steeped for 18 hours in cold water, our cold brew delivers a smooth, naturally sweet coffee experience with 70% less acidity than regular coffee. Perfectly refreshing.",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    category: "coffee",
    calories: 5,
    customization: {
      sizes: [
        { name: "Small (12oz)", price: 0 },
        { name: "Medium (16oz)", price: 0.50 },
        { name: "Large (20oz)", price: 1.00 },
      ],
      milkOptions: ["None", "Splash of Milk", "Oat Milk", "Almond Milk"],
      sugarLevels: ["0%", "25%", "50%", "75%", "100%"],
      iceLevels: ["Light Ice", "Regular", "Extra Ice"],
    },
  },
  "3": {
    id: "3",
    name: "Matcha Latte",
    description: "Premium Japanese matcha with oat milk",
    longDescription: "Ceremonial-grade Japanese matcha whisked to perfection and combined with creamy oat milk. A vibrant green delight packed with antioxidants and a gentle energy boost.",
    price: 6.00,
    image: "https://images.unsplash.com/photo-1515825838458-f2a94b20105a?w=600&auto=format&fit=crop",
    tags: ["new"],
    category: "tea",
    calories: 140,
    customization: {
      sizes: [
        { name: "Small (8oz)", price: 0 },
        { name: "Medium (12oz)", price: 0.50 },
        { name: "Large (16oz)", price: 1.00 },
      ],
      milkOptions: ["Oat Milk", "Whole Milk", "Almond Milk", "Soy Milk"],
      sugarLevels: ["0%", "25%", "50%", "75%", "100%"],
      iceLevels: ["Hot", "Iced - Light Ice", "Iced - Regular", "Iced - Extra Ice"],
    },
  },
  "12": {
    id: "12",
    name: "Butter Croissant",
    description: "Flaky, buttery French pastry",
    longDescription: "Handcrafted daily using traditional French techniques, our croissants feature 27 layers of buttery, flaky pastry with a golden, crispy exterior and soft interior.",
    price: 3.75,
    image: "https://images.unsplash.com/photo-1555507036-ab1f40388085?w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    category: "pastries",
    calories: 280,
    allergens: ["Wheat", "Milk", "Eggs"],
    customization: {
      sizes: [{ name: "Regular", price: 0 }],
      milkOptions: [],
      sugarLevels: [],
      iceLevels: [],
    },
  },
  "17": {
    id: "17",
    name: "Avocado Toast",
    description: "Sourdough with smashed avocado",
    longDescription: "Thick-cut sourdough topped with perfectly ripe smashed avocado, cherry tomatoes, microgreens, and a sprinkle of everything bagel seasoning. Finished with a drizzle of olive oil.",
    price: 9.50,
    image: "https://images.unsplash.com/photo-1588137372308-15f75323ca8d?w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    category: "food",
    calories: 450,
    allergens: ["Wheat", "Gluten"],
    customization: {
      sizes: [
        { name: "Regular", price: 0 },
        { name: "Large", price: 3.00 },
      ],
      milkOptions: [],
      sugarLevels: [],
      iceLevels: [],
    },
  },
};

const getSuggestedItems = (currentId: string) => {
  const allIds = Object.keys(allMenuItems);
  const filteredIds = allIds.filter((id) => id !== currentId);
  return filteredIds.slice(0, 3).map((id) => allMenuItems[id]);
};

function getTagIcon(tag: string) {
  switch (tag) {
    case "bestseller":
      return <Star className="h-3 w-3 fill-current" />;
    case "new":
      return <Leaf className="h-3 w-3" />;
    case "promo":
      return <Coffee className="h-3 w-3" />;
    default:
      return null;
  }
}

function getTagStyle(tag: string) {
  switch (tag) {
    case "bestseller":
      return "bg-amber-500 text-white";
    case "new":
      return "bg-green-500 text-white";
    case "promo":
      return "bg-orange-500 text-white";
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

export default function ProductDetailPage() {
  const params = useParams();
  const itemId = params.itemId as string;
  const item = allMenuItems[itemId] || allMenuItems["1"];
  const suggestedItems = getSuggestedItems(itemId);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedMilk, setSelectedMilk] = useState(0);
  const [selectedSugar, setSelectedSugar] = useState(2);
  const initialIceIndex = item.category === "pastries" || item.category === "food" ? 0 : 0;
  const [selectedIce, setSelectedIce] = useState(initialIceIndex);
  const [isFavorite, setIsFavorite] = useState(false);

  const sizePrice = item.customization.sizes[selectedSize]?.price || 0;
  const totalPrice = (item.price + sizePrice) * quantity;

  const handleAddToCart = () => {
    toast.success(item.name + " added to cart!", {
      description: "Quantity: " + quantity + " | $" + totalPrice.toFixed(2),
    });
  };

  const heartClassName = isFavorite 
    ? "h-5 w-5 fill-red-500 text-red-500" 
    : "h-5 w-5";

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Product Image Header */}
      <div className="relative">
        <div className="h-72 w-full overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Navigation */}
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <Link href="/menu">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/90 shadow-lg backdrop-blur hover:bg-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/90 shadow-lg backdrop-blur hover:bg-white"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={heartClassName} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/90 shadow-lg backdrop-blur hover:bg-white"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {item.tags.map((tag) => (
            <Badge key={tag} className={getTagStyle(tag)}>
              <span className="flex items-center gap-1">
                {getTagIcon(tag)}
                {formatTagName(tag)}
              </span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold">{item.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{item.longDescription}</p>
        </div>

        {/* Nutritional Info */}
        {(item.calories || item.allergens) && (
          <div className="mb-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {item.calories && (
              <span className="rounded-full bg-muted px-3 py-1">
                {item.calories} cal
              </span>
            )}
            {item.allergens?.map((allergen) => (
              <span key={allergen} className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                Contains {allergen}
              </span>
            ))}
          </div>
        )}

        {/* Customization Options */}
        <div className="space-y-5">
          {/* Size Selection */}
          {item.customization.sizes.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">Size</h3>
              <div className="flex flex-wrap gap-2">
                {item.customization.sizes.map((size, index) => (
                  <Button
                    key={size.name}
                    variant={selectedSize === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(index)}
                    className={selectedSize === index
                      ? "rounded-full bg-amber-500 hover:bg-amber-600"
                      : "rounded-full border-border/50"}
                  >
                    {size.name}
                    {size.price > 0 && " (+$" + size.price.toFixed(2) + ")"}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Milk Selection */}
          {item.customization.milkOptions.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">Milk Option</h3>
              <div className="flex flex-wrap gap-2">
                {item.customization.milkOptions.map((milk, index) => (
                  <Button
                    key={milk}
                    variant={selectedMilk === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMilk(index)}
                    className={selectedMilk === index
                      ? "rounded-full bg-amber-500 hover:bg-amber-600"
                      : "rounded-full border-border/50"}
                  >
                    {milk}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Sugar Level */}
          {item.customization.sugarLevels.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">Sugar Level</h3>
              <div className="flex flex-wrap gap-2">
                {item.customization.sugarLevels.map((level, index) => (
                  <Button
                    key={level}
                    variant={selectedSugar === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSugar(index)}
                    className={selectedSugar === index
                      ? "rounded-full bg-amber-500 hover:bg-amber-600"
                      : "rounded-full border-border/50"}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Ice Level */}
          {item.customization.iceLevels.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">Temperature</h3>
              <div className="flex flex-wrap gap-2">
                {item.customization.iceLevels.map((level, index) => (
                  <Button
                    key={level}
                    variant={selectedIce === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedIce(index)}
                    className={selectedIce === index
                      ? "rounded-full bg-amber-500 hover:bg-amber-600"
                      : "rounded-full border-border/50"}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suggested Items */}
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold">You might also like</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {suggestedItems.map((suggestedItem) => (
              <Link key={suggestedItem.id} href={"/menu/item/" + suggestedItem.id}>
                <Card className="min-w-[140px] flex-shrink-0 overflow-hidden border-0 shadow-sm transition-shadow hover:shadow-md">
                  <div className="h-24 overflow-hidden">
                    <img
                      src={suggestedItem.image}
                      alt={suggestedItem.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-2">
                    <h4 className="text-xs font-medium line-clamp-1">{suggestedItem.name}</h4>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                      {suggestedItem.description}
                    </p>
                    <p className="mt-1 text-xs font-bold text-amber-600">
                      ${suggestedItem.price.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-border/50"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-lg font-semibold">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-border/50"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
            onClick={handleAddToCart}
          >
            <span className="flex flex-col items-start">
              <span className="text-xs opacity-80">Add to Cart</span>
              <span className="text-base font-bold">${totalPrice.toFixed(2)}</span>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
