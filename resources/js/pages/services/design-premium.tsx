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
                <title>Website Design - Premium Package - $1,799 | Graveyard Jokes Studios</title>
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
                <meta property="og:title" content="Website Design - Premium Package - $1,799 | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Premium design package: full brand identity, custom illustrations, accessibility audit, and ongoing design consultation for your website."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/design-premium" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Website Design - Premium Package - $1,799 | Graveyard Jokes Studios" />
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
    "price": "1799",
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
                            <span className="text-5xl font-bold text-(--primary)">$1,799</span>
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
                                <PackagePaymentGate amount={1799} item="Website Design - Premium" packageSlug="design-premium" />
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-12 space-y-8 pb-8">
                        <section>
                            <h2 className="mb-3 text-2xl font-bold text-white">About the Website Design Premium Package</h2>
                            <p className="text-white/70">
                                The Website Design Premium Package from Graveyard Jokes Studios is our most comprehensive design offering, built for
                                organizations that demand a world-class visual identity and an ongoing creative partnership. At $1,799, this package
                                includes everything in Professional — then goes further with a premium brand identity package, custom illustration
                                design, animation design specifications, a complete accessibility audit with WCAG 2.1 compliance recommendations,
                                design tokens, and a full CSS system. Unlimited revisions over sixty days and six months of ongoing design support
                                give you exceptional depth of iteration and long-term creative continuity.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Custom Illustrations and Brand Differentiation</h3>
                            <p className="text-white/70">
                                Generic stock imagery blends into the background. Custom illustrations created specifically for your brand are
                                distinctive, memorable, and impossible to replicate. Whether your aesthetic is dark and atmospheric, minimalist and
                                modern, or bold and expressive, our illustrators create original artwork that makes your website genuinely unique and
                                gives your audience something they have never seen before in your space.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Accessibility and Design Tokens</h3>
                            <p className="text-white/70">
                                Good design serves every user. Our accessibility audit ensures your site meets WCAG 2.1 standards, expanding your
                                audience and reducing legal exposure. Design tokens — systematic values for colors, spacing, and typography — keep
                                design and code in sync, making global updates faster and more consistent across every platform and device your
                                audience uses.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-white">What types of custom illustrations can you create?</p>
                                    <p className="text-white/70">
                                        We create spot illustrations, character design, pattern systems, icon sets, and editorial-style artwork.
                                        During onboarding we discuss the visual style that best matches your brand identity and audience.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">What are design tokens and why do they matter?</p>
                                    <p className="text-white/70">
                                        Design tokens are named variables for design decisions like brand colors, font sizes, and spacing values. They
                                        keep design and development in sync and make global style changes fast and accurate across your entire
                                        product.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">How does unlimited revisions work in practice?</p>
                                    <p className="text-white/70">
                                        Within the sixty-day revision window you can request as many design changes as needed with no additional
                                        charge. This gives you real creative freedom to explore directions and perfect every detail before handoff.
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
