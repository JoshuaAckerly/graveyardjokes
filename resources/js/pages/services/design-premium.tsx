import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function DesignPremiumPackage() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const features = [
        'Everything in Professional',
        'Premium brand identity package',
        'Custom illustration design',
        'Animation design specifications',
        'Accessibility audit & recommendations',
        'Design tokens & CSS system',
        'Unlimited revisions (60 days)',
        '6 months of design support',
        'Ongoing design consultation',
        'Priority design updates',
    ];

    return (
        <>
            <Head>
                <title>Website Design - Premium Package - $499 | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Premium design package: full brand identity, custom illustrations, accessibility audit, and ongoing design consultation for your website."
                />
                <meta
                    name="keywords"
                    content="premium web design, brand identity, custom illustrations, design system, accessibility, design consultation"
                />
                <link rel="canonical" href="https://graveyardjokes.com/services/design-premium" />
                {/* Open Graph */}
                <meta property="og:title" content="Website Design - Premium Package - $499 | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Premium design package: full brand identity, custom illustrations, accessibility audit, and ongoing design consultation for your website."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/design-premium" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Website Design - Premium Package - $499 | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Premium design package: full brand identity, custom illustrations, accessibility audit, and ongoing design consultation for your website."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />
                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Web Design",
  "name": "Website Design - Premium",
  "description": "Full brand identity, custom illustrations, accessibility audit, and ongoing design consultation.",
  "provider": {
    "@type": "Organization",
    "name": "GraveYard Jokes Studios Inc.",
    "url": "https://graveyardjokes.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "499",
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
                        <h1 className="mb-2 text-4xl font-bold text-white">Website Design</h1>
                        <p className="mb-6 text-lg text-[var(--primary)]">Premium Package</p>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-(--primary)">$499</span>
                            <p className="mt-2 text-lg text-white/80">
                                Full brand identity with custom illustrations, accessibility audit, and ongoing design consultation.
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
                                <li>• Established brands needing premium visual systems</li>
                                <li>• Organizations prioritizing accessibility</li>
                                <li>• Businesses with evolving design needs</li>
                                <li>• Long-term strategic design partnerships</li>
                            </ul>
                        </div>

                        <div className="rounded-lg bg-black/50 p-6">
                            <h3 className="mb-4 text-xl font-semibold text-white">Ready to Get Started?</h3>
                            <p className="mb-6 text-white/80">
                                Complete the short project questionnaire first. Once submitted, payment unlocks instantly for this package.
                            </p>
                            <div className="min-h-[50px]">
                                <PackagePaymentGate amount={499} item="Website Design - Premium" packageSlug="design-premium" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </MainLayout>
        </>
    );
}
