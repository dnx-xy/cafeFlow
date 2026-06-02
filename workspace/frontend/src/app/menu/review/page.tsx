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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePublicFeedback } from "@/hooks/usePublicFeedback";
import { usePublicLoyalty } from "@/hooks/usePublicLoyalty";

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

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (rating <= 3 && feedback.trim() === "") {
      toast.error("Please provide your feedback");
      return;
    }
    setSubmitting(true);
    try {
      const lastOrder = JSON.parse(localStorage.getItem('last_order') || '{}');
      const tenantId = lastOrder?.tenantId || '';
      const businessId = lastOrder?.businessId || '';
      const orderId = lastOrder?.id || '';

      await submitFeedback({
        customerName: name || undefined,
        customerWhatsapp: whatsapp || undefined,
        rating,
        comment: feedback || undefined,
        orderId,
        tenantId,
        businessId,
      });

      if (whatsapp && name) {
        try {
          await joinLoyalty({ name, whatsappNumber: whatsapp, tenantId, businessId });
        } catch {}
      }

      setSubmitted(true);
      toast.success("Thank you for your feedback!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit");
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleReview = () => {
    window.open("https://g.page/r/CafeFlow/review", "_blank");
    toast.success("Thank you for your review!");
    handleSubmit();
  };

  const handleSkip = () => {
    router.push("/menu");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <ThumbsUp className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-xl font-bold">Thank You!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your feedback helps us serve you better
          </p>
          {whatsapp && (
            <p className="mt-1 text-xs text-amber-600 font-medium">
              You earned 10 bonus loyalty points!
            </p>
          )}
          <Link href="/menu">
            <Button className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500">
              <Coffee className="mr-2 h-4 w-4" />
              Back to Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleSkip}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Rate Your Experience</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6 text-center">
          <div className="mb-3 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop"
              alt="Cafe Logo"
              className="h-16 w-16 rounded-full object-cover shadow-lg"
            />
          </div>
          <h2 className="text-lg font-semibold">Brew Haven Coffee</h2>
          <p className="text-sm text-muted-foreground">How was your experience?</p>
        </div>

        <Card className="mb-4 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`h-10 w-10 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {rating === 0 ? "Tap a star to rate"
                  : rating === 1 ? "Poor"
                  : rating === 2 ? "Fair"
                  : rating === 3 ? "Good"
                  : rating === 4 ? "Very Good"
                  : "Excellent!"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Name + WhatsApp entry (earn bonus points) */}
        {rating > 0 && (
          <Card className="mb-4 border-0 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-amber-700 mb-2">
                Enter your details to earn 10 bonus loyalty points!
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="border-amber-200 bg-white text-sm"
                />
                <Input
                  placeholder="WhatsApp number"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  className="border-amber-200 bg-white text-sm"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {rating >= 4 && (
          <div className="animate-in slide-in-from-bottom duration-300">
            <Card className="mb-4 border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold">Leave us a Google Review?</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Your positive review helps other coffee lovers discover us!
                    </p>
                    <Button className="mt-3 w-full bg-blue-600 hover:bg-blue-700" onClick={handleGoogleReview}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Write a Google Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="text-center">
              <Button variant="link" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Continue without Google Review"}
              </Button>
            </div>
          </div>
        )}

        {rating > 0 && rating <= 3 && (
          <div className="animate-in slide-in-from-bottom duration-300">
            <Card className="mb-4 border-0 shadow-md">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm font-semibold">We are sorry to hear that</h3>
                </div>
                <p className="mb-4 text-xs text-muted-foreground">
                  Please help us improve by sharing what went wrong.
                </p>
                <Textarea
                  placeholder="Tell us what we could do better..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mb-3 min-h-[100px] resize-none border-border/50 bg-card"
                />
                <Button
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Feedback
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {rating === 0 && (
          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={handleSkip}>
              Skip for now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
