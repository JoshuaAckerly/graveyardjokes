import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function DesignProfessionalPackage() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const features = [
        'Everything in Starter',
        'Custom UI design system',
        'Interactive prototypes',
        'Design specifications document',
        'Full brand guidelines pack',
        'Logo design or refinement',
        '4 rounds of revisions',
        '3 months of design support',
        'Component library',
    ];

    return (
        <>
            <Head>
                <title>Website Design - Professional Package - $999 | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Professional design package: comprehensive UI design system, interactive prototypes, and complete brand guidelines. Perfect for custom websites."
                />
                <meta name="keywords" content="professional web design, UI design system, brand guidelines, interactive prototypes, custom design" />
                <link rel="canonical" href="https://graveyardjokes.com/services/design-professional" />
                {/* Open Graph */}
                <meta property="og:title" content="Website Design - Professional Package - $999 | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Professional design package: comprehensive UI design system, interactive prototypes, and complete brand guidelines. Perfect for custom websites."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/design-professional" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Website Design - Professional Package - $999 | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Professional design package: comprehensive UI design system, interactive prototypes, and complete brand guidelines. Perfect for custom websites."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />
                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Web Design",
  "name": "Website Design - Professional",
  "description": "Comprehensive UI design system, interactive prototypes, and complete brand guidelines for your website.",
  "provider": {
    "@type": "Organization",
    "name": "GraveYard Jokes Studios Inc.",
    "url": "https://graveyardjokes.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "999",
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
                        <p className="mb-6 text-lg text-[var(--primary)]">Professional Package — Most Popular</p>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-(--primary)">$999</span>
                            <p className="mt-2 text-lg text-white/80">
                                Comprehensive design system, interactive prototypes, and complete brand guidelines.
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
                                <li>• Businesses wanting a cohesive brand identity</li>
                                <li>• Complex multi-page website designs</li>
                                <li>• Organizations building design guidelines</li>
                                <li>• Companies with evolving design needs</li>
                            </ul>
                        </div>

                        <div className="rounded-lg bg-black/50 p-6">
                            <h3 className="mb-4 text-xl font-semibold text-white">Ready to Get Started?</h3>
                            <p className="mb-6 text-white/80">
                                Complete the short project questionnaire first. Once submitted, payment unlocks instantly for this package.
                            </p>
                            <div className="min-h-[50px]">
                                <PackagePaymentGate amount={999} item="Website Design - Professional" packageSlug="design-professional" />
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-12 space-y-8 pb-8">
                        <section>
                            <h2 className="mb-3 text-2xl font-bold text-white">About the Website Design Professional Package</h2>
                            <p className="text-white/70">
                                The Website Design Professional Package from Graveyard Jokes Studios delivers a comprehensive visual and brand system
                                for businesses and artists who need more than basic mockups. At $999, this package builds on our Starter tier by adding
                                a full custom UI design system, interactive prototypes that simulate real user interactions, and a complete brand
                                guidelines document covering logo usage, typography rules, color systems, and spacing standards. For clients whose
                                existing logo needs refinement — or who need a new logo designed from scratch — logo work is included. A component
                                library ensures visual consistency across every page and every future iteration of your site.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Interactive Prototypes and What They Mean for You</h3>
                            <p className="text-white/70">
                                Rather than just showing what your website looks like, our interactive prototypes demonstrate how it behaves. Hover
                                states, transitions, navigation flows, and mobile interactions are all modeled before development begins. This reduces
                                surprises during the build phase and gives all stakeholders a clear, realistic preview of the finished product — making
                                feedback rounds faster and more productive.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Why Choose the Professional Design Package?</h3>
                            <p className="text-white/70">
                                Three months of ongoing design support means that as your business evolves, your design system can evolve with it.
                                Adding a new product line, updating your branding, or launching a campaign are all easier when you have a structured
                                design system and a design team you can call on. Four rounds of revisions give you real flexibility to explore
                                creative directions and refine the final outcome to exactly what you envision.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-white">Is the logo work a full branding project?</p>
                                    <p className="text-white/70">Logo work in this package covers a professional logo design or refinement of your existing mark. For a full brand identity project with custom illustrations and multi-platform asset creation, consider the Design Premium Package.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Can I use the component library with any developer?</p>
                                    <p className="text-white/70">Yes. The component library and design specifications are delivered in formats compatible with all major development frameworks. Any competent developer can implement from these deliverables.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">How is a UI design system different from simple mockups?</p>
                                    <p className="text-white/70">A UI design system defines reusable components, design rules, and standards that scale across your entire product. Simple mockups show one snapshot; a design system governs every screen you ever build.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
