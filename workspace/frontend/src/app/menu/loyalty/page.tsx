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

const cardStyle: React.CSSProperties = {
  background: 'var(--menu-card)', borderRadius: 16,
  border: '1px solid var(--menu-card-border)', padding: 16,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

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

  const headerBg: React.CSSProperties = {
    position: 'relative', overflow: 'hidden',
    padding: '16px 16px 64px',
  };

  const backBtn: React.CSSProperties = {
    width: 36, height: 36, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', background: 'rgba(255,255,255,0.15)',
    cursor: 'pointer', color: '#fff',
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 14, fontWeight: 600, color: 'var(--menu-charcoal)', marginBottom: 12,
  };

  // --- Not signed up, not signing up ---
  if (!signedUp && !showSignup) {
    return (
      <div className="min-h-screen pb-24" style={{ background: 'var(--menu-bg)' }}>
        <div style={headerBg}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <Link href="/menu">
              <button style={backBtn}><ArrowLeft style={{ width: 20, height: 20 }} /></button>
            </Link>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Award style={{ width: 56, height: 56, margin: '0 auto 16px', color: 'var(--menu-gold)' }} />
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--menu-charcoal)' }}>Join Cafe Rewards</h1>
            <p style={{ fontSize: 13, color: 'var(--menu-text-muted)', marginTop: 4 }}>Earn points with every purchase and unlock exclusive perks</p>
          </div>
        </div>

        <div style={{ marginTop: -32, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* CTA Card */}
          <div style={{ ...cardStyle, padding: 24, textAlign: 'center' }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--menu-charcoal)' }}>Get Started in Seconds</h2>
            <p style={{ fontSize: 13, color: 'var(--menu-text-muted)', marginTop: 4 }}>No app download required. Just enter your name and WhatsApp number.</p>
            <button
              onClick={() => setShowSignup(true)}
              style={{
                marginTop: 16, padding: '12px 32px', borderRadius: 100,
                background: 'var(--menu-gold)', color: '#fff',
                border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s ease', width: '100%',
              }}
            >
              Join Now - It&apos;s Free
            </button>
          </div>

          {/* How it works */}
          <div style={cardStyle}>
            <h3 style={sectionTitle}>How it works</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { step: "1", title: "Enter your details", desc: "Just your name and WhatsApp - no app needed" },
                { step: "2", title: "Earn points", desc: "Get points with every purchase at our cafe" },
                { step: "3", title: "Redeem rewards", desc: "Free coffee, discounts, and exclusive perks" },
              ].map(s => (
                <div key={s.step} style={{ display: 'flex', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--menu-warm)', color: 'var(--menu-gold-dark)',
                    fontSize: 13, fontWeight: 700,
                  }}>
                    {s.step}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--menu-charcoal)' }}>{s.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--menu-text-light)' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards Preview */}
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Available Rewards</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {availableRewards.map(r => (
                <div key={r.name} style={{ padding: 12, borderRadius: 12, border: '1px solid var(--menu-card-border)', textAlign: 'center' }}>
                  <span style={{ fontSize: 24 }}>{r.icon}</span>
                  <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--menu-charcoal)', marginTop: 4 }}>{r.name}</p>
                  {r.bonus ? (
                    <span style={{ display: 'inline-block', fontSize: 10, padding: '2px 8px', borderRadius: 100, background: '#f0fdf4', color: '#15803d', marginTop: 4 }}>
                      Birthday Bonus
                    </span>
                  ) : (
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--menu-gold-dark)', marginTop: 2 }}>{r.points} pts</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tiers Preview */}
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Membership Tiers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tiers.map(t => (
                <div key={t.name} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: 12, borderRadius: 12,
                  border: '1px solid var(--menu-card-border)',
                  background: 'var(--menu-card)',
                }}>
                  <t.icon style={{ width: 24, height: 24, color: t.min > currentPoints ? 'var(--menu-text-light)' : 'var(--menu-gold)' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--menu-charcoal)' }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--menu-text-light)' }}>{t.min}+ points</p>
                  </div>
                  <ChevronRight style={{ width: 16, height: 16, color: 'var(--menu-text-light)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Signup Form ---
  if (showSignup) {
    return (
      <div className="min-h-screen pb-24" style={{ background: 'var(--menu-bg)' }}>
        <div style={headerBg}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <button onClick={() => setShowSignup(false)} style={backBtn}>
              <ArrowLeft style={{ width: 20, height: 20 }} />
            </button>
          </div>
          <div style={{ textAlign: 'center' }}>
            <User style={{ width: 48, height: 48, margin: '0 auto 16px', color: 'var(--menu-gold)' }} />
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--menu-charcoal)' }}>Join the Club</h1>
            <p style={{ fontSize: 13, color: 'var(--menu-text-muted)', marginTop: 4 }}>Enter your details to start earning points</p>
          </div>
        </div>

        <div style={{ marginTop: -32, padding: '0 16px' }}>
          <div style={{ ...cardStyle, padding: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--menu-charcoal)', marginBottom: 6 }}>Your Name</label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--menu-text-light)' }} />
                  <input
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 10px 10px 36px', borderRadius: 10,
                      border: '1.5px solid var(--menu-card-border)', outline: 'none',
                      fontSize: 13, color: 'var(--menu-charcoal)', background: 'var(--menu-card)',
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--menu-charcoal)', marginBottom: 6 }}>WhatsApp Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--menu-text-light)' }} />
                  <input
                    placeholder="e.g. 6281234567890"
                    value={form.whatsapp}
                    onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 10px 10px 36px', borderRadius: 10,
                      border: '1.5px solid var(--menu-card-border)', outline: 'none',
                      fontSize: 13, color: 'var(--menu-charcoal)', background: 'var(--menu-card)',
                    }}
                  />
                </div>
                <p style={{ fontSize: 11, color: 'var(--menu-text-light)', marginTop: 4 }}>We&apos;ll send your loyalty updates via WhatsApp</p>
              </div>
              <button
                onClick={handleSignup}
                disabled={submitting}
                style={{
                  padding: '12px 24px', borderRadius: 100,
                  background: submitting ? 'var(--menu-text-light)' : 'var(--menu-charcoal)',
                  color: '#fff', border: 'none', fontSize: 14, fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s ease',
                }}
              >
                {submitting ? (
                  <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />Joining...</>
                ) : (
                  <><Check style={{ width: 16, height: 16 }} />Start Earning Points</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Signed In Dashboard ---
  const progressWidth = progressPercent;

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--menu-bg)' }}>
      {/* Header + Points Card */}
      <div style={{ ...headerBg, paddingBottom: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Link href="/menu">
            <button style={backBtn}><ArrowLeft style={{ width: 20, height: 20 }} /></button>
          </Link>
          <button
            onClick={() => { setSignedUp(false); setShowSignup(false); }}
            style={{ ...backBtn, fontSize: 12, padding: '6px 12px', borderRadius: 100, width: 'auto', height: 'auto', gap: 4 }}
          >
            Switch Member
          </button>
        </div>

        {/* Points Card */}
        <div style={{
          ...cardStyle, padding: 24, textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>
          <p style={{ fontSize: 40, fontWeight: 700, color: 'var(--menu-charcoal)' }}>{currentPoints}</p>
          <p style={{ fontSize: 13, color: 'var(--menu-text-light)' }}>points</p>
          <div style={{ height: 1, background: 'var(--menu-card-border)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--menu-text-light)' }}>
            <span>{tiers[tierIndex].name}</span>
            <span style={{ fontWeight: 500, color: 'var(--menu-charcoal)' }}>{form.name || "Member"}</span>
          </div>
          <div style={{ marginTop: 8, height: 6, borderRadius: 100, background: 'var(--menu-card-border)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 100, background: 'var(--menu-gold)', width: `${progressWidth}%` }} />
          </div>
          <p style={{ fontSize: 11, color: 'var(--menu-text-light)', marginTop: 4 }}>{nextTier ? currentPoints + " / " + nextTier.min + " to " + nextTier.name : "Max tier reached!"}</p>

          {/* Member ID */}
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--menu-text-light)', fontFamily: 'monospace' }}>{memberId}</span>
            <button onClick={handleCopyId} style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {copied ? <CheckCheck style={{ width: 14, height: 14, color: '#15803d' }} /> : <Copy style={{ width: 14, height: 14, color: 'var(--menu-text-light)' }} />}
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: -64, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Greeting */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
          background: 'var(--menu-card)', borderRadius: 12,
          border: '1px solid var(--menu-card-border)',
        }}>
          <MessageCircle style={{ width: 20, height: 20, color: '#22c55e', flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: 'var(--menu-text-muted)' }}>
            Welcome, <strong style={{ color: 'var(--menu-charcoal)' }}>{form.name}</strong>! We&apos;ll send your rewards to <strong style={{ color: 'var(--menu-charcoal)' }}>{form.whatsapp}</strong>
          </p>
        </div>

        {/* Stamps Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={sectionTitle}>Coffee Stamps</h3>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, border: '1px solid var(--menu-card-border)', color: 'var(--menu-text-light)' }}>Buy 10 Get 1 Free</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {Array.from({ length: totalStamps }).map((_, i) => (
              <div key={i} style={{
                width: 30, height: 30, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                background: i < stampCount ? 'var(--menu-gold)' : 'var(--menu-card-border)',
                color: i < stampCount ? '#fff' : 'var(--menu-text-light)',
              }}>
                {i < stampCount ? <Check style={{ width: 14, height: 14 }} /> : i + 1}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'var(--menu-text-light)', marginTop: 8 }}>{stampCount} of {totalStamps} stamps collected</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: 'Total Spent', value: `$${totalSpent}` },
            { label: 'Visits', value: `${visitCount}` },
            { label: 'Rewards Used', value: `${rewardsUsed}` },
          ].map(s => (
            <div key={s.label} style={{ ...cardStyle, padding: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--menu-charcoal)' }}>{s.value}</p>
              <p style={{ fontSize: 10, color: 'var(--menu-text-light)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Rewards */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={sectionTitle}>Available Rewards</h3>
            <Gift style={{ width: 16, height: 16, color: 'var(--menu-gold)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {availableRewards.map(r => (
              <button
                key={r.name}
                onClick={() => handleRedeem(r)}
                style={{
                  padding: 12, borderRadius: 12, textAlign: 'left', cursor: 'pointer',
                  border: '1px solid var(--menu-card-border)', background: 'var(--menu-card)',
                  fontFamily: 'inherit', transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: 20 }}>{r.icon}</span>
                <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--menu-charcoal)', marginTop: 2 }}>{r.name}</p>
                <p style={{ fontSize: 10, color: 'var(--menu-text-light)' }}>{r.desc}</p>
                {r.bonus ? (
                  <span style={{ display: 'inline-block', fontSize: 9, padding: '2px 6px', borderRadius: 100, background: '#f0fdf4', color: '#15803d', marginTop: 4 }}>Birthday Bonus</span>
                ) : currentPoints >= r.points ? (
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#15803d', marginTop: 4 }}>Redeem</p>
                ) : (
                  <p style={{ fontSize: 11, color: 'var(--menu-text-light)', marginTop: 4 }}>{r.points} pts</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tiers */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Membership Tiers</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tiers.map((t, i) => {
              const unlocked = currentPoints >= t.min;
              return (
                <div key={t.name} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: 12, borderRadius: 12,
                  border: '1px solid var(--menu-card-border)',
                  opacity: unlocked ? 1 : 0.5,
                }}>
                  <t.icon style={{ width: 24, height: 24, color: unlocked ? 'var(--menu-gold)' : 'var(--menu-text-light)' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--menu-charcoal)' }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--menu-text-light)' }}>{t.perks[0]}</p>
                  </div>
                  {unlocked && <Check style={{ width: 16, height: 16, color: '#15803d' }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* How to Earn */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>How to Earn Points</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { num: "1", text: "Make a purchase - earn ", bold: "1 point per $1" },
              { num: "2", text: "Leave a review - earn ", bold: "10 bonus points" },
              { num: "3", text: "Refer a friend - earn ", bold: "50 bonus points" },
            ].map(s => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--menu-warm)', color: 'var(--menu-gold-dark)',
                  fontSize: 13, fontWeight: 700,
                }}>
                  {s.num}
                </div>
                <p style={{ fontSize: 13, color: 'var(--menu-text-muted)' }}>
                  {s.text}<strong style={{ color: 'var(--menu-charcoal)' }}>{s.bold}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
