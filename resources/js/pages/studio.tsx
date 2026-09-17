import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Gamepad2, Music2, PenLine } from 'lucide-react';
import { getProjectUrl } from '../env';

export default function Studio() {
    const focuses = [
        {
            icon: <PenLine className="h-6 w-6" />,
            title: 'Songwriting',
            body: 'The core of it — two people writing songs together, one at a time. Acoustic, unhurried.',
        },
        {
            icon: <Gamepad2 className="h-6 w-6" />,
            title: 'Games',
            body: 'Small game projects built under the Graveyard Jokes name, like Noteleks.',
        },
        {
            icon: <Music2 className="h-6 w-6" />,
            title: 'Whatever comes next',
            body: 'A place to make things and keep going. More will show up here as it is ready.',
        },
    ];

    const projects = [{ name: 'Noteleks', slug: 'noteleks', desc: 'A game being built under Graveyard Jokes' }];

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
                        <p className="mb-2 font-serif text-sm tracking-widest text-[var(--accent)] uppercase">Behind the scenes</p>
                        <h1 className="font-serif text-5xl font-extrabold text-[var(--accent)]">The Studio</h1>
                        <p className="mt-4 text-lg text-white/70">
                            The workspace behind Graveyard Jokes — where the songs get written and the side projects get made.
                            Vlogs, notes, feeds, and works in progress.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-4">
                            <Link
                                href="/studio/blog"
                                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-3 font-semibold text-black transition hover:opacity-90"
                            >
                                Read the Blog <ArrowUpRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/links"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                            >
                                Find us
                            </Link>
                        </div>
                    </motion.div>

                    {/* Studio sections */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="w-full max-w-4xl"
                    >
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {[
                                { name: 'Blog', href: '/studio/blog' },
                                { name: 'Video Log', href: '/studio/video-log' },
                                { name: 'Illustrations', href: '/studio/illustrations' },
                                { name: 'Instagram', href: '/studio/instagram' },
                                { name: 'Facebook', href: '/studio/facebook' },
                                { name: 'Discord', href: '/studio/discord' },
                            ].map((s) => (
                                <Link
                                    key={s.href}
                                    href={s.href}
                                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-5 py-4 font-serif text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                                >
                                    {s.name}
                                    <ArrowUpRight className="h-4 w-4 text-white/40" />
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Focus areas */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="w-full max-w-4xl"
                    >
                        <h2 className="mb-6 text-center text-2xl font-bold text-white">What happens here</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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

                    {/* Projects */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="w-full max-w-4xl"
                    >
                        <h2 className="mb-6 text-center text-2xl font-bold text-white">Being built</h2>
                        <ul className="divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                            {projects.map((p) => (
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
                                        <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </section>
            </>
        </MainLayout>
    );
}
