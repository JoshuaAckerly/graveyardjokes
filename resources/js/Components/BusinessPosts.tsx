import { type LocalPost, type PostsResponse } from '@/types/business-profile';
import { useEffect, useState } from 'react';

const ACTION_TYPE_LABELS: Record<string, string> = {
    BOOK: 'Book Now',
    ORDER: 'Order Online',
    SHOP: 'Shop Now',
    LEARN_MORE: 'Learn More',
    SIGN_UP: 'Sign Up',
    CALL: 'Call Now',
    GET_OFFER: 'Get Offer',
};

function PostCard({ post }: { post: LocalPost }) {
    const date = new Date(post.createTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    const thumb = post.media?.[0]?.thumbnailUrl ?? post.media?.[0]?.sourceUrl;
    const ctaLabel = post.callToAction ? (ACTION_TYPE_LABELS[post.callToAction.actionType] ?? 'Learn More') : null;

    return (
        <div className="flex flex-col overflow-hidden rounded-lg border border-(--accent) bg-(--card) shadow-sm">
            {thumb && <img src={thumb} alt="" className="h-40 w-full object-cover" loading="lazy" />}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="text-xs text-gray-500">{date}</p>
                <p className="flex-1 text-sm leading-relaxed text-gray-300">{post.summary}</p>
                {post.callToAction && (
                    <a
                        href={post.callToAction.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-start rounded-md border border-(--primary) px-4 py-1.5 text-xs font-semibold text-(--primary) transition hover:bg-(--primary) hover:text-white"
                    >
                        {ctaLabel}
                    </a>
                )}
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="flex animate-pulse flex-col overflow-hidden rounded-lg border border-(--accent) bg-(--card)">
            <div className="h-40 w-full bg-gray-700" />
            <div className="flex flex-col gap-3 p-4">
                <div className="h-2.5 w-20 rounded bg-gray-700" />
                <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-gray-700" />
                    <div className="h-3 w-3/4 rounded bg-gray-700" />
                </div>
            </div>
        </div>
    );
}

export default function BusinessPosts() {
    const [data, setData] = useState<PostsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        fetch('/api/business/posts')
            .then((r) => (r.ok ? (r.json() as Promise<PostsResponse>) : Promise.reject()))
            .then((json) => {
                if (!cancelled) setData(json);
            })
            .catch(() => {
                // Silently fail — no posts to show
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const posts = (data?.localPosts ?? []).slice(0, 3);

    if (!loading && posts.length === 0) return null;

    return (
        <section className="py-10">
            <h2 className="mb-6 text-center text-2xl font-bold text-white sm:text-3xl">Latest Updates</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                    : posts.map((post) => <PostCard key={post.name} post={post} />)}
            </div>
        </section>
    );
}
