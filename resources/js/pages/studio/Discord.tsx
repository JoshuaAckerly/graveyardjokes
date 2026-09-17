import InertiaHead from '@/Components/InertiaHead';
import Reveal from '@/Components/Reveal';
import MainLayout from '@/Layouts/MainLayout';

interface DiscordPost {
    id: number;
    title: string;
    content: string;
    author: string | null;
    channel: string | null;
    jump_url: string | null;
    image_url: string | null;
    posted_at: string | null;
}

interface Props {
    posts: DiscordPost[];
}

const discordLogoPath =
    'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z';

function formatDate(value: string | null): string | null {
    if (!value) return null;
    return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function DiscordCard({ post }: { post: DiscordPost }) {
    const date = formatDate(post.posted_at);

    return (
        <article className="overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:border-[var(--primary)]/40">
            {post.image_url && <img src={post.image_url} alt={post.title} className="h-48 w-full object-cover" />}
            <div className="p-6">
                <div className="mb-2 flex items-center gap-2 text-xs text-white/40">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[var(--primary)]" fill="currentColor" aria-hidden="true">
                        <path d={discordLogoPath} />
                    </svg>
                    {post.channel && <span>#{post.channel}</span>}
                    {date && <span>{date}</span>}
                    {post.author && <span>· {post.author}</span>}
                </div>

                <h2 className="mb-2 font-serif text-lg leading-snug font-semibold text-white">{post.title}</h2>
                <p className="line-clamp-4 text-sm whitespace-pre-line text-white/60">{post.content}</p>

                {post.jump_url && (
                    <a
                        href={post.jump_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline"
                    >
                        View in Discord ↗
                    </a>
                )}
            </div>
        </article>
    );
}

export default function DiscordPage({ posts }: Props) {
    const discordInvite = import.meta.env.VITE_DISCORD_INVITE_URL as string | undefined;

    return (
        <MainLayout>
            <>
                <InertiaHead />

                <section className="relative z-0 mx-auto max-w-3xl px-6 py-20 text-white sm:px-10">
                    <div className="mb-12 flex flex-col gap-4 text-center">
                        <p className="font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">Studio</p>
                        <h1 className="font-serif text-5xl font-bold text-white">Discord</h1>
                        <p className="font-serif text-lg text-white/60">Announcements and updates from our server.</p>
                        {discordInvite && (
                            <a
                                href={discordInvite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mx-auto inline-flex items-center gap-2 rounded-md border border-[var(--primary)]/50 px-4 py-2 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)]/10"
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                                    <path d={discordLogoPath} />
                                </svg>
                                Join our Discord
                            </a>
                        )}
                    </div>

                    {posts.length === 0 ? (
                        <div className="rounded-lg border border-white/10 bg-white/5 p-10 text-center">
                            <svg
                                viewBox="0 0 24 24"
                                className="mx-auto mb-4 h-12 w-12 text-[var(--primary)]/50"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d={discordLogoPath} />
                            </svg>
                            <p className="text-white/50">No posts yet — join the server to stay in the loop.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {posts.map((post, i) => (
                                <Reveal as="div" key={post.id} delay={i * 0.05}>
                                    <DiscordCard post={post} />
                                </Reveal>
                            ))}
                        </div>
                    )}
                </section>
            </>
        </MainLayout>
    );
}
