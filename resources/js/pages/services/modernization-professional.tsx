import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function ModernizationProfessionalPackage() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const features = [
        'Everything in Starter',
        'Complete design & code refresh',
        'Modern responsive framework update',
        'Accessibility compliance audit (WCAG 2.1)',
        'Advanced SEO optimization',
        'Performance monitoring setup',
        'Image optimization & lazy loading',
        'Content security policies',
        '1 month of support',
        'Migration assistance',
    ];

    return (
        <>
            <Head>
                <title>Website Modernization - Professional Package - $1,299 | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Professional modernization: complete design and code refresh. Update outdated sites with modern frameworks, accessibility compliance, and SEO optimization."
                />
                <meta
                    name="keywords"
                    content="website modernization, code refresh, accessibility compliance, SEO optimization, performance improvement"
                />
                <link rel="canonical" href="https://graveyardjokes.com/services/modernization-professional" />
                {/* Open Graph */}
                <meta property="og:title" content="Website Modernization - Professional Package - $1,299 | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Professional modernization: complete design and code refresh. Update outdated sites with modern frameworks, accessibility compliance, and SEO optimization."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/modernization-professional" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Website Modernization - Professional Package - $1,299 | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Professional modernization: complete design and code refresh. Update outdated sites with modern frameworks, accessibility compliance, and SEO optimization."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />
                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Web Design",
  "name": "Website Modernization - Professional",
  "description": "Complete design and code refresh with modern frameworks, accessibility compliance, and SEO optimization.",
  "provider": {
    "@type": "Organization",
    "name": "GraveYard Jokes Studios Inc.",
    "url": "https://graveyardjokes.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "1299",
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
                        <p className="mb-6 text-lg text-[var(--primary)]">Professional Package — Most Popular</p>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-(--primary)">$1,299</span>
                            <p className="mt-2 text-lg text-white/80">
                                Complete design and code refresh with modern frameworks and accessibility compliance.
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
                                <li>• Legacy systems needing modern technology</li>
                                <li>• Organizations requiring accessibility compliance</li>
                                <li>• Sites with outdated backend technology</li>
                                <li>• Businesses needing improved performance</li>
                            </ul>
                        </div>

                        <div className="rounded-lg bg-black/50 p-6">
                            <h3 className="mb-4 text-xl font-semibold text-white">Ready to Get Started?</h3>
                            <p className="mb-6 text-white/80">
                                Complete the short project questionnaire first. Once submitted, payment unlocks instantly for this package.
                            </p>
                            <div className="min-h-[50px]">
                                <PackagePaymentGate
                                    amount={1299}
                                    item="Website Modernization - Professional"
                                    packageSlug="modernization-professional"
                                />
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-12 space-y-8 pb-8">
                        <section>
                            <h2 className="mb-3 text-2xl font-bold text-white">About the Website Modernization Professional Package</h2>
                            <p className="text-white/70">
                                The Website Modernization Professional Package from Graveyard Jokes Studios delivers a comprehensive overhaul of your
                                existing website — not just a surface-level refresh. At $1,299, this package includes a complete design and code
                                refresh using a modern responsive framework, a full WCAG 2.1 accessibility compliance audit, advanced SEO
                                optimization, performance monitoring setup, image optimization with lazy loading, content security policy
                                implementation, migration assistance, and one full month of dedicated post-project support.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Modern Frameworks and Why They Matter</h3>
                            <p className="text-white/70">
                                Many older websites were built on outdated frameworks or legacy code that makes maintenance difficult and performance
                                ceilings low. Updating your site to a modern responsive framework improves load speed, mobile compatibility, developer
                                experience, and long-term maintainability. Our team handles the migration carefully to preserve your content, URL
                                structure, and existing SEO equity wherever possible.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Accessibility Compliance</h3>
                            <p className="text-white/70">
                                WCAG 2.1 accessibility compliance ensures your website serves users with visual, auditory, motor, and cognitive
                                disabilities. Beyond the ethical importance of inclusive design, accessibility compliance reduces legal exposure and
                                expands your effective audience. Our audit identifies specific failures and our implementation addresses them
                                systematically and thoroughly.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-white">Will modernization affect my Google rankings?</p>
                                    <p className="text-white/70">
                                        Done correctly, modernization improves rankings by fixing technical issues that hold your site back. We take
                                        care to preserve URL structures and implement proper redirects where necessary to protect your existing SEO
                                        equity.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">What does advanced SEO optimization involve?</p>
                                    <p className="text-white/70">
                                        Advanced SEO optimization covers page speed improvements, meta tag audits, structured data implementation,
                                        internal linking review, and Core Web Vitals fixes — all factors Google uses to rank pages in organic search
                                        results.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">How long does a Professional modernization project take?</p>
                                    <p className="text-white/70">
                                        Most Professional modernization projects are completed within three to five weeks depending on the size of
                                        your existing site and the complexity of the framework migration required.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
