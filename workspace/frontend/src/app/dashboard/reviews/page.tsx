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
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-6 text-center">
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{avgRating.toFixed(1)}</p>
          <div className="flex justify-center my-2"><StarRating rating={Math.round(avgRating)} size="lg" /></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{reviews.length} total reviews</p>
        </div>
        <div className="lg:col-span-3 bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6 text-right">{star}</span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(distribution[star - 1] / maxDist) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 w-8">{distribution[star - 1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input className="pl-9 h-9 text-sm" placeholder="Search reviews..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue placeholder="All Ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Ratings</SelectItem>
            {[5, 4, 3, 2, 1].map(s => <SelectItem key={s} value={String(s)}>{s} Stars</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <p className="text-red-500 text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchReviews}>Retry</Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-500">
          <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
          <p className="font-medium text-sm">No reviews yet</p>
          <p className="text-xs">Customer reviews will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(review => (
            <div key={review.id} className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs">
                      {(review.customer?.name || 'A').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{review.customer?.name || 'Anonymous'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />{new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={`text-[10px] ${review.rating >= 4 ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20' : review.rating <= 2 ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'}`}>
                  {review.rating >= 4 ? <ThumbsUp className="w-3 h-3 mr-1 inline" /> : <ThumbsDown className="w-3 h-3 mr-1 inline" />}
                  {review.rating >= 4 ? 'Positive' : review.rating <= 2 ? 'Negative' : 'Neutral'}
                </Badge>
              </div>
              {review.comment && (
                <div className="mt-3">
                  <p className={`text-sm text-gray-500 dark:text-gray-400 ${expanded !== review.id && review.comment.length > 120 ? 'line-clamp-2' : ''}`}>
                    {review.comment}
                  </p>
                  {review.comment.length > 120 && (
                    <button className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center" onClick={() => setExpanded(expanded === review.id ? null : review.id)}>
                      {expanded === review.id ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                      {expanded === review.id ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
