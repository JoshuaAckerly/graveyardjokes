import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function StarterPackage() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const features = [
        'Single-page responsive website',
        'Contact form integration',
        'Social media links',
        'Mobile-optimized design',
        'Basic SEO setup',
        '1 month of support',
    ];

    return (
        <>
            <Head>
                <title>Starter Package - $799 | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Starter plan for new businesses: responsive web design, core development features, and a clean, launch-ready website at an affordable monthly cost."
                />
                <meta
                    name="keywords"
                    content="starter package, web design, single page website, startup website, small business website, affordable web design, basic SEO"
                />
                <link rel="canonical" href="https://graveyardjokes.com/services/starter" />
                {/* Open Graph */}
                <meta property="og:title" content="Starter Package - $799 | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Starter plan for new businesses: responsive web design, core development features, and a clean, launch-ready website at an affordable monthly cost."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/starter" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Starter Package - $799 | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Starter plan for new businesses: responsive web design, core development features, and a clean, launch-ready website at an affordable monthly cost."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />
                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Web Design",
  "name": "Starter Package",
  "description": "Perfect for entrepreneurs and creatives launching their online presence. Single-page responsive website with contact form and social media integration.",
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
  "areaServed": "US",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Starter Package Features",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Single-page responsive website" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Contact form integration" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Social media links" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mobile-optimized design" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Basic SEO setup" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "1 month of support" } }
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
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <h1 className="text-4xl font-bold text-white">Starter Package</h1>
                        </div>
                        <div className="mb-2 flex items-baseline gap-3">
                            <span className="text-5xl font-bold text-(--primary)">$799</span>
                        </div>

                        <p className="mb-8 text-lg text-gray-300">Perfect for startups launching their first website</p>
                        <h2 className="mb-4 text-2xl font-bold text-white">What's Included:</h2>
                        <ul className="mb-8 space-y-3">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-200">
                                    <Check className="mt-1 h-6 w-6 shrink-0 text-(--primary)" />
                                    <span className="text-lg">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-gray-700 pt-8">
                            <h2 className="mb-4 text-2xl font-bold text-white">Ready to Get Started?</h2>
                            <p className="mb-6 text-gray-300">
                                Complete the short project questionnaire first. Once submitted, payment unlocks instantly for this package.
                            </p>
                            <div className="mb-6" style={{ minHeight: '45px' }}>
                                <PackagePaymentGate amount={799} item="Starter Package" packageSlug="starter" />
                            </div>
                            <p className="text-sm text-gray-400">
                                Have questions?{' '}
                                <Link href="/contact" className="text-(--primary) hover:underline">
                                    Contact us
                                </Link>
                            </p>
                        </div>
                    </motion.div>

                    <div className="mt-12 space-y-8 pb-8">
                        <section>
                            <h2 className="mb-3 text-2xl font-bold text-white">About the Starter Package</h2>
                            <p className="text-white/70">
                                The Starter Package from Graveyard Jokes Studios is designed for entrepreneurs, musicians, bands, and small business
                                owners who need a polished, professional online presence without a large upfront investment. At $799, this package
                                delivers a fully responsive, single-page website built from scratch — no page builders, no generic templates. Every
                                line of code is written specifically for your brand and your audience. Whether you are a musician launching your first
                                fan page, a local business ready to go digital, or a creative freelancer establishing your portfolio, the Starter
                                Package gives you everything you need to launch with confidence and start building your audience online.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">What You Get</h3>
                            <p className="text-white/70">
                                Your Starter website includes a mobile-first design that looks great on every device from smartphones to widescreen
                                desktops. We integrate a functional contact form so visitors can reach you directly, connect your social media
                                profiles, and set up basic on-page SEO so search engines can index your site from day one. One month of post-launch
                                support is included to handle any questions, minor adjustments, or technical issues that arise after your site goes
                                live.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Why Choose Graveyard Jokes Studios?</h3>
                            <p className="text-white/70">
                                Graveyard Jokes Studios is a full-service digital agency based in Cheektowaga, New York, specializing in custom
                                websites for independent artists, musicians, bands, and creative entrepreneurs across the United States. Unlike
                                agencies that rely on drag-and-drop page builders, every site we build is hand-coded using modern frameworks — meaning
                                faster load times, better SEO performance, and a unique look that generic templates simply cannot deliver. We work
                                closely with every client to translate their vision into a website that genuinely represents their brand.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-white">How long does the Starter Package take to complete?</p>
                                    <p className="text-white/70">
                                        Most Starter websites are completed within two to four weeks from the date we receive your project
                                        questionnaire and initial payment. The exact timeline depends on how quickly we receive your content including
                                        text, images, and branding materials.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Can I upgrade to a larger package later?</p>
                                    <p className="text-white/70">
                                        Absolutely. Our packages are designed to grow with your business. If you start with the Starter Package and
                                        later need more pages, e-commerce, or advanced features, you can upgrade to the Professional or Premium
                                        package at any time.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Do I need to provide my own hosting?</p>
                                    <p className="text-white/70">
                                        For the Starter Package, you will need to arrange your own hosting. We are happy to recommend reliable
                                        providers and help you get set up. Our Professional and Premium packages include one year of free hosting and
                                        support.
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
