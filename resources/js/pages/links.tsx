import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Gamepad2, Instagram, Music2 } from 'lucide-react';

type LinkItem = {
    name: string;
    handle: string;
    href: string;
    external?: boolean;
};

// Real Graveyard Jokes profiles (shared with the Studio social hub).
const socialLinks: LinkItem[] = [
    { name: 'TikTok', handle: '@graveyardjokes', href: 'https://www.tiktok.com/@graveyardjokes', external: true },
    { name: 'Instagram', handle: '@graveyardjokes', href: 'https://www.instagram.com/graveyardjokes', external: true },
    { name: 'Facebook', handle: '/graveyardjokes', href: 'https://www.facebook.com/graveyardjokes', external: true },
];

const exploreLinks: { name: string; desc: string; href: string; icon: React.ReactNode; external?: boolean }[] = [
    { name: 'Games', desc: 'Noteleks and other things being built.', href: '/studio', icon: <Gamepad2 className="h-5 w-5" /> },
];

export default function Links() {
    return (
        <MainLayout>
            <>
                <InertiaHead />

                <section className="relative z-0 mx-auto flex max-w-xl flex-col items-center gap-10 rounded-lg bg-[var(--color-foreground)] p-6 text-white shadow-lg sm:p-10">
                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <p className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold tracking-widest text-[var(--accent)] uppercase">
                            <Music2 className="h-4 w-4" /> Links
                        </p>
                        <h1 className="text-5xl font-extrabold text-[var(--accent)]">Graveyard Jokes</h1>
                        <p className="mt-4 text-lg text-white/70">
                            Songs written together, one at a time. Nothing recorded yet — this is where it will show up when it is
                            ready. For now, here is where to find things.
                        </p>
                    </motion.div>

                    {/* Social links */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="w-full space-y-3"
                    >
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                target={link.external ? '_blank' : undefined}
                                rel={link.external ? 'noopener noreferrer' : undefined}
                                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-5 py-4 transition hover:border-[var(--accent)]"
                            >
                                <span className="flex items-center gap-3">
                                    {link.name === 'Instagram' && <Instagram className="h-5 w-5 text-[var(--accent)]" />}
                                    <span>
                                        <span className="block text-sm font-semibold text-white">{link.name}</span>
                                        <span className="block text-xs text-white/50">{link.handle}</span>
                                    </span>
                                </span>
                                <ArrowUpRight className="h-4 w-4 text-white/40" />
                            </a>
                        ))}
                    </motion.div>

                    {/* Explore (games / builds) */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="w-full space-y-3"
                    >
                        {exploreLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-5 py-4 transition hover:border-[var(--accent)]"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="text-[var(--accent)]">{link.icon}</span>
                                    <span>
                                        <span className="block text-sm font-semibold text-white">{link.name}</span>
                                        <span className="block text-xs text-white/50">{link.desc}</span>
                                    </span>
                                </span>
                                <ArrowUpRight className="h-4 w-4 text-white/40" />
                            </Link>
                        ))}
                    </motion.div>
                </section>
            </>
        </MainLayout>
    );
}
