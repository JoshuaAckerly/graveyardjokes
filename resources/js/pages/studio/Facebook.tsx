import InertiaHead from '@/Components/InertiaHead';
import Reveal from '@/Components/Reveal';
import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';

interface FacebookPost {
    id: number;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    post_url: string;
    posted_at: string | null;
}

interface Props {
    posts: FacebookPost[];
}

const facebookLogoPath =
    'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z';

function formatDate(value: string | null): string | null {
    if (!value) return null;
    return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function FacebookCard({ post }: { post: FacebookPost }) {
    const date = formatDate(post.posted_at);

    return (
        <article className="overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:border-[var(--primary)]/40">
            {post.thumbnail_url && <img src={post.thumbnail_url} alt={post.title} className="h-48 w-full object-cover" />}
            <div className="p-5">
                <div className="mb-2 flex items-center gap-2 text-xs text-white/40">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[var(--primary)]" fill="currentColor" aria-hidden="true">
                        <path d={facebookLogoPath} />
                    </svg>
                    {date && <time>{date}</time>}
                </div>
                <h2 className="mb-2 line-clamp-2 font-serif text-base leading-snug font-semibold text-white">{post.title}</h2>
                {post.description && <p className="line-clamp-4 text-sm whitespace-pre-line text-white/60">{post.description}</p>}
                <a
                    href={post.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline"
                >
                    View on Facebook &rarr;
                </a>
            </div>
        </article>
    );
}

export default function FacebookPage({ posts }: Props) {
    return (
        <MainLayout>
            <>
                <InertiaHead>
                    <title>Facebook — Graveyard Jokes Studio</title>
                    <meta name="description" content="Photos and posts from the Graveyard Jokes Facebook page." />
                </InertiaHead>

                <section className="relative z-0 mx-auto max-w-5xl px-6 py-20 text-white sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-12 text-center"
                    >
                        <p className="mb-3 font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">Studio</p>
                        <h1 className="flex items-center justify-center gap-3 font-serif text-5xl font-bold text-white">
                            <svg viewBox="0 0 24 24" className="h-9 w-9 text-[var(--primary)]" fill="currentColor" aria-hidden="true">
                                <path d={facebookLogoPath} />
                            </svg>
                            Facebook
                        </h1>
                        <p className="mt-4 font-serif text-lg text-white/60">Photos and posts from the page.</p>
                        <a
                            href="https://www.facebook.com/graveyardjokes"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-block text-sm font-medium text-[var(--primary)] hover:underline"
                        >
                            Follow on Facebook &rarr;
                        </a>
                    </motion.div>

                    {posts.length === 0 ? (
                        <p className="text-center text-white/50">No posts yet — check back soon.</p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post, i) => (
                                <Reveal key={post.id} delay={(i % 6) * 0.05}>
                                    <FacebookCard post={post} />
                                </Reveal>
                            ))}
                        </div>
                    )}
                </section>
            </>
        </MainLayout>
    );
}
