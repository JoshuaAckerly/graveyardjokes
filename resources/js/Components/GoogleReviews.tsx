import { type Review, type ReviewsResponse, type StarRating } from '@/types/business-profile';
import { useEffect, useState } from 'react';

const STAR_MAP: Record<StarRating, number> = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
};

function StarDisplay({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
    const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
    return (
        <span className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className={`${sizeClass} shrink-0`} viewBox="0 0 20 20" aria-hidden="true">
                    <polygon
                        points="10,1 12.9,7 19.5,7.6 14.7,12 16.4,18.5 10,15 3.6,18.5 5.3,12 0.5,7.6 7.1,7"
                        fill={i <= rating ? 'var(--primary, #a855f7)' : 'none'}
                        stroke="var(--primary, #a855f7)"
                        strokeWidth="1.5"
                    />
                </svg>
            ))}
        </span>
    );
}

function ReviewCard({ review }: { review: Review }) {
    const stars = STAR_MAP[review.starRating] ?? 0;
    const date = new Date(review.createTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div className="flex flex-col gap-3 rounded-lg border border-(--accent) bg-(--card) p-5 shadow-sm">
            <div className="flex items-center gap-3">
                {review.reviewer.profilePhotoUrl ? (
                    <img
                        src={review.reviewer.profilePhotoUrl}
                        alt={review.reviewer.displayName}
                        className="h-10 w-10 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--primary)/20 text-sm font-bold text-(--primary)">
                        {review.reviewer.isAnonymous ? '?' : review.reviewer.displayName.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                        {review.reviewer.isAnonymous ? 'Anonymous' : review.reviewer.displayName}
                    </span>
                    <span className="text-xs text-gray-400">{date}</span>
                </div>
                <div className="ml-auto">
                    <StarDisplay rating={stars} />
                </div>
            </div>

            {review.comment && <p className="text-sm leading-relaxed text-gray-300">{review.comment}</p>}

            {review.reviewReply && (
                <div className="rounded border-l-2 border-(--primary) bg-(--foreground)/50 pl-3 pt-2 pb-2 pr-3">
                    <p className="mb-1 text-xs font-semibold text-(--primary)">Response from owner</p>
                    <p className="text-xs text-gray-400">{review.reviewReply.comment}</p>
                </div>
            )}
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="flex flex-col gap-3 rounded-lg border border-(--accent) bg-(--card) p-5 shadow-sm animate-pulse">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-700" />
                <div className="flex flex-col gap-1.5">
                    <div className="h-3 w-28 rounded bg-gray-700" />
                    <div className="h-2.5 w-16 rounded bg-gray-700" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 w-full rounded bg-gray-700" />
                <div className="h-3 w-4/5 rounded bg-gray-700" />
            </div>
        </div>
    );
}

export default function GoogleReviews() {
    const [data, setData] = useState<ReviewsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        fetch('/api/business/reviews')
            .then((r) => {
                if (!r.ok) throw new Error('non-ok');
                return r.json() as Promise<ReviewsResponse>;
            })
            .then((json) => {
                if (!cancelled) setData(json);
            })
            .catch(() => {
                if (!cancelled) setError(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const reviews = data?.reviews ?? [];
    const totalCount = data?.totalReviewCount ?? reviews.length;
    const avgRating =
        data?.averageRating ??
        (reviews.length > 0 ? Math.round((reviews.reduce((sum, r) => sum + (STAR_MAP[r.starRating] ?? 0), 0) / reviews.length) * 10) / 10 : null);

    if (error) return null;

    return (
        <section className="py-12">
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">What Our Clients Say</h2>
                {!loading && avgRating !== null && (
                    <div className="flex items-center gap-2">
                        <StarDisplay rating={Math.round(avgRating)} size="lg" />
                        <span className="text-lg font-semibold text-white">{avgRating}</span>
                        {totalCount > 0 && <span className="text-sm text-gray-400">({totalCount} reviews)</span>}
                    </div>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                    : reviews.map((review) => <ReviewCard key={review.reviewId} review={review} />)}
            </div>
        </section>
    );
}
