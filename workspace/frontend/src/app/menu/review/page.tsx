"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Send,
  ExternalLink,
  ThumbsUp,
  Coffee,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { usePublicFeedback } from "@/hooks/usePublicFeedback";
import { usePublicLoyalty } from "@/hooks/usePublicLoyalty";

const cardStyle: React.CSSProperties = {
  background: 'var(--menu-card)', borderRadius: 16,
  border: '1px solid var(--menu-card-border)', padding: 16,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function ReviewPage() {
  const router = useRouter();
  const { submitFeedback } = usePublicFeedback();
  const { joinLoyalty } = usePublicLoyalty();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleStarClick = (star: number) => { setRating(star); };

  const handleSubmit = async () => {
    if (rating === 0) { toast.error("Please select a rating"); return; }
    if (rating <= 3 && feedback.trim() === "") { toast.error("Please provide your feedback"); return; }
    setSubmitting(true);
    try {
      const lastOrder = JSON.parse(localStorage.getItem('last_order') || '{}');
      const tenantId = lastOrder?.tenantId || '';
      const businessId = lastOrder?.businessId || '';
      const orderId = lastOrder?.id || '';
      await submitFeedback({ customerName: name || undefined, customerWhatsapp: whatsapp || undefined, rating, comment: feedback || undefined, orderId, tenantId, businessId });
      if (whatsapp && name) { try { await joinLoyalty({ name, whatsappNumber: whatsapp, tenantId, businessId }); } catch {} }
      setSubmitted(true);
      toast.success("Thank you for your feedback!");
    } catch { setSubmitted(true); } finally { setSubmitting(false); }
  };

  const handleGoogleReview = () => {
    window.open("https://g.page/r/CafeFlow/review", "_blank");
    toast.success("Thank you for your review!");
    handleSubmit();
  };

  const handleSkip = () => { router.push("/menu"); };

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--menu-bg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 16px', textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', marginBottom: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(45,42,39,0.06)',
          }}>
            <ThumbsUp style={{ width: 36, height: 36, color: 'var(--menu-gold)' }} />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--menu-charcoal)' }}>Thank You!</h1>
          <p style={{ fontSize: 13, color: 'var(--menu-text-muted)', marginTop: 4 }}>Your feedback helps us serve you better</p>
          {whatsapp && <p style={{ fontSize: 12, color: 'var(--menu-gold-dark)', fontWeight: 500, marginTop: 4 }}>You earned 10 bonus loyalty points!</p>}
          <Link href="/menu">
            <button style={{
              marginTop: 24, padding: '12px 32px', borderRadius: 100,
              background: 'var(--menu-charcoal)', color: '#fff',
              border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <Coffee style={{ width: 16, height: 16 }} />
              Back to Menu
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const starLabel = rating === 0 ? "Tap a star to rate"
    : rating === 1 ? "Poor"
    : rating === 2 ? "Fair"
    : rating === 3 ? "Good"
    : rating === 4 ? "Very Good"
    : "Excellent!";

  return (
    <div className="min-h-screen pb-6" style={{ background: 'var(--menu-bg)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--menu-card-border)',
        padding: '14px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={handleSkip} style={{
            width: 36, height: 36, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--menu-charcoal)',
          }}>
            <ArrowLeft style={{ width: 20, height: 20 }} />
          </button>
          <h1 style={{ fontSize: 17, fontWeight: 600, color: 'var(--menu-charcoal)' }}>Rate Your Experience</h1>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Cafe Info */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop"
              alt="Cafe Logo"
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--menu-charcoal)' }}>Brew Haven Coffee</h2>
          <p style={{ fontSize: 13, color: 'var(--menu-text-muted)' }}>How was your experience?</p>
        </div>

        {/* Stars */}
        <div style={{ ...cardStyle, padding: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'transform 0.15s ease' }}
                >
                  <Star
                    style={{
                      width: 40, height: 40,
                      color: star <= (hoverRating || rating) ? 'var(--menu-gold)' : 'var(--menu-card-border)',
                      fill: star <= (hoverRating || rating) ? 'var(--menu-gold)' : 'transparent',
                      transition: 'all 0.15s ease',
                    }}
                  />
                </button>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--menu-text-light)', marginTop: 8 }}>{starLabel}</p>
          </div>
        </div>

        {/* Bonus points entry */}
        {rating > 0 && (
          <div style={{
            ...cardStyle, marginTop: 12,
            background: 'var(--menu-warm)',
            border: '1px solid rgba(201,169,110,0.3)',
          }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--menu-gold-dark)', marginBottom: 8 }}>
              Enter your details to earn 10 bonus loyalty points!
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 10,
                  border: '1.5px solid rgba(201,169,110,0.3)',
                  outline: 'none', fontSize: 13, color: 'var(--menu-charcoal)',
                  background: '#fff',
                }}
              />
              <input
                placeholder="WhatsApp number"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 10,
                  border: '1.5px solid rgba(201,169,110,0.3)',
                  outline: 'none', fontSize: 13, color: 'var(--menu-charcoal)',
                  background: '#fff',
                }}
              />
            </div>
          </div>
        )}

        {/* High rating - Google Review */}
        {rating >= 4 && (
          <div style={{ marginTop: 12 }}>
            <div style={{
              ...cardStyle,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
            }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#dbeafe', color: '#2563eb',
                }}>
                  <ExternalLink style={{ width: 20, height: 20 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1d4ed8' }}>Leave us a Google Review?</h3>
                  <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Your positive review helps other coffee lovers discover us!</p>
                  <button
                    onClick={handleGoogleReview}
                    style={{
                      marginTop: 8, width: '100%', padding: '10px 16px', borderRadius: 100,
                      background: '#2563eb', color: '#fff', border: 'none',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <ExternalLink style={{ width: 16, height: 16 }} />
                    Write a Google Review
                  </button>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{ background: 'none', border: 'none', color: 'var(--menu-text-light)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
              >
                {submitting ? "Submitting..." : "Continue without Google Review"}
              </button>
            </div>
          </div>
        )}

        {/* Low rating - feedback */}
        {rating > 0 && rating <= 3 && (
          <div style={{ marginTop: 12 }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <MessageSquare style={{ width: 16, height: 16, color: 'var(--menu-gold-dark)' }} />
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--menu-charcoal)' }}>We are sorry to hear that</h3>
              </div>
              <p style={{ fontSize: 12, color: 'var(--menu-text-light)', marginBottom: 12 }}>Please help us improve by sharing what went wrong.</p>
              <textarea
                placeholder="Tell us what we could do better..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                style={{
                  width: '100%', minHeight: 96, padding: '12px 14px', borderRadius: 12,
                  border: '1.5px solid var(--menu-card-border)',
                  background: 'var(--menu-card)',
                  fontSize: 13, color: 'var(--menu-charcoal)',
                  resize: 'none', outline: 'none', fontFamily: 'inherit',
                  lineHeight: 1.5, marginBottom: 12,
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  width: '100%', padding: '12px 24px', borderRadius: 100,
                  background: submitting ? 'var(--menu-text-light)' : 'var(--menu-charcoal)',
                  color: '#fff', border: 'none', fontSize: 14, fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s ease',
                }}
              >
                {submitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                    Sending...
                  </span>
                ) : (
                  <><Send style={{ width: 16, height: 16 }} />Send Feedback</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Skip */}
        {rating === 0 && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button onClick={handleSkip} style={{ background: 'none', border: 'none', color: 'var(--menu-text-light)', fontSize: 13, cursor: 'pointer' }}>
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
