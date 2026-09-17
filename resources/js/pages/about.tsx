import InertiaHead from '@/Components/InertiaHead';
import Reveal from '@/Components/Reveal';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <MainLayout>
            <>
                <InertiaHead />

                <section className="relative z-0 mx-auto flex max-w-3xl flex-col items-center gap-12 rounded-lg bg-[var(--color-foreground)] px-6 py-20 text-white shadow-lg sm:px-10">
                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <p className="mb-4 font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">About</p>
                        <h1 className="font-serif text-5xl leading-tight font-bold text-white sm:text-6xl">Graveyard Jokes</h1>
                        <p className="mx-auto mt-6 max-w-xl font-serif text-lg leading-relaxed text-white/70">
                            A songwriting project — two people writing songs together, one at a time.
                        </p>
                    </motion.div>

                    {/* Story */}
                    <div className="w-full max-w-2xl space-y-8">
                        <Reveal as="p" className="text-base leading-relaxed text-white/70 sm:text-lg">
                            Graveyard Jokes is a small, low-key thing. Two of us — a writing team — sit down and put songs
                            together. Acoustic, unhurried, written for their own sake before anything else.
                        </Reveal>
                        <Reveal as="p" delay={0.05} className="text-base leading-relaxed text-white/70 sm:text-lg">
                            There are no shows yet, and nothing recorded to share. That is honest, not modest — this is the
                            beginning of it. When there is something worth hearing, this is where it will live.
                        </Reveal>
                        <Reveal as="p" delay={0.1} className="text-base leading-relaxed text-white/70 sm:text-lg">
                            Alongside the music, Graveyard Jokes is also home to a few games and small things being built along
                            the way. It is all part of the same creative habit — make things, keep going, share when it is
                            ready.
                        </Reveal>
                    </div>

                    {/* CTA */}
                    <Reveal className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/studio"
                            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 font-serif text-sm tracking-wide text-white/90 transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                        >
                            Where to find us
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 font-serif text-sm tracking-wide text-white/90 transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                        >
                            Say hello
                        </Link>
                    </Reveal>
                </section>
            </>
        </MainLayout>
    );
}
