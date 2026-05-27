import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function DesignStarterPackage() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const features = [
        'Wireframes for 3-5 pages',
        'Design mockups in Figma',
        'Brand color palette & typography',
        'Mobile-first responsive design',
        'Icon set suggestions',
        '2 rounds of revisions',
        '1 month of design support',
    ];

    return (
        <>
            <Head>
                <title>Website Design - Starter Package - $799 | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Starter design package: get professional wireframes and mockups for your website. Perfect for planning your visual direction before development."
                />
                <meta name="keywords" content="website design, starter design, wireframes, mockups, UI design, UX design, affordable design" />
                <link rel="canonical" href="https://graveyardjokes.com/services/design-starter" />
                {/* Open Graph */}
                <meta property="og:title" content="Website Design - Starter Package - $799 | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Starter design package: get professional wireframes and mockups for your website. Perfect for planning your visual direction before development."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/design-starter" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Website Design - Starter Package - $799 | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Starter design package: get professional wireframes and mockups for your website. Perfect for planning your visual direction before development."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />
                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Web Design",
  "name": "Website Design - Starter",
  "description": "Professional wireframes and design mockups for your website. Perfect for planning your visual direction before development.",
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
                        <h1 className="mb-2 text-4xl font-bold text-white">Website Design</h1>
                        <p className="mb-6 text-lg text-gray-300">Starter Package</p>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-(--primary)">$799</span>
                            <p className="mt-2 text-lg text-white/80">
                                Professional wireframes and design mockups. Perfect for planning your visual direction before development.
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
                                <li>• Getting visual direction before development</li>
                                <li>• Planning layout and user flow</li>
                                <li>• Establishing brand visual identity</li>
                                <li>• Quick design feedback and iteration</li>
                            </ul>
                        </div>

                        <div className="rounded-lg bg-black/50 p-6">
                            <h3 className="mb-4 text-xl font-semibold text-white">Ready to Get Started?</h3>
                            <p className="mb-6 text-white/80">
                                Complete the short project questionnaire first. Once submitted, payment unlocks instantly for this package.
                            </p>
                            <div className="min-h-[50px]">
                                <PackagePaymentGate amount={799} item="Website Design - Starter" packageSlug="design-starter" />
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-12 space-y-8 pb-8">
                        <section>
                            <h2 className="mb-3 text-2xl font-bold text-white">About the Website Design Starter Package</h2>
                            <p className="text-white/70">
                                The Website Design Starter Package from Graveyard Jokes Studios gives you a professional visual foundation for your
                                website before a single line of code is written. For $799, our design team creates detailed wireframes for three to five
                                pages, full-color design mockups in Figma, a brand color palette, and typography recommendations that establish a
                                consistent visual identity across your entire site. You will receive icon set suggestions and two complete rounds of
                                revisions, so the final designs reflect exactly what you are looking for. This package is ideal for clients who already
                                have a developer or want to thoroughly plan their visual direction before committing to full development.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">What Good Design Does for Your Business</h3>
                            <p className="text-white/70">
                                A professionally designed website communicates credibility and trust within the first few seconds a visitor arrives.
                                Users form opinions about websites almost instantly, and those impressions directly influence whether they stay, explore,
                                and ultimately convert into customers or fans. Our design process is rooted in user experience principles, ensuring
                                layouts are intuitive, calls to action are clear, and visual hierarchy guides visitors toward the outcomes you care about.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Why Graveyard Jokes Studios for Design?</h3>
                            <p className="text-white/70">
                                Our design team has experience crafting visual identities for musicians, bands, creative studios, and independent
                                businesses across the United States. We understand that a musician's website needs to feel different from a corporate firm
                                — it should capture energy, personality, and genre. We translate your artistic identity into a visual language that
                                resonates with your audience and sets you apart from every other band or artist in your space.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-white">What format will I receive the designs in?</p>
                                    <p className="text-white/70">All designs are delivered as Figma files, which you can share with any developer or keep as a living reference for your brand going forward. Export assets in any format you need.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">What if I need more than five pages designed?</p>
                                    <p className="text-white/70">If you need more pages, we recommend upgrading to the Design Professional package, which includes a complete UI design system, component library, and four rounds of revisions.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Does this package include development?</p>
                                    <p className="text-white/70">No, this is a design-only package covering wireframes and mockups. If you need development as well, take a look at our Web Development Starter, Professional, or Premium packages.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
