import InertiaHead from '@/Components/InertiaHead';
import Reveal from '@/Components/Reveal';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image: string | null;
    author: string | null;
    published_at: string;
}

interface Props {
    posts: BlogPost[];
}

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogIndex({ posts }: Props) {
    return (
        <MainLayout>
            <>
                <InertiaHead />

                <section className="relative z-0 mx-auto max-w-3xl px-6 py-20 text-white sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-12 text-center"
                    >
                        <p className="mb-3 font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">Studio</p>
                        <h1 className="font-serif text-5xl font-bold text-white">Blog</h1>
                        <p className="mt-4 font-serif text-lg text-white/60">Notes and updates from the studio.</p>
                    </motion.div>

                    {posts.length === 0 ? (
                        <p className="text-center text-white/50">No posts yet — check back soon.</p>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {posts.map((post, i) => (
                                <Reveal
                                    as="article"
                                    key={post.id}
                                    delay={i * 0.05}
                                    className="rounded-lg border border-white/10 bg-white/5 p-6 transition hover:border-[var(--primary)]/40"
                                >
                                    {post.featured_image && (
                                        <Link href={`/studio/blog/${post.slug}`}>
                                            <img
                                                src={post.featured_image}
                                                alt={post.title}
                                                className="mb-4 h-48 w-full rounded-md object-cover"
                                            />
                                        </Link>
                                    )}
                                    <div className="mb-2 flex items-center gap-3 text-xs text-white/40">
                                        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                                        {post.author && <span>· {post.author}</span>}
                                    </div>
                                    <h2 className="mb-2 font-serif text-xl leading-snug font-semibold text-white">
                                        <Link href={`/studio/blog/${post.slug}`} className="hover:text-[var(--primary)]">
                                            {post.title}
                                        </Link>
                                    </h2>
                                    {post.excerpt && <p className="mb-4 line-clamp-3 text-sm text-white/60">{post.excerpt}</p>}
                                    <Link
                                        href={`/studio/blog/${post.slug}`}
                                        className="text-sm font-medium text-[var(--primary)] hover:underline"
                                    >
                                        Read more →
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    )}
                </section>
            </>
        </MainLayout>
    );
}
