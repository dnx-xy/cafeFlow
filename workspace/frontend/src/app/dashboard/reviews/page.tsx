'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useI18n } from '@/i18n/context';
import { useReviews } from '@/hooks/useReviews';
import { Star, Search, ThumbsUp, ThumbsDown, MessageSquare, Clock, ChevronDown, ChevronUp } from 'lucide-react';

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const s = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`${s} ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'}`} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { t } = useI18n();
  const { reviews, loading, error, fetchReviews } = useReviews();
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { fetchReviews(); }, []);

  const filtered = reviews.filter(r => {
    const name = r.customer?.name?.toLowerCase() || '';
    const comment = r.comment?.toLowerCase() || '';
    const q = search.toLowerCase();
    return (name.includes(q) || comment.includes(q)) && (!ratingFilter || r.rating === Number(ratingFilter));
  });

  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) : 0;
  const distribution = [0, 0, 0, 0, 0];
  reviews.forEach(r => { distribution[r.rating - 1]++; });
  const maxDist = Math.max(...distribution, 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{t.dashboard.reviews.title}</h2>
          <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.reviews.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-3xl border border-border/50 p-8 text-center shadow-sm hover:border-amber-500/30 transition-all flex flex-col justify-center items-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-6xl font-extrabold text-foreground mb-3">{avgRating.toFixed(1)}</p>
          <div className="flex justify-center mb-4"><StarRating rating={Math.round(avgRating)} size="lg" /></div>
          <p className="text-sm font-medium text-muted-foreground">{reviews.length} {t.dashboard.reviews.totalReviews}</p>
        </div>
        <div className="lg:col-span-3 bg-card rounded-3xl border border-border/50 p-8 shadow-sm flex flex-col justify-center hover:border-amber-500/30 transition-all">
          <div className="space-y-3.5">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-4">
                <span className="text-sm font-bold text-muted-foreground w-4">{star}</span>
                <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
                <div className="flex-1 h-3 bg-muted/50 rounded-full overflow-hidden border border-border/30">
                  <div className={`h-full rounded-full transition-all ${star >= 4 ? 'bg-emerald-500' : star === 3 ? 'bg-amber-400' : 'bg-rose-500'}`} style={{ width: `${(distribution[star - 1] / maxDist) * 100}%` }} />
                </div>
                <span className="text-sm font-bold text-foreground w-8 text-right">{distribution[star - 1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card rounded-3xl border border-border/50 p-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input className="pl-12 h-12 bg-muted/30 border-0 focus-visible:ring-amber-500 rounded-2xl font-medium" placeholder={t.dashboard.reviews.searchReviews} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-12 bg-muted/30 border-0 focus:ring-amber-500 rounded-2xl font-semibold">
            <SelectValue placeholder={t.dashboard.reviews.allRatings} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.dashboard.reviews.allRatings}</SelectItem>
            {[5, 4, 3, 2, 1].map(s => <SelectItem key={s} value={String(s)} className="font-medium">{s} {t.dashboard.reviews.stars}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-rose-500 text-sm font-bold">{error}</p>
          <Button variant="outline" onClick={fetchReviews} className="h-11 px-6 rounded-xl border-border/50">{t.dashboard.reviews.retry}</Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed border-border/50 rounded-3xl">
          <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4"><MessageSquare className="w-8 h-8 opacity-50" /></div>
          <p className="font-bold text-lg text-foreground mb-1">{t.dashboard.reviews.noReviews}</p>
          <p className="text-sm font-medium">{t.dashboard.reviews.reviewsWillAppear}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(review => (
            <div key={review.id} className="bg-card rounded-3xl border border-border/50 p-6 shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all flex flex-col group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 shadow-sm border border-border/50">
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-base font-extrabold">
                      {(review.customer?.name || 'A').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base font-bold text-foreground">{review.customer?.name || t.dashboard.reviews.anonymous}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs font-medium text-muted-foreground flex items-center bg-muted/50 px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3 mr-1.5" />{new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 flex-1">
                {review.comment ? (
                  <>
                    <p className={`text-base font-medium text-foreground/80 leading-relaxed ${expanded !== review.id && review.comment.length > 120 ? 'line-clamp-3' : ''}`}>
                      "{review.comment}"
                    </p>
                    {review.comment.length > 120 && (
                      <button className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-2 flex items-center hover:text-amber-700 transition-colors" onClick={() => setExpanded(expanded === review.id ? null : review.id)}>
                        {expanded === review.id ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                        {expanded === review.id ? t.dashboard.reviews.showLess : t.dashboard.reviews.readMore}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-medium text-muted-foreground italic opacity-50">No written feedback provided.</p>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-border/50 flex justify-end">
                  <Badge className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border-0 shadow-sm ${review.rating >= 4 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : review.rating <= 2 ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                    {review.rating >= 4 ? <ThumbsUp className="w-3.5 h-3.5 mr-1.5 inline" /> : <ThumbsDown className="w-3.5 h-3.5 mr-1.5 inline" />}
                    {review.rating >= 4 ? t.dashboard.reviews.positive : review.rating <= 2 ? t.dashboard.reviews.negative : t.dashboard.reviews.neutral}
                  </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
