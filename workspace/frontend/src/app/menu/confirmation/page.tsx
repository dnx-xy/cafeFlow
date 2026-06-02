"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Coffee,
  UtensilsCrossed,
  Share2,
  Home,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderDetails {
  orderNumber: string;
  estimatedTime: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  tableNumber: number;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    orderNumber: "",
    estimatedTime: "",
    items: [],
    total: 0,
    tableNumber: 12,
  });

  useEffect(() => {
    // Simulate generating order details
    const orderNum = "CF" + Math.floor(100000 + Math.random() * 900000);
    const estimatedMinutes = Math.floor(10 + Math.random() * 15);
    
    setOrderDetails({
      orderNumber: orderNum,
      estimatedTime: `${estimatedMinutes}-${estimatedMinutes + 5} min`,
      items: [
        { name: "Signature Latte", quantity: 2, price: 11.00 },
        { name: "Butter Croissant", quantity: 1, price: 3.75 },
      ],
      total: 14.75,
      tableNumber: 12,
    });
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Order at Brew Haven Coffee",
        text: `I just ordered at Brew Haven Coffee! Order #${orderDetails.orderNumber}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Success Animation Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-green-50 to-background px-4 pb-6 pt-12">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-foreground animate-in slide-in-from-bottom duration-500 delay-100">
            Order Confirmed!
          </h1>
          <p className="mt-1 text-center text-sm text-muted-foreground animate-in slide-in-from-bottom duration-500 delay-200">
            Your order has been received and is being prepared
          </p>
        </div>
      </div>

      <div className="px-4 pb-24">
        {/* Order Number Card */}
        <Card className="mb-4 overflow-hidden border-0 shadow-md animate-in slide-in-from-bottom duration-500 delay-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Order Number</p>
                <p className="text-lg font-bold tracking-wide">{orderDetails.orderNumber}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Est. Time</p>
                  <p className="text-sm font-semibold">{orderDetails.estimatedTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                  <MapPin className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Table</p>
                  <p className="text-sm font-semibold">#{orderDetails.tableNumber}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Timeline */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-4 text-sm font-semibold">Order Status</h3>
            <div className="relative">
              <div className="absolute left-3 top-8 bottom-4 w-0.5 bg-amber-500" />
              
              {/* Step 1 - Confirmed */}
              <div className="relative flex gap-4 pb-6">
                <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Order Confirmed</p>
                  <p className="text-xs text-muted-foreground">We have received your order</p>
                </div>
              </div>

              {/* Step 2 - Preparing */}
              <div className="relative flex gap-4 pb-6">
                <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                  <UtensilsCrossed className="h-3 w-3 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Preparing</p>
                  <p className="text-xs text-muted-foreground">Our baristas are working on it</p>
                </div>
              </div>

              {/* Step 3 - Ready */}
              <div className="relative flex gap-4">
                <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                  <Coffee className="h-3 w-3 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ready for Pickup</p>
                  <p className="text-xs text-muted-foreground">We will notify you when it is ready</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-semibold">Order Summary</h3>
            <div className="space-y-2">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{item.quantity}x</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-bold text-amber-600">
                    ${orderDetails.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loyalty Points Earned */}
        <Card className="mb-4 border-0 shadow-sm bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500">
                <Star className="h-5 w-5 text-white fill-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">You earned 15 points!</p>
                <p className="text-xs text-muted-foreground">
                  You are now 5 points away from a free coffee
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Info */}
        <div className="rounded-lg bg-muted p-3 text-center">
          <p className="text-xs text-muted-foreground">
            We will notify you when your order is ready
          </p>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-md gap-3">
          <Link href="/menu" className="flex-1">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Back to Menu
            </Button>
          </Link>
          <Link href="/menu/review" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500">
              <Star className="mr-2 h-4 w-4" />
              Rate Order
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
