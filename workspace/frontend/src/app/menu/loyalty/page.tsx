"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Star,
  Gift,
  Crown,
  Award,
  Sparkles,
  ChevronRight,
  Check,
  Phone,
  User,
  MessageCircle,
  Copy,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { usePublicLoyalty } from "@/hooks/usePublicLoyalty";

const tiers = [
  { name: "Bronze", min: 0, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: Star, perks: ["Welcome offer - 10% off", "Birthday treat"] },
  { name: "Silver", min: 500, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", icon: Award, perks: ["All Bronze perks", "Free coffee every 10th visit", "Exclusive events"] },
  { name: "Gold", min: 1500, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-300", icon: Crown, perks: ["All Silver perks", "15% discount every order", "Priority service", "Free delivery"] },
  { name: "Platinum", min: 3000, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-300", icon: Sparkles, perks: ["All Gold perks", "20% discount every order", "Dedicated table", "Free catering"] },
];

const availableRewards = [
  { name: "Free Coffee", points: 100, icon: "☕", desc: "Any regular coffee" },
  { name: "Pastry Discount", points: 50, icon: "🥐", desc: "50% off any pastry" },
  { name: "Birthday Treat", points: 0, icon: "🎂", desc: "Free dessert on your birthday", bonus: true },
  { name: "BOGO", points: 75, icon: "🎁", desc: "Buy one get one free" },
];

export default function LoyaltyPage() {

  const [showSignup, setShowSignup] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", whatsapp: "" });

  const { customer, joinLoyalty } = usePublicLoyalty();

  const currentPoints = 0;
  const tierIndex = 0;
  const nextTier = tiers[1];
  const stampCount = 0;
  const totalStamps = 10;
  const totalSpent = 0;
  const visitCount = 0;
  const rewardsUsed = 0;

  const handleSignup = async () => {
    if (!form.name.trim() || !form.whatsapp.trim()) {
      toast.error("Please enter your name and WhatsApp number");
      return;
    }
    setSubmitting(true);
    try {
      const lastOrder = JSON.parse(localStorage.getItem('last_order') || '{}');
      const tenantId = lastOrder?.tenantId || '';
      const businessId = lastOrder?.businessId || '';

      const res = await joinLoyalty({
        name: form.name.trim(),
        whatsappNumber: form.whatsapp.trim(),
        tenantId,
        businessId,
      });
      setMemberId(res.customer?.id?.slice(0, 8).toUpperCase() || "CF" + Math.floor(100000 + Math.random() * 900000));
      setSignedUp(true);
      setShowSignup(false);
      toast.success(res.message || "Welcome to our Loyalty Program!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to join loyalty program");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(memberId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = (reward: typeof availableRewards[0]) => {
    if (reward.bonus) {
      toast.info(reward.name + " - " + reward.desc);
      return;
    }
    if (currentPoints < reward.points) {
      toast.error("Not enough points! You need " + reward.points + " points.");
      return;
    }
    toast.success(reward.name + " redeemed!");
  };

  const progressPercent = nextTier ? Math.min((currentPoints / nextTier.min) * 100, 100) : 100;

  if (!signedUp && !showSignup) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="relative overflow-hidden bg-gradient-to-b from-amber-500 to-orange-600 px-4 pb-16 pt-12">
          <div className="mb-4 flex items-center">
            <Link href="/menu">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-white/80 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="text-center text-white">
            <Award className="mx-auto mb-4 h-16 w-16" />
            <h1 className="text-2xl font-bold">Join Cafe Rewards</h1>
            <p className="mt-2 text-white/80">Earn points with every purchase and unlock exclusive perks</p>
          </div>
        </div>

        <div className="-mt-8 px-4 space-y-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <h2 className="text-lg font-semibold">Get Started in Seconds</h2>
              <p className="mt-1 text-sm text-muted-foreground">No app download required. Just enter your name and WhatsApp number.</p>
              <Button
                className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                onClick={() => setShowSignup(true)}
              >
                Join Now - It&apos;s Free
              </Button>
            </CardContent>
          </Card>

          {/* How it works */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="mb-4 text-sm font-semibold">How it works</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Enter your details", desc: "Just your name and WhatsApp - no app needed" },
                  { step: "2", title: "Earn points", desc: "Get points with every purchase at our cafe" },
                  { step: "3", title: "Redeem rewards", desc: "Free coffee, discounts, and exclusive perks" },
                ].map(s => (
                  <div key={s.step} className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-600">
                      {s.step}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rewards Preview */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="mb-3 text-sm font-semibold">Available Rewards</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableRewards.map(r => (
                  <div key={r.name} className="rounded-lg border border-border/50 p-3 text-center">
                    <span className="text-2xl">{r.icon}</span>
                    <p className="mt-1 text-xs font-medium">{r.name}</p>
                    {r.bonus ? (
                      <Badge variant="outline" className="mt-1 text-[9px] bg-green-50 text-green-700">Birthday Bonus</Badge>
                    ) : (
                      <p className="text-xs text-amber-600 font-bold">{r.points} pts</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tiers Preview */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="mb-3 text-sm font-semibold">Membership Tiers</h3>
              <div className="space-y-2">
                {tiers.map(t => (
                  <div key={t.name} className={`flex items-center gap-3 rounded-lg border ${t.border} ${t.bg} p-3`}>
                    <t.icon className={`h-6 w-6 ${t.color}`} />
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${t.color}`}>{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.min}+ points</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showSignup) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="relative overflow-hidden bg-gradient-to-b from-amber-500 to-orange-600 px-4 pb-16 pt-12">
          <div className="mb-4 flex items-center">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-white/80 hover:text-white" onClick={() => setShowSignup(false)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-center text-white">
            <User className="mx-auto mb-4 h-14 w-14" />
            <h1 className="text-2xl font-bold">Join the Club</h1>
            <p className="mt-2 text-white/80">Enter your details to start earning points</p>
          </div>
        </div>

        <div className="-mt-8 px-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Your Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="e.g. 6281234567890"
                    value={form.whatsapp}
                    onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))}
                  />
                </div>
                <p className="text-xs text-muted-foreground">We&apos;ll send your loyalty updates via WhatsApp</p>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                onClick={handleSignup}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Joining...
                  </span>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Start Earning Points
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-amber-500 to-orange-600 px-4 pb-20 pt-12">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/menu">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-white/80 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white"
            onClick={() => { setSignedUp(false); setShowSignup(false); }}
          >
            Switch Member
          </Button>
        </div>

        {/* Points Card */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-foreground">{currentPoints}</p>
            <p className="text-sm text-muted-foreground">points</p>
            <Separator className="my-4" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{tiers[tierIndex].name}</span>
              <span className="font-medium text-foreground">{form.name || "Member"}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: progressPercent + "%" }} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{nextTier ? currentPoints + " / " + nextTier.min + " to " + nextTier.name : "Max tier reached!"}</p>

            {/* Member ID */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">{memberId}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyId}>
                {copied ? <CheckCheck className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="-mt-12 px-4 space-y-4">
        {/* Greeting */}
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm">
          <MessageCircle className="h-5 w-5 text-green-500" />
          <p className="text-sm">
            Welcome, <strong>{form.name}</strong>! We&apos;ll send your rewards to <strong>{form.whatsapp}</strong>
          </p>
        </div>

        {/* Stamps Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Coffee Stamps</h3>
              <Badge variant="outline" className="text-xs">Buy 10 Get 1 Free</Badge>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: totalStamps }).map((_, i) => (
                <div
                  key={i}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    i < stampCount ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < stampCount ? <Check className="h-4 w-4" /> : i + 1}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{stampCount} of {totalStamps} stamps collected</p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold">${totalSpent}</p>
              <p className="text-[10px] text-muted-foreground">Total Spent</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold">{visitCount}</p>
              <p className="text-[10px] text-muted-foreground">Visits</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold">{rewardsUsed}</p>
              <p className="text-[10px] text-muted-foreground">Rewards Used</p>
            </CardContent>
          </Card>
        </div>

        {/* Rewards */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Available Rewards</h3>
              <Gift className="h-4 w-4 text-amber-500" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availableRewards.map(r => (
                <button
                  key={r.name}
                  onClick={() => handleRedeem(r)}
                  className="rounded-lg border border-border/50 p-3 text-left hover:border-amber-300 hover:bg-amber-50 transition-colors"
                >
                  <span className="text-xl">{r.icon}</span>
                  <p className="mt-1 text-xs font-medium">{r.name}</p>
                  <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                  {r.bonus ? (
                    <Badge variant="outline" className="mt-1 text-[9px] bg-green-50 text-green-700">Birthday Bonus</Badge>
                  ) : currentPoints >= r.points ? (
                    <p className="mt-1 text-xs font-bold text-green-600">Redeem</p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">{r.points} pts</p>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tiers */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-semibold">Membership Tiers</h3>
            <div className="space-y-2">
              {tiers.map((t, i) => {
                const unlocked = currentPoints >= t.min;
                return (
                  <div key={t.name} className={`flex items-center gap-3 rounded-lg border p-3 ${unlocked ? t.border + ' ' + t.bg : 'opacity-50'}`}>
                    <t.icon className={`h-6 w-6 ${t.color}`} />
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${t.color}`}>{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.perks[0]}</p>
                    </div>
                    {unlocked && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* How to Earn */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-semibold">How to Earn Points</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">1</div>
                <p className="text-sm">Make a purchase - earn <strong>1 point per $1</strong></p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">2</div>
                <p className="text-sm">Leave a review - earn <strong>10 bonus points</strong></p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">3</div>
                <p className="text-sm">Refer a friend - earn <strong>50 bonus points</strong></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
