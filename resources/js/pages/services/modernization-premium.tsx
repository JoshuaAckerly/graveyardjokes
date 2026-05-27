import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function ModernizationPremiumPackage() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const features = [
        'Everything in Professional',
        'Full tech stack migration',
        'Advanced security audit & hardening',
        'Analytics & monitoring setup',
        'Conversion rate optimization audit',
        'Content management system setup',
        'Email automation integration',
        'Backup & disaster recovery setup',
        '3 months of ongoing support',
        'Quarterly performance reviews',
        'Strategic consultation & roadmap',
    ];

    return (
        <>
            <Head>
                <title>Website Modernization - Premium Package - $1,999 | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Premium modernization: full tech stack migration, advanced security, analytics setup, and strategic consultation for complete digital transformation."
                />
                <meta name="keywords" content="website modernization, tech migration, security hardening, analytics setup, digital transformation" />
                <link rel="canonical" href="https://graveyardjokes.com/services/modernization-premium" />
                {/* Open Graph */}
                <meta property="og:title" content="Website Modernization - Premium Package - $1,999 | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Premium modernization: full tech stack migration, advanced security, analytics setup, and strategic consultation for complete digital transformation."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/modernization-premium" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Website Modernization - Premium Package - $1,999 | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Premium modernization: full tech stack migration, advanced security, analytics setup, and strategic consultation for complete digital transformation."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />
                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Web Design",
  "name": "Website Modernization - Premium",
  "description": "Full tech stack migration, advanced security, analytics setup, and strategic consultation for complete digital transformation.",
  "provider": {
    "@type": "Organization",
    "name": "GraveYard Jokes Studios Inc.",
    "url": "https://graveyardjokes.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "1999",
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
                        <p className="mb-6 text-lg text-[var(--primary)]">Premium Package</p>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-(--primary)">$1,999</span>
                            <p className="mt-2 text-lg text-white/80">
                                Full tech stack migration, advanced security, analytics, and strategic consultation for complete digital
                                transformation.
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
                                <li>• Large-scale digital transformation projects</li>
                                <li>• Enterprise systems needing complete modernization</li>
                                <li>• Organizations prioritizing security & compliance</li>
                                <li>• Businesses requiring long-term strategic partnership</li>
                            </ul>
                        </div>

                        <div className="rounded-lg bg-black/50 p-6">
                            <h3 className="mb-4 text-xl font-semibold text-white">Ready to Get Started?</h3>
                            <p className="mb-6 text-white/80">
                                Complete the short project questionnaire first. Once submitted, payment unlocks instantly for this package.
                            </p>
                            <div className="min-h-[50px]">
                                <PackagePaymentGate amount={1999} item="Website Modernization - Premium" packageSlug="modernization-premium" />
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-12 space-y-8 pb-8">
                        <section>
                            <h2 className="mb-3 text-2xl font-bold text-white">About the Website Modernization Premium Package</h2>
                            <p className="text-white/70">
                                The Website Modernization Premium Package from Graveyard Jokes Studios represents complete digital transformation
                                for your web presence. At $1,999, this package covers everything in the Professional tier and extends it with a full
                                tech stack migration, advanced security audit and hardening, analytics and monitoring infrastructure setup, a
                                conversion rate optimization audit, content management system setup, email automation integration, backup and
                                disaster recovery implementation, three months of ongoing support, quarterly performance reviews, and strategic
                                consultation including a long-term digital roadmap.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Full Tech Stack Migration</h3>
                            <p className="text-white/70">
                                If your website is running on an outdated CMS, deprecated hosting infrastructure, or legacy code becoming a
                                liability, a full tech stack migration moves you to a modern, maintainable, and scalable foundation. Our team
                                handles the entire migration process — from database exports and content mapping through DNS transitions and
                                post-launch monitoring — ensuring a smooth cutover with minimal downtime and zero data loss.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Security Hardening and Conversion Rate Optimization</h3>
                            <p className="text-white/70">
                                Outdated websites are prime targets for exploitation. Our advanced security audit identifies vulnerabilities including
                                outdated dependencies, weak authentication configurations, exposed admin paths, and misconfigured headers. After
                                identifying issues, we implement hardening measures and set up backup and disaster recovery systems. We also conduct
                                a CRO audit analyzing user flows, calls to action, and friction points — providing concrete recommendations that
                                turn more of your existing traffic into customers.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-white">What does the quarterly performance review include?</p>
                                    <p className="text-white/70">Each quarterly review covers site performance metrics, security status, traffic and conversion data, and recommendations for the next quarter. Reviews are conducted remotely via call or written report based on your preference.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">How long does a Premium modernization project take?</p>
                                    <p className="text-white/70">Depending on the complexity of your current tech stack and the scope of migration required, Premium modernization projects typically take six to ten weeks from kickoff to launch.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">What CMS platforms do you work with?</p>
                                    <p className="text-white/70">We work with WordPress, Statamic, custom Laravel applications, headless CMS solutions, and other platforms. During discovery we assess your content needs and recommend the best CMS for your team's workflow.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
