import Preloader from '@/Components/Preloader';
import Reveal from '@/Components/Reveal';
import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { useGSAP } from '@gsap/react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { JSX, useEffect, useRef, useState } from 'react';
import { getEnvVar } from '../env';

gsap.registerPlugin(ScrollTrigger);

export default function Home(): JSX.Element {
    const cdn = getEnvVar('VITE_ASSET_URL');
    const heroRef = useRef<HTMLDivElement>(null);
    const heroBgRef = useRef<HTMLImageElement>(null);

    // GSAP: hero parallax + scroll-triggered section reveals + card tilt
    useGSAP(
        () => {
            // Hero background parallax
            if (heroBgRef.current) {
                gsap.to(heroBgRef.current, {
                    yPercent: 30,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    },
                });
            }

            // Scroll-triggered stagger reveals on section headings + cards
            gsap.utils.toArray<HTMLElement>('.gjk-reveal').forEach((el) => {
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } },
                );
            });

            // 3D tilt on cards
            document.querySelectorAll<HTMLElement>('.gjk-card').forEach((card) => {
                const onMove = (e: MouseEvent) => {
                    const rect = card.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const rx = ((e.clientY - cy) / rect.height) * -12;
                    const ry = ((e.clientX - cx) / rect.width) * 12;
                    gsap.to(card, { rotationX: rx, rotationY: ry, transformPerspective: 800, duration: 0.3, ease: 'power1.out' });
                };
                const onLeave = () => {
                    gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
                };
                card.addEventListener('mousemove', onMove);
                card.addEventListener('mouseleave', onLeave);
            });
        },
        { scope: heroRef, dependencies: [] },
    );

    const [joke, setJoke] = useState<{ id?: string; setup?: string; punchline?: string; category?: string } | null>(null);
    const [loadingJoke, setLoadingJoke] = useState(false);

    const fetchJoke = async () => {
        try {
            setLoadingJoke(true);
            const base = typeof window !== 'undefined' ? window.location.origin : '';
            const res = await fetch(`${base}/api/random-joke`);
            if (!res.ok) throw new Error('Failed to fetch joke');
            const data = await res.json();
            setJoke(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingJoke(false);
        }
    };

    useEffect(() => {
        fetchJoke();
    }, []);

    return (
        <MainLayout>
            <>
                <InertiaHead />
                <Preloader />

                <a href="/" className="sr-only">
                    Home Page
                </a>

                <div ref={heroRef} className="relative z-0 max-w-full bg-[var(--color-foreground)] text-center">
                    {/* Full-screen cinematic hero */}
                    <section className="relative flex h-screen min-h-[600px] w-full items-center justify-center overflow-hidden">
                        {/* Forest background with parallax */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                ref={heroBgRef}
                                src={`${cdn}/images/hero.webp`}
                                alt=""
                                aria-hidden="true"
                                className="pointer-events-none h-[120%] w-full object-cover will-change-transform"
                            />
                            {/* Cinematic darkening: bottom fade + overall veil for text legibility */}
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-foreground)] via-black/20 to-black/40" />
                        </div>

                        {/* Hero content */}
                        <div className="relative z-10 px-6">
                            <h1 className="sr-only">Graveyard Jokes</h1>
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="mb-6 font-serif text-xs tracking-[0.4em] text-white/70 uppercase sm:text-sm"
                            >
                                A songwriting project
                            </motion.p>

                            <motion.h2
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                className="font-serif text-6xl leading-[0.95] font-bold tracking-tight text-white sm:text-8xl lg:text-[10rem]"
                            >
                                Graveyard
                                <br />
                                <span className="text-[var(--primary)]">Jokes</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.7 }}
                                className="mx-auto mt-8 max-w-md font-serif text-base leading-relaxed text-white/70 sm:text-lg"
                            >
                                Two people writing songs together, one at a time. Nothing recorded yet — more as it comes.
                            </motion.p>
                        </div>

                        {/* Scroll cue */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1.2 }}
                            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
                        >
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                                className="flex flex-col items-center gap-2 text-white/50"
                            >
                                <span className="font-serif text-[0.65rem] tracking-[0.3em] uppercase">Scroll</span>
                                <span className="h-10 w-px bg-white/40" />
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* Content below the fold */}
                    <div className="relative z-10 space-y-4 px-6 pt-16 sm:px-12">
                        {/* Random Joke Section */}
                        <div className="mx-auto my-6 max-w-2xl text-center">
                            <div className="rounded-md bg-white/10 p-6 text-white">
                                <p className="text-lg sm:text-xl">
                                    {loadingJoke && 'Loading joke...'}
                                    {!loadingJoke && joke?.setup}
                                </p>
                                <p className="mt-3 text-sm opacity-70">{joke?.punchline}</p>
                                <div className="mt-4">
                                    <button
                                        onClick={fetchJoke}
                                        className="inline-flex items-center rounded bg-[var(--card)] px-4 py-2 text-white hover:bg-[var(--accent)]"
                                        aria-label="Another joke"
                                    >
                                        Another joke
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Intro — low-key musician note */}
                    <section className="relative z-10 mx-auto w-full max-w-3xl px-6 py-24 text-center sm:px-12">
                        <Reveal as="p" className="font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">
                            The short version
                        </Reveal>
                        <Reveal as="h2" delay={0.05} className="mt-6 font-serif text-3xl leading-snug text-white sm:text-4xl">
                            Two people writing songs together, one at a time.
                        </Reveal>
                        <Reveal as="p" delay={0.1} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
                            No shows, no recordings yet — just the writing, and a few games and things being built along the
                            way. More will show up here as it comes.
                        </Reveal>
                        <Reveal delay={0.15} className="mt-10">
                            <Link
                                href="/links"
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 font-serif text-sm tracking-wide text-white/90 transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                            >
                                Find us
                            </Link>
                        </Reveal>
                    </section>

                    {/* Footer Image */}
                    <div className="absolute bottom-0 z-5 max-h-96 w-full">
                        <motion.img
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                            src={`${cdn}/images/carousel-1.webp`}
                            loading="lazy"
                            alt="Footer Image"
                            className="pointer-events-none h-auto w-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-foreground)]"></div>
                    </div>
                </div>
            </>
        </MainLayout>
    );
}
