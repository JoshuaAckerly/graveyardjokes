import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    featured_image: string | null;
    author: string | null;
    published_at: string;
}

interface Props {
    post: BlogPost;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogShow({ post }: Props) {
    return (
        <MainLayout>
            <>
                <InertiaHead />

                <article className="relative z-0 mx-auto max-w-3xl px-6 py-20 text-white sm:px-10">
                    <Link
                        href="/studio/blog"
                        className="mb-8 inline-flex items-center gap-1 text-sm text-white/50 transition hover:text-white"
                    >
                        ← Back to Blog
                    </Link>

                    {post.featured_image && (
                        <img src={post.featured_image} alt={post.title} className="mb-8 h-64 w-full rounded-lg object-cover" />
                    )}

                    <div className="mb-4 flex items-center gap-3 text-xs text-white/40">
                        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                        {post.author && <span>· {post.author}</span>}
                    </div>

                    <h1 className="mb-6 font-serif text-4xl leading-tight font-bold text-white">{post.title}</h1>

                    {post.excerpt && (
                        <p className="mb-8 border-l-2 border-[var(--primary)] pl-4 font-serif text-lg text-white/60 italic">
                            {post.excerpt}
                        </p>
                    )}

                    <div
                        className="prose prose-invert max-w-none prose-headings:font-serif prose-a:text-[var(--primary)]"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </>
        </MainLayout>
    );
}
