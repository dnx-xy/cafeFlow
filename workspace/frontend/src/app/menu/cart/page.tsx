"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Coffee,
  UtensilsCrossed,
  ChefHat,
  Leaf,
  CreditCard,
  Clock,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  customization: {
    size?: string;
    milk?: string;
    sugar?: string;
    ice?: string;
  };
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "Signature Latte",
    description: "Rich espresso with velvety steamed milk",
    price: 5.50,
    image: "https://images.unsplash.com/photo-1570968992193-6e584a94f04a?w=200&auto=format&fit=crop",
    quantity: 2,
    customization: {
      size: "Medium (12oz)",
      milk: "Oat Milk",
      sugar: "50%",
      ice: "Hot",
    },
  },
  {
    id: "12",
    name: "Butter Croissant",
    description: "Flaky, buttery French pastry",
    price: 3.75,
    image: "https://images.unsplash.com/photo-1555507036-ab1f40388085?w=200&auto=format&fit=crop",
    quantity: 1,
    customization: {},
  },
];

const cafeInfo = {
  name: "Brew Haven Coffee",
  tableNumber: 12,
};

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [orderNotes, setOrderNotes] = useState("");

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    // Simulate checkout
    toast.success("Order placed successfully!");
    router.push("/menu/confirmation");
  };

  const getCustomizationString = (item: CartItem) => {
    const parts = [];
    if (item.customization.size) parts.push(item.customization.size);
    if (item.customization.milk) parts.push(item.customization.milk);
    if (item.customization.sugar) parts.push(item.customization.sugar + " sugar");
    if (item.customization.ice) parts.push(item.customization.ice);
    return parts.join(" | ");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link href="/menu">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Your Cart</h1>
            <p className="text-xs text-muted-foreground">{cartItems.length} items</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Cafe Info Card */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Coffee className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold">{cafeInfo.name}</h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>Table {cafeInfo.tableNumber}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>~15 min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Coffee className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium">Your cart is empty</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add some delicious items to get started
            </p>
            <Link href="/menu">
              <Button className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500">
                Browse Menu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden border-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-medium">{item.name}</h3>
                          {getCustomizationString(item) && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {getCustomizationString(item)}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-sm font-bold text-amber-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-full border-border/50"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-full border-border/50"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add More Items */}
        {cartItems.length > 0 && (
          <Link href="/menu">
            <Button
              variant="outline"
              className="mt-3 w-full border-dashed border-border/50 text-muted-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add more items
            </Button>
          </Link>
        )}

        {/* Order Notes */}
        {cartItems.length > 0 && (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium">Order Notes</label>
            <Textarea
              placeholder="Any special requests? (e.g., extra hot, no lid, etc.)"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="min-h-[80px] resize-none border-border/50 bg-card"
            />
          </div>
        )}

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <Card className="mt-4 border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="mb-3 text-sm font-semibold">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-amber-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Methods Info */}
        {cartItems.length > 0 && (
          <div className="mt-4 rounded-lg bg-muted p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>Pay at counter or online</span>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Checkout Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur">
          <div className="mx-auto flex max-w-md items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-amber-600">${total.toFixed(2)}</p>
            </div>
            <Button
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
