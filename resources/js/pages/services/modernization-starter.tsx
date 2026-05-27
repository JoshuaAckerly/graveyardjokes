import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function ModernizationStarterPackage() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const features = [
        'Visual design refresh',
        'Navigation & layout updates',
        'Mobile responsiveness audit',
        'Performance optimization basics',
        'SEO recommendations report',
        'Security vulnerability scan',
        '2 weeks of support',
        'Actionable improvement roadmap',
    ];

    return (
        <>
            <Head>
                <title>Website Modernization - Starter Package - $799 | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Starter modernization: give your existing website a fresh look. Visual refresh, responsiveness updates, and performance optimization."
                />
                <meta name="keywords" content="website modernization, website redesign, responsive design, performance optimization, SEO update" />
                <link rel="canonical" href="https://graveyardjokes.com/services/modernization-starter" />
                {/* Open Graph */}
                <meta property="og:title" content="Website Modernization - Starter Package - $799 | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Starter modernization: give your existing website a fresh look. Visual refresh, responsiveness updates, and performance optimization."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/modernization-starter" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Website Modernization - Starter Package - $799 | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Starter modernization: give your existing website a fresh look. Visual refresh, responsiveness updates, and performance optimization."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />
                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Web Design",
  "name": "Website Modernization - Starter",
  "description": "Modernize your existing website with visual updates, responsiveness fixes, and performance optimization.",
  "provider": {
    "@type": "Organization",
    "name": "GraveYard Jokes Studios Inc.",
    "url": "https://graveyardjokes.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "799",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "areaServed": "US"
}
`}
                </script>
            </Head>

            <MainLayout>
                <div className="mx-auto max-w-4xl px-4 py-8">
                    <Link href="/services" className="mb-6 inline-flex items-center gap-2 text-white transition hover:text-(--primary)">
                        <ArrowLeft className="h-5 w-5" />
                        Back to Services
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-lg border-2 border-(--accent) bg-(--card) p-8"
                    >
                        <h1 className="mb-2 text-4xl font-bold text-white">Website Modernization</h1>
                        <p className="mb-6 text-lg text-gray-300">Starter Package</p>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-(--primary)">$799</span>
                            <p className="mt-2 text-lg text-white/80">
                                Give your existing website a fresh look with visual refresh and performance improvements.
                            </p>
                        </div>

                        <div className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">What's Included:</h2>
                            <ul className="space-y-3">
                                {features.map((feature, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <Check className="h-5 w-5 shrink-0 text-(--primary)" />
                                        <span className="text-white">{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-8">
                            <h3 className="mb-4 text-xl font-semibold text-white">Perfect For:</h3>
                            <ul className="space-y-2 text-white/80">
                                <li>• Websites that feel outdated</li>
                                <li>• Sites with poor mobile experience</li>
                                <li>• Quick visual modernization needs</li>
                                <li>• Performance improvement projects</li>
                            </ul>
                        </div>

                        <div className="rounded-lg bg-black/50 p-6">
                            <h3 className="mb-4 text-xl font-semibold text-white">Ready to Get Started?</h3>
                            <p className="mb-6 text-white/80">
                                Complete the short project questionnaire first. Once submitted, payment unlocks instantly for this package.
                            </p>
                            <div className="min-h-[50px]">
                                <PackagePaymentGate amount={799} item="Website Modernization - Starter" packageSlug="modernization-starter" />
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-12 space-y-8 pb-8">
                        <section>
                            <h2 className="mb-3 text-2xl font-bold text-white">About the Website Modernization Starter Package</h2>
                            <p className="text-white/70">
                                The Website Modernization Starter Package from Graveyard Jokes Studios is designed for businesses and artists with
                                existing websites that feel outdated, load slowly, or perform poorly on mobile devices. For $799, our team conducts a
                                full assessment of your current site, delivers a visual design refresh, updates navigation and layout to modern
                                standards, performs a mobile responsiveness audit, applies basic performance optimizations, and provides a detailed
                                SEO recommendations report along with a security vulnerability scan. You will finish the engagement with an actionable
                                improvement roadmap and two weeks of dedicated post-project support.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Why Website Modernization Matters</h3>
                            <p className="text-white/70">
                                Search engines, particularly Google, factor page speed, mobile usability, and Core Web Vitals into organic search
                                rankings. An outdated website with slow load times, unresponsive layouts, or poor navigation is actively penalized in
                                search results. Beyond SEO, user expectations have shifted — a site that looked acceptable five years ago may now
                                drive potential customers or fans away within seconds of arrival. Modernization is one of the highest-return
                                investments a business can make in its digital presence.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">What an Actionable Roadmap Means</h3>
                            <p className="text-white/70">
                                After completing the core Starter work, we deliver a clear written roadmap listing prioritized improvements for your
                                site going forward. This roadmap covers design suggestions, technical debt, SEO opportunities, and content strategy
                                recommendations — giving you a practical plan for continued growth whether you execute it with us or independently.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-white">Do you need access to my website's backend?</p>
                                    <p className="text-white/70">For Starter-level work we typically need read access to your site's admin panel and server configuration. We work with all major CMS platforms and custom-built sites, and handle access securely.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">How is modernization different from a full rebuild?</p>
                                    <p className="text-white/70">Modernization updates and improves your existing site while preserving its established content and structure. A full rebuild starts from scratch. If your current site has substantial content or brand equity, modernization is typically faster and more cost-effective.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Will my site be offline during modernization?</p>
                                    <p className="text-white/70">All work is performed on a staging environment first and then deployed in a single controlled transition. Your live site remains online throughout the process with zero unplanned downtime.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
