import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function PremiumPackage() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const features = [
        'Everything in Professional',
        'E-commerce/merch store',
        'Event calendar & ticketing',
        'Music/video streaming',
        'Custom animations & effects',
        'API integrations',
        '6 months of support',
        'Priority updates',
    ];

    return (
        <>
            // ...existing code...
            <Head>
                <title>Premium Package - $2,499 | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Premium plan for established teams: full-service web design and development, priority support, advanced integrations, and ongoing strategic guidance."
                />
                <meta
                    name="keywords"
                    content="premium package, e-commerce, merch store, streaming, custom website, API integration, priority support, full-stack development"
                />
                <link rel="canonical" href="https://graveyardjokes.com/services/premium" />
                {/* Open Graph */}
                <meta property="og:title" content="Premium Package - $2,499 | Graveyard Jokes Studios" />
                <meta
                    name="og:description"
                    content="Premium plan for established teams: full-service web design and development, priority support, advanced integrations, and ongoing strategic guidance."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/premium" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Premium Package - $2,499 | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Premium plan for established teams: full-service web design and development, priority support, advanced integrations, and ongoing strategic guidance."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />

                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Web Design",
  "name": "Premium Package",
  "description": "Full-featured solution for serious professionals. E-commerce, streaming, custom integrations, and premium support.",
  "provider": {
    "@type": "Organization",
    "name": "GraveYard Jokes Studios Inc.",
    "url": "https://graveyardjokes.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "2499",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "areaServed": "US",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Premium Package Features",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Everything in Professional" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E-commerce/merch store" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Event calendar & ticketing" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Music/video streaming" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom animations & effects" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "API integrations" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "6 months of support" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Priority updates" } }
    ]
  }
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
                        <h1 className="mb-4 text-4xl font-bold text-white">Premium Package</h1>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-(--primary)">$2,499</span>
                            <p className="mt-2 text-lg text-white/80">
                                Full-featured solution for established startups. E-commerce, streaming, custom integrations, and premium support.
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
                                        <Check className="h-5 w-5 text-(--primary)" />
                                        <span className="text-white">{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-8">
                            <h3 className="mb-4 text-xl font-semibold text-white">Perfect For:</h3>
                            <ul className="space-y-2 text-white/80">
                                <li>• Established businesses needing comprehensive solutions</li>
                                <li>• E-commerce stores with complex requirements</li>
                                <li>• Content creators with streaming needs</li>
                                <li>• Organizations requiring custom integrations</li>
                            </ul>
                        </div>

                        <div className="rounded-lg bg-black/50 p-6">
                            <h3 className="mb-4 text-xl font-semibold text-white">Ready to Get Started?</h3>
                            <p className="mb-6 text-white/80">
                                Complete the short project questionnaire first. Once submitted, payment unlocks instantly for this package.
                            </p>
                            <div className="min-h-[50px]">
                                <PackagePaymentGate amount={2499} item="Premium Package" packageSlug="premium" />
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-12 space-y-8 pb-8">
                        <section>
                            <h2 className="mb-3 text-2xl font-bold text-white">About the Premium Package</h2>
                            <p className="text-white/70">
                                The Premium Package represents the full scope of what Graveyard Jokes Studios can build. At $2,499, this package is
                                designed for established businesses, professional musicians, record labels, and creative organizations that need a
                                comprehensive digital platform rather than a simple website. Building on everything in the Professional Package,
                                Premium adds a fully integrated e-commerce and merchandise store, an event calendar with ticketing capabilities, music
                                and video streaming support, custom animations and interactive effects, and advanced API integrations with third-party
                                platforms.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Who the Premium Package is For</h3>
                            <p className="text-white/70">
                                This tier is built for clients who need their website to function as a complete business tool. If you are running
                                ticket sales for live events, managing a merch store, streaming exclusive content, and coordinating fan communication
                                all from a single platform, the Premium Package delivers. Bands on tour, independent labels managing multiple artists,
                                content creators with subscriber communities, and businesses with complex operational requirements all benefit from
                                the capabilities this package provides.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Our Build Process</h3>
                            <p className="text-white/70">
                                Every Premium project begins with a discovery call where we map out your technical requirements, content strategy, and
                                business goals. From there we move into design, development, integration, and testing phases before a carefully
                                planned launch. Our team handles everything from front-end animation to back-end API configuration, giving you a
                                seamless, polished finished product. Six months of priority support after launch means expert help is always
                                available.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-white">What streaming platforms can you integrate?</p>
                                    <p className="text-white/70">
                                        We can build native audio and video players or integrate with external platforms such as SoundCloud, Vimeo,
                                        and YouTube based on your preferences and audience needs.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">How long does a Premium project take?</p>
                                    <p className="text-white/70">
                                        Premium projects typically run six to ten weeks from start to launch, depending on the scope of integrations
                                        and the complexity of the design and feature set.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">What is included in the six months of priority support?</p>
                                    <p className="text-white/70">
                                        Priority support covers bug fixes, minor feature updates, performance monitoring, and direct access to the
                                        development team for questions and guidance throughout the support period.
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
