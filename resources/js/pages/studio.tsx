import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Code2, Globe, Layers, Palette } from 'lucide-react';
import { getProjectUrl } from '../env';

export default function Studio() {
    const studioUrl = getProjectUrl('studio');

    const focuses = [
        {
            icon: <Code2 className="h-6 w-6" />,
            title: 'Full-Stack Architecture',
            body: 'Laravel, Inertia.js, React, and TypeScript — every project built on a clean, maintainable foundation.',
        },
        {
            icon: <Globe className="h-6 w-6" />,
            title: 'Platform & Product Development',
            body: 'Custom streaming, publishing, event management, and community tools built for independent brands and growing ventures.',
        },
        {
            icon: <Palette className="h-6 w-6" />,
            title: 'Brand-Driven Design',
            body: 'Interfaces built with personality. Fast, accessible, and memorable — no templates.',
        },
        {
            icon: <Layers className="h-6 w-6" />,
            title: 'Portfolio Ecosystem',
            body: 'Six live sister platforms — The Velvet Pulse, Hollow Press, Lunar Blood, Velvet Radio, Synth Veil — all running in production.',
        },
    ];

    const platforms = [
        { name: 'The Velvet Pulse', slug: 'thevelvetpulse', desc: 'Artist newsletter & music platform' },
        { name: 'Hollow Press', slug: 'hollowpress', desc: 'CMS and publishing platform' },
        { name: 'Lunar Blood', slug: 'lunarblood', desc: 'Event & show management' },
        { name: 'Velvet Radio', slug: 'velvetradio', desc: 'Live streaming radio' },
        { name: 'Synth Veil', slug: 'synthveil', desc: 'SSR-optimized creative platform' },
    ];

    return (
        <MainLayout>
            <>
                <InertiaHead />

                <section className="relative z-0 flex flex-col items-center gap-12 rounded-lg bg-[var(--color-foreground)] p-6 text-white shadow-lg sm:p-10">
                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl text-center"
                    >
                        <p className="mb-2 text-sm font-semibold tracking-widest text-[var(--accent)] uppercase">Creative Studio</p>
                        <h1 className="text-5xl font-extrabold text-[var(--accent)]">Graveyard Jokes Studios</h1>
                        <p className="mt-4 text-lg text-white/70">
                            A small creative web development studio building custom platforms for entrepreneurs, creatives, and independent brands.
                            Every project is hand-crafted — no page builders, no shortcuts.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-4">
                            <a
                                href={studioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-3 font-semibold text-black transition hover:opacity-90"
                            >
                                Visit Studio Lab <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                            >
                                View Services
                            </Link>
                        </div>
                    </motion.div>

                    {/* Focus areas */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="w-full max-w-4xl"
                    >
                        <h2 className="mb-6 text-center text-2xl font-bold text-white">What We Build</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {focuses.map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-lg border border-white/10 bg-white/5 p-6 transition hover:border-[var(--accent)]/40"
                                >
                                    <div className="mb-3 flex items-center gap-3 text-[var(--accent)]">
                                        {item.icon}
                                        <h3 className="font-semibold text-white">{item.title}</h3>
                                    </div>
                                    <p className="text-sm text-white/60">{item.body}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Live platforms */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="w-full max-w-4xl"
                    >
                        <h2 className="mb-6 text-center text-2xl font-bold text-white">Live Platforms</h2>
                        <ul className="divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                            {platforms.map((p) => (
                                <li key={p.slug}>
                                    <a
                                        href={getProjectUrl(p.slug)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between px-6 py-4 transition hover:bg-white/10"
                                    >
                                        <div>
                                            <p className="font-semibold text-white">{p.name}</p>
                                            <p className="text-sm text-white/50">{p.desc}</p>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40 transition group-hover:text-[var(--accent)]" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        className="w-full max-w-4xl rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-8 text-center"
                    >
                        <h2 className="text-2xl font-bold text-white">Want Something Built?</h2>
                        <p className="mt-2 text-white/60">We take on custom web projects for entrepreneurs, creatives, and independent brands.</p>
                        <Link
                            href="/contact"
                            className="mt-6 inline-block rounded-lg bg-[var(--accent)] px-8 py-3 font-semibold text-black transition hover:opacity-90"
                        >
                            Start a Conversation
                        </Link>
                    </motion.div>
                </section>
            </>
        </MainLayout>
    );
}
