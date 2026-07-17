import ApplicationLogo from '@/Components/applicationLogo';
import Carousel from '@/Components/carousel';
import InertiaHead from '@/Components/InertiaHead';
import ProjectCard from '@/Components/ProjectCard';
import portfolioItems from '@/data/portfolioItems';
import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { getAuthSystemUrl, getEnvVar, getProjectUrl } from '../env';

export default function Home(): JSX.Element {
    const cdn = getEnvVar('VITE_ASSET_URL');

    const handleClick = (): void => {
        router.visit('/contact');
    };

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

                <a href="/" className="sr-only">
                    Home Page
                </a>

                <div className="relative z-0 max-w-full space-y-10 bg-[var(--color-foreground)] text-center">
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
                                Custom websites for entrepreneurs, creatives, and independent brands who want to stand out online
                                <br />— whether you're launching a business, promoting a project, or building your portfolio.
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
                    </motion.div>

                    {/* Starter Package Promo */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 mx-auto w-full max-w-6xl space-y-8 px-6 py-16 sm:px-12"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white sm:text-3xl">
                                Your business deserves a website that doesn't look like it crawled out of the grave.
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Main Package Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="rounded-lg bg-white/5 p-6 text-left shadow-lg"
                            >
                                <div className="mb-4 text-3xl">💀</div>
                                <h3 className="text-xl font-semibold text-white">Full Website Build</h3>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-[var(--primary)] sm:text-4xl">$299</span>
                                </div>
                                <p className="mt-1 text-xs text-white/50">Up to 5 pages</p>
                                <ul className="mt-4 space-y-2">
                                    {[
                                        'Clean, modern design',
                                        'Mobile-optimized',
                                        'Fast load speeds',
                                        'Contact form + call-to-action setup',
                                        'Domain + hosting assistance',
                                    ].map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm text-gray-200">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* Support + Add-Ons Column */}
                            <div className="flex flex-col gap-6">
                                {/* Free Support Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="rounded-lg bg-white/5 p-6 text-left shadow-lg"
                                >
                                    <div className="mb-3 text-3xl">🧟</div>
                                    <h3 className="text-xl font-semibold text-white">1 Month of Free Support</h3>
                                    <ul className="mt-3 space-y-2">
                                        {['Content updates', 'Fixes', 'Tweaks', 'Priority responses'].map((item) => (
                                            <li key={item} className="flex items-start gap-2 text-sm text-gray-200">
                                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>

                                {/* Optional Add-Ons Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="rounded-lg bg-white/5 p-6 text-left shadow-lg"
                                >
                                    <div className="mb-3 text-3xl">🛒</div>
                                    <h3 className="text-lg font-semibold text-white">Optional Add-Ons</h3>
                                    <ul className="mt-3 space-y-1 text-sm text-white/70">
                                        <li>Monthly maintenance</li>
                                        <li>Social media management — from $299/mo</li>
                                        <li>
                                            <Link href="/services/seo" className="text-[var(--primary)] hover:underline">
                                                SEO Management — $79/mo
                                            </Link>
                                        </li>
                                    </ul>
                                </motion.div>
                            </div>
                        </div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-center"
                        >
                            <p className="text-lg text-white/80">
                                No hidden fees. No gimmicks. Just a fast, modern site at a price that won't haunt your wallet.
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} className="mt-6 inline-block">
                                <Link
                                    href="/services/starter"
                                    className="inline-flex rounded-lg bg-[var(--primary)] px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-[var(--accent)]"
                                >
                                    Grab Your Spot
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.section>

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
                            <p className="mt-4 text-lg text-white/70">
                                Web development, design, and social media management — your full online presence, handled
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Service Card 3 — SEO */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="rounded-lg bg-white/5 p-6 text-left shadow-lg transition-all hover:bg-white/10 md:col-span-2"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="mb-4 text-3xl">🔍</div>
                                        <h3 className="mb-2 text-xl font-semibold text-white">
                                            SEO Management{' '}
                                            <span className="ml-1 rounded-full bg-[var(--primary)]/20 px-2 py-0.5 text-xs text-[var(--primary)]">
                                                Special Price $79/mo
                                            </span>
                                        </h3>
                                        <p className="text-sm text-white/70">
                                            Ongoing SEO to help your site rank higher and get found. Keyword research, on-page optimization, technical
                                            audits, and monthly reporting — everything you need to grow organic traffic.
                                        </p>
                                    </div>
                                    <Link
                                        href="/services/seo"
                                        className="shrink-0 rounded bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Service Card 1 — Web Dev & Design */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="rounded-lg bg-white/5 p-6 text-left shadow-lg transition-all hover:bg-white/10"
                            >
                                <div className="mb-4 text-3xl">⚡</div>
                                <h3 className="mb-2 text-xl font-semibold text-white">Web Development & Design</h3>
                                <p className="text-sm text-white/70">
                                    Custom-built websites designed in Photoshop and coded from scratch. Responsive, fast, and built to reflect your
                                    brand — from single-page launches to full multi-page platforms.
                                </p>
                            </motion.div>

                            {/* Service Card 2 — Social Media */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="rounded-lg bg-white/5 p-6 text-left shadow-lg transition-all hover:bg-white/10"
                            >
                                <div className="mb-4 text-3xl">📱</div>
                                <h3 className="mb-2 text-xl font-semibold text-white">
                                    Social Media Management{' '}
                                    <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">Add-On from $99/mo</span>
                                </h3>
                                <p className="text-sm text-white/70">
                                    Grow and manage your social presence across platforms. Content planning, scheduling, engagement, and analytics —
                                    so you stay consistent without the stress.
                                </p>
                            </motion.div>
                        </div>

                        <div className="pt-8 text-center">
                            <p className="text-lg text-white/80">
                                All packages include dedicated support, transparent reporting, and hands-on management — so your online presence keeps
                                working for you every day.
                            </p>
                        </div>
                    </motion.section>

                    {/* About Me */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 mx-auto w-full max-w-4xl px-6 py-16 sm:px-12"
                    >
                        <div className="rounded-lg border border-white/10 bg-white/5 p-8 shadow-lg sm:p-12">
                            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:text-left">
                                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white/10 text-5xl">👨‍💻</div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white sm:text-3xl">Hey, I'm Joshua</h2>
                                    <p className="mt-1 text-sm font-medium text-[var(--primary)]">Founder — Graveyard Jokes Studios</p>
                                    <p className="mt-4 text-base text-white/70">
                                        I'm based in Cheektowaga, New York, and I built Graveyard Jokes Studios to give small businesses,
                                        entrepreneurs, and independent brands access to professional web development, design, and social media
                                        management — without the agency price tag.
                                    </p>
                                    <p className="mt-3 text-base text-white/70">
                                        I handle everything — strategy, content, optimization, and ongoing support. No handoffs, no middlemen. You
                                        deal directly with me, which means faster communication and results that actually reflect your goals.
                                    </p>
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <a
                                            href="https://github.com/joshua-ackerly"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded border border-white/20 bg-transparent px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
                                        >
                                            GitHub
                                        </a>
                                        <a
                                            href="https://www.linkedin.com/in/joshua-ackerly"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded border border-white/20 bg-transparent px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
                                        >
                                            LinkedIn
                                        </a>
                                        <Link
                                            href="/contact"
                                            className="inline-flex items-center gap-2 rounded bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
                                        >
                                            Work With Me
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Direct Messaging CTA */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 mx-auto w-full max-w-3xl px-6 py-16 text-center sm:px-12"
                    >
                        <div className="rounded-lg border border-white/10 bg-white/5 p-8 shadow-lg sm:p-12">
                            <div className="mb-4 text-4xl">💬</div>
                            <h2 className="text-2xl font-bold text-white sm:text-3xl">Get Direct Feedback From Me</h2>
                            <p className="mx-auto mt-4 max-w-xl text-base text-white/70">
                                Create a free account and I can send you updates, project feedback, and announcements directly through the site. No
                                spam, no email chains — just a quick notification when you log in.
                            </p>
                            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <a
                                    href={`${getAuthSystemUrl()}/register`}
                                    className="inline-flex rounded-lg bg-[var(--primary)] px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-[var(--accent)]"
                                >
                                    Create an Account
                                </a>
                                <a
                                    href={`${getAuthSystemUrl()}/login`}
                                    className="inline-flex rounded-lg border border-white/20 bg-transparent px-8 py-3 text-lg font-semibold text-white/90 transition hover:bg-white/5"
                                >
                                    Log In
                                </a>
                            </div>
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

                    {/* Studio Reference + Portfolio Showcase */}
                    <div className="relative z-10 mx-auto w-full max-w-6xl space-y-10 px-6 pb-24 sm:px-12">
                        {/* Studio Spotlight */}
                        <section className="mx-auto max-w-3xl rounded-md bg-white/5 p-6 text-left text-white shadow-lg">
                            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <h2 className="text-2xl font-semibold">Graveyard Jokes Studios</h2>
                                    <p className="mt-2 text-sm opacity-80">
                                        A showcase hub featuring vlogs, blogs, and an image gallery that captures our creative journey and
                                        behind-the-scenes content.
                                    </p>
                                    <p className="mt-3 text-sm opacity-70">Explore the studio and connect with our creative community.</p>
                                </div>

                                <div className="mt-4 flex items-center gap-4 sm:mt-0">
                                    <a
                                        href={getProjectUrl('studio')}
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
                                    <ProjectCard
                                        key={p.url}
                                        title={p.title}
                                        description={p.description}
                                        url={p.url}
                                        cdn={cdn}
                                        featured={p.featured}
                                    />
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
