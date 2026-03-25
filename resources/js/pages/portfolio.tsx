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
                        content="Explore the portfolio of Graveyard Jokes Studios, showcasing custom websites for musicians, artists, and creatives."
                    />
                    <meta name="keywords" content="portfolio, custom websites, musicians, artists, creatives, web design, web development" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="canonical" href="https://graveyardjokes.com/portfolio" />

                    {/* Open Graph */}
                    <meta property="og:title" content="Portfolio | Graveyard Jokes Studios" />
                    <meta
                        property="og:description"
                        content="Explore the portfolio of Graveyard Jokes Studios, showcasing custom websites for musicians, artists, and creatives."
                    />
                    <meta property="og:image" content={`${cdn}/images/PortfolioBanner.webp`} />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://graveyardjokes.com/portfolio" />

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Portfolio | Graveyard Jokes Studios" />
                    <meta
                        name="twitter:description"
                        content="Explore the portfolio of Graveyard Jokes Studios, showcasing custom websites for musicians, artists, and creatives."
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
            </section>
        </MainLayout>
    );
};

export default Portfolio;
