import InertiaHead from '@/Components/InertiaHead';
import ProjectCard from '@/Components/ProjectCard';
import portfolioItems from '@/data/portfolioItems';
import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import React from 'react';
import { getEnvVar } from '../env';

const Portfolio: React.FC = () => {
    const cdn = getEnvVar('VITE_ASSET_URL');

    const featured = portfolioItems.filter((p) => p.featured);
    const rest = portfolioItems.filter((p) => !p.featured);

    return (
        <MainLayout>
            <>
                <InertiaHead>
                    <title>Portfolio | Graveyard Jokes Studios</title>
                    <meta
                        name="description"
                        content="Explore the portfolio of Graveyard Jokes Studios, showcasing custom websites for entrepreneurs, creatives, and independent brands."
                    />
                    <meta
                        name="keywords"
                        content="portfolio, custom websites, entrepreneurs, creatives, independent brands, web design, web development"
                    />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="canonical" href="https://graveyardjokes.com/portfolio" />

                    {/* Open Graph */}
                    <meta property="og:title" content="Portfolio | Graveyard Jokes Studios" />
                    <meta
                        property="og:description"
                        content="Explore the portfolio of Graveyard Jokes Studios, showcasing custom websites for entrepreneurs, creatives, and independent brands."
                    />
                    <meta property="og:image" content={`${cdn}/images/PortfolioBanner.webp`} />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://graveyardjokes.com/portfolio" />

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Portfolio | Graveyard Jokes Studios" />
                    <meta
                        name="twitter:description"
                        content="Explore the portfolio of Graveyard Jokes Studios, showcasing custom websites for entrepreneurs, creatives, and independent brands."
                    />
                    <meta name="twitter:image" content={`${cdn}/images/PortfolioBanner.webp`} />
                </InertiaHead>
            </>

            <section className="relative z-0 flex flex-col items-center gap-12 rounded-lg bg-[var(--color-foreground)] p-6 text-white shadow-lg sm:p-10">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
                    <h1 className="text-5xl font-extrabold text-[var(--accent)]">Portfolio</h1>
                    <p className="mt-4 max-w-2xl text-lg text-white/70">
                        Every project here is a real, live website — designed from scratch, built with modern tech, and optimized for speed, SEO, and
                        mobile. Take a look around.
                    </p>
                </motion.div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="flex flex-wrap justify-center gap-8 rounded-lg border border-white/10 bg-white/5 px-10 py-5 text-center"
                >
                    <div>
                        <p className="text-3xl font-bold text-[var(--accent)]">{portfolioItems.length}</p>
                        <p className="text-sm text-white/50">Projects Shipped</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[var(--accent)]">100%</p>
                        <p className="text-sm text-white/50">Custom Built</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[var(--accent)]">2026</p>
                        <p className="text-sm text-white/50">Year Founded</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[var(--accent)]">$0</p>
                        <p className="text-sm text-white/50">Page Builders Used</p>
                    </div>
                </motion.div>

                {/* Featured projects */}
                {featured.length > 0 && (
                    <div className="w-full">
                        <h2 className="mb-5 text-xl font-semibold text-white/80">⭐ Featured Projects</h2>
                        <ul className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                            {featured.map((project, i) => (
                                <motion.li
                                    key={project.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.15 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                >
                                    <ProjectCard
                                        title={project.title}
                                        description={project.description}
                                        longDescription={project.longDescription}
                                        url={project.url}
                                        cdn={cdn}
                                        featured={project.featured}
                                        tech={project.tech}
                                        category={project.category}
                                        year={project.year}
                                    />
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* All other projects */}
                {rest.length > 0 && (
                    <div className="w-full">
                        <h2 className="mb-5 text-xl font-semibold text-white/80">All Projects</h2>
                        <ul className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {rest.map((project, i) => (
                                <motion.li
                                    key={project.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.15 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                >
                                    <ProjectCard
                                        title={project.title}
                                        description={project.description}
                                        longDescription={project.longDescription}
                                        url={project.url}
                                        cdn={cdn}
                                        featured={project.featured}
                                        tech={project.tech}
                                        category={project.category}
                                        year={project.year}
                                    />
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                )}

                <p className="max-w-2xl text-center text-base text-white/50">
                    Interested in working together?{' '}
                    <a href="/contact" className="text-[var(--accent)] hover:underline">
                        Get in touch
                    </a>{' '}
                    and let's build something great.
                </p>

                <div className="w-full max-w-4xl space-y-8 text-left">
                    <section>
                        <h2 className="mb-3 text-2xl font-bold text-white">Our Work</h2>
                        <p className="text-white/70">
                            Every project in this portfolio is a real, live website — designed from scratch, built with modern technology, and
                            optimized for speed, SEO, and mobile performance. Graveyard Jokes Studios does not use page builders, pre-made themes, or
                            drag-and-drop editors. Each site is hand-coded by our development team using current frameworks, giving every client a
                            unique, performant, and maintainable digital product that no template could replicate. Our clients include independent
                            musicians, bands, creative publishers, fashion labels, and media brands across the United States.
                        </p>
                    </section>
                    <section>
                        <h3 className="mb-3 text-xl font-semibold text-white">What We Build</h3>
                        <p className="text-white/70">
                            Our portfolio spans musician and band websites, independent publishing platforms, e-commerce storefronts, streaming and
                            media sites, and artist brand platforms. We specialize in the music and creative industries, where visual identity, fan
                            experience, and brand storytelling are just as important as technical performance. Each project begins with a discovery
                            process to understand the client's audience, goals, and aesthetic — and ends with a launch-ready product built to rank in
                            search engines and convert visitors into fans or customers.
                        </p>
                    </section>
                    <section>
                        <h3 className="mb-3 text-xl font-semibold text-white">Technology and Approach</h3>
                        <p className="text-white/70">
                            We build with React, TypeScript, Laravel, and Inertia.js, using Tailwind CSS for styling and modern deployment pipelines
                            for reliability. Every site we deliver is mobile-first, accessible, and optimized for Core Web Vitals. We take SEO
                            seriously from day one — structuring content, metadata, and performance with organic visibility in mind rather than
                            bolting on SEO as an afterthought. The result is a website that not only looks exceptional but actively works to grow your
                            audience over time.
                        </p>
                    </section>
                    <section>
                        <h3 className="mb-3 text-xl font-semibold text-white">Why Choose Graveyard Jokes Studios?</h3>
                        <p className="text-white/70">
                            We are a small, focused agency that treats every project as a genuine creative partnership. You work directly with the
                            people building your site — not account managers passing messages between you and an offshore team. Our rates are
                            transparent, our timelines are realistic, and our work speaks for itself. Based in Cheektowaga, New York and serving
                            clients across the United States, we bring big-agency craft to independent artists and businesses who deserve more than a
                            generic template site.
                        </p>
                    </section>
                </div>
            </section>
        </MainLayout>
    );
};

export default Portfolio;
