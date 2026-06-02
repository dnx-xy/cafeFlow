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

export default function ReviewPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (rating <= 3 && feedback.trim() === "") {
      toast.error("Please provide your feedback");
      return;
    }

    setSubmitted(true);
    toast.success("Thank you for your feedback!");
  };

  const handleGoogleReview = () => {
    // Open Google Review link
    window.open("https://g.page/r/YOUR_GOOGLE_PLACE_ID/review", "_blank");
    toast.success("Thank you for your review!");
    setSubmitted(true);
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
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleSkip}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Rate Your Experience</h1>
        </div>
      </div>

      <div className="p-4">
        {/* Cafe Info */}
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

        {/* Rating Stars */}
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
                {rating === 0
                  ? "Tap a star to rate"
                  : rating === 1
                  ? "Poor"
                  : rating === 2
                  ? "Fair"
                  : rating === 3
                  ? "Good"
                  : rating === 4
                  ? "Very Good"
                  : "Excellent!"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rating 4 or 5 - Show Google Review Prompt */}
        {rating >= 4 && (
          <div className="animate-in slide-in-from-bottom duration-300">
            <Card className="mb-4 border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold">Leave us a Google Review?</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your positive review helps other coffee lovers discover us!
                    </p>
                    <Button
                      className="mt-3 w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleGoogleReview}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Write a Google Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button variant="link" onClick={handleSubmit}>
                Continue without Google Review
              </Button>
            </div>
          </div>
        )}

        {/* Rating 3 or less - Show Private Feedback Form */}
        {rating > 0 && rating <= 3 && (
          <div className="animate-in slide-in-from-bottom duration-300">
            <Card className="mb-4 border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm font-semibold">We are sorry to hear that</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Please help us improve by sharing what went wrong. Your feedback is private and helps us serve you better.
                </p>

                <Textarea
                  placeholder="Tell us what we could do better..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px] resize-none border-border/50 bg-card mb-3"
                />

                <div className="space-y-3">
                  <Input
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-border/50 bg-card"
                  />
                  <Input
                    type="email"
                    placeholder="Your email (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-border/50 bg-card"
                  />
                </div>

                <Button
                  className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500"
                  onClick={handleSubmit}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Feedback
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Skip Button */}
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
