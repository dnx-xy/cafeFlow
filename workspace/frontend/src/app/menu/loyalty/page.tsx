"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Gift,
  Coffee,
  Crown,
  Ticket,
  Sparkles,
  CoffeeIcon,
  TrendingUp,
  Clock,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressTrack, ProgressIndicator, ProgressValue, ProgressLabel } from "@/components/ui/progress";
import { toast } from "sonner";

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  icon: typeof Coffee;
  color: string;
  bgColor: string;
}

const rewards: Reward[] = [
  {
    id: "1",
    title: "Free Coffee",
    description: "Any size, any drink",
    pointsRequired: 100,
    icon: CoffeeIcon,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    id: "2",
    title: "Pastry Discount",
    description: "50% off any pastry",
    pointsRequired: 50,
    icon: Gift,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    id: "3",
    title: "Birthday Treat",
    description: "Free pastry on your birthday",
    pointsRequired: 0,
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: "4",
    title: "Buy One Get One",
    description: "BOGO on any coffee",
    pointsRequired: 75,
    icon: Ticket,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
];

interface Tier {
  name: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
  color: string;
}

const tiers: Tier[] = [
  { name: "Bronze", minPoints: 0, maxPoints: 100, benefits: ["Earn 1 point per $1 spent"], color: "text-amber-700" },
  { name: "Silver", minPoints: 100, maxPoints: 300, benefits: ["Earn 1.5 points per $1", "Free birthday drink"], color: "text-slate-500" },
  { name: "Gold", minPoints: 300, maxPoints: 500, benefits: ["Earn 2 points per $1", "Free size upgrades", "Early access to new drinks"], color: "text-yellow-500" },
  { name: "Platinum", minPoints: 500, maxPoints: 9999, benefits: ["Earn 3 points per $1", "All size upgrades free", "Priority service", "Exclusive offers"], color: "text-indigo-600" },
];

export default function LoyaltyPage() {
  const [currentPoints] = useState(185);
  const [totalSpent] = useState(1850);
  const [visitCount] = useState(47);
  const [stamps] = useState(7);
  const [copied, setCopied] = useState(false);

  const memberId = "CF" + "7429";
  const currentTier = tiers.find((t) => currentPoints >= t.minPoints && currentPoints < t.maxPoints) || tiers[0];
  const nextTier = tiers.find((t) => t.minPoints > currentPoints);
  const pointsToNextTier = nextTier ? nextTier.minPoints - currentPoints : 0;
  const progressToNextTier = nextTier ? ((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 : 100;

  const handleCopyMemberId = () => {
    navigator.clipboard.writeText(memberId);
    setCopied(true);
    toast.success("Member ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const canRedeem = (pointsRequired: number) => currentPoints >= pointsRequired;

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link href="/menu">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Loyalty Rewards</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Points Card */}
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Current Points</p>
                <p className="text-3xl font-bold">{currentPoints}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <Star className="h-6 w-6 fill-white text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
              <span className="font-medium">{currentTier.name} Member</span>
              {nextTier && (
                <span className="text-white/60">
                  • {pointsToNextTier} points to {nextTier.name}
                </span>
              )}
            </div>
          </div>
          <CardContent className="p-4">
            {nextTier && (
              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{currentTier.name}</span>
                  <span className="font-medium text-amber-600">{nextTier.name}</span>
                </div>
                <Progress className="h-2" value={progressToNextTier}>
                  <ProgressTrack />
                  <ProgressIndicator className="bg-gradient-to-r from-amber-500 to-orange-500" />
                </Progress>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {pointsToNextTier} more points to reach {nextTier.name}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Member ID */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Member ID</p>
                <p className="text-lg font-mono font-semibold tracking-wider">{memberId}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={handleCopyMemberId}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Coffee Stamps Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CoffeeIcon className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold">Coffee Stamps</h3>
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                {stamps}/10
              </Badge>
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    i < stamps
                      ? "bg-amber-500 text-white"
                      : "border-2 border-dashed border-muted-foreground/30"
                  }`}
                >
                  {i < stamps ? (
                    <CoffeeIcon className="h-5 w-5" />
                  ) : (
                    <span className="text-xs text-muted-foreground">{i + 1}</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Buy {10 - stamps} more coffees to get a free one!
            </p>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-lg font-bold">${(totalSpent / 100).toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-lg font-bold">{visitCount}</p>
              <p className="text-xs text-muted-foreground">Visits</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-lg font-bold">8</p>
              <p className="text-xs text-muted-foreground">Rewards Used</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Rewards */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Available Rewards</h3>
            <span className="text-xs text-muted-foreground">
              {rewards.filter((r) => r.pointsRequired > 0 && canRedeem(r.pointsRequired)).length} redeemable
            </span>
          </div>
          <div className="space-y-3">
            {rewards.map((reward) => {
              const Icon = reward.icon;
              const isRedeemable = canRedeem(reward.pointsRequired);
              const isBirthdayReward = reward.pointsRequired === 0;
              
              return (
                <Card
                  key={reward.id}
                  className={`overflow-hidden border-0 shadow-sm transition-all ${
                    isRedeemable || isBirthdayReward
                      ? "cursor-pointer hover:shadow-md"
                      : "opacity-70"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${reward.bgColor}`}
                      >
                        <Icon className={`h-6 w-6 ${reward.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{reward.title}</h4>
                          {isBirthdayReward && (
                            <Badge className="bg-purple-100 text-purple-700 text-[10px]">
                              Free
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {reward.description}
                        </p>
                      </div>
                      <div className="text-right">
                        {isBirthdayReward ? (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            Claim
                          </Button>
                        ) : isRedeemable ? (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-amber-500 to-orange-500"
                          >
                            Redeem
                          </Button>
                        ) : (
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Need</p>
                            <p className="text-sm font-semibold text-amber-600">
                              {reward.pointsRequired - currentPoints} pts
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tier Benefits */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold">Tier Benefits</h3>
            </div>
            <div className="space-y-3">
              {tiers.map((tier) => {
                const isCurrentTier = tier.name === currentTier.name;
                return (
                  <div
                    key={tier.name}
                    className={`rounded-lg border p-3 ${
                      isCurrentTier
                        ? "border-amber-500 bg-amber-50"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${tier.color}`}>
                          {tier.name}
                        </span>
                        {isCurrentTier && (
                          <Badge className="bg-amber-500 text-white text-[10px]">
                            Current
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {tier.minPoints}+ pts
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {tier.benefits.map((benefit, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <Sparkles className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* How to Earn */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3 font-semibold">How to Earn Points</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium">Make a Purchase</p>
                  <p className="text-xs text-muted-foreground">
                    Earn {currentTier.name === "Bronze" ? 1 : currentTier.name === "Silver" ? 1.5 : currentTier.name === "Gold" ? 2 : 3} points per $1 spent
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium">Leave a Review</p>
                  <p className="text-xs text-muted-foreground">
                    Earn 15 points for each review
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium">Refer a Friend</p>
                  <p className="text-xs text-muted-foreground">
                    Earn 50 points when they make their first purchase
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
