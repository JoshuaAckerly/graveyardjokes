import ApplicationLogo from '@/Components/applicationLogo';
import Carousel from '@/Components/carousel';
import ProjectCard from '@/Components/ProjectCard';
import portfolioItems from '@/data/portfolioItems';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { JSX, useEffect, useState } from 'react';

export default function Home(): JSX.Element {
    const cdn = import.meta.env.VITE_ASSET_URL;

    const handleClick = (): void => {
        router.visit('/contact');
    };

    const [joke, setJoke] = useState<{ id?: number; body?: string; author?: string } | null>(null);
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
                <Head>
                    <title>Graveyard Jokes Studios | Custom Websites for Musicians, Artists, and Creatives</title>
                    <meta
                        name="description"
                        content="Graveyard Jokes Studios builds custom websites for musicians, artists, and creatives — stand out online with tailored design and tech."
                    />
                    <meta
                        name="keywords"
                        content="custom websites, musicians, artists, creatives, web design, web development, portfolio, online presence"
                    />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />

                    {/* Canonical */}
                    <link rel="canonical" href="https://graveyardjokes.com/" />

                    {/* Open Graph */}
                    <meta property="og:title" content="Graveyard Jokes Studios | Custom Websites for Musicians, Artists, and Creatives" />
                    <meta
                        property="og:description"
                        content="Graveyard Jokes Studios builds custom websites for musicians, artists, and creatives — stand out online with tailored design and tech."
                    />
                    <meta property="og:image" content={`${cdn}/images/AdobeStock_327183052.webp`} />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://graveyardjokes.com/" />

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Graveyard Jokes Studios | Custom Websites for Musicians, Artists, and Creatives" />
                    <meta
                        name="twitter:description"
                        content="Graveyard Jokes Studios builds custom websites for musicians, artists, and creatives — stand out online with tailored design and tech."
                    />
                    <meta name="twitter:image" content={`${cdn}/images/AdobeStock_327183052.webp`} />

                    {/* Structured Data (JSON-LD) */}
                    <script type="application/ld+json">
                        {`
    {
      "@context": "https://schema.org",
      "@type": "Organization",
  "name": "GraveYard Jokes Studios Inc.",
      "url": "https://graveyardjokes.com",
      "logo": "${cdn}/images/logo.webp",
      "sameAs": [
        "https://www.linkedin.com/in/joshua-ackerly",
        "https://github.com/joshua-ackerly"
      ]
    }
    `}
                    </script>
                </Head>

                <a href="/" className="sr-only">
                    Home Page
                </a>

                <div className="relative z-0 max-w-full space-y-10 bg-[var(--color-foreground)] text-center">
                    {/* Pay Over Time Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-20 mx-auto my-8 max-w-2xl rounded-lg border-2 border-(--primary) bg-black/80 p-8 text-white shadow-xl"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-4xl">💀💸</span>
                            <h2 className="text-2xl font-bold">Pay Over Time with PayPal</h2>
                            <p className="mt-2 text-lg text-white/80">
                                Want a killer website but your wallet's feeling a little... lifeless? <br />
                                With PayPal's <span className="font-semibold text-(--primary)">Pay Over Time</span> options, you can break up your payments—no need to dig up your savings all at once!
                            </p>
                            <p className="mt-4 text-base text-white/60 italic">
                                "Even the Grim Reaper appreciates flexible payments. He says, 'Why pay it all now when you can pay it... over time?'"
                            </p>
                            <div className="mt-4 rounded bg-white/10 px-4 py-2 text-sm text-white/80">
                                Look for <span className="font-semibold text-(--primary)">Pay Later</span> at checkout!
                            </div>
                        </div>
                    </motion.section>
                    {/* Background Image and Gradient */}
                    <div className="absolute inset-0 max-h-96">
                        <img
                            src={`${cdn}/images/AdobeStock_327183052.webp`}
                            loading="lazy"
                            alt="Overlay Image"
                            className="pointer-events-none h-full w-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-foreground)] to-transparent"></div>
                    </div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 space-y-4 px-6 pt-12 sm:px-12"
                    >
                        <h1 className="sr-only">GraveYard Jokes Studios</h1>

                        <motion.h1
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:w-min-max bg-[var(--card)] p-12 text-4xl font-bold text-white sm:text-6xl lg:text-7xl"
                        >
                            GraveYard Jokes
                            <br />
                            Studios
                        </motion.h1>

                        <div className="block md:flex md:items-center md:justify-center md:space-x-6">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="mx-auto text-center text-lg text-white opacity-70 sm:text-xl md:w-1/2"
                            >
                                Custom websites for musicians, artists, and creatives who want to stand out online
                                <br />— whether you're promoting your latest album or building a portfolio to showcase your skills.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.8 }}
                                className="flex items-center justify-center md:w-1/2"
                            >
                                <ApplicationLogo logoSize="h-32 w-32 sm:h-48 sm:w-48 mx-auto" containerClasses="m-6" />
                            </motion.div>
                        </div>

                        {/* Random Joke Section */}
                        <div className="mx-auto my-6 max-w-2xl text-center">
                            <div className="rounded-md bg-white/10 p-6 text-white">
                                <p className="text-lg sm:text-xl">
                                    {loadingJoke && 'Loading joke...'}
                                    {!loadingJoke && joke?.body}
                                </p>
                                <p className="mt-3 text-sm opacity-70">{joke?.author}</p>
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
                    </motion.div>
                    {/* Services Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 mx-auto w-full max-w-6xl space-y-8 px-6 py-16 sm:px-12"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white sm:text-4xl">What I Offer</h2>
                            <p className="mt-4 text-lg text-white/70">Full-stack web development services tailored to your creative vision</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Service Card 1 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="rounded-lg bg-white/5 p-6 text-left shadow-lg transition-all hover:bg-white/10"
                            >
                                <div className="mb-4 text-3xl">🎨</div>
                                <h3 className="mb-2 text-xl font-semibold text-white">Custom Website Development</h3>
                                <p className="text-sm text-white/70">
                                    Fully custom websites built from scratch using modern technologies like Laravel, React, and TypeScript. Your
                                    unique vision, perfectly realized.
                                </p>
                            </motion.div>

                            {/* Service Card 2 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="rounded-lg bg-white/5 p-6 text-left shadow-lg transition-all hover:bg-white/10"
                            >
                                <div className="mb-4 text-3xl">🎭</div>
                                <h3 className="mb-2 text-xl font-semibold text-white">Portfolio & Showcase Sites</h3>
                                <p className="text-sm text-white/70">
                                    Beautiful, responsive portfolios that highlight your work. Perfect for artists, musicians, photographers, and
                                    creatives who need to make an impact.
                                </p>
                            </motion.div>

                            {/* Service Card 3 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="rounded-lg bg-white/5 p-6 text-left shadow-lg transition-all hover:bg-white/10"
                            >
                                <div className="mb-4 text-3xl">🛒</div>
                                <h3 className="mb-2 text-xl font-semibold text-white">E-commerce & Merch Stores</h3>
                                <p className="text-sm text-white/70">
                                    Sell your music, art, or merchandise online with a custom e-commerce solution. Integrated payments, inventory
                                    management, and seamless checkout.
                                </p>
                            </motion.div>

                            {/* Service Card 4 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="rounded-lg bg-white/5 p-6 text-left shadow-lg transition-all hover:bg-white/10"
                            >
                                <div className="mb-4 text-3xl">🚀</div>
                                <h3 className="mb-2 text-xl font-semibold text-white">Landing Pages & Promo Sites</h3>
                                <p className="text-sm text-white/70">
                                    High-converting landing pages for album releases, tours, events, or product launches. Fast, focused, and optimized
                                    to drive action.
                                </p>
                            </motion.div>

                            {/* Service Card 5 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="rounded-lg bg-white/5 p-6 text-left shadow-lg transition-all hover:bg-white/10"
                            >
                                <div className="mb-4 text-3xl">⚙️</div>
                                <h3 className="mb-2 text-xl font-semibold text-white">API Development & Integrations</h3>
                                <p className="text-sm text-white/70">
                                    Custom APIs and third-party integrations. Connect your site to Spotify, Shopify, payment processors, analytics,
                                    and more.
                                </p>
                            </motion.div>

                            {/* Service Card 6 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="rounded-lg bg-white/5 p-6 text-left shadow-lg transition-all hover:bg-white/10"
                            >
                                <div className="mb-4 text-3xl">🔧</div>
                                <h3 className="mb-2 text-xl font-semibold text-white">Maintenance & Support</h3>
                                <p className="text-sm text-white/70">
                                    Keep your site running smoothly with ongoing maintenance, updates, security patches, and technical support. You
                                    create, I maintain.
                                </p>
                            </motion.div>
                        </div>

                        <div className="pt-8 text-center">
                            <p className="text-lg text-white/80">
                                All services include mobile-responsive design, SEO optimization, and lightning-fast performance.
                            </p>
                        </div>
                    </motion.section>
                    <div className="block md:flex md:items-center md:justify-center md:space-x-6">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mx-auto pb-12 text-xl text-white sm:text-2xl lg:w-sm"
                        >
                            "Dreaming of a website that works as hard as you do? Let’s build it! Your vision, my code, endless possibilities."
                        </motion.p>
                        {/* Contact Button */}
                        <motion.button
                            type="button"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            whileHover={{ scale: 1.1 }}
                            className="relative z-20 mx-auto mb-12 flex bg-[var(--card)] px-20 py-12 text-2xl font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-[var(--accent)] focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-none sm:px-12 sm:py-6 sm:text-lg lg:px-36 lg:py-24 lg:text-5xl"
                            aria-label="Contact Us"
                            onClick={handleClick}
                        >
                            Let's talk
                        </motion.button>
                    </div>
                    {/* Carousel */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}>
                        <Carousel />
                    </motion.div>

                    {/* Noteleks Promo + Portfolio Showcase */}
                    <div className="relative z-10 mx-auto w-full max-w-6xl space-y-10 px-6 pb-24 sm:px-12">
                        {/* Noteleks Promo */}
                        <section className="mx-auto max-w-3xl rounded-md bg-white/5 p-6 text-left text-white shadow-lg">
                            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold">Noteleks: Heroes Beyond Light</h2>
                                    <p className="mt-2 text-sm opacity-80">
                                        My game created with Graveyard Jokes Studios — an immersive experience that showcases what's possible with
                                        custom web development and interactive design.
                                    </p>
                                    <p className="mt-3 text-sm opacity-70">Explore the game and see the studio's capabilities in action.</p>
                                </div>

                                <div className="mt-4 flex items-center gap-4 sm:mt-0">
                                    <a
                                        href="https://studio.graveyardjokes.com/noteleks"
                                        className="inline-flex items-center rounded bg-[var(--card)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent)]"
                                        aria-label="See Noteleks work"
                                    >
                                        See The Noteleks Game
                                    </a>
                                    <a
                                        href="https://studio.graveyardjokes.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center rounded border border-white/10 bg-transparent px-4 py-2 text-sm text-white/90 hover:bg-white/5"
                                    >
                                        Visit Studio
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Portfolio Showcase */}
                        <section id="portfolio-showcase" className="mx-auto w-full">
                            <h3 className="mb-6 text-left text-2xl font-semibold text-white">Selected Projects</h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {portfolioItems.map((p) => (
                                    <ProjectCard key={p.url} title={p.title} description={p.description} url={p.url} cdn={cdn} />
                                ))}
                            </div>
                            <div className="mt-6 text-left">
                                <a
                                    href="/portfolio"
                                    className="inline-flex items-center rounded bg-[var(--card)] px-4 py-2 text-white hover:bg-[var(--accent)]"
                                >
                                    View full portfolio
                                </a>
                            </div>
                        </section>
                    </div>

                    {/* Footer Image */}
                    <div className="absolute bottom-0 z-5 max-h-96 w-full">
                        <motion.img
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                            src={`${cdn}/images/AdobeStock_471779082.webp`}
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
